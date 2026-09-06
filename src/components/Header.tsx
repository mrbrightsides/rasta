import { Match } from '../types';
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
} from 'lucide-react';

export type NavTab =
  | 'dashboard'
  | 'excel-sheet'
  | 'scorer'
  | 'team-fulltime'
  | 'stats-per-end'
  | 'athletes'
  | 'head-to-head'
  | 'matches';

interface HeaderProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  match: Match | null;
  isRealtimeConnected: boolean;
  onResetDemo: () => void;
  openMobilePreview: boolean;
  setOpenMobilePreview: (v: boolean) => void;
}

export default function Header({
  activeTab,
  setActiveTab,
  match,
  isRealtimeConnected,
  onResetDemo,
}: HeaderProps) {
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
              Rasyono Technology Analysis Petanque
            </p>
            <p className="text-white/70 text-[11px] font-semibold tracking-wider uppercase">
              PROFESSIONAL PERFORMANCE TRACKING
            </p>
          </div>
        </div>

        {/* Live Match Badge, Match ID & Quick Controls */}
        <div className="flex items-center gap-3 sm:gap-5">
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

          {/* Match ID / Location */}
          <div className="text-right hidden md:block">
            <p className="text-[11px] text-white/70 uppercase font-semibold tracking-wider">
              Match Info
            </p>
            <p className="font-mono text-sm text-white font-bold tracking-tight">
              {match ? `${match.teamA.name.slice(0, 3)}-${match.teamB.name.slice(0, 3)}-${match.currentDistance}` : 'INA-THA-2024'}
            </p>
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

          {/* Reset Demo Button */}
          <button
            id="header-btn-reset"
            onClick={onResetDemo}
            title="Reset to official demo data"
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Reset</span>
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
    </header>
  );
}
