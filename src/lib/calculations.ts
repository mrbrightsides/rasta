import {
  ActionType,
  DistanceMeters,
  PerformanceStats,
  ThrowAction,
  DistanceStatsMap,
  SubTechniqueStats,
} from '../types';

// Standar Jarak Boka Petanque Sesuai Aturan Resmi & Proposal Disertasi Hal 7 (6m - 10m)
export const DISTANCES: DistanceMeters[] = ['6m', '7m', '8m', '9m', '10m'];

// Daftar lengkap jarak target jack petanque termasuk pecahan 0.5m
export const ALL_STANDARD_DISTANCES: DistanceMeters[] = [
  '6m',
  '6.5m',
  '7m',
  '7.5m',
  '8m',
  '8.5m',
  '9m',
  '9.5m',
  '10m',
];

function computeSubRate(succ: number, tot: number): SubTechniqueStats {
  if (tot === 0) {
    return { total: 0, success: 0, rate: '-', rateValue: null };
  }
  const val = Math.round((succ / tot) * 1000) / 10;
  return {
    total: tot,
    success: succ,
    rate: `${val.toFixed(1)}%`,
    rateValue: val,
  };
}

/**
 * Calculates performance statistics from an array of ThrowActions.
 * Adheres strictly to the RASTA Petanque methodology:
 * - If zero attempts: returns "-", never NaN, Infinity, or misleading 0%
 * - Pointing Accuracy: successful pointing / total pointing
 * - Shooting Accuracy: successful shooting / total shooting
 * - Carreau Rate: carreau count / total shooting attempts
 * - Distance Control: average recorded distance from boule to jack (cm)
 * - Sub-techniques: Rolling, Half-Lob, High-Lob, Au Fer, Short Shot, Ground Shot
 */
