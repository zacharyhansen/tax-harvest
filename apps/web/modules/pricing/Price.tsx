import 'server-only';

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

interface PriceProps {
  priceId: string;
}
export default async function Price({ priceId }: PriceProps) {
  const price = await stripe.prices.retrieve(priceId);

  return (
    <div>
      <span className="text-3xl font-bold">
        ${price.unit_amount ? price.unit_amount / 100 : 'Free'}
      </span>
      <span className="text-muted-foreground">
        /{price.recurring?.interval}
      </span>
    </div>
  );
}
