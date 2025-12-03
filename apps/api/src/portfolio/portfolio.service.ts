/** biome-ignore-all lint/suspicious/noAssignInExpressions: <ok> */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type {
	Portfolio,
	PortfolioRole,
	Prisma,
	PrismaClient,
} from '@prisma/client';
import Decimal from 'decimal.js';
import { sql } from 'kysely';
import type { ClerkClaims } from '~/auth/types';
import {
	type HarvestLotCurrent,
	type LotCurrent,
	LotValueType,
} from '~/lot/lot.dto';
import { taxAdvantadedSubTypes } from '~/plaid/plaid.utils';
import { RealizedPandLService } from '~/realized-p-and-l/realized-p-and-l.service';
import { AccountService } from '../account/account.service';
import { ClerkService } from '../clerk/clerk.service';
import { Database } from '../database/database';
import { HarvestType } from '../generated/graphql';
import { HarvestService } from '../harvest/harvest.service';
import { LotService } from '../lot/lot.service';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';
import {
	type DirectedHarvestLot,
	type HarvestEvalResult,
	type HarvestResult,
	type PortfolioSummary,
	type PortfolioSummaryRealized,
	type PortfolioSummaryUnrealized,
	SetUpStatus,
} from './portfolio.dto';
import Harvest, { type LotHarvestInput } from './portfolio.harvest';

@Injectable()
export class PortfolioService {
	constructor(
		private readonly db: Database,
		private readonly lotService: LotService,
		readonly _harvestService: HarvestService,
		private readonly userService: UserService,
		private readonly clerkService: ClerkService,
		private readonly prismaService: PrismaService,
		private readonly configService: ConfigService,
		private readonly accountService: AccountService,
		private readonly realizedPAndLService: RealizedPandLService,
	) {}

	getPortfoliosByUserId(userId: string, args: Prisma.PortfolioFindManyArgs) {
		return this.prismaService.rlsBypassClient().portfolio.findMany({
			...args,
			select: undefined, // dont allow nested seelct due to RLS bypass
			where: {
				usersOnPortfolios: {
					some: {
						userId,
					},
				},
			},
		});
	}

	async switchPortfolio(clerkContext: ClerkClaims, portfolioId: string) {
		const portfolio = await this.getPortfolioById(portfolioId);

		await this.clerkService.updatePublicMetaData(clerkContext.sub, {
			...clerkContext.metadata,
			portfolioId: portfolio.id,
		});

		return portfolio;
	}

	/**
	 * Special portfolio query that will create or reset a users portfolio
	 * in clerk if they do not have a default portfolio
	 * i.e. a user logs in for the first time or their default protfolio has been deleted
	 */
	async getPortfolioAndAssertUserExistsAndHasPortfolio(
		userId: string,
		portfolioId?: string,
	) {
		const user = await this.userService.asserUserExists(userId);
		return this.prismaService
			.rlsBypassClient()
			.portfolio.findUniqueOrThrow({
				where: {
					id: portfolioId,
					usersOnPortfolios: {
						some: {
							userId: user.id,
						},
					},
				},
			})
			.catch(() => this.assertUserHasDefaultPortfolio(user.id, portfolioId));
	}

	getPortfolioByPortfolioId(
		userId: string,
		portfolioId: string,
		select: Prisma.PortfolioSelect,
	) {
		return (
			this.prismaService.$extends(
				PrismaService.forPortfolio(portfolioId),
			) as unknown as PrismaClient
		).portfolio.findFirstOrThrow({
			select,
			where: {
				id: portfolioId,
				// Enforce user has access to the portfolio
				usersOnPortfolios: {
					some: {
						userId,
					},
				},
			},
		});
	}

	getPortfolioById(portfolioId: string) {
		return this.db.transaction().execute(async (trx) => {
			await sql`SELECT set_config('app.current_portfolio_id', ${portfolioId}::text, TRUE)`.execute(
				trx,
			);

			return await trx
				.selectFrom('Portfolio')
				.selectAll()
				.where('Portfolio.id', '=', portfolioId)
				.executeTakeFirstOrThrow();
		});
	}

	getPortfolioByIdWithUserId(
		id: string,
		userId: string,
		select: Prisma.PortfolioSelect,
	) {
		return (
			this.prismaService.$extends(
				PrismaService.forPortfolio(id),
			) as unknown as PrismaClient
		).portfolio.findUniqueOrThrow({
			select,
			where: {
				id,
				usersOnPortfolios: {
					some: {
						userId,
					},
				},
			},
		});
	}

