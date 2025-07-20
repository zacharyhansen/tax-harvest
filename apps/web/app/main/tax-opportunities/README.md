# Tax Opportunities Refactoring

## Changes Made

### 1. Replaced `useFiniteHarvestQuery` with `useHarvestEvalResultQuery`

- The new API provides a more flexible structure with `sourceLots` and `matchingLots` instead of pre-matched pairs
- The harvest type is directly returned by the API for cleaner UI logic

### 2. Created New Components

- **HarvestEvalPairCard**: Replaces the old `CostBasisPairCard` with navigation controls
  - Displays one source lot with navigation to cycle through matching lots
  - Shows "Option X / Y" with left/right arrow buttons
  - Maintains the same visual design as before

### 3. Implemented Case Logic Based on Harvest Type

- **NO_OPPORTUNITY_EMPTY/GAINS/LOSSES**: Shows a centered message explaining no opportunities
- **REDUCE_COST_BASIS**: Shows matched pairs with navigation between matching lots
- **REDUCE_TAXES/CAPTURE_GAINS_TAX_FREE**: Shows tabs for opportunities and realized positions

### 4. Key Features

- Navigation arrows allow users to browse through multiple matching lots for each source lot
- Tax savings calculation (estimated at 35% tax rate)
- Maintains existing harvest/undo functionality
- Responsive design with proper mobile layout

## API Structure

The new `useHarvestEvalResultQuery` returns:

```typescript
{
  harvestType: HarvestType,
  summary: PortfolioSummary,
  sourceLots?: LotCurrent[],    // For REDUCE_COST_BASIS
  matchingLots?: LotCurrent[],  // For REDUCE_COST_BASIS
  lotsCurrent?: LotCurrent[],   // For REDUCE_TAXES/CAPTURE_GAINS_TAX_FREE
  totalHarvestLots: number
}
```

## Usage

The page automatically switches between different views based on the harvest type returned by the API.
