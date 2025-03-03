import { NestFactory } from "@nestjs/core";
import { schema } from "@prisma/client";

import { AppModule } from "../app";
import { ViewService } from "../view/view.service";

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const viewMetadataService = app.get(ViewService);

  try {
    await viewMetadataService.syncViews({
      environmentSchemas: Object.values(schema),
    });
    console.log("View metadata sync completed successfully 👍");
  } catch (error) {
    console.error("Error during view metadata sync:", error);
    throw error;
  } finally {
    await app.close();
  }
}

bootstrap().catch((error: unknown) => {
  console.error("Migration failed:", error);
  // eslint-disable-next-line unicorn/no-process-exit
  process.exit(1);
});

export { bootstrap as syncViews };
