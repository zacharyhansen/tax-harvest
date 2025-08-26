// export const cellRendererSelector: Record<
//   input_type,
//   CellRendererSelectorResult
// > = {
//   // text
//   [input_type.text]: {
//     component: (params: CustomCellRendererProps) =>
//       inputTypeStringFormatter.text(params.value),
//   },
//   [input_type.phone]: {
//     component: (params: CustomCellRendererProps) =>
//       inputTypeStringFormatter.phone(params.value),
//   },
//   [input_type.password]: {
//     component: (params: CustomCellRendererProps) =>
//       inputTypeStringFormatter.password(params.value),
//   },
//   [input_type.textarea]: {
//     component: (params: CustomCellRendererProps) =>
//       inputTypeStringFormatter.textarea(params.value),
//   },
//   // number
//   [input_type.number]: {
//     component: (params: CustomCellRendererProps) =>
//       inputTypeStringFormatter.number(params.value),
//   },
//   [input_type.percentage]: {
//     component: (params: CustomCellRendererProps) =>
//       inputTypeStringFormatter.percentage(params.value),
//   },
//   [input_type.usd]: {
//     component: (params: CustomCellRendererProps) =>
//       inputTypeStringFormatter.usd(params.value),
//   },
//   [input_type.slider]: {
//     component: (params: CustomCellRendererProps) => <div>{params.value}</div>,
//   },
//   // date
//   [input_type.date]: {
//     component: (params: CustomCellRendererProps) =>
//       inputTypeStringFormatter.date(params.value),
//   },
//   [input_type.timestamp]: {
//     component: (params: CustomCellRendererProps) =>
//       inputTypeStringFormatter.timestamp(params.value),
//   },
//   // boolean
//   [input_type.checkbox]: {
//     component: (params: CustomCellRendererProps) => <div>{params.value}</div>,
//   },
//   [input_type.switch]: {
//     component: (params: CustomCellRendererProps) => <div>{params.value}</div>,
//   },
//   // select
//   [input_type.combobox]: {
//     component: (params: CustomCellRendererProps) => <div>{params.value}</div>,
//   },
//   [input_type.combobox_multi]: {
//     component: (params: CustomCellRendererProps) => <div>{params.value}</div>,
//   },
//   // advanced
//   [input_type.tiptap]: {
//     component: (params: CustomCellRendererProps) => <div>{params.value}</div>,
//   },
//   [input_type.user]: {
//     component: AuthUserCell,
//   },
// };

// type TValue = string | number | null | undefined;

// export const inputTypeStringFormatter = {
//   // direct
//   [input_type.text]: (value?: TValue) =>
//     value !== undefined && value !== null ? value.toString() : '',
//   [input_type.phone]: (value?: TValue) =>
//     value !== undefined && value !== null ? value.toString() : '',
//   [input_type.password]: (value?: TValue) =>
//     value !== undefined && value !== null ? value.toString() : '',
//   [input_type.textarea]: (value?: TValue) =>
//     value !== undefined && value !== null ? value.toString() : '',
//   [input_type.number]: (value?: TValue) =>
//     value !== undefined && value !== null ? value.toString() : '',
//   [input_type.percentage]: (value?: TValue) =>
//     value !== undefined && value !== null
//       ? `${(parseFloat(value.toString()) * 100).toFixed(3)}%`
//       : '',
//   [input_type.usd]: (value?: TValue) =>
//     value !== undefined && value !== null
//       ? new Intl.NumberFormat('en-US', {
//           currency: 'USD',
//           style: 'currency',
//         }).format(parseFloat(value.toString()))
//       : '',
//   [input_type.date]: (value?: TValue) =>
//     value !== undefined && value !== null
//       ? DateFormatter.shortDay(value.toString())
//       : '',
//   [input_type.timestamp]: (value?: TValue) =>
//     value !== undefined && value !== null
//       ? DateFormatter.timestamp(value.toString())
//       : '',
// };

import type { ICellRendererParams } from 'ag-grid-community';

import JsonCell from './cells/json.cell';

// Define the cell renderer selector function for AG Grid
export function cellRendererSelector(params: ICellRendererParams) {
	// Check if colDef exists and if it has cellRendererParams with type 'json'
	if (params.colDef?.cellDataType === 'json') {
		return {
			component: JsonCell,
			params: {
				...params.colDef.cellRendererParams,
				value: params.value,
			},
		};
	}

	// Add other cell renderer types here as needed

	// Return undefined for default AG Grid behavior
	return undefined;
}
