import { Match, ThrowAction, EndRound } from '../types';
import {
  getDefaultMatches,
  createDemoMatch,
  createTripleMenMatch,
  createMixedTripleMatch,
} from './demoData';

const ALL_MATCHES_STORAGE_KEY = 'rasta_petanque_all_matches_v2';
const ACTIVE_MATCH_ID_KEY = 'rasta_petanque_active_match_id_v2';
const LEGACY_STORAGE_KEY = 'rasta_petanque_active_match';

/**
 * Reads matches from localStorage.
 * Guarantees that the 3 canonical research & demo matches are always present:
 * 1. Tabel 1.1 Triple Men (20 Okt 2025)
 * 2. Mixed Triple (26 Okt 2025)
 * 3. SEA Games 2025 Final (Men Triples)
 */
export function getStoredMatches(): Match[] {
  const defaultMatches = getDefaultMatches();
  try {
    const raw = localStorage.getItem(ALL_MATCHES_STORAGE_KEY);
    let list: Match[] = [];
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        list = parsed;
      }
    }

    // Check legacy storage if present
    if (list.length === 0) {
      const legacyRaw = localStorage.getItem(LEGACY_STORAGE_KEY);
      if (legacyRaw) {
        try {
          const legacyMatch = JSON.parse(legacyRaw);
          if (legacyMatch && legacyMatch.id) {
            list.push(legacyMatch);
          }
        } catch {
          // ignore
        }
      }
    }

    // Always ensure all default research matches exist in the array
    const existingIds = new Set(list.map((m) => m.id));
    let updated = false;

    // Put default matches in standard order if not present
    for (const def of defaultMatches) {
      if (!existingIds.has(def.id)) {
        list.push(def);
        updated = true;
      }
    }

    if (updated || !raw) {
      localStorage.setItem(ALL_MATCHES_STORAGE_KEY, JSON.stringify(list));
    }

    return list;
  } catch (err) {
    console.warn('Error reading stored matches:', err);
    return defaultMatches;
  }
}

export function saveStoredMatches(matches: Match[]): void {
  try {
    localStorage.setItem(ALL_MATCHES_STORAGE_KEY, JSON.stringify(matches));
  } catch (err) {
    console.warn('Error saving stored matches:', err);
  }
}

export function getActiveMatchId(): string {
  try {
    const id = localStorage.getItem(ACTIVE_MATCH_ID_KEY);
    if (id) return id;
  } catch {
    // ignore
  }
  return 'match_triple_men_20okt';
}

export function setActiveMatchId(id: string): void {
  try {
    localStorage.setItem(ACTIVE_MATCH_ID_KEY, id);
  } catch {
    // ignore
  }
}

function updateMatchInStorage(updatedMatch: Match): void {
  const list = getStoredMatches();
  const index = list.findIndex((m) => m.id === updatedMatch.id);
  if (index >= 0) {
    list[index] = updatedMatch;
  } else {
    list.unshift(updatedMatch);
  }
  saveStoredMatches(list);
  setActiveMatchId(updatedMatch.id);
}

export async function fetchMatches(): Promise<Match[]> {
  try {
    const res = await fetch('/api/matches');
    if (res.ok) {
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          saveStoredMatches(data);
          return data;
        }
      }
    }
  } catch (err) {
    console.warn('Backend fetch failed, using local stored matches:', err);
  }
  return getStoredMatches();
}

export async function fetchMatchById(id: string): Promise<Match> {
  try {
    const res = await fetch(`/api/matches/${id}`);
    if (res.ok) {
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await res.json();
        return data;
      }
    }
  } catch (err) {
    console.warn('Backend fetch failed, using local match:', err);
  }
  const list = getStoredMatches();
  const match = list.find((m) => m.id === id);
  return match || list[0] || createTripleMenMatch();
}

