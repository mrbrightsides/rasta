import { useState, useEffect, useCallback } from 'react';
import { Match, ThrowAction, DistanceMeters } from './types';
import {
  fetchMatches,
  recordAction,
  deleteAction,
  completeEnd,
  finishMatch,
  resetDemo,
  restoreAllDefaultMatches,
  createMatch,
  updateEndDistance,
  subscribeToMatchUpdates,
  getActiveMatchId,
  setActiveMatchId,
} from './lib/api';
import { getDefaultMatches, createDemoMatch, createMixedTripleMatch, createTripleMenMatch } from './lib/demoData';
import Header, { NavTab } from './components/Header';
import LiveDashboard from './components/LiveDashboard';
import MobileScorer from './components/MobileScorer';
import TeamFullTime from './components/TeamFullTime';
import StatisticPerEnd from './components/StatisticPerEnd';
import AthleteAnalytics from './components/AthleteAnalytics';
import HeadToHead from './components/HeadToHead';
import MatchManager from './components/MatchManager';
import ExcelPerformanceSheet from './components/ExcelPerformanceSheet';
import PostMatchReport from './components/PostMatchReport';
import PrecisionShooting from './components/PrecisionShooting';
import { Smartphone, Monitor, Sparkles, RefreshCw } from 'lucide-react';

