'use client';

import { Building2, Link, UserX, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

import {
  usePlaidAuthConnectionsQuery,
  usePlaidLinkTokenQuery,
  useAccountsQuery,
  AccountProvider,
} from '~/generated/gql';
import { TypedRoutes } from '~/lib/routes';
import { NoAccounts } from '~/modules/account';
import { PageWrapper } from '~/modules/layout';
import { InstitutionCard } from '~/modules/plaid';
import PlaidLink from '~/modules/plaid/PlaidLink';
import {
  ErrorPage,
  LoadingPage,
  LoadingIcon,
} from '~/modules/utility-components';
import DeleteAccountDialog from './[id]/DeleteAccountDialog';
import { Button } from '@repo/ui/components/button';

export default function AccountPage() {
  const router = useRouter();
  const { data: linkTokenData } = usePlaidLinkTokenQuery();
  const {
    data: authConnectionsData,
    loading: authConnectionsLoading,
    error,
  } = usePlaidAuthConnectionsQuery();
  const { data: accountsData, loading: accountsLoading } = useAccountsQuery({
    variables: {
      where: {
        provider: { equals: AccountProvider.Unconnected },
      },
    },
  });

  const handleAccountClick = (accountId: string) => {
    router.push(TypedRoutes.account({ id: accountId }));
  };

  if (authConnectionsLoading || accountsLoading) {
    return <LoadingPage />;
  }

  if (error) {
    return (
      <ErrorPage message="Could not load accounts at this time. If this issue persists please contact support" />
    );
  }

  const hasConnections =
    authConnectionsData?.plaidAuthConnections &&
    authConnectionsData.plaidAuthConnections.length > 0;

  const hasUnconnectedAccounts =
    accountsData?.accounts && accountsData.accounts.length > 0;

  if (!hasConnections && !hasUnconnectedAccounts) {
    return <NoAccounts />;
  }

  return (
    <PageWrapper>
      <div className="mx-auto w-full max-w-4xl">
        <div className="bg-card rounded-lg border">
          <div className="border-b p-6">
            <h1 className="text-2xl font-semibold">Your Accounts</h1>
            <p className="text-muted-foreground mt-1">
              Manage your connected financial institutions and accounts
            </p>
          </div>

          <div className="p-8">
            <div className="space-y-12">
              {hasConnections && (
                <div>
                  <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                    <Link className="h-5 w-5" />
                    Connected Institutions
                  </h2>
                  <div className="space-y-4">
                    {authConnectionsData.plaidAuthConnections.map(
                      authConnection => (
                        <InstitutionCard
                          key={authConnection.id}
                          authConnection={authConnection}
                          showDeleteButton={true}
                          onAccountClick={handleAccountClick}
                          redirectTo="/main/accounts"
                        />
                      )
                    )}
                  </div>
                </div>
              )}

              {hasUnconnectedAccounts && (
                <div>
                  <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                    Unconnected Accounts
                  </h2>
                  <div className="space-y-4">
                    {accountsData.accounts.map(account => (
                      <div
                        key={account.id}
                        className="hover:bg-muted/20 hover:border-l-primary/50 group cursor-pointer rounded-lg border border-l-4 border-l-transparent transition-all duration-200 hover:shadow-sm"
                        onClick={() => handleAccountClick(account.id)}
                      >
                        <div className="flex items-center justify-between p-4">
                          <div className="flex-1">
                            <h3 className="group-hover:text-primary font-medium transition-colors">
                              {account.name}
                            </h3>
                            <p className="text-muted-foreground text-sm">
                              {account.type} •{' '}
                              {account.institution || 'Manual Entry'}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <ChevronRight className="text-muted-foreground group-hover:text-primary h-4 w-4 transition-colors" />
                            <DeleteAccountDialog
                              accountId={account.id}
                              accountName={
                                account.name ?? account.externalId ?? 'Unnamed'
                              }
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Link New Institution Button */}
              <div className="mt-8 border-t pt-8">
                <div className="text-center">
                  <h3 className="mb-2 text-base font-medium">
                    Need to connect a different institution?
                  </h3>
                  <p className="text-muted-foreground mb-4 text-sm">
                    Link accounts from another bank or brokerage
                  </p>
                  {linkTokenData?.linkToken ? (
                    <PlaidLink
                      token={linkTokenData.linkToken}
                      redirectTo="/main/accounts"
                      size="lg"
                      variant="default"
                      iconLeft={<Building2 className="h-5 w-5" />}
                    >
                      Link New Institution
                    </PlaidLink>
                  ) : (
                    <LoadingIcon className="mx-auto my-4" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
