'use client';

import { SetUpStatus, usePortfolioSummaryQuery } from '~/generated/gql';
import { NoAccounts } from '~/modules/account';
import { PageWrapper } from '~/modules/layout';
import { LotsTable } from '~/modules/lot';
import {
	ModelPanel,
	ModelStateProvider,
	ModelSummaryFooter,
} from '~/modules/model';
import { ErrorPage, LoadingPage } from '~/modules/utility-components';

function HomePageContent() {
	return (
		<div className="relative flex flex-col w-full h-screen overflow-hidden">
			{/* Main scrollable content area */}
			<div className="mx-auto flex flex-col h-full pb-[150px] pt-[10px] overflow-x-auto max-w-full px-5">
				<LotsTable />
			</div>

			{/* Sticky footer */}
			<ModelSummaryFooter />

			{/* Model panel */}
			<ModelPanel />
		</div>
	);
}

export default function HomePage() {
	const { data, loading, error } = usePortfolioSummaryQuery();

	if (!data && loading) {
		return <LoadingPage message="Retrieving your portfolio information" />;
	}

	if (error) {
		return <ErrorPage message={error.message} />;
	}

	if (data?.portfolioSummary.setUpStatus === SetUpStatus.NoAccounts) {
		return (
			<PageWrapper>
				<NoAccounts />
			</PageWrapper>
		);
	}

	return (
		<ModelStateProvider>
			<HomePageContent />
		</ModelStateProvider>
	);
}
