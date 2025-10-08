'use client';

import { Button } from '@repo/ui/components/button';
import { OnboardingCompleteStep } from '~/components/onboarding-complete-step';
import type { PortfolioConnectItemDetailFragment } from '~/generated/gql';

interface PreviewHarvestsProps {
	isEtrade: boolean;
	onConnectPlaid: () => void;
	onComplete: () => void;
	portfolioConnectItem: PortfolioConnectItemDetailFragment;
}

/**
 * Preview harvests component showing harvest results
 * Different actions based on broker type
 *
 */
export function PreviewHarvests({
	isEtrade,
	onConnectPlaid,
	onComplete,
	portfolioConnectItem,
}: PreviewHarvestsProps) {
	return (
		<div className="p-8">
			<OnboardingCompleteStep portfolioConnectItem={portfolioConnectItem} />

			<div className="mt-6 flex justify-between gap-2 border-t pt-6">
				<Button variant="outline" disabled>
					Back
				</Button>
				{isEtrade ? (
					<Button onClick={onConnectPlaid}>Connect Plaid</Button>
				) : (
					<Button onClick={onComplete}>Complete</Button>
				)}
			</div>
		</div>
	);
}
