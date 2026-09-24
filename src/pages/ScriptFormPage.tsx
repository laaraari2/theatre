import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import type { TheaterScript } from '../types';
import { LEVELS } from '../types';
import { THEATER_TECHNIQUES } from '../constants/techniques';
import Header from '../components/layout/Header';
import Button from '../components/ui/Button';
import TextArea from '../components/ui/TextArea';
import Select from '../components/ui/Select';
import MultiSelect from '../components/ui/MultiSelect';
import { Save, ArrowRight } from 'lucide-react';

const emptyScript: Omit<TheaterScript, 'id'> = {
  title: '', level: LEVELS[0], duration: '', characterCount: 0,
  characters: '', fullText: '', scenes: '', directionNotes: '',
  stagingNotes: '', soundEffects: '', music: '', lighting: '',
  scenography: '', accessories: '', techniques: [],
  createdAt: '', updatedAt: '',
};

export default function ScriptFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = id && id !== 'new';
  const scriptId = isEdit ? Number(id) : null;

  const existing = useLiveQuery(() => scriptId ? db.scripts.get(scriptId) : undefined, [scriptId]);
  const [form, setForm] = useState(emptyScript);

  useEffect(() => {
    if (existing) setForm({ ...existing });
  }, [existing]);

  const set = (key: string, value: unknown) => setForm(prev => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    if (!form.title.trim()) return;
    const now = new Date().toISOString();
    if (scriptId) {
      await db.scripts.update(scriptId, { ...form, updatedAt: now });
    } else {
      await db.scripts.add({ ...form, createdAt: now, updatedAt: now } as TheaterScript);
    }
    navigate('/scripts');
  };

  return (
    <div>
      <Header title={isEdit ? 'تعديل النص المسرحي' : 'إضافة نص مسرحي جديد'}
        actions={<Button variant="ghost" onClick={() => navigate('/scripts')} icon={<ArrowRight size={18} />}>رجوع</Button>} />

      <div className="space-y-1">
        <div className="mb-4">
          <label className="block text-sm font-medium text-text mb-1">العنوان *</label>
          <input type="text" value={form.title} onChange={e => set('title', e.target.value)}
            placeholder="عنوان المسرحية" className="w-full rounded-lg border border-border p-3 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select label="المستوى" value={form.level} onChange={v => set('level', v)} options={LEVELS.map(l => ({ value: l, label: l }))} />
          <div className="mb-4">
            <label className="block text-sm font-medium text-text mb-1">المدة</label>
            <input type="text" value={form.duration} onChange={e => set('duration', e.target.value)}
              placeholder="مثلاً: 30 دقيقة" className="w-full rounded-lg border border-border p-3 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-text mb-1">عدد الشخصيات</label>
            <input type="number" value={form.characterCount} onChange={e => set('characterCount', Number(e.target.value))} min={0}
              className="w-full rounded-lg border border-border p-3 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none" />
          </div>
        </div>

        <TextArea label="الشخصيات" value={form.characters} onChange={v => set('characters', v)} rows={3} placeholder="اسم الشخصية ووصفها..." />
        <TextArea label="النص الكامل" value={form.fullText} onChange={v => set('fullText', v)} rows={10} placeholder="نص المسرحية الكامل..." />
        <TextArea label="المشاهد" value={form.scenes} onChange={v => set('scenes', v)} rows={5} placeholder="وصف المشاهد..." />
        <TextArea label="تعليمات الإخراج" value={form.directionNotes} onChange={v => set('directionNotes', v)} rows={3} />
        <TextArea label="الحركة فوق الخشبة" value={form.stagingNotes} onChange={v => set('stagingNotes', v)} rows={3} />
        <TextArea label="المؤثرات الصوتية" value={form.soundEffects} onChange={v => set('soundEffects', v)} rows={2} />
        <TextArea label="الموسيقى" value={form.music} onChange={v => set('music', v)} rows={2} />
        <TextArea label="الإضاءة" value={form.lighting} onChange={v => set('lighting', v)} rows={2} />
        <TextArea label="السينوغرافيا" value={form.scenography} onChange={v => set('scenography', v)} rows={3} />
        <TextArea label="الإكسسوارات" value={form.accessories} onChange={v => set('accessories', v)} rows={2} />

        <MultiSelect label="التقنيات المسرحية الموظفة"
          options={THEATER_TECHNIQUES.map(t => ({ value: t.id, label: t.label, icon: t.icon }))}
          selectedValues={form.techniques || []} onChange={v => set('techniques', v)} />

        <Button onClick={handleSave} size="lg" className="w-full mt-4" icon={<Save size={20} />}>💾 حفظ النص</Button>
      </div>
    </div>
  );
}
