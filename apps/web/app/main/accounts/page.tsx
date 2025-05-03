'use client';

import type { ColDef } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

import { useAccountsQuery } from '~/generated/gql';
import { TypedRoutes } from '~/lib/routes';
import { NoAccounts } from '~/modules/account';
import { PageWrapper } from '~/modules/layout';
import { ErrorPage, LoadingPage } from '~/modules/utility-components';

const AgGridWrapper = dynamic(
  () => import('~/modules/client-ag-grid/ag-grid-wrapper'),
  {
    ssr: false,
  },
);

export default function AccountPage() {
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
          onRowClicked={(row) => {
            if (row.data) {
              router.push(TypedRoutes.account({ id: row.data.id }));
            }
          }}
        />
      </AgGridWrapper>
    </PageWrapper>
  );
}
