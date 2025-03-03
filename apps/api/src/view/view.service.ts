import type {
  AuthSchema,
  ConfigurationColumn,
  ConfigurationRoleColumn,
  ConfigurationRoleView,
  ConfigurationView,
} from "kysely-codegen";
import type { QueryArrayResult } from "pg";
import type { z } from "zod";

import { Inject, Injectable, Logger } from "@nestjs/common";
import { supported_pg_data_type } from "@prisma/client";
import { type Insertable, sql } from "kysely";

import { Database, type TDatabase } from "~/database/database";
import { type QueryField, QueryService } from "~/query/query.service";
import { SchematicService } from "~/schematic/schematic.service";

import {
  PGDataCellMap,
  PostgresSupportedDataTypeIdMap,
  ViewDefinition,
} from "./view.types";

interface Role {
  configuration_schema: AuthSchema;
  name: string;
}

export interface ColumnEnabledRecord {
  /**
   * This is assumed to be unique for list as a view cannot have multiple columns of the same name (id is unique within ALL ocnfig (all schems etc.))
   */
  name: string;
  is_pk?: boolean | null;
  [key: string]: boolean | string | null | undefined;
}

@Injectable()
export class ViewService {
  private readonly logger = new Logger(ViewService.name);

  constructor(
    @Inject(Database) private readonly database: Database,
    private readonly queryService: QueryService,
    private readonly schematicService: SchematicService,
  ) {}

