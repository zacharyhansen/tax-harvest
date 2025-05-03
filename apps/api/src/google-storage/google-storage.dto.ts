import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class GCPUploadFile {
  @Field(() => String)
  fileName: string

  @Field(() => String)
  type: string
}
