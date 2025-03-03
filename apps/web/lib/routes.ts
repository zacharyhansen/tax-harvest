import { z } from 'zod';
import type { ReadonlyURLSearchParams } from 'next/navigation';
import {
  useParams as useNextParams,
  useSearchParams as useNextSearchParams,
} from 'next/navigation';
import queryString from 'query-string';

// see https://www.flightcontrol.dev/blog/fix-nextjs-routing-to-have-full-type-safety

export const TypedRoutes = {
  components: makeRoute(() => `/main/components`),
  component: makeRoute(
    ({ componentId }) => `/main/components/${componentId}`,
    z.object({
      componentId: z.string(),
    })
  ),
  componentVersion: makeRoute(
    ({ componentId, version }) =>
      `/main/components/${componentId}/version/${version}/builder`,
    z.object({
      componentId: z.string(),
      version: z.coerce.number(),
    })
  ),
  componentPreview: makeRoute(
    ({ componentId, version }) =>
      `/main/components/${componentId}/version/${version}/preview`,
    z.object({
      componentId: z.string(),
      version: z.coerce.number(),
    })
  ),
  componentConfiguration: makeRoute(
    ({ componentId, version }) =>
      `/main/components/${componentId}/version/${version}/configuration`,
    z.object({
      componentId: z.string(),
      version: z.coerce.number(),
    })
  ),
  componentLayout: makeRoute(
    ({ componentId, version }) =>
      `/main/components/${componentId}/version/${version}/layout`,
    z.object({
      componentId: z.string(),
      version: z.coerce.number(),
    })
  ),
  componentSettings: makeRoute(
    ({ componentId, version }) =>
      `/main/components/${componentId}/version/${version}/settings`,
    z.object({
      componentId: z.string(),
      version: z.coerce.number(),
    })
  ),
  deal: makeRoute(
    ({ opportunityId, dealId }) =>
      `/main/opportunities/${opportunityId}/deal/${dealId}`,
    z.object({
      opportunityId: z.string(),
      dealId: z.string(),
    })
  ),
  data: makeRoute(() => 'main/data'),
  datasets: makeRoute(() => '/main/dataset'),
  dataset: makeRoute(
    ({ datasetId }) => `/main/dataset/${datasetId}`,
    z.object({
      datasetId: z.string(),
    })
  ),
  datasetVersion: makeRoute(
    ({ datasetId, version }) => `/main/dataset/${datasetId}/version/${version}`,
    z.object({
      datasetId: z.string(),
      version: z.number(),
    })
  ),
  forms: makeRoute(() => '/main/forms'),
  form: makeRoute(
    ({ slug }) => `/main/forms/${slug}`,
    z.object({
      slug: z.string(),
    })
  ),
  goals: makeRoute(() => '/main/goals'),
  home: makeRoute(() => `/main/home`),
  layouts: makeRoute(() => '/main/layouts'),
  opportunities: makeRoute(() => `/main/opportunities`),
  roles: makeRoute(() => '/main/roles'),
  role: makeRoute(
    ({ roleId }) => `/main/roles/${roleId}`,
    z.object({
      roleId: z.string(),
    })
  ),
  settings: makeRoute(() => `/main/settings`),
  signin: makeRoute(() => '/auth/signin'),
  signup: makeRoute(() => '/auth/signup'),
  stateMachines: makeRoute(() => '/main/state-machines'),
  tables: makeRoute(() => '/main/tables'),
  table: makeRoute(
    ({ slug }) => `/main/tables/${slug}`,
    z.object({
      slug: z.string(),
    })
  ),
  tasks: makeRoute(() => '/main/tasks'),
  task: makeRoute(
    ({ taskId }) => `/main/tasks/${taskId}`,
    z.object({
      taskId: z.string(),
    })
  ),
  users: makeRoute(() => '/main/users'),
  user: makeRoute(
    ({ userId }) => `/main/users/${userId}`,
    z.object({
      userId: z.string(),
    })
  ),
  view: makeRoute(
    ({ viewId }) => `main/views/${viewId}`,
    z.object({
      viewId: z.string(),
    })
  ),
  views: makeRoute(() => 'main/views'),
};

interface RouteBuilder<Params extends z.ZodSchema, Search extends z.ZodSchema> {
  (p?: z.input<Params>, options?: { search?: z.input<Search> }): string;
  parse: (input: z.input<Params>) => z.output<Params>;
  useParams: () => z.output<Params>;
  useSearchParams: () => z.output<Search>;
  params: z.output<Params>;
}

/**
 *
 * @param fn
 * @param paramsSchema
 * @param search
 * @returns
 */
function makeRoute<Params extends z.ZodSchema, Search extends z.ZodSchema>(
  fn: (p: z.input<Params>) => string,
  paramsSchema: Params = z.object({}) as unknown as Params,
  search: Search = z.object({}) as unknown as Search
): RouteBuilder<Params, Search> {
  const routeBuilder: RouteBuilder<Params, Search> = (params, options) => {
    const baseUrl = fn(params);
    const searchString =
      options?.search && queryString.stringify(options.search);
    return [baseUrl, searchString ? `?${searchString}` : ''].join('');
  };

  routeBuilder.parse = function parse(args: z.input<Params>): z.output<Params> {
    const res = paramsSchema.safeParse(args);
    if (!res.success) {
      const routeName =
        Object.entries(TypedRoutes).find(
          ([, route]) => (route as unknown) === routeBuilder
        )?.[0] ?? '(unknown route)';
      throw new Error(
        `Invalid route params for route ${routeName}: ${res.error.message}`
      );
    }
    return res.data;
  };

  routeBuilder.useParams = function useParams(): z.output<Params> {
    const res = paramsSchema.safeParse(useNextParams());
    if (!res.success) {
      const routeName =
        Object.entries(TypedRoutes).find(
          ([, route]) => (route as unknown) === routeBuilder
        )?.[0] ?? '(unknown route)';
      throw new Error(
        `Invalid route params for route ${routeName}: ${res.error.message}`
      );
    }
    return res.data;
  };

  routeBuilder.useSearchParams = function useSearchParams(): z.output<Search> {
    const res = search.safeParse(
      convertURLSearchParamsToObject(useNextSearchParams())
    );
    if (!res.success) {
      const routeName =
        Object.entries(TypedRoutes).find(
          ([, route]) => (route as unknown) === routeBuilder
        )?.[0] ?? '(unknown route)';
      throw new Error(
        `Invalid search params for route ${routeName}: ${res.error.message}`
      );
    }
    return res.data;
  };

  // set the type
  routeBuilder.params = undefined as z.output<Params>;
  // set the runtime getter
  Object.defineProperty(routeBuilder, 'params', {
    get() {
      throw new Error(
        'Routes.[route].params is only for type usage, not runtime. Use it like `typeof Routes.[routes].params`'
      );
    },
  });

  return routeBuilder;
}

export function convertURLSearchParamsToObject(
  params: ReadonlyURLSearchParams | null
): Record<string, string | string[]> {
  if (!params) {
    return {};
  }

  const obj: Record<string, string | string[]> = {};
  for (const [key, value] of params.entries()) {
    if (params.getAll(key).length > 1) {
      obj[key] = params.getAll(key);
    } else {
      obj[key] = value;
    }
  }
  return obj;
}
