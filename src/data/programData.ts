import type { TrainingSession } from '../types';

/**
 * Program data for all sessions from October 2026 to January 22, 2027
 * Mapped by day-group (Monday, Tuesday, Thursday) with date and content
 */

interface ProgramEntry {
  date: string;
  topic: string;
  objectives: string;
  activities: string;
  techniques?: string[];
}

// ???????????????????????????????????????????????????????????????
// ÇáÅËäíä: CP, CE2, CM2
// ???????????????????????????????????????????????????????????????
export const mondaySessions: ProgramEntry[] = [
  {
    date: '2026-10-05',
    topic: 'ÇáÊÚÇÑİ æÇßÊÔÇİ ÇáÑßÍ',
    objectives: 'ßÓÑ ÇáÌáíÏ — ÈäÇÁ ÇáËŞÉ — ÇáÊÚÑİ Úáì İÖÇÁ ÇáãÓÑÍ',
    activities: 'áÚÈÉ ÇáÃÓãÇÁ ÈÇáÍÑßÉ + ÇßÊÔÇİ İÖÇÁ ÇáÑßÍ + áÚÈÉ "ÇáãÑÂÉ"',
    techniques: ['body-expression', 'stage-movement']
  },
  {
    date: '2026-10-12',
    topic: 'ÊãÇÑíä ÇáÊÑßíÒ æÇáÇäÊÈÇå',
    objectives: 'ÊŞæíÉ ÇáÊÑßíÒ — ÇáÊäİÓ ÇáÈØäí — ÇáÇäÓÌÇã ÇáÌãÇÚí',
    activities: 'ÊãÇÑíä ÇáÊÑßíÒ æÇáÇäÊÈÇå: ÇáãÔí ÇáÚÔæÇÆí ãÚ ÇáÊæŞİ + ÇáÊäİÓ ÇáÈØäí ÇáÃÓÇÓí',
    techniques: ['breathing', 'rhythm']
  },
  {
    date: '2026-10-19',
    topic: 'ÇáÇÑÊÌÇá ÇáÕÇãÊ + ÊæÒíÚ ÇáäÕæÕ',
    objectives: 'ÇáÊÚÈíÑ ÈÇáÌÓÏ — ÊæÒíÚ äÕ ÇáãÓÑÍíÉ — ÊÚííä ÇáÃÏæÇÑ',
    activities: 'ÇáÇÑÊÌÇá ÇáÕÇãÊ (Pantomime): ÊÔÎíÕ ãåä ÈÏæä ßáÇã + ÊæÒíÚ äÕ ÇáãÓÑÍíÉ æÊÚííä ÇáÃÏæÇÑ áßá ÊáãíĞ',
    techniques: ['improvisation', 'body-expression']
  },
  // ÚØáÉ 26/10
  {
    date: '2026-11-02',
    topic: 'ÇáÊãæÖÚ İí ÇáİÖÇÁ + ŞÑÇÁÉ ÌãÇÚíÉ Ãæáì',
    objectives: 'İåã ÇáİÖÇÁ ÇáÑßÍí — ÇáŞÑÇÁÉ ÇáÃæáì ááäÕ ÇáãÓÑÍí',
    activities: 'ÊãÇÑíä ÇáÊãæÖÚ İí ÇáİÖÇÁ (ÃãÇã/Îáİ/æÓØ ÇáÎÔÈÉ) + ŞÑÇÁÉ ÌãÇÚíÉ Ãæáì ááäÕ ÇáãÓÑÍí',
    techniques: ['space-use', 'diction']
  },
  {
    date: '2026-11-09',
    topic: 'ÇáŞÑÇÁÉ ÇáÅíØÇáíÉ',
    objectives: 'ÊÕÍíÍ ÇáäØŞ — ÇáÊáæíä ÇáÕæÊí — İåã ÇáÍæÇÑÇÊ',
    activities: 'ÇáŞÑÇÁÉ ÇáÅíØÇáíÉ (Lectures Italiennes): ŞÑÇÁÉ ÇáÃÏæÇÑ ãÚ ÊÕÍíÍ ÇáäØŞ æÇáÊáæíä ÇáÕæÊí',
    techniques: ['diction', 'voice-expression']
  },
  {
    date: '2026-11-16',
    topic: 'ÇáßÑÓí ÇáÓÇÎä (Hot Seating)',
    objectives: 'İåã ÇáÔÎÕíÉ ãä ÇáÏÇÎá — ÊŞãÕ ÇáÏæÑ — ÊäãíÉ ÇáÎíÇá',
    activities: 'ÊãÑíä ÇáßÑÓí ÇáÓÇÎä: ßá ÊáãíĞ íÌáÓ Úáì ÇáßÑÓí ÈÕİÊå ÔÎÕíÊå æíÌíÈ Úä ÃÓÆáÉ ÇáÒãáÇÁ',
    techniques: ['acting', 'improvisation']
  },
  {
    date: '2026-11-23',
    topic: 'ÈÏÇíÉ ÇáÊÔÎíÕ æÇŞİÇğ',
    objectives: 'ÑÈØ ÇáäÕ ÈÇáÍÑßÉ — ÇáÊÔÎíÕ ÇáÃæáí — ÇáãÔÇåÏ ÇáÃæáì',
    activities: 'ÈÏÇíÉ ÇáÊÔÎíÕ æÇŞİÇğ: ÊãÑíä ÇáãÔÇåÏ ÇáÃæáì ãä ÇáãÓÑÍíÉ ãÚ ÍÑßÉ ÈÓíØÉ Úáì ÇáÎÔÈÉ',
    techniques: ['acting', 'stage-movement']
  },
  {
    date: '2026-11-30',
    topic: 'Blocking — ÇáÊãæÖÚ Úáì ÇáÎÔÈÉ (ÇáãÔÇåÏ 1-2)',
    objectives: 'ÖÈØ ÇáÊãæÖÚ ÇáãßÇäí — ÊÍÏíÏ ãæÇŞÚ ÇáæŞæİ — ÇáÏÎæá æÇáÎÑæÌ',
    activities: 'Blocking: ÖÈØ ÇáÊãæÖÚ áßá ãÔåÏ (ÇáãÔÇåÏ 1 æ 2) ãÚ ÊÍÏíÏ ãÓÇÑÇÊ ÇáÍÑßÉ Úáì ÇáÎÔÈÉ',
    techniques: ['stage-movement', 'space-use']
  },
  {
    date: '2026-12-07',
    topic: 'Blocking — ÇáãÔÇåÏ ÇáæÓØì æÇáÃÎíÑÉ',
    objectives: 'ÇÓÊßãÇá ÇáÊãæÖÚ — ÖÈØ ÇáÏÎæá æÇáÎÑæÌ — ÑÈØ ÇáãÔÇåÏ',
    activities: 'Blocking: ÇáãÔÇåÏ ÇáæÓØì æÇáÃÎíÑÉ ãä ÇáãÓÑÍíÉ + ÖÈØ ÍÑßÇÊ ÇáÏÎæá æÇáÎÑæÌ',
    techniques: ['stage-movement', 'space-use']
  },
  {
    date: '2026-12-14',
    topic: 'Run-through Ãæáí',
    objectives: 'ÊãÑíÑ ÇáãÓÑÍíÉ ßÇãáÉ — ÑÕÏ ÇáÃÎØÇÁ — ÊŞííã ÇáÅíŞÇÚ',
    activities: 'Run-through Ãæáí: ÊãÑíÑ ÇáãÓÑÍíÉ ãä ÇáÈÏÇíÉ Åáì ÇáäåÇíÉ ãÚ ÇáÊæŞİ áÊÓÌíá ÇáãáÇÍÙÇÊ',
    techniques: ['acting', 'rhythm']
  },
  // ÚØáÉ 21/12 - 04/01
  // ÚØáÉ 04/01
  // ÚØáÉ 11/01
  {
    date: '2027-01-18',
    topic: 'ÈÑæİÉ ÚÇãÉ ãßËİÉ (Dress Rehearsal)',
    objectives: 'ÇáÌÇåÒíÉ ÇáÊÇãÉ — ÇáÊãÑíä ÈÇáÃÒíÇÁ — ÂÎÑ İÑÕÉ ŞÈá ÇáÚÑÖ!',
    activities: 'ÈÑæİÉ ÚÇãÉ ãßËİÉ (Dress Rehearsal): ÊãÑíÑ ßÇãá ÈÇáÃÒíÇÁ æÇáÅßÓÓæÇÑÇÊ — åĞå ÇáİÑÕÉ ÇáÃÎíÑÉ ŞÈá íæã ÇáÚÑÖ!',
    techniques: ['acting', 'accessories']
  },
];

