import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
  Decimal: { input: string; output: string; }
  JSON: { input: any; output: any; }
};

export type Account = {
  __typename?: 'Account';
  _count: AccountCount;
  _realizedProfitAndLoss: RealizedPAndL;
  accountValueTotal?: Maybe<Scalars['Decimal']['output']>;
  authConnection?: Maybe<AuthConnection>;
  /** The auth connection the account has been provided from  */
  authConnectionId?: Maybe<Scalars['String']['output']>;
  balanceAccount?: Maybe<Scalars['Decimal']['output']>;
  balanceMoneyMarket?: Maybe<Scalars['Decimal']['output']>;
  balanceShortAdjustment?: Maybe<Scalars['Decimal']['output']>;
  cashAvailableForInvestment?: Maybe<Scalars['Decimal']['output']>;
  cashBalance?: Maybe<Scalars['Decimal']['output']>;
  cashBuyingPower?: Maybe<Scalars['Decimal']['output']>;
  cashForOpenOrders?: Maybe<Scalars['Decimal']['output']>;
  cashNet?: Maybe<Scalars['Decimal']['output']>;
  cashOpenOrderReserveDT?: Maybe<Scalars['Decimal']['output']>;
  cashSettledForInvestment?: Maybe<Scalars['Decimal']['output']>;
  cashUnsettledForInvestment?: Maybe<Scalars['Decimal']['output']>;
  /** If the account was closed */
  closedDate?: Maybe<Scalars['DateTime']['output']>;
  createdAt: Scalars['DateTime']['output'];
  createdBy: User;
  /** Who created the model */
  createdById: Scalars['String']['output'];
  /** The description of the account */
  description?: Maybe<Scalars['String']['output']>;
  equityRegt?: Maybe<Scalars['Decimal']['output']>;
  equityRegtPercent?: Maybe<Scalars['Decimal']['output']>;
  /** The unique id in the external system for the account (only unique in combination with provider) */
  externalId?: Maybe<Scalars['String']['output']>;
  files?: Maybe<Array<File>>;
  fundsWithheldFromPurchasingPower?: Maybe<Scalars['Decimal']['output']>;
  fundsWithheldFromWithdrawal?: Maybe<Scalars['Decimal']['output']>;
  /** Internal account identifier */
  id: Scalars['ID']['output'];
  /** What institution does this account fall under */
  institution?: Maybe<AccountInstitution>;
  key?: Maybe<Scalars['String']['output']>;
  liveURL?: Maybe<Scalars['String']['output']>;
  liveURLCreated?: Maybe<Scalars['DateTime']['output']>;
  /** The date the account was seeded with lots using a CSV or other import - transactions after this date will be applied using our algorithim */
  lotSeededDate?: Maybe<Scalars['DateTime']['output']>;
  lots?: Maybe<Array<Lot>>;
  marginBuyingPower?: Maybe<Scalars['Decimal']['output']>;
  marginBuyingPowerDT?: Maybe<Scalars['Decimal']['output']>;
  marginOpenOrderReserveDT?: Maybe<Scalars['Decimal']['output']>;
  marketValueTotal?: Maybe<Scalars['Decimal']['output']>;
  /** The mode of the account */
  mode?: Maybe<AccountMode>;
  name?: Maybe<Scalars['String']['output']>;
  /** Option level for the account */
  optionLevel?: Maybe<OptionLevel>;
  plaidAccountMask?: Maybe<Scalars['String']['output']>;
  portfolio: Portfolio;
  /** Which portfolio does this account belong to */
  portfolioId: Scalars['String']['output'];
  positions?: Maybe<Array<Position>>;
  /** External provider of the account - null if its an system generated account */
  provider: AccountProvider;
  raw?: Maybe<Scalars['JSON']['output']>;
  realizedPAndL?: Maybe<Array<RealizedPAndL>>;
  setRealizedValues: Scalars['Boolean']['output'];
  skipSetup: Scalars['Boolean']['output'];
  /** Is this account archived */
  status: AccountStatus;
  subType?: Maybe<Scalars['String']['output']>;
  transactions?: Maybe<Array<Transaction>>;
  /** The type of account */
  type: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  uploadedPositions: Scalars['Boolean']['output'];
};


export type Account_RealizedProfitAndLossArgs = {
  year?: InputMaybe<Scalars['Float']['input']>;
};

export type AccountAvgAggregate = {
  __typename?: 'AccountAvgAggregate';
  accountValueTotal?: Maybe<Scalars['Decimal']['output']>;
  balanceAccount?: Maybe<Scalars['Decimal']['output']>;
  balanceMoneyMarket?: Maybe<Scalars['Decimal']['output']>;
  balanceShortAdjustment?: Maybe<Scalars['Decimal']['output']>;
  cashAvailableForInvestment?: Maybe<Scalars['Decimal']['output']>;
  cashBalance?: Maybe<Scalars['Decimal']['output']>;
  cashBuyingPower?: Maybe<Scalars['Decimal']['output']>;
  cashForOpenOrders?: Maybe<Scalars['Decimal']['output']>;
  cashNet?: Maybe<Scalars['Decimal']['output']>;
  cashOpenOrderReserveDT?: Maybe<Scalars['Decimal']['output']>;
  cashSettledForInvestment?: Maybe<Scalars['Decimal']['output']>;
  cashUnsettledForInvestment?: Maybe<Scalars['Decimal']['output']>;
  equityRegt?: Maybe<Scalars['Decimal']['output']>;
  equityRegtPercent?: Maybe<Scalars['Decimal']['output']>;
  fundsWithheldFromPurchasingPower?: Maybe<Scalars['Decimal']['output']>;
  fundsWithheldFromWithdrawal?: Maybe<Scalars['Decimal']['output']>;
  marginBuyingPower?: Maybe<Scalars['Decimal']['output']>;
  marginBuyingPowerDT?: Maybe<Scalars['Decimal']['output']>;
  marginOpenOrderReserveDT?: Maybe<Scalars['Decimal']['output']>;
  marketValueTotal?: Maybe<Scalars['Decimal']['output']>;
};

export type AccountCount = {
  __typename?: 'AccountCount';
  files: Scalars['Int']['output'];
  lots: Scalars['Int']['output'];
  positions: Scalars['Int']['output'];
  realizedPAndL: Scalars['Int']['output'];
  transactions: Scalars['Int']['output'];
};

export type AccountCountAggregate = {
  __typename?: 'AccountCountAggregate';
  _all: Scalars['Int']['output'];
  accountValueTotal: Scalars['Int']['output'];
  authConnectionId: Scalars['Int']['output'];
  balanceAccount: Scalars['Int']['output'];
  balanceMoneyMarket: Scalars['Int']['output'];
  balanceShortAdjustment: Scalars['Int']['output'];
  cashAvailableForInvestment: Scalars['Int']['output'];
  cashBalance: Scalars['Int']['output'];
  cashBuyingPower: Scalars['Int']['output'];
  cashForOpenOrders: Scalars['Int']['output'];
  cashNet: Scalars['Int']['output'];
  cashOpenOrderReserveDT: Scalars['Int']['output'];
  cashSettledForInvestment: Scalars['Int']['output'];
  cashUnsettledForInvestment: Scalars['Int']['output'];
  closedDate: Scalars['Int']['output'];
  createdAt: Scalars['Int']['output'];
  createdById: Scalars['Int']['output'];
  description: Scalars['Int']['output'];
  equityRegt: Scalars['Int']['output'];
  equityRegtPercent: Scalars['Int']['output'];
  externalId: Scalars['Int']['output'];
  fundsWithheldFromPurchasingPower: Scalars['Int']['output'];
  fundsWithheldFromWithdrawal: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  institution: Scalars['Int']['output'];
  key: Scalars['Int']['output'];
  liveURL: Scalars['Int']['output'];
  liveURLCreated: Scalars['Int']['output'];
  lotSeededDate: Scalars['Int']['output'];
  marginBuyingPower: Scalars['Int']['output'];
  marginBuyingPowerDT: Scalars['Int']['output'];
  marginOpenOrderReserveDT: Scalars['Int']['output'];
  marketValueTotal: Scalars['Int']['output'];
  mode: Scalars['Int']['output'];
  name: Scalars['Int']['output'];
  optionLevel: Scalars['Int']['output'];
  plaidAccountMask: Scalars['Int']['output'];
  portfolioId: Scalars['Int']['output'];
  provider: Scalars['Int']['output'];
  raw: Scalars['Int']['output'];
  setRealizedValues: Scalars['Int']['output'];
  skipSetup: Scalars['Int']['output'];
  status: Scalars['Int']['output'];
  subType: Scalars['Int']['output'];
  type: Scalars['Int']['output'];
  updatedAt: Scalars['Int']['output'];
  uploadedPositions: Scalars['Int']['output'];
};

export type AccountCreateInput = {
  accountValueTotal?: InputMaybe<Scalars['Decimal']['input']>;
  authConnection?: InputMaybe<AuthConnectionCreateNestedOneWithoutAccountsInput>;
  balanceAccount?: InputMaybe<Scalars['Decimal']['input']>;
  balanceMoneyMarket?: InputMaybe<Scalars['Decimal']['input']>;
  balanceShortAdjustment?: InputMaybe<Scalars['Decimal']['input']>;
  cashAvailableForInvestment?: InputMaybe<Scalars['Decimal']['input']>;
  cashBalance?: InputMaybe<Scalars['Decimal']['input']>;
  cashBuyingPower?: InputMaybe<Scalars['Decimal']['input']>;
  cashForOpenOrders?: InputMaybe<Scalars['Decimal']['input']>;
  cashNet?: InputMaybe<Scalars['Decimal']['input']>;
  cashOpenOrderReserveDT?: InputMaybe<Scalars['Decimal']['input']>;
  cashSettledForInvestment?: InputMaybe<Scalars['Decimal']['input']>;
  cashUnsettledForInvestment?: InputMaybe<Scalars['Decimal']['input']>;
  closedDate?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  equityRegt?: InputMaybe<Scalars['Decimal']['input']>;
  equityRegtPercent?: InputMaybe<Scalars['Decimal']['input']>;
  externalId?: InputMaybe<Scalars['String']['input']>;
  files?: InputMaybe<FileCreateNestedManyWithoutAccountInput>;
  fundsWithheldFromPurchasingPower?: InputMaybe<Scalars['Decimal']['input']>;
  fundsWithheldFromWithdrawal?: InputMaybe<Scalars['Decimal']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  institution?: InputMaybe<AccountInstitution>;
  key?: InputMaybe<Scalars['String']['input']>;
  liveURL?: InputMaybe<Scalars['String']['input']>;
  liveURLCreated?: InputMaybe<Scalars['DateTime']['input']>;
  lotSeededDate?: InputMaybe<Scalars['DateTime']['input']>;
  lots?: InputMaybe<LotCreateNestedManyWithoutAccountInput>;
  marginBuyingPower?: InputMaybe<Scalars['Decimal']['input']>;
  marginBuyingPowerDT?: InputMaybe<Scalars['Decimal']['input']>;
  marginOpenOrderReserveDT?: InputMaybe<Scalars['Decimal']['input']>;
  marketValueTotal?: InputMaybe<Scalars['Decimal']['input']>;
  mode?: InputMaybe<AccountMode>;
  name?: InputMaybe<Scalars['String']['input']>;
  optionLevel?: InputMaybe<OptionLevel>;
  plaidAccountMask?: InputMaybe<Scalars['String']['input']>;
  portfolio: PortfolioCreateNestedOneWithoutAccountsInput;
  positions?: InputMaybe<PositionCreateNestedManyWithoutAccountInput>;
  provider?: InputMaybe<AccountProvider>;
  raw?: InputMaybe<Scalars['JSON']['input']>;
  realizedPAndL?: InputMaybe<RealizedPAndLCreateNestedManyWithoutAccountInput>;
  setRealizedValues?: InputMaybe<Scalars['Boolean']['input']>;
  skipSetup?: InputMaybe<Scalars['Boolean']['input']>;
  status?: InputMaybe<AccountStatus>;
  subType?: InputMaybe<Scalars['String']['input']>;
  transactions?: InputMaybe<TransactionCreateNestedManyWithoutAccountInput>;
  type?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
  uploadedPositions?: InputMaybe<Scalars['Boolean']['input']>;
};

export type AccountCreateManyAuthConnectionInput = {
  accountValueTotal?: InputMaybe<Scalars['Decimal']['input']>;
  balanceAccount?: InputMaybe<Scalars['Decimal']['input']>;
  balanceMoneyMarket?: InputMaybe<Scalars['Decimal']['input']>;
  balanceShortAdjustment?: InputMaybe<Scalars['Decimal']['input']>;
  cashAvailableForInvestment?: InputMaybe<Scalars['Decimal']['input']>;
  cashBalance?: InputMaybe<Scalars['Decimal']['input']>;
  cashBuyingPower?: InputMaybe<Scalars['Decimal']['input']>;
  cashForOpenOrders?: InputMaybe<Scalars['Decimal']['input']>;
  cashNet?: InputMaybe<Scalars['Decimal']['input']>;
  cashOpenOrderReserveDT?: InputMaybe<Scalars['Decimal']['input']>;
  cashSettledForInvestment?: InputMaybe<Scalars['Decimal']['input']>;
  cashUnsettledForInvestment?: InputMaybe<Scalars['Decimal']['input']>;
  closedDate?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  createdById: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  equityRegt?: InputMaybe<Scalars['Decimal']['input']>;
  equityRegtPercent?: InputMaybe<Scalars['Decimal']['input']>;
  externalId?: InputMaybe<Scalars['String']['input']>;
  fundsWithheldFromPurchasingPower?: InputMaybe<Scalars['Decimal']['input']>;
  fundsWithheldFromWithdrawal?: InputMaybe<Scalars['Decimal']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  institution?: InputMaybe<AccountInstitution>;
  key?: InputMaybe<Scalars['String']['input']>;
  liveURL?: InputMaybe<Scalars['String']['input']>;
  liveURLCreated?: InputMaybe<Scalars['DateTime']['input']>;
  lotSeededDate?: InputMaybe<Scalars['DateTime']['input']>;
  marginBuyingPower?: InputMaybe<Scalars['Decimal']['input']>;
  marginBuyingPowerDT?: InputMaybe<Scalars['Decimal']['input']>;
  marginOpenOrderReserveDT?: InputMaybe<Scalars['Decimal']['input']>;
  marketValueTotal?: InputMaybe<Scalars['Decimal']['input']>;
  mode?: InputMaybe<AccountMode>;
  name?: InputMaybe<Scalars['String']['input']>;
  optionLevel?: InputMaybe<OptionLevel>;
  plaidAccountMask?: InputMaybe<Scalars['String']['input']>;
  provider?: InputMaybe<AccountProvider>;
  raw?: InputMaybe<Scalars['JSON']['input']>;
  setRealizedValues?: InputMaybe<Scalars['Boolean']['input']>;
  skipSetup?: InputMaybe<Scalars['Boolean']['input']>;
  status?: InputMaybe<AccountStatus>;
  subType?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
  uploadedPositions?: InputMaybe<Scalars['Boolean']['input']>;
};

export type AccountCreateManyAuthConnectionInputEnvelope = {
  data: Array<AccountCreateManyAuthConnectionInput>;
  skipDuplicates?: InputMaybe<Scalars['Boolean']['input']>;
};

export type AccountCreateManyCreatedByInput = {
  accountValueTotal?: InputMaybe<Scalars['Decimal']['input']>;
  authConnectionId?: InputMaybe<Scalars['String']['input']>;
  balanceAccount?: InputMaybe<Scalars['Decimal']['input']>;
  balanceMoneyMarket?: InputMaybe<Scalars['Decimal']['input']>;
  balanceShortAdjustment?: InputMaybe<Scalars['Decimal']['input']>;
  cashAvailableForInvestment?: InputMaybe<Scalars['Decimal']['input']>;
  cashBalance?: InputMaybe<Scalars['Decimal']['input']>;
  cashBuyingPower?: InputMaybe<Scalars['Decimal']['input']>;
  cashForOpenOrders?: InputMaybe<Scalars['Decimal']['input']>;
  cashNet?: InputMaybe<Scalars['Decimal']['input']>;
  cashOpenOrderReserveDT?: InputMaybe<Scalars['Decimal']['input']>;
  cashSettledForInvestment?: InputMaybe<Scalars['Decimal']['input']>;
  cashUnsettledForInvestment?: InputMaybe<Scalars['Decimal']['input']>;
  closedDate?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  equityRegt?: InputMaybe<Scalars['Decimal']['input']>;
  equityRegtPercent?: InputMaybe<Scalars['Decimal']['input']>;
  externalId?: InputMaybe<Scalars['String']['input']>;
  fundsWithheldFromPurchasingPower?: InputMaybe<Scalars['Decimal']['input']>;
  fundsWithheldFromWithdrawal?: InputMaybe<Scalars['Decimal']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  institution?: InputMaybe<AccountInstitution>;
  key?: InputMaybe<Scalars['String']['input']>;
  liveURL?: InputMaybe<Scalars['String']['input']>;
  liveURLCreated?: InputMaybe<Scalars['DateTime']['input']>;
  lotSeededDate?: InputMaybe<Scalars['DateTime']['input']>;
  marginBuyingPower?: InputMaybe<Scalars['Decimal']['input']>;
  marginBuyingPowerDT?: InputMaybe<Scalars['Decimal']['input']>;
  marginOpenOrderReserveDT?: InputMaybe<Scalars['Decimal']['input']>;
  marketValueTotal?: InputMaybe<Scalars['Decimal']['input']>;
  mode?: InputMaybe<AccountMode>;
  name?: InputMaybe<Scalars['String']['input']>;
  optionLevel?: InputMaybe<OptionLevel>;
  plaidAccountMask?: InputMaybe<Scalars['String']['input']>;
  provider?: InputMaybe<AccountProvider>;
  raw?: InputMaybe<Scalars['JSON']['input']>;
  setRealizedValues?: InputMaybe<Scalars['Boolean']['input']>;
  skipSetup?: InputMaybe<Scalars['Boolean']['input']>;
  status?: InputMaybe<AccountStatus>;
  subType?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
  uploadedPositions?: InputMaybe<Scalars['Boolean']['input']>;
};

export type AccountCreateManyCreatedByInputEnvelope = {
  data: Array<AccountCreateManyCreatedByInput>;
  skipDuplicates?: InputMaybe<Scalars['Boolean']['input']>;
};

export type AccountCreateManyPortfolioInput = {
  accountValueTotal?: InputMaybe<Scalars['Decimal']['input']>;
  authConnectionId?: InputMaybe<Scalars['String']['input']>;
  balanceAccount?: InputMaybe<Scalars['Decimal']['input']>;
  balanceMoneyMarket?: InputMaybe<Scalars['Decimal']['input']>;
  balanceShortAdjustment?: InputMaybe<Scalars['Decimal']['input']>;
  cashAvailableForInvestment?: InputMaybe<Scalars['Decimal']['input']>;
  cashBalance?: InputMaybe<Scalars['Decimal']['input']>;
  cashBuyingPower?: InputMaybe<Scalars['Decimal']['input']>;
  cashForOpenOrders?: InputMaybe<Scalars['Decimal']['input']>;
  cashNet?: InputMaybe<Scalars['Decimal']['input']>;
  cashOpenOrderReserveDT?: InputMaybe<Scalars['Decimal']['input']>;
  cashSettledForInvestment?: InputMaybe<Scalars['Decimal']['input']>;
  cashUnsettledForInvestment?: InputMaybe<Scalars['Decimal']['input']>;
  closedDate?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  createdById: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  equityRegt?: InputMaybe<Scalars['Decimal']['input']>;
  equityRegtPercent?: InputMaybe<Scalars['Decimal']['input']>;
  externalId?: InputMaybe<Scalars['String']['input']>;
  fundsWithheldFromPurchasingPower?: InputMaybe<Scalars['Decimal']['input']>;
  fundsWithheldFromWithdrawal?: InputMaybe<Scalars['Decimal']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  institution?: InputMaybe<AccountInstitution>;
  key?: InputMaybe<Scalars['String']['input']>;
  liveURL?: InputMaybe<Scalars['String']['input']>;
  liveURLCreated?: InputMaybe<Scalars['DateTime']['input']>;
  lotSeededDate?: InputMaybe<Scalars['DateTime']['input']>;
  marginBuyingPower?: InputMaybe<Scalars['Decimal']['input']>;
  marginBuyingPowerDT?: InputMaybe<Scalars['Decimal']['input']>;
  marginOpenOrderReserveDT?: InputMaybe<Scalars['Decimal']['input']>;
  marketValueTotal?: InputMaybe<Scalars['Decimal']['input']>;
  mode?: InputMaybe<AccountMode>;
  name?: InputMaybe<Scalars['String']['input']>;
  optionLevel?: InputMaybe<OptionLevel>;
  plaidAccountMask?: InputMaybe<Scalars['String']['input']>;
  provider?: InputMaybe<AccountProvider>;
  raw?: InputMaybe<Scalars['JSON']['input']>;
  setRealizedValues?: InputMaybe<Scalars['Boolean']['input']>;
  skipSetup?: InputMaybe<Scalars['Boolean']['input']>;
  status?: InputMaybe<AccountStatus>;
  subType?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
  uploadedPositions?: InputMaybe<Scalars['Boolean']['input']>;
};

export type AccountCreateManyPortfolioInputEnvelope = {
  data: Array<AccountCreateManyPortfolioInput>;
  skipDuplicates?: InputMaybe<Scalars['Boolean']['input']>;
};

export type AccountCreateNestedManyWithoutAuthConnectionInput = {
  connect?: InputMaybe<Array<AccountWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<AccountCreateOrConnectWithoutAuthConnectionInput>>;
  create?: InputMaybe<Array<AccountCreateWithoutAuthConnectionInput>>;
  createMany?: InputMaybe<AccountCreateManyAuthConnectionInputEnvelope>;
};

export type AccountCreateNestedManyWithoutCreatedByInput = {
  connect?: InputMaybe<Array<AccountWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<AccountCreateOrConnectWithoutCreatedByInput>>;
  create?: InputMaybe<Array<AccountCreateWithoutCreatedByInput>>;
  createMany?: InputMaybe<AccountCreateManyCreatedByInputEnvelope>;
};

export type AccountCreateNestedManyWithoutPortfolioInput = {
  connect?: InputMaybe<Array<AccountWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<AccountCreateOrConnectWithoutPortfolioInput>>;
  create?: InputMaybe<Array<AccountCreateWithoutPortfolioInput>>;
  createMany?: InputMaybe<AccountCreateManyPortfolioInputEnvelope>;
};

export type AccountCreateNestedOneWithoutFilesInput = {
  connect?: InputMaybe<AccountWhereUniqueInput>;
  connectOrCreate?: InputMaybe<AccountCreateOrConnectWithoutFilesInput>;
  create?: InputMaybe<AccountCreateWithoutFilesInput>;
};

export type AccountCreateNestedOneWithoutLotsInput = {
  connect?: InputMaybe<AccountWhereUniqueInput>;
  connectOrCreate?: InputMaybe<AccountCreateOrConnectWithoutLotsInput>;
  create?: InputMaybe<AccountCreateWithoutLotsInput>;
};

export type AccountCreateNestedOneWithoutPositionsInput = {
  connect?: InputMaybe<AccountWhereUniqueInput>;
  connectOrCreate?: InputMaybe<AccountCreateOrConnectWithoutPositionsInput>;
  create?: InputMaybe<AccountCreateWithoutPositionsInput>;
};

export type AccountCreateNestedOneWithoutRealizedPAndLInput = {
  connect?: InputMaybe<AccountWhereUniqueInput>;
  connectOrCreate?: InputMaybe<AccountCreateOrConnectWithoutRealizedPAndLInput>;
  create?: InputMaybe<AccountCreateWithoutRealizedPAndLInput>;
};

export type AccountCreateNestedOneWithoutTransactionsInput = {
  connect?: InputMaybe<AccountWhereUniqueInput>;
  connectOrCreate?: InputMaybe<AccountCreateOrConnectWithoutTransactionsInput>;
  create?: InputMaybe<AccountCreateWithoutTransactionsInput>;
};

export type AccountCreateOrConnectWithoutAuthConnectionInput = {
  create: AccountCreateWithoutAuthConnectionInput;
  where: AccountWhereUniqueInput;
};

export type AccountCreateOrConnectWithoutCreatedByInput = {
  create: AccountCreateWithoutCreatedByInput;
  where: AccountWhereUniqueInput;
};

export type AccountCreateOrConnectWithoutFilesInput = {
  create: AccountCreateWithoutFilesInput;
  where: AccountWhereUniqueInput;
};

export type AccountCreateOrConnectWithoutLotsInput = {
  create: AccountCreateWithoutLotsInput;
  where: AccountWhereUniqueInput;
};

export type AccountCreateOrConnectWithoutPortfolioInput = {
  create: AccountCreateWithoutPortfolioInput;
  where: AccountWhereUniqueInput;
};

export type AccountCreateOrConnectWithoutPositionsInput = {
  create: AccountCreateWithoutPositionsInput;
  where: AccountWhereUniqueInput;
};

export type AccountCreateOrConnectWithoutRealizedPAndLInput = {
  create: AccountCreateWithoutRealizedPAndLInput;
  where: AccountWhereUniqueInput;
};

export type AccountCreateOrConnectWithoutTransactionsInput = {
  create: AccountCreateWithoutTransactionsInput;
  where: AccountWhereUniqueInput;
};

export type AccountCreateWithoutAuthConnectionInput = {
  accountValueTotal?: InputMaybe<Scalars['Decimal']['input']>;
  balanceAccount?: InputMaybe<Scalars['Decimal']['input']>;
  balanceMoneyMarket?: InputMaybe<Scalars['Decimal']['input']>;
  balanceShortAdjustment?: InputMaybe<Scalars['Decimal']['input']>;
  cashAvailableForInvestment?: InputMaybe<Scalars['Decimal']['input']>;
  cashBalance?: InputMaybe<Scalars['Decimal']['input']>;
  cashBuyingPower?: InputMaybe<Scalars['Decimal']['input']>;
  cashForOpenOrders?: InputMaybe<Scalars['Decimal']['input']>;
  cashNet?: InputMaybe<Scalars['Decimal']['input']>;
  cashOpenOrderReserveDT?: InputMaybe<Scalars['Decimal']['input']>;
  cashSettledForInvestment?: InputMaybe<Scalars['Decimal']['input']>;
  cashUnsettledForInvestment?: InputMaybe<Scalars['Decimal']['input']>;
  closedDate?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  equityRegt?: InputMaybe<Scalars['Decimal']['input']>;
  equityRegtPercent?: InputMaybe<Scalars['Decimal']['input']>;
  externalId?: InputMaybe<Scalars['String']['input']>;
  files?: InputMaybe<FileCreateNestedManyWithoutAccountInput>;
  fundsWithheldFromPurchasingPower?: InputMaybe<Scalars['Decimal']['input']>;
  fundsWithheldFromWithdrawal?: InputMaybe<Scalars['Decimal']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  institution?: InputMaybe<AccountInstitution>;
  key?: InputMaybe<Scalars['String']['input']>;
  liveURL?: InputMaybe<Scalars['String']['input']>;
  liveURLCreated?: InputMaybe<Scalars['DateTime']['input']>;
  lotSeededDate?: InputMaybe<Scalars['DateTime']['input']>;
  lots?: InputMaybe<LotCreateNestedManyWithoutAccountInput>;
  marginBuyingPower?: InputMaybe<Scalars['Decimal']['input']>;
  marginBuyingPowerDT?: InputMaybe<Scalars['Decimal']['input']>;
  marginOpenOrderReserveDT?: InputMaybe<Scalars['Decimal']['input']>;
  marketValueTotal?: InputMaybe<Scalars['Decimal']['input']>;
  mode?: InputMaybe<AccountMode>;
  name?: InputMaybe<Scalars['String']['input']>;
  optionLevel?: InputMaybe<OptionLevel>;
  plaidAccountMask?: InputMaybe<Scalars['String']['input']>;
  portfolio: PortfolioCreateNestedOneWithoutAccountsInput;
  positions?: InputMaybe<PositionCreateNestedManyWithoutAccountInput>;
  provider?: InputMaybe<AccountProvider>;
  raw?: InputMaybe<Scalars['JSON']['input']>;
  realizedPAndL?: InputMaybe<RealizedPAndLCreateNestedManyWithoutAccountInput>;
  setRealizedValues?: InputMaybe<Scalars['Boolean']['input']>;
  skipSetup?: InputMaybe<Scalars['Boolean']['input']>;
  status?: InputMaybe<AccountStatus>;
  subType?: InputMaybe<Scalars['String']['input']>;
  transactions?: InputMaybe<TransactionCreateNestedManyWithoutAccountInput>;
  type?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
  uploadedPositions?: InputMaybe<Scalars['Boolean']['input']>;
};

export type AccountCreateWithoutCreatedByInput = {
  accountValueTotal?: InputMaybe<Scalars['Decimal']['input']>;
  authConnection?: InputMaybe<AuthConnectionCreateNestedOneWithoutAccountsInput>;
  balanceAccount?: InputMaybe<Scalars['Decimal']['input']>;
  balanceMoneyMarket?: InputMaybe<Scalars['Decimal']['input']>;
  balanceShortAdjustment?: InputMaybe<Scalars['Decimal']['input']>;
  cashAvailableForInvestment?: InputMaybe<Scalars['Decimal']['input']>;
  cashBalance?: InputMaybe<Scalars['Decimal']['input']>;
  cashBuyingPower?: InputMaybe<Scalars['Decimal']['input']>;
  cashForOpenOrders?: InputMaybe<Scalars['Decimal']['input']>;
  cashNet?: InputMaybe<Scalars['Decimal']['input']>;
  cashOpenOrderReserveDT?: InputMaybe<Scalars['Decimal']['input']>;
  cashSettledForInvestment?: InputMaybe<Scalars['Decimal']['input']>;
  cashUnsettledForInvestment?: InputMaybe<Scalars['Decimal']['input']>;
  closedDate?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  equityRegt?: InputMaybe<Scalars['Decimal']['input']>;
  equityRegtPercent?: InputMaybe<Scalars['Decimal']['input']>;
  externalId?: InputMaybe<Scalars['String']['input']>;
  files?: InputMaybe<FileCreateNestedManyWithoutAccountInput>;
  fundsWithheldFromPurchasingPower?: InputMaybe<Scalars['Decimal']['input']>;
  fundsWithheldFromWithdrawal?: InputMaybe<Scalars['Decimal']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  institution?: InputMaybe<AccountInstitution>;
  key?: InputMaybe<Scalars['String']['input']>;
  liveURL?: InputMaybe<Scalars['String']['input']>;
  liveURLCreated?: InputMaybe<Scalars['DateTime']['input']>;
  lotSeededDate?: InputMaybe<Scalars['DateTime']['input']>;
  lots?: InputMaybe<LotCreateNestedManyWithoutAccountInput>;
  marginBuyingPower?: InputMaybe<Scalars['Decimal']['input']>;
  marginBuyingPowerDT?: InputMaybe<Scalars['Decimal']['input']>;
  marginOpenOrderReserveDT?: InputMaybe<Scalars['Decimal']['input']>;
  marketValueTotal?: InputMaybe<Scalars['Decimal']['input']>;
  mode?: InputMaybe<AccountMode>;
  name?: InputMaybe<Scalars['String']['input']>;
  optionLevel?: InputMaybe<OptionLevel>;
  plaidAccountMask?: InputMaybe<Scalars['String']['input']>;
  portfolio: PortfolioCreateNestedOneWithoutAccountsInput;
  positions?: InputMaybe<PositionCreateNestedManyWithoutAccountInput>;
  provider?: InputMaybe<AccountProvider>;
  raw?: InputMaybe<Scalars['JSON']['input']>;
  realizedPAndL?: InputMaybe<RealizedPAndLCreateNestedManyWithoutAccountInput>;
  setRealizedValues?: InputMaybe<Scalars['Boolean']['input']>;
  skipSetup?: InputMaybe<Scalars['Boolean']['input']>;
  status?: InputMaybe<AccountStatus>;
  subType?: InputMaybe<Scalars['String']['input']>;
  transactions?: InputMaybe<TransactionCreateNestedManyWithoutAccountInput>;
  type?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
  uploadedPositions?: InputMaybe<Scalars['Boolean']['input']>;
};

export type AccountCreateWithoutFilesInput = {
  accountValueTotal?: InputMaybe<Scalars['Decimal']['input']>;
  authConnection?: InputMaybe<AuthConnectionCreateNestedOneWithoutAccountsInput>;
  balanceAccount?: InputMaybe<Scalars['Decimal']['input']>;
  balanceMoneyMarket?: InputMaybe<Scalars['Decimal']['input']>;
  balanceShortAdjustment?: InputMaybe<Scalars['Decimal']['input']>;
  cashAvailableForInvestment?: InputMaybe<Scalars['Decimal']['input']>;
  cashBalance?: InputMaybe<Scalars['Decimal']['input']>;
  cashBuyingPower?: InputMaybe<Scalars['Decimal']['input']>;
  cashForOpenOrders?: InputMaybe<Scalars['Decimal']['input']>;
  cashNet?: InputMaybe<Scalars['Decimal']['input']>;
  cashOpenOrderReserveDT?: InputMaybe<Scalars['Decimal']['input']>;
  cashSettledForInvestment?: InputMaybe<Scalars['Decimal']['input']>;
  cashUnsettledForInvestment?: InputMaybe<Scalars['Decimal']['input']>;
  closedDate?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  equityRegt?: InputMaybe<Scalars['Decimal']['input']>;
  equityRegtPercent?: InputMaybe<Scalars['Decimal']['input']>;
  externalId?: InputMaybe<Scalars['String']['input']>;
  fundsWithheldFromPurchasingPower?: InputMaybe<Scalars['Decimal']['input']>;
  fundsWithheldFromWithdrawal?: InputMaybe<Scalars['Decimal']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  institution?: InputMaybe<AccountInstitution>;
  key?: InputMaybe<Scalars['String']['input']>;
  liveURL?: InputMaybe<Scalars['String']['input']>;
  liveURLCreated?: InputMaybe<Scalars['DateTime']['input']>;
  lotSeededDate?: InputMaybe<Scalars['DateTime']['input']>;
  lots?: InputMaybe<LotCreateNestedManyWithoutAccountInput>;
  marginBuyingPower?: InputMaybe<Scalars['Decimal']['input']>;
  marginBuyingPowerDT?: InputMaybe<Scalars['Decimal']['input']>;
  marginOpenOrderReserveDT?: InputMaybe<Scalars['Decimal']['input']>;
  marketValueTotal?: InputMaybe<Scalars['Decimal']['input']>;
  mode?: InputMaybe<AccountMode>;
  name?: InputMaybe<Scalars['String']['input']>;
  optionLevel?: InputMaybe<OptionLevel>;
  plaidAccountMask?: InputMaybe<Scalars['String']['input']>;
  portfolio: PortfolioCreateNestedOneWithoutAccountsInput;
  positions?: InputMaybe<PositionCreateNestedManyWithoutAccountInput>;
  provider?: InputMaybe<AccountProvider>;
  raw?: InputMaybe<Scalars['JSON']['input']>;
  realizedPAndL?: InputMaybe<RealizedPAndLCreateNestedManyWithoutAccountInput>;
  setRealizedValues?: InputMaybe<Scalars['Boolean']['input']>;
  skipSetup?: InputMaybe<Scalars['Boolean']['input']>;
  status?: InputMaybe<AccountStatus>;
  subType?: InputMaybe<Scalars['String']['input']>;
  transactions?: InputMaybe<TransactionCreateNestedManyWithoutAccountInput>;
  type?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
  uploadedPositions?: InputMaybe<Scalars['Boolean']['input']>;
};

export type AccountCreateWithoutLotsInput = {
  accountValueTotal?: InputMaybe<Scalars['Decimal']['input']>;
  authConnection?: InputMaybe<AuthConnectionCreateNestedOneWithoutAccountsInput>;
  balanceAccount?: InputMaybe<Scalars['Decimal']['input']>;
  balanceMoneyMarket?: InputMaybe<Scalars['Decimal']['input']>;
  balanceShortAdjustment?: InputMaybe<Scalars['Decimal']['input']>;
  cashAvailableForInvestment?: InputMaybe<Scalars['Decimal']['input']>;
  cashBalance?: InputMaybe<Scalars['Decimal']['input']>;
  cashBuyingPower?: InputMaybe<Scalars['Decimal']['input']>;
  cashForOpenOrders?: InputMaybe<Scalars['Decimal']['input']>;
  cashNet?: InputMaybe<Scalars['Decimal']['input']>;
  cashOpenOrderReserveDT?: InputMaybe<Scalars['Decimal']['input']>;
  cashSettledForInvestment?: InputMaybe<Scalars['Decimal']['input']>;
  cashUnsettledForInvestment?: InputMaybe<Scalars['Decimal']['input']>;
  closedDate?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  equityRegt?: InputMaybe<Scalars['Decimal']['input']>;
  equityRegtPercent?: InputMaybe<Scalars['Decimal']['input']>;
  externalId?: InputMaybe<Scalars['String']['input']>;
  files?: InputMaybe<FileCreateNestedManyWithoutAccountInput>;
  fundsWithheldFromPurchasingPower?: InputMaybe<Scalars['Decimal']['input']>;
  fundsWithheldFromWithdrawal?: InputMaybe<Scalars['Decimal']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  institution?: InputMaybe<AccountInstitution>;
  key?: InputMaybe<Scalars['String']['input']>;
  liveURL?: InputMaybe<Scalars['String']['input']>;
  liveURLCreated?: InputMaybe<Scalars['DateTime']['input']>;
  lotSeededDate?: InputMaybe<Scalars['DateTime']['input']>;
  marginBuyingPower?: InputMaybe<Scalars['Decimal']['input']>;
  marginBuyingPowerDT?: InputMaybe<Scalars['Decimal']['input']>;
  marginOpenOrderReserveDT?: InputMaybe<Scalars['Decimal']['input']>;
  marketValueTotal?: InputMaybe<Scalars['Decimal']['input']>;
  mode?: InputMaybe<AccountMode>;
  name?: InputMaybe<Scalars['String']['input']>;
  optionLevel?: InputMaybe<OptionLevel>;
  plaidAccountMask?: InputMaybe<Scalars['String']['input']>;
  portfolio: PortfolioCreateNestedOneWithoutAccountsInput;
  positions?: InputMaybe<PositionCreateNestedManyWithoutAccountInput>;
  provider?: InputMaybe<AccountProvider>;
  raw?: InputMaybe<Scalars['JSON']['input']>;
  realizedPAndL?: InputMaybe<RealizedPAndLCreateNestedManyWithoutAccountInput>;
  setRealizedValues?: InputMaybe<Scalars['Boolean']['input']>;
  skipSetup?: InputMaybe<Scalars['Boolean']['input']>;
  status?: InputMaybe<AccountStatus>;
  subType?: InputMaybe<Scalars['String']['input']>;
  transactions?: InputMaybe<TransactionCreateNestedManyWithoutAccountInput>;
  type?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
  uploadedPositions?: InputMaybe<Scalars['Boolean']['input']>;
};

export type AccountCreateWithoutPortfolioInput = {
  accountValueTotal?: InputMaybe<Scalars['Decimal']['input']>;
  authConnection?: InputMaybe<AuthConnectionCreateNestedOneWithoutAccountsInput>;
  balanceAccount?: InputMaybe<Scalars['Decimal']['input']>;
  balanceMoneyMarket?: InputMaybe<Scalars['Decimal']['input']>;
  balanceShortAdjustment?: InputMaybe<Scalars['Decimal']['input']>;
  cashAvailableForInvestment?: InputMaybe<Scalars['Decimal']['input']>;
  cashBalance?: InputMaybe<Scalars['Decimal']['input']>;
  cashBuyingPower?: InputMaybe<Scalars['Decimal']['input']>;
  cashForOpenOrders?: InputMaybe<Scalars['Decimal']['input']>;
  cashNet?: InputMaybe<Scalars['Decimal']['input']>;
  cashOpenOrderReserveDT?: InputMaybe<Scalars['Decimal']['input']>;
  cashSettledForInvestment?: InputMaybe<Scalars['Decimal']['input']>;
  cashUnsettledForInvestment?: InputMaybe<Scalars['Decimal']['input']>;
  closedDate?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  equityRegt?: InputMaybe<Scalars['Decimal']['input']>;
  equityRegtPercent?: InputMaybe<Scalars['Decimal']['input']>;
  externalId?: InputMaybe<Scalars['String']['input']>;
  files?: InputMaybe<FileCreateNestedManyWithoutAccountInput>;
  fundsWithheldFromPurchasingPower?: InputMaybe<Scalars['Decimal']['input']>;
  fundsWithheldFromWithdrawal?: InputMaybe<Scalars['Decimal']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  institution?: InputMaybe<AccountInstitution>;
  key?: InputMaybe<Scalars['String']['input']>;
  liveURL?: InputMaybe<Scalars['String']['input']>;
  liveURLCreated?: InputMaybe<Scalars['DateTime']['input']>;
  lotSeededDate?: InputMaybe<Scalars['DateTime']['input']>;
  lots?: InputMaybe<LotCreateNestedManyWithoutAccountInput>;
  marginBuyingPower?: InputMaybe<Scalars['Decimal']['input']>;
  marginBuyingPowerDT?: InputMaybe<Scalars['Decimal']['input']>;
  marginOpenOrderReserveDT?: InputMaybe<Scalars['Decimal']['input']>;
  marketValueTotal?: InputMaybe<Scalars['Decimal']['input']>;
  mode?: InputMaybe<AccountMode>;
  name?: InputMaybe<Scalars['String']['input']>;
  optionLevel?: InputMaybe<OptionLevel>;
  plaidAccountMask?: InputMaybe<Scalars['String']['input']>;
  positions?: InputMaybe<PositionCreateNestedManyWithoutAccountInput>;
  provider?: InputMaybe<AccountProvider>;
  raw?: InputMaybe<Scalars['JSON']['input']>;
  realizedPAndL?: InputMaybe<RealizedPAndLCreateNestedManyWithoutAccountInput>;
  setRealizedValues?: InputMaybe<Scalars['Boolean']['input']>;
  skipSetup?: InputMaybe<Scalars['Boolean']['input']>;
  status?: InputMaybe<AccountStatus>;
  subType?: InputMaybe<Scalars['String']['input']>;
  transactions?: InputMaybe<TransactionCreateNestedManyWithoutAccountInput>;
  type?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
  uploadedPositions?: InputMaybe<Scalars['Boolean']['input']>;
};

export type AccountCreateWithoutPositionsInput = {
  accountValueTotal?: InputMaybe<Scalars['Decimal']['input']>;
  authConnection?: InputMaybe<AuthConnectionCreateNestedOneWithoutAccountsInput>;
  balanceAccount?: InputMaybe<Scalars['Decimal']['input']>;
  balanceMoneyMarket?: InputMaybe<Scalars['Decimal']['input']>;
  balanceShortAdjustment?: InputMaybe<Scalars['Decimal']['input']>;
  cashAvailableForInvestment?: InputMaybe<Scalars['Decimal']['input']>;
  cashBalance?: InputMaybe<Scalars['Decimal']['input']>;
  cashBuyingPower?: InputMaybe<Scalars['Decimal']['input']>;
  cashForOpenOrders?: InputMaybe<Scalars['Decimal']['input']>;
  cashNet?: InputMaybe<Scalars['Decimal']['input']>;
  cashOpenOrderReserveDT?: InputMaybe<Scalars['Decimal']['input']>;
  cashSettledForInvestment?: InputMaybe<Scalars['Decimal']['input']>;
  cashUnsettledForInvestment?: InputMaybe<Scalars['Decimal']['input']>;
  closedDate?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  equityRegt?: InputMaybe<Scalars['Decimal']['input']>;
  equityRegtPercent?: InputMaybe<Scalars['Decimal']['input']>;
  externalId?: InputMaybe<Scalars['String']['input']>;
  files?: InputMaybe<FileCreateNestedManyWithoutAccountInput>;
  fundsWithheldFromPurchasingPower?: InputMaybe<Scalars['Decimal']['input']>;
  fundsWithheldFromWithdrawal?: InputMaybe<Scalars['Decimal']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  institution?: InputMaybe<AccountInstitution>;
  key?: InputMaybe<Scalars['String']['input']>;
  liveURL?: InputMaybe<Scalars['String']['input']>;
  liveURLCreated?: InputMaybe<Scalars['DateTime']['input']>;
  lotSeededDate?: InputMaybe<Scalars['DateTime']['input']>;
  lots?: InputMaybe<LotCreateNestedManyWithoutAccountInput>;
  marginBuyingPower?: InputMaybe<Scalars['Decimal']['input']>;
  marginBuyingPowerDT?: InputMaybe<Scalars['Decimal']['input']>;
  marginOpenOrderReserveDT?: InputMaybe<Scalars['Decimal']['input']>;
  marketValueTotal?: InputMaybe<Scalars['Decimal']['input']>;
  mode?: InputMaybe<AccountMode>;
  name?: InputMaybe<Scalars['String']['input']>;
  optionLevel?: InputMaybe<OptionLevel>;
  plaidAccountMask?: InputMaybe<Scalars['String']['input']>;
  portfolio: PortfolioCreateNestedOneWithoutAccountsInput;
  provider?: InputMaybe<AccountProvider>;
  raw?: InputMaybe<Scalars['JSON']['input']>;
  realizedPAndL?: InputMaybe<RealizedPAndLCreateNestedManyWithoutAccountInput>;
  setRealizedValues?: InputMaybe<Scalars['Boolean']['input']>;
  skipSetup?: InputMaybe<Scalars['Boolean']['input']>;
  status?: InputMaybe<AccountStatus>;
  subType?: InputMaybe<Scalars['String']['input']>;
  transactions?: InputMaybe<TransactionCreateNestedManyWithoutAccountInput>;
  type?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
  uploadedPositions?: InputMaybe<Scalars['Boolean']['input']>;
};

export type AccountCreateWithoutRealizedPAndLInput = {
  accountValueTotal?: InputMaybe<Scalars['Decimal']['input']>;
  authConnection?: InputMaybe<AuthConnectionCreateNestedOneWithoutAccountsInput>;
  balanceAccount?: InputMaybe<Scalars['Decimal']['input']>;
  balanceMoneyMarket?: InputMaybe<Scalars['Decimal']['input']>;
  balanceShortAdjustment?: InputMaybe<Scalars['Decimal']['input']>;
  cashAvailableForInvestment?: InputMaybe<Scalars['Decimal']['input']>;
  cashBalance?: InputMaybe<Scalars['Decimal']['input']>;
  cashBuyingPower?: InputMaybe<Scalars['Decimal']['input']>;
  cashForOpenOrders?: InputMaybe<Scalars['Decimal']['input']>;
  cashNet?: InputMaybe<Scalars['Decimal']['input']>;
  cashOpenOrderReserveDT?: InputMaybe<Scalars['Decimal']['input']>;
  cashSettledForInvestment?: InputMaybe<Scalars['Decimal']['input']>;
  cashUnsettledForInvestment?: InputMaybe<Scalars['Decimal']['input']>;
  closedDate?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  equityRegt?: InputMaybe<Scalars['Decimal']['input']>;
  equityRegtPercent?: InputMaybe<Scalars['Decimal']['input']>;
  externalId?: InputMaybe<Scalars['String']['input']>;
  files?: InputMaybe<FileCreateNestedManyWithoutAccountInput>;
  fundsWithheldFromPurchasingPower?: InputMaybe<Scalars['Decimal']['input']>;
  fundsWithheldFromWithdrawal?: InputMaybe<Scalars['Decimal']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  institution?: InputMaybe<AccountInstitution>;
  key?: InputMaybe<Scalars['String']['input']>;
  liveURL?: InputMaybe<Scalars['String']['input']>;
  liveURLCreated?: InputMaybe<Scalars['DateTime']['input']>;
  lotSeededDate?: InputMaybe<Scalars['DateTime']['input']>;
  lots?: InputMaybe<LotCreateNestedManyWithoutAccountInput>;
  marginBuyingPower?: InputMaybe<Scalars['Decimal']['input']>;
  marginBuyingPowerDT?: InputMaybe<Scalars['Decimal']['input']>;
  marginOpenOrderReserveDT?: InputMaybe<Scalars['Decimal']['input']>;
  marketValueTotal?: InputMaybe<Scalars['Decimal']['input']>;
  mode?: InputMaybe<AccountMode>;
  name?: InputMaybe<Scalars['String']['input']>;
  optionLevel?: InputMaybe<OptionLevel>;
  plaidAccountMask?: InputMaybe<Scalars['String']['input']>;
  portfolio: PortfolioCreateNestedOneWithoutAccountsInput;
  positions?: InputMaybe<PositionCreateNestedManyWithoutAccountInput>;
  provider?: InputMaybe<AccountProvider>;
  raw?: InputMaybe<Scalars['JSON']['input']>;
  setRealizedValues?: InputMaybe<Scalars['Boolean']['input']>;
  skipSetup?: InputMaybe<Scalars['Boolean']['input']>;
  status?: InputMaybe<AccountStatus>;
  subType?: InputMaybe<Scalars['String']['input']>;
  transactions?: InputMaybe<TransactionCreateNestedManyWithoutAccountInput>;
  type?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
  uploadedPositions?: InputMaybe<Scalars['Boolean']['input']>;
};

export type AccountCreateWithoutTransactionsInput = {
  accountValueTotal?: InputMaybe<Scalars['Decimal']['input']>;
  authConnection?: InputMaybe<AuthConnectionCreateNestedOneWithoutAccountsInput>;
  balanceAccount?: InputMaybe<Scalars['Decimal']['input']>;
  balanceMoneyMarket?: InputMaybe<Scalars['Decimal']['input']>;
  balanceShortAdjustment?: InputMaybe<Scalars['Decimal']['input']>;
  cashAvailableForInvestment?: InputMaybe<Scalars['Decimal']['input']>;
  cashBalance?: InputMaybe<Scalars['Decimal']['input']>;
  cashBuyingPower?: InputMaybe<Scalars['Decimal']['input']>;
  cashForOpenOrders?: InputMaybe<Scalars['Decimal']['input']>;
  cashNet?: InputMaybe<Scalars['Decimal']['input']>;
  cashOpenOrderReserveDT?: InputMaybe<Scalars['Decimal']['input']>;
  cashSettledForInvestment?: InputMaybe<Scalars['Decimal']['input']>;
  cashUnsettledForInvestment?: InputMaybe<Scalars['Decimal']['input']>;
  closedDate?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  equityRegt?: InputMaybe<Scalars['Decimal']['input']>;
  equityRegtPercent?: InputMaybe<Scalars['Decimal']['input']>;
  externalId?: InputMaybe<Scalars['String']['input']>;
  files?: InputMaybe<FileCreateNestedManyWithoutAccountInput>;
  fundsWithheldFromPurchasingPower?: InputMaybe<Scalars['Decimal']['input']>;
  fundsWithheldFromWithdrawal?: InputMaybe<Scalars['Decimal']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  institution?: InputMaybe<AccountInstitution>;
  key?: InputMaybe<Scalars['String']['input']>;
  liveURL?: InputMaybe<Scalars['String']['input']>;
  liveURLCreated?: InputMaybe<Scalars['DateTime']['input']>;
  lotSeededDate?: InputMaybe<Scalars['DateTime']['input']>;
  lots?: InputMaybe<LotCreateNestedManyWithoutAccountInput>;
  marginBuyingPower?: InputMaybe<Scalars['Decimal']['input']>;
  marginBuyingPowerDT?: InputMaybe<Scalars['Decimal']['input']>;
  marginOpenOrderReserveDT?: InputMaybe<Scalars['Decimal']['input']>;
  marketValueTotal?: InputMaybe<Scalars['Decimal']['input']>;
  mode?: InputMaybe<AccountMode>;
  name?: InputMaybe<Scalars['String']['input']>;
  optionLevel?: InputMaybe<OptionLevel>;
  plaidAccountMask?: InputMaybe<Scalars['String']['input']>;
  portfolio: PortfolioCreateNestedOneWithoutAccountsInput;
  positions?: InputMaybe<PositionCreateNestedManyWithoutAccountInput>;
  provider?: InputMaybe<AccountProvider>;
  raw?: InputMaybe<Scalars['JSON']['input']>;
  realizedPAndL?: InputMaybe<RealizedPAndLCreateNestedManyWithoutAccountInput>;
  setRealizedValues?: InputMaybe<Scalars['Boolean']['input']>;
  skipSetup?: InputMaybe<Scalars['Boolean']['input']>;
  status?: InputMaybe<AccountStatus>;
  subType?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
  uploadedPositions?: InputMaybe<Scalars['Boolean']['input']>;
};

export enum AccountInstitution {
  Auto = 'AUTO',
  Autoloan = 'AUTOLOAN',
  Beta = 'BETA',
  Brokerage = 'BROKERAGE',
  CcBalancetransfer = 'CC_BALANCETRANSFER',
  External = 'EXTERNAL',
  Futures = 'FUTURES',
  Ganis = 'GANIS',
  Genpact = 'GENPACT',
  GenpactLead = 'GENPACT_LEAD',
  Globaltrading = 'GLOBALTRADING',
  Heil = 'HEIL',
  Heloc = 'HELOC',
  Lending = 'LENDING',
  Loyalty = 'LOYALTY',
  Mortgage = 'MORTGAGE',
  Nonus = 'NONUS',
  Ontrack = 'ONTRACK',
  Rjo = 'RJO',
  Sbasket = 'SBASKET',
  Stockplan = 'STOCKPLAN',
  Visa = 'VISA',
  Wdbh = 'WDBH'
}

export type AccountListRelationFilter = {
  every?: InputMaybe<AccountWhereInput>;
  none?: InputMaybe<AccountWhereInput>;
  some?: InputMaybe<AccountWhereInput>;
};

export type AccountMaxAggregate = {
  __typename?: 'AccountMaxAggregate';
  accountValueTotal?: Maybe<Scalars['Decimal']['output']>;
  authConnectionId?: Maybe<Scalars['String']['output']>;
  balanceAccount?: Maybe<Scalars['Decimal']['output']>;
  balanceMoneyMarket?: Maybe<Scalars['Decimal']['output']>;
  balanceShortAdjustment?: Maybe<Scalars['Decimal']['output']>;
  cashAvailableForInvestment?: Maybe<Scalars['Decimal']['output']>;
  cashBalance?: Maybe<Scalars['Decimal']['output']>;
  cashBuyingPower?: Maybe<Scalars['Decimal']['output']>;
  cashForOpenOrders?: Maybe<Scalars['Decimal']['output']>;
  cashNet?: Maybe<Scalars['Decimal']['output']>;
  cashOpenOrderReserveDT?: Maybe<Scalars['Decimal']['output']>;
  cashSettledForInvestment?: Maybe<Scalars['Decimal']['output']>;
  cashUnsettledForInvestment?: Maybe<Scalars['Decimal']['output']>;
  closedDate?: Maybe<Scalars['DateTime']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  createdById?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  equityRegt?: Maybe<Scalars['Decimal']['output']>;
  equityRegtPercent?: Maybe<Scalars['Decimal']['output']>;
  externalId?: Maybe<Scalars['String']['output']>;
  fundsWithheldFromPurchasingPower?: Maybe<Scalars['Decimal']['output']>;
  fundsWithheldFromWithdrawal?: Maybe<Scalars['Decimal']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  institution?: Maybe<AccountInstitution>;
  key?: Maybe<Scalars['String']['output']>;
  liveURL?: Maybe<Scalars['String']['output']>;
  liveURLCreated?: Maybe<Scalars['DateTime']['output']>;
  lotSeededDate?: Maybe<Scalars['DateTime']['output']>;
  marginBuyingPower?: Maybe<Scalars['Decimal']['output']>;
  marginBuyingPowerDT?: Maybe<Scalars['Decimal']['output']>;
  marginOpenOrderReserveDT?: Maybe<Scalars['Decimal']['output']>;
  marketValueTotal?: Maybe<Scalars['Decimal']['output']>;
  mode?: Maybe<AccountMode>;
  name?: Maybe<Scalars['String']['output']>;
  optionLevel?: Maybe<OptionLevel>;
  plaidAccountMask?: Maybe<Scalars['String']['output']>;
  portfolioId?: Maybe<Scalars['String']['output']>;
  provider?: Maybe<AccountProvider>;
  setRealizedValues?: Maybe<Scalars['Boolean']['output']>;
  skipSetup?: Maybe<Scalars['Boolean']['output']>;
  status?: Maybe<AccountStatus>;
  subType?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  uploadedPositions?: Maybe<Scalars['Boolean']['output']>;
};

export type AccountMinAggregate = {
  __typename?: 'AccountMinAggregate';
  accountValueTotal?: Maybe<Scalars['Decimal']['output']>;
  authConnectionId?: Maybe<Scalars['String']['output']>;
  balanceAccount?: Maybe<Scalars['Decimal']['output']>;
  balanceMoneyMarket?: Maybe<Scalars['Decimal']['output']>;
  balanceShortAdjustment?: Maybe<Scalars['Decimal']['output']>;
  cashAvailableForInvestment?: Maybe<Scalars['Decimal']['output']>;
  cashBalance?: Maybe<Scalars['Decimal']['output']>;
  cashBuyingPower?: Maybe<Scalars['Decimal']['output']>;
  cashForOpenOrders?: Maybe<Scalars['Decimal']['output']>;
  cashNet?: Maybe<Scalars['Decimal']['output']>;
  cashOpenOrderReserveDT?: Maybe<Scalars['Decimal']['output']>;
  cashSettledForInvestment?: Maybe<Scalars['Decimal']['output']>;
  cashUnsettledForInvestment?: Maybe<Scalars['Decimal']['output']>;
  closedDate?: Maybe<Scalars['DateTime']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  createdById?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  equityRegt?: Maybe<Scalars['Decimal']['output']>;
  equityRegtPercent?: Maybe<Scalars['Decimal']['output']>;
  externalId?: Maybe<Scalars['String']['output']>;
  fundsWithheldFromPurchasingPower?: Maybe<Scalars['Decimal']['output']>;
  fundsWithheldFromWithdrawal?: Maybe<Scalars['Decimal']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  institution?: Maybe<AccountInstitution>;
  key?: Maybe<Scalars['String']['output']>;
  liveURL?: Maybe<Scalars['String']['output']>;
  liveURLCreated?: Maybe<Scalars['DateTime']['output']>;
  lotSeededDate?: Maybe<Scalars['DateTime']['output']>;
  marginBuyingPower?: Maybe<Scalars['Decimal']['output']>;
  marginBuyingPowerDT?: Maybe<Scalars['Decimal']['output']>;
  marginOpenOrderReserveDT?: Maybe<Scalars['Decimal']['output']>;
  marketValueTotal?: Maybe<Scalars['Decimal']['output']>;
  mode?: Maybe<AccountMode>;
  name?: Maybe<Scalars['String']['output']>;
  optionLevel?: Maybe<OptionLevel>;
  plaidAccountMask?: Maybe<Scalars['String']['output']>;
  portfolioId?: Maybe<Scalars['String']['output']>;
  provider?: Maybe<AccountProvider>;
  setRealizedValues?: Maybe<Scalars['Boolean']['output']>;
  skipSetup?: Maybe<Scalars['Boolean']['output']>;
  status?: Maybe<AccountStatus>;
  subType?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  uploadedPositions?: Maybe<Scalars['Boolean']['output']>;
};

export enum AccountMode {
  Cash = 'CASH',
  Cd = 'CD',
  Checking = 'CHECKING',
  Ira = 'IRA',
  Margin = 'MARGIN',
  Savings = 'SAVINGS'
}

/** The provider of the account */
export enum AccountProvider {
  Etrade = 'ETRADE',
  Plaid = 'PLAID',
  System = 'SYSTEM',
  Unconnected = 'UNCONNECTED'
}

export type AccountProviderExternalIdCompoundUniqueInput = {
  externalId: Scalars['String']['input'];
  provider: AccountProvider;
};

export type AccountScalarRelationFilter = {
  is?: InputMaybe<AccountWhereInput>;
  isNot?: InputMaybe<AccountWhereInput>;
};

export type AccountScalarWhereInput = {
  AND?: InputMaybe<Array<AccountScalarWhereInput>>;
  NOT?: InputMaybe<Array<AccountScalarWhereInput>>;
  OR?: InputMaybe<Array<AccountScalarWhereInput>>;
  accountValueTotal?: InputMaybe<DecimalNullableFilter>;
  authConnectionId?: InputMaybe<UuidNullableFilter>;
  balanceAccount?: InputMaybe<DecimalNullableFilter>;
  balanceMoneyMarket?: InputMaybe<DecimalNullableFilter>;
  balanceShortAdjustment?: InputMaybe<DecimalNullableFilter>;
  cashAvailableForInvestment?: InputMaybe<DecimalNullableFilter>;
  cashBalance?: InputMaybe<DecimalNullableFilter>;
  cashBuyingPower?: InputMaybe<DecimalNullableFilter>;
  cashForOpenOrders?: InputMaybe<DecimalNullableFilter>;
  cashNet?: InputMaybe<DecimalNullableFilter>;
  cashOpenOrderReserveDT?: InputMaybe<DecimalNullableFilter>;
  cashSettledForInvestment?: InputMaybe<DecimalNullableFilter>;
  cashUnsettledForInvestment?: InputMaybe<DecimalNullableFilter>;
  closedDate?: InputMaybe<DateTimeNullableFilter>;
  createdAt?: InputMaybe<DateTimeFilter>;
  createdById?: InputMaybe<StringFilter>;
  description?: InputMaybe<StringNullableFilter>;
  equityRegt?: InputMaybe<DecimalNullableFilter>;
  equityRegtPercent?: InputMaybe<DecimalNullableFilter>;
  externalId?: InputMaybe<StringNullableFilter>;
  fundsWithheldFromPurchasingPower?: InputMaybe<DecimalNullableFilter>;
  fundsWithheldFromWithdrawal?: InputMaybe<DecimalNullableFilter>;
  id?: InputMaybe<UuidFilter>;
  institution?: InputMaybe<EnumAccountInstitutionNullableFilter>;
  key?: InputMaybe<StringNullableFilter>;
  liveURL?: InputMaybe<StringNullableFilter>;
  liveURLCreated?: InputMaybe<DateTimeNullableFilter>;
  lotSeededDate?: InputMaybe<DateTimeNullableFilter>;
  marginBuyingPower?: InputMaybe<DecimalNullableFilter>;
  marginBuyingPowerDT?: InputMaybe<DecimalNullableFilter>;
  marginOpenOrderReserveDT?: InputMaybe<DecimalNullableFilter>;
  marketValueTotal?: InputMaybe<DecimalNullableFilter>;
  mode?: InputMaybe<EnumAccountModeNullableFilter>;
  name?: InputMaybe<StringNullableFilter>;
  optionLevel?: InputMaybe<EnumOptionLevelNullableFilter>;
  plaidAccountMask?: InputMaybe<StringNullableFilter>;
  portfolioId?: InputMaybe<UuidFilter>;
  provider?: InputMaybe<EnumAccountProviderFilter>;
  raw?: InputMaybe<JsonNullableFilter>;
  setRealizedValues?: InputMaybe<BoolFilter>;
  skipSetup?: InputMaybe<BoolFilter>;
  status?: InputMaybe<EnumAccountStatusFilter>;
  subType?: InputMaybe<StringNullableFilter>;
  type?: InputMaybe<StringFilter>;
  updatedAt?: InputMaybe<DateTimeFilter>;
  uploadedPositions?: InputMaybe<BoolFilter>;
};

export enum AccountStatus {
  Active = 'ACTIVE',
  Closed = 'CLOSED'
}

export type AccountSumAggregate = {
  __typename?: 'AccountSumAggregate';
  accountValueTotal?: Maybe<Scalars['Decimal']['output']>;
  balanceAccount?: Maybe<Scalars['Decimal']['output']>;
  balanceMoneyMarket?: Maybe<Scalars['Decimal']['output']>;
  balanceShortAdjustment?: Maybe<Scalars['Decimal']['output']>;
  cashAvailableForInvestment?: Maybe<Scalars['Decimal']['output']>;
  cashBalance?: Maybe<Scalars['Decimal']['output']>;
  cashBuyingPower?: Maybe<Scalars['Decimal']['output']>;
  cashForOpenOrders?: Maybe<Scalars['Decimal']['output']>;
  cashNet?: Maybe<Scalars['Decimal']['output']>;
  cashOpenOrderReserveDT?: Maybe<Scalars['Decimal']['output']>;
  cashSettledForInvestment?: Maybe<Scalars['Decimal']['output']>;
  cashUnsettledForInvestment?: Maybe<Scalars['Decimal']['output']>;
  equityRegt?: Maybe<Scalars['Decimal']['output']>;
  equityRegtPercent?: Maybe<Scalars['Decimal']['output']>;
  fundsWithheldFromPurchasingPower?: Maybe<Scalars['Decimal']['output']>;
  fundsWithheldFromWithdrawal?: Maybe<Scalars['Decimal']['output']>;
  marginBuyingPower?: Maybe<Scalars['Decimal']['output']>;
  marginBuyingPowerDT?: Maybe<Scalars['Decimal']['output']>;
  marginOpenOrderReserveDT?: Maybe<Scalars['Decimal']['output']>;
  marketValueTotal?: Maybe<Scalars['Decimal']['output']>;
};

export type AccountUpdateInput = {
  accountValueTotal?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  authConnection?: InputMaybe<AuthConnectionUpdateOneWithoutAccountsNestedInput>;
  balanceAccount?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  balanceMoneyMarket?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  balanceShortAdjustment?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  cashAvailableForInvestment?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  cashBalance?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  cashBuyingPower?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  cashForOpenOrders?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  cashNet?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  cashOpenOrderReserveDT?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  cashSettledForInvestment?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  cashUnsettledForInvestment?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  closedDate?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  createdBy?: InputMaybe<UserUpdateOneRequiredWithoutAccountNestedInput>;
  description?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  equityRegt?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  equityRegtPercent?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  externalId?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  files?: InputMaybe<FileUpdateManyWithoutAccountNestedInput>;
  fundsWithheldFromPurchasingPower?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  fundsWithheldFromWithdrawal?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  institution?: InputMaybe<NullableEnumAccountInstitutionFieldUpdateOperationsInput>;
  key?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  liveURL?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  liveURLCreated?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  lotSeededDate?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  lots?: InputMaybe<LotUpdateManyWithoutAccountNestedInput>;
  marginBuyingPower?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  marginBuyingPowerDT?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  marginOpenOrderReserveDT?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  marketValueTotal?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  mode?: InputMaybe<NullableEnumAccountModeFieldUpdateOperationsInput>;
  name?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  optionLevel?: InputMaybe<NullableEnumOptionLevelFieldUpdateOperationsInput>;
  plaidAccountMask?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  portfolio?: InputMaybe<PortfolioUpdateOneRequiredWithoutAccountsNestedInput>;
  positions?: InputMaybe<PositionUpdateManyWithoutAccountNestedInput>;
  provider?: InputMaybe<EnumAccountProviderFieldUpdateOperationsInput>;
  raw?: InputMaybe<Scalars['JSON']['input']>;
  realizedPAndL?: InputMaybe<RealizedPAndLUpdateManyWithoutAccountNestedInput>;
  setRealizedValues?: InputMaybe<BoolFieldUpdateOperationsInput>;
  skipSetup?: InputMaybe<BoolFieldUpdateOperationsInput>;
  status?: InputMaybe<EnumAccountStatusFieldUpdateOperationsInput>;
  subType?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  transactions?: InputMaybe<TransactionUpdateManyWithoutAccountNestedInput>;
  type?: InputMaybe<StringFieldUpdateOperationsInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  uploadedPositions?: InputMaybe<BoolFieldUpdateOperationsInput>;
};

export type AccountUpdateManyMutationInput = {
  accountValueTotal?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  balanceAccount?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  balanceMoneyMarket?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  balanceShortAdjustment?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  cashAvailableForInvestment?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  cashBalance?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  cashBuyingPower?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  cashForOpenOrders?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  cashNet?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  cashOpenOrderReserveDT?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  cashSettledForInvestment?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  cashUnsettledForInvestment?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  closedDate?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  description?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  equityRegt?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  equityRegtPercent?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  externalId?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  fundsWithheldFromPurchasingPower?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  fundsWithheldFromWithdrawal?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  institution?: InputMaybe<NullableEnumAccountInstitutionFieldUpdateOperationsInput>;
  key?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  liveURL?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  liveURLCreated?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  lotSeededDate?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  marginBuyingPower?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  marginBuyingPowerDT?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  marginOpenOrderReserveDT?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  marketValueTotal?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  mode?: InputMaybe<NullableEnumAccountModeFieldUpdateOperationsInput>;
  name?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  optionLevel?: InputMaybe<NullableEnumOptionLevelFieldUpdateOperationsInput>;
  plaidAccountMask?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  provider?: InputMaybe<EnumAccountProviderFieldUpdateOperationsInput>;
  raw?: InputMaybe<Scalars['JSON']['input']>;
  setRealizedValues?: InputMaybe<BoolFieldUpdateOperationsInput>;
  skipSetup?: InputMaybe<BoolFieldUpdateOperationsInput>;
  status?: InputMaybe<EnumAccountStatusFieldUpdateOperationsInput>;
  subType?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  type?: InputMaybe<StringFieldUpdateOperationsInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  uploadedPositions?: InputMaybe<BoolFieldUpdateOperationsInput>;
};

export type AccountUpdateManyWithWhereWithoutAuthConnectionInput = {
  data: AccountUpdateManyMutationInput;
  where: AccountScalarWhereInput;
};

export type AccountUpdateManyWithWhereWithoutCreatedByInput = {
  data: AccountUpdateManyMutationInput;
  where: AccountScalarWhereInput;
};

export type AccountUpdateManyWithWhereWithoutPortfolioInput = {
  data: AccountUpdateManyMutationInput;
  where: AccountScalarWhereInput;
};

export type AccountUpdateManyWithoutAuthConnectionNestedInput = {
  connect?: InputMaybe<Array<AccountWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<AccountCreateOrConnectWithoutAuthConnectionInput>>;
  create?: InputMaybe<Array<AccountCreateWithoutAuthConnectionInput>>;
  createMany?: InputMaybe<AccountCreateManyAuthConnectionInputEnvelope>;
  delete?: InputMaybe<Array<AccountWhereUniqueInput>>;
  deleteMany?: InputMaybe<Array<AccountScalarWhereInput>>;
  disconnect?: InputMaybe<Array<AccountWhereUniqueInput>>;
  set?: InputMaybe<Array<AccountWhereUniqueInput>>;
  update?: InputMaybe<Array<AccountUpdateWithWhereUniqueWithoutAuthConnectionInput>>;
  updateMany?: InputMaybe<Array<AccountUpdateManyWithWhereWithoutAuthConnectionInput>>;
  upsert?: InputMaybe<Array<AccountUpsertWithWhereUniqueWithoutAuthConnectionInput>>;
};

export type AccountUpdateManyWithoutCreatedByNestedInput = {
  connect?: InputMaybe<Array<AccountWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<AccountCreateOrConnectWithoutCreatedByInput>>;
  create?: InputMaybe<Array<AccountCreateWithoutCreatedByInput>>;
  createMany?: InputMaybe<AccountCreateManyCreatedByInputEnvelope>;
  delete?: InputMaybe<Array<AccountWhereUniqueInput>>;
  deleteMany?: InputMaybe<Array<AccountScalarWhereInput>>;
  disconnect?: InputMaybe<Array<AccountWhereUniqueInput>>;
  set?: InputMaybe<Array<AccountWhereUniqueInput>>;
  update?: InputMaybe<Array<AccountUpdateWithWhereUniqueWithoutCreatedByInput>>;
  updateMany?: InputMaybe<Array<AccountUpdateManyWithWhereWithoutCreatedByInput>>;
  upsert?: InputMaybe<Array<AccountUpsertWithWhereUniqueWithoutCreatedByInput>>;
};

export type AccountUpdateManyWithoutPortfolioNestedInput = {
  connect?: InputMaybe<Array<AccountWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<AccountCreateOrConnectWithoutPortfolioInput>>;
  create?: InputMaybe<Array<AccountCreateWithoutPortfolioInput>>;
  createMany?: InputMaybe<AccountCreateManyPortfolioInputEnvelope>;
  delete?: InputMaybe<Array<AccountWhereUniqueInput>>;
  deleteMany?: InputMaybe<Array<AccountScalarWhereInput>>;
  disconnect?: InputMaybe<Array<AccountWhereUniqueInput>>;
  set?: InputMaybe<Array<AccountWhereUniqueInput>>;
  update?: InputMaybe<Array<AccountUpdateWithWhereUniqueWithoutPortfolioInput>>;
  updateMany?: InputMaybe<Array<AccountUpdateManyWithWhereWithoutPortfolioInput>>;
  upsert?: InputMaybe<Array<AccountUpsertWithWhereUniqueWithoutPortfolioInput>>;
};

export type AccountUpdateOneRequiredWithoutFilesNestedInput = {
  connect?: InputMaybe<AccountWhereUniqueInput>;
  connectOrCreate?: InputMaybe<AccountCreateOrConnectWithoutFilesInput>;
  create?: InputMaybe<AccountCreateWithoutFilesInput>;
  update?: InputMaybe<AccountUpdateToOneWithWhereWithoutFilesInput>;
  upsert?: InputMaybe<AccountUpsertWithoutFilesInput>;
};

export type AccountUpdateOneRequiredWithoutLotsNestedInput = {
  connect?: InputMaybe<AccountWhereUniqueInput>;
  connectOrCreate?: InputMaybe<AccountCreateOrConnectWithoutLotsInput>;
  create?: InputMaybe<AccountCreateWithoutLotsInput>;
  update?: InputMaybe<AccountUpdateToOneWithWhereWithoutLotsInput>;
  upsert?: InputMaybe<AccountUpsertWithoutLotsInput>;
};

export type AccountUpdateOneRequiredWithoutPositionsNestedInput = {
  connect?: InputMaybe<AccountWhereUniqueInput>;
  connectOrCreate?: InputMaybe<AccountCreateOrConnectWithoutPositionsInput>;
  create?: InputMaybe<AccountCreateWithoutPositionsInput>;
  update?: InputMaybe<AccountUpdateToOneWithWhereWithoutPositionsInput>;
  upsert?: InputMaybe<AccountUpsertWithoutPositionsInput>;
};

export type AccountUpdateOneRequiredWithoutRealizedPAndLNestedInput = {
  connect?: InputMaybe<AccountWhereUniqueInput>;
  connectOrCreate?: InputMaybe<AccountCreateOrConnectWithoutRealizedPAndLInput>;
  create?: InputMaybe<AccountCreateWithoutRealizedPAndLInput>;
  update?: InputMaybe<AccountUpdateToOneWithWhereWithoutRealizedPAndLInput>;
  upsert?: InputMaybe<AccountUpsertWithoutRealizedPAndLInput>;
};

export type AccountUpdateOneRequiredWithoutTransactionsNestedInput = {
  connect?: InputMaybe<AccountWhereUniqueInput>;
  connectOrCreate?: InputMaybe<AccountCreateOrConnectWithoutTransactionsInput>;
  create?: InputMaybe<AccountCreateWithoutTransactionsInput>;
  update?: InputMaybe<AccountUpdateToOneWithWhereWithoutTransactionsInput>;
  upsert?: InputMaybe<AccountUpsertWithoutTransactionsInput>;
};

export type AccountUpdateToOneWithWhereWithoutFilesInput = {
  data: AccountUpdateWithoutFilesInput;
  where?: InputMaybe<AccountWhereInput>;
};

export type AccountUpdateToOneWithWhereWithoutLotsInput = {
  data: AccountUpdateWithoutLotsInput;
  where?: InputMaybe<AccountWhereInput>;
};

export type AccountUpdateToOneWithWhereWithoutPositionsInput = {
  data: AccountUpdateWithoutPositionsInput;
  where?: InputMaybe<AccountWhereInput>;
};

export type AccountUpdateToOneWithWhereWithoutRealizedPAndLInput = {
  data: AccountUpdateWithoutRealizedPAndLInput;
  where?: InputMaybe<AccountWhereInput>;
};

export type AccountUpdateToOneWithWhereWithoutTransactionsInput = {
  data: AccountUpdateWithoutTransactionsInput;
  where?: InputMaybe<AccountWhereInput>;
};

export type AccountUpdateWithWhereUniqueWithoutAuthConnectionInput = {
  data: AccountUpdateWithoutAuthConnectionInput;
  where: AccountWhereUniqueInput;
};

export type AccountUpdateWithWhereUniqueWithoutCreatedByInput = {
  data: AccountUpdateWithoutCreatedByInput;
  where: AccountWhereUniqueInput;
};

export type AccountUpdateWithWhereUniqueWithoutPortfolioInput = {
  data: AccountUpdateWithoutPortfolioInput;
  where: AccountWhereUniqueInput;
};

export type AccountUpdateWithoutAuthConnectionInput = {
  accountValueTotal?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  balanceAccount?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  balanceMoneyMarket?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  balanceShortAdjustment?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  cashAvailableForInvestment?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  cashBalance?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  cashBuyingPower?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  cashForOpenOrders?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  cashNet?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  cashOpenOrderReserveDT?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  cashSettledForInvestment?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  cashUnsettledForInvestment?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  closedDate?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  createdBy?: InputMaybe<UserUpdateOneRequiredWithoutAccountNestedInput>;
  description?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  equityRegt?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  equityRegtPercent?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  externalId?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  files?: InputMaybe<FileUpdateManyWithoutAccountNestedInput>;
  fundsWithheldFromPurchasingPower?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  fundsWithheldFromWithdrawal?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  institution?: InputMaybe<NullableEnumAccountInstitutionFieldUpdateOperationsInput>;
  key?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  liveURL?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  liveURLCreated?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  lotSeededDate?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  lots?: InputMaybe<LotUpdateManyWithoutAccountNestedInput>;
  marginBuyingPower?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  marginBuyingPowerDT?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  marginOpenOrderReserveDT?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  marketValueTotal?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  mode?: InputMaybe<NullableEnumAccountModeFieldUpdateOperationsInput>;
  name?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  optionLevel?: InputMaybe<NullableEnumOptionLevelFieldUpdateOperationsInput>;
  plaidAccountMask?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  portfolio?: InputMaybe<PortfolioUpdateOneRequiredWithoutAccountsNestedInput>;
  positions?: InputMaybe<PositionUpdateManyWithoutAccountNestedInput>;
  provider?: InputMaybe<EnumAccountProviderFieldUpdateOperationsInput>;
  raw?: InputMaybe<Scalars['JSON']['input']>;
  realizedPAndL?: InputMaybe<RealizedPAndLUpdateManyWithoutAccountNestedInput>;
  setRealizedValues?: InputMaybe<BoolFieldUpdateOperationsInput>;
  skipSetup?: InputMaybe<BoolFieldUpdateOperationsInput>;
  status?: InputMaybe<EnumAccountStatusFieldUpdateOperationsInput>;
  subType?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  transactions?: InputMaybe<TransactionUpdateManyWithoutAccountNestedInput>;
  type?: InputMaybe<StringFieldUpdateOperationsInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  uploadedPositions?: InputMaybe<BoolFieldUpdateOperationsInput>;
};

export type AccountUpdateWithoutCreatedByInput = {
  accountValueTotal?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  authConnection?: InputMaybe<AuthConnectionUpdateOneWithoutAccountsNestedInput>;
  balanceAccount?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  balanceMoneyMarket?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  balanceShortAdjustment?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  cashAvailableForInvestment?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  cashBalance?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  cashBuyingPower?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  cashForOpenOrders?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  cashNet?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  cashOpenOrderReserveDT?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  cashSettledForInvestment?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  cashUnsettledForInvestment?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  closedDate?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  description?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  equityRegt?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  equityRegtPercent?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  externalId?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  files?: InputMaybe<FileUpdateManyWithoutAccountNestedInput>;
  fundsWithheldFromPurchasingPower?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  fundsWithheldFromWithdrawal?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  institution?: InputMaybe<NullableEnumAccountInstitutionFieldUpdateOperationsInput>;
  key?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  liveURL?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  liveURLCreated?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  lotSeededDate?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  lots?: InputMaybe<LotUpdateManyWithoutAccountNestedInput>;
  marginBuyingPower?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  marginBuyingPowerDT?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  marginOpenOrderReserveDT?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  marketValueTotal?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  mode?: InputMaybe<NullableEnumAccountModeFieldUpdateOperationsInput>;
  name?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  optionLevel?: InputMaybe<NullableEnumOptionLevelFieldUpdateOperationsInput>;
  plaidAccountMask?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  portfolio?: InputMaybe<PortfolioUpdateOneRequiredWithoutAccountsNestedInput>;
  positions?: InputMaybe<PositionUpdateManyWithoutAccountNestedInput>;
  provider?: InputMaybe<EnumAccountProviderFieldUpdateOperationsInput>;
  raw?: InputMaybe<Scalars['JSON']['input']>;
  realizedPAndL?: InputMaybe<RealizedPAndLUpdateManyWithoutAccountNestedInput>;
  setRealizedValues?: InputMaybe<BoolFieldUpdateOperationsInput>;
  skipSetup?: InputMaybe<BoolFieldUpdateOperationsInput>;
  status?: InputMaybe<EnumAccountStatusFieldUpdateOperationsInput>;
  subType?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  transactions?: InputMaybe<TransactionUpdateManyWithoutAccountNestedInput>;
  type?: InputMaybe<StringFieldUpdateOperationsInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  uploadedPositions?: InputMaybe<BoolFieldUpdateOperationsInput>;
};

export type AccountUpdateWithoutFilesInput = {
  accountValueTotal?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  authConnection?: InputMaybe<AuthConnectionUpdateOneWithoutAccountsNestedInput>;
  balanceAccount?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  balanceMoneyMarket?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  balanceShortAdjustment?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  cashAvailableForInvestment?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  cashBalance?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  cashBuyingPower?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  cashForOpenOrders?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  cashNet?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  cashOpenOrderReserveDT?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  cashSettledForInvestment?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  cashUnsettledForInvestment?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  closedDate?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  createdBy?: InputMaybe<UserUpdateOneRequiredWithoutAccountNestedInput>;
  description?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  equityRegt?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  equityRegtPercent?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  externalId?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  fundsWithheldFromPurchasingPower?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  fundsWithheldFromWithdrawal?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  institution?: InputMaybe<NullableEnumAccountInstitutionFieldUpdateOperationsInput>;
  key?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  liveURL?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  liveURLCreated?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  lotSeededDate?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  lots?: InputMaybe<LotUpdateManyWithoutAccountNestedInput>;
  marginBuyingPower?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  marginBuyingPowerDT?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  marginOpenOrderReserveDT?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  marketValueTotal?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  mode?: InputMaybe<NullableEnumAccountModeFieldUpdateOperationsInput>;
  name?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  optionLevel?: InputMaybe<NullableEnumOptionLevelFieldUpdateOperationsInput>;
  plaidAccountMask?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  portfolio?: InputMaybe<PortfolioUpdateOneRequiredWithoutAccountsNestedInput>;
  positions?: InputMaybe<PositionUpdateManyWithoutAccountNestedInput>;
  provider?: InputMaybe<EnumAccountProviderFieldUpdateOperationsInput>;
  raw?: InputMaybe<Scalars['JSON']['input']>;
  realizedPAndL?: InputMaybe<RealizedPAndLUpdateManyWithoutAccountNestedInput>;
  setRealizedValues?: InputMaybe<BoolFieldUpdateOperationsInput>;
  skipSetup?: InputMaybe<BoolFieldUpdateOperationsInput>;
  status?: InputMaybe<EnumAccountStatusFieldUpdateOperationsInput>;
  subType?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  transactions?: InputMaybe<TransactionUpdateManyWithoutAccountNestedInput>;
  type?: InputMaybe<StringFieldUpdateOperationsInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  uploadedPositions?: InputMaybe<BoolFieldUpdateOperationsInput>;
};

export type AccountUpdateWithoutLotsInput = {
  accountValueTotal?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  authConnection?: InputMaybe<AuthConnectionUpdateOneWithoutAccountsNestedInput>;
  balanceAccount?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  balanceMoneyMarket?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  balanceShortAdjustment?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  cashAvailableForInvestment?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  cashBalance?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  cashBuyingPower?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  cashForOpenOrders?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  cashNet?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  cashOpenOrderReserveDT?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  cashSettledForInvestment?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  cashUnsettledForInvestment?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  closedDate?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  createdBy?: InputMaybe<UserUpdateOneRequiredWithoutAccountNestedInput>;
  description?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  equityRegt?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  equityRegtPercent?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  externalId?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  files?: InputMaybe<FileUpdateManyWithoutAccountNestedInput>;
  fundsWithheldFromPurchasingPower?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  fundsWithheldFromWithdrawal?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  institution?: InputMaybe<NullableEnumAccountInstitutionFieldUpdateOperationsInput>;
  key?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  liveURL?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  liveURLCreated?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  lotSeededDate?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  marginBuyingPower?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  marginBuyingPowerDT?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  marginOpenOrderReserveDT?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  marketValueTotal?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  mode?: InputMaybe<NullableEnumAccountModeFieldUpdateOperationsInput>;
  name?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  optionLevel?: InputMaybe<NullableEnumOptionLevelFieldUpdateOperationsInput>;
  plaidAccountMask?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  portfolio?: InputMaybe<PortfolioUpdateOneRequiredWithoutAccountsNestedInput>;
  positions?: InputMaybe<PositionUpdateManyWithoutAccountNestedInput>;
  provider?: InputMaybe<EnumAccountProviderFieldUpdateOperationsInput>;
  raw?: InputMaybe<Scalars['JSON']['input']>;
  realizedPAndL?: InputMaybe<RealizedPAndLUpdateManyWithoutAccountNestedInput>;
  setRealizedValues?: InputMaybe<BoolFieldUpdateOperationsInput>;
  skipSetup?: InputMaybe<BoolFieldUpdateOperationsInput>;
  status?: InputMaybe<EnumAccountStatusFieldUpdateOperationsInput>;
  subType?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  transactions?: InputMaybe<TransactionUpdateManyWithoutAccountNestedInput>;
  type?: InputMaybe<StringFieldUpdateOperationsInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  uploadedPositions?: InputMaybe<BoolFieldUpdateOperationsInput>;
};

export type AccountUpdateWithoutPortfolioInput = {
  accountValueTotal?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  authConnection?: InputMaybe<AuthConnectionUpdateOneWithoutAccountsNestedInput>;
  balanceAccount?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  balanceMoneyMarket?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  balanceShortAdjustment?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  cashAvailableForInvestment?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  cashBalance?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  cashBuyingPower?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  cashForOpenOrders?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  cashNet?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  cashOpenOrderReserveDT?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  cashSettledForInvestment?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  cashUnsettledForInvestment?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  closedDate?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  createdBy?: InputMaybe<UserUpdateOneRequiredWithoutAccountNestedInput>;
  description?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  equityRegt?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  equityRegtPercent?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  externalId?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  files?: InputMaybe<FileUpdateManyWithoutAccountNestedInput>;
  fundsWithheldFromPurchasingPower?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  fundsWithheldFromWithdrawal?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  institution?: InputMaybe<NullableEnumAccountInstitutionFieldUpdateOperationsInput>;
  key?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  liveURL?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  liveURLCreated?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  lotSeededDate?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  lots?: InputMaybe<LotUpdateManyWithoutAccountNestedInput>;
  marginBuyingPower?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  marginBuyingPowerDT?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  marginOpenOrderReserveDT?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  marketValueTotal?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  mode?: InputMaybe<NullableEnumAccountModeFieldUpdateOperationsInput>;
  name?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  optionLevel?: InputMaybe<NullableEnumOptionLevelFieldUpdateOperationsInput>;
  plaidAccountMask?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  positions?: InputMaybe<PositionUpdateManyWithoutAccountNestedInput>;
  provider?: InputMaybe<EnumAccountProviderFieldUpdateOperationsInput>;
  raw?: InputMaybe<Scalars['JSON']['input']>;
  realizedPAndL?: InputMaybe<RealizedPAndLUpdateManyWithoutAccountNestedInput>;
  setRealizedValues?: InputMaybe<BoolFieldUpdateOperationsInput>;
  skipSetup?: InputMaybe<BoolFieldUpdateOperationsInput>;
  status?: InputMaybe<EnumAccountStatusFieldUpdateOperationsInput>;
  subType?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  transactions?: InputMaybe<TransactionUpdateManyWithoutAccountNestedInput>;
  type?: InputMaybe<StringFieldUpdateOperationsInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  uploadedPositions?: InputMaybe<BoolFieldUpdateOperationsInput>;
};

export type AccountUpdateWithoutPositionsInput = {
  accountValueTotal?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  authConnection?: InputMaybe<AuthConnectionUpdateOneWithoutAccountsNestedInput>;
  balanceAccount?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  balanceMoneyMarket?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  balanceShortAdjustment?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  cashAvailableForInvestment?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  cashBalance?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  cashBuyingPower?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  cashForOpenOrders?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  cashNet?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  cashOpenOrderReserveDT?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  cashSettledForInvestment?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  cashUnsettledForInvestment?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  closedDate?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  createdBy?: InputMaybe<UserUpdateOneRequiredWithoutAccountNestedInput>;
  description?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  equityRegt?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  equityRegtPercent?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  externalId?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  files?: InputMaybe<FileUpdateManyWithoutAccountNestedInput>;
  fundsWithheldFromPurchasingPower?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  fundsWithheldFromWithdrawal?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  institution?: InputMaybe<NullableEnumAccountInstitutionFieldUpdateOperationsInput>;
  key?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  liveURL?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  liveURLCreated?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  lotSeededDate?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  lots?: InputMaybe<LotUpdateManyWithoutAccountNestedInput>;
  marginBuyingPower?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  marginBuyingPowerDT?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  marginOpenOrderReserveDT?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  marketValueTotal?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  mode?: InputMaybe<NullableEnumAccountModeFieldUpdateOperationsInput>;
  name?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  optionLevel?: InputMaybe<NullableEnumOptionLevelFieldUpdateOperationsInput>;
  plaidAccountMask?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  portfolio?: InputMaybe<PortfolioUpdateOneRequiredWithoutAccountsNestedInput>;
  provider?: InputMaybe<EnumAccountProviderFieldUpdateOperationsInput>;
  raw?: InputMaybe<Scalars['JSON']['input']>;
  realizedPAndL?: InputMaybe<RealizedPAndLUpdateManyWithoutAccountNestedInput>;
  setRealizedValues?: InputMaybe<BoolFieldUpdateOperationsInput>;
  skipSetup?: InputMaybe<BoolFieldUpdateOperationsInput>;
  status?: InputMaybe<EnumAccountStatusFieldUpdateOperationsInput>;
  subType?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  transactions?: InputMaybe<TransactionUpdateManyWithoutAccountNestedInput>;
  type?: InputMaybe<StringFieldUpdateOperationsInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  uploadedPositions?: InputMaybe<BoolFieldUpdateOperationsInput>;
};

export type AccountUpdateWithoutRealizedPAndLInput = {
  accountValueTotal?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  authConnection?: InputMaybe<AuthConnectionUpdateOneWithoutAccountsNestedInput>;
  balanceAccount?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  balanceMoneyMarket?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  balanceShortAdjustment?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  cashAvailableForInvestment?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  cashBalance?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  cashBuyingPower?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  cashForOpenOrders?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  cashNet?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  cashOpenOrderReserveDT?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  cashSettledForInvestment?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  cashUnsettledForInvestment?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  closedDate?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  createdBy?: InputMaybe<UserUpdateOneRequiredWithoutAccountNestedInput>;
  description?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  equityRegt?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  equityRegtPercent?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  externalId?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  files?: InputMaybe<FileUpdateManyWithoutAccountNestedInput>;
  fundsWithheldFromPurchasingPower?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  fundsWithheldFromWithdrawal?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  institution?: InputMaybe<NullableEnumAccountInstitutionFieldUpdateOperationsInput>;
  key?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  liveURL?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  liveURLCreated?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  lotSeededDate?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  lots?: InputMaybe<LotUpdateManyWithoutAccountNestedInput>;
  marginBuyingPower?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  marginBuyingPowerDT?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  marginOpenOrderReserveDT?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  marketValueTotal?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  mode?: InputMaybe<NullableEnumAccountModeFieldUpdateOperationsInput>;
  name?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  optionLevel?: InputMaybe<NullableEnumOptionLevelFieldUpdateOperationsInput>;
  plaidAccountMask?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  portfolio?: InputMaybe<PortfolioUpdateOneRequiredWithoutAccountsNestedInput>;
  positions?: InputMaybe<PositionUpdateManyWithoutAccountNestedInput>;
  provider?: InputMaybe<EnumAccountProviderFieldUpdateOperationsInput>;
  raw?: InputMaybe<Scalars['JSON']['input']>;
  setRealizedValues?: InputMaybe<BoolFieldUpdateOperationsInput>;
  skipSetup?: InputMaybe<BoolFieldUpdateOperationsInput>;
  status?: InputMaybe<EnumAccountStatusFieldUpdateOperationsInput>;
  subType?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  transactions?: InputMaybe<TransactionUpdateManyWithoutAccountNestedInput>;
  type?: InputMaybe<StringFieldUpdateOperationsInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  uploadedPositions?: InputMaybe<BoolFieldUpdateOperationsInput>;
};

export type AccountUpdateWithoutTransactionsInput = {
  accountValueTotal?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  authConnection?: InputMaybe<AuthConnectionUpdateOneWithoutAccountsNestedInput>;
  balanceAccount?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  balanceMoneyMarket?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  balanceShortAdjustment?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  cashAvailableForInvestment?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  cashBalance?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  cashBuyingPower?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  cashForOpenOrders?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  cashNet?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  cashOpenOrderReserveDT?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  cashSettledForInvestment?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  cashUnsettledForInvestment?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  closedDate?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  createdBy?: InputMaybe<UserUpdateOneRequiredWithoutAccountNestedInput>;
  description?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  equityRegt?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  equityRegtPercent?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  externalId?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  files?: InputMaybe<FileUpdateManyWithoutAccountNestedInput>;
  fundsWithheldFromPurchasingPower?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  fundsWithheldFromWithdrawal?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  institution?: InputMaybe<NullableEnumAccountInstitutionFieldUpdateOperationsInput>;
  key?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  liveURL?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  liveURLCreated?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  lotSeededDate?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  lots?: InputMaybe<LotUpdateManyWithoutAccountNestedInput>;
  marginBuyingPower?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  marginBuyingPowerDT?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  marginOpenOrderReserveDT?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  marketValueTotal?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  mode?: InputMaybe<NullableEnumAccountModeFieldUpdateOperationsInput>;
  name?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  optionLevel?: InputMaybe<NullableEnumOptionLevelFieldUpdateOperationsInput>;
  plaidAccountMask?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  portfolio?: InputMaybe<PortfolioUpdateOneRequiredWithoutAccountsNestedInput>;
  positions?: InputMaybe<PositionUpdateManyWithoutAccountNestedInput>;
  provider?: InputMaybe<EnumAccountProviderFieldUpdateOperationsInput>;
  raw?: InputMaybe<Scalars['JSON']['input']>;
  realizedPAndL?: InputMaybe<RealizedPAndLUpdateManyWithoutAccountNestedInput>;
  setRealizedValues?: InputMaybe<BoolFieldUpdateOperationsInput>;
  skipSetup?: InputMaybe<BoolFieldUpdateOperationsInput>;
  status?: InputMaybe<EnumAccountStatusFieldUpdateOperationsInput>;
  subType?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  type?: InputMaybe<StringFieldUpdateOperationsInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  uploadedPositions?: InputMaybe<BoolFieldUpdateOperationsInput>;
};

export type AccountUpsertWithWhereUniqueWithoutAuthConnectionInput = {
  create: AccountCreateWithoutAuthConnectionInput;
  update: AccountUpdateWithoutAuthConnectionInput;
  where: AccountWhereUniqueInput;
};

export type AccountUpsertWithWhereUniqueWithoutCreatedByInput = {
  create: AccountCreateWithoutCreatedByInput;
  update: AccountUpdateWithoutCreatedByInput;
  where: AccountWhereUniqueInput;
};

export type AccountUpsertWithWhereUniqueWithoutPortfolioInput = {
  create: AccountCreateWithoutPortfolioInput;
  update: AccountUpdateWithoutPortfolioInput;
  where: AccountWhereUniqueInput;
};

export type AccountUpsertWithoutFilesInput = {
  create: AccountCreateWithoutFilesInput;
  update: AccountUpdateWithoutFilesInput;
  where?: InputMaybe<AccountWhereInput>;
};

export type AccountUpsertWithoutLotsInput = {
  create: AccountCreateWithoutLotsInput;
  update: AccountUpdateWithoutLotsInput;
  where?: InputMaybe<AccountWhereInput>;
};

export type AccountUpsertWithoutPositionsInput = {
  create: AccountCreateWithoutPositionsInput;
  update: AccountUpdateWithoutPositionsInput;
  where?: InputMaybe<AccountWhereInput>;
};

export type AccountUpsertWithoutRealizedPAndLInput = {
  create: AccountCreateWithoutRealizedPAndLInput;
  update: AccountUpdateWithoutRealizedPAndLInput;
  where?: InputMaybe<AccountWhereInput>;
};

export type AccountUpsertWithoutTransactionsInput = {
  create: AccountCreateWithoutTransactionsInput;
  update: AccountUpdateWithoutTransactionsInput;
  where?: InputMaybe<AccountWhereInput>;
};

export type AccountWhereInput = {
  AND?: InputMaybe<Array<AccountWhereInput>>;
  NOT?: InputMaybe<Array<AccountWhereInput>>;
  OR?: InputMaybe<Array<AccountWhereInput>>;
  accountValueTotal?: InputMaybe<DecimalNullableFilter>;
  authConnection?: InputMaybe<AuthConnectionNullableScalarRelationFilter>;
  authConnectionId?: InputMaybe<UuidNullableFilter>;
  balanceAccount?: InputMaybe<DecimalNullableFilter>;
  balanceMoneyMarket?: InputMaybe<DecimalNullableFilter>;
  balanceShortAdjustment?: InputMaybe<DecimalNullableFilter>;
  cashAvailableForInvestment?: InputMaybe<DecimalNullableFilter>;
  cashBalance?: InputMaybe<DecimalNullableFilter>;
  cashBuyingPower?: InputMaybe<DecimalNullableFilter>;
  cashForOpenOrders?: InputMaybe<DecimalNullableFilter>;
  cashNet?: InputMaybe<DecimalNullableFilter>;
  cashOpenOrderReserveDT?: InputMaybe<DecimalNullableFilter>;
  cashSettledForInvestment?: InputMaybe<DecimalNullableFilter>;
  cashUnsettledForInvestment?: InputMaybe<DecimalNullableFilter>;
  closedDate?: InputMaybe<DateTimeNullableFilter>;
  createdAt?: InputMaybe<DateTimeFilter>;
  createdBy?: InputMaybe<UserScalarRelationFilter>;
  createdById?: InputMaybe<StringFilter>;
  description?: InputMaybe<StringNullableFilter>;
  equityRegt?: InputMaybe<DecimalNullableFilter>;
  equityRegtPercent?: InputMaybe<DecimalNullableFilter>;
  externalId?: InputMaybe<StringNullableFilter>;
  files?: InputMaybe<FileListRelationFilter>;
  fundsWithheldFromPurchasingPower?: InputMaybe<DecimalNullableFilter>;
  fundsWithheldFromWithdrawal?: InputMaybe<DecimalNullableFilter>;
  id?: InputMaybe<UuidFilter>;
  institution?: InputMaybe<EnumAccountInstitutionNullableFilter>;
  key?: InputMaybe<StringNullableFilter>;
  liveURL?: InputMaybe<StringNullableFilter>;
  liveURLCreated?: InputMaybe<DateTimeNullableFilter>;
  lotSeededDate?: InputMaybe<DateTimeNullableFilter>;
  lots?: InputMaybe<LotListRelationFilter>;
  marginBuyingPower?: InputMaybe<DecimalNullableFilter>;
  marginBuyingPowerDT?: InputMaybe<DecimalNullableFilter>;
  marginOpenOrderReserveDT?: InputMaybe<DecimalNullableFilter>;
  marketValueTotal?: InputMaybe<DecimalNullableFilter>;
  mode?: InputMaybe<EnumAccountModeNullableFilter>;
  name?: InputMaybe<StringNullableFilter>;
  optionLevel?: InputMaybe<EnumOptionLevelNullableFilter>;
  plaidAccountMask?: InputMaybe<StringNullableFilter>;
  portfolio?: InputMaybe<PortfolioScalarRelationFilter>;
  portfolioId?: InputMaybe<UuidFilter>;
  positions?: InputMaybe<PositionListRelationFilter>;
  provider?: InputMaybe<EnumAccountProviderFilter>;
  raw?: InputMaybe<JsonNullableFilter>;
  realizedPAndL?: InputMaybe<RealizedPAndLListRelationFilter>;
  setRealizedValues?: InputMaybe<BoolFilter>;
  skipSetup?: InputMaybe<BoolFilter>;
  status?: InputMaybe<EnumAccountStatusFilter>;
  subType?: InputMaybe<StringNullableFilter>;
  transactions?: InputMaybe<TransactionListRelationFilter>;
  type?: InputMaybe<StringFilter>;
  updatedAt?: InputMaybe<DateTimeFilter>;
  uploadedPositions?: InputMaybe<BoolFilter>;
};

export type AccountWhereUniqueInput = {
  AND?: InputMaybe<Array<AccountWhereInput>>;
  NOT?: InputMaybe<Array<AccountWhereInput>>;
  OR?: InputMaybe<Array<AccountWhereInput>>;
  accountValueTotal?: InputMaybe<DecimalNullableFilter>;
  authConnection?: InputMaybe<AuthConnectionNullableScalarRelationFilter>;
  authConnectionId?: InputMaybe<UuidNullableFilter>;
  balanceAccount?: InputMaybe<DecimalNullableFilter>;
  balanceMoneyMarket?: InputMaybe<DecimalNullableFilter>;
  balanceShortAdjustment?: InputMaybe<DecimalNullableFilter>;
  cashAvailableForInvestment?: InputMaybe<DecimalNullableFilter>;
  cashBalance?: InputMaybe<DecimalNullableFilter>;
  cashBuyingPower?: InputMaybe<DecimalNullableFilter>;
  cashForOpenOrders?: InputMaybe<DecimalNullableFilter>;
  cashNet?: InputMaybe<DecimalNullableFilter>;
  cashOpenOrderReserveDT?: InputMaybe<DecimalNullableFilter>;
  cashSettledForInvestment?: InputMaybe<DecimalNullableFilter>;
  cashUnsettledForInvestment?: InputMaybe<DecimalNullableFilter>;
  closedDate?: InputMaybe<DateTimeNullableFilter>;
  createdAt?: InputMaybe<DateTimeFilter>;
  createdBy?: InputMaybe<UserScalarRelationFilter>;
  createdById?: InputMaybe<StringFilter>;
  description?: InputMaybe<StringNullableFilter>;
  equityRegt?: InputMaybe<DecimalNullableFilter>;
  equityRegtPercent?: InputMaybe<DecimalNullableFilter>;
  externalId?: InputMaybe<StringNullableFilter>;
  files?: InputMaybe<FileListRelationFilter>;
  fundsWithheldFromPurchasingPower?: InputMaybe<DecimalNullableFilter>;
  fundsWithheldFromWithdrawal?: InputMaybe<DecimalNullableFilter>;
  id?: InputMaybe<Scalars['String']['input']>;
  institution?: InputMaybe<EnumAccountInstitutionNullableFilter>;
  key?: InputMaybe<StringNullableFilter>;
  liveURL?: InputMaybe<StringNullableFilter>;
  liveURLCreated?: InputMaybe<DateTimeNullableFilter>;
  lotSeededDate?: InputMaybe<DateTimeNullableFilter>;
  lots?: InputMaybe<LotListRelationFilter>;
  marginBuyingPower?: InputMaybe<DecimalNullableFilter>;
  marginBuyingPowerDT?: InputMaybe<DecimalNullableFilter>;
  marginOpenOrderReserveDT?: InputMaybe<DecimalNullableFilter>;
  marketValueTotal?: InputMaybe<DecimalNullableFilter>;
  mode?: InputMaybe<EnumAccountModeNullableFilter>;
  name?: InputMaybe<StringNullableFilter>;
  optionLevel?: InputMaybe<EnumOptionLevelNullableFilter>;
  plaidAccountMask?: InputMaybe<StringNullableFilter>;
  portfolio?: InputMaybe<PortfolioScalarRelationFilter>;
  portfolioId?: InputMaybe<UuidFilter>;
  positions?: InputMaybe<PositionListRelationFilter>;
  provider?: InputMaybe<EnumAccountProviderFilter>;
  provider_externalId?: InputMaybe<AccountProviderExternalIdCompoundUniqueInput>;
  raw?: InputMaybe<JsonNullableFilter>;
  realizedPAndL?: InputMaybe<RealizedPAndLListRelationFilter>;
  setRealizedValues?: InputMaybe<BoolFilter>;
  skipSetup?: InputMaybe<BoolFilter>;
  status?: InputMaybe<EnumAccountStatusFilter>;
  subType?: InputMaybe<StringNullableFilter>;
  transactions?: InputMaybe<TransactionListRelationFilter>;
  type?: InputMaybe<StringFilter>;
  updatedAt?: InputMaybe<DateTimeFilter>;
  uploadedPositions?: InputMaybe<BoolFilter>;
};

export type Asset = {
  __typename?: 'Asset';
  _count: AssetCount;
  active: Scalars['Boolean']['output'];
  assetClass: AssetClass;
  assetType?: Maybe<AssetType>;
  assetTypeCode?: Maybe<Scalars['String']['output']>;
  cik?: Maybe<Scalars['String']['output']>;
  compositeFigi?: Maybe<Scalars['String']['output']>;
  currencyName?: Maybe<Scalars['String']['output']>;
  delistedDate?: Maybe<Scalars['DateTime']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  favoritedBy?: Maybe<Array<User>>;
  harvestTransactionItems?: Maybe<Array<HarvestTransactionItem>>;
  homepageUrl?: Maybe<Scalars['String']['output']>;
  iconUrl?: Maybe<Scalars['String']['output']>;
  lastClose: Scalars['Decimal']['output'];
  lastHigh: Scalars['Decimal']['output'];
  lastLow: Scalars['Decimal']['output'];
  lastOpen: Scalars['Decimal']['output'];
  lastPrice: Scalars['Decimal']['output'];
  lastUpdated: Scalars['DateTime']['output'];
  lastVolume: Scalars['Decimal']['output'];
  lastVolumeWeighted: Scalars['Decimal']['output'];
  listDate?: Maybe<Scalars['DateTime']['output']>;
  locale: AssetLocale;
  logoUrl?: Maybe<Scalars['String']['output']>;
  lots?: Maybe<Array<Lot>>;
  marketCap?: Maybe<Scalars['Decimal']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  plaid_security_id?: Maybe<Scalars['String']['output']>;
  positions?: Maybe<Array<Position>>;
  priceHourly?: Maybe<Array<PriceHourly>>;
  priceHourlyVectors?: Maybe<Array<PriceHourlyVector>>;
  primaryExchange?: Maybe<Scalars['String']['output']>;
  shareClassSharesOutstanding?: Maybe<Scalars['Decimal']['output']>;
  sicCode?: Maybe<Scalars['String']['output']>;
  sicDescription?: Maybe<Scalars['String']['output']>;
  symbol: Scalars['ID']['output'];
  todaysChange: Scalars['Decimal']['output'];
  todaysChangePerc: Scalars['Decimal']['output'];
  totalEmployees?: Maybe<Scalars['Int']['output']>;
  transactions?: Maybe<Array<Transaction>>;
  type: Scalars['String']['output'];
  vectorGraphs?: Maybe<Array<VectorGraph>>;
};

export type AssetAvgAggregate = {
  __typename?: 'AssetAvgAggregate';
  lastClose?: Maybe<Scalars['Decimal']['output']>;
  lastHigh?: Maybe<Scalars['Decimal']['output']>;
  lastLow?: Maybe<Scalars['Decimal']['output']>;
  lastOpen?: Maybe<Scalars['Decimal']['output']>;
  lastPrice?: Maybe<Scalars['Decimal']['output']>;
  lastVolume?: Maybe<Scalars['Decimal']['output']>;
  lastVolumeWeighted?: Maybe<Scalars['Decimal']['output']>;
  marketCap?: Maybe<Scalars['Decimal']['output']>;
  shareClassSharesOutstanding?: Maybe<Scalars['Decimal']['output']>;
  todaysChange?: Maybe<Scalars['Decimal']['output']>;
  todaysChangePerc?: Maybe<Scalars['Decimal']['output']>;
  totalEmployees?: Maybe<Scalars['Float']['output']>;
};

/** Pulled from polygon api */
export enum AssetClass {
  Unknown = 'UNKNOWN',
  Cryto = 'cryto',
  Fx = 'fx',
  Indices = 'indices',
  Otc = 'otc',
  Stocks = 'stocks'
}

export type AssetCount = {
  __typename?: 'AssetCount';
  favoritedBy: Scalars['Int']['output'];
  harvestTransactionItems: Scalars['Int']['output'];
  lots: Scalars['Int']['output'];
  positions: Scalars['Int']['output'];
  priceHourly: Scalars['Int']['output'];
  priceHourlyVectors: Scalars['Int']['output'];
  transactions: Scalars['Int']['output'];
  vectorGraphs: Scalars['Int']['output'];
};

export type AssetCountAggregate = {
  __typename?: 'AssetCountAggregate';
  _all: Scalars['Int']['output'];
  active: Scalars['Int']['output'];
  assetClass: Scalars['Int']['output'];
  assetTypeCode: Scalars['Int']['output'];
  cik: Scalars['Int']['output'];
  compositeFigi: Scalars['Int']['output'];
  currencyName: Scalars['Int']['output'];
  delistedDate: Scalars['Int']['output'];
  description: Scalars['Int']['output'];
  homepageUrl: Scalars['Int']['output'];
  iconUrl: Scalars['Int']['output'];
  lastClose: Scalars['Int']['output'];
  lastHigh: Scalars['Int']['output'];
  lastLow: Scalars['Int']['output'];
  lastOpen: Scalars['Int']['output'];
  lastPrice: Scalars['Int']['output'];
  lastUpdated: Scalars['Int']['output'];
  lastVolume: Scalars['Int']['output'];
  lastVolumeWeighted: Scalars['Int']['output'];
  listDate: Scalars['Int']['output'];
  locale: Scalars['Int']['output'];
  logoUrl: Scalars['Int']['output'];
  marketCap: Scalars['Int']['output'];
  name: Scalars['Int']['output'];
  plaid_security_id: Scalars['Int']['output'];
  primaryExchange: Scalars['Int']['output'];
  shareClassSharesOutstanding: Scalars['Int']['output'];
  sicCode: Scalars['Int']['output'];
  sicDescription: Scalars['Int']['output'];
  symbol: Scalars['Int']['output'];
  todaysChange: Scalars['Int']['output'];
  todaysChangePerc: Scalars['Int']['output'];
  totalEmployees: Scalars['Int']['output'];
  type: Scalars['Int']['output'];
};

export type AssetCreateNestedManyWithoutFavoritedByInput = {
  connect?: InputMaybe<Array<AssetWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<AssetCreateOrConnectWithoutFavoritedByInput>>;
  create?: InputMaybe<Array<AssetCreateWithoutFavoritedByInput>>;
};

export type AssetCreateNestedOneWithoutHarvestTransactionItemsInput = {
  connect?: InputMaybe<AssetWhereUniqueInput>;
  connectOrCreate?: InputMaybe<AssetCreateOrConnectWithoutHarvestTransactionItemsInput>;
  create?: InputMaybe<AssetCreateWithoutHarvestTransactionItemsInput>;
};

export type AssetCreateNestedOneWithoutLotsInput = {
  connect?: InputMaybe<AssetWhereUniqueInput>;
  connectOrCreate?: InputMaybe<AssetCreateOrConnectWithoutLotsInput>;
  create?: InputMaybe<AssetCreateWithoutLotsInput>;
};

export type AssetCreateNestedOneWithoutPositionsInput = {
  connect?: InputMaybe<AssetWhereUniqueInput>;
  connectOrCreate?: InputMaybe<AssetCreateOrConnectWithoutPositionsInput>;
  create?: InputMaybe<AssetCreateWithoutPositionsInput>;
};

export type AssetCreateNestedOneWithoutPriceHourlyVectorsInput = {
  connect?: InputMaybe<AssetWhereUniqueInput>;
  connectOrCreate?: InputMaybe<AssetCreateOrConnectWithoutPriceHourlyVectorsInput>;
  create?: InputMaybe<AssetCreateWithoutPriceHourlyVectorsInput>;
};

export type AssetCreateNestedOneWithoutTransactionsInput = {
  connect?: InputMaybe<AssetWhereUniqueInput>;
  connectOrCreate?: InputMaybe<AssetCreateOrConnectWithoutTransactionsInput>;
  create?: InputMaybe<AssetCreateWithoutTransactionsInput>;
};

export type AssetCreateNestedOneWithoutVectorGraphsInput = {
  connect?: InputMaybe<AssetWhereUniqueInput>;
  connectOrCreate?: InputMaybe<AssetCreateOrConnectWithoutVectorGraphsInput>;
  create?: InputMaybe<AssetCreateWithoutVectorGraphsInput>;
};

export type AssetCreateOrConnectWithoutFavoritedByInput = {
  create: AssetCreateWithoutFavoritedByInput;
  where: AssetWhereUniqueInput;
};

export type AssetCreateOrConnectWithoutHarvestTransactionItemsInput = {
  create: AssetCreateWithoutHarvestTransactionItemsInput;
  where: AssetWhereUniqueInput;
};

export type AssetCreateOrConnectWithoutLotsInput = {
  create: AssetCreateWithoutLotsInput;
  where: AssetWhereUniqueInput;
};

export type AssetCreateOrConnectWithoutPositionsInput = {
  create: AssetCreateWithoutPositionsInput;
  where: AssetWhereUniqueInput;
};

export type AssetCreateOrConnectWithoutPriceHourlyVectorsInput = {
  create: AssetCreateWithoutPriceHourlyVectorsInput;
  where: AssetWhereUniqueInput;
};

export type AssetCreateOrConnectWithoutTransactionsInput = {
  create: AssetCreateWithoutTransactionsInput;
  where: AssetWhereUniqueInput;
};

export type AssetCreateOrConnectWithoutVectorGraphsInput = {
  create: AssetCreateWithoutVectorGraphsInput;
  where: AssetWhereUniqueInput;
};

export type AssetCreateWithoutFavoritedByInput = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  assetClass?: InputMaybe<AssetClass>;
  assetType?: InputMaybe<AssetTypeCreateNestedOneWithoutAssetsInput>;
  cik?: InputMaybe<Scalars['String']['input']>;
  compositeFigi?: InputMaybe<Scalars['String']['input']>;
  currencyName?: InputMaybe<Scalars['String']['input']>;
  delistedDate?: InputMaybe<Scalars['DateTime']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  harvestTransactionItems?: InputMaybe<HarvestTransactionItemCreateNestedManyWithoutAssetInput>;
  homepageUrl?: InputMaybe<Scalars['String']['input']>;
  iconUrl?: InputMaybe<Scalars['String']['input']>;
  lastClose?: InputMaybe<Scalars['Decimal']['input']>;
  lastHigh?: InputMaybe<Scalars['Decimal']['input']>;
  lastLow?: InputMaybe<Scalars['Decimal']['input']>;
  lastOpen?: InputMaybe<Scalars['Decimal']['input']>;
  lastPrice?: InputMaybe<Scalars['Decimal']['input']>;
  lastUpdated?: InputMaybe<Scalars['DateTime']['input']>;
  lastVolume?: InputMaybe<Scalars['Decimal']['input']>;
  lastVolumeWeighted?: InputMaybe<Scalars['Decimal']['input']>;
  listDate?: InputMaybe<Scalars['DateTime']['input']>;
  locale?: InputMaybe<AssetLocale>;
  logoUrl?: InputMaybe<Scalars['String']['input']>;
  lots?: InputMaybe<LotCreateNestedManyWithoutAssetInput>;
  marketCap?: InputMaybe<Scalars['Decimal']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  plaid_security_id?: InputMaybe<Scalars['String']['input']>;
  positions?: InputMaybe<PositionCreateNestedManyWithoutAssetInput>;
  priceHourly?: InputMaybe<PriceHourlyCreateNestedManyWithoutAsssetInput>;
  priceHourlyVectors?: InputMaybe<PriceHourlyVectorCreateNestedManyWithoutAssetInput>;
  primaryExchange?: InputMaybe<Scalars['String']['input']>;
  shareClassSharesOutstanding?: InputMaybe<Scalars['Decimal']['input']>;
  sicCode?: InputMaybe<Scalars['String']['input']>;
  sicDescription?: InputMaybe<Scalars['String']['input']>;
  symbol: Scalars['String']['input'];
  todaysChange?: InputMaybe<Scalars['Decimal']['input']>;
  todaysChangePerc?: InputMaybe<Scalars['Decimal']['input']>;
  totalEmployees?: InputMaybe<Scalars['Int']['input']>;
  transactions?: InputMaybe<TransactionCreateNestedManyWithoutAssetInput>;
  type?: InputMaybe<Scalars['String']['input']>;
  vectorGraphs?: InputMaybe<VectorGraphCreateNestedManyWithoutAssetInput>;
};

export type AssetCreateWithoutHarvestTransactionItemsInput = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  assetClass?: InputMaybe<AssetClass>;
  assetType?: InputMaybe<AssetTypeCreateNestedOneWithoutAssetsInput>;
  cik?: InputMaybe<Scalars['String']['input']>;
  compositeFigi?: InputMaybe<Scalars['String']['input']>;
  currencyName?: InputMaybe<Scalars['String']['input']>;
  delistedDate?: InputMaybe<Scalars['DateTime']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  favoritedBy?: InputMaybe<UserCreateNestedManyWithoutFavoritesInput>;
  homepageUrl?: InputMaybe<Scalars['String']['input']>;
  iconUrl?: InputMaybe<Scalars['String']['input']>;
  lastClose?: InputMaybe<Scalars['Decimal']['input']>;
  lastHigh?: InputMaybe<Scalars['Decimal']['input']>;
  lastLow?: InputMaybe<Scalars['Decimal']['input']>;
  lastOpen?: InputMaybe<Scalars['Decimal']['input']>;
  lastPrice?: InputMaybe<Scalars['Decimal']['input']>;
  lastUpdated?: InputMaybe<Scalars['DateTime']['input']>;
  lastVolume?: InputMaybe<Scalars['Decimal']['input']>;
  lastVolumeWeighted?: InputMaybe<Scalars['Decimal']['input']>;
  listDate?: InputMaybe<Scalars['DateTime']['input']>;
  locale?: InputMaybe<AssetLocale>;
  logoUrl?: InputMaybe<Scalars['String']['input']>;
  lots?: InputMaybe<LotCreateNestedManyWithoutAssetInput>;
  marketCap?: InputMaybe<Scalars['Decimal']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  plaid_security_id?: InputMaybe<Scalars['String']['input']>;
  positions?: InputMaybe<PositionCreateNestedManyWithoutAssetInput>;
  priceHourly?: InputMaybe<PriceHourlyCreateNestedManyWithoutAsssetInput>;
  priceHourlyVectors?: InputMaybe<PriceHourlyVectorCreateNestedManyWithoutAssetInput>;
  primaryExchange?: InputMaybe<Scalars['String']['input']>;
  shareClassSharesOutstanding?: InputMaybe<Scalars['Decimal']['input']>;
  sicCode?: InputMaybe<Scalars['String']['input']>;
  sicDescription?: InputMaybe<Scalars['String']['input']>;
  symbol: Scalars['String']['input'];
  todaysChange?: InputMaybe<Scalars['Decimal']['input']>;
  todaysChangePerc?: InputMaybe<Scalars['Decimal']['input']>;
  totalEmployees?: InputMaybe<Scalars['Int']['input']>;
  transactions?: InputMaybe<TransactionCreateNestedManyWithoutAssetInput>;
  type?: InputMaybe<Scalars['String']['input']>;
  vectorGraphs?: InputMaybe<VectorGraphCreateNestedManyWithoutAssetInput>;
};

export type AssetCreateWithoutLotsInput = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  assetClass?: InputMaybe<AssetClass>;
  assetType?: InputMaybe<AssetTypeCreateNestedOneWithoutAssetsInput>;
  cik?: InputMaybe<Scalars['String']['input']>;
  compositeFigi?: InputMaybe<Scalars['String']['input']>;
  currencyName?: InputMaybe<Scalars['String']['input']>;
  delistedDate?: InputMaybe<Scalars['DateTime']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  favoritedBy?: InputMaybe<UserCreateNestedManyWithoutFavoritesInput>;
  harvestTransactionItems?: InputMaybe<HarvestTransactionItemCreateNestedManyWithoutAssetInput>;
  homepageUrl?: InputMaybe<Scalars['String']['input']>;
  iconUrl?: InputMaybe<Scalars['String']['input']>;
  lastClose?: InputMaybe<Scalars['Decimal']['input']>;
  lastHigh?: InputMaybe<Scalars['Decimal']['input']>;
  lastLow?: InputMaybe<Scalars['Decimal']['input']>;
  lastOpen?: InputMaybe<Scalars['Decimal']['input']>;
  lastPrice?: InputMaybe<Scalars['Decimal']['input']>;
  lastUpdated?: InputMaybe<Scalars['DateTime']['input']>;
  lastVolume?: InputMaybe<Scalars['Decimal']['input']>;
  lastVolumeWeighted?: InputMaybe<Scalars['Decimal']['input']>;
  listDate?: InputMaybe<Scalars['DateTime']['input']>;
  locale?: InputMaybe<AssetLocale>;
  logoUrl?: InputMaybe<Scalars['String']['input']>;
  marketCap?: InputMaybe<Scalars['Decimal']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  plaid_security_id?: InputMaybe<Scalars['String']['input']>;
  positions?: InputMaybe<PositionCreateNestedManyWithoutAssetInput>;
  priceHourly?: InputMaybe<PriceHourlyCreateNestedManyWithoutAsssetInput>;
  priceHourlyVectors?: InputMaybe<PriceHourlyVectorCreateNestedManyWithoutAssetInput>;
  primaryExchange?: InputMaybe<Scalars['String']['input']>;
  shareClassSharesOutstanding?: InputMaybe<Scalars['Decimal']['input']>;
  sicCode?: InputMaybe<Scalars['String']['input']>;
  sicDescription?: InputMaybe<Scalars['String']['input']>;
  symbol: Scalars['String']['input'];
  todaysChange?: InputMaybe<Scalars['Decimal']['input']>;
  todaysChangePerc?: InputMaybe<Scalars['Decimal']['input']>;
  totalEmployees?: InputMaybe<Scalars['Int']['input']>;
  transactions?: InputMaybe<TransactionCreateNestedManyWithoutAssetInput>;
  type?: InputMaybe<Scalars['String']['input']>;
  vectorGraphs?: InputMaybe<VectorGraphCreateNestedManyWithoutAssetInput>;
};

export type AssetCreateWithoutPositionsInput = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  assetClass?: InputMaybe<AssetClass>;
  assetType?: InputMaybe<AssetTypeCreateNestedOneWithoutAssetsInput>;
  cik?: InputMaybe<Scalars['String']['input']>;
  compositeFigi?: InputMaybe<Scalars['String']['input']>;
  currencyName?: InputMaybe<Scalars['String']['input']>;
  delistedDate?: InputMaybe<Scalars['DateTime']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  favoritedBy?: InputMaybe<UserCreateNestedManyWithoutFavoritesInput>;
  harvestTransactionItems?: InputMaybe<HarvestTransactionItemCreateNestedManyWithoutAssetInput>;
  homepageUrl?: InputMaybe<Scalars['String']['input']>;
  iconUrl?: InputMaybe<Scalars['String']['input']>;
  lastClose?: InputMaybe<Scalars['Decimal']['input']>;
  lastHigh?: InputMaybe<Scalars['Decimal']['input']>;
  lastLow?: InputMaybe<Scalars['Decimal']['input']>;
  lastOpen?: InputMaybe<Scalars['Decimal']['input']>;
  lastPrice?: InputMaybe<Scalars['Decimal']['input']>;
  lastUpdated?: InputMaybe<Scalars['DateTime']['input']>;
  lastVolume?: InputMaybe<Scalars['Decimal']['input']>;
  lastVolumeWeighted?: InputMaybe<Scalars['Decimal']['input']>;
  listDate?: InputMaybe<Scalars['DateTime']['input']>;
  locale?: InputMaybe<AssetLocale>;
  logoUrl?: InputMaybe<Scalars['String']['input']>;
  lots?: InputMaybe<LotCreateNestedManyWithoutAssetInput>;
  marketCap?: InputMaybe<Scalars['Decimal']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  plaid_security_id?: InputMaybe<Scalars['String']['input']>;
  priceHourly?: InputMaybe<PriceHourlyCreateNestedManyWithoutAsssetInput>;
  priceHourlyVectors?: InputMaybe<PriceHourlyVectorCreateNestedManyWithoutAssetInput>;
  primaryExchange?: InputMaybe<Scalars['String']['input']>;
  shareClassSharesOutstanding?: InputMaybe<Scalars['Decimal']['input']>;
  sicCode?: InputMaybe<Scalars['String']['input']>;
  sicDescription?: InputMaybe<Scalars['String']['input']>;
  symbol: Scalars['String']['input'];
  todaysChange?: InputMaybe<Scalars['Decimal']['input']>;
  todaysChangePerc?: InputMaybe<Scalars['Decimal']['input']>;
  totalEmployees?: InputMaybe<Scalars['Int']['input']>;
  transactions?: InputMaybe<TransactionCreateNestedManyWithoutAssetInput>;
  type?: InputMaybe<Scalars['String']['input']>;
  vectorGraphs?: InputMaybe<VectorGraphCreateNestedManyWithoutAssetInput>;
};

export type AssetCreateWithoutPriceHourlyVectorsInput = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  assetClass?: InputMaybe<AssetClass>;
  assetType?: InputMaybe<AssetTypeCreateNestedOneWithoutAssetsInput>;
  cik?: InputMaybe<Scalars['String']['input']>;
  compositeFigi?: InputMaybe<Scalars['String']['input']>;
  currencyName?: InputMaybe<Scalars['String']['input']>;
  delistedDate?: InputMaybe<Scalars['DateTime']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  favoritedBy?: InputMaybe<UserCreateNestedManyWithoutFavoritesInput>;
  harvestTransactionItems?: InputMaybe<HarvestTransactionItemCreateNestedManyWithoutAssetInput>;
  homepageUrl?: InputMaybe<Scalars['String']['input']>;
  iconUrl?: InputMaybe<Scalars['String']['input']>;
  lastClose?: InputMaybe<Scalars['Decimal']['input']>;
  lastHigh?: InputMaybe<Scalars['Decimal']['input']>;
  lastLow?: InputMaybe<Scalars['Decimal']['input']>;
  lastOpen?: InputMaybe<Scalars['Decimal']['input']>;
  lastPrice?: InputMaybe<Scalars['Decimal']['input']>;
  lastUpdated?: InputMaybe<Scalars['DateTime']['input']>;
  lastVolume?: InputMaybe<Scalars['Decimal']['input']>;
  lastVolumeWeighted?: InputMaybe<Scalars['Decimal']['input']>;
  listDate?: InputMaybe<Scalars['DateTime']['input']>;
  locale?: InputMaybe<AssetLocale>;
  logoUrl?: InputMaybe<Scalars['String']['input']>;
  lots?: InputMaybe<LotCreateNestedManyWithoutAssetInput>;
  marketCap?: InputMaybe<Scalars['Decimal']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  plaid_security_id?: InputMaybe<Scalars['String']['input']>;
  positions?: InputMaybe<PositionCreateNestedManyWithoutAssetInput>;
  priceHourly?: InputMaybe<PriceHourlyCreateNestedManyWithoutAsssetInput>;
  primaryExchange?: InputMaybe<Scalars['String']['input']>;
  shareClassSharesOutstanding?: InputMaybe<Scalars['Decimal']['input']>;
  sicCode?: InputMaybe<Scalars['String']['input']>;
  sicDescription?: InputMaybe<Scalars['String']['input']>;
  symbol: Scalars['String']['input'];
  todaysChange?: InputMaybe<Scalars['Decimal']['input']>;
  todaysChangePerc?: InputMaybe<Scalars['Decimal']['input']>;
  totalEmployees?: InputMaybe<Scalars['Int']['input']>;
  transactions?: InputMaybe<TransactionCreateNestedManyWithoutAssetInput>;
  type?: InputMaybe<Scalars['String']['input']>;
  vectorGraphs?: InputMaybe<VectorGraphCreateNestedManyWithoutAssetInput>;
};

export type AssetCreateWithoutTransactionsInput = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  assetClass?: InputMaybe<AssetClass>;
  assetType?: InputMaybe<AssetTypeCreateNestedOneWithoutAssetsInput>;
  cik?: InputMaybe<Scalars['String']['input']>;
  compositeFigi?: InputMaybe<Scalars['String']['input']>;
  currencyName?: InputMaybe<Scalars['String']['input']>;
  delistedDate?: InputMaybe<Scalars['DateTime']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  favoritedBy?: InputMaybe<UserCreateNestedManyWithoutFavoritesInput>;
  harvestTransactionItems?: InputMaybe<HarvestTransactionItemCreateNestedManyWithoutAssetInput>;
  homepageUrl?: InputMaybe<Scalars['String']['input']>;
  iconUrl?: InputMaybe<Scalars['String']['input']>;
  lastClose?: InputMaybe<Scalars['Decimal']['input']>;
  lastHigh?: InputMaybe<Scalars['Decimal']['input']>;
  lastLow?: InputMaybe<Scalars['Decimal']['input']>;
  lastOpen?: InputMaybe<Scalars['Decimal']['input']>;
  lastPrice?: InputMaybe<Scalars['Decimal']['input']>;
  lastUpdated?: InputMaybe<Scalars['DateTime']['input']>;
  lastVolume?: InputMaybe<Scalars['Decimal']['input']>;
  lastVolumeWeighted?: InputMaybe<Scalars['Decimal']['input']>;
  listDate?: InputMaybe<Scalars['DateTime']['input']>;
  locale?: InputMaybe<AssetLocale>;
  logoUrl?: InputMaybe<Scalars['String']['input']>;
  lots?: InputMaybe<LotCreateNestedManyWithoutAssetInput>;
  marketCap?: InputMaybe<Scalars['Decimal']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  plaid_security_id?: InputMaybe<Scalars['String']['input']>;
  positions?: InputMaybe<PositionCreateNestedManyWithoutAssetInput>;
  priceHourly?: InputMaybe<PriceHourlyCreateNestedManyWithoutAsssetInput>;
  priceHourlyVectors?: InputMaybe<PriceHourlyVectorCreateNestedManyWithoutAssetInput>;
  primaryExchange?: InputMaybe<Scalars['String']['input']>;
  shareClassSharesOutstanding?: InputMaybe<Scalars['Decimal']['input']>;
  sicCode?: InputMaybe<Scalars['String']['input']>;
  sicDescription?: InputMaybe<Scalars['String']['input']>;
  symbol: Scalars['String']['input'];
  todaysChange?: InputMaybe<Scalars['Decimal']['input']>;
  todaysChangePerc?: InputMaybe<Scalars['Decimal']['input']>;
  totalEmployees?: InputMaybe<Scalars['Int']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  vectorGraphs?: InputMaybe<VectorGraphCreateNestedManyWithoutAssetInput>;
};

export type AssetCreateWithoutVectorGraphsInput = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  assetClass?: InputMaybe<AssetClass>;
  assetType?: InputMaybe<AssetTypeCreateNestedOneWithoutAssetsInput>;
  cik?: InputMaybe<Scalars['String']['input']>;
  compositeFigi?: InputMaybe<Scalars['String']['input']>;
  currencyName?: InputMaybe<Scalars['String']['input']>;
  delistedDate?: InputMaybe<Scalars['DateTime']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  favoritedBy?: InputMaybe<UserCreateNestedManyWithoutFavoritesInput>;
  harvestTransactionItems?: InputMaybe<HarvestTransactionItemCreateNestedManyWithoutAssetInput>;
  homepageUrl?: InputMaybe<Scalars['String']['input']>;
  iconUrl?: InputMaybe<Scalars['String']['input']>;
  lastClose?: InputMaybe<Scalars['Decimal']['input']>;
  lastHigh?: InputMaybe<Scalars['Decimal']['input']>;
  lastLow?: InputMaybe<Scalars['Decimal']['input']>;
  lastOpen?: InputMaybe<Scalars['Decimal']['input']>;
  lastPrice?: InputMaybe<Scalars['Decimal']['input']>;
  lastUpdated?: InputMaybe<Scalars['DateTime']['input']>;
  lastVolume?: InputMaybe<Scalars['Decimal']['input']>;
  lastVolumeWeighted?: InputMaybe<Scalars['Decimal']['input']>;
  listDate?: InputMaybe<Scalars['DateTime']['input']>;
  locale?: InputMaybe<AssetLocale>;
  logoUrl?: InputMaybe<Scalars['String']['input']>;
  lots?: InputMaybe<LotCreateNestedManyWithoutAssetInput>;
  marketCap?: InputMaybe<Scalars['Decimal']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  plaid_security_id?: InputMaybe<Scalars['String']['input']>;
  positions?: InputMaybe<PositionCreateNestedManyWithoutAssetInput>;
  priceHourly?: InputMaybe<PriceHourlyCreateNestedManyWithoutAsssetInput>;
  priceHourlyVectors?: InputMaybe<PriceHourlyVectorCreateNestedManyWithoutAssetInput>;
  primaryExchange?: InputMaybe<Scalars['String']['input']>;
  shareClassSharesOutstanding?: InputMaybe<Scalars['Decimal']['input']>;
  sicCode?: InputMaybe<Scalars['String']['input']>;
  sicDescription?: InputMaybe<Scalars['String']['input']>;
  symbol: Scalars['String']['input'];
  todaysChange?: InputMaybe<Scalars['Decimal']['input']>;
  todaysChangePerc?: InputMaybe<Scalars['Decimal']['input']>;
  totalEmployees?: InputMaybe<Scalars['Int']['input']>;
  transactions?: InputMaybe<TransactionCreateNestedManyWithoutAssetInput>;
  type?: InputMaybe<Scalars['String']['input']>;
};

export type AssetListRelationFilter = {
  every?: InputMaybe<AssetWhereInput>;
  none?: InputMaybe<AssetWhereInput>;
  some?: InputMaybe<AssetWhereInput>;
};

export enum AssetLocale {
  Global = 'global',
  Us = 'us'
}

export type AssetMaxAggregate = {
  __typename?: 'AssetMaxAggregate';
  active?: Maybe<Scalars['Boolean']['output']>;
  assetClass?: Maybe<AssetClass>;
  assetTypeCode?: Maybe<Scalars['String']['output']>;
  cik?: Maybe<Scalars['String']['output']>;
  compositeFigi?: Maybe<Scalars['String']['output']>;
  currencyName?: Maybe<Scalars['String']['output']>;
  delistedDate?: Maybe<Scalars['DateTime']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  homepageUrl?: Maybe<Scalars['String']['output']>;
  iconUrl?: Maybe<Scalars['String']['output']>;
  lastClose?: Maybe<Scalars['Decimal']['output']>;
  lastHigh?: Maybe<Scalars['Decimal']['output']>;
  lastLow?: Maybe<Scalars['Decimal']['output']>;
  lastOpen?: Maybe<Scalars['Decimal']['output']>;
  lastPrice?: Maybe<Scalars['Decimal']['output']>;
  lastUpdated?: Maybe<Scalars['DateTime']['output']>;
  lastVolume?: Maybe<Scalars['Decimal']['output']>;
  lastVolumeWeighted?: Maybe<Scalars['Decimal']['output']>;
  listDate?: Maybe<Scalars['DateTime']['output']>;
  locale?: Maybe<AssetLocale>;
  logoUrl?: Maybe<Scalars['String']['output']>;
  marketCap?: Maybe<Scalars['Decimal']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  plaid_security_id?: Maybe<Scalars['String']['output']>;
  primaryExchange?: Maybe<Scalars['String']['output']>;
  shareClassSharesOutstanding?: Maybe<Scalars['Decimal']['output']>;
  sicCode?: Maybe<Scalars['String']['output']>;
  sicDescription?: Maybe<Scalars['String']['output']>;
  symbol?: Maybe<Scalars['String']['output']>;
  todaysChange?: Maybe<Scalars['Decimal']['output']>;
  todaysChangePerc?: Maybe<Scalars['Decimal']['output']>;
  totalEmployees?: Maybe<Scalars['Int']['output']>;
  type?: Maybe<Scalars['String']['output']>;
};

export type AssetMinAggregate = {
  __typename?: 'AssetMinAggregate';
  active?: Maybe<Scalars['Boolean']['output']>;
  assetClass?: Maybe<AssetClass>;
  assetTypeCode?: Maybe<Scalars['String']['output']>;
  cik?: Maybe<Scalars['String']['output']>;
  compositeFigi?: Maybe<Scalars['String']['output']>;
  currencyName?: Maybe<Scalars['String']['output']>;
  delistedDate?: Maybe<Scalars['DateTime']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  homepageUrl?: Maybe<Scalars['String']['output']>;
  iconUrl?: Maybe<Scalars['String']['output']>;
  lastClose?: Maybe<Scalars['Decimal']['output']>;
  lastHigh?: Maybe<Scalars['Decimal']['output']>;
  lastLow?: Maybe<Scalars['Decimal']['output']>;
  lastOpen?: Maybe<Scalars['Decimal']['output']>;
  lastPrice?: Maybe<Scalars['Decimal']['output']>;
  lastUpdated?: Maybe<Scalars['DateTime']['output']>;
  lastVolume?: Maybe<Scalars['Decimal']['output']>;
  lastVolumeWeighted?: Maybe<Scalars['Decimal']['output']>;
  listDate?: Maybe<Scalars['DateTime']['output']>;
  locale?: Maybe<AssetLocale>;
  logoUrl?: Maybe<Scalars['String']['output']>;
  marketCap?: Maybe<Scalars['Decimal']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  plaid_security_id?: Maybe<Scalars['String']['output']>;
  primaryExchange?: Maybe<Scalars['String']['output']>;
  shareClassSharesOutstanding?: Maybe<Scalars['Decimal']['output']>;
  sicCode?: Maybe<Scalars['String']['output']>;
  sicDescription?: Maybe<Scalars['String']['output']>;
  symbol?: Maybe<Scalars['String']['output']>;
  todaysChange?: Maybe<Scalars['Decimal']['output']>;
  todaysChangePerc?: Maybe<Scalars['Decimal']['output']>;
  totalEmployees?: Maybe<Scalars['Int']['output']>;
  type?: Maybe<Scalars['String']['output']>;
};

export type AssetScalarRelationFilter = {
  is?: InputMaybe<AssetWhereInput>;
  isNot?: InputMaybe<AssetWhereInput>;
};

export type AssetScalarWhereInput = {
  AND?: InputMaybe<Array<AssetScalarWhereInput>>;
  NOT?: InputMaybe<Array<AssetScalarWhereInput>>;
  OR?: InputMaybe<Array<AssetScalarWhereInput>>;
  active?: InputMaybe<BoolFilter>;
  assetClass?: InputMaybe<EnumAssetClassFilter>;
  assetTypeCode?: InputMaybe<StringNullableFilter>;
  cik?: InputMaybe<StringNullableFilter>;
  compositeFigi?: InputMaybe<StringNullableFilter>;
  currencyName?: InputMaybe<StringNullableFilter>;
  delistedDate?: InputMaybe<DateTimeNullableFilter>;
  description?: InputMaybe<StringNullableFilter>;
  homepageUrl?: InputMaybe<StringNullableFilter>;
  iconUrl?: InputMaybe<StringNullableFilter>;
  lastClose?: InputMaybe<DecimalFilter>;
  lastHigh?: InputMaybe<DecimalFilter>;
  lastLow?: InputMaybe<DecimalFilter>;
  lastOpen?: InputMaybe<DecimalFilter>;
  lastPrice?: InputMaybe<DecimalFilter>;
  lastUpdated?: InputMaybe<DateTimeFilter>;
  lastVolume?: InputMaybe<DecimalFilter>;
  lastVolumeWeighted?: InputMaybe<DecimalFilter>;
  listDate?: InputMaybe<DateTimeNullableFilter>;
  locale?: InputMaybe<EnumAssetLocaleFilter>;
  logoUrl?: InputMaybe<StringNullableFilter>;
  marketCap?: InputMaybe<DecimalNullableFilter>;
  name?: InputMaybe<StringNullableFilter>;
  plaid_security_id?: InputMaybe<StringNullableFilter>;
  primaryExchange?: InputMaybe<StringNullableFilter>;
  shareClassSharesOutstanding?: InputMaybe<DecimalNullableFilter>;
  sicCode?: InputMaybe<StringNullableFilter>;
  sicDescription?: InputMaybe<StringNullableFilter>;
  symbol?: InputMaybe<StringFilter>;
  todaysChange?: InputMaybe<DecimalFilter>;
  todaysChangePerc?: InputMaybe<DecimalFilter>;
  totalEmployees?: InputMaybe<IntNullableFilter>;
  type?: InputMaybe<StringFilter>;
};

export type AssetSumAggregate = {
  __typename?: 'AssetSumAggregate';
  lastClose?: Maybe<Scalars['Decimal']['output']>;
  lastHigh?: Maybe<Scalars['Decimal']['output']>;
  lastLow?: Maybe<Scalars['Decimal']['output']>;
  lastOpen?: Maybe<Scalars['Decimal']['output']>;
  lastPrice?: Maybe<Scalars['Decimal']['output']>;
  lastVolume?: Maybe<Scalars['Decimal']['output']>;
  lastVolumeWeighted?: Maybe<Scalars['Decimal']['output']>;
  marketCap?: Maybe<Scalars['Decimal']['output']>;
  shareClassSharesOutstanding?: Maybe<Scalars['Decimal']['output']>;
  todaysChange?: Maybe<Scalars['Decimal']['output']>;
  todaysChangePerc?: Maybe<Scalars['Decimal']['output']>;
  totalEmployees?: Maybe<Scalars['Int']['output']>;
};

export type AssetType = {
  __typename?: 'AssetType';
  _count: AssetTypeCount;
  assetClass: AssetClass;
  assets?: Maybe<Array<Asset>>;
  code: Scalars['ID']['output'];
  description: Scalars['String']['output'];
  locale: AssetLocale;
};

export type AssetTypeCount = {
  __typename?: 'AssetTypeCount';
  assets: Scalars['Int']['output'];
};

export type AssetTypeCountAggregate = {
  __typename?: 'AssetTypeCountAggregate';
  _all: Scalars['Int']['output'];
  assetClass: Scalars['Int']['output'];
  code: Scalars['Int']['output'];
  description: Scalars['Int']['output'];
  locale: Scalars['Int']['output'];
};

export type AssetTypeCreateNestedOneWithoutAssetsInput = {
  connect?: InputMaybe<AssetTypeWhereUniqueInput>;
  connectOrCreate?: InputMaybe<AssetTypeCreateOrConnectWithoutAssetsInput>;
  create?: InputMaybe<AssetTypeCreateWithoutAssetsInput>;
};

export type AssetTypeCreateOrConnectWithoutAssetsInput = {
  create: AssetTypeCreateWithoutAssetsInput;
  where: AssetTypeWhereUniqueInput;
};

export type AssetTypeCreateWithoutAssetsInput = {
  assetClass: AssetClass;
  code: Scalars['String']['input'];
  description: Scalars['String']['input'];
  locale: AssetLocale;
};

export type AssetTypeMaxAggregate = {
  __typename?: 'AssetTypeMaxAggregate';
  assetClass?: Maybe<AssetClass>;
  code?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  locale?: Maybe<AssetLocale>;
};

export type AssetTypeMinAggregate = {
  __typename?: 'AssetTypeMinAggregate';
  assetClass?: Maybe<AssetClass>;
  code?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  locale?: Maybe<AssetLocale>;
};

export type AssetTypeNullableScalarRelationFilter = {
  is?: InputMaybe<AssetTypeWhereInput>;
  isNot?: InputMaybe<AssetTypeWhereInput>;
};

export type AssetTypeUpdateOneWithoutAssetsNestedInput = {
  connect?: InputMaybe<AssetTypeWhereUniqueInput>;
  connectOrCreate?: InputMaybe<AssetTypeCreateOrConnectWithoutAssetsInput>;
  create?: InputMaybe<AssetTypeCreateWithoutAssetsInput>;
  delete?: InputMaybe<AssetTypeWhereInput>;
  disconnect?: InputMaybe<AssetTypeWhereInput>;
  update?: InputMaybe<AssetTypeUpdateToOneWithWhereWithoutAssetsInput>;
  upsert?: InputMaybe<AssetTypeUpsertWithoutAssetsInput>;
};

export type AssetTypeUpdateToOneWithWhereWithoutAssetsInput = {
  data: AssetTypeUpdateWithoutAssetsInput;
  where?: InputMaybe<AssetTypeWhereInput>;
};

export type AssetTypeUpdateWithoutAssetsInput = {
  assetClass?: InputMaybe<EnumAssetClassFieldUpdateOperationsInput>;
  code?: InputMaybe<StringFieldUpdateOperationsInput>;
  description?: InputMaybe<StringFieldUpdateOperationsInput>;
  locale?: InputMaybe<EnumAssetLocaleFieldUpdateOperationsInput>;
};

export type AssetTypeUpsertWithoutAssetsInput = {
  create: AssetTypeCreateWithoutAssetsInput;
  update: AssetTypeUpdateWithoutAssetsInput;
  where?: InputMaybe<AssetTypeWhereInput>;
};

export type AssetTypeWhereInput = {
  AND?: InputMaybe<Array<AssetTypeWhereInput>>;
  NOT?: InputMaybe<Array<AssetTypeWhereInput>>;
  OR?: InputMaybe<Array<AssetTypeWhereInput>>;
  assetClass?: InputMaybe<EnumAssetClassFilter>;
  assets?: InputMaybe<AssetListRelationFilter>;
  code?: InputMaybe<StringFilter>;
  description?: InputMaybe<StringFilter>;
  locale?: InputMaybe<EnumAssetLocaleFilter>;
};

export type AssetTypeWhereUniqueInput = {
  AND?: InputMaybe<Array<AssetTypeWhereInput>>;
  NOT?: InputMaybe<Array<AssetTypeWhereInput>>;
  OR?: InputMaybe<Array<AssetTypeWhereInput>>;
  assetClass?: InputMaybe<EnumAssetClassFilter>;
  assets?: InputMaybe<AssetListRelationFilter>;
  code?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<StringFilter>;
  locale?: InputMaybe<EnumAssetLocaleFilter>;
};

export type AssetUpdateManyMutationInput = {
  active?: InputMaybe<BoolFieldUpdateOperationsInput>;
  assetClass?: InputMaybe<EnumAssetClassFieldUpdateOperationsInput>;
  cik?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  compositeFigi?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  currencyName?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  delistedDate?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  description?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  homepageUrl?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  iconUrl?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  lastClose?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  lastHigh?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  lastLow?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  lastOpen?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  lastPrice?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  lastUpdated?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  lastVolume?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  lastVolumeWeighted?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  listDate?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  locale?: InputMaybe<EnumAssetLocaleFieldUpdateOperationsInput>;
  logoUrl?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  marketCap?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  name?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  plaid_security_id?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  primaryExchange?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  shareClassSharesOutstanding?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  sicCode?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  sicDescription?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  symbol?: InputMaybe<StringFieldUpdateOperationsInput>;
  todaysChange?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  todaysChangePerc?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  totalEmployees?: InputMaybe<NullableIntFieldUpdateOperationsInput>;
  type?: InputMaybe<StringFieldUpdateOperationsInput>;
};

export type AssetUpdateManyWithWhereWithoutFavoritedByInput = {
  data: AssetUpdateManyMutationInput;
  where: AssetScalarWhereInput;
};

export type AssetUpdateManyWithoutFavoritedByNestedInput = {
  connect?: InputMaybe<Array<AssetWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<AssetCreateOrConnectWithoutFavoritedByInput>>;
  create?: InputMaybe<Array<AssetCreateWithoutFavoritedByInput>>;
  delete?: InputMaybe<Array<AssetWhereUniqueInput>>;
  deleteMany?: InputMaybe<Array<AssetScalarWhereInput>>;
  disconnect?: InputMaybe<Array<AssetWhereUniqueInput>>;
  set?: InputMaybe<Array<AssetWhereUniqueInput>>;
  update?: InputMaybe<Array<AssetUpdateWithWhereUniqueWithoutFavoritedByInput>>;
  updateMany?: InputMaybe<Array<AssetUpdateManyWithWhereWithoutFavoritedByInput>>;
  upsert?: InputMaybe<Array<AssetUpsertWithWhereUniqueWithoutFavoritedByInput>>;
};

export type AssetUpdateOneRequiredWithoutHarvestTransactionItemsNestedInput = {
  connect?: InputMaybe<AssetWhereUniqueInput>;
  connectOrCreate?: InputMaybe<AssetCreateOrConnectWithoutHarvestTransactionItemsInput>;
  create?: InputMaybe<AssetCreateWithoutHarvestTransactionItemsInput>;
  update?: InputMaybe<AssetUpdateToOneWithWhereWithoutHarvestTransactionItemsInput>;
  upsert?: InputMaybe<AssetUpsertWithoutHarvestTransactionItemsInput>;
};

export type AssetUpdateOneRequiredWithoutLotsNestedInput = {
  connect?: InputMaybe<AssetWhereUniqueInput>;
  connectOrCreate?: InputMaybe<AssetCreateOrConnectWithoutLotsInput>;
  create?: InputMaybe<AssetCreateWithoutLotsInput>;
  update?: InputMaybe<AssetUpdateToOneWithWhereWithoutLotsInput>;
  upsert?: InputMaybe<AssetUpsertWithoutLotsInput>;
};

export type AssetUpdateOneRequiredWithoutPositionsNestedInput = {
  connect?: InputMaybe<AssetWhereUniqueInput>;
  connectOrCreate?: InputMaybe<AssetCreateOrConnectWithoutPositionsInput>;
  create?: InputMaybe<AssetCreateWithoutPositionsInput>;
  update?: InputMaybe<AssetUpdateToOneWithWhereWithoutPositionsInput>;
  upsert?: InputMaybe<AssetUpsertWithoutPositionsInput>;
};

export type AssetUpdateOneRequiredWithoutPriceHourlyVectorsNestedInput = {
  connect?: InputMaybe<AssetWhereUniqueInput>;
  connectOrCreate?: InputMaybe<AssetCreateOrConnectWithoutPriceHourlyVectorsInput>;
  create?: InputMaybe<AssetCreateWithoutPriceHourlyVectorsInput>;
  update?: InputMaybe<AssetUpdateToOneWithWhereWithoutPriceHourlyVectorsInput>;
  upsert?: InputMaybe<AssetUpsertWithoutPriceHourlyVectorsInput>;
};

export type AssetUpdateOneRequiredWithoutTransactionsNestedInput = {
  connect?: InputMaybe<AssetWhereUniqueInput>;
  connectOrCreate?: InputMaybe<AssetCreateOrConnectWithoutTransactionsInput>;
  create?: InputMaybe<AssetCreateWithoutTransactionsInput>;
  update?: InputMaybe<AssetUpdateToOneWithWhereWithoutTransactionsInput>;
  upsert?: InputMaybe<AssetUpsertWithoutTransactionsInput>;
};

export type AssetUpdateOneRequiredWithoutVectorGraphsNestedInput = {
  connect?: InputMaybe<AssetWhereUniqueInput>;
  connectOrCreate?: InputMaybe<AssetCreateOrConnectWithoutVectorGraphsInput>;
  create?: InputMaybe<AssetCreateWithoutVectorGraphsInput>;
  update?: InputMaybe<AssetUpdateToOneWithWhereWithoutVectorGraphsInput>;
  upsert?: InputMaybe<AssetUpsertWithoutVectorGraphsInput>;
};

export type AssetUpdateToOneWithWhereWithoutHarvestTransactionItemsInput = {
  data: AssetUpdateWithoutHarvestTransactionItemsInput;
  where?: InputMaybe<AssetWhereInput>;
};

export type AssetUpdateToOneWithWhereWithoutLotsInput = {
  data: AssetUpdateWithoutLotsInput;
  where?: InputMaybe<AssetWhereInput>;
};

export type AssetUpdateToOneWithWhereWithoutPositionsInput = {
  data: AssetUpdateWithoutPositionsInput;
  where?: InputMaybe<AssetWhereInput>;
};

export type AssetUpdateToOneWithWhereWithoutPriceHourlyVectorsInput = {
  data: AssetUpdateWithoutPriceHourlyVectorsInput;
  where?: InputMaybe<AssetWhereInput>;
};

export type AssetUpdateToOneWithWhereWithoutTransactionsInput = {
  data: AssetUpdateWithoutTransactionsInput;
  where?: InputMaybe<AssetWhereInput>;
};

export type AssetUpdateToOneWithWhereWithoutVectorGraphsInput = {
  data: AssetUpdateWithoutVectorGraphsInput;
  where?: InputMaybe<AssetWhereInput>;
};

export type AssetUpdateWithWhereUniqueWithoutFavoritedByInput = {
  data: AssetUpdateWithoutFavoritedByInput;
  where: AssetWhereUniqueInput;
};

export type AssetUpdateWithoutFavoritedByInput = {
  active?: InputMaybe<BoolFieldUpdateOperationsInput>;
  assetClass?: InputMaybe<EnumAssetClassFieldUpdateOperationsInput>;
  assetType?: InputMaybe<AssetTypeUpdateOneWithoutAssetsNestedInput>;
  cik?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  compositeFigi?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  currencyName?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  delistedDate?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  description?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  harvestTransactionItems?: InputMaybe<HarvestTransactionItemUpdateManyWithoutAssetNestedInput>;
  homepageUrl?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  iconUrl?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  lastClose?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  lastHigh?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  lastLow?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  lastOpen?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  lastPrice?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  lastUpdated?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  lastVolume?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  lastVolumeWeighted?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  listDate?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  locale?: InputMaybe<EnumAssetLocaleFieldUpdateOperationsInput>;
  logoUrl?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  lots?: InputMaybe<LotUpdateManyWithoutAssetNestedInput>;
  marketCap?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  name?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  plaid_security_id?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  positions?: InputMaybe<PositionUpdateManyWithoutAssetNestedInput>;
  priceHourly?: InputMaybe<PriceHourlyUpdateManyWithoutAsssetNestedInput>;
  priceHourlyVectors?: InputMaybe<PriceHourlyVectorUpdateManyWithoutAssetNestedInput>;
  primaryExchange?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  shareClassSharesOutstanding?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  sicCode?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  sicDescription?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  symbol?: InputMaybe<StringFieldUpdateOperationsInput>;
  todaysChange?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  todaysChangePerc?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  totalEmployees?: InputMaybe<NullableIntFieldUpdateOperationsInput>;
  transactions?: InputMaybe<TransactionUpdateManyWithoutAssetNestedInput>;
  type?: InputMaybe<StringFieldUpdateOperationsInput>;
  vectorGraphs?: InputMaybe<VectorGraphUpdateManyWithoutAssetNestedInput>;
};

export type AssetUpdateWithoutHarvestTransactionItemsInput = {
  active?: InputMaybe<BoolFieldUpdateOperationsInput>;
  assetClass?: InputMaybe<EnumAssetClassFieldUpdateOperationsInput>;
  assetType?: InputMaybe<AssetTypeUpdateOneWithoutAssetsNestedInput>;
  cik?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  compositeFigi?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  currencyName?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  delistedDate?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  description?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  favoritedBy?: InputMaybe<UserUpdateManyWithoutFavoritesNestedInput>;
  homepageUrl?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  iconUrl?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  lastClose?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  lastHigh?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  lastLow?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  lastOpen?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  lastPrice?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  lastUpdated?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  lastVolume?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  lastVolumeWeighted?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  listDate?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  locale?: InputMaybe<EnumAssetLocaleFieldUpdateOperationsInput>;
  logoUrl?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  lots?: InputMaybe<LotUpdateManyWithoutAssetNestedInput>;
  marketCap?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  name?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  plaid_security_id?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  positions?: InputMaybe<PositionUpdateManyWithoutAssetNestedInput>;
  priceHourly?: InputMaybe<PriceHourlyUpdateManyWithoutAsssetNestedInput>;
  priceHourlyVectors?: InputMaybe<PriceHourlyVectorUpdateManyWithoutAssetNestedInput>;
  primaryExchange?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  shareClassSharesOutstanding?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  sicCode?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  sicDescription?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  symbol?: InputMaybe<StringFieldUpdateOperationsInput>;
  todaysChange?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  todaysChangePerc?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  totalEmployees?: InputMaybe<NullableIntFieldUpdateOperationsInput>;
  transactions?: InputMaybe<TransactionUpdateManyWithoutAssetNestedInput>;
  type?: InputMaybe<StringFieldUpdateOperationsInput>;
  vectorGraphs?: InputMaybe<VectorGraphUpdateManyWithoutAssetNestedInput>;
};

export type AssetUpdateWithoutLotsInput = {
  active?: InputMaybe<BoolFieldUpdateOperationsInput>;
  assetClass?: InputMaybe<EnumAssetClassFieldUpdateOperationsInput>;
  assetType?: InputMaybe<AssetTypeUpdateOneWithoutAssetsNestedInput>;
  cik?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  compositeFigi?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  currencyName?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  delistedDate?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  description?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  favoritedBy?: InputMaybe<UserUpdateManyWithoutFavoritesNestedInput>;
  harvestTransactionItems?: InputMaybe<HarvestTransactionItemUpdateManyWithoutAssetNestedInput>;
  homepageUrl?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  iconUrl?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  lastClose?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  lastHigh?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  lastLow?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  lastOpen?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  lastPrice?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  lastUpdated?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  lastVolume?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  lastVolumeWeighted?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  listDate?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  locale?: InputMaybe<EnumAssetLocaleFieldUpdateOperationsInput>;
  logoUrl?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  marketCap?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  name?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  plaid_security_id?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  positions?: InputMaybe<PositionUpdateManyWithoutAssetNestedInput>;
  priceHourly?: InputMaybe<PriceHourlyUpdateManyWithoutAsssetNestedInput>;
  priceHourlyVectors?: InputMaybe<PriceHourlyVectorUpdateManyWithoutAssetNestedInput>;
  primaryExchange?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  shareClassSharesOutstanding?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  sicCode?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  sicDescription?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  symbol?: InputMaybe<StringFieldUpdateOperationsInput>;
  todaysChange?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  todaysChangePerc?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  totalEmployees?: InputMaybe<NullableIntFieldUpdateOperationsInput>;
  transactions?: InputMaybe<TransactionUpdateManyWithoutAssetNestedInput>;
  type?: InputMaybe<StringFieldUpdateOperationsInput>;
  vectorGraphs?: InputMaybe<VectorGraphUpdateManyWithoutAssetNestedInput>;
};

export type AssetUpdateWithoutPositionsInput = {
  active?: InputMaybe<BoolFieldUpdateOperationsInput>;
  assetClass?: InputMaybe<EnumAssetClassFieldUpdateOperationsInput>;
  assetType?: InputMaybe<AssetTypeUpdateOneWithoutAssetsNestedInput>;
  cik?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  compositeFigi?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  currencyName?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  delistedDate?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  description?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  favoritedBy?: InputMaybe<UserUpdateManyWithoutFavoritesNestedInput>;
  harvestTransactionItems?: InputMaybe<HarvestTransactionItemUpdateManyWithoutAssetNestedInput>;
  homepageUrl?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  iconUrl?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  lastClose?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  lastHigh?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  lastLow?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  lastOpen?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  lastPrice?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  lastUpdated?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  lastVolume?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  lastVolumeWeighted?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  listDate?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  locale?: InputMaybe<EnumAssetLocaleFieldUpdateOperationsInput>;
  logoUrl?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  lots?: InputMaybe<LotUpdateManyWithoutAssetNestedInput>;
  marketCap?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  name?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  plaid_security_id?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  priceHourly?: InputMaybe<PriceHourlyUpdateManyWithoutAsssetNestedInput>;
  priceHourlyVectors?: InputMaybe<PriceHourlyVectorUpdateManyWithoutAssetNestedInput>;
  primaryExchange?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  shareClassSharesOutstanding?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  sicCode?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  sicDescription?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  symbol?: InputMaybe<StringFieldUpdateOperationsInput>;
  todaysChange?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  todaysChangePerc?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  totalEmployees?: InputMaybe<NullableIntFieldUpdateOperationsInput>;
  transactions?: InputMaybe<TransactionUpdateManyWithoutAssetNestedInput>;
  type?: InputMaybe<StringFieldUpdateOperationsInput>;
  vectorGraphs?: InputMaybe<VectorGraphUpdateManyWithoutAssetNestedInput>;
};

export type AssetUpdateWithoutPriceHourlyVectorsInput = {
  active?: InputMaybe<BoolFieldUpdateOperationsInput>;
  assetClass?: InputMaybe<EnumAssetClassFieldUpdateOperationsInput>;
  assetType?: InputMaybe<AssetTypeUpdateOneWithoutAssetsNestedInput>;
  cik?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  compositeFigi?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  currencyName?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  delistedDate?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  description?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  favoritedBy?: InputMaybe<UserUpdateManyWithoutFavoritesNestedInput>;
  harvestTransactionItems?: InputMaybe<HarvestTransactionItemUpdateManyWithoutAssetNestedInput>;
  homepageUrl?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  iconUrl?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  lastClose?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  lastHigh?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  lastLow?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  lastOpen?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  lastPrice?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  lastUpdated?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  lastVolume?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  lastVolumeWeighted?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  listDate?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  locale?: InputMaybe<EnumAssetLocaleFieldUpdateOperationsInput>;
  logoUrl?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  lots?: InputMaybe<LotUpdateManyWithoutAssetNestedInput>;
  marketCap?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  name?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  plaid_security_id?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  positions?: InputMaybe<PositionUpdateManyWithoutAssetNestedInput>;
  priceHourly?: InputMaybe<PriceHourlyUpdateManyWithoutAsssetNestedInput>;
  primaryExchange?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  shareClassSharesOutstanding?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  sicCode?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  sicDescription?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  symbol?: InputMaybe<StringFieldUpdateOperationsInput>;
  todaysChange?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  todaysChangePerc?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  totalEmployees?: InputMaybe<NullableIntFieldUpdateOperationsInput>;
  transactions?: InputMaybe<TransactionUpdateManyWithoutAssetNestedInput>;
  type?: InputMaybe<StringFieldUpdateOperationsInput>;
  vectorGraphs?: InputMaybe<VectorGraphUpdateManyWithoutAssetNestedInput>;
};

export type AssetUpdateWithoutTransactionsInput = {
  active?: InputMaybe<BoolFieldUpdateOperationsInput>;
  assetClass?: InputMaybe<EnumAssetClassFieldUpdateOperationsInput>;
  assetType?: InputMaybe<AssetTypeUpdateOneWithoutAssetsNestedInput>;
  cik?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  compositeFigi?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  currencyName?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  delistedDate?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  description?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  favoritedBy?: InputMaybe<UserUpdateManyWithoutFavoritesNestedInput>;
  harvestTransactionItems?: InputMaybe<HarvestTransactionItemUpdateManyWithoutAssetNestedInput>;
  homepageUrl?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  iconUrl?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  lastClose?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  lastHigh?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  lastLow?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  lastOpen?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  lastPrice?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  lastUpdated?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  lastVolume?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  lastVolumeWeighted?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  listDate?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  locale?: InputMaybe<EnumAssetLocaleFieldUpdateOperationsInput>;
  logoUrl?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  lots?: InputMaybe<LotUpdateManyWithoutAssetNestedInput>;
  marketCap?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  name?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  plaid_security_id?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  positions?: InputMaybe<PositionUpdateManyWithoutAssetNestedInput>;
  priceHourly?: InputMaybe<PriceHourlyUpdateManyWithoutAsssetNestedInput>;
  priceHourlyVectors?: InputMaybe<PriceHourlyVectorUpdateManyWithoutAssetNestedInput>;
  primaryExchange?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  shareClassSharesOutstanding?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  sicCode?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  sicDescription?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  symbol?: InputMaybe<StringFieldUpdateOperationsInput>;
  todaysChange?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  todaysChangePerc?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  totalEmployees?: InputMaybe<NullableIntFieldUpdateOperationsInput>;
  type?: InputMaybe<StringFieldUpdateOperationsInput>;
  vectorGraphs?: InputMaybe<VectorGraphUpdateManyWithoutAssetNestedInput>;
};

export type AssetUpdateWithoutVectorGraphsInput = {
  active?: InputMaybe<BoolFieldUpdateOperationsInput>;
  assetClass?: InputMaybe<EnumAssetClassFieldUpdateOperationsInput>;
  assetType?: InputMaybe<AssetTypeUpdateOneWithoutAssetsNestedInput>;
  cik?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  compositeFigi?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  currencyName?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  delistedDate?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  description?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  favoritedBy?: InputMaybe<UserUpdateManyWithoutFavoritesNestedInput>;
  harvestTransactionItems?: InputMaybe<HarvestTransactionItemUpdateManyWithoutAssetNestedInput>;
  homepageUrl?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  iconUrl?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  lastClose?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  lastHigh?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  lastLow?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  lastOpen?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  lastPrice?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  lastUpdated?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  lastVolume?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  lastVolumeWeighted?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  listDate?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  locale?: InputMaybe<EnumAssetLocaleFieldUpdateOperationsInput>;
  logoUrl?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  lots?: InputMaybe<LotUpdateManyWithoutAssetNestedInput>;
  marketCap?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  name?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  plaid_security_id?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  positions?: InputMaybe<PositionUpdateManyWithoutAssetNestedInput>;
  priceHourly?: InputMaybe<PriceHourlyUpdateManyWithoutAsssetNestedInput>;
  priceHourlyVectors?: InputMaybe<PriceHourlyVectorUpdateManyWithoutAssetNestedInput>;
  primaryExchange?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  shareClassSharesOutstanding?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  sicCode?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  sicDescription?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  symbol?: InputMaybe<StringFieldUpdateOperationsInput>;
  todaysChange?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  todaysChangePerc?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  totalEmployees?: InputMaybe<NullableIntFieldUpdateOperationsInput>;
  transactions?: InputMaybe<TransactionUpdateManyWithoutAssetNestedInput>;
  type?: InputMaybe<StringFieldUpdateOperationsInput>;
};

export type AssetUpsertWithWhereUniqueWithoutFavoritedByInput = {
  create: AssetCreateWithoutFavoritedByInput;
  update: AssetUpdateWithoutFavoritedByInput;
  where: AssetWhereUniqueInput;
};

export type AssetUpsertWithoutHarvestTransactionItemsInput = {
  create: AssetCreateWithoutHarvestTransactionItemsInput;
  update: AssetUpdateWithoutHarvestTransactionItemsInput;
  where?: InputMaybe<AssetWhereInput>;
};

export type AssetUpsertWithoutLotsInput = {
  create: AssetCreateWithoutLotsInput;
  update: AssetUpdateWithoutLotsInput;
  where?: InputMaybe<AssetWhereInput>;
};

export type AssetUpsertWithoutPositionsInput = {
  create: AssetCreateWithoutPositionsInput;
  update: AssetUpdateWithoutPositionsInput;
  where?: InputMaybe<AssetWhereInput>;
};

export type AssetUpsertWithoutPriceHourlyVectorsInput = {
  create: AssetCreateWithoutPriceHourlyVectorsInput;
  update: AssetUpdateWithoutPriceHourlyVectorsInput;
  where?: InputMaybe<AssetWhereInput>;
};

export type AssetUpsertWithoutTransactionsInput = {
  create: AssetCreateWithoutTransactionsInput;
  update: AssetUpdateWithoutTransactionsInput;
  where?: InputMaybe<AssetWhereInput>;
};

export type AssetUpsertWithoutVectorGraphsInput = {
  create: AssetCreateWithoutVectorGraphsInput;
  update: AssetUpdateWithoutVectorGraphsInput;
  where?: InputMaybe<AssetWhereInput>;
};

export type AssetWhereInput = {
  AND?: InputMaybe<Array<AssetWhereInput>>;
  NOT?: InputMaybe<Array<AssetWhereInput>>;
  OR?: InputMaybe<Array<AssetWhereInput>>;
  active?: InputMaybe<BoolFilter>;
  assetClass?: InputMaybe<EnumAssetClassFilter>;
  assetType?: InputMaybe<AssetTypeNullableScalarRelationFilter>;
  assetTypeCode?: InputMaybe<StringNullableFilter>;
  cik?: InputMaybe<StringNullableFilter>;
  compositeFigi?: InputMaybe<StringNullableFilter>;
  currencyName?: InputMaybe<StringNullableFilter>;
  delistedDate?: InputMaybe<DateTimeNullableFilter>;
  description?: InputMaybe<StringNullableFilter>;
  favoritedBy?: InputMaybe<UserListRelationFilter>;
  harvestTransactionItems?: InputMaybe<HarvestTransactionItemListRelationFilter>;
  homepageUrl?: InputMaybe<StringNullableFilter>;
  iconUrl?: InputMaybe<StringNullableFilter>;
  lastClose?: InputMaybe<DecimalFilter>;
  lastHigh?: InputMaybe<DecimalFilter>;
  lastLow?: InputMaybe<DecimalFilter>;
  lastOpen?: InputMaybe<DecimalFilter>;
  lastPrice?: InputMaybe<DecimalFilter>;
  lastUpdated?: InputMaybe<DateTimeFilter>;
  lastVolume?: InputMaybe<DecimalFilter>;
  lastVolumeWeighted?: InputMaybe<DecimalFilter>;
  listDate?: InputMaybe<DateTimeNullableFilter>;
  locale?: InputMaybe<EnumAssetLocaleFilter>;
  logoUrl?: InputMaybe<StringNullableFilter>;
  lots?: InputMaybe<LotListRelationFilter>;
  marketCap?: InputMaybe<DecimalNullableFilter>;
  name?: InputMaybe<StringNullableFilter>;
  plaid_security_id?: InputMaybe<StringNullableFilter>;
  positions?: InputMaybe<PositionListRelationFilter>;
  priceHourly?: InputMaybe<PriceHourlyListRelationFilter>;
  priceHourlyVectors?: InputMaybe<PriceHourlyVectorListRelationFilter>;
  primaryExchange?: InputMaybe<StringNullableFilter>;
  shareClassSharesOutstanding?: InputMaybe<DecimalNullableFilter>;
  sicCode?: InputMaybe<StringNullableFilter>;
  sicDescription?: InputMaybe<StringNullableFilter>;
  symbol?: InputMaybe<StringFilter>;
  todaysChange?: InputMaybe<DecimalFilter>;
  todaysChangePerc?: InputMaybe<DecimalFilter>;
  totalEmployees?: InputMaybe<IntNullableFilter>;
  transactions?: InputMaybe<TransactionListRelationFilter>;
  type?: InputMaybe<StringFilter>;
  vectorGraphs?: InputMaybe<VectorGraphListRelationFilter>;
};

export type AssetWhereUniqueInput = {
  AND?: InputMaybe<Array<AssetWhereInput>>;
  NOT?: InputMaybe<Array<AssetWhereInput>>;
  OR?: InputMaybe<Array<AssetWhereInput>>;
  active?: InputMaybe<BoolFilter>;
  assetClass?: InputMaybe<EnumAssetClassFilter>;
  assetType?: InputMaybe<AssetTypeNullableScalarRelationFilter>;
  assetTypeCode?: InputMaybe<StringNullableFilter>;
  cik?: InputMaybe<StringNullableFilter>;
  compositeFigi?: InputMaybe<StringNullableFilter>;
  currencyName?: InputMaybe<StringNullableFilter>;
  delistedDate?: InputMaybe<DateTimeNullableFilter>;
  description?: InputMaybe<StringNullableFilter>;
  favoritedBy?: InputMaybe<UserListRelationFilter>;
  harvestTransactionItems?: InputMaybe<HarvestTransactionItemListRelationFilter>;
  homepageUrl?: InputMaybe<StringNullableFilter>;
  iconUrl?: InputMaybe<StringNullableFilter>;
  lastClose?: InputMaybe<DecimalFilter>;
  lastHigh?: InputMaybe<DecimalFilter>;
  lastLow?: InputMaybe<DecimalFilter>;
  lastOpen?: InputMaybe<DecimalFilter>;
  lastPrice?: InputMaybe<DecimalFilter>;
  lastUpdated?: InputMaybe<DateTimeFilter>;
  lastVolume?: InputMaybe<DecimalFilter>;
  lastVolumeWeighted?: InputMaybe<DecimalFilter>;
  listDate?: InputMaybe<DateTimeNullableFilter>;
  locale?: InputMaybe<EnumAssetLocaleFilter>;
  logoUrl?: InputMaybe<StringNullableFilter>;
  lots?: InputMaybe<LotListRelationFilter>;
  marketCap?: InputMaybe<DecimalNullableFilter>;
  name?: InputMaybe<StringNullableFilter>;
  plaid_security_id?: InputMaybe<Scalars['String']['input']>;
  positions?: InputMaybe<PositionListRelationFilter>;
  priceHourly?: InputMaybe<PriceHourlyListRelationFilter>;
  priceHourlyVectors?: InputMaybe<PriceHourlyVectorListRelationFilter>;
  primaryExchange?: InputMaybe<StringNullableFilter>;
  shareClassSharesOutstanding?: InputMaybe<DecimalNullableFilter>;
  sicCode?: InputMaybe<StringNullableFilter>;
  sicDescription?: InputMaybe<StringNullableFilter>;
  symbol?: InputMaybe<Scalars['String']['input']>;
  todaysChange?: InputMaybe<DecimalFilter>;
  todaysChangePerc?: InputMaybe<DecimalFilter>;
  totalEmployees?: InputMaybe<IntNullableFilter>;
  transactions?: InputMaybe<TransactionListRelationFilter>;
  type?: InputMaybe<StringFilter>;
  vectorGraphs?: InputMaybe<VectorGraphListRelationFilter>;
};

/** An authorized connection to some external system */
export type AuthConnection = {
  __typename?: 'AuthConnection';
  _count: AuthConnectionCount;
  accounts?: Maybe<Array<Account>>;
  /** When were current authentication credentials generated with the provider */
  authedAt: Scalars['DateTime']['output'];
  /** When the model was created */
  createdAt: Scalars['DateTime']['output'];
  /** PLAID -> Plaid Item id, ETRADE -> random UUID since they dont have one */
  externalId: Scalars['String']['output'];
  /** Internal identifier */
  id: Scalars['ID']['output'];
  /** Is the connection currently syncing */
  isSyncing: Scalars['Boolean']['output'];
  /** When was the last transaction sync Plaid */
  lastTransactionSyncedAtPlaid?: Maybe<Scalars['DateTime']['output']>;
  lotTransactionBatch?: Maybe<Array<LotTransactionBatch>>;
  portfolio: Portfolio;
  /** The portfolio this provider belongs to */
  portfolioId: Scalars['String']['output'];
  /** Source of the auth */
  source: AuthSource;
  /** When was the sync made */
  syncedAt?: Maybe<Scalars['DateTime']['output']>;
  /** The type of auth */
  type: AuthType;
  /** When the model was updated */
  updatedAt: Scalars['DateTime']['output'];
  user: User;
  /** User this provider pertains to */
  userId: Scalars['String']['output'];
  /** Used for etrade to store the url where the user can get their verifier code (valid for 5 minutes) */
  verificationUrl?: Maybe<Scalars['String']['output']>;
};

export type AuthConnectionCount = {
  __typename?: 'AuthConnectionCount';
  accounts: Scalars['Int']['output'];
  lotTransactionBatch: Scalars['Int']['output'];
};

export type AuthConnectionCountAggregate = {
  __typename?: 'AuthConnectionCountAggregate';
  _all: Scalars['Int']['output'];
  authedAt: Scalars['Int']['output'];
  createdAt: Scalars['Int']['output'];
  externalId: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  isSyncing: Scalars['Int']['output'];
  lastTransactionSyncedAtPlaid: Scalars['Int']['output'];
  portfolioId: Scalars['Int']['output'];
  source: Scalars['Int']['output'];
  syncedAt: Scalars['Int']['output'];
  type: Scalars['Int']['output'];
  updatedAt: Scalars['Int']['output'];
  userId: Scalars['Int']['output'];
  verificationUrl: Scalars['Int']['output'];
};

export type AuthConnectionCreateManyPortfolioInput = {
  authedAt?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  externalId: Scalars['String']['input'];
  id?: InputMaybe<Scalars['String']['input']>;
  isSyncing?: InputMaybe<Scalars['Boolean']['input']>;
  lastTransactionSyncedAtPlaid?: InputMaybe<Scalars['DateTime']['input']>;
  source: AuthSource;
  syncedAt?: InputMaybe<Scalars['DateTime']['input']>;
  type: AuthType;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
  userId: Scalars['String']['input'];
  verificationUrl?: InputMaybe<Scalars['String']['input']>;
};

export type AuthConnectionCreateManyPortfolioInputEnvelope = {
  data: Array<AuthConnectionCreateManyPortfolioInput>;
  skipDuplicates?: InputMaybe<Scalars['Boolean']['input']>;
};

export type AuthConnectionCreateManyUserInput = {
  authedAt?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  externalId: Scalars['String']['input'];
  id?: InputMaybe<Scalars['String']['input']>;
  isSyncing?: InputMaybe<Scalars['Boolean']['input']>;
  lastTransactionSyncedAtPlaid?: InputMaybe<Scalars['DateTime']['input']>;
  portfolioId: Scalars['String']['input'];
  source: AuthSource;
  syncedAt?: InputMaybe<Scalars['DateTime']['input']>;
  type: AuthType;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
  verificationUrl?: InputMaybe<Scalars['String']['input']>;
};

export type AuthConnectionCreateManyUserInputEnvelope = {
  data: Array<AuthConnectionCreateManyUserInput>;
  skipDuplicates?: InputMaybe<Scalars['Boolean']['input']>;
};

export type AuthConnectionCreateNestedManyWithoutPortfolioInput = {
  connect?: InputMaybe<Array<AuthConnectionWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<AuthConnectionCreateOrConnectWithoutPortfolioInput>>;
  create?: InputMaybe<Array<AuthConnectionCreateWithoutPortfolioInput>>;
  createMany?: InputMaybe<AuthConnectionCreateManyPortfolioInputEnvelope>;
};

export type AuthConnectionCreateNestedManyWithoutUserInput = {
  connect?: InputMaybe<Array<AuthConnectionWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<AuthConnectionCreateOrConnectWithoutUserInput>>;
  create?: InputMaybe<Array<AuthConnectionCreateWithoutUserInput>>;
  createMany?: InputMaybe<AuthConnectionCreateManyUserInputEnvelope>;
};

export type AuthConnectionCreateNestedOneWithoutAccountsInput = {
  connect?: InputMaybe<AuthConnectionWhereUniqueInput>;
  connectOrCreate?: InputMaybe<AuthConnectionCreateOrConnectWithoutAccountsInput>;
  create?: InputMaybe<AuthConnectionCreateWithoutAccountsInput>;
};

export type AuthConnectionCreateNestedOneWithoutLotTransactionBatchInput = {
  connect?: InputMaybe<AuthConnectionWhereUniqueInput>;
  connectOrCreate?: InputMaybe<AuthConnectionCreateOrConnectWithoutLotTransactionBatchInput>;
  create?: InputMaybe<AuthConnectionCreateWithoutLotTransactionBatchInput>;
};

export type AuthConnectionCreateOrConnectWithoutAccountsInput = {
  create: AuthConnectionCreateWithoutAccountsInput;
  where: AuthConnectionWhereUniqueInput;
};

export type AuthConnectionCreateOrConnectWithoutLotTransactionBatchInput = {
  create: AuthConnectionCreateWithoutLotTransactionBatchInput;
  where: AuthConnectionWhereUniqueInput;
};

export type AuthConnectionCreateOrConnectWithoutPortfolioInput = {
  create: AuthConnectionCreateWithoutPortfolioInput;
  where: AuthConnectionWhereUniqueInput;
};

export type AuthConnectionCreateOrConnectWithoutUserInput = {
  create: AuthConnectionCreateWithoutUserInput;
  where: AuthConnectionWhereUniqueInput;
};

export type AuthConnectionCreateWithoutAccountsInput = {
  authedAt?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  externalId: Scalars['String']['input'];
  id?: InputMaybe<Scalars['String']['input']>;
  isSyncing?: InputMaybe<Scalars['Boolean']['input']>;
  lastTransactionSyncedAtPlaid?: InputMaybe<Scalars['DateTime']['input']>;
  lotTransactionBatch?: InputMaybe<LotTransactionBatchCreateNestedManyWithoutAuthConnectionInput>;
  portfolio: PortfolioCreateNestedOneWithoutAuthConnectionsInput;
  source: AuthSource;
  syncedAt?: InputMaybe<Scalars['DateTime']['input']>;
  type: AuthType;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
  user: UserCreateNestedOneWithoutAuthConnectionsInput;
  verificationUrl?: InputMaybe<Scalars['String']['input']>;
};

export type AuthConnectionCreateWithoutLotTransactionBatchInput = {
  accounts?: InputMaybe<AccountCreateNestedManyWithoutAuthConnectionInput>;
  authedAt?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  externalId: Scalars['String']['input'];
  id?: InputMaybe<Scalars['String']['input']>;
  isSyncing?: InputMaybe<Scalars['Boolean']['input']>;
  lastTransactionSyncedAtPlaid?: InputMaybe<Scalars['DateTime']['input']>;
  portfolio: PortfolioCreateNestedOneWithoutAuthConnectionsInput;
  source: AuthSource;
  syncedAt?: InputMaybe<Scalars['DateTime']['input']>;
  type: AuthType;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
  user: UserCreateNestedOneWithoutAuthConnectionsInput;
  verificationUrl?: InputMaybe<Scalars['String']['input']>;
};

export type AuthConnectionCreateWithoutPortfolioInput = {
  accounts?: InputMaybe<AccountCreateNestedManyWithoutAuthConnectionInput>;
  authedAt?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  externalId: Scalars['String']['input'];
  id?: InputMaybe<Scalars['String']['input']>;
  isSyncing?: InputMaybe<Scalars['Boolean']['input']>;
  lastTransactionSyncedAtPlaid?: InputMaybe<Scalars['DateTime']['input']>;
  lotTransactionBatch?: InputMaybe<LotTransactionBatchCreateNestedManyWithoutAuthConnectionInput>;
  source: AuthSource;
  syncedAt?: InputMaybe<Scalars['DateTime']['input']>;
  type: AuthType;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
  user: UserCreateNestedOneWithoutAuthConnectionsInput;
  verificationUrl?: InputMaybe<Scalars['String']['input']>;
};

export type AuthConnectionCreateWithoutUserInput = {
  accounts?: InputMaybe<AccountCreateNestedManyWithoutAuthConnectionInput>;
  authedAt?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  externalId: Scalars['String']['input'];
  id?: InputMaybe<Scalars['String']['input']>;
  isSyncing?: InputMaybe<Scalars['Boolean']['input']>;
  lastTransactionSyncedAtPlaid?: InputMaybe<Scalars['DateTime']['input']>;
  lotTransactionBatch?: InputMaybe<LotTransactionBatchCreateNestedManyWithoutAuthConnectionInput>;
  portfolio: PortfolioCreateNestedOneWithoutAuthConnectionsInput;
  source: AuthSource;
  syncedAt?: InputMaybe<Scalars['DateTime']['input']>;
  type: AuthType;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
  verificationUrl?: InputMaybe<Scalars['String']['input']>;
};

export type AuthConnectionExt = {
  __typename?: 'AuthConnectionExt';
  _count: AuthConnectionCount;
  _requiresReAuth: Scalars['Boolean']['output'];
  accounts?: Maybe<Array<Account>>;
  /** When were current authentication credentials generated with the provider */
  authedAt: Scalars['DateTime']['output'];
  /** When the model was created */
  createdAt: Scalars['DateTime']['output'];
  /** PLAID -> Plaid Item id, ETRADE -> random UUID since they dont have one */
  externalId: Scalars['String']['output'];
  /** Internal identifier */
  id: Scalars['ID']['output'];
  /** Is the connection currently syncing */
  isSyncing: Scalars['Boolean']['output'];
  /** When was the last transaction sync Plaid */
  lastTransactionSyncedAtPlaid?: Maybe<Scalars['DateTime']['output']>;
  lotTransactionBatch?: Maybe<Array<LotTransactionBatch>>;
  portfolio: Portfolio;
  /** The portfolio this provider belongs to */
  portfolioId: Scalars['String']['output'];
  /** Source of the auth */
  source: AuthSource;
  /** When was the sync made */
  syncedAt?: Maybe<Scalars['DateTime']['output']>;
  /** The type of auth */
  type: AuthType;
  /** When the model was updated */
  updatedAt: Scalars['DateTime']['output'];
  user: User;
  /** User this provider pertains to */
  userId: Scalars['String']['output'];
  /** Used for etrade to store the url where the user can get their verifier code (valid for 5 minutes) */
  verificationUrl?: Maybe<Scalars['String']['output']>;
};

export type AuthConnectionListRelationFilter = {
  every?: InputMaybe<AuthConnectionWhereInput>;
  none?: InputMaybe<AuthConnectionWhereInput>;
  some?: InputMaybe<AuthConnectionWhereInput>;
};

export type AuthConnectionMaxAggregate = {
  __typename?: 'AuthConnectionMaxAggregate';
  authedAt?: Maybe<Scalars['DateTime']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  externalId?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  isSyncing?: Maybe<Scalars['Boolean']['output']>;
  lastTransactionSyncedAtPlaid?: Maybe<Scalars['DateTime']['output']>;
  portfolioId?: Maybe<Scalars['String']['output']>;
  source?: Maybe<AuthSource>;
  syncedAt?: Maybe<Scalars['DateTime']['output']>;
  type?: Maybe<AuthType>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  userId?: Maybe<Scalars['String']['output']>;
  verificationUrl?: Maybe<Scalars['String']['output']>;
};

export type AuthConnectionMinAggregate = {
  __typename?: 'AuthConnectionMinAggregate';
  authedAt?: Maybe<Scalars['DateTime']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  externalId?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  isSyncing?: Maybe<Scalars['Boolean']['output']>;
  lastTransactionSyncedAtPlaid?: Maybe<Scalars['DateTime']['output']>;
  portfolioId?: Maybe<Scalars['String']['output']>;
  source?: Maybe<AuthSource>;
  syncedAt?: Maybe<Scalars['DateTime']['output']>;
  type?: Maybe<AuthType>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  userId?: Maybe<Scalars['String']['output']>;
  verificationUrl?: Maybe<Scalars['String']['output']>;
};

export type AuthConnectionNullableScalarRelationFilter = {
  is?: InputMaybe<AuthConnectionWhereInput>;
  isNot?: InputMaybe<AuthConnectionWhereInput>;
};

export type AuthConnectionScalarRelationFilter = {
  is?: InputMaybe<AuthConnectionWhereInput>;
  isNot?: InputMaybe<AuthConnectionWhereInput>;
};

export type AuthConnectionScalarWhereInput = {
  AND?: InputMaybe<Array<AuthConnectionScalarWhereInput>>;
  NOT?: InputMaybe<Array<AuthConnectionScalarWhereInput>>;
  OR?: InputMaybe<Array<AuthConnectionScalarWhereInput>>;
  authedAt?: InputMaybe<DateTimeFilter>;
  createdAt?: InputMaybe<DateTimeFilter>;
  externalId?: InputMaybe<StringFilter>;
  id?: InputMaybe<UuidFilter>;
  isSyncing?: InputMaybe<BoolFilter>;
  lastTransactionSyncedAtPlaid?: InputMaybe<DateTimeNullableFilter>;
  portfolioId?: InputMaybe<UuidFilter>;
  source?: InputMaybe<EnumAuthSourceFilter>;
  syncedAt?: InputMaybe<DateTimeNullableFilter>;
  type?: InputMaybe<EnumAuthTypeFilter>;
  updatedAt?: InputMaybe<DateTimeFilter>;
  userId?: InputMaybe<StringFilter>;
  verificationUrl?: InputMaybe<StringNullableFilter>;
};

export type AuthConnectionSourceUserIdPortfolioIdExternalIdCompoundUniqueInput = {
  externalId: Scalars['String']['input'];
  portfolioId: Scalars['String']['input'];
  source: AuthSource;
  userId: Scalars['String']['input'];
};

export type AuthConnectionUpdateManyMutationInput = {
  authedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  externalId?: InputMaybe<StringFieldUpdateOperationsInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  isSyncing?: InputMaybe<BoolFieldUpdateOperationsInput>;
  lastTransactionSyncedAtPlaid?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  source?: InputMaybe<EnumAuthSourceFieldUpdateOperationsInput>;
  syncedAt?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  type?: InputMaybe<EnumAuthTypeFieldUpdateOperationsInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  verificationUrl?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
};

export type AuthConnectionUpdateManyWithWhereWithoutPortfolioInput = {
  data: AuthConnectionUpdateManyMutationInput;
  where: AuthConnectionScalarWhereInput;
};

export type AuthConnectionUpdateManyWithWhereWithoutUserInput = {
  data: AuthConnectionUpdateManyMutationInput;
  where: AuthConnectionScalarWhereInput;
};

export type AuthConnectionUpdateManyWithoutPortfolioNestedInput = {
  connect?: InputMaybe<Array<AuthConnectionWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<AuthConnectionCreateOrConnectWithoutPortfolioInput>>;
  create?: InputMaybe<Array<AuthConnectionCreateWithoutPortfolioInput>>;
  createMany?: InputMaybe<AuthConnectionCreateManyPortfolioInputEnvelope>;
  delete?: InputMaybe<Array<AuthConnectionWhereUniqueInput>>;
  deleteMany?: InputMaybe<Array<AuthConnectionScalarWhereInput>>;
  disconnect?: InputMaybe<Array<AuthConnectionWhereUniqueInput>>;
  set?: InputMaybe<Array<AuthConnectionWhereUniqueInput>>;
  update?: InputMaybe<Array<AuthConnectionUpdateWithWhereUniqueWithoutPortfolioInput>>;
  updateMany?: InputMaybe<Array<AuthConnectionUpdateManyWithWhereWithoutPortfolioInput>>;
  upsert?: InputMaybe<Array<AuthConnectionUpsertWithWhereUniqueWithoutPortfolioInput>>;
};

export type AuthConnectionUpdateManyWithoutUserNestedInput = {
  connect?: InputMaybe<Array<AuthConnectionWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<AuthConnectionCreateOrConnectWithoutUserInput>>;
  create?: InputMaybe<Array<AuthConnectionCreateWithoutUserInput>>;
  createMany?: InputMaybe<AuthConnectionCreateManyUserInputEnvelope>;
  delete?: InputMaybe<Array<AuthConnectionWhereUniqueInput>>;
  deleteMany?: InputMaybe<Array<AuthConnectionScalarWhereInput>>;
  disconnect?: InputMaybe<Array<AuthConnectionWhereUniqueInput>>;
  set?: InputMaybe<Array<AuthConnectionWhereUniqueInput>>;
  update?: InputMaybe<Array<AuthConnectionUpdateWithWhereUniqueWithoutUserInput>>;
  updateMany?: InputMaybe<Array<AuthConnectionUpdateManyWithWhereWithoutUserInput>>;
  upsert?: InputMaybe<Array<AuthConnectionUpsertWithWhereUniqueWithoutUserInput>>;
};

export type AuthConnectionUpdateOneRequiredWithoutLotTransactionBatchNestedInput = {
  connect?: InputMaybe<AuthConnectionWhereUniqueInput>;
  connectOrCreate?: InputMaybe<AuthConnectionCreateOrConnectWithoutLotTransactionBatchInput>;
  create?: InputMaybe<AuthConnectionCreateWithoutLotTransactionBatchInput>;
  update?: InputMaybe<AuthConnectionUpdateToOneWithWhereWithoutLotTransactionBatchInput>;
  upsert?: InputMaybe<AuthConnectionUpsertWithoutLotTransactionBatchInput>;
};

export type AuthConnectionUpdateOneWithoutAccountsNestedInput = {
  connect?: InputMaybe<AuthConnectionWhereUniqueInput>;
  connectOrCreate?: InputMaybe<AuthConnectionCreateOrConnectWithoutAccountsInput>;
  create?: InputMaybe<AuthConnectionCreateWithoutAccountsInput>;
  delete?: InputMaybe<AuthConnectionWhereInput>;
  disconnect?: InputMaybe<AuthConnectionWhereInput>;
  update?: InputMaybe<AuthConnectionUpdateToOneWithWhereWithoutAccountsInput>;
  upsert?: InputMaybe<AuthConnectionUpsertWithoutAccountsInput>;
};

export type AuthConnectionUpdateToOneWithWhereWithoutAccountsInput = {
  data: AuthConnectionUpdateWithoutAccountsInput;
  where?: InputMaybe<AuthConnectionWhereInput>;
};

export type AuthConnectionUpdateToOneWithWhereWithoutLotTransactionBatchInput = {
  data: AuthConnectionUpdateWithoutLotTransactionBatchInput;
  where?: InputMaybe<AuthConnectionWhereInput>;
};

export type AuthConnectionUpdateWithWhereUniqueWithoutPortfolioInput = {
  data: AuthConnectionUpdateWithoutPortfolioInput;
  where: AuthConnectionWhereUniqueInput;
};

export type AuthConnectionUpdateWithWhereUniqueWithoutUserInput = {
  data: AuthConnectionUpdateWithoutUserInput;
  where: AuthConnectionWhereUniqueInput;
};

export type AuthConnectionUpdateWithoutAccountsInput = {
  authedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  externalId?: InputMaybe<StringFieldUpdateOperationsInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  isSyncing?: InputMaybe<BoolFieldUpdateOperationsInput>;
  lastTransactionSyncedAtPlaid?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  lotTransactionBatch?: InputMaybe<LotTransactionBatchUpdateManyWithoutAuthConnectionNestedInput>;
  portfolio?: InputMaybe<PortfolioUpdateOneRequiredWithoutAuthConnectionsNestedInput>;
  source?: InputMaybe<EnumAuthSourceFieldUpdateOperationsInput>;
  syncedAt?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  type?: InputMaybe<EnumAuthTypeFieldUpdateOperationsInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  user?: InputMaybe<UserUpdateOneRequiredWithoutAuthConnectionsNestedInput>;
  verificationUrl?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
};

export type AuthConnectionUpdateWithoutLotTransactionBatchInput = {
  accounts?: InputMaybe<AccountUpdateManyWithoutAuthConnectionNestedInput>;
  authedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  externalId?: InputMaybe<StringFieldUpdateOperationsInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  isSyncing?: InputMaybe<BoolFieldUpdateOperationsInput>;
  lastTransactionSyncedAtPlaid?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  portfolio?: InputMaybe<PortfolioUpdateOneRequiredWithoutAuthConnectionsNestedInput>;
  source?: InputMaybe<EnumAuthSourceFieldUpdateOperationsInput>;
  syncedAt?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  type?: InputMaybe<EnumAuthTypeFieldUpdateOperationsInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  user?: InputMaybe<UserUpdateOneRequiredWithoutAuthConnectionsNestedInput>;
  verificationUrl?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
};

export type AuthConnectionUpdateWithoutPortfolioInput = {
  accounts?: InputMaybe<AccountUpdateManyWithoutAuthConnectionNestedInput>;
  authedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  externalId?: InputMaybe<StringFieldUpdateOperationsInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  isSyncing?: InputMaybe<BoolFieldUpdateOperationsInput>;
  lastTransactionSyncedAtPlaid?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  lotTransactionBatch?: InputMaybe<LotTransactionBatchUpdateManyWithoutAuthConnectionNestedInput>;
  source?: InputMaybe<EnumAuthSourceFieldUpdateOperationsInput>;
  syncedAt?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  type?: InputMaybe<EnumAuthTypeFieldUpdateOperationsInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  user?: InputMaybe<UserUpdateOneRequiredWithoutAuthConnectionsNestedInput>;
  verificationUrl?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
};

export type AuthConnectionUpdateWithoutUserInput = {
  accounts?: InputMaybe<AccountUpdateManyWithoutAuthConnectionNestedInput>;
  authedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  externalId?: InputMaybe<StringFieldUpdateOperationsInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  isSyncing?: InputMaybe<BoolFieldUpdateOperationsInput>;
  lastTransactionSyncedAtPlaid?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  lotTransactionBatch?: InputMaybe<LotTransactionBatchUpdateManyWithoutAuthConnectionNestedInput>;
  portfolio?: InputMaybe<PortfolioUpdateOneRequiredWithoutAuthConnectionsNestedInput>;
  source?: InputMaybe<EnumAuthSourceFieldUpdateOperationsInput>;
  syncedAt?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  type?: InputMaybe<EnumAuthTypeFieldUpdateOperationsInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  verificationUrl?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
};

export type AuthConnectionUpsertWithWhereUniqueWithoutPortfolioInput = {
  create: AuthConnectionCreateWithoutPortfolioInput;
  update: AuthConnectionUpdateWithoutPortfolioInput;
  where: AuthConnectionWhereUniqueInput;
};

export type AuthConnectionUpsertWithWhereUniqueWithoutUserInput = {
  create: AuthConnectionCreateWithoutUserInput;
  update: AuthConnectionUpdateWithoutUserInput;
  where: AuthConnectionWhereUniqueInput;
};

export type AuthConnectionUpsertWithoutAccountsInput = {
  create: AuthConnectionCreateWithoutAccountsInput;
  update: AuthConnectionUpdateWithoutAccountsInput;
  where?: InputMaybe<AuthConnectionWhereInput>;
};

export type AuthConnectionUpsertWithoutLotTransactionBatchInput = {
  create: AuthConnectionCreateWithoutLotTransactionBatchInput;
  update: AuthConnectionUpdateWithoutLotTransactionBatchInput;
  where?: InputMaybe<AuthConnectionWhereInput>;
};

export type AuthConnectionWhereInput = {
  AND?: InputMaybe<Array<AuthConnectionWhereInput>>;
  NOT?: InputMaybe<Array<AuthConnectionWhereInput>>;
  OR?: InputMaybe<Array<AuthConnectionWhereInput>>;
  accounts?: InputMaybe<AccountListRelationFilter>;
  authedAt?: InputMaybe<DateTimeFilter>;
  createdAt?: InputMaybe<DateTimeFilter>;
  externalId?: InputMaybe<StringFilter>;
  id?: InputMaybe<UuidFilter>;
  isSyncing?: InputMaybe<BoolFilter>;
  lastTransactionSyncedAtPlaid?: InputMaybe<DateTimeNullableFilter>;
  lotTransactionBatch?: InputMaybe<LotTransactionBatchListRelationFilter>;
  portfolio?: InputMaybe<PortfolioScalarRelationFilter>;
  portfolioId?: InputMaybe<UuidFilter>;
  source?: InputMaybe<EnumAuthSourceFilter>;
  syncedAt?: InputMaybe<DateTimeNullableFilter>;
  type?: InputMaybe<EnumAuthTypeFilter>;
  updatedAt?: InputMaybe<DateTimeFilter>;
  user?: InputMaybe<UserScalarRelationFilter>;
  userId?: InputMaybe<StringFilter>;
  verificationUrl?: InputMaybe<StringNullableFilter>;
};

export type AuthConnectionWhereUniqueInput = {
  AND?: InputMaybe<Array<AuthConnectionWhereInput>>;
  NOT?: InputMaybe<Array<AuthConnectionWhereInput>>;
  OR?: InputMaybe<Array<AuthConnectionWhereInput>>;
  accounts?: InputMaybe<AccountListRelationFilter>;
  authedAt?: InputMaybe<DateTimeFilter>;
  createdAt?: InputMaybe<DateTimeFilter>;
  externalId?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  isSyncing?: InputMaybe<BoolFilter>;
  lastTransactionSyncedAtPlaid?: InputMaybe<DateTimeNullableFilter>;
  lotTransactionBatch?: InputMaybe<LotTransactionBatchListRelationFilter>;
  portfolio?: InputMaybe<PortfolioScalarRelationFilter>;
  portfolioId?: InputMaybe<UuidFilter>;
  source?: InputMaybe<EnumAuthSourceFilter>;
  source_userId_portfolioId_externalId?: InputMaybe<AuthConnectionSourceUserIdPortfolioIdExternalIdCompoundUniqueInput>;
  syncedAt?: InputMaybe<DateTimeNullableFilter>;
  type?: InputMaybe<EnumAuthTypeFilter>;
  updatedAt?: InputMaybe<DateTimeFilter>;
  user?: InputMaybe<UserScalarRelationFilter>;
  userId?: InputMaybe<StringFilter>;
  verificationUrl?: InputMaybe<StringNullableFilter>;
};

/** The source of the auth connection */
export enum AuthSource {
  /** Access to the core api (https://api.etrade.com) */
  EtradeAccess = 'ETRADE_ACCESS',
  /** Access to the auth api to eventuially get access to the core api (https://api.etrade.com/oauth/request_token) */
  EtradeRequest = 'ETRADE_REQUEST',
  /** LOCAL Testing / System Generated */
  Local = 'LOCAL',
  Plaid = 'PLAID'
}

export enum AuthType {
  Oauth_1 = 'OAUTH_1',
  PlaidLink = 'PLAID_LINK'
}

export type BoolFieldUpdateOperationsInput = {
  set?: InputMaybe<Scalars['Boolean']['input']>;
};

export type BoolFilter = {
  equals?: InputMaybe<Scalars['Boolean']['input']>;
  not?: InputMaybe<NestedBoolFilter>;
};

export type DateTimeFieldUpdateOperationsInput = {
  set?: InputMaybe<Scalars['DateTime']['input']>;
};

export type DateTimeFilter = {
  equals?: InputMaybe<Scalars['DateTime']['input']>;
  gt?: InputMaybe<Scalars['DateTime']['input']>;
  gte?: InputMaybe<Scalars['DateTime']['input']>;
  in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
  lt?: InputMaybe<Scalars['DateTime']['input']>;
  lte?: InputMaybe<Scalars['DateTime']['input']>;
  not?: InputMaybe<NestedDateTimeFilter>;
  notIn?: InputMaybe<Array<Scalars['DateTime']['input']>>;
};

export type DateTimeNullableFilter = {
  equals?: InputMaybe<Scalars['DateTime']['input']>;
  gt?: InputMaybe<Scalars['DateTime']['input']>;
  gte?: InputMaybe<Scalars['DateTime']['input']>;
  in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
  lt?: InputMaybe<Scalars['DateTime']['input']>;
  lte?: InputMaybe<Scalars['DateTime']['input']>;
  not?: InputMaybe<NestedDateTimeNullableFilter>;
  notIn?: InputMaybe<Array<Scalars['DateTime']['input']>>;
};

export type DecimalFieldUpdateOperationsInput = {
  decrement?: InputMaybe<Scalars['Decimal']['input']>;
  divide?: InputMaybe<Scalars['Decimal']['input']>;
  increment?: InputMaybe<Scalars['Decimal']['input']>;
  multiply?: InputMaybe<Scalars['Decimal']['input']>;
  set?: InputMaybe<Scalars['Decimal']['input']>;
};

export type DecimalFilter = {
  equals?: InputMaybe<Scalars['Decimal']['input']>;
  gt?: InputMaybe<Scalars['Decimal']['input']>;
  gte?: InputMaybe<Scalars['Decimal']['input']>;
  in?: InputMaybe<Array<Scalars['Decimal']['input']>>;
  lt?: InputMaybe<Scalars['Decimal']['input']>;
  lte?: InputMaybe<Scalars['Decimal']['input']>;
  not?: InputMaybe<NestedDecimalFilter>;
  notIn?: InputMaybe<Array<Scalars['Decimal']['input']>>;
};

export type DecimalNullableFilter = {
  equals?: InputMaybe<Scalars['Decimal']['input']>;
  gt?: InputMaybe<Scalars['Decimal']['input']>;
  gte?: InputMaybe<Scalars['Decimal']['input']>;
  in?: InputMaybe<Array<Scalars['Decimal']['input']>>;
  lt?: InputMaybe<Scalars['Decimal']['input']>;
  lte?: InputMaybe<Scalars['Decimal']['input']>;
  not?: InputMaybe<NestedDecimalNullableFilter>;
  notIn?: InputMaybe<Array<Scalars['Decimal']['input']>>;
};

export type DirectedHarvestLot = {
  counterTransaction?: InputMaybe<Scalars['Boolean']['input']>;
  lotId: Scalars['String']['input'];
  quantity: Scalars['Float']['input'];
};

export type EnumAccountInstitutionNullableFilter = {
  equals?: InputMaybe<AccountInstitution>;
  in?: InputMaybe<Array<AccountInstitution>>;
  not?: InputMaybe<NestedEnumAccountInstitutionNullableFilter>;
  notIn?: InputMaybe<Array<AccountInstitution>>;
};

export type EnumAccountModeNullableFilter = {
  equals?: InputMaybe<AccountMode>;
  in?: InputMaybe<Array<AccountMode>>;
  not?: InputMaybe<NestedEnumAccountModeNullableFilter>;
  notIn?: InputMaybe<Array<AccountMode>>;
};

export type EnumAccountProviderFieldUpdateOperationsInput = {
  set?: InputMaybe<AccountProvider>;
};

export type EnumAccountProviderFilter = {
  equals?: InputMaybe<AccountProvider>;
  in?: InputMaybe<Array<AccountProvider>>;
  not?: InputMaybe<NestedEnumAccountProviderFilter>;
  notIn?: InputMaybe<Array<AccountProvider>>;
};

export type EnumAccountStatusFieldUpdateOperationsInput = {
  set?: InputMaybe<AccountStatus>;
};

export type EnumAccountStatusFilter = {
  equals?: InputMaybe<AccountStatus>;
  in?: InputMaybe<Array<AccountStatus>>;
  not?: InputMaybe<NestedEnumAccountStatusFilter>;
  notIn?: InputMaybe<Array<AccountStatus>>;
};

export type EnumAssetClassFieldUpdateOperationsInput = {
  set?: InputMaybe<AssetClass>;
};

export type EnumAssetClassFilter = {
  equals?: InputMaybe<AssetClass>;
  in?: InputMaybe<Array<AssetClass>>;
  not?: InputMaybe<NestedEnumAssetClassFilter>;
  notIn?: InputMaybe<Array<AssetClass>>;
};

export type EnumAssetLocaleFieldUpdateOperationsInput = {
  set?: InputMaybe<AssetLocale>;
};

export type EnumAssetLocaleFilter = {
  equals?: InputMaybe<AssetLocale>;
  in?: InputMaybe<Array<AssetLocale>>;
  not?: InputMaybe<NestedEnumAssetLocaleFilter>;
  notIn?: InputMaybe<Array<AssetLocale>>;
};

export type EnumAuthSourceFieldUpdateOperationsInput = {
  set?: InputMaybe<AuthSource>;
};

export type EnumAuthSourceFilter = {
  equals?: InputMaybe<AuthSource>;
  in?: InputMaybe<Array<AuthSource>>;
  not?: InputMaybe<NestedEnumAuthSourceFilter>;
  notIn?: InputMaybe<Array<AuthSource>>;
};

export type EnumAuthSourceNullableFilter = {
  equals?: InputMaybe<AuthSource>;
  in?: InputMaybe<Array<AuthSource>>;
  not?: InputMaybe<NestedEnumAuthSourceNullableFilter>;
  notIn?: InputMaybe<Array<AuthSource>>;
};

export type EnumAuthTypeFieldUpdateOperationsInput = {
  set?: InputMaybe<AuthType>;
};

export type EnumAuthTypeFilter = {
  equals?: InputMaybe<AuthType>;
  in?: InputMaybe<Array<AuthType>>;
  not?: InputMaybe<NestedEnumAuthTypeFilter>;
  notIn?: InputMaybe<Array<AuthType>>;
};

export type EnumFileTypeFieldUpdateOperationsInput = {
  set?: InputMaybe<FileType>;
};

export type EnumFileTypeFilter = {
  equals?: InputMaybe<FileType>;
  in?: InputMaybe<Array<FileType>>;
  not?: InputMaybe<NestedEnumFileTypeFilter>;
  notIn?: InputMaybe<Array<FileType>>;
};

export type EnumGraphFieldUpdateOperationsInput = {
  set?: InputMaybe<Graph>;
};

export type EnumGraphFilter = {
  equals?: InputMaybe<Graph>;
  in?: InputMaybe<Array<Graph>>;
  not?: InputMaybe<NestedEnumGraphFilter>;
  notIn?: InputMaybe<Array<Graph>>;
};

export type EnumHarvestNotificationFrequencyFieldUpdateOperationsInput = {
  set?: InputMaybe<HarvestNotificationFrequency>;
};

export type EnumHarvestNotificationFrequencyFilter = {
  equals?: InputMaybe<HarvestNotificationFrequency>;
  in?: InputMaybe<Array<HarvestNotificationFrequency>>;
  not?: InputMaybe<NestedEnumHarvestNotificationFrequencyFilter>;
  notIn?: InputMaybe<Array<HarvestNotificationFrequency>>;
};

export type EnumHarvestStepFieldUpdateOperationsInput = {
  set?: InputMaybe<HarvestStep>;
};

export type EnumHarvestStepFilter = {
  equals?: InputMaybe<HarvestStep>;
  in?: InputMaybe<Array<HarvestStep>>;
  not?: InputMaybe<NestedEnumHarvestStepFilter>;
  notIn?: InputMaybe<Array<HarvestStep>>;
};

export type EnumHarvestTypeFieldUpdateOperationsInput = {
  set?: InputMaybe<HarvestType>;
};

export type EnumHarvestTypeFilter = {
  equals?: InputMaybe<HarvestType>;
  in?: InputMaybe<Array<HarvestType>>;
  not?: InputMaybe<NestedEnumHarvestTypeFilter>;
  notIn?: InputMaybe<Array<HarvestType>>;
};

export type EnumLogTypeFieldUpdateOperationsInput = {
  set?: InputMaybe<LogType>;
};

export type EnumLogTypeFilter = {
  equals?: InputMaybe<LogType>;
  in?: InputMaybe<Array<LogType>>;
  not?: InputMaybe<NestedEnumLogTypeFilter>;
  notIn?: InputMaybe<Array<LogType>>;
};

export type EnumOperationTypeFieldUpdateOperationsInput = {
  set?: InputMaybe<OperationType>;
};

export type EnumOperationTypeFilter = {
  equals?: InputMaybe<OperationType>;
  in?: InputMaybe<Array<OperationType>>;
  not?: InputMaybe<NestedEnumOperationTypeFilter>;
  notIn?: InputMaybe<Array<OperationType>>;
};

export type EnumOptionLevelNullableFilter = {
  equals?: InputMaybe<OptionLevel>;
  in?: InputMaybe<Array<OptionLevel>>;
  not?: InputMaybe<NestedEnumOptionLevelNullableFilter>;
  notIn?: InputMaybe<Array<OptionLevel>>;
};

export type EnumOrderTypeFieldUpdateOperationsInput = {
  set?: InputMaybe<OrderType>;
};

export type EnumOrderTypeFilter = {
  equals?: InputMaybe<OrderType>;
  in?: InputMaybe<Array<OrderType>>;
  not?: InputMaybe<NestedEnumOrderTypeFilter>;
  notIn?: InputMaybe<Array<OrderType>>;
};

export type EnumPortfolioRoleFieldUpdateOperationsInput = {
  set?: InputMaybe<PortfolioRole>;
};

export type EnumPortfolioRoleFilter = {
  equals?: InputMaybe<PortfolioRole>;
  in?: InputMaybe<Array<PortfolioRole>>;
  not?: InputMaybe<NestedEnumPortfolioRoleFilter>;
  notIn?: InputMaybe<Array<PortfolioRole>>;
};

export type EnumVectorWindowFieldUpdateOperationsInput = {
  set?: InputMaybe<VectorWindow>;
};

export type EnumVectorWindowFilter = {
  equals?: InputMaybe<VectorWindow>;
  in?: InputMaybe<Array<VectorWindow>>;
  not?: InputMaybe<NestedEnumVectorWindowFilter>;
  notIn?: InputMaybe<Array<VectorWindow>>;
};

export type File = {
  __typename?: 'File';
  _count: FileCount;
  account: Account;
  accountId: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  displayName: Scalars['String']['output'];
  fileType: FileType;
  gcpFilename: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lots?: Maybe<Array<Lot>>;
  portfolio: Portfolio;
  portfolioId: Scalars['String']['output'];
  type: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  uploadedBy: Scalars['String']['output'];
};

export type FileCount = {
  __typename?: 'FileCount';
  lots: Scalars['Int']['output'];
};

export type FileCountAggregate = {
  __typename?: 'FileCountAggregate';
  _all: Scalars['Int']['output'];
  accountId: Scalars['Int']['output'];
  createdAt: Scalars['Int']['output'];
  displayName: Scalars['Int']['output'];
  fileType: Scalars['Int']['output'];
  gcpFilename: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  portfolioId: Scalars['Int']['output'];
  type: Scalars['Int']['output'];
  updatedAt: Scalars['Int']['output'];
  uploadedBy: Scalars['Int']['output'];
};

export type FileCreateManyAccountInput = {
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  displayName: Scalars['String']['input'];
  fileType?: InputMaybe<FileType>;
  gcpFilename: Scalars['String']['input'];
  id?: InputMaybe<Scalars['String']['input']>;
  portfolioId: Scalars['String']['input'];
  type: Scalars['String']['input'];
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
  uploadedBy: Scalars['String']['input'];
};

export type FileCreateManyAccountInputEnvelope = {
  data: Array<FileCreateManyAccountInput>;
  skipDuplicates?: InputMaybe<Scalars['Boolean']['input']>;
};

export type FileCreateManyInput = {
  accountId: Scalars['String']['input'];
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  displayName: Scalars['String']['input'];
  fileType?: InputMaybe<FileType>;
  gcpFilename: Scalars['String']['input'];
  id?: InputMaybe<Scalars['String']['input']>;
  portfolioId: Scalars['String']['input'];
  type: Scalars['String']['input'];
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
  uploadedBy: Scalars['String']['input'];
};

export type FileCreateManyPortfolioInput = {
  accountId: Scalars['String']['input'];
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  displayName: Scalars['String']['input'];
  fileType?: InputMaybe<FileType>;
  gcpFilename: Scalars['String']['input'];
  id?: InputMaybe<Scalars['String']['input']>;
  type: Scalars['String']['input'];
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
  uploadedBy: Scalars['String']['input'];
};

export type FileCreateManyPortfolioInputEnvelope = {
  data: Array<FileCreateManyPortfolioInput>;
  skipDuplicates?: InputMaybe<Scalars['Boolean']['input']>;
};

export type FileCreateNestedManyWithoutAccountInput = {
  connect?: InputMaybe<Array<FileWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<FileCreateOrConnectWithoutAccountInput>>;
  create?: InputMaybe<Array<FileCreateWithoutAccountInput>>;
  createMany?: InputMaybe<FileCreateManyAccountInputEnvelope>;
};

export type FileCreateNestedManyWithoutPortfolioInput = {
  connect?: InputMaybe<Array<FileWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<FileCreateOrConnectWithoutPortfolioInput>>;
  create?: InputMaybe<Array<FileCreateWithoutPortfolioInput>>;
  createMany?: InputMaybe<FileCreateManyPortfolioInputEnvelope>;
};

export type FileCreateNestedOneWithoutLotsInput = {
  connect?: InputMaybe<FileWhereUniqueInput>;
  connectOrCreate?: InputMaybe<FileCreateOrConnectWithoutLotsInput>;
  create?: InputMaybe<FileCreateWithoutLotsInput>;
};

export type FileCreateOrConnectWithoutAccountInput = {
  create: FileCreateWithoutAccountInput;
  where: FileWhereUniqueInput;
};

export type FileCreateOrConnectWithoutLotsInput = {
  create: FileCreateWithoutLotsInput;
  where: FileWhereUniqueInput;
};

export type FileCreateOrConnectWithoutPortfolioInput = {
  create: FileCreateWithoutPortfolioInput;
  where: FileWhereUniqueInput;
};

export type FileCreateWithoutAccountInput = {
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  displayName: Scalars['String']['input'];
  fileType?: InputMaybe<FileType>;
  gcpFilename: Scalars['String']['input'];
  id?: InputMaybe<Scalars['String']['input']>;
  lots?: InputMaybe<LotCreateNestedManyWithoutFileInput>;
  portfolio: PortfolioCreateNestedOneWithoutFilesInput;
  type: Scalars['String']['input'];
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
  uploadedBy: Scalars['String']['input'];
};

export type FileCreateWithoutLotsInput = {
  account: AccountCreateNestedOneWithoutFilesInput;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  displayName: Scalars['String']['input'];
  fileType?: InputMaybe<FileType>;
  gcpFilename: Scalars['String']['input'];
  id?: InputMaybe<Scalars['String']['input']>;
  portfolio: PortfolioCreateNestedOneWithoutFilesInput;
  type: Scalars['String']['input'];
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
  uploadedBy: Scalars['String']['input'];
};

export type FileCreateWithoutPortfolioInput = {
  account: AccountCreateNestedOneWithoutFilesInput;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  displayName: Scalars['String']['input'];
  fileType?: InputMaybe<FileType>;
  gcpFilename: Scalars['String']['input'];
  id?: InputMaybe<Scalars['String']['input']>;
  lots?: InputMaybe<LotCreateNestedManyWithoutFileInput>;
  type: Scalars['String']['input'];
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
  uploadedBy: Scalars['String']['input'];
};

export type FileListRelationFilter = {
  every?: InputMaybe<FileWhereInput>;
  none?: InputMaybe<FileWhereInput>;
  some?: InputMaybe<FileWhereInput>;
};

export type FileMaxAggregate = {
  __typename?: 'FileMaxAggregate';
  accountId?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  displayName?: Maybe<Scalars['String']['output']>;
  fileType?: Maybe<FileType>;
  gcpFilename?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  portfolioId?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  uploadedBy?: Maybe<Scalars['String']['output']>;
};

export type FileMinAggregate = {
  __typename?: 'FileMinAggregate';
  accountId?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  displayName?: Maybe<Scalars['String']['output']>;
  fileType?: Maybe<FileType>;
  gcpFilename?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  portfolioId?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  uploadedBy?: Maybe<Scalars['String']['output']>;
};

export type FileNullableScalarRelationFilter = {
  is?: InputMaybe<FileWhereInput>;
  isNot?: InputMaybe<FileWhereInput>;
};

export type FileScalarWhereInput = {
  AND?: InputMaybe<Array<FileScalarWhereInput>>;
  NOT?: InputMaybe<Array<FileScalarWhereInput>>;
  OR?: InputMaybe<Array<FileScalarWhereInput>>;
  accountId?: InputMaybe<UuidFilter>;
  createdAt?: InputMaybe<DateTimeFilter>;
  displayName?: InputMaybe<StringFilter>;
  fileType?: InputMaybe<EnumFileTypeFilter>;
  gcpFilename?: InputMaybe<StringFilter>;
  id?: InputMaybe<UuidFilter>;
  portfolioId?: InputMaybe<UuidFilter>;
  type?: InputMaybe<StringFilter>;
  updatedAt?: InputMaybe<DateTimeFilter>;
  uploadedBy?: InputMaybe<StringFilter>;
};

export enum FileType {
  EtradeLots = 'ETRADE_LOTS'
}

export type FileUpdateManyMutationInput = {
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  displayName?: InputMaybe<StringFieldUpdateOperationsInput>;
  fileType?: InputMaybe<EnumFileTypeFieldUpdateOperationsInput>;
  gcpFilename?: InputMaybe<StringFieldUpdateOperationsInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  type?: InputMaybe<StringFieldUpdateOperationsInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  uploadedBy?: InputMaybe<StringFieldUpdateOperationsInput>;
};

export type FileUpdateManyWithWhereWithoutAccountInput = {
  data: FileUpdateManyMutationInput;
  where: FileScalarWhereInput;
};

export type FileUpdateManyWithWhereWithoutPortfolioInput = {
  data: FileUpdateManyMutationInput;
  where: FileScalarWhereInput;
};

export type FileUpdateManyWithoutAccountNestedInput = {
  connect?: InputMaybe<Array<FileWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<FileCreateOrConnectWithoutAccountInput>>;
  create?: InputMaybe<Array<FileCreateWithoutAccountInput>>;
  createMany?: InputMaybe<FileCreateManyAccountInputEnvelope>;
  delete?: InputMaybe<Array<FileWhereUniqueInput>>;
  deleteMany?: InputMaybe<Array<FileScalarWhereInput>>;
  disconnect?: InputMaybe<Array<FileWhereUniqueInput>>;
  set?: InputMaybe<Array<FileWhereUniqueInput>>;
  update?: InputMaybe<Array<FileUpdateWithWhereUniqueWithoutAccountInput>>;
  updateMany?: InputMaybe<Array<FileUpdateManyWithWhereWithoutAccountInput>>;
  upsert?: InputMaybe<Array<FileUpsertWithWhereUniqueWithoutAccountInput>>;
};

export type FileUpdateManyWithoutPortfolioNestedInput = {
  connect?: InputMaybe<Array<FileWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<FileCreateOrConnectWithoutPortfolioInput>>;
  create?: InputMaybe<Array<FileCreateWithoutPortfolioInput>>;
  createMany?: InputMaybe<FileCreateManyPortfolioInputEnvelope>;
  delete?: InputMaybe<Array<FileWhereUniqueInput>>;
  deleteMany?: InputMaybe<Array<FileScalarWhereInput>>;
  disconnect?: InputMaybe<Array<FileWhereUniqueInput>>;
  set?: InputMaybe<Array<FileWhereUniqueInput>>;
  update?: InputMaybe<Array<FileUpdateWithWhereUniqueWithoutPortfolioInput>>;
  updateMany?: InputMaybe<Array<FileUpdateManyWithWhereWithoutPortfolioInput>>;
  upsert?: InputMaybe<Array<FileUpsertWithWhereUniqueWithoutPortfolioInput>>;
};

export type FileUpdateOneWithoutLotsNestedInput = {
  connect?: InputMaybe<FileWhereUniqueInput>;
  connectOrCreate?: InputMaybe<FileCreateOrConnectWithoutLotsInput>;
  create?: InputMaybe<FileCreateWithoutLotsInput>;
  delete?: InputMaybe<FileWhereInput>;
  disconnect?: InputMaybe<FileWhereInput>;
  update?: InputMaybe<FileUpdateToOneWithWhereWithoutLotsInput>;
  upsert?: InputMaybe<FileUpsertWithoutLotsInput>;
};

export type FileUpdateToOneWithWhereWithoutLotsInput = {
  data: FileUpdateWithoutLotsInput;
  where?: InputMaybe<FileWhereInput>;
};

export type FileUpdateWithWhereUniqueWithoutAccountInput = {
  data: FileUpdateWithoutAccountInput;
  where: FileWhereUniqueInput;
};

export type FileUpdateWithWhereUniqueWithoutPortfolioInput = {
  data: FileUpdateWithoutPortfolioInput;
  where: FileWhereUniqueInput;
};

export type FileUpdateWithoutAccountInput = {
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  displayName?: InputMaybe<StringFieldUpdateOperationsInput>;
  fileType?: InputMaybe<EnumFileTypeFieldUpdateOperationsInput>;
  gcpFilename?: InputMaybe<StringFieldUpdateOperationsInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  lots?: InputMaybe<LotUpdateManyWithoutFileNestedInput>;
  portfolio?: InputMaybe<PortfolioUpdateOneRequiredWithoutFilesNestedInput>;
  type?: InputMaybe<StringFieldUpdateOperationsInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  uploadedBy?: InputMaybe<StringFieldUpdateOperationsInput>;
};

export type FileUpdateWithoutLotsInput = {
  account?: InputMaybe<AccountUpdateOneRequiredWithoutFilesNestedInput>;
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  displayName?: InputMaybe<StringFieldUpdateOperationsInput>;
  fileType?: InputMaybe<EnumFileTypeFieldUpdateOperationsInput>;
  gcpFilename?: InputMaybe<StringFieldUpdateOperationsInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  portfolio?: InputMaybe<PortfolioUpdateOneRequiredWithoutFilesNestedInput>;
  type?: InputMaybe<StringFieldUpdateOperationsInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  uploadedBy?: InputMaybe<StringFieldUpdateOperationsInput>;
};

export type FileUpdateWithoutPortfolioInput = {
  account?: InputMaybe<AccountUpdateOneRequiredWithoutFilesNestedInput>;
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  displayName?: InputMaybe<StringFieldUpdateOperationsInput>;
  fileType?: InputMaybe<EnumFileTypeFieldUpdateOperationsInput>;
  gcpFilename?: InputMaybe<StringFieldUpdateOperationsInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  lots?: InputMaybe<LotUpdateManyWithoutFileNestedInput>;
  type?: InputMaybe<StringFieldUpdateOperationsInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  uploadedBy?: InputMaybe<StringFieldUpdateOperationsInput>;
};

export type FileUpsertWithWhereUniqueWithoutAccountInput = {
  create: FileCreateWithoutAccountInput;
  update: FileUpdateWithoutAccountInput;
  where: FileWhereUniqueInput;
};

export type FileUpsertWithWhereUniqueWithoutPortfolioInput = {
  create: FileCreateWithoutPortfolioInput;
  update: FileUpdateWithoutPortfolioInput;
  where: FileWhereUniqueInput;
};

export type FileUpsertWithoutLotsInput = {
  create: FileCreateWithoutLotsInput;
  update: FileUpdateWithoutLotsInput;
  where?: InputMaybe<FileWhereInput>;
};

export type FileWhereInput = {
  AND?: InputMaybe<Array<FileWhereInput>>;
  NOT?: InputMaybe<Array<FileWhereInput>>;
  OR?: InputMaybe<Array<FileWhereInput>>;
  account?: InputMaybe<AccountScalarRelationFilter>;
  accountId?: InputMaybe<UuidFilter>;
  createdAt?: InputMaybe<DateTimeFilter>;
  displayName?: InputMaybe<StringFilter>;
  fileType?: InputMaybe<EnumFileTypeFilter>;
  gcpFilename?: InputMaybe<StringFilter>;
  id?: InputMaybe<UuidFilter>;
  lots?: InputMaybe<LotListRelationFilter>;
  portfolio?: InputMaybe<PortfolioScalarRelationFilter>;
  portfolioId?: InputMaybe<UuidFilter>;
  type?: InputMaybe<StringFilter>;
  updatedAt?: InputMaybe<DateTimeFilter>;
  uploadedBy?: InputMaybe<StringFilter>;
};

export type FileWhereUniqueInput = {
  AND?: InputMaybe<Array<FileWhereInput>>;
  NOT?: InputMaybe<Array<FileWhereInput>>;
  OR?: InputMaybe<Array<FileWhereInput>>;
  account?: InputMaybe<AccountScalarRelationFilter>;
  accountId?: InputMaybe<UuidFilter>;
  createdAt?: InputMaybe<DateTimeFilter>;
  displayName?: InputMaybe<StringFilter>;
  fileType?: InputMaybe<EnumFileTypeFilter>;
  gcpFilename?: InputMaybe<StringFilter>;
  id?: InputMaybe<Scalars['String']['input']>;
  lots?: InputMaybe<LotListRelationFilter>;
  portfolio?: InputMaybe<PortfolioScalarRelationFilter>;
  portfolioId?: InputMaybe<UuidFilter>;
  type?: InputMaybe<StringFilter>;
  updatedAt?: InputMaybe<DateTimeFilter>;
  uploadedBy?: InputMaybe<StringFilter>;
};

export type FiniteHarvestResult = {
  __typename?: 'FiniteHarvestResult';
  harvestType: HarvestType;
  lotsCurrent?: Maybe<Array<LotCurrent>>;
  summary: PortfolioSummary;
  /** Total number of harvest lots if user is paying */
  totalHarvestLots: Scalars['Float']['output'];
  unrealizedHarvestMatchResults?: Maybe<Array<UnrealizedHarvestMatchResult>>;
};

export type GcpUploadFile = {
  displayName: Scalars['String']['input'];
  fileName: Scalars['String']['input'];
  type: Scalars['String']['input'];
};

export enum Graph {
  /** Return percent over the length of days in hudredths of a percent */
  ReturnPctLine = 'RETURN_PCT_LINE'
}

export type Harvest = {
  __typename?: 'Harvest';
  _count: HarvestCount;
  /** Date to revert is possible after wash period - its the date of the revert if revert is true and notify is noify is true */
  afterWashRevertDate: Scalars['DateTime']['output'];
  amount: Scalars['Decimal']['output'];
  createdAt: Scalars['DateTime']['output'];
  createdBy: User;
  createdById: Scalars['String']['output'];
  date: Scalars['DateTime']['output'];
  harvestTransactionItems?: Maybe<Array<HarvestTransactionItem>>;
  harvestTransactions?: Maybe<Array<HarvestTransaction>>;
  id: Scalars['ID']['output'];
  label: Scalars['String']['output'];
  /** should notify be performed */
  notify: Scalars['Boolean']['output'];
  portfolio: Portfolio;
  portfolioId: Scalars['String']['output'];
  /** Date to lock in the recommendation  */
  recommendationExpiresDate: Scalars['DateTime']['output'];
  step: HarvestStep;
  type: HarvestType;
  updatedAt: Scalars['DateTime']['output'];
};

export type HarvestAvgAggregate = {
  __typename?: 'HarvestAvgAggregate';
  amount?: Maybe<Scalars['Decimal']['output']>;
};

export type HarvestCount = {
  __typename?: 'HarvestCount';
  harvestTransactionItems: Scalars['Int']['output'];
  harvestTransactions: Scalars['Int']['output'];
};

export type HarvestCountAggregate = {
  __typename?: 'HarvestCountAggregate';
  _all: Scalars['Int']['output'];
  afterWashRevertDate: Scalars['Int']['output'];
  amount: Scalars['Int']['output'];
  createdAt: Scalars['Int']['output'];
  createdById: Scalars['Int']['output'];
  date: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  label: Scalars['Int']['output'];
  notify: Scalars['Int']['output'];
  portfolioId: Scalars['Int']['output'];
  recommendationExpiresDate: Scalars['Int']['output'];
  step: Scalars['Int']['output'];
  type: Scalars['Int']['output'];
  updatedAt: Scalars['Int']['output'];
};

export type HarvestCreateManyCreatedByInput = {
  afterWashRevertDate?: InputMaybe<Scalars['DateTime']['input']>;
  amount: Scalars['Decimal']['input'];
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  date?: InputMaybe<Scalars['DateTime']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  label: Scalars['String']['input'];
  notify?: InputMaybe<Scalars['Boolean']['input']>;
  portfolioId: Scalars['String']['input'];
  recommendationExpiresDate?: InputMaybe<Scalars['DateTime']['input']>;
  step?: InputMaybe<HarvestStep>;
  type: HarvestType;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type HarvestCreateManyCreatedByInputEnvelope = {
  data: Array<HarvestCreateManyCreatedByInput>;
  skipDuplicates?: InputMaybe<Scalars['Boolean']['input']>;
};

export type HarvestCreateManyPortfolioInput = {
  afterWashRevertDate?: InputMaybe<Scalars['DateTime']['input']>;
  amount: Scalars['Decimal']['input'];
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  createdById: Scalars['String']['input'];
  date?: InputMaybe<Scalars['DateTime']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  label: Scalars['String']['input'];
  notify?: InputMaybe<Scalars['Boolean']['input']>;
  recommendationExpiresDate?: InputMaybe<Scalars['DateTime']['input']>;
  step?: InputMaybe<HarvestStep>;
  type: HarvestType;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type HarvestCreateManyPortfolioInputEnvelope = {
  data: Array<HarvestCreateManyPortfolioInput>;
  skipDuplicates?: InputMaybe<Scalars['Boolean']['input']>;
};

export type HarvestCreateNestedManyWithoutCreatedByInput = {
  connect?: InputMaybe<Array<HarvestWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<HarvestCreateOrConnectWithoutCreatedByInput>>;
  create?: InputMaybe<Array<HarvestCreateWithoutCreatedByInput>>;
  createMany?: InputMaybe<HarvestCreateManyCreatedByInputEnvelope>;
};

export type HarvestCreateNestedManyWithoutPortfolioInput = {
  connect?: InputMaybe<Array<HarvestWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<HarvestCreateOrConnectWithoutPortfolioInput>>;
  create?: InputMaybe<Array<HarvestCreateWithoutPortfolioInput>>;
  createMany?: InputMaybe<HarvestCreateManyPortfolioInputEnvelope>;
};

export type HarvestCreateNestedOneWithoutHarvestTransactionItemsInput = {
  connect?: InputMaybe<HarvestWhereUniqueInput>;
  connectOrCreate?: InputMaybe<HarvestCreateOrConnectWithoutHarvestTransactionItemsInput>;
  create?: InputMaybe<HarvestCreateWithoutHarvestTransactionItemsInput>;
};

export type HarvestCreateNestedOneWithoutHarvestTransactionsInput = {
  connect?: InputMaybe<HarvestWhereUniqueInput>;
  connectOrCreate?: InputMaybe<HarvestCreateOrConnectWithoutHarvestTransactionsInput>;
  create?: InputMaybe<HarvestCreateWithoutHarvestTransactionsInput>;
};

export type HarvestCreateOrConnectWithoutCreatedByInput = {
  create: HarvestCreateWithoutCreatedByInput;
  where: HarvestWhereUniqueInput;
};

export type HarvestCreateOrConnectWithoutHarvestTransactionItemsInput = {
  create: HarvestCreateWithoutHarvestTransactionItemsInput;
  where: HarvestWhereUniqueInput;
};

export type HarvestCreateOrConnectWithoutHarvestTransactionsInput = {
  create: HarvestCreateWithoutHarvestTransactionsInput;
  where: HarvestWhereUniqueInput;
};

export type HarvestCreateOrConnectWithoutPortfolioInput = {
  create: HarvestCreateWithoutPortfolioInput;
  where: HarvestWhereUniqueInput;
};

export type HarvestCreateWithoutCreatedByInput = {
  afterWashRevertDate?: InputMaybe<Scalars['DateTime']['input']>;
  amount: Scalars['Decimal']['input'];
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  date?: InputMaybe<Scalars['DateTime']['input']>;
  harvestTransactionItems?: InputMaybe<HarvestTransactionItemCreateNestedManyWithoutHarvestInput>;
  harvestTransactions?: InputMaybe<HarvestTransactionCreateNestedManyWithoutHarvestInput>;
  id?: InputMaybe<Scalars['String']['input']>;
  label: Scalars['String']['input'];
  notify?: InputMaybe<Scalars['Boolean']['input']>;
  portfolio: PortfolioCreateNestedOneWithoutHarvestsInput;
  recommendationExpiresDate?: InputMaybe<Scalars['DateTime']['input']>;
  step?: InputMaybe<HarvestStep>;
  type: HarvestType;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type HarvestCreateWithoutHarvestTransactionItemsInput = {
  afterWashRevertDate?: InputMaybe<Scalars['DateTime']['input']>;
  amount: Scalars['Decimal']['input'];
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  createdBy: UserCreateNestedOneWithoutHarvestInput;
  date?: InputMaybe<Scalars['DateTime']['input']>;
  harvestTransactions?: InputMaybe<HarvestTransactionCreateNestedManyWithoutHarvestInput>;
  id?: InputMaybe<Scalars['String']['input']>;
  label: Scalars['String']['input'];
  notify?: InputMaybe<Scalars['Boolean']['input']>;
  portfolio: PortfolioCreateNestedOneWithoutHarvestsInput;
  recommendationExpiresDate?: InputMaybe<Scalars['DateTime']['input']>;
  step?: InputMaybe<HarvestStep>;
  type: HarvestType;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type HarvestCreateWithoutHarvestTransactionsInput = {
  afterWashRevertDate?: InputMaybe<Scalars['DateTime']['input']>;
  amount: Scalars['Decimal']['input'];
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  createdBy: UserCreateNestedOneWithoutHarvestInput;
  date?: InputMaybe<Scalars['DateTime']['input']>;
  harvestTransactionItems?: InputMaybe<HarvestTransactionItemCreateNestedManyWithoutHarvestInput>;
  id?: InputMaybe<Scalars['String']['input']>;
  label: Scalars['String']['input'];
  notify?: InputMaybe<Scalars['Boolean']['input']>;
  portfolio: PortfolioCreateNestedOneWithoutHarvestsInput;
  recommendationExpiresDate?: InputMaybe<Scalars['DateTime']['input']>;
  step?: InputMaybe<HarvestStep>;
  type: HarvestType;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type HarvestCreateWithoutPortfolioInput = {
  afterWashRevertDate?: InputMaybe<Scalars['DateTime']['input']>;
  amount: Scalars['Decimal']['input'];
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  createdBy: UserCreateNestedOneWithoutHarvestInput;
  date?: InputMaybe<Scalars['DateTime']['input']>;
  harvestTransactionItems?: InputMaybe<HarvestTransactionItemCreateNestedManyWithoutHarvestInput>;
  harvestTransactions?: InputMaybe<HarvestTransactionCreateNestedManyWithoutHarvestInput>;
  id?: InputMaybe<Scalars['String']['input']>;
  label: Scalars['String']['input'];
  notify?: InputMaybe<Scalars['Boolean']['input']>;
  recommendationExpiresDate?: InputMaybe<Scalars['DateTime']['input']>;
  step?: InputMaybe<HarvestStep>;
  type: HarvestType;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type HarvestEvalFilters = {
  excludeAssetSymbols?: InputMaybe<Array<Scalars['String']['input']>>;
  minPAndL?: InputMaybe<Scalars['Float']['input']>;
  purchaseDateAfter?: InputMaybe<Scalars['DateTime']['input']>;
  purchaseDateBefore?: InputMaybe<Scalars['DateTime']['input']>;
};

export type HarvestEvalResult = {
  __typename?: 'HarvestEvalResult';
  harvestType: HarvestType;
  lotsCurrent?: Maybe<Array<LotCurrent>>;
  matchedItems?: Maybe<Array<HarvestMatchItem>>;
  summary: PortfolioSummary;
  /** Total number of harvest lots if user is paying */
  totalHarvestLots: Scalars['Float']['output'];
  /** List of unique asset symbols in portfolio */
  uniqueAssetSymbols: Array<Scalars['String']['output']>;
};

export type HarvestListRelationFilter = {
  every?: InputMaybe<HarvestWhereInput>;
  none?: InputMaybe<HarvestWhereInput>;
  some?: InputMaybe<HarvestWhereInput>;
};

/** GQL object for the lot fields returned in harvest API's */
export type HarvestLotCurrent = {
  __typename?: 'HarvestLotCurrent';
  accountId: Scalars['String']['output'];
  acquiredDate: Scalars['DateTime']['output'];
  /** How many shares from this lot are available to be harvested. */
  availableQty: Scalars['String']['output'];
  costBasis: Scalars['String']['output'];
  /** How many shares from this lot are in "in flight" harvests. */
  currentHarvestQty: Scalars['String']['output'];
  dollarPerSharePnL: Scalars['String']['output'];
  gainTotal: Scalars['String']['output'];
  gainTotalPct: Scalars['String']['output'];
  /** The P&L of the harvest for this lot (depending on the number of shares we will harvest). */
  harvestPAndL: Scalars['Float']['output'];
  /** How many shares from this lot are we going to harvest. */
  harvestQuantity: Scalars['String']['output'];
  id: Scalars['String']['output'];
  lastPrice: Scalars['String']['output'];
  price: Scalars['String']['output'];
  /** How many shares from this lot are available to be harvested. Importantly this is the actual amount we know from plaid exists at the current time. */
  remainingQty: Scalars['String']['output'];
  symbol: Scalars['String']['output'];
  taxGain: TaxGain;
  value: Scalars['String']['output'];
};

export type HarvestLotOrder = {
  __typename?: 'HarvestLotOrder';
  accountId: Scalars['String']['output'];
  acquiredDate: Scalars['DateTime']['output'];
  assetSymbol: Scalars['String']['output'];
  costBasis: Scalars['String']['output'];
  dollarPerSharePnL: Scalars['String']['output'];
  gainTotal: Scalars['String']['output'];
  id: Scalars['String']['output'];
  lastPrice: Scalars['String']['output'];
  /** Lot Id */
  lotId: Scalars['String']['output'];
  orderType: OrderType;
  pricePaid: Scalars['String']['output'];
  quantity: Scalars['String']['output'];
  taxGain: TaxGain;
  valueTotal: Scalars['String']['output'];
};

export type HarvestMatchItem = {
  __typename?: 'HarvestMatchItem';
  id: Scalars['String']['output'];
  pairs: Array<HarvestMatchPair>;
};

export type HarvestMatchPair = {
  __typename?: 'HarvestMatchPair';
  matchedHarvestPAndL: Scalars['Float']['output'];
  matchedLots: Array<HarvestLotCurrent>;
  sourceHarvestPAndL: Scalars['Float']['output'];
  sourceLots: Array<HarvestLotCurrent>;
};

export type HarvestMaxAggregate = {
  __typename?: 'HarvestMaxAggregate';
  afterWashRevertDate?: Maybe<Scalars['DateTime']['output']>;
  amount?: Maybe<Scalars['Decimal']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  createdById?: Maybe<Scalars['String']['output']>;
  date?: Maybe<Scalars['DateTime']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  label?: Maybe<Scalars['String']['output']>;
  notify?: Maybe<Scalars['Boolean']['output']>;
  portfolioId?: Maybe<Scalars['String']['output']>;
  recommendationExpiresDate?: Maybe<Scalars['DateTime']['output']>;
  step?: Maybe<HarvestStep>;
  type?: Maybe<HarvestType>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type HarvestMinAggregate = {
  __typename?: 'HarvestMinAggregate';
  afterWashRevertDate?: Maybe<Scalars['DateTime']['output']>;
  amount?: Maybe<Scalars['Decimal']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  createdById?: Maybe<Scalars['String']['output']>;
  date?: Maybe<Scalars['DateTime']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  label?: Maybe<Scalars['String']['output']>;
  notify?: Maybe<Scalars['Boolean']['output']>;
  portfolioId?: Maybe<Scalars['String']['output']>;
  recommendationExpiresDate?: Maybe<Scalars['DateTime']['output']>;
  step?: Maybe<HarvestStep>;
  type?: Maybe<HarvestType>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export enum HarvestNotificationFrequency {
  Daily = 'DAILY',
  Monthly = 'MONTHLY',
  Never = 'NEVER',
  Quarterly = 'QUARTERLY',
  Weekly = 'WEEKLY'
}

export type HarvestPotential = {
  __typename?: 'HarvestPotential';
  /** The realized gain or loss that can be harvested */
  realized: Scalars['Float']['output'];
  /** The total amount to be harvested (should always be positive) */
  total: Scalars['Float']['output'];
  /** The unrealized gain or loss that can be harvested */
  unrealized: Scalars['Float']['output'];
};

export type HarvestResult = {
  __typename?: 'HarvestResult';
  allOrders: Array<HarvestLotOrder>;
  portfolioSummary: PortfolioSummary;
  realizedOrders: Array<HarvestLotOrder>;
  unrealizedOrders: Array<HarvestLotOrder>;
};

export type HarvestScalarRelationFilter = {
  is?: InputMaybe<HarvestWhereInput>;
  isNot?: InputMaybe<HarvestWhereInput>;
};

export type HarvestScalarWhereInput = {
  AND?: InputMaybe<Array<HarvestScalarWhereInput>>;
  NOT?: InputMaybe<Array<HarvestScalarWhereInput>>;
  OR?: InputMaybe<Array<HarvestScalarWhereInput>>;
  afterWashRevertDate?: InputMaybe<DateTimeFilter>;
  amount?: InputMaybe<DecimalFilter>;
  createdAt?: InputMaybe<DateTimeFilter>;
  createdById?: InputMaybe<StringFilter>;
  date?: InputMaybe<DateTimeFilter>;
  id?: InputMaybe<UuidFilter>;
  label?: InputMaybe<StringFilter>;
  notify?: InputMaybe<BoolFilter>;
  portfolioId?: InputMaybe<UuidFilter>;
  recommendationExpiresDate?: InputMaybe<DateTimeFilter>;
  step?: InputMaybe<EnumHarvestStepFilter>;
  type?: InputMaybe<EnumHarvestTypeFilter>;
  updatedAt?: InputMaybe<DateTimeFilter>;
};

export enum HarvestStep {
  Complete = 'COMPLETE',
  Configure = 'CONFIGURE',
  Review = 'REVIEW'
}

export type HarvestSumAggregate = {
  __typename?: 'HarvestSumAggregate';
  amount?: Maybe<Scalars['Decimal']['output']>;
};

/** Represent the logical unit of a harvest transaction whose entry point is a sale of a security. It can possibly have a replacement buy and then a revert after the wash sale window for the sale / sale + buy */
export type HarvestTransaction = {
  __typename?: 'HarvestTransaction';
  /** Is this transaction part of counter group of transactions for harvest (i.e. selling a gain to counter the loss that was selected) */
  counterTransaction: Scalars['Boolean']['output'];
  createdAt: Scalars['DateTime']['output'];
  harvest: Harvest;
  harvestId: Scalars['String']['output'];
  harvestTransactionItem: HarvestTransactionItem;
  harvestTransactionItemId: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  portfolio: Portfolio;
  portfolioId: Scalars['String']['output'];
  replacementTransactionItem?: Maybe<HarvestTransactionItem>;
  replacementTransactionItemId?: Maybe<Scalars['String']['output']>;
  /** should revert transactions be performed */
  revert: Scalars['Boolean']['output'];
  revertHarvestTransactionItem?: Maybe<HarvestTransactionItem>;
  revertHarvestTransactionItemId?: Maybe<Scalars['String']['output']>;
  revertReplacementTransactionItem?: Maybe<HarvestTransactionItem>;
  revertReplacementTransactionItemId?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};

export type HarvestTransactionCountAggregate = {
  __typename?: 'HarvestTransactionCountAggregate';
  _all: Scalars['Int']['output'];
  counterTransaction: Scalars['Int']['output'];
  createdAt: Scalars['Int']['output'];
  harvestId: Scalars['Int']['output'];
  harvestTransactionItemId: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  portfolioId: Scalars['Int']['output'];
  replacementTransactionItemId: Scalars['Int']['output'];
  revert: Scalars['Int']['output'];
  revertHarvestTransactionItemId: Scalars['Int']['output'];
  revertReplacementTransactionItemId: Scalars['Int']['output'];
  updatedAt: Scalars['Int']['output'];
};

export type HarvestTransactionCreateManyHarvestInput = {
  counterTransaction?: InputMaybe<Scalars['Boolean']['input']>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  harvestTransactionItemId: Scalars['String']['input'];
  id?: InputMaybe<Scalars['String']['input']>;
  portfolioId: Scalars['String']['input'];
  replacementTransactionItemId?: InputMaybe<Scalars['String']['input']>;
  revert?: InputMaybe<Scalars['Boolean']['input']>;
  revertHarvestTransactionItemId?: InputMaybe<Scalars['String']['input']>;
  revertReplacementTransactionItemId?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type HarvestTransactionCreateManyHarvestInputEnvelope = {
  data: Array<HarvestTransactionCreateManyHarvestInput>;
  skipDuplicates?: InputMaybe<Scalars['Boolean']['input']>;
};

export type HarvestTransactionCreateManyPortfolioInput = {
  counterTransaction?: InputMaybe<Scalars['Boolean']['input']>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  harvestId: Scalars['String']['input'];
  harvestTransactionItemId: Scalars['String']['input'];
  id?: InputMaybe<Scalars['String']['input']>;
  replacementTransactionItemId?: InputMaybe<Scalars['String']['input']>;
  revert?: InputMaybe<Scalars['Boolean']['input']>;
  revertHarvestTransactionItemId?: InputMaybe<Scalars['String']['input']>;
  revertReplacementTransactionItemId?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type HarvestTransactionCreateManyPortfolioInputEnvelope = {
  data: Array<HarvestTransactionCreateManyPortfolioInput>;
  skipDuplicates?: InputMaybe<Scalars['Boolean']['input']>;
};

export type HarvestTransactionCreateNestedManyWithoutHarvestInput = {
  connect?: InputMaybe<Array<HarvestTransactionWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<HarvestTransactionCreateOrConnectWithoutHarvestInput>>;
  create?: InputMaybe<Array<HarvestTransactionCreateWithoutHarvestInput>>;
  createMany?: InputMaybe<HarvestTransactionCreateManyHarvestInputEnvelope>;
};

export type HarvestTransactionCreateNestedManyWithoutPortfolioInput = {
  connect?: InputMaybe<Array<HarvestTransactionWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<HarvestTransactionCreateOrConnectWithoutPortfolioInput>>;
  create?: InputMaybe<Array<HarvestTransactionCreateWithoutPortfolioInput>>;
  createMany?: InputMaybe<HarvestTransactionCreateManyPortfolioInputEnvelope>;
};

export type HarvestTransactionCreateNestedOneWithoutHarvestTransactionItemInput = {
  connect?: InputMaybe<HarvestTransactionWhereUniqueInput>;
  connectOrCreate?: InputMaybe<HarvestTransactionCreateOrConnectWithoutHarvestTransactionItemInput>;
  create?: InputMaybe<HarvestTransactionCreateWithoutHarvestTransactionItemInput>;
};

export type HarvestTransactionCreateNestedOneWithoutReplacementTransactionItemInput = {
  connect?: InputMaybe<HarvestTransactionWhereUniqueInput>;
  connectOrCreate?: InputMaybe<HarvestTransactionCreateOrConnectWithoutReplacementTransactionItemInput>;
  create?: InputMaybe<HarvestTransactionCreateWithoutReplacementTransactionItemInput>;
};

export type HarvestTransactionCreateNestedOneWithoutRevertHarvestTransactionItemInput = {
  connect?: InputMaybe<HarvestTransactionWhereUniqueInput>;
  connectOrCreate?: InputMaybe<HarvestTransactionCreateOrConnectWithoutRevertHarvestTransactionItemInput>;
  create?: InputMaybe<HarvestTransactionCreateWithoutRevertHarvestTransactionItemInput>;
};

export type HarvestTransactionCreateNestedOneWithoutRevertReplacementTransactionItemInput = {
  connect?: InputMaybe<HarvestTransactionWhereUniqueInput>;
  connectOrCreate?: InputMaybe<HarvestTransactionCreateOrConnectWithoutRevertReplacementTransactionItemInput>;
  create?: InputMaybe<HarvestTransactionCreateWithoutRevertReplacementTransactionItemInput>;
};

export type HarvestTransactionCreateOrConnectWithoutHarvestInput = {
  create: HarvestTransactionCreateWithoutHarvestInput;
  where: HarvestTransactionWhereUniqueInput;
};

export type HarvestTransactionCreateOrConnectWithoutHarvestTransactionItemInput = {
  create: HarvestTransactionCreateWithoutHarvestTransactionItemInput;
  where: HarvestTransactionWhereUniqueInput;
};

export type HarvestTransactionCreateOrConnectWithoutPortfolioInput = {
  create: HarvestTransactionCreateWithoutPortfolioInput;
  where: HarvestTransactionWhereUniqueInput;
};

export type HarvestTransactionCreateOrConnectWithoutReplacementTransactionItemInput = {
  create: HarvestTransactionCreateWithoutReplacementTransactionItemInput;
  where: HarvestTransactionWhereUniqueInput;
};

export type HarvestTransactionCreateOrConnectWithoutRevertHarvestTransactionItemInput = {
  create: HarvestTransactionCreateWithoutRevertHarvestTransactionItemInput;
  where: HarvestTransactionWhereUniqueInput;
};

export type HarvestTransactionCreateOrConnectWithoutRevertReplacementTransactionItemInput = {
  create: HarvestTransactionCreateWithoutRevertReplacementTransactionItemInput;
  where: HarvestTransactionWhereUniqueInput;
};

export type HarvestTransactionCreateWithoutHarvestInput = {
  counterTransaction?: InputMaybe<Scalars['Boolean']['input']>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  harvestTransactionItem: HarvestTransactionItemCreateNestedOneWithoutHarvestTransactionInput;
  id?: InputMaybe<Scalars['String']['input']>;
  portfolio: PortfolioCreateNestedOneWithoutHarvestTransactionInput;
  replacementTransactionItem?: InputMaybe<HarvestTransactionItemCreateNestedOneWithoutReplacementTransactionInput>;
  revert?: InputMaybe<Scalars['Boolean']['input']>;
  revertHarvestTransactionItem?: InputMaybe<HarvestTransactionItemCreateNestedOneWithoutRevertHarvestTransactionInput>;
  revertReplacementTransactionItem?: InputMaybe<HarvestTransactionItemCreateNestedOneWithoutRevertReplacementTransactionInput>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type HarvestTransactionCreateWithoutHarvestTransactionItemInput = {
  counterTransaction?: InputMaybe<Scalars['Boolean']['input']>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  harvest: HarvestCreateNestedOneWithoutHarvestTransactionsInput;
  id?: InputMaybe<Scalars['String']['input']>;
  portfolio: PortfolioCreateNestedOneWithoutHarvestTransactionInput;
  replacementTransactionItem?: InputMaybe<HarvestTransactionItemCreateNestedOneWithoutReplacementTransactionInput>;
  revert?: InputMaybe<Scalars['Boolean']['input']>;
  revertHarvestTransactionItem?: InputMaybe<HarvestTransactionItemCreateNestedOneWithoutRevertHarvestTransactionInput>;
  revertReplacementTransactionItem?: InputMaybe<HarvestTransactionItemCreateNestedOneWithoutRevertReplacementTransactionInput>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type HarvestTransactionCreateWithoutPortfolioInput = {
  counterTransaction?: InputMaybe<Scalars['Boolean']['input']>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  harvest: HarvestCreateNestedOneWithoutHarvestTransactionsInput;
  harvestTransactionItem: HarvestTransactionItemCreateNestedOneWithoutHarvestTransactionInput;
  id?: InputMaybe<Scalars['String']['input']>;
  replacementTransactionItem?: InputMaybe<HarvestTransactionItemCreateNestedOneWithoutReplacementTransactionInput>;
  revert?: InputMaybe<Scalars['Boolean']['input']>;
  revertHarvestTransactionItem?: InputMaybe<HarvestTransactionItemCreateNestedOneWithoutRevertHarvestTransactionInput>;
  revertReplacementTransactionItem?: InputMaybe<HarvestTransactionItemCreateNestedOneWithoutRevertReplacementTransactionInput>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type HarvestTransactionCreateWithoutReplacementTransactionItemInput = {
  counterTransaction?: InputMaybe<Scalars['Boolean']['input']>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  harvest: HarvestCreateNestedOneWithoutHarvestTransactionsInput;
  harvestTransactionItem: HarvestTransactionItemCreateNestedOneWithoutHarvestTransactionInput;
  id?: InputMaybe<Scalars['String']['input']>;
  portfolio: PortfolioCreateNestedOneWithoutHarvestTransactionInput;
  revert?: InputMaybe<Scalars['Boolean']['input']>;
  revertHarvestTransactionItem?: InputMaybe<HarvestTransactionItemCreateNestedOneWithoutRevertHarvestTransactionInput>;
  revertReplacementTransactionItem?: InputMaybe<HarvestTransactionItemCreateNestedOneWithoutRevertReplacementTransactionInput>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type HarvestTransactionCreateWithoutRevertHarvestTransactionItemInput = {
  counterTransaction?: InputMaybe<Scalars['Boolean']['input']>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  harvest: HarvestCreateNestedOneWithoutHarvestTransactionsInput;
  harvestTransactionItem: HarvestTransactionItemCreateNestedOneWithoutHarvestTransactionInput;
  id?: InputMaybe<Scalars['String']['input']>;
  portfolio: PortfolioCreateNestedOneWithoutHarvestTransactionInput;
  replacementTransactionItem?: InputMaybe<HarvestTransactionItemCreateNestedOneWithoutReplacementTransactionInput>;
  revert?: InputMaybe<Scalars['Boolean']['input']>;
  revertReplacementTransactionItem?: InputMaybe<HarvestTransactionItemCreateNestedOneWithoutRevertReplacementTransactionInput>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type HarvestTransactionCreateWithoutRevertReplacementTransactionItemInput = {
  counterTransaction?: InputMaybe<Scalars['Boolean']['input']>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  harvest: HarvestCreateNestedOneWithoutHarvestTransactionsInput;
  harvestTransactionItem: HarvestTransactionItemCreateNestedOneWithoutHarvestTransactionInput;
  id?: InputMaybe<Scalars['String']['input']>;
  portfolio: PortfolioCreateNestedOneWithoutHarvestTransactionInput;
  replacementTransactionItem?: InputMaybe<HarvestTransactionItemCreateNestedOneWithoutReplacementTransactionInput>;
  revert?: InputMaybe<Scalars['Boolean']['input']>;
  revertHarvestTransactionItem?: InputMaybe<HarvestTransactionItemCreateNestedOneWithoutRevertHarvestTransactionInput>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type HarvestTransactionItem = {
  __typename?: 'HarvestTransactionItem';
  asset: Asset;
  assetSymbol: Scalars['String']['output'];
  completedDate?: Maybe<Scalars['DateTime']['output']>;
  createdAt: Scalars['DateTime']['output'];
  /** The date of the harvest transtion item is assumed to be executed */
  date: Scalars['DateTime']['output'];
  harvest: Harvest;
  harvestId: Scalars['String']['output'];
  harvestTransaction?: Maybe<HarvestTransaction>;
  id: Scalars['ID']['output'];
  lotAcquiredDate: Scalars['DateTime']['output'];
  lotId?: Maybe<Scalars['String']['output']>;
  lotPriceAtHarvest: Scalars['Decimal']['output'];
  lotPricePaid: Scalars['Decimal']['output'];
  lotSold?: Maybe<Lot>;
  orderType: OrderType;
  portfolio: Portfolio;
  portfolioId: Scalars['String']['output'];
  price: Scalars['Decimal']['output'];
  quantity: Scalars['Decimal']['output'];
  replacementTransaction?: Maybe<HarvestTransaction>;
  revertHarvestTransaction?: Maybe<HarvestTransaction>;
  revertReplacementTransaction?: Maybe<HarvestTransaction>;
  updatedAt: Scalars['DateTime']['output'];
};

export type HarvestTransactionItemAvgAggregate = {
  __typename?: 'HarvestTransactionItemAvgAggregate';
  lotPriceAtHarvest?: Maybe<Scalars['Decimal']['output']>;
  lotPricePaid?: Maybe<Scalars['Decimal']['output']>;
  price?: Maybe<Scalars['Decimal']['output']>;
  quantity?: Maybe<Scalars['Decimal']['output']>;
};

export type HarvestTransactionItemCountAggregate = {
  __typename?: 'HarvestTransactionItemCountAggregate';
  _all: Scalars['Int']['output'];
  assetSymbol: Scalars['Int']['output'];
  completedDate: Scalars['Int']['output'];
  createdAt: Scalars['Int']['output'];
  date: Scalars['Int']['output'];
  harvestId: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  lotAcquiredDate: Scalars['Int']['output'];
  lotId: Scalars['Int']['output'];
  lotPriceAtHarvest: Scalars['Int']['output'];
  lotPricePaid: Scalars['Int']['output'];
  orderType: Scalars['Int']['output'];
  portfolioId: Scalars['Int']['output'];
  price: Scalars['Int']['output'];
  quantity: Scalars['Int']['output'];
  updatedAt: Scalars['Int']['output'];
};

export type HarvestTransactionItemCreateManyAssetInput = {
  completedDate?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  date?: InputMaybe<Scalars['DateTime']['input']>;
  harvestId: Scalars['String']['input'];
  id?: InputMaybe<Scalars['String']['input']>;
  lotAcquiredDate: Scalars['DateTime']['input'];
  lotId?: InputMaybe<Scalars['String']['input']>;
  lotPriceAtHarvest: Scalars['Decimal']['input'];
  lotPricePaid: Scalars['Decimal']['input'];
  orderType: OrderType;
  portfolioId: Scalars['String']['input'];
  price: Scalars['Decimal']['input'];
  quantity: Scalars['Decimal']['input'];
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type HarvestTransactionItemCreateManyAssetInputEnvelope = {
  data: Array<HarvestTransactionItemCreateManyAssetInput>;
  skipDuplicates?: InputMaybe<Scalars['Boolean']['input']>;
};

export type HarvestTransactionItemCreateManyHarvestInput = {
  assetSymbol: Scalars['String']['input'];
  completedDate?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  date?: InputMaybe<Scalars['DateTime']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  lotAcquiredDate: Scalars['DateTime']['input'];
  lotId?: InputMaybe<Scalars['String']['input']>;
  lotPriceAtHarvest: Scalars['Decimal']['input'];
  lotPricePaid: Scalars['Decimal']['input'];
  orderType: OrderType;
  portfolioId: Scalars['String']['input'];
  price: Scalars['Decimal']['input'];
  quantity: Scalars['Decimal']['input'];
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type HarvestTransactionItemCreateManyHarvestInputEnvelope = {
  data: Array<HarvestTransactionItemCreateManyHarvestInput>;
  skipDuplicates?: InputMaybe<Scalars['Boolean']['input']>;
};

export type HarvestTransactionItemCreateManyLotSoldInput = {
  assetSymbol: Scalars['String']['input'];
  completedDate?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  date?: InputMaybe<Scalars['DateTime']['input']>;
  harvestId: Scalars['String']['input'];
  id?: InputMaybe<Scalars['String']['input']>;
  lotAcquiredDate: Scalars['DateTime']['input'];
  lotPriceAtHarvest: Scalars['Decimal']['input'];
  lotPricePaid: Scalars['Decimal']['input'];
  orderType: OrderType;
  portfolioId: Scalars['String']['input'];
  price: Scalars['Decimal']['input'];
  quantity: Scalars['Decimal']['input'];
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type HarvestTransactionItemCreateManyLotSoldInputEnvelope = {
  data: Array<HarvestTransactionItemCreateManyLotSoldInput>;
  skipDuplicates?: InputMaybe<Scalars['Boolean']['input']>;
};

export type HarvestTransactionItemCreateManyPortfolioInput = {
  assetSymbol: Scalars['String']['input'];
  completedDate?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  date?: InputMaybe<Scalars['DateTime']['input']>;
  harvestId: Scalars['String']['input'];
  id?: InputMaybe<Scalars['String']['input']>;
  lotAcquiredDate: Scalars['DateTime']['input'];
  lotId?: InputMaybe<Scalars['String']['input']>;
  lotPriceAtHarvest: Scalars['Decimal']['input'];
  lotPricePaid: Scalars['Decimal']['input'];
  orderType: OrderType;
  price: Scalars['Decimal']['input'];
  quantity: Scalars['Decimal']['input'];
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type HarvestTransactionItemCreateManyPortfolioInputEnvelope = {
  data: Array<HarvestTransactionItemCreateManyPortfolioInput>;
  skipDuplicates?: InputMaybe<Scalars['Boolean']['input']>;
};

export type HarvestTransactionItemCreateNestedManyWithoutAssetInput = {
  connect?: InputMaybe<Array<HarvestTransactionItemWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<HarvestTransactionItemCreateOrConnectWithoutAssetInput>>;
  create?: InputMaybe<Array<HarvestTransactionItemCreateWithoutAssetInput>>;
  createMany?: InputMaybe<HarvestTransactionItemCreateManyAssetInputEnvelope>;
};

export type HarvestTransactionItemCreateNestedManyWithoutHarvestInput = {
  connect?: InputMaybe<Array<HarvestTransactionItemWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<HarvestTransactionItemCreateOrConnectWithoutHarvestInput>>;
  create?: InputMaybe<Array<HarvestTransactionItemCreateWithoutHarvestInput>>;
  createMany?: InputMaybe<HarvestTransactionItemCreateManyHarvestInputEnvelope>;
};

export type HarvestTransactionItemCreateNestedManyWithoutLotSoldInput = {
  connect?: InputMaybe<Array<HarvestTransactionItemWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<HarvestTransactionItemCreateOrConnectWithoutLotSoldInput>>;
  create?: InputMaybe<Array<HarvestTransactionItemCreateWithoutLotSoldInput>>;
  createMany?: InputMaybe<HarvestTransactionItemCreateManyLotSoldInputEnvelope>;
};

export type HarvestTransactionItemCreateNestedManyWithoutPortfolioInput = {
  connect?: InputMaybe<Array<HarvestTransactionItemWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<HarvestTransactionItemCreateOrConnectWithoutPortfolioInput>>;
  create?: InputMaybe<Array<HarvestTransactionItemCreateWithoutPortfolioInput>>;
  createMany?: InputMaybe<HarvestTransactionItemCreateManyPortfolioInputEnvelope>;
};

export type HarvestTransactionItemCreateNestedOneWithoutHarvestTransactionInput = {
  connect?: InputMaybe<HarvestTransactionItemWhereUniqueInput>;
  connectOrCreate?: InputMaybe<HarvestTransactionItemCreateOrConnectWithoutHarvestTransactionInput>;
  create?: InputMaybe<HarvestTransactionItemCreateWithoutHarvestTransactionInput>;
};

export type HarvestTransactionItemCreateNestedOneWithoutReplacementTransactionInput = {
  connect?: InputMaybe<HarvestTransactionItemWhereUniqueInput>;
  connectOrCreate?: InputMaybe<HarvestTransactionItemCreateOrConnectWithoutReplacementTransactionInput>;
  create?: InputMaybe<HarvestTransactionItemCreateWithoutReplacementTransactionInput>;
};

export type HarvestTransactionItemCreateNestedOneWithoutRevertHarvestTransactionInput = {
  connect?: InputMaybe<HarvestTransactionItemWhereUniqueInput>;
  connectOrCreate?: InputMaybe<HarvestTransactionItemCreateOrConnectWithoutRevertHarvestTransactionInput>;
  create?: InputMaybe<HarvestTransactionItemCreateWithoutRevertHarvestTransactionInput>;
};

export type HarvestTransactionItemCreateNestedOneWithoutRevertReplacementTransactionInput = {
  connect?: InputMaybe<HarvestTransactionItemWhereUniqueInput>;
  connectOrCreate?: InputMaybe<HarvestTransactionItemCreateOrConnectWithoutRevertReplacementTransactionInput>;
  create?: InputMaybe<HarvestTransactionItemCreateWithoutRevertReplacementTransactionInput>;
};

export type HarvestTransactionItemCreateOrConnectWithoutAssetInput = {
  create: HarvestTransactionItemCreateWithoutAssetInput;
  where: HarvestTransactionItemWhereUniqueInput;
};

export type HarvestTransactionItemCreateOrConnectWithoutHarvestInput = {
  create: HarvestTransactionItemCreateWithoutHarvestInput;
  where: HarvestTransactionItemWhereUniqueInput;
};

export type HarvestTransactionItemCreateOrConnectWithoutHarvestTransactionInput = {
  create: HarvestTransactionItemCreateWithoutHarvestTransactionInput;
  where: HarvestTransactionItemWhereUniqueInput;
};

export type HarvestTransactionItemCreateOrConnectWithoutLotSoldInput = {
  create: HarvestTransactionItemCreateWithoutLotSoldInput;
  where: HarvestTransactionItemWhereUniqueInput;
};

export type HarvestTransactionItemCreateOrConnectWithoutPortfolioInput = {
  create: HarvestTransactionItemCreateWithoutPortfolioInput;
  where: HarvestTransactionItemWhereUniqueInput;
};

export type HarvestTransactionItemCreateOrConnectWithoutReplacementTransactionInput = {
  create: HarvestTransactionItemCreateWithoutReplacementTransactionInput;
  where: HarvestTransactionItemWhereUniqueInput;
};

export type HarvestTransactionItemCreateOrConnectWithoutRevertHarvestTransactionInput = {
  create: HarvestTransactionItemCreateWithoutRevertHarvestTransactionInput;
  where: HarvestTransactionItemWhereUniqueInput;
};

export type HarvestTransactionItemCreateOrConnectWithoutRevertReplacementTransactionInput = {
  create: HarvestTransactionItemCreateWithoutRevertReplacementTransactionInput;
  where: HarvestTransactionItemWhereUniqueInput;
};

export type HarvestTransactionItemCreateWithoutAssetInput = {
  completedDate?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  date?: InputMaybe<Scalars['DateTime']['input']>;
  harvest: HarvestCreateNestedOneWithoutHarvestTransactionItemsInput;
  harvestTransaction?: InputMaybe<HarvestTransactionCreateNestedOneWithoutHarvestTransactionItemInput>;
  id?: InputMaybe<Scalars['String']['input']>;
  lotAcquiredDate: Scalars['DateTime']['input'];
  lotPriceAtHarvest: Scalars['Decimal']['input'];
  lotPricePaid: Scalars['Decimal']['input'];
  lotSold?: InputMaybe<LotCreateNestedOneWithoutHarvestTransactionItemsInput>;
  orderType: OrderType;
  portfolio: PortfolioCreateNestedOneWithoutHarvestTransactionItemInput;
  price: Scalars['Decimal']['input'];
  quantity: Scalars['Decimal']['input'];
  replacementTransaction?: InputMaybe<HarvestTransactionCreateNestedOneWithoutReplacementTransactionItemInput>;
  revertHarvestTransaction?: InputMaybe<HarvestTransactionCreateNestedOneWithoutRevertHarvestTransactionItemInput>;
  revertReplacementTransaction?: InputMaybe<HarvestTransactionCreateNestedOneWithoutRevertReplacementTransactionItemInput>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type HarvestTransactionItemCreateWithoutHarvestInput = {
  asset: AssetCreateNestedOneWithoutHarvestTransactionItemsInput;
  completedDate?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  date?: InputMaybe<Scalars['DateTime']['input']>;
  harvestTransaction?: InputMaybe<HarvestTransactionCreateNestedOneWithoutHarvestTransactionItemInput>;
  id?: InputMaybe<Scalars['String']['input']>;
  lotAcquiredDate: Scalars['DateTime']['input'];
  lotPriceAtHarvest: Scalars['Decimal']['input'];
  lotPricePaid: Scalars['Decimal']['input'];
  lotSold?: InputMaybe<LotCreateNestedOneWithoutHarvestTransactionItemsInput>;
  orderType: OrderType;
  portfolio: PortfolioCreateNestedOneWithoutHarvestTransactionItemInput;
  price: Scalars['Decimal']['input'];
  quantity: Scalars['Decimal']['input'];
  replacementTransaction?: InputMaybe<HarvestTransactionCreateNestedOneWithoutReplacementTransactionItemInput>;
  revertHarvestTransaction?: InputMaybe<HarvestTransactionCreateNestedOneWithoutRevertHarvestTransactionItemInput>;
  revertReplacementTransaction?: InputMaybe<HarvestTransactionCreateNestedOneWithoutRevertReplacementTransactionItemInput>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type HarvestTransactionItemCreateWithoutHarvestTransactionInput = {
  asset: AssetCreateNestedOneWithoutHarvestTransactionItemsInput;
  completedDate?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  date?: InputMaybe<Scalars['DateTime']['input']>;
  harvest: HarvestCreateNestedOneWithoutHarvestTransactionItemsInput;
  id?: InputMaybe<Scalars['String']['input']>;
  lotAcquiredDate: Scalars['DateTime']['input'];
  lotPriceAtHarvest: Scalars['Decimal']['input'];
  lotPricePaid: Scalars['Decimal']['input'];
  lotSold?: InputMaybe<LotCreateNestedOneWithoutHarvestTransactionItemsInput>;
  orderType: OrderType;
  portfolio: PortfolioCreateNestedOneWithoutHarvestTransactionItemInput;
  price: Scalars['Decimal']['input'];
  quantity: Scalars['Decimal']['input'];
  replacementTransaction?: InputMaybe<HarvestTransactionCreateNestedOneWithoutReplacementTransactionItemInput>;
  revertHarvestTransaction?: InputMaybe<HarvestTransactionCreateNestedOneWithoutRevertHarvestTransactionItemInput>;
  revertReplacementTransaction?: InputMaybe<HarvestTransactionCreateNestedOneWithoutRevertReplacementTransactionItemInput>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type HarvestTransactionItemCreateWithoutLotSoldInput = {
  asset: AssetCreateNestedOneWithoutHarvestTransactionItemsInput;
  completedDate?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  date?: InputMaybe<Scalars['DateTime']['input']>;
  harvest: HarvestCreateNestedOneWithoutHarvestTransactionItemsInput;
  harvestTransaction?: InputMaybe<HarvestTransactionCreateNestedOneWithoutHarvestTransactionItemInput>;
  id?: InputMaybe<Scalars['String']['input']>;
  lotAcquiredDate: Scalars['DateTime']['input'];
  lotPriceAtHarvest: Scalars['Decimal']['input'];
  lotPricePaid: Scalars['Decimal']['input'];
  orderType: OrderType;
  portfolio: PortfolioCreateNestedOneWithoutHarvestTransactionItemInput;
  price: Scalars['Decimal']['input'];
  quantity: Scalars['Decimal']['input'];
  replacementTransaction?: InputMaybe<HarvestTransactionCreateNestedOneWithoutReplacementTransactionItemInput>;
  revertHarvestTransaction?: InputMaybe<HarvestTransactionCreateNestedOneWithoutRevertHarvestTransactionItemInput>;
  revertReplacementTransaction?: InputMaybe<HarvestTransactionCreateNestedOneWithoutRevertReplacementTransactionItemInput>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type HarvestTransactionItemCreateWithoutPortfolioInput = {
  asset: AssetCreateNestedOneWithoutHarvestTransactionItemsInput;
  completedDate?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  date?: InputMaybe<Scalars['DateTime']['input']>;
  harvest: HarvestCreateNestedOneWithoutHarvestTransactionItemsInput;
  harvestTransaction?: InputMaybe<HarvestTransactionCreateNestedOneWithoutHarvestTransactionItemInput>;
  id?: InputMaybe<Scalars['String']['input']>;
  lotAcquiredDate: Scalars['DateTime']['input'];
  lotPriceAtHarvest: Scalars['Decimal']['input'];
  lotPricePaid: Scalars['Decimal']['input'];
  lotSold?: InputMaybe<LotCreateNestedOneWithoutHarvestTransactionItemsInput>;
  orderType: OrderType;
  price: Scalars['Decimal']['input'];
  quantity: Scalars['Decimal']['input'];
  replacementTransaction?: InputMaybe<HarvestTransactionCreateNestedOneWithoutReplacementTransactionItemInput>;
  revertHarvestTransaction?: InputMaybe<HarvestTransactionCreateNestedOneWithoutRevertHarvestTransactionItemInput>;
  revertReplacementTransaction?: InputMaybe<HarvestTransactionCreateNestedOneWithoutRevertReplacementTransactionItemInput>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type HarvestTransactionItemCreateWithoutReplacementTransactionInput = {
  asset: AssetCreateNestedOneWithoutHarvestTransactionItemsInput;
  completedDate?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  date?: InputMaybe<Scalars['DateTime']['input']>;
  harvest: HarvestCreateNestedOneWithoutHarvestTransactionItemsInput;
  harvestTransaction?: InputMaybe<HarvestTransactionCreateNestedOneWithoutHarvestTransactionItemInput>;
  id?: InputMaybe<Scalars['String']['input']>;
  lotAcquiredDate: Scalars['DateTime']['input'];
  lotPriceAtHarvest: Scalars['Decimal']['input'];
  lotPricePaid: Scalars['Decimal']['input'];
  lotSold?: InputMaybe<LotCreateNestedOneWithoutHarvestTransactionItemsInput>;
  orderType: OrderType;
  portfolio: PortfolioCreateNestedOneWithoutHarvestTransactionItemInput;
  price: Scalars['Decimal']['input'];
  quantity: Scalars['Decimal']['input'];
  revertHarvestTransaction?: InputMaybe<HarvestTransactionCreateNestedOneWithoutRevertHarvestTransactionItemInput>;
  revertReplacementTransaction?: InputMaybe<HarvestTransactionCreateNestedOneWithoutRevertReplacementTransactionItemInput>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type HarvestTransactionItemCreateWithoutRevertHarvestTransactionInput = {
  asset: AssetCreateNestedOneWithoutHarvestTransactionItemsInput;
  completedDate?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  date?: InputMaybe<Scalars['DateTime']['input']>;
  harvest: HarvestCreateNestedOneWithoutHarvestTransactionItemsInput;
  harvestTransaction?: InputMaybe<HarvestTransactionCreateNestedOneWithoutHarvestTransactionItemInput>;
  id?: InputMaybe<Scalars['String']['input']>;
  lotAcquiredDate: Scalars['DateTime']['input'];
  lotPriceAtHarvest: Scalars['Decimal']['input'];
  lotPricePaid: Scalars['Decimal']['input'];
  lotSold?: InputMaybe<LotCreateNestedOneWithoutHarvestTransactionItemsInput>;
  orderType: OrderType;
  portfolio: PortfolioCreateNestedOneWithoutHarvestTransactionItemInput;
  price: Scalars['Decimal']['input'];
  quantity: Scalars['Decimal']['input'];
  replacementTransaction?: InputMaybe<HarvestTransactionCreateNestedOneWithoutReplacementTransactionItemInput>;
  revertReplacementTransaction?: InputMaybe<HarvestTransactionCreateNestedOneWithoutRevertReplacementTransactionItemInput>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type HarvestTransactionItemCreateWithoutRevertReplacementTransactionInput = {
  asset: AssetCreateNestedOneWithoutHarvestTransactionItemsInput;
  completedDate?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  date?: InputMaybe<Scalars['DateTime']['input']>;
  harvest: HarvestCreateNestedOneWithoutHarvestTransactionItemsInput;
  harvestTransaction?: InputMaybe<HarvestTransactionCreateNestedOneWithoutHarvestTransactionItemInput>;
  id?: InputMaybe<Scalars['String']['input']>;
  lotAcquiredDate: Scalars['DateTime']['input'];
  lotPriceAtHarvest: Scalars['Decimal']['input'];
  lotPricePaid: Scalars['Decimal']['input'];
  lotSold?: InputMaybe<LotCreateNestedOneWithoutHarvestTransactionItemsInput>;
  orderType: OrderType;
  portfolio: PortfolioCreateNestedOneWithoutHarvestTransactionItemInput;
  price: Scalars['Decimal']['input'];
  quantity: Scalars['Decimal']['input'];
  replacementTransaction?: InputMaybe<HarvestTransactionCreateNestedOneWithoutReplacementTransactionItemInput>;
  revertHarvestTransaction?: InputMaybe<HarvestTransactionCreateNestedOneWithoutRevertHarvestTransactionItemInput>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type HarvestTransactionItemListRelationFilter = {
  every?: InputMaybe<HarvestTransactionItemWhereInput>;
  none?: InputMaybe<HarvestTransactionItemWhereInput>;
  some?: InputMaybe<HarvestTransactionItemWhereInput>;
};

export type HarvestTransactionItemMaxAggregate = {
  __typename?: 'HarvestTransactionItemMaxAggregate';
  assetSymbol?: Maybe<Scalars['String']['output']>;
  completedDate?: Maybe<Scalars['DateTime']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  date?: Maybe<Scalars['DateTime']['output']>;
  harvestId?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  lotAcquiredDate?: Maybe<Scalars['DateTime']['output']>;
  lotId?: Maybe<Scalars['String']['output']>;
  lotPriceAtHarvest?: Maybe<Scalars['Decimal']['output']>;
  lotPricePaid?: Maybe<Scalars['Decimal']['output']>;
  orderType?: Maybe<OrderType>;
  portfolioId?: Maybe<Scalars['String']['output']>;
  price?: Maybe<Scalars['Decimal']['output']>;
  quantity?: Maybe<Scalars['Decimal']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type HarvestTransactionItemMinAggregate = {
  __typename?: 'HarvestTransactionItemMinAggregate';
  assetSymbol?: Maybe<Scalars['String']['output']>;
  completedDate?: Maybe<Scalars['DateTime']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  date?: Maybe<Scalars['DateTime']['output']>;
  harvestId?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  lotAcquiredDate?: Maybe<Scalars['DateTime']['output']>;
  lotId?: Maybe<Scalars['String']['output']>;
  lotPriceAtHarvest?: Maybe<Scalars['Decimal']['output']>;
  lotPricePaid?: Maybe<Scalars['Decimal']['output']>;
  orderType?: Maybe<OrderType>;
  portfolioId?: Maybe<Scalars['String']['output']>;
  price?: Maybe<Scalars['Decimal']['output']>;
  quantity?: Maybe<Scalars['Decimal']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type HarvestTransactionItemNullableScalarRelationFilter = {
  is?: InputMaybe<HarvestTransactionItemWhereInput>;
  isNot?: InputMaybe<HarvestTransactionItemWhereInput>;
};

export type HarvestTransactionItemScalarRelationFilter = {
  is?: InputMaybe<HarvestTransactionItemWhereInput>;
  isNot?: InputMaybe<HarvestTransactionItemWhereInput>;
};

export type HarvestTransactionItemScalarWhereInput = {
  AND?: InputMaybe<Array<HarvestTransactionItemScalarWhereInput>>;
  NOT?: InputMaybe<Array<HarvestTransactionItemScalarWhereInput>>;
  OR?: InputMaybe<Array<HarvestTransactionItemScalarWhereInput>>;
  assetSymbol?: InputMaybe<StringFilter>;
  completedDate?: InputMaybe<DateTimeNullableFilter>;
  createdAt?: InputMaybe<DateTimeFilter>;
  date?: InputMaybe<DateTimeFilter>;
  harvestId?: InputMaybe<UuidFilter>;
  id?: InputMaybe<UuidFilter>;
  lotAcquiredDate?: InputMaybe<DateTimeFilter>;
  lotId?: InputMaybe<UuidNullableFilter>;
  lotPriceAtHarvest?: InputMaybe<DecimalFilter>;
  lotPricePaid?: InputMaybe<DecimalFilter>;
  orderType?: InputMaybe<EnumOrderTypeFilter>;
  portfolioId?: InputMaybe<UuidFilter>;
  price?: InputMaybe<DecimalFilter>;
  quantity?: InputMaybe<DecimalFilter>;
  updatedAt?: InputMaybe<DateTimeFilter>;
};

export type HarvestTransactionItemSumAggregate = {
  __typename?: 'HarvestTransactionItemSumAggregate';
  lotPriceAtHarvest?: Maybe<Scalars['Decimal']['output']>;
  lotPricePaid?: Maybe<Scalars['Decimal']['output']>;
  price?: Maybe<Scalars['Decimal']['output']>;
  quantity?: Maybe<Scalars['Decimal']['output']>;
};

export type HarvestTransactionItemUpdateInput = {
  asset?: InputMaybe<AssetUpdateOneRequiredWithoutHarvestTransactionItemsNestedInput>;
  completedDate?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  date?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  harvest?: InputMaybe<HarvestUpdateOneRequiredWithoutHarvestTransactionItemsNestedInput>;
  harvestTransaction?: InputMaybe<HarvestTransactionUpdateOneWithoutHarvestTransactionItemNestedInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  lotAcquiredDate?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  lotPriceAtHarvest?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  lotPricePaid?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  lotSold?: InputMaybe<LotUpdateOneWithoutHarvestTransactionItemsNestedInput>;
  orderType?: InputMaybe<EnumOrderTypeFieldUpdateOperationsInput>;
  portfolio?: InputMaybe<PortfolioUpdateOneRequiredWithoutHarvestTransactionItemNestedInput>;
  price?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  quantity?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  replacementTransaction?: InputMaybe<HarvestTransactionUpdateOneWithoutReplacementTransactionItemNestedInput>;
  revertHarvestTransaction?: InputMaybe<HarvestTransactionUpdateOneWithoutRevertHarvestTransactionItemNestedInput>;
  revertReplacementTransaction?: InputMaybe<HarvestTransactionUpdateOneWithoutRevertReplacementTransactionItemNestedInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
};

export type HarvestTransactionItemUpdateManyMutationInput = {
  completedDate?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  date?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  lotAcquiredDate?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  lotPriceAtHarvest?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  lotPricePaid?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  orderType?: InputMaybe<EnumOrderTypeFieldUpdateOperationsInput>;
  price?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  quantity?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
};

export type HarvestTransactionItemUpdateManyWithWhereWithoutAssetInput = {
  data: HarvestTransactionItemUpdateManyMutationInput;
  where: HarvestTransactionItemScalarWhereInput;
};

export type HarvestTransactionItemUpdateManyWithWhereWithoutHarvestInput = {
  data: HarvestTransactionItemUpdateManyMutationInput;
  where: HarvestTransactionItemScalarWhereInput;
};

export type HarvestTransactionItemUpdateManyWithWhereWithoutLotSoldInput = {
  data: HarvestTransactionItemUpdateManyMutationInput;
  where: HarvestTransactionItemScalarWhereInput;
};

export type HarvestTransactionItemUpdateManyWithWhereWithoutPortfolioInput = {
  data: HarvestTransactionItemUpdateManyMutationInput;
  where: HarvestTransactionItemScalarWhereInput;
};

export type HarvestTransactionItemUpdateManyWithoutAssetNestedInput = {
  connect?: InputMaybe<Array<HarvestTransactionItemWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<HarvestTransactionItemCreateOrConnectWithoutAssetInput>>;
  create?: InputMaybe<Array<HarvestTransactionItemCreateWithoutAssetInput>>;
  createMany?: InputMaybe<HarvestTransactionItemCreateManyAssetInputEnvelope>;
  delete?: InputMaybe<Array<HarvestTransactionItemWhereUniqueInput>>;
  deleteMany?: InputMaybe<Array<HarvestTransactionItemScalarWhereInput>>;
  disconnect?: InputMaybe<Array<HarvestTransactionItemWhereUniqueInput>>;
  set?: InputMaybe<Array<HarvestTransactionItemWhereUniqueInput>>;
  update?: InputMaybe<Array<HarvestTransactionItemUpdateWithWhereUniqueWithoutAssetInput>>;
  updateMany?: InputMaybe<Array<HarvestTransactionItemUpdateManyWithWhereWithoutAssetInput>>;
  upsert?: InputMaybe<Array<HarvestTransactionItemUpsertWithWhereUniqueWithoutAssetInput>>;
};

export type HarvestTransactionItemUpdateManyWithoutHarvestNestedInput = {
  connect?: InputMaybe<Array<HarvestTransactionItemWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<HarvestTransactionItemCreateOrConnectWithoutHarvestInput>>;
  create?: InputMaybe<Array<HarvestTransactionItemCreateWithoutHarvestInput>>;
  createMany?: InputMaybe<HarvestTransactionItemCreateManyHarvestInputEnvelope>;
  delete?: InputMaybe<Array<HarvestTransactionItemWhereUniqueInput>>;
  deleteMany?: InputMaybe<Array<HarvestTransactionItemScalarWhereInput>>;
  disconnect?: InputMaybe<Array<HarvestTransactionItemWhereUniqueInput>>;
  set?: InputMaybe<Array<HarvestTransactionItemWhereUniqueInput>>;
  update?: InputMaybe<Array<HarvestTransactionItemUpdateWithWhereUniqueWithoutHarvestInput>>;
  updateMany?: InputMaybe<Array<HarvestTransactionItemUpdateManyWithWhereWithoutHarvestInput>>;
  upsert?: InputMaybe<Array<HarvestTransactionItemUpsertWithWhereUniqueWithoutHarvestInput>>;
};

export type HarvestTransactionItemUpdateManyWithoutLotSoldNestedInput = {
  connect?: InputMaybe<Array<HarvestTransactionItemWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<HarvestTransactionItemCreateOrConnectWithoutLotSoldInput>>;
  create?: InputMaybe<Array<HarvestTransactionItemCreateWithoutLotSoldInput>>;
  createMany?: InputMaybe<HarvestTransactionItemCreateManyLotSoldInputEnvelope>;
  delete?: InputMaybe<Array<HarvestTransactionItemWhereUniqueInput>>;
  deleteMany?: InputMaybe<Array<HarvestTransactionItemScalarWhereInput>>;
  disconnect?: InputMaybe<Array<HarvestTransactionItemWhereUniqueInput>>;
  set?: InputMaybe<Array<HarvestTransactionItemWhereUniqueInput>>;
  update?: InputMaybe<Array<HarvestTransactionItemUpdateWithWhereUniqueWithoutLotSoldInput>>;
  updateMany?: InputMaybe<Array<HarvestTransactionItemUpdateManyWithWhereWithoutLotSoldInput>>;
  upsert?: InputMaybe<Array<HarvestTransactionItemUpsertWithWhereUniqueWithoutLotSoldInput>>;
};

export type HarvestTransactionItemUpdateManyWithoutPortfolioNestedInput = {
  connect?: InputMaybe<Array<HarvestTransactionItemWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<HarvestTransactionItemCreateOrConnectWithoutPortfolioInput>>;
  create?: InputMaybe<Array<HarvestTransactionItemCreateWithoutPortfolioInput>>;
  createMany?: InputMaybe<HarvestTransactionItemCreateManyPortfolioInputEnvelope>;
  delete?: InputMaybe<Array<HarvestTransactionItemWhereUniqueInput>>;
  deleteMany?: InputMaybe<Array<HarvestTransactionItemScalarWhereInput>>;
  disconnect?: InputMaybe<Array<HarvestTransactionItemWhereUniqueInput>>;
  set?: InputMaybe<Array<HarvestTransactionItemWhereUniqueInput>>;
  update?: InputMaybe<Array<HarvestTransactionItemUpdateWithWhereUniqueWithoutPortfolioInput>>;
  updateMany?: InputMaybe<Array<HarvestTransactionItemUpdateManyWithWhereWithoutPortfolioInput>>;
  upsert?: InputMaybe<Array<HarvestTransactionItemUpsertWithWhereUniqueWithoutPortfolioInput>>;
};

export type HarvestTransactionItemUpdateOneRequiredWithoutHarvestTransactionNestedInput = {
  connect?: InputMaybe<HarvestTransactionItemWhereUniqueInput>;
  connectOrCreate?: InputMaybe<HarvestTransactionItemCreateOrConnectWithoutHarvestTransactionInput>;
  create?: InputMaybe<HarvestTransactionItemCreateWithoutHarvestTransactionInput>;
  update?: InputMaybe<HarvestTransactionItemUpdateToOneWithWhereWithoutHarvestTransactionInput>;
  upsert?: InputMaybe<HarvestTransactionItemUpsertWithoutHarvestTransactionInput>;
};

export type HarvestTransactionItemUpdateOneWithoutReplacementTransactionNestedInput = {
  connect?: InputMaybe<HarvestTransactionItemWhereUniqueInput>;
  connectOrCreate?: InputMaybe<HarvestTransactionItemCreateOrConnectWithoutReplacementTransactionInput>;
  create?: InputMaybe<HarvestTransactionItemCreateWithoutReplacementTransactionInput>;
  delete?: InputMaybe<HarvestTransactionItemWhereInput>;
  disconnect?: InputMaybe<HarvestTransactionItemWhereInput>;
  update?: InputMaybe<HarvestTransactionItemUpdateToOneWithWhereWithoutReplacementTransactionInput>;
  upsert?: InputMaybe<HarvestTransactionItemUpsertWithoutReplacementTransactionInput>;
};

export type HarvestTransactionItemUpdateOneWithoutRevertHarvestTransactionNestedInput = {
  connect?: InputMaybe<HarvestTransactionItemWhereUniqueInput>;
  connectOrCreate?: InputMaybe<HarvestTransactionItemCreateOrConnectWithoutRevertHarvestTransactionInput>;
  create?: InputMaybe<HarvestTransactionItemCreateWithoutRevertHarvestTransactionInput>;
  delete?: InputMaybe<HarvestTransactionItemWhereInput>;
  disconnect?: InputMaybe<HarvestTransactionItemWhereInput>;
  update?: InputMaybe<HarvestTransactionItemUpdateToOneWithWhereWithoutRevertHarvestTransactionInput>;
  upsert?: InputMaybe<HarvestTransactionItemUpsertWithoutRevertHarvestTransactionInput>;
};

export type HarvestTransactionItemUpdateOneWithoutRevertReplacementTransactionNestedInput = {
  connect?: InputMaybe<HarvestTransactionItemWhereUniqueInput>;
  connectOrCreate?: InputMaybe<HarvestTransactionItemCreateOrConnectWithoutRevertReplacementTransactionInput>;
  create?: InputMaybe<HarvestTransactionItemCreateWithoutRevertReplacementTransactionInput>;
  delete?: InputMaybe<HarvestTransactionItemWhereInput>;
  disconnect?: InputMaybe<HarvestTransactionItemWhereInput>;
  update?: InputMaybe<HarvestTransactionItemUpdateToOneWithWhereWithoutRevertReplacementTransactionInput>;
  upsert?: InputMaybe<HarvestTransactionItemUpsertWithoutRevertReplacementTransactionInput>;
};

export type HarvestTransactionItemUpdateToOneWithWhereWithoutHarvestTransactionInput = {
  data: HarvestTransactionItemUpdateWithoutHarvestTransactionInput;
  where?: InputMaybe<HarvestTransactionItemWhereInput>;
};

export type HarvestTransactionItemUpdateToOneWithWhereWithoutReplacementTransactionInput = {
  data: HarvestTransactionItemUpdateWithoutReplacementTransactionInput;
  where?: InputMaybe<HarvestTransactionItemWhereInput>;
};

export type HarvestTransactionItemUpdateToOneWithWhereWithoutRevertHarvestTransactionInput = {
  data: HarvestTransactionItemUpdateWithoutRevertHarvestTransactionInput;
  where?: InputMaybe<HarvestTransactionItemWhereInput>;
};

export type HarvestTransactionItemUpdateToOneWithWhereWithoutRevertReplacementTransactionInput = {
  data: HarvestTransactionItemUpdateWithoutRevertReplacementTransactionInput;
  where?: InputMaybe<HarvestTransactionItemWhereInput>;
};

export type HarvestTransactionItemUpdateWithWhereUniqueWithoutAssetInput = {
  data: HarvestTransactionItemUpdateWithoutAssetInput;
  where: HarvestTransactionItemWhereUniqueInput;
};

export type HarvestTransactionItemUpdateWithWhereUniqueWithoutHarvestInput = {
  data: HarvestTransactionItemUpdateWithoutHarvestInput;
  where: HarvestTransactionItemWhereUniqueInput;
};

export type HarvestTransactionItemUpdateWithWhereUniqueWithoutLotSoldInput = {
  data: HarvestTransactionItemUpdateWithoutLotSoldInput;
  where: HarvestTransactionItemWhereUniqueInput;
};

export type HarvestTransactionItemUpdateWithWhereUniqueWithoutPortfolioInput = {
  data: HarvestTransactionItemUpdateWithoutPortfolioInput;
  where: HarvestTransactionItemWhereUniqueInput;
};

export type HarvestTransactionItemUpdateWithoutAssetInput = {
  completedDate?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  date?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  harvest?: InputMaybe<HarvestUpdateOneRequiredWithoutHarvestTransactionItemsNestedInput>;
  harvestTransaction?: InputMaybe<HarvestTransactionUpdateOneWithoutHarvestTransactionItemNestedInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  lotAcquiredDate?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  lotPriceAtHarvest?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  lotPricePaid?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  lotSold?: InputMaybe<LotUpdateOneWithoutHarvestTransactionItemsNestedInput>;
  orderType?: InputMaybe<EnumOrderTypeFieldUpdateOperationsInput>;
  portfolio?: InputMaybe<PortfolioUpdateOneRequiredWithoutHarvestTransactionItemNestedInput>;
  price?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  quantity?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  replacementTransaction?: InputMaybe<HarvestTransactionUpdateOneWithoutReplacementTransactionItemNestedInput>;
  revertHarvestTransaction?: InputMaybe<HarvestTransactionUpdateOneWithoutRevertHarvestTransactionItemNestedInput>;
  revertReplacementTransaction?: InputMaybe<HarvestTransactionUpdateOneWithoutRevertReplacementTransactionItemNestedInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
};

export type HarvestTransactionItemUpdateWithoutHarvestInput = {
  asset?: InputMaybe<AssetUpdateOneRequiredWithoutHarvestTransactionItemsNestedInput>;
  completedDate?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  date?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  harvestTransaction?: InputMaybe<HarvestTransactionUpdateOneWithoutHarvestTransactionItemNestedInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  lotAcquiredDate?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  lotPriceAtHarvest?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  lotPricePaid?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  lotSold?: InputMaybe<LotUpdateOneWithoutHarvestTransactionItemsNestedInput>;
  orderType?: InputMaybe<EnumOrderTypeFieldUpdateOperationsInput>;
  portfolio?: InputMaybe<PortfolioUpdateOneRequiredWithoutHarvestTransactionItemNestedInput>;
  price?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  quantity?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  replacementTransaction?: InputMaybe<HarvestTransactionUpdateOneWithoutReplacementTransactionItemNestedInput>;
  revertHarvestTransaction?: InputMaybe<HarvestTransactionUpdateOneWithoutRevertHarvestTransactionItemNestedInput>;
  revertReplacementTransaction?: InputMaybe<HarvestTransactionUpdateOneWithoutRevertReplacementTransactionItemNestedInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
};

export type HarvestTransactionItemUpdateWithoutHarvestTransactionInput = {
  asset?: InputMaybe<AssetUpdateOneRequiredWithoutHarvestTransactionItemsNestedInput>;
  completedDate?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  date?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  harvest?: InputMaybe<HarvestUpdateOneRequiredWithoutHarvestTransactionItemsNestedInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  lotAcquiredDate?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  lotPriceAtHarvest?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  lotPricePaid?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  lotSold?: InputMaybe<LotUpdateOneWithoutHarvestTransactionItemsNestedInput>;
  orderType?: InputMaybe<EnumOrderTypeFieldUpdateOperationsInput>;
  portfolio?: InputMaybe<PortfolioUpdateOneRequiredWithoutHarvestTransactionItemNestedInput>;
  price?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  quantity?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  replacementTransaction?: InputMaybe<HarvestTransactionUpdateOneWithoutReplacementTransactionItemNestedInput>;
  revertHarvestTransaction?: InputMaybe<HarvestTransactionUpdateOneWithoutRevertHarvestTransactionItemNestedInput>;
  revertReplacementTransaction?: InputMaybe<HarvestTransactionUpdateOneWithoutRevertReplacementTransactionItemNestedInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
};

export type HarvestTransactionItemUpdateWithoutLotSoldInput = {
  asset?: InputMaybe<AssetUpdateOneRequiredWithoutHarvestTransactionItemsNestedInput>;
  completedDate?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  date?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  harvest?: InputMaybe<HarvestUpdateOneRequiredWithoutHarvestTransactionItemsNestedInput>;
  harvestTransaction?: InputMaybe<HarvestTransactionUpdateOneWithoutHarvestTransactionItemNestedInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  lotAcquiredDate?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  lotPriceAtHarvest?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  lotPricePaid?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  orderType?: InputMaybe<EnumOrderTypeFieldUpdateOperationsInput>;
  portfolio?: InputMaybe<PortfolioUpdateOneRequiredWithoutHarvestTransactionItemNestedInput>;
  price?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  quantity?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  replacementTransaction?: InputMaybe<HarvestTransactionUpdateOneWithoutReplacementTransactionItemNestedInput>;
  revertHarvestTransaction?: InputMaybe<HarvestTransactionUpdateOneWithoutRevertHarvestTransactionItemNestedInput>;
  revertReplacementTransaction?: InputMaybe<HarvestTransactionUpdateOneWithoutRevertReplacementTransactionItemNestedInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
};

export type HarvestTransactionItemUpdateWithoutPortfolioInput = {
  asset?: InputMaybe<AssetUpdateOneRequiredWithoutHarvestTransactionItemsNestedInput>;
  completedDate?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  date?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  harvest?: InputMaybe<HarvestUpdateOneRequiredWithoutHarvestTransactionItemsNestedInput>;
  harvestTransaction?: InputMaybe<HarvestTransactionUpdateOneWithoutHarvestTransactionItemNestedInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  lotAcquiredDate?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  lotPriceAtHarvest?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  lotPricePaid?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  lotSold?: InputMaybe<LotUpdateOneWithoutHarvestTransactionItemsNestedInput>;
  orderType?: InputMaybe<EnumOrderTypeFieldUpdateOperationsInput>;
  price?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  quantity?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  replacementTransaction?: InputMaybe<HarvestTransactionUpdateOneWithoutReplacementTransactionItemNestedInput>;
  revertHarvestTransaction?: InputMaybe<HarvestTransactionUpdateOneWithoutRevertHarvestTransactionItemNestedInput>;
  revertReplacementTransaction?: InputMaybe<HarvestTransactionUpdateOneWithoutRevertReplacementTransactionItemNestedInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
};

export type HarvestTransactionItemUpdateWithoutReplacementTransactionInput = {
  asset?: InputMaybe<AssetUpdateOneRequiredWithoutHarvestTransactionItemsNestedInput>;
  completedDate?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  date?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  harvest?: InputMaybe<HarvestUpdateOneRequiredWithoutHarvestTransactionItemsNestedInput>;
  harvestTransaction?: InputMaybe<HarvestTransactionUpdateOneWithoutHarvestTransactionItemNestedInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  lotAcquiredDate?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  lotPriceAtHarvest?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  lotPricePaid?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  lotSold?: InputMaybe<LotUpdateOneWithoutHarvestTransactionItemsNestedInput>;
  orderType?: InputMaybe<EnumOrderTypeFieldUpdateOperationsInput>;
  portfolio?: InputMaybe<PortfolioUpdateOneRequiredWithoutHarvestTransactionItemNestedInput>;
  price?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  quantity?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  revertHarvestTransaction?: InputMaybe<HarvestTransactionUpdateOneWithoutRevertHarvestTransactionItemNestedInput>;
  revertReplacementTransaction?: InputMaybe<HarvestTransactionUpdateOneWithoutRevertReplacementTransactionItemNestedInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
};

export type HarvestTransactionItemUpdateWithoutRevertHarvestTransactionInput = {
  asset?: InputMaybe<AssetUpdateOneRequiredWithoutHarvestTransactionItemsNestedInput>;
  completedDate?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  date?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  harvest?: InputMaybe<HarvestUpdateOneRequiredWithoutHarvestTransactionItemsNestedInput>;
  harvestTransaction?: InputMaybe<HarvestTransactionUpdateOneWithoutHarvestTransactionItemNestedInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  lotAcquiredDate?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  lotPriceAtHarvest?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  lotPricePaid?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  lotSold?: InputMaybe<LotUpdateOneWithoutHarvestTransactionItemsNestedInput>;
  orderType?: InputMaybe<EnumOrderTypeFieldUpdateOperationsInput>;
  portfolio?: InputMaybe<PortfolioUpdateOneRequiredWithoutHarvestTransactionItemNestedInput>;
  price?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  quantity?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  replacementTransaction?: InputMaybe<HarvestTransactionUpdateOneWithoutReplacementTransactionItemNestedInput>;
  revertReplacementTransaction?: InputMaybe<HarvestTransactionUpdateOneWithoutRevertReplacementTransactionItemNestedInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
};

export type HarvestTransactionItemUpdateWithoutRevertReplacementTransactionInput = {
  asset?: InputMaybe<AssetUpdateOneRequiredWithoutHarvestTransactionItemsNestedInput>;
  completedDate?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  date?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  harvest?: InputMaybe<HarvestUpdateOneRequiredWithoutHarvestTransactionItemsNestedInput>;
  harvestTransaction?: InputMaybe<HarvestTransactionUpdateOneWithoutHarvestTransactionItemNestedInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  lotAcquiredDate?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  lotPriceAtHarvest?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  lotPricePaid?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  lotSold?: InputMaybe<LotUpdateOneWithoutHarvestTransactionItemsNestedInput>;
  orderType?: InputMaybe<EnumOrderTypeFieldUpdateOperationsInput>;
  portfolio?: InputMaybe<PortfolioUpdateOneRequiredWithoutHarvestTransactionItemNestedInput>;
  price?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  quantity?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  replacementTransaction?: InputMaybe<HarvestTransactionUpdateOneWithoutReplacementTransactionItemNestedInput>;
  revertHarvestTransaction?: InputMaybe<HarvestTransactionUpdateOneWithoutRevertHarvestTransactionItemNestedInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
};

export type HarvestTransactionItemUpsertWithWhereUniqueWithoutAssetInput = {
  create: HarvestTransactionItemCreateWithoutAssetInput;
  update: HarvestTransactionItemUpdateWithoutAssetInput;
  where: HarvestTransactionItemWhereUniqueInput;
};

export type HarvestTransactionItemUpsertWithWhereUniqueWithoutHarvestInput = {
  create: HarvestTransactionItemCreateWithoutHarvestInput;
  update: HarvestTransactionItemUpdateWithoutHarvestInput;
  where: HarvestTransactionItemWhereUniqueInput;
};

export type HarvestTransactionItemUpsertWithWhereUniqueWithoutLotSoldInput = {
  create: HarvestTransactionItemCreateWithoutLotSoldInput;
  update: HarvestTransactionItemUpdateWithoutLotSoldInput;
  where: HarvestTransactionItemWhereUniqueInput;
};

export type HarvestTransactionItemUpsertWithWhereUniqueWithoutPortfolioInput = {
  create: HarvestTransactionItemCreateWithoutPortfolioInput;
  update: HarvestTransactionItemUpdateWithoutPortfolioInput;
  where: HarvestTransactionItemWhereUniqueInput;
};

export type HarvestTransactionItemUpsertWithoutHarvestTransactionInput = {
  create: HarvestTransactionItemCreateWithoutHarvestTransactionInput;
  update: HarvestTransactionItemUpdateWithoutHarvestTransactionInput;
  where?: InputMaybe<HarvestTransactionItemWhereInput>;
};

export type HarvestTransactionItemUpsertWithoutReplacementTransactionInput = {
  create: HarvestTransactionItemCreateWithoutReplacementTransactionInput;
  update: HarvestTransactionItemUpdateWithoutReplacementTransactionInput;
  where?: InputMaybe<HarvestTransactionItemWhereInput>;
};

export type HarvestTransactionItemUpsertWithoutRevertHarvestTransactionInput = {
  create: HarvestTransactionItemCreateWithoutRevertHarvestTransactionInput;
  update: HarvestTransactionItemUpdateWithoutRevertHarvestTransactionInput;
  where?: InputMaybe<HarvestTransactionItemWhereInput>;
};

export type HarvestTransactionItemUpsertWithoutRevertReplacementTransactionInput = {
  create: HarvestTransactionItemCreateWithoutRevertReplacementTransactionInput;
  update: HarvestTransactionItemUpdateWithoutRevertReplacementTransactionInput;
  where?: InputMaybe<HarvestTransactionItemWhereInput>;
};

export type HarvestTransactionItemWhereInput = {
  AND?: InputMaybe<Array<HarvestTransactionItemWhereInput>>;
  NOT?: InputMaybe<Array<HarvestTransactionItemWhereInput>>;
  OR?: InputMaybe<Array<HarvestTransactionItemWhereInput>>;
  asset?: InputMaybe<AssetScalarRelationFilter>;
  assetSymbol?: InputMaybe<StringFilter>;
  completedDate?: InputMaybe<DateTimeNullableFilter>;
  createdAt?: InputMaybe<DateTimeFilter>;
  date?: InputMaybe<DateTimeFilter>;
  harvest?: InputMaybe<HarvestScalarRelationFilter>;
  harvestId?: InputMaybe<UuidFilter>;
  harvestTransaction?: InputMaybe<HarvestTransactionNullableScalarRelationFilter>;
  id?: InputMaybe<UuidFilter>;
  lotAcquiredDate?: InputMaybe<DateTimeFilter>;
  lotId?: InputMaybe<UuidNullableFilter>;
  lotPriceAtHarvest?: InputMaybe<DecimalFilter>;
  lotPricePaid?: InputMaybe<DecimalFilter>;
  lotSold?: InputMaybe<LotNullableScalarRelationFilter>;
  orderType?: InputMaybe<EnumOrderTypeFilter>;
  portfolio?: InputMaybe<PortfolioScalarRelationFilter>;
  portfolioId?: InputMaybe<UuidFilter>;
  price?: InputMaybe<DecimalFilter>;
  quantity?: InputMaybe<DecimalFilter>;
  replacementTransaction?: InputMaybe<HarvestTransactionNullableScalarRelationFilter>;
  revertHarvestTransaction?: InputMaybe<HarvestTransactionNullableScalarRelationFilter>;
  revertReplacementTransaction?: InputMaybe<HarvestTransactionNullableScalarRelationFilter>;
  updatedAt?: InputMaybe<DateTimeFilter>;
};

export type HarvestTransactionItemWhereUniqueInput = {
  AND?: InputMaybe<Array<HarvestTransactionItemWhereInput>>;
  NOT?: InputMaybe<Array<HarvestTransactionItemWhereInput>>;
  OR?: InputMaybe<Array<HarvestTransactionItemWhereInput>>;
  asset?: InputMaybe<AssetScalarRelationFilter>;
  assetSymbol?: InputMaybe<StringFilter>;
  completedDate?: InputMaybe<DateTimeNullableFilter>;
  createdAt?: InputMaybe<DateTimeFilter>;
  date?: InputMaybe<DateTimeFilter>;
  harvest?: InputMaybe<HarvestScalarRelationFilter>;
  harvestId?: InputMaybe<UuidFilter>;
  harvestTransaction?: InputMaybe<HarvestTransactionNullableScalarRelationFilter>;
  id?: InputMaybe<Scalars['String']['input']>;
  lotAcquiredDate?: InputMaybe<DateTimeFilter>;
  lotId?: InputMaybe<UuidNullableFilter>;
  lotPriceAtHarvest?: InputMaybe<DecimalFilter>;
  lotPricePaid?: InputMaybe<DecimalFilter>;
  lotSold?: InputMaybe<LotNullableScalarRelationFilter>;
  orderType?: InputMaybe<EnumOrderTypeFilter>;
  portfolio?: InputMaybe<PortfolioScalarRelationFilter>;
  portfolioId?: InputMaybe<UuidFilter>;
  price?: InputMaybe<DecimalFilter>;
  quantity?: InputMaybe<DecimalFilter>;
  replacementTransaction?: InputMaybe<HarvestTransactionNullableScalarRelationFilter>;
  revertHarvestTransaction?: InputMaybe<HarvestTransactionNullableScalarRelationFilter>;
  revertReplacementTransaction?: InputMaybe<HarvestTransactionNullableScalarRelationFilter>;
  updatedAt?: InputMaybe<DateTimeFilter>;
};

export type HarvestTransactionListRelationFilter = {
  every?: InputMaybe<HarvestTransactionWhereInput>;
  none?: InputMaybe<HarvestTransactionWhereInput>;
  some?: InputMaybe<HarvestTransactionWhereInput>;
};

export type HarvestTransactionMaxAggregate = {
  __typename?: 'HarvestTransactionMaxAggregate';
  counterTransaction?: Maybe<Scalars['Boolean']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  harvestId?: Maybe<Scalars['String']['output']>;
  harvestTransactionItemId?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  portfolioId?: Maybe<Scalars['String']['output']>;
  replacementTransactionItemId?: Maybe<Scalars['String']['output']>;
  revert?: Maybe<Scalars['Boolean']['output']>;
  revertHarvestTransactionItemId?: Maybe<Scalars['String']['output']>;
  revertReplacementTransactionItemId?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type HarvestTransactionMinAggregate = {
  __typename?: 'HarvestTransactionMinAggregate';
  counterTransaction?: Maybe<Scalars['Boolean']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  harvestId?: Maybe<Scalars['String']['output']>;
  harvestTransactionItemId?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  portfolioId?: Maybe<Scalars['String']['output']>;
  replacementTransactionItemId?: Maybe<Scalars['String']['output']>;
  revert?: Maybe<Scalars['Boolean']['output']>;
  revertHarvestTransactionItemId?: Maybe<Scalars['String']['output']>;
  revertReplacementTransactionItemId?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type HarvestTransactionNullableScalarRelationFilter = {
  is?: InputMaybe<HarvestTransactionWhereInput>;
  isNot?: InputMaybe<HarvestTransactionWhereInput>;
};

export type HarvestTransactionScalarWhereInput = {
  AND?: InputMaybe<Array<HarvestTransactionScalarWhereInput>>;
  NOT?: InputMaybe<Array<HarvestTransactionScalarWhereInput>>;
  OR?: InputMaybe<Array<HarvestTransactionScalarWhereInput>>;
  counterTransaction?: InputMaybe<BoolFilter>;
  createdAt?: InputMaybe<DateTimeFilter>;
  harvestId?: InputMaybe<UuidFilter>;
  harvestTransactionItemId?: InputMaybe<UuidFilter>;
  id?: InputMaybe<UuidFilter>;
  portfolioId?: InputMaybe<UuidFilter>;
  replacementTransactionItemId?: InputMaybe<UuidNullableFilter>;
  revert?: InputMaybe<BoolFilter>;
  revertHarvestTransactionItemId?: InputMaybe<UuidNullableFilter>;
  revertReplacementTransactionItemId?: InputMaybe<UuidNullableFilter>;
  updatedAt?: InputMaybe<DateTimeFilter>;
};

export type HarvestTransactionUpdateInput = {
  counterTransaction?: InputMaybe<BoolFieldUpdateOperationsInput>;
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  harvest?: InputMaybe<HarvestUpdateOneRequiredWithoutHarvestTransactionsNestedInput>;
  harvestTransactionItem?: InputMaybe<HarvestTransactionItemUpdateOneRequiredWithoutHarvestTransactionNestedInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  portfolio?: InputMaybe<PortfolioUpdateOneRequiredWithoutHarvestTransactionNestedInput>;
  replacementTransactionItem?: InputMaybe<HarvestTransactionItemUpdateOneWithoutReplacementTransactionNestedInput>;
  revert?: InputMaybe<BoolFieldUpdateOperationsInput>;
  revertHarvestTransactionItem?: InputMaybe<HarvestTransactionItemUpdateOneWithoutRevertHarvestTransactionNestedInput>;
  revertReplacementTransactionItem?: InputMaybe<HarvestTransactionItemUpdateOneWithoutRevertReplacementTransactionNestedInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
};

export type HarvestTransactionUpdateManyMutationInput = {
  counterTransaction?: InputMaybe<BoolFieldUpdateOperationsInput>;
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  revert?: InputMaybe<BoolFieldUpdateOperationsInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
};

export type HarvestTransactionUpdateManyWithWhereWithoutHarvestInput = {
  data: HarvestTransactionUpdateManyMutationInput;
  where: HarvestTransactionScalarWhereInput;
};

export type HarvestTransactionUpdateManyWithWhereWithoutPortfolioInput = {
  data: HarvestTransactionUpdateManyMutationInput;
  where: HarvestTransactionScalarWhereInput;
};

export type HarvestTransactionUpdateManyWithoutHarvestNestedInput = {
  connect?: InputMaybe<Array<HarvestTransactionWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<HarvestTransactionCreateOrConnectWithoutHarvestInput>>;
  create?: InputMaybe<Array<HarvestTransactionCreateWithoutHarvestInput>>;
  createMany?: InputMaybe<HarvestTransactionCreateManyHarvestInputEnvelope>;
  delete?: InputMaybe<Array<HarvestTransactionWhereUniqueInput>>;
  deleteMany?: InputMaybe<Array<HarvestTransactionScalarWhereInput>>;
  disconnect?: InputMaybe<Array<HarvestTransactionWhereUniqueInput>>;
  set?: InputMaybe<Array<HarvestTransactionWhereUniqueInput>>;
  update?: InputMaybe<Array<HarvestTransactionUpdateWithWhereUniqueWithoutHarvestInput>>;
  updateMany?: InputMaybe<Array<HarvestTransactionUpdateManyWithWhereWithoutHarvestInput>>;
  upsert?: InputMaybe<Array<HarvestTransactionUpsertWithWhereUniqueWithoutHarvestInput>>;
};

export type HarvestTransactionUpdateManyWithoutPortfolioNestedInput = {
  connect?: InputMaybe<Array<HarvestTransactionWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<HarvestTransactionCreateOrConnectWithoutPortfolioInput>>;
  create?: InputMaybe<Array<HarvestTransactionCreateWithoutPortfolioInput>>;
  createMany?: InputMaybe<HarvestTransactionCreateManyPortfolioInputEnvelope>;
  delete?: InputMaybe<Array<HarvestTransactionWhereUniqueInput>>;
  deleteMany?: InputMaybe<Array<HarvestTransactionScalarWhereInput>>;
  disconnect?: InputMaybe<Array<HarvestTransactionWhereUniqueInput>>;
  set?: InputMaybe<Array<HarvestTransactionWhereUniqueInput>>;
  update?: InputMaybe<Array<HarvestTransactionUpdateWithWhereUniqueWithoutPortfolioInput>>;
  updateMany?: InputMaybe<Array<HarvestTransactionUpdateManyWithWhereWithoutPortfolioInput>>;
  upsert?: InputMaybe<Array<HarvestTransactionUpsertWithWhereUniqueWithoutPortfolioInput>>;
};

export type HarvestTransactionUpdateOneWithoutHarvestTransactionItemNestedInput = {
  connect?: InputMaybe<HarvestTransactionWhereUniqueInput>;
  connectOrCreate?: InputMaybe<HarvestTransactionCreateOrConnectWithoutHarvestTransactionItemInput>;
  create?: InputMaybe<HarvestTransactionCreateWithoutHarvestTransactionItemInput>;
  delete?: InputMaybe<HarvestTransactionWhereInput>;
  disconnect?: InputMaybe<HarvestTransactionWhereInput>;
  update?: InputMaybe<HarvestTransactionUpdateToOneWithWhereWithoutHarvestTransactionItemInput>;
  upsert?: InputMaybe<HarvestTransactionUpsertWithoutHarvestTransactionItemInput>;
};

export type HarvestTransactionUpdateOneWithoutReplacementTransactionItemNestedInput = {
  connect?: InputMaybe<HarvestTransactionWhereUniqueInput>;
  connectOrCreate?: InputMaybe<HarvestTransactionCreateOrConnectWithoutReplacementTransactionItemInput>;
  create?: InputMaybe<HarvestTransactionCreateWithoutReplacementTransactionItemInput>;
  delete?: InputMaybe<HarvestTransactionWhereInput>;
  disconnect?: InputMaybe<HarvestTransactionWhereInput>;
  update?: InputMaybe<HarvestTransactionUpdateToOneWithWhereWithoutReplacementTransactionItemInput>;
  upsert?: InputMaybe<HarvestTransactionUpsertWithoutReplacementTransactionItemInput>;
};

export type HarvestTransactionUpdateOneWithoutRevertHarvestTransactionItemNestedInput = {
  connect?: InputMaybe<HarvestTransactionWhereUniqueInput>;
  connectOrCreate?: InputMaybe<HarvestTransactionCreateOrConnectWithoutRevertHarvestTransactionItemInput>;
  create?: InputMaybe<HarvestTransactionCreateWithoutRevertHarvestTransactionItemInput>;
  delete?: InputMaybe<HarvestTransactionWhereInput>;
  disconnect?: InputMaybe<HarvestTransactionWhereInput>;
  update?: InputMaybe<HarvestTransactionUpdateToOneWithWhereWithoutRevertHarvestTransactionItemInput>;
  upsert?: InputMaybe<HarvestTransactionUpsertWithoutRevertHarvestTransactionItemInput>;
};

export type HarvestTransactionUpdateOneWithoutRevertReplacementTransactionItemNestedInput = {
  connect?: InputMaybe<HarvestTransactionWhereUniqueInput>;
  connectOrCreate?: InputMaybe<HarvestTransactionCreateOrConnectWithoutRevertReplacementTransactionItemInput>;
  create?: InputMaybe<HarvestTransactionCreateWithoutRevertReplacementTransactionItemInput>;
  delete?: InputMaybe<HarvestTransactionWhereInput>;
  disconnect?: InputMaybe<HarvestTransactionWhereInput>;
  update?: InputMaybe<HarvestTransactionUpdateToOneWithWhereWithoutRevertReplacementTransactionItemInput>;
  upsert?: InputMaybe<HarvestTransactionUpsertWithoutRevertReplacementTransactionItemInput>;
};

export type HarvestTransactionUpdateToOneWithWhereWithoutHarvestTransactionItemInput = {
  data: HarvestTransactionUpdateWithoutHarvestTransactionItemInput;
  where?: InputMaybe<HarvestTransactionWhereInput>;
};

export type HarvestTransactionUpdateToOneWithWhereWithoutReplacementTransactionItemInput = {
  data: HarvestTransactionUpdateWithoutReplacementTransactionItemInput;
  where?: InputMaybe<HarvestTransactionWhereInput>;
};

export type HarvestTransactionUpdateToOneWithWhereWithoutRevertHarvestTransactionItemInput = {
  data: HarvestTransactionUpdateWithoutRevertHarvestTransactionItemInput;
  where?: InputMaybe<HarvestTransactionWhereInput>;
};

export type HarvestTransactionUpdateToOneWithWhereWithoutRevertReplacementTransactionItemInput = {
  data: HarvestTransactionUpdateWithoutRevertReplacementTransactionItemInput;
  where?: InputMaybe<HarvestTransactionWhereInput>;
};

export type HarvestTransactionUpdateWithWhereUniqueWithoutHarvestInput = {
  data: HarvestTransactionUpdateWithoutHarvestInput;
  where: HarvestTransactionWhereUniqueInput;
};

export type HarvestTransactionUpdateWithWhereUniqueWithoutPortfolioInput = {
  data: HarvestTransactionUpdateWithoutPortfolioInput;
  where: HarvestTransactionWhereUniqueInput;
};

export type HarvestTransactionUpdateWithoutHarvestInput = {
  counterTransaction?: InputMaybe<BoolFieldUpdateOperationsInput>;
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  harvestTransactionItem?: InputMaybe<HarvestTransactionItemUpdateOneRequiredWithoutHarvestTransactionNestedInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  portfolio?: InputMaybe<PortfolioUpdateOneRequiredWithoutHarvestTransactionNestedInput>;
  replacementTransactionItem?: InputMaybe<HarvestTransactionItemUpdateOneWithoutReplacementTransactionNestedInput>;
  revert?: InputMaybe<BoolFieldUpdateOperationsInput>;
  revertHarvestTransactionItem?: InputMaybe<HarvestTransactionItemUpdateOneWithoutRevertHarvestTransactionNestedInput>;
  revertReplacementTransactionItem?: InputMaybe<HarvestTransactionItemUpdateOneWithoutRevertReplacementTransactionNestedInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
};

export type HarvestTransactionUpdateWithoutHarvestTransactionItemInput = {
  counterTransaction?: InputMaybe<BoolFieldUpdateOperationsInput>;
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  harvest?: InputMaybe<HarvestUpdateOneRequiredWithoutHarvestTransactionsNestedInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  portfolio?: InputMaybe<PortfolioUpdateOneRequiredWithoutHarvestTransactionNestedInput>;
  replacementTransactionItem?: InputMaybe<HarvestTransactionItemUpdateOneWithoutReplacementTransactionNestedInput>;
  revert?: InputMaybe<BoolFieldUpdateOperationsInput>;
  revertHarvestTransactionItem?: InputMaybe<HarvestTransactionItemUpdateOneWithoutRevertHarvestTransactionNestedInput>;
  revertReplacementTransactionItem?: InputMaybe<HarvestTransactionItemUpdateOneWithoutRevertReplacementTransactionNestedInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
};

export type HarvestTransactionUpdateWithoutPortfolioInput = {
  counterTransaction?: InputMaybe<BoolFieldUpdateOperationsInput>;
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  harvest?: InputMaybe<HarvestUpdateOneRequiredWithoutHarvestTransactionsNestedInput>;
  harvestTransactionItem?: InputMaybe<HarvestTransactionItemUpdateOneRequiredWithoutHarvestTransactionNestedInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  replacementTransactionItem?: InputMaybe<HarvestTransactionItemUpdateOneWithoutReplacementTransactionNestedInput>;
  revert?: InputMaybe<BoolFieldUpdateOperationsInput>;
  revertHarvestTransactionItem?: InputMaybe<HarvestTransactionItemUpdateOneWithoutRevertHarvestTransactionNestedInput>;
  revertReplacementTransactionItem?: InputMaybe<HarvestTransactionItemUpdateOneWithoutRevertReplacementTransactionNestedInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
};

export type HarvestTransactionUpdateWithoutReplacementTransactionItemInput = {
  counterTransaction?: InputMaybe<BoolFieldUpdateOperationsInput>;
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  harvest?: InputMaybe<HarvestUpdateOneRequiredWithoutHarvestTransactionsNestedInput>;
  harvestTransactionItem?: InputMaybe<HarvestTransactionItemUpdateOneRequiredWithoutHarvestTransactionNestedInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  portfolio?: InputMaybe<PortfolioUpdateOneRequiredWithoutHarvestTransactionNestedInput>;
  revert?: InputMaybe<BoolFieldUpdateOperationsInput>;
  revertHarvestTransactionItem?: InputMaybe<HarvestTransactionItemUpdateOneWithoutRevertHarvestTransactionNestedInput>;
  revertReplacementTransactionItem?: InputMaybe<HarvestTransactionItemUpdateOneWithoutRevertReplacementTransactionNestedInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
};

export type HarvestTransactionUpdateWithoutRevertHarvestTransactionItemInput = {
  counterTransaction?: InputMaybe<BoolFieldUpdateOperationsInput>;
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  harvest?: InputMaybe<HarvestUpdateOneRequiredWithoutHarvestTransactionsNestedInput>;
  harvestTransactionItem?: InputMaybe<HarvestTransactionItemUpdateOneRequiredWithoutHarvestTransactionNestedInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  portfolio?: InputMaybe<PortfolioUpdateOneRequiredWithoutHarvestTransactionNestedInput>;
  replacementTransactionItem?: InputMaybe<HarvestTransactionItemUpdateOneWithoutReplacementTransactionNestedInput>;
  revert?: InputMaybe<BoolFieldUpdateOperationsInput>;
  revertReplacementTransactionItem?: InputMaybe<HarvestTransactionItemUpdateOneWithoutRevertReplacementTransactionNestedInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
};

export type HarvestTransactionUpdateWithoutRevertReplacementTransactionItemInput = {
  counterTransaction?: InputMaybe<BoolFieldUpdateOperationsInput>;
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  harvest?: InputMaybe<HarvestUpdateOneRequiredWithoutHarvestTransactionsNestedInput>;
  harvestTransactionItem?: InputMaybe<HarvestTransactionItemUpdateOneRequiredWithoutHarvestTransactionNestedInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  portfolio?: InputMaybe<PortfolioUpdateOneRequiredWithoutHarvestTransactionNestedInput>;
  replacementTransactionItem?: InputMaybe<HarvestTransactionItemUpdateOneWithoutReplacementTransactionNestedInput>;
  revert?: InputMaybe<BoolFieldUpdateOperationsInput>;
  revertHarvestTransactionItem?: InputMaybe<HarvestTransactionItemUpdateOneWithoutRevertHarvestTransactionNestedInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
};

export type HarvestTransactionUpsertWithWhereUniqueWithoutHarvestInput = {
  create: HarvestTransactionCreateWithoutHarvestInput;
  update: HarvestTransactionUpdateWithoutHarvestInput;
  where: HarvestTransactionWhereUniqueInput;
};

export type HarvestTransactionUpsertWithWhereUniqueWithoutPortfolioInput = {
  create: HarvestTransactionCreateWithoutPortfolioInput;
  update: HarvestTransactionUpdateWithoutPortfolioInput;
  where: HarvestTransactionWhereUniqueInput;
};

export type HarvestTransactionUpsertWithoutHarvestTransactionItemInput = {
  create: HarvestTransactionCreateWithoutHarvestTransactionItemInput;
  update: HarvestTransactionUpdateWithoutHarvestTransactionItemInput;
  where?: InputMaybe<HarvestTransactionWhereInput>;
};

export type HarvestTransactionUpsertWithoutReplacementTransactionItemInput = {
  create: HarvestTransactionCreateWithoutReplacementTransactionItemInput;
  update: HarvestTransactionUpdateWithoutReplacementTransactionItemInput;
  where?: InputMaybe<HarvestTransactionWhereInput>;
};

export type HarvestTransactionUpsertWithoutRevertHarvestTransactionItemInput = {
  create: HarvestTransactionCreateWithoutRevertHarvestTransactionItemInput;
  update: HarvestTransactionUpdateWithoutRevertHarvestTransactionItemInput;
  where?: InputMaybe<HarvestTransactionWhereInput>;
};

export type HarvestTransactionUpsertWithoutRevertReplacementTransactionItemInput = {
  create: HarvestTransactionCreateWithoutRevertReplacementTransactionItemInput;
  update: HarvestTransactionUpdateWithoutRevertReplacementTransactionItemInput;
  where?: InputMaybe<HarvestTransactionWhereInput>;
};

export type HarvestTransactionWhereInput = {
  AND?: InputMaybe<Array<HarvestTransactionWhereInput>>;
  NOT?: InputMaybe<Array<HarvestTransactionWhereInput>>;
  OR?: InputMaybe<Array<HarvestTransactionWhereInput>>;
  counterTransaction?: InputMaybe<BoolFilter>;
  createdAt?: InputMaybe<DateTimeFilter>;
  harvest?: InputMaybe<HarvestScalarRelationFilter>;
  harvestId?: InputMaybe<UuidFilter>;
  harvestTransactionItem?: InputMaybe<HarvestTransactionItemScalarRelationFilter>;
  harvestTransactionItemId?: InputMaybe<UuidFilter>;
  id?: InputMaybe<UuidFilter>;
  portfolio?: InputMaybe<PortfolioScalarRelationFilter>;
  portfolioId?: InputMaybe<UuidFilter>;
  replacementTransactionItem?: InputMaybe<HarvestTransactionItemNullableScalarRelationFilter>;
  replacementTransactionItemId?: InputMaybe<UuidNullableFilter>;
  revert?: InputMaybe<BoolFilter>;
  revertHarvestTransactionItem?: InputMaybe<HarvestTransactionItemNullableScalarRelationFilter>;
  revertHarvestTransactionItemId?: InputMaybe<UuidNullableFilter>;
  revertReplacementTransactionItem?: InputMaybe<HarvestTransactionItemNullableScalarRelationFilter>;
  revertReplacementTransactionItemId?: InputMaybe<UuidNullableFilter>;
  updatedAt?: InputMaybe<DateTimeFilter>;
};

export type HarvestTransactionWhereUniqueInput = {
  AND?: InputMaybe<Array<HarvestTransactionWhereInput>>;
  NOT?: InputMaybe<Array<HarvestTransactionWhereInput>>;
  OR?: InputMaybe<Array<HarvestTransactionWhereInput>>;
  counterTransaction?: InputMaybe<BoolFilter>;
  createdAt?: InputMaybe<DateTimeFilter>;
  harvest?: InputMaybe<HarvestScalarRelationFilter>;
  harvestId?: InputMaybe<UuidFilter>;
  harvestTransactionItem?: InputMaybe<HarvestTransactionItemScalarRelationFilter>;
  harvestTransactionItemId?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  portfolio?: InputMaybe<PortfolioScalarRelationFilter>;
  portfolioId?: InputMaybe<UuidFilter>;
  replacementTransactionItem?: InputMaybe<HarvestTransactionItemNullableScalarRelationFilter>;
  replacementTransactionItemId?: InputMaybe<Scalars['String']['input']>;
  revert?: InputMaybe<BoolFilter>;
  revertHarvestTransactionItem?: InputMaybe<HarvestTransactionItemNullableScalarRelationFilter>;
  revertHarvestTransactionItemId?: InputMaybe<Scalars['String']['input']>;
  revertReplacementTransactionItem?: InputMaybe<HarvestTransactionItemNullableScalarRelationFilter>;
  revertReplacementTransactionItemId?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<DateTimeFilter>;
};

export enum HarvestType {
  CaptureGainsTaxFree = 'CAPTURE_GAINS_TAX_FREE',
  NoOpportunityEmpty = 'NO_OPPORTUNITY_EMPTY',
  NoOpportunityGains = 'NO_OPPORTUNITY_GAINS',
  NoOpportunityLosses = 'NO_OPPORTUNITY_LOSSES',
  ReduceCostBasis = 'REDUCE_COST_BASIS',
  ReduceTaxes = 'REDUCE_TAXES',
  Sell = 'SELL'
}

export type HarvestUpdateInput = {
  afterWashRevertDate?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  amount?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  createdBy?: InputMaybe<UserUpdateOneRequiredWithoutHarvestNestedInput>;
  date?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  harvestTransactionItems?: InputMaybe<HarvestTransactionItemUpdateManyWithoutHarvestNestedInput>;
  harvestTransactions?: InputMaybe<HarvestTransactionUpdateManyWithoutHarvestNestedInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  label?: InputMaybe<StringFieldUpdateOperationsInput>;
  notify?: InputMaybe<BoolFieldUpdateOperationsInput>;
  portfolio?: InputMaybe<PortfolioUpdateOneRequiredWithoutHarvestsNestedInput>;
  recommendationExpiresDate?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  step?: InputMaybe<EnumHarvestStepFieldUpdateOperationsInput>;
  type?: InputMaybe<EnumHarvestTypeFieldUpdateOperationsInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
};

export type HarvestUpdateManyMutationInput = {
  afterWashRevertDate?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  amount?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  date?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  label?: InputMaybe<StringFieldUpdateOperationsInput>;
  notify?: InputMaybe<BoolFieldUpdateOperationsInput>;
  recommendationExpiresDate?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  step?: InputMaybe<EnumHarvestStepFieldUpdateOperationsInput>;
  type?: InputMaybe<EnumHarvestTypeFieldUpdateOperationsInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
};

export type HarvestUpdateManyWithWhereWithoutCreatedByInput = {
  data: HarvestUpdateManyMutationInput;
  where: HarvestScalarWhereInput;
};

export type HarvestUpdateManyWithWhereWithoutPortfolioInput = {
  data: HarvestUpdateManyMutationInput;
  where: HarvestScalarWhereInput;
};

export type HarvestUpdateManyWithoutCreatedByNestedInput = {
  connect?: InputMaybe<Array<HarvestWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<HarvestCreateOrConnectWithoutCreatedByInput>>;
  create?: InputMaybe<Array<HarvestCreateWithoutCreatedByInput>>;
  createMany?: InputMaybe<HarvestCreateManyCreatedByInputEnvelope>;
  delete?: InputMaybe<Array<HarvestWhereUniqueInput>>;
  deleteMany?: InputMaybe<Array<HarvestScalarWhereInput>>;
  disconnect?: InputMaybe<Array<HarvestWhereUniqueInput>>;
  set?: InputMaybe<Array<HarvestWhereUniqueInput>>;
  update?: InputMaybe<Array<HarvestUpdateWithWhereUniqueWithoutCreatedByInput>>;
  updateMany?: InputMaybe<Array<HarvestUpdateManyWithWhereWithoutCreatedByInput>>;
  upsert?: InputMaybe<Array<HarvestUpsertWithWhereUniqueWithoutCreatedByInput>>;
};

export type HarvestUpdateManyWithoutPortfolioNestedInput = {
  connect?: InputMaybe<Array<HarvestWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<HarvestCreateOrConnectWithoutPortfolioInput>>;
  create?: InputMaybe<Array<HarvestCreateWithoutPortfolioInput>>;
  createMany?: InputMaybe<HarvestCreateManyPortfolioInputEnvelope>;
  delete?: InputMaybe<Array<HarvestWhereUniqueInput>>;
  deleteMany?: InputMaybe<Array<HarvestScalarWhereInput>>;
  disconnect?: InputMaybe<Array<HarvestWhereUniqueInput>>;
  set?: InputMaybe<Array<HarvestWhereUniqueInput>>;
  update?: InputMaybe<Array<HarvestUpdateWithWhereUniqueWithoutPortfolioInput>>;
  updateMany?: InputMaybe<Array<HarvestUpdateManyWithWhereWithoutPortfolioInput>>;
  upsert?: InputMaybe<Array<HarvestUpsertWithWhereUniqueWithoutPortfolioInput>>;
};

export type HarvestUpdateOneRequiredWithoutHarvestTransactionItemsNestedInput = {
  connect?: InputMaybe<HarvestWhereUniqueInput>;
  connectOrCreate?: InputMaybe<HarvestCreateOrConnectWithoutHarvestTransactionItemsInput>;
  create?: InputMaybe<HarvestCreateWithoutHarvestTransactionItemsInput>;
  update?: InputMaybe<HarvestUpdateToOneWithWhereWithoutHarvestTransactionItemsInput>;
  upsert?: InputMaybe<HarvestUpsertWithoutHarvestTransactionItemsInput>;
};

export type HarvestUpdateOneRequiredWithoutHarvestTransactionsNestedInput = {
  connect?: InputMaybe<HarvestWhereUniqueInput>;
  connectOrCreate?: InputMaybe<HarvestCreateOrConnectWithoutHarvestTransactionsInput>;
  create?: InputMaybe<HarvestCreateWithoutHarvestTransactionsInput>;
  update?: InputMaybe<HarvestUpdateToOneWithWhereWithoutHarvestTransactionsInput>;
  upsert?: InputMaybe<HarvestUpsertWithoutHarvestTransactionsInput>;
};

export type HarvestUpdateToOneWithWhereWithoutHarvestTransactionItemsInput = {
  data: HarvestUpdateWithoutHarvestTransactionItemsInput;
  where?: InputMaybe<HarvestWhereInput>;
};

export type HarvestUpdateToOneWithWhereWithoutHarvestTransactionsInput = {
  data: HarvestUpdateWithoutHarvestTransactionsInput;
  where?: InputMaybe<HarvestWhereInput>;
};

export type HarvestUpdateWithWhereUniqueWithoutCreatedByInput = {
  data: HarvestUpdateWithoutCreatedByInput;
  where: HarvestWhereUniqueInput;
};

export type HarvestUpdateWithWhereUniqueWithoutPortfolioInput = {
  data: HarvestUpdateWithoutPortfolioInput;
  where: HarvestWhereUniqueInput;
};

export type HarvestUpdateWithoutCreatedByInput = {
  afterWashRevertDate?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  amount?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  date?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  harvestTransactionItems?: InputMaybe<HarvestTransactionItemUpdateManyWithoutHarvestNestedInput>;
  harvestTransactions?: InputMaybe<HarvestTransactionUpdateManyWithoutHarvestNestedInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  label?: InputMaybe<StringFieldUpdateOperationsInput>;
  notify?: InputMaybe<BoolFieldUpdateOperationsInput>;
  portfolio?: InputMaybe<PortfolioUpdateOneRequiredWithoutHarvestsNestedInput>;
  recommendationExpiresDate?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  step?: InputMaybe<EnumHarvestStepFieldUpdateOperationsInput>;
  type?: InputMaybe<EnumHarvestTypeFieldUpdateOperationsInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
};

export type HarvestUpdateWithoutHarvestTransactionItemsInput = {
  afterWashRevertDate?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  amount?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  createdBy?: InputMaybe<UserUpdateOneRequiredWithoutHarvestNestedInput>;
  date?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  harvestTransactions?: InputMaybe<HarvestTransactionUpdateManyWithoutHarvestNestedInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  label?: InputMaybe<StringFieldUpdateOperationsInput>;
  notify?: InputMaybe<BoolFieldUpdateOperationsInput>;
  portfolio?: InputMaybe<PortfolioUpdateOneRequiredWithoutHarvestsNestedInput>;
  recommendationExpiresDate?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  step?: InputMaybe<EnumHarvestStepFieldUpdateOperationsInput>;
  type?: InputMaybe<EnumHarvestTypeFieldUpdateOperationsInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
};

export type HarvestUpdateWithoutHarvestTransactionsInput = {
  afterWashRevertDate?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  amount?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  createdBy?: InputMaybe<UserUpdateOneRequiredWithoutHarvestNestedInput>;
  date?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  harvestTransactionItems?: InputMaybe<HarvestTransactionItemUpdateManyWithoutHarvestNestedInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  label?: InputMaybe<StringFieldUpdateOperationsInput>;
  notify?: InputMaybe<BoolFieldUpdateOperationsInput>;
  portfolio?: InputMaybe<PortfolioUpdateOneRequiredWithoutHarvestsNestedInput>;
  recommendationExpiresDate?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  step?: InputMaybe<EnumHarvestStepFieldUpdateOperationsInput>;
  type?: InputMaybe<EnumHarvestTypeFieldUpdateOperationsInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
};

export type HarvestUpdateWithoutPortfolioInput = {
  afterWashRevertDate?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  amount?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  createdBy?: InputMaybe<UserUpdateOneRequiredWithoutHarvestNestedInput>;
  date?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  harvestTransactionItems?: InputMaybe<HarvestTransactionItemUpdateManyWithoutHarvestNestedInput>;
  harvestTransactions?: InputMaybe<HarvestTransactionUpdateManyWithoutHarvestNestedInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  label?: InputMaybe<StringFieldUpdateOperationsInput>;
  notify?: InputMaybe<BoolFieldUpdateOperationsInput>;
  recommendationExpiresDate?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  step?: InputMaybe<EnumHarvestStepFieldUpdateOperationsInput>;
  type?: InputMaybe<EnumHarvestTypeFieldUpdateOperationsInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
};

export type HarvestUpsertWithWhereUniqueWithoutCreatedByInput = {
  create: HarvestCreateWithoutCreatedByInput;
  update: HarvestUpdateWithoutCreatedByInput;
  where: HarvestWhereUniqueInput;
};

export type HarvestUpsertWithWhereUniqueWithoutPortfolioInput = {
  create: HarvestCreateWithoutPortfolioInput;
  update: HarvestUpdateWithoutPortfolioInput;
  where: HarvestWhereUniqueInput;
};

export type HarvestUpsertWithoutHarvestTransactionItemsInput = {
  create: HarvestCreateWithoutHarvestTransactionItemsInput;
  update: HarvestUpdateWithoutHarvestTransactionItemsInput;
  where?: InputMaybe<HarvestWhereInput>;
};

export type HarvestUpsertWithoutHarvestTransactionsInput = {
  create: HarvestCreateWithoutHarvestTransactionsInput;
  update: HarvestUpdateWithoutHarvestTransactionsInput;
  where?: InputMaybe<HarvestWhereInput>;
};

export type HarvestWhereInput = {
  AND?: InputMaybe<Array<HarvestWhereInput>>;
  NOT?: InputMaybe<Array<HarvestWhereInput>>;
  OR?: InputMaybe<Array<HarvestWhereInput>>;
  afterWashRevertDate?: InputMaybe<DateTimeFilter>;
  amount?: InputMaybe<DecimalFilter>;
  createdAt?: InputMaybe<DateTimeFilter>;
  createdBy?: InputMaybe<UserScalarRelationFilter>;
  createdById?: InputMaybe<StringFilter>;
  date?: InputMaybe<DateTimeFilter>;
  harvestTransactionItems?: InputMaybe<HarvestTransactionItemListRelationFilter>;
  harvestTransactions?: InputMaybe<HarvestTransactionListRelationFilter>;
  id?: InputMaybe<UuidFilter>;
  label?: InputMaybe<StringFilter>;
  notify?: InputMaybe<BoolFilter>;
  portfolio?: InputMaybe<PortfolioScalarRelationFilter>;
  portfolioId?: InputMaybe<UuidFilter>;
  recommendationExpiresDate?: InputMaybe<DateTimeFilter>;
  step?: InputMaybe<EnumHarvestStepFilter>;
  type?: InputMaybe<EnumHarvestTypeFilter>;
  updatedAt?: InputMaybe<DateTimeFilter>;
};

export type HarvestWhereUniqueInput = {
  AND?: InputMaybe<Array<HarvestWhereInput>>;
  NOT?: InputMaybe<Array<HarvestWhereInput>>;
  OR?: InputMaybe<Array<HarvestWhereInput>>;
  afterWashRevertDate?: InputMaybe<DateTimeFilter>;
  amount?: InputMaybe<DecimalFilter>;
  createdAt?: InputMaybe<DateTimeFilter>;
  createdBy?: InputMaybe<UserScalarRelationFilter>;
  createdById?: InputMaybe<StringFilter>;
  date?: InputMaybe<DateTimeFilter>;
  harvestTransactionItems?: InputMaybe<HarvestTransactionItemListRelationFilter>;
  harvestTransactions?: InputMaybe<HarvestTransactionListRelationFilter>;
  id?: InputMaybe<Scalars['String']['input']>;
  label?: InputMaybe<StringFilter>;
  notify?: InputMaybe<BoolFilter>;
  portfolio?: InputMaybe<PortfolioScalarRelationFilter>;
  portfolioId?: InputMaybe<UuidFilter>;
  recommendationExpiresDate?: InputMaybe<DateTimeFilter>;
  step?: InputMaybe<EnumHarvestStepFilter>;
  type?: InputMaybe<EnumHarvestTypeFilter>;
  updatedAt?: InputMaybe<DateTimeFilter>;
};

export type InitAccountFileUploadPayload = {
  deferredLoss: Scalars['Float']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  dividend: Scalars['Float']['input'];
  longTerm: Scalars['Float']['input'];
  name: Scalars['String']['input'];
  shortTerm: Scalars['Float']['input'];
};

export type InitFileUploadPayload = {
  displayName: Scalars['String']['input'];
  fileType: FileType;
  gcpFilename: Scalars['String']['input'];
  type: Scalars['String']['input'];
};

export type IntFieldUpdateOperationsInput = {
  decrement?: InputMaybe<Scalars['Int']['input']>;
  divide?: InputMaybe<Scalars['Int']['input']>;
  increment?: InputMaybe<Scalars['Int']['input']>;
  multiply?: InputMaybe<Scalars['Int']['input']>;
  set?: InputMaybe<Scalars['Int']['input']>;
};

export type IntFilter = {
  equals?: InputMaybe<Scalars['Int']['input']>;
  gt?: InputMaybe<Scalars['Int']['input']>;
  gte?: InputMaybe<Scalars['Int']['input']>;
  in?: InputMaybe<Array<Scalars['Int']['input']>>;
  lt?: InputMaybe<Scalars['Int']['input']>;
  lte?: InputMaybe<Scalars['Int']['input']>;
  not?: InputMaybe<NestedIntFilter>;
  notIn?: InputMaybe<Array<Scalars['Int']['input']>>;
};

export type IntNullableFilter = {
  equals?: InputMaybe<Scalars['Int']['input']>;
  gt?: InputMaybe<Scalars['Int']['input']>;
  gte?: InputMaybe<Scalars['Int']['input']>;
  in?: InputMaybe<Array<Scalars['Int']['input']>>;
  lt?: InputMaybe<Scalars['Int']['input']>;
  lte?: InputMaybe<Scalars['Int']['input']>;
  not?: InputMaybe<NestedIntNullableFilter>;
  notIn?: InputMaybe<Array<Scalars['Int']['input']>>;
};

export type JsonFilter = {
  array_contains?: InputMaybe<Scalars['JSON']['input']>;
  array_ends_with?: InputMaybe<Scalars['JSON']['input']>;
  array_starts_with?: InputMaybe<Scalars['JSON']['input']>;
  equals?: InputMaybe<Scalars['JSON']['input']>;
  gt?: InputMaybe<Scalars['JSON']['input']>;
  gte?: InputMaybe<Scalars['JSON']['input']>;
  lt?: InputMaybe<Scalars['JSON']['input']>;
  lte?: InputMaybe<Scalars['JSON']['input']>;
  mode?: InputMaybe<QueryMode>;
  not?: InputMaybe<Scalars['JSON']['input']>;
  path?: InputMaybe<Array<Scalars['String']['input']>>;
  string_contains?: InputMaybe<Scalars['String']['input']>;
  string_ends_with?: InputMaybe<Scalars['String']['input']>;
  string_starts_with?: InputMaybe<Scalars['String']['input']>;
};

export type JsonNullableFilter = {
  array_contains?: InputMaybe<Scalars['JSON']['input']>;
  array_ends_with?: InputMaybe<Scalars['JSON']['input']>;
  array_starts_with?: InputMaybe<Scalars['JSON']['input']>;
  equals?: InputMaybe<Scalars['JSON']['input']>;
  gt?: InputMaybe<Scalars['JSON']['input']>;
  gte?: InputMaybe<Scalars['JSON']['input']>;
  lt?: InputMaybe<Scalars['JSON']['input']>;
  lte?: InputMaybe<Scalars['JSON']['input']>;
  mode?: InputMaybe<QueryMode>;
  not?: InputMaybe<Scalars['JSON']['input']>;
  path?: InputMaybe<Array<Scalars['String']['input']>>;
  string_contains?: InputMaybe<Scalars['String']['input']>;
  string_ends_with?: InputMaybe<Scalars['String']['input']>;
  string_starts_with?: InputMaybe<Scalars['String']['input']>;
};

export type JsonNullableListFilter = {
  equals?: InputMaybe<Array<Scalars['JSON']['input']>>;
  has?: InputMaybe<Scalars['JSON']['input']>;
  hasEvery?: InputMaybe<Array<Scalars['JSON']['input']>>;
  hasSome?: InputMaybe<Array<Scalars['JSON']['input']>>;
  isEmpty?: InputMaybe<Scalars['Boolean']['input']>;
};

export type Log = {
  __typename?: 'Log';
  createdAt: Scalars['DateTime']['output'];
  data: Scalars['JSON']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  portfolio: Portfolio;
  portfolioId: Scalars['String']['output'];
  responseStatus?: Maybe<Scalars['Int']['output']>;
  source?: Maybe<AuthSource>;
  type: LogType;
};

export type LogAvgAggregate = {
  __typename?: 'LogAvgAggregate';
  id?: Maybe<Scalars['Float']['output']>;
  responseStatus?: Maybe<Scalars['Float']['output']>;
};

export type LogCountAggregate = {
  __typename?: 'LogCountAggregate';
  _all: Scalars['Int']['output'];
  createdAt: Scalars['Int']['output'];
  data: Scalars['Int']['output'];
  description: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  portfolioId: Scalars['Int']['output'];
  responseStatus: Scalars['Int']['output'];
  source: Scalars['Int']['output'];
  type: Scalars['Int']['output'];
};

export type LogCreateManyPortfolioInput = {
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  data: Scalars['JSON']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  responseStatus?: InputMaybe<Scalars['Int']['input']>;
  source?: InputMaybe<AuthSource>;
  type: LogType;
};

export type LogCreateManyPortfolioInputEnvelope = {
  data: Array<LogCreateManyPortfolioInput>;
  skipDuplicates?: InputMaybe<Scalars['Boolean']['input']>;
};

export type LogCreateNestedManyWithoutPortfolioInput = {
  connect?: InputMaybe<Array<LogWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<LogCreateOrConnectWithoutPortfolioInput>>;
  create?: InputMaybe<Array<LogCreateWithoutPortfolioInput>>;
  createMany?: InputMaybe<LogCreateManyPortfolioInputEnvelope>;
};

export type LogCreateOrConnectWithoutPortfolioInput = {
  create: LogCreateWithoutPortfolioInput;
  where: LogWhereUniqueInput;
};

export type LogCreateWithoutPortfolioInput = {
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  data: Scalars['JSON']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  responseStatus?: InputMaybe<Scalars['Int']['input']>;
  source?: InputMaybe<AuthSource>;
  type: LogType;
};

export type LogListRelationFilter = {
  every?: InputMaybe<LogWhereInput>;
  none?: InputMaybe<LogWhereInput>;
  some?: InputMaybe<LogWhereInput>;
};

export type LogMaxAggregate = {
  __typename?: 'LogMaxAggregate';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  portfolioId?: Maybe<Scalars['String']['output']>;
  responseStatus?: Maybe<Scalars['Int']['output']>;
  source?: Maybe<AuthSource>;
  type?: Maybe<LogType>;
};

export type LogMinAggregate = {
  __typename?: 'LogMinAggregate';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  portfolioId?: Maybe<Scalars['String']['output']>;
  responseStatus?: Maybe<Scalars['Int']['output']>;
  source?: Maybe<AuthSource>;
  type?: Maybe<LogType>;
};

export type LogOrderByRelationAggregateInput = {
  _count?: InputMaybe<SortOrder>;
};

export type LogScalarWhereInput = {
  AND?: InputMaybe<Array<LogScalarWhereInput>>;
  NOT?: InputMaybe<Array<LogScalarWhereInput>>;
  OR?: InputMaybe<Array<LogScalarWhereInput>>;
  createdAt?: InputMaybe<DateTimeFilter>;
  data?: InputMaybe<JsonFilter>;
  description?: InputMaybe<StringNullableFilter>;
  id?: InputMaybe<IntFilter>;
  portfolioId?: InputMaybe<UuidFilter>;
  responseStatus?: InputMaybe<IntNullableFilter>;
  source?: InputMaybe<EnumAuthSourceNullableFilter>;
  type?: InputMaybe<EnumLogTypeFilter>;
};

export type LogSumAggregate = {
  __typename?: 'LogSumAggregate';
  id?: Maybe<Scalars['Int']['output']>;
  responseStatus?: Maybe<Scalars['Int']['output']>;
};

export enum LogType {
  Auth = 'AUTH',
  ExternalSync = 'EXTERNAL_SYNC',
  PlaidTrxMerge = 'PLAID_TRX_MERGE',
  PlaidTrxMergeError = 'PLAID_TRX_MERGE_ERROR',
  PlaidTrxMergeSuccess = 'PLAID_TRX_MERGE_SUCCESS',
  PlaidWebhook = 'PLAID_WEBHOOK',
  SubsetHybridCalculation = 'SUBSET_HYBRID_CALCULATION'
}

export type LogUpdateManyMutationInput = {
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  data?: InputMaybe<Scalars['JSON']['input']>;
  description?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  responseStatus?: InputMaybe<NullableIntFieldUpdateOperationsInput>;
  source?: InputMaybe<NullableEnumAuthSourceFieldUpdateOperationsInput>;
  type?: InputMaybe<EnumLogTypeFieldUpdateOperationsInput>;
};

export type LogUpdateManyWithWhereWithoutPortfolioInput = {
  data: LogUpdateManyMutationInput;
  where: LogScalarWhereInput;
};

export type LogUpdateManyWithoutPortfolioNestedInput = {
  connect?: InputMaybe<Array<LogWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<LogCreateOrConnectWithoutPortfolioInput>>;
  create?: InputMaybe<Array<LogCreateWithoutPortfolioInput>>;
  createMany?: InputMaybe<LogCreateManyPortfolioInputEnvelope>;
  delete?: InputMaybe<Array<LogWhereUniqueInput>>;
  deleteMany?: InputMaybe<Array<LogScalarWhereInput>>;
  disconnect?: InputMaybe<Array<LogWhereUniqueInput>>;
  set?: InputMaybe<Array<LogWhereUniqueInput>>;
  update?: InputMaybe<Array<LogUpdateWithWhereUniqueWithoutPortfolioInput>>;
  updateMany?: InputMaybe<Array<LogUpdateManyWithWhereWithoutPortfolioInput>>;
  upsert?: InputMaybe<Array<LogUpsertWithWhereUniqueWithoutPortfolioInput>>;
};

export type LogUpdateWithWhereUniqueWithoutPortfolioInput = {
  data: LogUpdateWithoutPortfolioInput;
  where: LogWhereUniqueInput;
};

export type LogUpdateWithoutPortfolioInput = {
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  data?: InputMaybe<Scalars['JSON']['input']>;
  description?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  responseStatus?: InputMaybe<NullableIntFieldUpdateOperationsInput>;
  source?: InputMaybe<NullableEnumAuthSourceFieldUpdateOperationsInput>;
  type?: InputMaybe<EnumLogTypeFieldUpdateOperationsInput>;
};

export type LogUpsertWithWhereUniqueWithoutPortfolioInput = {
  create: LogCreateWithoutPortfolioInput;
  update: LogUpdateWithoutPortfolioInput;
  where: LogWhereUniqueInput;
};

export type LogWhereInput = {
  AND?: InputMaybe<Array<LogWhereInput>>;
  NOT?: InputMaybe<Array<LogWhereInput>>;
  OR?: InputMaybe<Array<LogWhereInput>>;
  createdAt?: InputMaybe<DateTimeFilter>;
  data?: InputMaybe<JsonFilter>;
  description?: InputMaybe<StringNullableFilter>;
  id?: InputMaybe<IntFilter>;
  portfolio?: InputMaybe<PortfolioScalarRelationFilter>;
  portfolioId?: InputMaybe<UuidFilter>;
  responseStatus?: InputMaybe<IntNullableFilter>;
  source?: InputMaybe<EnumAuthSourceNullableFilter>;
  type?: InputMaybe<EnumLogTypeFilter>;
};

export type LogWhereUniqueInput = {
  AND?: InputMaybe<Array<LogWhereInput>>;
  NOT?: InputMaybe<Array<LogWhereInput>>;
  OR?: InputMaybe<Array<LogWhereInput>>;
  createdAt?: InputMaybe<DateTimeFilter>;
  data?: InputMaybe<JsonFilter>;
  description?: InputMaybe<StringNullableFilter>;
  id?: InputMaybe<Scalars['Int']['input']>;
  portfolio?: InputMaybe<PortfolioScalarRelationFilter>;
  portfolioId?: InputMaybe<UuidFilter>;
  responseStatus?: InputMaybe<IntNullableFilter>;
  source?: InputMaybe<EnumAuthSourceNullableFilter>;
  type?: InputMaybe<EnumLogTypeFilter>;
};

export type Lot = {
  __typename?: 'Lot';
  _count: LotCount;
  account: Account;
  accountId: Scalars['String']['output'];
  acquiredDate: Scalars['DateTime']['output'];
  adjPrice?: Maybe<Scalars['Decimal']['output']>;
  asset: Asset;
  assetSymbol: Scalars['String']['output'];
  availableQty?: Maybe<Scalars['Decimal']['output']>;
  commPerShare?: Maybe<Scalars['Decimal']['output']>;
  costTotal?: Maybe<Scalars['Decimal']['output']>;
  createdAt: Scalars['DateTime']['output'];
  exchangeRate?: Maybe<Scalars['Decimal']['output']>;
  excludeFromHarvest: Scalars['Int']['output'];
  /** The unique id in the external system for the lot (positionLotId) */
  externalId?: Maybe<Scalars['String']['output']>;
  feesPerShare?: Maybe<Scalars['Decimal']['output']>;
  file?: Maybe<File>;
  /** The file this lot was created from if it was from ingestion */
  fileId?: Maybe<Scalars['String']['output']>;
  gainDay?: Maybe<Scalars['Decimal']['output']>;
  gainDayPct?: Maybe<Scalars['Decimal']['output']>;
  gainTotal?: Maybe<Scalars['Decimal']['output']>;
  harvestTransactionItems?: Maybe<Array<HarvestTransactionItem>>;
  id: Scalars['ID']['output'];
  legNo?: Maybe<Scalars['Int']['output']>;
  locationCode?: Maybe<Scalars['Int']['output']>;
  lotChangeLog?: Maybe<Array<LotChangeLog>>;
  lotSourceCode?: Maybe<Scalars['Int']['output']>;
  marketValue?: Maybe<Scalars['Decimal']['output']>;
  orderNo?: Maybe<Scalars['Decimal']['output']>;
  originalQty?: Maybe<Scalars['Decimal']['output']>;
  paymentCurrency?: Maybe<Scalars['String']['output']>;
  portfolio: Portfolio;
  portfolioId: Scalars['String']['output'];
  position?: Maybe<Position>;
  positionId?: Maybe<Scalars['String']['output']>;
  /** The price paid per asset unit in the lot (share price paid) */
  price: Scalars['Decimal']['output'];
  /** The quantity of the asset owned in the lot  */
  remainingQty: Scalars['Decimal']['output'];
  settlementCurrency?: Maybe<Scalars['String']['output']>;
  shortType?: Maybe<Scalars['Int']['output']>;
  termCode?: Maybe<Scalars['Int']['output']>;
  totalCostForGainPct?: Maybe<Scalars['Decimal']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};

export type LotAvgAggregate = {
  __typename?: 'LotAvgAggregate';
  adjPrice?: Maybe<Scalars['Decimal']['output']>;
  availableQty?: Maybe<Scalars['Decimal']['output']>;
  commPerShare?: Maybe<Scalars['Decimal']['output']>;
  costTotal?: Maybe<Scalars['Decimal']['output']>;
  exchangeRate?: Maybe<Scalars['Decimal']['output']>;
  excludeFromHarvest?: Maybe<Scalars['Float']['output']>;
  feesPerShare?: Maybe<Scalars['Decimal']['output']>;
  gainDay?: Maybe<Scalars['Decimal']['output']>;
  gainDayPct?: Maybe<Scalars['Decimal']['output']>;
  gainTotal?: Maybe<Scalars['Decimal']['output']>;
  legNo?: Maybe<Scalars['Float']['output']>;
  locationCode?: Maybe<Scalars['Float']['output']>;
  lotSourceCode?: Maybe<Scalars['Float']['output']>;
  marketValue?: Maybe<Scalars['Decimal']['output']>;
  orderNo?: Maybe<Scalars['Decimal']['output']>;
  originalQty?: Maybe<Scalars['Decimal']['output']>;
  price?: Maybe<Scalars['Decimal']['output']>;
  remainingQty?: Maybe<Scalars['Decimal']['output']>;
  shortType?: Maybe<Scalars['Float']['output']>;
  termCode?: Maybe<Scalars['Float']['output']>;
  totalCostForGainPct?: Maybe<Scalars['Decimal']['output']>;
};

export type LotChangeLog = {
  __typename?: 'LotChangeLog';
  accountId: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  lot?: Maybe<Lot>;
  lotAfter?: Maybe<Scalars['JSON']['output']>;
  lotBefore?: Maybe<Scalars['JSON']['output']>;
  lotId?: Maybe<Scalars['String']['output']>;
  lotTransactionBatch: LotTransactionBatch;
  lotTransactionBatchId: Scalars['String']['output'];
  operationType: OperationType;
  portfolio: Portfolio;
  portfolioId: Scalars['String']['output'];
  processed: Scalars['Boolean']['output'];
  quantityChange?: Maybe<Scalars['Decimal']['output']>;
  source?: Maybe<Scalars['String']['output']>;
  transaction?: Maybe<Transaction>;
  transactionId?: Maybe<Scalars['String']['output']>;
};

export type LotChangeLogAvgAggregate = {
  __typename?: 'LotChangeLogAvgAggregate';
  quantityChange?: Maybe<Scalars['Decimal']['output']>;
};

export type LotChangeLogCountAggregate = {
  __typename?: 'LotChangeLogCountAggregate';
  _all: Scalars['Int']['output'];
  accountId: Scalars['Int']['output'];
  createdAt: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  lotAfter: Scalars['Int']['output'];
  lotBefore: Scalars['Int']['output'];
  lotId: Scalars['Int']['output'];
  lotTransactionBatchId: Scalars['Int']['output'];
  operationType: Scalars['Int']['output'];
  portfolioId: Scalars['Int']['output'];
  processed: Scalars['Int']['output'];
  quantityChange: Scalars['Int']['output'];
  source: Scalars['Int']['output'];
  transactionId: Scalars['Int']['output'];
};

export type LotChangeLogCreateManyLotInput = {
  accountId: Scalars['String']['input'];
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  lotAfter?: InputMaybe<Scalars['JSON']['input']>;
  lotBefore?: InputMaybe<Scalars['JSON']['input']>;
  lotTransactionBatchId: Scalars['String']['input'];
  operationType: OperationType;
  portfolioId: Scalars['String']['input'];
  processed?: InputMaybe<Scalars['Boolean']['input']>;
  quantityChange?: InputMaybe<Scalars['Decimal']['input']>;
  source?: InputMaybe<Scalars['String']['input']>;
  transactionId?: InputMaybe<Scalars['String']['input']>;
};

export type LotChangeLogCreateManyLotInputEnvelope = {
  data: Array<LotChangeLogCreateManyLotInput>;
  skipDuplicates?: InputMaybe<Scalars['Boolean']['input']>;
};

export type LotChangeLogCreateManyLotTransactionBatchInput = {
  accountId: Scalars['String']['input'];
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  lotAfter?: InputMaybe<Scalars['JSON']['input']>;
  lotBefore?: InputMaybe<Scalars['JSON']['input']>;
  lotId?: InputMaybe<Scalars['String']['input']>;
  operationType: OperationType;
  portfolioId: Scalars['String']['input'];
  processed?: InputMaybe<Scalars['Boolean']['input']>;
  quantityChange?: InputMaybe<Scalars['Decimal']['input']>;
  source?: InputMaybe<Scalars['String']['input']>;
  transactionId?: InputMaybe<Scalars['String']['input']>;
};

export type LotChangeLogCreateManyLotTransactionBatchInputEnvelope = {
  data: Array<LotChangeLogCreateManyLotTransactionBatchInput>;
  skipDuplicates?: InputMaybe<Scalars['Boolean']['input']>;
};

export type LotChangeLogCreateManyPortfolioInput = {
  accountId: Scalars['String']['input'];
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  lotAfter?: InputMaybe<Scalars['JSON']['input']>;
  lotBefore?: InputMaybe<Scalars['JSON']['input']>;
  lotId?: InputMaybe<Scalars['String']['input']>;
  lotTransactionBatchId: Scalars['String']['input'];
  operationType: OperationType;
  processed?: InputMaybe<Scalars['Boolean']['input']>;
  quantityChange?: InputMaybe<Scalars['Decimal']['input']>;
  source?: InputMaybe<Scalars['String']['input']>;
  transactionId?: InputMaybe<Scalars['String']['input']>;
};

export type LotChangeLogCreateManyPortfolioInputEnvelope = {
  data: Array<LotChangeLogCreateManyPortfolioInput>;
  skipDuplicates?: InputMaybe<Scalars['Boolean']['input']>;
};

export type LotChangeLogCreateManyTransactionInput = {
  accountId: Scalars['String']['input'];
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  lotAfter?: InputMaybe<Scalars['JSON']['input']>;
  lotBefore?: InputMaybe<Scalars['JSON']['input']>;
  lotId?: InputMaybe<Scalars['String']['input']>;
  lotTransactionBatchId: Scalars['String']['input'];
  operationType: OperationType;
  portfolioId: Scalars['String']['input'];
  processed?: InputMaybe<Scalars['Boolean']['input']>;
  quantityChange?: InputMaybe<Scalars['Decimal']['input']>;
  source?: InputMaybe<Scalars['String']['input']>;
};

export type LotChangeLogCreateManyTransactionInputEnvelope = {
  data: Array<LotChangeLogCreateManyTransactionInput>;
  skipDuplicates?: InputMaybe<Scalars['Boolean']['input']>;
};

export type LotChangeLogCreateNestedManyWithoutLotInput = {
  connect?: InputMaybe<Array<LotChangeLogWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<LotChangeLogCreateOrConnectWithoutLotInput>>;
  create?: InputMaybe<Array<LotChangeLogCreateWithoutLotInput>>;
  createMany?: InputMaybe<LotChangeLogCreateManyLotInputEnvelope>;
};

export type LotChangeLogCreateNestedManyWithoutLotTransactionBatchInput = {
  connect?: InputMaybe<Array<LotChangeLogWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<LotChangeLogCreateOrConnectWithoutLotTransactionBatchInput>>;
  create?: InputMaybe<Array<LotChangeLogCreateWithoutLotTransactionBatchInput>>;
  createMany?: InputMaybe<LotChangeLogCreateManyLotTransactionBatchInputEnvelope>;
};

export type LotChangeLogCreateNestedManyWithoutPortfolioInput = {
  connect?: InputMaybe<Array<LotChangeLogWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<LotChangeLogCreateOrConnectWithoutPortfolioInput>>;
  create?: InputMaybe<Array<LotChangeLogCreateWithoutPortfolioInput>>;
  createMany?: InputMaybe<LotChangeLogCreateManyPortfolioInputEnvelope>;
};

export type LotChangeLogCreateNestedManyWithoutTransactionInput = {
  connect?: InputMaybe<Array<LotChangeLogWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<LotChangeLogCreateOrConnectWithoutTransactionInput>>;
  create?: InputMaybe<Array<LotChangeLogCreateWithoutTransactionInput>>;
  createMany?: InputMaybe<LotChangeLogCreateManyTransactionInputEnvelope>;
};

export type LotChangeLogCreateOrConnectWithoutLotInput = {
  create: LotChangeLogCreateWithoutLotInput;
  where: LotChangeLogWhereUniqueInput;
};

export type LotChangeLogCreateOrConnectWithoutLotTransactionBatchInput = {
  create: LotChangeLogCreateWithoutLotTransactionBatchInput;
  where: LotChangeLogWhereUniqueInput;
};

export type LotChangeLogCreateOrConnectWithoutPortfolioInput = {
  create: LotChangeLogCreateWithoutPortfolioInput;
  where: LotChangeLogWhereUniqueInput;
};

export type LotChangeLogCreateOrConnectWithoutTransactionInput = {
  create: LotChangeLogCreateWithoutTransactionInput;
  where: LotChangeLogWhereUniqueInput;
};

export type LotChangeLogCreateWithoutLotInput = {
  accountId: Scalars['String']['input'];
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  lotAfter?: InputMaybe<Scalars['JSON']['input']>;
  lotBefore?: InputMaybe<Scalars['JSON']['input']>;
  lotTransactionBatch: LotTransactionBatchCreateNestedOneWithoutLotChangeLogInput;
  operationType: OperationType;
  portfolio: PortfolioCreateNestedOneWithoutLotChangeLogInput;
  processed?: InputMaybe<Scalars['Boolean']['input']>;
  quantityChange?: InputMaybe<Scalars['Decimal']['input']>;
  source?: InputMaybe<Scalars['String']['input']>;
  transaction?: InputMaybe<TransactionCreateNestedOneWithoutLotChangeLogInput>;
};

export type LotChangeLogCreateWithoutLotTransactionBatchInput = {
  accountId: Scalars['String']['input'];
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  lot?: InputMaybe<LotCreateNestedOneWithoutLotChangeLogInput>;
  lotAfter?: InputMaybe<Scalars['JSON']['input']>;
  lotBefore?: InputMaybe<Scalars['JSON']['input']>;
  operationType: OperationType;
  portfolio: PortfolioCreateNestedOneWithoutLotChangeLogInput;
  processed?: InputMaybe<Scalars['Boolean']['input']>;
  quantityChange?: InputMaybe<Scalars['Decimal']['input']>;
  source?: InputMaybe<Scalars['String']['input']>;
  transaction?: InputMaybe<TransactionCreateNestedOneWithoutLotChangeLogInput>;
};

export type LotChangeLogCreateWithoutPortfolioInput = {
  accountId: Scalars['String']['input'];
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  lot?: InputMaybe<LotCreateNestedOneWithoutLotChangeLogInput>;
  lotAfter?: InputMaybe<Scalars['JSON']['input']>;
  lotBefore?: InputMaybe<Scalars['JSON']['input']>;
  lotTransactionBatch: LotTransactionBatchCreateNestedOneWithoutLotChangeLogInput;
  operationType: OperationType;
  processed?: InputMaybe<Scalars['Boolean']['input']>;
  quantityChange?: InputMaybe<Scalars['Decimal']['input']>;
  source?: InputMaybe<Scalars['String']['input']>;
  transaction?: InputMaybe<TransactionCreateNestedOneWithoutLotChangeLogInput>;
};

export type LotChangeLogCreateWithoutTransactionInput = {
  accountId: Scalars['String']['input'];
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  lot?: InputMaybe<LotCreateNestedOneWithoutLotChangeLogInput>;
  lotAfter?: InputMaybe<Scalars['JSON']['input']>;
  lotBefore?: InputMaybe<Scalars['JSON']['input']>;
  lotTransactionBatch: LotTransactionBatchCreateNestedOneWithoutLotChangeLogInput;
  operationType: OperationType;
  portfolio: PortfolioCreateNestedOneWithoutLotChangeLogInput;
  processed?: InputMaybe<Scalars['Boolean']['input']>;
  quantityChange?: InputMaybe<Scalars['Decimal']['input']>;
  source?: InputMaybe<Scalars['String']['input']>;
};

export type LotChangeLogListRelationFilter = {
  every?: InputMaybe<LotChangeLogWhereInput>;
  none?: InputMaybe<LotChangeLogWhereInput>;
  some?: InputMaybe<LotChangeLogWhereInput>;
};

export type LotChangeLogMaxAggregate = {
  __typename?: 'LotChangeLogMaxAggregate';
  accountId?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  lotId?: Maybe<Scalars['String']['output']>;
  lotTransactionBatchId?: Maybe<Scalars['String']['output']>;
  operationType?: Maybe<OperationType>;
  portfolioId?: Maybe<Scalars['String']['output']>;
  processed?: Maybe<Scalars['Boolean']['output']>;
  quantityChange?: Maybe<Scalars['Decimal']['output']>;
  source?: Maybe<Scalars['String']['output']>;
  transactionId?: Maybe<Scalars['String']['output']>;
};

export type LotChangeLogMinAggregate = {
  __typename?: 'LotChangeLogMinAggregate';
  accountId?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  lotId?: Maybe<Scalars['String']['output']>;
  lotTransactionBatchId?: Maybe<Scalars['String']['output']>;
  operationType?: Maybe<OperationType>;
  portfolioId?: Maybe<Scalars['String']['output']>;
  processed?: Maybe<Scalars['Boolean']['output']>;
  quantityChange?: Maybe<Scalars['Decimal']['output']>;
  source?: Maybe<Scalars['String']['output']>;
  transactionId?: Maybe<Scalars['String']['output']>;
};

export type LotChangeLogScalarWhereInput = {
  AND?: InputMaybe<Array<LotChangeLogScalarWhereInput>>;
  NOT?: InputMaybe<Array<LotChangeLogScalarWhereInput>>;
  OR?: InputMaybe<Array<LotChangeLogScalarWhereInput>>;
  accountId?: InputMaybe<UuidFilter>;
  createdAt?: InputMaybe<DateTimeFilter>;
  id?: InputMaybe<StringFilter>;
  lotAfter?: InputMaybe<JsonNullableFilter>;
  lotBefore?: InputMaybe<JsonNullableFilter>;
  lotId?: InputMaybe<UuidNullableFilter>;
  lotTransactionBatchId?: InputMaybe<UuidFilter>;
  operationType?: InputMaybe<EnumOperationTypeFilter>;
  portfolioId?: InputMaybe<UuidFilter>;
  processed?: InputMaybe<BoolFilter>;
  quantityChange?: InputMaybe<DecimalNullableFilter>;
  source?: InputMaybe<StringNullableFilter>;
  transactionId?: InputMaybe<UuidNullableFilter>;
};

export type LotChangeLogSumAggregate = {
  __typename?: 'LotChangeLogSumAggregate';
  quantityChange?: Maybe<Scalars['Decimal']['output']>;
};

export type LotChangeLogUpdateManyMutationInput = {
  accountId?: InputMaybe<StringFieldUpdateOperationsInput>;
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  lotAfter?: InputMaybe<Scalars['JSON']['input']>;
  lotBefore?: InputMaybe<Scalars['JSON']['input']>;
  operationType?: InputMaybe<EnumOperationTypeFieldUpdateOperationsInput>;
  processed?: InputMaybe<BoolFieldUpdateOperationsInput>;
  quantityChange?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  source?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
};

export type LotChangeLogUpdateManyWithWhereWithoutLotInput = {
  data: LotChangeLogUpdateManyMutationInput;
  where: LotChangeLogScalarWhereInput;
};

export type LotChangeLogUpdateManyWithWhereWithoutLotTransactionBatchInput = {
  data: LotChangeLogUpdateManyMutationInput;
  where: LotChangeLogScalarWhereInput;
};

export type LotChangeLogUpdateManyWithWhereWithoutPortfolioInput = {
  data: LotChangeLogUpdateManyMutationInput;
  where: LotChangeLogScalarWhereInput;
};

export type LotChangeLogUpdateManyWithWhereWithoutTransactionInput = {
  data: LotChangeLogUpdateManyMutationInput;
  where: LotChangeLogScalarWhereInput;
};

export type LotChangeLogUpdateManyWithoutLotNestedInput = {
  connect?: InputMaybe<Array<LotChangeLogWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<LotChangeLogCreateOrConnectWithoutLotInput>>;
  create?: InputMaybe<Array<LotChangeLogCreateWithoutLotInput>>;
  createMany?: InputMaybe<LotChangeLogCreateManyLotInputEnvelope>;
  delete?: InputMaybe<Array<LotChangeLogWhereUniqueInput>>;
  deleteMany?: InputMaybe<Array<LotChangeLogScalarWhereInput>>;
  disconnect?: InputMaybe<Array<LotChangeLogWhereUniqueInput>>;
  set?: InputMaybe<Array<LotChangeLogWhereUniqueInput>>;
  update?: InputMaybe<Array<LotChangeLogUpdateWithWhereUniqueWithoutLotInput>>;
  updateMany?: InputMaybe<Array<LotChangeLogUpdateManyWithWhereWithoutLotInput>>;
  upsert?: InputMaybe<Array<LotChangeLogUpsertWithWhereUniqueWithoutLotInput>>;
};

export type LotChangeLogUpdateManyWithoutLotTransactionBatchNestedInput = {
  connect?: InputMaybe<Array<LotChangeLogWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<LotChangeLogCreateOrConnectWithoutLotTransactionBatchInput>>;
  create?: InputMaybe<Array<LotChangeLogCreateWithoutLotTransactionBatchInput>>;
  createMany?: InputMaybe<LotChangeLogCreateManyLotTransactionBatchInputEnvelope>;
  delete?: InputMaybe<Array<LotChangeLogWhereUniqueInput>>;
  deleteMany?: InputMaybe<Array<LotChangeLogScalarWhereInput>>;
  disconnect?: InputMaybe<Array<LotChangeLogWhereUniqueInput>>;
  set?: InputMaybe<Array<LotChangeLogWhereUniqueInput>>;
  update?: InputMaybe<Array<LotChangeLogUpdateWithWhereUniqueWithoutLotTransactionBatchInput>>;
  updateMany?: InputMaybe<Array<LotChangeLogUpdateManyWithWhereWithoutLotTransactionBatchInput>>;
  upsert?: InputMaybe<Array<LotChangeLogUpsertWithWhereUniqueWithoutLotTransactionBatchInput>>;
};

export type LotChangeLogUpdateManyWithoutPortfolioNestedInput = {
  connect?: InputMaybe<Array<LotChangeLogWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<LotChangeLogCreateOrConnectWithoutPortfolioInput>>;
  create?: InputMaybe<Array<LotChangeLogCreateWithoutPortfolioInput>>;
  createMany?: InputMaybe<LotChangeLogCreateManyPortfolioInputEnvelope>;
  delete?: InputMaybe<Array<LotChangeLogWhereUniqueInput>>;
  deleteMany?: InputMaybe<Array<LotChangeLogScalarWhereInput>>;
  disconnect?: InputMaybe<Array<LotChangeLogWhereUniqueInput>>;
  set?: InputMaybe<Array<LotChangeLogWhereUniqueInput>>;
  update?: InputMaybe<Array<LotChangeLogUpdateWithWhereUniqueWithoutPortfolioInput>>;
  updateMany?: InputMaybe<Array<LotChangeLogUpdateManyWithWhereWithoutPortfolioInput>>;
  upsert?: InputMaybe<Array<LotChangeLogUpsertWithWhereUniqueWithoutPortfolioInput>>;
};

export type LotChangeLogUpdateManyWithoutTransactionNestedInput = {
  connect?: InputMaybe<Array<LotChangeLogWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<LotChangeLogCreateOrConnectWithoutTransactionInput>>;
  create?: InputMaybe<Array<LotChangeLogCreateWithoutTransactionInput>>;
  createMany?: InputMaybe<LotChangeLogCreateManyTransactionInputEnvelope>;
  delete?: InputMaybe<Array<LotChangeLogWhereUniqueInput>>;
  deleteMany?: InputMaybe<Array<LotChangeLogScalarWhereInput>>;
  disconnect?: InputMaybe<Array<LotChangeLogWhereUniqueInput>>;
  set?: InputMaybe<Array<LotChangeLogWhereUniqueInput>>;
  update?: InputMaybe<Array<LotChangeLogUpdateWithWhereUniqueWithoutTransactionInput>>;
  updateMany?: InputMaybe<Array<LotChangeLogUpdateManyWithWhereWithoutTransactionInput>>;
  upsert?: InputMaybe<Array<LotChangeLogUpsertWithWhereUniqueWithoutTransactionInput>>;
};

export type LotChangeLogUpdateWithWhereUniqueWithoutLotInput = {
  data: LotChangeLogUpdateWithoutLotInput;
  where: LotChangeLogWhereUniqueInput;
};

export type LotChangeLogUpdateWithWhereUniqueWithoutLotTransactionBatchInput = {
  data: LotChangeLogUpdateWithoutLotTransactionBatchInput;
  where: LotChangeLogWhereUniqueInput;
};

export type LotChangeLogUpdateWithWhereUniqueWithoutPortfolioInput = {
  data: LotChangeLogUpdateWithoutPortfolioInput;
  where: LotChangeLogWhereUniqueInput;
};

export type LotChangeLogUpdateWithWhereUniqueWithoutTransactionInput = {
  data: LotChangeLogUpdateWithoutTransactionInput;
  where: LotChangeLogWhereUniqueInput;
};

export type LotChangeLogUpdateWithoutLotInput = {
  accountId?: InputMaybe<StringFieldUpdateOperationsInput>;
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  lotAfter?: InputMaybe<Scalars['JSON']['input']>;
  lotBefore?: InputMaybe<Scalars['JSON']['input']>;
  lotTransactionBatch?: InputMaybe<LotTransactionBatchUpdateOneRequiredWithoutLotChangeLogNestedInput>;
  operationType?: InputMaybe<EnumOperationTypeFieldUpdateOperationsInput>;
  portfolio?: InputMaybe<PortfolioUpdateOneRequiredWithoutLotChangeLogNestedInput>;
  processed?: InputMaybe<BoolFieldUpdateOperationsInput>;
  quantityChange?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  source?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  transaction?: InputMaybe<TransactionUpdateOneWithoutLotChangeLogNestedInput>;
};

export type LotChangeLogUpdateWithoutLotTransactionBatchInput = {
  accountId?: InputMaybe<StringFieldUpdateOperationsInput>;
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  lot?: InputMaybe<LotUpdateOneWithoutLotChangeLogNestedInput>;
  lotAfter?: InputMaybe<Scalars['JSON']['input']>;
  lotBefore?: InputMaybe<Scalars['JSON']['input']>;
  operationType?: InputMaybe<EnumOperationTypeFieldUpdateOperationsInput>;
  portfolio?: InputMaybe<PortfolioUpdateOneRequiredWithoutLotChangeLogNestedInput>;
  processed?: InputMaybe<BoolFieldUpdateOperationsInput>;
  quantityChange?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  source?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  transaction?: InputMaybe<TransactionUpdateOneWithoutLotChangeLogNestedInput>;
};

export type LotChangeLogUpdateWithoutPortfolioInput = {
  accountId?: InputMaybe<StringFieldUpdateOperationsInput>;
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  lot?: InputMaybe<LotUpdateOneWithoutLotChangeLogNestedInput>;
  lotAfter?: InputMaybe<Scalars['JSON']['input']>;
  lotBefore?: InputMaybe<Scalars['JSON']['input']>;
  lotTransactionBatch?: InputMaybe<LotTransactionBatchUpdateOneRequiredWithoutLotChangeLogNestedInput>;
  operationType?: InputMaybe<EnumOperationTypeFieldUpdateOperationsInput>;
  processed?: InputMaybe<BoolFieldUpdateOperationsInput>;
  quantityChange?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  source?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  transaction?: InputMaybe<TransactionUpdateOneWithoutLotChangeLogNestedInput>;
};

export type LotChangeLogUpdateWithoutTransactionInput = {
  accountId?: InputMaybe<StringFieldUpdateOperationsInput>;
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  lot?: InputMaybe<LotUpdateOneWithoutLotChangeLogNestedInput>;
  lotAfter?: InputMaybe<Scalars['JSON']['input']>;
  lotBefore?: InputMaybe<Scalars['JSON']['input']>;
  lotTransactionBatch?: InputMaybe<LotTransactionBatchUpdateOneRequiredWithoutLotChangeLogNestedInput>;
  operationType?: InputMaybe<EnumOperationTypeFieldUpdateOperationsInput>;
  portfolio?: InputMaybe<PortfolioUpdateOneRequiredWithoutLotChangeLogNestedInput>;
  processed?: InputMaybe<BoolFieldUpdateOperationsInput>;
  quantityChange?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  source?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
};

export type LotChangeLogUpsertWithWhereUniqueWithoutLotInput = {
  create: LotChangeLogCreateWithoutLotInput;
  update: LotChangeLogUpdateWithoutLotInput;
  where: LotChangeLogWhereUniqueInput;
};

export type LotChangeLogUpsertWithWhereUniqueWithoutLotTransactionBatchInput = {
  create: LotChangeLogCreateWithoutLotTransactionBatchInput;
  update: LotChangeLogUpdateWithoutLotTransactionBatchInput;
  where: LotChangeLogWhereUniqueInput;
};

export type LotChangeLogUpsertWithWhereUniqueWithoutPortfolioInput = {
  create: LotChangeLogCreateWithoutPortfolioInput;
  update: LotChangeLogUpdateWithoutPortfolioInput;
  where: LotChangeLogWhereUniqueInput;
};

export type LotChangeLogUpsertWithWhereUniqueWithoutTransactionInput = {
  create: LotChangeLogCreateWithoutTransactionInput;
  update: LotChangeLogUpdateWithoutTransactionInput;
  where: LotChangeLogWhereUniqueInput;
};

export type LotChangeLogWhereInput = {
  AND?: InputMaybe<Array<LotChangeLogWhereInput>>;
  NOT?: InputMaybe<Array<LotChangeLogWhereInput>>;
  OR?: InputMaybe<Array<LotChangeLogWhereInput>>;
  accountId?: InputMaybe<UuidFilter>;
  createdAt?: InputMaybe<DateTimeFilter>;
  id?: InputMaybe<StringFilter>;
  lot?: InputMaybe<LotNullableScalarRelationFilter>;
  lotAfter?: InputMaybe<JsonNullableFilter>;
  lotBefore?: InputMaybe<JsonNullableFilter>;
  lotId?: InputMaybe<UuidNullableFilter>;
  lotTransactionBatch?: InputMaybe<LotTransactionBatchScalarRelationFilter>;
  lotTransactionBatchId?: InputMaybe<UuidFilter>;
  operationType?: InputMaybe<EnumOperationTypeFilter>;
  portfolio?: InputMaybe<PortfolioScalarRelationFilter>;
  portfolioId?: InputMaybe<UuidFilter>;
  processed?: InputMaybe<BoolFilter>;
  quantityChange?: InputMaybe<DecimalNullableFilter>;
  source?: InputMaybe<StringNullableFilter>;
  transaction?: InputMaybe<TransactionNullableScalarRelationFilter>;
  transactionId?: InputMaybe<UuidNullableFilter>;
};

export type LotChangeLogWhereUniqueInput = {
  AND?: InputMaybe<Array<LotChangeLogWhereInput>>;
  NOT?: InputMaybe<Array<LotChangeLogWhereInput>>;
  OR?: InputMaybe<Array<LotChangeLogWhereInput>>;
  accountId?: InputMaybe<UuidFilter>;
  createdAt?: InputMaybe<DateTimeFilter>;
  id?: InputMaybe<Scalars['String']['input']>;
  lot?: InputMaybe<LotNullableScalarRelationFilter>;
  lotAfter?: InputMaybe<JsonNullableFilter>;
  lotBefore?: InputMaybe<JsonNullableFilter>;
  lotId?: InputMaybe<UuidNullableFilter>;
  lotTransactionBatch?: InputMaybe<LotTransactionBatchScalarRelationFilter>;
  lotTransactionBatchId?: InputMaybe<UuidFilter>;
  operationType?: InputMaybe<EnumOperationTypeFilter>;
  portfolio?: InputMaybe<PortfolioScalarRelationFilter>;
  portfolioId?: InputMaybe<UuidFilter>;
  processed?: InputMaybe<BoolFilter>;
  quantityChange?: InputMaybe<DecimalNullableFilter>;
  source?: InputMaybe<StringNullableFilter>;
  transaction?: InputMaybe<TransactionNullableScalarRelationFilter>;
  transactionId?: InputMaybe<UuidNullableFilter>;
};

export type LotCount = {
  __typename?: 'LotCount';
  harvestTransactionItems: Scalars['Int']['output'];
  lotChangeLog: Scalars['Int']['output'];
};

export type LotCountAggregate = {
  __typename?: 'LotCountAggregate';
  _all: Scalars['Int']['output'];
  accountId: Scalars['Int']['output'];
  acquiredDate: Scalars['Int']['output'];
  adjPrice: Scalars['Int']['output'];
  assetSymbol: Scalars['Int']['output'];
  availableQty: Scalars['Int']['output'];
  commPerShare: Scalars['Int']['output'];
  costTotal: Scalars['Int']['output'];
  createdAt: Scalars['Int']['output'];
  exchangeRate: Scalars['Int']['output'];
  excludeFromHarvest: Scalars['Int']['output'];
  externalId: Scalars['Int']['output'];
  feesPerShare: Scalars['Int']['output'];
  fileId: Scalars['Int']['output'];
  gainDay: Scalars['Int']['output'];
  gainDayPct: Scalars['Int']['output'];
  gainTotal: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  legNo: Scalars['Int']['output'];
  locationCode: Scalars['Int']['output'];
  lotSourceCode: Scalars['Int']['output'];
  marketValue: Scalars['Int']['output'];
  orderNo: Scalars['Int']['output'];
  originalQty: Scalars['Int']['output'];
  paymentCurrency: Scalars['Int']['output'];
  portfolioId: Scalars['Int']['output'];
  positionId: Scalars['Int']['output'];
  price: Scalars['Int']['output'];
  remainingQty: Scalars['Int']['output'];
  settlementCurrency: Scalars['Int']['output'];
  shortType: Scalars['Int']['output'];
  termCode: Scalars['Int']['output'];
  totalCostForGainPct: Scalars['Int']['output'];
  updatedAt: Scalars['Int']['output'];
};

export type LotCreateManyAccountInput = {
  acquiredDate: Scalars['DateTime']['input'];
  adjPrice?: InputMaybe<Scalars['Decimal']['input']>;
  assetSymbol: Scalars['String']['input'];
  availableQty?: InputMaybe<Scalars['Decimal']['input']>;
  commPerShare?: InputMaybe<Scalars['Decimal']['input']>;
  costTotal?: InputMaybe<Scalars['Decimal']['input']>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  exchangeRate?: InputMaybe<Scalars['Decimal']['input']>;
  excludeFromHarvest?: InputMaybe<Scalars['Int']['input']>;
  externalId?: InputMaybe<Scalars['String']['input']>;
  feesPerShare?: InputMaybe<Scalars['Decimal']['input']>;
  fileId?: InputMaybe<Scalars['String']['input']>;
  gainDay?: InputMaybe<Scalars['Decimal']['input']>;
  gainDayPct?: InputMaybe<Scalars['Decimal']['input']>;
  gainTotal?: InputMaybe<Scalars['Decimal']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  legNo?: InputMaybe<Scalars['Int']['input']>;
  locationCode?: InputMaybe<Scalars['Int']['input']>;
  lotSourceCode?: InputMaybe<Scalars['Int']['input']>;
  marketValue?: InputMaybe<Scalars['Decimal']['input']>;
  orderNo?: InputMaybe<Scalars['Decimal']['input']>;
  originalQty?: InputMaybe<Scalars['Decimal']['input']>;
  paymentCurrency?: InputMaybe<Scalars['String']['input']>;
  portfolioId: Scalars['String']['input'];
  positionId?: InputMaybe<Scalars['String']['input']>;
  price: Scalars['Decimal']['input'];
  remainingQty: Scalars['Decimal']['input'];
  settlementCurrency?: InputMaybe<Scalars['String']['input']>;
  shortType?: InputMaybe<Scalars['Int']['input']>;
  termCode?: InputMaybe<Scalars['Int']['input']>;
  totalCostForGainPct?: InputMaybe<Scalars['Decimal']['input']>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type LotCreateManyAccountInputEnvelope = {
  data: Array<LotCreateManyAccountInput>;
  skipDuplicates?: InputMaybe<Scalars['Boolean']['input']>;
};

export type LotCreateManyAssetInput = {
  accountId: Scalars['String']['input'];
  acquiredDate: Scalars['DateTime']['input'];
  adjPrice?: InputMaybe<Scalars['Decimal']['input']>;
  availableQty?: InputMaybe<Scalars['Decimal']['input']>;
  commPerShare?: InputMaybe<Scalars['Decimal']['input']>;
  costTotal?: InputMaybe<Scalars['Decimal']['input']>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  exchangeRate?: InputMaybe<Scalars['Decimal']['input']>;
  excludeFromHarvest?: InputMaybe<Scalars['Int']['input']>;
  externalId?: InputMaybe<Scalars['String']['input']>;
  feesPerShare?: InputMaybe<Scalars['Decimal']['input']>;
  fileId?: InputMaybe<Scalars['String']['input']>;
  gainDay?: InputMaybe<Scalars['Decimal']['input']>;
  gainDayPct?: InputMaybe<Scalars['Decimal']['input']>;
  gainTotal?: InputMaybe<Scalars['Decimal']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  legNo?: InputMaybe<Scalars['Int']['input']>;
  locationCode?: InputMaybe<Scalars['Int']['input']>;
  lotSourceCode?: InputMaybe<Scalars['Int']['input']>;
  marketValue?: InputMaybe<Scalars['Decimal']['input']>;
  orderNo?: InputMaybe<Scalars['Decimal']['input']>;
  originalQty?: InputMaybe<Scalars['Decimal']['input']>;
  paymentCurrency?: InputMaybe<Scalars['String']['input']>;
  portfolioId: Scalars['String']['input'];
  positionId?: InputMaybe<Scalars['String']['input']>;
  price: Scalars['Decimal']['input'];
  remainingQty: Scalars['Decimal']['input'];
  settlementCurrency?: InputMaybe<Scalars['String']['input']>;
  shortType?: InputMaybe<Scalars['Int']['input']>;
  termCode?: InputMaybe<Scalars['Int']['input']>;
  totalCostForGainPct?: InputMaybe<Scalars['Decimal']['input']>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type LotCreateManyAssetInputEnvelope = {
  data: Array<LotCreateManyAssetInput>;
  skipDuplicates?: InputMaybe<Scalars['Boolean']['input']>;
};

export type LotCreateManyFileInput = {
  accountId: Scalars['String']['input'];
  acquiredDate: Scalars['DateTime']['input'];
  adjPrice?: InputMaybe<Scalars['Decimal']['input']>;
  assetSymbol: Scalars['String']['input'];
  availableQty?: InputMaybe<Scalars['Decimal']['input']>;
  commPerShare?: InputMaybe<Scalars['Decimal']['input']>;
  costTotal?: InputMaybe<Scalars['Decimal']['input']>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  exchangeRate?: InputMaybe<Scalars['Decimal']['input']>;
  excludeFromHarvest?: InputMaybe<Scalars['Int']['input']>;
  externalId?: InputMaybe<Scalars['String']['input']>;
  feesPerShare?: InputMaybe<Scalars['Decimal']['input']>;
  gainDay?: InputMaybe<Scalars['Decimal']['input']>;
  gainDayPct?: InputMaybe<Scalars['Decimal']['input']>;
  gainTotal?: InputMaybe<Scalars['Decimal']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  legNo?: InputMaybe<Scalars['Int']['input']>;
  locationCode?: InputMaybe<Scalars['Int']['input']>;
  lotSourceCode?: InputMaybe<Scalars['Int']['input']>;
  marketValue?: InputMaybe<Scalars['Decimal']['input']>;
  orderNo?: InputMaybe<Scalars['Decimal']['input']>;
  originalQty?: InputMaybe<Scalars['Decimal']['input']>;
  paymentCurrency?: InputMaybe<Scalars['String']['input']>;
  portfolioId: Scalars['String']['input'];
  positionId?: InputMaybe<Scalars['String']['input']>;
  price: Scalars['Decimal']['input'];
  remainingQty: Scalars['Decimal']['input'];
  settlementCurrency?: InputMaybe<Scalars['String']['input']>;
  shortType?: InputMaybe<Scalars['Int']['input']>;
  termCode?: InputMaybe<Scalars['Int']['input']>;
  totalCostForGainPct?: InputMaybe<Scalars['Decimal']['input']>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type LotCreateManyFileInputEnvelope = {
  data: Array<LotCreateManyFileInput>;
  skipDuplicates?: InputMaybe<Scalars['Boolean']['input']>;
};

export type LotCreateManyPortfolioInput = {
  accountId: Scalars['String']['input'];
  acquiredDate: Scalars['DateTime']['input'];
  adjPrice?: InputMaybe<Scalars['Decimal']['input']>;
  assetSymbol: Scalars['String']['input'];
  availableQty?: InputMaybe<Scalars['Decimal']['input']>;
  commPerShare?: InputMaybe<Scalars['Decimal']['input']>;
  costTotal?: InputMaybe<Scalars['Decimal']['input']>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  exchangeRate?: InputMaybe<Scalars['Decimal']['input']>;
  excludeFromHarvest?: InputMaybe<Scalars['Int']['input']>;
  externalId?: InputMaybe<Scalars['String']['input']>;
  feesPerShare?: InputMaybe<Scalars['Decimal']['input']>;
  fileId?: InputMaybe<Scalars['String']['input']>;
  gainDay?: InputMaybe<Scalars['Decimal']['input']>;
  gainDayPct?: InputMaybe<Scalars['Decimal']['input']>;
  gainTotal?: InputMaybe<Scalars['Decimal']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  legNo?: InputMaybe<Scalars['Int']['input']>;
  locationCode?: InputMaybe<Scalars['Int']['input']>;
  lotSourceCode?: InputMaybe<Scalars['Int']['input']>;
  marketValue?: InputMaybe<Scalars['Decimal']['input']>;
  orderNo?: InputMaybe<Scalars['Decimal']['input']>;
  originalQty?: InputMaybe<Scalars['Decimal']['input']>;
  paymentCurrency?: InputMaybe<Scalars['String']['input']>;
  positionId?: InputMaybe<Scalars['String']['input']>;
  price: Scalars['Decimal']['input'];
  remainingQty: Scalars['Decimal']['input'];
  settlementCurrency?: InputMaybe<Scalars['String']['input']>;
  shortType?: InputMaybe<Scalars['Int']['input']>;
  termCode?: InputMaybe<Scalars['Int']['input']>;
  totalCostForGainPct?: InputMaybe<Scalars['Decimal']['input']>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type LotCreateManyPortfolioInputEnvelope = {
  data: Array<LotCreateManyPortfolioInput>;
  skipDuplicates?: InputMaybe<Scalars['Boolean']['input']>;
};

export type LotCreateManyPositionInput = {
  accountId: Scalars['String']['input'];
  acquiredDate: Scalars['DateTime']['input'];
  adjPrice?: InputMaybe<Scalars['Decimal']['input']>;
  assetSymbol: Scalars['String']['input'];
  availableQty?: InputMaybe<Scalars['Decimal']['input']>;
  commPerShare?: InputMaybe<Scalars['Decimal']['input']>;
  costTotal?: InputMaybe<Scalars['Decimal']['input']>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  exchangeRate?: InputMaybe<Scalars['Decimal']['input']>;
  excludeFromHarvest?: InputMaybe<Scalars['Int']['input']>;
  externalId?: InputMaybe<Scalars['String']['input']>;
  feesPerShare?: InputMaybe<Scalars['Decimal']['input']>;
  fileId?: InputMaybe<Scalars['String']['input']>;
  gainDay?: InputMaybe<Scalars['Decimal']['input']>;
  gainDayPct?: InputMaybe<Scalars['Decimal']['input']>;
  gainTotal?: InputMaybe<Scalars['Decimal']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  legNo?: InputMaybe<Scalars['Int']['input']>;
  locationCode?: InputMaybe<Scalars['Int']['input']>;
  lotSourceCode?: InputMaybe<Scalars['Int']['input']>;
  marketValue?: InputMaybe<Scalars['Decimal']['input']>;
  orderNo?: InputMaybe<Scalars['Decimal']['input']>;
  originalQty?: InputMaybe<Scalars['Decimal']['input']>;
  paymentCurrency?: InputMaybe<Scalars['String']['input']>;
  portfolioId: Scalars['String']['input'];
  price: Scalars['Decimal']['input'];
  remainingQty: Scalars['Decimal']['input'];
  settlementCurrency?: InputMaybe<Scalars['String']['input']>;
  shortType?: InputMaybe<Scalars['Int']['input']>;
  termCode?: InputMaybe<Scalars['Int']['input']>;
  totalCostForGainPct?: InputMaybe<Scalars['Decimal']['input']>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type LotCreateManyPositionInputEnvelope = {
  data: Array<LotCreateManyPositionInput>;
  skipDuplicates?: InputMaybe<Scalars['Boolean']['input']>;
};

export type LotCreateNestedManyWithoutAccountInput = {
  connect?: InputMaybe<Array<LotWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<LotCreateOrConnectWithoutAccountInput>>;
  create?: InputMaybe<Array<LotCreateWithoutAccountInput>>;
  createMany?: InputMaybe<LotCreateManyAccountInputEnvelope>;
};

export type LotCreateNestedManyWithoutAssetInput = {
  connect?: InputMaybe<Array<LotWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<LotCreateOrConnectWithoutAssetInput>>;
  create?: InputMaybe<Array<LotCreateWithoutAssetInput>>;
  createMany?: InputMaybe<LotCreateManyAssetInputEnvelope>;
};

export type LotCreateNestedManyWithoutFileInput = {
  connect?: InputMaybe<Array<LotWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<LotCreateOrConnectWithoutFileInput>>;
  create?: InputMaybe<Array<LotCreateWithoutFileInput>>;
  createMany?: InputMaybe<LotCreateManyFileInputEnvelope>;
};

export type LotCreateNestedManyWithoutPortfolioInput = {
  connect?: InputMaybe<Array<LotWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<LotCreateOrConnectWithoutPortfolioInput>>;
  create?: InputMaybe<Array<LotCreateWithoutPortfolioInput>>;
  createMany?: InputMaybe<LotCreateManyPortfolioInputEnvelope>;
};

export type LotCreateNestedManyWithoutPositionInput = {
  connect?: InputMaybe<Array<LotWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<LotCreateOrConnectWithoutPositionInput>>;
  create?: InputMaybe<Array<LotCreateWithoutPositionInput>>;
  createMany?: InputMaybe<LotCreateManyPositionInputEnvelope>;
};

export type LotCreateNestedOneWithoutHarvestTransactionItemsInput = {
  connect?: InputMaybe<LotWhereUniqueInput>;
  connectOrCreate?: InputMaybe<LotCreateOrConnectWithoutHarvestTransactionItemsInput>;
  create?: InputMaybe<LotCreateWithoutHarvestTransactionItemsInput>;
};

export type LotCreateNestedOneWithoutLotChangeLogInput = {
  connect?: InputMaybe<LotWhereUniqueInput>;
  connectOrCreate?: InputMaybe<LotCreateOrConnectWithoutLotChangeLogInput>;
  create?: InputMaybe<LotCreateWithoutLotChangeLogInput>;
};

export type LotCreateOrConnectWithoutAccountInput = {
  create: LotCreateWithoutAccountInput;
  where: LotWhereUniqueInput;
};

export type LotCreateOrConnectWithoutAssetInput = {
  create: LotCreateWithoutAssetInput;
  where: LotWhereUniqueInput;
};

export type LotCreateOrConnectWithoutFileInput = {
  create: LotCreateWithoutFileInput;
  where: LotWhereUniqueInput;
};

export type LotCreateOrConnectWithoutHarvestTransactionItemsInput = {
  create: LotCreateWithoutHarvestTransactionItemsInput;
  where: LotWhereUniqueInput;
};

export type LotCreateOrConnectWithoutLotChangeLogInput = {
  create: LotCreateWithoutLotChangeLogInput;
  where: LotWhereUniqueInput;
};

export type LotCreateOrConnectWithoutPortfolioInput = {
  create: LotCreateWithoutPortfolioInput;
  where: LotWhereUniqueInput;
};

export type LotCreateOrConnectWithoutPositionInput = {
  create: LotCreateWithoutPositionInput;
  where: LotWhereUniqueInput;
};

export type LotCreateWithoutAccountInput = {
  acquiredDate: Scalars['DateTime']['input'];
  adjPrice?: InputMaybe<Scalars['Decimal']['input']>;
  asset: AssetCreateNestedOneWithoutLotsInput;
  availableQty?: InputMaybe<Scalars['Decimal']['input']>;
  commPerShare?: InputMaybe<Scalars['Decimal']['input']>;
  costTotal?: InputMaybe<Scalars['Decimal']['input']>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  exchangeRate?: InputMaybe<Scalars['Decimal']['input']>;
  excludeFromHarvest?: InputMaybe<Scalars['Int']['input']>;
  externalId?: InputMaybe<Scalars['String']['input']>;
  feesPerShare?: InputMaybe<Scalars['Decimal']['input']>;
  file?: InputMaybe<FileCreateNestedOneWithoutLotsInput>;
  gainDay?: InputMaybe<Scalars['Decimal']['input']>;
  gainDayPct?: InputMaybe<Scalars['Decimal']['input']>;
  gainTotal?: InputMaybe<Scalars['Decimal']['input']>;
  harvestTransactionItems?: InputMaybe<HarvestTransactionItemCreateNestedManyWithoutLotSoldInput>;
  id?: InputMaybe<Scalars['String']['input']>;
  legNo?: InputMaybe<Scalars['Int']['input']>;
  locationCode?: InputMaybe<Scalars['Int']['input']>;
  lotChangeLog?: InputMaybe<LotChangeLogCreateNestedManyWithoutLotInput>;
  lotSourceCode?: InputMaybe<Scalars['Int']['input']>;
  marketValue?: InputMaybe<Scalars['Decimal']['input']>;
  orderNo?: InputMaybe<Scalars['Decimal']['input']>;
  originalQty?: InputMaybe<Scalars['Decimal']['input']>;
  paymentCurrency?: InputMaybe<Scalars['String']['input']>;
  portfolio: PortfolioCreateNestedOneWithoutLotsInput;
  position?: InputMaybe<PositionCreateNestedOneWithoutLotsInput>;
  price: Scalars['Decimal']['input'];
  remainingQty: Scalars['Decimal']['input'];
  settlementCurrency?: InputMaybe<Scalars['String']['input']>;
  shortType?: InputMaybe<Scalars['Int']['input']>;
  termCode?: InputMaybe<Scalars['Int']['input']>;
  totalCostForGainPct?: InputMaybe<Scalars['Decimal']['input']>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type LotCreateWithoutAssetInput = {
  account: AccountCreateNestedOneWithoutLotsInput;
  acquiredDate: Scalars['DateTime']['input'];
  adjPrice?: InputMaybe<Scalars['Decimal']['input']>;
  availableQty?: InputMaybe<Scalars['Decimal']['input']>;
  commPerShare?: InputMaybe<Scalars['Decimal']['input']>;
  costTotal?: InputMaybe<Scalars['Decimal']['input']>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  exchangeRate?: InputMaybe<Scalars['Decimal']['input']>;
  excludeFromHarvest?: InputMaybe<Scalars['Int']['input']>;
  externalId?: InputMaybe<Scalars['String']['input']>;
  feesPerShare?: InputMaybe<Scalars['Decimal']['input']>;
  file?: InputMaybe<FileCreateNestedOneWithoutLotsInput>;
  gainDay?: InputMaybe<Scalars['Decimal']['input']>;
  gainDayPct?: InputMaybe<Scalars['Decimal']['input']>;
  gainTotal?: InputMaybe<Scalars['Decimal']['input']>;
  harvestTransactionItems?: InputMaybe<HarvestTransactionItemCreateNestedManyWithoutLotSoldInput>;
  id?: InputMaybe<Scalars['String']['input']>;
  legNo?: InputMaybe<Scalars['Int']['input']>;
  locationCode?: InputMaybe<Scalars['Int']['input']>;
  lotChangeLog?: InputMaybe<LotChangeLogCreateNestedManyWithoutLotInput>;
  lotSourceCode?: InputMaybe<Scalars['Int']['input']>;
  marketValue?: InputMaybe<Scalars['Decimal']['input']>;
  orderNo?: InputMaybe<Scalars['Decimal']['input']>;
  originalQty?: InputMaybe<Scalars['Decimal']['input']>;
  paymentCurrency?: InputMaybe<Scalars['String']['input']>;
  portfolio: PortfolioCreateNestedOneWithoutLotsInput;
  position?: InputMaybe<PositionCreateNestedOneWithoutLotsInput>;
  price: Scalars['Decimal']['input'];
  remainingQty: Scalars['Decimal']['input'];
  settlementCurrency?: InputMaybe<Scalars['String']['input']>;
  shortType?: InputMaybe<Scalars['Int']['input']>;
  termCode?: InputMaybe<Scalars['Int']['input']>;
  totalCostForGainPct?: InputMaybe<Scalars['Decimal']['input']>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type LotCreateWithoutFileInput = {
  account: AccountCreateNestedOneWithoutLotsInput;
  acquiredDate: Scalars['DateTime']['input'];
  adjPrice?: InputMaybe<Scalars['Decimal']['input']>;
  asset: AssetCreateNestedOneWithoutLotsInput;
  availableQty?: InputMaybe<Scalars['Decimal']['input']>;
  commPerShare?: InputMaybe<Scalars['Decimal']['input']>;
  costTotal?: InputMaybe<Scalars['Decimal']['input']>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  exchangeRate?: InputMaybe<Scalars['Decimal']['input']>;
  excludeFromHarvest?: InputMaybe<Scalars['Int']['input']>;
  externalId?: InputMaybe<Scalars['String']['input']>;
  feesPerShare?: InputMaybe<Scalars['Decimal']['input']>;
  gainDay?: InputMaybe<Scalars['Decimal']['input']>;
  gainDayPct?: InputMaybe<Scalars['Decimal']['input']>;
  gainTotal?: InputMaybe<Scalars['Decimal']['input']>;
  harvestTransactionItems?: InputMaybe<HarvestTransactionItemCreateNestedManyWithoutLotSoldInput>;
  id?: InputMaybe<Scalars['String']['input']>;
  legNo?: InputMaybe<Scalars['Int']['input']>;
  locationCode?: InputMaybe<Scalars['Int']['input']>;
  lotChangeLog?: InputMaybe<LotChangeLogCreateNestedManyWithoutLotInput>;
  lotSourceCode?: InputMaybe<Scalars['Int']['input']>;
  marketValue?: InputMaybe<Scalars['Decimal']['input']>;
  orderNo?: InputMaybe<Scalars['Decimal']['input']>;
  originalQty?: InputMaybe<Scalars['Decimal']['input']>;
  paymentCurrency?: InputMaybe<Scalars['String']['input']>;
  portfolio: PortfolioCreateNestedOneWithoutLotsInput;
  position?: InputMaybe<PositionCreateNestedOneWithoutLotsInput>;
  price: Scalars['Decimal']['input'];
  remainingQty: Scalars['Decimal']['input'];
  settlementCurrency?: InputMaybe<Scalars['String']['input']>;
  shortType?: InputMaybe<Scalars['Int']['input']>;
  termCode?: InputMaybe<Scalars['Int']['input']>;
  totalCostForGainPct?: InputMaybe<Scalars['Decimal']['input']>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type LotCreateWithoutHarvestTransactionItemsInput = {
  account: AccountCreateNestedOneWithoutLotsInput;
  acquiredDate: Scalars['DateTime']['input'];
  adjPrice?: InputMaybe<Scalars['Decimal']['input']>;
  asset: AssetCreateNestedOneWithoutLotsInput;
  availableQty?: InputMaybe<Scalars['Decimal']['input']>;
  commPerShare?: InputMaybe<Scalars['Decimal']['input']>;
  costTotal?: InputMaybe<Scalars['Decimal']['input']>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  exchangeRate?: InputMaybe<Scalars['Decimal']['input']>;
  excludeFromHarvest?: InputMaybe<Scalars['Int']['input']>;
  externalId?: InputMaybe<Scalars['String']['input']>;
  feesPerShare?: InputMaybe<Scalars['Decimal']['input']>;
  file?: InputMaybe<FileCreateNestedOneWithoutLotsInput>;
  gainDay?: InputMaybe<Scalars['Decimal']['input']>;
  gainDayPct?: InputMaybe<Scalars['Decimal']['input']>;
  gainTotal?: InputMaybe<Scalars['Decimal']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  legNo?: InputMaybe<Scalars['Int']['input']>;
  locationCode?: InputMaybe<Scalars['Int']['input']>;
  lotChangeLog?: InputMaybe<LotChangeLogCreateNestedManyWithoutLotInput>;
  lotSourceCode?: InputMaybe<Scalars['Int']['input']>;
  marketValue?: InputMaybe<Scalars['Decimal']['input']>;
  orderNo?: InputMaybe<Scalars['Decimal']['input']>;
  originalQty?: InputMaybe<Scalars['Decimal']['input']>;
  paymentCurrency?: InputMaybe<Scalars['String']['input']>;
  portfolio: PortfolioCreateNestedOneWithoutLotsInput;
  position?: InputMaybe<PositionCreateNestedOneWithoutLotsInput>;
  price: Scalars['Decimal']['input'];
  remainingQty: Scalars['Decimal']['input'];
  settlementCurrency?: InputMaybe<Scalars['String']['input']>;
  shortType?: InputMaybe<Scalars['Int']['input']>;
  termCode?: InputMaybe<Scalars['Int']['input']>;
  totalCostForGainPct?: InputMaybe<Scalars['Decimal']['input']>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type LotCreateWithoutLotChangeLogInput = {
  account: AccountCreateNestedOneWithoutLotsInput;
  acquiredDate: Scalars['DateTime']['input'];
  adjPrice?: InputMaybe<Scalars['Decimal']['input']>;
  asset: AssetCreateNestedOneWithoutLotsInput;
  availableQty?: InputMaybe<Scalars['Decimal']['input']>;
  commPerShare?: InputMaybe<Scalars['Decimal']['input']>;
  costTotal?: InputMaybe<Scalars['Decimal']['input']>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  exchangeRate?: InputMaybe<Scalars['Decimal']['input']>;
  excludeFromHarvest?: InputMaybe<Scalars['Int']['input']>;
  externalId?: InputMaybe<Scalars['String']['input']>;
  feesPerShare?: InputMaybe<Scalars['Decimal']['input']>;
  file?: InputMaybe<FileCreateNestedOneWithoutLotsInput>;
  gainDay?: InputMaybe<Scalars['Decimal']['input']>;
  gainDayPct?: InputMaybe<Scalars['Decimal']['input']>;
  gainTotal?: InputMaybe<Scalars['Decimal']['input']>;
  harvestTransactionItems?: InputMaybe<HarvestTransactionItemCreateNestedManyWithoutLotSoldInput>;
  id?: InputMaybe<Scalars['String']['input']>;
  legNo?: InputMaybe<Scalars['Int']['input']>;
  locationCode?: InputMaybe<Scalars['Int']['input']>;
  lotSourceCode?: InputMaybe<Scalars['Int']['input']>;
  marketValue?: InputMaybe<Scalars['Decimal']['input']>;
  orderNo?: InputMaybe<Scalars['Decimal']['input']>;
  originalQty?: InputMaybe<Scalars['Decimal']['input']>;
  paymentCurrency?: InputMaybe<Scalars['String']['input']>;
  portfolio: PortfolioCreateNestedOneWithoutLotsInput;
  position?: InputMaybe<PositionCreateNestedOneWithoutLotsInput>;
  price: Scalars['Decimal']['input'];
  remainingQty: Scalars['Decimal']['input'];
  settlementCurrency?: InputMaybe<Scalars['String']['input']>;
  shortType?: InputMaybe<Scalars['Int']['input']>;
  termCode?: InputMaybe<Scalars['Int']['input']>;
  totalCostForGainPct?: InputMaybe<Scalars['Decimal']['input']>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type LotCreateWithoutPortfolioInput = {
  account: AccountCreateNestedOneWithoutLotsInput;
  acquiredDate: Scalars['DateTime']['input'];
  adjPrice?: InputMaybe<Scalars['Decimal']['input']>;
  asset: AssetCreateNestedOneWithoutLotsInput;
  availableQty?: InputMaybe<Scalars['Decimal']['input']>;
  commPerShare?: InputMaybe<Scalars['Decimal']['input']>;
  costTotal?: InputMaybe<Scalars['Decimal']['input']>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  exchangeRate?: InputMaybe<Scalars['Decimal']['input']>;
  excludeFromHarvest?: InputMaybe<Scalars['Int']['input']>;
  externalId?: InputMaybe<Scalars['String']['input']>;
  feesPerShare?: InputMaybe<Scalars['Decimal']['input']>;
  file?: InputMaybe<FileCreateNestedOneWithoutLotsInput>;
  gainDay?: InputMaybe<Scalars['Decimal']['input']>;
  gainDayPct?: InputMaybe<Scalars['Decimal']['input']>;
  gainTotal?: InputMaybe<Scalars['Decimal']['input']>;
  harvestTransactionItems?: InputMaybe<HarvestTransactionItemCreateNestedManyWithoutLotSoldInput>;
  id?: InputMaybe<Scalars['String']['input']>;
  legNo?: InputMaybe<Scalars['Int']['input']>;
  locationCode?: InputMaybe<Scalars['Int']['input']>;
  lotChangeLog?: InputMaybe<LotChangeLogCreateNestedManyWithoutLotInput>;
  lotSourceCode?: InputMaybe<Scalars['Int']['input']>;
  marketValue?: InputMaybe<Scalars['Decimal']['input']>;
  orderNo?: InputMaybe<Scalars['Decimal']['input']>;
  originalQty?: InputMaybe<Scalars['Decimal']['input']>;
  paymentCurrency?: InputMaybe<Scalars['String']['input']>;
  position?: InputMaybe<PositionCreateNestedOneWithoutLotsInput>;
  price: Scalars['Decimal']['input'];
  remainingQty: Scalars['Decimal']['input'];
  settlementCurrency?: InputMaybe<Scalars['String']['input']>;
  shortType?: InputMaybe<Scalars['Int']['input']>;
  termCode?: InputMaybe<Scalars['Int']['input']>;
  totalCostForGainPct?: InputMaybe<Scalars['Decimal']['input']>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type LotCreateWithoutPositionInput = {
  account: AccountCreateNestedOneWithoutLotsInput;
  acquiredDate: Scalars['DateTime']['input'];
  adjPrice?: InputMaybe<Scalars['Decimal']['input']>;
  asset: AssetCreateNestedOneWithoutLotsInput;
  availableQty?: InputMaybe<Scalars['Decimal']['input']>;
  commPerShare?: InputMaybe<Scalars['Decimal']['input']>;
  costTotal?: InputMaybe<Scalars['Decimal']['input']>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  exchangeRate?: InputMaybe<Scalars['Decimal']['input']>;
  excludeFromHarvest?: InputMaybe<Scalars['Int']['input']>;
  externalId?: InputMaybe<Scalars['String']['input']>;
  feesPerShare?: InputMaybe<Scalars['Decimal']['input']>;
  file?: InputMaybe<FileCreateNestedOneWithoutLotsInput>;
  gainDay?: InputMaybe<Scalars['Decimal']['input']>;
  gainDayPct?: InputMaybe<Scalars['Decimal']['input']>;
  gainTotal?: InputMaybe<Scalars['Decimal']['input']>;
  harvestTransactionItems?: InputMaybe<HarvestTransactionItemCreateNestedManyWithoutLotSoldInput>;
  id?: InputMaybe<Scalars['String']['input']>;
  legNo?: InputMaybe<Scalars['Int']['input']>;
  locationCode?: InputMaybe<Scalars['Int']['input']>;
  lotChangeLog?: InputMaybe<LotChangeLogCreateNestedManyWithoutLotInput>;
  lotSourceCode?: InputMaybe<Scalars['Int']['input']>;
  marketValue?: InputMaybe<Scalars['Decimal']['input']>;
  orderNo?: InputMaybe<Scalars['Decimal']['input']>;
  originalQty?: InputMaybe<Scalars['Decimal']['input']>;
  paymentCurrency?: InputMaybe<Scalars['String']['input']>;
  portfolio: PortfolioCreateNestedOneWithoutLotsInput;
  price: Scalars['Decimal']['input'];
  remainingQty: Scalars['Decimal']['input'];
  settlementCurrency?: InputMaybe<Scalars['String']['input']>;
  shortType?: InputMaybe<Scalars['Int']['input']>;
  termCode?: InputMaybe<Scalars['Int']['input']>;
  totalCostForGainPct?: InputMaybe<Scalars['Decimal']['input']>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

/** GQL object for the lot current database view */
export type LotCurrent = {
  __typename?: 'LotCurrent';
  accountId: Scalars['String']['output'];
  acquiredDate: Scalars['DateTime']['output'];
  /** How many shares from this lot are available to be harvested. */
  availableQty: Scalars['String']['output'];
  costBasis: Scalars['String']['output'];
  /** How many shares from this lot are in "in flight" harvests. */
  currentHarvestQty: Scalars['String']['output'];
  dollarPerSharePnL: Scalars['String']['output'];
  gainTotal: Scalars['String']['output'];
  gainTotalPct: Scalars['String']['output'];
  id: Scalars['String']['output'];
  lastPrice: Scalars['String']['output'];
  price: Scalars['String']['output'];
  /** How many shares from this lot are available to be harvested. Importantly this is the actual amount we know from plaid exists at the current time. */
  remainingQty: Scalars['String']['output'];
  symbol: Scalars['String']['output'];
  taxGain: TaxGain;
  value: Scalars['String']['output'];
};

export type LotListRelationFilter = {
  every?: InputMaybe<LotWhereInput>;
  none?: InputMaybe<LotWhereInput>;
  some?: InputMaybe<LotWhereInput>;
};

export type LotMaxAggregate = {
  __typename?: 'LotMaxAggregate';
  accountId?: Maybe<Scalars['String']['output']>;
  acquiredDate?: Maybe<Scalars['DateTime']['output']>;
  adjPrice?: Maybe<Scalars['Decimal']['output']>;
  assetSymbol?: Maybe<Scalars['String']['output']>;
  availableQty?: Maybe<Scalars['Decimal']['output']>;
  commPerShare?: Maybe<Scalars['Decimal']['output']>;
  costTotal?: Maybe<Scalars['Decimal']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  exchangeRate?: Maybe<Scalars['Decimal']['output']>;
  excludeFromHarvest?: Maybe<Scalars['Int']['output']>;
  externalId?: Maybe<Scalars['String']['output']>;
  feesPerShare?: Maybe<Scalars['Decimal']['output']>;
  fileId?: Maybe<Scalars['String']['output']>;
  gainDay?: Maybe<Scalars['Decimal']['output']>;
  gainDayPct?: Maybe<Scalars['Decimal']['output']>;
  gainTotal?: Maybe<Scalars['Decimal']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  legNo?: Maybe<Scalars['Int']['output']>;
  locationCode?: Maybe<Scalars['Int']['output']>;
  lotSourceCode?: Maybe<Scalars['Int']['output']>;
  marketValue?: Maybe<Scalars['Decimal']['output']>;
  orderNo?: Maybe<Scalars['Decimal']['output']>;
  originalQty?: Maybe<Scalars['Decimal']['output']>;
  paymentCurrency?: Maybe<Scalars['String']['output']>;
  portfolioId?: Maybe<Scalars['String']['output']>;
  positionId?: Maybe<Scalars['String']['output']>;
  price?: Maybe<Scalars['Decimal']['output']>;
  remainingQty?: Maybe<Scalars['Decimal']['output']>;
  settlementCurrency?: Maybe<Scalars['String']['output']>;
  shortType?: Maybe<Scalars['Int']['output']>;
  termCode?: Maybe<Scalars['Int']['output']>;
  totalCostForGainPct?: Maybe<Scalars['Decimal']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type LotMinAggregate = {
  __typename?: 'LotMinAggregate';
  accountId?: Maybe<Scalars['String']['output']>;
  acquiredDate?: Maybe<Scalars['DateTime']['output']>;
  adjPrice?: Maybe<Scalars['Decimal']['output']>;
  assetSymbol?: Maybe<Scalars['String']['output']>;
  availableQty?: Maybe<Scalars['Decimal']['output']>;
  commPerShare?: Maybe<Scalars['Decimal']['output']>;
  costTotal?: Maybe<Scalars['Decimal']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  exchangeRate?: Maybe<Scalars['Decimal']['output']>;
  excludeFromHarvest?: Maybe<Scalars['Int']['output']>;
  externalId?: Maybe<Scalars['String']['output']>;
  feesPerShare?: Maybe<Scalars['Decimal']['output']>;
  fileId?: Maybe<Scalars['String']['output']>;
  gainDay?: Maybe<Scalars['Decimal']['output']>;
  gainDayPct?: Maybe<Scalars['Decimal']['output']>;
  gainTotal?: Maybe<Scalars['Decimal']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  legNo?: Maybe<Scalars['Int']['output']>;
  locationCode?: Maybe<Scalars['Int']['output']>;
  lotSourceCode?: Maybe<Scalars['Int']['output']>;
  marketValue?: Maybe<Scalars['Decimal']['output']>;
  orderNo?: Maybe<Scalars['Decimal']['output']>;
  originalQty?: Maybe<Scalars['Decimal']['output']>;
  paymentCurrency?: Maybe<Scalars['String']['output']>;
  portfolioId?: Maybe<Scalars['String']['output']>;
  positionId?: Maybe<Scalars['String']['output']>;
  price?: Maybe<Scalars['Decimal']['output']>;
  remainingQty?: Maybe<Scalars['Decimal']['output']>;
  settlementCurrency?: Maybe<Scalars['String']['output']>;
  shortType?: Maybe<Scalars['Int']['output']>;
  termCode?: Maybe<Scalars['Int']['output']>;
  totalCostForGainPct?: Maybe<Scalars['Decimal']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type LotNullableScalarRelationFilter = {
  is?: InputMaybe<LotWhereInput>;
  isNot?: InputMaybe<LotWhereInput>;
};

export type LotPositionIdExternalIdCompoundUniqueInput = {
  externalId: Scalars['String']['input'];
  positionId: Scalars['String']['input'];
};

export type LotScalarWhereInput = {
  AND?: InputMaybe<Array<LotScalarWhereInput>>;
  NOT?: InputMaybe<Array<LotScalarWhereInput>>;
  OR?: InputMaybe<Array<LotScalarWhereInput>>;
  accountId?: InputMaybe<UuidFilter>;
  acquiredDate?: InputMaybe<DateTimeFilter>;
  adjPrice?: InputMaybe<DecimalNullableFilter>;
  assetSymbol?: InputMaybe<StringFilter>;
  availableQty?: InputMaybe<DecimalNullableFilter>;
  commPerShare?: InputMaybe<DecimalNullableFilter>;
  costTotal?: InputMaybe<DecimalNullableFilter>;
  createdAt?: InputMaybe<DateTimeFilter>;
  exchangeRate?: InputMaybe<DecimalNullableFilter>;
  excludeFromHarvest?: InputMaybe<IntFilter>;
  externalId?: InputMaybe<StringNullableFilter>;
  feesPerShare?: InputMaybe<DecimalNullableFilter>;
  fileId?: InputMaybe<UuidNullableFilter>;
  gainDay?: InputMaybe<DecimalNullableFilter>;
  gainDayPct?: InputMaybe<DecimalNullableFilter>;
  gainTotal?: InputMaybe<DecimalNullableFilter>;
  id?: InputMaybe<UuidFilter>;
  legNo?: InputMaybe<IntNullableFilter>;
  locationCode?: InputMaybe<IntNullableFilter>;
  lotSourceCode?: InputMaybe<IntNullableFilter>;
  marketValue?: InputMaybe<DecimalNullableFilter>;
  orderNo?: InputMaybe<DecimalNullableFilter>;
  originalQty?: InputMaybe<DecimalNullableFilter>;
  paymentCurrency?: InputMaybe<StringNullableFilter>;
  portfolioId?: InputMaybe<UuidFilter>;
  positionId?: InputMaybe<UuidNullableFilter>;
  price?: InputMaybe<DecimalFilter>;
  remainingQty?: InputMaybe<DecimalFilter>;
  settlementCurrency?: InputMaybe<StringNullableFilter>;
  shortType?: InputMaybe<IntNullableFilter>;
  termCode?: InputMaybe<IntNullableFilter>;
  totalCostForGainPct?: InputMaybe<DecimalNullableFilter>;
  updatedAt?: InputMaybe<DateTimeFilter>;
};

export type LotSumAggregate = {
  __typename?: 'LotSumAggregate';
  adjPrice?: Maybe<Scalars['Decimal']['output']>;
  availableQty?: Maybe<Scalars['Decimal']['output']>;
  commPerShare?: Maybe<Scalars['Decimal']['output']>;
  costTotal?: Maybe<Scalars['Decimal']['output']>;
  exchangeRate?: Maybe<Scalars['Decimal']['output']>;
  excludeFromHarvest?: Maybe<Scalars['Int']['output']>;
  feesPerShare?: Maybe<Scalars['Decimal']['output']>;
  gainDay?: Maybe<Scalars['Decimal']['output']>;
  gainDayPct?: Maybe<Scalars['Decimal']['output']>;
  gainTotal?: Maybe<Scalars['Decimal']['output']>;
  legNo?: Maybe<Scalars['Int']['output']>;
  locationCode?: Maybe<Scalars['Int']['output']>;
  lotSourceCode?: Maybe<Scalars['Int']['output']>;
  marketValue?: Maybe<Scalars['Decimal']['output']>;
  orderNo?: Maybe<Scalars['Decimal']['output']>;
  originalQty?: Maybe<Scalars['Decimal']['output']>;
  price?: Maybe<Scalars['Decimal']['output']>;
  remainingQty?: Maybe<Scalars['Decimal']['output']>;
  shortType?: Maybe<Scalars['Int']['output']>;
  termCode?: Maybe<Scalars['Int']['output']>;
  totalCostForGainPct?: Maybe<Scalars['Decimal']['output']>;
};

export type LotTransactionBatch = {
  __typename?: 'LotTransactionBatch';
  _count: LotTransactionBatchCount;
  authConnection: AuthConnection;
  authConnectionId: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  deletedLots?: Maybe<Scalars['JSON']['output']>;
  /** Plaid holdings payload for the transaction batch */
  holdingsPayload?: Maybe<Scalars['JSON']['output']>;
  id: Scalars['ID']['output'];
  /** Initial lots for the transaction batch */
  initialLots?: Maybe<Scalars['JSON']['output']>;
  lotChangeLog?: Maybe<Array<LotChangeLog>>;
  /** Map of lot tuples for the transaction batch */
  lotTupleMap?: Maybe<Scalars['JSON']['output']>;
  /** New buys for the transaction batch */
  newBuys?: Maybe<Scalars['JSON']['output']>;
  /** New sells for the transaction batch */
  newSells?: Maybe<Scalars['JSON']['output']>;
  /** New transactions for the transaction batch */
  newTransactions?: Maybe<Scalars['JSON']['output']>;
  portfolio: Portfolio;
  portfolioId: Scalars['String']['output'];
  /** Snapshot of positions after the transaction batch */
  positionsAfter?: Maybe<Scalars['JSON']['output']>;
  /** Snapshot of positions before the transaction batch */
  positionsBefore?: Maybe<Scalars['JSON']['output']>;
  /** Realized profit and loss for the transaction batch */
  realizedProfitAndLoss?: Maybe<Scalars['Decimal']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};

export type LotTransactionBatchAvgAggregate = {
  __typename?: 'LotTransactionBatchAvgAggregate';
  realizedProfitAndLoss?: Maybe<Scalars['Decimal']['output']>;
};

export type LotTransactionBatchCount = {
  __typename?: 'LotTransactionBatchCount';
  lotChangeLog: Scalars['Int']['output'];
};

export type LotTransactionBatchCountAggregate = {
  __typename?: 'LotTransactionBatchCountAggregate';
  _all: Scalars['Int']['output'];
  authConnectionId: Scalars['Int']['output'];
  createdAt: Scalars['Int']['output'];
  deletedLots: Scalars['Int']['output'];
  holdingsPayload: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  initialLots: Scalars['Int']['output'];
  lotTupleMap: Scalars['Int']['output'];
  newBuys: Scalars['Int']['output'];
  newSells: Scalars['Int']['output'];
  newTransactions: Scalars['Int']['output'];
  portfolioId: Scalars['Int']['output'];
  positionsAfter: Scalars['Int']['output'];
  positionsBefore: Scalars['Int']['output'];
  realizedProfitAndLoss: Scalars['Int']['output'];
  updatedAt: Scalars['Int']['output'];
};

export type LotTransactionBatchCreateManyAuthConnectionInput = {
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  deletedLots?: InputMaybe<Scalars['JSON']['input']>;
  holdingsPayload?: InputMaybe<Scalars['JSON']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  initialLots?: InputMaybe<Scalars['JSON']['input']>;
  lotTupleMap?: InputMaybe<Scalars['JSON']['input']>;
  newBuys?: InputMaybe<Scalars['JSON']['input']>;
  newSells?: InputMaybe<Scalars['JSON']['input']>;
  newTransactions?: InputMaybe<Scalars['JSON']['input']>;
  portfolioId: Scalars['String']['input'];
  positionsAfter?: InputMaybe<Scalars['JSON']['input']>;
  positionsBefore?: InputMaybe<Scalars['JSON']['input']>;
  realizedProfitAndLoss?: InputMaybe<Scalars['Decimal']['input']>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type LotTransactionBatchCreateManyAuthConnectionInputEnvelope = {
  data: Array<LotTransactionBatchCreateManyAuthConnectionInput>;
  skipDuplicates?: InputMaybe<Scalars['Boolean']['input']>;
};

export type LotTransactionBatchCreateManyPortfolioInput = {
  authConnectionId: Scalars['String']['input'];
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  deletedLots?: InputMaybe<Scalars['JSON']['input']>;
  holdingsPayload?: InputMaybe<Scalars['JSON']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  initialLots?: InputMaybe<Scalars['JSON']['input']>;
  lotTupleMap?: InputMaybe<Scalars['JSON']['input']>;
  newBuys?: InputMaybe<Scalars['JSON']['input']>;
  newSells?: InputMaybe<Scalars['JSON']['input']>;
  newTransactions?: InputMaybe<Scalars['JSON']['input']>;
  positionsAfter?: InputMaybe<Scalars['JSON']['input']>;
  positionsBefore?: InputMaybe<Scalars['JSON']['input']>;
  realizedProfitAndLoss?: InputMaybe<Scalars['Decimal']['input']>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type LotTransactionBatchCreateManyPortfolioInputEnvelope = {
  data: Array<LotTransactionBatchCreateManyPortfolioInput>;
  skipDuplicates?: InputMaybe<Scalars['Boolean']['input']>;
};

export type LotTransactionBatchCreateNestedManyWithoutAuthConnectionInput = {
  connect?: InputMaybe<Array<LotTransactionBatchWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<LotTransactionBatchCreateOrConnectWithoutAuthConnectionInput>>;
  create?: InputMaybe<Array<LotTransactionBatchCreateWithoutAuthConnectionInput>>;
  createMany?: InputMaybe<LotTransactionBatchCreateManyAuthConnectionInputEnvelope>;
};

export type LotTransactionBatchCreateNestedManyWithoutPortfolioInput = {
  connect?: InputMaybe<Array<LotTransactionBatchWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<LotTransactionBatchCreateOrConnectWithoutPortfolioInput>>;
  create?: InputMaybe<Array<LotTransactionBatchCreateWithoutPortfolioInput>>;
  createMany?: InputMaybe<LotTransactionBatchCreateManyPortfolioInputEnvelope>;
};

export type LotTransactionBatchCreateNestedOneWithoutLotChangeLogInput = {
  connect?: InputMaybe<LotTransactionBatchWhereUniqueInput>;
  connectOrCreate?: InputMaybe<LotTransactionBatchCreateOrConnectWithoutLotChangeLogInput>;
  create?: InputMaybe<LotTransactionBatchCreateWithoutLotChangeLogInput>;
};

export type LotTransactionBatchCreateOrConnectWithoutAuthConnectionInput = {
  create: LotTransactionBatchCreateWithoutAuthConnectionInput;
  where: LotTransactionBatchWhereUniqueInput;
};

export type LotTransactionBatchCreateOrConnectWithoutLotChangeLogInput = {
  create: LotTransactionBatchCreateWithoutLotChangeLogInput;
  where: LotTransactionBatchWhereUniqueInput;
};

export type LotTransactionBatchCreateOrConnectWithoutPortfolioInput = {
  create: LotTransactionBatchCreateWithoutPortfolioInput;
  where: LotTransactionBatchWhereUniqueInput;
};

export type LotTransactionBatchCreateWithoutAuthConnectionInput = {
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  deletedLots?: InputMaybe<Scalars['JSON']['input']>;
  holdingsPayload?: InputMaybe<Scalars['JSON']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  initialLots?: InputMaybe<Scalars['JSON']['input']>;
  lotChangeLog?: InputMaybe<LotChangeLogCreateNestedManyWithoutLotTransactionBatchInput>;
  lotTupleMap?: InputMaybe<Scalars['JSON']['input']>;
  newBuys?: InputMaybe<Scalars['JSON']['input']>;
  newSells?: InputMaybe<Scalars['JSON']['input']>;
  newTransactions?: InputMaybe<Scalars['JSON']['input']>;
  portfolio: PortfolioCreateNestedOneWithoutLotTransactionBatchInput;
  positionsAfter?: InputMaybe<Scalars['JSON']['input']>;
  positionsBefore?: InputMaybe<Scalars['JSON']['input']>;
  realizedProfitAndLoss?: InputMaybe<Scalars['Decimal']['input']>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type LotTransactionBatchCreateWithoutLotChangeLogInput = {
  authConnection: AuthConnectionCreateNestedOneWithoutLotTransactionBatchInput;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  deletedLots?: InputMaybe<Scalars['JSON']['input']>;
  holdingsPayload?: InputMaybe<Scalars['JSON']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  initialLots?: InputMaybe<Scalars['JSON']['input']>;
  lotTupleMap?: InputMaybe<Scalars['JSON']['input']>;
  newBuys?: InputMaybe<Scalars['JSON']['input']>;
  newSells?: InputMaybe<Scalars['JSON']['input']>;
  newTransactions?: InputMaybe<Scalars['JSON']['input']>;
  portfolio: PortfolioCreateNestedOneWithoutLotTransactionBatchInput;
  positionsAfter?: InputMaybe<Scalars['JSON']['input']>;
  positionsBefore?: InputMaybe<Scalars['JSON']['input']>;
  realizedProfitAndLoss?: InputMaybe<Scalars['Decimal']['input']>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type LotTransactionBatchCreateWithoutPortfolioInput = {
  authConnection: AuthConnectionCreateNestedOneWithoutLotTransactionBatchInput;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  deletedLots?: InputMaybe<Scalars['JSON']['input']>;
  holdingsPayload?: InputMaybe<Scalars['JSON']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  initialLots?: InputMaybe<Scalars['JSON']['input']>;
  lotChangeLog?: InputMaybe<LotChangeLogCreateNestedManyWithoutLotTransactionBatchInput>;
  lotTupleMap?: InputMaybe<Scalars['JSON']['input']>;
  newBuys?: InputMaybe<Scalars['JSON']['input']>;
  newSells?: InputMaybe<Scalars['JSON']['input']>;
  newTransactions?: InputMaybe<Scalars['JSON']['input']>;
  positionsAfter?: InputMaybe<Scalars['JSON']['input']>;
  positionsBefore?: InputMaybe<Scalars['JSON']['input']>;
  realizedProfitAndLoss?: InputMaybe<Scalars['Decimal']['input']>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type LotTransactionBatchListRelationFilter = {
  every?: InputMaybe<LotTransactionBatchWhereInput>;
  none?: InputMaybe<LotTransactionBatchWhereInput>;
  some?: InputMaybe<LotTransactionBatchWhereInput>;
};

export type LotTransactionBatchMaxAggregate = {
  __typename?: 'LotTransactionBatchMaxAggregate';
  authConnectionId?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  portfolioId?: Maybe<Scalars['String']['output']>;
  realizedProfitAndLoss?: Maybe<Scalars['Decimal']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type LotTransactionBatchMinAggregate = {
  __typename?: 'LotTransactionBatchMinAggregate';
  authConnectionId?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  portfolioId?: Maybe<Scalars['String']['output']>;
  realizedProfitAndLoss?: Maybe<Scalars['Decimal']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type LotTransactionBatchOrderByRelationAggregateInput = {
  _count?: InputMaybe<SortOrder>;
};

export type LotTransactionBatchScalarRelationFilter = {
  is?: InputMaybe<LotTransactionBatchWhereInput>;
  isNot?: InputMaybe<LotTransactionBatchWhereInput>;
};

export type LotTransactionBatchScalarWhereInput = {
  AND?: InputMaybe<Array<LotTransactionBatchScalarWhereInput>>;
  NOT?: InputMaybe<Array<LotTransactionBatchScalarWhereInput>>;
  OR?: InputMaybe<Array<LotTransactionBatchScalarWhereInput>>;
  authConnectionId?: InputMaybe<UuidFilter>;
  createdAt?: InputMaybe<DateTimeFilter>;
  deletedLots?: InputMaybe<JsonNullableFilter>;
  holdingsPayload?: InputMaybe<JsonNullableFilter>;
  id?: InputMaybe<UuidFilter>;
  initialLots?: InputMaybe<JsonNullableFilter>;
  lotTupleMap?: InputMaybe<JsonNullableFilter>;
  newBuys?: InputMaybe<JsonNullableFilter>;
  newSells?: InputMaybe<JsonNullableFilter>;
  newTransactions?: InputMaybe<JsonNullableFilter>;
  portfolioId?: InputMaybe<UuidFilter>;
  positionsAfter?: InputMaybe<JsonNullableFilter>;
  positionsBefore?: InputMaybe<JsonNullableFilter>;
  realizedProfitAndLoss?: InputMaybe<DecimalNullableFilter>;
  updatedAt?: InputMaybe<DateTimeFilter>;
};

export type LotTransactionBatchSumAggregate = {
  __typename?: 'LotTransactionBatchSumAggregate';
  realizedProfitAndLoss?: Maybe<Scalars['Decimal']['output']>;
};

export type LotTransactionBatchUpdateManyMutationInput = {
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  deletedLots?: InputMaybe<Scalars['JSON']['input']>;
  holdingsPayload?: InputMaybe<Scalars['JSON']['input']>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  initialLots?: InputMaybe<Scalars['JSON']['input']>;
  lotTupleMap?: InputMaybe<Scalars['JSON']['input']>;
  newBuys?: InputMaybe<Scalars['JSON']['input']>;
  newSells?: InputMaybe<Scalars['JSON']['input']>;
  newTransactions?: InputMaybe<Scalars['JSON']['input']>;
  positionsAfter?: InputMaybe<Scalars['JSON']['input']>;
  positionsBefore?: InputMaybe<Scalars['JSON']['input']>;
  realizedProfitAndLoss?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
};

export type LotTransactionBatchUpdateManyWithWhereWithoutAuthConnectionInput = {
  data: LotTransactionBatchUpdateManyMutationInput;
  where: LotTransactionBatchScalarWhereInput;
};

export type LotTransactionBatchUpdateManyWithWhereWithoutPortfolioInput = {
  data: LotTransactionBatchUpdateManyMutationInput;
  where: LotTransactionBatchScalarWhereInput;
};

export type LotTransactionBatchUpdateManyWithoutAuthConnectionNestedInput = {
  connect?: InputMaybe<Array<LotTransactionBatchWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<LotTransactionBatchCreateOrConnectWithoutAuthConnectionInput>>;
  create?: InputMaybe<Array<LotTransactionBatchCreateWithoutAuthConnectionInput>>;
  createMany?: InputMaybe<LotTransactionBatchCreateManyAuthConnectionInputEnvelope>;
  delete?: InputMaybe<Array<LotTransactionBatchWhereUniqueInput>>;
  deleteMany?: InputMaybe<Array<LotTransactionBatchScalarWhereInput>>;
  disconnect?: InputMaybe<Array<LotTransactionBatchWhereUniqueInput>>;
  set?: InputMaybe<Array<LotTransactionBatchWhereUniqueInput>>;
  update?: InputMaybe<Array<LotTransactionBatchUpdateWithWhereUniqueWithoutAuthConnectionInput>>;
  updateMany?: InputMaybe<Array<LotTransactionBatchUpdateManyWithWhereWithoutAuthConnectionInput>>;
  upsert?: InputMaybe<Array<LotTransactionBatchUpsertWithWhereUniqueWithoutAuthConnectionInput>>;
};

export type LotTransactionBatchUpdateManyWithoutPortfolioNestedInput = {
  connect?: InputMaybe<Array<LotTransactionBatchWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<LotTransactionBatchCreateOrConnectWithoutPortfolioInput>>;
  create?: InputMaybe<Array<LotTransactionBatchCreateWithoutPortfolioInput>>;
  createMany?: InputMaybe<LotTransactionBatchCreateManyPortfolioInputEnvelope>;
  delete?: InputMaybe<Array<LotTransactionBatchWhereUniqueInput>>;
  deleteMany?: InputMaybe<Array<LotTransactionBatchScalarWhereInput>>;
  disconnect?: InputMaybe<Array<LotTransactionBatchWhereUniqueInput>>;
  set?: InputMaybe<Array<LotTransactionBatchWhereUniqueInput>>;
  update?: InputMaybe<Array<LotTransactionBatchUpdateWithWhereUniqueWithoutPortfolioInput>>;
  updateMany?: InputMaybe<Array<LotTransactionBatchUpdateManyWithWhereWithoutPortfolioInput>>;
  upsert?: InputMaybe<Array<LotTransactionBatchUpsertWithWhereUniqueWithoutPortfolioInput>>;
};

export type LotTransactionBatchUpdateOneRequiredWithoutLotChangeLogNestedInput = {
  connect?: InputMaybe<LotTransactionBatchWhereUniqueInput>;
  connectOrCreate?: InputMaybe<LotTransactionBatchCreateOrConnectWithoutLotChangeLogInput>;
  create?: InputMaybe<LotTransactionBatchCreateWithoutLotChangeLogInput>;
  update?: InputMaybe<LotTransactionBatchUpdateToOneWithWhereWithoutLotChangeLogInput>;
  upsert?: InputMaybe<LotTransactionBatchUpsertWithoutLotChangeLogInput>;
};

export type LotTransactionBatchUpdateToOneWithWhereWithoutLotChangeLogInput = {
  data: LotTransactionBatchUpdateWithoutLotChangeLogInput;
  where?: InputMaybe<LotTransactionBatchWhereInput>;
};

export type LotTransactionBatchUpdateWithWhereUniqueWithoutAuthConnectionInput = {
  data: LotTransactionBatchUpdateWithoutAuthConnectionInput;
  where: LotTransactionBatchWhereUniqueInput;
};

export type LotTransactionBatchUpdateWithWhereUniqueWithoutPortfolioInput = {
  data: LotTransactionBatchUpdateWithoutPortfolioInput;
  where: LotTransactionBatchWhereUniqueInput;
};

export type LotTransactionBatchUpdateWithoutAuthConnectionInput = {
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  deletedLots?: InputMaybe<Scalars['JSON']['input']>;
  holdingsPayload?: InputMaybe<Scalars['JSON']['input']>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  initialLots?: InputMaybe<Scalars['JSON']['input']>;
  lotChangeLog?: InputMaybe<LotChangeLogUpdateManyWithoutLotTransactionBatchNestedInput>;
  lotTupleMap?: InputMaybe<Scalars['JSON']['input']>;
  newBuys?: InputMaybe<Scalars['JSON']['input']>;
  newSells?: InputMaybe<Scalars['JSON']['input']>;
  newTransactions?: InputMaybe<Scalars['JSON']['input']>;
  portfolio?: InputMaybe<PortfolioUpdateOneRequiredWithoutLotTransactionBatchNestedInput>;
  positionsAfter?: InputMaybe<Scalars['JSON']['input']>;
  positionsBefore?: InputMaybe<Scalars['JSON']['input']>;
  realizedProfitAndLoss?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
};

export type LotTransactionBatchUpdateWithoutLotChangeLogInput = {
  authConnection?: InputMaybe<AuthConnectionUpdateOneRequiredWithoutLotTransactionBatchNestedInput>;
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  deletedLots?: InputMaybe<Scalars['JSON']['input']>;
  holdingsPayload?: InputMaybe<Scalars['JSON']['input']>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  initialLots?: InputMaybe<Scalars['JSON']['input']>;
  lotTupleMap?: InputMaybe<Scalars['JSON']['input']>;
  newBuys?: InputMaybe<Scalars['JSON']['input']>;
  newSells?: InputMaybe<Scalars['JSON']['input']>;
  newTransactions?: InputMaybe<Scalars['JSON']['input']>;
  portfolio?: InputMaybe<PortfolioUpdateOneRequiredWithoutLotTransactionBatchNestedInput>;
  positionsAfter?: InputMaybe<Scalars['JSON']['input']>;
  positionsBefore?: InputMaybe<Scalars['JSON']['input']>;
  realizedProfitAndLoss?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
};

export type LotTransactionBatchUpdateWithoutPortfolioInput = {
  authConnection?: InputMaybe<AuthConnectionUpdateOneRequiredWithoutLotTransactionBatchNestedInput>;
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  deletedLots?: InputMaybe<Scalars['JSON']['input']>;
  holdingsPayload?: InputMaybe<Scalars['JSON']['input']>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  initialLots?: InputMaybe<Scalars['JSON']['input']>;
  lotChangeLog?: InputMaybe<LotChangeLogUpdateManyWithoutLotTransactionBatchNestedInput>;
  lotTupleMap?: InputMaybe<Scalars['JSON']['input']>;
  newBuys?: InputMaybe<Scalars['JSON']['input']>;
  newSells?: InputMaybe<Scalars['JSON']['input']>;
  newTransactions?: InputMaybe<Scalars['JSON']['input']>;
  positionsAfter?: InputMaybe<Scalars['JSON']['input']>;
  positionsBefore?: InputMaybe<Scalars['JSON']['input']>;
  realizedProfitAndLoss?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
};

export type LotTransactionBatchUpsertWithWhereUniqueWithoutAuthConnectionInput = {
  create: LotTransactionBatchCreateWithoutAuthConnectionInput;
  update: LotTransactionBatchUpdateWithoutAuthConnectionInput;
  where: LotTransactionBatchWhereUniqueInput;
};

export type LotTransactionBatchUpsertWithWhereUniqueWithoutPortfolioInput = {
  create: LotTransactionBatchCreateWithoutPortfolioInput;
  update: LotTransactionBatchUpdateWithoutPortfolioInput;
  where: LotTransactionBatchWhereUniqueInput;
};

export type LotTransactionBatchUpsertWithoutLotChangeLogInput = {
  create: LotTransactionBatchCreateWithoutLotChangeLogInput;
  update: LotTransactionBatchUpdateWithoutLotChangeLogInput;
  where?: InputMaybe<LotTransactionBatchWhereInput>;
};

export type LotTransactionBatchWhereInput = {
  AND?: InputMaybe<Array<LotTransactionBatchWhereInput>>;
  NOT?: InputMaybe<Array<LotTransactionBatchWhereInput>>;
  OR?: InputMaybe<Array<LotTransactionBatchWhereInput>>;
  authConnection?: InputMaybe<AuthConnectionScalarRelationFilter>;
  authConnectionId?: InputMaybe<UuidFilter>;
  createdAt?: InputMaybe<DateTimeFilter>;
  deletedLots?: InputMaybe<JsonNullableFilter>;
  holdingsPayload?: InputMaybe<JsonNullableFilter>;
  id?: InputMaybe<UuidFilter>;
  initialLots?: InputMaybe<JsonNullableFilter>;
  lotChangeLog?: InputMaybe<LotChangeLogListRelationFilter>;
  lotTupleMap?: InputMaybe<JsonNullableFilter>;
  newBuys?: InputMaybe<JsonNullableFilter>;
  newSells?: InputMaybe<JsonNullableFilter>;
  newTransactions?: InputMaybe<JsonNullableFilter>;
  portfolio?: InputMaybe<PortfolioScalarRelationFilter>;
  portfolioId?: InputMaybe<UuidFilter>;
  positionsAfter?: InputMaybe<JsonNullableFilter>;
  positionsBefore?: InputMaybe<JsonNullableFilter>;
  realizedProfitAndLoss?: InputMaybe<DecimalNullableFilter>;
  updatedAt?: InputMaybe<DateTimeFilter>;
};

export type LotTransactionBatchWhereUniqueInput = {
  AND?: InputMaybe<Array<LotTransactionBatchWhereInput>>;
  NOT?: InputMaybe<Array<LotTransactionBatchWhereInput>>;
  OR?: InputMaybe<Array<LotTransactionBatchWhereInput>>;
  authConnection?: InputMaybe<AuthConnectionScalarRelationFilter>;
  authConnectionId?: InputMaybe<UuidFilter>;
  createdAt?: InputMaybe<DateTimeFilter>;
  deletedLots?: InputMaybe<JsonNullableFilter>;
  holdingsPayload?: InputMaybe<JsonNullableFilter>;
  id?: InputMaybe<Scalars['String']['input']>;
  initialLots?: InputMaybe<JsonNullableFilter>;
  lotChangeLog?: InputMaybe<LotChangeLogListRelationFilter>;
  lotTupleMap?: InputMaybe<JsonNullableFilter>;
  newBuys?: InputMaybe<JsonNullableFilter>;
  newSells?: InputMaybe<JsonNullableFilter>;
  newTransactions?: InputMaybe<JsonNullableFilter>;
  portfolio?: InputMaybe<PortfolioScalarRelationFilter>;
  portfolioId?: InputMaybe<UuidFilter>;
  positionsAfter?: InputMaybe<JsonNullableFilter>;
  positionsBefore?: InputMaybe<JsonNullableFilter>;
  realizedProfitAndLoss?: InputMaybe<DecimalNullableFilter>;
  updatedAt?: InputMaybe<DateTimeFilter>;
};

export type LotUpdateManyMutationInput = {
  acquiredDate?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  adjPrice?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  availableQty?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  commPerShare?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  costTotal?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  exchangeRate?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  excludeFromHarvest?: InputMaybe<IntFieldUpdateOperationsInput>;
  externalId?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  feesPerShare?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  gainDay?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  gainDayPct?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  gainTotal?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  legNo?: InputMaybe<NullableIntFieldUpdateOperationsInput>;
  locationCode?: InputMaybe<NullableIntFieldUpdateOperationsInput>;
  lotSourceCode?: InputMaybe<NullableIntFieldUpdateOperationsInput>;
  marketValue?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  orderNo?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  originalQty?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  paymentCurrency?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  price?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  remainingQty?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  settlementCurrency?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  shortType?: InputMaybe<NullableIntFieldUpdateOperationsInput>;
  termCode?: InputMaybe<NullableIntFieldUpdateOperationsInput>;
  totalCostForGainPct?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
};

export type LotUpdateManyWithWhereWithoutAccountInput = {
  data: LotUpdateManyMutationInput;
  where: LotScalarWhereInput;
};

export type LotUpdateManyWithWhereWithoutAssetInput = {
  data: LotUpdateManyMutationInput;
  where: LotScalarWhereInput;
};

export type LotUpdateManyWithWhereWithoutFileInput = {
  data: LotUpdateManyMutationInput;
  where: LotScalarWhereInput;
};

export type LotUpdateManyWithWhereWithoutPortfolioInput = {
  data: LotUpdateManyMutationInput;
  where: LotScalarWhereInput;
};

export type LotUpdateManyWithWhereWithoutPositionInput = {
  data: LotUpdateManyMutationInput;
  where: LotScalarWhereInput;
};

export type LotUpdateManyWithoutAccountNestedInput = {
  connect?: InputMaybe<Array<LotWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<LotCreateOrConnectWithoutAccountInput>>;
  create?: InputMaybe<Array<LotCreateWithoutAccountInput>>;
  createMany?: InputMaybe<LotCreateManyAccountInputEnvelope>;
  delete?: InputMaybe<Array<LotWhereUniqueInput>>;
  deleteMany?: InputMaybe<Array<LotScalarWhereInput>>;
  disconnect?: InputMaybe<Array<LotWhereUniqueInput>>;
  set?: InputMaybe<Array<LotWhereUniqueInput>>;
  update?: InputMaybe<Array<LotUpdateWithWhereUniqueWithoutAccountInput>>;
  updateMany?: InputMaybe<Array<LotUpdateManyWithWhereWithoutAccountInput>>;
  upsert?: InputMaybe<Array<LotUpsertWithWhereUniqueWithoutAccountInput>>;
};

export type LotUpdateManyWithoutAssetNestedInput = {
  connect?: InputMaybe<Array<LotWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<LotCreateOrConnectWithoutAssetInput>>;
  create?: InputMaybe<Array<LotCreateWithoutAssetInput>>;
  createMany?: InputMaybe<LotCreateManyAssetInputEnvelope>;
  delete?: InputMaybe<Array<LotWhereUniqueInput>>;
  deleteMany?: InputMaybe<Array<LotScalarWhereInput>>;
  disconnect?: InputMaybe<Array<LotWhereUniqueInput>>;
  set?: InputMaybe<Array<LotWhereUniqueInput>>;
  update?: InputMaybe<Array<LotUpdateWithWhereUniqueWithoutAssetInput>>;
  updateMany?: InputMaybe<Array<LotUpdateManyWithWhereWithoutAssetInput>>;
  upsert?: InputMaybe<Array<LotUpsertWithWhereUniqueWithoutAssetInput>>;
};

export type LotUpdateManyWithoutFileNestedInput = {
  connect?: InputMaybe<Array<LotWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<LotCreateOrConnectWithoutFileInput>>;
  create?: InputMaybe<Array<LotCreateWithoutFileInput>>;
  createMany?: InputMaybe<LotCreateManyFileInputEnvelope>;
  delete?: InputMaybe<Array<LotWhereUniqueInput>>;
  deleteMany?: InputMaybe<Array<LotScalarWhereInput>>;
  disconnect?: InputMaybe<Array<LotWhereUniqueInput>>;
  set?: InputMaybe<Array<LotWhereUniqueInput>>;
  update?: InputMaybe<Array<LotUpdateWithWhereUniqueWithoutFileInput>>;
  updateMany?: InputMaybe<Array<LotUpdateManyWithWhereWithoutFileInput>>;
  upsert?: InputMaybe<Array<LotUpsertWithWhereUniqueWithoutFileInput>>;
};

export type LotUpdateManyWithoutPortfolioNestedInput = {
  connect?: InputMaybe<Array<LotWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<LotCreateOrConnectWithoutPortfolioInput>>;
  create?: InputMaybe<Array<LotCreateWithoutPortfolioInput>>;
  createMany?: InputMaybe<LotCreateManyPortfolioInputEnvelope>;
  delete?: InputMaybe<Array<LotWhereUniqueInput>>;
  deleteMany?: InputMaybe<Array<LotScalarWhereInput>>;
  disconnect?: InputMaybe<Array<LotWhereUniqueInput>>;
  set?: InputMaybe<Array<LotWhereUniqueInput>>;
  update?: InputMaybe<Array<LotUpdateWithWhereUniqueWithoutPortfolioInput>>;
  updateMany?: InputMaybe<Array<LotUpdateManyWithWhereWithoutPortfolioInput>>;
  upsert?: InputMaybe<Array<LotUpsertWithWhereUniqueWithoutPortfolioInput>>;
};

export type LotUpdateManyWithoutPositionNestedInput = {
  connect?: InputMaybe<Array<LotWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<LotCreateOrConnectWithoutPositionInput>>;
  create?: InputMaybe<Array<LotCreateWithoutPositionInput>>;
  createMany?: InputMaybe<LotCreateManyPositionInputEnvelope>;
  delete?: InputMaybe<Array<LotWhereUniqueInput>>;
  deleteMany?: InputMaybe<Array<LotScalarWhereInput>>;
  disconnect?: InputMaybe<Array<LotWhereUniqueInput>>;
  set?: InputMaybe<Array<LotWhereUniqueInput>>;
  update?: InputMaybe<Array<LotUpdateWithWhereUniqueWithoutPositionInput>>;
  updateMany?: InputMaybe<Array<LotUpdateManyWithWhereWithoutPositionInput>>;
  upsert?: InputMaybe<Array<LotUpsertWithWhereUniqueWithoutPositionInput>>;
};

export type LotUpdateOneWithoutHarvestTransactionItemsNestedInput = {
  connect?: InputMaybe<LotWhereUniqueInput>;
  connectOrCreate?: InputMaybe<LotCreateOrConnectWithoutHarvestTransactionItemsInput>;
  create?: InputMaybe<LotCreateWithoutHarvestTransactionItemsInput>;
  delete?: InputMaybe<LotWhereInput>;
  disconnect?: InputMaybe<LotWhereInput>;
  update?: InputMaybe<LotUpdateToOneWithWhereWithoutHarvestTransactionItemsInput>;
  upsert?: InputMaybe<LotUpsertWithoutHarvestTransactionItemsInput>;
};

export type LotUpdateOneWithoutLotChangeLogNestedInput = {
  connect?: InputMaybe<LotWhereUniqueInput>;
  connectOrCreate?: InputMaybe<LotCreateOrConnectWithoutLotChangeLogInput>;
  create?: InputMaybe<LotCreateWithoutLotChangeLogInput>;
  delete?: InputMaybe<LotWhereInput>;
  disconnect?: InputMaybe<LotWhereInput>;
  update?: InputMaybe<LotUpdateToOneWithWhereWithoutLotChangeLogInput>;
  upsert?: InputMaybe<LotUpsertWithoutLotChangeLogInput>;
};

export type LotUpdateToOneWithWhereWithoutHarvestTransactionItemsInput = {
  data: LotUpdateWithoutHarvestTransactionItemsInput;
  where?: InputMaybe<LotWhereInput>;
};

export type LotUpdateToOneWithWhereWithoutLotChangeLogInput = {
  data: LotUpdateWithoutLotChangeLogInput;
  where?: InputMaybe<LotWhereInput>;
};

export type LotUpdateWithWhereUniqueWithoutAccountInput = {
  data: LotUpdateWithoutAccountInput;
  where: LotWhereUniqueInput;
};

export type LotUpdateWithWhereUniqueWithoutAssetInput = {
  data: LotUpdateWithoutAssetInput;
  where: LotWhereUniqueInput;
};

export type LotUpdateWithWhereUniqueWithoutFileInput = {
  data: LotUpdateWithoutFileInput;
  where: LotWhereUniqueInput;
};

export type LotUpdateWithWhereUniqueWithoutPortfolioInput = {
  data: LotUpdateWithoutPortfolioInput;
  where: LotWhereUniqueInput;
};

export type LotUpdateWithWhereUniqueWithoutPositionInput = {
  data: LotUpdateWithoutPositionInput;
  where: LotWhereUniqueInput;
};

export type LotUpdateWithoutAccountInput = {
  acquiredDate?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  adjPrice?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  asset?: InputMaybe<AssetUpdateOneRequiredWithoutLotsNestedInput>;
  availableQty?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  commPerShare?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  costTotal?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  exchangeRate?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  excludeFromHarvest?: InputMaybe<IntFieldUpdateOperationsInput>;
  externalId?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  feesPerShare?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  file?: InputMaybe<FileUpdateOneWithoutLotsNestedInput>;
  gainDay?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  gainDayPct?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  gainTotal?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  harvestTransactionItems?: InputMaybe<HarvestTransactionItemUpdateManyWithoutLotSoldNestedInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  legNo?: InputMaybe<NullableIntFieldUpdateOperationsInput>;
  locationCode?: InputMaybe<NullableIntFieldUpdateOperationsInput>;
  lotChangeLog?: InputMaybe<LotChangeLogUpdateManyWithoutLotNestedInput>;
  lotSourceCode?: InputMaybe<NullableIntFieldUpdateOperationsInput>;
  marketValue?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  orderNo?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  originalQty?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  paymentCurrency?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  portfolio?: InputMaybe<PortfolioUpdateOneRequiredWithoutLotsNestedInput>;
  position?: InputMaybe<PositionUpdateOneWithoutLotsNestedInput>;
  price?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  remainingQty?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  settlementCurrency?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  shortType?: InputMaybe<NullableIntFieldUpdateOperationsInput>;
  termCode?: InputMaybe<NullableIntFieldUpdateOperationsInput>;
  totalCostForGainPct?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
};

export type LotUpdateWithoutAssetInput = {
  account?: InputMaybe<AccountUpdateOneRequiredWithoutLotsNestedInput>;
  acquiredDate?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  adjPrice?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  availableQty?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  commPerShare?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  costTotal?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  exchangeRate?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  excludeFromHarvest?: InputMaybe<IntFieldUpdateOperationsInput>;
  externalId?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  feesPerShare?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  file?: InputMaybe<FileUpdateOneWithoutLotsNestedInput>;
  gainDay?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  gainDayPct?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  gainTotal?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  harvestTransactionItems?: InputMaybe<HarvestTransactionItemUpdateManyWithoutLotSoldNestedInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  legNo?: InputMaybe<NullableIntFieldUpdateOperationsInput>;
  locationCode?: InputMaybe<NullableIntFieldUpdateOperationsInput>;
  lotChangeLog?: InputMaybe<LotChangeLogUpdateManyWithoutLotNestedInput>;
  lotSourceCode?: InputMaybe<NullableIntFieldUpdateOperationsInput>;
  marketValue?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  orderNo?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  originalQty?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  paymentCurrency?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  portfolio?: InputMaybe<PortfolioUpdateOneRequiredWithoutLotsNestedInput>;
  position?: InputMaybe<PositionUpdateOneWithoutLotsNestedInput>;
  price?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  remainingQty?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  settlementCurrency?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  shortType?: InputMaybe<NullableIntFieldUpdateOperationsInput>;
  termCode?: InputMaybe<NullableIntFieldUpdateOperationsInput>;
  totalCostForGainPct?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
};

export type LotUpdateWithoutFileInput = {
  account?: InputMaybe<AccountUpdateOneRequiredWithoutLotsNestedInput>;
  acquiredDate?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  adjPrice?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  asset?: InputMaybe<AssetUpdateOneRequiredWithoutLotsNestedInput>;
  availableQty?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  commPerShare?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  costTotal?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  exchangeRate?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  excludeFromHarvest?: InputMaybe<IntFieldUpdateOperationsInput>;
  externalId?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  feesPerShare?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  gainDay?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  gainDayPct?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  gainTotal?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  harvestTransactionItems?: InputMaybe<HarvestTransactionItemUpdateManyWithoutLotSoldNestedInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  legNo?: InputMaybe<NullableIntFieldUpdateOperationsInput>;
  locationCode?: InputMaybe<NullableIntFieldUpdateOperationsInput>;
  lotChangeLog?: InputMaybe<LotChangeLogUpdateManyWithoutLotNestedInput>;
  lotSourceCode?: InputMaybe<NullableIntFieldUpdateOperationsInput>;
  marketValue?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  orderNo?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  originalQty?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  paymentCurrency?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  portfolio?: InputMaybe<PortfolioUpdateOneRequiredWithoutLotsNestedInput>;
  position?: InputMaybe<PositionUpdateOneWithoutLotsNestedInput>;
  price?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  remainingQty?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  settlementCurrency?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  shortType?: InputMaybe<NullableIntFieldUpdateOperationsInput>;
  termCode?: InputMaybe<NullableIntFieldUpdateOperationsInput>;
  totalCostForGainPct?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
};

export type LotUpdateWithoutHarvestTransactionItemsInput = {
  account?: InputMaybe<AccountUpdateOneRequiredWithoutLotsNestedInput>;
  acquiredDate?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  adjPrice?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  asset?: InputMaybe<AssetUpdateOneRequiredWithoutLotsNestedInput>;
  availableQty?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  commPerShare?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  costTotal?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  exchangeRate?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  excludeFromHarvest?: InputMaybe<IntFieldUpdateOperationsInput>;
  externalId?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  feesPerShare?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  file?: InputMaybe<FileUpdateOneWithoutLotsNestedInput>;
  gainDay?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  gainDayPct?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  gainTotal?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  legNo?: InputMaybe<NullableIntFieldUpdateOperationsInput>;
  locationCode?: InputMaybe<NullableIntFieldUpdateOperationsInput>;
  lotChangeLog?: InputMaybe<LotChangeLogUpdateManyWithoutLotNestedInput>;
  lotSourceCode?: InputMaybe<NullableIntFieldUpdateOperationsInput>;
  marketValue?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  orderNo?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  originalQty?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  paymentCurrency?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  portfolio?: InputMaybe<PortfolioUpdateOneRequiredWithoutLotsNestedInput>;
  position?: InputMaybe<PositionUpdateOneWithoutLotsNestedInput>;
  price?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  remainingQty?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  settlementCurrency?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  shortType?: InputMaybe<NullableIntFieldUpdateOperationsInput>;
  termCode?: InputMaybe<NullableIntFieldUpdateOperationsInput>;
  totalCostForGainPct?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
};

export type LotUpdateWithoutLotChangeLogInput = {
  account?: InputMaybe<AccountUpdateOneRequiredWithoutLotsNestedInput>;
  acquiredDate?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  adjPrice?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  asset?: InputMaybe<AssetUpdateOneRequiredWithoutLotsNestedInput>;
  availableQty?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  commPerShare?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  costTotal?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  exchangeRate?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  excludeFromHarvest?: InputMaybe<IntFieldUpdateOperationsInput>;
  externalId?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  feesPerShare?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  file?: InputMaybe<FileUpdateOneWithoutLotsNestedInput>;
  gainDay?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  gainDayPct?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  gainTotal?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  harvestTransactionItems?: InputMaybe<HarvestTransactionItemUpdateManyWithoutLotSoldNestedInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  legNo?: InputMaybe<NullableIntFieldUpdateOperationsInput>;
  locationCode?: InputMaybe<NullableIntFieldUpdateOperationsInput>;
  lotSourceCode?: InputMaybe<NullableIntFieldUpdateOperationsInput>;
  marketValue?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  orderNo?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  originalQty?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  paymentCurrency?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  portfolio?: InputMaybe<PortfolioUpdateOneRequiredWithoutLotsNestedInput>;
  position?: InputMaybe<PositionUpdateOneWithoutLotsNestedInput>;
  price?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  remainingQty?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  settlementCurrency?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  shortType?: InputMaybe<NullableIntFieldUpdateOperationsInput>;
  termCode?: InputMaybe<NullableIntFieldUpdateOperationsInput>;
  totalCostForGainPct?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
};

export type LotUpdateWithoutPortfolioInput = {
  account?: InputMaybe<AccountUpdateOneRequiredWithoutLotsNestedInput>;
  acquiredDate?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  adjPrice?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  asset?: InputMaybe<AssetUpdateOneRequiredWithoutLotsNestedInput>;
  availableQty?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  commPerShare?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  costTotal?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  exchangeRate?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  excludeFromHarvest?: InputMaybe<IntFieldUpdateOperationsInput>;
  externalId?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  feesPerShare?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  file?: InputMaybe<FileUpdateOneWithoutLotsNestedInput>;
  gainDay?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  gainDayPct?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  gainTotal?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  harvestTransactionItems?: InputMaybe<HarvestTransactionItemUpdateManyWithoutLotSoldNestedInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  legNo?: InputMaybe<NullableIntFieldUpdateOperationsInput>;
  locationCode?: InputMaybe<NullableIntFieldUpdateOperationsInput>;
  lotChangeLog?: InputMaybe<LotChangeLogUpdateManyWithoutLotNestedInput>;
  lotSourceCode?: InputMaybe<NullableIntFieldUpdateOperationsInput>;
  marketValue?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  orderNo?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  originalQty?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  paymentCurrency?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  position?: InputMaybe<PositionUpdateOneWithoutLotsNestedInput>;
  price?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  remainingQty?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  settlementCurrency?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  shortType?: InputMaybe<NullableIntFieldUpdateOperationsInput>;
  termCode?: InputMaybe<NullableIntFieldUpdateOperationsInput>;
  totalCostForGainPct?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
};

export type LotUpdateWithoutPositionInput = {
  account?: InputMaybe<AccountUpdateOneRequiredWithoutLotsNestedInput>;
  acquiredDate?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  adjPrice?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  asset?: InputMaybe<AssetUpdateOneRequiredWithoutLotsNestedInput>;
  availableQty?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  commPerShare?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  costTotal?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  exchangeRate?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  excludeFromHarvest?: InputMaybe<IntFieldUpdateOperationsInput>;
  externalId?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  feesPerShare?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  file?: InputMaybe<FileUpdateOneWithoutLotsNestedInput>;
  gainDay?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  gainDayPct?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  gainTotal?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  harvestTransactionItems?: InputMaybe<HarvestTransactionItemUpdateManyWithoutLotSoldNestedInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  legNo?: InputMaybe<NullableIntFieldUpdateOperationsInput>;
  locationCode?: InputMaybe<NullableIntFieldUpdateOperationsInput>;
  lotChangeLog?: InputMaybe<LotChangeLogUpdateManyWithoutLotNestedInput>;
  lotSourceCode?: InputMaybe<NullableIntFieldUpdateOperationsInput>;
  marketValue?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  orderNo?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  originalQty?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  paymentCurrency?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  portfolio?: InputMaybe<PortfolioUpdateOneRequiredWithoutLotsNestedInput>;
  price?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  remainingQty?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  settlementCurrency?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  shortType?: InputMaybe<NullableIntFieldUpdateOperationsInput>;
  termCode?: InputMaybe<NullableIntFieldUpdateOperationsInput>;
  totalCostForGainPct?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
};

export type LotUpsertWithWhereUniqueWithoutAccountInput = {
  create: LotCreateWithoutAccountInput;
  update: LotUpdateWithoutAccountInput;
  where: LotWhereUniqueInput;
};

export type LotUpsertWithWhereUniqueWithoutAssetInput = {
  create: LotCreateWithoutAssetInput;
  update: LotUpdateWithoutAssetInput;
  where: LotWhereUniqueInput;
};

export type LotUpsertWithWhereUniqueWithoutFileInput = {
  create: LotCreateWithoutFileInput;
  update: LotUpdateWithoutFileInput;
  where: LotWhereUniqueInput;
};

export type LotUpsertWithWhereUniqueWithoutPortfolioInput = {
  create: LotCreateWithoutPortfolioInput;
  update: LotUpdateWithoutPortfolioInput;
  where: LotWhereUniqueInput;
};

export type LotUpsertWithWhereUniqueWithoutPositionInput = {
  create: LotCreateWithoutPositionInput;
  update: LotUpdateWithoutPositionInput;
  where: LotWhereUniqueInput;
};

export type LotUpsertWithoutHarvestTransactionItemsInput = {
  create: LotCreateWithoutHarvestTransactionItemsInput;
  update: LotUpdateWithoutHarvestTransactionItemsInput;
  where?: InputMaybe<LotWhereInput>;
};

export type LotUpsertWithoutLotChangeLogInput = {
  create: LotCreateWithoutLotChangeLogInput;
  update: LotUpdateWithoutLotChangeLogInput;
  where?: InputMaybe<LotWhereInput>;
};

export enum LotValueType {
  Gain = 'GAIN',
  Loss = 'LOSS'
}

export type LotWhereInput = {
  AND?: InputMaybe<Array<LotWhereInput>>;
  NOT?: InputMaybe<Array<LotWhereInput>>;
  OR?: InputMaybe<Array<LotWhereInput>>;
  account?: InputMaybe<AccountScalarRelationFilter>;
  accountId?: InputMaybe<UuidFilter>;
  acquiredDate?: InputMaybe<DateTimeFilter>;
  adjPrice?: InputMaybe<DecimalNullableFilter>;
  asset?: InputMaybe<AssetScalarRelationFilter>;
  assetSymbol?: InputMaybe<StringFilter>;
  availableQty?: InputMaybe<DecimalNullableFilter>;
  commPerShare?: InputMaybe<DecimalNullableFilter>;
  costTotal?: InputMaybe<DecimalNullableFilter>;
  createdAt?: InputMaybe<DateTimeFilter>;
  exchangeRate?: InputMaybe<DecimalNullableFilter>;
  excludeFromHarvest?: InputMaybe<IntFilter>;
  externalId?: InputMaybe<StringNullableFilter>;
  feesPerShare?: InputMaybe<DecimalNullableFilter>;
  file?: InputMaybe<FileNullableScalarRelationFilter>;
  fileId?: InputMaybe<UuidNullableFilter>;
  gainDay?: InputMaybe<DecimalNullableFilter>;
  gainDayPct?: InputMaybe<DecimalNullableFilter>;
  gainTotal?: InputMaybe<DecimalNullableFilter>;
  harvestTransactionItems?: InputMaybe<HarvestTransactionItemListRelationFilter>;
  id?: InputMaybe<UuidFilter>;
  legNo?: InputMaybe<IntNullableFilter>;
  locationCode?: InputMaybe<IntNullableFilter>;
  lotChangeLog?: InputMaybe<LotChangeLogListRelationFilter>;
  lotSourceCode?: InputMaybe<IntNullableFilter>;
  marketValue?: InputMaybe<DecimalNullableFilter>;
  orderNo?: InputMaybe<DecimalNullableFilter>;
  originalQty?: InputMaybe<DecimalNullableFilter>;
  paymentCurrency?: InputMaybe<StringNullableFilter>;
  portfolio?: InputMaybe<PortfolioScalarRelationFilter>;
  portfolioId?: InputMaybe<UuidFilter>;
  position?: InputMaybe<PositionNullableScalarRelationFilter>;
  positionId?: InputMaybe<UuidNullableFilter>;
  price?: InputMaybe<DecimalFilter>;
  remainingQty?: InputMaybe<DecimalFilter>;
  settlementCurrency?: InputMaybe<StringNullableFilter>;
  shortType?: InputMaybe<IntNullableFilter>;
  termCode?: InputMaybe<IntNullableFilter>;
  totalCostForGainPct?: InputMaybe<DecimalNullableFilter>;
  updatedAt?: InputMaybe<DateTimeFilter>;
};

export type LotWhereUniqueInput = {
  AND?: InputMaybe<Array<LotWhereInput>>;
  NOT?: InputMaybe<Array<LotWhereInput>>;
  OR?: InputMaybe<Array<LotWhereInput>>;
  account?: InputMaybe<AccountScalarRelationFilter>;
  accountId?: InputMaybe<UuidFilter>;
  acquiredDate?: InputMaybe<DateTimeFilter>;
  adjPrice?: InputMaybe<DecimalNullableFilter>;
  asset?: InputMaybe<AssetScalarRelationFilter>;
  assetSymbol?: InputMaybe<StringFilter>;
  availableQty?: InputMaybe<DecimalNullableFilter>;
  commPerShare?: InputMaybe<DecimalNullableFilter>;
  costTotal?: InputMaybe<DecimalNullableFilter>;
  createdAt?: InputMaybe<DateTimeFilter>;
  exchangeRate?: InputMaybe<DecimalNullableFilter>;
  excludeFromHarvest?: InputMaybe<IntFilter>;
  externalId?: InputMaybe<StringNullableFilter>;
  feesPerShare?: InputMaybe<DecimalNullableFilter>;
  file?: InputMaybe<FileNullableScalarRelationFilter>;
  fileId?: InputMaybe<UuidNullableFilter>;
  gainDay?: InputMaybe<DecimalNullableFilter>;
  gainDayPct?: InputMaybe<DecimalNullableFilter>;
  gainTotal?: InputMaybe<DecimalNullableFilter>;
  harvestTransactionItems?: InputMaybe<HarvestTransactionItemListRelationFilter>;
  id?: InputMaybe<Scalars['String']['input']>;
  legNo?: InputMaybe<IntNullableFilter>;
  locationCode?: InputMaybe<IntNullableFilter>;
  lotChangeLog?: InputMaybe<LotChangeLogListRelationFilter>;
  lotSourceCode?: InputMaybe<IntNullableFilter>;
  marketValue?: InputMaybe<DecimalNullableFilter>;
  orderNo?: InputMaybe<DecimalNullableFilter>;
  originalQty?: InputMaybe<DecimalNullableFilter>;
  paymentCurrency?: InputMaybe<StringNullableFilter>;
  portfolio?: InputMaybe<PortfolioScalarRelationFilter>;
  portfolioId?: InputMaybe<UuidFilter>;
  position?: InputMaybe<PositionNullableScalarRelationFilter>;
  positionId?: InputMaybe<UuidNullableFilter>;
  positionId_externalId?: InputMaybe<LotPositionIdExternalIdCompoundUniqueInput>;
  price?: InputMaybe<DecimalFilter>;
  remainingQty?: InputMaybe<DecimalFilter>;
  settlementCurrency?: InputMaybe<StringNullableFilter>;
  shortType?: InputMaybe<IntNullableFilter>;
  termCode?: InputMaybe<IntNullableFilter>;
  totalCostForGainPct?: InputMaybe<DecimalNullableFilter>;
  updatedAt?: InputMaybe<DateTimeFilter>;
};

export type Mutation = {
  __typename?: 'Mutation';
  accessOauthConnection: AuthConnectionExt;
  /** Add User to Portfolio. True if user added, False if user is invited as they do not exist */
  addUserToPortfolio: Scalars['Boolean']['output'];
  /** Create a new connected account */
  createAccountForPortfolio: Account;
  createFiles: Array<File>;
  /** Create harvest based on selected DirectedHarvestLot */
  createHarvest: Harvest;
  /** Create a portfolio for a user */
  createPortfolio: Portfolio;
  /** Delete multiple harvests by their IDs */
  deleteHarvests: Scalars['Boolean']['output'];
  /** Finalize harvest for review */
  finalizeHarvest: Harvest;
  initAccountFileUpload: Array<File>;
  /** Invite User to Platform */
  inviteUsersToPlatform: Scalars['Boolean']['output'];
  /** Remove User from Portfolio */
  removeUserFromPortfolio: Scalars['Boolean']['output'];
  sendNotificationsByFrequency: Scalars['Boolean']['output'];
  sendWashSaleNotificationsForDate: Scalars['Boolean']['output'];
  /** Set up plaid auth connection and create accounts from syncing plaid */
  setAccessTokenAndSyncAccounts: Array<Account>;
  /** Log the user into a different portfolio */
  switchPortfolio: Portfolio;
  syncAuthConnection: AuthConnectionExt;
  /** Update a connected account */
  updateAccount: Account;
  /** Update last price of every asset */
  updateAllAssetPrices: Scalars['String']['output'];
  /** Update a Harvest */
  updateHarvest: Harvest;
  /** Update a Harvest transaction */
  updateHarvestTransaction: HarvestTransaction;
  /** Update a HarvestTransactionItem */
  updateHarvestTransactionItem: HarvestTransactionItem;
  /** Pull hourly price data for all assets within the window. */
  updateHourlyAssetPrices: Scalars['String']['output'];
  /** Update a portfolio */
  updatePortfolio: Portfolio;
  /** Update RealizedPAndL */
  updateRealizedPAndL: RealizedPAndL;
  /** Update User */
  updateUser: User;
  /** Update a user */
  updateUserById: User;
  /** Update User Favorites */
  updateUserFavorites: User;
};


export type MutationAccessOauthConnectionArgs = {
  authSource: AuthSource;
  portfolioId: Scalars['String']['input'];
  verifier: Scalars['String']['input'];
};


export type MutationAddUserToPortfolioArgs = {
  email: Scalars['String']['input'];
};


export type MutationCreateAccountForPortfolioArgs = {
  accountCreateInput: AccountCreateInput;
};


export type MutationCreateFilesArgs = {
  data: Array<FileCreateManyInput>;
};


export type MutationCreateHarvestArgs = {
  directedHarvestLots: Array<DirectedHarvestLot>;
  harvestType: HarvestType;
};


export type MutationCreatePortfolioArgs = {
  portfolioInsertObject: PortfolioCreateInput;
};


export type MutationDeleteHarvestsArgs = {
  ids: Array<Scalars['String']['input']>;
};


export type MutationFinalizeHarvestArgs = {
  id?: InputMaybe<Scalars['String']['input']>;
};


export type MutationInitAccountFileUploadArgs = {
  accountData: InitAccountFileUploadPayload;
  fileData: Array<InitFileUploadPayload>;
};


export type MutationInviteUsersToPlatformArgs = {
  emails: Array<Scalars['String']['input']>;
};


export type MutationRemoveUserFromPortfolioArgs = {
  userId: Scalars['String']['input'];
};


export type MutationSendNotificationsByFrequencyArgs = {
  frequency: HarvestNotificationFrequency;
};


export type MutationSendWashSaleNotificationsForDateArgs = {
  date: Scalars['DateTime']['input'];
};


export type MutationSetAccessTokenAndSyncAccountsArgs = {
  metaData: PlaidLinkOnSuccessMetadata;
  publicToken: Scalars['String']['input'];
};


export type MutationSwitchPortfolioArgs = {
  porfolioId: Scalars['String']['input'];
};


export type MutationSyncAuthConnectionArgs = {
  id: Scalars['String']['input'];
};


export type MutationUpdateAccountArgs = {
  accountUpdateInput: AccountUpdateInput;
  accountWhereUniqueInput: AccountWhereUniqueInput;
};


export type MutationUpdateHarvestArgs = {
  data?: InputMaybe<HarvestUpdateInput>;
  id?: InputMaybe<Scalars['String']['input']>;
};


export type MutationUpdateHarvestTransactionArgs = {
  data?: InputMaybe<HarvestTransactionUpdateInput>;
  id?: InputMaybe<Scalars['String']['input']>;
};


export type MutationUpdateHarvestTransactionItemArgs = {
  data?: InputMaybe<HarvestTransactionItemUpdateInput>;
  id?: InputMaybe<Scalars['String']['input']>;
};


export type MutationUpdateHourlyAssetPricesArgs = {
  from: Scalars['DateTime']['input'];
  to: Scalars['DateTime']['input'];
};


export type MutationUpdatePortfolioArgs = {
  data: PortfolioUpdateInput;
};


export type MutationUpdateRealizedPAndLArgs = {
  id: Scalars['String']['input'];
  input: RealizedPAndLUpdateInput;
};


export type MutationUpdateUserArgs = {
  data: UserUpdateInput;
};


export type MutationUpdateUserByIdArgs = {
  updateUserInput: UserUpdateInput;
};


export type MutationUpdateUserFavoritesArgs = {
  data: UserUpdateInput;
};

export type NestedBoolFilter = {
  equals?: InputMaybe<Scalars['Boolean']['input']>;
  not?: InputMaybe<NestedBoolFilter>;
};

export type NestedDateTimeFilter = {
  equals?: InputMaybe<Scalars['DateTime']['input']>;
  gt?: InputMaybe<Scalars['DateTime']['input']>;
  gte?: InputMaybe<Scalars['DateTime']['input']>;
  in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
  lt?: InputMaybe<Scalars['DateTime']['input']>;
  lte?: InputMaybe<Scalars['DateTime']['input']>;
  not?: InputMaybe<NestedDateTimeFilter>;
  notIn?: InputMaybe<Array<Scalars['DateTime']['input']>>;
};

export type NestedDateTimeNullableFilter = {
  equals?: InputMaybe<Scalars['DateTime']['input']>;
  gt?: InputMaybe<Scalars['DateTime']['input']>;
  gte?: InputMaybe<Scalars['DateTime']['input']>;
  in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
  lt?: InputMaybe<Scalars['DateTime']['input']>;
  lte?: InputMaybe<Scalars['DateTime']['input']>;
  not?: InputMaybe<NestedDateTimeNullableFilter>;
  notIn?: InputMaybe<Array<Scalars['DateTime']['input']>>;
};

export type NestedDecimalFilter = {
  equals?: InputMaybe<Scalars['Decimal']['input']>;
  gt?: InputMaybe<Scalars['Decimal']['input']>;
  gte?: InputMaybe<Scalars['Decimal']['input']>;
  in?: InputMaybe<Array<Scalars['Decimal']['input']>>;
  lt?: InputMaybe<Scalars['Decimal']['input']>;
  lte?: InputMaybe<Scalars['Decimal']['input']>;
  not?: InputMaybe<NestedDecimalFilter>;
  notIn?: InputMaybe<Array<Scalars['Decimal']['input']>>;
};

export type NestedDecimalNullableFilter = {
  equals?: InputMaybe<Scalars['Decimal']['input']>;
  gt?: InputMaybe<Scalars['Decimal']['input']>;
  gte?: InputMaybe<Scalars['Decimal']['input']>;
  in?: InputMaybe<Array<Scalars['Decimal']['input']>>;
  lt?: InputMaybe<Scalars['Decimal']['input']>;
  lte?: InputMaybe<Scalars['Decimal']['input']>;
  not?: InputMaybe<NestedDecimalNullableFilter>;
  notIn?: InputMaybe<Array<Scalars['Decimal']['input']>>;
};

export type NestedEnumAccountInstitutionNullableFilter = {
  equals?: InputMaybe<AccountInstitution>;
  in?: InputMaybe<Array<AccountInstitution>>;
  not?: InputMaybe<NestedEnumAccountInstitutionNullableFilter>;
  notIn?: InputMaybe<Array<AccountInstitution>>;
};

export type NestedEnumAccountModeNullableFilter = {
  equals?: InputMaybe<AccountMode>;
  in?: InputMaybe<Array<AccountMode>>;
  not?: InputMaybe<NestedEnumAccountModeNullableFilter>;
  notIn?: InputMaybe<Array<AccountMode>>;
};

export type NestedEnumAccountProviderFilter = {
  equals?: InputMaybe<AccountProvider>;
  in?: InputMaybe<Array<AccountProvider>>;
  not?: InputMaybe<NestedEnumAccountProviderFilter>;
  notIn?: InputMaybe<Array<AccountProvider>>;
};

export type NestedEnumAccountStatusFilter = {
  equals?: InputMaybe<AccountStatus>;
  in?: InputMaybe<Array<AccountStatus>>;
  not?: InputMaybe<NestedEnumAccountStatusFilter>;
  notIn?: InputMaybe<Array<AccountStatus>>;
};

export type NestedEnumAssetClassFilter = {
  equals?: InputMaybe<AssetClass>;
  in?: InputMaybe<Array<AssetClass>>;
  not?: InputMaybe<NestedEnumAssetClassFilter>;
  notIn?: InputMaybe<Array<AssetClass>>;
};

export type NestedEnumAssetLocaleFilter = {
  equals?: InputMaybe<AssetLocale>;
  in?: InputMaybe<Array<AssetLocale>>;
  not?: InputMaybe<NestedEnumAssetLocaleFilter>;
  notIn?: InputMaybe<Array<AssetLocale>>;
};

export type NestedEnumAuthSourceFilter = {
  equals?: InputMaybe<AuthSource>;
  in?: InputMaybe<Array<AuthSource>>;
  not?: InputMaybe<NestedEnumAuthSourceFilter>;
  notIn?: InputMaybe<Array<AuthSource>>;
};

export type NestedEnumAuthSourceNullableFilter = {
  equals?: InputMaybe<AuthSource>;
  in?: InputMaybe<Array<AuthSource>>;
  not?: InputMaybe<NestedEnumAuthSourceNullableFilter>;
  notIn?: InputMaybe<Array<AuthSource>>;
};

export type NestedEnumAuthTypeFilter = {
  equals?: InputMaybe<AuthType>;
  in?: InputMaybe<Array<AuthType>>;
  not?: InputMaybe<NestedEnumAuthTypeFilter>;
  notIn?: InputMaybe<Array<AuthType>>;
};

export type NestedEnumFileTypeFilter = {
  equals?: InputMaybe<FileType>;
  in?: InputMaybe<Array<FileType>>;
  not?: InputMaybe<NestedEnumFileTypeFilter>;
  notIn?: InputMaybe<Array<FileType>>;
};

export type NestedEnumGraphFilter = {
  equals?: InputMaybe<Graph>;
  in?: InputMaybe<Array<Graph>>;
  not?: InputMaybe<NestedEnumGraphFilter>;
  notIn?: InputMaybe<Array<Graph>>;
};

export type NestedEnumHarvestNotificationFrequencyFilter = {
  equals?: InputMaybe<HarvestNotificationFrequency>;
  in?: InputMaybe<Array<HarvestNotificationFrequency>>;
  not?: InputMaybe<NestedEnumHarvestNotificationFrequencyFilter>;
  notIn?: InputMaybe<Array<HarvestNotificationFrequency>>;
};

export type NestedEnumHarvestStepFilter = {
  equals?: InputMaybe<HarvestStep>;
  in?: InputMaybe<Array<HarvestStep>>;
  not?: InputMaybe<NestedEnumHarvestStepFilter>;
  notIn?: InputMaybe<Array<HarvestStep>>;
};

export type NestedEnumHarvestTypeFilter = {
  equals?: InputMaybe<HarvestType>;
  in?: InputMaybe<Array<HarvestType>>;
  not?: InputMaybe<NestedEnumHarvestTypeFilter>;
  notIn?: InputMaybe<Array<HarvestType>>;
};

export type NestedEnumLogTypeFilter = {
  equals?: InputMaybe<LogType>;
  in?: InputMaybe<Array<LogType>>;
  not?: InputMaybe<NestedEnumLogTypeFilter>;
  notIn?: InputMaybe<Array<LogType>>;
};

export type NestedEnumOperationTypeFilter = {
  equals?: InputMaybe<OperationType>;
  in?: InputMaybe<Array<OperationType>>;
  not?: InputMaybe<NestedEnumOperationTypeFilter>;
  notIn?: InputMaybe<Array<OperationType>>;
};

export type NestedEnumOptionLevelNullableFilter = {
  equals?: InputMaybe<OptionLevel>;
  in?: InputMaybe<Array<OptionLevel>>;
  not?: InputMaybe<NestedEnumOptionLevelNullableFilter>;
  notIn?: InputMaybe<Array<OptionLevel>>;
};

export type NestedEnumOrderTypeFilter = {
  equals?: InputMaybe<OrderType>;
  in?: InputMaybe<Array<OrderType>>;
  not?: InputMaybe<NestedEnumOrderTypeFilter>;
  notIn?: InputMaybe<Array<OrderType>>;
};

export type NestedEnumPortfolioRoleFilter = {
  equals?: InputMaybe<PortfolioRole>;
  in?: InputMaybe<Array<PortfolioRole>>;
  not?: InputMaybe<NestedEnumPortfolioRoleFilter>;
  notIn?: InputMaybe<Array<PortfolioRole>>;
};

export type NestedEnumVectorWindowFilter = {
  equals?: InputMaybe<VectorWindow>;
  in?: InputMaybe<Array<VectorWindow>>;
  not?: InputMaybe<NestedEnumVectorWindowFilter>;
  notIn?: InputMaybe<Array<VectorWindow>>;
};

export type NestedIntFilter = {
  equals?: InputMaybe<Scalars['Int']['input']>;
  gt?: InputMaybe<Scalars['Int']['input']>;
  gte?: InputMaybe<Scalars['Int']['input']>;
  in?: InputMaybe<Array<Scalars['Int']['input']>>;
  lt?: InputMaybe<Scalars['Int']['input']>;
  lte?: InputMaybe<Scalars['Int']['input']>;
  not?: InputMaybe<NestedIntFilter>;
  notIn?: InputMaybe<Array<Scalars['Int']['input']>>;
};

export type NestedIntNullableFilter = {
  equals?: InputMaybe<Scalars['Int']['input']>;
  gt?: InputMaybe<Scalars['Int']['input']>;
  gte?: InputMaybe<Scalars['Int']['input']>;
  in?: InputMaybe<Array<Scalars['Int']['input']>>;
  lt?: InputMaybe<Scalars['Int']['input']>;
  lte?: InputMaybe<Scalars['Int']['input']>;
  not?: InputMaybe<NestedIntNullableFilter>;
  notIn?: InputMaybe<Array<Scalars['Int']['input']>>;
};

export type NestedStringFilter = {
  contains?: InputMaybe<Scalars['String']['input']>;
  endsWith?: InputMaybe<Scalars['String']['input']>;
  equals?: InputMaybe<Scalars['String']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<Scalars['String']['input']>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  not?: InputMaybe<NestedStringFilter>;
  notIn?: InputMaybe<Array<Scalars['String']['input']>>;
  startsWith?: InputMaybe<Scalars['String']['input']>;
};

export type NestedStringNullableFilter = {
  contains?: InputMaybe<Scalars['String']['input']>;
  endsWith?: InputMaybe<Scalars['String']['input']>;
  equals?: InputMaybe<Scalars['String']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<Scalars['String']['input']>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  not?: InputMaybe<NestedStringNullableFilter>;
  notIn?: InputMaybe<Array<Scalars['String']['input']>>;
  startsWith?: InputMaybe<Scalars['String']['input']>;
};

export type NestedUuidFilter = {
  equals?: InputMaybe<Scalars['String']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<Scalars['String']['input']>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  not?: InputMaybe<NestedUuidFilter>;
  notIn?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type NestedUuidNullableFilter = {
  equals?: InputMaybe<Scalars['String']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<Scalars['String']['input']>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  not?: InputMaybe<NestedUuidNullableFilter>;
  notIn?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type NullableDateTimeFieldUpdateOperationsInput = {
  set?: InputMaybe<Scalars['DateTime']['input']>;
};

export type NullableDecimalFieldUpdateOperationsInput = {
  decrement?: InputMaybe<Scalars['Decimal']['input']>;
  divide?: InputMaybe<Scalars['Decimal']['input']>;
  increment?: InputMaybe<Scalars['Decimal']['input']>;
  multiply?: InputMaybe<Scalars['Decimal']['input']>;
  set?: InputMaybe<Scalars['Decimal']['input']>;
};

export type NullableEnumAccountInstitutionFieldUpdateOperationsInput = {
  set?: InputMaybe<AccountInstitution>;
};

export type NullableEnumAccountModeFieldUpdateOperationsInput = {
  set?: InputMaybe<AccountMode>;
};

export type NullableEnumAuthSourceFieldUpdateOperationsInput = {
  set?: InputMaybe<AuthSource>;
};

export type NullableEnumOptionLevelFieldUpdateOperationsInput = {
  set?: InputMaybe<OptionLevel>;
};

export type NullableIntFieldUpdateOperationsInput = {
  decrement?: InputMaybe<Scalars['Int']['input']>;
  divide?: InputMaybe<Scalars['Int']['input']>;
  increment?: InputMaybe<Scalars['Int']['input']>;
  multiply?: InputMaybe<Scalars['Int']['input']>;
  set?: InputMaybe<Scalars['Int']['input']>;
};

export type NullableStringFieldUpdateOperationsInput = {
  set?: InputMaybe<Scalars['String']['input']>;
};

export enum OperationType {
  Create = 'create',
  Delete = 'delete',
  Update = 'update'
}

export enum OptionLevel {
  Level_1 = 'LEVEL_1',
  Level_2 = 'LEVEL_2',
  Level_3 = 'LEVEL_3',
  Level_4 = 'LEVEL_4',
  NoOptions = 'NO_OPTIONS'
}

export enum OrderType {
  Buy = 'BUY',
  BuyToClose = 'BUY_TO_CLOSE',
  BuyToOpen = 'BUY_TO_OPEN',
  Sell = 'SELL',
  SellToClose = 'SELL_TO_CLOSE',
  SellToOpen = 'SELL_TO_OPEN'
}

export type PaginationProps = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};

export type PlaidAccount = {
  id: Scalars['String']['input'];
  mask: Scalars['String']['input'];
  name: Scalars['String']['input'];
  subtype?: InputMaybe<Scalars['String']['input']>;
  type: Scalars['String']['input'];
  verification_status?: InputMaybe<Scalars['String']['input']>;
};

export type PlaidInstitution = {
  institution_id: Scalars['String']['input'];
  name: Scalars['String']['input'];
};

export type PlaidLinkOnSuccessMetadata = {
  accounts: Array<PlaidAccount>;
  institution?: InputMaybe<PlaidInstitution>;
  link_session_id: Scalars['String']['input'];
  transfer_status?: InputMaybe<Scalars['String']['input']>;
};

export type PolygonStockData = {
  __typename?: 'PolygonStockData';
  /** The close price for the symbol in the given time period. */
  c?: Maybe<Scalars['Float']['output']>;
  /** The highest price for the symbol in the given time period. */
  h?: Maybe<Scalars['Float']['output']>;
  /** The lowest price for the symbol in the given time period. */
  l?: Maybe<Scalars['Float']['output']>;
  /** The number of transactions in the aggregate window. */
  n?: Maybe<Scalars['Float']['output']>;
  /** The open price for the symbol in the given time period. */
  o?: Maybe<Scalars['Float']['output']>;
  /** The Unix Msec timestamp for the start of the aggregate window. */
  t?: Maybe<Scalars['Float']['output']>;
  /** The trading volume of the symbol in the given time period. */
  v?: Maybe<Scalars['Float']['output']>;
  /** The volume weighted average price. */
  vw?: Maybe<Scalars['Float']['output']>;
};

export type Portfolio = {
  __typename?: 'Portfolio';
  _count: PortfolioCount;
  accounts?: Maybe<Array<Account>>;
  authConnections?: Maybe<Array<AuthConnection>>;
  createdAt: Scalars['DateTime']['output'];
  createdBy: User;
  createdById: Scalars['String']['output'];
  endOfYearTaxOpportunityNotification: Scalars['Boolean']['output'];
  files?: Maybe<Array<File>>;
  /** How often should we harvest for the portfolio */
  harvestCycleWeeks: Scalars['Int']['output'];
  /** How much $ amount does a single share need to exceed to be a valid harvest share (i.e. shares with a p/l lower we shouldnt even care about) */
  harvestShareDollarThreshold: Scalars['Decimal']['output'];
  /** As we iterate through different tickets to build a harvest, how much $ should we target before moving to the next one */
  harvestTickerBucketDollarSizeLong: Scalars['Decimal']['output'];
  /** As we iterate through different tickets to build a harvest, how much $ should we target before moving to the next one */
  harvestTickerBucketDollarSizeShort: Scalars['Decimal']['output'];
  /** How much is a valid bucket (otherwise a ticker is considered 'slop') */
  harvestTickerBucketLowerLimitLong: Scalars['Decimal']['output'];
  /** How much is a valid bucket (otherwise a ticker is considered 'slop') */
  harvestTickerBucketLowerLimitShort: Scalars['Decimal']['output'];
  harvestTransaction?: Maybe<Array<HarvestTransaction>>;
  harvestTransactionItem?: Maybe<Array<HarvestTransactionItem>>;
  harvests?: Maybe<Array<Harvest>>;
  id: Scalars['ID']['output'];
  log?: Maybe<Array<Log>>;
  lotChangeLog?: Maybe<Array<LotChangeLog>>;
  lotTransactionBatch?: Maybe<Array<LotTransactionBatch>>;
  lots?: Maybe<Array<Lot>>;
  /** Minimum p and l for a lot to be considered harvestable */
  minimumLotPAndL: Scalars['Decimal']['output'];
  name: Scalars['String']['output'];
  notificationFrequency: HarvestNotificationFrequency;
  positions?: Maybe<Array<Position>>;
  realizedPAndL?: Maybe<Array<RealizedPAndL>>;
  transactions?: Maybe<Array<Transaction>>;
  updatedAt: Scalars['DateTime']['output'];
  usersOnPortfolios?: Maybe<Array<UsersOnPortfolios>>;
};

export type PortfolioAvgAggregate = {
  __typename?: 'PortfolioAvgAggregate';
  harvestCycleWeeks?: Maybe<Scalars['Float']['output']>;
  harvestShareDollarThreshold?: Maybe<Scalars['Decimal']['output']>;
  harvestTickerBucketDollarSizeLong?: Maybe<Scalars['Decimal']['output']>;
  harvestTickerBucketDollarSizeShort?: Maybe<Scalars['Decimal']['output']>;
  harvestTickerBucketLowerLimitLong?: Maybe<Scalars['Decimal']['output']>;
  harvestTickerBucketLowerLimitShort?: Maybe<Scalars['Decimal']['output']>;
  minimumLotPAndL?: Maybe<Scalars['Decimal']['output']>;
};

export type PortfolioCount = {
  __typename?: 'PortfolioCount';
  accounts: Scalars['Int']['output'];
  authConnections: Scalars['Int']['output'];
  files: Scalars['Int']['output'];
  harvestTransaction: Scalars['Int']['output'];
  harvestTransactionItem: Scalars['Int']['output'];
  harvests: Scalars['Int']['output'];
  log: Scalars['Int']['output'];
  lotChangeLog: Scalars['Int']['output'];
  lotTransactionBatch: Scalars['Int']['output'];
  lots: Scalars['Int']['output'];
  positions: Scalars['Int']['output'];
  realizedPAndL: Scalars['Int']['output'];
  transactions: Scalars['Int']['output'];
  usersOnPortfolios: Scalars['Int']['output'];
};

export type PortfolioCountAggregate = {
  __typename?: 'PortfolioCountAggregate';
  _all: Scalars['Int']['output'];
  createdAt: Scalars['Int']['output'];
  createdById: Scalars['Int']['output'];
  endOfYearTaxOpportunityNotification: Scalars['Int']['output'];
  harvestCycleWeeks: Scalars['Int']['output'];
  harvestShareDollarThreshold: Scalars['Int']['output'];
  harvestTickerBucketDollarSizeLong: Scalars['Int']['output'];
  harvestTickerBucketDollarSizeShort: Scalars['Int']['output'];
  harvestTickerBucketLowerLimitLong: Scalars['Int']['output'];
  harvestTickerBucketLowerLimitShort: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  minimumLotPAndL: Scalars['Int']['output'];
  name: Scalars['Int']['output'];
  notificationFrequency: Scalars['Int']['output'];
  updatedAt: Scalars['Int']['output'];
};

export type PortfolioCreateInput = {
  accounts?: InputMaybe<AccountCreateNestedManyWithoutPortfolioInput>;
  authConnections?: InputMaybe<AuthConnectionCreateNestedManyWithoutPortfolioInput>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  createdBy: UserCreateNestedOneWithoutPortfolioInput;
  endOfYearTaxOpportunityNotification?: InputMaybe<Scalars['Boolean']['input']>;
  files?: InputMaybe<FileCreateNestedManyWithoutPortfolioInput>;
  harvestCycleWeeks?: InputMaybe<Scalars['Int']['input']>;
  harvestShareDollarThreshold?: InputMaybe<Scalars['Decimal']['input']>;
  harvestTickerBucketDollarSizeLong?: InputMaybe<Scalars['Decimal']['input']>;
  harvestTickerBucketDollarSizeShort?: InputMaybe<Scalars['Decimal']['input']>;
  harvestTickerBucketLowerLimitLong?: InputMaybe<Scalars['Decimal']['input']>;
  harvestTickerBucketLowerLimitShort?: InputMaybe<Scalars['Decimal']['input']>;
  harvestTransaction?: InputMaybe<HarvestTransactionCreateNestedManyWithoutPortfolioInput>;
  harvestTransactionItem?: InputMaybe<HarvestTransactionItemCreateNestedManyWithoutPortfolioInput>;
  harvests?: InputMaybe<HarvestCreateNestedManyWithoutPortfolioInput>;
  id?: InputMaybe<Scalars['String']['input']>;
  log?: InputMaybe<LogCreateNestedManyWithoutPortfolioInput>;
  lotChangeLog?: InputMaybe<LotChangeLogCreateNestedManyWithoutPortfolioInput>;
  lotTransactionBatch?: InputMaybe<LotTransactionBatchCreateNestedManyWithoutPortfolioInput>;
  lots?: InputMaybe<LotCreateNestedManyWithoutPortfolioInput>;
  minimumLotPAndL?: InputMaybe<Scalars['Decimal']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  notificationFrequency?: InputMaybe<HarvestNotificationFrequency>;
  positions?: InputMaybe<PositionCreateNestedManyWithoutPortfolioInput>;
  realizedPAndL?: InputMaybe<RealizedPAndLCreateNestedManyWithoutPortfolioInput>;
  transactions?: InputMaybe<TransactionCreateNestedManyWithoutPortfolioInput>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
  usersOnPortfolios?: InputMaybe<UsersOnPortfoliosCreateNestedManyWithoutPortfolioInput>;
};

export type PortfolioCreateManyCreatedByInput = {
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  endOfYearTaxOpportunityNotification?: InputMaybe<Scalars['Boolean']['input']>;
  harvestCycleWeeks?: InputMaybe<Scalars['Int']['input']>;
  harvestShareDollarThreshold?: InputMaybe<Scalars['Decimal']['input']>;
  harvestTickerBucketDollarSizeLong?: InputMaybe<Scalars['Decimal']['input']>;
  harvestTickerBucketDollarSizeShort?: InputMaybe<Scalars['Decimal']['input']>;
  harvestTickerBucketLowerLimitLong?: InputMaybe<Scalars['Decimal']['input']>;
  harvestTickerBucketLowerLimitShort?: InputMaybe<Scalars['Decimal']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  minimumLotPAndL?: InputMaybe<Scalars['Decimal']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  notificationFrequency?: InputMaybe<HarvestNotificationFrequency>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type PortfolioCreateManyCreatedByInputEnvelope = {
  data: Array<PortfolioCreateManyCreatedByInput>;
  skipDuplicates?: InputMaybe<Scalars['Boolean']['input']>;
};

export type PortfolioCreateNestedManyWithoutCreatedByInput = {
  connect?: InputMaybe<Array<PortfolioWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<PortfolioCreateOrConnectWithoutCreatedByInput>>;
  create?: InputMaybe<Array<PortfolioCreateWithoutCreatedByInput>>;
  createMany?: InputMaybe<PortfolioCreateManyCreatedByInputEnvelope>;
};

export type PortfolioCreateNestedOneWithoutAccountsInput = {
  connect?: InputMaybe<PortfolioWhereUniqueInput>;
  connectOrCreate?: InputMaybe<PortfolioCreateOrConnectWithoutAccountsInput>;
  create?: InputMaybe<PortfolioCreateWithoutAccountsInput>;
};

export type PortfolioCreateNestedOneWithoutAuthConnectionsInput = {
  connect?: InputMaybe<PortfolioWhereUniqueInput>;
  connectOrCreate?: InputMaybe<PortfolioCreateOrConnectWithoutAuthConnectionsInput>;
  create?: InputMaybe<PortfolioCreateWithoutAuthConnectionsInput>;
};

export type PortfolioCreateNestedOneWithoutFilesInput = {
  connect?: InputMaybe<PortfolioWhereUniqueInput>;
  connectOrCreate?: InputMaybe<PortfolioCreateOrConnectWithoutFilesInput>;
  create?: InputMaybe<PortfolioCreateWithoutFilesInput>;
};

export type PortfolioCreateNestedOneWithoutHarvestTransactionInput = {
  connect?: InputMaybe<PortfolioWhereUniqueInput>;
  connectOrCreate?: InputMaybe<PortfolioCreateOrConnectWithoutHarvestTransactionInput>;
  create?: InputMaybe<PortfolioCreateWithoutHarvestTransactionInput>;
};

export type PortfolioCreateNestedOneWithoutHarvestTransactionItemInput = {
  connect?: InputMaybe<PortfolioWhereUniqueInput>;
  connectOrCreate?: InputMaybe<PortfolioCreateOrConnectWithoutHarvestTransactionItemInput>;
  create?: InputMaybe<PortfolioCreateWithoutHarvestTransactionItemInput>;
};

export type PortfolioCreateNestedOneWithoutHarvestsInput = {
  connect?: InputMaybe<PortfolioWhereUniqueInput>;
  connectOrCreate?: InputMaybe<PortfolioCreateOrConnectWithoutHarvestsInput>;
  create?: InputMaybe<PortfolioCreateWithoutHarvestsInput>;
};

export type PortfolioCreateNestedOneWithoutLotChangeLogInput = {
  connect?: InputMaybe<PortfolioWhereUniqueInput>;
  connectOrCreate?: InputMaybe<PortfolioCreateOrConnectWithoutLotChangeLogInput>;
  create?: InputMaybe<PortfolioCreateWithoutLotChangeLogInput>;
};

export type PortfolioCreateNestedOneWithoutLotTransactionBatchInput = {
  connect?: InputMaybe<PortfolioWhereUniqueInput>;
  connectOrCreate?: InputMaybe<PortfolioCreateOrConnectWithoutLotTransactionBatchInput>;
  create?: InputMaybe<PortfolioCreateWithoutLotTransactionBatchInput>;
};

export type PortfolioCreateNestedOneWithoutLotsInput = {
  connect?: InputMaybe<PortfolioWhereUniqueInput>;
  connectOrCreate?: InputMaybe<PortfolioCreateOrConnectWithoutLotsInput>;
  create?: InputMaybe<PortfolioCreateWithoutLotsInput>;
};

export type PortfolioCreateNestedOneWithoutPositionsInput = {
  connect?: InputMaybe<PortfolioWhereUniqueInput>;
  connectOrCreate?: InputMaybe<PortfolioCreateOrConnectWithoutPositionsInput>;
  create?: InputMaybe<PortfolioCreateWithoutPositionsInput>;
};

export type PortfolioCreateNestedOneWithoutRealizedPAndLInput = {
  connect?: InputMaybe<PortfolioWhereUniqueInput>;
  connectOrCreate?: InputMaybe<PortfolioCreateOrConnectWithoutRealizedPAndLInput>;
  create?: InputMaybe<PortfolioCreateWithoutRealizedPAndLInput>;
};

export type PortfolioCreateNestedOneWithoutTransactionsInput = {
  connect?: InputMaybe<PortfolioWhereUniqueInput>;
  connectOrCreate?: InputMaybe<PortfolioCreateOrConnectWithoutTransactionsInput>;
  create?: InputMaybe<PortfolioCreateWithoutTransactionsInput>;
};

export type PortfolioCreateNestedOneWithoutUsersOnPortfoliosInput = {
  connect?: InputMaybe<PortfolioWhereUniqueInput>;
  connectOrCreate?: InputMaybe<PortfolioCreateOrConnectWithoutUsersOnPortfoliosInput>;
  create?: InputMaybe<PortfolioCreateWithoutUsersOnPortfoliosInput>;
};

export type PortfolioCreateOrConnectWithoutAccountsInput = {
  create: PortfolioCreateWithoutAccountsInput;
  where: PortfolioWhereUniqueInput;
};

export type PortfolioCreateOrConnectWithoutAuthConnectionsInput = {
  create: PortfolioCreateWithoutAuthConnectionsInput;
  where: PortfolioWhereUniqueInput;
};

export type PortfolioCreateOrConnectWithoutCreatedByInput = {
  create: PortfolioCreateWithoutCreatedByInput;
  where: PortfolioWhereUniqueInput;
};

export type PortfolioCreateOrConnectWithoutFilesInput = {
  create: PortfolioCreateWithoutFilesInput;
  where: PortfolioWhereUniqueInput;
};

export type PortfolioCreateOrConnectWithoutHarvestTransactionInput = {
  create: PortfolioCreateWithoutHarvestTransactionInput;
  where: PortfolioWhereUniqueInput;
};

export type PortfolioCreateOrConnectWithoutHarvestTransactionItemInput = {
  create: PortfolioCreateWithoutHarvestTransactionItemInput;
  where: PortfolioWhereUniqueInput;
};

export type PortfolioCreateOrConnectWithoutHarvestsInput = {
  create: PortfolioCreateWithoutHarvestsInput;
  where: PortfolioWhereUniqueInput;
};

export type PortfolioCreateOrConnectWithoutLotChangeLogInput = {
  create: PortfolioCreateWithoutLotChangeLogInput;
  where: PortfolioWhereUniqueInput;
};

export type PortfolioCreateOrConnectWithoutLotTransactionBatchInput = {
  create: PortfolioCreateWithoutLotTransactionBatchInput;
  where: PortfolioWhereUniqueInput;
};

export type PortfolioCreateOrConnectWithoutLotsInput = {
  create: PortfolioCreateWithoutLotsInput;
  where: PortfolioWhereUniqueInput;
};

export type PortfolioCreateOrConnectWithoutPositionsInput = {
  create: PortfolioCreateWithoutPositionsInput;
  where: PortfolioWhereUniqueInput;
};

export type PortfolioCreateOrConnectWithoutRealizedPAndLInput = {
  create: PortfolioCreateWithoutRealizedPAndLInput;
  where: PortfolioWhereUniqueInput;
};

export type PortfolioCreateOrConnectWithoutTransactionsInput = {
  create: PortfolioCreateWithoutTransactionsInput;
  where: PortfolioWhereUniqueInput;
};

export type PortfolioCreateOrConnectWithoutUsersOnPortfoliosInput = {
  create: PortfolioCreateWithoutUsersOnPortfoliosInput;
  where: PortfolioWhereUniqueInput;
};

export type PortfolioCreateWithoutAccountsInput = {
  authConnections?: InputMaybe<AuthConnectionCreateNestedManyWithoutPortfolioInput>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  createdBy: UserCreateNestedOneWithoutPortfolioInput;
  endOfYearTaxOpportunityNotification?: InputMaybe<Scalars['Boolean']['input']>;
  files?: InputMaybe<FileCreateNestedManyWithoutPortfolioInput>;
  harvestCycleWeeks?: InputMaybe<Scalars['Int']['input']>;
  harvestShareDollarThreshold?: InputMaybe<Scalars['Decimal']['input']>;
  harvestTickerBucketDollarSizeLong?: InputMaybe<Scalars['Decimal']['input']>;
  harvestTickerBucketDollarSizeShort?: InputMaybe<Scalars['Decimal']['input']>;
  harvestTickerBucketLowerLimitLong?: InputMaybe<Scalars['Decimal']['input']>;
  harvestTickerBucketLowerLimitShort?: InputMaybe<Scalars['Decimal']['input']>;
  harvestTransaction?: InputMaybe<HarvestTransactionCreateNestedManyWithoutPortfolioInput>;
  harvestTransactionItem?: InputMaybe<HarvestTransactionItemCreateNestedManyWithoutPortfolioInput>;
  harvests?: InputMaybe<HarvestCreateNestedManyWithoutPortfolioInput>;
  id?: InputMaybe<Scalars['String']['input']>;
  log?: InputMaybe<LogCreateNestedManyWithoutPortfolioInput>;
  lotChangeLog?: InputMaybe<LotChangeLogCreateNestedManyWithoutPortfolioInput>;
  lotTransactionBatch?: InputMaybe<LotTransactionBatchCreateNestedManyWithoutPortfolioInput>;
  lots?: InputMaybe<LotCreateNestedManyWithoutPortfolioInput>;
  minimumLotPAndL?: InputMaybe<Scalars['Decimal']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  notificationFrequency?: InputMaybe<HarvestNotificationFrequency>;
  positions?: InputMaybe<PositionCreateNestedManyWithoutPortfolioInput>;
  realizedPAndL?: InputMaybe<RealizedPAndLCreateNestedManyWithoutPortfolioInput>;
  transactions?: InputMaybe<TransactionCreateNestedManyWithoutPortfolioInput>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
  usersOnPortfolios?: InputMaybe<UsersOnPortfoliosCreateNestedManyWithoutPortfolioInput>;
};

export type PortfolioCreateWithoutAuthConnectionsInput = {
  accounts?: InputMaybe<AccountCreateNestedManyWithoutPortfolioInput>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  createdBy: UserCreateNestedOneWithoutPortfolioInput;
  endOfYearTaxOpportunityNotification?: InputMaybe<Scalars['Boolean']['input']>;
  files?: InputMaybe<FileCreateNestedManyWithoutPortfolioInput>;
  harvestCycleWeeks?: InputMaybe<Scalars['Int']['input']>;
  harvestShareDollarThreshold?: InputMaybe<Scalars['Decimal']['input']>;
  harvestTickerBucketDollarSizeLong?: InputMaybe<Scalars['Decimal']['input']>;
  harvestTickerBucketDollarSizeShort?: InputMaybe<Scalars['Decimal']['input']>;
  harvestTickerBucketLowerLimitLong?: InputMaybe<Scalars['Decimal']['input']>;
  harvestTickerBucketLowerLimitShort?: InputMaybe<Scalars['Decimal']['input']>;
  harvestTransaction?: InputMaybe<HarvestTransactionCreateNestedManyWithoutPortfolioInput>;
  harvestTransactionItem?: InputMaybe<HarvestTransactionItemCreateNestedManyWithoutPortfolioInput>;
  harvests?: InputMaybe<HarvestCreateNestedManyWithoutPortfolioInput>;
  id?: InputMaybe<Scalars['String']['input']>;
  log?: InputMaybe<LogCreateNestedManyWithoutPortfolioInput>;
  lotChangeLog?: InputMaybe<LotChangeLogCreateNestedManyWithoutPortfolioInput>;
  lotTransactionBatch?: InputMaybe<LotTransactionBatchCreateNestedManyWithoutPortfolioInput>;
  lots?: InputMaybe<LotCreateNestedManyWithoutPortfolioInput>;
  minimumLotPAndL?: InputMaybe<Scalars['Decimal']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  notificationFrequency?: InputMaybe<HarvestNotificationFrequency>;
  positions?: InputMaybe<PositionCreateNestedManyWithoutPortfolioInput>;
  realizedPAndL?: InputMaybe<RealizedPAndLCreateNestedManyWithoutPortfolioInput>;
  transactions?: InputMaybe<TransactionCreateNestedManyWithoutPortfolioInput>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
  usersOnPortfolios?: InputMaybe<UsersOnPortfoliosCreateNestedManyWithoutPortfolioInput>;
};

export type PortfolioCreateWithoutCreatedByInput = {
  accounts?: InputMaybe<AccountCreateNestedManyWithoutPortfolioInput>;
  authConnections?: InputMaybe<AuthConnectionCreateNestedManyWithoutPortfolioInput>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  endOfYearTaxOpportunityNotification?: InputMaybe<Scalars['Boolean']['input']>;
  files?: InputMaybe<FileCreateNestedManyWithoutPortfolioInput>;
  harvestCycleWeeks?: InputMaybe<Scalars['Int']['input']>;
  harvestShareDollarThreshold?: InputMaybe<Scalars['Decimal']['input']>;
  harvestTickerBucketDollarSizeLong?: InputMaybe<Scalars['Decimal']['input']>;
  harvestTickerBucketDollarSizeShort?: InputMaybe<Scalars['Decimal']['input']>;
  harvestTickerBucketLowerLimitLong?: InputMaybe<Scalars['Decimal']['input']>;
  harvestTickerBucketLowerLimitShort?: InputMaybe<Scalars['Decimal']['input']>;
  harvestTransaction?: InputMaybe<HarvestTransactionCreateNestedManyWithoutPortfolioInput>;
  harvestTransactionItem?: InputMaybe<HarvestTransactionItemCreateNestedManyWithoutPortfolioInput>;
  harvests?: InputMaybe<HarvestCreateNestedManyWithoutPortfolioInput>;
  id?: InputMaybe<Scalars['String']['input']>;
  log?: InputMaybe<LogCreateNestedManyWithoutPortfolioInput>;
  lotChangeLog?: InputMaybe<LotChangeLogCreateNestedManyWithoutPortfolioInput>;
  lotTransactionBatch?: InputMaybe<LotTransactionBatchCreateNestedManyWithoutPortfolioInput>;
  lots?: InputMaybe<LotCreateNestedManyWithoutPortfolioInput>;
  minimumLotPAndL?: InputMaybe<Scalars['Decimal']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  notificationFrequency?: InputMaybe<HarvestNotificationFrequency>;
  positions?: InputMaybe<PositionCreateNestedManyWithoutPortfolioInput>;
  realizedPAndL?: InputMaybe<RealizedPAndLCreateNestedManyWithoutPortfolioInput>;
  transactions?: InputMaybe<TransactionCreateNestedManyWithoutPortfolioInput>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
  usersOnPortfolios?: InputMaybe<UsersOnPortfoliosCreateNestedManyWithoutPortfolioInput>;
};

export type PortfolioCreateWithoutFilesInput = {
  accounts?: InputMaybe<AccountCreateNestedManyWithoutPortfolioInput>;
  authConnections?: InputMaybe<AuthConnectionCreateNestedManyWithoutPortfolioInput>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  createdBy: UserCreateNestedOneWithoutPortfolioInput;
  endOfYearTaxOpportunityNotification?: InputMaybe<Scalars['Boolean']['input']>;
  harvestCycleWeeks?: InputMaybe<Scalars['Int']['input']>;
  harvestShareDollarThreshold?: InputMaybe<Scalars['Decimal']['input']>;
  harvestTickerBucketDollarSizeLong?: InputMaybe<Scalars['Decimal']['input']>;
  harvestTickerBucketDollarSizeShort?: InputMaybe<Scalars['Decimal']['input']>;
  harvestTickerBucketLowerLimitLong?: InputMaybe<Scalars['Decimal']['input']>;
  harvestTickerBucketLowerLimitShort?: InputMaybe<Scalars['Decimal']['input']>;
  harvestTransaction?: InputMaybe<HarvestTransactionCreateNestedManyWithoutPortfolioInput>;
  harvestTransactionItem?: InputMaybe<HarvestTransactionItemCreateNestedManyWithoutPortfolioInput>;
  harvests?: InputMaybe<HarvestCreateNestedManyWithoutPortfolioInput>;
  id?: InputMaybe<Scalars['String']['input']>;
  log?: InputMaybe<LogCreateNestedManyWithoutPortfolioInput>;
  lotChangeLog?: InputMaybe<LotChangeLogCreateNestedManyWithoutPortfolioInput>;
  lotTransactionBatch?: InputMaybe<LotTransactionBatchCreateNestedManyWithoutPortfolioInput>;
  lots?: InputMaybe<LotCreateNestedManyWithoutPortfolioInput>;
  minimumLotPAndL?: InputMaybe<Scalars['Decimal']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  notificationFrequency?: InputMaybe<HarvestNotificationFrequency>;
  positions?: InputMaybe<PositionCreateNestedManyWithoutPortfolioInput>;
  realizedPAndL?: InputMaybe<RealizedPAndLCreateNestedManyWithoutPortfolioInput>;
  transactions?: InputMaybe<TransactionCreateNestedManyWithoutPortfolioInput>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
  usersOnPortfolios?: InputMaybe<UsersOnPortfoliosCreateNestedManyWithoutPortfolioInput>;
};

export type PortfolioCreateWithoutHarvestTransactionInput = {
  accounts?: InputMaybe<AccountCreateNestedManyWithoutPortfolioInput>;
  authConnections?: InputMaybe<AuthConnectionCreateNestedManyWithoutPortfolioInput>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  createdBy: UserCreateNestedOneWithoutPortfolioInput;
  endOfYearTaxOpportunityNotification?: InputMaybe<Scalars['Boolean']['input']>;
  files?: InputMaybe<FileCreateNestedManyWithoutPortfolioInput>;
  harvestCycleWeeks?: InputMaybe<Scalars['Int']['input']>;
  harvestShareDollarThreshold?: InputMaybe<Scalars['Decimal']['input']>;
  harvestTickerBucketDollarSizeLong?: InputMaybe<Scalars['Decimal']['input']>;
  harvestTickerBucketDollarSizeShort?: InputMaybe<Scalars['Decimal']['input']>;
  harvestTickerBucketLowerLimitLong?: InputMaybe<Scalars['Decimal']['input']>;
  harvestTickerBucketLowerLimitShort?: InputMaybe<Scalars['Decimal']['input']>;
  harvestTransactionItem?: InputMaybe<HarvestTransactionItemCreateNestedManyWithoutPortfolioInput>;
  harvests?: InputMaybe<HarvestCreateNestedManyWithoutPortfolioInput>;
  id?: InputMaybe<Scalars['String']['input']>;
  log?: InputMaybe<LogCreateNestedManyWithoutPortfolioInput>;
  lotChangeLog?: InputMaybe<LotChangeLogCreateNestedManyWithoutPortfolioInput>;
  lotTransactionBatch?: InputMaybe<LotTransactionBatchCreateNestedManyWithoutPortfolioInput>;
  lots?: InputMaybe<LotCreateNestedManyWithoutPortfolioInput>;
  minimumLotPAndL?: InputMaybe<Scalars['Decimal']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  notificationFrequency?: InputMaybe<HarvestNotificationFrequency>;
  positions?: InputMaybe<PositionCreateNestedManyWithoutPortfolioInput>;
  realizedPAndL?: InputMaybe<RealizedPAndLCreateNestedManyWithoutPortfolioInput>;
  transactions?: InputMaybe<TransactionCreateNestedManyWithoutPortfolioInput>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
  usersOnPortfolios?: InputMaybe<UsersOnPortfoliosCreateNestedManyWithoutPortfolioInput>;
};

export type PortfolioCreateWithoutHarvestTransactionItemInput = {
  accounts?: InputMaybe<AccountCreateNestedManyWithoutPortfolioInput>;
  authConnections?: InputMaybe<AuthConnectionCreateNestedManyWithoutPortfolioInput>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  createdBy: UserCreateNestedOneWithoutPortfolioInput;
  endOfYearTaxOpportunityNotification?: InputMaybe<Scalars['Boolean']['input']>;
  files?: InputMaybe<FileCreateNestedManyWithoutPortfolioInput>;
  harvestCycleWeeks?: InputMaybe<Scalars['Int']['input']>;
  harvestShareDollarThreshold?: InputMaybe<Scalars['Decimal']['input']>;
  harvestTickerBucketDollarSizeLong?: InputMaybe<Scalars['Decimal']['input']>;
  harvestTickerBucketDollarSizeShort?: InputMaybe<Scalars['Decimal']['input']>;
  harvestTickerBucketLowerLimitLong?: InputMaybe<Scalars['Decimal']['input']>;
  harvestTickerBucketLowerLimitShort?: InputMaybe<Scalars['Decimal']['input']>;
  harvestTransaction?: InputMaybe<HarvestTransactionCreateNestedManyWithoutPortfolioInput>;
  harvests?: InputMaybe<HarvestCreateNestedManyWithoutPortfolioInput>;
  id?: InputMaybe<Scalars['String']['input']>;
  log?: InputMaybe<LogCreateNestedManyWithoutPortfolioInput>;
  lotChangeLog?: InputMaybe<LotChangeLogCreateNestedManyWithoutPortfolioInput>;
  lotTransactionBatch?: InputMaybe<LotTransactionBatchCreateNestedManyWithoutPortfolioInput>;
  lots?: InputMaybe<LotCreateNestedManyWithoutPortfolioInput>;
  minimumLotPAndL?: InputMaybe<Scalars['Decimal']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  notificationFrequency?: InputMaybe<HarvestNotificationFrequency>;
  positions?: InputMaybe<PositionCreateNestedManyWithoutPortfolioInput>;
  realizedPAndL?: InputMaybe<RealizedPAndLCreateNestedManyWithoutPortfolioInput>;
  transactions?: InputMaybe<TransactionCreateNestedManyWithoutPortfolioInput>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
  usersOnPortfolios?: InputMaybe<UsersOnPortfoliosCreateNestedManyWithoutPortfolioInput>;
};

export type PortfolioCreateWithoutHarvestsInput = {
  accounts?: InputMaybe<AccountCreateNestedManyWithoutPortfolioInput>;
  authConnections?: InputMaybe<AuthConnectionCreateNestedManyWithoutPortfolioInput>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  createdBy: UserCreateNestedOneWithoutPortfolioInput;
  endOfYearTaxOpportunityNotification?: InputMaybe<Scalars['Boolean']['input']>;
  files?: InputMaybe<FileCreateNestedManyWithoutPortfolioInput>;
  harvestCycleWeeks?: InputMaybe<Scalars['Int']['input']>;
  harvestShareDollarThreshold?: InputMaybe<Scalars['Decimal']['input']>;
  harvestTickerBucketDollarSizeLong?: InputMaybe<Scalars['Decimal']['input']>;
  harvestTickerBucketDollarSizeShort?: InputMaybe<Scalars['Decimal']['input']>;
  harvestTickerBucketLowerLimitLong?: InputMaybe<Scalars['Decimal']['input']>;
  harvestTickerBucketLowerLimitShort?: InputMaybe<Scalars['Decimal']['input']>;
  harvestTransaction?: InputMaybe<HarvestTransactionCreateNestedManyWithoutPortfolioInput>;
  harvestTransactionItem?: InputMaybe<HarvestTransactionItemCreateNestedManyWithoutPortfolioInput>;
  id?: InputMaybe<Scalars['String']['input']>;
  log?: InputMaybe<LogCreateNestedManyWithoutPortfolioInput>;
  lotChangeLog?: InputMaybe<LotChangeLogCreateNestedManyWithoutPortfolioInput>;
  lotTransactionBatch?: InputMaybe<LotTransactionBatchCreateNestedManyWithoutPortfolioInput>;
  lots?: InputMaybe<LotCreateNestedManyWithoutPortfolioInput>;
  minimumLotPAndL?: InputMaybe<Scalars['Decimal']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  notificationFrequency?: InputMaybe<HarvestNotificationFrequency>;
  positions?: InputMaybe<PositionCreateNestedManyWithoutPortfolioInput>;
  realizedPAndL?: InputMaybe<RealizedPAndLCreateNestedManyWithoutPortfolioInput>;
  transactions?: InputMaybe<TransactionCreateNestedManyWithoutPortfolioInput>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
  usersOnPortfolios?: InputMaybe<UsersOnPortfoliosCreateNestedManyWithoutPortfolioInput>;
};

export type PortfolioCreateWithoutLotChangeLogInput = {
  accounts?: InputMaybe<AccountCreateNestedManyWithoutPortfolioInput>;
  authConnections?: InputMaybe<AuthConnectionCreateNestedManyWithoutPortfolioInput>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  createdBy: UserCreateNestedOneWithoutPortfolioInput;
  endOfYearTaxOpportunityNotification?: InputMaybe<Scalars['Boolean']['input']>;
  files?: InputMaybe<FileCreateNestedManyWithoutPortfolioInput>;
  harvestCycleWeeks?: InputMaybe<Scalars['Int']['input']>;
  harvestShareDollarThreshold?: InputMaybe<Scalars['Decimal']['input']>;
  harvestTickerBucketDollarSizeLong?: InputMaybe<Scalars['Decimal']['input']>;
  harvestTickerBucketDollarSizeShort?: InputMaybe<Scalars['Decimal']['input']>;
  harvestTickerBucketLowerLimitLong?: InputMaybe<Scalars['Decimal']['input']>;
  harvestTickerBucketLowerLimitShort?: InputMaybe<Scalars['Decimal']['input']>;
  harvestTransaction?: InputMaybe<HarvestTransactionCreateNestedManyWithoutPortfolioInput>;
  harvestTransactionItem?: InputMaybe<HarvestTransactionItemCreateNestedManyWithoutPortfolioInput>;
  harvests?: InputMaybe<HarvestCreateNestedManyWithoutPortfolioInput>;
  id?: InputMaybe<Scalars['String']['input']>;
  log?: InputMaybe<LogCreateNestedManyWithoutPortfolioInput>;
  lotTransactionBatch?: InputMaybe<LotTransactionBatchCreateNestedManyWithoutPortfolioInput>;
  lots?: InputMaybe<LotCreateNestedManyWithoutPortfolioInput>;
  minimumLotPAndL?: InputMaybe<Scalars['Decimal']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  notificationFrequency?: InputMaybe<HarvestNotificationFrequency>;
  positions?: InputMaybe<PositionCreateNestedManyWithoutPortfolioInput>;
  realizedPAndL?: InputMaybe<RealizedPAndLCreateNestedManyWithoutPortfolioInput>;
  transactions?: InputMaybe<TransactionCreateNestedManyWithoutPortfolioInput>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
  usersOnPortfolios?: InputMaybe<UsersOnPortfoliosCreateNestedManyWithoutPortfolioInput>;
};

export type PortfolioCreateWithoutLotTransactionBatchInput = {
  accounts?: InputMaybe<AccountCreateNestedManyWithoutPortfolioInput>;
  authConnections?: InputMaybe<AuthConnectionCreateNestedManyWithoutPortfolioInput>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  createdBy: UserCreateNestedOneWithoutPortfolioInput;
  endOfYearTaxOpportunityNotification?: InputMaybe<Scalars['Boolean']['input']>;
  files?: InputMaybe<FileCreateNestedManyWithoutPortfolioInput>;
  harvestCycleWeeks?: InputMaybe<Scalars['Int']['input']>;
  harvestShareDollarThreshold?: InputMaybe<Scalars['Decimal']['input']>;
  harvestTickerBucketDollarSizeLong?: InputMaybe<Scalars['Decimal']['input']>;
  harvestTickerBucketDollarSizeShort?: InputMaybe<Scalars['Decimal']['input']>;
  harvestTickerBucketLowerLimitLong?: InputMaybe<Scalars['Decimal']['input']>;
  harvestTickerBucketLowerLimitShort?: InputMaybe<Scalars['Decimal']['input']>;
  harvestTransaction?: InputMaybe<HarvestTransactionCreateNestedManyWithoutPortfolioInput>;
  harvestTransactionItem?: InputMaybe<HarvestTransactionItemCreateNestedManyWithoutPortfolioInput>;
  harvests?: InputMaybe<HarvestCreateNestedManyWithoutPortfolioInput>;
  id?: InputMaybe<Scalars['String']['input']>;
  log?: InputMaybe<LogCreateNestedManyWithoutPortfolioInput>;
  lotChangeLog?: InputMaybe<LotChangeLogCreateNestedManyWithoutPortfolioInput>;
  lots?: InputMaybe<LotCreateNestedManyWithoutPortfolioInput>;
  minimumLotPAndL?: InputMaybe<Scalars['Decimal']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  notificationFrequency?: InputMaybe<HarvestNotificationFrequency>;
  positions?: InputMaybe<PositionCreateNestedManyWithoutPortfolioInput>;
  realizedPAndL?: InputMaybe<RealizedPAndLCreateNestedManyWithoutPortfolioInput>;
  transactions?: InputMaybe<TransactionCreateNestedManyWithoutPortfolioInput>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
  usersOnPortfolios?: InputMaybe<UsersOnPortfoliosCreateNestedManyWithoutPortfolioInput>;
};

export type PortfolioCreateWithoutLotsInput = {
  accounts?: InputMaybe<AccountCreateNestedManyWithoutPortfolioInput>;
  authConnections?: InputMaybe<AuthConnectionCreateNestedManyWithoutPortfolioInput>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  createdBy: UserCreateNestedOneWithoutPortfolioInput;
  endOfYearTaxOpportunityNotification?: InputMaybe<Scalars['Boolean']['input']>;
  files?: InputMaybe<FileCreateNestedManyWithoutPortfolioInput>;
  harvestCycleWeeks?: InputMaybe<Scalars['Int']['input']>;
  harvestShareDollarThreshold?: InputMaybe<Scalars['Decimal']['input']>;
  harvestTickerBucketDollarSizeLong?: InputMaybe<Scalars['Decimal']['input']>;
  harvestTickerBucketDollarSizeShort?: InputMaybe<Scalars['Decimal']['input']>;
  harvestTickerBucketLowerLimitLong?: InputMaybe<Scalars['Decimal']['input']>;
  harvestTickerBucketLowerLimitShort?: InputMaybe<Scalars['Decimal']['input']>;
  harvestTransaction?: InputMaybe<HarvestTransactionCreateNestedManyWithoutPortfolioInput>;
  harvestTransactionItem?: InputMaybe<HarvestTransactionItemCreateNestedManyWithoutPortfolioInput>;
  harvests?: InputMaybe<HarvestCreateNestedManyWithoutPortfolioInput>;
  id?: InputMaybe<Scalars['String']['input']>;
  log?: InputMaybe<LogCreateNestedManyWithoutPortfolioInput>;
  lotChangeLog?: InputMaybe<LotChangeLogCreateNestedManyWithoutPortfolioInput>;
  lotTransactionBatch?: InputMaybe<LotTransactionBatchCreateNestedManyWithoutPortfolioInput>;
  minimumLotPAndL?: InputMaybe<Scalars['Decimal']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  notificationFrequency?: InputMaybe<HarvestNotificationFrequency>;
  positions?: InputMaybe<PositionCreateNestedManyWithoutPortfolioInput>;
  realizedPAndL?: InputMaybe<RealizedPAndLCreateNestedManyWithoutPortfolioInput>;
  transactions?: InputMaybe<TransactionCreateNestedManyWithoutPortfolioInput>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
  usersOnPortfolios?: InputMaybe<UsersOnPortfoliosCreateNestedManyWithoutPortfolioInput>;
};

export type PortfolioCreateWithoutPositionsInput = {
  accounts?: InputMaybe<AccountCreateNestedManyWithoutPortfolioInput>;
  authConnections?: InputMaybe<AuthConnectionCreateNestedManyWithoutPortfolioInput>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  createdBy: UserCreateNestedOneWithoutPortfolioInput;
  endOfYearTaxOpportunityNotification?: InputMaybe<Scalars['Boolean']['input']>;
  files?: InputMaybe<FileCreateNestedManyWithoutPortfolioInput>;
  harvestCycleWeeks?: InputMaybe<Scalars['Int']['input']>;
  harvestShareDollarThreshold?: InputMaybe<Scalars['Decimal']['input']>;
  harvestTickerBucketDollarSizeLong?: InputMaybe<Scalars['Decimal']['input']>;
  harvestTickerBucketDollarSizeShort?: InputMaybe<Scalars['Decimal']['input']>;
  harvestTickerBucketLowerLimitLong?: InputMaybe<Scalars['Decimal']['input']>;
  harvestTickerBucketLowerLimitShort?: InputMaybe<Scalars['Decimal']['input']>;
  harvestTransaction?: InputMaybe<HarvestTransactionCreateNestedManyWithoutPortfolioInput>;
  harvestTransactionItem?: InputMaybe<HarvestTransactionItemCreateNestedManyWithoutPortfolioInput>;
  harvests?: InputMaybe<HarvestCreateNestedManyWithoutPortfolioInput>;
  id?: InputMaybe<Scalars['String']['input']>;
  log?: InputMaybe<LogCreateNestedManyWithoutPortfolioInput>;
  lotChangeLog?: InputMaybe<LotChangeLogCreateNestedManyWithoutPortfolioInput>;
  lotTransactionBatch?: InputMaybe<LotTransactionBatchCreateNestedManyWithoutPortfolioInput>;
  lots?: InputMaybe<LotCreateNestedManyWithoutPortfolioInput>;
  minimumLotPAndL?: InputMaybe<Scalars['Decimal']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  notificationFrequency?: InputMaybe<HarvestNotificationFrequency>;
  realizedPAndL?: InputMaybe<RealizedPAndLCreateNestedManyWithoutPortfolioInput>;
  transactions?: InputMaybe<TransactionCreateNestedManyWithoutPortfolioInput>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
  usersOnPortfolios?: InputMaybe<UsersOnPortfoliosCreateNestedManyWithoutPortfolioInput>;
};

export type PortfolioCreateWithoutRealizedPAndLInput = {
  accounts?: InputMaybe<AccountCreateNestedManyWithoutPortfolioInput>;
  authConnections?: InputMaybe<AuthConnectionCreateNestedManyWithoutPortfolioInput>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  createdBy: UserCreateNestedOneWithoutPortfolioInput;
  endOfYearTaxOpportunityNotification?: InputMaybe<Scalars['Boolean']['input']>;
  files?: InputMaybe<FileCreateNestedManyWithoutPortfolioInput>;
  harvestCycleWeeks?: InputMaybe<Scalars['Int']['input']>;
  harvestShareDollarThreshold?: InputMaybe<Scalars['Decimal']['input']>;
  harvestTickerBucketDollarSizeLong?: InputMaybe<Scalars['Decimal']['input']>;
  harvestTickerBucketDollarSizeShort?: InputMaybe<Scalars['Decimal']['input']>;
  harvestTickerBucketLowerLimitLong?: InputMaybe<Scalars['Decimal']['input']>;
  harvestTickerBucketLowerLimitShort?: InputMaybe<Scalars['Decimal']['input']>;
  harvestTransaction?: InputMaybe<HarvestTransactionCreateNestedManyWithoutPortfolioInput>;
  harvestTransactionItem?: InputMaybe<HarvestTransactionItemCreateNestedManyWithoutPortfolioInput>;
  harvests?: InputMaybe<HarvestCreateNestedManyWithoutPortfolioInput>;
  id?: InputMaybe<Scalars['String']['input']>;
  log?: InputMaybe<LogCreateNestedManyWithoutPortfolioInput>;
  lotChangeLog?: InputMaybe<LotChangeLogCreateNestedManyWithoutPortfolioInput>;
  lotTransactionBatch?: InputMaybe<LotTransactionBatchCreateNestedManyWithoutPortfolioInput>;
  lots?: InputMaybe<LotCreateNestedManyWithoutPortfolioInput>;
  minimumLotPAndL?: InputMaybe<Scalars['Decimal']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  notificationFrequency?: InputMaybe<HarvestNotificationFrequency>;
  positions?: InputMaybe<PositionCreateNestedManyWithoutPortfolioInput>;
  transactions?: InputMaybe<TransactionCreateNestedManyWithoutPortfolioInput>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
  usersOnPortfolios?: InputMaybe<UsersOnPortfoliosCreateNestedManyWithoutPortfolioInput>;
};

export type PortfolioCreateWithoutTransactionsInput = {
  accounts?: InputMaybe<AccountCreateNestedManyWithoutPortfolioInput>;
  authConnections?: InputMaybe<AuthConnectionCreateNestedManyWithoutPortfolioInput>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  createdBy: UserCreateNestedOneWithoutPortfolioInput;
  endOfYearTaxOpportunityNotification?: InputMaybe<Scalars['Boolean']['input']>;
  files?: InputMaybe<FileCreateNestedManyWithoutPortfolioInput>;
  harvestCycleWeeks?: InputMaybe<Scalars['Int']['input']>;
  harvestShareDollarThreshold?: InputMaybe<Scalars['Decimal']['input']>;
  harvestTickerBucketDollarSizeLong?: InputMaybe<Scalars['Decimal']['input']>;
  harvestTickerBucketDollarSizeShort?: InputMaybe<Scalars['Decimal']['input']>;
  harvestTickerBucketLowerLimitLong?: InputMaybe<Scalars['Decimal']['input']>;
  harvestTickerBucketLowerLimitShort?: InputMaybe<Scalars['Decimal']['input']>;
  harvestTransaction?: InputMaybe<HarvestTransactionCreateNestedManyWithoutPortfolioInput>;
  harvestTransactionItem?: InputMaybe<HarvestTransactionItemCreateNestedManyWithoutPortfolioInput>;
  harvests?: InputMaybe<HarvestCreateNestedManyWithoutPortfolioInput>;
  id?: InputMaybe<Scalars['String']['input']>;
  log?: InputMaybe<LogCreateNestedManyWithoutPortfolioInput>;
  lotChangeLog?: InputMaybe<LotChangeLogCreateNestedManyWithoutPortfolioInput>;
  lotTransactionBatch?: InputMaybe<LotTransactionBatchCreateNestedManyWithoutPortfolioInput>;
  lots?: InputMaybe<LotCreateNestedManyWithoutPortfolioInput>;
  minimumLotPAndL?: InputMaybe<Scalars['Decimal']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  notificationFrequency?: InputMaybe<HarvestNotificationFrequency>;
  positions?: InputMaybe<PositionCreateNestedManyWithoutPortfolioInput>;
  realizedPAndL?: InputMaybe<RealizedPAndLCreateNestedManyWithoutPortfolioInput>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
  usersOnPortfolios?: InputMaybe<UsersOnPortfoliosCreateNestedManyWithoutPortfolioInput>;
};

export type PortfolioCreateWithoutUsersOnPortfoliosInput = {
  accounts?: InputMaybe<AccountCreateNestedManyWithoutPortfolioInput>;
  authConnections?: InputMaybe<AuthConnectionCreateNestedManyWithoutPortfolioInput>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  createdBy: UserCreateNestedOneWithoutPortfolioInput;
  endOfYearTaxOpportunityNotification?: InputMaybe<Scalars['Boolean']['input']>;
  files?: InputMaybe<FileCreateNestedManyWithoutPortfolioInput>;
  harvestCycleWeeks?: InputMaybe<Scalars['Int']['input']>;
  harvestShareDollarThreshold?: InputMaybe<Scalars['Decimal']['input']>;
  harvestTickerBucketDollarSizeLong?: InputMaybe<Scalars['Decimal']['input']>;
  harvestTickerBucketDollarSizeShort?: InputMaybe<Scalars['Decimal']['input']>;
  harvestTickerBucketLowerLimitLong?: InputMaybe<Scalars['Decimal']['input']>;
  harvestTickerBucketLowerLimitShort?: InputMaybe<Scalars['Decimal']['input']>;
  harvestTransaction?: InputMaybe<HarvestTransactionCreateNestedManyWithoutPortfolioInput>;
  harvestTransactionItem?: InputMaybe<HarvestTransactionItemCreateNestedManyWithoutPortfolioInput>;
  harvests?: InputMaybe<HarvestCreateNestedManyWithoutPortfolioInput>;
  id?: InputMaybe<Scalars['String']['input']>;
  log?: InputMaybe<LogCreateNestedManyWithoutPortfolioInput>;
  lotChangeLog?: InputMaybe<LotChangeLogCreateNestedManyWithoutPortfolioInput>;
  lotTransactionBatch?: InputMaybe<LotTransactionBatchCreateNestedManyWithoutPortfolioInput>;
  lots?: InputMaybe<LotCreateNestedManyWithoutPortfolioInput>;
  minimumLotPAndL?: InputMaybe<Scalars['Decimal']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  notificationFrequency?: InputMaybe<HarvestNotificationFrequency>;
  positions?: InputMaybe<PositionCreateNestedManyWithoutPortfolioInput>;
  realizedPAndL?: InputMaybe<RealizedPAndLCreateNestedManyWithoutPortfolioInput>;
  transactions?: InputMaybe<TransactionCreateNestedManyWithoutPortfolioInput>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type PortfolioListRelationFilter = {
  every?: InputMaybe<PortfolioWhereInput>;
  none?: InputMaybe<PortfolioWhereInput>;
  some?: InputMaybe<PortfolioWhereInput>;
};

export type PortfolioMaxAggregate = {
  __typename?: 'PortfolioMaxAggregate';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  createdById?: Maybe<Scalars['String']['output']>;
  endOfYearTaxOpportunityNotification?: Maybe<Scalars['Boolean']['output']>;
  harvestCycleWeeks?: Maybe<Scalars['Int']['output']>;
  harvestShareDollarThreshold?: Maybe<Scalars['Decimal']['output']>;
  harvestTickerBucketDollarSizeLong?: Maybe<Scalars['Decimal']['output']>;
  harvestTickerBucketDollarSizeShort?: Maybe<Scalars['Decimal']['output']>;
  harvestTickerBucketLowerLimitLong?: Maybe<Scalars['Decimal']['output']>;
  harvestTickerBucketLowerLimitShort?: Maybe<Scalars['Decimal']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  minimumLotPAndL?: Maybe<Scalars['Decimal']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  notificationFrequency?: Maybe<HarvestNotificationFrequency>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type PortfolioMinAggregate = {
  __typename?: 'PortfolioMinAggregate';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  createdById?: Maybe<Scalars['String']['output']>;
  endOfYearTaxOpportunityNotification?: Maybe<Scalars['Boolean']['output']>;
  harvestCycleWeeks?: Maybe<Scalars['Int']['output']>;
  harvestShareDollarThreshold?: Maybe<Scalars['Decimal']['output']>;
  harvestTickerBucketDollarSizeLong?: Maybe<Scalars['Decimal']['output']>;
  harvestTickerBucketDollarSizeShort?: Maybe<Scalars['Decimal']['output']>;
  harvestTickerBucketLowerLimitLong?: Maybe<Scalars['Decimal']['output']>;
  harvestTickerBucketLowerLimitShort?: Maybe<Scalars['Decimal']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  minimumLotPAndL?: Maybe<Scalars['Decimal']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  notificationFrequency?: Maybe<HarvestNotificationFrequency>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export enum PortfolioRole {
  Admin = 'ADMIN',
  Viewer = 'VIEWER'
}

export type PortfolioScalarRelationFilter = {
  is?: InputMaybe<PortfolioWhereInput>;
  isNot?: InputMaybe<PortfolioWhereInput>;
};

export type PortfolioScalarWhereInput = {
  AND?: InputMaybe<Array<PortfolioScalarWhereInput>>;
  NOT?: InputMaybe<Array<PortfolioScalarWhereInput>>;
  OR?: InputMaybe<Array<PortfolioScalarWhereInput>>;
  createdAt?: InputMaybe<DateTimeFilter>;
  createdById?: InputMaybe<StringFilter>;
  endOfYearTaxOpportunityNotification?: InputMaybe<BoolFilter>;
  harvestCycleWeeks?: InputMaybe<IntFilter>;
  harvestShareDollarThreshold?: InputMaybe<DecimalFilter>;
  harvestTickerBucketDollarSizeLong?: InputMaybe<DecimalFilter>;
  harvestTickerBucketDollarSizeShort?: InputMaybe<DecimalFilter>;
  harvestTickerBucketLowerLimitLong?: InputMaybe<DecimalFilter>;
  harvestTickerBucketLowerLimitShort?: InputMaybe<DecimalFilter>;
  id?: InputMaybe<UuidFilter>;
  minimumLotPAndL?: InputMaybe<DecimalFilter>;
  name?: InputMaybe<StringFilter>;
  notificationFrequency?: InputMaybe<EnumHarvestNotificationFrequencyFilter>;
  updatedAt?: InputMaybe<DateTimeFilter>;
};

export type PortfolioSumAggregate = {
  __typename?: 'PortfolioSumAggregate';
  harvestCycleWeeks?: Maybe<Scalars['Int']['output']>;
  harvestShareDollarThreshold?: Maybe<Scalars['Decimal']['output']>;
  harvestTickerBucketDollarSizeLong?: Maybe<Scalars['Decimal']['output']>;
  harvestTickerBucketDollarSizeShort?: Maybe<Scalars['Decimal']['output']>;
  harvestTickerBucketLowerLimitLong?: Maybe<Scalars['Decimal']['output']>;
  harvestTickerBucketLowerLimitShort?: Maybe<Scalars['Decimal']['output']>;
  minimumLotPAndL?: Maybe<Scalars['Decimal']['output']>;
};

export type PortfolioSummary = {
  __typename?: 'PortfolioSummary';
  harvest: HarvestPotential;
  includingCurrentHarvest: PortfolioSummaryIncludingHarvest;
  realized: PortfolioSummaryRealized;
  setUpStatus: SetUpStatus;
  unrealized: PortfolioSummaryUnrealized;
};

export type PortfolioSummaryIncludingHarvest = {
  __typename?: 'PortfolioSummaryIncludingHarvest';
  harvest: HarvestPotential;
  realized: PortfolioSummaryRealized;
  unrealized: PortfolioSummaryUnrealized;
};

export type PortfolioSummaryRealized = {
  __typename?: 'PortfolioSummaryRealized';
  accountCount: Scalars['Float']['output'];
  dividend: Scalars['Float']['output'];
  gainLongTerm: Scalars['Float']['output'];
  gainShortTerm: Scalars['Float']['output'];
  gainTotal: Scalars['Float']['output'];
};

export type PortfolioSummaryUnrealized = {
  __typename?: 'PortfolioSummaryUnrealized';
  accountCount: Scalars['Float']['output'];
  gainTotal: Scalars['Float']['output'];
  lossTotal: Scalars['Float']['output'];
  positionCount: Scalars['Float']['output'];
  total: Scalars['Float']['output'];
};

export type PortfolioUpdateInput = {
  accounts?: InputMaybe<AccountUpdateManyWithoutPortfolioNestedInput>;
  authConnections?: InputMaybe<AuthConnectionUpdateManyWithoutPortfolioNestedInput>;
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  createdBy?: InputMaybe<UserUpdateOneRequiredWithoutPortfolioNestedInput>;
  endOfYearTaxOpportunityNotification?: InputMaybe<BoolFieldUpdateOperationsInput>;
  files?: InputMaybe<FileUpdateManyWithoutPortfolioNestedInput>;
  harvestCycleWeeks?: InputMaybe<IntFieldUpdateOperationsInput>;
  harvestShareDollarThreshold?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  harvestTickerBucketDollarSizeLong?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  harvestTickerBucketDollarSizeShort?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  harvestTickerBucketLowerLimitLong?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  harvestTickerBucketLowerLimitShort?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  harvestTransaction?: InputMaybe<HarvestTransactionUpdateManyWithoutPortfolioNestedInput>;
  harvestTransactionItem?: InputMaybe<HarvestTransactionItemUpdateManyWithoutPortfolioNestedInput>;
  harvests?: InputMaybe<HarvestUpdateManyWithoutPortfolioNestedInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  log?: InputMaybe<LogUpdateManyWithoutPortfolioNestedInput>;
  lotChangeLog?: InputMaybe<LotChangeLogUpdateManyWithoutPortfolioNestedInput>;
  lotTransactionBatch?: InputMaybe<LotTransactionBatchUpdateManyWithoutPortfolioNestedInput>;
  lots?: InputMaybe<LotUpdateManyWithoutPortfolioNestedInput>;
  minimumLotPAndL?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  name?: InputMaybe<StringFieldUpdateOperationsInput>;
  notificationFrequency?: InputMaybe<EnumHarvestNotificationFrequencyFieldUpdateOperationsInput>;
  positions?: InputMaybe<PositionUpdateManyWithoutPortfolioNestedInput>;
  realizedPAndL?: InputMaybe<RealizedPAndLUpdateManyWithoutPortfolioNestedInput>;
  transactions?: InputMaybe<TransactionUpdateManyWithoutPortfolioNestedInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  usersOnPortfolios?: InputMaybe<UsersOnPortfoliosUpdateManyWithoutPortfolioNestedInput>;
};

export type PortfolioUpdateManyMutationInput = {
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  endOfYearTaxOpportunityNotification?: InputMaybe<BoolFieldUpdateOperationsInput>;
  harvestCycleWeeks?: InputMaybe<IntFieldUpdateOperationsInput>;
  harvestShareDollarThreshold?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  harvestTickerBucketDollarSizeLong?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  harvestTickerBucketDollarSizeShort?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  harvestTickerBucketLowerLimitLong?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  harvestTickerBucketLowerLimitShort?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  minimumLotPAndL?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  name?: InputMaybe<StringFieldUpdateOperationsInput>;
  notificationFrequency?: InputMaybe<EnumHarvestNotificationFrequencyFieldUpdateOperationsInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
};

export type PortfolioUpdateManyWithWhereWithoutCreatedByInput = {
  data: PortfolioUpdateManyMutationInput;
  where: PortfolioScalarWhereInput;
};

export type PortfolioUpdateManyWithoutCreatedByNestedInput = {
  connect?: InputMaybe<Array<PortfolioWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<PortfolioCreateOrConnectWithoutCreatedByInput>>;
  create?: InputMaybe<Array<PortfolioCreateWithoutCreatedByInput>>;
  createMany?: InputMaybe<PortfolioCreateManyCreatedByInputEnvelope>;
  delete?: InputMaybe<Array<PortfolioWhereUniqueInput>>;
  deleteMany?: InputMaybe<Array<PortfolioScalarWhereInput>>;
  disconnect?: InputMaybe<Array<PortfolioWhereUniqueInput>>;
  set?: InputMaybe<Array<PortfolioWhereUniqueInput>>;
  update?: InputMaybe<Array<PortfolioUpdateWithWhereUniqueWithoutCreatedByInput>>;
  updateMany?: InputMaybe<Array<PortfolioUpdateManyWithWhereWithoutCreatedByInput>>;
  upsert?: InputMaybe<Array<PortfolioUpsertWithWhereUniqueWithoutCreatedByInput>>;
};

export type PortfolioUpdateOneRequiredWithoutAccountsNestedInput = {
  connect?: InputMaybe<PortfolioWhereUniqueInput>;
  connectOrCreate?: InputMaybe<PortfolioCreateOrConnectWithoutAccountsInput>;
  create?: InputMaybe<PortfolioCreateWithoutAccountsInput>;
  update?: InputMaybe<PortfolioUpdateToOneWithWhereWithoutAccountsInput>;
  upsert?: InputMaybe<PortfolioUpsertWithoutAccountsInput>;
};

export type PortfolioUpdateOneRequiredWithoutAuthConnectionsNestedInput = {
  connect?: InputMaybe<PortfolioWhereUniqueInput>;
  connectOrCreate?: InputMaybe<PortfolioCreateOrConnectWithoutAuthConnectionsInput>;
  create?: InputMaybe<PortfolioCreateWithoutAuthConnectionsInput>;
  update?: InputMaybe<PortfolioUpdateToOneWithWhereWithoutAuthConnectionsInput>;
  upsert?: InputMaybe<PortfolioUpsertWithoutAuthConnectionsInput>;
};

export type PortfolioUpdateOneRequiredWithoutFilesNestedInput = {
  connect?: InputMaybe<PortfolioWhereUniqueInput>;
  connectOrCreate?: InputMaybe<PortfolioCreateOrConnectWithoutFilesInput>;
  create?: InputMaybe<PortfolioCreateWithoutFilesInput>;
  update?: InputMaybe<PortfolioUpdateToOneWithWhereWithoutFilesInput>;
  upsert?: InputMaybe<PortfolioUpsertWithoutFilesInput>;
};

export type PortfolioUpdateOneRequiredWithoutHarvestTransactionItemNestedInput = {
  connect?: InputMaybe<PortfolioWhereUniqueInput>;
  connectOrCreate?: InputMaybe<PortfolioCreateOrConnectWithoutHarvestTransactionItemInput>;
  create?: InputMaybe<PortfolioCreateWithoutHarvestTransactionItemInput>;
  update?: InputMaybe<PortfolioUpdateToOneWithWhereWithoutHarvestTransactionItemInput>;
  upsert?: InputMaybe<PortfolioUpsertWithoutHarvestTransactionItemInput>;
};

export type PortfolioUpdateOneRequiredWithoutHarvestTransactionNestedInput = {
  connect?: InputMaybe<PortfolioWhereUniqueInput>;
  connectOrCreate?: InputMaybe<PortfolioCreateOrConnectWithoutHarvestTransactionInput>;
  create?: InputMaybe<PortfolioCreateWithoutHarvestTransactionInput>;
  update?: InputMaybe<PortfolioUpdateToOneWithWhereWithoutHarvestTransactionInput>;
  upsert?: InputMaybe<PortfolioUpsertWithoutHarvestTransactionInput>;
};

export type PortfolioUpdateOneRequiredWithoutHarvestsNestedInput = {
  connect?: InputMaybe<PortfolioWhereUniqueInput>;
  connectOrCreate?: InputMaybe<PortfolioCreateOrConnectWithoutHarvestsInput>;
  create?: InputMaybe<PortfolioCreateWithoutHarvestsInput>;
  update?: InputMaybe<PortfolioUpdateToOneWithWhereWithoutHarvestsInput>;
  upsert?: InputMaybe<PortfolioUpsertWithoutHarvestsInput>;
};

export type PortfolioUpdateOneRequiredWithoutLotChangeLogNestedInput = {
  connect?: InputMaybe<PortfolioWhereUniqueInput>;
  connectOrCreate?: InputMaybe<PortfolioCreateOrConnectWithoutLotChangeLogInput>;
  create?: InputMaybe<PortfolioCreateWithoutLotChangeLogInput>;
  update?: InputMaybe<PortfolioUpdateToOneWithWhereWithoutLotChangeLogInput>;
  upsert?: InputMaybe<PortfolioUpsertWithoutLotChangeLogInput>;
};

export type PortfolioUpdateOneRequiredWithoutLotTransactionBatchNestedInput = {
  connect?: InputMaybe<PortfolioWhereUniqueInput>;
  connectOrCreate?: InputMaybe<PortfolioCreateOrConnectWithoutLotTransactionBatchInput>;
  create?: InputMaybe<PortfolioCreateWithoutLotTransactionBatchInput>;
  update?: InputMaybe<PortfolioUpdateToOneWithWhereWithoutLotTransactionBatchInput>;
  upsert?: InputMaybe<PortfolioUpsertWithoutLotTransactionBatchInput>;
};

export type PortfolioUpdateOneRequiredWithoutLotsNestedInput = {
  connect?: InputMaybe<PortfolioWhereUniqueInput>;
  connectOrCreate?: InputMaybe<PortfolioCreateOrConnectWithoutLotsInput>;
  create?: InputMaybe<PortfolioCreateWithoutLotsInput>;
  update?: InputMaybe<PortfolioUpdateToOneWithWhereWithoutLotsInput>;
  upsert?: InputMaybe<PortfolioUpsertWithoutLotsInput>;
};

export type PortfolioUpdateOneRequiredWithoutPositionsNestedInput = {
  connect?: InputMaybe<PortfolioWhereUniqueInput>;
  connectOrCreate?: InputMaybe<PortfolioCreateOrConnectWithoutPositionsInput>;
  create?: InputMaybe<PortfolioCreateWithoutPositionsInput>;
  update?: InputMaybe<PortfolioUpdateToOneWithWhereWithoutPositionsInput>;
  upsert?: InputMaybe<PortfolioUpsertWithoutPositionsInput>;
};

export type PortfolioUpdateOneRequiredWithoutRealizedPAndLNestedInput = {
  connect?: InputMaybe<PortfolioWhereUniqueInput>;
  connectOrCreate?: InputMaybe<PortfolioCreateOrConnectWithoutRealizedPAndLInput>;
  create?: InputMaybe<PortfolioCreateWithoutRealizedPAndLInput>;
  update?: InputMaybe<PortfolioUpdateToOneWithWhereWithoutRealizedPAndLInput>;
  upsert?: InputMaybe<PortfolioUpsertWithoutRealizedPAndLInput>;
};

export type PortfolioUpdateOneRequiredWithoutTransactionsNestedInput = {
  connect?: InputMaybe<PortfolioWhereUniqueInput>;
  connectOrCreate?: InputMaybe<PortfolioCreateOrConnectWithoutTransactionsInput>;
  create?: InputMaybe<PortfolioCreateWithoutTransactionsInput>;
  update?: InputMaybe<PortfolioUpdateToOneWithWhereWithoutTransactionsInput>;
  upsert?: InputMaybe<PortfolioUpsertWithoutTransactionsInput>;
};

export type PortfolioUpdateOneRequiredWithoutUsersOnPortfoliosNestedInput = {
  connect?: InputMaybe<PortfolioWhereUniqueInput>;
  connectOrCreate?: InputMaybe<PortfolioCreateOrConnectWithoutUsersOnPortfoliosInput>;
  create?: InputMaybe<PortfolioCreateWithoutUsersOnPortfoliosInput>;
  update?: InputMaybe<PortfolioUpdateToOneWithWhereWithoutUsersOnPortfoliosInput>;
  upsert?: InputMaybe<PortfolioUpsertWithoutUsersOnPortfoliosInput>;
};

export type PortfolioUpdateToOneWithWhereWithoutAccountsInput = {
  data: PortfolioUpdateWithoutAccountsInput;
  where?: InputMaybe<PortfolioWhereInput>;
};

export type PortfolioUpdateToOneWithWhereWithoutAuthConnectionsInput = {
  data: PortfolioUpdateWithoutAuthConnectionsInput;
  where?: InputMaybe<PortfolioWhereInput>;
};

export type PortfolioUpdateToOneWithWhereWithoutFilesInput = {
  data: PortfolioUpdateWithoutFilesInput;
  where?: InputMaybe<PortfolioWhereInput>;
};

export type PortfolioUpdateToOneWithWhereWithoutHarvestTransactionInput = {
  data: PortfolioUpdateWithoutHarvestTransactionInput;
  where?: InputMaybe<PortfolioWhereInput>;
};

export type PortfolioUpdateToOneWithWhereWithoutHarvestTransactionItemInput = {
  data: PortfolioUpdateWithoutHarvestTransactionItemInput;
  where?: InputMaybe<PortfolioWhereInput>;
};

export type PortfolioUpdateToOneWithWhereWithoutHarvestsInput = {
  data: PortfolioUpdateWithoutHarvestsInput;
  where?: InputMaybe<PortfolioWhereInput>;
};

export type PortfolioUpdateToOneWithWhereWithoutLotChangeLogInput = {
  data: PortfolioUpdateWithoutLotChangeLogInput;
  where?: InputMaybe<PortfolioWhereInput>;
};

export type PortfolioUpdateToOneWithWhereWithoutLotTransactionBatchInput = {
  data: PortfolioUpdateWithoutLotTransactionBatchInput;
  where?: InputMaybe<PortfolioWhereInput>;
};

export type PortfolioUpdateToOneWithWhereWithoutLotsInput = {
  data: PortfolioUpdateWithoutLotsInput;
  where?: InputMaybe<PortfolioWhereInput>;
};

export type PortfolioUpdateToOneWithWhereWithoutPositionsInput = {
  data: PortfolioUpdateWithoutPositionsInput;
  where?: InputMaybe<PortfolioWhereInput>;
};

export type PortfolioUpdateToOneWithWhereWithoutRealizedPAndLInput = {
  data: PortfolioUpdateWithoutRealizedPAndLInput;
  where?: InputMaybe<PortfolioWhereInput>;
};

export type PortfolioUpdateToOneWithWhereWithoutTransactionsInput = {
  data: PortfolioUpdateWithoutTransactionsInput;
  where?: InputMaybe<PortfolioWhereInput>;
};

export type PortfolioUpdateToOneWithWhereWithoutUsersOnPortfoliosInput = {
  data: PortfolioUpdateWithoutUsersOnPortfoliosInput;
  where?: InputMaybe<PortfolioWhereInput>;
};

export type PortfolioUpdateWithWhereUniqueWithoutCreatedByInput = {
  data: PortfolioUpdateWithoutCreatedByInput;
  where: PortfolioWhereUniqueInput;
};

export type PortfolioUpdateWithoutAccountsInput = {
  authConnections?: InputMaybe<AuthConnectionUpdateManyWithoutPortfolioNestedInput>;
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  createdBy?: InputMaybe<UserUpdateOneRequiredWithoutPortfolioNestedInput>;
  endOfYearTaxOpportunityNotification?: InputMaybe<BoolFieldUpdateOperationsInput>;
  files?: InputMaybe<FileUpdateManyWithoutPortfolioNestedInput>;
  harvestCycleWeeks?: InputMaybe<IntFieldUpdateOperationsInput>;
  harvestShareDollarThreshold?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  harvestTickerBucketDollarSizeLong?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  harvestTickerBucketDollarSizeShort?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  harvestTickerBucketLowerLimitLong?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  harvestTickerBucketLowerLimitShort?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  harvestTransaction?: InputMaybe<HarvestTransactionUpdateManyWithoutPortfolioNestedInput>;
  harvestTransactionItem?: InputMaybe<HarvestTransactionItemUpdateManyWithoutPortfolioNestedInput>;
  harvests?: InputMaybe<HarvestUpdateManyWithoutPortfolioNestedInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  log?: InputMaybe<LogUpdateManyWithoutPortfolioNestedInput>;
  lotChangeLog?: InputMaybe<LotChangeLogUpdateManyWithoutPortfolioNestedInput>;
  lotTransactionBatch?: InputMaybe<LotTransactionBatchUpdateManyWithoutPortfolioNestedInput>;
  lots?: InputMaybe<LotUpdateManyWithoutPortfolioNestedInput>;
  minimumLotPAndL?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  name?: InputMaybe<StringFieldUpdateOperationsInput>;
  notificationFrequency?: InputMaybe<EnumHarvestNotificationFrequencyFieldUpdateOperationsInput>;
  positions?: InputMaybe<PositionUpdateManyWithoutPortfolioNestedInput>;
  realizedPAndL?: InputMaybe<RealizedPAndLUpdateManyWithoutPortfolioNestedInput>;
  transactions?: InputMaybe<TransactionUpdateManyWithoutPortfolioNestedInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  usersOnPortfolios?: InputMaybe<UsersOnPortfoliosUpdateManyWithoutPortfolioNestedInput>;
};

export type PortfolioUpdateWithoutAuthConnectionsInput = {
  accounts?: InputMaybe<AccountUpdateManyWithoutPortfolioNestedInput>;
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  createdBy?: InputMaybe<UserUpdateOneRequiredWithoutPortfolioNestedInput>;
  endOfYearTaxOpportunityNotification?: InputMaybe<BoolFieldUpdateOperationsInput>;
  files?: InputMaybe<FileUpdateManyWithoutPortfolioNestedInput>;
  harvestCycleWeeks?: InputMaybe<IntFieldUpdateOperationsInput>;
  harvestShareDollarThreshold?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  harvestTickerBucketDollarSizeLong?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  harvestTickerBucketDollarSizeShort?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  harvestTickerBucketLowerLimitLong?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  harvestTickerBucketLowerLimitShort?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  harvestTransaction?: InputMaybe<HarvestTransactionUpdateManyWithoutPortfolioNestedInput>;
  harvestTransactionItem?: InputMaybe<HarvestTransactionItemUpdateManyWithoutPortfolioNestedInput>;
  harvests?: InputMaybe<HarvestUpdateManyWithoutPortfolioNestedInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  log?: InputMaybe<LogUpdateManyWithoutPortfolioNestedInput>;
  lotChangeLog?: InputMaybe<LotChangeLogUpdateManyWithoutPortfolioNestedInput>;
  lotTransactionBatch?: InputMaybe<LotTransactionBatchUpdateManyWithoutPortfolioNestedInput>;
  lots?: InputMaybe<LotUpdateManyWithoutPortfolioNestedInput>;
  minimumLotPAndL?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  name?: InputMaybe<StringFieldUpdateOperationsInput>;
  notificationFrequency?: InputMaybe<EnumHarvestNotificationFrequencyFieldUpdateOperationsInput>;
  positions?: InputMaybe<PositionUpdateManyWithoutPortfolioNestedInput>;
  realizedPAndL?: InputMaybe<RealizedPAndLUpdateManyWithoutPortfolioNestedInput>;
  transactions?: InputMaybe<TransactionUpdateManyWithoutPortfolioNestedInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  usersOnPortfolios?: InputMaybe<UsersOnPortfoliosUpdateManyWithoutPortfolioNestedInput>;
};

export type PortfolioUpdateWithoutCreatedByInput = {
  accounts?: InputMaybe<AccountUpdateManyWithoutPortfolioNestedInput>;
  authConnections?: InputMaybe<AuthConnectionUpdateManyWithoutPortfolioNestedInput>;
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  endOfYearTaxOpportunityNotification?: InputMaybe<BoolFieldUpdateOperationsInput>;
  files?: InputMaybe<FileUpdateManyWithoutPortfolioNestedInput>;
  harvestCycleWeeks?: InputMaybe<IntFieldUpdateOperationsInput>;
  harvestShareDollarThreshold?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  harvestTickerBucketDollarSizeLong?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  harvestTickerBucketDollarSizeShort?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  harvestTickerBucketLowerLimitLong?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  harvestTickerBucketLowerLimitShort?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  harvestTransaction?: InputMaybe<HarvestTransactionUpdateManyWithoutPortfolioNestedInput>;
  harvestTransactionItem?: InputMaybe<HarvestTransactionItemUpdateManyWithoutPortfolioNestedInput>;
  harvests?: InputMaybe<HarvestUpdateManyWithoutPortfolioNestedInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  log?: InputMaybe<LogUpdateManyWithoutPortfolioNestedInput>;
  lotChangeLog?: InputMaybe<LotChangeLogUpdateManyWithoutPortfolioNestedInput>;
  lotTransactionBatch?: InputMaybe<LotTransactionBatchUpdateManyWithoutPortfolioNestedInput>;
  lots?: InputMaybe<LotUpdateManyWithoutPortfolioNestedInput>;
  minimumLotPAndL?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  name?: InputMaybe<StringFieldUpdateOperationsInput>;
  notificationFrequency?: InputMaybe<EnumHarvestNotificationFrequencyFieldUpdateOperationsInput>;
  positions?: InputMaybe<PositionUpdateManyWithoutPortfolioNestedInput>;
  realizedPAndL?: InputMaybe<RealizedPAndLUpdateManyWithoutPortfolioNestedInput>;
  transactions?: InputMaybe<TransactionUpdateManyWithoutPortfolioNestedInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  usersOnPortfolios?: InputMaybe<UsersOnPortfoliosUpdateManyWithoutPortfolioNestedInput>;
};

export type PortfolioUpdateWithoutFilesInput = {
  accounts?: InputMaybe<AccountUpdateManyWithoutPortfolioNestedInput>;
  authConnections?: InputMaybe<AuthConnectionUpdateManyWithoutPortfolioNestedInput>;
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  createdBy?: InputMaybe<UserUpdateOneRequiredWithoutPortfolioNestedInput>;
  endOfYearTaxOpportunityNotification?: InputMaybe<BoolFieldUpdateOperationsInput>;
  harvestCycleWeeks?: InputMaybe<IntFieldUpdateOperationsInput>;
  harvestShareDollarThreshold?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  harvestTickerBucketDollarSizeLong?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  harvestTickerBucketDollarSizeShort?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  harvestTickerBucketLowerLimitLong?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  harvestTickerBucketLowerLimitShort?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  harvestTransaction?: InputMaybe<HarvestTransactionUpdateManyWithoutPortfolioNestedInput>;
  harvestTransactionItem?: InputMaybe<HarvestTransactionItemUpdateManyWithoutPortfolioNestedInput>;
  harvests?: InputMaybe<HarvestUpdateManyWithoutPortfolioNestedInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  log?: InputMaybe<LogUpdateManyWithoutPortfolioNestedInput>;
  lotChangeLog?: InputMaybe<LotChangeLogUpdateManyWithoutPortfolioNestedInput>;
  lotTransactionBatch?: InputMaybe<LotTransactionBatchUpdateManyWithoutPortfolioNestedInput>;
  lots?: InputMaybe<LotUpdateManyWithoutPortfolioNestedInput>;
  minimumLotPAndL?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  name?: InputMaybe<StringFieldUpdateOperationsInput>;
  notificationFrequency?: InputMaybe<EnumHarvestNotificationFrequencyFieldUpdateOperationsInput>;
  positions?: InputMaybe<PositionUpdateManyWithoutPortfolioNestedInput>;
  realizedPAndL?: InputMaybe<RealizedPAndLUpdateManyWithoutPortfolioNestedInput>;
  transactions?: InputMaybe<TransactionUpdateManyWithoutPortfolioNestedInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  usersOnPortfolios?: InputMaybe<UsersOnPortfoliosUpdateManyWithoutPortfolioNestedInput>;
};

export type PortfolioUpdateWithoutHarvestTransactionInput = {
  accounts?: InputMaybe<AccountUpdateManyWithoutPortfolioNestedInput>;
  authConnections?: InputMaybe<AuthConnectionUpdateManyWithoutPortfolioNestedInput>;
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  createdBy?: InputMaybe<UserUpdateOneRequiredWithoutPortfolioNestedInput>;
  endOfYearTaxOpportunityNotification?: InputMaybe<BoolFieldUpdateOperationsInput>;
  files?: InputMaybe<FileUpdateManyWithoutPortfolioNestedInput>;
  harvestCycleWeeks?: InputMaybe<IntFieldUpdateOperationsInput>;
  harvestShareDollarThreshold?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  harvestTickerBucketDollarSizeLong?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  harvestTickerBucketDollarSizeShort?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  harvestTickerBucketLowerLimitLong?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  harvestTickerBucketLowerLimitShort?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  harvestTransactionItem?: InputMaybe<HarvestTransactionItemUpdateManyWithoutPortfolioNestedInput>;
  harvests?: InputMaybe<HarvestUpdateManyWithoutPortfolioNestedInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  log?: InputMaybe<LogUpdateManyWithoutPortfolioNestedInput>;
  lotChangeLog?: InputMaybe<LotChangeLogUpdateManyWithoutPortfolioNestedInput>;
  lotTransactionBatch?: InputMaybe<LotTransactionBatchUpdateManyWithoutPortfolioNestedInput>;
  lots?: InputMaybe<LotUpdateManyWithoutPortfolioNestedInput>;
  minimumLotPAndL?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  name?: InputMaybe<StringFieldUpdateOperationsInput>;
  notificationFrequency?: InputMaybe<EnumHarvestNotificationFrequencyFieldUpdateOperationsInput>;
  positions?: InputMaybe<PositionUpdateManyWithoutPortfolioNestedInput>;
  realizedPAndL?: InputMaybe<RealizedPAndLUpdateManyWithoutPortfolioNestedInput>;
  transactions?: InputMaybe<TransactionUpdateManyWithoutPortfolioNestedInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  usersOnPortfolios?: InputMaybe<UsersOnPortfoliosUpdateManyWithoutPortfolioNestedInput>;
};

export type PortfolioUpdateWithoutHarvestTransactionItemInput = {
  accounts?: InputMaybe<AccountUpdateManyWithoutPortfolioNestedInput>;
  authConnections?: InputMaybe<AuthConnectionUpdateManyWithoutPortfolioNestedInput>;
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  createdBy?: InputMaybe<UserUpdateOneRequiredWithoutPortfolioNestedInput>;
  endOfYearTaxOpportunityNotification?: InputMaybe<BoolFieldUpdateOperationsInput>;
  files?: InputMaybe<FileUpdateManyWithoutPortfolioNestedInput>;
  harvestCycleWeeks?: InputMaybe<IntFieldUpdateOperationsInput>;
  harvestShareDollarThreshold?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  harvestTickerBucketDollarSizeLong?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  harvestTickerBucketDollarSizeShort?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  harvestTickerBucketLowerLimitLong?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  harvestTickerBucketLowerLimitShort?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  harvestTransaction?: InputMaybe<HarvestTransactionUpdateManyWithoutPortfolioNestedInput>;
  harvests?: InputMaybe<HarvestUpdateManyWithoutPortfolioNestedInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  log?: InputMaybe<LogUpdateManyWithoutPortfolioNestedInput>;
  lotChangeLog?: InputMaybe<LotChangeLogUpdateManyWithoutPortfolioNestedInput>;
  lotTransactionBatch?: InputMaybe<LotTransactionBatchUpdateManyWithoutPortfolioNestedInput>;
  lots?: InputMaybe<LotUpdateManyWithoutPortfolioNestedInput>;
  minimumLotPAndL?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  name?: InputMaybe<StringFieldUpdateOperationsInput>;
  notificationFrequency?: InputMaybe<EnumHarvestNotificationFrequencyFieldUpdateOperationsInput>;
  positions?: InputMaybe<PositionUpdateManyWithoutPortfolioNestedInput>;
  realizedPAndL?: InputMaybe<RealizedPAndLUpdateManyWithoutPortfolioNestedInput>;
  transactions?: InputMaybe<TransactionUpdateManyWithoutPortfolioNestedInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  usersOnPortfolios?: InputMaybe<UsersOnPortfoliosUpdateManyWithoutPortfolioNestedInput>;
};

export type PortfolioUpdateWithoutHarvestsInput = {
  accounts?: InputMaybe<AccountUpdateManyWithoutPortfolioNestedInput>;
  authConnections?: InputMaybe<AuthConnectionUpdateManyWithoutPortfolioNestedInput>;
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  createdBy?: InputMaybe<UserUpdateOneRequiredWithoutPortfolioNestedInput>;
  endOfYearTaxOpportunityNotification?: InputMaybe<BoolFieldUpdateOperationsInput>;
  files?: InputMaybe<FileUpdateManyWithoutPortfolioNestedInput>;
  harvestCycleWeeks?: InputMaybe<IntFieldUpdateOperationsInput>;
  harvestShareDollarThreshold?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  harvestTickerBucketDollarSizeLong?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  harvestTickerBucketDollarSizeShort?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  harvestTickerBucketLowerLimitLong?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  harvestTickerBucketLowerLimitShort?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  harvestTransaction?: InputMaybe<HarvestTransactionUpdateManyWithoutPortfolioNestedInput>;
  harvestTransactionItem?: InputMaybe<HarvestTransactionItemUpdateManyWithoutPortfolioNestedInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  log?: InputMaybe<LogUpdateManyWithoutPortfolioNestedInput>;
  lotChangeLog?: InputMaybe<LotChangeLogUpdateManyWithoutPortfolioNestedInput>;
  lotTransactionBatch?: InputMaybe<LotTransactionBatchUpdateManyWithoutPortfolioNestedInput>;
  lots?: InputMaybe<LotUpdateManyWithoutPortfolioNestedInput>;
  minimumLotPAndL?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  name?: InputMaybe<StringFieldUpdateOperationsInput>;
  notificationFrequency?: InputMaybe<EnumHarvestNotificationFrequencyFieldUpdateOperationsInput>;
  positions?: InputMaybe<PositionUpdateManyWithoutPortfolioNestedInput>;
  realizedPAndL?: InputMaybe<RealizedPAndLUpdateManyWithoutPortfolioNestedInput>;
  transactions?: InputMaybe<TransactionUpdateManyWithoutPortfolioNestedInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  usersOnPortfolios?: InputMaybe<UsersOnPortfoliosUpdateManyWithoutPortfolioNestedInput>;
};

export type PortfolioUpdateWithoutLotChangeLogInput = {
  accounts?: InputMaybe<AccountUpdateManyWithoutPortfolioNestedInput>;
  authConnections?: InputMaybe<AuthConnectionUpdateManyWithoutPortfolioNestedInput>;
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  createdBy?: InputMaybe<UserUpdateOneRequiredWithoutPortfolioNestedInput>;
  endOfYearTaxOpportunityNotification?: InputMaybe<BoolFieldUpdateOperationsInput>;
  files?: InputMaybe<FileUpdateManyWithoutPortfolioNestedInput>;
  harvestCycleWeeks?: InputMaybe<IntFieldUpdateOperationsInput>;
  harvestShareDollarThreshold?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  harvestTickerBucketDollarSizeLong?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  harvestTickerBucketDollarSizeShort?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  harvestTickerBucketLowerLimitLong?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  harvestTickerBucketLowerLimitShort?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  harvestTransaction?: InputMaybe<HarvestTransactionUpdateManyWithoutPortfolioNestedInput>;
  harvestTransactionItem?: InputMaybe<HarvestTransactionItemUpdateManyWithoutPortfolioNestedInput>;
  harvests?: InputMaybe<HarvestUpdateManyWithoutPortfolioNestedInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  log?: InputMaybe<LogUpdateManyWithoutPortfolioNestedInput>;
  lotTransactionBatch?: InputMaybe<LotTransactionBatchUpdateManyWithoutPortfolioNestedInput>;
  lots?: InputMaybe<LotUpdateManyWithoutPortfolioNestedInput>;
  minimumLotPAndL?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  name?: InputMaybe<StringFieldUpdateOperationsInput>;
  notificationFrequency?: InputMaybe<EnumHarvestNotificationFrequencyFieldUpdateOperationsInput>;
  positions?: InputMaybe<PositionUpdateManyWithoutPortfolioNestedInput>;
  realizedPAndL?: InputMaybe<RealizedPAndLUpdateManyWithoutPortfolioNestedInput>;
  transactions?: InputMaybe<TransactionUpdateManyWithoutPortfolioNestedInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  usersOnPortfolios?: InputMaybe<UsersOnPortfoliosUpdateManyWithoutPortfolioNestedInput>;
};

export type PortfolioUpdateWithoutLotTransactionBatchInput = {
  accounts?: InputMaybe<AccountUpdateManyWithoutPortfolioNestedInput>;
  authConnections?: InputMaybe<AuthConnectionUpdateManyWithoutPortfolioNestedInput>;
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  createdBy?: InputMaybe<UserUpdateOneRequiredWithoutPortfolioNestedInput>;
  endOfYearTaxOpportunityNotification?: InputMaybe<BoolFieldUpdateOperationsInput>;
  files?: InputMaybe<FileUpdateManyWithoutPortfolioNestedInput>;
  harvestCycleWeeks?: InputMaybe<IntFieldUpdateOperationsInput>;
  harvestShareDollarThreshold?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  harvestTickerBucketDollarSizeLong?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  harvestTickerBucketDollarSizeShort?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  harvestTickerBucketLowerLimitLong?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  harvestTickerBucketLowerLimitShort?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  harvestTransaction?: InputMaybe<HarvestTransactionUpdateManyWithoutPortfolioNestedInput>;
  harvestTransactionItem?: InputMaybe<HarvestTransactionItemUpdateManyWithoutPortfolioNestedInput>;
  harvests?: InputMaybe<HarvestUpdateManyWithoutPortfolioNestedInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  log?: InputMaybe<LogUpdateManyWithoutPortfolioNestedInput>;
  lotChangeLog?: InputMaybe<LotChangeLogUpdateManyWithoutPortfolioNestedInput>;
  lots?: InputMaybe<LotUpdateManyWithoutPortfolioNestedInput>;
  minimumLotPAndL?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  name?: InputMaybe<StringFieldUpdateOperationsInput>;
  notificationFrequency?: InputMaybe<EnumHarvestNotificationFrequencyFieldUpdateOperationsInput>;
  positions?: InputMaybe<PositionUpdateManyWithoutPortfolioNestedInput>;
  realizedPAndL?: InputMaybe<RealizedPAndLUpdateManyWithoutPortfolioNestedInput>;
  transactions?: InputMaybe<TransactionUpdateManyWithoutPortfolioNestedInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  usersOnPortfolios?: InputMaybe<UsersOnPortfoliosUpdateManyWithoutPortfolioNestedInput>;
};

export type PortfolioUpdateWithoutLotsInput = {
  accounts?: InputMaybe<AccountUpdateManyWithoutPortfolioNestedInput>;
  authConnections?: InputMaybe<AuthConnectionUpdateManyWithoutPortfolioNestedInput>;
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  createdBy?: InputMaybe<UserUpdateOneRequiredWithoutPortfolioNestedInput>;
  endOfYearTaxOpportunityNotification?: InputMaybe<BoolFieldUpdateOperationsInput>;
  files?: InputMaybe<FileUpdateManyWithoutPortfolioNestedInput>;
  harvestCycleWeeks?: InputMaybe<IntFieldUpdateOperationsInput>;
  harvestShareDollarThreshold?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  harvestTickerBucketDollarSizeLong?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  harvestTickerBucketDollarSizeShort?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  harvestTickerBucketLowerLimitLong?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  harvestTickerBucketLowerLimitShort?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  harvestTransaction?: InputMaybe<HarvestTransactionUpdateManyWithoutPortfolioNestedInput>;
  harvestTransactionItem?: InputMaybe<HarvestTransactionItemUpdateManyWithoutPortfolioNestedInput>;
  harvests?: InputMaybe<HarvestUpdateManyWithoutPortfolioNestedInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  log?: InputMaybe<LogUpdateManyWithoutPortfolioNestedInput>;
  lotChangeLog?: InputMaybe<LotChangeLogUpdateManyWithoutPortfolioNestedInput>;
  lotTransactionBatch?: InputMaybe<LotTransactionBatchUpdateManyWithoutPortfolioNestedInput>;
  minimumLotPAndL?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  name?: InputMaybe<StringFieldUpdateOperationsInput>;
  notificationFrequency?: InputMaybe<EnumHarvestNotificationFrequencyFieldUpdateOperationsInput>;
  positions?: InputMaybe<PositionUpdateManyWithoutPortfolioNestedInput>;
  realizedPAndL?: InputMaybe<RealizedPAndLUpdateManyWithoutPortfolioNestedInput>;
  transactions?: InputMaybe<TransactionUpdateManyWithoutPortfolioNestedInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  usersOnPortfolios?: InputMaybe<UsersOnPortfoliosUpdateManyWithoutPortfolioNestedInput>;
};

export type PortfolioUpdateWithoutPositionsInput = {
  accounts?: InputMaybe<AccountUpdateManyWithoutPortfolioNestedInput>;
  authConnections?: InputMaybe<AuthConnectionUpdateManyWithoutPortfolioNestedInput>;
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  createdBy?: InputMaybe<UserUpdateOneRequiredWithoutPortfolioNestedInput>;
  endOfYearTaxOpportunityNotification?: InputMaybe<BoolFieldUpdateOperationsInput>;
  files?: InputMaybe<FileUpdateManyWithoutPortfolioNestedInput>;
  harvestCycleWeeks?: InputMaybe<IntFieldUpdateOperationsInput>;
  harvestShareDollarThreshold?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  harvestTickerBucketDollarSizeLong?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  harvestTickerBucketDollarSizeShort?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  harvestTickerBucketLowerLimitLong?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  harvestTickerBucketLowerLimitShort?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  harvestTransaction?: InputMaybe<HarvestTransactionUpdateManyWithoutPortfolioNestedInput>;
  harvestTransactionItem?: InputMaybe<HarvestTransactionItemUpdateManyWithoutPortfolioNestedInput>;
  harvests?: InputMaybe<HarvestUpdateManyWithoutPortfolioNestedInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  log?: InputMaybe<LogUpdateManyWithoutPortfolioNestedInput>;
  lotChangeLog?: InputMaybe<LotChangeLogUpdateManyWithoutPortfolioNestedInput>;
  lotTransactionBatch?: InputMaybe<LotTransactionBatchUpdateManyWithoutPortfolioNestedInput>;
  lots?: InputMaybe<LotUpdateManyWithoutPortfolioNestedInput>;
  minimumLotPAndL?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  name?: InputMaybe<StringFieldUpdateOperationsInput>;
  notificationFrequency?: InputMaybe<EnumHarvestNotificationFrequencyFieldUpdateOperationsInput>;
  realizedPAndL?: InputMaybe<RealizedPAndLUpdateManyWithoutPortfolioNestedInput>;
  transactions?: InputMaybe<TransactionUpdateManyWithoutPortfolioNestedInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  usersOnPortfolios?: InputMaybe<UsersOnPortfoliosUpdateManyWithoutPortfolioNestedInput>;
};

export type PortfolioUpdateWithoutRealizedPAndLInput = {
  accounts?: InputMaybe<AccountUpdateManyWithoutPortfolioNestedInput>;
  authConnections?: InputMaybe<AuthConnectionUpdateManyWithoutPortfolioNestedInput>;
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  createdBy?: InputMaybe<UserUpdateOneRequiredWithoutPortfolioNestedInput>;
  endOfYearTaxOpportunityNotification?: InputMaybe<BoolFieldUpdateOperationsInput>;
  files?: InputMaybe<FileUpdateManyWithoutPortfolioNestedInput>;
  harvestCycleWeeks?: InputMaybe<IntFieldUpdateOperationsInput>;
  harvestShareDollarThreshold?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  harvestTickerBucketDollarSizeLong?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  harvestTickerBucketDollarSizeShort?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  harvestTickerBucketLowerLimitLong?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  harvestTickerBucketLowerLimitShort?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  harvestTransaction?: InputMaybe<HarvestTransactionUpdateManyWithoutPortfolioNestedInput>;
  harvestTransactionItem?: InputMaybe<HarvestTransactionItemUpdateManyWithoutPortfolioNestedInput>;
  harvests?: InputMaybe<HarvestUpdateManyWithoutPortfolioNestedInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  log?: InputMaybe<LogUpdateManyWithoutPortfolioNestedInput>;
  lotChangeLog?: InputMaybe<LotChangeLogUpdateManyWithoutPortfolioNestedInput>;
  lotTransactionBatch?: InputMaybe<LotTransactionBatchUpdateManyWithoutPortfolioNestedInput>;
  lots?: InputMaybe<LotUpdateManyWithoutPortfolioNestedInput>;
  minimumLotPAndL?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  name?: InputMaybe<StringFieldUpdateOperationsInput>;
  notificationFrequency?: InputMaybe<EnumHarvestNotificationFrequencyFieldUpdateOperationsInput>;
  positions?: InputMaybe<PositionUpdateManyWithoutPortfolioNestedInput>;
  transactions?: InputMaybe<TransactionUpdateManyWithoutPortfolioNestedInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  usersOnPortfolios?: InputMaybe<UsersOnPortfoliosUpdateManyWithoutPortfolioNestedInput>;
};

export type PortfolioUpdateWithoutTransactionsInput = {
  accounts?: InputMaybe<AccountUpdateManyWithoutPortfolioNestedInput>;
  authConnections?: InputMaybe<AuthConnectionUpdateManyWithoutPortfolioNestedInput>;
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  createdBy?: InputMaybe<UserUpdateOneRequiredWithoutPortfolioNestedInput>;
  endOfYearTaxOpportunityNotification?: InputMaybe<BoolFieldUpdateOperationsInput>;
  files?: InputMaybe<FileUpdateManyWithoutPortfolioNestedInput>;
  harvestCycleWeeks?: InputMaybe<IntFieldUpdateOperationsInput>;
  harvestShareDollarThreshold?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  harvestTickerBucketDollarSizeLong?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  harvestTickerBucketDollarSizeShort?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  harvestTickerBucketLowerLimitLong?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  harvestTickerBucketLowerLimitShort?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  harvestTransaction?: InputMaybe<HarvestTransactionUpdateManyWithoutPortfolioNestedInput>;
  harvestTransactionItem?: InputMaybe<HarvestTransactionItemUpdateManyWithoutPortfolioNestedInput>;
  harvests?: InputMaybe<HarvestUpdateManyWithoutPortfolioNestedInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  log?: InputMaybe<LogUpdateManyWithoutPortfolioNestedInput>;
  lotChangeLog?: InputMaybe<LotChangeLogUpdateManyWithoutPortfolioNestedInput>;
  lotTransactionBatch?: InputMaybe<LotTransactionBatchUpdateManyWithoutPortfolioNestedInput>;
  lots?: InputMaybe<LotUpdateManyWithoutPortfolioNestedInput>;
  minimumLotPAndL?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  name?: InputMaybe<StringFieldUpdateOperationsInput>;
  notificationFrequency?: InputMaybe<EnumHarvestNotificationFrequencyFieldUpdateOperationsInput>;
  positions?: InputMaybe<PositionUpdateManyWithoutPortfolioNestedInput>;
  realizedPAndL?: InputMaybe<RealizedPAndLUpdateManyWithoutPortfolioNestedInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  usersOnPortfolios?: InputMaybe<UsersOnPortfoliosUpdateManyWithoutPortfolioNestedInput>;
};

export type PortfolioUpdateWithoutUsersOnPortfoliosInput = {
  accounts?: InputMaybe<AccountUpdateManyWithoutPortfolioNestedInput>;
  authConnections?: InputMaybe<AuthConnectionUpdateManyWithoutPortfolioNestedInput>;
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  createdBy?: InputMaybe<UserUpdateOneRequiredWithoutPortfolioNestedInput>;
  endOfYearTaxOpportunityNotification?: InputMaybe<BoolFieldUpdateOperationsInput>;
  files?: InputMaybe<FileUpdateManyWithoutPortfolioNestedInput>;
  harvestCycleWeeks?: InputMaybe<IntFieldUpdateOperationsInput>;
  harvestShareDollarThreshold?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  harvestTickerBucketDollarSizeLong?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  harvestTickerBucketDollarSizeShort?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  harvestTickerBucketLowerLimitLong?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  harvestTickerBucketLowerLimitShort?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  harvestTransaction?: InputMaybe<HarvestTransactionUpdateManyWithoutPortfolioNestedInput>;
  harvestTransactionItem?: InputMaybe<HarvestTransactionItemUpdateManyWithoutPortfolioNestedInput>;
  harvests?: InputMaybe<HarvestUpdateManyWithoutPortfolioNestedInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  log?: InputMaybe<LogUpdateManyWithoutPortfolioNestedInput>;
  lotChangeLog?: InputMaybe<LotChangeLogUpdateManyWithoutPortfolioNestedInput>;
  lotTransactionBatch?: InputMaybe<LotTransactionBatchUpdateManyWithoutPortfolioNestedInput>;
  lots?: InputMaybe<LotUpdateManyWithoutPortfolioNestedInput>;
  minimumLotPAndL?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  name?: InputMaybe<StringFieldUpdateOperationsInput>;
  notificationFrequency?: InputMaybe<EnumHarvestNotificationFrequencyFieldUpdateOperationsInput>;
  positions?: InputMaybe<PositionUpdateManyWithoutPortfolioNestedInput>;
  realizedPAndL?: InputMaybe<RealizedPAndLUpdateManyWithoutPortfolioNestedInput>;
  transactions?: InputMaybe<TransactionUpdateManyWithoutPortfolioNestedInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
};

export type PortfolioUpsertWithWhereUniqueWithoutCreatedByInput = {
  create: PortfolioCreateWithoutCreatedByInput;
  update: PortfolioUpdateWithoutCreatedByInput;
  where: PortfolioWhereUniqueInput;
};

export type PortfolioUpsertWithoutAccountsInput = {
  create: PortfolioCreateWithoutAccountsInput;
  update: PortfolioUpdateWithoutAccountsInput;
  where?: InputMaybe<PortfolioWhereInput>;
};

export type PortfolioUpsertWithoutAuthConnectionsInput = {
  create: PortfolioCreateWithoutAuthConnectionsInput;
  update: PortfolioUpdateWithoutAuthConnectionsInput;
  where?: InputMaybe<PortfolioWhereInput>;
};

export type PortfolioUpsertWithoutFilesInput = {
  create: PortfolioCreateWithoutFilesInput;
  update: PortfolioUpdateWithoutFilesInput;
  where?: InputMaybe<PortfolioWhereInput>;
};

export type PortfolioUpsertWithoutHarvestTransactionInput = {
  create: PortfolioCreateWithoutHarvestTransactionInput;
  update: PortfolioUpdateWithoutHarvestTransactionInput;
  where?: InputMaybe<PortfolioWhereInput>;
};

export type PortfolioUpsertWithoutHarvestTransactionItemInput = {
  create: PortfolioCreateWithoutHarvestTransactionItemInput;
  update: PortfolioUpdateWithoutHarvestTransactionItemInput;
  where?: InputMaybe<PortfolioWhereInput>;
};

export type PortfolioUpsertWithoutHarvestsInput = {
  create: PortfolioCreateWithoutHarvestsInput;
  update: PortfolioUpdateWithoutHarvestsInput;
  where?: InputMaybe<PortfolioWhereInput>;
};

export type PortfolioUpsertWithoutLotChangeLogInput = {
  create: PortfolioCreateWithoutLotChangeLogInput;
  update: PortfolioUpdateWithoutLotChangeLogInput;
  where?: InputMaybe<PortfolioWhereInput>;
};

export type PortfolioUpsertWithoutLotTransactionBatchInput = {
  create: PortfolioCreateWithoutLotTransactionBatchInput;
  update: PortfolioUpdateWithoutLotTransactionBatchInput;
  where?: InputMaybe<PortfolioWhereInput>;
};

export type PortfolioUpsertWithoutLotsInput = {
  create: PortfolioCreateWithoutLotsInput;
  update: PortfolioUpdateWithoutLotsInput;
  where?: InputMaybe<PortfolioWhereInput>;
};

export type PortfolioUpsertWithoutPositionsInput = {
  create: PortfolioCreateWithoutPositionsInput;
  update: PortfolioUpdateWithoutPositionsInput;
  where?: InputMaybe<PortfolioWhereInput>;
};

export type PortfolioUpsertWithoutRealizedPAndLInput = {
  create: PortfolioCreateWithoutRealizedPAndLInput;
  update: PortfolioUpdateWithoutRealizedPAndLInput;
  where?: InputMaybe<PortfolioWhereInput>;
};

export type PortfolioUpsertWithoutTransactionsInput = {
  create: PortfolioCreateWithoutTransactionsInput;
  update: PortfolioUpdateWithoutTransactionsInput;
  where?: InputMaybe<PortfolioWhereInput>;
};

export type PortfolioUpsertWithoutUsersOnPortfoliosInput = {
  create: PortfolioCreateWithoutUsersOnPortfoliosInput;
  update: PortfolioUpdateWithoutUsersOnPortfoliosInput;
  where?: InputMaybe<PortfolioWhereInput>;
};

export type PortfolioWhereInput = {
  AND?: InputMaybe<Array<PortfolioWhereInput>>;
  NOT?: InputMaybe<Array<PortfolioWhereInput>>;
  OR?: InputMaybe<Array<PortfolioWhereInput>>;
  accounts?: InputMaybe<AccountListRelationFilter>;
  authConnections?: InputMaybe<AuthConnectionListRelationFilter>;
  createdAt?: InputMaybe<DateTimeFilter>;
  createdBy?: InputMaybe<UserScalarRelationFilter>;
  createdById?: InputMaybe<StringFilter>;
  endOfYearTaxOpportunityNotification?: InputMaybe<BoolFilter>;
  files?: InputMaybe<FileListRelationFilter>;
  harvestCycleWeeks?: InputMaybe<IntFilter>;
  harvestShareDollarThreshold?: InputMaybe<DecimalFilter>;
  harvestTickerBucketDollarSizeLong?: InputMaybe<DecimalFilter>;
  harvestTickerBucketDollarSizeShort?: InputMaybe<DecimalFilter>;
  harvestTickerBucketLowerLimitLong?: InputMaybe<DecimalFilter>;
  harvestTickerBucketLowerLimitShort?: InputMaybe<DecimalFilter>;
  harvestTransaction?: InputMaybe<HarvestTransactionListRelationFilter>;
  harvestTransactionItem?: InputMaybe<HarvestTransactionItemListRelationFilter>;
  harvests?: InputMaybe<HarvestListRelationFilter>;
  id?: InputMaybe<UuidFilter>;
  log?: InputMaybe<LogListRelationFilter>;
  lotChangeLog?: InputMaybe<LotChangeLogListRelationFilter>;
  lotTransactionBatch?: InputMaybe<LotTransactionBatchListRelationFilter>;
  lots?: InputMaybe<LotListRelationFilter>;
  minimumLotPAndL?: InputMaybe<DecimalFilter>;
  name?: InputMaybe<StringFilter>;
  notificationFrequency?: InputMaybe<EnumHarvestNotificationFrequencyFilter>;
  positions?: InputMaybe<PositionListRelationFilter>;
  realizedPAndL?: InputMaybe<RealizedPAndLListRelationFilter>;
  transactions?: InputMaybe<TransactionListRelationFilter>;
  updatedAt?: InputMaybe<DateTimeFilter>;
  usersOnPortfolios?: InputMaybe<UsersOnPortfoliosListRelationFilter>;
};

export type PortfolioWhereUniqueInput = {
  AND?: InputMaybe<Array<PortfolioWhereInput>>;
  NOT?: InputMaybe<Array<PortfolioWhereInput>>;
  OR?: InputMaybe<Array<PortfolioWhereInput>>;
  accounts?: InputMaybe<AccountListRelationFilter>;
  authConnections?: InputMaybe<AuthConnectionListRelationFilter>;
  createdAt?: InputMaybe<DateTimeFilter>;
  createdBy?: InputMaybe<UserScalarRelationFilter>;
  createdById?: InputMaybe<StringFilter>;
  endOfYearTaxOpportunityNotification?: InputMaybe<BoolFilter>;
  files?: InputMaybe<FileListRelationFilter>;
  harvestCycleWeeks?: InputMaybe<IntFilter>;
  harvestShareDollarThreshold?: InputMaybe<DecimalFilter>;
  harvestTickerBucketDollarSizeLong?: InputMaybe<DecimalFilter>;
  harvestTickerBucketDollarSizeShort?: InputMaybe<DecimalFilter>;
  harvestTickerBucketLowerLimitLong?: InputMaybe<DecimalFilter>;
  harvestTickerBucketLowerLimitShort?: InputMaybe<DecimalFilter>;
  harvestTransaction?: InputMaybe<HarvestTransactionListRelationFilter>;
  harvestTransactionItem?: InputMaybe<HarvestTransactionItemListRelationFilter>;
  harvests?: InputMaybe<HarvestListRelationFilter>;
  id?: InputMaybe<Scalars['String']['input']>;
  log?: InputMaybe<LogListRelationFilter>;
  lotChangeLog?: InputMaybe<LotChangeLogListRelationFilter>;
  lotTransactionBatch?: InputMaybe<LotTransactionBatchListRelationFilter>;
  lots?: InputMaybe<LotListRelationFilter>;
  minimumLotPAndL?: InputMaybe<DecimalFilter>;
  name?: InputMaybe<StringFilter>;
  notificationFrequency?: InputMaybe<EnumHarvestNotificationFrequencyFilter>;
  positions?: InputMaybe<PositionListRelationFilter>;
  realizedPAndL?: InputMaybe<RealizedPAndLListRelationFilter>;
  transactions?: InputMaybe<TransactionListRelationFilter>;
  updatedAt?: InputMaybe<DateTimeFilter>;
  usersOnPortfolios?: InputMaybe<UsersOnPortfoliosListRelationFilter>;
};

/**
 * This model really should never be shown to the user - most api's have it but its
 * just a grouping of open lots. We track it as its needed for calculations derived from plaid
 * but user facing tables etc. and harvest calc's should roll up lots
 */
export type Position = {
  __typename?: 'Position';
  _count: PositionCount;
  account: Account;
  accountId: Scalars['String']['output'];
  asset: Asset;
  assetSymbol: Scalars['String']['output'];
  change?: Maybe<Scalars['Decimal']['output']>;
  changePCT?: Maybe<Scalars['Decimal']['output']>;
  commissionDay?: Maybe<Scalars['Decimal']['output']>;
  commissionTotal?: Maybe<Scalars['Decimal']['output']>;
  costPerShare?: Maybe<Scalars['Decimal']['output']>;
  costTotal?: Maybe<Scalars['Decimal']['output']>;
  createdAt: Scalars['DateTime']['output'];
  dateAcquired?: Maybe<Scalars['DateTime']['output']>;
  dateExpiration?: Maybe<Scalars['DateTime']['output']>;
  /** The unique id in the external system for the position */
  externalId?: Maybe<Scalars['String']['output']>;
  feesDay?: Maybe<Scalars['Decimal']['output']>;
  feesOther?: Maybe<Scalars['Decimal']['output']>;
  gainDay?: Maybe<Scalars['Decimal']['output']>;
  gainTotal?: Maybe<Scalars['Decimal']['output']>;
  gainTotalPCT?: Maybe<Scalars['Decimal']['output']>;
  id: Scalars['ID']['output'];
  lots?: Maybe<Array<Lot>>;
  marketValue?: Maybe<Scalars['Decimal']['output']>;
  portfolio: Portfolio;
  portfolioId: Scalars['String']['output'];
  pricePaid?: Maybe<Scalars['Decimal']['output']>;
  quantity: Scalars['Decimal']['output'];
  quoteStatus?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};

export type PositionAccountIdExternalIdCompoundUniqueInput = {
  accountId: Scalars['String']['input'];
  externalId: Scalars['String']['input'];
};

export type PositionAvgAggregate = {
  __typename?: 'PositionAvgAggregate';
  change?: Maybe<Scalars['Decimal']['output']>;
  changePCT?: Maybe<Scalars['Decimal']['output']>;
  commissionDay?: Maybe<Scalars['Decimal']['output']>;
  commissionTotal?: Maybe<Scalars['Decimal']['output']>;
  costPerShare?: Maybe<Scalars['Decimal']['output']>;
  costTotal?: Maybe<Scalars['Decimal']['output']>;
  feesDay?: Maybe<Scalars['Decimal']['output']>;
  feesOther?: Maybe<Scalars['Decimal']['output']>;
  gainDay?: Maybe<Scalars['Decimal']['output']>;
  gainTotal?: Maybe<Scalars['Decimal']['output']>;
  gainTotalPCT?: Maybe<Scalars['Decimal']['output']>;
  marketValue?: Maybe<Scalars['Decimal']['output']>;
  pricePaid?: Maybe<Scalars['Decimal']['output']>;
  quantity?: Maybe<Scalars['Decimal']['output']>;
};

export type PositionCount = {
  __typename?: 'PositionCount';
  lots: Scalars['Int']['output'];
};

export type PositionCountAggregate = {
  __typename?: 'PositionCountAggregate';
  _all: Scalars['Int']['output'];
  accountId: Scalars['Int']['output'];
  assetSymbol: Scalars['Int']['output'];
  change: Scalars['Int']['output'];
  changePCT: Scalars['Int']['output'];
  commissionDay: Scalars['Int']['output'];
  commissionTotal: Scalars['Int']['output'];
  costPerShare: Scalars['Int']['output'];
  costTotal: Scalars['Int']['output'];
  createdAt: Scalars['Int']['output'];
  dateAcquired: Scalars['Int']['output'];
  dateExpiration: Scalars['Int']['output'];
  externalId: Scalars['Int']['output'];
  feesDay: Scalars['Int']['output'];
  feesOther: Scalars['Int']['output'];
  gainDay: Scalars['Int']['output'];
  gainTotal: Scalars['Int']['output'];
  gainTotalPCT: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  marketValue: Scalars['Int']['output'];
  portfolioId: Scalars['Int']['output'];
  pricePaid: Scalars['Int']['output'];
  quantity: Scalars['Int']['output'];
  quoteStatus: Scalars['Int']['output'];
  type: Scalars['Int']['output'];
  updatedAt: Scalars['Int']['output'];
};

export type PositionCreateManyAccountInput = {
  assetSymbol: Scalars['String']['input'];
  change?: InputMaybe<Scalars['Decimal']['input']>;
  changePCT?: InputMaybe<Scalars['Decimal']['input']>;
  commissionDay?: InputMaybe<Scalars['Decimal']['input']>;
  commissionTotal?: InputMaybe<Scalars['Decimal']['input']>;
  costPerShare?: InputMaybe<Scalars['Decimal']['input']>;
  costTotal?: InputMaybe<Scalars['Decimal']['input']>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  dateAcquired?: InputMaybe<Scalars['DateTime']['input']>;
  dateExpiration?: InputMaybe<Scalars['DateTime']['input']>;
  externalId?: InputMaybe<Scalars['String']['input']>;
  feesDay?: InputMaybe<Scalars['Decimal']['input']>;
  feesOther?: InputMaybe<Scalars['Decimal']['input']>;
  gainDay?: InputMaybe<Scalars['Decimal']['input']>;
  gainTotal?: InputMaybe<Scalars['Decimal']['input']>;
  gainTotalPCT?: InputMaybe<Scalars['Decimal']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  marketValue?: InputMaybe<Scalars['Decimal']['input']>;
  portfolioId: Scalars['String']['input'];
  pricePaid?: InputMaybe<Scalars['Decimal']['input']>;
  quantity: Scalars['Decimal']['input'];
  quoteStatus?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type PositionCreateManyAccountInputEnvelope = {
  data: Array<PositionCreateManyAccountInput>;
  skipDuplicates?: InputMaybe<Scalars['Boolean']['input']>;
};

export type PositionCreateManyAssetInput = {
  accountId: Scalars['String']['input'];
  change?: InputMaybe<Scalars['Decimal']['input']>;
  changePCT?: InputMaybe<Scalars['Decimal']['input']>;
  commissionDay?: InputMaybe<Scalars['Decimal']['input']>;
  commissionTotal?: InputMaybe<Scalars['Decimal']['input']>;
  costPerShare?: InputMaybe<Scalars['Decimal']['input']>;
  costTotal?: InputMaybe<Scalars['Decimal']['input']>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  dateAcquired?: InputMaybe<Scalars['DateTime']['input']>;
  dateExpiration?: InputMaybe<Scalars['DateTime']['input']>;
  externalId?: InputMaybe<Scalars['String']['input']>;
  feesDay?: InputMaybe<Scalars['Decimal']['input']>;
  feesOther?: InputMaybe<Scalars['Decimal']['input']>;
  gainDay?: InputMaybe<Scalars['Decimal']['input']>;
  gainTotal?: InputMaybe<Scalars['Decimal']['input']>;
  gainTotalPCT?: InputMaybe<Scalars['Decimal']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  marketValue?: InputMaybe<Scalars['Decimal']['input']>;
  portfolioId: Scalars['String']['input'];
  pricePaid?: InputMaybe<Scalars['Decimal']['input']>;
  quantity: Scalars['Decimal']['input'];
  quoteStatus?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type PositionCreateManyAssetInputEnvelope = {
  data: Array<PositionCreateManyAssetInput>;
  skipDuplicates?: InputMaybe<Scalars['Boolean']['input']>;
};

export type PositionCreateManyPortfolioInput = {
  accountId: Scalars['String']['input'];
  assetSymbol: Scalars['String']['input'];
  change?: InputMaybe<Scalars['Decimal']['input']>;
  changePCT?: InputMaybe<Scalars['Decimal']['input']>;
  commissionDay?: InputMaybe<Scalars['Decimal']['input']>;
  commissionTotal?: InputMaybe<Scalars['Decimal']['input']>;
  costPerShare?: InputMaybe<Scalars['Decimal']['input']>;
  costTotal?: InputMaybe<Scalars['Decimal']['input']>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  dateAcquired?: InputMaybe<Scalars['DateTime']['input']>;
  dateExpiration?: InputMaybe<Scalars['DateTime']['input']>;
  externalId?: InputMaybe<Scalars['String']['input']>;
  feesDay?: InputMaybe<Scalars['Decimal']['input']>;
  feesOther?: InputMaybe<Scalars['Decimal']['input']>;
  gainDay?: InputMaybe<Scalars['Decimal']['input']>;
  gainTotal?: InputMaybe<Scalars['Decimal']['input']>;
  gainTotalPCT?: InputMaybe<Scalars['Decimal']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  marketValue?: InputMaybe<Scalars['Decimal']['input']>;
  pricePaid?: InputMaybe<Scalars['Decimal']['input']>;
  quantity: Scalars['Decimal']['input'];
  quoteStatus?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type PositionCreateManyPortfolioInputEnvelope = {
  data: Array<PositionCreateManyPortfolioInput>;
  skipDuplicates?: InputMaybe<Scalars['Boolean']['input']>;
};

export type PositionCreateNestedManyWithoutAccountInput = {
  connect?: InputMaybe<Array<PositionWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<PositionCreateOrConnectWithoutAccountInput>>;
  create?: InputMaybe<Array<PositionCreateWithoutAccountInput>>;
  createMany?: InputMaybe<PositionCreateManyAccountInputEnvelope>;
};

export type PositionCreateNestedManyWithoutAssetInput = {
  connect?: InputMaybe<Array<PositionWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<PositionCreateOrConnectWithoutAssetInput>>;
  create?: InputMaybe<Array<PositionCreateWithoutAssetInput>>;
  createMany?: InputMaybe<PositionCreateManyAssetInputEnvelope>;
};

export type PositionCreateNestedManyWithoutPortfolioInput = {
  connect?: InputMaybe<Array<PositionWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<PositionCreateOrConnectWithoutPortfolioInput>>;
  create?: InputMaybe<Array<PositionCreateWithoutPortfolioInput>>;
  createMany?: InputMaybe<PositionCreateManyPortfolioInputEnvelope>;
};

export type PositionCreateNestedOneWithoutLotsInput = {
  connect?: InputMaybe<PositionWhereUniqueInput>;
  connectOrCreate?: InputMaybe<PositionCreateOrConnectWithoutLotsInput>;
  create?: InputMaybe<PositionCreateWithoutLotsInput>;
};

export type PositionCreateOrConnectWithoutAccountInput = {
  create: PositionCreateWithoutAccountInput;
  where: PositionWhereUniqueInput;
};

export type PositionCreateOrConnectWithoutAssetInput = {
  create: PositionCreateWithoutAssetInput;
  where: PositionWhereUniqueInput;
};

export type PositionCreateOrConnectWithoutLotsInput = {
  create: PositionCreateWithoutLotsInput;
  where: PositionWhereUniqueInput;
};

export type PositionCreateOrConnectWithoutPortfolioInput = {
  create: PositionCreateWithoutPortfolioInput;
  where: PositionWhereUniqueInput;
};

export type PositionCreateWithoutAccountInput = {
  asset: AssetCreateNestedOneWithoutPositionsInput;
  change?: InputMaybe<Scalars['Decimal']['input']>;
  changePCT?: InputMaybe<Scalars['Decimal']['input']>;
  commissionDay?: InputMaybe<Scalars['Decimal']['input']>;
  commissionTotal?: InputMaybe<Scalars['Decimal']['input']>;
  costPerShare?: InputMaybe<Scalars['Decimal']['input']>;
  costTotal?: InputMaybe<Scalars['Decimal']['input']>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  dateAcquired?: InputMaybe<Scalars['DateTime']['input']>;
  dateExpiration?: InputMaybe<Scalars['DateTime']['input']>;
  externalId?: InputMaybe<Scalars['String']['input']>;
  feesDay?: InputMaybe<Scalars['Decimal']['input']>;
  feesOther?: InputMaybe<Scalars['Decimal']['input']>;
  gainDay?: InputMaybe<Scalars['Decimal']['input']>;
  gainTotal?: InputMaybe<Scalars['Decimal']['input']>;
  gainTotalPCT?: InputMaybe<Scalars['Decimal']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  lots?: InputMaybe<LotCreateNestedManyWithoutPositionInput>;
  marketValue?: InputMaybe<Scalars['Decimal']['input']>;
  portfolio: PortfolioCreateNestedOneWithoutPositionsInput;
  pricePaid?: InputMaybe<Scalars['Decimal']['input']>;
  quantity: Scalars['Decimal']['input'];
  quoteStatus?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type PositionCreateWithoutAssetInput = {
  account: AccountCreateNestedOneWithoutPositionsInput;
  change?: InputMaybe<Scalars['Decimal']['input']>;
  changePCT?: InputMaybe<Scalars['Decimal']['input']>;
  commissionDay?: InputMaybe<Scalars['Decimal']['input']>;
  commissionTotal?: InputMaybe<Scalars['Decimal']['input']>;
  costPerShare?: InputMaybe<Scalars['Decimal']['input']>;
  costTotal?: InputMaybe<Scalars['Decimal']['input']>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  dateAcquired?: InputMaybe<Scalars['DateTime']['input']>;
  dateExpiration?: InputMaybe<Scalars['DateTime']['input']>;
  externalId?: InputMaybe<Scalars['String']['input']>;
  feesDay?: InputMaybe<Scalars['Decimal']['input']>;
  feesOther?: InputMaybe<Scalars['Decimal']['input']>;
  gainDay?: InputMaybe<Scalars['Decimal']['input']>;
  gainTotal?: InputMaybe<Scalars['Decimal']['input']>;
  gainTotalPCT?: InputMaybe<Scalars['Decimal']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  lots?: InputMaybe<LotCreateNestedManyWithoutPositionInput>;
  marketValue?: InputMaybe<Scalars['Decimal']['input']>;
  portfolio: PortfolioCreateNestedOneWithoutPositionsInput;
  pricePaid?: InputMaybe<Scalars['Decimal']['input']>;
  quantity: Scalars['Decimal']['input'];
  quoteStatus?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type PositionCreateWithoutLotsInput = {
  account: AccountCreateNestedOneWithoutPositionsInput;
  asset: AssetCreateNestedOneWithoutPositionsInput;
  change?: InputMaybe<Scalars['Decimal']['input']>;
  changePCT?: InputMaybe<Scalars['Decimal']['input']>;
  commissionDay?: InputMaybe<Scalars['Decimal']['input']>;
  commissionTotal?: InputMaybe<Scalars['Decimal']['input']>;
  costPerShare?: InputMaybe<Scalars['Decimal']['input']>;
  costTotal?: InputMaybe<Scalars['Decimal']['input']>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  dateAcquired?: InputMaybe<Scalars['DateTime']['input']>;
  dateExpiration?: InputMaybe<Scalars['DateTime']['input']>;
  externalId?: InputMaybe<Scalars['String']['input']>;
  feesDay?: InputMaybe<Scalars['Decimal']['input']>;
  feesOther?: InputMaybe<Scalars['Decimal']['input']>;
  gainDay?: InputMaybe<Scalars['Decimal']['input']>;
  gainTotal?: InputMaybe<Scalars['Decimal']['input']>;
  gainTotalPCT?: InputMaybe<Scalars['Decimal']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  marketValue?: InputMaybe<Scalars['Decimal']['input']>;
  portfolio: PortfolioCreateNestedOneWithoutPositionsInput;
  pricePaid?: InputMaybe<Scalars['Decimal']['input']>;
  quantity: Scalars['Decimal']['input'];
  quoteStatus?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type PositionCreateWithoutPortfolioInput = {
  account: AccountCreateNestedOneWithoutPositionsInput;
  asset: AssetCreateNestedOneWithoutPositionsInput;
  change?: InputMaybe<Scalars['Decimal']['input']>;
  changePCT?: InputMaybe<Scalars['Decimal']['input']>;
  commissionDay?: InputMaybe<Scalars['Decimal']['input']>;
  commissionTotal?: InputMaybe<Scalars['Decimal']['input']>;
  costPerShare?: InputMaybe<Scalars['Decimal']['input']>;
  costTotal?: InputMaybe<Scalars['Decimal']['input']>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  dateAcquired?: InputMaybe<Scalars['DateTime']['input']>;
  dateExpiration?: InputMaybe<Scalars['DateTime']['input']>;
  externalId?: InputMaybe<Scalars['String']['input']>;
  feesDay?: InputMaybe<Scalars['Decimal']['input']>;
  feesOther?: InputMaybe<Scalars['Decimal']['input']>;
  gainDay?: InputMaybe<Scalars['Decimal']['input']>;
  gainTotal?: InputMaybe<Scalars['Decimal']['input']>;
  gainTotalPCT?: InputMaybe<Scalars['Decimal']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  lots?: InputMaybe<LotCreateNestedManyWithoutPositionInput>;
  marketValue?: InputMaybe<Scalars['Decimal']['input']>;
  pricePaid?: InputMaybe<Scalars['Decimal']['input']>;
  quantity: Scalars['Decimal']['input'];
  quoteStatus?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type PositionListRelationFilter = {
  every?: InputMaybe<PositionWhereInput>;
  none?: InputMaybe<PositionWhereInput>;
  some?: InputMaybe<PositionWhereInput>;
};

export type PositionMaxAggregate = {
  __typename?: 'PositionMaxAggregate';
  accountId?: Maybe<Scalars['String']['output']>;
  assetSymbol?: Maybe<Scalars['String']['output']>;
  change?: Maybe<Scalars['Decimal']['output']>;
  changePCT?: Maybe<Scalars['Decimal']['output']>;
  commissionDay?: Maybe<Scalars['Decimal']['output']>;
  commissionTotal?: Maybe<Scalars['Decimal']['output']>;
  costPerShare?: Maybe<Scalars['Decimal']['output']>;
  costTotal?: Maybe<Scalars['Decimal']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  dateAcquired?: Maybe<Scalars['DateTime']['output']>;
  dateExpiration?: Maybe<Scalars['DateTime']['output']>;
  externalId?: Maybe<Scalars['String']['output']>;
  feesDay?: Maybe<Scalars['Decimal']['output']>;
  feesOther?: Maybe<Scalars['Decimal']['output']>;
  gainDay?: Maybe<Scalars['Decimal']['output']>;
  gainTotal?: Maybe<Scalars['Decimal']['output']>;
  gainTotalPCT?: Maybe<Scalars['Decimal']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  marketValue?: Maybe<Scalars['Decimal']['output']>;
  portfolioId?: Maybe<Scalars['String']['output']>;
  pricePaid?: Maybe<Scalars['Decimal']['output']>;
  quantity?: Maybe<Scalars['Decimal']['output']>;
  quoteStatus?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type PositionMinAggregate = {
  __typename?: 'PositionMinAggregate';
  accountId?: Maybe<Scalars['String']['output']>;
  assetSymbol?: Maybe<Scalars['String']['output']>;
  change?: Maybe<Scalars['Decimal']['output']>;
  changePCT?: Maybe<Scalars['Decimal']['output']>;
  commissionDay?: Maybe<Scalars['Decimal']['output']>;
  commissionTotal?: Maybe<Scalars['Decimal']['output']>;
  costPerShare?: Maybe<Scalars['Decimal']['output']>;
  costTotal?: Maybe<Scalars['Decimal']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  dateAcquired?: Maybe<Scalars['DateTime']['output']>;
  dateExpiration?: Maybe<Scalars['DateTime']['output']>;
  externalId?: Maybe<Scalars['String']['output']>;
  feesDay?: Maybe<Scalars['Decimal']['output']>;
  feesOther?: Maybe<Scalars['Decimal']['output']>;
  gainDay?: Maybe<Scalars['Decimal']['output']>;
  gainTotal?: Maybe<Scalars['Decimal']['output']>;
  gainTotalPCT?: Maybe<Scalars['Decimal']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  marketValue?: Maybe<Scalars['Decimal']['output']>;
  portfolioId?: Maybe<Scalars['String']['output']>;
  pricePaid?: Maybe<Scalars['Decimal']['output']>;
  quantity?: Maybe<Scalars['Decimal']['output']>;
  quoteStatus?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type PositionNullableScalarRelationFilter = {
  is?: InputMaybe<PositionWhereInput>;
  isNot?: InputMaybe<PositionWhereInput>;
};

export type PositionScalarWhereInput = {
  AND?: InputMaybe<Array<PositionScalarWhereInput>>;
  NOT?: InputMaybe<Array<PositionScalarWhereInput>>;
  OR?: InputMaybe<Array<PositionScalarWhereInput>>;
  accountId?: InputMaybe<UuidFilter>;
  assetSymbol?: InputMaybe<StringFilter>;
  change?: InputMaybe<DecimalNullableFilter>;
  changePCT?: InputMaybe<DecimalNullableFilter>;
  commissionDay?: InputMaybe<DecimalNullableFilter>;
  commissionTotal?: InputMaybe<DecimalNullableFilter>;
  costPerShare?: InputMaybe<DecimalNullableFilter>;
  costTotal?: InputMaybe<DecimalNullableFilter>;
  createdAt?: InputMaybe<DateTimeFilter>;
  dateAcquired?: InputMaybe<DateTimeNullableFilter>;
  dateExpiration?: InputMaybe<DateTimeNullableFilter>;
  externalId?: InputMaybe<StringNullableFilter>;
  feesDay?: InputMaybe<DecimalNullableFilter>;
  feesOther?: InputMaybe<DecimalNullableFilter>;
  gainDay?: InputMaybe<DecimalNullableFilter>;
  gainTotal?: InputMaybe<DecimalNullableFilter>;
  gainTotalPCT?: InputMaybe<DecimalNullableFilter>;
  id?: InputMaybe<UuidFilter>;
  marketValue?: InputMaybe<DecimalNullableFilter>;
  portfolioId?: InputMaybe<UuidFilter>;
  pricePaid?: InputMaybe<DecimalNullableFilter>;
  quantity?: InputMaybe<DecimalFilter>;
  quoteStatus?: InputMaybe<StringNullableFilter>;
  type?: InputMaybe<StringNullableFilter>;
  updatedAt?: InputMaybe<DateTimeFilter>;
};

export type PositionSumAggregate = {
  __typename?: 'PositionSumAggregate';
  change?: Maybe<Scalars['Decimal']['output']>;
  changePCT?: Maybe<Scalars['Decimal']['output']>;
  commissionDay?: Maybe<Scalars['Decimal']['output']>;
  commissionTotal?: Maybe<Scalars['Decimal']['output']>;
  costPerShare?: Maybe<Scalars['Decimal']['output']>;
  costTotal?: Maybe<Scalars['Decimal']['output']>;
  feesDay?: Maybe<Scalars['Decimal']['output']>;
  feesOther?: Maybe<Scalars['Decimal']['output']>;
  gainDay?: Maybe<Scalars['Decimal']['output']>;
  gainTotal?: Maybe<Scalars['Decimal']['output']>;
  gainTotalPCT?: Maybe<Scalars['Decimal']['output']>;
  marketValue?: Maybe<Scalars['Decimal']['output']>;
  pricePaid?: Maybe<Scalars['Decimal']['output']>;
  quantity?: Maybe<Scalars['Decimal']['output']>;
};

export type PositionUpdateManyMutationInput = {
  change?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  changePCT?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  commissionDay?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  commissionTotal?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  costPerShare?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  costTotal?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  dateAcquired?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  dateExpiration?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  externalId?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  feesDay?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  feesOther?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  gainDay?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  gainTotal?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  gainTotalPCT?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  marketValue?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  pricePaid?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  quantity?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  quoteStatus?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  type?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
};

export type PositionUpdateManyWithWhereWithoutAccountInput = {
  data: PositionUpdateManyMutationInput;
  where: PositionScalarWhereInput;
};

export type PositionUpdateManyWithWhereWithoutAssetInput = {
  data: PositionUpdateManyMutationInput;
  where: PositionScalarWhereInput;
};

export type PositionUpdateManyWithWhereWithoutPortfolioInput = {
  data: PositionUpdateManyMutationInput;
  where: PositionScalarWhereInput;
};

export type PositionUpdateManyWithoutAccountNestedInput = {
  connect?: InputMaybe<Array<PositionWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<PositionCreateOrConnectWithoutAccountInput>>;
  create?: InputMaybe<Array<PositionCreateWithoutAccountInput>>;
  createMany?: InputMaybe<PositionCreateManyAccountInputEnvelope>;
  delete?: InputMaybe<Array<PositionWhereUniqueInput>>;
  deleteMany?: InputMaybe<Array<PositionScalarWhereInput>>;
  disconnect?: InputMaybe<Array<PositionWhereUniqueInput>>;
  set?: InputMaybe<Array<PositionWhereUniqueInput>>;
  update?: InputMaybe<Array<PositionUpdateWithWhereUniqueWithoutAccountInput>>;
  updateMany?: InputMaybe<Array<PositionUpdateManyWithWhereWithoutAccountInput>>;
  upsert?: InputMaybe<Array<PositionUpsertWithWhereUniqueWithoutAccountInput>>;
};

export type PositionUpdateManyWithoutAssetNestedInput = {
  connect?: InputMaybe<Array<PositionWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<PositionCreateOrConnectWithoutAssetInput>>;
  create?: InputMaybe<Array<PositionCreateWithoutAssetInput>>;
  createMany?: InputMaybe<PositionCreateManyAssetInputEnvelope>;
  delete?: InputMaybe<Array<PositionWhereUniqueInput>>;
  deleteMany?: InputMaybe<Array<PositionScalarWhereInput>>;
  disconnect?: InputMaybe<Array<PositionWhereUniqueInput>>;
  set?: InputMaybe<Array<PositionWhereUniqueInput>>;
  update?: InputMaybe<Array<PositionUpdateWithWhereUniqueWithoutAssetInput>>;
  updateMany?: InputMaybe<Array<PositionUpdateManyWithWhereWithoutAssetInput>>;
  upsert?: InputMaybe<Array<PositionUpsertWithWhereUniqueWithoutAssetInput>>;
};

export type PositionUpdateManyWithoutPortfolioNestedInput = {
  connect?: InputMaybe<Array<PositionWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<PositionCreateOrConnectWithoutPortfolioInput>>;
  create?: InputMaybe<Array<PositionCreateWithoutPortfolioInput>>;
  createMany?: InputMaybe<PositionCreateManyPortfolioInputEnvelope>;
  delete?: InputMaybe<Array<PositionWhereUniqueInput>>;
  deleteMany?: InputMaybe<Array<PositionScalarWhereInput>>;
  disconnect?: InputMaybe<Array<PositionWhereUniqueInput>>;
  set?: InputMaybe<Array<PositionWhereUniqueInput>>;
  update?: InputMaybe<Array<PositionUpdateWithWhereUniqueWithoutPortfolioInput>>;
  updateMany?: InputMaybe<Array<PositionUpdateManyWithWhereWithoutPortfolioInput>>;
  upsert?: InputMaybe<Array<PositionUpsertWithWhereUniqueWithoutPortfolioInput>>;
};

export type PositionUpdateOneWithoutLotsNestedInput = {
  connect?: InputMaybe<PositionWhereUniqueInput>;
  connectOrCreate?: InputMaybe<PositionCreateOrConnectWithoutLotsInput>;
  create?: InputMaybe<PositionCreateWithoutLotsInput>;
  delete?: InputMaybe<PositionWhereInput>;
  disconnect?: InputMaybe<PositionWhereInput>;
  update?: InputMaybe<PositionUpdateToOneWithWhereWithoutLotsInput>;
  upsert?: InputMaybe<PositionUpsertWithoutLotsInput>;
};

export type PositionUpdateToOneWithWhereWithoutLotsInput = {
  data: PositionUpdateWithoutLotsInput;
  where?: InputMaybe<PositionWhereInput>;
};

export type PositionUpdateWithWhereUniqueWithoutAccountInput = {
  data: PositionUpdateWithoutAccountInput;
  where: PositionWhereUniqueInput;
};

export type PositionUpdateWithWhereUniqueWithoutAssetInput = {
  data: PositionUpdateWithoutAssetInput;
  where: PositionWhereUniqueInput;
};

export type PositionUpdateWithWhereUniqueWithoutPortfolioInput = {
  data: PositionUpdateWithoutPortfolioInput;
  where: PositionWhereUniqueInput;
};

export type PositionUpdateWithoutAccountInput = {
  asset?: InputMaybe<AssetUpdateOneRequiredWithoutPositionsNestedInput>;
  change?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  changePCT?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  commissionDay?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  commissionTotal?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  costPerShare?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  costTotal?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  dateAcquired?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  dateExpiration?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  externalId?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  feesDay?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  feesOther?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  gainDay?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  gainTotal?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  gainTotalPCT?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  lots?: InputMaybe<LotUpdateManyWithoutPositionNestedInput>;
  marketValue?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  portfolio?: InputMaybe<PortfolioUpdateOneRequiredWithoutPositionsNestedInput>;
  pricePaid?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  quantity?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  quoteStatus?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  type?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
};

export type PositionUpdateWithoutAssetInput = {
  account?: InputMaybe<AccountUpdateOneRequiredWithoutPositionsNestedInput>;
  change?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  changePCT?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  commissionDay?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  commissionTotal?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  costPerShare?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  costTotal?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  dateAcquired?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  dateExpiration?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  externalId?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  feesDay?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  feesOther?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  gainDay?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  gainTotal?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  gainTotalPCT?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  lots?: InputMaybe<LotUpdateManyWithoutPositionNestedInput>;
  marketValue?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  portfolio?: InputMaybe<PortfolioUpdateOneRequiredWithoutPositionsNestedInput>;
  pricePaid?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  quantity?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  quoteStatus?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  type?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
};

export type PositionUpdateWithoutLotsInput = {
  account?: InputMaybe<AccountUpdateOneRequiredWithoutPositionsNestedInput>;
  asset?: InputMaybe<AssetUpdateOneRequiredWithoutPositionsNestedInput>;
  change?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  changePCT?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  commissionDay?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  commissionTotal?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  costPerShare?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  costTotal?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  dateAcquired?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  dateExpiration?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  externalId?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  feesDay?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  feesOther?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  gainDay?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  gainTotal?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  gainTotalPCT?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  marketValue?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  portfolio?: InputMaybe<PortfolioUpdateOneRequiredWithoutPositionsNestedInput>;
  pricePaid?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  quantity?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  quoteStatus?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  type?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
};

export type PositionUpdateWithoutPortfolioInput = {
  account?: InputMaybe<AccountUpdateOneRequiredWithoutPositionsNestedInput>;
  asset?: InputMaybe<AssetUpdateOneRequiredWithoutPositionsNestedInput>;
  change?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  changePCT?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  commissionDay?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  commissionTotal?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  costPerShare?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  costTotal?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  dateAcquired?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  dateExpiration?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  externalId?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  feesDay?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  feesOther?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  gainDay?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  gainTotal?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  gainTotalPCT?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  lots?: InputMaybe<LotUpdateManyWithoutPositionNestedInput>;
  marketValue?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  pricePaid?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  quantity?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  quoteStatus?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  type?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
};

export type PositionUpsertWithWhereUniqueWithoutAccountInput = {
  create: PositionCreateWithoutAccountInput;
  update: PositionUpdateWithoutAccountInput;
  where: PositionWhereUniqueInput;
};

export type PositionUpsertWithWhereUniqueWithoutAssetInput = {
  create: PositionCreateWithoutAssetInput;
  update: PositionUpdateWithoutAssetInput;
  where: PositionWhereUniqueInput;
};

export type PositionUpsertWithWhereUniqueWithoutPortfolioInput = {
  create: PositionCreateWithoutPortfolioInput;
  update: PositionUpdateWithoutPortfolioInput;
  where: PositionWhereUniqueInput;
};

export type PositionUpsertWithoutLotsInput = {
  create: PositionCreateWithoutLotsInput;
  update: PositionUpdateWithoutLotsInput;
  where?: InputMaybe<PositionWhereInput>;
};

export type PositionWhereInput = {
  AND?: InputMaybe<Array<PositionWhereInput>>;
  NOT?: InputMaybe<Array<PositionWhereInput>>;
  OR?: InputMaybe<Array<PositionWhereInput>>;
  account?: InputMaybe<AccountScalarRelationFilter>;
  accountId?: InputMaybe<UuidFilter>;
  asset?: InputMaybe<AssetScalarRelationFilter>;
  assetSymbol?: InputMaybe<StringFilter>;
  change?: InputMaybe<DecimalNullableFilter>;
  changePCT?: InputMaybe<DecimalNullableFilter>;
  commissionDay?: InputMaybe<DecimalNullableFilter>;
  commissionTotal?: InputMaybe<DecimalNullableFilter>;
  costPerShare?: InputMaybe<DecimalNullableFilter>;
  costTotal?: InputMaybe<DecimalNullableFilter>;
  createdAt?: InputMaybe<DateTimeFilter>;
  dateAcquired?: InputMaybe<DateTimeNullableFilter>;
  dateExpiration?: InputMaybe<DateTimeNullableFilter>;
  externalId?: InputMaybe<StringNullableFilter>;
  feesDay?: InputMaybe<DecimalNullableFilter>;
  feesOther?: InputMaybe<DecimalNullableFilter>;
  gainDay?: InputMaybe<DecimalNullableFilter>;
  gainTotal?: InputMaybe<DecimalNullableFilter>;
  gainTotalPCT?: InputMaybe<DecimalNullableFilter>;
  id?: InputMaybe<UuidFilter>;
  lots?: InputMaybe<LotListRelationFilter>;
  marketValue?: InputMaybe<DecimalNullableFilter>;
  portfolio?: InputMaybe<PortfolioScalarRelationFilter>;
  portfolioId?: InputMaybe<UuidFilter>;
  pricePaid?: InputMaybe<DecimalNullableFilter>;
  quantity?: InputMaybe<DecimalFilter>;
  quoteStatus?: InputMaybe<StringNullableFilter>;
  type?: InputMaybe<StringNullableFilter>;
  updatedAt?: InputMaybe<DateTimeFilter>;
};

export type PositionWhereUniqueInput = {
  AND?: InputMaybe<Array<PositionWhereInput>>;
  NOT?: InputMaybe<Array<PositionWhereInput>>;
  OR?: InputMaybe<Array<PositionWhereInput>>;
  account?: InputMaybe<AccountScalarRelationFilter>;
  accountId?: InputMaybe<UuidFilter>;
  accountId_externalId?: InputMaybe<PositionAccountIdExternalIdCompoundUniqueInput>;
  asset?: InputMaybe<AssetScalarRelationFilter>;
  assetSymbol?: InputMaybe<StringFilter>;
  change?: InputMaybe<DecimalNullableFilter>;
  changePCT?: InputMaybe<DecimalNullableFilter>;
  commissionDay?: InputMaybe<DecimalNullableFilter>;
  commissionTotal?: InputMaybe<DecimalNullableFilter>;
  costPerShare?: InputMaybe<DecimalNullableFilter>;
  costTotal?: InputMaybe<DecimalNullableFilter>;
  createdAt?: InputMaybe<DateTimeFilter>;
  dateAcquired?: InputMaybe<DateTimeNullableFilter>;
  dateExpiration?: InputMaybe<DateTimeNullableFilter>;
  externalId?: InputMaybe<StringNullableFilter>;
  feesDay?: InputMaybe<DecimalNullableFilter>;
  feesOther?: InputMaybe<DecimalNullableFilter>;
  gainDay?: InputMaybe<DecimalNullableFilter>;
  gainTotal?: InputMaybe<DecimalNullableFilter>;
  gainTotalPCT?: InputMaybe<DecimalNullableFilter>;
  id?: InputMaybe<Scalars['String']['input']>;
  lots?: InputMaybe<LotListRelationFilter>;
  marketValue?: InputMaybe<DecimalNullableFilter>;
  portfolio?: InputMaybe<PortfolioScalarRelationFilter>;
  portfolioId?: InputMaybe<UuidFilter>;
  pricePaid?: InputMaybe<DecimalNullableFilter>;
  quantity?: InputMaybe<DecimalFilter>;
  quoteStatus?: InputMaybe<StringNullableFilter>;
  type?: InputMaybe<StringNullableFilter>;
  updatedAt?: InputMaybe<DateTimeFilter>;
};

export type PriceHourly = {
  __typename?: 'PriceHourly';
  assetSymbol: Scalars['String']['output'];
  assset: Asset;
  close: Scalars['Int']['output'];
  high: Scalars['Int']['output'];
  low: Scalars['Int']['output'];
  numberOfTransactions?: Maybe<Scalars['Int']['output']>;
  open: Scalars['Int']['output'];
  startDate: Scalars['DateTime']['output'];
  volume: Scalars['Int']['output'];
  volumeWeightAverage: Scalars['Int']['output'];
};

export type PriceHourlyAssetSymbolStartDateCompoundUniqueInput = {
  assetSymbol: Scalars['String']['input'];
  startDate: Scalars['DateTime']['input'];
};

export type PriceHourlyAvgAggregate = {
  __typename?: 'PriceHourlyAvgAggregate';
  close?: Maybe<Scalars['Float']['output']>;
  high?: Maybe<Scalars['Float']['output']>;
  low?: Maybe<Scalars['Float']['output']>;
  numberOfTransactions?: Maybe<Scalars['Float']['output']>;
  open?: Maybe<Scalars['Float']['output']>;
  volume?: Maybe<Scalars['Float']['output']>;
  volumeWeightAverage?: Maybe<Scalars['Float']['output']>;
};

export type PriceHourlyCountAggregate = {
  __typename?: 'PriceHourlyCountAggregate';
  _all: Scalars['Int']['output'];
  assetSymbol: Scalars['Int']['output'];
  close: Scalars['Int']['output'];
  high: Scalars['Int']['output'];
  low: Scalars['Int']['output'];
  numberOfTransactions: Scalars['Int']['output'];
  open: Scalars['Int']['output'];
  startDate: Scalars['Int']['output'];
  volume: Scalars['Int']['output'];
  volumeWeightAverage: Scalars['Int']['output'];
};

export type PriceHourlyCreateManyAsssetInput = {
  close: Scalars['Int']['input'];
  high: Scalars['Int']['input'];
  low: Scalars['Int']['input'];
  numberOfTransactions?: InputMaybe<Scalars['Int']['input']>;
  open: Scalars['Int']['input'];
  startDate: Scalars['DateTime']['input'];
  volume: Scalars['Int']['input'];
  volumeWeightAverage: Scalars['Int']['input'];
};

export type PriceHourlyCreateManyAsssetInputEnvelope = {
  data: Array<PriceHourlyCreateManyAsssetInput>;
  skipDuplicates?: InputMaybe<Scalars['Boolean']['input']>;
};

export type PriceHourlyCreateNestedManyWithoutAsssetInput = {
  connect?: InputMaybe<Array<PriceHourlyWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<PriceHourlyCreateOrConnectWithoutAsssetInput>>;
  create?: InputMaybe<Array<PriceHourlyCreateWithoutAsssetInput>>;
  createMany?: InputMaybe<PriceHourlyCreateManyAsssetInputEnvelope>;
};

export type PriceHourlyCreateOrConnectWithoutAsssetInput = {
  create: PriceHourlyCreateWithoutAsssetInput;
  where: PriceHourlyWhereUniqueInput;
};

export type PriceHourlyCreateWithoutAsssetInput = {
  close: Scalars['Int']['input'];
  high: Scalars['Int']['input'];
  low: Scalars['Int']['input'];
  numberOfTransactions?: InputMaybe<Scalars['Int']['input']>;
  open: Scalars['Int']['input'];
  startDate: Scalars['DateTime']['input'];
  volume: Scalars['Int']['input'];
  volumeWeightAverage: Scalars['Int']['input'];
};

export type PriceHourlyListRelationFilter = {
  every?: InputMaybe<PriceHourlyWhereInput>;
  none?: InputMaybe<PriceHourlyWhereInput>;
  some?: InputMaybe<PriceHourlyWhereInput>;
};

export type PriceHourlyMaxAggregate = {
  __typename?: 'PriceHourlyMaxAggregate';
  assetSymbol?: Maybe<Scalars['String']['output']>;
  close?: Maybe<Scalars['Int']['output']>;
  high?: Maybe<Scalars['Int']['output']>;
  low?: Maybe<Scalars['Int']['output']>;
  numberOfTransactions?: Maybe<Scalars['Int']['output']>;
  open?: Maybe<Scalars['Int']['output']>;
  startDate?: Maybe<Scalars['DateTime']['output']>;
  volume?: Maybe<Scalars['Int']['output']>;
  volumeWeightAverage?: Maybe<Scalars['Int']['output']>;
};

export type PriceHourlyMinAggregate = {
  __typename?: 'PriceHourlyMinAggregate';
  assetSymbol?: Maybe<Scalars['String']['output']>;
  close?: Maybe<Scalars['Int']['output']>;
  high?: Maybe<Scalars['Int']['output']>;
  low?: Maybe<Scalars['Int']['output']>;
  numberOfTransactions?: Maybe<Scalars['Int']['output']>;
  open?: Maybe<Scalars['Int']['output']>;
  startDate?: Maybe<Scalars['DateTime']['output']>;
  volume?: Maybe<Scalars['Int']['output']>;
  volumeWeightAverage?: Maybe<Scalars['Int']['output']>;
};

export type PriceHourlyScalarWhereInput = {
  AND?: InputMaybe<Array<PriceHourlyScalarWhereInput>>;
  NOT?: InputMaybe<Array<PriceHourlyScalarWhereInput>>;
  OR?: InputMaybe<Array<PriceHourlyScalarWhereInput>>;
  assetSymbol?: InputMaybe<StringFilter>;
  close?: InputMaybe<IntFilter>;
  high?: InputMaybe<IntFilter>;
  low?: InputMaybe<IntFilter>;
  numberOfTransactions?: InputMaybe<IntNullableFilter>;
  open?: InputMaybe<IntFilter>;
  startDate?: InputMaybe<DateTimeFilter>;
  volume?: InputMaybe<IntFilter>;
  volumeWeightAverage?: InputMaybe<IntFilter>;
};

export type PriceHourlySumAggregate = {
  __typename?: 'PriceHourlySumAggregate';
  close?: Maybe<Scalars['Int']['output']>;
  high?: Maybe<Scalars['Int']['output']>;
  low?: Maybe<Scalars['Int']['output']>;
  numberOfTransactions?: Maybe<Scalars['Int']['output']>;
  open?: Maybe<Scalars['Int']['output']>;
  volume?: Maybe<Scalars['Int']['output']>;
  volumeWeightAverage?: Maybe<Scalars['Int']['output']>;
};

export type PriceHourlyUpdateManyMutationInput = {
  close?: InputMaybe<IntFieldUpdateOperationsInput>;
  high?: InputMaybe<IntFieldUpdateOperationsInput>;
  low?: InputMaybe<IntFieldUpdateOperationsInput>;
  numberOfTransactions?: InputMaybe<NullableIntFieldUpdateOperationsInput>;
  open?: InputMaybe<IntFieldUpdateOperationsInput>;
  startDate?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  volume?: InputMaybe<IntFieldUpdateOperationsInput>;
  volumeWeightAverage?: InputMaybe<IntFieldUpdateOperationsInput>;
};

export type PriceHourlyUpdateManyWithWhereWithoutAsssetInput = {
  data: PriceHourlyUpdateManyMutationInput;
  where: PriceHourlyScalarWhereInput;
};

export type PriceHourlyUpdateManyWithoutAsssetNestedInput = {
  connect?: InputMaybe<Array<PriceHourlyWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<PriceHourlyCreateOrConnectWithoutAsssetInput>>;
  create?: InputMaybe<Array<PriceHourlyCreateWithoutAsssetInput>>;
  createMany?: InputMaybe<PriceHourlyCreateManyAsssetInputEnvelope>;
  delete?: InputMaybe<Array<PriceHourlyWhereUniqueInput>>;
  deleteMany?: InputMaybe<Array<PriceHourlyScalarWhereInput>>;
  disconnect?: InputMaybe<Array<PriceHourlyWhereUniqueInput>>;
  set?: InputMaybe<Array<PriceHourlyWhereUniqueInput>>;
  update?: InputMaybe<Array<PriceHourlyUpdateWithWhereUniqueWithoutAsssetInput>>;
  updateMany?: InputMaybe<Array<PriceHourlyUpdateManyWithWhereWithoutAsssetInput>>;
  upsert?: InputMaybe<Array<PriceHourlyUpsertWithWhereUniqueWithoutAsssetInput>>;
};

export type PriceHourlyUpdateWithWhereUniqueWithoutAsssetInput = {
  data: PriceHourlyUpdateWithoutAsssetInput;
  where: PriceHourlyWhereUniqueInput;
};

export type PriceHourlyUpdateWithoutAsssetInput = {
  close?: InputMaybe<IntFieldUpdateOperationsInput>;
  high?: InputMaybe<IntFieldUpdateOperationsInput>;
  low?: InputMaybe<IntFieldUpdateOperationsInput>;
  numberOfTransactions?: InputMaybe<NullableIntFieldUpdateOperationsInput>;
  open?: InputMaybe<IntFieldUpdateOperationsInput>;
  startDate?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  volume?: InputMaybe<IntFieldUpdateOperationsInput>;
  volumeWeightAverage?: InputMaybe<IntFieldUpdateOperationsInput>;
};

export type PriceHourlyUpsertWithWhereUniqueWithoutAsssetInput = {
  create: PriceHourlyCreateWithoutAsssetInput;
  update: PriceHourlyUpdateWithoutAsssetInput;
  where: PriceHourlyWhereUniqueInput;
};

/** PriceHourlyVector is a % daily change going back # weeks from the start date for a given asset - up to 1000 days (~ > 3 months) */
export type PriceHourlyVector = {
  __typename?: 'PriceHourlyVector';
  _count: PriceHourlyVectorCount;
  /** Asset this vector is for */
  asset: Asset;
  assetSymbol: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  /** The date that we start the vector from and go backwards in time to reach the total number of days */
  startDate: Scalars['DateTime']['output'];
  updatedAt: Scalars['DateTime']['output'];
  vectorGraphs?: Maybe<Array<VectorGraph>>;
  /** The number of days (including weekends) that we want the vector to span */
  vectorWindow: VectorWindow;
};

export type PriceHourlyVectorAssetSymbolStartDateVectorWindowCompoundUniqueInput = {
  assetSymbol: Scalars['String']['input'];
  startDate: Scalars['DateTime']['input'];
  vectorWindow: VectorWindow;
};

export type PriceHourlyVectorCount = {
  __typename?: 'PriceHourlyVectorCount';
  vectorGraphs: Scalars['Int']['output'];
};

export type PriceHourlyVectorCountAggregate = {
  __typename?: 'PriceHourlyVectorCountAggregate';
  _all: Scalars['Int']['output'];
  assetSymbol: Scalars['Int']['output'];
  createdAt: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  startDate: Scalars['Int']['output'];
  updatedAt: Scalars['Int']['output'];
  vectorWindow: Scalars['Int']['output'];
};

export type PriceHourlyVectorCreateManyAssetInput = {
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  startDate: Scalars['DateTime']['input'];
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
  vectorWindow: VectorWindow;
};

export type PriceHourlyVectorCreateManyAssetInputEnvelope = {
  data: Array<PriceHourlyVectorCreateManyAssetInput>;
  skipDuplicates?: InputMaybe<Scalars['Boolean']['input']>;
};

export type PriceHourlyVectorCreateNestedManyWithoutAssetInput = {
  connect?: InputMaybe<Array<PriceHourlyVectorWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<PriceHourlyVectorCreateOrConnectWithoutAssetInput>>;
  create?: InputMaybe<Array<PriceHourlyVectorCreateWithoutAssetInput>>;
  createMany?: InputMaybe<PriceHourlyVectorCreateManyAssetInputEnvelope>;
};

export type PriceHourlyVectorCreateNestedOneWithoutVectorGraphsInput = {
  connect?: InputMaybe<PriceHourlyVectorWhereUniqueInput>;
  connectOrCreate?: InputMaybe<PriceHourlyVectorCreateOrConnectWithoutVectorGraphsInput>;
  create?: InputMaybe<PriceHourlyVectorCreateWithoutVectorGraphsInput>;
};

export type PriceHourlyVectorCreateOrConnectWithoutAssetInput = {
  create: PriceHourlyVectorCreateWithoutAssetInput;
  where: PriceHourlyVectorWhereUniqueInput;
};

export type PriceHourlyVectorCreateOrConnectWithoutVectorGraphsInput = {
  create: PriceHourlyVectorCreateWithoutVectorGraphsInput;
  where: PriceHourlyVectorWhereUniqueInput;
};

export type PriceHourlyVectorCreateWithoutAssetInput = {
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  startDate: Scalars['DateTime']['input'];
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
  vectorGraphs?: InputMaybe<VectorGraphCreateNestedManyWithoutPriceHourlyVectorInput>;
  vectorWindow: VectorWindow;
};

export type PriceHourlyVectorCreateWithoutVectorGraphsInput = {
  asset: AssetCreateNestedOneWithoutPriceHourlyVectorsInput;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  startDate: Scalars['DateTime']['input'];
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
  vectorWindow: VectorWindow;
};

export type PriceHourlyVectorListRelationFilter = {
  every?: InputMaybe<PriceHourlyVectorWhereInput>;
  none?: InputMaybe<PriceHourlyVectorWhereInput>;
  some?: InputMaybe<PriceHourlyVectorWhereInput>;
};

export type PriceHourlyVectorMaxAggregate = {
  __typename?: 'PriceHourlyVectorMaxAggregate';
  assetSymbol?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  startDate?: Maybe<Scalars['DateTime']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  vectorWindow?: Maybe<VectorWindow>;
};

export type PriceHourlyVectorMinAggregate = {
  __typename?: 'PriceHourlyVectorMinAggregate';
  assetSymbol?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  startDate?: Maybe<Scalars['DateTime']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  vectorWindow?: Maybe<VectorWindow>;
};

export type PriceHourlyVectorScalarRelationFilter = {
  is?: InputMaybe<PriceHourlyVectorWhereInput>;
  isNot?: InputMaybe<PriceHourlyVectorWhereInput>;
};

export type PriceHourlyVectorScalarWhereInput = {
  AND?: InputMaybe<Array<PriceHourlyVectorScalarWhereInput>>;
  NOT?: InputMaybe<Array<PriceHourlyVectorScalarWhereInput>>;
  OR?: InputMaybe<Array<PriceHourlyVectorScalarWhereInput>>;
  assetSymbol?: InputMaybe<StringFilter>;
  createdAt?: InputMaybe<DateTimeFilter>;
  id?: InputMaybe<UuidFilter>;
  startDate?: InputMaybe<DateTimeFilter>;
  updatedAt?: InputMaybe<DateTimeFilter>;
  vectorWindow?: InputMaybe<EnumVectorWindowFilter>;
};

export type PriceHourlyVectorUpdateManyMutationInput = {
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  startDate?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  vectorWindow?: InputMaybe<EnumVectorWindowFieldUpdateOperationsInput>;
};

export type PriceHourlyVectorUpdateManyWithWhereWithoutAssetInput = {
  data: PriceHourlyVectorUpdateManyMutationInput;
  where: PriceHourlyVectorScalarWhereInput;
};

export type PriceHourlyVectorUpdateManyWithoutAssetNestedInput = {
  connect?: InputMaybe<Array<PriceHourlyVectorWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<PriceHourlyVectorCreateOrConnectWithoutAssetInput>>;
  create?: InputMaybe<Array<PriceHourlyVectorCreateWithoutAssetInput>>;
  createMany?: InputMaybe<PriceHourlyVectorCreateManyAssetInputEnvelope>;
  delete?: InputMaybe<Array<PriceHourlyVectorWhereUniqueInput>>;
  deleteMany?: InputMaybe<Array<PriceHourlyVectorScalarWhereInput>>;
  disconnect?: InputMaybe<Array<PriceHourlyVectorWhereUniqueInput>>;
  set?: InputMaybe<Array<PriceHourlyVectorWhereUniqueInput>>;
  update?: InputMaybe<Array<PriceHourlyVectorUpdateWithWhereUniqueWithoutAssetInput>>;
  updateMany?: InputMaybe<Array<PriceHourlyVectorUpdateManyWithWhereWithoutAssetInput>>;
  upsert?: InputMaybe<Array<PriceHourlyVectorUpsertWithWhereUniqueWithoutAssetInput>>;
};

export type PriceHourlyVectorUpdateOneRequiredWithoutVectorGraphsNestedInput = {
  connect?: InputMaybe<PriceHourlyVectorWhereUniqueInput>;
  connectOrCreate?: InputMaybe<PriceHourlyVectorCreateOrConnectWithoutVectorGraphsInput>;
  create?: InputMaybe<PriceHourlyVectorCreateWithoutVectorGraphsInput>;
  update?: InputMaybe<PriceHourlyVectorUpdateToOneWithWhereWithoutVectorGraphsInput>;
  upsert?: InputMaybe<PriceHourlyVectorUpsertWithoutVectorGraphsInput>;
};

export type PriceHourlyVectorUpdateToOneWithWhereWithoutVectorGraphsInput = {
  data: PriceHourlyVectorUpdateWithoutVectorGraphsInput;
  where?: InputMaybe<PriceHourlyVectorWhereInput>;
};

export type PriceHourlyVectorUpdateWithWhereUniqueWithoutAssetInput = {
  data: PriceHourlyVectorUpdateWithoutAssetInput;
  where: PriceHourlyVectorWhereUniqueInput;
};

export type PriceHourlyVectorUpdateWithoutAssetInput = {
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  startDate?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  vectorGraphs?: InputMaybe<VectorGraphUpdateManyWithoutPriceHourlyVectorNestedInput>;
  vectorWindow?: InputMaybe<EnumVectorWindowFieldUpdateOperationsInput>;
};

export type PriceHourlyVectorUpdateWithoutVectorGraphsInput = {
  asset?: InputMaybe<AssetUpdateOneRequiredWithoutPriceHourlyVectorsNestedInput>;
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  startDate?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  vectorWindow?: InputMaybe<EnumVectorWindowFieldUpdateOperationsInput>;
};

export type PriceHourlyVectorUpsertWithWhereUniqueWithoutAssetInput = {
  create: PriceHourlyVectorCreateWithoutAssetInput;
  update: PriceHourlyVectorUpdateWithoutAssetInput;
  where: PriceHourlyVectorWhereUniqueInput;
};

export type PriceHourlyVectorUpsertWithoutVectorGraphsInput = {
  create: PriceHourlyVectorCreateWithoutVectorGraphsInput;
  update: PriceHourlyVectorUpdateWithoutVectorGraphsInput;
  where?: InputMaybe<PriceHourlyVectorWhereInput>;
};

export type PriceHourlyVectorWhereInput = {
  AND?: InputMaybe<Array<PriceHourlyVectorWhereInput>>;
  NOT?: InputMaybe<Array<PriceHourlyVectorWhereInput>>;
  OR?: InputMaybe<Array<PriceHourlyVectorWhereInput>>;
  asset?: InputMaybe<AssetScalarRelationFilter>;
  assetSymbol?: InputMaybe<StringFilter>;
  createdAt?: InputMaybe<DateTimeFilter>;
  id?: InputMaybe<UuidFilter>;
  startDate?: InputMaybe<DateTimeFilter>;
  updatedAt?: InputMaybe<DateTimeFilter>;
  vectorGraphs?: InputMaybe<VectorGraphListRelationFilter>;
  vectorWindow?: InputMaybe<EnumVectorWindowFilter>;
};

export type PriceHourlyVectorWhereUniqueInput = {
  AND?: InputMaybe<Array<PriceHourlyVectorWhereInput>>;
  NOT?: InputMaybe<Array<PriceHourlyVectorWhereInput>>;
  OR?: InputMaybe<Array<PriceHourlyVectorWhereInput>>;
  asset?: InputMaybe<AssetScalarRelationFilter>;
  assetSymbol?: InputMaybe<StringFilter>;
  assetSymbol_startDate_vectorWindow?: InputMaybe<PriceHourlyVectorAssetSymbolStartDateVectorWindowCompoundUniqueInput>;
  createdAt?: InputMaybe<DateTimeFilter>;
  id?: InputMaybe<Scalars['String']['input']>;
  startDate?: InputMaybe<DateTimeFilter>;
  updatedAt?: InputMaybe<DateTimeFilter>;
  vectorGraphs?: InputMaybe<VectorGraphListRelationFilter>;
  vectorWindow?: InputMaybe<EnumVectorWindowFilter>;
};

export type PriceHourlyWhereInput = {
  AND?: InputMaybe<Array<PriceHourlyWhereInput>>;
  NOT?: InputMaybe<Array<PriceHourlyWhereInput>>;
  OR?: InputMaybe<Array<PriceHourlyWhereInput>>;
  assetSymbol?: InputMaybe<StringFilter>;
  assset?: InputMaybe<AssetScalarRelationFilter>;
  close?: InputMaybe<IntFilter>;
  high?: InputMaybe<IntFilter>;
  low?: InputMaybe<IntFilter>;
  numberOfTransactions?: InputMaybe<IntNullableFilter>;
  open?: InputMaybe<IntFilter>;
  startDate?: InputMaybe<DateTimeFilter>;
  volume?: InputMaybe<IntFilter>;
  volumeWeightAverage?: InputMaybe<IntFilter>;
};

export type PriceHourlyWhereUniqueInput = {
  AND?: InputMaybe<Array<PriceHourlyWhereInput>>;
  NOT?: InputMaybe<Array<PriceHourlyWhereInput>>;
  OR?: InputMaybe<Array<PriceHourlyWhereInput>>;
  assetSymbol?: InputMaybe<StringFilter>;
  assetSymbol_startDate?: InputMaybe<PriceHourlyAssetSymbolStartDateCompoundUniqueInput>;
  assset?: InputMaybe<AssetScalarRelationFilter>;
  close?: InputMaybe<IntFilter>;
  high?: InputMaybe<IntFilter>;
  low?: InputMaybe<IntFilter>;
  numberOfTransactions?: InputMaybe<IntNullableFilter>;
  open?: InputMaybe<IntFilter>;
  startDate?: InputMaybe<DateTimeFilter>;
  volume?: InputMaybe<IntFilter>;
  volumeWeightAverage?: InputMaybe<IntFilter>;
};

export type Query = {
  __typename?: 'Query';
  /** Find a connected account by id */
  account: Account;
  /** Get accounts */
  accounts: Array<Account>;
  authConnection: AuthConnectionExt;
  /** Chart data for the past 3 months for a asset */
  chartThreeMonth: Array<PolygonStockData>;
  /** Harvest within the directed params. */
  directedHarvest: HarvestResult;
  /** Find one user by email */
  findOneUserByEmail: User;
  /** New harvest endpoint that returns all orders and summary */
  finiteHarvest: FiniteHarvestResult;
  /** Get file upload url */
  generateSignedUrlsForUpload: SignedUrlsForUploadPayload;
  /** Get file download url */
  genrerateSignedUrlsForDownload: SignedUrlsForDownloadPayload;
  /** Get a user */
  getUserPublic: User;
  /** Get a Harvest */
  harvest: Harvest;
  /** Evaluate harvesting for portfolio, */
  harvestEval: HarvestResult;
  /** Evaluate harvesting for portfolio, */
  harvestEvalResult: HarvestEvalResult;
  /** Get Harvests */
  harvests: Array<Harvest>;
  /** Get plaid link token for user */
  linkToken: Scalars['String']['output'];
  log?: Maybe<Log>;
  logs: Array<Log>;
  logsCount: Scalars['Int']['output'];
  /** Lot current view */
  lotCurrent: Array<LotCurrent>;
  lotTransactionBatch?: Maybe<LotTransactionBatch>;
  lotTransactionBatches: Array<LotTransactionBatch>;
  lots: Array<Lot>;
  /** Get authenticated portfolio */
  portfolioAuthed: Portfolio;
  portfolioPositions: Array<Position>;
  /** Summary summary */
  portfolioSummary: PortfolioSummary;
  /** Get all portfolios for a user */
  portfolios: Array<Portfolio>;
  products: Array<StripeProduct>;
  requestOauthConnection: AuthConnectionExt;
  /** Get accounts that need setup */
  setupAccounts: Array<Account>;
  stripeSession: StripeSession;
  /** Find a connected transaction by id */
  transaction: Transaction;
  /** Get transactions */
  transactions: Array<Transaction>;
  /** Get current user */
  userCurrent: User;
  /** Get all users on a portfolio */
  usersOnPortfolio: Array<User>;
};


export type QueryAccountArgs = {
  id: Scalars['String']['input'];
};


export type QueryAccountsArgs = {
  where?: InputMaybe<AccountWhereInput>;
};


export type QueryAuthConnectionArgs = {
  id: Scalars['String']['input'];
};


export type QueryChartThreeMonthArgs = {
  asset: Scalars['String']['input'];
};


export type QueryDirectedHarvestArgs = {
  lots: Array<DirectedHarvestLot>;
  targetRealized: Scalars['Float']['input'];
  targetUnrealized: Scalars['Float']['input'];
};


export type QueryFindOneUserByEmailArgs = {
  email: Scalars['String']['input'];
};


export type QueryGenerateSignedUrlsForUploadArgs = {
  files: Array<GcpUploadFile>;
};


export type QueryGenrerateSignedUrlsForDownloadArgs = {
  gcpFileNames: Array<Scalars['String']['input']>;
};


export type QueryGetUserPublicArgs = {
  id: Scalars['String']['input'];
};


export type QueryHarvestArgs = {
  id?: InputMaybe<Scalars['String']['input']>;
};


export type QueryHarvestEvalResultArgs = {
  filters?: InputMaybe<HarvestEvalFilters>;
};


export type QueryHarvestsArgs = {
  where?: InputMaybe<HarvestWhereInput>;
};


export type QueryLogArgs = {
  logId: Scalars['Int']['input'];
};


export type QueryLogsArgs = {
  orderBy?: InputMaybe<LogOrderByRelationAggregateInput>;
  pagination?: InputMaybe<PaginationProps>;
};


export type QueryLotCurrentArgs = {
  lotIds?: InputMaybe<Array<Scalars['String']['input']>>;
  lotValueType?: InputMaybe<LotValueType>;
  minTotalPAndL?: InputMaybe<Scalars['Float']['input']>;
};


export type QueryLotTransactionBatchArgs = {
  lotTransactionBatchId: Scalars['String']['input'];
};


export type QueryLotTransactionBatchesArgs = {
  orderBy?: InputMaybe<LotTransactionBatchOrderByRelationAggregateInput>;
};


export type QueryLotsArgs = {
  includeTaxAdvantaged?: InputMaybe<Scalars['Boolean']['input']>;
  where?: InputMaybe<LotWhereInput>;
};


export type QueryProductsArgs = {
  active?: InputMaybe<Scalars['String']['input']>;
};


export type QueryRequestOauthConnectionArgs = {
  authSource: AuthSource;
  portfolioId: Scalars['String']['input'];
};


export type QueryStripeSessionArgs = {
  stripeCustomerId: Scalars['String']['input'];
  stripePriceId: Scalars['String']['input'];
};


export type QueryTransactionArgs = {
  id: Scalars['String']['input'];
};


export type QueryTransactionsArgs = {
  where?: InputMaybe<TransactionWhereInput>;
};

export enum QueryMode {
  Default = 'default',
  Insensitive = 'insensitive'
}

export type RealizedPAndL = {
  __typename?: 'RealizedPAndL';
  account: Account;
  accountId: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  deferredLoss: Scalars['Decimal']['output'];
  dividend: Scalars['Decimal']['output'];
  id: Scalars['ID']['output'];
  longTerm: Scalars['Decimal']['output'];
  portfolio: Portfolio;
  portfolioId: Scalars['String']['output'];
  shortTerm: Scalars['Decimal']['output'];
  updatedAt: Scalars['DateTime']['output'];
  year: Scalars['Int']['output'];
};

export type RealizedPAndLAccountIdYearCompoundUniqueInput = {
  accountId: Scalars['String']['input'];
  year: Scalars['Int']['input'];
};

export type RealizedPAndLAvgAggregate = {
  __typename?: 'RealizedPAndLAvgAggregate';
  deferredLoss?: Maybe<Scalars['Decimal']['output']>;
  dividend?: Maybe<Scalars['Decimal']['output']>;
  longTerm?: Maybe<Scalars['Decimal']['output']>;
  shortTerm?: Maybe<Scalars['Decimal']['output']>;
  year?: Maybe<Scalars['Float']['output']>;
};

export type RealizedPAndLCountAggregate = {
  __typename?: 'RealizedPAndLCountAggregate';
  _all: Scalars['Int']['output'];
  accountId: Scalars['Int']['output'];
  createdAt: Scalars['Int']['output'];
  deferredLoss: Scalars['Int']['output'];
  dividend: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  longTerm: Scalars['Int']['output'];
  portfolioId: Scalars['Int']['output'];
  shortTerm: Scalars['Int']['output'];
  updatedAt: Scalars['Int']['output'];
  year: Scalars['Int']['output'];
};

export type RealizedPAndLCreateManyAccountInput = {
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  deferredLoss?: InputMaybe<Scalars['Decimal']['input']>;
  dividend?: InputMaybe<Scalars['Decimal']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  longTerm?: InputMaybe<Scalars['Decimal']['input']>;
  portfolioId: Scalars['String']['input'];
  shortTerm?: InputMaybe<Scalars['Decimal']['input']>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
  year: Scalars['Int']['input'];
};

export type RealizedPAndLCreateManyAccountInputEnvelope = {
  data: Array<RealizedPAndLCreateManyAccountInput>;
  skipDuplicates?: InputMaybe<Scalars['Boolean']['input']>;
};

export type RealizedPAndLCreateManyPortfolioInput = {
  accountId: Scalars['String']['input'];
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  deferredLoss?: InputMaybe<Scalars['Decimal']['input']>;
  dividend?: InputMaybe<Scalars['Decimal']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  longTerm?: InputMaybe<Scalars['Decimal']['input']>;
  shortTerm?: InputMaybe<Scalars['Decimal']['input']>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
  year: Scalars['Int']['input'];
};

export type RealizedPAndLCreateManyPortfolioInputEnvelope = {
  data: Array<RealizedPAndLCreateManyPortfolioInput>;
  skipDuplicates?: InputMaybe<Scalars['Boolean']['input']>;
};

export type RealizedPAndLCreateNestedManyWithoutAccountInput = {
  connect?: InputMaybe<Array<RealizedPAndLWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<RealizedPAndLCreateOrConnectWithoutAccountInput>>;
  create?: InputMaybe<Array<RealizedPAndLCreateWithoutAccountInput>>;
  createMany?: InputMaybe<RealizedPAndLCreateManyAccountInputEnvelope>;
};

export type RealizedPAndLCreateNestedManyWithoutPortfolioInput = {
  connect?: InputMaybe<Array<RealizedPAndLWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<RealizedPAndLCreateOrConnectWithoutPortfolioInput>>;
  create?: InputMaybe<Array<RealizedPAndLCreateWithoutPortfolioInput>>;
  createMany?: InputMaybe<RealizedPAndLCreateManyPortfolioInputEnvelope>;
};

export type RealizedPAndLCreateOrConnectWithoutAccountInput = {
  create: RealizedPAndLCreateWithoutAccountInput;
  where: RealizedPAndLWhereUniqueInput;
};

export type RealizedPAndLCreateOrConnectWithoutPortfolioInput = {
  create: RealizedPAndLCreateWithoutPortfolioInput;
  where: RealizedPAndLWhereUniqueInput;
};

export type RealizedPAndLCreateWithoutAccountInput = {
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  deferredLoss?: InputMaybe<Scalars['Decimal']['input']>;
  dividend?: InputMaybe<Scalars['Decimal']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  longTerm?: InputMaybe<Scalars['Decimal']['input']>;
  portfolio: PortfolioCreateNestedOneWithoutRealizedPAndLInput;
  shortTerm?: InputMaybe<Scalars['Decimal']['input']>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
  year: Scalars['Int']['input'];
};

export type RealizedPAndLCreateWithoutPortfolioInput = {
  account: AccountCreateNestedOneWithoutRealizedPAndLInput;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  deferredLoss?: InputMaybe<Scalars['Decimal']['input']>;
  dividend?: InputMaybe<Scalars['Decimal']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  longTerm?: InputMaybe<Scalars['Decimal']['input']>;
  shortTerm?: InputMaybe<Scalars['Decimal']['input']>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
  year: Scalars['Int']['input'];
};

export type RealizedPAndLListRelationFilter = {
  every?: InputMaybe<RealizedPAndLWhereInput>;
  none?: InputMaybe<RealizedPAndLWhereInput>;
  some?: InputMaybe<RealizedPAndLWhereInput>;
};

export type RealizedPAndLMaxAggregate = {
  __typename?: 'RealizedPAndLMaxAggregate';
  accountId?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  deferredLoss?: Maybe<Scalars['Decimal']['output']>;
  dividend?: Maybe<Scalars['Decimal']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  longTerm?: Maybe<Scalars['Decimal']['output']>;
  portfolioId?: Maybe<Scalars['String']['output']>;
  shortTerm?: Maybe<Scalars['Decimal']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  year?: Maybe<Scalars['Int']['output']>;
};

export type RealizedPAndLMinAggregate = {
  __typename?: 'RealizedPAndLMinAggregate';
  accountId?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  deferredLoss?: Maybe<Scalars['Decimal']['output']>;
  dividend?: Maybe<Scalars['Decimal']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  longTerm?: Maybe<Scalars['Decimal']['output']>;
  portfolioId?: Maybe<Scalars['String']['output']>;
  shortTerm?: Maybe<Scalars['Decimal']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  year?: Maybe<Scalars['Int']['output']>;
};

export type RealizedPAndLScalarWhereInput = {
  AND?: InputMaybe<Array<RealizedPAndLScalarWhereInput>>;
  NOT?: InputMaybe<Array<RealizedPAndLScalarWhereInput>>;
  OR?: InputMaybe<Array<RealizedPAndLScalarWhereInput>>;
  accountId?: InputMaybe<UuidFilter>;
  createdAt?: InputMaybe<DateTimeFilter>;
  deferredLoss?: InputMaybe<DecimalFilter>;
  dividend?: InputMaybe<DecimalFilter>;
  id?: InputMaybe<UuidFilter>;
  longTerm?: InputMaybe<DecimalFilter>;
  portfolioId?: InputMaybe<UuidFilter>;
  shortTerm?: InputMaybe<DecimalFilter>;
  updatedAt?: InputMaybe<DateTimeFilter>;
  year?: InputMaybe<IntFilter>;
};

export type RealizedPAndLSumAggregate = {
  __typename?: 'RealizedPAndLSumAggregate';
  deferredLoss?: Maybe<Scalars['Decimal']['output']>;
  dividend?: Maybe<Scalars['Decimal']['output']>;
  longTerm?: Maybe<Scalars['Decimal']['output']>;
  shortTerm?: Maybe<Scalars['Decimal']['output']>;
  year?: Maybe<Scalars['Int']['output']>;
};

export type RealizedPAndLUpdateInput = {
  account?: InputMaybe<AccountUpdateOneRequiredWithoutRealizedPAndLNestedInput>;
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  deferredLoss?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  dividend?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  longTerm?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  portfolio?: InputMaybe<PortfolioUpdateOneRequiredWithoutRealizedPAndLNestedInput>;
  shortTerm?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  year?: InputMaybe<IntFieldUpdateOperationsInput>;
};

export type RealizedPAndLUpdateManyMutationInput = {
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  deferredLoss?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  dividend?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  longTerm?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  shortTerm?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  year?: InputMaybe<IntFieldUpdateOperationsInput>;
};

export type RealizedPAndLUpdateManyWithWhereWithoutAccountInput = {
  data: RealizedPAndLUpdateManyMutationInput;
  where: RealizedPAndLScalarWhereInput;
};

export type RealizedPAndLUpdateManyWithWhereWithoutPortfolioInput = {
  data: RealizedPAndLUpdateManyMutationInput;
  where: RealizedPAndLScalarWhereInput;
};

export type RealizedPAndLUpdateManyWithoutAccountNestedInput = {
  connect?: InputMaybe<Array<RealizedPAndLWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<RealizedPAndLCreateOrConnectWithoutAccountInput>>;
  create?: InputMaybe<Array<RealizedPAndLCreateWithoutAccountInput>>;
  createMany?: InputMaybe<RealizedPAndLCreateManyAccountInputEnvelope>;
  delete?: InputMaybe<Array<RealizedPAndLWhereUniqueInput>>;
  deleteMany?: InputMaybe<Array<RealizedPAndLScalarWhereInput>>;
  disconnect?: InputMaybe<Array<RealizedPAndLWhereUniqueInput>>;
  set?: InputMaybe<Array<RealizedPAndLWhereUniqueInput>>;
  update?: InputMaybe<Array<RealizedPAndLUpdateWithWhereUniqueWithoutAccountInput>>;
  updateMany?: InputMaybe<Array<RealizedPAndLUpdateManyWithWhereWithoutAccountInput>>;
  upsert?: InputMaybe<Array<RealizedPAndLUpsertWithWhereUniqueWithoutAccountInput>>;
};

export type RealizedPAndLUpdateManyWithoutPortfolioNestedInput = {
  connect?: InputMaybe<Array<RealizedPAndLWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<RealizedPAndLCreateOrConnectWithoutPortfolioInput>>;
  create?: InputMaybe<Array<RealizedPAndLCreateWithoutPortfolioInput>>;
  createMany?: InputMaybe<RealizedPAndLCreateManyPortfolioInputEnvelope>;
  delete?: InputMaybe<Array<RealizedPAndLWhereUniqueInput>>;
  deleteMany?: InputMaybe<Array<RealizedPAndLScalarWhereInput>>;
  disconnect?: InputMaybe<Array<RealizedPAndLWhereUniqueInput>>;
  set?: InputMaybe<Array<RealizedPAndLWhereUniqueInput>>;
  update?: InputMaybe<Array<RealizedPAndLUpdateWithWhereUniqueWithoutPortfolioInput>>;
  updateMany?: InputMaybe<Array<RealizedPAndLUpdateManyWithWhereWithoutPortfolioInput>>;
  upsert?: InputMaybe<Array<RealizedPAndLUpsertWithWhereUniqueWithoutPortfolioInput>>;
};

export type RealizedPAndLUpdateWithWhereUniqueWithoutAccountInput = {
  data: RealizedPAndLUpdateWithoutAccountInput;
  where: RealizedPAndLWhereUniqueInput;
};

export type RealizedPAndLUpdateWithWhereUniqueWithoutPortfolioInput = {
  data: RealizedPAndLUpdateWithoutPortfolioInput;
  where: RealizedPAndLWhereUniqueInput;
};

export type RealizedPAndLUpdateWithoutAccountInput = {
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  deferredLoss?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  dividend?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  longTerm?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  portfolio?: InputMaybe<PortfolioUpdateOneRequiredWithoutRealizedPAndLNestedInput>;
  shortTerm?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  year?: InputMaybe<IntFieldUpdateOperationsInput>;
};

export type RealizedPAndLUpdateWithoutPortfolioInput = {
  account?: InputMaybe<AccountUpdateOneRequiredWithoutRealizedPAndLNestedInput>;
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  deferredLoss?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  dividend?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  longTerm?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  shortTerm?: InputMaybe<DecimalFieldUpdateOperationsInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  year?: InputMaybe<IntFieldUpdateOperationsInput>;
};

export type RealizedPAndLUpsertWithWhereUniqueWithoutAccountInput = {
  create: RealizedPAndLCreateWithoutAccountInput;
  update: RealizedPAndLUpdateWithoutAccountInput;
  where: RealizedPAndLWhereUniqueInput;
};

export type RealizedPAndLUpsertWithWhereUniqueWithoutPortfolioInput = {
  create: RealizedPAndLCreateWithoutPortfolioInput;
  update: RealizedPAndLUpdateWithoutPortfolioInput;
  where: RealizedPAndLWhereUniqueInput;
};

export type RealizedPAndLWhereInput = {
  AND?: InputMaybe<Array<RealizedPAndLWhereInput>>;
  NOT?: InputMaybe<Array<RealizedPAndLWhereInput>>;
  OR?: InputMaybe<Array<RealizedPAndLWhereInput>>;
  account?: InputMaybe<AccountScalarRelationFilter>;
  accountId?: InputMaybe<UuidFilter>;
  createdAt?: InputMaybe<DateTimeFilter>;
  deferredLoss?: InputMaybe<DecimalFilter>;
  dividend?: InputMaybe<DecimalFilter>;
  id?: InputMaybe<UuidFilter>;
  longTerm?: InputMaybe<DecimalFilter>;
  portfolio?: InputMaybe<PortfolioScalarRelationFilter>;
  portfolioId?: InputMaybe<UuidFilter>;
  shortTerm?: InputMaybe<DecimalFilter>;
  updatedAt?: InputMaybe<DateTimeFilter>;
  year?: InputMaybe<IntFilter>;
};

export type RealizedPAndLWhereUniqueInput = {
  AND?: InputMaybe<Array<RealizedPAndLWhereInput>>;
  NOT?: InputMaybe<Array<RealizedPAndLWhereInput>>;
  OR?: InputMaybe<Array<RealizedPAndLWhereInput>>;
  account?: InputMaybe<AccountScalarRelationFilter>;
  accountId?: InputMaybe<UuidFilter>;
  accountId_year?: InputMaybe<RealizedPAndLAccountIdYearCompoundUniqueInput>;
  createdAt?: InputMaybe<DateTimeFilter>;
  deferredLoss?: InputMaybe<DecimalFilter>;
  dividend?: InputMaybe<DecimalFilter>;
  id?: InputMaybe<Scalars['String']['input']>;
  longTerm?: InputMaybe<DecimalFilter>;
  portfolio?: InputMaybe<PortfolioScalarRelationFilter>;
  portfolioId?: InputMaybe<UuidFilter>;
  shortTerm?: InputMaybe<DecimalFilter>;
  updatedAt?: InputMaybe<DateTimeFilter>;
  year?: InputMaybe<IntFilter>;
};

export enum SetUpStatus {
  AccountSetupRequired = 'ACCOUNT_SETUP_REQUIRED',
  Complete = 'COMPLETE',
  NoAccounts = 'NO_ACCOUNTS'
}

export type SignedUrlsForDownloadPayload = {
  __typename?: 'SignedUrlsForDownloadPayload';
  downloadUrls: Array<Scalars['String']['output']>;
};

export type SignedUrlsForUploadPayload = {
  __typename?: 'SignedUrlsForUploadPayload';
  uploadUrls: Array<Scalars['String']['output']>;
};

export enum SortOrder {
  Asc = 'asc',
  Desc = 'desc'
}

export type StringFieldUpdateOperationsInput = {
  set?: InputMaybe<Scalars['String']['input']>;
};

export type StringFilter = {
  contains?: InputMaybe<Scalars['String']['input']>;
  endsWith?: InputMaybe<Scalars['String']['input']>;
  equals?: InputMaybe<Scalars['String']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<Scalars['String']['input']>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  mode?: InputMaybe<QueryMode>;
  not?: InputMaybe<NestedStringFilter>;
  notIn?: InputMaybe<Array<Scalars['String']['input']>>;
  startsWith?: InputMaybe<Scalars['String']['input']>;
};

export type StringNullableFilter = {
  contains?: InputMaybe<Scalars['String']['input']>;
  endsWith?: InputMaybe<Scalars['String']['input']>;
  equals?: InputMaybe<Scalars['String']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<Scalars['String']['input']>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  mode?: InputMaybe<QueryMode>;
  not?: InputMaybe<NestedStringNullableFilter>;
  notIn?: InputMaybe<Array<Scalars['String']['input']>>;
  startsWith?: InputMaybe<Scalars['String']['input']>;
};

export type StripeMarketingFeature = {
  __typename?: 'StripeMarketingFeature';
  name?: Maybe<Scalars['String']['output']>;
};

export type StripeProduct = {
  __typename?: 'StripeProduct';
  active?: Maybe<Scalars['Boolean']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  marketing_features: Array<StripeMarketingFeature>;
};

export type StripeSession = {
  __typename?: 'StripeSession';
  client_secret?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
};

export enum TaxGain {
  Long = 'LONG',
  Short = 'SHORT'
}

export type Transaction = {
  __typename?: 'Transaction';
  _count: TransactionCount;
  account: Account;
  accountId: Scalars['String']['output'];
  amount?: Maybe<Scalars['Decimal']['output']>;
  appliedToLots: Scalars['Boolean']['output'];
  asset: Asset;
  assetSymbol: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  datailsURI?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  detailsURI?: Maybe<Scalars['String']['output']>;
  displaySymbol?: Maybe<Scalars['String']['output']>;
  /** PLaid investment_transaction_id */
  externalId: Scalars['String']['output'];
  fee?: Maybe<Scalars['Decimal']['output']>;
  /** Internal transaction identifier */
  id: Scalars['ID']['output'];
  lotChangeLog?: Maybe<Array<LotChangeLog>>;
  memo?: Maybe<Scalars['String']['output']>;
  paymentCurrency?: Maybe<Scalars['String']['output']>;
  portfolio: Portfolio;
  portfolioId: Scalars['String']['output'];
  postDate?: Maybe<Scalars['DateTime']['output']>;
  price?: Maybe<Scalars['Decimal']['output']>;
  quantity?: Maybe<Scalars['Decimal']['output']>;
  securityType?: Maybe<Scalars['String']['output']>;
  settlementCurrency?: Maybe<Scalars['String']['output']>;
  settlementDate?: Maybe<Scalars['DateTime']['output']>;
  subtype?: Maybe<Scalars['String']['output']>;
  transactionDate?: Maybe<Scalars['DateTime']['output']>;
  type?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};

export type TransactionAccountIdExternalIdCompoundUniqueInput = {
  accountId: Scalars['String']['input'];
  externalId: Scalars['String']['input'];
};

export type TransactionAvgAggregate = {
  __typename?: 'TransactionAvgAggregate';
  amount?: Maybe<Scalars['Decimal']['output']>;
  fee?: Maybe<Scalars['Decimal']['output']>;
  price?: Maybe<Scalars['Decimal']['output']>;
  quantity?: Maybe<Scalars['Decimal']['output']>;
};

export type TransactionCount = {
  __typename?: 'TransactionCount';
  lotChangeLog: Scalars['Int']['output'];
};

export type TransactionCountAggregate = {
  __typename?: 'TransactionCountAggregate';
  _all: Scalars['Int']['output'];
  accountId: Scalars['Int']['output'];
  amount: Scalars['Int']['output'];
  appliedToLots: Scalars['Int']['output'];
  assetSymbol: Scalars['Int']['output'];
  createdAt: Scalars['Int']['output'];
  datailsURI: Scalars['Int']['output'];
  description: Scalars['Int']['output'];
  detailsURI: Scalars['Int']['output'];
  displaySymbol: Scalars['Int']['output'];
  externalId: Scalars['Int']['output'];
  fee: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  memo: Scalars['Int']['output'];
  paymentCurrency: Scalars['Int']['output'];
  portfolioId: Scalars['Int']['output'];
  postDate: Scalars['Int']['output'];
  price: Scalars['Int']['output'];
  quantity: Scalars['Int']['output'];
  securityType: Scalars['Int']['output'];
  settlementCurrency: Scalars['Int']['output'];
  settlementDate: Scalars['Int']['output'];
  subtype: Scalars['Int']['output'];
  transactionDate: Scalars['Int']['output'];
  type: Scalars['Int']['output'];
  updatedAt: Scalars['Int']['output'];
};

export type TransactionCreateManyAccountInput = {
  amount?: InputMaybe<Scalars['Decimal']['input']>;
  appliedToLots?: InputMaybe<Scalars['Boolean']['input']>;
  assetSymbol: Scalars['String']['input'];
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  datailsURI?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  detailsURI?: InputMaybe<Scalars['String']['input']>;
  displaySymbol?: InputMaybe<Scalars['String']['input']>;
  externalId: Scalars['String']['input'];
  fee?: InputMaybe<Scalars['Decimal']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  memo?: InputMaybe<Scalars['String']['input']>;
  paymentCurrency?: InputMaybe<Scalars['String']['input']>;
  portfolioId: Scalars['String']['input'];
  postDate?: InputMaybe<Scalars['DateTime']['input']>;
  price?: InputMaybe<Scalars['Decimal']['input']>;
  quantity?: InputMaybe<Scalars['Decimal']['input']>;
  securityType?: InputMaybe<Scalars['String']['input']>;
  settlementCurrency?: InputMaybe<Scalars['String']['input']>;
  settlementDate?: InputMaybe<Scalars['DateTime']['input']>;
  subtype?: InputMaybe<Scalars['String']['input']>;
  transactionDate?: InputMaybe<Scalars['DateTime']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type TransactionCreateManyAccountInputEnvelope = {
  data: Array<TransactionCreateManyAccountInput>;
  skipDuplicates?: InputMaybe<Scalars['Boolean']['input']>;
};

export type TransactionCreateManyAssetInput = {
  accountId: Scalars['String']['input'];
  amount?: InputMaybe<Scalars['Decimal']['input']>;
  appliedToLots?: InputMaybe<Scalars['Boolean']['input']>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  datailsURI?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  detailsURI?: InputMaybe<Scalars['String']['input']>;
  displaySymbol?: InputMaybe<Scalars['String']['input']>;
  externalId: Scalars['String']['input'];
  fee?: InputMaybe<Scalars['Decimal']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  memo?: InputMaybe<Scalars['String']['input']>;
  paymentCurrency?: InputMaybe<Scalars['String']['input']>;
  portfolioId: Scalars['String']['input'];
  postDate?: InputMaybe<Scalars['DateTime']['input']>;
  price?: InputMaybe<Scalars['Decimal']['input']>;
  quantity?: InputMaybe<Scalars['Decimal']['input']>;
  securityType?: InputMaybe<Scalars['String']['input']>;
  settlementCurrency?: InputMaybe<Scalars['String']['input']>;
  settlementDate?: InputMaybe<Scalars['DateTime']['input']>;
  subtype?: InputMaybe<Scalars['String']['input']>;
  transactionDate?: InputMaybe<Scalars['DateTime']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type TransactionCreateManyAssetInputEnvelope = {
  data: Array<TransactionCreateManyAssetInput>;
  skipDuplicates?: InputMaybe<Scalars['Boolean']['input']>;
};

export type TransactionCreateManyPortfolioInput = {
  accountId: Scalars['String']['input'];
  amount?: InputMaybe<Scalars['Decimal']['input']>;
  appliedToLots?: InputMaybe<Scalars['Boolean']['input']>;
  assetSymbol: Scalars['String']['input'];
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  datailsURI?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  detailsURI?: InputMaybe<Scalars['String']['input']>;
  displaySymbol?: InputMaybe<Scalars['String']['input']>;
  externalId: Scalars['String']['input'];
  fee?: InputMaybe<Scalars['Decimal']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  memo?: InputMaybe<Scalars['String']['input']>;
  paymentCurrency?: InputMaybe<Scalars['String']['input']>;
  postDate?: InputMaybe<Scalars['DateTime']['input']>;
  price?: InputMaybe<Scalars['Decimal']['input']>;
  quantity?: InputMaybe<Scalars['Decimal']['input']>;
  securityType?: InputMaybe<Scalars['String']['input']>;
  settlementCurrency?: InputMaybe<Scalars['String']['input']>;
  settlementDate?: InputMaybe<Scalars['DateTime']['input']>;
  subtype?: InputMaybe<Scalars['String']['input']>;
  transactionDate?: InputMaybe<Scalars['DateTime']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type TransactionCreateManyPortfolioInputEnvelope = {
  data: Array<TransactionCreateManyPortfolioInput>;
  skipDuplicates?: InputMaybe<Scalars['Boolean']['input']>;
};

export type TransactionCreateNestedManyWithoutAccountInput = {
  connect?: InputMaybe<Array<TransactionWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<TransactionCreateOrConnectWithoutAccountInput>>;
  create?: InputMaybe<Array<TransactionCreateWithoutAccountInput>>;
  createMany?: InputMaybe<TransactionCreateManyAccountInputEnvelope>;
};

export type TransactionCreateNestedManyWithoutAssetInput = {
  connect?: InputMaybe<Array<TransactionWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<TransactionCreateOrConnectWithoutAssetInput>>;
  create?: InputMaybe<Array<TransactionCreateWithoutAssetInput>>;
  createMany?: InputMaybe<TransactionCreateManyAssetInputEnvelope>;
};

export type TransactionCreateNestedManyWithoutPortfolioInput = {
  connect?: InputMaybe<Array<TransactionWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<TransactionCreateOrConnectWithoutPortfolioInput>>;
  create?: InputMaybe<Array<TransactionCreateWithoutPortfolioInput>>;
  createMany?: InputMaybe<TransactionCreateManyPortfolioInputEnvelope>;
};

export type TransactionCreateNestedOneWithoutLotChangeLogInput = {
  connect?: InputMaybe<TransactionWhereUniqueInput>;
  connectOrCreate?: InputMaybe<TransactionCreateOrConnectWithoutLotChangeLogInput>;
  create?: InputMaybe<TransactionCreateWithoutLotChangeLogInput>;
};

export type TransactionCreateOrConnectWithoutAccountInput = {
  create: TransactionCreateWithoutAccountInput;
  where: TransactionWhereUniqueInput;
};

export type TransactionCreateOrConnectWithoutAssetInput = {
  create: TransactionCreateWithoutAssetInput;
  where: TransactionWhereUniqueInput;
};

export type TransactionCreateOrConnectWithoutLotChangeLogInput = {
  create: TransactionCreateWithoutLotChangeLogInput;
  where: TransactionWhereUniqueInput;
};

export type TransactionCreateOrConnectWithoutPortfolioInput = {
  create: TransactionCreateWithoutPortfolioInput;
  where: TransactionWhereUniqueInput;
};

export type TransactionCreateWithoutAccountInput = {
  amount?: InputMaybe<Scalars['Decimal']['input']>;
  appliedToLots?: InputMaybe<Scalars['Boolean']['input']>;
  asset: AssetCreateNestedOneWithoutTransactionsInput;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  datailsURI?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  detailsURI?: InputMaybe<Scalars['String']['input']>;
  displaySymbol?: InputMaybe<Scalars['String']['input']>;
  externalId: Scalars['String']['input'];
  fee?: InputMaybe<Scalars['Decimal']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  lotChangeLog?: InputMaybe<LotChangeLogCreateNestedManyWithoutTransactionInput>;
  memo?: InputMaybe<Scalars['String']['input']>;
  paymentCurrency?: InputMaybe<Scalars['String']['input']>;
  portfolio: PortfolioCreateNestedOneWithoutTransactionsInput;
  postDate?: InputMaybe<Scalars['DateTime']['input']>;
  price?: InputMaybe<Scalars['Decimal']['input']>;
  quantity?: InputMaybe<Scalars['Decimal']['input']>;
  securityType?: InputMaybe<Scalars['String']['input']>;
  settlementCurrency?: InputMaybe<Scalars['String']['input']>;
  settlementDate?: InputMaybe<Scalars['DateTime']['input']>;
  subtype?: InputMaybe<Scalars['String']['input']>;
  transactionDate?: InputMaybe<Scalars['DateTime']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type TransactionCreateWithoutAssetInput = {
  account: AccountCreateNestedOneWithoutTransactionsInput;
  amount?: InputMaybe<Scalars['Decimal']['input']>;
  appliedToLots?: InputMaybe<Scalars['Boolean']['input']>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  datailsURI?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  detailsURI?: InputMaybe<Scalars['String']['input']>;
  displaySymbol?: InputMaybe<Scalars['String']['input']>;
  externalId: Scalars['String']['input'];
  fee?: InputMaybe<Scalars['Decimal']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  lotChangeLog?: InputMaybe<LotChangeLogCreateNestedManyWithoutTransactionInput>;
  memo?: InputMaybe<Scalars['String']['input']>;
  paymentCurrency?: InputMaybe<Scalars['String']['input']>;
  portfolio: PortfolioCreateNestedOneWithoutTransactionsInput;
  postDate?: InputMaybe<Scalars['DateTime']['input']>;
  price?: InputMaybe<Scalars['Decimal']['input']>;
  quantity?: InputMaybe<Scalars['Decimal']['input']>;
  securityType?: InputMaybe<Scalars['String']['input']>;
  settlementCurrency?: InputMaybe<Scalars['String']['input']>;
  settlementDate?: InputMaybe<Scalars['DateTime']['input']>;
  subtype?: InputMaybe<Scalars['String']['input']>;
  transactionDate?: InputMaybe<Scalars['DateTime']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type TransactionCreateWithoutLotChangeLogInput = {
  account: AccountCreateNestedOneWithoutTransactionsInput;
  amount?: InputMaybe<Scalars['Decimal']['input']>;
  appliedToLots?: InputMaybe<Scalars['Boolean']['input']>;
  asset: AssetCreateNestedOneWithoutTransactionsInput;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  datailsURI?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  detailsURI?: InputMaybe<Scalars['String']['input']>;
  displaySymbol?: InputMaybe<Scalars['String']['input']>;
  externalId: Scalars['String']['input'];
  fee?: InputMaybe<Scalars['Decimal']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  memo?: InputMaybe<Scalars['String']['input']>;
  paymentCurrency?: InputMaybe<Scalars['String']['input']>;
  portfolio: PortfolioCreateNestedOneWithoutTransactionsInput;
  postDate?: InputMaybe<Scalars['DateTime']['input']>;
  price?: InputMaybe<Scalars['Decimal']['input']>;
  quantity?: InputMaybe<Scalars['Decimal']['input']>;
  securityType?: InputMaybe<Scalars['String']['input']>;
  settlementCurrency?: InputMaybe<Scalars['String']['input']>;
  settlementDate?: InputMaybe<Scalars['DateTime']['input']>;
  subtype?: InputMaybe<Scalars['String']['input']>;
  transactionDate?: InputMaybe<Scalars['DateTime']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type TransactionCreateWithoutPortfolioInput = {
  account: AccountCreateNestedOneWithoutTransactionsInput;
  amount?: InputMaybe<Scalars['Decimal']['input']>;
  appliedToLots?: InputMaybe<Scalars['Boolean']['input']>;
  asset: AssetCreateNestedOneWithoutTransactionsInput;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  datailsURI?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  detailsURI?: InputMaybe<Scalars['String']['input']>;
  displaySymbol?: InputMaybe<Scalars['String']['input']>;
  externalId: Scalars['String']['input'];
  fee?: InputMaybe<Scalars['Decimal']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  lotChangeLog?: InputMaybe<LotChangeLogCreateNestedManyWithoutTransactionInput>;
  memo?: InputMaybe<Scalars['String']['input']>;
  paymentCurrency?: InputMaybe<Scalars['String']['input']>;
  postDate?: InputMaybe<Scalars['DateTime']['input']>;
  price?: InputMaybe<Scalars['Decimal']['input']>;
  quantity?: InputMaybe<Scalars['Decimal']['input']>;
  securityType?: InputMaybe<Scalars['String']['input']>;
  settlementCurrency?: InputMaybe<Scalars['String']['input']>;
  settlementDate?: InputMaybe<Scalars['DateTime']['input']>;
  subtype?: InputMaybe<Scalars['String']['input']>;
  transactionDate?: InputMaybe<Scalars['DateTime']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type TransactionListRelationFilter = {
  every?: InputMaybe<TransactionWhereInput>;
  none?: InputMaybe<TransactionWhereInput>;
  some?: InputMaybe<TransactionWhereInput>;
};

export type TransactionMaxAggregate = {
  __typename?: 'TransactionMaxAggregate';
  accountId?: Maybe<Scalars['String']['output']>;
  amount?: Maybe<Scalars['Decimal']['output']>;
  appliedToLots?: Maybe<Scalars['Boolean']['output']>;
  assetSymbol?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  datailsURI?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  detailsURI?: Maybe<Scalars['String']['output']>;
  displaySymbol?: Maybe<Scalars['String']['output']>;
  externalId?: Maybe<Scalars['String']['output']>;
  fee?: Maybe<Scalars['Decimal']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  memo?: Maybe<Scalars['String']['output']>;
  paymentCurrency?: Maybe<Scalars['String']['output']>;
  portfolioId?: Maybe<Scalars['String']['output']>;
  postDate?: Maybe<Scalars['DateTime']['output']>;
  price?: Maybe<Scalars['Decimal']['output']>;
  quantity?: Maybe<Scalars['Decimal']['output']>;
  securityType?: Maybe<Scalars['String']['output']>;
  settlementCurrency?: Maybe<Scalars['String']['output']>;
  settlementDate?: Maybe<Scalars['DateTime']['output']>;
  subtype?: Maybe<Scalars['String']['output']>;
  transactionDate?: Maybe<Scalars['DateTime']['output']>;
  type?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type TransactionMinAggregate = {
  __typename?: 'TransactionMinAggregate';
  accountId?: Maybe<Scalars['String']['output']>;
  amount?: Maybe<Scalars['Decimal']['output']>;
  appliedToLots?: Maybe<Scalars['Boolean']['output']>;
  assetSymbol?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  datailsURI?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  detailsURI?: Maybe<Scalars['String']['output']>;
  displaySymbol?: Maybe<Scalars['String']['output']>;
  externalId?: Maybe<Scalars['String']['output']>;
  fee?: Maybe<Scalars['Decimal']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  memo?: Maybe<Scalars['String']['output']>;
  paymentCurrency?: Maybe<Scalars['String']['output']>;
  portfolioId?: Maybe<Scalars['String']['output']>;
  postDate?: Maybe<Scalars['DateTime']['output']>;
  price?: Maybe<Scalars['Decimal']['output']>;
  quantity?: Maybe<Scalars['Decimal']['output']>;
  securityType?: Maybe<Scalars['String']['output']>;
  settlementCurrency?: Maybe<Scalars['String']['output']>;
  settlementDate?: Maybe<Scalars['DateTime']['output']>;
  subtype?: Maybe<Scalars['String']['output']>;
  transactionDate?: Maybe<Scalars['DateTime']['output']>;
  type?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type TransactionNullableScalarRelationFilter = {
  is?: InputMaybe<TransactionWhereInput>;
  isNot?: InputMaybe<TransactionWhereInput>;
};

export type TransactionScalarWhereInput = {
  AND?: InputMaybe<Array<TransactionScalarWhereInput>>;
  NOT?: InputMaybe<Array<TransactionScalarWhereInput>>;
  OR?: InputMaybe<Array<TransactionScalarWhereInput>>;
  accountId?: InputMaybe<UuidFilter>;
  amount?: InputMaybe<DecimalNullableFilter>;
  appliedToLots?: InputMaybe<BoolFilter>;
  assetSymbol?: InputMaybe<StringFilter>;
  createdAt?: InputMaybe<DateTimeFilter>;
  datailsURI?: InputMaybe<StringNullableFilter>;
  description?: InputMaybe<StringNullableFilter>;
  detailsURI?: InputMaybe<StringNullableFilter>;
  displaySymbol?: InputMaybe<StringNullableFilter>;
  externalId?: InputMaybe<StringFilter>;
  fee?: InputMaybe<DecimalNullableFilter>;
  id?: InputMaybe<UuidFilter>;
  memo?: InputMaybe<StringNullableFilter>;
  paymentCurrency?: InputMaybe<StringNullableFilter>;
  portfolioId?: InputMaybe<UuidFilter>;
  postDate?: InputMaybe<DateTimeNullableFilter>;
  price?: InputMaybe<DecimalNullableFilter>;
  quantity?: InputMaybe<DecimalNullableFilter>;
  securityType?: InputMaybe<StringNullableFilter>;
  settlementCurrency?: InputMaybe<StringNullableFilter>;
  settlementDate?: InputMaybe<DateTimeNullableFilter>;
  subtype?: InputMaybe<StringNullableFilter>;
  transactionDate?: InputMaybe<DateTimeNullableFilter>;
  type?: InputMaybe<StringNullableFilter>;
  updatedAt?: InputMaybe<DateTimeFilter>;
};

export type TransactionSumAggregate = {
  __typename?: 'TransactionSumAggregate';
  amount?: Maybe<Scalars['Decimal']['output']>;
  fee?: Maybe<Scalars['Decimal']['output']>;
  price?: Maybe<Scalars['Decimal']['output']>;
  quantity?: Maybe<Scalars['Decimal']['output']>;
};

export type TransactionUpdateManyMutationInput = {
  amount?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  appliedToLots?: InputMaybe<BoolFieldUpdateOperationsInput>;
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  datailsURI?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  description?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  detailsURI?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  displaySymbol?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  externalId?: InputMaybe<StringFieldUpdateOperationsInput>;
  fee?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  memo?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  paymentCurrency?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  postDate?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  price?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  quantity?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  securityType?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  settlementCurrency?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  settlementDate?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  subtype?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  transactionDate?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  type?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
};

export type TransactionUpdateManyWithWhereWithoutAccountInput = {
  data: TransactionUpdateManyMutationInput;
  where: TransactionScalarWhereInput;
};

export type TransactionUpdateManyWithWhereWithoutAssetInput = {
  data: TransactionUpdateManyMutationInput;
  where: TransactionScalarWhereInput;
};

export type TransactionUpdateManyWithWhereWithoutPortfolioInput = {
  data: TransactionUpdateManyMutationInput;
  where: TransactionScalarWhereInput;
};

export type TransactionUpdateManyWithoutAccountNestedInput = {
  connect?: InputMaybe<Array<TransactionWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<TransactionCreateOrConnectWithoutAccountInput>>;
  create?: InputMaybe<Array<TransactionCreateWithoutAccountInput>>;
  createMany?: InputMaybe<TransactionCreateManyAccountInputEnvelope>;
  delete?: InputMaybe<Array<TransactionWhereUniqueInput>>;
  deleteMany?: InputMaybe<Array<TransactionScalarWhereInput>>;
  disconnect?: InputMaybe<Array<TransactionWhereUniqueInput>>;
  set?: InputMaybe<Array<TransactionWhereUniqueInput>>;
  update?: InputMaybe<Array<TransactionUpdateWithWhereUniqueWithoutAccountInput>>;
  updateMany?: InputMaybe<Array<TransactionUpdateManyWithWhereWithoutAccountInput>>;
  upsert?: InputMaybe<Array<TransactionUpsertWithWhereUniqueWithoutAccountInput>>;
};

export type TransactionUpdateManyWithoutAssetNestedInput = {
  connect?: InputMaybe<Array<TransactionWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<TransactionCreateOrConnectWithoutAssetInput>>;
  create?: InputMaybe<Array<TransactionCreateWithoutAssetInput>>;
  createMany?: InputMaybe<TransactionCreateManyAssetInputEnvelope>;
  delete?: InputMaybe<Array<TransactionWhereUniqueInput>>;
  deleteMany?: InputMaybe<Array<TransactionScalarWhereInput>>;
  disconnect?: InputMaybe<Array<TransactionWhereUniqueInput>>;
  set?: InputMaybe<Array<TransactionWhereUniqueInput>>;
  update?: InputMaybe<Array<TransactionUpdateWithWhereUniqueWithoutAssetInput>>;
  updateMany?: InputMaybe<Array<TransactionUpdateManyWithWhereWithoutAssetInput>>;
  upsert?: InputMaybe<Array<TransactionUpsertWithWhereUniqueWithoutAssetInput>>;
};

export type TransactionUpdateManyWithoutPortfolioNestedInput = {
  connect?: InputMaybe<Array<TransactionWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<TransactionCreateOrConnectWithoutPortfolioInput>>;
  create?: InputMaybe<Array<TransactionCreateWithoutPortfolioInput>>;
  createMany?: InputMaybe<TransactionCreateManyPortfolioInputEnvelope>;
  delete?: InputMaybe<Array<TransactionWhereUniqueInput>>;
  deleteMany?: InputMaybe<Array<TransactionScalarWhereInput>>;
  disconnect?: InputMaybe<Array<TransactionWhereUniqueInput>>;
  set?: InputMaybe<Array<TransactionWhereUniqueInput>>;
  update?: InputMaybe<Array<TransactionUpdateWithWhereUniqueWithoutPortfolioInput>>;
  updateMany?: InputMaybe<Array<TransactionUpdateManyWithWhereWithoutPortfolioInput>>;
  upsert?: InputMaybe<Array<TransactionUpsertWithWhereUniqueWithoutPortfolioInput>>;
};

export type TransactionUpdateOneWithoutLotChangeLogNestedInput = {
  connect?: InputMaybe<TransactionWhereUniqueInput>;
  connectOrCreate?: InputMaybe<TransactionCreateOrConnectWithoutLotChangeLogInput>;
  create?: InputMaybe<TransactionCreateWithoutLotChangeLogInput>;
  delete?: InputMaybe<TransactionWhereInput>;
  disconnect?: InputMaybe<TransactionWhereInput>;
  update?: InputMaybe<TransactionUpdateToOneWithWhereWithoutLotChangeLogInput>;
  upsert?: InputMaybe<TransactionUpsertWithoutLotChangeLogInput>;
};

export type TransactionUpdateToOneWithWhereWithoutLotChangeLogInput = {
  data: TransactionUpdateWithoutLotChangeLogInput;
  where?: InputMaybe<TransactionWhereInput>;
};

export type TransactionUpdateWithWhereUniqueWithoutAccountInput = {
  data: TransactionUpdateWithoutAccountInput;
  where: TransactionWhereUniqueInput;
};

export type TransactionUpdateWithWhereUniqueWithoutAssetInput = {
  data: TransactionUpdateWithoutAssetInput;
  where: TransactionWhereUniqueInput;
};

export type TransactionUpdateWithWhereUniqueWithoutPortfolioInput = {
  data: TransactionUpdateWithoutPortfolioInput;
  where: TransactionWhereUniqueInput;
};

export type TransactionUpdateWithoutAccountInput = {
  amount?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  appliedToLots?: InputMaybe<BoolFieldUpdateOperationsInput>;
  asset?: InputMaybe<AssetUpdateOneRequiredWithoutTransactionsNestedInput>;
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  datailsURI?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  description?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  detailsURI?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  displaySymbol?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  externalId?: InputMaybe<StringFieldUpdateOperationsInput>;
  fee?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  lotChangeLog?: InputMaybe<LotChangeLogUpdateManyWithoutTransactionNestedInput>;
  memo?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  paymentCurrency?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  portfolio?: InputMaybe<PortfolioUpdateOneRequiredWithoutTransactionsNestedInput>;
  postDate?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  price?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  quantity?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  securityType?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  settlementCurrency?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  settlementDate?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  subtype?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  transactionDate?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  type?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
};

export type TransactionUpdateWithoutAssetInput = {
  account?: InputMaybe<AccountUpdateOneRequiredWithoutTransactionsNestedInput>;
  amount?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  appliedToLots?: InputMaybe<BoolFieldUpdateOperationsInput>;
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  datailsURI?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  description?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  detailsURI?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  displaySymbol?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  externalId?: InputMaybe<StringFieldUpdateOperationsInput>;
  fee?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  lotChangeLog?: InputMaybe<LotChangeLogUpdateManyWithoutTransactionNestedInput>;
  memo?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  paymentCurrency?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  portfolio?: InputMaybe<PortfolioUpdateOneRequiredWithoutTransactionsNestedInput>;
  postDate?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  price?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  quantity?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  securityType?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  settlementCurrency?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  settlementDate?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  subtype?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  transactionDate?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  type?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
};

export type TransactionUpdateWithoutLotChangeLogInput = {
  account?: InputMaybe<AccountUpdateOneRequiredWithoutTransactionsNestedInput>;
  amount?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  appliedToLots?: InputMaybe<BoolFieldUpdateOperationsInput>;
  asset?: InputMaybe<AssetUpdateOneRequiredWithoutTransactionsNestedInput>;
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  datailsURI?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  description?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  detailsURI?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  displaySymbol?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  externalId?: InputMaybe<StringFieldUpdateOperationsInput>;
  fee?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  memo?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  paymentCurrency?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  portfolio?: InputMaybe<PortfolioUpdateOneRequiredWithoutTransactionsNestedInput>;
  postDate?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  price?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  quantity?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  securityType?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  settlementCurrency?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  settlementDate?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  subtype?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  transactionDate?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  type?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
};

export type TransactionUpdateWithoutPortfolioInput = {
  account?: InputMaybe<AccountUpdateOneRequiredWithoutTransactionsNestedInput>;
  amount?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  appliedToLots?: InputMaybe<BoolFieldUpdateOperationsInput>;
  asset?: InputMaybe<AssetUpdateOneRequiredWithoutTransactionsNestedInput>;
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  datailsURI?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  description?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  detailsURI?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  displaySymbol?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  externalId?: InputMaybe<StringFieldUpdateOperationsInput>;
  fee?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  lotChangeLog?: InputMaybe<LotChangeLogUpdateManyWithoutTransactionNestedInput>;
  memo?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  paymentCurrency?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  postDate?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  price?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  quantity?: InputMaybe<NullableDecimalFieldUpdateOperationsInput>;
  securityType?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  settlementCurrency?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  settlementDate?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  subtype?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  transactionDate?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  type?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
};

export type TransactionUpsertWithWhereUniqueWithoutAccountInput = {
  create: TransactionCreateWithoutAccountInput;
  update: TransactionUpdateWithoutAccountInput;
  where: TransactionWhereUniqueInput;
};

export type TransactionUpsertWithWhereUniqueWithoutAssetInput = {
  create: TransactionCreateWithoutAssetInput;
  update: TransactionUpdateWithoutAssetInput;
  where: TransactionWhereUniqueInput;
};

export type TransactionUpsertWithWhereUniqueWithoutPortfolioInput = {
  create: TransactionCreateWithoutPortfolioInput;
  update: TransactionUpdateWithoutPortfolioInput;
  where: TransactionWhereUniqueInput;
};

export type TransactionUpsertWithoutLotChangeLogInput = {
  create: TransactionCreateWithoutLotChangeLogInput;
  update: TransactionUpdateWithoutLotChangeLogInput;
  where?: InputMaybe<TransactionWhereInput>;
};

export type TransactionWhereInput = {
  AND?: InputMaybe<Array<TransactionWhereInput>>;
  NOT?: InputMaybe<Array<TransactionWhereInput>>;
  OR?: InputMaybe<Array<TransactionWhereInput>>;
  account?: InputMaybe<AccountScalarRelationFilter>;
  accountId?: InputMaybe<UuidFilter>;
  amount?: InputMaybe<DecimalNullableFilter>;
  appliedToLots?: InputMaybe<BoolFilter>;
  asset?: InputMaybe<AssetScalarRelationFilter>;
  assetSymbol?: InputMaybe<StringFilter>;
  createdAt?: InputMaybe<DateTimeFilter>;
  datailsURI?: InputMaybe<StringNullableFilter>;
  description?: InputMaybe<StringNullableFilter>;
  detailsURI?: InputMaybe<StringNullableFilter>;
  displaySymbol?: InputMaybe<StringNullableFilter>;
  externalId?: InputMaybe<StringFilter>;
  fee?: InputMaybe<DecimalNullableFilter>;
  id?: InputMaybe<UuidFilter>;
  lotChangeLog?: InputMaybe<LotChangeLogListRelationFilter>;
  memo?: InputMaybe<StringNullableFilter>;
  paymentCurrency?: InputMaybe<StringNullableFilter>;
  portfolio?: InputMaybe<PortfolioScalarRelationFilter>;
  portfolioId?: InputMaybe<UuidFilter>;
  postDate?: InputMaybe<DateTimeNullableFilter>;
  price?: InputMaybe<DecimalNullableFilter>;
  quantity?: InputMaybe<DecimalNullableFilter>;
  securityType?: InputMaybe<StringNullableFilter>;
  settlementCurrency?: InputMaybe<StringNullableFilter>;
  settlementDate?: InputMaybe<DateTimeNullableFilter>;
  subtype?: InputMaybe<StringNullableFilter>;
  transactionDate?: InputMaybe<DateTimeNullableFilter>;
  type?: InputMaybe<StringNullableFilter>;
  updatedAt?: InputMaybe<DateTimeFilter>;
};

export type TransactionWhereUniqueInput = {
  AND?: InputMaybe<Array<TransactionWhereInput>>;
  NOT?: InputMaybe<Array<TransactionWhereInput>>;
  OR?: InputMaybe<Array<TransactionWhereInput>>;
  account?: InputMaybe<AccountScalarRelationFilter>;
  accountId?: InputMaybe<UuidFilter>;
  accountId_externalId?: InputMaybe<TransactionAccountIdExternalIdCompoundUniqueInput>;
  amount?: InputMaybe<DecimalNullableFilter>;
  appliedToLots?: InputMaybe<BoolFilter>;
  asset?: InputMaybe<AssetScalarRelationFilter>;
  assetSymbol?: InputMaybe<StringFilter>;
  createdAt?: InputMaybe<DateTimeFilter>;
  datailsURI?: InputMaybe<StringNullableFilter>;
  description?: InputMaybe<StringNullableFilter>;
  detailsURI?: InputMaybe<StringNullableFilter>;
  displaySymbol?: InputMaybe<StringNullableFilter>;
  externalId?: InputMaybe<Scalars['String']['input']>;
  fee?: InputMaybe<DecimalNullableFilter>;
  id?: InputMaybe<Scalars['String']['input']>;
  lotChangeLog?: InputMaybe<LotChangeLogListRelationFilter>;
  memo?: InputMaybe<StringNullableFilter>;
  paymentCurrency?: InputMaybe<StringNullableFilter>;
  portfolio?: InputMaybe<PortfolioScalarRelationFilter>;
  portfolioId?: InputMaybe<UuidFilter>;
  postDate?: InputMaybe<DateTimeNullableFilter>;
  price?: InputMaybe<DecimalNullableFilter>;
  quantity?: InputMaybe<DecimalNullableFilter>;
  securityType?: InputMaybe<StringNullableFilter>;
  settlementCurrency?: InputMaybe<StringNullableFilter>;
  settlementDate?: InputMaybe<DateTimeNullableFilter>;
  subtype?: InputMaybe<StringNullableFilter>;
  transactionDate?: InputMaybe<DateTimeNullableFilter>;
  type?: InputMaybe<StringNullableFilter>;
  updatedAt?: InputMaybe<DateTimeFilter>;
};

export type UnrealizedHarvestMatchResult = {
  __typename?: 'UnrealizedHarvestMatchResult';
  matchedLotOrders: Array<HarvestLotOrder>;
  sourceLot: LotCurrent;
};

export type User = {
  __typename?: 'User';
  Account?: Maybe<Array<Account>>;
  Harvest?: Maybe<Array<Harvest>>;
  Portfolio?: Maybe<Array<Portfolio>>;
  UsersOnPortfolios?: Maybe<Array<UsersOnPortfolios>>;
  _count: UserCount;
  authConnections?: Maybe<Array<AuthConnection>>;
  createdAt: Scalars['DateTime']['output'];
  email?: Maybe<Scalars['String']['output']>;
  favorites?: Maybe<Array<Asset>>;
  /** This is the clerk user id */
  id: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
  phoneNumber?: Maybe<Scalars['String']['output']>;
  photo?: Maybe<Scalars['String']['output']>;
  plaidCustomerId?: Maybe<Scalars['String']['output']>;
  plaidUserToken?: Maybe<Scalars['String']['output']>;
  /** Stripe user id */
  stripeCustomerId: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type UserCount = {
  __typename?: 'UserCount';
  Account: Scalars['Int']['output'];
  Harvest: Scalars['Int']['output'];
  Portfolio: Scalars['Int']['output'];
  UsersOnPortfolios: Scalars['Int']['output'];
  authConnections: Scalars['Int']['output'];
  favorites: Scalars['Int']['output'];
};

export type UserCountAggregate = {
  __typename?: 'UserCountAggregate';
  _all: Scalars['Int']['output'];
  createdAt: Scalars['Int']['output'];
  email: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  name: Scalars['Int']['output'];
  phoneNumber: Scalars['Int']['output'];
  photo: Scalars['Int']['output'];
  plaidCustomerId: Scalars['Int']['output'];
  plaidUserToken: Scalars['Int']['output'];
  stripeCustomerId: Scalars['Int']['output'];
  updatedAt: Scalars['Int']['output'];
};

export type UserCreateNestedManyWithoutFavoritesInput = {
  connect?: InputMaybe<Array<UserWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<UserCreateOrConnectWithoutFavoritesInput>>;
  create?: InputMaybe<Array<UserCreateWithoutFavoritesInput>>;
};

export type UserCreateNestedOneWithoutAuthConnectionsInput = {
  connect?: InputMaybe<UserWhereUniqueInput>;
  connectOrCreate?: InputMaybe<UserCreateOrConnectWithoutAuthConnectionsInput>;
  create?: InputMaybe<UserCreateWithoutAuthConnectionsInput>;
};

export type UserCreateNestedOneWithoutHarvestInput = {
  connect?: InputMaybe<UserWhereUniqueInput>;
  connectOrCreate?: InputMaybe<UserCreateOrConnectWithoutHarvestInput>;
  create?: InputMaybe<UserCreateWithoutHarvestInput>;
};

export type UserCreateNestedOneWithoutPortfolioInput = {
  connect?: InputMaybe<UserWhereUniqueInput>;
  connectOrCreate?: InputMaybe<UserCreateOrConnectWithoutPortfolioInput>;
  create?: InputMaybe<UserCreateWithoutPortfolioInput>;
};

export type UserCreateNestedOneWithoutUsersOnPortfoliosInput = {
  connect?: InputMaybe<UserWhereUniqueInput>;
  connectOrCreate?: InputMaybe<UserCreateOrConnectWithoutUsersOnPortfoliosInput>;
  create?: InputMaybe<UserCreateWithoutUsersOnPortfoliosInput>;
};

export type UserCreateOrConnectWithoutAccountInput = {
  create: UserCreateWithoutAccountInput;
  where: UserWhereUniqueInput;
};

export type UserCreateOrConnectWithoutAuthConnectionsInput = {
  create: UserCreateWithoutAuthConnectionsInput;
  where: UserWhereUniqueInput;
};

export type UserCreateOrConnectWithoutFavoritesInput = {
  create: UserCreateWithoutFavoritesInput;
  where: UserWhereUniqueInput;
};

export type UserCreateOrConnectWithoutHarvestInput = {
  create: UserCreateWithoutHarvestInput;
  where: UserWhereUniqueInput;
};

export type UserCreateOrConnectWithoutPortfolioInput = {
  create: UserCreateWithoutPortfolioInput;
  where: UserWhereUniqueInput;
};

export type UserCreateOrConnectWithoutUsersOnPortfoliosInput = {
  create: UserCreateWithoutUsersOnPortfoliosInput;
  where: UserWhereUniqueInput;
};

export type UserCreateWithoutAccountInput = {
  Harvest?: InputMaybe<HarvestCreateNestedManyWithoutCreatedByInput>;
  Portfolio?: InputMaybe<PortfolioCreateNestedManyWithoutCreatedByInput>;
  UsersOnPortfolios?: InputMaybe<UsersOnPortfoliosCreateNestedManyWithoutUserInput>;
  authConnections?: InputMaybe<AuthConnectionCreateNestedManyWithoutUserInput>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  favorites?: InputMaybe<AssetCreateNestedManyWithoutFavoritedByInput>;
  id: Scalars['String']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
  photo?: InputMaybe<Scalars['String']['input']>;
  plaidCustomerId?: InputMaybe<Scalars['String']['input']>;
  plaidUserToken?: InputMaybe<Scalars['String']['input']>;
  stripeCustomerId: Scalars['String']['input'];
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type UserCreateWithoutAuthConnectionsInput = {
  Account?: InputMaybe<AccountCreateNestedManyWithoutCreatedByInput>;
  Harvest?: InputMaybe<HarvestCreateNestedManyWithoutCreatedByInput>;
  Portfolio?: InputMaybe<PortfolioCreateNestedManyWithoutCreatedByInput>;
  UsersOnPortfolios?: InputMaybe<UsersOnPortfoliosCreateNestedManyWithoutUserInput>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  favorites?: InputMaybe<AssetCreateNestedManyWithoutFavoritedByInput>;
  id: Scalars['String']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
  photo?: InputMaybe<Scalars['String']['input']>;
  plaidCustomerId?: InputMaybe<Scalars['String']['input']>;
  plaidUserToken?: InputMaybe<Scalars['String']['input']>;
  stripeCustomerId: Scalars['String']['input'];
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type UserCreateWithoutFavoritesInput = {
  Account?: InputMaybe<AccountCreateNestedManyWithoutCreatedByInput>;
  Harvest?: InputMaybe<HarvestCreateNestedManyWithoutCreatedByInput>;
  Portfolio?: InputMaybe<PortfolioCreateNestedManyWithoutCreatedByInput>;
  UsersOnPortfolios?: InputMaybe<UsersOnPortfoliosCreateNestedManyWithoutUserInput>;
  authConnections?: InputMaybe<AuthConnectionCreateNestedManyWithoutUserInput>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
  photo?: InputMaybe<Scalars['String']['input']>;
  plaidCustomerId?: InputMaybe<Scalars['String']['input']>;
  plaidUserToken?: InputMaybe<Scalars['String']['input']>;
  stripeCustomerId: Scalars['String']['input'];
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type UserCreateWithoutHarvestInput = {
  Account?: InputMaybe<AccountCreateNestedManyWithoutCreatedByInput>;
  Portfolio?: InputMaybe<PortfolioCreateNestedManyWithoutCreatedByInput>;
  UsersOnPortfolios?: InputMaybe<UsersOnPortfoliosCreateNestedManyWithoutUserInput>;
  authConnections?: InputMaybe<AuthConnectionCreateNestedManyWithoutUserInput>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  favorites?: InputMaybe<AssetCreateNestedManyWithoutFavoritedByInput>;
  id: Scalars['String']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
  photo?: InputMaybe<Scalars['String']['input']>;
  plaidCustomerId?: InputMaybe<Scalars['String']['input']>;
  plaidUserToken?: InputMaybe<Scalars['String']['input']>;
  stripeCustomerId: Scalars['String']['input'];
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type UserCreateWithoutPortfolioInput = {
  Account?: InputMaybe<AccountCreateNestedManyWithoutCreatedByInput>;
  Harvest?: InputMaybe<HarvestCreateNestedManyWithoutCreatedByInput>;
  UsersOnPortfolios?: InputMaybe<UsersOnPortfoliosCreateNestedManyWithoutUserInput>;
  authConnections?: InputMaybe<AuthConnectionCreateNestedManyWithoutUserInput>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  favorites?: InputMaybe<AssetCreateNestedManyWithoutFavoritedByInput>;
  id: Scalars['String']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
  photo?: InputMaybe<Scalars['String']['input']>;
  plaidCustomerId?: InputMaybe<Scalars['String']['input']>;
  plaidUserToken?: InputMaybe<Scalars['String']['input']>;
  stripeCustomerId: Scalars['String']['input'];
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type UserCreateWithoutUsersOnPortfoliosInput = {
  Account?: InputMaybe<AccountCreateNestedManyWithoutCreatedByInput>;
  Harvest?: InputMaybe<HarvestCreateNestedManyWithoutCreatedByInput>;
  Portfolio?: InputMaybe<PortfolioCreateNestedManyWithoutCreatedByInput>;
  authConnections?: InputMaybe<AuthConnectionCreateNestedManyWithoutUserInput>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  favorites?: InputMaybe<AssetCreateNestedManyWithoutFavoritedByInput>;
  id: Scalars['String']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
  photo?: InputMaybe<Scalars['String']['input']>;
  plaidCustomerId?: InputMaybe<Scalars['String']['input']>;
  plaidUserToken?: InputMaybe<Scalars['String']['input']>;
  stripeCustomerId: Scalars['String']['input'];
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type UserListRelationFilter = {
  every?: InputMaybe<UserWhereInput>;
  none?: InputMaybe<UserWhereInput>;
  some?: InputMaybe<UserWhereInput>;
};

export type UserMaxAggregate = {
  __typename?: 'UserMaxAggregate';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  phoneNumber?: Maybe<Scalars['String']['output']>;
  photo?: Maybe<Scalars['String']['output']>;
  plaidCustomerId?: Maybe<Scalars['String']['output']>;
  plaidUserToken?: Maybe<Scalars['String']['output']>;
  stripeCustomerId?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type UserMinAggregate = {
  __typename?: 'UserMinAggregate';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  phoneNumber?: Maybe<Scalars['String']['output']>;
  photo?: Maybe<Scalars['String']['output']>;
  plaidCustomerId?: Maybe<Scalars['String']['output']>;
  plaidUserToken?: Maybe<Scalars['String']['output']>;
  stripeCustomerId?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type UserScalarRelationFilter = {
  is?: InputMaybe<UserWhereInput>;
  isNot?: InputMaybe<UserWhereInput>;
};

export type UserScalarWhereInput = {
  AND?: InputMaybe<Array<UserScalarWhereInput>>;
  NOT?: InputMaybe<Array<UserScalarWhereInput>>;
  OR?: InputMaybe<Array<UserScalarWhereInput>>;
  createdAt?: InputMaybe<DateTimeFilter>;
  email?: InputMaybe<StringNullableFilter>;
  id?: InputMaybe<StringFilter>;
  name?: InputMaybe<StringNullableFilter>;
  phoneNumber?: InputMaybe<StringNullableFilter>;
  photo?: InputMaybe<StringNullableFilter>;
  plaidCustomerId?: InputMaybe<StringNullableFilter>;
  plaidUserToken?: InputMaybe<StringNullableFilter>;
  stripeCustomerId?: InputMaybe<StringFilter>;
  updatedAt?: InputMaybe<DateTimeFilter>;
};

export type UserUpdateInput = {
  Account?: InputMaybe<AccountUpdateManyWithoutCreatedByNestedInput>;
  Harvest?: InputMaybe<HarvestUpdateManyWithoutCreatedByNestedInput>;
  Portfolio?: InputMaybe<PortfolioUpdateManyWithoutCreatedByNestedInput>;
  UsersOnPortfolios?: InputMaybe<UsersOnPortfoliosUpdateManyWithoutUserNestedInput>;
  authConnections?: InputMaybe<AuthConnectionUpdateManyWithoutUserNestedInput>;
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  email?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  favorites?: InputMaybe<AssetUpdateManyWithoutFavoritedByNestedInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  name?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  phoneNumber?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  photo?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  plaidCustomerId?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  plaidUserToken?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  stripeCustomerId?: InputMaybe<StringFieldUpdateOperationsInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
};

export type UserUpdateManyMutationInput = {
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  email?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  name?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  phoneNumber?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  photo?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  plaidCustomerId?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  plaidUserToken?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  stripeCustomerId?: InputMaybe<StringFieldUpdateOperationsInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
};

export type UserUpdateManyWithWhereWithoutFavoritesInput = {
  data: UserUpdateManyMutationInput;
  where: UserScalarWhereInput;
};

export type UserUpdateManyWithoutFavoritesNestedInput = {
  connect?: InputMaybe<Array<UserWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<UserCreateOrConnectWithoutFavoritesInput>>;
  create?: InputMaybe<Array<UserCreateWithoutFavoritesInput>>;
  delete?: InputMaybe<Array<UserWhereUniqueInput>>;
  deleteMany?: InputMaybe<Array<UserScalarWhereInput>>;
  disconnect?: InputMaybe<Array<UserWhereUniqueInput>>;
  set?: InputMaybe<Array<UserWhereUniqueInput>>;
  update?: InputMaybe<Array<UserUpdateWithWhereUniqueWithoutFavoritesInput>>;
  updateMany?: InputMaybe<Array<UserUpdateManyWithWhereWithoutFavoritesInput>>;
  upsert?: InputMaybe<Array<UserUpsertWithWhereUniqueWithoutFavoritesInput>>;
};

export type UserUpdateOneRequiredWithoutAccountNestedInput = {
  connect?: InputMaybe<UserWhereUniqueInput>;
  connectOrCreate?: InputMaybe<UserCreateOrConnectWithoutAccountInput>;
  create?: InputMaybe<UserCreateWithoutAccountInput>;
  update?: InputMaybe<UserUpdateToOneWithWhereWithoutAccountInput>;
  upsert?: InputMaybe<UserUpsertWithoutAccountInput>;
};

export type UserUpdateOneRequiredWithoutAuthConnectionsNestedInput = {
  connect?: InputMaybe<UserWhereUniqueInput>;
  connectOrCreate?: InputMaybe<UserCreateOrConnectWithoutAuthConnectionsInput>;
  create?: InputMaybe<UserCreateWithoutAuthConnectionsInput>;
  update?: InputMaybe<UserUpdateToOneWithWhereWithoutAuthConnectionsInput>;
  upsert?: InputMaybe<UserUpsertWithoutAuthConnectionsInput>;
};

export type UserUpdateOneRequiredWithoutHarvestNestedInput = {
  connect?: InputMaybe<UserWhereUniqueInput>;
  connectOrCreate?: InputMaybe<UserCreateOrConnectWithoutHarvestInput>;
  create?: InputMaybe<UserCreateWithoutHarvestInput>;
  update?: InputMaybe<UserUpdateToOneWithWhereWithoutHarvestInput>;
  upsert?: InputMaybe<UserUpsertWithoutHarvestInput>;
};

export type UserUpdateOneRequiredWithoutPortfolioNestedInput = {
  connect?: InputMaybe<UserWhereUniqueInput>;
  connectOrCreate?: InputMaybe<UserCreateOrConnectWithoutPortfolioInput>;
  create?: InputMaybe<UserCreateWithoutPortfolioInput>;
  update?: InputMaybe<UserUpdateToOneWithWhereWithoutPortfolioInput>;
  upsert?: InputMaybe<UserUpsertWithoutPortfolioInput>;
};

export type UserUpdateOneRequiredWithoutUsersOnPortfoliosNestedInput = {
  connect?: InputMaybe<UserWhereUniqueInput>;
  connectOrCreate?: InputMaybe<UserCreateOrConnectWithoutUsersOnPortfoliosInput>;
  create?: InputMaybe<UserCreateWithoutUsersOnPortfoliosInput>;
  update?: InputMaybe<UserUpdateToOneWithWhereWithoutUsersOnPortfoliosInput>;
  upsert?: InputMaybe<UserUpsertWithoutUsersOnPortfoliosInput>;
};

export type UserUpdateToOneWithWhereWithoutAccountInput = {
  data: UserUpdateWithoutAccountInput;
  where?: InputMaybe<UserWhereInput>;
};

export type UserUpdateToOneWithWhereWithoutAuthConnectionsInput = {
  data: UserUpdateWithoutAuthConnectionsInput;
  where?: InputMaybe<UserWhereInput>;
};

export type UserUpdateToOneWithWhereWithoutHarvestInput = {
  data: UserUpdateWithoutHarvestInput;
  where?: InputMaybe<UserWhereInput>;
};

export type UserUpdateToOneWithWhereWithoutPortfolioInput = {
  data: UserUpdateWithoutPortfolioInput;
  where?: InputMaybe<UserWhereInput>;
};

export type UserUpdateToOneWithWhereWithoutUsersOnPortfoliosInput = {
  data: UserUpdateWithoutUsersOnPortfoliosInput;
  where?: InputMaybe<UserWhereInput>;
};

export type UserUpdateWithWhereUniqueWithoutFavoritesInput = {
  data: UserUpdateWithoutFavoritesInput;
  where: UserWhereUniqueInput;
};

export type UserUpdateWithoutAccountInput = {
  Harvest?: InputMaybe<HarvestUpdateManyWithoutCreatedByNestedInput>;
  Portfolio?: InputMaybe<PortfolioUpdateManyWithoutCreatedByNestedInput>;
  UsersOnPortfolios?: InputMaybe<UsersOnPortfoliosUpdateManyWithoutUserNestedInput>;
  authConnections?: InputMaybe<AuthConnectionUpdateManyWithoutUserNestedInput>;
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  email?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  favorites?: InputMaybe<AssetUpdateManyWithoutFavoritedByNestedInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  name?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  phoneNumber?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  photo?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  plaidCustomerId?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  plaidUserToken?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  stripeCustomerId?: InputMaybe<StringFieldUpdateOperationsInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
};

export type UserUpdateWithoutAuthConnectionsInput = {
  Account?: InputMaybe<AccountUpdateManyWithoutCreatedByNestedInput>;
  Harvest?: InputMaybe<HarvestUpdateManyWithoutCreatedByNestedInput>;
  Portfolio?: InputMaybe<PortfolioUpdateManyWithoutCreatedByNestedInput>;
  UsersOnPortfolios?: InputMaybe<UsersOnPortfoliosUpdateManyWithoutUserNestedInput>;
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  email?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  favorites?: InputMaybe<AssetUpdateManyWithoutFavoritedByNestedInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  name?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  phoneNumber?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  photo?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  plaidCustomerId?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  plaidUserToken?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  stripeCustomerId?: InputMaybe<StringFieldUpdateOperationsInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
};

export type UserUpdateWithoutFavoritesInput = {
  Account?: InputMaybe<AccountUpdateManyWithoutCreatedByNestedInput>;
  Harvest?: InputMaybe<HarvestUpdateManyWithoutCreatedByNestedInput>;
  Portfolio?: InputMaybe<PortfolioUpdateManyWithoutCreatedByNestedInput>;
  UsersOnPortfolios?: InputMaybe<UsersOnPortfoliosUpdateManyWithoutUserNestedInput>;
  authConnections?: InputMaybe<AuthConnectionUpdateManyWithoutUserNestedInput>;
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  email?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  name?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  phoneNumber?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  photo?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  plaidCustomerId?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  plaidUserToken?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  stripeCustomerId?: InputMaybe<StringFieldUpdateOperationsInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
};

export type UserUpdateWithoutHarvestInput = {
  Account?: InputMaybe<AccountUpdateManyWithoutCreatedByNestedInput>;
  Portfolio?: InputMaybe<PortfolioUpdateManyWithoutCreatedByNestedInput>;
  UsersOnPortfolios?: InputMaybe<UsersOnPortfoliosUpdateManyWithoutUserNestedInput>;
  authConnections?: InputMaybe<AuthConnectionUpdateManyWithoutUserNestedInput>;
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  email?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  favorites?: InputMaybe<AssetUpdateManyWithoutFavoritedByNestedInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  name?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  phoneNumber?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  photo?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  plaidCustomerId?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  plaidUserToken?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  stripeCustomerId?: InputMaybe<StringFieldUpdateOperationsInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
};

export type UserUpdateWithoutPortfolioInput = {
  Account?: InputMaybe<AccountUpdateManyWithoutCreatedByNestedInput>;
  Harvest?: InputMaybe<HarvestUpdateManyWithoutCreatedByNestedInput>;
  UsersOnPortfolios?: InputMaybe<UsersOnPortfoliosUpdateManyWithoutUserNestedInput>;
  authConnections?: InputMaybe<AuthConnectionUpdateManyWithoutUserNestedInput>;
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  email?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  favorites?: InputMaybe<AssetUpdateManyWithoutFavoritedByNestedInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  name?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  phoneNumber?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  photo?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  plaidCustomerId?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  plaidUserToken?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  stripeCustomerId?: InputMaybe<StringFieldUpdateOperationsInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
};

export type UserUpdateWithoutUsersOnPortfoliosInput = {
  Account?: InputMaybe<AccountUpdateManyWithoutCreatedByNestedInput>;
  Harvest?: InputMaybe<HarvestUpdateManyWithoutCreatedByNestedInput>;
  Portfolio?: InputMaybe<PortfolioUpdateManyWithoutCreatedByNestedInput>;
  authConnections?: InputMaybe<AuthConnectionUpdateManyWithoutUserNestedInput>;
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  email?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  favorites?: InputMaybe<AssetUpdateManyWithoutFavoritedByNestedInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  name?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  phoneNumber?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  photo?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  plaidCustomerId?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  plaidUserToken?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  stripeCustomerId?: InputMaybe<StringFieldUpdateOperationsInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
};

export type UserUpsertWithWhereUniqueWithoutFavoritesInput = {
  create: UserCreateWithoutFavoritesInput;
  update: UserUpdateWithoutFavoritesInput;
  where: UserWhereUniqueInput;
};

export type UserUpsertWithoutAccountInput = {
  create: UserCreateWithoutAccountInput;
  update: UserUpdateWithoutAccountInput;
  where?: InputMaybe<UserWhereInput>;
};

export type UserUpsertWithoutAuthConnectionsInput = {
  create: UserCreateWithoutAuthConnectionsInput;
  update: UserUpdateWithoutAuthConnectionsInput;
  where?: InputMaybe<UserWhereInput>;
};

export type UserUpsertWithoutHarvestInput = {
  create: UserCreateWithoutHarvestInput;
  update: UserUpdateWithoutHarvestInput;
  where?: InputMaybe<UserWhereInput>;
};

export type UserUpsertWithoutPortfolioInput = {
  create: UserCreateWithoutPortfolioInput;
  update: UserUpdateWithoutPortfolioInput;
  where?: InputMaybe<UserWhereInput>;
};

export type UserUpsertWithoutUsersOnPortfoliosInput = {
  create: UserCreateWithoutUsersOnPortfoliosInput;
  update: UserUpdateWithoutUsersOnPortfoliosInput;
  where?: InputMaybe<UserWhereInput>;
};

export type UserWhereInput = {
  AND?: InputMaybe<Array<UserWhereInput>>;
  Account?: InputMaybe<AccountListRelationFilter>;
  Harvest?: InputMaybe<HarvestListRelationFilter>;
  NOT?: InputMaybe<Array<UserWhereInput>>;
  OR?: InputMaybe<Array<UserWhereInput>>;
  Portfolio?: InputMaybe<PortfolioListRelationFilter>;
  UsersOnPortfolios?: InputMaybe<UsersOnPortfoliosListRelationFilter>;
  authConnections?: InputMaybe<AuthConnectionListRelationFilter>;
  createdAt?: InputMaybe<DateTimeFilter>;
  email?: InputMaybe<StringNullableFilter>;
  favorites?: InputMaybe<AssetListRelationFilter>;
  id?: InputMaybe<StringFilter>;
  name?: InputMaybe<StringNullableFilter>;
  phoneNumber?: InputMaybe<StringNullableFilter>;
  photo?: InputMaybe<StringNullableFilter>;
  plaidCustomerId?: InputMaybe<StringNullableFilter>;
  plaidUserToken?: InputMaybe<StringNullableFilter>;
  stripeCustomerId?: InputMaybe<StringFilter>;
  updatedAt?: InputMaybe<DateTimeFilter>;
};

export type UserWhereUniqueInput = {
  AND?: InputMaybe<Array<UserWhereInput>>;
  Account?: InputMaybe<AccountListRelationFilter>;
  Harvest?: InputMaybe<HarvestListRelationFilter>;
  NOT?: InputMaybe<Array<UserWhereInput>>;
  OR?: InputMaybe<Array<UserWhereInput>>;
  Portfolio?: InputMaybe<PortfolioListRelationFilter>;
  UsersOnPortfolios?: InputMaybe<UsersOnPortfoliosListRelationFilter>;
  authConnections?: InputMaybe<AuthConnectionListRelationFilter>;
  createdAt?: InputMaybe<DateTimeFilter>;
  email?: InputMaybe<StringNullableFilter>;
  favorites?: InputMaybe<AssetListRelationFilter>;
  id?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<StringNullableFilter>;
  phoneNumber?: InputMaybe<StringNullableFilter>;
  photo?: InputMaybe<StringNullableFilter>;
  plaidCustomerId?: InputMaybe<StringNullableFilter>;
  plaidUserToken?: InputMaybe<StringNullableFilter>;
  stripeCustomerId?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<DateTimeFilter>;
};

export type UsersOnPortfolios = {
  __typename?: 'UsersOnPortfolios';
  createdAt: Scalars['DateTime']['output'];
  portfolio: Portfolio;
  portfolioId: Scalars['String']['output'];
  role: PortfolioRole;
  updatedAt: Scalars['DateTime']['output'];
  user: User;
  userId: Scalars['String']['output'];
};

export type UsersOnPortfoliosCountAggregate = {
  __typename?: 'UsersOnPortfoliosCountAggregate';
  _all: Scalars['Int']['output'];
  createdAt: Scalars['Int']['output'];
  portfolioId: Scalars['Int']['output'];
  role: Scalars['Int']['output'];
  updatedAt: Scalars['Int']['output'];
  userId: Scalars['Int']['output'];
};

export type UsersOnPortfoliosCreateManyPortfolioInput = {
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  role?: InputMaybe<PortfolioRole>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
  userId: Scalars['String']['input'];
};

export type UsersOnPortfoliosCreateManyPortfolioInputEnvelope = {
  data: Array<UsersOnPortfoliosCreateManyPortfolioInput>;
  skipDuplicates?: InputMaybe<Scalars['Boolean']['input']>;
};

export type UsersOnPortfoliosCreateManyUserInput = {
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  portfolioId: Scalars['String']['input'];
  role?: InputMaybe<PortfolioRole>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type UsersOnPortfoliosCreateManyUserInputEnvelope = {
  data: Array<UsersOnPortfoliosCreateManyUserInput>;
  skipDuplicates?: InputMaybe<Scalars['Boolean']['input']>;
};

export type UsersOnPortfoliosCreateNestedManyWithoutPortfolioInput = {
  connect?: InputMaybe<Array<UsersOnPortfoliosWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<UsersOnPortfoliosCreateOrConnectWithoutPortfolioInput>>;
  create?: InputMaybe<Array<UsersOnPortfoliosCreateWithoutPortfolioInput>>;
  createMany?: InputMaybe<UsersOnPortfoliosCreateManyPortfolioInputEnvelope>;
};

export type UsersOnPortfoliosCreateNestedManyWithoutUserInput = {
  connect?: InputMaybe<Array<UsersOnPortfoliosWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<UsersOnPortfoliosCreateOrConnectWithoutUserInput>>;
  create?: InputMaybe<Array<UsersOnPortfoliosCreateWithoutUserInput>>;
  createMany?: InputMaybe<UsersOnPortfoliosCreateManyUserInputEnvelope>;
};

export type UsersOnPortfoliosCreateOrConnectWithoutPortfolioInput = {
  create: UsersOnPortfoliosCreateWithoutPortfolioInput;
  where: UsersOnPortfoliosWhereUniqueInput;
};

export type UsersOnPortfoliosCreateOrConnectWithoutUserInput = {
  create: UsersOnPortfoliosCreateWithoutUserInput;
  where: UsersOnPortfoliosWhereUniqueInput;
};

export type UsersOnPortfoliosCreateWithoutPortfolioInput = {
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  role?: InputMaybe<PortfolioRole>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
  user: UserCreateNestedOneWithoutUsersOnPortfoliosInput;
};

export type UsersOnPortfoliosCreateWithoutUserInput = {
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  portfolio: PortfolioCreateNestedOneWithoutUsersOnPortfoliosInput;
  role?: InputMaybe<PortfolioRole>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type UsersOnPortfoliosListRelationFilter = {
  every?: InputMaybe<UsersOnPortfoliosWhereInput>;
  none?: InputMaybe<UsersOnPortfoliosWhereInput>;
  some?: InputMaybe<UsersOnPortfoliosWhereInput>;
};

export type UsersOnPortfoliosMaxAggregate = {
  __typename?: 'UsersOnPortfoliosMaxAggregate';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  portfolioId?: Maybe<Scalars['String']['output']>;
  role?: Maybe<PortfolioRole>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  userId?: Maybe<Scalars['String']['output']>;
};

export type UsersOnPortfoliosMinAggregate = {
  __typename?: 'UsersOnPortfoliosMinAggregate';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  portfolioId?: Maybe<Scalars['String']['output']>;
  role?: Maybe<PortfolioRole>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  userId?: Maybe<Scalars['String']['output']>;
};

export type UsersOnPortfoliosScalarWhereInput = {
  AND?: InputMaybe<Array<UsersOnPortfoliosScalarWhereInput>>;
  NOT?: InputMaybe<Array<UsersOnPortfoliosScalarWhereInput>>;
  OR?: InputMaybe<Array<UsersOnPortfoliosScalarWhereInput>>;
  createdAt?: InputMaybe<DateTimeFilter>;
  portfolioId?: InputMaybe<UuidFilter>;
  role?: InputMaybe<EnumPortfolioRoleFilter>;
  updatedAt?: InputMaybe<DateTimeFilter>;
  userId?: InputMaybe<StringFilter>;
};

export type UsersOnPortfoliosUpdateManyMutationInput = {
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  role?: InputMaybe<EnumPortfolioRoleFieldUpdateOperationsInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
};

export type UsersOnPortfoliosUpdateManyWithWhereWithoutPortfolioInput = {
  data: UsersOnPortfoliosUpdateManyMutationInput;
  where: UsersOnPortfoliosScalarWhereInput;
};

export type UsersOnPortfoliosUpdateManyWithWhereWithoutUserInput = {
  data: UsersOnPortfoliosUpdateManyMutationInput;
  where: UsersOnPortfoliosScalarWhereInput;
};

export type UsersOnPortfoliosUpdateManyWithoutPortfolioNestedInput = {
  connect?: InputMaybe<Array<UsersOnPortfoliosWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<UsersOnPortfoliosCreateOrConnectWithoutPortfolioInput>>;
  create?: InputMaybe<Array<UsersOnPortfoliosCreateWithoutPortfolioInput>>;
  createMany?: InputMaybe<UsersOnPortfoliosCreateManyPortfolioInputEnvelope>;
  delete?: InputMaybe<Array<UsersOnPortfoliosWhereUniqueInput>>;
  deleteMany?: InputMaybe<Array<UsersOnPortfoliosScalarWhereInput>>;
  disconnect?: InputMaybe<Array<UsersOnPortfoliosWhereUniqueInput>>;
  set?: InputMaybe<Array<UsersOnPortfoliosWhereUniqueInput>>;
  update?: InputMaybe<Array<UsersOnPortfoliosUpdateWithWhereUniqueWithoutPortfolioInput>>;
  updateMany?: InputMaybe<Array<UsersOnPortfoliosUpdateManyWithWhereWithoutPortfolioInput>>;
  upsert?: InputMaybe<Array<UsersOnPortfoliosUpsertWithWhereUniqueWithoutPortfolioInput>>;
};

export type UsersOnPortfoliosUpdateManyWithoutUserNestedInput = {
  connect?: InputMaybe<Array<UsersOnPortfoliosWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<UsersOnPortfoliosCreateOrConnectWithoutUserInput>>;
  create?: InputMaybe<Array<UsersOnPortfoliosCreateWithoutUserInput>>;
  createMany?: InputMaybe<UsersOnPortfoliosCreateManyUserInputEnvelope>;
  delete?: InputMaybe<Array<UsersOnPortfoliosWhereUniqueInput>>;
  deleteMany?: InputMaybe<Array<UsersOnPortfoliosScalarWhereInput>>;
  disconnect?: InputMaybe<Array<UsersOnPortfoliosWhereUniqueInput>>;
  set?: InputMaybe<Array<UsersOnPortfoliosWhereUniqueInput>>;
  update?: InputMaybe<Array<UsersOnPortfoliosUpdateWithWhereUniqueWithoutUserInput>>;
  updateMany?: InputMaybe<Array<UsersOnPortfoliosUpdateManyWithWhereWithoutUserInput>>;
  upsert?: InputMaybe<Array<UsersOnPortfoliosUpsertWithWhereUniqueWithoutUserInput>>;
};

export type UsersOnPortfoliosUpdateWithWhereUniqueWithoutPortfolioInput = {
  data: UsersOnPortfoliosUpdateWithoutPortfolioInput;
  where: UsersOnPortfoliosWhereUniqueInput;
};

export type UsersOnPortfoliosUpdateWithWhereUniqueWithoutUserInput = {
  data: UsersOnPortfoliosUpdateWithoutUserInput;
  where: UsersOnPortfoliosWhereUniqueInput;
};

export type UsersOnPortfoliosUpdateWithoutPortfolioInput = {
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  role?: InputMaybe<EnumPortfolioRoleFieldUpdateOperationsInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  user?: InputMaybe<UserUpdateOneRequiredWithoutUsersOnPortfoliosNestedInput>;
};

export type UsersOnPortfoliosUpdateWithoutUserInput = {
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  portfolio?: InputMaybe<PortfolioUpdateOneRequiredWithoutUsersOnPortfoliosNestedInput>;
  role?: InputMaybe<EnumPortfolioRoleFieldUpdateOperationsInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
};

export type UsersOnPortfoliosUpsertWithWhereUniqueWithoutPortfolioInput = {
  create: UsersOnPortfoliosCreateWithoutPortfolioInput;
  update: UsersOnPortfoliosUpdateWithoutPortfolioInput;
  where: UsersOnPortfoliosWhereUniqueInput;
};

export type UsersOnPortfoliosUpsertWithWhereUniqueWithoutUserInput = {
  create: UsersOnPortfoliosCreateWithoutUserInput;
  update: UsersOnPortfoliosUpdateWithoutUserInput;
  where: UsersOnPortfoliosWhereUniqueInput;
};

export type UsersOnPortfoliosUserIdPortfolioIdCompoundUniqueInput = {
  portfolioId: Scalars['String']['input'];
  userId: Scalars['String']['input'];
};

export type UsersOnPortfoliosWhereInput = {
  AND?: InputMaybe<Array<UsersOnPortfoliosWhereInput>>;
  NOT?: InputMaybe<Array<UsersOnPortfoliosWhereInput>>;
  OR?: InputMaybe<Array<UsersOnPortfoliosWhereInput>>;
  createdAt?: InputMaybe<DateTimeFilter>;
  portfolio?: InputMaybe<PortfolioScalarRelationFilter>;
  portfolioId?: InputMaybe<UuidFilter>;
  role?: InputMaybe<EnumPortfolioRoleFilter>;
  updatedAt?: InputMaybe<DateTimeFilter>;
  user?: InputMaybe<UserScalarRelationFilter>;
  userId?: InputMaybe<StringFilter>;
};

export type UsersOnPortfoliosWhereUniqueInput = {
  AND?: InputMaybe<Array<UsersOnPortfoliosWhereInput>>;
  NOT?: InputMaybe<Array<UsersOnPortfoliosWhereInput>>;
  OR?: InputMaybe<Array<UsersOnPortfoliosWhereInput>>;
  createdAt?: InputMaybe<DateTimeFilter>;
  portfolio?: InputMaybe<PortfolioScalarRelationFilter>;
  portfolioId?: InputMaybe<UuidFilter>;
  role?: InputMaybe<EnumPortfolioRoleFilter>;
  updatedAt?: InputMaybe<DateTimeFilter>;
  user?: InputMaybe<UserScalarRelationFilter>;
  userId?: InputMaybe<StringFilter>;
  userId_portfolioId?: InputMaybe<UsersOnPortfoliosUserIdPortfolioIdCompoundUniqueInput>;
};

export type UuidFilter = {
  equals?: InputMaybe<Scalars['String']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<Scalars['String']['input']>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  mode?: InputMaybe<QueryMode>;
  not?: InputMaybe<NestedUuidFilter>;
  notIn?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type UuidNullableFilter = {
  equals?: InputMaybe<Scalars['String']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<Scalars['String']['input']>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  mode?: InputMaybe<QueryMode>;
  not?: InputMaybe<NestedUuidNullableFilter>;
  notIn?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type VectorGraph = {
  __typename?: 'VectorGraph';
  asset: Asset;
  assetSymbol: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  data?: Maybe<Array<Scalars['JSON']['output']>>;
  id: Scalars['ID']['output'];
  priceHourlyVector: PriceHourlyVector;
  priceHourlyVectorId: Scalars['String']['output'];
  type: Graph;
  updatedAt: Scalars['DateTime']['output'];
};

export type VectorGraphAssetSymbolTypePriceHourlyVectorIdCompoundUniqueInput = {
  assetSymbol: Scalars['String']['input'];
  priceHourlyVectorId: Scalars['String']['input'];
  type: Graph;
};

export type VectorGraphCountAggregate = {
  __typename?: 'VectorGraphCountAggregate';
  _all: Scalars['Int']['output'];
  assetSymbol: Scalars['Int']['output'];
  createdAt: Scalars['Int']['output'];
  data: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  priceHourlyVectorId: Scalars['Int']['output'];
  type: Scalars['Int']['output'];
  updatedAt: Scalars['Int']['output'];
};

export type VectorGraphCreateManyAssetInput = {
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  data?: InputMaybe<VectorGraphCreatedataInput>;
  id?: InputMaybe<Scalars['String']['input']>;
  priceHourlyVectorId: Scalars['String']['input'];
  type: Graph;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type VectorGraphCreateManyAssetInputEnvelope = {
  data: Array<VectorGraphCreateManyAssetInput>;
  skipDuplicates?: InputMaybe<Scalars['Boolean']['input']>;
};

export type VectorGraphCreateManyPriceHourlyVectorInput = {
  assetSymbol: Scalars['String']['input'];
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  data?: InputMaybe<VectorGraphCreatedataInput>;
  id?: InputMaybe<Scalars['String']['input']>;
  type: Graph;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type VectorGraphCreateManyPriceHourlyVectorInputEnvelope = {
  data: Array<VectorGraphCreateManyPriceHourlyVectorInput>;
  skipDuplicates?: InputMaybe<Scalars['Boolean']['input']>;
};

export type VectorGraphCreateNestedManyWithoutAssetInput = {
  connect?: InputMaybe<Array<VectorGraphWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<VectorGraphCreateOrConnectWithoutAssetInput>>;
  create?: InputMaybe<Array<VectorGraphCreateWithoutAssetInput>>;
  createMany?: InputMaybe<VectorGraphCreateManyAssetInputEnvelope>;
};

export type VectorGraphCreateNestedManyWithoutPriceHourlyVectorInput = {
  connect?: InputMaybe<Array<VectorGraphWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<VectorGraphCreateOrConnectWithoutPriceHourlyVectorInput>>;
  create?: InputMaybe<Array<VectorGraphCreateWithoutPriceHourlyVectorInput>>;
  createMany?: InputMaybe<VectorGraphCreateManyPriceHourlyVectorInputEnvelope>;
};

export type VectorGraphCreateOrConnectWithoutAssetInput = {
  create: VectorGraphCreateWithoutAssetInput;
  where: VectorGraphWhereUniqueInput;
};

export type VectorGraphCreateOrConnectWithoutPriceHourlyVectorInput = {
  create: VectorGraphCreateWithoutPriceHourlyVectorInput;
  where: VectorGraphWhereUniqueInput;
};

export type VectorGraphCreateWithoutAssetInput = {
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  data?: InputMaybe<VectorGraphCreatedataInput>;
  id?: InputMaybe<Scalars['String']['input']>;
  priceHourlyVector: PriceHourlyVectorCreateNestedOneWithoutVectorGraphsInput;
  type: Graph;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type VectorGraphCreateWithoutPriceHourlyVectorInput = {
  asset: AssetCreateNestedOneWithoutVectorGraphsInput;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  data?: InputMaybe<VectorGraphCreatedataInput>;
  id?: InputMaybe<Scalars['String']['input']>;
  type: Graph;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type VectorGraphCreatedataInput = {
  set: Array<Scalars['JSON']['input']>;
};

export type VectorGraphListRelationFilter = {
  every?: InputMaybe<VectorGraphWhereInput>;
  none?: InputMaybe<VectorGraphWhereInput>;
  some?: InputMaybe<VectorGraphWhereInput>;
};

export type VectorGraphMaxAggregate = {
  __typename?: 'VectorGraphMaxAggregate';
  assetSymbol?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  priceHourlyVectorId?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Graph>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type VectorGraphMinAggregate = {
  __typename?: 'VectorGraphMinAggregate';
  assetSymbol?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  priceHourlyVectorId?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Graph>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type VectorGraphScalarWhereInput = {
  AND?: InputMaybe<Array<VectorGraphScalarWhereInput>>;
  NOT?: InputMaybe<Array<VectorGraphScalarWhereInput>>;
  OR?: InputMaybe<Array<VectorGraphScalarWhereInput>>;
  assetSymbol?: InputMaybe<StringFilter>;
  createdAt?: InputMaybe<DateTimeFilter>;
  data?: InputMaybe<JsonNullableListFilter>;
  id?: InputMaybe<UuidFilter>;
  priceHourlyVectorId?: InputMaybe<UuidFilter>;
  type?: InputMaybe<EnumGraphFilter>;
  updatedAt?: InputMaybe<DateTimeFilter>;
};

export type VectorGraphUpdateManyMutationInput = {
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  data?: InputMaybe<VectorGraphUpdatedataInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  type?: InputMaybe<EnumGraphFieldUpdateOperationsInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
};

export type VectorGraphUpdateManyWithWhereWithoutAssetInput = {
  data: VectorGraphUpdateManyMutationInput;
  where: VectorGraphScalarWhereInput;
};

export type VectorGraphUpdateManyWithWhereWithoutPriceHourlyVectorInput = {
  data: VectorGraphUpdateManyMutationInput;
  where: VectorGraphScalarWhereInput;
};

export type VectorGraphUpdateManyWithoutAssetNestedInput = {
  connect?: InputMaybe<Array<VectorGraphWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<VectorGraphCreateOrConnectWithoutAssetInput>>;
  create?: InputMaybe<Array<VectorGraphCreateWithoutAssetInput>>;
  createMany?: InputMaybe<VectorGraphCreateManyAssetInputEnvelope>;
  delete?: InputMaybe<Array<VectorGraphWhereUniqueInput>>;
  deleteMany?: InputMaybe<Array<VectorGraphScalarWhereInput>>;
  disconnect?: InputMaybe<Array<VectorGraphWhereUniqueInput>>;
  set?: InputMaybe<Array<VectorGraphWhereUniqueInput>>;
  update?: InputMaybe<Array<VectorGraphUpdateWithWhereUniqueWithoutAssetInput>>;
  updateMany?: InputMaybe<Array<VectorGraphUpdateManyWithWhereWithoutAssetInput>>;
  upsert?: InputMaybe<Array<VectorGraphUpsertWithWhereUniqueWithoutAssetInput>>;
};

export type VectorGraphUpdateManyWithoutPriceHourlyVectorNestedInput = {
  connect?: InputMaybe<Array<VectorGraphWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<VectorGraphCreateOrConnectWithoutPriceHourlyVectorInput>>;
  create?: InputMaybe<Array<VectorGraphCreateWithoutPriceHourlyVectorInput>>;
  createMany?: InputMaybe<VectorGraphCreateManyPriceHourlyVectorInputEnvelope>;
  delete?: InputMaybe<Array<VectorGraphWhereUniqueInput>>;
  deleteMany?: InputMaybe<Array<VectorGraphScalarWhereInput>>;
  disconnect?: InputMaybe<Array<VectorGraphWhereUniqueInput>>;
  set?: InputMaybe<Array<VectorGraphWhereUniqueInput>>;
  update?: InputMaybe<Array<VectorGraphUpdateWithWhereUniqueWithoutPriceHourlyVectorInput>>;
  updateMany?: InputMaybe<Array<VectorGraphUpdateManyWithWhereWithoutPriceHourlyVectorInput>>;
  upsert?: InputMaybe<Array<VectorGraphUpsertWithWhereUniqueWithoutPriceHourlyVectorInput>>;
};

export type VectorGraphUpdateWithWhereUniqueWithoutAssetInput = {
  data: VectorGraphUpdateWithoutAssetInput;
  where: VectorGraphWhereUniqueInput;
};

export type VectorGraphUpdateWithWhereUniqueWithoutPriceHourlyVectorInput = {
  data: VectorGraphUpdateWithoutPriceHourlyVectorInput;
  where: VectorGraphWhereUniqueInput;
};

export type VectorGraphUpdateWithoutAssetInput = {
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  data?: InputMaybe<VectorGraphUpdatedataInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  priceHourlyVector?: InputMaybe<PriceHourlyVectorUpdateOneRequiredWithoutVectorGraphsNestedInput>;
  type?: InputMaybe<EnumGraphFieldUpdateOperationsInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
};

export type VectorGraphUpdateWithoutPriceHourlyVectorInput = {
  asset?: InputMaybe<AssetUpdateOneRequiredWithoutVectorGraphsNestedInput>;
  createdAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
  data?: InputMaybe<VectorGraphUpdatedataInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  type?: InputMaybe<EnumGraphFieldUpdateOperationsInput>;
  updatedAt?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
};

export type VectorGraphUpdatedataInput = {
  push?: InputMaybe<Array<Scalars['JSON']['input']>>;
  set?: InputMaybe<Array<Scalars['JSON']['input']>>;
};

export type VectorGraphUpsertWithWhereUniqueWithoutAssetInput = {
  create: VectorGraphCreateWithoutAssetInput;
  update: VectorGraphUpdateWithoutAssetInput;
  where: VectorGraphWhereUniqueInput;
};

export type VectorGraphUpsertWithWhereUniqueWithoutPriceHourlyVectorInput = {
  create: VectorGraphCreateWithoutPriceHourlyVectorInput;
  update: VectorGraphUpdateWithoutPriceHourlyVectorInput;
  where: VectorGraphWhereUniqueInput;
};

export type VectorGraphWhereInput = {
  AND?: InputMaybe<Array<VectorGraphWhereInput>>;
  NOT?: InputMaybe<Array<VectorGraphWhereInput>>;
  OR?: InputMaybe<Array<VectorGraphWhereInput>>;
  asset?: InputMaybe<AssetScalarRelationFilter>;
  assetSymbol?: InputMaybe<StringFilter>;
  createdAt?: InputMaybe<DateTimeFilter>;
  data?: InputMaybe<JsonNullableListFilter>;
  id?: InputMaybe<UuidFilter>;
  priceHourlyVector?: InputMaybe<PriceHourlyVectorScalarRelationFilter>;
  priceHourlyVectorId?: InputMaybe<UuidFilter>;
  type?: InputMaybe<EnumGraphFilter>;
  updatedAt?: InputMaybe<DateTimeFilter>;
};

export type VectorGraphWhereUniqueInput = {
  AND?: InputMaybe<Array<VectorGraphWhereInput>>;
  NOT?: InputMaybe<Array<VectorGraphWhereInput>>;
  OR?: InputMaybe<Array<VectorGraphWhereInput>>;
  asset?: InputMaybe<AssetScalarRelationFilter>;
  assetSymbol?: InputMaybe<StringFilter>;
  assetSymbol_type_priceHourlyVectorId?: InputMaybe<VectorGraphAssetSymbolTypePriceHourlyVectorIdCompoundUniqueInput>;
  createdAt?: InputMaybe<DateTimeFilter>;
  data?: InputMaybe<JsonNullableListFilter>;
  id?: InputMaybe<Scalars['String']['input']>;
  priceHourlyVector?: InputMaybe<PriceHourlyVectorScalarRelationFilter>;
  priceHourlyVectorId?: InputMaybe<UuidFilter>;
  type?: InputMaybe<EnumGraphFilter>;
  updatedAt?: InputMaybe<DateTimeFilter>;
};

export enum VectorWindow {
  Month_1 = 'MONTH_1',
  Month_3 = 'MONTH_3',
  Month_6 = 'MONTH_6',
  Year_1 = 'YEAR_1',
  Year_2 = 'YEAR_2'
}

export type AccountItemFragment = { __typename?: 'Account', id: string, name?: string | null, type: string, portfolioId: string, provider: AccountProvider, externalId?: string | null, key?: string | null, description?: string | null, institution?: AccountInstitution | null, mode?: AccountMode | null, status: AccountStatus, optionLevel?: OptionLevel | null, cashForOpenOrders?: string | null, balanceMoneyMarket?: string | null, cashAvailableForInvestment?: string | null, accountValueTotal?: string | null, marketValueTotal?: string | null, cashNet?: string | null, cashBalance?: string | null, balanceAccount?: string | null, createdAt: any, updatedAt: any, createdBy: { __typename?: 'User', id: string, name?: string | null, email?: string | null, photo?: string | null, stripeCustomerId: string }, _realizedProfitAndLoss: { __typename?: 'RealizedPAndL', id: string, longTerm: string, shortTerm: string, dividend: string, year: number, deferredLoss: string } };

export type AccountQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type AccountQuery = { __typename?: 'Query', account: { __typename?: 'Account', id: string, name?: string | null, type: string, portfolioId: string, provider: AccountProvider, externalId?: string | null, key?: string | null, description?: string | null, institution?: AccountInstitution | null, mode?: AccountMode | null, status: AccountStatus, optionLevel?: OptionLevel | null, cashForOpenOrders?: string | null, balanceMoneyMarket?: string | null, cashAvailableForInvestment?: string | null, accountValueTotal?: string | null, marketValueTotal?: string | null, cashNet?: string | null, cashBalance?: string | null, balanceAccount?: string | null, createdAt: any, updatedAt: any, createdBy: { __typename?: 'User', id: string, name?: string | null, email?: string | null, photo?: string | null, stripeCustomerId: string }, _realizedProfitAndLoss: { __typename?: 'RealizedPAndL', id: string, longTerm: string, shortTerm: string, dividend: string, year: number, deferredLoss: string } } };

export type UpdateAccountMutationVariables = Exact<{
  accountUpdateInput: AccountUpdateInput;
  accountWhereUniqueInput: AccountWhereUniqueInput;
}>;


export type UpdateAccountMutation = { __typename?: 'Mutation', updateAccount: { __typename?: 'Account', id: string, name?: string | null, portfolioId: string, description?: string | null } };

export type UpdateAccountRealizedPAndLMutationVariables = Exact<{
  id: Scalars['String']['input'];
  input: RealizedPAndLUpdateInput;
}>;


export type UpdateAccountRealizedPAndLMutation = { __typename?: 'Mutation', updateRealizedPAndL: { __typename?: 'RealizedPAndL', id: string, shortTerm: string, longTerm: string, deferredLoss: string, dividend: string } };

export type AccountTableItemFragment = { __typename?: 'Account', id: string, name?: string | null, type: string, portfolioId: string, provider: AccountProvider, externalId?: string | null, key?: string | null, institution?: AccountInstitution | null, mode?: AccountMode | null, status: AccountStatus, optionLevel?: OptionLevel | null, cashForOpenOrders?: string | null, balanceMoneyMarket?: string | null, cashAvailableForInvestment?: string | null, accountValueTotal?: string | null, cashNet?: string | null, cashBalance?: string | null, balanceAccount?: string | null, createdAt: any, updatedAt: any, authConnectionId?: string | null, createdBy: { __typename?: 'User', id: string, name?: string | null, email?: string | null, photo?: string | null, stripeCustomerId: string } };

export type AccountsQueryVariables = Exact<{
  where?: InputMaybe<AccountWhereInput>;
}>;


export type AccountsQuery = { __typename?: 'Query', accounts: Array<{ __typename?: 'Account', id: string, name?: string | null, type: string, portfolioId: string, provider: AccountProvider, externalId?: string | null, key?: string | null, institution?: AccountInstitution | null, mode?: AccountMode | null, status: AccountStatus, optionLevel?: OptionLevel | null, cashForOpenOrders?: string | null, balanceMoneyMarket?: string | null, cashAvailableForInvestment?: string | null, accountValueTotal?: string | null, cashNet?: string | null, cashBalance?: string | null, balanceAccount?: string | null, createdAt: any, updatedAt: any, authConnectionId?: string | null, positions?: Array<{ __typename?: 'Position', id: string, gainTotal?: string | null }> | null, createdBy: { __typename?: 'User', id: string, name?: string | null, email?: string | null, photo?: string | null, stripeCustomerId: string } }> };

export type CreateAccountForPortfolioMutationVariables = Exact<{
  accountCreateInput: AccountCreateInput;
}>;


export type CreateAccountForPortfolioMutation = { __typename?: 'Mutation', createAccountForPortfolio: { __typename?: 'Account', id: string, name?: string | null, type: string, portfolioId: string, provider: AccountProvider, externalId?: string | null, key?: string | null, institution?: AccountInstitution | null, mode?: AccountMode | null, status: AccountStatus, optionLevel?: OptionLevel | null, cashForOpenOrders?: string | null, balanceMoneyMarket?: string | null, cashAvailableForInvestment?: string | null, accountValueTotal?: string | null, cashNet?: string | null, cashBalance?: string | null, balanceAccount?: string | null, createdAt: any, updatedAt: any, authConnectionId?: string | null, createdBy: { __typename?: 'User', id: string, name?: string | null, email?: string | null, photo?: string | null, stripeCustomerId: string } } };

export type SyncAccountMutationVariables = Exact<{
  authConnectionId: Scalars['String']['input'];
}>;


export type SyncAccountMutation = { __typename?: 'Mutation', syncAuthConnection: { __typename?: 'AuthConnectionExt', id: string } };

export type UpdateAllAssetPricesMutationVariables = Exact<{ [key: string]: never; }>;


export type UpdateAllAssetPricesMutation = { __typename?: 'Mutation', updateAllAssetPrices: string };

export type SendWashSaleNotificationsForDateMutationVariables = Exact<{
  date: Scalars['DateTime']['input'];
}>;


export type SendWashSaleNotificationsForDateMutation = { __typename?: 'Mutation', sendWashSaleNotificationsForDate: boolean };

export type SendNotificationsByFrequencyMutationVariables = Exact<{
  frequency: HarvestNotificationFrequency;
}>;


export type SendNotificationsByFrequencyMutation = { __typename?: 'Mutation', sendNotificationsByFrequency: boolean };

export type LogFragment = { __typename?: 'Log', id: string, createdAt: any, description?: string | null, responseStatus?: number | null, source?: AuthSource | null, type: LogType };

export type LogsQueryVariables = Exact<{
  pagination?: InputMaybe<PaginationProps>;
}>;


export type LogsQuery = { __typename?: 'Query', logsCount: number, logs: Array<{ __typename?: 'Log', id: string, createdAt: any, description?: string | null, responseStatus?: number | null, source?: AuthSource | null, type: LogType }> };

export type LogDetailsFragment = { __typename?: 'Log', id: string, createdAt: any, description?: string | null, responseStatus?: number | null, source?: AuthSource | null, type: LogType, data: any };

export type LogQueryVariables = Exact<{
  logId: Scalars['Int']['input'];
}>;


export type LogQuery = { __typename?: 'Query', log?: { __typename?: 'Log', id: string, createdAt: any, description?: string | null, responseStatus?: number | null, source?: AuthSource | null, type: LogType, data: any } | null };

export type LotTransactionBatchFragment = { __typename?: 'LotTransactionBatch', id: string, createdAt: any, updatedAt: any, authConnectionId: string };

export type LotTransactionBatchesQueryVariables = Exact<{ [key: string]: never; }>;


export type LotTransactionBatchesQuery = { __typename?: 'Query', lotTransactionBatches: Array<{ __typename?: 'LotTransactionBatch', id: string, createdAt: any, updatedAt: any, authConnectionId: string }> };

export type LotTransactionBatchDetailsFragment = { __typename?: 'LotTransactionBatch', id: string, createdAt: any, updatedAt: any, authConnectionId: string, positionsBefore?: any | null, positionsAfter?: any | null, holdingsPayload?: any | null, lotTupleMap?: any | null, initialLots?: any | null, newTransactions?: any | null, newBuys?: any | null, newSells?: any | null, lotChangeLog?: Array<{ __typename?: 'LotChangeLog', id: string, createdAt: any, lotId?: string | null, accountId: string, portfolioId: string, lotBefore?: any | null, lotAfter?: any | null, operationType: OperationType, source?: string | null, processed: boolean, quantityChange?: string | null, lotTransactionBatchId: string, lot?: { __typename?: 'Lot', id: string, remainingQty: string, price: string, acquiredDate: any, assetSymbol: string, account: { __typename?: 'Account', id: string, name?: string | null } } | null }> | null };

export type LotTransactionBatchQueryVariables = Exact<{
  lotTransactionBatchId: Scalars['String']['input'];
}>;


export type LotTransactionBatchQuery = { __typename?: 'Query', lotTransactionBatch?: { __typename?: 'LotTransactionBatch', id: string, createdAt: any, updatedAt: any, authConnectionId: string, positionsBefore?: any | null, positionsAfter?: any | null, holdingsPayload?: any | null, lotTupleMap?: any | null, initialLots?: any | null, newTransactions?: any | null, newBuys?: any | null, newSells?: any | null, lotChangeLog?: Array<{ __typename?: 'LotChangeLog', id: string, createdAt: any, lotId?: string | null, accountId: string, portfolioId: string, lotBefore?: any | null, lotAfter?: any | null, operationType: OperationType, source?: string | null, processed: boolean, quantityChange?: string | null, lotTransactionBatchId: string, lot?: { __typename?: 'Lot', id: string, remainingQty: string, price: string, acquiredDate: any, assetSymbol: string, account: { __typename?: 'Account', id: string, name?: string | null } } | null }> | null } | null };

export type HarvestTableItemFragment = { __typename?: 'Harvest', id: string, date: any, type: HarvestType, step: HarvestStep, createdAt: any, amount: string, label: string, afterWashRevertDate: any, notify: boolean, recommendationExpiresDate: any, createdBy: { __typename?: 'User', id: string, name?: string | null, email?: string | null, photo?: string | null, stripeCustomerId: string } };

export type HarvestsQueryVariables = Exact<{
  where?: InputMaybe<HarvestWhereInput>;
}>;


export type HarvestsQuery = { __typename?: 'Query', harvests: Array<{ __typename?: 'Harvest', id: string, date: any, type: HarvestType, step: HarvestStep, createdAt: any, amount: string, label: string, afterWashRevertDate: any, notify: boolean, recommendationExpiresDate: any, createdBy: { __typename?: 'User', id: string, name?: string | null, email?: string | null, photo?: string | null, stripeCustomerId: string } }> };

export type HarvestTransactionItemTableItemFragment = { __typename?: 'HarvestTransactionItem', id: string, orderType: OrderType, assetSymbol: string, quantity: string, price: string, lotId?: string | null, completedDate?: any | null, lotAcquiredDate: any, lotPricePaid: string, lotPriceAtHarvest: string };

export type HarvestTransactionTableItemFragment = { __typename?: 'HarvestTransaction', id: string, revert: boolean, counterTransaction: boolean, harvestTransactionItem: { __typename?: 'HarvestTransactionItem', id: string, orderType: OrderType, assetSymbol: string, quantity: string, price: string, lotId?: string | null, completedDate?: any | null, lotAcquiredDate: any, lotPricePaid: string, lotPriceAtHarvest: string }, replacementTransactionItem?: { __typename?: 'HarvestTransactionItem', id: string, orderType: OrderType, assetSymbol: string, quantity: string, price: string, lotId?: string | null, completedDate?: any | null, lotAcquiredDate: any, lotPricePaid: string, lotPriceAtHarvest: string } | null, revertHarvestTransactionItem?: { __typename?: 'HarvestTransactionItem', id: string, orderType: OrderType, assetSymbol: string, quantity: string, price: string, lotId?: string | null, completedDate?: any | null, lotAcquiredDate: any, lotPricePaid: string, lotPriceAtHarvest: string } | null, revertReplacementTransactionItem?: { __typename?: 'HarvestTransactionItem', id: string, orderType: OrderType, assetSymbol: string, quantity: string, price: string, lotId?: string | null, completedDate?: any | null, lotAcquiredDate: any, lotPricePaid: string, lotPriceAtHarvest: string } | null };

export type HarvestsAndTransactionsQueryVariables = Exact<{
  where?: InputMaybe<HarvestWhereInput>;
}>;


export type HarvestsAndTransactionsQuery = { __typename?: 'Query', harvests: Array<{ __typename?: 'Harvest', id: string, date: any, type: HarvestType, step: HarvestStep, createdAt: any, amount: string, label: string, afterWashRevertDate: any, notify: boolean, recommendationExpiresDate: any, harvestTransactions?: Array<{ __typename?: 'HarvestTransaction', id: string, revert: boolean, counterTransaction: boolean, harvestTransactionItem: { __typename?: 'HarvestTransactionItem', id: string, orderType: OrderType, assetSymbol: string, quantity: string, price: string, lotId?: string | null, completedDate?: any | null, lotAcquiredDate: any, lotPricePaid: string, lotPriceAtHarvest: string }, replacementTransactionItem?: { __typename?: 'HarvestTransactionItem', id: string, orderType: OrderType, assetSymbol: string, quantity: string, price: string, lotId?: string | null, completedDate?: any | null, lotAcquiredDate: any, lotPricePaid: string, lotPriceAtHarvest: string } | null, revertHarvestTransactionItem?: { __typename?: 'HarvestTransactionItem', id: string, orderType: OrderType, assetSymbol: string, quantity: string, price: string, lotId?: string | null, completedDate?: any | null, lotAcquiredDate: any, lotPricePaid: string, lotPriceAtHarvest: string } | null, revertReplacementTransactionItem?: { __typename?: 'HarvestTransactionItem', id: string, orderType: OrderType, assetSymbol: string, quantity: string, price: string, lotId?: string | null, completedDate?: any | null, lotAcquiredDate: any, lotPricePaid: string, lotPriceAtHarvest: string } | null }> | null, createdBy: { __typename?: 'User', id: string, name?: string | null, email?: string | null, photo?: string | null, stripeCustomerId: string } }> };

export type HarvestSingleItemFragment = { __typename?: 'Harvest', id: string, date: any, type: HarvestType, step: HarvestStep, createdAt: any, amount: string, label: string, afterWashRevertDate: any, notify: boolean, recommendationExpiresDate: any, harvestTransactions?: Array<{ __typename?: 'HarvestTransaction', id: string, revert: boolean, counterTransaction: boolean, harvestTransactionItem: { __typename?: 'HarvestTransactionItem', id: string, orderType: OrderType, assetSymbol: string, quantity: string, price: string, lotId?: string | null, completedDate?: any | null, lotAcquiredDate: any, lotPricePaid: string, lotPriceAtHarvest: string }, replacementTransactionItem?: { __typename?: 'HarvestTransactionItem', id: string, orderType: OrderType, assetSymbol: string, quantity: string, price: string, lotId?: string | null, completedDate?: any | null, lotAcquiredDate: any, lotPricePaid: string, lotPriceAtHarvest: string } | null, revertHarvestTransactionItem?: { __typename?: 'HarvestTransactionItem', id: string, orderType: OrderType, assetSymbol: string, quantity: string, price: string, lotId?: string | null, completedDate?: any | null, lotAcquiredDate: any, lotPricePaid: string, lotPriceAtHarvest: string } | null, revertReplacementTransactionItem?: { __typename?: 'HarvestTransactionItem', id: string, orderType: OrderType, assetSymbol: string, quantity: string, price: string, lotId?: string | null, completedDate?: any | null, lotAcquiredDate: any, lotPricePaid: string, lotPriceAtHarvest: string } | null }> | null, createdBy: { __typename?: 'User', id: string, name?: string | null, email?: string | null, photo?: string | null, stripeCustomerId: string } };

export type HarvestSingleQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type HarvestSingleQuery = { __typename?: 'Query', harvest: { __typename?: 'Harvest', id: string, date: any, type: HarvestType, step: HarvestStep, createdAt: any, amount: string, label: string, afterWashRevertDate: any, notify: boolean, recommendationExpiresDate: any, harvestTransactions?: Array<{ __typename?: 'HarvestTransaction', id: string, revert: boolean, counterTransaction: boolean, harvestTransactionItem: { __typename?: 'HarvestTransactionItem', id: string, orderType: OrderType, assetSymbol: string, quantity: string, price: string, lotId?: string | null, completedDate?: any | null, lotAcquiredDate: any, lotPricePaid: string, lotPriceAtHarvest: string }, replacementTransactionItem?: { __typename?: 'HarvestTransactionItem', id: string, orderType: OrderType, assetSymbol: string, quantity: string, price: string, lotId?: string | null, completedDate?: any | null, lotAcquiredDate: any, lotPricePaid: string, lotPriceAtHarvest: string } | null, revertHarvestTransactionItem?: { __typename?: 'HarvestTransactionItem', id: string, orderType: OrderType, assetSymbol: string, quantity: string, price: string, lotId?: string | null, completedDate?: any | null, lotAcquiredDate: any, lotPricePaid: string, lotPriceAtHarvest: string } | null, revertReplacementTransactionItem?: { __typename?: 'HarvestTransactionItem', id: string, orderType: OrderType, assetSymbol: string, quantity: string, price: string, lotId?: string | null, completedDate?: any | null, lotAcquiredDate: any, lotPricePaid: string, lotPriceAtHarvest: string } | null }> | null, createdBy: { __typename?: 'User', id: string, name?: string | null, email?: string | null, photo?: string | null, stripeCustomerId: string } } };

export type UpdateHarvestSingleMutationVariables = Exact<{
  id: Scalars['String']['input'];
  data: HarvestUpdateInput;
}>;


export type UpdateHarvestSingleMutation = { __typename?: 'Mutation', updateHarvest: { __typename?: 'Harvest', id: string, date: any, type: HarvestType, step: HarvestStep, createdAt: any, amount: string, label: string, afterWashRevertDate: any, notify: boolean, recommendationExpiresDate: any, harvestTransactions?: Array<{ __typename?: 'HarvestTransaction', id: string, revert: boolean, counterTransaction: boolean, harvestTransactionItem: { __typename?: 'HarvestTransactionItem', id: string, orderType: OrderType, assetSymbol: string, quantity: string, price: string, lotId?: string | null, completedDate?: any | null, lotAcquiredDate: any, lotPricePaid: string, lotPriceAtHarvest: string }, replacementTransactionItem?: { __typename?: 'HarvestTransactionItem', id: string, orderType: OrderType, assetSymbol: string, quantity: string, price: string, lotId?: string | null, completedDate?: any | null, lotAcquiredDate: any, lotPricePaid: string, lotPriceAtHarvest: string } | null, revertHarvestTransactionItem?: { __typename?: 'HarvestTransactionItem', id: string, orderType: OrderType, assetSymbol: string, quantity: string, price: string, lotId?: string | null, completedDate?: any | null, lotAcquiredDate: any, lotPricePaid: string, lotPriceAtHarvest: string } | null, revertReplacementTransactionItem?: { __typename?: 'HarvestTransactionItem', id: string, orderType: OrderType, assetSymbol: string, quantity: string, price: string, lotId?: string | null, completedDate?: any | null, lotAcquiredDate: any, lotPricePaid: string, lotPriceAtHarvest: string } | null }> | null, createdBy: { __typename?: 'User', id: string, name?: string | null, email?: string | null, photo?: string | null, stripeCustomerId: string } } };

export type AccountSummaryFragment = { __typename?: 'Account', id: string, uploadedPositions: boolean, setRealizedValues: boolean, name?: string | null, type: string, subType?: string | null, accountValueTotal?: string | null, skipSetup: boolean };

export type PortfolioSummaryQueryVariables = Exact<{ [key: string]: never; }>;


export type PortfolioSummaryQuery = { __typename?: 'Query', portfolioSummary: { __typename?: 'PortfolioSummary', setUpStatus: SetUpStatus, realized: { __typename?: 'PortfolioSummaryRealized', accountCount: number, dividend: number, gainLongTerm: number, gainShortTerm: number, gainTotal: number }, unrealized: { __typename?: 'PortfolioSummaryUnrealized', gainTotal: number, lossTotal: number, accountCount: number, positionCount: number }, harvest: { __typename?: 'HarvestPotential', realized: number, unrealized: number, total: number } } };

export type AccountSummariesQueryVariables = Exact<{ [key: string]: never; }>;


export type AccountSummariesQuery = { __typename?: 'Query', accounts: Array<{ __typename?: 'Account', id: string, uploadedPositions: boolean, setRealizedValues: boolean, name?: string | null, type: string, subType?: string | null, accountValueTotal?: string | null, skipSetup: boolean }> };

export type AccountRealizedPlQueryVariables = Exact<{ [key: string]: never; }>;


export type AccountRealizedPlQuery = { __typename?: 'Query', accounts: Array<{ __typename?: 'Account', id: string, name?: string | null, realizedPAndL?: Array<{ __typename?: 'RealizedPAndL', id: string, year: number, shortTerm: string, longTerm: string, dividend: string, deferredLoss: string, updatedAt: any }> | null }> };

export type InviteUsersToPlatformMutationVariables = Exact<{
  emails: Array<Scalars['String']['input']> | Scalars['String']['input'];
}>;


export type InviteUsersToPlatformMutation = { __typename?: 'Mutation', inviteUsersToPlatform: boolean };

export type AddUserToPortfolioMutationVariables = Exact<{
  email: Scalars['String']['input'];
}>;


export type AddUserToPortfolioMutation = { __typename?: 'Mutation', addUserToPortfolio: boolean };

export type RemoveUserFromPortfolioMutationVariables = Exact<{
  userId: Scalars['String']['input'];
}>;


export type RemoveUserFromPortfolioMutation = { __typename?: 'Mutation', removeUserFromPortfolio: boolean };

export type UsersOnPortfolioQueryVariables = Exact<{ [key: string]: never; }>;


export type UsersOnPortfolioQuery = { __typename?: 'Query', usersOnPortfolio: Array<{ __typename?: 'User', id: string, name?: string | null, email?: string | null }> };

export type PortfolioTableItemFragment = { __typename?: 'Portfolio', createdById: string, id: string, name: string, endOfYearTaxOpportunityNotification: boolean, notificationFrequency: HarvestNotificationFrequency, createdAt: any, createdBy: { __typename?: 'User', name?: string | null, id: string, photo?: string | null, email?: string | null }, accounts?: Array<{ __typename?: 'Account', id: string, status: AccountStatus, name?: string | null, institution?: AccountInstitution | null }> | null, usersOnPortfolios?: Array<{ __typename?: 'UsersOnPortfolios', role: PortfolioRole, user: { __typename?: 'User', name?: string | null, id: string, photo?: string | null, email?: string | null } }> | null };

export type PortfolioTableQueryVariables = Exact<{ [key: string]: never; }>;


export type PortfolioTableQuery = { __typename?: 'Query', portfolios: Array<{ __typename?: 'Portfolio', id: string, createdById: string, name: string, endOfYearTaxOpportunityNotification: boolean, notificationFrequency: HarvestNotificationFrequency, createdAt: any, createdBy: { __typename?: 'User', name?: string | null, id: string, photo?: string | null, email?: string | null }, accounts?: Array<{ __typename?: 'Account', id: string, status: AccountStatus, name?: string | null, institution?: AccountInstitution | null }> | null, usersOnPortfolios?: Array<{ __typename?: 'UsersOnPortfolios', role: PortfolioRole, user: { __typename?: 'User', name?: string | null, id: string, photo?: string | null, email?: string | null } }> | null }> };

export type UpdatePortfolioMutationVariables = Exact<{
  data: PortfolioUpdateInput;
}>;


export type UpdatePortfolioMutation = { __typename?: 'Mutation', updatePortfolio: { __typename?: 'Portfolio', harvestShareDollarThreshold: string, harvestTickerBucketDollarSizeLong: string, harvestTickerBucketDollarSizeShort: string, harvestTickerBucketLowerLimitLong: string, harvestTickerBucketLowerLimitShort: string, minimumLotPAndL: string, id: string, name: string, harvestCycleWeeks: number, createdAt: any, createdById: string, endOfYearTaxOpportunityNotification: boolean, notificationFrequency: HarvestNotificationFrequency, accounts?: Array<{ __typename?: 'Account', name?: string | null, id: string }> | null, usersOnPortfolios?: Array<{ __typename?: 'UsersOnPortfolios', role: PortfolioRole, user: { __typename?: 'User', id: string, name?: string | null, email?: string | null, photo?: string | null } }> | null } };

export type PortfolioNotificationSettingsQueryVariables = Exact<{ [key: string]: never; }>;


export type PortfolioNotificationSettingsQuery = { __typename?: 'Query', portfolioAuthed: { __typename?: 'Portfolio', id: string, notificationFrequency: HarvestNotificationFrequency, endOfYearTaxOpportunityNotification: boolean } };

export type StripeSessionQueryVariables = Exact<{
  stripePriceId: Scalars['String']['input'];
  stripeCustomerId: Scalars['String']['input'];
}>;


export type StripeSessionQuery = { __typename?: 'Query', stripeSession: { __typename?: 'StripeSession', id: string, client_secret?: string | null } };

export type FiniteHarvestLotItemFragment = { __typename?: 'LotCurrent', id: string, accountId: string, remainingQty: string, acquiredDate: any, price: string, symbol: string, lastPrice: string, costBasis: string, value: string, gainTotal: string, gainTotalPct: string, dollarPerSharePnL: string, taxGain: TaxGain, currentHarvestQty: string, availableQty: string };

export type HarvestLotItemFragment = { __typename?: 'HarvestLotCurrent', id: string, accountId: string, remainingQty: string, acquiredDate: any, price: string, symbol: string, lastPrice: string, costBasis: string, value: string, gainTotal: string, gainTotalPct: string, dollarPerSharePnL: string, taxGain: TaxGain, currentHarvestQty: string, harvestQuantity: string, harvestPAndL: number, availableQty: string };

export type MatchedLotOrderItemFragment = { __typename?: 'HarvestLotOrder', accountId: string, costBasis: string, gainTotal: string, id: string, lotId: string, pricePaid: string, quantity: string, taxGain: TaxGain, assetSymbol: string, dollarPerSharePnL: string, valueTotal: string, orderType: OrderType, acquiredDate: any, lastPrice: string };

export type UnrealizedHarvestItemFragment = { __typename?: 'UnrealizedHarvestMatchResult', sourceLot: { __typename?: 'LotCurrent', id: string, accountId: string, remainingQty: string, acquiredDate: any, price: string, symbol: string, lastPrice: string, costBasis: string, value: string, gainTotal: string, gainTotalPct: string, dollarPerSharePnL: string, taxGain: TaxGain, currentHarvestQty: string, availableQty: string }, matchedLotOrders: Array<{ __typename?: 'HarvestLotOrder', id: string, accountId: string, costBasis: string, gainTotal: string, lotId: string, pricePaid: string, quantity: string, taxGain: TaxGain, assetSymbol: string, dollarPerSharePnL: string, valueTotal: string, orderType: OrderType, acquiredDate: any, lastPrice: string }> };

export type FiniteHarvestQueryVariables = Exact<{ [key: string]: never; }>;


export type FiniteHarvestQuery = { __typename?: 'Query', finiteHarvest: { __typename?: 'FiniteHarvestResult', harvestType: HarvestType, totalHarvestLots: number, summary: { __typename?: 'PortfolioSummary', realized: { __typename?: 'PortfolioSummaryRealized', gainTotal: number }, unrealized: { __typename?: 'PortfolioSummaryUnrealized', gainTotal: number, lossTotal: number, total: number }, includingCurrentHarvest: { __typename?: 'PortfolioSummaryIncludingHarvest', realized: { __typename?: 'PortfolioSummaryRealized', gainTotal: number }, unrealized: { __typename?: 'PortfolioSummaryUnrealized', gainTotal: number, lossTotal: number } } }, lotsCurrent?: Array<{ __typename?: 'LotCurrent', id: string, accountId: string, remainingQty: string, acquiredDate: any, price: string, symbol: string, lastPrice: string, costBasis: string, value: string, gainTotal: string, gainTotalPct: string, dollarPerSharePnL: string, taxGain: TaxGain, currentHarvestQty: string, availableQty: string }> | null, unrealizedHarvestMatchResults?: Array<{ __typename?: 'UnrealizedHarvestMatchResult', sourceLot: { __typename?: 'LotCurrent', id: string, accountId: string, remainingQty: string, acquiredDate: any, price: string, symbol: string, lastPrice: string, costBasis: string, value: string, gainTotal: string, gainTotalPct: string, dollarPerSharePnL: string, taxGain: TaxGain, currentHarvestQty: string, availableQty: string }, matchedLotOrders: Array<{ __typename?: 'HarvestLotOrder', id: string, accountId: string, costBasis: string, gainTotal: string, lotId: string, pricePaid: string, quantity: string, taxGain: TaxGain, assetSymbol: string, dollarPerSharePnL: string, valueTotal: string, orderType: OrderType, acquiredDate: any, lastPrice: string }> }> | null } };

export type DeleteHarvestsMutationVariables = Exact<{
  ids: Array<Scalars['String']['input']> | Scalars['String']['input'];
}>;


export type DeleteHarvestsMutation = { __typename?: 'Mutation', deleteHarvests: boolean };

export type HarvestEvalResultFragmentFragment = { __typename?: 'HarvestEvalResult', harvestType: HarvestType, totalHarvestLots: number, uniqueAssetSymbols: Array<string>, summary: { __typename?: 'PortfolioSummary', realized: { __typename?: 'PortfolioSummaryRealized', gainTotal: number }, unrealized: { __typename?: 'PortfolioSummaryUnrealized', gainTotal: number, lossTotal: number, total: number }, includingCurrentHarvest: { __typename?: 'PortfolioSummaryIncludingHarvest', realized: { __typename?: 'PortfolioSummaryRealized', gainTotal: number }, unrealized: { __typename?: 'PortfolioSummaryUnrealized', gainTotal: number, lossTotal: number } } }, lotsCurrent?: Array<{ __typename?: 'LotCurrent', id: string, accountId: string, remainingQty: string, acquiredDate: any, price: string, symbol: string, lastPrice: string, costBasis: string, value: string, gainTotal: string, gainTotalPct: string, dollarPerSharePnL: string, taxGain: TaxGain, currentHarvestQty: string, availableQty: string }> | null, matchedItems?: Array<{ __typename?: 'HarvestMatchItem', id: string, pairs: Array<{ __typename?: 'HarvestMatchPair', sourceHarvestPAndL: number, matchedHarvestPAndL: number, sourceLots: Array<{ __typename?: 'HarvestLotCurrent', id: string, accountId: string, remainingQty: string, acquiredDate: any, price: string, symbol: string, lastPrice: string, costBasis: string, value: string, gainTotal: string, gainTotalPct: string, dollarPerSharePnL: string, taxGain: TaxGain, currentHarvestQty: string, harvestQuantity: string, harvestPAndL: number, availableQty: string }>, matchedLots: Array<{ __typename?: 'HarvestLotCurrent', id: string, accountId: string, remainingQty: string, acquiredDate: any, price: string, symbol: string, lastPrice: string, costBasis: string, value: string, gainTotal: string, gainTotalPct: string, dollarPerSharePnL: string, taxGain: TaxGain, currentHarvestQty: string, harvestQuantity: string, harvestPAndL: number, availableQty: string }> }> }> | null };

export type HarvestEvalResultQueryVariables = Exact<{
  filters?: InputMaybe<HarvestEvalFilters>;
}>;


export type HarvestEvalResultQuery = { __typename?: 'Query', harvestEvalResult: { __typename?: 'HarvestEvalResult', harvestType: HarvestType, totalHarvestLots: number, uniqueAssetSymbols: Array<string>, summary: { __typename?: 'PortfolioSummary', realized: { __typename?: 'PortfolioSummaryRealized', gainTotal: number }, unrealized: { __typename?: 'PortfolioSummaryUnrealized', gainTotal: number, lossTotal: number, total: number }, includingCurrentHarvest: { __typename?: 'PortfolioSummaryIncludingHarvest', realized: { __typename?: 'PortfolioSummaryRealized', gainTotal: number }, unrealized: { __typename?: 'PortfolioSummaryUnrealized', gainTotal: number, lossTotal: number } } }, lotsCurrent?: Array<{ __typename?: 'LotCurrent', id: string, accountId: string, remainingQty: string, acquiredDate: any, price: string, symbol: string, lastPrice: string, costBasis: string, value: string, gainTotal: string, gainTotalPct: string, dollarPerSharePnL: string, taxGain: TaxGain, currentHarvestQty: string, availableQty: string }> | null, matchedItems?: Array<{ __typename?: 'HarvestMatchItem', id: string, pairs: Array<{ __typename?: 'HarvestMatchPair', sourceHarvestPAndL: number, matchedHarvestPAndL: number, sourceLots: Array<{ __typename?: 'HarvestLotCurrent', id: string, accountId: string, remainingQty: string, acquiredDate: any, price: string, symbol: string, lastPrice: string, costBasis: string, value: string, gainTotal: string, gainTotalPct: string, dollarPerSharePnL: string, taxGain: TaxGain, currentHarvestQty: string, harvestQuantity: string, harvestPAndL: number, availableQty: string }>, matchedLots: Array<{ __typename?: 'HarvestLotCurrent', id: string, accountId: string, remainingQty: string, acquiredDate: any, price: string, symbol: string, lastPrice: string, costBasis: string, value: string, gainTotal: string, gainTotalPct: string, dollarPerSharePnL: string, taxGain: TaxGain, currentHarvestQty: string, harvestQuantity: string, harvestPAndL: number, availableQty: string }> }> }> | null } };

export type AccountTransactionItemFragment = { __typename?: 'Account', id: string, name?: string | null, authConnection?: { __typename?: 'AuthConnection', id: string, source: AuthSource } | null };

export type TransactionTableItemFragment = { __typename?: 'Transaction', id: string, quantity?: string | null, type?: string | null, description?: string | null, assetSymbol: string, settlementDate?: any | null, securityType?: string | null, displaySymbol?: string | null, amount?: string | null, externalId: string, fee?: string | null, memo?: string | null, price?: string | null, subtype?: string | null, transactionDate?: any | null, appliedToLots: boolean, account: { __typename?: 'Account', id: string, name?: string | null, authConnection?: { __typename?: 'AuthConnection', id: string, source: AuthSource } | null } };

export type TransactionsQueryVariables = Exact<{
  where?: InputMaybe<TransactionWhereInput>;
}>;


export type TransactionsQuery = { __typename?: 'Query', transactions: Array<{ __typename?: 'Transaction', id: string, quantity?: string | null, type?: string | null, description?: string | null, assetSymbol: string, settlementDate?: any | null, securityType?: string | null, displaySymbol?: string | null, amount?: string | null, externalId: string, fee?: string | null, memo?: string | null, price?: string | null, subtype?: string | null, transactionDate?: any | null, appliedToLots: boolean, account: { __typename?: 'Account', id: string, name?: string | null, authConnection?: { __typename?: 'AuthConnection', id: string, source: AuthSource } | null } }> };

export type UserItemFragment = { __typename?: 'User', id: string, name?: string | null, email?: string | null, photo?: string | null, stripeCustomerId: string };

export type UserQueryVariables = Exact<{ [key: string]: never; }>;


export type UserQuery = { __typename?: 'Query', userCurrent: { __typename?: 'User', id: string, name?: string | null, email?: string | null, photo?: string | null, stripeCustomerId: string } };

export type VerificationEtradeQueryVariables = Exact<{
  portfolioId: Scalars['String']['input'];
}>;


export type VerificationEtradeQuery = { __typename?: 'Query', requestOauthConnection: { __typename?: 'AuthConnectionExt', id: string, verificationUrl?: string | null } };

export type OauthEtradeMutationVariables = Exact<{
  verifier: Scalars['String']['input'];
  portfolioId: Scalars['String']['input'];
}>;


export type OauthEtradeMutation = { __typename?: 'Mutation', accessOauthConnection: { __typename?: 'AuthConnectionExt', id: string } };

export type PlaidLinkTokenQueryVariables = Exact<{ [key: string]: never; }>;


export type PlaidLinkTokenQuery = { __typename?: 'Query', linkToken: string };

export type PlaidSetAccessTokenAndSyncAccountsMutationVariables = Exact<{
  publicToken: Scalars['String']['input'];
  metaData: PlaidLinkOnSuccessMetadata;
}>;


export type PlaidSetAccessTokenAndSyncAccountsMutation = { __typename?: 'Mutation', setAccessTokenAndSyncAccounts: Array<{ __typename?: 'Account', id: string }> };

export type PlaidSyncMutationVariables = Exact<{
  authConnectionId: Scalars['String']['input'];
}>;


export type PlaidSyncMutation = { __typename?: 'Mutation', syncAuthConnection: { __typename?: 'AuthConnectionExt', id: string } };

export type SignedUrlsForUploadQueryVariables = Exact<{
  files: Array<GcpUploadFile> | GcpUploadFile;
}>;


export type SignedUrlsForUploadQuery = { __typename?: 'Query', generateSignedUrlsForUpload: { __typename?: 'SignedUrlsForUploadPayload', uploadUrls: Array<string> } };

export type SignedUrlsForDownloadQueryVariables = Exact<{
  gcpFileNames: Array<Scalars['String']['input']> | Scalars['String']['input'];
}>;


export type SignedUrlsForDownloadQuery = { __typename?: 'Query', genrerateSignedUrlsForDownload: { __typename?: 'SignedUrlsForDownloadPayload', downloadUrls: Array<string> } };

export type FileItemFragment = { __typename?: 'File', id: string, accountId: string, displayName: string, gcpFilename: string, type: string };

export type CreateFilesMutationVariables = Exact<{
  data: Array<FileCreateManyInput> | FileCreateManyInput;
}>;


export type CreateFilesMutation = { __typename?: 'Mutation', createFiles: Array<{ __typename?: 'File', id: string, accountId: string, displayName: string, gcpFilename: string, type: string }> };

export type InitAccountFileUploadMutationVariables = Exact<{
  fileData: Array<InitFileUploadPayload> | InitFileUploadPayload;
  accountData: InitAccountFileUploadPayload;
}>;


export type InitAccountFileUploadMutation = { __typename?: 'Mutation', initAccountFileUpload: Array<{ __typename?: 'File', id: string, accountId: string, displayName: string, gcpFilename: string, type: string }> };

export type HarvestLotOrderItemFragment = { __typename?: 'HarvestLotOrder', accountId: string, costBasis: string, gainTotal: string, id: string, lotId: string, pricePaid: string, quantity: string, taxGain: TaxGain, assetSymbol: string, dollarPerSharePnL: string, valueTotal: string, orderType: OrderType, acquiredDate: any };

export type LotCurrentItemFragment = { __typename?: 'LotCurrent', id: string, accountId: string, remainingQty: string, acquiredDate: any, price: string, symbol: string, lastPrice: string, costBasis: string, value: string, gainTotal: string, gainTotalPct: string, dollarPerSharePnL: string, taxGain: TaxGain };

export type LotsCurrentForLotTypeQueryVariables = Exact<{
  lotValueType: LotValueType;
}>;


export type LotsCurrentForLotTypeQuery = { __typename?: 'Query', lotCurrent: Array<{ __typename?: 'LotCurrent', id: string, accountId: string, remainingQty: string, acquiredDate: any, price: string, symbol: string, lastPrice: string, costBasis: string, value: string, gainTotal: string, gainTotalPct: string, dollarPerSharePnL: string, taxGain: TaxGain }> };

export type DirectedHarvestQueryVariables = Exact<{
  targetRealized: Scalars['Float']['input'];
  targetUnrealized: Scalars['Float']['input'];
  lots: Array<DirectedHarvestLot> | DirectedHarvestLot;
}>;


export type DirectedHarvestQuery = { __typename?: 'Query', directedHarvest: { __typename?: 'HarvestResult', realizedOrders: Array<{ __typename?: 'HarvestLotOrder', id: string, accountId: string, costBasis: string, gainTotal: string, lotId: string, pricePaid: string, quantity: string, taxGain: TaxGain, assetSymbol: string, dollarPerSharePnL: string, valueTotal: string, orderType: OrderType, acquiredDate: any }>, unrealizedOrders: Array<{ __typename?: 'HarvestLotOrder', id: string, accountId: string, costBasis: string, gainTotal: string, lotId: string, pricePaid: string, quantity: string, taxGain: TaxGain, assetSymbol: string, dollarPerSharePnL: string, valueTotal: string, orderType: OrderType, acquiredDate: any }>, allOrders: Array<{ __typename?: 'HarvestLotOrder', id: string, accountId: string, costBasis: string, gainTotal: string, lotId: string, pricePaid: string, quantity: string, taxGain: TaxGain, assetSymbol: string, dollarPerSharePnL: string, valueTotal: string, orderType: OrderType, acquiredDate: any }> } };

export type HarvestTransactionItemRecordFragment = { __typename?: 'HarvestTransactionItem', id: string, quantity: string, completedDate?: any | null, orderType: OrderType, lotSold?: { __typename?: 'Lot', id: string, acquiredDate: any } | null, asset: { __typename?: 'Asset', lastPrice: string, symbol: string } };

export type HarvestTransactionRecordFragment = { __typename?: 'HarvestTransaction', id: string, revert: boolean, counterTransaction: boolean, harvestTransactionItem: { __typename?: 'HarvestTransactionItem', id: string, quantity: string, completedDate?: any | null, orderType: OrderType, lotSold?: { __typename?: 'Lot', id: string, acquiredDate: any } | null, asset: { __typename?: 'Asset', lastPrice: string, symbol: string } }, replacementTransactionItem?: { __typename?: 'HarvestTransactionItem', id: string, quantity: string, completedDate?: any | null, orderType: OrderType, lotSold?: { __typename?: 'Lot', id: string, acquiredDate: any } | null, asset: { __typename?: 'Asset', lastPrice: string, symbol: string } } | null, revertHarvestTransactionItem?: { __typename?: 'HarvestTransactionItem', id: string, quantity: string, completedDate?: any | null, orderType: OrderType, lotSold?: { __typename?: 'Lot', id: string, acquiredDate: any } | null, asset: { __typename?: 'Asset', lastPrice: string, symbol: string } } | null, revertReplacementTransactionItem?: { __typename?: 'HarvestTransactionItem', id: string, quantity: string, completedDate?: any | null, orderType: OrderType, lotSold?: { __typename?: 'Lot', id: string, acquiredDate: any } | null, asset: { __typename?: 'Asset', lastPrice: string, symbol: string } } | null };

export type HarvestItemFragment = { __typename?: 'Harvest', id: string, date: any, step: HarvestStep, amount: string, type: HarvestType, label: string, harvestTransactions?: Array<{ __typename?: 'HarvestTransaction', id: string, revert: boolean, counterTransaction: boolean, harvestTransactionItem: { __typename?: 'HarvestTransactionItem', id: string, quantity: string, completedDate?: any | null, orderType: OrderType, lotSold?: { __typename?: 'Lot', id: string, acquiredDate: any } | null, asset: { __typename?: 'Asset', lastPrice: string, symbol: string } }, replacementTransactionItem?: { __typename?: 'HarvestTransactionItem', id: string, quantity: string, completedDate?: any | null, orderType: OrderType, lotSold?: { __typename?: 'Lot', id: string, acquiredDate: any } | null, asset: { __typename?: 'Asset', lastPrice: string, symbol: string } } | null, revertHarvestTransactionItem?: { __typename?: 'HarvestTransactionItem', id: string, quantity: string, completedDate?: any | null, orderType: OrderType, lotSold?: { __typename?: 'Lot', id: string, acquiredDate: any } | null, asset: { __typename?: 'Asset', lastPrice: string, symbol: string } } | null, revertReplacementTransactionItem?: { __typename?: 'HarvestTransactionItem', id: string, quantity: string, completedDate?: any | null, orderType: OrderType, lotSold?: { __typename?: 'Lot', id: string, acquiredDate: any } | null, asset: { __typename?: 'Asset', lastPrice: string, symbol: string } } | null }> | null };

export type CreateHarvestMutationVariables = Exact<{
  directedHarvestLots: Array<DirectedHarvestLot> | DirectedHarvestLot;
  harvestType: HarvestType;
}>;


export type CreateHarvestMutation = { __typename?: 'Mutation', createHarvest: { __typename?: 'Harvest', id: string, date: any, step: HarvestStep, amount: string, type: HarvestType, label: string, harvestTransactions?: Array<{ __typename?: 'HarvestTransaction', id: string, revert: boolean, counterTransaction: boolean, harvestTransactionItem: { __typename?: 'HarvestTransactionItem', id: string, quantity: string, completedDate?: any | null, orderType: OrderType, lotSold?: { __typename?: 'Lot', id: string, acquiredDate: any } | null, asset: { __typename?: 'Asset', lastPrice: string, symbol: string } }, replacementTransactionItem?: { __typename?: 'HarvestTransactionItem', id: string, quantity: string, completedDate?: any | null, orderType: OrderType, lotSold?: { __typename?: 'Lot', id: string, acquiredDate: any } | null, asset: { __typename?: 'Asset', lastPrice: string, symbol: string } } | null, revertHarvestTransactionItem?: { __typename?: 'HarvestTransactionItem', id: string, quantity: string, completedDate?: any | null, orderType: OrderType, lotSold?: { __typename?: 'Lot', id: string, acquiredDate: any } | null, asset: { __typename?: 'Asset', lastPrice: string, symbol: string } } | null, revertReplacementTransactionItem?: { __typename?: 'HarvestTransactionItem', id: string, quantity: string, completedDate?: any | null, orderType: OrderType, lotSold?: { __typename?: 'Lot', id: string, acquiredDate: any } | null, asset: { __typename?: 'Asset', lastPrice: string, symbol: string } } | null }> | null } };

export type UpdateHarvestMutationVariables = Exact<{
  id: Scalars['String']['input'];
  data: HarvestUpdateInput;
}>;


export type UpdateHarvestMutation = { __typename?: 'Mutation', updateHarvest: { __typename?: 'Harvest', id: string, date: any, step: HarvestStep, amount: string, type: HarvestType, label: string, harvestTransactions?: Array<{ __typename?: 'HarvestTransaction', id: string, revert: boolean, counterTransaction: boolean, harvestTransactionItem: { __typename?: 'HarvestTransactionItem', id: string, quantity: string, completedDate?: any | null, orderType: OrderType, lotSold?: { __typename?: 'Lot', id: string, acquiredDate: any } | null, asset: { __typename?: 'Asset', lastPrice: string, symbol: string } }, replacementTransactionItem?: { __typename?: 'HarvestTransactionItem', id: string, quantity: string, completedDate?: any | null, orderType: OrderType, lotSold?: { __typename?: 'Lot', id: string, acquiredDate: any } | null, asset: { __typename?: 'Asset', lastPrice: string, symbol: string } } | null, revertHarvestTransactionItem?: { __typename?: 'HarvestTransactionItem', id: string, quantity: string, completedDate?: any | null, orderType: OrderType, lotSold?: { __typename?: 'Lot', id: string, acquiredDate: any } | null, asset: { __typename?: 'Asset', lastPrice: string, symbol: string } } | null, revertReplacementTransactionItem?: { __typename?: 'HarvestTransactionItem', id: string, quantity: string, completedDate?: any | null, orderType: OrderType, lotSold?: { __typename?: 'Lot', id: string, acquiredDate: any } | null, asset: { __typename?: 'Asset', lastPrice: string, symbol: string } } | null }> | null } };

export type UpdateHarvestTransactionMutationVariables = Exact<{
  id: Scalars['String']['input'];
  data: HarvestTransactionUpdateInput;
}>;


export type UpdateHarvestTransactionMutation = { __typename?: 'Mutation', updateHarvestTransaction: { __typename?: 'HarvestTransaction', id: string, revert: boolean, counterTransaction: boolean, harvestTransactionItem: { __typename?: 'HarvestTransactionItem', id: string, quantity: string, completedDate?: any | null, orderType: OrderType, lotSold?: { __typename?: 'Lot', id: string, acquiredDate: any } | null, asset: { __typename?: 'Asset', lastPrice: string, symbol: string } }, replacementTransactionItem?: { __typename?: 'HarvestTransactionItem', id: string, quantity: string, completedDate?: any | null, orderType: OrderType, lotSold?: { __typename?: 'Lot', id: string, acquiredDate: any } | null, asset: { __typename?: 'Asset', lastPrice: string, symbol: string } } | null, revertHarvestTransactionItem?: { __typename?: 'HarvestTransactionItem', id: string, quantity: string, completedDate?: any | null, orderType: OrderType, lotSold?: { __typename?: 'Lot', id: string, acquiredDate: any } | null, asset: { __typename?: 'Asset', lastPrice: string, symbol: string } } | null, revertReplacementTransactionItem?: { __typename?: 'HarvestTransactionItem', id: string, quantity: string, completedDate?: any | null, orderType: OrderType, lotSold?: { __typename?: 'Lot', id: string, acquiredDate: any } | null, asset: { __typename?: 'Asset', lastPrice: string, symbol: string } } | null } };

export type UpdateHarvestTransactionItemMutationVariables = Exact<{
  id: Scalars['String']['input'];
  data: HarvestTransactionItemUpdateInput;
}>;


export type UpdateHarvestTransactionItemMutation = { __typename?: 'Mutation', updateHarvestTransactionItem: { __typename?: 'HarvestTransactionItem', id: string, quantity: string, completedDate?: any | null, orderType: OrderType, lotSold?: { __typename?: 'Lot', id: string, acquiredDate: any } | null, asset: { __typename?: 'Asset', lastPrice: string, symbol: string } } };

export type HarvestQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type HarvestQuery = { __typename?: 'Query', harvest: { __typename?: 'Harvest', id: string, date: any, step: HarvestStep, amount: string, type: HarvestType, label: string, harvestTransactions?: Array<{ __typename?: 'HarvestTransaction', id: string, revert: boolean, counterTransaction: boolean, harvestTransactionItem: { __typename?: 'HarvestTransactionItem', id: string, quantity: string, completedDate?: any | null, orderType: OrderType, lotSold?: { __typename?: 'Lot', id: string, acquiredDate: any } | null, asset: { __typename?: 'Asset', lastPrice: string, symbol: string } }, replacementTransactionItem?: { __typename?: 'HarvestTransactionItem', id: string, quantity: string, completedDate?: any | null, orderType: OrderType, lotSold?: { __typename?: 'Lot', id: string, acquiredDate: any } | null, asset: { __typename?: 'Asset', lastPrice: string, symbol: string } } | null, revertHarvestTransactionItem?: { __typename?: 'HarvestTransactionItem', id: string, quantity: string, completedDate?: any | null, orderType: OrderType, lotSold?: { __typename?: 'Lot', id: string, acquiredDate: any } | null, asset: { __typename?: 'Asset', lastPrice: string, symbol: string } } | null, revertReplacementTransactionItem?: { __typename?: 'HarvestTransactionItem', id: string, quantity: string, completedDate?: any | null, orderType: OrderType, lotSold?: { __typename?: 'Lot', id: string, acquiredDate: any } | null, asset: { __typename?: 'Asset', lastPrice: string, symbol: string } } | null }> | null } };

export type FinalizeHarvestMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type FinalizeHarvestMutation = { __typename?: 'Mutation', finalizeHarvest: { __typename?: 'Harvest', id: string, date: any, step: HarvestStep, amount: string, type: HarvestType, label: string, harvestTransactions?: Array<{ __typename?: 'HarvestTransaction', id: string, revert: boolean, counterTransaction: boolean, harvestTransactionItem: { __typename?: 'HarvestTransactionItem', id: string, quantity: string, completedDate?: any | null, orderType: OrderType, lotSold?: { __typename?: 'Lot', id: string, acquiredDate: any } | null, asset: { __typename?: 'Asset', lastPrice: string, symbol: string } }, replacementTransactionItem?: { __typename?: 'HarvestTransactionItem', id: string, quantity: string, completedDate?: any | null, orderType: OrderType, lotSold?: { __typename?: 'Lot', id: string, acquiredDate: any } | null, asset: { __typename?: 'Asset', lastPrice: string, symbol: string } } | null, revertHarvestTransactionItem?: { __typename?: 'HarvestTransactionItem', id: string, quantity: string, completedDate?: any | null, orderType: OrderType, lotSold?: { __typename?: 'Lot', id: string, acquiredDate: any } | null, asset: { __typename?: 'Asset', lastPrice: string, symbol: string } } | null, revertReplacementTransactionItem?: { __typename?: 'HarvestTransactionItem', id: string, quantity: string, completedDate?: any | null, orderType: OrderType, lotSold?: { __typename?: 'Lot', id: string, acquiredDate: any } | null, asset: { __typename?: 'Asset', lastPrice: string, symbol: string } } | null }> | null } };

export type LotItemFragment = { __typename?: 'Lot', id: string, acquiredDate: any, costTotal?: string | null, price: string, remainingQty: string, assetSymbol: string, totalCostForGainPct?: string | null, asset: { __typename?: 'Asset', symbol: string, lastPrice: string }, account: { __typename?: 'Account', id: string, externalId?: string | null, name?: string | null, type: string } };

export type PortfolioLotsQueryVariables = Exact<{
  where?: InputMaybe<LotWhereInput>;
  includeTaxAdvantaged?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type PortfolioLotsQuery = { __typename?: 'Query', lots: Array<{ __typename?: 'Lot', id: string, acquiredDate: any, costTotal?: string | null, price: string, remainingQty: string, assetSymbol: string, totalCostForGainPct?: string | null, asset: { __typename?: 'Asset', symbol: string, lastPrice: string }, account: { __typename?: 'Account', id: string, externalId?: string | null, name?: string | null, type: string } }> };

export type PortfolioItemFragment = { __typename?: 'Portfolio', id: string, name: string, harvestCycleWeeks: number, createdAt: any, createdById: string, endOfYearTaxOpportunityNotification: boolean, notificationFrequency: HarvestNotificationFrequency };

export type PortfolioDetailItemFragment = { __typename?: 'Portfolio', harvestShareDollarThreshold: string, harvestTickerBucketDollarSizeLong: string, harvestTickerBucketDollarSizeShort: string, harvestTickerBucketLowerLimitLong: string, harvestTickerBucketLowerLimitShort: string, minimumLotPAndL: string, id: string, name: string, harvestCycleWeeks: number, createdAt: any, createdById: string, endOfYearTaxOpportunityNotification: boolean, notificationFrequency: HarvestNotificationFrequency, accounts?: Array<{ __typename?: 'Account', name?: string | null, id: string }> | null, usersOnPortfolios?: Array<{ __typename?: 'UsersOnPortfolios', role: PortfolioRole, user: { __typename?: 'User', id: string, name?: string | null, email?: string | null, photo?: string | null } }> | null };

export type PortfoliosQueryVariables = Exact<{ [key: string]: never; }>;


export type PortfoliosQuery = { __typename?: 'Query', portfolios: Array<{ __typename?: 'Portfolio', id: string, name: string, harvestCycleWeeks: number, createdAt: any, createdById: string, endOfYearTaxOpportunityNotification: boolean, notificationFrequency: HarvestNotificationFrequency }> };

export type CreatePortfolioMutationVariables = Exact<{
  portfolioInsertObject: PortfolioCreateInput;
}>;


export type CreatePortfolioMutation = { __typename?: 'Mutation', createPortfolio: { __typename?: 'Portfolio', harvestShareDollarThreshold: string, harvestTickerBucketDollarSizeLong: string, harvestTickerBucketDollarSizeShort: string, harvestTickerBucketLowerLimitLong: string, harvestTickerBucketLowerLimitShort: string, minimumLotPAndL: string, id: string, name: string, harvestCycleWeeks: number, createdAt: any, createdById: string, endOfYearTaxOpportunityNotification: boolean, notificationFrequency: HarvestNotificationFrequency, accounts?: Array<{ __typename?: 'Account', name?: string | null, id: string }> | null, usersOnPortfolios?: Array<{ __typename?: 'UsersOnPortfolios', role: PortfolioRole, user: { __typename?: 'User', id: string, name?: string | null, email?: string | null, photo?: string | null } }> | null } };

export type PortfolioAuthedQueryVariables = Exact<{ [key: string]: never; }>;


export type PortfolioAuthedQuery = { __typename?: 'Query', portfolioAuthed: { __typename?: 'Portfolio', id: string, name: string, harvestCycleWeeks: number, createdAt: any, createdById: string, endOfYearTaxOpportunityNotification: boolean, notificationFrequency: HarvestNotificationFrequency } };

export type PortfolioDetailAuthedQueryVariables = Exact<{ [key: string]: never; }>;


export type PortfolioDetailAuthedQuery = { __typename?: 'Query', portfolioAuthed: { __typename?: 'Portfolio', harvestShareDollarThreshold: string, harvestTickerBucketDollarSizeLong: string, harvestTickerBucketDollarSizeShort: string, harvestTickerBucketLowerLimitLong: string, harvestTickerBucketLowerLimitShort: string, minimumLotPAndL: string, id: string, name: string, harvestCycleWeeks: number, createdAt: any, createdById: string, endOfYearTaxOpportunityNotification: boolean, notificationFrequency: HarvestNotificationFrequency, accounts?: Array<{ __typename?: 'Account', name?: string | null, id: string }> | null, usersOnPortfolios?: Array<{ __typename?: 'UsersOnPortfolios', role: PortfolioRole, user: { __typename?: 'User', id: string, name?: string | null, email?: string | null, photo?: string | null } }> | null } };

export type SwitchPortfolioMutationVariables = Exact<{
  porfolioId: Scalars['String']['input'];
}>;


export type SwitchPortfolioMutation = { __typename?: 'Mutation', switchPortfolio: { __typename?: 'Portfolio', id: string, name: string, harvestCycleWeeks: number, createdAt: any, createdById: string, endOfYearTaxOpportunityNotification: boolean, notificationFrequency: HarvestNotificationFrequency } };

export type PositionItemFragment = { __typename?: 'Position', change?: string | null, changePCT?: string | null, commissionDay?: string | null, commissionTotal?: string | null, costPerShare?: string | null, costTotal?: string | null, dateAcquired?: any | null, dateExpiration?: any | null, externalId?: string | null, feesDay?: string | null, feesOther?: string | null, gainDay?: string | null, gainTotal?: string | null, gainTotalPCT?: string | null, id: string, marketValue?: string | null, pricePaid?: string | null, quantity: string, quoteStatus?: string | null, assetSymbol: string, type?: string | null, account: { __typename?: 'Account', id: string, externalId?: string | null, name?: string | null, type: string } };

export type PortfolioPositionsQueryVariables = Exact<{ [key: string]: never; }>;


export type PortfolioPositionsQuery = { __typename?: 'Query', portfolioPositions: Array<{ __typename?: 'Position', id: string, change?: string | null, changePCT?: string | null, commissionDay?: string | null, commissionTotal?: string | null, costPerShare?: string | null, costTotal?: string | null, dateAcquired?: any | null, dateExpiration?: any | null, externalId?: string | null, feesDay?: string | null, feesOther?: string | null, gainDay?: string | null, gainTotal?: string | null, gainTotalPCT?: string | null, marketValue?: string | null, pricePaid?: string | null, quantity: string, quoteStatus?: string | null, assetSymbol: string, type?: string | null, account: { __typename?: 'Account', id: string, externalId?: string | null, name?: string | null, type: string } }> };

export type Chart3MonthQueryVariables = Exact<{
  asset: Scalars['String']['input'];
}>;


export type Chart3MonthQuery = { __typename?: 'Query', chartThreeMonth: Array<{ __typename?: 'PolygonStockData', c?: number | null, t?: number | null, o?: number | null, h?: number | null, l?: number | null, vw?: number | null, v?: number | null, n?: number | null }> };

export const UserItemFragmentDoc = gql`
    fragment UserItem on User {
  id
  name
  email
  photo
  stripeCustomerId
}
    `;
export const AccountItemFragmentDoc = gql`
    fragment AccountItem on Account {
  id
  name
  type
  portfolioId
  provider
  externalId
  key
  description
  institution
  mode
  status
  optionLevel
  cashForOpenOrders
  balanceMoneyMarket
  cashAvailableForInvestment
  accountValueTotal
  marketValueTotal
  cashNet
  cashBalance
  balanceAccount
  createdAt
  updatedAt
  createdBy {
    id
    ...UserItem
  }
  _realizedProfitAndLoss {
    id
    longTerm
    shortTerm
    dividend
    year
    deferredLoss
  }
}
    ${UserItemFragmentDoc}`;
export const AccountTableItemFragmentDoc = gql`
    fragment AccountTableItem on Account {
  id
  name
  type
  portfolioId
  provider
  externalId
  key
  institution
  mode
  status
  optionLevel
  cashForOpenOrders
  balanceMoneyMarket
  cashAvailableForInvestment
  accountValueTotal
  cashNet
  cashBalance
  balanceAccount
  createdAt
  updatedAt
  createdBy {
    id
    ...UserItem
  }
  authConnectionId
}
    ${UserItemFragmentDoc}`;
export const LogFragmentDoc = gql`
    fragment Log on Log {
  id
  createdAt
  description
  responseStatus
  source
  type
}
    `;
export const LogDetailsFragmentDoc = gql`
    fragment LogDetails on Log {
  id
  createdAt
  description
  responseStatus
  source
  type
  data
}
    `;
export const LotTransactionBatchFragmentDoc = gql`
    fragment LotTransactionBatch on LotTransactionBatch {
  id
  createdAt
  updatedAt
  authConnectionId
}
    `;
export const LotTransactionBatchDetailsFragmentDoc = gql`
    fragment LotTransactionBatchDetails on LotTransactionBatch {
  id
  createdAt
  updatedAt
  authConnectionId
  positionsBefore
  positionsAfter
  holdingsPayload
  lotTupleMap
  initialLots
  newTransactions
  newBuys
  newSells
  lotChangeLog {
    id
    createdAt
    lotId
    accountId
    portfolioId
    lotBefore
    lotAfter
    operationType
    source
    processed
    quantityChange
    lotTransactionBatchId
    lot {
      id
      remainingQty
      price
      acquiredDate
      assetSymbol
      account {
        id
        name
      }
    }
  }
}
    `;
export const HarvestTableItemFragmentDoc = gql`
    fragment HarvestTableItem on Harvest {
  id
  date
  type
  step
  createdAt
  amount
  label
  afterWashRevertDate
  notify
  recommendationExpiresDate
  createdBy {
    id
    ...UserItem
  }
}
    ${UserItemFragmentDoc}`;
export const HarvestTransactionItemTableItemFragmentDoc = gql`
    fragment HarvestTransactionItemTableItem on HarvestTransactionItem {
  id
  orderType
  assetSymbol
  quantity
  price
  lotId
  completedDate
  lotAcquiredDate
  lotPricePaid
  lotPriceAtHarvest
}
    `;
export const HarvestTransactionTableItemFragmentDoc = gql`
    fragment HarvestTransactionTableItem on HarvestTransaction {
  id
  revert
  counterTransaction
  harvestTransactionItem {
    id
    ...HarvestTransactionItemTableItem
  }
  replacementTransactionItem {
    id
    ...HarvestTransactionItemTableItem
  }
  revertHarvestTransactionItem {
    id
    ...HarvestTransactionItemTableItem
  }
  revertReplacementTransactionItem {
    id
    ...HarvestTransactionItemTableItem
  }
}
    ${HarvestTransactionItemTableItemFragmentDoc}`;
export const HarvestSingleItemFragmentDoc = gql`
    fragment HarvestSingleItem on Harvest {
  id
  ...HarvestTableItem
  harvestTransactions {
    id
    ...HarvestTransactionTableItem
  }
}
    ${HarvestTableItemFragmentDoc}
${HarvestTransactionTableItemFragmentDoc}`;
export const AccountSummaryFragmentDoc = gql`
    fragment AccountSummary on Account {
  id
  uploadedPositions
  setRealizedValues
  name
  type
  subType
  accountValueTotal
  skipSetup
}
    `;
export const PortfolioTableItemFragmentDoc = gql`
    fragment PortfolioTableItem on Portfolio {
  createdBy {
    name
    id
    photo
    email
  }
  createdById
  id
  name
  endOfYearTaxOpportunityNotification
  notificationFrequency
  accounts {
    id
    status
    name
    institution
  }
  createdAt
  usersOnPortfolios {
    user {
      name
      id
      photo
      email
    }
    role
  }
}
    `;
export const FiniteHarvestLotItemFragmentDoc = gql`
    fragment FiniteHarvestLotItem on LotCurrent {
  id
  accountId
  remainingQty
  acquiredDate
  price
  symbol
  lastPrice
  costBasis
  value
  gainTotal
  gainTotalPct
  dollarPerSharePnL
  taxGain
  currentHarvestQty
  availableQty
}
    `;
export const MatchedLotOrderItemFragmentDoc = gql`
    fragment MatchedLotOrderItem on HarvestLotOrder {
  accountId
  costBasis
  gainTotal
  id
  lotId
  pricePaid
  quantity
  taxGain
  assetSymbol
  dollarPerSharePnL
  valueTotal
  orderType
  acquiredDate
  lastPrice
}
    `;
export const UnrealizedHarvestItemFragmentDoc = gql`
    fragment UnrealizedHarvestItem on UnrealizedHarvestMatchResult {
  sourceLot {
    id
    ...FiniteHarvestLotItem
  }
  matchedLotOrders {
    id
    ...MatchedLotOrderItem
  }
}
    ${FiniteHarvestLotItemFragmentDoc}
${MatchedLotOrderItemFragmentDoc}`;
export const HarvestLotItemFragmentDoc = gql`
    fragment HarvestLotItem on HarvestLotCurrent {
  id
  accountId
  remainingQty
  acquiredDate
  price
  symbol
  lastPrice
  costBasis
  value
  gainTotal
  gainTotalPct
  dollarPerSharePnL
  taxGain
  currentHarvestQty
  harvestQuantity
  harvestPAndL
  availableQty
}
    `;
export const HarvestEvalResultFragmentFragmentDoc = gql`
    fragment HarvestEvalResultFragment on HarvestEvalResult {
  harvestType
  summary {
    realized {
      gainTotal
    }
    unrealized {
      gainTotal
      lossTotal
      total
    }
    includingCurrentHarvest {
      realized {
        gainTotal
      }
      unrealized {
        gainTotal
        lossTotal
      }
    }
  }
  lotsCurrent {
    id
    ...FiniteHarvestLotItem
  }
  matchedItems {
    id
    pairs {
      sourceHarvestPAndL
      matchedHarvestPAndL
      sourceLots {
        id
        ...HarvestLotItem
      }
      matchedLots {
        id
        ...HarvestLotItem
      }
    }
  }
  totalHarvestLots
  uniqueAssetSymbols
}
    ${FiniteHarvestLotItemFragmentDoc}
${HarvestLotItemFragmentDoc}`;
export const AccountTransactionItemFragmentDoc = gql`
    fragment AccountTransactionItem on Account {
  id
  name
  authConnection {
    id
    source
  }
}
    `;
export const TransactionTableItemFragmentDoc = gql`
    fragment TransactionTableItem on Transaction {
  id
  quantity
  type
  description
  assetSymbol
  settlementDate
  securityType
  displaySymbol
  amount
  externalId
  fee
  memo
  price
  subtype
  transactionDate
  appliedToLots
  account {
    id
    ...AccountTransactionItem
  }
}
    ${AccountTransactionItemFragmentDoc}`;
export const FileItemFragmentDoc = gql`
    fragment FileItem on File {
  id
  accountId
  displayName
  gcpFilename
  type
}
    `;
export const HarvestLotOrderItemFragmentDoc = gql`
    fragment HarvestLotOrderItem on HarvestLotOrder {
  accountId
  costBasis
  gainTotal
  id
  lotId
  pricePaid
  quantity
  taxGain
  assetSymbol
  dollarPerSharePnL
  valueTotal
  orderType
  acquiredDate
}
    `;
export const LotCurrentItemFragmentDoc = gql`
    fragment LotCurrentItem on LotCurrent {
  id
  accountId
  remainingQty
  acquiredDate
  price
  symbol
  lastPrice
  costBasis
  value
  gainTotal
  gainTotalPct
  dollarPerSharePnL
  taxGain
}
    `;
export const HarvestTransactionItemRecordFragmentDoc = gql`
    fragment HarvestTransactionItemRecord on HarvestTransactionItem {
  id
  quantity
  completedDate
  orderType
  lotSold {
    id
    acquiredDate
  }
  asset {
    lastPrice
    symbol
  }
}
    `;
export const HarvestTransactionRecordFragmentDoc = gql`
    fragment HarvestTransactionRecord on HarvestTransaction {
  id
  revert
  counterTransaction
  harvestTransactionItem {
    id
    ...HarvestTransactionItemRecord
  }
  replacementTransactionItem {
    id
    ...HarvestTransactionItemRecord
  }
  revertHarvestTransactionItem {
    id
    ...HarvestTransactionItemRecord
  }
  revertReplacementTransactionItem {
    id
    ...HarvestTransactionItemRecord
  }
}
    ${HarvestTransactionItemRecordFragmentDoc}`;
export const HarvestItemFragmentDoc = gql`
    fragment HarvestItem on Harvest {
  id
  date
  step
  amount
  type
  label
  harvestTransactions {
    id
    ...HarvestTransactionRecord
  }
}
    ${HarvestTransactionRecordFragmentDoc}`;
export const LotItemFragmentDoc = gql`
    fragment LotItem on Lot {
  id
  acquiredDate
  costTotal
  price
  remainingQty
  assetSymbol
  totalCostForGainPct
  asset {
    symbol
    lastPrice
  }
  account {
    id
    externalId
    name
    type
  }
}
    `;
export const PortfolioItemFragmentDoc = gql`
    fragment PortfolioItem on Portfolio {
  id
  name
  harvestCycleWeeks
  createdAt
  createdById
  endOfYearTaxOpportunityNotification
  notificationFrequency
}
    `;
export const PortfolioDetailItemFragmentDoc = gql`
    fragment PortfolioDetailItem on Portfolio {
  ...PortfolioItem
  harvestShareDollarThreshold
  harvestTickerBucketDollarSizeLong
  harvestTickerBucketDollarSizeShort
  harvestTickerBucketLowerLimitLong
  harvestTickerBucketLowerLimitShort
  minimumLotPAndL
  accounts {
    name
    id
  }
  usersOnPortfolios {
    role
    user {
      id
      name
      email
      photo
    }
  }
}
    ${PortfolioItemFragmentDoc}`;
export const PositionItemFragmentDoc = gql`
    fragment PositionItem on Position {
  account {
    id
    externalId
    name
    type
  }
  change
  changePCT
  commissionDay
  commissionTotal
  costPerShare
  costTotal
  dateAcquired
  dateExpiration
  externalId
  feesDay
  feesOther
  gainDay
  gainTotal
  gainTotalPCT
  id
  marketValue
  pricePaid
  quantity
  quoteStatus
  assetSymbol
  type
}
    `;
export const AccountDocument = gql`
    query Account($id: String!) {
  account(id: $id) {
    id
    ...AccountItem
  }
}
    ${AccountItemFragmentDoc}`;

/**
 * __useAccountQuery__
 *
 * To run a query within a React component, call `useAccountQuery` and pass it any options that fit your needs.
 * When your component renders, `useAccountQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAccountQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useAccountQuery(baseOptions: Apollo.QueryHookOptions<AccountQuery, AccountQueryVariables> & ({ variables: AccountQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AccountQuery, AccountQueryVariables>(AccountDocument, options);
      }
export function useAccountLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AccountQuery, AccountQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AccountQuery, AccountQueryVariables>(AccountDocument, options);
        }
export function useAccountSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<AccountQuery, AccountQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<AccountQuery, AccountQueryVariables>(AccountDocument, options);
        }
export type AccountQueryHookResult = ReturnType<typeof useAccountQuery>;
export type AccountLazyQueryHookResult = ReturnType<typeof useAccountLazyQuery>;
export type AccountSuspenseQueryHookResult = ReturnType<typeof useAccountSuspenseQuery>;
export type AccountQueryResult = Apollo.QueryResult<AccountQuery, AccountQueryVariables>;
export const UpdateAccountDocument = gql`
    mutation UpdateAccount($accountUpdateInput: AccountUpdateInput!, $accountWhereUniqueInput: AccountWhereUniqueInput!) {
  updateAccount(
    accountUpdateInput: $accountUpdateInput
    accountWhereUniqueInput: $accountWhereUniqueInput
  ) {
    id
    name
    portfolioId
    description
  }
}
    `;
export type UpdateAccountMutationFn = Apollo.MutationFunction<UpdateAccountMutation, UpdateAccountMutationVariables>;

/**
 * __useUpdateAccountMutation__
 *
 * To run a mutation, you first call `useUpdateAccountMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateAccountMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateAccountMutation, { data, loading, error }] = useUpdateAccountMutation({
 *   variables: {
 *      accountUpdateInput: // value for 'accountUpdateInput'
 *      accountWhereUniqueInput: // value for 'accountWhereUniqueInput'
 *   },
 * });
 */
export function useUpdateAccountMutation(baseOptions?: Apollo.MutationHookOptions<UpdateAccountMutation, UpdateAccountMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateAccountMutation, UpdateAccountMutationVariables>(UpdateAccountDocument, options);
      }
export type UpdateAccountMutationHookResult = ReturnType<typeof useUpdateAccountMutation>;
export type UpdateAccountMutationResult = Apollo.MutationResult<UpdateAccountMutation>;
export type UpdateAccountMutationOptions = Apollo.BaseMutationOptions<UpdateAccountMutation, UpdateAccountMutationVariables>;
export const UpdateAccountRealizedPAndLDocument = gql`
    mutation UpdateAccountRealizedPAndL($id: String!, $input: RealizedPAndLUpdateInput!) {
  updateRealizedPAndL(id: $id, input: $input) {
    id
    shortTerm
    longTerm
    deferredLoss
    dividend
  }
}
    `;
export type UpdateAccountRealizedPAndLMutationFn = Apollo.MutationFunction<UpdateAccountRealizedPAndLMutation, UpdateAccountRealizedPAndLMutationVariables>;

/**
 * __useUpdateAccountRealizedPAndLMutation__
 *
 * To run a mutation, you first call `useUpdateAccountRealizedPAndLMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateAccountRealizedPAndLMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateAccountRealizedPAndLMutation, { data, loading, error }] = useUpdateAccountRealizedPAndLMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateAccountRealizedPAndLMutation(baseOptions?: Apollo.MutationHookOptions<UpdateAccountRealizedPAndLMutation, UpdateAccountRealizedPAndLMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateAccountRealizedPAndLMutation, UpdateAccountRealizedPAndLMutationVariables>(UpdateAccountRealizedPAndLDocument, options);
      }
export type UpdateAccountRealizedPAndLMutationHookResult = ReturnType<typeof useUpdateAccountRealizedPAndLMutation>;
export type UpdateAccountRealizedPAndLMutationResult = Apollo.MutationResult<UpdateAccountRealizedPAndLMutation>;
export type UpdateAccountRealizedPAndLMutationOptions = Apollo.BaseMutationOptions<UpdateAccountRealizedPAndLMutation, UpdateAccountRealizedPAndLMutationVariables>;
export const AccountsDocument = gql`
    query Accounts($where: AccountWhereInput) {
  accounts(where: $where) {
    id
    ...AccountTableItem
    positions {
      id
      gainTotal
    }
  }
}
    ${AccountTableItemFragmentDoc}`;

/**
 * __useAccountsQuery__
 *
 * To run a query within a React component, call `useAccountsQuery` and pass it any options that fit your needs.
 * When your component renders, `useAccountsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAccountsQuery({
 *   variables: {
 *      where: // value for 'where'
 *   },
 * });
 */
export function useAccountsQuery(baseOptions?: Apollo.QueryHookOptions<AccountsQuery, AccountsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AccountsQuery, AccountsQueryVariables>(AccountsDocument, options);
      }
export function useAccountsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AccountsQuery, AccountsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AccountsQuery, AccountsQueryVariables>(AccountsDocument, options);
        }
export function useAccountsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<AccountsQuery, AccountsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<AccountsQuery, AccountsQueryVariables>(AccountsDocument, options);
        }
export type AccountsQueryHookResult = ReturnType<typeof useAccountsQuery>;
export type AccountsLazyQueryHookResult = ReturnType<typeof useAccountsLazyQuery>;
export type AccountsSuspenseQueryHookResult = ReturnType<typeof useAccountsSuspenseQuery>;
export type AccountsQueryResult = Apollo.QueryResult<AccountsQuery, AccountsQueryVariables>;
export const CreateAccountForPortfolioDocument = gql`
    mutation CreateAccountForPortfolio($accountCreateInput: AccountCreateInput!) {
  createAccountForPortfolio(accountCreateInput: $accountCreateInput) {
    id
    ...AccountTableItem
  }
}
    ${AccountTableItemFragmentDoc}`;
export type CreateAccountForPortfolioMutationFn = Apollo.MutationFunction<CreateAccountForPortfolioMutation, CreateAccountForPortfolioMutationVariables>;

/**
 * __useCreateAccountForPortfolioMutation__
 *
 * To run a mutation, you first call `useCreateAccountForPortfolioMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateAccountForPortfolioMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createAccountForPortfolioMutation, { data, loading, error }] = useCreateAccountForPortfolioMutation({
 *   variables: {
 *      accountCreateInput: // value for 'accountCreateInput'
 *   },
 * });
 */
export function useCreateAccountForPortfolioMutation(baseOptions?: Apollo.MutationHookOptions<CreateAccountForPortfolioMutation, CreateAccountForPortfolioMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateAccountForPortfolioMutation, CreateAccountForPortfolioMutationVariables>(CreateAccountForPortfolioDocument, options);
      }
export type CreateAccountForPortfolioMutationHookResult = ReturnType<typeof useCreateAccountForPortfolioMutation>;
export type CreateAccountForPortfolioMutationResult = Apollo.MutationResult<CreateAccountForPortfolioMutation>;
export type CreateAccountForPortfolioMutationOptions = Apollo.BaseMutationOptions<CreateAccountForPortfolioMutation, CreateAccountForPortfolioMutationVariables>;
export const SyncAccountDocument = gql`
    mutation SyncAccount($authConnectionId: String!) {
  syncAuthConnection(id: $authConnectionId) {
    id
  }
}
    `;
export type SyncAccountMutationFn = Apollo.MutationFunction<SyncAccountMutation, SyncAccountMutationVariables>;

/**
 * __useSyncAccountMutation__
 *
 * To run a mutation, you first call `useSyncAccountMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSyncAccountMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [syncAccountMutation, { data, loading, error }] = useSyncAccountMutation({
 *   variables: {
 *      authConnectionId: // value for 'authConnectionId'
 *   },
 * });
 */
export function useSyncAccountMutation(baseOptions?: Apollo.MutationHookOptions<SyncAccountMutation, SyncAccountMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SyncAccountMutation, SyncAccountMutationVariables>(SyncAccountDocument, options);
      }
export type SyncAccountMutationHookResult = ReturnType<typeof useSyncAccountMutation>;
export type SyncAccountMutationResult = Apollo.MutationResult<SyncAccountMutation>;
export type SyncAccountMutationOptions = Apollo.BaseMutationOptions<SyncAccountMutation, SyncAccountMutationVariables>;
export const UpdateAllAssetPricesDocument = gql`
    mutation UpdateAllAssetPrices {
  updateAllAssetPrices
}
    `;
export type UpdateAllAssetPricesMutationFn = Apollo.MutationFunction<UpdateAllAssetPricesMutation, UpdateAllAssetPricesMutationVariables>;

/**
 * __useUpdateAllAssetPricesMutation__
 *
 * To run a mutation, you first call `useUpdateAllAssetPricesMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateAllAssetPricesMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateAllAssetPricesMutation, { data, loading, error }] = useUpdateAllAssetPricesMutation({
 *   variables: {
 *   },
 * });
 */
export function useUpdateAllAssetPricesMutation(baseOptions?: Apollo.MutationHookOptions<UpdateAllAssetPricesMutation, UpdateAllAssetPricesMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateAllAssetPricesMutation, UpdateAllAssetPricesMutationVariables>(UpdateAllAssetPricesDocument, options);
      }
export type UpdateAllAssetPricesMutationHookResult = ReturnType<typeof useUpdateAllAssetPricesMutation>;
export type UpdateAllAssetPricesMutationResult = Apollo.MutationResult<UpdateAllAssetPricesMutation>;
export type UpdateAllAssetPricesMutationOptions = Apollo.BaseMutationOptions<UpdateAllAssetPricesMutation, UpdateAllAssetPricesMutationVariables>;
export const SendWashSaleNotificationsForDateDocument = gql`
    mutation SendWashSaleNotificationsForDate($date: DateTime!) {
  sendWashSaleNotificationsForDate(date: $date)
}
    `;
export type SendWashSaleNotificationsForDateMutationFn = Apollo.MutationFunction<SendWashSaleNotificationsForDateMutation, SendWashSaleNotificationsForDateMutationVariables>;

/**
 * __useSendWashSaleNotificationsForDateMutation__
 *
 * To run a mutation, you first call `useSendWashSaleNotificationsForDateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSendWashSaleNotificationsForDateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [sendWashSaleNotificationsForDateMutation, { data, loading, error }] = useSendWashSaleNotificationsForDateMutation({
 *   variables: {
 *      date: // value for 'date'
 *   },
 * });
 */
export function useSendWashSaleNotificationsForDateMutation(baseOptions?: Apollo.MutationHookOptions<SendWashSaleNotificationsForDateMutation, SendWashSaleNotificationsForDateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SendWashSaleNotificationsForDateMutation, SendWashSaleNotificationsForDateMutationVariables>(SendWashSaleNotificationsForDateDocument, options);
      }
export type SendWashSaleNotificationsForDateMutationHookResult = ReturnType<typeof useSendWashSaleNotificationsForDateMutation>;
export type SendWashSaleNotificationsForDateMutationResult = Apollo.MutationResult<SendWashSaleNotificationsForDateMutation>;
export type SendWashSaleNotificationsForDateMutationOptions = Apollo.BaseMutationOptions<SendWashSaleNotificationsForDateMutation, SendWashSaleNotificationsForDateMutationVariables>;
export const SendNotificationsByFrequencyDocument = gql`
    mutation SendNotificationsByFrequency($frequency: HarvestNotificationFrequency!) {
  sendNotificationsByFrequency(frequency: $frequency)
}
    `;
export type SendNotificationsByFrequencyMutationFn = Apollo.MutationFunction<SendNotificationsByFrequencyMutation, SendNotificationsByFrequencyMutationVariables>;

/**
 * __useSendNotificationsByFrequencyMutation__
 *
 * To run a mutation, you first call `useSendNotificationsByFrequencyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSendNotificationsByFrequencyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [sendNotificationsByFrequencyMutation, { data, loading, error }] = useSendNotificationsByFrequencyMutation({
 *   variables: {
 *      frequency: // value for 'frequency'
 *   },
 * });
 */
export function useSendNotificationsByFrequencyMutation(baseOptions?: Apollo.MutationHookOptions<SendNotificationsByFrequencyMutation, SendNotificationsByFrequencyMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SendNotificationsByFrequencyMutation, SendNotificationsByFrequencyMutationVariables>(SendNotificationsByFrequencyDocument, options);
      }
export type SendNotificationsByFrequencyMutationHookResult = ReturnType<typeof useSendNotificationsByFrequencyMutation>;
export type SendNotificationsByFrequencyMutationResult = Apollo.MutationResult<SendNotificationsByFrequencyMutation>;
export type SendNotificationsByFrequencyMutationOptions = Apollo.BaseMutationOptions<SendNotificationsByFrequencyMutation, SendNotificationsByFrequencyMutationVariables>;
export const LogsDocument = gql`
    query Logs($pagination: PaginationProps) {
  logs(pagination: $pagination) {
    id
    ...Log
  }
  logsCount
}
    ${LogFragmentDoc}`;

/**
 * __useLogsQuery__
 *
 * To run a query within a React component, call `useLogsQuery` and pass it any options that fit your needs.
 * When your component renders, `useLogsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLogsQuery({
 *   variables: {
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useLogsQuery(baseOptions?: Apollo.QueryHookOptions<LogsQuery, LogsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<LogsQuery, LogsQueryVariables>(LogsDocument, options);
      }
export function useLogsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<LogsQuery, LogsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<LogsQuery, LogsQueryVariables>(LogsDocument, options);
        }
export function useLogsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<LogsQuery, LogsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<LogsQuery, LogsQueryVariables>(LogsDocument, options);
        }
export type LogsQueryHookResult = ReturnType<typeof useLogsQuery>;
export type LogsLazyQueryHookResult = ReturnType<typeof useLogsLazyQuery>;
export type LogsSuspenseQueryHookResult = ReturnType<typeof useLogsSuspenseQuery>;
export type LogsQueryResult = Apollo.QueryResult<LogsQuery, LogsQueryVariables>;
export const LogDocument = gql`
    query Log($logId: Int!) {
  log(logId: $logId) {
    id
    ...LogDetails
  }
}
    ${LogDetailsFragmentDoc}`;

/**
 * __useLogQuery__
 *
 * To run a query within a React component, call `useLogQuery` and pass it any options that fit your needs.
 * When your component renders, `useLogQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLogQuery({
 *   variables: {
 *      logId: // value for 'logId'
 *   },
 * });
 */
export function useLogQuery(baseOptions: Apollo.QueryHookOptions<LogQuery, LogQueryVariables> & ({ variables: LogQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<LogQuery, LogQueryVariables>(LogDocument, options);
      }
export function useLogLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<LogQuery, LogQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<LogQuery, LogQueryVariables>(LogDocument, options);
        }
export function useLogSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<LogQuery, LogQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<LogQuery, LogQueryVariables>(LogDocument, options);
        }
export type LogQueryHookResult = ReturnType<typeof useLogQuery>;
export type LogLazyQueryHookResult = ReturnType<typeof useLogLazyQuery>;
export type LogSuspenseQueryHookResult = ReturnType<typeof useLogSuspenseQuery>;
export type LogQueryResult = Apollo.QueryResult<LogQuery, LogQueryVariables>;
export const LotTransactionBatchesDocument = gql`
    query LotTransactionBatches {
  lotTransactionBatches {
    id
    ...LotTransactionBatch
  }
}
    ${LotTransactionBatchFragmentDoc}`;

/**
 * __useLotTransactionBatchesQuery__
 *
 * To run a query within a React component, call `useLotTransactionBatchesQuery` and pass it any options that fit your needs.
 * When your component renders, `useLotTransactionBatchesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLotTransactionBatchesQuery({
 *   variables: {
 *   },
 * });
 */
export function useLotTransactionBatchesQuery(baseOptions?: Apollo.QueryHookOptions<LotTransactionBatchesQuery, LotTransactionBatchesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<LotTransactionBatchesQuery, LotTransactionBatchesQueryVariables>(LotTransactionBatchesDocument, options);
      }
export function useLotTransactionBatchesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<LotTransactionBatchesQuery, LotTransactionBatchesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<LotTransactionBatchesQuery, LotTransactionBatchesQueryVariables>(LotTransactionBatchesDocument, options);
        }
export function useLotTransactionBatchesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<LotTransactionBatchesQuery, LotTransactionBatchesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<LotTransactionBatchesQuery, LotTransactionBatchesQueryVariables>(LotTransactionBatchesDocument, options);
        }
export type LotTransactionBatchesQueryHookResult = ReturnType<typeof useLotTransactionBatchesQuery>;
export type LotTransactionBatchesLazyQueryHookResult = ReturnType<typeof useLotTransactionBatchesLazyQuery>;
export type LotTransactionBatchesSuspenseQueryHookResult = ReturnType<typeof useLotTransactionBatchesSuspenseQuery>;
export type LotTransactionBatchesQueryResult = Apollo.QueryResult<LotTransactionBatchesQuery, LotTransactionBatchesQueryVariables>;
export const LotTransactionBatchDocument = gql`
    query LotTransactionBatch($lotTransactionBatchId: String!) {
  lotTransactionBatch(lotTransactionBatchId: $lotTransactionBatchId) {
    id
    ...LotTransactionBatchDetails
  }
}
    ${LotTransactionBatchDetailsFragmentDoc}`;

/**
 * __useLotTransactionBatchQuery__
 *
 * To run a query within a React component, call `useLotTransactionBatchQuery` and pass it any options that fit your needs.
 * When your component renders, `useLotTransactionBatchQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLotTransactionBatchQuery({
 *   variables: {
 *      lotTransactionBatchId: // value for 'lotTransactionBatchId'
 *   },
 * });
 */
export function useLotTransactionBatchQuery(baseOptions: Apollo.QueryHookOptions<LotTransactionBatchQuery, LotTransactionBatchQueryVariables> & ({ variables: LotTransactionBatchQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<LotTransactionBatchQuery, LotTransactionBatchQueryVariables>(LotTransactionBatchDocument, options);
      }
export function useLotTransactionBatchLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<LotTransactionBatchQuery, LotTransactionBatchQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<LotTransactionBatchQuery, LotTransactionBatchQueryVariables>(LotTransactionBatchDocument, options);
        }
export function useLotTransactionBatchSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<LotTransactionBatchQuery, LotTransactionBatchQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<LotTransactionBatchQuery, LotTransactionBatchQueryVariables>(LotTransactionBatchDocument, options);
        }
export type LotTransactionBatchQueryHookResult = ReturnType<typeof useLotTransactionBatchQuery>;
export type LotTransactionBatchLazyQueryHookResult = ReturnType<typeof useLotTransactionBatchLazyQuery>;
export type LotTransactionBatchSuspenseQueryHookResult = ReturnType<typeof useLotTransactionBatchSuspenseQuery>;
export type LotTransactionBatchQueryResult = Apollo.QueryResult<LotTransactionBatchQuery, LotTransactionBatchQueryVariables>;
export const HarvestsDocument = gql`
    query Harvests($where: HarvestWhereInput) {
  harvests(where: $where) {
    id
    ...HarvestTableItem
  }
}
    ${HarvestTableItemFragmentDoc}`;

/**
 * __useHarvestsQuery__
 *
 * To run a query within a React component, call `useHarvestsQuery` and pass it any options that fit your needs.
 * When your component renders, `useHarvestsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useHarvestsQuery({
 *   variables: {
 *      where: // value for 'where'
 *   },
 * });
 */
export function useHarvestsQuery(baseOptions?: Apollo.QueryHookOptions<HarvestsQuery, HarvestsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<HarvestsQuery, HarvestsQueryVariables>(HarvestsDocument, options);
      }
export function useHarvestsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<HarvestsQuery, HarvestsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<HarvestsQuery, HarvestsQueryVariables>(HarvestsDocument, options);
        }
export function useHarvestsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<HarvestsQuery, HarvestsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<HarvestsQuery, HarvestsQueryVariables>(HarvestsDocument, options);
        }
export type HarvestsQueryHookResult = ReturnType<typeof useHarvestsQuery>;
export type HarvestsLazyQueryHookResult = ReturnType<typeof useHarvestsLazyQuery>;
export type HarvestsSuspenseQueryHookResult = ReturnType<typeof useHarvestsSuspenseQuery>;
export type HarvestsQueryResult = Apollo.QueryResult<HarvestsQuery, HarvestsQueryVariables>;
export const HarvestsAndTransactionsDocument = gql`
    query HarvestsAndTransactions($where: HarvestWhereInput) {
  harvests(where: $where) {
    id
    ...HarvestSingleItem
  }
}
    ${HarvestSingleItemFragmentDoc}`;

/**
 * __useHarvestsAndTransactionsQuery__
 *
 * To run a query within a React component, call `useHarvestsAndTransactionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useHarvestsAndTransactionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useHarvestsAndTransactionsQuery({
 *   variables: {
 *      where: // value for 'where'
 *   },
 * });
 */
export function useHarvestsAndTransactionsQuery(baseOptions?: Apollo.QueryHookOptions<HarvestsAndTransactionsQuery, HarvestsAndTransactionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<HarvestsAndTransactionsQuery, HarvestsAndTransactionsQueryVariables>(HarvestsAndTransactionsDocument, options);
      }
export function useHarvestsAndTransactionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<HarvestsAndTransactionsQuery, HarvestsAndTransactionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<HarvestsAndTransactionsQuery, HarvestsAndTransactionsQueryVariables>(HarvestsAndTransactionsDocument, options);
        }
export function useHarvestsAndTransactionsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<HarvestsAndTransactionsQuery, HarvestsAndTransactionsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<HarvestsAndTransactionsQuery, HarvestsAndTransactionsQueryVariables>(HarvestsAndTransactionsDocument, options);
        }
export type HarvestsAndTransactionsQueryHookResult = ReturnType<typeof useHarvestsAndTransactionsQuery>;
export type HarvestsAndTransactionsLazyQueryHookResult = ReturnType<typeof useHarvestsAndTransactionsLazyQuery>;
export type HarvestsAndTransactionsSuspenseQueryHookResult = ReturnType<typeof useHarvestsAndTransactionsSuspenseQuery>;
export type HarvestsAndTransactionsQueryResult = Apollo.QueryResult<HarvestsAndTransactionsQuery, HarvestsAndTransactionsQueryVariables>;
export const HarvestSingleDocument = gql`
    query HarvestSingle($id: String!) {
  harvest(id: $id) {
    ...HarvestSingleItem
  }
}
    ${HarvestSingleItemFragmentDoc}`;

/**
 * __useHarvestSingleQuery__
 *
 * To run a query within a React component, call `useHarvestSingleQuery` and pass it any options that fit your needs.
 * When your component renders, `useHarvestSingleQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useHarvestSingleQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useHarvestSingleQuery(baseOptions: Apollo.QueryHookOptions<HarvestSingleQuery, HarvestSingleQueryVariables> & ({ variables: HarvestSingleQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<HarvestSingleQuery, HarvestSingleQueryVariables>(HarvestSingleDocument, options);
      }
export function useHarvestSingleLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<HarvestSingleQuery, HarvestSingleQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<HarvestSingleQuery, HarvestSingleQueryVariables>(HarvestSingleDocument, options);
        }
export function useHarvestSingleSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<HarvestSingleQuery, HarvestSingleQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<HarvestSingleQuery, HarvestSingleQueryVariables>(HarvestSingleDocument, options);
        }
export type HarvestSingleQueryHookResult = ReturnType<typeof useHarvestSingleQuery>;
export type HarvestSingleLazyQueryHookResult = ReturnType<typeof useHarvestSingleLazyQuery>;
export type HarvestSingleSuspenseQueryHookResult = ReturnType<typeof useHarvestSingleSuspenseQuery>;
export type HarvestSingleQueryResult = Apollo.QueryResult<HarvestSingleQuery, HarvestSingleQueryVariables>;
export const UpdateHarvestSingleDocument = gql`
    mutation UpdateHarvestSingle($id: String!, $data: HarvestUpdateInput!) {
  updateHarvest(id: $id, data: $data) {
    ...HarvestSingleItem
  }
}
    ${HarvestSingleItemFragmentDoc}`;
export type UpdateHarvestSingleMutationFn = Apollo.MutationFunction<UpdateHarvestSingleMutation, UpdateHarvestSingleMutationVariables>;

/**
 * __useUpdateHarvestSingleMutation__
 *
 * To run a mutation, you first call `useUpdateHarvestSingleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateHarvestSingleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateHarvestSingleMutation, { data, loading, error }] = useUpdateHarvestSingleMutation({
 *   variables: {
 *      id: // value for 'id'
 *      data: // value for 'data'
 *   },
 * });
 */
export function useUpdateHarvestSingleMutation(baseOptions?: Apollo.MutationHookOptions<UpdateHarvestSingleMutation, UpdateHarvestSingleMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateHarvestSingleMutation, UpdateHarvestSingleMutationVariables>(UpdateHarvestSingleDocument, options);
      }
export type UpdateHarvestSingleMutationHookResult = ReturnType<typeof useUpdateHarvestSingleMutation>;
export type UpdateHarvestSingleMutationResult = Apollo.MutationResult<UpdateHarvestSingleMutation>;
export type UpdateHarvestSingleMutationOptions = Apollo.BaseMutationOptions<UpdateHarvestSingleMutation, UpdateHarvestSingleMutationVariables>;
export const PortfolioSummaryDocument = gql`
    query PortfolioSummary {
  portfolioSummary {
    realized {
      accountCount
      dividend
      gainLongTerm
      gainShortTerm
      gainTotal
    }
    unrealized {
      gainTotal
      lossTotal
      accountCount
      positionCount
    }
    harvest {
      realized
      unrealized
      total
    }
    setUpStatus
  }
}
    `;

/**
 * __usePortfolioSummaryQuery__
 *
 * To run a query within a React component, call `usePortfolioSummaryQuery` and pass it any options that fit your needs.
 * When your component renders, `usePortfolioSummaryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePortfolioSummaryQuery({
 *   variables: {
 *   },
 * });
 */
export function usePortfolioSummaryQuery(baseOptions?: Apollo.QueryHookOptions<PortfolioSummaryQuery, PortfolioSummaryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PortfolioSummaryQuery, PortfolioSummaryQueryVariables>(PortfolioSummaryDocument, options);
      }
export function usePortfolioSummaryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PortfolioSummaryQuery, PortfolioSummaryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PortfolioSummaryQuery, PortfolioSummaryQueryVariables>(PortfolioSummaryDocument, options);
        }
export function usePortfolioSummarySuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<PortfolioSummaryQuery, PortfolioSummaryQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<PortfolioSummaryQuery, PortfolioSummaryQueryVariables>(PortfolioSummaryDocument, options);
        }
export type PortfolioSummaryQueryHookResult = ReturnType<typeof usePortfolioSummaryQuery>;
export type PortfolioSummaryLazyQueryHookResult = ReturnType<typeof usePortfolioSummaryLazyQuery>;
export type PortfolioSummarySuspenseQueryHookResult = ReturnType<typeof usePortfolioSummarySuspenseQuery>;
export type PortfolioSummaryQueryResult = Apollo.QueryResult<PortfolioSummaryQuery, PortfolioSummaryQueryVariables>;
export const AccountSummariesDocument = gql`
    query AccountSummaries {
  accounts {
    id
    ...AccountSummary
  }
}
    ${AccountSummaryFragmentDoc}`;

/**
 * __useAccountSummariesQuery__
 *
 * To run a query within a React component, call `useAccountSummariesQuery` and pass it any options that fit your needs.
 * When your component renders, `useAccountSummariesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAccountSummariesQuery({
 *   variables: {
 *   },
 * });
 */
export function useAccountSummariesQuery(baseOptions?: Apollo.QueryHookOptions<AccountSummariesQuery, AccountSummariesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AccountSummariesQuery, AccountSummariesQueryVariables>(AccountSummariesDocument, options);
      }
export function useAccountSummariesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AccountSummariesQuery, AccountSummariesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AccountSummariesQuery, AccountSummariesQueryVariables>(AccountSummariesDocument, options);
        }
export function useAccountSummariesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<AccountSummariesQuery, AccountSummariesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<AccountSummariesQuery, AccountSummariesQueryVariables>(AccountSummariesDocument, options);
        }
export type AccountSummariesQueryHookResult = ReturnType<typeof useAccountSummariesQuery>;
export type AccountSummariesLazyQueryHookResult = ReturnType<typeof useAccountSummariesLazyQuery>;
export type AccountSummariesSuspenseQueryHookResult = ReturnType<typeof useAccountSummariesSuspenseQuery>;
export type AccountSummariesQueryResult = Apollo.QueryResult<AccountSummariesQuery, AccountSummariesQueryVariables>;
export const AccountRealizedPlDocument = gql`
    query AccountRealizedPL {
  accounts {
    id
    name
    realizedPAndL {
      id
      year
      shortTerm
      longTerm
      dividend
      deferredLoss
      updatedAt
    }
  }
}
    `;

/**
 * __useAccountRealizedPlQuery__
 *
 * To run a query within a React component, call `useAccountRealizedPlQuery` and pass it any options that fit your needs.
 * When your component renders, `useAccountRealizedPlQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAccountRealizedPlQuery({
 *   variables: {
 *   },
 * });
 */
export function useAccountRealizedPlQuery(baseOptions?: Apollo.QueryHookOptions<AccountRealizedPlQuery, AccountRealizedPlQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AccountRealizedPlQuery, AccountRealizedPlQueryVariables>(AccountRealizedPlDocument, options);
      }
export function useAccountRealizedPlLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AccountRealizedPlQuery, AccountRealizedPlQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AccountRealizedPlQuery, AccountRealizedPlQueryVariables>(AccountRealizedPlDocument, options);
        }
export function useAccountRealizedPlSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<AccountRealizedPlQuery, AccountRealizedPlQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<AccountRealizedPlQuery, AccountRealizedPlQueryVariables>(AccountRealizedPlDocument, options);
        }
export type AccountRealizedPlQueryHookResult = ReturnType<typeof useAccountRealizedPlQuery>;
export type AccountRealizedPlLazyQueryHookResult = ReturnType<typeof useAccountRealizedPlLazyQuery>;
export type AccountRealizedPlSuspenseQueryHookResult = ReturnType<typeof useAccountRealizedPlSuspenseQuery>;
export type AccountRealizedPlQueryResult = Apollo.QueryResult<AccountRealizedPlQuery, AccountRealizedPlQueryVariables>;
export const InviteUsersToPlatformDocument = gql`
    mutation InviteUsersToPlatform($emails: [String!]!) {
  inviteUsersToPlatform(emails: $emails)
}
    `;
export type InviteUsersToPlatformMutationFn = Apollo.MutationFunction<InviteUsersToPlatformMutation, InviteUsersToPlatformMutationVariables>;

/**
 * __useInviteUsersToPlatformMutation__
 *
 * To run a mutation, you first call `useInviteUsersToPlatformMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useInviteUsersToPlatformMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [inviteUsersToPlatformMutation, { data, loading, error }] = useInviteUsersToPlatformMutation({
 *   variables: {
 *      emails: // value for 'emails'
 *   },
 * });
 */
export function useInviteUsersToPlatformMutation(baseOptions?: Apollo.MutationHookOptions<InviteUsersToPlatformMutation, InviteUsersToPlatformMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<InviteUsersToPlatformMutation, InviteUsersToPlatformMutationVariables>(InviteUsersToPlatformDocument, options);
      }
export type InviteUsersToPlatformMutationHookResult = ReturnType<typeof useInviteUsersToPlatformMutation>;
export type InviteUsersToPlatformMutationResult = Apollo.MutationResult<InviteUsersToPlatformMutation>;
export type InviteUsersToPlatformMutationOptions = Apollo.BaseMutationOptions<InviteUsersToPlatformMutation, InviteUsersToPlatformMutationVariables>;
export const AddUserToPortfolioDocument = gql`
    mutation AddUserToPortfolio($email: String!) {
  addUserToPortfolio(email: $email)
}
    `;
export type AddUserToPortfolioMutationFn = Apollo.MutationFunction<AddUserToPortfolioMutation, AddUserToPortfolioMutationVariables>;

/**
 * __useAddUserToPortfolioMutation__
 *
 * To run a mutation, you first call `useAddUserToPortfolioMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddUserToPortfolioMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addUserToPortfolioMutation, { data, loading, error }] = useAddUserToPortfolioMutation({
 *   variables: {
 *      email: // value for 'email'
 *   },
 * });
 */
export function useAddUserToPortfolioMutation(baseOptions?: Apollo.MutationHookOptions<AddUserToPortfolioMutation, AddUserToPortfolioMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddUserToPortfolioMutation, AddUserToPortfolioMutationVariables>(AddUserToPortfolioDocument, options);
      }
export type AddUserToPortfolioMutationHookResult = ReturnType<typeof useAddUserToPortfolioMutation>;
export type AddUserToPortfolioMutationResult = Apollo.MutationResult<AddUserToPortfolioMutation>;
export type AddUserToPortfolioMutationOptions = Apollo.BaseMutationOptions<AddUserToPortfolioMutation, AddUserToPortfolioMutationVariables>;
export const RemoveUserFromPortfolioDocument = gql`
    mutation RemoveUserFromPortfolio($userId: String!) {
  removeUserFromPortfolio(userId: $userId)
}
    `;
export type RemoveUserFromPortfolioMutationFn = Apollo.MutationFunction<RemoveUserFromPortfolioMutation, RemoveUserFromPortfolioMutationVariables>;

/**
 * __useRemoveUserFromPortfolioMutation__
 *
 * To run a mutation, you first call `useRemoveUserFromPortfolioMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveUserFromPortfolioMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeUserFromPortfolioMutation, { data, loading, error }] = useRemoveUserFromPortfolioMutation({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useRemoveUserFromPortfolioMutation(baseOptions?: Apollo.MutationHookOptions<RemoveUserFromPortfolioMutation, RemoveUserFromPortfolioMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveUserFromPortfolioMutation, RemoveUserFromPortfolioMutationVariables>(RemoveUserFromPortfolioDocument, options);
      }
export type RemoveUserFromPortfolioMutationHookResult = ReturnType<typeof useRemoveUserFromPortfolioMutation>;
export type RemoveUserFromPortfolioMutationResult = Apollo.MutationResult<RemoveUserFromPortfolioMutation>;
export type RemoveUserFromPortfolioMutationOptions = Apollo.BaseMutationOptions<RemoveUserFromPortfolioMutation, RemoveUserFromPortfolioMutationVariables>;
export const UsersOnPortfolioDocument = gql`
    query UsersOnPortfolio {
  usersOnPortfolio {
    id
    name
    email
  }
}
    `;

/**
 * __useUsersOnPortfolioQuery__
 *
 * To run a query within a React component, call `useUsersOnPortfolioQuery` and pass it any options that fit your needs.
 * When your component renders, `useUsersOnPortfolioQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUsersOnPortfolioQuery({
 *   variables: {
 *   },
 * });
 */
export function useUsersOnPortfolioQuery(baseOptions?: Apollo.QueryHookOptions<UsersOnPortfolioQuery, UsersOnPortfolioQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UsersOnPortfolioQuery, UsersOnPortfolioQueryVariables>(UsersOnPortfolioDocument, options);
      }
export function useUsersOnPortfolioLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UsersOnPortfolioQuery, UsersOnPortfolioQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UsersOnPortfolioQuery, UsersOnPortfolioQueryVariables>(UsersOnPortfolioDocument, options);
        }
export function useUsersOnPortfolioSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<UsersOnPortfolioQuery, UsersOnPortfolioQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<UsersOnPortfolioQuery, UsersOnPortfolioQueryVariables>(UsersOnPortfolioDocument, options);
        }
export type UsersOnPortfolioQueryHookResult = ReturnType<typeof useUsersOnPortfolioQuery>;
export type UsersOnPortfolioLazyQueryHookResult = ReturnType<typeof useUsersOnPortfolioLazyQuery>;
export type UsersOnPortfolioSuspenseQueryHookResult = ReturnType<typeof useUsersOnPortfolioSuspenseQuery>;
export type UsersOnPortfolioQueryResult = Apollo.QueryResult<UsersOnPortfolioQuery, UsersOnPortfolioQueryVariables>;
export const PortfolioTableDocument = gql`
    query PortfolioTable {
  portfolios {
    id
    ...PortfolioTableItem
  }
}
    ${PortfolioTableItemFragmentDoc}`;

/**
 * __usePortfolioTableQuery__
 *
 * To run a query within a React component, call `usePortfolioTableQuery` and pass it any options that fit your needs.
 * When your component renders, `usePortfolioTableQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePortfolioTableQuery({
 *   variables: {
 *   },
 * });
 */
export function usePortfolioTableQuery(baseOptions?: Apollo.QueryHookOptions<PortfolioTableQuery, PortfolioTableQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PortfolioTableQuery, PortfolioTableQueryVariables>(PortfolioTableDocument, options);
      }
export function usePortfolioTableLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PortfolioTableQuery, PortfolioTableQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PortfolioTableQuery, PortfolioTableQueryVariables>(PortfolioTableDocument, options);
        }
export function usePortfolioTableSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<PortfolioTableQuery, PortfolioTableQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<PortfolioTableQuery, PortfolioTableQueryVariables>(PortfolioTableDocument, options);
        }
export type PortfolioTableQueryHookResult = ReturnType<typeof usePortfolioTableQuery>;
export type PortfolioTableLazyQueryHookResult = ReturnType<typeof usePortfolioTableLazyQuery>;
export type PortfolioTableSuspenseQueryHookResult = ReturnType<typeof usePortfolioTableSuspenseQuery>;
export type PortfolioTableQueryResult = Apollo.QueryResult<PortfolioTableQuery, PortfolioTableQueryVariables>;
export const UpdatePortfolioDocument = gql`
    mutation UpdatePortfolio($data: PortfolioUpdateInput!) {
  updatePortfolio(data: $data) {
    ...PortfolioDetailItem
  }
}
    ${PortfolioDetailItemFragmentDoc}`;
export type UpdatePortfolioMutationFn = Apollo.MutationFunction<UpdatePortfolioMutation, UpdatePortfolioMutationVariables>;

/**
 * __useUpdatePortfolioMutation__
 *
 * To run a mutation, you first call `useUpdatePortfolioMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdatePortfolioMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updatePortfolioMutation, { data, loading, error }] = useUpdatePortfolioMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useUpdatePortfolioMutation(baseOptions?: Apollo.MutationHookOptions<UpdatePortfolioMutation, UpdatePortfolioMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdatePortfolioMutation, UpdatePortfolioMutationVariables>(UpdatePortfolioDocument, options);
      }
export type UpdatePortfolioMutationHookResult = ReturnType<typeof useUpdatePortfolioMutation>;
export type UpdatePortfolioMutationResult = Apollo.MutationResult<UpdatePortfolioMutation>;
export type UpdatePortfolioMutationOptions = Apollo.BaseMutationOptions<UpdatePortfolioMutation, UpdatePortfolioMutationVariables>;
export const PortfolioNotificationSettingsDocument = gql`
    query PortfolioNotificationSettings {
  portfolioAuthed {
    id
    notificationFrequency
    endOfYearTaxOpportunityNotification
  }
}
    `;

/**
 * __usePortfolioNotificationSettingsQuery__
 *
 * To run a query within a React component, call `usePortfolioNotificationSettingsQuery` and pass it any options that fit your needs.
 * When your component renders, `usePortfolioNotificationSettingsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePortfolioNotificationSettingsQuery({
 *   variables: {
 *   },
 * });
 */
export function usePortfolioNotificationSettingsQuery(baseOptions?: Apollo.QueryHookOptions<PortfolioNotificationSettingsQuery, PortfolioNotificationSettingsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PortfolioNotificationSettingsQuery, PortfolioNotificationSettingsQueryVariables>(PortfolioNotificationSettingsDocument, options);
      }
export function usePortfolioNotificationSettingsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PortfolioNotificationSettingsQuery, PortfolioNotificationSettingsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PortfolioNotificationSettingsQuery, PortfolioNotificationSettingsQueryVariables>(PortfolioNotificationSettingsDocument, options);
        }
export function usePortfolioNotificationSettingsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<PortfolioNotificationSettingsQuery, PortfolioNotificationSettingsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<PortfolioNotificationSettingsQuery, PortfolioNotificationSettingsQueryVariables>(PortfolioNotificationSettingsDocument, options);
        }
export type PortfolioNotificationSettingsQueryHookResult = ReturnType<typeof usePortfolioNotificationSettingsQuery>;
export type PortfolioNotificationSettingsLazyQueryHookResult = ReturnType<typeof usePortfolioNotificationSettingsLazyQuery>;
export type PortfolioNotificationSettingsSuspenseQueryHookResult = ReturnType<typeof usePortfolioNotificationSettingsSuspenseQuery>;
export type PortfolioNotificationSettingsQueryResult = Apollo.QueryResult<PortfolioNotificationSettingsQuery, PortfolioNotificationSettingsQueryVariables>;
export const StripeSessionDocument = gql`
    query StripeSession($stripePriceId: String!, $stripeCustomerId: String!) {
  stripeSession(
    stripePriceId: $stripePriceId
    stripeCustomerId: $stripeCustomerId
  ) {
    id
    client_secret
  }
}
    `;

/**
 * __useStripeSessionQuery__
 *
 * To run a query within a React component, call `useStripeSessionQuery` and pass it any options that fit your needs.
 * When your component renders, `useStripeSessionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useStripeSessionQuery({
 *   variables: {
 *      stripePriceId: // value for 'stripePriceId'
 *      stripeCustomerId: // value for 'stripeCustomerId'
 *   },
 * });
 */
export function useStripeSessionQuery(baseOptions: Apollo.QueryHookOptions<StripeSessionQuery, StripeSessionQueryVariables> & ({ variables: StripeSessionQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<StripeSessionQuery, StripeSessionQueryVariables>(StripeSessionDocument, options);
      }
export function useStripeSessionLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<StripeSessionQuery, StripeSessionQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<StripeSessionQuery, StripeSessionQueryVariables>(StripeSessionDocument, options);
        }
export function useStripeSessionSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<StripeSessionQuery, StripeSessionQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<StripeSessionQuery, StripeSessionQueryVariables>(StripeSessionDocument, options);
        }
export type StripeSessionQueryHookResult = ReturnType<typeof useStripeSessionQuery>;
export type StripeSessionLazyQueryHookResult = ReturnType<typeof useStripeSessionLazyQuery>;
export type StripeSessionSuspenseQueryHookResult = ReturnType<typeof useStripeSessionSuspenseQuery>;
export type StripeSessionQueryResult = Apollo.QueryResult<StripeSessionQuery, StripeSessionQueryVariables>;
export const FiniteHarvestDocument = gql`
    query FiniteHarvest {
  finiteHarvest {
    harvestType
    totalHarvestLots
    summary {
      realized {
        gainTotal
      }
      unrealized {
        gainTotal
        lossTotal
        total
      }
      includingCurrentHarvest {
        realized {
          gainTotal
        }
        unrealized {
          gainTotal
          lossTotal
        }
      }
    }
    lotsCurrent {
      id
      ...FiniteHarvestLotItem
    }
    unrealizedHarvestMatchResults {
      ...UnrealizedHarvestItem
    }
  }
}
    ${FiniteHarvestLotItemFragmentDoc}
${UnrealizedHarvestItemFragmentDoc}`;

/**
 * __useFiniteHarvestQuery__
 *
 * To run a query within a React component, call `useFiniteHarvestQuery` and pass it any options that fit your needs.
 * When your component renders, `useFiniteHarvestQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFiniteHarvestQuery({
 *   variables: {
 *   },
 * });
 */
export function useFiniteHarvestQuery(baseOptions?: Apollo.QueryHookOptions<FiniteHarvestQuery, FiniteHarvestQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FiniteHarvestQuery, FiniteHarvestQueryVariables>(FiniteHarvestDocument, options);
      }
export function useFiniteHarvestLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FiniteHarvestQuery, FiniteHarvestQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FiniteHarvestQuery, FiniteHarvestQueryVariables>(FiniteHarvestDocument, options);
        }
export function useFiniteHarvestSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<FiniteHarvestQuery, FiniteHarvestQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<FiniteHarvestQuery, FiniteHarvestQueryVariables>(FiniteHarvestDocument, options);
        }
export type FiniteHarvestQueryHookResult = ReturnType<typeof useFiniteHarvestQuery>;
export type FiniteHarvestLazyQueryHookResult = ReturnType<typeof useFiniteHarvestLazyQuery>;
export type FiniteHarvestSuspenseQueryHookResult = ReturnType<typeof useFiniteHarvestSuspenseQuery>;
export type FiniteHarvestQueryResult = Apollo.QueryResult<FiniteHarvestQuery, FiniteHarvestQueryVariables>;
export const DeleteHarvestsDocument = gql`
    mutation DeleteHarvests($ids: [String!]!) {
  deleteHarvests(ids: $ids)
}
    `;
export type DeleteHarvestsMutationFn = Apollo.MutationFunction<DeleteHarvestsMutation, DeleteHarvestsMutationVariables>;

/**
 * __useDeleteHarvestsMutation__
 *
 * To run a mutation, you first call `useDeleteHarvestsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteHarvestsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteHarvestsMutation, { data, loading, error }] = useDeleteHarvestsMutation({
 *   variables: {
 *      ids: // value for 'ids'
 *   },
 * });
 */
export function useDeleteHarvestsMutation(baseOptions?: Apollo.MutationHookOptions<DeleteHarvestsMutation, DeleteHarvestsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteHarvestsMutation, DeleteHarvestsMutationVariables>(DeleteHarvestsDocument, options);
      }
export type DeleteHarvestsMutationHookResult = ReturnType<typeof useDeleteHarvestsMutation>;
export type DeleteHarvestsMutationResult = Apollo.MutationResult<DeleteHarvestsMutation>;
export type DeleteHarvestsMutationOptions = Apollo.BaseMutationOptions<DeleteHarvestsMutation, DeleteHarvestsMutationVariables>;
export const HarvestEvalResultDocument = gql`
    query HarvestEvalResult($filters: HarvestEvalFilters) {
  harvestEvalResult(filters: $filters) {
    ...HarvestEvalResultFragment
  }
}
    ${HarvestEvalResultFragmentFragmentDoc}`;

/**
 * __useHarvestEvalResultQuery__
 *
 * To run a query within a React component, call `useHarvestEvalResultQuery` and pass it any options that fit your needs.
 * When your component renders, `useHarvestEvalResultQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useHarvestEvalResultQuery({
 *   variables: {
 *      filters: // value for 'filters'
 *   },
 * });
 */
export function useHarvestEvalResultQuery(baseOptions?: Apollo.QueryHookOptions<HarvestEvalResultQuery, HarvestEvalResultQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<HarvestEvalResultQuery, HarvestEvalResultQueryVariables>(HarvestEvalResultDocument, options);
      }
export function useHarvestEvalResultLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<HarvestEvalResultQuery, HarvestEvalResultQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<HarvestEvalResultQuery, HarvestEvalResultQueryVariables>(HarvestEvalResultDocument, options);
        }
export function useHarvestEvalResultSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<HarvestEvalResultQuery, HarvestEvalResultQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<HarvestEvalResultQuery, HarvestEvalResultQueryVariables>(HarvestEvalResultDocument, options);
        }
export type HarvestEvalResultQueryHookResult = ReturnType<typeof useHarvestEvalResultQuery>;
export type HarvestEvalResultLazyQueryHookResult = ReturnType<typeof useHarvestEvalResultLazyQuery>;
export type HarvestEvalResultSuspenseQueryHookResult = ReturnType<typeof useHarvestEvalResultSuspenseQuery>;
export type HarvestEvalResultQueryResult = Apollo.QueryResult<HarvestEvalResultQuery, HarvestEvalResultQueryVariables>;
export const TransactionsDocument = gql`
    query Transactions($where: TransactionWhereInput) {
  transactions(where: $where) {
    id
    ...TransactionTableItem
  }
}
    ${TransactionTableItemFragmentDoc}`;

/**
 * __useTransactionsQuery__
 *
 * To run a query within a React component, call `useTransactionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useTransactionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTransactionsQuery({
 *   variables: {
 *      where: // value for 'where'
 *   },
 * });
 */
export function useTransactionsQuery(baseOptions?: Apollo.QueryHookOptions<TransactionsQuery, TransactionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TransactionsQuery, TransactionsQueryVariables>(TransactionsDocument, options);
      }
export function useTransactionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TransactionsQuery, TransactionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TransactionsQuery, TransactionsQueryVariables>(TransactionsDocument, options);
        }
export function useTransactionsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<TransactionsQuery, TransactionsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<TransactionsQuery, TransactionsQueryVariables>(TransactionsDocument, options);
        }
export type TransactionsQueryHookResult = ReturnType<typeof useTransactionsQuery>;
export type TransactionsLazyQueryHookResult = ReturnType<typeof useTransactionsLazyQuery>;
export type TransactionsSuspenseQueryHookResult = ReturnType<typeof useTransactionsSuspenseQuery>;
export type TransactionsQueryResult = Apollo.QueryResult<TransactionsQuery, TransactionsQueryVariables>;
export const UserDocument = gql`
    query User {
  userCurrent {
    id
    ...UserItem
  }
}
    ${UserItemFragmentDoc}`;

/**
 * __useUserQuery__
 *
 * To run a query within a React component, call `useUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserQuery({
 *   variables: {
 *   },
 * });
 */
export function useUserQuery(baseOptions?: Apollo.QueryHookOptions<UserQuery, UserQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UserQuery, UserQueryVariables>(UserDocument, options);
      }
export function useUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UserQuery, UserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UserQuery, UserQueryVariables>(UserDocument, options);
        }
export function useUserSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<UserQuery, UserQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<UserQuery, UserQueryVariables>(UserDocument, options);
        }
export type UserQueryHookResult = ReturnType<typeof useUserQuery>;
export type UserLazyQueryHookResult = ReturnType<typeof useUserLazyQuery>;
export type UserSuspenseQueryHookResult = ReturnType<typeof useUserSuspenseQuery>;
export type UserQueryResult = Apollo.QueryResult<UserQuery, UserQueryVariables>;
export const VerificationEtradeDocument = gql`
    query VerificationEtrade($portfolioId: String!) {
  requestOauthConnection(authSource: ETRADE_REQUEST, portfolioId: $portfolioId) {
    id
    verificationUrl
  }
}
    `;

/**
 * __useVerificationEtradeQuery__
 *
 * To run a query within a React component, call `useVerificationEtradeQuery` and pass it any options that fit your needs.
 * When your component renders, `useVerificationEtradeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useVerificationEtradeQuery({
 *   variables: {
 *      portfolioId: // value for 'portfolioId'
 *   },
 * });
 */
export function useVerificationEtradeQuery(baseOptions: Apollo.QueryHookOptions<VerificationEtradeQuery, VerificationEtradeQueryVariables> & ({ variables: VerificationEtradeQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<VerificationEtradeQuery, VerificationEtradeQueryVariables>(VerificationEtradeDocument, options);
      }
export function useVerificationEtradeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<VerificationEtradeQuery, VerificationEtradeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<VerificationEtradeQuery, VerificationEtradeQueryVariables>(VerificationEtradeDocument, options);
        }
export function useVerificationEtradeSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<VerificationEtradeQuery, VerificationEtradeQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<VerificationEtradeQuery, VerificationEtradeQueryVariables>(VerificationEtradeDocument, options);
        }
export type VerificationEtradeQueryHookResult = ReturnType<typeof useVerificationEtradeQuery>;
export type VerificationEtradeLazyQueryHookResult = ReturnType<typeof useVerificationEtradeLazyQuery>;
export type VerificationEtradeSuspenseQueryHookResult = ReturnType<typeof useVerificationEtradeSuspenseQuery>;
export type VerificationEtradeQueryResult = Apollo.QueryResult<VerificationEtradeQuery, VerificationEtradeQueryVariables>;
export const OauthEtradeDocument = gql`
    mutation OauthEtrade($verifier: String!, $portfolioId: String!) {
  accessOauthConnection(
    verifier: $verifier
    authSource: ETRADE_ACCESS
    portfolioId: $portfolioId
  ) {
    id
  }
}
    `;
export type OauthEtradeMutationFn = Apollo.MutationFunction<OauthEtradeMutation, OauthEtradeMutationVariables>;

/**
 * __useOauthEtradeMutation__
 *
 * To run a mutation, you first call `useOauthEtradeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useOauthEtradeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [oauthEtradeMutation, { data, loading, error }] = useOauthEtradeMutation({
 *   variables: {
 *      verifier: // value for 'verifier'
 *      portfolioId: // value for 'portfolioId'
 *   },
 * });
 */
export function useOauthEtradeMutation(baseOptions?: Apollo.MutationHookOptions<OauthEtradeMutation, OauthEtradeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<OauthEtradeMutation, OauthEtradeMutationVariables>(OauthEtradeDocument, options);
      }
export type OauthEtradeMutationHookResult = ReturnType<typeof useOauthEtradeMutation>;
export type OauthEtradeMutationResult = Apollo.MutationResult<OauthEtradeMutation>;
export type OauthEtradeMutationOptions = Apollo.BaseMutationOptions<OauthEtradeMutation, OauthEtradeMutationVariables>;
export const PlaidLinkTokenDocument = gql`
    query PlaidLinkToken {
  linkToken
}
    `;

/**
 * __usePlaidLinkTokenQuery__
 *
 * To run a query within a React component, call `usePlaidLinkTokenQuery` and pass it any options that fit your needs.
 * When your component renders, `usePlaidLinkTokenQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePlaidLinkTokenQuery({
 *   variables: {
 *   },
 * });
 */
export function usePlaidLinkTokenQuery(baseOptions?: Apollo.QueryHookOptions<PlaidLinkTokenQuery, PlaidLinkTokenQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PlaidLinkTokenQuery, PlaidLinkTokenQueryVariables>(PlaidLinkTokenDocument, options);
      }
export function usePlaidLinkTokenLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PlaidLinkTokenQuery, PlaidLinkTokenQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PlaidLinkTokenQuery, PlaidLinkTokenQueryVariables>(PlaidLinkTokenDocument, options);
        }
export function usePlaidLinkTokenSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<PlaidLinkTokenQuery, PlaidLinkTokenQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<PlaidLinkTokenQuery, PlaidLinkTokenQueryVariables>(PlaidLinkTokenDocument, options);
        }
export type PlaidLinkTokenQueryHookResult = ReturnType<typeof usePlaidLinkTokenQuery>;
export type PlaidLinkTokenLazyQueryHookResult = ReturnType<typeof usePlaidLinkTokenLazyQuery>;
export type PlaidLinkTokenSuspenseQueryHookResult = ReturnType<typeof usePlaidLinkTokenSuspenseQuery>;
export type PlaidLinkTokenQueryResult = Apollo.QueryResult<PlaidLinkTokenQuery, PlaidLinkTokenQueryVariables>;
export const PlaidSetAccessTokenAndSyncAccountsDocument = gql`
    mutation PlaidSetAccessTokenAndSyncAccounts($publicToken: String!, $metaData: PlaidLinkOnSuccessMetadata!) {
  setAccessTokenAndSyncAccounts(publicToken: $publicToken, metaData: $metaData) {
    id
  }
}
    `;
export type PlaidSetAccessTokenAndSyncAccountsMutationFn = Apollo.MutationFunction<PlaidSetAccessTokenAndSyncAccountsMutation, PlaidSetAccessTokenAndSyncAccountsMutationVariables>;

/**
 * __usePlaidSetAccessTokenAndSyncAccountsMutation__
 *
 * To run a mutation, you first call `usePlaidSetAccessTokenAndSyncAccountsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePlaidSetAccessTokenAndSyncAccountsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [plaidSetAccessTokenAndSyncAccountsMutation, { data, loading, error }] = usePlaidSetAccessTokenAndSyncAccountsMutation({
 *   variables: {
 *      publicToken: // value for 'publicToken'
 *      metaData: // value for 'metaData'
 *   },
 * });
 */
export function usePlaidSetAccessTokenAndSyncAccountsMutation(baseOptions?: Apollo.MutationHookOptions<PlaidSetAccessTokenAndSyncAccountsMutation, PlaidSetAccessTokenAndSyncAccountsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<PlaidSetAccessTokenAndSyncAccountsMutation, PlaidSetAccessTokenAndSyncAccountsMutationVariables>(PlaidSetAccessTokenAndSyncAccountsDocument, options);
      }
export type PlaidSetAccessTokenAndSyncAccountsMutationHookResult = ReturnType<typeof usePlaidSetAccessTokenAndSyncAccountsMutation>;
export type PlaidSetAccessTokenAndSyncAccountsMutationResult = Apollo.MutationResult<PlaidSetAccessTokenAndSyncAccountsMutation>;
export type PlaidSetAccessTokenAndSyncAccountsMutationOptions = Apollo.BaseMutationOptions<PlaidSetAccessTokenAndSyncAccountsMutation, PlaidSetAccessTokenAndSyncAccountsMutationVariables>;
export const PlaidSyncDocument = gql`
    mutation PlaidSync($authConnectionId: String!) {
  syncAuthConnection(id: $authConnectionId) {
    id
  }
}
    `;
export type PlaidSyncMutationFn = Apollo.MutationFunction<PlaidSyncMutation, PlaidSyncMutationVariables>;

/**
 * __usePlaidSyncMutation__
 *
 * To run a mutation, you first call `usePlaidSyncMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePlaidSyncMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [plaidSyncMutation, { data, loading, error }] = usePlaidSyncMutation({
 *   variables: {
 *      authConnectionId: // value for 'authConnectionId'
 *   },
 * });
 */
export function usePlaidSyncMutation(baseOptions?: Apollo.MutationHookOptions<PlaidSyncMutation, PlaidSyncMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<PlaidSyncMutation, PlaidSyncMutationVariables>(PlaidSyncDocument, options);
      }
export type PlaidSyncMutationHookResult = ReturnType<typeof usePlaidSyncMutation>;
export type PlaidSyncMutationResult = Apollo.MutationResult<PlaidSyncMutation>;
export type PlaidSyncMutationOptions = Apollo.BaseMutationOptions<PlaidSyncMutation, PlaidSyncMutationVariables>;
export const SignedUrlsForUploadDocument = gql`
    query SignedUrlsForUpload($files: [GCPUploadFile!]!) {
  generateSignedUrlsForUpload(files: $files) {
    uploadUrls
  }
}
    `;

/**
 * __useSignedUrlsForUploadQuery__
 *
 * To run a query within a React component, call `useSignedUrlsForUploadQuery` and pass it any options that fit your needs.
 * When your component renders, `useSignedUrlsForUploadQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSignedUrlsForUploadQuery({
 *   variables: {
 *      files: // value for 'files'
 *   },
 * });
 */
export function useSignedUrlsForUploadQuery(baseOptions: Apollo.QueryHookOptions<SignedUrlsForUploadQuery, SignedUrlsForUploadQueryVariables> & ({ variables: SignedUrlsForUploadQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SignedUrlsForUploadQuery, SignedUrlsForUploadQueryVariables>(SignedUrlsForUploadDocument, options);
      }
export function useSignedUrlsForUploadLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SignedUrlsForUploadQuery, SignedUrlsForUploadQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SignedUrlsForUploadQuery, SignedUrlsForUploadQueryVariables>(SignedUrlsForUploadDocument, options);
        }
export function useSignedUrlsForUploadSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<SignedUrlsForUploadQuery, SignedUrlsForUploadQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<SignedUrlsForUploadQuery, SignedUrlsForUploadQueryVariables>(SignedUrlsForUploadDocument, options);
        }
export type SignedUrlsForUploadQueryHookResult = ReturnType<typeof useSignedUrlsForUploadQuery>;
export type SignedUrlsForUploadLazyQueryHookResult = ReturnType<typeof useSignedUrlsForUploadLazyQuery>;
export type SignedUrlsForUploadSuspenseQueryHookResult = ReturnType<typeof useSignedUrlsForUploadSuspenseQuery>;
export type SignedUrlsForUploadQueryResult = Apollo.QueryResult<SignedUrlsForUploadQuery, SignedUrlsForUploadQueryVariables>;
export const SignedUrlsForDownloadDocument = gql`
    query SignedUrlsForDownload($gcpFileNames: [String!]!) {
  genrerateSignedUrlsForDownload(gcpFileNames: $gcpFileNames) {
    downloadUrls
  }
}
    `;

/**
 * __useSignedUrlsForDownloadQuery__
 *
 * To run a query within a React component, call `useSignedUrlsForDownloadQuery` and pass it any options that fit your needs.
 * When your component renders, `useSignedUrlsForDownloadQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSignedUrlsForDownloadQuery({
 *   variables: {
 *      gcpFileNames: // value for 'gcpFileNames'
 *   },
 * });
 */
export function useSignedUrlsForDownloadQuery(baseOptions: Apollo.QueryHookOptions<SignedUrlsForDownloadQuery, SignedUrlsForDownloadQueryVariables> & ({ variables: SignedUrlsForDownloadQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SignedUrlsForDownloadQuery, SignedUrlsForDownloadQueryVariables>(SignedUrlsForDownloadDocument, options);
      }
export function useSignedUrlsForDownloadLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SignedUrlsForDownloadQuery, SignedUrlsForDownloadQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SignedUrlsForDownloadQuery, SignedUrlsForDownloadQueryVariables>(SignedUrlsForDownloadDocument, options);
        }
export function useSignedUrlsForDownloadSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<SignedUrlsForDownloadQuery, SignedUrlsForDownloadQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<SignedUrlsForDownloadQuery, SignedUrlsForDownloadQueryVariables>(SignedUrlsForDownloadDocument, options);
        }
export type SignedUrlsForDownloadQueryHookResult = ReturnType<typeof useSignedUrlsForDownloadQuery>;
export type SignedUrlsForDownloadLazyQueryHookResult = ReturnType<typeof useSignedUrlsForDownloadLazyQuery>;
export type SignedUrlsForDownloadSuspenseQueryHookResult = ReturnType<typeof useSignedUrlsForDownloadSuspenseQuery>;
export type SignedUrlsForDownloadQueryResult = Apollo.QueryResult<SignedUrlsForDownloadQuery, SignedUrlsForDownloadQueryVariables>;
export const CreateFilesDocument = gql`
    mutation CreateFiles($data: [FileCreateManyInput!]!) {
  createFiles(data: $data) {
    id
    ...FileItem
  }
}
    ${FileItemFragmentDoc}`;
export type CreateFilesMutationFn = Apollo.MutationFunction<CreateFilesMutation, CreateFilesMutationVariables>;

/**
 * __useCreateFilesMutation__
 *
 * To run a mutation, you first call `useCreateFilesMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateFilesMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createFilesMutation, { data, loading, error }] = useCreateFilesMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCreateFilesMutation(baseOptions?: Apollo.MutationHookOptions<CreateFilesMutation, CreateFilesMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateFilesMutation, CreateFilesMutationVariables>(CreateFilesDocument, options);
      }
export type CreateFilesMutationHookResult = ReturnType<typeof useCreateFilesMutation>;
export type CreateFilesMutationResult = Apollo.MutationResult<CreateFilesMutation>;
export type CreateFilesMutationOptions = Apollo.BaseMutationOptions<CreateFilesMutation, CreateFilesMutationVariables>;
export const InitAccountFileUploadDocument = gql`
    mutation InitAccountFileUpload($fileData: [InitFileUploadPayload!]!, $accountData: InitAccountFileUploadPayload!) {
  initAccountFileUpload(fileData: $fileData, accountData: $accountData) {
    id
    ...FileItem
  }
}
    ${FileItemFragmentDoc}`;
export type InitAccountFileUploadMutationFn = Apollo.MutationFunction<InitAccountFileUploadMutation, InitAccountFileUploadMutationVariables>;

/**
 * __useInitAccountFileUploadMutation__
 *
 * To run a mutation, you first call `useInitAccountFileUploadMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useInitAccountFileUploadMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [initAccountFileUploadMutation, { data, loading, error }] = useInitAccountFileUploadMutation({
 *   variables: {
 *      fileData: // value for 'fileData'
 *      accountData: // value for 'accountData'
 *   },
 * });
 */
export function useInitAccountFileUploadMutation(baseOptions?: Apollo.MutationHookOptions<InitAccountFileUploadMutation, InitAccountFileUploadMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<InitAccountFileUploadMutation, InitAccountFileUploadMutationVariables>(InitAccountFileUploadDocument, options);
      }
export type InitAccountFileUploadMutationHookResult = ReturnType<typeof useInitAccountFileUploadMutation>;
export type InitAccountFileUploadMutationResult = Apollo.MutationResult<InitAccountFileUploadMutation>;
export type InitAccountFileUploadMutationOptions = Apollo.BaseMutationOptions<InitAccountFileUploadMutation, InitAccountFileUploadMutationVariables>;
export const LotsCurrentForLotTypeDocument = gql`
    query LotsCurrentForLotType($lotValueType: LotValueType!) {
  lotCurrent(lotValueType: $lotValueType) {
    id
    ...LotCurrentItem
  }
}
    ${LotCurrentItemFragmentDoc}`;

/**
 * __useLotsCurrentForLotTypeQuery__
 *
 * To run a query within a React component, call `useLotsCurrentForLotTypeQuery` and pass it any options that fit your needs.
 * When your component renders, `useLotsCurrentForLotTypeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLotsCurrentForLotTypeQuery({
 *   variables: {
 *      lotValueType: // value for 'lotValueType'
 *   },
 * });
 */
export function useLotsCurrentForLotTypeQuery(baseOptions: Apollo.QueryHookOptions<LotsCurrentForLotTypeQuery, LotsCurrentForLotTypeQueryVariables> & ({ variables: LotsCurrentForLotTypeQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<LotsCurrentForLotTypeQuery, LotsCurrentForLotTypeQueryVariables>(LotsCurrentForLotTypeDocument, options);
      }
export function useLotsCurrentForLotTypeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<LotsCurrentForLotTypeQuery, LotsCurrentForLotTypeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<LotsCurrentForLotTypeQuery, LotsCurrentForLotTypeQueryVariables>(LotsCurrentForLotTypeDocument, options);
        }
export function useLotsCurrentForLotTypeSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<LotsCurrentForLotTypeQuery, LotsCurrentForLotTypeQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<LotsCurrentForLotTypeQuery, LotsCurrentForLotTypeQueryVariables>(LotsCurrentForLotTypeDocument, options);
        }
export type LotsCurrentForLotTypeQueryHookResult = ReturnType<typeof useLotsCurrentForLotTypeQuery>;
export type LotsCurrentForLotTypeLazyQueryHookResult = ReturnType<typeof useLotsCurrentForLotTypeLazyQuery>;
export type LotsCurrentForLotTypeSuspenseQueryHookResult = ReturnType<typeof useLotsCurrentForLotTypeSuspenseQuery>;
export type LotsCurrentForLotTypeQueryResult = Apollo.QueryResult<LotsCurrentForLotTypeQuery, LotsCurrentForLotTypeQueryVariables>;
export const DirectedHarvestDocument = gql`
    query DirectedHarvest($targetRealized: Float!, $targetUnrealized: Float!, $lots: [DirectedHarvestLot!]!) {
  directedHarvest(
    lots: $lots
    targetRealized: $targetRealized
    targetUnrealized: $targetUnrealized
  ) {
    realizedOrders {
      id
      ...HarvestLotOrderItem
    }
    unrealizedOrders {
      id
      ...HarvestLotOrderItem
    }
    allOrders {
      id
      ...HarvestLotOrderItem
    }
  }
}
    ${HarvestLotOrderItemFragmentDoc}`;

/**
 * __useDirectedHarvestQuery__
 *
 * To run a query within a React component, call `useDirectedHarvestQuery` and pass it any options that fit your needs.
 * When your component renders, `useDirectedHarvestQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDirectedHarvestQuery({
 *   variables: {
 *      targetRealized: // value for 'targetRealized'
 *      targetUnrealized: // value for 'targetUnrealized'
 *      lots: // value for 'lots'
 *   },
 * });
 */
export function useDirectedHarvestQuery(baseOptions: Apollo.QueryHookOptions<DirectedHarvestQuery, DirectedHarvestQueryVariables> & ({ variables: DirectedHarvestQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<DirectedHarvestQuery, DirectedHarvestQueryVariables>(DirectedHarvestDocument, options);
      }
export function useDirectedHarvestLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DirectedHarvestQuery, DirectedHarvestQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<DirectedHarvestQuery, DirectedHarvestQueryVariables>(DirectedHarvestDocument, options);
        }
export function useDirectedHarvestSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<DirectedHarvestQuery, DirectedHarvestQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<DirectedHarvestQuery, DirectedHarvestQueryVariables>(DirectedHarvestDocument, options);
        }
export type DirectedHarvestQueryHookResult = ReturnType<typeof useDirectedHarvestQuery>;
export type DirectedHarvestLazyQueryHookResult = ReturnType<typeof useDirectedHarvestLazyQuery>;
export type DirectedHarvestSuspenseQueryHookResult = ReturnType<typeof useDirectedHarvestSuspenseQuery>;
export type DirectedHarvestQueryResult = Apollo.QueryResult<DirectedHarvestQuery, DirectedHarvestQueryVariables>;
export const CreateHarvestDocument = gql`
    mutation CreateHarvest($directedHarvestLots: [DirectedHarvestLot!]!, $harvestType: HarvestType!) {
  createHarvest(
    directedHarvestLots: $directedHarvestLots
    harvestType: $harvestType
  ) {
    id
    ...HarvestItem
  }
}
    ${HarvestItemFragmentDoc}`;
export type CreateHarvestMutationFn = Apollo.MutationFunction<CreateHarvestMutation, CreateHarvestMutationVariables>;

/**
 * __useCreateHarvestMutation__
 *
 * To run a mutation, you first call `useCreateHarvestMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateHarvestMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createHarvestMutation, { data, loading, error }] = useCreateHarvestMutation({
 *   variables: {
 *      directedHarvestLots: // value for 'directedHarvestLots'
 *      harvestType: // value for 'harvestType'
 *   },
 * });
 */
export function useCreateHarvestMutation(baseOptions?: Apollo.MutationHookOptions<CreateHarvestMutation, CreateHarvestMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateHarvestMutation, CreateHarvestMutationVariables>(CreateHarvestDocument, options);
      }
export type CreateHarvestMutationHookResult = ReturnType<typeof useCreateHarvestMutation>;
export type CreateHarvestMutationResult = Apollo.MutationResult<CreateHarvestMutation>;
export type CreateHarvestMutationOptions = Apollo.BaseMutationOptions<CreateHarvestMutation, CreateHarvestMutationVariables>;
export const UpdateHarvestDocument = gql`
    mutation UpdateHarvest($id: String!, $data: HarvestUpdateInput!) {
  updateHarvest(id: $id, data: $data) {
    id
    ...HarvestItem
  }
}
    ${HarvestItemFragmentDoc}`;
export type UpdateHarvestMutationFn = Apollo.MutationFunction<UpdateHarvestMutation, UpdateHarvestMutationVariables>;

/**
 * __useUpdateHarvestMutation__
 *
 * To run a mutation, you first call `useUpdateHarvestMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateHarvestMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateHarvestMutation, { data, loading, error }] = useUpdateHarvestMutation({
 *   variables: {
 *      id: // value for 'id'
 *      data: // value for 'data'
 *   },
 * });
 */
export function useUpdateHarvestMutation(baseOptions?: Apollo.MutationHookOptions<UpdateHarvestMutation, UpdateHarvestMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateHarvestMutation, UpdateHarvestMutationVariables>(UpdateHarvestDocument, options);
      }
export type UpdateHarvestMutationHookResult = ReturnType<typeof useUpdateHarvestMutation>;
export type UpdateHarvestMutationResult = Apollo.MutationResult<UpdateHarvestMutation>;
export type UpdateHarvestMutationOptions = Apollo.BaseMutationOptions<UpdateHarvestMutation, UpdateHarvestMutationVariables>;
export const UpdateHarvestTransactionDocument = gql`
    mutation UpdateHarvestTransaction($id: String!, $data: HarvestTransactionUpdateInput!) {
  updateHarvestTransaction(id: $id, data: $data) {
    id
    ...HarvestTransactionRecord
  }
}
    ${HarvestTransactionRecordFragmentDoc}`;
export type UpdateHarvestTransactionMutationFn = Apollo.MutationFunction<UpdateHarvestTransactionMutation, UpdateHarvestTransactionMutationVariables>;

/**
 * __useUpdateHarvestTransactionMutation__
 *
 * To run a mutation, you first call `useUpdateHarvestTransactionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateHarvestTransactionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateHarvestTransactionMutation, { data, loading, error }] = useUpdateHarvestTransactionMutation({
 *   variables: {
 *      id: // value for 'id'
 *      data: // value for 'data'
 *   },
 * });
 */
export function useUpdateHarvestTransactionMutation(baseOptions?: Apollo.MutationHookOptions<UpdateHarvestTransactionMutation, UpdateHarvestTransactionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateHarvestTransactionMutation, UpdateHarvestTransactionMutationVariables>(UpdateHarvestTransactionDocument, options);
      }
export type UpdateHarvestTransactionMutationHookResult = ReturnType<typeof useUpdateHarvestTransactionMutation>;
export type UpdateHarvestTransactionMutationResult = Apollo.MutationResult<UpdateHarvestTransactionMutation>;
export type UpdateHarvestTransactionMutationOptions = Apollo.BaseMutationOptions<UpdateHarvestTransactionMutation, UpdateHarvestTransactionMutationVariables>;
export const UpdateHarvestTransactionItemDocument = gql`
    mutation UpdateHarvestTransactionItem($id: String!, $data: HarvestTransactionItemUpdateInput!) {
  updateHarvestTransactionItem(id: $id, data: $data) {
    id
    ...HarvestTransactionItemRecord
  }
}
    ${HarvestTransactionItemRecordFragmentDoc}`;
export type UpdateHarvestTransactionItemMutationFn = Apollo.MutationFunction<UpdateHarvestTransactionItemMutation, UpdateHarvestTransactionItemMutationVariables>;

/**
 * __useUpdateHarvestTransactionItemMutation__
 *
 * To run a mutation, you first call `useUpdateHarvestTransactionItemMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateHarvestTransactionItemMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateHarvestTransactionItemMutation, { data, loading, error }] = useUpdateHarvestTransactionItemMutation({
 *   variables: {
 *      id: // value for 'id'
 *      data: // value for 'data'
 *   },
 * });
 */
export function useUpdateHarvestTransactionItemMutation(baseOptions?: Apollo.MutationHookOptions<UpdateHarvestTransactionItemMutation, UpdateHarvestTransactionItemMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateHarvestTransactionItemMutation, UpdateHarvestTransactionItemMutationVariables>(UpdateHarvestTransactionItemDocument, options);
      }
export type UpdateHarvestTransactionItemMutationHookResult = ReturnType<typeof useUpdateHarvestTransactionItemMutation>;
export type UpdateHarvestTransactionItemMutationResult = Apollo.MutationResult<UpdateHarvestTransactionItemMutation>;
export type UpdateHarvestTransactionItemMutationOptions = Apollo.BaseMutationOptions<UpdateHarvestTransactionItemMutation, UpdateHarvestTransactionItemMutationVariables>;
export const HarvestDocument = gql`
    query Harvest($id: String!) {
  harvest(id: $id) {
    id
    ...HarvestItem
  }
}
    ${HarvestItemFragmentDoc}`;

/**
 * __useHarvestQuery__
 *
 * To run a query within a React component, call `useHarvestQuery` and pass it any options that fit your needs.
 * When your component renders, `useHarvestQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useHarvestQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useHarvestQuery(baseOptions: Apollo.QueryHookOptions<HarvestQuery, HarvestQueryVariables> & ({ variables: HarvestQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<HarvestQuery, HarvestQueryVariables>(HarvestDocument, options);
      }
export function useHarvestLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<HarvestQuery, HarvestQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<HarvestQuery, HarvestQueryVariables>(HarvestDocument, options);
        }
export function useHarvestSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<HarvestQuery, HarvestQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<HarvestQuery, HarvestQueryVariables>(HarvestDocument, options);
        }
export type HarvestQueryHookResult = ReturnType<typeof useHarvestQuery>;
export type HarvestLazyQueryHookResult = ReturnType<typeof useHarvestLazyQuery>;
export type HarvestSuspenseQueryHookResult = ReturnType<typeof useHarvestSuspenseQuery>;
export type HarvestQueryResult = Apollo.QueryResult<HarvestQuery, HarvestQueryVariables>;
export const FinalizeHarvestDocument = gql`
    mutation FinalizeHarvest($id: String!) {
  finalizeHarvest(id: $id) {
    id
    ...HarvestItem
  }
}
    ${HarvestItemFragmentDoc}`;
export type FinalizeHarvestMutationFn = Apollo.MutationFunction<FinalizeHarvestMutation, FinalizeHarvestMutationVariables>;

/**
 * __useFinalizeHarvestMutation__
 *
 * To run a mutation, you first call `useFinalizeHarvestMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useFinalizeHarvestMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [finalizeHarvestMutation, { data, loading, error }] = useFinalizeHarvestMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useFinalizeHarvestMutation(baseOptions?: Apollo.MutationHookOptions<FinalizeHarvestMutation, FinalizeHarvestMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<FinalizeHarvestMutation, FinalizeHarvestMutationVariables>(FinalizeHarvestDocument, options);
      }
export type FinalizeHarvestMutationHookResult = ReturnType<typeof useFinalizeHarvestMutation>;
export type FinalizeHarvestMutationResult = Apollo.MutationResult<FinalizeHarvestMutation>;
export type FinalizeHarvestMutationOptions = Apollo.BaseMutationOptions<FinalizeHarvestMutation, FinalizeHarvestMutationVariables>;
export const PortfolioLotsDocument = gql`
    query PortfolioLots($where: LotWhereInput, $includeTaxAdvantaged: Boolean) {
  lots(where: $where, includeTaxAdvantaged: $includeTaxAdvantaged) {
    id
    ...LotItem
  }
}
    ${LotItemFragmentDoc}`;

/**
 * __usePortfolioLotsQuery__
 *
 * To run a query within a React component, call `usePortfolioLotsQuery` and pass it any options that fit your needs.
 * When your component renders, `usePortfolioLotsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePortfolioLotsQuery({
 *   variables: {
 *      where: // value for 'where'
 *      includeTaxAdvantaged: // value for 'includeTaxAdvantaged'
 *   },
 * });
 */
export function usePortfolioLotsQuery(baseOptions?: Apollo.QueryHookOptions<PortfolioLotsQuery, PortfolioLotsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PortfolioLotsQuery, PortfolioLotsQueryVariables>(PortfolioLotsDocument, options);
      }
export function usePortfolioLotsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PortfolioLotsQuery, PortfolioLotsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PortfolioLotsQuery, PortfolioLotsQueryVariables>(PortfolioLotsDocument, options);
        }
export function usePortfolioLotsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<PortfolioLotsQuery, PortfolioLotsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<PortfolioLotsQuery, PortfolioLotsQueryVariables>(PortfolioLotsDocument, options);
        }
export type PortfolioLotsQueryHookResult = ReturnType<typeof usePortfolioLotsQuery>;
export type PortfolioLotsLazyQueryHookResult = ReturnType<typeof usePortfolioLotsLazyQuery>;
export type PortfolioLotsSuspenseQueryHookResult = ReturnType<typeof usePortfolioLotsSuspenseQuery>;
export type PortfolioLotsQueryResult = Apollo.QueryResult<PortfolioLotsQuery, PortfolioLotsQueryVariables>;
export const PortfoliosDocument = gql`
    query Portfolios {
  portfolios {
    ...PortfolioItem
  }
}
    ${PortfolioItemFragmentDoc}`;

/**
 * __usePortfoliosQuery__
 *
 * To run a query within a React component, call `usePortfoliosQuery` and pass it any options that fit your needs.
 * When your component renders, `usePortfoliosQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePortfoliosQuery({
 *   variables: {
 *   },
 * });
 */
export function usePortfoliosQuery(baseOptions?: Apollo.QueryHookOptions<PortfoliosQuery, PortfoliosQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PortfoliosQuery, PortfoliosQueryVariables>(PortfoliosDocument, options);
      }
export function usePortfoliosLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PortfoliosQuery, PortfoliosQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PortfoliosQuery, PortfoliosQueryVariables>(PortfoliosDocument, options);
        }
export function usePortfoliosSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<PortfoliosQuery, PortfoliosQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<PortfoliosQuery, PortfoliosQueryVariables>(PortfoliosDocument, options);
        }
export type PortfoliosQueryHookResult = ReturnType<typeof usePortfoliosQuery>;
export type PortfoliosLazyQueryHookResult = ReturnType<typeof usePortfoliosLazyQuery>;
export type PortfoliosSuspenseQueryHookResult = ReturnType<typeof usePortfoliosSuspenseQuery>;
export type PortfoliosQueryResult = Apollo.QueryResult<PortfoliosQuery, PortfoliosQueryVariables>;
export const CreatePortfolioDocument = gql`
    mutation CreatePortfolio($portfolioInsertObject: PortfolioCreateInput!) {
  createPortfolio(portfolioInsertObject: $portfolioInsertObject) {
    ...PortfolioDetailItem
  }
}
    ${PortfolioDetailItemFragmentDoc}`;
export type CreatePortfolioMutationFn = Apollo.MutationFunction<CreatePortfolioMutation, CreatePortfolioMutationVariables>;

/**
 * __useCreatePortfolioMutation__
 *
 * To run a mutation, you first call `useCreatePortfolioMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreatePortfolioMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createPortfolioMutation, { data, loading, error }] = useCreatePortfolioMutation({
 *   variables: {
 *      portfolioInsertObject: // value for 'portfolioInsertObject'
 *   },
 * });
 */
export function useCreatePortfolioMutation(baseOptions?: Apollo.MutationHookOptions<CreatePortfolioMutation, CreatePortfolioMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreatePortfolioMutation, CreatePortfolioMutationVariables>(CreatePortfolioDocument, options);
      }
export type CreatePortfolioMutationHookResult = ReturnType<typeof useCreatePortfolioMutation>;
export type CreatePortfolioMutationResult = Apollo.MutationResult<CreatePortfolioMutation>;
export type CreatePortfolioMutationOptions = Apollo.BaseMutationOptions<CreatePortfolioMutation, CreatePortfolioMutationVariables>;
export const PortfolioAuthedDocument = gql`
    query PortfolioAuthed {
  portfolioAuthed {
    ...PortfolioItem
  }
}
    ${PortfolioItemFragmentDoc}`;

/**
 * __usePortfolioAuthedQuery__
 *
 * To run a query within a React component, call `usePortfolioAuthedQuery` and pass it any options that fit your needs.
 * When your component renders, `usePortfolioAuthedQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePortfolioAuthedQuery({
 *   variables: {
 *   },
 * });
 */
export function usePortfolioAuthedQuery(baseOptions?: Apollo.QueryHookOptions<PortfolioAuthedQuery, PortfolioAuthedQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PortfolioAuthedQuery, PortfolioAuthedQueryVariables>(PortfolioAuthedDocument, options);
      }
export function usePortfolioAuthedLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PortfolioAuthedQuery, PortfolioAuthedQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PortfolioAuthedQuery, PortfolioAuthedQueryVariables>(PortfolioAuthedDocument, options);
        }
export function usePortfolioAuthedSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<PortfolioAuthedQuery, PortfolioAuthedQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<PortfolioAuthedQuery, PortfolioAuthedQueryVariables>(PortfolioAuthedDocument, options);
        }
export type PortfolioAuthedQueryHookResult = ReturnType<typeof usePortfolioAuthedQuery>;
export type PortfolioAuthedLazyQueryHookResult = ReturnType<typeof usePortfolioAuthedLazyQuery>;
export type PortfolioAuthedSuspenseQueryHookResult = ReturnType<typeof usePortfolioAuthedSuspenseQuery>;
export type PortfolioAuthedQueryResult = Apollo.QueryResult<PortfolioAuthedQuery, PortfolioAuthedQueryVariables>;
export const PortfolioDetailAuthedDocument = gql`
    query PortfolioDetailAuthed {
  portfolioAuthed {
    ...PortfolioDetailItem
  }
}
    ${PortfolioDetailItemFragmentDoc}`;

/**
 * __usePortfolioDetailAuthedQuery__
 *
 * To run a query within a React component, call `usePortfolioDetailAuthedQuery` and pass it any options that fit your needs.
 * When your component renders, `usePortfolioDetailAuthedQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePortfolioDetailAuthedQuery({
 *   variables: {
 *   },
 * });
 */
export function usePortfolioDetailAuthedQuery(baseOptions?: Apollo.QueryHookOptions<PortfolioDetailAuthedQuery, PortfolioDetailAuthedQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PortfolioDetailAuthedQuery, PortfolioDetailAuthedQueryVariables>(PortfolioDetailAuthedDocument, options);
      }
export function usePortfolioDetailAuthedLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PortfolioDetailAuthedQuery, PortfolioDetailAuthedQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PortfolioDetailAuthedQuery, PortfolioDetailAuthedQueryVariables>(PortfolioDetailAuthedDocument, options);
        }
export function usePortfolioDetailAuthedSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<PortfolioDetailAuthedQuery, PortfolioDetailAuthedQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<PortfolioDetailAuthedQuery, PortfolioDetailAuthedQueryVariables>(PortfolioDetailAuthedDocument, options);
        }
export type PortfolioDetailAuthedQueryHookResult = ReturnType<typeof usePortfolioDetailAuthedQuery>;
export type PortfolioDetailAuthedLazyQueryHookResult = ReturnType<typeof usePortfolioDetailAuthedLazyQuery>;
export type PortfolioDetailAuthedSuspenseQueryHookResult = ReturnType<typeof usePortfolioDetailAuthedSuspenseQuery>;
export type PortfolioDetailAuthedQueryResult = Apollo.QueryResult<PortfolioDetailAuthedQuery, PortfolioDetailAuthedQueryVariables>;
export const SwitchPortfolioDocument = gql`
    mutation SwitchPortfolio($porfolioId: String!) {
  switchPortfolio(porfolioId: $porfolioId) {
    ...PortfolioItem
  }
}
    ${PortfolioItemFragmentDoc}`;
export type SwitchPortfolioMutationFn = Apollo.MutationFunction<SwitchPortfolioMutation, SwitchPortfolioMutationVariables>;

/**
 * __useSwitchPortfolioMutation__
 *
 * To run a mutation, you first call `useSwitchPortfolioMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSwitchPortfolioMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [switchPortfolioMutation, { data, loading, error }] = useSwitchPortfolioMutation({
 *   variables: {
 *      porfolioId: // value for 'porfolioId'
 *   },
 * });
 */
export function useSwitchPortfolioMutation(baseOptions?: Apollo.MutationHookOptions<SwitchPortfolioMutation, SwitchPortfolioMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SwitchPortfolioMutation, SwitchPortfolioMutationVariables>(SwitchPortfolioDocument, options);
      }
export type SwitchPortfolioMutationHookResult = ReturnType<typeof useSwitchPortfolioMutation>;
export type SwitchPortfolioMutationResult = Apollo.MutationResult<SwitchPortfolioMutation>;
export type SwitchPortfolioMutationOptions = Apollo.BaseMutationOptions<SwitchPortfolioMutation, SwitchPortfolioMutationVariables>;
export const PortfolioPositionsDocument = gql`
    query PortfolioPositions {
  portfolioPositions {
    id
    ...PositionItem
  }
}
    ${PositionItemFragmentDoc}`;

/**
 * __usePortfolioPositionsQuery__
 *
 * To run a query within a React component, call `usePortfolioPositionsQuery` and pass it any options that fit your needs.
 * When your component renders, `usePortfolioPositionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePortfolioPositionsQuery({
 *   variables: {
 *   },
 * });
 */
export function usePortfolioPositionsQuery(baseOptions?: Apollo.QueryHookOptions<PortfolioPositionsQuery, PortfolioPositionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PortfolioPositionsQuery, PortfolioPositionsQueryVariables>(PortfolioPositionsDocument, options);
      }
export function usePortfolioPositionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PortfolioPositionsQuery, PortfolioPositionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PortfolioPositionsQuery, PortfolioPositionsQueryVariables>(PortfolioPositionsDocument, options);
        }
export function usePortfolioPositionsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<PortfolioPositionsQuery, PortfolioPositionsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<PortfolioPositionsQuery, PortfolioPositionsQueryVariables>(PortfolioPositionsDocument, options);
        }
export type PortfolioPositionsQueryHookResult = ReturnType<typeof usePortfolioPositionsQuery>;
export type PortfolioPositionsLazyQueryHookResult = ReturnType<typeof usePortfolioPositionsLazyQuery>;
export type PortfolioPositionsSuspenseQueryHookResult = ReturnType<typeof usePortfolioPositionsSuspenseQuery>;
export type PortfolioPositionsQueryResult = Apollo.QueryResult<PortfolioPositionsQuery, PortfolioPositionsQueryVariables>;
export const Chart3MonthDocument = gql`
    query Chart3Month($asset: String!) {
  chartThreeMonth(asset: $asset) {
    c
    t
    o
    h
    l
    vw
    v
    n
  }
}
    `;

/**
 * __useChart3MonthQuery__
 *
 * To run a query within a React component, call `useChart3MonthQuery` and pass it any options that fit your needs.
 * When your component renders, `useChart3MonthQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useChart3MonthQuery({
 *   variables: {
 *      asset: // value for 'asset'
 *   },
 * });
 */
export function useChart3MonthQuery(baseOptions: Apollo.QueryHookOptions<Chart3MonthQuery, Chart3MonthQueryVariables> & ({ variables: Chart3MonthQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<Chart3MonthQuery, Chart3MonthQueryVariables>(Chart3MonthDocument, options);
      }
export function useChart3MonthLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<Chart3MonthQuery, Chart3MonthQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<Chart3MonthQuery, Chart3MonthQueryVariables>(Chart3MonthDocument, options);
        }
export function useChart3MonthSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<Chart3MonthQuery, Chart3MonthQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<Chart3MonthQuery, Chart3MonthQueryVariables>(Chart3MonthDocument, options);
        }
export type Chart3MonthQueryHookResult = ReturnType<typeof useChart3MonthQuery>;
export type Chart3MonthLazyQueryHookResult = ReturnType<typeof useChart3MonthLazyQuery>;
export type Chart3MonthSuspenseQueryHookResult = ReturnType<typeof useChart3MonthSuspenseQuery>;
export type Chart3MonthQueryResult = Apollo.QueryResult<Chart3MonthQuery, Chart3MonthQueryVariables>;