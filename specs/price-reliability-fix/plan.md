# Price Reliability Fix - Implementation Plan

## Overview

Fix the intermittent "total value = $0" issue by rejecting price updates from Polygon.io when the price is 0 or undefined. This ensures the database retains the last known good price instead of overwriting with invalid data.

## Current State Analysis

**Problem**: Portfolio displays $0 total value ~2x per week when Polygon API returns invalid price data (0 or undefined).

**Root Cause**: The `updateAllAssetPrices()` method in `apps/api/src/polygon/polygon.service.ts:207-256` accepts any price value from Polygon, including 0 or undefined, and overwrites existing prices in the database.

**Current Flow**:
```
Cron Job (every 15 min) → Polygon API → Batch update Asset table
→ If tickerData.day?.c is 0 or undefined → Asset.lastPrice = 0
→ LotCurrent view: value = remainingQty × 0 = $0
```

**Key Files**:
- `apps/api/src/polygon/polygon.service.ts:207-256` - Price update logic
- `apps/api/src/cron-tasks/cron-tasks.service.ts:19-24` - Cron job trigger
- `apps/api/prisma/schema.prisma:780-830` - Asset model with price fields

## Desired End State

When Polygon returns a price of 0 or undefined for an active asset:
- The price update is **skipped** for that asset
- The existing `lastPrice` in the database is **retained** (stale price preserved)
- A **warning is logged** with the ticker symbol and invalid price
- Valid prices continue to be updated normally

**Verification**:
- Run the cron job and check logs show warnings for any 0 prices
- Verify database prices don't change when 0 is returned from API
- Confirm portfolio value remains stable even with API returning invalid data

## What We're NOT Doing

1. Adding retry logic (not necessary - just skip bad updates)
2. Adding monitoring/alerting system (can be added later)
3. Changing database schema or LotCurrent view
4. Adding UI indicators for stale prices (future enhancement)
5. Handling other edge cases (negative prices, extreme outliers)
6. Adding comprehensive error handling to cron job (out of scope)

## Implementation Approach

Simple filter-based approach: Before batch inserting/updating assets, filter out any ticker data where `tickerData.day?.c` is missing, 0, or undefined. Log warnings for filtered items so we have visibility into data quality issues.

This is the minimal change that solves the user's problem: keep stale prices rather than overwrite with 0.

## Phase 1: Add Price Validation Filter

### Overview
Modify the `updateAllAssetPrices()` method to filter out invalid price data before database operations.

### Changes Required

#### 1. polygon.service.ts
**File**: `apps/api/src/polygon/polygon.service.ts`

**Changes at lines 207-256**:

1. **Add validation helper method** (add after line 206):
```typescript
/**
 * Validates that ticker data contains a valid price
 * @param tickerData Polygon ticker snapshot data
 * @returns true if price is valid (> 0 and not undefined)
 * @example
 * isValidPrice({ ticker: 'AAPL', day: { c: 150.25 } }) // returns true
 * isValidPrice({ ticker: 'AAPL', day: { c: 0 } }) // returns false
 * isValidPrice({ ticker: 'AAPL', day: {} }) // returns false
 */
private isValidPrice(tickerData: ITickerSnapshot): boolean {
  const closePrice = tickerData.day?.c;
  return closePrice !== undefined && closePrice !== null && closePrice > 0;
}
```

2. **Filter invalid prices before mapping** (modify lines 214-237):
```typescript
for (let i = 0; i < tickers.length; i += batchSize) {
  const batch = tickers.slice(i, i + batchSize);

  // Separate valid and invalid tickers
  const validTickers: typeof batch = [];
  const invalidTickers: typeof batch = [];

  for (const tickerData of batch) {
    if (!tickerData.ticker) {
      continue; // Skip if no symbol
    }

    if (this.isValidPrice(tickerData)) {
      validTickers.push(tickerData);
    } else {
      invalidTickers.push(tickerData);
      this.logger.warn(
        `Skipping price update for ${tickerData.ticker}: ` +
        `invalid price (${tickerData.day?.c}). Retaining existing price.`
      );
    }
  }

  // Only proceed if we have valid tickers to update
  if (validTickers.length === 0) {
    continue;
  }

  await this.db
    .insertInto('Asset')
    .values(
      validTickers.map((tickerData) => {
        return {
          lastClose: tickerData.day?.c,
          lastHigh: tickerData.day?.h,
          lastLow: tickerData.day?.l,
          lastOpen: tickerData.day?.o,
          lastPrice: tickerData.day?.c,
          lastUpdated: tickerData.updated
            ? new Date(tickerData.updated / 1000)
            : new Date(),
          lastVolume: tickerData.day?.v,
          lastVolumeWeighted: tickerData.day?.vw,
          symbol: tickerData.ticker ?? '',
          todaysChange: tickerData.todaysChange,
          todaysChangePerc: tickerData.todaysChangePerc,
        };
      })
    )
    .onConflict((oc) =>
      oc.column('symbol').doUpdateSet((eb) => ({
        lastClose: eb.ref('excluded.lastClose'),
        lastHigh: eb.ref('excluded.lastHigh'),
        lastLow: eb.ref('excluded.lastLow'),
        lastOpen: eb.ref('excluded.lastOpen'),
        lastPrice: eb.ref('excluded.lastPrice'),
        lastUpdated: eb.ref('excluded.lastUpdated'),
        lastVolume: eb.ref('excluded.lastVolume'),
        lastVolumeWeighted: eb.ref('excluded.lastVolumeWeighted'),
        todaysChange: eb.ref('excluded.todaysChange'),
        todaysChangePerc: eb.ref('excluded.todaysChangePerc'),
      })),
    )
    .execute();
}

// Log summary at the end
this.logger.log(
  `Price update complete: ${tickers.length - invalidTickers.length} valid, ` +
  `${invalidTickers.length} skipped (invalid prices)`
);
```

