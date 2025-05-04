import { IAggsQuery } from '@polygon.io/client-js'

/**
 * c: cLose price
 * h: highest prioce in the window
 * l: low price in the window
 * n: number of transactions in the window
 * o: open price
 * v: trading volume in the window
 * vw:volume weighted average price
 */
export interface PolygonTickerSnapshot {
  c: number
  h: number
  l: number
  n: number
  o: number
  v: number
  vw: number
  t: number
}

export enum PolygonTimespan {
  second = 'second',
  minute = 'minute',
  hour = 'hour',
  day = 'day',
  week = 'week',
  month = 'month',
  quarter = 'quarter',
  year = 'year',
}

export interface AggsQuery {
  limit?: number
}

export interface PolygonAggregateInput {
  ticker: string
  timespan?: PolygonTimespan
  multiplier?: number
  from: Date
  to: Date
  adjusted?: boolean
  aggsQuery?: IAggsQuery
}
