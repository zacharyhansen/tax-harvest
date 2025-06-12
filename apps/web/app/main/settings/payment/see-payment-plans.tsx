'use client';

import { Button } from '@repo/ui/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/card';
import { useRouter } from 'next/navigation';
import {
  LockIcon,
  LineChartIcon,
  BellIcon,
  TrendingUpIcon,
  ArrowRightIcon,
} from 'lucide-react';
import { motion } from 'framer-motion';

const MotionCard = motion(Card);
const MotionIcon = motion.div;

const container = {
  hidden: { opacity: 0, scale: 0.95 },
  show: {
    opacity: 1,
    scale: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const features = [
  { icon: LineChartIcon, text: 'Advanced Analytics' },
  { icon: BellIcon, text: 'Smart Notifications' },
  { icon: TrendingUpIcon, text: 'Performance Tracking' },
];

export function SeePaymentPlans({
  title,
  description,
  subTitle,
}: {
  title?: string;
  description?: string;
  subTitle?: string;
}) {
  const router = useRouter();

  return (
    <MotionCard
      className="mx-auto w-full max-w-xl"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <CardHeader className="text-center">
        <motion.div
          className="mb-4 flex justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        >
          <div className="bg-secondary rounded-full p-3">
            <LockIcon className="h-6 w-6" />
          </div>
        </motion.div>
        <motion.div variants={item}>
          <CardTitle>{title ?? 'Premium Feature Required'}</CardTitle>
        </motion.div>
        <motion.div variants={item}>
          <CardDescription>
            {subTitle ?? 'Unlock advanced tax harvesting capabilities'}
          </CardDescription>
        </motion.div>
      </CardHeader>
      <CardContent>
        <motion.div
          className="mb-6 grid grid-cols-3 gap-4"
          variants={container}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center text-center"
              variants={item}
            >
              <MotionIcon
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="bg-muted mb-2 rounded-full p-2"
              >
                <feature.icon className="h-4 w-4" />
              </MotionIcon>
              <span className="text-muted-foreground text-sm">
                {feature.text}
              </span>
            </motion.div>
          ))}
        </motion.div>
        <motion.p className="text-muted-foreground text-center" variants={item}>
          {description ??
            'This feature is available with our premium plans. Upgrade your account to access advanced tax harvesting tools, automated notifications, and more.'}
        </motion.p>
      </CardContent>
      <CardFooter className="flex justify-center">
        <motion.div
          variants={item}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            onClick={() => router.push('/main/settings/payment')}
            size="lg"
          >
            View Payment Plans <ArrowRightIcon className="ml-2 h-4 w-4" />
          </Button>
        </motion.div>
      </CardFooter>
    </MotionCard>
  );
}
