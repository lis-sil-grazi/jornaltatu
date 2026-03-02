# 🦔 Jornal Tatu

> **Notícias Premium Curadas Diariamente**

Jornal Tatu é uma plataforma de notícias que agrega e apresenta conteúdo curado de múltiplas fontes em categorias específicas: Bitcoin, Guerras, Política Internacional, Política Brasileira e Hotelaria.

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://lis-sil-grazi.github.io/jornaltatu/)
[![Backend Status](https://img.shields.io/badge/backend-operational-success)](#)
[![License](https://img.shields.io/badge/license-MIT-blue)](#)

---

## ✨ Features

### Phase 1 (Current)
- ✅ **Express.js Backend** - RESTful API with SQLite caching
- ✅ **Dual API Integration** - NewsAPI + Brave Search for redundancy
- ✅ **Smart Caching** - 6-hour TTL with automatic midnight refresh
- ✅ **React Frontend** - Modern, responsive interface using Vite
- ✅ **Category Navigation** - Bitcoin, Guerras, Política Internacional, Política Brasileira, Hotelaria
- ✅ **Mobile-First Design** - Optimized for all screen sizes
- ✅ **Auto-Cleanup** - Removes articles older than 7 days

### Coming Soon (Phase 2+)
- 🔜 User authentication & personalization
- 🔜 Bookmarks and saved articles
- 🔜 Email newsletter
- 🔜 Full-text search
- 🔜 Admin dashboard
- 🔜 Mobile app (React Native)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ ([Download](https://nodejs.org/))
- npm or yarn
- API Keys:
  - [NewsAPI](https://newsapi.org/register) (free: 100 req/day)
  - [Brave Search](https://brave.com/search/api/) (free: 2,000/month)

### Installation

```bash
# Clone the repository
git clone https://github.com/lis-sil-grazi/jornaltatu.git
cd jornaltatu

# Setup Backend
cd backend
npm install
cp .env.example .env
# Edit .env and add your API keys
npm start

# Setup Frontend (in a new terminal)
cd ../frontend
npm install
npm run dev
```

**Backend**: http://localhost:3001  
**Frontend**: http://localhost:3000

---

## 📁 Project Structure

```
jornaltatu/
├── backend/                 # Express API server
│   ├── server.js            # Main server & routes
│   ├── database.js          # SQLite database layer
│   ├── newsFetcher.js       # News API integrations
│   ├── news.db              # SQLite database (auto-created)
│   ├── .env                 # Environment variables (create from .env.example)
│   └── package.json
│
├── frontend/                # React application
│   ├── src/
│   │   ├── components/      # React components
│   │   │   └── NewsCard.jsx # Article card component
│   │   ├── api/
│   │   │   └── newsApi.js   # API client
│   │   ├── App.jsx          # Main app component
│   │   ├── main.jsx         # React entry point
│   │   └── styles.css       # Global styles
│   ├── index.html           # HTML template
│   ├── vite.config.js       # Vite configuration
│   └── package.json
│
├── DEPLOY.md                # Deployment guide
├── DESIGN-SYSTEM.md         # Brand & design specs
└── README.md                # This file
```

---

## 🔌 API Endpoints

### Backend (http://localhost:3001/api)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Health check & database stats |
| `GET` | `/news/latest?limit=30` | Latest news across all categories |
| `GET` | `/news/category/:name?limit=20` | News by category |
| `POST` | `/news/refresh` | Force refresh all categories |
| `GET` | `/categories` | List available categories |
| `GET` | `/stats` | Database statistics |

### Example Response

```json
{
  "success": true,
  "category": "Bitcoin",
  "count": 20,
  "articles": [
    {
      "id": 1,
      "category": "Bitcoin",
      "title": "Bitcoin ultrapassa US$100k...",
      "description": "Criptomoeda alcança marco...",
      "source": "Reuters",
      "url": "https://...",
      "imageUrl": "https://...",
      "publishedAt": "2026-03-02T08:00:00Z",
      "fetchedAt": 1709370000000
    }
  ]
}
```

---

## 🛠️ Technology Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **SQLite** (better-sqlite3) - Database
- **Axios** - HTTP client
- **node-cron** - Task scheduler
- **dotenv** - Environment variables

### Frontend
- **React 18** - UI library
- **Vite** - Build tool & dev server
- **Modern CSS** - No frameworks, pure CSS with variables

### APIs
- **NewsAPI** - News aggregation
- **Brave Search API** - Alternative news source

---

## ⚙️ Configuration

### Backend (.env)

```env
PORT=3001
NEWSAPI_KEY=your_newsapi_key_here
BRAVE_API_KEY=your_brave_api_key_here
```

### Category Search Queries

Defined in `backend/newsFetcher.js`:

```javascript
const CATEGORY_QUERIES = {
  Bitcoin: ['bitcoin cryptocurrency', 'bitcoin notícias', 'crypto market'],
  Guerras: ['guerra conflito internacional', 'war conflict', 'guerras mundo'],
  'Política Internacional': ['política internacional', 'international politics', 'geopolítica'],
  'Política Brasileira': ['política brasil', 'brazilian politics', 'congresso nacional'],
  Hotelaria: ['hotelaria turismo', 'hospitality industry', 'hotel news']
};
```

Add or modify categories by editing this object.

---

## 🎨 Design System

Jornal Tatu follows a minimalist, premium design philosophy inspired by Airbnb and The Guardian.

**Brand Colors:**
- Primary: `#1A1A1A` (Dark)
- Accent: `#6B4423` (Brown)
- Accent Light: `#8B5A2B`
- Background: `#FFFFFF` / `#F5F5F5`

**Typography:**
- Font: Inter (Google Fonts)
- Scale: 12px - 56px (modular scale)

See [DESIGN-SYSTEM.md](./DESIGN-SYSTEM.md) for full specs.

---

## 🚢 Deployment

### Quick Deploy to Railway (Backend)

```bash
cd backend
# Push to GitHub
# Connect Railway to your repo
# Set environment variables in Railway dashboard
# Deploy automatically
```

### Quick Deploy to GitHub Pages (Frontend)

```bash
cd frontend
npm run build
cp -r dist/* ../
git add . && git commit -m "Deploy frontend"
git push origin main
```

**Full deployment guide**: [DEPLOY.md](./DEPLOY.md)

---

## 🧪 Testing

```bash
# Backend
cd backend
npm start
# In another terminal:
curl http://localhost:3001/api/health

# Frontend
cd frontend
npm run dev
# Open http://localhost:3000
```

---

## 📊 Monitoring

### Health Check

```bash
curl http://localhost:3001/api/health
```

Response includes:
- Server status
- Database article count
- Categories list
- Last update timestamp

### Database Stats

```bash
curl http://localhost:3001/api/stats
```

Shows articles per category.

---

## 🐛 Troubleshooting

### "Failed to fetch news"

**Causes:**
1. Backend not running → `cd backend && npm start`
2. Wrong API URL → Check `frontend/src/api/newsApi.js`
3. CORS issue → Already configured in `backend/server.js`

### No Articles Showing

**Solutions:**
1. Trigger refresh: `POST http://localhost:3001/api/news/refresh`
2. Check API keys in `.env`
3. View backend logs for errors
4. Check if APIs have rate limits

### Backend Crashes

**Check:**
- Valid API keys in `.env`
- Node.js version (18+)
- Port 3001 available: `lsof -i :3001` (Unix) or `netstat -ano | findstr :3001` (Windows)

---

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Design inspired by [The Guardian](https://theguardian.com) and [Airbnb](https://airbnb.com)
- News data powered by [NewsAPI](https://newsapi.org) and [Brave Search](https://brave.com/search/api/)
- Built with ❤️ for premium news curation

---

## 📞 Contact

- **Website**: [jornaltatu.com](https://lis-sil-grazi.github.io/jornaltatu/)
- **GitHub**: [@lis-sil-grazi](https://github.com/lis-sil-grazi)
- **Issues**: [Report a bug](https://github.com/lis-sil-grazi/jornaltatu/issues)

---

**Made with 🦔 by the Jornal Tatu team**  
*Notícias Premium • Curadoria Diária • Zero Clickbait*
