# Performance History Implementation Plan

## Overview

Create a new simplified performance-history module alongside the existing portfolio-snapshot module. This module leverages the append-only data model in RealizedPAndL and the new PositionSnapshot/Position structure, where the backend handles time slicing via createdAt timestamps.

## Current State Analysis

The existing portfolio-snapshot module (`apps/api/src/portfolio-snapshot/`) uses:
- Complex SQL aggregations with window functions and CTEs
- PortfolioBalanceSnapshot table for pre-aggregated data
- Heavy data transformation in the service layer
- Fake data injection for insufficient data points
- Complex DTO structures for account and position performance

### Key Discoveries:
- Current implementation in `apps/api/src/portfolio-snapshot/portfolio-snapshot.service.ts:105-128` uses complex SQL with window functions
- RealizedPAndL table (`apps/api/prisma/schema.prisma:340-383`) supports append-only historical tracking with createdAt
- NEW: PositionSnapshot table (`apps/api/prisma/schema.prisma:555-566`) acts as parent time-based entity
- NEW: Position table (`apps/api/prisma/schema.prisma:571-609`) now belongs to PositionSnapshot via positionSnapshotId
- Existing patterns use `.rlsPortfolioClient(portfolioId)` for automatic portfolio scoping
- GraphQL resolvers follow `@Query(() => [ObjectType])` pattern with `@ClerkContext()` authentication

## Desired End State

A simplified performance-history module that:
- Directly queries RealizedPAndL records without transformations
- Queries PositionSnapshot with joined Position records for position data
- Returns all database columns as-is
- Deduplicates to ensure only one record per day per account (earliest record wins)
- Uses createdAt for time-based filtering on the backend
- Supports standard time range queries (YTD, 6M, 1Y, 2Y, ALL)
- Maintains compatibility with existing GraphQL clients through a new namespace

### Verification Criteria:
- New module exists at `/apps/api/src/performance-history/`
- GraphQL schema includes new queries: `realizedPAndLHistory` and `positionSnapshotHistory`
- Queries return raw database records filtered by time range
- PositionSnapshot queries include nested Position records
- No data transformation or aggregation in service layer

## What We're NOT Doing

- NOT removing the existing portfolio-snapshot module (keeping for backwards compatibility)
- NOT aggregating or transforming data in the service layer
- NOT using PortfolioBalanceSnapshot table
- NOT adding fake data points for visual effects
- NOT implementing complex performance calculations

## Implementation Approach

Create a parallel module that provides simplified, raw data access to RealizedPAndL and Position records, allowing frontend clients to handle aggregation and visualization as needed.

## Phase 1: Module Structure Setup

### Overview
Create the basic module structure with empty implementations to establish the foundation.

### Changes Required:

#### 1. Create Module Structure
**Files to create:**
- `apps/api/src/performance-history/performance-history.module.ts`
- `apps/api/src/performance-history/performance-history.service.ts`
- `apps/api/src/performance-history/performance-history.resolver.ts`
- `apps/api/src/performance-history/performance-history.dto.ts`

### Success Criteria:

#### Automated Verification:
- [ ] Module files exist: `ls apps/api/src/performance-history/*.ts`
- [ ] TypeScript compilation passes: `pnpm --filter api check:types`

#### Manual Verification:
- [ ] Module structure follows existing patterns

---

## Phase 2: DTO Definitions

### Overview
Define input and output DTOs for the simplified API that directly maps to database columns.

### Changes Required:

#### 1. performance-history.dto.ts
**Changes:**
- Create `TimeRangeInput` with startDate/endDate or timeSpan enum
- Create `RealizedPAndLHistoryOutput` mapping all RealizedPAndL columns
- Create `PositionSnapshotHistoryOutput` with nested Position records
- Register GraphQL types and enums

```typescript
// Key structures:
- TimeSpanV2 enum (YTD, SIX_MONTHS, ONE_YEAR, TWO_YEARS, ALL)
- TimeRangeInput with optional timeSpan or date range
- RealizedPAndLHistoryOutput matching RealizedPAndL columns
- PositionSnapshotHistoryOutput with:
  - All PositionSnapshot columns
  - positions: Position[] (nested array of related positions)
```

### Success Criteria:

#### Automated Verification:
- [ ] DTOs compile: `pnpm --filter api check:types`
- [ ] GraphQL schema generates: `pnpm --filter api generate:graphql`

#### Manual Verification:
- [ ] DTOs match database column definitions

---

## Phase 3: Service Implementation

### Overview
Implement service methods for querying RealizedPAndL and PositionSnapshot records with time-based filtering and deduplication to ensure only one record per day per account.

### Changes Required:

#### 1. performance-history.service.ts
**Methods to implement:**

