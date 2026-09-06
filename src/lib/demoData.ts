import { Match, Team, EndRound, ThrowAction, Player } from '../types';

export const DEMO_TEAM_A: Team = {
  id: 'team_ina',
  name: 'INDONESIA',
  countryCode: 'INA',
  color: '#ED2939', // French Red accent for contrast
  players: [
    { id: 'p_heri', name: 'Heri', teamId: 'team_ina', role: 'POINTER', number: 1 },
    { id: 'p_muhlizi', name: 'Muhlizi', teamId: 'team_ina', role: 'SHOOTER', number: 7 },
    { id: 'p_topan', name: 'Topan', teamId: 'team_ina', role: 'MILIEU', number: 10 },
  ],
};

export const DEMO_TEAM_B: Team = {
  id: 'team_tha',
  name: 'THAILAND',
  countryCode: 'THA',
  color: '#0055A5', // French Blue accent
  players: [
    { id: 'p_thanakorn', name: 'Thanakorn', teamId: 'team_tha', role: 'POINTER', number: 3 },
    { id: 'p_ratchata', name: 'Ratchata', teamId: 'team_tha', role: 'SHOOTER', number: 9 },
    { id: 'p_sarawut', name: 'Sarawut', teamId: 'team_tha', role: 'MILIEU', number: 5 },
  ],
};

