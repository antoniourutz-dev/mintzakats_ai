import React, { useState, useMemo } from 'react';
import { 
  X, 
  Trophy, 
  Globe, 
  Users, 
  Flame, 
  Sparkles, 
  Crown, 
  Medal, 
  ArrowUpRight, 
  Search,
  UserPlus,
  Share2
} from 'lucide-react';
import { AppState, LeaderboardEntry } from '../types';

interface LeaderboardProps {
  isOpen: boolean;
  onClose: () => void;
  state: AppState;
}

// Realistic Basque learners for Global Leaderboard
const BASE_GLOBAL_USERS: Omit<LeaderboardEntry, 'isCurrentUser'>[] = [
  { id: 'u1', name: 'Miren Etxebarria', town: 'Bilbo', avatar: 'ME', xp: 2450, streak: 14, badge: 'Maisua' },
  { id: 'u2', name: 'Jon Agirre', town: 'Donostia', avatar: 'JA', xp: 2180, streak: 9, badge: 'Aditua' },
  { id: 'u3', name: 'Ane Mendizabal', town: 'Gasteiz', avatar: 'AM', xp: 1940, streak: 12, badge: 'Ikasle fina' },
  { id: 'u4', name: 'Mikel Urrutia', town: 'Iruñea', avatar: 'MU', xp: 1720, streak: 7, badge: 'Ikasle fina' },
  { id: 'u5', name: 'Olatz Larrañaga', town: 'Zarautz', avatar: 'OL', xp: 1460, streak: 6, badge: 'Trebea' },
  { id: 'u6', name: 'Unai Goikoetxea', town: 'Tolosa', avatar: 'UG', xp: 1280, streak: 5, badge: 'Trebea' },
  { id: 'u7', name: 'Itziar Zabala', town: 'Baiona', avatar: 'IZ', xp: 1110, streak: 4, badge: 'Hasiberria' },
  { id: 'u8', name: 'Koldo Bereziartua', town: 'Gernika', avatar: 'KB', xp: 950, streak: 3, badge: 'Hasiberria' },
  { id: 'u9', name: 'Amaia Ormaetxea', town: 'Durango', avatar: 'AO', xp: 780, streak: 2, badge: 'Hasiberria' },
  { id: 'u10', name: 'Eneko Zubizarreta', town: 'Arrasate', avatar: 'EZ', xp: 620, streak: 1, badge: 'Hasiberria' },
];

// Realistic Basque friends for Friends Leaderboard
const BASE_FRIENDS_USERS: Omit<LeaderboardEntry, 'isCurrentUser'>[] = [
  { id: 'f1', name: 'Mikel Urrutia', town: 'Iruñea', avatar: 'MU', xp: 1720, streak: 7, badge: 'Laguna' },
  { id: 'f2', name: 'Olatz Larrañaga', town: 'Zarautz', avatar: 'OL', xp: 1460, streak: 6, badge: 'Laguna' },
  { id: 'f3', name: 'Unai Goikoetxea', town: 'Tolosa', avatar: 'UG', xp: 1280, streak: 5, badge: 'Laguna' },
  { id: 'f4', name: 'Koldo Bereziartua', town: 'Gernika', avatar: 'KB', xp: 950, streak: 3, badge: 'Laguna' },
  { id: 'f5', name: 'Amaia Ormaetxea', town: 'Durango', avatar: 'AO', xp: 780, streak: 2, badge: 'Laguna' },
];

