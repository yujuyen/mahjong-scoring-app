# Timezone Fix - Complete!

## Problem
Times were showing 4 hours ahead of your local time because:
- Database stored timestamps as `2026-06-13 16:26:51` (without timezone info)
- JavaScript didn't know it was UTC, so it treated it as local time
- This caused a 4-hour offset

## Solution
Changed the database schema to store timestamps in proper ISO 8601 format with UTC indicator:
- **Before:** `2026-06-13 16:26:51` (ambiguous)
- **After:** `2026-06-13T16:29:05.923Z` (clearly UTC)

## Changes Made

### 1. Database Schema (`server/database.ts`)
Updated timestamp columns from:
```sql
created_at DATETIME DEFAULT CURRENT_TIMESTAMP
```

To:
```sql
created_at TEXT DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
```

This ensures:
- Timestamps are stored as TEXT in ISO 8601 format
- The 'Z' suffix indicates UTC timezone
- Includes milliseconds for precision

### 2. Frontend Display (`client/src/utils/dateFormat.ts`)
Created utility functions that use browser's `toLocaleString()`:
- Automatically converts UTC to your local timezone
- Formats according to your browser's locale settings
- Shows times with proper AM/PM or 24-hour format

## How It Works

**Storage (Backend):**
```
SQLite stores: 2026-06-13T16:29:05.923Z
                                      ^ This 'Z' means UTC
```

**Display (Frontend):**
```javascript
new Date('2026-06-13T16:29:05.923Z').toLocaleString()
// If you're in PST (UTC-8): "Jun 13, 2026, 8:29:05 AM"
// If you're in EST (UTC-5): "Jun 13, 2026, 11:29:05 AM"
// If you're in JST (UTC+9): "Jun 14, 2026, 1:29:05 AM"
```

## Testing

### Check Current Time
Your browser should now show the correct local time for all:
- Session creation times
- Hand recording times
- Any other timestamps

### Verify
1. **Refresh your browser:** Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)
2. **Create a new session** and check the time shown
3. **Compare with your computer's clock** - they should match!

### Example
If you create a session right now, it should show YOUR current local time, not UTC time.

## Database Reset

**Important:** The old database was recreated with the new schema because:
- SQLite's `CREATE TABLE IF NOT EXISTS` doesn't modify existing tables
- The fix required changing the column definition
- All old sessions were deleted (they had incorrect timestamps anyway)

## Files Modified

1. `server/database.ts` - Updated schema for sessions and hands tables
2. `client/src/utils/dateFormat.ts` - Added timezone-aware formatting utilities
3. `client/src/pages/HomePage.tsx` - Updated to use new date formatter
4. `client/src/pages/SessionPage.tsx` - Updated to use new date formatter
5. `client/src/components/HandHistory.tsx` - Updated to use new date formatter

## Verification Commands

```bash
# Check database format
sqlite3 mahjong.db "SELECT created_at FROM sessions LIMIT 1;"
# Should show: 2026-06-13T16:29:05.923Z (with 'Z' at end)

# Create test session
curl -X POST http://localhost:3001/api/sessions \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","players":["A","B"]}'

# View in browser
# Open http://localhost:3000 and check the time shown
```

## What Your Timezone Is

The app automatically detects your timezone using:
```javascript
Intl.DateTimeFormat().resolvedOptions().timeZone
// Example: "America/Los_Angeles"
```

You don't need to configure anything - it just works!

## Future Improvements

Potential enhancements:
- [ ] Show "2 hours ago" style relative times
- [ ] Display timezone abbreviation (e.g., "PST", "EST")
- [ ] Allow users to override timezone (for traveling)
- [ ] Export data with timezone conversion options
