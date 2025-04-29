import { Global, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { PostgresDialect } from "kysely";
import pg from "pg";

import { fetchGCPSecrets } from "~/env/gcp-secrets/fetch-secrets";

import { Database } from "./database";

@Global()
@Module({
  exports: [Database, "PoolReadOnly"],
  providers: [
    {
      inject: [ConfigService],
      provide: Database,
      useFactory: async (configService: ConfigService) => {
        console.log({
          SECRET_SOURCE: configService.get<string>("SECRET_SOURCE"),
        });

        if (
          configService.get("SECRET_SOURCE") === "LOCAL" ||
          !configService.get("SECRET_SOURCE")
        ) {
          return new Database({
            log: event => {
              if (event.level === "error") {
                console.error("Query failed :", {
                  milliseconds: event.queryDurationMillis,
                  error: event.error,
                  sql: event.query.sql,
                  params: event.query.parameters,
                });
              } else {
                // console.info("Query executed :", {
                //   milliseconds: event.queryDurationMillis,
                //   sql: event.query.sql,
                //   params: event.query.parameters,
                // });
              }
            },
            dialect: new PostgresDialect({
              pool: new pg.Pool({
                database: process.env.DATABASE_NAME,
                host: process.env.DATABASE_HOST,
                password: process.env.DATABASE_PASSWORD,
                port: Number.parseInt(
                  process.env.DATABASE_PORT?.toString() ?? "5432",
                ),
                user: process.env.DATABASE_USER,
              }),
            }),
          });
        }

        const secrets = await fetchGCPSecrets();

        return new Database({
          log: event => {
            if (event.level === "error") {
              console.error("query:error:", {
                milliseconds: event.queryDurationMillis,
                error: event.error,
                sql: event.query.sql,
                params: event.query.parameters,
              });
            } else {
              console.info("query:success:", {
                milliseconds: event.queryDurationMillis,
                sql: event.query.sql,
                params: event.query.parameters,
              });
            }
          },
          dialect: new PostgresDialect({
            pool: new pg.Pool({
              database: secrets.DATABASE_NAME,
              host: secrets.DATABASE_HOST,
              password: secrets.DATABASE_PASSWORD,
              port: Number.parseInt(
                secrets.DATABASE_PORT?.toString() ?? "5432",
              ),
              user: secrets.DATABASE_USER,
            }),
          }),
        });
      },
    },
    {
      inject: [ConfigService],
      provide: "PoolReadOnly",
      useFactory: async (configService: ConfigService) => {
        console.info({
          SECRET_SOURCE: configService.get<string>("SECRET_SOURCE"),
        });

        if (
          configService.get("SECRET_SOURCE") === "LOCAL" ||
          !configService.get("SECRET_SOURCE")
        ) {
          return new pg.Pool({
            database: process.env.DATABASE_NAME,
            host: process.env.DATABASE_HOST,
            password: process.env.DATABASE_PASSWORD,
            port: Number.parseInt(
              process.env.DATABASE_PORT?.toString() ?? "5432",
            ),
            user: process.env.DATABASE_USER,
          });
        }

        const secrets = await fetchGCPSecrets();

        return new pg.Pool({
          database: secrets.DATABASE_NAME,
          host: secrets.DATABASE_HOST,
          password: secrets.DATABASE_PASSWORD,
          port: Number.parseInt(secrets.DATABASE_PORT?.toString() ?? "5432"),
          user: secrets.DATABASE_USER,
        });
      },
    },
  ],
  imports: [ConfigModule],
})
export class DatabaseModule {}
