# 🀄 Mahjong Scoring App

A complete full-stack web application for tracking Hong Kong style Mahjong game scores with automatic score calculation, hand recording, and player leaderboards.

## ✅ Complete Features

### Session Management
- ✅ Create game sessions with 2-8 players
- ✅ View all active and completed sessions
- ✅ Complete/end sessions when games finish
- ✅ Delete sessions with cascade deletion of all data
- ✅ Add players when creating sessions

### Hand Recording & Scoring
- ✅ Record winning hands with winner, discarder (or self-drawn), and fan count
- ✅ Edit existing hands (scores automatically recalculated)
- ✅ Delete hands (scores automatically adjusted)
- ✅ Optional hand image upload
- ✅ Optional notes for each hand
- ✅ Automatic Hong Kong Mahjong scoring:
  - **Self-drawn (自摸)**: Winner gets base × 1.5, split equally among 3 losers
  - **Discard win (放銃)**: Discarder pays 1/2, other two pay 1/4 each
  
### Live Tracking
- ✅ Real-time leaderboard with rankings (🥇🥈🥉)
- ✅ Complete hand history with timestamps
- ✅ Payment breakdown showing each player's gain/loss per hand
- ✅ Visual indicators for winners and discarders

## Tech Stack

### Backend
- **Node.js** with **Express** - RESTful API server
- **TypeScript** - Type-safe development
- **SQLite** - Lightweight database for storing sessions, players, hands, and scores
- **Multer** - Image upload handling

### Frontend
- **React** with **TypeScript** - Modern UI framework
- **Vite** - Fast development build tool
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls

## Project Structure

```
mahjong_scoring_app/
├── server/                  # Backend application
│   ├── routes/             # API route handlers
│   │   ├── sessions.ts     # Session management endpoints
│   │   └── hands.ts        # Hand submission endpoints
│   ├── services/           # Business logic
│   │   └── scoringEngine.ts # HK mahjong scoring rules
│   ├── database.ts         # SQLite database setup
│   └── index.ts            # Express server entry point
├── client/                 # Frontend application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API client
│   │   └── styles/        # CSS files
│   └── vite.config.ts     # Vite configuration
├── uploads/               # Uploaded hand images
└── mahjong.db            # SQLite database (generated)
```

## Getting Started

### Prerequisites
- Node.js 16+ 
- npm

### Installation

1. **Install dependencies:**
   ```bash
   # Install backend dependencies
   npm install
   
   # Install frontend dependencies
   cd client && npm install && cd ..
   ```

2. **Build the backend:**
   ```bash
   npm run build
   ```

### Running the App

#### Option 1: Quick Start (Recommended)
```bash
./start.sh
```
This script starts both backend and frontend servers automatically.

#### Option 2: Manual Start

**Terminal 1 - Backend Server:**
```bash
npm run dev
```
Backend API will run on http://localhost:3001

**Terminal 2 - Frontend:**
```bash
cd client && npm run dev
```
Frontend will run on http://localhost:3000

3. **Open your browser:**
   Navigate to http://localhost:3000

**Important:** Both servers must be running for the app to work correctly!

## API Endpoints

### Sessions
- `POST /api/sessions` - Create new session
- `GET /api/sessions` - Get all sessions
- `GET /api/sessions/:id` - Get session details
- `PATCH /api/sessions/:id/complete` - Complete a session
- `DELETE /api/sessions/:id` - Delete a session
- `GET /api/sessions/:id/leaderboard` - Get session leaderboard

### Hands
- `POST /api/hands` - Submit a new hand (with optional image upload)
- `GET /api/hands/session/:sessionId` - Get all hands for a session
- `GET /api/hands/:id` - Get hand details
- `PUT /api/hands/:id` - Update/edit a hand
- `DELETE /api/hands/:id` - Delete a hand

### Other
- `GET /api/hand-types` - Get list of recognized hand types
- `GET /api/health` - Health check

## 🎯 Hong Kong Mahjong Scoring

The app uses simplified Hong Kong-style scoring:

### Payment Structure
1. **Self-drawn (自摸 Zì Mō)**
   - Winner receives: base points × 1.5
   - Each of the 3 losers pays: (base × 1.5) ÷ 3

