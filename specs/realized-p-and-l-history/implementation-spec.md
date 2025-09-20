# AccountRealizedPAndLHistory Implementation Specification

## Overview
Implement comprehensive P&L history tracking that records all changes to realized profit/loss during Plaid syncs, including proper handling of investment income transactions (dividends, covered calls, interest, etc.).

## Transaction Type Classification System

### Transaction Type Hierarchy

```typescript
// apps/api/src/plaid/constants/transaction-types.ts

export enum PlaidTransactionType {
  BUY = 'buy',        // Buying an investment
  SELL = 'sell',      // Selling an investment
  CANCEL = 'cancel',  // Cancellation of a pending transaction
  CASH = 'cash',      // Activity that modifies a cash position
  FEE = 'fee',        // A fee on the account
  TRANSFER = 'transfer' // Activity which modifies a position (options exercise, portfolio transfer)
}

export enum PlaidTransactionSubtype {
  // Account & Fund Fees
  ACCOUNT_FEE = 'account fee',
  FUND_FEE = 'fund fee',
  LEGAL_FEE = 'legal fee',
  MANAGEMENT_FEE = 'management fee',
  MARGIN_EXPENSE = 'margin expense',
  MISCELLANEOUS_FEE = 'miscellaneous fee',
  TRANSFER_FEE = 'transfer fee',
  TRUST_FEE = 'trust fee',
  
  // Buy/Sell Operations
  BUY = 'buy',
  BUY_TO_COVER = 'buy to cover',
  SELL = 'sell',
  SELL_SHORT = 'sell short',
  
  // Dividends & Distributions
  DIVIDEND = 'dividend',
  DIVIDEND_REINVESTMENT = 'dividend reinvestment',
  QUALIFIED_DIVIDEND = 'qualified dividend',
  NON_QUALIFIED_DIVIDEND = 'non-qualified dividend',
  DISTRIBUTION = 'distribution',
  STOCK_DISTRIBUTION = 'stock distribution',
  
  // Interest
  INTEREST = 'interest',
  INTEREST_RECEIVABLE = 'interest receivable',
  INTEREST_REINVESTMENT = 'interest reinvestment',
  
  // Capital Gains
  LONG_TERM_CAPITAL_GAIN = 'long-term capital gain',
  LONG_TERM_CAPITAL_GAIN_REINVESTMENT = 'long-term capital gain reinvestment',
  SHORT_TERM_CAPITAL_GAIN = 'short-term capital gain',
  SHORT_TERM_CAPITAL_GAIN_REINVESTMENT = 'short-term capital gain reinvestment',
  UNQUALIFIED_GAIN = 'unqualified gain',
  
  // Cash Movements
  CONTRIBUTION = 'contribution',
  DEPOSIT = 'deposit',
  WITHDRAWAL = 'withdrawal',
  LOAN_PAYMENT = 'loan payment',
  RETURN_OF_PRINCIPAL = 'return of principal',
  
  // Corporate Actions
  ADJUSTMENT = 'adjustment',
  ASSIGNMENT = 'assignment',
  EXERCISE = 'exercise',
  EXPIRE = 'expire',
  MERGER = 'merger',
  REBALANCE = 'rebalance',
  SPIN_OFF = 'spin off',
  SPLIT = 'split',
  TRADE = 'trade',
  TRANSFER = 'transfer',
  
  // Tax Related
  TAX = 'tax',
  TAX_WITHHELD = 'tax withheld',
  NON_RESIDENT_TAX = 'non-resident tax',
  
  // Pending & Miscellaneous
  PENDING_CREDIT = 'pending credit',
  PENDING_DEBIT = 'pending debit',
  REQUEST = 'request',
  SEND = 'send'
}
```

### Transaction Processing Matrix

