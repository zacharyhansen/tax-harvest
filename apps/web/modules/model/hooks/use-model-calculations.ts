'use client';

import { useMemo } from 'react';
import { usePortfolioLotsQuery } from '~/generated/gql';

/**
 * Hook that accepts lot IDs and returns mock tax calculations
 * @param lotIds - Array of lot IDs to include in calculations
 * @returns Calculation results and loading state
 * @example
 * ```tsx
 * const {
 *   unrealizedGains,
 *   unrealizedLosses,
 *   projectedTaxBill,
 *   loading
 * } = useModelCalculations(['lot1', 'lot2']);
 * ```
 */
export function useModelCalculations(lotIds: string[]) {
	const { data, loading } = usePortfolioLotsQuery();

	const calculations = useMemo(() => {
		if (!data?.lots) {
			return {
				unrealizedGains: 0,
				unrealizedLosses: 0,
				realizedGains: 0,
				harvestTotal: 0,
				projectedTaxBill: 0,
			};
		}

		// Filter to only lots in the model, or use all lots if none are selected
		const modelLots = lotIds.length > 0
			? data.lots.filter((lot) => lotIds.includes(lot.id))
			: data.lots;

		let totalGains = 0;
		let totalLosses = 0;

		modelLots.forEach((lot) => {
			const costBasis = Number(lot.remainingQty || 0) * Number(lot.price || 0);
			const currentValue =
				Number(lot.remainingQty || 0) * Number(lot.asset.lastPrice || 0);
			const gain = currentValue - costBasis;

			if (gain > 0) {
				totalGains += gain;
			} else {
				totalLosses += Math.abs(gain);
			}
		});

		// Mock tax calculation:
		// Simplified: 20% on long-term gains, 37% on short-term gains
		// For this mock, we'll use 25% average
		const projectedTaxBill = totalGains * 0.25;

		return {
			unrealizedGains: totalGains,
			unrealizedLosses: -totalLosses, // Negative value
			realizedGains: 0, // Model doesn't have realized gains (not executed)
			harvestTotal: totalLosses, // Harvestable amount = losses
			projectedTaxBill,
		};
	}, [data?.lots, lotIds]);

	return {
		...calculations,
		loading,
	};
}
