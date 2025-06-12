'use client';

import {
  type FiniteHarvestLotItemFragment,
  type FiniteHarvestQuery,
  HarvestType,
  TaxGain,
} from '~/generated/gql';
import NoOpportunities from './no-opportunities';
import { CostBasisPairCard } from './api-cost-basis-pair-card';
import { ArrowUpCircle, TrendingDown } from 'lucide-react';
import { HarvestingOpportunityCard } from './harvesting-opportunity-card';
import { SeePaymentPlans } from '../settings/payment/see-payment-plans';
import { Button } from '@repo/ui/components/button';
import Link from 'next/link';
import { TypedRoutes } from '~/lib/routes';

// Dummy data for the blurred card
const dummyLot: FiniteHarvestLotItemFragment = {
  id: 'dummy-id',
  symbol: 'AAPL',
  acquiredDate: '2024-01-01',
  remainingQty: '100',
  currentHarvestQty: '0',
  price: '180.00',
  lastPrice: '170.00',
  costBasis: '18000',
  gainTotal: '-1000',
  dollarPerSharePnL: '-10',
  harvestId: null,
  accountId: 'dummy-account',
  value: '17000',
  gainTotalPct: '-5.56',
  taxGain: TaxGain.Short,
  __typename: 'LotCurrent',
};

export default function RealizedHarvestItems({
  finiteHarvest,
}: {
  finiteHarvest: FiniteHarvestQuery['finiteHarvest'];
}) {
  return finiteHarvest?.lotsCurrent?.length ? (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <div className="flex items-center space-x-2">
          {finiteHarvest.summary.realized.gainTotal > 0 ? (
            <TrendingDown className="size-5 text-red-500" />
          ) : (
            <ArrowUpCircle className="size-5 text-green-500" />
          )}
          <h2 className="text-lg font-semibold">
            {finiteHarvest.summary.realized.gainTotal > 0
              ? 'Loss Harvesting Opportunities'
              : 'Gain Harvesting Opportunities'}
          </h2>
        </div>
        <p className="text-muted-foreground">
          {finiteHarvest.summary.realized.gainTotal > 0
            ? 'Harvest these losses to offset your realized gains and reduce your tax liability'
            : 'Harvest these gains to offset your realized losses and optimize your tax position'}
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8">
        {finiteHarvest?.lotsCurrent?.map(lot => (
          <HarvestingOpportunityCard
            key={lot.id}
            lot={lot}
            harvestType={finiteHarvest.harvestType}
            netPosition={finiteHarvest.summary.realized.gainTotal}
          />
        ))}

        {/* Blurred teaser card */}
        {finiteHarvest.totalHarvestLots > finiteHarvest?.lotsCurrent.length &&
          [1, 2, 3].map(i => (
            <Link href={TypedRoutes.settingsPayment()}>
              <div key={i} className="relative rounded-lg">
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
                <HarvestingOpportunityCard
                  lot={dummyLot}
                  harvestType={HarvestType.ReduceTaxes}
                  netPosition={-1000}
                />
              </div>
            </Link>
          ))}
      </div>
    </div>
  ) : (
    <NoOpportunities />
  );
}
