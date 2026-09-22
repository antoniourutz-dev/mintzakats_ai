import React from 'react';
import { X, Award, Flame, CheckCircle2, TrendingUp, BookOpen, Zap } from 'lucide-react';
import { AppState } from '../types';
import { APP_BADGES } from '../data';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: AppState;
}

export const StatsModal: React.FC<StatsModalProps> = ({ isOpen, onClose, state }) => {
  if (!isOpen) return null;

  // Calculate stats across saved progress
  let totalAnswered = 0;
  let totalCorrect = 0;
  let completedCount = 0;

  const progressEntries = Object.values(state.progress || {});
  progressEntries.forEach(dayProg => {
    if (dayProg) {
      const answeredInDay = Object.keys(dayProg.answers || {}).length;
      totalAnswered += answeredInDay;
      totalCorrect += dayProg.score;
      if (dayProg.completed) completedCount++;
    }
  });

  const accuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;
  const totalMistakesPending = Object.keys(state.mistakes || {}).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div 
        id="stats-modal-dialog"
        className="w-full max-w-2xl max-h-[90vh] bg-white rounded-xl border-2 border-black shadow-[6px_6px_0_0_#000000] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b-2 border-black bg-yellow-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-yellow-400 border-2 border-black text-neutral-950 flex items-center justify-center font-black shadow-[2px_2px_0_0_#000]">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-neutral-950 leading-tight">
                Estatistikak eta Lorpenak
              </h2>
              <p className="text-xs font-bold text-neutral-600">
                Zure aurrerapena eta erronken bilakaera
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border-2 border-black bg-white hover:bg-neutral-100 shadow-[2px_2px_0_0_#000] transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-[#F8F9FA]">
          {/* Top Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-white rounded-lg border-2 border-black shadow-[2px_2px_0_0_#000]">
              <div className="flex items-center gap-1 text-orange-600 mb-1">
                <Flame className="w-4 h-4 fill-orange-500" />
                <span className="text-[10px] font-black uppercase">Segida</span>
              </div>
              <span className="text-xl font-black text-neutral-900">{state.streak} egun</span>
            </div>

            <div className="p-3 bg-white rounded-lg border-2 border-black shadow-[2px_2px_0_0_#000]">
              <div className="flex items-center gap-1 text-indigo-600 mb-1">
                <Zap className="w-4 h-4 fill-indigo-500" />
                <span className="text-[10px] font-black uppercase">Puntuak</span>
              </div>
              <span className="text-xl font-black text-neutral-900">{state.xp} XP</span>
            </div>

            <div className="p-3 bg-white rounded-lg border-2 border-black shadow-[2px_2px_0_0_#000]">
              <div className="flex items-center gap-1 text-emerald-600 mb-1">
                <TrendingUp className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase">Zehaztasuna</span>
              </div>
              <span className="text-xl font-black text-neutral-900">%{accuracy}</span>
            </div>

            <div className="p-3 bg-white rounded-lg border-2 border-black shadow-[2px_2px_0_0_#000]">
              <div className="flex items-center gap-1 text-rose-600 mb-1">
                <BookOpen className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase">Akatsak</span>
              </div>
              <span className="text-xl font-black text-neutral-900">{totalMistakesPending} berrikusteko</span>
            </div>
          </div>

          {/* Gamified Badges */}
          <div className="bg-white p-4 rounded-xl border-2 border-black shadow-[3px_3px_0_0_#000]">
            <h3 className="text-sm font-black text-neutral-950 uppercase tracking-wider mb-3">
              Txapak eta Lorpenak
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {APP_BADGES.map(badge => {
                let isUnlocked = state.unlockedBadges.includes(badge.id);
                if (badge.id === 'first_step' && completedCount >= 1) isUnlocked = true;
                if (badge.id === 'three_streak' && state.streak >= 3) isUnlocked = true;
                if (badge.id === 'week_master' && (state.streak >= 7 || completedCount >= 7)) isUnlocked = true;

                return (
                  <div
                    key={badge.id}
                    className={`p-3 rounded-lg border-2 flex items-start gap-3 transition-all ${
                      isUnlocked
                        ? 'bg-yellow-50/70 border-black shadow-[2px_2px_0_0_#000]'
                        : 'bg-neutral-100 border-neutral-300 opacity-60'
                    }`}
                  >
                    <span className="text-2xl shrink-0">{badge.icon}</span>
                    <div>
                      <h4 className="text-xs font-black text-neutral-900 flex items-center gap-1">
                        {badge.title}
                        {isUnlocked && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                      </h4>
                      <p className="text-[11px] font-semibold text-neutral-600 leading-tight">
                        {badge.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-white border-t-2 border-black flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-neutral-900 text-white rounded-lg border-2 border-black font-black text-xs cursor-pointer"
          >
            Itxi
          </button>
        </div>
      </div>
    </div>
  );
};