export async function createMatch(matchData: Partial<Match>): Promise<Match> {
  try {
    const res = await fetch('/api/matches', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(matchData),
    });
    if (res.ok) {
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await res.json();
        updateMatchInStorage(data);
        return data;
      }
    }
  } catch (err) {
    console.warn('Backend create failed, saving locally:', err);
  }

  // Local fallback
  const initialEnd: EndRound = {
    id: `end_${Date.now()}_1`,
    matchId: `match_${Date.now()}`,
    endNumber: 1,
    distance: matchData.currentDistance || '7m',
    scoreA: 0,
    scoreB: 0,
    winnerTeamId: null,
    isCompleted: false,
  };

  const newMatch: Match = {
    id: `match_${Date.now()}`,
    name: matchData.name || 'Petanque Match',
    date: matchData.date || new Date().toISOString().split('T')[0],
    location: matchData.location || 'Court',
    status: 'LIVE',
    targetScore: matchData.targetScore || 13,
    teamA: matchData.teamA!,
    teamB: matchData.teamB!,
    scoreA: 0,
    scoreB: 0,
    currentEndNumber: 1,
    currentDistance: matchData.currentDistance || '7m',
    ends: [initialEnd],
    actions: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  updateMatchInStorage(newMatch);
  return newMatch;
}

export async function recordAction(
  matchId: string,
  actionData: Partial<ThrowAction>
): Promise<{ action: ThrowAction; match: Match }> {
  try {
    const res = await fetch(`/api/matches/${matchId}/actions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(actionData),
    });
    if (res.ok) {
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await res.json();
        updateMatchInStorage(data.match);
        return data;
      }
    }
  } catch (err) {
    console.warn('Backend action record failed, using local update:', err);
  }

  // Local fallback
  const list = getStoredMatches();
  let match = list.find((m) => m.id === matchId) || list[0] || createTripleMenMatch();

  const newAction: ThrowAction = {
    id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    matchId,
    endId: actionData.endId || match.ends[match.ends.length - 1]?.id || 'end_1',
    endNumber: actionData.endNumber ?? match.currentEndNumber,
    teamId: actionData.teamId!,
    playerId: actionData.playerId!,
    playerName: actionData.playerName!,
    actionType: actionData.actionType!,
    distance: actionData.distance!,
    result: actionData.result!,
    scoreValue: actionData.result === 'SUCCESS' ? 1 : 0,
    bouleNumber: actionData.bouleNumber || 1,
    carreau: actionData.carreau,
    distanceToJackCm: actionData.distanceToJackCm,
    pointingTechnique: actionData.pointingTechnique,
    shootingTechnique: actionData.shootingTechnique,
    timestamp: Date.now(),
  };

  match = {
    ...match,
    actions: [...match.actions, newAction],
    currentDistance: actionData.distance || match.currentDistance,
    updatedAt: Date.now(),
  };

  updateMatchInStorage(match);
  return { action: newAction, match };
}

export async function deleteAction(matchId: string, actionId: string): Promise<Match> {
  try {
    const res = await fetch(`/api/matches/${matchId}/actions/${actionId}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await res.json();
        updateMatchInStorage(data.match);
        return data.match;
      }
    }
  } catch (err) {
    console.warn('Backend delete failed, fallback local:', err);
  }

  const list = getStoredMatches();
  let match = list.find((m) => m.id === matchId) || list[0] || createTripleMenMatch();
  match = {
    ...match,
    actions: match.actions.filter((a) => a.id !== actionId),
    updatedAt: Date.now(),
  };
  updateMatchInStorage(match);
  return match;
}

