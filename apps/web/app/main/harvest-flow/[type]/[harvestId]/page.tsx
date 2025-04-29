'use client';

import type { TypedRoutes } from '~/lib/routes';
import { HarvestStepper } from '~/modules/harvest';

export default function Page({
  params,
}: {
  params: typeof TypedRoutes.harvestFlowType.params;
}) {
  return (
    <HarvestStepper harvestType={params.type} harvestId={params.harvestId} />
  );
}
