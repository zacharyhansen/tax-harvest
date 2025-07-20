'use client';

import {
  type UnrealizedHarvestItemFragment,
  TaxGain,
  OrderType,
  type FiniteHarvestQuery,
} from '~/generated/gql';
import { CostBasisPairCard } from './api-cost-basis-pair-card';
import Link from 'next/link';
import { TypedRoutes } from '~/lib/routes';
import { Button } from '@repo/ui/components/button';

// Dummy data for the blurred cards
const dummyHarvestItem: UnrealizedHarvestItemFragment = {
  sourceLot: {
    id: 'dummy-source-id',
    symbol: 'MSFT',
    acquiredDate: '2024-01-01',
    remainingQty: '50',
    currentHarvestQty: '0',
    price: '350.00',
    lastPrice: '340.00',
    costBasis: '17500',
    value: '17000',
    gainTotal: '500',
    gainTotalPct: '-2.86',
    dollarPerSharePnL: '-10',
    taxGain: TaxGain.Short,
    harvestId: null,
    accountId: 'dummy-account',
    __typename: 'LotCurrent',
  },
  matchedLotOrders: [
    {
      id: 'dummy-match-1',
      lotId: 'dummy-lot-1',
      assetSymbol: 'MSFT',
      quantity: '50',
      pricePaid: '340.00',
      costBasis: '17000',
      gainTotal: '0',
      taxGain: TaxGain.Short,
      dollarPerSharePnL: '0',
      valueTotal: '17000',
      orderType: OrderType.Buy,
      acquiredDate: '2024-01-01',
      lastPrice: '340.00',
      accountId: 'dummy-account',
      __typename: 'HarvestLotOrder',
    },
  ],
  __typename: 'UnrealizedHarvestMatchResult',
};

export default function UnrealizedHarvestItems({
  finiteHarvest,
}: {
  finiteHarvest: FiniteHarvestQuery['finiteHarvest'];
}) {
  const items = finiteHarvest.unrealizedHarvestMatchResults ?? [];

  return (
    <div className="flex flex-col gap-4">
      {items.map(item => (
        <CostBasisPairCard key={item.sourceLot.id} harvestItem={item} />
      ))}

      {/* Blurred teaser cards */}
      {finiteHarvest.totalHarvestLots > items.length &&
        [1, 2].map(i => (
          <Link key={i} href={TypedRoutes.settingsPayment()}>
            <div className="relative rounded-lg">
              <div className="absolute inset-0 z-10 rounded-lg backdrop-blur-sm" />
              <div className="absolute inset-0 z-20 flex items-center justify-center rounded-lg">
                <div className="bg-background/95 rounded-lg p-4 text-center shadow-lg">
                  <Button variant="outline" className="font-semibold">
                    Unlock More Opportunities
                  </Button>
                  <p className="text-muted-foreground mt-1 text-sm">
                    Upgrade to see all harvest opportunities
                  </p>
                </div>
              </div>
              <CostBasisPairCard harvestItem={dummyHarvestItem} />
            </div>
          </Link>
        ))}
    </div>
  );
}
