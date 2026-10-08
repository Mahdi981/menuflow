export type ThemePreset = {
  id: string;
  name: string;
  name_ar: string;
  primary: string;
  accent: string;
  bg: string;
  text: string;
};

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'teal',
    name: 'Teal',
    name_ar: 'أخضر مزرق',
    primary: '#1C7E84',
    accent: '#C9A227',
    bg: '#F0EEE9',
    text: '#1A1A1A',
  },
  {
    id: 'burgundy',
    name: 'Burgundy',
    name_ar: 'نبيتي',
    primary: '#7F1D1D',
    accent: '#F59E0B',
    bg: '#FEF3C7',
    text: '#1F2937',
  },
  {
    id: 'charcoal',
    name: 'Charcoal',
    name_ar: 'فحمي',
    primary: '#1F2937',
    accent: '#F59E0B',
    bg: '#F5F5F4',
    text: '#0F172A',
  },
  {
    id: 'ocean',
    name: 'Ocean',
    name_ar: 'أزرق محيطي',
    primary: '#0369A1',
    accent: '#FBBF24',
    bg: '#EFF6FF',
    text: '#0C4A6E',
  },
  {
    id: 'forest',
    name: 'Forest',
    name_ar: 'غابة',
    primary: '#166534',
    accent: '#D97706',
    bg: '#F0FDF4',
    text: '#14532D',
  },
  {
    id: 'royal',
    name: 'Royal',
    name_ar: 'ملكي',
    primary: '#6D28D9',
    accent: '#F59E0B',
    bg: '#F5F3FF',
    text: '#2E1065',
  },
  {
    id: 'rose',
    name: 'Rose',
    name_ar: 'وردي',
    primary: '#BE185D',
    accent: '#F59E0B',
    bg: '#FFF1F2',
    text: '#4C0519',
  },
  {
    id: 'dark',
    name: 'Dark',
    name_ar: 'داكن',
    primary: '#EA580C',
    accent: '#FBBF24',
    bg: '#0F172A',
    text: '#F1F5F9',
  },
];

export function getPreset(id: string | null | undefined): ThemePreset {
  return THEME_PRESETS.find((p) => p.id === id) ?? THEME_PRESETS[0];
}

/**
 * يحوّل hex color إلى HSL variables للاستخدام في CSS
 * (اختياري — إذا احتجت theme darker/lighter)
 */
export function hexToRgb(hex: string): string {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  return `${r} ${g} ${b}`;
}