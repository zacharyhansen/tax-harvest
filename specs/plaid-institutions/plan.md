# Plaid Institutions Admin Portal - Implementation Plan

## Overview

This plan outlines the implementation of an admin-only portal to view supported Plaid financial institutions. The feature will provide a bento-style card grid interface showing institution summaries, with detailed views for individual institutions. Data will be synced nightly from the Plaid API and stored in a Prisma database model.

## Current State Analysis

Based on codebase research:

### Existing Patterns to Follow:
- **Admin pages**: Follow pattern from `apps/web/app/main/admin/logs/` and `apps/web/app/main/admin/plaid-history/`
- **Navigation**: Admin items in `apps/web/app/main/nav-tree.tsx:64-111` with `roles: ['admin']`
- **Cron tasks**: Pattern from `apps/api/src/cron-tasks/cron-tasks.service.ts` with `@Cron()` decorator
- **Plaid integration**: Existing service at `apps/api/src/plaid/plaid.service.ts` with PlaidApi client
- **Bento grid UI**: Card grid pattern from `apps/web/app/main/admin/plaid-history/[plaidMergeId]/page.tsx:116-165`
- **GraphQL admin queries**: Pattern from `apps/api/src/multi-change-set/multi-change-set.resolver.ts` with `@UseGuards(AdminGuard)`

### Key Discoveries:
- Plaid client already configured at `apps/api/src/plaid/plaid.service.ts:102-112`
- Cron scheduling enabled via `ScheduleModule` when `CRON_ENABLED=true`
- Admin authorization via `AdminGuard` checking Clerk claims metadata
- Prisma uses JSONB fields extensively for nested data (e.g., `AssetMerge.lotData` at schema.prisma:508)
- Apollo Client configured at `apps/web/app/main/ApolloProviderWrapper.tsx` with auth headers
- DataCard component available from `@repo/ui/components/dataCard`

### Constraints:
- No `/institutions/get` endpoint exists in Plaid service yet - need to add
- No institution-related Prisma models exist
- Cron directory exists at `apps/api/src/cron-tasks/` (not nested as suggested in requirements)
- Must use `rlsBypassClient()` for admin queries (no portfolio scoping for institutions)

## Desired End State

After implementation:
1. **Database**: `PlaidInstitution` model stores institution data with JSONB status field
2. **Backend**: Nightly cron job syncs institutions from Plaid API with pagination
3. **API**: GraphQL queries expose institutions list and detail endpoints (admin-only)
4. **Frontend**: Admin nav item leads to bento grid of institution cards, clicking opens detail view
5. **Manual testing**: Admin can view institutions, click for details, and manually trigger refresh

### Verification:
```bash
# Backend tests
pnpm --filter @repo/api prisma migrate dev  # Migration applies
pnpm --filter @repo/api check:types         # Types valid
pnpm --filter @repo/api build               # Builds successfully

# Frontend tests
pnpm codegen                                # GraphQL schema generates
pnpm --filter @repo/web check:types         # Types valid
pnpm --filter @repo/web build               # Builds successfully

# Manual verification
# 1. Navigate to /main/admin/institutions as admin
# 2. See bento grid of institutions
# 3. Click institution card → detail page loads
# 4. Run manual refresh mutation → data updates
```

## What We're NOT Doing

- Institution editing/modification capabilities
- Institution deletion
- Real-time status monitoring (only nightly sync)
- Historical status tracking or trending
- Institution comparison features
- Export functionality (CSV, PDF, etc.)
- User-facing institution directory (admin-only)
- Multi-country support beyond US (can add later)
- Custom institution overrides or configuration

## Implementation Approach

**Strategy**: Build from database → backend → API → frontend
- Start with foundational Prisma model and migration
- Add Plaid API integration in PlaidService
- Implement cron task for nightly sync
- Build GraphQL layer with admin guards
- Finally implement frontend UI

**Rationale**: Database-first ensures data structure is solid before building dependent layers. Backend logic can be tested independently before adding UI.

---

## Phase 1: Database Schema and Migration

### Overview
Create the Prisma model for storing Plaid institution data with proper indexing and JSONB fields for nested structures.

### Changes Required:

#### 1. Prisma Schema
**File**: `apps/api/prisma/schema.prisma`
**Changes**: Add PlaidInstitution model

```prisma
model PlaidInstitution {
  id            String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  institutionId String   @unique // Plaid's institution_id (e.g., "ins_1")
  name          String
  countryCode   String[] // Array of country codes
  url           String?
  primaryColor  String?
  logo          String? // URL or base64 encoded
  oauth         Boolean  @default(false)
  products      String[] // Array of product names
  routingNumbers String[] @default([])
  dtcNumbers     String[] @default([])
  status        Json     @db.JsonB // Nested status data
  raw           Json?    @db.JsonB // Complete API response (optional)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @default(now()) @updatedAt
  lastSyncedAt  DateTime @default(now())

  @@index([name])
  @@index([lastSyncedAt])
  @@map("PlaidInstitution")
}
```

**Location**: Add after existing Plaid-related models (around line 963, after `AuthConnection`)

