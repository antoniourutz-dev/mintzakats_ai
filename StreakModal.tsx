import React from 'react';
import { X, Flame, Award, CheckCircle, Clock, Sparkles } from 'lucide-react';
import { AppState } from '../types';
import { getTodayDateString } from '../utils/storage';

interface StreakModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: AppState;
  onTriggerTestCelebration: () => void;
  onSimulateContinueStreak: () => void;
}

export const StreakModal: React.FC<StreakModalProps> = ({
  isOpen,
  onClose,
  state,
  onTriggerTestCelebration,
  onSimulateContinueStreak,
}) => {
  if (!isOpen) return null;

  const today = getTodayDateString();
  const isTodayCompleted = state.lastQuizCompletedDate === today;
  const currentStreak = state.streak || 0;
  const bestStreak = state.bestStreak || currentStreak;

  // 7-day milestone checkpoints (without weekday names)
  const streakMilestones = [1, 3, 5, 7, 10, 14, 30];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        id="streak-info-modal"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-white border-4 border-black rounded-2xl p-6 sm:p-7 shadow-[8px_8px_0_0_#000000] text-neutral-900 max-h-[92vh] overflow-y-auto"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          id="close-streak-modal-btn"
          aria-label="Itxi"
          className="absolute top-4 right-4 p-2 bg-neutral-100 hover:bg-neutral-200 border-2 border-black rounded-lg text-neutral-800 transition-all cursor-pointer shadow-[2px_2px_0_0_#000]"
        >
          <X className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-amber-400 border-2 border-black rounded-xl shadow-[3px_3px_0_0_#000] flex items-center justify-center text-2xl">
            <Flame className="w-7 h-7 text-amber-950 fill-orange-500" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-none">
              Eguneko Segida
            </h2>
            <p className="text-xs font-bold text-neutral-500 mt-1">
              Galdetegi osoak jarraian amaitzeko erronka
            </p>
          </div>
        </div>

        {/* Main Stats Display */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {/* Current Streak */}
          <div className="p-4 bg-amber-50 border-2 border-black rounded-xl shadow-[3px_3px_0_0_#000] text-center relative overflow-hidden">
            <div className="text-[11px] font-black uppercase tracking-wider text-amber-800 mb-1">
              Uneko Segida
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <Flame className="w-7 h-7 text-orange-500 fill-orange-500" />
              <span className="text-3xl sm:text-4xl font-black text-amber-950">
                {currentStreak}
              </span>
            </div>
            <span className="text-xs font-bold text-amber-800">
              egun jarraian
            </span>
          </div>

          {/* Best Streak */}
          <div className="p-4 bg-purple-50 border-2 border-black rounded-xl shadow-[3px_3px_0_0_#000] text-center">
            <div className="text-[11px] font-black uppercase tracking-wider text-purple-800 mb-1 flex items-center justify-center gap-1">
              <Award className="w-3.5 h-3.5 text-purple-600" />
              <span>Errekor Onena</span>
            </div>
            <div className="text-3xl sm:text-4xl font-black text-purple-950">
              {bestStreak}
            </div>
            <span className="text-xs font-bold text-purple-800">
              eguneko marka
            </span>
          </div>
        </div>

        {/* Status of Today */}
        <div className={`p-4 border-2 border-black rounded-xl mb-5 shadow-[3px_3px_0_0_#000] flex items-center gap-3 ${
          isTodayCompleted 
            ? 'bg-emerald-50 text-emerald-950' 
            : 'bg-amber-50 text-amber-950'
        }`}>
          {isTodayCompleted ? (
            <CheckCircle className="w-6 h-6 text-emerald-600 shrink-0" />
          ) : (
            <Clock className="w-6 h-6 text-amber-600 shrink-0 animate-pulse" />
          )}
          <div className="text-xs">
            <div className="font-black text-sm">
              {isTodayCompleted 
                ? 'Gaurko erronka osatuta! (Segida salbu)' 
                : 'Gaurko erronka osatzeke!'}
            </div>
            <div className="font-bold opacity-80 mt-0.5">
              {isTodayCompleted
                ? 'Gaurko 20 galderak amaitu dituzu. Zure segida bihar arte gordeta dago!'
                : 'Amaitu gaurko 20 galderak segida handitzeko edo ez galtzeko.'}
            </div>
          </div>
        </div>

        {/* Streak Goals / Milestones Tracker */}
        <div className="mb-5 p-4 bg-neutral-50 border-2 border-black rounded-xl shadow-[3px_3px_0_0_#000]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-black text-neutral-800 flex items-center gap-1.5 uppercase tracking-wider">
              <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
              Segidaren Helburuak
            </span>
            <span className="text-[11px] font-bold text-neutral-500">
              {currentStreak} egun lortuta
            </span>
          </div>

          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {streakMilestones.map(m => {
              const reached = currentStreak >= m;

              return (
                <div 
                  key={m}
                  className={`flex flex-col items-center p-2 rounded-lg border-2 border-black text-center transition-all ${
                    reached 
                      ? 'bg-amber-400 text-neutral-950 shadow-[1px_1px_0_0_#000]' 
                      : 'bg-white text-neutral-400'
                  }`}
                >
                  <span className="text-[10px] font-black uppercase">{m}d</span>
                  <div className="my-1">
                    {reached ? (
                      <Flame className="w-4 h-4 text-neutral-950 fill-orange-600" />
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full border border-neutral-300 bg-neutral-100" />
                    )}
                  </div>
                  <span className="text-[9px] font-bold">
                    {reached ? '✓' : `${m} eg`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Explanation Card */}
        <div className="p-3.5 bg-neutral-100 border-2 border-black rounded-xl text-xs font-medium text-neutral-700 mb-5 leading-relaxed">
          <span className="font-black text-neutral-900 block mb-1">
            📌 Nola dabil eguneko segida (Streak)?
          </span>
          Egun bakoitzean 20 galderako erronka amaitu behar da segida luzatzeko. Egunero praktikatzeak euskara maila sendotzen du eta hutsak gainditzen laguntzen du!
        </div>

        {/* Action / Test Buttons */}
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => {
              onClose();
              onSimulateContinueStreak();
            }}
            id="simulate-continue-streak-btn"
            className="flex-1 py-2.5 px-3 bg-amber-400 hover:bg-amber-300 border-2 border-black rounded-xl text-xs font-black text-neutral-950 shadow-[2px_2px_0_0_#000] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Flame className="w-4 h-4 text-orange-600 fill-orange-600" />
            <span>Simulatu Segida Luzatzea (+1 Egun) 🔥</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onTriggerTestCelebration();
            }}
            id="test-streak-celebration-btn"
            className="py-2.5 px-3 bg-white hover:bg-neutral-100 border-2 border-black rounded-xl text-xs font-black text-neutral-800 shadow-[2px_2px_0_0_#000] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Animazioa Ikusi ✨</span>
          </button>
        </div>
      </div>
    </div>
  );
};