```typescript
- getRealizedPAndLHistory(portfolioId: string, input: TimeRangeInput)
  - Calculate date range from input
  - Query all RealizedPAndL records within date range
  - Group by date (YYYY-MM-DD) and accountId
  - Return only the first record per day per account (earliest createdAt)
  - Order final results by createdAt DESC
  
- getPositionSnapshotHistory(portfolioId: string, input: TimeRangeInput)
  - Calculate date range from input
  - Query all PositionSnapshot records within date range
  - Group by date (YYYY-MM-DD) and accountId
  - Return only the first record per day per account (earliest createdAt)
  - Include nested Position records via Prisma include
  - Order final results by createdAt DESC
```

**Key patterns:**
- Use `.rlsPortfolioClient(portfolioId)` for scoping
- Query all records then deduplicate in service layer
- Group by date string (createdAt.toISOString().split('T')[0])
- Keep first record per day (earliest) to match current behavior
- Use `include: { Position: true }` for nested data
- Return deduplicated records maintaining all columns

### Success Criteria:

#### Automated Verification:
- [ ] Service compiles: `pnpm --filter api check:types`
- [ ] Unit tests pass: `pnpm --filter api test performance-history.service`

#### Manual Verification:
- [ ] Service queries return expected data structure

---

## Phase 4: GraphQL Resolver Implementation

### Overview
Create GraphQL resolvers that expose the simplified queries to clients.

### Changes Required:

#### 1. performance-history.resolver.ts
**Queries to implement:**

```typescript
@Query(() => [RealizedPAndLHistoryOutput])
realizedPAndLHistory(
  @ClerkContext() { metadata }: ClerkClaims,
  @Args('input') input: TimeRangeInput
): Promise<RealizedPAndLHistoryOutput[]>

@Query(() => [PositionSnapshotHistoryOutput])
positionSnapshotHistory(
  @ClerkContext() { metadata }: ClerkClaims,
  @Args('input') input: TimeRangeInput
): Promise<PositionSnapshotHistoryOutput[]>
```

### Success Criteria:

#### Automated Verification:
- [ ] Resolver compiles: `pnpm --filter api check:types`
- [ ] GraphQL schema updated: `pnpm --filter api generate:graphql`

#### Manual Verification:
- [ ] GraphQL playground shows new queries
- [ ] Queries execute successfully with sample inputs

---

## Phase 5: Module Integration

### Overview
Register the new module with the application and ensure it's accessible.

### Changes Required:

#### 1. Update app.module.ts
**File:** `apps/api/src/app/app.module.ts`
**Changes:** Import and add PerformanceHistoryModule to imports array

### Success Criteria:

#### Automated Verification:
- [ ] Application starts: `pnpm --filter api dev`
- [ ] No import errors: `pnpm --filter api check:types`
- [ ] E2E tests pass: `pnpm --filter api test:e2e`

#### Manual Verification:
- [ ] GraphQL endpoint serves new queries
- [ ] Can query both old and new snapshot APIs simultaneously

---

## Phase 6: Testing

### Overview
Add comprehensive tests for the new simplified API.

### Changes Required:

#### 1. Unit Tests
**Files:**
- `performance-history.service.spec.ts`
- `performance-history.resolver.spec.ts`

**Test cases:**
- Time range calculation for each TimeSpan enum value
- Date filtering with custom date ranges
- Deduplication: multiple records on same day returns only first
- Deduplication: records from different accounts preserved
- Empty result handling
- Portfolio scoping verification

### Success Criteria:

#### Automated Verification:
- [ ] All unit tests pass: `pnpm --filter api test performance-history`
- [ ] Test coverage > 80%: `pnpm --filter api test:cov performance-history`

#### Manual Verification:
- [ ] Edge cases handled appropriately
- [ ] Performance acceptable with large datasets

---

## Testing Strategy

### Unit Tests:
- Time range calculation logic
- Date filtering accuracy
- Deduplication logic (one record per day per account)
- Portfolio scoping enforcement
- Empty and null handling

### Manual Testing Steps:
1. Query realizedPAndLHistory with YTD time span
2. Query positionSnapshotHistory with custom date range
3. Verify PositionSnapshot includes nested Position records
4. Test with portfolios having different data volumes
5. Verify old portfolio-snapshot API still works

## Performance Considerations

- Index usage: Ensure queries use existing `(accountId, createdAt)` indexes
- Pagination: Consider adding limit/offset for large datasets in future iteration
- Query optimization: Monitor slow query logs after deployment
- Memory usage: Raw record return may use more memory than aggregated data

## Migration Notes

- No data migration required (using existing tables)
- Frontend clients need updates to consume raw data format
- Consider deprecation timeline for old portfolio-snapshot module
- Document API differences for frontend team

## References

- Current implementation: `apps/api/src/portfolio-snapshot/`
- Schema definitions: 
  - `apps/api/prisma/schema.prisma:340-383` (RealizedPAndL)
  - `apps/api/prisma/schema.prisma:555-566` (PositionSnapshot) 
  - `apps/api/prisma/schema.prisma:571-609` (Position)
- API patterns: `apps/api/src/account/account.resolver.ts:36-43` (raw record queries with PrismaSelect)
- Similar pattern: `apps/api/src/position/position.service.ts:10-29` (simple findMany)