  async syncViews({
    environmentSchemas,
  }: {
    environmentSchemas: AuthSchema[];
    /**
     * Optional list of views to target/limit the sync with - else all root views are synced only
     */
    views?: string[];
  }) {
    const environments = await this.database
      .selectFrom("auth.environment")
      .select(["configuration_schema"])
      .distinct()
      .where("schema", "in", environmentSchemas)
      .execute();

    const configurationSchemas = environments.map(
      env => env.configuration_schema,
    );

    await sql`select create_configuration_schema_views(ARRAY[${sql.join(configurationSchemas)}]::auth.schema[]);`.execute(
      this.database,
    );
    await this.database.transaction().execute(async trx => {
      for (const configuration_schema of configurationSchemas) {
        const { schemaCacheMap, schematicViews, schematicLinks } =
          await this.schematicService.rootSchematic({
            configuration_schema,
          });
        // Get all views from information schema
        // role views will update automatically via cascades
        const databaseViews = await this.database
          .selectFrom("information_schema.views")
          .select(["table_name", "table_schema", "view_definition"])
          .where(
            "table_name",
            "in",
            schematicViews.map(view => view[0].qiName),
          )
          .execute();

        // Create sets for efficient lookups
        const databaseViewSet = new Set(databaseViews.map(v => v.table_name));

        // Fire the view definition to get the underlying column meta data
        const columnResults = await Promise.all(
          databaseViews.map(view =>
            this.queryService.execute<QueryField[]>({
              query: sql`
                ${sql.raw((view.view_definition ?? "").trim().replace(/;$/, ""))}
                LIMIT
                  1;
              `.compile(trx),
            }),
          ),
        );

        /**
         * Map of view name to its column meta data results
         */
        const columnResultsMap = new Map<
          string,
          QueryArrayResult<QueryField[]>
        >(
          columnResults.map((result, viewIndex) => [
            databaseViews[viewIndex].table_name,
            result,
          ]),
        );

        // Get the schema meta data for the tables/columns found via the above tableIDs
        const databaseColumns = await trx
          .selectFrom(`${configuration_schema}.schema_columns`)
          .selectAll()
          .where("table_id", "in", [
            ...new Set<number>(
              columnResults.flatMap(result =>
                result.fields.map(field => field.tableID),
              ),
            ),
          ])
          .execute();

        /**
         * Column info map that can be got by [column.table_id, column.column_id].join('_')
         * !IMPORTANT: These records will only be columns that actually exist in postgres - i.e. calculated columns will not appear (those only appear in the column results from query service)
         */
        const pgColumnMap = new Map(
          databaseColumns.map(column => [
            [column.table_id, column.column_id].join("_"),
            column,
          ]),
        );

        // Delete views that no longer exist
        await trx
          .deleteFrom("configuration.view")
          .where("name", "not in", [...databaseViewSet])
          .where("configuration_schema", "=", configuration_schema)
          .execute();

        // Update or create views and their columns
        for (const databaseView of databaseViews) {
          const databaseViewColumns = columnResultsMap.get(
            databaseView.table_name,
          );

          if (!databaseViewColumns?.fields.length) {
            throw new Error(
              "No columns found for view - this will result in deletion of all columns for view.",
            );
          }

          // Upsert the view record
          const insertedView = await trx
            .insertInto("configuration.view")
            .values(() => {
              const postgrestEntry = schemaCacheMap.get(
                databaseView.table_name,
              );
              return {
                name: databaseView.table_name,
                pg_primary_table: databaseView.table_name
                  .replace("_p_", "")
                  .replace("_c_", ""),
                configuration_schema,
                updated_at: new Date(),
                pgt_deletable: postgrestEntry?.tableDeletable ?? false,
                pgt_description: postgrestEntry?.tableDescription,
                pgt_insertable: postgrestEntry?.tableInsertable ?? false,
                pgt_is_view: postgrestEntry?.tableIsView ?? false,
                pgt_updatable: postgrestEntry?.tableUpdatable ?? false,
                pgt_pk_cols: postgrestEntry?.tablePKCols,
                type: SchematicService.viewType(databaseView.table_name),
              } satisfies Insertable<ConfigurationView>;
            })
            .onConflict(oc =>
              oc.columns(["configuration_schema", "name"]).doUpdateSet(eb => ({
                updated_at: new Date(),
                pg_primary_table: eb.ref("excluded.pg_primary_table"),
                pgt_deletable: eb.ref("excluded.pgt_deletable"),
                pgt_insertable: eb.ref("excluded.pgt_insertable"),
                pgt_description: eb.ref("excluded.pgt_description"),
                pgt_is_view: eb.ref("excluded.pgt_is_view"),
                pgt_updatable: eb.ref("excluded.pgt_updatable"),
                pgt_pk_cols: eb.ref("excluded.pgt_pk_cols"),
              })),
            )
            .returningAll()
            .executeTakeFirstOrThrow();

          // Delete removed columns
          await trx
            .deleteFrom("configuration.column")
            .where("view_name", "=", insertedView.name)
            .where("configuration_schema", "=", configuration_schema)
            .where(
              "name",
              "not in",
              databaseViewColumns.fields.map(field => field.name),
            )
            .execute();

          // Upsert columns
          await trx
            .insertInto("configuration.column")
            .values(
              databaseViewColumns.fields.map(field => {
                // Find the pg column data using the ids if it exists
                const pgColumn = pgColumnMap.get(
                  [field.tableID, field.columnID].join("_"),
                );

                // Find the postgrest Column Info
                let postgrestColumn = schemaCacheMap.get(
                  databaseView.table_name,
                )?.tableColumns[field.name];
                if (
                  SchematicService.hasUnderlyingTable(databaseView.table_name)
                ) {
                  const underlyingColumn = schemaCacheMap.get(
                    databaseView.table_name.replace("_p_", ""),
                  )?.tableColumns[field.name];
                  postgrestColumn = underlyingColumn ?? postgrestColumn;
                }

                const data_type =
                  PostgresSupportedDataTypeIdMap[field.dataTypeID] ??
                  supported_pg_data_type.enum;

                return {
                  configuration_schema,
                  view_name: insertedView.name,
                  name: field.name,

                  oid: field.dataTypeID,
                  table_id: field.tableID,
                  column_id: field.columnID,
                  data_type,
                  pgt_type: postgrestColumn?.colType ?? "unknown",
                  pgt_nominal_type: postgrestColumn?.colNominalType,
                  default_input_type: PGDataCellMap[data_type],
                  pgt_max_len: postgrestColumn?.colMaxLen,
                  pgt_enum: postgrestColumn?.colEnum ?? [],
                  pgt_description: postgrestColumn?.colDescription,
                  pgt_name: postgrestColumn?.colName,
                  pgt_nullable:
                    postgrestColumn?.colNullable ??
                    (pgColumn?.is_nullable === "YES" ? true : false),
                  updated_at: new Date(),
                  // Attributes below will should only be populated for columns that exist as true columns in the DB
                  // We try and fil them using postgrest info first
                  pg_table: pgColumn?.table_name,
                  pg_column: pgColumn?.column_name,
                  is_unique: pgColumn?.has_unique_index ?? undefined,
                  is_updatable: pgColumn?.is_updatable === "YES",
                  is_pk: schemaCacheMap
                    .get(databaseView.table_name)
                    ?.tablePKCols.includes(postgrestColumn?.colName ?? ""),
                  // references_table: pgColumn?.references_table,
                  pgt_default:
                    postgrestColumn?.colDefault?.toString() ??
                    pgColumn?.column_default?.toString(),
                } satisfies Insertable<ConfigurationColumn>;
              }),
            )
            .onConflict(oc =>
              oc
                .columns(["configuration_schema", "view_name", "name"])
                .doUpdateSet(eb => ({
                  updated_at: eb.ref("excluded.updated_at"),
                  oid: eb.ref("excluded.oid"),
                  table_id: eb.ref("excluded.table_id"),
                  column_id: eb.ref("excluded.column_id"),
                  data_type: eb.ref("excluded.data_type"),
                  pgt_type: eb.ref("excluded.pgt_type"),
                  pgt_nominal_type: eb.ref("excluded.pgt_nominal_type"),
                  default_input_type: eb.ref("excluded.default_input_type"),
                  pgt_max_len: eb.ref("excluded.pgt_max_len"),
                  pgt_enum: eb.ref("excluded.pgt_enum"),
                  pgt_description: eb.ref("excluded.pgt_description"),
                  pgt_name: eb.ref("excluded.pgt_name"),
                  pgt_nullable: eb.ref("excluded.pgt_nullable"),
                  pg_table: eb.ref("excluded.pg_table"),
                  pg_column: eb.ref("excluded.pg_column"),
                  is_unique: eb.ref("excluded.is_unique"),
                  is_updatable: eb.ref("excluded.is_updatable"),
                  pgt_default: eb.ref("excluded.pgt_default"),
                  is_pk: eb.ref("excluded.is_pk"),
                })),
            )
            .returning(["name", "view_name"])
            .execute();
        }

        await trx
          .insertInto("configuration.link")
          .values(schematicLinks)
          .onConflict(oc => {
            return oc
              .columns([
                "configuration_schema",
                "source_view_name",
                "source_column_name",
                "target_view_name",
                "target_column_name",
                "junction_view_name",
              ])
              .doUpdateSet(eb => {
                return {
                  type: eb.ref("excluded.type"),
                  pgt_columns: eb.ref("excluded.pgt_columns"),
                  constraint: eb.ref("excluded.constraint"),
                  source_view_name: eb.ref("excluded.source_view_name"),
                  configuration_schema: eb.ref("excluded.configuration_schema"),
                  source_column_name: eb.ref("excluded.source_column_name"),
                  target_view_name: eb.ref("excluded.target_view_name"),
                  target_column_name: eb.ref("excluded.target_column_name"),
                  pgt_is_self: eb.ref("excluded.pgt_is_self"),
                  constraint_2: eb.ref("excluded.constraint_2"),
                  pgt_columns_2: eb.ref("excluded.pgt_columns_2"),
                  junction_view_name: eb.ref("excluded.junction_view_name"),
                  junction_source_column_name: eb.ref(
                    "excluded.junction_source_column_name",
                  ),
                  junction_target_column_name: eb.ref(
                    "excluded.junction_target_column_name",
                  ),
                };
              });
          })
          .execute();
      }
    });

    // sync admin view
    await new Promise(resolve => setTimeout(resolve, 1000));
    await Promise.all(
      configurationSchemas.map(configuration_schema =>
        this.syncRoleViews({
          roleName: "admin",
          configuration_schema,
        }),
      ),
    );
  }

