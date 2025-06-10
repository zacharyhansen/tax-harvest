import { cn } from '@repo/ui/utils';
import { LotOrderCard } from './lot-order-card';

interface LotItem {
  id: string;
  assetSymbol: string;
  pAndL: number;
  quantity: number;
  remainingQty: number;
  acquiredDate: string;
  pricePaid: number;
  lastPrice: number;
}

interface HarvestItem {
  sourceLots: LotItem[];
  matchedLotOrders: LotItem[];
}

interface HarvestPairingCardProps {
  harvestItem: HarvestItem;
}

export function HarvestPairingCard({ harvestItem }: HarvestPairingCardProps) {
  return (
    <div
      className={cn(
        'divide-border grid gap-0 divide-x',
        harvestItem.matchedLotOrders.length > 0 && 'md:grid-cols-2'
      )}
    >
      {harvestItem.sourceLots.map(lotOrder => (
        <LotOrderCard
          key={lotOrder.id}
          assetSymbol={lotOrder.assetSymbol}
          pAndL={Number(lotOrder.pAndL)}
          shares={Number(lotOrder.quantity)}
          totalShares={Number(lotOrder.quantity)}
          aquiredDate={new Date(lotOrder.acquiredDate)}
          costBasisPerShare={Number(lotOrder.pricePaid)}
          currentPricePerShare={Number(lotOrder.lastPrice)}
        />
      ))}

      {harvestItem.matchedLotOrders.length > 0 && (
        <div>
          {harvestItem.matchedLotOrders.map(lotOrder => (
            <LotOrderCard
              key={lotOrder.id}
              assetSymbol={lotOrder.assetSymbol}
              pAndL={Number(lotOrder.pAndL)}
              shares={Number(lotOrder.quantity)}
              totalShares={Number(lotOrder.quantity)}
              aquiredDate={new Date(lotOrder.acquiredDate)}
              costBasisPerShare={Number(lotOrder.pricePaid)}
              currentPricePerShare={Number(lotOrder.lastPrice)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
