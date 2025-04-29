/* eslint-disable no-console */

import { execSync } from "node:child_process";

// eslint-disable-next-line @typescript-eslint/require-await
async function main() {
  console.log("🧩 Seeding...");

  execSync("tsx prisma/seed/seed.default.ts", { stdio: "inherit" });

  console.log("🚀 Completed!");
}

// eslint-disable-next-line @typescript-eslint/use-unknown-in-catch-callback-variable
main().catch(error => {
  console.error("❌ Seed failed:", error);
  process.exit(1);
});
