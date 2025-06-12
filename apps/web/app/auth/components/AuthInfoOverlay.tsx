'use client';

import { motion } from 'framer-motion';
import { BarChart2, CircleDollarSign, Shield } from 'lucide-react';

const features = [
  {
    icon: BarChart2,
    title: 'Smart Portfolio Analysis',
    description:
      'Our AI algorithm analyzes your holdings to find the optimal tax lots to sell.',
  },
  {
    icon: Shield,
    title: 'Wash Sale Protection',
    description:
      'Avoid IRS restrictions with built-in wash sale detection and alerts.',
  },
  {
    icon: CircleDollarSign,
    title: 'Tax-Optimized Suggestions',
    description:
      'Get replacement security suggestions to maintain portfolio balance.',
  },
];

export function AuthInfoOverlay() {
  return (
    <div className="absolute inset-0 z-20 flex flex-col items-start justify-center rounded-3xl bg-black/10 p-12 text-white">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-6 text-2xl font-bold sm:text-3xl"
      >
        AI Powered Tax Loss Harvesting & Financial Tooling
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mb-8 max-w-md text-base text-white/80 sm:text-lg"
      >
        Maximize tax efficiency with our automated platform that identifies
        optimal tax harvesting opportunities in your investment portfolio.
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="max-w-md space-y-6"
      >
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
            className="flex items-start gap-4"
          >
            <div className="bg-primary rounded-full p-2">
              <feature.icon className="size-5 text-black" />
            </div>
            <div>
              <h3 className="mb-1 font-semibold">{feature.title}</h3>
              <p className="text-sm text-white/80">{feature.description}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
