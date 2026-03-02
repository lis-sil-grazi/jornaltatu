# Jornal Tatu - Deployment Guide

## Phase 1: Express Backend + React Frontend

This guide covers deploying the Jornal Tatu backend (Express + SQLite) and frontend (React + Vite) to production.

---

## 📦 Project Structure

```
jornaltatu/
├── backend/           # Express API server
│   ├── server.js      # Main server file
│   ├── database.js    # SQLite database layer
│   ├── newsFetcher.js # News API integrations
│   ├── news.db        # SQLite database (auto-created)
│   ├── .env           # Environment variables (create this)
│   └── package.json   # Dependencies
├── frontend/          # React application
│   ├── src/           # React components
│   ├── dist/          # Build output (generated)
│   ├── vite.config.js # Vite configuration
│   └── package.json   # Dependencies
└── index.html         # Legacy static site (keep for reference)
```

---

## 🚀 Deployment Options

### Option 1: Railway (Recommended for Backend)

**Why Railway:**
- Free tier available ($5 credit monthly)
- Built-in PostgreSQL/SQLite support
- Automatic deployments from GitHub
- Environment variable management

**Steps:**

1. **Prepare Backend for Railway**
   ```bash
   cd backend
   # Ensure package.json has correct start script
   ```

2. **Create `railway.toml` in backend/**
   ```toml
   [build]
   builder = "NIXPACKS"
   
   [deploy]
   startCommand = "npm start"
   healthcheckPath = "/api/health"
   restartPolicyType = "ON_FAILURE"
   ```

3. **Deploy to Railway**
   - Sign up at [railway.app](https://railway.app)
   - Create new project → Deploy from GitHub
   - Select `jornaltatu` repo
   - Set root directory: `/backend`
   - Add environment variables:
     ```
     NEWSAPI_KEY=your_newsapi_key
     BRAVE_API_KEY=your_brave_api_key
     PORT=3001
     ```
   - Click Deploy

4. **Get your backend URL**: `https://your-project.railway.app`

---

### Option 2: Vercel (Alternative Backend Hosting)

**Note**: Vercel is serverless - SQLite won't persist between requests. Use PostgreSQL adapter or Railway instead.

---

### Option 3: Self-Hosted (VPS/DigitalOcean)

**Requirements:**
- Ubuntu 22.04+ server
- Node.js 18+
- PM2 (process manager)
- Nginx (reverse proxy)

**Steps:**

1. **Install Dependencies**
   ```bash
   # On your server
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   sudo npm install -g pm2
   ```

2. **Clone & Setup**
   ```bash
   git clone https://github.com/lis-sil-grazi/jornaltatu.git
   cd jornaltatu/backend
   npm install --production
   ```

3. **Create `.env` file**
   ```bash
   nano .env
   ```
   Add:
   ```env
   PORT=3001
   NEWSAPI_KEY=your_key
   BRAVE_API_KEY=your_key
   ```

4. **Start with PM2**
   ```bash
   pm2 start server.js --name jornal-tatu-backend
   pm2 save
   pm2 startup
   ```

5. **Configure Nginx**
   ```nginx
   server {
       listen 80;
       server_name api.jornaltatu.com;
       
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

## 🌐 Frontend Deployment

### Option 1: GitHub Pages (Current Setup)

**Steps:**

1. **Build Frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Update Backend URL in Production**
   
   Edit `frontend/src/api/newsApi.js`:
   ```javascript
   const API_BASE = import.meta.env.DEV 
     ? 'http://localhost:3001/api' 
     : 'https://your-backend-url.railway.app/api'; // Update this
   ```

3. **Rebuild**
   ```bash
   npm run build
   ```

4. **Copy `dist/` to GitHub Pages**
   ```bash
   # Option A: Replace root index.html
   cp -r dist/* ../
   git add .
   git commit -m "Deploy React frontend"
   git push origin main
   ```

   **Option B: Use `gh-pages` branch**
   ```bash
   npm install -D gh-pages
   ```
   
   Add to `package.json`:
   ```json
   "scripts": {
     "deploy": "vite build && gh-pages -d dist"
   }
   ```
   
   Then:
   ```bash
   npm run deploy
   ```

5. **Configure GitHub Pages**
   - Go to repository Settings → Pages
   - Source: Deploy from branch `gh-pages` (if using option B)
   - Custom domain (optional): `jornaltatu.com`

---

### Option 2: Vercel (Alternative Frontend)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   cd frontend
   vercel --prod
   ```

3. **Configure**
   - Set build command: `npm run build`
   - Output directory: `dist`
   - Environment variable: `VITE_API_URL=https://your-backend.railway.app/api`

---

## 🔐 Environment Variables

### Backend (.env)

```env
# Server
PORT=3001

# News APIs
NEWSAPI_KEY=your_newsapi_key_here
BRAVE_API_KEY=your_brave_api_key_here
```

### How to Get API Keys

1. **NewsAPI**
   - Visit: https://newsapi.org/register
   - Free tier: 100 requests/day
   - Copy API key to `.env`

2. **Brave Search API**
   - Visit: https://brave.com/search/api/
   - Free tier: 2,000 queries/month
   - Copy API key to `.env`

---

## 🗄️ Database

### SQLite (Default)

- File: `backend/news.db`
- Auto-created on first run
- Persistent storage for articles
- **Backup command**: `cp news.db news.db.backup`

### Migration to PostgreSQL (Optional)

If using Railway with PostgreSQL:

1. Replace `better-sqlite3` with `pg`
   ```bash
   npm uninstall better-sqlite3
   npm install pg
   ```

2. Update `database.js` to use `pg` instead of SQLite

---

## ✅ Health Checks

### Backend Health Endpoint

```bash
curl https://your-backend.railway.app/api/health
```

**Expected Response:**
```json
{
  "status": "healthy",
  "timestamp": "2026-03-02T09:30:00.000Z",
  "database": {
    "total": 120,
    "byCategory": [
      {"category": "Bitcoin", "count": 24},
      {"category": "Guerras", "count": 18}
    ]
  },
  "categories": ["Bitcoin", "Guerras", "Política Internacional", "Política Brasileira", "Hotelaria"]
}
```

---

## 🔄 CI/CD (Optional)

### GitHub Actions for Auto-Deploy

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy Jornal Tatu

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: cd backend && npm ci
      # Railway auto-deploys on git push

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: cd frontend && npm ci && npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./frontend/dist
```

---

## 📊 Monitoring

### Backend Logs

**Railway:**
- Dashboard → Project → Logs tab

**Self-hosted (PM2):**
```bash
pm2 logs jornal-tatu-backend
pm2 monit
```

### Frontend Analytics

Add Google Analytics or Plausible to `frontend/index.html`:

```html
<!-- In <head> -->
<script defer data-domain="jornaltatu.com" src="https://plausible.io/js/script.js"></script>
```

---

## 🐛 Troubleshooting

### Backend won't start

1. Check logs: `pm2 logs` or Railway dashboard
2. Verify `.env` file exists and has valid API keys
3. Test locally: `npm start`
4. Check port availability: `lsof -i :3001`

### Frontend shows "Failed to fetch news"

1. Check backend is running: `curl https://backend-url/api/health`
2. Verify CORS is enabled (it is by default in `server.js`)
3. Check API_BASE URL in `newsApi.js`
4. Open browser DevTools → Network tab

### No news showing up

1. Trigger manual refresh: `POST /api/news/refresh`
2. Check API keys are valid
3. Check database: `sqlite3 news.db "SELECT COUNT(*) FROM articles;"`
4. Review cron job logs

---

## 🔒 Security Checklist

- [ ] Never commit `.env` files (they're in `.gitignore`)
- [ ] Use HTTPS for production (Railway provides automatically)
- [ ] Rate limit API endpoints (add `express-rate-limit`)
- [ ] Sanitize user inputs (if adding search later)
- [ ] Keep dependencies updated: `npm audit fix`

---

## 📈 Performance Tips

1. **Enable Compression**
   ```bash
   npm install compression
   ```
   
   In `server.js`:
   ```javascript
   const compression = require('compression');
   app.use(compression());
   ```

2. **Cache Headers**
   ```javascript
   app.use((req, res, next) => {
     res.set('Cache-Control', 'public, max-age=300'); // 5 min
     next();
   });
   ```

3. **CDN for Frontend** (GitHub Pages already uses Fastly CDN)

---

## 🎯 Next Steps (Phase 2)

- [ ] Add user authentication
- [ ] Implement bookmarks/favorites
- [ ] Email newsletter integration
- [ ] Search functionality
- [ ] Admin dashboard for content curation
- [ ] Mobile app (React Native)

---

## 📞 Support

- **Repository**: https://github.com/lis-sil-grazi/jornaltatu
- **Issues**: https://github.com/lis-sil-grazi/jornaltatu/issues

---

**Last Updated**: March 2, 2026  
**Version**: Phase 1.0
