'use client';

import { Badge } from '@repo/ui/components/badge';
import type { ColDef } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import {
	MergeErrorType,
	type MultiChangeSetTableItemFragment,
	useMergeErrorsQuery,
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

	const { data, error, loading } = useMergeErrorsQuery();

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
				headerName: 'Type',
				field: 'type',
				width: 200,
				valueGetter: (params) => {
					const type = params.data?.type;
					if (type === MergeErrorType.PlaidMultiLotSolution) {
						return 'Multi Lot Solution';
					} else if (type === MergeErrorType.PlaidNoSolution) {
						return 'No Solution Found';
					}
					return type;
				},
				// biome-ignore lint/suspicious/noExplicitAny: <ok>
				cellRenderer: (params: any) => {
					const type = params.data.type;
					const isMultiLot = type === MergeErrorType.PlaidMultiLotSolution;
					const isNoSolution = type === MergeErrorType.PlaidNoSolution;

					let displayText = type;
					if (isMultiLot) {
						displayText = 'Multi Lot Solution';
					} else if (isNoSolution) {
						displayText = 'No Solution Found';
					}

					return (
						<span
							className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
								isMultiLot
									? 'bg-blue-100 text-blue-700'
									: 'bg-orange-100 text-orange-700'
							}`}
						>
							{displayText}
						</span>
					);
				},
			},
			{
				headerName: 'Asset',
				field: 'assetSymbol',
				width: 120,
				//@ts-expect-error <ok>
				cellRenderer: (params) => {
					console.log(params.data);
					return <Badge>{params.data?.assetSymbol}</Badge>;
				},
			},
			{
				headerName: 'Target Value',
				field: 'targetValue',
				width: 150,
				valueGetter: (params) => {
					const value = params.data?.targetValue;
					if (value === null || value === undefined) return '';
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
					rowData={data?.mergeErrors || []}
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
