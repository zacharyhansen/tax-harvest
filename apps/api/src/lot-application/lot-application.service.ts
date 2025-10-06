import { Injectable, Logger } from '@nestjs/common';
import { ProfitAndLossType } from '@prisma/client';
import Decimal from 'decimal.js';
import { Insertable, Selectable } from 'kysely';
import { InvestmentTransactionSubtype, InvestmentTransactionType } from 'plaid';
import type {
	AccountRealizedPAndLHistory,
	Lot,
	Position,
	Transaction,
} from '~/database/db.d';
import { TRANSACTION_PNL_MAPPING } from '../plaid/constants/plaid.types';
import { findAllMatchingSubsetsBottomUp } from './lot-application.bottom-up';
import { findGreedySubset } from './lot-application.greedy';

/**
 * A single Assets lotData (existing lots and new buys)
 * with the transaction ids for the buy and sell transactions
 *
 * @property targetQuantity - The target quantity of the asset we need to get to after the lot changes are applied
 * @property targetValue - The target total sum of cost basis of the asset we need to get to after the lot changes are applied
 * @property position - The position of the asset at the end of the lot changes from the Plaid endpoint (try to get as close to the value and qty of it)
 * If undefined that means the asset was completely sold (its not being returned by plaid)
 * @property lotData - The lot data for the asset
 * @property transactionBuyIds - The ids of the buy transactions for the asset
 * @property transactionSellIds - The ids of the sell transactions for the asset
 */
export interface LotDataWithMeta {
	transactionBuys: Selectable<Transaction>[];
	transactionSells: Selectable<Transaction>[];
	lotData: LotDataKysely[];
	position:
		| Selectable<Position>
		| {
				assetSymbol: string;
				quantity: number;
				costTotal: number;
				portfolioId: string;
				positionSnapshotId: null;
		  };
}

/**
 * The results of the lot change algorithm
 * @property lotChanges - The posible lot changes for each asset (we may have found multiple that could work)
 * @property chosenLotChange - The chosen lot change we will use (null if none was able to found :( )
 * @property error - The error if the algorithm failed
 * @property totalSaleDollarsShortTerm - The total sale dollars for the short term
 * @property totalSaleDollarsLongTerm - The total sale dollars for the long term
 * @property realizedProfitAndLossShortTerm - The realized profit and loss for the short term
 * @property realizedProfitAndLossLongTerm - The realized profit and loss for the long term
 */
export interface ResolvedLotChange extends LotDataWithMeta {
	lotChanges: LotChangeKysely[][];
	error?: Error;
}

export interface LotDataKysely {
	quantity: Decimal;
	price: Decimal;
	lotId: string;
	accountId: string;
	acquiredDate: Date;
}

export interface LotChangeKysely extends LotDataKysely {
	quantityFinal: Decimal;
	quantityChange: Decimal;
	upsert: Insertable<Lot>;
	symbol: string;
	lotId: string;
	realizedProfitAndLossShortTerm: Decimal;
	realizedProfitAndLossLongTerm: Decimal;
}

/**
 * Result of organizing assets, including updated transactions with the correct profitAndLossType
 */
export interface OrganizedAssets {
	lotDataMap: Map<string, LotDataWithMeta>;
	updatedTransactions: (Insertable<Transaction> & { id: string })[];
}

/**
 * @param lotsData - The list of lot data that nwe know to have been purchased - now we need to determine which shares of each were sold.
 * @param targetQuantity - The total quantity of the final lots we need to get to. A falsy value is assumed ot be 0 (all of it is to be sold)
 * @param targetValue - The total cost basis of the final lots
 * @param maxResults - The maximum number of results to return if multiple possible sell sets are found.
 * @param time - Whether to time the algorithm.
 * @param symbol - The symbol of the asset to find the lot changes for.
 */
interface FindSubsetHybridArgs {
	lotsData: LotDataKysely[];
	targetQuantity?: Decimal;
	targetValue?: Decimal;
	maxResults?: number;
	time?: boolean;
	symbol: string;
}

