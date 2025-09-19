'use client';

import { Badge } from '@repo/ui/components/badge';
import type { ColDef } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import { useTransactionsQuery } from '~/generated/gql';
import { PageWrapper } from '~/modules/layout';
import { ErrorPage } from '~/modules/utility-components';

const AgGridWrapper = dynamic(
	() => import('~/modules/client-ag-grid/ag-grid-wrapper'),
	{
		ssr: false,
	},
);

/**
 * Transactions page component that displays a grid of transaction data
 * @returns The transactions page with AG Grid table
 * @example
 * <TransactionsPage />
 */
export default function TransactionsPage() {
	const { data, error, loading } = useTransactionsQuery();

	const columnDefs: ColDef[] = useMemo(() => {
		return [
			{
				headerName: 'Date',
				field: 'transactionDate',
				width: 120,
				sort: 'desc',
				comparator: (valueA: string, valueB: string) => {
					const dateA = new Date(valueA).getTime();
					const dateB = new Date(valueB).getTime();
					return dateA - dateB;
				},
				valueGetter: (params) => {
					return new Date(params.data.transactionDate).toLocaleDateString(
						'en-US',
					);
				},
			},
			{
				headerName: 'Security',
				field: 'assetSymbol',
				width: 130,
				filter: 'agTextColumnFilter',
				/** biome-ignore lint/suspicious/noExplicitAny: <ok> */
				cellRenderer: (params: any) => {
					return params.value ? (
						<Badge className="text-xs bg-gray-200 hover:bg-gray-300 text-black">
							{params.value}
						</Badge>
					) : null;
				},
			},
			{
				headerName: 'Applied?',
				field: 'appliedToLots',
				width: 100,
				filter: 'agTextColumnFilter',
				/** biome-ignore lint/suspicious/noExplicitAny: <ok> */
				cellRenderer: (params: any) => {
					if (params.value) {
						return <span className="text-xs">Yes</span>;
					}
					return (
						<Badge variant="destructive" className="text-xs">
							No
						</Badge>
					);
				},
			},
			{
				headerName: 'Account',
				field: 'account.name',
				width: 180,
				filter: 'agTextColumnFilter',
				/** biome-ignore lint/suspicious/noExplicitAny: <ok> */
				cellRenderer: (params: any) => {
					const colors = [
						'bg-blue-300',
						'bg-green-300',
						'bg-yellow-300',
						'bg-purple-300',
						'bg-pink-300',
					];
					const colorIndex =
						Math.abs(
							params.value
								.split('')
								.reduce(
									(acc: number, char: string) => acc + char.charCodeAt(0),
									0,
								),
						) % 5;

					return (
						<Badge className={`text-xs ${colors[colorIndex]}`}>
							{params.value}
						</Badge>
					);
				},
			},
			{
				headerName: 'Source',
				field: 'account.authConnection.source',
				width: 130,
				filter: 'agTextColumnFilter',
				/** biome-ignore lint/suspicious/noExplicitAny: <ok> */
				cellRenderer: (params: any) => {
					return <span className="text-xs">{params.value}</span>;
				},
			},
			{
				headerName: 'Type',
				field: 'type',
				width: 100,
				filter: 'agTextColumnFilter',
				/** biome-ignore lint/suspicious/noExplicitAny: <ok> */
				cellRenderer: (params: any) => {
					const isBuy = params.value?.toLowerCase() === 'buy';
					const isSell = params.value?.toLowerCase() === 'sell';

					if (isBuy) {
						return (
							<Badge className="text-xs bg-green-500 hover:bg-green-600 text-white">
								{params.value}
							</Badge>
						);
					}
					if (isSell) {
						return (
							<Badge className="text-xs bg-red-500 hover:bg-red-600 text-white">
								{params.value}
							</Badge>
						);
					}
					return <Badge className="text-xs">{params.value}</Badge>;
				},
			},
			{
				headerName: 'Subtype',
				field: 'subtype',
				width: 100,
				filter: 'agTextColumnFilter',
				/** biome-ignore lint/suspicious/noExplicitAny: <ok> */
				cellRenderer: (params: any) => {
					return <span className="text-xs">{params.value}</span>;
				},
			},
			{
				headerName: 'Description',
				field: 'memo',
				flex: 1,
				minWidth: 300,
			},
			{
				headerName: 'Price',
				field: 'price',
				width: 100,
				valueFormatter: (params) => {
					const value = params.value;
					if (value == null) return '';
					const numValue =
						typeof value === 'string' ? parseFloat(value) : value;
					return !Number.isNaN(numValue) ? `$${numValue.toFixed(2)}` : '';
				},
			},
			{
				headerName: 'Quantity',
				field: 'quantity',
				width: 100,
			},
			{
				headerName: 'Amount',
				field: 'amount',
				width: 110,
				valueFormatter: (params) => {
					const value = params.value;
					if (value == null) return '';
					const numValue =
						typeof value === 'string' ? parseFloat(value) : value;
					if (Number.isNaN(numValue)) return '';
					const isNegative = numValue < 0;
					const formattedValue = `$${Math.abs(numValue).toFixed(2)}`;
					return isNegative ? `(${formattedValue})` : formattedValue;
				},
				cellClass: (params) => {
					const numValue =
						typeof params.value === 'string'
							? parseFloat(params.value)
							: params.value;
					return numValue < 0 ? 'text-destructive' : 'text-green-600';
				},
			},
			{
				headerName: 'Fee',
				field: 'fee',
				width: 90,
				valueFormatter: (params) => {
					const value = params.value;
					if (value == null) return '';
					const numValue =
						typeof value === 'string' ? parseFloat(value) : value;
					return !Number.isNaN(numValue) ? `$${numValue.toFixed(2)}` : '';
				},
			},
			{
				headerName: 'External ID',
				field: 'externalId',
				width: 300,
				/** biome-ignore lint/suspicious/noExplicitAny: <ok> */
				cellRenderer: (params: any) => {
					return params.value ? (
						<Badge className="text-xs">{params.value}</Badge>
					) : null;
				},
			},
		] satisfies ColDef[];
	}, []);

	if (error) {
		return (
			<ErrorPage message="Could not load transactions at this time. If this issue persists please contact support" />
		);
	}

	return (
		<PageWrapper>
			<AgGridWrapper loading={loading}>
				<AgGridReact
					columnDefs={columnDefs}
					rowData={data?.transactions}
					rowSelection="single"
					loading={loading}
				/>
			</AgGridWrapper>
		</PageWrapper>
	);
}
