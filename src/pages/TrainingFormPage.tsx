import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import type { TrainingSession, SessionStatus } from '../types';
import { SESSION_STATUS_LABELS } from '../types';
import { THEATER_TECHNIQUES } from '../constants/techniques';
import { formatDateFull, formatTime } from '../utils/dateUtils';
import Header from '../components/layout/Header';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import TextArea from '../components/ui/TextArea';
import Select from '../components/ui/Select';
import MultiSelect from '../components/ui/MultiSelect';
import { Save, ChevronLeft, ChevronRight, ArrowRight, CheckCircle2 } from 'lucide-react';
import { supabaseRestRequest } from '../services/supabaseAuthService';

export default function TrainingFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const sessionId = Number(id);

  const session = useLiveQuery(() => db.sessions.get(sessionId), [sessionId]);
  const classes = useLiveQuery(() => db.classes.toArray()) ?? [];
  const scripts = useLiveQuery(() => db.scripts.toArray()) ?? [];

  const [form, setForm] = useState<Partial<TrainingSession>>({});
  const [saved, setSaved] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [openActivity, setOpenActivity] = useState<string | null>(null);

  const difficultyOptions = ['الخجل وعدم الجرأة','صعوبة التركيز','صعوبة فهم التعليمات','صعوبة التعبير بالحركة','صعوبة التعبير بالصوت','قلة المشاركة','التشتت داخل المجموعة','صعوبة احترام الدور','صعوبة العمل الجماعي','صعوبة الحفظ أو التذكر','لا توجد صعوبات'];
  const activityGuides: Record<string, { title: string; how: string; goal: string }> = {
    'الاستقبال والتهيئة': { title:'الاستقبال والتهيئة', how:'يقف التلاميذ في دائرة. رحّب بهم وذكّرهم بقواعد المسرح: الاستماع، احترام الدور، وعدم السخرية من الآخرين. ثم خذ نفساً عميقاً وحضّر المجموعة للحصة.', goal:'خلق جو آمن ومريح والاستعداد للعمل الجماعي.' },
    'مرآتي': { title:'تمرين مرآتي', how:'قسّم التلاميذ إلى ثنائيات. تلميذ يقوم بحركات بطيئة، والثاني يقلّده كأنه مرآة. بعد دقيقة يتبادلان الأدوار.', goal:'تنمية التركيز والانتباه والتواصل غير اللفظي.' },
    'تمثال': { title:'تمرين تمثال', how:'اطلب من التلاميذ المشي بحرية. عندما تقول «تمثال» يتوقف كل واحد في وضعية ثابتة. غيّر الوضعيات: فرح، خوف، حيوان، بطل...', goal:'التحكم في الجسد والتعبير الجسدي.' },
    'المشي في الفضاء': { title:'المشي في الفضاء', how:'يتمشى التلاميذ في الفضاء دون الاصطدام ببعضهم. غيّر السرعة والإيقاع واطلب منهم تغيير الاتجاه عند الإشارة.', goal:'اكتشاف الفضاء وتنمية الانتباه للمجموعة.' },
    'نمشي بحال': { title:'نمشي بحال...', how:'اقترح شخصيات أو حيوانات: أسد، قطة، عجوز، روبوت... وعلى التلميذ تغيير طريقة المشي والجسد حسب الشخصية.', goal:'تنمية الخيال والتعبير بالجسد.' },
    'حكاية جماعية': { title:'حكاية جماعية بالحركة', how:'ابدأ حكاية بسيطة، وكل تلميذ يضيف حركة أو حدثاً. المجموعة تمثل الحكاية بالحركة دون الحاجة إلى حفظ نص.', goal:'تنمية الخيال والتعاون وبناء حكاية جماعية.' },
    'المشاعر في الجسد': { title:'المشاعر في الجسد', how:'سمِّ شعوراً مثل الفرح أو الخوف أو الغضب. يعبّر التلاميذ عنه بالجسد والوجه دون كلام، ثم يناقشون كيف تغيّر الجسد.', goal:'التعرف على المشاعر وترجمتها إلى أداء مسرحي.' },
    'تمرين الصوت والمسافة': { title:'تمرين الصوت والمسافة', how:'يقف التلميذ في مسافات مختلفة عن زميله ويقول جملة قصيرة بوضوح، مع تغيير قوة الصوت حسب المسافة دون صراخ.', goal:'التحكم في الصوت والإسقاط الصوتي.' },
    'من أنا؟': { title:'من أنا؟ بالحركة والصوت', how:'يختار التلميذ شخصية ويقدمها بحركة وصوت دون ذكر اسمها، ويحاول باقي التلاميذ اكتشاف الشخصية.', goal:'بناء شخصية واستعمال الجسد والصوت معاً.' },
    'مشهد في 3 صور': { title:'مشهد في 3 صور', how:'في مجموعات صغيرة، اصنعوا مشهداً من ثلاث وضعيات ثابتة: البداية، الوسط، النهاية. يلاحظ الآخرون القصة ويحاولون تفسيرها.', goal:'تنمية بناء المشهد والعمل الجماعي.' },
    'المشي بالشخصية': { title:'المشي بالشخصية', how:'اختر شخصية مثل شرطي، تاجر، طفل، ملك... واطلب من التلميذ تغيير المشية، الوقفة والإيقاع ليصبح هو الشخصية.', goal:'اكتشاف أن الشخصية تبنى من الجسد والحركة.' },
    'نفس الجملة': { title:'نفس الجملة بشخصيات مختلفة', how:'يعطي الأستاذ جملة واحدة. يقولها التلميذ كأنه طفل، عجوز، شخص غاضب، شخص خائف أو سعيد، مع تغيير الأداء فقط.', goal:'تطوير المرونة في الأداء وبناء الشخصية.' },
    'نعم، ولكن': { title:'نعم، ولكن...', how:'في ثنائي، يقترح الأول فكرة للمشهد. على الثاني أن يقبل الفكرة ويضيف إليها باستعمال «نعم، ولكن...»، ثم يستمر الحوار لبناء المشهد.', goal:'تنمية الارتجال والاستماع وقبول أفكار الشريك.' },
    'ارتجال ثنائي': { title:'ارتجال ثنائي قصير', how:'أعطِ كل ثنائي موقفاً بسيطاً: لقاء صديقين، مشكل في القسم، ضياع شيء... يمنحهم وقتاً قصيراً للتحضير ثم يمثلون.', goal:'تطوير التفاعل والحوار والارتجال.' },
    'بناء شخصية': { title:'بناء شخصية من حركة وصوت', how:'يختار التلميذ شخصية ويحدد لها مشية وصوتاً وحركة مميزة، ثم يقدمها أمام المجموعة.', goal:'ربط الجسد والصوت لصناعة شخصية واضحة.' },
  };

  const lessonPlans: Record<string, { topic: string; objectives: string[]; activities: string[]; skills: string[] }> = {
    CP: { topic:'اكتشاف المسرح والتعبير بالجسد', objectives:['التعرف على فضاء المسرح وقواعد العمل الجماعي','تنمية الجرأة والثقة في التعبير أمام الآخرين','استعمال الجسد والحركة للتعبير','تنمية التركيز والانتباه والاستماع'], activities:['الاستقبال والتهيئة — 5 د','مرآتي — 5 د','تمثال — 5 د','المشي في الفضاء — 7 د','نمشي بحال... — 5 د','حكاية جماعية بالحركة — 8 د'], skills:['التركيز','التعبير الجسدي','الجرأة','الخيال','المشاركة'] },
    CE2: { topic:'الجسد والصوت في الفضاء المسرحي', objectives:['التحكم في الحركة داخل فضاء المسرح','التعبير عن المشاعر بواسطة الجسد','استعمال الصوت بوضوح وبدرجات مختلفة','تنمية الخيال والقدرة على التفاعل مع المجموعة'], activities:['المشي في الفضاء وتغيير السرعة — 5 د','المشاعر في الجسد — 5 د','تمرين الصوت والمسافة — 5 د','من أنا؟ بالحركة والصوت — 7 د','مشهد في 3 صور — 8 د'], skills:['الصوت','الحركة','التعبير عن المشاعر','الخيال','التعاون'] },
    CM2: { topic:'بناء الشخصية والارتجال المسرحي', objectives:['اكتشاف عناصر بناء الشخصية المسرحية','تطوير الحضور والثقة فوق الخشبة','استعمال الصوت والجسد لصناعة شخصية','تنمية القدرة على الارتجال والتفاعل مع الشريك','احترام قواعد الحوار والعمل الجماعي'], activities:['المشي بالشخصية — 5 د','نفس الجملة بشخصيات مختلفة — 5 د','نعم، ولكن... — 5 د','ارتجال ثنائي قصير — 8 د','بناء شخصية من حركة وصوت — 7 د'], skills:['الحضور المسرحي','بناء الشخصية','الارتجال','الحوار','التعاون'] },
  };

  const classId = session?.classId;
  const classSessions = useLiveQuery(
    () => classId ? db.sessions.where('classId').equals(classId).filter(s => !s.isHoliday).sortBy('date') : [],
    [classId]
  ) ?? [];

  useEffect(() => {
    if (session) {
      setForm({
        topic: session.topic || lessonPlans[classes.find(c => c.id === session.classId)?.name || '']?.topic || '',
        objectives: session.objectives || lessonPlans[classes.find(c => c.id === session.classId)?.name || '']?.objectives.join(' • ') || '',
        activities: session.activities || lessonPlans[classes.find(c => c.id === session.classId)?.name || '']?.activities.join(' • ') || '',
        techniques: session.techniques || [],
        teacherNotes: session.teacherNotes,
        difficulties: session.difficulties,
        studentsNeedingSupport: session.studentsNeedingSupport,
        nextSessionPlan: session.nextSessionPlan,
        scriptId: session.scriptId,
        sceneInfo: session.sceneInfo,
        status: session.status,
      });
    }
  }, [session, classes]);

  if (!session) return <div className="text-center py-16 text-text-muted">جاري التحميل...</div>;

  const cls = classes.find(c => c.id === session.classId);
  const levelScripts = scripts.filter(s => s.level === cls?.level);

  const currentIdx = classSessions.findIndex(s => s.id === sessionId);
  const prevSession = currentIdx > 0 ? classSessions[currentIdx - 1] : null;
  const nextSession = currentIdx < classSessions.length - 1 ? classSessions[currentIdx + 1] : null;

  const syncCompletedSession = async (completedForm: Partial<TrainingSession>) => {
    try {
      await supabaseRestRequest(
        `sessions?class_id=eq.${session.classId}&date=eq.${session.date}`,
        {
          method: 'PATCH',
          headers: { Prefer: 'return=minimal' },
          body: JSON.stringify({
            status: 'completed',
            topic: completedForm.topic || '',
            objectives: completedForm.objectives || '',
            activities: completedForm.activities || '',
            techniques: completedForm.techniques || [],
            teacher_notes: completedForm.teacherNotes || '',
            difficulties: completedForm.difficulties || '',
            students_needing_support: completedForm.studentsNeedingSupport || '',
            next_session_plan: completedForm.nextSessionPlan || '',
            script_id: completedForm.scriptId ?? null,
            scene_info: completedForm.sceneInfo || '',
          }),
        },
      );
    } catch {
      // Local completion remains available when Supabase is not configured.
    }
  };

  const handleSave = async () => {
    await db.sessions.update(sessionId, form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleComplete = async () => {
    setCompleting(true);
    const completedForm = { ...form, status: 'completed' as SessionStatus };
    await db.sessions.update(sessionId, completedForm);
    await syncCompletedSession(completedForm);
    setForm(completedForm);
    setSaved(true);
    setCompleting(false);
    setTimeout(() => setSaved(false), 2500);
  };

  const set = (key: string, value: unknown) => setForm(prev => ({ ...prev, [key]: value }));
  const selectedDifficulties = form.difficulties ? form.difficulties.split('،').map(v => v.trim()).filter(Boolean) : [];
  const toggleDifficulty = (difficulty: string) => {
    if (difficulty === 'لا توجد صعوبات') { set('difficulties', selectedDifficulties.includes(difficulty) ? '' : difficulty); return; }
    const next = selectedDifficulties.includes(difficulty) ? selectedDifficulties.filter(v => v !== difficulty) : [...selectedDifficulties.filter(v => v !== 'لا توجد صعوبات'), difficulty];
    set('difficulties', next.join('، '));
  };

  if (session.isHoliday) {
    return (
      <div>
        <Header title="🏖️ عطلة" actions={<Button variant="ghost" onClick={() => navigate(-1)} icon={<ArrowRight size={18} />}>رجوع</Button>} />
        <Card className="text-center py-12">
          <span className="text-5xl block mb-4">🏖️</span>
          <h2 className="text-xl font-bold text-text mb-2">{session.holidayName}</h2>
          <p className="text-text-muted">{formatDateFull(session.date)}</p>
          <p className="text-sm text-text-muted mt-2">لا توجد حصة في هذا اليوم</p>
        </Card>
      </div>
    );
  }

  const linkedScript = form.scriptId ? scripts.find(s => s.id === form.scriptId) : null;
  const isCompleted = form.status === 'completed';

  return (
    <div>
      <Header
        title="بطاقة التدريب"
        actions={<Button variant="ghost" onClick={() => navigate(-1)} icon={<ArrowRight size={18} />}>رجوع</Button>}
      />

      <Card className="mb-4 bg-gradient-to-l from-primary/5 to-transparent border-s-4 border-s-primary">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <div><span className="text-text-muted">📅 التاريخ:</span><div className="font-semibold">{formatDateFull(session.date)}</div></div>
          <div><span className="text-text-muted">📚 القسم:</span><div className="font-semibold">{cls?.name}</div></div>
          <div><span className="text-text-muted">🕐 الساعة:</span><div className="font-semibold">{formatTime(session.startTime)}</div></div>
          <div><span className="text-text-muted">⏱️ المدة:</span><div className="font-semibold">{session.duration} دقيقة</div></div>
        </div>
        {session.sessionNumber > 0 && (
          <div className="mt-2 text-sm">
            <span className="text-text-muted">🎭 الحصة رقم:</span>
            <span className="font-bold text-primary ms-1">{session.sessionNumber}</span>
          </div>
        )}
        {linkedScript && (
          <div className="mt-1 text-sm">
            <span className="text-text-muted">📖 المسرحية:</span>
            <span className="font-semibold ms-1">{linkedScript.title}</span>
          </div>
        )}
        {isCompleted && (
          <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-green-50 text-green-700 px-3 py-1.5 text-xs font-bold">
            <CheckCircle2 size={15} /> الحصة منفذة — التقرير متاح للمدير
          </div>
        )}
      </Card>

      <div className="space-y-4">
        {lessonPlans[cls?.name || ''] && <Card className="border-2 border-primary/20 bg-primary/5">
          <h2 className="text-lg font-bold text-text mb-4">📋 الجذاذة المعتمدة للحصة</h2>
          <div className="space-y-4">
            <div><div className="text-xs font-semibold text-text-muted mb-1">الموضوع</div><div className="font-bold text-primary">{lessonPlans[cls?.name || ''].topic}</div></div>
            <div><div className="text-xs font-semibold text-text-muted mb-2">الأهداف</div>{lessonPlans[cls?.name || ''].objectives.map(x => <div key={x} className="flex gap-2 text-sm mb-1"><span>🎯</span><span>{x}</span></div>)}</div>
            <div><div className="text-xs font-semibold text-text-muted mb-2">مراحل وأنشطة الحصة</div>{lessonPlans[cls?.name || ''].activities.map(x => {
                    const key = Object.keys(activityGuides).find(k => x.startsWith(k));
                    const guide = key ? activityGuides[key] : null;
                    const isOpen = openActivity === x;
                    return <div key={x} className="rounded-lg border border-border overflow-hidden">
                      <button type="button" onClick={() => setOpenActivity(isOpen ? null : x)} className="w-full flex items-center justify-between gap-2 p-3 text-sm text-start hover:bg-surface-alt">
                        <span className="flex gap-2"><span>🎭</span><span>{x}</span></span>
                        <span className="text-primary font-bold">{isOpen ? '−' : '+'}</span>
                      </button>
                      {isOpen && guide && <div className="border-t border-border bg-surface-alt p-4 text-sm space-y-2">
                        <div><span className="font-bold">كيفاش ندير التدريب؟</span><p className="mt-1 text-text-muted leading-6">{guide.how}</p></div>
                        <div><span className="font-bold">الهدف من التدريب:</span><p className="mt-1 text-text-muted">{guide.goal}</p></div>
                      </div>}
                    </div>;
                  })}</div>
            <div><div className="text-xs font-semibold text-text-muted mb-2">المهارات المستهدفة</div><div className="flex flex-wrap gap-2">{lessonPlans[cls?.name || ''].skills.map(x => <span key={x} className="rounded-full bg-white border border-border px-2.5 py-1 text-xs">{x}</span>)}</div></div>
          </div>
        </Card>}

        <TextArea label="موضوع الحصة" value={form.topic || ''} onChange={v => set('topic', v)} rows={2} placeholder="مثلاً: تمارين الإحماء والتعبير الجسدي" />
        <TextArea label="أهداف الحصة" value={form.objectives || ''} onChange={v => set('objectives', v)} rows={3} placeholder="ما الأهداف المراد تحقيقها؟" />
        <TextArea label="الأنشطة التي أنجزناها" value={form.activities || ''} onChange={v => set('activities', v)} rows={4} placeholder="تمارين الإحماء الجسدي، تمارين التنفس، تدريب على الوقفة المسرحية..." />

        <MultiSelect
          label="التقنيات المسرحية الموظفة"
          options={THEATER_TECHNIQUES.map(t => ({ value: t.id, label: t.label, icon: t.icon }))}
          selectedValues={form.techniques || []}
          onChange={v => set('techniques', v)}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select label="المسرحية المرتبطة" value={String(form.scriptId || '')}
            onChange={v => set('scriptId', v ? Number(v) : undefined)}
            options={levelScripts.map(s => ({ value: String(s.id), label: s.title }))}
            placeholder="— بدون مسرحية —" />
          <div className="mb-4">
            <label className="block text-sm font-medium text-text mb-1">المشهد</label>
            <input type="text" value={form.sceneInfo || ''} onChange={e => set('sceneInfo', e.target.value)}
              placeholder="مثلاً: المشهد الثاني"
              className="w-full rounded-lg border border-border p-3 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none" />
          </div>
        </div>

        <TextArea label="ملاحظات الأستاذ" value={form.teacherNotes || ''} onChange={v => set('teacherNotes', v)} rows={3} />
        <Card>
          <h3 className="font-bold text-text mb-1">⚠️ الصعوبات التي واجهت التلاميذ</h3>
          <p className="text-xs text-text-muted mb-3">كوشي فقط على الصعوبات التي لاحظتيها أثناء الحصة.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">{difficultyOptions.map(x => <label key={x} className="flex items-center gap-3 rounded-lg border border-border p-3 cursor-pointer hover:bg-surface-alt"><input type="checkbox" checked={selectedDifficulties.includes(x)} onChange={() => toggleDifficulty(x)} className="h-5 w-5 accent-primary" /><span className="text-sm">{x}</span></label>)}</div>
        </Card>
        <TextArea label="التلاميذ الذين يحتاجون إلى مواكبة" value={form.studentsNeedingSupport || ''} onChange={v => set('studentsNeedingSupport', v)} rows={2} />
        <TextArea label="ما سيتم إنجازه في الحصة القادمة" value={form.nextSessionPlan || ''} onChange={v => set('nextSessionPlan', v)} rows={3} />

        <Select label="حالة الحصة" value={form.status || 'scheduled'}
          onChange={v => set('status', v as SessionStatus)}
          options={Object.entries(SESSION_STATUS_LABELS).map(([v, l]) => ({ value: v, label: l }))} />

        <div className="sticky bottom-20 md:bottom-4 pt-4 space-y-2">
          {!isCompleted && (
            <Button onClick={handleComplete} size="lg" className="w-full" icon={<CheckCircle2 size={20} />} disabled={completing}>
              {completing ? 'جاري تسجيل الحصة...' : '✅ نفذت الحصة — إنشاء التقرير'}
            </Button>
          )}
          <Button onClick={handleSave} size="lg" className="w-full" variant={isCompleted ? 'primary' : 'secondary'} icon={<Save size={20} />}>
            {saved ? '✅ تم الحفظ بنجاح' : '💾 حفظ الحصة'}
          </Button>
        </div>

        <div className="flex items-center justify-between pt-4 pb-2">
          {prevSession ? (
            <Button variant="ghost" size="sm" onClick={() => navigate(`/admin/training/${prevSession.id}`)} icon={<ChevronRight size={16} />}>
              الحصة السابقة
            </Button>
          ) : <div />}
          {nextSession ? (
            <Button variant="ghost" size="sm" onClick={() => navigate(`/admin/training/${nextSession.id}`)} icon={<ChevronLeft size={16} />}>
              الحصة التالية
            </Button>
          ) : <div />}
        </div>
      </div>
    </div>
  );
}
