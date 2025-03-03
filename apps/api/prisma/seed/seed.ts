/* eslint-disable no-console */
import { execSync } from "node:child_process";

// eslint-disable-next-line @typescript-eslint/require-await
async function main() {
  console.log("🧩 Seeding customer schemas...");
  execSync("tsx prisma/seed/seed.schema.ts", { stdio: "inherit" });

  console.log("🔄 Syncing customer schemas and roles...");
  execSync("pnpm run sync", { stdio: "inherit" });

  console.log("📦 Seeding configuration...");
  execSync("pnpm run seed:configuration", { stdio: "inherit" });

  console.log("🚀 Completed!");
}

// eslint-disable-next-line @typescript-eslint/use-unknown-in-catch-callback-variable
main().catch(error => {
  console.error("❌ Seed failed:", error);
  // eslint-disable-next-line unicorn/no-process-exit
  process.exit(1);
});
