// 'use client';

// import { TrendingDown, TrendingUp } from 'lucide-react';
// import type { FC } from 'react';
// import React, { useMemo, useState } from 'react';
// import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';
// import {

//   ChartContainer,
//   ChartTooltip,
//   ChartTooltipContent,
// } from '@repo/ui/components/chart';
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from '@repo/ui/components/card';

// import { useChart3MonthQuery } from '~/generated/gql';

// interface StockChartProps {
//   asset: string;
// }

// const chartConfig = {
//   close: {
//     color: 'hsl(var(--chart-2))',
//     label: 'Close',
//   },
//   high: {
//     color: 'hsl(var(--chart-3))',
//     label: 'High',
//   },
//   low: {
//     color: 'hsl(var(--chart-1))',
//     label: 'Low',
//   },
//   priceData: {
//     label: 'Price Data',
//   },
// } satisfies ChartConfig;

// const StockChart: FC<StockChartProps> = ({ asset }) => {
//   const [formattedData, setFormattedData] = useState<
//     {
//       close: number;
//       dateTime: number;
//       high: number;
//       low: number;
//       open: number;
//     }[]
//   >([]);

//   const { loading } = useChart3MonthQuery({
//     onCompleted: result => {
//       setFormattedData(
//         (result.chartThreeMonth || []).map(({ c, h, l, o, t }) => ({
//           close: c || 0,
//           dateTime: t || 0,
//           high: h || 0,
//           low: l || 0,
//           open: o || 0,
//         }))
//       );
//     },
//     variables: {
//       asset,
//     },
//   });

//   const minValue = useMemo(
//     () =>
//       Math.min(...formattedData.map(item => Math.min(item.open, item.close))),
//     [formattedData]
//   );

//   const maxValue = useMemo(
//     () =>
//       Math.max(...formattedData.map(item => Math.max(item.open, item.close))),
//     [formattedData]
//   );

//   const company = { asset: 'AAPL', name: 'Apple Inc.' };

//   const percentageChange = useMemo(() => {
//     if (formattedData.length === 0) return 0;

//     const currentDate = new Date().getTime();
//     const thirtyDaysAgo = currentDate - 30 * 24 * 60 * 60 * 1000;

//     const recentData = formattedData.filter(
//       item => item.dateTime >= thirtyDaysAgo
//     );

//     if (recentData.length === 0) return 0;

//     const firstValue = recentData[0].close;
//     const lastValue = recentData[recentData.length - 1].close;

//     return ((lastValue - firstValue) / firstValue) * 100;
//   }, [formattedData]);

//   const isTrendingUp = percentageChange > 0;

//   if (loading && !formattedData.length) {
//     return <LoadingPage />;
//   }

//   return (
//     <Card className="w-full">
//       <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
//         <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
//           <CardTitle>{asset}</CardTitle>
//           <CardDescription>{company.name}</CardDescription>
//         </div>
//       </CardHeader>
//       <CardContent className="px-2 sm:p-6">
//         <div className="aspect-auto h-[400px] w-full">
//           <ChartContainer
//             config={chartConfig}
//             className="aspect-auto h-full w-full"
//           >
//             <LineChart
//               data={formattedData}
//               margin={{
//                 bottom: 10,
//                 left: 20,
//                 right: 30,
//                 top: 20,
//               }}
//             >
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis
//                 dataKey="dateTime"
//                 tickLine={false}
//                 axisLine={false}
//                 tickMargin={8}
//                 minTickGap={32}
//                 tickFormatter={value => {
//                   const date = new Date(value);
//                   return date.toLocaleDateString('en-US', {
//                     day: 'numeric',
//                     month: 'short',
//                   });
//                 }}
//               />
//               <YAxis
//                 domain={[minValue * 0.9, maxValue * 1.1]}
//                 tickFormatter={value => `$${value.toFixed(2)}`}
//               />
//               <ChartTooltip
//                 content={
//                   <ChartTooltipContent
//                     className="w-[150px]"
//                     labelFormatter={(value, payload) => {
//                       return new Date(
//                         payload?.[0]?.payload.dateTime
//                       ).toLocaleDateString('en-US', {
//                         day: 'numeric',
//                         month: 'short',
//                       });
//                     }}
//                   />
//                 }
//               />
//               <Line
//                 type="monotone"
//                 dataKey="high"
//                 stroke={chartConfig.high.color}
//                 strokeWidth={2}
//                 dot={false}
//               />
//               <Line
//                 type="monotone"
//                 dataKey="close"
//                 stroke={chartConfig.close.color}
//                 strokeWidth={2}
//                 dot={false}
//               />
//               <Line
//                 type="monotone"
//                 dataKey="low"
//                 stroke={chartConfig.low.color}
//                 strokeWidth={2}
//                 dot={false}
//               />
//             </LineChart>
//           </ChartContainer>
//         </div>
//       </CardContent>
//       <CardFooter className="flex-col items-start gap-2 text-sm">
//         <div className="font-medium leading-none">
//           {isTrendingUp ? (
//             <>
//               Trending up by{' '}
//               <span className="text-[#2DB78A]">
//                 {percentageChange.toFixed(2)}%{' '}
//               </span>{' '}
//               this month{' '}
//               <TrendingUp className="inline h-4 w-4 text-[#2DB78A]" />
//             </>
//           ) : (
//             <>
//               Trending down by{' '}
//               <span className="text-[#E2366F]">
//                 {percentageChange.toFixed(2)}%{' '}
//               </span>{' '}
//               this month{' '}
//               <TrendingDown className="inline h-4 w-4 text-[#E2366F]" />
//             </>
//           )}
//         </div>
//         <div className="text-muted-foreground leading-none">
//           Showing stock data for the last 3 months
//         </div>
//       </CardFooter>
//     </Card>
//   );
// };

// export default StockChart;
