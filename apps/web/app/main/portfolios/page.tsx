'use client';

import PageWrapper from '~/modules/layout/page-wrapper';

import { usePortfolio } from '~/modules/portfolio';
import PortfolioPage from './[id]/page';

export default function PortfolioIndex() {
  const { portfolio } = usePortfolio();

  return (
    <PageWrapper>
      <PortfolioPage params={{ id: portfolio.id }} />
    </PageWrapper>
  );
}
