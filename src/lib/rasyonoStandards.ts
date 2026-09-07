import { PerformanceStats, ThrowAction } from '../types';

export interface RasyonoTierInfo {
  no: number;
  level: 1 | 2 | 3 | 0;
  range: string;
  medali: string;
  predicate: string;
  fullLabel: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  badgeGlow: string;
  icon: string;
  summaryText: string;
  recommendation: string;
}

export const RASYONO_BENCHMARK_TIERS: Record<string, RasyonoTierInfo> = {
  GOLD: {
    no: 3,
    level: 3,
    range: '90 - 99 % (≥90%)',
    medali: 'EMAS',
    predicate: 'SANGAT BAIK',
    fullLabel: 'EMAS / SANGAT BAIK',
    badgeBg: 'bg-amber-100',
    badgeText: 'text-amber-950',
    badgeBorder: 'border-amber-400',
    badgeGlow: 'ring-2 ring-amber-300',
    icon: '🥇',
    summaryText: 'Performa Elit Dunia. Tingkat akurasi eksekusi luar biasa tinggi, memenuhi standar peraih Medali Emas turnamen nasional/internasional.',
    recommendation: 'Pertahankan stabilitas mental dan fisik. Pertajam variasi taktik membaca lapangan serta situasi krisis saat lawan menekan.',
  },
  SILVER: {
    no: 2,
    level: 2,
    range: '80 - 89 %',
    medali: 'PERAK',
    predicate: 'BAIK',
    fullLabel: 'PERAK / BAIK',
    badgeBg: 'bg-slate-100',
    badgeText: 'text-slate-900',
    badgeBorder: 'border-slate-300',
    badgeGlow: 'ring-1 ring-slate-300',
    icon: '🥈',
    summaryText: 'Performa Sangat Kompetitif. Akurasi konsisten memenuhi standar finalis peraih Medali Perak.',
    recommendation: 'Perkuat eksekusi pada jarak kritis (8m-10m) dan tingkatkan persentase tembakan Carreau untuk menembus ambang 90% (Level Emas).',
  },
  BRONZE: {
    no: 1,
    level: 1,
    range: '70 - 79 %',
    medali: 'PERUNGGU',
    predicate: 'CUKUP BAIK',
    fullLabel: 'PERUNGGU / CUKUP BAIK',
    badgeBg: 'bg-orange-50',
    badgeText: 'text-orange-950',
    badgeBorder: 'border-orange-300',
    badgeGlow: 'ring-1 ring-orange-200',
    icon: '🥉',
    summaryText: 'Performa Cukup Baik. Masuk ke ambang batas podium Medali Perunggu.',
    recommendation: 'Tingkatkan drill konsistensi lemparan agar tidak terjadi penurunan akurasi drastis di pertengahan hingga akhir game.',
  },
  BELOW_BENCHMARK: {
    no: 0,
    level: 0,
    range: '< 70 %',
    medali: 'DI BAWAH STANDAR',
    predicate: 'PERLU EVALUASI & PENINGKATAN',
    fullLabel: 'DI BAWAH STANDAR MEDALI (<70%)',
    badgeBg: 'bg-rose-50',
    badgeText: 'text-rose-900',
    badgeBorder: 'border-rose-200',
    badgeGlow: 'ring-1 ring-rose-200',
    icon: '⚠️',
    summaryText: 'Belum mencapai ambang minimal persaingan medali (70%). Perlu evaluasi menyeluruh pada teknik dasar dan kontrol lemparan.',
    recommendation: 'Lakukan drill pengulangan mekanik dasar (genggaman, ayunan, rilis, dan follow-through) dengan volume latihan terprogram.',
  },
  NO_DATA: {
    no: 0,
    level: 0,
    range: '-',
    medali: '-',
    predicate: 'BELUM ADA DATA',
    fullLabel: 'BELUM ADA LEMPARAN',
    badgeBg: 'bg-slate-50',
    badgeText: 'text-slate-400',
    badgeBorder: 'border-slate-200',
    badgeGlow: '',
    icon: '-',
    summaryText: 'Belum ada data lemparan tercatat pada pertandingan ini.',
    recommendation: 'Catat lemparan atlet untuk menghasilkan analisis performa.',
  },
};

