import Image from 'next/image';
import { useCallback } from 'react';
import type { PlaidLinkOnSuccess, PlaidLinkOptions } from 'react-plaid-link';
import { usePlaidLink } from 'react-plaid-link';
import { Button, type ButtonProps } from '@repo/ui/components/button';
import { toast } from '@repo/ui/components/toast-sonner';

import plaidIcon from '../../public/icons/plaid.svg';
import { ErrorPage } from '../utility-components';

import { trpc } from '~/lib/trpc';

interface PlaidLinkProps extends ButtonProps {
  token: string;
}

export default function PlaidLink({ token, ...buttonProps }: PlaidLinkProps) {
  const mutate = trpc.plaid.setAccessTokenAndSyncAccounts.useMutation();

  const onSuccess: PlaidLinkOnSuccess = useCallback<PlaidLinkOnSuccess>(
    (public_token, metaData) => {
      toast.promise(
        mutate.mutateAsync({
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
        }),

        {
          error: 'Accounts failed to sync',
          loading: 'We are syncing your account and transaction data',
          success: 'Sync complete',
        }
      );
    },
    [mutate]
  );

  const config: PlaidLinkOptions = {
    onSuccess,
    token,
    // onExit
    // onEvent
  };

  const { error, open, ready } = usePlaidLink(config);

  if (error) {
    return <ErrorPage message={JSON.stringify(error)} />;
  }

  return (
    <Button
      {...buttonProps}
      onClick={() => {
        open();
      }}
      disabled={!ready}
      iconLeft={<Image src={plaidIcon} alt="Plaid" width={24} height={24} />}
    >
      Connect
    </Button>
  );
}
