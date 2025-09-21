/*
  Warnings:

  - The values [DEFERRED] on the enum `ProfitAndLossType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."ProfitAndLossType_new" AS ENUM ('SHORT_TERM_CAPITAL_GAIN', 'LONG_TERM_CAPITAL_GAIN', 'DIVIDEND', 'QUALIFIED_DIVIDEND', 'NON_QUALIFIED_DIVIDEND', 'DIVIDEND_REINVESTMENT', 'INTEREST', 'INTEREST_REINVESTMENT', 'DISTRIBUTION', 'ACCOUNT_FEE', 'MANAGEMENT_FEE', 'FUND_FEE', 'TAX_WITHHELD', 'NON_RESIDENT_TAX', 'DEPOSIT', 'WITHDRAWAL', 'CONTRIBUTION', 'RETURN_OF_PRINCIPAL', 'LOAN_PAYMENT', 'MARGIN_EXPENSE', 'STOCK_DISTRIBUTION', 'UNQUALIFIED_GAIN');
ALTER TABLE "public"."AccountRealizedPAndLHistory" ALTER COLUMN "profitAndLossType" TYPE "public"."ProfitAndLossType_new" USING ("profitAndLossType"::text::"public"."ProfitAndLossType_new");
ALTER TABLE "public"."Transaction" ALTER COLUMN "profitAndLossType" TYPE "public"."ProfitAndLossType_new" USING ("profitAndLossType"::text::"public"."ProfitAndLossType_new");
ALTER TYPE "public"."ProfitAndLossType" RENAME TO "ProfitAndLossType_old";
ALTER TYPE "public"."ProfitAndLossType_new" RENAME TO "ProfitAndLossType";
DROP TYPE "public"."ProfitAndLossType_old";
COMMIT;
