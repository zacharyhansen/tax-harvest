import { useState } from 'react';
import {
  useCreateHarvestMutation,
  HarvestType,
  HarvestEvalResultDocument,
  type HarvestMatchItem,
  HarvestsAndTransactionsDocument,
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
  TrendingDown,
  TrendingUp,
  Wheat,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Format, MoneyUtil } from '~/modules/utils';
import { toast } from '@repo/ui/components/toast-sonner';

export type HarvestEvalPairCardProps = {
  harvestMatchItem: HarvestMatchItem;
};

export function HarvestEvalPairCard({
  harvestMatchItem,
}: HarvestEvalPairCardProps) {
  const [selectedMatchIndex, setSelectedMatchIndex] = useState(0);
  const [createHarvest, { loading: isHarvesting }] = useCreateHarvestMutation({
    refetchQueries: [
      HarvestEvalResultDocument,
      HarvestsAndTransactionsDocument,
    ],
    awaitRefetchQueries: true,
  });

  const selectedMatch = harvestMatchItem.pairs[selectedMatchIndex];
  const hasMultipleMatches = harvestMatchItem.pairs.length > 1;

  const handleNextMatch = () => {
    setSelectedMatchIndex(prev => (prev + 1) % harvestMatchItem.pairs.length);
  };

  const handlePrevMatch = () => {
    setSelectedMatchIndex(
      prev =>
        (prev - 1 + harvestMatchItem.pairs.length) %
        harvestMatchItem.pairs.length
    );
  };

  if (!selectedMatch) return null;

  const taxSavings =
    Math.min(
      Math.abs(selectedMatch.sourceHarvestPAndL),
      Math.abs(selectedMatch.matchedHarvestPAndL)
    ) * 0.35; // Tax savings on the offset amount

  return (
    <Card
      className={cn(
        'bg-background group relative overflow-hidden border shadow-sm'
      )}
    >
      <div className="card-content pointer-events-auto relative z-10 flex justify-between border-b p-4">
        <div className="flex-1">
          <h3 className={cn('mb-2 font-semibold')}>Matched Pair</h3>
          <p className="text-(--color-text-secondary) text-sm">
            Pair these trades to reset your cost basis with minimal tax impact
          </p>
        </div>
      </div>

      <div className="card-content divide-border pointer-events-auto relative z-10 grid gap-0 divide-x md:grid-cols-2">
        {/* Source Lots */}
        <div className="p-4">
          <div className="mb-3 flex h-8 items-center justify-between">
            <h4 className="text-muted-foreground mb-1 text-sm font-medium">
              {Number(selectedMatch.sourceHarvestPAndL) < 0
                ? 'Unrealized Loss'
                : 'Unrealized Gain'}
            </h4>
          </div>
          {selectedMatch.sourceLots.map((sourceLot, index) => (
            <LotCard
              key={sourceLot.id + '-' + sourceLot.harvestQuantity + '-' + index}
              assetSymbol={sourceLot.symbol ?? ''}
              pAndL={sourceLot.harvestPAndL}
              shares={Number(sourceLot.harvestQuantity)}
              totalShares={Number(sourceLot.remainingQty)}
              currentHarvestQty={Number(sourceLot.currentHarvestQty || 0)}
              costBasisPerShare={Number(sourceLot.price)}
              currentPricePerShare={Number(sourceLot.lastPrice)}
              availableQty={Number(sourceLot.availableQty)}
            />
          ))}
          {selectedMatch.sourceLots.length > 1 && (
            <div className="flex justify-between border-t pt-2">
              <span className="text-sm font-medium">
                {selectedMatch.sourceHarvestPAndL > 0 ? 'Net Gain' : 'Net Loss'}
                :
              </span>
              <span
                className={cn(
                  'font-bold',
                  MoneyUtil.colored(selectedMatch.sourceHarvestPAndL)
                )}
              >
                {Format.money(selectedMatch.sourceHarvestPAndL, 2)}
              </span>
            </div>
          )}
        </div>

        {/* Matched Lots */}
        <div className="p-4">
          <div className="mb-3 flex h-8 items-center justify-between">
            <h4 className="text-muted-foreground mb-1 text-sm font-medium">
              {Number(selectedMatch.matchedHarvestPAndL) > 0
                ? 'Unrealized Gain'
                : 'Unrealized Loss'}
            </h4>
            {hasMultipleMatches && (
              <div className="flex items-center gap-2">
                <span className="text-sm">
                  Option {selectedMatchIndex + 1} /{' '}
                  {harvestMatchItem.pairs.length}
                </span>
                <div className="flex gap-1">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handlePrevMatch}
                    className="h-8 w-8 rounded-full p-0"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleNextMatch}
                    className="h-8 w-8 rounded-full p-0"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
          {selectedMatch.matchedLots.map((matchedLot, index) => (
            <LotCard
              key={
                matchedLot.id + '-' + matchedLot.harvestQuantity + '-' + index
              }
              assetSymbol={matchedLot.symbol ?? ''}
              pAndL={Number(matchedLot.harvestPAndL)}
              shares={Number(matchedLot.harvestQuantity)}
              totalShares={Number(matchedLot.remainingQty)}
              currentHarvestQty={Number(matchedLot.currentHarvestQty || 0)}
              costBasisPerShare={Number(matchedLot.price)}
              currentPricePerShare={Number(matchedLot.lastPrice)}
              availableQty={Number(matchedLot.availableQty)}
            />
          ))}
          {selectedMatch.matchedLots.length > 1 && (
            <div className="flex justify-between border-t pt-2">
              <span className="text-sm font-medium">
                {selectedMatch.matchedHarvestPAndL > 0
                  ? 'Net Gain'
                  : 'Net Loss'}
                :
              </span>
              <span
                className={cn(
                  'font-bold',
                  MoneyUtil.colored(selectedMatch.sourceHarvestPAndL)
                )}
              >
                {Format.money(selectedMatch.sourceHarvestPAndL, 2)}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="bg-muted/30 px-4 py-3">
        <div className="flex items-center justify-center">
          <span className="text-muted-foreground text-sm">Tax Savings: </span>
          <span className="pl-4 font-semibold text-green-600 dark:text-green-400">
            ~{Format.money(taxSavings, 2)}
          </span>
        </div>
      </div>

      <CardFooter className="card-content pointer-events-auto relative z-10 flex items-center justify-center border-t pt-4">
        <div className="flex w-full justify-center gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'border-primary text-primary hover:bg-primary/70 flex-1 grow'
                )}
                disabled={isHarvesting}
              >
                <Wheat className="mr-2 size-4" />
                Mark as Sold
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Mark as Sold</AlertDialogTitle>
                <AlertDialogDescription>
                  Marking these positions as sold will hide this pair and update
                  your amounts of tax savings while this harvest is considered
                  in flight (~2 trading days).
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
                          // directedHarvestLots: [
                          //   {
                          //     lotId: sourceLot.id,
                          //     quantity: sourceShares,
                          //     counterTransaction: false,
                          //   },
                          //   {
                          //     lotId: selectedMatch.id,
                          //     quantity: matchShares,
                          //     counterTransaction: true,
                          //   },
                          // ],

                          directedHarvestLots: selectedMatch.sourceLots
                            .map(lot => ({
                              lotId: lot.id,
                              quantity: Number(lot.harvestQuantity),
                              counterTransaction: false,
                            }))
                            .concat(
                              selectedMatch.matchedLots.map(lot => ({
                                lotId: lot.id,
                                quantity: Number(lot.harvestQuantity),
                                counterTransaction: true,
                              }))
                            ),
                          harvestType: HarvestType.ReduceCostBasis,
                        },
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

function LotCard({
  assetSymbol,
  pAndL,
  shares,
  totalShares,
  currentHarvestQty,
  costBasisPerShare,
  currentPricePerShare,
  availableQty,
}: {
  assetSymbol: string;
  pAndL: number;
  shares: number;
  totalShares?: number;
  currentHarvestQty?: number;
  costBasisPerShare: number;
  currentPricePerShare: number;
  availableQty?: number;
}) {
  const moneyClass = MoneyUtil.colored(pAndL);
  const isGain = pAndL > 0;

  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-lg font-semibold">{assetSymbol}</p>
          <p className="text-muted-foreground text-sm">
            {shares}
            {` / ${availableQty}`} available shares
            {currentHarvestQty && currentHarvestQty > 0 ? (
              <span> (+{currentHarvestQty} harvested)</span>
            ) : null}
          </p>
        </div>
        <div
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-full',
            isGain
              ? 'bg-green-100 dark:bg-green-900/20'
              : 'bg-red-100 dark:bg-red-900/20'
          )}
        >
          {isGain ? (
            <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
          ) : (
            <TrendingDown className="h-5 w-5 text-red-600 dark:text-red-400" />
          )}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Cost Basis:</span>
          <span className="font-medium">
            {Format.money(costBasisPerShare * shares, 2)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Current Value:</span>
          <span className="font-medium">
            {Format.money(currentPricePerShare * shares, 2)}
          </span>
        </div>
        <div className="flex justify-between border-t pt-2">
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
