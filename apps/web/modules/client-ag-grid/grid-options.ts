import { themeBalham, themeQuartz, type GridOptions } from 'ag-grid-community';

export const themeBalhamGridOptions: GridOptions = {
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
};

export const themeQuartzGridOptions: GridOptions = {
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
};
