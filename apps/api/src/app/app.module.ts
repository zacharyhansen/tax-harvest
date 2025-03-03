import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TRPCModule } from "nestjs-trpc";

// import SuperJSON from "superjson";
import { AppContext } from "~/auth/trpc/clerk-context";
import { CacheModule } from "~/cache/cache.module";
import { DatabaseModule } from "~/database/database.module";
import { DatasetModule } from "~/dataset/dataset.module";
import { DatasetRouter } from "~/dataset/dataset.router";
import { EnvModule } from "~/env/env.module";
import { envSchema } from "~/env/env.schema";
import getConfigService from "~/env/gcp-secrets/get-config-service";
import { HealthModule } from "~/health/health.module";
import { QueryModule } from "~/query/query.module";
import { QueryRouter } from "~/query/query.router";
import { SchematicModule } from "~/schematic/schematic.module";
import { ViewModule } from "~/view/view.module";
import { ViewRouter } from "~/view/view.router";

import { AppRouter } from "./app.router";

@Module({
  imports: [
    TRPCModule.forRoot({
      autoSchemaFile: "./@generated",
      context: AppContext,
      // transformer: SuperJSON,
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
    DatasetModule,
    QueryModule,
    SchematicModule,
    ViewModule,
  ],
  providers: [AppRouter, ViewRouter, QueryRouter, DatasetRouter, AppContext],
})
export class AppModule {}
