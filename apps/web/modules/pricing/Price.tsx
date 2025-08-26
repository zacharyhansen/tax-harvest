// import Stripe from 'stripe';
// import { serverEnvironment } from '~/lib/env/serverEnvironment';

// import 'server-only';

// const stripe = new Stripe(serverEnvironment.STRIPE_SECRET_KEY);
// type PriceProps = {
//   priceId: string;
// };
// export default async function Price({ priceId }: PriceProps) {
//   const price = await stripe.prices.retrieve(priceId);

//   return (
//     <div>
//       <span className="text-3xl font-bold">
//         $
//         {price.unit_amount ? price.unit_amount / 100 : 'Free'}
//       </span>
//       <span className="text-muted-foreground">
//         /
//         {price.recurring?.interval}
//       </span>
//     </div>
//   );
// }

export default async function Price() {
	return <div>Price</div>;
}
