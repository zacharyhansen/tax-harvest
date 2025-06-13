'use client';

import { Button } from '@repo/ui/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/card';
import { Label } from '@repo/ui/components/label';
import { RadioGroup, RadioGroupItem } from '@repo/ui/components/radio-group';
import { Switch } from '@repo/ui/components/switch';
import { Protect } from '@clerk/nextjs';
import { SeePaymentPlans } from '../payment/see-payment-plans';
import {
  HarvestNotificationFrequency,
  usePortfolioNotificationSettingsQuery,
  useUpdatePortfolioMutation,
} from '~/generated/gql';
import { toast } from '@repo/ui/components/toast-sonner';
import { z } from 'zod';
import { useStandardForm } from '@repo/ui/hooks/use-standard-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider } from 'react-hook-form';
import SwitchField from '@repo/ui/form-builder/fields/switch.field';
import RadioGroupField from '@repo/ui/form-builder/fields/radio-group.field';
import { LoadingPage } from '~/modules/utility-components';

const NotifcationSchema = z.object({
  endOfYearTaxOpportunityNotification: z.boolean(),
  notificationFrequency: z.nativeEnum(HarvestNotificationFrequency),
});

export default function NotificationsSettingsPage() {
  const { data, loading } = usePortfolioNotificationSettingsQuery();

  if (loading || !data?.portfolioAuthed) {
    return <LoadingPage />;
  }

  return (
    <Protect feature="email_notifications" fallback={<SeePaymentPlans />}>
      <NotificationForm defaultValues={data?.portfolioAuthed} />
    </Protect>
  );
}

const NotificationForm = ({
  defaultValues,
}: {
  defaultValues: z.infer<typeof NotifcationSchema>;
}) => {
  const [updatePortfolio, { loading }] = useUpdatePortfolioMutation();

  const { form, handleSubmit } = useStandardForm<
    z.infer<typeof NotifcationSchema>
  >({
    defaultValues,
    resolver: zodResolver(NotifcationSchema),
    handleSubmit: ({
      endOfYearTaxOpportunityNotification,
      notificationFrequency,
    }) => {
      return toast.promise(
        updatePortfolio({
          variables: {
            data: {
              endOfYearTaxOpportunityNotification: {
                set: endOfYearTaxOpportunityNotification,
              },
              notificationFrequency: {
                set: notificationFrequency,
              },
            },
          },
          onCompleted: ({ updatePortfolio }) => {
            form.reset({
              endOfYearTaxOpportunityNotification:
                updatePortfolio.endOfYearTaxOpportunityNotification,
              notificationFrequency: updatePortfolio.notificationFrequency,
            });
          },
        }),
        {
          loading: 'Saving...',
          success: 'Notification preferences saved',
          error: 'Failed to save notification preferences',
        }
      );
    },
  });
  return (
    <>
      <FormProvider {...form}>
        <form onSubmit={handleSubmit} noValidate={true}>
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Notification Settings
              </h1>
              <p className="text-muted-foreground">
                Manage how and when you receive notifications for this
                portfolio.
              </p>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Email Notifications</CardTitle>
                <CardDescription>
                  Configure which email notifications you receive.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <SwitchField
                  name="endOfYearTaxOpportunityNotification"
                  label="End of year tax opportunities"
                  description="Receive emails about tax opportunities at the end of the year"
                />
                <RadioGroupField
                  name="notificationFrequency"
                  label="Opportunity Frequency"
                  description="How often would you like to receive tax opportunity notifications?"
                  options={[
                    {
                      label: 'Daily',
                      value: HarvestNotificationFrequency.Daily,
                    },
                    {
                      label: 'Weekly',
                      value: HarvestNotificationFrequency.Weekly,
                    },
                    {
                      label: 'Monthly',
                      value: HarvestNotificationFrequency.Monthly,
                    },
                    {
                      label: 'Quarterly',
                      value: HarvestNotificationFrequency.Quarterly,
                    },
                    {
                      label: 'Off',
                      value: HarvestNotificationFrequency.Never,
                    },
                  ]}
                />
              </CardContent>
              <CardFooter>
                <Button
                  type="submit"
                  disabled={loading || !form.formState.isDirty}
                >
                  Save Email Preferences
                </Button>
              </CardFooter>
            </Card>
          </div>
        </form>
      </FormProvider>
    </>
  );
};