export function createDemoMatch(): Match {
  const matchId = 'match_demo_01';
  const ends: EndRound[] = [
    { id: 'end_1', matchId, endNumber: 1, distance: '7m', scoreA: 2, scoreB: 0, winnerTeamId: 'team_ina', isCompleted: true },
    { id: 'end_2', matchId, endNumber: 2, distance: '8m', scoreA: 0, scoreB: 1, winnerTeamId: 'team_tha', isCompleted: true },
    { id: 'end_3', matchId, endNumber: 3, distance: '6m', scoreA: 3, scoreB: 0, winnerTeamId: 'team_ina', isCompleted: true },
    { id: 'end_4', matchId, endNumber: 4, distance: '9m', scoreA: 0, scoreB: 2, winnerTeamId: 'team_tha', isCompleted: true },
    { id: 'end_5', matchId, endNumber: 5, distance: '7m', scoreA: 1, scoreB: 0, winnerTeamId: 'team_ina', isCompleted: true },
    { id: 'end_6', matchId, endNumber: 6, distance: '8m', scoreA: 0, scoreB: 3, winnerTeamId: 'team_tha', isCompleted: true },
    { id: 'end_7', matchId, endNumber: 7, distance: '8m', scoreA: 2, scoreB: 0, winnerTeamId: 'team_ina', isCompleted: false },
  ];

  const actions: ThrowAction[] = [
    // End 1 (7m) - INA vs THA
    { id: 'a_1', matchId, endId: 'end_1', endNumber: 1, teamId: 'team_ina', playerId: 'p_heri', playerName: 'Heri', actionType: 'POINTING', distance: '7m', result: 'SUCCESS', distanceToJackCm: 18, timestamp: 1700001000 },
    { id: 'a_2', matchId, endId: 'end_1', endNumber: 1, teamId: 'team_tha', playerId: 'p_thanakorn', playerName: 'Thanakorn', actionType: 'POINTING', distance: '7m', result: 'SUCCESS', distanceToJackCm: 25, timestamp: 1700001060 },
    { id: 'a_3', matchId, endId: 'end_1', endNumber: 1, teamId: 'team_ina', playerId: 'p_muhlizi', playerName: 'Muhlizi', actionType: 'SHOOTING', distance: '7m', result: 'SUCCESS', carreau: true, timestamp: 1700001120 },
    { id: 'a_4', matchId, endId: 'end_1', endNumber: 1, teamId: 'team_tha', playerId: 'p_ratchata', playerName: 'Ratchata', actionType: 'SHOOTING', distance: '7m', result: 'FAIL', carreau: false, timestamp: 1700001180 },
    { id: 'a_5', matchId, endId: 'end_1', endNumber: 1, teamId: 'team_ina', playerId: 'p_topan', playerName: 'Topan', actionType: 'POINTING', distance: '7m', result: 'SUCCESS', distanceToJackCm: 22, timestamp: 1700001240 },
    { id: 'a_6', matchId, endId: 'end_1', endNumber: 1, teamId: 'team_tha', playerId: 'p_sarawut', playerName: 'Sarawut', actionType: 'SHOOTING', distance: '7m', result: 'SUCCESS', carreau: false, timestamp: 1700001300 },

    // End 2 (8m)
    { id: 'a_7', matchId, endId: 'end_2', endNumber: 2, teamId: 'team_tha', playerId: 'p_thanakorn', playerName: 'Thanakorn', actionType: 'POINTING', distance: '8m', result: 'SUCCESS', distanceToJackCm: 15, timestamp: 1700002000 },
    { id: 'a_8', matchId, endId: 'end_2', endNumber: 2, teamId: 'team_ina', playerId: 'p_heri', playerName: 'Heri', actionType: 'POINTING', distance: '8m', result: 'FAIL', distanceToJackCm: 65, timestamp: 1700002060 },
    { id: 'a_9', matchId, endId: 'end_2', endNumber: 2, teamId: 'team_ina', playerId: 'p_muhlizi', playerName: 'Muhlizi', actionType: 'SHOOTING', distance: '8m', result: 'FAIL', carreau: false, timestamp: 1700002120 },
    { id: 'a_10', matchId, endId: 'end_2', endNumber: 2, teamId: 'team_tha', playerId: 'p_ratchata', playerName: 'Ratchata', actionType: 'SHOOTING', distance: '8m', result: 'SUCCESS', carreau: true, timestamp: 1700002180 },

    // End 3 (6m)
    { id: 'a_11', matchId, endId: 'end_3', endNumber: 3, teamId: 'team_ina', playerId: 'p_heri', playerName: 'Heri', actionType: 'POINTING', distance: '6m', result: 'SUCCESS', distanceToJackCm: 12, timestamp: 1700003000 },
    { id: 'a_12', matchId, endId: 'end_3', endNumber: 3, teamId: 'team_tha', playerId: 'p_thanakorn', playerName: 'Thanakorn', actionType: 'POINTING', distance: '6m', result: 'SUCCESS', distanceToJackCm: 30, timestamp: 1700003060 },
    { id: 'a_13', matchId, endId: 'end_3', endNumber: 3, teamId: 'team_ina', playerId: 'p_muhlizi', playerName: 'Muhlizi', actionType: 'SHOOTING', distance: '6m', result: 'SUCCESS', carreau: true, timestamp: 1700003120 },
    { id: 'a_14', matchId, endId: 'end_3', endNumber: 3, teamId: 'team_ina', playerId: 'p_topan', playerName: 'Topan', actionType: 'POINTING', distance: '6m', result: 'SUCCESS', distanceToJackCm: 20, timestamp: 1700003180 },
    { id: 'a_15', matchId, endId: 'end_3', endNumber: 3, teamId: 'team_tha', playerId: 'p_ratchata', playerName: 'Ratchata', actionType: 'SHOOTING', distance: '6m', result: 'FAIL', carreau: false, timestamp: 1700003240 },

    // End 4 (9m)
    { id: 'a_16', matchId, endId: 'end_4', endNumber: 4, teamId: 'team_ina', playerId: 'p_heri', playerName: 'Heri', actionType: 'POINTING', distance: '9m', result: 'FAIL', distanceToJackCm: 85, timestamp: 1700004000 },
    { id: 'a_17', matchId, endId: 'end_4', endNumber: 4, teamId: 'team_tha', playerId: 'p_thanakorn', playerName: 'Thanakorn', actionType: 'POINTING', distance: '9m', result: 'SUCCESS', distanceToJackCm: 28, timestamp: 1700004060 },
    { id: 'a_18', matchId, endId: 'end_4', endNumber: 4, teamId: 'team_ina', playerId: 'p_muhlizi', playerName: 'Muhlizi', actionType: 'SHOOTING', distance: '9m', result: 'FAIL', carreau: false, timestamp: 1700004120 },
    { id: 'a_19', matchId, endId: 'end_4', endNumber: 4, teamId: 'team_tha', playerId: 'p_ratchata', playerName: 'Ratchata', actionType: 'SHOOTING', distance: '9m', result: 'SUCCESS', carreau: false, timestamp: 1700004180 },

    // End 5 (7m)
    { id: 'a_20', matchId, endId: 'end_5', endNumber: 5, teamId: 'team_ina', playerId: 'p_heri', playerName: 'Heri', actionType: 'POINTING', distance: '7m', result: 'SUCCESS', distanceToJackCm: 16, timestamp: 1700005000 },
    { id: 'a_21', matchId, endId: 'end_5', endNumber: 5, teamId: 'team_tha', playerId: 'p_thanakorn', playerName: 'Thanakorn', actionType: 'POINTING', distance: '7m', result: 'FAIL', distanceToJackCm: 55, timestamp: 1700005060 },
    { id: 'a_22', matchId, endId: 'end_5', endNumber: 5, teamId: 'team_ina', playerId: 'p_muhlizi', playerName: 'Muhlizi', actionType: 'SHOOTING', distance: '7m', result: 'SUCCESS', carreau: true, timestamp: 1700005120 },

    // End 6 (8m)
    { id: 'a_23', matchId, endId: 'end_6', endNumber: 6, teamId: 'team_tha', playerId: 'p_thanakorn', playerName: 'Thanakorn', actionType: 'POINTING', distance: '8m', result: 'SUCCESS', distanceToJackCm: 19, timestamp: 1700006000 },
    { id: 'a_24', matchId, endId: 'end_6', endNumber: 6, teamId: 'team_ina', playerId: 'p_heri', playerName: 'Heri', actionType: 'POINTING', distance: '8m', result: 'FAIL', distanceToJackCm: 60, timestamp: 1700006060 },
    { id: 'a_25', matchId, endId: 'end_6', endNumber: 6, teamId: 'team_tha', playerId: 'p_ratchata', playerName: 'Ratchata', actionType: 'SHOOTING', distance: '8m', result: 'SUCCESS', carreau: true, timestamp: 1700006120 },
    { id: 'a_26', matchId, endId: 'end_6', endNumber: 6, teamId: 'team_tha', playerId: 'p_sarawut', playerName: 'Sarawut', actionType: 'POINTING', distance: '8m', result: 'SUCCESS', distanceToJackCm: 24, timestamp: 1700006180 },

    // End 7 (8m) - Active End
    { id: 'a_27', matchId, endId: 'end_7', endNumber: 7, teamId: 'team_ina', playerId: 'p_heri', playerName: 'Heri', actionType: 'POINTING', distance: '8m', result: 'SUCCESS', distanceToJackCm: 14, timestamp: 1700007000 },
    { id: 'a_28', matchId, endId: 'end_7', endNumber: 7, teamId: 'team_tha', playerId: 'p_thanakorn', playerName: 'Thanakorn', actionType: 'POINTING', distance: '8m', result: 'FAIL', distanceToJackCm: 48, timestamp: 1700007060 },
    { id: 'a_29', matchId, endId: 'end_7', endNumber: 7, teamId: 'team_ina', playerId: 'p_muhlizi', playerName: 'Muhlizi', actionType: 'SHOOTING', distance: '8m', result: 'SUCCESS', carreau: true, timestamp: 1700007120 },
    { id: 'a_30', matchId, endId: 'end_7', endNumber: 7, teamId: 'team_tha', playerId: 'p_ratchata', playerName: 'Ratchata', actionType: 'SHOOTING', distance: '8m', result: 'FAIL', carreau: false, timestamp: 1700007180 },
  ];

  return {
    id: matchId,
    name: 'SEA Games 2025 Final — Men Triples',
    date: '2025-05-14',
    location: 'Court 1 — Chonburi Petanque Arena',
    status: 'LIVE',
    targetScore: 13,
    teamA: DEMO_TEAM_A,
    teamB: DEMO_TEAM_B,
    scoreA: 8,
    scoreB: 6,
    currentEndNumber: 7,
    currentDistance: '8m',
    ends,
    actions,
    createdAt: 1700000000,
    updatedAt: Date.now(),
  };
}

