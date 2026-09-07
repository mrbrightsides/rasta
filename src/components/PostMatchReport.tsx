import React, { useState, useMemo } from 'react';
import { Match, DistanceMeters, Player } from '../types';
import {
  calculatePerformance,
  calculateStatsByDistance,
  DISTANCES,
} from '../lib/calculations';
import {
  generatePlayerRasyonoConclusion,
  PlayerConclusionData,
  RASYONO_BENCHMARK_TIERS,
  RASYONO_CORE_NOTES,
} from '../lib/rasyonoStandards';
import {
  Award,
  FileCheck2,
  Printer,
  Copy,
  Check,
  Trophy,
  Target,
  Flame,
  Sparkles,
  Compass,
  TrendingUp,
  Layers,
  Brain,
  Dumbbell,
  GraduationCap,
  AlertCircle,
  CheckCircle2,
  Calendar,
  MapPin,
  Users,
} from 'lucide-react';

interface PostMatchReportProps {
  match: Match;
  matchesList?: Match[];
  onSelectMatch?: (m: Match) => void;
}

export default function PostMatchReport({
  match,
  matchesList = [],
  onSelectMatch,
}: PostMatchReportProps) {
  const [copied, setCopied] = useState<boolean>(false);

  // Filter actions by team
  const teamAActions = useMemo(
    () => match.actions.filter((a) => a.teamId === match.teamA.id),
    [match.actions, match.teamA.id]
  );
  const teamBActions = useMemo(
    () => match.actions.filter((a) => a.teamId === match.teamB.id),
    [match.actions, match.teamB.id]
  );

  // Performance calculations
  const statsA = useMemo(() => calculatePerformance(teamAActions), [teamAActions]);
  const statsB = useMemo(() => calculatePerformance(teamBActions), [teamBActions]);

  const distStatsA = useMemo(() => calculateStatsByDistance(teamAActions), [teamAActions]);
  const distStatsB = useMemo(() => calculateStatsByDistance(teamBActions), [teamBActions]);

  // Player evaluations
  const playerConclusions: PlayerConclusionData[] = useMemo(() => {
    const all: { player: Player; teamId: string; teamName: string }[] = [
      ...match.teamA.players.map((p) => ({ player: p, teamId: match.teamA.id, teamName: match.teamA.name })),
      ...match.teamB.players.map((p) => ({ player: p, teamId: match.teamB.id, teamName: match.teamB.name })),
    ];

    return all.map(({ player, teamId, teamName }) => {
      const pActions = match.actions.filter((a) => a.playerId === player.id);
      let ptSucc = 0, ptTot = 0, shSucc = 0, shTot = 0, carreau = 0;

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
  }, [match]);

  // Identify team weak distances
  const weakDistanceA = useMemo(() => {
    let lowestDist: DistanceMeters = '8m';
    let minAcc = 101;
    for (const d of DISTANCES) {
      const st = distStatsA[d];
      if (st.totalThrows >= 2 && st.overallAccuracyValue !== null) {
        if (st.overallAccuracyValue < minAcc) {
          minAcc = st.overallAccuracyValue;
          lowestDist = d;
        }
      }
    }
    return { distance: lowestDist, accuracy: minAcc === 101 ? null : minAcc };
  }, [distStatsA]);

  const handlePrint = () => {
    window.print();
  };

  const handleCopySummary = () => {
    const text = `LAPORAN EVALUASI PASCA-PERTANDINGAN PETANQUE (DISERTASI RASYONO UNP)
Pertandingan: ${match.name}
Tanggal: ${match.date} | Lokasi: ${match.location || 'Lapangan Petanque'}
Skor Akhir: ${match.teamA.name} ${match.scoreA} - ${match.scoreB} ${match.teamB.name}
Total Lemparan: ${match.actions.length} boule (${match.ends.length} end)

RINGKASAN 6 INDIKATOR UTAMA:
1. Pointing Accuracy: ${match.teamA.name} ${statsA.pointingAccuracy} vs ${match.teamB.name} ${statsB.pointingAccuracy}
2. Shooting Accuracy: ${match.teamA.name} ${statsA.shootingAccuracy} vs ${match.teamB.name} ${statsB.shootingAccuracy}
3. Carreau Rate: ${match.teamA.name} ${statsA.carreauRate} (${statsA.carreauCount}★) vs ${match.teamB.name} ${statsB.carreauRate} (${statsB.carreauCount}★)
4. Distance Control: ${match.teamA.name} ${statsA.distanceControlAvgCm} cm vs ${match.teamB.name} ${statsB.distanceControlAvgCm} cm
5. Total Efektivitas: ${match.teamA.name} ${statsA.overallAccuracy} vs ${match.teamB.name} ${statsB.overallAccuracy}

EVALUASI PRESTASI ATLET:
${playerConclusions.map((p) => `- ${p.playerName} (${p.teamName}): ${p.tier.medali} (${p.overallPct ?? 0}%) [P: ${p.pointPct ?? 0}%, S: ${p.shootingPct ?? 0}%]`).join('\n')}

Laporan ini dibuat otomatis menggunakan RASTA Petanque Performance Analysis System.`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const isWinnerA = match.scoreA > match.scoreB;
  const isWinnerB = match.scoreB > match.scoreA;

  return (
    <div className="space-y-6">
      {/* Top Controls & Match Selector */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-sm flex flex-wrap items-center justify-between gap-4 print:hidden">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-4 bg-[#002395] rounded-xs" />
            <h2 className="text-xl font-black text-slate-900 font-['Outfit']">
              Post-Match Report & Rekomendasi Latihan
            </h2>
            <span className="bg-emerald-100 text-emerald-900 text-[10px] font-black px-2 py-0.5 rounded border border-emerald-300">
              Tahap 5 Workflow Rasyono
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Laporan evaluasi komprehensif pasca-pertandingan untuk pengambilan keputusan pelatih berbasis data ilmiah.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {matchesList.length > 1 && onSelectMatch && (
            <select
              value={match.id}
              onChange={(e) => {
                const target = matchesList.find((m) => m.id === e.target.value);
                if (target) onSelectMatch(target);
              }}
              className="bg-slate-50 border border-slate-300 text-xs font-bold rounded-lg px-3 py-1.5 text-slate-800 outline-none"
            >
              {matchesList.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.scoreA}-{m.scoreB})
                </option>
              ))}
            </select>
          )}

          <button
            onClick={handleCopySummary}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors border border-slate-300 shadow-2xs"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Tersalin!' : 'Salin Laporan'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold bg-[#002395] hover:bg-[#001c77] text-white rounded-lg transition-colors shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak / Ekspor PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Report Canvas */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6 print:border-none print:shadow-none print:p-0">
        {/* Official Header */}
        <div className="border-b-2 border-slate-900 pb-4">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="bg-[#002395] text-white font-black px-3 py-1.5 rounded-lg text-2xl font-['Outfit']">
                RASTA
              </div>
              <div>
                <h1 className="text-lg font-black text-slate-900 font-['Outfit'] uppercase tracking-tight">
                  LAPORAN EVALUASI PERFORMA PASCA-PERTANDINGAN PETANQUE
                </h1>
                <p className="text-xs text-slate-600 font-medium">
                  Kerangka Riset Disertasi Doktor Ilmu Keolahragaan — Universitas Negeri Padang (Rasyono, NIM. 25344021)
                </p>
              </div>
            </div>

            <div className="text-right text-[11px] text-slate-500 font-mono">
              <div>Tanggal Laporan: {new Date().toLocaleDateString('id-ID')}</div>
              <div>ID Match: {match.id}</div>
            </div>
          </div>

          {/* Match Meta details */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-3 border-t border-slate-200 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Pertandingan</span>
              <span className="font-bold text-slate-900">{match.name}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Waktu & Lokasi</span>
              <span className="font-semibold text-slate-800">{match.date} • {match.location || 'Center Court'}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Kategori & Target</span>
              <span className="font-semibold text-slate-800">{match.category || 'Triple'} • First to {match.targetScore}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Status & Durasi</span>
              <span className="font-bold text-emerald-700">{match.status} ({match.ends.length} End • {match.actions.length} Throws)</span>
            </div>
          </div>
        </div>

        {/* Scorecard Banner */}
        <div className="bg-slate-900 text-white rounded-xl p-5 flex flex-wrap items-center justify-around gap-4 text-center">
          <div className="w-44">
            <span className="text-xs uppercase font-bold text-slate-400 block">Tim A (Tuan Rumah/Unggulan)</span>
            <h3 className="text-lg font-black text-white mt-0.5 truncate">{match.teamA.name}</h3>
            {isWinnerA && (
              <span className="inline-flex items-center gap-1 bg-amber-400 text-amber-950 font-black text-[10px] px-2 py-0.5 rounded-full mt-1">
                <Trophy className="w-3 h-3" /> PEMENANG
              </span>
            )}
          </div>

          <div className="flex items-center gap-4">
            <span className="text-5xl font-black font-mono text-[#002395] bg-white px-4 py-1.5 rounded-lg shadow-inner">
              {match.scoreA.toString().padStart(2, '0')}
            </span>
            <span className="text-2xl font-mono text-slate-500">:</span>
            <span className="text-5xl font-black font-mono text-[#ED2939] bg-white px-4 py-1.5 rounded-lg shadow-inner">
              {match.scoreB.toString().padStart(2, '0')}
            </span>
          </div>

          <div className="w-44">
            <span className="text-xs uppercase font-bold text-slate-400 block">Tim B (Tantangan)</span>
            <h3 className="text-lg font-black text-white mt-0.5 truncate">{match.teamB.name}</h3>
            {isWinnerB && (
              <span className="inline-flex items-center gap-1 bg-amber-400 text-amber-950 font-black text-[10px] px-2 py-0.5 rounded-full mt-1">
                <Trophy className="w-3 h-3" /> PEMENANG
              </span>
            )}
          </div>
        </div>

        {/* Section 1: Ringkasan 6 Indikator Inti (Slide 15 & 17) */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1.5 h-4 bg-[#002395] rounded-xs" />
            <h3 className="font-black text-sm text-slate-900 font-['Outfit'] uppercase tracking-wider">
              1. Evaluasi 6 Indikator Performa Utama (Slide 15 & 17)
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs border border-slate-200 rounded-lg overflow-hidden">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3 text-left">No</th>
                  <th className="py-2.5 px-3 text-left">Indikator Performa</th>
                  <th className="py-2.5 px-3 text-left">Definisi & Rumus</th>
                  <th className="py-2.5 px-3 text-center bg-blue-50/80 text-[#002395]">
                    {match.teamA.name}
                  </th>
                  <th className="py-2.5 px-3 text-center bg-red-50/80 text-[#ED2939]">
                    {match.teamB.name}
                  </th>
                  <th className="py-2.5 px-3 text-center">Standar Benchmark</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-500">1</td>
                  <td className="py-2.5 px-3 font-bold text-slate-900">Pointing Accuracy</td>
                  <td className="py-2.5 px-3 text-slate-600 text-[11px]">Pointing Berhasil / Total Pointing × 100%</td>
                  <td className="py-2.5 px-3 text-center font-mono font-black text-sm text-[#002395] bg-blue-50/30">
                    {statsA.pointingAccuracy}
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono font-black text-sm text-[#ED2939] bg-red-50/30">
                    {statsB.pointingAccuracy}
                  </td>
                  <td className="py-2.5 px-3 text-center text-slate-500 text-[11px]">≥ 70% (Podium)</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-500">2</td>
                  <td className="py-2.5 px-3 font-bold text-slate-900">Shooting Accuracy</td>
                  <td className="py-2.5 px-3 text-slate-600 text-[11px]">Shooting Berhasil / Total Shooting × 100%</td>
                  <td className="py-2.5 px-3 text-center font-mono font-black text-sm text-[#002395] bg-blue-50/30">
                    {statsA.shootingAccuracy}
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono font-black text-sm text-[#ED2939] bg-red-50/30">
                    {statsB.shootingAccuracy}
                  </td>
                  <td className="py-2.5 px-3 text-center text-slate-500 text-[11px]">≥ 65% (Podium)</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-500">3</td>
                  <td className="py-2.5 px-3 font-bold text-slate-900">Carreau Rate</td>
                  <td className="py-2.5 px-3 text-slate-600 text-[11px]">Jumlah Carreau / Total Shooting × 100%</td>
                  <td className="py-2.5 px-3 text-center font-mono font-black text-sm text-[#002395] bg-blue-50/30">
                    {statsA.carreauRate} ({statsA.carreauCount}★)
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono font-black text-sm text-[#ED2939] bg-red-50/30">
                    {statsB.carreauRate} ({statsB.carreauCount}★)
                  </td>
                  <td className="py-2.5 px-3 text-center text-slate-500 text-[11px]">≥ 25% (Elit Dunia)</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-500">4</td>
                  <td className="py-2.5 px-3 font-bold text-slate-900">Distance Control</td>
                  <td className="py-2.5 px-3 text-slate-600 text-[11px]">Rata-rata jarak boule ke jack (cm)</td>
                  <td className="py-2.5 px-3 text-center font-mono font-black text-sm text-[#002395] bg-blue-50/30">
                    {statsA.distanceControlAvgCm} cm
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono font-black text-sm text-[#ED2939] bg-red-50/30">
                    {statsB.distanceControlAvgCm} cm
                  </td>
                  <td className="py-2.5 px-3 text-center text-slate-500 text-[11px]">≤ 35 cm (Aman)</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-500">5</td>
                  <td className="py-2.5 px-3 font-bold text-slate-900">Total Akurasi Tim</td>
                  <td className="py-2.5 px-3 text-slate-600 text-[11px]">Total Berhasil Tim / Total Percobaan × 100%</td>
                  <td className="py-2.5 px-3 text-center font-mono font-black text-sm text-[#002395] bg-blue-50/30">
                    {statsA.overallAccuracy}
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono font-black text-sm text-[#ED2939] bg-red-50/30">
                    {statsB.overallAccuracy}
                  </td>
                  <td className="py-2.5 px-3 text-center text-slate-500 text-[11px]">≥ 70% (Standar)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 2: Ringkasan & Prediksi Medali Per Pemain */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1.5 h-4 bg-[#002395] rounded-xs" />
            <h3 className="font-black text-sm text-slate-900 font-['Outfit'] uppercase tracking-wider">
              2. Kesimpulan Capaian & Prediksi Medali Per Atlet (Disertasi Rasyono UNP)
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {playerConclusions.map((p) => (
              <div
                key={p.playerId}
                className={`p-3.5 rounded-lg border bg-slate-50/70 border-slate-200 hover:border-slate-300 transition-colors flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div>
                      <h4 className="font-black text-slate-900 text-xs">{p.playerName}</h4>
                      <span className="text-[10px] text-slate-500 font-semibold">{p.teamName} • {p.role || 'Player'}</span>
                    </div>
                    <span className={`inline-flex items-center gap-1 text-[11px] font-black px-2 py-0.5 rounded border ${p.tier.badgeBg} ${p.tier.badgeText} ${p.tier.badgeBorder}`}>
                      {p.tier.icon} {p.tier.medali}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-600 leading-snug mb-2">
                    {p.keyObservation}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-[10px] font-mono text-slate-700 font-bold">
                  <span>P: {p.pointPct ?? 0}% ({p.pointSuccess}/{p.pointTotal})</span>
                  <span>S: {p.shootingPct ?? 0}% ({p.shootingSuccess}/{p.shootingTotal})</span>
                  <span>Carreau: {p.carreauCount}★</span>
                  <span className="text-[#002395] font-black">Total: {p.overallPct ?? 0}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Rekomendasi Latihan Berbasis Data (Slide 14 Output Evaluasi & Slide 12 Poin 05) */}
        <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-amber-700" />
              <h3 className="font-black text-sm text-amber-950 font-['Outfit'] uppercase tracking-wider">
                3. Rekomendasi Latihan & Pengambilan Keputusan Pelatih Berbasis Data
              </h3>
            </div>
            <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded border border-amber-300">
              Disertasi UNP
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
            {/* Drills Pointing */}
            <div className="bg-white p-3.5 rounded-lg border border-amber-200 shadow-2xs">
              <h5 className="font-bold text-slate-900 flex items-center gap-1.5 mb-1 text-xs">
                <Target className="w-4 h-4 text-[#002395]" />
                Program Latihan Pointing (Presisi Boka)
              </h5>
              <p className="text-slate-600 text-[11px] leading-relaxed mb-2">
                {statsA.pointingAccuracyValue && statsA.pointingAccuracyValue < 70
                  ? `Akurasi pointing tim berada di angka ${statsA.pointingAccuracy}. Terapkan drill Pointing Plombé (High-Lob) dan Rolling pada jarak 7m - 8m dengan target radius 30cm dari jack sebanyak 100 boule/sesi.`
                  : `Pointing sudah prima (${statsA.pointingAccuracy}). Pertahankan konsistensi dengan variasi kontur lapangan miring dan tanah berkerikil untuk menjaga akurasi placement.`}
              </p>
              <div className="bg-slate-50 p-2 rounded text-[10px] font-mono text-slate-600">
                Fokus: Radius stop ≤ 25 cm | Konsistensi rilis pergelangan tangan
              </div>
            </div>

            {/* Drills Shooting */}
            <div className="bg-white p-3.5 rounded-lg border border-amber-200 shadow-2xs">
              <h5 className="font-bold text-slate-900 flex items-center gap-1.5 mb-1 text-xs">
                <Flame className="w-4 h-4 text-[#ED2939]" />
                Program Latihan Shooting (Tir au Fer & Carreau)
              </h5>
              <p className="text-slate-600 text-[11px] leading-relaxed mb-2">
                {statsA.shootingAccuracyValue && statsA.shootingAccuracyValue < 65
                  ? `Akurasi tembakan belum mencapai standar podium semifinal. Wajibkan drill 'Tir au Fer' dari jarak 7m, 8m, hingga 9m tanpa boule ground-shot untuk meningkatkan direct impact.`
                  : `Akurasi tembakan solid (${statsA.shootingAccuracy}). Tingkatkan fokus pada drill Carreau (boule pengganti tetap diam di lingkaran target) untuk mengunci poin maksimal.`}
              </p>
              <div className="bg-slate-50 p-2 rounded text-[10px] font-mono text-slate-600">
                Fokus: Sudut elevasi lemparan 45° | Follow-through lurus ke target
              </div>
            </div>

            {/* Distance Adaptation */}
            <div className="bg-white p-3.5 rounded-lg border border-amber-200 shadow-2xs">
              <h5 className="font-bold text-slate-900 flex items-center gap-1.5 mb-1 text-xs">
                <Compass className="w-4 h-4 text-indigo-600" />
                Adaptasi Jarak Kritis (Jarak Terlemah: {weakDistanceA.distance})
              </h5>
              <p className="text-slate-600 text-[11px] leading-relaxed mb-2">
                Data menunjukkan efektivitas tim mengalami penurunan pada jarak {weakDistanceA.distance}
                {weakDistanceA.accuracy !== null ? ` (${weakDistanceA.accuracy}%)` : ''}.
                Pelatih disarankan melatih strategi lempar jack di awal end untuk membatasi lawan memilih jarak yang tidak dikuasai tim sendiri.
              </p>
              <div className="bg-slate-50 p-2 rounded text-[10px] font-mono text-slate-600">
                Strategi: Kontrol lemparan boka pembuka pada jarak optimal tim
              </div>
            </div>

            {/* Mental & Lactic Acid Conditioning */}
            <div className="bg-white p-3.5 rounded-lg border border-amber-200 shadow-2xs">
              <h5 className="font-bold text-slate-900 flex items-center gap-1.5 mb-1 text-xs">
                <Dumbbell className="w-4 h-4 text-emerald-600" />
                Kondisi Fisik, Denyut Nadi, & Pemulihan Asam Laktat
              </h5>
              <p className="text-slate-600 text-[11px] leading-relaxed mb-2">
                Sesuai catatan empiris Disertasi Rasyono, saat strategi kedua tim setara, daya tahan mental dan denyut nadi penembak menjadi penentu akhir. Sisipkan latihan konsentrasi di bawah tekanan skor kritis.
              </p>
              <div className="bg-slate-50 p-2 rounded text-[10px] font-mono text-slate-600">
                Metode: Box-breathing 4-4-4-4 sebelum masuk lingkaran lempar
              </div>
            </div>
          </div>
        </div>

        {/* 4 Core Notes Academic Footer */}
        <div className="border-t border-slate-200 pt-4 text-[10px] text-slate-500 space-y-1">
          <div className="font-bold text-slate-700">4 Kaidah Inti Analisis Performa Petanque (Rasyono UNP):</div>
          {RASYONO_CORE_NOTES.map((n) => (
            <div key={n.label} className="leading-snug">
              <span className="font-mono font-bold text-slate-900">{n.stars}</span>{' '}
              <span className="font-bold text-slate-800">{n.label}:</span> {n.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
