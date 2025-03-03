import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppRouterHost } from "nestjs-trpc";

import { AppModule } from "~/app";
import { EnvService } from "~/env/env.service";

async function bootstrap() {
  const logger = new Logger("EntryPoint");

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  // app.setGlobalPrefix("api");

  const envService = app.get(EnvService);
  const port = envService.get("PORT");

  app.enableCors({
    credentials: true,
    origin: [envService.get("CLIENT_ORIGIN")],
  });

  const config = new DocumentBuilder()
    .setTitle("Tracker")
    .setDescription("Api Docs")
    .setVersion("1.0")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, document);

  await app.listen(port, "0.0.0.0");
  const { appRouter } = app.get(AppRouterHost);
  logger.log(`App is ready and listening on port ${port} 🚀`);
}

bootstrap().catch(handleError);

function handleError(error: unknown) {
  // eslint-disable-next-line no-console
  console.error(error);
  // eslint-disable-next-line unicorn/no-process-exit
  process.exit(1);
}

process.on("uncaughtException", handleError);
