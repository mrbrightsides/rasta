import { useState, useEffect, useId, useRef, ChangeEvent } from 'react';
import {
  PrecisionFigureId,
  PrecisionDistanceMeter,
  PrecisionScoreValue,
  PrecisionRoundStage,
  PrecisionSheetData,
} from '../types';
import {
  PRECISION_FIGURES,
  PRECISION_DISTANCES,
  evaluatePrecisionShootingScore,
} from '../lib/rasyonoStandards';
import {
  Target,
  Trophy,
  Printer,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  Info,
  ChevronRight,
  TrendingUp,
  User,
  MapPin,
  Calendar,
  Layers,
  Award,
  PenTool,
  HardDrive,
  Save,
  Download,
  Upload,
  Trash2,
  CopyPlus,
} from 'lucide-react';

const STORAGE_KEY = 'rasta_precision_shooting_sheets_v1';
const ACTIVE_SHEET_KEY = 'rasta_precision_shooting_active_id_v1';

// Initial preloaded sheet with an elite athlete simulation
const DEFAULT_SHEET: PrecisionSheetData = {
  id: 'prec-demo-01',
  athleteName: 'Heri (Indonesia)',
  kabKota: 'Palembang / Timnas Indonesia',
  line: 'Line 2',
  date: new Date().toISOString().split('T')[0],
  eventName: 'Kejurnas & Seleksi Pelatnas SEA Games 2026',
  stage: 'Qualification',
  scores: {
    'fig1_6.5m': 5,
    'fig1_7.5m': 5,
    'fig1_8.5m': 3,
    'fig1_9.5m': 3, // Fig 1 = 16

    'fig2_6.5m': 3,
    'fig2_7.5m': 3,
    'fig2_8.5m': 1,
    'fig2_9.5m': 3, // Fig 2 = 10

    'fig3_6.5m': 5,
    'fig3_7.5m': 3,
    'fig3_8.5m': 3,
    'fig3_9.5m': 1, // Fig 3 = 12

    'fig4_6.5m': 3,
    'fig4_7.5m': 3,
    'fig4_8.5m': 0,
    'fig4_9.5m': 3, // Fig 4 = 9

    'fig5_6.5m': 5,
    'fig5_7.5m': 0,
    'fig5_8.5m': 0,
    'fig5_9.5m': 0, // Fig 5 = 5  -> Total = 52 (86.7% Perak)
  },
  refereeSign: 'Wasit Nasional FOPI (Drs. Rasyono, M.Pd)',
  athleteSign: 'Heri',
  notes: 'Tembakan Figure 1 sangat dominan. Perlu drill tambahan di Figure 5 (Jack) jarak 7.5m - 9.5m.',
  createdAt: new Date().toISOString(),
};