| Type | Subtype | P&L Category | Processing Logic |
|------|---------|--------------|------------------|
| buy | buy | - | Create new lot |
| sell | sell | Short/Long Term | Apply lot matching algorithm |
| sell | sell short | Short Term | Track short position |
| buy | buy to cover | Short Term | Close short position |
| cash | dividend | Dividend | Record as dividend income |
| cash | qualified dividend | Dividend | Record with tax advantage flag |
| cash | non-qualified dividend | Dividend | Record as ordinary income |
| cash | dividend reinvestment | - | Create new lot + dividend income |
| cash | interest | Dividend* | Record as investment income |
| cash | interest reinvestment | - | Create new lot + interest income |
| cash | long-term capital gain | Long Term | Record distribution as long-term gain |
| cash | short-term capital gain | Short Term | Record distribution as short-term gain |
| cash | distribution | Short Term** | Record as ordinary distribution |
| fee | account fee | Short Term | Reduce short-term gains |
| fee | management fee | Short Term | Reduce short-term gains |
| fee | fund fee | Short Term | Reduce short-term gains |
| cash | tax withheld | - | Track for tax reporting |
| cash | non-resident tax | - | Track for foreign tax credit |
| transfer | split | - | Adjust lot quantities |
| transfer | merger | - | Convert lots to new security |
| transfer | spin off | - | Create new lots for spinoff |
| cash | deposit | - | Cash balance adjustment only |
| cash | withdrawal | - | Cash balance adjustment only |
| cash | contribution | - | Cash inflow, no P&L impact |

*Note: Interest income is tracked in dividend field for simplicity but should be categorized for tax reporting.
**Note: Generic distributions default to short-term but may need manual categorization.

## Implementation Architecture

### 1. Core Transaction Processor Service

```typescript
// apps/api/src/plaid/services/investment-income.service.ts

import { Injectable, Logger } from '@nestjs/common';
import { Selectable } from 'kysely';
import Decimal from 'decimal.js';
import type { Transaction } from '~/database/db.d';

export interface ProcessedIncome {
  shortTermChange: Decimal;
  longTermChange: Decimal;
  dividendChange: Decimal;
  deferredLossChange: Decimal;
  transactionIds: string[];
  description: string;
}

@Injectable()
export class InvestmentIncomeService {
  private readonly logger = new Logger(InvestmentIncomeService.name);

  /**
   * Categorizes and processes investment income transactions
   * @param transactions - Cash and fee transactions from Plaid sync
   * @param accountId - Account being processed
   * @returns Categorized income changes
   */
  processIncomeTransactions(
    transactions: Selectable<Transaction>[],
    accountId: string
  ): ProcessedIncome {
    let shortTermChange = new Decimal(0);
    let longTermChange = new Decimal(0);
    let dividendChange = new Decimal(0);
    let deferredLossChange = new Decimal(0);
    const transactionIds: string[] = [];
    const descriptions: string[] = [];

    for (const transaction of transactions) {
      const category = this.categorizeTransaction(transaction);
      if (!category) continue; // Skip non-P&L transactions

      const amount = new Decimal(transaction.amount ?? 0);
      transactionIds.push(transaction.id);
      
      // Track transaction for description
      descriptions.push(`${transaction.type}:${transaction.subtype}`);

      switch (category) {
        case 'dividend':
          dividendChange = dividendChange.plus(amount);
          break;
        case 'shortTerm':
          shortTermChange = shortTermChange.plus(amount);
          break;
        case 'longTerm':
          longTermChange = longTermChange.plus(amount);
          break;
        case 'deferred':
          deferredLossChange = deferredLossChange.plus(amount);
          break;
      }

      this.logger.debug(
        `Processed ${transaction.type}:${transaction.subtype} -> ${category}: ${amount.toString()}`
      );
    }

    return {
      shortTermChange,
      longTermChange,
      dividendChange,
      deferredLossChange,
      transactionIds,
      description: `Processed ${descriptions.length} income/fee transactions`,
    };
  }

  /**
   * Determines P&L category based on transaction type and subtype
   * @param transaction - Individual transaction
   * @returns P&L bucket assignment
   */
  categorizeTransaction(
    transaction: Selectable<Transaction>
  ): 'dividend' | 'shortTerm' | 'longTerm' | 'deferred' | null {
    const { type, subtype } = transaction;
    
    // Map type/subtype combinations to P&L categories
    if (type === 'cash') {
      switch (subtype) {
        case 'dividend':
        case 'qualified dividend':
        case 'non-qualified dividend':
        case 'interest':
        case 'interest receivable':
          return 'dividend';
          
        case 'long-term capital gain':
          return 'longTerm';
          
        case 'short-term capital gain':
        case 'distribution':
        case 'unqualified gain':
          return 'shortTerm';
          
        case 'dividend reinvestment':
        case 'interest reinvestment':
        case 'long-term capital gain reinvestment':
        case 'short-term capital gain reinvestment':
          // These create new lots AND income
          return this.getReinvestmentCategory(subtype);
          
        default:
          return null; // No P&L impact
      }
    }
    
    if (type === 'fee') {
      // All fees reduce short-term gains (negative amount)
      return 'shortTerm';
    }
    
    return null;
  }
  
  /**
   * Determines P&L category for reinvestment transactions
   */
  private getReinvestmentCategory(subtype: string): 'dividend' | 'shortTerm' | 'longTerm' {
    if (subtype.includes('dividend') || subtype.includes('interest')) {
      return 'dividend';
    }
    if (subtype.includes('long-term')) {
      return 'longTerm';
    }
    return 'shortTerm';
  }

  /**
   * Checks if a transaction creates a new lot (reinvestment transactions)
   */
  isReinvestmentTransaction(transaction: Selectable<Transaction>): boolean {
    return transaction.subtype?.includes('reinvestment') ?? false;
  }
}
```

