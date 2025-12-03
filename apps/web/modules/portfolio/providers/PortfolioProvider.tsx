import { useApolloClient } from '@apollo/client';
import { useSession, useUser } from '@clerk/nextjs';
import { Button } from '@repo/ui/components/button';
import { SidebarProvider } from '@repo/ui/components/sidebar';
import type { ReactNode } from 'react';
import { createContext, use, useEffect, useMemo, useState } from 'react';
import LoadingScreen from '~/app/main/loading';
import type { PortfolioItemFragment } from '~/generated/gql';
import { usePortfolioAuthedQuery } from '~/generated/gql';
import { ErrorPage } from '~/modules/utility-components';
import CreatePortfolioDialog from '../CreatePortfolioDialog';
import { PortfolioSwitcher } from '../portfolio-switcher';

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
	const apolloClient = useApolloClient();
	const [reloading, setReloading] = useState(false);
	const { data, error, loading } = usePortfolioAuthedQuery();
	const { user } = useUser();

	const ctx = useMemo(
		() => ({
			portfolio: data?.portfolioAuthed ?? '',
			reload: async () => {
				setReloading(true);
				await session?.clearCache();
				await session?.reload();
				await apolloClient.resetStore();
				await apolloClient.refetchQueries({ include: 'all' });
				setReloading(false);
			},
		}),
		[data?.portfolioAuthed, session, apolloClient],
	);

	// If at any point for new users or switching portfolios we reload to make sure the user is authed for the correct portfolio
	useEffect(() => {
		if (
			data?.portfolioAuthed &&
			user?.publicMetadata.portfolioId !== data?.portfolioAuthed.id
		) {
			ctx.reload();
		}
	}, [data, user?.publicMetadata.portfolioId, ctx.reload]);

	if (loading || reloading) {
		return <LoadingScreen />;
	}

	if (error && !ctx?.portfolio) {
		return (
			<PortfolioContext.Provider
				// @ts-expect-error we throw an error if nots not defined
				value={ctx}
			>
				<ErrorPage message="Unable to load portfolio. Please switch to a different portfolio or create a new one.">
					<CreatePortfolioDialog>
						<Button className="w-full" variant="outline">
							Create Portfolio
						</Button>
					</CreatePortfolioDialog>
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