	async createPortfolio(
		clerkContext: ClerkClaims,
		portfolioCreateInput: Prisma.PortfolioCreateInput,
		role?: PortfolioRole,
	) {
		const portfolio = await this.prismaService
			.$extends(PrismaService.bypassRLS())
			.portfolio.create({
				data: {
					...portfolioCreateInput,
					usersOnPortfolios: {
						create: {
							role,
							userId: clerkContext.sub,
						},
					},
				},
			});

		await this.clerkService.updatePublicMetaData(clerkContext.sub, {
			...clerkContext.metadata,
			portfolioId: portfolio.id,
		});

		return portfolio;
	}

	/**
	 * Ensures that a clerk user exists in the DB and has at least one portfolio
	 * Creates the portfolio if needed
	 * @param userId
	 * @param portfolioId
	 * @returns Portfolio
	 */
	async assertUserHasDefaultPortfolio(
		userId: string,
		portfolioId?: string,
	): Promise<Portfolio> {
		const portfolio = await this.prismaService
			.$extends(PrismaService.bypassRLS())
			.portfolio.findFirst({
				where: {
					usersOnPortfolios: {
						some: {
							portfolioId: {
								equals: portfolioId,
							},
							userId: {
								equals: userId,
							},
						},
					},
				},
			});

		let authedPortfolio = portfolio;
		// If the user does not have at least 1 portfolio we create it and connect them to it as an admin
		if (!portfolio) {
			authedPortfolio = await this.prismaService
				.$extends(PrismaService.bypassRLS())
				.portfolio.create({
					data: {
						createdById: userId,
						id: portfolioId,
						usersOnPortfolios: {
							create: {
								role: 'ADMIN',
								userId,
							},
						},
					},
				})
				.catch(() => {
					throw new Error('Unauthorized access to portfolio');
				});
		}

		if (!authedPortfolio) {
			throw new Error('Unauthorized access to portfolio');
		}

		const clerkUser = await this.clerkService.user(userId);
		// Set the portfolio on the clerk meta data so they are authed for it
		await this.clerkService.updatePublicMetaData(userId, {
			...clerkUser.publicMetadata,
			portfolioId: authedPortfolio.id,
		});

		return authedPortfolio;
	}

	async summary({ id }: { id: string }): Promise<PortfolioSummary> {
		const [realized, currentLots, accounts, setupAccounts] = await Promise.all([
			this.realizedPAndLService.porfolioRealizedPAndL({ portfolioId: id }),
			this.lotService.lotCurrent({ portfolioId: id }),
			this.prismaService.rlsPortfolioClient(id).account.count({
				where: {
					...PortfolioService.RELEVANT_HARVEST_ACCOUNTS_WHERE({
						portfolioId: id,
					}),
				},
			}),
			this.accountService.setupAccounts({
				id,
				select: {
					id: true,
				},
			}),
		]);

		const summaryCurrentLots = this.lotService.summaryCurrentLots(currentLots);

		const shortTermCapitalGainWithHarvest = new Decimal(
			realized.shortTermCapitalGain,
		).plus(summaryCurrentLots.realizedShortTermDollarChangeFromCurrentHarvest);
		const longTermCapitalGainWithHarvest = new Decimal(
			realized.longTermCapitalGain,
		).plus(summaryCurrentLots.realizedLongTermDollarChangeFromCurrentHarvest);

		// Calculate estimated tax bill for current realized values
		const estimatedTaxBill =
			this.realizedPAndLService.calculateEstimatedTaxBill(realized);

		// Calculate estimated tax bill including current harvest
		const realizedWithHarvest = {
			...realized,
			gainTotal: new Decimal(realized.gainTotal)
				.plus(shortTermCapitalGainWithHarvest)
				.plus(longTermCapitalGainWithHarvest)
				.toNumber(),
			shortTermCapitalGain: shortTermCapitalGainWithHarvest.toNumber(),
			longTermCapitalGain: longTermCapitalGainWithHarvest.toNumber(),
		};
		const estimatedTaxBillWithHarvest =
			this.realizedPAndLService.calculateEstimatedTaxBill(realizedWithHarvest);

		return {
			...PortfolioService.calculateHarvest({
				realized: {
					...realized,
					estimatedTaxBill,
				},
				unrealized: {
					gainTotal: summaryCurrentLots.gainTotal,
					lossTotal: summaryCurrentLots.lossTotal,
					accountCount: summaryCurrentLots.accountCount,
					total: summaryCurrentLots.totalUnrealized,
					positionCount: summaryCurrentLots.positionCount,
				},
			}),
			includingCurrentHarvest: {
				...PortfolioService.calculateHarvest({
					realized: {
						...realizedWithHarvest,
						estimatedTaxBill: estimatedTaxBillWithHarvest,
					},
					unrealized: {
						gainTotal: summaryCurrentLots.unrealizedGainTotalWithCurrentHarvest,
						lossTotal: summaryCurrentLots.unrealizedLossTotalWithCurrentHarvest,
						accountCount: summaryCurrentLots.accountCount,
						total: summaryCurrentLots.totalUnrealizedWithCurrentHarvest,
						positionCount: summaryCurrentLots.positionCount,
					},
				}),
			},
			setUpStatus:
				accounts === 0
					? SetUpStatus.NO_ACCOUNTS
					: setupAccounts.length > 0
						? SetUpStatus.ACCOUNT_SETUP_REQUIRED
						: SetUpStatus.COMPLETE,
		};
	}

