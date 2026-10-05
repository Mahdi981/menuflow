export function formatCurrency(amount: number, currency = 'USD'): string {
  const symbols: Record<string, string> = {
    USD: '$',
    LBP: 'ل.ل',
    EUR: '€',
    SAR: 'ر.س',
    AED: 'د.إ',
    EGP: 'ج.م',
    JOD: 'د.أ',
  };

  const symbol = symbols[currency] ?? currency;
  const fixed = amount.toFixed(2);

  // For Arabic currencies → symbol after number
  if (currency === 'LBP' || currency === 'SAR' || currency === 'AED' || currency === 'EGP') {
    return `${fixed} ${symbol}`;
  }

  return `${symbol}${fixed}`;
}