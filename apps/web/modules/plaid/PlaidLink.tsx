import type { ApolloError } from '@apollo/client';
import { Alert } from '@repo/ui/components/alert';
import type { ButtonProps } from '@repo/ui/components/button';
import { Button } from '@repo/ui/components/button';
import { toast } from '@repo/ui/components/toast-sonner';
import Image from 'next/image';
import { useCallback, useState } from 'react';
import type {
	PlaidLinkError,
	PlaidLinkOnExit,
	PlaidLinkOnSuccess,
	PlaidLinkOnSuccessMetadata,
	PlaidLinkOptions,
} from 'react-plaid-link';
import { usePlaidLink } from 'react-plaid-link';

import {
	type PortfolioConnectPlaidSyncResultFragment,
	usePlaidSetAccessTokenAndSyncAccountsMutation,
} from '~/generated/gql';

import plaidIcon from '../../public/icons/plaid.svg';

type PlaidLinkProps = {
	token: string;
	portfolioConnectId?: string;
	plaidInstitutionId: string;
	portfolioConnectCallback?: (
		portfolioConnect: PortfolioConnectPlaidSyncResultFragment,
	) => void;
	onSuccessfulLink?: (metaData: PlaidLinkOnSuccessMetadata) => void;
	onError?: (error: ApolloError) => void;
} & ButtonProps;

export default function PlaidLink({
	token,
	portfolioConnectCallback,
	portfolioConnectId,
	plaidInstitutionId,
	onSuccessfulLink,
	onError,
	...buttonProps
}: PlaidLinkProps) {
	const [linkError, setLinkError] = useState<string | null>(null);
	const [mutate] = usePlaidSetAccessTokenAndSyncAccountsMutation();

	const onSuccess: PlaidLinkOnSuccess = useCallback<PlaidLinkOnSuccess>(
		(public_token, metaData) => {
			if (metaData.institution?.institution_id !== plaidInstitutionId) {
				setLinkError(
					'You have attempted to link to a different institution. Please try again with the correct institution.',
				);
				return;
			}
			onSuccessfulLink?.(metaData);
			toast.promise(
				mutate({
					// refetchQueries: 'active',
					variables: {
						metaData: {
							accounts: metaData.accounts.map((account) => ({
								id: account.id,
								mask: account.mask,
								name: account.name,
								subtype: account.subtype,
								type: account.type,
								verification_status: account.verification_status,
							})),
							institution:
								metaData.institution?.institution_id &&
								metaData.institution.name
									? {
											institution_id: metaData.institution.institution_id,
											name: metaData.institution.name,
										}
									: undefined,
							link_session_id: metaData.link_session_id,
							transfer_status: metaData.transfer_status,
						},
						publicToken: public_token,
						existingPortfolioConnectId: portfolioConnectId ?? null,
					},
				})
					.then((result) => {
						if (
							portfolioConnectCallback &&
							result.data?.setAccessTokenAndSyncAccounts
						) {
							portfolioConnectCallback(
								result.data.setAccessTokenAndSyncAccounts,
							);
						}
					})
					.catch((error: ApolloError) => {
						console.error('Plaid sync error:', error);
						onError?.(error as ApolloError);
						throw new Error(error.message || 'Failed to sync accounts');
					}),
				{
					error: (error) => `Failed to sync accounts: ${error.message}`,
					loading:
						'We are syncing your account and transaction data, this may take a moment',
					success: 'Sync complete',
				},
			);
		},
		[
			mutate,
			portfolioConnectId,
			portfolioConnectCallback,
			onSuccessfulLink,
			onError,
			plaidInstitutionId,
		],
	);

	const onExit: PlaidLinkOnExit = useCallback(
		(error: PlaidLinkError | null, metadata) => {
			if (error) {
				console.error('Plaid Link error:', error);
				toast.error(
					`Connection error: ${error.error_message || error.error_code}`,
				);
			} else if (metadata.status === 'requires_credentials') {
				toast.error('Please enter valid credentials');
			} else if (metadata.status === 'requires_questions') {
				toast.error('Please answer all security questions');
			} else if (metadata.status === 'requires_selections') {
				toast.error('Please select all required options');
			} else if (metadata.status === 'institution_not_found') {
				toast.error('Institution not found');
			} else if (metadata.status !== 'complete') {
				toast.error('Connection process incomplete');
			}
		},
		[],
	);

	const config: PlaidLinkOptions = {
		onSuccess,
		onExit,
		token,
	};

	const { error, open, ready } = usePlaidLink(config);

	if (error) {
		console.error('Plaid Link setup error:', error);
		return (
			<Alert variant="destructive">
				Failed to initialize Plaid connection:{' '}
				{error.message || JSON.stringify(error)}
			</Alert>
		);
	}

	return (
		<>
			<Button
				{...buttonProps}
				onClick={(e) => {
					e.stopPropagation();
					open();
				}}
				disabled={!ready}
				iconLeft={
					buttonProps.children ? (
						buttonProps.iconLeft
					) : (
						<Image src={plaidIcon} alt="Plaid" width={24} height={24} />
					)
				}
			>
				{buttonProps.children || 'Connect'}
			</Button>
			{linkError && (
				<Alert className="mt-2" variant="destructive">
					{linkError}
				</Alert>
			)}
		</>
	);
}
