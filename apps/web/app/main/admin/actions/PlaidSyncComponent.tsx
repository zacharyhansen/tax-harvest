'use client';

import { Button } from '@repo/ui/components/button';
import { Card } from '@repo/ui/components/card';
import { toast } from '@repo/ui/components/toast-sonner';
import { Building2, Calendar, RefreshCw, User } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import {
	useAdminPlaidAuthConnectionsQuery,
	useAdminSyncPlaidItemMutation,
} from '~/generated/gql';
import { LoadingIcon } from '~/modules/utility-components';
import { Format } from '~/modules/utils';

/**
 * Admin component for syncing Plaid auth connections
 * Shows all Plaid connections across all portfolios with sync buttons
 *
 * @example
 * <PlaidSyncComponent />
 */
export function PlaidSyncComponent() {
	const [syncingId, setSyncingId] = useState<string | null>(null);
	const { data, loading, error, refetch } = useAdminPlaidAuthConnectionsQuery();
	const [syncPlaidItem] = useAdminSyncPlaidItemMutation();

	const handleSync = async (authConnectionId: string) => {
		setSyncingId(authConnectionId);
		try {
			await toast.promise(
				syncPlaidItem({
					variables: { authConnectionId },
				}),
				{
					loading: 'Syncing Plaid connection...',
					success: 'Plaid connection synced successfully',
					error: 'Failed to sync Plaid connection',
				},
			);
			// Refetch the data to get updated sync times
			refetch();
		} finally {
			setSyncingId(null);
		}
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center py-8">
				<LoadingIcon className="h-8 w-8" />
			</div>
		);
	}

	if (error) {
		return (
			<div className="text-destructive text-center py-8">
				Error loading Plaid connections: {error.message}
			</div>
		);
	}

	const connections = data?.plaidAuthConnections || [];

	if (connections.length === 0) {
		return (
			<div className="text-muted-foreground text-center py-8">
				No Plaid connections found
			</div>
		);
	}

	return (
		<div className="space-y-4">
			{connections.map((authConnection) => (
				<Card className="overflow-hidden" key={authConnection.id}>
					{/* Institution Header */}
					<div className="bg-muted/30 p-4 cursor-pointer hover:bg-muted/50 transition-colors">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								{authConnection.plaidInstitution?.logo ? (
									<Image
										src={`data:image/jpeg;base64,${authConnection.plaidInstitution.logo}`}
										alt={authConnection.plaidInstitution.name}
										className="h-10 w-10 rounded-full object-contain"
										style={{
											backgroundColor:
												authConnection.plaidInstitution.primaryColor ||
												'#f5f5f5',
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
												authConnection.plaidInstitution?.primaryColor || '',
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
											<User className="h-3 w-3" />
											<span>
												{authConnection.user?.email || 'Unknown User'}
											</span>
										</div>
										<span>•</span>
										<div className="flex items-center gap-1">
											<Calendar className="h-3 w-3" />
											<span>
												Connected{' '}
												{new Date(authConnection.authedAt).toLocaleDateString()}
											</span>
										</div>
										{authConnection.syncedAt && (
											<>
												<span>•</span>
												<div className="flex items-center gap-1">
													<RefreshCw className="h-3 w-3" />
													<span>
														Last synced{' '}
														{new Date(
															authConnection.syncedAt,
														).toLocaleDateString()}
													</span>
												</div>
											</>
										)}
									</div>
								</div>
							</div>

							<div className="flex items-center gap-2">
								<Button
									size="sm"
									onClick={(e) => {
										e.stopPropagation();
										handleSync(authConnection.id);
									}}
									disabled={syncingId === authConnection.id}
								>
									{syncingId === authConnection.id ? (
										<>
											<LoadingIcon className="mr-2 h-4 w-4" />
											Syncing...
										</>
									) : (
										<>
											<RefreshCw className="mr-2 h-4 w-4" />
											Sync Now
										</>
									)}
								</Button>
							</div>
						</div>
					</div>

					{/* Account List  */}
					<div className="divide-y">
						{authConnection.accounts?.map((account) => (
							<div
								key={account.id}
								className="flex items-center justify-between px-6 py-3"
							>
								<div className="flex items-center gap-2">
									<div>
										<div className="flex items-center gap-2">
											<span className="text-sm font-medium">
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
												{account.subType.toLowerCase().replace(/_/g, ' ')}
											</span>
										)}
									</div>
								</div>

								<div className="text-right">
									{account.accountValueTotal != null && (
										<span className="text-sm font-semibold">
											{Format.money(account.accountValueTotal)}
										</span>
									)}
									{account.status && account.status !== 'ACTIVE' && (
										<div className="text-muted-foreground text-xs">
											{account.status}
										</div>
									)}
								</div>
							</div>
						))}
					</div>
				</Card>
			))}
		</div>
	);
}
