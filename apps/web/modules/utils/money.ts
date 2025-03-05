export default class MoneyUtil {
  static amountDirection(
    amount?: string | number | null
  ): 'positive' | 'nuetral' | 'negative' {
    if (!amount) return 'nuetral';
    if ((typeof amount === 'string' ? parseFloat(amount) : amount) > 0) {
      return 'positive';
    }
    return 'negative';
  }
}
