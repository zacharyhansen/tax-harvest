'use client';

import type { CellContext, ColumnDef } from '@tanstack/react-table';
import { createColumnHelper } from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import { Badge, DataTable } from 'ui';
import { Format } from 'utilities';
import type { LotCurrentItemFragment } from 'generated/gql';
import { TaxGain } from 'generated/gql';

const columnHelper = createColumnHelper<
  LotCurrentItemFragment & { selectedQuantity: number }
>();

const columns: ColumnDef<
  LotCurrentItemFragment & { selectedQuantity: number },
  never
>[] = [
  {
    cell: ({ row }) => (
      <DataTable.RowSelectCheckBox
        {...{
          checked: row.getIsSelected(),
          // checked: row.getIsSelected() || row.getValue("selectedQuantity"),
          disabled: !row.getCanSelect(),
          indeterminate: row.getIsSomeSelected(),
          onChange: row.getToggleSelectedHandler(),
        }}
      />
    ),
    header: ({ table }) => (
      <DataTable.RowSelectCheckBox
        {...{
          checked: table.getIsAllRowsSelected(),
          indeterminate: table.getIsSomeRowsSelected(),
          onChange: table.getToggleAllRowsSelectedHandler(),
        }}
      />
    ),
    id: 'select',
    size: 50,
  },
  columnHelper.accessor('selectedQuantity', {
    aggregationFn: 'sumDecimal',
    cell: SelectedQuantityCell,
    footer: ({ table }) => {
      const total = table
        .getFilteredRowModel()
        .rows.reduce(
          (sum, row) =>
            sum + Number(row.getValue<string>('selectedQuantity') || 0),
          0
        );
      return <DataTable.FooterCell label="Total" value={total.toFixed(2)} />;
    },
    header: 'Selected Qty',
    size: 130,
  }),
  columnHelper.accessor('remainingQty', {
    aggregationFn: 'sum',
    footer: ({ table }) => {
      const total = table
        .getFilteredRowModel()
        .rows.reduce(
          (sum, row) => sum + Number(row.getValue<string>('remainingQty') || 0),
          0
        );
      return <DataTable.FooterCell label="Total" value={total.toFixed(2)} />;
    },
    header: 'Available Qty',
    size: 130,
  }),
  columnHelper.accessor('symbol', {
    enableGrouping: true,
    header: 'Asset',
    meta: {
      searchable: true,
    },
    size: 130,
  }),
  columnHelper.accessor('acquiredDate', {
    cell: DataTable.DateCell,
    header: 'Lot',
    size: 130,
  }),
  columnHelper.accessor('value', {
    aggregationFn: 'sumMoney',
    cell: props => <DataTable.MoneyCell {...props} colored={false} />,
    footer: ({ table }) => {
      const total = table
        .getFilteredRowModel()
        .rows.reduce(
          (sum, row) => sum + Number(row.getValue<string>('value') || 0),
          0
        );
      return <DataTable.FooterCell label="Total" value={Format.money(total)} />;
    },
    header: 'Current Value',
    size: 130,
  }),
  columnHelper.accessor('costBasis', {
    aggregationFn: 'sumMoney',
    cell: props => <DataTable.MoneyCell {...props} colored={false} />,
    footer: ({ table }) => {
      const total = table
        .getFilteredRowModel()
        .rows.reduce(
          (sum, row) => sum + Number(row.getValue<string>('costBasis') || 0),
          0
        );
      return <DataTable.FooterCell label="Total" value={Format.money(total)} />;
    },
    header: 'Cost Basis',
    size: 130,
  }),
  columnHelper.accessor('gainTotal', {
    aggregationFn: 'sumMoney',
    cell: DataTable.MoneyCell,
    footer: ({ table }) => {
      const total = table
        .getFilteredRowModel()
        .rows.reduce(
          (sum, row) => sum + Number(row.getValue<string>('gainTotal') || 0),
          0
        );
      return <DataTable.FooterCell label="Total" value={Format.money(total)} />;
    },
    header: 'P & L',
    size: 130,
  }),
  columnHelper.accessor('taxGain', {
    cell: ({ getValue }) => {
      const isLongTermGains = getValue() === TaxGain.Long;
      return (
        <Badge variant={isLongTermGains ? 'default' : 'secondary'}>
          {isLongTermGains ? 'Long Term' : 'Short Term'}
        </Badge>
      );
    },
    header: 'Tax Gain',
    size: 130,
  }),
];

export default columns;

function SelectedQuantityCell<TData>({
  column: { id },
  getValue,
  row: { index },
  table,
}: CellContext<TData, number>) {
  const initialValue = getValue();
  // We need to keep and update the state of the cell normally
  const [value, setValue] = useState(initialValue);

  // When the input is blurred, we'll call our table meta's updateData function
  const onBlur = () => {
    table.options.meta?.updateCell(index, id, value);
  };

  // If the initialValue is changed external, sync it up with our state
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <input
      value={Number(value).toString()}
      type="number"
      className="w-full"
      onChange={e => {
        setValue(Number(e.target.value));
      }}
      onBlur={onBlur}
    />
  );
}
