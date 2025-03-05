'use client';

import PortfolioPage from './[id]/page';

import { usePortfolio } from '~/modules/portfolio';
import PageWrapper from '~/modules/layout/page-wrapper';

export default function PortfolioIndex() {
  const { portfolio } = usePortfolio();

  return (
    <PageWrapper>
      <PortfolioPage params={{ id: portfolio.id }} />
    </PageWrapper>
  );
}
