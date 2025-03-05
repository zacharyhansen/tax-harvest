import 'server-only';

import PricingOptions from './PricingOptions';

const Pricing = async () => {
  return (
    <section id="pricing" className="container py-24 sm:py-32">
      <h2 className="text-center text-3xl font-bold md:text-4xl">
        Get
        <span className="from-primary/60 to-primary bg-gradient-to-b bg-clip-text text-transparent">
          {' '}
          Unlimited{' '}
        </span>
        Access
      </h2>
      <h3 className="text-muted-foreground pb-8 pt-4 text-center text-xl">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias
        reiciendis.
      </h3>
      <PricingOptions />
    </section>
  );
};

export default Pricing;