/**
 * Service for managing lot application and tax lot calculations
 * @example
 * const lotApplicationService = new LotApplicationService();
 * const result = lotApplicationService.resolveLotChange(lotDataWithMeta);
 */
@Injectable()
export class LotApplicationService {
	private readonly logger = new Logger(LotApplicationService.name);

	constructor() {}

	/**
	 * Find a subset of lots that matches the target quantity and value.
	 *
	 * This is a hybrid approach that first tries to find a greedy match, and if that
	 * fails, it then tries to find all matching subsets using a bottom-up approach.
	 *
	 * @param params - Parameters for finding subset
	 * @returns A list of lot tuples that match the target quantity and value.
	 * @example
	 * const result = lotApplicationService.findSubsetHybrid({
	 *   lotsData: lots,
	 *   targetQuantity: new Decimal(100),
	 *   targetValue: new Decimal(10000),
	 *   symbol: 'AAPL'
	 * });
	 */
	public findSubsetHybrid({
		lotsData: tuples,
		targetQuantity = new Decimal(0),
		targetValue = new Decimal(0),
		maxResults = 5,
		time = false,
	}: FindSubsetHybridArgs): LotDataKysely[][] {
		const greedyResultFIFO = findGreedySubset({
			tuples,
			targetQuantity,
			targetValue,
			time,
		});

		if (greedyResultFIFO) return [greedyResultFIFO];

		const greedyResultLIFO = findGreedySubset({
			tuples: [...tuples].reverse(),
			targetQuantity,
			targetValue,
			time,
		});

		if (greedyResultLIFO) return [greedyResultLIFO];

		this.logger.debug('Greedy failed, trying bottom-up approach');

		const allResults = findAllMatchingSubsetsBottomUp({
			tuples,
			targetQuantity,
			targetValue,
			maxResults,
			time,
		});

		return allResults;
	}

	/**
	 * Resolve the lot change for a given lot data with meta
	 * @param lotDataWithMeta - The lot data with metadata
	 * @returns The lot changes set results that are a match for the given lot data with meta
	 * @example
	 * const resolved = lotApplicationService.resolveLotChange(lotDataWithMeta);
	 * if (resolved.chosenLotChangeIndex !== null) {
	 *   // Process the chosen lot changes
	 * }
	 */
	public resolveLotChange(lotDataWithMeta: LotDataWithMeta): ResolvedLotChange {
		const { position } = lotDataWithMeta;
		const { quantity, costTotal, assetSymbol } = position;
		if (quantity === undefined && costTotal === undefined) {
			return {
				...lotDataWithMeta,
				lotChanges: [],
			};
		}

		// Attempt to find a subset of lots that matches the target quantity and value
		// findSubsetHybrid may throw unkown or timeout errors
		let results: LotDataKysely[][] = [];
		try {
			results = this.findSubsetHybrid({
				lotsData: lotDataWithMeta.lotData,
				targetQuantity: new Decimal(quantity),
				targetValue: new Decimal(costTotal ?? '0'),
				symbol: assetSymbol,
			});
		} catch (error) {
			return {
				...lotDataWithMeta,
				lotChanges: [],
				error: error as Error,
			};
		}

		const lotChanges: LotChangeKysely[][] = [];

		for (const result of results) {
			const lotChangesForResult: LotChangeKysely[] = [];

			for (const [index, resultLot] of result.entries()) {
				const originalLot = lotDataWithMeta.lotData[index];
				const lotChange: LotChangeKysely = {
					...originalLot,
					quantityChange: originalLot.quantity.minus(resultLot.quantity),
					quantityFinal: resultLot.quantity,
					symbol: assetSymbol,
					upsert: {
						id: resultLot.lotId,
						accountId: resultLot.accountId,
						assetSymbol: assetSymbol,
						portfolioId: lotDataWithMeta.position.portfolioId,
						price: resultLot.price.toString(),
						acquiredDate: resultLot.acquiredDate,
						remainingQty: resultLot.quantity.toString(),
					},
					realizedProfitAndLossShortTerm: new Decimal(0),
					realizedProfitAndLossLongTerm: new Decimal(0),
				};

				lotChangesForResult.push(
					this.processLotChangePAndL(
						lotChange,
						lotDataWithMeta.transactionSells,
					),
				);
			}

			lotChanges.push(lotChangesForResult);
		}

		// Not results were found
		if (lotChanges.length === 0) {
			return {
				...lotDataWithMeta,
				lotChanges: [],
			};
		}

		// Deduplicate the lot changes based on the signature of changes
		const deduplicatedLotChanges =
			this.deduplicateEquivalentChangeSetsKysely(lotChanges);
		const chosenLotChangeIndex = this.processMultiChangeSetKysely(
			deduplicatedLotChanges,
		);

		// move the chosen lot change to the first index
		if (chosenLotChangeIndex !== null) {
			[
				deduplicatedLotChanges[chosenLotChangeIndex],
				deduplicatedLotChanges[0],
			] = [
				deduplicatedLotChanges[0],
				deduplicatedLotChanges[chosenLotChangeIndex],
			];
		}

		return {
			...lotDataWithMeta,
			lotChanges: deduplicatedLotChanges,
		};
	}

