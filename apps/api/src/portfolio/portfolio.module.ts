import { Module } from "@nestjs/common";

import { AccountModule } from "../account/account.module";
import { ClerkModule } from "../clerk/clerk.module";
import { DatabaseModule } from "../database/database.module";
import { HarvestModule } from "../harvest/harvest.module";
import { LotModule } from "../lot/lot.module";
import { UserModule } from "../user/user.module";
import { PortfolioRouter } from "./portfolio.router";
import { PortfolioService } from "./portfolio.service";

@Module({
  exports: [PortfolioService],
  imports: [
    DatabaseModule,
    UserModule,
    AccountModule,
    ClerkModule,
    LotModule,
    HarvestModule,
  ],
  providers: [PortfolioService, PortfolioRouter],
})
export class PortfolioModule {}
