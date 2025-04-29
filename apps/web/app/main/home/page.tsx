'use client';

import { Button } from '@repo/ui/components/button';
import { ArrowRight, Wheat } from 'lucide-react';
import Link from 'next/link';

import {
  HarvestType,
  SetUpStatus,
  usePortfolioSummaryQuery,
} from '~/generated/gql';
import { TypedRoutes } from '~/lib/routes';
import { NoAccounts, OutstandingAccountSetupList } from '~/modules/account';
import HarvestSummaryCards from '~/modules/harvest/HarvestSummaryCards';
import { PageWrapper } from '~/modules/layout';
import { LotsTable } from '~/modules/lot';
import { ErrorPage, LoadingPage } from '~/modules/utility-components';

// TODO: this is repeated in the backend too - combine somehow
const harvestTypeLabel: Record<HarvestType, string> = {
  [HarvestType.ReduceCostBasis]: 'Raise Average Cost Basis',
  [HarvestType.ReduceTaxes]: 'Offset Realized Gains',
  [HarvestType.Sell]: 'Sell Stock',
  [HarvestType.CaptureGainsTaxFree]: 'Capture Gains Tax Free',
};

export default function HomePage() {
  const { data, loading, error } = usePortfolioSummaryQuery();

  if (!data && loading) {
    return <LoadingPage message="Retrieving your portfolio information" />;
  }

  if (error) {
    return <ErrorPage message={error.message} />;
  }

  if (!data && loading) {
    return <LoadingPage message="Retrieving your portfolio information" />;
  }

  if (data?.portfolioSummary.setUpStatus === SetUpStatus.NoAccounts) {
    return (
      <PageWrapper>
        <NoAccounts />
      </PageWrapper>
    );
  }

  if (data?.portfolioSummary.setUpStatus === SetUpStatus.AccountSetupRequired) {
    return (
      <PageWrapper
        title="Account Setup"
        description="Additional information on the following accounts is required to complete setup."
      >
        <OutstandingAccountSetupList />
      </PageWrapper>
    );
  }

  const recommendedHarvest = data?.portfolioSummary.harvestRecommendations.find(
    rec => rec.recommended
  );

  return (
    <PageWrapper className="mx-auto">
      {recommendedHarvest ? (
        <div className="mb-4 w-full">
          <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-yellow-500 to-green-500">
            {/* Patterned background */}
            <div className="absolute inset-0 opacity-10">
              <svg
                className="h-full w-full"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 100 100"
              >
                <defs>
                  <pattern
                    id="dollarPattern"
                    x="0"
                    y="0"
                    width="10%"
                    height="10%"
                    patternUnits="userSpaceOnUse"
                  >
                    <text
                      x="50%"
                      y="50%"
                      dominantBaseline="middle"
                      textAnchor="middle"
                      fontSize="10"
                      fill="currentColor"
                      fontWeight="bold"
                    >
                      $
                    </text>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#dollarPattern)" />
              </svg>
            </div>

            <div className="relative px-4 py-5 sm:p-6">
              <div className="flex flex-col items-center justify-between sm:flex-row">
                <div className="text-background mb-4 text-center sm:mb-0 sm:text-left">
                  <h2 className="text-xl font-bold sm:text-2xl">
                    Ready to improve your portfolio?
                  </h2>
                  <p className="text-md mt-1">
                    We recommend starting with a{' '}
                    <Link
                      className="group"
                      href={TypedRoutes.lotSelection({
                        type: recommendedHarvest.harvestType,
                      })}
                    >
                      <span className="underline">
                        {harvestTypeLabel[recommendedHarvest.harvestType]}
                      </span>
                    </Link>{' '}
                    harvest.
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <Link className="group" href={TypedRoutes.harvestFlowRoot()}>
                    <Button
                      variant="link"
                      className="text-background"
                      iconRight={<Wheat className="h-4 w-4" />}
                    >
                      All Harvest Options
                    </Button>
                  </Link>
                  <Link
                    className="group"
                    href={TypedRoutes.lotSelection({
                      type: recommendedHarvest.harvestType,
                    })}
                  >
                    <Button
                      iconRight={
                        <ArrowRight className="group-hover:translate-x-1" />
                      }
                      className="text-sm font-semibold"
                    >
                      {harvestTypeLabel[recommendedHarvest.harvestType]}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
      <HarvestSummaryCards />
      <LotsTable />
    </PageWrapper>
  );
}
