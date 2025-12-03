import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OnEvent } from '@nestjs/event-emitter';
import type { Prisma, ProfitAndLossType, RealizedPAndL } from '@prisma/client';
import { Decimal } from 'decimal.js';
import { Insertable, sql } from 'kysely';
import { Database, executeWithRLS } from '~/database/database';
import { RealizedPAndL as KyselyRealizedPAndL } from '~/database/db';
import { AccountsSyncedEvent } from '~/events/accounts-synced';
import { EventId } from '~/events/event-id';
import { LotService } from '~/lot/lot.service';
import { PortfolioSummaryRealized } from '~/portfolio/portfolio.dto';
import { PositionService } from '~/position/position.service';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Type-safe mapping from ProfitAndLossType enum to RealizedPAndL column names
 * This ensures all enum values are mapped to their corresponding columns
 */
const PROFIT_AND_LOSS_TYPE_TO_COLUMN: Record<
	ProfitAndLossType,
	keyof Pick<
		RealizedPAndL,
		| 'shortTermCapitalGain'
		| 'longTermCapitalGain'
		| 'dividend'
		| 'qualifiedDividend'
		| 'nonQualifiedDividend'
		| 'dividendReinvestment'
		| 'interest'
		| 'interestReinvestment'
		| 'distribution'
		| 'accountFee'
		| 'managementFee'
		| 'fundFee'
		| 'taxWithheld'
		| 'nonResidentTax'
		| 'deposit'
		| 'withdrawal'
		| 'contribution'
		| 'returnOfPrincipal'
		| 'loanPayment'
		| 'marginExpense'
		| 'stockDistribution'
		| 'unqualifiedGain'
	>
> = {
	SHORT_TERM_CAPITAL_GAIN: 'shortTermCapitalGain',
	LONG_TERM_CAPITAL_GAIN: 'longTermCapitalGain',
	DIVIDEND: 'dividend',
	QUALIFIED_DIVIDEND: 'qualifiedDividend',
	NON_QUALIFIED_DIVIDEND: 'nonQualifiedDividend',
	DIVIDEND_REINVESTMENT: 'dividendReinvestment',
	INTEREST: 'interest',
	INTEREST_REINVESTMENT: 'interestReinvestment',
	DISTRIBUTION: 'distribution',
	ACCOUNT_FEE: 'accountFee',
	MANAGEMENT_FEE: 'managementFee',
	FUND_FEE: 'fundFee',
	TAX_WITHHELD: 'taxWithheld',
	NON_RESIDENT_TAX: 'nonResidentTax',
	DEPOSIT: 'deposit',
	WITHDRAWAL: 'withdrawal',
	CONTRIBUTION: 'contribution',
	RETURN_OF_PRINCIPAL: 'returnOfPrincipal',
	LOAN_PAYMENT: 'loanPayment',
	MARGIN_EXPENSE: 'marginExpense',
	STOCK_DISTRIBUTION: 'stockDistribution',
	UNQUALIFIED_GAIN: 'unqualifiedGain',
};

@Injectable()
export class RealizedPandLService {
	// biome-ignore lint/correctness/noUnusedPrivateClassMembers: <log>
	private readonly logger = new Logger(RealizedPandLService.name);
	constructor(
		private readonly db: Database,
		private readonly positionService: PositionService,
		private readonly prismaService: PrismaService,
		private readonly lotService: LotService,
		private readonly configService: ConfigService,
	) {}

