export type DayOfWeek = 
  | 'astelehena' 
  | 'asteartea' 
  | 'asteazkena' 
  | 'osteguna' 
  | 'ostirala' 
  | 'larunbata' 
  | 'igandea';

export interface ExplanationDetails {
  rule: string;            // Arau nagusia
  whyCorrect: string;      // Zergatik den zuzena aukera hori
  whyWrongOptions?: {
    letter: 'A' | 'B' | 'C' | 'D';
    reason: string;
  }[];
  tip: string;             // Gogoratzeko trikimailua edo oharra
}

export interface Question {
  id: string;
  day?: DayOfWeek;
  order: number;           // 1 to 20
  prompt: string;          // Question text
  options: [string, string, string, string]; // Exactly 4 options A, B, C, D
  correctIndex: number;    // 0, 1, 2, or 3
  category: string;        // E.g. "Aditzak", "Deklinabidea", "Hiztegia", etc.
  level: 'B1' | 'B2' | 'C1';
  explanation: ExplanationDetails;
}

export interface UserMistake {
  questionId: string;
  failedAt: number;        // timestamp
  timesFailed: number;
  timesCorrect: number;    // times answered correctly in review mode
  lastSelectedOption: number;
}

export interface DayProgress {
  day?: DayOfWeek;
  completed: boolean;
  score: number;
  total: number;
  answers: Record<number, number>; // question index (0-19) -> selected option (0-3)
  completedAt?: number;
}

export interface AppState {
  currentQuestionIndex: number; // 0 to 19
  currentDay?: DayOfWeek;
  dailyProgress: DayProgress;
  progress: Record<DayOfWeek, DayProgress>; // preserved for storage compatibility
  mistakes: Record<string, UserMistake>;
  streak: number; // consecutive days with a completed full quiz
  bestStreak: number;
  lastActiveDate: string; // YYYY-MM-DD
  lastQuizCompletedDate: string | null; // YYYY-MM-DD when full quiz was last completed
  completedQuizDates: string[]; // List of YYYY-MM-DD dates where a full quiz was finished
  soundEnabled?: boolean;
  ttsEnabled?: boolean;
  xp: number;
  unlockedBadges: string[];
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  town: string;
  avatar: string;
  xp: number;
  streak: number;
  isCurrentUser?: boolean;
  rank?: number;
  badge?: string;
}
