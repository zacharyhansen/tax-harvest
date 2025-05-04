import { Injectable, Logger } from '@nestjs/common'
import { Prisma } from '@prisma/client'

import { ClerkService } from '../clerk/clerk.service'
import { Database } from '../database/database'
import { PlaidService } from '../plaid/plaid.service'
import { PrismaService } from '../prisma/prisma.service'
import { StripeService } from '../stripe/stripe.service'

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name)
  constructor(
    private readonly db: Database,
    private readonly prismaService: PrismaService,
    private readonly stripeService: StripeService,
    private readonly clerkService: ClerkService,
    private readonly plaidService: PlaidService,
  ) {}

  async user(args: Prisma.UserFindUniqueOrThrowArgs) {
    return this.prismaService.user.findUniqueOrThrow(args)
  }

  /**
   * Important method that serves as the creation / entry point for users added to our app
   * @param id Clerk User Id that we will use as primary key
   * @param select
   * @returns User
   */
  asserUserExists(
    id: string,
    select?: Prisma.UserSelect,
    input?: Omit<Prisma.UserCreateInput, 'stripeCustomerId'>,
  ) {
    return this.prismaService.user
      .findUniqueOrThrow({
        select,
        where: {
          id,
        },
      })
      .catch(async () => {
        const clerkUser = await this.clerkService.user(id)
        // Create user in stripe and plaid so we can add the ids
        const [stripeUser, plaidUser] = await Promise.all([
          this.stripeService.createCustomer({
            params: {
              email:
                clerkUser.primaryEmailAddress?.emailAddress
                ?? input?.email
                ?? undefined,
              metadata: {
                clerk_id: clerkUser.id,
              },
              name: clerkUser.fullName ?? input?.name ?? undefined,
              phone:
                clerkUser.primaryPhoneNumber?.phoneNumber
                ?? input?.phoneNumber
                ?? undefined,
            },
          }),
          this.plaidService.plaidCreateUser({ userId: clerkUser.id }),
        ])

        return this.prismaService.user.create({
          data: {
            ...input,
            id,
            plaidCustomerId: plaidUser.data.user_id,
            plaidUserToken: plaidUser.data.user_token,
            stripeCustomerId: stripeUser.id,
          },
          select,
        })
      })
  }

  async upsertUserById(input: Prisma.UserCreateInput) {
    return this.prismaService.user.upsert({
      create: input,
      update: input,
      where: {
        id: input.id,
      },
    })
  }

  async updateUser(args: Prisma.UserUpdateArgs) {
    return this.prismaService.user.update(args)
  }

  async updateUserFavorites(args: Prisma.UserUpdateArgs) {
    return this.prismaService.user.update(args)
  }

  async findOneById(id: string) {
    return this.db
      .selectFrom('User')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirstOrThrow()
  }

  async findOneByEmail(email: string) {
    return this.db
      .selectFrom('User')
      .selectAll()
      .where('email', '=', email)
      .executeTakeFirstOrThrow()
  }

  async update(args: Prisma.UserUpdateArgs) {
    return this.prismaService.user.update({
      ...args,
    })
  }
}
