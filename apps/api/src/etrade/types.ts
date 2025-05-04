import { AccountInstitution, AccountMode, AccountStatus } from '@prisma/client'

export interface EtradeAccount {
  accountId: string
  accountIdKey: string
  accountMode: AccountMode
  accountDesc: string
  accountName: string
  accountType: string
  institutionType: AccountInstitution
  accountStatus: AccountStatus
  closedDate: number
  shareWorksAccount: boolean
  fcManagedMssbClosedAccount: boolean
}

export interface EtradeAccountListResponse {
  AccountListResponse: {
    Accounts: {
      Account: EtradeAccount[]
    }
  }
}

interface BalanceResponse {
  accountId: string
  accountType: string
  optionLevel: string
  accountDescription?: string
  Cash?: { fundsForOpenOrdersCash: number, moneyMktBalance: number }
  Computed?: {
    cashAvailableForInvestment?: number
    cashAvailableForWithdrawal?: number
    netCash?: number
    cashBalance?: number
    settledCashForInvestment?: number
    cashBuyingPower?: number
    unSettledCashForInvestment?: number
    fundsWithheldFromPurchasePower?: number
    fundsWithheldFromWithdrawal?: number
    OpenCalls?: {
      cashCall?: number
    }
    RealTimeValues?: {
      totalAccountValue?: number
      netMv?: number
      netMvLong?: number
    }
    marginBuyingPower?: number
    dtMarginBuyingPower?: number
    shortAdjustBalance?: number
    accountBalance?: number
    regtEquity?: number
    regtEquityPercent?: number
  }
  Margin?: {
    dtCashOpenOrderReserve?: number
    dtMarginOpenOrderReserve?: number
  }
}

export interface EtradeBalanceResponse {
  BalanceResponse?: BalanceResponse
}

interface Product {
  symbol: string
  securityType?: string
  expiryYear?: number
  expiryMonth?: number
  expiryDay?: number
  strikePrice?: number
  productId: {
    symbol: string
    typeCode: string
  }
}

interface Quick {
  lastTrade?: number
  lastTradeTime?: number
  change?: number
  changePct?: number
  volume?: number
}

interface Position {
  positionId: number
  symbolDescription?: string
  dateAcquired?: number
  pricePaid?: number
  commissions?: number
  otherFees?: number
  quantity?: number
  positionIndicator?: string
  positionType?: string
  daysGain?: number
  daysGainPct?: number
  marketValue?: number
  totalCost?: number
  totalGain?: number
  totalGainPct?: number
  pctOfPortfolio?: number
  costPerShare?: number
  todayCommissions?: number
  todayFees?: number
  todayPricePaid?: number
  todayQuantity?: number
  quoteDetails?: string
  Product: Product
  Quick?: Quick
  dateExpiration?: number
  change?: number
  quoteStatus?: string
  lotsDetails: string
}

interface AccountPortfolio {
  accountId: string
  Position?: Position[]
  totalPages?: number
}

export interface EtradePortfolioResponse {
  PortfolioResponse?: {
    AccountPortfolio?: AccountPortfolio[]
  }
}

export interface LotDetailResponse {
  PositionLotsResponse: {
    PositionLot: {
      positionId: number
      positionLotId: number
      price: number
      termCode: number
      daysGain: number
      daysGainPct: number
      marketValue: number
      totalCost: number
      totalCostForGainPct: number
      totalGain: number
      lotSourceCode: number
      originalQty: number
      remainingQty: number
      availableQty: number
      orderNo: number
      legNo: number
      acquiredDate: number
      locationCode: number
      exchangeRate: number
      settlementCurrency: string
      paymentCurrency: string
      adjPrice: number
      commPerShare: number
      feesPerShare: number
      shortType: number
    }[]
  }
}

export interface TransactionListResponse {
  TransactionListResponse: {
    pageMarkers?: string
    moreTransactions?: boolean
    transactionCount?: number
    totalCount?: number
    Transaction?: {
      transactionId: string
      accountId?: string
      transactionDate?: number
      postDate?: number
      amount?: number
      transactionType?: string
      memo?: string
      imageFlag?: boolean
      instType?: string
      storeId?: number
      brokerage?: {
        product?: {
          symbol?: string
          securityType?: string
        }
        quantity?: number
        price?: number
        settlementCurrency?: string
        paymentCurrency?: string
        fee?: number
        displaySymbol?: string
        settlementDate?: number
      }
      detailsURI?: string
      description?: string
    }[]
  }
}
