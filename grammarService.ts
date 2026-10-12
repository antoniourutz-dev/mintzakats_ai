import { supabase } from './supabase';
import { GrammarLesson, GrammarExample } from '../types';
import { getWeekBlockInfo, BASQUE_DAY_NAMES } from '../utils/weekCycle';

export interface CycleDayGrammarSchedule {
  dayIndex: number; // 0..6
  dayNumber: number; // 1..7
  dayName: string; // 'Astelehena', etc.
  dateStr: string; // 'YYYY-MM-DD'
  isToday: boolean;
  lesson: GrammarLesson | null;
}

/**
 * Returns today's date in Europe/Madrid timezone as 'YYYY-MM-DD'.
 */
export function getTodayMadridDateString(): string {
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Europe/Madrid',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).formatToParts(new Date());

    const year = parts.find(p => p.type === 'year')?.value;
    const month = parts.find(p => p.type === 'month')?.value;
    const day = parts.find(p => p.type === 'day')?.value;

    if (year && month && day) {
      return `${year}-${month}-${day}`;
    }
    // Fallback if parts missing
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  } catch {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }
}

const MEMORY_LESSON_CACHE = new Map<string, GrammarLesson>();
const CYCLE_SCHEDULE_CACHE = new Map<string, CycleDayGrammarSchedule[]>();
const STORAGE_CACHE_PREFIX = 'mintzakats_grammar_pill_v1_';

/**
 * Synchronously retrieves cached daily grammar lesson (memory or localStorage)
 * for instant 0ms rendering with zero layout shift.
 */
export function getCachedDailyGrammarLesson(targetDate?: string): GrammarLesson | null {
  const dateStr = targetDate || getTodayMadridDateString();

  if (MEMORY_LESSON_CACHE.has(dateStr)) {
    return MEMORY_LESSON_CACHE.get(dateStr) || null;
  }

  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(STORAGE_CACHE_PREFIX + dateStr);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.id && parsed.title) {
          MEMORY_LESSON_CACHE.set(dateStr, parsed);
          return parsed;
        }
      }
    } catch {
      // Ignore parse error
    }
  }

  return null;
}

function saveLessonToCache(dateStr: string, lesson: GrammarLesson) {
  MEMORY_LESSON_CACHE.set(dateStr, lesson);
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_CACHE_PREFIX + dateStr, JSON.stringify(lesson));
    } catch {
      // Storage quota or disabled
    }
  }
}

/**
 * Normalizes grammar lesson raw examples into a typed array of GrammarExample
 */
function normalizeGrammarExamples(rawExamples: any): GrammarExample[] {
  if (!rawExamples) return [];
  if (Array.isArray(rawExamples)) {
    return rawExamples.map(item => {
      if (typeof item === 'string') {
        return { text: item };
      }
      return {
        text: String(item.text || ''),
        type: item.type ? String(item.type) : undefined,
      };
    }).filter(ex => Boolean(ex.text.trim()));
  }
  if (typeof rawExamples === 'string') {
    try {
      const parsed = JSON.parse(rawExamples);
      return normalizeGrammarExamples(parsed);
    } catch {
      return [];
    }
  }
  return [];
}

/**
 * Fetches the daily grammar pill for today (Europe/Madrid) from Supabase.
 * - Must be active in grammar_daily_schedule (is_active = true)
 * - Must be published in grammar_lessons (status = 'published')
 * - Safe: returns null on missing row or network error, never breaks calling views.
 */
export async function getTodayDailyGrammarLesson(targetDate?: string): Promise<GrammarLesson | null> {
  const today = targetDate || getTodayMadridDateString();

  // 1. Immediate cache return for 0ms render
  const cached = getCachedDailyGrammarLesson(today);
  if (cached) {
    return cached;
  }

  try {
    const { data, error } = await supabase
      .from('grammar_daily_schedule')
      .select(`
        scheduled_date,
        grammar_lessons (
          id,
          concept_key,
          title,
          subtitle,
          category,
          level,
          summary,
          explanation,
          pattern,
          key_point,
          examples,
          status
        )
      `)
      .eq('scheduled_date', today)
      .eq('is_active', true)
      .maybeSingle();

    if (!error && data && data.grammar_lessons) {
      // Supabase can return relation as single object or array
      const rawLesson = Array.isArray(data.grammar_lessons)
        ? data.grammar_lessons[0]
        : data.grammar_lessons;

      if (rawLesson && rawLesson.status === 'published') {
        const resolved: GrammarLesson = {
          id: rawLesson.id,
          concept_key: rawLesson.concept_key,
          title: rawLesson.title,
          subtitle: rawLesson.subtitle,
          category: rawLesson.category || null,
          level: rawLesson.level || null,
          summary: rawLesson.summary || '',
          explanation: rawLesson.explanation || '',
          pattern: rawLesson.pattern || null,
          key_point: rawLesson.key_point || null,
          examples: normalizeGrammarExamples(rawLesson.examples),
          status: rawLesson.status,
        };
        saveLessonToCache(today, resolved);
        return resolved;
      }
    }

    // 2. Fallback: if no active schedule row exists for today,
    // load published lessons from `grammar_lessons` so students always have access to the daily pill
    const { data: publishedLessons, error: pubErr } = await supabase
      .from('grammar_lessons')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: true });

    if (!pubErr && publishedLessons && publishedLessons.length > 0) {
      // Deterministically rotate lesson based on day of year/date
      const dayHash = today.split('-').reduce((acc, part) => acc + (parseInt(part, 10) || 0), 0);
      const chosen = publishedLessons[dayHash % publishedLessons.length];

      const resolved: GrammarLesson = {
        id: chosen.id,
        concept_key: chosen.concept_key,
        title: chosen.title,
        subtitle: chosen.subtitle,
        category: chosen.category || null,
        level: chosen.level || null,
        summary: chosen.summary || '',
        explanation: chosen.explanation || '',
        pattern: chosen.pattern || null,
        key_point: chosen.key_point || null,
        examples: normalizeGrammarExamples(chosen.examples),
        status: chosen.status,
      };
      saveLessonToCache(today, resolved);
      return resolved;
    }

    return null;
  } catch (err) {
    console.warn('Eguneko Gramatika eskuratzean ezohiko errorea:', err);
    return null;
  }
}

