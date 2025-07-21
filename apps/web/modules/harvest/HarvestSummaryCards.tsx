import { Badge } from '@repo/ui/components/badge';
import DataCard from '@repo/ui/components/dataCard';
import { TrendingDown, TrendingUp, Wheat } from 'lucide-react';

import { usePortfolioSummaryQuery } from '~/generated/gql';
import { LoadingPage } from '~/modules/utility-components';
import { Format, MoneyUtil } from '~/modules/utils';

/**
 * Displays portfolio summary cards showing harvest potential, realized P&L, gains and losses
 * @returns Portfolio summary cards component
 */
export default function HarvestSummaryCards() {
  const { data, loading } = usePortfolioSummaryQuery();

  if (!data && loading) {
    return <LoadingPage message="Retrieving your portfolio information" />;
  }

  const getAmountColor = (amount: number | undefined) => {
    const direction = MoneyUtil.amountDirection(amount);
    return direction === 'positive'
      ? 'text-green-600'
      : direction === 'negative'
        ? 'text-red-600'
        : '';
  };

  const realizedDirection = MoneyUtil.amountDirection(
    data?.portfolioSummary.realized.gainTotal
  );

  return (
    <div className="mb-4 grid grid-cols-1 gap-2 md:grid-cols-4">
      <DataCard
        loading={loading}
        data={
          <p className={getAmountColor(data?.portfolioSummary.harvest.total)}>
            {Format.money(data?.portfolioSummary.harvest.total)}
          </p>
        }
        title="The Harvest"
        icon={<Wheat className="text-primary" />}
        description="Total harvestable amount"
      />

      <DataCard
        loading={loading}
        data={
          <p
            className={getAmountColor(
              data?.portfolioSummary.realized.gainTotal
            )}
          >
            {Format.money(data?.portfolioSummary.realized.gainTotal)}
          </p>
        }
        title="Calendar Year P&L"
        icon={
          realizedDirection !== 'negative' ? (
            <TrendingUp className="text-green-600" />
          ) : (
            <TrendingDown className="text-red-600" />
          )
        }
        description="Realized profit / loss"
      ></DataCard>

      <DataCard
        loading={loading}
        data={
          <p
            className={getAmountColor(
              data?.portfolioSummary.unrealized.gainTotal
            )}
          >
            {Format.money(data?.portfolioSummary.unrealized.gainTotal)}
          </p>
        }
        title="Unrealized Gains"
        icon={<TrendingUp className="text-green-600" />}
        description="Total unrealized gains"
      ></DataCard>

      <DataCard
        loading={loading}
        data={
          <p
            className={getAmountColor(
              data?.portfolioSummary.unrealized.lossTotal
            )}
          >
            {Format.money(data?.portfolioSummary.unrealized.lossTotal)}
          </p>
        }
        title="Unrealized Losses"
        icon={<TrendingDown className="text-red-600" />}
        description="Total unrealized losses"
      ></DataCard>
    </div>
  );
}
