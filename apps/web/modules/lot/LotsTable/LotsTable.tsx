'use client';

import { Badge } from '@repo/ui/components/badge';
import type { ColumnDef } from '@tanstack/react-table';
import { createColumnHelper } from '@tanstack/react-table';
import DataTable from '@repo/ui/components/dataTable/dataTable';

import { Format, isOlderThanOneYear } from '~/modules/utils';
import { LoadingPage, ErrorPage } from '~/modules/utility-components';
import { usePortfolioLotsQuery, type LotItemFragment } from '~/generated/gql';

export default function LotsTable() {
  const { data, error, loading } = usePortfolioLotsQuery();

  if (loading) {
    return <LoadingPage />;
  }

  if (error) {
    return <ErrorPage message={error.message} />;
  }

  return (
    <DataTable
      columns={columnDef}
      data={data?.lots ?? []}
      noResultsAlert={'This portfolio has no positions.'}
      loading={loading}
      error={!!error}
      initialState={{
        expanded: true,
        grouping: ['assetSymbol'],
        pagination: {
          pageIndex: 0,
          pageSize: data?.lots.length ?? 0,
        },
        sorting: [{ id: 'acquiredDate', desc: false }],
      }}
      customAggregationFns={{
        avgPricePaid: (_columnId, leafRows) => {
          let totalQuantity = 0;
          let totalPaid = 0;
          leafRows.forEach(row => {
            const qty = Number(row.original.remainingQty) || 0;
            totalQuantity += qty;
            totalPaid += (Number(row.original.price) || 0) * qty;
          });
          return Format.money(totalPaid / totalQuantity, 4);
        },
        totalGainPct: (_columnId, leafRows) => {
          let totalGain = 0;
          let totalPaid = 0;
          leafRows.forEach(row => {
            row.getValue;
            totalGain += Number(row.getValue('totalGain')) || 0;
            totalPaid += Number(row.getValue('costBasis')) || 0;
          });
          return new Intl.NumberFormat('en-US', {
            maximumFractionDigits: 2,
            style: 'percent',
          }).format(totalGain / totalPaid);
        },
      }}
    />
  );
}

const columnHelper = createColumnHelper<LotItemFragment>();

const columnDef: ColumnDef<LotItemFragment, never>[] = [
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
    size: 140,
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
    size: 130,
  }),
  columnHelper.accessor('remainingQty', {
    aggregationFn: 'sumDecimal',
    cell: props => Number(props.row.original.remainingQty).toFixed(2),
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
    size: 110,
  }),
  columnHelper.accessor('price', {
    aggregationFn: 'avgPricePaid',
    cell: props => <DataTable.MoneyCell {...props} colored={false} />,
    header: 'Price Paid',
    size: 120,
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
      size: 120,
    }
  ),

  columnHelper.accessor(
    row =>
      Number((row.remainingQty || 0) * (row.asset.lastPrice || 0)).toFixed(2),
    {
      aggregationFn: 'sumMoney',
      cell: props => <DataTable.MoneyCell {...props} colored={false} />,

      header: 'Total Value',
      id: 'value',
      size: 120,
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
      size: 130,
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
    size: 130,
  }),
  // columnHelper.accessor("gainDay", {
  //   cell: DataTable.MoneyCell,
  //   header: "Day's P/L",
  //   size: 110,
  // }),
  columnHelper.accessor('account.name', {
    cell: ({ getValue }) => {
      const account = getValue<{
        name?: string;
        externalId?: string;
      }>();
      return (
        <span>{account.name ?? Format.hideNumbers(account.externalId)}</span>
      );
    },
    header: 'Account Name',
    size: 310,
  }),
];
