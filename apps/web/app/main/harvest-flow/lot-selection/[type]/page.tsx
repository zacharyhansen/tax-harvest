'use client';

import type { TypedRoutes } from '~/lib/routes';
import { HarvestStepper } from '~/modules/harvest';
import PageWrapper from '~/modules/layout/page-wrapper';

export default function Page({
  params,
}: {
  params: typeof TypedRoutes.lotSelection.params;
}) {
  const harvestType = params.type;
  return (
    <PageWrapper>
      <HarvestStepper harvestType={harvestType} />
    </PageWrapper>
  );
}
