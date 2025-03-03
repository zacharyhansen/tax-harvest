import type { TDatabase } from "~/database/database";

import { Inject } from "@nestjs/common";
import { Input, Mutation, Query, Router } from "nestjs-trpc";
import { z } from "zod";

import { type ColumnEnabledRecord, ViewService } from "./view.service";
import { ViewDefinition } from "./view.types";

@Router({ alias: "view" })
export class ViewRouter {
  constructor(@Inject(ViewService) private viewService: ViewService) {}

  @Query({
    input: z.object({ name: z.string(), id: z.string() }),
    output: ViewDefinition,
  })
  viewDefinition(@Input("id") id: string, @Input("name") name: string) {
    return this.viewService.viewDefinition({
      viewName: name,
      id,
      configuration_schema: "foundation",
    });
  }

  @Mutation({
    input: z.object({
      rootViewName: z.string(),
      columnEnabledRecords: z
        .object({
          name: z.string(),
        })
        .catchall(z.any())
        .array(),
    }),
    output: z.literal("ok"),
  })
  async mutateViewsForRoles(
    @Input("rootViewName") rootViewName: keyof TDatabase,
    @Input("columnEnabledRecords")
    columnEnabledRecords: ColumnEnabledRecord[],
  ) {
    await this.viewService.mutateRoleViews({
      columnEnabledRecords,
      rootViewName,
      environmentSchema: "foundation",
    });
    return "ok";
  }
}
