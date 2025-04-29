import type React from 'react';
import { createContext, useContext, useMemo, type ReactNode } from 'react';

import { useUserQuery, type UserItemFragment } from '~/generated/gql';
import { ErrorPage, LoadingPage } from '~/modules/utility-components';

interface UserContextType {
  user: UserItemFragment;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const { data, error, loading } = useUserQuery();

  const value = useMemo(
    () => ({
      user: {
        ...data?.userCurrent,
      },
    }),
    [data]
  );

  if (loading) {
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
