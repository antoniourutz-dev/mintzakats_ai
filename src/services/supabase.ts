/**
 * Supabase Data, Authentication & Cloud Persistence Service for Mintzakats
 * Eguneroko Euskara Erronka
 */

import { createClient, SupabaseClient, User, Session } from '@supabase/supabase-js';
import { Question } from '../types';
import { getDailyMixedQuestions, registerDynamicQuestions } from '../data';
import {
  getQuestionsForDayInBlock,
  getWeekBlockInfo,
  getConfiguredStartDate,
  setConfiguredStartDate,
  get7DayScheduleForBlock,
} from '../utils/weekCycle';

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

export const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const QUESTIONS_CACHE_KEY = 'mintzakats_supabase_questions_all_v2';
const LEADERBOARD_STORAGE_KEY = 'mintzakats_game_records_v1';
const ATTEMPTS_STORAGE_KEY = 'mintzakats_daily_started_attempts_v1';
const LAST_GAME_MISTAKES_KEY = 'mintzakats_last_game_mistakes_v1';

export interface RawEuskeraQuestion {
  id: number;
  question: string;
  candidates: string[];
  answer: number;
  category?: string;
}

export interface PlayerScoreRecord {
  id: string;
  playerId: string;
  playerName: string;
  dateStr: string;        // "YYYY-MM-DD"
  weekMondayStr: string;  // "YYYY-MM-DD"
  score: number;          // Total points (e.g. 1984 pt)
  correctAnswers: number; // Number of correct answers (0..20)
  totalQuestions: number; // Total questions (e.g. 20)
  timeSeconds: number;    // elapsed seconds
  speedBonus: number;     // extra points awarded for speed under 120s
  completedAt: number;    // timestamp
  status?: string;        // 'started' | 'completed'
}

export interface WeeklyPlayerSummary {
  playerId: string;
  playerName: string;
  totalScore: number;
  totalTimeSeconds: number;
  daysPlayed: number;
  bestDailyScore: number;
  latestDate: string;
}

export interface PlayerCloudState {
  playerId: string;
  playerName: string;
  streak: number;
  lastPlayedDate: string | null;
  lastGameMistakes: any[];
  playedDates: string[];
}

// ==========================================
// SCORING & STREAK FORMULAS
// ==========================================

/**
 * Calculates official Mintzakats score:
 * - 10 puntos por cada acierto (hasta 200 puntos base con 20 preguntas).
 * - 25 puntos adicionales por cada segundo ahorrado por debajo del tiempo de referencia (120s),
 *   escalado proporcionalmente a la precisión para recompensar la velocidad real.
 */
export function calculateGameScore(
  correctAnswers: number,
  timeSeconds: number,
  totalQuestions: number = 20
): {
  basePoints: number;
  speedBonus: number;
  totalPoints: number;
  secondsSaved: number;
} {
  const safeCorrect = Math.max(0, Math.min(totalQuestions, correctAnswers));
  // 10 puntos por cada acierto
  const basePoints = safeCorrect * 10;

  // Tiempo de referencia estándar: 120 segundos (2 minutos)
  const maxBonusTime = 120;
  const safeTime = Math.max(0, Math.min(maxBonusTime, timeSeconds));

  // Segundos ahorrados respecto a 120s
  const secondsSaved = Math.max(0, Math.floor(maxBonusTime - safeTime));

  // Factor de precisión: (aciertos / total)
  const accuracyRatio = totalQuestions > 0 ? safeCorrect / totalQuestions : 0;

  // 25 puntos adicionales por cada segundo ahorrado
  const speedBonus = Math.round(secondsSaved * 25 * accuracyRatio);

  const totalPoints = basePoints + speedBonus;

  return {
    basePoints,
    speedBonus,
    totalPoints,
    secondsSaved,
  };
}

/**
 * Normalizes legacy records into the unified points system.
 */
export function normalizeScoreRecord(raw: any): PlayerScoreRecord {
  const totalQuestions = raw.total_questions || raw.totalQuestions || 20;
  const rawScore = Number(raw.score) || 0;
  const timeSeconds = Number(raw.time_seconds || raw.timeSeconds) || 0;

  let correctAnswers: number;
  let totalPoints: number;
  let speedBonus: number;

  if (typeof raw.correctAnswers === 'number') {
    correctAnswers = raw.correctAnswers;
    totalPoints = rawScore;
    speedBonus = Number(raw.speedBonus) || 0;
  } else if (rawScore <= totalQuestions) {
    // Legacy record where score was just number of correct answers (0..20)
    correctAnswers = rawScore;
    const calc = calculateGameScore(correctAnswers, timeSeconds, totalQuestions);
    totalPoints = calc.totalPoints;
    speedBonus = calc.speedBonus;
  } else {
    // Points format
    totalPoints = rawScore;
    correctAnswers = Math.min(totalQuestions, Math.max(0, Math.round(rawScore / 100)));
    speedBonus = Math.max(0, totalPoints - correctAnswers * 10);
  }

  return {
    id: raw.id || `${raw.player_id || raw.playerId}_${raw.date_str || raw.dateStr}`,
    playerId: raw.player_id || raw.playerId,
    playerName: raw.player_name || raw.playerName,
    dateStr: raw.date_str || raw.dateStr,
    weekMondayStr: raw.week_monday_str || raw.weekMondayStr,
    score: totalPoints,
    correctAnswers,
    totalQuestions,
    timeSeconds,
    speedBonus,
    completedAt: Number(raw.completed_at || raw.completedAt) || Date.now(),
    status: raw.status || 'completed',
  };
}