### 2. Enhanced Lot Application

```typescript
// apps/api/src/plaid/lot-application/lot-application.ts

export interface OrganizedAssets {
  lotDataMap: Map<string, LotDataWithMeta>;
  incomeTransactions: IncomeTransaction[];
}

export interface IncomeTransaction {
  transaction: Selectable<Transaction>;
  pnlCategory: 'shortTerm' | 'longTerm' | 'dividend' | null;
  requiresLotCreation: boolean; // For reinvestment transactions
}

// Modified organizeAssets function
export function organizeAssets({
  lots,
  transactions,
  finalPositions,
}: {
  lots: Selectable<Lot>[];
  transactions: Selectable<Transaction>[];
  finalPositions: Selectable<Position>[];
}): OrganizedAssets {
  const assetLots = new Map<string, LotDataWithMeta>();
  const incomeTransactions: IncomeTransaction[] = [];
  
  // Separate transactions by category
  const newTransactions = transactions.filter((trx) => !trx.appliedToLots);
  
  // Process buy/sell transactions (existing logic)
  const newBuys = newTransactions.filter(
    (t) => t.type === 'buy' && t.subtype === 'buy'
  );
  const newSells = newTransactions.filter(
    (t) => t.type === 'sell' && t.subtype === 'sell'
  );
  
  // NEW: Process income and fee transactions
  const incomeAndFeeTransactions = newTransactions.filter(
    (t) => (t.type === 'cash' || t.type === 'fee') && t.appliedToLots === false
  );
  
  // Categorize income/fee transactions (would use injected service in real implementation)
  for (const tx of incomeAndFeeTransactions) {
    const pnlCategory = this.investmentIncomeService.categorizeTransaction(tx);
    
    // Skip transactions with no P&L impact (deposits, withdrawals, etc.)
    if (pnlCategory === null) continue;
    
    // Check if this is a reinvestment that needs a new lot
    const requiresLotCreation = this.investmentIncomeService.isReinvestmentTransaction(tx);
    
    incomeTransactions.push({
      transaction: tx,
      pnlCategory,
      requiresLotCreation
    });
    
    // If reinvestment, also create a new lot
    if (requiresLotCreation && tx.quantity && tx.price) {
      current.lotData.push({
        quantity: new Decimal(tx.quantity),
        price: new Decimal(tx.price),
        lotId: crypto.randomUUID() as string,
        accountId: tx.accountId,
        acquiredDate: tx.transactionDate ?? new Date(),
      });
    }
  }
  
  // ... existing lot organization logic ...
  
  return {
    lotDataMap: assetLots,
    incomeTransactions
  };
}
```

