// Inspired by https://paljs.com/plugins/select/
/** biome-ignore-all lint/suspicious/noExplicitAny: <pulled from online> */
import type { GraphQLResolveInfo } from 'graphql';
import { parseResolveInfo } from 'graphql-parse-resolve-info';

export class PrismaSelect<T> {
	private availableArgs = [
		'where',
		'orderBy',
		'skip',
		'cursor',
		'take',
		'distinct',
	];

	private isAggregate = false;

	constructor(private info: GraphQLResolveInfo) {}

	get value() {
		const returnType = this.info.returnType
			.toString()
			.replaceAll(']', '')
			.replaceAll('[', '')
			.replaceAll('!', '');
		this.isAggregate = returnType.includes('Aggregate');
		return this.getSelect(this.fields);
	}

	private get fields() {
		return parseResolveInfo(this.info);
	}

	static isObject(item: any) {
		return item && typeof item === 'object' && !Array.isArray(item);
	}

	static mergeDeep(target: any, ...sources: any[]): any {
		if (sources.length === 0) return target;
		const source: any = sources.shift();

		if (PrismaSelect.isObject(target) && PrismaSelect.isObject(source)) {
			for (const key in source) {
				if (PrismaSelect.isObject(source[key])) {
					if (!target[key]) Object.assign(target, { [key]: {} });
					PrismaSelect.mergeDeep(target[key], source[key]);
				} else {
					Object.assign(target, { [key]: source[key] });
				}
			}
		}

		return PrismaSelect.mergeDeep(target, ...sources);
	}

	private getArgs(args?: Record<string, unknown>) {
		const filteredArgs: Record<string, any> = {};
		if (args) {
			for (const key of this.availableArgs) {
				if (args[key]) {
					filteredArgs[key] = args[key];
				}
			}
		}
		return filteredArgs;
	}

	private getSelect(
		fields: PrismaSelect<T>['fields'],
		parent = true,
	): { select: T } {
		const selectObject: any = this.isAggregate
			? {}
			: { select: {} as T, ...(parent ? {} : this.getArgs(fields?.args)) };

		if (fields) {
			for (const type of Object.keys(fields.fieldsByTypeName)) {
				const fieldsByTypeName: any = fields.fieldsByTypeName[type];

				for (const key of Object.keys(fieldsByTypeName)) {
					const fieldName = fieldsByTypeName[key].name;

					// Skip this field if it is in the exclude list
					if (parent && PrismaSelect.excludeSet.has(fieldName)) {
						continue;
					}

					if (
						Object.keys(fieldsByTypeName[key].fieldsByTypeName).length === 0
					) {
						if (this.isAggregate) {
							selectObject[fieldName] = true;
						} else {
							selectObject.select[fieldName] = true;
						}
					} else if (this.isAggregate) {
						selectObject[fieldName] = this.getSelect(
							fieldsByTypeName[key],
							false,
						);
					} else {
						selectObject.select[fieldName] = this.getSelect(
							fieldsByTypeName[key],
							false,
						);
					}
				}
			}
		}

		return selectObject;
	}

	/**
	 * These are derived fields through @ResolveField that will not be found using prisma select
	 * We prefix all these with `_` for clarity
	 */
	private static excludeSet = new Set([
		// fields
		'_isFavorited',
		'_priceHourlyVectorsWithNeighbors',
		'_neighborPriceHourlyVectors',
		'_requiresReAuth',
		'_realizedProfitAndLoss',
		// Objects
		'authConnectionExt',
	]);
}
