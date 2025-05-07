'use client';

import { Button } from '@repo/ui/components/button';
import { Scissors } from 'lucide-react';
import Link from 'next/link';

import {
  SetUpStatus,
  usePortfolioSummaryQuery,
} from '~/generated/gql';
import { TypedRoutes } from '~/lib/routes';
import { NoAccounts, OutstandingAccountSetupList } from '~/modules/account';
import HarvestSummaryCards from '~/modules/harvest/HarvestSummaryCards';
import { PageWrapper } from '~/modules/layout';
import { LotsTable } from '~/modules/lot';
import { ErrorPage, LoadingPage } from '~/modules/utility-components';

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
    rec => rec.recommended,
  );

  return (
    <PageWrapper className="mx-auto">
      {recommendedHarvest
        ? (
            <div className="mb-4 w-full">
              <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-yellow-500 to-green-500">
                {/* Patterned background */}
                <div className="absolute inset-0 opacity-10">
                  <svg
                    className="size-full"
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
                    <div className="mb-4 text-center text-background sm:mb-0 sm:text-left">
                      <h2 className="text-xl font-bold sm:text-2xl">
                        Ready to improve your portfolio?
                      </h2>
                      <p className="mt-1">
                        Our
                        {' '}
                        <Link
                          className="group"
                          href={TypedRoutes.lotSelection({
                            type: recommendedHarvest.harvestType,
                          })}
                        >
                          <span className="underline">
                            Tax Opportunities
                          </span>
                        </Link>
                        {' '}
                        will direct you to the best tax-saving opportunities for your portfolio.
                      </p>
                    </div>
                    <div className="shrink-0">
                      <Link className="group" href={TypedRoutes.harvestFlowRoot()}>
                        <Button
                          variant="outline"
                          iconRight={<Scissors className="size-4" />}
                        >
                          Tax Opportunities
                        </Button>
                      </Link>

                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        : null}
      <HarvestSummaryCards />
      <LotsTable />
    </PageWrapper>
  );
}
