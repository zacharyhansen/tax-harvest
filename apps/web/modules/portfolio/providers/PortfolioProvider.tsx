import type { ReactNode } from 'react';
import type { PortfolioItemFragment } from '~/generated/gql';
import { useSession } from '@clerk/nextjs';

import { createContext, use, useMemo, useState } from 'react';
import { usePortfolioAuthedQuery } from '~/generated/gql';
import { ErrorPage } from '~/modules/utility-components';
import LoadingScreen from '~/app/main/loading';
import { PortfolioSwitcher } from '../portfolio-switcher';
import { SidebarProvider } from '@repo/ui/components/sidebar';

const PortfolioContext = createContext<{
  portfolio: PortfolioItemFragment;
  reload: () => void;
  /* Here we type PortfolioContext to always exist so every component does not need
  to check it itself - below we never render the child tree until it does exist to make
  the undefined default value ok to pass
  */
  // @ts-expect-error ts(2345) this get populated by the usePortfolioAuthedQuery hook
}>(undefined);

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const { session } = useSession();
  const [reloading, setReloading] = useState(false);
  const { data, error, loading, refetch } = usePortfolioAuthedQuery();

  const ctx = useMemo(
    () => ({
      portfolio: data?.portfolioAuthed ?? '',
      reload: async () => {
        setReloading(true);
        await session?.reload();
        await refetch();
        setReloading(false);
      },
    }),
    [data?.portfolioAuthed, session, refetch]
  );

  if (loading || reloading) {
    return <LoadingScreen />;
  }

  if (error && !ctx?.portfolio) {
    return (
      <PortfolioContext.Provider
        // @ts-expect-error we throw an error if nots not defined
        value={ctx}
      >
        <ErrorPage message="Unable to load portfolio. Please switch to a different portfolio.">
          <div className="flex h-full w-full items-center justify-center p-4">
            <SidebarProvider>
              <PortfolioSwitcher />
            </SidebarProvider>
          </div>
        </ErrorPage>
      </PortfolioContext.Provider>
    );
  }

  return (
    <PortfolioContext.Provider
      // @ts-expect-error we throw an error if nots not defined
      value={ctx}
    >
      {ctx.portfolio ? children : <LoadingScreen />}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  return use(PortfolioContext);
}
