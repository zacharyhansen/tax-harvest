import { Args, Field, ObjectType, Query, Resolver } from '@nestjs/graphql'

import { StripeService } from './stripe.service'
import { StripeProduct } from './types'

@ObjectType()
export class StripeSession {
  @Field(() => String)
  id: string

  @Field(() => String, { nullable: true })
  client_secret: string | null
}

@Resolver()
export class StripeResolver {
  constructor(private readonly stripeService: StripeService) {}

  @Query(() => StripeSession, { name: 'stripeSession', nullable: false })
  stripeSession(
    @Args('stripePriceId', { type: () => String })
    stripePriceId: string,
    @Args('stripeCustomerId', { type: () => String })
    stripeCustomerId: string,
  ): Promise<StripeSession> {
    return this.stripeService.session({ stripeCustomerId, stripePriceId })
  }

  @Query(() => [StripeProduct], { name: 'products', nullable: false })
  products(
    @Args('active', { nullable: true, type: () => String })
    active?: boolean,
  ): Promise<StripeProduct[]> {
    return this.stripeService.products({ active })
  }
}
