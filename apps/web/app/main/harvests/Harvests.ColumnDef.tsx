'use client';

import type { ColumnDef } from '@tanstack/react-table';
import type { HarvestTableItemFragment } from '~/generated/gql';
import { Badge } from '@repo/ui/components/badge';
import DataTable from '@repo/ui/components/dataTable/dataTable';
import { createColumnHelper } from '@tanstack/react-table';

import { capitalCase } from 'change-case';
import { HarvestStep } from '~/generated/gql';

const columnHelper = createColumnHelper<HarvestTableItemFragment>();

const columns: ColumnDef<HarvestTableItemFragment, never>[] = [
  columnHelper.accessor('label', {
    header: 'Name',
    size: 250,
  }),
  columnHelper.accessor('amount', {
    cell: DataTable.MoneyCell,
    header: 'Amount',
    size: 150,
  }),
  columnHelper.accessor('type', {
    cell: ({ getValue }) => capitalCase(getValue()),
    enableGrouping: true,
    header: 'Type',
    meta: {
      searchable: true,
    },
    size: 150,
  }),
  columnHelper.accessor('step', {
    cell: ({ getValue }) => (
      <Badge
        variant={getValue() === HarvestStep.Complete ? 'default' : 'secondary'}
      >
        {getValue() === HarvestStep.Complete ? 'Completed' : 'In Progress'}
      </Badge>
    ),
    enableGrouping: true,
    header: 'Status',
    meta: {
      searchable: true,
    },
    size: 150,
  }),
  columnHelper.accessor('date', {
    cell: DataTable.DateCell,
    enableGrouping: true,
    header: 'Harvest Date',
    size: 150,
  }),
  columnHelper.accessor('createdBy', {
    cell: DataTable.UserCell,
    enableGrouping: true,
    header: 'Created By',
    size: 150,
  }),
  columnHelper.accessor('createdAt', {
    cell: DataTable.DateCell,
    enableGrouping: true,
    header: 'Created At',
    size: 150,
  }),
];

export default columns;
