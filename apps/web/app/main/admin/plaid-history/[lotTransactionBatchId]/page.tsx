'use client';

import ReactJsonView from '@microlink/react-json-view';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@repo/ui/components/tabs';
import type { ColDef } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { useTheme } from 'next-themes';
import { useMemo } from 'react';

import { useLotTransactionBatchQuery } from '~/generated/gql';
import { TypedRoutes } from '~/lib/routes';
import { AgGridWrapper } from '~/modules/client-ag-grid';
import { PageWrapper } from '~/modules/layout';
import { ErrorPage, LoadingPage } from '~/modules/utility-components';

export default function LotTransactionBatchPage({
  params,
}: {
  params: typeof TypedRoutes.lotTransactionBatch.params;
}) {
  const theme = useTheme();
  const safeParams = TypedRoutes.lotTransactionBatch.parse(params);

  const { data, error, loading } = useLotTransactionBatchQuery({
    variables: { lotTransactionBatchId: safeParams.lotTransactionBatchId },
  });

  const columnDefs: ColDef[] = useMemo(
    () =>
      [
        {
          headerName: 'Lot ID',
          field: 'lot.id',
          width: 100,
          hide: true,
        },
        {
          headerName: 'Asset',
          field: 'lot.assetSymbol',
          width: 100,
        },
        {
          headerName: 'Final Qty',
          field: 'lot.remainingQty',
          width: 120,
        },
        {
          headerName: 'Qty Change',
          field: 'quantityChange',
          width: 140,
        },
        {
          headerName: 'Lot Before',
          field: 'lotBefore',
          width: 100,
          cellDataType: 'json',
          flex: 1,
        },
        {
          headerName: 'Lot Price',
          field: 'lot.price',
          width: 100,
        },
        {
          headerName: 'Lot After',
          field: 'lotAfter',
          width: 100,
          cellDataType: 'json',
        },
        {
          headerName: 'Lot Account',
          field: 'lot.account.name',
          width: 100,
        },
        {
          headerName: 'Operation Type',
          field: 'operationType',
        },
      ] satisfies ColDef[],
    []
  );

  if (error) {
    return <ErrorPage message={JSON.stringify(error)} />;
  }

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <PageWrapper
      title="Lot Transaction Batch Explorer"
      description={
        <div className="grid grid-cols-2 gap-2">
          <div className="flex gap-2">
            <span className="font-bold">ID:</span>
            <span>{data?.lotTransactionBatch?.id}</span>
          </div>
          <div className="flex gap-2">
            <span className="font-bold">Auth Connection ID:</span>
            <span>{data?.lotTransactionBatch?.authConnectionId}</span>
          </div>
          <div className="flex gap-2">
            <span className="font-bold">Created At:</span>
            <span>{data?.lotTransactionBatch?.createdAt}</span>
          </div>
          <div className="flex gap-2">
            <span className="font-bold">Updated At:</span>
            <span>{data?.lotTransactionBatch?.updatedAt}</span>
          </div>
        </div>
      }
    >
      <Tabs defaultValue="LotChangeLog">
        <TabsList>
          <TabsTrigger value="LotChangeLog">Lot</TabsTrigger>
          <TabsTrigger value="lotTupleMap">Input to Algorithm</TabsTrigger>
          <TabsTrigger value="initialLots">Initial Lots</TabsTrigger>
          <TabsTrigger value="newTransactions">New Transactions</TabsTrigger>
          <TabsTrigger value="positionsAfter">Positions After</TabsTrigger>
        </TabsList>
        <TabsContent value="LotChangeLog" className="h-[75vh]">
          <AgGridWrapper>
            <AgGridReact
              columnDefs={columnDefs}
              rowData={data?.lotTransactionBatch?.lotChangeLog}
              loading={loading}
            />
          </AgGridWrapper>
        </TabsContent>
        <TabsContent value="lotTupleMap">
          {data?.lotTransactionBatch?.lotTupleMap ? (
            <ReactJsonView
              src={data.lotTransactionBatch.lotTupleMap}
              theme={theme.theme === 'dark' ? 'ashes' : 'rjv-default'}
              displayDataTypes={false}
              indentWidth={6}
            />
          ) : (
            <div>No lot tuple map</div>
          )}
        </TabsContent>
        <TabsContent value="initialLots">
          {data?.lotTransactionBatch?.initialLots ? (
            <ReactJsonView
              src={data.lotTransactionBatch.initialLots}
              theme={theme.theme === 'dark' ? 'ashes' : 'rjv-default'}
              displayDataTypes={false}
              indentWidth={6}
            />
          ) : (
            <div>No initial lots</div>
          )}
        </TabsContent>
        <TabsContent value="newTransactions">
          {data?.lotTransactionBatch?.newTransactions ? (
            <ReactJsonView
              src={data.lotTransactionBatch.newTransactions}
              theme={theme.theme === 'dark' ? 'ashes' : 'rjv-default'}
              displayDataTypes={false}
              indentWidth={6}
            />
          ) : (
            <div>No new transactions</div>
          )}
        </TabsContent>
        <TabsContent value="positionsAfter">
          {data?.lotTransactionBatch?.positionsAfter ? (
            <ReactJsonView
              src={data.lotTransactionBatch.positionsAfter}
              theme={theme.theme === 'dark' ? 'ashes' : 'rjv-default'}
              displayDataTypes={false}
              indentWidth={6}
            />
          ) : (
            <div>No positions after</div>
          )}
        </TabsContent>
      </Tabs>
    </PageWrapper>
  );
}
