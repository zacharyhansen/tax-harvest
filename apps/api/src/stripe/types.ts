import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class StripeSession {
  @Field(() => String)
  id: string

  @Field(() => String, { nullable: true })
  client_secret: string | null
}

@ObjectType()
export class StripeProduct {
  @Field(() => String)
  id: string

  @Field(() => Boolean, { nullable: true })
  active: boolean

  @Field(() => String, { nullable: true })
  description: string | null

  @Field(() => [StripeMarketingFeature])
  marketing_features: StripeMarketingFeature[]
}

@ObjectType()
export class StripeMarketingFeature {
  @Field(() => String, { nullable: true })
  name?: string
}