	/**
	 * Organize assets into a map of lot data with metadata
	 * @param params - Parameters for organizing assets
	 * @returns Map of asset symbols to their lot data with metadata
	 * @example
	 * const assetMap = lotApplicationService.organizeAssets({
	 *   lots: existingLots,
	 *   transactions: newTransactions,
	 *   finalPositions: positions
	 * });
	 */
	public processLotsAndTransactions({
		lots,
		transactions,
		finalPositions,
		plaidMergeId,
		useTestLotId = false,
	}: {
		lots: Selectable<Lot>[];
		transactions: Selectable<Transaction>[];
		finalPositions: Selectable<Position>[];
		plaidMergeId: string;
		useTestLotId?: boolean;
	}): {
		resolvedLotChanges: ResolvedLotChange[];
		nonLotTransactions: Selectable<Transaction>[];
		unknownTransactions: Selectable<Transaction>[];
		nonLotAccountRealizedPAndLHistory: Insertable<AccountRealizedPAndLHistory>[];
	} {
		const lotsByAssetMap = new Map<string, LotDataWithMeta>();
		const nonLotTransactions: Selectable<Transaction>[] = [];
		const unknownTransactions: Selectable<Transaction>[] = [];
		const nonLotAccountRealizedPAndLHistory: Insertable<AccountRealizedPAndLHistory>[] =
			[];
		// Create map of tuple for each lot
		for (const lot of lots) {
			let current: LotDataWithMeta | undefined = lotsByAssetMap.get(
				lot.assetSymbol,
			);

			if (!current) {
				// Find the position returned in the plaid endpoint (or create the default position when not returned)
				// if not returned we know the asset was completely sold (its not being returned by plaid)
				const position = finalPositions.find(
					(p) => p.assetSymbol === lot.assetSymbol,
				) ?? {
					assetSymbol: lot.assetSymbol,
					quantity: 0,
					costTotal: 0,
					portfolioId: lot.portfolioId,
					positionSnapshotId: null,
				};
				current = {
					transactionBuys: [],
					transactionSells: [],
					lotData: [],
					position,
				};
			}
			current.lotData.push({
				quantity: new Decimal(lot.remainingQty.toString()),
				price: new Decimal(lot.price.toString()),
				lotId: lot.id,
				accountId: lot.accountId,
				acquiredDate: lot.acquiredDate,
			});
			lotsByAssetMap.set(lot.assetSymbol, current);
		}

		// Organize transactions in
		for (const trx of transactions) {
			const trxType = this.mapTransactionType(trx);
			let current: LotDataWithMeta | undefined = lotsByAssetMap.get(
				trx.assetSymbol,
			);
			if (!current) {
				// Find the position returned in the plaid endpoint (or create the default position when not returned
				// this happens when entire lots are sold so we create the position as zeroed out)
				// if not returned we know the asset was completely sold (its not being returned by plaid)
				const position = finalPositions.find(
					(p) => p.assetSymbol === trx.assetSymbol,
				) ?? {
					assetSymbol: trx.assetSymbol,
					quantity: 0,
					costTotal: 0,
					portfolioId: trx.portfolioId,
					positionSnapshotId: null,
				};
				current = {
					transactionBuys: [],
					transactionSells: [],
					lotData: [],
					position,
				};
				lotsByAssetMap.set(trx.assetSymbol, current);
			}

			switch (trxType) {
				case 'LOT_TRANSACTION_BUY':
					if (!trx.transactionDate) {
						throw new Error('Transaction date is required for new buys');
					}
					current.lotData.push({
						// biome-ignore lint/style/noNonNullAssertion: <verified in mapTransactionType>
						quantity: new Decimal(trx.quantity!),
						// biome-ignore lint/style/noNonNullAssertion: <verified in mapTransactionType>
						price: new Decimal(trx.price!),
						lotId: !useTestLotId
							? (crypto.randomUUID() as string)
							: 'test lot id',
						accountId: trx.accountId,
						acquiredDate: trx.transactionDate,
					});
					current.transactionBuys.push(trx);

					break;
				case 'LOT_TRANSACTION_SELL':
					current.transactionSells.push(trx);
					break;
				case null:
					unknownTransactions.push(trx);
					break;
				default:
					nonLotTransactions.push(trx);
					nonLotAccountRealizedPAndLHistory.push({
						accountId: trx.accountId,
						portfolioId: trx.portfolioId,
						transactionId: trx.id,
						profitAndLossType: trxType,
						plaidMergeId: plaidMergeId,
						// Plaid is wack and negative means into account
						value: new Decimal(trx.amount ?? 0).mul(-1).toString(),
					});
					break;
			}
		}

		// Process lot changes for each asset using our algorithm
		const resolvedLotChanges: ResolvedLotChange[] = Array.from(
			lotsByAssetMap.entries(),
		).map(([_assetSymbol, data]) => this.resolveLotChange(data));

		return {
			resolvedLotChanges,
			nonLotTransactions,
			unknownTransactions,
			nonLotAccountRealizedPAndLHistory,
		};
	}

