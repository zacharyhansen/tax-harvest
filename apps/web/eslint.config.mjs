import antfu from '@antfu/eslint-config'
import graphqlPlugin from '@graphql-eslint/eslint-plugin'
import nextPlugin from '@next/eslint-plugin-next'
import jestDom from 'eslint-plugin-jest-dom'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import playwright from 'eslint-plugin-playwright'
import tailwind from 'eslint-plugin-tailwindcss'
import testingLibrary from 'eslint-plugin-testing-library'

export default antfu(
  {
    react: true,
    typescript: true,
    graphql: true,
    formatters: {
      css: true,
      html: true,
      markdown: 'prettier',
    },
    ignores: ['generated/**/*', 'next-env.d.ts'],
  },
  ...tailwind.configs['flat/recommended'],
  jsxA11y.flatConfigs.recommended,
  {
    // Setup GraphQL Parser
    files: ['**/*.{graphql,gql}'],
    languageOptions: {
      parser: graphqlPlugin.parser,
    },
    plugins: {
      '@graphql-eslint': graphqlPlugin,
    },
    rules: {
      'style/spaced-comment': 'off',
    },
  },
  {
    // Setup recommended config for operations files
    files: ['**/*.{graphql,gql}'],
    rules: graphqlPlugin.configs['flat/operations-recommended'].rules,
  },
  {
    plugins: {
      '@next/next': nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
    },
  },
  {
    files: ['**/*.test.ts?(x)'],
    ...testingLibrary.configs['flat/react'],
    ...jestDom.configs['flat/recommended'],
  },
  {
    files: ['**/*.spec.ts', '**/*.e2e.ts'],
    ...playwright.configs['flat/recommended'],
  },
  {
    rules: {
      'no-console': [
        'error',
        { allow: ['info', 'warn', 'error', 'time', 'timeEnd'] },
      ],
      'react/no-context-provider': 'off', // breaks with current react/nextjs verisons
      'antfu/no-top-level-await': 'off', // Allow top-level await
      'style/brace-style': ['error', '1tbs'], // Use the default brace style
      'ts/consistent-type-definitions': ['error', 'interface'], // Use `type` instead of `interface`
      'react/prefer-destructuring-assignment': 'off', // Vscode doesn't support automatically destructuring, it's a pain to add a new variable
      'node/prefer-global/process': ['error', 'always'],
      'test/padding-around-all': 'error', // Add padding in test files
      'test/prefer-lowercase-title': 'off', // Allow using uppercase titles in test titles
      'ts/no-explicit-any': 'error',
    },
  },
)
