import type { ButtonProps } from '@repo/ui/components/button';

import PlaidLink from './PlaidLink';

import { trpc } from '~/lib/trpc';

type PlaidConnectButtonProps = ButtonProps;

export default function PlaidConnectButton({
  ...buttonProps
}: PlaidConnectButtonProps) {
  const { data } = trpc.plaid.linkToken.useQuery();
  return data?.linkToken ? (
    <PlaidLink {...buttonProps} token={data.linkToken} />
  ) : null;
}
