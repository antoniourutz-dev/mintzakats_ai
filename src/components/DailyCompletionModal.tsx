import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, BookOpen, RotateCcw } from 'lucide-react';
import { DayProgress } from '../types';

interface DailyCompletionModalProps {
  isOpen: boolean;
  progress: DayProgress;
  mistakesCountToday: number;
  onClose: () => void;
  onOpenMistakes: () => void;
  onRetryDay: () => void;
}

export const DailyCompletionModal: React.FC<DailyCompletionModalProps> = ({
  isOpen,
  progress,
  mistakesCountToday,
  onClose,
  onOpenMistakes,
  onRetryDay,
}) => {
  useEffect(() => {
    if (isOpen) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // Fallback if confetti fails
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const percentage = Math.round((progress.score / (progress.total || 20)) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div 
        id="daily-completion-dialog"
        className="w-full max-w-lg bg-white rounded-2xl border-2 border-black shadow-[6px_6px_0_0_#000000] p-6 text-center animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Trophy icon */}
        <div className="w-16 h-16 bg-yellow-300 border-2 border-black rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-[3px_3px_0_0_#000]">
          <Trophy className="w-8 h-8 text-neutral-900" />
        </div>

        <span className="inline-block px-3 py-1 bg-yellow-100 border border-black text-amber-900 font-black text-xs uppercase tracking-wider rounded-full mb-2">
          Gaurko 20 Galderak Amaituta!
        </span>

        <h2 className="text-2xl sm:text-3xl font-black text-neutral-950 mb-1">
          {percentage >= 90 ? 'Zorionak, Maisu!' : percentage >= 70 ? 'Oso Lan Ona!' : 'Bikain, Erronka Osatu Duzu!'}
        </h2>
        <p className="text-sm font-bold text-neutral-600 mb-6">
          {percentage >= 90
            ? 'Maila bikaina erakutsi duzu gaurko erronkan.'
            : 'Garrantzitsuena akatsetatik ikastea eta hobetzen jarraitzea da!'}
        </p>

        {/* Scorecard */}
        <div className="grid grid-cols-3 gap-2.5 p-4 bg-[#F8F9FA] rounded-xl border-2 border-black shadow-[3px_3px_0_0_#000] mb-6">
          <div>
            <span className="text-[11px] font-black uppercase text-neutral-500 block">Puntuazioa</span>
            <span className="text-2xl font-black text-neutral-900">{progress.score} / 20</span>
          </div>
          <div>
            <span className="text-[11px] font-black uppercase text-neutral-500 block">Zehaztasuna</span>
            <span className="text-2xl font-black text-emerald-600">%{percentage}</span>
          </div>
          <div>
            <span className="text-[11px] font-black uppercase text-neutral-500 block">Akatsak</span>
            <span className={`text-2xl font-black ${mistakesCountToday > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
              {mistakesCountToday}
            </span>
          </div>
        </div>

        {/* Learning prompt if had mistakes */}
        {mistakesCountToday > 0 && (
          <div className="p-3 bg-rose-50 border-2 border-black rounded-lg mb-6 text-left flex items-start gap-2.5">
            <BookOpen className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-black text-rose-950">
                Gaur {mistakesCountToday} akats egin dituzu!
              </p>
              <p className="text-xs font-semibold text-rose-800">
                Akatsen koadernoan gorde dira, haien azalpenak aztertu eta hutsik gabe menderatu arte!
              </p>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          {mistakesCountToday > 0 && (
            <button
              onClick={() => {
                onClose();
                onOpenMistakes();
              }}
              className="flex-1 py-3 px-4 bg-rose-600 hover:bg-rose-700 text-white rounded-lg border-2 border-black shadow-[3px_3px_0_0_#000] text-sm font-black flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>Akatsak Aztertu</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 bg-neutral-950 hover:bg-neutral-800 text-white rounded-lg border-2 border-black shadow-[3px_3px_0_0_#000] text-sm font-black flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Itxi</span>
          </button>
        </div>

        <div className="mt-3">
          <button
            onClick={onRetryDay}
            className="text-xs font-bold text-neutral-600 hover:text-neutral-950 underline flex items-center justify-center gap-1 mx-auto cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Errepikatu gaurko galderak</span>
          </button>
        </div>
      </div>
    </div>
  );
};
