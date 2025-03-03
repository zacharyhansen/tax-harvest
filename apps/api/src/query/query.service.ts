import type { CompiledQuery } from "kysely";
import type { Pool } from "pg";

import { Inject, Injectable } from "@nestjs/common";

import { Database } from "~/database/database";

export interface QueryField {
  name: string;
  tableID: number;
  columnID: number;
  dataTypeID: number;
  dataTypeSize: number;
  dataTypeModifier: number;
  format: string;
}

@Injectable()
export class QueryService {
  constructor(
    @Inject(Database) private readonly database: Database,
    @Inject("PoolReadOnly") private readonly poolReadOnly: Pool,
  ) {}

  async execute<T extends unknown[] = unknown[]>({
    query,
  }: {
    query: CompiledQuery;
  }) {
    return await this.poolReadOnly.query<T>(
      {
        rowMode: "array",
        text: query.sql,
      },
      query.parameters as unknown[],
    );
  }
}
