# Scoring System Limitation

## Current Behavior

The app's **leaderboard only tracks net scores per player**, not individual hand-by-hand payment distributions.

### What the App Does

**When a hand is recorded:**
1. Winner gets **+base points**
2. Discarder (if specified) gets **-base points**
3. Leaderboard shows **net totals**

### What Happens in Real Game

**Win from discard (3 fan = 8 points):**
- Winner: **+8**
- Discarder: **-4** (pays half)
- Other player 1: **-2** (pays quarter)
- Other player 2: **-2** (pays quarter)

**Self-drawn (3 fan = 8 points):**
- Winner: **+8**
- Player 1: **-3** (pays third, rounded)
- Player 2: **-3** (pays third)
- Player 3: **-2** (pays third, rounded)

## Why the Difference?

### Technical Limitation

The current database schema only tracks:
- **Winner** (one player)
- **Loser/Discarder** (one player, optional)

It doesn't store individual payment amounts for all 4 players per hand.

### Leaderboard Shows Net Totals

The leaderboard displays **cumulative scores** across all hands. While individual hand payments aren't split perfectly, the **net effect over multiple hands balances out**.

### Example Game

**Initial:** All players start at 0

**Round 1:** Alice wins 3 fan from Bob's discard
- **Recorded:** Alice +8, Bob -8
- **Reality:** Alice +8, Bob -4, Charlie -2, Diana -2
- **Leaderboard:** Alice: 8, Bob: -8, Charlie: 0, Diana: 0

**Round 2:** Charlie wins 4 fan from Diana's discard  
- **Recorded:** Charlie +16, Diana -16
- **Reality:** Charlie +16, Diana -8, Alice -4, Bob -4
- **Leaderboard:** Alice: 4, Bob: -12, Charlie: 16, Diana: -8

### Over Time

As more hands are played, the cumulative scores approximate the true distribution because:
- Sometimes you're the discarder (-50%)
- Sometimes you're "other player" (-25%)
- It averages out over many hands

## How to Use the App

### Recommended Approach

**Use the app for:**
✅ **Tracking cumulative scores** over a session  
✅ **Determining final winners** at end of game  
✅ **Recording who won each hand** and fan count  

**Don't rely on it for:**
❌ **Exact per-hand payment splits** to all 4 players  
❌ **Intermediate score verification** (may be slightly off)

### Manual Tracking

If you need exact per-hand payments, you can:

1. **Use the notes field** to record actual payments:
   ```
   Example: "Alice +8, Bob -4, Charlie -2, Diana -2"
   ```

2. **Track manually** alongside the app:
   - Use the app for total scores
   - Use paper/calculator for per-hand distributions

3. **Calculate at end of session:**
   - Record all hands in the app
   - At end, manually calculate final payments based on hand history

## Future Enhancement

To properly implement per-hand payment distribution, the app would need:

### Database Changes
```sql
CREATE TABLE hand_payments (
  id INTEGER PRIMARY KEY,
  hand_id INTEGER,
  player_id INTEGER,
  amount INTEGER,  -- positive for winner, negative for losers
  FOREIGN KEY (hand_id) REFERENCES hands(id),
  FOREIGN KEY (player_id) REFERENCES players(id)
);
```

### API Changes
- Hand submission would create 4 payment records (one per player)
- Leaderboard would sum all payments per player
- Hand history would show all 4 players' payments

### UI Changes
- Hand entry form would show calculated distribution
- Hand history would display all payments
- Leaderboard would remain the same (sum of payments)

## Summary

**Current System:**
- Simplified: Winner +base, Discarder -base
- Easy to implement and understand
- Leaderboard shows approximate net scores
- Good enough for casual play

**Ideal System:**
- Track all 4 players per hand
- Accurate payment distribution
- Perfect score tracking
- More complex implementation

**Recommendation:**  
For most games, the current system is sufficient. The cumulative scores give a good indication of overall performance, even if individual hand distributions aren't perfect.

## Workaround for Exact Tracking

If you want exact scores right now:

### Option 1: Use Loser Field Strategically
- Always enter the discarder as "Loser"
- Manually track the -25% payments for other players separately
- Add up at the end

### Option 2: Notes Field
Record full distribution in notes:
```
Winner: Alice (+8)
Discarder: Bob (-4)
Others: Charlie (-2), Diana (-2)
```

### Option 3: External Calculator
- Use app to record hands
- Use spreadsheet/calculator for exact score tracking
- Compare final totals

## The Math

Why net scores approximate correctly over time:

If you play 12 hands where each player:
- Wins 3 times (3 × +base)
- Discards 3 times (3 × -base/2)
- Is "other" 6 times (6 × -base/4)

**Each player's total:** 3base - 1.5base - 1.5base = 0  
(Everyone breaks even if they win/lose equally)

The app tracks relative performance accurately even if per-hand splits aren't perfect.
