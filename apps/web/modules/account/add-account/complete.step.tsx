/** biome-ignore-all lint/correctness/noInvalidUseBeforeDeclaration: <ok> */
import NumberFlow from '@number-flow/react';
import { cn } from '@repo/ui/utils';
import { Decimal } from 'decimal.js';
import { useEffect, useState } from 'react';
import NoOpportunities from '~/app/main/tax-opportunities/no-opportunities';
import { HarvestType, useHarvestEvalResultQuery } from '~/generated/gql';
import { clientEnvironment } from '~/lib/env/clientEnvironment';
import { Format, MoneyUtil } from '~/modules/utils';

export function CompleteStep() {
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
	});

	const getFirstThreeOpportunities = () => {
		if (!data?.harvestEvalResult) return [];

		const result = data.harvestEvalResult;
		const opportunities = [];

		// Get opportunities from matched pairs (cost basis reset)
		if (result.matchedItems?.length) {
			for (const matchItem of result.matchedItems.slice(0, 3)) {
				if (matchItem.pairs.length > 0) {
					const firstPair = matchItem.pairs[0];
					// Use the source lots (typically loss positions in cost basis reset)
					const sourceLot = firstPair?.sourceLots[0];
					if (sourceLot) {
						const taxSavings = new Decimal(sourceLot.gainTotal)
							.mul(clientEnvironment.NEXT_PUBLIC_TAX_PERCENTAGE)
							.abs()
							.toNumber();

						opportunities.push({
							id: matchItem.id,
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

		// Fill remaining with individual lots if needed
		if (opportunities.length < 3 && result.lotsCurrent?.length) {
			const remainingSlots = 3 - opportunities.length;
			for (const lot of result.lotsCurrent.slice(0, remainingSlots)) {
				const taxSavings = new Decimal(lot.gainTotal)
					.mul(clientEnvironment.NEXT_PUBLIC_TAX_PERCENTAGE)
					.abs()
					.toNumber();

				opportunities.push({
					id: lot.id,
					symbol: lot.symbol,
					quantity: parseFloat(lot.availableQty),
					potentialLoss: parseFloat(lot.gainTotal),
					taxSavings,
					type: 'individual',
				});
			}
		}

		return opportunities.slice(0, 3);
	};

	useEffect(() => {
		if (data?.harvestEvalResult) {
			const timer = setTimeout(() => {
				// Calculate total potential tax savings from first 3 opportunities
				const opportunities = getFirstThreeOpportunities();
				const totalSavings = opportunities.reduce(
					(total, opp) => total + opp.taxSavings,
					0,
				);
				setTaxSavings(totalSavings);
			}, 250);
			return () => clearTimeout(timer);
		}
		// biome-ignore lint/correctness/useExhaustiveDependencies: <ok>
	}, [data, getFirstThreeOpportunities]);

	const opportunities = getFirstThreeOpportunities();

	if (loading) {
		return (
			<div className="p-8">
				<div className="py-8 text-center">
					<h2 className="mb-4 text-xl font-semibold">
						Calculating Tax Opportunities...
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

	// Handle cases where there are no harvesting opportunities
	if (
		data?.harvestEvalResult?.harvestType === HarvestType.NoOpportunityEmpty ||
		data?.harvestEvalResult?.harvestType === HarvestType.NoOpportunityGains ||
		data?.harvestEvalResult?.harvestType === HarvestType.NoOpportunityLosses
	) {
		return (
			<div className="p-8">
				<NoOpportunities
					realizedPAndL={data.harvestEvalResult.summary.realized.gainTotal}
					unrealizedPAndL={data.harvestEvalResult.summary.unrealized.total}
				/>
			</div>
		);
	}

	return (
		<div className="p-8">
			<div className="py-8 text-center">
				<h2 className="mb-4 text-xl font-semibold">Tax Savings Calculated</h2>
				<p className="mb-8 text-gray-400">
					Based on your portfolio, we think we could save you a minimum of
				</p>

				<div className="mb-8 text-5xl font-bold text-green-500">
					<NumberFlow
						value={taxSavings}
						format={{ currency: 'USD', style: 'currency' }}
					/>
				</div>

				{/* Real Tax Opportunities Display */}
				{opportunities.length > 0 && (
					<div className="mb-8">
						<h3 className="mb-4 text-left text-lg font-semibold">
							{data?.harvestEvalResult.harvestType ===
							HarvestType.ReduceCostBasis
								? 'Cost Basis Reset Opportunities:'
								: data?.harvestEvalResult.harvestType ===
										HarvestType.ReduceTaxes
									? 'Tax Loss Harvesting Opportunities:'
									: 'Tax Opportunities:'}
						</h3>
						<div className="space-y-3">
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
					</div>
				)}
			</div>
		</div>
	);
}