	@OnEvent(EventId.ACCOUNTS_SYNCED)
	async handleAccountsSynced(event: AccountsSyncedEvent) {
		const accountRealizedPAndLHistoryItems = await executeWithRLS(
			this.db,
			event.portfolioId,
			async (trx) => {
				return trx
					.selectFrom('AccountRealizedPAndLHistory')
					.where('accountId', 'in', event.accountIds)
					.where('realizedPAndLId', 'is', null)
					.selectAll()
					.execute();
			},
		);

		// Get the current lots so we can record an accurate unrealized profit and loss
		const lotsCurrent = await this.lotService.lotCurrent({
			portfolioId: event.portfolioId,
		});

		const accountIdToRealizedPAndL = new Map<
			string,
			Insertable<KyselyRealizedPAndL>
		>();

		for (const accountRealizedPAndLHistory of accountRealizedPAndLHistoryItems) {
			if (
				!accountIdToRealizedPAndL.get(accountRealizedPAndLHistory.accountId)
			) {
				accountIdToRealizedPAndL.set(accountRealizedPAndLHistory.accountId, {
					accountId: accountRealizedPAndLHistory.accountId,
					createdAt: accountRealizedPAndLHistory.createdAt,
					portfolioId: accountRealizedPAndLHistory.portfolioId,
				});
			}

			// biome-ignore lint/style/noNonNullAssertion: <its set above>
			const realizedPAndL = accountIdToRealizedPAndL.get(
				accountRealizedPAndLHistory.accountId,
			)!;

			const columnName =
				PROFIT_AND_LOSS_TYPE_TO_COLUMN[
					accountRealizedPAndLHistory.profitAndLossType
				];

			realizedPAndL[columnName] = new Decimal(realizedPAndL[columnName] ?? 0)
				.plus(new Decimal(accountRealizedPAndLHistory.value))
				.toString();
		}

		// Get the current positions for the account
		const positions = await this.positionService.portfolioPositions({
			portfolioId: event.portfolioId,
			select: {
				id: true,
				positionSnapshotId: true,
				accountId: true,
			},
		});

		const accountIdToPositionId = new Map(
			positions.map((position) => [
				position.accountId,
				position.positionSnapshotId,
			]),
		);

		// Insert the new updated realized p and l's for the account
		const realizedPAndLInserts = Array.from(accountIdToRealizedPAndL.values());
		if (realizedPAndLInserts.length > 0) {
			await executeWithRLS(this.db, event.portfolioId, async (trx) => {
				return trx
					.insertInto('RealizedPAndL')
					.values(
						realizedPAndLInserts.map((realizedPAndL) => {
							const summaryCurrentLots = this.lotService.summaryCurrentLots(
								lotsCurrent.filter(
									(lot) => lot.accountId === realizedPAndL.accountId,
								),
							);

							return {
								...realizedPAndL,
								positionSnapshotId: accountIdToPositionId.get(
									realizedPAndL.accountId,
								),
								unrealizedProfit: summaryCurrentLots.gainTotal,
								unrealizedLoss: summaryCurrentLots.lossTotal,
							};
						}),
					)
					.execute();
			});
		}

		// Cut a portfolio snapshot
		const portfolioSnapshot = await this.porfolioRealizedPAndL({
			portfolioId: event.portfolioId,
		});
		await executeWithRLS(this.db, event.portfolioId, async (trx) => {
			const portfolioSnapshotInsert = await trx
				.insertInto('PortfolioBalanceSnapshot')
				.values({
					portfolioId: event.portfolioId,
					current: portfolioSnapshot.current,
					available: portfolioSnapshot.available,
					shortTermCapitalGain: portfolioSnapshot.shortTermCapitalGain,
					longTermCapitalGain: portfolioSnapshot.longTermCapitalGain,
					dividend: portfolioSnapshot.dividend,
					qualifiedDividend: portfolioSnapshot.qualifiedDividend,
					nonQualifiedDividend: portfolioSnapshot.nonQualifiedDividend,
					dividendReinvestment: portfolioSnapshot.dividendReinvestment,
					interest: portfolioSnapshot.interest,
					interestReinvestment: portfolioSnapshot.interestReinvestment,
					distribution: portfolioSnapshot.distribution,
					accountFee: portfolioSnapshot.accountFee,
					managementFee: portfolioSnapshot.managementFee,
					fundFee: portfolioSnapshot.fundFee,
					taxWithheld: portfolioSnapshot.taxWithheld,
					nonResidentTax: portfolioSnapshot.nonResidentTax,
					deposit: portfolioSnapshot.deposit,
					withdrawal: portfolioSnapshot.withdrawal,
					contribution: portfolioSnapshot.contribution,
					returnOfPrincipal: portfolioSnapshot.returnOfPrincipal,
					loanPayment: portfolioSnapshot.loanPayment,
					marginExpense: portfolioSnapshot.marginExpense,
					stockDistribution: portfolioSnapshot.stockDistribution,
					unqualifiedGain: portfolioSnapshot.unqualifiedGain,
					unrealizedProfit: portfolioSnapshot.unrealizedProfit,
					unrealizedLoss: portfolioSnapshot.unrealizedLoss,
				})
				.returning('id')
				.executeTakeFirstOrThrow();
			const positionSnapshotIds = Array.from(
				new Set(positions.map((position) => position.positionSnapshotId)),
			);
			if (positionSnapshotIds.length > 0) {
				await trx
					.insertInto('PositionSnapshotOnPortfolioBalanceSnapshot')
					.values(
						positionSnapshotIds.map((positionSnapshotId) => ({
							positionSnapshotId: positionSnapshotId,
							portfolioBalanceSnapshotId: portfolioSnapshotInsert.id,
						})),
					)
					.execute();
			}
		});
	}

