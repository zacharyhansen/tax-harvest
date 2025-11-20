'use client';

import { Badge } from '@repo/ui/components/badge';
import { Button } from '@repo/ui/components/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@repo/ui/components/card';
import { Skeleton } from '@repo/ui/components/skeleton';
import type { ColDef } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import {
	ChevronDown,
	ChevronRight,
	TrendingDown,
	TrendingUp,
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { useCallback, useEffect, useMemo, useState } from 'react';

import {
	type AccountPnlHistoryItemFragment,
	useAccountsWithPnlQuery,
	useAccountWithPnlHistoryQuery,
} from '~/generated/gql';
import { formatCurrency } from '~/lib/utils';
import { PageWrapper } from '~/modules/layout';
import { ErrorPage } from '~/modules/utility-components';

const AgGridWrapper = dynamic(
	() => import('~/modules/client-ag-grid/ag-grid-wrapper'),
	{
		ssr: false,
	},
);

/**
 * Displays Account P&L History for all accounts
 * Shows a card per account with expandable table of AccountRealizedPAndLHistory
 * @returns Account P&L History page component
 */
export default function AccountPnlHistoryPage() {
	const [expandedAccounts, setExpandedAccounts] = useState<Set<string>>(
		new Set(),
	);
	const {
		data: accountsData,
		loading: accountsLoading,
		error: accountsError,
	} = useAccountsWithPnlQuery();

	useEffect(() => {
		setExpandedAccounts(
			new Set(
				accountsData?.accounts?.[0]?.id
					? [accountsData?.accounts?.[0]?.id]
					: [],
			),
		);
	}, [accountsData]);

	const toggleAccount = useCallback((accountId: string) => {
		setExpandedAccounts((prev) => {
			const newSet = new Set(prev);
			if (newSet.has(accountId)) {
				newSet.delete(accountId);
			} else {
				newSet.add(accountId);
			}
			return newSet;
		});
	}, []);

	if (accountsError) {
		return <ErrorPage message={accountsError.toString()} />;
	}

	return (
		<PageWrapper
			title="Account P&L History"
			description="View realized profit and loss history for all accounts"
			className="h-screen pb-20"
		>
			<div className="grid gap-4">
				{accountsLoading ? (
					<>
						<Skeleton className="h-32 w-full" />
						<Skeleton className="h-32 w-full" />
						<Skeleton className="h-32 w-full" />
					</>
				) : (
					accountsData?.accounts?.map((account) => (
						<Card key={account.id} className="overflow-hidden">
							<CardHeader
								className="cursor-pointer select-none hover:bg-muted/50 transition-colors"
								onClick={() => toggleAccount(account.id)}
							>
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2">
										<Button variant="ghost" size="icon" className="h-6 w-6">
											{expandedAccounts.has(account.id) ? (
												<ChevronDown className="h-4 w-4" />
											) : (
												<ChevronRight className="h-4 w-4" />
											)}
										</Button>
										<div>
											<CardTitle className="text-lg">{account.name}</CardTitle>
											<CardDescription className="mt-1">
												{account.portfolioConnect?.plaidInstitution.name && (
													<span>
														{account.portfolioConnect?.plaidInstitution.name} •{' '}
													</span>
												)}
												<Badge variant="secondary" className="text-xs">
													{account.type}
												</Badge>
												{account._count?.accountRealizedPAndLHistory > 0 && (
													<span className="ml-2 text-sm text-muted-foreground">
														{account._count.accountRealizedPAndLHistory} P&L
														records
													</span>
												)}
											</CardDescription>
										</div>
									</div>
								</div>
							</CardHeader>
							{expandedAccounts.has(account.id) && (
								<CardContent className="pt-0">
									<AccountPnlHistoryTable accountId={account.id} />
								</CardContent>
							)}
						</Card>
					))
				)}
			</div>
		</PageWrapper>
	);
}

/**
 * Table component displaying P&L history for a specific account
 * @param accountId - The ID of the account to display history for
 * @returns AgGrid table with P&L history
 */
function AccountPnlHistoryTable({ accountId }: { accountId: string }) {
	const { data, loading, error } = useAccountWithPnlHistoryQuery({
		variables: {
			accountId,
		},
	});

	const columnDefs: ColDef<AccountPnlHistoryItemFragment>[] = useMemo(() => {
		return [
			{
				headerName: 'Date',
				field: 'createdAt',
				width: 200,
				sort: 'desc',
				valueGetter: (params) => {
					return new Date(params.data?.createdAt).toLocaleString('en-US', {
						year: 'numeric',
						month: 'numeric',
						day: 'numeric',
						hour: 'numeric',
						minute: 'numeric',
					});
				},
			},
			{
				headerName: 'Type',
				field: 'profitAndLossType',
				width: 250,
				// biome-ignore lint/suspicious/noExplicitAny: <ok>
				cellRenderer: (params: any) => {
					const type = params.value;
					return (
						<Badge
							variant={type === 'REALIZED_GAIN' ? 'default' : 'destructive'}
						>
							{type}
						</Badge>
					);
				},
			},
			{
				headerName: 'Value',
				field: 'value',
				width: 150,
				cellDataType: 'number',
				// biome-ignore lint/suspicious/noExplicitAny: <ok>
				cellRenderer: (params: any) => {
					const value = Number(params.value || 0);
					const isPositive = value >= 0;
					return (
						<div
							className={`flex items-center gap-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}
						>
							{isPositive ? (
								<TrendingUp className="h-4 w-4" />
							) : (
								<TrendingDown className="h-4 w-4" />
							)}
							<span className="font-medium">{formatCurrency(value)}</span>
						</div>
					);
				},
			},
			{
				headerName: 'Transaction',
				field: 'transaction.memo',
				minWidth: 200,
				flex: 1,
			},
			{
				headerName: 'Symbol',
				field: 'transaction.assetSymbol',
				width: 100,
			},
			{
				headerName: 'Quantity',
				field: 'transaction.quantity',
				width: 100,
				cellDataType: 'number',
			},
			{
				headerName: 'Price',
				field: 'transaction.price',
				width: 100,
				cellDataType: 'number',
				// biome-ignore lint/suspicious/noExplicitAny: <ok>
				cellRenderer: (params: any) => formatCurrency(params.value),
			},
			{
				headerName: 'Transaction Date',
				field: 'transaction.transactionDate',
				cellDataType: 'dateString',
				width: 150,
			},
			{
				headerName: 'Target Value',
				valueGetter: (params) => {
					const merges = params.data?.transaction?.transactionOnAssetMerge;
					if (merges && merges.length > 0) {
						return merges?.[0]?.assetMerge?.targetValue || 0;
					}
					return 0;
				},
				width: 120,
				cellDataType: 'number',
				// biome-ignore lint/suspicious/noExplicitAny: <ok>
				cellRenderer: (params: any) => {
					const value = params.value;
					return value && value !== 0 ? formatCurrency(value) : '-';
				},
			},
			{
				headerName: 'Target Quantity',
				valueGetter: (params) => {
					const merges = params.data?.transaction?.transactionOnAssetMerge;
					if (merges && merges.length > 0) {
						return merges?.[0]?.assetMerge?.targetQuantity || 0;
					}
					return 0;
				},
				width: 120,
				cellDataType: 'number',
				// biome-ignore lint/suspicious/noExplicitAny: <ok>
				cellRenderer: (params: any) => {
					const value = params.value;
					return value && value !== 0 ? value.toLocaleString() : '-';
				},
			},
			{
				headerName: 'Merge ID',
				field: 'plaidMerge.id',
				width: 300,
			},
		];
	}, []);

	if (error) {
		return (
			<div className="p-4 text-sm text-destructive">
				Error loading P&L history: {error.message}
			</div>
		);
	}

	if (loading) {
		return <Skeleton className="h-64 w-full" />;
	}

	if (!data?.account?.accountRealizedPAndLHistory?.length) {
		return (
			<div className="p-4 text-sm text-muted-foreground">
				No P&L history found for this account
			</div>
		);
	}

	return (
		<AgGridWrapper height={1000}>
			<AgGridReact
				rowData={data.account.accountRealizedPAndLHistory}
				columnDefs={columnDefs}
				animateRows
				pagination
				paginationPageSize={20}
			/>
		</AgGridWrapper>
	);
}
