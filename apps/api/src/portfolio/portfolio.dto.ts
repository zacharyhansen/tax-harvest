import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql'
import { OrderType as PrismaOrderType } from '@prisma/client'

import { LotCurrent } from '~/lot/lot.dto'
import { HarvestType, Lot, OrderType } from '../generated/graphql'

export enum TaxGain {
  LONG = 'LONG',
  SHORT = 'SHORT',
}

export enum SetUpStatus {
  NO_ACCOUNTS = 'NO_ACCOUNTS',
  ACCOUNT_SETUP_REQUIRED = 'ACCOUNT_SETUP_REQUIRED',
  COMPLETE = 'COMPLETE',
}

registerEnumType(TaxGain, {
  name: 'TaxGain',
})

registerEnumType(SetUpStatus, {
  name: 'SetUpStatus',
})

@ObjectType()
export class HarvestRecomendation {
  @Field(() => HarvestType)
  harvestType: HarvestType

  @Field(() => Number)
  amountRealized: number

  @Field(() => Number)
  amountUnrealized: number

  @Field(() => Number)
  amountTotal: number

  @Field(() => Boolean)
  recommended: boolean
}

@ObjectType()
export class PortfolioSummaryUnrealized {
  @Field()
  gainTotal: number

  @Field()
  lossTotal: number

  @Field()
  accountCount: number

  @Field()
  total: number

  @Field()
  positionCount: number
}

@ObjectType()
export class PortfolioSummaryRealized {
  @Field()
  accountCount: number

  @Field()
  gainTotal: number

  @Field()
  gainShortTerm: number

  @Field()
  gainLongTerm: number

  @Field()
  dividend: number
}

@ObjectType()
export class HarvestPotential {
  @Field(() => Number, {
    description: 'The realized gain or loss that can be harvested',
  })
  realized: number

  @Field(() => Number, {
    description: 'The unrealized gain or loss that can be harvested',
  })
  unrealized: number

  @Field(() => Number, {
    description: 'The total amount to be harvested (should always be positive)',
  })
  total: number
}

@ObjectType()
export class PortfolioSummary {
  @Field(() => PortfolioSummaryRealized)
  realized: PortfolioSummaryRealized

  @Field(() => PortfolioSummaryUnrealized)
  unrealized: PortfolioSummaryUnrealized

  @Field(() => HarvestPotential)
  harvest: HarvestPotential

  @Field(() => SetUpStatus)
  setUpStatus: SetUpStatus

  @Field(() => [HarvestRecomendation])
  harvestRecommendations: HarvestRecomendation[]
}

@ObjectType()
export class HarvestOrder {
  @Field(() => String, { nullable: true })
  lotId?: string

  @Field(() => String)
  assetSymbol: string

  @Field(() => Number)
  quantity: number

  @Field(() => String)
  type: 'sell' | 'buy'

  @Field(() => Number)
  profitAndLoss: number
}

@ObjectType()
export class HarvestLotOrder {
  @Field()
  id: string

  @Field({ description: 'Lot Id' })
  lotId: string

  @Field()
  accountId: string

  @Field()
  pricePaid: string

  @Field()
  costBasis: string

  @Field()
  valueTotal: string

  @Field()
  gainTotal: string

  @Field()
  quantity: string

  @Field()
  lastPrice: string

  @Field()
  assetSymbol: string

  @Field()
  dollarPerSharePnL: string

  @Field(() => TaxGain)
  taxGain: TaxGain

  @Field(() => OrderType)
  orderType: PrismaOrderType

  @Field(() => Date)
  acquiredDate: Date
}

@ObjectType()
export class HarvestResult {
  @Field(() => [HarvestLotOrder])
  realizedOrders: HarvestLotOrder[]

  @Field(() => [HarvestLotOrder])
  unrealizedOrders: HarvestLotOrder[]

  @Field(() => [HarvestLotOrder])
  allOrders: HarvestLotOrder[]

  @Field(() => PortfolioSummary)
  portfolioSummary: PortfolioSummary
}

@ObjectType()
export class FiniteHarvestResult {
  @Field(() => PortfolioSummary)
  summary: PortfolioSummary

  @Field(() => [LotCurrent])
  lotsCurrent: LotCurrent[]
}

@InputType()
export class DirectedHarvestLot {
  @Field(() => String)
  lotId: string

  @Field(() => Number)
  quantity: number

  @Field(() => Boolean, { nullable: true })
  counterTransaction?: boolean
}
