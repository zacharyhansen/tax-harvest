import { Injectable, Logger } from "@nestjs/common";
import { QueryResult, sql } from "kysely";

import { Database } from "../database/database";
import { Graph, VectorWindow } from "@prisma/client";
import { PriceHourlyVector, Prisma } from "@prisma/client";
import { PolygonService } from "../polygon/polygon.service";
import { PrismaService } from "../prisma/prisma.service";
import { GraphTimeValue } from "../vector-graph/vector-graph.types";

interface PriceHourlyNeighborsQueryResult {
  id: string;
  assetSymbol: string;
  vectorWindow: VectorWindow;
  startDate: Date;
  neighborVectorIds: string[];
  createdAt: Date;
  updatedAt: Date;
}
/**
 * There seems to be missing data points for some indivdual stocks. We will use a standrard asset to determine the required dimensions for each embedding
 * Tickers that are missing data should properly backfil dimensions as needed to ensure embeddings are created in an expected / standard way
 */
const EMBEDDING_LENGTH = 1060;

@Injectable()
export class PriceHourlyVectorService {
  private readonly logger = new Logger(PriceHourlyVectorService.name);

  constructor(
    private readonly db: Database,

    readonly prismaService: PrismaService,
  ) {}

  async createEmbeddings(startDate: Date = new Date()) {
    startDate.setHours(0, 0, 0, 0);
    return Promise.allSettled(
      PolygonService.assets.map(asset =>
        this.createEmbeddingForTicker(asset, startDate),
      ),
    ).then(results => {
      results.map((result, index) => {
        if (result.status == "rejected") {
          this.logger.error(
            `Unable to generate embedding for ${PolygonService.assets[index]}`,
            result.reason,
          );
        }
      });
    });
  }

  async createEmbeddingForTicker(
    assetSymbol: string,
    startDate: Date = new Date(),
  ) {
    startDate.setHours(0, 0, 0, 0);
    // Get a list of dates going back the requested days (we do hourly within market open hours)
    // This serves as our vectorWindow and each data point in the vectorWindow
    // See VectorWindow - our largest span is 2 years so we will get data for that and use it to insert records for the smaller vectorWindows as well
    const dates = this.generateDates(365 * 2, startDate);

    // Get the prices at each date within our vectorWindow
    const priceForDates = await this.db
      .selectFrom("PriceHourly")
      .select(["startDate", "open"])
      .where("startDate", ">=", dates[0])
      .where("startDate", "<=", dates.at(-1)!)
      .where("assetSymbol", "=", assetSymbol)
      .orderBy("startDate", "asc")
      .execute()
      .then(results =>
        results.map(
          result => [result.startDate.toISOString(), result.open] as const,
        ),
      );

    // Create a map of date to price for easy access
    const dateToPrice = new Map<string, number>(priceForDates);

    const vectorWindows = [
      VectorWindow.MONTH_1,
      VectorWindow.MONTH_3,
      VectorWindow.MONTH_6,
      VectorWindow.YEAR_1,
      VectorWindow.YEAR_2,
    ];

    const vectorResults = await Promise.allSettled(
      vectorWindows.map(vectorWindow =>
        this.buildEmbedding(assetSymbol, startDate, vectorWindow, dateToPrice),
      ),
    ).then(results => {
      return results
        .filter((result, i) => {
          if (result.status !== "fulfilled") {
            this.logger.error(
              `Unable to generate vector for ${assetSymbol} ${vectorWindows[i]}`,
              result.reason,
            );
          }
          return result.status === "fulfilled";
        })
        .map(
          result =>
            (
              result as PromiseFulfilledResult<{
                vectorWindow: VectorWindow;
                vector: string;
                returnPCT: GraphTimeValue[];
              }>
            ).value,
        );
    });

    const vectors = await this.db.transaction().execute(async trx => {
      const vectors = await trx
        .insertInto("PriceHourlyVector")
        .values(
          vectorResults.map(({ vector, vectorWindow }) => ({
            assetSymbol,
            startDate,
            vector,
            vectorWindow,
          })),
        )
        .onConflict(oc =>
          oc
            .columns(["vectorWindow", "assetSymbol", "startDate"])
            .doUpdateSet(eb => ({
              vector: eb.ref("PriceHourlyVector.vector"),
            })),
        )
        .returning(["id", "vectorWindow", "assetSymbol", "startDate"])
        .execute();

      await trx
        .insertInto("VectorGraph")
        .values(
          vectorResults.map(({ returnPCT, vectorWindow }) => ({
            assetSymbol,
            data: returnPCT,
            priceHourlyVectorId: vectors.find(
              vector => vector.vectorWindow === vectorWindow,
            )!.id,
            type: Graph.RETURN_PCT_LINE,
          })),
        )
        .onConflict(oc =>
          oc
            .columns(["assetSymbol", "type", "priceHourlyVectorId"])
            .doUpdateSet(eb => ({
              data: eb.ref("VectorGraph.data"),
            })),
        )
        .execute();

      return vectors;
    });

    return vectors;
  }

