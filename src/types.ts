export type DistanceMeters =
  | '6m'
  | '7m'
  | '7.5m'
  | '8m'
  | '8.5m'
  | '9m'
  | '9.5m'
  | '10m'
  | '6.2m'
  | string;

export type ActionType = 'POINTING' | 'SHOOTING';

export type ActionResult = 'SUCCESS' | 'FAIL';

export type ShootingQuality = 'CARREAU' | 'NON-CARREAU';

// Sub-teknik Pointing & Shooting sesuai Bab II Halaman 17-21 Proposal Disertasi Rasyono
export type PointingTechnique = 'ROLLING' | 'HALF_LOB' | 'HIGH_LOB'; // Gesur, Soft/Half-Lob, High-Lob
export type ShootingTechnique = 'IRON' | 'SHORT_SHOT' | 'GROUND_SHOT'; // Shot on the Iron, Short Shot, Ground Shot

export type MatchCategory =
  | 'TRIPLE_MEN'
  | 'MIXED_TRIPLE'
  | 'TRIPLE_WOMEN'
  | 'DOUBLE_MEN'
  | 'DOUBLE_WOMEN'
  | 'MIXED_DOUBLE'
  | 'SINGLE_MEN'
  | 'SINGLE_WOMEN';

export type PerformanceTier = 'GOLD_TARGET' | 'SILVER_TARGET' | 'BRONZE_TARGET' | 'EVALUATION_NEEDED';

export type MatchStatus = 'LIVE' | 'FINISHED' | 'PAUSED';

export interface Player {
  id: string;
  name: string;
  teamId: string;
  role?: 'POINTER' | 'SHOOTER' | 'MILIEU';
  number?: number;
}

export interface Team {
  id: string;
  name: string;
  countryCode?: string;
  color?: string; // French blue, red, etc.
  players: Player[];
}

export interface ThrowAction {
  id: string;
  matchId: string;
  endId: string;
  endNumber: number;
  teamId: string;
  playerId: string;
  playerName: string;
  actionType: ActionType;
  distance: DistanceMeters;
  result: ActionResult;
  bouleNumber?: 1 | 2; // Boule 1 or Boule 2 in this Jack
  scoreValue?: 1 | 0; // 1 = Berhasil, 0 = Gagal (matches Excel format)
  carreau?: boolean; // true if carreau
  pointingTechnique?: PointingTechnique; // Rolling, Half-Lob, High-Lob (Bab II Hal 17-18)
  shootingTechnique?: ShootingTechnique; // Iron, Short Shot, Ground Shot (Bab II Hal 19-21)
  distanceToJackCm?: number; // Distance in cm to jack (for distance control)
  timestamp: number;
}

export interface EndRound {
  id: string;
  matchId: string;
  endNumber: number;
  distance: DistanceMeters;
  scoreA: number; // Points won by Team A in this end
  scoreB: number; // Points won by Team B in this end
  runningScoreA?: number; // Running score after this end
  runningScoreB?: number;
  winnerTeamId?: string | null;
  isCompleted: boolean;
}

export interface Match {
  id: string;
  name: string;
  date: string;
  location?: string;
  category?: MatchCategory; // Triple Men, Mixed Triple, dll. (Fitur 1 Hal 13)
  status: MatchStatus;
  targetScore: number; // Usually 13 in petanque
  teamA: Team;
  teamB: Team;
  scoreA: number; // Total points
  scoreB: number; // Total points
  currentEndNumber: number;
  currentDistance: DistanceMeters;
  ends: EndRound[];
  actions: ThrowAction[];
  createdAt: number;
  updatedAt: number;
}

export interface BenchmarkEvaluation {
  tier: PerformanceTier;
  label: string;
  medal: string;
  color: string;
  bgColor: string;
  description: string;
}

