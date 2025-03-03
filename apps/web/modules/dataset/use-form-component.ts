import { toast } from '@repo/ui/components/toast-sonner';
import type {
  CellValueChangedEvent,
  ColDef,
  EditableCallbackParams,
  ICellEditorParams,
  ICellRendererParams,
} from 'ag-grid-community';
import { useCallback, useMemo } from 'react';

import { cellEditorSelector } from '../client-ag-grid/cell-editor-selector';
import { cellRendererSelector } from '../client-ag-grid/cell-renderer-selector';

import { useDatasetQuery } from './use-dataset-query';
import type { TColumn } from './use-table-component';

import type { TablesConfiguration } from '~/lib/database/helpers';

type TFormRowRecord = TablesConfiguration<'dataview_column'> & {
  label: string;
  value: unknown;
};

export const useFormComponent = ({
  datasetId,
  limit,
}: {
  datasetId: string;
  limit?: number;
}) => {
  const {
    data,
    errorData,
    errorConfiguration,
    isLoading,
    refetch,
    dataset,
    entityPrimaryKeys,
    updateRecord,
  } = useDatasetQuery({
    datasetId,
    limit,
  });

  const formColDefs: ColDef[] = useMemo(() => {
    return [
      {
        field: 'label',
        cellClass: 'font-bold text-muted-foreground',
      },
      {
        field: 'value',
        flex: 1,
        editable: (params: EditableCallbackParams<TFormRowRecord>) => {
          return !!params.data?.ag_editable;
        },
        cellEditorSelector: (params: ICellEditorParams<TFormRowRecord>) =>
          cellEditorSelector[params.data.input_type],
        cellRendererSelector: (params: ICellRendererParams<TFormRowRecord>) => {
          const inputType = params.data?.input_type;
          if (inputType) {
            return cellRendererSelector[inputType];
          }
          return undefined;
        },
      },
    ] satisfies ColDef[];
  }, []);

  const handleFormRecordEdit = useCallback(
    (mergedColumns: TFormRowRecord[]) => {
      return ({ newValue, data }: CellValueChangedEvent<TFormRowRecord>) => {
        const primaryKeyColumns = mergedColumns.filter(column =>
          entityPrimaryKeys?.includes(column.role_column_name)
        );
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (data.role_column_name) {
          // Add the value
          const updateObject = {
            [data.role_column_name]: newValue,
          };
          // Add the primary keys
          for (const column of primaryKeyColumns) {
            updateObject[column.role_column_name] = column.value;
          }
          // Update the record
          updateRecord(updateObject);
        }
      };
    },
    [updateRecord, entityPrimaryKeys]
  );

  const formDataRecords = useMemo(() => {
    const numGroups = 2;

    const columnAttributeMap = dataset?.dataview?.dataview_column.reduce(
      (acc, column) => {
        acc[column.role_column_name!] = column as TColumn;
        return acc;
      },
      {} as Record<string, TColumn>
    );
    // Helper function to chunk an array into equal groups
    const chunkArray = <T>(arr: T[], chunks: number): T[][] => {
      const chunkSize = Math.ceil(arr.length / chunks);
      const result: T[][] = [];
      for (let i = 0; i < arr.length; i += chunkSize) {
        result.push(arr.slice(i, i + chunkSize));
      }
      return result;
    };

    if (data?.length && data.length > 5) {
      console.error(
        'Received many records for a form component. The component likely needs a link filter. Results are being trimmed to the first 3 records.'
      );
      toast.message('Form misconfiguration', {
        description:
          'Received many records for a form component. The component likely needs a link filter. Results are being trimmed to the first 3 records.',
      });
    }

    // Map each record into an array of objects and then chunk it
    return data?.slice(0, 3).map(record => {
      // Create an array of objects based on record entries
      const recordArray: TFormRowRecord[] = Object.entries(record).map(
        ([key, value]) => ({
          ...((columnAttributeMap?.[key] ?? {}) as TColumn),
          label: key,
          value,
        })
      );

      const handleFormCellEdit = handleFormRecordEdit(recordArray);
      // Split recordArray into numGroups equally sized groups
      return { tables: chunkArray(recordArray, numGroups), handleFormCellEdit };
    });
  }, [data, dataset, handleFormRecordEdit]);

  return {
    formColDefs,
    formDataRecords,
    errorData,
    errorConfiguration,
    isLoading,
    refetch,
  };
};