export function calculatePerformance(actions: ThrowAction[]): PerformanceStats {
  let pointingTotal = 0;
  let pointingSuccess = 0;

  // Sub-techniques Pointing
  let rollTot = 0, rollSucc = 0;
  let halfTot = 0, halfSucc = 0;
  let highTot = 0, highSucc = 0;

  let shootingTotal = 0;
  let shootingSuccess = 0;
  let carreauCount = 0;

  // Sub-techniques Shooting
  let ironTot = 0, ironSucc = 0;
  let shortTot = 0, shortSucc = 0;
  let groundTot = 0, groundSucc = 0;

  let totalDistanceCm = 0;
  let distanceCount = 0;

  for (const action of actions) {
    if (action.actionType === 'POINTING') {
      pointingTotal++;
      const isSuccess = action.result === 'SUCCESS';
      if (isSuccess) {
        pointingSuccess++;
      }
      if (typeof action.distanceToJackCm === 'number' && !isNaN(action.distanceToJackCm)) {
        totalDistanceCm += action.distanceToJackCm;
        distanceCount++;
      }

      // Track Pointing Sub-Techniques
      if (action.pointingTechnique === 'ROLLING') {
        rollTot++;
        if (isSuccess) rollSucc++;
      } else if (action.pointingTechnique === 'HALF_LOB') {
        halfTot++;
        if (isSuccess) halfSucc++;
      } else if (action.pointingTechnique === 'HIGH_LOB') {
        highTot++;
        if (isSuccess) highSucc++;
      }
    } else if (action.actionType === 'SHOOTING') {
      shootingTotal++;
      const isSuccess = action.result === 'SUCCESS';
      if (isSuccess) {
        shootingSuccess++;
      }
      if (action.carreau) {
        carreauCount++;
      }

      // Track Shooting Sub-Techniques
      if (action.shootingTechnique === 'IRON') {
        ironTot++;
        if (isSuccess) ironSucc++;
      } else if (action.shootingTechnique === 'SHORT_SHOT') {
        shortTot++;
        if (isSuccess) shortSucc++;
      } else if (action.shootingTechnique === 'GROUND_SHOT') {
        groundTot++;
        if (isSuccess) groundSucc++;
      }
    }
  }

  // Pointing Accuracy (0 attempts -> '-' instead of 0%)
  let pointingAccuracy = '-';
  let pointingAccuracyValue: number | null = null;
  if (pointingTotal > 0) {
    const val = (pointingSuccess / pointingTotal) * 100;
    pointingAccuracyValue = Math.round(val * 10) / 10;
    pointingAccuracy = `${pointingAccuracyValue.toFixed(1)}%`;
  }

  // Shooting Accuracy (0 attempts -> '-' instead of 0%)
  let shootingAccuracy = '-';
  let shootingAccuracyValue: number | null = null;
  if (shootingTotal > 0) {
    const val = (shootingSuccess / shootingTotal) * 100;
    shootingAccuracyValue = Math.round(val * 10) / 10;
    shootingAccuracy = `${shootingAccuracyValue.toFixed(1)}%`;
  }

  // Carreau Rate (0 shooting attempts -> '-' instead of 0%)
  let carreauRate = '-';
  let carreauRateValue: number | null = null;
  if (shootingTotal > 0) {
    const val = (carreauCount / shootingTotal) * 100;
    carreauRateValue = Math.round(val * 10) / 10;
    carreauRate = `${carreauRateValue.toFixed(1)}%`;
  }

  // Distance Control (average cm to jack)
  let distanceControlAvgCm = '-';
  let distanceControlValue: number | null = null;
  if (distanceCount > 0) {
    const val = totalDistanceCm / distanceCount;
    distanceControlValue = Math.round(val * 10) / 10;
    distanceControlAvgCm = `${distanceControlValue.toFixed(1)} cm`;
  }

  // Overall Total
  const totalThrows = pointingTotal + shootingTotal;
  const totalSuccess = pointingSuccess + shootingSuccess;
  let overallAccuracy = '-';
  let overallAccuracyValue: number | null = null;
  if (totalThrows > 0) {
    const val = (totalSuccess / totalThrows) * 100;
    overallAccuracyValue = Math.round(val * 10) / 10;
    overallAccuracy = `${overallAccuracyValue.toFixed(1)}%`;
  }

  return {
    pointingTotal,
    pointingSuccess,
    pointingAccuracy,
    pointingAccuracyValue,

    shootingTotal,
    shootingSuccess,
    shootingAccuracy,
    shootingAccuracyValue,

    carreauCount,
    carreauRate,
    carreauRateValue,

    distanceControlAvgCm,
    distanceControlValue,
    distanceControlThrowsCount: distanceCount,

    totalThrows,
    totalSuccess,
    overallAccuracy,
    overallAccuracyValue,

    pointingRolling: computeSubRate(rollSucc, rollTot),
    pointingHalfLob: computeSubRate(halfSucc, halfTot),
    pointingHighLob: computeSubRate(highSucc, highTot),

    shootingIron: computeSubRate(ironSucc, ironTot),
    shootingShortShot: computeSubRate(shortSucc, shortTot),
    shootingGroundShot: computeSubRate(groundSucc, groundTot),
  };
}

/**
 * Calculates statistics partitioned across distances (6m, 7m, 8m, 9m, 10m, and TOTAL).
 */
export function calculateStatsByDistance(actions: ThrowAction[]): DistanceStatsMap {
  const result: Partial<DistanceStatsMap> = {
    TOTAL: calculatePerformance(actions),
  };

  for (const d of DISTANCES) {
    const targetMeter = parseFloat(d);
    const subset = actions.filter((a) => {
      if (a.distance === d) return true;
      const actMeter = parseFloat(a.distance);
      if (!isNaN(actMeter) && !isNaN(targetMeter)) {
        return Math.round(actMeter) === targetMeter;
      }
      return false;
    });
    result[d] = calculatePerformance(subset);
  }

  return result as DistanceStatsMap;
}

/**
 * Informasi aturan jumlah bola petanque resmi:
 * - Single (1 vs 1): 3 bola per atlet (total 6 bola per end)
 * - Double (2 vs 2): 3 bola per atlet (total 12 bola per end)
 * - Triple (3 vs 3): 2 bola per atlet (total 12 bola per end)
 */
