import React, { useEffect } from 'react';
import { CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { Question } from '../types';

interface QuestionCardProps {
  question: Question;
  selectedOption: number | null;
  hasAnswered: boolean;
  onSelectOption: (optionIndex: number) => void;
  onNextQuestion: () => void;
  isLastQuestion: boolean;
}

const OPTION_LETTERS = ['A', 'B', 'C', 'D'] as const;

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  selectedOption,
  hasAnswered,
  onSelectOption,
  onNextQuestion,
  isLastQuestion,
}) => {
  // Keyboard navigation for desktop efficiency (1-4, A-D, Enter/Space for next)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      const key = e.key.toLowerCase();

      if (!hasAnswered) {
        if (key === '1' || key === 'a') {
          e.preventDefault();
          onSelectOption(0);
        } else if (key === '2' || key === 'b') {
          e.preventDefault();
          onSelectOption(1);
        } else if (key === '3' || key === 'c') {
          e.preventDefault();
          onSelectOption(2);
        } else if (key === '4' || key === 'd') {
          e.preventDefault();
          onSelectOption(3);
        }
      } else {
        if (key === 'enter' || key === ' ' || key === 'arrowright') {
          e.preventDefault();
          onNextQuestion();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasAnswered, onSelectOption, onNextQuestion]);

  const isUserCorrect = selectedOption === question.correctIndex;

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-4 sm:py-6 flex flex-col justify-center animate-in fade-in duration-200">
      {/* Question Prompt Card */}
      <div className="w-full bg-white p-5 sm:p-7 rounded-2xl border-4 border-black shadow-[6px_6px_0_0_#000] mb-4">
        <h2 className="text-xl sm:text-2xl font-black text-neutral-950 leading-relaxed tracking-tight text-center">
          {question.prompt}
        </h2>
      </div>

      {/* Options Grid (4 large accessible buttons) */}
      <div className="grid grid-cols-1 gap-2.5 sm:gap-3 mb-4">
        {question.options.map((optionText, idx) => {
          const letter = OPTION_LETTERS[idx];
          const isSelected = selectedOption === idx;
          const isCorrect = idx === question.correctIndex;

          let btnStyle = 'bg-white hover:bg-neutral-50 border-black text-neutral-900 shadow-[3px_3px_0_0_#000] active:translate-x-[1px] active:translate-y-[1px]';
          let letterStyle = 'bg-neutral-100 text-neutral-900 border-neutral-300';

          if (hasAnswered) {
            if (isCorrect) {
              btnStyle = 'bg-emerald-100 border-emerald-600 text-emerald-950 font-black shadow-[3px_3px_0_0_#059669] ring-2 ring-emerald-500';
              letterStyle = 'bg-emerald-600 text-white border-emerald-700';
            } else if (isSelected) {
              btnStyle = 'bg-rose-100 border-rose-600 text-rose-950 font-black shadow-[3px_3px_0_0_#e11d48] ring-2 ring-rose-500';
              letterStyle = 'bg-rose-600 text-white border-rose-700';
            } else {
              btnStyle = 'bg-neutral-50/70 border-neutral-300 text-neutral-400 opacity-60 shadow-none cursor-default';
              letterStyle = 'bg-neutral-200 text-neutral-400 border-neutral-300';
            }
          }

          return (
            <button
              key={idx}
              onClick={() => !hasAnswered && onSelectOption(idx)}
              disabled={hasAnswered}
              className={`w-full p-4 rounded-xl border-3 text-left transition-all flex items-center justify-between gap-3 cursor-pointer disabled:cursor-default ${btnStyle}`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className={`w-8 h-8 rounded-lg border-2 font-black text-sm flex items-center justify-center shrink-0 ${letterStyle}`}>
                  {letter}
                </span>
                <span className="font-bold text-base sm:text-lg leading-snug">
                  {optionText}
                </span>
              </div>

              {hasAnswered && (
                <div className="shrink-0">
                  {isCorrect && (
                    <CheckCircle className="w-6 h-6 text-emerald-600" />
                  )}
                  {isSelected && !isCorrect && (
                    <XCircle className="w-6 h-6 text-rose-600" />
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Immediate Next Button without any explanation text */}
      {hasAnswered && (
        <div className="w-full flex items-center justify-between gap-3 pt-2 animate-in fade-in duration-150">
          <div className="flex items-center gap-2">
            {isUserCorrect ? (
              <span className="px-3 py-1.5 bg-emerald-100 text-emerald-900 border-2 border-emerald-500 rounded-xl text-xs sm:text-sm font-black flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                Zuzena!
              </span>
            ) : (
              <span className="px-3 py-1.5 bg-rose-100 text-rose-900 border-2 border-rose-500 rounded-xl text-xs sm:text-sm font-black flex items-center gap-1.5">
                <XCircle className="w-4 h-4 text-rose-600" />
                Akatsa!
              </span>
            )}
          </div>

          <button
            onClick={onNextQuestion}
            id="next-question-btn"
            className="flex items-center gap-2 px-5 py-2.5 bg-neutral-950 hover:bg-neutral-800 text-white rounded-xl border-2 border-black shadow-[3px_3px_0_0_#000] text-sm font-black cursor-pointer active:translate-x-[1px] active:translate-y-[1px] transition-all"
          >
            <span>{isLastQuestion ? 'Emaitzak Ikusi' : 'Hurrengoa'}</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      )}
    </div>
  );
};