**Note**: The summary logging needs to be done outside the loop. You'll need to track `invalidTickers` count across batches.

**Better implementation**: Track counts across batches:
```typescript
let validCount = 0;
let invalidCount = 0;

for (let i = 0; i < tickers.length; i += batchSize) {
  const batch = tickers.slice(i, i + batchSize);
  const validTickers: typeof batch = [];

  for (const tickerData of batch) {
    if (!tickerData.ticker) {
      continue;
    }

    if (this.isValidPrice(tickerData)) {
      validTickers.push(tickerData);
      validCount++;
    } else {
      invalidCount++;
      this.logger.warn(
        `Skipping price update for ${tickerData.ticker}: ` +
        `invalid price (${tickerData.day?.c}). Retaining existing price.`
      );
    }
  }

  if (validTickers.length === 0) {
    continue;
  }

  // ... database operation with validTickers
}

this.logger.log(
  `Price update complete: ${validCount} updated, ${invalidCount} skipped`
);
```

### Success Criteria

#### Automated Verification:
- [ ] TypeScript compilation passes: `pnpm check:types`
- [ ] Linting passes: `pnpm lint`
- [ ] Code builds successfully: `pnpm build --filter=api`

#### Manual Verification:
1. **Test with mock data**:
   - Temporarily modify code to inject 0 prices for a few tickers
   - Run the update method
   - Verify: Database prices unchanged for those tickers
   - Verify: Warning logs appear for each skipped ticker

2. **Test in development**:
   - Wait for next cron job execution (or trigger manually via GraphQL)
   - Check logs for any warnings about invalid prices
   - Query database to confirm prices weren't overwritten with 0
   - Verify portfolio values remain correct

3. **Edge cases**:
   - Test with tickerData.day = undefined (should skip)
   - Test with tickerData.day.c = 0 (should skip)
   - Test with tickerData.day.c = null (should skip)
   - Test with tickerData.day.c = -0.01 (should skip - negative)
   - Test with tickerData.day.c = 0.01 (should accept - valid penny stock)

## Phase 2: Add Basic Error Handling to Cron Job (Optional but Recommended)

### Overview
Wrap the cron job in try-catch to prevent unhandled exceptions from stopping future executions.

### Changes Required

#### 1. cron-tasks.service.ts
**File**: `apps/api/src/cron-tasks/cron-tasks.service.ts`

**Changes at lines 19-24**:
```typescript
@Cron('*/15 * * * *', { name: 'update_asset_last_price' })
async updateAssetsLastPrice() {
  try {
    this.logger.log(`Updating all asset prices`);
    await this.polygonService.updateAllAssetPrices();
    this.logger.log(`Updated all asset prices`);
  } catch (error) {
    this.logger.error('Failed to update asset prices:', error);
    // Don't throw - let cron continue to run on schedule
  }
}
```

### Success Criteria

#### Automated Verification:
- [ ] TypeScript compilation passes: `pnpm check:types`
- [ ] Linting passes: `pnpm lint`

#### Manual Verification:
- [ ] Temporarily inject an error in `updateAllAssetPrices()`
- [ ] Verify error is logged but cron job doesn't crash
- [ ] Verify next scheduled execution still runs

## Testing Strategy

### Unit Tests (Optional - can add later)

