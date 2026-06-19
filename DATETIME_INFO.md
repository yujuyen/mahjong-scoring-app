# Date and Time Display

## Overview

All dates and times in the app are **automatically displayed in your local timezone**. The app uses JavaScript's built-in internationalization features to format dates according to your browser's locale settings.

## Where Dates/Times Are Shown

### 1. Session Cards (Home Page)
**Format:** `Jun 13, 2026, 11:30 AM`
- Shows when the session was created
- Includes date and time
- Updates automatically based on your timezone

### 2. Session Detail Page
**Format:** `Jun 13, 2026, 11:30 AM`
- Shows session creation date/time in the header
- Same format as session cards

### 3. Hand History
**Format:** `Jun 13, 2026, 11:30:45 AM`
- Shows when each hand was recorded
- Includes seconds for precision
- Helps track game progression

## How It Works

### Database Storage
- All timestamps are stored in **UTC** in the SQLite database
- Format: ISO 8601 (e.g., `2026-06-13T18:30:00.000Z`)

### Browser Display
- JavaScript automatically converts UTC to **your local timezone**
- Uses `toLocaleString()` and `toLocaleDateString()` methods
- Respects your browser's language and locale settings

### Example Conversions

If a session was created at `2026-06-13 18:30:00 UTC`:

| Your Timezone | Display |
|--------------|---------|
| PST (UTC-8) | Jun 13, 2026, 10:30 AM |
| EST (UTC-5) | Jun 13, 2026, 1:30 PM |
| JST (UTC+9) | Jun 14, 2026, 3:30 AM |
| GMT (UTC+0) | Jun 13, 2026, 6:30 PM |

## Date Format Options

The app uses these specific formats:

### Session Cards & Session Header
```javascript
formatDateTime(date)
// Output: "Jun 13, 2026, 11:30 AM"
```

Options:
- Year: numeric (e.g., 2026)
- Month: short (e.g., Jun)
- Day: numeric (e.g., 13)
- Hour: 2-digit with AM/PM
- Minute: 2-digit

### Hand History
```javascript
formatDateTimeFull(date)
// Output: "Jun 13, 2026, 11:30:45 AM"
```

Same as above, but includes:
- Second: 2-digit

## Utility Functions

Located in `client/src/utils/dateFormat.ts`:

### `formatDateTime(date)`
Standard date and time display
```typescript
formatDateTime('2026-06-13T18:30:00Z')
// "Jun 13, 2026, 11:30 AM" (in PST)
```

### `formatDateTimeFull(date)`
Includes seconds
```typescript
formatDateTimeFull('2026-06-13T18:30:45Z')
// "Jun 13, 2026, 11:30:45 AM" (in PST)
```

### `formatDate(date)`
Date only, no time
```typescript
formatDate('2026-06-13T18:30:00Z')
// "Jun 13, 2026"
```

### `formatRelativeTime(date)`
Relative time (e.g., "2 hours ago")
```typescript
formatRelativeTime(twoHoursAgo)
// "2 hours ago"

formatRelativeTime(lastWeek)
// "Jun 6, 2026"
```

### `formatDateTimeWithTZ(date)`
Includes timezone abbreviation
```typescript
formatDateTimeWithTZ('2026-06-13T18:30:00Z')
// "Jun 13, 2026, 11:30 AM PDT"
```

### `getUserTimezone()`
Get your timezone identifier
```typescript
getUserTimezone()
// "America/Los_Angeles"
```

## Internationalization

The app automatically adapts to your system settings:

### Language
If your browser is set to:
- **English (US):** "June 13, 2026"
- **English (UK):** "13 June 2026"
- **German:** "13. Juni 2026"
- **Japanese:** "2026年6月13日"

### Time Format
- **12-hour (US):** "11:30 AM"
- **24-hour (Europe):** "11:30"

### First Day of Week
- **Sunday:** US, Japan, most of Americas
- **Monday:** Europe, most of Asia

## Testing Different Timezones

To test how the app looks in different timezones:

### Chrome DevTools
1. Press F12 to open DevTools
2. Press Ctrl+Shift+P (Cmd+Shift+P on Mac)
3. Type "sensors"
4. Select "Show Sensors"
5. Choose a location from the dropdown

### Browser Settings
Change your system timezone, then refresh the browser

## Database Queries

When querying the database directly:

```sql
-- Timestamps are stored as ISO 8601 strings in UTC
SELECT created_at FROM sessions;
-- Output: 2026-06-13T18:30:00.000Z

-- SQLite's datetime functions work in UTC
SELECT datetime(created_at) FROM sessions;
```

## Future Enhancements

Potential improvements:
- [ ] User preference for date format (12h vs 24h)
- [ ] Relative time display ("2 hours ago")
- [ ] Timezone indicator on timestamps
- [ ] Export data with timezone conversion
- [ ] Session duration tracking
