import { Button } from '@repo/ui/components/button';
import { Card } from '@repo/ui/components/card';
import { ArrowUpCircle, Check, TrendingDown } from 'lucide-react';

import { Format } from '~/modules/utils';

export type CostBasisPairCardProps = {
  // eslint-disable-next-line ts/no-explicit-any
  pair: any;
};

export function CostBasisPairCard({ pair }: CostBasisPairCardProps) {
  if (!pair?.gainOpportunity || !pair?.lossOpportunity) {
    return null;
  }

  const { gainOpportunity, lossOpportunity } = pair;

  // Extract values for display
  const gainAmount = gainOpportunity.taxLot?.unrealizedGainLoss || 0;
  const lossAmount = Math.abs(lossOpportunity.taxLot?.unrealizedGainLoss || 0);

  // Calculate per-share values if not provided
  const gainCostBasisPerShare
    = gainOpportunity.taxLot?.costBasisPerShare
      || (gainOpportunity.taxLot?.quantity
        ? gainOpportunity.taxLot.costBasis / gainOpportunity.taxLot.quantity
        : 0);

  const lossCostBasisPerShare
    = lossOpportunity.taxLot?.costBasisPerShare
      || (lossOpportunity.taxLot?.quantity
        ? lossOpportunity.taxLot.costBasis / lossOpportunity.taxLot.quantity
        : 0);

  const gainCurrentPricePerShare
    = gainOpportunity.taxLot?.currentPricePerShare
      || gainOpportunity.holding?.currentPrice
      || (gainOpportunity.taxLot?.currentValue && gainOpportunity.taxLot?.quantity
        ? gainOpportunity.taxLot.currentValue / gainOpportunity.taxLot.quantity
        : 0);

  const lossCurrentPricePerShare
    = lossOpportunity.taxLot?.currentPricePerShare
      || lossOpportunity.holding?.currentPrice
      || (lossOpportunity.taxLot?.currentValue && lossOpportunity.taxLot?.quantity
        ? lossOpportunity.taxLot.currentValue / lossOpportunity.taxLot.quantity
        : 0);

  // Calculate days held if not provided directly
  // eslint-disable-next-line ts/no-explicit-any
  const calculateDaysHeld = (taxLot: any): number => {
    if (taxLot?.holdingPeriodDays) {
      return taxLot.holdingPeriodDays;
    }
    if (taxLot?.purchaseDate) {
      const purchaseDate = new Date(taxLot.purchaseDate);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - purchaseDate.getTime());
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    return 0;
  };

  const gainDaysHeld = calculateDaysHeld(gainOpportunity.taxLot);
  const lossDaysHeld = calculateDaysHeld(lossOpportunity.taxLot);

  return (
    <Card className="overflow-hidden border-0 bg-[#0D0F12] shadow-sm">
      <div className="border-b border-[var(--color-border)] bg-[#112227] p-4">
        <h3 className="font-semibold">
          Cost Basis Reset Strategy - Matched Pair
        </h3>
        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
          Pair these trades to reset your cost basis with minimal tax impact
        </p>
      </div>

      <div className="grid gap-0 divide-x divide-border bg-[#0D0F12] md:grid-cols-2">
        {/* Gain Position */}
        <div className="p-4">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex size-8 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-green-800">
                {gainOpportunity.symbol?.substring(0, 2)}
              </div>
              <div className="ml-2">
                <h4 className="font-semibold">{gainOpportunity.symbol}</h4>
                <div className="flex items-center text-xs text-green-600">
                  <ArrowUpCircle className="mr-1 size-3" />
                  <span>Gain Position</span>
                </div>
              </div>
            </div>
            <span className="text-xl font-bold text-green-600">
              +
              {Format.money(gainAmount)}
            </span>
          </div>

          <div className="my-4 grid grid-cols-2 gap-2 text-sm">
            <div>
              <div className="text-muted-foreground">Quantity</div>
              <div className="font-medium">
                {gainOpportunity.taxLot?.quantity || 0}
                {' '}
                shares
              </div>
            </div>
            <div>
              <div className="text-muted-foreground">Days Held</div>
              <div className="font-medium">
                {gainDaysHeld}
                {' '}
                days
              </div>
            </div>
            <div>
              <div className="text-muted-foreground">Purchase Price</div>
              <div className="font-medium">
                $
                {gainCostBasisPerShare.toFixed(2)}
              </div>
            </div>
            <div>
              <div className="text-muted-foreground">Current Price</div>
              <div className="font-medium">
                $
                {gainCurrentPricePerShare.toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        {/* Loss Position */}
        <div className="p-4">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex size-8 items-center justify-center rounded-full bg-red-100 text-xs font-bold text-red-800">
                {lossOpportunity.symbol?.substring(0, 2)}
              </div>
              <div className="ml-2">
                <h4 className="font-semibold">{lossOpportunity.symbol}</h4>
                <div className="flex items-center text-xs text-red-600">
                  <TrendingDown className="mr-1 size-3" />
                  <span>Loss Position</span>
                </div>
              </div>
            </div>
            <span className="text-xl font-bold text-red-600">
              -
              {Format.money(lossAmount)}
            </span>
          </div>

          <div className="my-4 grid grid-cols-2 gap-2 text-sm">
            <div>
              <div className="text-muted-foreground">Quantity</div>
              <div className="font-medium">
                {lossOpportunity.taxLot?.quantity || 0}
                {' '}
                shares
              </div>
            </div>
            <div>
              <div className="text-muted-foreground">Days Held</div>
              <div className="font-medium">
                {lossDaysHeld}
                {' '}
                days
              </div>
            </div>
            <div>
              <div className="text-muted-foreground">Purchase Price</div>
              <div className="font-medium">
                $
                {lossCostBasisPerShare.toFixed(2)}
              </div>
            </div>
            <div>
              <div className="text-muted-foreground">Current Price</div>
              <div className="font-medium">
                $
                {lossCurrentPricePerShare.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t bg-[#0D0F12] p-4 text-white">
        {/* Single Execute Trade button for the entire pair */}
        <div className="flex justify-center">
          <Button
            variant="outline"
            className="w-full max-w-xl border-[#F0B90B] px-8 py-2 text-[#F0B90B] transition-colors hover:bg-[#F0B90B] hover:font-bold hover:text-black"
          >
            <Check className="mr-2 size-4" />
            {' '}
            Execute Trade
          </Button>
        </div>
      </div>
    </Card>
  );
}
