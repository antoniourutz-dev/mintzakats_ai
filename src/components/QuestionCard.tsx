import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, ArrowRight, Lightbulb, BookOpen, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import { Question } from '../types';

interface QuestionCardProps {
  question: Question;
  selectedOption: number | null;
  hasAnswered: boolean;
  onSelectOption: (optionIndex: number) => void;
  onNextQuestion: () => void;
  isLastQuestion: boolean;
  onOpenMistakesNotebook?: () => void;
}

const OPTION_LETTERS = ['A', 'B', 'C', 'D'] as const;

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  selectedOption,
  hasAnswered,
  onSelectOption,
  onNextQuestion,
  isLastQuestion,
  onOpenMistakesNotebook,
}) => {
  const [showDeepDetails, setShowDeepDetails] = useState(false);

  // Reset deep details toggle on question change
  useEffect(() => {
    setShowDeepDetails(false);
  }, [question.id]);

  const handleOptionClick = (idx: number) => {
    if (hasAnswered) return;
    onSelectOption(idx);
  };

  const isUserCorrect = selectedOption === question.correctIndex;

  return (
    <div className="w-full max-w-3xl mx-auto px-3 sm:px-4 py-2 sm:py-3 flex flex-col justify-start">
      {/* Question Prompt */}
      <h2 className="text-lg sm:text-xl md:text-2xl font-black text-neutral-950 leading-snug mb-3 tracking-tight">
        {question.prompt}
      </h2>

      {/* 4 Options Grid (2 columns on sm+ screens to eliminate vertical scrolling) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5 mb-3">
        {question.options.map((optionText, idx) => {
          const letter = OPTION_LETTERS[idx];
          const isSelected = selectedOption === idx;
          const isCorrect = idx === question.correctIndex;

          let cardStyle = 'bg-white hover:bg-neutral-50 border-black text-neutral-900 shadow-[3px_3px_0px_0px_#000000]';
          let badgeStyle = 'bg-white text-neutral-900 border-black';

          if (hasAnswered) {
            if (isCorrect) {
              cardStyle = 'bg-emerald-50 border-emerald-900 text-emerald-950 shadow-[3px_3px_0px_0px_#065f46]';
              badgeStyle = 'bg-emerald-600 text-white border-emerald-900';
            } else if (isSelected && !isCorrect) {
              cardStyle = 'bg-rose-50 border-rose-900 text-rose-950 shadow-[3px_3px_0px_0px_#9f1239]';
              badgeStyle = 'bg-rose-600 text-white border-rose-900';
            } else {
              cardStyle = 'bg-white/70 border-neutral-300 text-neutral-400 shadow-[1px_1px_0_0_#ccc] opacity-60';
              badgeStyle = 'bg-neutral-100 text-neutral-400 border-neutral-300';
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleOptionClick(idx)}
              disabled={hasAnswered}
              id={`question-option-${letter.toLowerCase()}`}
              className={`w-full flex items-center justify-between p-2.5 sm:p-3 rounded-xl border-2 transition-all text-left min-h-[52px] ${cardStyle} ${
                !hasAnswered ? 'cursor-pointer active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0_0_#000]' : 'cursor-default'
              }`}
            >
              <div className="flex items-center min-w-0 pr-2">
                {/* Circle Letter Badge */}
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 flex items-center justify-center font-black text-xs sm:text-sm mr-2.5 shrink-0 transition-colors ${badgeStyle}`}
                >
                  {letter}
                </div>

                {/* Option Text */}
                <span className="font-bold text-xs sm:text-sm md:text-base leading-snug break-words">
                  {optionText}
                </span>
              </div>

              {/* Status Icon */}
              {hasAnswered && (
                <div className="shrink-0 ml-1.5">
                  {isCorrect && (
                    <CheckCircle className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                  )}
                  {isSelected && !isCorrect && (
                    <XCircle className="w-5 h-5 text-rose-600 fill-rose-100" />
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Immediate Pedagogical Feedback & Next Button (Egunean Behin consecutive flow) */}
      {hasAnswered && (
        <div
          id="grammar-explanation-card"
          className={`w-full p-3 sm:p-4 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_#000000] transition-all animate-in fade-in duration-200 ${
            isUserCorrect ? 'bg-emerald-50/95' : 'bg-rose-50/95'
          }`}
        >
          {/* Top Feedback Banner & Next Question CTA */}
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <div className="flex items-center gap-2 min-w-0">
              {isUserCorrect ? (
                <div className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg border-2 border-black shadow-[2px_2px_0_0_#000] text-xs sm:text-sm font-black flex items-center gap-1.5 shrink-0">
                  <CheckCircle className="w-4 h-4" />
                  <span>BIKAIN! (+10 XP)</span>
                </div>
              ) : (
                <div className="px-2.5 py-1 bg-rose-600 text-white rounded-lg border-2 border-black shadow-[2px_2px_0_0_#000] text-xs sm:text-sm font-black flex items-center gap-1.5 shrink-0">
                  <AlertTriangle className="w-4 h-4" />
                  <span>AKATSA!</span>
                </div>
              )}

              {!isUserCorrect && onOpenMistakesNotebook && (
                <span className="hidden sm:inline-block text-[10px] font-black text-rose-800 bg-rose-200/80 px-2 py-0.5 rounded border border-rose-400 truncate">
                  Akatsen koadernoan gorde da
                </span>
              )}
            </div>

            {/* Direct Consecutive Next Button */}
            <button
              onClick={onNextQuestion}
              id="next-question-btn"
              className="flex items-center gap-1.5 px-4 py-2 bg-neutral-950 hover:bg-neutral-800 active:translate-x-0.5 active:translate-y-0.5 text-white rounded-lg border-2 border-black shadow-[3px_3px_0_0_#000000] text-xs sm:text-sm font-black transition-all cursor-pointer shrink-0"
            >
              <span>{isLastQuestion ? 'Emaitzak Ikusi' : 'Hurrengo Galdera'}</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>

          {/* Grammar Rule & Tip Box (Compact & zero-scroll) */}
          <div className="bg-white p-2.5 sm:p-3 rounded-lg border-2 border-black shadow-[2px_2px_0_0_#000] space-y-1.5">
            <div className="flex items-start gap-1.5">
              <BookOpen className="w-4 h-4 text-neutral-800 shrink-0 mt-0.5" />
              <p className="text-xs sm:text-sm font-bold text-neutral-900 leading-snug">
                <span className="font-black text-neutral-950">Arau Gramatikala: </span>
                {question.explanation.rule}
              </p>
            </div>

            <div className="flex items-start gap-1.5 pt-1 border-t border-neutral-200 text-amber-950">
              <Lightbulb className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-[11px] sm:text-xs font-bold text-amber-900 leading-tight">
                <span className="font-black text-amber-950">Gogoratzeko aholkua: </span>
                {question.explanation.tip}
              </p>
            </div>
          </div>

          {/* Expandable Deep Details (Toggle to prevent scroll if not requested) */}
          <div className="mt-2 pt-1.5 flex items-center justify-between">
            <button
              onClick={() => setShowDeepDetails(!showDeepDetails)}
              id="toggle-deep-explanation-btn"
              className="flex items-center gap-1 text-[11px] font-black text-neutral-700 hover:text-black cursor-pointer underline underline-offset-2"
            >
              <span>{showDeepDetails ? 'Itxi xehetasunak' : 'Ikusi zergatik den zuzena eta okerrak'}</span>
              {showDeepDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>

            {!isUserCorrect && (
              <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-400">
                Zuzena: «{OPTION_LETTERS[question.correctIndex]}» ({question.options[question.correctIndex]})
              </span>
            )}
          </div>

          {showDeepDetails && (
            <div className="mt-2 space-y-2 animate-in fade-in duration-150">
              <div className="bg-white p-2.5 rounded-lg border border-neutral-300 text-xs text-neutral-800">
                <span className="font-black text-emerald-700 block mb-0.5">
                  Zergatik da zuzena «{OPTION_LETTERS[question.correctIndex]}»?
                </span>
                <p>{question.explanation.whyCorrect}</p>
              </div>

              {question.explanation.whyWrongOptions && question.explanation.whyWrongOptions.length > 0 && (
                <div className="bg-white p-2.5 rounded-lg border border-neutral-300 text-xs text-neutral-700 space-y-1">
                  <span className="font-black text-rose-700 block mb-0.5">
                    Zergatik dira okerrak beste aukerak?
                  </span>
                  {question.explanation.whyWrongOptions.map((item, i) => (
                    <div key={i} className="flex items-start gap-1 text-[11px]">
                      <span className="w-3.5 h-3.5 rounded-full bg-neutral-200 text-neutral-900 font-black text-[9px] flex items-center justify-center shrink-0 mt-0.5">
                        {item.letter}
                      </span>
                      <span>{item.reason}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