	static calculateHarvest({
		realized,
		unrealized,
	}: {
		realized: PortfolioSummaryRealized;
		unrealized: PortfolioSummaryUnrealized;
	}): Omit<PortfolioSummary, 'setUpStatus' | 'includingCurrentHarvest'> {
		let gainTotalUnrealized = new Decimal(unrealized.gainTotal);
		let lossTotalUnrealized = new Decimal(unrealized.lossTotal);
		const gainTotalRealized = new Decimal(realized.gainTotal);

		const realizedSign = Math.sign(gainTotalRealized.toNumber());

		const harvest = {
			realized: new Decimal(0),
			total: new Decimal(0),
			unrealized: new Decimal(0),
		};

		// Figure out the realized amount and reset unrealized for that amount
		if (realizedSign === -1) {
			if (
				gainTotalRealized.absoluteValue().toNumber() >
				gainTotalUnrealized.absoluteValue().toNumber()
			) {
				harvest.realized = gainTotalUnrealized;
				gainTotalUnrealized = new Decimal(0);
			} else {
				harvest.realized = gainTotalRealized.times(-1);
				gainTotalUnrealized = gainTotalUnrealized.plus(gainTotalRealized);
			}
		} else if (realizedSign === 1) {
			if (
				gainTotalRealized.absoluteValue().toNumber() >
				lossTotalUnrealized.absoluteValue().toNumber()
			) {
				harvest.realized = lossTotalUnrealized;
				lossTotalUnrealized = new Decimal(0);
			} else {
				harvest.realized = gainTotalRealized.times(-1);
				lossTotalUnrealized = lossTotalUnrealized.plus(gainTotalRealized);
			}
		}

		harvest.unrealized = gainTotalUnrealized.greaterThan(
			lossTotalUnrealized.absoluteValue(),
		)
			? lossTotalUnrealized
			: gainTotalUnrealized;

		harvest.total = harvest.realized
			.absoluteValue()
			.add(harvest.unrealized.absoluteValue());

		const summary = {
			harvest: {
				realized: harvest.realized.toNumber(),
				total: harvest.total.toNumber(),
				unrealized: harvest.unrealized.toNumber(),
			},
			realized,
			unrealized,
		};

		return summary;
	}

	/**
	 * General Portfolio Harvest
	 *
	 * Looks over all lots in a portoflio and tries to harvest all possible realized and unrealized gains
	 */
	async harvest({
		portfolioId,
	}: {
		portfolioId: string;
	}): Promise<HarvestResult> {
		const [portfolioSummary, lots, portfolio] = await Promise.all([
			this.summary({
				id: portfolioId,
			}),
			this.lotService.lotCurrent({ portfolioId }),
			this.prismaService
				.rlsPortfolioClient(portfolioId)
				.portfolio.findUniqueOrThrow({
					where: {
						id: portfolioId,
					},
				}),
		]);

		const harvest = new Harvest({
			lots: lots.map(
				(lot) =>
					({
						...lot,
						accountId: lot.accountId,
						originalQty: lot.remainingQty,
						processQty: lot.remainingQty,
					}) as LotHarvestInput,
			),
			portfolio,
			targetRealized: portfolioSummary.harvest.realized,
			targetUnrealized: portfolioSummary.harvest.unrealized,
		});

		harvest.process();

		return {
			allOrders: harvest.allOrders,
			portfolioSummary,
			realizedOrders: harvest.realizedOrders,
			unrealizedOrders: harvest.unrealizedOrders,
			// biome-ignore lint/style/noNonNullAssertion: <ok>
			neutralHarvestTarget: this.configService.get<number>(
				'NUETRAL_HARVEST_TARGET',
			)!,
		};
	}

	async directedHarvest({
		directedLots,
		portfolioId,
		targetRealized,
		targetUnrealized,
	}: {
		portfolioId: string;
		directedLots: DirectedHarvestLot[];
		targetRealized: number;
		targetUnrealized: number;
	}) {
		const [portfolio, lots] = await Promise.all([
			this.prismaService
				.rlsPortfolioClient(portfolioId)
				.portfolio.findUniqueOrThrow({
					where: {
						id: portfolioId,
					},
				}),
			this.lotService.lotCurrent({
				lotIds: directedLots.map((lot) => lot.lotId),
				portfolioId,
			}),
		]);

		const harvest = new Harvest({
			lots: lots.map((lot) => {
				const qty =
					directedLots.find((dl) => dl.lotId === lot.id)?.quantity ?? '0';
				return {
					...lot,
					accountId: lot.accountId,
					originalQty: qty,
					processQty: qty,
				} as LotHarvestInput;
			}),
			portfolio,
			targetRealized,
			targetUnrealized,
		});

		harvest.process();

		return {
			allOrders: harvest.allOrders,
			realizedOrders: harvest.realizedOrders,
			unrealizedOrders: harvest.unrealizedOrders,
			// biome-ignore lint/style/noNonNullAssertion: <ok>
			neutralHarvestTarget: this.configService.get<number>(
				'NUETRAL_HARVEST_TARGET',
			)!,
		};
	}

