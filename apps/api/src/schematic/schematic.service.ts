import type { Insertable, Selectable } from "kysely";
import type {
  AuthSchema,
  ConfigurationLink,
  FoundationRole,
} from "kysely-codegen";

import { Injectable, Logger } from "@nestjs/common";

import { type TDatabase } from "~/database/database";
import { EnvService } from "~/env/env.service";

import { isM2MRelationCardinality, type SchemaCache } from "./schematic.types";

const SchematicIsNotRoleViewMatch = /^(?!.*__).*$/;

@Injectable()
export class SchematicService {
  private readonly logger = new Logger(SchematicService.name);

  constructor(private readonly envService: EnvService) {}

  async schemaCache() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const schemaCache: SchemaCache = await fetch(
      `${this.envService.get("POSTGREST_ORIGIN")}/schema_cache`,
      {
        headers: {
          "Accept-Profile": "foundation",
        },
      },
    ).then(response => response.json());
    return schemaCache;
  }

  async rootSchematic({
    configuration_schema,
  }: {
    configuration_schema: AuthSchema;
  }) {
    return this.schematic({
      configuration_schema,
      tableMatcher: tableName => SchematicService.isSchematicView(tableName),
    });
  }

  async roleSchematic({
    configuration_schema,
    roleName,
    views,
  }: {
    configuration_schema: AuthSchema;
    roleName: string;
    views?: (keyof TDatabase)[];
  }) {
    return this.schematic({
      configuration_schema,
      tableMatcher: tableName =>
        SchematicService.isSchematicRoleView(tableName, roleName),
      views,
    });
  }

  /**
   * Gets a relevant schematic
   * @param schema schema to build a schematic for
   * @param tableMatcher Matched that determines if tables or relationships are relevant to the schematic
   * @param views A set of views to only do the schematic for (to filter the schematic for)
   */
  async schematic({
    configuration_schema,
    tableMatcher,
    views,
  }: {
    configuration_schema: AuthSchema;
    tableMatcher: (tableName: keyof TDatabase) => boolean;
    views?: (keyof TDatabase)[];
  }) {
    const schemaCache = await this.schemaCache();
    const schemaCacheMap = new Map(
      schemaCache.dbTables.map(table => [table[0].qiName, table[1]]),
    );

    const tableFilter = (
      tableName: keyof TDatabase,
      _configuration_schema: AuthSchema,
    ) =>
      views
        ? tableMatcher(tableName) && views.includes(tableName)
        : tableMatcher(tableName);

    return {
      schemaCacheMap,
      schematicViews: schemaCache.dbTables.filter(table =>
        tableFilter(
          table[0].qiName as keyof TDatabase,
          table[0].qiSchema as AuthSchema,
        ),
      ),
      schematicLinks: schemaCache.dbRelationships
        // remove links for anthing but those product or custom views we want to expose
        .filter(link =>
          tableFilter(
            link[0][0].qiName as keyof TDatabase,
            link[0][1] as AuthSchema,
          ),
        )
        .flatMap(link => {
          // filter links to only those product or custom views we want to expose
          const applicableLinks = link[1].filter(linkItem => {
            return isM2MRelationCardinality(linkItem.relCardinality)
              ? tableFilter(
                  linkItem.relCardinality.contents.junTable
                    .qiName as keyof TDatabase,
                  linkItem.relCardinality.contents.junTable
                    .qiSchema as AuthSchema,
                ) &&
                  tableFilter(
                    linkItem.relForeignTable.qiName as keyof TDatabase,
                    linkItem.relForeignTable.qiSchema as AuthSchema,
                  )
              : tableFilter(
                  linkItem.relForeignTable.qiName as keyof TDatabase,
                  linkItem.relForeignTable.qiSchema as AuthSchema,
                );
          });

          return applicableLinks.map(linkItem => {
            if (isM2MRelationCardinality(linkItem.relCardinality)) {
              return {
                type: linkItem.relCardinality.tag,
                pgt_columns: linkItem.relCardinality.contents.junColsSource[0],
                pgt_columns_2:
                  linkItem.relCardinality.contents.junColsTarget[0],
                constraint: linkItem.relCardinality.contents.junConstraint1,
                constraint_2: linkItem.relCardinality.contents.junConstraint2,
                source_view_name: linkItem.relTable.qiName,
                source_column_name:
                  linkItem.relCardinality.contents.junColsSource[0][0],
                target_view_name: linkItem.relForeignTable.qiName,
                target_column_name:
                  linkItem.relCardinality.contents.junColsTarget[0][0],
                junction_view_name:
                  linkItem.relCardinality.contents.junTable.qiName,
                junction_source_column_name:
                  linkItem.relCardinality.contents.junColsSource[0][1],
                junction_target_column_name:
                  linkItem.relCardinality.contents.junColsTarget[0][1],
                pgt_is_self: linkItem.relIsSelf,
                display_name: linkItem.relCardinality.tag,
                configuration_schema,
              } satisfies Insertable<ConfigurationLink>;
            }

            return {
              type: linkItem.relCardinality.tag,
              pgt_columns: linkItem.relCardinality.relColumns[0],
              constraint: linkItem.relCardinality.relCons,
              source_view_name: linkItem.relTable.qiName,
              source_column_name: linkItem.relCardinality.relColumns[0][0],
              target_view_name: linkItem.relForeignTable.qiName,
              target_column_name: linkItem.relCardinality.relColumns[0][1],
              pgt_is_self: linkItem.relIsSelf,
              display_name: linkItem.relCardinality.tag,
              configuration_schema,
            } satisfies Insertable<ConfigurationLink>;
          });
        }),
    };
  }

  static isSchematicView(viewName: string) {
    return (
      (viewName.startsWith("_p_") || viewName.startsWith("_c_")) &&
      SchematicIsNotRoleViewMatch.test(viewName)
    );
  }

  static isSchematicRoleView(viewName: string, role: string): boolean {
    const roleRegex = new RegExp(`__${role}$`);
    return (
      (viewName.startsWith("_p_") || viewName.startsWith("_c_")) &&
      roleRegex.test(viewName)
    );
  }

  static viewType(viewName: string) {
    return viewName.startsWith("_p_") ? "product" : "custom";
  }

  static hasUnderlyingTable(viewName: string) {
    return viewName.startsWith("_p_");
  }

  /** Deterministic name of the view based on the role and source view */
  static roleViewName({
    rootViewName,
    role,
  }: {
    rootViewName: string;
    role: Selectable<FoundationRole>;
  }): keyof TDatabase {
    return `${rootViewName}__${role.name}` as keyof TDatabase;
  }

  /** Deterministic name of the root view that role vq_view's are created from */
  static rootViewName({ tableName }: { tableName: string }): keyof TDatabase {
    return `_p_${tableName}` as keyof TDatabase;
  }

  static rootViewFromRoleView({
    rootView,
  }: {
    rootView: keyof TDatabase;
  }): keyof TDatabase {
    return rootView.replace(/__.*/, "") as keyof TDatabase;
  }

  // /**
  //  * Extracts the primary table (the pg table name) of a view according to our stated view naming conventions
  //  * @param viewName Name of the view we are trying to get the primary table from
  //  * @returns table or undefined if none is found
  //  */
  // static extractTableNameFromViewName(
  //   viewName: string | null
  // ): string | undefined {
  //   if (!viewName) return undefined;
  //   const match = /__([^_]*?)__/.exec(viewName);
  //   return match ? match[1] : undefined;
  // }
}