	/**
	 * Check if a date is considered long-term (more than 1 year old)
	 * @param acquiredDate - Date to check
	 * @returns True if the date is long-term
	 */
	public isLongTerm(acquiredDate: Date): boolean {
		return acquiredDate.getFullYear() < new Date().getFullYear() - 1;
	}

	/**
	 * Process multiple change sets and select the optimal one
	 * @param uniqueLotChangeSolutions - Array of lot change solutions
	 * @returns Index of the chosen solution or null
	 * @example
	 * const chosenIndex = lotApplicationService.processMultiChangeSetKysely(changeSets);
	 */
	public processMultiChangeSetKysely(
		uniqueLotChangeSolutions: LotChangeKysely[][],
	): number | null {
		// find the lot change with the highest number of zeroed out lots
		const indexMap = new Map<string, number>();
		for (const [index, lotChanges] of uniqueLotChangeSolutions.entries()) {
			for (const lotChangeList of lotChanges) {
				indexMap.set(
					index.toString(),
					(indexMap.get(index.toString()) ?? 0) +
						(lotChangeList.quantityFinal.eq(0) ? 1 : 0),
				);
			}
		}
		// return the LotChange with the highest number of zeroed out lots
		const maxIndex = Array.from(indexMap.entries()).reduce(
			(max, [index, count]) => {
				return count > max.count ? { index: Number(index), count } : max;
			},
			{ index: -1, count: -1 },
		);

		return maxIndex.index === -1 ? null : maxIndex.index;
	}

