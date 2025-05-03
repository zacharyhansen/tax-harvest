import type { ApolloDriverConfig } from '@nestjs/apollo'
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default'
import { ApolloDriver } from '@nestjs/apollo'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { GraphQLModule } from '@nestjs/graphql'
import GraphQLJSON from 'graphql-type-json'
// comment
import { AccountModule } from '~/account/account.module'
import { AssetModule } from '~/asset/asset.module'
import { AuthConnectionModule } from '~/auth-connection/auth-connection.module'
import { ClerkGuard } from '~/auth/guards/clerk.guard'
import { CacheModule } from '~/cache/cache.module'
import { ClerkModule } from '~/clerk/clerk.module'
import { DatabaseModule } from '~/database/database.module'
import { EnvModule } from '~/env/env.module'
import { envSchema } from '~/env/env.schema'
import getConfigService from '~/env/gcp-secrets/get-config-service'
import { EtradeModule } from '~/etrade/etrade.module'
import { FileModule } from '~/file/file.module'
import { HealthModule } from '~/health/health.module'
import { LogsModule } from '~/logs/logs.module'
import { LotTransactionBatchModule } from '~/lot-transaction-batch/lot-transaction-batch.module'
import { LotModule } from '~/lot/lot.module'
import { OauthModule } from '~/oauth/oauth.module'
import { PlaidModule } from '~/plaid/plaid.module'
import { PolygonModule } from '~/polygon/polygon.module'
import { PortfolioModule } from '~/portfolio/portfolio.module'
import { PositionModule } from '~/position/position.module'
import { PriceHourlyVectorModule } from '~/price-hourly-vector/price-hourly-vector.module'
import { PrismaModule } from '~/prisma/prisma.module'
import { StripeModule } from '~/stripe/stripe.module'
import { TransactionModule } from '~/transaction/transaction.module'
import { UserModule } from '~/user/user.module'
import { VectorGraphModule } from '~/vector-graph/vector-graph.module'

import { errorFormatPlugin } from '../plugins/error-format'

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      autoSchemaFile:
        process.env.NODE_ENV === 'development' ? './schema.graphql' : true,
      buildSchemaOptions: {},
      driver: ApolloDriver,
      introspection: process.env.NODE_ENV === 'development',
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault(), errorFormatPlugin],
      resolvers: { JSON: GraphQLJSON },
      sortSchema: true,
      useGlobalPrefix: true,
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
    FileModule,
    LogsModule,
    LotTransactionBatchModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: ClerkGuard }],
})
export class AppModule {}
