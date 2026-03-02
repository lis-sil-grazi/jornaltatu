console.log('[DEBUG] Starting server...');

try {
  const express = require('express');
  console.log('[DEBUG] Express loaded');
  
  const cors = require('cors');
  console.log('[DEBUG] CORS loaded');
  
  const cron = require('node-cron');
  console.log('[DEBUG] Cron loaded');
  
  require('dotenv').config();
  console.log('[DEBUG] Dotenv loaded');
  
  const {
    insertArticle,
    getArticlesByCategory,
    getLatestArticles,
    needsRefresh,
    cleanupOldArticles,
    getStats
  } = require('./database');
  console.log('[DEBUG] Database module loaded');
  
  const { fetchCategoryNews, fetchAllCategories, CATEGORY_QUERIES } = require('./newsFetcher');
  console.log('[DEBUG] NewsFetcher module loaded');
  
  const app = express();
  const PORT = process.env.PORT || 3001;
  
  // Middleware
  app.use(cors());
  app.use(express.json());
  console.log('[DEBUG] Middleware configured');
  
  // Request logging
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });
  
  // Routes
  app.get('/api/health', (req, res) => {
    console.log('[DEBUG] Health endpoint called');
    const stats = getStats();
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: stats,
      categories: Object.keys(CATEGORY_QUERIES)
    });
  });
  console.log('[DEBUG] Health route registered');
  
  app.get('/api/news/latest', (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 30;
      const articles = getLatestArticles(limit);
      res.json({
        success: true,
        count: articles.length,
        articles
      });
    } catch (error) {
      console.error('[API] Error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch latest news'
      });
    }
  });
  console.log('[DEBUG] Latest route registered');
  
  app.get('/api/news/category/:category', async (req, res) => {
    try {
      const { category } = req.params;
      const limit = parseInt(req.query.limit) || 20;
      
      const categoryKey = Object.keys(CATEGORY_QUERIES).find(
        key => key.toLowerCase() === category.toLowerCase()
      );
      
      if (!categoryKey) {
        return res.status(404).json({
          success: false,
          error: 'Category not found'
        });
      }
      
      const articles = getArticlesByCategory(categoryKey, limit);
      res.json({
        success: true,
        category: categoryKey,
        count: articles.length,
        articles
      });
    } catch (error) {
      console.error('[API] Error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch category news'
      });
    }
  });
  console.log('[DEBUG] Category route registered');
  
  app.post('/api/news/refresh', async (req, res) => {
    try {
      console.log('[API] Starting refresh...');
      const results = await fetchAllCategories();
      const summary = {};
      
      for (const [category, articles] of Object.entries(results)) {
        let inserted = 0;
        for (const article of articles) {
          try {
            const result = insertArticle(article);
            if (result.changes > 0) inserted++;
          } catch (error) {
            // Ignore duplicates
          }
        }
        summary[category] = { fetched: articles.length, inserted };
      }
      
      res.json({
        success: true,
        message: 'All categories refreshed',
        summary
      });
    } catch (error) {
      console.error('[API] Refresh error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to refresh news'
      });
    }
  });
  console.log('[DEBUG] Refresh route registered');
  
  app.get('/api/categories', (req, res) => {
    res.json({
      success: true,
      categories: Object.keys(CATEGORY_QUERIES)
    });
  });
  console.log('[DEBUG] Categories route registered');
  
  app.get('/api/stats', (req, res) => {
    try {
      const stats = getStats();
      res.json({
        success: true,
        stats
      });
    } catch (error) {
      console.error('[API] Error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch statistics'
      });
    }
  });
  console.log('[DEBUG] Stats route registered');
  
  // Start server
  app.listen(PORT, () => {
    console.log(`\n✅ Server running on http://localhost:${PORT}`);
    console.log(`\n📋 Test with: node -e "require('axios').get('http://localhost:${PORT}/api/health').then(r=>console.log(r.data))"`);
  });
  
} catch (error) {
  console.error('[FATAL ERROR]:', error);
  process.exit(1);
}
