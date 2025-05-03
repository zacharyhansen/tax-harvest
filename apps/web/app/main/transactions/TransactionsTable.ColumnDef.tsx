'use client';

import type { ColumnDef } from '@tanstack/react-table';
import type { TransactionTableItemFragment } from '~/generated/gql';
import DataTable from '@repo/ui/components/dataTable/dataTable';

import { createColumnHelper } from '@tanstack/react-table';

const columnHelper = createColumnHelper<TransactionTableItemFragment>();

const columns: ColumnDef<TransactionTableItemFragment, never>[] = [
  columnHelper.accessor('transactionDate', {
    cell: DataTable.DateCell,
    header: ({ column }) => (
      <DataTable.BasicHeader column={column} title="Date" />
    ),
    size: 90,
  }),
  columnHelper.accessor('account.authConnection.source', {
    cell: DataTable.BadgeCell,
    header: ({ column }) => (
      <DataTable.BasicHeader column={column} title="Source" />
    ),
    meta: {
      filterDef: {
        label: 'Source',
        options: [
          { label: 'Plaid', value: 'PLAID' },
          { label: 'Etrade', value: 'ETRADE_ACCESS' },
        ],
      },
      searchable: true,
    },
    size: 130,
  }),
  columnHelper.accessor('type', {
    cell: DataTable.BadgeCell,
    header: ({ column }) => (
      <DataTable.BasicHeader column={column} title="Type" />
    ),
    size: 90,
  }),
  columnHelper.accessor('subtype', {
    cell: DataTable.BadgeCell,
    header: ({ column }) => (
      <DataTable.BasicHeader column={column} title="Subtype" />
    ),
    size: 90,
  }),
  columnHelper.accessor('memo', {
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="truncate font-medium">{row.getValue('memo')}</span>
        </div>
      );
    },
    header: ({ column }) => (
      <DataTable.BasicHeader column={column} title="Description" />
    ),
    meta: {
      searchable: true,
    },
    size: 500,
  }),
  columnHelper.accessor('assetSymbol', {
    cell: DataTable.BadgeCell,
    header: ({ column }) => (
      <DataTable.BasicHeader column={column} title="Security" />
    ),
    size: 90,
  }),
  columnHelper.accessor('price', {
    cell: props => <DataTable.MoneyCell {...props} colored={false} />,
    header: ({ column }) => (
      <DataTable.BasicHeader column={column} title="Price" />
    ),
    size: 90,
  }),
  columnHelper.accessor('quantity', {
    header: ({ column }) => (
      <DataTable.BasicHeader column={column} title="Quantity" />
    ),
    size: 90,
  }),
  columnHelper.accessor('amount', {
    cell: DataTable.MoneyCell,
    header: ({ column }) => (
      <DataTable.BasicHeader column={column} title="Amount" />
    ),
    size: 90,
  }),
  columnHelper.accessor('fee', {
    cell: DataTable.MoneyCell,
    header: ({ column }) => (
      <DataTable.BasicHeader column={column} title="Fee" />
    ),
    size: 90,
  }),
];

export default columns;
