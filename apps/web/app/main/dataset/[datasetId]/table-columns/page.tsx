'use client';

import { useUpsertMutation } from '@supabase-cache-helpers/postgrest-react-query';
import { AgGridReact } from 'ag-grid-react';
import type { CellValueChangedEvent, ColDef } from 'ag-grid-community';
import { toast } from '@repo/ui/components/toast-sonner';
import { useCallback, useMemo } from 'react';

import postgrest from '~/lib/database/postgrest';
import {
  AgGridWrapper,
  dataTypeDefinitions,
  defaultColumnTypes,
  themeBalhamGridOptions,
} from '~/modules/client-ag-grid';
import type { Database } from '~/lib/database/database.types';
import { trpc } from '~/lib/trpc';
import type { DataviewColumnOuput } from '~/modules/dataset/dataset.dto';
import type { TypedRoutes } from '~/lib/routes';
import type { TablesConfigurationInsert } from '~/lib/database/helpers';

interface TableColumnsProps {
  params: typeof TypedRoutes.dataset.params;
}

export default function Page({ params }: Readonly<TableColumnsProps>) {
  const { data, isLoading, error } = trpc.dataset.dataset.useQuery({
    datasetId: params.datasetId,
  });

  const columns = data?.dataview?.dataview_column ?? [];

  type TData = DataviewColumnOuput;

  const { mutate: upsertColumn, isPending: isColumnUpserting } =
    useUpsertMutation(
      postgrest.schema('foundation').from('dataview_column'),
      ['id'],
      'id',
      {
        onError: error => {
          console.error({ error });
          toast.error('Failed to update the column.');
        },
      }
    );

  const handleCellEdit = useCallback(
    ({ newValue, data, colDef }: CellValueChangedEvent<TData>) => {
      if (colDef.field) {
        const newColumn = {
          ...data,
          [colDef.field]:
            colDef.field == 'ag_pinned' && newValue === '(none)'
              ? null
              : newValue,
        };
        // @ts-expect-error need to delete this
        delete newColumn.child_dataview;
        upsertColumn([newColumn]);
      }
    },
    [upsertColumn]
  );

  const columnDefs: ColDef<TData>[] = useMemo(
    () => [
      {
        field: 'role_column_name',
        headerName: 'Column',
        width: 200,
        rowDrag: true,
        pinned: 'left',
      },
      {
        field: 'label',
        width: 200,
        editable: true,
        cellDataType: 'text',
      },
      {
        headerName: 'Editable',
        field: 'ag_editable',
        editable: true,
      },
      {
        field: 'hidden',
        editable: true,
      },
      {
        headerName: 'Type',
        field: 'input_type',
        editable: true,
      },
      {
        headerName: 'Width',
        field: 'ag_width',
        editable: true,
      },
      {
        headerName: 'Min Width',
        field: 'ag_min_width',
        editable: true,
      },
      {
        headerName: 'Flex',
        field: 'ag_flex',
        editable: true,
      },
      {
        headerName: 'Resizable',
        field: 'ag_resizable',
        editable: true,
      },
      {
        field: 'ag_pinned',
        headerName: 'Pinned',
        editable: true,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {
          values: ['left', 'right', '(none)'],
          formatValue: (value: string | null) => value ?? '(none)',
        },
      },
      {
        field: 'description',
        minWidth: 200,
        flex: 1,
        cellDataType: 'text',
        editable: true,
      },
    ],
    []
  );

  return (
    <AgGridWrapper error={error} loading={isColumnUpserting}>
      <AgGridReact<TData>
        dataTypeDefinitions={dataTypeDefinitions}
        rowData={columns}
        loading={isLoading}
        onCellValueChanged={handleCellEdit}
        columnDefs={columnDefs}
        rowDragManaged
        getRowId={row => row.data.id}
        columnTypes={defaultColumnTypes}
        gridOptions={themeBalhamGridOptions}
        onRowDragEnd={event => {
          const upserts: Database['foundation']['Views']['dataview_column']['Insert'][] =
            [];
          event.api.forEachLeafNode(node => {
            if (node.data) {
              const newColumn = {
                ...node.data,
                order: node.rowIndex ?? undefined,
              } satisfies TablesConfigurationInsert<'dataview_column'>;
              // @ts-expect-error need to delete this
              delete newColumn.child_dataview;
              upserts.push(newColumn);
            }
          });
          upsertColumn(upserts);
        }}
      />
    </AgGridWrapper>
  );
}