2. **Discard win (放銃 Fàng Chòng)**
   - Winner receives: base points
   - Discarder (放銃者) pays: base ÷ 2
   - Other 2 players each pay: base ÷ 4

### Fan Count
Players manually enter the fan count (1-13) based on their hand:
- 1-2 Fan: Small hands (e.g., all sequences, simple waits)
- 3-5 Fan: Medium hands (e.g., all triplets, mixed suits)
- 6-8 Fan: Large hands (e.g., pure suit, big three dragons)
- 10-13 Fan: Limit hands (e.g., thirteen orphans, nine gates)

Base points scale exponentially with fan count.

## 📖 Usage Guide

### 1. Start a New Session
1. From the home page, click **"Start New Session"**
2. Enter a session name (e.g., "Friday Night Game", "MJ Night @ Coultes")
3. Add 2-8 player names
   - Click "+ Add Player" for more players
   - Click "×" to remove a player (minimum 2 required)
4. Click **"Start Session"**

You'll be taken to the session page where you can start recording hands.

### 2. Record a Hand
1. Click **"+ Record Hand"** button
2. Fill in the hand details:
   - **Winner**: Select the player who won
   - **Discarder**: Select who discarded the winning tile
     - Leave as "None (Self-drawn 自摸)" if the winner drew the tile themselves
   - **Fan Count**: Enter the fan value (1-13)
   - **Notes** (optional): Add details about the hand
3. Click **"Submit Hand"**

The app automatically calculates and updates all player scores!

**Scoring Rules Applied:**
- **Self-drawn (自摸)**: Each of the 3 losers pays equally
- **Discard win (放銃)**: Discarder pays 1/2, other two players pay 1/4 each

### 3. View Leaderboard & History
The session page shows:
- **Leaderboard**: Real-time rankings with 🥇🥈🥉 medals
- **Hand History**: Complete list of all hands played
  - Each hand shows: winner, win type, fan count, payments for all players
  - ✏️ Edit button to modify a hand
  - 🗑️ Delete button to remove a hand

### 4. Edit or Delete Hands
- **Edit**: Click the ✏️ button on any hand to modify it
  - Scores are automatically recalculated for all players
- **Delete**: Click the 🗑️ button to remove a hand
  - Scores are automatically adjusted (changes are reversed)
  - Confirmation dialog prevents accidental deletions

### 5. Complete a Session
When your game ends:
1. Click **"End Session"** button
2. Confirm the action
3. Session status changes to "completed"
4. No more hands can be added (editing existing ones still possible)

### 6. Delete a Session
From the home page or session page:
1. Click the 🗑️ **"Delete Session"** button
2. Confirm deletion
3. All session data (players, hands, scores) is permanently removed

## 🔧 Troubleshooting

### "Invalid page" or "Session not found"
**Problem:** The backend server isn't running.

**Solution:** 
1. Check if backend is running: `curl http://localhost:3001/api/health`
2. If not running, start it: `npm run dev`
3. Make sure both backend (port 3001) and frontend (port 3000) are running

### Sessions page is empty
The database starts empty. Click "Start New Session" to create your first game.

### Scores not updating
1. Check browser console (F12) for errors
2. Verify backend server is running
3. Check network tab to see if API calls are succeeding
4. Verify CORS is working (backend has CORS enabled for all origins in development)

### Port conflicts
If ports 3000 or 3001 are already in use:
- **Backend (3001)**: Change `PORT` in `server/index.ts`
- **Frontend (3000)**: Change port in `client/vite.config.ts`

### Database reset
To start fresh:
```bash
rm mahjong.db
```
The database will be recreated on next backend startup.

## 🚀 Future Enhancements

Potential features for future versions:
- **AI Hand Recognition**: OCR/Computer Vision for automatic tile recognition
- **Multiple Scoring Systems**: Support for regional variations (Japanese, Taiwanese, etc.)
- **Player Statistics**: Track performance across multiple sessions
- **Mobile App**: Native iOS/Android applications
- **Real-time Multiplayer**: Live updates for multiple devices
- **Authentication**: User accounts and private sessions
- **Export Data**: Download game history as CSV/JSON
- **Session Analytics**: Graphs, win rates, average scores

## License

ISC

## Author

Created with Claude Code