/**
 * Calculates a player's consecutive daily streak strictly from their actual played dates.
 * A player who has only played 1 day will ALWAYS have a streak of 1 (or 0 if they missed yesterday and today).
 * It is impossible to have a streak greater than the number of unique days played.
 */
export function calculateStreakFromDates(playedDates: string[], todayStr: string): number {
  if (!playedDates || playedDates.length === 0) return 0;

  const uniqueDates = Array.from(
    new Set(playedDates.map(d => d.trim()).filter(Boolean))
  ).sort().reverse();

  if (uniqueDates.length === 0) return 0;

  // Has the user played today?
  const playedToday = uniqueDates.includes(todayStr);

  // Compute yesterday's date string
  const todayDateObj = new Date(todayStr + 'T12:00:00Z');
  const yesterdayObj = new Date(todayDateObj);
  yesterdayObj.setUTCDate(yesterdayObj.getUTCDate() - 1);
  const yesterdayStr = yesterdayObj.toISOString().split('T')[0];

  const playedYesterday = uniqueDates.includes(yesterdayStr);

  // If user hasn't played today AND hasn't played yesterday, the streak is broken
  if (!playedToday && !playedYesterday) {
    return 0;
  }

  // Count consecutive days going backwards
  let currentTarget = playedToday ? todayDateObj : yesterdayObj;
  let streak = 0;

  while (true) {
    const targetStr = currentTarget.toISOString().split('T')[0];
    if (uniqueDates.includes(targetStr)) {
      streak++;
      // step back 1 day
      currentTarget.setUTCDate(currentTarget.getUTCDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

// ==========================================
// 1. SUPABASE AUTHENTICATION
// ==========================================

export function normalizeStudentEmail(input: string): string {
  if (!input) return '';
  const trimmed = input.trim().toLowerCase();
  if (trimmed.includes('@')) {
    return trimmed;
  }
  return `${trimmed}@mintzakats.app`;
}

export function extractStudentDisplayName(email: string): string {
  if (!email) return 'Ikaslea';
  return email.split('@')[0];
}

export async function loginStudent(usernameOrEmail: string, password: string): Promise<{
  user: User | null;
  session: Session | null;
  error: string | null;
}> {
  const email = normalizeStudentEmail(usernameOrEmail);

  if (!email || !password) {
    return {
      user: null,
      session: null,
      error: 'Mesedez, idatzi zure erabiltzailea eta pasahitza.',
    };
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.message?.toLowerCase().includes('invalid') || error.message?.toLowerCase().includes('credential')) {
        return {
          user: null,
          session: null,
          error: 'Erabiltzailea edo pasahitza ez dira zuzenak (ikasle001@mintzakats.app).',
        };
      }
      return {
        user: null,
        session: null,
        error: error.message || 'Akatsa gertatu da saioa hastean.',
      };
    }

    return {
      user: data.user,
      session: data.session,
      error: null,
    };
  } catch (err: any) {
    return {
      user: null,
      session: null,
      error: err?.message || 'Konexio akatsa gertatu da.',
    };
  }
}

export async function logoutStudent(): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase.auth.signOut();
    return { error: error ? error.message : null };
  } catch (err: any) {
    return { error: err?.message || 'Akatsa saioa ixtean' };
  }
}

export async function getCurrentStudent(): Promise<User | null> {
  try {
    const { data } = await supabase.auth.getSession();
    return data.session?.user || null;
  } catch {
    return null;
  }
}

// ==========================================
// 2. SUPABASE QUESTIONS (141 POOL & 7-DAY BLOCKS)
// ==========================================