### 3. Module Configuration

```typescript
// apps/api/src/plaid/plaid.module.ts

import { Module } from '@nestjs/common';
import { InvestmentIncomeService } from './services/investment-income.service';
import { PlaidService } from './plaid.service';
// ... other imports

@Module({
  // ... existing configuration
  providers: [
    PlaidService,
    InvestmentIncomeService, // Add the new service
    // ... other providers
  ],
  exports: [PlaidService, InvestmentIncomeService],
})
export class PlaidModule {}
```

### 4. Plaid Service Integration

```typescript
// apps/api/src/plaid/plaid.service.ts

import { InvestmentIncomeService } from './services/investment-income.service';

@Injectable()
export class PlaidService {
  constructor(
    // ... existing dependencies
    private readonly investmentIncomeService: InvestmentIncomeService,
  ) {
    // ... existing constructor logic
  }

  // Modified applyNewPlaidTransactions method
async applyNewPlaidTransactions({
  accountId,
  portfolioId,
}: {
  accountId: string;
  portfolioId: string;
}): Promise<void> {
  // ... existing lot resolution logic ...
  
  const { lotDataMap, incomeTransactions } = organizeAssets({
    lots: initialLots,
    transactions,
    finalPositions,
  });
  
  // Process lot changes (existing)
  const resolvedLotChanges = PlaidService.resolveLots({
    lotDataMap,
    // ... other params
  });
  
  // NEW: Process investment income
  if (incomeTransactions.length > 0) {
    await this.processAndRecordInvestmentIncome({
      incomeTransactions,
      accountId,
      portfolioId,
    });
  }
  
  // ... continue with existing merge logic ...
}

// NEW: Process investment income transactions
private async processAndRecordInvestmentIncome({
  incomeTransactions,
  accountId,
  portfolioId,
}: {
  incomeTransactions: IncomeTransaction[];
  accountId: string;
  portfolioId: string;
}) {
  const processedIncome = InvestmentIncomeProcessor.processIncomeTransactions(
    incomeTransactions.map(it => it.transaction),
    accountId
  );
  
  await executeWithRLS(this.db, portfolioId, async (trx) => {
    // Get or create current year P&L
    const currentYear = new Date().getFullYear();
    const currentPnL = await this.getOrCreateRealizedPnL(trx, accountId, currentYear);
    
    // Record history entry
    await trx
      .insertInto('AccountRealizedPAndLHistory')
      .values({
        uuid: crypto.randomUUID(),
        accountId,
        portfolioId,
        realizedPAndLId: currentPnL.id,
        shortTermChange: processedIncome.shortTermChange.toString(),
        longTermChange: processedIncome.longTermChange.toString(),
        dividendChange: processedIncome.dividendChange.toString(),
        deferredLossChange: processedIncome.deferredLossChange.toString(),
      })
      .execute();
    
    // Update P&L totals
    await trx
      .updateTable('RealizedPAndL')
      .set({
        shortTerm: sql`${sql.ref('shortTerm')} + ${processedIncome.shortTermChange.toString()}`,
        longTerm: sql`${sql.ref('longTerm')} + ${processedIncome.longTermChange.toString()}`,
        dividend: sql`${sql.ref('dividend')} + ${processedIncome.dividendChange.toString()}`,
        deferredLoss: sql`${sql.ref('deferredLoss')} + ${processedIncome.deferredLossChange.toString()}`,
      })
      .where('id', '=', currentPnL.id)
      .execute();
    
    // Mark transactions as applied
    await trx
      .updateTable('Transaction')
      .set({ appliedToLots: true })
      .where('id', 'in', processedIncome.transactionIds)
      .execute();
  });
}

// Modified applyLotChangesToAccount to record history
async applyLotChangesToAccount({
  trx,
  portfolioId,
  accountId,
  lotChanges,
}: {
  trx: Transaction<DB>;
  lotChanges: LotChangeKysely[];
  portfolioId: string;
  accountId: string;
}) {
  // ... existing lot upsert logic ...
  
  // Calculate P&L changes from lot changes
  const shortTermChange = lotChanges.reduce(
    (sum, change) => sum.plus(change.realizedProfitAndLossShortTerm),
    new Decimal(0)
  );
  const longTermChange = lotChanges.reduce(
    (sum, change) => sum.plus(change.realizedProfitAndLossLongTerm),
    new Decimal(0)
  );
  
  // Get current P&L
  const currentYear = new Date().getFullYear();
  const currentPnL = await this.getOrCreateRealizedPnL(trx, accountId, currentYear);
  
  // NEW: Record history entry for lot changes
  await trx
    .insertInto('AccountRealizedPAndLHistory')
    .values({
      uuid: crypto.randomUUID(),
      accountId,
      portfolioId,
      realizedPAndLId: currentPnL.id,
      shortTermChange: shortTermChange.toString(),
      longTermChange: longTermChange.toString(),
      dividendChange: '0',
      deferredLossChange: '0',
    })
    .execute();
  
  // ... existing P&L update logic ...
}
```

