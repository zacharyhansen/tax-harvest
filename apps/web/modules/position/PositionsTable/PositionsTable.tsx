'use client';

import { DataTable } from 'ui';
import { usePortfolioPositionsQuery } from 'generated/gql';

import columns from './PositionsTable.ColumnDef';

export default function PositionsTable() {
  const { data, error, loading } = usePortfolioPositionsQuery();

  return (
    <DataTable
      columns={columns}
      data={data?.portfolioPositions}
      noResultsAlert={'This portfolio has no positions.'}
      loading={loading}
      error={!!error}
    />
  );
}
