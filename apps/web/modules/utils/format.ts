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
}
