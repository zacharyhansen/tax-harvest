import type { DB } from "kysely-codegen";

import { Kysely } from "kysely";

export type TDatabase = DB & {
  // Manually add some system catalog objects that kysely doesnt seem to include by default
  pg_views: {
    schemaname: string;
    viewname: string;
    definition: string;
    viewowner: string;
  };
  "foundation.views": {
    // this is actually information_schema but the types are weird
    table_name: string;
    table_schema: string;
    view_definition: string | null; // Typically nullable
  };
  "information_schema.views": {
    table_name: string;
    table_schema: string;
    view_definition: string | null; // Typically nullable
  };
};

export class Database extends Kysely<TDatabase> {}
