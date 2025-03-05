'use client';

import { DollarSign } from 'lucide-react';
import { FormProvider } from 'react-hook-form';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  FormInput,
  Separator,
  toast,
  useReactHookForm,
} from 'ui';
import { z } from 'zod';
import type { PortfolioDetailItemFragment } from 'generated/gql';
import {
  usePortfolioByIdQuery,
  useUpdatePortfolioMutation,
} from 'generated/gql';
import { AlertError } from 'modules/alerts';
import { LoadingPage } from 'modules/utilityComponents';

export interface PortfolioPageProps {}

const formSchema = z.object({
  harvestCycleWeeks: z.coerce.number().gte(1),
  harvestShareDollarThreshold: z.coerce.number().gte(0),
  harvestTickerBucketDollarSizeLong: z.coerce.number().gte(0),
  harvestTickerBucketDollarSizeShort: z.coerce.number().gte(0),
  harvestTickerBucketLowerLimitLong: z.coerce.number().gte(0),
  harvestTickerBucketLowerLimitShort: z.coerce.number().gte(0),
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
      <div>
        <AlertError>
          Could not load portfolio at this time. If the issue persists, please
          constact support @support
        </AlertError>
      </div>
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

  const [form, onSumbit] = useReactHookForm<z.infer<typeof formSchema>>({
    formProps: {
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
    },
    formSchema,
    handleSubmit: async ({
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
        <form onSubmit={onSumbit}>
          <CardContent className="space-y-8">
            {/* Miscellaneous Inputs */}
            <div className="space-y-4">
              <FormInput name="name" label="Portfolio Name" />
              <FormInput
                name="harvestCycleWeeks"
                label="Harvest Cycle - Number of Weeks"
                type="number"
              />
              <FormInput
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
                <FormInput
                  startIcon={DollarSign}
                  name="harvestTickerBucketDollarSizeShort"
                  label="Asset Bucket Size"
                  type="number"
                  description="The max dollar amount harvested for a single asset before trying the next."
                />
                <FormInput
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
                <FormInput
                  startIcon={DollarSign}
                  name="harvestTickerBucketDollarSizeLong"
                  label="Asset Bucket Size"
                  type="number"
                  description="The max dollar amount harvested for a single asset before trying the next."
                />
                <FormInput
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
