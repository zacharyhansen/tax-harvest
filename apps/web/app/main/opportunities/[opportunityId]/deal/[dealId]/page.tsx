'use client';

import { useEffect } from 'react';

import { useViewContext } from '~/app/main/view-context.provider';
import { LayoutSlug } from '~/lib/constants/layout.slugs';
import type { TypedRoutes } from '~/lib/routes';
import { LayoutWrapper } from '~/modules/layout';

export default function DealPage({
  params,
}: Readonly<{
  params: typeof TypedRoutes.deal.params;
}>) {
  const { setViewContext } = useViewContext();

  useEffect(() => {
    setViewContext({
      _p_opportunity: {
        id: params.opportunityId,
      },
      _p_deal: {
        id: params.dealId,
      },
    });
  }, [params.opportunityId, params.dealId, setViewContext]);

  return (
    <LayoutWrapper layoutSlug={LayoutSlug.DEAL_PAGE}>Deal Page</LayoutWrapper>
  );
}
