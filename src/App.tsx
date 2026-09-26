import React, { useState, useEffect } from 'react';
import { AuthScreen } from './components/AuthScreen';
import { HomeScreen } from './components/HomeScreen';
import { CountdownScreen } from './components/CountdownScreen';
import { QuestionCard } from './components/QuestionCard';
import { QuestionReviewItem } from './components/GameReviewModal';
import { AppState, DayProgress, Question } from './types';
import {
  supabase,
  getCurrentStudent,
  logoutStudent,
  getToday7DayBlockQuestions,
  markGameInitiatedInCloud,
  checkGameInitiatedOrPlayedToday,
  saveGameResultToCloud,
  loadPlayerCloudState,
  updatePlayerMistakesInCloud,
  calculateGameScore,
  calculateStreakFromDates,
  isTeacherAdmin,
  fetchTeacherCycleStartDateCloud,
  PlayerScoreRecord,
} from './services/supabase';
import { getWeekBlockInfo, WeekBlockInfo } from './utils/weekCycle';
import {
  loadAppState,
  getTodayDateString,
} from './utils/storage';
import { Trophy, ArrowLeft, Zap, Flame, Award, BookOpen, ShieldCheck } from 'lucide-react';
import { playCorrectSound, playWrongSound } from './utils/audio';

// Code-splitting heavy modals to optimize initial bundle
const LeaderboardModal = React.lazy(() =>
  import('./components/LeaderboardModal').then(m => ({ default: m.LeaderboardModal }))
);
const GameReviewModal = React.lazy(() =>
  import('./components/GameReviewModal').then(m => ({ default: m.GameReviewModal }))
);
const PlayerProfileModal = React.lazy(() =>
  import('./components/PlayerProfileModal').then(m => ({ default: m.PlayerProfileModal }))
);
const TeacherAdminModal = React.lazy(() =>
  import('./components/TeacherAdminModal').then(m => ({ default: m.TeacherAdminModal }))
);

type ViewMode = 'auth' | 'home' | 'countdown' | 'playing' | 'completed';

function buildReviewItems(
  questions: Question[],
  answersMap: Record<number, number>,
  cloudMistakes?: any[]
): QuestionReviewItem[] {
  if (!questions || questions.length === 0) return [];

  // If cloudMistakes is already a 20-item review list:
  if (Array.isArray(cloudMistakes) && cloudMistakes.length >= questions.length && cloudMistakes[0]?.question) {
    return cloudMistakes.map((it, idx) => ({
      questionIndex: typeof it.questionIndex === 'number' ? it.questionIndex : idx,
      question: it.question,
      userAnswerIndex: typeof it.userAnswerIndex === 'number' ? it.userAnswerIndex : -1,
      isCorrect: Boolean(it.isCorrect),
      isCleaned: Boolean(it.isCleaned),
    }));
  }

  // Otherwise construct from questions & answers
  const mistakeIds = new Set(
    Array.isArray(cloudMistakes)
      ? cloudMistakes.map(m => m.question?.id || m.id)
      : []
  );

  return questions.map((q, idx) => {
    const userAns = answersMap[idx];
    const isAnswered = typeof userAns === 'number';
    const isFailedInMistakes = mistakeIds.has(q.id);

    let isCorrect: boolean;
    let chosenAns: number;

    if (isAnswered) {
      chosenAns = userAns;
      isCorrect = userAns === q.correctIndex;
    } else if (isFailedInMistakes) {
      const match = cloudMistakes?.find(m => (m.question?.id || m.id) === q.id);
      chosenAns = match?.userAnswerIndex ?? ((q.correctIndex + 1) % 4);
      isCorrect = false;
    } else {
      chosenAns = q.correctIndex;
      isCorrect = true;
    }

    return {
      questionIndex: idx,
      question: q,
      userAnswerIndex: chosenAns,
      isCorrect,
      isCleaned: false,
    };
  });
}