export function getCachedQuestions(): Question[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(QUESTIONS_CACHE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveCachedQuestions(questions: Question[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(QUESTIONS_CACHE_KEY, JSON.stringify(questions));
  } catch {
    // Ignore
  }
}

function buildPedagogicalExplanation(
  _prompt: string,
  options: string[],
  correctIndex: number
) {
  const correctText = options[correctIndex] || '';
  return {
    rule: 'Aukera zuzena euskara batuaren arauen arabera hautatu da.',
    whyCorrect: `"${correctText}" da forma gramatikala egokia testuinguru honetan.`,
    tip: 'Begiratu ondo deklinabide markari eta aditzaren komunztadurari.',
    whyWrongOptions: options.map((opt, idx) => ({
      letter: (['A', 'B', 'C', 'D'][idx] || 'A') as 'A' | 'B' | 'C' | 'D',
      reason: idx === correctIndex
        ? `Forma zuzena ("${opt}").`
        : `"${opt}" ez da zuzena testuinguru honetan.`,
    })),
  };
}

export async function fetchAllQuestionsFromSupabase(): Promise<Question[]> {
  try {
    const { data, error } = await supabase
      .from('euskera_questions')
      .select('*')
      .order('id', { ascending: true })
      .limit(200);

    if (error || !data || data.length === 0) {
      const cached = getCachedQuestions();
      if (cached.length > 0) return cached;
      return getDailyMixedQuestions();
    }

    const transformed: Question[] = data.map((raw: RawEuskeraQuestion, idx: number) => {
      const correctIndex = typeof raw.answer === 'number' ? raw.answer : 0;
      const candidates = Array.isArray(raw.candidates) ? raw.candidates : [];
      const safeOptions: [string, string, string, string] = [
        candidates[0] || 'Aukera A',
        candidates[1] || 'Aukera B',
        candidates[2] || 'Aukera C',
        candidates[3] || 'Aukera D',
      ];

      return {
        id: `sb-${raw.id}`,
        day: 'astelehena',
        order: idx + 1,
        prompt: raw.question,
        options: safeOptions,
        correctIndex: correctIndex,
        category: raw.category || 'Mistoa',
        level: 'B2' as const,
        explanation: buildPedagogicalExplanation(raw.question, safeOptions, correctIndex),
        supabaseId: raw.id,
      };
    });

    saveCachedQuestions(transformed);
    registerDynamicQuestions(transformed);
    return transformed;
  } catch {
    const cached = getCachedQuestions();
    if (cached.length > 0) return cached;
    return getDailyMixedQuestions();
  }
}

export async function getToday7DayBlockQuestions(d: Date = new Date()): Promise<{
  questions: Question[];
  dayInfo: ReturnType<typeof getWeekBlockInfo>;
}> {
  const allQuestions = await fetchAllQuestionsFromSupabase();
  const result = getQuestionsForDayInBlock(allQuestions, d);
  return {
    questions: result.questions,
    dayInfo: result.blockInfo,
  };
}

// ================================================================
// 3. CLOUD PERSISTENCE: PARTIDAK, RACHA, AKATSAK & EGUNEKO BLOKEOA
// ================================================================

export function getAllStoredRecords(): PlayerScoreRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LEADERBOARD_STORAGE_KEY);
    if (!raw) return [];
    const list = JSON.parse(raw);
    return Array.isArray(list) ? list.map(normalizeScoreRecord) : [];
  } catch {
    return [];
  }
}

/**
 * Marks that a player has initiated today's attempt in Supabase and locally.
 * Enforces cross-device lockout so the player cannot start again until 00:01.
 */
export async function markGameInitiatedInCloud(
  playerId: string,
  playerName: string,
  dateStr: string,
  weekMondayStr: string
): Promise<void> {
  const cleanPlayerId = playerId.toLowerCase().trim();
  const attemptId = `${cleanPlayerId}_${dateStr}`;

  // 1. Local storage immediate cache
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(ATTEMPTS_STORAGE_KEY);
      const set: Record<string, number> = raw ? JSON.parse(raw) : {};
      set[attemptId] = Date.now();
      localStorage.setItem(ATTEMPTS_STORAGE_KEY, JSON.stringify(set));
    } catch {}
  }

  // 2. Cloud upsert in Supabase `partidak`
  try {
    await supabase.from('partidak').upsert(
      {
        id: attemptId,
        player_id: cleanPlayerId,
        player_name: playerName,
        date_str: dateStr,
        week_monday_str: weekMondayStr,
        score: 0,
        total_questions: 20,
        time_seconds: 0,
        completed_at: Date.now(),
        status: 'started',
      },
      { onConflict: 'player_id,date_str' }
    );
  } catch {
    // Graceful fallback
  }
}

/**
 * Checks if a player has already initiated or completed today's game
 * in Supabase (checking across any device) or local storage.
 * Note: Teacher (admin) can play as many times as desired without game lock.
 */
