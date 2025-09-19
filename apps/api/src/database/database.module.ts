import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
	DeduplicateJoinsPlugin,
	HandleEmptyInListsPlugin,
	PostgresDialect,
	replaceWithNoncontingentExpression,
} from 'kysely';
import pg from 'pg';

import { Database } from './database';

@Global()
@Module({
	exports: [Database],
	providers: [
		{
			inject: [ConfigService],
			provide: Database,
			useFactory: async () => {
				return new Database({
					log: (event) => {
						if (event.level === 'error') {
							console.error('query:error: ', {
								milliseconds: event.queryDurationMillis,
								error: event.error,
								sql: event.query.sql,
								params: event.query.parameters,
							});
						}
						// if (event.level === 'query') {
						//   console.info('query:success: ', {
						//     milliseconds: event.queryDurationMillis,
						//     sql: event.query.sql,
						//     params: event.query.parameters,
						//   })
						// }
					},
					dialect: new PostgresDialect({
						pool: new pg.Pool({
							connectionString: process.env.DATABASE_URL,
						}),
					}),
					plugins: [
						new HandleEmptyInListsPlugin({
							strategy: replaceWithNoncontingentExpression,
						}),
						new DeduplicateJoinsPlugin(),
					],
				});
			},
		},
	],
	imports: [ConfigModule],
})
export class DatabaseModule {}
