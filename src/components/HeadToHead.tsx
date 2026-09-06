import { useState, useMemo } from 'react';
import { Match, Player } from '../types';
import {
  calculatePerformance,
  calculateStatsByDistance,
  getRadarMetrics,
  DISTANCES,
} from '../lib/calculations';
import RadarChartComp from './RadarChartComp';
import {
  Swords,
  Target,
  Sparkles,
  Award,
  TrendingUp,
  Flame,
  ArrowRight,
} from 'lucide-react';

interface HeadToHeadProps {
  match: Match;
}

export default function HeadToHead({ match }: HeadToHeadProps) {
  // Collect all players with team information
  const allPlayers = useMemo(() => {
    return [
      ...match.teamA.players.map((p) => ({
        ...p,
        teamName: match.teamA.name,
        color: '#ED2939',
      })),
      ...match.teamB.players.map((p) => ({
        ...p,
        teamName: match.teamB.name,
        color: '#0055A5',
      })),
    ];
  }, [match.teamA, match.teamB]);

  // Default Player 1: Heri (Team A), Player 2: Thanakorn or Ratchata (Team B)
  const [player1Id, setPlayer1Id] = useState<string>(
    allPlayers[0]?.id || ''
  );
  const [player2Id, setPlayer2Id] = useState<string>(
    allPlayers.find((p) => p.teamId !== allPlayers[0]?.teamId)?.id || allPlayers[1]?.id || ''
  );

  const player1 = useMemo(
    () => allPlayers.find((p) => p.id === player1Id) || allPlayers[0],
    [allPlayers, player1Id]
  );
  const player2 = useMemo(
    () => allPlayers.find((p) => p.id === player2Id) || allPlayers[1],
    [allPlayers, player2Id]
  );

  // Actions for Player 1 & Player 2
  const p1Actions = useMemo(
    () => (player1 ? match.actions.filter((a) => a.playerId === player1.id) : []),
    [match.actions, player1]
  );
  const p2Actions = useMemo(
    () => (player2 ? match.actions.filter((a) => a.playerId === player2.id) : []),
    [match.actions, player2]
  );

  const stats1 = useMemo(() => calculatePerformance(p1Actions), [p1Actions]);
  const stats2 = useMemo(() => calculatePerformance(p2Actions), [p2Actions]);

  const distStats1 = useMemo(() => calculateStatsByDistance(p1Actions), [p1Actions]);
  const distStats2 = useMemo(() => calculateStatsByDistance(p2Actions), [p2Actions]);

  // Radar Data
  const radarData = useMemo(() => {
    if (!player1 || !player2) return [];
    const m1 = getRadarMetrics(stats1, player1.name);
    const m2 = getRadarMetrics(stats2, player2.name);

    return m1.map((item, i) => ({
      metric: item.metric,
      fullName: item.fullName,
      athlete1: item.value,
      athlete2: m2[i]?.value ?? 0,
      display1: item.display,
      display2: m2[i]?.display ?? 'N/A',
    }));
  }, [stats1, stats2, player1, player2]);

  const radarSeries = useMemo(() => {
    return [
      {
        key: 'athlete1',
        name: player1 ? `${player1.name} (${player1.teamName})` : 'Athlete A',
        color: '#002395',
      },
      {
        key: 'athlete2',
        name: player2 ? `${player2.name} (${player2.teamName})` : 'Athlete B',
        color: '#ED2939',
      },
    ];
  }, [player1, player2]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-4 bg-[#002395] rounded-xs" />
          <h2 className="text-xl font-black text-slate-900 font-['Outfit']">
            Athlete Head-to-Head Comparison
          </h2>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Select any two petanque athletes to compare their throwing metrics, accuracy, and tactical consistency
        </p>

        {/* Dual Athlete Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-5 items-center gap-4 mt-4 pt-3.5 border-t border-slate-100">
          {/* Athlete 1 Selector */}
          <div className="md:col-span-2">
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
              Athlete 1 (Left)
            </label>
            <select
              value={player1Id}
              onChange={(e) => setPlayer1Id(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#002395] focus:border-[#002395]"
            >
              {allPlayers.map((p) => (
                <option key={`p1-${p.id}`} value={p.id}>
                  {p.name} — {p.teamName} ({p.role || 'Athlete'})
                </option>
              ))}
            </select>
          </div>

          {/* Center VS Indicator */}
          <div className="md:col-span-1 flex flex-col items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              VS
            </div>
          </div>

          {/* Athlete 2 Selector */}
          <div className="md:col-span-2">
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
              Athlete 2 (Right)
            </label>
            <select
              value={player2Id}
              onChange={(e) => setPlayer2Id(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#ED2939] focus:border-[#ED2939]"
            >
              {allPlayers.map((p) => (
                <option key={`p2-${p.id}`} value={p.id}>
                  {p.name} — {p.teamName} ({p.role || 'Athlete'})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Head-to-Head Athlete Showcase Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Player 1 Card */}
        {player1 && (
          <div className="bg-white rounded-lg border border-slate-200 border-l-4 border-l-[#002395] p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-md bg-[#002395] text-white flex items-center justify-center font-bold text-base shadow-xs">
                {player1.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-['Outfit']">
                  {player1.name}
                </h3>
                <p className="text-[11px] font-bold text-[#002395] uppercase tracking-wider">
                  {player1.teamName} · {player1.role || 'Athlete'}
                </p>
              </div>
            </div>
            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Match Throws:</span>
              <span className="font-mono font-bold text-slate-900">
                {stats1.totalThrows} ({stats1.totalSuccess} success)
              </span>
            </div>
          </div>
        )}

        {/* Player 2 Card */}
        {player2 && (
          <div className="bg-white rounded-lg border border-slate-200 border-l-4 border-l-[#ED2939] p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-md bg-[#ED2939] text-white flex items-center justify-center font-bold text-base shadow-xs">
                {player2.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-['Outfit']">
                  {player2.name}
                </h3>
                <p className="text-[11px] font-bold text-[#ED2939] uppercase tracking-wider">
                  {player2.teamName} · {player2.role || 'Athlete'}
                </p>
              </div>
            </div>
            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Match Throws:</span>
              <span className="font-mono font-bold text-slate-900">
                {stats2.totalThrows} ({stats2.totalSuccess} success)
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Comparison Grid & Dual Radar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Comparison Metrics Table */}
        <div className="lg:col-span-3 bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1.5 h-4 bg-[#002395] rounded-xs" />
            <h3 className="font-bold text-base text-slate-900 font-['Outfit']">
              Core Metric Head-to-Head
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            {/* 1. POINTING ACCURACY */}
            <div className="p-3 rounded-md border border-slate-200 bg-slate-50">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
                  <Target className="w-3.5 h-3.5 text-[#002395]" />
                  Pointing Accuracy
                </span>
                <span className="text-[11px] text-slate-500">Mendekatkan boule ke target</span>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200/60 text-center">
                <div className="bg-white p-2 rounded-md border border-slate-200">
                  <span className="text-base font-bold text-slate-900 font-mono block">
                    {stats1.pointingAccuracy}
                  </span>
                  <span className="text-[10px] text-slate-500 font-normal">
                    {stats1.pointingSuccess}/{stats1.pointingTotal} throws
                  </span>
                </div>
                <div className="bg-white p-2 rounded-md border border-slate-200">
                  <span className="text-base font-bold text-slate-900 font-mono block">
                    {stats2.pointingAccuracy}
                  </span>
                  <span className="text-[10px] text-slate-500 font-normal">
                    {stats2.pointingSuccess}/{stats2.pointingTotal} throws
                  </span>
                </div>
              </div>
            </div>

            {/* 2. SHOOTING ACCURACY */}
            <div className="p-3 rounded-md border border-slate-200 bg-slate-50">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Shooting Accuracy
                </span>
                <span className="text-[11px] text-slate-500">Mengenai/mengeluarkan boule lawan</span>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200/60 text-center">
                <div className="bg-white p-2 rounded-md border border-slate-200">
                  <span className="text-base font-bold text-slate-900 font-mono block">
                    {stats1.shootingAccuracy}
                  </span>
                  <span className="text-[10px] text-slate-500 font-normal">
                    {stats1.shootingSuccess}/{stats1.shootingTotal} hits
                  </span>
                </div>
                <div className="bg-white p-2 rounded-md border border-slate-200">
                  <span className="text-base font-bold text-slate-900 font-mono block">
                    {stats2.shootingAccuracy}
                  </span>
                  <span className="text-[10px] text-slate-500 font-normal">
                    {stats2.shootingSuccess}/{stats2.shootingTotal} hits
                  </span>
                </div>
              </div>
            </div>

            {/* 3. CARREAU RATE */}
            <div className="p-3 rounded-md border border-slate-200 bg-slate-50">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
                  <Award className="w-3.5 h-3.5 text-amber-600" />
                  Carreau Rate
                </span>
                <span className="text-[11px] text-slate-500">Kualitas shooting target replacement</span>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200/60 text-center">
                <div className="bg-white p-2 rounded-md border border-slate-200">
                  <span className="text-base font-bold text-slate-900 font-mono block">
                    {stats1.carreauRate}
                  </span>
                  <span className="text-[10px] text-slate-500 font-normal">
                    {stats1.carreauCount} carreau
                  </span>
                </div>
                <div className="bg-white p-2 rounded-md border border-slate-200">
                  <span className="text-base font-bold text-slate-900 font-mono block">
                    {stats2.carreauRate}
                  </span>
                  <span className="text-[10px] text-slate-500 font-normal">
                    {stats2.carreauCount} carreau
                  </span>
                </div>
              </div>
            </div>

            {/* 4. DISTANCE CONTROL */}
            <div className="p-3 rounded-md border border-slate-200 bg-slate-50">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
                  <TrendingUp className="w-3.5 h-3.5 text-[#002395]" />
                  Distance Control (Avg to Jack)
                </span>
                <span className="text-[11px] text-slate-500">Rata-rata jarak boule ke jack</span>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200/60 text-center">
                <div className="bg-white p-2 rounded-md border border-slate-200">
                  <span className="text-base font-bold text-slate-900 font-mono block">
                    {stats1.distanceControlAvgCm}
                  </span>
                  <span className="text-[10px] text-slate-500 font-normal">
                    {stats1.distanceControlThrowsCount} measured
                  </span>
                </div>
                <div className="bg-white p-2 rounded-md border border-slate-200">
                  <span className="text-base font-bold text-slate-900 font-mono block">
                    {stats2.distanceControlAvgCm}
                  </span>
                  <span className="text-[10px] text-slate-500 font-normal">
                    {stats2.distanceControlThrowsCount} measured
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dual Radar Chart Visualizer */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1.5 h-4 bg-[#002395] rounded-xs" />
              <h3 className="font-bold text-base text-slate-900 font-['Outfit']">
                Comparative Skill Profile
              </h3>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              Normalized athlete skill polygon overlay (0 - 100)
            </p>

            <RadarChartComp data={radarData} series={radarSeries} height={280} />
          </div>

          <div className="pt-3 border-t border-slate-100 grid grid-cols-2 text-center text-xs">
            <div className="font-bold text-[#002395] truncate">
              {player1?.name} ({stats1.overallAccuracy})
            </div>
            <div className="font-bold text-[#ED2939] truncate">
              {player2?.name} ({stats2.overallAccuracy})
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