	/**
	 * Fetch or create and return RealizedPAndL
	 */
	async _realizedProfitAndLoss({
		accountId,
		select,
		year,
		portfolioId,
	}: {
		accountId: string;
		year: number;
		select: Prisma.RealizedPAndLSelect;
		portfolioId: string;
	}): Promise<RealizedPAndL> {
		try {
			const startOfYear = new Date(year, 0, 1); // Jan 1, <year> 00:00:00
			// Find the most recent realized p&l for the year
			const realizedPAndL = await this.prismaService
				.rlsPortfolioClient(portfolioId)
				.realizedPAndL.findFirstOrThrow({
					select: select as Prisma.RealizedPAndLSelect,
					where: {
						accountId,
						createdAt: {
							gte: startOfYear,
						},
					},
					orderBy: {
						createdAt: 'desc',
					},
				});
			return realizedPAndL;
		} catch {
			// If we dont have one yet we need to create one
			return this.prismaService
				.rlsPortfolioClient(portfolioId)
				.$transaction(async (trx) => {
					await trx.account.update({
						data: {
							setRealizedValues: true,
						},
						where: {
							id: accountId,
						},
					});
					return trx.realizedPAndL.create({
						data: {
							account: {
								connect: {
									id: accountId,
								},
							},
							portfolio: {
								connect: {
									id: portfolioId,
								},
							},
						},
						select,
					});
				});
		}
	}

	async porfolioRealizedPAndL({
		portfolioId,
		year,
	}: {
		portfolioId: string;
		year?: number;
	}): Promise<PortfolioSummaryRealized> {
		const startOfYear = year
			? new Date(year, 0, 1)
			: new Date(new Date().getFullYear(), 0, 1);

		try {
			const result = await this.queryRealizedPAndL({
				portfolioId,
				startOfYear,
			});
			return result;
		} catch {
			await executeWithRLS(this.db, portfolioId, async (trx) => {
				const accounts = await trx
					.selectFrom('Account')
					.select('id')
					.where('portfolioId', '=', portfolioId)
					.execute();
				if (accounts.length > 0) {
					trx
						.insertInto('RealizedPAndL')
						.values(
							accounts.map((account) => ({
								portfolioId,
								accountId: account.id,
								shortTermCapitalGain: 0,
								longTermCapitalGain: 0,
								dividend: 0,
								qualifiedDividend: 0,
							})),
						)
						.execute();
				}
			});
			return await this.queryRealizedPAndL({
				portfolioId,
				startOfYear,
			});
		}
	}

