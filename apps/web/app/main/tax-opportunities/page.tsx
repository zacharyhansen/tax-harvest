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
import { BarChart3, Info } from 'lucide-react';
import { HarvestType, useFiniteHarvestQuery } from '~/generated/gql';
import { ErrorPage, LoadingPage } from '~/modules/utility-components';
import { Format, MoneyUtil } from '~/modules/utils';
import {
  Tabs,
  TabsTrigger,
  TabsList,
  TabsContent,
} from '@repo/ui/components/tabs';
import UnrealizedHarvestItems from './unrealized-harvest-items';
import RealizedHarvestItems from './realized-harvest-items';
import { motion, AnimatePresence } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.95,
  },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 260,
      damping: 20,
    },
  },
};

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
    <motion.div
      className="container mx-auto max-w-6xl px-4 py-8"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Page Header */}
      <motion.div
        className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
        variants={itemVariants}
      >
        <div>
          <motion.h1
            className="text-3xl font-bold tracking-tight"
            variants={itemVariants}
          >
            Tax Loss Harvesting
          </motion.h1>
          <motion.p className="text-muted-foreground" variants={itemVariants}>
            Optimize your portfolio for tax efficiency
          </motion.p>
        </div>

        {/* Portfolio Summary Card */}
        <motion.div variants={itemVariants}>
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
        </motion.div>
      </motion.div>

      {/* Portfolio Status */}
      <motion.div
        className="mb-8 flex flex-col items-start"
        variants={itemVariants}
      >
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

          <motion.div
            className="grid grid-cols-3 divide-x"
            variants={itemVariants}
          >
            <motion.div className="p-6" variants={itemVariants}>
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
            </motion.div>

            <motion.div className="p-6" variants={itemVariants}>
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
            </motion.div>

            <motion.div className="p-6" variants={itemVariants}>
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
            </motion.div>
          </motion.div>
          <motion.div
            className="grid grid-cols-3 divide-x"
            variants={itemVariants}
          >
            <motion.div className="px-6 py-0" variants={itemVariants}>
              <div className="flex flex-col">
                <span className="text-muted-foreground text-xs">
                  after current harvest
                </span>
                <span
                  className={cn(
                    'mt-1 font-semibold',
                    MoneyUtil.colored(
                      data?.finiteHarvest.summary.includingCurrentHarvest
                        .realized.gainTotal ?? 0
                    )
                  )}
                >
                  <NumberFlow
                    value={
                      data?.finiteHarvest.summary.includingCurrentHarvest
                        .realized.gainTotal ?? 0
                    }
                    format={{ currency: 'USD', style: 'currency' }}
                  />
                </span>
              </div>
            </motion.div>

            <motion.div className="px-6 py-0" variants={itemVariants}>
              <div className="flex flex-col">
                <span className="text-muted-foreground text-xs">
                  after current harvest
                </span>
                <span
                  className={cn(
                    'mt-1 font-semibold',
                    MoneyUtil.colored(
                      data?.finiteHarvest.summary.includingCurrentHarvest
                        .unrealized.gainTotal ?? 0
                    )
                  )}
                >
                  <NumberFlow
                    value={
                      data?.finiteHarvest.summary.includingCurrentHarvest
                        .unrealized.gainTotal ?? 0
                    }
                    format={{ currency: 'USD', style: 'currency' }}
                  />
                </span>
              </div>
            </motion.div>

            <motion.div className="px-6 py-0" variants={itemVariants}>
              <div className="flex flex-col">
                <span className="text-muted-foreground text-xs">
                  after current harvest
                </span>
                <span
                  className={cn(
                    'mt-1 font-semibold',
                    MoneyUtil.colored(
                      data?.finiteHarvest.summary.includingCurrentHarvest
                        .unrealized.lossTotal ?? 0
                    )
                  )}
                >
                  <NumberFlow
                    defaultValue={0}
                    value={
                      data?.finiteHarvest.summary.includingCurrentHarvest
                        .unrealized.lossTotal ?? 0
                    }
                    format={{ currency: 'USD', style: 'currency' }}
                  />
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      <AnimatePresence>
        {data.finiteHarvest.unrealizedHarvestMatchResults?.length &&
        data.finiteHarvest.lotsCurrent?.length ? (
          <motion.div variants={itemVariants}>
            <Tabs defaultValue="realized">
              <TabsList>
                <TabsTrigger value="realized">Realized</TabsTrigger>
                <TabsTrigger value="unrealized">Unrealized</TabsTrigger>
              </TabsList>
              <TabsContent value="realized" className="space-y-8">
                <RealizedHarvestItems finiteHarvest={data.finiteHarvest} />
              </TabsContent>
              <TabsContent value="unrealized" className="flex flex-col gap-4">
                <UnrealizedHarvestItems finiteHarvest={data.finiteHarvest} />
              </TabsContent>
            </Tabs>
          </motion.div>
        ) : data.finiteHarvest.lotsCurrent?.length ? (
          <RealizedHarvestItems finiteHarvest={data.finiteHarvest} />
        ) : (
          <UnrealizedHarvestItems finiteHarvest={data.finiteHarvest} />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
