import { Router, Request, Response } from 'express';
import { query, run, get } from '../database';

const router = Router();

interface Session {
  id: number;
  name: string;
  created_at: string;
  status: string;
}

interface Player {
  id: number;
  session_id: number;
  name: string;
}

// Create new session
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, players } = req.body;

    if (!name || !players || !Array.isArray(players) || players.length < 2) {
      return res.status(400).json({ error: 'Session name and at least 2 players required' });
    }

    const result = await run('INSERT INTO sessions (name) VALUES ($1) RETURNING id', [name]);
    const sessionId = result.lastID;

    for (const playerName of players) {
      const playerResult = await run('INSERT INTO players (session_id, name) VALUES ($1, $2) RETURNING id', [sessionId, playerName]);
      const playerId = playerResult.lastID;
      await run('INSERT INTO scores (session_id, player_id, total_score) VALUES ($1, $2, $3)',
        [sessionId, playerId, 0]);
    }

    res.json({ sessionId, message: 'Session created successfully' });
  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).json({ error: 'Failed to create session' });
  }
});

// Get all sessions
router.get('/', async (req: Request, res: Response) => {
  try {
    const sessions = await query<Session>('SELECT * FROM sessions ORDER BY created_at DESC');
    res.json(sessions);
  } catch (error) {
    console.error('Error fetching sessions:', error);
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

// Get session by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const session = await get<Session>('SELECT * FROM sessions WHERE id = $1', [req.params.id]);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const players = await query<Player>('SELECT * FROM players WHERE session_id = $1', [req.params.id]);

    res.json({ ...session, players });
  } catch (error) {
    console.error('Error fetching session:', error);
    res.status(500).json({ error: 'Failed to fetch session' });
  }
});

// End session
router.patch('/:id/complete', async (req: Request, res: Response) => {
  try {
    await run('UPDATE sessions SET status = $1 WHERE id = $2', ['completed', req.params.id]);
    res.json({ message: 'Session completed' });
  } catch (error) {
    console.error('Error completing session:', error);
    res.status(500).json({ error: 'Failed to complete session' });
  }
});

// Get leaderboard for session
router.get('/:id/leaderboard', async (req: Request, res: Response) => {
  try {
    const leaderboard = await query(`
      SELECT p.id, p.name, COALESCE(s.total_score, 0) as total_score
      FROM players p
      LEFT JOIN scores s ON p.id = s.player_id
      WHERE p.session_id = $1
      ORDER BY s.total_score DESC
    `, [req.params.id]);

    res.json(leaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

// Delete session
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    // Check if session exists
    const session = await get<Session>('SELECT * FROM sessions WHERE id = $1', [req.params.id]);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // PostgreSQL will cascade delete players, hands, and scores due to ON DELETE CASCADE
    await run('DELETE FROM sessions WHERE id = $1', [req.params.id]);

    res.json({ message: 'Session deleted successfully' });
  } catch (error) {
    console.error('Error deleting session:', error);
    res.status(500).json({ error: 'Failed to delete session' });
  }
});

export default router;