#### 2. Database Migration
**Command**:
```bash
cd apps/api
pnpm prisma migrate dev --name add_plaid_institution_model
```

**Expected outcome**:
- New migration file in `apps/api/prisma/migrations/`
- Database schema updated with PlaidInstitution table
- Prisma client regenerated with PlaidInstitution type

### Success Criteria:

#### Automated Verification:
- [ ] Migration applies cleanly: `cd apps/api && pnpm prisma migrate dev`
- [ ] Prisma generates types: `cd apps/api && pnpm prisma generate`
- [ ] No TypeScript errors: `pnpm --filter @repo/api check:types`
- [ ] Can query model in Prisma Studio: `cd apps/api && pnpm prisma studio`

#### Manual Verification:
- [ ] Migration file created in `apps/api/prisma/migrations/`
- [ ] PlaidInstitution table exists in database
- [ ] All fields and indexes created correctly
- [ ] Can insert/query test record via Prisma Studio

---

## Phase 2: Plaid API Integration

### Overview
Add methods to PlaidService to fetch institutions from Plaid API with pagination support.

### Changes Required:

#### 1. Plaid Service - Add Institution Fetch Methods
**File**: `apps/api/src/plaid/plaid.service.ts`
**Changes**: Add new methods for fetching institutions

**Add after existing methods (around line 1363):**

```typescript
/**
 * Fetches a paginated list of institutions from Plaid
 * @param params - Pagination and filter parameters
 * @returns Promise with institutions array and total count
 * @example
 * const result = await plaidService.getInstitutions({
 *   count: 100,
 *   offset: 0,
 *   countryCodes: ['US']
 * });
 */
async getInstitutions(params: {
  count: number;
  offset: number;
  countryCodes: string[];
}): Promise<{ institutions: any[]; total: number }> {
  try {
    const response = await this.client.institutionsGet({
      count: params.count,
      offset: params.offset,
      country_codes: params.countryCodes as CountryCode[],
    });

    return {
      institutions: response.data.institutions,
      total: response.data.total,
    };
  } catch (error) {
    this.logger.error('Failed to fetch institutions from Plaid:', error);
    throw error;
  }
}

/**
 * Fetches all institutions from Plaid with automatic pagination and upserts to database
 * @returns Promise<number> - Total number of institutions synced
 * @example
 * const count = await plaidService.refreshAllInstitutions();
 * console.log(`Synced ${count} institutions`);
 */
@TimeMethod()
async refreshAllInstitutions(): Promise<number> {
  const BATCH_SIZE = 100;
  const countryCodes = ['US'];
  let offset = 0;
  let total = 0;
  let institutionsSynced = 0;

  this.logger.log('Starting Plaid institutions sync...');

  do {
    const { institutions, total: totalCount } = await this.getInstitutions({
      count: BATCH_SIZE,
      offset,
      countryCodes,
    });

    total = totalCount;

    // Upsert institutions in batch
    await this.prismaService.rlsBypassClient().$transaction(
      institutions.map((institution) =>
        this.prismaService.rlsBypassClient().plaidInstitution.upsert({
          where: { institutionId: institution.institution_id },
          create: {
            institutionId: institution.institution_id,
            name: institution.name,
            countryCode: institution.country_codes || [],
            url: institution.url || null,
            primaryColor: institution.primary_color || null,
            logo: institution.logo || null,
            oauth: institution.oauth || false,
            products: institution.products || [],
            routingNumbers: institution.routing_numbers || [],
            dtcNumbers: institution.dtc_numbers || [],
            status: institution.status || {},
            raw: institution,
            lastSyncedAt: new Date(),
          },
          update: {
            name: institution.name,
            countryCode: institution.country_codes || [],
            url: institution.url || null,
            primaryColor: institution.primary_color || null,
            logo: institution.logo || null,
            oauth: institution.oauth || false,
            products: institution.products || [],
            routingNumbers: institution.routing_numbers || [],
            dtcNumbers: institution.dtc_numbers || [],
            status: institution.status || {},
            raw: institution,
            lastSyncedAt: new Date(),
            updatedAt: new Date(),
          },
        })
      )
    );

    institutionsSynced += institutions.length;
    offset += BATCH_SIZE;

    this.logger.log(
      `Synced ${institutionsSynced}/${total} institutions (${Math.round((institutionsSynced / total) * 100)}%)`
    );

    // Rate limiting: 100ms delay between batches
    if (offset < total) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  } while (offset < total);

  this.logger.log(`Completed institutions sync: ${institutionsSynced} total`);
  return institutionsSynced;
}
```

**Imports to add** (at top of file around line 21-32):
```typescript
import { CountryCode } from 'plaid';
```

### Success Criteria:

#### Automated Verification:
- [ ] TypeScript compiles: `pnpm --filter @repo/api check:types`
- [ ] PlaidService builds: `pnpm --filter @repo/api build`

#### Manual Verification:
- [ ] Can call `plaidService.getInstitutions()` with test parameters
- [ ] Returns institutions array and total count
- [ ] Can call `plaidService.refreshAllInstitutions()`
- [ ] Institutions are upserted to database
- [ ] Log messages show sync progress
- [ ] Rate limiting delays are working (check timing)

