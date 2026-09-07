import { useState, useMemo } from 'react';
import { Match, EndRound } from '../types';
import { calculatePerformance } from '../lib/calculations';
import {
  Layers,
  ChevronLeft,
  ChevronRight,
  Target,
  Sparkles,
  Award,
  Trophy,
} from 'lucide-react';

interface StatisticPerEndProps {
  match: Match;
}

export default function StatisticPerEnd({ match }: StatisticPerEndProps) {
  // Default to the latest active or completed End
  const [selectedEndNumber, setSelectedEndNumber] = useState<number>(
    match.currentEndNumber || 1
  );

  const selectedEnd = useMemo(() => {
    return (
      match.ends.find((e) => e.endNumber === selectedEndNumber) ||
      match.ends[match.ends.length - 1] || {
        id: 'default_end',
        matchId: match.id,
        endNumber: 1,
        distance: '8m',
        scoreA: 0,
        scoreB: 0,
        isCompleted: false,
      }
    );
  }, [match.ends, selectedEndNumber]);

  // Actions specifically logged within this End
  const endActions = useMemo(() => {
    return match.actions.filter((a) => a.endNumber === selectedEnd.endNumber);
  }, [match.actions, selectedEnd.endNumber]);

  const teamAActions = useMemo(() => {
    return endActions.filter((a) => a.teamId === match.teamA.id);
  }, [endActions, match.teamA.id]);

  const teamBActions = useMemo(() => {
    return endActions.filter((a) => a.teamId === match.teamB.id);
  }, [endActions, match.teamB.id]);

  const statsA = useMemo(() => calculatePerformance(teamAActions), [teamAActions]);
  const statsB = useMemo(() => calculatePerformance(teamBActions), [teamBActions]);

  // Navigation between ends
  const canGoPrev = selectedEndNumber > 1;
  const canGoNext = selectedEndNumber < match.ends.length;

  return (
    <div className="space-y-6">
      {/* Header & End Selector Carousel */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-4 bg-[#002395] rounded-xs" />
              <h2 className="text-xl font-black text-slate-900 font-['Outfit']">
                Team Statistics Per End
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Discrete analysis of tactical execution, jack distance, and score conversion per round
            </p>
          </div>

          {/* Stepper controls */}
          <div className="flex items-center gap-2">
            <button
              id="end-prev-btn"
              disabled={!canGoPrev}
              onClick={() => setSelectedEndNumber((prev) => Math.max(1, prev - 1))}
              className="p-1.5 rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="Previous End"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="font-mono text-xs font-bold text-slate-800 px-3 py-1 bg-slate-100 rounded-md">
              End {selectedEnd.endNumber} of {match.ends.length}
            </span>

            <button
              id="end-next-btn"
              disabled={!canGoNext}
              onClick={() =>
                setSelectedEndNumber((prev) => Math.min(match.ends.length, prev + 1))
              }
              className="p-1.5 rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="Next End"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Horizontal End Picker Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pt-2 border-t border-slate-100">
          {match.ends.map((end) => {
            const isSelected = end.endNumber === selectedEndNumber;
            return (
              <button
                key={end.id}
                onClick={() => setSelectedEndNumber(end.endNumber)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all whitespace-nowrap border ${
                  isSelected
                    ? 'bg-[#002395] text-white border-[#002395] shadow-xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span>End {end.endNumber}</span>
                <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-white/20">
                  {end.distance}
                </span>
                <span className={`font-mono font-black ${isSelected ? 'text-amber-300' : 'text-slate-800'}`}>
                  {end.scoreA}:{end.scoreB}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Primary End Performance Comparison Card */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        {/* End Header Banner */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="bg-[#002395] text-white font-bold text-xs px-2 py-0.5 rounded uppercase tracking-wider">
                END {selectedEnd.endNumber}
              </span>
              <h3 className="text-lg font-bold font-['Outfit']">
                Target Distance: {selectedEnd.distance}
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Total {endActions.length} throws logged during this end
            </p>
          </div>

          {/* End Score conversion result */}
          <div className="flex items-center gap-3 bg-slate-800 border border-slate-700 px-3.5 py-1.5 rounded-md">
            <div className="text-right">
              <span className="text-[10px] font-bold uppercase text-slate-400 block truncate max-w-[120px]">
                {match.teamA.name}
              </span>
              <span className="text-xl font-black text-[#002395] font-mono">
                {selectedEnd.scoreA}
              </span>
            </div>
            <span className="text-base font-mono text-slate-600">:</span>
            <div className="text-left">
              <span className="text-[10px] font-bold uppercase text-slate-400 block truncate max-w-[120px]">
                {match.teamB.name}
              </span>
              <span className="text-xl font-black text-[#ED2939] font-mono">
                {selectedEnd.scoreB}
              </span>
            </div>
          </div>
        </div>

        {/* Comparative Grid Layout */}
        <div className="p-5 sm:p-6">
          <div className="max-w-2xl mx-auto border border-slate-200 rounded-lg overflow-hidden shadow-xs">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold text-xs">
                  <th className="py-2.5 px-4 uppercase tracking-wider text-[11px]">Indicator</th>
                  <th className="py-2.5 px-4 text-center text-[#002395] uppercase tracking-wider text-[11px]">
                    {match.teamA.name}
                  </th>
                  <th className="py-2.5 px-4 text-center text-[#ED2939] uppercase tracking-wider text-[11px]">
                    {match.teamB.name}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {/* Distance Row */}
                <tr className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-4 font-bold text-slate-700 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#002395]" />
                    Target Distance
                  </td>
                  <td className="py-2.5 px-4 text-center font-mono font-bold text-slate-800">
                    {selectedEnd.distance}
                  </td>
                  <td className="py-2.5 px-4 text-center font-mono font-bold text-slate-800">
                    {selectedEnd.distance}
                  </td>
                </tr>

                {/* Pointing Accuracy */}
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3 px-4 font-bold text-slate-800 flex items-center gap-2">
                    <Target className="w-3.5 h-3.5 text-[#002395]" />
                    Pointing Accuracy
                  </td>
                  <td className="py-3 px-4 text-center font-mono font-bold text-slate-900">
                    <span className="text-sm font-black">{statsA.pointingAccuracy}</span>
                    <span className="block text-[10px] text-slate-500 font-normal">
                      ({statsA.pointingSuccess}/{statsA.pointingTotal})
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center font-mono font-bold text-slate-900">
                    <span className="text-sm font-black">{statsB.pointingAccuracy}</span>
                    <span className="block text-[10px] text-slate-500 font-normal">
                      ({statsB.pointingSuccess}/{statsB.pointingTotal})
                    </span>
                  </td>
                </tr>

                {/* Shooting Accuracy */}
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3 px-4 font-bold text-slate-800 flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    Shooting Accuracy
                  </td>
                  <td className="py-3 px-4 text-center font-mono font-bold text-slate-900">
                    <span className="text-sm font-black">{statsA.shootingAccuracy}</span>
                    <span className="block text-[10px] text-slate-500 font-normal">
                      ({statsA.shootingSuccess}/{statsA.shootingTotal})
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center font-mono font-bold text-slate-900">
                    <span className="text-sm font-black">{statsB.shootingAccuracy}</span>
                    <span className="block text-[10px] text-slate-500 font-normal">
                      ({statsB.shootingSuccess}/{statsB.shootingTotal})
                    </span>
                  </td>
                </tr>

                {/* Carreau Rate */}
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3 px-4 font-bold text-slate-800 flex items-center gap-2">
                    <Award className="w-3.5 h-3.5 text-amber-600" />
                    Carreau Rate
                  </td>
                  <td className="py-3 px-4 text-center font-mono font-bold text-slate-900">
                    <span className="text-sm font-black">{statsA.carreauRate}</span>
                    <span className="block text-[10px] text-slate-500 font-normal">
                      ({statsA.carreauCount} hit)
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center font-mono font-bold text-slate-900">
                    <span className="text-sm font-black">{statsB.carreauRate}</span>
                    <span className="block text-[10px] text-slate-500 font-normal">
                      ({statsB.carreauCount} hit)
                    </span>
                  </td>
                </tr>

                {/* End Score Row */}
                <tr className="bg-slate-50 font-black border-t border-slate-200">
                  <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-2">
                    <Trophy className="w-3.5 h-3.5 text-amber-500" />
                    Points Awarded for End {selectedEnd.endNumber}
                  </td>
                  <td className="py-3 px-4 text-center font-mono text-lg font-black text-[#002395]">
                    {selectedEnd.scoreA}
                  </td>
                  <td className="py-3 px-4 text-center font-mono text-lg font-black text-[#ED2939]">
                    {selectedEnd.scoreB}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Action Throws breakdown for this End */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1.5 h-4 bg-[#002395] rounded-xs" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Throws Sequence for End {selectedEnd.endNumber} ({endActions.length} throws)
              </h4>
            </div>

            {endActions.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No throws recorded yet in this End.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {endActions.map((act, idx) => {
                  const isTeamA = act.teamId === match.teamA.id;
                  return (
                    <div
                      key={act.id}
                      className="p-2.5 rounded-md bg-slate-50 border border-slate-200 text-xs flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-slate-400 text-[10px]">
                          #{idx + 1}
                        </span>
                        <span
                          className={`font-bold ${
                            isTeamA ? 'text-[#002395]' : 'text-[#ED2939]'
                          }`}
                        >
                          {act.playerName}
                        </span>
                        <span className="text-[10px] bg-slate-200 text-slate-700 px-1 py-0.2 rounded font-semibold">
                          {act.actionType}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {act.carreau && (
                          <span className="text-[9px] font-bold bg-amber-100 text-amber-800 px-1 rounded">
                            CARREAU
                          </span>
                        )}
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
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
