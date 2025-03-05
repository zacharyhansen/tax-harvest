'use client';

import {
  useQuery,
  useUpdateMutation,
} from '@supabase-cache-helpers/postgrest-react-query';
import type { ReactNode } from 'react';
import { z } from 'zod';
import FormDialog from '@repo/ui/components/form-dialog';
import { zodResolver } from '@hookform/resolvers/zod';
import { useStandardForm } from '@repo/ui/hooks/use-standard-form';
import InputField from '@repo/ui/form-builder/fields/input.field';

import { LoadingPage, ErrorPage } from '../utility-components';

import postgrest from '~/lib/database/postgrest';

interface EditAccountDialogProps {
  children: ReactNode;
  accountId: string;
}

const formSchema = z.object({
  accountName: z.string().min(1, {}),
});

export default function EditAccountDialog({
  accountId,
  children,
}: EditAccountDialogProps) {
  const {
    data,
    error,
    isLoading: loading,
  } = useQuery(
    postgrest.from('Account').select('*').eq('id', accountId).single()
  );
  const mutate = useUpdateMutation(postgrest.from('Account'), ['id'], '*', {
    onSuccess: () => {},
  });

  const { form, handleSubmit } = useStandardForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      accountName: data?.displayName,
    },
    handleSubmit: async ({ accountName }) => {
      return mutate.mutateAsync({
        displayName: accountName,
        id: accountId,
      });
    },
  });

  if (error) {
    return <ErrorPage />;
  }

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <FormDialog
      form={form}
      title="Edit Account"
      handleSubmit={handleSubmit}
      trigger={children}
    >
      <InputField name="accountName" label="Account Name" autoFocus />
    </FormDialog>
  );
}
