import NumberFlow from '@number-flow/react';
import { Alert, AlertDescription, AlertTitle } from '@repo/ui/components/alert';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@repo/ui/components/card';
import { cn } from '@repo/ui/utils';
import { Decimal } from 'decimal.js';
import { FileText, Info, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
	HarvestType,
	type PortfolioConnectItemDetailFragment,
	useHarvestEvalResultQuery,
} from '~/generated/gql';
import { clientEnvironment } from '~/lib/env/clientEnvironment';
import { Format, MoneyUtil } from '~/modules/utils';

/**
 * Represents a tax harvesting opportunity
 */
interface Opportunity {
	id: string;
	symbol: string;
	quantity: number;
	potentialLoss: number;
	taxSavings: number;
	type: 'matched' | 'individual';
}

/**
 * OnboardingCompleteStep component that displays tax opportunities analysis for CSV upload
 * with onboarding-specific messaging that encourages Plaid connection for better analysis
 */
export function OnboardingCompleteStep({
	portfolioConnectItem,
}: {
	portfolioConnectItem: PortfolioConnectItemDetailFragment;
}) {
	const [taxSavings, setTaxSavings] = useState(0);

	const { data, loading } = useHarvestEvalResultQuery({
		variables: {
			filters: {
				minPAndL: 0,
				excludeAssetSymbols: [],
				purchaseDateBefore: null,
				purchaseDateAfter: null,
			},
		},
		fetchPolicy: 'cache-first',
	});

	const getAllOpportunities = () => {
		if (!data?.harvestEvalResult) return [];

		const result = data.harvestEvalResult;
		const opportunitiesMap = new Map<string, Opportunity>();

		// Get opportunities from matched pairs (cost basis reset)
		if (result.matchedItems?.length) {
			for (const matchItem of result.matchedItems) {
				if (matchItem.pairs.length > 0) {
					const firstPair = matchItem.pairs[0];
					// Use the source lots (typically loss positions in cost basis reset)
					const sourceLot = firstPair?.sourceLots[0];
					if (sourceLot) {
						const taxSavings = new Decimal(sourceLot.gainTotal)
							.mul(clientEnvironment.NEXT_PUBLIC_TAX_PERCENTAGE)
							.abs()
							.toNumber();

						const existing = opportunitiesMap.get(sourceLot.symbol);
						if (existing) {
							// Merge with existing opportunity
							existing.quantity += parseFloat(sourceLot.availableQty);
							existing.potentialLoss += parseFloat(sourceLot.gainTotal);
							existing.taxSavings += taxSavings;
						} else {
							// Create new opportunity
							opportunitiesMap.set(sourceLot.symbol, {
								id: `${sourceLot.symbol}-merged`,
								symbol: sourceLot.symbol,
								quantity: parseFloat(sourceLot.availableQty),
								potentialLoss: parseFloat(sourceLot.gainTotal),
								taxSavings,
								type: 'matched',
							});
						}
					}
				}
			}
		}

		// Add all individual lots
		if (result.lotsCurrent?.length) {
			for (const lot of result.lotsCurrent) {
				const taxSavings = new Decimal(lot.gainTotal)
					.mul(clientEnvironment.NEXT_PUBLIC_TAX_PERCENTAGE)
					.abs()
					.toNumber();

				const existing = opportunitiesMap.get(lot.symbol);
				if (existing) {
					// Merge with existing opportunity
					existing.quantity += parseFloat(lot.availableQty);
					existing.potentialLoss += parseFloat(lot.gainTotal);
					existing.taxSavings += taxSavings;
				} else {
					// Create new opportunity
					opportunitiesMap.set(lot.symbol, {
						id: `${lot.symbol}-merged`,
						symbol: lot.symbol,
						quantity: parseFloat(lot.availableQty),
						potentialLoss: parseFloat(lot.gainTotal),
						taxSavings,
						type: 'individual',
					});
				}
			}
		}

		// Convert map to array and sort by tax savings (descending)
		return Array.from(opportunitiesMap.values()).sort(
			(a, b) => b.taxSavings - a.taxSavings,
		);
	};

	useEffect(() => {
		if (data?.harvestEvalResult) {
			const timer = setTimeout(() => {
				// Calculate total potential tax savings from all opportunities
				const opportunities = getAllOpportunities();
				const totalSavings = opportunities.reduce(
					(total, opp) => total + opp.taxSavings,
					0,
				);
				setTaxSavings(totalSavings);
			}, 250);
			return () => clearTimeout(timer);
		}
		// biome-ignore lint/correctness/useExhaustiveDependencies: <ok>
	}, [data, getAllOpportunities]);

	const opportunities = getAllOpportunities();

	if (loading) {
		return (
			<div className="p-8">
				<div className="py-8 text-center">
					<h2 className="mb-4 text-xl font-semibold">
						Analyzing Your Data{' '}
						<Loader2 className="inline-block animate-spin" />
					</h2>
					<div className="mb-8 text-5xl font-bold text-green-500">
						<NumberFlow
							value={0}
							format={{ currency: 'USD', style: 'currency' }}
						/>
					</div>
				</div>
			</div>
		);
	}

	// Handle cases where there are no harvesting opportunities - CSV-focused messaging
	if (
		data?.harvestEvalResult?.harvestType === HarvestType.NoOpportunityEmpty ||
		data?.harvestEvalResult?.harvestType === HarvestType.NoOpportunityGains ||
		data?.harvestEvalResult?.harvestType === HarvestType.NoOpportunityLosses
	) {
		return (
			<div className="p-8">
				<Card className="overflow-hidden">
					<CardHeader className="border-b">
						<div className="flex items-center gap-3">
							<div className="bg-background rounded-full p-2">
								<FileText className="text-muted-foreground size-5" />
							</div>
							<div className="flex-1">
								<CardTitle className="text-lg">CSV Analysis Complete</CardTitle>
								<CardDescription>
									No harvesting opportunities found in your uploaded data
								</CardDescription>
							</div>
						</div>
					</CardHeader>

					<CardContent className="space-y-6 pt-6">
						<div>
							<p className="text-muted-foreground leading-relaxed">
								Based on your CSV file, we haven't identified any immediate
								tax-loss harvesting opportunities. This could be because your
								positions are performing well, or the CSV data may not include
								your complete portfolio picture.
							</p>
						</div>

						<Alert variant="info" className="">
							<Info className="" />
							<AlertTitle className="">
								Connect Plaid for Complete Analysis
							</AlertTitle>
							<AlertDescription className="">
								Connecting your brokerage account through Plaid will give us
								real-time access to your complete portfolio, including recent
								transactions, cost basis information, and positions that might
								not be in your CSV. This often reveals additional harvesting
								opportunities.
							</AlertDescription>
						</Alert>

						<div className="text-center">
							<p className="text-muted-foreground text-sm">
								Many users discover significant tax savings after connecting
								their accounts
							</p>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="p-8 max-h-[60vh] overflow-y-auto">
			<div className="text-center">
				<h2 className="mb-4 text-xl font-semibold">
					Tax Savings Found for {portfolioConnectItem.plaidInstitution.name}
				</h2>
				<p className="mb-8 text-gray-400">
					Based on your uploaded portfolio data, we've identified potential
					savings of
				</p>

				<div className="mb-8 text-5xl font-bold text-green-500">
					<NumberFlow
						value={taxSavings}
						format={{ currency: 'USD', style: 'currency' }}
					/>
				</div>

				{/* Real Tax Opportunities Display */}
				{opportunities.length > 0 && (
					<div className="mb-2">
						<h3 className="mb-4 text-left text-lg font-semibold">
							{data?.harvestEvalResult.harvestType ===
							HarvestType.ReduceCostBasis
								? `(${opportunities.length}) Cost Basis Reset Opportunities from ${portfolioConnectItem.plaidInstitution.name}:`
								: data?.harvestEvalResult.harvestType ===
										HarvestType.ReduceTaxes
									? `(${opportunities.length}) Tax Loss Harvesting Opportunities from ${portfolioConnectItem.plaidInstitution.name}:`
									: `Tax Opportunities from CSV (${opportunities.length}):`}
						</h3>
						<div className="max-h-96 space-y-3 overflow-y-auto">
							{opportunities.map((opportunity) => (
								<div
									key={opportunity.id}
									className="bg-muted flex items-center justify-between rounded-lg border p-4"
								>
									<div className="text-left">
										<div className="flex items-center gap-2">
											<span className="font-semibold">
												{opportunity.symbol}
											</span>
											<span className="text-muted-foreground text-sm">
												{Format.roundShares(opportunity.quantity)} shares
											</span>
										</div>
										<div
											className={cn(
												'text-sm',
												MoneyUtil.colored(opportunity.potentialLoss),
											)}
										>
											{Format.money(opportunity.potentialLoss)}{' '}
											{opportunity.potentialLoss < 0
												? 'potential loss'
												: 'potential gain'}
										</div>
									</div>
									<div className="text-right">
										<div className="font-semibold text-green-400">
											{Format.money(opportunity.taxSavings)}
										</div>
										<div className="text-xs text-gray-400">Tax Savings</div>
									</div>
								</div>
							))}
						</div>

						{!portfolioConnectItem.authConnectionId && (
							<Alert className="mt-6 border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20">
								<AlertTitle className="text-blue-900 dark:text-blue-100">
									Connect Plaid to Discover More
								</AlertTitle>
								<AlertDescription className="text-blue-700 dark:text-blue-200">
									This analysis is based on your CSV data. Connecting Plaid will
									provide real-time portfolio data and may reveal additional
									harvesting opportunities not captured in your upload.
								</AlertDescription>
							</Alert>
						)}
					</div>
				)}
			</div>
		</div>
	);
}
