# Plaid Institutions Admin Portal - Requirements

## Overview
Create an admin-only portal to view and monitor supported Plaid financial institutions. This feature will provide visibility into which institutions are available for user connections and their current status.

## User Story
As an admin, I want to view all supported Plaid institutions in a bento-style card grid so that I can quickly see which banks and brokerages are available, and click into individual institutions to see detailed information about their supported products, status, and configuration.

## Functional Requirements

### 1. Navigation
- Add a new navigation item in the Admin section of the nav tree
- Title: "Institutions"
- Icon: Building2 or Landmark (from lucide-react)
- Route: `/main/admin/institutions`
- Restricted to admin users only

### 2. List View (Institutions Summary Page)
- Display institutions in a bento/card grid layout (responsive: 1 column mobile, 3-4 columns desktop)
- Each card should show:
  - Institution name
  - Institution logo (if available from Plaid)
  - Primary color/branding (if available)
  - Country codes (e.g., "US")
  - OAuth status (badge: "OAuth" or "Credentials")
  - Product count (e.g., "6 products")
  - Overall health status indicator (color-coded based on status)
- Cards should be clickable and navigate to detail page
- Support search/filter by institution name
- Display total institution count
- Loading states while fetching data
- Error handling for failed API calls

### 3. Detail View (Institution Detail Page)
- Route: `/main/admin/institutions/[institutionId]`
- Display comprehensive institution information:
  - Header section:
    - Institution name (title)
    - Logo
    - Primary/secondary colors
    - URL (if available)
  - Overview cards (grid layout):
    - Country codes
    - OAuth status
    - DTC numbers count
    - Routing numbers count
  - Supported products list (badges)
  - Product status breakdown:
    - For each product (auth, transactions, identity, investments, etc.):
      - Status (HEALTHY, DEGRADED, DOWN)
      - Last status change timestamp
      - Success/error breakdown percentages
      - Error breakdown by type (Plaid vs Institution errors)
  - Raw data section (collapsible/tabs):
    - Full JSON response from Plaid API
- Back button to return to list view
- Refresh button to re-fetch institution data

## Data Requirements

### 1. Database Model
Create a single Prisma model to store institution data:
- `PlaidInstitution` model with fields:
  - `id` (String, UUID, primary key)
  - `institutionId` (String, unique - from Plaid)
  - `name` (String)
  - `countryCode` (String[] - array of country codes)
  - `url` (String?, optional)
  - `primaryColor` (String?, optional)
  - `logo` (String?, optional - URL or base64)
  - `oauth` (Boolean)
  - `products` (String[] - array of product names)
  - `routingNumbers` (String[] - array)
  - `dtcNumbers` (String[] - array)
  - `status` (Json - JSONB field for nested status data)
  - `raw` (Json? - JSONB field for complete API response, optional)
  - `createdAt` (DateTime)
  - `updatedAt` (DateTime)
  - `lastSyncedAt` (DateTime - when data was last fetched from Plaid)

### 2. Plaid API Integration
- Endpoint: `POST https://sandbox.plaid.com/institutions/get` (or production equivalent)
- Request parameters:
  - `client_id`: From environment variable
  - `secret`: From environment variable
  - `count`: Number of institutions to fetch per request (e.g., 100)
  - `offset`: For pagination
  - `country_codes`: Array of country codes (start with ["US"])
- Response: Array of institution objects with nested status data
- Pagination: Handle `total` field in response to fetch all institutions

## Technical Requirements

### 1. Backend (API)

#### Prisma Schema
- Add `PlaidInstitution` model to schema.prisma
- Create migration

#### Cron Task
- Location: `apps/api/src/cron-tasks/cron-tasks.service.ts`
- Schedule: Nightly (e.g., `CronExpression.EVERY_DAY_AT_3AM`)
- Function name: `refreshPlaidInstitutions()`
- Logic:
  1. Call Plaid API to fetch institutions (paginated)
  2. Upsert institutions to database (based on `institutionId`)
  3. Update `lastSyncedAt` timestamp
  4. Log sync status and any errors

#### Plaid Service Integration
- Location: `apps/api/src/plaid/plaid.service.ts`
- Add method: `getInstitutions(params: { count: number, offset: number, countryCodes: string[] })`
- Add method: `refreshAllInstitutions()` - handles pagination and upsertion
- Use existing Plaid client configuration
- Error handling and logging to database

#### GraphQL API
- Create `PlaidInstitutionModule` with:
  - Service: `PlaidInstitutionService`
  - Resolver: `PlaidInstitutionResolver`
