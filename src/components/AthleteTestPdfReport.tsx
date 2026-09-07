import React, { useState, useMemo, useRef } from 'react';
import { Match, Player } from '../types';
import {
  Printer,
  FileDown,
  RotateCcw,
  Sparkles,
  Edit3,
  Eye,
  CheckCircle2,
  AlertCircle,
  User,
  Upload,
  Calendar,
  Activity,
  Award,
  ChevronDown,
  Info,
} from 'lucide-react';

export type CategoryGrade = 'Sangat Baik' | 'Baik' | 'Sedang' | 'Kurang' | 'Sangat Kurang';

export interface TestItemData {
  id: string;
  categoryGroup: string; // e.g. 'FLEXIBILITY', 'MUSCULAR ENDURANCE', 'POWER', 'SPEED', 'Vo2 MAX'
  itemName: string; // e.g. 'Sit and Reach'
  hasilValue: string; // e.g. '42'
  kategori: CategoryGrade;
  score: number; // 100, 80, 60, 40, 20
  standard: number; // default 80 or 100
  rekomendasi: string;
}

export interface AthletePdfProfile {
  // Organization Kop
  orgName: string;
  orgAddress: string;
  orgContact: string;
  docTitle1: string;
  docTitle2: string;

  // Biodata
  tanggalTest: string;
  nama: string;
  cabangOlahraga: string;
  nomorSpesialisasi: string;
  jenisKelamin: 'Pria' | 'Wanita';
  tanggalLahir: string;
  prestasiAkhir: string;
  prestasiTertinggi: string;
  photoUrl: string | null;

  // Antropometri
  beratKg: number;
  tinggiCm: number;
  aspekPengukuran: string;

  // Items
  items: TestItemData[];

  // Signatures
  koordinatorNama: string;
  koordinatorJabatan: string;
  evaluatorNama: string;
  evaluatorJabatan: string;
  tempatTanggalTtd: string;
}

// 1. DEFAULT DATA: MATCHING THE USER'S PDF SAMPLE (SRI MAYA SARI - SRIWIJAYA SANG JUARA)
const OFFICIAL_SRIWIJAYA_SAMPLE: AthletePdfProfile = {
  orgName: 'SRIWIJAYA SANG JUARA',
  orgAddress: 'Komplek Garuda Putra III Blok I No 13 Lebong Siarang Palembang',
  orgContact: 'Telpon 081373292525 Email : iyakrus@fkip.unsri.ac.id',
  docTitle1: 'HASIL TEST KEBUGARAN FISIK ATLET',
  docTitle2: 'GRAFIK HASIL TEST FISIK ATLET',

  tanggalTest: '10 December 2025',
  nama: 'sri maya sari',
  cabangOlahraga: 'ATLETIK',
  nomorSpesialisasi: 'lari sprint / 400 meter',
  jenisKelamin: 'Wanita',
  tanggalLahir: '24 April 1994',
  prestasiAkhir: '-',
  prestasiTertinggi: '-',
  photoUrl: null,

  beratKg: 50,
  tinggiCm: 155,
  aspekPengukuran: '-',

  items: [
    {
      id: 'item_1',
      categoryGroup: 'FLEXIBILITY',
      itemName: 'Sit and Reach',
      hasilValue: '42',
      kategori: 'Sangat Baik',
      score: 100,
      standard: 80,
      rekomendasi:
        'Kategori tes sangat baik, program kedepan perlu mempertimbangkan untuk fokus pada kelompok otot yang masih lemah',
    },
    {
      id: 'item_2',
      categoryGroup: 'MUSCULAR ENDURANCE',
      itemName: 'Push Up (1 Menit)',
      hasilValue: '35',
      kategori: 'Baik',
      score: 80,
      standard: 80,
      rekomendasi:
        'Jika memungkinkan dan dibutuhkan maka beban latihan dapat ditingkatkan menuju kategori yang sangat baik',
    },
    {
      id: 'item_3',
      categoryGroup: 'MUSCULAR ENDURANCE',
      itemName: 'Sit Up (2 Menit)',
      hasilValue: '55',
      kategori: 'Baik',
      score: 80,
      standard: 80,
      rekomendasi:
        'Dipertahankan dan ditingkatkan sehingga dapat mencapai kategori yang sangat baik',
    },
    {
      id: 'item_4',
      categoryGroup: 'POWER',
      itemName: '10 Hop Left',
      hasilValue: '22.63',
      kategori: 'Sangat Kurang',
      score: 20,
      standard: 80,
      rekomendasi:
        'Penambahaan beban maupun bentuk latihan sangat perlu ditingkatkan sesuai dengan sasaran latihan',
    },
    {
      id: 'item_5',
      categoryGroup: 'POWER',
      itemName: '10 Hop Right',
      hasilValue: '22.46',
      kategori: 'Sangat Kurang',
      score: 20,
      standard: 80,
      rekomendasi:
        'Penambahaan beban maupun bentuk latihan sangat perlu ditingkatkan sesuai dengan sasaran latihan',
    },
    {
      id: 'item_6',
      categoryGroup: 'POWER',
      itemName: 'Standing Broad Jump PPLP (Atletik)',
      hasilValue: '2.39',
      kategori: 'Sangat Baik',
      score: 100,
      standard: 80,
      rekomendasi:
        'Kategori tes sangat baik, program kedepan perlu mempertimbangkan untuk fokus pada kelompok otot yang masih lemah',
    },
    {
      id: 'item_7',
      categoryGroup: 'SPEED',
      itemName: 'Lari 300 M (t-100 M, t-100 M, t-100 M)',
      hasilValue: '27.88',
      kategori: 'Sangat Baik',
      score: 100,
      standard: 80,
      rekomendasi:
        'Kategori tes sangat baik, program kedepan perlu mempertimbangkan untuk fokus pada kelompok otot yang masih lemah',
    },
    {
      id: 'item_8',
      categoryGroup: 'Vo2 MAX',
      itemName: 'Bleep Test',
      hasilValue: '42.2',
      kategori: 'Kurang',
      score: 40,
      standard: 80,
      rekomendasi:
        'Untuk mencapai ke kategori yang lebih baik maka fokuskan latihan kepada kelompok otot yang terlibat sesuai dengan gerakan yang dibutuhkan',
    },
  ],

  koordinatorNama: 'Dr. Iyakrus, M.Kes.',
  koordinatorJabatan: 'Koordinator Test',
  evaluatorNama: 'Dr. Arizky Ramadhan, M.Pd.',
  evaluatorJabatan: 'Evaluator',
  tempatTanggalTtd: 'Palembang, 14 December 2025',
};

