'use client';

import { LOT_SELECTION } from 'constants/routes';

import { clsx } from 'clsx';
import { motion } from 'framer-motion';
import { Wheat } from 'lucide-react';
import Link from 'next/link';
import { Badge } from 'ui';
import { Format } from 'utilities';
import { HarvestType, usePortfolioSummaryQuery } from 'generated/gql';
import { LoadingPage } from 'modules/utilityComponents';

function BentoCard({
  className = '',
  dark = false,
  description,
  eyebrow,
  fade = [],
  graphic,
  link,
  recommended,
  title,
}: {
  dark?: boolean;
  className?: string;
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  description: React.ReactNode;
  graphic?: React.ReactNode;
  link: string;
  fade?: ('top' | 'bottom')[];
  recommended?: boolean;
}) {
  return (
    <motion.div
      initial="idle"
      whileHover="active"
      variants={{
        active: {
          boxShadow: '0px 15px 30px rgba(0, 0, 0, 0.2)',
          opacity: 1,
          scale: 1.02,
          transition: {
            duration: 0.3,
          },
        },
        idle: {
          opacity: 1,
          scale: 1,
          transition: {
            duration: 0.3,
          },
        },
      }}
      data-dark={dark ? 'true' : undefined}
      className={clsx(
        className,
        'group relative flex cursor-pointer flex-col overflow-hidden rounded-lg',
        'transform-gpu bg-transparent shadow-sm ring-1 ring-black/5 dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#8686f01f_inset]'
      )}
    >
      <Link href={link}>
        <div className="absolute flex w-full items-center justify-center pt-4">
          {recommended ? (
            <Badge className="mx-auto py-2">
              Recommended <Wheat className="ml-2 h-4 w-5" />
            </Badge>
          ) : null}
        </div>

        <div className="relative h-[26rem] shrink-0">
          {graphic}
          {fade.includes('top') && (
            <div className="absolute inset-0 bg-gradient-to-b" />
          )}
          {fade.includes('bottom') && (
            <div className="absolute inset-0 bg-gradient-to-t" />
          )}
        </div>
        <div className="relative isolate z-20 mt-[-110px] h-[14rem] p-10 backdrop-blur-xl">
          <h1 className="flex space-x-2">
            <span>{eyebrow || ''}</span>
          </h1>
          <p className="mt-1 text-2xl/8 font-medium tracking-tight">{title}</p>
          <p className="text-secondary-foreground mt-2 max-w-[600px] text-sm/6">
            {description}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}

export default function HarvestFlowPage() {
  const { data, loading } = usePortfolioSummaryQuery();

  if (loading) {
    return <LoadingPage />;
  }

  if (!data && loading) {
    return <LoadingPage message="Retrieving your portfolio information" />;
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-xl tracking-tight md:text-3xl">
        How should we help you save money?
      </h1>
      <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-16 lg:grid-cols-6 lg:grid-rows-2">
        {data?.portfolioSummary.harvestRecommendations.map(harvest => (
          <BentoCard
            key={harvest.harvestType}
            link={valueMap[harvest.harvestType].link}
            eyebrow={valueMap[harvest.harvestType].eyebrow}
            title={valueMap[harvest.harvestType].title}
            recommended={harvest.recommended}
            description={valueMap[harvest.harvestType].description(
              data?.portfolioSummary?.realized.gainTotal || 0
            )}
            graphic={
              <div
                className="absolute inset-0 bg-center bg-no-repeat object-fill"
                style={{
                  backgroundImage:
                    valueMap[harvest.harvestType].backgroundImage,
                }}
              />
            }
            className="lg:rounded-bl-4xl lg:col-span-2"
          />
        ))}
      </div>
    </div>
  );
}

const valueMap: Record<
  HarvestType,
  {
    eyebrow: string;
    link: string;
    title: string;
    description: (gain: number) => string;
    backgroundImage: string;
  }
> = {
  [HarvestType.CaptureGainsTaxFree]: {
    backgroundImage: "url('/images/gainOrLoss.png')",
    description: () => 'Use your realized losses to capture gains tax free.',
    eyebrow: 'Tax Free',
    link: LOT_SELECTION({ harvestType: HarvestType.CaptureGainsTaxFree }),
    title: 'Utilize Losses to Capture Gains',
  },
  [HarvestType.Sell]: {
    backgroundImage: "url('/images/tokens.png')",
    description: () =>
      'Tell us how much cash you want, and we will tell you the best tax lots to sell.',
    eyebrow: 'Liquidation Event',
    link: LOT_SELECTION({ harvestType: HarvestType.Sell }),
    title: 'Sell Stocks',
  },
  [HarvestType.ReduceCostBasis]: {
    backgroundImage: "url('/images/moneyToPill.png')",
    description: () =>
      'We will slowly reduce your unrealized capital gains tax bill over time.',
    eyebrow: 'Continuous',
    link: LOT_SELECTION({ harvestType: HarvestType.ReduceCostBasis }),
    title: 'Raise Average Cost Basis',
  },
  [HarvestType.ReduceTaxes]: {
    backgroundImage: "url('/images/gainOrLoss.png')",
    description: (gain: number) =>
      `In December, your tax bill will be about ${Format.money(gain * 0.3)}. We will help you lower it.`,
    eyebrow: 'End of Year',
    link: LOT_SELECTION({ harvestType: HarvestType.ReduceTaxes }),
    title: 'Offset Realized Gains',
  },
};
