import type { DB } from "kysely-codegen";

import { Kysely } from "kysely";

export class Database extends Kysely<DB> {}
