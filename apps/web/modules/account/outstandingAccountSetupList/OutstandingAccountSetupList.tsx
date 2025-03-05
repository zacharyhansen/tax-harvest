import { Badge } from '@repo/ui/components/badge';
import { Button } from '@repo/ui/components/button';
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query';
import { capitalCase } from 'change-case';
import { CheckCircle, CircleDashed } from 'lucide-react';
import Link from 'next/link';

import postgrest from '~/lib/database/postgrest';
import { TypedRoutes } from '~/lib/routes';
import { ErrorPage, LoadingPage } from '~/modules/utility-components';
import { Format } from '~/modules/utils';

export default function OutstandingAccountSetupList() {
  const {
    data,
    isLoading: loading,
    error,
  } = useQuery(
    postgrest
      .from('Account')
      .select(
        `id,
          uploadedPositions,
          setRealizedValues,
          displayName,
          type,
          accountValueTotal`
      )
      .or('uploadedPositions.eq.false,setRealizedValues.eq.false')
  );

  if (loading) {
    return <LoadingPage />;
  }

  if (error) {
    return (
      <ErrorPage
        message="Could not load accounts at this time. If this issue persists please
        contact support @support"
      />
    );
  }

  return (
    <div className="space-y-2">
      {data?.map(account => (
        <div
          key={account.id}
          className="flex flex-col items-start justify-between rounded-lg border p-2 sm:flex-row sm:items-center"
        >
          <div className="flex space-x-2">
            <p> {account.displayName}</p>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-2">
            <Badge variant="secondary">
              {capitalCase(account.type)}{' '}
              {Format.money(account.accountValueTotal)}
            </Badge>
            <Link href={TypedRoutes.account({ accountId: account.id })}>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center"
                iconLeft={
                  account.uploadedPositions ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <CircleDashed className="h-3 w-3" />
                  )
                }
              >
                Upload Positions
              </Button>
            </Link>
            <Link href={TypedRoutes.account({ accountId: account.id })}>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center"
                iconLeft={
                  account.setRealizedValues ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <CircleDashed className="h-3 w-3" />
                  )
                }
              >
                Set YTD Values
              </Button>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
