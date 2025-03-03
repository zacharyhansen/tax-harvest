import type { AuthSchema } from "kysely-codegen";
import type {
  DatasetOutput,
  DataviewColumnOuput,
  DataviewOutput,
  InsertDataViewRelation,
} from "./dataset.types";

import { Inject, Injectable } from "@nestjs/common";

import { Database } from "~/database/database";

@Injectable()
export class DatasetService {
  constructor(@Inject(Database) private readonly database: Database) {}

  async insertDataViewRelation({
    dataset_id,
    role_view_name,
    parent_dataview_id,
    constraint,
    related_role_view_name,
    role_column_name,
    configuration_schema,
  }: InsertDataViewRelation & {
    configuration_schema: AuthSchema;
  }): Promise<DatasetOutput> {
    await this.database.transaction().execute(async trx => {
      const insertedDataView = await trx
        .insertInto("configuration.dataview")
        .values({
          configuration_schema,
          constraint,
          dataset_id,
          role_view_name: related_role_view_name,
        })
        .returningAll()
        .executeTakeFirstOrThrow();

      await trx
        .insertInto("configuration.dataview_column")
        .values({
          configuration_schema,
          parent_dataview_id,
          role_view_name,
          role_column_name,
          child_dataview_id: insertedDataView.id,
        })
        .returningAll()
        .executeTakeFirstOrThrow();
    });
    return this.dataset({
      datasetId: dataset_id,
      configuration_schema,
    });
  }

  /**
   * Uses published if no version is provided
   */
  async dataset({
    datasetId,
    configuration_schema,
  }: {
    datasetId: string;
    resolve?: boolean;
    configuration_schema: AuthSchema;
  }): Promise<DatasetOutput> {
    const [dataset, dataviews, dataset_link_filter] = await Promise.all([
      this.database
        .selectFrom("configuration.dataset")
        .selectAll()
        .where("configuration_schema", "=", configuration_schema)
        .where("id", "=", datasetId)
        .executeTakeFirstOrThrow(),
      this.database
        .selectFrom("configuration.dataview")
        .selectAll()
        .where("configuration_schema", "=", configuration_schema)
        .where("dataset_id", "=", datasetId)
        .execute(),
      this.database
        .selectFrom("configuration.dataset_link_filter")
        .selectAll()
        .where("configuration_schema", "=", configuration_schema)
        .where("dataset_id", "=", datasetId)
        .execute(),
    ]);

    if (dataviews.length === 0) {
      return {
        ...dataset,
        roleViews: null,
        dataview: null,
        dataset_link_filter,
      };
    }

    const [columns, role_views] = await Promise.all([
      this.database
        .selectFrom("configuration.dataview_column")
        .where("configuration_schema", "=", configuration_schema)
        .where(
          "parent_dataview_id",
          "in",
          dataviews.map(dataview => dataview.id),
        )
        .selectAll()
        .orderBy("order", "asc")
        .execute(),
      this.database
        .selectFrom("configuration.role_view")
        .selectAll()
        .where(
          "name",
          "in",
          dataviews.map(dataview => dataview.role_view_name),
        )
        .where("configuration_schema", "=", configuration_schema)
        .execute(),
    ]);

    // Put the child dataview on each column
    const columnsWithChildDataview: DataviewColumnOuput[] = columns.map(
      column => {
        const childDataview = dataviews.find(
          dataview => dataview.id === column.child_dataview_id,
        );
        return {
          ...column,
          child_dataview: childDataview
            ? {
                ...childDataview,
                dataview_column: null,
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                role_view: role_views.find(
                  role_view => role_view.name === childDataview.role_view_name,
                )!,
              }
            : null,
        };
      },
    );

    // Put the columns and role_view on the parent dataviews
    const dataviewsWithColumns: DataviewOutput[] = dataviews.map(dataview => ({
      ...dataview,
      dataview_column: columnsWithChildDataview.filter(
        column => column.parent_dataview_id === dataview.id,
      ),
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      role_view: role_views.find(
        role_view => role_view.name === dataview.role_view_name,
      )!,
    }));

    const result: DatasetOutput = {
      ...dataset,
      dataview: DatasetService.resolveDataview({
        rootDataview: dataviewsWithColumns.find(
          dataview => dataview.id === dataset.dataview_id,
        ),
        columnsWithChildDataview: columnsWithChildDataview,
      }),
      roleViews: [...new Set(dataviews.map(view => view.role_view_name))],
      dataset_link_filter,
    };
    await this.generateQuery({
      datasetId,
      dataset: result,
      configuration_schema,
    });

    return result;
  }

  async generateQuery({
    datasetId,
    configuration_schema,
    dataset,
  }: {
    datasetId: string;
    configuration_schema: AuthSchema;
    dataset?: DatasetOutput;
  }): Promise<DatasetOutput> {
    const ds: DatasetOutput =
      dataset ??
      (await this.dataset({
        datasetId,
        configuration_schema,
      }));

    if (!ds.dataview) {
      throw new Error("No root dataview exists for the dataset.");
    }

    ds.query = DatasetService.processDataviewQuery({
      dataview: ds.dataview,
    });

    await this.database
      .updateTable("configuration.dataset")
      .where("configuration_schema", "=", configuration_schema)
      .where("id", "=", datasetId)
      .set({
        query: ds.query,
      })
      .execute();

    return ds;
  }

  static processDataviewQuery({
    dataview,
  }: {
    dataview: DataviewOutput;
  }): string {
    const columns = dataview.dataview_column?.map(
      column => column.role_column_name,
    );
    const relations = dataview.dataview_column
      ?.filter(column => !!column.child_dataview)
      .map(
        column =>
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          `${column.child_dataview?.role_view_name}!${column.child_dataview?.constraint}(${DatasetService.processDataviewQuery({ dataview: column.child_dataview! })})`,
      );
    return [...(columns ?? []), ...(relations ?? [])].join(`,\n`);
  }

  static resolveDataview({
    rootDataview,
    columnsWithChildDataview,
  }: {
    rootDataview?: DataviewOutput;
    columnsWithChildDataview: DataviewColumnOuput[];
  }): DataviewOutput | null {
    if (!rootDataview) return null;
    const queue: DataviewOutput[] = [{ ...rootDataview }];
    const result = queue[0];
    while (queue.length > 0) {
      const currentDataview = queue.pop();
      if (!currentDataview) return result;
      currentDataview.dataview_column = columnsWithChildDataview.filter(
        column => column.parent_dataview_id === currentDataview.id,
      );
      for (const column of currentDataview.dataview_column) {
        if (column.child_dataview) {
          queue.push(column.child_dataview);
        }
      }
    }
    return result;
  }
}
