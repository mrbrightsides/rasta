import { NavTab } from './Header';
import {
  Smartphone,
  FileSpreadsheet,
  Target,
  FileCheck2,
  Activity,
  Users,
  Award,
  BookOpen,
  HardDrive,
  ArrowRight,
  ShieldCheck,
  Flame,
  CheckCircle2,
  CircleDot,
  Dumbbell,
  Sparkles,
} from 'lucide-react';
// Verified real Petanque high-resolution photography assets (Public Domain / Creative Commons via Wikimedia Commons)
// Multi-tier fallback ensures images ALWAYS render in production (Vercel, GitHub Pages, Localhost)
// even when the Git repository does not have local binary images committed.
const PETANQUE_MEDIA = {
  heroBanner: {
    cdn: 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Boule.kugel.jpg',
    local: '/images/hero_banner.jpg',
  },
  courtGravel: {
    cdn: 'https://upload.wikimedia.org/wikipedia/commons/c/c2/Petanque_on_a_beach_of_Nice.jpg',
    local: '/images/court_gravel.jpg',
  },
  throwPlayer: {
    cdn: 'https://upload.wikimedia.org/wikipedia/commons/4/48/Petanque_-_throwing_from_the_circle.jpg',
    local: '/images/throw_player.jpg',
  },
  actionShot: {
    cdn: 'https://upload.wikimedia.org/wikipedia/commons/4/40/THA_vs_LAO_-_Petanque_W3s_2019_Southeast_Asian_Games.jpg',
    local: '/images/action_shot.jpg',
  },
};

interface LandingPageProps {
  onNavigate: (tab: NavTab) => void;
  onOpenAcademicModal?: () => void;
}

