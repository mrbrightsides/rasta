import { useMemo } from 'react';
import { Match, DistanceMeters } from '../types';
import {
  calculatePerformance,
  calculateStatsByDistance,
  getRadarMetrics,
  DISTANCES,
} from '../lib/calculations';
import RadarChartComp from './RadarChartComp';
import {
  Activity,
  Award,
  Target,
  Sparkles,
  TrendingUp,
  BarChart3,
  CheckCircle2,
} from 'lucide-react';

interface TeamFullTimeProps {
  match: Match;
}

export default function TeamFullTime({ match }: TeamFullTimeProps) {
  const teamAActions = useMemo(
    () => match.actions.filter((a) => a.teamId === match.teamA.id),
    [match.actions, match.teamA.id]
  );
  const teamBActions = useMemo(
    () => match.actions.filter((a) => a.teamId === match.teamB.id),
    [match.actions, match.teamB.id]
  );

  const statsA = useMemo(() => calculatePerformance(teamAActions), [teamAActions]);
  const statsB = useMemo(() => calculatePerformance(teamBActions), [teamBActions]);

  const distStatsA = useMemo(() => calculateStatsByDistance(teamAActions), [teamAActions]);
  const distStatsB = useMemo(() => calculateStatsByDistance(teamBActions), [teamBActions]);

  // Radar chart comparison
  const radarData = useMemo(() => {
    const metricsA = getRadarMetrics(statsA, match.teamA.name);
    const metricsB = getRadarMetrics(statsB, match.teamB.name);

    return metricsA.map((mA, i) => ({
      metric: mA.metric,
      fullName: mA.fullName,
      teamA: mA.value,
      teamB: metricsB[i]?.value ?? 0,
      displayA: mA.display,
      displayB: metricsB[i]?.display ?? 'N/A',
    }));
  }, [statsA, statsB, match.teamA.name, match.teamB.name]);

  const radarSeries = useMemo(
    () => [
      { key: 'teamA', name: match.teamA.name, color: '#ED2939' },
      { key: 'teamB', name: match.teamB.name, color: '#0055A5' },
    ],
    [match.teamA.name, match.teamB.name]
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-4 bg-[#002395] rounded-xs" />
            <h2 className="text-xl font-black text-slate-900 font-['Outfit']">
              Team Full-Time Statistics
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Comparative performance matrix across all recorded ends and throwing distances
          </p>
        </div>

        {/* Final / Live Match Score Display */}
        <div className="flex items-center gap-3 bg-slate-900 text-white px-4 py-2 rounded-md shadow-xs border border-slate-800">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              {match.teamA.name}
            </span>
            <span className="text-2xl font-black text-[#002395] font-mono">
              {match.scoreA.toString().padStart(2, '0')}
            </span>
          </div>
          <span className="text-base font-mono text-slate-600">:</span>
          <div className="text-left">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              {match.teamB.name}
            </span>
            <span className="text-2xl font-black text-[#ED2939] font-mono">
              {match.scoreB.toString().padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>

      {/* Main Full-Time Comparative Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-4 bg-[#002395] rounded-xs" />
            <h3 className="font-bold text-sm text-slate-900">
              Official Team Full-Time Performance Breakdown
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            RASTA Methodology Standard
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/90 border-b border-slate-200 text-slate-600">
                <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px]">Performance Indicator</th>
                <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px]">Team</th>
                <th className="py-3 px-3 text-center font-bold uppercase tracking-wider text-[11px]">6 Meters</th>
                <th className="py-3 px-3 text-center font-bold uppercase tracking-wider text-[11px]">7 Meters</th>
                <th className="py-3 px-3 text-center font-bold uppercase tracking-wider text-[11px]">8 Meters</th>
                <th className="py-3 px-3 text-center font-bold uppercase tracking-wider text-[11px]">9 Meters</th>
                <th className="py-3 px-4 text-center font-bold uppercase tracking-wider text-[11px] bg-slate-100 text-slate-900">
                  Total Full-Time
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {/* 1. POINTING ACCURACY */}
              <tr>
                <td rowSpan={2} className="py-3.5 px-4 font-bold text-slate-900 border-r border-slate-100 align-top bg-slate-50/30">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                    <Target className="w-3.5 h-3.5 text-[#002395]" />
                    <span>Pointing Accuracy</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-normal block mt-0.5">
                    Boule proximity to jack (Success / Throws)
                  </span>
                </td>
                <td className="py-3 px-4 font-bold text-[#002395] uppercase">
                  {match.teamA.name}
                </td>
                {DISTANCES.map((d) => (
                  <td key={d} className="py-3 px-3 text-center font-mono">
                    <div className="font-bold text-slate-800">{distStatsA[d].pointingAccuracy}</div>
                    <div className="text-[10px] text-slate-500 font-normal">
                      {distStatsA[d].pointingSuccess}/{distStatsA[d].pointingTotal}
                    </div>
                  </td>
                ))}
                <td className="py-3 px-4 text-center font-mono bg-slate-50 font-bold">
                  <div className="font-black text-xs text-slate-900">{distStatsA.TOTAL.pointingAccuracy}</div>
                  <div className="text-[10px] text-slate-500 font-normal">
                    {distStatsA.TOTAL.pointingSuccess}/{distStatsA.TOTAL.pointingTotal}
                  </div>
                </td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="py-3 px-4 font-bold text-[#ED2939] uppercase">
                  {match.teamB.name}
                </td>
                {DISTANCES.map((d) => (
                  <td key={d} className="py-3 px-3 text-center font-mono">
                    <div className="font-bold text-slate-800">{distStatsB[d].pointingAccuracy}</div>
                    <div className="text-[10px] text-slate-500 font-normal">
                      {distStatsB[d].pointingSuccess}/{distStatsB[d].pointingTotal}
                    </div>
                  </td>
                ))}
                <td className="py-3 px-4 text-center font-mono bg-slate-50 font-bold">
                  <div className="font-black text-xs text-slate-900">{distStatsB.TOTAL.pointingAccuracy}</div>
                  <div className="text-[10px] text-slate-500 font-normal">
                    {distStatsB.TOTAL.pointingSuccess}/{distStatsB.TOTAL.pointingTotal}
                  </div>
                </td>
              </tr>

              {/* 2. SHOOTING ACCURACY */}
              <tr>
                <td rowSpan={2} className="py-3.5 px-4 font-bold text-slate-900 border-r border-slate-100 align-top bg-slate-50/30">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Shooting Accuracy</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-normal block mt-0.5">
                    Target boule displacement rate
                  </span>
                </td>
                <td className="py-3 px-4 font-bold text-[#002395] uppercase">
                  {match.teamA.name}
                </td>
                {DISTANCES.map((d) => (
                  <td key={d} className="py-3 px-3 text-center font-mono">
                    <div className="font-bold text-slate-800">{distStatsA[d].shootingAccuracy}</div>
                    <div className="text-[10px] text-slate-500 font-normal">
                      {distStatsA[d].shootingSuccess}/{distStatsA[d].shootingTotal}
                    </div>
                  </td>
                ))}
                <td className="py-3 px-4 text-center font-mono bg-slate-50 font-bold">
                  <div className="font-black text-xs text-slate-900">{distStatsA.TOTAL.shootingAccuracy}</div>
                  <div className="text-[10px] text-slate-500 font-normal">
                    {distStatsA.TOTAL.shootingSuccess}/{distStatsA.TOTAL.shootingTotal}
                  </div>
                </td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="py-3 px-4 font-bold text-[#ED2939] uppercase">
                  {match.teamB.name}
                </td>
                {DISTANCES.map((d) => (
                  <td key={d} className="py-3 px-3 text-center font-mono">
                    <div className="font-bold text-slate-800">{distStatsB[d].shootingAccuracy}</div>
                    <div className="text-[10px] text-slate-500 font-normal">
                      {distStatsB[d].shootingSuccess}/{distStatsB[d].shootingTotal}
                    </div>
                  </td>
                ))}
                <td className="py-3 px-4 text-center font-mono bg-slate-50 font-bold">
                  <div className="font-black text-xs text-slate-900">{distStatsB.TOTAL.shootingAccuracy}</div>
                  <div className="text-[10px] text-slate-500 font-normal">
                    {distStatsB.TOTAL.shootingSuccess}/{distStatsB.TOTAL.shootingTotal}
                  </div>
                </td>
              </tr>

              {/* 3. CARREAU RATE */}
              <tr>
                <td rowSpan={2} className="py-3.5 px-4 font-bold text-slate-900 border-r border-slate-100 align-top bg-slate-50/30">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                    <Award className="w-3.5 h-3.5 text-amber-600" />
                    <span>Carreau Rate</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-normal block mt-0.5">
                    Direct target replacement efficiency
                  </span>
                </td>
                <td className="py-3 px-4 font-bold text-[#002395] uppercase">
                  {match.teamA.name}
                </td>
                {DISTANCES.map((d) => (
                  <td key={d} className="py-3 px-3 text-center font-mono">
                    <div className="font-bold text-slate-800">{distStatsA[d].carreauRate}</div>
                    <div className="text-[10px] text-slate-500 font-normal">
                      {distStatsA[d].carreauCount} carreau
                    </div>
                  </td>
                ))}
                <td className="py-3 px-4 text-center font-mono bg-slate-50 font-bold">
                  <div className="font-black text-xs text-slate-900">{distStatsA.TOTAL.carreauRate}</div>
                  <div className="text-[10px] text-slate-500 font-normal">
                    {distStatsA.TOTAL.carreauCount} carreau
                  </div>
                </td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="py-3 px-4 font-bold text-[#ED2939] uppercase">
                  {match.teamB.name}
                </td>
                {DISTANCES.map((d) => (
                  <td key={d} className="py-3 px-3 text-center font-mono">
                    <div className="font-bold text-slate-800">{distStatsB[d].carreauRate}</div>
                    <div className="text-[10px] text-slate-500 font-normal">
                      {distStatsB[d].carreauCount} carreau
                    </div>
                  </td>
                ))}
                <td className="py-3 px-4 text-center font-mono bg-slate-50 font-bold">
                  <div className="font-black text-xs text-slate-900">{distStatsB.TOTAL.carreauRate}</div>
                  <div className="text-[10px] text-slate-500 font-normal">
                    {distStatsB.TOTAL.carreauCount} carreau
                  </div>
                </td>
              </tr>

              {/* 4. DISTANCE CONTROL */}
              <tr>
                <td rowSpan={2} className="py-3.5 px-4 font-bold text-slate-900 border-r border-slate-100 align-top bg-slate-50/30">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                    <TrendingUp className="w-3.5 h-3.5 text-[#002395]" />
                    <span>Distance Control</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-normal block mt-0.5">
                    Average proximity to jack (cm)
                  </span>
                </td>
                <td className="py-3 px-4 font-bold text-[#002395] uppercase">
                  {match.teamA.name}
                </td>
                {DISTANCES.map((d) => (
                  <td key={d} className="py-3 px-3 text-center font-mono">
                    <div className="font-bold text-slate-800">{distStatsA[d].distanceControlAvgCm}</div>
                    <div className="text-[10px] text-slate-500 font-normal">
                      {distStatsA[d].distanceControlThrowsCount} throws
                    </div>
                  </td>
                ))}
                <td className="py-3 px-4 text-center font-mono bg-slate-50 font-bold">
                  <div className="font-black text-xs text-slate-900">{distStatsA.TOTAL.distanceControlAvgCm}</div>
                  <div className="text-[10px] text-slate-500 font-normal">
                    {distStatsA.TOTAL.distanceControlThrowsCount} throws
                  </div>
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-[#ED2939] uppercase">
                  {match.teamB.name}
                </td>
                {DISTANCES.map((d) => (
                  <td key={d} className="py-3 px-3 text-center font-mono">
                    <div className="font-bold text-slate-800">{distStatsB[d].distanceControlAvgCm}</div>
                    <div className="text-[10px] text-slate-500 font-normal">
                      {distStatsB[d].distanceControlThrowsCount} throws
                    </div>
                  </td>
                ))}
                <td className="py-3 px-4 text-center font-mono bg-slate-50 font-bold">
                  <div className="font-black text-xs text-slate-900">{distStatsB.TOTAL.distanceControlAvgCm}</div>
                  <div className="text-[10px] text-slate-500 font-normal">
                    {distStatsB.TOTAL.distanceControlThrowsCount} throws
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Radar Chart & Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-4 bg-[#002395] rounded-xs" />
              <h3 className="font-bold text-sm text-slate-900">
                Team Head-to-Head Radar Comparison
              </h3>
            </div>
            <span className="text-xs text-slate-500 font-mono">
              Full Multi-Vector Metrics
            </span>
          </div>

          <RadarChartComp data={radarData} series={radarSeries} height={320} />
        </div>

        {/* Coach Analysis Takeaways */}
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1.5 h-4 bg-[#002395] rounded-xs" />
              <h3 className="font-bold text-sm text-slate-900">
                Coach Tactical Takeaways
              </h3>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-md bg-slate-50 border border-slate-200/80">
                <p className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                  Pointing Supremacy
                </p>
                <p className="text-slate-600 leading-relaxed">
                  {statsA.pointingAccuracyValue && statsB.pointingAccuracyValue
                    ? statsA.pointingAccuracyValue >= statsB.pointingAccuracyValue
                      ? `${match.teamA.name} leads pointing accuracy (${statsA.pointingAccuracy} vs ${statsB.pointingAccuracy}) with consistent boule placement.`
                      : `${match.teamB.name} leads pointing accuracy (${statsB.pointingAccuracy} vs ${statsA.pointingAccuracy}) with tight distance control.`
                    : 'Awaiting further pointing throws for definitive analysis.'}
                </p>
              </div>

              <div className="p-3 rounded-md bg-slate-50 border border-slate-200/80">
                <p className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                  Carreau Impact
                </p>
                <p className="text-slate-600 leading-relaxed">
                  {statsA.carreauCount > statsB.carreauCount
                    ? `${match.teamA.name} converted ${statsA.carreauCount} direct carreau shots, turning offensive ends into scoring clusters.`
                    : `${match.teamB.name} converted ${statsB.carreauCount} direct carreau shots, maximizing point accumulation.`}
                </p>
              </div>

              <div className="p-3 rounded-md bg-slate-50 border border-slate-200/80">
                <p className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#002395]" />
                  Long-Distance (8m - 9m) Resilience
                </p>
                <p className="text-slate-600 leading-relaxed">
                  Notice the accuracy variance between 6m and 9m. Elite teams maintain over 65% pointing at 8m and 9m.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
            <span>Total Match Throws:</span>
            <span className="font-bold text-slate-900">{match.actions.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
