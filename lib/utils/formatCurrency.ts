const SYMBOLS: Record<string, string> = {
  USD: '$',
  LBP: 'ل.ل',
  EUR: '€',
  SAR: 'ر.س',
  AED: 'د.إ',
  EGP: 'ج.م',
  JOD: 'د.أ',
};

// عملات ما إلها كسور عملياً (ل.ل 500,000 مش 500,000.00)
const NO_DECIMALS = new Set(['LBP']);

/**
 * الرمز قبل الرقم + فواصل الآلاف:
 *   formatCurrency(500000, 'LBP') → "ل.ل500,000"
 *   formatCurrency(8.5, 'USD')    → "$8.50"
 */
export function formatCurrency(amount: number, currency = 'USD'): string {
  const symbol = SYMBOLS[currency] ?? currency;
  const decimals = NO_DECIMALS.has(currency) ? 0 : 2;

  const number = amount.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return `${symbol}${number}`;
}
