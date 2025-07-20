# Test Fixtures for resolveLotChanges

This directory contains test fixtures for the `resolveLotChanges` function.

## Adding Test Cases

Each test case is a single JSON file containing all the input data needed for the test.

### File Structure

Create a JSON file with a descriptive name (e.g., `simple-sell.json`, `multiple-lots-fifo.json`, `complex-portfolio.json`) containing:

```json
{
  "finalPositions": [
    // Array of Position objects representing the target state
  ],
  "transactions": [
    // Array of Transaction objects to be processed
  ],
  "initialLots": [
    // Array of Lot objects representing the starting state
  ],
  "authConnection": {
    // AuthConnection object with portfolio and user info
  }
}
```

### Running Tests

The test suite will automatically discover and run all `.json` files in this directory.

```bash
# Run tests
npm test -- resolveLotChanges.spec.ts

# Run tests in watch mode
npm test -- resolveLotChanges.spec.ts --watch
```

### Tips for Creating Test Cases

1. **Decimal Values**: Use strings for all decimal values (quantity, price, amount, etc.)
2. **Dates**: Use ISO 8601 format for all dates
3. **IDs**: Ensure all IDs are unique within the test case
4. **Consistency**: Make sure `portfolioId` matches across all objects
5. **Asset Symbols**: Keep asset symbols consistent across positions, transactions, and lots

### Example Test Scenarios

- `simple-sell.json` - Basic sell transaction with FIFO lot matching
- `multiple-assets.json` - Portfolio with multiple different assets
- `partial-lot-sell.json` - Selling part of a lot
- `complete-liquidation.json` - Selling all positions
- `mixed-transactions.json` - Mix of buy and sell transactions