import type { ColTypeDef } from 'ag-grid-community';

export const defaultColumnTypes: Record<string, ColTypeDef> = {
  edit: {
    cellClass: params => {
      return params.column.isCellEditable(params.node)
        ? "hover:after:content-['✎'] hover:after:absolute hover:after:scale-x-[-1] hover:after:right-0 hover:after:px-1 hover:after:bg-inherit focus:after:content-['✎'] focus:after:absolute focus:after:scale-x-[-1] focus:after:right-0 focus:after:px-1 focus:after:bg-inherit"
        : '';
    },
  },
};
