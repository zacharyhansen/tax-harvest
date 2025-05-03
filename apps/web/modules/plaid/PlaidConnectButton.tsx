import type { ButtonProps } from '@repo/ui/components/button';

import { usePlaidLinkTokenQuery } from '~/generated/gql';

import PlaidLink from './PlaidLink';

type PlaidConnectButtonProps = ButtonProps;

export default function PlaidConnectButton({
  ...buttonProps
}: PlaidConnectButtonProps) {
  const { data } = usePlaidLinkTokenQuery();
  return data?.linkToken
    ? (
        <PlaidLink {...buttonProps} token={data.linkToken} />
      )
    : null;
}
