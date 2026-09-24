import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import Header from '../components/layout/Header';
import { ACADEMIC_YEAR } from '../constants/holidays';
import { getDaysInMonth, MOROCCAN_MONTHS, ARABIC_DAYS, toISODate, formatTime } from '../utils/dateUtils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import StatusBadge from '../components/shared/StatusBadge';

export default function TrainingPage() {
  const navigate = useNavigate();
  const classes = useLiveQuery(() => db.classes.orderBy('order').toArray()) ?? [];
  const sessions = useLiveQuery(() => db.sessions.toArray()) ?? [];
  const [filterClass, setFilterClass] = useState<number | null>(null);

  const startDate = new Date(ACADEMIC_YEAR.start + 'T00:00:00');
  const [currentMonth, setCurrentMonth] = useState(startDate.getMonth());
  const [currentYear, setCurrentYear] = useState(startDate.getFullYear());

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
    else setCurrentMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
    else setCurrentMonth(m => m + 1);
  };

  const days = getDaysInMonth(currentYear, currentMonth);
  const firstDayOfWeek = days[0]?.getDay() ?? 0;
  const today = toISODate(new Date());

  const getSessionsForDate = (date: string) => {
    let s = sessions.filter(ses => ses.date === date);
    if (filterClass !== null) s = s.filter(ses => ses.classId === filterClass);
    return s;
  };

  const getClassName = (classId: number) => classes.find(c => c.id === classId)?.name || '';

  // Build calendar grid (padding for first week)
  const paddingDays = Array(firstDayOfWeek).fill(null);

  return (
    <div>
      <Header title="جدول التداريب" subtitle="دفتر التتبع اليومي للحصص المسرحية" />

      {/* Class filter */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setFilterClass(null)}
          className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${filterClass === null ? 'bg-primary text-white' : 'bg-white border border-border text-text-muted hover:bg-gray-50'}`}
        >الكل</button>
        {classes.map(c => (
          <button key={c.id} onClick={() => setFilterClass(c.id!)}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${filterClass === c.id ? 'bg-primary text-white' : 'bg-white border border-border text-text-muted hover:bg-gray-50'}`}
          >{c.name}</button>
        ))}
      </div>

      {/* Month navigator */}
      <div className="flex items-center justify-between bg-bg-card rounded-xl p-3 mb-4 border border-border">
        <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-gray-100"><ChevronRight size={20} /></button>
        <h2 className="text-lg font-bold text-text">{MOROCCAN_MONTHS[currentMonth]} {currentYear}</h2>
        <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-gray-100"><ChevronLeft size={20} /></button>
      </div>

      {/* Calendar grid */}
      <div className="bg-bg-card rounded-xl border border-border overflow-hidden">
        {/* Day headers */}
        <div className="grid grid-cols-7 border-b border-border">
          {ARABIC_DAYS.map(d => (
            <div key={d} className="p-2 text-center text-xs font-semibold text-text-muted bg-gray-50">{d}</div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7">
          {paddingDays.map((_, i) => <div key={`pad-${i}`} className="min-h-[80px] md:min-h-[100px] border-b border-e border-border bg-gray-50/30" />)}
          {days.map(day => {
            const dateStr = toISODate(day);
            const daySessions = getSessionsForDate(dateStr);
            const isToday = dateStr === today;
            return (
              <div key={dateStr} className={`min-h-[80px] md:min-h-[100px] border-b border-e border-border p-1 ${isToday ? 'bg-primary/5 ring-2 ring-inset ring-primary/30' : ''}`}>
                <div className={`text-xs font-medium mb-1 px-1 ${isToday ? 'text-primary font-bold' : 'text-text-muted'}`}>
                  {day.getDate()}
                </div>
                <div className="space-y-1">
                  {daySessions.map(s => (
                    s.isHoliday ? (
                      <div key={s.id} className="text-[10px] bg-amber-50 text-amber-700 rounded px-1 py-0.5 truncate">🏖️ {s.holidayName}</div>
                    ) : (
                      <div key={s.id} onClick={() => navigate(`/admin/training/${s.id}`)}
                        className="text-[10px] bg-primary/5 hover:bg-primary/10 rounded px-1 py-0.5 cursor-pointer truncate border border-primary/10">
                        <span className="font-medium">{getClassName(s.classId)}</span>
                        <span className="text-text-muted ms-1">{s.startTime}</span>
                      </div>
                    )
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
