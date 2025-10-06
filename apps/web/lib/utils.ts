/**
 * Formats a number or string value as currency (USD)
 * @param value - The value to format (number, string, null, or undefined)
 * @returns Formatted currency string or 'N/A' if value is invalid
 * @example
 * formatCurrency(1234.56) // "$1,234.56"
 * formatCurrency(-500) // "-$500.00"
 * formatCurrency(null) // "N/A"
 */
export function formatCurrency(value: string | number | null | undefined): string {
	if (value == null) return 'N/A';
	const numValue = typeof value === 'string' ? parseFloat(value) : value;
	if (Number.isNaN(numValue)) return 'N/A';
	
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	}).format(numValue);
}