	/**
	 * Process lot change for profit and loss calculations
	 * @param lotChange - The lot change to process
	 * @param transactionSells - Sell transactions related to this lot
	 * @returns Lot change with P&L calculations
	 * @example
	 * const processedChange = lotApplicationService.processLotChangePAndL(lotChange, sellTransactions);
	 */
	public processLotChangePAndL(
		lotChange: LotChangeKysely,
		transactionSells: Selectable<Transaction>[],
	): LotChangeKysely {
		// Calculate the realized profit and loss - we dont need to actually know per share - just total sold and total cost basis
		// Total Sale Dollars derived from plaid transactions
		let totalSaleDollarsShortTerm = new Decimal(0);
		let totalSaleDollarsLongTerm = new Decimal(0);

		transactionSells.forEach((sell) => {
			if (
				this.isLongTerm(sell.transactionDate ?? sell.postDate ?? sell.createdAt)
			) {
				totalSaleDollarsLongTerm = totalSaleDollarsLongTerm.plus(
					new Decimal(sell.amount ?? 0).abs(),
				);
			} else {
				totalSaleDollarsShortTerm = totalSaleDollarsShortTerm.plus(
					new Decimal(sell.amount ?? 0).abs(),
				);
			}
		}, new Decimal(0));

		// Total Sale Cost Basis derived from our algo results (since we now know which lots were sold tp get cost basis)
		let totalSaleCostBasisShortTerm = new Decimal(0);
		let totalSaleCostBasisLongTerm = new Decimal(0);
		if (this.isLongTerm(lotChange.acquiredDate)) {
			totalSaleCostBasisLongTerm = totalSaleCostBasisLongTerm.plus(
				lotChange.quantityChange.mul(lotChange.price).abs(),
			);
		} else {
			totalSaleCostBasisShortTerm = totalSaleCostBasisShortTerm.plus(
				lotChange.quantityChange.mul(lotChange.price).abs(),
			);
		}

		return {
			...lotChange,
			realizedProfitAndLossShortTerm: totalSaleDollarsShortTerm.minus(
				totalSaleCostBasisShortTerm,
			),
			realizedProfitAndLossLongTerm: totalSaleDollarsLongTerm.minus(
				totalSaleCostBasisLongTerm,
			),
		};
	}

	/**
	 * Deduplicates changesets that are functionally equivalent (same total quantities sold for the same price/date)
	 * @param changeSets - Array of lot change sets
	 * @returns Deduplicated change sets
	 * @example
	 * const deduplicated = lotApplicationService.deduplicateEquivalentChangeSetsKysely(changeSets);
	 */
	public deduplicateEquivalentChangeSetsKysely(
		changeSets: LotChangeKysely[][],
	): LotChangeKysely[][] {
		if (changeSets.length <= 1) return changeSets;

		const changeSetMap = new Map<string, LotChangeKysely[]>();

		for (const changeSet of changeSets) {
			// Group changes by price and acquisition date
			const priceAndDateGroups = new Map<string, Decimal>();

			for (const change of changeSet) {
				const date = change.acquiredDate.toISOString();
				const key = `${change.price.toString()}:${date}`;

				// Sum up the quantityChange for each price/date combination
				const currentSum = priceAndDateGroups.get(key) ?? new Decimal(0);
				priceAndDateGroups.set(key, currentSum.plus(change.quantityChange));
			}

			// Create a signature based on the aggregated changes per price/date
			const signature = Array.from(priceAndDateGroups.entries())
				.map(([key, totalChange]) => `${key}:${totalChange.toString()}`)
				.sort()
				.join('|');

			// Only store the first change set with this signature
			if (!changeSetMap.has(signature)) {
				changeSetMap.set(signature, changeSet);
			}
		}

		return Array.from(changeSetMap.values());
	}

