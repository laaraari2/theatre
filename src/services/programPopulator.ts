import { db } from '../db/database';
import { getSessionsForDay } from '../data/programData';

/**
 * Populates sessions in the database with the program data
 * (topic, objectives, activities) for all classes from Oct 2026 to Jan 2027
 */
export async function populateProgram(): Promise<{ updated: number; skipped: number }> {
  const classes = await db.classes.toArray();
  let updated = 0;
  let skipped = 0;

  for (const cls of classes) {
    const programEntries = getSessionsForDay(cls.dayOfWeek);
    if (programEntries.length === 0) continue;

    for (const entry of programEntries) {
      // Find the session for this class on this date
      const session = await db.sessions
        .where('[classId+date]')
        .equals([cls.id!, entry.date])
        .first();

      if (session && !session.isHoliday) {
        await db.sessions.update(session.id!, {
          topic: entry.topic,
          objectives: entry.objectives,
          activities: entry.activities,
        });
        updated++;
      } else {
        skipped++;
      }
    }
  }

  return { updated, skipped };
}
