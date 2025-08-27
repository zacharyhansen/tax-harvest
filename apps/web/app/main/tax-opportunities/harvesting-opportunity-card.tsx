import { Button } from '@repo/ui/components/button';
import { toast } from '@repo/ui/components/toast-sonner';
import { cn } from '@repo/ui/utils';
import { Decimal } from 'decimal.js';
import { Wheat } from 'lucide-react';
import type { FiniteHarvestLotItemFragment } from '~/generated/gql';
import {
	HarvestEvalResultDocument,
	HarvestsAndTransactionsDocument,
	HarvestType,
	useCreateHarvestMutation,
} from '~/generated/gql';
import { clientEnvironment } from '~/lib/env/clientEnvironment';
import { Format, MoneyUtil } from '~/modules/utils';

type HarvestingOpportunityCardProps = {
	lot: FiniteHarvestLotItemFragment;
	harvestType: HarvestType;
	remainingHarvestTarget: number;
};

export function HarvestingOpportunityCard({
	lot,
	harvestType,
	remainingHarvestTarget,
}: HarvestingOpportunityCardProps) {
	const [createHarvest, { loading: isHarvesting }] = useCreateHarvestMutation({
		refetchQueries: [
			HarvestEvalResultDocument,
			HarvestsAndTransactionsDocument,
		],
		awaitRefetchQueries: true,
	});

	// Determine if this is a gain position by comparing current value to cost basis
	const costBasis = new Decimal(lot.costBasis ?? 0);
	const currentValue = new Decimal(lot.lastPrice ?? 0).mul(
		lot.availableQty ?? 0,
	);
	const purchaseDate = lot.acquiredDate
		? new Date(lot.acquiredDate).toLocaleDateString()
		: 'Unknown';
	const quantity = new Decimal(lot.availableQty);
	const sellQuantity = Math.round(
		Math.min(
			new Decimal(remainingHarvestTarget)
				.abs()
				.div(lot.dollarPerSharePnL)
				.abs()
				.toNumber(),
			quantity.toNumber(),
		),
	);
	const sellAmount = new Decimal(lot.dollarPerSharePnL).mul(sellQuantity);
	console.log({
		lot,
		sellAmount: sellAmount.toString(),
		sellQuantity,
		quantity: quantity.toString(),
	});
	const taxSavings = sellAmount.mul(
		clientEnvironment.NEXT_PUBLIC_TAX_PERCENTAGE,
	);
	const colorClass = MoneyUtil.colored(taxSavings.toNumber());

	return (
		<div
			className={cn(
				'bg-muted mb-2 overflow-hidden rounded-lg border shadow-md transition-all duration-300',
			)}
		>
			{/* Header row */}
			<div
				className={cn(
					'bg-muted flex items-center justify-between px-4 py-3 transition-colors duration-300',
				)}
			>
				<div className="flex items-center gap-3">
					<div className="bg-muted-foreground text-background flex h-8 items-center justify-center rounded-lg px-2 font-bold uppercase">
						{lot.symbol}
					</div>
					<div>
						<h3 className="font-semibold">{lot.symbol}</h3>
						<div className="flex items-center text-xs">
							{harvestType === HarvestType.ReduceTaxes ? (
								<span className="text-muted-foreground">Harvest Loss</span>
							) : harvestType === HarvestType.CaptureGainsTaxFree ? (
								<span className="text-muted-foreground">Offset Gains</span>
							) : (
								<span className="text-muted-foreground">
									{harvestType === HarvestType.ReduceCostBasis
										? 'Harvest Loss'
										: 'Offset Gains'}
								</span>
							)}
						</div>
					</div>
				</div>

				<div className="flex items-center gap-2">
					<Button
						disabled={isHarvesting}
						onClick={() =>
							toast.promise(
								createHarvest({
									variables: {
										directedHarvestLots: [
											{
												lotId: lot.id,
												quantity: Number(lot.remainingQty),
												counterTransaction: false,
											},
										],
										harvestType: HarvestType.ReduceCostBasis,
									},
								}),
								{
									loading: 'Adding to harvest...',
									success: 'Added to harvest successfully',
									error: 'Failed to add to harvest',
								},
							)
						}
					>
						<Wheat className="mr-2 size-4" /> Add to Harvests
					</Button>
				</div>
			</div>

			{/* Details row */}
			<div className="flex flex-wrap border p-4">
				{/* Left side - first 4 fields */}
				<div className="grid flex-1 grid-cols-2 gap-4 md:grid-cols-4">
					<div>
						<div className="text-muted-foreground text-sm">Quantity</div>
						<div className="text-base">
							{Format.roundShares(sellQuantity) === Format.roundShares(quantity)
								? Format.roundShares(sellQuantity)
								: `${Format.roundShares(sellQuantity)} of ${Format.roundShares(quantity)}`}{' '}
							shares
						</div>
					</div>

					<div>
						<div className="text-muted-foreground text-sm">Purchase Date</div>
						<div className="text-base">{purchaseDate}</div>
					</div>

					<div>
						<div className="text-muted-foreground text-sm">Cost Basis</div>
						<div className="text-base">
							{Format.money(costBasis.toString())}
						</div>
					</div>

					<div>
						<div className="text-muted-foreground text-sm">Current Value</div>
						<div className="text-base">
							{Format.money(currentValue.toString())}
						</div>
					</div>
				</div>

				{/* Right side - gain/loss and savings, right-aligned */}
				<div className="mt-4 flex w-full flex-col justify-end md:mt-0 md:w-auto md:flex-row md:gap-8">
					<div className="mb-2 md:mb-0">
						<div className="text-muted-foreground text-sm">
							{harvestType === HarvestType.ReduceTaxes
								? 'Potential Loss'
								: 'Potential Gain'}
						</div>
						<div className={cn('text-base', colorClass)}>
							{Format.money(sellAmount.toString())}
						</div>
					</div>

					<div>
						<div className="text-muted-foreground text-sm">Tax Savings</div>
						<div className="text-base text-green-500">
							{Format.money(taxSavings.abs().toString())}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