/**
 * Creates the exact match from user's Excel sheet:
 * "GAMES 2 ; PERFORMA MIXED TRIPLE 26 OKTOBER 2025"
 * HERI CS (Heri, Andreas, Sifa) vs BAGAS CS (Bagas, Dhoni/Andri, Muhlis)
 * Final Score: 10 vs 13
 */
export function createMixedTripleMatch(): Match {
  const matchId = 'match_mixed_triple_2025_10_26';
  const teamA: Team = {
    id: 'team_heri_cs',
    name: 'HERI CS',
    countryCode: 'INA',
    color: '#002395',
    players: [
      { id: 'p_heri', name: 'HERI', teamId: 'team_heri_cs', role: 'SHOOTER', number: 1 },
      { id: 'p_andreas', name: 'ANDREAS', teamId: 'team_heri_cs', role: 'MILIEU', number: 2 },
      { id: 'p_sifa', name: 'SIFA', teamId: 'team_heri_cs', role: 'POINTER', number: 3 },
    ],
  };

  const teamB: Team = {
    id: 'team_bagas_cs',
    name: 'BAGAS CS',
    countryCode: 'INA',
    color: '#ED2939',
    players: [
      { id: 'p_bagas', name: 'BAGAS', teamId: 'team_bagas_cs', role: 'SHOOTER', number: 4 },
      { id: 'p_andri', name: 'DHONI/ANDRI', teamId: 'team_bagas_cs', role: 'MILIEU', number: 5 },
      { id: 'p_muhlis', name: 'MUHLIS', teamId: 'team_bagas_cs', role: 'POINTER', number: 6 },
    ],
  };

  const jackDistances: string[] = [
    '7.5m', '8m', '6.5m', '8.2m', '7m', '9m',
    '7.5m', '7.5m', '7.5m', '9.5m', '6.2m', '7m', '8m'
  ];

  const runningScores: { a: number; b: number }[] = [
    { a: 2, b: 0 },
    { a: 3, b: 0 },
    { a: 6, b: 0 },
    { a: 6, b: 2 },
    { a: 8, b: 2 },
    { a: 9, b: 4 },
    { a: 10, b: 4 }, // Jack 7
    { a: 10, b: 4 }, // Jack 8
    { a: 10, b: 7 }, // Jack 9 (+3 for Team B)
    { a: 10, b: 10 }, // Jack 10 (+3 for Team B)
    { a: 10, b: 11 }, // Jack 11 (+1 for Team B)
    { a: 10, b: 11 }, // Jack 12 (0-0)
    { a: 10, b: 13 }, // Jack 13 (+2 for Team B -> 13)
  ];

  const ends: EndRound[] = runningScores.map((score, idx) => {
    const endNum = idx + 1;
    const prevScore = idx > 0 ? runningScores[idx - 1] : { a: 0, b: 0 };
    const scoreAInEnd = score.a - prevScore.a;
    const scoreBInEnd = score.b - prevScore.b;
    const winner = scoreAInEnd > scoreBInEnd ? 'team_heri_cs' : scoreBInEnd > scoreAInEnd ? 'team_bagas_cs' : null;

    return {
      id: `end_mt_${endNum}`,
      matchId,
      endNumber: endNum,
      distance: jackDistances[idx] || '7.5m',
      scoreA: scoreAInEnd,
      scoreB: scoreBInEnd,
      runningScoreA: score.a,
      runningScoreB: score.b,
      winnerTeamId: winner,
      isCompleted: true,
    };
  });

  // Now create actions matching the EXACT totals in user's Excel summary table:
  // HERI: Point (4/5), Shooting (11/21)
  // ANDREAS: Point (12/14), Shooting (6/12)
  // SIFA: Point (17/23), Shooting (0/1)
  // BAGAS: Point (0/1), Shooting (18/24)
  // DHONI/ANDRI: Point (10/15), Shooting (6/9)
  // MUHLIS: Point (9/12), Shooting (6/10)

  const actions: ThrowAction[] = [];
  let actCounter = 1;

  function pushThrows(
    endNum: number,
    playerId: string,
    playerName: string,
    teamId: string,
    actionType: 'POINTING' | 'SHOOTING',
    successCount: number,
    failCount: number,
    dist: string
  ) {
    for (let i = 0; i < successCount; i++) {
      actions.push({
        id: `a_mt_${actCounter++}`,
        matchId,
        endId: `end_mt_${endNum}`,
        endNumber: endNum,
        teamId,
        playerId,
        playerName,
        actionType,
        distance: dist,
        result: 'SUCCESS',
        scoreValue: 1,
        bouleNumber: (actions.filter(a => a.endNumber === endNum && a.playerId === playerId).length % 2 === 0 ? 1 : 2) as 1 | 2,
        carreau: actionType === 'SHOOTING' && Math.random() > 0.6,
        distanceToJackCm: actionType === 'POINTING' ? Math.floor(15 + Math.random() * 25) : undefined,
        timestamp: 1730000000 + actCounter * 60,
      });
    }
    for (let i = 0; i < failCount; i++) {
      actions.push({
        id: `a_mt_${actCounter++}`,
        matchId,
        endId: `end_mt_${endNum}`,
        endNumber: endNum,
        teamId,
        playerId,
        playerName,
        actionType,
        distance: dist,
        result: 'FAIL',
        scoreValue: 0,
        bouleNumber: (actions.filter(a => a.endNumber === endNum && a.playerId === playerId).length % 2 === 0 ? 1 : 2) as 1 | 2,
        carreau: false,
        distanceToJackCm: actionType === 'POINTING' ? Math.floor(55 + Math.random() * 45) : undefined,
        timestamp: 1730000000 + actCounter * 60,
      });
    }
  }

  // Distribution matching Jack 7 to 13 from the Excel sheet:
  // Jack 7 (7.5m): HERI Point [1, 1]; ANDREAS Point [1, 1]; SIFA Point [1, 1]; BAGAS Point [0], Shooting [1, 1]; ANDRI Point [0], Shooting [1]; MUHLIS Point [1, 1]
  pushThrows(7, 'p_heri', 'HERI', 'team_heri_cs', 'POINTING', 2, 0, '7.5m');
  pushThrows(7, 'p_andreas', 'ANDREAS', 'team_heri_cs', 'POINTING', 2, 0, '7.5m');
  pushThrows(7, 'p_sifa', 'SIFA', 'team_heri_cs', 'POINTING', 2, 0, '7.5m');
  pushThrows(7, 'p_bagas', 'BAGAS', 'team_bagas_cs', 'POINTING', 0, 1, '7.5m');
  pushThrows(7, 'p_bagas', 'BAGAS', 'team_bagas_cs', 'SHOOTING', 2, 0, '7.5m');
  pushThrows(7, 'p_andri', 'DHONI/ANDRI', 'team_bagas_cs', 'POINTING', 0, 1, '7.5m');
  pushThrows(7, 'p_andri', 'DHONI/ANDRI', 'team_bagas_cs', 'SHOOTING', 1, 0, '7.5m');
  pushThrows(7, 'p_muhlis', 'MUHLIS', 'team_bagas_cs', 'POINTING', 2, 0, '7.5m');

  // Jack 8 (7.5m): HERI Shooting [1, 1]; ANDREAS Point [1, 1]; SIFA Point [1, 1]; BAGAS Shooting [1]; ANDRI Point [1, 1]; MUHLIS Point [1], Shooting [1]
  pushThrows(8, 'p_heri', 'HERI', 'team_heri_cs', 'SHOOTING', 2, 0, '7.5m');
  pushThrows(8, 'p_andreas', 'ANDREAS', 'team_heri_cs', 'POINTING', 2, 0, '7.5m');
  pushThrows(8, 'p_sifa', 'SIFA', 'team_heri_cs', 'POINTING', 2, 0, '7.5m');
  pushThrows(8, 'p_bagas', 'BAGAS', 'team_bagas_cs', 'SHOOTING', 1, 0, '7.5m');
  pushThrows(8, 'p_andri', 'DHONI/ANDRI', 'team_bagas_cs', 'POINTING', 2, 0, '7.5m');
  pushThrows(8, 'p_muhlis', 'MUHLIS', 'team_bagas_cs', 'POINTING', 1, 0, '7.5m');
  pushThrows(8, 'p_muhlis', 'MUHLIS', 'team_bagas_cs', 'SHOOTING', 1, 0, '7.5m');

  // Jack 9 (7.5m): HERI Point [1, 0]; ANDREAS Point [1, 1]; SIFA Point [1, 1]; BAGAS Shooting [1, 1]; ANDRI Point [1], Shooting [1]; MUHLIS Point [1], Shooting [0]
  pushThrows(9, 'p_heri', 'HERI', 'team_heri_cs', 'POINTING', 1, 1, '7.5m');
  pushThrows(9, 'p_andreas', 'ANDREAS', 'team_heri_cs', 'POINTING', 2, 0, '7.5m');
  pushThrows(9, 'p_sifa', 'SIFA', 'team_heri_cs', 'POINTING', 2, 0, '7.5m');
  pushThrows(9, 'p_bagas', 'BAGAS', 'team_bagas_cs', 'SHOOTING', 2, 0, '7.5m');
  pushThrows(9, 'p_andri', 'DHONI/ANDRI', 'team_bagas_cs', 'POINTING', 1, 0, '7.5m');
  pushThrows(9, 'p_andri', 'DHONI/ANDRI', 'team_bagas_cs', 'SHOOTING', 1, 0, '7.5m');
  pushThrows(9, 'p_muhlis', 'MUHLIS', 'team_bagas_cs', 'POINTING', 1, 0, '7.5m');
  pushThrows(9, 'p_muhlis', 'MUHLIS', 'team_bagas_cs', 'SHOOTING', 0, 1, '7.5m');

  // Jack 10 (9.5m): HERI Shooting [0, 0]; ANDREAS Shooting [0, 0]; SIFA Point [0, 0]; BAGAS Point [0], Shooting [1]; ANDRI Point [0, 1]; MUHLIS Point [1, 0]
  pushThrows(10, 'p_heri', 'HERI', 'team_heri_cs', 'SHOOTING', 0, 2, '9.5m');
  pushThrows(10, 'p_andreas', 'ANDREAS', 'team_heri_cs', 'SHOOTING', 0, 2, '9.5m');
  pushThrows(10, 'p_sifa', 'SIFA', 'team_heri_cs', 'POINTING', 0, 2, '9.5m');
  pushThrows(10, 'p_bagas', 'BAGAS', 'team_bagas_cs', 'POINTING', 0, 0, '9.5m');
  pushThrows(10, 'p_bagas', 'BAGAS', 'team_bagas_cs', 'SHOOTING', 1, 0, '9.5m');
  pushThrows(10, 'p_andri', 'DHONI/ANDRI', 'team_bagas_cs', 'POINTING', 0, 1, '9.5m');
  pushThrows(10, 'p_muhlis', 'MUHLIS', 'team_bagas_cs', 'POINTING', 1, 1, '9.5m');

  // Jack 11 (6.2m): HERI Shooting [1, 0]; ANDREAS Point [1, 0]; SIFA Point [1, 0]; BAGAS Shooting [1, 1]; ANDRI Point [1, 0]; MUHLIS Shooting [1, 0]
  pushThrows(11, 'p_heri', 'HERI', 'team_heri_cs', 'SHOOTING', 1, 1, '6.2m');
  pushThrows(11, 'p_andreas', 'ANDREAS', 'team_heri_cs', 'POINTING', 1, 1, '6.2m');
  pushThrows(11, 'p_sifa', 'SIFA', 'team_heri_cs', 'POINTING', 1, 1, '6.2m');
  pushThrows(11, 'p_bagas', 'BAGAS', 'team_bagas_cs', 'SHOOTING', 2, 0, '6.2m');
  pushThrows(11, 'p_andri', 'DHONI/ANDRI', 'team_bagas_cs', 'POINTING', 1, 1, '6.2m');
  pushThrows(11, 'p_muhlis', 'MUHLIS', 'team_bagas_cs', 'SHOOTING', 1, 1, '6.2m');

  // Jack 12 (7m): HERI Shooting [1, 0]; ANDREAS Shooting [0, 1]; SIFA Point [0]; BAGAS Shooting [1]; ANDRI Point [1]; MUHLIS Shooting [0]
  pushThrows(12, 'p_heri', 'HERI', 'team_heri_cs', 'SHOOTING', 1, 1, '7m');
  pushThrows(12, 'p_andreas', 'ANDREAS', 'team_heri_cs', 'SHOOTING', 0, 1, '7m');
  pushThrows(12, 'p_sifa', 'SIFA', 'team_heri_cs', 'POINTING', 0, 1, '7m');
  pushThrows(12, 'p_bagas', 'BAGAS', 'team_bagas_cs', 'SHOOTING', 1, 0, '7m');
  pushThrows(12, 'p_andri', 'DHONI/ANDRI', 'team_bagas_cs', 'POINTING', 1, 0, '7m');
  pushThrows(12, 'p_muhlis', 'MUHLIS', 'team_bagas_cs', 'SHOOTING', 0, 1, '7m');

  // Jack 13 (8m): HERI Shooting [0, 0]; ANDREAS Point [1, 0]; SIFA Point [1, 1]; BAGAS Shooting [1, 1]; ANDRI Point [1]; MUHLIS Point [0]
  pushThrows(13, 'p_heri', 'HERI', 'team_heri_cs', 'SHOOTING', 0, 2, '8m');
  pushThrows(13, 'p_andreas', 'ANDREAS', 'team_heri_cs', 'POINTING', 1, 1, '8m');
  pushThrows(13, 'p_sifa', 'SIFA', 'team_heri_cs', 'POINTING', 2, 0, '8m');
  pushThrows(13, 'p_bagas', 'BAGAS', 'team_bagas_cs', 'SHOOTING', 2, 0, '8m');
  pushThrows(13, 'p_andri', 'DHONI/ANDRI', 'team_bagas_cs', 'POINTING', 1, 0, '8m');
  pushThrows(13, 'p_muhlis', 'MUHLIS', 'team_bagas_cs', 'POINTING', 0, 1, '8m');

  // Fill in remaining throws in Jacks 1-6 to achieve the exact target totals:
  // HERI target: Point 4/5 (current: 3/4 -> needs 1/1), Shooting 11/21 (current: 4/10 -> needs 7/11)
  pushThrows(1, 'p_heri', 'HERI', 'team_heri_cs', 'POINTING', 1, 0, '7.5m');
  pushThrows(2, 'p_heri', 'HERI', 'team_heri_cs', 'SHOOTING', 2, 1, '8m');
  pushThrows(3, 'p_heri', 'HERI', 'team_heri_cs', 'SHOOTING', 2, 1, '6.5m');
  pushThrows(4, 'p_heri', 'HERI', 'team_heri_cs', 'SHOOTING', 1, 2, '8.2m');
  pushThrows(5, 'p_heri', 'HERI', 'team_heri_cs', 'SHOOTING', 2, 1, '7m');

  // ANDREAS target: Point 12/14 (current: 8/10 -> needs 4/4), Shooting 6/12 (current: 0/3 -> needs 6/9)
  pushThrows(1, 'p_andreas', 'ANDREAS', 'team_heri_cs', 'POINTING', 2, 0, '7.5m');
  pushThrows(2, 'p_andreas', 'ANDREAS', 'team_heri_cs', 'POINTING', 2, 0, '8m');
  pushThrows(3, 'p_andreas', 'ANDREAS', 'team_heri_cs', 'SHOOTING', 2, 1, '6.5m');
  pushThrows(4, 'p_andreas', 'ANDREAS', 'team_heri_cs', 'SHOOTING', 2, 1, '8.2m');
  pushThrows(5, 'p_andreas', 'ANDREAS', 'team_heri_cs', 'SHOOTING', 2, 1, '7m');

  // SIFA target: Point 17/23 (current: 9/13 -> needs 8/10), Shooting 0/1 (current: 0/0 -> needs 0/1)
  pushThrows(1, 'p_sifa', 'SIFA', 'team_heri_cs', 'POINTING', 2, 0, '7.5m');
  pushThrows(2, 'p_sifa', 'SIFA', 'team_heri_cs', 'POINTING', 2, 0, '8m');
  pushThrows(3, 'p_sifa', 'SIFA', 'team_heri_cs', 'POINTING', 2, 0, '6.5m');
  pushThrows(4, 'p_sifa', 'SIFA', 'team_heri_cs', 'POINTING', 1, 1, '8.2m');
  pushThrows(5, 'p_sifa', 'SIFA', 'team_heri_cs', 'POINTING', 1, 1, '7m');
  pushThrows(6, 'p_sifa', 'SIFA', 'team_heri_cs', 'SHOOTING', 0, 1, '9m');

  // BAGAS target: Point 0/1 (current: 0/1 -> done!), Shooting 18/24 (current: 9/9 -> needs 9/15)
  pushThrows(1, 'p_bagas', 'BAGAS', 'team_bagas_cs', 'SHOOTING', 2, 1, '7.5m');
  pushThrows(2, 'p_bagas', 'BAGAS', 'team_bagas_cs', 'SHOOTING', 2, 1, '8m');
  pushThrows(3, 'p_bagas', 'BAGAS', 'team_bagas_cs', 'SHOOTING', 2, 1, '6.5m');
  pushThrows(4, 'p_bagas', 'BAGAS', 'team_bagas_cs', 'SHOOTING', 1, 2, '8.2m');
  pushThrows(5, 'p_bagas', 'BAGAS', 'team_bagas_cs', 'SHOOTING', 2, 1, '7m');

  // DHONI/ANDRI target: Point 10/15 (current: 5/7 -> needs 5/8), Shooting 6/9 (current: 2/2 -> needs 4/7)
  pushThrows(1, 'p_andri', 'DHONI/ANDRI', 'team_bagas_cs', 'POINTING', 1, 1, '7.5m');
  pushThrows(2, 'p_andri', 'DHONI/ANDRI', 'team_bagas_cs', 'POINTING', 2, 0, '8m');
  pushThrows(3, 'p_andri', 'DHONI/ANDRI', 'team_bagas_cs', 'POINTING', 1, 1, '6.5m');
  pushThrows(4, 'p_andri', 'DHONI/ANDRI', 'team_bagas_cs', 'POINTING', 1, 1, '8.2m');
  pushThrows(5, 'p_andri', 'DHONI/ANDRI', 'team_bagas_cs', 'SHOOTING', 2, 1, '7m');
  pushThrows(6, 'p_andri', 'DHONI/ANDRI', 'team_bagas_cs', 'SHOOTING', 2, 2, '9m');

  // MUHLIS target: Point 9/12 (current: 5/7 -> needs 4/5), Shooting 6/10 (current: 2/5 -> needs 4/5)
  pushThrows(1, 'p_muhlis', 'MUHLIS', 'team_bagas_cs', 'POINTING', 2, 0, '7.5m');
  pushThrows(2, 'p_muhlis', 'MUHLIS', 'team_bagas_cs', 'POINTING', 1, 0, '8m');
  pushThrows(3, 'p_muhlis', 'MUHLIS', 'team_bagas_cs', 'POINTING', 1, 1, '6.5m');
  pushThrows(4, 'p_muhlis', 'MUHLIS', 'team_bagas_cs', 'SHOOTING', 2, 0, '8.2m');
  pushThrows(5, 'p_muhlis', 'MUHLIS', 'team_bagas_cs', 'SHOOTING', 2, 1, '7m');

  return {
    id: matchId,
    name: 'GAMES 2 ; PERFORMA MIXED TRIPLE 26 OKTOBER 2025',
    date: '2025-10-26',
    location: 'Court 2 — Arena Petanque FOPI',
    status: 'FINISHED',
    targetScore: 13,
    teamA,
    teamB,
    scoreA: 10,
    scoreB: 13,
    currentEndNumber: 13,
    currentDistance: '8m',
    ends,
    actions,
    createdAt: 1730000000,
    updatedAt: 1730005000,
  };
}

