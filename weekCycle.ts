/**
 * Week Cycle & 7-Day Non-Repeating Question Distribution System
 * Mintzakats Daily Competition
 * 
 * Rules:
 * - 7-day blocks (Monday to Sunday, or teacher-configured start date).
 * - 20 completely random questions per day.
 * - ZERO repeated questions within the 7-day block (7 * 20 = 140 questions).
 * - Questions are thoroughly randomized from the entire question pool, never in table order.
 * - All players on the same day receive the exact same 20 randomized questions in identical order.
 */

import { Question } from '../types';

export const BASQUE_DAY_NAMES = [
  'Astelehena', // Monday (index 0)
  'Asteartea',  // Tuesday (index 1)
  'Asteazkena', // Wednesday (index 2)
  'Osteguna',   // Thursday (index 3)
  'Ostirala',   // Friday (index 4)
  'Larunbata',  // Saturday (index 5)
  'Igandea',    // Sunday (index 6)
] as const;

export const CYCLE_START_DATE_STORAGE_KEY = 'mintzakats_cycle_start_date_v1';

export function getConfiguredStartDate(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(CYCLE_START_DATE_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setConfiguredStartDate(dateStr: string | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (dateStr && dateStr.trim()) {
      localStorage.setItem(CYCLE_START_DATE_STORAGE_KEY, dateStr.trim());
    } else {
      localStorage.removeItem(CYCLE_START_DATE_STORAGE_KEY);
    }
  } catch {}
}

export interface WeekBlockInfo {
  weekMondayDateStr: string; // e.g. "2026-09-21"
  dayIndexInWeek: number;    // 0 = Astelehena .. 6 = Igandea
  dayName: string;           // "Astelehena" .. "Igandea"
  dayNumberInBlock: number;  // 1 to 7
  formattedDate: string;     // e.g. "2026/09/25"
  configuredStartDateStr?: string;
  isCustomSchedule?: boolean;
}

/**
 * Returns Monday (00:00:00) of the week containing the specified date.
 */
export function getMondayOfWeek(d: Date = new Date()): Date {
  const date = new Date(d);
  const day = (date.getDay() + 6) % 7;
  date.setDate(date.getDate() - day);
  date.setHours(0, 0, 0, 0);
  return date;
}

/**
 * Returns detailed information about the current 7-day block.
 * Can be customized if teacher configured an explicit start date.
 */
export function getWeekBlockInfo(
  d: Date = new Date(),
  customStartDateStr?: string | null
): WeekBlockInfo {
  const effectiveStartDateStr = customStartDateStr ?? getConfiguredStartDate();

  let weekMondayDateStr: string;
  let dayIndexInWeek: number;
  let isCustom = false;

  if (effectiveStartDateStr && /^\d{4}-\d{2}-\d{2}$/.test(effectiveStartDateStr)) {
    const [sYear, sMonth, sDay] = effectiveStartDateStr.split('-').map(Number);
    const startDate = new Date(sYear, sMonth - 1, sDay, 0, 0, 0, 0);
    const currentDate = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);

    const diffMs = currentDate.getTime() - startDate.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays >= 0) {
      dayIndexInWeek = diffDays % 7;
      const cycleChunkStart = new Date(startDate);
      cycleChunkStart.setDate(startDate.getDate() + Math.floor(diffDays / 7) * 7);
      const cYear = cycleChunkStart.getFullYear();
      const cMonth = String(cycleChunkStart.getMonth() + 1).padStart(2, '0');
      const cDay = String(cycleChunkStart.getDate()).padStart(2, '0');
      weekMondayDateStr = `${cYear}-${cMonth}-${cDay}`;
      isCustom = true;
    } else {
      // Future start date: first day of configured cycle
      dayIndexInWeek = 0;
      weekMondayDateStr = effectiveStartDateStr;
      isCustom = true;
    }
  } else {
    // Default standard calendar week (Monday to Sunday)
    const monday = getMondayOfWeek(d);
    const mondayYear = monday.getFullYear();
    const mondayMonth = String(monday.getMonth() + 1).padStart(2, '0');
    const mondayDay = String(monday.getDate()).padStart(2, '0');
    weekMondayDateStr = `${mondayYear}-${mondayMonth}-${mondayDay}`;
    dayIndexInWeek = (d.getDay() + 6) % 7; // 0..6
  }

  const dayName = BASQUE_DAY_NAMES[dayIndexInWeek];
  const dayNumberInBlock = dayIndexInWeek + 1; // 1..7

  const curYear = d.getFullYear();
  const curMonth = String(d.getMonth() + 1).padStart(2, '0');
  const curDay = String(d.getDate()).padStart(2, '0');
  const formattedDate = `${curYear}/${curMonth}/${curDay}`;

  return {
    weekMondayDateStr,
    dayIndexInWeek,
    dayName,
    dayNumberInBlock,
    formattedDate,
    configuredStartDateStr: effectiveStartDateStr || undefined,
    isCustomSchedule: isCustom,
  };
}

/**
 * High-entropy Mulberry32 Seeded Pseudo-Random Generator.
 */
