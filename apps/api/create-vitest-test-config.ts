import type { InlineConfig } from 'vitest'
import { loadEnv } from 'vite'

export function createVitestTestConfig(testingType: string): InlineConfig {
  return {
    root: './',
    globals: true,
    isolate: false,
    passWithNoTests: true,
    include: [`tests/${testingType}/**/*.test.ts`, '**/*.spec.ts'],
    env: loadEnv('test', process.cwd(), ''),
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'json', 'html'],
      reportsDirectory: `coverage/${testingType}`,
      include: ['src/**/*.ts'],
      exclude: ['src/main.ts'],
    },
    alias: {
      '~': '/src',
    },
  }
}
