'use client';

import type { ColDef } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

import { useLogsQuery } from '~/generated/gql';
import { TypedRoutes } from '~/lib/routes';
import { PageWrapper } from '~/modules/layout';
import { ErrorPage } from '~/modules/utility-components';

const AgGridWrapper = dynamic(
	() => import('~/modules/client-ag-grid/ag-grid-wrapper'),
	{
		ssr: false,
	},
);

export default function LogsPage() {
	const router = useRouter();
	const { data, error, loading } = useLogsQuery({
		variables: {},
	});

	const columnDefs: ColDef[] = useMemo(() => {
		return [
			{
				headerName: 'Created At',
				field: 'createdAt',
				// cellDataType: 'date',
				width: 300,
				valueGetter: (params) => {
					return new Date(params.data.createdAt).toLocaleString('en-US', {
						year: 'numeric',
						month: 'long',
						day: 'numeric',
						hour: 'numeric',
						minute: 'numeric',
						second: 'numeric',
						timeZoneName: 'short',
					});
				},
			},
			{
				headerName: 'Description',
				field: 'description',
				flex: 1,
			},
			{
				headerName: 'Response Status',
				field: 'responseStatus',
			},
			{
				headerName: 'Source',
				field: 'source',
			},
			{ headerName: 'Type', field: 'type' },
			{
				headerName: 'Merge Error',
				width: 150,
				// biome-ignore lint/suspicious/noExplicitAny: <ok>
				cellRenderer: (params: any) => {
					if (params.data?.mergeError?.length > 0) {
						const mergeError = params.data.mergeError[0];
						return (
							<div className="flex items-center gap-2">
								<span
									className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
										mergeError.resolved
											? 'bg-green-100 text-green-700'
											: 'bg-yellow-100 text-yellow-700'
									}`}
								>
									{mergeError.assetSymbol}
								</span>
							</div>
						);
					}
					return null;
				},
			},
		] satisfies ColDef[];
	}, []);

	if (error) {
		return <ErrorPage message={JSON.stringify(error)} />;
	}

	return (
		<PageWrapper>
			<AgGridWrapper>
				<AgGridReact
					columnDefs={columnDefs}
					rowData={data?.logs}
					rowSelection="single"
					onRowClicked={(row) => {
						if (row.data) {
							router.push(TypedRoutes.log({ logId: row.data.id }));
						}
					}}
					loading={loading}
				/>
			</AgGridWrapper>
		</PageWrapper>
	);
}
