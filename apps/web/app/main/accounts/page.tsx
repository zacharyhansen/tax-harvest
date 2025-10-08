'use client';

import { Button } from '@repo/ui/components/button';
import { Card } from '@repo/ui/components/card';
import {
	Building2,
	Calendar,
	ChevronRight,
	Link as LinkIcon,
	User,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
	AccountProvider,
	useAccountsQuery,
	usePlaidAuthConnectionsQuery,
	usePlaidLinkTokenQuery,
} from '~/generated/gql';
import { TypedRoutes } from '~/lib/routes';
import { NoAccounts } from '~/modules/account';
import { PageWrapper } from '~/modules/layout';
import { DeleteAuthConnectionDialog } from '~/modules/plaid';
import {
	ErrorPage,
	LoadingIcon,
	LoadingPage,
} from '~/modules/utility-components';
import { Format } from '~/modules/utils';
import DeleteAccountDialog from './[id]/DeleteAccountDialog';

export default function AccountPage() {
	const router = useRouter();
	const { data: linkTokenData } = usePlaidLinkTokenQuery();
	const {
		data: authConnectionsData,
		loading: authConnectionsLoading,
		error,
	} = usePlaidAuthConnectionsQuery();
	const { data: accountsData, loading: accountsLoading } = useAccountsQuery({
		variables: {
			where: {
				provider: { equals: AccountProvider.Unconnected },
			},
		},
	});

	const handleAccountClick = (accountId: string) => {
		router.push(TypedRoutes.account({ id: accountId }));
	};

	if (authConnectionsLoading || accountsLoading) {
		return <LoadingPage />;
	}

	if (error) {
		return (
			<ErrorPage message="Could not load accounts at this time. If this issue persists please contact support" />
		);
	}

	const hasConnections =
		authConnectionsData?.plaidAuthConnections &&
		authConnectionsData.plaidAuthConnections.length > 0;

	const hasUnconnectedAccounts =
		accountsData?.accounts && accountsData.accounts.length > 0;

	if (!hasConnections && !hasUnconnectedAccounts) {
		return <NoAccounts />;
	}

	return (
		<PageWrapper>
			<div className="mx-auto w-full max-w-4xl">
				<div className="bg-card rounded-lg border">
					<div className="border-b p-6">
						<h1 className="text-2xl font-semibold">Your Accounts</h1>
						<p className="text-muted-foreground mt-1">
							Manage your connected financial institutions and accounts
						</p>
					</div>

					<div className="p-8">
						<div className="space-y-12">
							{hasConnections && (
								<div>
									<h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
										<LinkIcon className="h-5 w-5" />
										Connected Accounts
									</h2>
									<div className="space-y-4">
										{authConnectionsData.plaidAuthConnections.map(
											(authConnection) => (
												<Card
													className="overflow-hidden"
													key={authConnection.id}
												>
													{/* Institution Header */}
													<div className="bg-muted/30 p-4">
														<div className="flex items-center justify-between">
															<div className="flex items-center gap-3">
																{authConnection.plaidInstitution?.logo ? (
																	<Image
																		src={`data:image/jpeg;base64,${authConnection.plaidInstitution.logo}`}
																		alt={authConnection.plaidInstitution.name}
																		className="h-12 w-12 object-contain rounded p-1"
																		style={{
																			backgroundColor:
																				authConnection.plaidInstitution
																					.primaryColor || '#f5f5f5',
																		}}
																		unoptimized
																		width={40}
																		height={40}
																	/>
																) : (
																	<div
																		className="bg-secondary flex h-10 w-10 items-center justify-center rounded"
																		style={{
																			backgroundColor:
																				authConnection.plaidInstitution
																					.primaryColor || '',
																		}}
																	>
																		<Building2 className="h-5 w-5" />
																	</div>
																)}

																<div>
																	<h3 className="text-base font-semibold">
																		{authConnection.plaidInstitution?.name ||
																			'Unknown Institution'}
																	</h3>

																	<div className="text-muted-foreground flex items-center gap-3 text-xs">
																		<div className="flex items-center gap-1">
																			<Calendar className="h-3 w-3" />
																			<span>
																				Connected{' '}
																				{new Date(
																					authConnection.authedAt,
																				).toLocaleDateString()}
																			</span>
																		</div>
																		{authConnection.user && (
																			<>
																				<span>•</span>
																				<div className="flex items-center gap-1">
																					<User className="h-3 w-3" />
																					<span
																						title={
																							authConnection.user.email || ''
																						}
																					>
																						{authConnection.user.email}
																					</span>
																				</div>
																			</>
																		)}
																	</div>
																</div>
															</div>

															{/* Action Buttons */}
															<div className="flex items-center gap-2">
																<div>
																	{/* {updateTokenData?.linkToken ? (
																		<PlaidLink
																			token={updateTokenData.linkToken}
																			size="sm"
																			iconLeft={<Plus className="h-4 w-4" />}
																			onSuccessfulLink={() => {
																				router.push(redirectTo);
																			}}
																		>
																			Add Accounts
																		</PlaidLink>
																	) : (
																		<LoadingIcon className="mx-auto my-4" />
																	)} */}
																</div>
																<DeleteAuthConnectionDialog
																	authConnection={authConnection}
																	institutionName={
																		authConnection.plaidInstitution?.name ||
																		'Unknown Institution'
																	}
																/>
															</div>
														</div>
													</div>

													{/* Account List */}
													<div className="divide-y">
														{authConnection.accounts?.map((account) => (
															// biome-ignore lint/a11y/noStaticElementInteractions: <ok>
															// biome-ignore lint/a11y/useKeyWithClickEvents: <ok>
															<div
																key={account.id}
																className="group flex items-center justify-between px-6 py-3 transition-all duration-200 hover:bg-muted/20 hover:shadow-sm cursor-pointer border-l-4 border-l-transparent hover:border-l-primary/50"
																onClick={() => handleAccountClick(account.id)}
															>
																<div className="flex items-center gap-2">
																	<div>
																		<div className="flex items-center gap-2">
																			<span className="text-sm font-medium group-hover:text-primary transition-colors">
																				{account.name}
																			</span>
																			{account.plaidAccountMask && (
																				<span className="text-muted-foreground text-xs">
																					•••• {account.plaidAccountMask}
																				</span>
																			)}
																		</div>
																		{account.subType && (
																			<span className="text-muted-foreground text-xs capitalize">
																				{account.subType
																					.toLowerCase()
																					.replace(/_/g, ' ')}
																			</span>
																		)}
																	</div>
																</div>

																<div className="flex items-center gap-2">
																	<div className="text-right">
																		{account.accountValueTotal != null && (
																			<span className="text-sm font-semibold">
																				{Format.money(
																					account.accountValueTotal,
																				)}
																			</span>
																		)}
																		{account.status &&
																			account.status !== 'ACTIVE' && (
																				<div className="text-muted-foreground text-xs">
																					{account.status}
																				</div>
																			)}
																	</div>
																	<ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
																</div>
															</div>
														))}
													</div>
												</Card>
											),
										)}
									</div>
								</div>
							)}

							{hasUnconnectedAccounts && (
								<div>
									<h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
										Unconnected Accounts
									</h2>
									<div className="space-y-4">
										{accountsData.accounts.map((account) => (
											// biome-ignore lint/a11y/noStaticElementInteractions: <ok>
											// biome-ignore lint/a11y/useKeyWithClickEvents: <ok>
											<div
												key={account.id}
												className="hover:bg-muted/20 hover:border-l-primary/50 group cursor-pointer rounded-lg border border-l-4 border-l-transparent transition-all duration-200 hover:shadow-sm"
												onClick={() => handleAccountClick(account.id)}
											>
												<div className="flex items-center justify-between p-4">
													<div className="flex-1">
														<h3 className="group-hover:text-primary font-medium transition-colors">
															{account.name}
														</h3>
														<p className="text-muted-foreground text-sm">
															{account.type} •{' '}
															{account.provider || 'Manual Entry'}
														</p>
													</div>
													<div className="flex items-center gap-3">
														<ChevronRight className="text-muted-foreground group-hover:text-primary h-4 w-4 transition-colors" />
														<DeleteAccountDialog
															accountId={account.id}
															accountName={
																account.name ?? account.externalId ?? 'Unnamed'
															}
														/>
													</div>
												</div>
											</div>
										))}
									</div>
								</div>
							)}

							{/* Link New Institution Button */}
							<div className="mt-8 border-t pt-8">
								<div className="text-center">
									<h3 className="mb-2 text-base font-medium">
										Need to connect a different institution?
									</h3>
									<p className="text-muted-foreground mb-4 text-sm">
										Link accounts from another bank or brokerage
									</p>
									{linkTokenData?.linkToken ? (
										<Link href={TypedRoutes.connect()}>
											<Button>Link New Institution</Button>
										</Link>
									) : (
										<LoadingIcon className="mx-auto my-4" />
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</PageWrapper>
	);
}
