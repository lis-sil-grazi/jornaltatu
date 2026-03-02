# 🐢 Jornal Tatu — Notícias Curadas Diariamente

Premium news curator featuring Bitcoin, international conflicts, global politics, Brazilian politics, and hospitality news — all curated daily with top 5 articles per category.

**Status**: Phase 2 Complete (Frontend + Backend Integration Ready) | Phase 3-4 (Deploy) In Progress

---

## Features

✅ **5 Curated Categories**
- 🔷 Bitcoin (crypto & blockchain)
- ⚔️ Guerras (international conflicts)
- 🌍 Política Internacional (world politics)
- 🇧🇷 Política Brasileira (Brazil politics)  
- 🏨 Hotelaria (hospitality & tourism)

✅ **Dynamic News Feed**
- Real-time integration with NewsAPI
- Top 5 articles per category
- 6-hour cache TTL (refresh 4x daily)
- Fallback to cached data if API fails

✅ **Professional UI**
- Clean, minimal design (Inter typography)
- Tab-based navigation
- Mobile responsive (single column on mobile)
- Loading skeletons
- Clickable links to original articles

✅ **Backend Architecture**
- Express.js API (Node.js)
- SQLite database with caching
- CORS enabled
- Error handling + graceful degradation

---

## Tech Stack

### Backend
- **Node.js** + **Express.js** (API server)
- **SQLite3** (article caching)
- **node-fetch** (HTTP requests)
- **dotenv** (environment variables)
- Deployed on **Vercel** (serverless)

### Frontend  
- **HTML5** + **CSS3** (semantic, responsive)
- **Vanilla JavaScript** (no framework)
- Deployed on **GitHub Pages**

### Data Sources
- **NewsAPI** (free tier: 100 requests/day)
- **Brave Search** (alternative, no key needed)

---

## Project Structure

```
jornaltatu/
├── index.html              # Main website
├── test-integration.html   # Integration tests
├── README.md              # This file
├── PHASE3-UIPOLISH.md     # Phase 3 checklist
├── PHASE4-DEPLOY.md       # Phase 4 deployment guide
├── jornal-tatu-backend/   # Express backend (separate)
│   ├── index.js
│   ├── package.json
│   ├── .env               # NewsAPI key
│   ├── database/          # SQLite init
│   ├── routes/            # API routes
│   ├── services/          # NewsAPI service
│   └── vercel.json        # Vercel config
└── (other assets)
```

---

## Quick Start (Local Development)

### 1. Start Backend
```bash
cd jornal-tatu-backend
npm install
npm start
# Runs on http://localhost:3001
```

### 2. Start Frontend
```bash
# In another terminal
cd jornaltatu
python -m http.server 8000
# Open http://localhost:8000
```

### 3. Test Integration
```bash
# In browser, open http://localhost:8000/test-integration.html
# Should show all 5 categories working
```

---

## API Endpoints

All endpoints return JSON with articles (title, excerpt, url, source, publishedAt).

```
GET /                           # Health check
GET /api/news/:category         # Get articles for category
  - bitcoin
  - wars
  - world-politics
  - brazil-politics
  - hospitality

GET /api/news/refresh/all       # Force refresh all categories
```

**Example Response**:
```json
{
  "success": true,
  "category": "bitcoin",
  "count": 5,
  "articles": [
    {
      "category": "bitcoin",
      "title": "Bitcoin Breaks $100K",
      "excerpt": "Major institutions buying BTC...",
      "url": "https://example.com/article",
      "source": "Reuters",
      "publishedAt": "2026-03-02T08:30:00Z"
    },
    // ... 4 more articles
  ]
}
```

---

## Deployment

### Backend → Vercel
```bash
cd jornal-tatu-backend
vercel --prod
```

See `PHASE4-DEPLOY.md` for detailed steps.

### Frontend → GitHub Pages
```bash
git add -A
git commit -m "Deploy Jornal Tatu"
git push origin main
# GitHub Pages auto-builds from root
```

---

## Configuration

### NewsAPI Key
In `jornal-tatu-backend/.env`:
```
NEWSAPI_KEY=74ab4b21814447f186c40bd848b28798
PORT=3001
```

### Frontend API Endpoint
In `index.html`, update `API_BASE`:
```javascript
const API_BASE = 'https://your-backend.vercel.app/api/news';
```

---

## Performance

- **Cache TTL**: 6 hours (4 refreshes/day = 400 API calls/day, well within free tier)
- **Load time**: <1s (skeletons show immediately, content loads async)
- **First byte**: <200ms (Vercel edge network)
- **Mobile**: <2s on 4G

---

## Roadmap

| Phase | Task | Status |
|-------|------|--------|
| 1 | Backend + APIs | ✅ Complete |
| 2 | Frontend integration | ✅ Complete |
| 3 | UI polish + mobile test | ⏳ In Progress |
| 4 | Deploy to production | ⏳ Ready |
| 5 | React Native app | 📅 Future |
| 6 | Daily cron jobs | 📅 Future |
| 7 | Analytics + feedback | 📅 Future |

---

## Testing Checklist

See `PHASE3-UIPOLISH.md` and `PHASE4-DEPLOY.md` for comprehensive checklists.

### Quick Test
```bash
# Terminal 1: Backend
cd jornal-tatu-backend && npm start

# Terminal 2: Frontend  
cd jornaltatu && python -m http.server 8000

# Browser: http://localhost:8000
# Click each tab → articles should load
# Click "Ler artigo →" → opens article in new tab
```

---

## Troubleshooting

### "Cannot GET /api/news/bitcoin"
- Backend not running? Start with `npm start` in `jornal-tatu-backend/`
- Port 3001 in use? Kill process: `lsof -ti:3001 | xargs kill -9`

### CORS errors in browser console
- Backend not allowing frontend origin
- Check `index.js` has `app.use(cors())`
- Update if deploying to different domain

### Articles not loading  
- Check browser DevTools Console for errors
- Verify API response: `curl http://localhost:3001/api/news/bitcoin`
- Check NewsAPI quota: `https://newsapi.org/account`

### Timestamps showing "undefined"
- Article missing `publishedAt` field
- Check NewsAPI response format in `newsService.js`

---

## License

Created for Silvia & Grazi. © 2026 Jornal Tatu.

---

## Questions?

For issues or improvements, open a GitHub issue or contact the maintainers.

**Next Step**: Read `PHASE4-DEPLOY.md` for live deployment instructions.
