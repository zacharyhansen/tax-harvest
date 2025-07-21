'use client';

import { Card } from '@repo/ui/components/card';
import { Building2, Plus, Calendar, RefreshCw } from 'lucide-react';
import {
  usePlaidLinkTokenQuery,
  usePlaidInstitutionQuery,
  type PlaidAuthConnectionFragment,
} from '~/generated/gql';
import PlaidLink from '~/modules/plaid/PlaidLink';
import { LoadingIcon } from '~/modules/utility-components';
import { Format } from '~/modules/utils';

interface InstitutionCardProps {
  authConnection: PlaidAuthConnectionFragment;
  showAddButton?: boolean;
  onAccountClick?: (accountId: string) => void;
  redirectTo?: string;
}

/**
 * Component for displaying a connected financial institution with its accounts
 * @param authConnection - The Plaid auth connection data
 * @param showAddButton - Whether to show the "Add Accounts" button (default: true)
 * @param onAccountClick - Optional callback when an account is clicked
 * @param redirectTo - Where to redirect after adding accounts (default: '/main/home')
 *
 * @example
 * <InstitutionCard
 *   authConnection={connection}
 *   onAccountClick={(id) => router.push(`/accounts/${id}`)}
 * />
 */
export function InstitutionCard({
  authConnection,
  showAddButton = true,
  onAccountClick,
  redirectTo = '/main/home',
}: InstitutionCardProps) {
  const { data: institutionData, loading } = usePlaidInstitutionQuery({
    variables: { institutionId: authConnection.plaidInstitutionId! },
    skip: !authConnection.plaidInstitutionId,
  });

  const { data: updateTokenData, refetch: refetchUpdateToken } =
    usePlaidLinkTokenQuery({
      variables: { authConnectionId: authConnection.id },
    });

  const handleAccountClick = (accountId: string) => {
    if (onAccountClick) {
      onAccountClick(accountId);
    }
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
            </div>
          </div>

          {/* Add Additional Accounts Button */}
          {showAddButton && (
            <div>
              {updateTokenData?.linkToken ? (
                <PlaidLink
                  token={updateTokenData.linkToken}
                  size="sm"
                  iconLeft={<Plus className="h-4 w-4" />}
                  redirectTo={redirectTo}
                >
                  Add {institution?.name} Accounts
                </PlaidLink>
              ) : (
                <LoadingIcon className="mx-auto my-4" />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Account List */}
      <div className="divide-y">
        {authConnection.accounts?.map(account => (
          <div
            key={account.id}
            className={`flex items-center justify-between px-6 py-3 transition-colors ${
              onAccountClick ? 'hover:bg-muted/10 cursor-pointer' : ''
            }`}
            onClick={() => handleAccountClick(account.id)}
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
