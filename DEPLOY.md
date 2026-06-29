# 🀄 Deploy Mahjong Scoring App

This guide will help you deploy the app to **Render** (free hosting).

---

## 🚀 Option 1: Deploy to Render (Recommended - FREE)

### Step 1: Push to GitHub

1. **Create a GitHub repository:**
   - Go to https://github.com/new
   - Repository name: `mahjong-scoring-app`
   - Make it **Public** (required for free Render)
   - **Do NOT** initialize with README (we already have files)
   - Click **Create repository**

2. **Push your code:**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/mahjong-scoring-app.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Deploy on Render

1. **Go to Render:** https://render.com
2. **Sign up/Login** (use GitHub account for easy linking)
3. Click **New +** → **Web Service**
4. **Connect your GitHub repo:**
   - Click "Connect account" if needed
   - Find `mahjong-scoring-app`
   - Click **Connect**

5. **Configure the service:**
   - **Name:** `mahjong-scoring`
   - **Region:** Choose closest to you
   - **Branch:** `main`
   - **Runtime:** `Node`
   - **Build Command:** `npm install && npm run build && cd client && npm run build`
   - **Start Command:** `npm start`
   - **Instance Type:** `Free`

6. **Environment Variables:**
   Click "Advanced" → Add these:
   - `NODE_ENV` = `production`
   - `PORT` = `3001`

7. Click **Create Web Service**

8. **Wait for deployment** (2-5 minutes)
   - You'll see build logs
   - Once done, you'll get a URL like: `https://mahjong-scoring.onrender.com`

### Step 3: Access Your App

Your app will be live at: `https://YOUR-APP-NAME.onrender.com`

**Note:** Free tier apps sleep after 15 min of inactivity. First request may take 30-60 seconds to wake up.

---

## 🚀 Option 2: Deploy to Railway (Alternative - FREE)

1. **Go to Railway:** https://railway.app
2. **Sign up/Login** with GitHub
3. Click **New Project** → **Deploy from GitHub repo**
4. Select `mahjong-scoring-app`
5. Railway auto-detects Node.js:
   - Build Command: `npm install && npm run build && cd client && npm run build`
   - Start Command: `npm start`
6. Add environment variables:
   - `NODE_ENV` = `production`
7. Click **Deploy**
8. Get your URL from the project dashboard

---

## 🚀 Option 3: Deploy to Vercel (Frontend) + Render (Backend)

### Backend on Render:
1. Follow Render steps above for backend only
2. Note the backend URL (e.g., `https://mahjong-api.onrender.com`)

### Frontend on Vercel:
1. Go to https://vercel.com
2. **Import Git Repository** → Select your GitHub repo
3. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `client`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. **Environment Variables:**
   - `VITE_API_URL` = `https://your-backend-url.onrender.com/api`
5. Click **Deploy**

---

## 🚀 Option 4: Self-Host (VPS/DigitalOcean/AWS)

If you have a VPS:

```bash
# On your server
git clone https://github.com/YOUR_USERNAME/mahjong-scoring-app.git
cd mahjong-scoring-app

# Install dependencies
npm install
cd client && npm install && cd ..

# Build
npm run build
cd client && npm run build && cd ..

# Set environment
export NODE_ENV=production
export PORT=3001

# Run with PM2 (process manager)
npm install -g pm2
pm2 start npm --name "mahjong-api" -- start
pm2 save
pm2 startup
```

Setup Nginx reverse proxy:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## ✅ Verify Deployment

Once deployed, test these:

1. **Health check:** `https://your-url.com/api/health`
   - Should return: `{"status":"ok","message":"Mahjong Scoring API is running"}`

2. **Home page:** `https://your-url.com`
   - Should show "Start New Session" button

3. **Create session:**
   - Click "Start New Session"
   - Enter name and 4 players
   - Should redirect to session page

4. **Record hand:**
   - Click "Record Hand"
   - Submit a hand
   - Scores should update

---

## 🔧 Troubleshooting

### Database resets on every deploy
**Render/Railway:** SQLite data is lost on redeploy (ephemeral storage)

**Solution:** Use PostgreSQL for persistence:
1. Add database on Render/Railway
2. Update `server/database.ts` to use PostgreSQL
3. Install `pg` package: `npm install pg`

### CORS errors
Add your frontend URL to backend CORS:
```typescript
// server/index.ts
app.use(cors({
  origin: ['https://your-frontend-url.com', 'http://localhost:3000']
}));
```

### 404 on refresh
Frontend routing issue - ensure your hosting serves `index.html` for all routes.

**Render:** Already configured in `render.yaml`

### Images not showing
Ensure `uploads/` directory exists and is writable:
```bash
mkdir -p uploads
chmod 755 uploads
```

---

## 📊 Cost Estimates

- **Render Free:** $0/month (sleeps after 15min inactivity)
- **Render Paid:** $7/month (always on)
- **Railway Free:** $0/month with limits
- **Vercel Free:** $0/month for frontend
- **DigitalOcean:** $6/month (full VPS control)

---

## 🎯 Recommended Setup

**For Testing/Personal Use:**
- Render Free tier ✅
- Easy, fast, no credit card needed

**For Production:**
- Render Paid ($7/mo) ✅
- Add PostgreSQL database
- Always-on, reliable

---

## 🚀 Quick Deploy Commands

```bash
# 1. Commit changes
git add -A
git commit -m "Ready for deployment"

# 2. Create GitHub repo (via web)
# Then:
git remote add origin https://github.com/YOUR_USERNAME/mahjong-scoring-app.git
git push -u origin main

# 3. Deploy on Render (via web)
# Follow steps above

# 4. Access your app!
```

---

**Need help?** Check logs on Render dashboard or open an issue on GitHub.

🀄 **Happy deploying!**
