/*
  Warnings:

  - The values [SHORT_TERM,LONG_TERM] on the enum `ProfitAndLossType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `deferredLoss` on the `RealizedPAndL` table. All the data in the column will be lost.
  - You are about to drop the column `longTerm` on the `RealizedPAndL` table. All the data in the column will be lost.
  - You are about to drop the column `shortTerm` on the `RealizedPAndL` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."ProfitAndLossType_new" AS ENUM ('SHORT_TERM_CAPITAL_GAIN', 'LONG_TERM_CAPITAL_GAIN', 'DIVIDEND', 'QUALIFIED_DIVIDEND', 'NON_QUALIFIED_DIVIDEND', 'DIVIDEND_REINVESTMENT', 'INTEREST', 'INTEREST_REINVESTMENT', 'DISTRIBUTION', 'ACCOUNT_FEE', 'MANAGEMENT_FEE', 'FUND_FEE', 'TAX_WITHHELD', 'NON_RESIDENT_TAX', 'DEPOSIT', 'WITHDRAWAL', 'CONTRIBUTION', 'RETURN_OF_PRINCIPAL', 'LOAN_PAYMENT', 'MARGIN_EXPENSE', 'STOCK_DISTRIBUTION', 'DEFERRED', 'UNQUALIFIED_GAIN');
ALTER TABLE "public"."Transaction" ALTER COLUMN "profitAndLossType" TYPE "public"."ProfitAndLossType_new" USING ("profitAndLossType"::text::"public"."ProfitAndLossType_new");
ALTER TYPE "public"."ProfitAndLossType" RENAME TO "ProfitAndLossType_old";
ALTER TYPE "public"."ProfitAndLossType_new" RENAME TO "ProfitAndLossType";
DROP TYPE "public"."ProfitAndLossType_old";
COMMIT;

-- AlterTable
ALTER TABLE "public"."RealizedPAndL" DROP COLUMN "deferredLoss",
DROP COLUMN "longTerm",
DROP COLUMN "shortTerm",
ADD COLUMN     "accountFee" DECIMAL(14,4) NOT NULL DEFAULT 0,
ADD COLUMN     "contribution" DECIMAL(14,4) NOT NULL DEFAULT 0,
ADD COLUMN     "deposit" DECIMAL(14,4) NOT NULL DEFAULT 0,
ADD COLUMN     "distribution" DECIMAL(14,4) NOT NULL DEFAULT 0,
ADD COLUMN     "dividendReinvestment" DECIMAL(14,4) NOT NULL DEFAULT 0,
ADD COLUMN     "fundFee" DECIMAL(14,4) NOT NULL DEFAULT 0,
ADD COLUMN     "interest" DECIMAL(14,4) NOT NULL DEFAULT 0,
ADD COLUMN     "interestReinvestment" DECIMAL(14,4) NOT NULL DEFAULT 0,
ADD COLUMN     "loanPayment" DECIMAL(14,4) NOT NULL DEFAULT 0,
ADD COLUMN     "longTermCapitalGain" DECIMAL(14,4) NOT NULL DEFAULT 0,
ADD COLUMN     "managementFee" DECIMAL(14,4) NOT NULL DEFAULT 0,
ADD COLUMN     "marginExpense" DECIMAL(14,4) NOT NULL DEFAULT 0,
ADD COLUMN     "nonQualifiedDividend" DECIMAL(14,4) NOT NULL DEFAULT 0,
ADD COLUMN     "nonResidentTax" DECIMAL(14,4) NOT NULL DEFAULT 0,
ADD COLUMN     "qualifiedDividend" DECIMAL(14,4) NOT NULL DEFAULT 0,
ADD COLUMN     "returnOfPrincipal" DECIMAL(14,4) NOT NULL DEFAULT 0,
ADD COLUMN     "shortTermCapitalGain" DECIMAL(14,4) NOT NULL DEFAULT 0,
ADD COLUMN     "stockDistribution" DECIMAL(14,4) NOT NULL DEFAULT 0,
ADD COLUMN     "taxWithheld" DECIMAL(14,4) NOT NULL DEFAULT 0,
ADD COLUMN     "unqualifiedGain" DECIMAL(14,4) NOT NULL DEFAULT 0,
ADD COLUMN     "withdrawal" DECIMAL(14,4) NOT NULL DEFAULT 0;
