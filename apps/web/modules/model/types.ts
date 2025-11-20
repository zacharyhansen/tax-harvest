import type { LotItemFragment } from '~/generated/gql';

/**
 * Represents a lot added to the model with metadata
 */
export type ModelLot = {
	id: string;
	addedAt: number;
	lot: LotItemFragment;
};

/**
 * Tax calculation results for the model
 * @example
 * ```ts
 * const calc: ModelCalculations = {
 *   unrealizedGains: 5000,
 *   unrealizedLosses: -2000,
 *   realizedGains: 0,
 *   harvestTotal: 2000,
 *   projectedTaxBill: 1250,
 * };
 * ```
 */
export type ModelCalculations = {
	unrealizedGains: number;
	unrealizedLosses: number;
	realizedGains: number;
	harvestTotal: number;
	projectedTaxBill: number;
};

/**
 * Model state storage structure for localStorage
 */
export type ModelStateStorage = {
	isPanelOpen: boolean;
	isPanelMinimized: boolean;
};
