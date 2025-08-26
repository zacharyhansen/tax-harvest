import Decimal from 'decimal.js';

import type { LotData } from './lot-application';

export function findGreedySubset({
	tuples,
	targetQuantity,
	targetValue,
	epsilonValue = new Decimal(0.01),
	epsilonQty = new Decimal(0.01),
	time = true,
}: {
	tuples: LotData[];
	targetQuantity: Decimal;
	targetValue: Decimal;
	epsilonValue?: Decimal;
	epsilonQty?: Decimal;
	time?: boolean;
}): LotData[] | null {
	if (time) {
		console.time('findGreedySubset:total');
	}
	const result: LotData[] = [];

	let remainingQty = new Decimal(targetQuantity);
	let remainingVal = new Decimal(targetValue);

	if (time) {
		console.time('findGreedySubset:mainLoop');
	}
	for (const lotTuple of tuples) {
		const { quantity: availableQty, price: unitValue } = lotTuple;

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
			}); // Maintain position for consistency
		}

		// If we've matched the target, stop early
		if (remainingQty.eq(0) && remainingVal.eq(0)) {
			break;
		}
	}
	if (time) {
		console.timeEnd('findGreedySubset:mainLoop');
	}

	const found = remainingQty.lte(epsilonQty) && remainingVal.lte(epsilonValue);

	if (time) {
		console.timeEnd('findGreedySubset:total');
	}
	return found ? result : null; // Greedy failed to hit the target
}
