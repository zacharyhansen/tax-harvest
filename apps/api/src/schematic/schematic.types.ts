import type { ConfigurationLinkType } from "kysely-codegen";

export interface SchemaCache {
  dbTables: [QiObject, TableInfo][];
  dbRelationships: [[QiObject, string], Relationship[]][];
}

interface ColumnInfo {
  colDefault: unknown;
  colDescription: string | null;
  colEnum: string[];
  colMaxLen: number | null;
  colName: string;
  colNominalType: string;
  colNullable: boolean;
  colType: string;
}

type TableColumns = Record<string, ColumnInfo>;

export interface TableInfo {
  tableColumns: TableColumns;
  tableDeletable: boolean;
  tableDescription: string | null;
  tableInsertable: boolean;
  tableIsView: boolean;
  tableName: string;
  tablePKCols: string[];
  tableSchema: string;
  tableUpdatable: boolean;
}

export interface QiObject {
  qiName: string;
  qiSchema: string;
}

export interface RelationCardinality {
  relColumns: [string[]];
  relCons: string;
  tag: ConfigurationLinkType;
}

export interface M2MRelationCardinality {
  contents: {
    junColsSource: [string[]];
    junColsTarget: [string[]];
    junConstraint1: string;
    junConstraint2: string;
    junTable: QiObject;
  };
  tag: ConfigurationLinkType;
}

export interface Relationship {
  relCardinality: RelationCardinality | M2MRelationCardinality;
  relFTableIsView: boolean;
  relForeignTable: QiObject;
  relIsSelf: boolean;
  relTable: QiObject;
  relTableIsView: boolean;
  tag: string;
}

export function isM2MRelationCardinality(
  relativeCardinality: Relationship["relCardinality"],
): relativeCardinality is M2MRelationCardinality {
  return Boolean("contents" in relativeCardinality);
}
