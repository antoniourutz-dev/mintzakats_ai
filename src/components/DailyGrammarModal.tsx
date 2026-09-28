import React, { useEffect } from 'react';
import {
  X,
  Sparkles,
  BookOpen,
  Lightbulb,
  BookmarkCheck,
  Code2,
  ArrowRight,
} from 'lucide-react';
import { GrammarLesson } from '../types';

interface DailyGrammarModalProps {
  isOpen: boolean;
  onClose: () => void;
  lesson: GrammarLesson | null;
}

export const DailyGrammarModal: React.FC<DailyGrammarModalProps> = ({
  isOpen,
  onClose,
  lesson,
}) => {
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

  if (!isOpen || !lesson) return null;

  // Format explanation text into comfortable paragraphs
  const explanationParagraphs = lesson.explanation
    ? lesson.explanation
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
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs select-none animate-in fade-in duration-150"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="grammar-modal-title"
    >
      <div
        className="w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl border-4 border-black shadow-[8px_8px_0_0_#000] flex flex-col overflow-hidden text-neutral-900"
        onClick={e => e.stopPropagation()}
      >
        {/* 1. Header */}
        <div className="p-4 bg-yellow-300 border-b-4 border-black flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white border-2 border-black flex items-center justify-center shadow-[2px_2px_0_0_#000]">
              <BookOpen className="w-5 h-5 text-neutral-950" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-neutral-950 leading-tight">
                Eguneko Gramatika
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 bg-white hover:bg-neutral-100 border-2 border-black rounded-lg shadow-[2px_2px_0_0_#000] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer transition-colors"
            aria-label="Itxi"
          >
            <X className="w-5 h-5 text-neutral-950" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 select-text">
          {/* 2 & 3. Concept Title, Phenomenon Subtitle & Badges */}
          <div className="space-y-1.5 border-b-2 border-neutral-100 pb-4">
            {lesson.category && (
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="px-2.5 py-0.5 bg-neutral-100 border border-neutral-300 rounded-lg font-bold text-xs text-neutral-700 capitalize">
                  {lesson.category}
                </span>
              </div>
            )}

            <h1
              id="grammar-modal-title"
              className="text-2xl sm:text-3xl font-black text-neutral-950 tracking-tight leading-tight"
            >
              {lesson.title}
            </h1>

            {lesson.subtitle && (
              <p className="text-sm sm:text-base font-bold text-amber-800 leading-snug">
                {lesson.subtitle}
              </p>
            )}
          </div>

          {/* 4. Idea Principal (Summary) */}
          {lesson.summary && (
            <div className="p-4 bg-amber-50/80 border-2 border-amber-300 rounded-2xl shadow-[2px_2px_0_0_#d97706] space-y-1">
              <span className="text-[10px] font-black uppercase text-amber-900 flex items-center gap-1.5 tracking-wider">
                <Lightbulb className="w-3.5 h-3.5 text-amber-700 fill-amber-300" />
                Ideia Nagusia
              </span>
              <p className="text-sm sm:text-base font-bold text-neutral-900 leading-relaxed">
                {lesson.summary}
              </p>
            </div>
          )}

          {/* 5. Explicación (Explanation) */}
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

          {/* 6. Estructura (Pattern / Formula) */}
          {lesson.pattern && (
            <div className="p-4 bg-neutral-100 border-2 border-black rounded-2xl shadow-[3px_3px_0_0_#000] space-y-2.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-neutral-600 flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-neutral-800" />
                Egitura
              </span>
              {renderPattern(lesson.pattern)}
            </div>
          )}

          {/* 7. Ejemplos (Examples) */}
          {lesson.examples && lesson.examples.length > 0 && (
            <div className="space-y-2.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-neutral-500 block">
                Adibideak
              </span>
              <div className="space-y-2">
                {lesson.examples.map((ex, exIdx) => (
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

          {/* 8. Idea para recordar (Key Point) */}
          {lesson.key_point && (
            <div className="p-4 bg-emerald-50 border-2 border-emerald-400 rounded-2xl shadow-[3px_3px_0_0_#059669] space-y-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                <BookmarkCheck className="w-4 h-4 text-emerald-700" />
                Gogoratu
              </span>
              <p className="text-sm sm:text-base font-black text-emerald-950 leading-snug">
                {lesson.key_point}
              </p>
            </div>
          )}
        </div>

        {/* 9. Footer */}
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