	async getUniqueAssetSymbols({
		portfolioId,
	}: {
		portfolioId: string;
	}): Promise<string[]> {
		const lots = await this.lotService.lotCurrent({ portfolioId });
		const uniqueSymbols = [...new Set(lots.map((lot) => lot.symbol))];
		return uniqueSymbols.sort();
	}

	async harvestEval({
		portfolioId,
		filters,
	}: {
		portfolioId: string;
		filters?: {
			minPAndL?: number;
			excludeLotIds?: string[];
			exludeAssetSymbols?: string[];
			purchaseDateBefore?: Date;
			purchaseDateAfter?: Date;
		};
	}): Promise<HarvestEvalResult> {
		// biome-ignore lint/style/noNonNullAssertion: <ok>
		const neutralHarvestTarget = this.configService.get<number>(
			'NUETRAL_HARVEST_TARGET',
		)!;

		const portfolio = await this.prismaService
			.rlsPortfolioClient(portfolioId)
			.portfolio.findUniqueOrThrow({
				where: {
					id: portfolioId,
				},
			});

		const [summary, lots, uniqueAssetSymbols] = await Promise.all([
			this.summary({
				id: portfolioId,
			}),
			this.lotService.lotCurrent({
				portfolioId,
				excludeLotIds: filters?.excludeLotIds,
				exludeAssetSymbols: filters?.exludeAssetSymbols,
				purchaseDateBefore: filters?.purchaseDateBefore,
				purchaseDateAfter: filters?.purchaseDateAfter,
			}),
			this.getUniqueAssetSymbols({ portfolioId }),
			this.prismaService
				.rlsPortfolioClient(portfolioId)
				.portfolio.findUniqueOrThrow({
					where: {
						id: portfolioId,
					},
				}),
		]);

		const harvestType = this.harvestType({
			realizedGainTotal: summary.includingCurrentHarvest.realized.gainTotal,
			unrealizedGainTotal: summary.includingCurrentHarvest.unrealized.gainTotal,
			unrealizedLossTotal: summary.includingCurrentHarvest.unrealized.lossTotal,
		});

		switch (harvestType) {
			case HarvestType.NO_OPPORTUNITY_EMPTY:
			case HarvestType.NO_OPPORTUNITY_GAINS:
			case HarvestType.NO_OPPORTUNITY_LOSSES: {
				return {
					harvestType,
					summary,
					totalHarvestLots: 0,
					uniqueAssetSymbols,
					neutralHarvestTarget,
					remainingHarvestTarget:
						neutralHarvestTarget -
						summary.includingCurrentHarvest.realized.gainTotal,
				};
			}
			case HarvestType.REDUCE_COST_BASIS: {
				// Goal is to match lots - all we need to do is orgnaize them into source (limiting side) and potential matches
				const sourceLots: LotCurrent[] = [];
				const matchingLots: LotCurrent[] = [];

				// Filter lots to only include those with available quantity > 0
				const availableLots = lots.filter((lot) =>
					new Decimal(lot.availableQty).greaterThan(0),
				);

				// Organize the lots depending on the unrealized gain and loss
				for (const lot of availableLots) {
					if (
						Math.abs(summary.unrealized.gainTotal) >
						Math.abs(summary.unrealized.lossTotal)
					) {
						// more gain than loss so losers are the source
						if (Number(lot.gainTotal) < 0) {
							sourceLots.push(lot);
						} else {
							matchingLots.push(lot);
						}
					} else {
						// more loss than gain so winners are the source
						if (Number(lot.gainTotal) > 0) {
							sourceLots.push(lot);
						} else {
							matchingLots.push(lot);
						}
					}
				}

				const matchedItems = PortfolioService.matchLots({
					sourceLots: sourceLots.map((lot) => [lot]),
					matchingLots: matchingLots.map((lot) => [lot]),
					resultFilters: {
						minPAndL: filters?.minPAndL,
						maxPercentageDifference: Number(
							// biome-ignore lint/style/noNonNullAssertion: <ok>
							this.configService.get('MATCH_PERCENTAGE_DIFFERENCE')!,
						),
					},
				});

				return {
					matchedItems: matchedItems
						.map((pairs) => ({
							id: pairs[0].sourceLots.map((lot) => lot.id).join('-'),
							pairs,
						}))
						.sort((a, b) => {
							const aNetPnL = Math.abs(a.pairs[0].sourceHarvestPAndL);
							const bNetPnL = Math.abs(b.pairs[0].sourceHarvestPAndL);
							return bNetPnL - aNetPnL;
						}),
					harvestType,
					summary,
					totalHarvestLots: 0,
					uniqueAssetSymbols,
					neutralHarvestTarget,
					remainingHarvestTarget:
						neutralHarvestTarget -
						summary.includingCurrentHarvest.realized.gainTotal,
				};
			}
			case HarvestType.REDUCE_TAXES: // High realized gain or loss so we want to reduce that numberas much as possible by selling losses
			case HarvestType.CAPTURE_GAINS_TAX_FREE: {
				// High realized gain or loss so we want to reduce that numberas much as possible by selling the opposite side
				const directedLots = await this.lotService.lotCurrent({
					portfolioId,
					lotValueType:
						HarvestType.REDUCE_TAXES === harvestType
							? LotValueType.LOSS
							: LotValueType.GAIN,
					minTotalPAndL: new Decimal(portfolio.minimumLotPAndL),
					excludeLotIds: filters?.excludeLotIds,
					exludeAssetSymbols: filters?.exludeAssetSymbols,
					purchaseDateBefore: filters?.purchaseDateBefore,
					purchaseDateAfter: filters?.purchaseDateAfter,
				});

				// Filter to only include lots with available quantity > 0
				const availableDirectedLots = directedLots
					.filter((lot) => new Decimal(lot.availableQty).greaterThan(0))
					.sort((a, b) => {
						const aPnL = new Decimal(a.dollarPerSharePnL)
							.mul(a.availableQty)
							.abs();
						const bPnL = new Decimal(b.dollarPerSharePnL)
							.mul(b.availableQty)
							.abs();
						return bPnL.minus(aPnL).toNumber();
					});

				return {
					summary,
					lotsCurrent: availableDirectedLots,
					harvestType,
					totalHarvestLots: availableDirectedLots.length,
					uniqueAssetSymbols,
					neutralHarvestTarget,
					remainingHarvestTarget:
						neutralHarvestTarget -
						summary.includingCurrentHarvest.realized.gainTotal,
				};
			}
		}

		return {
			harvestType,
			summary,
			totalHarvestLots: 0,
			uniqueAssetSymbols,
			neutralHarvestTarget,
			remainingHarvestTarget:
				neutralHarvestTarget -
				summary.includingCurrentHarvest.realized.gainTotal,
		};
	}

