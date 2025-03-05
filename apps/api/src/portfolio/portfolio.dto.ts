import { HarvestType, OrderType } from "@prisma/client";
import { z } from "zod";

export enum TaxGain {
  LONG = "LONG",
  SHORT = "SHORT",
}

export enum SetUpStatus {
  NO_ACCOUNTS = "NO_ACCOUNTS",
  ACCOUNT_SETUP_REQUIRED = "ACCOUNT_SETUP_REQUIRED",
  COMPLETE = "COMPLETE",
}

export const HarvestRecomendationSchema = z.object({
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
});

export const PortfolioSummaryUnrealizedSchema = z.object({
  gainTotal: z.number(),
  lossTotal: z.number(),
  accountCount: z.number(),
  positionCount: z.number(),
});

export const PortfolioSummaryRealizedSchema = z.object({
  accountCount: z.number(),
  gainTotal: z.number(),
  gainShortTerm: z.number(),
  gainLongTerm: z.number(),
  dividend: z.number(),
});

export const HarvestPotentialSchema = z.object({
  realized: z.number(),
  unrealized: z.number(),
  total: z.number(),
});

export const PortfolioSummarySchema = z.object({
  realized: PortfolioSummaryRealizedSchema,
  unrealized: PortfolioSummaryUnrealizedSchema,
  harvest: HarvestPotentialSchema,
  setUpStatus: z.enum(
    Object.values(SetUpStatus) as [
      keyof typeof SetUpStatus,
      ...(keyof typeof SetUpStatus)[],
    ],
  ),
  harvestRecommendations: z.array(HarvestRecomendationSchema),
});

export const HarvestOrderSchema = z.object({
  lotId: z.string().optional(),
  assetSymbol: z.string(),
  quantity: z.number(),
  type: z.enum(["sell", "buy"]),
  profitAndLoss: z.number(),
});

export const HarvestLotOrderSchema = z.object({
  id: z.string(),
  lotId: z.string(),
  accountId: z.string(),
  pricePaid: z.string(),
  costBasis: z.string(),
  valueTotal: z.string(),
  gainTotal: z.string(),
  quantity: z.string(),
  lastPrice: z.string(),
  assetSymbol: z.string(),
  dollarPerSharePnL: z.string(),
  taxGain: z.nativeEnum(TaxGain),
  orderType: z.nativeEnum(OrderType),
  acquiredDate: z.date(),
});

export const HarvestResultSchema = z.object({
  realizedOrders: z.array(HarvestLotOrderSchema),
  unrealizedOrders: z.array(HarvestLotOrderSchema),
  allOrders: z.array(HarvestLotOrderSchema),
  portfolioSummary: PortfolioSummarySchema,
});

export const DirectedHarvestLotSchema = z.object({
  lotId: z.string(),
  quantity: z.number(),
  counterTransaction: z.boolean().optional(),
});

export type HarvestResult = z.infer<typeof HarvestResultSchema>;
export type HarvestOrder = z.infer<typeof HarvestOrderSchema>;
export type HarvestLotOrder = z.infer<typeof HarvestLotOrderSchema>;
export type DirectedHarvestLot = z.infer<typeof DirectedHarvestLotSchema>;
export type PortfolioSummary = z.infer<typeof PortfolioSummarySchema>;
export type PortfolioSummaryRealized = z.infer<
  typeof PortfolioSummaryRealizedSchema
>;
export type PortfolioSummaryUnrealized = z.infer<
  typeof PortfolioSummaryUnrealizedSchema
>;
export type HarvestRecomendation = z.infer<typeof HarvestRecomendationSchema>;
