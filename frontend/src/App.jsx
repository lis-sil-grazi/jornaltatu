import React, { useState, useEffect } from 'react';
import NewsCard from './components/NewsCard';
import { fetchCategoryNews, fetchLatestNews } from './api/newsApi';

const CATEGORIES = [
  'Todos',
  'Bitcoin',
  'Guerras',
  'Política Internacional',
  'Política Brasileira',
  'Hotelaria'
];

function App() {
  const [activeCategory, setActiveCategory] = useState('Bitcoin');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadNews = async (category, forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);
      
      let data;
      if (category === 'Todos') {
        data = await fetchLatestNews(30);
      } else {
        data = await fetchCategoryNews(category, 20, forceRefresh);
      }
      
      setArticles(data.articles || []);
    } catch (err) {
      console.error('Error loading news:', err);
      setError('Falha ao carregar notícias. Tente novamente.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadNews(activeCategory);
  }, [activeCategory]);

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadNews(activeCategory, true);
  };

  return (
    <div className="app">
      <header>
        <div className="header-container">
          <a href="/" className="header-logo">
            <div className="logo-image">🦔</div>
            <div className="logo-text">
              <h1>Jornal Tatu</h1>
              <p>Notícias Curadas</p>
            </div>
          </a>
          <button 
            className="btn-primary" 
            onClick={handleRefresh}
            disabled={refreshing}
          >
            {refreshing ? '↻ Atualizando...' : '↻ Atualizar'}
          </button>
        </div>
      </header>

      <nav className="tabs-container">
        <div className="tabs-wrapper">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              className={`tab-button ${activeCategory === category ? 'active' : ''}`}
              onClick={() => handleCategoryChange(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </nav>

      <main>
        <div className="content-header">
          <h2>{activeCategory}</h2>
          <p className="content-header-meta">
            {loading ? 'Carregando...' : `${articles.length} notícias encontradas`}
          </p>
        </div>

        {loading && <div className="loading">Carregando notícias...</div>}
        
        {error && !loading && (
          <div className="error">
            <p>{error}</p>
            <button className="btn-primary" onClick={() => loadNews(activeCategory)}>
              Tentar novamente
            </button>
          </div>
        )}

        {!loading && !error && articles.length === 0 && (
          <div className="empty-state">
            <p>Nenhuma notícia encontrada para {activeCategory}</p>
            <p style={{ marginTop: '16px', fontSize: '14px', color: '#8A8A8A' }}>
              Clique em "Atualizar" para buscar as últimas notícias
            </p>
          </div>
        )}

        {!loading && !error && articles.length > 0 && (
          <div className="news-grid">
            {articles.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
