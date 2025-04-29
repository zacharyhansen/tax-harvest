import type { ClerkClaims } from "~/auth/types";

import { Injectable, Logger } from "@nestjs/common";
import { Portfolio, PortfolioRole, Prisma } from "@prisma/client";
import Decimal from "decimal.js";
import { sql } from "kysely";

import { taxAdvantadedSubTypes } from "~/plaid/plaid.utils";

import { AccountService } from "../account/account.service";
import { ClerkService } from "../clerk/clerk.service";
import { Database } from "../database/database";
import { HarvestType } from "../generated/graphql";
import { HarvestService } from "../harvest/harvest.service";
import { LotService } from "../lot/lot.service";
import { PrismaService } from "../prisma/prisma.service";
import { UserService } from "../user/user.service";
import {
  DirectedHarvestLot,
  HarvestRecomendation,
  HarvestResult,
  PortfolioSummary,
  PortfolioSummaryRealized,
  PortfolioSummaryUnrealized,
  SetUpStatus,
} from "./portfolio.dto";
import Harvest, { LotHarvestInput } from "./portfolio.harvest";
@Injectable()
export class PortfolioService {
  private readonly logger = new Logger(PortfolioService.name);

  constructor(
    private readonly db: Database,
    private readonly prismaService: PrismaService,
    private readonly clerkService: ClerkService,
    private readonly userService: UserService,
    private readonly lotService: LotService,
    private readonly harvestService: HarvestService,
    private readonly accountService: AccountService,
  ) {}

  getPortfoliosByUserId(userId: string, args: Prisma.PortfolioFindManyArgs) {
    return this.prismaService.portfolio.findMany({
      ...args,
      where: {
        usersOnPortfolios: {
          some: {
            userId: userId,
          },
        },
      },
    });
  }

  async switchPortfolio(clerkContext: ClerkClaims, portfolioId: string) {
    const portfolio = await this.getPortfolioById(portfolioId);

    await this.clerkService.updatePublicMetaData(clerkContext.sub, {
      portfolioId: portfolio.id,
    });

    return portfolio;
  }

  /**
   * Special portfolio query that will create or reset a users portfolio
   * in clerk if they do not have a default portfolio
   * i.e. a user logs in for the first time or their default protfolio has been deleted
   */
  async getPortfolioAndAssertUserExistsAndHasPortfolio(
    userId: string,
    select: Prisma.PortfolioSelect,
    portfolioId?: string,
  ) {
    const user = await this.userService.asserUserExists(userId);

    return this.prismaService.portfolio
      .findFirstOrThrow({
        select,
        where: {
          id: portfolioId,
          usersOnPortfolios: {
            some: {
              userId: user.id,
            },
          },
        },
      })
      .catch(() => this.assertUserHasDefaultPortfolio(user.id, portfolioId));
  }

  getPortfolioByPortfolioId(
    userId: string,
    portfolioId: string,
    select: Prisma.PortfolioSelect,
  ) {
    return this.prismaService.portfolio.findFirstOrThrow({
      select,
      where: {
        id: portfolioId,
        // Enforce user has access to the portfolio
        usersOnPortfolios: {
          some: {
            userId: userId,
          },
        },
      },
    });
  }

  getPortfolioById(portfolioId: string) {
    return this.db
      .selectFrom("Portfolio")
      .selectAll()
      .where("Portfolio.id", "=", portfolioId)
      .executeTakeFirstOrThrow();
  }

  getPortfolioByIdWithUserId(
    id: string,
    userId: string,
    select: Prisma.PortfolioSelect,
  ) {
    return this.prismaService.portfolio.findUniqueOrThrow({
      select,
      where: {
        id,
        usersOnPortfolios: {
          some: {
            userId,
          },
        },
      },
    });
  }

  async createPortfolio(
    clerkContext: ClerkClaims,
    portfolioCreateInput: Prisma.PortfolioCreateInput,
    role?: PortfolioRole,
  ) {
    const portfolio = await this.prismaService.portfolio.create({
      data: {
        ...portfolioCreateInput,
        usersOnPortfolios: {
          create: {
            role,
            userId: clerkContext.sub,
          },
        },
      },
    });

    await this.clerkService.updatePublicMetaData(clerkContext.sub, {
      portfolioId: portfolio.id,
    });

    return portfolio;
  }