- Queries:
  - `plaidInstitutions(where: PlaidInstitutionWhereInput): [PlaidInstitution!]!` - list query with filtering
  - `plaidInstitution(institutionId: String!): PlaidInstitution` - detail query
  - `plaidInstitutionsCount: Int!` - total count
- Mutations (admin-only):
  - `adminRefreshPlaidInstitutions: Boolean!` - manual trigger for cron task
- Both queries and mutations protected by `@UseGuards(AdminGuard)`
- Use `rlsBypassClient()` for admin queries (no portfolio scoping)

### 2. Frontend (Web)

#### Navigation
- File: `apps/web/app/main/nav-tree.tsx`
- Add to Admin section NavGroup
- Import Building2 or Landmark icon from lucide-react

#### Routes
- File: `apps/web/lib/routes.ts`
- Add typed routes:
  - `institutions: makeRoute(() => '/main/admin/institutions')`
  - `institution: makeRoute(({ institutionId }) => '/main/admin/institutions/${institutionId}', z.object({ institutionId: z.string() }))`

#### GraphQL Queries
- File: `apps/web/app/main/admin/institutions/institutions.gql`
- Define fragments and queries:
  - Fragment: `PlaidInstitutionSummary` (fields for card display)
  - Fragment: `PlaidInstitutionDetail` (all fields including status)
  - Query: `PlaidInstitutions` (list)
  - Query: `PlaidInstitution(institutionId)` (detail)

#### List Page Component
- File: `apps/web/app/main/admin/institutions/page.tsx`
- Client component with `'use client'` directive
- Use `usePlaidInstitutionsQuery()` hook
- Bento grid layout with DataCard or custom Card components
- Search/filter functionality
- Loading and error states
- Navigate to detail on card click

#### Detail Page Component
- File: `apps/web/app/main/admin/institutions/[institutionId]/page.tsx`
- Client component with async params (`use()` hook)
- Use `usePlaidInstitutionQuery()` hook with institutionId variable
- Card grid for overview metrics
- Tabs or expandable sections for product status
- ReactJson component for raw data display
- Back button to list page

## Non-Functional Requirements

### Performance
- Nightly cron job should handle pagination efficiently (batch size: 100 institutions)
- Add rate limiting delays between API requests if needed (100ms-1s)
- Frontend list page should handle 10,000+ institutions efficiently (virtual scrolling or pagination)

### Security
- All endpoints protected by AdminGuard
- No portfolio-level scoping (bypass RLS for admin queries)
- Plaid API credentials stored in environment variables only

### Monitoring
- Log all Plaid API calls to database Log table
- Track sync success/failure in cron job logs
- Manual refresh mutation for testing/troubleshooting

### Data Freshness
- Update institution data nightly
- Display `lastSyncedAt` timestamp on UI
- Manual refresh option for admins

## Success Criteria

### Automated Verification
- [ ] Database migration applies cleanly: `pnpm --filter @repo/api prisma migrate dev`
- [ ] Type checking passes: `pnpm --filter @repo/web check:types`
- [ ] Type checking passes: `pnpm --filter @repo/api check:types`
- [ ] GraphQL schema generates: `pnpm codegen`
- [ ] API builds: `pnpm --filter @repo/api build`
- [ ] Web builds: `pnpm --filter @repo/web build`

### Manual Verification
- [ ] Navigation item appears in Admin section for admin users
- [ ] List page displays institutions in bento grid layout
- [ ] Cards show institution name, logo, status, and key metrics
- [ ] Clicking a card navigates to detail page
- [ ] Detail page shows comprehensive institution information
- [ ] Product status breakdown is clearly displayed
- [ ] Raw JSON data is viewable in detail page
- [ ] Cron job successfully syncs institutions nightly
- [ ] Manual refresh mutation works and updates data
- [ ] Search/filter functionality works on list page
- [ ] Loading and error states display correctly
- [ ] UI is responsive on mobile and desktop

## Out of Scope
- Editing or modifying institution data
- Deleting institutions
- Institution-specific configuration or overrides
- Real-time status monitoring (only nightly refresh)
- Historical status tracking or trending
- Institution comparison features
- Export functionality
- User-facing institution directory (admin-only feature)

## Dependencies
- Plaid API access and valid credentials
- Existing admin authentication system (Clerk + AdminGuard)
- Existing Prisma database and migration system
- Existing cron task infrastructure
- Existing GraphQL and Apollo setup

## Notes
- Start with US institutions only (`country_codes: ["US"]`)
- Can expand to other countries in future iterations
- Consider adding search index on institution name if performance becomes an issue
- Logo/color data may not be available for all institutions - handle gracefully
- Some institutions may have incomplete status data - use optional chaining