export async function checkGameInitiatedOrPlayedToday(
  playerId: string,
  dateStr: string
): Promise<{ hasPlayed: boolean; record: PlayerScoreRecord | null }> {
  const cleanPlayerId = playerId.toLowerCase().trim();

  // Teachers/admins can play as many times as they want
  if (isTeacherAdmin(cleanPlayerId)) {
    return { hasPlayed: false, record: null };
  }

  const attemptId = `${cleanPlayerId}_${dateStr}`;

  // 1. First check Supabase cloud table `partidak`
  try {
    const { data, error } = await supabase
      .from('partidak')
      .select('*')
      .eq('player_id', cleanPlayerId)
      .eq('date_str', dateStr)
      .maybeSingle();

    if (!error && data) {
      const isCompleted = data.status === 'completed' || data.score > 0 || data.time_seconds > 0;
      const record: PlayerScoreRecord | null = isCompleted
        ? normalizeScoreRecord(data)
        : null;

      return { hasPlayed: true, record };
    }
  } catch {}

  // 2. Fallback to localStorage
  if (typeof window !== 'undefined') {
    try {
      const records = getAllStoredRecords();
      const localRec = records.find(
        r => r.playerId.toLowerCase() === cleanPlayerId && r.dateStr === dateStr
      );
      if (localRec) {
        return { hasPlayed: true, record: localRec };
      }

      const raw = localStorage.getItem(ATTEMPTS_STORAGE_KEY);
      if (raw) {
        const set: Record<string, number> = JSON.parse(raw);
        if (set[attemptId]) {
          return { hasPlayed: true, record: null };
        }
      }
    } catch {}
  }

  return { hasPlayed: false, record: null };
}

/**
 * Saves a completed game to Supabase (`partidak` and `jokalari_egoera`),
 * persisting the score, time, streak, and last game mistakes in the cloud.
 */
export async function saveGameResultToCloud(
  record: PlayerScoreRecord,
  lastGameMistakes: any[],
  streak: number
): Promise<void> {
  const cleanPlayerId = record.playerId.toLowerCase().trim();

  // 1. Save in local cache
  if (typeof window !== 'undefined') {
    try {
      const records = getAllStoredRecords().filter(
        r => !(r.playerId.toLowerCase() === cleanPlayerId && r.dateStr === record.dateStr)
      );
      records.push(record);
      localStorage.setItem(LEADERBOARD_STORAGE_KEY, JSON.stringify(records));
      localStorage.setItem(LAST_GAME_MISTAKES_KEY, JSON.stringify(lastGameMistakes));
    } catch {}
  }

  // 2. Upsert in Supabase `partidak`
  try {
    await supabase.from('partidak').upsert(
      {
        id: record.id || `${cleanPlayerId}_${record.dateStr}`,
        player_id: cleanPlayerId,
        player_name: record.playerName,
        date_str: record.dateStr,
        week_monday_str: record.weekMondayStr,
        score: record.score,
        total_questions: record.totalQuestions,
        time_seconds: record.timeSeconds,
        completed_at: record.completedAt,
        status: 'completed',
      },
      { onConflict: 'player_id,date_str' }
    );
  } catch (e) {
    console.warn('Supabase partidak upsert fallback:', e);
  }

  // 3. Upsert in Supabase `jokalari_egoera`
  try {
    await supabase.from('jokalari_egoera').upsert(
      {
        player_id: cleanPlayerId,
        player_name: record.playerName,
        streak: streak,
        last_played_date: record.dateStr,
        last_game_mistakes: lastGameMistakes,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'player_id' }
    );
  } catch (e) {
    console.warn('Supabase jokalari_egoera upsert fallback:', e);
  }
}

/**
 * Updates the player's mistakes/review items in Supabase and local cache
 * after they practice and clean them ("Akatsak Garbitu").
 */
export async function updatePlayerMistakesInCloud(
  playerId: string,
  updatedReviewItems: any[]
): Promise<void> {
  const cleanPlayerId = playerId.toLowerCase().trim();

  // 1. Local cache
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(LAST_GAME_MISTAKES_KEY, JSON.stringify(updatedReviewItems));
    } catch {}
  }

  // 2. Supabase update
  try {
    await supabase
      .from('jokalari_egoera')
      .update({
        last_game_mistakes: updatedReviewItems,
        updated_at: new Date().toISOString(),
      })
      .eq('player_id', cleanPlayerId);
  } catch (e) {
    console.warn('updatePlayerMistakesInCloud fallback:', e);
  }
}

/**
 * Loads the player's cloud profile (streak, last played date, last game mistakes)
 * calculating the streak authoritatively from actual completed dates.
 */
