import { AccountInstitution } from "@prisma/client";
import { createSeedClient } from "@snaplet/seed";

async function main() {
  const seed = await createSeedClient();

  // Truncate all tables in the database
  await seed.$resetDatabase();

  await seed.User(x =>
    x(1, {
      stripeCustomerId: "stripe_f88f8aa8-5c17-4415-951e-72a6758118c1",
      email: "zachary.r.hansen@gmail.com",
      id: "user_2jFwy6JTTb43hqvtE5pxG2aywe7",
      name: "Zachary Hansen",
      photo:
        "https://lh3.googleusercontent.com/a/ACg8ocKkQ_UhQ-afU0EuZArKmLDPHgQemd5oxloLB1xvpwK_=s96-c",
      AuthConnection: () => [
        {
          source: "LOCAL",
          type: "OAUTH_1",
          userId: "f88f8aa8-5c17-4415-951e-72a6758118c1",
          externalId: crypto.randomUUID(),
          Portfolio: {
            name: "Zachary Hansen's Portfolio",
            id: "f88f8aa8-5c17-4415-951e-72a6758118c2",
            // createdById: "f88f8aa8-5c17-4415-951e-72a6758118c1",
            UsersOnPortfolios: () => [
              {
                role: "ADMIN",
                userId: "user_2jFwy6JTTb43hqvtE5pxG2aywe7",
                portfolioId: "f88f8aa8-5c17-4415-951e-72a6758118c2",
              },
            ],
            Account: x =>
              x(3, () => ({
                type: "Individual",
                // createdById: "f88f8aa8-5c17-4415-951e-72a6758118c1",
                // portfolioId: "f88f8aa8-5c17-4415-951e-72a6758118c2",
              })),
          },
        },
        // {
        //   source: "LOCAL",
        //   type: "OAUTH_1",
        //   externalId: crypto.randomUUID(),
        //   Portfolio: () => ({
        //     name: "Another Portfolio",
        //     // UsersOnPortfolios: () => [
        //     //   {
        //     //     role: "ADMIN",
        //     //   },
        //     // ],
        //     Account: () => [
        //       {
        //         displayName: "Charles Schwab 2",
        //         type: "Individual",
        //         institution: AccountInstitution.BROKERAGE,
        //       },
        //       {
        //         displayName: "Wells Fargo 2",
        //         type: "Individual",
        //         institution: AccountInstitution.BROKERAGE,
        //       },
        //       {
        //         displayName: "Etrade 2",
        //         type: "Individual",
        //         institution: AccountInstitution.BROKERAGE,
        //       },
        //     ],
        //   }),
        // },
      ],
    }),
  );
}

main()
  .then(() => {
    // eslint-disable-next-line unicorn/no-process-exit
    process.exit(0);
  })
  .catch((error: unknown) => {
    // eslint-disable-next-line no-console
    console.error(error);
    // eslint-disable-next-line unicorn/no-process-exit
    process.exit(1);
  });