/**
 * Dataset Tabel 1.1 Proposal Disertasi (Halaman 10):
 * "GAMES 2 ; PERFORMA TRIPLE MEN, SENIN 20 OKTOBER 2025"
 * Regu 1: BA (Point 2/2, Shoot 7/9), MUH (Point 3/4, Shoot 6/6), DH (Point 12/13, Shoot 0/0) -> Skor 13
 * Regu 2: AND (Point 3/8, Shoot 2/4), SIF (Point 7/12, Shoot 0/0), HE (Point 3/4, Shoot 6/9) -> Skor 1
 */
export function createTripleMenMatch(): Match {
  const matchId = 'match_triple_men_20okt';

  const teamA: Team = {
    id: 'team_bagas_men',
    name: 'REGU 1 (BAGAS, MUHLIS, DHONI)',
    countryCode: 'INA',
    color: '#002395',
    players: [
      { id: 'tm_ba', name: 'BA (Bagas)', teamId: 'team_bagas_men', role: 'SHOOTER', number: 7 },
      { id: 'tm_muh', name: 'MUH (Muhlis)', teamId: 'team_bagas_men', role: 'MILIEU', number: 9 },
      { id: 'tm_dh', name: 'DH (Dhoni)', teamId: 'team_bagas_men', role: 'POINTER', number: 1 },
    ],
  };

  const teamB: Team = {
    id: 'team_andreas_men',
    name: 'REGU 2 (ANDREAS, SIFA, HERI)',
    countryCode: 'INA',
    color: '#ED2939',
    players: [
      { id: 'tm_and', name: 'AND (Andreas)', teamId: 'team_andreas_men', role: 'MILIEU', number: 4 },
      { id: 'tm_sif', name: 'SIF (Sifa)', teamId: 'team_andreas_men', role: 'POINTER', number: 2 },
      { id: 'tm_he', name: 'HE (Heri)', teamId: 'team_andreas_men', role: 'SHOOTER', number: 8 },
    ],
  };

  const ends: EndRound[] = [
    { id: 'end_tm_1', matchId, endNumber: 1, distance: '7m', scoreA: 3, scoreB: 0, runningScoreA: 3, runningScoreB: 0, winnerTeamId: 'team_bagas_men', isCompleted: true },
    { id: 'end_tm_2', matchId, endNumber: 2, distance: '8m', scoreA: 2, scoreB: 0, runningScoreA: 5, runningScoreB: 0, winnerTeamId: 'team_bagas_men', isCompleted: true },
    { id: 'end_tm_3', matchId, endNumber: 3, distance: '7.5m', scoreA: 0, scoreB: 1, runningScoreA: 5, runningScoreB: 1, winnerTeamId: 'team_andreas_men', isCompleted: true },
    { id: 'end_tm_4', matchId, endNumber: 4, distance: '8.5m', scoreA: 4, scoreB: 0, runningScoreA: 9, runningScoreB: 1, winnerTeamId: 'team_bagas_men', isCompleted: true },
    { id: 'end_tm_5', matchId, endNumber: 5, distance: '9m', scoreA: 2, scoreB: 0, runningScoreA: 11, runningScoreB: 1, winnerTeamId: 'team_bagas_men', isCompleted: true },
    { id: 'end_tm_6', matchId, endNumber: 6, distance: '7m', scoreA: 2, scoreB: 0, runningScoreA: 13, runningScoreB: 1, winnerTeamId: 'team_bagas_men', isCompleted: true },
  ];

  const actions: ThrowAction[] = [];
  let actCounter = 1;

  const addActions = (
    endNum: number,
    pId: string,
    pName: string,
    tId: string,
    actType: 'POINTING' | 'SHOOTING',
    succ: number,
    fail: number,
    dist: string
  ) => {
    for (let i = 0; i < succ; i++) {
      actions.push({
        id: `a_t11_${actCounter++}`,
        matchId,
        endId: `end_tm_${endNum}`,
        endNumber: endNum,
        teamId: tId,
        playerId: pId,
        playerName: pName,
        actionType: actType,
        distance: dist,
        result: 'SUCCESS',
        scoreValue: 1,
        bouleNumber: 1,
        carreau: actType === 'SHOOTING' && Math.random() > 0.5,
        pointingTechnique: actType === 'POINTING' ? 'HALF_LOB' : undefined,
        shootingTechnique: actType === 'SHOOTING' ? 'IRON' : undefined,
        timestamp: 1729400000 + actCounter * 60,
      });
    }
    for (let i = 0; i < fail; i++) {
      actions.push({
        id: `a_t11_${actCounter++}`,
        matchId,
        endId: `end_tm_${endNum}`,
        endNumber: endNum,
        teamId: tId,
        playerId: pId,
        playerName: pName,
        actionType: actType,
        distance: dist,
        result: 'FAIL',
        scoreValue: 0,
        bouleNumber: 2,
        carreau: false,
        pointingTechnique: actType === 'POINTING' ? 'ROLLING' : undefined,
        shootingTechnique: actType === 'SHOOTING' ? 'SHORT_SHOT' : undefined,
        timestamp: 1729400000 + actCounter * 60,
      });
    }
  };

  // Populate to match exact counts in Table 1.1:
  // BA: Point 2/2, Shooting 7/9
  addActions(1, 'tm_ba', 'BA (Bagas)', 'team_bagas_men', 'POINTING', 2, 0, '7m');
  addActions(2, 'tm_ba', 'BA (Bagas)', 'team_bagas_men', 'SHOOTING', 2, 0, '8m');
  addActions(3, 'tm_ba', 'BA (Bagas)', 'team_bagas_men', 'SHOOTING', 1, 1, '7.5m');
  addActions(4, 'tm_ba', 'BA (Bagas)', 'team_bagas_men', 'SHOOTING', 2, 0, '8.5m');
  addActions(5, 'tm_ba', 'BA (Bagas)', 'team_bagas_men', 'SHOOTING', 1, 1, '9m');
  addActions(6, 'tm_ba', 'BA (Bagas)', 'team_bagas_men', 'SHOOTING', 1, 0, '7m');

  // MUH: Point 3/4, Shooting 6/6
  addActions(1, 'tm_muh', 'MUH (Muhlis)', 'team_bagas_men', 'POINTING', 1, 1, '7m');
  addActions(2, 'tm_muh', 'MUH (Muhlis)', 'team_bagas_men', 'POINTING', 1, 0, '8m');
  addActions(3, 'tm_muh', 'MUH (Muhlis)', 'team_bagas_men', 'POINTING', 1, 0, '7.5m');
  addActions(4, 'tm_muh', 'MUH (Muhlis)', 'team_bagas_men', 'SHOOTING', 2, 0, '8.5m');
  addActions(5, 'tm_muh', 'MUH (Muhlis)', 'team_bagas_men', 'SHOOTING', 2, 0, '9m');
  addActions(6, 'tm_muh', 'MUH (Muhlis)', 'team_bagas_men', 'SHOOTING', 2, 0, '7m');

  // DH: Point 12/13, Shooting 0/0
  addActions(1, 'tm_dh', 'DH (Dhoni)', 'team_bagas_men', 'POINTING', 2, 0, '7m');
  addActions(2, 'tm_dh', 'DH (Dhoni)', 'team_bagas_men', 'POINTING', 2, 0, '8m');
  addActions(3, 'tm_dh', 'DH (Dhoni)', 'team_bagas_men', 'POINTING', 2, 1, '7.5m');
  addActions(4, 'tm_dh', 'DH (Dhoni)', 'team_bagas_men', 'POINTING', 2, 0, '8.5m');
  addActions(5, 'tm_dh', 'DH (Dhoni)', 'team_bagas_men', 'POINTING', 2, 0, '9m');
  addActions(6, 'tm_dh', 'DH (Dhoni)', 'team_bagas_men', 'POINTING', 2, 0, '7m');

  // AND: Point 3/8, Shooting 2/4
  addActions(1, 'tm_and', 'AND (Andreas)', 'team_andreas_men', 'POINTING', 1, 1, '7m');
  addActions(2, 'tm_and', 'AND (Andreas)', 'team_andreas_men', 'POINTING', 1, 1, '8m');
  addActions(3, 'tm_and', 'AND (Andreas)', 'team_andreas_men', 'POINTING', 1, 1, '7.5m');
  addActions(4, 'tm_and', 'AND (Andreas)', 'team_andreas_men', 'POINTING', 0, 2, '8.5m');
  addActions(5, 'tm_and', 'AND (Andreas)', 'team_andreas_men', 'SHOOTING', 1, 1, '9m');
  addActions(6, 'tm_and', 'AND (Andreas)', 'team_andreas_men', 'SHOOTING', 1, 1, '7m');

  // SIF: Point 7/12, Shooting 0/0
  addActions(1, 'tm_sif', 'SIF (Sifa)', 'team_andreas_men', 'POINTING', 1, 1, '7m');
  addActions(2, 'tm_sif', 'SIF (Sifa)', 'team_andreas_men', 'POINTING', 1, 1, '8m');
  addActions(3, 'tm_sif', 'SIF (Sifa)', 'team_andreas_men', 'POINTING', 2, 0, '7.5m');
  addActions(4, 'tm_sif', 'SIF (Sifa)', 'team_andreas_men', 'POINTING', 1, 1, '8.5m');
  addActions(5, 'tm_sif', 'SIF (Sifa)', 'team_andreas_men', 'POINTING', 1, 1, '9m');
  addActions(6, 'tm_sif', 'SIF (Sifa)', 'team_andreas_men', 'POINTING', 1, 1, '7m');

  // HE: Point 3/4, Shooting 6/9
  addActions(1, 'tm_he', 'HE (Heri)', 'team_andreas_men', 'POINTING', 1, 1, '7m');
  addActions(2, 'tm_he', 'HE (Heri)', 'team_andreas_men', 'POINTING', 2, 0, '8m');
  addActions(3, 'tm_he', 'HE (Heri)', 'team_andreas_men', 'SHOOTING', 2, 0, '7.5m');
  addActions(4, 'tm_he', 'HE (Heri)', 'team_andreas_men', 'SHOOTING', 1, 1, '8.5m');
  addActions(5, 'tm_he', 'HE (Heri)', 'team_andreas_men', 'SHOOTING', 2, 1, '9m');
  addActions(6, 'tm_he', 'HE (Heri)', 'team_andreas_men', 'SHOOTING', 1, 1, '7m');

  return {
    id: matchId,
    name: 'GAMES 2 ; PERFORMA TRIPLE MEN, SENIN 20 OKTOBER 2025',
    date: '2025-10-20',
    location: 'Court 1 — Lapangan Latihan Atlet Petanque',
    category: 'TRIPLE_MEN',
    status: 'FINISHED',
    targetScore: 13,
    teamA,
    teamB,
    scoreA: 13,
    scoreB: 1,
    currentEndNumber: 6,
    currentDistance: '7m',
    ends,
    actions,
    createdAt: 1729400000,
    updatedAt: 1729405000,
  };
}

/**
 * Returns all default matches available in the RASTA Petanque platform:
 * 1. GAMES 2 ; PERFORMA TRIPLE MEN, 20 OKTOBER 2025 (Tabel 1.1 Disertasi Dr. Rasyono)
 * 2. GAMES 2 ; PERFORMA MIXED TRIPLE, 26 OKTOBER 2025
 * 3. SEA Games 2025 Final — Men Triples (Live Match Demo)
 */
export function getDefaultMatches(): Match[] {
  return [
    createTripleMenMatch(),
    createMixedTripleMatch(),
    createDemoMatch(),
  ];
}
