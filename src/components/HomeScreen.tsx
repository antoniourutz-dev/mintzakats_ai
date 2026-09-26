import React from 'react';
import {
  Play,
  Trophy,
  LogOut,
  BookOpen,
  Lock,
  Flame,
  History,
  ShieldCheck,
} from 'lucide-react';
import { WeekBlockInfo } from '../utils/weekCycle';
import { PlayerScoreRecord } from '../services/supabase';

interface HomeScreenProps {
  studentEmail: string;
  studentName: string;
  blockInfo: WeekBlockInfo;
  todayResult: PlayerScoreRecord | null;
  hasStartedOrPlayedToday: boolean;
  pendingMistakesCount: number;
  streak: number;
  isAdmin?: boolean;
  onStartGame: () => void;
  onOpenLeaderboard: () => void;
  onOpenMistakes: () => void;
  onOpenProfileHistory: () => void;
  onOpenAdminPanel?: () => void;
  onLogout: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  studentEmail,
  studentName,
  blockInfo,
  todayResult,
  hasStartedOrPlayedToday,
  pendingMistakesCount,
  streak,
  isAdmin,
  onStartGame,
  onOpenLeaderboard,
  onOpenMistakes,
  onOpenProfileHistory,
  onOpenAdminPanel,
  onLogout,
}) => {
  const isGameLocked = isAdmin ? false : hasStartedOrPlayedToday;

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-neutral-900 flex flex-col selection:bg-yellow-300 selection:text-black">
      {/* Top App Bar */}
      <header className="w-full bg-white border-b-2 border-black sticky top-0 z-30 shadow-[0_2px_0_0_#000]">
        <div className="max-w-xl mx-auto px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-emerald-500 border-2 border-black rounded-lg shadow-[2px_2px_0_0_#000] flex items-center justify-center font-black text-white text-base">
              MK
            </div>
            <div>
              <h1 className="text-base font-black text-neutral-950 leading-tight">
                Mintzakats
              </h1>
              <button
                onClick={onOpenProfileHistory}
                title="Ikusi profila eta historiala"
                className="flex items-center gap-1.5 text-xs font-bold text-neutral-600 hover:text-black cursor-pointer group"
              >
                <span className="text-emerald-700 font-black group-hover:underline">
                  👤 {studentName}
                </span>
                {streak > 0 && (
                  <span className="text-orange-600 font-black flex items-center gap-0.5">
                    <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
                    {streak}
                  </span>
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAdmin && onOpenAdminPanel && (
              <button
                onClick={onOpenAdminPanel}
                title="Irakasle Panela (Admin)"
                className="px-2.5 py-1.5 bg-yellow-300 hover:bg-yellow-200 text-neutral-950 border-2 border-black rounded-xl font-black text-xs flex items-center gap-1.5 shadow-[2px_2px_0_0_#000] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-800" />
                <span className="hidden sm:inline">Irakasle Panela</span>
              </button>
            )}

            <button
              onClick={onOpenProfileHistory}
              title="Profila eta Historiala"
              className="px-2.5 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border-2 border-black rounded-xl font-black text-xs flex items-center gap-1.5 shadow-[2px_2px_0_0_#000] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer transition-colors"
            >
              <History className="w-3.5 h-3.5 text-emerald-700" />
              <span className="hidden sm:inline">Historiala</span>
            </button>

            <button
              onClick={onLogout}
              title="Itxi saioa"
              className="px-2.5 py-1.5 bg-neutral-100 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-400 text-neutral-700 border-2 border-black rounded-xl font-black text-xs flex items-center gap-1.5 shadow-[2px_2px_0_0_#000] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Itxi saioa</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Menu */}
      <main className="flex-1 max-w-xl w-full mx-auto px-4 py-6 flex flex-col justify-center">
        {/* Admin Quick Banner on Home */}
        {isAdmin && onOpenAdminPanel && (
          <div className="mb-4 p-3 bg-yellow-100 border-2 border-black rounded-2xl shadow-[3px_3px_0_0_#000] flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white border border-black flex items-center justify-center font-black text-sm text-neutral-900 shadow-[1px_1px_0_0_#000]">
                🛡️
              </div>
              <div>
                <span className="text-xs font-black text-neutral-950 block">Irakasle Kudeatzailea</span>
                <span className="text-[10px] font-bold text-neutral-600">Ikasleen datuak, hasiera-data eta 7 egunetako galderak</span>
              </div>
            </div>
            <button
              onClick={onOpenAdminPanel}
              className="px-3 py-1.5 bg-neutral-950 text-white hover:bg-neutral-800 rounded-xl font-black text-xs border border-black shadow-[1px_1px_0_0_#000] cursor-pointer shrink-0"
            >
              Ireki Panela
            </button>
          </div>
        )}

        {/* Compact Day & Cycle Bar */}
        <div className="mb-5 p-4 bg-white border-3 border-black rounded-2xl shadow-[4px_4px_0_0_#000] flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400 block">
              {blockInfo.formattedDate}
            </span>
            <h2 className="text-2xl font-black text-neutral-950 leading-tight">
              {blockInfo.dayName}
            </h2>
          </div>
          <div className="px-3 py-1.5 bg-yellow-300 border-2 border-black rounded-xl text-xs font-black shadow-[2px_2px_0_0_#000]">
            {blockInfo.dayNumberInBlock} / 7
          </div>
        </div>

        {/* 2 Big Action Buttons */}
        <div className="space-y-4">
          {/* OPTION 1: PLAY TODAY */}
          <button
            onClick={isGameLocked ? undefined : onStartGame}
            disabled={isGameLocked}
            className={`w-full p-5 rounded-2xl border-4 transition-all text-left flex items-center justify-between gap-4 ${
              isGameLocked
                ? 'bg-neutral-100 border-neutral-300 text-neutral-400 cursor-not-allowed shadow-none'
                : 'bg-emerald-500 hover:bg-emerald-400 text-white border-black shadow-[6px_6px_0_0_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_0_#000] cursor-pointer group'
            }`}
          >
            <div className="min-w-0 flex-1">
              <h3 className={`text-2xl font-black leading-tight ${
                isGameLocked ? 'text-neutral-500' : 'text-white'
              }`}>
                {isAdmin
                  ? 'Jolastu (Mugagabe)'
                  : isGameLocked
                  ? 'Partida Eginda'
                  : 'Jolastu'}
              </h3>

              <div className="mt-1 flex items-center gap-2">
                {isAdmin ? (
                  <span className="text-xs font-bold text-emerald-100">
                    Irakaslea: nahi adina aldiz jokatu dezakezu froga moduan
                  </span>
                ) : todayResult ? (
                  <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                    {todayResult.correctAnswers ?? (todayResult.score <= 20 ? todayResult.score : Math.floor(todayResult.score / 100))}/20 · {todayResult.score} pt · {todayResult.timeSeconds.toFixed(1)}s
                  </span>
                ) : isGameLocked ? (
                  <span className="text-xs font-black text-neutral-500 flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Partida hasita / blokeatuta</span>
                  </span>
                ) : (
                  <span className="text-xs font-bold text-emerald-100">
                    Gaurko 20 galderak prest daude
                  </span>
                )}
              </div>
            </div>

            <div className={`w-14 h-14 rounded-xl border-3 border-black flex items-center justify-center shrink-0 shadow-[2px_2px_0_0_#000] ${
              isGameLocked ? 'bg-neutral-200 text-neutral-400' : 'bg-yellow-300 text-neutral-950 group-hover:scale-105 transition-transform'
            }`}>
              {isGameLocked ? <Lock className="w-6 h-6" /> : <Play className="w-7 h-7 fill-current ml-0.5" />}
            </div>
          </button>

          {/* OPTION 2: LEADERBOARD */}
          <button
            onClick={onOpenLeaderboard}
            className="w-full p-5 bg-yellow-300 hover:bg-yellow-200 text-neutral-950 border-4 border-black rounded-2xl shadow-[6px_6px_0_0_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_0_#000] cursor-pointer transition-all text-left flex items-center justify-between gap-4 group"
          >
            <div className="min-w-0 flex-1">
              <h3 className="text-2xl font-black leading-tight text-neutral-950">
                Sailkapenak
              </h3>
            </div>

            <div className="w-14 h-14 bg-white rounded-xl border-3 border-black flex items-center justify-center shrink-0 shadow-[2px_2px_0_0_#000] group-hover:scale-105 transition-transform">
              <Trophy className="w-7 h-7 text-yellow-600 fill-yellow-500" />
            </div>
          </button>
        </div>

        {/* Bottom Status / Extra Actions */}
        <div className="mt-5 flex items-center justify-center gap-3 flex-wrap">
          <button
            onClick={onOpenProfileHistory}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-neutral-100 text-neutral-800 border-2 border-black rounded-xl font-black text-xs shadow-[2px_2px_0_0_#000] cursor-pointer transition-all active:translate-x-[1px] active:translate-y-[1px]"
          >
            <History className="w-3.5 h-3.5 text-emerald-700" />
            <span>Partiden Historiala</span>
          </button>

          {hasStartedOrPlayedToday && (
            <button
              onClick={onOpenMistakes}
              className={`inline-flex items-center gap-2 px-3.5 py-2 bg-white rounded-xl font-black text-xs border-2 border-black shadow-[2px_2px_0_0_#000] cursor-pointer transition-all active:translate-x-[1px] active:translate-y-[1px] ${
                pendingMistakesCount > 0
                  ? 'hover:bg-rose-50 text-rose-700'
                  : 'hover:bg-neutral-50 text-neutral-800'
              }`}
            >
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <span>Partida Berrikusi</span>
              {pendingMistakesCount > 0 ? (
                <span className="px-1.5 py-0.2 rounded-full bg-rose-600 text-white text-[10px] font-black">
                  {pendingMistakesCount} huts
                </span>
              ) : (
                <span className="px-1.5 py-0.2 rounded-full bg-emerald-600 text-white text-[10px] font-black">
                  20/20
                </span>
              )}
            </button>
          )}
        </div>
      </main>
    </div>
  );
};
