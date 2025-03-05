import { UserButton, useSession } from '@clerk/nextjs';
import { Alert } from '@repo/ui/components/alert';
import type { ReactNode } from 'react';
import { createContext, useContext, useState } from 'react';

import { trpc, type TRPCOutput } from '~/lib/trpc';
import { LoadingPage } from '~/modules/utility-components';

const PortfolioContext = createContext<{
  portfolio: TRPCOutput['portfolio']['portfolioAuthed'];
  reload: () => void;
  /* Here we type PortfolioContext to always exist so every component does not need 
  to check it itself - below we never render the child tree until it does exist to make 
  the undefined default value ok to pass
  */
  // @ts-expect-error ts(2345) it will be populated
}>(undefined);

export const PortfolioProvider = ({ children }: { children: ReactNode }) => {
  const { session } = useSession();
  const [reloading, setReloading] = useState(false);
  const {
    data,
    error,
    isLoading: loading,
    refetch,
  } = trpc.portfolio.portfolioAuthed.useQuery();

  if (loading || reloading) {
    return <LoadingPage message="Loading your Portfolio" />;
  }

  if (error || !data) {
    return (
      <div>
        <Alert variant="destructive">
          Could not load portfolio at this time. If this issue persists please
          contact support @support
          <UserButton />
        </Alert>
      </div>
    );
  }

  const handleReload = async () => {
    setReloading(true);
    await session?.reload();
    await refetch();
    setReloading(false);
    return;
  };
  return (
    <PortfolioContext.Provider
      value={{ portfolio: data, reload: handleReload }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  return useContext(PortfolioContext);
};
