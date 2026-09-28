import React from 'react';
import { Sparkles } from 'lucide-react';
import { GrammarLesson } from '../types';

interface DailyGrammarCardProps {
  lesson?: GrammarLesson;
  onClick: () => void;
}

export const DailyGrammarCard: React.FC<DailyGrammarCardProps> = ({
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className="w-full px-4 py-3 bg-white hover:bg-amber-50/70 text-neutral-950 border-3 border-black rounded-xl shadow-[3px_3px_0_0_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0_0_#000] cursor-pointer transition-all text-left flex items-center justify-between gap-3 group"
      aria-label="Eguneko Gramatika"
    >
      <div className="min-w-0 flex-1">
        <h3 className="text-base sm:text-lg font-black leading-tight text-neutral-950">
          Eguneko Gramatika
        </h3>
      </div>

      <div className="w-9 h-9 bg-amber-300 rounded-lg border-2 border-black flex items-center justify-center shrink-0 shadow-[1px_1px_0_0_#000] group-hover:scale-105 transition-transform">
        <Sparkles className="w-4.5 h-4.5 text-neutral-950 fill-amber-400" />
      </div>
    </button>
  );
};

