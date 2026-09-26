import React, { useState } from 'react';
import {
  X,
  CheckCircle,
  XCircle,
  Sparkles,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  CheckCircle2,
  Info,
  HelpCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Question } from '../types';
import { playCorrectSound, playWrongSound } from '../utils/audio';

export interface QuestionReviewItem {
  questionIndex: number;
  question: Question;
  userAnswerIndex: number; // 0..3 (-1 if skipped)
  isCorrect: boolean;
  isCleaned?: boolean;
}

interface GameReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  reviewItems: QuestionReviewItem[];
  onUpdateReviewItems?: (items: QuestionReviewItem[]) => void;
}

const OPTION_LETTERS = ['A', 'B', 'C', 'D'] as const;

export const GameReviewModal: React.FC<GameReviewModalProps> = ({
  isOpen,
  onClose,
  reviewItems,
  onUpdateReviewItems,
}) => {
  const [filter, setFilter] = useState<'all' | 'mistakes' | 'correct'>('all');
  const [isPracticeMode, setIsPracticeMode] = useState(false);
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [practiceSelectedOption, setPracticeSelectedOption] = useState<number | null>(null);
  const [practiceHasAnswered, setPracticeHasAnswered] = useState(false);
  const [practiceFinished, setPracticeFinished] = useState(false);
  const [expandedExplanations, setExpandedExplanations] = useState<Record<number, boolean>>({});

  // Local state of review items (allows marking mistakes as cleaned)
  const [items, setItems] = useState<QuestionReviewItem[]>(reviewItems);

  // Sync if props change
  React.useEffect(() => {
    setItems(reviewItems);
  }, [reviewItems]);

  if (!isOpen) return null;

  // Filtered lists
  const mistakes = items.filter(item => !item.isCorrect && !item.isCleaned);
  const allMistakesHistory = items.filter(item => !item.isCorrect);
  const correctItems = items.filter(item => item.isCorrect);

  const displayedItems =
    filter === 'mistakes'
      ? allMistakesHistory
      : filter === 'correct'
      ? correctItems
      : items;

  // Practice items: focus on uncleaned mistakes (or all mistakes if all already cleaned)
  const practiceList = mistakes.length > 0 ? mistakes : allMistakesHistory;
  const currentPracticeItem = practiceList[practiceIndex];

  const handleStartPractice = () => {
    if (practiceList.length === 0) return;
    setIsPracticeMode(true);
    setPracticeIndex(0);
    setPracticeSelectedOption(null);
    setPracticeHasAnswered(false);
    setPracticeFinished(false);
  };

  const handlePracticeSelectOption = (idx: number) => {
    if (practiceHasAnswered || !currentPracticeItem) return;

    setPracticeSelectedOption(idx);
    setPracticeHasAnswered(true);

    const isCorrect = idx === currentPracticeItem.question.correctIndex;
    if (isCorrect) {
      playCorrectSound();
      // Mark as cleaned!
      const updated = items.map(it => {
        if (it.question.id === currentPracticeItem.question.id) {
          return { ...it, isCleaned: true };
        }
        return it;
      });
      setItems(updated);
      onUpdateReviewItems?.(updated);
    } else {
      playWrongSound();
    }
  };

  const handlePracticeNext = () => {
    if (practiceIndex < practiceList.length - 1) {
      setPracticeIndex(prev => prev + 1);
      setPracticeSelectedOption(null);
      setPracticeHasAnswered(false);
    } else {
      // Completed practice!
      setPracticeFinished(true);
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch {}
    }
  };

  const toggleExplanation = (idx: number) => {
    setExpandedExplanations(prev => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs select-none animate-in fade-in duration-150">
      <div className="w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl border-4 border-black shadow-[8px_8px_0_0_#000] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-yellow-300 border-b-4 border-black flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white border-2 border-black flex items-center justify-center shadow-[2px_2px_0_0_#000]">
              <BookOpen className="w-5 h-5 text-neutral-950" />
            </div>
            <div>
              <h2 className="text-xl font-black text-neutral-950 leading-tight">
                {isPracticeMode ? 'Akatsak Garbitu (Praktika)' : 'Partida Berrikusi'}
              </h2>
              <p className="text-xs font-bold text-neutral-800">
                {isPracticeMode
                  ? 'Erantzun berriz huts egindako galderak kontzeptuak finkatzeko'
                  : 'Gaurko 20 galderak: egiaztatu asmatutakoak eta garbitu akatsak'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 bg-white hover:bg-neutral-100 border-2 border-black rounded-lg shadow-[2px_2px_0_0_#000] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
            aria-label="Itxi"
          >
            <X className="w-5 h-5 text-neutral-950" />
          </button>
        </div>

        {/* Practice Mode Active */}
        {isPracticeMode ? (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col justify-between">
            {practiceFinished ? (
              <div className="py-10 text-center my-auto">
                <div className="w-16 h-16 bg-emerald-100 border-3 border-black rounded-2xl mx-auto flex items-center justify-center text-3xl mb-3 shadow-[3px_3px_0_0_#000]">
                  ✨
                </div>
                <h3 className="text-2xl font-black text-neutral-950 mb-2">
                  Akatsak Garbituta!
                </h3>
                <p className="text-sm font-bold text-neutral-600 max-w-sm mx-auto mb-6">
                  Bikain! Huts egindako galderak landu eta arau gramatikalak argitu dituzu.
                </p>
                <button
                  onClick={() => setIsPracticeMode(false)}
                  className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white font-black text-sm rounded-xl border-2 border-black shadow-[3px_3px_0_0_#000] cursor-pointer"
                >
                  Itzuli Partidaren Zerrendara
                </button>
              </div>
            ) : currentPracticeItem ? (
              <div className="space-y-4">
                {/* Practice Top Progress */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setIsPracticeMode(false)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-neutral-600 hover:text-black cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Zerrendara</span>
                  </button>

                  <span className="text-xs font-black text-neutral-500 bg-neutral-100 px-2.5 py-1 rounded-lg border border-neutral-300">
                    Galdera {practiceIndex + 1} / {practiceList.length}
                  </span>
                </div>

                {/* Question Prompt */}
                <div className="p-4 bg-neutral-50 rounded-2xl border-2 border-black shadow-[3px_3px_0_0_#000]">
                  <span className="text-[10px] font-black uppercase text-neutral-400 block mb-1">
                    {currentPracticeItem.question.category || 'Mistoa'}
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-neutral-950 leading-snug">
                    {currentPracticeItem.question.prompt}
                  </h3>
                </div>

                {/* 4 Interactive Options */}
                <div className="space-y-2">
                  {currentPracticeItem.question.options.map((opt, optIdx) => {
                    const isSelected = practiceSelectedOption === optIdx;
                    const isCorrect = optIdx === currentPracticeItem.question.correctIndex;

                    let btnStyle = 'bg-white hover:bg-neutral-50 border-black';
                    if (practiceHasAnswered) {
                      if (isCorrect) {
                        btnStyle = 'bg-emerald-100 border-emerald-600 text-emerald-950';
                      } else if (isSelected) {
                        btnStyle = 'bg-rose-100 border-rose-600 text-rose-950';
                      } else {
                        btnStyle = 'bg-neutral-50 border-neutral-300 text-neutral-400';
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        onClick={() => handlePracticeSelectOption(optIdx)}
                        disabled={practiceHasAnswered}
                        className={`w-full p-3.5 rounded-xl border-2 font-bold text-sm text-left flex items-center justify-between transition-all ${btnStyle} ${
                          !practiceHasAnswered ? 'cursor-pointer active:translate-y-[1px]' : ''
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-6 h-6 rounded-md bg-neutral-200 border border-black/30 font-black text-xs flex items-center justify-center shrink-0">
                            {OPTION_LETTERS[optIdx]}
                          </span>
                          <span>{opt}</span>
                        </div>

                        {practiceHasAnswered && isCorrect && (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                        )}
                        {practiceHasAnswered && isSelected && !isCorrect && (
                          <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation Card upon answering */}
                {practiceHasAnswered && (
                  <div className="p-3.5 bg-sky-50 border-2 border-sky-400 rounded-xl space-y-1.5 animate-in fade-in duration-150">
                    <span className="text-[10px] font-black uppercase text-sky-800 flex items-center gap-1">
                      <Info className="w-3.5 h-3.5" />
                      Azalpen Pedagogikoa
                    </span>
                    <p className="text-xs font-bold text-sky-950">
                      {currentPracticeItem.question.explanation?.whyCorrect ||
                        `"${currentPracticeItem.question.options[currentPracticeItem.question.correctIndex]}" da forma zuzena.`}
                    </p>
                  </div>
                )}

                {/* Next button */}
                {practiceHasAnswered && (
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={handlePracticeNext}
                      className="px-5 py-2.5 bg-yellow-300 hover:bg-yellow-200 text-neutral-950 font-black text-sm rounded-xl border-2 border-black shadow-[3px_3px_0_0_#000] flex items-center gap-2 cursor-pointer"
                    >
                      <span>
                        {practiceIndex < practiceList.length - 1 ? 'Hurrengoa' : 'Amaitu'}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        ) : (
          /* Review List Mode */
          <>
            {/* Top Toolbar: Filters and Practice CTA */}
            <div className="p-3 bg-neutral-100 border-b-2 border-black flex items-center justify-between gap-2 flex-wrap shrink-0">
              {/* Filter Tabs */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-3 py-1.5 rounded-lg border-2 font-black text-xs transition-all cursor-pointer ${
                    filter === 'all'
                      ? 'bg-neutral-900 text-white border-black shadow-[1px_1px_0_0_#000]'
                      : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50'
                  }`}
                >
                  Guztiak ({items.length})
                </button>

                <button
                  onClick={() => setFilter('mistakes')}
                  className={`px-3 py-1.5 rounded-lg border-2 font-black text-xs transition-all cursor-pointer ${
                    filter === 'mistakes'
                      ? 'bg-rose-600 text-white border-black shadow-[1px_1px_0_0_#000]'
                      : 'bg-white text-rose-700 border-neutral-300 hover:bg-rose-50'
                  }`}
                >
                  Akatsak ({allMistakesHistory.length})
                </button>

                <button
                  onClick={() => setFilter('correct')}
                  className={`px-3 py-1.5 rounded-lg border-2 font-black text-xs transition-all cursor-pointer ${
                    filter === 'correct'
                      ? 'bg-emerald-600 text-white border-black shadow-[1px_1px_0_0_#000]'
                      : 'bg-white text-emerald-700 border-neutral-300 hover:bg-emerald-50'
                  }`}
                >
                  Asmatutakoak ({correctItems.length})
                </button>
              </div>

              {/* Practice CTA Button */}
              {allMistakesHistory.length > 0 && (
                <button
                  onClick={handleStartPractice}
                  className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-white border-2 border-black rounded-lg font-black text-xs shadow-[2px_2px_0_0_#000] flex items-center gap-1.5 cursor-pointer active:translate-x-[1px] active:translate-y-[1px]"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Akatsak Garbitu</span>
                </button>
              )}
            </div>

            {/* List of 20 Questions */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
              {displayedItems.length === 0 ? (
                <div className="py-12 text-center text-neutral-500 font-bold text-sm">
                  Ez dago galderarik kategoria honetan.
                </div>
              ) : (
                displayedItems.map((item, idx) => {
                  const q = item.question;
                  const userIdx = item.userAnswerIndex;
                  const correctIdx = q.correctIndex;
                  const isInitiallyCorrect = item.isCorrect;
                  const isCleaned = item.isCleaned;
                  const isExpanded = Boolean(expandedExplanations[idx]);

                  return (
                    <div
                      key={q.id || idx}
                      className={`p-4 rounded-xl border-2 border-black shadow-[3px_3px_0_0_#000] space-y-3 ${
                        isInitiallyCorrect
                          ? 'bg-white'
                          : isCleaned
                          ? 'bg-emerald-50/60'
                          : 'bg-rose-50/50'
                      }`}
                    >
                      {/* Header line: Question number, category, and status badge */}
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded bg-neutral-200 border border-neutral-400 font-black text-xs text-neutral-800 flex items-center justify-center shrink-0">
                            {item.questionIndex + 1}
                          </span>
                          <span className="text-[10px] font-black uppercase tracking-wider text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded border border-neutral-200">
                            {q.category || 'Mistoa'}
                          </span>
                        </div>

                        {/* Status Badge */}
                        {isInitiallyCorrect ? (
                          <span className="px-2 py-0.5 bg-emerald-100 border border-emerald-400 text-emerald-950 rounded text-xs font-black flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-700" />
                            <span>Asmatuta</span>
                          </span>
                        ) : isCleaned ? (
                          <span className="px-2 py-0.5 bg-emerald-200 border border-emerald-500 text-emerald-950 rounded text-xs font-black flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5 text-emerald-800" />
                            <span>Garbituta ✓</span>
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-rose-100 border border-rose-400 text-rose-950 rounded text-xs font-black flex items-center gap-1">
                            <XCircle className="w-3.5 h-3.5 text-rose-700" />
                            <span>Huts eginda</span>
                          </span>
                        )}
                      </div>

                      {/* Question Prompt */}
                      <h3 className="font-black text-sm sm:text-base text-neutral-950 leading-snug">
                        {q.prompt}
                      </h3>

                      {/* Options Review: Shows all options with clean indicators */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        {q.options.map((opt, optIdx) => {
                          const isUserChoice = userIdx === optIdx;
                          const isOptionCorrect = correctIdx === optIdx;

                          let optionStyle = 'bg-neutral-50 border-neutral-300 text-neutral-700';
                          if (isOptionCorrect) {
                            optionStyle = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-black';
                          } else if (isUserChoice && !isInitiallyCorrect) {
                            optionStyle = 'bg-rose-50 border-rose-400 text-rose-950 line-through';
                          }

                          return (
                            <div
                              key={optIdx}
                              className={`p-2.5 rounded-lg border-2 flex items-center justify-between text-xs sm:text-sm ${optionStyle}`}
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <span className="w-5 h-5 rounded bg-neutral-200 border border-black/30 font-black text-[11px] flex items-center justify-center shrink-0">
                                  {OPTION_LETTERS[optIdx]}
                                </span>
                                <span className="truncate">{opt}</span>
                              </div>

                              <div className="shrink-0 flex items-center gap-1">
                                {isUserChoice && (
                                  <span className="text-[10px] font-black uppercase text-neutral-600 bg-white px-1.5 py-0.2 rounded border border-neutral-300">
                                    Zuk
                                  </span>
                                )}
                                {isOptionCorrect && (
                                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Pedagogical Explanation Toggle */}
                      <div className="pt-1">
                        <button
                          onClick={() => toggleExplanation(idx)}
                          className="text-[11px] font-black text-neutral-600 hover:text-black flex items-center gap-1 cursor-pointer"
                        >
                          <HelpCircle className="w-3.5 h-3.5 text-sky-600" />
                          <span>
                            {isExpanded
                              ? 'Ezkutatu azalpen pedagogikoa'
                              : isInitiallyCorrect
                              ? 'Azalpen pedagogikoa ikusi (zoriaz asmatu bada ere egiaztatu)'
                              : 'Zergatik da hau forma zuzena? (Ikusi azalpena)'}
                          </span>
                        </button>

                        {isExpanded && (
                          <div className="mt-2 p-3 bg-sky-50 border-2 border-sky-300 rounded-xl space-y-1 animate-in fade-in duration-150">
                            <span className="text-[10px] font-black uppercase text-sky-800 block">
                              Arau Gramatikala & Arrazoia
                            </span>
                            <p className="text-xs font-bold text-sky-950">
                              {q.explanation?.whyCorrect ||
                                `"${q.options[correctIdx]}" da euskara batuaren arauen arabera aukera egokia.`}
                            </p>
                            {q.explanation?.tip && (
                              <p className="text-[11px] font-medium text-sky-800 pt-0.5">
                                💡 Aholkua: {q.explanation.tip}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="p-3 bg-neutral-100 border-t-2 border-black flex items-center justify-between shrink-0">
              <div className="text-xs font-bold text-neutral-600">
                {allMistakesHistory.length === 0 ? (
                  <span className="text-emerald-700 font-black">
                    🎉 20 galderak asmatuta!
                  </span>
                ) : mistakes.length === 0 ? (
                  <span className="text-emerald-700 font-black flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Akats guztiak garbituta daude!</span>
                  </span>
                ) : (
                  <span>
                    <span className="text-rose-700 font-black">{mistakes.length} akats</span>{' '}
                    garbitu gabe
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {allMistakesHistory.length > 0 && (
                  <button
                    onClick={handleStartPractice}
                    className="px-3.5 py-1.5 bg-yellow-300 hover:bg-yellow-200 text-neutral-950 font-black text-xs rounded-xl border-2 border-black shadow-[2px_2px_0_0_#000] flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Praktikatu</span>
                  </button>
                )}

                <button
                  onClick={onClose}
                  className="px-4 py-1.5 bg-neutral-950 hover:bg-neutral-800 text-white font-black text-xs rounded-xl border-2 border-black shadow-[2px_2px_0_0_#000] cursor-pointer"
                >
                  Itxi
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