---

## Phase 3: Cron Task for Nightly Sync

### Overview
Add a scheduled cron task to refresh institution data nightly.

### Changes Required:

#### 1. Cron Tasks Service - Add Nightly Sync
**File**: `apps/api/src/cron-tasks/cron-tasks.service.ts`
**Changes**: Add constructor injection and cron method

**Update constructor** (around line 13-20):
```typescript
constructor(
  private readonly polygonService: PolygonService,
  readonly _assetService: AssetService,
  readonly _priceHourlyVectorService: PriceHourlyVectorService,
  private readonly notificationService: NotificationService,
  private readonly plaidService: PlaidService, // ADD THIS LINE
) {}
```

**Add cron method** (after existing cron methods, around line 100):
```typescript
/**
 * Nightly sync of Plaid institutions
 * Runs at 3 AM daily to refresh institution data from Plaid API
 */
@Cron(CronExpression.EVERY_DAY_AT_3AM, {
  name: 'refresh_plaid_institutions',
})
async refreshPlaidInstitutions() {
  this.logger.log('Starting nightly Plaid institutions refresh');
  try {
    const count = await this.plaidService.refreshAllInstitutions();
    this.logger.log(`Successfully synced ${count} institutions`);
  } catch (error) {
    this.logger.error('Failed to refresh Plaid institutions:', error);
  }
}
```

#### 2. Cron Tasks Module - Add PlaidModule Import
**File**: `apps/api/src/cron-tasks/cron-tasks.module.ts`
**Changes**: Import PlaidModule

**Update imports array** (around line 10-15):
```typescript
@Module({
  imports: [
    PolygonModule,
    AssetModule,
    PriceHourlyVectorModule,
    NotificationModule,
    PlaidModule, // ADD THIS LINE
  ],
  providers: [CronTasksService, CronTasksResolver],
  exports: [CronTasksService],
})
export class CronTasksModule {}
```

**Add import statement** (top of file):
```typescript
import { PlaidModule } from '../plaid/plaid.module';
```

### Success Criteria:

#### Automated Verification:
- [ ] TypeScript compiles: `pnpm --filter @repo/api check:types`
- [ ] CronTasksService builds: `pnpm --filter @repo/api build`
- [ ] No circular dependency errors: `pnpm --filter @repo/api build`

#### Manual Verification:
- [ ] Cron job is registered (check app startup logs for 'refresh_plaid_institutions')
- [ ] Can trigger cron manually for testing (set schedule to `*/1 * * * *` temporarily)
- [ ] Cron job successfully syncs institutions
- [ ] Logs show sync progress and completion
- [ ] Database contains institution records after sync

---

## Phase 4: GraphQL API Layer

### Overview
Create a new NestJS module with GraphQL resolvers for querying institution data.

### Changes Required:

#### 1. Create PlaidInstitution Module Directory
**Command**:
```bash
mkdir -p apps/api/src/plaid-institution
```

#### 2. PlaidInstitution Service
**File**: `apps/api/src/plaid-institution/plaid-institution.service.ts`
**Changes**: Create new service

```typescript
import { Injectable, Logger } from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import { PrismaService } from '~/database/prisma/prisma.service';

/**
 * Service for managing Plaid institutions
 * @example
 * const institutions = await plaidInstitutionService.findMany({ where: { oauth: true } });
 */
@Injectable()
export class PlaidInstitutionService {
  private readonly logger = new Logger(PlaidInstitutionService.name);

  constructor(private readonly prismaService: PrismaService) {}

  /**
   * Find many institutions with optional filters
   */
  async findMany(params: {
    select?: Prisma.PlaidInstitutionSelect;
    where?: Prisma.PlaidInstitutionWhereInput;
    orderBy?: Prisma.PlaidInstitutionOrderByWithRelationInput;
    skip?: number;
    take?: number;
  }) {
    return this.prismaService.rlsBypassClient().plaidInstitution.findMany({
      select: params.select,
      where: params.where,
      orderBy: params.orderBy || { name: 'asc' },
      skip: params.skip,
      take: params.take,
    });
  }

  /**
   * Find one institution by ID
   */
  async findOne(params: {
    select?: Prisma.PlaidInstitutionSelect;
    where: Prisma.PlaidInstitutionWhereUniqueInput;
  }) {
    return this.prismaService.rlsBypassClient().plaidInstitution.findUnique({
      select: params.select,
      where: params.where,
    });
  }

  /**
   * Count institutions with optional filters
   */
  async count(where?: Prisma.PlaidInstitutionWhereInput) {
    return this.prismaService.rlsBypassClient().plaidInstitution.count({
      where,
    });
  }
}
```

#### 3. PlaidInstitution Resolver
**File**: `apps/api/src/plaid-institution/plaid-institution.resolver.ts`
**Changes**: Create new resolver using auto-generated Prisma GraphQL types

