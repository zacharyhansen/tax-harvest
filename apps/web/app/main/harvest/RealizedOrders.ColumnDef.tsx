'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { createColumnHelper } from '@tanstack/react-table';
import { capitalCase } from 'change-case';
import { Badge } from '@repo/ui/components/badge';
import DataTable from '@repo/ui/components/dataTable/dataTable';

import { Format } from '~/modules/utils';
import type { HarvestLotOrderItemFragment } from '~/generated/gql';
import { TaxGain } from '~/generated/gql';

const columnHelper = createColumnHelper<HarvestLotOrderItemFragment>();

const columns: ColumnDef<HarvestLotOrderItemFragment, never>[] = [
  columnHelper.accessor(row => capitalCase(row.orderType), {
    cell: DataTable.BadgeCell,
    header: 'Order Type',
    size: 130,
  }),
  columnHelper.accessor('assetSymbol', {
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
  columnHelper.accessor('quantity', {
    aggregationFn: 'sumDecimal',
    footer: ({ table }) => {
      const total = table
        .getFilteredRowModel()
        .rows.reduce(
          (sum, row) => sum + Number(row.getValue<string>('quantity') || 0),
          0
        );
      return <DataTable.FooterCell label="Total" value={total} />;
    },
    header: 'Quantity',
    size: 130,
  }),
  columnHelper.accessor('valueTotal', {
    aggregationFn: 'sumMoney',
    cell: props => <DataTable.MoneyCell {...props} colored={false} />,
    footer: ({ table }) => {
      const total = table
        .getFilteredRowModel()
        .rows.reduce(
          (sum, row) => sum + Number(row.getValue<string>('valueTotal') || 0),
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
    header: 'Tax',
    size: 130,
  }),
];

export default columns;