	// Optimization problem for getting source lots P&L as close to the matched lots P&L as possible
	static matchLots({
		sourceLots,
		matchingLots,
		resultFilters,
	}: {
		sourceLots: LotCurrent[][];
		matchingLots: LotCurrent[][];
		resultFilters?: {
			minPAndL?: number;
			maxPercentageDifference?: number;
		};
	}): {
		sourceLots: HarvestLotCurrent[];
		sourceHarvestPAndL: number;
		matchedHarvestPAndL: number;
		matchedLots: HarvestLotCurrent[];
	}[][] {
		const results: {
			sourceLots: HarvestLotCurrent[];
			sourceHarvestPAndL: number;
			matchedHarvestPAndL: number;
			matchedLots: HarvestLotCurrent[];
		}[][] = [];

		// Pre-filter source lots based on minPAndL constraint for efficiency
		const filteredSourceLots = resultFilters?.minPAndL
			? sourceLots.filter((sourceRow) => {
					const sourceTotalPnL = sourceRow.reduce((sum, lot) => {
						const pnlPerShare = new Decimal(lot.dollarPerSharePnL);
						const lotPnL = pnlPerShare.mul(lot.availableQty);
						return sum.plus(lotPnL);
					}, new Decimal(0));
					return (
						sourceTotalPnL
							.abs()
							// biome-ignore lint/style/noNonNullAssertion: <ok>
							.greaterThanOrEqualTo(resultFilters.minPAndL!)
					);
				})
			: sourceLots;

		for (const sourceRow of filteredSourceLots) {
			const sourceRowResults: {
				sourceLots: HarvestLotCurrent[];
				sourceHarvestPAndL: number;
				matchedHarvestPAndL: number;
				matchedLots: HarvestLotCurrent[];
			}[] = [];

			// Calculate total P&L for this source row using available shares
			const sourceTotalPnL = sourceRow.reduce((sum, lot) => {
				const pnlPerShare = new Decimal(lot.dollarPerSharePnL);
				const lotPnL = pnlPerShare.mul(lot.availableQty);
				return sum.plus(lotPnL);
			}, new Decimal(0));

			// Target P&L is the opposite of source P&L
			const targetPnL = sourceTotalPnL.negated();

			// Evaluate each matching lot row separately and record all combinations
			for (const matchingRow of matchingLots) {
				// Calculate total P&L for this matching row using available shares
				const matchingTotalPnL = matchingRow.reduce((sum, lot) => {
					const pnlPerShare = new Decimal(lot.dollarPerSharePnL);
					const lotPnL = pnlPerShare.mul(lot.availableQty);
					return sum.plus(lotPnL);
				}, new Decimal(0));

				if (matchingTotalPnL.equals(0)) continue;

				let optimizedSourceLots: HarvestLotCurrent[];
				let optimizedMatchingLots: HarvestLotCurrent[];

				// Strategy: Use whole number shares and choose the scenario that gets closest to target P&L
				// Scenario A: Adjust matching lot shares to match source P&L (using whole shares)
				// Scenario B: Adjust source lot shares to match what matching lots can provide (using whole shares)

				if (matchingTotalPnL.abs().greaterThanOrEqualTo(targetPnL.abs())) {
					// Scenario A: Matching lots have enough P&L capacity, calculate whole shares needed
					optimizedSourceLots = sourceRow.map((lot) => ({
						...lot,
						harvestQuantity: lot.availableQty.toString(),
						harvestPAndL: new Decimal(lot.dollarPerSharePnL)
							.mul(lot.availableQty)
							.toNumber(),
					}));

					// Calculate how many whole shares we need from matching lots to get close to target P&L
					let remainingTargetPnL = targetPnL.abs();
					optimizedMatchingLots = matchingRow.map((lot) => {
						const pnlPerShare = new Decimal(lot.dollarPerSharePnL).abs();

						if (
							remainingTargetPnL.equals(0) ||
							pnlPerShare.equals(0) ||
							new Decimal(lot.availableQty).equals(0)
						) {
							return {
								...lot,
								harvestQuantity: '0',
								harvestPAndL: 0,
							};
						}

						// Calculate ideal shares needed, then round to nearest whole number
						const idealShares = remainingTargetPnL.dividedBy(pnlPerShare);
						const wholeShares = new Decimal(Math.round(idealShares.toNumber()));
						const actualShares = Decimal.min(wholeShares, lot.availableQty);
						const actualPnL = actualShares.mul(
							new Decimal(lot.dollarPerSharePnL),
						);

						// Update remaining target for next lot
						remainingTargetPnL = remainingTargetPnL.minus(actualPnL.abs());
						if (remainingTargetPnL.lessThan(0))
							remainingTargetPnL = new Decimal(0);

						return {
							...lot,
							harvestQuantity: actualShares.toString(),
							harvestPAndL: actualPnL.toNumber(),
						};
					});
				} else {
					// Scenario B: Use all available shares from matching lots, adjust source lots to whole shares
					optimizedMatchingLots = matchingRow.map((lot) => ({
						...lot,
						harvestQuantity: lot.availableQty.toString(),
						harvestPAndL: new Decimal(lot.dollarPerSharePnL)
							.mul(lot.availableQty)
							.toNumber(),
					}));

					// Calculate how many whole shares we need from source lots to match available matching P&L
					let remainingMatchingPnL = matchingTotalPnL.abs();
					optimizedSourceLots = sourceRow.map((lot) => {
						const pnlPerShare = new Decimal(lot.dollarPerSharePnL).abs();

						if (
							remainingMatchingPnL.equals(0) ||
							pnlPerShare.equals(0) ||
							new Decimal(lot.availableQty).equals(0)
						) {
							return {
								...lot,
								harvestQuantity: '0',
								harvestPAndL: 0,
							};
						}

						// Calculate ideal shares needed, then round to nearest whole number
						const idealShares = remainingMatchingPnL.dividedBy(pnlPerShare);
						const wholeShares = new Decimal(Math.round(idealShares.toNumber()));
						const actualShares = Decimal.min(wholeShares, lot.availableQty);
						const actualPnL = actualShares.mul(
							new Decimal(lot.dollarPerSharePnL),
						);

						// Update remaining target for next lot
						remainingMatchingPnL = remainingMatchingPnL.minus(actualPnL.abs());
						if (remainingMatchingPnL.lessThan(0))
							remainingMatchingPnL = new Decimal(0);

						return {
							...lot,
							harvestQuantity: actualShares.toString(),
							harvestPAndL: actualPnL.toNumber(),
						};
					});
				}

				// Calculate P&L totals for this combination
				const sourceHarvestPAndL = optimizedSourceLots.reduce(
					(sum, lot) => sum + lot.harvestPAndL,
					0,
				);
				const matchedHarvestPAndL = optimizedMatchingLots.reduce(
					(sum, lot) => sum + lot.harvestPAndL,
					0,
				);

				// Filter out results with zero harvest quantities - no point in returning lots with 0 shares to harvest
				const hasNonZeroHarvestQuantities =
					optimizedSourceLots.every((lot) => Number(lot.harvestQuantity) > 0) &&
					optimizedMatchingLots.every((lot) => Number(lot.harvestQuantity) > 0);

				// Apply minPAndL filter to matched results - only add if both source and matched meet minimum
				const meetsMinPAndL =
					!resultFilters?.minPAndL ||
					(Math.abs(sourceHarvestPAndL) >= resultFilters.minPAndL &&
						Math.abs(matchedHarvestPAndL) >= resultFilters.minPAndL);

				// Apply maxPercentageDifference filter
				const meetsPercentageDifference =
					!resultFilters?.maxPercentageDifference ||
					(() => {
						const diff = Math.abs(
							Math.abs(sourceHarvestPAndL) - Math.abs(matchedHarvestPAndL),
						);
						const maxValue = Math.max(
							Math.abs(sourceHarvestPAndL),
							Math.abs(matchedHarvestPAndL),
						);

						// Avoid division by zero - if both values are zero, consider them as matching (0% difference)
						if (maxValue === 0) return true;

						const percentageDiff = (diff / maxValue) * 100;
						return percentageDiff <= resultFilters.maxPercentageDifference;
					})();

				if (
					hasNonZeroHarvestQuantities &&
					meetsMinPAndL &&
					meetsPercentageDifference
				) {
					sourceRowResults.push({
						sourceLots: optimizedSourceLots,
						sourceHarvestPAndL,
						matchedHarvestPAndL,
						matchedLots: optimizedMatchingLots,
					});
				}
			}

			// Add source row results to main results if any combinations found
			if (sourceRowResults.length > 0) {
				// sort by net P&L
				results.push(
					sourceRowResults.sort((a, b) => {
						const aNetPnL = Math.abs(a.sourceHarvestPAndL);
						const bNetPnL = Math.abs(b.sourceHarvestPAndL);
						return bNetPnL - aNetPnL;
					}),
				);
			}
		}

		return results;
	}

