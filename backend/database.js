const Database = require('better-sqlite3');
const path = require('path');

// Initialize database
const db = new Database(path.join(__dirname, 'news.db'));

// Create articles table
db.exec(`
  CREATE TABLE IF NOT EXISTS articles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    source TEXT,
    url TEXT NOT NULL,
    imageUrl TEXT,
    publishedAt TEXT,
    fetchedAt INTEGER NOT NULL,
    UNIQUE(category, title)
  )
`);

// Create index for faster queries
db.exec(`
  CREATE INDEX IF NOT EXISTS idx_category ON articles(category);
  CREATE INDEX IF NOT EXISTS idx_fetchedAt ON articles(fetchedAt);
`);

/**
 * Insert or ignore article (prevents duplicates)
 */
function insertArticle(article) {
  const stmt = db.prepare(`
    INSERT OR IGNORE INTO articles (category, title, description, source, url, imageUrl, publishedAt, fetchedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  return stmt.run(
    article.category,
    article.title,
    article.description || '',
    article.source || 'Unknown',
    article.url,
    article.imageUrl || '',
    article.publishedAt || new Date().toISOString(),
    Date.now()
  );
}

/**
 * Get articles by category
 */
function getArticlesByCategory(category, limit = 20) {
  const stmt = db.prepare(`
    SELECT * FROM articles
    WHERE category = ?
    ORDER BY publishedAt DESC
    LIMIT ?
  `);
  
  return stmt.all(category, limit);
}

/**
 * Get latest articles across all categories
 */
function getLatestArticles(limit = 30) {
  const stmt = db.prepare(`
    SELECT * FROM articles
    ORDER BY publishedAt DESC
    LIMIT ?
  `);
  
  return stmt.all(limit);
}

/**
 * Get articles by multiple categories
 */
function getArticlesByCategories(categories, limit = 20) {
  const placeholders = categories.map(() => '?').join(',');
  const stmt = db.prepare(`
    SELECT * FROM articles
    WHERE category IN (${placeholders})
    ORDER BY publishedAt DESC
    LIMIT ?
  `);
  
  return stmt.all(...categories, limit);
}

/**
 * Check if category needs refresh (older than 6 hours)
 */
function needsRefresh(category) {
  const sixHoursAgo = Date.now() - (6 * 60 * 60 * 1000);
  const stmt = db.prepare(`
    SELECT COUNT(*) as count FROM articles
    WHERE category = ? AND fetchedAt > ?
  `);
  
  const result = stmt.get(category, sixHoursAgo);
  return result.count === 0;
}

/**
 * Delete articles older than 7 days
 */
function cleanupOldArticles() {
  const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
  const stmt = db.prepare(`
    DELETE FROM articles WHERE fetchedAt < ?
  `);
  
  const result = stmt.run(sevenDaysAgo);
  console.log(`[Database] Cleaned up ${result.changes} old articles`);
  return result.changes;
}

/**
 * Get database statistics
 */
function getStats() {
  const totalStmt = db.prepare(`SELECT COUNT(*) as total FROM articles`);
  const categoryStmt = db.prepare(`
    SELECT category, COUNT(*) as count
    FROM articles
    GROUP BY category
  `);
  
  return {
    total: totalStmt.get().total,
    byCategory: categoryStmt.all()
  };
}

module.exports = {
  db,
  insertArticle,
  getArticlesByCategory,
  getLatestArticles,
  getArticlesByCategories,
  needsRefresh,
  cleanupOldArticles,
  getStats
};
