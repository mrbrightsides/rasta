import React from 'react';
import { Match, EndRound } from '../types';
import { PerformanceStats } from '../types';
import {
  Target,
  Flame,
  Sparkles,
  Compass,
  TrendingUp,
  Layers,
  Info,
  CheckCircle2,
} from 'lucide-react';

interface SixIndicatorsShowcaseProps {
  match: Match;
  statsA: PerformanceStats;
  statsB: PerformanceStats;
}

export default function SixIndicatorsShowcase({
  match,
  statsA,
  statsB,
}: SixIndicatorsShowcaseProps) {
  // Compute End-by-End Statistics for Consistency Trend & Score per End
  const endAnalysis = React.useMemo(() => {
    const ends = match.ends || [];
    const completedEnds = ends.filter((e) => e.isCompleted || e.scoreA > 0 || e.scoreB > 0);

    const scoresA = completedEnds.map((e) => e.scoreA);
    const scoresB = completedEnds.map((e) => e.scoreB);

    const totalEndsCount = completedEnds.length || 1;
    const avgScoreA = (scoresA.reduce((sum, s) => sum + s, 0) / totalEndsCount).toFixed(1);
    const avgScoreB = (scoresB.reduce((sum, s) => sum + s, 0) / totalEndsCount).toFixed(1);

    // Consistency per end (accuracy per end)
    const endAccA: number[] = [];
    const endAccB: number[] = [];

    completedEnds.forEach((end) => {
      const actionsInEndA = match.actions.filter(
        (a) => a.endNumber === end.endNumber && a.teamId === match.teamA.id
      );
      const actionsInEndB = match.actions.filter(
        (a) => a.endNumber === end.endNumber && a.teamId === match.teamB.id
      );

      const succA = actionsInEndA.filter((a) => a.result === 'SUCCESS').length;
      const accA = actionsInEndA.length > 0 ? (succA / actionsInEndA.length) * 100 : 0;
      endAccA.push(accA);

      const succB = actionsInEndB.filter((a) => a.result === 'SUCCESS').length;
      const accB = actionsInEndB.length > 0 ? (succB / actionsInEndB.length) * 100 : 0;
      endAccB.push(accB);
    });

    // Consistency rating
    const computeStability = (accList: number[]) => {
      if (accList.length <= 1) return 'Stabil (Data Awal)';
      const mean = accList.reduce((a, b) => a + b, 0) / accList.length;
      const variance = accList.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / accList.length;
      const stdDev = Math.sqrt(variance);
      if (stdDev < 15) return 'Sangat Stabil (±' + stdDev.toFixed(0) + '%)';
      if (stdDev < 25) return 'Cukup Stabil (±' + stdDev.toFixed(0) + '%)';
      return 'Fluktuatif (±' + stdDev.toFixed(0) + '%)';
    };

    return {
      completedEnds,
      avgScoreA,
      avgScoreB,
      stabilityA: computeStability(endAccA),
      stabilityB: computeStability(endAccB),
    };
  }, [match]);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
      {/* Title with Academic Attribution */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-1.5 h-5 bg-[#002395] rounded-xs" />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-slate-900 font-['Outfit'] tracking-tight">
                6 Indikator Analisis Performa Atlet Petanque
              </h3>
              <span className="bg-amber-100 text-amber-900 text-[10px] font-black px-2 py-0.5 rounded border border-amber-300">
                Slide 15 & 17 Disertasi
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Rumus dan indikator ilmiah yang dahulu dihitung manual di Excel, kini dikalkulasi otomatis secara real-time.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-bold">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#002395]" />
            <span className="text-[#002395] uppercase">{match.teamA.name}</span>
          </div>
          <span className="text-slate-300 font-bold">vs</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ED2939]" />
            <span className="text-[#ED2939] uppercase">{match.teamB.name}</span>
          </div>
        </div>
      </div>

      {/* 6 Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* 1. Pointing Accuracy */}
        <div className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-blue-300 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-[#002395]" />
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wide">
                  1. Pointing Accuracy
                </h4>
              </div>
              <span className="text-[10px] font-mono text-slate-400">Target &gt;70%</span>
            </div>

            <p className="text-[11px] text-slate-600 mb-2 leading-snug">
              Kemampuan mendekatkan boule ke jack (boka).
            </p>

            <div className="text-[10px] font-mono text-slate-500 bg-white border border-slate-200/80 p-1.5 rounded mb-3">
              Pointing Berhasil / Total Pointing × 100%
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-200">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-[#002395]">{match.teamA.name}</span>
              <span className="font-mono font-black text-slate-900 text-sm">
                {statsA.pointingAccuracy}
                <span className="text-[10px] font-normal text-slate-400 ml-1">
                  ({statsA.pointingSuccess}/{statsA.pointingTotal})
                </span>
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-[#ED2939]">{match.teamB.name}</span>
              <span className="font-mono font-black text-slate-900 text-sm">
                {statsB.pointingAccuracy}
                <span className="text-[10px] font-normal text-slate-400 ml-1">
                  ({statsB.pointingSuccess}/{statsB.pointingTotal})
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* 2. Shooting Accuracy */}
        <div className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-red-300 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-[#ED2939]" />
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wide">
                  2. Shooting Accuracy
                </h4>
              </div>
              <span className="text-[10px] font-mono text-slate-400">Target &gt;60%</span>
            </div>

            <p className="text-[11px] text-slate-600 mb-2 leading-snug">
              Keberhasilan mengenai atau membuang boule lawan dari zona target.
            </p>

            <div className="text-[10px] font-mono text-slate-500 bg-white border border-slate-200/80 p-1.5 rounded mb-3">
              Shooting Berhasil / Total Shooting × 100%
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-200">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-[#002395]">{match.teamA.name}</span>
              <span className="font-mono font-black text-slate-900 text-sm">
                {statsA.shootingAccuracy}
                <span className="text-[10px] font-normal text-slate-400 ml-1">
                  ({statsA.shootingSuccess}/{statsA.shootingTotal})
                </span>
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-[#ED2939]">{match.teamB.name}</span>
              <span className="font-mono font-black text-slate-900 text-sm">
                {statsB.shootingAccuracy}
                <span className="text-[10px] font-normal text-slate-400 ml-1">
                  ({statsB.shootingSuccess}/{statsB.shootingTotal})
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* 3. Carreau Rate */}
        <div className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-amber-300 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wide">
                  3. Carreau Rate
                </h4>
              </div>
              <span className="text-[10px] font-mono text-slate-400">Tembakan Telak</span>
            </div>

            <p className="text-[11px] text-slate-600 mb-2 leading-snug">
              Kualitas shooting ketika boule pengganti tetap berada di area target.
            </p>

            <div className="text-[10px] font-mono text-slate-500 bg-white border border-slate-200/80 p-1.5 rounded mb-3">
              Jumlah Carreau / Total Shooting × 100%
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-200">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-[#002395]">{match.teamA.name}</span>
              <span className="font-mono font-black text-slate-900 text-sm">
                {statsA.carreauRate}
                <span className="text-[10px] font-normal text-slate-400 ml-1">
                  ({statsA.carreauCount}★)
                </span>
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-[#ED2939]">{match.teamB.name}</span>
              <span className="font-mono font-black text-slate-900 text-sm">
                {statsB.carreauRate}
                <span className="text-[10px] font-normal text-slate-400 ml-1">
                  ({statsB.carreauCount}★)
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* 4. Distance Control */}
        <div className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-indigo-300 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-indigo-600" />
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wide">
                  4. Distance Control
                </h4>
              </div>
              <span className="text-[10px] font-mono text-slate-400">Presisi Jarak</span>
            </div>

            <p className="text-[11px] text-slate-600 mb-2 leading-snug">
              Rata-rata kedekatan jarak boule terhadap boka (jack) dalam centimeter.
            </p>

            <div className="text-[10px] font-mono text-slate-500 bg-white border border-slate-200/80 p-1.5 rounded mb-3">
              Rata-rata jarak boule terhadap jack (cm)
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-200">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-[#002395]">{match.teamA.name}</span>
              <span className="font-mono font-black text-slate-900 text-sm">
                {statsA.distanceControlAvgCm}
                <span className="text-[10px] font-normal text-slate-400 ml-1">
                  cm ({statsA.distanceControlThrowsCount} boule)
                </span>
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-[#ED2939]">{match.teamB.name}</span>
              <span className="font-mono font-black text-slate-900 text-sm">
                {statsB.distanceControlAvgCm}
                <span className="text-[10px] font-normal text-slate-400 ml-1">
                  cm ({statsB.distanceControlThrowsCount} boule)
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* 5. Consistency Trend */}
        <div className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-emerald-300 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wide">
                  5. Consistency Trend
                </h4>
              </div>
              <span className="text-[10px] font-mono text-slate-400">Stabilitas End</span>
            </div>

            <p className="text-[11px] text-slate-600 mb-2 leading-snug">
              Stabilitas performa dan akurasi eksekusi dari end ke end.
            </p>

            <div className="text-[10px] font-mono text-slate-500 bg-white border border-slate-200/80 p-1.5 rounded mb-3">
              Stabilitas indikator performa antar end
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-200">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-[#002395]">{match.teamA.name}</span>
              <span className="font-semibold text-emerald-700 text-xs">
                {endAnalysis.stabilityA}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-[#ED2939]">{match.teamB.name}</span>
              <span className="font-semibold text-slate-700 text-xs">
                {endAnalysis.stabilityB}
              </span>
            </div>
          </div>
        </div>

        {/* 6. Score per End */}
        <div className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-purple-300 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-600" />
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wide">
                  6. Score per End
                </h4>
              </div>
              <span className="text-[10px] font-mono text-slate-400">Momentum Laga</span>
            </div>

            <p className="text-[11px] text-slate-600 mb-2 leading-snug">
              Distribusi perolehan poin dan momentum kemenangan per babak (end).
            </p>

            <div className="text-[10px] font-mono text-slate-500 bg-white border border-slate-200/80 p-1.5 rounded mb-3">
              Rata-rata poin per end & running momentum
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-200">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-[#002395]">{match.teamA.name}</span>
              <span className="font-mono font-black text-slate-900 text-sm">
                Avg {endAnalysis.avgScoreA} pts/end
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-[#ED2939]">{match.teamB.name}</span>
              <span className="font-mono font-black text-slate-900 text-sm">
                Avg {endAnalysis.avgScoreB} pts/end
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
