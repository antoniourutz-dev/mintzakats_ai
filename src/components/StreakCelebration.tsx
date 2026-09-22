import React, { useEffect } from 'react';
import { Flame, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface StreakCelebrationProps {
  streakCount: number;
  onClose: () => void;
}

export const StreakCelebration: React.FC<StreakCelebrationProps> = ({
  streakCount,
  onClose,
}) => {
  useEffect(() => {
    // Fire & gold confetti burst from bottom sides
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      colors: ['#f97316', '#eab308', '#ef4444', '#f59e0b', '#fbbf24']
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio)
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });
    fire(0.2, {
      spread: 60,
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  }, []);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        id="streak-celebration-card"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md bg-white border-4 border-black rounded-2xl p-6 sm:p-8 shadow-[8px_8px_0_0_#000000] text-center overflow-hidden transform animate-in zoom-in-95 duration-300"
      >
        {/* Decorative Top Pill */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 border border-black rounded-full text-xs font-black text-amber-900 mb-4 shadow-[2px_2px_0_0_#000]">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>EGUNEKO SEGIDA HANDITU DA!</span>
        </div>

        {/* Big Flame Icon Badge */}
        <div className="w-24 h-24 mx-auto mb-4 bg-amber-300 border-4 border-black rounded-3xl shadow-[5px_5px_0_0_#000] flex items-center justify-center relative">
          <Flame className="w-14 h-14 text-amber-950 fill-orange-500 animate-bounce" />
          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-400 border-2 border-black rounded-full flex items-center justify-center text-neutral-950 font-black text-xs shadow-[1px_1px_0_0_#000]">
            ✓
          </div>
        </div>

        {/* Streak Number */}
        <div className="flex items-baseline justify-center gap-2 mb-1">
          <span className="text-5xl sm:text-6xl font-black text-neutral-950 tracking-tight">
            {streakCount}
          </span>
          <span className="text-2xl font-black text-orange-600">
            {streakCount === 1 ? 'EGUN' : 'EGUN'}
          </span>
        </div>

        {/* Subtitle */}
        <h3 className="text-lg font-black text-neutral-900 mb-2">
          {streakCount >= 7
            ? 'Aparteko diziplina! Astebete baino gehiago jarraian!'
            : streakCount >= 3
            ? 'Bikain! Ohitura sendoa eraikitzen ari zara!'
            : 'Lehen urratsa emanda! Eutsi segidari bihar ere!'}
        </h3>

        <p className="text-xs sm:text-sm font-bold text-neutral-600 mb-6 leading-relaxed">
          Gaurko 20 galderak osatu dituzu. Jarraitu horrela egunero euskara akatsik gabe menderatzeko!
        </p>

        {/* Continue Button */}
        <button
          onClick={onClose}
          id="close-streak-celebration-btn"
          className="w-full py-3 px-4 bg-neutral-950 hover:bg-neutral-800 text-white rounded-xl border-2 border-black shadow-[4px_4px_0_0_#000] text-sm font-black flex items-center justify-center gap-2 cursor-pointer transition-all active:translate-x-0.5 active:translate-y-0.5"
        >
          <span>Aurrera Jarraitu</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
