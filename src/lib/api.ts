import { Match, ThrowAction, EndRound } from '../types';
import { createDemoMatch } from './demoData';

const LOCAL_STORAGE_KEY = 'rasta_petanque_active_match';

export async function fetchMatches(): Promise<Match[]> {
  try {
    const res = await fetch('/api/matches');
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (err) {
    console.warn('Backend fetch failed, using local demo match:', err);
  }
  const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
  return [cached ? JSON.parse(cached) : createDemoMatch()];
}

export async function fetchMatchById(id: string): Promise<Match> {
  try {
    const res = await fetch(`/api/matches/${id}`);
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (err) {
    console.warn('Backend fetch failed, using local match:', err);
  }
  const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
  return cached ? JSON.parse(cached) : createDemoMatch();
}

export async function createMatch(matchData: Partial<Match>): Promise<Match> {
  try {
    const res = await fetch('/api/matches', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(matchData),
    });
    if (res.ok) {
      const data = await res.json();
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
      return data;
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

  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newMatch));
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
      const data = await res.json();
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data.match));
      return data;
    }
  } catch (err) {
    console.warn('Backend action record failed, using local update:', err);
  }

  // Local fallback
  const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
  const match: Match = cached ? JSON.parse(cached) : createDemoMatch();
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
    carreau: actionData.carreau,
    distanceToJackCm: actionData.distanceToJackCm,
    timestamp: Date.now(),
  };
  match.actions.push(newAction);
  match.updatedAt = Date.now();
  if (actionData.distance) {
    match.currentDistance = actionData.distance;
  }
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(match));
  return { action: newAction, match };
}

export async function deleteAction(matchId: string, actionId: string): Promise<Match> {
  try {
    const res = await fetch(`/api/matches/${matchId}/actions/${actionId}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      const data = await res.json();
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data.match));
      return data.match;
    }
  } catch (err) {
    console.warn('Backend delete failed, fallback local:', err);
  }

  const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
  const match: Match = cached ? JSON.parse(cached) : createDemoMatch();
  match.actions = match.actions.filter((a) => a.id !== actionId);
  match.updatedAt = Date.now();
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(match));
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
      const match = await res.json();
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(match));
      return match;
    }
  } catch (err) {
    console.warn('Backend complete end failed, local fallback:', err);
  }

  const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
  const match: Match = cached ? JSON.parse(cached) : createDemoMatch();
  const end = match.ends.find((e) => e.endNumber === endNumber);
  if (end) {
    end.scoreA = scoreA;
    end.scoreB = scoreB;
    end.isCompleted = true;
    if (scoreA > scoreB) end.winnerTeamId = match.teamA.id;
    else if (scoreB > scoreA) end.winnerTeamId = match.teamB.id;
  }
  match.scoreA = match.ends.reduce((acc, e) => acc + (e.scoreA || 0), 0);
  match.scoreB = match.ends.reduce((acc, e) => acc + (e.scoreB || 0), 0);

  if (match.scoreA >= match.targetScore || match.scoreB >= match.targetScore) {
    match.status = 'FINISHED';
  } else {
    const nextNum = match.ends.length + 1;
    match.currentEndNumber = nextNum;
    match.currentDistance = nextDistance as any;
    match.ends.push({
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
  match.updatedAt = Date.now();
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(match));
  return match;
}

export async function finishMatch(matchId: string): Promise<Match> {
  try {
    const res = await fetch(`/api/matches/${matchId}/finish`, { method: 'POST' });
    if (res.ok) {
      const match = await res.json();
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(match));
      return match;
    }
  } catch (err) {
    console.warn('Finish match failed, local fallback:', err);
  }

  const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
  const match: Match = cached ? JSON.parse(cached) : createDemoMatch();
  match.status = 'FINISHED';
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(match));
  return match;
}

export async function resetDemo(): Promise<Match> {
  try {
    const res = await fetch('/api/reset-demo', { method: 'POST' });
    if (res.ok) {
      const match = await res.json();
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(match));
      return match;
    }
  } catch (err) {
    console.warn('Reset demo failed, generating client-side:', err);
  }
  const match = createDemoMatch();
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(match));
  return match;
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
