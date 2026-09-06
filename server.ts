import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { createDemoMatch, createMixedTripleMatch, createTripleMenMatch } from './src/lib/demoData.ts';
import { Match, ThrowAction, EndRound } from './src/types.ts';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // In-memory persistent state for RASTA Petanque (Includes Tabel 1.1 Proposal Disertasi)
  let matches: Match[] = [createTripleMenMatch(), createMixedTripleMatch(), createDemoMatch()];
  let sseClients: express.Response[] = [];

  // Helper to broadcast SSE event to all connected dashboards and scorers
  function broadcast(eventType: string, data: unknown) {
    const payload = `event: ${eventType}\ndata: ${JSON.stringify(data)}\n\n`;
    sseClients.forEach((client) => {
      try {
        client.write(payload);
      } catch {
        // Handled below on close
      }
    });
  }

  // --- Realtime SSE Stream ---
  app.get('/api/events', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders?.();

    // Send initial ping
    res.write(`event: connected\ndata: ${JSON.stringify({ message: 'Connected to RASTA Realtime' })}\n\n`);
    sseClients.push(res);

    req.on('close', () => {
      sseClients = sseClients.filter((c) => c !== res);
    });
  });

  // --- REST API Endpoints ---
  app.get('/api/matches', (_req, res) => {
    res.json(matches);
  });

  app.get('/api/matches/:id', (req, res) => {
    const match = matches.find((m) => m.id === req.params.id);
    if (!match) {
      return res.status(404).json({ error: 'Match not found' });
    }
    res.json(match);
  });

  // Create Match
  app.post('/api/matches', (req, res) => {
    const body = req.body;
    const initialEnd: EndRound = {
      id: `end_${Date.now()}_1`,
      matchId: body.id || `match_${Date.now()}`,
      endNumber: 1,
      distance: body.initialDistance || '7m',
      scoreA: 0,
      scoreB: 0,
      winnerTeamId: null,
      isCompleted: false,
    };

    const newMatch: Match = {
      id: body.id || `match_${Date.now()}`,
      name: body.name || 'New Petanque Match',
      date: body.date || new Date().toISOString().split('T')[0],
      location: body.location || 'Petanque Court',
      status: 'LIVE',
      targetScore: body.targetScore || 13,
      teamA: body.teamA,
      teamB: body.teamB,
      scoreA: 0,
      scoreB: 0,
      currentEndNumber: 1,
      currentDistance: body.initialDistance || '7m',
      ends: [initialEnd],
      actions: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    matches.unshift(newMatch);
    broadcast('match_created', newMatch);
    res.status(201).json(newMatch);
  });

  // Record a throw action
  app.post('/api/matches/:id/actions', (req, res) => {
    const match = matches.find((m) => m.id === req.params.id);
    if (!match) {
      return res.status(404).json({ error: 'Match not found' });
    }

    const newAction: ThrowAction = {
      id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      matchId: match.id,
      endId: req.body.endId || match.ends[match.ends.length - 1]?.id || 'end_1',
      endNumber: req.body.endNumber ?? match.currentEndNumber,
      teamId: req.body.teamId,
      playerId: req.body.playerId,
      playerName: req.body.playerName,
      actionType: req.body.actionType,
      distance: req.body.distance,
      result: req.body.result,
      carreau: req.body.carreau || false,
      distanceToJackCm: req.body.distanceToJackCm !== undefined ? Number(req.body.distanceToJackCm) : undefined,
      timestamp: Date.now(),
    };

    match.actions.push(newAction);
    match.updatedAt = Date.now();

    // If currentDistance updated
    if (req.body.distance) {
      match.currentDistance = req.body.distance;
    }

    broadcast('action_recorded', { matchId: match.id, action: newAction, match });
    res.status(201).json({ action: newAction, match });
  });

  // Delete / undo last throw action
  app.delete('/api/matches/:id/actions/:actionId', (req, res) => {
    const match = matches.find((m) => m.id === req.params.id);
    if (!match) {
      return res.status(404).json({ error: 'Match not found' });
    }

    const idx = match.actions.findIndex((a) => a.id === req.params.actionId);
    if (idx === -1) {
      return res.status(404).json({ error: 'Action not found' });
    }

    const removed = match.actions.splice(idx, 1)[0];
    match.updatedAt = Date.now();

    broadcast('action_deleted', { matchId: match.id, actionId: req.params.actionId, match });
    res.json({ success: true, removed, match });
  });

  // Update End score and proceed to next End
  app.post('/api/matches/:id/ends/complete', (req, res) => {
    const match = matches.find((m) => m.id === req.params.id);
    if (!match) {
      return res.status(404).json({ error: 'Match not found' });
    }

    const { endNumber, scoreA, scoreB, nextDistance } = req.body;
    const currentEnd = match.ends.find((e) => e.endNumber === endNumber);
    if (currentEnd) {
      currentEnd.scoreA = Number(scoreA || 0);
      currentEnd.scoreB = Number(scoreB || 0);
      currentEnd.isCompleted = true;
      if (currentEnd.scoreA > currentEnd.scoreB) {
        currentEnd.winnerTeamId = match.teamA.id;
      } else if (currentEnd.scoreB > currentEnd.scoreA) {
        currentEnd.winnerTeamId = match.teamB.id;
      }
    }

    // Recompute total match scores
    match.scoreA = match.ends.reduce((acc, e) => acc + (e.scoreA || 0), 0);
    match.scoreB = match.ends.reduce((acc, e) => acc + (e.scoreB || 0), 0);

    // Check if match won
    if (match.scoreA >= match.targetScore || match.scoreB >= match.targetScore) {
      match.status = 'FINISHED';
    } else {
      // Create new End
      const nextEndNum = match.ends.length + 1;
      const nextDist = nextDistance || match.currentDistance || '8m';
      match.currentEndNumber = nextEndNum;
      match.currentDistance = nextDist;
      match.ends.push({
        id: `end_${Date.now()}_${nextEndNum}`,
        matchId: match.id,
        endNumber: nextEndNum,
        distance: nextDist,
        scoreA: 0,
        scoreB: 0,
        winnerTeamId: null,
        isCompleted: false,
      });
    }

    match.updatedAt = Date.now();
    broadcast('end_completed', { matchId: match.id, match });
    res.json(match);
  });

  // Finish match manually
  app.post('/api/matches/:id/finish', (req, res) => {
    const match = matches.find((m) => m.id === req.params.id);
    if (!match) {
      return res.status(404).json({ error: 'Match not found' });
    }
    match.status = 'FINISHED';
    match.updatedAt = Date.now();
    broadcast('match_finished', { matchId: match.id, match });
    res.json(match);
  });

  // Reset to Demo Data
  app.post('/api/reset-demo', (_req, res) => {
    matches = [createTripleMenMatch(), createMixedTripleMatch(), createDemoMatch()];
    broadcast('demo_reset', matches[0]);
    res.json(matches[0]);
  });

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', time: Date.now() });
  });

  // Vite middleware for development vs static serve for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`RASTA Petanque server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
