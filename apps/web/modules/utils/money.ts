export default class MoneyUtil {
  static amountDirection(
    amount?: string | number | null,
  ): 'positive' | 'nuetral' | 'negative' {
    if (!amount) {
      return 'nuetral';
    }
    if ((typeof amount === 'string' ? Number.parseFloat(amount) : amount) > 0) {
      return 'positive';
    }
    return 'negative';
  }

  static colored(
    amount?: string | number | null,
  ): string {
    if (!amount) {
      return 'text-gray-500';
    }
    if ((typeof amount === 'string' ? Number.parseFloat(amount) : amount) > 0) {
      return 'text-green-600';
    }
    return 'text-red-600';
  }
}
