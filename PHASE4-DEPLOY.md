# Jornal Tatu — Phase 4: Deploy to Production

**Status**: Ready (after Phase 3 complete)  
**Timeline**: 30-45 minutes  
**Tools Needed**: GitHub account, Vercel account, domain credentials

## Deploy Backend to Vercel

### Prerequisites
- [ ] Vercel account created (https://vercel.com)
- [ ] GitHub account with access to `lis-sil-grazi/jornaltatu`
- [ ] NewsAPI key in `.env` (already configured: `74ab4b21814447f186c40bd848b28798`)

### Steps

#### 1. Prepare Backend for Vercel
```bash
cd jornal-tatu-backend

# Create vercel.json (already exists)
# Verify .env contains NEWSAPI_KEY
# Verify package.json has "start" script
```

#### 2. Deploy Backend
```bash
# Option A: Via CLI
npm install -g vercel
vercel login
vercel --prod

# Option B: Via GitHub + Vercel Web UI
# 1. Push backend code to GitHub
# 2. Go to https://vercel.com/new
# 3. Select "Import Git Repository"
# 4. Choose lis-sil-grazi/jornaltatu
# 5. Configure environment variables:
#    - NEWSAPI_KEY=74ab4b21814447f186c40bd848b28798
# 6. Deploy
```

#### 3. Verify Deployment
```bash
# Test the deployed backend
curl https://jornal-tatu-backend.vercel.app/api/news/bitcoin

# Should return JSON with articles
# Status: success, count: 5, articles: [...]
```

#### 4. Update Frontend API Endpoint
In `jornaltatu/index.html`, change:
```javascript
// OLD:
const API_BASE = 'http://localhost:3001/api/news';

// NEW:
const API_BASE = 'https://jornal-tatu-backend.vercel.app/api/news';
```

---

## Deploy Frontend to GitHub Pages

### Prerequisites
- [ ] Repository: `lis-sil-grazi/jornaltatu` exists
- [ ] Branch: `main` is default
- [ ] All files committed and pushed

### Steps

#### 1. Push Updated Files to GitHub
```bash
cd jornaltatu

# Stage all changes
git add -A

# Commit
git commit -m "Jornal Tatu Phase 2 Complete: Dynamic frontend + Backend integration"

# Push to main
git push origin main
```

#### 2. Enable GitHub Pages
1. Go to `https://github.com/lis-sil-grazi/jornaltatu/settings`
2. Navigate to "Pages" (left sidebar)
3. Under "Source", select "Deploy from a branch"
4. Choose branch: `main`
5. Choose folder: `/ (root)`
6. Save

#### 3. Verify GitHub Pages Publishing
- Wait 2-3 minutes for GitHub to build and publish
- Check: `https://lis-sil-grazi.github.io/jornaltatu/`
- Should load the homepage

#### 4. Configure Custom Domain (if applicable)
If you own `jornaltatu.com`:
1. In GitHub Pages settings, add custom domain: `jornaltatu.com`
2. In domain registrar (Webtuga?), update DNS:
   - CNAME record pointing to `lis-sil-grazi.github.io`
   - Or use GitHub's provided IP addresses
3. Wait 24h for DNS propagation
4. GitHub will auto-enable HTTPS

---

## Post-Deploy Testing

### Test Live Backend
- [ ] Visit `https://jornal-tatu-backend.vercel.app/api/news/bitcoin` in browser
- [ ] Verify 5 articles return
- [ ] Check response includes: title, excerpt, url, source, publishedAt

### Test Live Frontend
- [ ] Visit `https://lis-sil-grazi.github.io/jornaltatu/` (or custom domain)
- [ ] Homepage loads
- [ ] Click each tab (Bitcoin, Guerras, Política Int'l, Brasil, Hotelaria)
- [ ] Articles load and display correctly
- [ ] Click "Ler artigo →" link opens article in new tab
- [ ] Timestamps display correctly (e.g., "2h atrás")
- [ ] Mobile responsive (test with DevTools)

### Monitor for Errors
- [ ] Open browser console (F12) → Console tab
- [ ] Should show no errors (no red X icons)
- [ ] API calls should succeed (200 status)

### CORS Configuration
If you see CORS errors:
1. Update backend `index.js` to allow frontend origin:
```javascript
app.use(cors({
  origin: ['https://lis-sil-grazi.github.io', 'http://localhost:8000'],
  credentials: true
}));
```
2. Re-deploy to Vercel
3. Test again

---

## Production Checklist

- [ ] Backend deployed to Vercel
- [ ] Frontend pushed to GitHub
- [ ] GitHub Pages enabled
- [ ] Custom domain configured (if applicable)
- [ ] API endpoint updated in frontend
- [ ] No console errors
- [ ] All 5 categories working
- [ ] Links open articles correctly
- [ ] Mobile responsive confirmed

## Rollback Plan (if needed)
1. **Backend**: Revert Vercel deployment (Vercel keeps git history)
2. **Frontend**: Revert last commit on GitHub, push again
3. **DNS**: Revert DNS records if domain issues

---

## Next Steps
- [ ] Phase 5: React Native App (future)
- [ ] Setup cron job for auto-refresh (every 6 hours)
- [ ] Monitor analytics (Google Analytics optional)
- [ ] Gather feedback from Silvia + Grazi

---

**🎉 Jornal Tatu is live!**
