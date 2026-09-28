import { supabase } from './supabase';
import { GrammarLesson, GrammarExample } from '../types';

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
        return {
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

      return {
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
