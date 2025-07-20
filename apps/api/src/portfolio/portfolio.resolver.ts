import type { GraphQLResolveInfo } from 'graphql'
import type { ClerkClaims } from '../auth/types'
import { Args, Info, Mutation, Query, Resolver } from '@nestjs/graphql'
import { Prisma } from '@prisma/client'
import { ClerkContext } from '../auth/decorators/clerk-context.decorator'
import { isUserOnFreePlan } from '../auth/types'
import {
  Portfolio,
  PortfolioCreateInput,
  PortfolioUpdateInput,
} from '../generated/graphql'
import { PrismaService } from '../prisma/prisma.service'
import { PrismaSelect } from '../utilities/prisma/prisma-select'
import {
  DirectedHarvestLot,
  FiniteHarvestResult,
  HarvestEvalFilters,
  HarvestEvalResult,
  HarvestResult,
  PortfolioSummary,
} from './portfolio.dto'
import { PortfolioService } from './portfolio.service'

@Resolver(() => Portfolio)
export class PortfolioResolver {
  constructor(
    private readonly portfolioService: PortfolioService,
    private readonly prismaService: PrismaService,
  ) { }

  @Query(() => FiniteHarvestResult, {
    description: 'New harvest endpoint that returns all orders and summary',
    name: 'finiteHarvest',
  })
  async finiteHarvest(
    @ClerkContext()
    clerkClaims: ClerkClaims,
  ): Promise<FiniteHarvestResult> {
    const harvestResult = await this.portfolioService.finiteHarvest({
      portfolioId: clerkClaims.metadata.portfolioId,
    })
    if (isUserOnFreePlan(clerkClaims)) {
      return {
        ...harvestResult,
        lotsCurrent: harvestResult.lotsCurrent?.slice(0, 3),
      }
    }
    return harvestResult
  }

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
    description: 'Get authenticated portfolio',
    name: 'portfolioAuthed',
  })
  async portfolio(
    @ClerkContext()
    { metadata, sub }: ClerkClaims,
  ) {
    return await this.portfolioService.getPortfolioAndAssertUserExistsAndHasPortfolio(
      sub,
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
    return this.prismaService.$extends(PrismaService.forPortfolio(metadata.portfolioId)).portfolio.update({
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

  @Query(() => HarvestEvalResult, {
    description: 'Evaluate harvesting for portfolio,',
    name: 'harvestEvalResult',
  })
  async harvestEvalResult(
    @ClerkContext()
    { metadata }: ClerkClaims,
    @Args('filters', {
      nullable: true,
      type: () => HarvestEvalFilters,
    })
    filters?: HarvestEvalFilters,
  ): Promise<HarvestEvalResult> {
    return this.portfolioService.harvestEval({
      portfolioId: metadata.portfolioId,
      filters: filters
        ? {
            minPAndL: filters.minPAndL,
            exludeAssetSymbols: filters.excludeAssetSymbols,
            purchaseDateBefore: filters.purchaseDateBefore,
            purchaseDateAfter: filters.purchaseDateAfter,
          }
        : undefined,
    })
  }
}
