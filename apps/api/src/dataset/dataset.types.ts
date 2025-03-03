import { $Enums, ag_pinned, input_type, schema } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { AuthSchema } from "kysely-codegen";
import { z } from "zod";
// TODO: This while file is repeated in packages/utils so the FE can have access to the recursive types
// DOnt have time right now to figure out the importingissue of utls into nestjs

// Inputs
export const DataviewColumnInputSchema = z.object({
  role_column_name: z.string(),
});

export const DataviewInputSchema: z.ZodType = z.lazy(() =>
  z.object({
    role_view_name: z.string(),
    constraint: z.string(),
    dataview_column: z.array(DataviewColumnInputSchema),
    dataview: z.array(DataviewInputSchema),
  }),
);

export const DatasetInputSchema = z.object({
  name: z.string(),
  id: z.string().optional(),
  dataview_id: DataviewInputSchema,
});

export const CreateDatasetSchema = z.object({
  name: z.string(),
  description: z.string(),
  role_view_name: z.string(),
});

export const InsertDataViewRelationSchema = z.object({
  parent_dataview_id: z.string(),
  role_column_name: z.string(),
  role_view_name: z.string(),
  dataset_id: z.string(),
  related_role_view_name: z.string(),
  constraint: z.string(),
});
export type DatasetInput = z.infer<typeof DatasetInputSchema>;
export type InsertDataViewRelation = z.infer<
  typeof InsertDataViewRelationSchema
>;

// Outputs
export interface DataviewOutput {
  id: string;
  dataset_id: string;
  role_view_name: string;
  constraint: string;
  configuration_schema: AuthSchema;
  dataview_column: DataviewColumnOuput[] | null;
  role_view: {
    name: string;
    role_name: string;
    view_name: string;
    pgt_deletable: boolean;
    pgt_description: string | null;
    pgt_insertable: boolean;
    pgt_is_view: boolean;
    pgt_updatable: boolean;
    pgt_pk_cols: string[] | null;
  };
}

export interface DataviewColumnOuput {
  id: string;
  role_column_name: string;
  role_view_name: string;
  configuration_schema: string;
  parent_dataview_id: string;
  child_dataview_id: string | null;
  label: string | null;
  description: string | null;
  order: number;
  input_type: input_type;
  ag_pinned: ag_pinned | null;
  ag_width: number;
  ag_min_width: number;
  ag_flex: number | null;
  ag_editable: boolean;
  ag_resizable: boolean;
  child_dataview: DataviewOutput | null;
}

// Now define the schemas using z.lazy() for the circular reference
export const DataviewOutputSchema: z.ZodType<DataviewOutput> = z.lazy(() =>
  z.object({
    id: z.string(),
    dataset_id: z.string(),
    role_view_name: z.string(),
    constraint: z.string(),
    configuration_schema: z.nativeEnum(schema),
    dataview_column: z.array(DataviewColumnOuputSchema).nullable(),
    role_view: z.object({
      name: z.string(),
      role_name: z.string(),
      view_name: z.string(),
      pgt_deletable: z.boolean(),
      pgt_description: z.string().nullable(),
      pgt_insertable: z.boolean(),
      pgt_is_view: z.boolean(),
      pgt_updatable: z.boolean(),
      pgt_pk_cols: z.array(z.string()),
    }),
  }),
);

export const DataviewColumnOuputSchema: z.ZodType<DataviewColumnOuput> = z.lazy(
  () =>
    z.object({
      id: z.string(),
      role_column_name: z.string(),
      configuration_schema: z.string(),
      role_view_name: z.string(),
      parent_dataview_id: z.string(),
      child_dataview_id: z.string().nullable(),
      label: z.string().nullable(),
      description: z.string().nullable(),
      order: z.number(),
      input_type: z.nativeEnum($Enums.input_type),
      ag_pinned: z.nativeEnum($Enums.ag_pinned).nullable(),
      ag_width: z.number(),
      ag_min_width: z.number(),
      ag_flex: z.number().nullable(),
      ag_editable: z.boolean(),
      ag_resizable: z.boolean(),
      hidden: z.boolean(),
      child_dataview: DataviewOutputSchema.nullable(),
    }),
);

export const DatasetOutputSchema = z
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
  });

export type DatasetOutput = z.infer<typeof DatasetOutputSchema>;
