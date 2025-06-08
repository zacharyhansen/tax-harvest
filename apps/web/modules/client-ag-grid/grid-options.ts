'use client'

import type { GridOptions, ThemeDefaultParams } from 'ag-grid-community'
import { themeBalham, themeQuartz } from 'ag-grid-community'

import { cellRendererSelector } from './cell-renderer-selector'
import { defaultColumnTypes } from './column-types'
import { dataTypeDefinitions } from './data-type-definitions'

const styleParams: Partial<ThemeDefaultParams> = {
  backgroundColor: 'var(--background)',
  accentColor: 'var(--foreground)',
  borderColor: 'var(--border)',
  headerBackgroundColor: 'var(--muted)',
  headerTextColor: 'var(--muted-foreground)',
  rowHoverColor: 'var(--muted)/50',
  textColor: 'var(--foreground)',
  borderRadius: 'var(--radius-md)',
  wrapperBorderRadius: 'var(--radius)',
  inputBorderRadius: 'var(--radius-md)',
  buttonBorderRadius: 'var(--radius-md)',
  checkboxBorderRadius: 'var(--radius-md)',
}

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
    // pagination: true,
  },
}

const customThemeQuartz = themeQuartz
  .withParams(styleParams, 'light')
  .withParams(styleParams, 'dark')
  .withParams(styleParams, 'system')

const customThemeBalham = themeBalham
  .withParams(styleParams, 'light')
  .withParams(styleParams, 'dark')
  .withParams(styleParams, 'system')

export const themeBalhamGridOptions: GridOptions = {
  ...baseGridOptions,
  theme: customThemeBalham,
}

export const themeQuartzGridOptions: GridOptions = {
  ...baseGridOptions,
  theme: customThemeQuartz,
}