export default function LandingPage({
  onNavigate,
  onOpenAcademicModal,
}: LandingPageProps) {
  return (
    <div className="space-y-12 pb-16">
      {/* 1. HERO SECTION WITH PETANQUE BACKGROUND */}
      <section className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200">
        {/* Background Image Container with Deep Gradient Overlay */}
        <div className="absolute inset-0 z-0 bg-[#00175a]">
          <img
            src={PETANQUE_MEDIA.heroBanner.cdn}
            alt="Petanque Boules and Jack on Gravel Terrain"
            className="w-full h-full object-cover object-center transform scale-105 filter brightness-90"
            referrerPolicy="no-referrer"
            loading="eager"
            onError={(e) => {
              const el = e.currentTarget as HTMLImageElement;
              if (el.src !== window.location.origin + PETANQUE_MEDIA.heroBanner.local && !el.dataset.fallbackApplied) {
                el.dataset.fallbackApplied = 'true';
                el.src = PETANQUE_MEDIA.heroBanner.local;
              }
            }}
          />
          {/* Deep Navy Gradient Overlay for optimal legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#00175a]/95 via-[#002395]/85 to-[#00175a]/80" />
          <div className="absolute inset-0 bg-radial at-top opacity-30 pointer-events-none bg-indigo-500/20" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 px-6 sm:px-10 lg:px-14 py-12 sm:py-16 lg:py-20 text-white max-w-4xl">
          {/* Academic & Disertasi Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-amber-300 mb-6 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>Disertasi Doktoral Universitas Negeri Padang (UNP) • S3 Ilmu Keolahragaan</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight mb-4 font-['Outfit']">
            RASTA Petanque
            <span className="block text-xl sm:text-2xl lg:text-3xl font-bold text-blue-200 mt-1">
              Rasyo Technology Analysis Petanque
            </span>
          </h1>

          <p className="text-base sm:text-lg text-white/90 leading-relaxed font-normal mb-8 max-w-2xl">
            Platform telemetri dan evaluasi kinerja atlet petanque berbasis digital. 
            Mentransformasikan lembar observasi fisik konvensional menjadi analitik presisi 
            tingkat lemparan, proksimitas jack, profil radar individu, dan standar capaian prestasi secara real-time.
          </p>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3.5">
            <button
              id="landing-btn-excel"
              onClick={() => onNavigate('excel-sheet')}
              className="flex items-center gap-2 px-5 py-3 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm shadow-md transition-all hover:scale-102"
            >
              <FileSpreadsheet className="w-4 h-4 text-slate-950" />
              <span>Buka Lembar Excel (Tabel 1.1)</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              id="landing-btn-scorer"
              onClick={() => onNavigate('scorer')}
              className="flex items-center gap-2 px-4 py-3 rounded-lg bg-[#ED2939] hover:bg-[#d6202f] text-white font-bold text-sm shadow-md transition-all hover:scale-102"
            >
              <Smartphone className="w-4 h-4" />
              <span>Mobile Scorer (Live)</span>
            </button>

            <button
              id="landing-btn-precision"
              onClick={() => onNavigate('precision-shooting')}
              className="flex items-center gap-2 px-4 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 backdrop-blur-xs transition-all"
            >
              <Target className="w-4 h-4 text-amber-300" />
              <span>Precision Shooting (FOPI 60P)</span>
            </button>

            {onOpenAcademicModal && (
              <button
                id="landing-btn-academic"
                onClick={onOpenAcademicModal}
                className="flex items-center gap-2 px-4 py-3 rounded-lg bg-white/5 hover:bg-white/15 text-slate-200 font-medium text-sm border border-white/10 transition-all"
              >
                <BookOpen className="w-4 h-4 text-blue-300" />
                <span>Kerangka Ilmiah</span>
              </button>
            )}
          </div>

          {/* Key Metric Highlights in Hero */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10 pt-8 border-t border-white/15">
            <div>
              <div className="text-2xl sm:text-3xl font-black text-amber-300 font-['Outfit']">Single & Double</div>
              <div className="text-xs text-white/75 font-medium mt-0.5">3 Bola per Atlet (6 Bola/Tim)</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-white font-['Outfit']">Triple Game</div>
              <div className="text-xs text-white/75 font-medium mt-0.5">2 Bola per Atlet (6 Bola/Tim)</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-['Outfit']">6m – 10m</div>
              <div className="text-xs text-white/75 font-medium mt-0.5">5 Jarak Sasaran FIPJP</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-blue-300 font-['Outfit']">$\ge$ 90%</div>
              <div className="text-xs text-white/75 font-medium mt-0.5">Standar Baik Sekali</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PETANQUE VISUAL SHOWCASE CARDS (DENGAN GAMBAR BACKGROUND OLAHRAGA PETANQUE) */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Kaidah Jumlah Bola Resmi Petanque */}
        <div className="relative rounded-2xl overflow-hidden shadow-md border border-slate-200 group flex flex-col justify-between min-h-[260px] p-6 sm:p-7 text-white">
          <div className="absolute inset-0 z-0 bg-slate-900">
            <img
              src={PETANQUE_MEDIA.courtGravel.cdn}
              alt="Bosi dan Jack di Lapangan Kerikil Petanque"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 filter brightness-65"
              referrerPolicy="no-referrer"
              loading="lazy"
              onError={(e) => {
                const el = e.currentTarget as HTMLImageElement;
                if (el.src !== window.location.origin + PETANQUE_MEDIA.courtGravel.local && !el.dataset.fallbackApplied) {
                  el.dataset.fallbackApplied = 'true';
                  el.src = PETANQUE_MEDIA.courtGravel.local;
                }
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-900/80 to-transparent" />
          </div>

          <div className="relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-300/30 mb-3">
              <CircleDot className="w-3.5 h-3.5" />
              <span>Regulasi Resmi Bosi Petanque</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight mb-2 font-['Outfit']">
              Kaidah Alokasi Bola: Single, Double & Triple
            </h3>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-lg">
              Sesuai aturan FIPJP & Federasi Olahraga Petanque Indonesia (FOPI): 
              Nomor <strong>Single</strong> dan <strong>Double</strong> menggunakan <strong>3 bola per atlet</strong> (total 6 bola per tim), 
              sedangkan nomor <strong>Triple</strong> menggunakan <strong>2 bola per atlet</strong> (total 6 bola per tim). 
              Aplikasi RASTA secara dinamis menyesuaikan grid lemparan dan kuota bosi.
            </p>
          </div>

          <div className="relative z-10 pt-4 mt-4 border-t border-white/15 flex items-center justify-between">
            <span className="text-xs font-bold text-amber-300">
              Otomatis & Terintegrasi di Scorer & Excel
            </span>
            <button
              onClick={() => onNavigate('excel-sheet')}
              className="text-xs font-bold text-white hover:text-amber-300 flex items-center gap-1 transition-colors"
            >
              <span>Lihat Format Grid</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Card 2: Presisi Teknik Melempar di Circle */}
        <div className="relative rounded-2xl overflow-hidden shadow-md border border-slate-200 group flex flex-col justify-between min-h-[260px] p-6 sm:p-7 text-white">
          <div className="absolute inset-0 z-0 bg-slate-900">
            <img
              src={PETANQUE_MEDIA.throwPlayer.cdn}
              alt="Atlet Petanque Melempar di Lingkaran Circle"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 filter brightness-65"
              referrerPolicy="no-referrer"
              loading="lazy"
              onError={(e) => {
                const el = e.currentTarget as HTMLImageElement;
                if (el.src !== window.location.origin + PETANQUE_MEDIA.throwPlayer.local && !el.dataset.fallbackApplied) {
                  el.dataset.fallbackApplied = 'true';
                  el.src = PETANQUE_MEDIA.throwPlayer.local;
                }
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-900/80 to-transparent" />
          </div>

          <div className="relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-400/20 text-blue-300 text-xs font-bold border border-blue-300/30 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Teknik Lemparan (Bab II Riset)</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight mb-2 font-['Outfit']">
              Klasifikasi Pointing & Shooting Ilmiah
            </h3>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-lg">
              Setiap lemparan dicatat berdasarkan sub-teknik spesifik: Pointing (<em>Rolling/Menyusur, Half-Lob, High-Lob</em>) 
              dan Shooting (<em>Au Fer/Besi ke Besi, Short Shot, Ground Shot</em>). Keberhasilan Carreau 
              mendapat notasi khusus dan bobot analitik mandiri.
            </p>
          </div>

          <div className="relative z-10 pt-4 mt-4 border-t border-white/15 flex items-center justify-between">
            <span className="text-xs font-bold text-blue-200">
              Evaluasi Presisi Jarak 6m, 7m, 8m, 9m, 10m
            </span>
            <button
              onClick={() => onNavigate('precision-shooting')}
              className="text-xs font-bold text-white hover:text-amber-300 flex items-center gap-1 transition-colors"
            >
              <span>Tes Precision 60P</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 3. LATAR BELAKANG RISET & MASALAH LAPANGAN */}
      <section className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#002395] uppercase tracking-wider mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Landasan Riset & Disertasi</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-['Outfit']">
            Menjembatani Lembar Observasi Manual dengan Telemetri Ilmiah
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
            Dalam kejuaraan dan sesi latihan petanque konvensional, evaluasi pelatih umumnya terbatas 
            pada ingatan pasca-pertandingan, coretan kertas observasi yang lambat dihitung, atau sekadar skor akhir. 
            Sistem <strong>RASTA</strong> dirancang dalam riset doktoral <strong>Rasyono, S.Pd., M.Pd.</strong> di 
            Universitas Negeri Padang (UNP) untuk menghadirkan sistem evaluasi terpadu yang instan, obyektif, 
            dan terstandar secara internasional.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6 pt-6 border-t border-slate-100">
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200/80">
            <div className="w-8 h-8 rounded-md bg-blue-100 text-[#002395] flex items-center justify-center font-bold text-sm mb-3">
              1
            </div>
            <h3 className="font-bold text-slate-800 text-sm mb-1.5">Micro-Scoring Presisi Biner</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Mencatat keberhasilan (1) atau kegagalan (0) tiap bola, membedakan aksi Pointing vs Shooting, 
              serta konversi lemparan Carreau secara presisi.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200/80">
            <div className="w-8 h-8 rounded-md bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm mb-3">
              2
            </div>
            <h3 className="font-bold text-slate-800 text-sm mb-1.5">Diferensiasi Sub-Teknik Lemparan</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Menganalisis jenis pointing (<em>Rolling, Half-Lob, High-Lob</em>) dan shooting (<em>Au Fer, Short Shot, Ground Shot</em>) 
              sesuai kajian teori Bab II disertasi.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200/80">
            <div className="w-8 h-8 rounded-md bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm mb-3">
              3
            </div>
            <h3 className="font-bold text-slate-800 text-sm mb-1.5">Standar Capaian Prestasi Empiris</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Mengukur posisi atlet langsung terhadap threshold prestasi Rasyono: Baik Sekali ($\ge$ 90%), Baik (80-89%), Cukup (70-79%), dan Kurang (&lt; 70%).
            </p>
          </div>
        </div>
      </section>

      {/* 4. MODUL UTAMA APLIKASI (BENTO GRID) */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <div className="text-xs font-bold text-[#002395] uppercase tracking-wider">
              Fitur Lengkap
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight font-['Outfit']">
              Modul Evaluasi & Analisis RASTA
            </h2>
          </div>
          <p className="text-xs text-slate-500 max-w-md">
            Pilih modul yang sesuai dengan kebutuhan pertandingan, tes keterampilan, atau analisis pasca-pertandingan Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Card 1: Lembar Excel Performa (Tabel 1.1) */}
          <div
            onClick={() => onNavigate('excel-sheet')}
            className="group cursor-pointer bg-white rounded-xl p-5 border border-slate-200 shadow-xs hover:shadow-md hover:border-[#002395] transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#002395] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-black bg-blue-100 text-[#002395]">
                  TABEL 1.1
                </span>
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1 group-hover:text-[#002395] transition-colors">
                Lembar Excel Performa
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Replika digital formulir observasi penelitian disertasi UNP. Menampilkan matriks lemparan dinamis 
                (3 bola Single/Double, 2 bola Triple), rasio sukses, notasi Carreau, dan ekspor CSV instan.
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-[#002395] pt-3 border-t border-slate-100">
              <span>Buka Tabel Excel</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Precision Shooting */}
          <div
            onClick={() => onNavigate('precision-shooting')}
            className="group cursor-pointer bg-white rounded-xl p-5 border border-slate-200 shadow-xs hover:shadow-md hover:border-amber-400 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Target className="w-5 h-5" />
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-black bg-amber-100 text-amber-800">
                  FOPI 60P
                </span>
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1 group-hover:text-amber-700 transition-colors">
                Precision Shooting
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Replika lembar penilaian tembakan presisi resmi: 5 Figure, 4 Jarak (6.5m, 7.5m, 8.5m, 9.5m), 
                skor 5P/3P/1P/0P, dan komparasi standar realistis capaian.
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-amber-700 pt-3 border-t border-slate-100">
              <span>Buka Lembar Presisi</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Mobile Scorer */}
          <div
            onClick={() => onNavigate('scorer')}
            className="group cursor-pointer bg-white rounded-xl p-5 border border-slate-200 shadow-xs hover:shadow-md hover:border-red-400 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-red-50 text-[#ED2939] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Smartphone className="w-5 h-5" />
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-black bg-red-100 text-[#ED2939]">
                  LIVE COURT
                </span>
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1 group-hover:text-[#ED2939] transition-colors">
                Sideline Mobile Scorer
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Konsol sentuh cepat untuk pencatat di tepi lapangan. Kontrol sisa kuota bosi (Single/Double 3 bola, 
                Triple 2 bola), jarak jack 6m-10m, dan pembatalan (undo) 1-sentuhan.
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-[#ED2939] pt-3 border-t border-slate-100">
              <span>Buka Mobile Scorer</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4: Post-Match Report & Latihan */}
          <div
            onClick={() => onNavigate('post-match-report')}
            className="group cursor-pointer bg-white rounded-xl p-5 border border-slate-200 shadow-xs hover:shadow-md hover:border-emerald-500 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FileCheck2 className="w-5 h-5" />
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-100 text-emerald-800">
                  TAHAP 5
                </span>
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1 group-hover:text-emerald-700 transition-colors">
                Post-Match Report & Latihan
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Laporan komprehensif pasca-pertandingan, diagnosis peran dominan, deteksi drop-off zone jarak, 
                dan formula program latihan fisik-teknik spesifik (tahap 5 disertasi).
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-emerald-700 pt-3 border-t border-slate-100">
              <span>Buka Laporan & Rekomendasi</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 5: Athlete Analytics & Radar */}
          <div
            onClick={() => onNavigate('athletes')}
            className="group cursor-pointer bg-white rounded-xl p-5 border border-slate-200 shadow-xs hover:shadow-md hover:border-purple-400 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Users className="w-5 h-5" />
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-black bg-purple-100 text-purple-800">
                  RADAR CHART
                </span>
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1 group-hover:text-purple-700 transition-colors">
                Athlete Analytics & Profiling
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Diagram radar multi-sumbu mengevaluasi Pointing, Shooting, Carreau Rate, Distance Target, 
                dan Efektivitas Keseluruhan per individu atlet.
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-purple-700 pt-3 border-t border-slate-100">
              <span>Buka Analitik Atlet</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 6: Match Manager */}
          <div
            onClick={() => onNavigate('matches')}
            className="group cursor-pointer bg-white rounded-xl p-5 border border-slate-200 shadow-xs hover:shadow-md hover:border-slate-400 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Flame className="w-5 h-5 text-amber-500" />
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-black bg-slate-200 text-slate-800">
                  DATABASE
                </span>
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1 group-hover:text-slate-900 transition-colors">
                Match Setup & Game Baru
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Buat pertandingan baru (Single, Double, Triple), atur susunan roster atlet, dan kelola arsip 
                pertandingan yang tersimpan di LocalStorage.
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-slate-700 pt-3 border-t border-slate-100">
              <span>Kelola Pertandingan</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* 5. STANDAR CAPAIAN PRESTASI RASYONO (BAIK SEKALI, BAIK, CUKUP, KURANG) */}
      <section className="bg-gradient-to-br from-slate-900 to-[#00175a] rounded-2xl p-6 sm:p-10 text-white shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-semibold mb-2">
              <Award className="w-3.5 h-3.5" />
              <span>Standar Empiris Disertasi Rasyono (UNP)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight font-['Outfit']">
              Kategori Capaian Standar Prestasi Atlet
            </h2>
          </div>
          <span className="text-xs text-slate-300">
            Dikalibrasi berdasarkan rata-rata pencapaian atlet di tingkat kejuaraan kompetitif
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Baik Sekali Tier */}
          <div className="bg-white/10 rounded-xl p-5 border border-amber-400/30 backdrop-blur-xs">
            <div className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-1 flex items-center gap-1">
              <span>⭐ Baik Sekali</span>
            </div>
            <div className="text-2xl font-black text-white font-['Outfit'] my-1">
              $\ge$ 90%
            </div>
            <div className="text-xs text-amber-200 font-semibold mb-2">
              Skor Presisi: $\ge$ 54 Poin
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Tingkat akurasi prima dengan konsistensi tinggi pada jarak jauh 9m-10m serta rasio sukses lemparan luar biasa.
            </p>
          </div>

          {/* Baik Tier */}
          <div className="bg-white/10 rounded-xl p-5 border border-blue-400/30 backdrop-blur-xs">
            <div className="text-xs font-bold text-blue-200 uppercase tracking-wider mb-1 flex items-center gap-1">
              <span>👍 Baik</span>
            </div>
            <div className="text-2xl font-black text-white font-['Outfit'] my-1">
              80% – 89%
            </div>
            <div className="text-xs text-blue-200 font-semibold mb-2">
              Skor Presisi: 48 – 53 Poin
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Performa stabil dan solid di fase kompetisi. Mampu mempertahankan ritme tembakan di berbagai kondisi lapangan.
            </p>
          </div>

          {/* Cukup Tier */}
          <div className="bg-white/10 rounded-xl p-5 border border-amber-600/30 backdrop-blur-xs">
            <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1 flex items-center gap-1">
              <span>👌 Cukup</span>
            </div>
            <div className="text-2xl font-black text-white font-['Outfit'] my-1">
              70% – 79%
            </div>
            <div className="text-xs text-amber-300 font-semibold mb-2">
              Skor Presisi: 42 – 47 Poin
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Memiliki dasar teknik yang memadai namun masih membutuhkan penguatan tembakan pada jarak kritis 8.5m & 9.5m.
            </p>
          </div>

          {/* Kurang Tier */}
          <div className="bg-white/10 rounded-xl p-5 border border-red-500/30 backdrop-blur-xs">
            <div className="text-xs font-bold text-red-300 uppercase tracking-wider mb-1 flex items-center gap-1">
              <span>⚠️ Kurang</span>
            </div>
            <div className="text-2xl font-black text-white font-['Outfit'] my-1">
              &lt; 70%
            </div>
            <div className="text-xs text-red-300 font-semibold mb-2">
              Skor Presisi: &lt; 42 Poin
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Di bawah standar rata-rata kompetisi. Perlu penajaman drill fisik (daya tahan bahu) dan latihan sub-teknik terprogram.
            </p>
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION SECTION WITH ACTION SHOT BACKGROUND */}
      <section className="relative rounded-2xl overflow-hidden shadow-lg border border-slate-200">
        <div className="absolute inset-0 z-0 bg-slate-950">
          <img
            src={PETANQUE_MEDIA.actionShot.cdn}
            alt="Petanque Player in Action Stance"
            className="w-full h-full object-cover object-center transform filter brightness-75"
            referrerPolicy="no-referrer"
            loading="lazy"
            onError={(e) => {
              const el = e.currentTarget as HTMLImageElement;
              if (el.src !== window.location.origin + PETANQUE_MEDIA.actionShot.local && !el.dataset.fallbackApplied) {
                el.dataset.fallbackApplied = 'true';
                el.src = PETANQUE_MEDIA.actionShot.local;
              }
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/80 to-[#002395]/75" />
        </div>

        <div className="relative z-10 px-6 sm:px-10 py-10 sm:py-12 text-white max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold text-white mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Siap Digunakan di Lapangan Terbuka</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight mb-3 font-['Outfit']">
            Mulai Analisis Pertandingan atau Uji Kemampuan Presisi Sekarang
          </h2>

          <p className="text-sm text-slate-200 leading-relaxed mb-6">
            Seluruh data tersimpan secara lokal dan aman di perangkat Anda. Buka konsol pencatatan 
            atau buat pertandingan baru dengan komposisi tim Anda sendiri.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              id="landing-cta-new-match"
              onClick={() => onNavigate('matches')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md transition-all"
            >
              <Flame className="w-4 h-4 text-amber-300" />
              <span>Mulai Pertandingan Baru</span>
            </button>

            <button
              id="landing-cta-excel"
              onClick={() => onNavigate('excel-sheet')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm transition-all"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Buka Lembar Excel</span>
            </button>

            <button
              id="landing-cta-dashboard"
              onClick={() => onNavigate('dashboard')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 transition-all"
            >
              <Activity className="w-4 h-4 text-blue-300" />
              <span>Lihat Live Dashboard</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
