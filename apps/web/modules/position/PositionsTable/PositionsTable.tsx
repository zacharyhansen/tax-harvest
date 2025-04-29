'use client';

import DataTable from '@repo/ui/components/dataTable/dataTable';

import columns from './PositionsTable.ColumnDef';

import { usePortfolioPositionsQuery } from '~/generated/gql';

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
