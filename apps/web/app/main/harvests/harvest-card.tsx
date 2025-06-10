import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/card';
import { HarvestPairingCard } from '~/modules/harvest/harvest-pairing-card';
import { type HarvestSingleItemFragment } from '~/generated/gql';
import { Badge } from '@repo/ui/components/badge';
import { capitalCase } from 'change-case';
import { Avatar, AvatarImage } from '@repo/ui/components/avatar';
import { AvatarFallback } from '@repo/ui/components/avatar';
import { stringToTailwindColor } from '@repo/ui/utils';

export function HarvestCard({
  harvest,
}: {
  harvest: HarvestSingleItemFragment;
}) {
  return (
    <Card className="bg-muted overflow-hidden border-0 shadow-sm">
      <CardHeader className="pb-0">
        <CardTitle className="flex items-center gap-2">
          <Badge>{capitalCase(harvest.type)}</Badge>
          <div>{harvest.label}</div>
          <Avatar className="ml-auto">
            <AvatarImage src={harvest.createdBy.photo ?? ''} />
            <AvatarFallback
              className={stringToTailwindColor(
                harvest.createdBy.name ?? harvest.createdBy.email ?? ''
              )}
            >
              {harvest.createdBy.name?.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </CardTitle>
      </CardHeader>
      <HarvestPairingCard
        harvestItem={{
          sourceLots:
            harvest.harvestTransactions
              ?.filter(transaction => !transaction.counterTransaction)
              ?.map(transaction => ({
                id: transaction.id,
                assetSymbol: transaction.harvestTransactionItem.assetSymbol,
                pAndL:
                  Number(transaction.harvestTransactionItem.quantity) *
                  (Number(
                    transaction.harvestTransactionItem.lotPriceAtHarvest
                  ) -
                    Number(transaction.harvestTransactionItem.lotPricePaid)),
                remainingQty: Number(
                  transaction.harvestTransactionItem.quantity
                ),
                quantity: Number(transaction.harvestTransactionItem.quantity),
                acquiredDate:
                  transaction.harvestTransactionItem.lotAcquiredDate,
                pricePaid: Number(transaction.harvestTransactionItem.price),
                lastPrice: Number(
                  transaction.harvestTransactionItem.lotPriceAtHarvest
                ),
              })) ?? [],
          matchedLotOrders:
            harvest.harvestTransactions
              ?.filter(transaction => transaction.counterTransaction)
              .map(transaction => ({
                id: transaction.id,
                assetSymbol: transaction.harvestTransactionItem.assetSymbol,
                pAndL:
                  Number(transaction.harvestTransactionItem.quantity) *
                  (Number(
                    transaction.harvestTransactionItem.lotPriceAtHarvest
                  ) -
                    Number(transaction.harvestTransactionItem.lotPricePaid)),
                remainingQty: Number(
                  transaction.harvestTransactionItem.quantity
                ),
                quantity: Number(transaction.harvestTransactionItem.quantity),
                acquiredDate:
                  transaction.harvestTransactionItem.lotAcquiredDate,
                pricePaid: Number(transaction.harvestTransactionItem.price),
                lastPrice: Number(
                  transaction.harvestTransactionItem.lotPriceAtHarvest
                ),
              })) ?? [],
        }}
      />
    </Card>
  );
}
