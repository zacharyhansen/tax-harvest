import type {
  PostgrestError,
  PostgrestQueryBuilder,
} from '@supabase/postgrest-js';
import type { GetResult } from '@postgrest-internal';
import type {
  UsePostgrestMutationOpts,
  GenericSchema,
  GenericTable,
} from '@supabase-cache-helpers/postgrest-react-query';
import type { UseMutationResult } from '@tanstack/react-query';

// import type { Database, Tables } from '~/lib/database/database.types';

// bruh the lengths i go to for this random library to work for me
// TODO: hoping to find a better cache solution or this lirary gets upgraded to with with moduleResolution: bundler
// https://github.com/psteinroe/supabase-cache-helpers/issues/509
declare module '@supabase-cache-helpers/postgrest-react-query' {
  export function useInsertMutation<
    S extends GenericSchema,
    T extends GenericTable,
    RelationName,
    Re = T extends { Relationships: infer R } ? R : unknown,
    Q extends string = '*',
    R = GetResult<S, T['Row'], RelationName, Re, Q extends '*' ? '*' : Q>,
  >(
    qb: PostgrestQueryBuilder<S, T, RelationName, Re>,
    primaryKeys: (keyof T['Row'])[],
    query?: Q | null,
    opts?: Omit<
      UsePostgrestMutationOpts<S, T, RelationName, Re, 'Insert', Q, R>,
      'mutationFn'
    >
  ): UseMutationResult<
    (R extends false | '' | 0 | null | undefined ? never : R)[] | null,
    PostgrestError,
    T['Insert'][],
    unknown
  >;

  export function useDeleteManyMutation<
    S extends GenericSchema,
    T extends GenericTable,
    RelationName,
    Re = T extends { Relationships: infer R } ? R : unknown,
    Q extends string = '*',
    R = GetResult<S, T['Row'], RelationName, Re, Q extends '*' ? '*' : Q>,
  >(
    qb: PostgrestQueryBuilder<S, T, RelationName, Re>,
    primaryKeys: (keyof T['Row'])[],
    query?: Q | null,
    opts?: Omit<
      UsePostgrestMutationOpts<S, T, RelationName, Re, 'DeleteMany', Q, R>,
      'mutationFn'
    >
  ): UseMutationResult<
    R[] | null,
    PostgrestError,
    Partial<T['Row']>[],
    unknown
  >;

  export function useDeleteMutation<
    S extends GenericSchema,
    T extends GenericTable,
    RelationName,
    Re = T extends { Relationships: infer R } ? R : unknown,
    Q extends string = '*',
    R = GetResult<S, T['Row'], RelationName, Re, Q extends '*' ? '*' : Q>,
  >(
    qb: PostgrestQueryBuilder<S, T, RelationName, Re>,
    primaryKeys: (keyof T['Row'])[],
    query?: Q | null,
    opts?: Omit<
      UsePostgrestMutationOpts<S, T, RelationName, Re, 'DeleteOne', Q, R>,
      'mutationFn'
    >
  ): UseMutationResult<
    NonNullable<R> | null,
    PostgrestError,
    Partial<T['Row']>,
    unknown
  >;

  export function useUpdateMutation<
    S extends GenericSchema,
    T extends GenericTable,
    RelationName,
    Re = T extends { Relationships: infer R } ? R : unknown,
    Q extends string = '*',
    R = GetResult<S, T['Row'], RelationName, Re, Q extends '*' ? '*' : Q>,
  >(
    qb: PostgrestQueryBuilder<S, T, RelationName, Re>,
    primaryKeys: (keyof T['Row'])[],
    query?: Q | null,
    opts?: Omit<
      UsePostgrestMutationOpts<S, T, RelationName, Re, 'UpdateOne', Q, R>,
      'mutationFn'
    >
  ): UseMutationResult<
    NonNullable<R> | null,
    PostgrestError,
    T['Update'],
    unknown
  >;

  export function useUpsertMutation<
    S extends GenericSchema,
    T extends GenericTable,
    RelationName,
    Re = T extends { Relationships: infer R } ? R : unknown,
    Q extends string = '*',
    R = GetResult<S, T['Row'], RelationName, Re, Q extends '*' ? '*' : Q>,
  >(
    qb: PostgrestQueryBuilder<S, T, RelationName, Re>,
    primaryKeys: (keyof T['Row'])[],
    query?: Q | null,
    opts?: Omit<
      UsePostgrestMutationOpts<S, T, RelationName, Re, 'Upsert', Q, R>,
      'mutationFn'
    >
  ): UseMutationResult<
    (R extends false | '' | 0 | null | undefined ? never : R)[] | null,
    PostgrestError,
    T['Insert'][],
    unknown
  >;
}
