import { initTRPC } from "@trpc/server";
import { z } from "zod";

const t = initTRPC.create();
const publicProcedure = t.procedure;

const appRouter = t.router({
  app: t.router({ greeting: publicProcedure.input(z.object({ name: z.string() })).output(z.object({ message: z.string() })).query(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any) }),
  view: t.router({
    viewDefinition: publicProcedure.input(z.object({ name: z.string(), id: z.string() })).output(z.object({
      table_name: z.string(),
      view_definition: z.string().nullable(),
      table_schema: z.string(),
    })).query(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    mutateViewsForRoles: publicProcedure.input(z.object({
      rootViewName: z.string(),
      columnEnabledRecords: z
        .object({
          name: z.string(),
        })
        .catchall(z.any())
        .array(),
    })).output(z.literal("ok")).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any)
  }),
  query: t.router({ execute: publicProcedure.input(z.object({ query: z.string() })).output(z.any()).query(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any) }),
  dataset: t.router({
    dataset: publicProcedure.input(z.object({
      datasetId: z.string(),
    })).output(z
      .object({
        id: z.string(),
        configuration_schema: z.nativeEnum(schema),
        dataview_id: z.string().nullable(),
        query: z.string(),
        dataview: DataviewOutputSchema.nullable(),
        dataset_link_filter: z.array(
          z.object({
            dataset_id: z.string(),
            source_view_name: z.string(),
            source_column_name: z.string(),
            target_view_name: z.string(),
            target_column_name: z.string(),
            configuration_schema: z.string(),
            dataview_column_id: z.string(),
            path: z.string(),
          }),
        ),
        roleViews: z.array(z.string()).nullable(), // API adds this
      })
      .catch(error => {
        console.error("DatasetOutputSchema Validation Error:", error.error.issues);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: JSON.stringify(error.error.format()),
        });
      })).query(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    insertDataViewRelation: publicProcedure.input(z.object({
      parent_dataview_id: z.string(),
      role_column_name: z.string(),
      role_view_name: z.string(),
      dataset_id: z.string(),
      related_role_view_name: z.string(),
      constraint: z.string(),
    })).output(z
      .object({
        id: z.string(),
        configuration_schema: z.nativeEnum(schema),
        dataview_id: z.string().nullable(),
        query: z.string(),
        dataview: DataviewOutputSchema.nullable(),
        dataset_link_filter: z.array(
          z.object({
            dataset_id: z.string(),
            source_view_name: z.string(),
            source_column_name: z.string(),
            target_view_name: z.string(),
            target_column_name: z.string(),
            configuration_schema: z.string(),
            dataview_column_id: z.string(),
            path: z.string(),
          }),
        ),
        roleViews: z.array(z.string()).nullable(), // API adds this
      })
      .catch(error => {
        console.error("DatasetOutputSchema Validation Error:", error.error.issues);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: JSON.stringify(error.error.format()),
        });
      })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any)
  })
});
export type AppRouter = typeof appRouter;

