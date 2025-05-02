import { Check } from 'lucide-react';
import { Button } from '@repo/ui/components/button';
import { Decimal } from 'decimal.js';

import { Format } from '~/modules/utils';
import type { LotOpportunityItemFragment } from '~/generated/gql';

interface HarvestingOpportunityCardProps {
  lot: LotOpportunityItemFragment;
}

export function HarvestingOpportunityCard({
  lot,
}: HarvestingOpportunityCardProps) {
  // Determine if this is a gain position by comparing current value to cost basis
  const costBasis = new Decimal(lot.costTotal ?? 0);
  const currentValue = new Decimal(lot.asset.lastPrice ?? 0).mul(
    lot.remainingQty ?? 0
  );
  const isGain = currentValue.gt(costBasis);

  // Calculate the unrealized gain/loss
  const unrealizedGainLoss = costBasis.minus(currentValue).abs();
  const symbol = lot.asset.symbol;
  const purchaseDate = lot.acquiredDate
    ? new Date(lot.acquiredDate).toLocaleDateString()
    : 'Unknown';
  const quantity = lot.remainingQty || 0;

  // Calculate tax savings (assume 25% rate for gains if not provided by backend)
  let potentialTaxSavings = unrealizedGainLoss.mul(0.3);
  // If we're showing a gain position but tax savings is 0, let's calculate an estimated tax savings
  if (isGain && potentialTaxSavings.lte(0)) {
    // Assume 25% tax rate for capital gains
    potentialTaxSavings = unrealizedGainLoss.mul(0.3);
  }

  return (
    <div className="bg-muted mb-6 overflow-hidden rounded-lg border shadow-md">
      {/* Header row */}
      <div className="bg-muted flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="bg-muted-foreground text-background flex h-8 w-8 items-center justify-center rounded-full font-bold uppercase">
            {symbol.substring(0, 2)}
          </div>
          <div>
            <h3 className="font-semibold">{symbol}</h3>
            <div className="flex items-center text-xs">
              {/* {lot.opportunityType === 'loss' ? (
                <span className="text-muted-foreground">Harvest Loss</span>
              ) : lot.opportunityType === 'gain' ? (
                <span className="text-muted-foreground">Offset Gains</span>
              ) : (
                <span className="text-muted-foreground">
                  {isGain ? 'Offset Gains' : 'Harvest Loss'}
                </span>
              )} */}
            </div>
          </div>
        </div>

        <div className="text-right">
          <Button>
            <Check className="mr-2 h-4 w-4" /> Add Reminder
          </Button>
        </div>
      </div>

      {/* Details row */}
      <div className="flex flex-wrap border border-t px-4 py-4">
        {/* Left side - first 4 fields */}
        <div className="grid flex-1 grid-cols-2 gap-x-4 gap-y-4 md:grid-cols-4">
          <div>
            <div className="text-muted-foreground text-sm">Quantity</div>
            <div className="text-base">{quantity.toString()} shares</div>
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
            <div className="text-sm text-[#AAAAAA]">
              {isGain ? 'Potential Gain' : 'Potential Loss'}
            </div>
            <div
              className={`text-base ${isGain ? 'text-green-500' : 'text-red-500'}`}
            >
              {isGain
                ? Format.money(unrealizedGainLoss.toString())
                : `-${Format.money(unrealizedGainLoss.toString())}`}
            </div>
          </div>

          <div>
            <div className="text-sm text-[#AAAAAA]">Tax Savings</div>
            <div className="text-base text-green-500">
              {Format.money(potentialTaxSavings.toString())}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
