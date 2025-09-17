import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ApolloDriver, type ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { GraphQLModule } from '@nestjs/graphql';
import { ScheduleModule } from '@nestjs/schedule';
import GraphQLJSON from 'graphql-type-json';
import { AccountModule } from '~/account/account.module';
import { AssetModule } from '~/asset/asset.module';
import { ClerkGuard } from '~/auth/guards/clerk.guard';
import { AuthConnectionModule } from '~/auth-connection/auth-connection.module';
import { CacheModule } from '~/cache/cache.module';
import { ClerkModule } from '~/clerk/clerk.module';
import { CronTasksModule } from '~/cron-tasks/cron-tasks.module';
import { DatabaseModule } from '~/database/database.module';
import { EmailModule } from '~/email/email.module';
import { envSchema } from '~/env/env.schema';
import { EtradeModule } from '~/etrade/etrade.module';
import { FileModule } from '~/file/file.module';
import { HealthModule } from '~/health/health.module';
import { LogsModule } from '~/logs/logs.module';
import { LotModule } from '~/lot/lot.module';
import { LotTransactionBatchModule } from '~/lot-transaction-batch/lot-transaction-batch.module';
import { MultiChangeSetModule } from '~/multi-change-set/multi-change-set.module';
import { NotificationModule } from '~/notification/notification.module';
import { OauthModule } from '~/oauth/oauth.module';
import { PlaidModule } from '~/plaid/plaid.module';
import { PolygonModule } from '~/polygon/polygon.module';
import { PortfolioModule } from '~/portfolio/portfolio.module';
import { PositionModule } from '~/position/position.module';
import { PriceHourlyVectorModule } from '~/price-hourly-vector/price-hourly-vector.module';
import { PrismaModule } from '~/prisma/prisma.module';
import { StripeModule } from '~/stripe/stripe.module';
import { TransactionModule } from '~/transaction/transaction.module';
import { UserModule } from '~/user/user.module';
import { VectorGraphModule } from '~/vector-graph/vector-graph.module';
import { errorFormatPlugin } from '../plugins/error-format';

@Module({
	imports: [
		ConfigModule.forRoot({
			validate: (env) => envSchema.parse(env),
			isGlobal: true,
		}),
		EventEmitterModule.forRoot(),
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
		...(process.env.CRON_ENABLED === 'true' ? [ScheduleModule.forRoot()] : []),
		PrismaModule,
		HealthModule,
		CacheModule,
		DatabaseModule,
		UserModule,
		PortfolioModule,
		PlaidModule,
		AccountModule,
		ClerkModule,
		PolygonModule,
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
		StripeModule,
		EmailModule,
		NotificationModule,
		MultiChangeSetModule,
		CronTasksModule,
	],
	providers: [{ provide: APP_GUARD, useClass: ClerkGuard }],
})
export class AppModule {}
