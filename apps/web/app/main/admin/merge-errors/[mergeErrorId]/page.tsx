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
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@repo/ui/components/table';
import { AlertTriangle, ArrowLeft, CheckCircle, Copy, ExternalLink } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { use } from 'react';
import {
	MergeErrorType,
	useMergeErrorQuery,
	useUpdateMergeErrorMutation,
} from '~/generated/gql';
import { TypedRoutes } from '~/lib/routes';
import { PageWrapper } from '~/modules/layout';
import { ErrorPage, LoadingPage } from '~/modules/utility-components';

export default function MergeErrorDetailPage({
	params,
}: {
	params: Promise<{ mergeErrorId: string }>;
}) {
	const router = useRouter();
	const { mergeErrorId } = use(params);

	const { data, error, loading, refetch } = useMergeErrorQuery({
		variables: {
			id: mergeErrorId,
		},
		skip: !mergeErrorId,
	});

	const [updateMultiChangeSet] = useUpdateMergeErrorMutation();

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
	if (error) return <ErrorPage message={'Failed to load merge error'} />;
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

						{changeSet.AssetMerge?.[0]?.plaidMerge?.id && (
							<div className="col-span-2 border-t pt-4">
								<p className="text-sm font-medium text-muted-foreground mb-2">
									Associated Plaid Merge
								</p>
								<Button
									variant="outline"
									size="sm"
									onClick={() => {
										const plaidMergeId = changeSet.AssetMerge?.[0]?.plaidMerge?.id;
										if (plaidMergeId) {
											router.push(TypedRoutes.plaidMerge({ plaidMergeId }));
										}
									}}
								>
									<ExternalLink className="h-4 w-4 mr-2" />
									View Plaid Merge Details
								</Button>
							</div>
						)}
					</CardContent>
				</Card>

				{/* Tabs for Lots Data and Algorithm Parameters */}
				<Tabs defaultValue="lotsData" className="w-full">
					<TabsList>
						<TabsTrigger value="lotsData">Lots Data (JSON)</TabsTrigger>
						{changeSet.lotChangeSetAlgoParams && (
							<TabsTrigger value="algoParams">Algorithm Parameters</TabsTrigger>
						)}
					</TabsList>

					<TabsContent value="lotsData">
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center justify-between">
									<span>Lots Data</span>
									<Button
										size="sm"
										variant="outline"
										onClick={() => {
											navigator.clipboard.writeText(
												JSON.stringify(changeSet.lotsData, null, 2)
											);
											toast.success('Copied lots data to clipboard');
										}}
									>
										<Copy className="h-4 w-4 mr-2" />
										Copy JSON
									</Button>
								</CardTitle>
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

					{changeSet.lotChangeSetAlgoParams && (
						<TabsContent value="algoParams">
							<Card>
								<CardHeader>
									<CardTitle>Algorithm Parameters</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="max-h-[500px] overflow-auto">
										<ReactJson
											src={changeSet.lotChangeSetAlgoParams || {}}
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
					)}
				</Tabs>
			</div>
		</PageWrapper>
	);
}
