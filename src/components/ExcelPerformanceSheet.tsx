import React, { useState, useMemo } from 'react';
import { Match, ThrowAction, DistanceMeters } from '../types';
import RasyonoPlayerConclusion from './RasyonoPlayerConclusion';
import { getRasyonoTier } from '../lib/rasyonoStandards';
import { getCategoryBouleInfo } from '../lib/calculations';
import {
  FileSpreadsheet,
  Download,
  Printer,
  Info,
  CheckCircle2,
  XCircle,
  Calculator,
  RefreshCw,
  Trophy,
  Users,
  ChevronRight,
  Sparkles,
  Star,
  Layers,
} from 'lucide-react';

interface ExcelPerformanceSheetProps {
  match: Match;
  matches?: Match[];
  onRecordAction?: (action: Partial<ThrowAction>) => void;
  onDeleteAction?: (actionId: string) => void;
  onUpdateEndDistance?: (endNumber: number, distance: DistanceMeters) => void;
  onSwitchToMatch?: (matchId: string) => void;
}

interface CellData {
  p1?: 1 | 0;
  p2?: 1 | 0;
  p3?: 1 | 0;
  s1?: 1 | 0;
  s2?: 1 | 0;
  s3?: 1 | 0;
  s1Carreau?: boolean;
  s2Carreau?: boolean;
  s3Carreau?: boolean;
  p1ActionId?: string;
  p2ActionId?: string;
  p3ActionId?: string;
  s1ActionId?: string;
  s2ActionId?: string;
  s3ActionId?: string;
}

