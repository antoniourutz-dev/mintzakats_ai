import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { QuestionCard } from './components/QuestionCard';
import { MistakesReviewModal } from './components/MistakesReviewModal';
import { DailyCompletionModal } from './components/DailyCompletionModal';
import { StatsModal } from './components/StatsModal';
import { StreakModal } from './components/StreakModal';
import { StreakCelebration } from './components/StreakCelebration';
import { Leaderboard } from './components/Leaderboard';
import { AppState, DayProgress } from './types';
import { getDailyMixedQuestions } from './data';
import {
  loadAppState,
  saveAppState,
  recordMistake,
  recordMistakeCorrect,
  recordQuizCompletionAndStreak,
  getTodayDateString,
} from './utils/storage';
import { BookOpen, Trophy, RotateCcw } from 'lucide-react';

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

  // Save state whenever it updates
  useEffect(() => {
    saveAppState(state);
  }, [state]);

  // Mixed 20 questions for today's daily challenge (prepared for Supabase integration)
  const todayQuestions = useMemo(() => {
    return getDailyMixedQuestions(state.lastActiveDate || getTodayDateString());
  }, [state.lastActiveDate]);

  const currentQuestion = todayQuestions[state.currentQuestionIndex] || todayQuestions[0];
  
  // Progress tracker for the current 20-question mixed challenge
  const dailyProgress: DayProgress = state.dailyProgress || {
    completed: false,
    score: 0,
    total: 20,
    answers: {}
  };

  const currentAnswer = dailyProgress.answers?.[state.currentQuestionIndex];
  const hasAnsweredCurrent = typeof currentAnswer === 'number';

  // Count mistakes made in today's 20 questions
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
        total: 20
      }
    }));
  };

  // Consecutive Next Question logic (Egunean Behin style: sequential without skipping)
  const handleNextQuestion = () => {
    if (state.currentQuestionIndex < 19) {
      setState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1
      }));
    } else {
      // Finished all 20 questions!
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

  // Reset/retry current challenge
  const handleRetryChallenge = () => {
    setIsCompletionModalOpen(false);
    setState(prev => ({
      ...prev,
      currentQuestionIndex: 0,
      dailyProgress: {
        completed: false,
        score: 0,
        total: 20,
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
  const progressPercent = Math.min(100, Math.round((answeredCount / 20) * 100));

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

      {/* Egunean Behin Daily Quiz Progress Bar (Compact & Zero Scroll) */}
      <div className="w-full bg-white border-b-2 border-black py-2 px-3 sm:px-4 shadow-[0_1px_0_0_#000000]">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-2">
          {/* Daily Challenge Info */}
          <div className="flex items-center gap-2 min-w-0">
            <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider bg-yellow-300 text-black rounded border border-black shadow-[1px_1px_0_0_#000] shrink-0">
              Eguneko Erronka
            </span>
          </div>

          {/* Sequential Question Progress & Live Score */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <span className="text-xs sm:text-sm font-black text-neutral-900">
              <span className="text-neutral-500 font-bold">Galdera </span>
              {state.currentQuestionIndex + 1}
              <span className="text-neutral-400 font-bold">/20</span>
            </span>

            <span className="px-2 py-0.5 bg-emerald-100 border border-emerald-400 rounded text-emerald-950 font-black text-xs">
              ✓ {dailyProgress.score || 0}
            </span>
          </div>
        </div>

        {/* Linear Progress Bar across the 20 questions */}
        <div className="max-w-3xl mx-auto mt-1.5 h-1.5 bg-neutral-200 rounded-full overflow-hidden border border-neutral-300">
          <div
            className="h-full bg-emerald-500 transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Main Consecutive Question Experience (Zero Scroll) */}
      <main className="flex-1 flex flex-col justify-start">
        {dailyProgress.completed && state.currentQuestionIndex >= 19 && hasAnsweredCurrent ? (
          /* Daily Completed Summary Card */
          <div className="w-full max-w-xl mx-auto px-4 py-8 text-center animate-in zoom-in-95 duration-200">
            <div className="p-6 bg-white rounded-2xl border-4 border-black shadow-[6px_6px_0_0_#000]">
              <div className="w-16 h-16 bg-yellow-300 border-2 border-black rounded-2xl shadow-[3px_3px_0_0_#000] mx-auto flex items-center justify-center text-3xl mb-4">
                🎉
              </div>
              <h2 className="text-2xl font-black text-neutral-950 mb-1">
                Gaurko Erronka Osatuta!
              </h2>
              <p className="text-sm font-bold text-neutral-600 mb-4">
                20 galderak segidan erantzun dituzu. Bikain egina!
              </p>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="p-3 bg-neutral-50 border-2 border-black rounded-xl text-center shadow-[2px_2px_0_0_#000]">
                  <span className="text-[10px] font-black uppercase text-neutral-500 block">Puntuazioa</span>
                  <span className="text-xl font-black text-emerald-700">{dailyProgress.score} / 20</span>
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

              <div className="mt-4 pt-4 border-t border-neutral-200 flex items-center justify-center gap-4 text-xs font-bold">
                <button
                  onClick={handleRetryChallenge}
                  className="text-neutral-500 hover:text-black flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Erronka berregin</span>
                </button>

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
            isLastQuestion={state.currentQuestionIndex === 19}
            onOpenMistakesNotebook={() => setIsMistakesModalOpen(true)}
          />
        )}
      </main>

      {/* Leaderboard Modal (Top XP earners among friends and global learners) */}
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
