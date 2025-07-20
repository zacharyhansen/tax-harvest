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
import { Button } from '@repo/ui/components/button';
import { cn } from '@repo/ui/utils';
import { BarChart3, ChevronDown, Info, Filter } from 'lucide-react';
import {
  HarvestType,
  useHarvestEvalResultQuery,
  type HarvestEvalResultFragmentFragment,
} from '~/generated/gql';
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
import { HarvestEvalPairCard } from './harvest-eval-pair-card';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@repo/ui/components/collapsible';
import { useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import NoOpportunities from './no-opportunities';
import { OpenHarvestsBanner } from './open-harvests-banner';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider } from 'react-hook-form';
import { z } from 'zod';
import { useStandardForm } from '@repo/ui/hooks/use-standard-form';
import InputField from '@repo/ui/form-builder/fields/input.field';
import ComboboxMultiField from '@repo/ui/form-builder/fields/combobox-multi.field';

const filterFormSchema = z.object({
  minPAndL: z.number().optional(),
  excludeAssetSymbols: z.array(z.string()).optional(),
  purchaseDateBefore: z.string().optional(),
  purchaseDateAfter: z.string().optional(),
});

type FilterFormData = z.infer<typeof filterFormSchema>;

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
  },
  show: {
    opacity: 1,
  },
};

interface FilterFormProps {
  availableSymbols: string[];
  onFiltersSubmit: (filters: FilterFormData) => void;
  initialValues: FilterFormData;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

function FilterForm({
  availableSymbols,
  onFiltersSubmit,
  initialValues,
  hasActiveFilters,
  onClearFilters,
}: FilterFormProps) {
  const [showFilters, setShowFilters] = useState(false);

  const symbolOptions = availableSymbols.map(symbol => ({
    label: symbol,
    value: symbol,
  }));

  const { form, handleSubmit } = useStandardForm<FilterFormData>({
    defaultValues: initialValues,
    resolver: zodResolver(filterFormSchema),
    handleSubmit: data => {
      onFiltersSubmit(data);
      setShowFilters(false);
    },
  });

  return (
    <motion.div variants={itemVariants}>
      <div className="mb-4 flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
        >
          <Filter className="size-4" />
          Filters
          {hasActiveFilters && (
            <span className="bg-primary text-primary-foreground rounded-full px-2 py-1 text-xs">
              {Object.values(initialValues).filter(Boolean).length}
            </span>
          )}
        </Button>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            Clear all filters
          </Button>
        )}
      </div>

      <Collapsible open={showFilters} onOpenChange={setShowFilters}>
        <CollapsibleContent>
          <Card>
            <CardContent className="p-4">
              <FormProvider {...form}>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <InputField
                      name="minPAndL"
                      label="Min P&L ($)"
                      type="number"
                      placeholder="e.g. 100"
                      description="Minimum dollar amount for profit or loss"
                    />

                    <ComboboxMultiField
                      name="excludeAssetSymbols"
                      label="Exclude Symbols"
                      options={symbolOptions}
                      placeholder="Select symbols to exclude"
                      description="Asset symbols to exclude from results"
                    />

                    <InputField
                      name="purchaseDateBefore"
                      label="Purchased Before"
                      type="date"
                      description="Only include lots purchased before this date"
                    />

                    <InputField
                      name="purchaseDateAfter"
                      label="Purchased After"
                      type="date"
                      description="Only include lots purchased after this date"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowFilters(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">Apply Filters</Button>
                  </div>
                </form>
              </FormProvider>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>
    </motion.div>
  );
}

interface HarvestContentProps {
  harvestEvalResult: HarvestEvalResultFragmentFragment;
}

