'use client';

import { useRouter } from 'next/navigation';
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef } from 'ag-grid-community';
import { useMemo } from 'react';

import { NoAccounts, OutstandingAccountSetupList } from '~/modules/account';
import { PageWrapper } from '~/modules/layout';
import { ErrorPage, LoadingPage } from '~/modules/utility-components';
import postgrest from '~/lib/database/postgrest';
import { AgGridWrapper, UserCell } from '~/modules/client-ag-grid';
import { TypedRoutes } from '~/lib/routes';

export default function AccountIndex() {
  const router = useRouter();
  const { data, error, isLoading } = useQuery(
    postgrest.from('Account').select('*')
  );

  const { data: outstandingAccounts, isLoading: outstandingAccountsLoading } =
    useQuery(
      postgrest
        .from('Account')
        .select('*')
        .or('uploadedPositions.eq.false,setRealizedValues.eq.false')
    );

  const columnDefs: ColDef[] = useMemo(() => {
    return [
      { headerName: 'Name', field: 'displayName' },
      {
        headerName: 'Cash For Investment',
        field: 'cashAvailableForInvestment',
      },
      { headerName: 'Account Value', field: 'accountValueTotal' },
      { headerName: 'Type', field: 'type' },
      { headerName: 'Updated At', field: 'updatedAt' },
      { headerName: 'createdBy', field: 'Owner', cellRenderer: UserCell },
    ];
  }, []);

  if (isLoading || outstandingAccountsLoading) {
    return <LoadingPage />;
  }

  if (error) {
    return (
      <ErrorPage message="Could not load accounts at this time. If this issue persists please contact support @support" />
    );
  }

  if (!data?.length) {
    return <NoAccounts />;
  }

  if (outstandingAccounts?.length) {
    return (
      <PageWrapper title="Account Setup Required">
        <OutstandingAccountSetupList />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <AgGridWrapper>
        <AgGridReact
          columnDefs={columnDefs}
          rowData={data}
          rowSelection="single"
          onRowClicked={row => {
            if (row.data) {
              router.push(TypedRoutes.account({ accountId: row.data.id }));
            }
          }}
        />
      </AgGridWrapper>
    </PageWrapper>
  );
}
