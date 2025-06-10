'use client';

import {
  type FiniteHarvestLotItemFragment,
  type FiniteHarvestQuery,
} from '~/generated/gql';
import NoOpportunities from './no-opportunities';
import { CostBasisPairCard } from './api-cost-basis-pair-card';
import { ArrowUpCircle, TrendingDown } from 'lucide-react';
import { HarvestingOpportunityCard } from './harvesting-opportunity-card';

export default function UnrealizedHarvestItems({
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
      </div>
    </div>
  ) : (
    <NoOpportunities />
  );
}
