'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { createColumnHelper } from '@tanstack/react-table';
import { Badge, DataTable } from 'ui';
import { Format, isOlderThanOneYear } from 'utilities';
import type { LotItemFragment } from 'generated/gql';

const columnHelper = createColumnHelper<LotItemFragment>();

const columns: ColumnDef<LotItemFragment, never>[] = [
  columnHelper.accessor('assetSymbol', {
    enableGrouping: true,
    header: 'Asset',
    meta: {
      searchable: true,
    },
    size: 130,
  }),
  columnHelper.accessor('acquiredDate', {
    cell: props => <DataTable.DateCell {...props} />,
    header: 'Purchase Date',
    size: 130,
  }),
  columnHelper.accessor('acquiredDate', {
    cell: ({ getValue }) => {
      const isLongTermGains = isOlderThanOneYear(getValue());
      return (
        <Badge variant={isLongTermGains ? 'default' : 'secondary'}>
          {isLongTermGains ? 'Long Term' : 'Short Term'}
        </Badge>
      );
    },
    header: 'Capital Gain',
    id: 'taxType',
    size: 120,
  }),
  columnHelper.accessor('remainingQty', {
    aggregationFn: 'sumDecimal',
    footer: ({ table }) => {
      const total = table
        .getFilteredRowModel()
        .rows.reduce(
          (sum, row) => sum + Number(row.getValue<string>('remainingQty') || 0),
          0
        )
        .toFixed(2);
      return <DataTable.FooterCell label="Total" value={total} />;
    },
    header: 'Quantity',
    size: 100,
  }),
  columnHelper.accessor('price', {
    aggregationFn: 'avgPricePaid',
    cell: props => <DataTable.MoneyCell {...props} colored={false} />,
    header: 'Price Paid',
    size: 110,
  }),
  columnHelper.accessor(
    row => Number((row.remainingQty || 0) * (row.price || 0)),
    {
      aggregationFn: 'sumMoney',
      cell: props => <DataTable.MoneyCell {...props} colored={false} />,
      footer: ({ table }) => {
        const total = table
          .getFilteredRowModel()
          .rows.reduce(
            (sum, row) =>
              sum +
              Number(row.getValue<string>('remainingQty') || 0) *
                row.getValue<number>('price'),
            0
          );
        return (
          <DataTable.FooterCell label="Total" value={Format.money(total)} />
        );
      },
      header: 'Cost Basis',
      id: 'costBasis',
      size: 110,
    }
  ),

  columnHelper.accessor(
    row =>
      Number((row.remainingQty || 0) * (row.asset.lastPrice || 0)).toFixed(2),
    {
      aggregationFn: 'sumMoney',
      cell: props => <DataTable.MoneyCell {...props} colored={false} />,

      header: 'Value',
      id: 'value',
      size: 110,
    }
  ),
  columnHelper.accessor(
    row => {
      const cost = (row.remainingQty || 0) * (row.price || 0);
      const value = (row.remainingQty || 0) * (row.asset.lastPrice || 0);
      return value - cost;
    },
    {
      aggregationFn: 'sumMoney',
      cell: DataTable.MoneyCell,
      header: 'Total Gain',
      id: 'totalGain',
      size: 120,
    }
  ),
  columnHelper.accessor('totalCostForGainPct', {
    aggregationFn: 'totalGainPct',
    cell: props => (
      <DataTable.PercentCell
        {...props}
        value={
          (Number(props.row.getValue('totalGain')) /
            Number(props.row.getValue('costBasis'))) *
          100
        }
      />
    ),
    header: 'Total Gain %',
    size: 120,
  }),
  // columnHelper.accessor("gainDay", {
  //   cell: DataTable.MoneyCell,
  //   header: "Day's P/L",
  //   size: 110,
  // }),
  columnHelper.accessor('account', {
    cell: ({ getValue }) => {
      const account = getValue<{
        displayName?: string;
        externalId?: string;
      }>();
      return (
        <span>
          {account?.displayName || Format.hideNumbers(account?.externalId)}
        </span>
      );
    },
    header: 'Account Name',
    size: 300,
  }),
];

export default columns;