```typescript
import { UseGuards } from '@nestjs/common';
import { Args, Info, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import type { GraphQLResolveInfo } from 'graphql';
import type { Prisma } from '@prisma/client';
import { AdminGuard } from '~/auth/guards/admin.guard';
import { PlaidService } from '~/plaid/plaid.service';
import { PrismaSelect } from '~/utilities/prisma/prisma-select';
import { PlaidInstitutionService } from './plaid-institution.service';
import {
  PlaidInstitution,
  PlaidInstitutionWhereInput,
} from '~/generated/graphql';

/**
 * GraphQL resolver for Plaid institutions (admin-only)
 * Uses auto-generated Prisma GraphQL types from schema
 */
@Resolver(() => PlaidInstitution)
@UseGuards(AdminGuard)
export class PlaidInstitutionResolver {
  constructor(
    private readonly plaidInstitutionService: PlaidInstitutionService,
    private readonly plaidService: PlaidService,
  ) {}

  /**
   * Query all Plaid institutions with optional filtering
   * @example
   * query {
   *   plaidInstitutions(where: { oauth: { equals: true } }) {
   *     id
   *     name
   *     oauth
   *   }
   * }
   */
  @Query(() => [PlaidInstitution], {
    name: 'plaidInstitutions',
    description: 'Get all Plaid institutions (admin-only)',
  })
  async plaidInstitutions(
    @Info() info: GraphQLResolveInfo,
    @Args('where', { type: () => PlaidInstitutionWhereInput, nullable: true })
    where?: PlaidInstitutionWhereInput,
  ) {
    const { select } = new PrismaSelect<Prisma.PlaidInstitutionSelect>(
      info,
    ).value;

    return this.plaidInstitutionService.findMany({
      select,
      where,
    });
  }

  /**
   * Query a single Plaid institution by ID
   * @example
   * query {
   *   plaidInstitution(institutionId: "ins_1") {
   *     id
   *     name
   *     products
   *     status
   *   }
   * }
   */
  @Query(() => PlaidInstitution, {
    name: 'plaidInstitution',
    description: 'Get a single Plaid institution (admin-only)',
    nullable: true,
  })
  async plaidInstitution(
    @Info() info: GraphQLResolveInfo,
    @Args('institutionId', { type: () => String }) institutionId: string,
  ) {
    const { select } = new PrismaSelect<Prisma.PlaidInstitutionSelect>(
      info,
    ).value;

    return this.plaidInstitutionService.findOne({
      select,
      where: { institutionId },
    });
  }

  /**
   * Get total count of institutions
   * @example
   * query {
   *   plaidInstitutionsCount
   * }
   */
  @Query(() => Int, {
    name: 'plaidInstitutionsCount',
    description: 'Get total count of Plaid institutions (admin-only)',
  })
  async plaidInstitutionsCount(
    @Args('where', { type: () => PlaidInstitutionWhereInput, nullable: true })
    where?: PlaidInstitutionWhereInput,
  ) {
    return this.plaidInstitutionService.count(where);
  }

  /**
   * Manually trigger refresh of institutions from Plaid API
   * @example
   * mutation {
   *   adminRefreshPlaidInstitutions
   * }
   */
  @Mutation(() => Boolean, {
    name: 'adminRefreshPlaidInstitutions',
    description: 'Manually refresh institutions from Plaid API (admin-only)',
  })
  async adminRefreshPlaidInstitutions(): Promise<boolean> {
    try {
      await this.plaidService.refreshAllInstitutions();
      return true;
    } catch (error) {
      return false;
    }
  }
}
```

**Note**: The `PlaidInstitution` entity and `PlaidInstitutionWhereInput` types are auto-generated from the Prisma schema by running Prisma's GraphQL generator. They will be available in `~/generated/graphql` after the migration is applied and the GraphQL schema is regenerated.

#### 4. PlaidInstitution Module
**File**: `apps/api/src/plaid-institution/plaid-institution.module.ts`
**Changes**: Create module

```typescript
import { Module } from '@nestjs/common';
import { PlaidModule } from '~/plaid/plaid.module';
import { PlaidInstitutionService } from './plaid-institution.service';
import { PlaidInstitutionResolver } from './plaid-institution.resolver';

@Module({
  imports: [PlaidModule],
  providers: [PlaidInstitutionService, PlaidInstitutionResolver],
  exports: [PlaidInstitutionService],
})
export class PlaidInstitutionModule {}
```

#### 5. App Module - Register PlaidInstitutionModule
**File**: `apps/api/src/app/app.module.ts`
**Changes**: Add to imports array

**Add import** (around line 20-50):
```typescript
import { PlaidInstitutionModule } from '~/plaid-institution/plaid-institution.module';
```

**Add to imports array** (around line 89-120):
```typescript
@Module({
  imports: [
    // ... existing imports
    PlaidInstitutionModule, // ADD THIS LINE
  ],
  providers: [{ provide: APP_GUARD, useClass: ClerkGuard }],
})
export class AppModule {}
```

#### 6. Regenerate GraphQL Schema
**Commands**:
```bash
cd apps/api
pnpm prisma generate  # Regenerates Prisma client with new model
# The Prisma GraphQL generator will auto-create PlaidInstitution types
```

**Expected outcome**:
- `PlaidInstitution` type available in `~/generated/graphql`
- `PlaidInstitutionWhereInput` type available in `~/generated/graphql`
- All CRUD input types generated automatically

