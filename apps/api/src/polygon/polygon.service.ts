import type { ConfigService } from '@nestjs/config'
import type { IAggs, IGlobalOptions, IRestClient } from '@polygon.io/client-js'
import type { Insertable, Updateable } from 'kysely'
import type { Database } from '../database/database'
import type { Asset } from '../database/db.d'
import type { PolygonAggregateInput } from './polygon.dto'

import { Inject, Injectable, Logger } from '@nestjs/common'
import { Field, ObjectType } from '@nestjs/graphql'
import { PolygonTimespan } from './polygon.dto'

@ObjectType()
export class PolygonStockData {
  @Field(() => Number, {
    description:
      'The Unix Msec timestamp for the start of the aggregate window.',
    nullable: true,
  })
  t?: number

  @Field(() => Number, {
    description: 'The open price for the symbol in the given time period.',
    nullable: true,
  })
  o?: number

  @Field(() => Number, {
    description: 'The highest price for the symbol in the given time period.',
    nullable: true,
  })
  h?: number

  @Field(() => Number, {
    description: 'The lowest price for the symbol in the given time period.',
    nullable: true,
  })
  l?: number

  @Field(() => Number, {
    description: 'The close price for the symbol in the given time period.',
    nullable: true,
  })
  c?: number

  @Field(() => Number, {
    description: 'The trading volume of the symbol in the given time period.',
    nullable: true,
  })
  v?: number

  @Field(() => Number, {
    description: 'The volume weighted average price.',
    nullable: true,
  })
  vw?: number

  @Field(() => Number, {
    description: 'The number of transactions in the aggregate window.',
    nullable: true,
  })
  n?: number
}

@Injectable()
export class PolygonService {
  private readonly logger = new Logger(PolygonService.name)
  private readonly polygonBaseURL = 'https://api.polygon.io'
  constructor(
    @Inject('POLYGON_CLIENT') private polygonClient: IRestClient,
    private readonly configService: ConfigService,
    private readonly db: Database,
  ) {}

  async ingestHourly({ from, to }: { from: Date, to: Date }) {
    return Promise.all(
      PolygonService.assets.map(ticker =>
        this.processAggregates({
          aggsQuery: {
            limit: 50_000,
          },
          from: new Date(from),
          globalOptions: {
            pagination: true,
          },
          ticker,
          timespan: PolygonTimespan.hour,
          to: new Date(to),
        }),
      ),
    )
  }

  /**
   * Queries and saves the polygon aggregate bars for a given ticker
   */
  async processAggregates({
    aggsQuery,
    from,
    globalOptions,
    multiplier = 1,
    ticker,
    timespan = PolygonTimespan.day,
    to,
  }: PolygonAggregateInput & { globalOptions?: IGlobalOptions }) {
    try {
      await this.processAsset(ticker)
    }
    catch (error) {
      this.logger.error(`Could not process ${ticker} ${JSON.stringify(error)}`)
      return
    }
    await this.polygonClient.stocks
      .aggregates(
        ticker,
        multiplier,
        timespan,
        PolygonService.formatDate(from),
        PolygonService.formatDate(to),
        aggsQuery,
        globalOptions,
      )
      .then((result) => {
        if (!result.ticker) {
          throw new Error('No ticker in result')
        }
        void this.processAggregateResults(result.ticker, result.results)
        if (result.next_url) {
          return this.processNextAggregatesPage(result.next_url)
        }
      })
      .catch((error) => {
        this.logger.error('An error happened:', JSON.stringify(error))
      })
  }

  chartThreeMonth({ asset }: { asset: string }): Promise<IAggs> {
    const to = new Date()
    const from = new Date()
    from.setMonth(from.getMonth() - 3)

    return this.polygonClient.stocks.aggregates(
      asset.toUpperCase(),
      1,
      'day',
      PolygonService.formatDate(from),
      PolygonService.formatDate(to),
      { adjusted: 'true', sort: 'asc' },
    )
  }

