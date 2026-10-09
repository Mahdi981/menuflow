export type DayHours = {
  open: string;   // "09:00"
  close: string;  // "23:00"
  closed: boolean;
};

export type WorkingHours = {
  monday: DayHours;
  tuesday: DayHours;
  wednesday: DayHours;
  thursday: DayHours;
  friday: DayHours;
  saturday: DayHours;
  sunday: DayHours;
};

export const DEFAULT_HOURS: WorkingHours = {
  monday: { open: '09:00', close: '23:00', closed: false },
  tuesday: { open: '09:00', close: '23:00', closed: false },
  wednesday: { open: '09:00', close: '23:00', closed: false },
  thursday: { open: '09:00', close: '23:00', closed: false },
  friday: { open: '09:00', close: '23:00', closed: false },
  saturday: { open: '09:00', close: '23:00', closed: false },
  sunday: { open: '09:00', close: '23:00', closed: true },
};

export const DAY_LABELS: Record<keyof WorkingHours, string> = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday',
};

export const DAY_LABELS_AR: Record<keyof WorkingHours, string> = {
  monday: 'الإثنين',
  tuesday: 'الثلاثاء',
  wednesday: 'الأربعاء',
  thursday: 'الخميس',
  friday: 'الجمعة',
  saturday: 'السبت',
  sunday: 'الأحد',
};

const DAY_KEYS: (keyof WorkingHours)[] = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
];

/**
 * يرجع المفتاح لليوم الحالي
 */
export function getTodayKey(): keyof WorkingHours {
  return DAY_KEYS[new Date().getDay()];
}

/**
 * يتحقق إذا المطعم مفتوح الآن
 */
export function isOpenNow(hours: WorkingHours | null | undefined): boolean {
  if (!hours) return true; // إذا ما في ساعات محددة → مفتوح دايماً

  const todayKey = getTodayKey();
  const today = hours[todayKey];

  if (!today || today.closed) return false;

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const [openH, openM] = today.open.split(':').map(Number);
  const [closeH, closeM] = today.close.split(':').map(Number);

  const openMinutes = openH * 60 + openM;
  let closeMinutes = closeH * 60 + closeM;

  // إذا وقت الإغلاق بعد منتصف الليل
  if (closeMinutes < openMinutes) {
    closeMinutes += 24 * 60;
    return currentMinutes >= openMinutes || currentMinutes <= closeMinutes - 24 * 60;
  }

  return currentMinutes >= openMinutes && currentMinutes <= closeMinutes;
}

/**
 * يرجع حالة المطعم النصية
 */
export function getStatusText(
  hours: WorkingHours | null | undefined
): { label: string; labelAr: string; isOpen: boolean } {
  if (!hours) {
    return { label: 'Open', labelAr: 'مفتوح', isOpen: true };
  }

  const isOpen = isOpenNow(hours);
  if (isOpen) {
    return { label: 'Open Now', labelAr: 'مفتوح الآن', isOpen: true };
  }

  return { label: 'Closed', labelAr: 'مغلق', isOpen: false };
}

/**
 * يرجع الوقت النصي لليوم الحالي
 */
export function getTodayHoursText(
  hours: WorkingHours | null | undefined
): string {
  if (!hours) return '';
  const todayKey = getTodayKey();
  const today = hours[todayKey];
  if (!today || today.closed) return 'مغلق اليوم';
  return `${today.open} – ${today.close}`;
}