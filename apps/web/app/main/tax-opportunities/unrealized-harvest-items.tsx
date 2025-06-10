'use client';

import { type UnrealizedHarvestItemFragment } from '~/generated/gql';
import NoOpportunities from './no-opportunities';
import { CostBasisPairCard } from './api-cost-basis-pair-card';

export default function UnrealizedHarvestItems({
  items,
}: {
  items: UnrealizedHarvestItemFragment[];
}) {
  return items?.length ? (
    items.map(item => (
      <CostBasisPairCard key={item.sourceLot.id} harvestItem={item} />
    ))
  ) : (
    <NoOpportunities />
  );
}
