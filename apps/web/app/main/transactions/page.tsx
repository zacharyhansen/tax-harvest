'use client'

import DataTable from '@repo/ui/components/dataTable/dataTable'

import { useTransactionsQuery } from '~/generated/gql'

import { PageWrapper } from '~/modules/layout'
import { ErrorPage, LoadingPage } from '~/modules/utility-components'
import columns from './TransactionsTable.ColumnDef'

export default function AccountIndex() {
  const { data, error, loading } = useTransactionsQuery()

  if (loading) {
    return <LoadingPage />
  }

  if (error) {
    return (
      <ErrorPage message="Could not load transactions at this time. If this issue persists please contact support" />
    )
  }

  return (
    <PageWrapper>
      <DataTable
        columns={columns}
        data={data?.transactions}
        noResultsAlert="No transactions were found for the search criteria"
      />
    </PageWrapper>
  )
}
