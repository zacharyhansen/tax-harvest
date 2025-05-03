'use client';

import type { ColumnDef } from '@tanstack/react-table';
import type { PortfolioTableItemFragment } from '~/generated/gql';
import DataTable from '@repo/ui/components/dataTable/dataTable';

import { createColumnHelper } from '@tanstack/react-table';

const columnHelper = createColumnHelper<PortfolioTableItemFragment>();

const columns: ColumnDef<PortfolioTableItemFragment, never>[] = [
  columnHelper.accessor(row => row.name, {
    header: 'Portfolio',
    id: 'portfolioName',
    size: 300,
  }),
  columnHelper.accessor('createdBy', {
    cell: DataTable.UserCell,
    header: 'Owner',
    id: 'owner',
    size: 150,
  }),
  columnHelper.accessor(row => row.usersOnPortfolios?.map(user => user.user), {
    cell: DataTable.AvatarGroupCell,
    header: 'Members',
    id: 'members',
    size: 300,
  }),
  columnHelper.accessor(row => row.accounts?.map(account => account.name), {
    cell: DataTable.ListCell,
    header: 'Accounts',
    id: 'accounts',
    size: 300,
  }),
  columnHelper.accessor('createdAt', {
    cell: DataTable.DateCell,
    header: 'Created',
    size: 150,
  }),
];

export default columns;
