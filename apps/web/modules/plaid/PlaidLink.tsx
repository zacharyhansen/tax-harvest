import type { ButtonProps } from '@repo/ui/components/button'
import type { PlaidLinkOnSuccess, PlaidLinkOptions } from 'react-plaid-link'
import { Alert } from '@repo/ui/components/alert'
import { Button } from '@repo/ui/components/button'
import { toast } from '@repo/ui/components/toast-sonner'
import Image from 'next/image'
import { useCallback } from 'react'
import { usePlaidLink } from 'react-plaid-link'

import { usePlaidSetAccessTokenAndSyncAccountsMutation } from '~/generated/gql'

// Import removed - using public asset path instead

type PlaidLinkProps = {
  token: string
} & ButtonProps

export default function PlaidLink({ token, ...buttonProps }: PlaidLinkProps) {
  const [mutate] = usePlaidSetAccessTokenAndSyncAccountsMutation()

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
          },
        }),
        {
          error: 'Accounts failed to sync',
          loading: 'We are syncing your account and transaction data',
          success: 'Sync complete',
        },
      )
    },
    [mutate],
  )

  const config: PlaidLinkOptions = {
    onSuccess,
    token,
    // onExit
    // onEvent
  }

  const { error, open, ready } = usePlaidLink(config)

  if (error) {
    return <Alert variant="destructive">{JSON.stringify(error)}</Alert>
  }

  return (
    <Button
      {...buttonProps}
      onClick={() => {
        open()
      }}
      disabled={!ready}
      iconLeft={<Image src="/icons/plaid.svg" alt="Plaid" width={24} height={24} />}
    >
      Connect
    </Button>
  )
}
