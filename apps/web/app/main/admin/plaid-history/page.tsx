'use client';

import { Badge } from '@repo/ui/components/badge';
import type { ColDef } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

import { usePlaidMergesQuery } from '~/generated/gql';
import { TypedRoutes } from '~/lib/routes';
import { PageWrapper } from '~/modules/layout';
import { ErrorPage } from '~/modules/utility-components';

const AgGridWrapper = dynamic(
	() => import('~/modules/client-ag-grid/ag-grid-wrapper'),
	{
		ssr: false,
	},
);

export default function PlaidHistoryPage() {
	const router = useRouter();
	const { data, error, loading } = usePlaidMergesQuery();

	const columnDefs: ColDef[] = useMemo(() => {
		return [
			{
				headerName: 'Created At',
				field: 'createdAt',
				cellDataType: 'timeStamp',
				width: 200,
				sort: 'desc',
			},
			{
				headerName: 'ID',
				field: 'id',
				width: 300,
			},
			{
				headerName: 'Account',
				field: 'account.name',
				width: 200,
			},
			{
				headerName: 'Institution',
				field: 'account.institution',
				width: 150,
			},
			{
				headerName: 'Asset Merges',
				field: 'assetMergeCount',
				width: 120,
				valueGetter: (params) => params.data?.assetMerge?.length || 0,
			},
			{
				headerName: 'Merge Errors',
				field: 'mergeErrorCount',
				width: 120,
				cellRenderer: (params: any) => {
					let errorCount = 0;
					// biome-ignore lint/suspicious/noExplicitAny: <ok>
					params.data?.assetMerge?.forEach((am: any) => {
						if (am.mergeError) {
							// Check if mergeError is an array
							if (Array.isArray(am.mergeError)) {
								// biome-ignore lint/suspicious/noExplicitAny: <ok>
								errorCount += am.mergeError.filter((error: any) => !error.resolved).length;
							} else if (!am.mergeError.resolved) {
								// Single error object
								errorCount += 1;
							}
						}
					});
					
					if (errorCount === 0) {
						return null;
					}
					
					return <Badge variant="destructive">{errorCount}</Badge>;
				},
			},
		] satisfies ColDef[];
	}, []);

	if (error) {
		return <ErrorPage message={JSON.stringify(error)} />;
	}

	return (
		<PageWrapper title="Plaid Merges">
			<AgGridWrapper>
				<AgGridReact
					columnDefs={columnDefs}
					rowData={data?.plaidMerges}
					rowSelection="single"
					onRowClicked={(row) => {
						if (row.data) {
							router.push(
								TypedRoutes.plaidMerge({
									plaidMergeId: row.data.id,
								}),
							);
						}
					}}
					loading={loading}
				/>
			</AgGridWrapper>
		</PageWrapper>
	);
}
