'use client';

import { SetUpStatus, usePortfolioSummaryQuery } from '~/generated/gql';
import { NoAccounts } from '~/modules/account';
import { HarvestSummaryCards } from '~/modules/harvest';
import { PageWrapper } from '~/modules/layout';
import { LotsTable } from '~/modules/lot';
import { ErrorPage, LoadingPage } from '~/modules/utility-components';

export default function HomePage() {
	const { data, loading, error } = usePortfolioSummaryQuery();

	if (!data && loading) {
		return <LoadingPage message="Retrieving your portfolio information" />;
	}

	if (error) {
		return <ErrorPage message={error.message} />;
	}

	if (!data && loading) {
		return <LoadingPage message="Retrieving your portfolio information" />;
	}

	if (data?.portfolioSummary.setUpStatus === SetUpStatus.NoAccounts) {
		return (
			<PageWrapper>
				<NoAccounts />
			</PageWrapper>
		);
	}

	return (
		<PageWrapper className="w-full flex-col gap-4">
			<div className="mb-4 w-full">
				<div className="bg-linear-to-r relative overflow-hidden rounded-lg from-yellow-500 to-green-500">
					{/* Patterned background */}
					<div className="absolute inset-0 opacity-10">
						{/** biome-ignore lint/a11y/noSvgWithoutTitle: <ok> */}
						<svg
							className="size-full"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 100 100"
						>
							<defs>
								{/** biome-ignore lint/correctness/useUniqueElementIds: <ok> */}
								<pattern
									id="dollarPattern"
									x="0"
									y="0"
									width="10%"
									height="10%"
									patternUnits="userSpaceOnUse"
								>
									<text
										x="50%"
										y="50%"
										dominantBaseline="middle"
										textAnchor="middle"
										fontSize="10"
										fill="currentColor"
										fontWeight="bold"
									>
										$
									</text>
								</pattern>
							</defs>
							<rect width="100%" height="100%" fill="url(#dollarPattern)" />
						</svg>
					</div>
				</div>
			</div>
			<HarvestSummaryCards />
			<LotsTable />
		</PageWrapper>
	);
}
