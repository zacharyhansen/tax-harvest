'use client';

import type { ReactNode } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import FormDialog from '@repo/ui/components/form-dialog';
import { toast } from '@repo/ui/components/toast-sonner';
import InputField from '@repo/ui/form-builder/fields/input.field';
import { useStandardForm } from '@repo/ui/hooks/use-standard-form';
import { z } from 'zod';

import { useUser } from '~/app/main/user.provider';

import { useCreatePortfolioMutation } from '~/generated/gql';
import { usePortfolio } from './providers/PortfolioProvider';

const formSchema = z.object({
  name: z.string().min(1),
});

type CreatePortfolioDialogProps = {
  children: ReactNode;
};

export default function CreatePortfolioDialog({
  children,
}: CreatePortfolioDialogProps) {
  const { user } = useUser();
  const { reload } = usePortfolio();
  const [createUserPortfolio] = useCreatePortfolioMutation();

  const { form, handleSubmit } = useStandardForm<z.infer<typeof formSchema>>({
    defaultValues: {
      name: '',
    },
    resolver: zodResolver(formSchema),
    handleSubmit: values => {
      toast.promise(
        createUserPortfolio({
          onCompleted: () => {
            reload();
          },
          variables: {
            portfolioInsertObject: {
              ...values,
              createdBy: {
                connect: {
                  id: user.id,
                },
              },
            },
          },
        }),
        {
          error: 'Error',
          loading: 'Loading...',
          success: 'Create Portfolio',
        }
      );
    },
  });

  return (
    <FormDialog
      form={form}
      title="Create Portfolio"
      description="Add a portfolio to manage connected accounts for a unique tax filing"
      handleSubmit={handleSubmit}
      trigger={children}
    >
      <InputField
        name="name"
        label="Account Name"
        placeholder="Portfolio Name"
      />
    </FormDialog>
  );
}
