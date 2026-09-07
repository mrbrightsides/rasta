import React from 'react';
import {
  GraduationCap,
  Target,
  FileSpreadsheet,
  TrendingUp,
  Award,
  CheckCircle2,
  Layers,
  Sparkles,
  ClipboardList,
  Flame,
  ArrowRight,
  Calculator,
  Compass,
} from 'lucide-react';

interface AcademicFrameworkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AcademicFrameworkModal({
  isOpen,
  onClose,
}: AcademicFrameworkModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-xl shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col">
        {/* Academic Header Banner */}
        <div className="bg-gradient-to-r from-[#001c77] via-[#002395] to-[#00165c] text-white p-5 sm:p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full w-8 h-8 flex items-center justify-center font-bold transition-colors"
            title="Tutup Modal"
          >
            ✕
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="bg-amber-400 text-amber-950 p-2 rounded-lg font-black text-xs shadow-xs">
              UNP
            </div>
            <div>
              <p className="text-xs font-bold text-amber-300 tracking-wider uppercase">
                Program Pascasarjana Doktor Ilmu Keolahragaan
              </p>
              <h2 className="text-xl sm:text-2xl font-black font-['Outfit'] tracking-tight">
                UNIVERSITAS NEGERI PADANG
              </h2>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-white/15 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div>
              <span className="text-white/70 font-medium">Peneliti / Pengembang: </span>
              <span className="font-bold text-white">RASYONO — NIM. 25344021</span>
            </div>
            <div className="bg-white/15 px-3 py-1 rounded-full text-[11px] font-semibold text-white/90">
              Disertasi S3 Keolahragaan
            </div>
          </div>

          <div className="mt-3 bg-white/10 border border-white/20 p-3 rounded-lg text-xs leading-relaxed text-white/95 font-medium">
            <span className="font-bold text-amber-300">Judul Disertasi: </span>
            “Analisis Performa Atlet Berbasis Aplikasi Dalam Permainan Olahraga Petanque”
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-slate-800 text-xs leading-relaxed">
          {/* 1. Tujuan Utama & 5 Poin (Slide 12) */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1.5 h-4 bg-[#002395] rounded-xs" />
              <h3 className="font-bold text-sm text-slate-900 font-['Outfit'] uppercase tracking-wider">
                1. Tujuan Pengembangan Aplikasi (Slide 12)
              </h3>
            </div>

            <div className="bg-amber-50/80 border border-amber-200 p-4 rounded-lg mb-4 text-center">
              <p className="text-sm font-black text-amber-950">
                “Tujuan utama penelitian ini adalah menghasilkan aplikasi yang mampu menganalisis performa atlet petanque secara tepat, cepat, objektif, sistematis, dan berbasis data.”
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {[
                { no: '01', title: 'Digitalisasi Pertandingan', desc: 'Mencatat data pertandingan / permainan atlet secara digital dan real-time.' },
                { no: '02', title: 'Kalkulasi Otomatis', desc: 'Menghitung performa atlet otomatis secara instan tanpa perlu olah rumus Excel manual.' },
                { no: '03', title: 'Grafik & Evaluasi', desc: 'Menampilkan grafik perkembangan, radar multi-metrik, dan dashboard evaluasi komprehensif.' },
                { no: '04', title: 'Penyimpanan Riwayat', desc: 'Menyimpan riwayat pertandingan / permainan untuk analisis longitudinal lanjutan.' },
                { no: '05', title: 'Keputusan Pelatih', desc: 'Membantu pelatih mengambil keputusan program latihan dan strategi pertandingan berbasis data.' },
              ].map((item) => (
                <div key={item.no} className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex gap-2.5 items-start">
                  <span className="font-mono font-black text-sm text-[#002395] bg-blue-100 px-2 py-0.5 rounded">
                    {item.no}
                  </span>
                  <div>
                    <h5 className="font-bold text-slate-900 text-xs mb-0.5">{item.title}</h5>
                    <p className="text-[11px] text-slate-600 leading-snug">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. 4 Pilar Fitur & Komponen Utama (Slide 14) */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1.5 h-4 bg-[#002395] rounded-xs" />
              <h3 className="font-bold text-sm text-slate-900 font-['Outfit'] uppercase tracking-wider">
                2. Spesifikasi Produk: 4 Komponen Utama Aplikasi (Slide 14)
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Pilar 1 */}
              <div className="border border-blue-200 bg-blue-50/50 rounded-lg p-3.5 flex flex-col justify-between">
                <div>
                  <div className="bg-[#002395] text-white font-bold text-[11px] px-2.5 py-1 rounded text-center mb-2.5 uppercase tracking-wider">
                    Manajemen Data
                  </div>
                  <ul className="space-y-1.5 text-[11px] text-slate-700 list-disc list-inside">
                    <li>Atlet & tim partisipan</li>
                    <li>Kategori Single, Double, Triple</li>
                    <li>Jadwal, lawan, dan status match</li>
                    <li>Penyimpanan histori permainan</li>
                  </ul>
                </div>
              </div>

              {/* Pilar 2 */}
              <div className="border border-red-200 bg-red-50/50 rounded-lg p-3.5 flex flex-col justify-between">
                <div>
                  <div className="bg-[#ED2939] text-white font-bold text-[11px] px-2.5 py-1 rounded text-center mb-2.5 uppercase tracking-wider">
                    Input Teknik
                  </div>
                  <ul className="space-y-1.5 text-[11px] text-slate-700 list-disc list-inside">
                    <li>Pointing berhasil / gagal</li>
                    <li>Shooting berhasil / gagal</li>
                    <li>Carreau (kualitas shooting telak)</li>
                    <li>Skor end & jarak ke boka (jack)</li>
                  </ul>
                </div>
              </div>

              {/* Pilar 3 */}
              <div className="border border-emerald-200 bg-emerald-50/50 rounded-lg p-3.5 flex flex-col justify-between">
                <div>
                  <div className="bg-emerald-600 text-white font-bold text-[11px] px-2.5 py-1 rounded text-center mb-2.5 uppercase tracking-wider">
                    Analisis Otomatis
                  </div>
                  <ul className="space-y-1.5 text-[11px] text-slate-700 list-disc list-inside">
                    <li>Akurasi pointing & shooting</li>
                    <li>Konsistensi performa antar end</li>
                    <li>Poin dan momentum per end</li>
                    <li>Performa individu dan tim</li>
                  </ul>
                </div>
              </div>

              {/* Pilar 4 */}
              <div className="border border-amber-200 bg-amber-50/50 rounded-lg p-3.5 flex flex-col justify-between">
                <div>
                  <div className="bg-amber-600 text-white font-bold text-[11px] px-2.5 py-1 rounded text-center mb-2.5 uppercase tracking-wider">
                    Output Evaluasi
                  </div>
                  <ul className="space-y-1.5 text-[11px] text-slate-700 list-disc list-inside">
                    <li>Dashboard monitoring real-time</li>
                    <li>Post-match report (laporan akhir)</li>
                    <li>Rekomendasi latihan berbasis data</li>
                    <li>Prediksi standar capaian medali</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* 3. 6 Indikator Analisis Performa & Rumus (Slide 15 & 17) */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1.5 h-4 bg-[#002395] rounded-xs" />
              <h3 className="font-bold text-sm text-slate-900 font-['Outfit'] uppercase tracking-wider">
                3. 6 Indikator Analisis Performa & Rumus Matematika (Slide 15 & 17)
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {[
                {
                  name: 'Pointing Accuracy',
                  desc: 'Kemampuan mendekatkan boule ke jack.',
                  formula: 'Pointing Berhasil / Total Pointing × 100%',
                  icon: Target,
                  color: 'text-[#002395]',
                },
                {
                  name: 'Shooting Accuracy',
                  desc: 'Keberhasilan mengenai atau mengeluarkan boule lawan.',
                  formula: 'Shooting Berhasil / Total Shooting × 100%',
                  icon: Flame,
                  color: 'text-[#ED2939]',
                },
                {
                  name: 'Carreau Rate',
                  desc: 'Kualitas shooting ketika boule pengganti tetap berada di area target.',
                  formula: 'Jumlah Carreau / Total Shooting × 100%',
                  icon: Sparkles,
                  color: 'text-amber-600',
                },
                {
                  name: 'Distance Control',
                  desc: 'Rata-rata jarak boule terhadap jack dan akurasi per rentang (6m - 10m).',
                  formula: 'Rata-rata jarak boule terhadap jack (cm)',
                  icon: Compass,
                  color: 'text-indigo-600',
                },
                {
                  name: 'Consistency Trend',
                  desc: 'Stabilitas indikator performa dari end ke end.',
                  formula: 'Stabilitas indikator performa antar end',
                  icon: TrendingUp,
                  color: 'text-emerald-600',
                },
                {
                  name: 'Score per End',
                  desc: 'Distribusi poin dan momentum pertandingan.',
                  formula: 'Poin tim per babak & running score',
                  icon: Layers,
                  color: 'text-purple-600',
                },
              ].map((ind) => {
                const IconComponent = ind.icon;
                return (
                  <div
                    key={ind.name}
                    className="p-3.5 rounded-lg border border-slate-200 bg-white shadow-2xs hover:border-slate-300 transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <IconComponent className={`w-4 h-4 ${ind.color}`} />
                      <h4 className="font-bold text-slate-900 text-xs">{ind.name}</h4>
                    </div>
                    <p className="text-[11px] text-slate-600 mb-2 leading-relaxed">{ind.desc}</p>
                    <div className="bg-slate-100 text-slate-800 font-mono text-[10px] px-2 py-1 rounded font-bold">
                      {ind.formula}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4. Workflow Alur Kerja Aplikasi (Slide 16) */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1.5 h-4 bg-[#002395] rounded-xs" />
              <h3 className="font-bold text-sm text-slate-900 font-['Outfit'] uppercase tracking-wider">
                4. Workflow Alur Kerja Aplikasi (Slide 16)
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-center">
              {[
                { step: '1. Setup Match', desc: 'Input tim, atlet, kategori, waktu' },
                { step: '2. Live Input', desc: 'Catat pointing, shooting, carreau, jarak, end ke, skor' },
                { step: '3. Kalkulasi Sistem', desc: 'Hitung akurasi, konsistensi, jarak, poin' },
                { step: '4. Dashboard', desc: 'Tampilkan grafik dan performa sementara' },
                { step: '5. Post-Match', desc: 'Simpan data, laporan akhir, rekomendasi' },
              ].map((w, idx) => (
                <div
                  key={w.step}
                  className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs flex flex-col justify-between"
                >
                  <div className="font-black text-xs text-[#002395] mb-1">{w.step}</div>
                  <p className="text-[11px] text-slate-600 leading-tight">{w.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 5. Standar Benchmark Medali Rasyono Game Biasa */}
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2 font-bold text-xs text-slate-900 uppercase">
              <Award className="w-4 h-4 text-amber-500" />
              <span>Standar Prestasi Game (Akurasi Lemparan Pointing & Shooting):</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
              <div className="bg-amber-100 border border-amber-300 p-2 rounded">
                <div className="font-black text-amber-950 text-xs">🥇 EMAS (≥ 90%)</div>
                <div className="text-[10px] text-amber-800">Sangat Baik / Juara Dunia</div>
              </div>
              <div className="bg-slate-200 border border-slate-300 p-2 rounded">
                <div className="font-black text-slate-900 text-xs">🥈 PERAK (80% - 89%)</div>
                <div className="text-[10px] text-slate-700">Baik / Standar Finalis</div>
              </div>
              <div className="bg-orange-100 border border-orange-300 p-2 rounded">
                <div className="font-black text-orange-950 text-xs">🥉 PERUNGGU (70% - 79%)</div>
                <div className="text-[10px] text-orange-800">Cukup / Standar Semifinal</div>
              </div>
              <div className="bg-rose-100 border border-rose-300 p-2 rounded">
                <div className="font-black text-rose-950 text-xs">⚠️ EVALUASI (&lt; 70%)</div>
                <div className="text-[10px] text-rose-800">Kurang / Butuh Drill Fisik-Teknik</div>
              </div>
            </div>
          </div>

          {/* 6. Analisis Keberhasilan Precision Shooting (Slide Khusus FOPI & Disertasi UNP) */}
          <div className="bg-amber-50/70 border border-amber-200 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2 font-bold text-xs text-amber-950 uppercase">
              <Target className="w-4 h-4 text-amber-600" />
              <span>Analisis Keberhasilan Precision Shooting (Slide Presentasi FOPI & UNP):</span>
            </div>

            <p className="text-[11px] text-amber-900 mb-2 leading-relaxed">
              Pada nomor tembakan presisi (5 Station & 4 Jarak: 6.5m, 7.5m, 8.5m, 9.5m = 20 lemparan):
            </p>

            <div className="space-y-1.5 text-[11px] text-slate-800 mb-3">
              <div className="flex items-start gap-1.5">
                <span className="font-bold text-amber-900">1.</span>
                <span><strong>Skor Maksimal</strong> station 1-5 dengan 20 lemparan adalah <strong>100 poin</strong> jika memperoleh skor 5 (carreau) terus.</span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="font-bold text-amber-900">2.</span>
                <span><strong>Skor Realistis</strong> adalah 3 poin × 20 lemparan = <strong>60 poin</strong> (Pernah terjadi di World Games).</span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="font-bold text-amber-900">3.</span>
                <span>Skor 60 kita anggap adalah <strong>100% kemampuan maksimal atlet</strong>.</span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="font-bold text-amber-900">4.</span>
                <span><strong>Rata-rata peraih medali pada SEA Games</strong> adalah antara <strong>42 s.d 54 poin</strong>.</span>
              </div>
            </div>

            {/* Threshold grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-orange-100 border border-orange-300 p-2.5 rounded">
                <div className="font-black text-orange-950">🥉 MEDALI PERUNGGU</div>
                <div className="text-[11px] font-bold text-orange-900 my-0.5">70% (Skor 42)</div>
                <div className="text-[10px] text-orange-800">Kategori CUKUP BAIK<br />"Bisa bicara medali"</div>
              </div>

              <div className="bg-slate-200 border border-slate-300 p-2.5 rounded">
                <div className="font-black text-slate-900">🥈 MEDALI PERAK</div>
                <div className="text-[11px] font-bold text-slate-950 my-0.5">80% (Skor 48)</div>
                <div className="text-[10px] text-slate-700">Kategori BAIK<br />"Dipastikan medali"</div>
              </div>

              <div className="bg-amber-200 border border-amber-400 p-2.5 rounded">
                <div className="font-black text-amber-950">🥇 MEDALI EMAS</div>
                <div className="text-[11px] font-bold text-amber-950 my-0.5">90% (Skor 54)</div>
                <div className="text-[10px] text-amber-900 font-semibold">Kategori SANGAT BAIK<br />"Emas berani kita targetkan"</div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-medium">
            Doktor Ilmu Keolahragaan UNP • Rasyono (25344021)
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#002395] hover:bg-[#001c77] text-white font-bold rounded text-xs transition-colors shadow-xs"
          >
            Mengerti & Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
