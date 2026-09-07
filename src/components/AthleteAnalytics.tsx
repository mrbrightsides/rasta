import { useState, useMemo } from 'react';
import { Match, Player, DistanceMeters, ThrowAction } from '../types';
import {
  calculatePerformance,
  calculateStatsByDistance,
  getRadarMetrics,
  DISTANCES,
} from '../lib/calculations';
import {
  getRasyonoTier,
  generatePlayerRasyonoConclusion,
} from '../lib/rasyonoStandards';
import RadarChartComp from './RadarChartComp';
import {
  Users,
  Search,
  Filter,
  Target,
  Sparkles,
  Award,
  TrendingUp,
  X,
  ChevronRight,
  ExternalLink,
  Trophy,
  GraduationCap,
  Brain,
  Dumbbell,
  FileText,
} from 'lucide-react';

interface AthleteAnalyticsProps {
  match: Match;
}

export default function AthleteAnalytics({ match }: AthleteAnalyticsProps) {
  // Filters
  const [selectedTeamFilter, setSelectedTeamFilter] = useState<string>('ALL');
  const [selectedDistanceFilter, setSelectedDistanceFilter] = useState<string>('ALL');
  const [selectedEndFilter, setSelectedEndFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected athlete for Detail Modal
  const [detailPlayer, setDetailPlayer] = useState<Player | null>(null);

  // All players from both teams
  const allPlayers = useMemo(() => {
    return [
      ...match.teamA.players.map((p) => ({ ...p, teamName: match.teamA.name, color: '#ED2939' })),
      ...match.teamB.players.map((p) => ({ ...p, teamName: match.teamB.name, color: '#0055A5' })),
    ];
  }, [match.teamA, match.teamB]);

  // Compute stats for each player given the current filters
  const athletesData = useMemo(() => {
    return allPlayers.map((player) => {
      let filteredActions = match.actions.filter((a) => a.playerId === player.id);

      if (selectedDistanceFilter !== 'ALL') {
        filteredActions = filteredActions.filter((a) => a.distance === selectedDistanceFilter);
      }

      if (selectedEndFilter !== 'ALL') {
        filteredActions = filteredActions.filter(
          (a) => a.endNumber === parseInt(selectedEndFilter, 10)
        );
      }

      const overall = calculatePerformance(filteredActions);
      const byDistance = calculateStatsByDistance(filteredActions);

      return {
        player,
        filteredActions,
        overall,
        byDistance,
      };
    });
  }, [allPlayers, match.actions, selectedDistanceFilter, selectedEndFilter]);

  // Filtered athlete rows
  const filteredAthletes = useMemo(() => {
    return athletesData.filter((item) => {
      if (selectedTeamFilter !== 'ALL' && item.player.teamId !== selectedTeamFilter) {
        return false;
      }
      if (
        searchQuery &&
        !item.player.name.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [athletesData, selectedTeamFilter, searchQuery]);

  // Detail Modal Player Stats
  const detailData = useMemo(() => {
    if (!detailPlayer) return null;
    const playerActions = match.actions.filter((a) => a.playerId === detailPlayer.id);
    const overall = calculatePerformance(playerActions);
    const byDistance = calculateStatsByDistance(playerActions);
    const radarData = getRadarMetrics(overall, detailPlayer.name).map((m) => ({
      metric: m.metric,
      fullName: m.fullName,
      athlete: m.value,
      display: m.display,
    }));

    const isTeamA = detailPlayer.teamId === match.teamA.id;
    const teamName = isTeamA ? match.teamA.name : match.teamB.name;
    const rasyonoConclusion = generatePlayerRasyonoConclusion(
      detailPlayer.id,
      detailPlayer.name,
      detailPlayer.teamId,
      teamName,
      detailPlayer.role,
      overall.pointingSuccess,
      overall.pointingTotal,
      overall.shootingSuccess,
      overall.shootingTotal,
      overall.carreauCount
    );

    return {
      playerActions,
      overall,
      byDistance,
      radarData,
      rasyonoConclusion,
    };
  }, [detailPlayer, match]);

  return (
    <div className="space-y-6">
      {/* Header & Filter Controls */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-4 bg-[#002395] rounded-xs" />
              <h2 className="text-xl font-black text-slate-900 font-['Outfit']">
                Athlete Performance Analytics
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Individual petanque athlete efficiency, pointing vs shooting accuracy, and carreau rate
            </p>
          </div>

          {/* Search box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search athlete by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-md pl-8 pr-3 py-1.5 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#002395] focus:border-[#002395]"
            />
          </div>
        </div>

        {/* Filter Badges Bar */}
        <div className="pt-3.5 border-t border-slate-100 flex flex-wrap items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5 font-bold text-slate-500 text-[11px] uppercase tracking-wider">
            <Filter className="w-3 h-3 text-slate-400" />
            Filters:
          </span>

          {/* Team Filter */}
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-md">
            <button
              onClick={() => setSelectedTeamFilter('ALL')}
              className={`px-2.5 py-1 rounded text-xs font-bold transition-colors ${
                selectedTeamFilter === 'ALL'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Teams
            </button>
            <button
              onClick={() => setSelectedTeamFilter(match.teamA.id)}
              className={`px-2.5 py-1 rounded text-xs font-bold transition-colors ${
                selectedTeamFilter === match.teamA.id
                  ? 'bg-[#002395] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {match.teamA.name}
            </button>
            <button
              onClick={() => setSelectedTeamFilter(match.teamB.id)}
              className={`px-2.5 py-1 rounded text-xs font-bold transition-colors ${
                selectedTeamFilter === match.teamB.id
                  ? 'bg-[#ED2939] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {match.teamB.name}
            </button>
          </div>

          {/* Distance Filter */}
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-md">
            <button
              onClick={() => setSelectedDistanceFilter('ALL')}
              className={`px-2 py-1 rounded text-xs font-bold transition-colors ${
                selectedDistanceFilter === 'ALL'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Dist.
            </button>
            {DISTANCES.map((d) => (
              <button
                key={d}
                onClick={() => setSelectedDistanceFilter(d)}
                className={`px-2 py-1 rounded text-xs font-bold transition-colors ${
                  selectedDistanceFilter === d
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          {/* End Filter */}
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-md">
            <button
              onClick={() => setSelectedEndFilter('ALL')}
              className={`px-2 py-1 rounded text-xs font-bold transition-colors ${
                selectedEndFilter === 'ALL'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Ends
            </button>
            {match.ends.map((end) => (
              <button
                key={end.id}
                onClick={() => setSelectedEndFilter(end.endNumber.toString())}
                className={`px-2 py-1 rounded text-xs font-bold transition-colors ${
                  selectedEndFilter === end.endNumber.toString()
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                E{end.endNumber}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Athlete Performance Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-2.5 px-4 font-bold">Athlete</th>
                <th className="py-2.5 px-3 font-bold">Team</th>
                <th className="py-2.5 px-3 font-bold">Role</th>
                <th className="py-2.5 px-3 text-center font-bold">Pointing Acc.</th>
                <th className="py-2.5 px-3 text-center font-bold">Shooting Acc.</th>
                <th className="py-2.5 px-3 text-center font-bold">Carreau Rate</th>
                <th className="py-2.5 px-3 text-center font-bold">Distance Target</th>
                <th className="py-2.5 px-3 text-center font-bold">Total Throws</th>
                <th className="py-2.5 px-3 text-center font-bold">Standar</th>
                <th className="py-2.5 px-4 text-center font-bold">Profile</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAthletes.map(({ player, overall }) => {
                const isTeamA = player.teamId === match.teamA.id;
                const overallPctVal =
                  overall.totalThrows > 0
                    ? Math.round(
                        ((overall.pointingSuccess + overall.shootingSuccess) /
                          overall.totalThrows) *
                          1000
                      ) / 10
                    : null;
                const tier = getRasyonoTier(overallPctVal);

                return (
                  <tr
                    key={player.id}
                    onClick={() => setDetailPlayer(player)}
                    className="hover:bg-slate-50/70 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-2.5">
                      <div
                        className={`w-7 h-7 rounded-md flex items-center justify-center font-bold text-xs text-white ${
                          isTeamA ? 'bg-[#002395]' : 'bg-[#ED2939]'
                        }`}
                      >
                        {player.name.charAt(0)}
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 text-xs block">
                          {player.name}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          #{player.number || '0'}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <span
                        className={`font-bold text-[10px] px-2 py-0.5 rounded border uppercase tracking-wider ${
                          isTeamA
                            ? 'bg-blue-50 text-[#002395] border-blue-200'
                            : 'bg-red-50 text-[#ED2939] border-red-200'
                        }`}
                      >
                        {isTeamA ? match.teamA.name : match.teamB.name}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-slate-600 font-medium">
                      {player.role || 'Athlete'}
                    </td>

                    <td className="py-3 px-3 text-center font-mono">
                      <span className="font-bold text-xs text-slate-900">
                        {overall.pointingAccuracy}
                      </span>
                      <span className="block text-[10px] text-slate-500 font-normal">
                        ({overall.pointingSuccess}/{overall.pointingTotal})
                      </span>
                    </td>

                    <td className="py-3 px-3 text-center font-mono">
                      <span className="font-bold text-xs text-slate-900">
                        {overall.shootingAccuracy}
                      </span>
                      <span className="block text-[10px] text-slate-500 font-normal">
                        ({overall.shootingSuccess}/{overall.shootingTotal})
                      </span>
                    </td>

                    <td className="py-3 px-3 text-center font-mono">
                      <span className="font-bold text-xs text-slate-900">
                        {overall.carreauRate}
                      </span>
                      <span className="block text-[10px] text-slate-500 font-normal">
                        ({overall.carreauCount} hit)
                      </span>
                    </td>

                    <td className="py-3 px-3 text-center font-mono font-bold text-slate-800">
                      {overall.distanceControlAvgCm}
                    </td>

                    <td className="py-3 px-3 text-center font-mono">
                      <span className="font-bold text-slate-900 text-xs">
                        {overall.totalThrows}
                      </span>
                      <span className="block text-[10px] text-green-700 font-bold">
                        {overall.overallAccuracy}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-center font-mono">
                      {overallPctVal !== null ? (
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded border ${tier.badgeBg} ${tier.badgeText} ${tier.badgeBorder}`}
                          title={`${tier.fullLabel} (${tier.range})`}
                        >
                          <span>{tier.icon}</span>
                          <span>{tier.medali}</span>
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs">-</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDetailPlayer(player);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-md text-xs transition-colors"
                      >
                        <span>Profile</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ATHLETE DETAIL MODAL */}
      {detailPlayer && detailData && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-lg shadow-xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-md flex items-center justify-center font-black text-base text-white ${
                    detailPlayer.teamId === match.teamA.id
                      ? 'bg-[#002395]'
                      : 'bg-[#ED2939]'
                  }`}
                >
                  {detailPlayer.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold font-['Outfit']">
                      {detailPlayer.name}
                    </h3>
                    <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono font-bold">
                      {detailPlayer.role || 'Athlete'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {detailPlayer.teamId === match.teamA.id
                      ? match.teamA.name
                      : match.teamB.name}{' '}
                    · Match Throws: {detailData.overall.totalThrows}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setDetailPlayer(null)}
                className="text-slate-400 hover:text-white p-1.5 rounded-md hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 overflow-y-auto space-y-4">
              {/* Radar Chart & Key Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center bg-slate-50 p-4 rounded-lg border border-slate-200">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                    Performance Radar
                  </h4>
                  <RadarChartComp
                    data={detailData.radarData}
                    series={[
                      {
                        key: 'athlete',
                        name: detailPlayer.name,
                        color:
                          detailPlayer.teamId === match.teamA.id
                            ? '#002395'
                            : '#ED2939',
                      },
                    ]}
                    height={210}
                  />
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-2 bg-white rounded-md border border-slate-200 flex justify-between items-center">
                    <span className="font-semibold text-slate-600">Pointing Accuracy:</span>
                    <span className="font-mono font-bold text-slate-900">
                      {detailData.overall.pointingAccuracy} ({detailData.overall.pointingSuccess}/{detailData.overall.pointingTotal})
                    </span>
                  </div>
                  <div className="p-2 bg-white rounded-md border border-slate-200 flex justify-between items-center">
                    <span className="font-semibold text-slate-600">Shooting Accuracy:</span>
                    <span className="font-mono font-bold text-slate-900">
                      {detailData.overall.shootingAccuracy} ({detailData.overall.shootingSuccess}/{detailData.overall.shootingTotal})
                    </span>
                  </div>
                  <div className="p-2 bg-white rounded-md border border-slate-200 flex justify-between items-center">
                    <span className="font-semibold text-slate-600">Carreau Rate:</span>
                    <span className="font-mono font-bold text-slate-900">
                      {detailData.overall.carreauRate} ({detailData.overall.carreauCount} hit)
                    </span>
                  </div>
                  <div className="p-2 bg-white rounded-md border border-slate-200 flex justify-between items-center">
                    <span className="font-semibold text-slate-600">Distance Target:</span>
                    <span className="font-mono font-bold text-slate-900">
                      {detailData.overall.distanceControlAvgCm}
                    </span>
                  </div>
                </div>
              </div>

              {/* Rasyono Academic Performance Benchmark & Coach Conclusion */}
              {detailData.rasyonoConclusion && (
                <div
                  className={`rounded-lg border p-4 text-xs ${detailData.rasyonoConclusion.tier.bgLight} ${detailData.rasyonoConclusion.tier.badgeBorderLight}`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-amber-600" />
                      <span className="font-bold text-slate-900 text-sm">
                        Evaluasi Performa & Prediksi Medali
                      </span>
                      <span className="text-[10px] text-slate-500 bg-white/80 px-2 py-0.5 rounded border border-slate-200">
                        Disertasi Rasyono (UNP)
                      </span>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1 text-xs font-black px-2.5 py-1 rounded border shadow-xs ${detailData.rasyonoConclusion.tier.badgeBg} ${detailData.rasyonoConclusion.tier.badgeText} ${detailData.rasyonoConclusion.tier.badgeBorder}`}
                    >
                      <span className="text-sm">{detailData.rasyonoConclusion.tier.icon}</span>
                      <span>{detailData.rasyonoConclusion.tier.fullLabel}</span>
                    </span>
                  </div>

                  {/* Summary & Key Observation */}
                  <div className="mt-3 bg-white/90 p-2.5 rounded border border-slate-200/80">
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="font-bold text-slate-800">
                        {detailData.rasyonoConclusion.tier.summaryText}
                      </span>
                      <span className="font-semibold text-slate-500">
                        Peran Dominan: {detailData.rasyonoConclusion.dominantRole}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      {detailData.rasyonoConclusion.keyObservation}
                    </p>
                  </div>

                  {/* Tactical & Physical/Mental Recommendations */}
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-white/90 p-2.5 rounded border border-slate-200/80">
                      <div className="font-bold text-[11px] text-indigo-950 flex items-center gap-1 mb-1">
                        <Brain className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Analisis Taktikal & Eksekusi:</span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        {detailData.rasyonoConclusion.tacticalAdvice}
                      </p>
                    </div>

                    <div className="bg-white/90 p-2.5 rounded border border-slate-200/80">
                      <div className="font-bold text-[11px] text-emerald-950 flex items-center gap-1 mb-1">
                        <Dumbbell className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Kesiapan Mental & Fisik (Laktat):</span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        {detailData.rasyonoConclusion.mentalPhysicalAdvice}
                      </p>
                    </div>
                  </div>

                  <div className="mt-2 text-[10px] text-slate-500 italic bg-slate-100/60 p-2 rounded">
                    Rekomendasi Utama: {detailData.rasyonoConclusion.tier.recommendation}
                  </div>
                </div>
              )}

              {/* Breakdown by Distance for this Athlete */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Performance by Target Distance
                </h4>
                <div className="grid grid-cols-4 gap-2">
                  {DISTANCES.map((d) => {
                    const st = detailData.byDistance[d];
                    return (
                      <div
                        key={d}
                        className="p-2.5 bg-white rounded-md border border-slate-200 text-center shadow-xs"
                      >
                        <span className="text-xs font-bold text-slate-900 font-mono block">
                          {d}
                        </span>
                        <div className="mt-1.5 space-y-1 text-[11px]">
                          <div>
                            <span className="text-slate-500 block">Pointing:</span>
                            <span className="font-bold text-slate-800 font-mono">
                              {st.pointingAccuracy}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-500 block">Shooting:</span>
                            <span className="font-bold text-slate-800 font-mono">
                              {st.shootingAccuracy}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Complete Throw Log for Athlete */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Complete Match Throws ({detailData.playerActions.length})
                </h4>
                <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1">
                  {detailData.playerActions.map((act) => (
                    <div
                      key={act.id}
                      className="p-2 rounded-md bg-slate-50 border border-slate-200 text-xs flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-slate-600 font-semibold text-[11px]">
                          End {act.endNumber} ({act.distance})
                        </span>
                        <span className="font-bold text-slate-800 text-[11px]">{act.actionType}</span>
                        {act.carreau && (
                          <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-1 rounded">
                            CARREAU
                          </span>
                        )}
                        {act.distanceToJackCm && (
                          <span className="text-[10px] text-slate-500 font-mono">
                            {act.distanceToJackCm}cm to jack
                          </span>
                        )}
                      </div>
                      <span
                        className={`font-mono font-bold text-[10px] px-1.5 py-0.5 rounded ${
                          act.result === 'SUCCESS'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {act.result}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
              <button
                onClick={() => {
                  setDetailPlayer(null);
                  window.location.hash = 'athlete-pdf-report';
                }}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-md transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Cetak Laporan PDF Atlet</span>
              </button>
              <button
                onClick={() => setDetailPlayer(null)}
                className="px-4 py-1.5 bg-[#002395] hover:bg-[#001b70] text-white font-bold text-xs rounded-md transition-colors"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
