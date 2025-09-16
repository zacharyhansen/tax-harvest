'use client';

import { Badge } from '@repo/ui/components/badge';
import DataTable from '@repo/ui/components/dataTable/dataTable';
import type { ColumnDef } from '@tanstack/react-table';
import { createColumnHelper } from '@tanstack/react-table';
import type { LotItemFragment } from '~/generated/gql';
import { usePortfolioLotsQuery } from '~/generated/gql';
import { ErrorPage, LoadingPage } from '~/modules/utility-components';
import { Format, isOlderThanOneYear } from '~/modules/utils';

const columnHelper = createColumnHelper<LotItemFragment>();

const columnDef: ColumnDef<LotItemFragment, never>[] = [
	columnHelper.accessor('assetSymbol', {
		enableGrouping: true,
		header: 'Asset',
		meta: {
			searchable: true,
		},
		size: 130,
	}),
	columnHelper.accessor('acquiredDate', {
		cell: (props) => <DataTable.DateCell {...props} />,
		header: 'Purchase Date',
		size: 140,
	}),
	columnHelper.accessor('acquiredDate', {
		cell: ({ getValue }) => {
			const isLongTermGains = isOlderThanOneYear(getValue());
			return (
				<Badge variant={isLongTermGains ? 'default' : 'secondary'}>
					{isLongTermGains ? 'Long Term' : 'Short Term'}
				</Badge>
			);
		},
		header: 'Capital Gain',
		id: 'taxType',
		size: 130,
	}),
	columnHelper.accessor('remainingQty', {
		aggregationFn: 'sumDecimal',
		cell: (props) => Number(props.row.original.remainingQty).toFixed(2),
		footer: ({ table }) => {
			const total = table
				.getFilteredRowModel()
				.rows.reduce(
					(sum, row) => sum + Number(row.getValue<string>('remainingQty') || 0),
					0,
				)
				.toFixed(2);
			return <DataTable.FooterCell label="Total" value={total} />;
		},
		header: 'Quantity',
		size: 110,
	}),
	columnHelper.accessor('price', {
		aggregationFn: 'avgPricePaid',
		cell: (props) => <DataTable.MoneyCell {...props} colored={false} />,
		header: 'Price Paid',
		size: 120,
	}),
	columnHelper.accessor(
		(row) => Number(Number(row.remainingQty || 0) * Number(row.price || 0)),
		{
			aggregationFn: 'sumMoney',
			cell: (props) => <DataTable.MoneyCell {...props} colored={false} />,
			footer: ({ table }) => {
				const total = table
					.getFilteredRowModel()
					.rows.reduce(
						(sum, row) =>
							sum +
							Number(row.getValue<string>('remainingQty') || 0) *
								row.getValue<number>('price'),
						0,
					);
				return (
					<DataTable.FooterCell
						label="Total Cost Basis"
						value={Format.money(total)}
					/>
				);
			},
			header: 'Cost Basis',
			id: 'costBasis',
			size: 120,
		},
	),

	columnHelper.accessor(
		(row) =>
			Number(
				Number(row.remainingQty || 0) * Number(row.asset.lastPrice || 0),
			).toFixed(2),
		{
			aggregationFn: 'sumMoney',
			cell: (props) => <DataTable.MoneyCell {...props} colored={false} />,
			footer: ({ table }) => {
				const total = table
					.getFilteredRowModel()
					.rows.reduce(
						(sum, row) => sum + Number(row.getValue<string>('value') || 0),
						0,
					)
					.toFixed(2);
				return (
					<DataTable.FooterCell
						label="Total Value"
						value={Format.money(total)}
					/>
				);
			},
			header: 'Total Value',
			id: 'value',
			size: 120,
		},
	),
	columnHelper.accessor(
		(row) => {
			const cost = Number(row.remainingQty || 0) * Number(row.price || 0);
			const value =
				Number(row.remainingQty || 0) * Number(row.asset.lastPrice || 0);
			return value - cost;
		},
		{
			aggregationFn: 'sumMoney',
			cell: DataTable.MoneyCell,
			header: 'Total Gain',
			id: 'totalGain',
			footer: ({ table }) => {
				const total = table
					.getFilteredRowModel()
					.rows.reduce(
						(sum, row) => sum + Number(row.getValue<string>('totalGain') || 0),
						0,
					)
					.toFixed(2);
				return (
					<DataTable.FooterCell
						label="Total Gain"
						value={Format.money(total)}
					/>
				);
			},
			size: 130,
		},
	),
	columnHelper.accessor('totalCostForGainPct', {
		aggregationFn: 'totalGainPct',
		cell: (props) => (
			<DataTable.PercentCell
				{...props}
				value={
					(Number(props.row.getValue('totalGain')) /
						Number(props.row.getValue('costBasis'))) *
					100
				}
			/>
		),
		header: 'Total Gain %',
		size: 130,
	}),
	// columnHelper.accessor("gainDay", {
	//   cell: DataTable.MoneyCell,
	//   header: "Day's P/L",
	//   size: 110,
	// }),
	columnHelper.accessor('account', {
		cell: ({ getValue }) => {
			const account = getValue<{
				name?: string;
				externalId?: string;
			}>();
			return (
				<span>{account.name ?? Format.hideNumbers(account.externalId)}</span>
			);
		},
		header: 'Account',
		size: 310,
	}),
];

export default function LotsTable() {
	const { data, error, loading } = usePortfolioLotsQuery();

	if (loading) {
		return <LoadingPage />;
	}

	if (error) {
		return <ErrorPage message={error.message} />;
	}

	return (
		<DataTable
			columns={columnDef}
			data={data?.lots ?? []}
			noResultsAlert="This portfolio has no positions."
			loading={loading}
			error={!!error}
			initialState={{
				expanded: true,
				grouping: ['assetSymbol'],
				pagination: {
					pageIndex: 0,
					pageSize: data?.lots.length ?? 0,
				},
				sorting: [{ id: 'acquiredDate', desc: false }],
			}}
			customAggregationFns={{
				avgPricePaid: (_columnId, leafRows) => {
					let totalQuantity = 0;
					let totalPaid = 0;
					leafRows.forEach((row) => {
						const qty = Number(row.original.remainingQty) || 0;
						totalQuantity += qty;
						totalPaid += (Number(row.original.price) || 0) * qty;
					});
					return Format.money(totalPaid / totalQuantity, 2);
				},
				totalGainPct: (_columnId, leafRows) => {
					let totalGain = 0;
					let totalPaid = 0;
					leafRows.forEach((row) => {
						totalGain += Number(row.getValue('totalGain')) || 0;
						totalPaid += Number(row.getValue('costBasis')) || 0;
					});
					return new Intl.NumberFormat('en-US', {
						maximumFractionDigits: 2,
						style: 'percent',
					}).format(totalGain / totalPaid);
				},
			}}
		/>
	);
}
