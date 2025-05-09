// import { ArrowRightIcon, CheckCircledIcon } from '@radix-ui/react-icons';
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
// import Link from 'next/link';
// import Stripe from 'stripe';
// import { serverEnvironment } from '~/lib/env/serverEnvironment';
// import Price from './Price';
// import 'server-only';

// const stripe = new Stripe(serverEnvironment.STRIPE_SECRET_KEY);

// export default async function PricingOptions({
//   stripeCustomerId: _id,
// }: {
//   stripeCustomerId?: string;
// }) {
//   const products = await stripe.products
//     .list({
//       active: true,
//     })
//     .then(p =>
//       p.data.sort(
//         (p1, p2) =>
//           (Number.parseInt(p1.metadata.order ?? '0') || 0)
//           - (Number.parseInt(p2.metadata.order ?? '0') || 0),
//       ),
//     );

//   return (
//     <div className="mx-auto w-full">
//       <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
//         {products.map(product => (
//           <Card
//             key={product.id}
//             className={
//               product.metadata.popular
//                 ? 'shadow-black/10 drop-shadow-xl dark:shadow-white/10'
//                 : ''
//             }
//           >
//             <CardHeader>
//               <CardTitle className="flex items-center justify-between">
//                 <Badge variant="secondary" className="text-lg">
//                   {product.name}
//                 </Badge>
//                 {product.metadata.popular
//                   ? (
//                       <Badge variant="outline" className="text-sm">
//                         Most Popular
//                       </Badge>
//                     )
//                   : null}
//               </CardTitle>
//               {typeof product.default_price === 'string'
//                 ? (
//                     <Price priceId={product.default_price} />
//                   )
//                 : null}
//               <CardDescription>{product.description}</CardDescription>
//             </CardHeader>

//             <CardContent>
//               <Link
//                 href="todo"
//                 // href={
//                 //   stripeCustomerId
//                 //     ? `${SUBSCRIPTION}/${stripeCustomerId}/${product.default_price}`
//                 //     : `${SUBSCRIPTION}/all`
//                 // }
//               >
//                 <Button className="w-full" iconRight={<ArrowRightIcon />}>
//                   Get Started
//                 </Button>
//               </Link>
//             </CardContent>

//             <hr className="m-auto mb-4 w-4/5" />

//             <CardFooter className="flex">
//               <div className="mx-auto space-y-4">
//                 {product.marketing_features.map(feature => (
//                   <span key={feature.name} className="flex items-center">
//                     <CheckCircledIcon
//                       width="20px"
//                       height="20px"
//                       className="text-lg text-green-500"
//                     />
//                     <h3 className="ml-2">{feature.name}</h3>
//                   </span>
//                 ))}
//               </div>
//             </CardFooter>
//           </Card>
//         ))}
//       </div>
//     </div>
//   );
// }

const PricingOptions = () => {
  return <div>PricingOptions</div>;
};

export default PricingOptions;
