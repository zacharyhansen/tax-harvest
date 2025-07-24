'use client';

import { Card } from '@repo/ui/components/card';
import { Button } from '@repo/ui/components/button';
import { toast } from '@repo/ui/components/toast-sonner';
import { Building2, RefreshCw, Calendar, User, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import {
  useAdminPlaidAuthConnectionsQuery,
  useAdminSyncPlaidItemMutation,
  usePlaidInstitutionQuery,
} from '~/generated/gql';
import { LoadingIcon } from '~/modules/utility-components';
import { Format } from '~/modules/utils';

interface InstitutionCardProps {
  authConnection: any;
  onSync: (authConnectionId: string) => void;
  isSyncing: boolean;
}

/**
 * Component for displaying a Plaid auth connection in the admin panel
 * @param authConnection - The Plaid auth connection data
 * @param onSync - Callback to trigger sync
 * @param isSyncing - Whether this connection is currently syncing
 * 
 * @example
 * <InstitutionCard
 *   authConnection={connection}
 *   onSync={handleSync}
 *   isSyncing={syncingId === connection.id}
 * />
 */
function InstitutionCard({ authConnection, onSync, isSyncing }: InstitutionCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { data: institutionData, loading } = usePlaidInstitutionQuery({
    variables: { institutionId: authConnection.plaidInstitutionId! },
    skip: !authConnection.plaidInstitutionId,
  });

  const institution = institutionData?.plaidInstitution;

  return (
    <Card className="overflow-hidden">
      {/* Institution Header */}
      <div 
        className="bg-muted/30 p-4 cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
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
                  <User className="h-3 w-3" />
                  <span>{authConnection.user?.email || 'Unknown User'}</span>
                </div>
                <span>•</span>
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

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onSync(authConnection.id);
              }}
              disabled={isSyncing}
            >
              {isSyncing ? (
                <>
                  <LoadingIcon className="mr-2 h-4 w-4" />
                  Syncing...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Sync Now
                </>
              )}
            </Button>
            <ChevronRight 
              className={`h-4 w-4 text-muted-foreground transition-transform ${
                isExpanded ? 'rotate-90' : ''
              }`} 
            />
          </div>
        </div>
      </div>

      {/* Account List - Only show when expanded */}
      {isExpanded && (
        <div className="divide-y">
          {authConnection.accounts?.map((account: any) => (
            <div
              key={account.id}
              className="flex items-center justify-between px-6 py-3"
            >
              <div className="flex items-center gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      {account.name}
                    </span>
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
      )}
    </Card>
  );
}

/**
 * Admin component for syncing Plaid auth connections
 * Shows all Plaid connections across all portfolios with sync buttons
 * 
 * @example
 * <PlaidSyncComponent />
 */
export function PlaidSyncComponent() {
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const { data, loading, error, refetch } = useAdminPlaidAuthConnectionsQuery();
  const [syncPlaidItem] = useAdminSyncPlaidItemMutation();

  const handleSync = async (authConnectionId: string) => {
    setSyncingId(authConnectionId);
    try {
      await toast.promise(
        syncPlaidItem({
          variables: { authConnectionId },
        }),
        {
          loading: 'Syncing Plaid connection...',
          success: 'Plaid connection synced successfully',
          error: 'Failed to sync Plaid connection',
        }
      );
      // Refetch the data to get updated sync times
      refetch();
    } finally {
      setSyncingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingIcon className="h-8 w-8" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-destructive text-center py-8">
        Error loading Plaid connections: {error.message}
      </div>
    );
  }

  const connections = data?.plaidAuthConnections || [];

  if (connections.length === 0) {
    return (
      <div className="text-muted-foreground text-center py-8">
        No Plaid connections found
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {connections.map((authConnection) => (
        <InstitutionCard
          key={authConnection.id}
          authConnection={authConnection}
          onSync={handleSync}
          isSyncing={syncingId === authConnection.id}
        />
      ))}
    </div>
  );
}