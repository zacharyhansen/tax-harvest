import { readFileSync } from "node:fs";

import { Injectable, Logger } from "@nestjs/common";
import { parse } from "csv-parse/sync";
import Decimal from "decimal.js";
import { Insertable } from "kysely";

import { Lot } from "@prisma/client";

export interface EtradeCSVLotRecord {
  Symbol: string;
  "Last Price $": string;
  "Change $": string;
  "Change %": string;
  Quantity: string;
  "Price Paid $": string;
  "Day's Gain $": string;
  "Total Gain $": string;
  "Total Gain %": string;
  "Value $": string;
}

@Injectable()
export class CsvService {
  private readonly logger = new Logger(CsvService.name);

  /**
   * Converts a CSV file to an array of JSON objects where each row in the CSV becomes an object.
   * @param {string} filePath The path to the CSV file.
   * @returns {any[]} An array of objects, each representing a row in the CSV.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static csvToJson(filePath: string): Promise<any[]> {
    const csvFile = readFileSync(filePath);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const records = parse(csvFile, {
      columns: true,
      skip_empty_lines: true,
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return records;
  }

  etradeTransformCSVRecords({ records }: { records: EtradeCSVLotRecord[] }) {
    const transformedRecords = [];
    let currentTicker = "";
    for (const record of records) {
      if (/^[^0-9]+$/.test(record.Symbol)) {
        currentTicker = record.Symbol;
      } else {
        transformedRecords.push({
          acquiredDate: new Date(record.Symbol),
          assetSymbol: currentTicker,
          price: new Decimal(record["Price Paid $"]),
          remainingQty: new Decimal(record.Quantity),
        } satisfies Omit<
          Insertable<Lot>,
          "accountId" | "id" | "createdAt" | "updatedAt" | "excludeFromHarvest"
        >);
      }
    }
    return transformedRecords;
  }

  async etradeCSVToLots({ content }: { content: string }) {
    const fromLine = CsvService.etradeDetectLotHeaderLine(content);
    const records: EtradeCSVLotRecord[] = [];
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const parser = parse(content, {
      columns: true, // Skip empty lines
      from_line: fromLine, // Use first parsed row as headers
      skip_empty_lines: true, // Dynamically detected starting line
      skipRecordsWithError: true,
      trim: true,
    });

    try {
      for await (const record of parser) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        records.push(record);
      }
    } catch (error) {
      // Type guard to check if `error` is an instance of `Error`
      if (
        error instanceof Error &&
        error.message.includes("Invalid Record Length")
      ) {
        console.error(
          "Parsing stopped: Invalid Record Length error encountered.",
        );
      } else {
        throw error; // Rethrow if it's a different error
      }
    }
    return records;
  }

  static etradeDetectLotHeaderLine(fileContent: string): number {
    const lines = fileContent.split("\n");

    // Find the line containing "Symbol" (case-insensitive) followed by a non-empty line
    const headerLineIndex = lines.findIndex((line, index) => {
      const isSymbolLine = /symbol/i.test(line); // Case-insensitive match for "Symbol"
      const nextLineFirstCell = lines[index + 1]?.split(",")[0].trim(); // Check only the first cell of the next line
      const hasNextLineContent = nextLineFirstCell && nextLineFirstCell !== "";
      return isSymbolLine && hasNextLineContent;
    });

    // Return line number + 1 for `from_line` (since csv-parse uses 1-based indexing)
    return headerLineIndex === -1 ? -1 : headerLineIndex + 1;
  }

  private static matchLine(fileContent: string, headerPattern: RegExp): number {
    const lines = fileContent.split("\n");

    // Find the line number that matches the desired header pattern
    const headerLineIndex = lines.findIndex(line => headerPattern.test(line));

    // Return line number + 1 for `from_line` (since csv-parse uses 1-based indexing)
    return headerLineIndex === -1 ? -1 : headerLineIndex + 1;
  }

  static csvToString(filePath: string): string {
    return readFileSync(filePath, "utf8");
  }
}
