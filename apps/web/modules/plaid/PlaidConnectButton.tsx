import type { ButtonProps } from '@repo/ui/components/button';

import { usePlaidLinkTokenQuery } from '~/generated/gql';
import { LoadingIcon } from '../utility-components';
import PlaidLink from './PlaidLink';

type PlaidConnectButtonProps = ButtonProps;

export default function PlaidConnectButton({
	...buttonProps
}: PlaidConnectButtonProps) {
	const { data } = usePlaidLinkTokenQuery();

	return data?.linkToken ? (
		<PlaidLink {...buttonProps} token={data.linkToken} />
	) : (
		<LoadingIcon className="mx-auto my-4" />
	);
}
