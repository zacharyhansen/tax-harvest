'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@repo/ui/components/button';
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@repo/ui/components/card';
import { Separator } from '@repo/ui/components/separator';
import { toast } from '@repo/ui/components/toast-sonner';
import InputField from '@repo/ui/form-builder/fields/input.field';
import { useStandardForm } from '@repo/ui/hooks/use-standard-form';
import { DollarSign } from 'lucide-react';
import { FormProvider } from 'react-hook-form';
import { z } from 'zod';
import type { PortfolioDetailItemFragment } from '~/generated/gql';
import {
	usePortfolioDetailAuthedQuery,
	useUpdatePortfolioMutation,
} from '~/generated/gql';
import { ErrorPage, LoadingPage } from '~/modules/utility-components';
import { zodNumber } from '~/modules/utils/zod-utils';
import { PortfolioSwitcher } from '~/modules/portfolio';

const formSchema = z.object({
	harvestCycleWeeks: zodNumber.pipe(z.coerce.number().gte(1)),
	harvestShareDollarThreshold: zodNumber.pipe(z.coerce.number().gte(0)),
	harvestTickerBucketDollarSizeLong: zodNumber.pipe(z.coerce.number().gte(0)),
	harvestTickerBucketDollarSizeShort: zodNumber.pipe(z.coerce.number().gte(0)),
	harvestTickerBucketLowerLimitLong: zodNumber.pipe(z.coerce.number().gte(0)),
	harvestTickerBucketLowerLimitShort: zodNumber.pipe(z.coerce.number().gte(0)),
	name: z.string().min(3),
	minimumLotPAndL: zodNumber.pipe(z.coerce.number().gte(0)),
});

export default function PortfolioPage() {
	const { data, error, loading } = usePortfolioDetailAuthedQuery({});

	if (error) {
		return (
			<ErrorPage message="Could not load portfolio at this time. If the issue persists, please contact support @support" />
		);
	}

	if (loading || !data) {
		return <LoadingPage />;
	}

	return <Form portfolio={data.portfolioAuthed} />;
}

