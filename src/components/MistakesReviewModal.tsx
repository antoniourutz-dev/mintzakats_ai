import React, { useState } from 'react';
import { X, BookOpen, RotateCcw, CheckCircle, AlertTriangle, ArrowRight, Sparkles, Filter } from 'lucide-react';
import { UserMistake, Question } from '../types';
import { QUESTION_MAP } from '../data';

interface MistakesReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  mistakes: Record<string, UserMistake>;
  onCorrectMistake: (questionId: string) => void;
  onFailMistakeAgain: (questionId: string) => void;
}

const OPTION_LETTERS = ['A', 'B', 'C', 'D'] as const;

export const MistakesReviewModal: React.FC<MistakesReviewModalProps> = ({
  isOpen,
  onClose,
  mistakes,
  onCorrectMistake,
  onFailMistakeAgain,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [practiceMode, setPracticeMode] = useState<boolean>(false);
  const [practiceIndex, setPracticeIndex] = useState<number>(0);
  const [practiceSelected, setPracticeSelected] = useState<number | null>(null);
  const [practiceAnswered, setPracticeAnswered] = useState<boolean>(false);

  if (!isOpen) return null;

  const mistakeList = Object.values(mistakes).map(m => ({
    mistake: m,
    question: QUESTION_MAP[m.questionId]
  })).filter(item => Boolean(item.question));

  const categories = Array.from(new Set(mistakeList.map(item => item.question.category)));

  const filteredList = filterCategory === 'all'
    ? mistakeList
    : mistakeList.filter(item => item.question.category === filterCategory);

  const startPractice = () => {
    if (filteredList.length === 0) return;
    setPracticeMode(true);
    setPracticeIndex(0);
    setPracticeSelected(null);
    setPracticeAnswered(false);
  };

  const handlePracticeOption = (idx: number, currentQuestion: Question) => {
    if (practiceAnswered) return;
    setPracticeSelected(idx);
    setPracticeAnswered(true);

    if (idx === currentQuestion.correctIndex) {
      onCorrectMistake(currentQuestion.id);
    } else {
      onFailMistakeAgain(currentQuestion.id);
    }
  };

  const nextPracticeQuestion = () => {
    if (practiceIndex + 1 < filteredList.length) {
      setPracticeIndex(prev => prev + 1);
      setPracticeSelected(null);
      setPracticeAnswered(false);
    } else {
      // Completed practice round
      setPracticeMode(false);
      setPracticeIndex(0);
      setPracticeSelected(null);
      setPracticeAnswered(false);
    }
  };

  const currentPracticeItem = filteredList[practiceIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div 
        id="mistakes-review-dialog"
        className="w-full max-w-3xl max-h-[90vh] bg-white rounded-xl border-2 border-black shadow-[6px_6px_0_0_#000000] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b-2 border-black bg-rose-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-rose-500 border-2 border-black text-white flex items-center justify-center font-black shadow-[2px_2px_0_0_#000]">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-neutral-950 leading-tight">
                Akatsen Koadernoa
              </h2>
              <p className="text-xs font-bold text-neutral-600">
                Galdetegietan huts egindako galderen bilduma pertsonala
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            id="close-mistakes-modal-btn"
            className="p-1.5 rounded-lg border-2 border-black bg-white hover:bg-neutral-100 shadow-[2px_2px_0_0_#000] transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#F8F9FA]">
          {practiceMode && currentPracticeItem ? (
            /* Practice Flashcard Mode */
            <div className="max-w-xl mx-auto">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-black uppercase text-rose-700 bg-rose-100 px-2 py-0.5 rounded border border-rose-300">
                  Birpasatze Ariketa: {practiceIndex + 1} / {filteredList.length}
                </span>
                <button
                  onClick={() => setPracticeMode(false)}
                  className="text-xs font-bold text-neutral-600 hover:text-black underline cursor-pointer"
                >
                  Itzuli zerrendara
                </button>
              </div>

              {/* Question text */}
              <h3 className="text-xl sm:text-2xl font-black text-neutral-950 mb-6 leading-snug">
                {currentPracticeItem.question.prompt}
              </h3>

              {/* Options */}
              <div className="space-y-3 mb-6">
                {currentPracticeItem.question.options.map((opt, idx) => {
                  const letter = OPTION_LETTERS[idx];
                  const isSelected = practiceSelected === idx;
                  const isCorrect = idx === currentPracticeItem.question.correctIndex;

                  let style = 'bg-white hover:bg-neutral-50 border-black shadow-[3px_3px_0_0_#000]';
                  let badge = 'bg-white text-neutral-900 border-black';

                  if (practiceAnswered) {
                    if (isCorrect) {
                      style = 'bg-emerald-50 border-emerald-900 text-emerald-950 shadow-[3px_3px_0_0_#065f46]';
                      badge = 'bg-emerald-600 text-white border-emerald-900';
                    } else if (isSelected && !isCorrect) {
                      style = 'bg-rose-50 border-rose-900 text-rose-950 shadow-[3px_3px_0_0_#9f1239]';
                      badge = 'bg-rose-600 text-white border-rose-900';
                    } else {
                      style = 'bg-white/60 border-neutral-300 opacity-60';
                      badge = 'bg-neutral-100 text-neutral-400 border-neutral-300';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handlePracticeOption(idx, currentPracticeItem.question)}
                      disabled={practiceAnswered}
                      className={`w-full p-3.5 rounded-lg border-2 flex items-center justify-between text-left transition-all ${style} ${
                        !practiceAnswered ? 'cursor-pointer active:translate-x-[1px] active:translate-y-[1px]' : 'cursor-default'
                      }`}
                    >
                      <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-black text-sm mr-3 shrink-0 ${badge}`}>
                          {letter}
                        </div>
                        <span className="font-bold text-sm sm:text-base">{opt}</span>
                      </div>
                      {practiceAnswered && isCorrect && (
                        <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Feedback when answered */}
              {practiceAnswered && (
                <div className="p-4 bg-white rounded-lg border-2 border-black shadow-[3px_3px_0_0_#000] mb-4">
                  <p className="text-xs font-black uppercase tracking-wider text-neutral-500 mb-1">
                    Arau Gramatikala:
                  </p>
                  <p className="text-sm font-bold text-neutral-900 mb-3">
                    {currentPracticeItem.question.explanation.rule}
                  </p>
                  <p className="text-xs font-semibold text-neutral-700 mb-4">
                    {currentPracticeItem.question.explanation.whyCorrect}
                  </p>

                  <div className="flex justify-end">
                    <button
                      onClick={nextPracticeQuestion}
                      className="px-4 py-2 bg-neutral-950 hover:bg-neutral-800 text-white rounded-lg border-2 border-black shadow-[2px_2px_0_0_#000] text-sm font-black flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>{practiceIndex + 1 < filteredList.length ? 'Hurrengo Akatsa' : 'Amaitu Saioa'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : mistakeList.length === 0 ? (
            /* Zero Mistakes empty state */
            <div className="py-12 px-4 text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full border-2 border-black flex items-center justify-center mx-auto mb-4 shadow-[3px_3px_0_0_#000]">
                <Sparkles className="w-8 h-8 text-emerald-700" />
              </div>
              <h3 className="text-xl font-black text-neutral-900 mb-2">
                Zorionak! Ez daukazu akatsik oraintxe bertan!
              </h3>
              <p className="text-sm font-bold text-neutral-600 max-w-md mx-auto mb-6">
                Galderetan huts egiten duzun bakoitzean, hemen automatikoki gordeko dira azalpen gramatikalekin birpasatu ahal izateko.
              </p>
              <button
                onClick={onClose}
                className="px-5 py-2.5 bg-neutral-950 text-white font-black text-sm rounded-lg border-2 border-black shadow-[3px_3px_0_0_#000] cursor-pointer"
              >
                Jarraitu Jokora
              </button>
            </div>
          ) : (
            /* List of accumulated mistakes */
            <div>
              {/* Actions & Filters */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                {/* Category Filter */}
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-neutral-500" />
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="text-xs font-bold bg-white border-2 border-black rounded-lg px-2.5 py-1.5 shadow-[2px_2px_0_0_#000] cursor-pointer"
                  >
                    <option value="all">Kategoria guztiak ({mistakeList.length})</option>
                    {categories.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* Start Drill Button */}
                <button
                  onClick={startPractice}
                  className="flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg border-2 border-black shadow-[3px_3px_0_0_#000] text-xs font-black transition-all cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Akatsak Errepasatu ({filteredList.length})</span>
                </button>
              </div>

              {/* Cards List */}
              <div className="space-y-4">
                {filteredList.map(({ mistake, question }) => (
                  <div
                    key={question.id}
                    className="p-4 bg-white rounded-lg border-2 border-black shadow-[3px_3px_0_0_#000]"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-black uppercase tracking-wider bg-neutral-100 text-neutral-800 px-2 py-0.5 rounded border border-neutral-300">
                        {question.category} · {question.level}
                      </span>
                      <span className="text-[11px] font-bold text-rose-700 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        {mistake.timesFailed} aldiz huts eginda
                      </span>
                    </div>

                    <h4 className="text-base font-black text-neutral-950 mb-3">
                      {question.prompt}
                    </h4>

                    {/* Options summary */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                      <div className="p-2 rounded bg-emerald-50 border border-emerald-500 text-xs font-bold text-emerald-950">
                        <span className="font-black text-emerald-800 block">✓ ZUZENA:</span>
                        {question.options[question.correctIndex]}
                      </div>
                      {mistake.lastSelectedOption !== question.correctIndex && (
                        <div className="p-2 rounded bg-rose-50 border border-rose-400 text-xs font-bold text-rose-950">
                          <span className="font-black text-rose-800 block">✗ AUKERATU ZENUENEAN:</span>
                          {question.options[mistake.lastSelectedOption] || 'Beste bat'}
                        </div>
                      )}
                    </div>

                    {/* Rule */}
                    <div className="p-2.5 bg-neutral-50 rounded border border-neutral-300 text-xs font-medium text-neutral-800">
                      <span className="font-black text-neutral-900 block text-[11px] uppercase tracking-wider mb-0.5">
                        Arau nagusia:
                      </span>
                      {question.explanation.rule}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-white border-t-2 border-black flex justify-between items-center text-xs font-bold text-neutral-500">
          <span>Akatsetatik ikastea da euskara menderatzeko biderik ziurrena.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg border-2 border-black font-black cursor-pointer"
          >
            Itxi
          </button>
        </div>
      </div>
    </div>
  );
};
