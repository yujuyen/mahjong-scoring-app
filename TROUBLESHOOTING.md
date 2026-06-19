# Troubleshooting Guide

## Issue: Blank page at localhost:3000

### What was wrong
TypeScript configuration required type-only imports. The error was:
```
'Session' is a type and must be imported using a type-only import when 'verbatimModuleSyntax' is enabled
```

### Fix Applied
Changed imports from:
```typescript
import { sessionAPI, Session } from '../services/api';
```

To:
```typescript
import { sessionAPI, type Session } from '../services/api';
```

This was applied to all component files.

## How to Verify It's Working

1. **Check both servers are running:**
   ```bash
   # Backend should show:
   curl http://localhost:3001/api/health
   # Should return: {"status":"ok","message":"Mahjong Scoring API is running"}
   
   # Frontend should be accessible:
   curl http://localhost:3000
   # Should return HTML with <title>client</title>
   ```

2. **Open browser to http://localhost:3000**
   - You should see the Mahjong Scoring homepage
   - NOT a blank page

3. **Check browser console (F12)**
   - Should have NO red errors
   - React should mount successfully

## If You Still See a Blank Page

1. **Hard refresh browser:** Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)

2. **Clear browser cache** and reload

3. **Check browser console (F12)** for errors:
   - Look for import errors
   - Look for React mounting errors
   - Share any error messages you see

4. **Restart the frontend server:**
   ```bash
   # Stop the current server (Ctrl+C in terminal)
   cd /Users/yyen/claude/mahjong_scoring_app/client
   npm run dev
   ```

5. **Check if port 3000 is the right one:**
   - Vite might use a different port if 3000 is busy
   - Look at the terminal output for the actual URL
   - It might say "Local: http://localhost:5173" or another port

## Common Issues

### Module not found errors
```bash
cd client
npm install
```

### Backend not responding
```bash
cd /Users/yyen/claude/mahjong_scoring_app
npm run dev
```

### Port already in use
The terminal will show which port is actually being used. Use that port instead of 3000.

## Success Checklist

✓ Backend running on http://localhost:3001  
✓ Frontend running (check terminal for actual port)  
✓ Browser shows Mahjong Scoring homepage (not blank)  
✓ No errors in browser console  
✓ Can click "Start New Session" button
