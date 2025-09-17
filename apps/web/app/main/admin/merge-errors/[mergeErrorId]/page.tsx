'use client';

import ReactJson from '@microlink/react-json-view';
import { Button } from '@repo/ui/components/button';
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from '@repo/ui/components/card';
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from '@repo/ui/components/tabs';
import { toast } from '@repo/ui/components/toast-sonner';
import type { ColDef } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { AlertTriangle, ArrowLeft, CheckCircle, FileText } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import {
	MergeErrorType,
	type MultiChangeSetDetailFragment,
	useMergeErrorQuery,
	useUpdateMergeErrorMutation,
} from '~/generated/gql';
import { TypedRoutes } from '~/lib/routes';
import { PageWrapper } from '~/modules/layout';
import { ErrorPage, LoadingPage } from '~/modules/utility-components';

const AgGridWrapper = dynamic(
	() => import('~/modules/client-ag-grid/ag-grid-wrapper'),
	{
		ssr: false,
	},
);

export default function MergeErrorDetailPage({
	params,
}: {
	params: { mergeErrorId: string };
}) {
	const router = useRouter();
	const mergeErrorId = params.mergeErrorId;

	const { data, error, loading, refetch } = useMergeErrorQuery({
		variables: {
			id: mergeErrorId,
		},
		skip: !mergeErrorId,
	});

	const [updateMultiChangeSet] = useUpdateMergeErrorMutation();

	const columnDefs: ColDef<
		NonNullable<
			NonNullable<
				MultiChangeSetDetailFragment['multiChangeSetOption']
			>[number]['multiChangeSetOptionItem']
		>[number]
	>[] = useMemo(() => {
		return [
			{
				headerName: 'Lot ID',
				field: 'lotId',
				width: 150,
			},
			{
				headerName: 'Acquired Date',
				field: 'acquiredDate',
				width: 150,
			},
			{
				headerName: 'Is New Buy',
				field: 'isNewBuy',
				width: 120,
			},
			{
				headerName: 'Price',
				field: 'price',
				width: 120,
			},
			{
				headerName: 'Quantity Change',
				field: 'quantityChange',
				width: 150,
			},
			{
				headerName: 'Final Quantity',
				field: 'quantityFinal',
				width: 150,
			},
		];
	}, []);

	const handleToggleResolved = async () => {
		if (!data?.mergeError) return;

		try {
			const newResolvedStatus = !data.mergeError.resolved;
			await toast.promise(
				updateMultiChangeSet({
					variables: {
						id: mergeErrorId,
						data: {
							resolved: { set: newResolvedStatus },
						},
					},
				}),
				{
					loading: 'Updating status...',
					success: `Marked as ${newResolvedStatus ? 'resolved' : 'unresolved'}`,
					error: 'Failed to update status',
				},
			);
			refetch();
		} catch (err) {
			console.error('Error updating status:', err);
		}
	};

	if (loading) return <LoadingPage />;
	if (error) return <ErrorPage message={JSON.stringify(error)} />;
	if (!data?.mergeError)
		return <ErrorPage message="MultiChangeSet not found" />;

	const changeSet = data.mergeError;

	return (
		<PageWrapper
			title="Merge Error Details"
			description={
				<div className="flex items-center gap-4">
					<Button
						onClick={() => router.push(TypedRoutes.mergeErrors())}
						variant="outline"
						size="sm"
					>
						<ArrowLeft className="h-4 w-4 mr-2" />
						Back to List
					</Button>
					<span className="text-sm text-muted-foreground">
						ID: {mergeErrorId}
					</span>
				</div>
			}
		>
			<div className="space-y-6">
				{/* Main Details Card */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center justify-between">
							<span>Merge Error Information</span>
							<div className="flex items-center gap-2">
								<Button
									onClick={handleToggleResolved}
									variant={changeSet.resolved ? 'outline' : 'default'}
									size="sm"
								>
									{changeSet.resolved
										? 'Mark as Unresolved'
										: 'Mark as Resolved'}
								</Button>
								{changeSet.type === MergeErrorType.PlaidMultiLotSolution ? (
									<span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
										Multi Lot Solution
									</span>
								) : (
									<span className="inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-700">
										No Solution Found
									</span>
								)}
								{changeSet.resolved ? (
									<span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
										<CheckCircle className="h-4 w-4 mr-1" />
										Resolved
									</span>
								) : (
									<span className="inline-flex items-center rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-700">
										<AlertTriangle className="h-4 w-4 mr-1" />
										Unresolved
									</span>
								)}
							</div>
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-2 gap-4">
							<div>
								<p className="text-sm font-medium text-muted-foreground">
									Error Type
								</p>
								<p className="text-base">
									{changeSet.type === MergeErrorType.PlaidMultiLotSolution
										? 'Multiple Lot Solutions Available'
										: 'No Valid Solution Found'}
								</p>
							</div>
							<div>
								<p className="text-sm font-medium text-muted-foreground">
									Asset
								</p>
								<p className="text-base">{changeSet.assetSymbol}</p>
							</div>
							<div>
								<p className="text-sm font-medium text-muted-foreground">
									Target Value
								</p>
								<p className="text-base">
									{changeSet.targetValue
										? new Intl.NumberFormat('en-US', {
												style: 'currency',
												currency: 'USD',
											}).format(Number(changeSet.targetValue))
										: 'N/A'}
								</p>
							</div>
							<div>
								<p className="text-sm font-medium text-muted-foreground">
									Target Quantity
								</p>
								<p className="text-base">
									{changeSet.targetQuantity
										? Number(changeSet.targetQuantity).toFixed(4)
										: 'N/A'}
								</p>
							</div>
							<div>
								<p className="text-sm font-medium text-muted-foreground">
									Created At
								</p>
								<p className="text-base">
									{new Date(changeSet.createdAt).toLocaleString()}
								</p>
							</div>
							<div>
								<p className="text-sm font-medium text-muted-foreground">
									Updated At
								</p>
								<p className="text-base">
									{new Date(changeSet.updatedAt).toLocaleString()}
								</p>
							</div>
						</div>

						<div className="col-span-2 border-t pt-4">
							<p className="text-sm font-medium text-muted-foreground">
								Associated Log
							</p>
							<div className="flex items-center gap-4 mt-2">
								<Button
									onClick={() =>
										router.push(
											TypedRoutes.log({ logId: Number(changeSet.log.id) }),
										)
									}
									variant="link"
									size="sm"
								>
									<FileText className="h-4 w-4 mr-2" />
									<span className="text-base">Log ID: {changeSet.log.id}</span>
								</Button>
								<span>
									Type: {changeSet.log.type} | Status:{' '}
									{changeSet.log.responseStatus || 'N/A'}
								</span>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Tabs for Options and Lots Data */}
				<Tabs
					defaultValue={
						changeSet.type === MergeErrorType.PlaidMultiLotSolution
							? 'options'
							: 'lotsData'
					}
					className="w-full"
				>
					<TabsList>
						{changeSet.type === MergeErrorType.PlaidMultiLotSolution && (
							<TabsTrigger value="options">
								Solution Options ({changeSet.multiChangeSetOption?.length || 0})
							</TabsTrigger>
						)}
						<TabsTrigger value="lotsData">Lots Data (JSON)</TabsTrigger>
					</TabsList>

					{changeSet.type === MergeErrorType.PlaidMultiLotSolution && (
						<TabsContent value="options">
							{changeSet.multiChangeSetOption?.length ? (
								changeSet.multiChangeSetOption.map((option) => (
									<Card key={option.id}>
										<CardHeader>
											<CardTitle>Lot Adjustment Options</CardTitle>
										</CardHeader>
										<CardContent>
											{option.multiChangeSetOptionItem && (
												<div style={{ height: '400px', width: '100%' }}>
													<AgGridWrapper>
														<AgGridReact
															rowData={option.multiChangeSetOptionItem || []}
															columnDefs={columnDefs}
															defaultColDef={{
																sortable: true,
																resizable: true,
																filter: true,
															}}
															animateRows={true}
															domLayout="normal"
														/>
													</AgGridWrapper>
												</div>
											)}
										</CardContent>
									</Card>
								))
							) : (
								<Card>
									<CardContent className="text-center py-8">
										<p className="text-muted-foreground">
											No solution options available
										</p>
									</CardContent>
								</Card>
							)}
						</TabsContent>
					)}

					<TabsContent value="lotsData">
						<Card>
							<CardHeader>
								<CardTitle>Lots Data</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="max-h-[500px] overflow-auto">
									<ReactJson
										src={changeSet.lotsData || {}}
										theme="monokai"
										collapsed={1}
										displayDataTypes={false}
										displayObjectSize={true}
										enableClipboard={true}
									/>
								</div>
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>
			</div>
		</PageWrapper>
	);
}
