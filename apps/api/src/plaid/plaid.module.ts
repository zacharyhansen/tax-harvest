import { Module } from "@nestjs/common";

import { PlaidController } from "./plaid.controller";
import { PlaidRouter } from "./plaid.router";
import { PlaidService } from "./plaid.service";
@Module({
  controllers: [PlaidController],
  exports: [PlaidService],
  providers: [PlaidService, PlaidRouter],
})
export class PlaidModule {}
