// eslint-disable-next-line @eslint-community/eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/no-unused-vars */
import { capitalCase } from 'change-case';

import type { Database } from '../database/postgrest';

export enum ComponentType {
  form = 'form',
  table = 'table',
}

export enum ag_pinned {
  left = 'left',
  right = 'right',
}

export enum input_type {
  // direct
  text = 'text',
  phone = 'phone',
  password = 'password',
  textarea = 'textarea',
  number = 'number',
  percentage = 'percentage',
  usd = 'usd',
  combobox = 'combobox',
  combobox_multi = 'combobox_multi',
  date = 'date',
  timestamp = 'timestamp',
  checkbox = 'checkbox',
  switch = 'switch',
  tiptap = 'tiptap',
  slider = 'slider',
  // advanced
  user = 'user',
}

export enum supported_pg_data_type {
  unknown = 'unknown',
  array_integer = 'array_integer',
  array_json = 'array_json',
  array_jsonb = 'array_jsonb',
  array_text = 'array_text',
  array_boolean = 'array_boolean',
  array_numeric = 'array_numeric',
  array_varchar = 'array_varchar',
  array_date = 'array_date',
  array_timestamp = 'array_timestamp',
  bigint = 'bigint',
  bigserial = 'bigserial',
  bit = 'bit',
  bit_varying = 'bit_varying',
  boolean = 'boolean',
  box = 'box',
  bytea = 'bytea',
  character = 'character',
  character_varying = 'character_varying',
  cidr = 'cidr',
  circle = 'circle',
  date = 'date',
  double_precision = 'double_precision',
  enum = 'enum',
  float4 = 'float4',
  float8 = 'float8',
  inet = 'inet',
  integer = 'integer',
  interval = 'interval',
  json = 'json',
  jsonb = 'jsonb',
  line = 'line',
  lseg = 'lseg',
  macaddr = 'macaddr',
  money = 'money',
  numeric = 'numeric',
  path = 'path',
  point = 'point',
  polygon = 'polygon',
  real = 'real',
  serial = 'serial',
  smallint = 'smallint',
  smallserial = 'smallserial',
  text = 'text',
  time = 'time',
  time_with_time_zone = 'time_with_time_zone',
  timestamp = 'timestamp',
  timestamp_with_time_zone = 'timestamp_with_time_zone',
  timestamp_without_time_zone = 'timestamp_without_time_zone',
  tsquery = 'tsquery',
  tsvector = 'tsvector',
  txid_snapshot = 'txid_snapshot',
  uuid = 'uuid',
  xml = 'xml',
}

export const enumToOptions = (
  enumType: Record<string, string>
): {
  label: string;
  value: string;
}[] => {
  return Object.values(enumType).map(type => ({
    label: capitalCase(type),
    value: type,
  }));
};

// Ensure all enums conform to the database types
const _enumTypeCheck: {
  ComponentType: Record<
    keyof typeof ComponentType,
    Database['configuration']['Enums']['component_type']
  >;
  ag_pinned: Record<
    keyof typeof ag_pinned,
    Database['configuration']['Enums']['ag_pinned']
  >;
  supported_pg_data_type: Record<
    keyof typeof supported_pg_data_type,
    Database['configuration']['Enums']['supported_pg_data_type']
  >;
  input_type: Record<
    keyof typeof input_type,
    Database['configuration']['Enums']['input_type']
  >;
} = {
  ComponentType,
  ag_pinned,
  supported_pg_data_type,
  input_type,
};
