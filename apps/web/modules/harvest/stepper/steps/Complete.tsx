'use client';

import { HARVEST_ID } from 'constants/routes';

import { motion } from 'framer-motion';
import { ArrowRight, Calendar, DollarSign, Rows3, Wheat } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Badge, Button } from 'ui';
import { formatDate } from 'utilities';
import { useHarvestQuery } from 'generated/gql';
import { useCurrentUser } from 'modules/user';
import { LoadingPage } from 'modules/utilityComponents';

interface HarvestSuccessProps {
  harvestId: string;
}

export default function Complete({ harvestId }: HarvestSuccessProps) {
  const user = useCurrentUser();
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const { data, loading } = useHarvestQuery({
    variables: {
      id: harvestId,
    },
  });

  useEffect(() => {
    setIsVisible(true);
  }, []);

  if (loading) {
    return <LoadingPage />;
  }
  const repurchase = data?.harvest.harvestTransactions?.reduce(
    (acc, curr) => acc || !!curr.revert,
    false
  );

  const notify = data?.harvest.harvestTransactions?.reduce(
    (acc, curr) => acc || !!curr.notify,
    false
  );

  return (
    <div className="flex items-center justify-center rounded-3xl bg-gradient-to-br from-green-50 to-green-200 p-4 py-24 dark:from-green-800">
      <motion.div
        className="bg-background flex w-[400px] flex-col items-center justify-center rounded-3xl p-8 text-center shadow-xl"
        initial={{ rotate: -180, scale: 0 }}
        animate={{ rotate: 0, scale: isVisible ? 1 : 0 }}
        transition={{ damping: 20, stiffness: 260, type: 'spring' }}
      >
        <motion.div
          className="mb-4 rounded-full bg-green-100 p-2"
          initial={{ scale: 0 }}
          animate={{ scale: isVisible ? 1 : 0 }}
          transition={{
            damping: 20,
            delay: 0.3,
            stiffness: 260,
            type: 'spring',
          }}
        >
          <div className="rounded-full bg-green-500 p-4">
            <Wheat className="h-12 w-12 text-white" />
          </div>
        </motion.div>

        <h1 className="mb-2 text-2xl font-bold">Harvest Completed!</h1>
        <Badge>{data?.harvest.label}</Badge>
        <h2 className="text-md mb-4">
          {user.name ? `Congratulations, ${user.name},` : 'Congratulations,'}{' '}
          you are on your way to saving money.
        </h2>

        <motion.div
          className="mb-4 rounded-full bg-green-100 p-2"
          initial={{ scale: 0 }}
          animate={{ scale: isVisible ? 1 : 0 }}
          transition={{
            damping: 20,
            delay: 0.5,
            stiffness: 260,
            type: 'spring',
          }}
        >
          <div className="rounded-full bg-green-500 p-3">
            <p className="flex items-center justify-center text-2xl font-bold text-white">
              <DollarSign className="mr-1 h-6 w-6" />
              {data?.harvest.amount.toLocaleString('en-US', {
                maximumFractionDigits: 2,
                minimumFractionDigits: 2,
              })}
            </p>
          </div>
        </motion.div>

        <div className="mb-4 grid grid-cols-2 gap-4">
          <div className="flex flex-col items-center">
            <div className="mb-1 rounded-full bg-green-100 p-2">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
            <p className="text-sm text-gray-600">Harvest Date</p>
            <p className="text-sm font-semibold">
              {formatDate(data?.harvest.date)}
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="mb-1 rounded-full bg-green-100 p-2">
              <Rows3 className="h-6 w-6 text-green-600" />
            </div>
            <p className="text-sm text-gray-600">Transactions</p>
            <p className="text-sm font-semibold">
              {data?.harvest.harvestTransactions?.length}
            </p>
          </div>
        </div>

        <p className="mb-4 text-xs text-gray-500">
          Notifications:{' '}
          <Badge variant={notify ? 'default' : 'secondary'}>
            {notify ? 'On' : 'Off'}
          </Badge>
        </p>
        <p className="mb-4 text-xs text-gray-500">
          Repurchase:{' '}
          <Badge variant={repurchase ? 'default' : 'secondary'}>
            {repurchase ? 'Yes' : 'No'}
          </Badge>
        </p>
        <Button
          variant="outline"
          onClick={() =>
            router.push(
              HARVEST_ID({
                id: harvestId,
              })
            )
          }
        >
          View Details <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </motion.div>
    </div>
  );
}
