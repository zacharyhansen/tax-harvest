import type { AgGridReactProps } from 'ag-grid-react'

import { DateFormatter } from '../utils/DateFormatter'

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
  usd: {
    baseDataType: 'number',
    extendsDataType: 'number',
    valueFormatter: ({ value }) =>
      value
        ? new Intl.NumberFormat('en-US', {
            currency: 'USD',
            style: 'currency',
          }).format(Number.parseFloat(value.toString()))
        : '',
    columnTypes: ['edit'],
  },

  timeStamp: {
    baseDataType: 'dateString',
    extendsDataType: 'dateString',
    valueFormatter: params =>
      params.value !== undefined && params.value !== null
        ? DateFormatter.timestamp(params.value.toString())
        : '',
    columnTypes: ['edit'],
  },
  date: {
    baseDataType: 'dateString',
    extendsDataType: 'dateString',
    valueFormatter: params =>
      params.value !== undefined && params.value !== null
        ? DateFormatter.shortDay(params.value.toString())
        : '',
    columnTypes: ['edit'],
  },
} satisfies AgGridReactProps['dataTypeDefinitions']
