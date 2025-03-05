import { NestFactory } from "@nestjs/core";

import { AppModule } from "../app";

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  await app.close();
}

bootstrap().catch((error: unknown) => {
  console.error("Migration failed:", error);
  // eslint-disable-next-line unicorn/no-process-exit
  process.exit(1);
});

export { bootstrap as syncViews };
