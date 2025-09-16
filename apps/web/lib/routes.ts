'use client';

import type { ReadonlyURLSearchParams } from 'next/navigation';
import {
	useParams as useNextParams,
	useSearchParams as useNextSearchParams,
} from 'next/navigation';
import queryString from 'query-string';
import { z } from 'zod';

import { HarvestType } from '~/generated/gql';

// see https://www.flightcontrol.dev/blog/fix-nextjs-routing-to-have-full-type-safety

export const TypedRoutes = {
	accounts: makeRoute(() => `/main/accounts`),
	account: makeRoute(
		({ id }) => `/main/accounts/${id}`,
		z.object({ id: z.string() }),
	),
	actions: makeRoute(() => `/main/admin/actions`),
	admin: makeRoute(() => `/main/admin`),
	connect: makeRoute(() => `/connect`),
	explore: makeRoute(() => `/explore`),
	harvests: makeRoute(() => `/main/harvests`),
	harvest: makeRoute(
		({ id }) => `/main/harvests/${id}`,
		z.object({ id: z.string() }),
	),
	harvestFlowRoot: makeRoute(() => `/main/harvest-flow`),
	harvestFlowType: makeRoute(
		({ harvestId, type }) => `/main/harvest-flow/${type}/${harvestId}`,
		z.object({
			harvestId: z.string(),
			type: z.nativeEnum(HarvestType),
		}),
	),
	home: makeRoute(() => `/main/home`),
	invite: makeRoute(() => `/main/invite`),
	lotSelection: makeRoute(
		({ type }) => `/main/harvest-flow/lot-selection/${type}`,
		z.object({ type: z.nativeEnum(HarvestType) }),
	),
	lots: makeRoute(() => `/main/lots`),
	lot: makeRoute(
		({ lotId }) => `/main/lots/${lotId}`,
		z.object({ lotId: z.string() }),
	),
	logs: makeRoute(() => `/main/admin/logs`),
	log: makeRoute(
		({ logId }) => `/main/admin/logs/${logId}`,
		z.object({ logId: z.coerce.number() }),
	),
	mergeErrors: makeRoute(() => `/main/admin/merge-errors`),
	mergeError: makeRoute(
		({ mergeErrorId }) => `/main/admin/merge-errors/${mergeErrorId}`,
		z.object({ mergeErrorId: z.string() }),
	),
	lotTransactionBatch: makeRoute(
		({ lotTransactionBatchId }) =>
			`/main/admin/plaid-history/${lotTransactionBatchId}`,
		z.object({ lotTransactionBatchId: z.string() }),
	),
	plaidHistory: makeRoute(() => `/main/admin/plaid-history`),
	settings: makeRoute(() => `/main/settings`),
	settingsNotifications: makeRoute(() => `/main/settings/notifications`),
	settingsPortfolio: makeRoute(() => `/main/settings/portfolio`),
	settingsPayment: makeRoute(() => `/main/settings/payment`),
	taxOpportunities: makeRoute(() => `/main/tax-opportunities`),
	transactions: makeRoute(() => `/main/transactions`),
	users: makeRoute(() => `/main/admin/users`),
	user: makeRoute(
		({ userId }) => `/main/admin/users/${userId}`,
		z.object({ userId: z.string() }),
	),

	view: makeRoute(
		({ viewId }) => `/main/views/${viewId}`,
		z.object({
			viewId: z.string(),
		}),
	),
	views: makeRoute(() => '/main/views'),
};

type RouteBuilder<Params extends z.ZodSchema, Search extends z.ZodSchema> = {
	(p?: z.input<Params>, options?: { search?: z.input<Search> }): string;
	parse: (input: z.input<Params>) => z.output<Params>;
	useParams: () => z.output<Params>;
	useSearchParams: () => z.output<Search>;
	params: z.output<Params>;
};

/**
 *
 * @param fn
 * @param paramsSchema
 * @param search
 * @returns  routes
 */
function makeRoute<Params extends z.ZodSchema, Search extends z.ZodSchema>(
	fn: (p: z.input<Params>) => string,
	paramsSchema: Params = z.object({}) as unknown as Params,
	search: Search = z.object({}) as unknown as Search,
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
					([, route]) => (route as unknown) === routeBuilder,
				)?.[0] ?? '(unknown route)';
			throw new Error(
				`Invalid route params for route ${routeName}: ${res.error.message}`,
			);
		}
		return res.data;
	};

	routeBuilder.useParams = function useParams(): z.output<Params> {
		const res = paramsSchema.safeParse(useNextParams());
		if (!res.success) {
			const routeName =
				Object.entries(TypedRoutes).find(
					([, route]) => (route as unknown) === routeBuilder,
				)?.[0] ?? '(unknown route)';
			throw new Error(
				`Invalid route params for route ${routeName}: ${res.error.message}`,
			);
		}
		return res.data;
	};

	routeBuilder.useSearchParams = function useSearchParams(): z.output<Search> {
		const res = search.safeParse(
			convertURLSearchParamsToObject(useNextSearchParams()),
		);
		if (!res.success) {
			const routeName =
				Object.entries(TypedRoutes).find(
					([, route]) => (route as unknown) === routeBuilder,
				)?.[0] ?? '(unknown route)';
			throw new Error(
				`Invalid search params for route ${routeName}: ${res.error.message}`,
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
				'Routes.[route].params is only for type usage, not runtime. Use it like `typeof Routes.[routes].params`',
			);
		},
	});

	return routeBuilder;
}

export function convertURLSearchParamsToObject(
	params: ReadonlyURLSearchParams | null,
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
