import { Resolver } from "@nestjs/graphql";

// import { Prisma } from "@prisma/client";
// import { type GraphQLResolveInfo } from "graphql";
// import { VectorGraph, VectorGraphWhereInput } from "../generated/graphql";
// import { PrismaSelect } from "../utilities/prisma/prisma-select";
import { VectorGraphService } from "./vector-graph.service";
// import { GraphTimeValue } from "./vector-graph.types";

// @ObjectType()
// class SimilarityChart {
//   @Field(() => String)
//   assetSymbol: string;
//   @Field(() => [String])
//   assets: string[];
//   @Field(() => [Number])
//   dateTimes: number[];
//   @Field(() => [[Number]])
//   values: number[][];
//   @Field(() => Number)
//   minValue: number;
//   @Field(() => Number)
//   maxValue: number;
// }

@Resolver()
export class VectorGraphResolver {
  constructor(private readonly vectorGraphService: VectorGraphService) {}

  // @Query(() => [VectorGraph], {
  //   description: "Get vector graphs.",
  //   name: "vectorGraphs",
  // })
  // async vectorGraphs(
  //   @Info()
  //   info: GraphQLResolveInfo,
  //   @Args("where", { type: () => VectorGraphWhereInput })
  //   where: Prisma.VectorGraphWhereInput,
  // ) {
  //   const { select } = new PrismaSelect<Prisma.VectorGraphSelect>(info).value;

  // return await this.vectorGraphService.findMany({
  //   select,
  //   where,
  // });
  //   return [];
  // }

  // @Query(() => SimilarityChart, {
  //   description: "Get vector graphs.",
  //   name: "similarityChart",
  // })
  // async similarityChart(
  //   @Args("parentVectorId", { type: () => String })
  //   parentVectorId: string,
  //   @Args("neighborVectorIds", { type: () => [String] })
  //   neighborVectorIds: string[],
  // ): Promise<SimilarityChart> {
  //   const vectorGraphs = await this.vectorGraphService.findMany({
  //     where: {
  //       priceHourlyVectorId: {
  //         in: [...neighborVectorIds, parentVectorId],
  //       },
  //     },
  //   });

  //   const parentVectorGraph = vectorGraphs.find(
  //     vectorGraph => vectorGraph.priceHourlyVectorId === parentVectorId,
  //   );

  //   if (!parentVectorGraph) {
  //     throw new Error("Unable to identify parent vector.");
  //   }

  //   const similarityChart: SimilarityChart = {
  //     assets: vectorGraphs.map(g => g.assetSymbol),
  //     assetSymbol: parentVectorGraph.assetSymbol,
  //     dateTimes: [],
  //     maxValue: -Infinity,
  //     minValue: Infinity,
  //     values: [],
  //   };

  //   // Every vector in the DB is the same length however they are prefilled with '0' for cases where the underlying vector isnt using the whole length
  //   // here we need to truncate to whats actually used
  //   let firstRelevantIndex = 0;
  //   while (
  //     (parentVectorGraph.data[firstRelevantIndex + 1] as GraphTimeValue)
  //       .value === 0 &&
  //     firstRelevantIndex + 1 < parentVectorGraph.data.length
  //   ) {
  //     firstRelevantIndex++;
  //   }

  //   // Contruct one data point per datetime slice
  //   for (
  //     let dataIndex = firstRelevantIndex;
  //     dataIndex < parentVectorGraph.data.length;
  //     dataIndex++
  //   ) {
  //     const parentVectorDataPoint = parentVectorGraph.data[
  //       dataIndex
  //     ] as GraphTimeValue;

  //     const dateTime: number = new Date(parentVectorDataPoint.date).getTime();
  //     similarityChart.dateTimes.push(dateTime);
  //     const valueDataPoint: number[] = [];

  //     // Dynamically add all the vector graph info per asset
  //     for (const vector of vectorGraphs) {
  //       const value =
  //         Number((vector.data?.[dataIndex] as GraphTimeValue).value) / 1000;
  //       valueDataPoint.push(value);
  //       similarityChart.minValue = Math.min(similarityChart.minValue, value);
  //       similarityChart.maxValue = Math.max(similarityChart.maxValue, value);
  //     }
  //     similarityChart.values.push(valueDataPoint);
  //   }

  //   return similarityChart;
  // }
}
