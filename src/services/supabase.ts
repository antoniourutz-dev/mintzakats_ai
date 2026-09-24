/**
 * Supabase Data & Synchronization Service for Mintzakats
 * 
 * Connected to table: `euskera_questions`
 * Schema:
 *   - id: number (0..140)
 *   - question: string (galdera / testua)
 *   - candidates: string[] (4 aukerak)
 *   - answer: number (0..3 aukera zuzenaren indizea)
 */

import { Question } from '../types';
import { getDailyMixedQuestions, registerDynamicQuestions } from '../data';

const DEFAULT_SUPABASE_URL = 'https://awdajwrzxceqazmaorxc.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_USopGmel8SEMUckG1DoXTA_2-O0fQQk';

export const SUPABASE_URL = (
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) ||
  DEFAULT_SUPABASE_URL
).trim();

export const SUPABASE_ANON_KEY = (
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) ||
  DEFAULT_SUPABASE_ANON_KEY
).trim();

const CACHE_KEY = 'mintzakats_supabase_questions_v1';

export function isSupabaseConfigured(): boolean {
  return Boolean(
    SUPABASE_URL && 
    SUPABASE_ANON_KEY && 
    SUPABASE_URL.startsWith('http')
  );
}

export interface RawEuskeraQuestion {
  id: number;
  question: string;
  candidates: string[];
  answer: number;
  created_at?: string;
  updated_at?: string;
  category?: string;
  explanation?: {
    rule?: string;
    whyCorrect?: string;
    tip?: string;
    whyWrongOptions?: { letter: 'A' | 'B' | 'C' | 'D'; reason: string }[];
  };
}

/**
 * Generate a clear pedagogical explanation for a question if none is provided in the DB row.
 */
function buildPedagogicalExplanation(
  prompt: string,
  options: string[],
  correctIndex: number
) {
  const correctOption = options[correctIndex] || '';
  const letters = ['A', 'B', 'C', 'D'] as const;

  const rule = `Egitura honetan «${correctOption}» da adierazpide arautua eta zuzena.`;
  const whyCorrect = `«${correctOption}» formak betetzen ditu testuinguru horretako deklinabide, lokuzio edo aditz-arauak.`;
  const tip = `Erreparatu esaldiko hitz nagusiei, juntagailuei eta osagaien arteko komunztadurari.`;

  const whyWrongOptions = options
    .map((opt, idx) => ({
      letter: letters[idx % 4],
      reason: idx === correctIndex
        ? `«${opt}» da erantzun egokia.`
        : `«${opt}» ez dator bat esaldiaren zentzuarekin edo egitura gramatikalarekin.`
    }))
    .filter((_, idx) => idx !== correctIndex);

  return { rule, whyCorrect, tip, whyWrongOptions };
}

/**
 * Maps raw Supabase DB row into standard Question format
 */
function mapRawToQuestion(r: RawEuskeraQuestion, orderIdx: number): Question {
  const options = Array.isArray(r.candidates) ? r.candidates.slice(0, 4) : [];
  while (options.length < 4) {
    options.push('Beste bat');
  }

  const rawAns = typeof r.answer === 'number' ? r.answer : parseInt(String(r.answer), 10);
  const correctIndex = Number.isFinite(rawAns) ? Math.min(Math.max(0, rawAns), 3) : 0;
  
  const explanation = r.explanation && r.explanation.rule
    ? r.explanation
    : buildPedagogicalExplanation(r.question, options, correctIndex);

  return {
    id: `sb_${r.id}`,
    supabaseId: r.id,
    source: 'supabase',
    order: orderIdx + 1,
    prompt: r.question,
    options: options as [string, string, string, string],
    correctIndex: correctIndex,
    category: r.category || 'Euskara Batua',
    level: 'B2',
    explanation: {
      rule: explanation.rule || 'Arau gramatikala',
      whyCorrect: explanation.whyCorrect || `«${options[correctIndex]}» da forma egokia.`,
      tip: explanation.tip || 'Kontuan izan hitzaren testuingurua eta baliokideak.',
      whyWrongOptions: explanation.whyWrongOptions
    }
  };
}

/**
 * Get synchronously cached questions from localStorage (if any)
 */
export function getCachedSupabaseQuestions(): Question[] | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch {
    // Ignore cache parse errors
  }
  return null;
}

/**
 * Fetch all raw questions from Supabase table `euskera_questions`
 */