### Success Criteria:

#### Automated Verification:
- [ ] Prisma generates: `cd apps/api && pnpm prisma generate`
- [ ] TypeScript compiles: `pnpm --filter @repo/api check:types`
- [ ] GraphQL types generated in `~/generated/graphql`
- [ ] API builds: `pnpm --filter @repo/api build`
- [ ] Can start API server: `pnpm --filter @repo/api dev`
- [ ] GraphQL playground shows new queries/mutations at `/graphql`

#### Manual Verification:
- [ ] `PlaidInstitution` type exists in `~/generated/graphql/index.ts`
- [ ] `PlaidInstitutionWhereInput` type exists in `~/generated/graphql/index.ts`
- [ ] Can query `plaidInstitutions` in GraphQL playground (requires admin token)
- [ ] Can query `plaidInstitution(institutionId: "...")`
- [ ] Can query `plaidInstitutionsCount`
- [ ] Can execute `adminRefreshPlaidInstitutions` mutation
- [ ] Queries return proper data structure with all fields
- [ ] Non-admin users get authorization error

---

## Phase 5: Frontend Navigation and Routing

### Overview
Add navigation item and routing configuration for the institutions pages.

### Changes Required:

#### 1. Navigation Tree - Add Institutions Item
**File**: `apps/web/app/main/nav-tree.tsx`
**Changes**: Add import and navigation item

**Add import** (around line 2-18):
```typescript
import {
  AlertTriangle,
  Bot,
  Building2, // ADD THIS LINE
  ChartArea,
  Logs,
  // ... rest of imports
} from 'lucide-react';
```

**Add to Admin NavGroup** (around line 64-111):
```typescript
{
  title: 'Admin',
  roles: ['admin'],
  items: [
    {
      title: 'Performance',
      url: TypedRoutes.performance(),
      icon: ChartArea,
      beta: true,
    },
    // ... existing items
    {
      title: 'Institutions', // ADD THIS ITEM
      url: TypedRoutes.institutions(),
      icon: Building2,
    },
    {
      title: 'Plaid Merges',
      url: TypedRoutes.plaidHistory(),
      icon: Merge,
    },
    // ... rest of items
  ],
},
```

#### 2. Routes Configuration - Add Typed Routes
**File**: `apps/web/lib/routes.ts`
**Changes**: Add institution routes

**Add to TypedRoutes object** (around line 15-91):
```typescript
export const TypedRoutes = {
  // ... existing routes
  institutions: makeRoute(() => `/main/admin/institutions`),
  institution: makeRoute(
    ({ institutionId }) => `/main/admin/institutions/${institutionId}`,
    z.object({ institutionId: z.string() }),
  ),
  // ... rest of routes
};
```

### Success Criteria:

#### Automated Verification:
- [ ] TypeScript compiles: `pnpm --filter @repo/web check:types`
- [ ] Web builds: `pnpm --filter @repo/web build`

#### Manual Verification:
- [ ] "Institutions" appears in admin nav section (admin users only)
- [ ] Clicking nav item navigates to `/main/admin/institutions`
- [ ] Route typing works: `TypedRoutes.institutions()` returns correct path
- [ ] Route typing works: `TypedRoutes.institution({ institutionId: 'test' })` returns correct path

---

## Phase 6: Frontend GraphQL Queries

### Overview
Define GraphQL queries and fragments for fetching institution data.

### Changes Required:

#### 1. Create GraphQL Query File
**File**: `apps/web/app/main/admin/institutions/institutions.gql`
**Changes**: Create new file with queries

```graphql
# Fragment for institution summary (card display)
fragment PlaidInstitutionSummary on PlaidInstitution {
  id
  institutionId
  name
  logo
  primaryColor
  countryCode
  oauth
  products
  lastSyncedAt
}

# Fragment for institution detail (full data)
fragment PlaidInstitutionDetail on PlaidInstitution {
  id
  institutionId
  name
  logo
  primaryColor
  url
  countryCode
  oauth
  products
  routingNumbers
  dtcNumbers
  status
  raw
  createdAt
  updatedAt
  lastSyncedAt
}

# Query for institutions list
query PlaidInstitutions($where: PlaidInstitutionWhereInput) {
  plaidInstitutions(where: $where) {
    ...PlaidInstitutionSummary
  }
  plaidInstitutionsCount(where: $where)
}

# Query for single institution
query PlaidInstitution($institutionId: String!) {
  plaidInstitution(institutionId: $institutionId) {
    ...PlaidInstitutionDetail
  }
}

# Mutation for manual refresh
mutation AdminRefreshPlaidInstitutions {
  adminRefreshPlaidInstitutions
}
```

#### 2. Generate TypeScript Types
**Command**:
```bash
pnpm codegen
```

**Expected outcome**:
- Updates `apps/web/generated/gql.ts` with:
  - `usePlaidInstitutionsQuery` hook
  - `usePlaidInstitutionQuery` hook
  - `useAdminRefreshPlaidInstitutionsMutation` hook
  - TypeScript types for all fields

