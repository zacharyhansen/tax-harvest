import { Kysely } from 'kysely'

import { DB } from './db.d'

export class Database extends Kysely<DB> {}