/**
 * Helper to fetch published grammar lessons (for teacher admin preview)
 */
export async function getAllPublishedGrammarLessons(): Promise<GrammarLesson[]> {
  try {
    const { data, error } = await supabase
      .from('grammar_lessons')
      .select('*')
      .eq('status', 'published')
      .order('title', { ascending: true });

    if (error || !data) {
      return [];
    }

    return data.map((item: any) => ({
      ...item,
      examples: normalizeGrammarExamples(item.examples),
    }));
  } catch {
    return [];
  }
}

/**
  * Resolves the scheduled grammar lesson for all 7 days of the active cycle.
  * Checks explicit schedule row first, then falls back to deterministic rotation.
  */
export async function getCycleGrammarSchedule(
  customStartDateStr?: string | null
): Promise<CycleDayGrammarSchedule[]> {
  try {
    const blockInfo = getWeekBlockInfo(new Date(), customStartDateStr);
    const cacheKey = blockInfo.weekMondayDateStr;
    if (CYCLE_SCHEDULE_CACHE.has(cacheKey)) {
      return CYCLE_SCHEDULE_CACHE.get(cacheKey)!;
    }

    const [mYear, mMonth, mDay] = blockInfo.weekMondayDateStr.split('-').map(Number);
    const mondayDate = new Date(mYear, mMonth - 1, mDay, 0, 0, 0, 0);

    const dates = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(mondayDate);
      d.setDate(mondayDate.getDate() + i);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const dayNum = String(d.getDate()).padStart(2, '0');
      return `${y}-${m}-${dayNum}`;
    });

    const [schedRes, pubRes] = await Promise.all([
      supabase
        .from('grammar_daily_schedule')
        .select(`
          scheduled_date,
          grammar_lessons (
            id,
            concept_key,
            title,
            subtitle,
            category,
            level,
            summary,
            explanation,
            pattern,
            key_point,
            examples,
            status
          )
        `)
        .in('scheduled_date', dates)
        .eq('is_active', true),
      supabase
        .from('grammar_lessons')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: true })
    ]);

    const schedMap = new Map<string, any>();
    if (!schedRes.error && schedRes.data) {
      schedRes.data.forEach((row: any) => {
        const raw = Array.isArray(row.grammar_lessons) ? row.grammar_lessons[0] : row.grammar_lessons;
        if (raw && raw.status === 'published') {
          schedMap.set(row.scheduled_date, raw);
        }
      });
    }

    const pubLessons = pubRes.data || [];

    const result: CycleDayGrammarSchedule[] = dates.map((dateStr, i) => {
      const isToday = i + 1 === blockInfo.dayNumberInBlock;
      let rawLesson = schedMap.get(dateStr);

      if (!rawLesson && pubLessons.length > 0) {
        const dayHash = dateStr.split('-').reduce((acc, part) => acc + (parseInt(part, 10) || 0), 0);
        rawLesson = pubLessons[dayHash % pubLessons.length];
      }

      let lesson: GrammarLesson | null = null;
      if (rawLesson) {
        lesson = {
          id: rawLesson.id,
          concept_key: rawLesson.concept_key,
          title: rawLesson.title,
          subtitle: rawLesson.subtitle,
          category: rawLesson.category || null,
          level: rawLesson.level || null,
          summary: rawLesson.summary || '',
          explanation: rawLesson.explanation || '',
          pattern: rawLesson.pattern || null,
          key_point: rawLesson.key_point || null,
          examples: normalizeGrammarExamples(rawLesson.examples),
          status: rawLesson.status,
        };
        saveLessonToCache(dateStr, lesson);
      }

      return {
        dayIndex: i,
        dayNumber: i + 1,
        dayName: BASQUE_DAY_NAMES[i],
        dateStr,
        isToday,
        lesson,
      };
    });

    CYCLE_SCHEDULE_CACHE.set(cacheKey, result);
    return result;
  } catch (err) {
    console.error('Failed to load cycle grammar schedule:', err);
    return [];
  }
}
