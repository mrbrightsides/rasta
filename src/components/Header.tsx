import { useState } from 'react';
import { Match } from '../types';
import AcademicFrameworkModal from './AcademicFrameworkModal';
import LocalStorageModal from './LocalStorageModal';
import {
  Activity,
  Smartphone,
  LayoutDashboard,
  Users,
  Swords,
  Layers,
  Flame,
  RotateCcw,
  FileSpreadsheet,
  GraduationCap,
  FileCheck2,
  Target,
  HardDrive,
} from 'lucide-react';

export type NavTab =
  | 'dashboard'
  | 'excel-sheet'
  | 'precision-shooting'
  | 'scorer'
  | 'team-fulltime'
  | 'stats-per-end'
  | 'athletes'
  | 'head-to-head'
  | 'post-match-report'
  | 'matches';

interface HeaderProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  match: Match | null;
  matchesList?: Match[];
  onSelectMatch?: (match: Match) => void;
  isRealtimeConnected: boolean;
  onResetDemo: () => void;
  openMobilePreview: boolean;
  setOpenMobilePreview: (v: boolean) => void;
}

export default function Header({
  activeTab,
  setActiveTab,
  match,
  matchesList = [],
  onSelectMatch,
  isRealtimeConnected,
  onResetDemo,
}: HeaderProps) {
  const [showAcademicModal, setShowAcademicModal] = useState<boolean>(false);
  const [showStorageModal, setShowStorageModal] = useState<boolean>(false);
  const isMatchLive = match?.status === 'LIVE';

  return (
    <header className="sticky top-0 z-40 shadow-md">
      {/* 1. Main Brand Header (Professional Polish Deep Navy #002395) */}
      <div className="bg-[#002395] text-white px-4 sm:px-6 py-3.5 flex flex-wrap justify-between items-center gap-4">
        {/* Logo & Platform Name */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="bg-white text-[#002395] font-black px-3 py-1 rounded text-2xl tracking-tighter font-['Outfit'] shadow-xs select-none">
            RASTA
          </div>
          <div className="h-8 w-[1px] bg-white/20 hidden sm:block" />
          <div className="text-sm leading-tight">
            <p className="font-bold text-white tracking-tight">
              Rasyo Technology Analysis Petanque
            </p>
            <p className="text-white/70 text-[11px] font-semibold tracking-wider uppercase">
              PROFESSIONAL PERFORMANCE TRACKING
            </p>
          </div>
        </div>

        {/* Live Match Badge, Match Selector & Quick Controls */}
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
          {/* Match Switcher Dropdown */}
          {matchesList.length > 0 && onSelectMatch && (
            <div className="flex items-center gap-1.5 bg-[#001c77] border border-white/20 rounded-md px-2.5 py-1 text-xs">
              <span className="text-[10px] uppercase font-bold text-white/70 hidden lg:inline">Match:</span>
              <select
                id="header-match-selector"
                value={match?.id || ''}
                onChange={(e) => {
                  const target = matchesList.find((m) => m.id === e.target.value);
                  if (target) onSelectMatch(target);
                }}
                className="bg-transparent text-white font-bold text-xs outline-none cursor-pointer max-w-[220px] sm:max-w-[280px] truncate"
              >
                {matchesList.map((m) => (
                  <option key={m.id} value={m.id} className="text-slate-900 bg-white">
                    {m.name.length > 40 ? `${m.name.slice(0, 38)}...` : m.name} ({m.scoreA}-{m.scoreB})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Live Pulsing Badge */}
          <div
            className={`flex items-center gap-2 px-3 py-1 rounded-full text-white shadow-xs ${
              isMatchLive ? 'bg-[#ED2939] animate-pulse' : 'bg-slate-700'
            }`}
          >
            <div className="w-2 h-2 bg-white rounded-full" />
            <span className="text-xs font-bold uppercase tracking-widest">
              {isMatchLive ? 'Live Match' : 'Match Final'}
            </span>
          </div>

          {/* Quick Switch to Scorer (Primary Operational Button) */}
          <button
            id="header-btn-scorer"
            onClick={() => setActiveTab('scorer')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-all shadow-xs ${
              activeTab === 'scorer'
                ? 'bg-[#ED2939] text-white ring-2 ring-white/50'
                : 'bg-white text-[#002395] hover:bg-slate-100'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Scorer</span>
          </button>

          {/* Academic Attribution Modal Trigger (Disertasi Rasyono UNP) */}
          <button
            id="header-btn-academic"
            onClick={() => setShowAcademicModal(true)}
            title="Lihat Kerangka Riset Disertasi Doktor Ilmu Keolahragaan UNP (Rasyono, NIM. 25344021)"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-amber-950 bg-amber-400 hover:bg-amber-300 rounded transition-all shadow-xs border border-amber-300"
          >
            <GraduationCap className="w-4 h-4 text-amber-950" />
            <span>Disertasi UNP</span>
          </button>

          {/* LocalStorage Status & Control Button */}
          <button
            id="header-btn-storage"
            onClick={() => setShowStorageModal(true)}
            title="Kelola Data LocalStorage Browser & Cadangan JSON"
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/80 rounded transition-colors border border-emerald-700/60"
          >
            <HardDrive className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden md:inline">LocalStorage</span>
          </button>

          {/* Reset Demo Button */}
          <button
            id="header-btn-reset"
            onClick={onResetDemo}
            title="Muat ulang seluruh 3 data pertandingan resmi (Tabel 1.1 Triple Men, Mixed Triple, SEA Games)"
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-white/90 hover:text-white bg-white/15 hover:bg-white/25 rounded transition-colors border border-white/20"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset 3 Match</span>
          </button>
        </div>
      </div>

      {/* 2. Professional Navigation Ribbon (Deep Dark Accent #001c77) */}
      <div className="bg-[#001c77] border-t border-white/10 px-4 sm:px-6 py-1.5">
        <nav className="max-w-7xl mx-auto flex items-center gap-1.5 overflow-x-auto scrollbar-none text-xs font-semibold">
          <button
            id="nav-tab-dashboard"
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-all whitespace-nowrap ${
              activeTab === 'dashboard'
                ? 'bg-white text-[#002395] font-bold shadow-xs'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Live Dashboard</span>
          </button>

          <button
            id="nav-tab-excel-sheet"
            onClick={() => setActiveTab('excel-sheet')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-all whitespace-nowrap ${
              activeTab === 'excel-sheet'
                ? 'bg-amber-400 text-amber-950 font-black shadow-xs ring-2 ring-amber-300'
                : 'text-amber-200 hover:text-white hover:bg-white/10'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-amber-300" />
            <span>Lembar Excel Performa</span>
            <span className="bg-amber-300 text-amber-950 text-[9px] font-black px-1.5 py-0.2 rounded">
              EXCEL
            </span>
          </button>

          <button
            id="nav-tab-precision-shooting"
            onClick={() => setActiveTab('precision-shooting')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-all whitespace-nowrap ${
              activeTab === 'precision-shooting'
                ? 'bg-amber-300 text-amber-950 font-black shadow-xs ring-2 ring-amber-200'
                : 'text-amber-200 hover:text-white hover:bg-white/10'
            }`}
          >
            <Target className="w-3.5 h-3.5 text-amber-300" />
            <span>Precision Shooting</span>
            <span className="bg-amber-400 text-amber-950 text-[9px] font-black px-1.5 py-0.2 rounded">
              FOPI 60P
            </span>
          </button>

          <button
            id="nav-tab-post-match-report"
            onClick={() => setActiveTab('post-match-report')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-all whitespace-nowrap ${
              activeTab === 'post-match-report'
                ? 'bg-emerald-500 text-white font-black shadow-xs ring-2 ring-emerald-300'
                : 'text-emerald-200 hover:text-white hover:bg-white/10'
            }`}
          >
            <FileCheck2 className="w-3.5 h-3.5 text-emerald-300" />
            <span>Post-Match Report & Latihan</span>
            <span className="bg-emerald-400 text-emerald-950 text-[9px] font-black px-1.5 py-0.2 rounded">
              TAHAP 5
            </span>
          </button>

          <button
            id="nav-tab-scorer"
            onClick={() => setActiveTab('scorer')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-all whitespace-nowrap ${
              activeTab === 'scorer'
                ? 'bg-white text-[#002395] font-bold shadow-xs'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile Scorer</span>
            <span className="ml-1 bg-[#ED2939] text-white text-[9px] font-black px-1.5 py-0.2 rounded-full">
              LIVE
            </span>
          </button>

          <button
            id="nav-tab-team-fulltime"
            onClick={() => setActiveTab('team-fulltime')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-all whitespace-nowrap ${
              activeTab === 'team-fulltime'
                ? 'bg-white text-[#002395] font-bold shadow-xs'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Team Full-Time</span>
          </button>

          <button
            id="nav-tab-stats-per-end"
            onClick={() => setActiveTab('stats-per-end')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-all whitespace-nowrap ${
              activeTab === 'stats-per-end'
                ? 'bg-white text-[#002395] font-bold shadow-xs'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Statistic Per End</span>
          </button>

          <button
            id="nav-tab-athletes"
            onClick={() => setActiveTab('athletes')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-all whitespace-nowrap ${
              activeTab === 'athletes'
                ? 'bg-white text-[#002395] font-bold shadow-xs'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Athlete Analytics</span>
          </button>

          <button
            id="nav-tab-head-to-head"
            onClick={() => setActiveTab('head-to-head')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-all whitespace-nowrap ${
              activeTab === 'head-to-head'
                ? 'bg-white text-[#002395] font-bold shadow-xs'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            <Swords className="w-3.5 h-3.5" />
            <span>Head-to-Head</span>
          </button>

          <button
            id="nav-tab-matches"
            onClick={() => setActiveTab('matches')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-all whitespace-nowrap ${
              activeTab === 'matches'
                ? 'bg-white text-[#002395] font-bold shadow-xs'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Match Setup & History</span>
          </button>
        </nav>
      </div>

      {/* Academic Framework & Dissertation Slides Modal */}
      <AcademicFrameworkModal
        isOpen={showAcademicModal}
        onClose={() => setShowAcademicModal(false)}
      />

      {/* LocalStorage Management Modal */}
      <LocalStorageModal
        isOpen={showStorageModal}
        onClose={() => setShowStorageModal(false)}
      />
    </header>
  );
}
