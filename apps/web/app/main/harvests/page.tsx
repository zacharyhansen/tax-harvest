'use client';

import { useOpenHarvests } from '~/modules/hooks/use-open-harvests';
import { LoadingPage } from '~/modules/utility-components';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@repo/ui/components/card';
import { HarvestCard } from './harvest-card';
import { motion, AnimatePresence } from 'framer-motion';
import { Info } from 'lucide-react';
import Link from 'next/link';
import { TypedRoutes } from '~/lib/routes';
import { Button } from '@repo/ui/components/button';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const cardVariants = {
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

export default function HarvestsPage() {
  const { harvests, loading, hasOpenHarvests } = useOpenHarvests();

  if (loading) {
    return <LoadingPage />;
  }

  if (!hasOpenHarvests) {
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
              <CardTitle className="text-lg">No Open Harvests</CardTitle>
            </CardHeader>
            <CardContent>
              <motion.p
                className="text-muted-foreground text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                You have no added harvests for today. Check out
                <Link href={TypedRoutes.taxOpportunities()}>
                  <Button variant="link" className="m-0 p-0 px-1">
                    Tax Opportuninties
                  </Button>
                </Link>
                to see harvest opportunities. You can also check out the Wash
                Window Harvests tab to see harvests that are considered
                executed.
              </motion.p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      className="flex grow flex-col gap-4 pt-4"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <AnimatePresence>
        {harvests.map(harvest => (
          <motion.div key={harvest.id} variants={cardVariants} layout>
            <HarvestCard harvest={harvest} />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
