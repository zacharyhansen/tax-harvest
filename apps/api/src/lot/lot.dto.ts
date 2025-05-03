import { Field, ObjectType, registerEnumType } from '@nestjs/graphql'

import { TaxGain } from '../portfolio/portfolio.dto'

export enum LotValueType {
  GAIN = 'GAIN',
  LOSS = 'LOSS',
}

registerEnumType(LotValueType, {
  name: 'LotValueType',
})

@ObjectType({ description: 'GQL object for the lot current database view' })
export class LotCurrent {
  @Field()
  id: string

  @Field()
  accountId: string

  @Field()
  remainingQty: string

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