  async buildEmbedding(
    assetSymbol: string,
    startDate: Date,
    vectorWindow: VectorWindow,
    dateToPrice: Map<string, number>,
  ): Promise<{
    vectorWindow: VectorWindow;
    vector: string;
    returnPCT: GraphTimeValue[];
  }> {
    const priceChangeEmbedding = Array.from({ length: EMBEDDING_LENGTH }).fill(
      0,
    );

    const dates = this.generateDates(
      PriceHourlyVectorService.vectorWindowDays[vectorWindow],
      startDate,
      PriceHourlyVectorService.vectorWindowSkip[vectorWindow],
    );

    // Get the initial price of the stock at the beginning of the vectorWindow
    const initialPrice = await this.db
      .selectFrom("PriceHourly")
      .select(["open", "startDate"])
      .where("assetSymbol", "=", assetSymbol)
      .where("PriceHourly.startDate", "<=", dates[0])
      .orderBy("startDate", "desc")
      .executeTakeFirstOrThrow();

    let currentReturn = 0;

    // Loop over and calc the return PCT for each date - we store both a FE usable array of percents
    // as well as the embedding (values dont have to be readable here - just consistant to other vectors)
    const returnPCT: GraphTimeValue[] = dates.map((date, index) => {
      const price = dateToPrice.get(date.toISOString());

      // If there was no price data for this day
      if (!price) {
        priceChangeEmbedding[index] = 0;
        // return currentReturn to avoid weird 0's
        return {
          date: date.toISOString(),
          value: currentReturn,
        };
      }

      const percent = ((price - initialPrice.open) / initialPrice.open) * 100;
      currentReturn = priceChangeEmbedding[index] = Math.floor(percent * 1000);
      const returnPCT = Math.floor(percent * 100);
      currentReturn = returnPCT;
      return {
        date: date.toISOString(),
        value: returnPCT,
      };
    });
    return {
      returnPCT,
      vector: `[${priceChangeEmbedding.join(",")}]`,
      vectorWindow,
    };
  }

