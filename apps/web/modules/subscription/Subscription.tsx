import 'server-only';

export type SubscriptionProps = {
	stripeCustomerId: string;
};

export default async function Subscription() {
	return <div>Subscription Component</div>;
}
