'use client';

import { Button } from '@repo/ui/components/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@repo/ui/components/tooltip';
import { cn } from '@repo/ui/utils';
import { ArrowUpCircle, BarChart3, Info, TrendingDown } from 'lucide-react';

import Link from 'next/link';
import { HarvestType, useFiniteHarvestQuery } from '~/generated/gql';

import { TypedRoutes } from '~/lib/routes';
import { PageWrapper } from '~/modules/layout';
import { ErrorPage, LoadingPage } from '~/modules/utility-components';
import { Format, MoneyUtil } from '~/modules/utils';
import { CostBasisPairCard } from './api-cost-basis-pair-card';
import { HarvestingOpportunityCard } from './harvesting-opportunity-card';

/**
 * Tax Harvesting Page - New server-driven version
 * This page gets filtered opportunities directly from the backend
 * which handles all the logic for determining which opportunities to show
 * based on the account's realized gain/loss position.
 */
export default function TaxOpportunitiesPage() {
  const { data, error, loading } = useFiniteHarvestQuery();

  if (error) {
    return <ErrorPage />;
  }

  if (loading || !data) {
    return <LoadingPage />;
  }

  // eslint-disable-next-line ts/no-explicit-any
  const pairs: any[] = [];

  const netPosition = data?.finiteHarvest.summary.realized.gainTotal;

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
          <Card className="w-full rounded-xl border-0 bg-muted md:w-auto">
            <CardHeader className="rounded-t-xl bg-secondary p-4 pb-2">
              <CardTitle className="text-sm font-medium">
                Net Realized Position
              </CardTitle>
            </CardHeader>
            <CardContent className="p-2">
              <div className="flex items-center gap-2">
                <span
                  className={cn('text-2xl font-bold', MoneyUtil.colored(netPosition))}
                >
                  {Format.money(netPosition)}
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {data?.finiteHarvest.harvestType === HarvestType.ReduceCostBasis
                  ? 'Balanced position: Look for cost basis management opportunities'
                  : data?.finiteHarvest.harvestType === HarvestType.ReduceTaxes
                    ? 'Net realized gain: Consider harvesting losses'
                    : 'Net realized loss: Consider harvesting gains'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Portfolio Status */}
        <div className="mb-8 flex flex-col items-start">
          {/* Tax Status */}
          <div className="w-full overflow-hidden rounded-xl border-0 bg-muted">
            <div className="flex items-center justify-between border-b bg-secondary p-4">
              <div className="flex items-center space-x-2">
                <BarChart3 className="size-5 text-primary" />
                <h2 className="text-lg font-semibold">Portfolio Tax Status</h2>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="size-4 cursor-help" />
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
                  <span className="text-sm text-muted-foreground">
                    Net Position (Realized P & L)
                  </span>
                  <span
                    className={cn('mt-1 text-3xl font-semibold', MoneyUtil.colored(
                      data?.finiteHarvest.summary.realized.gainTotal ?? 0,
                    ))}
                  >
                    {Format.money(
                      data?.finiteHarvest.summary.realized.gainTotal ?? 0,
                    )}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">
                    Unrealized Gain
                  </span>
                  <span
                    className={cn('mt-1 text-3xl font-semibold', MoneyUtil.colored(
                      data?.finiteHarvest.summary.unrealized.gainTotal ?? 0,
                    ))}
                  >
                    {Format.money(
                      (data?.finiteHarvest.summary.unrealized.gainTotal ?? 0),
                    )}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">
                    Unrealized Loss
                  </span>
                  <span
                    className={cn('mt-1 text-3xl font-semibold', MoneyUtil.colored(
                      data?.finiteHarvest.summary.unrealized.lossTotal ?? 0,
                    ))}
                  >
                    {Format.money(
                      (data?.finiteHarvest.summary.unrealized.lossTotal ?? 0),
                    )}
                  </span>
                </div>
              </div>

              {/* <div className="p-6">
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">
                    Net Position
                  </span>
                  <span
                    className={cn('mt-1 text-3xl font-semibold', MoneyUtil.colored(netPosition))}
                  >
                    {Format.money(netPosition)}
                  </span>
                  <span className="mt-2 text-sm text-muted-foreground">
                    {taxStatus.isNeutralAccount
                      ? 'Balanced position: Optimize cost basis'
                      : taxStatus.netRealizedPosition > 0
                        ? 'Harvest losses to offset realized gains'
                        : 'Capture gains to offset realized losses'}
                  </span>
                </div> */}
              {/* </div> */}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="space-y-8">
          {/* For neutral accounts, show cost basis pairs */}
          {pairs.length > 0 && (
            <div className="space-y-6">
              {/* Cost basis reset strategy header removed as requested */}

              <div className="grid grid-cols-1 gap-6">
                {/* eslint-disable-next-line ts/no-explicit-any */}
                {pairs.map((pair: any) => (
                  <CostBasisPairCard
                    key={
                      pair.pairId
                      || `pair-${pair.gainOpportunity?.id}-${pair.lossOpportunity?.id}`
                    }
                    pair={pair}
                  />
                ))}
              </div>

              {pairs.length === 0 && (
                <Card className="border-0">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center justify-center py-6">
                      <p className="text-center text-muted-foreground">
                        No balanced pairs were found that meet our criteria.
                      </p>
                      <p className="mt-2 text-center text-muted-foreground">
                        We pair positions with similar gain/loss amounts (within
                        15%) to minimize tax impact.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          { data?.finiteHarvest?.lotsCurrent?.length
            ? (
                <div className="space-y-6">
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-2">
                      {data.finiteHarvest.summary.realized.gainTotal > 0
                        ? (
                            <TrendingDown className="size-5 text-red-500" />
                          )
                        : (
                            <ArrowUpCircle className="size-5 text-green-500" />
                          )}
                      <h2 className="text-lg font-semibold">
                        {data.finiteHarvest.summary.realized.gainTotal > 0
                          ? 'Loss Harvesting Opportunities'
                          : 'Gain Harvesting Opportunities'}
                      </h2>
                    </div>
                    <p className="text-muted-foreground">
                      {data.finiteHarvest.summary.realized.gainTotal > 0
                        ? 'Harvest these losses to offset your realized gains and reduce your tax liability'
                        : 'Harvest these gains to offset your realized losses and optimize your tax position'}
                    </p>
                  </div>

                  <div className="mt-8 grid grid-cols-1 gap-8">
                    {data?.finiteHarvest?.lotsCurrent?.map(lot => (
                      <HarvestingOpportunityCard
                        key={lot.id}
                        lot={lot}
                        harvestType={data.finiteHarvest.harvestType}
                        netPosition={data.finiteHarvest.summary.realized.gainTotal}
                      />
                    ))}
                  </div>
                </div>
              )
            : null}

          {/* No opportunities message */}
          {!data?.finiteHarvest?.lotsCurrent?.length && (
            <div className="space-y-6">
              <div className="overflow-hidden rounded-xl border-0">
                <div className="flex flex-col items-center justify-center p-10">
                  <div className="mb-4 rounded-full p-3">
                    <Info className="size-6 text-muted-foreground" />
                  </div>
                  <h3 className="mb-2 text-lg font-medium">
                    No Available Opportunities
                  </h3>
                  <p className="max-w-lg text-center text-muted-foreground">
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
