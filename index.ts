import { DayOfWeek, Question, Badge } from '../types';
import { astelehenaQuestions } from './astelehena';
import { astearteaQuestions } from './asteartea';
import { asteazkenaQuestions } from './asteazkena';
import { ostegunaQuestions } from './osteguna';
import { ostiralaQuestions } from './ostirala';
import { larunbataQuestions } from './larunbata';
import { igandeaQuestions } from './igandea';

export interface DayInfo {
  id: DayOfWeek;
  name: string;        // Euskara izena: Astelehena
  shortName: string;   // Astl, Astr, Astz, Ostg, Ostr, Lar, Igan
  topic: string;       // Gaia
  description: string;
  themeColor: string;
}

export const DAYS_CONFIG: DayInfo[] = [
  {
    id: 'astelehena',
    name: 'Astelehena',
    shortName: 'Astl',
    topic: 'Denbora eta Orduak',
    description: 'Orduak, datak, maiztasuna eta denbora adierazpideak',
    themeColor: 'bg-blue-600'
  },
  {
    id: 'asteartea',
    name: 'Asteartea',
    shortName: 'Astr',
    topic: 'Deklinabidea eta Kasuak',
    description: 'Nork, Nori, Norekin, Norentzat, Zerez eta Partitiboa',
    themeColor: 'bg-emerald-600'
  },
  {
    id: 'asteazkena',
    name: 'Asteazkena',
    shortName: 'Astz',
    topic: 'Aditzak eta Moduak',
    description: 'Nor-Nork, Nor-Nori-Nork, Ahalera, Baldintza eta Agintera',
    themeColor: 'bg-indigo-600'
  },
  {
    id: 'osteguna',
    name: 'Osteguna',
    shortName: 'Ostg',
    topic: 'Akats Ohikoenak eta Kalkoak',
    description: 'Gaztelaniazko kalkoak, esapide okerrak eta azterketetako tranpak',
    themeColor: 'bg-amber-600'
  },
  {
    id: 'ostirala',
    name: 'Ostirala',
    shortName: 'Ostr',
    topic: 'Esapideak eta Lokuzioak',
    description: 'Euskal esaera zaharrak, lokuzio kolokialak eta adierazkorrak',
    themeColor: 'bg-purple-600'
  },
  {
    id: 'larunbata',
    name: 'Larunbata',
    shortName: 'Lar',
    topic: 'Hiztegia eta Sinonimoak',
    description: 'B2 eta C1 mailetako hitz jatorrak, ñabardurak eta baliokideak',
    themeColor: 'bg-teal-600'
  },
  {
    id: 'igandea',
    name: 'Igandea',
    shortName: 'Igan',
    topic: 'Asteko Erronka Nagusia',
    description: 'Asteko errepaso orokorra eta gaitasun guztien sintesia',
    themeColor: 'bg-rose-600'
  }
];

export const ALL_QUESTIONS_BY_DAY: Record<DayOfWeek, Question[]> = {
  astelehena: astelehenaQuestions,
  asteartea: astearteaQuestions,
  asteazkena: asteazkenaQuestions,
  osteguna: ostegunaQuestions,
  ostirala: ostiralaQuestions,
  larunbata: larunbataQuestions,
  igandea: igandeaQuestions
};

export const ALL_QUESTIONS: Question[] = [
  ...astelehenaQuestions,
  ...astearteaQuestions,
  ...asteazkenaQuestions,
  ...ostegunaQuestions,
  ...ostiralaQuestions,
  ...larunbataQuestions,
  ...igandeaQuestions
];

export const QUESTION_MAP: Record<string, Question> = ALL_QUESTIONS.reduce((acc, q) => {
  acc[q.id] = q;
  return acc;
}, {} as Record<string, Question>);

export function registerDynamicQuestions(questions: Question[]): void {
  questions.forEach(q => {
    if (q && q.id) {
      QUESTION_MAP[q.id] = q;
    }
  });
}

/**
 * Returns 20 mixed questions selected across all categories and difficulty levels.
 * Guarantees 100% unique questions with no repeats on the same day.
 */
export function getDailyMixedQuestions(seedDate?: string): Question[] {
  // Deterministic shuffle seed based on date string if provided
  const seedStr = seedDate || new Date().toISOString().slice(0, 10);
  let hash = 0;
  for (let i = 0; i < seedStr.length; i++) {
    hash = (hash << 5) - hash + seedStr.charCodeAt(i);
    hash |= 0;
  }

  const mixedPool: Question[] = [];
  const usedIds = new Set<string>();

  const sets = [
    astearteaQuestions, // Deklinabidea
    asteazkenaQuestions, // Aditzak
    ostegunaQuestions,   // Akats ohikoenak
    ostiralaQuestions,   // Lokuzioak
    astelehenaQuestions, // Denbora
    larunbataQuestions,  // Hiztegia
    igandeaQuestions     // Bateratua
  ];

  let attempt = 0;
  while (mixedPool.length < 20 && attempt < 120) {
    const chosenSet = sets[attempt % sets.length];
    const qIndex = (Math.abs(hash) + attempt * 7) % chosenSet.length;
    const q = chosenSet[qIndex];
    if (q && !usedIds.has(q.id)) {
      usedIds.add(q.id);
      mixedPool.push(q);
    }
    attempt++;
  }

  // Fallback to fill any remaining slots from ALL_QUESTIONS
  if (mixedPool.length < 20) {
    for (const q of ALL_QUESTIONS) {
      if (!usedIds.has(q.id)) {
        usedIds.add(q.id);
        mixedPool.push(q);
        if (mixedPool.length >= 20) break;
      }
    }
  }

  // Map into 1..20 order
  return mixedPool.slice(0, 20).map((q, idx) => ({
    ...q,
    order: idx + 1
  }));
}


export const APP_BADGES: Badge[] = [
  {
    id: 'first_step',
    title: 'Lehen Urratsa',
    description: 'Lehenengo 20 galderako erronka osatuta.',
    icon: '🎯',
    unlocked: false
  },
  {
    id: 'mistake_hunter',
    title: 'Akats-ehiztaria',
    description: 'Akatsen koadernoan huts egindako 3 galdera gainditu.',
    icon: '🏹',
    unlocked: false
  },
  {
    id: 'perfect_day',
    title: 'Bikaintasuna',
    description: 'Egun bateko 20 galderetan %90etik gora asmatu.',
    icon: '⭐',
    unlocked: false
  },
  {
    id: 'three_streak',
    title: 'Ikasle Saitsua',
    description: '3 eguneko segida (streak) jarraian osatu.',
    icon: '🔥',
    unlocked: false
  },
  {
    id: 'week_master',
    title: 'Asteko Txapelduna',
    description: 'Asteko 7 egunetako erronkak osatuta (140 galdera!).',
    icon: '🏆',
    unlocked: false
  }
];
