import { Module } from "@nestjs/common";

import { StripeController } from "./stripe.controller";
import { StripeService } from "./stripe.service";

@Module({
  controllers: [StripeController],
  exports: [StripeService],
  providers: [StripeService],
})
export class StripeModule {}
