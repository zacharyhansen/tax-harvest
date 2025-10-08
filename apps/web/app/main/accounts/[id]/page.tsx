'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@repo/ui/components/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@repo/ui/components/card';
import { Separator } from '@repo/ui/components/separator';
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from '@repo/ui/components/tabs';
import { toast } from '@repo/ui/components/toast-sonner';
import InputField from '@repo/ui/form-builder/fields/input.field';
import { useStandardForm } from '@repo/ui/hooks/use-standard-form';
import {
	DollarSign,
	FileText,
	Settings,
	Trash2,
	TrendingUp,
	Upload,
	Wallet,
} from 'lucide-react';
import { use } from 'react';
import { FormProvider } from 'react-hook-form';
import { z } from 'zod';
import type { AccountItemFragment } from '~/generated/gql';
import {
	useAccountQuery,
	useInsertAccountRealizedPAndLMutation,
	useUpdateAccountMutation,
} from '~/generated/gql';
import { EtradeCSVUpload } from '~/modules/fileUpload';
import { PageWrapper } from '~/modules/layout';
import { ErrorPage, LoadingPage } from '~/modules/utility-components';
import { Format } from '~/modules/utils';
import { zodNumber } from '~/modules/utils/zod-utils';
import AccountFilesTable from './AccountFilesTable';
import AccountLotsTable from './AccountLotsTable';
import DeleteAccountDialog from './DeleteAccountDialog';
import LotUploadTable from './LotUploadTable';

export default function AccountPage(props: {
	params: Promise<{ id: string }>;
}) {
	const params = use(props.params);
	const { id } = params;
	const { data, error, loading } = useAccountQuery({
		variables: { id },
	});

	if (error) {
		return (
			<ErrorPage
				message="Could not load account at this time. If this issue persists please
          contact support @support"
			/>
		);
	}

	if (loading || !data?.account) {
		return <LoadingPage message="Loading account details..." />;
	}

	return (
		<PageWrapper className="max-w-7xl">
			<AccountDetails account={data.account} />
		</PageWrapper>
	);
}

const accountFormSchema = z.object({
	description: z.string().nullable().optional(),
	dividend: zodNumber,
	longTermCapitalGain: zodNumber,
	shortTermCapitalGain: zodNumber,
});

function AccountDetails({ account }: { account: AccountItemFragment }) {
	return (
		<div className="space-y-6">
			{/* Account Header */}
			<div className="space-y-4">
				<div className="flex items-center space-x-3">
					<div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-lg">
						<Wallet className="text-primary h-6 w-6" />
					</div>
					<div>
						<h1 className="text-3xl font-bold tracking-tight">
							{account.name}
						</h1>
						<p className="text-muted-foreground">
							{account.type} • {account.provider} •{' '}
							{account.portfolioConnect.plaidInstitution.name}
						</p>
					</div>
				</div>

				{/* Account Summary Card */}
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Value</CardTitle>
						<TrendingUp className="text-muted-foreground h-4 w-4" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{Format.money(account.current || 0)}
						</div>
					</CardContent>
				</Card>
			</div>

			<Separator />

			{/* Tabs Section */}
			<Tabs defaultValue="settings" className="space-y-4">
				<TabsList>
					<TabsTrigger value="settings">Settings</TabsTrigger>
					<TabsTrigger value="lots">Lots</TabsTrigger>
					<TabsTrigger value="upload-lots">Upload Lots</TabsTrigger>
					<TabsTrigger value="all-files">All Files</TabsTrigger>
				</TabsList>

				<TabsContent value="lots" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle>Lots</CardTitle>
							<CardDescription>
								View all lots for this account including purchase dates,
								quantities, and gains.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<AccountLotsTable accountId={account.id} />
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="upload-lots" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center space-x-2">
								<Upload className="h-5 w-5" />
								<span>Upload Lot Data</span>
							</CardTitle>
							<CardDescription>
								Upload transaction data from your brokerage to keep your lots up
								to date.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<EtradeCSVUpload accountId={account.id} />
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className="flex items-center space-x-2">
								<FileText className="h-5 w-5" />
								<span>Lot Uploads</span>
							</CardTitle>
							<CardDescription>
								View and manage lot uploads for this account.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<LotUploadTable accountId={account.id} />
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="all-files" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center space-x-2">
								<FileText className="h-5 w-5" />
								<span>All Files</span>
							</CardTitle>
							<CardDescription>
								View and download all files attached to this account.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<AccountFilesTable accountId={account.id} />
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="settings" className="space-y-4">
					<AccountSettingsForm account={account} />
				</TabsContent>
			</Tabs>
		</div>
	);
}

