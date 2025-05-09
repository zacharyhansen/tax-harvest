'use client';

import { usePortfolioSummaryQuery } from '~/generated/gql';
import { LoadingPage } from '~/modules/utility-components';

export default function HarvestFlowPage() {
  const { loading } = usePortfolioSummaryQuery();

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-xl tracking-tight md:text-3xl">
        How should we help you save money?
      </h1>
      <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-16 lg:grid-cols-6 lg:grid-rows-2">

      </div>
    </div>
  );
}