**File**: `apps/api/src/polygon/polygon.service.spec.ts` (create if doesn't exist)

```typescript
describe('PolygonService', () => {
  describe('isValidPrice', () => {
    it('should return true for valid prices', () => {
      const service = // ... initialize service
      expect(service.isValidPrice({ day: { c: 150.25 } })).toBe(true);
      expect(service.isValidPrice({ day: { c: 0.01 } })).toBe(true);
    });

    it('should return false for zero prices', () => {
      expect(service.isValidPrice({ day: { c: 0 } })).toBe(false);
    });

    it('should return false for undefined prices', () => {
      expect(service.isValidPrice({ day: {} })).toBe(false);
      expect(service.isValidPrice({ day: { c: undefined } })).toBe(false);
    });

    it('should return false for null prices', () => {
      expect(service.isValidPrice({ day: { c: null } })).toBe(false);
    });
  });
});
```

### Manual Testing Steps

1. **Setup test environment**:
   ```bash
   # Run local dev environment
   pnpm dev
   ```

2. **Monitor next cron execution**:
   - Wait for next 15-minute interval
   - OR trigger manually via GraphQL mutation:
   ```graphql
   mutation {
     updateAllAssetPrices
   }
   ```

3. **Verify logs**:
   ```bash
   # Look for warning messages in logs
   grep "Skipping price update" logs/api.log
   ```

4. **Check database**:
   ```sql
   -- Find assets with lastPrice = 0 and recent lastUpdated
   SELECT symbol, lastPrice, lastUpdated
   FROM "Asset"
   WHERE lastPrice = 0
   AND lastUpdated > NOW() - INTERVAL '1 hour'
   ORDER BY lastUpdated DESC;
   ```
   - Should see NO results (0 prices shouldn't be updated)

5. **Simulate invalid data**:
   - Temporarily add test code before the API call:
   ```typescript
   // TEST CODE - REMOVE AFTER TESTING
   if (tickers[0]) {
     tickers[0].day = { c: 0 };
     this.logger.log(`TEST: Injected 0 price for ${tickers[0].ticker}`);
   }
   ```
   - Run update, verify warning logged
   - Verify database price unchanged for that ticker
   - Remove test code

## Performance Considerations

**Impact**: Minimal
- Added filter operation is O(n) where n = number of tickers (~500 for S&P 500)
- Additional logging only for invalid prices (expected to be rare)
- No additional database queries
- Batch size remains 100, no change to database load

**Memory**: No significant increase (just a few extra arrays for filtering)

## Migration Notes

No database migration required. This is a code-only change that modifies data processing logic.

**Deployment**:
1. Deploy code changes to production
2. Monitor logs for next few cron executions
3. Verify no $0 portfolio value incidents

**Rollback**: Simply revert the code changes if issues occur. No data cleanup needed.

## Monitoring & Observability

**After deployment, monitor**:
1. **Warning frequency**: How often are invalid prices being skipped?
   - If very frequent: Investigate Polygon API issues
   - If rare: Expected behavior for delisted/inactive stocks

2. **Cron job success rate**: Check logs for any errors in price updates

3. **User reports**: Track Linear issues related to $0 portfolio values
   - Should drop to zero after deployment

**Metrics to track** (manual for now):
```bash
# Count invalid price warnings per day
grep "Skipping price update" logs/api-$(date +%Y-%m-%d).log | wc -l

# Check for any cron job failures
grep "Failed to update asset prices" logs/api-$(date +%Y-%m-%d).log
```

## References

- **Linear Issue**: [IGO-147](https://linear.app/harvester/issue/IGO-147/total-value-=-dollar0)
- **Requirements**: `/specs/price-reliability-fix/requirements.md`
- **Price Service**: `apps/api/src/polygon/polygon.service.ts:207-256`
- **Cron Job**: `apps/api/src/cron-tasks/cron-tasks.service.ts:19-24`
- **Asset Schema**: `apps/api/prisma/schema.prisma:780-830`
- **Database View**: `apps/api/prisma/migrations/20250721045431_rls_policy/migration.sql:27-55`

## Implementation Notes

**Type Definitions**: You may need to import or define the `ITickerSnapshot` type from `@polygon.io/client-js`. Check the existing imports in the file.

**Alternative Validation**: If you want to also filter out negative prices or extremely high prices (data quality check), modify the `isValidPrice()` method:

```typescript
private isValidPrice(tickerData: ITickerSnapshot): boolean {
  const closePrice = tickerData.day?.c;

  // Basic validation: price must exist and be positive
  if (closePrice === undefined || closePrice === null || closePrice <= 0) {
    return false;
  }

  // Optional: Filter out unrealistic prices (data quality)
  // Uncomment if you want to reject extreme values
  // if (closePrice > 1_000_000) {
  //   return false; // Likely data error
  // }

  return true;
}
```

**Logging Level**: Using `this.logger.warn()` for invalid prices is appropriate because:
- It's not an error (API returned successfully)
- It's not normal (price shouldn't be 0 for active stocks)
- It needs visibility for debugging data quality issues

## Timeline Estimate

**Phase 1**: 30-45 minutes
- Code changes: 15-20 minutes
- Local testing: 10-15 minutes
- Code review prep: 5-10 minutes

**Phase 2** (optional): 10 minutes
- Add try-catch: 5 minutes
- Testing: 5 minutes

**Total**: ~45 minutes for core fix, ~55 minutes with error handling

## Risk Assessment

**Risk Level**: Low

**Risks**:
1. **Filter too aggressive**: Could skip valid penny stocks (< $0.01)
   - Mitigation: Only reject exactly 0, undefined, or null

2. **Stale prices forever**: If Polygon never returns valid price again
   - Mitigation: Acceptable - better than $0. Can add staleness indicator later

3. **Logging too verbose**: Warnings for many delisted stocks
   - Mitigation: Monitor log volume, can adjust log level if needed

**Rollback Plan**: Revert code changes via git. No data cleanup needed.
