import type { ButtonProps } from '@repo/ui/components/button';
import type {
  PlaidLinkOnSuccess,
  PlaidLinkOptions,
  PlaidLinkOnExit,
  PlaidLinkError,
} from 'react-plaid-link';
import { Alert } from '@repo/ui/components/alert';
import { Button } from '@repo/ui/components/button';
import { toast } from '@repo/ui/components/toast-sonner';
import Image from 'next/image';
import { useCallback } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import { ApolloError } from '@apollo/client';
import { useRouter } from 'next/navigation';

import { usePlaidSetAccessTokenAndSyncAccountsMutation } from '~/generated/gql';

import plaidIcon from '../../public/icons/plaid.svg';

type PlaidLinkProps = {
  token: string;
  redirectTo?: string;
  accountMappingUrl?: string;
  existingAccountId?: string;
} & ButtonProps;

export default function PlaidLink({
  token,
  redirectTo,
  accountMappingUrl,
  existingAccountId,
  ...buttonProps
}: PlaidLinkProps) {
  const router = (redirectTo || accountMappingUrl) ? useRouter() : null;
  const [mutate] = usePlaidSetAccessTokenAndSyncAccountsMutation();

  const onSuccess: PlaidLinkOnSuccess = useCallback<PlaidLinkOnSuccess>(
    (public_token, metaData) => {
      toast.promise(
        mutate({
          refetchQueries: 'active',
          variables: {
            metaData: {
              accounts: metaData.accounts.map(account => ({
                id: account.id,
                mask: account.mask,
                name: account.name,
                subtype: account.subtype,
                type: account.type,
                verification_status: account.verification_status,
              })),
              institution: metaData.institution
                ? {
                    institution_id: metaData.institution.institution_id,
                    name: metaData.institution.name,
                  }
                : undefined,
              link_session_id: metaData.link_session_id,
              transfer_status: metaData.transfer_status,
            },
            publicToken: public_token,
            existingAccountId,
          },
        })
          .then((result) => {
            const accounts = result.data?.setAccessTokenAndSyncAccounts || [];
            
            // Clean up the stored account ID since linking is complete
            if (existingAccountId) {
              localStorage.removeItem('onboardingAccountId');
            }
            
            // Handle redirect logic based on number of accounts
            if (router) {
              if (accounts.length > 1 && accountMappingUrl) {
                // Multiple accounts - redirect to mapping page
                router.push(accountMappingUrl);
              } else if (redirectTo) {
                // Single account or no mapping URL - use normal redirect
                router.push(redirectTo);
              }
            }
          })
          .catch((error: ApolloError) => {
            console.error('Plaid sync error:', error);
            throw new Error(error.message || 'Failed to sync accounts');
          }),
        {
          error: error => `Failed to sync accounts: ${error.message}`,
          loading:
            'We are syncing your account and transaction data, this may take a moment',
          success: redirectTo
            ? 'Sync complete! Redirecting...'
            : 'Sync complete',
        }
      );
    },
    [mutate, redirectTo, accountMappingUrl, router, existingAccountId]
  );

  const onExit: PlaidLinkOnExit = useCallback(
    (error: PlaidLinkError | null, metadata) => {
      if (error) {
        console.error('Plaid Link error:', error);
        toast.error(
          `Connection error: ${error.error_message || error.error_code}`
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
    []
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
    <Button
      {...buttonProps}
      onClick={e => {
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
  );
}
