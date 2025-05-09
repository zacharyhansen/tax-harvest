import type { GraphQLResolveInfo } from 'graphql'
import type { ClerkClaims } from '~/auth/types'
import { Args, Info, Query, Resolver } from '@nestjs/graphql'
import { Prisma } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'
import { taxAdvantadedSubTypes } from '~/plaid/plaid.utils'
import { ClerkContext } from '../auth/decorators/clerk-context.decorator'
import { Lot, LotWhereInput } from '../generated/graphql'
import { PrismaService } from '../prisma/prisma.service'
import { PrismaSelect } from '../utilities/prisma/prisma-select'
import { LotCurrent, LotValueType } from './lot.dto'
import { LotService } from './lot.service'

@Resolver()
export class LotResolver {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly lotService: LotService,
  ) {}

  @Query(() => [Lot], { name: 'lots', nullable: false })
  lots(
    @ClerkContext()
    clerkContext: ClerkClaims,
    @Info()
    info: GraphQLResolveInfo,
    @Args('where', {
      nullable: true,
      type: () => LotWhereInput,
    })
    where: Prisma.LotWhereInput,
    @Args('includeTaxAdvantaged', {
      nullable: true,
      type: () => Boolean,
    })
    includeTaxAdvantaged: boolean,
  ) {
    const { select } = new PrismaSelect<Prisma.LotSelect>(info).value
    return this.prismaService.lot.findMany({
      orderBy: [
        {
          assetSymbol: 'asc',
        },
        {
          acquiredDate: 'asc',
        },
      ],
      select,
      where: {
        ...where,
        account: {
          portfolio: {
            id: clerkContext.metadata.portfolioId,
          },
          subType: includeTaxAdvantaged
            ? undefined
            : {
                notIn: [...taxAdvantadedSubTypes],
              },
        },
      },
    })
  }

  @Query(() => [LotCurrent], {
    description: 'Lot current view',
    name: 'lotCurrent',
  })
  async lotCurrent(
    @ClerkContext()
    { metadata }: ClerkClaims,
    @Args('lotValueType', {
      nullable: true,
      type: () => LotValueType,
    })
    lotValueType: LotValueType,
    @Args('lotIds', {
      nullable: true,
      type: () => [String],
    })
    lotIds: string[],
    @Args('minTotalPAndL', {
      nullable: true,
      type: () => Number,
    })
    minTotalPAndL?: number,
  ) {
    return this.lotService.lotCurrent({
      lotIds,
      lotValueType,
      portfolioId: metadata.portfolioId,
      minTotalPAndL: minTotalPAndL ? new Decimal(minTotalPAndL) : undefined,
    })
  }
}
