import React from 'react';
import { X, CheckCircle, XCircle } from 'lucide-react';
import { Question } from '../types';

export interface LastGameMistakeItem {
  question: Question;
  userAnswerIndex: number;
}

interface MistakesReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  mistakes: LastGameMistakeItem[];
}

const OPTION_LETTERS = ['A', 'B', 'C', 'D'] as const;

export const MistakesReviewModal: React.FC<MistakesReviewModalProps> = ({
  isOpen,
  onClose,
  mistakes,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs select-none">
      <div className="w-full max-w-xl max-h-[85vh] bg-white rounded-2xl border-4 border-black shadow-[8px_8px_0_0_#000] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 border-b-3 border-black bg-rose-50 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-xl font-black text-neutral-950 leading-tight">
              Akatsak
            </h2>
            <p className="text-xs font-bold text-neutral-600">
              Azken partidan huts egindako galderak ({mistakes.length})
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 bg-white hover:bg-neutral-100 border-2 border-black rounded-lg shadow-[2px_2px_0_0_#000] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
            aria-label="Itxi"
          >
            <X className="w-5 h-5 text-neutral-950" />
          </button>
        </div>

        {/* Mistakes List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {mistakes.length === 0 ? (
            <div className="py-12 text-center">
              <span className="text-4xl block mb-2">🎉</span>
              <p className="text-base font-black text-neutral-900">
                Ez duzu akatsik egin azken partidan!
              </p>
            </div>
          ) : (
            mistakes.map((item, idx) => {
              const q = item.question;
              const userIdx = item.userAnswerIndex;
              const correctIdx = q.correctIndex;

              return (
                <div
                  key={q.id || idx}
                  className="p-4 rounded-xl border-2 border-black bg-neutral-50 shadow-[3px_3px_0_0_#000] space-y-3"
                >
                  {/* Question Prompt */}
                  <div className="flex items-start gap-2">
                    <span className="px-2 py-0.5 bg-neutral-200 border border-neutral-400 rounded text-xs font-black text-neutral-800 shrink-0">
                      {idx + 1}
                    </span>
                    <h3 className="font-bold text-sm sm:text-base text-neutral-950 leading-snug">
                      {q.prompt}
                    </h3>
                  </div>

                  {/* Options Comparison (Only Correct vs Selected) */}
                  <div className="space-y-1.5 pt-1">
                    {/* User's wrong answer */}
                    {userIdx >= 0 && userIdx < q.options.length && userIdx !== correctIdx && (
                      <div className="p-2.5 bg-rose-50 border-2 border-rose-400 rounded-lg flex items-center justify-between text-xs sm:text-sm font-bold text-rose-950">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded bg-rose-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                            {OPTION_LETTERS[userIdx]}
                          </span>
                          <span>{q.options[userIdx]}</span>
                        </div>
                        <span className="text-[11px] font-black text-rose-700 flex items-center gap-1 shrink-0">
                          <XCircle className="w-3.5 h-3.5" />
                          Zuk hautatua
                        </span>
                      </div>
                    )}

                    {/* Correct answer */}
                    <div className="p-2.5 bg-emerald-50 border-2 border-emerald-500 rounded-lg flex items-center justify-between text-xs sm:text-sm font-bold text-emerald-950">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                          {OPTION_LETTERS[correctIdx]}
                        </span>
                        <span className="font-extrabold">{q.options[correctIdx]}</span>
                      </div>
                      <span className="text-[11px] font-black text-emerald-700 flex items-center gap-1 shrink-0">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Zuzena
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-neutral-100 border-t-2 border-black flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-neutral-950 hover:bg-neutral-800 text-white font-black text-xs rounded-xl border-2 border-black shadow-[2px_2px_0_0_#000] cursor-pointer"
          >
            Itxi
          </button>
        </div>
      </div>
    </div>
  );
};
