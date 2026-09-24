import type { Holiday } from '../types';

export const DEFAULT_HOLIDAYS: Omit<Holiday, 'id'>[] = [
  { name: 'عطلة منتصف الدورة الأولى', startDate: '2026-10-25', endDate: '2026-11-01', type: 'vacation' },
  { name: 'ذكرى المسيرة الخضراء', startDate: '2026-11-06', endDate: '2026-11-06', type: 'national' },
  { name: 'عيد الاستقلال', startDate: '2026-11-18', endDate: '2026-11-18', type: 'national' },
  { name: 'عطلة نهاية الدورة الأولى', startDate: '2026-12-20', endDate: '2027-01-04', type: 'vacation' },
  { name: 'ذكرى تقديم وثيقة الاستقلال', startDate: '2027-01-11', endDate: '2027-01-11', type: 'national' },
  { name: 'عطلة منتصف الدورة الثانية', startDate: '2027-03-21', endDate: '2027-03-28', type: 'vacation' },
  { name: 'عيد الشغل', startDate: '2027-05-01', endDate: '2027-05-01', type: 'national' },
  { name: 'عيد الأضحى', startDate: '2027-05-28', endDate: '2027-05-30', type: 'national' },
];

export const ACADEMIC_YEAR = {
  start: '2026-09-07',
  end: '2027-07-03',
  label: '2026/2027',
};
