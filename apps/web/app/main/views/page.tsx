'use client';

import { useQuery } from '@supabase-cache-helpers/postgrest-react-query';
import { AgGridReact } from 'ag-grid-react';
import { useRouter } from 'next/navigation';

import { useEnvironment } from '../environment.provider';

import postgrest from '~/lib/database/postgrest';
import { AgGridWrapper, dataTypeDefinitions } from '~/modules/client-ag-grid';
import { TypedRoutes } from '~/lib/routes';

export default function Page() {
  const { environment_schema } = useEnvironment();
  const router = useRouter();
  const { data, isLoading } = useQuery(
    postgrest
      .schema(environment_schema)
      .from('view')
      .select(
        `
        name,
        updated_at
      `
      )
  );

  return (
    <AgGridWrapper title="Views">
      <AgGridReact
        dataTypeDefinitions={dataTypeDefinitions}
        rowData={data}
        loading={isLoading}
        onRowClicked={row => {
          if (row.data)
            router.push(
              TypedRoutes.view({
                viewId: row.data.name!,
              })
            );
        }}
        rowClass="cursor-pointer"
        columnDefs={[
          {
            field: 'name',
            headerName: 'View',
            flex: 1,
            minWidth: 200,
          },
          {
            field: 'updated_at',
            headerName: 'Updated At',
            width: 200,
          },
        ]}
      />
    </AgGridWrapper>
  );
}
