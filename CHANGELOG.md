# Changelog

## Recent Updates

### Delete Sessions Feature (2026-06-13)

**Added:**
- Backend API endpoint: `DELETE /api/sessions/:id`
- Frontend delete functionality on HomePage and SessionPage
- Cascade deletion of all related data (players, hands, scores)
- Confirmation dialog before deletion
- Visual delete button (🗑️) appears on hover over session cards

**Usage:**
- **From HomePage:** Hover over a session card and click the delete button (🗑️)
- **From SessionPage:** Click "Delete Session" button at the bottom of session actions

**Safety:**
- Confirmation dialog prevents accidental deletion
- All related data is automatically deleted (players, hands, scores, images)
- Redirects to homepage after successful deletion from session page

### Scoring Rules Update (2026-06-13)

**Changed:**
- Updated scoring engine to follow official Wikipedia Hong Kong Mahjong rules
- Implemented "Full Spicy" (全辣) system: Points = 2^fan
- Fixed payment calculations:
  - Win from discard: Winner gets base points
  - Self-drawn: Winner gets base × 4.5 (each player pays base × 1.5)
- Updated hand patterns with correct fan values
- Added minimum 3 fan requirement to win
- Maximum 13 fan limit

**Example:**
- 3 fan, win from discard: +8 points (not 32!)
- 3 fan, self-drawn: +36 points (12 from each player)

### Initial Release

**Features:**
- Session management (create, view, complete)
- Player management (2+ players per session)
- Hand recording with image upload
- Hong Kong style scoring calculation
- Real-time leaderboard
- Hand history with images
- SQLite database storage
- React + TypeScript frontend
- Express + TypeScript backend

## API Endpoints

### Sessions
- `POST /api/sessions` - Create new session
- `GET /api/sessions` - Get all sessions
- `GET /api/sessions/:id` - Get session details
- `PATCH /api/sessions/:id/complete` - Complete session
- `DELETE /api/sessions/:id` - Delete session (NEW)
- `GET /api/sessions/:id/leaderboard` - Get leaderboard

### Hands
- `POST /api/hands` - Submit new hand (with image)
- `GET /api/hands/session/:sessionId` - Get session hands
- `GET /api/hands/:id` - Get hand details

### Other
- `GET /api/hand-types` - Get hand type options
- `GET /api/health` - Health check

## Database Schema

### Sessions
- ON DELETE CASCADE for all related tables
- Deleting a session automatically removes:
  - All players in the session
  - All hands recorded in the session
  - All scores for the session
  - Associated uploaded images

## Known Issues

None currently reported.

## Future Enhancements

- Edit hand records
- Delete individual hands
- Export session data (CSV/JSON)
- Session statistics and analytics
- User authentication
- Multi-device sync
- AI-powered tile recognition from images
- Half Spicy scoring option
- Custom house rules configuration