// ???????????????????????????????????????????????????????????????
// ÇáËáÇËÇÁ: 2APIC, 1APIC
// ???????????????????????????????????????????????????????????????
export const tuesdaySessions: ProgramEntry[] = [
  {
    date: '2026-10-06',
    topic: 'ÇáÊÚÇÑİ æÇßÊÔÇİ ÇáÑßÍ',
    objectives: 'ÊŞÏíã ÇáÈÑäÇãÌ — ßÓÑ ÇáÌáíÏ — ÈäÇÁ ÇáËŞÉ — ÇßÊÔÇİ ÇáÎÔÈÉ',
    activities: 'ÊŞÏíã ÇáÈÑäÇãÌ + áÚÈÉ ÇáãÑÂÉ + ÊãÇÑíä ÇáËŞÉ: ÇáÓŞæØ ÇáÎáİí + ÇßÊÔÇİ ÇáÎÔÈÉ',
    techniques: ['body-expression', 'space-use']
  },
  {
    date: '2026-10-13',
    topic: 'ÊãÇÑíä ÇáÕæÊ æÇáÊäİÓ',
    objectives: 'ÇáÊÍßã İí ÇáÊäİÓ — ØÈŞÇÊ ÇáÕæÊ — ÇáÅáŞÇÁ',
    activities: 'ÊãÇÑíä ÇáÕæÊ: ÇáÊäİÓ ÇáÈØäí + ØÈŞÇÊ ÇáÕæÊ ÇáËáÇË (ãäÎİÖ/ãÊæÓØ/ÚÇáò) + ÇáÅáŞÇÁ',
    techniques: ['breathing', 'voice-expression']
  },
  {
    date: '2026-10-20',
    topic: 'ÇáÇÑÊÌÇá ÇáãäØæŞ',
    objectives: 'ÇáÇÑÊÌÇá ÇáÍÑ — ÈäÇÁ ãÔÇåÏ — ÊäãíÉ ÇáÎíÇá æÇáÊÚÈíÑ',
    activities: 'ÇÑÊÌÇá ãäØæŞ: ÈäÇÁ ãÔÇåÏ ŞÕíÑÉ ãä æÖÚíÇÊ íæãíÉ (İí ÇáÓæŞ¡ İí ÇáãÏÑÓÉ¡ İí ÇáÈíÊ)',
    techniques: ['improvisation', 'dialogue']
  },
  // ÚØáÉ 27/10
  {
    date: '2026-11-03',
    topic: 'ÇáÇÑÊÌÇá ÇáÌãÇÚí + ŞÑÇÁÉ ÊÍáíáíÉ',
    objectives: 'ÇáÚãá ÇáÌãÇÚí — ÊÍáíá ÇáäÕæÕ — İåã ÏæÇİÚ ÇáÔÎÕíÇÊ',
    activities: 'ÇÑÊÌÇá ÌãÇÚí: ÈäÇÁ ãÔåÏ ãä ßáãÉ æÇÍÏÉ + ŞÑÇÁÉ ÊÍáíáíÉ ááäÕæÕ ÇáãÓÑÍíÉ æÊÍÏíÏ ÃåÏÇİ ßá ÔÎÕíÉ',
    techniques: ['improvisation', 'acting']
  },
  {
    date: '2026-11-10',
    topic: 'ÇáŞÑÇÁÉ ÇáÅíØÇáíÉ',
    objectives: 'ÇáŞÑÇÁÉ ÇáÅíØÇáíÉ — ÊÍáíá ÏæÇİÚ ÇáÔÎÕíÇÊ — ÇáÊáæíä ÇáÕæÊí',
    activities: 'ÇáŞÑÇÁÉ ÇáÅíØÇáíÉ (Lectures Italiennes) ãÚ ÇáÊÑßíÒ Úáì ÇáÊáæíä ÇáÕæÊí æÇáÅíŞÇÚ + ÊÍáíá ÏæÇİÚ ÇáÔÎÕíÇÊ',
    techniques: ['diction', 'voice-expression']
  },
  {
    date: '2026-11-17',
    topic: 'ÇáßÑÓí ÇáÓÇÎä + ÈÏÇíÉ ÇáÍİÙ',
    objectives: 'İåã ÇáÔÎÕíÉ — ÈÏÇíÉ ÇáÍİÙ ÈÏæä æÑŞÉ',
    activities: 'ÊãÑíä ÇáßÑÓí ÇáÓÇÎä (Hot Seating) + ÈÏÇíÉ ÇáÍİÙ ÇáÊÏÑíÌí ááÍæÇÑÇÊ ÈÏæä æÑŞÉ',
    techniques: ['acting', 'dialogue']
  },
  {
    date: '2026-11-24',
    topic: 'ÇáÊÔÎíÕ æÇŞİÇğ ãÚ ÇáÊãæÖÚ',
    objectives: 'ÑÈØ ÇáäÕ ÈÇáÍÑßÉ — ÇáÊãæÖÚ ÇáÃæáí Úáì ÇáÎÔÈÉ',
    activities: 'ÇáÊÔÎíÕ æÇŞİÇğ: ÊãÑíä ÇáãÔÇåÏ ãÚ ÇáÊãæÖÚ ÇáÃæáí Úáì ÇáÎÔÈÉ æÖÈØ ãÓÇÑÇÊ ÇáÍÑßÉ',
    techniques: ['acting', 'stage-movement']
  },
  {
    date: '2026-12-01',
    topic: 'Blocking ãßËİ',
    objectives: 'ÑÈØ ÇáãÔÇåÏ ÈÈÚÖåÇ — ÖÈØ ÇáÏÎæá æÇáÎÑæÌ — ÇáÅíŞÇÚ',
    activities: 'Blocking ãßËİ: ÖÈØ ÊãæÖÚ ÌãíÚ ÇáãÔÇåÏ + ÑÈØ ÇáãÔÇåÏ ÈÈÚÖåÇ ÈÓáÇÓÉ',
    techniques: ['stage-movement', 'space-use']
  },
  {
    date: '2026-12-08',
    topic: 'Run-through Ãæáí',
    objectives: 'ÊãÑíÑ ÇáãÓÑÍíÉ ßÇãáÉ — ÑÕÏ äŞÇØ ÇáÖÚİ — ÇáÊÕÍíÍ',
    activities: 'Run-through Ãæáí: ÊãÑíÑ ÇáãÓÑÍíÉ ßÇãáÉ ãä ÇáÈÏÇíÉ Åáì ÇáäåÇíÉ ãÚ ÊæŞİ ááÊÕÍíÍ',
    techniques: ['acting', 'rhythm']
  },
  {
    date: '2026-12-15',
    topic: 'Run-through ËÇäò + ÇßÓÓæÇÑÇÊ',
    objectives: 'ÊÍÓíä ÇáÃÏÇÁ — ÅÖÇİÉ ÇáÇßÓÓæÇÑÇÊ — ÖÈØ ÇáÊæŞíÊ',
    activities: 'Run-through ËÇäò ÈÏæä ÊæŞİ + ÅÖÇİÉ ÇáÇßÓÓæÇÑÇÊ ÇáÃæáíÉ æÇáÊÚÇãá ãÚåÇ ÃËäÇÁ ÇáÃÏÇÁ',
    techniques: ['acting', 'accessories']
  },
  // ÚØáÉ 22/12 - 29/12
  {
    date: '2027-01-05',
    topic: 'ÇáÚæÏÉ: ÇÎÊÈÇÑ ÇáÍİÙ + Run-through',
    objectives: 'ÇáÊÍŞŞ ãä ÇáÍİÙ ÈÚÏ ÇáÚØáÉ — Run-through ßÇãá',
    activities: 'ÇáÚæÏÉ ãä ÇáÚØáÉ: ÇÎÊÈÇÑ ÓÑíÚ áãÓÊæì ÇáÍİÙ + Run-through ßÇãá ÈÏæä ÊæŞİ áÊŞííã ÇáÌÇåÒíÉ',
    techniques: ['acting', 'dialogue']
  },
  {
    date: '2027-01-12',
    topic: 'ÇáÈÑæİÉ ÇáÊŞäíÉ (Technical Rehearsal)',
    objectives: 'ÏãÌ ÇáÚäÇÕÑ ÇáÊŞäíÉ — ÅÖÇÁÉ — ÕæÊ — ÃÒíÇÁ',
    activities: 'ÇáÈÑæİÉ ÇáÊŞäíÉ: ÊÌÑÈÉ ÇáÅÖÇÁÉ + ÇáÕæÊ + ÇáÃÒíÇÁ + ÇáÅßÓÓæÇÑÇÊ ãÚ ÇáãÓÑÍíÉ ÇáßÇãáÉ',
    techniques: ['lighting', 'sound-effects']
  },
  {
    date: '2027-01-19',
    topic: 'ÂÎÑ ÈÑæİÉ + ÇÓÊÑÎÇÁ',
    objectives: 'ÂÎÑ ãáÇÍÙÇÊ — ÇáÇÓÊÑÎÇÁ — ÇáÇÓÊÚÏÇÏ ÇáäİÓí ááÚÑÖ',
    activities: 'ÂÎÑ ãáÇÍÙÇÊ æÊÚÏíáÇÊ + ÈÑæİÉ ÇÓÊÑÎÇÁ åÇÏÆÉ + ÊãÇÑíä ÊäİÓ æÇÓÊÑÎÇÁ ÇÓÊÚÏÇÏÇğ áíæã ÇáÚÑÖ',
    techniques: ['breathing', 'acting']
  },
];

