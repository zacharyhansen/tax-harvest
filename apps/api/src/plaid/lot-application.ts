import type { Prisma } from '@prisma/client';
import Decimal from 'decimal.js';

import { findAllMatchingSubsetsBottomUp } from './lot-application.bottom-up';
import { findGreedySubset } from './lot-application.greedy';

/**
 * A lot's quantity and average price.
 */
export interface LotData {
	quantity: Decimal;
	price: Decimal;
	lotId: string;
	accountId: string;
	acquiredDate: Date;
	isNewBuy?: boolean;
}

export interface LotChange extends LotData {
	quantityFinal: Decimal;
	quantityChange: Decimal;
	upsert: Prisma.LotCreateInput;
	symbol: string;
}

export interface TMultiChangeSet {
	options: LotChange[][];
	targetValue?: Decimal;
	targetQuantity?: Decimal;
	symbol: string;
}

export interface TNoResultsForAsset {
	targetValue?: Decimal;
	targetQuantity?: Decimal;
	symbol: string;
	results: LotData[][];
}

interface FindSubsetHybridArgs {
	lotsData: LotData[];
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
}: FindSubsetHybridArgs): LotData[][] {
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

export function findLotChangeSets(
	params: FindSubsetHybridArgs,
	portfolioId: string,
): {
	lotChanges: LotChange[];
	multiChangeSet: TMultiChangeSet | null;
	noResultsForAsset: TNoResultsForAsset | null;
} {
	if (params.targetQuantity === undefined && params.targetValue === undefined) {
		return { lotChanges: [], multiChangeSet: null, noResultsForAsset: null };
	}

	const results = findSubsetHybrid({ ...params });

	const lotChanges: LotChange[][] = [];

	for (const result of results) {
		const lotChangesForResult: LotChange[] = [];

		for (const [index, resultLot] of result.entries()) {
			const originalLot = params.lotsData[index];
			const lotChange: LotChange = {
				...originalLot,
				quantityChange: originalLot.quantity.minus(resultLot.quantity),
				quantityFinal: resultLot.quantity,
				symbol: params.symbol,
				upsert: {
					id: resultLot.lotId,
					account: {
						connect: {
							id: resultLot.accountId,
						},
					},
					remainingQty: resultLot.quantity,
					asset: {
						connect: {
							symbol: params.symbol,
						},
					},
					price: resultLot.price,
					acquiredDate: resultLot.acquiredDate,
					portfolio: {
						connect: {
							id: portfolioId,
						},
					},
				},
			};

			lotChangesForResult.push(lotChange);
		}

		lotChanges.push(lotChangesForResult);
	}

	// Deduplicate the lot changes based on the signature of changes
	const uniqueLotChangeSolutions = deduplicateEquivalentChangeSets(lotChanges);

	if (results.length === 0) {
		return {
			lotChanges: [],
			multiChangeSet: null,
			noResultsForAsset: {
				results,
				targetValue: params.targetValue,
				targetQuantity: params.targetQuantity,
				symbol: params.symbol,
			},
		};
	} else if (uniqueLotChangeSolutions.length > 1) {
		return {
			lotChanges: processMultiChangeSet(uniqueLotChangeSolutions),
			multiChangeSet: {
				options: uniqueLotChangeSolutions,
				targetValue: params.targetValue,
				targetQuantity: params.targetQuantity,
				symbol: params.symbol,
			},
			noResultsForAsset: null,
		};
		// throw err;
	}

	return {
		lotChanges: uniqueLotChangeSolutions[0],
		multiChangeSet: null,
		noResultsForAsset: null,
	};
}

export function processMultiChangeSet(
	uniqueLotChangeSolutions: LotChange[][],
): LotChange[] {
	// find the lot change with the highest number of zeroed out lots
	const indexMap = new Map<string, number>();
	for (const [index, lotChanges] of uniqueLotChangeSolutions.entries()) {
		for (const lotChangeList of lotChanges) {
			if (lotChangeList.quantityFinal.eq(0)) {
				indexMap.set(
					index.toString(),
					(indexMap.get(index.toString()) ?? 0) + 1,
				);
			}
		}
	}

	// return the LotChange with the highest number of zeroed out lots
	const maxIndex = Array.from(indexMap.entries()).reduce(
		(max, [index, count]) => {
			return count > max.count ? { index: Number(index), count } : max;
		},
		{ index: 0, count: 0 },
	);

	return uniqueLotChangeSolutions[maxIndex.index];
}

/**
 * Deduplicates changesets that are functionally equivalent (same total quantities sold for the same price/date)
 * @param changeSets Array of lot change sets
 * @returns Deduplicated change sets
 */
function deduplicateEquivalentChangeSets(
	changeSets: LotChange[][],
): LotChange[][] {
	if (changeSets.length <= 1) return changeSets;

	const changeSetMap = new Map<string, LotChange[]>();

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
