'use client';

import { ArrowRight } from 'lucide-react';
import { usePortfolioSummaryQuery } from '~/generated/gql';
import { Format, MoneyUtil } from '~/modules/utils';

/**
 * Sticky footer component displaying portfolio summary metrics in a compact horizontal layout.
 * Shows unrealized losses, unrealized gains, realized P&L, and projected tax bill.
 * @example
 * ```tsx
 * <ModelSummaryFooter />
 * ```
 */
export function ModelSummaryFooter() {
	const { data, loading } = usePortfolioSummaryQuery();

	const getAmountColor = (amount: number | undefined) => {
		const direction = MoneyUtil.amountDirection(amount);
		return direction === 'positive'
			? 'text-green-600'
			: direction === 'negative'
				? 'text-red-600'
				: 'text-foreground';
	};

	// Calculate projected tax bill
	// Using simplified tax rates: 20% for long-term, 37% for short-term capital gains
	const longTermGain = Number(data?.portfolioSummary.realized.longTermCapitalGain || 0);
	const shortTermGain = Number(data?.portfolioSummary.realized.shortTermCapitalGain || 0);
	const projectedTaxBill = longTermGain * 0.2 + shortTermGain * 0.37;

	const unrealizedLosses = Number(data?.portfolioSummary.unrealized.lossTotal || 0);
	const unrealizedGains = Number(data?.portfolioSummary.unrealized.gainTotal || 0);
	const realizedPL = Number(data?.portfolioSummary.realized.gainTotal || 0);

	if (loading) {
		return null;
	}

	return (
		<div className="fixed bottom-0 left-0 right-0 z-20 w-full border-t bg-black">
			<div className="container w-full mx-auto">
				<div className="flex items-center justify-between py-4">
					<div className="flex items-center gap-16">
						<div className="flex flex-col">
							<span className="text-sm text-muted-foreground">
								Unrealized Losses
							</span>
							<span
								className={`text-2xl font-semibold ${getAmountColor(unrealizedLosses)}`}
							>
								{Format.money(unrealizedLosses)}
							</span>
						</div>

						<div className="flex flex-col">
							<span className="text-sm text-muted-foreground">
								Unrealized Gains
							</span>
							<span
								className={`text-2xl font-semibold ${getAmountColor(unrealizedGains)}`}
							>
								{Format.money(unrealizedGains)}
							</span>
						</div>

						<div className="flex flex-col">
							<span className="text-sm text-muted-foreground">
								Gains/Losses
							</span>
							<span
								className={`text-2xl font-semibold ${getAmountColor(realizedPL)}`}
							>
								{Format.money(realizedPL)}
							</span>
						</div>
					</div>

					<ArrowRight className="mx-8 h-6 w-6 text-primary" />

					<div className="flex flex-col">
						<span className="text-sm text-muted-foreground">
							Projected Tax Bill
						</span>
						<span
							className={`text-2xl font-semibold ${getAmountColor(projectedTaxBill)}`}
						>
							{Format.money(projectedTaxBill)}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}
