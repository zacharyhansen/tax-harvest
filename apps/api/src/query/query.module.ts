import { Module } from "@nestjs/common";

import { DatabaseModule } from "~/database/database.module";

import { QueryService } from "./query.service";

@Module({
  exports: [QueryService],
  imports: [DatabaseModule],
  providers: [QueryService],
})
export class QueryModule {}