export const RASYONO_CORE_NOTES = [
  {
    stars: '*',
    label: 'Validasi Empiris',
    text: 'Analisis selama melatih mendampingi dan melihat pertandingan dengan catatan lapangan real dan analisis Atlet TOP Dunia.',
  },
  {
    stars: '**',
    label: 'Penentu Level 1 (Strategi)',
    text: 'Jika performa atlet sama maka strategi sangat menentukan (Strategi terbaik pétanque adalah eksekusi yang berhasil).',
  },
  {
    stars: '***',
    label: 'Penentu Level 2 (Mental & Fisik)',
    text: 'Jika Strategi sama maka mental dan fisik akan menentukan.',
  },
  {
    stars: '****',
    label: 'Faktor Non-Teknis',
    text: 'Jika semua sama maka, hoki, keberuntungan garis tangan dan ketentuan Illahi yang menentukan (Banyak contoh di PON dan termasuk di SEA Games / Secara ilmiah bukan penentu utama dalam latihan).',
  },
];

export interface PlayerConclusionData {
  playerId: string;
  playerName: string;
  teamId: string;
  teamName: string;
  role?: string;
  totalThrows: number;
  totalSuccess: number;
  overallPct: number | null;
  pointSuccess: number;
  pointTotal: number;
  pointPct: number | null;
  shootingSuccess: number;
  shootingTotal: number;
  shootingPct: number | null;
  carreauCount: number;
  carreauRatePct: number | null;
  tier: RasyonoTierInfo;
  dominantRole: 'POINTER' | 'SHOOTER' | 'BALANCED' | 'UNDETERMINED';
  keyObservation: string;
  tacticalAdvice: string;
  mentalPhysicalAdvice: string;
}

/**
 * Calculates Rasyono Performance Tier based on overall accuracy percentage.
 */
export function getRasyonoTier(overallPct: number | null): RasyonoTierInfo {
  if (overallPct === null || isNaN(overallPct)) {
    return RASYONO_BENCHMARK_TIERS.NO_DATA;
  }
  if (overallPct >= 90) {
    return RASYONO_BENCHMARK_TIERS.GOLD;
  }
  if (overallPct >= 80) {
    return RASYONO_BENCHMARK_TIERS.SILVER;
  }
  if (overallPct >= 70) {
    return RASYONO_BENCHMARK_TIERS.BRONZE;
  }
  return RASYONO_BENCHMARK_TIERS.BELOW_BENCHMARK;
}

/**
 * Generates an individualized conclusion for a player based on their performance data
 * using the doctoral research framework of Rasyono (Universitas Negeri Padang).
 */