  /**
   * Syncs the configuration records for role views, columns, and links to what is represented in the actual postgres database
   *
   * !IMPORTANT - These operates need to be an upsert and not delete and recreate as their will be additional assets related to them
   *
   * @param views A set of views to only do the schematic for (to filter the schematic for)
   */
  async syncRoleViews({
    roleName,
    configuration_schema,
    trx,
    views,
  }: {
    roleName: string;
    configuration_schema: AuthSchema;
    views?: (keyof TDatabase)[];
    trx?: Database;
  }) {
    const database = trx ?? this.database;

    const { schematicLinks, schematicViews } =
      await this.schematicService.roleSchematic({
        roleName,
        configuration_schema,
        views,
      });

    // Step 1: Upsert all views and delete ones not in DB
    const deleteViewsQuery = database
      .deleteFrom("configuration.role_view")
      .where("configuration_schema", "=", configuration_schema)
      .where(
        "name",
        "not in",
        schematicViews.map(roleView => roleView[0].qiName),
      );
    if (views) {
      // if were only doing this sync for a specifc views we must filter by them
      deleteViewsQuery.where("name", "in", views);
    }
    await Promise.all([
      database
        .insertInto("configuration.role_view")
        .values(
          schematicViews.map(roleView => {
            const name = roleView[0].qiName;

            return {
              name,
              configuration_schema,
              role_name: roleName,
              view_name: name.replace(/__.*/, ""),
              pgt_deletable: roleView[1].tableDeletable,
              pgt_description: roleView[1].tableDescription,
              pgt_insertable: roleView[1].tableInsertable,
              pgt_is_view: roleView[1].tableIsView,
              pgt_updatable: roleView[1].tableUpdatable,
              pgt_pk_cols: roleView[1].tablePKCols,
            } satisfies Insertable<ConfigurationRoleView>;
          }),
        )
        .onConflict(oc =>
          oc.columns(["configuration_schema", "name"]).doUpdateSet(eb => ({
            pgt_deletable: eb.ref("excluded.pgt_deletable"),
            pgt_insertable: eb.ref("excluded.pgt_insertable"),
            pgt_description: eb.ref("excluded.pgt_description"),
            pgt_is_view: eb.ref("excluded.pgt_is_view"),
            pgt_updatable: eb.ref("excluded.pgt_updatable"),
            pgt_pk_cols: eb.ref("excluded.pgt_pk_cols"),
          })),
        )
        .execute(),
      deleteViewsQuery.execute(),
    ]);

    // Step 2: Upsert role columns
    await database
      .insertInto("configuration.role_column")
      .values(
        schematicViews.flatMap(roleView => {
          const role_view_name = roleView[0].qiName;
          return Object.keys(roleView[1].tableColumns).map(name => {
            return {
              name,
              configuration_schema,
              role_view_name,
              view_name: SchematicService.rootViewFromRoleView({
                rootView: role_view_name as keyof TDatabase,
              }),
            } satisfies Insertable<ConfigurationRoleColumn>;
          });
        }),
      )
      .onConflict(oc => oc.doNothing())
      .returningAll()
      .execute();

    // Step 3: delete role columns from prexisting view - break this up by view so "not in" statements dont overflow
    await Promise.all(
      schematicViews.map(roleView => {
        const role_view_name = roleView[0].qiName;
        return database
          .deleteFrom("configuration.role_column")
          .where("configuration_schema", "=", configuration_schema)
          .where("role_view_name", "=", role_view_name)
          .where("name", "not in", Object.keys(roleView[1].tableColumns))
          .execute();
      }),
    );

    // Step 4: Upsert Links
    if (schematicLinks.length > 0) {
      await database
        .insertInto("configuration.role_link")
        .values(schematicLinks)
        .onConflict(oc => oc.doNothing())
        .returningAll()
        .execute();
    }

    // Step 5: Delete links
    // For now I am going to aassume that cascades will delete these properly - if a role view or any column used in a link is removed the link should also get deleted
  }

