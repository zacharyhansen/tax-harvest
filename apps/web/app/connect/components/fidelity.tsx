'use client';

import { Button } from '@repo/ui/components/button';

interface FidelityProps {
	onSubmit: () => void;
	onBack: () => void;
}

/**
 * Fidelity integration component
 * Placeholder for Fidelity-specific connection flow
 *
 * @example
 * ```tsx
 * <Fidelity onSubmit={() => send({ type: 'submit' })} />
 * ```
 */
export function Fidelity({ onSubmit, onBack }: FidelityProps) {
	return (
		<div className="p-8">
			<div className="mb-6">
				<h2 className="mb-2 text-lg font-semibold">Connect Fidelity</h2>
				<p className="text-muted-foreground text-sm">
					Fidelity integration coming soon
				</p>
			</div>

			<div className="flex justify-between border-t pt-6">
				<Button variant="outline" onClick={onBack}>
					Back
				</Button>
				<Button onClick={onSubmit}>Continue</Button>
			</div>
		</div>
	);
}