export default function App() {
  const [currentStudentEmail, setCurrentStudentEmail] = useState<string | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('home');

  const [state, setState] = useState<AppState>(() => loadAppState());
  const [blockInfo, setBlockInfo] = useState<WeekBlockInfo>(() => getWeekBlockInfo());
  const [todayQuestions, setTodayQuestions] = useState<Question[]>([]);

  // Cloud State per player (synced from Supabase)
  const [playerStreak, setPlayerStreak] = useState<number>(0);
  const [playerCompletedDates, setPlayerCompletedDates] = useState<string[]>([]);
  const [lastGameMistakes, setLastGameMistakes] = useState<any[]>([]);
  const [todayReviewItems, setTodayReviewItems] = useState<QuestionReviewItem[]>([]);
  const [hasStartedOrPlayedToday, setHasStartedOrPlayedToday] = useState<boolean>(false);
  const [todayRecord, setTodayRecord] = useState<PlayerScoreRecord | null>(null);

  // Background timer (measured silently during gameplay, only shown on completion)
  const [startTime, setStartTime] = useState<number | null>(null);
  const [finalTimeSeconds, setFinalTimeSeconds] = useState(0);

  // Modals
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isProfileHistoryOpen, setIsProfileHistoryOpen] = useState(false);
  const [isTeacherAdminOpen, setIsTeacherAdminOpen] = useState(false);

  const isAdmin = isTeacherAdmin(currentStudentEmail);

  const studentName = currentStudentEmail
    ? currentStudentEmail.split('@')[0]
    : 'Ikaslea';

  const todayDateStr = getTodayDateString();

  // 1. Check Supabase session on startup
  useEffect(() => {
    let isMounted = true;

    getCurrentStudent().then(user => {
      if (isMounted) {
        if (user?.email) {
          setCurrentStudentEmail(user.email);
        }
        setIsAuthChecking(false);
      }
    }).catch(() => {
      if (isMounted) setIsAuthChecking(false);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isMounted) {
        if (session?.user?.email) {
          setCurrentStudentEmail(session.user.email);
        } else {
          setCurrentStudentEmail(null);
        }
      }
    });

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  // 2. Load configured cycle start date from cloud, then load today's questions
  useEffect(() => {
    let isCurrent = true;

    fetchTeacherCycleStartDateCloud()
      .catch(() => null)
      .then(() => {
        getToday7DayBlockQuestions().then(res => {
          if (isCurrent) {
            setTodayQuestions(res.questions);
            setBlockInfo(res.dayInfo);
          }
        }).catch(() => {});
      });

    return () => {
      isCurrent = false;
    };
  }, []);

  // 3. Sync player's cloud data from Supabase whenever student is logged in
  useEffect(() => {
    if (!currentStudentEmail) return;

    let isMounted = true;
    const pName = currentStudentEmail.split('@')[0];

    loadPlayerCloudState(pName, todayDateStr).then(cloudState => {
      if (isMounted && cloudState) {
        setPlayerStreak(cloudState.streak);
        setPlayerCompletedDates(cloudState.playedDates || []);
        if (Array.isArray(cloudState.lastGameMistakes)) {
          setLastGameMistakes(cloudState.lastGameMistakes);
        }
      }
    }).catch(() => {});

    checkGameInitiatedOrPlayedToday(pName, todayDateStr).then(res => {
      if (isMounted) {
        setHasStartedOrPlayedToday(res.hasPlayed);
        if (res.record) {
          setTodayRecord(res.record);
        }
      }
    }).catch(() => {});

    return () => {
      isMounted = false;
    };
  }, [currentStudentEmail, todayDateStr, viewMode]);

  // 4. Reconstruct / sync 20-item review whenever todayQuestions or lastGameMistakes changes
  useEffect(() => {
    if (todayQuestions.length > 0) {
      const items = buildReviewItems(
        todayQuestions,
        state.dailyProgress?.answers || {},
        lastGameMistakes
      );
      setTodayReviewItems(items);
    }
  }, [todayQuestions, lastGameMistakes]);

  const totalQuestionsCount = todayQuestions.length || 20;
  const currentQuestion = todayQuestions[state.currentQuestionIndex] || todayQuestions[0];

  const dailyProgress: DayProgress = state.dailyProgress || {
    completed: false,
    score: 0,
    total: totalQuestionsCount,
    answers: {},
  };

  const currentAnswer = dailyProgress.answers?.[state.currentQuestionIndex];
  const hasAnsweredCurrent = typeof currentAnswer === 'number';

  // Handle Login
  const handleLoginSuccess = (email: string) => {
    setCurrentStudentEmail(email);
    setViewMode('home');
  };

  // Handle Logout
  const handleLogout = async () => {
    await logoutStudent();
    setCurrentStudentEmail(null);
    setHasStartedOrPlayedToday(false);
    setTodayRecord(null);
    setViewMode('auth');
  };

  // Trigger Start Game (Cloud Lock)
  const handleStartGameClick = async () => {
    if (!isAdmin) {
      setHasStartedOrPlayedToday(true);
      await markGameInitiatedInCloud(
        studentName,
        studentName,
        todayDateStr,
        blockInfo.weekMondayDateStr
      );
    }

    setLastGameMistakes([]);
    setTodayReviewItems([]);

    setState(prev => ({
      ...prev,
      currentQuestionIndex: 0,
      dailyProgress: {
        completed: false,
        score: 0,
        total: totalQuestionsCount,
        answers: {},
      },
    }));

    setViewMode('countdown');
  };

  // Countdown completed: start background timer and show first question
  const handleCountdownFinished = () => {
    setStartTime(Date.now());
    setViewMode('playing');
  };

  // Option selection
  const handleSelectOption = (optionIndex: number) => {
    if (hasAnsweredCurrent) return;

    const isCorrect = optionIndex === currentQuestion.correctIndex;
    if (isCorrect) {
      playCorrectSound();
    } else {
      playWrongSound();
      setLastGameMistakes(prev => [
        ...prev,
        { question: currentQuestion, userAnswerIndex: optionIndex },
      ]);
    }

    const newAnswers = {
      ...(dailyProgress.answers || {}),
      [state.currentQuestionIndex]: optionIndex,
    };

    let newScore = dailyProgress.score || 0;
    if (isCorrect) {
      newScore += 1;
    }

    setState(prev => ({
      ...prev,
      xp: prev.xp + (isCorrect ? 15 : 0),
      dailyProgress: {
        ...dailyProgress,
        answers: newAnswers,
        score: newScore,
        total: totalQuestionsCount,
      },
    }));
  };

  // Next question
  const handleNextQuestion = async () => {
    if (state.currentQuestionIndex < totalQuestionsCount - 1) {
      setState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
      }));
    } else {
      // Completed all 20 questions!
      const elapsed = startTime ? (Date.now() - startTime) / 1000 : 0;
      setFinalTimeSeconds(elapsed);
      const finalCorrect = dailyProgress.score || 0;

      // 1. Calculate points with speed bonus
      const scoreDetails = calculateGameScore(finalCorrect, elapsed, totalQuestionsCount);

      // 2. Calculate mathematically sound streak:
      const updatedDates = Array.from(new Set([...playerCompletedDates, todayDateStr]));
      const newStreak = calculateStreakFromDates(updatedDates, todayDateStr);
      setPlayerStreak(newStreak);
      setPlayerCompletedDates(updatedDates);

      // 3. Build complete 20 questions review dataset
      const reviewItems: QuestionReviewItem[] = todayQuestions.map((q, idx) => {
        const userAns = dailyProgress.answers?.[idx] ?? -1;
        return {
          questionIndex: idx,
          question: q,
          userAnswerIndex: userAns,
          isCorrect: userAns === q.correctIndex,
          isCleaned: false,
        };
      });
      setTodayReviewItems(reviewItems);

      // 4. Create official score record with total points and correct count
      const gameRecord: PlayerScoreRecord = {
        id: `${studentName.toLowerCase()}_${todayDateStr}`,
        playerId: studentName,
        playerName: studentName,
        dateStr: todayDateStr,
        weekMondayStr: blockInfo.weekMondayDateStr,
        score: scoreDetails.totalPoints,
        correctAnswers: finalCorrect,
        totalQuestions: totalQuestionsCount,
        timeSeconds: elapsed,
        speedBonus: scoreDetails.speedBonus,
        completedAt: Date.now(),
        status: 'completed',
      };

      setTodayRecord(gameRecord);
      if (!isAdmin) {
        setHasStartedOrPlayedToday(true);
      }

      // 5. Save directly to Supabase cloud!
      await saveGameResultToCloud(gameRecord, reviewItems, newStreak);

      setViewMode('completed');
    }
  };

  // Cleaned mistakes callback from GameReviewModal
  const handleUpdateReviewItems = async (updated: QuestionReviewItem[]) => {
    setTodayReviewItems(updated);
    const stillPending = updated.filter(u => !u.isCorrect && !u.isCleaned);
    setLastGameMistakes(stillPending);
    await updatePlayerMistakesInCloud(studentName, updated);
  };

  // Cycle start date changed by teacher
  const handleTeacherStartDateChanged = async () => {
    try {
      const res = await getToday7DayBlockQuestions();
      setTodayQuestions(res.questions);
      setBlockInfo(res.dayInfo);
    } catch (e) {
      console.error('Failed to refresh questions on start date change:', e);
    }
  };

  // Count pending mistakes (uncleaned)
  const pendingMistakesCount = todayReviewItems.filter(u => !u.isCorrect && !u.isCleaned).length;

  // Loading spinner
  if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        </div>
      </div>
    );
  }

  // View 1: AuthScreen
  if (!currentStudentEmail || viewMode === 'auth') {
    return <AuthScreen onLoginSuccess={handleLoginSuccess} />;
  }

  // View 2: Countdown
  if (viewMode === 'countdown') {
    return <CountdownScreen onComplete={handleCountdownFinished} />;
  }

  // View 3: HomeScreen (post-login)
  if (viewMode === 'home') {
    return (
      <>
        <HomeScreen
          studentEmail={currentStudentEmail}
          studentName={studentName}
          blockInfo={blockInfo}
          todayResult={todayRecord}
          hasStartedOrPlayedToday={hasStartedOrPlayedToday}
          pendingMistakesCount={pendingMistakesCount}
          streak={playerStreak}
          isAdmin={isAdmin}
          onStartGame={handleStartGameClick}
          onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
          onOpenMistakes={() => setIsReviewModalOpen(true)}
          onOpenProfileHistory={() => setIsProfileHistoryOpen(true)}
          onOpenAdminPanel={() => setIsTeacherAdminOpen(true)}
          onLogout={handleLogout}
        />

        <React.Suspense fallback={null}>
          {isLeaderboardOpen && (
            <LeaderboardModal
              isOpen={isLeaderboardOpen}
              onClose={() => setIsLeaderboardOpen(false)}
              currentStudentEmail={currentStudentEmail}
              todayDateStr={todayDateStr}
              weekMondayStr={blockInfo.weekMondayDateStr}
              dayName={blockInfo.dayName}
              dayNumberInBlock={blockInfo.dayNumberInBlock}
            />
          )}

          {isReviewModalOpen && (
            <GameReviewModal
              isOpen={isReviewModalOpen}
              onClose={() => setIsReviewModalOpen(false)}
              reviewItems={todayReviewItems}
              onUpdateReviewItems={handleUpdateReviewItems}
            />
          )}

          {isProfileHistoryOpen && (
            <PlayerProfileModal
              isOpen={isProfileHistoryOpen}
              onClose={() => setIsProfileHistoryOpen(false)}
              studentName={studentName}
              studentEmail={currentStudentEmail}
              streak={playerStreak}
            />
          )}

          {isTeacherAdminOpen && (
            <TeacherAdminModal
              isOpen={isTeacherAdminOpen}
              onClose={() => setIsTeacherAdminOpen(false)}
              onStartDateChanged={handleTeacherStartDateChanged}
            />
          )}
        </React.Suspense>
      </>
    );
  }

  // View 4: Completed Quiz Summary (With speed bonus breakdown & accurate streak)
  if (viewMode === 'completed') {
    const finalCorrect = dailyProgress.score || 0;
    const scoreDetails = calculateGameScore(finalCorrect, finalTimeSeconds, totalQuestionsCount);

    return (
      <div className="min-h-screen bg-[#F8F9FA] text-neutral-900 flex flex-col selection:bg-yellow-300 selection:text-black">
        {/* App Bar */}
        <header className="w-full bg-white border-b-2 border-black sticky top-0 z-30 shadow-[0_2px_0_0_#000]">
          <div className="max-w-xl mx-auto px-4 py-2.5 flex items-center justify-between">
            <button
              onClick={() => setViewMode('home')}
              className="px-2.5 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border-2 border-black rounded-xl font-black text-xs flex items-center gap-1 shadow-[2px_2px_0_0_#000] cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Hasierara</span>
            </button>
            <span className="font-black text-sm text-neutral-900">
              Emaitzak
            </span>
            <div className="w-16" />
          </div>
        </header>

        <main className="flex-1 max-w-lg w-full mx-auto px-4 py-6 flex flex-col justify-center">
          <div className="p-6 bg-white border-4 border-black rounded-3xl shadow-[8px_8px_0_0_#000] text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-yellow-300 border-3 border-black rounded-2xl shadow-[3px_3px_0_0_#000] mx-auto flex items-center justify-center text-3xl mb-3">
              🎉
            </div>

            <h2 className="text-2xl font-black text-neutral-950 mb-1">
              Partida Amaituta!
            </h2>
            <p className="text-xs font-bold text-neutral-600 mb-5">
              Zorionak egindako lanagatik!
            </p>

            {/* Total Points Highlight Card */}
            <div className="mb-5 p-4 bg-yellow-100 border-3 border-black rounded-2xl shadow-[3px_3px_0_0_#000] text-center">
              <span className="text-[11px] font-black uppercase text-yellow-900 tracking-wider block">
                Puntuazio Orokorra
              </span>
              <div className="flex items-center justify-center gap-2 mt-1">
                <Award className="w-7 h-7 text-yellow-700" />
                <span className="text-3xl sm:text-4xl font-black text-neutral-950">
                  {scoreDetails.totalPoints.toLocaleString()} pt
                </span>
              </div>
              <div className="mt-2 pt-2 border-t border-yellow-300/80 text-[11px] font-bold text-neutral-700 flex items-center justify-center gap-2 flex-wrap">
                <span>🎯 Oinarria: {scoreDetails.basePoints} pt ({finalCorrect} × 10 pt)</span>
                <span>•</span>
                <span className="text-emerald-800 font-black flex items-center gap-0.5">
                  <Zap className="w-3 h-3 fill-emerald-600 text-emerald-600" />
                  Bizkortasuna: +{scoreDetails.speedBonus} pt ({scoreDetails.secondsSaved}s × 25 pt)
                </span>
              </div>
            </div>

            {/* 3 Detail Cards: Correct, Time, Streak */}
            <div className="grid grid-cols-3 gap-2.5 mb-5">
              <div className="p-3 bg-emerald-50 border-2 border-black rounded-xl text-center shadow-[2px_2px_0_0_#000]">
                <span className="text-[10px] font-black uppercase text-emerald-800 block">
                  Asmatutakoak
                </span>
                <span className="text-lg sm:text-xl font-black text-emerald-700 mt-0.5 block">
                  {finalCorrect}/{totalQuestionsCount}
                </span>
              </div>

              <div className="p-3 bg-sky-50 border-2 border-black rounded-xl text-center shadow-[2px_2px_0_0_#000]">
                <span className="text-[10px] font-black uppercase text-sky-800 block">
                  Denbora
                </span>
                <span className="text-lg sm:text-xl font-black text-sky-950 mt-0.5 block">
                  {finalTimeSeconds.toFixed(1)}s
                </span>
              </div>

              <div className="p-3 bg-orange-50 border-2 border-black rounded-xl text-center shadow-[2px_2px_0_0_#000]">
                <span className="text-[10px] font-black uppercase text-orange-800 block">
                  Racha
                </span>
                <div className="flex items-center justify-center gap-0.5 text-lg sm:text-xl font-black text-orange-600 mt-0.5">
                  <Flame className="w-4 h-4 fill-orange-500 text-orange-500" />
                  <span>{playerStreak}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5">
              <button
                onClick={() => setIsReviewModalOpen(true)}
                className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-400 text-white font-black text-sm border-2 border-black rounded-xl shadow-[3px_3px_0_0_#000] flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <BookOpen className="w-4 h-4" />
                <span>
                  {pendingMistakesCount > 0
                    ? `Partida Berrikusi & Akatsak Garbitu (${pendingMistakesCount})`
                    : 'Partida Berrikusi (20 Galderak)'}
                </span>
              </button>

              <button
                onClick={() => setIsLeaderboardOpen(true)}
                className="w-full py-2.5 px-4 bg-yellow-300 hover:bg-yellow-200 text-neutral-950 font-black text-sm border-2 border-black rounded-xl shadow-[2px_2px_0_0_#000] flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <Trophy className="w-4 h-4" />
                <span>Sailkapenak Ikusi</span>
              </button>

              {isAdmin && (
                <button
                  onClick={() => setIsTeacherAdminOpen(true)}
                  className="w-full py-2.5 px-4 bg-yellow-100 hover:bg-yellow-200 text-neutral-950 font-black text-sm border-2 border-black rounded-xl shadow-[2px_2px_0_0_#000] flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-800" />
                  <span>Irakasle Panela (Admin)</span>
                </button>
              )}

              <button
                onClick={() => setViewMode('home')}
                className="w-full py-2 px-4 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 font-black text-xs border-2 border-black rounded-xl shadow-[2px_2px_0_0_#000] cursor-pointer transition-all"
              >
                Hasierara Itzuli
              </button>
            </div>
          </div>
        </main>

        <React.Suspense fallback={null}>
          {isLeaderboardOpen && (
            <LeaderboardModal
              isOpen={isLeaderboardOpen}
              onClose={() => setIsLeaderboardOpen(false)}
              currentStudentEmail={currentStudentEmail}
              todayDateStr={todayDateStr}
              weekMondayStr={blockInfo.weekMondayDateStr}
              dayName={blockInfo.dayName}
              dayNumberInBlock={blockInfo.dayNumberInBlock}
            />
          )}

          {isReviewModalOpen && (
            <GameReviewModal
              isOpen={isReviewModalOpen}
              onClose={() => setIsReviewModalOpen(false)}
              reviewItems={todayReviewItems}
              onUpdateReviewItems={handleUpdateReviewItems}
            />
          )}

          {isTeacherAdminOpen && (
            <TeacherAdminModal
              isOpen={isTeacherAdminOpen}
              onClose={() => setIsTeacherAdminOpen(false)}
              onStartDateChanged={handleTeacherStartDateChanged}
            />
          )}
        </React.Suspense>
      </div>
    );
  }

  // View 5: Actively Playing (NO timer displayed while playing, NO audio)
  return (
    <div className="min-h-screen bg-[#F8F9FA] text-neutral-900 flex flex-col selection:bg-yellow-300 selection:text-black">
      {/* Top Bar during quiz */}
      <header className="w-full bg-white border-b-2 border-black sticky top-0 z-30 shadow-[0_2px_0_0_#000]">
        <div className="max-w-xl mx-auto px-4 py-2 flex items-center justify-between gap-2">
          <button
            onClick={() => setViewMode('home')}
            title="Itzuli menura"
            className="p-1.5 bg-neutral-100 hover:bg-neutral-200 border-2 border-black rounded-lg shadow-[1px_1px_0_0_#000] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-neutral-900" />
          </button>

          <div className="text-center">
            <span className="text-sm font-black text-neutral-950">
              <span className="text-neutral-500 font-bold">Galdera </span>
              {state.currentQuestionIndex + 1}
              <span className="text-neutral-400 font-bold">/{totalQuestionsCount}</span>
            </span>
          </div>

          <div className="flex items-center">
            <span className="px-2.5 py-0.5 bg-emerald-100 border border-emerald-400 rounded-lg text-emerald-950 font-black text-xs">
              ✓ {dailyProgress.score || 0}
            </span>
          </div>
        </div>

        {/* Linear progress bar */}
        <div className="w-full h-1 bg-neutral-200">
          <div
            className="h-full bg-emerald-500 transition-all duration-200"
            style={{ width: `${((state.currentQuestionIndex + (hasAnsweredCurrent ? 1 : 0)) / totalQuestionsCount) * 100}%` }}
          />
        </div>
      </header>

      {/* Main Question Card */}
      <main className="flex-1 flex flex-col justify-start">
        <QuestionCard
          question={currentQuestion}
          selectedOption={currentAnswer ?? null}
          hasAnswered={hasAnsweredCurrent}
          onSelectOption={handleSelectOption}
          onNextQuestion={handleNextQuestion}
          isLastQuestion={state.currentQuestionIndex >= totalQuestionsCount - 1}
        />
      </main>

      {/* Review Modal if opened */}
      <React.Suspense fallback={null}>
        {isReviewModalOpen && (
          <GameReviewModal
            isOpen={isReviewModalOpen}
            onClose={() => setIsReviewModalOpen(false)}
            reviewItems={todayReviewItems}
            onUpdateReviewItems={handleUpdateReviewItems}
          />
        )}
      </React.Suspense>
    </div>
  );
}
