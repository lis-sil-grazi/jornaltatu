# Jornal Tatu - Production Deployment Guide

## Current Status
✅ **Development**: Fully functional locally
✅ **Backend**: Express.js + SQLite, ready for production
✅ **Frontend**: Static HTML, GitHub Pages ready
✅ **GitHub**: All files committed and pushed

## Production Deployment (Choose One)

### Option 1: Railway.app (Recommended - Fastest)

1. **Connect GitHub**
   - Go to https://railway.app
   - Sign in with GitHub
   - Select `lis-sil-grazi/jornaltatu` repo

2. **Configure Backend**
   - Click "New Service" → Deploy from GitHub
   - Select branch: `main`
   - Choose root directory: `backend/`
   - Set Environment Variables:
     ```
     NODE_ENV=production
     NEWSAPI_KEY=74ab4b21814447f186c40bd848b28798
     BRAVE_API_KEY=demo_key
     PORT=3001
     ```

3. **Get API URL**
   - Copy the generated URL (e.g., `https://jornal-tatu-api.railway.app`)
   - Note this for step 4

4. **Update Frontend API Endpoint**
   - Edit `index.html`
   - Find: `const API_BASE = ...`
   - Change to: `const API_BASE = 'https://your-railway-url/api/news'`
   - Commit and push

5. **Deploy Frontend to GitHub Pages**
   - Commit changes to `main`
   - Go to GitHub Settings → Pages
   - Source: `main` branch, root folder
   - Custom domain: `jornaltatu.com` (DNS already configured)

### Option 2: Render.com (Free Tier)

1. **Deploy Backend**
   - Go to https://render.com
   - Connect GitHub account
   - New "Web Service"
   - Repository: `jornaltatu`
   - Root directory: `backend/`
   - Build command: `npm install`
   - Start command: `node server.js`
   - Environment: Node.js
   - Plan: Free

2. **Set Environment Variables**
   ```
   NODE_ENV=production
   NEWSAPI_KEY=74ab4b21814447f186c40bd848b28798
   BRAVE_API_KEY=demo_key
   ```

3. **Get Service URL**
   - Copy your Render service URL
   - Update `index.html` API endpoint

4. **Deploy Frontend**
   - Render will auto-deploy from GitHub after push
   - Frontend serves from GitHub Pages

### Option 3: Vercel (Original Plan)

1. **Deploy Backend**
   - `npm install -g vercel`
   - `cd backend && vercel`
   - Follow prompts
   - Note the generated URL

2. **Update Frontend**
   - Edit `index.html` with new API URL
   - Push to GitHub

3. **Frontend auto-deploys** to GitHub Pages

## Environment Setup

### Backend Requirements
- Node.js 18+
- Environment variables:
  - `NEWSAPI_KEY` — Your NewsAPI.org key
  - `BRAVE_API_KEY` — Your Brave Search key
  - `NODE_ENV` — Set to "production"
  - `PORT` — Default 3001

### Frontend Requirements
- Static HTML hosting (GitHub Pages, Netlify, Vercel, etc.)
- Update `API_BASE` variable to point to production backend

## Local Testing

```bash
# Terminal 1: Start backend
cd backend
npm install
npm start

# Terminal 2: Start frontend
npm install -g http-server
cd ..
http-server -p 8080 --cors

# Visit http://localhost:8080
```

## Verification Checklist

- [ ] Backend API responding to `/api/health`
- [ ] All 5 categories returning news:
  - [ ] Bitcoin
  - [ ] Guerras
  - [ ] Política Internacional
  - [ ] Política Brasileira
  - [ ] Hotelaria
- [ ] Frontend loads in browser
- [ ] News cards display with images
- [ ] Category tabs work
- [ ] Links open correctly
- [ ] Mobile responsive

## DNS Configuration

Custom domain already configured:
- **Domain**: jornaltatu.com
- **CNAME**: Points to GitHub Pages or your hosting service
- **Status**: Active

## Troubleshooting

**API returning "Endpoint not found"**
- Check that category name matches exactly (case-sensitive)
- Ensure backend is running and accessible

**Frontend not loading news**
- Check browser console for CORS errors
- Verify `API_BASE` URL is correct in `index.html`
- Ensure backend is running

**Categories missing accents in response**
- Unicode encoding issue — update database
- Re-seed demo data: `node backend/seed-demo-data.js`

## Next Steps

1. Choose deployment option (Railway recommended)
2. Deploy backend service
3. Update `index.html` with production API URL
4. Deploy frontend to GitHub Pages
5. Test all categories
6. Monitor error logs

---

**Status**: Ready for production deployment  
**Last updated**: 2026-03-03  
**Silvia approval required** before going live
