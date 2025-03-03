import type {
  CellValueChangedEvent,
  ColDef,
  ColGroupDef,
} from 'ag-grid-community';
import { useCallback, useMemo } from 'react';
import { capitalCase } from 'change-case';

import { useDatasetQuery } from './use-dataset-query';

import type {
  TablesConfiguration,
  TablesFoundation,
} from '~/lib/database/helpers';

export type TColumn = TablesConfiguration<'dataview_column'> & {
  dataview?: TablesFoundation<'dataview'>;
};

export const useTableComponent = ({
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

  const columnDefs: ColDef[] = useMemo(() => {
    const groupedColumns: (ColDef | ColGroupDef)[] = [];
    const groupMap = new Map<string, ColGroupDef>();

    dataset?.dataview?.dataview_column.forEach(column => {
      if (column.header_group) {
        if (!groupMap.has(column.header_group)) {
          // Create a new group
          const group: ColGroupDef = {
            headerName: column.header_group,
            children: [dataviewColumnToColDef(column as TColumn)],
          };
          groupedColumns.push(group);
          groupMap.set(column.header_group, group);
        } else {
          // Add to existing group
          groupMap
            .get(column.header_group)!
            .children.push(dataviewColumnToColDef(column as TColumn));
        }
      } else {
        // Columns without a header_name are standalone
        groupedColumns.push(dataviewColumnToColDef(column as TColumn));
      }
    });
    return groupedColumns;
  }, [dataset]);

  const handleCellEdit = useCallback(
    ({ newValue, data, colDef }: CellValueChangedEvent<object>) => {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (colDef.field) {
        // Add the value
        const updateObject = {
          [colDef.field]: newValue,
        };

        // Add the primary keys
        for (const column of entityPrimaryKeys!) {
          // @ts-expect-error cant type this
          updateObject[column] = data[column];
        }
        // Update the record
        updateRecord(updateObject);
      }
    },
    [updateRecord, entityPrimaryKeys]
  );

  return {
    columnDefs,
    handleCellEdit,
    data,
    errorData,
    errorConfiguration,
    isLoading,
    refetch,
  };
};

const dataviewColumnToColDef = ({
  input_type,
  ag_flex,
  ag_min_width,
  ag_pinned,
  ag_editable,
  ag_resizable,
  ag_width,
  label,
  role_column_name,
  description,
  dataview,
}: TablesConfiguration<'dataview_column'> & {
  dataview?: TablesFoundation<'dataview'>;
}): ColDef => {
  return {
    width: ag_width,
    minWidth: ag_min_width,
    cellDataType: input_type,
    flex: ag_flex ?? undefined,
    pinned: ag_pinned,
    editable: ag_editable,
    resizable: ag_resizable,
    headerName: capitalCase(label ?? role_column_name),
    headerTooltip: description ?? undefined,
    field: dataview?.role_view_name
      ? dataview.role_view_name
      : role_column_name,
  };
};
