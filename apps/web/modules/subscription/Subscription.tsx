import 'server-only';

export interface SubscriptionProps {
  stripeCustomerId: string;
}

export default async function Subscription({
  stripeCustomerId,
}: SubscriptionProps) {
  return <div>Subscription Component</div>;
}