export async function loadPlayerCloudState(
  playerId: string,
  todayStr: string
): Promise<PlayerCloudState | null> {
  const cleanPlayerId = playerId.toLowerCase().trim();

  try {
    // 1. Query all completed dates for this player to calculate streak accurately
    const { data: recordsData } = await supabase
      .from('partidak')
      .select('date_str')
      .eq('player_id', cleanPlayerId)
      .eq('status', 'completed');

    let playedDates: string[] = [];
    if (recordsData && recordsData.length > 0) {
      playedDates = recordsData.map(r => r.date_str);
    } else {
      // Fallback to local
      playedDates = getAllStoredRecords()
        .filter(r => r.playerId.toLowerCase() === cleanPlayerId && r.status === 'completed')
        .map(r => r.dateStr);
    }

    // Authoritative calculation: a player with 1 played day will ALWAYS have streak = 1!
    const calculatedStreak = calculateStreakFromDates(playedDates, todayStr);

    // 2. Fetch state details from `jokalari_egoera`
    const { data: egoeraData } = await supabase
      .from('jokalari_egoera')
      .select('*')
      .eq('player_id', cleanPlayerId)
      .maybeSingle();

    return {
      playerId: cleanPlayerId,
      playerName: egoeraData?.player_name || cleanPlayerId,
      streak: calculatedStreak,
      lastPlayedDate: egoeraData?.last_played_date || (playedDates.sort().reverse()[0] || null),
      lastGameMistakes: Array.isArray(egoeraData?.last_game_mistakes) ? egoeraData.last_game_mistakes : [],
      playedDates,
    };
  } catch {
    // Offline fallback
    const playedDates = getAllStoredRecords()
      .filter(r => r.playerId.toLowerCase() === cleanPlayerId && r.status === 'completed')
      .map(r => r.dateStr);

    const calculatedStreak = calculateStreakFromDates(playedDates, todayStr);

    return {
      playerId: cleanPlayerId,
      playerName: cleanPlayerId,
      streak: calculatedStreak,
      lastPlayedDate: playedDates.sort().reverse()[0] || null,
      lastGameMistakes: [],
      playedDates,
    };
  }
}

/**
 * Retrieves the player's last 7 days of completed games from Supabase,
 * normalized with accuracy, speed bonus and total points.
 */
export async function fetchPlayerRecent7DaysHistory(playerId: string): Promise<PlayerScoreRecord[]> {
  const cleanPlayerId = playerId.toLowerCase().trim();

  try {
    const { data, error } = await supabase
      .from('partidak')
      .select('*')
      .eq('player_id', cleanPlayerId)
      .eq('status', 'completed')
      .order('date_str', { ascending: false })
      .limit(7);

    if (!error && data && data.length > 0) {
      return data.map(normalizeScoreRecord);
    }
  } catch {}

  // Fallback to local
  const localRecords = getAllStoredRecords().filter(
    r => r.playerId.toLowerCase() === cleanPlayerId && r.status === 'completed'
  );
  localRecords.sort((a, b) => b.dateStr.localeCompare(a.dateStr));
  return localRecords.slice(0, 7);
}

// ==========================================
// 4. LEADERBOARD SYSTEM (DIARIO Y SEMANAL)
// ==========================================

/**
 * Returns today's live leaderboard from Supabase cloud database.
 * Only includes real student players who have actually completed today's game.
 * Excludes teacher/admin accounts and filters out any records before the active cycle start date.
 * Sorted by score (points) DESC, then time_seconds ASC.
 */
export async function getDailyLeaderboardCloud(
  dateStr: string,
  _weekMondayStr: string
): Promise<PlayerScoreRecord[]> {
  const configuredStart = getConfiguredStartDate();

  // If viewing a date that is strictly before the teacher's active cycle start date, return empty
  if (configuredStart && dateStr < configuredStart) {
    return [];
  }

  try {
    let query = supabase
      .from('partidak')
      .select('*')
      .eq('date_str', dateStr)
      .eq('status', 'completed');

    if (configuredStart) {
      query = query.gte('date_str', configuredStart);
    }

    const { data, error } = await query
      .order('score', { ascending: false })
      .order('time_seconds', { ascending: true });

    if (!error && data && data.length > 0) {
      return data
        .map(normalizeScoreRecord)
        .filter(r => !isTeacherAdmin(r.playerId) && !isTeacherAdmin(r.playerName));
    }
  } catch {}

  // Fallback to local
  return getDailyLeaderboard(dateStr, _weekMondayStr);
}

export function getDailyLeaderboard(dateStr: string, _weekMondayStr: string): PlayerScoreRecord[] {
  const configuredStart = getConfiguredStartDate();

  if (configuredStart && dateStr < configuredStart) {
    return [];
  }

  const records = getAllStoredRecords().filter(
    r =>
      r.dateStr === dateStr &&
      r.status === 'completed' &&
      !isTeacherAdmin(r.playerId) &&
      !isTeacherAdmin(r.playerName) &&
      (!configuredStart || r.dateStr >= configuredStart)
  );

  records.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return a.timeSeconds - b.timeSeconds;
  });

  return records;
}

/**
 * Returns weekly leaderboard aggregated from Supabase cloud database.
 * Only includes real student players who have actually completed games in this cycle/week.
 * Excludes teacher/admin accounts and ignores records before the configured cycle start date.
 * Sorted strictly by totalScore DESC (time is not used).
 */
