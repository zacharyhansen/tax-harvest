import { ProfitAndLossType } from '@prisma/client';
import { InvestmentTransactionSubtype, InvestmentTransactionType } from 'plaid';

/**
 * Transaction classification mapping
 * Maps transaction type/subtype combinations to specific ProfitAndLossType enum values
 */
export const TRANSACTION_PNL_MAPPING: Record<
	InvestmentTransactionType,
	Partial<Record<InvestmentTransactionSubtype, ProfitAndLossType | null>>
> = {
	[InvestmentTransactionType.Buy]: {
		[InvestmentTransactionSubtype.Buy]: null,
	},
	[InvestmentTransactionType.Sell]: {
		[InvestmentTransactionSubtype.Sell]: null,
	},
	[InvestmentTransactionType.Cancel]: {
		// TODO: this is a placeholder for now
		[InvestmentTransactionSubtype.Contribution]: null,
	},
	[InvestmentTransactionType.Cash]: {
		// Dividends & Interest
		[InvestmentTransactionSubtype.Dividend]: ProfitAndLossType.DIVIDEND,
		[InvestmentTransactionSubtype.QualifiedDividend]:
			ProfitAndLossType.QUALIFIED_DIVIDEND,
		[InvestmentTransactionSubtype.NonQualifiedDividend]:
			ProfitAndLossType.NON_QUALIFIED_DIVIDEND,
		[InvestmentTransactionSubtype.Interest]: ProfitAndLossType.INTEREST,
		[InvestmentTransactionSubtype.InterestReceivable]:
			ProfitAndLossType.INTEREST,

		// Capital gains distributions
		[InvestmentTransactionSubtype.LongTermCapitalGain]:
			ProfitAndLossType.LONG_TERM_CAPITAL_GAIN,
		[InvestmentTransactionSubtype.ShortTermCapitalGain]:
			ProfitAndLossType.SHORT_TERM_CAPITAL_GAIN,
		[InvestmentTransactionSubtype.Distribution]: ProfitAndLossType.DISTRIBUTION,
		[InvestmentTransactionSubtype.UnqualifiedGain]:
			ProfitAndLossType.UNQUALIFIED_GAIN,

		// Reinvestments (track income but also create lots)
		[InvestmentTransactionSubtype.DividendReinvestment]:
			ProfitAndLossType.DIVIDEND_REINVESTMENT,
		[InvestmentTransactionSubtype.InterestReinvestment]:
			ProfitAndLossType.INTEREST_REINVESTMENT,
		[InvestmentTransactionSubtype.LongTermCapitalGainReinvestment]:
			ProfitAndLossType.LONG_TERM_CAPITAL_GAIN,
		[InvestmentTransactionSubtype.ShortTermCapitalGainReinvestment]:
			ProfitAndLossType.SHORT_TERM_CAPITAL_GAIN,

		// Cash movements with specific types
		[InvestmentTransactionSubtype.Deposit]: ProfitAndLossType.DEPOSIT,
		[InvestmentTransactionSubtype.Withdrawal]: ProfitAndLossType.WITHDRAWAL,
		[InvestmentTransactionSubtype.Contribution]: ProfitAndLossType.CONTRIBUTION,
		[InvestmentTransactionSubtype.ReturnOfPrincipal]:
			ProfitAndLossType.RETURN_OF_PRINCIPAL,
		[InvestmentTransactionSubtype.LoanPayment]: ProfitAndLossType.LOAN_PAYMENT,
		[InvestmentTransactionSubtype.TaxWithheld]: ProfitAndLossType.TAX_WITHHELD,
		[InvestmentTransactionSubtype.NonResidentTax]:
			ProfitAndLossType.NON_RESIDENT_TAX,
		[InvestmentTransactionSubtype.StockDistribution]:
			ProfitAndLossType.STOCK_DISTRIBUTION,
	},

	[InvestmentTransactionType.Fee]: {
		// Fee types
		[InvestmentTransactionSubtype.AccountFee]: ProfitAndLossType.ACCOUNT_FEE,
		[InvestmentTransactionSubtype.FundFee]: ProfitAndLossType.FUND_FEE,
		[InvestmentTransactionSubtype.LegalFee]: ProfitAndLossType.ACCOUNT_FEE, // Map to ACCOUNT_FEE as LegalFee not in enum
		[InvestmentTransactionSubtype.ManagementFee]:
			ProfitAndLossType.MANAGEMENT_FEE,
		[InvestmentTransactionSubtype.MarginExpense]:
			ProfitAndLossType.MARGIN_EXPENSE,
		[InvestmentTransactionSubtype.MiscellaneousFee]:
			ProfitAndLossType.ACCOUNT_FEE, // Map to ACCOUNT_FEE as MiscellaneousFee not in enum
		[InvestmentTransactionSubtype.TransferFee]: ProfitAndLossType.ACCOUNT_FEE, // Map to ACCOUNT_FEE as TransferFee not in enum
		[InvestmentTransactionSubtype.TrustFee]: ProfitAndLossType.ACCOUNT_FEE, // Map to ACCOUNT_FEE as TrustFee not in enum
	},

	[InvestmentTransactionType.Transfer]: {
		// Corporate actions - no P&L impact (return null)
		[InvestmentTransactionSubtype.Split]: null,
		[InvestmentTransactionSubtype.Merger]: null,
		[InvestmentTransactionSubtype.SpinOff]: null,
		[InvestmentTransactionSubtype.Assignment]: null,
		[InvestmentTransactionSubtype.Exercise]: null,
		[InvestmentTransactionSubtype.Expire]: null,
		[InvestmentTransactionSubtype.Adjustment]: null,
		[InvestmentTransactionSubtype.Rebalance]: null,
		[InvestmentTransactionSubtype.Transfer]: null,
	},
};
