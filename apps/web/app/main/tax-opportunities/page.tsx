'use client';

import NumberFlow from '@number-flow/react';
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
import { HarvestType, useFiniteHarvestQuery } from '~/generated/gql';
import { PageWrapper } from '~/modules/layout';
import { ErrorPage, LoadingPage } from '~/modules/utility-components';
import { Format, MoneyUtil } from '~/modules/utils';
import { CostBasisPairCard } from './api-cost-basis-pair-card';
import { HarvestingOpportunityCard } from './harvesting-opportunity-card';
import NoOpportunities from './no-opportunities';
import {
  Tabs,
  TabsTrigger,
  TabsList,
  TabsContent,
} from '@repo/ui/components/tabs';
import UnrealizedHarvestPage from './unrealized-harvest-items';
import UnrealizedHarvestItems from './unrealized-harvest-items';
import RealizedHarvestItems from './realized-harvest-items';

export default function TaxOpportunitiesPage() {
  const { data, error, loading } = useFiniteHarvestQuery();

  if (error) {
    return <ErrorPage />;
  }

  if (loading || !data) {
    return <LoadingPage />;
  }

  const netPosition = data?.finiteHarvest.summary.realized.gainTotal;

  return (
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
        <Card className="bg-muted/70 w-full rounded-xl border-0 md:w-auto">
          <CardHeader className="bg-muted rounded-t-xl p-4 pb-2">
            <CardTitle className="text-sm font-medium">
              Net Realized Position
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  'text-2xl font-bold',
                  MoneyUtil.colored(netPosition)
                )}
              >
                {Format.money(netPosition)}
              </span>
            </div>
            <p className="text-muted-foreground mt-1 text-xs">
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
        <div className="bg-muted/70 w-full overflow-hidden rounded-xl border-0">
          <div className="bg-muted flex items-center justify-between border-b p-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="text-primary size-5" />
              <h2 className="text-lg font-semibold">Portfolio Tax Status</h2>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="size-4 cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    Net Realized Gain/Loss shows your current year tax position.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="grid grid-cols-3 divide-x">
            <div className="p-6">
              <div className="flex flex-col">
                <span className="text-muted-foreground text-sm">
                  Net Position (Realized P & L)
                </span>
                <span
                  className={cn(
                    'mt-1 text-3xl font-semibold',
                    MoneyUtil.colored(
                      data?.finiteHarvest.summary.realized.gainTotal ?? 0
                    )
                  )}
                >
                  <NumberFlow
                    value={data?.finiteHarvest.summary.realized.gainTotal ?? 0}
                    format={{ currency: 'USD', style: 'currency' }}
                  />
                </span>
              </div>
            </div>

            <div className="p-6">
              <div className="flex flex-col">
                <span className="text-muted-foreground text-sm">
                  Unrealized Gain
                </span>
                <span
                  className={cn(
                    'mt-1 text-3xl font-semibold',
                    MoneyUtil.colored(
                      data?.finiteHarvest.summary.unrealized.gainTotal ?? 0
                    )
                  )}
                >
                  <NumberFlow
                    value={
                      data?.finiteHarvest.summary.unrealized.gainTotal ?? 0
                    }
                    format={{ currency: 'USD', style: 'currency' }}
                  />
                </span>
              </div>
            </div>

            <div className="p-6">
              <div className="flex flex-col">
                <span className="text-muted-foreground text-sm">
                  Unrealized Loss
                </span>
                <span
                  className={cn(
                    'mt-1 text-3xl font-semibold',
                    MoneyUtil.colored(
                      data?.finiteHarvest.summary.unrealized.lossTotal ?? 0
                    )
                  )}
                >
                  <NumberFlow
                    defaultValue={0}
                    value={
                      data?.finiteHarvest.summary.unrealized.lossTotal ?? 0
                    }
                    format={{ currency: 'USD', style: 'currency' }}
                  />
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

      {data.finiteHarvest.unrealizedHarvestMatchResults?.length &&
      data.finiteHarvest.lotsCurrent?.length ? (
        <Tabs defaultValue="realized">
          <TabsList>
            <TabsTrigger value="realized">Realized</TabsTrigger>
            <TabsTrigger value="unrealized">Unrealized</TabsTrigger>
          </TabsList>
          <TabsContent value="realized" className="space-y-8">
            <RealizedHarvestItems finiteHarvest={data.finiteHarvest} />
          </TabsContent>
          <TabsContent value="unrealized" className="space-y-8">
            <UnrealizedHarvestItems
              items={data.finiteHarvest.unrealizedHarvestMatchResults ?? []}
            />
          </TabsContent>
        </Tabs>
      ) : data.finiteHarvest.lotsCurrent?.length ? (
        <RealizedHarvestItems finiteHarvest={data.finiteHarvest} />
      ) : data.finiteHarvest.unrealizedHarvestMatchResults?.length ? (
        <UnrealizedHarvestItems
          items={data.finiteHarvest.unrealizedHarvestMatchResults ?? []}
        />
      ) : (
        <NoOpportunities />
      )}
    </div>
  );
}