// ???????????????????????????????????????????????????????????????
// ÇáÎãíÓ: MS/GS, CE1, CM1
// ???????????????????????????????????????????????????????????????
export const thursdaySessions: ProgramEntry[] = [
  {
    date: '2026-10-01',
    topic: 'ÇáÊÚÇÑİ æÇßÊÔÇİ ÇáÑßÍ',
    objectives: 'ßÓÑ ÇáÌáíÏ — ÇßÊÔÇİ İÖÇÁ ÇáãÓÑÍ — ÈäÇÁ ÑæÍ ÇáİÑíŞ',
    activities: 'ÇáÊÚÇÑİ: áÚÈÉ ÇáÃÓãÇÁ ÈÇáÍÑßÉ + ÇßÊÔÇİ İÖÇÁ ÇáÑßÍ (ÇáãÔí ÇáÍÑ İí ÇáİÖÇÁ)',
    techniques: ['body-expression', 'space-use']
  },
  {
    date: '2026-10-08',
    topic: 'ÊãÇÑíä ÇáÊÑßíÒ æÇáÅíŞÇÚ',
    objectives: 'ÊŞæíÉ ÇáÊÑßíÒ — ÇáÇäÊÈÇå — ÖÈØ ÇáÅíŞÇÚ ÇáÌÓÏí',
    activities: 'ÊãÇÑíä ÇáÊÑßíÒ: "ÊæŞİ/ÇäØáŞ/ÕİŞ" ÈÅíŞÇÚÇÊ ãÊÛíÑÉ + ÇáãÔí ÈÅíŞÇÚÇÊ ãÎÊáİÉ (ÓÑíÚ/ÈØíÁ)',
    techniques: ['rhythm', 'breathing']
  },
  {
    date: '2026-10-15',
    topic: 'ÃáÚÇÈ ÕæÊíÉ + ÇáÊãæÖÚ',
    objectives: 'ÇáÊÍßã İí ÇáÕæÊ — ÇáÊãæÖÚ Úáì ÇáÎÔÈÉ',
    activities: 'ÃáÚÇÈ ÕæÊíÉ (åãÓ/ÕÑÇÎ ãÖÈæØ) + ÊãÇÑíä ÇáÊãæÖÚ (ÃãÇã/Îáİ/æÓØ ÇáÎÔÈÉ)',
    techniques: ['voice-expression', 'space-use']
  },
  {
    date: '2026-10-22',
    topic: 'ÇáÇÑÊÌÇá ÇáÕÇãÊ + ÊæÒíÚ ÇáäÕæÕ',
    objectives: 'ÇáÊÚÈíÑ ÈÇáÌÓÏ — ÊæÒíÚ äÕ ÇáãÓÑÍíÉ — ÊÚííä ÇáÃÏæÇÑ',
    activities: 'ÇáÇÑÊÌÇá ÇáÕÇãÊ: ÊÔÎíÕ ÍíæÇäÇÊ æÍÇáÇÊ ÔÚæÑíÉ + ÊæÒíÚ äÕ ÇáãÓÑÍíÉ æÊÚííä ÇáÃÏæÇÑ áßá ÊáãíĞ',
    techniques: ['improvisation', 'body-expression']
  },
  // ÚØáÉ 29/10
  {
    date: '2026-11-05',
    topic: 'ÇáÊãæÖÚ + ŞÑÇÁÉ ÌãÇÚíÉ Ãæáì',
    objectives: 'İåã ÇáİÖÇÁ ÇáÑßÍí — ÇáŞÑÇÁÉ ÇáÃæáì ááäÕ',
    activities: 'ÊãÇÑíä ÇáÊãæÖÚ Úáì ÇáÎÔÈÉ + ŞÑÇÁÉ ÌãÇÚíÉ Ãæáì ááäÕ ÇáãÓÑÍí (ÓÑÏ ÇáŞÕÉ ÈÃÓáæÈ ÍßæÇÊí áÜ MS/GS)',
    techniques: ['stage-movement', 'diction']
  },
  {
    date: '2026-11-12',
    topic: 'ÇáŞÑÇÁÉ ÇáÅíØÇáíÉ',
    objectives: 'ÊÕÍíÍ ãÎÇÑÌ ÇáÍÑæİ — ÇáÊáæíä ÇáÕæÊí — İåã ÇáÅíŞÇÚ',
    activities: 'ÇáŞÑÇÁÉ ÇáÅíØÇáíÉ (Lectures Italiennes) + ÊÕÍíÍ ãÎÇÑÌ ÇáÍÑæİ áßá ÊáãíĞ',
    techniques: ['diction', 'voice-expression']
  },
  {
    date: '2026-11-19',
    topic: 'ÇáßÑÓí ÇáÓÇÎä + ÇÎÊÈÇÑ ÇáÍİÙ',
    objectives: 'İåã ÏæÇİÚ ÇáÔÎÕíÉ — ÇÎÊÈÇÑ ÍİÙ ÇáãÔåÏ ÇáÃæá',
    activities: 'ÊãÑíä ÇáßÑÓí ÇáÓÇÎä (Hot Seating) + ÇÎÊÈÇÑ ÍİÙ ÍæÇÑÇÊ ÇáãÔåÏ ÇáÃæá',
    techniques: ['acting', 'dialogue']
  },
  {
    date: '2026-11-26',
    topic: 'ÈÏÇíÉ ÇáÊÔÎíÕ æÇŞİÇğ',
    objectives: 'ÑÈØ ÇáäÕ ÈÇáÍÑßÉ — ÖÈØ ÇáãæÇŞÚ — ÇáãÔÇåÏ ÇáÃæáì',
    activities: 'ÈÏÇíÉ ÇáÊÔÎíÕ æÇŞİÇğ: ÊãÑíä ÇáãÔÇåÏ ÇáÃæáì ãä ÇáãÓÑÍíÉ + ÖÈØ ãæÇŞÚ ÇáæŞæİ Úáì ÇáÎÔÈÉ',
    techniques: ['acting', 'stage-movement']
  },
  {
    date: '2026-12-03',
    topic: 'Blocking — ÇáÊãæÖÚ (ÇáãÔÇåÏ 1-2)',
    objectives: 'ÖÈØ ÇáÊãæÖÚ ÇáãßÇäí — ÇáÏÎæá æÇáÎÑæÌ',
    activities: 'Blocking: ÖÈØ ÇáÊãæÖÚ áßá ãÔåÏ (ÇáãÔÇåÏ 1 æ 2) ãÚ ÊÍÏíÏ ÍÑßÇÊ ÇáÏÎæá æÇáÎÑæÌ',
    techniques: ['stage-movement', 'space-use']
  },
  {
    date: '2026-12-10',
    topic: 'Blocking — ÇáãÔÇåÏ ÇáæÓØì æÇáÃÎíÑÉ',
    objectives: 'ÇÓÊßãÇá ÇáÊãæÖÚ áÌãíÚ ÇáãÔÇåÏ — ÑÈØ ÇáÈÏÇíÉ ÈÇáäåÇíÉ',
    activities: 'Blocking: ÇáãÔÇåÏ ÇáæÓØì æÇáÃÎíÑÉ ãä ÇáãÓÑÍíÉ + ÑÈØ ÌãíÚ ÇáãÔÇåÏ ÈÈÚÖåÇ',
    techniques: ['stage-movement', 'space-use']
  },
  {
    date: '2026-12-17',
    topic: 'Run-through Ãæáí',
    objectives: 'ÊãÑíÑ ÇáãÓÑÍíÉ ßÇãáÉ — ÑÕÏ ÇáÃÎØÇÁ — ÊÓÌíá ÇáãáÇÍÙÇÊ',
    activities: 'Run-through Ãæáí: ÊãÑíÑ ÇáãÓÑÍíÉ ãä ÇáÈÏÇíÉ Åáì ÇáäåÇíÉ + ãáÇÍÙÇÊ ÚÇãÉ Íæá ÇáÃÏÇÁ æÇáÅíŞÇÚ',
    techniques: ['acting', 'rhythm']
  },
  // ÚØáÉ 24/12, 31/12
  {
    date: '2027-01-07',
    topic: 'ÇáÚæÏÉ: ÇÎÊÈÇÑ ÇáÍİÙ + Run-through',
    objectives: 'ÇáÊÍŞŞ ãä ÇáÍİÙ — Run-through ßÇãá ÈÏæä ÊæŞİ',
    activities: 'ÇáÚæÏÉ ãä ÇáÚØáÉ: ÇÎÊÈÇÑ ÓÑíÚ ááÍİÙ + Run-through ßÇãá ÈÏæä ÊæŞİ áÊŞííã ÇáÌÇåÒíÉ',
    techniques: ['acting', 'dialogue']
  },
  {
    date: '2027-01-14',
    topic: 'ÇáÈÑæİÉ ÇáÚÇãÉ (Dress Rehearsal)',
    objectives: 'ÊãÑíÑ ßÇãá ÈÇáÃÒíÇÁ — ÇáÌÇåÒíÉ ÇáÊÇãÉ — ÊŞííã äåÇÆí',
    activities: 'ÇáÈÑæİÉ ÇáÚÇãÉ (Dress Rehearsal): ÊãÑíÑ ÇáãÓÑÍíÉ ßÇãáÉ ÈÇáÃÒíÇÁ æÇáÅßÓÓæÇÑÇÊ ßãÇ İí íæã ÇáÚÑÖ',
    techniques: ['acting', 'accessories']
  },
  {
    date: '2027-01-21',
    topic: 'ÂÎÑ ÈÑæİÉ + ÇÓÊÑÎÇÁ',
    objectives: 'ãÑÇÌÚÉ åÇÏÆÉ — ÊäİÓ æÇÓÊÑÎÇÁ — ÇáÇÓÊÚÏÇÏ ÇáäİÓí ááÚÑÖ',
    activities: 'ÂÎÑ ÈÑæİÉ: ãÑÇÌÚÉ åÇÏÆÉ ÈÏæä ÖÛØ + ÊãÇÑíä ÊäİÓ æÇÓÊÑÎÇÁ + ßáãÉ ÊÔÌíÚíÉ ŞÈá íæã ÇáÚÑÖ ÛÏÇğ',
    techniques: ['breathing', 'acting']
  },
];

/**
 * Maps dayOfWeek to the session list
 * 1 = Monday, 2 = Tuesday, 4 = Thursday
 */
export function getSessionsForDay(dayOfWeek: number): ProgramEntry[] {
  switch (dayOfWeek) {
    case 1: return mondaySessions;
    case 2: return tuesdaySessions;
    case 4: return thursdaySessions;
    default: return [];
  }
}
