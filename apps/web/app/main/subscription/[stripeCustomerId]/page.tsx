// import { Badge } from '@repo/ui/components/badge';

// import { Button } from '@repo/ui/components/button';
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from '@repo/ui/components/card';
// import { Check } from 'lucide-react';
// import Stripe from 'stripe';
// import { serverEnvironment } from '~/lib/env/serverEnvironment';

// import { PricingOptions } from '~/modules/pricing';
// import Price from '~/modules/pricing/Price';
// import 'server-only';

// const stripe = new Stripe(serverEnvironment.STRIPE_SECRET_KEY);

// export default async function CheckoutForm(
//   props: {
//     params: Promise<{ stripeCustomerId: string }>;
//   },
// ) {
//   const params = await props.params;

//   const {
//     stripeCustomerId,
//   } = params;

//   const { data } = await stripe.subscriptions.list({
//     customer: stripeCustomerId,
//   });

//   return (
//     <div className="flex flex-col space-y-4">
//       <Card>
//         <CardHeader>
//           <CardTitle>Your Plan</CardTitle>
//         </CardHeader>
//         <CardContent className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
//           {data.flatMap(sub =>
//             sub.items.data.map(item => (
//               <ActiveProduct
//                 key={item.id}
//                 productId={item.price.product as string}
//                 subscriptionId={sub.id}
//               />
//             )),
//           )}
//         </CardContent>
//       </Card>
//       <Card>
//         <CardHeader>
//           <CardTitle>All Plans</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <PricingOptions stripeCustomerId={stripeCustomerId} />
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

// async function ActiveProduct({
//   productId,
//   // subscriptionId,
// }: {
//   productId: string;
//   subscriptionId: string;
// }) {
//   const product = await stripe.products.retrieve(productId);

//   return (
//     <Card
//       key={product.id}
//       className="shadow-black/10 drop-shadow-xl dark:shadow-white/10"
//     >
//       <CardHeader>
//         <CardTitle className="flex items-center justify-between space-x-4">
//           <Badge className="text-lg">{product.name}</Badge>
//           <Button variant="outline">Cancel</Button>
//         </CardTitle>
//         {typeof product.default_price === 'string'
//           ? (
//               <Price priceId={product.default_price} />
//             )
//           : null}
//         <CardDescription>{product.description}</CardDescription>
//       </CardHeader>

//       <hr className="m-auto mb-2 w-4/5" />

//       <CardFooter className="flex">
//         <div className="mx-auto space-y-4">
//           {product.marketing_features.map(feature => (
//             <span key={feature.name} className="flex">
//               <Check className="text-green-500" />
//               {' '}
//               <h3 className="ml-2">{feature.name}</h3>
//             </span>
//           ))}
//         </div>
//       </CardFooter>
//     </Card>
//   );
// }

export default async function CheckoutForm() {
  return <div>CheckoutForm</div>
}