	harvestType({
		realizedGainTotal,
		unrealizedGainTotal,
		unrealizedLossTotal,
	}: {
		realizedGainTotal: number;
		unrealizedGainTotal: number;
		unrealizedLossTotal: number;
	}): HarvestType {
		// biome-ignore lint/style/noNonNullAssertion: <ok>
		const target = this.configService.get<number>('NUETRAL_HARVEST_TARGET')!;
		const combined =
			Math.abs(unrealizedGainTotal) +
			Math.abs(unrealizedLossTotal) +
			Math.abs(realizedGainTotal);
		if (combined === target || combined === 0) {
			return HarvestType.NO_OPPORTUNITY_EMPTY;
		} else if (unrealizedGainTotal <= 0 && realizedGainTotal <= target) {
			return HarvestType.NO_OPPORTUNITY_LOSSES;
		} else if (unrealizedLossTotal >= 0 && realizedGainTotal >= target) {
			return HarvestType.NO_OPPORTUNITY_GAINS;
		}

		return Math.abs(Math.abs(realizedGainTotal) - Math.abs(target)) <=
			Math.abs(
				// biome-ignore lint/style/noNonNullAssertion: <ok>
				this.configService.get('NUETRAL_HARVEST_THRESHOLD')!,
			)
			? HarvestType.REDUCE_COST_BASIS
			: realizedGainTotal > target
				? HarvestType.REDUCE_TAXES
				: HarvestType.CAPTURE_GAINS_TAX_FREE;
	}

