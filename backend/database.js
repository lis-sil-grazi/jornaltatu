const fs = require('fs');
const path = require('path');

// Database file path
const DB_FILE = path.join(__dirname, 'articles.json');
const CACHE_TTL = 6 * 60 * 60 * 1000; // 6 hours

// Initialize/load database
function loadDatabase() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('[Database] Error loading database:', error.message);
  }
  return {
    articles: [],
    lastUpdated: {}
  };
}

let db = loadDatabase();

// Save database to file
function saveDatabase() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
  } catch (error) {
    console.error('[Database] Error saving database:', error.message);
  }
}

/**
 * Insert or ignore article (prevents duplicates)
 */
function insertArticle(article) {
  const articleWithCategory = {
    ...article,
    category: article.category || 'Unknown',
    fetchedAt: Date.now()
  };

  // Check if article already exists (by title + category)
  const exists = db.articles.find(
    a => a.title === article.title && a.category === article.category
  );

  if (!exists) {
    db.articles.push(articleWithCategory);
    saveDatabase();
    return { changes: 1 };
  }

  return { changes: 0 };
}

/**
 * Get articles by category
 */
function getArticlesByCategory(category, limit = 20) {
  return db.articles
    .filter(a => a.category === category)
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
    .slice(0, limit);
}

/**
 * Get latest articles across all categories
 */
function getLatestArticles(limit = 30) {
  return db.articles
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
    .slice(0, limit);
}

/**
 * Check if category needs refresh (based on TTL)
 */
function needsRefresh(category) {
  const lastUpdate = db.lastUpdated[category];
  if (!lastUpdate) return true;
  return Date.now() - lastUpdate > CACHE_TTL;
}

/**
 * Update refresh timestamp for category
 */
function updateRefreshTimestamp(category) {
  db.lastUpdated[category] = Date.now();
  saveDatabase();
}

/**
 * Cleanup old articles (older than 30 days)
 */
function cleanupOldArticles() {
  const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
  const before = db.articles.length;

  db.articles = db.articles.filter(a => {
    const fetchedAt = a.fetchedAt || 0;
    return fetchedAt > thirtyDaysAgo;
  });

  const removed = before - db.articles.length;
  if (removed > 0) {
    console.log(`[Database] Cleaned up ${removed} old articles`);
    saveDatabase();
  }

  return removed;
}

/**
 * Get database stats
 */
function getStats() {
  return {
    totalArticles: db.articles.length,
    categories: [...new Set(db.articles.map(a => a.category))],
    lastRefreshed: Object.entries(db.lastUpdated).map(([cat, ts]) => ({
      category: cat,
      timestamp: new Date(ts).toISOString(),
      ageMinutes: Math.round((Date.now() - ts) / 60000)
    }))
  };
}

module.exports = {
  insertArticle,
  getArticlesByCategory,
  getLatestArticles,
  needsRefresh,
  updateRefreshTimestamp,
  cleanupOldArticles,
  getStats
};
