import { NestFactory } from '@nestjs/core';

import { AppModule } from '../app';

async function bootstrap() {
	const app = await NestFactory.createApplicationContext(AppModule);

	await app.close();
}

bootstrap().catch((error: unknown) => {
	console.error('Migration failed:', error);
	process.exit(1);
});

export { bootstrap as syncViews };