	// async finiteHarvest({
	// 	portfolioId,
	// }: {
	// 	portfolioId: string;
	// }): Promise<FiniteHarvestResult> {
	// 	const portfolio = await this.prismaService
	// 		.rlsPortfolioClient(portfolioId)
	// 		.portfolio.findUniqueOrThrow({
	// 			where: {
	// 				id: portfolioId,
	// 			},
	// 		});

	// 	const [summary, lots] = await Promise.all([
	// 		this.summary({
	// 			id: portfolioId,
	// 		}),
	// 		this.lotService.lotCurrent({
	// 			portfolioId,
	// 			minTotalPAndL: new Decimal(portfolio.minimumLotPAndL),
	// 		}),
	// 		this.prismaService
	// 			.rlsPortfolioClient(portfolioId)
	// 			.portfolio.findUniqueOrThrow({
	// 				where: {
	// 					id: portfolioId,
	// 				},
	// 			}),
	// 	]);

	// 	const harvestType =
	// 		Math.abs(summary.realized.gainTotal) <=
	// 		// biome-ignore lint/style/noNonNullAssertion: <ok>
	// 		Math.abs(this.configService.get('NUETRAL_HARVEST_THRESHOLD')!)
	// 			? HarvestType.REDUCE_COST_BASIS
	// 			: summary.realized.gainTotal > 0
	// 				? HarvestType.REDUCE_TAXES
	// 				: HarvestType.CAPTURE_GAINS_TAX_FREE;

