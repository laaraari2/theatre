import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import { LEVELS } from '../types';
import { TECHNIQUE_LABELS } from '../constants/techniques';
import Header from '../components/layout/Header';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import SearchBar from '../components/ui/SearchBar';
import { Plus, Trash2 } from 'lucide-react';

export default function ScriptsPage() {
  const navigate = useNavigate();
  const scripts = useLiveQuery(() => db.scripts.toArray()) ?? [];
  const [activeLevel, setActiveLevel] = useState('');
  const [search, setSearch] = useState('');

  let filtered = scripts;
  if (activeLevel) filtered = filtered.filter(s => s.level === activeLevel);
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(s => s.title.toLowerCase().includes(q) || s.characters.toLowerCase().includes(q));
  }

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('هل تريد حذف هذا النص المسرحي؟')) return;
    await db.scripts.delete(id);
  };

  return (
    <div>
      <Header title="النصوص المسرحية" subtitle={`${filtered.length} نص`} actions={
        <Button onClick={() => navigate('/scripts/new')} icon={<Plus size={18} />}>إضافة نص جديد</Button>
      } />

      {/* Level tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button onClick={() => setActiveLevel('')}
          className={`px-3 py-1.5 rounded-lg text-sm ${!activeLevel ? 'bg-primary text-white' : 'bg-white border border-border text-text-muted hover:bg-gray-50'}`}
        >الكل</button>
        {LEVELS.map(l => (
          <button key={l} onClick={() => setActiveLevel(l)}
            className={`px-3 py-1.5 rounded-lg text-sm ${activeLevel === l ? 'bg-primary text-white' : 'bg-white border border-border text-text-muted hover:bg-gray-50'}`}
          >{l.replace(' ابتدائي', '')}</button>
        ))}
      </div>

      <div className="mb-4"><SearchBar value={search} onChange={setSearch} placeholder="بحث في العنوان أو الشخصيات..." /></div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(s => (
          <Card key={s.id} onClick={() => navigate(`/scripts/${s.id}`)} hoverable>
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-text truncate">{s.title}</h3>
                <p className="text-xs text-text-muted mt-0.5">{s.level}</p>
              </div>
              <button onClick={(e) => handleDelete(s.id!, e)} className="p-1.5 rounded-lg hover:bg-red-50 shrink-0">
                <Trash2 size={14} className="text-danger" />
              </button>
            </div>
            <div className="flex flex-wrap gap-3 mt-3 text-xs text-text-muted">
              <span>⏱️ {s.duration}</span>
              <span>👥 {s.characterCount} شخصية</span>
            </div>
            {s.techniques.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {s.techniques.slice(0, 4).map(t => (
                  <span key={t} className="text-[10px] bg-secondary/10 text-secondary-light rounded-full px-2 py-0.5">{TECHNIQUE_LABELS[t] || t}</span>
                ))}
              </div>
            )}
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-text-muted">
          <p className="text-5xl mb-4">🎬</p>
          <p className="font-semibold">لا توجد نصوص مسرحية</p>
          <p className="text-sm mt-1">أضف أول نص مسرحي</p>
          <Button className="mt-4" onClick={() => navigate('/scripts/new')}>إضافة نص</Button>
        </div>
      )}
    </div>
  );
}
