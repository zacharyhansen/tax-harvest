import { Kysely, sql, type Transaction } from 'kysely';

import type { DB } from './db.d';

export class Database extends Kysely<DB> {
	static bypassRLS(trx: Transaction<DB>) {
		return sql`
    SELECT 
      set_config('app.bypass_rls', 'on', TRUE),
      set_config('app.current_portfolio_id', '00000000-0000-0000-0000-000000000000', TRUE)
  `.execute(trx);
	}
}

export async function executeWithRLS<T>(
	kyselyClient: Kysely<DB>,
	portfolioId: string,
	callback: (trx: Transaction<DB>) => Promise<T>,
) {
	return await kyselyClient.transaction().execute(async (trx) => {
		// set transaction level auth variables and run transaction
		await sql`
    SELECT set_config('app.current_portfolio_id', ${portfolioId}::text, TRUE);
  `.execute(trx);
		return await callback(trx);
	});
}
