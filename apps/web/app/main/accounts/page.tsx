'use client';

import { useRouter } from 'next/navigation';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef } from 'ag-grid-community';
import { useMemo } from 'react';

import { NoAccounts } from '~/modules/account';
import { PageWrapper } from '~/modules/layout';
import { ErrorPage, LoadingPage } from '~/modules/utility-components';
import { AgGridWrapper } from '~/modules/client-ag-grid';
import { TypedRoutes } from '~/lib/routes';
import { useAccountsQuery } from '~/generated/gql';

export default function AccountIndex() {
  const router = useRouter();
  const { data, error, loading } = useAccountsQuery();

  const columnDefs: ColDef[] = useMemo(() => {
    return [
      {
        headerName: 'Name',
        field: 'name',
        flex: 1,
      },
      {
        headerName: 'Cash For Investment',
        field: 'cashAvailableForInvestment',
        cellDataType: 'usd',
      },
      {
        headerName: 'Account Value',
        field: 'accountValueTotal',
        cellDataType: 'usd',
      },
      { headerName: 'Type', field: 'type' },
      { headerName: 'Updated At', field: 'updatedAt', cellDataType: 'date' },
      // { headerName: 'Owner', field: 'createdBy', cellRenderer: UserCell },
    ] satisfies ColDef[];
  }, []);

  if (loading) {
    return <LoadingPage />;
  }

  if (error) {
    return (
      <ErrorPage message="Could not load accounts at this time. If this issue persists please contact support" />
    );
  }

  if (!data?.accounts.length) {
    return <NoAccounts />;
  }

  return (
    <PageWrapper>
      <AgGridWrapper>
        <AgGridReact
          columnDefs={columnDefs}
          rowData={data.accounts}
          onRowClicked={row => {
            if (row.data) {
              router.push(TypedRoutes.account({ id: row.data.id }));
            }
          }}
        />
      </AgGridWrapper>
    </PageWrapper>
  );
}
