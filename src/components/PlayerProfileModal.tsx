import React, { useState, useEffect } from 'react';
import { X, Flame, Clock, Calendar, CheckCircle2, TrendingUp, Award, User, Zap } from 'lucide-react';
import { PlayerScoreRecord, fetchPlayerRecent7DaysHistory } from '../services/supabase';

interface PlayerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
  studentEmail: string;
  streak: number;
}

const BASQUE_MONTHS = [
  'Urtarrilak', 'Otsailak', 'Martxoak', 'Apirilak', 'Maiatzak', 'Ekainak',
  'Uztailak', 'Abuztuak', 'Irailak', 'Urriak', 'Azaroak', 'Abenduak'
];

const BASQUE_DAYS = [
  'Igandea', 'Astelehena', 'Asteartea', 'Asteazkena', 'Osteguna', 'Ostirala', 'Larunbata'
];

function formatBasqueDate(dateStr: string): string {
  try {
    const [year, month, day] = dateStr.split('-').map(Number);
    if (!year || !month || !day) return dateStr;
    const dateObj = new Date(year, month - 1, day);
    const dayName = BASQUE_DAYS[dateObj.getDay()];
    const monthName = BASQUE_MONTHS[month - 1];
    return `${monthName} ${day} (${dayName})`;
  } catch {
    return dateStr;
  }
}

