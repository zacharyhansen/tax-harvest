import type { ReactNode } from 'react';
import type { PortfolioItemFragment } from '~/generated/gql';
import { useSession } from '@clerk/nextjs';

import { createContext, use, useMemo, useState } from 'react';
import {

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

  const ctx = useMemo(() => ({ portfolio: data?.portfolioAuthed, reload: async () => {
    setReloading(true);
    await session?.reload();
    await refetch();
    setReloading(false);
  } }), [data?.portfolioAuthed, session, refetch]);

  if (loading || reloading) {
    return <LoadingPage message="Loading your Portfolio" />;
  }

  if (error || !ctx?.portfolio) {
    return <ErrorPage message="Unable to load portfolio" />;
  }

  return (
    <PortfolioContext.Provider
    // @ts-expect-error we throw an error if nots not defined
      value={ctx}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  return use(PortfolioContext);
};
