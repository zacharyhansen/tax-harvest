import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { Selectable, SelectExpression } from "kysely";

import { taxAdvantadedSubTypes } from "~/plaid/plaid.utils";

import { Database } from "../database/database";
import { DB, LotCurrent } from "../database/db.d";
import { PrismaService } from "../prisma/prisma.service";
import { LotValueType } from "./lot.dto";

@Injectable()
export class LotService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly db: Database,
  ) {}

  upsertLotsForAccount({
    lotSeededDate,
    accountId,
    lots,
    replace,
  }: {
    accountId: string;
    lots: Prisma.LotCreateManyInput[];
    replace: boolean;
    lotSeededDate?: Date;
  }) {
    return this.prismaService.$transaction(async trx => {
      await trx.account.update({
        data: {
          uploadedPositions: true,
          lotSeededDate,
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
      .where("Account.portfolioId", "=", portfolioId)
      // remove tax advantaged accounts
      .where("Account.subType", "not in", [...taxAdvantadedSubTypes])
      // Filter out fractional shares
      .where("LotCurrent.remainingQty", ">=", "1");
    // Order is important  here - biggest winners at top, biggest losers at bottom by per share $

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
