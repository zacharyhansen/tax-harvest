import { useAuth } from '@clerk/nextjs';
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query';
import type React from 'react';
import { createContext, useContext, useMemo, type ReactNode } from 'react';

import type { Tables } from '~/lib/database/database.types';
import postgrest from '~/lib/database/postgrest';
import { ErrorPage, LoadingPage } from '~/modules/utility-components';

interface UserContextType {
  user: Tables<'User'>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const { userId } = useAuth();

  const { data, isLoading, error } = useQuery(
    postgrest.from('User').select(`*`).eq('id', userId!).single()
  );

  const value = useMemo(
    () => ({
      user: {
        ...data,
      },
    }),
    [data]
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
