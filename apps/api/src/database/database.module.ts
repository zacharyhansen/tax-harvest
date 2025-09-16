import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PostgresDialect } from 'kysely';
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
				console.log('DATABASE_URL', process.env.DATABASE_URL);
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
				});
			},
		},
	],
	imports: [ConfigModule],
})
export class DatabaseModule {}
