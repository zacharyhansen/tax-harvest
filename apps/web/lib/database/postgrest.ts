import { PostgrestClient } from '@supabase/postgrest-js';

import type { Database } from './database.types';

const postgrest = new PostgrestClient<Database>(
  process.env.NEXT_PUBLIC_POSTGREST_URL!
);

export default postgrest;
