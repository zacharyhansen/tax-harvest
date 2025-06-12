import {
  useCreateHarvestMutation,
  HarvestType,
  type UnrealizedHarvestItemFragment,
  FiniteHarvestDocument,
  useDeleteHarvestsMutation,
} from '~/generated/gql';
import { Button } from '@repo/ui/components/button';
import { Card } from '@repo/ui/components/card';
import { cn } from '@repo/ui/utils';

import {
  ArrowUpCircle,
  Trash,
  Trash2,
  TrendingDown,
  Wheat,
} from 'lucide-react';
import { Format, MoneyUtil } from '~/modules/utils';
import { toast } from '@repo/ui/components/toast-sonner';

export type CostBasisPairCardProps = {
  harvestItem: UnrealizedHarvestItemFragment;
};

export function CostBasisPairCard({ harvestItem }: CostBasisPairCardProps) {
  const [createHarvest] = useCreateHarvestMutation({
    refetchQueries: [FiniteHarvestDocument],
    awaitRefetchQueries: true,
  });
  const [deleteHarvests] = useDeleteHarvestsMutation({
    refetchQueries: [FiniteHarvestDocument],
    awaitRefetchQueries: true,
  });

  const isHarvested =
    parseInt(harvestItem.sourceLot.remainingQty) ===
    parseInt(harvestItem.sourceLot.currentHarvestQty);

  return (
    <Card
      className={cn(
        'bg-muted overflow-hidden border-0 shadow-sm',
        isHarvested && 'bg-accent'
      )}
    >
      <div className="flex justify-between border-b p-4">
        <div>
          <h3 className="font-semibold">
            Cost Basis Reset Strategy - Matched Pair
          </h3>
          <p className="text-(--color-text-secondary) mt-1 text-sm">
            Pair these trades to reset your cost basis with minimal tax impact
          </p>
        </div>

        <div className="flex justify-center gap-2">
          {isHarvested && harvestItem.sourceLot.harvestId ? (
            <Button
              variant="destructive"
              size="icon"
              onClick={() => {
                toast.promise(
                  deleteHarvests({
                    variables: {
                      ids: [harvestItem.sourceLot.harvestId!],
                    },
                  }),
                  {
                    loading: 'Removing from harvest...',
                    success: 'Harvest removed successfully',
                    error: 'Failed to remove from harvest',
                  }
                );
              }}
            >
              <Trash2 className="size-4" />
            </Button>
          ) : null}
          <Button
            variant="default"
            disabled={isHarvested}
            onClick={() => {
              toast.promise(
                createHarvest({
                  variables: {
                    directedHarvestLots: [
                      {
                        lotId: harvestItem.sourceLot.id,
                        quantity: Number(harvestItem.sourceLot.remainingQty),
                        counterTransaction: false,
                      },
                      ...harvestItem.matchedLotOrders.map(lotOrder => ({
                        lotId: lotOrder.lotId,
                        quantity: Number(lotOrder.quantity),
                        counterTransaction: true,
                      })),
                    ],
                    harvestType: HarvestType.ReduceCostBasis,
                  },
                  refetchQueries: [FiniteHarvestDocument],
                }),
                {
                  loading: 'Creating harvest...',
                  success: 'Harvest created successfully',
                  error: 'Failed to create harvest',
                }
              );
            }}
          >
            <Wheat className="mr-2 size-4" />
            {isHarvested ? 'Harvested' : 'Add to Harvest'}
          </Button>
        </div>
      </div>

      <div className="divide-border grid gap-0 divide-x md:grid-cols-2">
        {/* Gain Position */}
        <LotOrderCard
          assetSymbol={harvestItem.sourceLot.symbol ?? ''}
          pAndL={Number(harvestItem.sourceLot.gainTotal)}
          shares={Number(harvestItem.sourceLot.remainingQty)}
          totalShares={Number(harvestItem.sourceLot.remainingQty)}
          aquiredDate={new Date(harvestItem.sourceLot.acquiredDate)}
          costBasisPerShare={Number(harvestItem.sourceLot.price)}
          currentPricePerShare={Number(harvestItem.sourceLot.lastPrice)}
        />

        <div>
          {harvestItem.matchedLotOrders.map(lotOrder => (
            <LotOrderCard
              key={lotOrder.id}
              assetSymbol={lotOrder.assetSymbol}
              pAndL={Number(lotOrder.gainTotal)}
              shares={Number(lotOrder.quantity)}
              totalShares={Number(lotOrder.quantity)}
              aquiredDate={new Date(lotOrder.acquiredDate)}
              costBasisPerShare={Number(lotOrder.pricePaid)}
              currentPricePerShare={Number(lotOrder.lastPrice)}
            />
          ))}
        </div>
      </div>
    </Card>
  );
}

function LotOrderCard({
  assetSymbol,
  pAndL,
  shares,
  totalShares,
  aquiredDate,
  costBasisPerShare,
  currentPricePerShare,
}: {
  assetSymbol: string;
  pAndL: number;
  shares: number;
  totalShares: number;
  aquiredDate: Date;
  costBasisPerShare: number;
  currentPricePerShare: number;
}) {
  const moneyClass = MoneyUtil.colored(pAndL);

  return (
    <div className="p-4">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center">
          <div
            className={cn(
              'flex h-8 items-center justify-center rounded-md px-1 text-xs font-bold',
              moneyClass,
              pAndL > 0 ? 'bg-green-100' : 'bg-red-100'
            )}
          >
            {assetSymbol}
          </div>
          <div className="ml-2">
            <h4 className="font-semibold">{assetSymbol}</h4>
            <div className={`flex items-center text-xs ${moneyClass}`}>
              {pAndL > 0 ? (
                <ArrowUpCircle className="mr-1 size-3" />
              ) : (
                <TrendingDown className="mr-1 size-3" />
              )}
              <span>{pAndL > 0 ? 'Gain' : 'Loss'} Position</span>
            </div>
          </div>
        </div>
        <span className={`text-xl font-bold ${moneyClass}`}>
          {Format.money(pAndL, 2)}
        </span>
      </div>

      <div className="my-4 grid grid-cols-2 gap-2 text-sm">
        <div>
          <div className="text-muted-foreground">Quantity</div>
          <div className="font-medium">
            {shares === totalShares ? shares : `${shares} / ${totalShares}`}{' '}
            shares
          </div>
        </div>
        <div>
          <div className="text-muted-foreground">Held For</div>
          <div className="font-medium">{Format.relativeDays(aquiredDate)}</div>
        </div>
        <div>
          <div className="text-muted-foreground">Purchase Price</div>
          <div className="font-medium">
            {Format.money(costBasisPerShare, 2)}
          </div>
        </div>
        <div>
          <div className="text-muted-foreground">Current Price</div>
          <div className="font-medium">
            {Format.money(currentPricePerShare, 2)}
          </div>
        </div>
      </div>
    </div>
  );
}