  /**
   * Ensures that a clerk user exists in the DB and has at least one portfolio
   * Creates the portfolio if needed
   * @param userId
   * @param portfolioId
   * @returns Portfolio
   */
  async assertUserHasDefaultPortfolio(
    userId: string,
    portfolioId?: string,
  ): Promise<Portfolio> {
    const portfolio = await this.prismaService.portfolio.findFirst({
      where: {
        usersOnPortfolios: {
          some: {
            portfolioId: {
              equals: portfolioId,
            },
            userId: {
              equals: userId,
            },
          },
        },
      },
    });

    let authedPortfolio = portfolio;
    // If the user does not have at least 1 portfolio we create it and connect them to it as an admin
    if (!portfolio) {
      authedPortfolio = await this.prismaService.portfolio
        .create({
          data: {
            createdById: userId,
            id: portfolioId,
            usersOnPortfolios: {
              create: {
                role: "ADMIN",
                userId: userId,
              },
            },
          },
        })
        .catch(() => {
          throw new Error("Unauthorized access to portfolio");
        });
    }

    if (!authedPortfolio) {
      throw new Error("Unauthorized access to portfolio");
    }

    // Set the portfolio on the clerk meta data so they are authed for it
    await this.clerkService.updatePublicMetaData(userId, {
      portfolioId: authedPortfolio.id,
    });

    return authedPortfolio;
  }

  async summary({ id }: { id: string }): Promise<PortfolioSummary> {
    const [realized, unrealized, accounts, setupAccounts] = await Promise.all([
      this.summaryRealized({ id }),
      this.summaryUnrealized({ id }),
      this.prismaService.account.count({
        where: {
          ...PortfolioService.RELEVANT_HARVEST_ACCOUNTS_WHERE({
            portfolioId: id,
          }),
        },
      }),
      this.accountService.setupAccounts({
        id,
        select: {
          id: true,
        },
      }),
    ]);

    return {
      ...this.calculateHarvest({
        realized,
        unrealized,
      }),
      setUpStatus:
        accounts === 0
          ? SetUpStatus.NO_ACCOUNTS
          : setupAccounts.length > 0
            ? SetUpStatus.ACCOUNT_SETUP_REQUIRED
            : SetUpStatus.COMPLETE,
    };
  }

  calculateHarvest({
    realized,
    unrealized,
  }: {
    realized: PortfolioSummaryRealized;
    unrealized: PortfolioSummaryUnrealized;
  }): Omit<PortfolioSummary, "setUpStatus"> {
    let gainTotalUnrealized = new Decimal(unrealized.gainTotal);
    let lossTotalUnrealized = new Decimal(unrealized.lossTotal);
    const gainTotalRealized = new Decimal(realized.gainTotal);

    const realizedSign = Math.sign(gainTotalRealized.toNumber());

    const harvest = {
      realized: new Decimal(0),
      total: new Decimal(0),
      unrealized: new Decimal(0),
    };

    // Figure out the realized amount and reset unrealized for that amount
    if (realizedSign === -1) {
      if (
        gainTotalRealized.absoluteValue().toNumber() >
        gainTotalUnrealized.absoluteValue().toNumber()
      ) {
        harvest.realized = gainTotalUnrealized;
        gainTotalUnrealized = new Decimal(0);
      } else {
        harvest.realized = gainTotalRealized.times(-1);
        gainTotalUnrealized = gainTotalUnrealized.plus(gainTotalRealized);
      }
    } else if (realizedSign === 1) {
      if (
        gainTotalRealized.absoluteValue().toNumber() >
        lossTotalUnrealized.absoluteValue().toNumber()
      ) {
        harvest.realized = lossTotalUnrealized;
        lossTotalUnrealized = new Decimal(0);
      } else {
        harvest.realized = gainTotalRealized.times(-1);
        lossTotalUnrealized = lossTotalUnrealized.plus(gainTotalRealized);
      }
    }

    harvest.unrealized = gainTotalUnrealized.greaterThan(
      lossTotalUnrealized.absoluteValue(),
    )
      ? lossTotalUnrealized
      : gainTotalUnrealized;

    harvest.total = harvest.realized
      .absoluteValue()
      .add(harvest.unrealized.absoluteValue());

    const summary = {
      harvest: {
        realized: harvest.realized.toNumber(),
        total: harvest.total.toNumber(),
        unrealized: harvest.unrealized.toNumber(),
      },
      realized,
      unrealized,
    };

    return {
      ...summary,
      harvestRecommendations: this.harvestRecommendations({
        portfolioSummary: summary,
      }),
    };
  }

