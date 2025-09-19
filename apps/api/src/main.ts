import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import {
	FastifyAdapter,
	type NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from '~/app';

async function bootstrap() {
	const logger = new Logger('EntryPoint');

	const app = await NestFactory.create<NestFastifyApplication>(
		AppModule,
		new FastifyAdapter(),
		{
			rawBody: true,
		},
		// {
		//   snapshot: true,
		//   abortOnError: false,
		// },
	);

	// Set global prefix but exclude health endpoint cause kubernetes is breaking my balls
	// think the GNEG only checks /health and i dont know how to change it
	app.setGlobalPrefix('core', {
		exclude: ['/health'],
	});

	const configService = app.get(ConfigService);
	const port = configService.get('PORT');
	app.enableCors({
		credentials: true,
		origin: [
			// biome-ignore lint/style/noNonNullAssertion: <ok>
			process.env.CLIENT_ORIGIN!,
			'https://sandbox.embed.apollographql.com',
		],
	});
	const config = new DocumentBuilder()
		.setTitle('Tracker')
		.setDescription('Api Docs')
		.setVersion('1.0')
		.build();

	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('docs', app, document);

	await app.listen(port, '0.0.0.0');
	logger.log(`App is ready and listening on port ${port} 🚀`);
}

bootstrap().catch((err) => {
	console.error(err);
	process.exit(1);
});
