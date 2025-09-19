'use client';

import ReactJsonView from '@microlink/react-json-view';
import { Button } from '@repo/ui/components/button';
import { AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { use } from 'react';

import { useLogQuery } from '~/generated/gql';
import { TypedRoutes } from '~/lib/routes';
import { PageWrapper } from '~/modules/layout';
import { ErrorPage, LoadingPage } from '~/modules/utility-components';
import { ExternalSyncLogView } from './external-sync-log-view';
import { InvestmentsHoldingsLogView } from './investments-holdings-log-view';
import { PlaidTrxMergeErrorLogView } from './plaid-trx-merge-error-log-view';
import { PlaidTrxMergeSuccessLogView } from './plaid-trx-merge-success-view';
import { PlaidTrxMergeLogView } from './plaid-trx-merge-view';

export default function LogPage(props: {
	params: Promise<typeof TypedRoutes.log.params>;
}) {
	const params = use(props.params);
	const theme = useTheme();
	const router = useRouter();
	const safeParams = TypedRoutes.log.parse(params);

	const { data, error, loading } = useLogQuery({
		variables: { logId: safeParams.logId },
	});

	if (error) {
		return <ErrorPage message={JSON.stringify(error)} />;
	}

	if (loading) {
		return <LoadingPage />;
	}

	return (
		<PageWrapper
			title="Log Explorer"
			description={
				<div className="space-y-4">
					<div className="grid grid-cols-2 gap-2">
						<div className="flex gap-2">
							<span className="font-bold">ID:</span>
							<span>{data?.log?.id}</span>
						</div>
						<div className="flex gap-2">
							<span className="font-bold">Description:</span>
							<span>{data?.log?.description}</span>
						</div>
						<div className="flex gap-2">
							<span className="font-bold">Type:</span>
							<span>{data?.log?.type}</span>
						</div>
						<div className="flex gap-2">
							<span className="font-bold">Source:</span>
							<span>{data?.log?.source}</span>
						</div>
					</div>
					{data?.log?.mergeError && data.log.mergeError.length > 0 && (
						<div className="border-t pt-4">
							<div className="flex items-center gap-4">
								<div className="flex items-center gap-2">
									<AlertTriangle className="h-5 w-5 text-yellow-500" />
									<span className="font-bold">Associated Merge Errors:</span>
								</div>
								{data.log.mergeError.map((error) => (
									<div key={error.id} className="flex items-center gap-2">
										<span
											className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
												error.resolved
													? 'bg-green-100 text-green-700'
													: 'bg-yellow-100 text-yellow-700'
											}`}
										>
											{error.assetSymbol} - {error.type}
										</span>
										<Button
											onClick={() =>
												router.push(
													TypedRoutes.mergeError({ mergeErrorId: error.id }),
												)
											}
											variant="outline"
											size="sm"
										>
											View Merge Error
										</Button>
									</div>
								))}
							</div>
						</div>
					)}
				</div>
			}
		>
			{data?.log?.type === 'PLAID_TRX_MERGE' ? (
				<PlaidTrxMergeLogView data={data.log.data} />
			) : data?.log?.type === 'PLAID_TRX_MERGE_ERROR' ? (
				<PlaidTrxMergeErrorLogView data={data.log.data} />
			) : data?.log?.type === 'PLAID_TRX_MERGE_SUCCESS' ? (
				<PlaidTrxMergeSuccessLogView data={data.log.data} />
			) : data?.log?.type === 'EXTERNAL_SYNC' &&
				data?.log?.description === '/investmentsTransactionsGet' ? (
				<ExternalSyncLogView data={data.log.data} />
			) : data?.log?.type === 'EXTERNAL_SYNC' &&
				data?.log?.description === '/investmentsHoldingsGet' ? (
				<InvestmentsHoldingsLogView data={data.log.data} />
			) : (
				<ReactJsonView
					src={data?.log?.data}
					theme={theme.theme === 'dark' ? 'ashes' : 'rjv-default'}
					displayDataTypes={false}
					indentWidth={6}
				/>
			)}
		</PageWrapper>
	);
}
