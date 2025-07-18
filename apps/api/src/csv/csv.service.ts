import { readFileSync } from 'node:fs'

import { Injectable, Logger } from '@nestjs/common'
import { Lot } from '@prisma/client'
import { parse } from 'csv-parse/sync'
import Decimal from 'decimal.js'
import { Insertable } from 'kysely'

export interface EtradeCSVLotRecord {
  'Symbol': string
  'Last Price $': string
  'Change $': string
  'Change %': string
  'Quantity': string
  'Price Paid $': string
  'Day\'s Gain $': string
  'Total Gain $': string
  'Total Gain %': string
  'Value $': string
}

@Injectable()
export class CsvService {
  private readonly logger = new Logger(CsvService.name)

  /**
   * Converts a CSV file to an array of JSON objects where each row in the CSV becomes an object.
   * @param {string} filePath The path to the CSV file.
   * @returns {any[]} An array of objects, each representing a row in the CSV.
   */

  // eslint-disable-next-line ts/no-explicit-any
  static csvToJson(filePath: string): Promise<any[]> {
    const csvFile = readFileSync(filePath)
    const records = parse(csvFile, {
      columns: true,
      skip_empty_lines: true,
    })
    return records
  }

  etradeTransformCSVRecords({ records }: { records: EtradeCSVLotRecord[] }): {
    acquiredDate: Date
    assetSymbol: string
    price: Decimal
    remainingQty: Decimal
  }[] {
    // Check if any records contain dates
    const hasDateRecords = records.some((record) => {
      // Check if the Symbol field contains a valid date
      const possibleDate = new Date(record.Symbol)
      return !Number.isNaN(possibleDate.getTime()) && /^\d{1,2}\/\d{1,2}\/\d{2,4}$/.test(record.Symbol)
    })

    if (!hasDateRecords) {
      throw new Error('Invalid CSV format: No lot dates found in the Symbol column. Please ensure you have expanded the lot details before downloading the CSV.')
    }

    const transformedRecords = []
    let currentTicker = ''
    for (const record of records) {
      if (/^\D+$/.test(record.Symbol)) {
        currentTicker = record.Symbol
      }
      else {
        transformedRecords.push({
          acquiredDate: new Date(record.Symbol),
          assetSymbol: currentTicker,
          price: new Decimal(record['Price Paid $']),
          remainingQty: new Decimal(record.Quantity),
        } satisfies Omit<
          Insertable<Lot>,
          'accountId' | 'id' | 'createdAt' | 'updatedAt' | 'excludeFromHarvest' | 'portfolioId'
        >)
      }
    }
    return transformedRecords
  }

  async etradeCSVToLots({ content }: { content: string }): Promise<{
    records: EtradeCSVLotRecord[]
    lotSeededDate: Date | undefined
  }> {
    const fromLine = CsvService.etradeDetectLotHeaderLine(content)
    const records: EtradeCSVLotRecord[] = []

    const parser = parse(content, {
      columns: true, // Skip empty lines
      from_line: fromLine, // Use first parsed row as headers
      skip_empty_lines: true, // Dynamically detected starting line
      skipRecordsWithError: true,
      trim: true,
    })

    try {
      for await (const record of parser) {
        records.push(record)
      }
    }
    catch (error) {
      // Type guard to check if `error` is an instance of `Error`
      if (
        error instanceof Error
        && error.message.includes('Invalid Record Length')
      ) {
        console.error(
          'Parsing stopped: Invalid Record Length error encountered.',
        )
      }
      else {
        throw error // Rethrow if it's a different error
      }
    }

    const lotSeededDate = this.etradeLotSeededDate(content)

    return { records, lotSeededDate }
  }

  etradeLotSeededDate(content: string) {
    // Extract generation date
    const lines = content.split('\n')
    let lotSeededDate: Date | undefined
    for (const line of lines) {
      const match = line.match(
        /Generated at ([A-Za-z]+ \d+ \d{4} \d+:\d+ [AP]M) ([A-Z]{2,4})/,
      )
      if (match) {
        const dateStr = match[1]
        const timezone = match[2]
        try {
          // Map common timezone abbreviations to their offsets
          const timezoneOffsets: Record<string, string> = {
            ET: '-0400', // EDT
            EST: '-0500',
            EDT: '-0400',
            CT: '-0500', // CDT
            CST: '-0600',
            CDT: '-0500',
            MT: '-0600', // MDT
            MST: '-0700',
            MDT: '-0600',
            PT: '-0700', // PDT
            PST: '-0800',
            PDT: '-0700',
          }

          let offset = timezoneOffsets[timezone]

          // If it's ET/CT/MT/PT, check if we need to use standard time
          if (['ET', 'CT', 'MT', 'PT'].includes(timezone)) {
            const parsedDate = new Date(dateStr)
            const month = parsedDate.getMonth() // 0-11
            // If month is in standard time period (Nov-Mar)
            if (month >= 10 || month <= 2) {
              offset = timezoneOffsets[`${timezone}ST`] // Use standard time offset
            }
          }

          if (offset) {
            lotSeededDate = new Date(`${dateStr} GMT${offset}`)
          }
          else {
            // If we don't recognize the timezone, try parsing without offset
            console.warn(
              `Unknown timezone: ${timezone}, parsing without offset`,
            )
            lotSeededDate = new Date(dateStr)
          }

          if (Number.isNaN(lotSeededDate.getTime())) {
            throw new TypeError('Invalid date')
          }
        }
        catch {
          console.error(
            'Failed to parse date:',
            dateStr,
            'with timezone:',
            timezone,
          )
          lotSeededDate = undefined
        }
        break
      }
    }
    return lotSeededDate
  }

  static etradeDetectLotHeaderLine(fileContent: string): number {
    const lines = fileContent.split('\n')

    // Find the line containing "Symbol" (case-insensitive) followed by a non-empty line
    const headerLineIndex = lines.findIndex((line, index) => {
      const isSymbolLine = /symbol/i.test(line) // Case-insensitive match for "Symbol"
      const nextLineFirstCell = lines[index + 1]?.split(',')[0].trim() // Check only the first cell of the next line
      const hasNextLineContent = nextLineFirstCell && nextLineFirstCell !== ''
      return isSymbolLine && hasNextLineContent
    })

    // Return line number + 1 for `from_line` (since csv-parse uses 1-based indexing)
    return headerLineIndex === -1 ? -1 : headerLineIndex + 1
  }

  static csvToString(filePath: string): string {
    return readFileSync(filePath, 'utf8')
  }
}
