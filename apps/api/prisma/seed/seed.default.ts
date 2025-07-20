import { readFileSync } from 'node:fs'
import { AccountInstitution, PrismaClient } from '@prisma/client'
import { copycat } from '@snaplet/copycat'
import { createSeedClient, PortfolioRoleEnum } from '@snaplet/seed'
import { taxAdvantadedSubTypes } from '~/plaid/plaid.utils'
import { allGainLots } from './examples/allgain'
import { allLossLots } from './examples/allloss'
import { exampleLots } from './examples/basic'

const prisma = new PrismaClient()

async function runSqlFile(filePath: string) {
  // const filePath = path.join(__dirname, file);

  console.info('📂 Running SQL file:', filePath)

  const sql = readFileSync(filePath, 'utf8') // Read SQL file content

  // Run the SQL query using Prisma's $queryRaw
  // Run the SQL query using Prisma's $queryRawUnsafe
  try {
    await prisma.$queryRawUnsafe(sql) // Executes the query
    console.info('✅ SQL file executed successfully')
  }
  catch (error) {
    console.error('❌ Error running SQL file:', error)
  }
}

const mainUserId = 'user_2jFwy6JTTb43hqvtE5pxG2aywe7'

async function main() {
  const seed = await createSeedClient()

  // Truncate all tables in the database
  await seed.$resetDatabase()

  await runSqlFile('prisma/seed/insert-assets.sql')

  const { User: additionalUsers } = await seed.User(() => [
    {
      email: 'tbolus17@gmail.com',
      id: 'user_2jc3EFHNwXHroVMzzuOemks0X0z',
      name: '(seed) Troy Bolus',
    },
  ])

  await seed.Asset(() => [
    {
      symbol: 'UNKNOWN',
      active: true,
    },
  ])

  const UsersOnPortfolios = additionalUsers.map(user => ({
    userId: user.id,
    role: 'ADMIN' as PortfolioRoleEnum,
  })).concat([{
    role: 'ADMIN' as PortfolioRoleEnum,
    userId: mainUserId,
  }],
  )

  const { User, Portfolio } = await seed.User(() => [
    {
      email: 'zachary.r.hansen@gmail.com',
      id: mainUserId,
      name: '(seed) Zachary Hansen',
      AuthConnection: () => [
        {
          source: 'LOCAL',
          type: 'OAUTH_1',
          externalId: context => copycat.uuid(context.seed),
          Portfolio: {
            name: 'Roth Example',
            id: context => copycat.uuid(context.seed),
            createdById: mainUserId,
            UsersOnPortfolios: () => UsersOnPortfolios,
            Account: () => [
              {
                type: 'investment',
                name: 'Etrade Example',
                provider: 'ETRADE',
                subType: 'investment',
                institution: AccountInstitution.BROKERAGE,
                createdById: mainUserId,
                Lot: () => exampleLots,
                skipSetup: taxAdvantadedSubTypes.has('investment'),
              },
              {
                type: 'investment',
                name: 'Etrade Example Roth',
                provider: 'ETRADE',
                subType: 'roth',
                institution: AccountInstitution.BROKERAGE,
                createdById: mainUserId,
                Lot: () => exampleLots,
                skipSetup: taxAdvantadedSubTypes.has('roth'),
              },
            ],
          },
        },
        {
          source: 'LOCAL',
          type: 'OAUTH_1',
          externalId: context => copycat.uuid(context.seed),
          Portfolio: {
            name: 'Realized Loss Example',
            id: context => copycat.uuid(context.seed),
            createdById: mainUserId,
            UsersOnPortfolios: () => UsersOnPortfolios,
            Account: () => [
              {
                type: 'investment',
                name: 'Etrade Example',
                provider: 'ETRADE',
                subType: 'investment',
                institution: AccountInstitution.BROKERAGE,
                createdById: mainUserId,
                Lot: () => exampleLots,
                skipSetup: true,
                RealizedPAndL: () => [
                  {
                    shortTerm: -3000,
                    year: new Date().getFullYear(),
                  },
                ],
              },
            ],
          },
        },
        {
          source: 'LOCAL',
          type: 'OAUTH_1',
          externalId: context => copycat.uuid(context.seed),
          Portfolio: {
            name: 'Realized Gain Example',
            id: context => copycat.uuid(context.seed),
            createdById: mainUserId,
            UsersOnPortfolios: () => UsersOnPortfolios,
            Account: () => [
              {
                type: 'investment',
                name: 'Etrade Example',
                provider: 'ETRADE',
                subType: 'investment',
                institution: AccountInstitution.BROKERAGE,
                createdById: mainUserId,
                Lot: () => exampleLots,
                skipSetup: true,
                RealizedPAndL: () => [
                  {
                    shortTerm: 10000,
                    year: new Date().getFullYear(),
                  },
                ],
              },
            ],
          },
        },
        {
          source: 'LOCAL',
          type: 'OAUTH_1',
          externalId: context => copycat.uuid(context.seed),
          Portfolio: {
            name: 'Neutral Loss Limiter Example',
            id: context => copycat.uuid(context.seed),
            createdById: mainUserId,
            UsersOnPortfolios: () => UsersOnPortfolios,
            Account: () => [
              {
                type: 'investment',
                name: 'Etrade Example',
                provider: 'ETRADE',
                subType: 'investment',
                institution: AccountInstitution.BROKERAGE,
                createdById: mainUserId,
                // portfolioId: 'f88f8aa8-5c17-4415-951e-72a6758118c2',
                Lot: () => exampleLots,
                skipSetup: true,
                RealizedPAndL: () => [
                  {
                    shortTerm: 300,
                    year: new Date().getFullYear(),
                  },
                ],
              },
            ],
          },
        },
        {
          source: 'LOCAL',
          type: 'OAUTH_1',
          externalId: context => copycat.uuid(context.seed),
          Portfolio: {
            name: 'Neutral Gain Limiter Example',
            id: context => copycat.uuid(context.seed),
            createdById: mainUserId,
            UsersOnPortfolios: () => UsersOnPortfolios,
            Account: () => [
              {
                type: 'investment',
                name: 'Etrade Example',
                provider: 'ETRADE',
                subType: 'investment',
                institution: AccountInstitution.BROKERAGE,
                createdById: mainUserId,
                // portfolioId: 'f88f8aa8-5c17-4415-951e-72a6758118c2',
                Lot: () => exampleLots.map(lot => ({
                  ...lot,
                  price: lot.price * 1.8,
                })),
                skipSetup: true,
                RealizedPAndL: () => [
                  {
                    shortTerm: 300,
                    year: new Date().getFullYear(),
                  },
                ],
              },
            ],
          },
        },
        {
          source: 'LOCAL',
          type: 'OAUTH_1',
          externalId: context => copycat.uuid(context.seed),
          Portfolio: {
            name: 'All Gain Example',
            id: context => copycat.uuid(context.seed),
            createdById: mainUserId,
            UsersOnPortfolios: () => UsersOnPortfolios,
            Account: () => [
              {
                type: 'investment',
                name: 'Etrade Example',
                provider: 'ETRADE',
                subType: 'investment',
                institution: AccountInstitution.BROKERAGE,
                createdById: mainUserId,
                // portfolioId: 'f88f8aa8-5c17-4415-951e-72a6758118c2',
                Lot: () => allGainLots,
                skipSetup: true,
                RealizedPAndL: () => [
                  {
                    shortTerm: 300,
                    year: new Date().getFullYear(),
                  },
                ],
              },
            ],
          },
        },
        {
          source: 'LOCAL',
          type: 'OAUTH_1',
          externalId: context => copycat.uuid(context.seed),
          Portfolio: {
            name: 'All Loss Example',
            id: context => copycat.uuid(context.seed),
            createdById: mainUserId,
            UsersOnPortfolios: () => UsersOnPortfolios,
            Account: () => [
              {
                type: 'investment',
                name: 'Etrade Example',
                provider: 'ETRADE',
                subType: 'investment',
                institution: AccountInstitution.BROKERAGE,
                createdById: mainUserId,
                // portfolioId: 'f88f8aa8-5c17-4415-951e-72a6758118c2',
                Lot: () => allLossLots,
                skipSetup: true,
                RealizedPAndL: () => [
                  {
                    shortTerm: -300,
                    year: new Date().getFullYear(),
                  },
                ],
              },
            ],
          },
        },
      ],
    },
  ])

  const usersToAddToPortfolios = User.filter(user => user.id !== mainUserId)

  await seed.UsersOnPortfolios(
    Portfolio.flatMap((portfolio) => {
      return usersToAddToPortfolios.map((user) => {
        return {
          userId: user.id,
          portfolioId: portfolio.id,
          role: 'ADMIN',
        }
      })
    }),
  )

  // await seed.User(x =>
  //   x(1, {
  //     stripeCustomerId: 'stripe_f88f8aa8-5c17-4415-951e-72a6758118c1',
  //     email: 'zachary.r.hansen@gmail.com',
  //     id: 'user_2jFwy6JTTb43hqvtE5pxG2aywe7',
  //     name: 'Zachary Hansen',
  //     photo:
  //       'https://lh3.googleusercontent.com/a/ACg8ocKkQ_UhQ-afU0EuZArKmLDPHgQemd5oxloLB1xvpwK_=s96-c',
  //     AuthConnection: () => [
  //       {
  //         source: 'LOCAL',
  //         type: 'OAUTH_1',
  //         userId: 'f88f8aa8-5c17-4415-951e-72a6758118c1',
  //         externalId: crypto.randomUUID(),
  //         Portfolio: {
  //           name: 'Zachary Hansen\'s Portfolio',
  //           id: 'f88f8aa8-5c17-4415-951e-72a6758118c2',
  //           // createdById: "f88f8aa8-5c17-4415-951e-72a6758118c1",
  //           UsersOnPortfolios: () => [
  //             {
  //               role: 'ADMIN',
  //               userId: 'user_2jFwy6JTTb43hqvtE5pxG2aywe7',
  //               portfolioId: 'f88f8aa8-5c17-4415-951e-72a6758118c2',
  //             },
  //           ],
  //           Account: () => [
  //             {
  //               type: 'investment',
  //               name: 'Etrade Example',
  //               provider: 'ETRADE',
  //               subType: 'investment',
  //               institution: AccountInstitution.BROKERAGE,
  //               createdById: 'user_2jFwy6JTTb43hqvtE5pxG2aywe7',
  //               portfolioId: 'f88f8aa8-5c17-4415-951e-72a6758118c2',
  //               Lot: () => exampleLots,
  //               skipSetup: taxAdvantadedSubTypes.has('investment'),
  //             },
  //             {
  //               type: 'investment',
  //               name: 'Etrade Example Roth',
  //               provider: 'ETRADE',
  //               subType: 'roth',
  //               institution: AccountInstitution.BROKERAGE,
  //               createdById: 'user_2jFwy6JTTb43hqvtE5pxG2aywe7',
  //               portfolioId: 'f88f8aa8-5c17-4415-951e-72a6758118c2',
  //               Lot: () => exampleLots,
  //               skipSetup: taxAdvantadedSubTypes.has('roth'),
  //             },
  //           ],
  //         },
  //       },
  //     ],
  //   }),
  // )
}

main()
  .then(() => {
    process.exit(0)
  })
  .catch((error: unknown) => {
    console.error(error)
    process.exit(1)
  })
