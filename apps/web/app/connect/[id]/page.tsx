'use client';

import { Button } from '@repo/ui/components/button';
import { toast } from '@repo/ui/components/toast-sonner';
import { useActor } from '@xstate/react';
import { Building2, LineChart, Lock, Shield } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import {
	PorfolioConnectState,
	type PortfolioConnectItemDetailFragment,
	useAdminSyncPlaidItemMutation,
	useApplyLotUploadsMutation,
	useDeletePortfolioConnectMutation,
	usePlaidLinkTokenQuery,
	usePortfolioConnectQuery,
	useUpdatePortfolioConnectSnapshotMutation,
} from '~/generated/gql';
import { TypedRoutes } from '~/lib/routes';
import PlaidLink from '~/modules/plaid/PlaidLink';
import { LoadingIcon } from '~/modules/utility-components';
import { CalculatingHarvest } from '../components/calculating-harvest';
import { Complete } from '../components/complete';
import { Fidelity } from '../components/fidelity';
import { PreviewHarvests } from '../components/preview-harvests';
import { UploadLots } from '../components/upload-lots';
import { machine } from '../state-machine';
import { SchwabLotUpload } from './MinimalLotUploadTable';

const plaidConnectFeatures = [
	{
		icon: <Shield className="text-primary h-5 w-5" />,
		title: 'Bank-Level Security',
		description: 'Your data is encrypted and protected',
	},
	{
		icon: <Building2 className="text-primary h-5 w-5" />,
		title: 'Trusted by Banks',
		description: 'Connect to 12,000+ institutions',
	},
	{
		icon: <LineChart className="text-primary h-5 w-5" />,
		title: 'Smart Tax Harvesting',
		description: 'Identify opportunities automatically',
	},
	{
		icon: <Lock className="text-primary h-5 w-5" />,
		title: 'Data Privacy',
		description: 'Disconnect anytime',
	},
];

function getBrokerDisplayName(brokerType?: string): string {
	if (!brokerType) return 'account';

	const brokerNames: Record<string, string> = {
		schwab: 'Schwab account',
		etrade: 'E*TRADE account',
		fidelity: 'Fidelity account',
		ins_11: 'Schwab account',
		ins_129473: 'E*TRADE account',
	};

	return brokerNames[brokerType.toLowerCase()] || `${brokerType} account`;
}

/**
 * Connect page for resuming a specific PortfolioConnect by ID
 * Loads the persisted snapshot and initializes the state machine
 *
 * @example
 * /connect/[portfolioConnectId]
 */
export default function ConnectByIdPage() {
	const params = useParams();
	const portfolioConnectId = params.id as string;

	// Load the specific PortfolioConnect by ID
	const { data, loading, error } = usePortfolioConnectQuery({
		variables: { id: portfolioConnectId },
		skip: !portfolioConnectId,
	});

	// Show loading state
	if (loading) {
		return (
			<div className="p-8">
				<div className="flex items-center justify-center">
					<LoadingIcon />
				</div>
			</div>
		);
	}

	// Show error state
	if (error || !data?.portfolioConnect) {
		return (
			<div className="p-8">
				<div className="text-destructive text-center">
					<h2 className="text-xl font-semibold">Connection not found</h2>
					<p className="text-muted-foreground mt-2">
						Unable to load the portfolio connection.
					</p>
					<Link href={TypedRoutes.connect()}>
						<Button className="mt-4"> Go back to connect </Button>
					</Link>
				</div>
			</div>
		);
	}

	return <ExisitingConnectFlow portfolioConnectItem={data.portfolioConnect} />;
}

