import { Field, ObjectType, registerEnumType } from '@nestjs/graphql'

export enum LotValueType {
  GAIN = 'GAIN',
  LOSS = 'LOSS',
}

export enum TaxGain {
  LONG = 'LONG',
  SHORT = 'SHORT',
}

registerEnumType(TaxGain, {
  name: 'TaxGain',
})

registerEnumType(LotValueType, {
  name: 'LotValueType',
})

@ObjectType({ description: 'GQL object for the lot current database view' })
export class LotCurrent {
  @Field()
  id: string

  @Field()
  accountId: string

  @Field({ description: 'How many shares from this lot are available to be harvested. Importantly this is the actual amount we know from plaid exists at the current time.' })
  remainingQty: string

  @Field({ description: 'How many shares from this lot are in "in flight" harvests.' })
  currentHarvestQty: string

  @Field({ description: 'How many shares from this lot are available to be harvested.' })
  availableQty: string

  @Field(() => Date)
  acquiredDate: Date

  @Field()
  price: string

  @Field()
  symbol: string

  @Field()
  lastPrice: string

  @Field()
  costBasis: string

  @Field()
  value: string

  @Field()
  gainTotal: string

  @Field()
  gainTotalPct: string

  @Field()
  dollarPerSharePnL: string

  @Field(() => TaxGain)
  taxGain: TaxGain
}

@ObjectType({ description: 'GQL object for the lot fields returned in harvest API\'s' })
export class HarvestLotCurrent extends LotCurrent {
  @Field({ description: 'How many shares from this lot are we going to harvest.' })
  harvestQuantity: string

  @Field(() => Number, { description: 'The P&L of the harvest for this lot (depending on the number of shares we will harvest).' })
  harvestPAndL: number
}
