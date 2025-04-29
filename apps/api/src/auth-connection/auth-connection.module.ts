import { Module } from "@nestjs/common";

import { EtradeModule } from "../etrade/etrade.module";
import { PlaidModule } from "../plaid/plaid.module";
import { AuthConnectionResolver } from "./auth-connection.resolver";
import { AuthConnectionService } from "./auth-connection.service";

@Module({
  exports: [AuthConnectionService],
  imports: [EtradeModule, PlaidModule],
  providers: [AuthConnectionService, AuthConnectionResolver],
})
export class AuthConnectionModule {}
