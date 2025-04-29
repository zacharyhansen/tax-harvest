import type { ButtonProps } from '@repo/ui/components/button';

import PlaidLink from './PlaidLink';

import { usePlaidLinkTokenQuery } from '~/generated/gql';

type PlaidConnectButtonProps = ButtonProps;

export default function PlaidConnectButton({
  ...buttonProps
}: PlaidConnectButtonProps) {
  const { data } = usePlaidLinkTokenQuery();
  return data?.linkToken ? (
    <PlaidLink {...buttonProps} token={data.linkToken} />
  ) : null;
}
