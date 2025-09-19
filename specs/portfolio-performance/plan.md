# Portfolio Performance API Implementation Plan

## Overview

Implement a NestJS module that provides portfolio performance data over time using the existing PortfolioBalanceSnapshot model. This will enable a new GraphQL endpoint `portfolioPerformance` that returns time-series data for charting portfolio value with configurable time spans and grouping options.

## Current State Analysis

**Existing Infrastructure:**
- `PortfolioBalanceSnapshot` model exists in Prisma schema at `/Users/zacharymartinezhansen/Desktop/Code/tax-harvest/apps/api/prisma/schema.prisma:908-922`
- Snapshots are created automatically when accounts sync via `AccountService.handleAccountSynced()` at `/Users/zacharymartinezhansen/Desktop/Code/tax-harvest/apps/api/src/account/account.service.ts`
- Portfolio module structure exists at `/Users/zacharymartinezhansen/Desktop/Code/tax-harvest/apps/api/src/portfolio/`
- No existing portfolio performance or chart endpoints for portfolio-level data

**Key Discoveries:**
- Snapshots store `positions` as JSON with structure: `[{ assetSymbol: string, marketValue: number }]`
- Database has index on `[portfolioId, createdAt(desc)]` for efficient queries
- All portfolio queries use RLS via `PrismaService.forPortfolio(portfolioId)`
- Existing patterns for time-series data in Polygon service can be referenced

## Desired End State

### Specification
A fully functional GraphQL endpoint that:
1. Returns daily portfolio performance data for specified time ranges
2. Supports two grouping modes: by account or by asset position
3. Handles large datasets efficiently with proper aggregation
4. Follows existing NestJS and GraphQL patterns

### Verification
- GraphQL playground shows new `portfolioPerformance` query
- Query returns correctly formatted time-series data
- Performance is acceptable for 2+ years of daily data
- All tests pass

## What We're NOT Doing

- Creating new snapshot data or modifying snapshot creation logic
- Implementing real-time updates or websockets
- Adding data interpolation for missing days
- Creating frontend components (chart UI)
- Modifying the existing PortfolioBalanceSnapshot model
- Adding caching layer (can be added later if needed)

## Implementation Approach

Create a new portfolio-snapshot module that:
1. Defines GraphQL types for time spans and response format
2. Implements service methods for data aggregation
3. Exposes a single GraphQL query endpoint
4. Follows existing patterns for database queries and RLS

## Phase 1: Module Structure and Types

### Overview
Create the basic module structure and define all necessary GraphQL types and enums.

### Changes Required:

#### 1. Create Portfolio Snapshot Module
**File**: `apps/api/src/portfolio-snapshot/portfolio-snapshot.module.ts`
**Changes**: Create new module following existing patterns

```typescript
import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { PortfolioSnapshotResolver } from './portfolio-snapshot.resolver';
import { PortfolioSnapshotService } from './portfolio-snapshot.service';

@Module({
  imports: [DatabaseModule],
  providers: [PortfolioSnapshotService, PortfolioSnapshotResolver],
  exports: [PortfolioSnapshotService],
})
export class PortfolioSnapshotModule {}
```

#### 2. Define GraphQL Types
**File**: `apps/api/src/portfolio-snapshot/portfolio-snapshot.dto.ts`
**Changes**: Create DTOs for inputs and outputs

```typescript
import { Field, InputType, ObjectType, registerEnumType } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';

export enum PerformanceTimeSpan {
  YTD = 'YTD',
  SIX_MONTHS = 'SIX_MONTHS',
  ONE_YEAR = 'ONE_YEAR',
  TWO_YEARS = 'TWO_YEARS',
  ALL = 'ALL',
}

export enum PerformanceType {
  DEFAULT = 'DEFAULT',
  POSITION = 'POSITION',
}

registerEnumType(PerformanceTimeSpan, {
  name: 'PerformanceTimeSpan',
  description: 'Time span for portfolio performance data',
});

registerEnumType(PerformanceType, {
  name: 'PerformanceType',
  description: 'Type of performance data grouping',
});

@InputType()
export class PortfolioPerformanceInput {
  @Field(() => PerformanceTimeSpan)
  timeSpan: PerformanceTimeSpan;

  @Field(() => PerformanceType, { defaultValue: PerformanceType.DEFAULT })
  type: PerformanceType = PerformanceType.DEFAULT;
}

@ObjectType()
export class PortfolioPerformanceDataPoint {
  @Field()
  date: string;

  @Field()
  portfolioTotal: number;

  @Field(() => GraphQLJSONObject)
  data: Record<string, number>; // Dynamic keys for accounts or positions
}
```

#### 3. Register Module in App Module
**File**: `apps/api/src/app.module.ts`
**Changes**: Import and add PortfolioSnapshotModule to imports array