export async function fetchAllSupabaseQuestions(): Promise<Question[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  try {
    const url = `${SUPABASE_URL}/rest/v1/euskera_questions?select=*&order=id.asc&limit=500`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    });

    if (!response.ok) {
      console.warn(`Supabase returned HTTP status ${response.status}`);
      return [];
    }

    const rows: RawEuskeraQuestion[] = await response.json();
    if (!Array.isArray(rows) || rows.length === 0) {
      return [];
    }

    const validRows = rows.filter(
      r => r && r.question && Array.isArray(r.candidates) && r.candidates.length >= 2
    );

    const mapped = validRows.map((r, idx) => mapRawToQuestion(r, idx));

    // Cache locally for instantaneous access
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(mapped));
    } catch {
      // quota or local storage restriction
    }

    // Register into memory pool for mistake notebook
    registerDynamicQuestions(mapped);

    return mapped;
  } catch (err) {
    console.error('Failed to fetch from Supabase:', err);
    return [];
  }
}

/**
 * Fetch questions for the daily challenge or practice mode
 * mode = 'daily20': picks 20 questions deterministically for the day
 * mode = 'all': returns all questions from Supabase
 */
export async function getDailyQuestions(
  seedDate: string,
  mode: 'daily20' | 'all' = 'daily20'
): Promise<Question[]> {
  // 1. Try to fetch fresh questions from Supabase
  let allSupabase = await fetchAllSupabaseQuestions();

  // 2. Fall back to cached questions if offline / network error
  if (!allSupabase || allSupabase.length === 0) {
    const cached = getCachedSupabaseQuestions();
    if (cached && cached.length > 0) {
      allSupabase = cached;
    }
  }

  // 3. Fall back to bundled local questions if Supabase is unavailable
  if (!allSupabase || allSupabase.length < 5) {
    return getDailyMixedQuestions(seedDate);
  }

  if (mode === 'all') {
    return allSupabase;
  }

  // Deterministic daily selection (20 questions based on date seed)
  const seedStr = seedDate || new Date().toISOString().slice(0, 10);
  let hash = 0;
  for (let i = 0; i < seedStr.length; i++) {
    hash = (hash << 5) - hash + seedStr.charCodeAt(i);
    hash |= 0;
  }

  const pickedIndices = new Set<number>();
  const selected: Question[] = [];
  const totalCount = allSupabase.length;
  let step = 0;

  while (selected.length < 20 && selected.length < totalCount && step < totalCount * 4) {
    const idx = Math.abs(hash + step * 7) % totalCount;
    if (!pickedIndices.has(idx)) {
      pickedIndices.add(idx);
      selected.push({
        ...allSupabase[idx],
        order: selected.length + 1
      });
    }
    step++;
  }

  return selected;
}

/**
 * Check connection status with Supabase in real-time
 */
export async function checkSupabaseStatus(): Promise<{
  connected: boolean;
  totalCount: number;
  sampleQuestion?: string;
  error?: string;
}> {
  if (!isSupabaseConfigured()) {
    return { connected: false, totalCount: 0, error: 'Ez dago Supabase konfiguratuta' };
  }

  try {
    const url = `${SUPABASE_URL}/rest/v1/euskera_questions?select=id,question&limit=1`;
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    });

    if (!res.ok) {
      return { connected: false, totalCount: 0, error: `HTTP ${res.status}` };
    }

    const data = await res.json();
    const countUrl = `${SUPABASE_URL}/rest/v1/euskera_questions?select=count`;
    const countRes = await fetch(countUrl, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Range-Unit': 'items',
        'Range': '0-0',
        'Prefer': 'count=exact'
      }
    });
    
    // Content-Range: 0-0/141
    const contentRange = countRes.headers.get('content-range');
    const totalCount = contentRange ? parseInt(contentRange.split('/')[1] || '141', 10) : 141;

    return {
      connected: true,
      totalCount: Number.isNaN(totalCount) ? 141 : totalCount,
      sampleQuestion: Array.isArray(data) && data[0] ? data[0].question : undefined
    };
  } catch (err: any) {
    return {
      connected: false,
      totalCount: 0,
      error: err?.message || 'Konexio errorea'
    };
  }
}

/**
 * Optional: Sync user score to Supabase Leaderboard (if table exists)
 */
export async function submitDailyScoreToCloud(entry: {
  playerId: string;
  playerName: string;
  town?: string;
  score: number;
  streak: number;
  xp: number;
}): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  try {
    const url = `${SUPABASE_URL}/rest/v1/leaderboard`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify({
        player_id: entry.playerId,
        player_name: entry.playerName,
        town: entry.town || 'Euskal Herria',
        score: entry.score,
        streak: entry.streak,
        xp: entry.xp,
        updated_at: new Date().toISOString()
      })
    });
    return res.ok;
  } catch {
    return false;
  }
}
