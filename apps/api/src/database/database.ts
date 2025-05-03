import type { DB } from './db.d'

import { Kysely } from 'kysely'

export class Database extends Kysely<DB> {}
