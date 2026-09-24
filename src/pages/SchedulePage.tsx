import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import type { ClassSection } from '../types';
import { DAY_NAMES, LEVELS } from '../types';
import { regenerateFutureSessions, generateSessionsForClass } from '../services/sessionGenerator';
import { ACADEMIC_YEAR } from '../constants/holidays';
import Header from '../components/layout/Header';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Select from '../components/ui/Select';
import { Plus, Edit, Clock, Calendar, LayoutGrid, List, Printer } from 'lucide-react';
import { formatTime } from '../utils/dateUtils';

const emptyClass: Omit<ClassSection, 'id' | 'order'> = {
  name: '', level: LEVELS[0], dayOfWeek: 1, startTime: '10:00', duration: 30,
};

// French day names to match the official "Emploi du Temps" format
const FRENCH_DAY_NAMES: Record<number, string> = {
  0: 'Dimanche',
  1: 'Lundi',
  2: 'Mardi',
  3: 'Mercredi',
  4: 'Jeudi',
  5: 'Vendredi',
  6: 'Samedi',
};

// Helper to calculate end time
const getEndTime = (start: string, duration: number): string => {
  const [h, m] = start.split(':').map(Number);
  const total = h * 60 + m + duration;
  const newH = Math.floor(total / 60);
  const newM = total % 60;
  return `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}`;
};

// Format time for display (e.g., "10:30" -> "10.30")
const formatTimeForTable = (time: string): string => time.replace(':', '.');

// Define the fixed time slot structure matching the image
interface TimeSlot {
  start: string;
  end: string;
  duration: number;
  period: 'morning' | 'afternoon';
}

const FIXED_TIME_SLOTS: TimeSlot[] = [
  { start: '10:00', end: '10:30', duration: 30, period: 'morning' },
  { start: '10:30', end: '11:00', duration: 30, period: 'morning' },
  { start: '11:00', end: '11:30', duration: 30, period: 'morning' },
  { start: '11:30', end: '12:00', duration: 30, period: 'morning' },
  { start: '14:30', end: '15:30', duration: 60, period: 'afternoon' },
  { start: '15:30', end: '16:30', duration: 60, period: 'afternoon' },
  { start: '16:30', end: '17:30', duration: 60, period: 'afternoon' },
];

// Days used in the schedule
const SCHEDULE_DAYS = [1, 2, 4]; // Lundi, Mardi, Jeudi

