import type { AgGridReactProps } from 'ag-grid-react';

// import { inputTypeStringFormatter } from './cell-renderer-selector';

export const dataTypeDefinitions = {
  text: {
    baseDataType: 'text',
    extendsDataType: 'text',
    columnTypes: ['edit'],
  },
  percentage_rounded: {
    baseDataType: 'number',
    extendsDataType: 'number',
    valueFormatter: params =>
      params.value == null ? '' : `${Math.round(params.value * 100)}%`,
    columnTypes: ['edit'],
  },
  number: {
    baseDataType: 'number',
    extendsDataType: 'number',
    columnTypes: ['edit'],
  },
  // percentage: {
  //   baseDataType: 'number',
  //   extendsDataType: 'number',
  //   valueFormatter: params => inputTypeStringFormatter.percentage(params.value),
  //   columnTypes: ['edit'],
  // },
  // usd: {
  //   baseDataType: 'number',
  //   extendsDataType: 'number',
  //   valueFormatter: ({ value }) => inputTypeStringFormatter.usd(value),
  //   columnTypes: ['edit'],
  // },
  // timeStamp: {
  //   baseDataType: 'dateString',
  //   extendsDataType: 'dateString',
  //   valueFormatter: params => inputTypeStringFormatter.timestamp(params.value),
  //   columnTypes: ['edit'],
  // },
  // date: {
  //   baseDataType: 'dateString',
  //   extendsDataType: 'dateString',
  //   valueFormatter: params => inputTypeStringFormatter.date(params.value),
  //   columnTypes: ['edit'],
  // },
} satisfies AgGridReactProps['dataTypeDefinitions'];
