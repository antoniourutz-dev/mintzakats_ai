import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { QuestionCard } from './components/QuestionCard';
import { MistakesReviewModal } from './components/MistakesReviewModal';
import { DailyCompletionModal } from './components/DailyCompletionModal';
import { StatsModal } from './components/StatsModal';
import { StreakModal } from './components/StreakModal';
import { StreakCelebration } from './components/StreakCelebration';
import { Leaderboard } from './components/Leaderboard';
import { AppState, DayProgress, Question } from './types';
import { getDailyMixedQuestions } from './data';
import {
  getDailyQuestions,
  fetchAllSupabaseQuestions,
  getCachedSupabaseQuestions,
  submitDailyScoreToCloud,
  checkSupabaseStatus
} from './services/supabase';
import {
  loadAppState,
  saveAppState,
  recordMistake,
  recordMistakeCorrect,
  recordQuizCompletionAndStreak,
  getTodayDateString,
} from './utils/storage';
import { BookOpen, Trophy, RotateCcw, Cloud, Sparkles, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [state, setState] = useState<AppState>(() => loadAppState());
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isMistakesModalOpen, setIsMistakesModalOpen] = useState(false);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [isCompletionModalOpen, setIsCompletionModalOpen] = useState(false);
  const [isStreakModalOpen, setIsStreakModalOpen] = useState(false);
  const [isStreakCelebrationOpen, setIsStreakCelebrationOpen] = useState(false);
  const [isCelebratingStreak, setIsCelebratingStreak] = useState(false);
  const [streakCelebrationCount, setStreakCelebrationCount] = useState(1);

  // Supabase states & mode
  const [quizMode, setQuizMode] = useState<'daily20' | 'all'>('daily20');
  const [isSupabaseLoading, setIsSupabaseLoading] = useState(false);
  const [supabaseConnected, setSupabaseConnected] = useState<boolean>(true);
  const [supabaseTotalQuestions, setSupabaseTotalQuestions] = useState<number>(141);

  // Save state whenever it updates
  useEffect(() => {
    saveAppState(state);
  }, [state]);

  const todayDateStr = state.lastActiveDate || getTodayDateString();

  // Initialize questions: prioritize cached Supabase questions for instant zero-latency load
  const [todayQuestions, setTodayQuestions] = useState<Question[]>(() => {
    const cached = getCachedSupabaseQuestions();
    if (cached && cached.length >= 20) {
      // Deterministic selection from cached Supabase questions
      const seedStr = todayDateStr;
      let hash = 0;
      for (let i = 0; i < seedStr.length; i++) {
        hash = (hash << 5) - hash + seedStr.charCodeAt(i);
        hash |= 0;
      }
      const picked = new Set<number>();
      const res: Question[] = [];
      let step = 0;
      while (res.length < 20 && step < cached.length * 4) {
        const idx = Math.abs(hash + step * 7) % cached.length;
        if (!picked.has(idx)) {
          picked.add(idx);
          res.push({ ...cached[idx], order: res.length + 1 });
        }
        step++;
      }
      return res;
    }
    return getDailyMixedQuestions(todayDateStr);
  });

  // Load questions dynamically from Supabase
  const loadQuestionsFromSupabase = useCallback(async (mode: 'daily20' | 'all') => {
    setIsSupabaseLoading(true);
    try {
      const allQ = await fetchAllSupabaseQuestions();
      if (allQ && allQ.length > 0) {
        setSupabaseTotalQuestions(allQ.length);
        setSupabaseConnected(true);

        if (mode === 'all') {
          setTodayQuestions(allQ.map((q, i) => ({ ...q, order: i + 1 })));
        } else {
          const daily = await getDailyQuestions(todayDateStr, 'daily20');
          setTodayQuestions(daily);
        }
      } else {
        const status = await checkSupabaseStatus();
        setSupabaseConnected(status.connected);
        if (status.totalCount > 0) {
          setSupabaseTotalQuestions(status.totalCount);
        }
      }
    } catch {
      setSupabaseConnected(false);
    } finally {
      setIsSupabaseLoading(false);
    }
  }, [todayDateStr]);

  // Initial fetch and mode change listener
  useEffect(() => {
    loadQuestionsFromSupabase(quizMode);
  }, [quizMode, loadQuestionsFromSupabase]);

  const totalQuestionsCount = todayQuestions.length || 20;
  const currentQuestion = todayQuestions[state.currentQuestionIndex] || todayQuestions[0];
  
  // Progress tracker for current session
  const dailyProgress: DayProgress = state.dailyProgress || {
    completed: false,
    score: 0,
    total: totalQuestionsCount,
    answers: {}
  };

  const currentAnswer = dailyProgress.answers?.[state.currentQuestionIndex];
  const hasAnsweredCurrent = typeof currentAnswer === 'number';

  // Count mistakes made in today's active questions
  const todaysMistakesCount = Object.keys(dailyProgress.answers || {}).filter(qIdxStr => {
    const qIdx = parseInt(qIdxStr, 10);
    const q = todayQuestions[qIdx];
    const ans = dailyProgress.answers[qIdx];
    return q && ans !== q.correctIndex;
  }).length;

  const totalPendingMistakes = Object.keys(state.mistakes || {}).length;

  // Handle selecting an option
  const handleSelectOption = (optionIndex: number) => {
    if (hasAnsweredCurrent) return;

    const isCorrect = optionIndex === currentQuestion.correctIndex;
    const newAnswers = {
      ...(dailyProgress.answers || {}),
      [state.currentQuestionIndex]: optionIndex
    };

    let newScore = dailyProgress.score || 0;
    if (isCorrect) {
      newScore += 1;
    }

    let updatedMistakes = state.mistakes;
    if (!isCorrect) {
      updatedMistakes = recordMistake(state.mistakes, currentQuestion.id, optionIndex);
    }

    const newXp = state.xp + (isCorrect ? 15 : 5);

    setState(prev => ({
      ...prev,
      xp: newXp,
      mistakes: updatedMistakes,
      dailyProgress: {
        ...dailyProgress,
        answers: newAnswers,
        score: newScore,
        total: totalQuestionsCount
      }
    }));
  };

  // Consecutive Next Question logic (sequential without skipping)
  const handleNextQuestion = () => {
    if (state.currentQuestionIndex < totalQuestionsCount - 1) {
      setState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1
      }));
    } else {
      // Finished all questions in this session!
      let streakContinued = false;
      let newStreakCount = 1;

      setState(prev => {
        const stateWithQuizFinished: AppState = {
          ...prev,
          xp: prev.xp + 50, // completion bonus
          dailyProgress: {
            ...prev.dailyProgress,
            completed: true,
            completedAt: Date.now()
          }
        };

        const result = recordQuizCompletionAndStreak(stateWithQuizFinished);
        streakContinued = result.isStreakContinued;
        newStreakCount = result.newStreakCount;
        return result.nextState;
      });

      if (streakContinued) {
        setStreakCelebrationCount(newStreakCount);
        setIsCelebratingStreak(true);
        setIsStreakCelebrationOpen(true);
        setTimeout(() => setIsCelebratingStreak(false), 3500);
      }

      // Background cloud sync if Supabase configured
      submitDailyScoreToCloud({
        playerId: 'local_player',
        playerName: 'Zu (Gaurko jokalaria)',
        score: (dailyProgress.score || 0) + (currentAnswer === currentQuestion.correctIndex ? 1 : 0),
        streak: newStreakCount,
        xp: state.xp + 50
      }).catch(() => {});

      setIsCompletionModalOpen(true);
    }
  };

  const handleTriggerTestCelebration = () => {
    setStreakCelebrationCount(Math.max(1, state.streak));
    setIsCelebratingStreak(true);
    setIsStreakCelebrationOpen(true);
    setTimeout(() => setIsCelebratingStreak(false), 3500);
  };

  const handleSimulateContinueStreak = () => {
    const today = getTodayDateString();
    const nextStreak = (state.streak || 0) + 1;
    setState(prev => {
      const nextBest = Math.max(nextStreak, prev.bestStreak || 0);
      return {
        ...prev,
        streak: nextStreak,
        bestStreak: nextBest,
        lastQuizCompletedDate: today,
        completedQuizDates: Array.from(new Set([...(prev.completedQuizDates || []), today]))
      };
    });
    setStreakCelebrationCount(nextStreak);
    setIsCelebratingStreak(true);
    setIsStreakCelebrationOpen(true);
    setTimeout(() => setIsCelebratingStreak(false), 3500);
  };

  // Reset/retry current challenge with fresh state
  const handleRetryChallenge = () => {
    setIsCompletionModalOpen(false);
    setState(prev => ({
      ...prev,
      currentQuestionIndex: 0,
      dailyProgress: {
        completed: false,
        score: 0,
        total: totalQuestionsCount,
        answers: {}
      }
    }));
  };

  const handleSwitchMode = (newMode: 'daily20' | 'all') => {
    setQuizMode(newMode);
    setIsCompletionModalOpen(false);
    setState(prev => ({
      ...prev,
      currentQuestionIndex: 0,
      dailyProgress: {
        completed: false,
        score: 0,
        total: newMode === 'all' ? supabaseTotalQuestions : 20,
        answers: {}
      }
    }));
  };

  // Correct a mistake in the review notebook
  const handleCorrectMistake = (questionId: string) => {
    setState(prev => ({
      ...prev,
      xp: prev.xp + 20,
      mistakes: recordMistakeCorrect(prev.mistakes, questionId)
    }));
  };

  const handleFailMistakeAgain = (questionId: string) => {
    setState(prev => ({
      ...prev,
      mistakes: recordMistake(prev.mistakes, questionId, -1)
    }));
  };

  // Calculate percentage of questions answered for the progress bar
  const answeredCount = Object.keys(dailyProgress.answers || {}).length;
  const progressPercent = Math.min(100, Math.round((answeredCount / totalQuestionsCount) * 100));

  const isQuizCompleted = dailyProgress.completed && (state.currentQuestionIndex >= totalQuestionsCount - 1) && hasAnsweredCurrent;

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-neutral-900 flex flex-col selection:bg-yellow-300 selection:text-black">
      {/* Top Navigation & App Bar */}
      <Header
        state={state}
        pendingMistakesCount={totalPendingMistakes}
        onOpenMistakesModal={() => setIsMistakesModalOpen(true)}
        onOpenStatsModal={() => setIsStatsModalOpen(true)}
        onOpenStreakModal={() => setIsStreakModalOpen(true)}
        onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
        isCelebratingStreak={isCelebratingStreak}
      />

      {/* Supabase Live Status Bar & Mode Switcher */}
      <div className="w-full bg-sky-50 border-b-2 border-black py-1.5 px-3 sm:px-4 shadow-[0_1px_0_0_#000]">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-2 flex-wrap">
          {/* Supabase Realtime Indicator */}
          <div className="flex items-center gap-2 text-xs">
            <span className="flex h-2.5 w-2.5 relative">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${supabaseConnected ? 'bg-emerald-400' : 'bg-amber-400'} opacity-75`}></span>
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${supabaseConnected ? 'bg-emerald-500' : 'bg-amber-500'} border border-black`}></span>
            </span>
            <span className="font-extrabold text-sky-950 flex items-center gap-1.5">
              <span>Supabase:</span>
              <span className="px-1.5 py-0.2 bg-white border border-sky-300 rounded font-black text-emerald-800 text-[11px] shadow-sm">
                {supabaseTotalQuestions} galdera kargatuta
              </span>
            </span>
          </div>

          {/* Mode Switcher & Reload Action */}
          <div className="flex items-center gap-1.5 sm:gap-2 text-xs">
            <div className="bg-sky-100 p-0.5 rounded-lg border-2 border-black flex items-center shadow-[1px_1px_0_0_#000]">
              <button
                onClick={() => handleSwitchMode('daily20')}
                className={`px-2.5 py-1 rounded text-xs font-black transition-all cursor-pointer ${
                  quizMode === 'daily20'
                    ? 'bg-yellow-300 text-black border border-black shadow-[1px_1px_0_0_#000]'
                    : 'text-sky-900 hover:text-black'
                }`}
              >
                Gaurko 20ak
              </button>
              <button
                onClick={() => handleSwitchMode('all')}
                className={`px-2.5 py-1 rounded text-xs font-black transition-all cursor-pointer ${
                  quizMode === 'all'
                    ? 'bg-yellow-300 text-black border border-black shadow-[1px_1px_0_0_#000]'
                    : 'text-sky-900 hover:text-black'
                }`}
              >
                Guztiak ({supabaseTotalQuestions})
              </button>
            </div>

            <button
              onClick={() => {
                loadQuestionsFromSupabase(quizMode);
                handleRetryChallenge();
              }}
              disabled={isSupabaseLoading}
              title="Birkargatu Supabaseko galderak"
              className="px-2.5 py-1 bg-white hover:bg-neutral-100 text-neutral-900 border-2 border-black rounded-lg font-black text-xs flex items-center gap-1 shadow-[1px_1px_0_0_#000] cursor-pointer disabled:opacity-50 active:translate-x-[1px] active:translate-y-[1px]"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isSupabaseLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Birkargatu</span>
            </button>
          </div>
        </div>
      </div>

      {/* Daily Quiz Progress Bar (Compact & Zero Scroll) */}
      <div className="w-full bg-white border-b-2 border-black py-2 px-3 sm:px-4 shadow-[0_1px_0_0_#000000]">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-2">
          {/* Challenge Mode Label */}
          <div className="flex items-center gap-2 min-w-0">
            <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider bg-yellow-300 text-black rounded border border-black shadow-[1px_1px_0_0_#000] shrink-0">
              {quizMode === 'all' ? 'Supabase Praktika Librea' : 'Eguneko Erronka'}
            </span>
          </div>

          {/* Sequential Question Progress & Live Score */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <span className="text-xs sm:text-sm font-black text-neutral-900">
              <span className="text-neutral-500 font-bold">Galdera </span>
              {state.currentQuestionIndex + 1}
              <span className="text-neutral-400 font-bold">/{totalQuestionsCount}</span>
            </span>

            <span className="px-2 py-0.5 bg-emerald-100 border border-emerald-400 rounded text-emerald-950 font-black text-xs">
              ✓ {dailyProgress.score || 0}
            </span>
          </div>
        </div>

        {/* Linear Progress Bar */}
        <div className="max-w-3xl mx-auto mt-1.5 h-1.5 bg-neutral-200 rounded-full overflow-hidden border border-neutral-300">
          <div
            className="h-full bg-emerald-500 transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Main Question Experience */}
      <main className="flex-1 flex flex-col justify-start">
        {isQuizCompleted ? (
          /* Completed Summary Card */
          <div className="w-full max-w-xl mx-auto px-4 py-8 text-center animate-in zoom-in-95 duration-200">
            <div className="p-6 bg-white rounded-2xl border-4 border-black shadow-[6px_6px_0_0_#000]">
              <div className="w-16 h-16 bg-yellow-300 border-2 border-black rounded-2xl shadow-[3px_3px_0_0_#000] mx-auto flex items-center justify-center text-3xl mb-4">
                🎉
              </div>
              <h2 className="text-2xl font-black text-neutral-950 mb-1">
                {quizMode === 'all' ? 'Galdera Guztiak Amaituta!' : 'Gaurko Erronka Osatuta!'}
              </h2>
              <p className="text-sm font-bold text-neutral-600 mb-4">
                {totalQuestionsCount} galderak segidan erantzun dituzu. Bikain egina!
              </p>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="p-3 bg-neutral-50 border-2 border-black rounded-xl text-center shadow-[2px_2px_0_0_#000]">
                  <span className="text-[10px] font-black uppercase text-neutral-500 block">Puntuazioa</span>
                  <span className="text-xl font-black text-emerald-700">{dailyProgress.score} / {totalQuestionsCount}</span>
                </div>
                <div className="p-3 bg-amber-50 border-2 border-black rounded-xl text-center shadow-[2px_2px_0_0_#000]">
                  <span className="text-[10px] font-black uppercase text-amber-700 block">Segida</span>
                  <span className="text-xl font-black text-orange-600">🔥 {state.streak || 1} egun</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5">
                <button
                  onClick={() => setIsCompletionModalOpen(true)}
                  className="flex-1 py-2.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-white border-2 border-black rounded-xl font-black text-sm shadow-[3px_3px_0_0_#000] cursor-pointer transition-all"
                >
                  Laburpen Osoa Ikusi
                </button>

                <button
                  onClick={() => setIsLeaderboardOpen(true)}
                  className="flex-1 py-2.5 px-4 bg-yellow-300 hover:bg-yellow-200 text-neutral-950 border-2 border-black rounded-xl font-black text-sm shadow-[3px_3px_0_0_#000] flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                >
                  <Trophy className="w-4 h-4" />
                  <span>Sailkapena</span>
                </button>
              </div>

              <div className="mt-4 pt-4 border-t border-neutral-200 flex flex-wrap items-center justify-center gap-4 text-xs font-bold">
                <button
                  onClick={handleRetryChallenge}
                  className="text-emerald-700 hover:text-emerald-800 flex items-center gap-1 font-black cursor-pointer bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-300"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Erronka berriro hasi</span>
                </button>

                {quizMode === 'daily20' && (
                  <button
                    onClick={() => handleSwitchMode('all')}
                    className="text-sky-800 hover:text-sky-950 flex items-center gap-1 font-black cursor-pointer bg-sky-50 px-3 py-1.5 rounded-lg border border-sky-300"
                  >
                    <Cloud className="w-3.5 h-3.5" />
                    <span>Supabase 141 galderak praktikatu</span>
                  </button>
                )}

                {totalPendingMistakes > 0 && (
                  <button
                    onClick={() => setIsMistakesModalOpen(true)}
                    className="text-rose-600 hover:text-rose-700 flex items-center gap-1 font-black cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{totalPendingMistakes} akats berrikusi</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Consecutive Question Card */
          <QuestionCard
            question={currentQuestion}
            selectedOption={currentAnswer ?? null}
            hasAnswered={hasAnsweredCurrent}
            onSelectOption={handleSelectOption}
            onNextQuestion={handleNextQuestion}
            isLastQuestion={state.currentQuestionIndex >= totalQuestionsCount - 1}
            onOpenMistakesNotebook={() => setIsMistakesModalOpen(true)}
          />
        )}
      </main>

      {/* Leaderboard Modal */}
      <Leaderboard
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
        state={state}
      />

      {/* Mistakes Review Notebook Modal ("Akatsen Koadernoa") */}
      <MistakesReviewModal
        isOpen={isMistakesModalOpen}
        onClose={() => setIsMistakesModalOpen(false)}
        mistakes={state.mistakes}
        onCorrectMistake={handleCorrectMistake}
        onFailMistakeAgain={handleFailMistakeAgain}
      />

      {/* Daily Completion Modal */}
      <DailyCompletionModal
        isOpen={isCompletionModalOpen}
        progress={dailyProgress}
        mistakesCountToday={todaysMistakesCount}
        onClose={() => setIsCompletionModalOpen(false)}
        onOpenMistakes={() => setIsMistakesModalOpen(true)}
        onRetryDay={handleRetryChallenge}
      />

      {/* Stats & Badges Modal */}
      <StatsModal
        isOpen={isStatsModalOpen}
        onClose={() => setIsStatsModalOpen(false)}
        state={state}
      />

      {/* Daily Streak Info & Milestone Tracker Modal */}
      <StreakModal
        isOpen={isStreakModalOpen}
        onClose={() => setIsStreakModalOpen(false)}
        state={state}
        onTriggerTestCelebration={handleTriggerTestCelebration}
        onSimulateContinueStreak={handleSimulateContinueStreak}
      />

      {/* Streak Continuation Celebration Animation */}
      {isStreakCelebrationOpen && (
        <StreakCelebration
          streakCount={streakCelebrationCount}
          onClose={() => setIsStreakCelebrationOpen(false)}
        />
      )}
    </div>
  );
}
