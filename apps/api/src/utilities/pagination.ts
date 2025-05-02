import { Field, InputType, Int } from "@nestjs/graphql";

@InputType()
export class PaginationProps {
  @Field(() => Int, { nullable: true })
  skip?: number;

  @Field(() => Int, { nullable: true })
  take?: number;
}
