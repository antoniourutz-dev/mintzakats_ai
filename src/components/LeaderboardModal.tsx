import React, { useState, useEffect } from 'react';
import { X, Trophy, Clock, Award, ShieldCheck } from 'lucide-react';
import {
  PlayerScoreRecord,
  WeeklyPlayerSummary,
  getDailyLeaderboardCloud,
  getWeeklyLeaderboardCloud,
  isTeacherAdmin,
} from '../services/supabase';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStudentEmail: string;
  todayDateStr: string;
  weekMondayStr: string;
  dayName: string;
  dayNumberInBlock: number;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  isOpen,
  onClose,
  currentStudentEmail,
  todayDateStr,
  weekMondayStr,
  dayName,
  dayNumberInBlock,
}) => {
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly'>('daily');
  const [dailyRecords, setDailyRecords] = useState<PlayerScoreRecord[]>([]);
  const [weeklyRecords, setWeeklyRecords] = useState<WeeklyPlayerSummary[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const isTeacher = isTeacherAdmin(currentStudentEmail);
  const currentStudentName = currentStudentEmail.split('@')[0].toLowerCase();

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    setIsLoading(true);

    Promise.all([
      getDailyLeaderboardCloud(todayDateStr, weekMondayStr),
      getWeeklyLeaderboardCloud(weekMondayStr),
    ])
      .then(([daily, weekly]) => {
        if (isMounted) {
          setDailyRecords(daily);
          setWeeklyRecords(weekly);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, todayDateStr, weekMondayStr]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 selection:bg-yellow-300 selection:text-black animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-white border-4 border-black rounded-2xl shadow-[8px_8px_0_0_#000] flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-yellow-300 border-b-4 border-black flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-white border-2 border-black rounded-lg shadow-[2px_2px_0_0_#000]">
              <Trophy className="w-5 h-5 text-neutral-950" />
            </div>
            <div>
              <h2 className="text-xl font-black text-neutral-950 leading-tight">
                Sailkapenak
              </h2>
              <p className="text-xs font-bold text-neutral-800">
                {dayName} · 7 eguneko zikloa ({dayNumberInBlock}. eguna)
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

        {/* Tab Switcher */}
        <div className="p-3 bg-neutral-100 border-b-2 border-black flex gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('daily')}
            className={`flex-1 py-2 px-3 rounded-xl border-2 border-black font-black text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'daily'
                ? 'bg-emerald-500 text-white shadow-[2px_2px_0_0_#000]'
                : 'bg-white text-neutral-700 hover:bg-neutral-50'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Gaurko Eguna</span>
          </button>

          <button
            onClick={() => setActiveTab('weekly')}
            className={`flex-1 py-2 px-3 rounded-xl border-2 border-black font-black text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'weekly'
                ? 'bg-emerald-500 text-white shadow-[2px_2px_0_0_#000]'
                : 'bg-white text-neutral-700 hover:bg-neutral-50'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Asteko 7 Egunak</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-h-0 overflow-y-auto custom-scroll-y p-3 sm:p-4 space-y-2">
          {isTeacher && (
            <div className="p-2.5 bg-yellow-50 border-2 border-black rounded-xl text-xs font-bold text-neutral-800 flex items-center gap-2 mb-2 shadow-[2px_2px_0_0_#000]">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>
                <strong>Irakasle modua:</strong> Zure puntuazioak ez dira sailkapen ofizialean agertzen ikasleen lehia garbia bermatzeko.
              </span>
            </div>
          )}

          {isLoading ? (
            <div className="py-12 text-center">
              <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-xs font-bold text-neutral-500">Sailkapenak kargatzen...</p>
            </div>
          ) : activeTab === 'daily' ? (
            /* DAILY LEADERBOARD */
            dailyRecords.length === 0 ? (
              <div className="py-12 text-center text-neutral-500 font-bold text-sm">
                Ez du oraindik inork jokatu gaurko egunean.
              </div>
            ) : (
              dailyRecords.map((player, index) => {
                const isCurrent = player.playerId.toLowerCase() === currentStudentName;
                const medal =
                  index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;

                return (
                  <div
                    key={player.id || `${player.playerId}_${index}`}
                    className={`p-3 rounded-xl border-2 border-black flex items-center justify-between gap-3 transition-all ${
                      isCurrent
                        ? 'bg-yellow-100 ring-2 ring-yellow-400 shadow-[3px_3px_0_0_#000]'
                        : index < 3
                        ? 'bg-neutral-50 shadow-[2px_2px_0_0_#000]'
                        : 'bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-7 text-center font-black text-base shrink-0">
                        {medal}
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`font-black text-sm truncate ${
                              isCurrent ? 'text-neutral-950 font-black' : 'text-neutral-800'
                            }`}
                          >
                            {player.playerName}
                          </span>
                          {isCurrent && (
                            <span className="px-1.5 py-0.2 bg-emerald-600 text-white rounded text-[10px] font-black uppercase shrink-0">
                              Zu
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] font-bold text-neutral-500">
                          ⏱️ {player.timeSeconds.toFixed(1)}s · {player.correctAnswers ?? (player.score <= 20 ? player.score : Math.floor(player.score / 100))}/{player.totalQuestions}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="px-2.5 py-1 bg-yellow-300 border border-black rounded-lg text-neutral-950 font-black text-xs sm:text-sm shadow-[1px_1px_0_0_#000]">
                        {player.score} pt
                      </span>
                    </div>
                  </div>
                );
              })
            )
          ) : (
            /* WEEKLY LEADERBOARD (NO TIME, ONLY POINTS) */
            weeklyRecords.length === 0 ? (
              <div className="py-12 text-center text-neutral-500 font-bold text-sm">
                Ez dago oraindik asteko daturik.
              </div>
            ) : (
              weeklyRecords.map((player, index) => {
                const isCurrent = player.playerId.toLowerCase() === currentStudentName;
                const medal =
                  index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;

                return (
                  <div
                    key={player.playerId}
                    className={`p-3 rounded-xl border-2 border-black flex items-center justify-between gap-3 transition-all ${
                      isCurrent
                        ? 'bg-yellow-100 ring-2 ring-yellow-400 shadow-[3px_3px_0_0_#000]'
                        : index < 3
                        ? 'bg-neutral-50 shadow-[2px_2px_0_0_#000]'
                        : 'bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-7 text-center font-black text-base shrink-0">
                        {medal}
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`font-black text-sm truncate ${
                              isCurrent ? 'text-neutral-950 font-black' : 'text-neutral-800'
                            }`}
                          >
                            {player.playerName}
                          </span>
                          {isCurrent && (
                            <span className="px-1.5 py-0.2 bg-emerald-600 text-white rounded text-[10px] font-black uppercase shrink-0">
                              Zu
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] font-bold text-neutral-500">
                          <span>{player.daysPlayed} {player.daysPlayed === 1 ? 'egun' : 'egun'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="px-3 py-1 bg-yellow-300 border border-black rounded-lg text-neutral-950 font-black text-xs sm:text-sm shadow-[1px_1px_0_0_#000]">
                        {player.totalScore} pt
                      </span>
                    </div>
                  </div>
                );
              })
            )
          )}
        </div>
      </div>
    </div>
  );
};