	async queryRealizedPAndL({
		portfolioId,
		startOfYear,
	}: {
		portfolioId: string;
		startOfYear: Date;
	}): Promise<PortfolioSummaryRealized> {
		return executeWithRLS(this.db, portfolioId, async (trx) => {
			const sub = trx
				.selectFrom('RealizedPAndL')
				.selectAll()
				.where('createdAt', '>=', startOfYear)
				.where('portfolioId', '=', portfolioId)
				.orderBy('accountId', 'desc')
				.orderBy('createdAt', 'desc')
				.distinctOn('accountId');

			const dbResult = await trx
				.selectFrom(sub.as('account_p_l'))
				.select('account_p_l.portfolioId')
				.select((eb) =>
					eb.fn
						.sum<number>('account_p_l.shortTermCapitalGain')
						.as('shortTermCapitalGain'),
				)
				.select((eb) =>
					eb.fn
						.sum<number>('account_p_l.longTermCapitalGain')
						.as('longTermCapitalGain'),
				)
				.select((eb) =>
					eb.fn.sum<number>('account_p_l.dividend').as('dividend'),
				)
				.select((eb) =>
					eb.fn
						.sum<number>('account_p_l.qualifiedDividend')
						.as('qualifiedDividend'),
				)
				.select((eb) =>
					eb.fn
						.sum<number>('account_p_l.nonQualifiedDividend')
						.as('nonQualifiedDividend'),
				)
				.select((eb) =>
					eb.fn
						.sum<number>('account_p_l.dividendReinvestment')
						.as('dividendReinvestment'),
				)
				.select((eb) =>
					eb.fn.sum<number>('account_p_l.interest').as('interest'),
				)
				.select((eb) =>
					eb.fn
						.sum<number>('account_p_l.interestReinvestment')
						.as('interestReinvestment'),
				)
				.select((eb) =>
					eb.fn.sum<number>('account_p_l.distribution').as('distribution'),
				)
				.select((eb) =>
					eb.fn.sum<number>('account_p_l.accountFee').as('accountFee'),
				)
				.select((eb) =>
					eb.fn.sum<number>('account_p_l.managementFee').as('managementFee'),
				)
				.select((eb) => eb.fn.sum<number>('account_p_l.fundFee').as('fundFee'))
				.select((eb) =>
					eb.fn.sum<number>('account_p_l.taxWithheld').as('taxWithheld'),
				)
				.select((eb) =>
					eb.fn.sum<number>('account_p_l.nonResidentTax').as('nonResidentTax'),
				)
				.select((eb) => eb.fn.sum<number>('account_p_l.deposit').as('deposit'))
				.select((eb) =>
					eb.fn.sum<number>('account_p_l.withdrawal').as('withdrawal'),
				)
				.select((eb) =>
					eb.fn.sum<number>('account_p_l.contribution').as('contribution'),
				)
				.select((eb) =>
					eb.fn
						.sum<number>('account_p_l.returnOfPrincipal')
						.as('returnOfPrincipal'),
				)
				.select((eb) =>
					eb.fn.sum<number>('account_p_l.loanPayment').as('loanPayment'),
				)
				.select((eb) =>
					eb.fn.sum<number>('account_p_l.marginExpense').as('marginExpense'),
				)
				.select((eb) =>
					eb.fn
						.sum<number>('account_p_l.stockDistribution')
						.as('stockDistribution'),
				)
				.select((eb) =>
					eb.fn
						.sum<number>('account_p_l.unqualifiedGain')
						.as('unqualifiedGain'),
				)
				.select((eb) => eb.fn.sum<number>('account_p_l.current').as('current'))
				.select((eb) =>
					eb.fn.sum<number>('account_p_l.available').as('available'),
				)
				.select((eb) =>
					eb.fn
						.sum<number>('account_p_l.unrealizedProfit')
						.as('unrealizedProfit'),
				)
				.select((eb) =>
					eb.fn.sum<number>('account_p_l.unrealizedLoss').as('unrealizedLoss'),
				)
				.select((eb) =>
					eb.fn
						.sum<number>(
							sql`"shortTermCapitalGain" + "longTermCapitalGain" + "dividend"`,
						)
						.as('gainTotal'),
				)
				.groupBy('account_p_l.portfolioId')
				.executeTakeFirstOrThrow();

			// Calculate estimated tax bill
			const estimatedTaxBill = this.calculateEstimatedTaxBill(dbResult);

			return {
				...dbResult,
				estimatedTaxBill,
			};
		});
	}

