'use client';

import { AgGridReact } from 'ag-grid-react';

import { ErrorPage, LoadingIcon } from '../../utility-components';
import type { AgGridWrapperProps } from '../../client-ag-grid/ag-grid-wrapper';
import { useTableComponent } from '../use-table-component';

import {
  AgGridWrapper,
  dataTypeDefinitions,
  defaultColumnTypes,
  themeBalhamGridOptions,
} from '~/modules/client-ag-grid';

interface DatasetTableProps extends Omit<AgGridWrapperProps, 'children'> {
  datasetId: string;
}

export const TableComponent = ({
  datasetId,
  ...gridProps
}: DatasetTableProps) => {
  const {
    data,
    isLoading,
    columnDefs,
    errorConfiguration,
    errorData,
    handleCellEdit,
  } = useTableComponent({ datasetId });

  if (isLoading) {
    return <LoadingIcon className="m-auto" />;
  }

  if (errorConfiguration) {
    console.error(errorConfiguration);
    return <ErrorPage message="There was an issue loading the dataset." />;
  }

  if (errorData) {
    console.error(errorData);
    return <ErrorPage message="There was an issue loading the data." />;
  }

  return (
    <AgGridWrapper {...gridProps}>
      <AgGridReact
        dataTypeDefinitions={dataTypeDefinitions}
        rowData={data}
        loading={isLoading}
        columnDefs={columnDefs}
        onCellValueChanged={handleCellEdit}
        overlayNoRowsTemplate={`No records were found`}
        columnTypes={defaultColumnTypes}
        gridOptions={themeBalhamGridOptions}
      />
    </AgGridWrapper>
  );
};