	/**
	 * Maps a transaction to different buckets that we process differently
	 * Lot changes have to to the algo
	 * Income transactions are simple +/- to their respective P&L type
	 * Null means we dont really know what it is (should go to some nice error log)
	 * @param transaction The transaction to map
	 * @returns The mapped transaction type
	 */
	mapTransactionType(
		transaction: Selectable<Transaction>,
	): ProfitAndLossType | null | 'LOT_TRANSACTION_BUY' | 'LOT_TRANSACTION_SELL' {
		if (
			transaction.assetSymbol &&
			transaction.quantity &&
			transaction.price &&
			transaction.type === 'buy' &&
			transaction.subtype === 'buy'
		) {
			return 'LOT_TRANSACTION_BUY';
		} else if (
			transaction.assetSymbol &&
			transaction.quantity &&
			transaction.price &&
			transaction.type === 'sell' &&
			transaction.subtype === 'sell'
		) {
			return 'LOT_TRANSACTION_SELL';
		}

		return this.categorizeTransactionPAndL(
			transaction.type as InvestmentTransactionType,
			transaction.subtype as InvestmentTransactionSubtype,
		);
	}

	/**
	 * Determines P&L type based on transaction type and subtype
	 * @param transaction - Individual transaction
	 * @returns ProfitAndLossType enum value or null
	 * @example
	 * const pnlType = categorizeTransaction(dividendTransaction);
	 * // Returns: ProfitAndLossType.DIVIDEND
	 */
	categorizeTransactionPAndL(
		plaidType: InvestmentTransactionType | null,
		plaidSubtype: InvestmentTransactionSubtype,
	): ProfitAndLossType | null {
		if (!plaidType || !plaidSubtype) {
			return null;
		}

		try {
			// Look up the P&L type in the mapping
			const typeMapping = TRANSACTION_PNL_MAPPING[plaidType];
			if (!typeMapping) {
				return null;
			}

			return typeMapping[plaidSubtype] || null;
		} catch (e) {
			this.logger.error(`Error categorizing transaction: ${e}`);
			return null;
		}
	}

	/**
	 * Aggregates P&L types to determine field mappings for RealizedPAndL table
	 * @param profitAndLossType - The specific P&L type
	 * @returns The field name in the RealizedPAndL table
	 * @example
	 * const field = mapPnlTypeToField(ProfitAndLossType.DIVIDEND);
	 * // Returns: 'dividend'
	 */
	mapPnlTypeToField: Record<ProfitAndLossType, string> = {
		[ProfitAndLossType.SHORT_TERM_CAPITAL_GAIN]: 'shortTermCapitalGain',
		[ProfitAndLossType.LONG_TERM_CAPITAL_GAIN]: 'longTermCapitalGain',
		[ProfitAndLossType.DIVIDEND]: 'dividend',
		[ProfitAndLossType.QUALIFIED_DIVIDEND]: 'qualifiedDividend',
		[ProfitAndLossType.NON_QUALIFIED_DIVIDEND]: 'nonQualifiedDividend',
		[ProfitAndLossType.DIVIDEND_REINVESTMENT]: 'dividendReinvestment',
		[ProfitAndLossType.INTEREST]: 'interest',
		[ProfitAndLossType.INTEREST_REINVESTMENT]: 'interestReinvestment',
		[ProfitAndLossType.DISTRIBUTION]: 'distribution',
		[ProfitAndLossType.ACCOUNT_FEE]: 'accountFee',
		[ProfitAndLossType.MANAGEMENT_FEE]: 'managementFee',
		[ProfitAndLossType.FUND_FEE]: 'fundFee',
		[ProfitAndLossType.TAX_WITHHELD]: 'taxWithheld',
		[ProfitAndLossType.NON_RESIDENT_TAX]: 'nonResidentTax',
		[ProfitAndLossType.DEPOSIT]: 'deposit',
		[ProfitAndLossType.WITHDRAWAL]: 'withdrawal',
		[ProfitAndLossType.CONTRIBUTION]: 'contribution',
		[ProfitAndLossType.RETURN_OF_PRINCIPAL]: 'returnOfPrincipal',
		[ProfitAndLossType.LOAN_PAYMENT]: 'loanPayment',
		[ProfitAndLossType.MARGIN_EXPENSE]: 'marginExpense',
		[ProfitAndLossType.STOCK_DISTRIBUTION]: 'stockDistribution',
		[ProfitAndLossType.UNQUALIFIED_GAIN]: 'unqualifiedGain',
	};
}
