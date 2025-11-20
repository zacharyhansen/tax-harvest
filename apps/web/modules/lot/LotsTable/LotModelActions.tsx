'use client';

import { Button } from '@repo/ui/components/button';
import type { LotItemFragment } from '~/generated/gql';
import { useModelState } from '~/modules/model';

/**
 * Lot model action button component that appears on hover
 * @param lot - The lot to add/remove from model
 * @example
 * ```tsx
 * <LotModelActions lot={lotData} />
 * ```
 */
export function LotModelActions({ lot }: { lot: LotItemFragment }) {
	const { isInModel, addLot, removeLot, setIsPanelOpen } = useModelState();
	const inModel = isInModel(lot.id);

	const handleClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (inModel) {
			removeLot(lot.id);
		} else {
			// Add the entire remaining quantity of the lot to the model
			addLot(lot.id, Number(lot.remainingQty));
			// Auto-open panel when adding first lot
			setIsPanelOpen(true);
		}
	};

	// Show "Remove" always, "Add to Model" only on hover
	if (inModel) {
		return (
			<Button variant="secondary" size="sm" onClick={handleClick}>
				Remove
			</Button>
		);
	}

	return (
		<div className="opacity-0 group-hover:opacity-100 transition-opacity">
			<Button variant="link" size="sm" onClick={handleClick}>
				Add to Model
			</Button>
		</div>
	);
}