export function generatePlayerRasyonoConclusion(
  playerId: string,
  playerName: string,
  teamId: string,
  teamName: string,
  role: string | undefined,
  pointSuccess: number,
  pointTotal: number,
  shootingSuccess: number,
  shootingTotal: number,
  carreauCount: number = 0
): PlayerConclusionData {
  const totalThrows = pointTotal + shootingTotal;
  const totalSuccess = pointSuccess + shootingSuccess;
  const overallPct = totalThrows > 0 ? Math.round((totalSuccess / totalThrows) * 1000) / 10 : null;
  const pointPct = pointTotal > 0 ? Math.round((pointSuccess / pointTotal) * 1000) / 10 : null;
  const shootingPct = shootingTotal > 0 ? Math.round((shootingSuccess / shootingTotal) * 1000) / 10 : null;
  const carreauRatePct = shootingTotal > 0 ? Math.round((carreauCount / shootingTotal) * 1000) / 10 : null;

  const tier = getRasyonoTier(overallPct);

  // Determine dominant throwing pattern
  let dominantRole: 'POINTER' | 'SHOOTER' | 'BALANCED' | 'UNDETERMINED' = 'UNDETERMINED';
  if (totalThrows > 0) {
    if (pointTotal >= totalThrows * 0.65) dominantRole = 'POINTER';
    else if (shootingTotal >= totalThrows * 0.65) dominantRole = 'SHOOTER';
    else dominantRole = 'BALANCED';
  }

  // Generate tactical observations
  let keyObservation = '';
  if (totalThrows === 0) {
    keyObservation = 'Belum ada lemparan yang dieksekusi oleh atlet ini.';
  } else if (dominantRole === 'POINTER') {
    keyObservation = `Fokus utama pada Pointing (${pointTotal} lemparan, akurasi ${pointPct !== null ? pointPct + '%' : '-'}).`;
    if (pointPct !== null && pointPct >= 80) {
      keyObservation += ' Eksekusi pointing sangat konsisten menempatkan boule di zona berbahaya lawan.';
    } else if (pointPct !== null && pointPct < 70) {
      keyObservation += ' Perlu perbaikan kontrol jarak lemparan dan pembacaan kontur lapangan.';
    }
  } else if (dominantRole === 'SHOOTER') {
    keyObservation = `Fokus utama pada Shooting (${shootingTotal} lemparan, akurasi ${shootingPct !== null ? shootingPct + '%' : '-'}).`;
    if (carreauCount > 0) {
      keyObservation += ` Berhasil mencatat ${carreauCount} kali Carreau sempurna yang memberi keunggulan poin krusial.`;
    }
  } else {
    keyObservation = `Peran Milieu / All-Rounder seimbang: Pointing (${pointSuccess}/${pointTotal}) dan Shooting (${shootingSuccess}/${shootingTotal}).`;
  }

  // Tactical Advice based on Rasyono's formula: "Strategi terbaik petanque adalah eksekusi yang berhasil"
  let tacticalAdvice = '';
  if (overallPct !== null && overallPct >= 85) {
    tacticalAdvice = 'Eksekusi sangat matang. Sesuai prinsip Rasyono, strategi tim akan sangat efektif ketika tingkat eksekusi pemain di atas 80%. Pertahankan formasi tim saat ini.';
  } else if (overallPct !== null && overallPct >= 70) {
    tacticalAdvice = 'Eksekusi berada di level cukup baik. Diperlukan pemilihan keputusan tembak atau rapat (point/shoot) yang lebih terukur sesuai situasi poin dan sisa boule lawan.';
  } else if (overallPct !== null) {
    tacticalAdvice = 'Prioritaskan lemparan dengan persentase keberhasilan tertinggi terlebih dahulu untuk membangun rasa percaya diri sebelum mengambil tembakan berisiko tinggi.';
  } else {
    tacticalAdvice = 'Siapkan atlet untuk eksekusi lemparan sesuai penugasan peran dalam tim.';
  }

  // Mental & Physical Advice based on Rasyono's notes
  let mentalPhysicalAdvice = '';
  if (overallPct !== null && overallPct >= 80) {
    mentalPhysicalAdvice = 'Ketahanan konsentrasi prima. Tetap jaga ritme pernapasan dan fokus visual pada setiap boule penentu (money boule).';
  } else {
    mentalPhysicalAdvice = 'Latih ketenangan mental dan stabilitas kuda-kuda (posisi kaki & release) saat berada dalam tekanan tertinggal poin.';
  }

  return {
    playerId,
    playerName,
    teamId,
    teamName,
    role,
    totalThrows,
    totalSuccess,
    overallPct,
    pointSuccess,
    pointTotal,
    pointPct,
    shootingSuccess,
    shootingTotal,
    shootingPct,
    carreauCount,
    carreauRatePct,
    tier,
    dominantRole,
    keyObservation,
    tacticalAdvice,
    mentalPhysicalAdvice,
  };
}

// ==========================================
// PRECISION SHOOTING STANDARDS (FOPI / FIPJP / DISERTASI RASYONO)
// ==========================================

