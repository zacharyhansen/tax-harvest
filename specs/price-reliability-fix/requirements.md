# Price Reliability Fix - Requirements

## Problem Statement

Portfolio total value intermittently displays as $0, approximately 2x per week. The issue appears to be related to the Polygon.io price fetching service and typically resolves itself. This causes user confusion and loss of trust in the platform.

**Linear Ticket**: IGO-147
**Affected Account**: "Porto" account (and potentially others)
**Frequency**: ~2x per week
**Current Behavior**: Self-resolves after some time
**User Impact**: Critical - shows portfolio as worthless when prices fail to update

## Root Cause Analysis

Based on codebase analysis, the $0 value issue can occur in several scenarios:

### 1. **New Assets Without Price Updates**
- **Location**: `apps/api/src/lot/lot.service.ts:39-49`
- When lots are uploaded for new asset symbols, assets are created with default `lastPrice = 0`
- Up to 15-minute window before next cron job updates the price
- Database view calculates `value = remainingQty × 0 = $0`

### 2. **Polygon API Failures**
- **Location**: `apps/api/src/cron-tasks/cron-tasks.service.ts:19-24`
- Cron job runs every 15 minutes but has no try-catch error handling
- If API call fails, errors are logged but no retry occurs
- Asset prices remain at previous values (potentially $0)

### 3. **Missing Ticker Data from Polygon**
- **Location**: `apps/api/src/polygon/polygon.service.ts:220-237`
- When `tickerData.day?.c` is undefined, `lastPrice` becomes undefined
- Database insert uses schema default of 0
- No validation that price data is valid

### 4. **Asset Symbol Mismatch**
- **Location**: Database view at `apps/api/prisma/migrations/20250721045431_rls_policy/migration.sql:55`
- LEFT JOIN between Lot and Asset tables
- If `assetSymbol` doesn't exist in Asset table, `COALESCE("Asset"."lastPrice", 0)` returns 0

### 5. **Stale/Invalid Price Data**
- Polygon may return legitimate 0 values or stale data
- System has no way to detect invalid prices
- `lastUpdated` timestamp is set even when price is invalid

## Current Architecture

### Price Update Flow
```
Cron Job (every 15 min)
  → polygonService.updateAllAssetPrices()
  → Polygon API: snapshotAllTickers()
  → Batch update Asset table (100 at a time)
  → Set Asset.lastPrice = tickerData.day?.c

User requests portfolio summary
  → Query LotCurrent view (Lot LEFT JOIN Asset)
  → View calculates: value = remainingQty × Asset.lastPrice
  → Aggregate lots to get total portfolio value
  → Display in frontend
```

### Key Components
- **Price Service**: `apps/api/src/polygon/polygon.service.ts`
- **Cron Jobs**: `apps/api/src/cron-tasks/cron-tasks.service.ts`
- **Database View**: `LotCurrent` view joins Lot with Asset
- **Frontend**: `apps/web/modules/harvest/HarvestSummaryCards.tsx`

## Requirements

### Functional Requirements

#### FR-1: Price Update Reliability
- Price updates MUST succeed >99.9% of the time
- Failed price updates MUST be retried automatically
- Critical failures MUST trigger alerts to development team

#### FR-2: Graceful Degradation
- When current price is unavailable, system MUST display last known good price
- System MUST indicate when displayed price is stale (e.g., ">24 hours old")
- Total portfolio value MUST never display as $0 when holdings exist

#### FR-3: Price Data Validation
- System MUST validate that price data is reasonable before storing
- Prices of $0 MUST be rejected for active, trading securities
- System MUST detect and handle missing price data from Polygon API

#### FR-4: Error Visibility
- Developers MUST be notified when price updates fail
- Users MUST see indication when prices are stale
- Admin panel MUST show price update health metrics

#### FR-5: New Asset Handling
- Newly created assets MUST attempt immediate price fetch
- If immediate fetch fails, system MUST use fallback mechanism
- Users MUST see indication when prices are pending for new assets

### Non-Functional Requirements

#### NFR-1: Performance
- Price updates MUST complete within 5 minutes for all assets
- Batch processing MUST not exceed database connection pool limits
- Price staleness checks MUST not impact query performance

#### NFR-2: Observability
- System MUST log all price update attempts with success/failure status
- System MUST track metrics: update duration, success rate, failed tickers
- Logs MUST include sufficient context for debugging (ticker, error, timestamp)

#### NFR-3: Maintainability
- Solution MUST follow existing codebase patterns
- Code MUST include JSDoc comments with examples
- Configuration MUST be adjustable via environment variables

## Constraints

1. **External API**: Must continue using Polygon.io (existing subscription)
2. **Database**: Cannot change existing schema (migration complexity)
3. **Cron Schedule**: 15-minute update interval must be maintained
4. **Backward Compatibility**: Existing queries must continue to work

## Out of Scope

1. Adding alternative price data providers (future enhancement)
2. Real-time price updates (current 15-min interval is acceptable)
3. Historical price data backfilling
4. Price data caching layer (Redis, etc.)
5. Changing database schema or LotCurrent view definition

## Success Criteria

### Automated Verification
- [ ] All TypeScript types pass: `pnpm check:types`
- [ ] All linting passes: `pnpm lint`
- [ ] Unit tests for retry logic pass
- [ ] Unit tests for price validation pass

### Manual Verification
- [ ] Portfolio value never displays $0 when holdings exist
- [ ] Stale price indicator appears when prices are >24 hours old
- [ ] Failed price updates generate alerts
- [ ] New assets fetch prices within 1 minute of creation
- [ ] Admin panel shows price update metrics

### Acceptance Criteria
- [ ] Run in production for 2 weeks with zero $0 portfolio value incidents
- [ ] Price update success rate >99.5% measured over 2 weeks
- [ ] No user-reported issues related to missing prices

## Assumptions

1. Polygon API failures are transient (not prolonged outages)
2. Most price update failures can be resolved with retry
3. Users can tolerate slightly stale prices (up to 24 hours) better than $0
4. Development team can respond to alerts within 1 hour during business hours

## Open Questions

None - all questions resolved through code analysis.

## References

- Linear Issue: [IGO-147](https://linear.app/harvester/issue/IGO-147/total-value-=-dollar0)
- Price Service: `apps/api/src/polygon/polygon.service.ts`
- Database View: `apps/api/prisma/migrations/20250721045431_rls_policy/migration.sql`
- Cron Tasks: `apps/api/src/cron-tasks/cron-tasks.service.ts`
