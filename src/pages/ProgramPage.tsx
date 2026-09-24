import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import type { ProgramPhase } from '../types';
import { DEFAULT_PROGRAM_PHASES } from '../constants/program';
import Header from '../components/layout/Header';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import TextArea from '../components/ui/TextArea';
import { Edit, Save, ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react';

export default function ProgramPage() {
  const program = useLiveQuery(() => db.programs.toCollection().first());
  const phases = program?.phases ?? DEFAULT_PROGRAM_PHASES;
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editPhase, setEditPhase] = useState<ProgramPhase | null>(null);
  const [showModal, setShowModal] = useState(false);

  const toggle = (id: string) => setExpandedId(prev => prev === id ? null : id);

  const openEdit = (p: ProgramPhase) => { setEditPhase({ ...p }); setShowModal(true); };

  const openAdd = () => {
    setEditPhase({
      id: `phase-${Date.now()}`, title: '', description: '', objectives: [''], activities: [''], order: phases.length + 1,
    });
    setShowModal(true);
  };

  const savePhase = async () => {
    if (!editPhase) return;
    let updated: ProgramPhase[];
    const existing = phases.find(p => p.id === editPhase.id);
    if (existing) {
      updated = phases.map(p => p.id === editPhase.id ? editPhase : p);
    } else {
      updated = [...phases, editPhase];
    }
    if (program?.id) {
      await db.programs.update(program.id, { phases: updated });
    } else {
      await db.programs.add({ year: '2026/2027', phases: updated });
    }
    setShowModal(false);
  };

  const deletePhase = async (id: string) => {
    if (!confirm('هل تريد حذف هذه المرحلة؟')) return;
    const updated = phases.filter(p => p.id !== id);
    if (program?.id) await db.programs.update(program.id, { phases: updated });
  };

  const updateList = (arr: string[], idx: number, val: string) => {
    const copy = [...arr];
    copy[idx] = val;
    return copy;
  };

  return (
    <div>
      <Header title="البرنامج السنوي" subtitle="التخطيط السنوي لورشة المسرح" actions={
        <Button onClick={openAdd} icon={<Plus size={18} />} size="sm">إضافة مرحلة</Button>
      } />

      <div className="space-y-4">
        {phases.sort((a, b) => a.order - b.order).map((phase, i) => (
          <Card key={phase.id}>
            <div className="flex items-center justify-between cursor-pointer" onClick={() => toggle(phase.id)}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">{i + 1}</div>
                <div>
                  <h3 className="font-bold text-text">{phase.title}</h3>
                  <p className="text-sm text-text-muted">{phase.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={e => { e.stopPropagation(); openEdit(phase); }} className="p-1.5 rounded-lg hover:bg-gray-100">
                  <Edit size={14} className="text-text-muted" />
                </button>
                <button onClick={e => { e.stopPropagation(); deletePhase(phase.id); }} className="p-1.5 rounded-lg hover:bg-red-50">
                  <Trash2 size={14} className="text-danger" />
                </button>
                {expandedId === phase.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </div>
            </div>
            {expandedId === phase.id && (
              <div className="mt-4 pt-4 border-t border-border">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-text mb-2">🎯 الأهداف</h4>
                    <ul className="space-y-1">
                      {phase.objectives.map((o, j) => (
                        <li key={j} className="text-sm text-text-muted flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>{o}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-text mb-2">📝 الأنشطة</h4>
                    <ul className="space-y-1">
                      {phase.activities.map((a, j) => (
                        <li key={j} className="text-sm text-text-muted flex items-start gap-2">
                          <span className="text-secondary mt-1">•</span>{a}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Edit modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editPhase?.title ? 'تعديل المرحلة' : 'إضافة مرحلة'} size="lg">
        {editPhase && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">العنوان</label>
              <input type="text" value={editPhase.title} onChange={e => setEditPhase({ ...editPhase, title: e.target.value })}
                className="w-full rounded-lg border border-border p-3 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none" />
            </div>
            <TextArea label="الوصف" value={editPhase.description} onChange={v => setEditPhase({ ...editPhase, description: v })} rows={2} />

            <div>
              <label className="block text-sm font-medium mb-2">الأهداف</label>
              {editPhase.objectives.map((o, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <input type="text" value={o} onChange={e => setEditPhase({ ...editPhase, objectives: updateList(editPhase.objectives, i, e.target.value) })}
                    className="flex-1 rounded-lg border border-border p-2 text-sm focus:ring-2 focus:ring-primary/30 outline-none" />
                  <button onClick={() => setEditPhase({ ...editPhase, objectives: editPhase.objectives.filter((_, j) => j !== i) })} className="text-danger text-sm">✕</button>
                </div>
              ))}
              <button onClick={() => setEditPhase({ ...editPhase, objectives: [...editPhase.objectives, ''] })} className="text-sm text-primary">+ إضافة هدف</button>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">الأنشطة</label>
              {editPhase.activities.map((a, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <input type="text" value={a} onChange={e => setEditPhase({ ...editPhase, activities: updateList(editPhase.activities, i, e.target.value) })}
                    className="flex-1 rounded-lg border border-border p-2 text-sm focus:ring-2 focus:ring-primary/30 outline-none" />
                  <button onClick={() => setEditPhase({ ...editPhase, activities: editPhase.activities.filter((_, j) => j !== i) })} className="text-danger text-sm">✕</button>
                </div>
              ))}
              <button onClick={() => setEditPhase({ ...editPhase, activities: [...editPhase.activities, ''] })} className="text-sm text-primary">+ إضافة نشاط</button>
            </div>

            <Button onClick={savePhase} className="w-full" icon={<Save size={18} />}>حفظ</Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
