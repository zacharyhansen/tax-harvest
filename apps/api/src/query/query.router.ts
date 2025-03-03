import { Inject } from "@nestjs/common";
import { sql } from "kysely";
import { Input, Query, Router } from "nestjs-trpc";
import { z } from "zod";

import { Database } from "~/database/database";

import { QueryService } from "./query.service";

@Router({ alias: "query" })
export class QueryRouter {
  constructor(
    @Inject(QueryService) private queryService: QueryService,
    @Inject(Database) private readonly database: Database,
  ) {}

  @Query({
    input: z.object({ query: z.string() }),
    output: z.any(),
  })
  async execute(@Input("query") query: string) {
    return this.queryService.execute({
      query: sql.raw(query).compile(this.database),
    });
  }
}
