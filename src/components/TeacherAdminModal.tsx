import React, { useState, useEffect } from 'react';
import {
  X,
  Users,
  Calendar,
  BookOpen,
  Trash2,
  Search,
  Flame,
  Award,
  Clock,
  CheckCircle,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Info,
  ShieldCheck,
  Eye,
  RefreshCw,
} from 'lucide-react';
import {
  AdminPlayerOverview,
  getAllPlayersAdminData,
  deletePlayerDataAdmin,
  deletePlayerDateRecordAdmin,
  syncTeacherCycleStartDateCloud,
  fetchAllQuestionsAdmin,
  PlayerScoreRecord,
} from '../services/supabase';
import {
  get7DayScheduleForBlock,
  getWeekBlockInfo,
  BASQUE_DAY_NAMES,
} from '../utils/weekCycle';
import { Question } from '../types';
import { getTodayDateString } from '../utils/storage';

interface TeacherAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartDateChanged?: (newStartDate: string | null) => void;
}

export const TeacherAdminModal: React.FC<TeacherAdminModalProps> = ({
  isOpen,
  onClose,
  onStartDateChanged,
}) => {
  const [activeTab, setActiveTab] = useState<'students' | 'schedule' | 'questions'>('students');

  // Students state
  const [players, setPlayers] = useState<AdminPlayerOverview[]>([]);
  const [loadingPlayers, setLoadingPlayers] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPlayerForDetails, setSelectedPlayerForDetails] = useState<AdminPlayerOverview | null>(null);
  const [playerToDelete, setPlayerToDelete] = useState<AdminPlayerOverview | null>(null);
  const [recordToDelete, setRecordToDelete] = useState<{ player: AdminPlayerOverview; record: PlayerScoreRecord } | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Cycle Start Date state
  const [currentBlockInfo, setCurrentBlockInfo] = useState(() => getWeekBlockInfo());
  const [inputStartDate, setInputStartDate] = useState<string>(
    currentBlockInfo.configuredStartDateStr || currentBlockInfo.weekMondayDateStr
  );
  const [isSavingDate, setIsSavingDate] = useState<boolean>(false);
  const [dateSaveSuccess, setDateSaveSuccess] = useState<boolean>(false);

  // 7-Day Questions state
  const [allQuestionsPool, setAllQuestionsPool] = useState<Question[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState<boolean>(false);
  const [selectedDayTab, setSelectedDayTab] = useState<number>(0); // 0 = Day 1 (Astelehena) .. 6 = Day 7 (Igandea)
  const [expandedQuestions, setExpandedQuestions] = useState<Record<string, boolean>>({});

  // 1. Load players when modal opens
  useEffect(() => {
    if (!isOpen) return;

    loadPlayersList();
    loadQuestionsBank();
  }, [isOpen]);

  const loadPlayersList = async () => {
    setLoadingPlayers(true);
    try {
      const data = await getAllPlayersAdminData();
      setPlayers(data);
    } catch (e) {
      console.error('Error loading admin player data:', e);
    } finally {
      setLoadingPlayers(false);
    }
  };

  const loadQuestionsBank = async () => {
    setLoadingQuestions(true);
    try {
      const q = await fetchAllQuestionsAdmin();
      setAllQuestionsPool(q);
    } catch (e) {
      console.error('Error loading questions bank:', e);
    } finally {
      setLoadingQuestions(false);
    }
  };

  if (!isOpen) return null;

  // Filtered players list
  const filteredPlayers = players.filter(p => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      p.playerName.toLowerCase().includes(q) ||
      p.playerId.toLowerCase().includes(q)
    );
  });

  // Calculate Global Metrics
  const totalStudents = players.length;
  const totalGamesPlayed = players.reduce((acc, p) => acc + p.totalGames, 0);
  const overallPoints = players.reduce((acc, p) => acc + p.totalPoints, 0);
  const averagePoints = totalStudents > 0 ? Math.round(overallPoints / totalStudents) : 0;
  const totalCorrect = players.reduce((acc, p) => acc + p.totalCorrect, 0);
  const totalQuestions = players.reduce((acc, p) => acc + p.totalQuestions, 0);
  const averageAccuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

  // Delete Player Action (All records)
  const handleConfirmDeletePlayer = async () => {
    if (!playerToDelete) return;
    setIsDeleting(true);
    try {
      await deletePlayerDataAdmin(playerToDelete.playerId);
      setPlayers(prev => prev.filter(p => p.playerId !== playerToDelete.playerId));
      if (selectedPlayerForDetails?.playerId === playerToDelete.playerId) {
        setSelectedPlayerForDetails(null);
      }
      setPlayerToDelete(null);
    } catch (e) {
      console.error('Delete player failed:', e);
    } finally {
      setIsDeleting(false);
    }
  };

  // Delete Player's Specific Date Record (e.g. today's match so they can play again)
  const handleConfirmDeleteRecord = async () => {
    if (!recordToDelete) return;
    setIsDeleting(true);
    const { player, record } = recordToDelete;
    try {
      await deletePlayerDateRecordAdmin(player.playerId, record.dateStr);

      // Refresh local player list and details
      setPlayers(prev =>
        prev.map(p => {
          if (p.playerId !== player.playerId) return p;
          const updatedRecords = p.records.filter(r => r.dateStr !== record.dateStr);
          const totalGames = updatedRecords.length;
          const totalPoints = updatedRecords.reduce((acc, r) => acc + r.score, 0);
          const bestScore = updatedRecords.reduce((acc, r) => Math.max(acc, r.score), 0);
          const totalCorrect = updatedRecords.reduce((acc, r) => acc + r.correctAnswers, 0);
          const totalQuestions = updatedRecords.reduce((acc, r) => acc + r.totalQuestions, 0);
          const accuracyPercent = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
          const averageTimeSeconds =
            totalGames > 0
              ? Math.round((updatedRecords.reduce((acc, r) => acc + r.timeSeconds, 0) / totalGames) * 10) / 10
              : 0;
          const lastPlayedDate = updatedRecords.sort((a, b) => b.dateStr.localeCompare(a.dateStr))[0]?.dateStr || null;

          return {
            ...p,
            totalGames,
            totalPoints,
            bestScore,
            totalCorrect,
            totalQuestions,
            accuracyPercent,
            averageTimeSeconds,
            lastPlayedDate,
            records: updatedRecords,
          };
        })
      );

      if (selectedPlayerForDetails && selectedPlayerForDetails.playerId === player.playerId) {
        setSelectedPlayerForDetails(prev => {
          if (!prev) return null;
          const updatedRecords = prev.records.filter(r => r.dateStr !== record.dateStr);
          const totalGames = updatedRecords.length;
          const totalPoints = updatedRecords.reduce((acc, r) => acc + r.score, 0);
          const bestScore = updatedRecords.reduce((acc, r) => Math.max(acc, r.score), 0);
          const totalCorrect = updatedRecords.reduce((acc, r) => acc + r.correctAnswers, 0);
          const totalQuestions = updatedRecords.reduce((acc, r) => acc + r.totalQuestions, 0);
          const accuracyPercent = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
          const averageTimeSeconds =
            totalGames > 0
              ? Math.round((updatedRecords.reduce((acc, r) => acc + r.timeSeconds, 0) / totalGames) * 10) / 10
              : 0;

          return {
            ...prev,
            totalGames,
            totalPoints,
            bestScore,
            totalCorrect,
            totalQuestions,
            accuracyPercent,
            averageTimeSeconds,
            lastPlayedDate: updatedRecords[0]?.dateStr || null,
            records: updatedRecords,
          };
        });
      }

      setRecordToDelete(null);
    } catch (e) {
      console.error('Delete date record failed:', e);
    } finally {
      setIsDeleting(false);
    }
  };

  // Save Cycle Start Date Action
  const handleSaveStartDate = async () => {
    setIsSavingDate(true);
    try {
      await syncTeacherCycleStartDateCloud(inputStartDate || null);
      const updatedInfo = getWeekBlockInfo(new Date(), inputStartDate || null);
      setCurrentBlockInfo(updatedInfo);
      setDateSaveSuccess(true);
      onStartDateChanged?.(inputStartDate || null);
      setTimeout(() => setDateSaveSuccess(false), 3000);
    } catch (e) {
      console.error('Save start date failed:', e);
    } finally {
      setIsSavingDate(false);
    }
  };

  const handleResetToCurrentWeek = async () => {
    setIsSavingDate(true);
    try {
      await syncTeacherCycleStartDateCloud(null);
      const updatedInfo = getWeekBlockInfo(new Date(), null);
      setCurrentBlockInfo(updatedInfo);
      setInputStartDate(updatedInfo.weekMondayDateStr);
      setDateSaveSuccess(true);
      onStartDateChanged?.(null);
      setTimeout(() => setDateSaveSuccess(false), 3000);
    } catch (e) {
      console.error('Reset start date failed:', e);
    } finally {
      setIsSavingDate(false);
    }
  };

  // 7-Day Questions Schedule
  const schedule7Days = get7DayScheduleForBlock(
    allQuestionsPool,
    currentBlockInfo.configuredStartDateStr
  );
  const currentSelectedDay = schedule7Days[selectedDayTab] || schedule7Days[0];

  const toggleQuestionExpand = (qId: string | number) => {
    const key = String(qId);
    setExpandedQuestions(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-xs select-none animate-in fade-in duration-150">
      <div className="w-full max-w-4xl h-[92vh] max-h-[92vh] bg-white rounded-2xl border-4 border-black shadow-[8px_8px_0_0_#000] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-3 sm:p-4 bg-yellow-300 border-b-4 border-black flex items-center justify-between shrink-0 gap-2">
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white border-2 border-black flex items-center justify-center shadow-[2px_2px_0_0_#000] shrink-0">
              <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-700" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <h2 className="text-base sm:text-xl font-black text-neutral-950 leading-tight">
                  Irakasle Panela (Admin)
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-black text-white text-[9px] sm:text-[10px] font-black uppercase tracking-wider">
                  Kudeatzailea
                </span>
              </div>
              <p className="text-[11px] sm:text-xs font-bold text-neutral-800 truncate">
                Ikasleen estatistikak, zikloaren hasiera-data eta 7 egunetako galderak
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 bg-white hover:bg-neutral-100 border-2 border-black rounded-lg shadow-[2px_2px_0_0_#000] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer shrink-0"
            aria-label="Itxi"
          >
            <X className="w-5 h-5 text-neutral-950" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-neutral-100 border-b-2 border-black px-2 sm:px-4 pt-2 flex items-end gap-1.5 sm:gap-2 overflow-x-auto overflow-y-hidden shrink-0 horizontal-scroll">
          <button
            onClick={() => setActiveTab('students')}
            className={`px-3 sm:px-4 py-2 border-t-2 border-x-2 border-black rounded-t-xl font-black text-xs flex items-center gap-1.5 sm:gap-2 transition-all cursor-pointer select-none shrink-0 ${
              activeTab === 'students'
                ? 'bg-white text-neutral-950 border-b-2 border-b-white -mb-[2px] relative z-10'
                : 'bg-neutral-200 text-neutral-600 hover:bg-neutral-300 -mb-[2px]'
            }`}
          >
            <Users className="w-4 h-4 text-emerald-700 shrink-0" />
            <span className="hidden sm:inline">Ikasleak & Estatistikak</span>
            <span className="sm:hidden">Ikasleak</span>
            <span className="px-1.5 py-0.2 bg-black/10 rounded-full text-[10px]">
              {players.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('schedule')}
            className={`px-3 sm:px-4 py-2 border-t-2 border-x-2 border-black rounded-t-xl font-black text-xs flex items-center gap-1.5 sm:gap-2 transition-all cursor-pointer select-none shrink-0 ${
              activeTab === 'schedule'
                ? 'bg-white text-neutral-950 border-b-2 border-b-white -mb-[2px] relative z-10'
                : 'bg-neutral-200 text-neutral-600 hover:bg-neutral-300 -mb-[2px]'
            }`}
          >
            <Calendar className="w-4 h-4 text-sky-700 shrink-0" />
            <span className="hidden sm:inline">Hasiera Data Konfigurazioa</span>
            <span className="sm:hidden">Hasiera Data</span>
          </button>

          <button
            onClick={() => setActiveTab('questions')}
            className={`px-3 sm:px-4 py-2 border-t-2 border-x-2 border-black rounded-t-xl font-black text-xs flex items-center gap-1.5 sm:gap-2 transition-all cursor-pointer select-none shrink-0 ${
              activeTab === 'questions'
                ? 'bg-white text-neutral-950 border-b-2 border-b-white -mb-[2px] relative z-10'
                : 'bg-neutral-200 text-neutral-600 hover:bg-neutral-300 -mb-[2px]'
            }`}
          >
            <BookOpen className="w-4 h-4 text-purple-700 shrink-0" />
            <span className="hidden sm:inline">7 Egunetako Galderak (140)</span>
            <span className="sm:hidden">Galderak (140)</span>
          </button>
        </div>

        {/* Tab 1: Students & Statistics */}
        {activeTab === 'students' && (
          <div className="flex-1 min-h-0 overflow-y-auto custom-scroll-y p-3 sm:p-5 flex flex-col gap-3 sm:gap-4">
            {/* KPI Cards Banner */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="p-2.5 sm:p-3 bg-emerald-50 border-2 border-black rounded-xl shadow-[2px_2px_0_0_#000]">
                <span className="text-[9px] sm:text-[10px] font-black uppercase text-emerald-800 block">
                  Ikasleak Guztira
                </span>
                <span className="text-lg sm:text-2xl font-black text-emerald-950 mt-0.5 block">
                  {totalStudents}
                </span>
              </div>

              <div className="p-2.5 sm:p-3 bg-yellow-50 border-2 border-black rounded-xl shadow-[2px_2px_0_0_#000]">
                <span className="text-[9px] sm:text-[10px] font-black uppercase text-yellow-800 block">
                  Partidak Jokatuta
                </span>
                <span className="text-lg sm:text-2xl font-black text-yellow-950 mt-0.5 block">
                  {totalGamesPlayed}
                </span>
              </div>

              <div className="p-2.5 sm:p-3 bg-sky-50 border-2 border-black rounded-xl shadow-[2px_2px_0_0_#000]">
                <span className="text-[9px] sm:text-[10px] font-black uppercase text-sky-800 block">
                  Puntu Batez Bestekoa
                </span>
                <span className="text-lg sm:text-2xl font-black text-sky-950 mt-0.5 block">
                  {averagePoints.toLocaleString()} pt
                </span>
              </div>

              <div className="p-2.5 sm:p-3 bg-purple-50 border-2 border-black rounded-xl shadow-[2px_2px_0_0_#000]">
                <span className="text-[9px] sm:text-[10px] font-black uppercase text-purple-800 block">
                  Asmatze Tasa Globala
                </span>
                <span className="text-lg sm:text-2xl font-black text-purple-950 mt-0.5 block">
                  {averageAccuracy}%
                </span>
              </div>
            </div>

            {/* Search and Refresh bar */}
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Bilatu ikaslea izenaz edo emailez..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-white border-2 border-black rounded-xl font-bold text-xs text-neutral-900 placeholder:text-neutral-400 shadow-[2px_2px_0_0_#000] focus:outline-hidden"
                />
              </div>

              <button
                onClick={loadPlayersList}
                disabled={loadingPlayers}
                className="px-3 py-2 bg-white hover:bg-neutral-50 text-neutral-800 border-2 border-black rounded-xl font-black text-xs shadow-[2px_2px_0_0_#000] flex items-center gap-1.5 cursor-pointer active:translate-x-[1px] active:translate-y-[1px]"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingPlayers ? 'animate-spin' : ''}`} />
                <span>Eguneratu</span>
              </button>
            </div>

            {/* Player Details Submodal / View */}
            {selectedPlayerForDetails && (
              <div className="p-4 bg-neutral-50 border-3 border-black rounded-2xl shadow-[4px_4px_0_0_#000] space-y-4">
                <div className="flex items-center justify-between border-b-2 border-neutral-300 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-black text-neutral-950">
                      Ikaslearen Fitxa: {selectedPlayerForDetails.playerName}
                    </span>
                    <span className="px-2 py-0.5 bg-yellow-200 border border-black rounded text-[10px] font-black">
                      {selectedPlayerForDetails.totalPoints.toLocaleString()} pt
                    </span>
                  </div>

                  <button
                    onClick={() => setSelectedPlayerForDetails(null)}
                    className="p-1 bg-white hover:bg-neutral-200 border border-black rounded cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Player Quick Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                  <div className="p-2 bg-white border border-neutral-300 rounded-lg">
                    <span className="text-neutral-500 font-bold block text-[10px]">Racha</span>
                    <span className="font-black text-orange-600 flex items-center justify-center gap-1">
                      <Flame className="w-3.5 h-3.5 fill-orange-500" />
                      {selectedPlayerForDetails.streak} egun
                    </span>
                  </div>
                  <div className="p-2 bg-white border border-neutral-300 rounded-lg">
                    <span className="text-neutral-500 font-bold block text-[10px]">Partidak</span>
                    <span className="font-black text-neutral-950">{selectedPlayerForDetails.totalGames}</span>
                  </div>
                  <div className="p-2 bg-white border border-neutral-300 rounded-lg">
                    <span className="text-neutral-500 font-bold block text-[10px]">Asmatutakoak</span>
                    <span className="font-black text-emerald-700">
                      {selectedPlayerForDetails.totalCorrect} / {selectedPlayerForDetails.totalQuestions} ({selectedPlayerForDetails.accuracyPercent}%)
                    </span>
                  </div>
                  <div className="p-2 bg-white border border-neutral-300 rounded-lg">
                    <span className="text-neutral-500 font-bold block text-[10px]">Denbora Media</span>
                    <span className="font-black text-sky-700">{selectedPlayerForDetails.averageTimeSeconds}s</span>
                  </div>
                </div>

                {/* Specific Mistakes / Akats Zehatzak */}
                <div>
                  <h4 className="text-xs font-black uppercase text-rose-800 tracking-wider mb-2 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Azken Partidako Akatsak ({selectedPlayerForDetails.lastGameMistakes.length})</span>
                  </h4>

                  {selectedPlayerForDetails.lastGameMistakes.length === 0 ? (
                    <div className="p-3 bg-emerald-50 border border-emerald-400 rounded-xl text-emerald-900 font-bold text-xs">
                      Ez du akatsik erregistratuta (edo partida guztiak 20/20 asmatu ditu).
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                      {selectedPlayerForDetails.lastGameMistakes.map((m: any, mIdx: number) => {
                        const q = m.question || m;
                        const userAns = typeof m.userAnswerIndex === 'number' ? q.options?.[m.userAnswerIndex] : 'Erantzun gabe';
                        const correctAns = q.options?.[q.correctIndex] || 'Forma zuzena';

                        return (
                          <div
                            key={mIdx}
                            className="p-3 bg-white border border-rose-300 rounded-xl text-xs space-y-1"
                          >
                            <p className="font-black text-neutral-950">{q.prompt}</p>
                            <div className="flex items-center gap-3 text-[11px]">
                              <span className="text-rose-700 font-bold">
                                Ikaslearen hautua: <span className="line-through">{userAns}</span>
                              </span>
                              <span className="text-emerald-700 font-black">
                                Forma zuzena: {correctAns}
                              </span>
                            </div>
                            {q.explanation?.whyCorrect && (
                              <p className="text-[10px] text-neutral-500 pt-0.5">
                                💡 {q.explanation.whyCorrect}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Games History Table */}
                <div>
                  <h4 className="text-xs font-black uppercase text-neutral-700 tracking-wider mb-2">
                    Jokatutako Partiden Historiala
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead>
                        <tr className="bg-neutral-200 text-neutral-700 font-black">
                          <th className="p-2 border border-neutral-300">Data</th>
                          <th className="p-2 border border-neutral-300">Puntuak</th>
                          <th className="p-2 border border-neutral-300">Aciertos</th>
                          <th className="p-2 border border-neutral-300">Denbora</th>
                          <th className="p-2 border border-neutral-300">Bonusa</th>
                          <th className="p-2 border border-neutral-300 text-center">Ekintzak</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedPlayerForDetails.records.map((r, rIdx) => {
                          const isToday = r.dateStr === getTodayDateString();
                          return (
                            <tr key={rIdx} className="border-b border-neutral-200 hover:bg-neutral-100">
                              <td className="p-2 font-bold flex items-center gap-1.5">
                                <span>{r.dateStr}</span>
                                {isToday && (
                                  <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded text-[9px] font-black uppercase">
                                    Gaur
                                  </span>
                                )}
                              </td>
                              <td className="p-2 font-black text-neutral-950">{r.score.toLocaleString()} pt</td>
                              <td className="p-2 font-bold text-emerald-700">{r.correctAnswers}/{r.totalQuestions}</td>
                              <td className="p-2 font-bold">{r.timeSeconds.toFixed(1)}s</td>
                              <td className="p-2 font-bold text-emerald-600">+{r.speedBonus} pt</td>
                              <td className="p-2 text-center">
                                <button
                                  onClick={() => setRecordToDelete({ player: selectedPlayerForDetails, record: r })}
                                  title={isToday ? "Ezabatu gaurko partida (berriro jokatu ahal izateko)" : "Ezabatu data honetako partida"}
                                  className={`px-2 py-1 border border-black rounded-md text-[10px] font-black flex items-center gap-1 mx-auto cursor-pointer shadow-[1px_1px_0_0_#000] ${
                                    isToday
                                      ? 'bg-amber-200 hover:bg-amber-300 text-amber-950'
                                      : 'bg-rose-100 hover:bg-rose-200 text-rose-900'
                                  }`}
                                >
                                  <RotateCcw className="w-3 h-3" />
                                  <span>{isToday ? 'Gaurkoa Ezabatu (Berjokatu)' : 'Ezabatu'}</span>
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Players List: Responsive Cards on Mobile (<md) and Full Table on Desktop (>=md) */}
            {/* Mobile View: Cards */}
            <div className="md:hidden space-y-2.5">
              {loadingPlayers ? (
                <div className="p-8 text-center font-bold text-neutral-500 bg-white border-2 border-black rounded-xl">
                  Ikasleen datuak kargatzen...
                </div>
              ) : filteredPlayers.length === 0 ? (
                <div className="p-8 text-center font-bold text-neutral-500 bg-white border-2 border-black rounded-xl">
                  Ez da ikaslerik aurkitu bilaketa honekin.
                </div>
              ) : (
                filteredPlayers.map(p => (
                  <div
                    key={p.playerId}
                    className="p-3 bg-white border-2 border-black rounded-xl shadow-[3px_3px_0_0_#000] flex flex-col gap-2.5"
                  >
                    {/* Top Row: Student Name + Streak + Actions */}
                    <div className="flex items-center justify-between gap-2 border-b border-neutral-100 pb-2">
                      <div className="min-w-0">
                        <span className="font-black text-sm text-neutral-950 block truncate">
                          {p.playerName}
                        </span>
                        <span className="text-[10px] text-neutral-500 font-bold block truncate">
                          {p.playerId}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="inline-flex items-center gap-1 font-black text-xs text-orange-600 bg-orange-50 px-2 py-0.5 rounded-lg border border-orange-200">
                          <Flame className="w-3.5 h-3.5 fill-orange-500" />
                          {p.streak}
                        </span>

                        <button
                          onClick={() => setSelectedPlayerForDetails(p)}
                          title="Ikusi xehetasunak"
                          className="p-1.5 bg-sky-100 hover:bg-sky-200 text-sky-900 border-2 border-black rounded-lg shadow-[1px_1px_0_0_#000] cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => setPlayerToDelete(p)}
                          title="Ezabatu ikaslea"
                          className="p-1.5 bg-rose-100 hover:bg-rose-200 text-rose-900 border-2 border-black rounded-lg shadow-[1px_1px_0_0_#000] cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Stats Grid inside card */}
                    <div className="grid grid-cols-4 gap-1.5 text-center">
                      <div className="p-1.5 bg-yellow-50/70 border border-yellow-200 rounded-lg">
                        <span className="text-[9px] font-black uppercase text-neutral-500 block">Puntuak</span>
                        <span className="font-black text-xs text-neutral-950 block">
                          {p.totalPoints.toLocaleString()}
                        </span>
                      </div>

                      <div className="p-1.5 bg-neutral-50 border border-neutral-200 rounded-lg">
                        <span className="text-[9px] font-black uppercase text-neutral-500 block">Partidak</span>
                        <span className="font-black text-xs text-neutral-950 block">
                          {p.totalGames}
                        </span>
                      </div>

                      <div className="p-1.5 bg-neutral-50 border border-neutral-200 rounded-lg">
                        <span className="text-[9px] font-black uppercase text-neutral-500 block">Asmatze %</span>
                        <span
                          className={`font-black text-xs block ${
                            p.accuracyPercent >= 80
                              ? 'text-emerald-700'
                              : p.accuracyPercent >= 60
                              ? 'text-yellow-700'
                              : 'text-rose-700'
                          }`}
                        >
                          {p.accuracyPercent}%
                        </span>
                      </div>

                      <div className="p-1.5 bg-sky-50 border border-sky-200 rounded-lg">
                        <span className="text-[9px] font-black uppercase text-sky-700 block">Denbora</span>
                        <span className="font-black text-xs text-sky-950 block">
                          {p.averageTimeSeconds > 0 ? `${p.averageTimeSeconds}s` : '-'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Desktop View: Full Table (>=md) */}
            <div className="hidden md:block border-2 border-black rounded-xl overflow-hidden shadow-[3px_3px_0_0_#000]">
              <div className="overflow-x-auto horizontal-scroll">
                <table className="w-full text-xs text-left border-collapse bg-white">
                  <thead>
                    <tr className="bg-yellow-200 text-neutral-950 font-black border-b-2 border-black">
                      <th className="p-3">Ikaslea</th>
                      <th className="p-3 text-center">Racha</th>
                      <th className="p-3 text-center">Partidak</th>
                      <th className="p-3 text-center">Puntuak Guztira</th>
                      <th className="p-3 text-center">Asmatze %</th>
                      <th className="p-3 text-center">Denbora Med.</th>
                      <th className="p-3 text-center">Azken Data</th>
                      <th className="p-3 text-center">Ekintzak</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loadingPlayers ? (
                      <tr>
                        <td colSpan={8} className="p-8 text-center font-bold text-neutral-500">
                          Ikasleen datuak kargatzen...
                        </td>
                      </tr>
                    ) : filteredPlayers.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="p-8 text-center font-bold text-neutral-500">
                          Ez da ikaslerik aurkitu bilaketa honekin.
                        </td>
                      </tr>
                    ) : (
                      filteredPlayers.map(p => (
                        <tr
                          key={p.playerId}
                          className="border-b border-neutral-200 hover:bg-yellow-50/50 transition-colors"
                        >
                          <td className="p-3">
                            <span className="font-black text-neutral-950 block">{p.playerName}</span>
                            <span className="text-[10px] text-neutral-500 font-bold">{p.playerId}</span>
                          </td>

                          <td className="p-3 text-center">
                            <span className="inline-flex items-center gap-0.5 font-black text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                              <Flame className="w-3.5 h-3.5 fill-orange-500" />
                              {p.streak}
                            </span>
                          </td>

                          <td className="p-3 text-center font-bold text-neutral-800">
                            {p.totalGames}
                          </td>

                          <td className="p-3 text-center">
                            <span className="font-black text-neutral-950 block">
                              {p.totalPoints.toLocaleString()} pt
                            </span>
                            <span className="text-[10px] text-neutral-400">
                              onena: {p.bestScore} pt
                            </span>
                          </td>

                          <td className="p-3 text-center">
                            <span
                              className={`font-black px-1.5 py-0.5 rounded text-[11px] ${
                                p.accuracyPercent >= 80
                                  ? 'bg-emerald-100 text-emerald-950'
                                  : p.accuracyPercent >= 60
                                  ? 'bg-yellow-100 text-yellow-950'
                                  : 'bg-rose-100 text-rose-950'
                              }`}
                            >
                              {p.accuracyPercent}%
                            </span>
                          </td>

                          <td className="p-3 text-center font-bold text-sky-800">
                            {p.averageTimeSeconds > 0 ? `${p.averageTimeSeconds}s` : '-'}
                          </td>

                          <td className="p-3 text-center font-bold text-neutral-600 text-[11px]">
                            {p.lastPlayedDate || '-'}
                          </td>

                          <td className="p-3 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => setSelectedPlayerForDetails(p)}
                                title="Ikusi xehetasunak eta akatsak"
                                className="p-1.5 bg-sky-100 hover:bg-sky-200 text-sky-900 border border-black rounded-lg shadow-[1px_1px_0_0_#000] cursor-pointer"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => setPlayerToDelete(p)}
                                title="Ezabatu ikaslearen datuak"
                                className="p-1.5 bg-rose-100 hover:bg-rose-200 text-rose-900 border border-black rounded-lg shadow-[1px_1px_0_0_#000] cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Cycle Start Date Config */}
        {activeTab === 'schedule' && (
          <div className="flex-1 min-h-0 overflow-y-auto custom-scroll-y p-4 sm:p-6 space-y-6">
            <div className="p-4 bg-sky-50 border-2 border-black rounded-2xl shadow-[3px_3px_0_0_#000] space-y-2">
              <span className="text-[10px] font-black uppercase text-sky-800 flex items-center gap-1.5">
                <Info className="w-4 h-4" />
                Zikloaren Hasiera & Sailkapenak Berrabiaraztea
              </span>
              <p className="text-xs font-bold text-sky-950 leading-relaxed">
                Mintzakats-ek 7 eguneko ziklo ez-errepikakorretan banatzen ditu 140 galdera.
                Irakasleak dinamika zein datatan hasten den ezartzen duenean, <strong>aurreko ranking eta puntuazio guztiak alde batera uzten dira automatikoki</strong>, ikasle guztiak hutsetik hasi daitezen lehia garbian.
              </p>
            </div>

            {/* Date Configuration Form */}
            <div className="p-5 bg-white border-3 border-black rounded-2xl shadow-[4px_4px_0_0_#000] space-y-4">
              <h3 className="text-sm font-black text-neutral-950 uppercase tracking-wider">
                Dinamikaren Hasiera Data Ezarri
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                <div>
                  <label className="block text-xs font-black text-neutral-700 mb-1.5">
                    Hasiera Data Ofiziala (YYYY-MM-DD):
                  </label>
                  <input
                    type="date"
                    value={inputStartDate}
                    onChange={e => setInputStartDate(e.target.value)}
                    className="w-full p-2.5 bg-white border-2 border-black rounded-xl font-bold text-sm shadow-[2px_2px_0_0_#000] focus:outline-hidden"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSaveStartDate}
                    disabled={isSavingDate}
                    className="flex-1 py-2.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-white font-black text-xs border-2 border-black rounded-xl shadow-[2px_2px_0_0_#000] cursor-pointer flex items-center justify-center gap-1.5 active:translate-x-[1px] active:translate-y-[1px]"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>{isSavingDate ? 'Gordetzen...' : 'Gorde Hasiera Data'}</span>
                  </button>

                  <button
                    onClick={handleResetToCurrentWeek}
                    disabled={isSavingDate}
                    className="py-2.5 px-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-black text-xs border-2 border-black rounded-xl shadow-[2px_2px_0_0_#000] cursor-pointer"
                    title="Berrezarri uneko aste arruntara"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {dateSaveSuccess && (
                <div className="p-3 bg-emerald-100 border border-emerald-400 rounded-xl text-emerald-900 font-black text-xs flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-700" />
                  <span>Hasiera data ondo gorde eta sinkronizatu da!</span>
                </div>
              )}

              {/* Status display */}
              <div className="pt-3 border-t border-neutral-200 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-neutral-100 rounded-xl border border-neutral-300">
                  <span className="text-[10px] font-bold text-neutral-500 block uppercase">
                    Ezarritako Hasiera Data
                  </span>
                  <span className="text-sm font-black text-neutral-950 mt-0.5 block">
                    {currentBlockInfo.configuredStartDateStr || currentBlockInfo.weekMondayDateStr}
                  </span>
                </div>

                <div className="p-3 bg-neutral-100 rounded-xl border border-neutral-300">
                  <span className="text-[10px] font-bold text-neutral-500 block uppercase">
                    Gaurko Eguna Zikloan
                  </span>
                  <span className="text-sm font-black text-emerald-700 mt-0.5 block">
                    {currentBlockInfo.dayNumberInBlock}. Eguna ({currentBlockInfo.dayName})
                  </span>
                </div>

                <div className="p-3 bg-neutral-100 rounded-xl border border-neutral-300">
                  <span className="text-[10px] font-bold text-neutral-500 block uppercase">
                    Mota
                  </span>
                  <span className="text-sm font-black text-purple-700 mt-0.5 block">
                    {currentBlockInfo.isCustomSchedule ? 'Irakaslearen Data Pertsonalizatua' : 'Egutegiko Aste Arrunta'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: 7-Day Questions Inspector */}
        {activeTab === 'questions' && (
          <div className="flex-1 min-h-0 overflow-y-auto custom-scroll-y p-4 sm:p-5 flex flex-col gap-4">
            {/* 7 Days Selector Bar */}
            <div className="flex items-center gap-1.5 overflow-x-auto overflow-y-hidden pb-2 shrink-0 horizontal-scroll">
              {schedule7Days.map((day, idx) => {
                const isSelected = selectedDayTab === idx;
                const isToday = day.dayNumber === currentBlockInfo.dayNumberInBlock;

                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedDayTab(idx)}
                    className={`px-3 py-2 rounded-xl border-2 font-black text-xs shrink-0 flex items-center gap-1.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-purple-600 text-white border-black shadow-[2px_2px_0_0_#000]'
                        : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50'
                    }`}
                  >
                    <span>{day.dayNumber}. {day.dayName}</span>
                    {isToday && (
                      <span className="px-1.5 py-0.2 rounded-full bg-yellow-300 text-neutral-950 text-[9px] font-black">
                        Gaur
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Questions Header for Selected Day */}
            <div className="p-3 bg-purple-50 border-2 border-black rounded-xl flex items-center justify-between gap-2 flex-wrap">
              <div>
                <h3 className="text-sm font-black text-purple-950">
                  {currentSelectedDay?.dayNumber}. Eguna: {currentSelectedDay?.dayName} ({currentSelectedDay?.dateStr})
                </h3>
                <p className="text-[11px] font-bold text-purple-800">
                  Egun honetarako esleitutako 20 galderak (errepikapenik gabe 7 egunetan)
                </p>
              </div>

              <span className="px-2.5 py-1 bg-white border border-purple-300 rounded-lg text-xs font-black text-purple-900">
                20 / 20 galdera
              </span>
            </div>

            {/* 20 Questions List */}
            <div className="space-y-3">
              {loadingQuestions ? (
                <div className="py-12 text-center text-neutral-500 font-bold text-sm">
                  Galderen bankua kargatzen...
                </div>
              ) : currentSelectedDay?.questions.length === 0 ? (
                <div className="py-12 text-center text-neutral-500 font-bold text-sm">
                  Ez da galderarik aurkitu egun honetarako.
                </div>
              ) : (
                currentSelectedDay?.questions.map((q, qIdx) => {
                  const qKey = String(q.id || qIdx);
                  const isExpanded = Boolean(expandedQuestions[qKey]);
                  const optionLetters = ['A', 'B', 'C', 'D'];

                  return (
                    <div
                      key={q.id || qIdx}
                      className="p-3.5 bg-white rounded-xl border-2 border-black shadow-[2px_2px_0_0_#000] space-y-2.5"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded bg-neutral-200 border border-neutral-400 font-black text-xs text-neutral-800 flex items-center justify-center shrink-0">
                            {qIdx + 1}
                          </span>
                          <span className="text-[10px] font-black uppercase tracking-wider text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded border border-neutral-200">
                            {q.category || 'Mistoa'}
                          </span>
                        </div>

                        <button
                          onClick={() => toggleQuestionExpand(qKey)}
                          className="text-[11px] font-bold text-neutral-500 hover:text-black flex items-center gap-1 cursor-pointer"
                        >
                          <span>{isExpanded ? 'Ezkutatu azalpena' : 'Azalpena'}</span>
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>
                      </div>

                      <h4 className="font-black text-sm text-neutral-950 leading-snug">
                        {q.prompt}
                      </h4>

                      {/* 4 Options Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                        {q.options.map((opt, optIdx) => {
                          const isCorrect = optIdx === q.correctIndex;

                          return (
                            <div
                              key={optIdx}
                              className={`p-2 rounded-lg border flex items-center justify-between text-xs ${
                                isCorrect
                                  ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-black'
                                  : 'bg-neutral-50 border-neutral-300 text-neutral-700'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <span className="w-5 h-5 rounded bg-neutral-200 border border-black/30 font-black text-[10px] flex items-center justify-center shrink-0">
                                  {optionLetters[optIdx] || 'A'}
                                </span>
                                <span>{opt}</span>
                              </div>

                              {isCorrect && (
                                <span className="px-1.5 py-0.2 rounded bg-emerald-600 text-white text-[9px] font-black uppercase">
                                  Zuzena
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Explanation expandable */}
                      {isExpanded && (
                        <div className="p-2.5 bg-sky-50 border border-sky-300 rounded-lg text-xs space-y-1 animate-in fade-in duration-150">
                          <span className="text-[10px] font-black uppercase text-sky-800 block">
                            Arau Gramatikala & Azalpena:
                          </span>
                          <p className="font-bold text-sky-950">
                            {q.explanation?.whyCorrect || `"${q.options[q.correctIndex]}" da aukera zuzena.`}
                          </p>
                          {q.explanation?.tip && (
                            <p className="text-[11px] text-sky-800">
                              💡 {q.explanation.tip}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {playerToDelete && (
          <div className="fixed inset-0 z-60 bg-black/60 flex items-center justify-center p-4">
            <div className="w-full max-w-sm bg-white border-4 border-black rounded-2xl p-5 shadow-[6px_6px_0_0_#000] space-y-4">
              <div className="w-12 h-12 rounded-xl bg-rose-100 border-2 border-black flex items-center justify-center mx-auto text-rose-600">
                <Trash2 className="w-6 h-6" />
              </div>

              <div className="text-center space-y-1">
                <h3 className="text-base font-black text-neutral-950">
                  Ezabatu Ikaslearen Datuak?
                </h3>
                <p className="text-xs font-bold text-neutral-600">
                  Ziur zaude <strong className="text-neutral-900">{playerToDelete.playerName}</strong> ikaslearen partida eta estatistika guztiak ezabatu nahi dituzula?
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPlayerToDelete(null)}
                  disabled={isDeleting}
                  className="flex-1 py-2 bg-neutral-100 hover:bg-neutral-200 border-2 border-black rounded-xl font-black text-xs cursor-pointer"
                >
                  Utzi
                </button>

                <button
                  onClick={handleConfirmDeletePlayer}
                  disabled={isDeleting}
                  className="flex-1 py-2 bg-rose-600 hover:bg-rose-500 text-white border-2 border-black rounded-xl font-black text-xs shadow-[2px_2px_0_0_#000] cursor-pointer"
                >
                  {isDeleting ? 'Ezabatzen...' : 'Bai, Ezabatu'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-3 bg-neutral-100 border-t-2 border-black flex items-center justify-between shrink-0">
          <span className="text-xs font-bold text-neutral-600">
            Saioa: <strong className="text-neutral-900">irakasle@mintzakats.app</strong>
          </span>

          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-neutral-950 hover:bg-neutral-800 text-white font-black text-xs rounded-xl border-2 border-black shadow-[2px_2px_0_0_#000] cursor-pointer"
          >
            Itxi Panela
          </button>
        </div>
      </div>
    </div>
  );
};