export async function getWeeklyLeaderboardCloud(
  weekMondayStr: string
): Promise<WeeklyPlayerSummary[]> {
  const configuredStart = getConfiguredStartDate();

  try {
    let query = supabase
      .from('partidak')
      .select('*')
      .eq('week_monday_str', weekMondayStr)
      .eq('status', 'completed');

    if (configuredStart) {
      query = query.gte('date_str', configuredStart);
    }

    const { data, error } = await query;

    if (!error && data && data.length > 0) {
      const playerMap = new Map<string, WeeklyPlayerSummary>();

      for (const raw of data) {
        const d = normalizeScoreRecord(raw);
        const pId = d.playerId.toLowerCase();

        // Exclude teacher / admin accounts from rankings
        if (isTeacherAdmin(pId) || isTeacherAdmin(d.playerName)) {
          continue;
        }

        // Exclude records prior to cycle start
        if (configuredStart && d.dateStr < configuredStart) {
          continue;
        }

        const existing = playerMap.get(pId);
        if (existing) {
          existing.totalScore += d.score;
          existing.totalTimeSeconds += d.timeSeconds;
          existing.daysPlayed += 1;
          existing.bestDailyScore = Math.max(existing.bestDailyScore, d.score);
          existing.latestDate = d.dateStr;
        } else {
          playerMap.set(pId, {
            playerId: pId,
            playerName: d.playerName,
            totalScore: d.score,
            totalTimeSeconds: d.timeSeconds,
            daysPlayed: 1,
            bestDailyScore: d.score,
            latestDate: d.dateStr,
          });
        }
      }

      const list = Array.from(playerMap.values());
      list.sort((a, b) => {
        if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
        return b.daysPlayed - a.daysPlayed;
      });

      return list;
    }
  } catch {}

  // Fallback to local
  return getWeeklyLeaderboard(weekMondayStr);
}

export function getWeeklyLeaderboard(weekMondayStr: string): WeeklyPlayerSummary[] {
  const configuredStart = getConfiguredStartDate();

  const records = getAllStoredRecords().filter(
    r =>
      r.weekMondayStr === weekMondayStr &&
      r.status === 'completed' &&
      !isTeacherAdmin(r.playerId) &&
      !isTeacherAdmin(r.playerName) &&
      (!configuredStart || r.dateStr >= configuredStart)
  );
  const playerMap = new Map<string, WeeklyPlayerSummary>();

  for (const rec of records) {
    const existing = playerMap.get(rec.playerId.toLowerCase());
    if (existing) {
      existing.totalScore += rec.score;
      existing.totalTimeSeconds += rec.timeSeconds;
      existing.daysPlayed += 1;
      existing.bestDailyScore = Math.max(existing.bestDailyScore, rec.score);
      existing.latestDate = rec.dateStr;
    } else {
      playerMap.set(rec.playerId.toLowerCase(), {
        playerId: rec.playerId.toLowerCase(),
        playerName: rec.playerName,
        totalScore: rec.score,
        totalTimeSeconds: rec.timeSeconds,
        daysPlayed: 1,
        bestDailyScore: rec.score,
        latestDate: rec.dateStr,
      });
    }
  }

  const list = Array.from(playerMap.values());
  list.sort((a, b) => {
    if (b.totalScore !== a.totalScore) {
      return b.totalScore - a.totalScore;
    }
    return b.daysPlayed - a.daysPlayed;
  });

  return list;
}

// ==========================================
// 5. IRAKASLE ADMIN DASHBOARD SERVICES
// ==========================================

export const ADMIN_TEACHER_EMAIL = 'irakasle@mintzakats.app';

export function isTeacherAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  const clean = email.toLowerCase().trim();
  return clean === ADMIN_TEACHER_EMAIL || clean === 'admin@mintzakats.app' || clean.startsWith('irakasle');
}

export interface AdminPlayerOverview {
  playerId: string;
  playerName: string;
  streak: number;
  totalGames: number;
  totalPoints: number;
  bestScore: number;
  totalCorrect: number;
  totalQuestions: number;
  accuracyPercent: number;
  averageTimeSeconds: number;
  lastPlayedDate: string | null;
  mistakesCount: number;
  records: PlayerScoreRecord[];
  lastGameMistakes: any[];
}

/**
 * Loads all player records, statistics, and mistakes for the teacher admin dashboard.
 */
