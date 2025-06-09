'use client'

import type { ColumnDef } from '@tanstack/react-table'
import type { PositionItemFragment } from '~/generated/gql'
import { Badge } from '@repo/ui/components/badge'
import DataTable from '@repo/ui/components/dataTable/dataTable'

import { createColumnHelper } from '@tanstack/react-table'
import { Format, isOlderThanOneYear } from '~/modules/utils'

const columnHelper = createColumnHelper<PositionItemFragment>()

const columns: ColumnDef<PositionItemFragment, never>[] = [
  columnHelper.accessor('assetSymbol', {
    // cell: (props) => <DataTable.BadgeCell variant="default" {...props} />,
    header: 'Asset',
    meta: {
      searchable: true,
    },
  }),
  columnHelper.accessor('gainTotalPCT', {
    cell: DataTable.PercentCell,
    header: 'Total P/L %',
  }),
  columnHelper.accessor('gainTotal', {
    cell: DataTable.MoneyCell,
    header: 'Total P/L',
  }),
  columnHelper.accessor('costTotal', {
    cell: props => <DataTable.MoneyCell {...props} colored={false} />,
    header: 'Cost Basis',
  }),
  columnHelper.accessor('marketValue', {
    cell: props => <DataTable.MoneyCell {...props} colored={false} />,
    header: 'Market Value',
  }),
  columnHelper.accessor('pricePaid', {
    cell: props => <DataTable.MoneyCell {...props} colored={false} />,
    header: 'Price Paid',
  }),
  columnHelper.accessor('dateAcquired', {
    cell: props => <DataTable.DateCell {...props} />,
    header: 'Purchase Date',
  }),
  columnHelper.accessor('dateAcquired', {
    cell: ({ getValue }) => {
      const isLongTermGains = isOlderThanOneYear(getValue())
      return (
        <Badge variant={isLongTermGains ? 'outline-solid' : 'secondary'}>
          {isLongTermGains ? 'Long Term' : 'Short Term'}
        </Badge>
      )
    },
    header: 'Capital Gain',
    id: 'taxType',
  }),
  columnHelper.accessor('gainDay', {
    cell: DataTable.MoneyCell,
    header: 'Day\'s P/L',
  }),
  columnHelper.accessor('account', {
    cell: ({ getValue }) => {
      const account = getValue<{
        displayName?: string
        externalId?: string
      }>()
      return (
        <span>
          {account.displayName ?? Format.hideNumbers(account.externalId)}
        </span>
      )
    },
    header: 'Account Name',
  }),
  columnHelper.accessor('account.type', {
    cell: DataTable.BadgeCell,
    header: 'Account Type',
  }),
]

export default columns
