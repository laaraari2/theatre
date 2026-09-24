export const MOROCCAN_MONTHS = [
  'يناير', 'فبراير', 'مارس', 'أبريل', 'ماي', 'يونيو',
  'يوليوز', 'غشت', 'شتنبر', 'أكتوبر', 'نونبر', 'دجنبر',
];

export const ARABIC_DAYS = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

export function formatDateArabic(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return `${d.getDate()} ${MOROCCAN_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

export function formatDateFull(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return `${ARABIC_DAYS[d.getDay()]} ${d.getDate()} ${MOROCCAN_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

export function getDayName(dayIndex: number): string {
  return ARABIC_DAYS[dayIndex];
}

export function getMonthName(monthIndex: number): string {
  return MOROCCAN_MONTHS[monthIndex];
}

export function formatTime(time: string): string {
  const [h, m] = time.split(':').map(Number);
  const suffix = h < 12 ? 'صباحاً' : 'مساءً';
  const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${hour12}:${m.toString().padStart(2, '0')} ${suffix}`;
}

export function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function getWeekDatesInRange(dayOfWeek: number, startDate: string, endDate: string): string[] {
  const dates: string[] = [];
  const start = new Date(startDate + 'T00:00:00');
  const end = new Date(endDate + 'T00:00:00');
  const current = new Date(start);

  // Move to the first occurrence of dayOfWeek
  const diff = (dayOfWeek - current.getDay() + 7) % 7;
  current.setDate(current.getDate() + diff);

  while (current <= end) {
    dates.push(toISODate(current));
    current.setDate(current.getDate() + 7);
  }
  return dates;
}

export function isDateInRange(date: string, startDate: string, endDate: string): boolean {
  return date >= startDate && date <= endDate;
}

export function getMonthsInRange(startDate: string, endDate: string): { month: number; year: number; label: string }[] {
  const months: { month: number; year: number; label: string }[] = [];
  const start = new Date(startDate + 'T00:00:00');
  const end = new Date(endDate + 'T00:00:00');
  const current = new Date(start.getFullYear(), start.getMonth(), 1);

  while (current <= end) {
    months.push({
      month: current.getMonth(),
      year: current.getFullYear(),
      label: `${MOROCCAN_MONTHS[current.getMonth()]} ${current.getFullYear()}`,
    });
    current.setMonth(current.getMonth() + 1);
  }
  return months;
}

export function getDaysInMonth(year: number, month: number): Date[] {
  const days: Date[] = [];
  const d = new Date(year, month, 1);
  while (d.getMonth() === month) {
    days.push(new Date(d));
    d.setDate(d.getDate() + 1);
  }
  return days;
}
