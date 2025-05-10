'use client'

import type { ColDef } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { useMemo } from 'react'

import { useLotTransactionBatchesQuery } from '~/generated/gql'
import { TypedRoutes } from '~/lib/routes'
import { PageWrapper } from '~/modules/layout'
import { ErrorPage } from '~/modules/utility-components'

const AgGridWrapper = dynamic(
  () => import('~/modules/client-ag-grid/ag-grid-wrapper'),
  {
    ssr: false,
  },
)

export default function PlaidHistoryPage() {
  const router = useRouter()
  const { data, error, loading } = useLotTransactionBatchesQuery()

  const columnDefs: ColDef[] = useMemo(() => {
    return [
      {
        headerName: 'Created At',
        field: 'createdAt',
        cellDataType: 'timeStamp',
        width: 250,
      },
      {
        headerName: 'ID',
        field: 'id',
        width: 350,
      },
      {
        headerName: 'Auth Connection ID',
        field: 'authConnectionId',
        flex: 1,
      },
    ] satisfies ColDef[]
  }, [])

  if (error) {
    return <ErrorPage message={JSON.stringify(error)} />
  }

  return (
    <PageWrapper title="Plaid History -  Lot Sync Events">
      <AgGridWrapper>
        <AgGridReact
          columnDefs={columnDefs}
          rowData={data?.lotTransactionBatches}
          rowSelection="single"
          onRowClicked={(row) => {
            if (row.data) {
              router.push(
                TypedRoutes.lotTransactionBatch({
                  lotTransactionBatchId: row.data.id,
                }),
              )
            }
          }}
          loading={loading}
        />
      </AgGridWrapper>
    </PageWrapper>
  )
}
