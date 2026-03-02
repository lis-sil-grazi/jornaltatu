const axios = require('axios');
require('dotenv').config();

const NEWS_API_KEY = process.env.NEWSAPI_KEY;
const BRAVE_API_KEY = process.env.BRAVE_API_KEY;

// Category to search query mapping (Portuguese and English for better coverage)
const CATEGORY_QUERIES = {
  Bitcoin: ['bitcoin cryptocurrency', 'bitcoin notícias', 'crypto market'],
  Guerras: ['guerra conflito internacional', 'war conflict', 'guerras mundo'],
  'Política Internacional': ['política internacional', 'international politics', 'geopolítica'],
  'Política Brasileira': ['política brasil', 'brazilian politics', 'congresso nacional'],
  Hotelaria: ['hotelaria turismo', 'hospitality industry', 'hotel news']
};

/**
 * Fetch news from NewsAPI
 */
async function fetchFromNewsAPI(query, language = 'pt') {
  if (!NEWS_API_KEY) {
    console.warn('[NewsAPI] API key not configured');
    return [];
  }

  try {
    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: query,
        language: language,
        sortBy: 'publishedAt',
        pageSize: 10,
        apiKey: NEWS_API_KEY
      },
      timeout: 10000
    });

    if (response.data.articles) {
      return response.data.articles.map(article => ({
        title: article.title,
        description: article.description,
        url: article.url,
        imageUrl: article.urlToImage,
        source: article.source?.name || 'Unknown',
        publishedAt: article.publishedAt
      }));
    }

    return [];
  } catch (error) {
    console.error(`[NewsAPI] Error fetching ${query}:`, error.message);
    return [];
  }
}

/**
 * Fetch news from Brave Search API
 */
async function fetchFromBraveSearch(query) {
  if (!BRAVE_API_KEY) {
    console.warn('[Brave Search] API key not configured');
    return [];
  }

  try {
    const response = await axios.get('https://api.search.brave.com/res/v1/news/search', {
      params: {
        q: query,
        count: 10,
        freshness: 'pw' // past week
      },
      headers: {
        'Accept': 'application/json',
        'Accept-Encoding': 'gzip',
        'X-Subscription-Token': BRAVE_API_KEY
      },
      timeout: 10000
    });

    if (response.data.results) {
      return response.data.results.map(result => ({
        title: result.title,
        description: result.description,
        url: result.url,
        imageUrl: result.thumbnail?.src || '',
        source: result.source || 'Unknown',
        publishedAt: result.age || new Date().toISOString()
      }));
    }

    return [];
  } catch (error) {
    console.error(`[Brave Search] Error fetching ${query}:`, error.message);
    return [];
  }
}

/**
 * Fetch news for a specific category using both APIs
 */
async function fetchCategoryNews(category) {
  const queries = CATEGORY_QUERIES[category];
  
  if (!queries) {
    console.warn(`[Fetcher] No queries defined for category: ${category}`);
    return [];
  }

  console.log(`[Fetcher] Fetching news for: ${category}`);
  const allArticles = [];

  // Try multiple queries for redundancy
  for (const query of queries) {
    try {
      // Fetch from both APIs in parallel
      const [newsApiResults, braveResults] = await Promise.allSettled([
        fetchFromNewsAPI(query, 'pt'),
        fetchFromBraveSearch(query)
      ]);

      // Combine results from both APIs
      const newsApiArticles = newsApiResults.status === 'fulfilled' ? newsApiResults.value : [];
      const braveArticles = braveResults.status === 'fulfilled' ? braveResults.value : [];

      allArticles.push(...newsApiArticles, ...braveArticles);

      // Add small delay to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`[Fetcher] Error with query "${query}":`, error.message);
    }
  }

  // Remove duplicates based on title
  const uniqueArticles = [];
  const seenTitles = new Set();

  for (const article of allArticles) {
    const normalizedTitle = article.title?.toLowerCase().trim();
    if (normalizedTitle && !seenTitles.has(normalizedTitle)) {
      seenTitles.add(normalizedTitle);
      uniqueArticles.push({
        ...article,
        category
      });
    }
  }

  console.log(`[Fetcher] Found ${uniqueArticles.length} unique articles for ${category}`);
  return uniqueArticles;
}

/**
 * Fetch news for all categories
 */
async function fetchAllCategories() {
  const categories = Object.keys(CATEGORY_QUERIES);
  const results = {};

  console.log('[Fetcher] Starting fetch for all categories...');

  for (const category of categories) {
    try {
      results[category] = await fetchCategoryNews(category);
      // Delay between categories to be polite to APIs
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`[Fetcher] Failed to fetch ${category}:`, error.message);
      results[category] = [];
    }
  }

  console.log('[Fetcher] Completed fetch for all categories');
  return results;
}

module.exports = {
  fetchCategoryNews,
  fetchAllCategories,
  CATEGORY_QUERIES
};
