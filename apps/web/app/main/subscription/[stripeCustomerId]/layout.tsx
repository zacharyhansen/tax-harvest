'use client';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import type { ReactNode } from 'react';
import StandardPage from 'ui/composed/standardPage';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

export default function PaymentLayout({ children }: { children: ReactNode }) {
  return (
    <StandardPage title="Subscription">
      <Elements stripe={stripePromise}>{children}</Elements>
    </StandardPage>
  );
}