## Testing Strategy

### Unit Tests

1. **InvestmentIncomeProcessor Tests**
   - Test transaction categorization logic
   - Verify memo parsing for different income types
   - Test P&L bucket assignment

2. **Lot Application Tests**
   - Test separation of income vs trade transactions
   - Verify income transaction categorization

3. **History Recording Tests**
   - Verify history entries are created
   - Test atomic transaction integrity
   - Validate P&L calculations

## Migration & Rollout

### Phase 1: Foundation (Week 1)
- Create transaction type constants
- Implement InvestmentIncomeProcessor
- Add unit tests

### Phase 2: Integration (Week 2)
- Modify organizeAssets function
- Integrate income processing in plaid.service
- Add history recording for lot changes

### Phase 3: Testing & Validation (Week 3)
- Comprehensive testing
- Performance optimization
- Production monitoring setup

## Success Criteria

### Automated Verification
- [ ] All unit tests pass: `npm test plaid`
- [ ] Type checking passes: `npm run typecheck`
- [ ] Database migrations apply cleanly: `npm run migrate`
- [ ] Integration tests pass: `npm test:integration`

### Manual Verification
- [ ] Dividend transactions create dividend P&L entries
- [ ] Covered call income tracked as short-term gains
- [ ] History entries link to source transactions
- [ ] P&L totals reconcile with transaction amounts
- [ ] No performance degradation on large syncs

## Edge Cases & Considerations

1. **Foreign Tax Handling**
   - Track foreign tax paid separately
   - Don't include in P&L calculations
   - Store for tax credit reporting

2. **Corporate Actions**
   - Stock splits don't affect P&L
   - Mergers may require special handling
   - Spinoffs create new cost basis

3. **Fee Processing**
   - Investment fees reduce gains
   - Track separately for tax deduction
   - Consider wash sale implications

4. **Retroactive Processing**
   - Handle existing unprocessed income transactions
   - One-time migration script for historical data

## Performance Considerations

1. **Batch Processing**
   - Process transactions in batches of 100
   - Use database transactions for atomicity
   - Implement retry logic for failures

2. **Indexing**
   - Ensure proper indexes on AccountRealizedPAndLHistory
   - Index transaction lookup fields

3. **Monitoring**
   - Log processing times for large syncs
   - Track history table growth
   - Monitor query performance

## Security & Data Integrity

1. **Atomic Transactions**
   - All P&L updates in single transaction
   - Rollback on any failure
   - Maintain data consistency

2. **Audit Trail**
   - Every P&L change has history record
   - Link to source transaction/lot
   - Timestamps for all changes

3. **Validation**
   - Verify P&L calculations
   - Check for duplicate processing
   - Validate transaction categorization