function AccountSettingsForm({ account }: { account: AccountItemFragment }) {
	const [update, { loading }] = useUpdateAccountMutation({
		onError: () => {
			toast.error('Unable to update account.');
		},
	});

	const [insertRealizedPAndL, { loading: loadingInsertRealizedPAndL }] =
		useInsertAccountRealizedPAndLMutation({
			onError: () => {
				toast.error('Unable to update account.');
			},
		});

	const { form, handleSubmit } = useStandardForm<
		z.infer<typeof accountFormSchema>
	>({
		defaultValues: {
			description: account.description ?? '',
			dividend: Number(account._realizedProfitAndLoss.dividend),
			longTermCapitalGain: Number(
				account._realizedProfitAndLoss.longTermCapitalGain,
			),
			shortTermCapitalGain: Number(
				account._realizedProfitAndLoss.shortTermCapitalGain,
			),
		},
		resolver: zodResolver(accountFormSchema),
		handleSubmit: ({
			description,
			dividend,
			longTermCapitalGain,
			shortTermCapitalGain,
		}) => {
			return toast.promise(
				Promise.all([
					update({
						variables: {
							accountUpdateInput: {
								description: {
									set: description,
								},
								setRealizedValues: {
									set: true,
								},
							},
							accountWhereUniqueInput: {
								id: account.id,
							},
						},
					}),
					insertRealizedPAndL({
						variables: {
							input: {
								account: {
									connect: {
										id: account.id,
									},
								},
								portfolio: {
									connect: {
										id: account.portfolioId,
									},
								},
								dividend: dividend.toString(),
								longTermCapitalGain: longTermCapitalGain.toString(),
								shortTermCapitalGain: shortTermCapitalGain.toString(),
							},
						},
					}),
				]).then(([updateAccount, insertRealizedPAndL]) => {
					form.reset({
						description: updateAccount.data?.updateAccount.description,
						dividend: Number(
							insertRealizedPAndL.data?.insertRealizedPAndL.dividend,
						),
						longTermCapitalGain: Number(
							insertRealizedPAndL.data?.insertRealizedPAndL.longTermCapitalGain,
						),
						shortTermCapitalGain: Number(
							insertRealizedPAndL.data?.insertRealizedPAndL
								.shortTermCapitalGain,
						),
					});
				}),
				{
					error: 'Error',
					loading: 'Saving',
					success: 'Saved',
				},
			);
		},
	});

	return (
		<FormProvider {...form}>
			<div className="space-y-6">
				<div className="grid gap-6 md:grid-cols-2">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center space-x-2">
								<Settings className="h-5 w-5" />
								<span>Account Settings</span>
							</CardTitle>
							<CardDescription>
								Manage your account details and description.
							</CardDescription>
						</CardHeader>
						<form onSubmit={handleSubmit} noValidate={true}>
							<CardContent className="space-y-4">
								<InputField name="description" label="Description" />
							</CardContent>
						</form>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className="flex items-center space-x-2">
								<TrendingUp className="h-5 w-5" />
								<span>Calendar Year Financials</span>
							</CardTitle>
							<CardDescription>
								Manually adjust realized gains and losses for this account.
							</CardDescription>
						</CardHeader>
						<form onSubmit={handleSubmit} noValidate={true}>
							<CardContent className="space-y-4">
								<InputField
									startIcon={DollarSign}
									name="shortTermCapitalGain"
									label="Short Term Realized P & L"
									type="number"
								/>
								<InputField
									startIcon={DollarSign}
									name="longTermCapitalGain"
									label="Long Term Realized P & L"
									type="number"
								/>
								<InputField
									startIcon={DollarSign}
									name="dividend"
									label="Dividend"
									type="number"
								/>
								<Button
									type="submit"
									className="w-full"
									disabled={!form.formState.isDirty}
									loading={loading || loadingInsertRealizedPAndL}
								>
									Save Changes
								</Button>
							</CardContent>
						</form>
					</Card>
				</div>

				{/* Danger Zone - Only show for UNCONNECTED accounts */}
				{account.provider === 'UNCONNECTED' && (
					<Card className="border-destructive/20">
						<CardHeader>
							<CardTitle className="text-destructive flex items-center space-x-2">
								<Trash2 className="h-5 w-5" />
								<span>Danger Zone</span>
							</CardTitle>
							<CardDescription>
								Irreversible actions that will permanently remove this account
								and all associated data.
							</CardDescription>
						</CardHeader>
						<CardContent className="pt-6">
							<div className="border-destructive/20 bg-destructive/5 flex items-center justify-between rounded-lg border p-4">
								<div className="space-y-1">
									<h4 className="text-sm font-medium">Delete this account</h4>
									<p className="text-muted-foreground text-sm">
										Once you delete an account, there is no going back. This
										will permanently delete the account, all lots, transactions,
										and associated data.
									</p>
								</div>
								<DeleteAccountDialog
									accountId={account.id}
									accountName={account.name || 'Unnamed Account'}
								/>
							</div>
						</CardContent>
					</Card>
				)}
			</div>
		</FormProvider>
	);
}
