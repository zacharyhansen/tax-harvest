import antfu from '@antfu/eslint-config'

export default antfu({
  ignores: [
    'dist/',
    'node_modules/',
    'coverage/',
    '@generated/',
    'src/generated/',
    'src/database/db.d.ts',
  ],
}, {
  rules: {
    '@typescript-eslint/consistent-type-imports': 'off',
    'node/prefer-global/process': ['error', 'always'],
    'no-console': ['error', { allow: ['info', 'warn', 'error', 'time', 'timeEnd'] }],
    'ts/no-explicit-any': 'error',
  },
})