function HarvestContent({ harvestEvalResult }: HarvestContentProps) {
  const { harvestType, lotsCurrent } = harvestEvalResult;

  switch (harvestType) {
    case HarvestType.NoOpportunityEmpty:
    case HarvestType.NoOpportunityGains:
    case HarvestType.NoOpportunityLosses:
      return (
        <NoOpportunities
          realizedPAndL={harvestEvalResult.summary.realized.gainTotal}
          unrealizedPAndL={harvestEvalResult.summary.unrealized.total}
        />
      );

    case HarvestType.ReduceCostBasis:
      return (
        <motion.div className="space-y-4" variants={itemVariants}>
          <div className="mb-6">
            <h2 className="mb-2 text-xl font-semibold">
              Cost Basis Reset Opportunities
            </h2>
            <p className="text-muted-foreground">
              Pair gains and losses to reset your cost basis with minimal tax
              impact
            </p>
          </div>
          {harvestEvalResult.matchedItems?.map(item => (
            <HarvestEvalPairCard key={item.id} harvestMatchItem={item} />
          ))}
        </motion.div>
      );

    case HarvestType.ReduceTaxes:
    case HarvestType.CaptureGainsTaxFree:
      if (harvestEvalResult.matchedItems?.length) {
        return (
          <motion.div variants={itemVariants}>
            <Tabs defaultValue="realized">
              <TabsList>
                <TabsTrigger value="realized">Realized Positions</TabsTrigger>
                <TabsTrigger value="unrealized">
                  Unrealized Harvesting Opportunities
                </TabsTrigger>
              </TabsList>
              <TabsContent value="unrealized" className="space-y-4">
                <TabsContent value="realized" className="space-y-8">
                  <RealizedHarvestItems
                    finiteHarvest={{
                      summary: harvestEvalResult.summary,
                      harvestType: harvestEvalResult.harvestType,
                      totalHarvestLots: harvestEvalResult.totalHarvestLots || 0,
                      lotsCurrent: lotsCurrent,
                    }}
                  />
                </TabsContent>
                <UnrealizedHarvestItems
                  finiteHarvest={{
                    lotsCurrent,
                    harvestType,
                    totalHarvestLots: harvestEvalResult.totalHarvestLots || 0,
                    summary: harvestEvalResult.summary,
                    unrealizedHarvestMatchResults: [],
                  }}
                />
              </TabsContent>
            </Tabs>
          </motion.div>
        );
      }
      return (
        <motion.div variants={itemVariants}>
          <RealizedHarvestItems
            finiteHarvest={{
              summary: harvestEvalResult.summary,
              harvestType: harvestEvalResult.harvestType,
              totalHarvestLots: harvestEvalResult.totalHarvestLots || 0,
              lotsCurrent: lotsCurrent,
            }}
          />
        </motion.div>
      );

    default:
      return null;
  }
}

