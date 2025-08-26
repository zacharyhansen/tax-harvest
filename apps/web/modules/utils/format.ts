import Decimal from 'decimal.js';

// biome-ignore lint/complexity/noStaticOnlyClass: <ok>
export default class Format {
	static money(amount?: string | number | null, toFixed = 2) {
		if (amount === null || amount === undefined) {
			return null;
		}

		const formatted = new Intl.NumberFormat('en-US', {
			currency: 'USD',
			style: 'currency',
			minimumFractionDigits: toFixed,
			maximumFractionDigits: toFixed,
		}).format(Number(amount));

		return formatted;
	}

	static formatLargeNumber(amount?: string | number | null, isUSD?: boolean) {
		if (!amount) {
			return null;
		}
		const number = Number(amount);
		const formatter = (num: string) =>
			isUSD ? `$${num.toLocaleString()}` : num.toString();
		if (number >= 1_000_000_000_000) {
			return formatter(
				`${(number / 1_000_000_000_000).toFixed(1).replace(/\.0$/, '')}T`,
			);
		} else if (number >= 1_000_000_000) {
			return formatter(
				`${(number / 1_000_000_000).toFixed(1).replace(/\.0$/, '')}B`,
			);
		} else if (number >= 1_000_000) {
			return formatter(
				`${(number / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`,
			);
		} else if (number >= 1_000) {
			return formatter(`${(number / 1_000).toFixed(1).replace(/\.0$/, '')}K`);
		} else {
			return formatter(number.toString());
		}
	}

	static hideNumbers(numberStr?: string | null, canView = 4) {
		if (!numberStr) {
			return null;
		}
		const visiblePart = numberStr.slice(-4); // Get the last 4 characters
		const hiddenPart = '•'.repeat(numberStr.length - canView); // Replace the rest with black dots
		return hiddenPart + visiblePart;
	}

	static roundShares(shares: string | number | null | Decimal, decimals = 0) {
		if (!shares) {
			return '-';
		}
		if (shares instanceof Decimal) {
			return shares.toFixed(decimals);
		}
		return Number(shares).toFixed(decimals);
	}

	static relativeDays(date: string | Date | null | undefined) {
		if (!date) {
			return null;
		}
		const parsedDate = typeof date === 'string' ? new Date(date) : date;
		const diffMs = Date.now() - parsedDate.getTime();
		const diffMinutes = Math.floor(diffMs / (1000 * 60));
		const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
		const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
		const diffWeeks = Math.floor(diffDays / 7);
		const diffMonths = Math.floor(diffDays / 30);
		const diffYears = Math.floor(diffDays / 365);

		if (diffMinutes < 120) {
			// Less than 2 hours
			return `${diffMinutes} minute${diffMinutes === 1 ? '' : 's'}`;
		} else if (diffHours < 12) {
			return `${diffHours} hour${diffHours === 1 ? '' : 's'}`;
		} else if (diffDays < 36) {
			return `${diffDays} day${diffDays === 1 ? '' : 's'}`;
		} else if (diffWeeks < 12) {
			return `${diffWeeks} week${diffWeeks === 1 ? '' : 's'}`;
		} else if (diffMonths < 12) {
			return `${diffMonths} month${diffMonths === 1 ? '' : 's'}`;
		} else {
			return `${diffYears} year${diffYears === 1 ? '' : 's'}`;
		}
	}
}