export async function completeEnd(
  matchId: string,
  endNumber: number,
  scoreA: number,
  scoreB: number,
  nextDistance: string
): Promise<Match> {
  try {
    const res = await fetch(`/api/matches/${matchId}/ends/complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ endNumber, scoreA, scoreB, nextDistance }),
    });
    if (res.ok) {
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const match = await res.json();
        updateMatchInStorage(match);
        return match;
      }
    }
  } catch (err) {
    console.warn('Backend complete end failed, local fallback:', err);
  }

  const list = getStoredMatches();
  let match = list.find((m) => m.id === matchId) || list[0] || createTripleMenMatch();
  const updatedEnds = match.ends.map((e) => {
    if (e.endNumber === endNumber) {
      return {
        ...e,
        scoreA,
        scoreB,
        isCompleted: true,
        winnerTeamId: scoreA > scoreB ? match.teamA.id : scoreB > scoreA ? match.teamB.id : null,
      };
    }
    return e;
  });

  const totalScoreA = updatedEnds.reduce((acc, e) => acc + (e.scoreA || 0), 0);
  const totalScoreB = updatedEnds.reduce((acc, e) => acc + (e.scoreB || 0), 0);
  const isFinished = totalScoreA >= match.targetScore || totalScoreB >= match.targetScore;

  if (!isFinished && !updatedEnds.some((e) => e.endNumber === endNumber + 1)) {
    const nextNum = endNumber + 1;
    updatedEnds.push({
      id: `end_${Date.now()}_${nextNum}`,
      matchId: match.id,
      endNumber: nextNum,
      distance: nextDistance as any,
      scoreA: 0,
      scoreB: 0,
      winnerTeamId: null,
      isCompleted: false,
    });
  }

  match = {
    ...match,
    ends: updatedEnds,
    scoreA: totalScoreA,
    scoreB: totalScoreB,
    status: isFinished ? 'FINISHED' : match.status,
    currentEndNumber: isFinished ? match.currentEndNumber : endNumber + 1,
    currentDistance: nextDistance as any,
    updatedAt: Date.now(),
  };

  updateMatchInStorage(match);
  return match;
}

export async function finishMatch(matchId: string): Promise<Match> {
  try {
    const res = await fetch(`/api/matches/${matchId}/finish`, { method: 'POST' });
    if (res.ok) {
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const match = await res.json();
        updateMatchInStorage(match);
        return match;
      }
    }
  } catch (err) {
    console.warn('Finish match failed, local fallback:', err);
  }

  const list = getStoredMatches();
  let match = list.find((m) => m.id === matchId) || list[0] || createTripleMenMatch();
  match = {
    ...match,
    status: 'FINISHED',
    updatedAt: Date.now(),
  };
  updateMatchInStorage(match);
  return match;
}

/**
 * Restores all default research & demo matches:
 * 1. GAMES 2 ; PERFORMA TRIPLE MEN, 20 OKTOBER 2025 (Tabel 1.1)
 * 2. GAMES 2 ; PERFORMA MIXED TRIPLE, 26 OKTOBER 2025
 * 3. SEA Games 2025 Final — Men Triples
 */
export async function resetDemo(): Promise<Match> {
  try {
    const res = await fetch('/api/reset-demo', { method: 'POST' });
    if (res.ok) {
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const match = await res.json();
        return match;
      }
    }
  } catch (err) {
    console.warn('Reset demo failed, generating client-side:', err);
  }
  const defaultList = getDefaultMatches();
  saveStoredMatches(defaultList);
  setActiveMatchId(defaultList[0].id);
  return defaultList[0];
}

export function restoreAllDefaultMatches(): Match[] {
  const defaultList = getDefaultMatches();
  saveStoredMatches(defaultList);
  setActiveMatchId(defaultList[0].id);
  return defaultList;
}


/**
 * Connects to Server-Sent Events stream for instantaneous live synchronization
 */
export function subscribeToMatchUpdates(
  onUpdate: (event: string, data: any) => void
): () => void {
  let eventSource: EventSource | null = null;
  let isClosed = false;

  function connect() {
    if (isClosed) return;
    try {
      eventSource = new EventSource('/api/events');

      eventSource.addEventListener('action_recorded', (e) => {
        try {
          const payload = JSON.parse(e.data);
          onUpdate('action_recorded', payload);
        } catch {
          // ignore parse errors
        }
      });

      eventSource.addEventListener('action_deleted', (e) => {
        try {
          const payload = JSON.parse(e.data);
          onUpdate('action_deleted', payload);
        } catch {
          // ignore
        }
      });

      eventSource.addEventListener('end_completed', (e) => {
        try {
          const payload = JSON.parse(e.data);
          onUpdate('end_completed', payload);
        } catch {
          // ignore
        }
      });

      eventSource.addEventListener('match_finished', (e) => {
        try {
          const payload = JSON.parse(e.data);
          onUpdate('match_finished', payload);
        } catch {
          // ignore
        }
      });

      eventSource.addEventListener('demo_reset', (e) => {
        try {
          const payload = JSON.parse(e.data);
          onUpdate('demo_reset', payload);
        } catch {
          // ignore
        }
      });

      eventSource.onerror = () => {
        eventSource?.close();
        if (!isClosed) {
          setTimeout(connect, 3000);
        }
      };
    } catch (err) {
      console.warn('SSE not supported or connection error:', err);
    }
  }

  connect();

  return () => {
    isClosed = true;
    eventSource?.close();
  };
}
