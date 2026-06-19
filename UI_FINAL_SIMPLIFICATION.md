# Final UI Simplification - Hand Entry Form

## Changes Made

Simplified the hand entry form to be more intuitive and straightforward.

## Removed Fields

❌ **Self-Drawn Checkbox** - No longer needed  
❌ **Winner is Dealer Checkbox** - Not used in scoring  

## Updated Fields

✅ **Winner (贏家)** - Select who won  
✅ **Discarder (放銃)** - Select who discarded the winning tile, OR leave empty for self-drawn  
✅ **Fan Count (番)** - Enter 3-13  
✅ **Notes** - Optional details  

## How Self-Drawn Works Now

**Simple logic:**
- **Has discarder selected?** → Win from discard
- **No discarder (empty)?** → Self-drawn (自摸)

**No checkbox needed!** The form automatically determines if it's self-drawn based on whether you select a discarder.

## New Form Layout

```
┌─────────────────────────────────────────────┐
│ Winner (贏家): [dropdown]                   │
│                                             │
│ Discarder (放銃): [None (Self-drawn 自摸)] │
│   ↑ Leave empty for self-drawn             │
│                                             │
│ Fan Count (番): [3-13]                      │
│   Minimum 3 fan. Leave discarder empty     │
│   for self-drawn (自摸)                     │
│                                             │
│ Notes: [textarea]                           │
│                                             │
│ [Cancel] [Submit Hand]                      │
└─────────────────────────────────────────────┘
```

## How to Use

### Win from Discard
1. **Select Winner:** Who won
2. **Select Discarder:** Who threw the winning tile
3. **Enter Fan Count:** 3-13
4. **Submit**

**Result:**
- Winner: +base points
- Discarder: -50% base
- Others: -25% base each

**Example (3 fan):**
- Winner: +8
- Discarder: -4
- Others: -2 each

### Self-Drawn Win
1. **Select Winner:** Who won
2. **Leave Discarder Empty:** Select "None (Self-drawn 自摸)"
3. **Enter Fan Count:** 3-13
4. **Submit**

**Result:**
- Winner: +base × 1.5
- All others: -(base × 1.5) ÷ 3 each

**Example (4 fan):**
- Winner: +24 (16 × 1.5)
- Each loser: -8

## Test Results

### Test 1: Win from Discard
**Input:**
- Winner: Alice
- Discarder: Bob (selected)
- Fan Count: 3

**Result:** ✓
- Alice: +8
- Bob: -4 (discarder)
- Charlie: -2
- Diana: -2

### Test 2: Self-Drawn
**Input:**
- Winner: Charlie
- Discarder: (empty - "None")
- Fan Count: 4

**Result:** ✓
- Charlie: +24 (16 × 1.5)
- Alice: -8
- Bob: -8
- Diana: -8

## Benefits

### Simpler
- Fewer fields to fill
- No confusing checkboxes
- Intuitive logic

### Clearer
- "Discarder" is more obvious than "Loser"
- The default option explicitly says "Self-drawn"
- Help text guides the user

### Faster
- One less checkbox to check/uncheck
- Self-drawn is just "leave empty"
- Removed unused dealer field

## Code Changes

### Frontend: `client/src/components/HandEntry.tsx`

**Removed:**
```typescript
const [isSelfDrawn, setIsSelfDrawn] = useState(false);
const [isDealer, setIsDealer] = useState(false);
```

**Changed:**
```typescript
const [loserId, setLoserId] = ...  // Before
const [discarderId, setDiscarderId] = ...  // After
```

**Logic:**
```typescript
// Self-drawn = no discarder selected
const isSelfDrawn = !discarderId;
```

**Form Fields:**
- Renamed "Loser" → "Discarder (放銃)"
- Removed checkboxes
- Updated help text

### Backend

**No changes needed!** The backend already:
- Accepts `isSelfDrawn` parameter
- Handles missing `loserId` correctly
- Distributes payments properly

## User Experience

### Before (Confusing)
1. Select winner ✓
2. Select loser... wait, is this the discarder? 🤔
3. Check "Self-Drawn" box if... when? 🤔
4. Check "Winner is Dealer"... do I need this? 🤔

### After (Clear)
1. Select winner ✓
2. Select discarder (or leave empty) ✓
3. Enter fan count ✓
4. Done!

## Field Labels

| Field | English | Chinese |
|-------|---------|---------|
| Winner | Winner | 贏家 |
| Discarder | Discarder | 放銃 |
| Self-drawn | Self-drawn | 自摸 |
| Fan Count | Fan Count | 番 |

## Validation

**Required:**
- Winner must be selected
- Fan count must be 3-13

**Optional:**
- Discarder (empty = self-drawn)
- Notes

**Automatic:**
- Self-drawn determined by empty discarder
- Dealer set to false (not used)

## Frontend Status

✅ **Form simplified** - Removed 2 checkboxes  
✅ **Logic fixed** - Self-drawn works correctly  
✅ **Labels updated** - "Discarder" instead of "Loser"  
✅ **Help text added** - Clear instructions  
✅ **Build successful** - No errors  

## Backend Status

✅ **No changes needed** - Already handles the logic  
✅ **Payments correct** - All 4 players updated  
✅ **Self-drawn bonus** - base × 1.5 working  

## Migration

**No migration needed!** The changes are only to the UI. The backend API remains the same.

## Testing

**To verify the form works:**

1. **Refresh browser** (Ctrl+Shift+R or Cmd+Shift+R)
2. **Create new session**
3. **Test win from discard:**
   - Select winner and discarder
   - Check leaderboard
4. **Test self-drawn:**
   - Select winner, leave discarder empty
   - Winner should get +base × 1.5
   - All others should pay equally

## Screenshots (Text Representation)

**Win from Discard:**
```
Winner: Alice ▼
Discarder: Bob ▼  ← Selected
Fan Count: 3
```

**Self-Drawn:**
```
Winner: Charlie ▼
Discarder: None (Self-drawn 自摸) ▼  ← Empty
Fan Count: 4
```

## Summary

The form is now **cleaner, simpler, and more intuitive**:
- Removed unnecessary checkboxes
- Clear field labels
- Automatic self-drawn detection
- Helpful instructions

Everything works correctly with proper scoring! 🎉
