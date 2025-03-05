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
import {
  useQuery,
  useUpdateMutation,
} from '@supabase-cache-helpers/postgrest-react-query';
import { useStandardForm } from '@repo/ui/hooks/use-standard-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from '@repo/ui/components/toast-sonner';
import { Button } from '@repo/ui/components/button';
import InputField from '@repo/ui/form-builder/fields/input.field';

import { EtradeCSVUpload } from '~/modules/fileUpload';
import { ErrorPage, LoadingPage } from '~/modules/utility-components';
import postgrest from '~/lib/database/postgrest';

const accountFormSchema = z.object({
  deferredLoss: z.coerce.number(),
  description: z.string().nullable().optional(),
  displayName: z.string().min(3),
  dividend: z.coerce.number(),
  longTerm: z.coerce.number(),
  shortTerm: z.coerce.number(),
  type: z.string().nullable(),
});

export default function AccountPage({ params }: { params: { id: string } }) {
  const { id } = params;

  const {
    data: account,
    error,
    isLoading,
  } = useQuery(postgrest.from('Account').select('*').eq('id', id).single());

  const {
    data: realizedPAndL,
    error: realizedPAndLError,
    isLoading: realizedPAndLLoading,
  } = useQuery(
    postgrest
      .from('RealizedPAndL')
      .select('*')
      .eq('accountId', id)
      .eq('year', new Date().getFullYear())
      .maybeSingle()
  );

  const mutateAccount = useUpdateMutation(postgrest.from('Account'), ['id']);
  const mutateRealizedPAndL = useUpdateMutation(
    postgrest.from('RealizedPAndL'),
    ['id']
  );

  const { form, handleSubmit } = useStandardForm<
    z.infer<typeof accountFormSchema>
  >({
    defaultValues: {
      deferredLoss: realizedPAndL?.deferredLoss,
      description: account?.description,
      displayName: account?.displayName,
      dividend: realizedPAndL?.dividend,
      longTerm: realizedPAndL?.longTerm,
      shortTerm: realizedPAndL?.shortTerm,
      type: account?.type,
    },
    resolver: zodResolver(accountFormSchema),
    handleSubmit: ({
      deferredLoss,
      description,
      displayName,
      dividend,
      longTerm,
      shortTerm,
      type,
    }) => {
      toast.promise(
        Promise.all([
          mutateAccount.mutateAsync({
            description,
            displayName,
            type: type ?? undefined,
          }),
          mutateRealizedPAndL.mutateAsync({
            deferredLoss,
            dividend,
            longTerm,
            shortTerm,
          }),
        ]),
        {
          error: 'Error',
          loading: 'Saving',
          success: 'Saved',
        }
      );
    },
  });

  if (error || realizedPAndLError) {
    return (
      <ErrorPage message="Could not load account at this time. If this issue persists please contact support @support" />
    );
  }

  if (isLoading || !account || realizedPAndLLoading) {
    return <LoadingPage />;
  }

  return (
    <FormProvider {...form}>
      <Card className="mx-auto w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="mx-auto py-4 text-2xl">
            {account.displayName}
          </CardTitle>
          <CardTitle>Settings</CardTitle>
          <CardDescription>Manage your account details</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-8">
            <EtradeCSVUpload accountId={account.id} />
            <div className="space-y-4">
              <InputField name="displayName" label="Account Name" />
              <InputField name="type" label="Type" />
              <InputField name="description" label="Description" />
              <Card>
                <CardHeader>
                  <CardTitle>Calender Year Financials</CardTitle>
                </CardHeader>
                <CardContent>
                  <InputField
                    // startIcon={DollarSign}
                    name="shortTerm"
                    label="Short Term Realized P & L"
                    type="number"
                  />
                  <InputField
                    // startIcon={DollarSign}
                    name="longTerm"
                    label="Long Term Realized P & L"
                    type="number"
                  />
                  <InputField
                    // startIcon={DollarSign}
                    name="dividend"
                    label="Dividend"
                    type="number"
                  />
                  <InputField
                    // startIcon={DollarSign}
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
              loading={mutateAccount.isPending || mutateRealizedPAndL.isPending}
            >
              Save
            </Button>
          </CardFooter>
        </form>
      </Card>
    </FormProvider>
  );
}
