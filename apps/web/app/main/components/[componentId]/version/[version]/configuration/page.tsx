'use client';

import {
  useUpdateMutation,
  useUpsertMutation,
} from '@supabase-cache-helpers/postgrest-react-query';
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
import { useDataset } from '~/modules/dataset';
import type { DataviewColumnOuput } from '~/modules/dataset/dataset.dto';
import { useEnvironment } from '~/app/main/environment.provider';
import type { TablesConfigurationInsert } from '~/lib/database/helpers';
import { input_type } from '~/lib/constants/enums.dto';
export default function Page() {
  const { environment_schema } = useEnvironment();
  const { dataset } = useDataset();
  const { data, isLoading, error } = trpc.dataset.dataset.useQuery({
    datasetId: dataset.id,
  });

  const columns = data?.dataview?.dataview_column ?? [];

  type TData = DataviewColumnOuput;

  const { mutate: upsertColumn, isPending: isColumnUpserting } =
    useUpsertMutation(
      postgrest.schema(environment_schema).from('dataview_column'),
      ['id'],
      'id',
      {
        onError: error => {
          console.error({ error });
          toast.error('Failed to update the column.');
        },
      }
    );

  const { mutate: updateColumn, isPending: isColumnUpdating } =
    useUpdateMutation(
      postgrest.schema(environment_schema).from('dataview_column'),
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
        updateColumn({
          id: data.id,
          [colDef.field]:
            colDef.field == 'ag_pinned' && newValue === '(none)'
              ? null
              : newValue,
        });
      }
    },
    [updateColumn]
  );

  const columnDefs: ColDef<TData>[] = useMemo(
    () =>
      [
        {
          field: 'role_column_name',
          headerName: 'Column',
          width: 160,
          rowDrag: true,
          pinned: 'left',
        },
        {
          field: 'label',
          width: 160,
          editable: true,
          cellDataType: 'text',
        },
        {
          headerName: 'Editable',
          field: 'ag_editable',
          editable: true,
          width: 80,
        },
        {
          field: 'hidden',
          editable: true,
          width: 80,
        },
        {
          headerName: 'Type',
          field: 'input_type',
          editable: true,
          width: 80,
          options: Object.values(input_type),
          cellEditor: 'agSelectCellEditor',
          cellEditorParams: {
            values: Object.values(input_type),
            formatValue: (value: string) => value,
          },
        },
        {
          headerName: 'Width',
          field: 'ag_width',
          editable: true,
          width: 80,
        },
        {
          headerName: 'Min Width',
          field: 'ag_min_width',
          editable: true,
          width: 80,
        },
        {
          headerName: 'Flex',
          field: 'ag_flex',
          editable: true,
          width: 80,
        },
        {
          headerName: 'Resizable',
          field: 'ag_resizable',
          editable: true,
          width: 80,
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
          width: 80,
        },
        {
          field: 'description',
          minWidth: 200,
          flex: 1,
          cellDataType: 'text',
          editable: true,
        },
      ] as ColDef<TData>[],
    []
  );

  return (
    <AgGridWrapper
      error={error}
      loading={isColumnUpserting || isColumnUpdating}
    >
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