  /**
   * Returns a list of numNeighbors * window requested of neighbors for the given asset.
   * Vectors are time dependent and all generated on the same startDate so we take the startDate
   * in the DB closest to the requested one as the vector "group" we seach within.
   */
  async closestNeighbors({
    assetSymbol,
    numNeighbors = 5,
    startDate = new Date(),
    vectorWindows = [
      VectorWindow.MONTH_1,
      VectorWindow.MONTH_3,
      VectorWindow.MONTH_6,
      VectorWindow.YEAR_1,
      VectorWindow.YEAR_2,
    ],
  }: {
    assetSymbol: string;
    vectorWindows?: VectorWindow[];
    startDate?: Date;
    numNeighbors?: number;
  }): Promise<QueryResult<PriceHourlyNeighborsQueryResult>> {
    // First we find a matching vector of the provided asset that is closest to our desired date
    // The window here does not matter as we always produce vectors for all windows per date
    const matchingEmbedding = await this.db
      .selectFrom("PriceHourlyVector")
      .select(["assetSymbol", "startDate", "createdAt", "updatedAt"])
      .where("assetSymbol", "=", assetSymbol)
      .where(
        "startDate",
        "=",
        this.db
          .selectFrom("PriceHourlyVector")
          .select("startDate")
          .where("assetSymbol", "=", assetSymbol)
          .orderBy(
            sql`ABS(EXTRACT(EPOCH FROM ("startDate" - ${startDate.toISOString()})))`,
          )
          .limit(1),
      )
      .executeTakeFirstOrThrow();

    return sql<PriceHourlyNeighborsQueryResult>`
      select id,
      phv."assetSymbol",
      "startDate"::timestamptz,
      "vectorWindow",
      array_agg(similarity."vectorId") as "neighborVectorIds"
      from "PriceHourlyVector" phv
            left join (
              WITH 
                windows AS (SELECT unnest(ARRAY [${sql.join(vectorWindows.filter(vw => Object.values(VectorWindow).includes(vw)))}]) AS "vectorWindow"),
                reference_vectors AS (SELECT phv3."vectorWindow",
                                            phv3."vector"
                                      FROM "PriceHourlyVector" phv3
                                              JOIN windows w ON phv3."vectorWindow" = w."vectorWindow"::"VectorWindow"
                                      WHERE phv3."assetSymbol" = ${matchingEmbedding.assetSymbol}
                                        AND phv3."startDate" = ${matchingEmbedding.startDate}),
                ranked_assets AS (SELECT phv2."id" as "vectorId",
                                          ${matchingEmbedding.assetSymbol} as "sourceTicker",
                                          phv2."vectorWindow" as "sourceWindow",
                                          phv2."vector",
                                          ROW_NUMBER()
                                          OVER (PARTITION BY phv2."vectorWindow" ORDER BY phv2."vector" <-> ref."vector") as rank
                                  FROM "PriceHourlyVector" phv2
                                            JOIN reference_vectors ref ON phv2."vectorWindow" = ref."vectorWindow"
                                  WHERE phv2."assetSymbol" <> ${matchingEmbedding.assetSymbol})
                      SELECT "vectorId", "sourceTicker", "sourceWindow"
                      FROM ranked_assets
                      WHERE rank <= ${numNeighbors}
                      ORDER BY "sourceWindow", rank) as similarity
                      on similarity."sourceTicker" = phv."assetSymbol" and similarity."sourceWindow" = phv."vectorWindow"
      where phv."assetSymbol" = ${matchingEmbedding.assetSymbol}
      and "startDate" = ${matchingEmbedding.startDate}
      group by id, phv."assetSymbol", "startDate", "vectorWindow"
    `.execute(this.db);
  }

  // Skip will skip that number of hours to the next valid data point
  /// i.e a skip of 3 will only output date enties every 4 hours to get a vector spanning a longer time span
  private generateDates(days: number, startDate: Date, skip = 0): Date[] {
    const dates: Date[] = [];
    const currentDate = new Date(startDate);
    currentDate.setDate(currentDate.getDate() - days);
    let dayCount = days;

    while (dayCount > 0) {
      // Skip weekends
      if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
        for (let hour = 6; hour <= 13; hour = hour + 1 + skip) {
          const date = new Date(currentDate);
          date.setHours(hour, 0, 0, 0);
          dates.push(date);
        }
      }
      // Move to the next day
      dayCount--;
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  }

  static vectorWindowDays: Record<VectorWindow, number> = {
    MONTH_1: 30,
    MONTH_3: 30 * 3,
    MONTH_6: 30 * 6,
    YEAR_1: 365,
    YEAR_2: 365 * 2,
  };

  static vectorWindowSkip: Record<VectorWindow, number> = {
    MONTH_1: 0, // 8 per day * 5 * 4 * 1 = 176 max points
    MONTH_3: 0, // 8 per day * 5 * 4 * 3 = 520 max points
    MONTH_6: 0, // 8 per day * 5 * 4 * 6 = 1040 max points
    YEAR_1: 1, // 4 per day * 5 * 4 * 12 = 1044 max points
    YEAR_2: 3, // 2 per day * 5 * 4 * 12 * 2 = 1044 max points
  };
}