  async summaryUnrealized({
    id,
  }: {
    id: string;
  }): Promise<PortfolioSummaryUnrealized> {
    const result = await this.db
      .selectFrom("LotCurrent")
      .innerJoin("Account", "Account.id", "LotCurrent.accountId")
      .select([
        sql<
          number | null
        >`SUM(CASE WHEN "LotCurrent"."gainTotal" < 0 THEN "LotCurrent"."gainTotal" ELSE 0 END)`.as(
          "lossTotal",
        ),
        sql<
          number | null
        >`SUM(CASE WHEN "LotCurrent"."gainTotal" >= 0 THEN "LotCurrent"."gainTotal" ELSE 0 END)`.as(
          "gainTotal",
        ),
        sql<number>`COUNT(DISTINCT "Account"."id")`.as("accountCount"),
        sql<number>`COUNT("LotCurrent"."id")`.as("lotCount"),
      ])
      .where("Account.portfolioId", "=", id)
      .where("Account.subType", "not in", [...taxAdvantadedSubTypes])
      .executeTakeFirst();

    if (result) {
      const gainTotal = new Decimal(result.gainTotal ?? 0);
      const lossTotal = new Decimal(result.lossTotal ?? 0);
      return {
        accountCount: Number(result.accountCount),
        gainTotal: gainTotal.toNumber(),
        lossTotal: lossTotal.toNumber(),
        positionCount: Number(result.lotCount),
      };
    }

    return {
      accountCount: 0,
      gainTotal: 0,
      lossTotal: 0,
      positionCount: 0,
    };
  }

  async summaryRealized({
    id,
  }: {
    id: string;
  }): Promise<PortfolioSummaryRealized> {
    const pAndL = await this.prismaService.realizedPAndL.findMany({
      where: {
        account: {
          ...PortfolioService.RELEVANT_HARVEST_ACCOUNTS_WHERE({
            portfolioId: id,
          }),
        },
        year: {
          equals: new Date().getFullYear(),
        },
      },
    });

    const gainShortTerm = pAndL.reduce((acc, curr) => {
      return (acc += Number(curr.shortTerm));
    }, 0);

    const gainLongTerm = pAndL.reduce((acc, curr) => {
      return (acc += Number(curr.longTerm));
    }, 0);

    const dividend = pAndL.reduce((acc, curr) => {
      return (acc += Number(curr.dividend));
    }, 0);

    return {
      accountCount: pAndL.length,
      dividend,
      gainLongTerm,
      gainShortTerm,
      gainTotal: gainLongTerm + gainShortTerm + dividend,
    };
  }

  /**
   * General Portfolio Harvest
   *
   * Looks over all lots in a portoflio and tries to harvest all possible realized and unrealized gains
   */
  async harvest({
    portfolioId,
  }: {
    portfolioId: string;
  }): Promise<HarvestResult> {
    const [portfolioSummary, lots, portfolio] = await Promise.all([
      this.summary({
        id: portfolioId,
      }),
      this.lotService.lotCurrent({ portfolioId }),
      this.prismaService.portfolio.findUniqueOrThrow({
        where: {
          id: portfolioId,
        },
      }),
    ]);

    const harvest = new Harvest({
      lots: lots.map(
        lot =>
          ({
            ...lot,
            accountId: lot.accountId,
            originalQty: lot.remainingQty,
            processQty: lot.remainingQty,
          }) as LotHarvestInput,
      ),
      portfolio,
      targetRealized: portfolioSummary.harvest.realized,
      targetUnrealized: portfolioSummary.harvest.unrealized,
    });

    harvest.process();

    return {
      allOrders: harvest.allOrders,
      portfolioSummary,
      realizedOrders: harvest.realizedOrders,
      unrealizedOrders: harvest.unrealizedOrders,
    };
  }

