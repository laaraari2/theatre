import { db } from '../db/database';
import { TECHNIQUE_LABELS } from '../constants/techniques';
import { formatDateArabic } from '../utils/dateUtils';

export interface ClassReport {
  className: string;
  level: string;
  totalScheduled: number;
  totalCompleted: number;
  totalPostponed: number;
  totalCancelled: number;
  techniquesUsed: { label: string; count: number }[];
  scriptTitle: string;
  lastSession: { date: string; topic: string } | null;
  nextSession: { date: string } | null;
  sessions: { date: string; topic: string; techniques: string[]; status: string }[];
  teacherNotes: string[];
}

export async function generateClassReport(classId: number): Promise<ClassReport | null> {
  const cls = await db.classes.get(classId);
  if (!cls) return null;

  const sessions = await db.sessions.where('classId').equals(classId).toArray();
  const nonHoliday = sessions.filter(s => !s.isHoliday);
  const today = new Date().toISOString().split('T')[0];

  const completed = nonHoliday.filter(s => s.status === 'completed');
  const techCount: Record<string, number> = {};
  const notes: string[] = [];

  for (const s of completed) {
    for (const t of s.techniques) {
      techCount[t] = (techCount[t] || 0) + 1;
    }
    if (s.teacherNotes.trim()) notes.push(`${formatDateArabic(s.date)}: ${s.teacherNotes}`);
  }

  const techniquesUsed = Object.entries(techCount)
    .map(([id, count]) => ({ label: TECHNIQUE_LABELS[id] || id, count }))
    .sort((a, b) => b.count - a.count);

  // المسرحية المرتبطة
  let scriptTitle = 'لا توجد';
  const withScript = completed.find(s => s.scriptId);
  if (withScript?.scriptId) {
    const script = await db.scripts.get(withScript.scriptId);
    if (script) scriptTitle = script.title;
  }

  const sortedCompleted = completed.sort((a, b) => b.date.localeCompare(a.date));
  const lastSession = sortedCompleted.length > 0
    ? { date: formatDateArabic(sortedCompleted[0].date), topic: sortedCompleted[0].topic || '—' }
    : null;

  const futureScheduled = nonHoliday
    .filter(s => s.status === 'scheduled' && s.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date));
  const nextSession = futureScheduled.length > 0
    ? { date: formatDateArabic(futureScheduled[0].date) }
    : null;

  return {
    className: cls.name,
    level: cls.level,
    totalScheduled: nonHoliday.filter(s => s.status === 'scheduled').length,
    totalCompleted: completed.length,
    totalPostponed: nonHoliday.filter(s => s.status === 'postponed').length,
    totalCancelled: nonHoliday.filter(s => s.status === 'cancelled').length,
    techniquesUsed,
    scriptTitle,
    lastSession,
    nextSession,
    sessions: completed.map(s => ({
      date: formatDateArabic(s.date),
      topic: s.topic || '—',
      techniques: s.techniques.map(t => TECHNIQUE_LABELS[t] || t),
      status: s.status,
    })),
    teacherNotes: notes,
  };
}