	/**
	 * Calculate estimated tax bill based on realized gains and losses
	 * @param realized - Portfolio realized summary with all P&L fields
	 * @returns Estimated tax bill breakdown by category with total, rate, and result for each
	 * @example
	 * const taxBill = realizedPandLService.calculateEstimatedTaxBill(realized);
	 */
	calculateEstimatedTaxBill(
		realized: Omit<PortfolioSummaryRealized, 'estimatedTaxBill'>,
	) {
		// Helper function to create tax calculation object
		const createTaxCalc = (
			total: number,
			rateKey: string,
		): { total: number; rate: number; result: number } => {
			const rate = this.configService.get<number>(rateKey) || 0;
			const taxableAmount = Math.max(0, total);
			return {
				total: taxableAmount,
				rate,
				result: taxableAmount * rate,
			};
		};

		// Helper for non-taxable items
		const createNonTaxable = (
			total: number,
		): { total: number; rate: number; result: number } => ({
			total,
			rate: 0,
			result: 0,
		});

		// Calculate tax for each category
		const shortTermCapitalGain = createTaxCalc(
			realized.shortTermCapitalGain,
			'SHORT_TERM_CAPITAL_GAINS_TAX_RATE',
		);

		const longTermCapitalGain = createTaxCalc(
			realized.longTermCapitalGain,
			'LONG_TERM_CAPITAL_GAINS_TAX_RATE',
		);

		const dividend = createTaxCalc(realized.dividend, 'DIVIDEND_TAX_RATE');

		const qualifiedDividend = createTaxCalc(
			realized.qualifiedDividend,
			'QUALIFIED_DIVIDEND_TAX_RATE',
		);

		const nonQualifiedDividend = createTaxCalc(
			realized.nonQualifiedDividend,
			'NON_QUALIFIED_DIVIDEND_TAX_RATE',
		);

		const dividendReinvestment = createTaxCalc(
			realized.dividendReinvestment,
			'DIVIDEND_REINVESTMENT_TAX_RATE',
		);

		const interest = createTaxCalc(realized.interest, 'INTEREST_TAX_RATE');

		const interestReinvestment = createTaxCalc(
			realized.interestReinvestment,
			'INTEREST_REINVESTMENT_TAX_RATE',
		);

		const distribution = createTaxCalc(
			realized.distribution,
			'DISTRIBUTION_TAX_RATE',
		);

		const stockDistribution = createTaxCalc(
			realized.stockDistribution,
			'STOCK_DISTRIBUTION_TAX_RATE',
		);

		const unqualifiedGain = createTaxCalc(
			realized.unqualifiedGain,
			'UNQUALIFIED_GAIN_TAX_RATE',
		);

		// Most other fields (fees, deposits, etc.) are not taxable income
		const accountFee = createNonTaxable(realized.accountFee);
		const managementFee = createNonTaxable(realized.managementFee);
		const fundFee = createNonTaxable(realized.fundFee);
		const taxWithheld = createNonTaxable(realized.taxWithheld);
		const nonResidentTax = createNonTaxable(realized.nonResidentTax);
		const deposit = createNonTaxable(realized.deposit);
		const withdrawal = createNonTaxable(realized.withdrawal);
		const contribution = createNonTaxable(realized.contribution);
		const returnOfPrincipal = createNonTaxable(realized.returnOfPrincipal);
		const loanPayment = createNonTaxable(realized.loanPayment);
		const marginExpense = createNonTaxable(realized.marginExpense);

		// Sum all the result fields to get total tax
		const total =
			shortTermCapitalGain.result +
			longTermCapitalGain.result +
			dividend.result +
			qualifiedDividend.result +
			nonQualifiedDividend.result +
			dividendReinvestment.result +
			interest.result +
			interestReinvestment.result +
			distribution.result +
			stockDistribution.result +
			unqualifiedGain.result;

		return {
			total,
			shortTermCapitalGain,
			longTermCapitalGain,
			dividend,
			qualifiedDividend,
			nonQualifiedDividend,
			dividendReinvestment,
			interest,
			interestReinvestment,
			distribution,
			accountFee,
			managementFee,
			fundFee,
			taxWithheld,
			nonResidentTax,
			deposit,
			withdrawal,
			contribution,
			returnOfPrincipal,
			loanPayment,
			marginExpense,
			stockDistribution,
			unqualifiedGain,
		};
	}
}
