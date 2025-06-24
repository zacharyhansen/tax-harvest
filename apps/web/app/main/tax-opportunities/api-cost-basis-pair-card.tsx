import {
  useCreateHarvestMutation,
  HarvestType,
  type UnrealizedHarvestItemFragment,
  FiniteHarvestDocument,
  useDeleteHarvestsMutation,
} from '~/generated/gql';
import { Button } from '@repo/ui/components/button';
import { Card, CardFooter } from '@repo/ui/components/card';
import { cn } from '@repo/ui/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@repo/ui/components/alert-dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@repo/ui/components/tooltip';

import { Check, Trash2, TrendingDown, TrendingUp, Wheat } from 'lucide-react';
import { Format, MoneyUtil } from '~/modules/utils';
import { toast } from '@repo/ui/components/toast-sonner';

export type CostBasisPairCardProps = {
  harvestItem: UnrealizedHarvestItemFragment;
};

export function CostBasisPairCard({ harvestItem }: CostBasisPairCardProps) {
  const [createHarvest, { loading: isHarvesting }] = useCreateHarvestMutation({
    refetchQueries: [FiniteHarvestDocument],
    awaitRefetchQueries: true,
  });
  const [deleteHarvests, { loading: isDeleting }] = useDeleteHarvestsMutation({
    refetchQueries: [FiniteHarvestDocument],
    awaitRefetchQueries: true,
  });

  const isHarvested =
    parseInt(harvestItem.sourceLot.remainingQty) ===
    parseInt(harvestItem.sourceLot.currentHarvestQty);

  return (
    <Card
      className={cn(
        'bg-background relative overflow-hidden border shadow-sm',
        isHarvested && [
          // 'before:bg-background/50 before:absolute before:inset-0 before:z-0',
          '[&_*]:opacity-80',
        ]
      )}
    >
      <div className="pointer-events-auto relative z-10 flex justify-between border-b p-4">
        <div>
          <h3 className={cn('font-semibold')}>
            Cost Basis Reset Strategy - Matched Pair
          </h3>
          <p
            className={cn(
              'text-(--color-text-secondary) mt-1 text-sm',
              isHarvested && 'opacity-50'
            )}
          >
            Pair these trades to reset your cost basis with minimal tax impact
          </p>
        </div>
      </div>

      <div className="divide-border pointer-events-auto relative z-10 grid gap-0 divide-x md:grid-cols-2">
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
      <CardFooter className="pointer-events-auto relative z-10 flex items-center justify-center border-t pt-4">
        <div className="flex w-full justify-center gap-2">
          {isHarvested && harvestItem.sourceLot.harvestId ? (
            <Tooltip>
              <TooltipTrigger asChild>
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
                  loading={isDeleting}
                >
                  <Trash2 className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Undo this harvest</p>
              </TooltipContent>
            </Tooltip>
          ) : null}

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'border-primary text-primary hover:bg-primary/70 flex-1 grow',
                  isHarvested && 'bg-muted border-0 text-white'
                )}
                disabled={isHarvested || isHarvesting}
              >
                {isHarvested ? (
                  <Check className="mr-2 size-4 text-green-500" />
                ) : (
                  <Wheat className="mr-2 size-4" />
                )}
                {isHarvested ? 'Executed' : 'Mark as Sold'}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Mark as Sold</AlertDialogTitle>
                <AlertDialogDescription>
                  Marking these positions as sold will hide this pair and update
                  your amounts of tax savings for the next 24 hours.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  variant="default"
                  onClick={() => {
                    toast.promise(
                      createHarvest({
                        variables: {
                          directedHarvestLots: [
                            {
                              lotId: harvestItem.sourceLot.id,
                              quantity: Number(
                                harvestItem.sourceLot.remainingQty
                              ),
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
                  Mark as Sold
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardFooter>
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
  const isGain = pAndL > 0;

  return (
    <div className="p-4">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center">
          <div
            className={cn(
              'mr-3 flex h-8 w-8 items-center justify-center rounded-full',
              isGain
                ? 'bg-green-100 dark:bg-green-900/20'
                : 'bg-red-100 dark:bg-red-900/20'
            )}
          >
            {isGain ? (
              <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
            )}
          </div>
          <div>
            {isGain ? (
              <p className="font-medium text-green-600 dark:text-green-400">
                SELL Position
              </p>
            ) : (
              <p className="font-medium text-red-600 dark:text-red-400">
                SELL Position
              </p>
            )}
            <p className="text-xs text-[var(--color-text-secondary)]">
              Realize {isGain ? 'Gain' : 'Loss'}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-sm text-[var(--color-text-secondary)]">
            Symbol:
          </span>
          <span className="font-medium">{assetSymbol}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-[var(--color-text-secondary)]">
            Shares:
          </span>
          <span className="font-medium">{shares}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-[var(--color-text-secondary)]">
            Cost Basis:
          </span>
          <span className="font-medium">
            {Format.money(costBasisPerShare * shares, 2)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-[var(--color-text-secondary)]">
            Current Value:
          </span>
          <span className="font-medium">
            {Format.money(currentPricePerShare * shares, 2)}
          </span>
        </div>
        <div className="flex justify-between border-t border-[#112227] pt-2">
          <span className="text-sm font-medium">
            {isGain ? 'Gain' : 'Loss'}:
          </span>
          <span className={cn('font-bold', moneyClass)}>
            {Format.money(pAndL, 2)}
          </span>
        </div>
      </div>
    </div>
  );
}
