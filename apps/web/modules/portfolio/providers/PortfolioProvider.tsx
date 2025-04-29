import { useSession } from '@clerk/nextjs';
import { createContext, type ReactNode, useContext, useState } from 'react';

import {
  type PortfolioItemFragment,
  usePortfolioAuthedQuery,
} from '~/generated/gql';
import { ErrorPage, LoadingPage } from '~/modules/utility-components';

const PortfolioContext = createContext<{
  portfolio: PortfolioItemFragment;
  reload: () => void;
  /* Here we type PortfolioContext to always exist so every component does not need 
  to check it itself - below we never render the child tree until it does exist to make 
  the undefined default value ok to pass
  */
  // @ts-expect-error ts(2345) this get populated by the usePortfolioAuthedQuery hook
}>(undefined);

export const PortfolioProvider = ({ children }: { children: ReactNode }) => {
  const { session } = useSession();
  const [reloading, setReloading] = useState(false);
  const { data, error, loading, refetch } = usePortfolioAuthedQuery();

  if (loading || reloading) {
    return <LoadingPage message="Loading your Portfolio" />;
  }

  if (error ?? !data?.portfolioAuthed) {
    return <ErrorPage message="Unable to load portfolio" />;
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
      value={{ portfolio: data.portfolioAuthed, reload: handleReload }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  return useContext(PortfolioContext);
};