### Success Criteria:

#### Automated Verification:
- [ ] Codegen runs successfully: `pnpm codegen`
- [ ] Generated types include PlaidInstitution types
- [ ] Generated hooks exported from `~/generated/gql`
- [ ] TypeScript compiles: `pnpm --filter @repo/web check:types`

#### Manual Verification:
- [ ] Can import `usePlaidInstitutionsQuery` in components
- [ ] Can import `usePlaidInstitutionQuery` in components
- [ ] Can import `useAdminRefreshPlaidInstitutionsMutation` in components
- [ ] Types match Prisma schema structure

---

## Phase 7: Frontend List Page (Bento Grid)

### Overview
Create the institutions list page with bento-style card grid layout.

### Changes Required:

#### 1. Create Page Directory
**Command**:
```bash
mkdir -p apps/web/app/main/admin/institutions
```

#### 2. Institutions List Page Component
**File**: `apps/web/app/main/admin/institutions/page.tsx`
**Changes**: Create new client component

```typescript
'use client';

import { Badge } from '@repo/ui/components/badge';
import { Button } from '@repo/ui/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/components/card';
import { Input } from '@repo/ui/components/input';
import { Building2, CheckCircle, RefreshCw, XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

import {
  useAdminRefreshPlaidInstitutionsMutation,
  usePlaidInstitutionsQuery,
} from '~/generated/gql';
import { TypedRoutes } from '~/lib/routes';
import { PageWrapper } from '~/modules/layout';
import { ErrorPage, LoadingPage } from '~/modules/utility-components';

export default function InstitutionsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const { data, loading, error, refetch } = usePlaidInstitutionsQuery({
    variables: {
      where: searchQuery
        ? { name: { contains: searchQuery } }
        : undefined,
    },
  });

  const [refreshMutation, { loading: refreshing }] =
    useAdminRefreshPlaidInstitutionsMutation();

  const handleRefresh = async () => {
    await toast.promise(refreshMutation().then(() => refetch()), {
      loading: 'Refreshing institutions from Plaid...',
      success: 'Institutions refreshed successfully',
      error: 'Failed to refresh institutions',
    });
  };

  const institutions = useMemo(() => {
    return data?.plaidInstitutions || [];
  }, [data]);

  if (error) {
    return <ErrorPage message="Failed to load institutions" />;
  }

  if (loading && !data) {
    return <LoadingPage />;
  }

  return (
    <PageWrapper
      title="Plaid Institutions"
      description={`${data?.plaidInstitutionsCount || 0} supported institutions`}
      cornerElement={
        <Button
          onClick={handleRefresh}
          disabled={refreshing}
          variant="outline"
          size="sm"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      }
    >
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="flex gap-2">
          <Input
            placeholder="Search institutions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {institutions.map((institution) => (
            <Card
              key={institution.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() =>
                router.push(
                  TypedRoutes.institution({ institutionId: institution.institutionId })
                )
              }
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {institution.logo ? (
                      <img
                        src={institution.logo}
                        alt={institution.name}
                        className="h-8 w-8 rounded"
                      />
                    ) : (
                      <Building2 className="h-8 w-8 text-muted-foreground" />
                    )}
                  </div>
                  <Badge variant={institution.oauth ? 'default' : 'secondary'}>
                    {institution.oauth ? 'OAuth' : 'Credentials'}
                  </Badge>
                </div>
                <CardTitle className="text-base mt-2 line-clamp-2">
                  {institution.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Products</span>
                    <span className="font-medium">{institution.products.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Countries</span>
                    <div className="flex gap-1">
                      {institution.countryCode.map((code) => (
                        <Badge key={code} variant="outline" className="text-xs">
                          {code}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                    Last synced: {new Date(institution.lastSyncedAt).toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {institutions.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No institutions found. Try adjusting your search.
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
```

### Success Criteria:

#### Automated Verification:
- [ ] TypeScript compiles: `pnpm --filter @repo/web check:types`
- [ ] Web builds: `pnpm --filter @repo/web build`
- [ ] No React errors during build

#### Manual Verification:
- [ ] Page loads at `/main/admin/institutions`
- [ ] Institutions display in bento grid (3-4 columns on desktop)
- [ ] Cards show institution name, logo, OAuth badge, product count, country codes
- [ ] Search bar filters institutions by name
- [ ] Clicking card navigates to detail page
- [ ] Refresh button triggers mutation and refetches data
- [ ] Loading state shows while refreshing
- [ ] Toast notifications appear on refresh success/error
- [ ] Empty state shows when no results
- [ ] Responsive layout works on mobile (1 column)

---

## Phase 8: Frontend Detail Page

### Overview
Create the institution detail page showing comprehensive information with tabs/cards.

### Changes Required:

#### 1. Create Detail Page Directory
**Command**:
```bash
mkdir -p apps/web/app/main/admin/institutions/[institutionId]
```

#### 2. Institution Detail Page Component
**File**: `apps/web/app/main/admin/institutions/[institutionId]/page.tsx`
**Changes**: Create new client component

