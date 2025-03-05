import { Test, TestingModule } from '@nestjs/testing';
import { readFileSync } from 'fs';
import { resolve } from 'path';

import { CsvService } from './csv.service';
import EtradeLotResults from './test/lotRecordsFromEtradePortfolioDownload.json';
import EtradeLotResults_2 from './test/lotRecordsFromEtradePortfolioDownload_2.json';
import EtradeTransformedLotResults from './test/transformedLotRecordsFromEtradePortfolioDownload.json';
import EtradeTransformedLotResults_2 from './test/transformedLotRecordsFromEtradePortfolioDownload_2.json';

describe('CsvService', () => {
  let service: CsvService;

  beforeEach(async () => {
    const csvModule: TestingModule = await Test.createTestingModule({
      providers: [CsvService],
    }).compile();

    service = csvModule.get<CsvService>(CsvService);
  });

  it('should detect correct lot header line for etrade csv', async () => {
    const content = await readFileSync(
      resolve(__dirname, './test/etradePortfolioDownload.csv'),
      'utf-8',
    );
    expect(CsvService.etradeDetectLotHeaderLine(content)).toEqual(11);
  });

  it('should read etrade lot records', async () => {
    const content = CsvService.csvToString(
      resolve(__dirname, './test/etradePortfolioDownload.csv'),
    );
    const records = await service.etradeCSVToLots({
      content,
    });
    expect(records).toEqual(EtradeLotResults);
  });

  it('should transform etrade lot records', async () => {
    const records = service.etradeTransformCSVRecords({
      records: EtradeLotResults,
    });
    expect(records).toEqual(EtradeTransformedLotResults);
  });

  it('should work end to end', async () => {
    const content = CsvService.csvToString(
      resolve(__dirname, './test/etradePortfolioDownload_2.csv'),
    );
    const records = await service.etradeCSVToLots({
      content,
    });
    expect(records).toEqual(EtradeLotResults_2);
    const finalRecords = service.etradeTransformCSVRecords({
      records,
    });

    expect(finalRecords).toEqual(EtradeTransformedLotResults_2);
  });
});
