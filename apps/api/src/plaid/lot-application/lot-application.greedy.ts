import Decimal from 'decimal.js';

import type { LotDataKysely } from './lot-application';

/**
 * This algo works by trying to "pay down" the target qty and value with the available lots.
 * in an assumed greedy order. If you  ever pay it all down using a lot then that is the solution and
 * any remaining lots are all sold
 * @param tuples - The list of lot tuples to search through.
 * @param targetQuantity - The total quantity of the final lots. A falsy value is assumed ot be 0 (all of it is to be sold)
 * @param targetValue - The total cost basis of the final lots
 * @param epsilonValue - The epsilon value for the target value. Default is 0.02.
 * @param epsilonQty - The epsilon value for the target quantity. Default is 0.01.
 * @param time - Whether to time the function. Default is false.
 * @returns
 */
export function findGreedySubset({
	tuples,
	targetQuantity,
	targetValue,
	epsilonValue = new Decimal(0.02),
	epsilonQty = new Decimal(0.01),
	time = false,
}: {
	tuples: LotDataKysely[];
	targetQuantity: Decimal;
	targetValue: Decimal;
	epsilonValue?: Decimal;
	epsilonQty?: Decimal;
	time?: boolean;
}): LotDataKysely[] | null {
	if (time) {
		console.time('findGreedySubset:total');
	}
	const result: LotDataKysely[] = [];

	let remainingQty = new Decimal(targetQuantity);
	let remainingVal = new Decimal(targetValue);

	if (time) {
		console.time('findGreedySubset:mainLoop');
	}

	let complete = false;
	for (const lotTuple of tuples) {
		const { quantity: availableQty, price: unitValue } = lotTuple;

		// If complete the rest is sold
		if (complete) {
			result.push({
				quantity: new Decimal(0),
				price: unitValue,
				lotId: lotTuple.lotId,
				accountId: lotTuple.accountId,
				acquiredDate: lotTuple.acquiredDate,
			});
			return result;
		}

		const maxQtyFromTuple = Decimal.min(
			availableQty,
			remainingQty,
			remainingVal.div(unitValue).floor(),
		);

		const contributionValue = maxQtyFromTuple.mul(unitValue);

		if (maxQtyFromTuple.gt(0)) {
			result.push({
				quantity: maxQtyFromTuple,
				price: unitValue,
				lotId: lotTuple.lotId,
				accountId: lotTuple.accountId,
				acquiredDate: lotTuple.acquiredDate,
			});
			remainingQty = remainingQty.minus(maxQtyFromTuple);
			remainingVal = remainingVal.minus(contributionValue);
		} else {
			result.push({
				quantity: new Decimal(0),
				price: unitValue,
				lotId: lotTuple.lotId,
				accountId: lotTuple.accountId,
				acquiredDate: lotTuple.acquiredDate,
			});
		}

		// If we've matched the target, stop early
		if (remainingQty.eq(0) && remainingVal.eq(0)) {
			complete = true;
		}
	}
	if (time) {
		console.timeEnd('findGreedySubset:mainLoop');
	}

	const found = remainingQty.lte(epsilonQty) && remainingVal.lte(epsilonValue);

	if (time) {
		console.timeEnd('findGreedySubset:total');
	}
	console.log('result', result);
	return found ? result : null; // Greedy failed to hit the target
}
