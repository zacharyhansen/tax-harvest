'use client';

import { toast } from '@repo/ui/components/toast-sonner';
import {
  useQuery,
  useUpsertMutation,
} from '@supabase-cache-helpers/postgrest-react-query';
import {
  type CellValueChangedEvent,
  type ColDef,
  type ICellRendererParams,
} from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { useCallback, useMemo } from 'react';

import { TypedRoutes } from '~/lib/routes';
import postgrest from '~/lib/database/postgrest';
import {
  AgGridWrapper,
  dataTypeDefinitions,
  LinkCell,
} from '~/modules/client-ag-grid';
import { LayoutWrapper } from '~/modules/layout';
import { ErrorPage } from '~/modules/utility-components';

export default function Users() {
  const { data, isLoading, error } = useQuery(
    postgrest
      .from('User')
      .select(
        `
        *
        `
      )
      .order('name')
  );
  type TData = NonNullable<typeof data>[number];

  const columnDefs: ColDef<TData>[] = useMemo(
    () => [
      {
        pinned: 'left',
        width: 20,
        resizable: false,
        cellRenderer: (params: ICellRendererParams<TData>) => {
          return (
            <LinkCell
              href={TypedRoutes.user({ userId: params.data?.id ?? '' })}
            />
          );
        },
      },
      {
        field: 'name',
      },
      {
        field: 'email',
        headerName: 'Name',
      },
      {
        field: 'phoneNumber',
      },
      {
        field: 'createdAt',
        cellDataType: 'timeStamp',
      },
    ],
    []
  );

  const { mutate: upsertUser, isPending: isUserUpserting } = useUpsertMutation(
    postgrest.from('User'),
    ['id'],
    null,
    {
      onError: error => {
        console.error({ error });
        toast.error('Failed to update the user.');
      },
    }
  );

  const handleCellEdit = useCallback(
    ({ newValue, data, colDef }: CellValueChangedEvent<TData>) => {
      if (colDef.field) {
        upsertUser([
          {
            ...data,
            [colDef.field]: newValue,
          },
        ]);
      }
    },
    [upsertUser]
  );

  if (error) {
    console.error({ error });
    return <ErrorPage message="There was an error loading your users." />;
  }

  return (
    <LayoutWrapper>
      <AgGridWrapper error={error} loading={isUserUpserting}>
        <AgGridReact<TData>
          dataTypeDefinitions={dataTypeDefinitions}
          rowData={data}
          loading={isLoading}
          columnDefs={columnDefs}
          rowDragManaged
          onCellValueChanged={handleCellEdit}
        />
      </AgGridWrapper>
    </LayoutWrapper>
  );
}