const ExisitingConnectFlow = ({
	portfolioConnectItem,
}: {
	portfolioConnectItem: PortfolioConnectItemDetailFragment;
}) => {
	const router = useRouter();
	const [applyLotUploads] = useApplyLotUploadsMutation();
	const [retrySync] = useAdminSyncPlaidItemMutation();
	const [updatePortfolioConnect] = useUpdatePortfolioConnectSnapshotMutation();
	const { data: linkTokenData } = usePlaidLinkTokenQuery();
	const [deletePortfolioConnect] = useDeletePortfolioConnectMutation();

	// Create actor and subscribe to state changes
	const [state, send, actorRef] = useActor(
		machine.provide({
			actions: {
				deletePortfolioConnect: () =>
					deletePortfolioConnect({
						variables: { id: portfolioConnectItem.id },
					}).then(() => {
						router.push(TypedRoutes.connect());
					}),
				completePortfolioConnect: () =>
					updatePortfolioConnect({
						variables: {
							id: portfolioConnectItem.id,
							data: { state: { set: PorfolioConnectState.Completed } },
						},
					}),
			},
		}),
		{
			input: { portfolioConnect: portfolioConnectItem },
			snapshot: portfolioConnectItem.persistedSnapshot,
		},
	);

	useEffect(() => {
		const subscription = actorRef.subscribe(() => {
			updatePortfolioConnect({
				variables: {
					id: portfolioConnectItem.id,
					data: {
						persistedSnapshot: actorRef.getPersistedSnapshot(),
					},
				},
			});
		});
		return () => {
			subscription.unsubscribe();
		};
	}, [actorRef, updatePortfolioConnect, portfolioConnectItem.id]);

	/**
	 * Get title and description based on current state
	 */
	const getHeaderContent = () => {
		const brokerName = state.context.portfolioConnect?.plaidInstitution.name;

		switch (state.value) {
			case 'schwab_upload_lots':
			case 'etrade_upload':
				return {
					title: 'Upload Tax Lots',
					description: `Upload your ${brokerName || 'brokerage'} tax lot CSV file to enable accurate tax-loss harvesting calculations`,
				};

			case 'fidelity':
				return {
					title: 'Connect Fidelity Account',
					description:
						'Follow the steps to connect your Fidelity brokerage account',
				};

			case 'calculating_harvest':
				return {
					title: 'Analyzing Your Portfolio',
					description:
						"We're analyzing your holdings to identify tax-loss harvesting opportunities",
				};

			case 'preview_harvests':
				return {
					title: 'Review Tax-Loss Harvesting Opportunities',
					description:
						'Review the identified opportunities and optionally connect your account for automatic execution',
				};

			case 'plaid_connect':
				return {
					title: `Link to Plaid`,
					description:
						'Securely connect your brokerage account to enable automatic tax-loss harvesting identification',
				};

			case 'plaid_sync':
				return {
					title: 'Syncing Your Account',
					description: 'Please wait while we securely sync your account data',
				};

			case 'complete':
				return {
					title: 'Setup Complete',
					description:
						'Your account has been successfully connected and configured',
				};

			default:
				return {
					title: 'Link Investments',
					description:
						'Securely connect your brokerage accounts to enable automatic tax-loss harvesting identification',
				};
		}
	};

	const { title, description } = getHeaderContent();

	// Render component based on current state
	const renderState = () => {
		switch (state.value) {
			case 'schwab_upload_lots':
				return (
					<SchwabLotUpload
						portfolioConnectItem={portfolioConnectItem}
						onSubmit={(lotUploadIds) => {
							toast.promise(
								applyLotUploads({
									variables: {
										lotUploadIds,
									},
									onCompleted: () => {
										send({ type: 'schwab.submit' });
									},
									onError: (error) => {
										throw error;
									},
								}),
								{
									loading: 'Applying...',
									success: 'Applied!',
									error: 'Failed to apply',
								},
							);
						}}
						onAbandon={() => send({ type: 'cancel' })}
					/>
				);

			case 'etrade_upload':
				return (
					<UploadLots
						onSubmit={() => send({ type: 'etrade.submit' })}
						onBack={() => send({ type: 'back' })}
						portfolioConnectId={portfolioConnectItem.id}
					/>
				);

			case 'fidelity':
				return (
					<Fidelity
						onSubmit={() => send({ type: 'submit' })}
						onBack={() => send({ type: 'back' })}
					/>
				);

			case 'calculating_harvest':
				return (
					<CalculatingHarvest
						onComplete={() => send({ type: 'calculating_complete' })}
						onBack={() => send({ type: 'back' })}
					/>
				);

			case 'preview_harvests':
				return (
					<PreviewHarvests
						isEtrade={
							state.context.portfolioConnect.plaidInstitution.id ===
							'ins_129473'
						}
						onConnectPlaid={() => send({ type: 'connect_plaid' })}
						onComplete={() => send({ type: 'submit' })}
						portfolioConnectItem={portfolioConnectItem}
					/>
				);

			case 'plaid_connect': {
				const portfolioConnect = state.context.portfolioConnect;
				const brokerType = portfolioConnect.plaidInstitution.id;
				const hasExistingAccount =
					portfolioConnect?.account !== null &&
					portfolioConnect?.account !== undefined;

				const buttonText = hasExistingAccount
					? `Continue linking ${getBrokerDisplayName(brokerType)} to Plaid`
					: `Link new ${getBrokerDisplayName(brokerType)} to Plaid`;

				const handlePlaidSuccess = () => {
					send({ type: 'link.created' });
				};

				return (
					<div className="p-8">
						<div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
							{plaidConnectFeatures.map((feature, index) => (
								// biome-ignore lint/suspicious/noArrayIndexKey: ok
								<div key={index} className="flex gap-3">
									<div className="mt-1">{feature.icon}</div>
									<div>
										<h3 className="font-semibold">{feature.title}</h3>
										<p className="text-muted-foreground text-sm">
											{feature.description}
										</p>
									</div>
								</div>
							))}
						</div>

						<div className="text-center">
							{linkTokenData?.linkToken ? (
								<PlaidLink
									token={linkTokenData.linkToken}
									onSuccessfulLink={handlePlaidSuccess}
									portfolioConnectId={portfolioConnect.id}
									portfolioConnectCallback={() => {
										send({ type: 'plaid.connected' });
									}}
									plaidInstitutionId={portfolioConnect.plaidInstitutionId}
									size="lg"
									variant="default"
									className="w-full"
									onError={() => send({ type: 'plaid.sync_error' })}
								>
									{buttonText}
								</PlaidLink>
							) : (
								<LoadingIcon className="mx-auto my-4" />
							)}
						</div>

						<div className="mt-6 flex justify-start border-t pt-6">
							<Button variant="outline" onClick={() => send({ type: 'back' })}>
								Back
							</Button>
						</div>
					</div>
				);
			}
			case 'plaid_sync':
				return (
					<div className="flex min-h-[400px] flex-col items-center justify-center p-8">
						<LoadingIcon className="mb-4" />
						<h2 className="text-xl font-semibold">Syncing your account...</h2>
						<p className="text-muted-foreground mt-2">
							Please wait while we sync your account data.
						</p>
					</div>
				);

			case 'complete':
				return <Complete />;

			case 'plaid_sync_error':
				return (
					<div className="flex min-h-[400px] flex-col items-center justify-center p-8">
						<h2 className="text-xl font-semibold">We encountered a problem</h2>
						<p className="text-muted-foreground mt-2">
							Please try agian or restart if the issue persists.
						</p>
						<div className="flex gap-10 pt-4">
							<Button
								variant="outline"
								onClick={() => send({ type: 'cancel' })}
							>
								Abandon Setup
							</Button>
							<Button
								onClick={() => {
									send({ type: 'plaid.sync_retry' });
									toast.promise(
										retrySync({
											variables: {
												authConnectionId:
													// biome-ignore lint/style/noNonNullAssertion: <ok>
													portfolioConnectItem.authConnectionId!,
											},
											onCompleted: () => {
												send({ type: 'plaid.connected' });
											},
											onError: (error) => {
												send({ type: 'plaid.sync_error' });
												throw error;
											},
										}),
										{
											loading: 'Retrying...',
											success: 'Success!',
											error: 'Failed to retry',
										},
									);
								}}
							>
								Retry!
							</Button>
						</div>
					</div>
				);

			default:
				return <div>Unknown state: {state.value}</div>;
		}
	};

	return (
		<div className="bg-background/50 min-h-screen backdrop-blur-sm">
			<div className="flex min-h-screen items-center justify-center p-4">
				<div className="mx-auto max-h-screen w-full max-w-4xl overflow-auto">
					<div className="bg-card rounded-lg border">
						<div className="border-b p-6">
							<h1 className="text-2xl font-semibold">{title}</h1>
							<p className="text-muted-foreground mt-1">{description}</p>
						</div>
						{renderState()}
					</div>
				</div>
			</div>
		</div>
	);
};
