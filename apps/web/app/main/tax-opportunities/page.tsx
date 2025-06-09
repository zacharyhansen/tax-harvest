'use client'

import NumberFlow from '@number-flow/react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/card'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@repo/ui/components/tooltip'
import { cn } from '@repo/ui/utils'

import { ArrowUpCircle, BarChart3, Info, TrendingDown } from 'lucide-react'

import { HarvestType, useFiniteHarvestQuery } from '~/generated/gql'
import { PageWrapper } from '~/modules/layout'
import { ErrorPage, LoadingPage } from '~/modules/utility-components'
import { Format, MoneyUtil } from '~/modules/utils'
import { CostBasisPairCard } from './api-cost-basis-pair-card'
import { HarvestingOpportunityCard } from './harvesting-opportunity-card'
import NoOpportunities from './no-opportunities'

export default function TaxOpportunitiesPage() {
  const { data, error, loading } = useFiniteHarvestQuery()

  if (error) {
    return <ErrorPage />
  }

  if (loading || !data) {
    return <LoadingPage />
  }

  const netPosition = data?.finiteHarvest.summary.realized.gainTotal

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
                    MoneyUtil.colored(netPosition),
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
                    Net Position (Realized P & L)
                  </span>
                  <span
                    className={cn(
                      'mt-1 text-3xl font-semibold',
                      MoneyUtil.colored(
                        data?.finiteHarvest.summary.realized.gainTotal ?? 0,
                      ),
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
                        data?.finiteHarvest.summary.unrealized.gainTotal ?? 0,
                      ),
                    )}
                  >
                    <NumberFlow
                      value={data?.finiteHarvest.summary.unrealized.gainTotal ?? 0}
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
                        data?.finiteHarvest.summary.unrealized.lossTotal ?? 0,
                      ),
                    )}
                  >
                    <NumberFlow
                      defaultValue={0}
                      value={data?.finiteHarvest.summary.unrealized.lossTotal ?? 0}
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

        {/* Main Content Area */}
        <div className="space-y-8">

          {data.finiteHarvest.harvestType === HarvestType.ReduceCostBasis
            ? data.finiteHarvest.unrealizedHarvestMatchResults?.length
              ? data.finiteHarvest.unrealizedHarvestMatchResults?.map(result => (
                <CostBasisPairCard
                  key={result.sourceLot.id}
                  harvestItem={result}
                />
              ))
              : <NoOpportunities />
            : data?.finiteHarvest?.lotsCurrent?.length
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
              : <NoOpportunities />}
        </div>
      </div>
    </PageWrapper>
  )
}
