import type { AppTrpcContext } from "~/auth/types";

import { Inject } from "@nestjs/common";
import { Ctx, Input, Mutation, Query, Router } from "nestjs-trpc";
import { z } from "zod";

import { DatasetService } from "./dataset.service";
import {
  DatasetOutputSchema,
  InsertDataViewRelationSchema,
} from "./dataset.types";

@Router({ alias: "dataset" })
export class DatasetRouter {
  constructor(@Inject(DatasetService) private datasetService: DatasetService) {}

  @Query({
    input: z.object({
      datasetId: z.string(),
    }),
    output: DatasetOutputSchema,
  })
  async dataset(
    @Ctx() context: AppTrpcContext,
    @Input("datasetId") datasetId: string,
  ) {
    const dataset = await this.datasetService.dataset({
      datasetId,
      configuration_schema: context.clerkclaims.configuration_schema,
    });
    return dataset;
  }

  @Mutation({
    input: InsertDataViewRelationSchema,
    output: DatasetOutputSchema,
  })
  async insertDataViewRelation(
    @Ctx() context: AppTrpcContext,
    @Input("role_view_name") role_view_name: string,
    @Input("related_role_view_name") related_role_view_name: string,
    @Input("parent_dataview_id") parent_dataview_id: string,
    @Input("role_column_name") role_column_name: string,
    @Input("dataset_id") dataset_id: string,
    @Input("constraint") constraint: string,
  ) {
    return this.datasetService.insertDataViewRelation({
      role_view_name,
      related_role_view_name,
      configuration_schema: context.clerkclaims.configuration_schema,
      parent_dataview_id,
      role_column_name,
      dataset_id,
      constraint,
    });
  }
}