function createSeededRandom(seed: number) {
  let s = seed >>> 0;
  return function () {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Robust string hash with salt.
 */
function hashString(str: string): number {
  let hash = 2166136261;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

/**
 * Given the entire pool of questions (141 questions from Supabase),
 * thoroughly scrambles them randomly for the 7-day block using the week seed,
 * guaranteeing:
 * 1. ZERO table order correlation (completely randomized).
 * 2. EXACTLY 20 questions per day.
 * 3. ZERO repeated questions across all 7 days of the block (140 unique questions).
 * 4. Within each day, the 20 questions are also shuffled so they don't follow any predictable sequence.
 */
export function getQuestionsForDayInBlock(
  allQuestions: Question[],
  d: Date = new Date(),
  customStartDateStr?: string | null
): { questions: Question[]; blockInfo: WeekBlockInfo } {
  const blockInfo = getWeekBlockInfo(d, customStartDateStr);
  
  if (!allQuestions || allQuestions.length === 0) {
    return { questions: [], blockInfo };
  }

  const pool = [...allQuestions];

  // Strong week seed ensuring thorough randomization for the current block
  const weekSeed = hashString(`mintzakats_full_scramble_block_${blockInfo.weekMondayDateStr}_salt_9381`);
  const random = createSeededRandom(weekSeed);

  // Full Fisher-Yates shuffle across the entire question pool
  const thoroughlyShuffled = [...pool];
  for (let i = thoroughlyShuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [thoroughlyShuffled[i], thoroughlyShuffled[j]] = [thoroughlyShuffled[j], thoroughlyShuffled[i]];
  }

  // Double-pass shuffle with secondary polynomial scramble for maximum disorder
  for (let i = thoroughlyShuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [thoroughlyShuffled[i], thoroughlyShuffled[j]] = [thoroughlyShuffled[j], thoroughlyShuffled[i]];
  }

  // Slice exactly 20 distinct questions for today's day of the week
  // Day 0: 0..19, Day 1: 20..39, ... Day 6: 120..139
  const startIndex = (blockInfo.dayIndexInWeek * 20) % thoroughlyShuffled.length;
  const rawDaySlice: Question[] = [];

  for (let i = 0; i < 20; i++) {
    const qIndex = (startIndex + i) % thoroughlyShuffled.length;
    rawDaySlice.push(thoroughlyShuffled[qIndex]);
  }

  // Shuffle within the day's 20 questions using today's date seed
  const daySeed = hashString(`mintzakats_day_${blockInfo.formattedDate}_order`);
  const dayRandom = createSeededRandom(daySeed);
  const randomizedDayQuestions = [...rawDaySlice];
  for (let i = randomizedDayQuestions.length - 1; i > 0; i--) {
    const j = Math.floor(dayRandom() * (i + 1));
    [randomizedDayQuestions[i], randomizedDayQuestions[j]] = [randomizedDayQuestions[j], randomizedDayQuestions[i]];
  }

  const finalizedQuestions: Question[] = randomizedDayQuestions.map((q, idx) => ({
    ...q,
    order: idx + 1,
  }));

  return {
    questions: finalizedQuestions,
    blockInfo,
  };
}

/**
 * Returns full 7-day schedule with all 140 questions (20 per day) for teacher review.
 */
export function get7DayScheduleForBlock(
  allQuestions: Question[],
  customStartDateStr?: string | null
): Array<{
  dayIndex: number;
  dayNumber: number;
  dayName: string;
  dateStr: string;
  questions: Question[];
}> {
  const result = [];
  const baseBlock = getWeekBlockInfo(new Date(), customStartDateStr);
  const [mYear, mMonth, mDay] = baseBlock.weekMondayDateStr.split('-').map(Number);

  for (let i = 0; i < 7; i++) {
    const dayDate = new Date(mYear, mMonth - 1, mDay + i, 12, 0, 0, 0);
    const y = dayDate.getFullYear();
    const m = String(dayDate.getMonth() + 1).padStart(2, '0');
    const d = String(dayDate.getDate()).padStart(2, '0');
    const dateStr = `${y}-${m}-${d}`;

    const { questions } = getQuestionsForDayInBlock(allQuestions, dayDate, customStartDateStr);

    result.push({
      dayIndex: i,
      dayNumber: i + 1,
      dayName: BASQUE_DAY_NAMES[i],
      dateStr,
      questions,
    });
  }

  return result;
}

/**
 * Calculates the next unlock time (00:01:00 AM of the next day).
 */
export function getNextUnlockTime(now: Date = new Date()): Date {
  const target = new Date(now);
  if (now.getHours() === 0 && now.getMinutes() === 0) {
    target.setHours(0, 1, 0, 0);
  } else {
    target.setDate(target.getDate() + 1);
    target.setHours(0, 1, 0, 0);
  }
  return target;
}

/**
 * Returns formatted remaining time until next day 00:01:00.
 */
export function getTimeRemainingUntil0001(now: Date = new Date()): {
  hours: number;
  minutes: number;
  seconds: number;
  formatted: string;
} {
  const unlock = getNextUnlockTime(now);
  const diffMs = Math.max(0, unlock.getTime() - now.getTime());
  const totalSec = Math.floor(diffMs / 1000);
  const hours = Math.floor(totalSec / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;
  const formatted = `${hours}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`;
  return { hours, minutes, seconds, formatted };
}