// 2. PETANQUE SPECIFIC SAMPLE PROFILE
const PETANQUE_SAMPLE_HERI: AthletePdfProfile = {
  orgName: 'FEDERASI OLAHRAGA PETANQUE INDONESIA (FOPI)',
  orgAddress: 'Pusat Pelatihan Petanque Nasional • Gelora Sriwijaya Jakabaring Palembang',
  orgContact: 'Telpon 081234567890 Email : petanque.indonesia@fopi.org',
  docTitle1: 'HASIL TEST KEBUGARAN FISIK & KETERAMPILAN PETANQUE',
  docTitle2: 'GRAFIK EVALUASI FISIK & TEKNIK ATLET PETANQUE',

  tanggalTest: '12 Januari 2026',
  nama: 'Heri (Pointer Utama)',
  cabangOlahraga: 'PETANQUE',
  nomorSpesialisasi: 'Triple Men / Pointing Specialist',
  jenisKelamin: 'Pria',
  tanggalLahir: '15 Mei 1998',
  prestasiAkhir: 'Medali Emas Kejurnas Petanque 2025',
  prestasiTertinggi: 'Medali Emas SEA Games (Triple Men)',
  photoUrl: null,

  beratKg: 68,
  tinggiCm: 172,
  aspekPengukuran: 'Tes Kebugaran Fisik & Tes Keterampilan Khusus Petanque',

  items: [
    {
      id: 'pet_1',
      categoryGroup: 'FLEXIBILITY',
      itemName: 'Sit and Reach (Fleksibilitas Pinggang)',
      hasilValue: '38',
      kategori: 'Baik',
      score: 80,
      standard: 80,
      rekomendasi:
        'Pertahankan kelenturan panggul dan pinggang untuk menjaga kestabilan posisi jongkok (squat) saat pointing.',
    },
    {
      id: 'pet_2',
      categoryGroup: 'MUSCULAR ENDURANCE',
      itemName: 'Push Up 1 Menit (Daya Tahan Lengan)',
      hasilValue: '44',
      kategori: 'Sangat Baik',
      score: 100,
      standard: 80,
      rekomendasi:
        'Kekuatan otot lengan dan bahu sangat prima mendukung konsistensi backswing bosi.',
    },
    {
      id: 'pet_3',
      categoryGroup: 'MUSCULAR ENDURANCE',
      itemName: 'Wall Squat Hold 2 Menit (Daya Tahan Tungkai)',
      hasilValue: '120 dt',
      kategori: 'Sangat Baik',
      score: 100,
      standard: 80,
      rekomendasi:
        'Daya tahan statis tungkai bawah sangat baik dalam mempertahankan posisi stabil di circle.',
    },
    {
      id: 'pet_4',
      categoryGroup: 'POWER',
      itemName: 'Medicine Ball Throw (Power Lengan)',
      hasilValue: '5.8 m',
      kategori: 'Baik',
      score: 80,
      standard: 80,
      rekomendasi:
        'Power eksplosif lengan cukup baik untuk lemparan jarak jauh 9m-10m.',
    },
    {
      id: 'pet_5',
      categoryGroup: 'PRECISION POINTING',
      itemName: 'Akurasi Pointing (Jarak 6m - 10m)',
      hasilValue: '85.5%',
      kategori: 'Sangat Baik',
      score: 100,
      standard: 80,
      rekomendasi:
        'Akurasi pointing mencapai standar elit podium emas (≥80%). Terus pertahankan kontrol jarak.',
    },
    {
      id: 'pet_6',
      categoryGroup: 'PRECISION SHOOTING',
      itemName: 'Shooting Bengkel FOPI (Score 60P)',
      hasilValue: '36 Poin',
      kategori: 'Baik',
      score: 80,
      standard: 80,
      rekomendasi:
        'Capaian 36 poin masuk kategori baik. Tingkatkan latihan sasaran bosi terhalang (Figure 2 & 4).',
    },
    {
      id: 'pet_7',
      categoryGroup: 'SPEED & AGILITY',
      itemName: 'Shuttle Run 4x5 M (Kelincahan Lapangan)',
      hasilValue: '11.20 dt',
      kategori: 'Baik',
      score: 80,
      standard: 80,
      rekomendasi:
        'Kecepatan reaksi dan kelincahan atlet di area bosi sangat mendukung mobilitas antar end.',
    },
    {
      id: 'pet_8',
      categoryGroup: 'Vo2 MAX',
      itemName: 'Bleep Test (Daya Tahan Kardiovaskular)',
      hasilValue: '48.5',
      kategori: 'Baik',
      score: 80,
      standard: 80,
      rekomendasi:
        'Kebugaran kardiorespirasi sangat prima menunjang durasi pertandingan panjang babak final (2-3 jam).',
    },
  ],

  koordinatorNama: 'Dr. Iyakrus, M.Kes.',
  koordinatorJabatan: 'Koordinator Bidang Kepelatihan',
  evaluatorNama: 'Dr. Arizky Ramadhan, M.Pd.',
  evaluatorJabatan: 'Evaluator Tes Fisik & Performa',
  tempatTanggalTtd: 'Palembang, 15 Januari 2026',
};

interface AthleteTestPdfReportProps {
  match?: Match;
  selectedPlayer?: Player | null;
}

