'use client';

import { Building2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { createActor } from 'xstate';
import {
	PorfolioConnectState,
	useCreatePortfolioConnectMutation,
	useGetExistingPortfolioConnectQuery,
	useNewConnectPlaidInstitutionOptionsQuery,
	useUpdatePortfolioConnectSnapshotMutation,
} from '~/generated/gql';
import { LoadingIcon } from '~/modules/utility-components';
import { machine } from '../state-machine';

interface InstitutionCardListProps {
	onNavigate?: (portfolioConnectId: string) => void;
}

/**
 * Displays a grid of institution cards for both existing and new connections
 * Fetches data internally using GraphQL queries
 *
 * @example
 * ```tsx
 * <InstitutionCardList />
 * ```
 */
export function InstitutionCardList({ onNavigate }: InstitutionCardListProps) {
	const router = useRouter();
	const [creatingInstitutionId, setCreatingInstitutionId] = useState<
		string | null
	>(null);

	const {
		data: existingPortfolioConnect,
		loading: existingPortfolioConnectLoading,
	} = useGetExistingPortfolioConnectQuery();

	const { data: newInstitutionOptions, loading: newInstitutionOptionsLoading } =
		useNewConnectPlaidInstitutionOptionsQuery();

	const [createPortfolioConnect] = useCreatePortfolioConnectMutation();
	const [updatePortfolioConnectSnapshot] =
		useUpdatePortfolioConnectSnapshotMutation();

	const existingConnections =
		existingPortfolioConnect?.portfolioConnections || [];
	const newInstitutions =
		newInstitutionOptions?.newConnectPlaidInstitutionOptions || [];

	const handleCreateNewConnect = async (plaidInstitutionId: string) => {
		try {
			setCreatingInstitutionId(plaidInstitutionId);
			const result = await createPortfolioConnect({
				variables: { plaidInstitutionId },
			});
			if (!result.data?.createPortfolioConnect) {
				throw new Error('Failed to create portfolio connect');
			}
			const actor = createActor(machine, {
				input: { portfolioConnect: result.data.createPortfolioConnect },
			});
			await updatePortfolioConnectSnapshot({
				variables: {
					id: result.data.createPortfolioConnect.id,
					data: { persistedSnapshot: actor.getPersistedSnapshot() },
				},
			});
			if (result.data?.createPortfolioConnect) {
				const connectId = result.data.createPortfolioConnect.id;
				if (onNavigate) {
					onNavigate(connectId);
				} else {
					router.push(`/connect/${connectId}`);
				}
			}
		} catch (error) {
			console.error('Failed to create portfolio connect:', error);
			setCreatingInstitutionId(null);
		}
	};

	// Show loading state
	if (existingPortfolioConnectLoading || newInstitutionOptionsLoading) {
		return (
			<div className="flex items-center justify-center p-8">
				<LoadingIcon />
			</div>
		);
	}

	return (
		<div className="mx-auto grid max-w-5xl grid-cols-1 gap-4 md:grid-cols-3">
			{/* Existing connections */}
			{existingConnections.map((connect) => {
				const isCompleted = connect.state === PorfolioConnectState.Completed;
				return (
					<Link
						href={`/connect/${connect.id}`}
						key={connect.id}
						className={`flex justify-center ${isCompleted ? 'pointer-events-none' : ''}`}
					>
						<button
							disabled={isCompleted}
							className={`flex w-full flex-col items-center gap-4 rounded-lg border p-6 text-center transition-all ${
								isCompleted
									? 'opacity-50 cursor-default'
									: 'cursor-pointer hover:border-primary hover:bg-accent'
							}`}
							type="button"
							style={{
								backgroundColor: connect.plaidInstitution?.primaryColor
									? `${connect.plaidInstitution.primaryColor}08`
									: undefined,
							}}
						>
							<div
								className="flex h-12 w-12 items-center justify-center rounded-md"
								style={{
									backgroundColor:
										connect.plaidInstitution?.primaryColor || '#f5f5f5',
								}}
							>
								{connect.plaidInstitution?.logo ? (
									<Image
										src={`data:image/jpeg;base64,${connect.plaidInstitution.logo}`}
										alt={connect.plaidInstitution.name}
										className="h-8 w-8 rounded-full"
										width={48}
										height={48}
										unoptimized
									/>
								) : (
									<Building2 className="h-6 w-6 text-muted-foreground" />
								)}
							</div>
							<div>
								<h3 className="font-semibold">
									{connect.plaidInstitution?.name || 'Continue Setup'}
								</h3>
								<p className="text-muted-foreground text-sm mt-1">
									{isCompleted ? 'Completed' : 'Continue'}
								</p>
							</div>
						</button>
					</Link>
				);
			})}

			{/* New institution connection cards */}
			{newInstitutions.map((institution) => (
				<div key={institution.id} className="flex justify-center">
					<button
						onClick={() => handleCreateNewConnect(institution.id)}
						disabled={creatingInstitutionId === institution.id}
						className="flex w-full flex-col items-center gap-4 rounded-lg border p-6 text-center transition-all hover:border-primary hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
						type="button"
						style={{
							backgroundColor: institution.primaryColor
								? `${institution.primaryColor}08`
								: undefined,
						}}
					>
						{creatingInstitutionId === institution.id ? (
							<LoadingIcon />
						) : (
							<>
								<div
									className="flex h-12 w-12 items-center justify-center rounded-md"
									style={{
										backgroundColor: institution.primaryColor || '#f5f5f5',
									}}
								>
									{institution.logo ? (
										<Image
											src={`data:image/jpeg;base64,${institution.logo}`}
											alt={institution.name}
											className="h-8 w-8 rounded-full"
											width={48}
											height={48}
											unoptimized
										/>
									) : (
										<Building2 className="h-6 w-6 text-muted-foreground" />
									)}
								</div>
								<div>
									<h3 className="font-semibold">{institution.name}</h3>
									<p className="text-muted-foreground text-sm mt-1">
										Connect new account
									</p>
								</div>
							</>
						)}
					</button>
				</div>
			))}
		</div>
	);
}
