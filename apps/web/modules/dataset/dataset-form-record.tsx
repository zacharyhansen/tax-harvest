import { AgGridReact } from 'ag-grid-react';
import { useMemo } from 'react';
import type { ColDef } from 'ag-grid-community';

import {
  AgGridWrapper,
  dataTypeDefinitions,
  defaultColumnTypes,
  themeBalhamGridOptions,
} from '../client-ag-grid';
import type { AgGridWrapperProps } from '../client-ag-grid/ag-grid-wrapper';

import type { input_type } from '~/lib/constants/enums.dto';

export interface FormField {
  label?: string | null;
  description?: string | null;
  input_type: input_type;
  ag_editable: boolean;
}

interface DatasetFormRecordProps extends Omit<AgGridWrapperProps, 'children'> {
  record: Record<string, unknown>;
}

export const DatasetFormRecord = ({
  record,
  ...gridProps
}: DatasetFormRecordProps) => {
  const columnDefs: ColDef[] = useMemo(() => {
    return [
      {
        headerName: 'Label',
        field: 'label',
        cellClass: 'font-semibold',
      },
      {
        headerName: 'Value',
        field: 'value',
        flex: 1,
        editable: true,
      },
    ] satisfies ColDef[];
  }, []);

  return (
    <AgGridWrapper {...gridProps}>
      <AgGridReact
        dataTypeDefinitions={dataTypeDefinitions}
        rowData={Object.entries(record).map(([key, value]) => ({
          label: key,
          value,
        }))}
        // loading={isLoading}
        columnDefs={columnDefs}
        // onCellValueChanged={handleCellEdit}
        overlayNoRowsTemplate={`No records were found`}
        columnTypes={defaultColumnTypes}
        gridOptions={themeBalhamGridOptions}
      />
    </AgGridWrapper>
  );
};
