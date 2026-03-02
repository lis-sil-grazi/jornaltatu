const API_BASE = import.meta.env.DEV ? 'http://localhost:3001/api' : '/api';

export const fetchCategories = async () => {
  const response = await fetch(`${API_BASE}/categories`);
  if (!response.ok) throw new Error('Failed to fetch categories');
  return response.json();
};

export const fetchLatestNews = async (limit = 30) => {
  const response = await fetch(`${API_BASE}/news/latest?limit=${limit}`);
  if (!response.ok) throw new Error('Failed to fetch latest news');
  return response.json();
};

export const fetchCategoryNews = async (category, limit = 20, forceRefresh = false) => {
  const url = `${API_BASE}/news/category/${encodeURIComponent(category)}?limit=${limit}${forceRefresh ? '&refresh=true' : ''}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch news for ${category}`);
  return response.json();
};

export const refreshAllNews = async () => {
  const response = await fetch(`${API_BASE}/news/refresh`, {
    method: 'POST'
  });
  if (!response.ok) throw new Error('Failed to refresh news');
  return response.json();
};

export const fetchStats = async () => {
  const response = await fetch(`${API_BASE}/stats`);
  if (!response.ok) throw new Error('Failed to fetch stats');
  return response.json();
};

export const fetchHealth = async () => {
  const response = await fetch(`${API_BASE}/health`);
  if (!response.ok) throw new Error('Health check failed');
  return response.json();
};
