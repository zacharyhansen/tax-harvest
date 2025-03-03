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
import { useCallback, useMemo, useState } from 'react';

import { useEnvironment } from '../environment.provider';

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
  const { environment_schema } = useEnvironment();
  const [quickFilter, setQuickFilter] = useState<string>();
  const {
    data: rolesData,
    isLoading: rolesLoading,
    error: rolesError,
  } = useQuery(
    postgrest
      .schema(environment_schema)
      .from('role')
      .select(
        `
        name
        `
      )
      .order('name', { ascending: false })
  );

  const { data, isLoading, error } = useQuery(
    postgrest
      .schema(environment_schema)
      .from('user')
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
              href={TypedRoutes.user({ userId: params.data?.user_id ?? '' })}
            />
          );
        },
      },
      {
        field: 'name',
      },
      {
        field: 'role_name',
        headerName: 'Role',
        editable: true,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {
          values: rolesData?.map(role => role.name),
          formatValue: (value: string | null) => value ?? '(none)',
        },
      },
      {
        field: 'email',
        headerName: 'Name',
      },
      {
        field: 'phone',
      },
      {
        field: 'user_id',
      },
      {
        field: 'created_at',
        cellDataType: 'timeStamp',
      },
      {
        field: 'address',
        editable: true,
      },
      {
        field: 'address_line_2',
        editable: true,
      },
      {
        field: 'city',
        editable: true,
      },
      {
        field: 'county',
        editable: true,
      },
      {
        field: 'date_of_birth',
      },
      {
        field: 'zip',
        editable: true,
      },
      {
        field: 'state',
      },
    ],
    [rolesData]
  );

  const { mutate: upsertUser, isPending: isUserUpserting } = useUpsertMutation(
    postgrest.schema(environment_schema).from('user'),
    ['user_id'],
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

  if (error ?? rolesError) {
    console.error({ error, rolesError });
    return <ErrorPage message="There was an error loading your users." />;
  }

  return (
    <LayoutWrapper>
      <AgGridWrapper
        error={error}
        loading={isUserUpserting}
        setQuickFilter={setQuickFilter}
        quickFilter={quickFilter}
      >
        <AgGridReact<TData>
          dataTypeDefinitions={dataTypeDefinitions}
          rowData={data}
          loading={isLoading || rolesLoading}
          columnDefs={columnDefs}
          quickFilterText={quickFilter}
          rowDragManaged
          onCellValueChanged={handleCellEdit}
        />
      </AgGridWrapper>
    </LayoutWrapper>
  );
}
