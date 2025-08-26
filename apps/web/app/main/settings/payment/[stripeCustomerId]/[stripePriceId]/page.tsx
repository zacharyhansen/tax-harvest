'use client';

import {
	EmbeddedCheckout,
	EmbeddedCheckoutProvider,
	useStripe,
} from '@stripe/react-stripe-js';
import { use, useCallback } from 'react';

import { useStripeSessionLazyQuery } from '~/generated/gql';
import { LoadingPage } from '~/modules/utility-components';

export default function StripePriceIdPage(props: {
	params: Promise<{ stripePriceId: string; stripeCustomerId: string }>;
}) {
	const params = use(props.params);

	const { stripeCustomerId, stripePriceId } = params;

	const stripe = useStripe();

	const [getSession] = useStripeSessionLazyQuery();

	const fetchClientSecret = useCallback(() => {
		return getSession({
			variables: {
				stripeCustomerId,
				stripePriceId,
			},
		}).then((result) => result.data?.stripeSession.client_secret ?? '');
	}, [getSession, stripePriceId, stripeCustomerId]);

	if (!stripe) {
		return <LoadingPage message="Loading payment options" />;
	}

	return (
		<div className="rounded-lg bg-gray-950 p-4">
			<EmbeddedCheckoutProvider
				stripe={stripe}
				options={{
					fetchClientSecret,
				}}
			>
				<EmbeddedCheckout className="rounded-lg" />
			</EmbeddedCheckoutProvider>
		</div>
	);
}
