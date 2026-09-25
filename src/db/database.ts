import Dexie, { type Table } from 'dexie';
import type { ClassSection, TrainingSession, TheaterScript, Holiday, AnnualProgram, AppSettings, AdminAuth } from '../types';

export class MasrahiDB extends Dexie {
  classes!: Table<ClassSection>;
  sessions!: Table<TrainingSession>;
  scripts!: Table<TheaterScript>;
  holidays!: Table<Holiday>;
  programs!: Table<AnnualProgram>;
  settings!: Table<AppSettings>;
  adminAuth!: Table<AdminAuth>;

  constructor() {
    super('masrahiDB');
    this.version(1).stores({
      classes: '++id, name, level, dayOfWeek, order',
      sessions: '++id, classId, date, status, [classId+date]',
      scripts: '++id, title, level',
      holidays: '++id, name, startDate, endDate, type',
      programs: '++id, year',
      settings: '++id',
    });
    this.version(2).stores({
      classes: '++id, name, level, dayOfWeek, order',
      sessions: '++id, classId, date, status, [classId+date]',
      scripts: '++id, title, level',
      holidays: '++id, name, startDate, endDate, type',
      programs: '++id, year',
      settings: '++id',
      adminAuth: '++id',
    });
  }
}

export const db = new MasrahiDB();
