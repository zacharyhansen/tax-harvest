'use client';

import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@repo/ui/components/tooltip';
import { ArrowRight, Info } from 'lucide-react';
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

	const unrealizedLosses = Number(
		data?.portfolioSummary.unrealized.lossTotal || 0,
	);
	const unrealizedGains = Number(
		data?.portfolioSummary.unrealized.gainTotal || 0,
	);
	const realizedPL = Number(data?.portfolioSummary.realized.gainTotal || 0);
	const projectedTaxBill = Number(
		data?.portfolioSummary.realized.estimatedTaxBill?.total || 0,
	);

	// Get the tax bill breakdown for tooltip
	const taxBill = data?.portfolioSummary.realized.estimatedTaxBill;

	if (loading) {
		return null;
	}

	return (
		<div className="fixed bottom-0 left-0 right-0 z-20 w-full border-t bg-background">
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

					<TooltipProvider delayDuration={100}>
						<Tooltip>
							<TooltipTrigger asChild>
								<div className="flex flex-col cursor-help">
									<span className="text-sm text-muted-foreground flex items-center gap-1">
										<Info className="h-3 w-3" />
										Projected Tax Bill
									</span>
									<span
										className={`text-2xl font-semibold ${getAmountColor(projectedTaxBill)}`}
									>
										{Format.money(projectedTaxBill)}
									</span>
								</div>
							</TooltipTrigger>
							<TooltipContent className="max-w-md p-4">
								<div className="space-y-2">
									<div className="font-semibold text-base mb-3">
										Tax Breakdown
									</div>
									{taxBill?.shortTermCapitalGain &&
										taxBill.shortTermCapitalGain.result > 0 && (
											<div className="flex justify-between gap-4 text-xs">
												<span>
													Short-Term Capital Gains ({(taxBill.shortTermCapitalGain.rate * 100).toFixed(0)}%)
												</span>
												<span className="font-mono pl-4">
													{Format.money(taxBill.shortTermCapitalGain.result)}
												</span>
											</div>
										)}
									{taxBill?.longTermCapitalGain &&
										taxBill.longTermCapitalGain.result > 0 && (
											<div className="flex justify-between gap-4 text-xs">
												<span>
													Long-Term Capital Gains ({(taxBill.longTermCapitalGain.rate * 100).toFixed(0)}%)
												</span>
												<span className="font-mono pl-4">
													{Format.money(taxBill.longTermCapitalGain.result)}
												</span>
											</div>
										)}
									{taxBill?.dividend && taxBill.dividend.result > 0 && (
										<div className="flex justify-between gap-4 text-xs">
											<span>
												Dividends ({(taxBill.dividend.rate * 100).toFixed(0)}%)
											</span>
											<span className="font-mono pl-4">
												{Format.money(taxBill.dividend.result)}
											</span>
										</div>
									)}
									{taxBill?.qualifiedDividend &&
										taxBill.qualifiedDividend.result > 0 && (
											<div className="flex justify-between gap-4 text-xs">
												<span>
													Qualified Dividends ({(taxBill.qualifiedDividend.rate * 100).toFixed(0)}%)
												</span>
												<span className="font-mono pl-4">
													{Format.money(taxBill.qualifiedDividend.result)}
												</span>
											</div>
										)}
									{taxBill?.nonQualifiedDividend &&
										taxBill.nonQualifiedDividend.result > 0 && (
											<div className="flex justify-between gap-4 text-xs">
												<span>
													Non-Qualified Dividends ({(taxBill.nonQualifiedDividend.rate * 100).toFixed(0)}%)
												</span>
												<span className="font-mono pl-4">
													{Format.money(taxBill.nonQualifiedDividend.result)}
												</span>
											</div>
										)}
									{taxBill?.interest && taxBill.interest.result > 0 && (
										<div className="flex justify-between gap-4 text-xs">
											<span>
												Interest ({(taxBill.interest.rate * 100).toFixed(0)}%)
											</span>
											<span className="font-mono pl-4">
												{Format.money(taxBill.interest.result)}
											</span>
										</div>
									)}
									{taxBill?.distribution &&
										taxBill.distribution.result > 0 && (
											<div className="flex justify-between gap-4 text-xs">
												<span>
													Distributions ({(taxBill.distribution.rate * 100).toFixed(0)}%)
												</span>
												<span className="font-mono pl-4">
													{Format.money(taxBill.distribution.result)}
												</span>
											</div>
										)}
									{taxBill?.stockDistribution &&
										taxBill.stockDistribution.result > 0 && (
											<div className="flex justify-between gap-4 text-xs">
												<span>
													Stock Distributions ({(taxBill.stockDistribution.rate * 100).toFixed(0)}%)
												</span>
												<span className="font-mono pl-4">
													{Format.money(taxBill.stockDistribution.result)}
												</span>
											</div>
										)}
									<div className="border-t pt-2 mt-2 flex justify-between gap-4 font-semibold">
										<span>Total Tax</span>
										<span className="font-mono pl-4">
											{Format.money(projectedTaxBill)}
										</span>
									</div>
								</div>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</div>
			</div>
		</div>
	);
}
