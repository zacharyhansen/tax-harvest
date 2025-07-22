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
import { TypedRoutes } from '~/lib/routes';

const DELETE_ACCOUNT_MUTATION = gql`
  mutation DeleteAccount($accountWhereUniqueInput: AccountWhereUniqueInput!) {
    deleteAccount(accountWhereUniqueInput: $accountWhereUniqueInput) {
      id
      name
    }
  }
`;

interface DeleteAccountDialogProps {
  accountId: string;
  accountName: string;
}

export default function DeleteAccountDialog({
  accountId,
  accountName,
}: DeleteAccountDialogProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const [deleteAccount, { loading }] = useMutation(DELETE_ACCOUNT_MUTATION, {
    onCompleted: () => {
      toast.success(`Account "${accountName}" has been deleted successfully.`);
      router.push(TypedRoutes.accounts());
    },
    onError: (error: any) => {
      toast.error(`Failed to delete account: ${error.message}`);
    },
  });

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    await deleteAccount({
      variables: {
        accountWhereUniqueInput: {
          id: accountId,
        },
      },
    });
    setIsOpen(false);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild onClick={e => e.stopPropagation()}>
        <Button variant="destructive" size="sm" className="gap-2">
          <Trash2 className="h-4 w-4" />
          Delete Account
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Account</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the account "{accountName}"? This
            action cannot be undone and will permanently remove:
            <br />
            <br />
            • All tax lots associated with this account
            <br />
            • All transactions and trading history
            <br />
            • All position data
            <br />
            • All realized gains and losses data
            <br />
            <br />
            This action is <strong>irreversible</strong>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={e => e.stopPropagation()}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete Account'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
