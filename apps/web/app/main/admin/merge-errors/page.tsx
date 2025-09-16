'use client';

import type { ColDef } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { RefreshCw } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import {
	type MultiChangeSetTableItemFragment,
	useMultiChangeSetsQuery,
} from '~/generated/gql';
import { TypedRoutes } from '~/lib/routes';
import { PageWrapper } from '~/modules/layout';
import { ErrorPage } from '~/modules/utility-components';

const AgGridWrapper = dynamic(
	() => import('~/modules/client-ag-grid/ag-grid-wrapper'),
	{
		ssr: false,
	},
);

export default function MergeErrorsPage() {
	const router = useRouter();

	const { data, error, loading } = useMultiChangeSetsQuery();

	const columnDefs: ColDef<MultiChangeSetTableItemFragment>[] = useMemo(() => {
		return [
			{
				headerName: 'Created At',
				field: 'createdAt',
				width: 200,
				valueGetter: (params) => {
					return new Date(params.data?.createdAt).toLocaleString('en-US', {
						year: 'numeric',
						month: 'short',
						day: 'numeric',
						hour: 'numeric',
						minute: 'numeric',
					});
				},
			},
			{
				headerName: 'Asset',
				field: 'assetSymbol',
				width: 120,
			},
			{
				headerName: 'Asset Name',
				field: 'assetSymbol',
				flex: 1,
			},
			{
				headerName: 'Target Value',
				field: 'targetValue',
				width: 150,
				valueGetter: (params) => {
					const value = params.data?.targetValue;
					if (value === null || value === undefined) return 'N/A';
					return new Intl.NumberFormat('en-US', {
						style: 'currency',
						currency: 'USD',
					}).format(Number(value));
				},
			},
			{
				headerName: 'Target Quantity',
				field: 'targetQuantity',
				width: 150,
			},
			{
				headerName: 'Status',
				field: 'resolved',
				width: 120,
				// biome-ignore lint/suspicious/noExplicitAny: <ok>
				cellRenderer: (params: any) => {
					const resolved = params.data.resolved;
					return (
						<span
							className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
								resolved
									? 'bg-green-100 text-green-700'
									: 'bg-yellow-100 text-yellow-700'
							}`}
						>
							{resolved ? 'Resolved' : 'Unresolved'}
						</span>
					);
				},
			},
		];
	}, []);

	if (error) {
		return <ErrorPage message={JSON.stringify(error)} />;
	}

	return (
		<PageWrapper title="Merge Errors">
			<AgGridWrapper>
				<AgGridReact
					loading={loading}
					rowData={data?.multiChangeSets || []}
					columnDefs={columnDefs}
					defaultColDef={{
						sortable: true,
						resizable: true,
						filter: true,
					}}
					onRowClicked={(row) => {
						if (row.data) {
							router.push(
								TypedRoutes.mergeError({ mergeErrorId: row.data.id }),
							);
						}
					}}
					animateRows={true}
					domLayout="normal"
					quickFilterText=""
					rowClass="cursor-pointer"
				/>
			</AgGridWrapper>
		</PageWrapper>
	);
}