  async directedHarvest({
    directedLots,
    portfolioId,
    targetRealized,
    targetUnrealized,
  }: {
    portfolioId: string;
    directedLots: DirectedHarvestLot[];
    targetRealized: number;
    targetUnrealized: number;
  }) {
    const [portfolio, lots] = await Promise.all([
      this.prismaService.portfolio.findUniqueOrThrow({
        where: {
          id: portfolioId,
        },
      }),
      this.lotService.lotCurrent({
        lotIds: directedLots.map(lot => lot.lotId),
        portfolioId,
      }),
    ]);

    const harvest = new Harvest({
      lots: lots.map(lot => {
        const qty =
          directedLots.find(dl => dl.lotId === lot.id)?.quantity ?? "0";
        return {
          ...lot,
          accountId: lot.accountId,
          originalQty: qty,
          processQty: qty,
        } as LotHarvestInput;
      }),
      portfolio,
      targetRealized,
      targetUnrealized,
    });

    harvest.process();

    return {
      allOrders: harvest.allOrders,
      realizedOrders: harvest.realizedOrders,
      unrealizedOrders: harvest.unrealizedOrders,
    };
  }

  harvestRecommendations({
    portfolioSummary,
  }: {
    portfolioSummary: Omit<
      PortfolioSummary,
      "setUpStatus" | "harvestRecommendations"
    >;
  }): HarvestRecomendation[] {
    const result: HarvestRecomendation[] = [];

    const recommendRealizedAction = new Decimal(
      portfolioSummary.harvest.realized,
    )
      .absoluteValue()
      .greaterThan(50);

    if (portfolioSummary.harvest.realized < 0) {
      // If there is a significant realized harvest gain we want to reduce taxes
      if (recommendRealizedAction) {
        result.push({
          amountRealized: portfolioSummary.harvest.realized,
          amountTotal: portfolioSummary.harvest.realized,
          amountUnrealized: 0,
          harvestType: HarvestType.REDUCE_TAXES,
          recommended: true,
        });
      } else {
        const amount = Math.min(portfolioSummary.harvest.realized, 0);
        result.push({
          amountRealized: amount,
          amountTotal: amount,
          amountUnrealized: 0,
          harvestType: HarvestType.REDUCE_TAXES,
          recommended: false,
        });
      }
    } else {
      // If there is a significant realized harvest loss we want to capture gains
      if (recommendRealizedAction) {
        result.push({
          amountRealized: portfolioSummary.harvest.realized,
          amountTotal: portfolioSummary.harvest.realized,
          amountUnrealized: 0,
          harvestType: HarvestType.CAPTURE_GAINS_TAX_FREE,
          recommended: true,
        });
      } else {
        const amount = Math.min(portfolioSummary.harvest.realized, 0);
        result.push({
          amountRealized: amount,
          amountTotal: amount,
          amountUnrealized: 0,
          harvestType: HarvestType.CAPTURE_GAINS_TAX_FREE,
          recommended: false,
        });
      }
    }

    // else if there some some amount to be harvested its to increase cost basis
    result.push(
      {
        amountRealized: portfolioSummary.harvest.realized,
        amountTotal: portfolioSummary.harvest.total,
        amountUnrealized: portfolioSummary.harvest.unrealized,
        harvestType: HarvestType.REDUCE_COST_BASIS,
        recommended:
          !recommendRealizedAction && portfolioSummary.harvest.total > 50,
      },
      {
        amountRealized: 0,
        amountTotal: 0,
        amountUnrealized: 0,
        harvestType: HarvestType.SELL,
        recommended: false,
      },
    );

    return result;
  }

  public static RELEVANT_HARVEST_ACCOUNTS_WHERE({
    portfolioId,
  }: {
    portfolioId: string;
  }): Prisma.AccountWhereInput {
    return {
      portfolioId,
      subType: {
        notIn: [...taxAdvantadedSubTypes],
      },
    };
  }
}
