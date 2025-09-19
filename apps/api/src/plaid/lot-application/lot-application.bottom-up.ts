import Decimal from 'decimal.js';
import type { LotDataKysely } from './lot-application';

export function findAllMatchingSubsetsBottomUp({
	tuples,
	targetQuantity,
	targetValue,
	maxResults = 5,
	epsilonValue = new Decimal(0.01),
	epsilonQty = new Decimal(0.01),
	time = true,
}: {
	tuples: LotDataKysely[];
	targetQuantity: Decimal;
	targetValue: Decimal;
	maxResults?: number;
	epsilonValue?: Decimal;
	epsilonQty?: Decimal;
	time?: boolean;
}): LotDataKysely[][] {
	const startTime = Date.now();
	const timeoutMs = 5000; // 60 seconds

	const checkTimeout = () => {
		if (Date.now() - startTime > timeoutMs) {
			throw new Error(
				'findAllMatchingSubsetsBottomUp timed out after 60 seconds',
			);
		}
	};

	if (time) {
		console.time('findAllMatchingSubsetsBottomUp:total');
	}

	// Calculate the total quantity and value of all lots
	const totalQuantity = tuples.reduce(
		(sum, lot) => sum.plus(lot.quantity),
		new Decimal(0),
	);
	const totalValue = tuples.reduce(
		(sum, lot) => sum.plus(lot.quantity.mul(lot.price)),
		new Decimal(0),
	);

	// If target quantity equals total quantity, return all lots at their full quantity
	if (totalQuantity.eq(targetQuantity)) {
		console.info(
			'Target quantity matches total quantity - using all lots as is',
		);
		if (time) {
			console.timeEnd('findAllMatchingSubsetsBottomUp:total');
		}
		return [tuples.map((lot) => ({ ...lot }))];
	}

	// If the total available is less than what we need, return empty
	if (totalQuantity.lt(targetQuantity) || totalValue.lt(targetValue)) {
		if (time) {
			console.timeEnd('findAllMatchingSubsetsBottomUp:total');
		}
		return [];
	}

	// If we need exact match for both quantity and value, return them all at full quantity
	if (totalQuantity.eq(targetQuantity) && totalValue.eq(targetValue)) {
		if (time) {
			console.timeEnd('findAllMatchingSubsetsBottomUp:total');
		}
		return [tuples.map((lot) => ({ ...lot }))];
	}

	const key = (qty: Decimal, val: Decimal) =>
		`${qty.toString()}-${val.toString()}`;

	// Initialize DP table with full quantities of all lots
	const dp = new Map<string, LotDataKysely[][]>();
	dp.set(key(totalQuantity, totalValue), [tuples.map((lot) => ({ ...lot }))]);

	if (time) {
		console.time('findAllMatchingSubsetsBottomUp:mainLoop');
	}

	/**
	 * Explanation - DP
	 * Contraints
	 * 1. We can only sell whole lots
	 * 2. Solution QTY < Target QTY - Epsilon Qty
	 * 3. Solution Value < Target Value - Epsilon Value
	 *
	 * Here we go lot by lot and build a tree of every possible combination of lot sales that could be made to match the target quantity and value.
	 *
	 * We start with all lots at their full quantity.
	 * Then we iterate over each lot and reduce its quantity by 1 at a time (exit trees early if we hit a contraint basedon final value or qty) with each reduction of 1 spawning a new tree.
	 * For each reduction, we check if the remaining quantity and value are within the epsilon range of the target quantity and value so they start a new tree in the next iteration.
	 * At the end, we return the dp table.
	 * The dp table is a map of the target quantity and value to an array of combinations that match the target quantity and value.
	 * The combinations are arrays of lots that could be sold to match the target quantity and value.
	 */
	for (let i = 0; i < tuples.length; i++) {
		checkTimeout(); // Check timeout at start of each iteration

		const { quantity: _, price: val } = tuples[i];
		// dp[i + 1] = new Map();

		// IMPORTANT: Copy over all states from previous stage first and iterate on that so
		// we are not looping over the very thing we are modifying
		const initialEntries = new Map<string, LotDataKysely[][]>();
		for (const [stateKey, combinations] of dp.entries()) {
			initialEntries.set(stateKey, [...combinations]);
		}

		for (const [stateKey, combinations] of initialEntries.entries()) {
			const [currQtyStr, currValStr] = stateKey.split('-');
			const currQty = new Decimal(currQtyStr);
			const currVal = new Decimal(currValStr);

			// Consider reducing each lot's quantity from its current value
			for (const combination of combinations) {
				const currentLot = combination[i]; // The lot we're modifying in this pass
				const currentQuantity = currentLot.quantity;

				// Try each possible reduction of quantity for this lot
				for (
					let reducedQty = new Decimal(1);
					reducedQty.lte(currentQuantity);
					reducedQty = reducedQty.plus(1)
				) {
					checkTimeout(); // Check timeout in inner loop
					const newQty = currQty.minus(reducedQty);
					const newVal = currVal.minus(reducedQty.mul(val));

					// Skip if the remaining quantity is less than target
					if (
						newQty.lt(targetQuantity) ||
						newVal.lt(targetValue.minus(epsilonValue))
					) {
						continue;
					}

					// Create a new combination with the reduced quantity
					const newCombination = combination.map((lot, index) => {
						if (index === i) {
							return {
								...lot,
								quantity: lot.quantity.minus(reducedQty),
							};
						}
						return { ...lot };
					});

					const newKey = key(newQty, newVal);

					if (!dp.has(newKey)) {
						dp.set(newKey, []);
					}

					const existingCombinations = dp.get(newKey) ?? [];
					if (existingCombinations.length < maxResults) {
						const spaceLeft = maxResults - existingCombinations.length;
						dp.set(newKey, [
							...existingCombinations,
							...[newCombination].slice(0, spaceLeft),
						]);
					}
				}
			}
		}
	}

	if (time) {
		console.timeEnd('findAllMatchingSubsetsBottomUp:mainLoop');
	}

	// Instead of looking for an exact match, collect all results within epsilon range
	if (time) {
		console.time('findAllMatchingSubsetsBottomUp:epsilonMatching');
	}
	let result: LotDataKysely[][] = [];

	// Check all states in the final dp table
	for (const [stateKey, combinations] of dp.entries()) {
		const [qtyStr, valStr] = stateKey.split('-');
		const qty = new Decimal(qtyStr);
		const val = new Decimal(valStr);

		// Check if this state is within acceptable epsilon range of target
		const qtyDifference = targetQuantity.minus(qty).abs();
		const valDifference = targetValue.minus(val).abs();

		if (qtyDifference.lte(epsilonQty) && valDifference.lte(epsilonValue)) {
			// Add these combinations to our results, up to maxResults
			const spaceLeft = maxResults - result.length;
			if (spaceLeft <= 0) break;

			result = [...result, ...combinations.slice(0, spaceLeft)];

			if (result.length >= maxResults) break;
		}
	}

	if (time) {
		console.timeEnd('findAllMatchingSubsetsBottomUp:epsilonMatching');
	}

	if (time) {
		console.timeEnd('findAllMatchingSubsetsBottomUp:total');
	}
	return result;
}
