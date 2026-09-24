import { db } from './database';

export async function exportData(): Promise<string> {
  const data = {
    classes: await db.classes.toArray(),
    sessions: await db.sessions.toArray(),
    scripts: await db.scripts.toArray(),
    holidays: await db.holidays.toArray(),
    programs: await db.programs.toArray(),
    settings: await db.settings.toArray(),
    exportDate: new Date().toISOString(),
    version: '1.0.0',
  };
  return JSON.stringify(data, null, 2);
}

export async function importData(jsonStr: string): Promise<void> {
  const data = JSON.parse(jsonStr);
  await db.transaction('rw', [db.classes, db.sessions, db.scripts, db.holidays, db.programs, db.settings], async () => {
    await db.classes.clear();
    await db.sessions.clear();
    await db.scripts.clear();
    await db.holidays.clear();
    await db.programs.clear();
    await db.settings.clear();
    if (data.classes) await db.classes.bulkAdd(data.classes);
    if (data.sessions) await db.sessions.bulkAdd(data.sessions);
    if (data.scripts) await db.scripts.bulkAdd(data.scripts);
    if (data.holidays) await db.holidays.bulkAdd(data.holidays);
    if (data.programs) await db.programs.bulkAdd(data.programs);
    if (data.settings) await db.settings.bulkAdd(data.settings);
  });
}

export async function resetDatabase(): Promise<void> {
  await db.delete();
  await db.open();
  // Seeds will run on next app load via seedDatabase()
}
