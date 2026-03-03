# 🎉 Jornal Tatu — LIVE on Render

**Status**: ✅ **PRODUCTION LIVE**  
**Deployed**: 2026-03-03 09:07 GMT  
**Backend**: https://jornal-tatu-backend.onrender.com/

---

## What's Live

✅ **API Server** (Express.js on Render free tier)
✅ **News Fetching** (NewsAPI + Brave Search)
✅ **5 News Categories**:
- Bitcoin
- Guerras (International Conflicts)
- Política Internacional
- Política Brasileira
- Hotelaria (Hospitality)

✅ **30+ Articles Cached** (Bitcoin: 12, Guerras: 5+)
✅ **Daily Auto-Refresh** (00:00 PT via cron)
✅ **Static Frontend** (index.html at root)

---

## API Endpoints

### Health & Info
- `GET /` → Root (server info)
- `GET /api/health` → Server status
- `GET /api/categories` → List all categories
- `GET /api/stats` → Cache stats & refresh times

### News Fetching
- `GET /api/news/latest?limit=30` → Latest articles across all categories
- `GET /api/news/category/Bitcoin?refresh=true&limit=20` → Category news (auto-refreshes if needed)
- `POST /api/news/refresh` → Force refresh all categories (runs daily at 00:00)

### Example Requests

**Get Bitcoin news (fresh)**:
```bash
curl "https://jornal-tatu-backend.onrender.com/api/news/category/Bitcoin?refresh=true"
```

**Get latest across all categories**:
```bash
curl "https://jornal-tatu-backend.onrender.com/api/news/latest?limit=10"
```

**Check current stats**:
```bash
curl "https://jornal-tatu-backend.onrender.com/api/stats"
```

---

## Database

- **Type**: JSON file (articles.json) — pure JavaScript, zero native dependencies
- **Cache TTL**: 6 hours per category
- **Cleanup**: Old articles (>30 days) auto-deleted daily at 02:00
- **Auto-Refresh**: Every category refreshes daily at 00:00 PT

---

## Architecture

```
GitHub (lis-sil-grazi/jornaltatu)
    ↓ (push to main)
Render Webhook
    ↓ (builds & deploys)
Render Service (jornal-tatu-backend)
    ├── Express.js server (port 3001)
    ├── articles.json (persistent storage)
    ├── newsFetcher.js (NewsAPI + Brave)
    └── Cron jobs (midnight refresh + daily cleanup)
    ↓
Public API: https://jornal-tatu-backend.onrender.com/
```

---

## Troubleshooting & History

**Why JSON instead of SQLite?**
- better-sqlite3 requires native C++ compilation
- Render's environment doesn't have build tools
- JSON works everywhere, no dependencies, instant deploy

**Why Render?**
- Free tier (generous limits for MVP)
- Auto-deploys from GitHub
- Auto-scales if needed
- Simple configuration (render.yaml)

**Middleware Order (critical lesson)**
- ❌ Wrong: `express.static()` before API routes → catches /api/* as files
- ✅ Right: API routes first, then static serving, then SPA fallback

---

## Next Steps

1. **Polish frontend UI** — Current index.html is basic, can be prettier
2. **Add category filtering** — JavaScript in index.html to show one category at a time
3. **iOS/Android App** — Convert to React Native if needed (backend is API-first, ready for it)
4. **Webhook notifications** — WhatsApp alert when new articles arrive for specific categories
5. **Internationalization** — Support English + Portuguese

---

## Deployment Instructions (for next time)

### Manual Deployment
1. Push changes to GitHub:
   ```bash
   git add .
   git commit -m "your message"
   git push origin main
   ```

2. Render auto-detects `render.yaml` and deploys:
   - Runs: `cd backend && npm install`
   - Starts: `cd backend && npm start`
   - Service: https://jornal-tatu-backend.onrender.com/

### If Service Crashes
1. Check Render dashboard: https://dashboard.render.com
2. Look at build/runtime logs
3. If stuck: Rebuild manually from dashboard → **"New Deployment"** button

### Local Development
```bash
cd backend
npm install
npm start
# Runs on http://localhost:3001

# Test in another terminal:
curl http://localhost:3001/api/health
curl "http://localhost:3001/api/news/category/Bitcoin?refresh=true"
```

---

## Monitoring

**Auto-refresh Cron Job** (daily at 00:00 PT):
- Fetches fresh articles from NewsAPI/Brave for all 5 categories
- Inserts new articles into articles.json (duplicates ignored)
- Updates lastRefreshed timestamp
- Logs output to Render logs

**Cleanup Cron Job** (daily at 02:00 PT):
- Deletes articles older than 30 days
- Keeps database lean

---

## Contact
- GitHub: https://github.com/lis-sil-grazi/jornaltatu
- Backend Service: https://jornal-tatu-backend.onrender.com/
- Status: ✅ LIVE (as of 2026-03-03 09:07 GMT)

---

**Built with ⚡ by Lis**
