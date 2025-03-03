import { useOrganization } from '@clerk/nextjs';
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query';
import type React from 'react';
import { createContext, useContext, useMemo, type ReactNode } from 'react';

import type { EnumsAuth, TablesAuth } from '~/lib/database/helpers';
import postgrest from '~/lib/database/postgrest';

type Schema = EnumsAuth<'schema'>;

// Define the context type
interface EnvironmentContextType {
  configuration_schema: Schema;
  environment_schema: Schema;
  environment: TablesAuth<'environment'>;
}

const EnvironmentContext = createContext<EnvironmentContextType | undefined>(
  undefined
);

interface EnvironmentProviderProps {
  children: ReactNode;
}

export const EnvironmentProvider: React.FC<EnvironmentProviderProps> = ({
  children,
}) => {
  const { organization } = useOrganization();

  const environment_schema = organization?.publicMetadata
    .environment_schema as Schema;
  const configuration_schema = organization?.publicMetadata
    .configuration_schema as Schema;

  const { data: environment } = useQuery(
    postgrest
      .schema(environment_schema)
      .from('environment')
      .select('*')
      .eq('schema', environment_schema)
      .single()
  );

  const value = useMemo(
    () => ({
      configuration_schema,
      environment_schema,
      environment: environment as TablesAuth<'environment'>,
    }),
    [environment_schema, configuration_schema, environment]
  );

  return (
    <EnvironmentContext.Provider value={value}>
      {children}
    </EnvironmentContext.Provider>
  );
};

// Custom hook to use the SchemaContext
export const useEnvironment = (): EnvironmentContextType => {
  const context = useContext(EnvironmentContext);
  if (!context) {
    throw new Error('useSchema must be used within a SchemaProvider');
  }
  return context;
};
