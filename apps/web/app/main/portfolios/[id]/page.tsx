'use client';

import { DollarSign } from 'lucide-react';
import { FormProvider } from 'react-hook-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/card';
import { Button } from '@repo/ui/components/button';
import { Separator } from '@repo/ui/components/separator';
import { toast } from '@repo/ui/components/toast-sonner';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useStandardForm } from '@repo/ui/hooks/use-standard-form';
import InputField from '@repo/ui/form-builder/fields/input.field';

import type { PortfolioDetailItemFragment } from '~/generated/gql';
import {
  usePortfolioByIdQuery,
  useUpdatePortfolioMutation,
} from '~/generated/gql';
import { ErrorPage, LoadingPage } from '~/modules/utility-components';
import { zodNumber } from '~/modules/utils/zod-utils';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface PortfolioPageProps {}

const formSchema = z.object({
  harvestCycleWeeks: zodNumber.pipe(z.coerce.number().gte(1)),
  harvestShareDollarThreshold: zodNumber.pipe(z.coerce.number().gte(0)),
  harvestTickerBucketDollarSizeLong: zodNumber.pipe(z.coerce.number().gte(0)),
  harvestTickerBucketDollarSizeShort: zodNumber.pipe(z.coerce.number().gte(0)),
  harvestTickerBucketLowerLimitLong: zodNumber.pipe(z.coerce.number().gte(0)),
  harvestTickerBucketLowerLimitShort: zodNumber.pipe(z.coerce.number().gte(0)),
  name: z.string().min(3),
});

export default function PortfolioPage({ params }: { params: { id: string } }) {
  const { data, error, loading } = usePortfolioByIdQuery({
    variables: {
      id: params.id,
    },
  });

  if (error) {
    return (
      <ErrorPage message="Could not load portfolio at this time. If the issue persists, please contact support @support" />
    );
  }

  if (loading || !data) {
    return <LoadingPage />;
  }

  return <Form portfolio={data.portfolioById} />;
}

function Form({ portfolio }: { portfolio: PortfolioDetailItemFragment }) {
  const [update, { loading }] = useUpdatePortfolioMutation({
    onCompleted: result => {
      form.reset({ ...result.updatePortfolio });
    },
    onError: () => {
      toast.error('Unable to update Portfolio');
    },
  });

  const { form, handleSubmit } = useStandardForm<z.infer<typeof formSchema>>({
    defaultValues: {
      harvestCycleWeeks: portfolio.harvestCycleWeeks,
      harvestShareDollarThreshold: portfolio.harvestShareDollarThreshold,
      harvestTickerBucketDollarSizeLong:
        portfolio.harvestTickerBucketDollarSizeLong,
      harvestTickerBucketDollarSizeShort:
        portfolio.harvestTickerBucketDollarSizeShort,
      harvestTickerBucketLowerLimitLong:
        portfolio.harvestTickerBucketLowerLimitLong,
      harvestTickerBucketLowerLimitShort:
        portfolio.harvestTickerBucketLowerLimitShort,
      name: portfolio.name,
    },
    resolver: zodResolver(formSchema),
    handleSubmit: ({
      harvestCycleWeeks,
      harvestShareDollarThreshold,
      harvestTickerBucketDollarSizeLong,
      harvestTickerBucketDollarSizeShort,
      harvestTickerBucketLowerLimitLong,
      harvestTickerBucketLowerLimitShort,
      name,
    }) => {
      toast.promise(
        update({
          variables: {
            data: {
              harvestCycleWeeks: {
                set: harvestCycleWeeks,
              },
              harvestShareDollarThreshold: {
                set: harvestShareDollarThreshold,
              },
              harvestTickerBucketDollarSizeLong: {
                set: harvestTickerBucketDollarSizeLong,
              },
              harvestTickerBucketDollarSizeShort: {
                set: harvestTickerBucketDollarSizeShort,
              },
              harvestTickerBucketLowerLimitLong: {
                set: harvestTickerBucketLowerLimitLong,
              },
              harvestTickerBucketLowerLimitShort: {
                set: harvestTickerBucketLowerLimitShort,
              },
              name: {
                set: name,
              },
            },
          },
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
            {portfolio.name}
          </CardTitle>
          <CardTitle>Settings</CardTitle>
          <CardDescription>
            Manage your portfolio settings and preferences.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit} noValidate={true}>
          <CardContent className="space-y-8">
            {/* Miscellaneous Inputs */}
            <div className="space-y-4">
              <InputField name="name" label="Portfolio Name" />
              <InputField
                name="harvestCycleWeeks"
                label="Harvest Cycle - Number of Weeks"
                type="number"
              />
              <InputField
                name="harvestShareDollarThreshold"
                startIcon={DollarSign}
                label="Per Share Minimum"
                type="number"
                description="The minimum dollar amount profit or loss per share for a single share to be considered for harvest."
              />
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-medium">
                Short Term Capital Settings
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <InputField
                  startIcon={DollarSign}
                  name="harvestTickerBucketDollarSizeShort"
                  label="Asset Bucket Size"
                  type="number"
                  description="The max dollar amount harvested for a single asset before trying the next."
                />
                <InputField
                  startIcon={DollarSign}
                  name="harvestTickerBucketLowerLimitShort"
                  label="Asset Dollar Minimum"
                  type="number"
                  description="The minimum dollar total profit or loss required for an asset to be considered for the harvest."
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-medium">
                Long Term Capital Settings
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <InputField
                  startIcon={DollarSign}
                  name="harvestTickerBucketDollarSizeLong"
                  label="Asset Bucket Size"
                  type="number"
                  description="The max dollar amount harvested for a single asset before trying the next."
                />
                <InputField
                  startIcon={DollarSign}
                  name="harvestTickerBucketLowerLimitLong"
                  label="Asset Dollar Minimum"
                  type="number"
                  description="The minimum dollar total profit or loss required for an asset to be considered for the harvest."
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="ml-auto w-full"
              disabled={!form.formState.isDirty}
              loading={loading}
            >
              Save
            </Button>
          </CardFooter>
        </form>
      </Card>
    </FormProvider>
  );
}
