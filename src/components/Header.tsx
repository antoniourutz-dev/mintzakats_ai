import React from 'react';
import { Flame, BookOpen, Award, Check, Trophy } from 'lucide-react';
import { AppState } from '../types';
import { getTodayDateString } from '../utils/storage';

interface HeaderProps {
  state: AppState;
  pendingMistakesCount: number;
  onOpenMistakesModal: () => void;
  onOpenStatsModal: () => void;
  onOpenStreakModal: () => void;
  onOpenLeaderboard: () => void;
  isCelebratingStreak?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  state,
  pendingMistakesCount,
  onOpenMistakesModal,
  onOpenStatsModal,
  onOpenStreakModal,
  onOpenLeaderboard,
  isCelebratingStreak = false,
}) => {
  const today = getTodayDateString();
  const isTodayCompleted = state.lastQuizCompletedDate === today;
  const currentStreak = state.streak || 0;

  return (
    <header className="w-full bg-white border-b-2 border-black sticky top-0 z-30 shadow-[0_2px_0_0_#000000]">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between">
        {/* Logo & Brand */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 sm:w-9 sm:h-9 bg-emerald-500 border-2 border-black rounded-lg shadow-[2px_2px_0_0_#000000] flex items-center justify-center font-black text-white text-base tracking-tighter shrink-0">
            MK
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-black text-neutral-950 tracking-tight leading-none flex items-center gap-1.5">
              Mintzakats
              <span className="hidden sm:inline-block px-1.5 py-0.2 text-[9px] font-black uppercase tracking-wider bg-yellow-300 border border-black rounded shadow-[1px_1px_0_0_#000]">
                Euskara
              </span>
            </h1>
          </div>
        </div>

        {/* Quick Action Badges */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Daily Streak Visual Indicator */}
          <button
            onClick={onOpenStreakModal}
            id="header-daily-streak-btn"
            title={`Eguneko segida: ${currentStreak} egun jarraian galdetegi osoa amaituta (${isTodayCompleted ? 'Gaurkoa eginda ✓' : 'Gaurkoa osatzeke'}). Egin klik xehetasunetarako.`}
            className={`relative flex items-center gap-1 px-2 py-1 sm:px-2.5 sm:py-1.5 border-2 border-black rounded-lg shadow-[2px_2px_0_0_#000000] text-xs font-black transition-all cursor-pointer select-none ${
              isCelebratingStreak
                ? 'bg-amber-300 scale-105 shadow-[0_0_12px_rgba(245,158,11,0.6)] animate-pulse'
                : isTodayCompleted
                ? 'bg-amber-100 hover:bg-amber-200 text-amber-950'
                : currentStreak > 0
                ? 'bg-orange-50 hover:bg-orange-100 text-orange-950'
                : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
            }`}
          >
            <Flame 
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform ${
                currentStreak > 0 
                  ? 'text-orange-500 fill-orange-500' 
                  : 'text-neutral-400 fill-neutral-300'
              } ${isCelebratingStreak ? 'animate-bounce' : ''}`} 
            />
            <span className="text-xs sm:text-sm font-black tracking-tight">{currentStreak}</span>
            <span className="hidden md:inline text-[10px] font-bold opacity-80">egun</span>

            {/* Completion Status Badge */}
            {isTodayCompleted ? (
              <span 
                title="Gaurko galdetegi osoa osatuta!"
                className="w-3.5 h-3.5 bg-emerald-500 border border-black rounded-full flex items-center justify-center text-white text-[8px] shadow-[1px_1px_0_0_#000]"
              >
                <Check className="w-2 h-2 stroke-[3]" />
              </span>
            ) : currentStreak > 0 ? (
              <span 
                title="Gaurko 20 galderak osatzeke segida mantentzeko"
                className="w-2 h-2 bg-orange-500 border border-black rounded-full animate-ping"
              />
            ) : null}
          </button>

          {/* Leaderboard Toggle Button */}
          <button
            onClick={onOpenLeaderboard}
            id="header-leaderboard-btn"
            title="Sailkapena: Ikusi jokalari onenak eta lagunak (XP)"
            className="flex items-center gap-1 sm:gap-1.5 px-2 py-1 sm:px-2.5 sm:py-1.5 bg-yellow-300 hover:bg-yellow-200 text-neutral-950 border-2 border-black rounded-lg shadow-[2px_2px_0_0_#000000] text-xs font-black transition-all cursor-pointer"
          >
            <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-950 fill-amber-500 shrink-0" />
            <span className="hidden sm:inline">Sailkapena</span>
          </button>

          {/* XP Display */}
          <div 
            title="Guztizko XP puntuak"
            className="hidden sm:flex items-center gap-1 px-2 py-1 sm:px-2.5 sm:py-1.5 bg-indigo-50 border-2 border-black rounded-lg shadow-[2px_2px_0_0_#000000] text-xs font-black text-indigo-900"
          >
            <span className="text-indigo-600">⚡</span>
            <span>{state.xp}</span>
            <span className="text-[10px] text-indigo-600 font-bold">XP</span>
          </div>

          {/* Mistakes Notebook Button */}
          <button
            onClick={onOpenMistakesModal}
            id="open-mistakes-notebook-btn"
            title="Akatsen Koadernoa: Huts egindako galderak errepasatu"
            className={`relative flex items-center gap-1 px-2 py-1 sm:px-2.5 sm:py-1.5 border-2 border-black rounded-lg text-xs font-black transition-all cursor-pointer ${
              pendingMistakesCount > 0
                ? 'bg-rose-100 hover:bg-rose-200 text-rose-950 shadow-[2px_2px_0_0_#000000]'
                : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800 shadow-[2px_2px_0_0_#000000]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-600" />
            <span className="hidden md:inline">Akatsak</span>
            {pendingMistakesCount > 0 && (
              <span className="px-1 py-0.1 bg-rose-600 text-white rounded-full text-[9px] font-black leading-tight border border-black animate-pulse">
                {pendingMistakesCount}
              </span>
            )}
          </button>

          {/* Stats & Badges Modal */}
          <button
            onClick={onOpenStatsModal}
            id="open-stats-modal-btn"
            title="Estatistikak eta Txapak"
            className="p-1 sm:p-1.5 bg-white hover:bg-neutral-100 border-2 border-black rounded-lg shadow-[2px_2px_0_0_#000000] text-neutral-800 transition-all cursor-pointer"
          >
            <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-600" />
          </button>
        </div>
      </div>
    </header>
  );
};