export default function AthleteTestPdfReport({
  match,
  selectedPlayer,
}: AthleteTestPdfReportProps) {
  const [profile, setProfile] = useState<AthletePdfProfile>(() => OFFICIAL_SRIWIJAYA_SAMPLE);
  const [activeViewMode, setActiveViewMode] = useState<'preview' | 'editor'>('preview');
  const [previewPageFilter, setPreviewPageFilter] = useState<'all' | 'page1' | 'page2'>('all');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto calculate BMI (Indeks Masa Tubuh)
  const imtData = useMemo(() => {
    if (!profile.tinggiCm || !profile.beratKg) {
      return { imtValue: '0.00', status: 'Normal' };
    }
    const tinggiMeter = profile.tinggiCm / 100;
    const imt = profile.beratKg / (tinggiMeter * tinggiMeter);
    let status = 'Normal';
    if (imt < 18.5) status = 'Kurus';
    else if (imt <= 24.9) status = 'Normal';
    else if (imt <= 29.9) status = 'Kelebihan Berat Badan';
    else status = 'Obesitas';
    return {
      imtValue: imt.toFixed(2),
      status,
    };
  }, [profile.beratKg, profile.tinggiCm]);

  // Calculate overall performance % and category conclusion
  const performanceSummary = useMemo(() => {
    if (profile.items.length === 0) {
      return { avgScore: 0, kesimpulanLabel: 'SEDANG', pct: '0%' };
    }
    const total = profile.items.reduce((acc, curr) => acc + curr.score, 0);
    const avg = Math.round(total / profile.items.length);

    let kesimpulanLabel = 'SEDANG';
    if (avg >= 90) kesimpulanLabel = 'SANGAT BAIK';
    else if (avg >= 75) kesimpulanLabel = 'BAIK';
    else if (avg >= 55) kesimpulanLabel = 'SEDANG';
    else if (avg >= 35) kesimpulanLabel = 'KURANG';
    else kesimpulanLabel = 'SANGAT KURANG';

    return {
      avgScore: avg,
      kesimpulanLabel,
      pct: `${avg}%`,
    };
  }, [profile.items]);

  // Handle image upload for athlete photo
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfile((prev) => ({ ...prev, photoUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Switch to Athlete from current active match
  const handleLoadAthleteFromMatch = (player: Player) => {
    if (!match) return;
    const pActions = match.actions.filter((a) => a.playerId === player.id);
    const ptTotal = pActions.filter((a) => a.actionType === 'POINTING').length;
    const ptSucc = pActions.filter((a) => a.actionType === 'POINTING' && a.result === 'SUCCESS').length;
    const ptPct = ptTotal > 0 ? ((ptSucc / ptTotal) * 100).toFixed(1) + '%' : '78.5%';

    const shTotal = pActions.filter((a) => a.actionType === 'SHOOTING').length;
    const shSucc = pActions.filter((a) => a.actionType === 'SHOOTING' && a.result === 'SUCCESS').length;
    const shPct = shTotal > 0 ? ((shSucc / shTotal) * 100).toFixed(1) + '%' : '65.0%';

    const teamName = player.teamId === match.teamA.id ? match.teamA.name : match.teamB.name;

    setProfile({
      ...PETANQUE_SAMPLE_HERI,
      nama: player.name,
      cabangOlahraga: 'PETANQUE',
      nomorSpesialisasi: `${player.role || 'Player'} (${teamName})`,
      jenisKelamin: 'Pria',
      tanggalTest: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
      items: [
        {
          id: 'item_1',
          categoryGroup: 'FLEXIBILITY',
          itemName: 'Sit and Reach',
          hasilValue: '40 cm',
          kategori: 'Baik',
          score: 80,
          standard: 80,
          rekomendasi: 'Kelenturan otot punggung dan hamstring sangat stabil saat rotasi circle.',
        },
        {
          id: 'item_2',
          categoryGroup: 'MUSCULAR ENDURANCE',
          itemName: 'Push Up (1 Menit)',
          hasilValue: '38',
          kategori: 'Baik',
          score: 80,
          standard: 80,
          rekomendasi: 'Daya tahan otot trisep dan deltoid mendukung pelepasan bosi konsisten.',
        },
        {
          id: 'item_3',
          categoryGroup: 'MUSCULAR ENDURANCE',
          itemName: 'Plank Hold (Core Stability)',
          hasilValue: '90 dt',
          kategori: 'Baik',
          score: 80,
          standard: 80,
          rekomendasi: 'Stabilitas core trunk mendukung posture balance saat melempar.',
        },
        {
          id: 'item_4',
          categoryGroup: 'PETANQUE TECHNIQUE',
          itemName: `Efektivitas Pointing (${ptTotal} Throw)`,
          hasilValue: ptPct,
          kategori: parseFloat(ptPct) >= 80 ? 'Sangat Baik' : 'Baik',
          score: parseFloat(ptPct) >= 80 ? 100 : 80,
          standard: 80,
          rekomendasi: `Performa akurasi pointing mencapai ${ptPct}. Sangat realistis untuk podium kejuaraan.`,
        },
        {
          id: 'item_5',
          categoryGroup: 'PETANQUE TECHNIQUE',
          itemName: `Efektivitas Shooting (${shTotal} Throw)`,
          hasilValue: shPct,
          kategori: parseFloat(shPct) >= 70 ? 'Baik' : 'Sedang',
          score: parseFloat(shPct) >= 70 ? 80 : 60,
          standard: 80,
          rekomendasi: `Tingkatkan drill tembakan bosi besi jarak 8m - 9m untuk menambah konversi carreau.`,
        },
        {
          id: 'item_6',
          categoryGroup: 'POWER',
          itemName: 'Standing Broad Jump',
          hasilValue: '2.45 m',
          kategori: 'Sangat Baik',
          score: 100,
          standard: 80,
          rekomendasi: 'Daya ledak tungkai sangat optimal untuk postur dorongan bawah.',
        },
        {
          id: 'item_7',
          categoryGroup: 'SPEED & AGILITY',
          itemName: 'Shuttle Run 4x5 M',
          hasilValue: '11.05 dt',
          kategori: 'Baik',
          score: 80,
          standard: 80,
          rekomendasi: 'Kelincahan dan kecepatan atlet berpindah posisi terpantau sangat baik.',
        },
        {
          id: 'item_8',
          categoryGroup: 'Vo2 MAX',
          itemName: 'Bleep Test (Kapasitas Aerobik)',
          hasilValue: '46.8',
          kategori: 'Baik',
          score: 80,
          standard: 80,
          rekomendasi: 'Kebugaran aerobik cukup untuk menopang ritme turnamen sistem gugur.',
        },
      ],
    });
    setActiveViewMode('preview');
  };

  // Helper badge color
  const getBadgeStyle = (kategori: CategoryGrade) => {
    switch (kategori) {
      case 'Sangat Baik':
        return 'bg-[#00c853] text-white font-bold';
      case 'Baik':
        return 'bg-[#22c55e] text-white font-bold';
      case 'Sedang':
        return 'bg-[#eab308] text-slate-900 font-bold';
      case 'Kurang':
        return 'bg-[#ea580c] text-white font-bold';
      case 'Sangat Kurang':
        return 'bg-[#dc2626] text-white font-bold';
      default:
        return 'bg-slate-200 text-slate-800';
    }
  };

  // Trigger browser native print for pixel-perfect multi-page A4 PDF
  const handlePrint = () => {
    window.print();
  };

  // SVG Radar / Spider Chart Math calculations matching Page 2
  const radarItems = profile.items.slice(0, 8); // 8 axes
  const chartSize = 520;
  const center = chartSize / 2;
  const radius = 170; // Outer radius (scale 100)
  const levels = [20, 40, 60, 80, 100];
  const numAxes = radarItems.length || 8;

  // Compute coordinates for a given axis and value (0-100)
  const getCoordinates = (axisIndex: number, value: number) => {
    const angle = (Math.PI * 2 * axisIndex) / numAxes - Math.PI / 2;
    const r = (value / 100) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y, angle };
  };

  // Polygon points string for Hasil Test 1
  const testPolygonPoints = radarItems
    .map((item, i) => {
      const { x, y } = getCoordinates(i, item.score);
      return `${x},${y}`;
    })
    .join(' ');

  // Polygon points string for Standard Nilai (default 80)
  const standardPolygonPoints = radarItems
    .map((item, i) => {
      const { x, y } = getCoordinates(i, item.standard || 80);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="space-y-6">
      {/* 1. TOP TOOLBAR & CONTROLS (HIDDEN DURING PRINT) */}
      <div className="no-print bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-[#002395] text-white p-1.5 rounded-md">
                <Printer className="w-4 h-4" />
              </span>
              <h2 className="text-xl font-black text-slate-900 font-['Outfit']">
                Laporan & Hasil Test Atlet (Format PDF Resmi)
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Format 2 halaman standar resmi Sriwijaya Sang Juara / Universitas Sriwijaya dengan tabel komponen, kategori warna & grafik spider web.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setActiveViewMode(activeViewMode === 'preview' ? 'editor' : 'preview')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors flex items-center gap-1.5 ${
                activeViewMode === 'editor'
                  ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
            >
              {activeViewMode === 'editor' ? (
                <>
                  <Eye className="w-3.5 h-3.5" />
                  <span>Lihat Pratinjau PDF</span>
                </>
              ) : (
                <>
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Data & Nilai</span>
                </>
              )}
            </button>

            <button
              onClick={handlePrint}
              className="px-4 py-1.5 bg-[#002395] hover:bg-[#001c77] text-white rounded-lg text-xs font-bold shadow-md transition-all flex items-center gap-1.5 ring-2 ring-blue-300 active:scale-95"
              title="Buka dialog Cetak / Simpan PDF (A4 2 Halaman)"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Download PDF (A4)</span>
            </button>
          </div>
        </div>

        {/* Preset Switcher Bar */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-slate-500 uppercase tracking-wider text-[11px]">
              Preset Template:
            </span>
            <button
              onClick={() => {
                setProfile(OFFICIAL_SRIWIJAYA_SAMPLE);
                setActiveViewMode('preview');
              }}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-md font-semibold text-[11px] transition-colors"
            >
              📄 Sri Maya Sari (Atletik - Format PDF Asli)
            </button>
            <button
              onClick={() => {
                setProfile(PETANQUE_SAMPLE_HERI);
                setActiveViewMode('preview');
              }}
              className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-[#002395] rounded-md font-semibold text-[11px] transition-colors border border-blue-200"
            >
              🎯 Heri (Petanque Pointer)
            </button>

            {/* If there's an active match, allow quick selection */}
            {match && (
              <div className="relative inline-block">
                <select
                  onChange={(e) => {
                    const allP = [...match.teamA.players, ...match.teamB.players];
                    const target = allP.find((p) => p.id === e.target.value);
                    if (target) handleLoadAthleteFromMatch(target);
                  }}
                  defaultValue=""
                  className="bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-md px-2.5 py-1 font-semibold text-[11px] outline-none cursor-pointer hover:bg-emerald-100"
                >
                  <option value="" disabled>
                    ⚡ Impor dari Atlet Pertandingan...
                  </option>
                  <optgroup label={match.teamA.name}>
                    {match.teamA.players.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.role || 'Athlete'})
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label={match.teamB.name}>
                    {match.teamB.players.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.role || 'Athlete'})
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>
            )}
          </div>

          {/* Quick Page View Toggle */}
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-md text-[11px]">
            <span className="text-slate-500 font-medium px-1.5">Tampilan:</span>
            <button
              onClick={() => setPreviewPageFilter('all')}
              className={`px-2 py-0.5 rounded font-bold ${
                previewPageFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Kedua Halaman (1 & 2)
            </button>
            <button
              onClick={() => setPreviewPageFilter('page1')}
              className={`px-2 py-0.5 rounded font-bold ${
                previewPageFilter === 'page1'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Halaman 1 (Tabel)
            </button>
            <button
              onClick={() => setPreviewPageFilter('page2')}
              className={`px-2 py-0.5 rounded font-bold ${
                previewPageFilter === 'page2'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Halaman 2 (Grafik)
            </button>
          </div>
        </div>

        {/* Tip for Saving PDF */}
        <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg p-2.5 flex items-start gap-2 text-[11px] text-amber-900">
          <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <strong>Panduan Menyimpan File PDF:</strong> Klik tombol{' '}
            <strong>"Cetak / Download PDF (A4)"</strong> di atas. Di jendela cetak browser Anda, pilih{' '}
            <strong>Destination / Tujuan: "Save as PDF" (Simpan sebagai PDF)</strong>, pastikan Paper Size{' '}
            <strong>A4</strong> dan centang opsi <strong>"Background graphics" (Grafik latar belakang)</strong> agar warna badge dan grafik tercetak jernih.
          </div>
        </div>
      </div>

      {/* 2. EDITOR DRAWER / FORM (WHEN IN EDITOR MODE) */}
      {activeViewMode === 'editor' && (
        <div className="no-print bg-white rounded-xl border border-amber-300 p-5 shadow-md space-y-5 animate-in fade-in duration-150">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
              <Edit3 className="w-4 h-4 text-amber-600" />
              <span>Formulir Pengaturan Data Laporan Atlet</span>
            </div>
            <button
              onClick={() => setActiveViewMode('preview')}
              className="text-xs text-[#002395] hover:underline font-bold"
            >
              Selesai Mengedit & Pratinjau →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* Kop & Instansi */}
            <div className="space-y-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
              <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                1. Kop Lembaga & Dokumen
              </h4>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Nama Organisasi/Kop:</label>
                <input
                  type="text"
                  value={profile.orgName}
                  onChange={(e) => setProfile({ ...profile, orgName: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded px-2 py-1 font-bold text-slate-800"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Alamat Lembaga:</label>
                <input
                  type="text"
                  value={profile.orgAddress}
                  onChange={(e) => setProfile({ ...profile, orgAddress: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-slate-800"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Telepon & Email:</label>
                <input
                  type="text"
                  value={profile.orgContact}
                  onChange={(e) => setProfile({ ...profile, orgContact: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-slate-800"
                />
              </div>
            </div>

            {/* Biodata Atlet */}
            <div className="space-y-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
              <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                2. Biodata Atlet
              </h4>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Nama Atlet:</label>
                <input
                  type="text"
                  value={profile.nama}
                  onChange={(e) => setProfile({ ...profile, nama: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded px-2 py-1 font-bold text-slate-800"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Cabang Olahraga:</label>
                  <input
                    type="text"
                    value={profile.cabangOlahraga}
                    onChange={(e) => setProfile({ ...profile, cabangOlahraga: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded px-2 py-1 font-bold text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Jenis Kelamin:</label>
                  <select
                    value={profile.jenisKelamin}
                    onChange={(e) =>
                      setProfile({ ...profile, jenisKelamin: e.target.value as 'Pria' | 'Wanita' })
                    }
                    className="w-full bg-white border border-slate-300 rounded px-2 py-1 font-semibold text-slate-800"
                  >
                    <option value="Wanita">Wanita</option>
                    <option value="Pria">Pria</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Nomor / Spesialisasi:</label>
                <input
                  type="text"
                  value={profile.nomorSpesialisasi}
                  onChange={(e) => setProfile({ ...profile, nomorSpesialisasi: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-slate-800"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Tanggal Test:</label>
                  <input
                    type="text"
                    value={profile.tanggalTest}
                    onChange={(e) => setProfile({ ...profile, tanggalTest: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Tanggal Lahir:</label>
                  <input
                    type="text"
                    value={profile.tanggalLahir}
                    onChange={(e) => setProfile({ ...profile, tanggalLahir: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-slate-800"
                  />
                </div>
              </div>
            </div>

            {/* Antropometri & Tanda Tangan */}
            <div className="space-y-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
              <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                3. Antropometri & Penandatangan
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Berat Badan (Kg):</label>
                  <input
                    type="number"
                    value={profile.beratKg}
                    onChange={(e) => setProfile({ ...profile, beratKg: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-white border border-slate-300 rounded px-2 py-1 font-bold text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Tinggi Badan (Cm):</label>
                  <input
                    type="number"
                    value={profile.tinggiCm}
                    onChange={(e) => setProfile({ ...profile, tinggiCm: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-white border border-slate-300 rounded px-2 py-1 font-bold text-slate-800"
                  />
                </div>
              </div>
              <div className="text-[11px] text-slate-600 bg-white p-1.5 rounded border border-slate-200">
                IMT Otomatis: <strong>{imtData.imtValue} ({imtData.status})</strong>
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Koordinator Test:</label>
                <input
                  type="text"
                  value={profile.koordinatorNama}
                  onChange={(e) => setProfile({ ...profile, koordinatorNama: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-slate-800"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Evaluator & Lokasi/Tgl:</label>
                <input
                  type="text"
                  value={profile.evaluatorNama}
                  onChange={(e) => setProfile({ ...profile, evaluatorNama: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-slate-800 mb-1"
                />
                <input
                  type="text"
                  value={profile.tempatTanggalTtd}
                  onChange={(e) => setProfile({ ...profile, tempatTanggalTtd: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* Table Items Editor */}
          <div className="pt-3 border-t border-slate-200">
            <h4 className="font-bold text-slate-800 uppercase tracking-wider text-xs mb-2">
              Daftar Komponen & Hasil Tes (Mempengaruhi Tabel Hal. 1 & Grafik Radar Hal. 2)
            </h4>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {profile.items.map((item, idx) => (
                <div
                  key={item.id}
                  className="grid grid-cols-12 gap-2 items-center bg-slate-50 p-2 rounded border border-slate-200 text-xs"
                >
                  <div className="col-span-1 text-center font-bold text-slate-500">{idx + 1}</div>
                  <div className="col-span-3">
                    <input
                      type="text"
                      value={item.itemName}
                      onChange={(e) => {
                        const next = [...profile.items];
                        next[idx].itemName = e.target.value;
                        setProfile({ ...profile, items: next });
                      }}
                      className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-slate-800 font-medium"
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="text"
                      value={item.hasilValue}
                      placeholder="Nilai Hasil"
                      onChange={(e) => {
                        const next = [...profile.items];
                        next[idx].hasilValue = e.target.value;
                        setProfile({ ...profile, items: next });
                      }}
                      className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-center font-bold text-slate-800"
                    />
                  </div>
                  <div className="col-span-2">
                    <select
                      value={item.kategori}
                      onChange={(e) => {
                        const cat = e.target.value as CategoryGrade;
                        const scoreMap: Record<CategoryGrade, number> = {
                          'Sangat Baik': 100,
                          Baik: 80,
                          Sedang: 60,
                          Kurang: 40,
                          'Sangat Kurang': 20,
                        };
                        const next = [...profile.items];
                        next[idx].kategori = cat;
                        next[idx].score = scoreMap[cat];
                        setProfile({ ...profile, items: next });
                      }}
                      className="w-full bg-white border border-slate-300 rounded px-2 py-1 font-bold text-slate-800"
                    >
                      <option value="Sangat Baik">Sangat Baik (100)</option>
                      <option value="Baik">Baik (80)</option>
                      <option value="Sedang">Sedang (60)</option>
                      <option value="Kurang">Kurang (40)</option>
                      <option value="Sangat Kurang">Sangat Kurang (20)</option>
                    </select>
                  </div>
                  <div className="col-span-4">
                    <input
                      type="text"
                      value={item.rekomendasi}
                      placeholder="Rekomendasi Latihan"
                      onChange={(e) => {
                        const next = [...profile.items];
                        next[idx].rekomendasi = e.target.value;
                        setProfile({ ...profile, items: next });
                      }}
                      className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-slate-700 text-[11px]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. PRINTABLE PAGES CONTAINER (AUTHENTIC PIXEL-PERFECT A4 SHEETS) */}
      <div className="flex flex-col items-center gap-8 py-2">
        {/* ========================================================================= */}
        {/* HALAMAN 1: BIODATA, ANTROPOMETRI, TABEL KOMPONEN & TANDA TANGAN */}
        {/* ========================================================================= */}
        {(previewPageFilter === 'all' || previewPageFilter === 'page1') && (
          <div
            id="print-sheet-page-1"
            className="athlete-pdf-page bg-white w-full max-w-[210mm] min-h-[297mm] p-8 sm:p-10 shadow-xl border border-slate-300 rounded-sm flex flex-col justify-between text-black font-sans leading-tight relative"
            style={{
              fontFamily: 'Arial, "Helvetica Neue", Helvetica, sans-serif',
              boxSizing: 'border-box',
            }}
          >
            <div>
              {/* Kop Surat Resmi */}
              <div className="flex items-center justify-between pb-3 relative">
                {/* Logo Test FILIT (Authentic Red Running Athlete Icon) */}
                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 flex flex-col items-center justify-center">
                    <svg viewBox="0 0 100 100" className="w-11 h-11">
                      {/* Stylized Red Figure */}
                      <circle cx="50" cy="22" r="11" fill="#dc2626" />
                      <path
                        d="M32 45 C 32 38, 42 35, 52 35 C 62 35, 72 40, 72 48 C 65 52, 58 55, 52 64 L 62 90 L 50 90 L 42 70 L 32 88 L 22 88 L 36 58 Z"
                        fill="#dc2626"
                      />
                      <path
                        d="M20 48 L 40 40 L 48 48 L 30 58 Z"
                        fill="#b91c1c"
                      />
                    </svg>
                    <span className="text-[10px] font-black text-[#dc2626] tracking-tighter leading-none -mt-1">
                      TEST FILIT
                    </span>
                  </div>
                </div>

                {/* Kop Text Centered / Right */}
                <div className="flex-1 text-center pr-12">
                  <h1 className="text-xl sm:text-2xl font-black text-black tracking-tight uppercase">
                    {profile.orgName}
                  </h1>
                  <p className="text-[11px] sm:text-xs text-black mt-0.5 font-normal">
                    {profile.orgAddress}
                  </p>
                  <p className="text-[11px] sm:text-xs text-black font-normal">
                    {profile.orgContact}
                  </p>
                </div>
              </div>

              {/* Thick Divider Line */}
              <div className="w-full border-b-[2.5px] border-black mb-5" />

              {/* Document Title */}
              <h2 className="text-center text-base sm:text-lg font-black uppercase tracking-wider text-black mb-6">
                {profile.docTitle1}
              </h2>

              {/* Biodata Atlet & Antropometri (Left) + Foto (Right) */}
              <div className="grid grid-cols-12 gap-4 items-start mb-6">
                {/* Biodata & Antropometri Column */}
                <div className="col-span-8 sm:col-span-9 space-y-3.5 text-xs text-black">
                  {/* Biodata Atlet */}
                  <div>
                    <h3 className="font-bold text-xs uppercase mb-1.5 text-black">
                      BIODATA ATLET
                    </h3>
                    <table className="w-full text-xs">
                      <tbody>
                        <tr>
                          <td className="w-44 py-0.5 font-normal">Tanggal Test</td>
                          <td className="w-4 py-0.5">:</td>
                          <td className="py-0.5 font-normal">{profile.tanggalTest}</td>
                        </tr>
                        <tr>
                          <td className="py-0.5 font-normal">Nama</td>
                          <td className="py-0.5">:</td>
                          <td className="py-0.5 font-normal capitalize">{profile.nama}</td>
                        </tr>
                        <tr>
                          <td className="py-0.5 font-normal">Cabang Olahraga</td>
                          <td className="py-0.5">:</td>
                          <td className="py-0.5 font-normal uppercase">{profile.cabangOlahraga}</td>
                        </tr>
                        <tr>
                          <td className="py-0.5 font-normal">Nomor / Spesialisasi / Kelas</td>
                          <td className="py-0.5">:</td>
                          <td className="py-0.5 font-normal">{profile.nomorSpesialisasi}</td>
                        </tr>
                        <tr>
                          <td className="py-0.5 font-normal">Jenis Kelamin</td>
                          <td className="py-0.5">:</td>
                          <td className="py-0.5 font-normal">{profile.jenisKelamin}</td>
                        </tr>
                        <tr>
                          <td className="py-0.5 font-normal">Tanggal Lahir</td>
                          <td className="py-0.5">:</td>
                          <td className="py-0.5 font-normal">{profile.tanggalLahir}</td>
                        </tr>
                        <tr>
                          <td className="py-0.5 font-normal">Prestasi Akhir</td>
                          <td className="py-0.5">:</td>
                          <td className="py-0.5 font-normal">{profile.prestasiAkhir}</td>
                        </tr>
                        <tr>
                          <td className="py-0.5 font-normal">Prestasi Tertinggi</td>
                          <td className="py-0.5">:</td>
                          <td className="py-0.5 font-normal">{profile.prestasiTertinggi}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Pengukuran Antropometri */}
                  <div>
                    <h3 className="font-bold text-xs uppercase mb-1.5 text-black">
                      PENGUKURAN ANTROPOMETRI
                    </h3>
                    <table className="w-full text-xs">
                      <tbody>
                        <tr>
                          <td className="w-44 py-0.5 font-normal">Berat</td>
                          <td className="w-4 py-0.5">:</td>
                          <td className="py-0.5 font-normal">{profile.beratKg} Kg</td>
                        </tr>
                        <tr>
                          <td className="py-0.5 font-normal">Tinggi</td>
                          <td className="py-0.5">:</td>
                          <td className="py-0.5 font-normal">{profile.tinggiCm} Cm</td>
                        </tr>
                        <tr>
                          <td className="py-0.5 font-normal">Indeks Masa Tubuh</td>
                          <td className="py-0.5">:</td>
                          <td className="py-0.5 font-normal">
                            {imtData.imtValue} ({imtData.status})
                          </td>
                        </tr>
                        <tr>
                          <td className="py-0.5 font-normal">Aspek Pengukuran</td>
                          <td className="py-0.5">:</td>
                          <td className="py-0.5 font-normal">{profile.aspekPengukuran}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Foto Atlet Silhouette Box on Right */}
                <div className="col-span-4 sm:col-span-3 flex flex-col items-center justify-center">
                  <div className="w-28 h-36 sm:w-32 sm:h-40 bg-slate-100 rounded-sm border border-slate-300 flex flex-col items-center justify-center overflow-hidden relative shadow-2xs">
                    {profile.photoUrl ? (
                      <img
                        src={profile.photoUrl}
                        alt="Foto Atlet"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-slate-400">
                        {/* Authentic head & shoulders silhouette */}
                        <div className="w-16 h-16 rounded-full bg-slate-300 mb-1" />
                        <div className="w-24 h-14 bg-slate-300 rounded-t-full" />
                      </div>
                    )}

                    {/* Change Photo Button (Hidden on Print) */}
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="no-print absolute bottom-1 text-[9px] bg-black/70 hover:bg-black text-white px-2 py-0.5 rounded font-bold transition-colors"
                    >
                      Ganti Foto
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Tabel Komponen dan Hasil Test */}
              <div className="mb-6">
                <h3 className="font-bold text-xs uppercase mb-2 text-black">
                  KOMPONEN DAN HASIL TEST
                </h3>

                <table className="w-full border-collapse border border-black text-[11px] text-black">
                  <thead>
                    <tr className="bg-white border-b border-black">
                      <th className="border border-black py-1.5 px-2 text-center font-bold w-8">
                        NO
                      </th>
                      <th className="border border-black py-1.5 px-2 text-left font-bold w-48">
                        KOMPONEN FISIK<br />& JENIS TEST
                      </th>
                      <th className="border border-black py-1.5 px-2 text-center font-bold w-20">
                        HASIL<br />TEST 1
                      </th>
                      <th className="border border-black py-1.5 px-2 text-center font-bold w-24">
                        KATEGORI
                      </th>
                      <th className="border border-black py-1.5 px-2 text-left font-bold">
                        REKOMENDASI
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Render Group 1: FLEXIBILITY */}
                    {(() => {
                      const flexItems = profile.items.filter((i) => i.categoryGroup === 'FLEXIBILITY');
                      return (
                        <>
                          <tr className="border-t border-black font-bold">
                            <td className="border border-black text-center py-1">1</td>
                            <td colSpan={4} className="border border-black px-2 py-1 uppercase">
                              FLEXIBILITY
                            </td>
                          </tr>
                          {flexItems.map((item) => (
                            <tr key={item.id} className="border-b border-black">
                              <td className="border border-black text-center py-1.5"></td>
                              <td className="border border-black px-2 py-1.5 font-normal">
                                {item.itemName}
                              </td>
                              <td className="border border-black text-center py-1.5 font-normal">
                                {item.hasilValue}
                              </td>
                              <td
                                className={`border border-black text-center py-1.5 px-1 text-[10px] ${getBadgeStyle(
                                  item.kategori
                                )}`}
                              >
                                {item.kategori}
                              </td>
                              <td className="border border-black px-2 py-1.5 text-[10px] leading-snug">
                                {item.rekomendasi}
                              </td>
                            </tr>
                          ))}
                        </>
                      );
                    })()}

                    {/* Render Group 2: MUSCULAR ENDURANCE */}
                    {(() => {
                      const meItems = profile.items.filter((i) => i.categoryGroup === 'MUSCULAR ENDURANCE');
                      return (
                        <>
                          <tr className="border-t border-black font-bold">
                            <td className="border border-black text-center py-1">2</td>
                            <td colSpan={4} className="border border-black px-2 py-1 uppercase">
                              MUSCULAR ENDURANCE
                            </td>
                          </tr>
                          {meItems.map((item) => (
                            <tr key={item.id} className="border-b border-black">
                              <td className="border border-black text-center py-1.5"></td>
                              <td className="border border-black px-2 py-1.5 font-normal">
                                {item.itemName}
                              </td>
                              <td className="border border-black text-center py-1.5 font-normal">
                                {item.hasilValue}
                              </td>
                              <td
                                className={`border border-black text-center py-1.5 px-1 text-[10px] ${getBadgeStyle(
                                  item.kategori
                                )}`}
                              >
                                {item.kategori}
                              </td>
                              <td className="border border-black px-2 py-1.5 text-[10px] leading-snug">
                                {item.rekomendasi}
                              </td>
                            </tr>
                          ))}
                        </>
                      );
                    })()}

                    {/* Render Group 3: POWER */}
                    {(() => {
                      const powerItems = profile.items.filter((i) => i.categoryGroup === 'POWER');
                      return (
                        <>
                          <tr className="border-t border-black font-bold">
                            <td className="border border-black text-center py-1">3</td>
                            <td colSpan={4} className="border border-black px-2 py-1 uppercase">
                              POWER
                            </td>
                          </tr>
                          {powerItems.map((item) => (
                            <tr key={item.id} className="border-b border-black">
                              <td className="border border-black text-center py-1.5"></td>
                              <td className="border border-black px-2 py-1.5 font-normal">
                                {item.itemName}
                              </td>
                              <td className="border border-black text-center py-1.5 font-normal">
                                {item.hasilValue}
                              </td>
                              <td
                                className={`border border-black text-center py-1.5 px-1 text-[10px] ${getBadgeStyle(
                                  item.kategori
                                )}`}
                              >
                                {item.kategori}
                              </td>
                              <td className="border border-black px-2 py-1.5 text-[10px] leading-snug">
                                {item.rekomendasi}
                              </td>
                            </tr>
                          ))}
                        </>
                      );
                    })()}

                    {/* Render Group 4: SPEED */}
                    {(() => {
                      const speedItems = profile.items.filter((i) => i.categoryGroup === 'SPEED' || i.categoryGroup === 'SPEED & AGILITY');
                      if (speedItems.length === 0) return null;
                      return (
                        <>
                          <tr className="border-t border-black font-bold">
                            <td className="border border-black text-center py-1">4</td>
                            <td colSpan={4} className="border border-black px-2 py-1 uppercase">
                              SPEED
                            </td>
                          </tr>
                          {speedItems.map((item) => (
                            <tr key={item.id} className="border-b border-black">
                              <td className="border border-black text-center py-1.5"></td>
                              <td className="border border-black px-2 py-1.5 font-normal">
                                {item.itemName}
                              </td>
                              <td className="border border-black text-center py-1.5 font-normal">
                                {item.hasilValue}
                              </td>
                              <td
                                className={`border border-black text-center py-1.5 px-1 text-[10px] ${getBadgeStyle(
                                  item.kategori
                                )}`}
                              >
                                {item.kategori}
                              </td>
                              <td className="border border-black px-2 py-1.5 text-[10px] leading-snug">
                                {item.rekomendasi}
                              </td>
                            </tr>
                          ))}
                        </>
                      );
                    })()}

                    {/* Render Group 5: Vo2 MAX / Other */}
                    {(() => {
                      const vo2Items = profile.items.filter(
                        (i) => i.categoryGroup === 'Vo2 MAX' || i.categoryGroup === 'PETANQUE TECHNIQUE' || i.categoryGroup === 'PRECISION POINTING' || i.categoryGroup === 'PRECISION SHOOTING'
                      );
                      if (vo2Items.length === 0) return null;
                      return (
                        <>
                          <tr className="border-t border-black font-bold">
                            <td className="border border-black text-center py-1">5</td>
                            <td colSpan={4} className="border border-black px-2 py-1 uppercase">
                              Vo2 MAX
                            </td>
                          </tr>
                          {vo2Items.map((item) => (
                            <tr key={item.id} className="border-b border-black">
                              <td className="border border-black text-center py-1.5"></td>
                              <td className="border border-black px-2 py-1.5 font-normal">
                                {item.itemName}
                              </td>
                              <td className="border border-black text-center py-1.5 font-normal">
                                {item.hasilValue}
                              </td>
                              <td
                                className={`border border-black text-center py-1.5 px-1 text-[10px] ${getBadgeStyle(
                                  item.kategori
                                )}`}
                              >
                                {item.kategori}
                              </td>
                              <td className="border border-black px-2 py-1.5 text-[10px] leading-snug">
                                {item.rekomendasi}
                              </td>
                            </tr>
                          ))}
                        </>
                      );
                    })()}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Tanda Tangan Penanggung Jawab (Bottom of Page 1) */}
            <div className="pt-6 flex justify-between items-end text-xs text-black">
              {/* Koordinator Test */}
              <div className="text-left">
                <p className="font-normal mb-16">{profile.koordinatorJabatan}</p>
                <p className="font-bold underline">{profile.koordinatorNama}</p>
              </div>

              {/* Evaluator & Date */}
              <div className="text-left w-56">
                <p className="font-normal mb-16">{profile.tempatTanggalTtd}</p>
                <p className="font-bold underline">{profile.evaluatorNama}</p>
                <p className="font-normal">{profile.evaluatorJabatan}</p>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* HALAMAN 2: GRAFIK RADAR SPIDER WEB HASIL TEST FISIK ATLET */}
        {/* ========================================================================= */}
        {(previewPageFilter === 'all' || previewPageFilter === 'page2') && (
          <div
            id="print-sheet-page-2"
            className="athlete-pdf-page bg-white w-full max-w-[210mm] min-h-[297mm] p-8 sm:p-10 shadow-xl border border-slate-300 rounded-sm flex flex-col justify-between text-black font-sans leading-tight relative"
            style={{
              fontFamily: 'Arial, "Helvetica Neue", Helvetica, sans-serif',
              boxSizing: 'border-box',
            }}
          >
            <div>
              {/* Kop Surat Resmi (Sama persis dengan Halaman 1) */}
              <div className="flex items-center justify-between pb-3 relative">
                {/* Logo Test FILIT */}
                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 flex flex-col items-center justify-center">
                    <svg viewBox="0 0 100 100" className="w-11 h-11">
                      <circle cx="50" cy="22" r="11" fill="#dc2626" />
                      <path
                        d="M32 45 C 32 38, 42 35, 52 35 C 62 35, 72 40, 72 48 C 65 52, 58 55, 52 64 L 62 90 L 50 90 L 42 70 L 32 88 L 22 88 L 36 58 Z"
                        fill="#dc2626"
                      />
                      <path
                        d="M20 48 L 40 40 L 48 48 L 30 58 Z"
                        fill="#b91c1c"
                      />
                    </svg>
                    <span className="text-[10px] font-black text-[#dc2626] tracking-tighter leading-none -mt-1">
                      TEST FILIT
                    </span>
                  </div>
                </div>

                {/* Kop Text */}
                <div className="flex-1 text-center pr-12">
                  <h1 className="text-xl sm:text-2xl font-black text-black tracking-tight uppercase">
                    {profile.orgName}
                  </h1>
                  <p className="text-[11px] sm:text-xs text-black mt-0.5 font-normal">
                    {profile.orgAddress}
                  </p>
                  <p className="text-[11px] sm:text-xs text-black font-normal">
                    {profile.orgContact}
                  </p>
                </div>
              </div>

              {/* Thick Divider Line */}
              <div className="w-full border-b-[2.5px] border-black mb-5" />

              {/* Title Page 2 */}
              <h2 className="text-center text-base sm:text-lg font-black uppercase tracking-wider text-black mb-6">
                {profile.docTitle2}
              </h2>

              {/* Biodata Atlet (Ringkas) */}
              <div className="mb-4 text-xs text-black">
                <h3 className="font-bold text-xs uppercase mb-1.5 text-black">
                  BIODATA ATLET
                </h3>
                <table className="w-full text-xs">
                  <tbody>
                    <tr>
                      <td className="w-44 py-0.5 font-normal">Tanggal Test</td>
                      <td className="w-4 py-0.5">:</td>
                      <td className="py-0.5 font-normal">{profile.tanggalTest}</td>
                    </tr>
                    <tr>
                      <td className="py-0.5 font-normal">Nama</td>
                      <td className="py-0.5">:</td>
                      <td className="py-0.5 font-normal capitalize">{profile.nama}</td>
                    </tr>
                    <tr>
                      <td className="py-0.5 font-normal">Cabang Olahraga</td>
                      <td className="py-0.5">:</td>
                      <td className="py-0.5 font-normal uppercase">{profile.cabangOlahraga}</td>
                    </tr>
                    <tr>
                      <td className="py-0.5 font-normal">Nomor / Spesialisasi / Kelas</td>
                      <td className="py-0.5">:</td>
                      <td className="py-0.5 font-normal">{profile.nomorSpesialisasi}</td>
                    </tr>
                    <tr>
                      <td className="py-0.5 font-normal">Jenis Kelamin</td>
                      <td className="py-0.5">:</td>
                      <td className="py-0.5 font-normal">{profile.jenisKelamin}</td>
                    </tr>
                    <tr>
                      <td className="py-0.5 font-normal">Tanggal Lahir</td>
                      <td className="py-0.5">:</td>
                      <td className="py-0.5 font-normal">{profile.tanggalLahir}</td>
                    </tr>
                    <tr>
                      <td className="py-0.5 font-normal">Prestasi Terakhir</td>
                      <td className="py-0.5">:</td>
                      <td className="py-0.5 font-normal">{profile.prestasiAkhir}</td>
                    </tr>
                    <tr>
                      <td className="py-0.5 font-normal">Prestasi Tertinggi</td>
                      <td className="py-0.5">:</td>
                      <td className="py-0.5 font-normal">{profile.prestasiTertinggi}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Framed Radar Chart Container (Matching Screenshot Border Box) */}
              <div className="border border-black p-4 mb-4 flex flex-col items-center justify-center relative">
                {/* SVG Pure Vector Radar Chart for 100% Crisp Print & Screen Fidelity */}
                <div className="w-full flex items-center justify-center relative">
                  <svg
                    viewBox={`0 0 ${chartSize} ${chartSize}`}
                    className="w-full max-w-[480px] h-auto overflow-visible select-none"
                  >
                    {/* Concentric Polygons (Levels 20, 40, 60, 80, 100) */}
                    {levels.map((lvl) => {
                      const points = Array.from({ length: numAxes })
                        .map((_, i) => {
                          const { x, y } = getCoordinates(i, lvl);
                          return `${x},${y}`;
                        })
                        .join(' ');
                      return (
                        <polygon
                          key={lvl}
                          points={points}
                          fill="none"
                          stroke="#94a3b8"
                          strokeWidth="1"
                        />
                      );
                    })}

                    {/* Radial Axis Lines from center to outer ring */}
                    {Array.from({ length: numAxes }).map((_, i) => {
                      const { x, y } = getCoordinates(i, 100);
                      return (
                        <line
                          key={i}
                          x1={center}
                          y1={center}
                          x2={x}
                          y2={y}
                          stroke="#cbd5e1"
                          strokeWidth="1"
                        />
                      );
                    })}

                    {/* Scale Numbers on Vertical Top Axis (0, 20, 40, 60, 80, 100) */}
                    {levels.map((lvl) => {
                      const r = (lvl / 100) * radius;
                      const y = center - r;
                      return (
                        <text
                          key={lvl}
                          x={center - 12}
                          y={y + 4}
                          fontSize="9"
                          fill="#334155"
                          fontWeight="bold"
                          textAnchor="end"
                        >
                          {lvl}
                        </text>
                      );
                    })}
                    <text
                      x={center - 12}
                      y={center + 4}
                      fontSize="9"
                      fill="#334155"
                      fontWeight="bold"
                      textAnchor="end"
                    >
                      0
                    </text>

                    {/* Series 1: Standard Nilai (Blue Polygon & Diamond Markers) */}
                    <polygon
                      points={standardPolygonPoints}
                      fill="#2563eb"
                      fillOpacity="0.08"
                      stroke="#2563eb"
                      strokeWidth="1.8"
                    />
                    {radarItems.map((item, i) => {
                      const { x, y } = getCoordinates(i, item.standard || 80);
                      return (
                        <rect
                          key={`std-${i}`}
                          x={x - 3}
                          y={y - 3}
                          width="6"
                          height="6"
                          transform={`rotate(45 ${x} ${y})`}
                          fill="#2563eb"
                        />
                      );
                    })}

                    {/* Series 2: Hasil Test 1 (Red Polygon & Diamond/Square Markers) */}
                    <polygon
                      points={testPolygonPoints}
                      fill="#dc2626"
                      fillOpacity="0.1"
                      stroke="#dc2626"
                      strokeWidth="2"
                    />
                    {radarItems.map((item, i) => {
                      const { x, y } = getCoordinates(i, item.score);
                      return (
                        <rect
                          key={`test-${i}`}
                          x={x - 3.5}
                          y={y - 3.5}
                          width="7"
                          height="7"
                          fill="#dc2626"
                          stroke="#ffffff"
                          strokeWidth="1"
                        />
                      );
                    })}

                    {/* Axis Labels Around the Perimeter */}
                    {radarItems.map((item, i) => {
                      const { x, y, angle } = getCoordinates(i, 118);
                      // Calculate text anchor based on angle
                      let anchor: 'middle' | 'start' | 'end' = 'middle';
                      if (Math.cos(angle) > 0.3) anchor = 'start';
                      else if (Math.cos(angle) < -0.3) anchor = 'end';

                      return (
                        <text
                          key={`lbl-${i}`}
                          x={x}
                          y={y + 4}
                          textAnchor={anchor}
                          fontSize="9.5"
                          fontWeight="normal"
                          fill="#000000"
                        >
                          {item.itemName}
                        </text>
                      );
                    })}
                  </svg>

                  {/* Legend on Right Side of the Chart (Matching Image) */}
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 text-xs space-y-2 bg-white/90 p-2 rounded">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 bg-[#dc2626]" />
                      <span className="text-[11px] font-bold text-black">Hasil Test1</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 bg-[#2563eb] rotate-45" />
                      <span className="text-[11px] font-bold text-black">Standard Nilai</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Keterangan Nilai Box (Bottom Left) */}
              <div className="mb-4 text-xs text-black">
                <h4 className="font-bold text-xs mb-1">Keterangan Nilai</h4>
                <table className="text-xs">
                  <tbody>
                    <tr>
                      <td className="w-32 py-0.2">Sangat Baik</td>
                      <td className="w-4 py-0.2">:</td>
                      <td className="py-0.2 font-normal">100</td>
                    </tr>
                    <tr>
                      <td className="py-0.2">Baik</td>
                      <td className="py-0.2">:</td>
                      <td className="py-0.2 font-normal">80</td>
                    </tr>
                    <tr>
                      <td className="py-0.2">Sedang</td>
                      <td className="py-0.2">:</td>
                      <td className="py-0.2 font-normal">60</td>
                    </tr>
                    <tr>
                      <td className="py-0.2">Kurang</td>
                      <td className="py-0.2">:</td>
                      <td className="py-0.2 font-normal">40</td>
                    </tr>
                    <tr>
                      <td className="py-0.2">Sangat Kurang</td>
                      <td className="py-0.2">:</td>
                      <td className="py-0.2 font-normal">20</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Box Hasil & Kesimpulan (Bottom Bordered Box Matching Image) */}
              <div className="border border-black p-3 text-black">
                <h4 className="font-bold text-xs mb-0.5">Hasil & Kesimpulan</h4>
                <p className="font-bold text-sm uppercase text-black">
                  {performanceSummary.kesimpulanLabel}
                </p>
                <p className="text-xs font-normal text-black mt-0.5">
                  Performa fisik atlet {performanceSummary.pct}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
