import type { AppTrpcContext } from "~/auth/types";

import { Ctx, Input, Mutation, Query, Router } from "nestjs-trpc";
import { z } from "zod";

import { PortfolioSchema } from "~/prisma-zod";

import { PortfolioSummarySchema } from "./portfolio.dto";
import { PortfolioService } from "./portfolio.service";

@Router({ alias: "portfolio" })
export class PortfolioRouter {
  constructor(private portfolioService: PortfolioService) {}

  @Query({
    input: z.any(),
    output: PortfolioSummarySchema,
  })
  async summary(@Ctx() context: AppTrpcContext) {
    const portfolio = await this.portfolioService.summary({
      id: context.clerkclaims.metadata.portfolioId,
    });
    return portfolio;
  }

  @Query({
    output: z.object({
      id: z.string(),
      createdAt: z.coerce.date(),
      updatedAt: z.coerce.date(),
      createdById: z.string().nullable(),
      name: z.string(),
    }),
  })
  async portfolioAuthed(
    @Ctx() context: AppTrpcContext,
  ): Promise<z.infer<typeof PortfolioSchema>> {
    return await this.portfolioService.getPortfolioAndAssertUserExistsAndHasPortfolio(
      context.clerkclaims.sub,
      context.clerkclaims.metadata.portfolioId,
    );
  }

  @Mutation({
    input: z.object({
      porfolioId: z.string(),
    }),
    output: z.object({
      success: z.boolean(),
    }),
  })
  async switchPortfolio(
    @Ctx()
    context: AppTrpcContext,
    @Input("porfolioId")
    porfolioId: string,
  ) {
    await this.portfolioService.switchPortfolio(
      context.clerkclaims,
      porfolioId,
    );
    return { success: true };
  }
}
