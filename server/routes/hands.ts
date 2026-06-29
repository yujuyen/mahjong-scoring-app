import { Router, Request, Response } from 'express';
import { query, run, get } from '../database';
import { analyzeHand } from '../services/scoringEngine';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = Router();

// Upload directory (ephemeral in production - for demo purposes only)
// For production, consider using cloud storage like Cloudinary or S3
const uploadsDir = 'uploads';

// Ensure uploads directory exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'hand-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

interface Hand {
  id: number;
  session_id: number;
  winner_id: number;
  loser_id: number | null;
  hand_type: string;
  fan_count: number;
  base_points: number;
  total_points: number;
  image_path: string | null;
  notes: string | null;
  created_at: string;
}

// Submit a new hand
router.post('/', upload.single('image'), async (req: Request, res: Response) => {
  try {
    const { sessionId, winnerId, loserId, handDescription, isSelfDrawn, isDealer, fanCount } = req.body;

    if (!sessionId || !winnerId) {
      return res.status(400).json({ error: 'Session ID and winner ID required' });
    }

    let analysis;
    if (fanCount !== undefined) {
      // Manual fan count entry
      analysis = {
        handType: handDescription || 'Custom Hand',
        fanCount: parseInt(fanCount),
        basePoints: 0,
        totalPoints: 0,
        description: ''
      };
      const isSelf = isSelfDrawn === 'true' || isSelfDrawn === true;
      const isD = isDealer === 'true' || isDealer === true;

      const scoringEngine = await import('../services/scoringEngine');
      const scoreCalc = scoringEngine.calculateTotalScore(analysis.fanCount, isSelf, isD);
      analysis.totalPoints = scoreCalc.winner;
      analysis.basePoints = scoringEngine.calculatePoints(analysis.fanCount);
    } else {
      // Auto-calculate from hand description
      analysis = analyzeHand(
        handDescription || '',
        isSelfDrawn === 'true' || isSelfDrawn === true,
        isDealer === 'true' || isDealer === true
      );
    }

    const imagePath = req.file ? req.file.path : null;

    const result = await run(
      `INSERT INTO hands (session_id, winner_id, loser_id, hand_type, fan_count, base_points, total_points, image_path, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
      [
        sessionId,
        winnerId,
        loserId || null,
        analysis.handType,
        analysis.fanCount,
        analysis.basePoints,
        analysis.totalPoints,
        imagePath,
        handDescription
      ]
    );

    // Update scores for all players
    // Winner gets the total points (base for discard, base × 1.5 for self-drawn)
    await run(
      'UPDATE scores SET total_score = total_score + $1 WHERE session_id = $2 AND player_id = $3',
      [analysis.totalPoints, sessionId, winnerId]
    );

    const basePoints = analysis.basePoints;

    if (isSelfDrawn === 'true' || isSelfDrawn === true) {
      // Self-drawn: base × 1.5 total, divided by 3 losers
      // Each pays: (base × 1.5) / 3 = base × 0.5
      const totalPoints = Math.round(basePoints * 1.5);
      const eachPays = Math.round(totalPoints / 3);

      // Deduct from all players except winner
      await run(
        'UPDATE scores SET total_score = total_score - $1 WHERE session_id = $2 AND player_id != $3',
        [eachPays, sessionId, winnerId]
      );
    } else if (loserId) {
      // Win from discard: Discarder pays 1/2, others pay 1/4 each
      const discarderPays = Math.round(basePoints / 2);
      const othersPay = Math.round(basePoints / 4);

      // Discarder pays half
      await run(
        'UPDATE scores SET total_score = total_score - $1 WHERE session_id = $2 AND player_id = $3',
        [discarderPays, sessionId, loserId]
      );

      // Other 2 players (not winner, not discarder) pay quarter each
      await run(
        'UPDATE scores SET total_score = total_score - $1 WHERE session_id = $2 AND player_id != $3 AND player_id != $4',
        [othersPay, sessionId, winnerId, loserId]
      );
    }

    res.json({
      handId: result.lastID,
      analysis,
      message: 'Hand recorded successfully'
    });
  } catch (error) {
    console.error('Error recording hand:', error);
    res.status(500).json({ error: 'Failed to record hand' });
  }
});

// Get all hands for a session
router.get('/session/:sessionId', async (req: Request, res: Response) => {
  try {
    const hands = await query<Hand>(`
      SELECT h.*,
             w.name as winner_name,
             l.name as loser_name
      FROM hands h
      JOIN players w ON h.winner_id = w.id
      LEFT JOIN players l ON h.loser_id = l.id
      WHERE h.session_id = $1
      ORDER BY h.created_at DESC
    `, [req.params.sessionId]);

    res.json(hands);
  } catch (error) {
    console.error('Error fetching hands:', error);
    res.status(500).json({ error: 'Failed to fetch hands' });
  }
});

// Get hand by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const hand = await get<Hand>('SELECT * FROM hands WHERE id = $1', [req.params.id]);
    if (!hand) {
      return res.status(404).json({ error: 'Hand not found' });
    }
    res.json(hand);
  } catch (error) {
    console.error('Error fetching hand:', error);
    res.status(500).json({ error: 'Failed to fetch hand' });
  }
});

// Delete a hand
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const handId = req.params.id;

    // Get the hand details before deletion to reverse score updates
    const hand = await get<Hand>('SELECT * FROM hands WHERE id = $1', [handId]);

    if (!hand) {
      return res.status(404).json({ error: 'Hand not found' });
    }

    // Reverse the score changes
    const basePoints = hand.base_points;
    const winnerId = hand.winner_id;
    const loserId = hand.loser_id;
    const totalPoints = hand.total_points;
    const sessionId = hand.session_id;

    // Deduct winner's score
    await run(
      'UPDATE scores SET total_score = total_score - $1 WHERE session_id = $2 AND player_id = $3',
      [totalPoints, sessionId, winnerId]
    );

    // Reverse loser payments
    if (!loserId) {
      // Self-drawn: refund all other players
      const eachPays = Math.round(Math.round(basePoints * 1.5) / 3);
      await run(
        'UPDATE scores SET total_score = total_score + $1 WHERE session_id = $2 AND player_id != $3',
        [eachPays, sessionId, winnerId]
      );
    } else {
      // Win from discard: refund discarder and others
      const discarderPays = Math.round(basePoints / 2);
      const othersPay = Math.round(basePoints / 4);

      await run(
        'UPDATE scores SET total_score = total_score + $1 WHERE session_id = $2 AND player_id = $3',
        [discarderPays, sessionId, loserId]
      );

      await run(
        'UPDATE scores SET total_score = total_score + $1 WHERE session_id = $2 AND player_id != $3 AND player_id != $4',
        [othersPay, sessionId, winnerId, loserId]
      );
    }

    // Delete the hand record
    await run('DELETE FROM hands WHERE id = $1', [handId]);

    res.json({ message: 'Hand deleted successfully' });
  } catch (error) {
    console.error('Error deleting hand:', error);
    res.status(500).json({ error: 'Failed to delete hand' });
  }
});

// Update a hand
router.put('/:id', upload.single('image'), async (req: Request, res: Response) => {
  try {
    const handId = req.params.id;
    const { winnerId, loserId, handDescription, isSelfDrawn, isDealer, fanCount } = req.body;

    // Get the existing hand
    const existingHand = await get<Hand>('SELECT * FROM hands WHERE id = $1', [handId]);

    if (!existingHand) {
      return res.status(404).json({ error: 'Hand not found' });
    }

    const sessionId = existingHand.session_id;

    // First, reverse the old score changes
    const oldBasePoints = existingHand.base_points;
    const oldWinnerId = existingHand.winner_id;
    const oldLoserId = existingHand.loser_id;
    const oldTotalPoints = existingHand.total_points;

    // Deduct old winner's score
    await run(
      'UPDATE scores SET total_score = total_score - $1 WHERE session_id = $2 AND player_id = $3',
      [oldTotalPoints, sessionId, oldWinnerId]
    );

    // Reverse old loser payments
    if (!oldLoserId) {
      const eachPays = Math.round(Math.round(oldBasePoints * 1.5) / 3);
      await run(
        'UPDATE scores SET total_score = total_score + $1 WHERE session_id = $2 AND player_id != $3',
        [eachPays, sessionId, oldWinnerId]
      );
    } else {
      const discarderPays = Math.round(oldBasePoints / 2);
      const othersPay = Math.round(oldBasePoints / 4);

      await run(
        'UPDATE scores SET total_score = total_score + $1 WHERE session_id = $2 AND player_id = $3',
        [discarderPays, sessionId, oldLoserId]
      );

      await run(
        'UPDATE scores SET total_score = total_score + $1 WHERE session_id = $2 AND player_id != $3 AND player_id != $4',
        [othersPay, sessionId, oldWinnerId, oldLoserId]
      );
    }

    // Calculate new scores
    let analysis;
    if (fanCount !== undefined) {
      analysis = {
        handType: handDescription || 'Custom Hand',
        fanCount: parseInt(fanCount),
        basePoints: 0,
        totalPoints: 0,
        description: ''
      };
      const isSelf = isSelfDrawn === 'true' || isSelfDrawn === true;
      const isD = isDealer === 'true' || isDealer === true;

      const scoringEngine = await import('../services/scoringEngine');
      const scoreCalc = scoringEngine.calculateTotalScore(analysis.fanCount, isSelf, isD);
      analysis.totalPoints = scoreCalc.winner;
      analysis.basePoints = scoringEngine.calculatePoints(analysis.fanCount);
    } else {
      analysis = analyzeHand(
        handDescription || '',
        isSelfDrawn === 'true' || isSelfDrawn === true,
        isDealer === 'true' || isDealer === true
      );
    }

    const imagePath = req.file ? req.file.path : existingHand.image_path;

    // Update the hand record
    await run(
      `UPDATE hands
       SET winner_id = $1, loser_id = $2, hand_type = $3, fan_count = $4,
           base_points = $5, total_points = $6, image_path = $7, notes = $8
       WHERE id = $9`,
      [
        winnerId || oldWinnerId,
        loserId || null,
        analysis.handType,
        analysis.fanCount,
        analysis.basePoints,
        analysis.totalPoints,
        imagePath,
        handDescription,
        handId
      ]
    );

    // Apply new score changes
    const newWinnerId = winnerId || oldWinnerId;
    const newBasePoints = analysis.basePoints;
    const newTotalPoints = analysis.totalPoints;

    // Add winner's score
    await run(
      'UPDATE scores SET total_score = total_score + $1 WHERE session_id = $2 AND player_id = $3',
      [newTotalPoints, sessionId, newWinnerId]
    );

    // Apply new loser payments
    if (isSelfDrawn === 'true' || isSelfDrawn === true) {
      const totalPoints = Math.round(newBasePoints * 1.5);
      const eachPays = Math.round(totalPoints / 3);
      await run(
        'UPDATE scores SET total_score = total_score - $1 WHERE session_id = $2 AND player_id != $3',
        [eachPays, sessionId, newWinnerId]
      );
    } else if (loserId) {
      const discarderPays = Math.round(newBasePoints / 2);
      const othersPay = Math.round(newBasePoints / 4);

      await run(
        'UPDATE scores SET total_score = total_score - $1 WHERE session_id = $2 AND player_id = $3',
        [discarderPays, sessionId, loserId]
      );

      await run(
        'UPDATE scores SET total_score = total_score - $1 WHERE session_id = $2 AND player_id != $3 AND player_id != $4',
        [othersPay, sessionId, newWinnerId, loserId]
      );
    }

    res.json({
      handId,
      analysis,
      message: 'Hand updated successfully'
    });
  } catch (error) {
    console.error('Error updating hand:', error);
    res.status(500).json({ error: 'Failed to update hand' });
  }
});

export default router;
