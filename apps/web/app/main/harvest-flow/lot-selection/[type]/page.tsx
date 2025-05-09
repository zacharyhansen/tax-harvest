'use client';
import type { TypedRoutes } from '~/lib/routes';

import { use } from 'react';
import { HarvestStepper } from '~/modules/harvest';
import PageWrapper from '~/modules/layout/page-wrapper';

export default function Page(
  props: {
    params: Promise<typeof TypedRoutes.lotSelection.params>;
  },
) {
  const params = use(props.params);
  const harvestType = params.type;
  return (
    <PageWrapper>
      <HarvestStepper harvestType={harvestType} />
    </PageWrapper>
  );
}
