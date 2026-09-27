import { db } from '../db/database';
import { supabaseRestRequest, isSupabaseConfigured } from './supabaseAuthService';

type LocalRow = {
  id?: number;
  [key: string]: unknown;
};

async function upsert(table: string, rows: LocalRow[]): Promise<void> {
  if (!rows.length) return;
  await supabaseRestRequest(table, {
    method: 'POST',
    headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
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

  const [classes, scripts, holidays, programs, sessions, settings] = await Promise.all([
    db.classes.toArray(),
    db.scripts.toArray(),
    db.holidays.toArray(),
    db.programs.toArray(),
    db.sessions.toArray(),
    db.settings.toArray(),
  ]);

  await upsert('classes', classes.map(c => ({
    id: c.id,
    name: c.name,
    level: c.level,
    day_of_week: c.dayOfWeek,
    start_time: c.startTime,
    duration: c.duration,
    sort_order: c.order ?? 0,
    is_public: true,
  })));

  await upsert('scripts', scripts.map(s => ({
    id: s.id,
    title: s.title,
    level: s.level,
    duration: s.duration,
    character_count: s.characterCount ?? 0,
    characters: s.characters ?? '',
    full_text: s.fullText ?? '',
    scenes: s.scenes ?? '',
    direction_notes: s.directionNotes ?? '',
    staging_notes: s.stagingNotes ?? '',
    sound_effects: s.soundEffects ?? '',
    music: s.music ?? '',
    lighting: s.lighting ?? '',
    scenography: s.scenography ?? '',
    accessories: s.accessories ?? '',
    techniques: s.techniques ?? [],
    created_at: s.createdAt,
    updated_at: s.updatedAt,
  })));

  await upsert('holidays', holidays.map(h => ({
    id: h.id,
    name: h.name,
    start_date: h.startDate,
    end_date: h.endDate,
    type: h.type,
  })));

  for (const program of programs) {
    await upsert('programs', [{
      id: program.id,
      academic_year: program.year,
      title: 'البرنامج السنوي',
    }]);

    await upsert('program_phases', (program.phases || []).map(phase => ({
      id: phase.id,
      program_id: program.id,
      title: phase.title,
      description: phase.description,
      objectives: phase.objectives || [],
      activities: phase.activities || [],
      sort_order: phase.order ?? 0,
    })));
  }

  await upsert('settings', settings.map(s => ({
    id: s.id,
    teacher_name: s.teacherName,
    school_name: s.schoolName,
    academic_year: s.academicYearStart && s.academicYearEnd
      ? s.academicYearStart + '/' + s.academicYearEnd
      : '2026/2027',
  })));

  await upsert('sessions', sessions.map(s => ({
    id: s.id,
    class_id: s.classId,
    date: s.date,
    start_time: s.startTime,
    duration: s.duration,
    topic: s.topic ?? '',
    objectives: s.objectives ?? '',
    activities: s.activities ?? '',
    techniques: s.techniques ?? [],
    teacher_notes: s.teacherNotes ?? '',
    difficulties: s.difficulties ?? '',
    students_needing_support: s.studentsNeedingSupport ?? '',
    next_session_plan: s.nextSessionPlan ?? '',
    script_id: s.scriptId ?? null,
    scene_info: s.sceneInfo ?? '',
    status: s.status,
    session_number: s.sessionNumber ?? 1,
    is_holiday: Boolean(s.isHoliday),
    holiday_name: s.holidayName ?? null,
  })));

  return {
    classes: classes.length,
    scripts: scripts.length,
    holidays: holidays.length,
    programs: programs.length,
    sessions: sessions.length,
    settings: settings.length,
  };
}