  processNextAggregatesPage(nextUrl: string) {
    return fetch(
      `${nextUrl}&${new URLSearchParams({
        apiKey: this.configService.get<string>('POLYGON_API_KEY') ?? '',
      })}`,
    )
      .then(data => data.json())
      .then(async (result: IAggs) => {
        if (!result.ticker) {
          throw new Error('No assest in result')
        }
        await this.processAggregateResults(result.ticker, result.results)
        if (result.next_url) {
          void this.processNextAggregatesPage(result.next_url)
        }
      })
      .catch((error: unknown) => {
        this.logger.error('Failure to process assest hourly price', error)
      })
  }

  async updateAllAssetPrices() {
    const batchSize = 1000
    return this.polygonClient.stocks
      .snapshotAllTickers()
      .then(async (results) => {
        const tickers = results.tickers ?? []
        for (let i = 0; i < tickers.length; i += batchSize) {
          const batch = tickers.slice(i, i + batchSize)
          await this.db
            .insertInto('Asset')
            .values(
              batch
                .map(tickerData => ({
                  lastClose: tickerData.day?.c,
                  lastHigh: tickerData.day?.h,
                  lastLow: tickerData.day?.l,
                  lastOpen: tickerData.day?.o,
                  lastPrice: tickerData.day?.c,
                  lastUpdated: tickerData.updated
                    ? new Date(tickerData.updated / 1000)
                    : new Date(),
                  lastVolume: tickerData.day?.v,
                  lastVolumeWeighted: tickerData.day?.vw,
                  symbol: tickerData.ticker ?? '',
                  todaysChange: tickerData.todaysChange,
                  todaysChangePerc: tickerData.todaysChangePerc,
                }))
                .filter(insertObjects => insertObjects.symbol),
            )
            .onConflict(oc =>
              oc.column('symbol').doUpdateSet(eb => ({
                lastClose: eb.ref('excluded.lastClose'),
                lastHigh: eb.ref('excluded.lastHigh'),
                lastLow: eb.ref('excluded.lastLow'),
                lastOpen: eb.ref('excluded.lastOpen'),
                lastPrice: eb.ref('excluded.lastPrice'),
                lastUpdated: eb.ref('excluded.lastUpdated'),
                lastVolume: eb.ref('excluded.lastVolume'),
                lastVolumeWeighted: eb.ref('excluded.lastVolumeWeighted'),
                todaysChange: eb.ref('excluded.todaysChange'),
                todaysChangePerc: eb.ref('excluded.todaysChangePerc'),
              })),
            )
            .execute()
        }
      })
  }

  // TODO: uses prev close for now - update to relatime when we upgrade polygon
  updateAssetLastPrice({
    asset,
    date = new Date(),
  }: {
    asset: string
    date?: Date
  }) {
    this.polygonClient.stocks
      .previousClose(asset)
      .then((data) => {
        const result = data.results?.pop()
        if (result?.T) {
          return this.db
            .insertInto('Asset')
            .values({
              lastPrice: result.c,
              lastUpdated: new Date(),
              symbol: result.T,
            })
            .onConflict(oc =>
              oc.column('symbol').doUpdateSet(eb => ({
                lastPrice: eb.ref('excluded.lastPrice'),
                lastUpdated: eb.ref('excluded.lastUpdated'),
              })),
            )
            .execute()
        }
        else {
          throw new Error(`
          dailyOpenClose did not return a asset symbol for ${asset}:${date.toISOString()}

          Cannot upsert with asset.
          `)
        }
      })
      .catch((error: unknown) => {
        this.logger.error(`Could not update asset ${asset}`)
        this.logger.error(error)
      })
  }

  /**
   * Requests and saves asset info from Polygon to our database
   * @param asset Unique asset string
   * @returns asset object
   */
  async processAsset(asset: string) {
    return fetch(
      `${
        this.polygonBaseURL
      }/v3/reference/tickers/${asset}?${new URLSearchParams({
        apiKey: this.configService.get<string>('POLYGON_API_KEY') ?? '',
      })}`,
    )
      .then(data => data.json())
      .then(async ({ results }) => {
        if (!results) {
          this.logger.log({ asset })
          throw new Error(`No polygon results for ${asset}`)
        }
        const assetInput = this.transformAPIAssetObject(results)
        await this.db
          .insertInto('Asset')
          .values(assetInput)
          .onConflict(oc =>
            oc.column('symbol').doUpdateSet(assetInput as Updateable<Asset>),
          )
          .execute()
      })
  }

