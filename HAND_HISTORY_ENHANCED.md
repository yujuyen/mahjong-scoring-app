# Hand History Enhancement - Show All Players

## Changes Made

Updated the Hand History to show **payment details for all 4 players** on each hand card.

## What's New

### Before
```
🀄 Alice vs Bob
All Triplets
3 Fan    +8 points
Jun 13, 2026, 2:30:45 PM
```

### After
```
🀄 Alice                     放銃 Discard
3 Fan    8 base

┌─────────────────────────────┐
│ Alice    +8   (winner)      │
│ Bob      -4   (discarder)   │
│ Charlie  -2                 │
│ Diana    -2                 │
└─────────────────────────────┘

Jun 13, 2026, 2:30:45 PM
```

## Features

### Payment Breakdown
Each hand card now shows:
- **Winner** - Green background with + amount
- **All losers** - Red background with - amounts
- **Type indicator** - "自摸 Self-drawn" or "放銃 Discard"

### Visual Design
- **Winner row**: Green background, green text
- **Loser rows**: Red background, red text
- **Grid layout**: 2 columns (1 on mobile)
- **Clear labels**: Player names and amounts

### Automatic Calculation
The frontend calculates each player's payment based on:
- Base points
- Whether it's self-drawn (no discarder)
- Win from discard payment rules (50%, 25%, 25%)
- Self-drawn payment rules (base × 1.5 ÷ 3)

## Payment Display Logic

### Win from Discard Example (3 fan = 8 base)
```
Alice (winner)     +8   (green)
Bob (discarder)    -4   (red) ← Pays 50%
Charlie            -2   (red) ← Pays 25%
Diana              -2   (red) ← Pays 25%
```

### Self-Drawn Example (4 fan = 16 base × 1.5 = 24)
```
Charlie (winner)   +24  (green)
Alice              -8   (red) ← Each pays ⅓
Bob                -8   (red)
Diana              -8   (red)
```

## Implementation Details

### Frontend Changes

**File: `client/src/components/HandHistory.tsx`**
- Added `players` prop
- Added `calculatePayments()` function
- Shows all 4 players with their payments
- Color-codes winner (green) and losers (red)

**File: `client/src/pages/SessionPage.tsx`**
- Passes `players` to HandHistory component

**File: `client/src/styles/HandHistory.css`**
- Added `.hand-payments` grid layout
- Added `.payment-item` styling
- Winner/loser backgrounds and colors
- Responsive grid (2 cols → 1 col on mobile)

### Calculation Function
```typescript
function calculatePayments(hand: Hand, players: Player[]) {
  const basePoints = hand.base_points;
  const isSelfDrawn = !hand.loser_id;
  
  if (isSelfDrawn) {
    // base × 1.5 ÷ 3
    const totalPoints = Math.round(basePoints * 1.5);
    const eachPays = Math.round(totalPoints / 3);
    // All losers pay equally
  } else {
    // Discarder pays 50%
    // Others pay 25% each
  }
}
```

## Visual Layout

### Desktop (2 columns)
```
┌─────────────────────────────────────┐
│ 🀄 Alice          放銃 Discard      │
│ 3 Fan    8 base                     │
├─────────────────────────────────────┤
│ Alice    +8  │  Bob       -4        │
│ Charlie  -2  │  Diana     -2        │
└─────────────────────────────────────┘
```

### Mobile (1 column)
```
┌─────────────────────────┐
│ 🀄 Alice   放銃 Discard │
│ 3 Fan    8 base         │
├─────────────────────────┤
│ Alice        +8         │
│ Bob          -4         │
│ Charlie      -2         │
│ Diana        -2         │
└─────────────────────────┘
```

## Color Coding

| Player Type | Background | Text Color | Border |
|-------------|------------|------------|--------|
| Winner | Light green (#d4edda) | Green (#28a745) | Green left border |
| Loser | Light red (#f8d7da) | Red (#dc3545) | Red left border |

## Information Displayed

### Hand Header
- **Winner name** with 🀄 icon
- **Hand type**: "自摸 Self-drawn" or "放銃 Discard"

### Hand Stats
- **Fan count**: Blue badge (e.g., "3 Fan")
- **Base points**: Gray text (e.g., "8 base")

### Payment Grid
- **All 4 players** with their names
- **Payment amounts** with +/- sign
- **Visual indicators**: Green for winner, red for losers

### Additional Info
- **Image** (if uploaded)
- **Notes** (if added)
- **Timestamp** (bottom right)

## Benefits

### For Players
✓ **Transparency**: See exactly who paid what  
✓ **Verification**: Check calculations are correct  
✓ **Learning**: Understand payment distribution rules

### For Score Tracking
✓ **Audit trail**: Full payment history  
✓ **Dispute resolution**: Clear record of all transactions  
✓ **Understanding**: See patterns in wins/losses

## Example Scenarios

### Scenario 1: Regular Win
**Hand:** Alice wins 3 fan from Bob's discard
```
🀄 Alice                     放銃 Discard
3 Fan    8 base

Alice (winner)     +8   ← Receives full base
Bob (discarder)    -4   ← Pays 50%
Charlie            -2   ← Pays 25%
Diana              -2   ← Pays 25%
```

### Scenario 2: Self-Drawn
**Hand:** Charlie wins 5 fan self-drawn
```
🀄 Charlie                   自摸 Self-drawn
5 Fan    32 base

Charlie (winner)   +48  ← Gets base × 1.5 (32 × 1.5)
Alice              -16  ← Each pays ⅓ (48 ÷ 3)
Bob                -16
Diana              -16
```

### Scenario 3: Big Hand
**Hand:** Diana wins 7 fan from Alice's discard
```
🀄 Diana                     放銃 Discard
7 Fan    128 base

Diana (winner)     +128 ← Full base
Alice (discarder)  -64  ← Pays 50%
Bob                -32  ← Pays 25%
Charlie            -32  ← Pays 25%
```

## Zero-Sum Verification

Each hand's payments should sum to zero (within rounding):

**Example 1 (3 fan discard):**
+8 -4 -2 -2 = 0 ✓

**Example 2 (4 fan self-drawn):**
+24 -8 -8 -8 = 0 ✓

**Example 3 (5 fan discard):**
+32 -16 -8 -8 = 0 ✓

## Frontend Status

✅ **HandHistory updated** - Shows all players  
✅ **Payments calculated** - Automatic from hand data  
✅ **Styling complete** - Color-coded, responsive  
✅ **Build successful** - No errors  

## Backend Status

✅ **No changes needed** - Frontend calculates from existing data  
✅ **Base points available** - Used for calculations  
✅ **Loser ID present** - Determines self-drawn vs discard  

## How to See It

1. **Refresh browser** (Ctrl+Shift+R or Cmd+Shift+R)
2. **Open any session** with recorded hands
3. **View Hand History section**
4. **See payment breakdown** for all 4 players on each hand!

The hand history now provides complete transparency showing exactly how points were distributed! 🎉