export async function getAllPlayersAdminData(): Promise<AdminPlayerOverview[]> {
  const playerMap = new Map<string, AdminPlayerOverview>();

  // 1. Fetch from Supabase `partidak`
  let cloudPartidak: any[] = [];
  try {
    const { data, error } = await supabase
      .from('partidak')
      .select('*')
      .order('completed_at', { ascending: false });
    if (!error && data) {
      cloudPartidak = data;
    }
  } catch (e) {
    console.warn('getAllPlayersAdminData partidak error:', e);
  }

  // 2. Fetch from Supabase `jokalari_egoera`
  let cloudEgoera: any[] = [];
  try {
    const { data, error } = await supabase
      .from('jokalari_egoera')
      .select('*');
    if (!error && data) {
      cloudEgoera = data;
    }
  } catch (e) {
    console.warn('getAllPlayersAdminData jokalari_egoera error:', e);
  }

  // Combine with local records as well
  const localRecords = getAllStoredRecords();
  const allRecordsMap = new Map<string, PlayerScoreRecord>();

  for (const raw of cloudPartidak) {
    const norm = normalizeScoreRecord(raw);
    allRecordsMap.set(`${norm.playerId}_${norm.dateStr}`, norm);
  }

  for (const loc of localRecords) {
    const key = `${loc.playerId}_${loc.dateStr}`;
    if (!allRecordsMap.has(key)) {
      allRecordsMap.set(key, loc);
    }
  }

  // Index cloud egoera by playerId
  const egoeraMap = new Map<string, any>();
  for (const ego of cloudEgoera) {
    if (ego.player_id && !ego.player_id.startsWith('_config_')) {
      egoeraMap.set(ego.player_id.toLowerCase().trim(), ego);
    }
  }

  // Group all records by player
  for (const rec of allRecordsMap.values()) {
    if (rec.playerId.startsWith('_config_')) continue;
    const pId = rec.playerId.toLowerCase().trim();
    const ego = egoeraMap.get(pId);

    const existing = playerMap.get(pId);
    if (existing) {
      existing.totalGames += 1;
      existing.totalPoints += rec.score;
      existing.bestScore = Math.max(existing.bestScore, rec.score);
      existing.totalCorrect += rec.correctAnswers;
      existing.totalQuestions += rec.totalQuestions;
      existing.averageTimeSeconds += rec.timeSeconds;
      existing.records.push(rec);
      if (!existing.lastPlayedDate || rec.dateStr > existing.lastPlayedDate) {
        existing.lastPlayedDate = rec.dateStr;
      }
    } else {
      playerMap.set(pId, {
        playerId: pId,
        playerName: rec.playerName || ego?.player_name || pId,
        streak: ego?.streak || 0,
        totalGames: 1,
        totalPoints: rec.score,
        bestScore: rec.score,
        totalCorrect: rec.correctAnswers,
        totalQuestions: rec.totalQuestions,
        accuracyPercent: 0,
        averageTimeSeconds: rec.timeSeconds,
        lastPlayedDate: rec.dateStr,
        mistakesCount: Array.isArray(ego?.last_game_mistakes) ? ego.last_game_mistakes.length : 0,
        records: [rec],
        lastGameMistakes: Array.isArray(ego?.last_game_mistakes) ? ego.last_game_mistakes : [],
      });
    }
  }

  // Also include players in `jokalari_egoera` who might not have completed games in partidak
  for (const [pId, ego] of egoeraMap.entries()) {
    if (!playerMap.has(pId)) {
      playerMap.set(pId, {
        playerId: pId,
        playerName: ego.player_name || pId,
        streak: ego.streak || 0,
        totalGames: 0,
        totalPoints: 0,
        bestScore: 0,
        totalCorrect: 0,
        totalQuestions: 0,
        accuracyPercent: 0,
        averageTimeSeconds: 0,
        lastPlayedDate: ego.last_played_date || null,
        mistakesCount: Array.isArray(ego.last_game_mistakes) ? ego.last_game_mistakes.length : 0,
        records: [],
        lastGameMistakes: Array.isArray(ego.last_game_mistakes) ? ego.last_game_mistakes : [],
      });
    } else {
      const p = playerMap.get(pId)!;
      p.streak = ego.streak ?? p.streak;
      if (Array.isArray(ego.last_game_mistakes) && ego.last_game_mistakes.length > 0) {
        p.lastGameMistakes = ego.last_game_mistakes;
        p.mistakesCount = ego.last_game_mistakes.length;
      }
    }
  }

  // Finalize averages and percentages
  const list: AdminPlayerOverview[] = Array.from(playerMap.values());
  for (const p of list) {
    if (p.totalQuestions > 0) {
      p.accuracyPercent = Math.round((p.totalCorrect / p.totalQuestions) * 100);
    }
    if (p.totalGames > 0) {
      p.averageTimeSeconds = Math.round((p.averageTimeSeconds / p.totalGames) * 10) / 10;
    }
    p.records.sort((a, b) => b.dateStr.localeCompare(a.dateStr));
  }

  // Sort by totalPoints desc, then totalGames desc
  list.sort((a, b) => {
    if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
    return b.totalGames - a.totalGames;
  });

  return list;
}

/**
 * Deletes all game and progress records for a given player (Supabase & LocalStorage).
 * Also clears daily initiated attempts locks so the student can play again immediately.
 */
