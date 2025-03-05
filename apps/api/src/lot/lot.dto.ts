import { TaxGain } from "../portfolio/portfolio.dto";

export enum LotValueType {
  GAIN = "GAIN",
  LOSS = "LOSS",
}

export interface LotCurrent {
  id: string;
  accountId: string;
  remainingQty: string;
  acquiredDate: Date;
  price: string;
  symbol: string;
  lastPrice: string;
  costBasis: string;
  value: string;
  gainTotal: string;
  gainTotalPct: string;
  dollarPerSharePnL: string;
  taxGain: TaxGain;
}
