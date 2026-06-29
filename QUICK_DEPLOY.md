# 🚀 Quick Deploy - 5 Minutes

Your app is ready to deploy! Follow these exact steps:

---

## Step 1: Create GitHub Repository (2 minutes)

1. Go to: **https://github.com/new**
2. Fill in:
   - **Repository name:** `mahjong-scoring-app`
   - **Description:** "Hong Kong Mahjong scoring tracker with automatic calculations"
   - **Visibility:** ✅ **Public** (required for free hosting)
   - **❌ DO NOT** check "Add a README file"
   - **❌ DO NOT** check "Add .gitignore"
   - **❌ DO NOT** choose a license
3. Click **"Create repository"**

4. **Copy the commands** shown on the "Quick setup" page (should look like):
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/mahjong-scoring-app.git
   git branch -M main
   git push -u origin main
   ```

---

## Step 2: Push Your Code (1 minute)

Run these commands in your terminal:

```bash
cd /Users/yyen/claude/mahjong_scoring_app

# Add GitHub as remote (use YOUR GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/mahjong-scoring-app.git

# Push to GitHub
git branch -M main
git push -u origin main
```

You'll be prompted for GitHub credentials - use your username and **personal access token** (not password).

---

## Step 3: Deploy on Render (2 minutes)

1. Go to: **https://render.com**
2. Click **"Get Started for Free"** or **"Sign In"**
3. Sign up/login with **GitHub** (easiest)
4. Once logged in, click **"New +"** → **"Web Service"**
5. **Connect your repository:**
   - Click "Configure account" or "Connect GitHub"
   - Authorize Render to access your repos
   - Find and select **`mahjong-scoring-app`**
   - Click **"Connect"**

6. **Fill in the form:**
   - **Name:** `mahjong-scoring` (or any name you like)
   - **Region:** Choose closest to your location
   - **Branch:** `main`
   - **Runtime:** `Node`
   - **Build Command:** 
     ```
     npm install && npm run build && cd client && npm install && npm run build
     ```
   - **Start Command:** 
     ```
     npm start
     ```
   - **Instance Type:** ✅ `Free`

7. **Scroll down to "Advanced"** and add environment variables:
   - Click **"Add Environment Variable"**
   - Variable 1:
     - Key: `NODE_ENV`
     - Value: `production`
   - Variable 2:
     - Key: `PORT`  
     - Value: `3001`

8. Click **"Create Web Service"**

9. **Wait** (3-5 minutes):
   - You'll see build logs scrolling
   - Status will change from "Building" → "Live"
   - Once live, you'll see a URL like: `https://mahjong-scoring.onrender.com`

---

## Step 4: Test Your App! ✅

1. Click the URL: `https://your-app-name.onrender.com`
2. **First load may take 30-60 seconds** (free tier wakes up from sleep)
3. You should see the Mahjong Scoring home page!
4. Test it:
   - Click "Start New Session"
   - Create a game with 4 players
   - Record some hands
   - Watch scores update!

---

## ✅ Success Checklist

- [ ] GitHub repo created and code pushed
- [ ] Render service created and deployed
- [ ] App URL is live and accessible
- [ ] Can create sessions
- [ ] Can record hands
- [ ] Scores calculate correctly

---

## 🎉 You're Done!

Your app is now live at: `https://your-app-name.onrender.com`

Share this URL with anyone you want to play mahjong with!

---

## 📝 Important Notes

### Free Tier Limitations:
- **Sleeps after 15 min of inactivity** - first request takes 30-60s to wake up
- **Database resets on each deploy** - all data is lost when you update the app
- **Limited to 750 hours/month** - basically always available

### Want to upgrade?
- **$7/month** for always-on service (no sleep)
- **Add PostgreSQL** for persistent data storage

---

## 🔧 Need to Update?

When you make changes:

```bash
git add -A
git commit -m "Your update message"
git push

# Render auto-deploys on push!
```

---

## 🆘 Troubleshooting

### "Build failed"
- Check Render logs for errors
- Ensure all dependencies are in `package.json`

### "502 Bad Gateway"  
- App is starting up (wait 30-60s)
- Check Render logs for startup errors

### Sessions/hands disappear
- **Normal on free tier** - database resets on deploy
- Upgrade to paid + PostgreSQL for persistence

---

**Your app is ready to share!** 🀄

Copy your Render URL and send it to your friends!
