'use client';

import type { FC } from 'react';
import React, { useState } from 'react';
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';
import {
  Alert,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from 'ui';
import { formatDate } from 'utilities';
import type { PriceHourlyVectorWithNeighborItemFragment } from 'generated/gql';
import { useSimilarityChartQuery, VectorWindow } from 'generated/gql';
import { LoadingPage } from 'modules/utilityComponents';

const windowToLabel: Record<VectorWindow, string> = {
  [VectorWindow.Month_1]: '1 Month',
  [VectorWindow.Month_3]: '3 Month',
  [VectorWindow.Month_6]: '6 Month',
  [VectorWindow.Year_1]: '1 Year',
  [VectorWindow.Year_2]: '2 year',
};

interface SimilarityChartProps {
  parentVector: PriceHourlyVectorWithNeighborItemFragment;
  priceHourlyVectors: PriceHourlyVectorWithNeighborItemFragment['_neighborPriceHourlyVectors'];
}

interface ChartData {
  dateTime: number;
  [key: string]: number;
}

const SimilarityChart: FC<SimilarityChartProps> = ({
  parentVector,
  priceHourlyVectors,
}) => {
  const [chartData, setChartData] = useState<{
    data?: ChartData[];
    minValue: number;
    maxValue: number;
    assets: string[];
    assetSymbol?: string;
  }>({ assets: [], maxValue: 0, minValue: 0 });

  const { error, loading } = useSimilarityChartQuery({
    // We use state/onComplete here to prevent recharts from rendering anything till data is fully formatted
    onCompleted: ({ similarityChart }) => {
      setChartData({
        assets: similarityChart.assets,
        assetSymbol: similarityChart.assetSymbol,
        data: similarityChart.dateTimes.map((time, dateI) => ({
          dateTime: time,
          ...similarityChart.assets.reduce(
            (acc, asset, assetI) => ({
              ...acc,
              [asset]: similarityChart.values[dateI][assetI],
            }),
            {}
          ),
        })),
        maxValue: similarityChart.maxValue,
        minValue: similarityChart.minValue,
      });
    },
    skip: !priceHourlyVectors?.length,
    variables: {
      neighborVectorIds: priceHourlyVectors!.map(v => v.id),
      parentVectorId: parentVector.id,
    },
  });

  if (loading && !chartData.data?.length) {
    return <LoadingPage />;
  }

  if (error) {
    return <Alert>There was an issue displaying the chart.</Alert>;
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>{windowToLabel[parentVector.vectorWindow]}</CardTitle>
          <CardDescription>{chartData.assetSymbol}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <div className="aspect-auto h-[400px] w-full">
          <ChartContainer config={{}} className="aspect-auto h-full w-full">
            <LineChart
              data={chartData.data}
              margin={{
                bottom: 10,
                left: 20,
                right: 30,
                top: 20,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="dateTime"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={value => {
                  const date = new Date(value);
                  return date.toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'short',
                  });
                }}
              />
              <YAxis
                domain={[chartData.minValue * 0.9, chartData.maxValue * 1.1]}
                tickFormatter={value => `${value.toFixed(2)}%`}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    className="w-[150px]"
                    labelFormatter={(value, payload) => {
                      return new Date(
                        payload?.[0]?.payload.dateTime
                      ).toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'short',
                      });
                    }}
                  />
                }
              />
              {chartData.assets.map((asset, i) => (
                <Line
                  type="monotone"
                  dataKey={asset}
                  key={asset}
                  stroke={`hsl(var(--chart-sim-${i}))`}
                  strokeWidth={asset === chartData.assetSymbol ? 3 : 1}
                  dot={false}
                />
              ))}
            </LineChart>
          </ChartContainer>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="font-medium leading-none"></div>
        <div className="text-muted-foreground leading-none">
          {chartData.data
            ? `Showing relative profit and loss similarities from ${formatDate(chartData.data[0].dateTime)} to ${formatDate(chartData.data[chartData.data.length - 1]?.dateTime)}.`
            : null}
        </div>
      </CardFooter>
    </Card>
  );
};

export default SimilarityChart;