/**
 * Benchmark Evaluasi Performa Disertasi Rasyono (Bab I Halaman 9):
 * - >= 90%: Standar Elit Dunia / Target Medali Emas
 * - 80% - 89%: Standar Final / Target Medali Perak
 * - 70% - 79%: Standar Semifinal / Target Medali Perunggu
 * - < 70%: Perlu Evaluasi & Peningkatan Konsistensi
 */
export function evaluatePerformanceTier(accuracyPct: number): BenchmarkEvaluation {
  if (accuracyPct >= 90) {
    return {
      tier: 'GOLD_TARGET',
      label: 'Performa Elit (≥90%)',
      medal: 'Target Medali Emas',
      color: 'text-amber-800',
      bgColor: 'bg-amber-100 border-amber-300',
      description: 'Sangat realistis untuk meraih Medali Emas. Konsistensi teknik optimal.',
    };
  }
  if (accuracyPct >= 80) {
    return {
      tier: 'SILVER_TARGET',
      label: 'Performa Final (80% - 89%)',
      medal: 'Target Medali Perak',
      color: 'text-slate-800',
      bgColor: 'bg-slate-100 border-slate-300',
      description: 'Memenuhi standar minimal lolos ke Babak Final (Peringkat 2).',
    };
  }
  if (accuracyPct >= 70) {
    return {
      tier: 'BRONZE_TARGET',
      label: 'Performa Semifinal (70% - 79%)',
      medal: 'Target Medali Perunggu',
      color: 'text-amber-900',
      bgColor: 'bg-orange-50 border-orange-200',
      description: 'Memenuhi standar minimal mencapai Babak Semifinal (Peringkat 3).',
    };
  }
  return {
    tier: 'EVALUATION_NEEDED',
    label: 'Perlu Peningkatan (<70%)',
    medal: 'Di Bawah Standar Podium',
    color: 'text-rose-700',
    bgColor: 'bg-rose-50 border-rose-200',
    description: 'Akurasi belum mencapai standar semifinal. Perlu drill intensif.',
  };
}

export interface SubTechniqueStats {
  total: number;
  success: number;
  rate: string; // e.g. "80.0%" or "-"
  rateValue: number | null; // numeric 0-100 or null if 0 attempts
}

export interface PerformanceStats {
  pointingTotal: number;
  pointingSuccess: number;
  pointingAccuracy: string; // e.g. "75.0%" or "-" (Excel #DIV/0!)
  pointingAccuracyValue: number | null; // numeric 0-100 or null if no attempts

  shootingTotal: number;
  shootingSuccess: number;
  shootingAccuracy: string; // e.g. "68.2%" or "-" (Excel #DIV/0!)
  shootingAccuracyValue: number | null;

  carreauCount: number;
  carreauRate: string; // e.g. "36.4%" or "-"
  carreauRateValue: number | null;

  distanceControlAvgCm: string; // e.g. "28.4 cm" or "-"
  distanceControlValue: number | null; // numeric cm or null
  distanceControlThrowsCount: number;

  totalThrows: number;
  totalSuccess: number;
  overallAccuracy: string; // e.g. "71.4%" or "-"
  overallAccuracyValue: number | null;

  // Sub-teknik Pointing (Bab II Hal 17-18)
  pointingRolling: SubTechniqueStats;
  pointingHalfLob: SubTechniqueStats;
  pointingHighLob: SubTechniqueStats;

  // Sub-teknik Shooting (Bab II Hal 19-21)
  shootingIron: SubTechniqueStats;
  shootingShortShot: SubTechniqueStats;
  shootingGroundShot: SubTechniqueStats;
}

export type DistanceStatsMap = Record<DistanceMeters | 'TOTAL', PerformanceStats>;

export interface TeamFullTimeStats {
  team: Team;
  score: number;
  byDistance: DistanceStatsMap;
  overall: PerformanceStats;
}

export interface AthleteStats {
  player: Player;
  team: Team;
  overall: PerformanceStats;
  byDistance: DistanceStatsMap;
}

export interface EndStatistic {
  end: EndRound;
  teamAStats: PerformanceStats;
  teamBStats: PerformanceStats;
}
