import type { Holiday } from '../types';

export function isDateHoliday(date: string, holidays: Holiday[]): { isHoliday: boolean; holidayName?: string } {
  for (const h of holidays) {
    if (date >= h.startDate && date <= h.endDate) {
      return { isHoliday: true, holidayName: h.name };
    }
  }
  return { isHoliday: false };
}
