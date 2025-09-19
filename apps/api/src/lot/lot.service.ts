import { Injectable } from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import { Decimal } from 'decimal.js';

import { type SelectExpression, sql } from 'kysely';

import { taxAdvantadedSubTypes } from '~/plaid/plaid.utils';
import { Database } from '../database/database';
import type { DB } from '../database/db.d';
import { PrismaService } from '../prisma/prisma.service';
import { type LotCurrent, LotValueType } from './lot.dto';

@Injectable()
export class LotService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly db: Database,
	) {}

	resetLotsForAccount({
		lotSeededDate,
		accountId,
		lots,
		portfolioId,
	}: {
		accountId: string;
		lots: Prisma.LotCreateManyInput[];
		lotSeededDate?: Date;
		portfolioId: string;
	}) {
		return this.prismaService
			.rlsPortfolioClient(portfolioId)
			.$transaction(async (trx) => {
				await trx.account.update({
					data: {
						uploadedPositions: true,
						lotSeededDate,
					},
					where: {
						id: accountId,
					},
				});

				const assets = new Set(lots.map((lot) => lot.assetSymbol));
				for (const asset of assets) {
					await trx.asset.upsert({
						create: {
							symbol: asset,
						},
						update: {
							symbol: asset,
						},
						where: {
							symbol: asset,
						},
					});
				}

				await trx.lot.deleteMany({
					where: {
						accountId,
					},
				});

				await trx.mergeError.deleteMany({
					where: {
						accountId,
					},
				});

				await trx.plaidMerge.deleteMany({
					where: {
						accountId,
					},
				});

				await trx.transaction.updateMany({
					where: {
						accountId,
						transactionDate: {
							gt: lotSeededDate,
						},
					},
					data: {
						appliedToLots: false,
					},
				});

				return trx.lot.createMany({
					data: lots.map((lot) => ({
						...lot,
						accountId,
					})),
				});
			});
	}

	lotCurrent({
		lotIds,
		lotValueType,
		portfolioId,
		/**
		 * The minimum total P&L for the lot as an absolute value - should be used in conjuction with lotValueType
		 */
		minTotalPAndL,
		excludeLotIds,
		exludeAssetSymbols,
		purchaseDateBefore,
		purchaseDateAfter,
	}: {
		portfolioId: string;
		lotIds?: string[];
		lotValueType?: LotValueType;
		minTotalPAndL?: Decimal;
		excludeLotIds?: string[];
		exludeAssetSymbols?: string[];
		purchaseDateBefore?: Date;
		purchaseDateAfter?: Date;
	}): Promise<LotCurrent[]> {
		return this.db.transaction().execute(async (trx) => {
			await sql`SELECT set_config('app.current_portfolio_id', ${portfolioId}::text, TRUE)`.execute(
				trx,
			);
			let query = trx
				.selectFrom('LotCurrent')
				.innerJoin('Account', 'Account.id', 'LotCurrent.accountId')
				.leftJoin(
					'HarvestTransactionItem',
					'HarvestTransactionItem.lotId',
					'LotCurrent.id',
				)
				.leftJoin(
					'HarvestTransaction',
					'HarvestTransaction.harvestTransactionItemId',
					'HarvestTransactionItem.id',
				)
				.leftJoin('Harvest', 'Harvest.id', 'HarvestTransaction.harvestId')
				.select([
					...LotService.lotCurrentFields,
					sql<string>`COALESCE(SUM(CASE WHEN DATE("Harvest"."recommendationExpiresDate") >= CURRENT_DATE THEN "HarvestTransactionItem"."quantity" ELSE 0 END), 0)`.as(
						'currentHarvestQty',
					),
				])
				.where('Account.portfolioId', '=', portfolioId)
				// remove tax advantaged accounts
				.where((eb) =>
					eb.or([
						eb('Account.subType', 'not in', [...taxAdvantadedSubTypes]),
						eb('Account.subType', 'is', null),
					]),
				)
				// Filter out fractional shares
				.where('LotCurrent.remainingQty', '>=', '1')
				.groupBy([...LotService.lotCurrentFields]);
			// Order is important  here - biggest winners at top, biggest losers at bottom by per share $

			if (lotIds) {
				query = query.where('LotCurrent.id', 'in', lotIds);
			}

			if (excludeLotIds) {
				query = query.where('LotCurrent.id', 'not in', excludeLotIds);
			}

			if (exludeAssetSymbols && exludeAssetSymbols.length > 0) {
				query = query.where('LotCurrent.symbol', 'not in', exludeAssetSymbols);
			}

			if (purchaseDateBefore) {
				query = query.where('LotCurrent.acquiredDate', '<', purchaseDateBefore);
			}

			if (purchaseDateAfter) {
				query = query.where('LotCurrent.acquiredDate', '>', purchaseDateAfter);
			}

			if (lotValueType === LotValueType.GAIN) {
				query = query.where('LotCurrent.gainTotal', '>', '0');
				if (minTotalPAndL) {
					query = query.where(
						'LotCurrent.gainTotal',
						'>=',
						minTotalPAndL.abs().toString(),
					);
				}
			} else if (lotValueType === LotValueType.LOSS) {
				query = query.where('LotCurrent.gainTotal', '<', '0');
				if (minTotalPAndL) {
					query = query.where(
						'LotCurrent.gainTotal',
						'<=',
						minTotalPAndL.abs().neg().toString(),
					);
				}
			}

			const results = (await query
				.orderBy('dollarPerSharePnL', 'desc')
				.execute()) as unknown as LotCurrent[];

			return results.map((result) => ({
				...result,
				availableQty: new Decimal(result.remainingQty)
					.minus(new Decimal(result.currentHarvestQty))
					.toString(),
			}));
		});
	}

	summaryCurrentLots(lots: LotCurrent[]) {
		const totals = {
			accountCount: new Decimal(0),
			unrealizedGainTotal: new Decimal(0),
			unrealizedLossTotal: new Decimal(0),
			unrealizedGainTotalWithCurrentHarvest: new Decimal(0),
			unrealizedLossTotalWithCurrentHarvest: new Decimal(0),
			positionCount: new Decimal(0),
			realizedDollarChangeFromCurrentHarvest: new Decimal(0),
		};

		const accountIds = new Set<string>();
		const lotCounts = new Set<string>();

		for (const lot of lots) {
			accountIds.add(lot.accountId);
			lotCounts.add(lot.id);

			totals.realizedDollarChangeFromCurrentHarvest =
				totals.realizedDollarChangeFromCurrentHarvest.plus(
					new Decimal(lot.dollarPerSharePnL).mul(
						new Decimal(lot.currentHarvestQty),
					),
				);
			if (Number(lot.gainTotal) < 0) {
				totals.unrealizedLossTotal = totals.unrealizedLossTotal.plus(
					new Decimal(lot.gainTotal),
				);
				totals.unrealizedLossTotalWithCurrentHarvest =
					totals.unrealizedLossTotalWithCurrentHarvest.plus(
						new Decimal(lot.dollarPerSharePnL).mul(
							new Decimal(lot.remainingQty).minus(
								new Decimal(lot.currentHarvestQty),
							),
						),
					);
			} else {
				totals.unrealizedGainTotal = totals.unrealizedGainTotal.plus(
					new Decimal(lot.gainTotal),
				);
				totals.unrealizedGainTotalWithCurrentHarvest =
					totals.unrealizedGainTotalWithCurrentHarvest.plus(
						new Decimal(lot.dollarPerSharePnL).mul(
							new Decimal(lot.remainingQty).minus(
								new Decimal(lot.currentHarvestQty),
							),
						),
					);
			}
		}

		return {
			accountCount: totals.accountCount.toNumber(),
			positionCount: totals.positionCount.toNumber(),
			gainTotal: totals.unrealizedGainTotal.toNumber(),
			lossTotal: totals.unrealizedLossTotal.toNumber(),
			totalUnrealized: totals.unrealizedGainTotal
				.plus(totals.unrealizedLossTotal)
				.toNumber(),
			realizedDollarChangeFromCurrentHarvest:
				totals.realizedDollarChangeFromCurrentHarvest.toNumber(),
			unrealizedGainTotalWithCurrentHarvest:
				totals.unrealizedGainTotalWithCurrentHarvest.toNumber(),
			unrealizedLossTotalWithCurrentHarvest:
				totals.unrealizedLossTotalWithCurrentHarvest.toNumber(),
			totalUnrealizedWithCurrentHarvest:
				totals.unrealizedGainTotalWithCurrentHarvest
					.plus(totals.unrealizedLossTotalWithCurrentHarvest)
					.toNumber(),
		};
	}

	private static lotCurrentFields: SelectExpression<
		DB,
		'LotCurrent' | 'Account'
	>[] = [
		'LotCurrent.accountId',
		'LotCurrent.acquiredDate',
		'LotCurrent.costBasis',
		'LotCurrent.gainTotal',
		'LotCurrent.gainTotalPct',
		'LotCurrent.id',
		'LotCurrent.lastPrice',
		'LotCurrent.price',
		'LotCurrent.remainingQty',
		'LotCurrent.symbol',
		'LotCurrent.value',
		'LotCurrent.dollarPerSharePnL',
		'LotCurrent.taxGain',
	];
}
