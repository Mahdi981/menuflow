// تحقق مشترك بين الواجهة والسيرفر

/** رقم لبناني: 7 أو 8 أرقام بيبلّش بمقدمة معروفة (03، 70، 71، 76، 78، 79، 81) */
export function isValidLebanesePhone(p: string): boolean {
  const cleaned = p.replace(/\D/g, '');
  if (cleaned.length !== 7 && cleaned.length !== 8) return false;
  return /^(3|70|71|76|78|79|81)/.test(cleaned);
}

export function toLebaneseE164(p: string): string {
  return `+961${p.replace(/\D/g, '')}`;
}
