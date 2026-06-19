# 🀄 Quick Start Guide

## 🚀 Starting the App

The app has TWO servers that must BOTH be running:

### Method 1: One Command (Easiest)
```bash
./start.sh
```

### Method 2: Manual (Two Terminals)

**Terminal 1 - Backend:**
```bash
npm run dev
```
(Runs on http://localhost:3001)

**Terminal 2 - Frontend:**
```bash
cd client && npm run dev
```
(Runs on http://localhost:3000)

### Open the App
Go to: **http://localhost:3000**

---

## ✅ Verify Everything Works

1. **Check Backend:** http://localhost:3001/api/health
   - Should return: `{"status":"ok","message":"Mahjong Scoring API is running"}`

2. **Check Frontend:** http://localhost:3000
   - Should show the home page with "Start New Session" button

---

## 📝 First Time Setup

### 1. Create a Session
1. Click **"Start New Session"**
2. Enter session name: "Test Game"
3. Add 4 players:
   - Alice
   - Bob
   - Carol
   - Dave
4. Click **"Start Session"**

### 2. Record First Hand
1. Click **"+ Record Hand"**
2. Select **Winner**: Alice
3. Select **Discarder**: Bob (or leave empty for self-drawn)
4. Enter **Fan Count**: 3
5. Click **"Submit Hand"**

### 3. View Results
- **Leaderboard** shows updated scores
- **Hand History** shows the recorded hand with payment breakdown

---

## 🎮 Key Features to Try

### Recording Different Hand Types

**Self-drawn Hand (自摸):**
- Winner: Any player
- Discarder: Leave as "None (Self-drawn 自摸)"
- Result: All 3 losers pay equally

**Discard Win (放銃):**
- Winner: Any player
- Discarder: Select who discarded
- Result: Discarder pays half, others pay quarter each

### Editing & Deleting

**Edit a Hand:**
1. Find hand in history
2. Click ✏️ button
3. Change values
4. Submit - scores auto-recalculate!

**Delete a Hand:**
1. Click 🗑️ button on any hand
2. Confirm deletion
3. Scores automatically adjust

### Completing a Session
- Click **"End Session"** when game is done
- Session marked as "completed"
- Can still view history and edit hands

---

## 🔍 Troubleshooting

### "Cannot connect" or "Invalid page"
**Problem:** Backend server not running

**Fix:**
```bash
# Check if backend is running
curl http://localhost:3001/api/health

# If no response, start backend
npm run dev
```

### Port Already in Use
**Error:** `Port 3000 is already in use`

**Fix:**
```bash
# Find and kill process using port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port in client/vite.config.ts
```

### Empty Database
If you see no sessions, that's normal! Database starts empty.
Click "Start New Session" to create your first game.

---

## 📊 Sample Game Flow

Here's a complete example:

```
Session: Friday Night Game
Players: Alice, Bob, Carol, Dave

Hand 1: Alice wins (self-drawn), 3 fan
  Alice:  +48 points
  Bob:    -16 points
  Carol:  -16 points
  Dave:   -16 points

Hand 2: Bob wins (Dave discarded), 5 fan
  Bob:    +32 points
  Dave:   -16 points (discarder pays 1/2)
  Alice:  -8 points  (others pay 1/4)
  Carol:  -8 points

Leaderboard after 2 hands:
  1. 🥇 Alice:  +40
  2. 🥈 Bob:    +16
  3. 🥉 Carol:  -24
  4.     Dave:  -32
```

---

## 🎯 What's Working

✅ Create sessions with players  
✅ Record hands with automatic scoring  
✅ Edit hands (scores recalculate)  
✅ Delete hands (scores adjust)  
✅ Live leaderboard  
✅ Complete hand history  
✅ End sessions  
✅ Delete sessions  

Everything is fully functional!

---

## 📖 More Info

See **README.md** for:
- Complete API documentation
- Detailed scoring rules
- Project architecture
- Development setup

---

**Enjoy your mahjong games!** 🀄
