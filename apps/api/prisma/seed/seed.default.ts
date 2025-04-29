/* eslint-disable no-console */
import { readFileSync } from "node:fs";

import { AccountInstitution } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import { createSeedClient } from "@snaplet/seed";

import { taxAdvantadedSubTypes } from "~/plaid/plaid.utils";

import { exampleLots } from "./utils";

const prisma = new PrismaClient();

async function runSqlFile(filePath: string) {
  // const filePath = path.join(__dirname, file);

  console.log("📂 Running SQL file:", filePath);

  const sql = readFileSync(filePath, "utf8"); // Read SQL file content

  // Run the SQL query using Prisma's $queryRaw
  // Run the SQL query using Prisma's $queryRawUnsafe
  try {
    await prisma.$queryRawUnsafe(sql); // Executes the query
    console.log("✅ SQL file executed successfully!");
  } catch (error) {
    console.error("❌ Error running SQL file:", error);
  }
}

async function main() {
  const seed = await createSeedClient();

  // Truncate all tables in the database
  await seed.$resetDatabase();
  await runSqlFile("prisma/seed/insert-assets.sql");

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
            Account: () => [
              {
                type: "investment",
                name: "Etrade Example",
                provider: "ETRADE",
                subType: "investment",
                institution: AccountInstitution.BROKERAGE,
                createdById: "user_2jFwy6JTTb43hqvtE5pxG2aywe7",
                portfolioId: "f88f8aa8-5c17-4415-951e-72a6758118c2",
                Lot: () => exampleLots,
                skipSetup: taxAdvantadedSubTypes.has("investment"),
              },
              {
                type: "investment",
                name: "Etrade Example Roth",
                provider: "ETRADE",
                subType: "roth",
                institution: AccountInstitution.BROKERAGE,
                createdById: "user_2jFwy6JTTb43hqvtE5pxG2aywe7",
                portfolioId: "f88f8aa8-5c17-4415-951e-72a6758118c2",
                Lot: () => exampleLots,
                skipSetup: taxAdvantadedSubTypes.has("roth"),
              },
            ],
          },
        },
      ],
    }),
  );
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((error: unknown) => {
    // eslint-disable-next-line no-console
    console.error(error);
    process.exit(1);
  });
