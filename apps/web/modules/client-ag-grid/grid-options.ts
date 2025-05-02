import { themeBalham, themeQuartz, type GridOptions } from 'ag-grid-community';

import { dataTypeDefinitions } from './data-type-definitions';
import { defaultColumnTypes } from './column-types';
import { cellRendererSelector } from './cell-renderer-selector';

const baseGridOptions: GridOptions = {
  dataTypeDefinitions,
  columnTypes: defaultColumnTypes,
  // components: {
  //   cellRendererSelector,
  // },
  defaultColDef: {
    resizable: true,
    minWidth: 120,
    // wrapHeaderText: true,
    sortable: true,
    filter: true,
    cellRendererSelector,
    //pagination: true,
  },
};

export const themeBalhamGridOptions: GridOptions = {
  ...baseGridOptions,
  theme: themeBalham
    .withParams(
      {
        backgroundColor: '#ffffff',
        accentColor: '#020817',
      },
      'light'
    )
    .withParams(
      {
        backgroundColor: '#16161d',
        accentColor: '#aab1d3',
      },
      'dark'
    ),
  headerHeight: 32,
};

export const themeQuartzGridOptions: GridOptions = {
  ...baseGridOptions,
  theme: themeQuartz
    .withParams(
      {
        backgroundColor: '#ffffff',
        accentColor: '#020817',
      },
      'light'
    )
    .withParams(
      {
        backgroundColor: '#16161d',
        accentColor: '#aab1d3',
      },
      'dark'
    ),
  headerHeight: 40,
};
