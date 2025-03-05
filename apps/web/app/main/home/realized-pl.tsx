import { Alert } from '@repo/ui/components/alert';
import { Skeleton } from '@repo/ui/components/skeleton';

export default function RealizedPL() {
  const currentYear = new Date().getFullYear();
  const { data, error, loading } = useAccountRealizedPlQuery();

  if (loading) {
    return (
      <div className="flex w-full flex-col p-4">
        <div className="space-y-2">
          <Skeleton className="h-12" />
        </div>
      </div>
    );
  }

  if (error) {
    return <Alert>We could not load your realized P & L at this time.</Alert>;
  }

  const currentEntries =
    data?.accounts.flatMap(
      account =>
        account.realizedPAndL?.map(pl => ({
          ...(pl.year === currentYear ? pl : {}),
          accountId: account.id,
          accountName: account.displayName,
        })) || [{ accountId: account.id, accountName: account.displayName }]
    ) || [];

  return (
    <div>
      {currentEntries.map(entry => (
        <div key={entry.id}>{entry.accountName}</div>
      ))}
    </div>
  );
}