  /**
   * Saves a list of polygon aggregate bars to the hourly price table for the asset
   * @param asset Unique asset string
   * @param results Polygon list of aggregate bar resutls
   * @returns aggregate results
   */
  private processAggregateResults(asset: string, results: IAggs['results']) {
    if (!results) {
      throw new Error('No results for aggregates')
    }
    return this.db
      .insertInto('PriceHourly')
      .values(
        results.map((result) => {
          if (!result) {
            throw new Error('No aggregates result')
          }
          return {
            assetSymbol: asset,
            close: Math.trunc((result.c ?? 0) * 100),
            high: Math.trunc((result.h ?? 0) * 100),
            low: Math.trunc((result.l ?? 0) * 100),
            numberOfTransactions: result.n ?? 0,
            open: Math.trunc((result.o ?? 0) * 100),
            startDate: new Date(result.t ?? 0),
            volume: Math.trunc(result.v ?? 0),
            volumeWeightAverage: Math.trunc((result.vw ?? 0) * 100),
          }
        }),
      )
      .onConflict(oc =>
        oc.columns(['assetSymbol', 'startDate']).doUpdateSet(eb => ({
          close: eb.ref('excluded.close'),
          high: eb.ref('excluded.high'),
          low: eb.ref('excluded.low'),
          numberOfTransactions: eb.ref('excluded.numberOfTransactions'),
          open: eb.ref('excluded.open'),
          volume: eb.ref('excluded.volume'),
          volumeWeightAverage: eb.ref('excluded.volumeWeightAverage'),
        })),
      )
      .execute()
  }

  /**
   * Transforms polygon ticker data to internal database model
   * @param tickerObject Polygon ticker data object
   * @returns
   */
  /* eslint-disable ts/no-explicit-any */
  private transformAPIAssetObject(tickerObject: any): Insertable<Asset> {
    return {
      active: tickerObject.active ?? true,
      assetClass: tickerObject.market,
      assetTypeCode: tickerObject.type,
      cik: tickerObject.cik,
      compositeFigi: tickerObject.composite_figi,
      currencyName: tickerObject.currency_name,
      delistedDate: tickerObject.delisted_utc
        ? new Date(tickerObject.delisted_utc)
        : null,
      description: tickerObject.description,
      homepageUrl: tickerObject.homepage_url,
      iconUrl: tickerObject.branding?.icon_url,
      listDate: tickerObject.list_date
        ? new Date(tickerObject.list_date)
        : null,
      locale: tickerObject.locale,
      logoUrl: tickerObject.branding?.logo_url,
      marketCap: tickerObject.market_cap
        ? tickerObject.market_cap.toString()
        : null,
      name: tickerObject.name,
      primaryExchange: tickerObject.primary_exchange,
      shareClassSharesOutstanding: tickerObject.share_class_shares_outstanding
        ? tickerObject.share_class_shares_outstanding.toString()
        : null,
      sicCode: tickerObject.sic_code,
      sicDescription: tickerObject.sic_description,
      symbol: tickerObject.ticker as string,
      totalEmployees: tickerObject.total_employees,
    }
  }

  /**
   * Simple function to convert datetie to simpe date string (YYYY-MM-DD)
   * @param date Date object
   * @returns date string
   */
  private static formatDate(date: Date) {
    return date.toISOString().split('T')[0]
  }

