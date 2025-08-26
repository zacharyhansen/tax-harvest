export function dateOrNull(value?: string | number | Date | null): Date | null {
	if (!value) return null;

	return new Date(value);
}
