import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import { SESSION_STATUS_LABELS, type SessionStatus, LEVELS } from '../types';
import { THEATER_TECHNIQUES, TECHNIQUE_LABELS } from '../constants/techniques';
import { formatDateArabic, formatTime, MOROCCAN_MONTHS } from '../utils/dateUtils';
import Header from '../components/layout/Header';
import SearchBar from '../components/ui/SearchBar';
import Select from '../components/ui/Select';
import StatusBadge from '../components/shared/StatusBadge';
import { ACADEMIC_YEAR } from '../constants/holidays';

export default function TrainingLogPage() {
  const navigate = useNavigate();
  const classes = useLiveQuery(() => db.classes.orderBy('order').toArray()) ?? [];
  const allSessions = useLiveQuery(() => db.sessions.filter(s => !s.isHoliday).toArray()) ?? [];

  const [search, setSearch] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [filterMonth, setFilterMonth] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterTechnique, setFilterTechnique] = useState('');

  let sessions = [...allSessions].sort((a, b) => b.date.localeCompare(a.date));

  if (filterClass) sessions = sessions.filter(s => s.classId === Number(filterClass));
  if (filterStatus) sessions = sessions.filter(s => s.status === filterStatus);
  if (filterMonth) {
    const [y, m] = filterMonth.split('-');
    sessions = sessions.filter(s => s.date.startsWith(`${y}-${m}`));
  }
  if (filterTechnique) sessions = sessions.filter(s => s.techniques.includes(filterTechnique));
  if (search) {
    const q = search.toLowerCase();
    sessions = sessions.filter(s => s.topic.toLowerCase().includes(q) || s.activities.toLowerCase().includes(q) || s.teacherNotes.toLowerCase().includes(q));
  }

  const getClassName = (classId: number) => classes.find(c => c.id === classId)?.name || '';

  // Generate month options from academic year
  const monthOptions: { value: string; label: string }[] = [];
  const start = new Date(ACADEMIC_YEAR.start + 'T00:00:00');
  const end = new Date(ACADEMIC_YEAR.end + 'T00:00:00');
  const cur = new Date(start.getFullYear(), start.getMonth(), 1);
  while (cur <= end) {
    const v = `${cur.getFullYear()}-${(cur.getMonth() + 1).toString().padStart(2, '0')}`;
    monthOptions.push({ value: v, label: `${MOROCCAN_MONTHS[cur.getMonth()]} ${cur.getFullYear()}` });
    cur.setMonth(cur.getMonth() + 1);
  }

  return (
    <div>
      <Header title="سجل التداريب" subtitle={`${sessions.length} حصة`} />

      {/* Search & filters */}
      <div className="space-y-3 mb-4">
        <SearchBar value={search} onChange={setSearch} placeholder="بحث في الموضوع، الأنشطة، الملاحظات..." />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <Select label="" value={filterClass} onChange={setFilterClass}
            options={classes.map(c => ({ value: String(c.id), label: c.name }))} placeholder="كل الأقسام" />
          <Select label="" value={filterMonth} onChange={setFilterMonth}
            options={monthOptions} placeholder="كل الأشهر" />
          <Select label="" value={filterStatus} onChange={setFilterStatus}
            options={Object.entries(SESSION_STATUS_LABELS).map(([v, l]) => ({ value: v, label: l }))} placeholder="كل الحالات" />
          <Select label="" value={filterTechnique} onChange={setFilterTechnique}
            options={THEATER_TECHNIQUES.map(t => ({ value: t.id, label: t.label }))} placeholder="كل التقنيات" />
        </div>
      </div>

      {/* Sessions table (desktop) / cards (mobile) */}
      <div className="hidden md:block bg-bg-card rounded-xl border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-border text-sm">
              <th className="text-start p-3 font-semibold text-text-muted">التاريخ</th>
              <th className="text-start p-3 font-semibold text-text-muted">القسم</th>
              <th className="text-start p-3 font-semibold text-text-muted">موضوع الحصة</th>
              <th className="text-start p-3 font-semibold text-text-muted">الحالة</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map(s => (
              <tr key={s.id} onClick={() => navigate(`/admin/training/${s.id}`)}
                className="border-b border-border hover:bg-gray-50 cursor-pointer transition-colors">
                <td className="p-3 text-sm whitespace-nowrap">{formatDateArabic(s.date)}</td>
                <td className="p-3 text-sm font-medium">{getClassName(s.classId)}</td>
                <td className="p-3 text-sm text-text-muted max-w-[200px] truncate">{s.topic || '—'}</td>
                <td className="p-3"><StatusBadge status={s.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-2">
        {sessions.map(s => (
          <div key={s.id} onClick={() => navigate(`/admin/training/${s.id}`)}
            className="bg-bg-card rounded-lg border border-border p-3 cursor-pointer hover:shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-medium text-sm">{getClassName(s.classId)}</div>
                <div className="text-xs text-text-muted">{formatDateArabic(s.date)} — {formatTime(s.startTime)}</div>
              </div>
              <StatusBadge status={s.status} />
            </div>
            {s.topic && <div className="text-sm text-text mt-1 truncate">{s.topic}</div>}
          </div>
        ))}
      </div>

      {sessions.length === 0 && (
        <div className="text-center py-16 text-text-muted">
          <p className="text-5xl mb-4">📋</p>
          <p className="font-semibold">لا توجد حصص مطابقة</p>
        </div>
      )}
    </div>
  );
}
