'use client';

import { useQuery } from '@supabase-cache-helpers/postgrest-react-query';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef, ICellRendererParams } from 'ag-grid-community';
import { useMemo } from 'react';

import {
  AgGridWrapper,
  dataTypeDefinitions,
  FilterType,
  LinkCell,
  TaskPriorityCell,
  TaskStatusCell,
  UserCell,
} from '~/modules/client-ag-grid';
import postgrest from '~/lib/database/postgrest';
import type { TablesFoundation } from '~/lib/database/helpers';
import { useEnvironment } from '~/app/main/environment.provider';
import { TypedRoutes } from '~/lib/routes';

export default function TaskTable() {
  const { environment_schema } = useEnvironment();
  const { data, isLoading, error } = useQuery(
    postgrest
      .schema(environment_schema)
      .from('task')
      .select(
        `
        id,
        task_status(
          id,
          label
        ),
        title,
        task_priority(
          id,
          label
        ),
        created_at,
        updated_at,
        assignee:user!task_assignee_id_fkey(
          user_id,
          name,
          email
        ),
        creator:user!task_created_by_id_fkey(
          user_id,
          name,
          email
        )
        `
      )
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
              href={TypedRoutes.task({
                taskId: params.data?.id ?? '',
              })}
            />
          );
        },
      },
      {
        cellRenderer: TaskPriorityCell,
        cellRendererParams: {
          format: 'full',
        },
        comparator: (
          a: TablesFoundation<'task_priority'>,
          b: TablesFoundation<'task_priority'>
        ) =>
          ((a.id as unknown as number) || 0) -
          ((b.id as unknown as number) || 0),
        field: 'task_priority',
        filter: true,
        filterValueGetter: params => {
          // see https://github.com/supabase/postgrest-js/issues/546
          return (
            params.data
              ?.task_priority as unknown as TablesFoundation<'task_priority'>
          ).label;
        },
        headerName: 'Priority',
        width: 130,
      },
      {
        cellRenderer: TaskStatusCell,
        comparator: (
          a: TablesFoundation<'task_status'>,
          b: TablesFoundation<'task_status'>
        ) =>
          ((a.id as unknown as number) || 0) -
          ((b.id as unknown as number) || 0),
        field: 'task_status',
        headerName: 'Status',
        width: 130,
        filter: true,
        filterValueGetter: params => {
          // see https://github.com/supabase/postgrest-js/issues/546
          return (
            params.data
              ?.task_status as unknown as TablesFoundation<'task_status'>
          ).label;
        },
      },
      { field: 'title', flex: 1, minWidth: 130 },
      {
        cellRenderer: UserCell,
        comparator: (
          a: TablesFoundation<'user'>,
          b: TablesFoundation<'user'>
        ) =>
          ((a.name as unknown as string) || '') >
          ((b.name as unknown as string) || '')
            ? 1
            : -1,
        field: 'assignee',
        headerName: 'Assignee',
      },
      {
        cellDataType: 'timeStamp',
        field: 'updated_at',
        headerName: 'Updated',
        width: 120,
      },
      {
        cellDataType: 'date',
        field: 'created_at',
        headerName: 'Created',
        width: 120,
      },
      {
        cellRenderer: UserCell,
        comparator: (
          a: TablesFoundation<'user'>,
          b: TablesFoundation<'user'>
        ) =>
          ((a.name as unknown as string) || '') >
          ((b.name as unknown as string) || '')
            ? 1
            : -1,
        field: 'creator',
        headerName: 'Creator',
      },
    ],
    []
  );

  return (
    <AgGridWrapper error={error}>
      <AgGridReact
        dataTypeDefinitions={dataTypeDefinitions}
        rowData={data}
        loading={isLoading}
        onGridReady={params => {
          params.api.setFilterModel({
            task_statuds: {
              filterType: 'text',
              type: FilterType.notEqual,
              filter: 'done',
            },
          });
        }}
        columnDefs={columnDefs}
      />
    </AgGridWrapper>
  );
}
