## UI Components
- UI components can be imported form '@repo/ui/...'
- Frontend - we should only use tailwind  & primarily colors from @packages/ui/src/shadcn-theme.css 

## Code Quality
- When modifying functions or components - ensure you are adding JSDOC descriptions and examples

## GraphQL
- Gql schema changes should auto update when files are saved.
- apps/api should be tested using `npx vitest <file>
- use `pnpm --filter <app> check:types` for type checking