export const Leaderboard: React.FC<LeaderboardProps> = ({
  isOpen,
  onClose,
  state
}) => {
  const [activeTab, setActiveTab] = useState<'global' | 'friends'>('global');
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedInvite, setCopiedInvite] = useState(false);

  // Compute leaderboard with current user injected dynamically based on real state XP and streak
  const { sortedList, currentUserRank, pointsToNext } = useMemo(() => {
    const currentUser: LeaderboardEntry = {
      id: 'current-user',
      name: 'Zu (Gaurko jokalaria)',
      town: 'Euskal Herria',
      avatar: 'ZU',
      xp: state.xp,
      streak: state.streak || 0,
      isCurrentUser: true,
      badge: state.xp >= 1500 ? 'Maisua' : state.xp >= 800 ? 'Trebea' : 'Erronkaria'
    };

    const baseList = activeTab === 'global' ? BASE_GLOBAL_USERS : BASE_FRIENDS_USERS;
    const combined: LeaderboardEntry[] = [...baseList, currentUser];

    // Sort descending by XP, then streak
    combined.sort((a, b) => {
      if (b.xp !== a.xp) return b.xp - a.xp;
      return b.streak - a.streak;
    });

    // Assign rank
    const ranked = combined.map((entry, index) => ({
      ...entry,
      rank: index + 1
    }));

    const userIndex = ranked.findIndex(e => e.isCurrentUser);
    const userRank = userIndex !== -1 ? userIndex + 1 : 1;
    
    let ptsToNext = 0;
    if (userIndex > 0) {
      ptsToNext = ranked[userIndex - 1].xp - ranked[userIndex].xp + 10;
    }

    // Filter by search
    const filtered = ranked.filter(e => 
      e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.town.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return {
      sortedList: filtered,
      currentUserRank: userRank,
      pointsToNext: ptsToNext
    };
  }, [activeTab, state.xp, state.streak, searchTerm]);

  if (!isOpen) return null;

  const top3 = sortedList.slice(0, 3);
  const remaining = sortedList.slice(3);

  const handleCopyInvite = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `Jolastu nirekin «Mintzakats» euskara erronka batera! Nire segida: ${state.streak || 0} egun eta ${state.xp} XP ditut. Harrapatu nazazu!`
      );
      setCopiedInvite(true);
      setTimeout(() => setCopiedInvite(false), 2500);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        id="leaderboard-modal-container"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-white border-4 border-black rounded-2xl shadow-[8px_8px_0_0_#000000] text-neutral-900 max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b-2 border-black bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 bg-yellow-400 border-2 border-black rounded-xl shadow-[3px_3px_0_0_#000] flex items-center justify-center text-xl">
              <Trophy className="w-6 h-6 text-neutral-950 fill-amber-500" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-none text-neutral-950">
                  Sailkapena
                </h2>
                <span className="px-2 py-0.5 bg-yellow-300 border border-black rounded-full text-[10px] font-black uppercase text-neutral-900 shadow-[1px_1px_0_0_#000]">
                  Urrezko Liga
                </span>
              </div>
              <p className="text-xs font-bold text-neutral-700 mt-1">
                Euskaraz gehien ikasi duten jokalariak (XP)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            id="close-leaderboard-btn"
            aria-label="Itxi sailkapena"
            className="p-2 bg-white hover:bg-neutral-100 border-2 border-black rounded-xl text-neutral-900 transition-all cursor-pointer shadow-[2px_2px_0_0_#000] shrink-0"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Global vs Friends Switcher & Search Bar */}
        <div className="p-3.5 border-b-2 border-black bg-neutral-50 flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between shrink-0">
          {/* Toggle buttons */}
          <div className="flex rounded-xl border-2 border-black p-1 bg-neutral-200 shadow-[2px_2px_0_0_#000]">
            <button
              onClick={() => {
                setActiveTab('global');
              }}
              id="leaderboard-tab-global"
              className={`flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                activeTab === 'global'
                  ? 'bg-neutral-950 text-white shadow-[1px_1px_0_0_#000]'
                  : 'text-neutral-700 hover:text-neutral-950'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Mundu Mailan</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('friends');
              }}
              id="leaderboard-tab-friends"
              className={`flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                activeTab === 'friends'
                  ? 'bg-neutral-950 text-white shadow-[1px_1px_0_0_#000]'
                  : 'text-neutral-700 hover:text-neutral-950'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Lagunak</span>
            </button>
          </div>

          {/* Search Input */}
          <div className="relative flex-1 sm:max-w-[200px]">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Bilatu jokalaria..."
              className="w-full pl-8 pr-3 py-1.5 bg-white border-2 border-black rounded-lg text-xs font-bold placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-black shadow-[2px_2px_0_0_#000]"
            />
          </div>
        </div>

        {/* Current User Ranking Summary Banner */}
        <div className="px-4 py-2.5 bg-amber-50 border-b-2 border-black flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-amber-300 border border-black rounded font-black text-amber-950 shadow-[1px_1px_0_0_#000]">
              #{currentUserRank}
            </span>
            <span className="font-extrabold text-neutral-900">
              Zure lekua sailkapenean
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 font-black text-orange-600">
              <Flame className="w-3.5 h-3.5 fill-orange-500" />
              <span>{state.streak || 0} egun</span>
            </div>
            <div className="flex items-center gap-1 font-black text-indigo-700">
              <span>⚡ {state.xp} XP</span>
            </div>
          </div>
        </div>

        {/* Scrollable Content: Top 3 Podium & Ranking List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Top 3 Podium */}
          {!searchTerm && top3.length === 3 && (
            <div className="py-2 px-1">
              <div className="grid grid-cols-3 gap-2 items-end pt-5">
                {/* 2nd Place */}
                <div className="flex flex-col items-center">
                  <div className="relative mb-2 flex flex-col items-center">
                    <span className="w-6 h-6 rounded-full bg-slate-300 border-2 border-black font-black text-xs flex items-center justify-center shadow-[1px_1px_0_0_#000] mb-1">
                      2
                    </span>
                    <div className="w-12 h-12 rounded-xl bg-slate-100 border-2 border-black flex items-center justify-center font-black text-sm shadow-[2px_2px_0_0_#000]">
                      {top3[1].avatar}
                    </div>
                  </div>
                  <div className={`w-full p-2 rounded-t-xl border-2 border-black bg-slate-200 text-center shadow-[2px_2px_0_0_#000] ${top3[1].isCurrentUser ? 'ring-2 ring-amber-500' : ''}`}>
                    <div className="text-[11px] font-black truncate">{top3[1].name.split(' ')[0]}</div>
                    <div className="text-[10px] font-bold text-slate-700 truncate">{top3[1].town}</div>
                    <div className="text-[10px] font-black text-neutral-950 mt-1">⚡ {top3[1].xp}</div>
                  </div>
                </div>

                {/* 1st Place */}
                <div className="flex flex-col items-center -mt-4">
                  <div className="relative mb-2 flex flex-col items-center">
                    <Crown className="w-6 h-6 text-amber-500 fill-amber-400 -mb-1 animate-bounce" />
                    <span className="w-7 h-7 rounded-full bg-amber-300 border-2 border-black font-black text-xs flex items-center justify-center shadow-[1px_1px_0_0_#000] mb-1">
                      1
                    </span>
                    <div className="w-14 h-14 rounded-xl bg-amber-100 border-2 border-black flex items-center justify-center font-black text-base shadow-[3px_3px_0_0_#000]">
                      {top3[0].avatar}
                    </div>
                  </div>
                  <div className={`w-full p-2.5 rounded-t-xl border-2 border-black bg-amber-300 text-center shadow-[3px_3px_0_0_#000] ${top3[0].isCurrentUser ? 'ring-2 ring-black' : ''}`}>
                    <div className="text-xs font-black truncate">{top3[0].name.split(' ')[0]}</div>
                    <div className="text-[10px] font-bold text-amber-900 truncate">{top3[0].town}</div>
                    <div className="text-[11px] font-black text-neutral-950 mt-1">⚡ {top3[0].xp}</div>
                  </div>
                </div>

                {/* 3rd Place */}
                <div className="flex flex-col items-center">
                  <div className="relative mb-2 flex flex-col items-center">
                    <span className="w-6 h-6 rounded-full bg-amber-600 text-white border-2 border-black font-black text-xs flex items-center justify-center shadow-[1px_1px_0_0_#000] mb-1">
                      3
                    </span>
                    <div className="w-12 h-12 rounded-xl bg-amber-50 border-2 border-black flex items-center justify-center font-black text-sm shadow-[2px_2px_0_0_#000]">
                      {top3[2].avatar}
                    </div>
                  </div>
                  <div className={`w-full p-2 rounded-t-xl border-2 border-black bg-amber-200 text-center shadow-[2px_2px_0_0_#000] ${top3[2].isCurrentUser ? 'ring-2 ring-amber-500' : ''}`}>
                    <div className="text-[11px] font-black truncate">{top3[2].name.split(' ')[0]}</div>
                    <div className="text-[10px] font-bold text-amber-900 truncate">{top3[2].town}</div>
                    <div className="text-[10px] font-black text-neutral-950 mt-1">⚡ {top3[2].xp}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Full List of Competitors */}
          <div className="space-y-2">
            {sortedList.map((entry) => {
              const isUser = entry.isCurrentUser;
              return (
                <div
                  key={entry.id}
                  className={`flex items-center justify-between p-2.5 sm:p-3 rounded-xl border-2 border-black transition-all ${
                    isUser
                      ? 'bg-amber-100/90 shadow-[3px_3px_0_0_#000] ring-2 ring-amber-500'
                      : 'bg-white hover:bg-neutral-50 shadow-[2px_2px_0_0_#000]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                    {/* Rank Badge */}
                    <span className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg border-2 border-black flex items-center justify-center font-black text-xs sm:text-sm shrink-0 ${
                      entry.rank === 1
                        ? 'bg-amber-300 text-neutral-950'
                        : entry.rank === 2
                        ? 'bg-slate-200 text-neutral-950'
                        : entry.rank === 3
                        ? 'bg-amber-600 text-white'
                        : 'bg-neutral-100 text-neutral-700'
                    }`}>
                      {entry.rank}
                    </span>

                    {/* Avatar Initials */}
                    <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg border-2 border-black flex items-center justify-center font-black text-xs shrink-0 ${
                      isUser ? 'bg-amber-300 text-black' : 'bg-neutral-100 text-neutral-800'
                    }`}>
                      {entry.avatar}
                    </div>

                    {/* Name & Details */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className={`font-black text-xs sm:text-sm truncate ${isUser ? 'text-amber-950 font-black' : 'text-neutral-900'}`}>
                          {entry.name}
                        </span>
                        {isUser && (
                          <span className="px-1.5 py-0.2 bg-amber-400 text-black text-[9px] font-black rounded border border-black uppercase tracking-wider">
                            ZUK
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] sm:text-[11px] font-bold text-neutral-500">
                        <span>{entry.town}</span>
                        {entry.badge && (
                          <>
                            <span>·</span>
                            <span className="text-neutral-700">{entry.badge}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* XP & Streak Stats */}
                  <div className="flex items-center gap-3 sm:gap-4 shrink-0 pl-2">
                    {/* Daily Streak */}
                    <div 
                      title={`${entry.streak} egun jarraian galdetegia amaituta`}
                      className="flex items-center gap-1 text-xs font-black text-orange-600"
                    >
                      <Flame className="w-3.5 h-3.5 fill-orange-500" />
                      <span>{entry.streak}</span>
                    </div>

                    {/* Total XP */}
                    <div className="px-2 sm:px-2.5 py-1 bg-indigo-50 border border-indigo-300 rounded-lg text-xs font-black text-indigo-950 shadow-[1px_1px_0_0_#6366f1]">
                      {entry.xp} <span className="text-[10px] text-indigo-600">XP</span>
                    </div>
                  </div>
                </div>
              );
            })}

            {sortedList.length === 0 && (
              <div className="py-8 text-center text-neutral-500 font-bold text-xs">
                Ez da jokalari hori aurkitu.
              </div>
            )}
          </div>
        </div>

        {/* Bottom Actions Footer */}
        <div className="p-3 border-t-2 border-black bg-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-2 shrink-0">
          <div className="text-[11px] font-extrabold text-neutral-600">
            {pointsToNext > 0 ? (
              <span>
                🎯 <strong className="text-neutral-900 font-black">{pointsToNext} XP</strong> falta zaizkizu aurreko jokalaria gainditzeko!
              </span>
            ) : (
              <span>🏆 Zuk duzu lehen postua! Eutsi segidari!</span>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleCopyInvite}
              id="invite-friends-btn"
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 bg-yellow-300 hover:bg-yellow-200 border-2 border-black rounded-lg text-xs font-black text-neutral-950 shadow-[2px_2px_0_0_#000] transition-all cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copiedInvite ? 'Kopiatuta!' : 'Lagunak Gonbidatu'}</span>
            </button>

            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white border-2 border-black rounded-lg text-xs font-black shadow-[2px_2px_0_0_#000] cursor-pointer"
            >
              Itxi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
