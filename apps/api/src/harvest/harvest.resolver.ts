import type { Prisma } from '@prisma/client'
import type { GraphQLResolveInfo } from 'graphql'
import type { ClerkClaims } from '../auth/types'

import type { PrismaService } from '../prisma/prisma.service'
import type { HarvestService } from './harvest.service'
import { Args, Info, Mutation, Query, Resolver } from '@nestjs/graphql'
import { ClerkContext } from '../auth/decorators/clerk-context.decorator'
import {
  Harvest,
  HarvestTransaction,
  HarvestTransactionItem,
  HarvestTransactionItemUpdateInput,
  HarvestTransactionUpdateInput,
  HarvestType,
  HarvestUpdateInput,
  HarvestWhereInput,
} from '../generated/graphql'
import { DirectedHarvestLot } from '../portfolio/portfolio.dto'
import { PrismaSelect } from '../utilities/prisma/prisma-select'

@Resolver()
export class HarvestResolver {
  constructor(
    private readonly harvestService: HarvestService,
    private readonly prismaService: PrismaService,
  ) {}

  @Mutation(() => Harvest, {
    description: 'Create harvest based on selected DirectedHarvestLot',
    name: 'createHarvest',
  })
  async createHarvest(
    @Info()
    info: GraphQLResolveInfo,
    @ClerkContext()
    { metadata, sub }: ClerkClaims,
    @Args('directedHarvestLots', {
      nullable: false,
      type: () => [DirectedHarvestLot],
    })
    directedHarvestLots: DirectedHarvestLot[],
    @Args('harvestType', {
      nullable: false,
      type: () => HarvestType,
    })
    harvestType: HarvestType,
  ) {
    const { select } = new PrismaSelect<Prisma.HarvestSelect>(info).value

    return this.harvestService.createHarvest({
      createdById: sub,
      harvestLots: directedHarvestLots,
      harvestType,
      portfolioId: metadata.portfolioId,
      select,
    })
  }

  @Query(() => [Harvest], {
    description: 'Get Harvests',
    name: 'harvests',
  })
  async harvests(
    @Info()
    info: GraphQLResolveInfo,
    @ClerkContext()
    { metadata }: ClerkClaims,
    @Args('where', {
      nullable: true,
      type: () => HarvestWhereInput,
    })
    where?: HarvestWhereInput,
  ) {
    const { select } = new PrismaSelect<Prisma.HarvestSelect>(info).value

    return this.prismaService.harvest.findMany({
      orderBy: [
        {
          date: 'desc',
        },
      ],
      select,
      where: {
        AND: where
          ? [
              {
                portfolioId: {
                  equals: metadata.portfolioId,
                },
              },
              where,
            ]
          : [
              {
                portfolioId: {
                  equals: metadata.portfolioId,
                },
              },
            ],
      },
    })
  }

  @Query(() => Harvest, {
    description: 'Get a Harvest',
    name: 'harvest',
  })
  async harvest(
    @Info()
    info: GraphQLResolveInfo,
    @ClerkContext()
    { metadata }: ClerkClaims,
    @Args('id', {
      nullable: true,
      type: () => String,
    })
    id: string,
  ) {
    const { select } = new PrismaSelect<Prisma.HarvestSelect>(info).value

    return this.prismaService.harvest.findUniqueOrThrow({
      select,
      where: {
        id,
        portfolioId: {
          equals: metadata.portfolioId,
        },
      },
    })
  }

  @Mutation(() => Harvest, {
    description: 'Update a Harvest',
    name: 'updateHarvest',
  })
  async updateHarvest(
    @Info()
    info: GraphQLResolveInfo,
    @ClerkContext()
    { metadata }: ClerkClaims,
    @Args('id', {
      nullable: true,
      type: () => String,
    })
    id: string,
    @Args('data', {
      nullable: true,
      type: () => HarvestUpdateInput,
    })
    data: Prisma.HarvestUpdateInput,
  ) {
    const { select } = new PrismaSelect<Prisma.HarvestSelect>(info).value

    return this.prismaService.harvest.update({
      data,
      select,
      where: {
        id,
        portfolioId: {
          equals: metadata.portfolioId,
        },
      },
    })
  }

  @Mutation(() => Harvest, {
    description: 'Finalize harvest for review',
    name: 'finalizeHarvest',
  })
  async finalizeHarvest(
    @Info()
    info: GraphQLResolveInfo,
    @Args('id', {
      nullable: true,
      type: () => String,
    })
    id: string,
  ) {
    const { select } = new PrismaSelect<Prisma.HarvestSelect>(info).value

    return this.harvestService.finalizeHarvest({
      harvestId: id,
      select,
    })
  }

  @Mutation(() => HarvestTransaction, {
    description: 'Update a Harvest transaction',
    name: 'updateHarvestTransaction',
  })
  async updateHarvestTransaction(
    @Info()
    info: GraphQLResolveInfo,
    @Args('id', {
      nullable: true,
      type: () => String,
    })
    id: string,
    @Args('data', {
      nullable: true,
      type: () => HarvestTransactionUpdateInput,
    })
    data: Prisma.HarvestTransactionUpdateInput,
  ) {
    const { select } = new PrismaSelect<Prisma.HarvestTransactionSelect>(info)
      .value

    return this.prismaService.harvestTransaction.update({
      data,
      select,
      where: {
        id,
      },
    })
  }

  @Mutation(() => HarvestTransactionItem, {
    description: 'Update a HarvestTransactionItem',
    name: 'updateHarvestTransactionItem',
  })
  async updateHarvestTransactionItem(
    @Info()
    info: GraphQLResolveInfo,
    @Args('id', {
      nullable: true,
      type: () => String,
    })
    id: string,
    @Args('data', {
      nullable: true,
      type: () => HarvestTransactionItemUpdateInput,
    })
    data: Prisma.HarvestTransactionItemUpdateInput,
  ) {
    const { select } = new PrismaSelect<Prisma.HarvestTransactionItemSelect>(
      info,
    ).value

    return this.prismaService.harvestTransactionItem.update({
      data,
      select,
      where: {
        id,
      },
    })
  }
}
