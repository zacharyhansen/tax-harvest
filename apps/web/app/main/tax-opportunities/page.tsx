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
import { BarChart3, ChevronDown, Info } from 'lucide-react';
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@repo/ui/components/collapsible';
import { useState } from 'react';

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
  const [isCollapsed, setIsCollapsed] = useState(false);

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
        className="bg-background top-16 z-20 mb-8 flex flex-col items-start md:sticky"
        variants={itemVariants}
      >
        <Collapsible
          open={!isCollapsed}
          onOpenChange={open => setIsCollapsed(!open)}
          className="w-full"
        >
          <div className="bg-muted/70 w-full overflow-hidden rounded-xl border-0">
            <div className="bg-muted flex items-center justify-between border-b p-3 sm:p-4">
              <div className="flex items-center space-x-2">
                <BarChart3 className="text-primary size-4 sm:size-5" />
                <h2 className="mr-4 text-base font-semibold sm:text-lg">
                  Portfolio Tax Status
                </h2>
                {isCollapsed && (
                  <div className="bg-muted/30 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-4">
                      <div>
                        <span className="text-muted-foreground text-xs">
                          Net Position
                        </span>
                        <div
                          className={cn(
                            'font-semibold',
                            MoneyUtil.colored(
                              data?.finiteHarvest.summary.realized.gainTotal ??
                                0
                            )
                          )}
                        >
                          <NumberFlow
                            value={
                              data?.finiteHarvest.summary.realized.gainTotal ??
                              0
                            }
                            format={{ currency: 'USD', style: 'currency' }}
                          />
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">
                          Unrealized Gain
                        </span>
                        <div className="flex items-center space-x-2">
                          <span
                            className={cn(
                              'font-semibold',
                              MoneyUtil.colored(
                                data?.finiteHarvest.summary.unrealized
                                  .gainTotal ?? 0
                              )
                            )}
                          >
                            <NumberFlow
                              value={
                                data?.finiteHarvest.summary.unrealized
                                  .gainTotal ?? 0
                              }
                              format={{ currency: 'USD', style: 'currency' }}
                            />
                          </span>
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground text-xs">
                          Unrealized Loss
                        </span>
                        <div className="flex items-center space-x-2">
                          <span
                            className={cn(
                              'font-semibold',
                              MoneyUtil.colored(
                                data?.finiteHarvest.summary.unrealized
                                  .lossTotal ?? 0
                              )
                            )}
                          >
                            <NumberFlow
                              defaultValue={0}
                              value={
                                data?.finiteHarvest.summary.unrealized
                                  .lossTotal ?? 0
                              }
                              format={{ currency: 'USD', style: 'currency' }}
                            />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-2">
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
                <CollapsibleTrigger asChild>
                  <button className="hover:bg-muted-foreground/10 rounded-full p-1 transition-colors">
                    <ChevronDown
                      className={cn(
                        'size-4 transition-transform duration-200',
                        !isCollapsed && 'rotate-180'
                      )}
                    />
                  </button>
                </CollapsibleTrigger>
              </div>
            </div>

            {/* Expanded View */}
            <CollapsibleContent>
              <motion.div
                className="grid grid-cols-1 divide-y sm:grid-cols-3 sm:divide-x sm:divide-y-0"
                variants={itemVariants}
              >
                <motion.div
                  className="px-4 pt-2 sm:px-6"
                  variants={itemVariants}
                >
                  <div className="flex flex-col">
                    <span className="text-muted-foreground text-xs sm:text-sm">
                      Net Position (Realized P & L)
                    </span>
                    <span
                      className={cn(
                        'mt-1 text-2xl font-semibold sm:text-3xl',
                        MoneyUtil.colored(
                          data?.finiteHarvest.summary.realized.gainTotal ?? 0
                        )
                      )}
                    >
                      <NumberFlow
                        value={
                          data?.finiteHarvest.summary.realized.gainTotal ?? 0
                        }
                        format={{ currency: 'USD', style: 'currency' }}
                      />
                    </span>
                  </div>
                </motion.div>

                <motion.div
                  className="px-4 pt-2 sm:px-6"
                  variants={itemVariants}
                >
                  <div className="flex flex-col">
                    <span className="text-muted-foreground text-xs sm:text-sm">
                      Unrealized Gain
                    </span>
                    <span
                      className={cn(
                        'mt-1 text-2xl font-semibold sm:text-3xl',
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

                <motion.div
                  className="px-4 pt-2 sm:px-6"
                  variants={itemVariants}
                >
                  <div className="flex flex-col">
                    <span className="text-muted-foreground text-xs sm:text-sm">
                      Unrealized Loss
                    </span>
                    <span
                      className={cn(
                        'mt-1 text-2xl font-semibold sm:text-3xl',
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
                className="bg-muted/30 grid grid-cols-1 divide-y sm:grid-cols-3 sm:divide-x sm:divide-y-0"
                variants={itemVariants}
              >
                <motion.div
                  className="px-4 py-2 sm:px-6 sm:py-3"
                  variants={itemVariants}
                >
                  <div className="flex flex-col">
                    <span className="text-muted-foreground text-[10px] sm:text-xs">
                      after current harvest
                    </span>
                    <span
                      className={cn(
                        'mt-0.5 text-sm font-semibold sm:text-base',
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

                <motion.div
                  className="px-4 py-2 sm:px-6 sm:py-3"
                  variants={itemVariants}
                >
                  <div className="flex flex-col">
                    <span className="text-muted-foreground text-[10px] sm:text-xs">
                      after current harvest
                    </span>
                    <span
                      className={cn(
                        'mt-0.5 text-sm font-semibold sm:text-base',
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

                <motion.div
                  className="px-4 py-2 sm:px-6 sm:py-3"
                  variants={itemVariants}
                >
                  <div className="flex flex-col">
                    <span className="text-muted-foreground text-[10px] sm:text-xs">
                      after current harvest
                    </span>
                    <span
                      className={cn(
                        'mt-0.5 text-sm font-semibold sm:text-base',
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
            </CollapsibleContent>
          </div>
        </Collapsible>
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
