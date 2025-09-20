import Decimal from 'decimal.js';
import { Insertable, Selectable } from 'kysely';
import type { Lot, Position, Transaction } from '~/database/db.d';
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
	chosenLotChangeIndex: number | null;
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
 *
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
 * Find a subset of lots that matches the target quantity and value.
 *
 * This is a hybrid approach that first tries to find a greedy match, and if that
 * fails, it then tries to find all matching subsets using a bottom-up approach.
 *
 * @param tuples - The list of lot tuples to search through.
 * @param targetQuantity - The total quantity of the final lots. A falsy value is assumed ot be 0 (all of it is to be sold)
 * @param targetValue - The total cost basis of the final lots
 * @param maxResults - The maximum number of results to return.
 * @returns A list of lot tuples that match the target quantity and value.
 */
export function findSubsetHybrid({
	lotsData: tuples,
	targetQuantity = new Decimal(0),
	targetValue = new Decimal(0),
	maxResults = 5,
	time = true,
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

	console.info('Greedy failed, trying bottom-up approach');

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
 * @param lotDataWithMeta
 * @returns The lot changes set results that are a match for the given lot data with meta
 */
export function resolveLotChange(
	lotDataWithMeta: LotDataWithMeta,
): ResolvedLotChange {
	const { position } = lotDataWithMeta;
	const { quantity, costTotal, assetSymbol } = position;
	if (quantity === undefined && costTotal === undefined) {
		return {
			...lotDataWithMeta,
			lotChanges: [],
			chosenLotChangeIndex: null,
		};
	}

	// Attempt to find a subset of lots that matches the target quantity and value
	// findSubsetHybrid may throw unkown or timeout errors
	let results: LotDataKysely[][] = [];
	try {
		results = findSubsetHybrid({
			lotsData: lotDataWithMeta.lotData,
			targetQuantity: new Decimal(quantity),
			targetValue: new Decimal(costTotal ?? '0'),
			symbol: assetSymbol,
		});
	} catch (error) {
		return {
			...lotDataWithMeta,
			lotChanges: [],
			chosenLotChangeIndex: null,
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
				processLotChangePAndL(lotChange, lotDataWithMeta.transactionSells),
			);
		}

		lotChanges.push(lotChangesForResult);
	}

	// Not results were found
	if (lotChanges.length === 0) {
		return {
			...lotDataWithMeta,
			lotChanges: [],
			chosenLotChangeIndex: null,
		};
	}

	// Deduplicate the lot changes based on the signature of changes
	const deduplicatedLotChanges =
		deduplicateEquivalentChangeSetsKysely(lotChanges);
	const chosenLotChangeIndex = processMultiChangeSetKysely(
		deduplicatedLotChanges,
	);

	return {
		...lotDataWithMeta,
		lotChanges: deduplicatedLotChanges,
		chosenLotChangeIndex,
	};
}

export function organizeAssets({
	lots,
	transactions,
	finalPositions,
	useTestLotId = false,
}: {
	lots: Selectable<Lot>[];
	transactions: Selectable<Transaction>[];
	finalPositions: Selectable<Position>[];
	useTestLotId?: boolean;
}): Map<string, LotDataWithMeta> {
	const assetLots = new Map<string, LotDataWithMeta>();
	const newTransactions = transactions.filter((trx) => !trx.appliedToLots);
	const newBuys = newTransactions.filter(
		(t) => t.type === 'buy' && t.subtype === 'buy',
	);
	const newSells = newTransactions.filter(
		(t) => t.type === 'sell' && t.subtype === 'sell',
	);

	// Create map of tuple for each lot
	for (const lot of lots) {
		let current: LotDataWithMeta | undefined = assetLots.get(lot.assetSymbol);

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
		assetLots.set(lot.assetSymbol, current);
	}

	// Add buy transactions as new lots
	for (const trx of newBuys) {
		if (
			trx.assetSymbol &&
			trx.type === 'buy' &&
			trx.subtype === 'buy' &&
			trx.quantity &&
			trx.price
		) {
			if (!trx.transactionDate) {
				throw new Error('Transaction date is required for new buys');
			}
			let current: LotDataWithMeta | undefined = assetLots.get(trx.assetSymbol);

			if (!current) {
				// Find the position returned in the plaid endpoint (or create the default position when not returned)
				// if not returned we know the asset was completely sold (its not being returned by plaid)
				const position = finalPositions.find(
					(p) => p.assetSymbol === trx.assetSymbol,
				) ?? {
					assetSymbol: trx.assetSymbol,
					quantity: 0,
					costTotal: 0,
					portfolioId: trx.portfolioId,
				};
				current = {
					transactionBuys: [],
					transactionSells: [],
					lotData: [],
					position,
				};
			}
			current.lotData.push({
				quantity: new Decimal(trx.quantity),
				price: new Decimal(trx.price),
				lotId: !useTestLotId ? (crypto.randomUUID() as string) : 'test lot id',
				accountId: trx.accountId,
				acquiredDate: trx.transactionDate,
			});
			assetLots.set(trx.assetSymbol, current);
		}
	}

	// Add new transaction ids to the lots
	for (const trx of newBuys) {
		const current: LotDataWithMeta | undefined = assetLots.get(trx.assetSymbol);
		if (!current)
			throw new Error(
				`Lot data not found for asset symbol: ${trx.assetSymbol}`,
			);
		current.transactionBuys.push(trx);
		assetLots.set(trx.assetSymbol, current);
	}
	// Add new transaction ids to the lots
	for (const trx of newSells) {
		const current: LotDataWithMeta | undefined = assetLots.get(trx.assetSymbol);
		if (!current)
			throw new Error(
				`Lot data not found for asset symbol: ${trx.assetSymbol}`,
			);
		current.transactionSells.push(trx);
		assetLots.set(trx.assetSymbol, current);
	}

	return assetLots;
}

function isLongTerm(acquiredDate: Date) {
	return acquiredDate.getFullYear() < new Date().getFullYear() - 1;
}

export function processMultiChangeSetKysely(
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

export function processLotChangePAndL(
	lotChange: LotChangeKysely,
	transactionSells: Selectable<Transaction>[],
): LotChangeKysely {
	// Calculate the realized profit and loss - we dont need to actually know per share - just total sold and total cost basis
	// Total Sale Dollars derived from plaid transactions
	let totalSaleDollarsShortTerm = new Decimal(0);
	let totalSaleDollarsLongTerm = new Decimal(0);

	transactionSells.forEach((sell) => {
		if (isLongTerm(sell.transactionDate ?? sell.postDate ?? sell.createdAt)) {
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
	if (isLongTerm(lotChange.acquiredDate)) {
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
 * @param changeSets Array of lot change sets
 * @returns Deduplicated change sets
 */
export function deduplicateEquivalentChangeSetsKysely(
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
