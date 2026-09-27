import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { ArrowRight, BarChart3, BookOpen, Calendar, CheckCircle2, Clock, FileText, XCircle, AlertTriangle } from 'lucide-react';
import { db } from '../db/database';
import { SESSION_STATUS_LABELS, type SessionStatus } from '../types';
import { supabaseRestRequest } from '../services/supabaseAuthService';

function statusClass(status: SessionStatus): string {
  switch (status) {
    case 'completed': return 'bg-green-100 text-green-800';
    case 'postponed': return 'bg-amber-100 text-amber-800';
    case 'cancelled': return 'bg-red-100 text-red-800';
    default: return 'bg-blue-100 text-blue-800';
  }
}

export default function DirectorClassPage() {
  const { id } = useParams<{ id: string }>();
  const classId = Number(id);
  const localClass = useLiveQuery(() => Number.isFinite(classId) ? db.classes.get(classId) : undefined, [classId]);
  const localSessions = useLiveQuery(() => Number.isFinite(classId) ? db.sessions.where('classId').equals(classId).sortBy('date') : [], [classId]) ?? [];

  const [data, setData] = React.useState<{ cls: any; sessions: any[] } | null>(null);
  const [remoteScript, setRemoteScript] = React.useState<any | null>(null);
  const [loadingRemote, setLoadingRemote] = React.useState(true);

  React.useEffect(() => {
    let active = true;
    let intervalId: number | undefined;

    const load = async () => {
      try {
        const [classes, sessions] = await Promise.all([
          supabaseRestRequest<any[]>(`classes?id=eq.${classId}&select=*`),
          supabaseRestRequest<any[]>(`sessions?class_id=eq.${classId}&select=*&order=date.desc,start_time.desc`),
        ]);
        if (active && classes?.[0]) {
          setData({ cls: classes[0], sessions: sessions || [] });
          const scriptId = (sessions || []).map((s: any) => s.script_id).find((value: any) => value !== null && value !== undefined);
          if (scriptId) {
            const scripts = await supabaseRestRequest<any[]>(`scripts?id=eq.${scriptId}&select=*`);
            if (active && scripts?.[0]) setRemoteScript(scripts[0]);
          } else if (active) {
            setRemoteScript(null);
          }
        }
      } catch {
        // Dexie remains a safe local fallback.
      } finally {
        if (active) setLoadingRemote(false);
      }
    };

    if (Number.isFinite(classId)) {
      load();
      // تحديث تلقائي للتقرير بدون الحاجة إلى Refresh في جهاز المدير.
      intervalId = window.setInterval(load, 3000);
    } else {
      setLoadingRemote(false);
    }

    return () => {
      active = false;
      if (intervalId !== undefined) window.clearInterval(intervalId);
    };
  }, [classId]);

  const cls = data?.cls || localClass;
  const sessions = data
    ? data.sessions
    : localSessions.map(s => ({ ...s, start_time: s.startTime, class_id: s.classId, session_number: s.sessionNumber }));

  const localScriptIds = new Set(localSessions.map(s => s.scriptId).filter(Boolean));
  const localScripts = useLiveQuery(
    () => localScriptIds.size ? db.scripts.toArray() : [],
    [classId, localSessions.length, Array.from(localScriptIds).join(',')],
  ) ?? [];

  const scriptIds = Array.from(new Set(sessions.map((s: any) => s.script_id ?? s.scriptId).filter((v: any) => v !== null && v !== undefined)));
  const remoteScripts = data ? localScripts.filter(s => scriptIds.includes(s.id)) : localScripts;
  const firstScript = remoteScript || remoteScripts[0];

  if (!cls) {
    return (
      <div className="min-h-screen bg-bg py-12 px-4" dir="rtl">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-text-muted mb-4">القسم غير موجود.</p>
          <Link to="/" className="text-primary font-semibold">العودة إلى الواجهة الرئيسية</Link>
        </div>
      </div>
    );
  }

  const completed = sessions.filter((s: any) => s.status === 'completed').length;
  const scheduled = sessions.filter((s: any) => s.status === 'scheduled').length;
  const postponed = sessions.filter((s: any) => s.status === 'postponed').length;
  const cancelled = sessions.filter((s: any) => s.status === 'cancelled').length;
  // المدير يشاهد تفاصيل التقرير فقط للحصص التي تم تنفيذها فعلاً.
  const completedSessions = sessions.filter((s: any) => s.status === 'completed');

  return (
    <div className="min-h-screen bg-bg py-8 px-4" dir="rtl">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between gap-4 mb-6">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-primary">
            <ArrowRight size={18} /> العودة إلى الواجهة
          </Link>
          <span className="inline-flex items-center gap-2 bg-white border border-gray-200 px-3 py-1.5 rounded-full text-xs font-semibold text-primary">
            <BarChart3 size={14} /> وضع المدير
          </span>
        </div>

        <div className="bg-gradient-to-l from-primary via-primary-dark to-[#4a0e0e] rounded-3xl p-7 md:p-10 text-white mb-6">
          <p className="text-white/70 text-sm mb-2">القسم المستفيد</p>
          <h1 className="text-3xl md:text-5xl font-black">{cls.name}</h1>
          <p className="mt-2 text-white/80">{cls.level}</p>
          {loadingRemote && <p className="text-xs text-white/50 mt-3">جاري مزامنة التقرير مع قاعدة البيانات...</p>}
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center gap-3 mb-5">
            <BarChart3 className="text-primary" size={22} />
            <div>
              <h2 className="text-xl font-black text-text">تتبع القسم</h2>
              <p className="text-sm text-text-muted">عدد الحصص المبرمجة والمنجزة والمؤجلة والملغاة</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <div className="rounded-2xl bg-blue-50 p-4"><div className="text-2xl font-black text-blue-700">{scheduled}</div><div className="text-xs text-blue-700/70">مبرمجة</div></div>
            <div className="rounded-2xl bg-green-50 p-4"><div className="text-2xl font-black text-green-700">{completed}</div><div className="text-xs text-green-700/70">منجزة</div></div>
            <div className="rounded-2xl bg-amber-50 p-4"><div className="text-2xl font-black text-amber-700">{postponed}</div><div className="text-xs text-amber-700/70">مؤجلة</div></div>
            <div className="rounded-2xl bg-red-50 p-4"><div className="text-2xl font-black text-red-700">{cancelled}</div><div className="text-xs text-red-700/70">ملغاة</div></div>
          </div>

          {firstScript && (
            <Link to={`/director/script/${firstScript.id}`} className="inline-flex items-center gap-2 rounded-xl bg-primary/5 text-primary px-4 py-3 font-semibold text-sm hover:bg-primary/10 transition-colors">
              <BookOpen size={18} /> نص المسرحية: {firstScript.title}
            </Link>
          )}
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-1">
            <FileText size={20} className="text-secondary" />
            <h2 className="text-lg font-black text-text">تقارير الحصص المنفذة</h2>
          </div>
          <p className="text-sm text-text-muted mb-4">التقرير يظهر هنا فقط بعد تأكيد تنفيذ الحصة، ويعرض الخلاصة والأهداف والملاحظات والصعوبات وخطة الحصة القادمة.</p>

          {completedSessions.length === 0 ? (
            <div className="py-12 text-center">
              <Clock className="mx-auto mb-3 text-text-muted" size={30} />
              <p className="font-semibold text-text">لا يوجد تقرير بعد</p>
              <p className="text-sm text-text-muted mt-1">الحصة ما زالت مبرمجة ولم يتم تأكيد تنفيذها.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {completedSessions.map((session: any, index: number) => {
                const status: SessionStatus = session.status;
                const date = session.date;
                const topic = session.topic || 'بدون موضوع مسجل';
                const notes = session.teacher_notes ?? session.teacherNotes ?? '';
                return (
                  <div key={session.id ?? index} className="rounded-2xl border border-gray-100 p-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-text">الحصة {session.session_number ?? session.sessionNumber ?? index + 1}</span>
                          <span className={`px-2 py-1 rounded-full text-[11px] font-semibold ${statusClass(status)}`}>{SESSION_STATUS_LABELS[status] || status}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-text-muted mt-1">
                          <span className="inline-flex items-center gap-1"><Calendar size={13} /> {date}</span>
                          <span className="inline-flex items-center gap-1"><Clock size={13} /> {session.start_time || session.startTime}</span>
                          <span>{session.duration} دقيقة</span>
                        </div>
                      </div>
                      <CheckCircle2 className="text-success" size={20} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="bg-gray-50 rounded-xl p-3"><div className="text-[11px] font-bold text-primary mb-1">موضوع الحصة</div><div className="text-sm text-text whitespace-pre-line">{topic}</div></div>
                      <div className="bg-gray-50 rounded-xl p-3"><div className="text-[11px] font-bold text-primary mb-1">أهداف الحصة</div><div className="text-sm text-text whitespace-pre-line">{session.objectives || '—'}</div></div>
                      <div className="bg-gray-50 rounded-xl p-3 md:col-span-2"><div className="text-[11px] font-bold text-primary mb-1">ملاحظات الأستاذ</div><div className="text-sm text-text-muted whitespace-pre-line">{notes || '—'}</div></div>
                      {session.difficulties && <div className="bg-amber-50 rounded-xl p-3 md:col-span-2"><div className="text-[11px] font-bold text-amber-700 mb-1">الصعوبات التي واجهت التلاميذ</div><div className="text-sm text-text-muted whitespace-pre-line">{session.difficulties}</div></div>}
                      {(session.students_needing_support ?? session.studentsNeedingSupport) && <div className="bg-purple-50 rounded-xl p-3 md:col-span-2"><div className="text-[11px] font-bold text-purple-700 mb-1">التلاميذ الذين يحتاجون إلى مواكبة</div><div className="text-sm text-text-muted whitespace-pre-line">{session.students_needing_support ?? session.studentsNeedingSupport}</div></div>}
                      {session.next_session_plan && <div className="bg-blue-50 rounded-xl p-3 md:col-span-2"><div className="text-[11px] font-bold text-blue-700 mb-1">خطة الحصة القادمة</div><div className="text-sm text-text-muted whitespace-pre-line">{session.next_session_plan}</div></div>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