### Success Criteria:

#### Automated Verification:
- [x] Type checking passes: `pnpm --filter api check:types`
- [x] Linting passes: `pnpm --filter api lint`
- [x] GraphQL schema generates successfully: `pnpm --filter api codegen`

#### Manual Verification:
- [x] New types appear in GraphQL schema
- [x] Module loads without errors on server start

---

## Phase 2: Service Implementation

### Overview
Implement the core business logic for aggregating and transforming snapshot data.

### Changes Required:

#### 1. Portfolio Snapshot Service
**File**: `apps/api/src/portfolio-snapshot/portfolio-snapshot.service.ts`
**Changes**: Implement service with data aggregation methods

```typescript
/**
 * Service for retrieving and aggregating portfolio performance data
 * @example
 * const performance = await portfolioSnapshotService.getPerformance({
 *   portfolioId: 'uuid',
 *   timeSpan: PerformanceTimeSpan.YTD,
 *   type: PerformanceType.DEFAULT
 * });
 */
@Injectable()
export class PortfolioSnapshotService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly db: Database,
  ) {}

  /**
   * Get portfolio performance data for specified time range
   */
  async getPerformance(
    portfolioId: string,
    input: PortfolioPerformanceInput,
  ): Promise<PortfolioPerformanceDataPoint[]> {
    const dateFrom = this.calculateStartDate(input.timeSpan);
    
    // Query snapshots using RLS
    const snapshots = await this.fetchSnapshots(portfolioId, dateFrom);
    
    // Group by day and aggregate
    const dailyData = this.aggregateByDay(snapshots);
    
    // Transform based on type
    return input.type === PerformanceType.POSITION
      ? this.transformToPositionFormat(dailyData)
      : this.transformToAccountFormat(dailyData);
  }

  private calculateStartDate(timeSpan: PerformanceTimeSpan): Date {
    // Implementation for date calculation
  }

  private async fetchSnapshots(
    portfolioId: string,
    dateFrom: Date,
  ) {
    // Use Kysely for complex aggregation query
  }

  private aggregateByDay(snapshots: any[]): Map<string, any[]> {
    // Group snapshots by date, keeping oldest per day
  }

  private transformToAccountFormat(dailyData: Map<string, any[]>): PortfolioPerformanceDataPoint[] {
    // Transform to account-based format
  }

  private transformToPositionFormat(dailyData: Map<string, any[]>): PortfolioPerformanceDataPoint[] {
    // Transform to position-based format using positions JSON
  }
}
```

### Success Criteria:

#### Automated Verification:
- [x] Unit tests pass: `pnpm --filter api test portfolio-snapshot.service`
- [x] Type checking passes: `pnpm --filter api check:types`

#### Manual Verification:
- [ ] Service methods handle edge cases (empty data, single day)
- [ ] Date calculations are correct for all time spans
- [ ] Aggregation correctly selects oldest record per day

---

## Phase 3: GraphQL Resolver

### Overview
Implement the GraphQL resolver to expose the portfolio performance endpoint.

### Changes Required:

#### 1. Portfolio Snapshot Resolver
**File**: `apps/api/src/portfolio-snapshot/portfolio-snapshot.resolver.ts`
**Changes**: Create resolver with query endpoint

```typescript
import { Args, Query, Resolver } from '@nestjs/graphql';
import { ClerkContext } from '../auth/decorators/clerk-context.decorator';
import type { ClerkClaims } from '../auth/types';
import {
  PortfolioPerformanceDataPoint,
  PortfolioPerformanceInput,
} from './portfolio-snapshot.dto';
import { PortfolioSnapshotService } from './portfolio-snapshot.service';

@Resolver()
export class PortfolioSnapshotResolver {
  constructor(
    private readonly portfolioSnapshotService: PortfolioSnapshotService,
  ) {}

  /**
   * Get portfolio performance data over time
   * @example
   * query {
   *   portfolioPerformance(input: { timeSpan: YTD, type: DEFAULT }) {
   *     date
   *     portfolioTotal
   *     data
   *   }
   * }
   */
  @Query(() => [PortfolioPerformanceDataPoint], {
    description: 'Get portfolio performance data over time',
    name: 'portfolioPerformance',
  })
  async portfolioPerformance(
    @ClerkContext() { metadata }: ClerkClaims,
    @Args('input') input: PortfolioPerformanceInput,
  ): Promise<PortfolioPerformanceDataPoint[]> {
    return this.portfolioSnapshotService.getPerformance(
      metadata.portfolioId,
      input,
    );
  }
}
```

### Success Criteria:

#### Automated Verification:
- [x] GraphQL schema updates: `pnpm --filter api codegen`
- [x] Type checking passes: `pnpm --filter api check:types`
- [ ] Integration tests pass: `pnpm --filter api test:e2e`

#### Manual Verification:
- [ ] Query appears in GraphQL playground
- [ ] Query executes successfully with valid inputs
- [ ] Authentication/authorization works correctly
- [ ] Error messages are helpful for invalid inputs

---

## Phase 4: Database Queries and Optimization

### Overview
Implement efficient database queries using Kysely for complex aggregations.

### Changes Required:

#### 1. Implement Kysely Queries
**File**: `apps/api/src/portfolio-snapshot/portfolio-snapshot.service.ts`
**Changes**: Add efficient database query methods

```typescript
private async fetchSnapshots(
  portfolioId: string,
  dateFrom: Date,
): Promise<SnapshotData[]> {
  // Use Kysely for efficient aggregation with window functions
  return this.db
    .selectFrom('PortfolioBalanceSnapshot')
    .select([
      'id',
      'createdAt',
      'accountId',
      'valueTotal',
      'valueCash',
      'valueAssets',
      'positions',
      // Use ROW_NUMBER to get oldest per day per account
      sql<number>`ROW_NUMBER() OVER (
        PARTITION BY DATE("createdAt"), "accountId"
        ORDER BY "createdAt" ASC
      )`.as('rn'),
    ])
    .where('portfolioId', '=', portfolioId)
    .where('createdAt', '>=', dateFrom)
    .$if(true, (qb) => 
      qb.where(sql`ROW_NUMBER() OVER (
        PARTITION BY DATE("createdAt"), "accountId"
        ORDER BY "createdAt" ASC
      )`, '=', 1)
    )
    .orderBy('createdAt', 'asc')
    .execute();
}
```

### Success Criteria:

#### Automated Verification:
- [x] Database queries execute without errors
- [ ] Query performance tests pass (< 500ms for 2 years of data)

#### Manual Verification:
- [ ] Queries handle large datasets efficiently
- [ ] Memory usage remains reasonable with large result sets
- [ ] Database indexes are utilized effectively

---

## Phase 5: Testing

### Overview
Add comprehensive unit and integration tests.

### Changes Required:

#### 1. Service Unit Tests
**File**: `apps/api/src/portfolio-snapshot/portfolio-snapshot.service.spec.ts`
**Changes**: Create unit tests for service methods

#### 2. Resolver Integration Tests
**File**: `apps/api/src/portfolio-snapshot/portfolio-snapshot.resolver.spec.ts`
**Changes**: Create integration tests for GraphQL queries

#### 3. E2E Tests
**File**: `apps/api/test/portfolio-snapshot.e2e-spec.ts`
**Changes**: Add end-to-end tests for the full flow

### Success Criteria:

#### Automated Verification:
- [x] All unit tests pass: `pnpm --filter api test`
- [ ] Integration tests pass: `pnpm --filter api test:e2e`
- [ ] Test coverage > 80%: `pnpm --filter api test:cov`

#### Manual Verification:
- [x] Edge cases are covered (empty portfolio, single snapshot, etc.)
- [ ] Error scenarios are tested
- [ ] Performance under load is acceptable

---

## Testing Strategy

### Unit Tests:
- Date calculation logic for all time spans
- Data aggregation logic (oldest per day selection)
- Transformation logic for both output types
- Edge cases: empty data, single record, missing positions JSON

### Manual Testing Steps:
1. Start development server: `pnpm --filter api dev`
2. Open GraphQL playground at http://localhost:4000/graphql
3. Test query with different time spans:
   - YTD with current year data
   - 6 months spanning year boundary
   - ALL with multiple years
4. Test both DEFAULT and POSITION types
5. Verify data accuracy by comparing with raw database records
6. Test with portfolios having varying amounts of historical data
7. Test performance with portfolio having 2+ years of daily snapshots

## Performance Considerations

- **Database Indexes**: Utilize existing index on `[portfolioId, createdAt(desc)]`
- **Query Optimization**: Use window functions for efficient "oldest per day" selection
- **Memory Management**: Stream large result sets if needed
- **Pagination**: Consider adding pagination if datasets exceed 1000 days
- **Caching**: Can add Redis caching in future if query volume is high

## Migration Notes

- No database migrations required (using existing model)
- No data backfilling needed (using existing snapshots)
- Backward compatible - no changes to existing APIs

## References

- Original requirements: `/specs/portfolio-performance/requirements.md`
- PortfolioBalanceSnapshot model: `/apps/api/prisma/schema.prisma:908-922`
- Portfolio module patterns: `/apps/api/src/portfolio/`
- Kysely database patterns: `/apps/api/src/database/`
- GraphQL type patterns: `/apps/api/src/**/*.dto.ts`