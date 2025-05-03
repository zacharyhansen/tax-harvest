import type { ConfigService } from '@nestjs/config'
import type { StripeProduct } from './types'
import { Injectable } from '@nestjs/common'

import { Stripe } from 'stripe'

@Injectable()
export class StripeService {
  private readonly stripe: Stripe
  constructor(private readonly configService: ConfigService) {
    this.stripe = new Stripe(
      this.configService.get('STRIPE_SECRET_KEY') as string,
    )
  }

  async session({
    stripeCustomerId,
    stripePriceId,
  }: {
    stripePriceId: string
    stripeCustomerId: string
  }) {
    const { client_secret, id } = await this.stripe.checkout.sessions.create({
      automatic_tax: { enabled: true },
      customer: stripeCustomerId,
      customer_update: {
        address: 'auto',
        name: 'auto',
        shipping: 'auto',
      },
      // embedded = no external routing
      line_items: [
        {
          // this is the product price id from stripe
          price: stripePriceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      payment_method_types: ['card'],
      return_url: `${this.configService.get('CLIENT_ORIGIN')}/dashboard/payment-confirmation?session_id={CHECKOUT_SESSION_ID}`,
      ui_mode: 'embedded',
    })
    return {
      client_secret,
      id,
    }
  }
  // async assertPaymentSessionComplete({ sessionId }: { sessionId: string }) {
  // const session = await this.stripe.checkout.sessions.retrieve(sessionId);
  // if (session.status === 'complete') {
  //     return session.
  // }
  // }

  products({ active }: { active?: boolean }): Promise<StripeProduct[]> {
    return this.stripe.products
      .list({
        active,
      })
      .then((result) => {
        return result.data
      })
  }

  createCustomer({ params }: { params: Stripe.CustomerCreateParams }) {
    return this.stripe.customers.create(params)
  }
}