  static assets = [
    'MMM',
    'AOS',
    'ABT',
    'ABBV',
    'ACN',
    'ADBE',
    'AMD',
    'AES',
    'AFL',
    'A',
    'APD',
    'ABNB',
    'AKAM',
    'ALB',
    'ARE',
    'ALGN',
    'ALLE',
    'LNT',
    'ALL',
    'GOOGL',
    'GOOG',
    'MO',
    'AMZN',
    'AMCR',
    'AEE',
    'AAL',
    'AEP',
    'AXP',
    'AIG',
    'AMT',
    'AWK',
    'AMP',
    'AME',
    'AMGN',
    'APH',
    'ADI',
    'ANSS',
    'AON',
    'APA',
    'AAPL',
    'AMAT',
    'APTV',
    'ACGL',
    'ADM',
    'ANET',
    'AJG',
    'AIZ',
    'T',
    'ATO',
    'ADSK',
    'ADP',
    'AZO',
    'AVB',
    'AVY',
    'AXON',
    'BKR',
    'BALL',
    'BAC',
    'BK',
    'BBWI',
    'BAX',
    'BDX',
    'BRK.B',
    'BBY',
    'BIO',
    'TECH',
    'BIIB',
    'BLK',
    'BX',
    'BA',
    'BKNG',
    'BWA',
    'BXP',
    'BSX',
    'BMY',
    'AVGO',
    'BR',
    'BRO',
    'BF.B',
    'BLDR',
    'BG',
    'CDNS',
    'CZR',
    'CPT',
    'CPB',
    'COF',
    'CAH',
    'KMX',
    'CCL',
    'CARR',
    'CTLT',
    'CAT',
    'CBOE',
    'CBRE',
    'CDW',
    'CE',
    'COR',
    'CNC',
    'CNP',
    'CF',
    'CHRW',
    'CRL',
    'SCHW',
    'CHTR',
    'CVX',
    'CMG',
    'CB',
    'CHD',
    'CI',
    'CINF',
    'CTAS',
    'CSCO',
    'C',
    'CFG',
    'CLX',
    'CME',
    'CMS',
    'KO',
    'CTSH',
    'CL',
    'CMCSA',
    'CMA',
    'CAG',
    'COP',
    'ED',
    'STZ',
    'CEG',
    'COO',
    'CPRT',
    'GLW',
    'CTVA',
    'CSGP',
    'COST',
    'CTRA',
    'CCI',
    'CSX',
    'CMI',
    'CVS',
    'DHR',
    'DRI',
    'DVA',
    'DE',
    'DAL',
    'XRAY',
    'DVN',
    'DXCM',
    'FANG',
    'DLR',
    'DFS',
    'DG',
    'DLTR',
    'D',
    'DPZ',
    'DOV',
    'DOW',
    'DHI',
    'DTE',
    'DUK',
    'DD',
    'EMN',
    'ETN',
    'EBAY',
    'ECL',
    'EIX',
    'EW',
    'EA',
    'ELV',
    'LLY',
    'EMR',
    'ENPH',
    'ETR',
    'EOG',
    'EPAM',
    'EQT',
    'EFX',
    'EQIX',
    'EQR',
    'ESS',
    'EL',
    'ETSY',
    'EG',
    'EVRG',
    'ES',
    'EXC',
    'EXPE',
    'EXPD',
    'EXR',
    'XOM',
    'FFIV',
    'FDS',
    'FICO',
    'FAST',
    'FRT',
    'FDX',
    'FIS',
    'FITB',
    'FSLR',
    'FE',
    'FI',
    'FLT',
    'FMC',
    'F',
    'FTNT',
    'FTV',
    'FOXA',
    'FOX',
    'BEN',
    'FCX',
    'GRMN',
    'IT',
    'GEHC',
    'GEN',
    'GNRC',
    'GD',
    'GE',
    'GIS',
    'GM',
    'GPC',
    'GILD',
    'GPN',
    'GL',
    'GS',
    'HAL',
    'HIG',
    'HAS',
    'HCA',
    'PEAK',
    'HSIC',
    'HSY',
    'HES',
    'HPE',
    'HLT',
    'HOLX',
    'HD',
    'HON',
    'HRL',
    'HST',
    'HWM',
    'HPQ',
    'HUBB',
    'HUM',
    'HBAN',
    'HII',
    'IBM',
    'IEX',
    'IDXX',
    'ITW',
    'ILMN',
    'INCY',
    'IR',
    'PODD',
    'INTC',
    'ICE',
    'IFF',
    'IP',
    'IPG',
    'INTU',
    'ISRG',
    'IVZ',
    'INVH',
    'IQV',
    'IRM',
    'JBHT',
    'JBL',
    'JKHY',
    'J',
    'JNJ',
    'JCI',
    'JPM',
    'JNPR',
    'K',
    'KVUE',
    'KDP',
    'KEY',
    'KEYS',
    'KMB',
    'KIM',
    'KMI',
    'KLAC',
    'KHC',
    'KR',
    'LHX',
    'LH',
    'LRCX',
    'LW',
    'LVS',
    'LDOS',
    'LEN',
    'LIN',
    'LYV',
    'LKQ',
    'LMT',
    'L',
    'LOW',
    'LULU',
    'LYB',
    'MTB',
    'MRO',
    'MPC',
    'MKTX',
    'MAR',
    'MMC',
    'MLM',
    'MAS',
    'MA',
    'MTCH',
    'MKC',
    'MCD',
    'MCK',
    'MDT',
    'MRK',
    'META',
    'MET',
    'MTD',
    'MGM',
    'MCHP',
    'MU',
    'MSFT',
    'MAA',
    'MRNA',
    'MHK',
    'MOH',
    'TAP',
    'MDLZ',
    'MPWR',
    'MNST',
    'MCO',
    'MS',
    'MOS',
    'MSI',
    'MSCI',
    'NDAQ',
    'NTAP',
    'NFLX',
    'NEM',
    'NWSA',
    'NWS',
    'NEE',
    'NKE',
    'NI',
    'NDSN',
    'NSC',
    'NTRS',
    'NOC',
    'NCLH',
    'NRG',
    'NUE',
    'NVDA',
    'NVR',
    'NXPI',
    'ORLY',
    'OXY',
    'ODFL',
    'OMC',
    'ON',
    'OKE',
    'ORCL',
    'OTIS',
    'PCAR',
    'PKG',
    'PANW',
    'PARA',
    'PH',
    'PAYX',
    'PAYC',
    'PYPL',
    'PNR',
    'PEP',
    'PFE',
    'PCG',
    'PM',
    'PSX',
    'PNW',
    'PXD',
    'PNC',
    'POOL',
    'PPG',
    'PPL',
    'PFG',
    'PG',
    'PGR',
    'PLD',
    'PRU',
    'PEG',
    'PTC',
    'PSA',
    'PHM',
    'QRVO',
    'PWR',
    'QCOM',
    'DGX',
    'RL',
    'RJF',
    'RTX',
    'O',
    'REG',
    'REGN',
    'RF',
    'RSG',
    'RMD',
    'RVTY',
    'RHI',
    'ROK',
    'ROL',
    'ROP',
    'ROST',
    'RCL',
    'SPGI',
    'CRM',
    'SBAC',
    'SLB',
    'STX',
    'SRE',
    'NOW',
    'SHW',
    'SPG',
    'SWKS',
    'SJM',
    'SNA',
    'SO',
    'LUV',
    'SWK',
    'SBUX',
    'STT',
    'STLD',
    'STE',
    'SYK',
    'SYF',
    'SNPS',
    'SYY',
    'TMUS',
    'TROW',
    'TTWO',
    'TPR',
    'TRGP',
    'TGT',
    'TEL',
    'TDY',
    'TFX',
    'TER',
    'TSLA',
    'TXN',
    'TXT',
    'TMO',
    'TJX',
    'TSCO',
    'TT',
    'TDG',
    'TRV',
    'TRMB',
    'TFC',
    'TYL',
    'TSN',
    'USB',
    'UBER',
    'UDR',
    'ULTA',
    'UNP',
    'UAL',
    'UPS',
    'URI',
    'UNH',
    'UHS',
    'VLO',
    'VTR',
    'VLTO',
    'VRSN',
    'VRSK',
    'VZ',
    'VRTX',
    'VFC',
    'VTRS',
    'VICI',
    'V',
    'VMC',
    'WRB',
    'WAB',
    'WBA',
    'WMT',
    'DIS',
    'WBD',
    'WM',
    'WAT',
    'WEC',
    'WFC',
    'WELL',
    'WST',
    'WDC',
    'WRK',
    'WY',
    'WHR',
    'WMB',
    'WTW',
    'GWW',
    'WYNN',
    'XEL',
    'XYL',
    'YUM',
    'ZBRA',
    'ZBH',
    'ZION',
    'ZTS',
  ]
}