export const PRECISION_FIGURES: {
  id: 'fig1' | 'fig2' | 'fig3' | 'fig4' | 'fig5';
  no: number;
  name: string;
  subName: string;
  shortDesc: string;
  carreauDesc: string;
}[] = [
  {
    id: 'fig1',
    no: 1,
    name: 'Figure 1',
    subName: 'Boule Alone',
    shortDesc: 'Boule sasaran tunggal di tengah lingkaran target tanpa rintangan.',
    carreauDesc: 'Carreau (5P): Boule target keluar, boule penembak diam di lingkaran target.',
  },
  {
    id: 'fig2',
    no: 2,
    name: 'Figure 2',
    subName: 'Boule Behind Jack',
    shortDesc: 'Boule sasaran berada tepat di belakang Jack (boka). Jack tidak boleh tersenggol.',
    carreauDesc: 'Carreau (5P): Kena bersih boule tanpa menyentuh Jack pembatas.',
  },
  {
    id: 'fig3',
    no: 3,
    name: 'Figure 3',
    subName: 'Between Two Boules',
    shortDesc: 'Boule sasaran diapit oleh dua boule rintangan di sisi kiri & kanan.',
    carreauDesc: 'Carreau (5P): Boule tengah keluar bersih tanpa menyentuh kedua boule samping.',
  },
  {
    id: 'fig4',
    no: 4,
    name: 'Figure 4',
    subName: 'Jump (Boule Behind Boule)',
    shortDesc: 'Boule sasaran di belakang boule rintangan (membutuhkan tembakan melambung/jump).',
    carreauDesc: 'Carreau (5P): Lemparan parabolik tinggi (tir au fer) mengenai boule belakang tanpa menyentuh boule depan.',
  },
  {
    id: 'fig5',
    no: 5,
    name: 'Figure 5',
    subName: 'Jack (Boka)',
    shortDesc: 'Sasaran bola kecil (boka / cochonet) di tengah lingkaran target.',
    carreauDesc: 'Hit Clean (5P): Jack terlempar keluar dari lingkaran target secara bersih.',
  },
];

export const PRECISION_DISTANCES: ('6.5m' | '7.5m' | '8.5m' | '9.5m')[] = [
  '6.5m',
  '7.5m',
  '8.5m',
  '9.5m',
];

export interface PrecisionEvaluationResult {
  totalScore: number; // 0 - 100
  maxRealisticScore: number; // 60
  percentageRealistic: number; // (totalScore / 60) * 100
  percentageTheoretical: number; // (totalScore / 100) * 100
  tier: RasyonoTierInfo;
  seaGamesVerdict: string;
  medalEstimate: 'EMAS' | 'PERAK' | 'PERUNGGU' | 'EVALUASI';
  confidenceText: string;
  coachingRecommendation: string;
  throwsCompleted: number; // out of 20
}

/**
 * Analisis Keberhasilan Precision Shooting (Slide Disertasi Rasyono UNP & FOPI)
 * 1. Skor Maksimal 20 lemparan = 100 poin (jika 5 terus).
 * 2. Skor Realistis = 3 poin x 20 lemparan = 60 poin (Pernah terjadi di World Games).
 * 3. Skor 60 dianggap 100% kemampuan maksimal atlet.
 * 4. Rata-rata peraih medali SEA Games: 42 s.d 54 poin.
 * 5. Kategori Evaluasi:
 *    - >= 90% (Skor >= 54): MEDALI EMAS - Kategori SANGAT BAIK ("Emas berani kita targetkan")
 *    - 80% - 89% (Skor 48 - 53): MEDALI PERAK - Kategori BAIK ("Dipastikan medali")
 *    - 70% - 79% (Skor 42 - 47): MEDALI PERUNGGU - Kategori CUKUP BAIK ("Bisa bicara medali")
 *    - < 70% (Skor < 42): DI BAWAH STANDAR MEDALI SEA GAMES - Kategori PERLU EVALUASI
 */