```typescript
'use client';

import { Badge } from '@repo/ui/components/badge';
import { Button } from '@repo/ui/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@repo/ui/components/tabs';
import {
  ArrowLeft,
  Building2,
  CheckCircle,
  Copy,
  ExternalLink,
  XCircle,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { use } from 'react';
import ReactJson from 'react-json-view';
import { toast } from 'sonner';

import { usePlaidInstitutionQuery } from '~/generated/gql';
import { TypedRoutes } from '~/lib/routes';
import { PageWrapper } from '~/modules/layout';
import { ErrorPage, LoadingPage } from '~/modules/utility-components';

export default function InstitutionDetailPage(props: {
  params: Promise<typeof TypedRoutes.institution.params>;
}) {
  const router = useRouter();
  const params = use(props.params);
  const safeParams = TypedRoutes.institution.parse(params);

  const { data, error, loading } = usePlaidInstitutionQuery({
    variables: { institutionId: safeParams.institutionId },
  });

  if (loading) {
    return <LoadingPage />;
  }

  if (error || !data?.plaidInstitution) {
    return <ErrorPage message="Failed to load institution" />;
  }

  const institution = data.plaidInstitution;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'HEALTHY':
        return 'text-green-600';
      case 'DEGRADED':
        return 'text-yellow-600';
      case 'DOWN':
        return 'text-red-600';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'HEALTHY':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'DEGRADED':
      case 'DOWN':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  return (
    <PageWrapper
      title={institution.name}
      description={
        <div className="flex items-center gap-4">
          <Button
            onClick={() => router.push(TypedRoutes.institutions())}
            variant="outline"
            size="sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to List
          </Button>
          <span className="text-sm text-muted-foreground">
            ID: {institution.institutionId}
          </span>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Header Card */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                {institution.logo ? (
                  <img
                    src={institution.logo}
                    alt={institution.name}
                    className="h-16 w-16 rounded"
                  />
                ) : (
                  <Building2 className="h-16 w-16 text-muted-foreground" />
                )}
                <div>
                  <CardTitle className="text-2xl">{institution.name}</CardTitle>
                  {institution.url && (
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <a
                        href={institution.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        {institution.url}
                      </a>
                      <ExternalLink className="h-3 w-3" />
                    </CardDescription>
                  )}
                </div>
              </div>
              <Badge variant={institution.oauth ? 'default' : 'secondary'}>
                {institution.oauth ? 'OAuth' : 'Credentials'}
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Country Codes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-1 flex-wrap">
                {institution.countryCode.map((code) => (
                  <Badge key={code} variant="outline">
                    {code}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{institution.products.length}</div>
              <p className="text-sm text-muted-foreground mt-1">
                Supported products
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Routing Numbers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {institution.routingNumbers.length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">DTC Numbers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {institution.dtcNumbers.length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Products List */}
        <Card>
          <CardHeader>
            <CardTitle>Supported Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 flex-wrap">
              {institution.products.map((product) => (
                <Badge key={product} variant="secondary">
                  {product}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Status Information */}
        {institution.status && typeof institution.status === 'object' && (
          <Card>
            <CardHeader>
              <CardTitle>Product Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(institution.status).map(([key, value]: [string, any]) => (
                  <div key={key} className="border-b pb-3 last:border-b-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(value.status)}
                        <span className="font-medium capitalize">
                          {key.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <Badge
                        variant={
                          value.status === 'HEALTHY'
                            ? 'default'
                            : value.status === 'DEGRADED'
                              ? 'secondary'
                              : 'destructive'
                        }
                      >
                        {value.status}
                      </Badge>
                    </div>
                    {value.breakdown && (
                      <div className="text-sm text-muted-foreground space-y-1 ml-6">
                        <div>
                          Success: {((value.breakdown.success || 0) * 100).toFixed(1)}%
                        </div>
                        {value.breakdown.error_plaid && (
                          <div>
                            Plaid Errors:{' '}
                            {((value.breakdown.error_plaid || 0) * 100).toFixed(1)}%
                          </div>
                        )}
                        {value.breakdown.error_institution && (
                          <div>
                            Institution Errors:{' '}
                            {((value.breakdown.error_institution || 0) * 100).toFixed(1)}%
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabs for Additional Data */}
        <Tabs defaultValue="routing" className="w-full">
          <TabsList>
            <TabsTrigger value="routing">Routing Numbers</TabsTrigger>
            <TabsTrigger value="dtc">DTC Numbers</TabsTrigger>
            <TabsTrigger value="raw">Raw Data</TabsTrigger>
          </TabsList>

          <TabsContent value="routing">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Routing Numbers</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    copyToClipboard(institution.routingNumbers.join(', '))
                  }
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy All
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-2">
                  {institution.routingNumbers.map((number) => (
                    <Badge key={number} variant="outline">
                      {number}
                    </Badge>
                  ))}
                </div>
                {institution.routingNumbers.length === 0 && (
                  <p className="text-muted-foreground">No routing numbers available</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dtc">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>DTC Numbers</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(institution.dtcNumbers.join(', '))}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy All
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-2">
                  {institution.dtcNumbers.map((number) => (
                    <Badge key={number} variant="outline">
                      {number}
                    </Badge>
                  ))}
                </div>
                {institution.dtcNumbers.length === 0 && (
                  <p className="text-muted-foreground">No DTC numbers available</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="raw">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Raw JSON Data</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    copyToClipboard(JSON.stringify(institution.raw, null, 2))
                  }
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy JSON
                </Button>
              </CardHeader>
              <CardContent>
                {institution.raw ? (
                  <ReactJson
                    src={institution.raw}
                    theme="monokai"
                    collapsed={2}
                    displayDataTypes={false}
                    enableClipboard={false}
                  />
                ) : (
                  <p className="text-muted-foreground">No raw data available</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Metadata */}
        <Card>
          <CardHeader>
            <CardTitle>Metadata</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-muted-foreground">Created At:</span>
                <p>{new Date(institution.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Updated At:</span>
                <p>{new Date(institution.updatedAt).toLocaleString()}</p>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Last Synced:</span>
                <p>{new Date(institution.lastSyncedAt).toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
}
```

