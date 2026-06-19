-- Reset all scores for session 33 to zero
UPDATE scores SET total_score = 0 WHERE session_id = 33;

-- Now recalculate based on the 12 remaining hands
-- Player IDs: SMK=129, Liz=130, Yuju=131, Christy=132

-- Hand 82: SMK self-drawn, 5 fan, base=32, total=48
-- Winner gets 48, each of 3 losers pays 16
UPDATE scores SET total_score = total_score + 48 WHERE session_id = 33 AND player_id = 129;
UPDATE scores SET total_score = total_score - 16 WHERE session_id = 33 AND player_id IN (130, 131, 132);

-- Hand 83: SMK wins from Yuju, 8 fan, base=256, total=256
-- Winner gets 256, Yuju pays 128, others pay 64 each
UPDATE scores SET total_score = total_score + 256 WHERE session_id = 33 AND player_id = 129;
UPDATE scores SET total_score = total_score - 128 WHERE session_id = 33 AND player_id = 131;
UPDATE scores SET total_score = total_score - 64 WHERE session_id = 33 AND player_id IN (130, 132);

-- Hand 84: SMK wins from Yuju, 5 fan, base=32, total=32
-- Winner gets 32, Yuju pays 16, others pay 8 each
UPDATE scores SET total_score = total_score + 32 WHERE session_id = 33 AND player_id = 129;
UPDATE scores SET total_score = total_score - 16 WHERE session_id = 33 AND player_id = 131;
UPDATE scores SET total_score = total_score - 8 WHERE session_id = 33 AND player_id IN (130, 132);

-- Hand 85: Yuju wins from Liz, 1 fan, base=2, total=2
-- Winner gets 2, Liz pays 1, others pay 0.5 each (rounds to 1 and 0)
UPDATE scores SET total_score = total_score + 2 WHERE session_id = 33 AND player_id = 131;
UPDATE scores SET total_score = total_score - 1 WHERE session_id = 33 AND player_id = 130;
UPDATE scores SET total_score = total_score - 1 WHERE session_id = 33 AND player_id = 129;
UPDATE scores SET total_score = total_score - 0 WHERE session_id = 33 AND player_id = 132;

-- Hand 86: SMK self-drawn, 3 fan, base=8, total=12
-- Winner gets 12, each of 3 losers pays 4
UPDATE scores SET total_score = total_score + 12 WHERE session_id = 33 AND player_id = 129;
UPDATE scores SET total_score = total_score - 4 WHERE session_id = 33 AND player_id IN (130, 131, 132);

-- Hand 87: Christy self-drawn, 2 fan, base=4, total=6
-- Winner gets 6, each of 3 losers pays 2
UPDATE scores SET total_score = total_score + 6 WHERE session_id = 33 AND player_id = 132;
UPDATE scores SET total_score = total_score - 2 WHERE session_id = 33 AND player_id IN (129, 130, 131);

-- Hand 88: Yuju self-drawn, 5 fan, base=32, total=48
-- Winner gets 48, each of 3 losers pays 16
UPDATE scores SET total_score = total_score + 48 WHERE session_id = 33 AND player_id = 131;
UPDATE scores SET total_score = total_score - 16 WHERE session_id = 33 AND player_id IN (129, 130, 132);

-- Hand 89: SMK wins from Liz, 2 fan, base=4, total=4
-- Winner gets 4, Liz pays 2, others pay 1 each
UPDATE scores SET total_score = total_score + 4 WHERE session_id = 33 AND player_id = 129;
UPDATE scores SET total_score = total_score - 2 WHERE session_id = 33 AND player_id = 130;
UPDATE scores SET total_score = total_score - 1 WHERE session_id = 33 AND player_id IN (131, 132);

-- Hand 90: Liz wins from Christy, 3 fan, base=8, total=8
-- Winner gets 8, Christy pays 4, others pay 2 each
UPDATE scores SET total_score = total_score + 8 WHERE session_id = 33 AND player_id = 130;
UPDATE scores SET total_score = total_score - 4 WHERE session_id = 33 AND player_id = 132;
UPDATE scores SET total_score = total_score - 2 WHERE session_id = 33 AND player_id IN (129, 131);

-- Hand 91: Yuju wins from Liz, 5 fan, base=32, total=32
-- Winner gets 32, Liz pays 16, others pay 8 each
UPDATE scores SET total_score = total_score + 32 WHERE session_id = 33 AND player_id = 131;
UPDATE scores SET total_score = total_score - 16 WHERE session_id = 33 AND player_id = 130;
UPDATE scores SET total_score = total_score - 8 WHERE session_id = 33 AND player_id IN (129, 132);

-- Hand 92: SMK wins from Christy, 5 fan, base=32, total=32
-- Winner gets 32, Christy pays 16, others pay 8 each
UPDATE scores SET total_score = total_score + 32 WHERE session_id = 33 AND player_id = 129;
UPDATE scores SET total_score = total_score - 16 WHERE session_id = 33 AND player_id = 132;
UPDATE scores SET total_score = total_score - 8 WHERE session_id = 33 AND player_id IN (130, 131);

-- Hand 93: Liz wins from SMK, 5 fan, base=32, total=32
-- Winner gets 32, SMK pays 16, others pay 8 each
UPDATE scores SET total_score = total_score + 32 WHERE session_id = 33 AND player_id = 130;
UPDATE scores SET total_score = total_score - 16 WHERE session_id = 33 AND player_id = 129;
UPDATE scores SET total_score = total_score - 8 WHERE session_id = 33 AND player_id IN (131, 132);
