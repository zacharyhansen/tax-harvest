'use client';

import ReactJson from '@microlink/react-json-view';
import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@repo/ui/components/alert-dialog';
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
import { AlertTriangle, ArrowLeft, CheckCircle } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import {
	type MultiChangeSetDetailFragment,
	useMultiChangeSetQuery,
	useUpdateMultiChangeSetMutation,
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

	const { data, error, loading, refetch } = useMultiChangeSetQuery({
		variables: {
			id: parseInt(mergeErrorId, 10),
		},
		skip: !mergeErrorId,
	});

	const [updateMultiChangeSet] = useUpdateMultiChangeSetMutation();

	const columnDefs: ColDef<
		NonNullable<
			NonNullable<
				MultiChangeSetDetailFragment['MultiChangeSetOption']
			>[number]['MultiChangeSetOptionItem']
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
		if (!data?.multiChangeSet) return;

		try {
			const newResolvedStatus = !data.multiChangeSet.resolved;
			await toast.promise(
				updateMultiChangeSet({
					variables: {
						id: parseInt(mergeErrorId, 10),
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
	if (!data?.multiChangeSet)
		return <ErrorPage message="MultiChangeSet not found" />;

	const changeSet = data.multiChangeSet;

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
							<span>MultiChangeSet Information</span>
							<div className="flex items-center gap-2">
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
						</div>

						<div className="mt-6 flex gap-2">
							<Button
								onClick={handleToggleResolved}
								variant={changeSet.resolved ? 'outline' : 'default'}
							>
								{changeSet.resolved ? 'Mark as Unresolved' : 'Mark as Resolved'}
							</Button>
							<AlertDialog>
								<AlertDialogTrigger asChild>
									<Button variant="destructive">Delete</Button>
								</AlertDialogTrigger>
								<AlertDialogContent>
									<AlertDialogHeader>
										<AlertDialogTitle>Are you sure?</AlertDialogTitle>
										<AlertDialogDescription>
											This action cannot be undone. This will permanently delete
											the MultiChangeSet record.
										</AlertDialogDescription>
									</AlertDialogHeader>
									<AlertDialogFooter>
										<AlertDialogCancel>Cancel</AlertDialogCancel>
									</AlertDialogFooter>
								</AlertDialogContent>
							</AlertDialog>
						</div>
					</CardContent>
				</Card>

				{/* Tabs for Options and Lots Data */}
				<Tabs defaultValue="options" className="w-full">
					<TabsList>
						<TabsTrigger value="options">
							Related Options ({changeSet.MultiChangeSetOption?.length || 0})
						</TabsTrigger>
						<TabsTrigger value="lotsData">Lots Data (JSON)</TabsTrigger>
					</TabsList>

					<TabsContent value="options">
						{changeSet.MultiChangeSetOption?.map((option) => (
							<Card key={option.id}>
								<CardHeader>
									<CardTitle>MultiChangeSet Options</CardTitle>
								</CardHeader>
								<CardContent>
									{option.MultiChangeSetOptionItem && (
										<div style={{ height: '400px', width: '100%' }}>
											<AgGridWrapper>
												<AgGridReact
													rowData={option.MultiChangeSetOptionItem || []}
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
						))}
					</TabsContent>

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