export default function SchedulePage() {
  const classes = useLiveQuery(() => db.classes.orderBy('order').toArray()) ?? [];
  const holidays = useLiveQuery(() => db.holidays.toArray()) ?? [];
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyClass);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  const openAdd = (dayOfWeek?: number, startTime?: string, duration?: number) => {
    setForm({
      ...emptyClass,
      ...(dayOfWeek !== undefined && { dayOfWeek }),
      ...(startTime !== undefined && { startTime }),
      ...(duration !== undefined && { duration }),
    });
    setEditingId(null);
    setShowModal(true);
  };

  const openEdit = (cls: ClassSection) => {
    setForm({ name: cls.name, level: cls.level, dayOfWeek: cls.dayOfWeek, startTime: cls.startTime, duration: cls.duration });
    setEditingId(cls.id!);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) return;
    if (editingId) {
      await db.classes.update(editingId, form);
      await regenerateFutureSessions(editingId);
    } else {
      const order = classes.length + 1;
      const id = await db.classes.add({ ...form, order } as ClassSection);
      const sessions = generateSessionsForClass({ ...form, id: id as number, order } as ClassSection, holidays, ACADEMIC_YEAR.start, ACADEMIC_YEAR.end);
      await db.sessions.bulkAdd(sessions);
    }
    setShowModal(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('هل تريد حذف هذا القسم وجميع حصصه؟')) return;
    await db.sessions.where('classId').equals(id).delete();
    await db.classes.delete(id);
    setShowModal(false);
  };

  // Group classes by day for Cards view
  const classesByDay = classes.reduce((acc, cls) => {
    if (!acc[cls.dayOfWeek]) acc[cls.dayOfWeek] = [];
    acc[cls.dayOfWeek].push(cls);
    return acc;
  }, {} as Record<number, ClassSection[]>);
  const sortedDays = Object.keys(classesByDay).map(Number).sort((a, b) => a - b);

  // Find class in a specific slot
  const getClassInSlot = (day: number, slot: TimeSlot): ClassSection | undefined => {
    return classes.find(c =>
      c.dayOfWeek === day &&
      c.startTime === slot.start
    );
  };

  // Check if there's a gap between morning and afternoon
  const morningSlots = FIXED_TIME_SLOTS.filter(s => s.period === 'morning');
  const afternoonSlots = FIXED_TIME_SLOTS.filter(s => s.period === 'afternoon');

  return (
    <div>
      <Header className="no-print" title="استعمال الزمن" subtitle="EMPLOI DU TEMPS — THEATRE 2026/2027" actions={
        <div className="flex gap-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex p-1 mr-2 hidden md:flex">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded ${viewMode === 'table' ? 'bg-primary/10 text-primary' : 'text-gray-500 hover:bg-gray-100'}`}
              title="عرض الجدول"
            >
              <LayoutGrid size={18} />
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded ${viewMode === 'cards' ? 'bg-primary/10 text-primary' : 'text-gray-500 hover:bg-gray-100'}`}
              title="عرض القائمة"
            >
              <List size={18} />
            </button>
          </div>
          <Button variant="secondary" onClick={() => window.print()} icon={<Printer size={18} />} className="hidden md:flex">طباعة</Button>
          <Button onClick={() => openAdd()} icon={<Plus size={18} />}>إضافة قسم</Button>
        </div>
      } />

      <div className="space-y-8">
        <div className="print-only mb-6 text-center">
          <h1 className="text-3xl font-bold mb-2">استعمال الزمن</h1>
          <p className="text-gray-600 text-lg">EMPLOI DU TEMPS — THEATRE 2026/2027</p>
        </div>

        {viewMode === 'table' ? (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-x-auto print:border-none print:shadow-none">
            {/* Title bar */}
            <div className="bg-gradient-to-l from-primary/10 to-primary/5 px-6 py-3 border-b border-gray-200 flex items-center justify-between no-print">
              <div className="flex items-center gap-2">
                <Calendar size={20} className="text-primary" />
                <span className="font-bold text-primary text-lg">EMPLOI DU TEMPS 2026/2027</span>
              </div>
              <span className="text-sm font-semibold text-gray-600 bg-white px-3 py-1 rounded-full border">THEATRE</span>
            </div>

            <table className="w-full border-collapse min-w-[900px] print:min-w-full">
              <thead>
                <tr>
                  {/* Horaire / Jour corner cell */}
                  <th className="border-2 border-gray-400 p-3 bg-gray-100 text-center w-28 relative">
                    <div className="text-xs text-gray-500 italic absolute top-1 right-2">Horaire</div>
                    <div className="text-xs text-gray-500 italic absolute bottom-1 left-2">Jour</div>
                    {/* Diagonal line effect */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
                      <line x1="0" y1="0" x2="100%" y2="100%" stroke="#9CA3AF" strokeWidth="1" />
                    </svg>
                  </th>

                  {/* Morning time slots */}
                  {morningSlots.map((slot, i) => (
                    <th key={slot.start} className={`border-2 border-gray-400 px-2 py-3 bg-gray-100 text-center ${i === morningSlots.length - 1 ? 'border-r-4 border-r-gray-500' : ''}`}>
                      <div className="text-base font-bold text-gray-800">{formatTimeForTable(slot.start)}</div>
                      <div className="text-sm text-gray-500">{formatTimeForTable(slot.end)}</div>
                    </th>
                  ))}

                  {/* Afternoon time slots */}
                  {afternoonSlots.map(slot => (
                    <th key={slot.start} className="border-2 border-gray-400 px-2 py-3 bg-gray-100 text-center">
                      <div className="text-base font-bold text-gray-800">{formatTimeForTable(slot.start)}</div>
                      <div className="text-sm text-gray-500">{formatTimeForTable(slot.end)}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SCHEDULE_DAYS.map(day => (
                  <tr key={day} className="group">
                    {/* Day name cell */}
                    <td className="border-2 border-gray-400 p-3 bg-gray-50 text-center">
                      <div className="font-bold text-gray-800 text-base">{FRENCH_DAY_NAMES[day]}</div>
                      <div className="text-xs text-gray-400">{DAY_NAMES[day]}</div>
                    </td>

                    {/* Morning slots */}
                    {morningSlots.map((slot, i) => {
                      const cls = getClassInSlot(day, slot);
                      return (
                        <td
                          key={`${day}-${slot.start}`}
                          className={`border-2 border-gray-400 p-0 text-center h-[72px] transition-all ${i === morningSlots.length - 1 ? 'border-r-4 border-r-gray-500' : ''} ${cls ? 'bg-white' : 'bg-amber-50/60'}`}
                        >
                          {cls ? (
                            <div
                              className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-primary/5 transition-colors px-1"
                              onClick={() => openEdit(cls)}
                            >
                              <span className="font-bold text-primary text-lg leading-tight">{cls.name}</span>
                            </div>
                          ) : (
                            <div
                              className="w-full h-full flex items-center justify-center cursor-pointer hover:bg-amber-100/80 transition-colors"
                              onClick={() => openAdd(day, slot.start, slot.duration)}
                            >
                              <Plus size={16} className="text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          )}
                        </td>
                      );
                    })}

                    {/* Afternoon slots */}
                    {afternoonSlots.map(slot => {
                      const cls = getClassInSlot(day, slot);
                      return (
                        <td
                          key={`${day}-${slot.start}`}
                          className={`border-2 border-gray-400 p-0 text-center h-[72px] transition-all ${cls ? 'bg-white' : 'bg-amber-50/60'}`}
                        >
                          {cls ? (
                            <div
                              className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-primary/5 transition-colors px-1"
                              onClick={() => openEdit(cls)}
                            >
                              <span className="font-bold text-primary text-lg leading-tight">{cls.name}</span>
                            </div>
                          ) : (
                            <div
                              className="w-full h-full flex items-center justify-center cursor-pointer hover:bg-amber-100/80 transition-colors"
                              onClick={() => openAdd(day, slot.start, slot.duration)}
                            >
                              <Plus size={16} className="text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Legend */}
            <div className="px-6 py-3 border-t border-gray-200 flex items-center gap-6 text-xs text-gray-500 no-print">
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 bg-white border-2 border-gray-300 rounded"></div>
                <span>حصة مبرمجة</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 bg-amber-50 border-2 border-gray-300 rounded"></div>
                <span>خانة فارغة (اضغط لإضافة)</span>
              </div>
            </div>
          </div>
        ) : (
          // Cards View
          classes.length === 0 ? (
            <div className="text-center py-16 text-text-muted">
              <p className="text-5xl mb-4">📅</p>
              <p className="font-semibold">لا توجد أقسام بعد</p>
              <p className="text-sm mt-1">أضف أول قسم لبدء جدولة الحصص</p>
            </div>
          ) : (
            sortedDays.map(dayIdx => (
              <div key={dayIdx} className="space-y-4">
                <h2 className="text-xl font-bold text-primary border-b-2 border-primary/20 pb-2 flex items-center gap-2">
                  <Calendar className="text-primary" size={24} />
                  {FRENCH_DAY_NAMES[dayIdx]} — {DAY_NAMES[dayIdx]}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {classesByDay[dayIdx]
                    .sort((a, b) => a.startTime.localeCompare(b.startTime))
                    .map(cls => (
                      <Card key={cls.id} className="relative border-r-4 border-r-primary hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-bold text-text text-lg">{cls.name}</h3>
                            <p className="text-sm text-text-muted">{cls.level}</p>
                          </div>
                          <div className="flex gap-1">
                            <button onClick={() => openEdit(cls)} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                              <Edit size={16} className="text-text-muted hover:text-primary" />
                            </button>
                          </div>
                        </div>
                        <div className="mt-4 bg-gray-50 rounded-lg p-3 flex items-center justify-between border border-gray-100">
                          <div className="flex items-center gap-2 text-primary font-bold">
                            <Clock size={18} />
                            <span className="text-lg">{formatTime(cls.startTime)} — {formatTime(getEndTime(cls.startTime, cls.duration))}</span>
                          </div>
                          <div className="text-sm text-text-muted font-medium bg-white px-3 py-1 rounded-full shadow-sm border border-gray-100">
                            {cls.duration} دقيقة
                          </div>
                        </div>
                      </Card>
                  ))}
                </div>
              </div>
            ))
          )
        )}
      </div>

      {/* Add / Edit Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingId ? 'تعديل القسم' : 'إضافة قسم جديد'} size="md">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text mb-1">اسم القسم</label>
            <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
              placeholder="مثلاً: CP أو 2APIC"
              className="w-full rounded-lg border border-border p-3 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none" />
          </div>
          <Select label="المستوى" value={form.level} onChange={v => setForm({ ...form, level: v })}
            options={LEVELS.map(l => ({ value: l, label: l }))} />
          <Select label="اليوم" value={String(form.dayOfWeek)} onChange={v => setForm({ ...form, dayOfWeek: Number(v) })}
            options={DAY_NAMES.map((d, i) => ({ value: String(i), label: d }))} />
          <div>
            <label className="block text-sm font-medium text-text mb-1">ساعة البداية</label>
            <input type="time" value={form.startTime} onChange={e => setForm({ ...form, startTime: e.target.value })}
              className="w-full rounded-lg border border-border p-3 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-1">مدة الحصة (دقيقة)</label>
            <input type="number" value={form.duration} onChange={e => setForm({ ...form, duration: Number(e.target.value) })} min={15} step={15}
              className="w-full rounded-lg border border-border p-3 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none" />
          </div>
          <div className="flex gap-2 pt-2">
            <Button onClick={handleSave} className="flex-1">💾 حفظ</Button>
            {editingId && (
              <Button variant="ghost" onClick={() => handleDelete(editingId)} className="text-danger hover:bg-red-50">🗑️ حذف</Button>
            )}
            <Button variant="ghost" onClick={() => setShowModal(false)}>إلغاء</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
