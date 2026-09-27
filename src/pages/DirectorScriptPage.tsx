import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { ArrowRight, BookOpen, Clapperboard, Clock, Users } from 'lucide-react';
import { db } from '../db/database';
import { supabaseRestRequest } from '../services/supabaseAuthService';

export default function DirectorScriptPage() {
  const { id } = useParams<{ id: string }>();
  const scriptId = Number(id);
  const localScript = useLiveQuery(() => Number.isFinite(scriptId) ? db.scripts.get(scriptId) : undefined, [scriptId]);

  const [remoteScript, setRemoteScript] = React.useState<any | null>(null);

  React.useEffect(() => {
    let active = true;
    if (!Number.isFinite(scriptId)) return;

    supabaseRestRequest<any[]>(`scripts?id=eq.${scriptId}&select=*`)
      .then(rows => {
        if (active && rows?.[0]) setRemoteScript(rows[0]);
      })
      .catch(() => {
        // Local data remains available as a migration fallback.
      });

    return () => {
      active = false;
    };
  }, [scriptId]);

  const script: any = remoteScript || localScript;

  if (!script) {
    return (
      <div className="min-h-screen bg-bg py-12 px-4" dir="rtl">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-text-muted mb-4">النص المسرحي غير موجود.</p>
          <Link to="/" className="text-primary font-semibold">العودة إلى الواجهة الرئيسية</Link>
        </div>
      </div>
    );
  }

  const fullText = script.full_text ?? script.fullText ?? '';

  return (
    <div className="min-h-screen bg-bg py-8 px-4" dir="rtl">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between gap-4 mb-6">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-primary">
            <ArrowRight size={18} />
            العودة إلى الواجهة
          </Link>
          <span className="inline-flex items-center gap-2 bg-white border border-gray-200 px-3 py-1.5 rounded-full text-xs font-semibold text-primary">
            <BookOpen size={14} />
            نص خاص بالمدير
          </span>
        </div>

        <div className="bg-gradient-to-l from-primary via-primary-dark to-[#4a0e0e] rounded-3xl p-7 md:p-10 text-white mb-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center">
              <Clapperboard size={30} />
            </div>
            <div>
              <p className="text-white/60 text-xs mb-1">النص المسرحي</p>
              <h1 className="text-3xl md:text-5xl font-black leading-tight">{script.title}</h1>
              <p className="text-white/75 mt-2">{script.level}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 mt-6 text-sm text-white/80">
            <span className="inline-flex items-center gap-1.5"><Clock size={15} /> {script.duration}</span>
            <span className="inline-flex items-center gap-1.5"><Users size={15} /> {script.character_count ?? script.characterCount} شخصيات</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8">
          <div className="flex items-center gap-2 mb-5">
            <BookOpen size={20} className="text-primary" />
            <h2 className="text-xl font-black text-text">النص المكتوب</h2>
          </div>

          <div className="rounded-2xl bg-[#fffdf8] border border-amber-100 p-5 md:p-8">
            {fullText ? (
              <div className="whitespace-pre-wrap text-text leading-8 text-[15px] md:text-base font-medium">
                {fullText}
              </div>
            ) : (
              <div className="text-center py-10 text-text-muted">لم تتم إضافة النص الكامل بعد.</div>
            )}
          </div>

          {script.characters && (
            <section className="mt-8">
              <h3 className="font-black text-lg mb-3">الشخصيات</h3>
              <div className="whitespace-pre-wrap text-sm text-text-muted leading-7">{script.characters}</div>
            </section>
          )}

          {script.scenes && (
            <section className="mt-8">
              <h3 className="font-black text-lg mb-3">المشاهد</h3>
              <div className="whitespace-pre-wrap text-sm text-text-muted leading-7">{script.scenes}</div>
            </section>
          )}

          {script.directionNotes && (
            <section className="mt-8">
              <h3 className="font-black text-lg mb-3">تعليمات الإخراج</h3>
              <div className="whitespace-pre-wrap text-sm text-text-muted leading-7">{script.directionNotes}</div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
