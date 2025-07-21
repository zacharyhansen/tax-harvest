'use client';

import { Button } from '@repo/ui/components/button';
import { Card } from '@repo/ui/components/card';
import {
  Shield,
  LineChart,
  Lock,
  Building2,
  Plus,
  Calendar,
  RefreshCw,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  usePlaidLinkTokenQuery,
  usePlaidAuthConnectionsQuery,
  usePlaidInstitutionQuery,
  type PlaidAuthConnectionFragment,
} from '~/generated/gql';
import PlaidLink from '~/modules/plaid/PlaidLink';
import { LoadingIcon } from '~/modules/utility-components';
import { Format, MoneyUtil } from '~/modules/utils';

const features = [
  {
    icon: <Shield className="text-primary h-5 w-5" />,
    title: 'Bank-Level Security',
    description: 'Your data is encrypted and protected',
  },
  {
    icon: <Building2 className="text-primary h-5 w-5" />,
    title: 'Trusted by Banks',
    description: 'Connect to 12,000+ institutions',
  },
  {
    icon: <LineChart className="text-primary h-5 w-5" />,
    title: 'Smart Tax Harvesting',
    description: 'Identify opportunities automatically',
  },
  {
    icon: <Lock className="text-primary h-5 w-5" />,
    title: 'Data Privacy',
    description: 'Disconnect anytime',
  },
];

interface InstitutionCardProps {
  authConnection: PlaidAuthConnectionFragment;
}

function InstitutionCard({ authConnection }: InstitutionCardProps) {
  const { data: institutionData, loading } = usePlaidInstitutionQuery({
    variables: { institutionId: authConnection.plaidInstitutionId! },
    skip: !authConnection.plaidInstitutionId,
  });

  const { data: updateTokenData, refetch: refetchUpdateToken } =
    usePlaidLinkTokenQuery({
      variables: { authConnectionId: authConnection.id },
    });

  const handleAddAccounts = async () => {
    await refetchUpdateToken();
  };

  const institution = institutionData?.plaidInstitution;

  return (
    <Card className="overflow-hidden">
      {/* Institution Header */}
      <div className="bg-muted/30 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {institution?.logo ? (
              <img
                src={institution.logo}
                alt={institution.name}
                className="h-10 w-10 rounded object-contain"
                style={{
                  backgroundColor: institution.primary_color || '#f5f5f5',
                }}
              />
            ) : (
              <div
                className="bg-secondary flex h-10 w-10 items-center justify-center rounded"
                style={{
                  backgroundColor: institution?.primary_color || '',
                }}
              >
                <Building2 className="h-5 w-5" />
              </div>
            )}

            <div>
              <h3 className="text-base font-semibold">
                {loading
                  ? 'Loading...'
                  : institution?.name || 'Unknown Institution'}
              </h3>

              <div className="text-muted-foreground flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>
                    Connected{' '}
                    {new Date(authConnection.authedAt).toLocaleDateString()}
                  </span>
                </div>
                {authConnection.syncedAt && (
                  <>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <RefreshCw className="h-3 w-3" />
                      <span>
                        Last synced{' '}
                        {new Date(authConnection.syncedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </>
                )}
              </div>

              {/* {authConnection._requiresReAuth && (
                <div className="mt-1 flex items-center gap-1 text-xs text-amber-600">
                  <AlertCircle className="h-3 w-3" />
                  <span>Requires re-authentication</span>
                </div>
              )} */}
            </div>
          </div>

          {/* Add Additional Accounts Button */}
          <div>
            {updateTokenData?.linkToken ? (
              <PlaidLink
                token={updateTokenData.linkToken}
                size="sm"
                iconLeft={<Plus className="h-4 w-4" />}
                redirectTo="/main/home"
              >
                Add {institution?.name} Accounts
              </PlaidLink>
            ) : (
              <LoadingIcon className="mx-auto my-4" />
            )}
          </div>
        </div>
      </div>

      {/* Account List */}
      <div className="divide-y">
        {authConnection.accounts?.map(account => (
          <div
            key={account.id}
            className="hover:bg-muted/10 flex items-center justify-between px-6 py-3 transition-colors"
          >
            <div className="flex items-center gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{account.name}</span>
                  {account.plaidAccountMask && (
                    <span className="text-muted-foreground text-xs">
                      •••• {account.plaidAccountMask}
                    </span>
                  )}
                </div>
                {account.subType && (
                  <span className="text-muted-foreground text-xs capitalize">
                    {account.subType.toLowerCase().replace(/_/g, ' ')}
                  </span>
                )}
              </div>
            </div>

            <div className="text-right">
              {account.accountValueTotal != null && (
                <span className="text-sm font-semibold">
                  {Format.money(account.accountValueTotal)}
                </span>
              )}
              {account.status && account.status !== 'ACTIVE' && (
                <div className="text-muted-foreground text-xs">
                  {account.status}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default function PlaidPage() {
  const router = useRouter();
  const { data: linkTokenData } = usePlaidLinkTokenQuery();
  const { data: authConnectionsData, loading: authConnectionsLoading } =
    usePlaidAuthConnectionsQuery();
  const [existingAccountId, setExistingAccountId] = useState<string | null>(
    null
  );

  useEffect(() => {
    // Get the account ID from localStorage that was set during upload
    const accountId = localStorage.getItem('onboardingAccountId');
    setExistingAccountId(accountId);
  }, []);

  const hasConnections =
    authConnectionsData?.plaidAuthConnections &&
    authConnectionsData.plaidAuthConnections.length > 0;

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="bg-card rounded-lg border">
        <div className="border-b p-6">
          <h1 className="text-2xl font-semibold">Connect Your Accounts</h1>
          <p className="text-muted-foreground mt-1">
            Securely connect your brokerage accounts to enable automatic
            tax-loss harvesting identification
          </p>
        </div>

        <div className="p-8">
          {/* Show features only if no connections exist */}
          {!hasConnections && (
            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {features.map((feature, index) => (
                <div key={index} className="flex gap-3">
                  <div className="mt-1">{feature.icon}</div>
                  <div>
                    <h3 className="font-semibold">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Show existing connections */}
          {authConnectionsLoading ? (
            <LoadingIcon className="mx-auto my-4" />
          ) : hasConnections ? (
            <div className="space-y-6">
              <div>
                <h2 className="mb-4 text-lg font-semibold">
                  Connected Institutions
                </h2>
                <div className="space-y-4">
                  {authConnectionsData.plaidAuthConnections.map(
                    authConnection => (
                      <InstitutionCard
                        key={authConnection.id}
                        authConnection={authConnection}
                      />
                    )
                  )}
                </div>
              </div>

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
                      redirectTo="/main/home"
                      existingAccountId={existingAccountId || undefined}
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
          ) : // New connection button when no connections exist
          linkTokenData?.linkToken ? (
            <PlaidLink
              token={linkTokenData.linkToken}
              redirectTo="/main/home"
              existingAccountId={existingAccountId || undefined}
              size="lg"
              variant="default"
              className="w-full"
            />
          ) : (
            <LoadingIcon className="mx-auto my-4" />
          )}
        </div>

        <div className="flex justify-between gap-2 border-t p-6">
          <Button
            variant="outline"
            onClick={() => router.push('/onboarding/complete')}
          >
            Back
          </Button>
          <Button variant="outline" onClick={() => router.push('/main/home')}>
            Skip for now
          </Button>
        </div>
      </div>
    </div>
  );
}
