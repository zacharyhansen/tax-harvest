'use client';

import { Button } from '@repo/ui/components/button';
// import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/card';
import { toast } from '@repo/ui/components/toast-sonner';
import { Receipt } from 'lucide-react';

import {
  HarvestNotificationFrequency,
  useSendNotificationsByFrequencyMutation,
  useSendWashSaleNotificationsForDateMutation,
  useUpdateAllAssetPricesMutation,
} from '~/generated/gql';
import { PageWrapper } from '~/modules/layout';
import { DatePicker } from '@repo/ui/components/date-picker';
import { useState } from 'react';
import { Combobox } from '@repo/ui/components/combobox';

export default function ActionsPage() {
  // const [updateHourlyAssetPrices] = useUpdateHourlyAssetPricesMutation();
  // const [updateAllAssetPrices] = useUpdateAllAssetPricesMutation();

  // const [from, setFrom] = useState(() => {
  //   const date = new Date();
  //   date.setDate(new Date().getDate() - 8);
  //   return date;
  // });
  // const [to, setTo] = useState(new Date());
  // const [startDate, setStartDate] = useState(new Date());

  const [date, setDate] = useState(new Date());
  const [frequency, setFrequency] = useState(
    HarvestNotificationFrequency.Daily
  );

  const [updateAllAssetPrices] = useUpdateAllAssetPricesMutation();
  const [sendWashSaleNotificationsForDate] =
    useSendWashSaleNotificationsForDateMutation();
  const [sendNotificationsByFrequency] =
    useSendNotificationsByFrequencyMutation();

  return (
    <PageWrapper
      title="System Actions"
      description="Invoce actions within the platform."
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="size-6" />
              Refresh Prices
            </CardTitle>
            <CardDescription>
              Pull latest stock prices from Polygon.io
            </CardDescription>
          </CardHeader>
          <CardContent className="align-bottom">
            <Button
              className="w-full"
              onClick={() => {
                toast.promise(updateAllAssetPrices(), {
                  error: 'There was an error',
                  loading: 'Loading',
                  success: 'Prices updated',
                });
              }}
            >
              Refresh Prices
            </Button>
          </CardContent>
        </Card>
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="size-6" />
              Send Wash Sale Notifications
            </CardTitle>
            <CardDescription>
              Send wash sale notifications for a specific date
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 align-bottom">
            <DatePicker
              label="Date"
              mode="single"
              value={date}
              onChange={date => date && setDate(date)}
              required
            />
            <Button
              className="w-full"
              onClick={() => {
                toast.promise(
                  sendWashSaleNotificationsForDate({
                    variables: {
                      date,
                    },
                  }),
                  {
                    error: 'There was an error',
                    loading: 'Loading',
                    success: 'Notifications sent',
                  }
                );
              }}
            >
              Send Notifications
            </Button>
          </CardContent>
        </Card>
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="size-6" />
              Send Notifications By Frequency
            </CardTitle>
            <CardDescription>Send notifications by frequency</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 align-bottom">
            <Combobox
              options={Object.values(HarvestNotificationFrequency).map(
                frequency => ({
                  label: frequency,
                  value: frequency,
                })
              )}
              value={frequency}
              onChange={value =>
                setFrequency(value as HarvestNotificationFrequency)
              }
            />
            <Button
              className="w-full"
              onClick={() => {
                toast.promise(
                  sendNotificationsByFrequency({
                    variables: {
                      frequency,
                    },
                  }),
                  {
                    error: 'There was an error',
                    loading: 'Loading',
                    success: 'Notifications sent',
                  }
                );
              }}
            >
              Send Notifications
            </Button>
          </CardContent>
        </Card>
        {/* <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CandlestickChart className="h-6 w-6" />
              Pull Weekly Price Movements
            </CardTitle>
            <CardDescription>
              Pull 8 days worth of hourly stock data from Polygon.io. This Date
              is used to generate similarity vectors for stock comparison.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 align-bottom">
            <DatePicker
              label="From"
              mode="single"
              selected={from}
              onSelect={date => setFrom(date)}
              required
            />
            <DatePicker
              label="To"
              mode="single"
              selected={to}
              onSelect={date => setTo(date)}
              required
            />
            <Button
              className="w-full"
              onClick={() => {
                toast.promise(
                  updateHourlyAssetPrices({
                    variables: {
                      from,
                      to,
                    },
                  }),
                  {
                    error: 'There was an error',
                    loading: 'Loading',
                    success: 'Pulled Weekly Price Movements',
                  }
                );
              }}
            >
              Pull Weekly Stock Price Movements
            </Button>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Usb className="h-6 w-6" />
              Generate Embeddings
            </CardTitle>
            <CardDescription>
              Based on the hourly price data stored in the system, generate
              embeddings for each stock.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 align-bottom">
            <DatePicker
              label="Start Date"
              mode="single"
              selected={to}
              onSelect={date => setStartDate(date)}
              required
            />
            <Button
              className="w-full"
              onClick={() => {
                toast.promise(
                  generateEmbeddings({
                    variables: {
                      startDate,
                    },
                  }),
                  {
                    error: 'There was an error',
                    loading: 'Loading',
                    success: 'Generated Embeddings',
                  }
                );
              }}
            >
              Generate Embeddings
            </Button>
          </CardContent>
        </Card> */}
      </div>
    </PageWrapper>
  );
}
