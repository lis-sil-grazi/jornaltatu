/**
 * Seed database with demo articles for testing
 * Run: node seed-demo-data.js
 */

const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'news.db'));

// Create tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS articles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL UNIQUE,
    description TEXT,
    url TEXT UNIQUE NOT NULL,
    imageUrl TEXT,
    source TEXT,
    category TEXT NOT NULL,
    publishedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    CHECK(category IN ('Bitcoin', 'Guerras', 'Política Internacional', 'Política Brasileira', 'Hotelaria'))
  );
  CREATE INDEX IF NOT EXISTS idx_category ON articles(category);
  CREATE INDEX IF NOT EXISTS idx_publishedAt ON articles(publishedAt DESC);
`);

const demoArticles = [
  {
    title: "Bitcoin Atinge Nova Máxima Histórica",
    description: "O preço do Bitcoin disparou 15% em 24 horas. ...porque o mundo precisa mesmo de mais volatilidade.",
    url: "https://example.com/bitcoin-1",
    imageUrl: "https://via.placeholder.com/300x200?text=Bitcoin",
    source: "CryptoNews",
    category: "Bitcoin",
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    title: "Conflito na Ucrânia Escalona Tensões Diplomáticas",
    description: "Negociações entre potências mundiais chegam a impasse. ...shocking, eu sei.",
    url: "https://example.com/war-1",
    imageUrl: "https://via.placeholder.com/300x200?text=Conflito",
    source: "Reuters",
    category: "Guerras",
    publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
  },
  {
    title: "Eleições na Europa Definem Novo Rumo Político",
    description: "Resultados das eleições europeias surpreendem analistas. ...exactly what we needed.",
    url: "https://example.com/politics-1",
    imageUrl: "https://via.placeholder.com/300x200?text=Política",
    source: "BBC",
    category: "Política Internacional",
    publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
  },
  {
    title: "Brasil Aprova Nova Lei de Câmbio",
    description: "Congresso Nacional aprova reforma cambial após debate acirrado. ...naturally.",
    url: "https://example.com/brasil-1",
    imageUrl: "https://via.placeholder.com/300x200?text=Brasil",
    source: "Folha de São Paulo",
    category: "Política Brasileira",
    publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
  },
  {
    title: "Turismo em Portugal Bate Recordes",
    description: "Número de hóspedes sobe 30% comparado ao ano anterior. ...because why not.",
    url: "https://example.com/hotel-1",
    imageUrl: "https://via.placeholder.com/300x200?text=Hotelaria",
    source: "Travel News",
    category: "Hotelaria",
    publishedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
  },
  {
    title: "Ethereum 2.0 Reduz Consumo de Energia em 95%",
    description: "Nova atualização da blockchain Ethereum é implementada com sucesso. ...well, that's concerning.",
    url: "https://example.com/bitcoin-2",
    imageUrl: "https://via.placeholder.com/300x200?text=Ethereum",
    source: "Cointelegraph",
    category: "Bitcoin",
    publishedAt: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString()
  },
  {
    title: "Crise Alimentar Afeta Regiões em Conflito",
    description: "Organizações humanitárias alertam para situação crítica. ...pack your bags.",
    url: "https://example.com/war-2",
    imageUrl: "https://via.placeholder.com/300x200?text=Crise",
    source: "UN News",
    category: "Guerras",
    publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString()
  },
  {
    title: "Cúpula do G20 Define Agenda Climática Global",
    description: "Líderes mundiais concordam em metas ambiciosas para 2030. ...surely this will end well.",
    url: "https://example.com/politics-2",
    imageUrl: "https://via.placeholder.com/300x200?text=G20",
    source: "Associated Press",
    category: "Política Internacional",
    publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
  },
  {
    title: "Pré-candidatos Brasileiros Participam de Debate",
    description: "Principais nomes da política nacional apresentam propostas ao eleitorado. ...another day in paradise.",
    url: "https://example.com/brasil-2",
    imageUrl: "https://via.placeholder.com/300x200?text=Debate",
    source: "G1",
    category: "Política Brasileira",
    publishedAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString()
  },
  {
    title: "Rede Hoteleira Expandir Operações em Cidades Médias",
    description: "Hotéis boutique crescem em regiões fora do eixo São Paulo-Rio. ...that's not a red flag at all.",
    url: "https://example.com/hotel-2",
    imageUrl: "https://via.placeholder.com/300x200?text=Hotéis",
    source: "Hotel Management",
    category: "Hotelaria",
    publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
  }
];

try {
  const insert = db.prepare(`
    INSERT OR IGNORE INTO articles 
    (title, description, url, imageUrl, source, category, publishedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  let inserted = 0;
  for (const article of demoArticles) {
    const result = insert.run(
      article.title,
      article.description,
      article.url,
      article.imageUrl,
      article.source,
      article.category,
      article.publishedAt
    );
    if (result.changes > 0) inserted++;
  }

  console.log(`✅ Database seeded successfully!`);
  console.log(`📝 ${inserted} articles inserted`);
  console.log(`\n📊 Articles by category:`);

  const stats = db.prepare(`
    SELECT category, COUNT(*) as count 
    FROM articles 
    GROUP BY category 
    ORDER BY category
  `).all();

  for (const stat of stats) {
    console.log(`   ${stat.category}: ${stat.count} articles`);
  }

  console.log(`\n🚀 Backend is ready to serve!`);
} catch (error) {
  console.error('❌ Error seeding database:', error.message);
  process.exit(1);
} finally {
  db.close();
}
