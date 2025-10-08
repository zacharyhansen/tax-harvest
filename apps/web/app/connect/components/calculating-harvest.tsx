'use client';

import { Button } from '@repo/ui/components/button';
import { useEffect } from 'react';
import { AnalyzeStep } from '~/modules/account/add-account/analyze.step';

interface CalculatingHarvestProps {
	onComplete: () => void;
	onBack: () => void;
}

/**
 * Calculating harvest component that shows analysis animation
 * Automatically proceeds to next step when complete
 *
 * @example
 * ```tsx
 * <CalculatingHarvest
 *   onComplete={() => send({ type: 'calculating_complete' })}
 * />
 * ```
 */
export function CalculatingHarvest({
	onComplete,
	onBack,
}: CalculatingHarvestProps) {
	useEffect(() => {
		// Auto-complete after a delay to simulate processing
		const timer = setTimeout(() => {
			onComplete();
		}, 3000);

		return () => clearTimeout(timer);
	}, [onComplete]);

	return (
		<div className="p-8">
			<AnalyzeStep onAnimationsComplete={onComplete} />

			<div className="mt-6 flex justify-start border-t pt-6">
				<Button variant="outline" onClick={onBack}>
					Back
				</Button>
			</div>
		</div>
	);
}