export const PlayerProfileModal: React.FC<PlayerProfileModalProps> = ({
  isOpen,
  onClose,
  studentName,
  studentEmail,
  streak,
}) => {
  const [history, setHistory] = useState<PlayerScoreRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    setIsLoading(true);

    fetchPlayerRecent7DaysHistory(studentName)
      .then(records => {
        if (isMounted) {
          setHistory(records);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, studentName]);

  if (!isOpen) return null;

  // Compute stats
  const totalGames = history.length;
  const avgScore =
    totalGames > 0
      ? history.reduce((acc, curr) => acc + curr.score, 0) / totalGames
      : 0;
  const bestScore =
    totalGames > 0
      ? Math.max(...history.map(h => h.score))
      : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs select-none animate-in fade-in duration-150">
      <div className="w-full max-w-xl max-h-[90vh] bg-white rounded-2xl border-4 border-black shadow-[8px_8px_0_0_#000] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-yellow-300 border-b-4 border-black flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white border-2 border-black flex items-center justify-center shadow-[2px_2px_0_0_#000]">
              <User className="w-6 h-6 text-neutral-950" />
            </div>
            <div>
              <h2 className="text-xl font-black text-neutral-950 leading-tight">
                {studentName}
              </h2>
              <p className="text-xs font-bold text-neutral-800">
                {studentEmail}
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

        {/* 4 Summary Cards */}
        <div className="p-4 bg-neutral-50 border-b-2 border-black shrink-0">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {/* Streak */}
            <div className="p-2.5 bg-white border-2 border-black rounded-xl shadow-[2px_2px_0_0_#000] text-center">
              <span className="text-[10px] font-black uppercase text-neutral-500 block">
                Racha
              </span>
              <div className="flex items-center justify-center gap-1 text-base font-black text-orange-600 mt-0.5">
                <Flame className="w-4 h-4 fill-orange-500" />
                <span>{streak} egun</span>
              </div>
            </div>

            {/* Played in last 7 days */}
            <div className="p-2.5 bg-white border-2 border-black rounded-xl shadow-[2px_2px_0_0_#000] text-center">
              <span className="text-[10px] font-black uppercase text-neutral-500 block">
                Azken 7 Egunak
              </span>
              <div className="flex items-center justify-center gap-1 text-base font-black text-neutral-900 mt-0.5">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <span>{totalGames} / 7</span>
              </div>
            </div>

            {/* Avg Score */}
            <div className="p-2.5 bg-white border-2 border-black rounded-xl shadow-[2px_2px_0_0_#000] text-center">
              <span className="text-[10px] font-black uppercase text-neutral-500 block">
                Batez Bestekoa
              </span>
              <div className="flex items-center justify-center gap-1 text-base font-black text-emerald-700 mt-0.5">
                <Award className="w-4 h-4 text-emerald-600" />
                <span>{Math.round(avgScore)} pt</span>
              </div>
            </div>

            {/* Best Score */}
            <div className="p-2.5 bg-white border-2 border-black rounded-xl shadow-[2px_2px_0_0_#000] text-center">
              <span className="text-[10px] font-black uppercase text-neutral-500 block">
                Puntuazio Onena
              </span>
              <div className="flex items-center justify-center gap-1 text-base font-black text-sky-700 mt-0.5">
                <TrendingUp className="w-4 h-4 text-sky-600" />
                <span>{bestScore} pt</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section Title */}
        <div className="px-4 pt-3 pb-1 flex items-center justify-between">
          <h3 className="text-sm font-black text-neutral-950 flex items-center gap-1.5 uppercase tracking-wide">
            <span>Partiden Historiala (Azken 7 Egunak)</span>
          </h3>
          {totalGames > 0 && (
            <span className="text-xs font-bold text-neutral-500">
              {totalGames} partida erregistratuta
            </span>
          )}
        </div>

        {/* Simple & Clean List */}
        <div className="flex-1 min-h-0 overflow-y-auto custom-scroll-y p-4 space-y-2.5">
          {isLoading ? (
            <div className="py-12 text-center">
              <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-xs font-bold text-neutral-500">Historiala kargatzen...</p>
            </div>
          ) : history.length === 0 ? (
            <div className="py-12 text-center bg-neutral-50 rounded-2xl border-2 border-dashed border-neutral-300 p-6">
              <Calendar className="w-10 h-10 text-neutral-400 mx-auto mb-2" />
              <p className="text-sm font-black text-neutral-800">
                Ez dago oraindik partidarik azken 7 egunetan
              </p>
              <p className="text-xs font-bold text-neutral-500 mt-1">
                Jokatu gaurko partida zure bilakaera hemen ikusteko!
              </p>
            </div>
          ) : (
            history.map((record) => {
              const correct = record.correctAnswers ?? (record.score <= 20 ? record.score : Math.floor(record.score / 100));
              const scorePercent = Math.round((correct / record.totalQuestions) * 100);
              const isExcellent = correct >= 18;
              const isGood = correct >= 14 && correct < 18;

              return (
                <div
                  key={record.id || record.dateStr}
                  className="p-3.5 bg-white rounded-xl border-2 border-black shadow-[3px_3px_0_0_#000] flex flex-col gap-2 hover:bg-neutral-50 transition-colors"
                >
                  {/* Top line: Date, Correct answers, and Points */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="p-1 rounded bg-neutral-100 border border-neutral-300 shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div className="min-w-0">
                        <span className="font-black text-sm text-neutral-950 block leading-tight truncate">
                          {formatBasqueDate(record.dateStr)}
                        </span>
                        <div className="text-[11px] font-bold text-neutral-500 flex items-center gap-2 mt-0.5 flex-wrap">
                          <span>🎯 {correct}/{record.totalQuestions} asmatuta</span>
                          <span>•</span>
                          <span className="flex items-center gap-0.5">
                            <Clock className="w-3 h-3" />
                            {record.timeSeconds.toFixed(1)}s
                          </span>
                          {record.speedBonus > 0 && (
                            <>
                              <span>•</span>
                              <span className="text-emerald-700 font-black flex items-center gap-0.5">
                                <Zap className="w-3 h-3 fill-emerald-600 text-emerald-600" />
                                +{record.speedBonus} pt
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="px-3 py-1 rounded-lg border-2 border-black text-xs sm:text-sm font-black bg-yellow-300 text-neutral-950 shadow-[1px_1px_0_0_#000]">
                        {record.score} pt
                      </span>
                    </div>
                  </div>

                  {/* Clean Visual Progress Bar for Score Evolution */}
                  <div className="w-full flex items-center gap-2 pt-1">
                    <div className="flex-1 bg-neutral-200 rounded-full h-2 overflow-hidden border border-neutral-300">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          isExcellent
                            ? 'bg-emerald-500'
                            : isGood
                            ? 'bg-yellow-400'
                            : 'bg-neutral-400'
                        }`}
                        style={{ width: `${scorePercent}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-black text-neutral-600 w-8 text-right shrink-0">
                      %{scorePercent}
                    </span>
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
            className="px-5 py-2 bg-neutral-950 hover:bg-neutral-800 text-white font-black text-xs rounded-xl border-2 border-black shadow-[2px_2px_0_0_#000] cursor-pointer"
          >
            Itxi
          </button>
        </div>
      </div>
    </div>
  );
};
