'use client';

import { FormProvider } from 'react-hook-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/card';
import { z } from 'zod';
import { useStandardForm } from '@repo/ui/hooks/use-standard-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from '@repo/ui/components/toast-sonner';
import { Button } from '@repo/ui/components/button';
import InputField from '@repo/ui/form-builder/fields/input.field';
import { DollarSign } from 'lucide-react';

import { EtradeCSVUpload } from '~/modules/fileUpload';
import { ErrorPage, LoadingPage } from '~/modules/utility-components';
import {
  useAccountQuery,
  useUpdateAccountMutation,
  useUpdateAccountRealizedPAndLMutation,
  type AccountItemFragment,
} from '~/generated/gql';
import { PageWrapper } from '~/modules/layout';
import { zodNumber } from '~/modules/utils/zod-utils';

export default function AccountPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const { data, error, loading } = useAccountQuery({
    variables: { id },
  });

  if (error) {
    return (
      <ErrorPage
        message="Could not load account at this time. If this issue persists please
          contact support @support"
      />
    );
  }

  if (loading || !data?.account) {
    return <LoadingPage />;
  }

  return (
    <PageWrapper>
      <AccountForm account={data.account} />
    </PageWrapper>
  );
}

const accountFormSchema = z.object({
  deferredLoss: zodNumber,
  description: z.string().nullable().optional(),
  dividend: zodNumber,
  longTerm: zodNumber,
  shortTerm: zodNumber,
});

function AccountForm({ account }: { account: AccountItemFragment }) {
  const [update, { loading }] = useUpdateAccountMutation({
    onError: () => {
      toast.error('Unable to update account.');
    },
  });

  const [updateRealizedPAndL, { loading: loadingUpdateRealizedPAndL }] =
    useUpdateAccountRealizedPAndLMutation({
      onError: () => {
        toast.error('Unable to update account.');
      },
    });

  const { form, handleSubmit } = useStandardForm<
    z.infer<typeof accountFormSchema>
  >({
    defaultValues: {
      deferredLoss: account._realizedProfitAndLoss.deferredLoss,
      description: account.description,
      dividend: account._realizedProfitAndLoss.dividend,
      longTerm: account._realizedProfitAndLoss.longTerm,
      shortTerm: account._realizedProfitAndLoss.shortTerm,
    },
    resolver: zodResolver(accountFormSchema),
    handleSubmit: ({
      deferredLoss,
      description,
      dividend,
      longTerm,
      shortTerm,
    }) => {
      return toast.promise(
        Promise.all([
          update({
            variables: {
              accountUpdateInput: {
                description: {
                  set: description,
                },
              },
              accountWhereUniqueInput: {
                id: account.id,
              },
            },
          }),
          updateRealizedPAndL({
            variables: {
              id: account._realizedProfitAndLoss.id,
              input: {
                deferredLoss: {
                  set: deferredLoss,
                },
                dividend: {
                  set: dividend,
                },
                longTerm: {
                  set: longTerm,
                },
                shortTerm: {
                  set: shortTerm,
                },
              },
            },
          }),
        ]).then(([updateAccount, updateRealizedPAndL]) => {
          form.reset({
            ...updateAccount.data?.updateAccount,
            ...updateRealizedPAndL.data?.updateRealizedPAndL,
          });
        }),
        {
          error: 'Error',
          loading: 'Saving',
          success: 'Saved',
        }
      );
    },
  });

  return (
    <FormProvider {...form}>
      <Card className="mx-auto w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="mx-auto py-4 text-2xl">
            {account.name}
          </CardTitle>
          <CardTitle>Settings</CardTitle>
          <CardDescription>Manage your account details</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit} noValidate={true}>
          <CardContent className="space-y-8">
            <EtradeCSVUpload accountId={account.id} />
            <div className="space-y-4">
              <InputField name="description" label="Description" />
              <Card>
                <CardHeader>
                  <CardTitle>Calender Year Financials</CardTitle>
                </CardHeader>
                <CardContent>
                  <InputField
                    startIcon={DollarSign}
                    name="shortTerm"
                    label="Short Term Realized P & L"
                    type="number"
                  />
                  <InputField
                    startIcon={DollarSign}
                    name="longTerm"
                    label="Long Term Realized P & L"
                    type="number"
                  />
                  <InputField
                    startIcon={DollarSign}
                    name="dividend"
                    label="Dividend"
                    type="number"
                  />
                  <InputField
                    startIcon={DollarSign}
                    name="deferredLoss"
                    label="Deferred Loss"
                    type="number"
                  />
                </CardContent>
              </Card>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="ml-auto w-full"
              disabled={!form.formState.isDirty}
              loading={loading || loadingUpdateRealizedPAndL}
            >
              Save
            </Button>
          </CardFooter>
        </form>
      </Card>
    </FormProvider>
  );
}