export interface CategoryBouleInfo {
  type: 'SINGLE' | 'DOUBLE' | 'TRIPLE';
  boulesPerAthlete: number;
  boulesPerTeam: number;
  totalBoulesPerEnd: number;
  label: string;
  description: string;
}

export function getCategoryBouleInfo(category?: string, playersPerTeam?: number): CategoryBouleInfo {
  const cat = (category || '').toUpperCase();
  if (cat.includes('SINGLE') || playersPerTeam === 1) {
    return {
      type: 'SINGLE',
      boulesPerAthlete: 3,
      boulesPerTeam: 3,
      totalBoulesPerEnd: 6,
      label: 'Single (1 vs 1)',
      description: 'Single: 3 bola per atlet (total 6 bola per end)',
    };
  }
  if (cat.includes('DOUBLE') || playersPerTeam === 2) {
    return {
      type: 'DOUBLE',
      boulesPerAthlete: 3,
      boulesPerTeam: 6,
      totalBoulesPerEnd: 12,
      label: 'Double (2 vs 2)',
      description: 'Double: 3 bola per atlet (total 12 bola per end)',
    };
  }
  return {
    type: 'TRIPLE',
    boulesPerAthlete: 2,
    boulesPerTeam: 6,
    totalBoulesPerEnd: 12,
    label: 'Triple (3 vs 3)',
    description: 'Triple: 2 bola per atlet (total 12 bola per end)',
  };
}

/**
 * Tracks boule counts for active end (e.g. 6 boules per team in Triples, 3 in Singles)
 */
export function calculateEndBouleCounts(
  actions: ThrowAction[],
  endNumber: number,
  teamAId: string,
  teamBId: string,
  maxBoulesPerTeam = 6
) {
  const endActions = actions.filter((a) => a.endNumber === endNumber);
  const teamAThrows = endActions.filter((a) => a.teamId === teamAId).length;
  const teamBThrows = endActions.filter((a) => a.teamId === teamBId).length;

  return {
    teamA: {
      thrown: teamAThrows,
      remaining: Math.max(0, maxBoulesPerTeam - teamAThrows),
      max: maxBoulesPerTeam,
    },
    teamB: {
      thrown: teamBThrows,
      remaining: Math.max(0, maxBoulesPerTeam - teamBThrows),
      max: maxBoulesPerTeam,
    },
    totalThrown: endActions.length,
    maxTotal: maxBoulesPerTeam * 2,
  };
}

/**
 * Transforms performance data into a radar chart normalized representation (0-100 scale).
 */
export function getRadarMetrics(stats: PerformanceStats, label: string) {
  // Normalize distance control: in petanque, 15cm is elite (90+), 100cm is 0.
  let distanceScore = 0;
  if (stats.distanceControlValue !== null) {
    distanceScore = Math.max(0, Math.min(100, Math.round(100 - stats.distanceControlValue)));
  }

  return [
    {
      metric: 'Pointing',
      fullName: 'Pointing Accuracy',
      value: stats.pointingAccuracyValue ?? 0,
      display: stats.pointingAccuracy,
    },
    {
      metric: 'Shooting',
      fullName: 'Shooting Accuracy',
      value: stats.shootingAccuracyValue ?? 0,
      display: stats.shootingAccuracy,
    },
    {
      metric: 'Carreau',
      fullName: 'Carreau Rate',
      value: stats.carreauRateValue ?? 0,
      display: stats.carreauRate,
    },
    {
      metric: 'Dist. Control',
      fullName: 'Distance Control Score',
      value: stats.distanceControlValue !== null ? distanceScore : 0,
      display: stats.distanceControlAvgCm,
    },
    {
      metric: 'Overall',
      fullName: 'Total Effectiveness',
      value: stats.overallAccuracyValue ?? 0,
      display: stats.overallAccuracy,
    },
  ];
}
