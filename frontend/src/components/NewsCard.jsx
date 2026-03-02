import React from 'react';

const NewsCard = ({ article }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Agora';
    if (diffInHours < 24) return `${diffInHours}h atrás`;
    if (diffInHours < 48) return 'Ontem';
    return `${Math.floor(diffInHours / 24)}d atrás`;
  };

  const getCategoryEmoji = (category) => {
    const emojiMap = {
      'Bitcoin': '₿',
      'Guerras': '⚔️',
      'Política Internacional': '🌍',
      'Política Brasileira': '🇧🇷',
      'Hotelaria': '🏨'
    };
    return emojiMap[category] || '📰';
  };

  // Extract sarcasm (text after the last period before sarcasm)
  const hasSarcasm = article.description && (
    article.description.includes('...') || 
    article._withSarcasm === true
  );

  return (
    <article className="news-card" onClick={() => window.open(article.url, '_blank')}>
      {article.imageUrl ? (
        <img 
          src={article.imageUrl} 
          alt={article.title}
          className="news-card-image"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
      ) : null}
      {!article.imageUrl && (
        <div className="news-card-image">
          {getCategoryEmoji(article.category)}
        </div>
      )}
      <div className="news-card-badges">
        <span className="news-card-category">{article.category}</span>
        {article._translated && (
          <span className="badge-translated" title="Traduzido para português">🇧🇷</span>
        )}
        {hasSarcasm && (
          <span className="badge-sarcasm" title="Com um toque de sarcasmo">✨</span>
        )}
      </div>
      <h3>{article.title}</h3>
      {article.description && (
        <p className="news-card-excerpt">
          {article.description}
        </p>
      )}
      <div className="news-card-meta">
        <span>{article.source}</span>
        <span>•</span>
        <span>{formatDate(article.publishedAt)}</span>
      </div>
      <div className="news-card-footer">
        <a href={article.url} className="read-more" onClick={(e) => e.stopPropagation()}>
          Ler artigo →
        </a>
      </div>
    </article>
  );
};

export default NewsCard;
