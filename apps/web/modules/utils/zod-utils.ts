import { z } from 'zod';

export function cleanNumber(val: unknown) {
	return typeof val === 'string'
		? Number.parseFloat(val.replace(/[^\d.-]/g, ''))
		: val;
}

export const zodNumber = z.preprocess(
	(val) =>
		typeof val === 'string'
			? Number.parseFloat(val.replace(/[^\d.-]/g, ''))
			: val,
	z.coerce.number(),
);
