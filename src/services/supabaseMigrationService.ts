import { db } from '../db/database';
import { supabaseRestRequest, isSupabaseConfigured } from './supabaseAuthService';

type LocalRecord = Record<string, unknown>;

function withId(record: LocalRecord, idField = 'id') {
  const id = record[idField];
  return id == null ? { ...record } : { id, ...record };
}

async function upsert(table: string, rows: LocalRecord[]): Promise<void> {
  if (!rows.length) return;
  await supabaseRestRequest(table, {
    method: 'POST',
    headers: {
      Prefer: 'resolution=merge-duplicates,return=minimal',
    },
    body: JSON.stringify(rows),
  });
}

export interface MigrationResult {
  classes: number;
  scripts: number;
  holidays: number;
  programs: number;
  sessions: number;
  settings: number;
}

export async function migrateLocalDataToSupabase(): Promise<MigrationResult> {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase غير مهيأ. أضف متغيرات البيئة أولاً.');
  }

  const classes = await db.classes.toArray();
  const scripts = await db.scripts.toArray();
  const holidays = await db.holidays.toArray();
  const programs = await db.programs.toArray();
  const sessions = await db.sessions.toArray();
  const settings = await db.settings.toArray();

  await upsert(
    'classes',
    classes.map((c) => ({
      ...withId(c as LocalRecord),
      day_of_week: c.dayOfWeek,
      start_time: c.startTime,
      sort_order: c.order,
      is_public: true,
    })),
  );

  await upsert(
    'scripts',
    scripts.map((s) => ({
      ...withId(s as LocalRecord),
      character_count: s.characterCount,
      full_text: s.fullText,
      direction_notes: s.directionNotes,
      staging_notes: s.stagingNotes,
      sound_effects: s.soundEffects,
      character_count: s.characterCount,
      created_at: s.createdAt,
      updated_at: s.updatedAt,
    })),
  );

  await upsert(
    'holidays',
    holidays.map((h) => ({
      ...withId(h as LocalRecord),
      start_date: h.startDate,
      end_date: h.endDate,
    })),
  );

  for (const program of programs) {
    await upsert('programs', [{
      id: program.id,
      academic_year: program.year,
      title: 'البرنامج السنوي',
    }]);

    await upsert(
      'program_phases',
      (program.phases || []).map((phase: any) => ({
        id: phase.id,
        program_id: program.id,
        title: phase.title,
        description: phase.description,
        objectives: phase.objectives || [],
        activities: phase.activities || [],
        sort_order: phase.order || 0,
      })),
    );
  }

  await upsert(
    'settings',
    settings.map((s) => ({
      id: s.id,
      teacher_name: s.teacherName,
      school_name: s.schoolName,
      academic_year: s.academicYearStart && s.academicYearEnd
        ? `${s.academicYearStart}/${s.academicYearEnd}`
        : '2026/2027',
    })),
  );

  await upsert(
    'sessions',
    sessions.map((s) => ({
      ...withId(s as LocalRecord),
      class_id: s.classId,
      start_time: s.startTime,
      teacher_notes: s.teacherNotes,
      students_needing_support: s.studentsNeedingSupport,
      next_session_plan: s.nextSessionPlan,
      script_id: s.scriptId ?? null,
      scene_info: s.sceneInfo,
      session_number: s.sessionNumber,
      is_holiday: Boolean(s.isHoliday),
      holiday_name: s.holidayName ?? null,
    })),
  );

  return {
    classes: classes.length,
    scripts: scripts.length,
    holidays: holidays.length,
    programs: programs.length,
    sessions: sessions.length,
    settings: settings.length,
  };
}
