'use client';

import type { PortfolioDetailItemFragment } from '~/generated/gql';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@repo/ui/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/card';
import { Separator } from '@repo/ui/components/separator';
import { toast } from '@repo/ui/components/toast-sonner';
import InputField from '@repo/ui/form-builder/fields/input.field';
import { useStandardForm } from '@repo/ui/hooks/use-standard-form';
import { DollarSign } from 'lucide-react';
import { FormProvider } from 'react-hook-form';

import { z } from 'zod';
import {
  usePortfolioByIdQuery,
  useUpdatePortfolioMutation,
} from '~/generated/gql';
import { usePortfolio } from '~/modules/portfolio';
import { ErrorPage, LoadingPage } from '~/modules/utility-components';
import { zodNumber } from '~/modules/utils/zod-utils';

const formSchema = z.object({
  harvestCycleWeeks: zodNumber.pipe(z.coerce.number().gte(1)),
  harvestShareDollarThreshold: zodNumber.pipe(z.coerce.number().gte(0)),
  harvestTickerBucketDollarSizeLong: zodNumber.pipe(z.coerce.number().gte(0)),
  harvestTickerBucketDollarSizeShort: zodNumber.pipe(z.coerce.number().gte(0)),
  harvestTickerBucketLowerLimitLong: zodNumber.pipe(z.coerce.number().gte(0)),
  harvestTickerBucketLowerLimitShort: zodNumber.pipe(z.coerce.number().gte(0)),
  name: z.string().min(3),
  minimumLotPAndL: zodNumber.pipe(z.coerce.number().gte(0)),
});

export default function PortfolioPage() {
  const { portfolio } = usePortfolio();
  const { data, error, loading } = usePortfolioByIdQuery({
    variables: {
      id: portfolio.id,
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
    onError: () => {
      toast.error('Unable to update Portfolio');
    },
  });

  const { form, handleSubmit } = useStandardForm<z.infer<typeof formSchema>>({
    defaultValues: {
      minimumLotPAndL: Number(portfolio.minimumLotPAndL),
      harvestCycleWeeks: portfolio.harvestCycleWeeks,
      harvestShareDollarThreshold: Number(
        portfolio.harvestShareDollarThreshold,
      ),
      harvestTickerBucketDollarSizeLong: Number(
        portfolio.harvestTickerBucketDollarSizeLong,
      ),
      harvestTickerBucketDollarSizeShort: Number(
        portfolio.harvestTickerBucketDollarSizeShort,
      ),
      harvestTickerBucketLowerLimitLong: Number(
        portfolio.harvestTickerBucketLowerLimitLong,
      ),
      harvestTickerBucketLowerLimitShort: Number(
        portfolio.harvestTickerBucketLowerLimitShort,
      ),
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
      minimumLotPAndL,
      name,
    }) => {
      toast.promise(
        update({
          variables: {
            data: {
              minimumLotPAndL: {
                set: minimumLotPAndL.toString(),
              },
              harvestCycleWeeks: {
                set: harvestCycleWeeks,
              },
              harvestShareDollarThreshold: {
                set: harvestShareDollarThreshold.toString(),
              },
              harvestTickerBucketDollarSizeLong: {
                set: harvestTickerBucketDollarSizeLong.toString(),
              },
              harvestTickerBucketDollarSizeShort: {
                set: harvestTickerBucketDollarSizeShort.toString(),
              },
              harvestTickerBucketLowerLimitLong: {
                set: harvestTickerBucketLowerLimitLong.toString(),
              },
              harvestTickerBucketLowerLimitShort: {
                set: harvestTickerBucketLowerLimitShort.toString(),
              },
              name: {
                set: name,
              },
            },
          },
        }).then(({ data: result }) => {
          if (!result) {
            return;
          }
          form.reset({
            ...result.updatePortfolio,
            harvestShareDollarThreshold: Number(
              result.updatePortfolio.harvestShareDollarThreshold,
            ),
            harvestTickerBucketDollarSizeLong: Number(
              result.updatePortfolio.harvestTickerBucketDollarSizeLong,
            ),
            harvestTickerBucketDollarSizeShort: Number(
              result.updatePortfolio.harvestTickerBucketDollarSizeShort,
            ),
            harvestTickerBucketLowerLimitLong: Number(
              result.updatePortfolio.harvestTickerBucketLowerLimitLong,
            ),
            harvestTickerBucketLowerLimitShort: Number(
              result.updatePortfolio.harvestTickerBucketLowerLimitShort,
            ),
            minimumLotPAndL: Number(result.updatePortfolio.minimumLotPAndL),
          });
        }),
        {
          error: 'Error',
          loading: 'Saving',
          success: 'Saved',
        },
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
                name="minimumLotPAndL"
                startIcon={DollarSign}
                label="Minimum Lot P/L"
                type="number"
                description="The minimum dollar amount profit or loss per share for a single share to be considered for harvest."
              />
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
