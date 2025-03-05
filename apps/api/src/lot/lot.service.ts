import { Injectable } from "@nestjs/common";
import { Insertable, Selectable, SelectExpression } from "kysely";
import { DB, Lot, LotCurrent } from "kysely-codegen";

import { Database } from "../database/database";
import { PrismaService } from "../prisma/prisma.service";
import { LotValueType } from "./lot.dto";

@Injectable()
export class LotService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly db: Database,
  ) {}

  upsertLotsForAccount({
    accountId,
    lots,
    replace,
  }: {
    accountId: string;
    lots: Omit<
      Insertable<Lot>,
      "accountId" | "id" | "createdAt" | "updatedAt" | "excludeFromHarvest"
    >[];
    replace: boolean;
  }) {
    return this.prismaService.$transaction(async trx => {
      await trx.account.update({
        data: {
          uploadedPositions: true,
        },
        where: {
          id: accountId,
        },
      });

      const assets = new Set(lots.map(lot => lot.assetSymbol));
      await Promise.all(
        [...assets].map(asset => {
          return trx.asset.upsert({
            create: {
              symbol: asset,
            },
            update: {
              symbol: asset,
            },
            where: {
              symbol: asset,
            },
          });
        }),
      );

      if (replace) {
        await trx.lot.deleteMany({
          where: {
            accountId,
          },
        });
      }

      return trx.lot.createMany({
        data: lots.map(lot => ({
          ...lot,
          accountId,
        })),
      });
    });
  }

  lotCurrent({
    lotIds,
    lotValueType,
    portfolioId,
  }: {
    portfolioId: string;
    lotIds?: string[];
    lotValueType?: LotValueType;
  }): Promise<Selectable<LotCurrent>[]> {
    let query = this.db
      .selectFrom("LotCurrent")
      .innerJoin("Account", "Account.id", "LotCurrent.accountId")
      .select(LotService.lotCurrentFields)
      .where("Account.portfolioId", "=", portfolioId);
    // Order is important to remeber here - biggest winners at top, biggest losers at bottom by per share $

    if (lotIds) {
      query = query.where("LotCurrent.id", "in", lotIds);
    }

    if (lotValueType === LotValueType.GAIN) {
      query = query.where("LotCurrent.gainTotal", ">", "0");
    } else if (lotValueType === LotValueType.LOSS) {
      query = query.where("LotCurrent.gainTotal", "<", "0");
    }
    return query.orderBy("dollarPerSharePnL", "desc").execute();
  }

  private static lotCurrentFields: SelectExpression<
    DB,
    "LotCurrent" | "Account"
  >[] = [
    "accountId",
    "acquiredDate",
    "costBasis",
    "gainTotal",
    "gainTotalPct",
    "LotCurrent.id",
    "lastPrice",
    "price",
    "remainingQty",
    "symbol",
    "value",
    "dollarPerSharePnL",
    "taxGain",
  ];
}
