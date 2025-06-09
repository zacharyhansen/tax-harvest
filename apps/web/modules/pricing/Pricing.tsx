import PricingOptions from './PricingOptions'

import 'server-only'

async function Pricing() {
  return (
    <section id="pricing" className="container py-24 sm:py-32">
      <h2 className="text-center text-3xl font-bold md:text-4xl">
        Get
        <span className="bg-linear-to-b from-primary/60 to-primary bg-clip-text text-transparent">
          {' '}
          Unlimited
          {' '}
        </span>
        Access
      </h2>
      <h3 className="pb-8 pt-4 text-center text-xl text-muted-foreground">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias
        reiciendis.
      </h3>
      <PricingOptions />
    </section>
  )
}

export default Pricing