export default function PrecisionShooting() {
  const lineInputId = useId();
  const kabKotaInputId = useId();
  const athleteNameInputId = useId();
  const dateInputId = useId();
  const eventNameInputId = useId();
  const stageSelectId = useId();
  const refereeSignInputId = useId();
  const athleteSignInputId = useId();
  const sheetSelectId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load sheets from storage or fallback
  const [sheets, setSheets] = useState<PrecisionSheetData[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed reading precision sheets from localStorage:', e);
    }
    return [DEFAULT_SHEET];
  });

  const [currentSheetId, setCurrentSheetId] = useState<string>(() => {
    try {
      const savedId = localStorage.getItem(ACTIVE_SHEET_KEY);
      if (savedId) return savedId;
    } catch {
      // ignore
    }
    return DEFAULT_SHEET.id;
  });

  const [copied, setCopied] = useState<boolean>(false);
  const [lastSaved, setLastSaved] = useState<string>('Baru saja');
  const [storageStatusMsg, setStorageStatusMsg] = useState<string>('');

  // Active selected cell for rapid entry keyboard/click
  const [activeCell, setActiveCell] = useState<{
    figId: PrecisionFigureId;
    dist: PrecisionDistanceMeter;
  }>({
    figId: 'fig1',
    dist: '6.5m',
  });

  // Current sheet object
  const currentSheet =
    sheets.find((s) => s.id === currentSheetId) || sheets[0] || DEFAULT_SHEET;

  // Save sheets changes to localStorage immediately
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sheets));
      localStorage.setItem(ACTIVE_SHEET_KEY, currentSheetId);
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setLastSaved(timeStr);
    } catch (e) {
      console.error('Failed saving precision sheets to localStorage:', e);
    }
  }, [sheets, currentSheetId]);

  // Update specific field in current sheet
  const updateCurrentSheet = (updates: Partial<PrecisionSheetData>) => {
    setSheets((prev) =>
      prev.map((s) => (s.id === currentSheet.id ? { ...s, ...updates } : s))
    );
  };

  // Set score for a specific figure & distance
  const setScore = (
    figId: PrecisionFigureId,
    dist: PrecisionDistanceMeter,
    value: PrecisionScoreValue | null
  ) => {
    const key = `${figId}_${dist}`;
    const newScores = { ...currentSheet.scores, [key]: value };
    updateCurrentSheet({ scores: newScores });

    // Auto advance to next cell if score was set
    if (value !== null) {
      autoAdvanceCell(figId, dist);
    }
  };

  // Advance to next distance or next figure
  const autoAdvanceCell = (
    figId: PrecisionFigureId,
    dist: PrecisionDistanceMeter
  ) => {
    const distIdx = PRECISION_DISTANCES.indexOf(dist);
    if (distIdx < PRECISION_DISTANCES.length - 1) {
      setActiveCell({ figId, dist: PRECISION_DISTANCES[distIdx + 1] });
    } else {
      const figIdx = PRECISION_FIGURES.findIndex((f) => f.id === figId);
      if (figIdx < PRECISION_FIGURES.length - 1) {
        setActiveCell({
          figId: PRECISION_FIGURES[figIdx + 1].id,
          dist: PRECISION_DISTANCES[0],
        });
      }
    }
  };

  // Preset quick fill simulations based on dissertation slides
  const applyPreset = (preset: 'GOLD' | 'SILVER' | 'BRONZE' | 'CLEAR') => {
    if (preset === 'CLEAR') {
      updateCurrentSheet({ scores: {} });
      setActiveCell({ figId: 'fig1', dist: '6.5m' });
      return;
    }

    const newScores: Record<string, PrecisionScoreValue> = {};

    if (preset === 'GOLD') {
      // 54 Points (90% Realistis): e.g. 6 Carreau (30p), 8 Succeeded (24p), 6 Missed (0p) = 54
      newScores['fig1_6.5m'] = 5;
      newScores['fig1_7.5m'] = 5;
      newScores['fig1_8.5m'] = 5;
      newScores['fig1_9.5m'] = 3; // 18
      newScores['fig2_6.5m'] = 5;
      newScores['fig2_7.5m'] = 3;
      newScores['fig2_8.5m'] = 3;
      newScores['fig2_9.5m'] = 3; // 14
      newScores['fig3_6.5m'] = 5;
      newScores['fig3_7.5m'] = 3;
      newScores['fig3_8.5m'] = 3;
      newScores['fig3_9.5m'] = 0; // 11
      newScores['fig4_6.5m'] = 3;
      newScores['fig4_7.5m'] = 3;
      newScores['fig4_8.5m'] = 0;
      newScores['fig4_9.5m'] = 0; // 6
      newScores['fig5_6.5m'] = 5;
      newScores['fig5_7.5m'] = 0;
      newScores['fig5_8.5m'] = 0;
      newScores['fig5_9.5m'] = 0; // 5 -> Total 54
    } else if (preset === 'SILVER') {
      // 48 Points (80% Realistis): Perak dipastikan
      newScores['fig1_6.5m'] = 5;
      newScores['fig1_7.5m'] = 5;
      newScores['fig1_8.5m'] = 3;
      newScores['fig1_9.5m'] = 3; // 16
      newScores['fig2_6.5m'] = 3;
      newScores['fig2_7.5m'] = 3;
      newScores['fig2_8.5m'] = 3;
      newScores['fig2_9.5m'] = 0; // 9
      newScores['fig3_6.5m'] = 5;
      newScores['fig3_7.5m'] = 3;
      newScores['fig3_8.5m'] = 3;
      newScores['fig3_9.5m'] = 1; // 12
      newScores['fig4_6.5m'] = 3;
      newScores['fig4_7.5m'] = 3;
      newScores['fig4_8.5m'] = 0;
      newScores['fig4_9.5m'] = 0; // 6
      newScores['fig5_6.5m'] = 5;
      newScores['fig5_7.5m'] = 0;
      newScores['fig5_8.5m'] = 0;
      newScores['fig5_9.5m'] = 0; // 5 -> Total 48
    } else if (preset === 'BRONZE') {
      // 42 Points (70% Realistis): Perunggu
      newScores['fig1_6.5m'] = 5;
      newScores['fig1_7.5m'] = 3;
      newScores['fig1_8.5m'] = 3;
      newScores['fig1_9.5m'] = 3; // 14
      newScores['fig2_6.5m'] = 3;
      newScores['fig2_7.5m'] = 3;
      newScores['fig2_8.5m'] = 0;
      newScores['fig2_9.5m'] = 0; // 6
      newScores['fig3_6.5m'] = 3;
      newScores['fig3_7.5m'] = 3;
      newScores['fig3_8.5m'] = 3;
      newScores['fig3_9.5m'] = 1; // 10
      newScores['fig4_6.5m'] = 3;
      newScores['fig4_7.5m'] = 3;
      newScores['fig4_8.5m'] = 0;
      newScores['fig4_9.5m'] = 0; // 6
      newScores['fig5_6.5m'] = 5;
      newScores['fig5_7.5m'] = 1;
      newScores['fig5_8.5m'] = 0;
      newScores['fig5_9.5m'] = 0; // 6 -> Total 42
    }

    updateCurrentSheet({ scores: newScores });
  };

  // Calculate totals per figure
  const figureTotals: Record<PrecisionFigureId, number> = {
    fig1: 0,
    fig2: 0,
    fig3: 0,
    fig4: 0,
    fig5: 0,
  };

  // Calculate totals per distance
  const distanceTotals: Record<PrecisionDistanceMeter, number> = {
    '6.5m': 0,
    '7.5m': 0,
    '8.5m': 0,
    '9.5m': 0,
  };

  let grandTotal = 0;
  let throwsCount = 0;
  let carreauCount = 0;
  let frappeCount = 0;
  let touchedCount = 0;
  let missedCount = 0;

  PRECISION_FIGURES.forEach((fig) => {
    let figSum = 0;
    PRECISION_DISTANCES.forEach((dist) => {
      const val = currentSheet.scores[`${fig.id}_${dist}`];
      if (typeof val === 'number') {
        figSum += val;
        distanceTotals[dist] += val;
        grandTotal += val;
        throwsCount++;
        if (val === 5) carreauCount++;
        else if (val === 3) frappeCount++;
        else if (val === 1) touchedCount++;
        else if (val === 0) missedCount++;
      }
    });
    figureTotals[fig.id] = figSum;
  });

  // Evaluate performance using Rasyo's dissertation standards
  const evaluation = evaluatePrecisionShootingScore(grandTotal, throwsCount);

  // Copy textual summary to clipboard
  const handleCopyText = () => {
    const text = `===========================================
LEMBAR SKOR RESMI PRECISION SHOOTING PETANQUE
(Rasyo Technology Analysis Petanque - Disertasi UNP)
===========================================
Atlet      : ${currentSheet.athleteName}
Kab/Kota   : ${currentSheet.kabKota}
Line       : ${currentSheet.line}
Tanggal    : ${currentSheet.date}
Event      : ${currentSheet.eventName}
Babak      : ${currentSheet.stage}

HASIL PER STATION (FIGURE 1 - 5):
- Figure 1 (Boule Alone)          : ${figureTotals.fig1} Poin
- Figure 2 (Boule Behind Jack)    : ${figureTotals.fig2} Poin
- Figure 3 (Between Two Boules)   : ${figureTotals.fig3} Poin
- Figure 4 (Jump)                 : ${figureTotals.fig4} Poin
- Figure 5 (Jack)                 : ${figureTotals.fig5} Poin

TOTAL SKOR SELURUH STATION: ${grandTotal} Poin (Maks. Teoretis: 100)
PERSENTASE STANDAR REALISTIS (Base 60): ${evaluation.percentageRealistic}%
PREDIKSI MEDALI SEA GAMES : ${evaluation.medalEstimate} (${evaluation.seaGamesVerdict})
CATATAN PELATIH:
${evaluation.coachingRecommendation}
===========================================`;

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleCreateNewSheet = () => {
    const newSheet: PrecisionSheetData = {
      id: `prec-${Date.now()}`,
      athleteName: 'Atlet Baru',
      kabKota: 'Kota / Daerah',
      line: 'Line 1',
      date: new Date().toISOString().split('T')[0],
      eventName: currentSheet.eventName || 'Kejuaraan Petanque 2026',
      stage: 'Qualification',
      scores: {},
      refereeSign: '',
      athleteSign: '',
      createdAt: new Date().toISOString(),
    };
    const updated = [newSheet, ...sheets];
    setSheets(updated);
    setCurrentSheetId(newSheet.id);
    setStorageStatusMsg('Lembar baru dibuat dan tersimpan di LocalStorage');
    setTimeout(() => setStorageStatusMsg(''), 3000);
  };

  const handleDuplicateSheet = () => {
    const dupSheet: PrecisionSheetData = {
      ...currentSheet,
      id: `prec-${Date.now()}`,
      athleteName: `${currentSheet.athleteName} (Salinan)`,
      createdAt: new Date().toISOString(),
    };
    const updated = [dupSheet, ...sheets];
    setSheets(updated);
    setCurrentSheetId(dupSheet.id);
    setStorageStatusMsg('Lembar berhasil digandakan ke LocalStorage');
    setTimeout(() => setStorageStatusMsg(''), 3000);
  };

  const handleDeleteSheet = () => {
    if (sheets.length <= 1) {
      if (window.confirm('Hanya tersisa 1 lembar. Reset lembar ini menjadi kosong?')) {
        updateCurrentSheet({ scores: {}, athleteName: 'Atlet Baru' });
        setStorageStatusMsg('Lembar dikosongkan di LocalStorage');
        setTimeout(() => setStorageStatusMsg(''), 3000);
      }
      return;
    }

    if (window.confirm(`Hapus lembar "${currentSheet.athleteName} (${currentSheet.stage})"? Tindakan ini akan menghapusnya dari LocalStorage.`)) {
      const remaining = sheets.filter((s) => s.id !== currentSheet.id);
      setSheets(remaining);
      setCurrentSheetId(remaining[0].id);
      setStorageStatusMsg('Lembar dihapus dari LocalStorage');
      setTimeout(() => setStorageStatusMsg(''), 3000);
    }
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(sheets, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `Precision_Shooting_Backup_${new Date().toISOString().split('T')[0]}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setStorageStatusMsg('File cadangan JSON berhasil diunduh');
    setTimeout(() => setStorageStatusMsg(''), 3000);
  };

  const handleImportJSON = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSheets(parsed);
          setCurrentSheetId(parsed[0].id);
          setStorageStatusMsg(`${parsed.length} lembar skor berhasil diimpor ke LocalStorage!`);
          setTimeout(() => setStorageStatusMsg(''), 4000);
        } else {
          alert('Format JSON tidak valid atau data kosong.');
        }
      } catch (err) {
        alert('Gagal membaca file JSON cadangan.');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-6 pb-12 print:p-0 print:space-y-4">
      {/* Title & Banner Sesuai Slide 14-17 Disertasi Rasyo UNP & FOPI */}
      <div className="bg-gradient-to-r from-[#002395] via-[#0a35b8] to-[#1e40af] text-white p-5 sm:p-6 rounded-xl shadow-md flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-amber-400 text-amber-950 font-black text-[10px] tracking-wider px-2 py-0.5 rounded uppercase">
              FOPI & FIPJP Standard
            </span>
            <span className="bg-white/20 text-white font-semibold text-[10px] px-2 py-0.5 rounded">
              Score Sheet Precision Shooting.xlsx
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
            <Target className="w-6 h-6 text-amber-300" />
            <span>Lembar Skor Resmi Precision Shooting</span>
          </h2>
          <p className="text-white/80 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
            Sistem kalkulasi dan analisis keberhasilan nomor tembakan presisi
            (5 Station & 4 Jarak = 20 Lemparan). Berdasarkan rumus benchmark
            Disertasi Rasyono (UNP NIM. 25344021) dan standar peraih medali SEA Games.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            id="prec-btn-new-sheet"
            onClick={handleCreateNewSheet}
            className="px-3 py-1.5 bg-white text-[#002395] hover:bg-slate-100 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Layers className="w-3.5 h-3.5 text-[#002395]" />
            <span>Lembar Baru</span>
          </button>

          <button
            id="prec-btn-copy"
            onClick={handleCopyText}
            className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 border border-white/20"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-300" />
                <span>Tersalin!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Salin Data</span>
              </>
            )}
          </button>

          <button
            id="prec-btn-print"
            onClick={() => window.print()}
            className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 border border-white/20"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak / PDF</span>
          </button>
        </div>
      </div>

      {/* LocalStorage Multi-Sheet Management Toolbar */}
      <div className="bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xs border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Left: Active sheet selector */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <HardDrive className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[11px]">LocalStorage Aktif</span>
          </div>

          <div className="h-4 w-px bg-slate-700 hidden sm:block" />

          {/* Sheet Selector */}
          <div className="flex items-center gap-1.5">
            <label htmlFor={sheetSelectId} className="text-slate-400 font-medium text-[11px]">
              Pilih Lembar:
            </label>
            <select
              id={sheetSelectId}
              value={currentSheetId}
              onChange={(e) => setCurrentSheetId(e.target.value)}
              className="bg-slate-800 text-white font-semibold text-xs border border-slate-700 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-amber-400"
            >
              {sheets.map((s) => {
                // Calculate quick total for label
                let total = 0;
                Object.values(s.scores || {}).forEach((v) => {
                  if (typeof v === 'number') total += v;
                });
                return (
                  <option key={s.id} value={s.id}>
                    {s.athleteName} — {s.stage} ({total} Poin)
                  </option>
                );
              })}
            </select>
          </div>

          {/* Status Message */}
          {storageStatusMsg && (
            <span className="text-amber-300 font-semibold text-[11px] bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800 animate-fade-in">
              ✓ {storageStatusMsg}
            </span>
          )}
        </div>

        {/* Right: Storage actions */}
        <div className="flex flex-wrap items-center gap-2 text-[11px]">
          <button
            id="prec-btn-dup-sheet"
            onClick={handleDuplicateSheet}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded border border-slate-700 flex items-center gap-1 transition-colors"
            title="Duplikasi lembar aktif untuk atlet atau babak lain"
          >
            <CopyPlus className="w-3 h-3 text-slate-400" />
            <span>Duplikat</span>
          </button>

          <button
            id="prec-btn-del-sheet"
            onClick={handleDeleteSheet}
            className="px-2.5 py-1 bg-rose-950/50 hover:bg-rose-900/70 text-rose-300 font-semibold rounded border border-rose-800 flex items-center gap-1 transition-colors"
            title="Hapus lembar aktif dari LocalStorage"
          >
            <Trash2 className="w-3 h-3 text-rose-400" />
            <span>Hapus</span>
          </button>

          <div className="h-4 w-px bg-slate-700 hidden sm:block" />

          {/* Export JSON */}
          <button
            id="prec-btn-export-json"
            onClick={handleExportJSON}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded border border-slate-700 flex items-center gap-1 transition-colors"
            title="Unduh file backup JSON semua lembar tersimpan di browser"
          >
            <Download className="w-3 h-3 text-amber-400" />
            <span>Backup JSON</span>
          </button>

          {/* Import JSON hidden input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImportJSON}
            accept=".json"
            className="hidden"
          />
          <button
            id="prec-btn-import-json"
            onClick={() => fileInputRef.current?.click()}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded border border-slate-700 flex items-center gap-1 transition-colors"
            title="Muat file backup JSON ke LocalStorage"
          >
            <Upload className="w-3 h-3 text-emerald-400" />
            <span>Impor JSON</span>
          </button>

          <span className="text-slate-400 text-[10px] pl-1">
            Auto-save: <strong className="text-slate-300">{lastSaved}</strong>
          </span>
        </div>
      </div>

      {/* Rasyo's Benchmark Summary Card: 70% Perunggu, 80% Perak, 90% Emas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Main Result Card */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-md bg-amber-50 text-amber-600 border border-amber-200">
                <Trophy className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-slate-800">
                  Analisis Keberhasilan Precision Shooting (Slide Disertasi)
                </h3>
                <p className="text-[11px] text-slate-500">
                  Kemampuan Maksimal Realistis: 3 Poin × 20 Lemparan = 60 Poin (100%)
                </p>
              </div>
            </div>

            {/* Medal Badge */}
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${evaluation.tier.badgeBg} ${evaluation.tier.badgeBorder} ${evaluation.tier.badgeText} font-black text-xs`}
            >
              <span className="text-sm">{evaluation.tier.icon}</span>
              <span>{evaluation.medalEstimate}</span>
              <span className="text-[10px] font-semibold opacity-80">
                ({evaluation.percentageRealistic}% Realistis)
              </span>
            </div>
          </div>

          {/* Numbers Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-center">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Total Skor
              </div>
              <div className="text-2xl font-black text-[#002395] my-0.5">
                {grandTotal}
                <span className="text-xs text-slate-400 font-medium"> / 100</span>
              </div>
              <div className="text-[10px] text-slate-500">
                Teoretis (Jika 5P terus)
              </div>
            </div>

            <div className="bg-amber-50/70 p-3 rounded-lg border border-amber-100 text-center">
              <div className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">
                Standar Realistis
              </div>
              <div className="text-2xl font-black text-amber-700 my-0.5">
                {grandTotal}
                <span className="text-xs text-amber-600/70 font-medium"> / 60</span>
              </div>
              <div className="text-[10px] text-amber-800 font-bold">
                {evaluation.percentageRealistic}% Kemampuan Puncak
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-center">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Target SEA Games
              </div>
              <div className="text-2xl font-black text-slate-800 my-0.5">
                42 - 54
              </div>
              <div className="text-[10px] text-slate-500">
                Range Peraih Medali
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-center">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Lemparan Selesai
              </div>
              <div className="text-2xl font-black text-emerald-600 my-0.5">
                {throwsCount}
                <span className="text-xs text-slate-400 font-medium"> / 20</span>
              </div>
              <div className="text-[10px] text-slate-500">
                {carreauCount} Carreau (5P)
              </div>
            </div>
          </div>

          {/* Visual Benchmark Bar (70% - 80% - 90%) */}
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 mb-3">
            <div className="flex justify-between items-center text-[11px] mb-1.5 font-bold">
              <span className="text-slate-700 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-[#002395]" />
                <span>Posisi Atlet Menuju Standar Medali SEA Games:</span>
              </span>
              <span className="text-[#002395] font-black">
                {grandTotal} Poin ({evaluation.percentageRealistic}%)
              </span>
            </div>

            {/* Gauge progress */}
            <div className="relative h-4 bg-slate-200 rounded-full overflow-hidden flex">
              {/* Range < 70% (0 - 41) */}
              <div
                className="h-full bg-rose-300 text-[9px] font-bold text-rose-900 flex items-center justify-center border-r border-white/40"
                style={{ width: '70%' }}
                title="<70% (<42 Poin): Di Bawah Standar Medali"
              >
                &lt; 70% Evaluasi
              </div>
              {/* Range 70 - 79% (42 - 47) */}
              <div
                className="h-full bg-orange-400 text-[9px] font-bold text-orange-950 flex items-center justify-center border-r border-white/40"
                style={{ width: '10%' }}
                title="70-79% (42-47 Poin): Perunggu (Cukup Baik)"
              >
                70% 🥉
              </div>
              {/* Range 80 - 89% (48 - 53) */}
              <div
                className="h-full bg-slate-400 text-[9px] font-bold text-slate-950 flex items-center justify-center border-r border-white/40"
                style={{ width: '10%' }}
                title="80-89% (48-53 Poin): Perak (Baik)"
              >
                80% 🥈
              </div>
              {/* Range >= 90% (54 - 60+) */}
              <div
                className="h-full bg-amber-400 text-[9px] font-black text-amber-950 flex items-center justify-center"
                style={{ width: '10%' }}
                title="≥90% (≥54 Poin): Emas (Sangat Baik)"
              >
                90% 🥇
              </div>
            </div>

            {/* Pin pointer */}
            <div className="flex justify-between text-[9px] text-slate-500 font-semibold mt-1 px-1">
              <span>0P (0%)</span>
              <span>42P (70% Perunggu)</span>
              <span>48P (80% Perak)</span>
              <span>54P (90% Emas)</span>
              <span>60P (100%)</span>
            </div>
          </div>

          {/* Coach Conclusion */}
          <div className="bg-slate-50 p-3 rounded-lg border-l-4 border-l-[#002395] border border-slate-200 text-xs">
            <div className="font-bold text-slate-900 flex items-center gap-1.5 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-[#002395]" />
              <span>{evaluation.confidenceText}</span>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              {evaluation.coachingRecommendation}
            </p>
          </div>
        </div>

        {/* Preset & Quick Simulation Panel (From Slide) */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <Award className="w-4 h-4 text-amber-500" />
              <span>Standar Prestasi Slide Disertasi</span>
            </h3>
            <p className="text-[11px] text-slate-500 leading-relaxed mb-3">
              Kaidah interpretasi hasil evaluasi shooting petanque berdasarkan
              pencapaian empiris pada SEA Games & World Games:
            </p>

            <div className="space-y-2 text-[11px]">
              <div className="p-2 rounded border border-amber-200 bg-amber-50 flex items-center justify-between">
                <div>
                  <span className="font-black text-amber-950">≥ 90% (Skor ≥ 54)</span>
                  <div className="text-amber-800 text-[10px]">Kategori SANGAT BAIK</div>
                </div>
                <span className="px-2 py-0.5 bg-amber-400 text-amber-950 font-black rounded text-[10px]">
                  🥇 Target EMAS
                </span>
              </div>

              <div className="p-2 rounded border border-slate-300 bg-slate-100 flex items-center justify-between">
                <div>
                  <span className="font-black text-slate-900">80% - 89% (Skor 48-53)</span>
                  <div className="text-slate-700 text-[10px]">Kategori BAIK</div>
                </div>
                <span className="px-2 py-0.5 bg-slate-300 text-slate-900 font-bold rounded text-[10px]">
                  🥈 Dipastikan PERAK
                </span>
              </div>

              <div className="p-2 rounded border border-orange-200 bg-orange-50 flex items-center justify-between">
                <div>
                  <span className="font-black text-orange-950">70% - 79% (Skor 42-47)</span>
                  <div className="text-orange-800 text-[10px]">Kategori CUKUP BAIK</div>
                </div>
                <span className="px-2 py-0.5 bg-orange-300 text-orange-950 font-bold rounded text-[10px]">
                  🥉 Bicara PERUNGGU
                </span>
              </div>

              <div className="p-2 rounded border border-rose-200 bg-rose-50 flex items-center justify-between">
                <div>
                  <span className="font-black text-rose-950">&lt; 70% (Skor &lt; 42)</span>
                  <div className="text-rose-800 text-[10px]">Di Bawah Standar SEA Games</div>
                </div>
                <span className="px-2 py-0.5 bg-rose-200 text-rose-950 font-bold rounded text-[10px]">
                  ⚠️ Perlu Evaluasi
                </span>
              </div>
            </div>
          </div>

          {/* Quick Simulation Buttons */}
          <div className="mt-4 pt-3 border-t border-slate-100">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Isi Contoh Simulasi Cepat:
            </div>
            <div className="grid grid-cols-2 gap-1.5 text-[11px]">
              <button
                id="prec-btn-sim-gold"
                onClick={() => applyPreset('GOLD')}
                className="px-2 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold rounded border border-amber-300 text-left flex items-center gap-1"
              >
                <span>🥇</span>
                <span>Emas (54 P)</span>
              </button>
              <button
                id="prec-btn-sim-silver"
                onClick={() => applyPreset('SILVER')}
                className="px-2 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold rounded border border-slate-300 text-left flex items-center gap-1"
              >
                <span>🥈</span>
                <span>Perak (48 P)</span>
              </button>
              <button
                id="prec-btn-sim-bronze"
                onClick={() => applyPreset('BRONZE')}
                className="px-2 py-1.5 bg-orange-100 hover:bg-orange-200 text-orange-950 font-bold rounded border border-orange-300 text-left flex items-center gap-1"
              >
                <span>🥉</span>
                <span>Perunggu (42 P)</span>
              </button>
              <button
                id="prec-btn-sim-clear"
                onClick={() => applyPreset('CLEAR')}
                className="px-2 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold rounded border border-slate-200 text-left flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3 text-slate-400" />
                <span>Kosongkan</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Score Sheet Table Form (Replicating "Score Sheet Precision Shooting.xlsx") */}
      <div className="bg-white rounded-xl border border-slate-300 shadow-sm overflow-hidden">
        {/* Excel Header Metadata Form */}
        <div className="p-4 sm:p-5 bg-slate-50/80 border-b border-slate-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-3 text-xs">
            {/* Sheet Selector */}
            <div className="md:col-span-2">
              <label htmlFor={athleteNameInputId} className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-[#002395]" />
                <span>Nama Atlet</span>
              </label>
              <input
                id={athleteNameInputId}
                type="text"
                value={currentSheet.athleteName}
                onChange={(e) => updateCurrentSheet({ athleteName: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#002395]"
                placeholder="Nama Lengkap Atlet"
              />
            </div>

            {/* Kab / Kota */}
            <div className="md:col-span-2">
              <label htmlFor={kabKotaInputId} className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#002395]" />
                <span>Kab / Kota / Tim</span>
              </label>
              <input
                id={kabKotaInputId}
                type="text"
                value={currentSheet.kabKota}
                onChange={(e) => updateCurrentSheet({ kabKota: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#002395]"
                placeholder="Pengprov / Pengkab / Negara"
              />
            </div>

            {/* Line */}
            <div>
              <label htmlFor={lineInputId} className="block font-bold text-slate-700 mb-1">
                Line / Court
              </label>
              <input
                id={lineInputId}
                type="text"
                value={currentSheet.line}
                onChange={(e) => updateCurrentSheet({ line: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#002395]"
                placeholder="Line 1"
              />
            </div>

            {/* Babak / Stage */}
            <div>
              <label htmlFor={stageSelectId} className="block font-bold text-slate-700 mb-1">
                Babak
              </label>
              <select
                id={stageSelectId}
                value={currentSheet.stage}
                onChange={(e) =>
                  updateCurrentSheet({ stage: e.target.value as PrecisionRoundStage })
                }
                className="w-full bg-white border border-slate-300 rounded px-2 py-1.5 font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#002395]"
              >
                <option value="Qualification">Qualification</option>
                <option value="2nd Chance">2nd Chance</option>
                <option value="Quarter Final">Quarter Final</option>
                <option value="Semi Final">Semi Final</option>
                <option value="Final">Final</option>
              </select>
            </div>

            {/* Tanggal */}
            <div className="md:col-span-2">
              <label htmlFor={dateInputId} className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#002395]" />
                <span>Tanggal</span>
              </label>
              <input
                id={dateInputId}
                type="date"
                value={currentSheet.date}
                onChange={(e) => updateCurrentSheet({ date: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#002395]"
              />
            </div>

            {/* Event Name */}
            <div className="md:col-span-4">
              <label htmlFor={eventNameInputId} className="block font-bold text-slate-700 mb-1">
                Nama Kejuaraan / Event
              </label>
              <input
                id={eventNameInputId}
                type="text"
                value={currentSheet.eventName}
                onChange={(e) => updateCurrentSheet({ eventName: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#002395]"
                placeholder="Nama Kejuaraan Petanque"
              />
            </div>
          </div>
        </div>

        {/* Quick Input Bar for Currently Selected Cell */}
        <div className="bg-amber-50/80 px-4 py-2.5 border-b border-amber-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="font-bold text-amber-950">Kotak Aktif:</span>
            <span className="bg-amber-400 text-amber-950 font-black px-2 py-0.5 rounded text-[11px]">
              {
                PRECISION_FIGURES.find((f) => f.id === activeCell.figId)?.name
              }{' '}
              ({
                PRECISION_FIGURES.find((f) => f.id === activeCell.figId)?.subName
              }) — Jarak {activeCell.dist}
            </span>
          </div>

          {/* Quick Click Value Buttons (0, 1, 3, 5) */}
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-600 mr-1 text-[11px]">
              Input Poin:
            </span>
            <button
              id="btn-score-5p"
              onClick={() => setScore(activeCell.figId, activeCell.dist, 5)}
              className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white font-black rounded text-xs shadow-xs transition-colors flex items-center gap-1"
              title="Carreau (5 Poin)"
            >
              <span>5 P</span>
              <span className="text-[10px] opacity-90 hidden sm:inline">(Carreau)</span>
            </button>
            <button
              id="btn-score-3p"
              onClick={() => setScore(activeCell.figId, activeCell.dist, 3)}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white font-black rounded text-xs shadow-xs transition-colors flex items-center gap-1"
              title="Succeeded / Frappe (3 Poin)"
            >
              <span>3 P</span>
              <span className="text-[10px] opacity-90 hidden sm:inline">(Kena)</span>
            </button>
            <button
              id="btn-score-1p"
              onClick={() => setScore(activeCell.figId, activeCell.dist, 1)}
              className="px-3 py-1 bg-slate-600 hover:bg-slate-700 text-white font-black rounded text-xs shadow-xs transition-colors flex items-center gap-1"
              title="Touched / Senggol (1 Poin)"
            >
              <span>1 P</span>
              <span className="text-[10px] opacity-90 hidden sm:inline">(Senggol)</span>
            </button>
            <button
              id="btn-score-0p"
              onClick={() => setScore(activeCell.figId, activeCell.dist, 0)}
              className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white font-black rounded text-xs shadow-xs transition-colors flex items-center gap-1"
              title="Missed / Gagal (0 Poin)"
            >
              <span>0 P</span>
              <span className="text-[10px] opacity-90 hidden sm:inline">(Gagal)</span>
            </button>
            <button
              id="btn-score-clear"
              onClick={() => setScore(activeCell.figId, activeCell.dist, null)}
              className="px-2 py-1 bg-white hover:bg-slate-100 text-slate-600 font-bold rounded text-xs border border-slate-300"
              title="Hapus Nilai"
            >
              Hapus
            </button>
          </div>
        </div>

        {/* Authentic Excel Grid Table matching image.png */}
        <div className="overflow-x-auto">
          <table className="w-full text-center border-collapse text-xs">
            <thead>
              {/* Row 1: Figure Titles */}
              <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                <th
                  rowSpan={3}
                  className="p-2 border-r border-slate-300 w-28 bg-slate-200/70 text-left font-black text-slate-900"
                >
                  Babak / Stage
                </th>
                <th colSpan={5} className="p-2 border-r border-slate-300 bg-slate-100">
                  <div className="font-black text-slate-900">Figure 1</div>
                  <div className="text-[11px] font-bold text-[#002395]">
                    Boule Alone
                  </div>
                </th>
                <th colSpan={5} className="p-2 border-r border-slate-300 bg-slate-100">
                  <div className="font-black text-slate-900">Figure 2</div>
                  <div className="text-[11px] font-bold text-[#002395]">
                    Boule Behind Jack
                  </div>
                </th>
                <th colSpan={5} className="p-2 border-r border-slate-300 bg-slate-100">
                  <div className="font-black text-slate-900">Figure 3</div>
                  <div className="text-[11px] font-bold text-[#002395]">
                    Between Two Boules
                  </div>
                </th>
                <th colSpan={5} className="p-2 border-r border-slate-300 bg-slate-100">
                  <div className="font-black text-slate-900">Figure 4</div>
                  <div className="text-[11px] font-bold text-[#002395]">
                    Jump (Boule Behind Boule)
                  </div>
                </th>
                <th colSpan={5} className="p-2 border-r border-slate-300 bg-slate-100">
                  <div className="font-black text-slate-900">Figure 5</div>
                  <div className="text-[11px] font-bold text-[#002395]">
                    Jack (Boka)
                  </div>
                </th>
                <th
                  rowSpan={3}
                  className="p-2 border-r border-slate-300 bg-[#002395] text-white font-black text-sm w-24"
                >
                  TOTAL ALL STATION
                </th>
                <th
                  rowSpan={3}
                  className="p-2 bg-slate-200 text-slate-800 font-bold text-xs w-28"
                >
                  SIGN / TTD
                </th>
              </tr>

              {/* Row 2: Point Legend & Visual Target Icons */}
              <tr className="bg-slate-50 text-[10px] border-b border-slate-200">
                {/* Fig 1 Legend */}
                <td colSpan={5} className="p-1 border-r border-slate-300">
                  <div className="flex items-center justify-center gap-1 text-slate-600 mb-1">
                    <span className="font-bold text-amber-700">Carreau 5P</span> •{' '}
                    <span>Succeeded 3P</span> • <span>Touched 1P</span> •{' '}
                    <span className="text-rose-600">Missed 0P</span>
                  </div>
                  {/* SVG Diagram: Circle with 1 boule */}
                  <div className="flex justify-center py-1">
                    <div className="w-10 h-10 rounded-full border-2 border-slate-400 bg-slate-200 flex items-center justify-center relative shadow-inner">
                      <div className="w-3.5 h-3.5 rounded-full bg-slate-800 shadow" />
                    </div>
                  </div>
                </td>

                {/* Fig 2 Legend */}
                <td colSpan={5} className="p-1 border-r border-slate-300">
                  <div className="flex items-center justify-center gap-1 text-slate-600 mb-1">
                    <span className="font-bold text-amber-700">Carreau 5P</span> •{' '}
                    <span>Succeeded 3P</span> • <span>Touched 1P</span> •{' '}
                    <span className="text-rose-600">Missed 0P</span>
                  </div>
                  {/* SVG Diagram: Circle with 1 jack at front, 1 boule behind */}
                  <div className="flex justify-center py-1">
                    <div className="w-10 h-10 rounded-full border-2 border-slate-400 bg-slate-200 flex flex-col items-center justify-center gap-0.5 relative shadow-inner">
                      <div className="w-3.5 h-3.5 rounded-full bg-slate-800 shadow" />
                      <div className="w-1.5 h-1.5 rounded-full bg-red-600" />
                    </div>
                  </div>
                </td>

                {/* Fig 3 Legend */}
                <td colSpan={5} className="p-1 border-r border-slate-300">
                  <div className="flex items-center justify-center gap-1 text-slate-600 mb-1">
                    <span className="font-bold text-amber-700">Carreau 5P</span> •{' '}
                    <span>Succeeded 3P</span> • <span>Touched 1P</span> •{' '}
                    <span className="text-rose-600">Missed 0P</span>
                  </div>
                  {/* SVG Diagram: Circle with 3 boules in horizontal line */}
                  <div className="flex justify-center py-1">
                    <div className="w-10 h-10 rounded-full border-2 border-slate-400 bg-slate-200 flex items-center justify-center gap-0.5 relative shadow-inner">
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                      <div className="w-3 h-3 rounded-full bg-slate-800 shadow" />
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                    </div>
                  </div>
                </td>

                {/* Fig 4 Legend */}
                <td colSpan={5} className="p-1 border-r border-slate-300">
                  <div className="flex items-center justify-center gap-1 text-slate-600 mb-1">
                    <span className="font-bold text-amber-700">Carreau 5P</span> •{' '}
                    <span>Succeeded 3P</span> • <span>Touched 1P</span> •{' '}
                    <span className="text-rose-600">Missed 0P</span>
                  </div>
                  {/* SVG Diagram: Circle with 2 boules in vertical jump line */}
                  <div className="flex justify-center py-1">
                    <div className="w-10 h-10 rounded-full border-2 border-slate-400 bg-slate-200 flex flex-col items-center justify-center gap-0.5 relative shadow-inner">
                      <div className="w-3 h-3 rounded-full bg-slate-800 shadow" />
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                    </div>
                  </div>
                </td>

                {/* Fig 5 Legend */}
                <td colSpan={5} className="p-1 border-r border-slate-300">
                  <div className="flex items-center justify-center gap-1 text-slate-600 mb-1">
                    <span className="font-bold text-amber-700">Carreau 5P</span> •{' '}
                    <span>Succeeded 3P</span> • <span>Touched 1P</span> •{' '}
                    <span className="text-rose-600">Missed 0P</span>
                  </div>
                  {/* SVG Diagram: Circle with only 1 jack */}
                  <div className="flex justify-center py-1">
                    <div className="w-10 h-10 rounded-full border-2 border-slate-400 bg-slate-200 flex items-center justify-center relative shadow-inner">
                      <div className="w-2 h-2 rounded-full bg-red-600 shadow" />
                    </div>
                  </div>
                </td>
              </tr>

              {/* Row 3: Distances 6,5 | 7,5 | 8,5 | 9,5 | Tot */}
              <tr className="bg-slate-200/90 text-slate-800 font-bold text-[11px] border-b border-slate-300">
                {/* Fig 1 Distances */}
                <th className="p-1 border-r border-slate-300 w-11">6,5</th>
                <th className="p-1 border-r border-slate-300 w-11">7,5</th>
                <th className="p-1 border-r border-slate-300 w-11">8,5</th>
                <th className="p-1 border-r border-slate-300 w-11">9,5</th>
                <th className="p-1 border-r border-slate-400 bg-slate-300 w-12 font-black text-[#002395]">
                  Tot
                </th>

                {/* Fig 2 Distances */}
                <th className="p-1 border-r border-slate-300 w-11">6,5</th>
                <th className="p-1 border-r border-slate-300 w-11">7,5</th>
                <th className="p-1 border-r border-slate-300 w-11">8,5</th>
                <th className="p-1 border-r border-slate-300 w-11">9,5</th>
                <th className="p-1 border-r border-slate-400 bg-slate-300 w-12 font-black text-[#002395]">
                  Tot
                </th>

                {/* Fig 3 Distances */}
                <th className="p-1 border-r border-slate-300 w-11">6,5</th>
                <th className="p-1 border-r border-slate-300 w-11">7,5</th>
                <th className="p-1 border-r border-slate-300 w-11">8,5</th>
                <th className="p-1 border-r border-slate-300 w-11">9,5</th>
                <th className="p-1 border-r border-slate-400 bg-slate-300 w-12 font-black text-[#002395]">
                  Tot
                </th>

                {/* Fig 4 Distances */}
                <th className="p-1 border-r border-slate-300 w-11">6,5</th>
                <th className="p-1 border-r border-slate-300 w-11">7,5</th>
                <th className="p-1 border-r border-slate-300 w-11">8,5</th>
                <th className="p-1 border-r border-slate-300 w-11">9,5</th>
                <th className="p-1 border-r border-slate-400 bg-slate-300 w-12 font-black text-[#002395]">
                  Tot
                </th>

                {/* Fig 5 Distances */}
                <th className="p-1 border-r border-slate-300 w-11">6,5</th>
                <th className="p-1 border-r border-slate-300 w-11">7,5</th>
                <th className="p-1 border-r border-slate-300 w-11">8,5</th>
                <th className="p-1 border-r border-slate-300 w-11">9,5</th>
                <th className="p-1 border-r border-slate-400 bg-slate-300 w-12 font-black text-[#002395]">
                  Tot
                </th>
              </tr>
            </thead>

            <tbody>
              {/* Active Current Stage Row */}
              <tr className="bg-white hover:bg-amber-50/20 font-mono text-xs border-b border-slate-300">
                <td className="p-2 border-r border-slate-300 bg-slate-50 font-bold text-left text-slate-800">
                  <div className="font-bold text-[#002395]">
                    {currentSheet.stage}
                  </div>
                  <div className="text-[10px] text-slate-500 font-sans">
                    {currentSheet.athleteName}
                  </div>
                </td>

                {/* Figure 1 Cells */}
                {PRECISION_DISTANCES.map((dist) => {
                  const key = `fig1_${dist}`;
                  const val = currentSheet.scores[key];
                  const isActive =
                    activeCell.figId === 'fig1' && activeCell.dist === dist;
                  return (
                    <td
                      key={key}
                      id={`cell-${key}`}
                      onClick={() => setActiveCell({ figId: 'fig1', dist })}
                      className={`p-1 border-r border-slate-200 cursor-pointer transition-all ${
                        isActive
                          ? 'ring-2 ring-amber-500 bg-amber-100 font-black'
                          : val === 5
                          ? 'bg-amber-50 text-amber-900 font-black'
                          : val === 3
                          ? 'bg-blue-50 text-blue-900 font-bold'
                          : val === 1
                          ? 'bg-slate-100 text-slate-800'
                          : val === 0
                          ? 'bg-rose-50 text-rose-800'
                          : 'text-slate-300'
                      }`}
                    >
                      {val !== null && val !== undefined ? val : '-'}
                    </td>
                  );
                })}
                <td className="p-1 border-r border-slate-400 bg-slate-100 font-black text-[#002395]">
                  {figureTotals.fig1}
                </td>

                {/* Figure 2 Cells */}
                {PRECISION_DISTANCES.map((dist) => {
                  const key = `fig2_${dist}`;
                  const val = currentSheet.scores[key];
                  const isActive =
                    activeCell.figId === 'fig2' && activeCell.dist === dist;
                  return (
                    <td
                      key={key}
                      id={`cell-${key}`}
                      onClick={() => setActiveCell({ figId: 'fig2', dist })}
                      className={`p-1 border-r border-slate-200 cursor-pointer transition-all ${
                        isActive
                          ? 'ring-2 ring-amber-500 bg-amber-100 font-black'
                          : val === 5
                          ? 'bg-amber-50 text-amber-900 font-black'
                          : val === 3
                          ? 'bg-blue-50 text-blue-900 font-bold'
                          : val === 1
                          ? 'bg-slate-100 text-slate-800'
                          : val === 0
                          ? 'bg-rose-50 text-rose-800'
                          : 'text-slate-300'
                      }`}
                    >
                      {val !== null && val !== undefined ? val : '-'}
                    </td>
                  );
                })}
                <td className="p-1 border-r border-slate-400 bg-slate-100 font-black text-[#002395]">
                  {figureTotals.fig2}
                </td>

                {/* Figure 3 Cells */}
                {PRECISION_DISTANCES.map((dist) => {
                  const key = `fig3_${dist}`;
                  const val = currentSheet.scores[key];
                  const isActive =
                    activeCell.figId === 'fig3' && activeCell.dist === dist;
                  return (
                    <td
                      key={key}
                      id={`cell-${key}`}
                      onClick={() => setActiveCell({ figId: 'fig3', dist })}
                      className={`p-1 border-r border-slate-200 cursor-pointer transition-all ${
                        isActive
                          ? 'ring-2 ring-amber-500 bg-amber-100 font-black'
                          : val === 5
                          ? 'bg-amber-50 text-amber-900 font-black'
                          : val === 3
                          ? 'bg-blue-50 text-blue-900 font-bold'
                          : val === 1
                          ? 'bg-slate-100 text-slate-800'
                          : val === 0
                          ? 'bg-rose-50 text-rose-800'
                          : 'text-slate-300'
                      }`}
                    >
                      {val !== null && val !== undefined ? val : '-'}
                    </td>
                  );
                })}
                <td className="p-1 border-r border-slate-400 bg-slate-100 font-black text-[#002395]">
                  {figureTotals.fig3}
                </td>

                {/* Figure 4 Cells */}
                {PRECISION_DISTANCES.map((dist) => {
                  const key = `fig4_${dist}`;
                  const val = currentSheet.scores[key];
                  const isActive =
                    activeCell.figId === 'fig4' && activeCell.dist === dist;
                  return (
                    <td
                      key={key}
                      id={`cell-${key}`}
                      onClick={() => setActiveCell({ figId: 'fig4', dist })}
                      className={`p-1 border-r border-slate-200 cursor-pointer transition-all ${
                        isActive
                          ? 'ring-2 ring-amber-500 bg-amber-100 font-black'
                          : val === 5
                          ? 'bg-amber-50 text-amber-900 font-black'
                          : val === 3
                          ? 'bg-blue-50 text-blue-900 font-bold'
                          : val === 1
                          ? 'bg-slate-100 text-slate-800'
                          : val === 0
                          ? 'bg-rose-50 text-rose-800'
                          : 'text-slate-300'
                      }`}
                    >
                      {val !== null && val !== undefined ? val : '-'}
                    </td>
                  );
                })}
                <td className="p-1 border-r border-slate-400 bg-slate-100 font-black text-[#002395]">
                  {figureTotals.fig4}
                </td>

                {/* Figure 5 Cells */}
                {PRECISION_DISTANCES.map((dist) => {
                  const key = `fig5_${dist}`;
                  const val = currentSheet.scores[key];
                  const isActive =
                    activeCell.figId === 'fig5' && activeCell.dist === dist;
                  return (
                    <td
                      key={key}
                      id={`cell-${key}`}
                      onClick={() => setActiveCell({ figId: 'fig5', dist })}
                      className={`p-1 border-r border-slate-200 cursor-pointer transition-all ${
                        isActive
                          ? 'ring-2 ring-amber-500 bg-amber-100 font-black'
                          : val === 5
                          ? 'bg-amber-50 text-amber-900 font-black'
                          : val === 3
                          ? 'bg-blue-50 text-blue-900 font-bold'
                          : val === 1
                          ? 'bg-slate-100 text-slate-800'
                          : val === 0
                          ? 'bg-rose-50 text-rose-800'
                          : 'text-slate-300'
                      }`}
                    >
                      {val !== null && val !== undefined ? val : '-'}
                    </td>
                  );
                })}
                <td className="p-1 border-r border-slate-400 bg-slate-100 font-black text-[#002395]">
                  {figureTotals.fig5}
                </td>

                {/* Grand Total All Stations */}
                <td className="p-2 border-r border-slate-300 bg-amber-100 font-black text-slate-950 text-base">
                  {grandTotal}
                </td>

                {/* Sign verification */}
                <td className="p-2 bg-slate-50 text-slate-600 text-[10px] font-sans">
                  {currentSheet.refereeSign ? '✓ Terverifikasi' : 'Belum TTD'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Verification & Signatures Section (Matching Bottom of Excel) */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label htmlFor={refereeSignInputId} className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
              <PenTool className="w-3.5 h-3.5 text-[#002395]" />
              <span>Tanda Tangan Wasit / Penguji (Sign)</span>
            </label>
            <input
              id={refereeSignInputId}
              type="text"
              value={currentSheet.refereeSign || ''}
              onChange={(e) => updateCurrentSheet({ refereeSign: e.target.value })}
              placeholder="Nama / TTD Wasit Pertandingan"
              className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#002395]"
            />
          </div>

          <div>
            <label htmlFor={athleteSignInputId} className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Tanda Tangan Atlet / Coach (Sign)</span>
            </label>
            <input
              id={athleteSignInputId}
              type="text"
              value={currentSheet.athleteSign || ''}
              onChange={(e) => updateCurrentSheet({ athleteSign: e.target.value })}
              placeholder="Konfirmasi Atlet / Pelatih Pendamping"
              className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#002395]"
            />
          </div>
        </div>
      </div>

      {/* Analytics Breakdown per Figure & Distance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Figure Analysis */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Target className="w-4 h-4 text-[#002395]" />
            <span>Performa Akurasi Per Station (Figure 1 - 5)</span>
          </h4>
          <div className="space-y-2.5">
            {PRECISION_FIGURES.map((fig) => {
              const score = figureTotals[fig.id];
              const maxFigScore = 20; // 4 throws x 5 max
              const pct = Math.round((score / maxFigScore) * 100);
              return (
                <div key={fig.id} className="text-xs">
                  <div className="flex justify-between font-semibold mb-1">
                    <span className="text-slate-800">
                      {fig.name} — {fig.subName}
                    </span>
                    <span className="font-bold text-[#002395]">
                      {score} / 20 Poin ({pct}%)
                    </span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden flex">
                    <div
                      className={`h-full ${
                        pct >= 80
                          ? 'bg-amber-500'
                          : pct >= 60
                          ? 'bg-blue-600'
                          : pct >= 40
                          ? 'bg-slate-500'
                          : 'bg-rose-500'
                      }`}
                      style={{ width: `${Math.min(100, pct)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Distance Analysis */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <span>Performa Akurasi Per Jarak Lemparan (6.5m s.d 9.5m)</span>
          </h4>
          <div className="space-y-2.5">
            {PRECISION_DISTANCES.map((dist) => {
              const score = distanceTotals[dist];
              const maxDistScore = 25; // 5 figures x 5 max = 25
              const pct = Math.round((score / maxDistScore) * 100);
              return (
                <div key={dist} className="text-xs">
                  <div className="flex justify-between font-semibold mb-1">
                    <span className="text-slate-800">Jarak {dist}</span>
                    <span className="font-bold text-emerald-700">
                      {score} / 25 Poin ({pct}%)
                    </span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden flex">
                    <div
                      className={`h-full ${
                        pct >= 80
                          ? 'bg-emerald-500'
                          : pct >= 60
                          ? 'bg-blue-500'
                          : pct >= 40
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                      }`}
                      style={{ width: `${Math.min(100, pct)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Rasyono's Academic Footnote */}
      <div className="bg-slate-100 rounded-lg p-3 text-[11px] text-slate-600 border border-slate-200 flex items-start gap-2">
        <Info className="w-4 h-4 text-[#002395] shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-slate-800">
            Kaidah Ilmiah Precision Shooting Petanque (Disertasi Rasyono UNP):
          </span>{' '}
          Pada kejuaraan internasional, total lemparan adalah 20 lemparan dengan skor maksimal teoretis 100.
          Namun, skor 60 (rata-rata 3 poin tiap lemparan) adalah performa realistis maksimal 100%.
          Peraih medali SEA Games berada pada rentang skor 42 s.d 54. Atlet yang konsisten menembus skor 42 (70%)
          berpeluang meraih medali perunggu, skor 48 (80%) dipastikan meraih medali perak, dan skor 54 (90%)
          sangat berpeluang menargetkan medali emas.
        </div>
      </div>
    </div>
  );
}