export default function App() {
  // Navigation tab state (supports hash routes e.g. #scorer, #dashboard, #excel-sheet, #precision-shooting, #post-match-report)
  const [activeTab, setActiveTab] = useState<NavTab>(() => {
    const hash = window.location.hash.replace('#', '');
    if (
      [
        'dashboard',
        'excel-sheet',
        'precision-shooting',
        'post-match-report',
        'scorer',
        'team-fulltime',
        'stats-per-end',
        'athletes',
        'head-to-head',
        'matches',
      ].includes(hash)
    ) {
      return hash as NavTab;
    }
    return 'excel-sheet'; // Default to Excel Sheet so user immediately sees their exact spreadsheet!
  });

  const [matches, setMatches] = useState<Match[]>(() => getDefaultMatches());
  const [currentMatch, setCurrentMatch] = useState<Match>(() => {
    const defaults = getDefaultMatches();
    const activeId = getActiveMatchId();
    return defaults.find((m) => m.id === activeId) || defaults[0];
  });
  const [isRealtimeConnected, setIsRealtimeConnected] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [openMobilePreview, setOpenMobilePreview] = useState<boolean>(false);

  // Sync hash in URL when tab changes
  useEffect(() => {
    window.location.hash = activeTab;
  }, [activeTab]);

  // Initial load
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const list = await fetchMatches();
        if (isMounted && list && list.length > 0) {
          setMatches(list);
          const activeId = getActiveMatchId();
          const found = list.find((m) => m.id === activeId);
          setCurrentMatch(found || list[0]);
        }
      } catch (err) {
        console.error('Error loading matches:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Realtime SSE subscription
  useEffect(() => {
    const unsubscribe = subscribeToMatchUpdates((event, payload) => {
      setIsRealtimeConnected(true);

      if (event === 'action_recorded' && payload.match) {
        setCurrentMatch(payload.match);
        setMatches((prev) =>
          prev.map((m) => (m.id === payload.match.id ? payload.match : m))
        );
      } else if (event === 'action_deleted' && payload.match) {
        setCurrentMatch(payload.match);
        setMatches((prev) =>
          prev.map((m) => (m.id === payload.match.id ? payload.match : m))
        );
      } else if (event === 'end_completed' && payload.match) {
        setCurrentMatch(payload.match);
        setMatches((prev) =>
          prev.map((m) => (m.id === payload.match.id ? payload.match : m))
        );
      } else if (event === 'match_finished' && payload.match) {
        setCurrentMatch(payload.match);
        setMatches((prev) =>
          prev.map((m) => (m.id === payload.match.id ? payload.match : m))
        );
      } else if (event === 'demo_reset') {
        const defaults = restoreAllDefaultMatches();
        setMatches(defaults);
        setCurrentMatch(defaults[0]);
      } else if (event === 'match_created') {
        setMatches((prev) => [payload, ...prev]);
        setCurrentMatch(payload);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Action handlers
  const handleRecordAction = useCallback(
    async (actionData: Partial<ThrowAction>) => {
      if (!currentMatch) return;
      const res = await recordAction(currentMatch.id, actionData);
      if (res && res.match) {
        setCurrentMatch(res.match);
        setMatches((prev) =>
          prev.map((m) => (m.id === res.match.id ? res.match : m))
        );
      }
    },
    [currentMatch]
  );

  const handleDeleteAction = useCallback(
    async (actionId: string) => {
      if (!currentMatch) return;
      const updated = await deleteAction(currentMatch.id, actionId);
      if (updated) {
        setCurrentMatch(updated);
        setMatches((prev) =>
          prev.map((m) => (m.id === updated.id ? updated : m))
        );
      }
    },
    [currentMatch]
  );

  const handleCompleteEnd = useCallback(
    async (
      endNumber: number,
      scoreA: number,
      scoreB: number,
      nextDistance: string
    ) => {
      if (!currentMatch) return;
      const updated = await completeEnd(
        currentMatch.id,
        endNumber,
        scoreA,
        scoreB,
        nextDistance
      );
      if (updated) {
        setCurrentMatch(updated);
        setMatches((prev) =>
          prev.map((m) => (m.id === updated.id ? updated : m))
        );
      }
    },
    [currentMatch]
  );

  const handleFinishMatch = useCallback(async () => {
    if (!currentMatch) return;
    const updated = await finishMatch(currentMatch.id);
    if (updated) {
      setCurrentMatch(updated);
      setMatches((prev) =>
        prev.map((m) => (m.id === updated.id ? updated : m))
      );
    }
  }, [currentMatch]);

  const handleResetDemo = useCallback(async () => {
    const defaults = restoreAllDefaultMatches();
    setMatches(defaults);
    setCurrentMatch(defaults[0]);
  }, []);

  const handleSelectMatch = useCallback((m: Match) => {
    setCurrentMatch(m);
    setActiveMatchId(m.id);
  }, []);

  const handleUpdateEndDistance = useCallback(
    async (endNumber: number, newDistance: DistanceMeters) => {
      if (!currentMatch) return;
      const updated = await updateEndDistance(currentMatch.id, endNumber, newDistance);
      if (updated) {
        setCurrentMatch(updated);
        setMatches((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
      }
    },
    [currentMatch]
  );

  const handleCreateMatch = useCallback(async (matchData: Partial<Match>) => {
    const created = await createMatch(matchData);
    setMatches((prev) => [created, ...prev]);
    setCurrentMatch(created);
    setActiveMatchId(created.id);
    setActiveTab('scorer');
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-['Plus_Jakarta_Sans'] flex flex-col selection:bg-[#002395] selection:text-white">
      {/* Top Header with RASTA branding and Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        match={currentMatch}
        matchesList={matches}
        onSelectMatch={handleSelectMatch}
        isRealtimeConnected={isRealtimeConnected}
        onResetDemo={handleResetDemo}
        openMobilePreview={openMobilePreview}
        setOpenMobilePreview={setOpenMobilePreview}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
        {activeTab === 'excel-sheet' && (
          <ExcelPerformanceSheet
            match={currentMatch}
            matches={matches}
            onRecordAction={handleRecordAction}
            onDeleteAction={handleDeleteAction}
            onUpdateEndDistance={handleUpdateEndDistance}
            onSwitchToMatch={(mId) => {
              const found = matches.find((m) => m.id === mId);
              if (found) handleSelectMatch(found);
            }}
          />
        )}

        {activeTab === 'precision-shooting' && <PrecisionShooting />}

        {activeTab === 'dashboard' && (
          <LiveDashboard
            match={currentMatch}
            matches={matches}
            onSelectMatch={handleSelectMatch}
            onNavigateToScorer={() => setActiveTab('scorer')}
            onNavigateToTeamFullTime={() => setActiveTab('team-fulltime')}
            onNavigateToPostMatch={() => setActiveTab('post-match-report')}
          />
        )}

        {activeTab === 'post-match-report' && (
          <PostMatchReport
            match={currentMatch}
            matchesList={matches}
            onSelectMatch={handleSelectMatch}
          />
        )}

        {activeTab === 'scorer' && (
          <MobileScorer
            match={currentMatch}
            onRecordAction={handleRecordAction}
            onDeleteAction={handleDeleteAction}
            onCompleteEnd={handleCompleteEnd}
            onFinishMatch={handleFinishMatch}
            onUpdateEndDistance={handleUpdateEndDistance}
          />
        )}

        {activeTab === 'team-fulltime' && <TeamFullTime match={currentMatch} />}

        {activeTab === 'stats-per-end' && (
          <StatisticPerEnd match={currentMatch} />
        )}

        {activeTab === 'athletes' && <AthleteAnalytics match={currentMatch} />}

        {activeTab === 'head-to-head' && <HeadToHead match={currentMatch} />}

        {activeTab === 'matches' && (
          <MatchManager
            currentMatch={currentMatch}
            matchesList={matches}
            onSelectMatch={handleSelectMatch}
            onCreateMatch={handleCreateMatch}
            onFinishMatch={handleFinishMatch}
            onResetDemo={handleResetDemo}
          />
        )}
      </main>

      {/* Professional Polish Petanque Footer */}
      <footer className="bg-white border-t border-slate-200 px-6 py-2.5 flex flex-wrap justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest gap-2">
        <div className="flex items-center gap-2">
          <span className="text-[#002395] font-black">RASTA</span>
          <span>© 2026 Rasyo Technology Analysis Petanque</span>
        </div>
        <div className="hidden sm:block">
          Court #04 • Jakarta International Petanque Arena
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span>V 1.0.4-MVP • Realtime Connected</span>
        </div>
      </footer>
    </div>
  );
}
