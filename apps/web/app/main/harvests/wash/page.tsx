'use client';

import { useHarvestsAndTransactionsQuery } from '~/generated/gql';
import { HarvestCard } from '../harvest-card';
import { LoadingPage } from '~/modules/utility-components/loading-page';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/card';
import { Info } from 'lucide-react';
import { motion } from 'framer-motion';

export default function WashHarvestsPage() {
  const { data, loading } = useHarvestsAndTransactionsQuery({
    variables: {
      where: {
        date: {
          gte: new Date(new Date().setHours(23, 59, 59, 999)),
          lte: new Date(new Date().setDate(new Date().getDate() + 32)),
        },
      },
    },
  });

  if (loading) {
    <LoadingPage />;
  }

  if (!data?.harvests.length) {
    return (
      <div className="flex grow flex-col gap-4 pt-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center gap-2 pb-2">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  delay: 0.2,
                  duration: 0.4,
                  type: 'spring',
                  stiffness: 260,
                  damping: 20,
                }}
              >
                <Info className="text-muted-foreground h-5 w-5" />
              </motion.div>
              <CardTitle className="text-lg">No Wash Harvests</CardTitle>
            </CardHeader>
            <CardContent>
              <motion.p
                className="text-muted-foreground text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                Today's harvests will automatically be added to the wash window
                after 24 hours so you are notified when they capture their tax
                gains.
              </motion.p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex grow flex-col gap-4 pt-4">
      {data?.harvests?.map(harvest => (
        <HarvestCard key={harvest.id} harvest={harvest} />
      ))}
    </div>
  );
}
