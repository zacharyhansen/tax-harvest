# Merge Errors Admin Panel Implementation Plan

## Overview
Implement NestJS CRUD modules for MultiChangeSet and MultiChangeSetOption models with a new admin panel UI section for viewing and managing merge errors.

## Current State Analysis
- MultiChangeSet and MultiChangeSetOption models exist in Prisma schema
- GraphQL types are auto-generated but no resolvers exist
- No API endpoints for these models
- No UI for viewing or managing these records
- Admin panel infrastructure exists with consistent patterns

### Key Discoveries:
- NestJS modules follow a three-file pattern: module, service, resolver at `apps/api/src/`
- Portfolio-based RLS is enforced via PrismaService extensions
- Admin pages use AG Grid for data tables at `apps/web/app/main/admin/`
- Navigation defined in `apps/web/app/main/nav-tree.tsx`
- Routes defined in `apps/web/lib/routes.ts`

## Desired End State
A fully functional admin interface where administrators can:
- View all MultiChangeSet records with filtering and sorting
- Drill down to see MultiChangeSetOption details
- Mark change sets as resolved
- Track merge errors and lot changes across the system

## What We're NOT Doing
- Modifying the existing lot calculation logic
- Creating automated error resolution
- Building batch processing interfaces
- Changing the core merge/transaction processing

## Implementation Approach
Build backend-first, starting with NestJS modules, then GraphQL integration, followed by admin UI implementation using existing patterns.

---

## Phase 1: NestJS Backend Module Implementation

### Overview
Create the backend infrastructure for MultiChangeSet and MultiChangeSetOption CRUD operations with proper authentication and RLS.

### Changes Required:

#### 1. MultiChangeSet Module
**Files to create**:
- `apps/api/src/multi-change-set/multi-change-set.module.ts`
- `apps/api/src/multi-change-set/multi-change-set.service.ts`
- `apps/api/src/multi-change-set/multi-change-set.resolver.ts`

**Implementation details**:
- Module exports service, imports PrismaModule
- Service implements CRUD with portfolio-based RLS using `PrismaService.forPortfolio(portfolioId)`
- Resolver implements queries (findMany, findOne) and mutations (create, update, delete)
- Add field resolvers for relationships (account, portfolio, asset)

#### 2. MultiChangeSetOption Module
**Files to create**:
- `apps/api/src/multi-change-set-option/multi-change-set-option.module.ts`
- `apps/api/src/multi-change-set-option/multi-change-set-option.service.ts`
- `apps/api/src/multi-change-set-option/multi-change-set-option.resolver.ts`

**Implementation details**:
- Similar structure to MultiChangeSet module
- Add relationship resolver for lot
- Include filtering by multiChangeSetId

#### 3. App Module Registration
**File to modify**: `apps/api/src/app.module.ts`
- Import and add both modules to imports array

### Success Criteria:

#### Automated Verification:
- [ ] API builds successfully: `pnpm build:api`
- [ ] GraphQL schema generates: Check `apps/api/schema.graphql` includes new types
- [ ] Type checking passes: `pnpm typecheck`
- [ ] GraphQL queries/mutations appear in GraphQL playground

#### Manual Verification:
- [ ] Can query MultiChangeSet records via GraphQL
- [ ] Can create/update/delete records via mutations
- [ ] Portfolio-based RLS properly filters data
- [ ] Relationships resolve correctly

---

## Phase 2: Frontend Route and Navigation Setup

### Overview
Set up the routing infrastructure and navigation items for the new admin panel section.

### Changes Required:

#### 1. Route Definition
**File to modify**: `apps/web/lib/routes.ts`
```typescript
// Add new routes:
mergeErrors: () => `/main/admin/merge-errors`,
mergeErrorDetail: (id: string) => `/main/admin/merge-errors/${id}`,
```

#### 2. Navigation Item
**File to modify**: `apps/web/app/main/nav-tree.tsx`
```typescript
// Add to admin group:
{
  title: 'Merge Errors',
  url: TypedRoutes.mergeErrors(),
  icon: AlertTriangle, // or appropriate icon
  roles: ['admin']
}
```

#### 3. Directory Structure
**Directories to create**:
- `apps/web/app/main/admin/merge-errors/`
- `apps/web/app/main/admin/merge-errors/[id]/`

### Success Criteria:

#### Automated Verification:
- [ ] Frontend builds: `pnpm build:web`
- [ ] Type checking passes: `pnpm typecheck`
- [ ] No linting errors: `pnpm lint`

