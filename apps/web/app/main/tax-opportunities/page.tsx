'use client';

import { BarChart3, ArrowUpCircle, TrendingDown, Info } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/card';
import { Button } from '@repo/ui/components/button';
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@repo/ui/components/tooltip';
import Link from 'next/link';

import { CostBasisPairCard } from './api-cost-basis-pair-card';
import { HarvestingOpportunityCard } from './harvesting-opportunity-card';

import { ErrorPage, LoadingPage } from '~/modules/utility-components';
import { useLotFilteredOpportunitiesQuery } from '~/generated/gql';
import { TypedRoutes } from '~/lib/routes';
import { Format } from '~/modules/utils';
import { PageWrapper } from '~/modules/layout';

/**
 * Tax Harvesting Page - New server-driven version
 * This page gets filtered opportunities directly from the backend
 * which handles all the logic for determining which opportunities to show
 * based on the account's realized gain/loss position.
 */
export default function TaxOpportunitiesPage() {
  const { data, error, loading } = useLotFilteredOpportunitiesQuery();

  // Display a loading spinner while data is being fetched
  if (loading) {
    return <LoadingPage />;
  }

  // Display an error message if data fetching failed
  if (error) {
    return <ErrorPage />;
  }

  // Get the filtered data from the API
  const taxStatus = {
    netRealizedPosition: 0,
    isNeutralAccount: false,
  };

  const opportunities = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pairs: any[] = [];

  return (
    <PageWrapper className="flex-1">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        {/* Page Header */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Tax Loss Harvesting
            </h1>
            <p className="text-muted-foreground">
              Optimize your portfolio for tax efficiency
            </p>
          </div>

          {/* Portfolio Summary Card - Show realized gain/loss position */}
          <Card className="bg-muted w-full rounded-xl border-0 md:w-auto">
            <CardHeader className="bg-secondary rounded-t-xl p-4 pb-2">
              <CardTitle className="text-sm font-medium">
                Net Realized Position
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="flex items-center gap-2">
                <span
                  className={`text-2xl font-bold ${taxStatus.netRealizedPosition >= 0 ? 'text-green-500' : 'text-red-500'}`}
                >
                  {Format.money(taxStatus.netRealizedPosition)}
                </span>
              </div>
              <p className="text-muted-foreground mt-1 text-xs">
                {taxStatus.isNeutralAccount
                  ? 'Balanced position: Look for cost basis management opportunities'
                  : taxStatus.netRealizedPosition > 0
                    ? 'Net realized gain: Consider harvesting losses'
                    : 'Net realized loss: Consider harvesting gains'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Portfolio Status */}
        <div className="mb-8 flex flex-col items-start">
          {/* Tax Status */}
          <div className="bg-muted w-full overflow-hidden rounded-xl border-0">
            <div className="bg-secondary flex items-center justify-between border-b p-4">
              <div className="flex items-center space-x-2">
                <BarChart3 className="text-primary h-5 w-5" />
                <h2 className="text-lg font-semibold">Portfolio Tax Status</h2>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      Net Realized Gain/Loss shows your current year tax
                      position.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div className="grid grid-cols-3 divide-x">
              <div className="p-6">
                <div className="flex flex-col">
                  <span className="text-muted-foreground text-sm">
                    Realized Gains
                  </span>
                  <span className="mt-1 text-3xl font-semibold text-green-500">
                    {Format.money(
                      data?.portfolioSummary.realized.gainTotal ?? 0
                    )}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex flex-col">
                  <span className="text-muted-foreground text-sm">
                    Unrealized Losses
                  </span>
                  <span className="mt-1 text-3xl font-semibold text-red-500">
                    -
                    {Format.money(
                      Math.abs(data?.portfolioSummary.unrealized.lossTotal ?? 0)
                    )}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex flex-col">
                  <span className="text-muted-foreground text-sm">
                    Net Position
                  </span>
                  <span
                    className={`mt-1 text-3xl font-semibold ${taxStatus.netRealizedPosition >= 0 ? 'text-green-500' : 'text-red-500'}`}
                  >
                    {taxStatus.netRealizedPosition >= 0 ? '' : '-'}
                    {Format.money(Math.abs(taxStatus.netRealizedPosition))}
                  </span>
                  <span className="text-muted-foreground mt-2 text-sm">
                    {taxStatus.isNeutralAccount
                      ? 'Balanced position: Optimize cost basis'
                      : taxStatus.netRealizedPosition > 0
                        ? 'Harvest losses to offset realized gains'
                        : 'Capture gains to offset realized losses'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="space-y-8">
          {/* For neutral accounts, show cost basis pairs */}
          {taxStatus.isNeutralAccount && pairs.length > 0 && (
            <div className="space-y-6">
              {/* Cost basis reset strategy header removed as requested */}

              <div className="grid grid-cols-1 gap-6">
                {pairs.map((pair: any) => (
                  <CostBasisPairCard
                    key={
                      pair.pairId ||
                      `pair-${pair.gainOpportunity?.id}-${pair.lossOpportunity?.id}`
                    }
                    pair={pair}
                  />
                ))}
              </div>

              {pairs.length === 0 && (
                <Card className="border-0">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center justify-center py-6">
                      <p className="text-muted-foreground text-center">
                        No balanced pairs were found that meet our criteria.
                      </p>
                      <p className="text-muted-foreground mt-2 text-center">
                        We pair positions with similar gain/loss amounts (within
                        15%) to minimize tax impact.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* For accounts with net realized positions, show individual opportunities */}
          {/* {!taxStatus.isNeutralAccount && data?.lots.length > 0 && (
            <div className="space-y-6">
              <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                  {taxStatus.netRealizedPosition > 0 ? (
                    <TrendingDown className="h-5 w-5 text-red-500" />
                  ) : (
                    <ArrowUpCircle className="h-5 w-5 text-green-500" />
                  )}
                  <h2 className="text-lg font-semibold">
                    {taxStatus.netRealizedPosition > 0
                      ? 'Loss Harvesting Opportunities'
                      : 'Gain Harvesting Opportunities'}
                  </h2>
                </div>
                <p className="text-muted-foreground">
                  {taxStatus.netRealizedPosition > 0
                    ? 'Harvest these losses to offset your realized gains and reduce your tax liability'
                    : 'Harvest these gains to offset your realized losses and optimize your tax position'}
                </p>
              </div>

              <div className="mt-8 grid grid-cols-1 gap-8">
                {data?.lots.map(lot => (
                  <HarvestingOpportunityCard key={lot.id} lot={lot} />
                ))}
              </div>
            </div>
          )} */}

          {/* No opportunities message */}
          {opportunities.length === 0 && pairs.length === 0 && (
            <div className="space-y-6">
              <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                  <Info className="text-primary h-5 w-5" />
                  <h2 className="text-lg font-semibold">
                    No Tax Harvesting Opportunities
                  </h2>
                </div>
                <p className="text-muted-foreground">
                  We couldn't find any suitable tax harvesting opportunities for
                  your portfolio at this time
                </p>
              </div>

              <div className="overflow-hidden rounded-xl border-0">
                <div className="flex flex-col items-center justify-center p-10">
                  <div className="mb-4 rounded-full p-3">
                    <Info className="text-muted-foreground h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-lg font-medium">
                    No Available Opportunities
                  </h3>
                  <p className="text-muted-foreground max-w-lg text-center">
                    Check back later as market conditions change, or consider
                    diversifying your portfolio to create more potential
                    harvesting opportunities.
                  </p>
                  <div className="mt-6">
                    <Link href={TypedRoutes.home()}>
                      <Button variant="outline">View Portfolio</Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}
