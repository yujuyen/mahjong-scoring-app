-- Migration script to copy hands from dist database session 2 to root database session 33
-- Player ID mapping: dist -> root
-- 5 (SMK) -> 129
-- 6 (Liz) -> 130
-- 7 (Yuju) -> 131
-- 8 (Christy) -> 132

-- Insert hands from dist session 2 into root session 33
INSERT INTO hands (session_id, winner_id, loser_id, hand_type, fan_count, base_points, total_points, image_path, notes, created_at)
VALUES
  -- Hand 2: SMK self-drawn, 5 fan, 48 points at 01:57:00
  (33, 129, NULL, 'Custom Hand', 5, 32, 48, '', '', '2026-06-18T01:57:00.370Z'),

  -- Hand 3: SMK wins from Yuju, 8 fan, 256 points at 01:57:16
  (33, 129, 131, 'Custom Hand', 8, 256, 256, '', '', '2026-06-18T01:57:16.647Z'),

  -- Hand 4: SMK wins from Yuju, 5 fan, 32 points at 01:57:41
  (33, 129, 131, 'Custom Hand', 5, 32, 32, '', '', '2026-06-18T01:57:41.908Z'),

  -- Hand 5: Yuju wins from Liz, 1 fan, 2 points at 01:58:00
  (33, 131, 130, 'Custom Hand', 1, 2, 2, '', '', '2026-06-18T01:58:00.943Z'),

  -- Hand 6: SMK self-drawn, 3 fan, 12 points at 01:58:15
  (33, 129, NULL, 'Custom Hand', 3, 8, 12, '', '', '2026-06-18T01:58:15.269Z'),

  -- Hand 7: Christy self-drawn, 2 fan, 6 points at 01:58:32
  (33, 132, NULL, 'Custom Hand', 2, 4, 6, '', '', '2026-06-18T01:58:32.469Z'),

  -- Hand 8: Yuju self-drawn, 5 fan, 48 points at 02:12:37
  (33, 131, NULL, 'Custom Hand', 5, 32, 48, '', '', '2026-06-18T02:12:37.036Z'),

  -- Hand 9: SMK wins from Liz, 2 fan, 4 points at 02:26:49
  (33, 129, 130, 'Custom Hand', 2, 4, 4, '', '', '2026-06-18T02:26:49.201Z'),

  -- Hand 10: Liz wins from Christy, 3 fan, 8 points at 02:41:06
  (33, 130, 132, 'Custom Hand', 3, 8, 8, '', '', '2026-06-18T02:41:06.456Z'),

  -- Hand 11: Yuju wins from Liz, 5 fan, 32 points at 03:01:30
  (33, 131, 130, 'Custom Hand', 5, 32, 32, '', '', '2026-06-18T03:01:30.177Z'),

  -- Hand 12: SMK wins from Christy, 5 fan, 32 points at 03:21:40
  (33, 129, 132, 'Custom Hand', 5, 32, 32, '', '', '2026-06-18T03:21:40.708Z'),

  -- Hand 13: Liz wins from SMK, 5 fan, 32 points at 03:44:42
  (33, 130, 129, 'Custom Hand', 5, 32, 32, '', '', '2026-06-18T03:44:42.205Z');
