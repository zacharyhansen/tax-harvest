'use client';

import { Button } from '@repo/ui/components/button';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { TypedRoutes } from '~/lib/routes';

/**
 * Complete component showing success state
 * Final step in the connect flow
 *
 * @example
 * ```tsx
 * <Complete />
 * ```
 */
export function Complete() {
	return (
		<div className="p-8">
			<div className="flex flex-col items-center justify-center py-12 text-center">
				<div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
					<CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
				</div>

				<h2 className="mb-2 text-2xl font-bold">All Set!</h2>
				<p className="text-muted-foreground mb-8 max-w-md">
					Your account is connected and ready. You can now view your tax-loss
					harvesting opportunities.
				</p>

				<Link href={TypedRoutes.taxOpportunities()}>
					<Button size="lg">Go to Tax-Loss Harvesting</Button>
				</Link>
			</div>
		</div>
	);
}
