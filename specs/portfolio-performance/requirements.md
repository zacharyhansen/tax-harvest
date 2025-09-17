# Portfolio Performance API Requirements

## Overview
Create a NestJS module, resolver, and service that provides portfolio performance data over time using the existing PortfolioBalanceSnapshot model.

## Functional Requirements

### API Endpoint
- Single GraphQL endpoint: `portfolioPerformance`
- Returns time-series data showing portfolio value over time

### Input Parameters

#### timeSpan (enum)
- `YTD` - Year to date
- `6months` - Last 6 months
- `ALL` - All available data
- `1Yr` - Last 1 year  
- `2Yr` - Last 2 years

#### type (enum)
- `default` - Returns portfolio totals broken down by account
- `position` - Returns portfolio totals broken down by asset symbol

#### portfolioId (string)
- UUID of the portfolio to fetch performance for

### Output Format

#### Default Type
```javascript
[
  {
    date: "2024-04-01",
    portfolioTotal: 73728,
    account1_id: 222,
    account2_id: 150,
    // ... all accounts in portfolio
  },
  {
    date: "2024-04-02",
    portfolioTotal: 74000,
    account1_id: 230,
    account2_id: 155,
    // ... all accounts
  }
  // ... one record per day
]
```

#### Position Type
```javascript
[
  {
    date: "2024-04-01",
    portfolioTotal: 73728,
    AAPL: 5000,
    GOOGL: 3000,
    // ... all asset symbols from positions JSON
  },
  {
    date: "2024-04-02", 
    portfolioTotal: 74000,
    AAPL: 5100,
    GOOGL: 3050,
    // ... all asset symbols
  }
  // ... one record per day
]
```

## Data Source
- Use existing `PortfolioBalanceSnapshot` model from Prisma schema
- Model contains:
  - `portfolioId` - portfolio identifier
  - `accountId` - account identifier
  - `valueTotal` - total value for that account
  - `valueCash` - cash value
  - `valueAssets` - assets value
  - `positions` - JSON containing position details
  - `createdAt` - timestamp of snapshot

## Business Rules
1. **Data Aggregation**: 
   - Group snapshots by day
   - If multiple snapshots exist for the same day, use the OLDEST record (earliest createdAt)
   
2. **Portfolio Total Calculation**:
   - Sum all account `valueTotal` fields for the same day
   
3. **Date Range Filtering**:
   - Calculate date range based on timeSpan parameter from current date
   - Return data only within the calculated range
   
4. **Missing Data**:
   - If no data exists for a particular day, that day should be omitted from results
   - Do not interpolate or fill missing days

## Technical Requirements
1. Implement as NestJS module following existing patterns
2. Use GraphQL resolver with proper typing
3. Optimize database queries using appropriate indexes
4. Handle large datasets efficiently
5. Include proper error handling
6. Add unit tests for service methods
7. Add integration tests for GraphQL endpoint