#### Manual Verification:
- [ ] Navigation item appears in admin menu
- [ ] Routes are accessible (return 404 for now)
- [ ] Role restriction works (non-admins don't see menu item)

---

## Phase 3: List View Implementation

### Overview
Create the main list view page for MultiChangeSet records with filtering and data table.

### Changes Required:

#### 1. GraphQL Fragments
**File to create**: `apps/web/graphql/fragments/multi-change-set.fragment.graphql`
```graphql
fragment MultiChangeSetTableItem on MultiChangeSet {
  id
  accountId
  portfolioId
  assetSymbol
  targetValue
  targetQuantity
  resolved
  createdAt
  updatedAt
  account {
    name
  }
  asset {
    name
    symbol
  }
}
```

#### 2. List Page Component
**File to create**: `apps/web/app/main/admin/merge-errors/page.tsx`
- Implement with AG Grid following pattern from `admin/users/page.tsx`
- Add filtering for resolved/unresolved
- Include column definitions for key fields
- Implement row click navigation to detail view
- Add refresh button in header

#### 3. GraphQL Query
**File to create**: `apps/web/graphql/queries/multi-change-sets.query.graphql`
```graphql
query MultiChangeSets($where: MultiChangeSetWhereInput) {
  multiChangeSets(where: $where) {
    ...MultiChangeSetTableItem
  }
}
```

### Success Criteria:

#### Automated Verification:
- [ ] GraphQL codegen runs successfully: `pnpm codegen`
- [ ] Frontend builds: `pnpm build:web`
- [ ] Type checking passes: `pnpm typecheck`

#### Manual Verification:
- [ ] Page loads with data table
- [ ] Filtering works (resolved/unresolved)
- [ ] Sorting works on columns
- [ ] Click navigation to detail pages
- [ ] Loading and error states display correctly

---

## Phase 4: Detail View Implementation

### Overview
Create the detail view for individual MultiChangeSet records with related options display.

### Changes Required:

#### 1. Detail Fragment
**File to create**: `apps/web/graphql/fragments/multi-change-set-detail.fragment.graphql`
```graphql
fragment MultiChangeSetDetail on MultiChangeSet {
  ...MultiChangeSetTableItem
  lotsData
  portfolio {
    id
    name
  }
  # Include options relationship when available
}
```

#### 2. Options Fragment
**File to create**: `apps/web/graphql/fragments/multi-change-set-option.fragment.graphql`
```graphql
fragment MultiChangeSetOptionItem on MultiChangeSetOption {
  id
  lotId
  acquiredDate
  quantityFinal
  quantityChange
  isNewBuy
  price
  lot {
    id
    assetSymbol
    remainingQty
  }
}
```

#### 3. Detail Page Component
**File to create**: `apps/web/app/main/admin/merge-errors/[id]/page.tsx`
- Display MultiChangeSet details in card layout
- Show related MultiChangeSetOptions in tabs or data table
- Include JSON viewer for lotsData field
- Add action buttons for marking as resolved

#### 4. Queries
**Files to create**:
- `apps/web/graphql/queries/multi-change-set.query.graphql` (single record)
- `apps/web/graphql/queries/multi-change-set-options.query.graphql` (options by setId)

### Success Criteria:

#### Automated Verification:
- [ ] GraphQL codegen successful
- [ ] Frontend builds without errors
- [ ] Type checking passes

#### Manual Verification:
- [ ] Detail page displays all fields
- [ ] Related options load correctly
- [ ] JSON data displays in viewer
- [ ] Navigation back to list works
- [ ] Action buttons functional

---

## Phase 5: Management Actions

### Overview
Implement mutations for managing MultiChangeSet records (mark resolved, delete, etc.).

### Changes Required:

#### 1. GraphQL Mutations
**File to create**: `apps/web/graphql/mutations/multi-change-set.mutation.graphql`
```graphql
mutation UpdateMultiChangeSet($id: ID!, $data: MultiChangeSetUpdateInput!) {
  updateMultiChangeSet(where: { id: $id }, data: $data) {
    ...MultiChangeSetDetail
  }
}

mutation DeleteMultiChangeSet($id: ID!) {
  deleteMultiChangeSet(where: { id: $id }) {
    id
  }
}
```

#### 2. Action Implementation
**Files to modify**:
- `apps/web/app/main/admin/merge-errors/[id]/page.tsx`
  - Add resolve/unresolve button with mutation
  - Add delete button with confirmation
  - Implement toast notifications for actions

#### 3. List Page Actions
**File to modify**: `apps/web/app/main/admin/merge-errors/page.tsx`
- Add bulk actions toolbar
- Implement multi-select for batch operations

### Success Criteria:

#### Automated Verification:
- [ ] Mutations generate in GraphQL schema
- [ ] Frontend builds successfully
- [ ] No TypeScript errors

#### Manual Verification:
- [ ] Can mark items as resolved/unresolved
- [ ] Delete confirmation works
- [ ] Toast notifications appear
- [ ] List refreshes after mutations
- [ ] Optimistic updates work correctly

---

## Testing Strategy

### Unit Tests:
- Test service methods for correct RLS application
- Test resolver authentication checks
- Test data transformation logic

### Integration Tests:
- Test full GraphQL query/mutation flow
- Test portfolio isolation
- Test role-based access control

### Manual Testing Steps:
1. Login as admin user
2. Navigate to Merge Errors in admin panel
3. Verify list loads with data
4. Test filtering by resolved status
5. Click through to detail view
6. Verify all data displays correctly
7. Test resolve/unresolve actions
8. Test delete with confirmation
9. Verify non-admin users cannot access

## Performance Considerations
- Implement pagination if record counts exceed 1000
- Consider caching for frequently accessed data
- Optimize GraphQL queries with proper field selection
- Index database queries on commonly filtered fields

## Migration Notes
- No data migration required (new feature)
- Ensure GraphQL schema regeneration after backend changes
- Run codegen after adding GraphQL operations

## References
- Original requirements: `/specs/merge-errors-admin/requirements.md`
- Similar implementation: Account module at `apps/api/src/account/`
- Admin UI pattern: Users page at `apps/web/app/main/admin/users/page.tsx`
- Prisma schema: `apps/api/prisma/schema.prisma:796-834`