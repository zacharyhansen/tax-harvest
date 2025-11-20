import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ApolloDriver, type ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { GraphQLModule } from '@nestjs/graphql';
import { ScheduleModule } from '@nestjs/schedule';
import { GraphQLScalarType, Kind } from 'graphql';
import { BigIntResolver } from 'graphql-scalars';
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
import { FileModule } from '~/file/file.module';
import { HealthModule } from '~/health/health.module';
import { LogsModule } from '~/logs/logs.module';
import { LotModule } from '~/lot/lot.module';
import { LotApplicationModule } from '~/lot-application/lot-application.module';
import { LotModelModule } from '~/lot-model/lot-model.module';
import { LotUploadModule } from '~/lot-upload/lot-upload.module';
import { MultiChangeSetModule } from '~/multi-change-set/multi-change-set.module';
import { NotificationModule } from '~/notification/notification.module';
import { OauthModule } from '~/oauth/oauth.module';
import { PlaidModule } from '~/plaid/plaid.module';
import { PlaidInstitutionModule } from '~/plaid-institution/plaid-institution.module';
import { PlaidMergeModule } from '~/plaid-merge/plaid-merge.module';
import { PolygonModule } from '~/polygon/polygon.module';
import { PortfolioModule } from '~/portfolio/portfolio.module';
import { PortfolioConnectModule } from '~/portfolio-connect/portfolio-connect.module';
import { PortfolioSnapshotModule } from '~/portfolio-snapshot/portfolio-snapshot.module';
import { PositionModule } from '~/position/position.module';
import { PriceHourlyVectorModule } from '~/price-hourly-vector/price-hourly-vector.module';
import { PrismaModule } from '~/prisma/prisma.module';
import { StripeModule } from '~/stripe/stripe.module';
import { TransactionModule } from '~/transaction/transaction.module';
import { UserModule } from '~/user/user.module';
import { VectorGraphModule } from '~/vector-graph/vector-graph.module';
import { errorFormatPlugin } from '../plugins/error-format';

// Custom ID scalar that handles bigint → string
const BigIntID = new GraphQLScalarType({
	name: 'ID',
	description: 'Custom ID scalar that coerces bigint → string',
	serialize(value: unknown) {
		if (typeof value === 'bigint') return value.toString();
		if (typeof value === 'number') return value.toString();
		return String(value);
	},
	parseValue(value: unknown) {
		return value; // keep as string for input
	},
	parseLiteral(ast) {
		if (ast.kind === Kind.INT || ast.kind === Kind.STRING) {
			return ast.value;
		}
		return null;
	},
});

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
			resolvers: {
				JSON: GraphQLJSON,
				BigInt: BigIntResolver,
				ID: BigIntID, // override built-in ID globally
			},
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
		PortfolioSnapshotModule,
		PlaidModule,
		PlaidInstitutionModule,
		PortfolioConnectModule,
		AccountModule,
		ClerkModule,
		PolygonModule,
		OauthModule,
		LotApplicationModule,
		AssetModule,
		TransactionModule,
		AuthConnectionModule,
		PositionModule,
		PriceHourlyVectorModule,
		VectorGraphModule,
		LotModule,
		LotModelModule,
		LotUploadModule,
		HealthModule,
		FileModule,
		LogsModule,
		PlaidMergeModule,
		StripeModule,
		EmailModule,
		NotificationModule,
		MultiChangeSetModule,
		CronTasksModule,
	],
	providers: [{ provide: APP_GUARD, useClass: ClerkGuard }],
})
export class AppModule {}