export default function ExcelPerformanceSheet({
  match,
  matches = [],
  onRecordAction,
  onDeleteAction,
  onUpdateEndDistance,
  onSwitchToMatch,
}: ExcelPerformanceSheetProps) {
  const [selectedJackRange, setSelectedJackRange] = useState<'ALL' | '1-6' | '7-12' | '13+'>('ALL');
  const [showFormulaGuide, setShowFormulaGuide] = useState<boolean>(true);

  // Derive player lists
  const teamAPlayers = match.teamA.players;
  const teamBPlayers = match.teamB.players;
  const allPlayers = [...teamAPlayers, ...teamBPlayers];

  // Aturan resmi Petanque & Disertasi Rasyono: Single & Double = 3 bola, Triple = 2 bola per atlet
  const autoBouleInfo = useMemo(() => {
    return getCategoryBouleInfo(match.category, teamAPlayers.length);
  }, [match.category, teamAPlayers.length]);

  // Coach can keep Auto (recommended) or explicitly toggle between Triple (2 bola) and Single/Double (3 bola)
  const [overrideFormat, setOverrideFormat] = useState<'AUTO' | 'TRIPLE_2' | 'SINGLE_DOUBLE_3'>('AUTO');

  const boulesPerAthlete: 2 | 3 = useMemo(() => {
    if (overrideFormat === 'TRIPLE_2') return 2;
    if (overrideFormat === 'SINGLE_DOUBLE_3') return 3;
    return autoBouleInfo.boulesPerAthlete as 2 | 3;
  }, [overrideFormat, autoBouleInfo.boulesPerAthlete]);

  const bouleSlots: (1 | 2 | 3)[] = useMemo(() => {
    return boulesPerAthlete === 3 ? [1, 2, 3] : [1, 2];
  }, [boulesPerAthlete]);

  // Derive ends
  const ends = match.ends || [];
  const maxEndNumber = Math.max(13, match.currentEndNumber, ends.length);
  const endNumbers = Array.from({ length: maxEndNumber }, (_, i) => i + 1);

  // Filtered ends for view tabs
  const displayedEndNumbers = useMemo(() => {
    if (selectedJackRange === '1-6') return endNumbers.filter((n) => n >= 1 && n <= 6);
    if (selectedJackRange === '7-12') return endNumbers.filter((n) => n >= 7 && n <= 12);
    if (selectedJackRange === '13+') return endNumbers.filter((n) => n >= 13);
    return endNumbers;
  }, [selectedJackRange, endNumbers]);

  // Build grid map: playerId -> endNumber -> CellData
  const gridMap = useMemo(() => {
    const map = new Map<string, Map<number, CellData>>();

    allPlayers.forEach((p) => {
      const endMap = new Map<number, CellData>();
      endNumbers.forEach((endNum) => {
        endMap.set(endNum, {});
      });
      map.set(p.id, endMap);
    });

    // Populate from throw actions
    match.actions.forEach((act) => {
      const pMap = map.get(act.playerId);
      if (!pMap) return;
      const cell = pMap.get(act.endNumber) || {};
      const val = act.result === 'SUCCESS' ? 1 : 0;

      if (act.actionType === 'POINTING') {
        if (cell.p1 === undefined) {
          cell.p1 = val;
          cell.p1ActionId = act.id;
        } else if (cell.p2 === undefined) {
          cell.p2 = val;
          cell.p2ActionId = act.id;
        } else if (cell.p3 === undefined) {
          cell.p3 = val;
          cell.p3ActionId = act.id;
        }
      } else if (act.actionType === 'SHOOTING') {
        if (cell.s1 === undefined) {
          cell.s1 = val;
          cell.s1Carreau = !!(act.carreau || act.isCarreau);
          cell.s1ActionId = act.id;
        } else if (cell.s2 === undefined) {
          cell.s2 = val;
          cell.s2Carreau = !!(act.carreau || act.isCarreau);
          cell.s2ActionId = act.id;
        } else if (cell.s3 === undefined) {
          cell.s3 = val;
          cell.s3Carreau = !!(act.carreau || act.isCarreau);
          cell.s3ActionId = act.id;
        }
      }
      pMap.set(act.endNumber, cell);
    });

    return map;
  }, [match.actions, allPlayers, endNumbers]);

  // Calculate individual and team performance metrics
  const performanceStats = useMemo(() => {
    const playerStatsMap = new Map<
      string,
      {
        pointSuccess: number;
        pointTotal: number;
        pointPct: number | null;
        shootingSuccess: number;
        shootingTotal: number;
        shootingPct: number | null;
      }
    >();

    allPlayers.forEach((p) => {
      let pSuccess = 0;
      let pTotal = 0;
      let sSuccess = 0;
      let sTotal = 0;

      const pMap = gridMap.get(p.id);
      if (pMap) {
        pMap.forEach((cell) => {
          if (cell.p1 !== undefined) {
            pTotal++;
            if (cell.p1 === 1) pSuccess++;
          }
          if (cell.p2 !== undefined) {
            pTotal++;
            if (cell.p2 === 1) pSuccess++;
          }
          if (cell.p3 !== undefined) {
            pTotal++;
            if (cell.p3 === 1) pSuccess++;
          }
          if (cell.s1 !== undefined) {
            sTotal++;
            if (cell.s1 === 1) sSuccess++;
          }
          if (cell.s2 !== undefined) {
            sTotal++;
            if (cell.s2 === 1) sSuccess++;
          }
          if (cell.s3 !== undefined) {
            sTotal++;
            if (cell.s3 === 1) sSuccess++;
          }
        });
      }

      // Adhere strictly to Table 1.1 / Excel: 0 attempts yields null (#DIV/0!), NOT 0%
      const pointPct = pTotal > 0 ? Math.round((pSuccess / pTotal) * 100) : null;
      const shootingPct = sTotal > 0 ? Math.round((sSuccess / sTotal) * 100) : null;

      playerStatsMap.set(p.id, {
        pointSuccess: pSuccess,
        pointTotal: pTotal,
        pointPct,
        shootingSuccess: sSuccess,
        shootingTotal: sTotal,
        shootingPct,
      });
    });

    // Team A Totals
    let teamAPointSuccess = 0;
    let teamAPointTotal = 0;
    let teamAShootingSuccess = 0;
    let teamAShootingTotal = 0;

    teamAPlayers.forEach((p) => {
      const stat = playerStatsMap.get(p.id);
      if (stat) {
        teamAPointSuccess += stat.pointSuccess;
        teamAPointTotal += stat.pointTotal;
        teamAShootingSuccess += stat.shootingSuccess;
        teamAShootingTotal += stat.shootingTotal;
      }
    });

    const teamAPointPct =
      teamAPointTotal > 0 ? Math.round((teamAPointSuccess / teamAPointTotal) * 100) : null;
    const teamAShootingPct =
      teamAShootingTotal > 0
        ? Math.round((teamAShootingSuccess / teamAShootingTotal) * 100)
        : null;

    // Team B Totals
    let teamBPointSuccess = 0;
    let teamBPointTotal = 0;
    let teamBShootingSuccess = 0;
    let teamBShootingTotal = 0;

    teamBPlayers.forEach((p) => {
      const stat = playerStatsMap.get(p.id);
      if (stat) {
        teamBPointSuccess += stat.pointSuccess;
        teamBPointTotal += stat.pointTotal;
        teamBShootingSuccess += stat.shootingSuccess;
        teamBShootingTotal += stat.shootingTotal;
      }
    });

    const teamBPointPct =
      teamBPointTotal > 0 ? Math.round((teamBPointSuccess / teamBPointTotal) * 100) : null;
    const teamBShootingPct =
      teamBShootingTotal > 0
        ? Math.round((teamBShootingSuccess / teamBShootingTotal) * 100)
        : null;

    return {
      playerStatsMap,
      teamA: {
        pointSuccess: teamAPointSuccess,
        pointTotal: teamAPointTotal,
        pointPct: teamAPointPct,
        shootingSuccess: teamAShootingSuccess,
        shootingTotal: teamAShootingTotal,
        shootingPct: teamAShootingPct,
        score: match.scoreA,
      },
      teamB: {
        pointSuccess: teamBPointSuccess,
        pointTotal: teamBPointTotal,
        pointPct: teamBPointPct,
        shootingSuccess: teamBShootingSuccess,
        shootingTotal: teamBShootingTotal,
        shootingPct: teamBShootingPct,
        score: match.scoreB,
      },
    };
  }, [allPlayers, gridMap, teamAPlayers, teamBPlayers, match.scoreA, match.scoreB]);

  // Handle cell click toggling
  const handleCellClick = (
    playerId: string,
    playerName: string,
    teamId: string,
    endNum: number,
    actionType: 'POINTING' | 'SHOOTING',
    slot: 1 | 2 | 3,
    currentVal?: 1 | 0,
    actionId?: string,
    isCurrentCarreau?: boolean
  ) => {
    if (!onRecordAction) return;

    const endObj = ends.find((e) => e.endNumber === endNum);
    const dist = endObj?.distance || '7.5m';

    if (actionType === 'POINTING') {
      // Pointing Cycle: undefined -> 1 -> 0 -> undefined (delete)
      if (currentVal === undefined) {
        onRecordAction({
          playerId,
          playerName,
          teamId,
          endNumber: endNum,
          actionType,
          distance: dist,
          result: 'SUCCESS',
          scoreValue: 1,
          bouleNumber: slot,
        });
      } else if (currentVal === 1) {
        if (actionId && onDeleteAction) onDeleteAction(actionId);
        onRecordAction({
          playerId,
          playerName,
          teamId,
          endNumber: endNum,
          actionType,
          distance: dist,
          result: 'FAIL',
          scoreValue: 0,
          bouleNumber: slot,
        });
      } else if (currentVal === 0) {
        if (actionId && onDeleteAction) onDeleteAction(actionId);
      }
    } else {
      // Shooting Cycle:
      // undefined (Kosong) -> 1 (Hit Biasa) -> 1★ (CARREAU / Boule Pengganti) -> 0 (Gagal) -> undefined (Kosong)
      if (currentVal === undefined) {
        onRecordAction({
          playerId,
          playerName,
          teamId,
          endNumber: endNum,
          actionType,
          distance: dist,
          result: 'SUCCESS',
          carreau: false,
          isCarreau: false,
          scoreValue: 1,
          bouleNumber: slot,
        });
      } else if (currentVal === 1 && !isCurrentCarreau) {
        // Upgrade to 1★ (Carreau)
        if (actionId && onDeleteAction) onDeleteAction(actionId);
        onRecordAction({
          playerId,
          playerName,
          teamId,
          endNumber: endNum,
          actionType,
          distance: dist,
          result: 'SUCCESS',
          carreau: true,
          isCarreau: true,
          scoreValue: 1,
          bouleNumber: slot,
        });
      } else if (currentVal === 1 && isCurrentCarreau) {
        // Switch to 0 (Gagal / Meleset)
        if (actionId && onDeleteAction) onDeleteAction(actionId);
        onRecordAction({
          playerId,
          playerName,
          teamId,
          endNumber: endNum,
          actionType,
          distance: dist,
          result: 'FAIL',
          carreau: false,
          isCarreau: false,
          scoreValue: 0,
          bouleNumber: slot,
        });
      } else if (currentVal === 0) {
        // Delete / Blank
        if (actionId && onDeleteAction) onDeleteAction(actionId);
      }
    }
  };

  // Export to CSV matching the Excel Sheet
  const handleExportCSV = () => {
    const lines: string[] = [];

    // Header title
    lines.push(`ANALISIS PERFORMANCE PETANQUE - ${match.name}`);
    lines.push(`Tanggal: ${match.date}; Lokasi: ${match.location || 'Lapangan Petanque'}`);
    lines.push('');

    // Summary table header
    lines.push('RINGKASAN PERFORMA AKHIR');
    lines.push('NAMA,POINT BERHASIL,POINT TOTAL,POINT %,SHOOTING BERHASIL,SHOOTING TOTAL,SHOOTING %,PERFORMA TEAM POINT %,PERFORMA TEAM SHOOTING %,SKOR AKHIR');

    teamAPlayers.forEach((p, idx) => {
      const st = performanceStats.playerStatsMap.get(p.id);
      const teamPt = idx === 0 ? `${performanceStats.teamA.pointPct}%` : '';
      const teamSh = idx === 0 ? `${performanceStats.teamA.shootingPct}%` : '';
      const teamSc = idx === 0 ? `${match.scoreA}` : '';
      lines.push(`${p.name},${st?.pointSuccess ?? 0},${st?.pointTotal ?? 0},${st?.pointPct ?? 0}%,${st?.shootingSuccess ?? 0},${st?.shootingTotal ?? 0},${st?.shootingPct ?? 0}%,${teamPt},${teamSh},${teamSc}`);
    });

    teamBPlayers.forEach((p, idx) => {
      const st = performanceStats.playerStatsMap.get(p.id);
      const teamPt = idx === 0 ? `${performanceStats.teamB.pointPct}%` : '';
      const teamSh = idx === 0 ? `${performanceStats.teamB.shootingPct}%` : '';
      const teamSc = idx === 0 ? `${match.scoreB}` : '';
      lines.push(`${p.name},${st?.pointSuccess ?? 0},${st?.pointTotal ?? 0},${st?.pointPct ?? 0}%,${st?.shootingSuccess ?? 0},${st?.shootingTotal ?? 0},${st?.shootingPct ?? 0}%,${teamPt},${teamSh},${teamSc}`);
    });

    lines.push('');
    lines.push('DETAIL PER LEMPARAN PER JACK (END)');

    // Jack Headers
    const jackCols = displayedEndNumbers.map((num) => {
      const endObj = ends.find((e) => e.endNumber === num);
      const dist = endObj?.distance || '7.5m';
      return boulesPerAthlete === 3
        ? `JACK ${num} (${dist}) [P1;P2;P3;S1;S2;S3;SKOR]`
        : `JACK ${num} (${dist}) [P1;P2;S1;S2;SKOR]`;
    });
    lines.push(`NAMA,TIM,${jackCols.join(',')}`);

    allPlayers.forEach((p) => {
      const pMap = gridMap.get(p.id);
      const rowCols = displayedEndNumbers.map((num) => {
        const cell = pMap?.get(num) || {};
        const p1 = cell.p1 !== undefined ? cell.p1 : '';
        const p2 = cell.p2 !== undefined ? cell.p2 : '';
        const p3 = cell.p3 !== undefined ? cell.p3 : '';
        const s1 = cell.s1 !== undefined ? cell.s1 : '';
        const s2 = cell.s2 !== undefined ? cell.s2 : '';
        const s3 = cell.s3 !== undefined ? cell.s3 : '';
        const endObj = ends.find((e) => e.endNumber === num);
        const score = p.teamId === match.teamA.id ? endObj?.runningScoreA ?? '' : endObj?.runningScoreB ?? '';
        return boulesPerAthlete === 3
          ? `"${p1};${p2};${p3};${s1};${s2};${s3};${score}"`
          : `"${p1};${p2};${s1};${s2};${score}"`;
      });
      const teamName = p.teamId === match.teamA.id ? match.teamA.name : match.teamB.name;
      lines.push(`${p.name},${teamName},${rowCols.join(',')}`);
    });

    const csvContent = lines.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Analisis_Performa_Petanque_${match.name.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 print:m-0 print:p-0">
      {/* 1. Header Toolbar */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-emerald-50 text-emerald-700 rounded-lg">
              <FileSpreadsheet className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-slate-900 tracking-tight font-['Outfit']">
                  Lembar Analisis Performa Pemain & Tim
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                  Model Disertasi Rasyono UNP 2026
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Sesuai Format Proposal Disertasi Bab I Tabel 1.1: Pointing, Shooting, % Akurasi, dan Skor Tim
              </p>
            </div>
          </div>
        </div>

        {/* Actions & Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Match Selector */}
          {matches.length > 0 && onSwitchToMatch && (
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1">
              <span className="text-[11px] font-semibold text-slate-500">Pilih Pertandingan:</span>
              <select
                value={match.id}
                onChange={(e) => onSwitchToMatch(e.target.value)}
                className="bg-transparent text-xs font-bold text-slate-800 outline-none cursor-pointer max-w-[220px] truncate"
              >
                {matches.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Jack Range Filter */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setSelectedJackRange('ALL')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                selectedJackRange === 'ALL'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua Jack (1-13+)
            </button>
            <button
              onClick={() => setSelectedJackRange('1-6')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                selectedJackRange === '1-6'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Jack 1 - 6
            </button>
            <button
              onClick={() => setSelectedJackRange('7-12')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                selectedJackRange === '7-12'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Jack 7 - 12
            </button>
            <button
              onClick={() => setSelectedJackRange('13+')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                selectedJackRange === '13+'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Jack 13+
            </button>
          </div>

          {/* Boule Format Selector (Single & Double: 3 Bola, Triple: 2 Bola) */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs font-semibold">
            <span className="text-[10px] uppercase font-bold text-slate-500 px-2 flex items-center gap-1">
              <Layers className="w-3 h-3 text-[#002395]" />
              <span>Bola:</span>
            </span>
            <button
              onClick={() => setOverrideFormat('AUTO')}
              className={`px-2.5 py-1.5 rounded-md transition-all ${
                overrideFormat === 'AUTO'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title={`Otomatis dari kategori match: ${autoBouleInfo.label} (${autoBouleInfo.boulesPerAthlete} bola per atlet)`}
            >
              Auto ({autoBouleInfo.boulesPerAthlete} Bola)
            </button>
            <button
              onClick={() => setOverrideFormat('TRIPLE_2')}
              className={`px-2.5 py-1.5 rounded-md transition-all ${
                overrideFormat === 'TRIPLE_2'
                  ? 'bg-[#002395] text-white shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Triple: 2 bola per atlet (P1, P2 & S1, S2)"
            >
              Triple (2 Bola)
            </button>
            <button
              onClick={() => setOverrideFormat('SINGLE_DOUBLE_3')}
              className={`px-2.5 py-1.5 rounded-md transition-all ${
                overrideFormat === 'SINGLE_DOUBLE_3'
                  ? 'bg-[#002395] text-white shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Single & Double: 3 bola per atlet (P1, P2, P3 & S1, S2, S3)"
            >
              Single/Double (3 Bola)
            </button>
          </div>

          <button
            onClick={() => setShowFormulaGuide(!showFormulaGuide)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-bold transition-colors"
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>{showFormulaGuide ? 'Sembunyikan Rumus' : 'Lihat Rumus'}</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg text-xs font-bold transition-colors"
            title="Download file CSV / Excel"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg text-xs font-bold transition-colors print:hidden"
            title="Cetak lembar performa"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak</span>
          </button>
        </div>
      </div>

      {/* 2. Formula & Calculation Guide Callout */}
      {showFormulaGuide && (
        <div className="bg-gradient-to-r from-amber-50/80 via-white to-amber-50/50 rounded-xl border border-amber-200 p-5 shadow-2xs">
          <div className="flex items-start gap-3">
            <span className="p-2 bg-amber-100 text-amber-800 rounded-lg shrink-0 mt-0.5">
              <Calculator className="w-5 h-5" />
            </span>
            <div className="space-y-3 text-xs text-slate-700 w-full">
              <div>
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                  Cara Menghitung Skor & Logika Performa Pemain Petanque (Model FOPI / Excel)
                </h3>
                <p className="text-slate-600 mt-0.5">
                  Setiap Jack (End) mencatat lemparan Pointing dan Shooting per pemain menggunakan angka biner{' '}
                  <strong className="text-emerald-700 font-mono">1 (Berhasil)</strong> dan{' '}
                  <strong className="text-rose-700 font-mono">0 (Gagal)</strong>.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                {/* 1. Nilai Lemparan */}
                <div className="bg-white rounded-lg p-3 border border-amber-200/80 shadow-2xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-900 block">
                      1. Input Lemparan ({boulesPerAthlete === 3 ? 'Boule 1, 2 & 3' : 'Boule 1 & 2'})
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-bold bg-blue-100 text-blue-900">
                      {boulesPerAthlete === 3 ? 'Single/Double: 3 Bola' : 'Triple: 2 Bola'}
                    </span>
                  </div>
                  <ul className="space-y-1 text-[11px] text-slate-600">
                    <li className="flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded bg-emerald-100 text-emerald-800 font-mono font-bold flex items-center justify-center text-[10px]">
                        1
                      </span>
                      <span><strong>Berhasil</strong> (masuk target / hit)</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded bg-amber-300 text-amber-950 font-mono font-black flex items-center justify-center text-[10px]">
                        1★
                      </span>
                      <span><strong>Carreau</strong> (Shooting boule pengganti)</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded bg-rose-100 text-rose-800 font-mono font-bold flex items-center justify-center text-[10px]">
                        0
                      </span>
                      <span><strong>Gagal</strong> (meleset / out / miss)</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded bg-slate-100 text-slate-500 font-mono font-bold flex items-center justify-center text-[10px]">
                        -
                      </span>
                      <span><strong>Kosong</strong> (tidak melempar giliran ini)</span>
                    </li>
                  </ul>
                </div>

                {/* 2. Rumus Pemain */}
                <div className="bg-white rounded-lg p-3 border border-amber-200/80 shadow-2xs">
                  <span className="font-bold text-slate-900 block mb-1">
                    2. Akurasi Individu (% Akhir)
                  </span>
                  <div className="space-y-1 font-mono text-[11px] bg-slate-50 p-1.5 rounded border border-slate-100">
                    <p className="text-blue-900">
                      % Point = (Berhasil / Total) × 100%
                    </p>
                    <p className="text-rose-900">
                      % Shooting = (Berhasil / Total) × 100%
                    </p>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">
                    Dihitung dari jumlah angka 1 dibagi total lemparan (1 + 0).
                  </p>
                </div>

                {/* 3. Rumus Tim */}
                <div className="bg-white rounded-lg p-3 border border-amber-200/80 shadow-2xs">
                  <span className="font-bold text-slate-900 block mb-1">
                    3. Performa Tim & Skor
                  </span>
                  <div className="space-y-1 font-mono text-[11px] bg-slate-50 p-1.5 rounded border border-slate-100">
                    <p className="text-emerald-900">
                      Team % = (Total Berhasil Tim / Total Throws Tim) × 100%
                    </p>
                    <p className="text-slate-800">
                      Skor Tim = Akumulasi poin per Jack (Target 13)
                    </p>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">
                    Mengukur efektivitas kolektif regu dalam satu pertandingan penuh.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Authentic Excel Spreadsheet Grid + Summary Table */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left / Main Table: Jack Details (xl:col-span-8) */}
        <div className="xl:col-span-8 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="bg-[#FFF2CC] border-b border-amber-300 px-4 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-black text-amber-950 uppercase tracking-wider font-mono">
                DETAIL LEMPARAN PER JACK (END)
              </span>
              <span className="text-[11px] bg-amber-200/80 text-amber-950 px-2.5 py-0.5 rounded-full font-semibold border border-amber-300">
                Pointing: 1 ➔ 0 ➔ Hapus | Shooting: 1 ➔ 1★ (Carreau) ➔ 0 ➔ Hapus | Ubah Jarak Langsung di Header
              </span>
            </div>
            <span className="text-[11px] font-mono text-amber-900 font-bold">
              Match: {match.name}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse select-none">
              <thead>
                {/* Row 1: Jack Numbers & Distances */}
                <tr className="bg-[#FFF2CC] text-amber-950 border-b border-amber-300 font-mono font-bold">
                  <th className="p-2 border-r border-amber-300 min-w-[130px] sticky left-0 bg-[#FFF2CC] z-10">
                    NAMA ATLET
                  </th>
                  {displayedEndNumbers.map((num) => {
                    const endObj = ends.find((e) => e.endNumber === num);
                    const dist = endObj?.distance || '7.5m';
                    return (
                      <th
                        key={`jack-${num}`}
                        colSpan={boulesPerAthlete * 2 + 1}
                        className="p-1.5 text-center border-r border-amber-300 text-[11px] whitespace-nowrap bg-amber-100/60 hover:bg-amber-100 transition-colors"
                      >
                        <div className="font-extrabold text-slate-900">JACK KE {num}</div>
                        <div className="flex items-center justify-center gap-1 mt-0.5">
                          <label htmlFor={`jack-dist-${num}`} className="text-[10px] font-bold text-amber-900">
                            JARAK
                          </label>
                          <select
                            id={`jack-dist-${num}`}
                            value={dist}
                            onChange={(e) => onUpdateEndDistance?.(num, e.target.value as DistanceMeters)}
                            className="bg-white text-slate-900 text-[11px] font-mono font-bold border border-amber-300 rounded px-1.5 py-0.5 shadow-2xs hover:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none cursor-pointer"
                            title={`Ubah jarak Jack Ke-${num} (kinerja pemain berdasar jarak akan otomatis dihitung)`}
                          >
                            {['6m', '6.5m', '7m', '7.5m', '8m', '8.5m', '9m', '9.5m', '10m'].map((d) => (
                              <option key={d} value={d}>
                                {d.replace('m', '')} m
                              </option>
                            ))}
                          </select>
                        </div>
                      </th>
                    );
                  })}
                  <th colSpan={4} className="p-1.5 text-center bg-amber-200/90 text-amber-950 border-r border-amber-300">
                    TOTAL SKOR LEMPARAN
                  </th>
                </tr>

                {/* Row 2: Sub-headers: POINT (P1..Pn) | SHOOTING (S1..Sn) | SKOR */}
                <tr className="bg-amber-100/70 text-amber-900 border-b border-amber-300 text-[10px] font-mono font-bold">
                  <th className="p-1.5 border-r border-amber-300 sticky left-0 bg-amber-100/90 z-10">
                    Kategori
                  </th>
                  {displayedEndNumbers.map((num) => (
                    <React.Fragment key={`sub-${num}`}>
                      {bouleSlots.map((slot) => (
                        <th
                          key={`sub-p-${slot}-${num}`}
                          className="p-1 text-center border-r border-amber-200 bg-blue-50/50 text-blue-900 w-7"
                          title={`Pointing Boule ${slot}`}
                        >
                          P{slot}
                        </th>
                      ))}
                      {bouleSlots.map((slot) => (
                        <th
                          key={`sub-s-${slot}-${num}`}
                          className="p-1 text-center border-r border-amber-200 bg-rose-50/50 text-rose-900 w-7"
                          title={`Shooting Boule ${slot}`}
                        >
                          S{slot}
                        </th>
                      ))}
                      <th className="p-1 text-center border-r border-amber-300 bg-amber-200/60 text-amber-950 font-black w-8">
                        SKOR
                      </th>
                    </React.Fragment>
                  ))}
                  <th className="p-1 text-center border-r border-amber-200 bg-blue-100 text-blue-950 font-bold w-10">
                    PT-OK
                  </th>
                  <th className="p-1 text-center border-r border-amber-200 bg-blue-50 text-blue-900 font-bold w-10">
                    PT-TOT
                  </th>
                  <th className="p-1 text-center border-r border-amber-200 bg-rose-100 text-rose-950 font-bold w-10">
                    SH-OK
                  </th>
                  <th className="p-1 text-center border-r border-amber-300 bg-rose-50 text-rose-900 font-bold w-10">
                    SH-TOT
                  </th>
                </tr>
              </thead>

              <tbody>
                {/* TEAM A SECTION */}
                <tr className="bg-slate-100/80 border-b border-slate-200 font-bold text-slate-700">
                  <td
                    colSpan={1 + displayedEndNumbers.length * (boulesPerAthlete * 2 + 1) + 4}
                    className="p-1.5 px-3 text-[11px] uppercase tracking-wider bg-blue-900 text-white font-bold"
                  >
                    REGU A: {match.teamA.name} ({boulesPerAthlete} Bola/Atlet)
                  </td>
                </tr>

                {teamAPlayers.map((player) => {
                  const pMap = gridMap.get(player.id);
                  const st = performanceStats.playerStatsMap.get(player.id);

                  return (
                    <tr
                      key={player.id}
                      className="border-b border-slate-200 hover:bg-amber-50/40 transition-colors font-mono"
                    >
                      {/* Player Name */}
                      <td className="p-2 font-bold text-slate-900 border-r border-slate-200 sticky left-0 bg-white z-10">
                        <div className="flex items-center justify-between gap-1">
                          <span className="truncate">{player.name}</span>
                          <span className="text-[9px] text-blue-700 bg-blue-50 px-1 rounded font-normal">
                            {player.role || 'Player'}
                          </span>
                        </div>
                      </td>

                      {/* Each Jack Columns */}
                      {displayedEndNumbers.map((num) => {
                        const cell = pMap?.get(num) || {};
                        const endObj = ends.find((e) => e.endNumber === num);
                        const runningScore = endObj?.runningScoreA ?? (endObj ? endObj.scoreA : '-');

                        return (
                          <React.Fragment key={`cell-${player.id}-${num}`}>
                            {/* Pointing Slots (P1, P2, and optional P3) */}
                            {bouleSlots.map((slot) => {
                              const val = slot === 1 ? cell.p1 : slot === 2 ? cell.p2 : cell.p3;
                              const actionId =
                                slot === 1 ? cell.p1ActionId : slot === 2 ? cell.p2ActionId : cell.p3ActionId;

                              return (
                                <td
                                  key={`point-${slot}-${player.id}-${num}`}
                                  onClick={() =>
                                    handleCellClick(
                                      player.id,
                                      player.name,
                                      player.teamId,
                                      num,
                                      'POINTING',
                                      slot,
                                      val,
                                      actionId
                                    )
                                  }
                                  className={`p-1 text-center border-r border-slate-200 cursor-pointer text-[11px] font-bold transition-colors ${
                                    val === 1
                                      ? 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200'
                                      : val === 0
                                      ? 'bg-rose-100/70 text-rose-900 hover:bg-rose-200'
                                      : 'text-slate-300 hover:bg-slate-100'
                                  }`}
                                  title={`Point ${slot} - ${player.name} (Jack ${num})`}
                                >
                                  {val !== undefined ? val : ''}
                                </td>
                              );
                            })}

                            {/* Shooting Slots (S1, S2, and optional S3) */}
                            {bouleSlots.map((slot) => {
                              const val = slot === 1 ? cell.s1 : slot === 2 ? cell.s2 : cell.s3;
                              const actionId =
                                slot === 1 ? cell.s1ActionId : slot === 2 ? cell.s2ActionId : cell.s3ActionId;
                              const isCarreau =
                                slot === 1 ? cell.s1Carreau : slot === 2 ? cell.s2Carreau : cell.s3Carreau;

                              return (
                                <td
                                  key={`shoot-${slot}-${player.id}-${num}`}
                                  onClick={() =>
                                    handleCellClick(
                                      player.id,
                                      player.name,
                                      player.teamId,
                                      num,
                                      'SHOOTING',
                                      slot,
                                      val,
                                      actionId,
                                      isCarreau
                                    )
                                  }
                                  className={`p-1 text-center border-r border-slate-200 cursor-pointer text-[11px] font-bold transition-colors select-none ${
                                    val === 1
                                      ? isCarreau
                                        ? 'bg-amber-300 text-amber-950 font-black hover:bg-amber-400 border border-amber-400 ring-1 ring-amber-400'
                                        : 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200'
                                      : val === 0
                                      ? 'bg-rose-100/70 text-rose-900 hover:bg-rose-200'
                                      : 'text-slate-300 hover:bg-slate-100'
                                  }`}
                                  title={
                                    val === 1
                                      ? isCarreau
                                        ? `Shooting ${slot} - ${player.name} (Jack ${num}): 1★ CARREAU (Boule Pengganti). Klik untuk ubah jadi 0 (Gagal).`
                                        : `Shooting ${slot} - ${player.name} (Jack ${num}): 1 (Hit Biasa). Klik untuk ubah jadi 1★ (Carreau).`
                                      : val === 0
                                      ? `Shooting ${slot} - ${player.name} (Jack ${num}): 0 (Gagal). Klik untuk hapus.`
                                      : `Klik untuk isi Shooting ${slot}: 1 (Hit) ➔ 1★ (Carreau) ➔ 0 (Gagal)`
                                  }
                                >
                                  {val === 1 ? (
                                    isCarreau ? (
                                      <span className="inline-flex items-center justify-center font-black">
                                        1<span className="text-[10px] text-amber-900 ml-0.5">★</span>
                                      </span>
                                    ) : (
                                      '1'
                                    )
                                  ) : val === 0 ? (
                                    '0'
                                  ) : (
                                    ''
                                  )}
                                </td>
                              );
                            })}

                            {/* SKOR (Running Score for Jack) */}
                            <td className="p-1 text-center border-r border-amber-200 bg-amber-50/60 font-black text-slate-800 text-[11px]">
                              {runningScore}
                            </td>
                          </React.Fragment>
                        );
                      })}

                      {/* Recap Columns for Player */}
                      <td className="p-1.5 text-center border-r border-slate-200 bg-blue-50/60 font-black text-blue-900">
                        {st?.pointSuccess ?? 0}
                      </td>
                      <td className="p-1.5 text-center border-r border-slate-200 bg-blue-50/30 text-slate-700">
                        {st?.pointTotal ?? 0}
                      </td>
                      <td className="p-1.5 text-center border-r border-slate-200 bg-rose-50/60 font-black text-rose-900">
                        {st?.shootingSuccess ?? 0}
                      </td>
                      <td className="p-1.5 text-center border-r border-slate-200 bg-rose-50/30 text-slate-700">
                        {st?.shootingTotal ?? 0}
                      </td>
                    </tr>
                  );
                })}

                {/* TEAM B SECTION */}
                <tr className="bg-slate-100/80 border-b border-slate-200 font-bold text-slate-700">
                  <td
                    colSpan={1 + displayedEndNumbers.length * (boulesPerAthlete * 2 + 1) + 4}
                    className="p-1.5 px-3 text-[11px] uppercase tracking-wider bg-rose-900 text-white font-bold"
                  >
                    REGU B: {match.teamB.name} ({boulesPerAthlete} Bola/Atlet)
                  </td>
                </tr>

                {teamBPlayers.map((player) => {
                  const pMap = gridMap.get(player.id);
                  const st = performanceStats.playerStatsMap.get(player.id);

                  return (
                    <tr
                      key={player.id}
                      className="border-b border-slate-200 hover:bg-amber-50/40 transition-colors font-mono"
                    >
                      {/* Player Name */}
                      <td className="p-2 font-bold text-slate-900 border-r border-slate-200 sticky left-0 bg-white z-10">
                        <div className="flex items-center justify-between gap-1">
                          <span className="truncate">{player.name}</span>
                          <span className="text-[9px] text-rose-700 bg-rose-50 px-1 rounded font-normal">
                            {player.role || 'Player'}
                          </span>
                        </div>
                      </td>

                      {/* Each Jack Columns */}
                      {displayedEndNumbers.map((num) => {
                        const cell = pMap?.get(num) || {};
                        const endObj = ends.find((e) => e.endNumber === num);
                        const runningScore = endObj?.runningScoreB ?? (endObj ? endObj.scoreB : '-');

                        return (
                          <React.Fragment key={`cell-${player.id}-${num}`}>
                            {/* Pointing Slots (P1, P2, and optional P3) */}
                            {bouleSlots.map((slot) => {
                              const val = slot === 1 ? cell.p1 : slot === 2 ? cell.p2 : cell.p3;
                              const actionId =
                                slot === 1 ? cell.p1ActionId : slot === 2 ? cell.p2ActionId : cell.p3ActionId;

                              return (
                                <td
                                  key={`point-${slot}-${player.id}-${num}`}
                                  onClick={() =>
                                    handleCellClick(
                                      player.id,
                                      player.name,
                                      player.teamId,
                                      num,
                                      'POINTING',
                                      slot,
                                      val,
                                      actionId
                                    )
                                  }
                                  className={`p-1 text-center border-r border-slate-200 cursor-pointer text-[11px] font-bold transition-colors ${
                                    val === 1
                                      ? 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200'
                                      : val === 0
                                      ? 'bg-rose-100/70 text-rose-900 hover:bg-rose-200'
                                      : 'text-slate-300 hover:bg-slate-100'
                                  }`}
                                  title={`Point ${slot} - ${player.name} (Jack ${num})`}
                                >
                                  {val !== undefined ? val : ''}
                                </td>
                              );
                            })}

                            {/* Shooting Slots (S1, S2, and optional S3) */}
                            {bouleSlots.map((slot) => {
                              const val = slot === 1 ? cell.s1 : slot === 2 ? cell.s2 : cell.s3;
                              const actionId =
                                slot === 1 ? cell.s1ActionId : slot === 2 ? cell.s2ActionId : cell.s3ActionId;
                              const isCarreau =
                                slot === 1 ? cell.s1Carreau : slot === 2 ? cell.s2Carreau : cell.s3Carreau;

                              return (
                                <td
                                  key={`shoot-${slot}-${player.id}-${num}`}
                                  onClick={() =>
                                    handleCellClick(
                                      player.id,
                                      player.name,
                                      player.teamId,
                                      num,
                                      'SHOOTING',
                                      slot,
                                      val,
                                      actionId,
                                      isCarreau
                                    )
                                  }
                                  className={`p-1 text-center border-r border-slate-200 cursor-pointer text-[11px] font-bold transition-colors select-none ${
                                    val === 1
                                      ? isCarreau
                                        ? 'bg-amber-300 text-amber-950 font-black hover:bg-amber-400 border border-amber-400 ring-1 ring-amber-400'
                                        : 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200'
                                      : val === 0
                                      ? 'bg-rose-100/70 text-rose-900 hover:bg-rose-200'
                                      : 'text-slate-300 hover:bg-slate-100'
                                  }`}
                                  title={
                                    val === 1
                                      ? isCarreau
                                        ? `Shooting ${slot} - ${player.name} (Jack ${num}): 1★ CARREAU (Boule Pengganti). Klik untuk ubah jadi 0 (Gagal).`
                                        : `Shooting ${slot} - ${player.name} (Jack ${num}): 1 (Hit Biasa). Klik untuk ubah jadi 1★ (Carreau).`
                                      : val === 0
                                      ? `Shooting ${slot} - ${player.name} (Jack ${num}): 0 (Gagal). Klik untuk hapus.`
                                      : `Klik untuk isi Shooting ${slot}: 1 (Hit) ➔ 1★ (Carreau) ➔ 0 (Gagal)`
                                  }
                                >
                                  {val === 1 ? (
                                    isCarreau ? (
                                      <span className="inline-flex items-center justify-center font-black">
                                        1<span className="text-[10px] text-amber-900 ml-0.5">★</span>
                                      </span>
                                    ) : (
                                      '1'
                                    )
                                  ) : val === 0 ? (
                                    '0'
                                  ) : (
                                    ''
                                  )}
                                </td>
                              );
                            })}

                            {/* SKOR */}
                            <td className="p-1 text-center border-r border-amber-200 bg-amber-50/60 font-black text-slate-800 text-[11px]">
                              {runningScore}
                            </td>
                          </React.Fragment>
                        );
                      })}

                      {/* Recap Columns for Player */}
                      <td className="p-1.5 text-center border-r border-slate-200 bg-blue-50/60 font-black text-blue-900">
                        {st?.pointSuccess ?? 0}
                      </td>
                      <td className="p-1.5 text-center border-r border-slate-200 bg-blue-50/30 text-slate-700">
                        {st?.pointTotal ?? 0}
                      </td>
                      <td className="p-1.5 text-center border-r border-slate-200 bg-rose-50/60 font-black text-rose-900">
                        {st?.shootingSuccess ?? 0}
                      </td>
                      <td className="p-1.5 text-center border-r border-slate-200 bg-rose-50/30 text-slate-700">
                        {st?.shootingTotal ?? 0}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Table: Summary Performance Table (xl:col-span-4) */}
        {/* Exactly matches user's right table: GAMES 2 ; PERFORMA MIXED TRIPLE */}
        <div className="xl:col-span-4 bg-white rounded-xl border-2 border-amber-400 shadow-sm overflow-hidden">
          <div className="bg-[#FFF2CC] border-b-2 border-amber-400 p-3 text-center">
            <h3 className="text-xs font-black text-amber-950 uppercase tracking-tight font-['Outfit']">
              {match.name || 'GAMES 2 ; PERFORMA MIXED TRIPLE'}
            </h3>
            <p className="text-[10px] text-amber-800 font-mono mt-0.5 font-bold">
              TABEL PRESENTASE AKHIR & PERFORMA TEAM
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-center border-collapse">
              <thead>
                {/* Header 1 */}
                <tr className="bg-[#FFF2CC] border-b border-amber-300 font-bold text-amber-950 text-[11px]">
                  <th rowSpan={2} className="p-2 border-r border-amber-300 text-left min-w-[80px]">
                    NAME
                  </th>
                  <th colSpan={6} className="p-1 border-r border-amber-300 bg-amber-200/80">
                    PRESENTASE AKHIR
                  </th>
                  <th colSpan={2} className="p-1 border-r border-amber-300 bg-emerald-100 text-emerald-950">
                    PERFORMA TEAM
                  </th>
                  <th rowSpan={2} className="p-1 border-r border-amber-300 bg-amber-100 text-amber-950 font-black text-[10px]" title="Standar Analisis Medali by Rasyono (UNP)">
                    MEDALI (RASYONO)
                  </th>
                  <th rowSpan={2} className="p-2 bg-amber-300 text-amber-950 font-black w-12">
                    SKOR
                  </th>
                </tr>

                {/* Header 2 */}
                <tr className="bg-amber-100/80 border-b border-amber-300 font-mono text-[10px] text-amber-900">
                  {/* Point */}
                  <th className="p-1 border-r border-amber-200 bg-blue-50 text-blue-900 font-bold">
                    BERHASIL
                  </th>
                  <th className="p-1 border-r border-amber-200 bg-blue-50 text-blue-900 font-bold">
                    TOTAL
                  </th>
                  <th className="p-1 border-r border-amber-300 bg-blue-100 text-blue-950 font-black">
                    %
                  </th>
                  {/* Shooting */}
                  <th className="p-1 border-r border-amber-200 bg-rose-50 text-rose-900 font-bold">
                    BERHASIL
                  </th>
                  <th className="p-1 border-r border-amber-200 bg-rose-50 text-rose-900 font-bold">
                    TOTAL
                  </th>
                  <th className="p-1 border-r border-amber-300 bg-rose-100 text-rose-950 font-black">
                    %
                  </th>
                  {/* Team Point & Shooting */}
                  <th className="p-1 border-r border-amber-200 bg-emerald-50 text-emerald-950 font-bold">
                    POINT %
                  </th>
                  <th className="p-1 border-r border-amber-300 bg-emerald-50 text-emerald-950 font-bold">
                    SHOOT %
                  </th>
                </tr>
              </thead>

              <tbody className="font-mono text-[11px]">
                {/* Team A Players */}
                {teamAPlayers.map((p, idx) => {
                  const st = performanceStats.playerStatsMap.get(p.id);
                  const isFirst = idx === 0;

                  return (
                    <tr key={p.id} className="border-b border-slate-200 hover:bg-slate-50">
                      {/* Name */}
                      <td className="p-2 text-left font-bold text-slate-900 border-r border-slate-200">
                        {p.name}
                      </td>

                      {/* Point: Berhasil, Total, % */}
                      <td className="p-1 border-r border-slate-200 text-slate-800">
                        {st?.pointSuccess ?? 0}
                      </td>
                      <td className="p-1 border-r border-slate-200 text-slate-600">
                        {st?.pointTotal ?? 0}
                      </td>
                      <td className="p-1 border-r border-slate-300 bg-blue-50/50 font-black text-blue-900">
                        {st?.pointPct !== null && st?.pointPct !== undefined ? (
                          st.pointPct
                        ) : (
                          <span className="text-slate-400 font-normal text-[10px]">#DIV/0!</span>
                        )}
                      </td>

                      {/* Shooting: Berhasil, Total, % */}
                      <td className="p-1 border-r border-slate-200 text-slate-800">
                        {st?.shootingSuccess ?? 0}
                      </td>
                      <td className="p-1 border-r border-slate-200 text-slate-600">
                        {st?.shootingTotal ?? 0}
                      </td>
                      <td className="p-1 border-r border-slate-300 bg-rose-50/50 font-black text-rose-900">
                        {st?.shootingPct !== null && st?.shootingPct !== undefined ? (
                          st.shootingPct
                        ) : (
                          <span className="text-slate-400 font-normal text-[10px]">#DIV/0!</span>
                        )}
                      </td>

                      {/* Team A Point % (span 3 rows) */}
                      {isFirst && (
                        <td
                          rowSpan={teamAPlayers.length}
                          className="p-1 border-r border-slate-200 bg-emerald-50 font-black text-emerald-900 text-xs align-middle"
                        >
                          {performanceStats.teamA.pointPct !== null
                            ? performanceStats.teamA.pointPct
                            : '-'}
                        </td>
                      )}

                      {/* Team A Shooting % (span 3 rows) */}
                      {isFirst && (
                        <td
                          rowSpan={teamAPlayers.length}
                          className="p-1 border-r border-slate-300 bg-emerald-50 font-black text-emerald-900 text-xs align-middle"
                        >
                          {performanceStats.teamA.shootingPct !== null
                            ? performanceStats.teamA.shootingPct
                            : '-'}
                        </td>
                      )}

                      {/* Standar Medali Rasyono (Individual Player) */}
                      {(() => {
                        const totSucc = (st?.pointSuccess ?? 0) + (st?.shootingSuccess ?? 0);
                        const totThrows = (st?.pointTotal ?? 0) + (st?.shootingTotal ?? 0);
                        const pPct = totThrows > 0 ? Math.round((totSucc / totThrows) * 1000) / 10 : null;
                        const pTier = getRasyonoTier(pPct);

                        return (
                          <td className="p-1 border-r border-amber-200 bg-amber-50/30 text-center align-middle">
                            {pPct !== null ? (
                              <div className="flex flex-col items-center justify-center gap-0.5">
                                <span
                                  className={`inline-flex items-center gap-1 text-[10px] font-black px-1.5 py-0.5 rounded border ${pTier.badgeBg} ${pTier.badgeText} ${pTier.badgeBorder}`}
                                  title={`${pTier.fullLabel} (${pTier.range})`}
                                >
                                  <span>{pTier.icon}</span>
                                  <span>{pTier.medali}</span>
                                </span>
                                <span className="text-[9px] font-mono font-bold text-slate-500">
                                  {pPct}%
                                </span>
                              </div>
                            ) : (
                              <span className="text-slate-300 text-[10px]">-</span>
                            )}
                          </td>
                        );
                      })()}

                      {/* Team A Score (span 3 rows) */}
                      {isFirst && (
                        <td
                          rowSpan={teamAPlayers.length}
                          className={`p-1 font-black text-lg align-middle ${
                            match.scoreA > match.scoreB
                              ? 'bg-emerald-500 text-white'
                              : 'bg-white text-slate-900'
                          }`}
                        >
                          {match.scoreA}
                        </td>
                      )}
                    </tr>
                  );
                })}

                {/* Team B Players */}
                {teamBPlayers.map((p, idx) => {
                  const st = performanceStats.playerStatsMap.get(p.id);
                  const isFirst = idx === 0;

                  return (
                    <tr key={p.id} className="border-b border-slate-200 hover:bg-slate-50">
                      {/* Name */}
                      <td className="p-2 text-left font-bold text-slate-900 border-r border-slate-200">
                        {p.name}
                      </td>

                      {/* Point: Berhasil, Total, % */}
                      <td className="p-1 border-r border-slate-200 text-slate-800">
                        {st?.pointSuccess ?? 0}
                      </td>
                      <td className="p-1 border-r border-slate-200 text-slate-600">
                        {st?.pointTotal ?? 0}
                      </td>
                      <td className="p-1 border-r border-slate-300 bg-blue-50/50 font-black text-blue-900">
                        {st?.pointPct !== null && st?.pointPct !== undefined ? (
                          st.pointPct
                        ) : (
                          <span className="text-slate-400 font-normal text-[10px]">#DIV/0!</span>
                        )}
                      </td>

                      {/* Shooting: Berhasil, Total, % */}
                      <td className="p-1 border-r border-slate-200 text-slate-800">
                        {st?.shootingSuccess ?? 0}
                      </td>
                      <td className="p-1 border-r border-slate-200 text-slate-600">
                        {st?.shootingTotal ?? 0}
                      </td>
                      <td className="p-1 border-r border-slate-300 bg-rose-50/50 font-black text-rose-900">
                        {st?.shootingPct !== null && st?.shootingPct !== undefined ? (
                          st.shootingPct
                        ) : (
                          <span className="text-slate-400 font-normal text-[10px]">#DIV/0!</span>
                        )}
                      </td>

                      {/* Team B Point % (span 3 rows) */}
                      {isFirst && (
                        <td
                          rowSpan={teamBPlayers.length}
                          className="p-1 border-r border-slate-200 bg-emerald-50 font-black text-emerald-900 text-xs align-middle"
                        >
                          {performanceStats.teamB.pointPct !== null
                            ? performanceStats.teamB.pointPct
                            : '-'}
                        </td>
                      )}

                      {/* Team B Shooting % (span 3 rows) */}
                      {isFirst && (
                        <td
                          rowSpan={teamBPlayers.length}
                          className="p-1 border-r border-slate-300 bg-emerald-50 font-black text-emerald-900 text-xs align-middle"
                        >
                          {performanceStats.teamB.shootingPct !== null
                            ? performanceStats.teamB.shootingPct
                            : '-'}
                        </td>
                      )}

                      {/* Standar Medali Rasyono (Individual Player) */}
                      {(() => {
                        const totSucc = (st?.pointSuccess ?? 0) + (st?.shootingSuccess ?? 0);
                        const totThrows = (st?.pointTotal ?? 0) + (st?.shootingTotal ?? 0);
                        const pPct = totThrows > 0 ? Math.round((totSucc / totThrows) * 1000) / 10 : null;
                        const pTier = getRasyonoTier(pPct);

                        return (
                          <td className="p-1 border-r border-amber-200 bg-amber-50/30 text-center align-middle">
                            {pPct !== null ? (
                              <div className="flex flex-col items-center justify-center gap-0.5">
                                <span
                                  className={`inline-flex items-center gap-1 text-[10px] font-black px-1.5 py-0.5 rounded border ${pTier.badgeBg} ${pTier.badgeText} ${pTier.badgeBorder}`}
                                  title={`${pTier.fullLabel} (${pTier.range})`}
                                >
                                  <span>{pTier.icon}</span>
                                  <span>{pTier.medali}</span>
                                </span>
                                <span className="text-[9px] font-mono font-bold text-slate-500">
                                  {pPct}%
                                </span>
                              </div>
                            ) : (
                              <span className="text-slate-300 text-[10px]">-</span>
                            )}
                          </td>
                        );
                      })()}

                      {/* Team B Score (span 3 rows) */}
                      {isFirst && (
                        <td
                          rowSpan={teamBPlayers.length}
                          className={`p-1 font-black text-lg align-middle ${
                            match.scoreB > match.scoreA
                              ? 'bg-emerald-600 text-white'
                              : 'bg-white text-slate-900'
                          }`}
                        >
                          {match.scoreB}
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Quick Summary Footnote */}
          <div className="bg-slate-50 border-t border-slate-200 p-3 text-[11px] text-slate-600 space-y-1">
            <div className="flex items-center justify-between font-bold text-slate-900">
              <span>Hasil Akhir Pertandingan:</span>
              <span className="text-emerald-700 font-mono text-xs">
                {match.scoreA > match.scoreB
                  ? `${match.teamA.name} MENANG (${match.scoreA} - ${match.scoreB})`
                  : match.scoreB > match.scoreA
                  ? `${match.teamB.name} MENANG (${match.scoreB} - ${match.scoreA})`
                  : `SERI (${match.scoreA} - ${match.scoreB})`}
              </span>
            </div>
            <p className="text-[10px] text-slate-500">
              * Performa Team dihitung dari akumulasi berhasil regu dibagi total lemparan regu.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Standar Analisis Performa & Kesimpulan Per Pemain (Disertasi Rasyono - UNP) */}
      <div className="pt-2">
        <RasyonoPlayerConclusion
          match={match}
          playerStatsMap={performanceStats.playerStatsMap}
        />
      </div>
    </div>
  );
}