export async function deletePlayerDataAdmin(playerId: string): Promise<boolean> {
  const cleanId = playerId.toLowerCase().trim();

  // 1. Delete in Supabase `partidak`
  try {
    await supabase.from('partidak').delete().eq('player_id', cleanId);
  } catch (e) {
    console.warn('deletePlayerDataAdmin partidak error:', e);
  }

  // 2. Delete in Supabase `jokalari_egoera`
  try {
    await supabase.from('jokalari_egoera').delete().eq('player_id', cleanId);
  } catch (e) {
    console.warn('deletePlayerDataAdmin jokalari_egoera error:', e);
  }

  // 3. Clean in localStorage (records, attempts lock, app state if matching)
  if (typeof window !== 'undefined') {
    try {
      const records = getAllStoredRecords().filter(r => r.playerId.toLowerCase().trim() !== cleanId);
      localStorage.setItem(LEADERBOARD_STORAGE_KEY, JSON.stringify(records));

      const rawAttempts = localStorage.getItem(ATTEMPTS_STORAGE_KEY);
      if (rawAttempts) {
        const attempts: Record<string, number> = JSON.parse(rawAttempts);
        let modified = false;
        for (const key of Object.keys(attempts)) {
          if (key.toLowerCase().startsWith(`${cleanId}_`)) {
            delete attempts[key];
            modified = true;
          }
        }
        if (modified) {
          localStorage.setItem(ATTEMPTS_STORAGE_KEY, JSON.stringify(attempts));
        }
      }
    } catch {}
  }

  return true;
}

/**
 * Deletes a player's record for a specific date (e.g. today's game).
 * Unlocks the game so the student can replay immediately.
 */
export async function deletePlayerDateRecordAdmin(playerId: string, dateStr: string): Promise<boolean> {
  const cleanId = playerId.toLowerCase().trim();
  const attemptId = `${cleanId}_${dateStr}`;

  // 1. Delete from Supabase `partidak` for this specific date
  try {
    await supabase.from('partidak').delete().eq('player_id', cleanId).eq('date_str', dateStr);
  } catch (e) {
    console.warn('deletePlayerDateRecordAdmin partidak error:', e);
  }

  // 2. Recalculate streak and update `jokalari_egoera`
  try {
    const { data: remainingRecords } = await supabase
      .from('partidak')
      .select('date_str')
      .eq('player_id', cleanId)
      .eq('status', 'completed');

    const remainingDates = remainingRecords ? remainingRecords.map(r => r.date_str) : [];
    const newStreak = calculateStreakFromDates(remainingDates, dateStr);
    const lastDate = remainingDates.sort().reverse()[0] || null;

    if (remainingDates.length === 0) {
      await supabase.from('jokalari_egoera').delete().eq('player_id', cleanId);
    } else {
      await supabase.from('jokalari_egoera').update({
        streak: newStreak,
        last_played_date: lastDate,
        last_game_mistakes: [],
        updated_at: new Date().toISOString(),
      }).eq('player_id', cleanId);
    }
  } catch (e) {
    console.warn('deletePlayerDateRecordAdmin egoera update error:', e);
  }

  // 3. Clean in localStorage (both leaderboard records & attempt lock)
  if (typeof window !== 'undefined') {
    try {
      const records = getAllStoredRecords().filter(
        r => !(r.playerId.toLowerCase().trim() === cleanId && r.dateStr === dateStr)
      );
      localStorage.setItem(LEADERBOARD_STORAGE_KEY, JSON.stringify(records));

      const rawAttempts = localStorage.getItem(ATTEMPTS_STORAGE_KEY);
      if (rawAttempts) {
        const attempts: Record<string, number> = JSON.parse(rawAttempts);
        if (attempts[attemptId]) {
          delete attempts[attemptId];
          localStorage.setItem(ATTEMPTS_STORAGE_KEY, JSON.stringify(attempts));
        }
      }
    } catch {}
  }

  return true;
}

/**
 * Syncs the teacher's game cycle start date to Supabase and localStorage.
 */
export async function syncTeacherCycleStartDateCloud(dateStr: string | null): Promise<void> {
  setConfiguredStartDate(dateStr);

  try {
    if (dateStr) {
      await supabase.from('jokalari_egoera').upsert({
        player_id: '_config_cycle_start_',
        player_name: 'Hasiera Data Konfigurazioa',
        streak: 0,
        last_played_date: dateStr,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'player_id' });
    } else {
      await supabase.from('jokalari_egoera').delete().eq('player_id', '_config_cycle_start_');
    }
  } catch (e) {
    console.warn('syncTeacherCycleStartDateCloud error:', e);
  }
}

/**
 * Fetches the teacher-configured cycle start date from Supabase or localStorage.
 */
export async function fetchTeacherCycleStartDateCloud(): Promise<string | null> {
  try {
    const { data } = await supabase
      .from('jokalari_egoera')
      .select('last_played_date')
      .eq('player_id', '_config_cycle_start_')
      .maybeSingle();

    if (data?.last_played_date) {
      setConfiguredStartDate(data.last_played_date);
      return data.last_played_date;
    }
  } catch {}

  return getConfiguredStartDate();
}

/**
 * Returns all 141 questions from Supabase for teacher inspection.
 */
export async function fetchAllQuestionsAdmin(): Promise<Question[]> {
  return await fetchAllQuestionsFromSupabase();
}