### Success Criteria:

#### Automated Verification:
- [ ] TypeScript compiles: `pnpm --filter @repo/web check:types`
- [ ] Web builds: `pnpm --filter @repo/web build`
- [ ] No React errors during build

#### Manual Verification:
- [ ] Page loads at `/main/admin/institutions/[institutionId]`
- [ ] Header shows institution name, logo, URL, and OAuth badge
- [ ] Overview cards display country codes, product count, routing/DTC counts
- [ ] Products list shows all supported products as badges
- [ ] Product status section shows health status with color coding
- [ ] Status breakdown shows percentages for success/errors
- [ ] Tabs allow switching between routing numbers, DTC numbers, and raw JSON
- [ ] Copy buttons work for routing numbers, DTC numbers, and JSON
- [ ] ReactJson displays raw data with syntax highlighting
- [ ] Metadata card shows created/updated/synced timestamps
- [ ] Back button navigates to list page
- [ ] Responsive layout works on mobile

---

## Testing Strategy

### Unit Tests
- **PlaidInstitutionService**: Test findMany, findOne, count methods with mocked PrismaService
- **PlaidService**: Test getInstitutions and refreshAllInstitutions with mocked Plaid client
- **CronTasksService**: Test refreshPlaidInstitutions with mocked PlaidService

### Integration Tests
- **GraphQL Queries**: Test plaidInstitutions, plaidInstitution, plaidInstitutionsCount queries
- **GraphQL Mutations**: Test adminRefreshPlaidInstitutions mutation
- **Admin Authorization**: Verify AdminGuard blocks non-admin users

### Manual Testing Steps
1. **Initial Setup**:
   - Run migration: `cd apps/api && pnpm prisma migrate dev`
   - Trigger manual refresh: Execute `adminRefreshPlaidInstitutions` mutation in GraphQL playground
   - Verify institutions are synced to database
2. **List Page**:
   - Navigate to `/main/admin/institutions` as admin
   - Verify bento grid displays institutions
   - Test search filtering
   - Test refresh button
   - Click card and verify navigation to detail page
3. **Detail Page**:
   - Verify all sections render correctly
   - Test tab switching
   - Test copy buttons
   - Verify ReactJson displays raw data
   - Test back button navigation
4. **Cron Job**:
   - Temporarily set schedule to `*/5 * * * *` (every 5 minutes)
   - Check logs for sync execution
   - Verify database updates after sync
   - Restore original schedule
5. **Error Handling**:
   - Test with invalid institution ID
   - Test API errors (disable network)
   - Verify error pages display

## Performance Considerations

### Backend
- **Pagination**: Plaid API requests use batch size of 100 institutions
- **Rate Limiting**: 100ms delay between batch requests to avoid rate limits
- **Database**: Batch upserts using Prisma transactions (100 per transaction)
- **Indexing**: Name and lastSyncedAt indexes for efficient queries

### Frontend
- **Query Optimization**: Use PrismaSelect to limit fields returned
- **Caching**: Apollo Client caches query results
- **Loading States**: Show loading indicators during data fetch
- **Search**: Client-side filtering with GraphQL where clause (could add debouncing if needed)

## Migration Notes

### Initial Data Sync
- Run `adminRefreshPlaidInstitutions` mutation after deployment to populate database
- Cron job will keep data fresh nightly
- Initial sync may take 2-5 minutes for ~11,000 institutions

### Database Cleanup
- No special cleanup needed - cron job handles updates
- To re-sync from scratch: `DELETE FROM "PlaidInstitution"` then run refresh mutation

## References

- **Plaid API Docs**: https://plaid.com/docs/api/institutions/#institutionsget
- **Existing Admin Pages**: `apps/web/app/main/admin/logs/page.tsx`, `apps/web/app/main/admin/plaid-history/page.tsx`
- **Cron Task Pattern**: `apps/api/src/cron-tasks/cron-tasks.service.ts:30-100`
- **Plaid Service**: `apps/api/src/plaid/plaid.service.ts:102-1363`
- **Prisma Schema**: `apps/api/prisma/schema.prisma`
- **Admin Guard**: `apps/api/src/auth/guards/admin.guard.ts`
