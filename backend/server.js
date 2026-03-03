const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const path = require('path');
require('dotenv').config();

const {
  insertArticle,
  getArticlesByCategory,
  getLatestArticles,
  needsRefresh,
  cleanupOldArticles,
  getStats
} = require('./database');

const { fetchCategoryNews, fetchAllCategories, CATEGORY_QUERIES } = require('./newsFetcher');
const { processArticles } = require('./translationService');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../')));

// Request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  const stats = getStats();
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    database: stats,
    categories: Object.keys(CATEGORY_QUERIES)
  });
});

/**
 * Get latest news across all categories
 */
app.get('/api/news/latest', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 30;
    const articles = getLatestArticles(limit);
    
    // TODO: Translate to Portuguese + add sarcasm
    // const translatedArticles = await processArticles(articles);
    
    res.json({
      success: true,
      count: articles.length,
      articles: articles,
      note: 'Tradução em progresso... Stay tuned!'
    });
  } catch (error) {
    console.error('[API] Error fetching latest:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch latest news'
    });
  }
});

/**
 * Get news by category
 */
app.get('/api/news/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const limit = parseInt(req.query.limit) || 20;
    const forceRefresh = req.query.refresh === 'true';

    // Normalize category name
    const categoryKey = Object.keys(CATEGORY_QUERIES).find(
      key => key.toLowerCase() === category.toLowerCase()
    );

    if (!categoryKey) {
      return res.status(404).json({
        success: false,
        error: 'Category not found',
        availableCategories: Object.keys(CATEGORY_QUERIES)
      });
    }

    // Check if refresh is needed (or forced)
    if (forceRefresh || needsRefresh(categoryKey)) {
      console.log(`[API] Refreshing ${categoryKey}...`);
      
      const articles = await fetchCategoryNews(categoryKey);
      
      // Insert articles into database
      let inserted = 0;
      for (const article of articles) {
        try {
          const result = insertArticle(article);
          if (result.changes > 0) inserted++;
        } catch (error) {
          console.error('[API] Error inserting article:', error.message);
        }
      }
      
      console.log(`[API] Inserted ${inserted} new articles for ${categoryKey}`);
    }

    // Get articles from database
    const articles = getArticlesByCategory(categoryKey, limit);
    
    // TODO: Translate to Portuguese + add sarcasm
    // For now, returning English articles with translation flags
    // const translatedArticles = await processArticles(articles);
    
    res.json({
      success: true,
      category: categoryKey,
      count: articles.length,
      articles: articles,
      note: 'De Casa Tatu para sua casa. Tradução em progresso...'
    });
  } catch (error) {
    console.error('[API] Error fetching category:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch category news'
    });
  }
});

/**
 * Force refresh all categories
 */
app.post('/api/news/refresh', async (req, res) => {
  try {
    console.log('[API] Starting manual refresh of all categories...');
    
    const results = await fetchAllCategories();
    const summary = {};

    for (const [category, articles] of Object.entries(results)) {
      let inserted = 0;
      for (const article of articles) {
        try {
          const result = insertArticle(article);
          if (result.changes > 0) inserted++;
        } catch (error) {
          console.error(`[API] Error inserting article for ${category}:`, error.message);
        }
      }
      summary[category] = { fetched: articles.length, inserted };
    }

    console.log('[API] Manual refresh completed');
    
    res.json({
      success: true,
      message: 'All categories refreshed',
      summary,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('[API] Error during refresh:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to refresh news'
    });
  }
});

/**
 * Get available categories
 */
app.get('/api/categories', (req, res) => {
  res.json({
    success: true,
    categories: Object.keys(CATEGORY_QUERIES)
  });
});

/**
 * Database statistics
 */
app.get('/api/stats', (req, res) => {
  try {
    const stats = getStats();
    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('[API] Error fetching stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch statistics'
    });
  }
});

// SPA fallback: serve index.html for non-API routes
app.use((req, res) => {
  if (!req.path.startsWith('/api/')) {
    res.sendFile(path.join(__dirname, '../index.html'));
  } else {
    res.status(404).json({
      success: false,
      error: 'Endpoint not found'
    });
  }
});

// Error handler
app.use((err, req, res, next) => {
  console.error('[Server] Error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

/**
 * Scheduled Tasks
 */

// Auto-refresh all categories at midnight (00:00)
cron.schedule('0 0 * * *', async () => {
  console.log('[Cron] Starting midnight auto-refresh...');
  try {
    const results = await fetchAllCategories();
    for (const [category, articles] of Object.entries(results)) {
      for (const article of articles) {
        try {
          insertArticle(article);
        } catch (error) {
          // Ignore duplicate errors
        }
      }
    }
    console.log('[Cron] Midnight auto-refresh completed');
  } catch (error) {
    console.error('[Cron] Error during auto-refresh:', error);
  }
});

// Cleanup old articles daily at 02:00
cron.schedule('0 2 * * *', () => {
  console.log('[Cron] Starting daily cleanup...');
  cleanupOldArticles();
  console.log('[Cron] Daily cleanup completed');
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Jornal Tatu Backend Server`);
  console.log(`📡 API running on http://localhost:${PORT}`);
  console.log(`🗄️  Database: SQLite (news.db)`);
  console.log(`📰 Categories: ${Object.keys(CATEGORY_QUERIES).join(', ')}`);
  console.log(`\n📋 Endpoints:`);
  console.log(`   GET  /api/health`);
  console.log(`   GET  /api/news/latest`);
  console.log(`   GET  /api/news/category/:category`);
  console.log(`   POST /api/news/refresh`);
  console.log(`   GET  /api/categories`);
  console.log(`   GET  /api/stats`);
  console.log(`\n⏰ Cron Jobs:`);
  console.log(`   - Auto-refresh: Daily at 00:00`);
  console.log(`   - Cleanup: Daily at 02:00\n`);
});
