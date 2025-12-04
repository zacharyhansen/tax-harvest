'use client';

import NumberFlow from '@number-flow/react';
import { Button } from '@repo/ui/components/button';
import DataTable from '@repo/ui/components/dataTable/dataTable';
import type { ColumnDef } from '@tanstack/react-table';
import {
	ChevronLeft,
	ChevronRight,
	TrendingUp as TrendingUpIcon,
	Trash2,
	TrendingDown,
	TrendingUp,
	X,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { usePortfolioLotsQuery } from '~/generated/gql';
import { TypedRoutes } from '~/lib/routes';
import { Format, isOlderThanOneYear } from '~/modules/utils';
import { DateFormatter } from '~/modules/utils/DateFormatter';
import { useModelState } from './ModelStateProvider';

type ModelLot = {
	id: string;
	assetSymbol: string;
	remainingQty: string;
	price: string;
	acquiredDate: Date;
	asset: {
		lastPrice: string;
	};
};

/**
 * Side panel component displaying lots in the model as a table
 * @example
 * ```tsx
 * <ModelPanel />
 * ```
 */
export function ModelPanel() {
	const router = useRouter();
	const {
		modelLotIds,
		sortedLotIds,
		removeLot,
		deleteModel,
		isPanelOpen,
		setIsPanelOpen,
		isPanelMinimized,
		setIsPanelMinimized,
	} = useModelState();

	const { data } = usePortfolioLotsQuery();

	// Filter lots from query data based on modelLotIds, maintaining sort order
	const modelLots = sortedLotIds
		.map((lotId) => data?.lots.find((lot) => lot.id === lotId))
		.filter(Boolean) as ModelLot[];

	// Auto-open panel when first lot is added
	useEffect(() => {
		if (modelLotIds.length > 0 && !isPanelOpen) {
			setIsPanelOpen(true);
		}
	}, [modelLotIds.length, isPanelOpen, setIsPanelOpen]);

	// Define table columns
	const columns = useMemo<ColumnDef<ModelLot>[]>(
		() => [
			{
				accessorKey: 'assetSymbol',
				header: 'Asset',
				cell: ({ row }) => (
					<span className="font-semibold">{row.original.assetSymbol}</span>
				),
				meta: {
					searchable: true,
				},
				size: 80,
			},
			{
				accessorKey: 'acquiredDate',
				header: 'Purchase Date',
				cell: ({ row }) =>
					DateFormatter.shortDay(row.original.acquiredDate.toString()),
				size: 120,
			},
			{
				accessorKey: 'remainingQty',
				header: 'Quantity',
				cell: ({ row }) => Number(row.original.remainingQty).toFixed(2),
				size: 100,
			},
			{
				accessorKey: 'price',
				header: 'Price Paid',
				cell: ({ row }) => Format.money(Number(row.original.price)),
				size: 100,
			},
			{
				accessorKey: 'return',
				header: 'Return $',
				cell: ({ row }) => {
					const costBasis =
						Number(row.original.remainingQty) * Number(row.original.price);
					const currentValue =
						Number(row.original.remainingQty) *
						Number(row.original.asset.lastPrice);
					const gain = currentValue - costBasis;
					return (
						<div
							className={`flex items-center gap-1 ${gain >= 0 ? 'text-green-600' : 'text-red-600'}`}
						>
							{gain >= 0 ? (
								<TrendingUp className="h-4 w-4" />
							) : (
								<TrendingDown className="h-4 w-4" />
							)}
							<span>{Format.money(gain)}</span>
						</div>
					);
				},
				size: 120,
			},
			{
				accessorKey: 'tax',
				header: 'Tax',
				cell: ({ row }) => {
					const costBasis =
						Number(row.original.remainingQty) * Number(row.original.price);
					const currentValue =
						Number(row.original.remainingQty) *
						Number(row.original.asset.lastPrice);
					const gain = currentValue - costBasis;
					const isLongTerm = isOlderThanOneYear(row.original.acquiredDate);
					const tax = gain * (isLongTerm ? 0.2 : 0.37);
					return Format.money(tax);
				},
				size: 100,
			},
			{
				id: 'actions',
				header: '',
				cell: ({ row }) => (
					<Button
						variant="ghost"
						size="icon"
						onClick={() => removeLot(row.original.id)}
					>
						<X className="h-4 w-4" />
					</Button>
				),
				meta: {
					preventRowClick: true,
				},
				size: 50,
			},
		],
		[removeLot],
	);

	// Don't show panel if not open or if there are no lots in the model
	if (!isPanelOpen || modelLots.length === 0) return null;

	return (
		<>
			{/* Full panel */}
			<div
				className={`fixed right-0 top-12 bottom-0 w-[700px] z-40 border-l bg-background shadow-lg flex flex-col transition-transform duration-300 ease-in-out ${
					isPanelMinimized ? 'translate-x-full' : 'translate-x-0'
				}`}
			>
				{/* Toggle button - attached to panel left edge */}
				<button
					type="button"
					className="absolute left-0 top-8 -translate-x-full z-50 cursor-pointer bg-primary text-primary-foreground px-2 py-8 rounded-l-lg flex flex-col items-center gap-2 hover:bg-primary/90 transition-all duration-300 ease-in-out"
					onClick={() => setIsPanelMinimized(!isPanelMinimized)}
				>
					{isPanelMinimized ? (
						<ChevronLeft className="h-4 w-4 [writing-mode:vertical-rl]" />
					) : (
						<ChevronRight className="h-4 w-4 [writing-mode:vertical-rl]" />
					)}
					<span className="[writing-mode:vertical-rl] rotate-180 text-sm font-semibold">
						Model ({modelLots.length})
					</span>
				</button>

				{/* Header */}
				{(() => {
					const shortTermGains = modelLots.reduce((sum, lot) => {
						const isLongTerm = isOlderThanOneYear(lot.acquiredDate);
						if (isLongTerm) return sum;
						const costBasis = Number(lot.remainingQty) * Number(lot.price);
						const currentValue =
							Number(lot.remainingQty) * Number(lot.asset.lastPrice);
						return sum + (currentValue - costBasis);
					}, 0);

					const longTermGains = modelLots.reduce((sum, lot) => {
						const isLongTerm = isOlderThanOneYear(lot.acquiredDate);
						if (!isLongTerm) return sum;
						const costBasis = Number(lot.remainingQty) * Number(lot.price);
						const currentValue =
							Number(lot.remainingQty) * Number(lot.asset.lastPrice);
						return sum + (currentValue - costBasis);
					}, 0);

					// Simple tax calculation: 37% for short-term, 20% for long-term
					const projectedTaxBill =
						shortTermGains * 0.37 + longTermGains * 0.2;

					return (
						<div className="border-b p-4 space-y-3">
							<div className="flex items-center justify-between">
								<h2 className="text-lg font-semibold">Tax Model</h2>
								<div className="text-right">
									<div className="text-xs text-muted-foreground">
										Projected Tax Bill
									</div>
									<div className="text-2xl font-bold">
										<NumberFlow
											value={projectedTaxBill}
											format={{
												style: 'currency',
												currency: 'USD',
												minimumFractionDigits: 2,
												maximumFractionDigits: 2,
											}}
										/>
									</div>
								</div>
							</div>
							{modelLots.length > 0 && (
								<>
									<div className="flex items-center justify-between text-sm">
										<span>Short Term Gains</span>
										<span className="font-semibold">
											<NumberFlow
												value={shortTermGains}
												format={{
													style: 'currency',
													currency: 'USD',
													minimumFractionDigits: 2,
													maximumFractionDigits: 2,
												}}
											/>
										</span>
									</div>
									<div className="flex items-center justify-between text-sm">
										<span>Long Term Gains</span>
										<span className="font-semibold">
											<NumberFlow
												value={longTermGains}
												format={{
													style: 'currency',
													currency: 'USD',
													minimumFractionDigits: 2,
													maximumFractionDigits: 2,
												}}
											/>
										</span>
									</div>
								</>
							)}
						</div>
					);
				})()}

				{/* Table */}
				<div className="flex-1 overflow-auto p-4">
					<DataTable
						columns={columns}
						data={modelLots}
						noResultsAlert={
							<div className="text-center text-muted-foreground py-8">
								<p>No lots in model</p>
								<p className="text-sm mt-2">
									Hover over lots in the table to add them
								</p>
							</div>
						}
						className="h-full"
						enableRowAnimations
					/>
				</div>

				{/* Footer */}
				{modelLots.length > 0 && (
					<div className="border-t p-4 flex justify-between">
						<Button
							variant="default"
							size="sm"
							onClick={() => router.push(TypedRoutes.autoInvesting())}
						>
							<TrendingUpIcon className="h-4 w-4 mr-2" />
							Auto Invest
						</Button>
						<Button variant="destructive" size="sm" onClick={deleteModel}>
							<Trash2 className="h-4 w-4 mr-2" />
							Delete Model
						</Button>
					</div>
				)}
			</div>
		</>
	);
}
