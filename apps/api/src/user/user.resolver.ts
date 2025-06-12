import type { GraphQLResolveInfo } from 'graphql'
import type { ClerkClaims } from '../auth/types'
import { Args, Info, Mutation, Query, Resolver } from '@nestjs/graphql'
import { Prisma } from '@prisma/client'
import { ClerkService } from '~/clerk/clerk.service'
import { PrismaService } from '~/prisma/prisma.service'
import { ClerkContext } from '../auth/decorators/clerk-context.decorator'
import { User, UserUpdateInput } from '../generated/graphql'
import { PrismaSelect } from '../utilities/prisma/prisma-select'
import { UserService } from './user.service'

@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly clerkService: ClerkService,
    private readonly prismaService: PrismaService,
  ) { }

  @Query(() => User, {
    description: 'Get current user',
    name: 'userCurrent',
  })
  async user(
    @ClerkContext()
    clerkContext: ClerkClaims,
  ): Promise<User> { // only ever return top level fields as exposing more is security risk
    return this.userService.asserUserExists(
      clerkContext.sub,
      undefined,
    )
  }

  @Mutation(() => Boolean, {
    description: 'Invite User to Platform',
    name: 'inviteUsersToPlatform',
  })
  async inviteUsersToPlatform(
    @Args('emails', { type: () => [String] })
    emails: string[],
  ): Promise<boolean> {
    await this.clerkService.inviteUserToPlatform(emails)
    return true
  }

  @Mutation(() => Boolean, {
    description: 'Add User to Portfolio. True if user added, False if user is invited as they do not exist',
    name: 'addUserToPortfolio',
  })
  async addUserToPortfolio(
    @Args('email', { type: () => String })
    email: string,
    @ClerkContext()
    clerkContext: ClerkClaims,
  ): Promise<boolean> {
    try {
      const user = await this.userService.findOneByEmail(email)
      await this.prismaService
        .$extends(PrismaService.forPortfolio(clerkContext.metadata.portfolioId))
        .usersOnPortfolios
        .create({
          data: {
            userId: user.id,
            portfolioId: clerkContext.metadata.portfolioId,
            role: 'ADMIN',
          },
        })
      return true
    }
    catch {
      await this.clerkService.inviteUserToPlatform([email])
      return false
    }
  }

  @Mutation(() => Boolean, {
    description: 'Remove User from Portfolio',
    name: 'removeUserFromPortfolio',
  })
  async removeUserFromPortfolio(
    @Args('userId', { type: () => String })
    userId: string,
    @ClerkContext()
    clerkContext: ClerkClaims,
  ): Promise<boolean> {
    await this.prismaService
      .$extends(PrismaService.forPortfolio(clerkContext.metadata.portfolioId))
      .usersOnPortfolios
      .delete({
        where: {
          userId_portfolioId: {
            userId,
            portfolioId: clerkContext.metadata.portfolioId,
          },
        },
      })

    return true
  }

  @Query(() => [User], {
    description: 'Get all users on a portfolio',
    name: 'usersOnPortfolio',
  })
  async usersOnPortfolio(
    @Info()
    info: GraphQLResolveInfo,
    @ClerkContext()
    clerkContext: ClerkClaims,
  ): Promise<User[]> {
    const { select } = new PrismaSelect<Prisma.UserSelect>(info).value
    return this.prismaService
      .$extends(PrismaService.forPortfolio(clerkContext.metadata.portfolioId))
      .user
      .findMany({
        where: {
          UsersOnPortfolios: {
            some: {
              portfolioId: clerkContext.metadata.portfolioId,
            },
          },
        },
        select,
      })
  }

  @Mutation(() => User, {
    description: 'Update User',
    name: 'updateUser',
  })
  async updateUser(
    @ClerkContext()
    currentUser: ClerkClaims,
    @Info()
    info: GraphQLResolveInfo,
    @Args('data', { type: () => UserUpdateInput })
    data: Prisma.UserUpdateInput,
  ): Promise<User> {
    const { select } = new PrismaSelect<Prisma.UserSelect>(info).value

    return await this.userService.updateUser({
      data,
      select,
      where: {
        id: currentUser.sub,
      },
    })
  }

  @Mutation(() => User, {
    description: 'Update User Favorites',
    name: 'updateUserFavorites',
  })
  async updateUserFavorites(
    @ClerkContext()
    currentUser: ClerkClaims,
    @Info()
    info: GraphQLResolveInfo,
    @Args('data', { type: () => UserUpdateInput })
    data: Prisma.UserUpdateInput,
  ): Promise<User> {
    const { select } = new PrismaSelect<Prisma.UserSelect>(info).value
    // this.userService.user({
    //   select,
    //   where:{
    //     id: currentUser.sub
    //   },
    //   data: {

    //   }
    // })
    return await this.userService.updateUserFavorites({
      data,
      select,
      where: {
        id: currentUser.sub,
      },
    }, currentUser.metadata.portfolioId)
  }

  @Query(() => User, {
    description: 'Find one user by email',
    name: 'findOneUserByEmail',
  })
  async findOneUserByEmail(
    @Args('email', {
      type: () => String,
    })
    email: string,
  ): Promise<User> {
    return this.userService.findOneByEmail(email)
  }

  @Query(() => User, {
    description: 'Get a user',
    name: 'getUserPublic',
  })
  async getUserPublic(
    @Args('id', {
      nullable: false,
      type: () => String,
    })
    id: string,
  ): Promise<User> {
    return this.userService.findOneById(id)
  }

  @Mutation(() => User, {
    description: 'Update a user',
    name: 'updateUserById',
  })
  async updateUserById(
    @ClerkContext()
    clerkContext: ClerkClaims,
    @Args('updateUserInput', { type: () => UserUpdateInput })
    updateUserInput: Prisma.UserUpdateInput,
  ): Promise<User> {
    return this.userService.update({
      data: updateUserInput,
      where: {
        id: clerkContext.sub,
      },
    })
  }
}