export function evaluatePrecisionShootingScore(
  totalScore: number,
  throwsCompleted: number = 20
): PrecisionEvaluationResult {
  const maxRealisticScore = 60;
  const percentageRealistic = Math.round((totalScore / maxRealisticScore) * 1000) / 10;
  const percentageTheoretical = Math.round((totalScore / 100) * 1000) / 10;

  if (throwsCompleted === 0) {
    return {
      totalScore: 0,
      maxRealisticScore,
      percentageRealistic: 0,
      percentageTheoretical: 0,
      tier: RASYONO_BENCHMARK_TIERS.NO_DATA,
      seaGamesVerdict: 'Belum ada lemparan',
      medalEstimate: 'EVALUASI',
      confidenceText: 'Lakukan pengisian skor lemparan.',
      coachingRecommendation: 'Isi skor tiap figure dan jarak.',
      throwsCompleted: 0,
    };
  }

  // Evaluasi batas medali sesuai Slide Disertasi Rasyono
  if (percentageRealistic >= 90 || totalScore >= 54) {
    return {
      totalScore,
      maxRealisticScore,
      percentageRealistic,
      percentageTheoretical,
      tier: RASYONO_BENCHMARK_TIERS.GOLD,
      seaGamesVerdict: 'Kategori Sangat Baik (Level Emas Dunia / SEA Games)',
      medalEstimate: 'EMAS',
      confidenceText: 'Performa ≥ 90% (Skor ≥ 54) — Emas berani kita targetkan di SEA Games!',
      coachingRecommendation:
        'Akurasi tembakan sangat superior. Pertahankan ketenangan respirasi di detik-detik akhir sebelum tembakan dan simulasikan atmosfer bising penonton.',
      throwsCompleted,
    };
  }

  if (percentageRealistic >= 80 || totalScore >= 48) {
    return {
      totalScore,
      maxRealisticScore,
      percentageRealistic,
      percentageTheoretical,
      tier: RASYONO_BENCHMARK_TIERS.SILVER,
      seaGamesVerdict: 'Kategori Baik (Level Perak SEA Games)',
      medalEstimate: 'PERAK',
      confidenceText: 'Performa 80% - 89% (Skor 48 - 53) — Dipastikan medali perak di tangan!',
      coachingRecommendation:
        'Tingkatkan konversi tembakan dari 3 poin (frappe) menjadi 5 poin (carreau) di Figure 1 & 4 untuk melonjak ke batas 54 poin (Emas).',
      throwsCompleted,
    };
  }

  if (percentageRealistic >= 70 || totalScore >= 42) {
    return {
      totalScore,
      maxRealisticScore,
      percentageRealistic,
      percentageTheoretical,
      tier: RASYONO_BENCHMARK_TIERS.BRONZE,
      seaGamesVerdict: 'Kategori Cukup Baik (Level Perunggu SEA Games)',
      medalEstimate: 'PERUNGGU',
      confidenceText: 'Performa 70% - 79% (Skor 42 - 47) — Konsisten di skor 42 kita bisa bicara medali perunggu!',
      coachingRecommendation:
        'Perbaiki akurasi pada jarak terjauh (8.5m & 9.5m). Seringkali kehilangan poin terjadi karena daya lontar tangan melemah di jarak 9.5m.',
      throwsCompleted,
    };
  }

  return {
    totalScore,
    maxRealisticScore,
    percentageRealistic,
    percentageTheoretical,
    tier: RASYONO_BENCHMARK_TIERS.BELOW_BENCHMARK,
    seaGamesVerdict: 'Kategori Perlu Evaluasi (Belum Capai Standar Medali SEA Games)',
    medalEstimate: 'EVALUASI',
    confidenceText: 'Skor masih di bawah 42 poin (<70% standar realistis). Belum masuk zona medali SEA Games.',
    coachingRecommendation:
      'Lakukan intensifikasi drill mekanik rilis tangan. Perkuat fondasi Figure 1 (Boule Alone) dan Figure 5 (Jack) sebagai sumber poin termudah sebelum menghadapi Figure 2, 3, dan 4.',
    throwsCompleted,
  };
}
