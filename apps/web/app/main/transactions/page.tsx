'use client';

import DataTable from '@repo/ui/components/dataTable/dataTable';

import columns from './TransactionsTable.ColumnDef';

import { useTransactionsQuery } from '~/generated/gql';
import { PageWrapper } from '~/modules/layout';
import { LoadingPage, ErrorPage } from '~/modules/utility-components';

export default function AccountIndex() {
  const { data, error, loading } = useTransactionsQuery();

  if (loading) {
    return <LoadingPage />;
  }

  if (error) {
    return (
      <ErrorPage message="Could not load transactions at this time. If this issue persists please contact support" />
    );
  }

  return (
    <PageWrapper>
      <DataTable
        columns={columns}
        data={data?.transactions}
        noResultsAlert="No transactions were found for the search criteria"
      />
    </PageWrapper>
  );
}