  async mutateRoleViews({
    columnEnabledRecords,
    environmentSchema,
    rootViewName,
  }: {
    columnEnabledRecords: ColumnEnabledRecord[];
    rootViewName: keyof TDatabase;
    environmentSchema: AuthSchema;
  }) {
    const configuration_schema = await this.configurationSchema({
      schema: environmentSchema,
    });
    // Get the current roles in the system
    const roles = (await this.database
      .selectFrom("configuration.role")
      .where("name", "!=", "admin")
      .where("configuration_schema", "=", configuration_schema)
      .selectAll()
      .execute()) as Role[];

    const roleColumns = new Map<string, Record<string, boolean>>(
      roles.map(role => [role.name, {}]),
    );

    // Loop over the records per column and build the result per role into roleColumns
    for (const role of roles) {
      const atLeastOneColumnEnabledForRole = columnEnabledRecords.some(record =>
        Boolean(record[role.name]),
      );

      // If we are enabling at least one column we set the PK record to enabled as well for the role
      if (atLeastOneColumnEnabledForRole) {
        const pkRecord = columnEnabledRecords.find(
          record => record.is_pk === true,
        );
        if (pkRecord) {
          pkRecord[role.name] = true;
        }
      }

      for (const record of columnEnabledRecords) {
        roleColumns.set(role.name, {
          ...roleColumns.get(role.name),
          // See if the column is enabled for the role
          [record.name]: Boolean(
            // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
            record[role.name] ||
              // Auto add primary key if any column is enabled
              (record.is_pk && atLeastOneColumnEnabledForRole),
          ),
        });
      }
    }

    // For now we are going to drop and recreate - create and replace has potential conflicts via column renaming
    const databaseRoleViews: [keyof TDatabase, Role][] = [];
    await this.database.transaction().execute(async trx => {
      // Step 1: Rebuild role views in database
      await Promise.all(
        roles.map(async role => {
          const roleViewName = SchematicService.roleViewName({
            rootViewName,
            role,
          });
          // first drop the view for each role
          const columns: string[] = Object.entries(
            roleColumns.get(role.name) ?? [],
          )
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .filter(([_key, value]) => value)
            .map(([key]) => key);

          await trx.schema
            .dropView(`${environmentSchema}.${roleViewName}`)
            .ifExists()
            .execute();

          // Then create it if there are columns
          // eslint-disable-next-line unicorn/prefer-ternary
          if (columns.length > 0) {
            await trx.schema
              .createView(`${environmentSchema}.${roleViewName}`)
              .orReplace()
              .as(
                this.database
                  // @ts-expect-error columns whould work
                  .selectFrom(`${environmentSchema}.${rootViewName}`)
                  // @ts-expect-error columns whould work
                  .select(columns),
              )
              .execute();
            databaseRoleViews.push([roleViewName, role]);
          } else {
            await trx // view is already gone in the DB - we also need to remove its role_view record
              .deleteFrom("configuration.role_view")
              .where(
                "name",
                "=",
                SchematicService.roleViewName({ rootViewName, role }),
              )
              .where("configuration_schema", "=", configuration_schema)
              .execute();
          }
        }),
      );
    });
    // Close the transaction so the postgrest server updates
    // TODO: this is so bad - maybe move this to be triggered by postgrest update itself
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Step 2: Resync each of the views per role
    if (databaseRoleViews.length > 0) {
      await Promise.all(
        databaseRoleViews.map(roleView =>
          this.syncRoleViews({
            roleName: roleView[1].name,
            views: [roleView[0]],
            configuration_schema,
          }),
        ),
      );
    }
    return "ok";
  }

  async viewDefinition({
    viewName,
    configuration_schema,
  }: {
    viewName: string;
    id: string;
    configuration_schema: AuthSchema;
  }): Promise<z.infer<typeof ViewDefinition>> {
    const view = await this.database
      .selectFrom("information_schema.views")
      .select(["table_name", "table_schema", "view_definition"])
      .where("table_name", "=", viewName)
      .where("table_schema", "=", configuration_schema)
      .executeTakeFirstOrThrow();

    return view;
  }

  async configurationSchema({ schema: clientSchema }: { schema: AuthSchema }) {
    return this.database
      .selectFrom("auth.environment")
      .where("schema", "=", clientSchema)
      .select(["configuration_schema"])
      .executeTakeFirstOrThrow()
      .then(env => env.configuration_schema);
  }
}
