import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import type { Holiday } from '../types';
import { regenerateAllSessions } from '../services/sessionGenerator';
import { formatDateArabic } from '../utils/dateUtils';
import Header from '../components/layout/Header';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Badge from '../components/ui/Badge';
import { Plus, Edit, Trash2, Save } from 'lucide-react';

const typeLabels: Record<string, string> = { vacation: 'عطلة مدرسية', national: 'عيد وطني', custom: 'يوم استثنائي' };
const typeVariants: Record<string, 'info' | 'success' | 'warning'> = { vacation: 'info', national: 'success', custom: 'warning' };

const emptyHoliday: Omit<Holiday, 'id'> = { name: '', startDate: '', endDate: '', type: 'vacation' };

export default function HolidaysPage() {
  const holidays = useLiveQuery(() => db.holidays.orderBy('startDate').toArray()) ?? [];
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyHoliday);

  const openAdd = () => { setForm(emptyHoliday); setEditingId(null); setShowModal(true); };
  const openEdit = (h: Holiday) => {
    setForm({ name: h.name, startDate: h.startDate, endDate: h.endDate, type: h.type });
    setEditingId(h.id!); setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.startDate || !form.endDate) return;
    if (editingId) await db.holidays.update(editingId, form);
    else await db.holidays.add(form as Holiday);
    setShowModal(false);
    await regenerateAllSessions();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('هل تريد حذف هذه العطلة؟')) return;
    await db.holidays.delete(id);
    await regenerateAllSessions();
  };

  return (
    <div>
      <Header title="العطل المدرسية" subtitle="السنة الدراسية 2026/2027" actions={
        <Button onClick={openAdd} icon={<Plus size={18} />} size="sm">إضافة عطلة</Button>
      } />

      <div className="space-y-3">
        {holidays.map(h => (
          <Card key={h.id}>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <span className="text-2xl mt-0.5">{h.type === 'vacation' ? '🏖️' : h.type === 'national' ? '🇲🇦' : '📌'}</span>
                <div>
                  <h3 className="font-semibold text-text">{h.name}</h3>
                  <p className="text-sm text-text-muted mt-0.5">
                    {formatDateArabic(h.startDate)}
                    {h.startDate !== h.endDate && ` ← ${formatDateArabic(h.endDate)}`}
                  </p>
                  <Badge variant={typeVariants[h.type]} className="mt-1">{typeLabels[h.type]}</Badge>
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => openEdit(h)} className="p-2 rounded-lg hover:bg-gray-100"><Edit size={14} className="text-text-muted" /></button>
                <button onClick={() => handleDelete(h.id!)} className="p-2 rounded-lg hover:bg-red-50"><Trash2 size={14} className="text-danger" /></button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingId ? 'تعديل العطلة' : 'إضافة عطلة'} size="md">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text mb-1">اسم العطلة</label>
            <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-lg border border-border p-3 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text mb-1">تاريخ البداية</label>
              <input type="date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })}
                className="w-full rounded-lg border border-border p-3 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1">تاريخ النهاية</label>
              <input type="date" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })}
                className="w-full rounded-lg border border-border p-3 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-1">النوع</label>
            <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value as Holiday['type'] })}
              className="w-full rounded-lg border border-border p-3 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none">
              <option value="vacation">عطلة مدرسية</option>
              <option value="national">عيد وطني</option>
              <option value="custom">يوم استثنائي</option>
            </select>
          </div>
          <Button onClick={handleSave} className="w-full" icon={<Save size={18} />}>حفظ</Button>
        </div>
      </Modal>
    </div>
  );
}
