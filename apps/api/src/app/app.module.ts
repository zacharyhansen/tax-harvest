import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TRPCModule } from "nestjs-trpc";

import { AccountModule } from "~/account/account.module";
import { AssetModule } from "~/asset/asset.module";
import { AppContext } from "~/auth/trpc/clerk-context";
import { AuthConnectionModule } from "~/auth-connection/auth-connection.module";
import { CacheModule } from "~/cache/cache.module";
import { ClerkModule } from "~/clerk/clerk.module";
import { DatabaseModule } from "~/database/database.module";
import { EnvModule } from "~/env/env.module";
import { envSchema } from "~/env/env.schema";
import getConfigService from "~/env/gcp-secrets/get-config-service";
import { EtradeModule } from "~/etrade/etrade.module";
import { HealthModule } from "~/health/health.module";
import { LotModule } from "~/lot/lot.module";
import { OauthModule } from "~/oauth/oauth.module";
import { PlaidModule } from "~/plaid/plaid.module";
import { PolygonModule } from "~/polygon/polygon.module";
import { PortfolioModule } from "~/portfolio/portfolio.module";
import { PositionModule } from "~/position/position.module";
import { PriceHourlyVectorModule } from "~/price-hourly-vector/price-hourly-vector.module";
import { PrismaModule } from "~/prisma/prisma.module";
import { StripeModule } from "~/stripe/stripe.module";
import { TransactionModule } from "~/transaction/transaction.module";
import { UserModule } from "~/user/user.module";
import { VectorGraphModule } from "~/vector-graph/vector-graph.module";

import { AppRouter } from "./app.router";

@Module({
  imports: [
    TRPCModule.forRoot({
      autoSchemaFile: "./@generated",
      context: AppContext,
      basePath: "/core/trpc",
    }),
    ConfigModule.forRoot({
      load: [getConfigService],
      validate: env => envSchema.parse(env),
      isGlobal: true,
    }),
    HealthModule,
    EnvModule,
    CacheModule,
    DatabaseModule,
    UserModule,
    PortfolioModule,
    PlaidModule,
    AccountModule,
    ClerkModule,
    StripeModule,
    PolygonModule,
    PrismaModule,
    OauthModule,
    EtradeModule,
    AssetModule,
    TransactionModule,
    AuthConnectionModule,
    PositionModule,
    PriceHourlyVectorModule,
    VectorGraphModule,
    LotModule,
    HealthModule,
  ],
  providers: [AppRouter, AppContext],
})
export class AppModule {}
