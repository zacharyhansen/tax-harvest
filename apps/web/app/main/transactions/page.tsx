'use client';

import { DataTable } from 'ui';
import { useTransactionsQuery } from 'generated/gql';
import { AlertError } from 'modules/alerts';
import PageWrapper from 'modules/page/page-wrapper';
import { LoadingPage } from 'modules/utilityComponents';

import columns from './TransactionsTable.ColumnDef';

export default function AccountIndex() {
  const { data, error, loading } = useTransactionsQuery();

  if (loading) {
    return <LoadingPage />;
  }

  if (error) {
    return (
      <div>
        <AlertError>
          Could not load accounts at this time. If this issue persists please
          contact support @support
        </AlertError>
      </div>
    );
  }

  return (
    <PageWrapper title="Transactions">
      <DataTable
        columns={columns}
        data={data?.transactions}
        noResultsAlert="No accounts were found for the search criteria"
      />
    </PageWrapper>
  );
}
