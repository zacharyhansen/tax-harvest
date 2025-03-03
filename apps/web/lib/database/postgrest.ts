import { PostgrestClient } from '@supabase/postgrest-js';
// import type { MergeDeep } from 'type-fest';

import type { Database as DatabaseGenerated } from './database.types';
import type { TablesConfiguration } from './helpers';

export type Database = DatabaseGenerated & {
  foundation: {
    Views: {
      layout: {
        Row: TablesConfiguration<'layout'>;
      };
      tile: {
        Row: TablesConfiguration<'tile'>;
      };
      widget: {
        Row: TablesConfiguration<'widget'>;
      };
      dataset: {
        Row: TablesConfiguration<'widget'>;
      };
    };
  };
};

const postgrest = new PostgrestClient<Database>(
  process.env.NEXT_PUBLIC_POSTGREST_URL!
);

export default postgrest;
