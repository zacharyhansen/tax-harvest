'use client';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import type { ReactNode } from 'react';

import { PageWrapper } from '~/modules/layout';

// biome-ignore lint/style/noNonNullAssertion: <ok>
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

export default function PaymentLayout({ children }: { children: ReactNode }) {
	return (
		<PageWrapper title="Subscription">
			<Elements stripe={stripePromise}>{children}</Elements>
		</PageWrapper>
	);
}
