import { initTRPC } from "@trpc/server";
import { z } from "zod";

const t = initTRPC.create();
const publicProcedure = t.procedure;

const appRouter = t.router({
  app: t.router({ greeting: publicProcedure.input(z.object({ name: z.string() })).output(z.object({ message: z.string() })).query(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any) }),
  plaid: t.router({
    linkToken: publicProcedure.output(z.object({
      linkToken: z.string(),
    })).query(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    setAccessTokenAndSyncAccounts: publicProcedure.input(z.object({
      publicToken: z.string(),
      metaData: z.object({
        institution: z.object({
          name: z.string(),
          institution_id: z.string(),
        }).optional(),
        accounts: z.array(z.object({
          id: z.string(),
          name: z.string(),
          mask: z.string(),
          type: z.string(),
          subtype: z.string().optional(),
          verification_status: z.string().optional(),
        })),
        link_session_id: z.string(),
        transfer_status: z.string().optional(),
      }),
    })).output(z.array(z.string())).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any)
  }),
  portfolio: t.router({
    summary: publicProcedure.input(z.any()).output(z.object({
      realized: z.object({
        accountCount: z.number(),
        gainTotal: z.number(),
        gainShortTerm: z.number(),
        gainLongTerm: z.number(),
        dividend: z.number(),
      }),
      unrealized: z.object({
        gainTotal: z.number(),
        lossTotal: z.number(),
        accountCount: z.number(),
        positionCount: z.number(),
      }),
      harvest: z.object({
        realized: z.number(),
        unrealized: z.number(),
        total: z.number(),
      }),
      setUpStatus: z.enum(
        Object.values(SetUpStatus) as [
          keyof typeof SetUpStatus,
          ...(keyof typeof SetUpStatus)[],
        ],
      ),
      harvestRecommendations: z.array(z.object({
        harvestType: z.enum(
          Object.values(HarvestType) as [
            keyof typeof HarvestType,
            ...(keyof typeof HarvestType)[],
          ],
        ),
        amountRealized: z.number(),
        amountUnrealized: z.number(),
        amountTotal: z.number(),
        recommended: z.boolean(),
      })),
    })).query(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    portfolioAuthed: publicProcedure.output(z.object({
      id: z.string(),
      createdAt: z.coerce.date(),
      updatedAt: z.coerce.date(),
      createdById: z.string().nullable(),
      name: z.string(),
    })).query(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    switchPortfolio: publicProcedure.input(z.object({
      porfolioId: z.string(),
    })).output(z.object({
      success: z.boolean(),
    })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any)
  })
});
export type AppRouter = typeof appRouter;

