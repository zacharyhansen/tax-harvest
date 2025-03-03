import { useAuth } from '@clerk/nextjs';
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query';
import type React from 'react';
import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { useEnvironment } from './environment.provider';

import type { Database } from '~/lib/database/database.types';
import postgrest from '~/lib/database/postgrest';
import { ErrorPage, LoadingPage } from '~/modules/utility-components';

type User = Database['foundation']['Tables']['user']['Row'];
type Role = Database['configuration']['Tables']['role']['Row'];
const clerkConfiguratorRoles = new Set(['org:admin', 'org:configurator']);

interface Configurator {
  isConfigurator: boolean;
  isAdmin: boolean;
  isConfiguring: boolean;
}

interface UserContextType extends Configurator {
  user: User;
  setRoleImpersonation: (role?: Role) => void;
  toggleConfiguring: VoidFunction;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  // read isConfiguring from local storage
  const isConfiguring = localStorage.getItem('isConfiguring');

  const { environment_schema } = useEnvironment();
  const { userId, orgRole } = useAuth();
  const [roleImpersonation, setRoleImpersonation] = useState<Role>();
  const [configurator, setConfigurator] = useState<Configurator>({
    isConfigurator: clerkConfiguratorRoles.has(orgRole ?? ''),
    isAdmin: orgRole === 'org:admin',
    isConfiguring: isConfiguring === 'true',
  });

  const { data, isLoading, error } = useQuery(
    postgrest
      .schema(environment_schema)
      .from('user')
      .select(`*`)
      .eq('user_id', userId!)
      .single()
  );

  const value = useMemo(
    () => ({
      user: {
        ...data,
        role_name:
          roleImpersonation?.name && configurator.isConfiguring
            ? roleImpersonation.name
            : data?.role_name,
      },
      setRoleImpersonation,
      ...configurator,
      toggleConfiguring: () => {
        setConfigurator(previous => {
          localStorage.setItem(
            'isConfiguring',
            (!previous.isConfiguring).toString()
          );
          return {
            ...previous,
            isConfiguring: !previous.isConfiguring,
          };
        });
      },
    }),
    [data, roleImpersonation, setConfigurator, configurator]
  );

  if (isLoading) {
    return <LoadingPage />;
  }

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!value.user) {
    console.error(JSON.stringify(error));
    return <ErrorPage message="Unable to find user in system." />;
  }

  // @ts-expect-error typing issues
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// Custom hook to use the UserContext
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
