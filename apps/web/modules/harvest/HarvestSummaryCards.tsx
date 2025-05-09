import { Badge } from '@repo/ui/components/badge';
import DataCard from '@repo/ui/components/dataCard';
import { cn } from '@repo/ui/utils';
import { TrendingDown, TrendingUp, Wheat } from 'lucide-react';

import { usePortfolioSummaryQuery } from '~/generated/gql';
import { LoadingPage } from '~/modules/utility-components';
import { Format, MoneyUtil } from '~/modules/utils';

export default function HarvestSummaryCards() {
  const { data, loading } = usePortfolioSummaryQuery();

  if (!data && loading) {
    return <LoadingPage message="Retrieving your portfolio information" />;
  }

  return (
    <div className="mb-8 flex flex-col gap-2 md:flex-row">
      <DataCard
        loading={loading}
        data={(
          <p
            className={cn({
              'text-green-600':
                MoneyUtil.amountDirection(
                  data?.portfolioSummary.harvest.total,
                ) === 'positive',
            })}
          >
            {Format.money(data?.portfolioSummary.harvest.total)}
          </p>
        )}
        title="The Harvest"
        icon={<Wheat className="text-primary" />}
        description="The total dollar amount that can be harvested across accounts in this portfolio."
      />
      <DataCard
        loading={loading}
        data={(
          <p
            className={cn({
              'text-green-600':
                MoneyUtil.amountDirection(
                  data?.portfolioSummary.realized.gainTotal,
                ) === 'positive',
              'text-red-600':
                MoneyUtil.amountDirection(
                  data?.portfolioSummary.realized.gainTotal,
                ) === 'negative',
            })}
          >
            {Format.money(data?.portfolioSummary.realized.gainTotal)}
          </p>
        )}
        title="Calender Year P & L"
        icon={
          MoneyUtil.amountDirection(
            data?.portfolioSummary.realized.gainTotal,
          ) !== 'negative'
            ? (
                <TrendingUp className="text-green-600" />
              )
            : (
                <TrendingDown className="text-red-600" />
              )
        }
        description="Year to date realized profit"
      >
        <Badge variant="secondary" className="mt-4 flex w-full justify-center">
          <p>REALIZED</p>
        </Badge>
      </DataCard>
      <DataCard
        loading={loading}
        data={(
          <p
            className={cn({
              'text-green-600':
                MoneyUtil.amountDirection(
                  data?.portfolioSummary.unrealized.gainTotal,
                ) === 'positive',
            })}
          >
            {Format.money(data?.portfolioSummary.unrealized.gainTotal)}
          </p>
        )}
        title="The Gains"
        icon={<TrendingUp className="text-green-600" />}
        description="Total gains across the portfolio"
      >
        <Badge variant="secondary" className="mt-4 flex w-full justify-center">
          <p>UNREALIZED</p>
        </Badge>
      </DataCard>
      <DataCard
        loading={loading}
        data={(
          <p
            className={cn({
              'text-red-600':
                MoneyUtil.amountDirection(
                  data?.portfolioSummary.unrealized.lossTotal,
                ) === 'negative',
            })}
          >
            {Format.money(data?.portfolioSummary.unrealized.lossTotal)}
          </p>
        )}
        title="The Losses"
        icon={<TrendingDown className="text-red-600" />}
        description="Total losses across the porfolio"
      >
        <Badge variant="secondary" className="mt-4 flex w-full justify-center">
          <p>UNREALIZED</p>
        </Badge>
      </DataCard>
    </div>
  );
}
