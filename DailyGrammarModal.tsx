import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  BookOpen,
  Lightbulb,
  BookmarkCheck,
  Code2,
  Calendar,
  Lock,
  RotateCcw,
} from 'lucide-react';
import { GrammarLesson } from '../types';
import { getCycleGrammarSchedule, CycleDayGrammarSchedule } from '../services/grammarService';

interface DailyGrammarModalProps {
  isOpen: boolean;
  onClose: () => void;
  lesson: GrammarLesson | null;
  customStartDateStr?: string | null;
  dayNumberInBlock?: number;
  isAdmin?: boolean;
}

const SHORT_DAY_NAMES = ['1. Al', '2. As', '3. Az', '4. Og', '5. Or', '6. Lr', '7. Ig'];
const FULL_DAY_NAMES = [
  'Astelehena',
  'Asteartea',
  'Asteazkena',
  'Osteguna',
  'Ostirala',
  'Larunbata',
  'Igandea',
];

export const DailyGrammarModal: React.FC<DailyGrammarModalProps> = ({
  isOpen,
  onClose,
  lesson,
  customStartDateStr,
  dayNumberInBlock = 1,
  isAdmin = false,
}) => {
  const todayIndex = Math.max(0, Math.min(6, (dayNumberInBlock || 1) - 1));
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(todayIndex);
  const [cycleDays, setCycleDays] = useState<CycleDayGrammarSchedule[]>([]);
  const [loadingCycle, setLoadingCycle] = useState<boolean>(false);

  // Close on Escape key press
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Load 7-day cycle when opened
  useEffect(() => {
    if (!isOpen) return;

    // Reset selected day to today by default
    setSelectedDayIndex(todayIndex);

    let isMounted = true;
    setLoadingCycle(true);

    getCycleGrammarSchedule(customStartDateStr)
      .then(days => {
        if (isMounted) {
          setCycleDays(days);
          setLoadingCycle(false);
        }
      })
      .catch(err => {
        console.warn('Errorea zikloko gramatika kargatzean:', err);
        if (isMounted) {
          setLoadingCycle(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, customStartDateStr, todayIndex]);

  if (!isOpen) return null;

  // Active lesson to display: selected cycle day's lesson, or fallback to passed lesson if today
  const selectedCycleItem = cycleDays[selectedDayIndex];
  const activeLesson: GrammarLesson | null =
    selectedCycleItem?.lesson || (selectedDayIndex === todayIndex ? lesson : null);

  const isViewingToday = selectedDayIndex === todayIndex;
  const isViewingPast = selectedDayIndex < todayIndex;

  // Format explanation text into comfortable paragraphs
  const explanationParagraphs = activeLesson?.explanation
    ? activeLesson.explanation
        .split(/\n\s*\n/)
        .map(p => p.trim())
        .filter(Boolean)
    : [];

  // Parse pattern into formula parts if containing arrows
  const renderPattern = (pattern: string) => {
    const hasArrow = pattern.includes('→') || pattern.includes('->') || pattern.includes('↓');
    const separator = pattern.includes('→') ? '→' : pattern.includes('->') ? '->' : '↓';

    if (hasArrow) {
      const parts = pattern.split(separator).map(s => s.trim()).filter(Boolean);
      return (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2 sm:gap-3 py-1">
          {parts.map((part, idx) => (
            <React.Fragment key={idx}>
              <div className="px-3.5 py-2 rounded-xl bg-white border-2 border-black text-neutral-900 font-mono font-bold text-xs sm:text-sm text-center shadow-[2px_2px_0_0_#000]">
                {part}
              </div>
              {idx < parts.length - 1 && (
                <div className="flex items-center justify-center text-amber-500 font-black text-base sm:text-lg">
                  <span className="sm:hidden">↓</span>
                  <span className="hidden sm:inline">→</span>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      );
    }

    return (
      <div className="p-3 bg-white border-2 border-black rounded-xl font-mono font-bold text-xs sm:text-sm text-neutral-900 text-center shadow-[2px_2px_0_0_#000]">
        {pattern}
      </div>
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs select-none animate-in fade-in duration-150"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="grammar-modal-title"
    >
      <div
        className="w-full max-w-2xl max-h-[92vh] bg-white rounded-2xl border-4 border-black shadow-[8px_8px_0_0_#000] flex flex-col overflow-hidden text-neutral-900"
        onClick={e => e.stopPropagation()}
      >
        {/* 1. Header */}
        <div className="p-3.5 sm:p-4 bg-yellow-300 border-b-4 border-black flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white border-2 border-black flex items-center justify-center shadow-[2px_2px_0_0_#000] shrink-0">
              <BookOpen className="w-5 h-5 text-neutral-950" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base sm:text-xl font-black text-neutral-950 leading-tight">
                Eguneko Gramatika
              </h2>
              <p className="text-[11px] sm:text-xs font-bold text-neutral-800 truncate">
                Zikloko C1 mikroikasgaiak eta aurreko egunen berrikuspena
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 bg-white hover:bg-neutral-100 border-2 border-black rounded-lg shadow-[2px_2px_0_0_#000] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer transition-colors shrink-0"
            aria-label="Itxi"
          >
            <X className="w-5 h-5 text-neutral-950" />
          </button>
        </div>

        {/* 2. Zikloko Egunak Ribbon Selector (Aurreko ikasgaiak ikusteko) */}
        <div className="p-3 bg-amber-50/70 border-b-2 border-black space-y-2 shrink-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-amber-950 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-900" />
              Zikloko Egunak ({todayIndex + 1}. Eguna Gaur)
            </span>

            {todayIndex > 0 && isViewingToday && (
              <span className="text-[10px] font-bold text-neutral-600 hidden sm:inline">
                Aurreko egunak sakatu aurreko ikasgaiak ikusteko
              </span>
            )}
          </div>

          {/* 7 Days Row */}
          <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
            {Array.from({ length: 7 }, (_, i) => {
              const isToday = i === todayIndex;
              const isPast = i < todayIndex;
              const isFuture = i > todayIndex;
              const isSelected = i === selectedDayIndex;
              const isLocked = isFuture && !isAdmin;

              if (isLocked) {
                return (
                  <div
                    key={i}
                    title="Egun horretan desblokeatuko da"
                    className="p-1 sm:p-1.5 rounded-lg border border-neutral-300 bg-neutral-100/80 text-neutral-400 text-center flex flex-col items-center justify-center gap-0.5 cursor-not-allowed select-none"
                  >
                    <span className="text-[10px] sm:text-xs font-bold leading-tight">
                      {SHORT_DAY_NAMES[i]}
                    </span>
                    <Lock className="w-2.5 h-2.5 text-neutral-400" />
                  </div>
                );
              }

              return (
                <button
                  key={i}
                  onClick={() => setSelectedDayIndex(i)}
                  title={`${FULL_DAY_NAMES[i]} (${isToday ? 'Gaur' : isPast ? 'Aurreko ikasgaia' : 'Ikasgaia'})`}
                  className={`p-1 sm:p-1.5 rounded-lg border-2 text-center flex flex-col items-center justify-center gap-0.5 cursor-pointer transition-all active:translate-x-[1px] active:translate-y-[1px] ${
                    isSelected
                      ? 'bg-amber-300 text-neutral-950 border-black shadow-[2px_2px_0_0_#000] font-black'
                      : isToday
                      ? 'bg-yellow-100 text-amber-950 border-amber-400 hover:bg-yellow-200/80 font-bold'
                      : 'bg-white text-neutral-800 border-neutral-300 hover:bg-neutral-100 font-bold'
                  }`}
                >
                  <span className="text-[10px] sm:text-xs leading-tight">
                    {SHORT_DAY_NAMES[i]}
                  </span>
                  {isToday ? (
                    <span className="px-1 py-0.2 rounded-full bg-yellow-400 border border-black text-neutral-950 text-[8px] font-black leading-none">
                      Gaur
                    </span>
                  ) : (
                    <BookOpen className="w-2.5 h-2.5 text-neutral-500" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Banner when reviewing a past lesson */}
          {!isViewingToday && selectedCycleItem && (
            <div className="p-2 sm:p-2.5 bg-amber-100 border-2 border-amber-500 rounded-xl flex items-center justify-between gap-2 text-xs animate-in fade-in duration-100">
              <div className="flex items-center gap-1.5 min-w-0">
                <Calendar className="w-4 h-4 text-amber-900 shrink-0" />
                <span className="font-bold text-amber-950 truncate">
                  Zikloko <strong>{selectedDayIndex + 1}. Eguneko ikasgaia</strong> ({FULL_DAY_NAMES[selectedDayIndex]}, {selectedCycleItem.dateStr})
                </span>
              </div>

              <button
                onClick={() => setSelectedDayIndex(todayIndex)}
                className="px-2.5 py-1 bg-white hover:bg-amber-50 text-neutral-900 border border-black rounded-lg font-black text-[11px] shadow-[1px_1px_0_0_#000] cursor-pointer shrink-0 active:translate-x-[1px] active:translate-y-[1px]"
              >
                Itzuli gaurkora
              </button>
            </div>
          )}

          {/* Prompt when today is Day 1 */}
          {todayIndex === 0 && (
            <p className="text-[10px] font-bold text-neutral-500">
              💡 Zikloko 1. eguna da. Zikloan aurrera egin ahala, asteko aurreko ikasgai guztiak hemen geratuko zaizkizu berrikusteko!
            </p>
          )}
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 select-text">
          {loadingCycle && !activeLesson ? (
            <div className="py-16 text-center flex flex-col items-center justify-center gap-3">
              <div className="w-10 h-10 border-4 border-black border-t-amber-400 rounded-full animate-spin" />
              <span className="font-black text-sm text-neutral-600">Ikasgaia kargatzen...</span>
            </div>
          ) : !activeLesson ? (
            <div className="py-16 text-center text-neutral-500 font-bold text-sm">
              Ez da mikroikasgairik aurkitu egun honetarako.
            </div>
          ) : (
            <>
              {/* Concept Title, Phenomenon Subtitle & Badges */}
              <div className="space-y-1.5 border-b-2 border-neutral-100 pb-4">
                {activeLesson.category && (
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="px-2.5 py-0.5 bg-neutral-100 border border-neutral-300 rounded-lg font-bold text-xs text-neutral-700 capitalize">
                      {activeLesson.category}
                    </span>
                    {!isViewingToday && (
                      <span className="px-2 py-0.5 bg-amber-200 border border-amber-400 rounded-lg font-black text-xs text-amber-950">
                        {selectedDayIndex + 1}. Eguneko ikasgaia
                      </span>
                    )}
                  </div>
                )}

                <h1
                  id="grammar-modal-title"
                  className="text-2xl sm:text-3xl font-black text-neutral-950 tracking-tight leading-tight"
                >
                  {activeLesson.title}
                </h1>

                {activeLesson.subtitle && (
                  <p className="text-sm sm:text-base font-bold text-amber-800 leading-snug">
                    {activeLesson.subtitle}
                  </p>
                )}
              </div>

              {/* Idea Principal (Summary) */}
              {activeLesson.summary && (
                <div className="p-4 bg-amber-50/80 border-2 border-amber-300 rounded-2xl shadow-[2px_2px_0_0_#d97706] space-y-1">
                  <span className="text-[10px] font-black uppercase text-amber-900 flex items-center gap-1.5 tracking-wider">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-700 fill-amber-300" />
                    Ideia Nagusia
                  </span>
                  <p className="text-sm sm:text-base font-bold text-neutral-900 leading-relaxed">
                    {activeLesson.summary}
                  </p>
                </div>
              )}

              {/* Explicación (Explanation) */}
              {explanationParagraphs.length > 0 && (
                <div className="space-y-3">
                  <span className="text-[10px] font-black uppercase tracking-wider text-neutral-500 block">
                    Azalpena
                  </span>
                  <div className="space-y-2.5 text-neutral-800 text-sm sm:text-[15px] leading-relaxed">
                    {explanationParagraphs.map((paragraph, pIdx) => (
                      <p key={pIdx} className="font-medium">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {/* Estructura (Pattern / Formula) */}
              {activeLesson.pattern && (
                <div className="p-4 bg-neutral-100 border-2 border-black rounded-2xl shadow-[3px_3px_0_0_#000] space-y-2.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-neutral-600 flex items-center gap-1.5">
                    <Code2 className="w-3.5 h-3.5 text-neutral-800" />
                    Egitura
                  </span>
                  {renderPattern(activeLesson.pattern)}
                </div>
              )}

              {/* Ejemplos (Examples) */}
              {activeLesson.examples && activeLesson.examples.length > 0 && (
                <div className="space-y-2.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-neutral-500 block">
                    Adibideak
                  </span>
                  <div className="space-y-2">
                    {activeLesson.examples.map((ex, exIdx) => (
                      <div
                        key={exIdx}
                        className="p-3 sm:p-3.5 bg-neutral-50 hover:bg-neutral-100/60 border-2 border-neutral-300 rounded-xl space-y-1 transition-colors"
                      >
                        {ex.type && (
                          <span className="text-[9px] font-black uppercase tracking-wider text-neutral-600 bg-white px-2 py-0.5 rounded border border-neutral-300 inline-block shadow-[1px_1px_0_0_#000]">
                            {ex.type.replace(/_/g, ' ')}
                          </span>
                        )}
                        <p className="text-sm sm:text-base font-bold text-neutral-950 leading-snug">
                          «{ex.text}»
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Idea para recordar (Key Point) */}
              {activeLesson.key_point && (
                <div className="p-4 bg-emerald-50 border-2 border-emerald-400 rounded-2xl shadow-[3px_3px_0_0_#059669] space-y-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                    <BookmarkCheck className="w-4 h-4 text-emerald-700" />
                    Gogoratu
                  </span>
                  <p className="text-sm sm:text-base font-black text-emerald-950 leading-snug">
                    {activeLesson.key_point}
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 bg-neutral-100 border-t-2 border-black flex items-center justify-between shrink-0">
          <span className="text-xs font-bold text-neutral-500 hidden sm:inline">
            30–90 segundoko mikroikaskuntza
          </span>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2 bg-neutral-950 hover:bg-neutral-800 text-white font-black text-xs sm:text-sm rounded-xl border-2 border-black shadow-[2px_2px_0_0_#000] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer transition-all ml-auto"
          >
            Itxi
          </button>
        </div>
      </div>
    </div>
  );
};
