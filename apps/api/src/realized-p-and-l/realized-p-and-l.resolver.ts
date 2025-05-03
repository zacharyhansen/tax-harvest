import type { Prisma } from '@prisma/client'
import type { GraphQLResolveInfo } from 'graphql'
import type { PrismaService } from '../prisma/prisma.service'

import { Args, Info, Mutation, Resolver } from '@nestjs/graphql'
import { RealizedPAndL, RealizedPAndLUpdateInput } from '../generated/graphql'
import { PrismaSelect } from '../utilities/prisma/prisma-select'

@Resolver()
export class RealizedPandLResolver {
  constructor(private readonly prismaService: PrismaService) {}

  @Mutation(() => RealizedPAndL, {
    description: 'Update RealizedPAndL',
    name: 'updateRealizedPAndL',
  })
  async updateRealizedPAndL(
    @Info()
    info: GraphQLResolveInfo,
    @Args('id', {
      type: () => String,
    })
    id: string,
    @Args('input', {
      type: () => RealizedPAndLUpdateInput,
    })
    input: Prisma.RealizedPAndLUpdateInput,
  ): Promise<RealizedPAndL> {
    const { select } = new PrismaSelect(info).value

    return this.prismaService.realizedPAndL.update({
      data: input,
      select: select as Prisma.RealizedPAndLSelect,
      where: { id },
    })
  }
}
