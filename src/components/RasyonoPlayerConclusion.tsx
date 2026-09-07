import React, { useState, useMemo } from 'react';
import { Match, Player } from '../types';
import {
  RASYONO_BENCHMARK_TIERS,
  RASYONO_CORE_NOTES,
  generatePlayerRasyonoConclusion,
  PlayerConclusionData,
} from '../lib/rasyonoStandards';
import {
  Award,
  GraduationCap,
  Sparkles,
  Trophy,
  CheckCircle2,
  AlertCircle,
  Users,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Brain,
  Dumbbell,
  Target,
  Info,
} from 'lucide-react';

interface RasyonoPlayerConclusionProps {
  match: Match;
  playerStatsMap?: Map<string, {
    pointSuccess: number;
    pointTotal: number;
    shootingSuccess: number;
    shootingTotal: number;
    carreauCount?: number;
  }>;
}

export default function RasyonoPlayerConclusion({
  match,
  playerStatsMap,
}: RasyonoPlayerConclusionProps) {
  const [selectedTeamFilter, setSelectedTeamFilter] = useState<'ALL' | 'TEAM_A' | 'TEAM_B'>('ALL');
  const [expandedPlayerId, setExpandedPlayerId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showFullMatrix, setShowFullMatrix] = useState(true);

  // Compute stats if playerStatsMap wasn't directly passed
  const evaluatedPlayers: PlayerConclusionData[] = useMemo(() => {
    const allPlayers: { player: Player; teamId: string; teamName: string }[] = [
      ...match.teamA.players.map((p) => ({ player: p, teamId: match.teamA.id, teamName: match.teamA.name })),
      ...match.teamB.players.map((p) => ({ player: p, teamId: match.teamB.id, teamName: match.teamB.name })),
    ];

    return allPlayers.map(({ player, teamId, teamName }) => {
      let ptSucc = 0, ptTot = 0, shSucc = 0, shTot = 0, carreau = 0;

      if (playerStatsMap && playerStatsMap.has(player.id)) {
        const st = playerStatsMap.get(player.id)!;
        ptSucc = st.pointSuccess;
        ptTot = st.pointTotal;
        shSucc = st.shootingSuccess;
        shTot = st.shootingTotal;
        carreau = st.carreauCount ?? 0;
      } else {
        const pActions = match.actions.filter((a) => a.playerId === player.id);
        for (const act of pActions) {
          if (act.actionType === 'POINTING') {
            ptTot++;
            if (act.result === 'SUCCESS') ptSucc++;
          } else if (act.actionType === 'SHOOTING') {
            shTot++;
            if (act.result === 'SUCCESS') shSucc++;
            if (act.carreau || act.isCarreau) carreau++;
          }
        }
      }

      return generatePlayerRasyonoConclusion(
        player.id,
        player.name,
        teamId,
        teamName,
        player.role,
        ptSucc,
        ptTot,
        shSucc,
        shTot,
        carreau
      );
    });
  }, [match, playerStatsMap]);

  const filteredPlayers = useMemo(() => {
    if (selectedTeamFilter === 'TEAM_A') {
      return evaluatedPlayers.filter((p) => p.teamId === match.teamA.id);
    }
    if (selectedTeamFilter === 'TEAM_B') {
      return evaluatedPlayers.filter((p) => p.teamId === match.teamB.id);
    }
    return evaluatedPlayers;
  }, [evaluatedPlayers, selectedTeamFilter, match.teamA.id, match.teamB.id]);

  const handleCopyText = (p: PlayerConclusionData) => {
    const text = `📋 KESIMPULAN PERFORMA ATLET (Standar Dr. Rasyono - UNP)
Nama: ${p.playerName} (${p.teamName})
Peran: ${p.role || 'Atlet'}
Total Lemparan: ${p.totalThrows} (Berhasil: ${p.totalSuccess})
Akurasi Keseluruhan: ${p.overallPct !== null ? p.overallPct + '%' : '-'}
Level Medali: ${p.tier.fullLabel} (${p.tier.icon})
- Pointing: ${p.pointPct !== null ? p.pointPct + '%' : '-'} (${p.pointSuccess}/${p.pointTotal})
- Shooting: ${p.shootingPct !== null ? p.shootingPct + '%' : '-'} (${p.shootingSuccess}/${p.shootingTotal})
- Carreau: ${p.carreauCount} kali
Catatan Taktis: ${p.tacticalAdvice}
Mental & Fisik: ${p.mentalPhysicalAdvice}`;

    navigator.clipboard.writeText(text);
    setCopiedId(p.playerId);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-amber-300 shadow-sm overflow-hidden space-y-0">
      {/* 1. ACADEMIC BANNER (UNP & Dr. Rasyono) */}
      <div className="bg-gradient-to-r from-[#00382B] via-[#004D3C] to-[#0B5345] text-white p-5 border-b-2 border-amber-400">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider mb-1">
              <GraduationCap className="w-4 h-4" />
              <span>DOKTOR ILMU KEOLAHRAGAAN · UNIVERSITAS NEGERI PADANG</span>
            </div>
            <h2 className="text-xl md:text-2xl font-black font-['Outfit'] tracking-tight text-white flex items-center gap-2">
              <span>ANALISIS STANDAR PERFORMA ATLET PETANQUE</span>
              <span className="text-xs bg-amber-400 text-slate-950 font-bold px-2.5 py-0.5 rounded-full font-mono">
                by RASYONO
              </span>
            </h2>
            <p className="text-xs text-emerald-100/90 font-medium mt-1">
              Study Pendahuluan Sebagai Latar Belakang · Peneliti: <strong>RASYONO – NIM. 25344021</strong>
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={() => setShowFullMatrix(!showFullMatrix)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold transition-colors border border-white/20"
            >
              <Info className="w-3.5 h-3.5 text-amber-300" />
              <span>{showFullMatrix ? 'Sembunyikan Matriks' : 'Lihat Matriks Standar'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. THE RASYONO BENCHMARK MATRIX (Slide 5 Slide Table) */}
      {showFullMatrix && (
        <div className="p-5 bg-gradient-to-b from-amber-50/70 to-white border-b border-amber-200">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Left: Benchmark Table */}
            <div className="lg:col-span-7 bg-white rounded-xl border border-amber-300 shadow-2xs overflow-hidden">
              <div className="bg-[#FFF2CC] px-4 py-2 border-b border-amber-300 flex items-center justify-between">
                <span className="text-xs font-black text-amber-950 uppercase tracking-wider font-mono">
                  STANDAR PREDIKSI MEDALI PETANQUE (RASYONO)
                </span>
                <span className="text-[10px] text-amber-900 font-bold bg-amber-200/80 px-2 py-0.5 rounded">
                  Ambang Batas Ilmiah
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="bg-amber-100/60 border-b border-amber-200 text-amber-950 font-bold text-[11px] font-mono">
                      <th className="py-2 px-3 text-center w-12 border-r border-amber-200">NO</th>
                      <th className="py-2 px-4 border-r border-amber-200">PERFORMA ATLET PETANQUE</th>
                      <th className="py-2 px-4">PREDIKSI MEDALI / PREDIKAT</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-amber-100 font-medium">
                    <tr className="bg-orange-50/40 hover:bg-orange-50 transition-colors">
                      <td className="py-2.5 px-3 text-center font-bold text-orange-900 border-r border-amber-200">1</td>
                      <td className="py-2.5 px-4 font-mono font-bold text-slate-900 border-r border-amber-200">
                        70 - 79 %
                      </td>
                      <td className="py-2.5 px-4 flex items-center gap-2">
                        <span className="text-base">🥉</span>
                        <span className="font-bold text-orange-950 bg-orange-100/80 px-2.5 py-0.5 rounded text-[11px] border border-orange-200">
                          CUKUP
                        </span>
                      </td>
                    </tr>
                    <tr className="bg-slate-50/60 hover:bg-slate-50 transition-colors">
                      <td className="py-2.5 px-3 text-center font-bold text-slate-800 border-r border-amber-200">2</td>
                      <td className="py-2.5 px-4 font-mono font-bold text-slate-900 border-r border-amber-200">
                        80 - 89 %
                      </td>
                      <td className="py-2.5 px-4 flex items-center gap-2">
                        <span className="text-base">🥈</span>
                        <span className="font-bold text-slate-900 bg-slate-200/80 px-2.5 py-0.5 rounded text-[11px] border border-slate-300">
                          BAIK
                        </span>
                      </td>
                    </tr>
                    <tr className="bg-amber-100/40 hover:bg-amber-100/70 transition-colors">
                      <td className="py-2.5 px-3 text-center font-bold text-amber-900 border-r border-amber-200">3</td>
                      <td className="py-2.5 px-4 font-mono font-bold text-amber-950 border-r border-amber-200">
                        90 - 99 % (≥90%)
                      </td>
                      <td className="py-2.5 px-4 flex items-center gap-2">
                        <span className="text-base">🥇</span>
                        <span className="font-bold text-amber-950 bg-amber-300/80 px-2.5 py-0.5 rounded text-[11px] border border-amber-400">
                          BAIK SEKALI
                        </span>
                      </td>
                    </tr>
                    <tr className="bg-rose-50/30 hover:bg-rose-50/50 transition-colors text-slate-500">
                      <td className="py-2 px-3 text-center font-bold border-r border-amber-200 text-rose-800">-</td>
                      <td className="py-2 px-4 font-mono text-rose-900 border-r border-amber-200">&lt; 70 %</td>
                      <td className="py-2 px-4 text-[11px] text-rose-800 font-semibold">
                        Di Bawah Standar (Perlu Drill Latihan Eksekusi)
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right: The Core Scientific Thesis Question & Methodology Notes */}
            <div className="lg:col-span-5 bg-white rounded-xl border border-amber-300 p-4 shadow-2xs space-y-3">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                <Target className="w-4 h-4 text-amber-600" />
                <span>PERTANYAAN POKOK DISERTASI:</span>
              </div>
              <div className="p-3 bg-gradient-to-r from-emerald-50 to-teal-50 border-l-4 border-emerald-600 rounded-r-lg">
                <p className="text-xs md:text-sm font-black text-emerald-950 leading-relaxed font-['Outfit']">
                  "BAGAIMANA UNTUK MENDAPATKAN HASIL / LEVEL PERFORMA TERSEBUT ?"
                </p>
                <p className="text-[11px] text-emerald-800 mt-1 font-medium">
                  Aplikasi ini hadir sebagai instrumen pencatat analitik objektif real-time untuk memonitor, mengevaluasi, dan merekayasa peningkatan akurasi atlet.
                </p>
              </div>

              <div className="space-y-1.5 pt-1 text-[11px] text-slate-600">
                <span className="font-bold text-slate-800 block text-[11px]">
                  Hierarki Penentu Kemenangan Petanque (Catatan Rasyono):
                </span>
                <ul className="space-y-1 text-[10.5px]">
                  <li className="flex items-start gap-1.5">
                    <span className="font-bold text-emerald-700 font-mono shrink-0">1.</span>
                    <span><strong>Eksekusi Lemparan:</strong> Strategi terbaik petanque adalah eksekusi yang berhasil.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="font-bold text-blue-700 font-mono shrink-0">2.</span>
                    <span><strong>Strategi Taktis:</strong> Menentukan jika performa lemparan kedua regu seimbang.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="font-bold text-purple-700 font-mono shrink-0">3.</span>
                    <span><strong>Mental & Fisik:</strong> Faktor pembeda saat strategi kedua kubu sama rapat.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. INDIVIDUAL ATHLETE EVALUATION CARDS */}
      <div className="p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
          <div>
            <h3 className="text-base font-black text-slate-900 font-['Outfit'] flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              <span>KESIMPULAN PERFORMA PER ATLET</span>
            </h3>
            <p className="text-xs text-slate-500">
              Evaluasi akurasi, pencapaian standar medali, catatan taktis, dan kesiapan mental-fisik per pemain
            </p>
          </div>

          {/* Filter Teams */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg self-start sm:self-auto text-xs font-bold">
            <button
              onClick={() => setSelectedTeamFilter('ALL')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                selectedTeamFilter === 'ALL'
                  ? 'bg-white text-slate-950 shadow-2xs font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua ({evaluatedPlayers.length})
            </button>
            <button
              onClick={() => setSelectedTeamFilter('TEAM_A')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                selectedTeamFilter === 'TEAM_A'
                  ? 'bg-[#002395] text-white shadow-2xs font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {match.teamA.name}
            </button>
            <button
              onClick={() => setSelectedTeamFilter('TEAM_B')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                selectedTeamFilter === 'TEAM_B'
                  ? 'bg-[#ED2939] text-white shadow-2xs font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {match.teamB.name}
            </button>
          </div>
        </div>

        {/* Player Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPlayers.map((p) => {
            const isTeamA = p.teamId === match.teamA.id;
            const isExpanded = expandedPlayerId === p.playerId;
            const isCopied = copiedId === p.playerId;

            return (
              <div
                key={p.playerId}
                className={`rounded-xl border-2 transition-all duration-200 bg-white shadow-2xs hover:shadow-sm ${
                  p.tier.level === 3
                    ? 'border-amber-400/80 hover:border-amber-500'
                    : p.tier.level === 2
                    ? 'border-slate-300 hover:border-slate-400'
                    : p.tier.level === 1
                    ? 'border-orange-300 hover:border-orange-400'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Card Top */}
                <div className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-white text-base shadow-2xs ${
                          isTeamA ? 'bg-[#002395]' : 'bg-[#ED2939]'
                        }`}
                      >
                        {p.playerName.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900 font-['Outfit']">
                            {p.playerName}
                          </h4>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                              isTeamA
                                ? 'bg-blue-50 text-[#002395] border border-blue-200'
                                : 'bg-red-50 text-[#ED2939] border border-red-200'
                            }`}
                          >
                            {p.teamName}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Peran: <strong>{p.role || 'Atlet'}</strong> · Dominan:{' '}
                          <span className="font-semibold text-slate-700">{p.dominantRole}</span>
                        </p>
                      </div>
                    </div>

                    {/* Medal Level Badge */}
                    <div className="text-right shrink-0">
                      <div
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black border shadow-2xs ${p.tier.badgeBg} ${p.tier.badgeText} ${p.tier.badgeBorder}`}
                        title={p.tier.summaryText}
                      >
                        <span className="text-sm">{p.tier.icon}</span>
                        <span>{p.tier.fullLabel}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5 text-right">
                        Target: {p.tier.range}
                      </div>
                    </div>
                  </div>

                  {/* Metrics Bar */}
                  <div className="grid grid-cols-4 gap-1.5 bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-center text-xs font-mono">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Total</span>
                      <span className="font-black text-slate-900 text-sm">
                        {p.overallPct !== null ? `${p.overallPct}%` : '-'}
                      </span>
                      <span className="text-[9px] text-slate-500 block">({p.totalSuccess}/{p.totalThrows})</span>
                    </div>

                    <div>
                      <span className="text-[10px] text-blue-700 font-bold block">Point</span>
                      <span className="font-bold text-blue-900">
                        {p.pointPct !== null ? `${p.pointPct}%` : '-'}
                      </span>
                      <span className="text-[9px] text-slate-500 block">({p.pointSuccess}/{p.pointTotal})</span>
                    </div>

                    <div>
                      <span className="text-[10px] text-rose-700 font-bold block">Shoot</span>
                      <span className="font-bold text-rose-900">
                        {p.shootingPct !== null ? `${p.shootingPct}%` : '-'}
                      </span>
                      <span className="text-[9px] text-slate-500 block">({p.shootingSuccess}/{p.shootingTotal})</span>
                    </div>

                    <div>
                      <span className="text-[10px] text-amber-700 font-bold block">Carreau</span>
                      <span className="font-black text-amber-900">
                        {p.carreauCount}★
                      </span>
                      <span className="text-[9px] text-slate-500 block">
                        {p.carreauRatePct !== null ? `${p.carreauRatePct}%` : '-'}
                      </span>
                    </div>
                  </div>

                  {/* Key Observation Summary */}
                  <div className="text-xs text-slate-700 bg-amber-50/50 p-3 rounded-lg border border-amber-200/70">
                    <div className="flex items-start gap-2">
                      <span className="text-amber-700 font-bold text-xs mt-0.5">📌</span>
                      <div>
                        <p className="font-semibold text-slate-800">{p.keyObservation}</p>
                        <p className="text-[11px] text-slate-600 mt-1">{p.tier.summaryText}</p>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Detailed Coaching Recommendations */}
                  {isExpanded && (
                    <div className="space-y-2.5 pt-2 border-t border-slate-100 text-xs animate-in fade-in duration-150">
                      {/* 1. Taktis & Strategi */}
                      <div className="p-2.5 bg-blue-50/60 rounded-lg border border-blue-100 flex items-start gap-2">
                        <Brain className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-blue-950 block text-[11px]">
                            Analisis Strategi & Eksekusi:
                          </span>
                          <p className="text-slate-700 text-[11px] mt-0.5 leading-relaxed">
                            {p.tacticalAdvice}
                          </p>
                        </div>
                      </div>

                      {/* 2. Mental & Fisik */}
                      <div className="p-2.5 bg-emerald-50/60 rounded-lg border border-emerald-100 flex items-start gap-2">
                        <Dumbbell className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-emerald-950 block text-[11px]">
                            Kesiapan Mental & Fisik:
                          </span>
                          <p className="text-slate-700 text-[11px] mt-0.5 leading-relaxed">
                            {p.mentalPhysicalAdvice}
                          </p>
                        </div>
                      </div>

                      {/* 3. Rekomendasi Program Latihan */}
                      <div className="p-2.5 bg-amber-50/80 rounded-lg border border-amber-200 flex items-start gap-2">
                        <Award className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-amber-950 block text-[11px]">
                            Rekomendasi Latihan Terprogram:
                          </span>
                          <p className="text-slate-700 text-[11px] mt-0.5 leading-relaxed">
                            {p.tier.recommendation}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Bottom Actions */}
                  <div className="flex items-center justify-between pt-1 text-xs">
                    <button
                      onClick={() => setExpandedPlayerId(isExpanded ? null : p.playerId)}
                      className="flex items-center gap-1 font-bold text-amber-900 hover:text-amber-950 transition-colors"
                    >
                      <span>{isExpanded ? 'Tutup Detail Analisis' : 'Lihat Detail & Rekomendasi'}</span>
                      {isExpanded ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>

                    <button
                      onClick={() => handleCopyText(p)}
                      className="flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-medium text-[11px] transition-colors"
                      title="Salin kesimpulan atlet ini untuk catatan pelatih"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-700 font-bold">Tersalin!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-slate-500" />
                          <span>Salin Kesimpulan</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. FOOTER: 4 CATATAN LAPANGAN REAL & ANALISIS ATLET TOP DUNIA (SLIDE 5) */}
      <div className="bg-[#FFF9E6] border-t-2 border-amber-300 p-5">
        <h4 className="text-xs font-black text-amber-950 uppercase tracking-wider mb-2 font-mono flex items-center gap-2">
          <span>CATATAN METODOLOGI & FILOSOFI PERFORMA (DISERTASI RASYONO)</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-amber-950">
          {RASYONO_CORE_NOTES.map((n, i) => (
            <div
              key={i}
              className="bg-white/90 p-3 rounded-lg border border-amber-300/80 shadow-2xs flex items-start gap-2.5"
            >
              <span className="font-mono font-black text-amber-800 text-sm shrink-0 mt-0.5">
                {n.stars}
              </span>
              <div>
                <span className="font-bold text-slate-900 block text-[11px]">{n.label}:</span>
                <p className="text-slate-700 text-[11px] leading-relaxed mt-0.5">{n.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
