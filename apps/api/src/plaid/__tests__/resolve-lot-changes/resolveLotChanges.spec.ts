import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import {
  AuthConnection,
  Lot,
  Position,
  Transaction,
} from '@prisma/client'
import Decimal from 'decimal.js'
import { describe, expect, it } from 'vitest'
import { PlaidService } from '../../plaid.service'

interface TestFixture {
  finalPositions: Position[]
  transactions: Transaction[]
  initialLots: Lot[]
  authConnection: AuthConnection
}

describe('plaidService.resolveLotChanges', () => {
  const fixturesDir = join(__dirname, 'fixtures')

  // Get all test cases by looking at JSON files in fixtures directory
  const getTestCases = (): string[] => {
    try {
      const files = readdirSync(fixturesDir)
      return files
        .filter(file => file.endsWith('.json'))
        .map(file => file.replace('.json', ''))
    }
    // eslint-disable-next-line unused-imports/no-unused-vars
    catch (error) {
      console.warn('No test cases found in fixtures directory')
      return []
    }
  }

  // Helper function to load test data
  const loadTestFixture = (testCaseName: string): TestFixture => {
    const filePath = join(fixturesDir, `${testCaseName}.json`)
    const content = readFileSync(filePath, 'utf8')
    return JSON.parse(content)
  }

  // Helper to convert Decimal strings back to Decimal objects and date strings to Date objects
  // eslint-disable-next-line ts/no-explicit-any
  const parseDecimalFields = (obj: any): any => {
    if (obj === null || obj === undefined)
      return obj

    // Convert decimal fields
    if (obj.quantity)
      obj.quantity = new Decimal(obj.quantity)
    if (obj.price)
      obj.price = new Decimal(obj.price)
    if (obj.remainingQty)
      obj.remainingQty = new Decimal(obj.remainingQty)
    if (obj.costTotal)
      obj.costTotal = new Decimal(obj.costTotal)
    if (obj.costAverage)
      obj.costAverage = new Decimal(obj.costAverage)
    if (obj.value)
      obj.value = new Decimal(obj.value)
    if (obj.amount)
      obj.amount = new Decimal(obj.amount)

    // Convert date fields
    if (obj.transactionDate)
      obj.transactionDate = new Date(obj.transactionDate)
    if (obj.acquiredDate)
      obj.acquiredDate = new Date(obj.acquiredDate)
    if (obj.createdAt)
      obj.createdAt = new Date(obj.createdAt)
    if (obj.updatedAt)
      obj.updatedAt = new Date(obj.updatedAt)
    if (obj.date)
      obj.date = new Date(obj.date)
    if (obj.authedAt)
      obj.authedAt = new Date(obj.authedAt)
    if (obj.syncedAt)
      obj.syncedAt = new Date(obj.syncedAt)
    if (obj.lastTransactionSyncedAtPlaid)
      obj.lastTransactionSyncedAtPlaid = new Date(obj.lastTransactionSyncedAtPlaid)
    if (obj.lastSyncStartedAt)
      obj.lastSyncStartedAt = new Date(obj.lastSyncStartedAt)
    if (obj.lastSyncCompletedAt)
      obj.lastSyncCompletedAt = new Date(obj.lastSyncCompletedAt)

    return obj
  }

  const testCases = getTestCases()

  describe.each(testCases)('test case: %s', (testCaseName) => {
    it('should resolve lot changes correctly', { timeout: 30000 }, () => {
      const fixture = loadTestFixture(testCaseName)

      // Convert string decimals to Decimal objects
      const finalPositions = fixture.finalPositions.map(parseDecimalFields)
      const transactions = fixture.transactions.map(parseDecimalFields)
      const initialLots = fixture.initialLots.map(parseDecimalFields)
      const authConnection = fixture.authConnection
      const result = PlaidService.resolveLotChanges({
        finalPositions,
        transactions,
        initialLots,
        portfolioId: authConnection.portfolioId,
      })

      // Log the result for inspection
      console.info(`\nResults for ${testCaseName}:`)
      console.info('Realized P&L:', result.realizedProfitAndLoss.toString())
      console.info('Lot Upserts:', result.lotUpserts.length)
      console.info('Lot Deletes:', result.lotDeletes.length)
      console.info('New Buys:', result.newBuys.length)
      console.info('New Sells:', result.newSells.length)
      console.info('New Transactions:', result.newTransactions.length)

      // Convert result to serializable format for snapshot testing
      const serializedResult = {
        realizedProfitAndLoss: result.realizedProfitAndLoss.toString(),
        lotUpserts: result.lotUpserts.map(lot => ({
          ...lot,
          quantity: lot.quantity.toString(),
          price: lot.price.toString(),
          quantityFinal: lot.quantityFinal.toString(),
          quantityChange: lot.quantityChange.toString(),
          upsert: {
            ...lot.upsert,
            remainingQty: lot.upsert.remainingQty?.toString(),
            price: lot.upsert.price?.toString(),
          },
        })),
        lotDeletes: result.lotDeletes.map(lot => ({
          ...lot,
          quantity: lot.quantity.toString(),
          price: lot.price.toString(),
          quantityFinal: lot.quantityFinal.toString(),
          quantityChange: lot.quantityChange.toString(),
          upsert: {
            ...lot.upsert,
            remainingQty: lot.upsert.remainingQty?.toString(),
            price: lot.upsert.price?.toString(),
          },
        })),
        newBuysCount: result.newBuys.length,
        newSellsCount: result.newSells.length,
        newTransactionsCount: result.newTransactions.length,
        lotTupleMapSymbols: Array.from(result.lotTupleMap.keys()),
      }

      // Create snapshot
      expect(serializedResult).toMatchSnapshot()
    })
  })
})
