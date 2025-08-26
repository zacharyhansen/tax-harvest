import { Alert, AlertDescription, AlertTitle } from '@repo/ui/components/alert';
import { Button } from '@repo/ui/components/button';
import { toast } from '@repo/ui/components/toast-sonner';
import { CircleAlert, CircleCheckBig, Pencil } from 'lucide-react';
import Link from 'next/link';
import {
	PortfolioSummaryDocument,
	useAccountSummariesQuery,
	useUpdateAccountMutation,
} from '~/generated/gql';
import { TypedRoutes } from '~/lib/routes';
import { ErrorPage, LoadingPage } from '~/modules/utility-components';

export default function OutstandingAccountSetupList() {
	const { data, loading, error, refetch } = useAccountSummariesQuery();

	const [mutate] = useUpdateAccountMutation({
		onCompleted: () => {
			void refetch();
		},
		refetchQueries: [PortfolioSummaryDocument],
	});

	if (loading) {
		return <LoadingPage />;
	}

	if (error) {
		return (
			<ErrorPage
				message="Could not load accounts at this time. If this issue persists please
        contact support"
			/>
		);
	}

	return data?.accounts.map((account) => {
		const isComplete =
			(account.uploadedPositions && account.setRealizedValues) ||
			account.skipSetup;

		if (isComplete) {
			return null;
		}

		return (
			<div key={account.id}>
				<Alert variant="default" className="w-full">
					<CircleAlert />
					<AlertTitle>
						{account.name} - Missing Year to Date Profit & Loss
					</AlertTitle>
					<AlertDescription>
						Current year to date profit and loss is not set. This will impact
						your tax loss harvesting strategy.
						<div className="flex w-full gap-2">
							<Link
								href={TypedRoutes.account({ id: account.id })}
								className="w-1/2"
							>
								<Button
									iconLeft={<Pencil className="size-3" />}
									variant="default"
									size="sm"
									className="w-full"
								>
									Set Profit & Loss
								</Button>
							</Link>
							<Button
								variant="outline"
								size="sm"
								className="w-1/2"
								iconLeft={<CircleCheckBig className="size-3" />}
								onClick={() => {
									toast.promise(
										mutate({
											variables: {
												accountWhereUniqueInput: {
													id: account.id,
												},
												accountUpdateInput: {
													skipSetup: {
														set: true,
													},
												},
											},
										}),
										{
											loading: 'Skipping setup...',
											success: 'Setup skipped',
											error: 'Could not skip setup',
										},
									);
								}}
							>
								My Year to Date Profit & Loss is $0
							</Button>
						</div>
					</AlertDescription>
				</Alert>
				{/* <div className="flex flex-wrap space-x-2">
          <p> {account.name}</p>
          <Badge variant="secondary">{capitalCase(account.type)}</Badge>
          {account.subType ? (
            <Badge variant="secondary">
              {capitalCase(account.subType)}
            </Badge>
          ) : null}
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          {isComplete ? (
            <Badge variant="outline" className="bg-background p-2">
              Setup Complete{' '}
              <CircleCheckBig className="ml-2 size-4 text-green-600" />
            </Badge>
          ) : (
            <>
              <Link href={TypedRoutes.account({ id: account.id })}>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center"
                  iconLeft={
                    account.uploadedPositions ? (
                      <CheckCircle className="size-4 text-green-500" />
                    ) : (
                      <CircleDashed className="size-3" />
                    )
                  }
                >
                  Upload Positions
                </Button>
              </Link>
              <Link href={TypedRoutes.account({ id: account.id })}>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center"
                  iconLeft={
                    account.setRealizedValues ? (
                      <CheckCircle className="size-4 text-green-500" />
                    ) : (
                      <CircleDashed className="size-3" />
                    )
                  }
                >
                  Set YTD Values
                </Button>
              </Link>
              <Button
                variant="secondary"
                size="sm"
                className="flex items-center"
                iconLeft={<CircleCheckBig className="size-3" />}
                onClick={() => {
                  toast.promise(
                    mutate({
                      variables: {
                        accountWhereUniqueInput: {
                          id: account.id,
                        },
                        accountUpdateInput: {
                          skipSetup: {
                            set: true,
                          },
                        },
                      },
                    }),
                    {
                      loading: 'Skipping setup...',
                      success: 'Setup skipped',
                      error: 'Could not skip setup',
                    }
                  );
                }}
              >
                Skip setup
              </Button>
            </>
          )}
        </div> */}
			</div>
		);
	});
}
