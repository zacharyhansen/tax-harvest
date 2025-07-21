'use client';

import { Button } from '@repo/ui/components/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@repo/ui/components/alert-dialog';
import { toast } from '@repo/ui/components/toast-sonner';
import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import type { PlaidAuthConnectionFragment } from '~/generated/gql';
import { TypedRoutes } from '~/lib/routes';
import { Format } from '~/modules/utils';
import { cn } from '@repo/ui/utils';

const DELETE_AUTH_CONNECTION_MUTATION = gql`
  mutation DeleteAuthConnection($authConnectionId: String!) {
    deleteAuthConnection(authConnectionId: $authConnectionId) {
      id
      source
    }
  }
`;

interface DeleteAuthConnectionDialogProps {
  authConnection: PlaidAuthConnectionFragment;
  institutionName?: string;
  triggerClassName?: string;
  onSuccess?: () => void;
}

export default function DeleteAuthConnectionDialog({
  authConnection,
  institutionName,
  triggerClassName,
  onSuccess,
}: DeleteAuthConnectionDialogProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const accounts = authConnection.accounts || [];
  const accountCount = accounts.length;

  const [deleteAuthConnection, { loading }] = useMutation(
    DELETE_AUTH_CONNECTION_MUTATION,
    {
      onCompleted: () => {
        toast.success(
          `Connection to ${institutionName || 'institution'} has been removed successfully.`
        );
        setIsOpen(false);
        if (onSuccess) {
          onSuccess();
        } else {
          router.push(TypedRoutes.accounts());
        }
      },
      onError: (error: any) => {
        toast.error(`Failed to remove connection: ${error.message}`);
      },
      refetchQueries: ['PlaidAuthConnections'],
    }
  );

  const handleDelete = async () => {
    await deleteAuthConnection({
      variables: {
        authConnectionId: authConnection.id,
      },
    });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="link"
          size="sm"
          className={cn(triggerClassName, 'text-red-500')}
        >
          Delete Connection
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle>
            Disconnect from {institutionName || 'Institution'}
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-4">
            <p>
              Are you sure you want to disconnect from{' '}
              {institutionName || 'this institution'}? This action cannot be
              undone and will permanently remove:
            </p>

            <div className="bg-muted/30 rounded-lg border p-4">
              <h4 className="mb-3 font-medium">
                The following {accountCount} account
                {accountCount !== 1 ? 's' : ''} will be deleted:
              </h4>
              <ul className="space-y-2">
                {accounts.map(account => (
                  <li
                    key={account.id}
                    className="bg-background flex items-center justify-between rounded p-2"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{account.name}</span>
                      {account.plaidAccountMask && (
                        <span className="text-muted-foreground text-sm">
                          •••• {account.plaidAccountMask}
                        </span>
                      )}
                    </div>
                    {account.accountValueTotal != null && (
                      <span className="font-semibold">
                        {Format.money(account.accountValueTotal)}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-muted-foreground space-y-2 text-sm">
              <p className="text-destructive font-medium">
                This will also permanently delete:
              </p>
              <ul className="ml-4 list-disc space-y-1">
                <li>All tax lots and cost basis information</li>
                <li>All transaction history</li>
                <li>All position data</li>
                <li>All realized gains and losses data</li>
              </ul>
            </div>

            <p className="font-semibold">
              This action is{' '}
              <span className="text-destructive">irreversible</span>.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading
              ? 'Disconnecting...'
              : `Disconnect ${accountCount} Account${accountCount !== 1 ? 's' : ''}`}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
