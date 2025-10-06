'use client';

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@repo/ui/components/alert-dialog';
import { Button } from '@repo/ui/components/button';
import { Card, CardContent } from '@repo/ui/components/card';
import { DatePicker } from '@repo/ui/components/date-picker';
import {
	ResponsiveDialog,
	ResponsiveDialogBody,
	ResponsiveDialogClose,
	ResponsiveDialogContent,
	ResponsiveDialogDescription,
	ResponsiveDialogFooter,
	ResponsiveDialogHeader,
	ResponsiveDialogTitle,
	ResponsiveDialogTrigger,
} from '@repo/ui/components/reponsive-dialog';
import { Switch } from '@repo/ui/components/switch';
import { toast } from '@repo/ui/components/toast-sonner';
import { AnimatePresence, motion } from 'framer-motion';
import { Calendar, Check, ChevronDown, Clock, InfoIcon } from 'lucide-react';
import { useState } from 'react';
import {
	type HarvestSingleItemFragment,
	HarvestsAndTransactionsDocument,
	useDeleteHarvestsMutation,
	useUpdateHarvestSingleMutation,
} from '~/generated/gql';
import { formatDate, withMonthAndDayFormatter } from '~/modules/utils';

export function HarvestCard({
	harvest,
	open = false,
}: {
	harvest: HarvestSingleItemFragment;
	open?: boolean;
}) {
	const [updateHarvest] = useUpdateHarvestSingleMutation();
	const [deleteHarvest] = useDeleteHarvestsMutation({
		refetchQueries: [HarvestsAndTransactionsDocument],
		awaitRefetchQueries: true,
	});
	const [showNotificationDialog, setShowNotificationDialog] = useState(false);
	const [isOpen, setIsOpen] = useState(open);

	const progressStep =
		new Date(harvest.afterWashRevertDate) < new Date()
			? 2
			: new Date(harvest.recommendationExpiresDate) < new Date()
				? 1
				: 0;
	const markedSoldAt = harvest.date;
	const expiresAt = harvest.afterWashRevertDate;
	const repurchaseDate = harvest.afterWashRevertDate;
	const hasExpired = new Date(expiresAt) < new Date();
	const taxSavings = Number(harvest.amount);

	function getStrategyDescription(
		type: HarvestSingleItemFragment['type'],
		symbol: string,
		symbol2?: string,
	): string {
		switch (type) {
			case 'CAPTURE_GAINS_TAX_FREE':
				return `You are offsetting gains from ${symbol2} by selling losses in ${symbol}.`;
			case 'REDUCE_COST_BASIS':
				return `You are offsetting gains by selling unrealized losses from ${symbol}`;
			case 'REDUCE_TAXES':
				return `You are offsetting losses by selling unrealized gains from ${symbol}`;
			default:
				return '';
		}
	}

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
		}).format(amount);
	};

	const handleDelete = () => {
		toast.promise(
			deleteHarvest({
				variables: {
					ids: [harvest.id],
				},
			}),
			{
				loading: 'Deleting harvest...',
				success: 'Harvest deleted',
				error: 'Failed to delete harvest',
			},
		);
	};

	const sourceLots =
		harvest.harvestTransactions
			?.filter((transaction) => !transaction.counterTransaction)
			?.map((transaction) => ({
				symbol: transaction.harvestTransactionItem.assetSymbol,
				shares: Number(transaction.harvestTransactionItem.quantity),
				purchaseDate: transaction.harvestTransactionItem.lotAcquiredDate,
				purchasePrice: Number(transaction.harvestTransactionItem.lotPricePaid),
				currentPrice: Number(
					transaction.harvestTransactionItem.lotPriceAtHarvest,
				),
			})) ?? [];

	const matchedLots =
		harvest.harvestTransactions
			?.filter((transaction) => transaction.counterTransaction)
			?.map((transaction) => ({
				symbol: transaction.harvestTransactionItem.assetSymbol,
				shares: Number(transaction.harvestTransactionItem.quantity),
				purchaseDate: transaction.harvestTransactionItem.lotAcquiredDate,
				purchasePrice: Number(transaction.harvestTransactionItem.lotPricePaid),
				currentPrice: Number(
					transaction.harvestTransactionItem.lotPriceAtHarvest,
				),
			})) ?? [];

	return (
		<Card className="bg-background overflow-hidden border-2">
			<CardContent className="p-6">
				{/* Card Header */}
				<motion.div
					className="flex cursor-pointer items-start justify-between"
					onClick={() => setIsOpen(!isOpen)}
					whileTap={{ scale: 0.99 }}
				>
					<div>
						<h3 className="text-lg font-semibold">
							Harvest for {sourceLots.map((lot) => lot.symbol).join(', ')}
							{matchedLots.length > 0
								? ` ↔ ${matchedLots.map((lot) => lot.symbol).join(', ')}`
								: null}
						</h3>
						<p className="text-muted-foreground inline-flex items-center gap-2">
							Matched Pair • Marked for sale on {formatDate(harvest.date)}
						</p>
					</div>
					<div className="flex items-center gap-4">
						<div className="text-right">
							<span className="text-lg font-medium text-green-500">
								{formatCurrency(Math.abs(taxSavings))}
							</span>
							<div className="text-muted-foreground">Tax Savings</div>
						</div>
						<motion.div
							animate={{ rotate: isOpen ? 180 : 0 }}
							transition={{ duration: 0.3, ease: 'easeInOut' }}
							className="flex h-8 w-8 items-center justify-center"
						>
							<ChevronDown className="h-4 w-4" />
						</motion.div>
					</div>
				</motion.div>

				<AnimatePresence initial={false}>
					{isOpen && (
						<motion.div
							initial={{ height: 0, opacity: 0 }}
							animate={{ height: 'auto', opacity: 1 }}
							exit={{ height: 0, opacity: 0 }}
							transition={{ duration: 0.3, ease: 'easeInOut' }}
							style={{ overflow: 'hidden' }}
						>
							{/* Strategy Description */}
							<div className="mt-4 space-y-4 border-t-2 pt-4">
								<div className="flex items-start gap-3">
									<InfoIcon className="text-muted-foreground mt-0.5 h-5 w-5 flex-shrink-0" />
									<p className="text-muted-foreground leading-relaxed">
										{getStrategyDescription(
											harvest.type,
											harvest.harvestTransactions?.[0]?.harvestTransactionItem
												.assetSymbol ?? '',
											harvest.harvestTransactions?.[0]?.harvestTransactionItem
												.assetSymbol ?? '',
										)}
									</p>
								</div>

								<div className="flex items-start gap-3">
									<Clock className="text-muted-foreground mt-0.5 h-5 w-5 flex-shrink-0" />
									<p className="text-muted-foreground leading-relaxed">
										This recommendation will expire on{' '}
										{formatDate(
											harvest.harvestTransactions?.[0]?.harvestTransactionItem
												.lotAcquiredDate,
										)}{' '}
										at 3PM EST. Log in to your brokerage to sell these stocks
										before that date.
									</p>
								</div>

								<div className="flex items-start gap-3">
									<Calendar className="text-muted-foreground mt-0.5 h-5 w-5 flex-shrink-0" />
									<p className="text-muted-foreground leading-relaxed">
										We will remind you on{' '}
										{formatDate(repurchaseDate, withMonthAndDayFormatter)} to
										rebuy the stock. If you sell the stock after Today+1, change
										your reminder date to be 31 days after you sell the stock to
										avoid the IRS Wash Sale rule
									</p>
								</div>
								<div className="flex flex-col items-start gap-3">
									<div className="mt-4 text-xl font-medium">
										Harvest Details
									</div>
									<p className="text-muted-foreground leading-relaxed">
										We don't make trades on your behalf, so you must log into
										your brokerage to sell this position. On June 24 at 3PM EST,
										this lot will expire and be re-included in your harvest
										recommendations.
									</p>
								</div>
							</div>
							{/* Timeline */}
							<div className="relative my-6 flex items-center">
								{/* Timeline bar */}
								<div className="absolute h-0.5 w-full bg-gray-200">
									<div
										className="absolute h-0.5 bg-yellow-500 transition-all duration-300"
										style={{
											width: `${(progressStep + 1 / 2) * 100}%`,
										}}
									/>
								</div>

								{/* Step 1: Harvest Marked */}
								<div className="relative z-10">
									<div
										className={`flex h-6 w-6 items-center justify-center rounded-full ${progressStep >= 0 ? 'bg-yellow-500' : 'bg-gray-500'}`}
									>
										<Clock className="text-background h-3 w-3" />
									</div>
								</div>

								{/* Line to Step 2 */}
								<div className="flex-1"></div>

								{/* Step 2: Recommendation Expires */}
								<div className="relative z-10">
									<div
										className={`flex h-6 w-6 items-center justify-center rounded-full ${progressStep >= 1 ? 'bg-yellow-500' : 'bg-gray-500'}`}
									>
										{progressStep >= 1 ? (
											<Check className="text-background h-3 w-3" />
										) : (
											<div className="h-3 w-3 rounded-full bg-gray-300"></div>
										)}
									</div>
								</div>

								{/* Line to Step 3 */}
								<div className="flex-1"></div>

								{/* Step 3: RePurchase Reminder */}
								<div className="relative z-10">
									<div
										className={`flex h-6 w-6 items-center justify-center rounded-full ${progressStep >= 2 ? 'bg-yellow-500' : 'bg-gray-500'}`}
									>
										{progressStep >= 2 ? (
											<Check className="text-background h-3 w-3" />
										) : (
											<div className="h-3 w-3 rounded-full bg-gray-300"></div>
										)}
									</div>
								</div>
							</div>

							{/* Timeline Labels */}
							<div className="mb-8 grid grid-cols-3 gap-2">
								<div>
									<div className="font-medium">Harvest Marked</div>
									<div className="text-muted-foreground">
										{formatDate(
											new Date(markedSoldAt),
											withMonthAndDayFormatter,
										)}
									</div>
								</div>
								<div className="text-center">
									<div className="font-medium">
										Recommendation {hasExpired ? 'Expired' : 'Expires'}
									</div>
									<div className="text-muted-foreground">
										{formatDate(
											new Date(harvest.recommendationExpiresDate),
											withMonthAndDayFormatter,
										)}
									</div>
								</div>
								<div className="text-right">
									<div className="font-medium">RePurchase Reminder</div>
									<div className="text-muted-foreground">
										{formatDate(repurchaseDate, withMonthAndDayFormatter)}
									</div>
								</div>
							</div>

							{/* Details */}
							<div className="grid grid-cols-2 gap-8">
								{/* Source Positions */}
								<div>
									<div className="space-y-8">
										{sourceLots.map((lot, index) => (
											// biome-ignore lint/suspicious/noArrayIndexKey: <ok>
											<div key={index} className="space-y-4">
												<div className="text-foreground mb-4 text-lg font-medium">
													{lot.symbol} Recommendation
												</div>
												<div>
													<div className="text-muted-foreground mb-1">
														Number of Shares
													</div>
													<div className="text-foreground">
														{Math.abs(lot.shares).toLocaleString()}
													</div>
												</div>
												<div>
													<div className="text-muted-foreground mb-1">
														Lot Purchase Date
													</div>
													<div className="text-foreground">
														{formatDate(
															lot.purchaseDate,
															new Intl.DateTimeFormat(undefined, {
																month: 'long' as const,
																day: 'numeric' as const,
																year: 'numeric' as const,
															}),
														)}
													</div>
												</div>
												<div>
													<div className="text-muted-foreground mb-1">
														Lot Purchase Price
													</div>
													<div className="text-foreground">
														{formatCurrency(lot.purchasePrice)}
													</div>
												</div>
											</div>
										))}
									</div>
								</div>

								{/* Matched Positions */}
								<div>
									<div className="space-y-8">
										{matchedLots.map((lot, index) => (
											// biome-ignore lint/suspicious/noArrayIndexKey: <ok>
											<div key={index} className="space-y-4">
												<div className="text-foreground mb-4 text-lg font-medium">
													{lot.symbol} Recommendation
												</div>
												<div>
													<div className="text-muted-foreground mb-1">
														Number of Shares
													</div>
													<div className="text-foreground">
														{Math.abs(lot.shares).toLocaleString()}
													</div>
												</div>
												<div>
													<div className="text-muted-foreground mb-1">
														Lot Purchase Date
													</div>
													<div className="text-foreground">
														{formatDate(
															lot.purchaseDate,
															new Intl.DateTimeFormat(undefined, {
																month: 'long' as const,
																day: 'numeric' as const,
																year: 'numeric' as const,
															}),
														)}
													</div>
												</div>
												<div>
													<div className="text-muted-foreground mb-1">
														Lot Purchase Price
													</div>
													<div className="text-foreground">
														{formatCurrency(lot.purchasePrice)}
													</div>
												</div>
											</div>
										))}
									</div>
								</div>
							</div>

							{/* Delete Button Section */}
							<div className="mt-4 flex w-full justify-end gap-4">
								<AlertDialog>
									<AlertDialogTrigger asChild>
										<Button
											variant="link"
											size="sm"
											className="h-auto px-0 text-red-500 hover:text-red-400"
										>
											Delete Harvest
										</Button>
									</AlertDialogTrigger>
									<AlertDialogContent>
										<AlertDialogHeader>
											<AlertDialogTitle>Delete Harvest</AlertDialogTitle>
											<AlertDialogDescription>
												Are you sure you want to delete this harvest? This will
												restore the opportunity to the Tax Opportunities page.
											</AlertDialogDescription>
										</AlertDialogHeader>
										<AlertDialogFooter>
											<AlertDialogCancel>Cancel</AlertDialogCancel>
											<AlertDialogAction
												variant="destructive"
												onClick={handleDelete}
												className="bg-red-600 text-white hover:bg-red-700"
											>
												Delete
											</AlertDialogAction>
										</AlertDialogFooter>
									</AlertDialogContent>
								</AlertDialog>

								<ResponsiveDialog
									open={showNotificationDialog}
									onOpenChange={setShowNotificationDialog}
								>
									<ResponsiveDialogTrigger asChild>
										<Button
											variant="link"
											size="sm"
											className="h-auto px-0 text-yellow-500 hover:text-yellow-400"
										>
											Edit Reminder
										</Button>
									</ResponsiveDialogTrigger>
									<ResponsiveDialogContent>
										<ResponsiveDialogHeader>
											<ResponsiveDialogTitle>
												Notification Settings
											</ResponsiveDialogTitle>
											<ResponsiveDialogDescription>
												Configure notification settings for this harvest
											</ResponsiveDialogDescription>
										</ResponsiveDialogHeader>
										<ResponsiveDialogBody>
											<div className="flex items-center justify-between py-4">
												<div>
													<h4 className="font-medium">
														Wash Sale Notification
													</h4>
													<p className="text-gray-500">
														Get notified when the wash sale period ends on{' '}
														{formatDate(harvest.afterWashRevertDate)}
													</p>
												</div>
												<Switch
													defaultChecked={harvest.notify}
													onCheckedChange={(value) => {
														toast.promise(
															updateHarvest({
																variables: {
																	id: harvest.id,
																	data: {
																		notify: {
																			set: value,
																		},
																	},
																},
															}),
															{
																loading: 'Updating notification settings...',
																success: 'Notification settings updated',
																error: 'Failed to update notification settings',
															},
														);
													}}
												/>
											</div>
											<div className="flex items-center justify-between py-4">
												<div>
													<h4 className="font-medium">New Reminder Date</h4>
													<DatePicker
														value={harvest.afterWashRevertDate}
														onChange={(value) => {
															toast.promise(
																updateHarvest({
																	variables: {
																		id: harvest.id,
																		data: {
																			afterWashRevertDate: {
																				set: value,
																			},
																		},
																	},
																}),
																{
																	loading: 'Updating reminder date...',
																	success: 'Reminder date updated',
																	error: 'Failed to update reminder date',
																},
															);
														}}
													/>
												</div>
											</div>
										</ResponsiveDialogBody>
										<ResponsiveDialogFooter>
											<ResponsiveDialogClose asChild>
												<Button variant="secondary">Close</Button>
											</ResponsiveDialogClose>
										</ResponsiveDialogFooter>
									</ResponsiveDialogContent>
								</ResponsiveDialog>
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</CardContent>
		</Card>
	);
}