	// 	// biome-ignore lint/style/noNonNullAssertion: <ok>
	// 	const NUETRAL_HARVEST_TARGET = this.configService.get<number>(
	// 		'NUETRAL_HARVEST_TARGET',
	// 	)!;

	// 	switch (harvestType) {
	// 		case HarvestType.REDUCE_COST_BASIS: {
	// 			// Netrual realized gain or loss so we want to match lots (unrelaized) by gain and loss to offset each other
	// 			const sourceLots: LotCurrent[] = [];
	// 			const matchingLots: LotCurrent[] = [];

	// 			// Filter lots to only include those with available quantity > 0
	// 			const availableLots = lots.filter((lot) =>
	// 				new Decimal(lot.availableQty).greaterThan(0),
	// 			);

	// 			// Organize the lots depending on the unrealized gain and loss
	// 			for (const lot of availableLots) {
	// 				if (summary.unrealized.gainTotal > summary.unrealized.lossTotal) {
	// 					// more gain than loss so losers are the source
	// 					if (Number(lot.gainTotal) < 0) {
	// 						sourceLots.push(lot);
	// 					} else {
	// 						matchingLots.push(lot);
	// 					}
	// 				} else {
	// 					// more loss than gain so winners are the source
	// 					if (Number(lot.gainTotal) > 0) {
	// 						sourceLots.push(lot);
	// 					} else {
	// 						matchingLots.push(lot);
	// 					}
	// 				}
	// 			}

	// 			const unrealizedHarvestMatchResults: {
	// 				sourceLot: LotCurrent;
	// 				matchedLotOrders: HarvestLotOrder[];
	// 			}[] = [];

	// 			const harvest = new Harvest({
	// 				lots: matchingLots.map((lot) => {
	// 					return {
	// 						...lot,
	// 						originalQty: lot.remainingQty,
	// 						processQty: lot.remainingQty,
	// 					} satisfies LotHarvestInput;
	// 				}),
	// 				portfolio,
	// 				targetRealized: 0,
	// 				targetUnrealized: 0,
	// 			});

	// 			for (const sourceLot of sourceLots) {
	// 				harvest.targetUnrealized = new Decimal(sourceLot.gainTotal).mul(-1);
	// 				harvest.process();

	// 				// Only add the harvest if we have orders to process otherwise its a no op
	// 				if (harvest.allOrders.length > 0) {
	// 					unrealizedHarvestMatchResults.push({
	// 						sourceLot,
	// 						matchedLotOrders: harvest.allOrders,
	// 					});
	// 				}
	// 			}

	// 			return {
	// 				harvestType,
	// 				unrealizedHarvestMatchResults,
	// 				summary,
	// 				totalHarvestLots: 0,
	// 				neutralHarvestTarget: NUETRAL_HARVEST_TARGET,
	// 				targetHarvestDiffAmount: Math.abs(
	// 					NUETRAL_HARVEST_TARGET - summary.realized.gainTotal,
	// 				),
	// 			};
	// 		}
	// 		case HarvestType.REDUCE_TAXES: // High realized gain or loss so we want to reduce that numberas much as possible by selling losses
	// 		case HarvestType.CAPTURE_GAINS_TAX_FREE: {
	// 			// High realized gain or loss so we want to reduce that numberas much as possible by selling losses
	// 			const directedLots = await this.lotService.lotCurrent({
	// 				portfolioId,
	// 				lotValueType:
	// 					HarvestType.REDUCE_TAXES === harvestType
	// 						? LotValueType.LOSS
	// 						: LotValueType.GAIN,
	// 				minTotalPAndL: new Decimal(portfolio.minimumLotPAndL),
	// 			});

	// 			// Filter to only include lots with available quantity > 0
	// 			const availableDirectedLots = directedLots.filter((lot) =>
	// 				new Decimal(lot.availableQty).greaterThan(0),
	// 			);

	// 			return {
	// 				summary,
	// 				lotsCurrent: availableDirectedLots,
	// 				harvestType,
	// 				totalHarvestLots: availableDirectedLots.length,
	// 				neutralHarvestTarget: NUETRAL_HARVEST_TARGET,
	// 				targetHarvestDiffAmount: Math.abs(
	// 					NUETRAL_HARVEST_TARGET - summary.realized.gainTotal,
	// 				),
	// 			};
	// 		}
	// 	}
	// }

	public static RELEVANT_HARVEST_ACCOUNTS_WHERE({
		portfolioId,
	}: {
		portfolioId: string;
	}): Prisma.AccountWhereInput {
		return {
			portfolioId,
			OR: [
				{
					subType: {
						notIn: [...taxAdvantadedSubTypes],
					},
				},
				{
					subType: {
						equals: null,
					},
				},
			],
		};
	}
}
