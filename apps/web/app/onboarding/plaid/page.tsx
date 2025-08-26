'use client';

import { Button } from '@repo/ui/components/button';
import { Building2, LineChart, Lock, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
	usePlaidAuthConnectionsQuery,
	usePlaidLinkTokenQuery,
} from '~/generated/gql';
import { InstitutionCard } from '~/modules/plaid';
import PlaidLink from '~/modules/plaid/PlaidLink';
import { LoadingIcon } from '~/modules/utility-components';

const features = [
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

export default function PlaidPage() {
	const router = useRouter();
	const { data: linkTokenData } = usePlaidLinkTokenQuery();
	const { data: authConnectionsData, loading: authConnectionsLoading } =
		usePlaidAuthConnectionsQuery();
	const [existingAccountId, setExistingAccountId] = useState<string | null>(
		null,
	);

	useEffect(() => {
		// Get the account ID from localStorage that was set during upload
		const accountId = localStorage.getItem('onboardingAccountId');
		setExistingAccountId(accountId);
	}, []);

	const hasConnections =
		authConnectionsData?.plaidAuthConnections &&
		authConnectionsData.plaidAuthConnections.length > 0;

	return (
		<div className="mx-auto max-h-screen w-full max-w-4xl overflow-auto">
			<div className="bg-card rounded-lg border">
				<div className="border-b p-6">
					<h1 className="text-2xl font-semibold">Connect Your Accounts</h1>
					<p className="text-muted-foreground mt-1">
						Securely connect your brokerage accounts to enable automatic
						tax-loss harvesting identification
					</p>
				</div>

				<div className="p-8">
					{/* Show features only if no connections exist */}
					{!hasConnections && (
						<div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
							{features.map((feature, index) => (
								// biome-ignore lint/suspicious/noArrayIndexKey: <ok>
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
					)}

					{/* Show existing connections */}
					{authConnectionsLoading ? (
						<LoadingIcon className="mx-auto my-4" />
					) : hasConnections ? (
						<div className="space-y-6">
							<div>
								<h2 className="mb-4 text-lg font-semibold">
									Connected Institutions
								</h2>
								<div className="space-y-4">
									{authConnectionsData.plaidAuthConnections.map(
										(authConnection) => (
											<InstitutionCard
												key={authConnection.id}
												authConnection={authConnection}
											/>
										),
									)}
								</div>
							</div>

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
										<PlaidLink
											token={linkTokenData.linkToken}
											redirectTo="/main/home"
											accountMappingUrl="/onboarding/account-mapping"
											existingAccountId={existingAccountId || undefined}
											size="lg"
											variant="default"
											iconLeft={<Building2 className="h-5 w-5" />}
										>
											Link New Institution
										</PlaidLink>
									) : (
										<LoadingIcon className="mx-auto my-4" />
									)}
								</div>
							</div>
						</div>
					) : // New connection button when no connections exist
					linkTokenData?.linkToken ? (
						<PlaidLink
							token={linkTokenData.linkToken}
							redirectTo="/main/home"
							accountMappingUrl="/onboarding/account-mapping"
							existingAccountId={existingAccountId || undefined}
							size="lg"
							variant="default"
							className="w-full"
						/>
					) : (
						<LoadingIcon className="mx-auto my-4" />
					)}
				</div>

				<div className="flex justify-between gap-2 border-t p-6">
					<Button
						variant="outline"
						onClick={() => router.push('/onboarding/complete')}
					>
						Back
					</Button>
					<Button variant="outline" onClick={() => router.push('/main/home')}>
						Skip for now
					</Button>
				</div>
			</div>
		</div>
	);
}
