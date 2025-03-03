'use client';

import { AgGridReact } from 'ag-grid-react';

import { ErrorPage } from '../../utility-components';
import type { AgGridWrapperProps } from '../../client-ag-grid/ag-grid-wrapper';
import { useFormComponent } from '../use-form-component';

import {
  AgGridWrapper,
  dataTypeDefinitions,
  defaultColumnTypes,
  themeBalhamGridOptions,
} from '~/modules/client-ag-grid';

interface DatasetTableProps extends Omit<AgGridWrapperProps, 'children'> {
  datasetId: string;
  limit?: number;
}

export const FormComponent = ({
  datasetId,
  limit,
  ...gridProps
}: DatasetTableProps) => {
  const {
    isLoading,
    errorConfiguration,
    errorData,
    formColDefs,
    formDataRecords,
  } = useFormComponent({ datasetId, limit });

  if (errorConfiguration) {
    console.error(errorConfiguration);
    return <ErrorPage message="There was an issue loading the dataset." />;
  }

  if (errorData) {
    console.error(errorData);
    return <ErrorPage message="There was an issue loading the data." />;
  }

  return (
    <div className="flex h-full flex-col">
      {formDataRecords?.flatMap(
        ({ tables, handleFormCellEdit }, outerIndex: number) => (
          <div className="grid h-full min-h-80 grid-cols-[repeat(auto-fit,minmax(350px,1fr))]">
            {tables.map((records, innerIndex: number) => (
              <AgGridWrapper
                {...gridProps}
                key={`${outerIndex}-${innerIndex}`}
                quickFilterEnabled={false}
              >
                <AgGridReact
                  dataTypeDefinitions={dataTypeDefinitions}
                  rowData={records}
                  loading={isLoading}
                  columnDefs={formColDefs}
                  getRowId={row => row.data.role_column_name}
                  onCellValueChanged={handleFormCellEdit}
                  overlayNoRowsTemplate="No records were found"
                  columnTypes={defaultColumnTypes}
                  gridOptions={{ ...themeBalhamGridOptions, headerHeight: 0 }}
                />
              </AgGridWrapper>
            ))}
          </div>
        )
      )}
    </div>
  );
};
