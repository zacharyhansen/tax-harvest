import type { GraphQLResolveInfo } from 'graphql'
import type { ClerkClaims } from '../auth/types'
import { Args, Info, Mutation, Query, Resolver } from '@nestjs/graphql'
import { Prisma } from '@prisma/client'
import { ClerkContext } from '../auth/decorators/clerk-context.decorator'
import {
  Portfolio,
  PortfolioCreateInput,
  PortfolioUpdateInput,
} from '../generated/graphql'
import { PrismaService } from '../prisma/prisma.service'
import { PrismaSelect } from '../utilities/prisma/prisma-select'
import {
  DirectedHarvestLot,
  HarvestResult,
  PortfolioSummary,
  PortfolioSummaryRealized,
  PortfolioSummaryUnrealized,
} from './portfolio.dto'
import { PortfolioService } from './portfolio.service'

@Resolver(() => Portfolio)
export class PortfolioResolver {
  constructor(
    private readonly portfolioService: PortfolioService,
    private readonly prismaService: PrismaService,
  ) {}

  @Query(() => PortfolioSummary, {
    description: 'Summary summary',
    name: 'portfolioSummary',
  })
  async portfolioSummary(
    @ClerkContext()
    { metadata }: ClerkClaims,
  ): Promise<PortfolioSummary> {
    return this.portfolioService.summary({
      id: metadata.portfolioId,
    })
  }

  @Query(() => PortfolioSummaryUnrealized, {
    description: 'Summary values for portfolio for unrealized change',
    name: 'portfolioSummaryUnrealized',
  })
  async portfolioSummaryUnrealized(
    @ClerkContext()
    { metadata }: ClerkClaims,
  ) {
    return this.portfolioService.summaryUnrealized({
      id: metadata.portfolioId,
    })
  }

  @Query(() => PortfolioSummaryRealized, {
    description: 'Summary values for portfolio for realized change',
    name: 'portfolioSummaryRealized',
  })
  async portfolioSummaryRealized(
    @ClerkContext()
    { metadata }: ClerkClaims,
  ) {
    return this.portfolioService.summaryUnrealized({
      id: metadata.portfolioId,
    })
  }

  @Query(() => [Portfolio], {
    description: 'Get all portfolios for a user',
    name: 'portfolios',
  })
  async portfolios(
    @Info()
    info: GraphQLResolveInfo,
    @ClerkContext()
    currentUser: ClerkClaims,
  ) {
    const { select } = new PrismaSelect<Prisma.PortfolioSelect>(info).value

    return await this.portfolioService.getPortfoliosByUserId(currentUser.sub, {
      select,
    })
  }

  @Query(() => Portfolio, {
    description: 'Get portfolio by portfolio id',
    name: 'portfolioById',
  })
  async portfolioById(
    @Info()
    info: GraphQLResolveInfo,
    @ClerkContext()
    currentUser: ClerkClaims,
    @Args('id', {
      type: () => String,
    })
    portfolioId: string,
  ) {
    const { select } = new PrismaSelect<Prisma.PortfolioSelect>(info).value

    return await this.portfolioService.getPortfolioByPortfolioId(
      currentUser.sub,
      portfolioId,
      select,
    )
  }

  @Query(() => Portfolio, {
    description: 'Get authenticated portfolio',
    name: 'portfolioAuthed',
  })
  async portfolio(
    @Info()
    info: GraphQLResolveInfo,
    @ClerkContext()
    { metadata, sub }: ClerkClaims,
  ) {
    const { select } = new PrismaSelect<Prisma.PortfolioSelect>(info).value
    return await this.portfolioService.getPortfolioAndAssertUserExistsAndHasPortfolio(
      sub,
      select,
      metadata.portfolioId,
    )
  }

  @Mutation(() => Portfolio, {
    description: 'Create a portfolio for a user',
    name: 'createPortfolio',
  })
  async createPortfolio(
    @ClerkContext()
    clerkContext: ClerkClaims,
    @Args('portfolioInsertObject', {
      nullable: false,
      type: () => PortfolioCreateInput,
    })
    portfolioCreateInput: Prisma.PortfolioCreateInput,
  ) {
    return this.portfolioService.createPortfolio(
      clerkContext,
      portfolioCreateInput,
    )
  }

  @Mutation(() => Portfolio, {
    description: 'Log the user into a different portfolio',
    name: 'switchPortfolio',
  })
  async switchPortfolio(
    @ClerkContext()
    clerkContext: ClerkClaims,
    @Args('porfolioId', {
      nullable: false,
      type: () => String,
    })
    porfolioId: string,
  ) {
    return this.portfolioService.switchPortfolio(clerkContext, porfolioId)
  }

  @Mutation(() => Portfolio, {
    description: 'Update a portfolio',
    name: 'updatePortfolio',
  })
  async updatePortfolio(
    @ClerkContext()
    { metadata }: ClerkClaims,
    @Args('data', {
      nullable: false,
      type: () => PortfolioUpdateInput,
    })
    data: Prisma.PortfolioUpdateInput,
  ) {
    return this.prismaService.portfolio.update({
      data,
      where: {
        id: metadata.portfolioId,
      },
    })
  }

  @Query(() => HarvestResult, {
    description: 'Evaluate harvesting for portfolio,',
    name: 'harvestEval',
  })
  async harvestEval(
    @ClerkContext()
    { metadata }: ClerkClaims,
  ): Promise<HarvestResult> {
    return this.portfolioService.harvest({
      portfolioId: metadata.portfolioId,
    })
  }

  @Query(() => HarvestResult, {
    description: 'Harvest within the directed params.',
    name: 'directedHarvest',
  })
  async directedHarvest(
    @ClerkContext()
    { metadata }: ClerkClaims,
    @Args('targetRealized', {
      nullable: false,
      type: () => Number,
    })
    targetRealized: number,
    @Args('targetUnrealized', {
      nullable: false,
      type: () => Number,
    })
    targetUnrealized: number,
    @Args('lots', {
      nullable: false,
      type: () => [DirectedHarvestLot],
    })
    lots: DirectedHarvestLot[],
  ): Promise<Omit<HarvestResult, 'portfolioSummary'>> {
    return this.portfolioService.directedHarvest({
      directedLots: lots,
      portfolioId: metadata.portfolioId,
      targetRealized,
      targetUnrealized,
    })
  }
}
