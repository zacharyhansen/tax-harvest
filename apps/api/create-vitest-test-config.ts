import { loadEnv } from 'vite';
import type { InlineConfig } from 'vitest';

export function createVitestTestConfig(testingType: string): InlineConfig {
	return {
		root: './',
		globals: true,
		isolate: false,
		passWithNoTests: true,
		include: [`tests/${testingType}/**/*.test.ts`, '**/*.spec.ts'],
		env: loadEnv('test', process.cwd(), ''),
		coverage: {
			provider: 'v8',
			reporter: ['text', 'json', 'html'],
			reportsDirectory: `coverage/${testingType}`,
			include: ['src/**/*.ts'],
			exclude: ['src/main.ts'],
		},
		alias: {
			'~': '/src',
		},
	};
}
