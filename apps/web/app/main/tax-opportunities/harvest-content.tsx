'use client';

import { motion } from 'framer-motion';
import {
  HarvestType,
  type HarvestEvalResultFragmentFragment,
} from '~/generated/gql';
import {
  Tabs,
  TabsTrigger,
  TabsList,
  TabsContent,
} from '@repo/ui/components/tabs';
import RealizedHarvestItems from './realized-harvest-items';
import { HarvestEvalPairCard } from './harvest-eval-pair-card';
import NoOpportunities from './no-opportunities';

const itemVariants = {
  hidden: {
    opacity: 0,
  },
  show: {
    opacity: 1,
  },
};

interface HarvestContentProps {
  harvestEvalResult: HarvestEvalResultFragmentFragment;
}

export function HarvestContent({ harvestEvalResult }: HarvestContentProps) {
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
                <div className="mb-6">
                  <h2 className="mb-2 text-xl font-semibold">
                    Cost Basis Reset Opportunities
                  </h2>
                  <p className="text-muted-foreground">
                    Pair gains and losses to reset your cost basis with minimal
                    tax impact
                  </p>
                </div>
                {harvestEvalResult.matchedItems?.map(item => (
                  <HarvestEvalPairCard key={item.id} harvestMatchItem={item} />
                ))}
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