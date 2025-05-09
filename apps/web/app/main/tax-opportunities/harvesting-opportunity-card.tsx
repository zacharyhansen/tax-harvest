import type { FiniteHarvestLotItemFragment } from '~/generated/gql';
import { Button } from '@repo/ui/components/button';
import { Decimal } from 'decimal.js';

import { Check } from 'lucide-react';
import { Format } from '~/modules/utils';

type HarvestingOpportunityCardProps = {
  lot: FiniteHarvestLotItemFragment;
};

export function HarvestingOpportunityCard({
  lot,
}: HarvestingOpportunityCardProps) {
  // Determine if this is a gain position by comparing current value to cost basis
  const costBasis = new Decimal(lot.costBasis ?? 0);
  const currentValue = new Decimal(lot.lastPrice ?? 0).mul(
    lot.remainingQty ?? 0,
  );
  const isGain = currentValue.gt(costBasis);

  // Calculate the unrealized gain/loss
  const unrealizedGainLoss = costBasis.minus(currentValue).abs();
  const symbol = lot.symbol;
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
    <div className="mb-6 overflow-hidden rounded-lg border bg-muted shadow-md">
      {/* Header row */}
      <div className="flex items-center justify-between bg-muted px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex size-8 items-center justify-center rounded-full bg-muted-foreground font-bold uppercase text-background">
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
            <Check className="mr-2 size-4" />
            {' '}
            Add Reminder
          </Button>
        </div>
      </div>

      {/* Details row */}
      <div className="flex flex-wrap border p-4">
        {/* Left side - first 4 fields */}
        <div className="grid flex-1 grid-cols-2 gap-4 md:grid-cols-4">
          <div>
            <div className="text-sm text-muted-foreground">Quantity</div>
            <div className="text-base">
              {Format.roundShares(quantity)}
              {' '}
              shares
            </div>
          </div>

          <div>
            <div className="text-sm text-muted-foreground">Purchase Date</div>
            <div className="text-base">{purchaseDate}</div>
          </div>

          <div>
            <div className="text-sm text-muted-foreground">Cost Basis</div>
            <div className="text-base">
              {Format.money(costBasis.toString())}
            </div>
          </div>

          <div>
            <div className="text-sm text-muted-foreground">Current Value</div>
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
