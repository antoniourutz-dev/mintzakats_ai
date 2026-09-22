import { AppState, DayOfWeek, DayProgress, UserMistake } from '../types';

const STORAGE_KEY = 'akatsik_ez_app_state_v2';

export function getTodayDayOfWeek(): DayOfWeek {
  const dayIndex = new Date().getDay(); // 0 is Sunday, 1 is Monday, etc.
  switch (dayIndex) {
    case 1: return 'astelehena';
    case 2: return 'asteartea';
    case 3: return 'asteazkena';
    case 4: return 'osteguna';
    case 5: return 'ostirala';
    case 6: return 'larunbata';
    case 0: return 'igandea';
    default: return 'astelehena';
  }
}

export function getTodayDateString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function getYesterdayDateString(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function getDaysDiff(fromDateStr: string, toDateStr: string): number {
  const d1 = new Date(fromDateStr);
  const d2 = new Date(toDateStr);
  const diffTime = d2.getTime() - d1.getTime();
  return Math.round(diffTime / (1000 * 3600 * 24));
}

export function getDefaultDailyProgress(): DayProgress {
  return {
    completed: false,
    score: 0,
    total: 20,
    answers: {}
  };
}

export function getDefaultProgress(): Record<DayOfWeek, DayProgress> {
  const days: DayOfWeek[] = ['astelehena', 'asteartea', 'asteazkena', 'osteguna', 'ostirala', 'larunbata', 'igandea'];
  const progress = {} as Record<DayOfWeek, DayProgress>;
  days.forEach(day => {
    progress[day] = {
      day,
      completed: false,
      score: 0,
      total: 20,
      answers: {}
    };
  });
  return progress;
}

export function getDefaultState(): AppState {
  const todayDay = getTodayDayOfWeek();
  const today = getTodayDateString();
  return {
    currentDay: todayDay,
    currentQuestionIndex: 0,
    dailyProgress: getDefaultDailyProgress(),
    progress: getDefaultProgress(),
    mistakes: {},
    streak: 0,
    bestStreak: 0,
    lastActiveDate: today,
    lastQuizCompletedDate: null,
    completedQuizDates: [],
    xp: 0,
    unlockedBadges: []
  };
}

export function loadAppState(): AppState {
  if (typeof window === 'undefined') return getDefaultState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultState();
    const parsed = JSON.parse(raw) as Partial<AppState>;
    const defaultState = getDefaultState();

    const today = getTodayDateString();
    const yesterday = getYesterdayDateString();

    let lastCompletedDate = parsed.lastQuizCompletedDate || null;
    let completedDates = Array.isArray(parsed.completedQuizDates) ? [...parsed.completedQuizDates] : [];

    // Migrate any completed day progress to completedDates if empty
    if (completedDates.length === 0 && parsed.progress) {
      Object.values(parsed.progress).forEach(p => {
        if (p?.completed) {
          if (!completedDates.includes(today)) {
            completedDates.push(today);
            if (!lastCompletedDate) lastCompletedDate = today;
          }
        }
      });
    }

    // Determine current streak based on consecutive completed days
    let currentStreak = parsed.streak ?? 0;
    let bestStreak = parsed.bestStreak ?? currentStreak;

    if (lastCompletedDate) {
      if (lastCompletedDate === today) {
        // Completed today, streak is valid
        currentStreak = Math.max(1, currentStreak);
      } else if (lastCompletedDate === yesterday) {
        // Completed yesterday, streak is currently active pending today's quiz
        currentStreak = Math.max(1, currentStreak);
      } else {
        // Missed at least 1 full day without completing a quiz, streak broken
        const daysDiff = getDaysDiff(lastCompletedDate, today);
        if (daysDiff > 1) {
          currentStreak = 0;
        }
      }
    } else {
      // No quiz has been completed yet
      currentStreak = 0;
    }

    if (currentStreak > bestStreak) {
      bestStreak = currentStreak;
    }

    return {
      currentDay: parsed.currentDay || defaultState.currentDay,
      currentQuestionIndex: typeof parsed.currentQuestionIndex === 'number' ? parsed.currentQuestionIndex : 0,
      dailyProgress: parsed.dailyProgress || getDefaultDailyProgress(),
      progress: {
        ...defaultState.progress,
        ...(parsed.progress || {})
      },
      mistakes: parsed.mistakes || {},
      streak: currentStreak,
      bestStreak: bestStreak,
      lastActiveDate: today,
      lastQuizCompletedDate: lastCompletedDate,
      completedQuizDates: completedDates,
      xp: parsed.xp || 0,
      unlockedBadges: parsed.unlockedBadges || []
    };
  } catch {
    return getDefaultState();
  }
}

export function recordQuizCompletionAndStreak(prevState: AppState): {
  nextState: AppState;
  isStreakContinued: boolean;
  isNewStreakStarted: boolean;
  newStreakCount: number;
} {
  const today = getTodayDateString();
  const yesterday = getYesterdayDateString();
  const alreadyCompletedToday = prevState.lastQuizCompletedDate === today;

  let newStreak = prevState.streak;
  let isStreakContinued = false;
  let isNewStreakStarted = false;

  if (alreadyCompletedToday) {
    // Already counted today
    newStreak = Math.max(1, prevState.streak);
  } else if (prevState.lastQuizCompletedDate === yesterday && prevState.streak > 0) {
    // Consecutive day completion! Streak continues!
    newStreak = prevState.streak + 1;
    isStreakContinued = true;
  } else {
    // Starting a new streak (either from 0 or broken)
    newStreak = 1;
    isNewStreakStarted = true;
  }

  const newBestStreak = Math.max(newStreak, prevState.bestStreak || 0);
  const updatedCompletedDates = Array.from(new Set([...(prevState.completedQuizDates || []), today]));

  // Unlock badge if streak milestones reached
  const unlockedBadges = [...(prevState.unlockedBadges || [])];
  if (newStreak >= 3 && !unlockedBadges.includes('three_streak')) {
    unlockedBadges.push('three_streak');
  }

  return {
    nextState: {
      ...prevState,
      streak: newStreak,
      bestStreak: newBestStreak,
      lastQuizCompletedDate: today,
      completedQuizDates: updatedCompletedDates,
      unlockedBadges
    },
    isStreakContinued,
    isNewStreakStarted,
    newStreakCount: newStreak
  };
}

export function saveAppState(state: AppState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // LocalStorage quota or privacy mode error
  }
}

export function recordMistake(
  mistakes: Record<string, UserMistake>,
  questionId: string,
  selectedOption: number
): Record<string, UserMistake> {
  const existing = mistakes[questionId];
  return {
    ...mistakes,
    [questionId]: {
      questionId,
      failedAt: Date.now(),
      timesFailed: (existing?.timesFailed || 0) + 1,
      timesCorrect: existing?.timesCorrect || 0,
      lastSelectedOption: selectedOption
    }
  };
}

export function recordMistakeCorrect(
  mistakes: Record<string, UserMistake>,
  questionId: string
): Record<string, UserMistake> {
  const existing = mistakes[questionId];
  if (!existing) return mistakes;
  
  const updatedTimesCorrect = existing.timesCorrect + 1;
  // If answered correctly at least 2 times, it can be marked as cleared/mastered
  if (updatedTimesCorrect >= 2) {
    const copy = { ...mistakes };
    delete copy[questionId];
    return copy;
  }

  return {
    ...mistakes,
    [questionId]: {
      ...existing,
      timesCorrect: updatedTimesCorrect
    }
  };
}
