import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { Test, TestingModule } from "@nestjs/testing";

import { CsvService } from "./csv.service";
import lotRecordsFromEtradePortfolioDownload from "./test/lotRecordsFromEtradePortfolioDownload.json";
import lotRecordsFromEtradePortfolioDownload_2 from "./test/lotRecordsFromEtradePortfolioDownload_2.json";
import lotRecordsFromEtradePortfolioDownload_3 from "./test/lotRecordsFromEtradePortfolioDownload_3.json";
import transformedLotRecordsFromEtradePortfolioDownload from "./test/transformedLotRecordsFromEtradePortfolioDownload.json";
import transformedLotRecordsFromEtradePortfolioDownload_2 from "./test/transformedLotRecordsFromEtradePortfolioDownload_2.json";
import transformedLotRecordsFromEtradePortfolioDownload_3 from "./test/transformedLotRecordsFromEtradePortfolioDownload_3.json";

describe("CsvService", () => {
  let service: CsvService;

  beforeEach(async () => {
    const csvModule: TestingModule = await Test.createTestingModule({
      providers: [CsvService],
    }).compile();

    service = csvModule.get<CsvService>(CsvService);
  });

  it("should detect correct lot header line for etrade csv", () => {
    const content = readFileSync(
      resolve(__dirname, "./test/etradePortfolioDownload.csv"),
      "utf-8",
    );
    expect(CsvService.etradeDetectLotHeaderLine(content)).toEqual(11);
  });

  it("should detect the correct lot seed date for etrade csv", () => {
    const content = readFileSync(
      resolve(__dirname, "./test/etradePortfolioDownload.csv"),
      "utf-8",
    );

    expect(service.etradeLotSeededDate(content)?.toISOString()).toEqual(
      new Date("2024-10-28T04:30:00.000Z").toISOString(),
    );
  });

  it("should read etrade lot records", async () => {
    const content = CsvService.csvToString(
      resolve(__dirname, "./test/etradePortfolioDownload.csv"),
    );
    const { records } = await service.etradeCSVToLots({
      content,
    });

    expect(records).toEqual(lotRecordsFromEtradePortfolioDownload);

    const content_3 = CsvService.csvToString(
      resolve(__dirname, "./test/etradePortfolioDownload_3.csv"),
    );
    const { records: records_3 } = await service.etradeCSVToLots({
      content: content_3,
    });
    expect(records_3).toEqual(lotRecordsFromEtradePortfolioDownload_3);
  });

  it("should transform etrade lot records", () => {
    const records = service.etradeTransformCSVRecords({
      records: lotRecordsFromEtradePortfolioDownload,
    });
    expect(
      records.map(r => ({
        ...r,
        price: r.price.toFixed(4),
        remainingQty: r.remainingQty.toFixed(4),
        acquiredDate: r.acquiredDate.toISOString(),
      })),
    ).toEqual(transformedLotRecordsFromEtradePortfolioDownload);

    const records_3 = service.etradeTransformCSVRecords({
      records: lotRecordsFromEtradePortfolioDownload_3,
    });

    expect(
      records_3.map(r => ({
        ...r,
        price: r.price.toFixed(4),
        remainingQty: r.remainingQty.toFixed(4),
        acquiredDate: r.acquiredDate.toISOString(),
      })),
    ).toEqual(transformedLotRecordsFromEtradePortfolioDownload_3);
  });

  it("should work end to end", async () => {
    const content = CsvService.csvToString(
      resolve(__dirname, "./test/etradePortfolioDownload_2.csv"),
    );
    const { records } = await service.etradeCSVToLots({
      content,
    });
    expect(records).toEqual(lotRecordsFromEtradePortfolioDownload_2);
    const finalRecords = service.etradeTransformCSVRecords({
      records,
    });

    expect(
      finalRecords.map(r => ({
        ...r,
        price: r.price.valueOf(),
        remainingQty: r.remainingQty.valueOf(),
        acquiredDate: r.acquiredDate.toISOString(),
      })),
    ).toEqual(transformedLotRecordsFromEtradePortfolioDownload_2);
  });
});
