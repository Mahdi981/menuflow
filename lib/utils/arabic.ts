// صيغة الجمع العربية: صنف واحد / صنفان / 3 أصناف / 11 صنفاً
export function itemsLabel(n: number): string {
  if (n === 0) return 'لا أصناف';
  if (n === 1) return 'صنف واحد';
  if (n === 2) return 'صنفان';
  if (n >= 3 && n <= 10) return `${n} أصناف`;
  return `${n} صنفاً`;
}
