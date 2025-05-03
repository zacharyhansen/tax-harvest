import { Module } from '@nestjs/common'

import { StripeController } from './stripe.controller'
import { StripeResolver } from './stripe.resolver'
import { StripeService } from './stripe.service'

@Module({
  controllers: [StripeController],
  exports: [StripeService],
  providers: [StripeService, StripeResolver],
})
export class StripeModule {}
