import { Inject, Injectable } from "@nestjs/common";

import { Database } from "~/database/database";

@Injectable()
export class TableService {
  constructor(@Inject(Database) private readonly database: Database) {}
}
