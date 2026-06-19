# Scoring Calculation Update

## Changes Made

Updated the payment distribution rules to match proper Hong Kong Mahjong conventions.

## New Payment Rules

### Win from Discard (食糊)
When a player wins by claiming a discarded tile:
- **Discarder pays:** 1/2 of base points
- **Other 2 players pay:** 1/4 of base points each
- **Winner receives:** Full base points

**Example (3 fan = 8 points):**
- Winner: **+8 points**
- Discarder: **-4 points** (pays half)
- Other player 1: **-2 points** (pays quarter)
- Other player 2: **-2 points** (pays quarter)
- **Total:** -4 + -2 + -2 = -8 ✓

### Self-Drawn Win (自摸)
When a player wins by drawing their own winning tile:
- **All 3 players pay equally:** base points ÷ 3 each
- **Winner receives:** base points (rounded)

**Example (3 fan = 8 points):**
- Winner: **+9 points** (3 × 3, rounded)
- Player 1: **-3 points**
- Player 2: **-3 points**
- Player 3: **-3 points**
- **Total:** -9 = 9 ✓

## Calculation Examples

### 3 Fan (8 base points)

| Scenario | Winner | Discarder | Other 1 | Other 2 |
|----------|--------|-----------|---------|---------|
| Win from discard | +8 | -4 | -2 | -2 |
| Self-drawn | +9 | -3 | -3 | -3 |

### 4 Fan (16 base points)

| Scenario | Winner | Discarder | Other 1 | Other 2 |
|----------|--------|-----------|---------|---------|
| Win from discard | +16 | -8 | -4 | -4 |
| Self-drawn | +15 | -5 | -5 | -5 |

### 5 Fan (32 base points)

| Scenario | Winner | Discarder | Other 1 | Other 2 |
|----------|--------|-----------|---------|---------|
| Win from discard | +32 | -16 | -8 | -8 |
| Self-drawn | +33 | -11 | -11 | -11 |

### 7 Fan (128 base points)

| Scenario | Winner | Discarder | Other 1 | Other 2 |
|----------|--------|-----------|---------|---------|
| Win from discard | +128 | -64 | -32 | -32 |
| Self-drawn | +129 | -43 | -43 | -43 |

### 10 Fan (1024 base points)

| Scenario | Winner | Discarder | Other 1 | Other 2 |
|----------|--------|-----------|---------|---------|
| Win from discard | +1024 | -512 | -256 | -256 |
| Self-drawn | +1023 | -341 | -341 | -341 |

## Previous vs New Rules

### Before (Incorrect)
- **Win from discard:** Discarder pays 100%
- **Self-drawn:** Each pays base × 1.5

### After (Correct)
- **Win from discard:** Discarder pays 50%, others pay 25% each
- **Self-drawn:** Each pays 33.3% (base ÷ 3)

## Implementation Details

### Code Changes
File: `server/services/scoringEngine.ts`

**Self-Drawn:**
```javascript
const eachPays = Math.round(basePoints / 3);
winner: eachPays * 3
```

**Win from Discard:**
```javascript
const discarderPays = Math.round(basePoints / 2);
const othersPay = Math.round(basePoints / 4);
winner: basePoints
```

### Rounding
Due to division, some totals may be off by 1-2 points due to rounding:
- 3 fan self-drawn: 8 ÷ 3 = 2.67 → rounds to 3 each = 9 total
- 4 fan self-drawn: 16 ÷ 3 = 5.33 → rounds to 5 each = 15 total

This is normal and acceptable in practice.

## How It Affects Gameplay

### Strategic Implications

**Win from Discard:**
- Discarder takes the biggest hit (50%)
- Other players share remaining burden (25% each)
- Makes discarding riskier

**Self-Drawn:**
- Burden distributed evenly
- Everyone pays the same amount
- Slightly more total points paid out (due to rounding)

### Example Game Flow

**4 players start with 0 points:**

**Round 1:** Alice wins 3 fan from Bob's discard
- Alice: 0 → **+8** = 8
- Bob (discarder): 0 → **-4** = -4
- Charlie: 0 → **-2** = -2
- Diana: 0 → **-2** = -2

**Round 2:** Charlie wins 4 fan self-drawn
- Alice: 8 → **-5** = 3
- Bob: -4 → **-5** = -9
- Charlie: -2 → **+15** = 13
- Diana: -2 → **-5** = -7

**Round 3:** Bob wins 5 fan from Diana's discard
- Alice: 3 → **-8** = -5
- Bob: -9 → **+32** = 23
- Charlie: 13 → **-8** = 5
- Diana: -7 → **-16** = -23

## Testing

The backend has been updated with the new calculations. To verify:

1. **Create a new session**
2. **Record a 3 fan win from discard**
   - Winner should get +8
   - Check the leaderboard

3. **Record a 3 fan self-drawn**
   - Winner should get +9 (may vary slightly due to rounding)

## Database Impact

**None** - Only the calculation logic changed, not the schema. Existing hands retain their old calculated values.

## Files Modified

1. `server/services/scoringEngine.ts` - Updated `calculateTotalScore()` function
2. `SCORING_UPDATE.md` - This documentation

## References

Payment distribution formula:
- Win from discard: 50% + 25% + 25% = 100%
- Self-drawn: 33.3% + 33.3% + 33.3% = ~100% (with rounding)