function Form({ portfolio }: { portfolio: PortfolioDetailItemFragment }) {
	const [update, { loading }] = useUpdatePortfolioMutation({
		onError: () => {
			toast.error('Unable to update Portfolio');
		},
	});

	const { form, handleSubmit } = useStandardForm<z.infer<typeof formSchema>>({
		defaultValues: {
			minimumLotPAndL: Number(portfolio.minimumLotPAndL),
			harvestCycleWeeks: portfolio.harvestCycleWeeks,
			harvestShareDollarThreshold: Number(
				portfolio.harvestShareDollarThreshold,
			),
			harvestTickerBucketDollarSizeLong: Number(
				portfolio.harvestTickerBucketDollarSizeLong,
			),
			harvestTickerBucketDollarSizeShort: Number(
				portfolio.harvestTickerBucketDollarSizeShort,
			),
			harvestTickerBucketLowerLimitLong: Number(
				portfolio.harvestTickerBucketLowerLimitLong,
			),
			harvestTickerBucketLowerLimitShort: Number(
				portfolio.harvestTickerBucketLowerLimitShort,
			),
			name: portfolio.name,
		},
		resolver: zodResolver(formSchema),
		handleSubmit: ({
			harvestCycleWeeks,
			harvestShareDollarThreshold,
			harvestTickerBucketDollarSizeLong,
			harvestTickerBucketDollarSizeShort,
			harvestTickerBucketLowerLimitLong,
			harvestTickerBucketLowerLimitShort,
			minimumLotPAndL,
			name,
		}) => {
			toast.promise(
				update({
					variables: {
						data: {
							minimumLotPAndL: {
								set: minimumLotPAndL.toString(),
							},
							harvestCycleWeeks: {
								set: harvestCycleWeeks,
							},
							harvestShareDollarThreshold: {
								set: harvestShareDollarThreshold.toString(),
							},
							harvestTickerBucketDollarSizeLong: {
								set: harvestTickerBucketDollarSizeLong.toString(),
							},
							harvestTickerBucketDollarSizeShort: {
								set: harvestTickerBucketDollarSizeShort.toString(),
							},
							harvestTickerBucketLowerLimitLong: {
								set: harvestTickerBucketLowerLimitLong.toString(),
							},
							harvestTickerBucketLowerLimitShort: {
								set: harvestTickerBucketLowerLimitShort.toString(),
							},
							name: {
								set: name,
							},
						},
					},
				}).then(({ data: result }) => {
					if (!result) {
						return;
					}
					form.reset({
						...result.updatePortfolio,
						harvestShareDollarThreshold: Number(
							result.updatePortfolio.harvestShareDollarThreshold,
						),
						harvestTickerBucketDollarSizeLong: Number(
							result.updatePortfolio.harvestTickerBucketDollarSizeLong,
						),
						harvestTickerBucketDollarSizeShort: Number(
							result.updatePortfolio.harvestTickerBucketDollarSizeShort,
						),
						harvestTickerBucketLowerLimitLong: Number(
							result.updatePortfolio.harvestTickerBucketLowerLimitLong,
						),
						harvestTickerBucketLowerLimitShort: Number(
							result.updatePortfolio.harvestTickerBucketLowerLimitShort,
						),
						minimumLotPAndL: Number(result.updatePortfolio.minimumLotPAndL),
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
				<div>
					<h1 className="text-3xl font-bold tracking-tight">
						Portfolio Settings
					</h1>
					<p className="text-muted-foreground">
						Manage your portfolio settings and preferences.
					</p>
				</div>

				{/* Portfolio Switcher Card */}
				<Card className="w-full">
					<CardHeader>
						<CardTitle>Switch Portfolio</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-sm text-muted-foreground mb-4">
							Select a different portfolio to manage its settings and view its data.
						</p>
						<PortfolioSwitcher />
					</CardContent>
				</Card>

				<Card className="w-full">
					<CardHeader>
						<CardTitle>Attributes</CardTitle>
					</CardHeader>
					<form onSubmit={handleSubmit} noValidate={true}>
						<CardContent className="space-y-8">
							{/* Miscellaneous Inputs */}
							<div className="space-y-4">
								<InputField name="name" label="Portfolio Name" />
								<InputField
									name="minimumLotPAndL"
									startIcon={DollarSign}
									label="Minimum Lot P/L"
									type="number"
									description="The minimum dollar amount profit or loss per share for a single share to be considered for harvest."
								/>
								<InputField
									name="harvestCycleWeeks"
									label="Harvest Cycle - Number of Weeks"
									type="number"
								/>
								<InputField
									name="harvestShareDollarThreshold"
									startIcon={DollarSign}
									label="Per Share Minimum"
									type="number"
									description="The minimum dollar amount profit or loss per share for a single share to be considered for harvest."
								/>
							</div>

							<Separator />

							<div className="space-y-4">
								<h3 className="text-lg font-medium">
									Short Term Capital Settings
								</h3>
								<div className="grid grid-cols-2 gap-4">
									<InputField
										startIcon={DollarSign}
										name="harvestTickerBucketDollarSizeShort"
										label="Asset Bucket Size"
										type="number"
										description="The max dollar amount harvested for a single asset before trying the next."
									/>
									<InputField
										startIcon={DollarSign}
										name="harvestTickerBucketLowerLimitShort"
										label="Asset Dollar Minimum"
										type="number"
										description="The minimum dollar total profit or loss required for an asset to be considered for the harvest."
									/>
								</div>
							</div>

							<Separator />

							<div className="space-y-4">
								<h3 className="text-lg font-medium">
									Long Term Capital Settings
								</h3>
								<div className="grid grid-cols-2 gap-4">
									<InputField
										startIcon={DollarSign}
										name="harvestTickerBucketDollarSizeLong"
										label="Asset Bucket Size"
										type="number"
										description="The max dollar amount harvested for a single asset before trying the next."
									/>
									<InputField
										startIcon={DollarSign}
										name="harvestTickerBucketLowerLimitLong"
										label="Asset Dollar Minimum"
										type="number"
										description="The minimum dollar total profit or loss required for an asset to be considered for the harvest."
									/>
								</div>
							</div>
						</CardContent>
						<CardFooter>
							<Button
								type="submit"
								className="ml-auto w-full"
								disabled={!form.formState.isDirty}
								loading={loading}
							>
								Save
							</Button>
						</CardFooter>
					</form>
				</Card>
			</div>
		</FormProvider>
	);
}
