export interface TechniqueInfo {
  id: string;
  label: string;
  icon: string;
}

export const THEATER_TECHNIQUES: TechniqueInfo[] = [
  { id: 'body-expression', label: 'التعبير الجسدي', icon: '🤸' },
  { id: 'voice-expression', label: 'التعبير الصوتي', icon: '🗣️' },
  { id: 'breathing', label: 'التنفس', icon: '💨' },
  { id: 'diction', label: 'الإلقاء', icon: '🎤' },
  { id: 'improvisation', label: 'الارتجال', icon: '🎲' },
  { id: 'acting', label: 'التشخيص', icon: '🎭' },
  { id: 'monologue', label: 'المونولوج', icon: '👤' },
  { id: 'dialogue', label: 'الحوار', icon: '👥' },
  { id: 'stage-movement', label: 'الحركة فوق الخشبة', icon: '🚶' },
  { id: 'freeze', label: 'التجميد', icon: '🧊' },
  { id: 'tableaux', label: 'الصور المسرحية', icon: '🖼️' },
  { id: 'guided-improv', label: 'الارتجال الموجه', icon: '🧭' },
  { id: 'space-use', label: 'استعمال الفضاء', icon: '📐' },
  { id: 'rhythm', label: 'الإيقاع', icon: '🥁' },
  { id: 'music', label: 'الموسيقى', icon: '🎵' },
  { id: 'sound-effects', label: 'المؤثرات الصوتية', icon: '🔊' },
  { id: 'lighting', label: 'الإضاءة', icon: '💡' },
  { id: 'scenography', label: 'السينوغرافيا', icon: '🎨' },
  { id: 'accessories', label: 'الإكسسوارات', icon: '🎩' },
];

export const TECHNIQUE_LABELS: Record<string, string> = Object.fromEntries(
  THEATER_TECHNIQUES.map(t => [t.id, t.label])
);
