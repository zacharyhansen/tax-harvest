import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql'
import { OrderType as PrismaOrderType } from '@prisma/client'

import { LotCurrent, TaxGain } from '~/lot/lot.dto'
import { HarvestType, OrderType } from '../generated/graphql'

export enum SetUpStatus {
  NO_ACCOUNTS = 'NO_ACCOUNTS',
  ACCOUNT_SETUP_REQUIRED = 'ACCOUNT_SETUP_REQUIRED',
  COMPLETE = 'COMPLETE',
}

registerEnumType(SetUpStatus, {
  name: 'SetUpStatus',
})

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
export class PortfolioSummaryIncludingHarvest {
  @Field(() => PortfolioSummaryRealized)
  realized: PortfolioSummaryRealized

  @Field(() => PortfolioSummaryUnrealized)
  unrealized: PortfolioSummaryUnrealized

  @Field(() => HarvestPotential)
  harvest: HarvestPotential
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

  @Field(() => PortfolioSummaryIncludingHarvest)
  includingCurrentHarvest: PortfolioSummaryIncludingHarvest
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
export class UnrealizedHarvestMatchResult {
  @Field(() => LotCurrent)
  sourceLot: LotCurrent

  @Field(() => [HarvestLotOrder])
  matchedLotOrders: HarvestLotOrder[]
}

@ObjectType()
export class FiniteHarvestResult {
  @Field(() => PortfolioSummary)
  summary: PortfolioSummary

  @Field(() => HarvestType)
  harvestType: HarvestType

  @Field(() => [LotCurrent], { nullable: true })
  lotsCurrent?: LotCurrent[]

  @Field(() => Number, { description: 'Total number of harvest lots if user is paying' })
  totalHarvestLots: number

  @Field(() => [UnrealizedHarvestMatchResult], { nullable: true })
  unrealizedHarvestMatchResults?: UnrealizedHarvestMatchResult[]
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
