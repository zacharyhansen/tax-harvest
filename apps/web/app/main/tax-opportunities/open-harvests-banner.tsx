'use client';

import Link from 'next/link';
import { AlertCircle, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@repo/ui/components/card';
import { Button } from '@repo/ui/components/button';
import { motion } from 'framer-motion';
import { useOpenHarvests } from '~/modules/hooks/use-open-harvests';
import { TypedRoutes } from '~/lib/routes';

export function OpenHarvestsBanner() {
  const { openHarvestCount, hasOpenHarvests } = useOpenHarvests();

  if (!hasOpenHarvests) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-accent border-accent">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertCircle className="text-primary h-5 w-5" />
              <div>
                <p className="text-accent-foreground font-medium">
                  You have {openHarvestCount} open harvest
                  {openHarvestCount !== 1 ? 's' : ''}
                </p>
                <p className="text-muted-foreground text-sm">
                  Review and manage your pending harvests
                </p>
              </div>
            </div>
            <Link href={TypedRoutes.harvests()}>
              <Button variant="outline" size="sm" className="gap-2">
                View Harvests
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
