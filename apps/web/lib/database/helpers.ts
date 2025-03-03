import type { Database } from './database.types';

export type FoundationSchema = Database[Extract<keyof Database, 'foundation'>];

export type TablesFoundation<
  FoundationTableNameOrOptions extends
    | keyof (FoundationSchema['Tables'] & FoundationSchema['Views'])
    | { schema: keyof Database },
  TableName extends FoundationTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof (Database[FoundationTableNameOrOptions['schema']]['Tables'] &
        Database[FoundationTableNameOrOptions['schema']]['Views'])
    : never = never,
> = FoundationTableNameOrOptions extends { schema: keyof Database }
  ? (Database[FoundationTableNameOrOptions['schema']]['Tables'] &
      Database[FoundationTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : FoundationTableNameOrOptions extends keyof (FoundationSchema['Tables'] &
        FoundationSchema['Views'])
    ? (FoundationSchema['Tables'] &
        FoundationSchema['Views'])[FoundationTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

// Configuration Helpers
type ConfigurationSchema = Database['configuration'];

export type TablesConfiguration<
  ConfigurationTableNameOrOptions extends
    | keyof (ConfigurationSchema['Tables'] & ConfigurationSchema['Views'])
    | { schema: keyof Database },
  TableName extends ConfigurationTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof (Database[ConfigurationTableNameOrOptions['schema']]['Tables'] &
        Database[ConfigurationTableNameOrOptions['schema']]['Views'])
    : never = never,
> = ConfigurationTableNameOrOptions extends { schema: keyof Database }
  ? (Database[ConfigurationTableNameOrOptions['schema']]['Tables'] &
      Database[ConfigurationTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : ConfigurationTableNameOrOptions extends keyof (ConfigurationSchema['Tables'] &
        ConfigurationSchema['Views'])
    ? (ConfigurationSchema['Tables'] &
        ConfigurationSchema['Views'])[ConfigurationTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesConfigurationInsert<
  ConfigurationTableNameOrOptions extends
    | keyof ConfigurationSchema['Tables']
    | { schema: keyof Database },
  TableName extends ConfigurationTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[ConfigurationTableNameOrOptions['schema']]['Tables']
    : never = never,
> = ConfigurationTableNameOrOptions extends { schema: keyof Database }
  ? Database[ConfigurationTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : ConfigurationTableNameOrOptions extends keyof ConfigurationSchema['Tables']
    ? ConfigurationSchema['Tables'][ConfigurationTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesConfigurationUpdate<
  ConfigurationTableNameOrOptions extends
    | keyof ConfigurationSchema['Tables']
    | { schema: keyof Database },
  TableName extends ConfigurationTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[ConfigurationTableNameOrOptions['schema']]['Tables']
    : never = never,
> = ConfigurationTableNameOrOptions extends { schema: keyof Database }
  ? Database[ConfigurationTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : ConfigurationTableNameOrOptions extends keyof ConfigurationSchema['Tables']
    ? ConfigurationSchema['Tables'][ConfigurationTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type EnumsConfiguration<
  PublicEnumNameOrOptions extends
    | keyof ConfigurationSchema['Enums']
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof ConfigurationSchema['Enums']
    ? ConfigurationSchema['Enums'][PublicEnumNameOrOptions]
    : never;

// Auth Helpers

type AuthSchema = Database['auth'];

export type TablesAuth<
  AuthTableNameOrOptions extends
    | keyof (AuthSchema['Tables'] & AuthSchema['Views'])
    | { schema: keyof Database },
  TableName extends AuthTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof (Database[AuthTableNameOrOptions['schema']]['Tables'] &
        Database[AuthTableNameOrOptions['schema']]['Views'])
    : never = never,
> = AuthTableNameOrOptions extends { schema: keyof Database }
  ? (Database[AuthTableNameOrOptions['schema']]['Tables'] &
      Database[AuthTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : AuthTableNameOrOptions extends keyof (AuthSchema['Tables'] &
        AuthSchema['Views'])
    ? (AuthSchema['Tables'] &
        AuthSchema['Views'])[AuthTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesAuthInsert<
  AuthTableNameOrOptions extends
    | keyof AuthSchema['Tables']
    | { schema: keyof Database },
  TableName extends AuthTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[AuthTableNameOrOptions['schema']]['Tables']
    : never = never,
> = AuthTableNameOrOptions extends { schema: keyof Database }
  ? Database[AuthTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : AuthTableNameOrOptions extends keyof AuthSchema['Tables']
    ? AuthSchema['Tables'][AuthTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesAuthUpdate<
  AuthTableNameOrOptions extends
    | keyof AuthSchema['Tables']
    | { schema: keyof Database },
  TableName extends AuthTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[AuthTableNameOrOptions['schema']]['Tables']
    : never = never,
> = AuthTableNameOrOptions extends { schema: keyof Database }
  ? Database[AuthTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : AuthTableNameOrOptions extends keyof AuthSchema['Tables']
    ? AuthSchema['Tables'][AuthTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type EnumsAuth<
  PublicEnumNameOrOptions extends
    | keyof AuthSchema['Enums']
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof AuthSchema['Enums']
    ? AuthSchema['Enums'][PublicEnumNameOrOptions]
    : never;