export default function TaxOpportunitiesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Parse filters from URL
  const filters = useMemo(() => {
    const result: FilterFormData = {};
    const minPAndL = searchParams.get('minPAndL');
    const excludeSymbols = searchParams.get('excludeSymbols');
    const purchaseDateBefore = searchParams.get('purchaseDateBefore');
    const purchaseDateAfter = searchParams.get('purchaseDateAfter');

    if (minPAndL) result.minPAndL = Number(minPAndL);
    if (excludeSymbols)
      result.excludeAssetSymbols = excludeSymbols.split(',').filter(Boolean);
    if (purchaseDateBefore) result.purchaseDateBefore = purchaseDateBefore;
    if (purchaseDateAfter) result.purchaseDateAfter = purchaseDateAfter;

    return result;
  }, [searchParams]);

  // Convert filters to GraphQL format
  const graphqlFilters = useMemo(() => {
    const hasFilters = Object.values(filters).some(
      value =>
        value !== undefined &&
        value !== null &&
        (!Array.isArray(value) || value.length > 0)
    );

    if (!hasFilters) return undefined;

    return {
      minPAndL: filters.minPAndL,
      excludeAssetSymbols: filters.excludeAssetSymbols,
      purchaseDateBefore: filters.purchaseDateBefore
        ? new Date(filters.purchaseDateBefore)
        : undefined,
      purchaseDateAfter: filters.purchaseDateAfter
        ? new Date(filters.purchaseDateAfter)
        : undefined,
    };
  }, [filters]);

  const { data, error, loading } = useHarvestEvalResultQuery({
    variables: { filters: graphqlFilters },
  });

  // Update URL when filters change
  const handleFiltersSubmit = (newFilters: FilterFormData) => {
    const params = new URLSearchParams();

    if (newFilters.minPAndL)
      params.set('minPAndL', newFilters.minPAndL.toString());
    if (newFilters.excludeAssetSymbols?.length)
      params.set('excludeSymbols', newFilters.excludeAssetSymbols.join(','));
    if (newFilters.purchaseDateBefore)
      params.set('purchaseDateBefore', newFilters.purchaseDateBefore);
    if (newFilters.purchaseDateAfter)
      params.set('purchaseDateAfter', newFilters.purchaseDateAfter);

    const queryString = params.toString();
    router.push(queryString ? `?${queryString}` : '/main/tax-opportunities');
  };

  const clearAllFilters = () => {
    router.push('/main/tax-opportunities');
  };

  const hasActiveFilters = Object.values(filters).some(
    value =>
      value !== undefined &&
      value !== null &&
      (!Array.isArray(value) || value.length > 0)
  );

  // Get unique asset symbols for the exclude filter
  const availableSymbols = useMemo(() => {
    if (!data?.harvestEvalResult) return [];

    const symbols = new Set<string>();

    // From lotsCurrent
    data.harvestEvalResult.lotsCurrent?.forEach(lot => {
      symbols.add(lot.symbol);
    });

    // From matchedItems
    data.harvestEvalResult.matchedItems?.forEach(item => {
      item.pairs.forEach(pair => {
        pair.sourceLots.forEach(lot => symbols.add(lot.symbol));
        pair.matchedLots.forEach(lot => symbols.add(lot.symbol));
      });
    });

    return Array.from(symbols).sort();
  }, [data]);

  if (error) {
    return <ErrorPage />;
  }

  if (loading || !data) {
    return <LoadingPage />;
  }

  const harvestEvalResult = data.harvestEvalResult;
  const netPosition = harvestEvalResult.summary.realized.gainTotal;

  return (
    <motion.div
      className="container mx-auto max-w-6xl space-y-4 px-4 py-8"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Page Header */}
      <motion.div
        className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
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
                {harvestEvalResult.harvestType === HarvestType.ReduceCostBasis
                  ? 'Balanced position: Look for cost basis management opportunities'
                  : harvestEvalResult.harvestType === HarvestType.ReduceTaxes
                    ? 'Net realized gain: Consider harvesting losses'
                    : harvestEvalResult.harvestType ===
                        HarvestType.CaptureGainsTaxFree
                      ? 'Net realized loss: Consider harvesting gains'
                      : harvestEvalResult.harvestType ===
                          HarvestType.NoOpportunityEmpty
                        ? 'No positions to harvest'
                        : harvestEvalResult.harvestType ===
                            HarvestType.NoOpportunityGains
                          ? 'All positions have gains'
                          : 'All positions have losses'}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Portfolio Status */}
      <motion.div
        className="bg-background top-16 z-20 flex flex-col items-start md:sticky"
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
                              harvestEvalResult.summary.realized.gainTotal ?? 0
                            )
                          )}
                        >
                          <NumberFlow
                            value={
                              harvestEvalResult.summary.realized.gainTotal ?? 0
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
                                harvestEvalResult.summary.unrealized
                                  .gainTotal ?? 0
                              )
                            )}
                          >
                            <NumberFlow
                              value={
                                harvestEvalResult.summary.unrealized
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
                                harvestEvalResult.summary.unrealized
                                  .lossTotal ?? 0
                              )
                            )}
                          >
                            <NumberFlow
                              defaultValue={0}
                              value={
                                harvestEvalResult.summary.unrealized
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
                          harvestEvalResult.summary.realized.gainTotal ?? 0
                        )
                      )}
                    >
                      <NumberFlow
                        value={
                          harvestEvalResult.summary.realized.gainTotal ?? 0
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
                          harvestEvalResult.summary.unrealized.gainTotal ?? 0
                        )
                      )}
                    >
                      <NumberFlow
                        value={
                          harvestEvalResult.summary.unrealized.gainTotal ?? 0
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
                          harvestEvalResult.summary.unrealized.lossTotal ?? 0
                        )
                      )}
                    >
                      <NumberFlow
                        defaultValue={0}
                        value={
                          harvestEvalResult.summary.unrealized.lossTotal ?? 0
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
                          harvestEvalResult.summary.includingCurrentHarvest
                            .realized.gainTotal ?? 0
                        )
                      )}
                    >
                      <NumberFlow
                        value={
                          harvestEvalResult.summary.includingCurrentHarvest
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
                          harvestEvalResult.summary.includingCurrentHarvest
                            .unrealized.gainTotal ?? 0
                        )
                      )}
                    >
                      <NumberFlow
                        value={
                          harvestEvalResult.summary.includingCurrentHarvest
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
                          harvestEvalResult.summary.includingCurrentHarvest
                            .unrealized.lossTotal ?? 0
                        )
                      )}
                    >
                      <NumberFlow
                        defaultValue={0}
                        value={
                          harvestEvalResult.summary.includingCurrentHarvest
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

      {/* Open Harvests Banner */}
      <motion.div variants={itemVariants}>
        <OpenHarvestsBanner />
      </motion.div>

      {/* Filters Section */}
      <FilterForm
        availableSymbols={availableSymbols}
        onFiltersSubmit={handleFiltersSubmit}
        initialValues={filters}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={clearAllFilters}
      />

      <AnimatePresence>
        <HarvestContent harvestEvalResult={harvestEvalResult} />
      </AnimatePresence>
    </motion.div>
  );
}
