export default class MoneyUtil {
  static amountDirection(
    amount?: string | number | null,
  ): 'positive' | 'nuetral' | 'negative' {
    if (!amount) {
      return 'nuetral'
    }
    if ((typeof amount === 'string' ? Number.parseFloat(amount) : amount) > 0) {
      return 'positive'
    }
    return 'negative'
  }

  static colored(amount?: string | number | null, classNumber?: number): string {
    if (!amount) {
      return `text-gray-${classNumber || 500}`
    }
    if ((typeof amount === 'string' ? Number.parseFloat(amount) : amount) > 0) {
      return `text-green-${classNumber || 600}`
    }
    return `text-red-${classNumber || 600}`
  }
}
