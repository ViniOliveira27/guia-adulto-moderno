"use client";

import { useState, useEffect } from 'react';

// Atualizamos o tipo de artigo para incluir a categoria 
type Article = {
  slug: string;
  title: string;
  category: string;
};

// Esta função irá buscar os dados da nossa API
async function fetchArticles(apiUrl: string): Promise<Article[]> {
  const res = await fetch(`${apiUrl}/articles`);
  if (!res.ok) {
    throw new Error('Falha ao buscar os artigos');
  }
  return res.json();
}

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Usamos o URL público do Render diretamente para garantir que funciona no deploy
  const API_URL = "https://guia-adulto-moderno.onrender.com";

  useEffect(() => {
    if (!API_URL) {
      setError("A URL da API não está configurada.");
      setLoading(false);
      return;
    }

    const loadArticles = async () => {
      try {
        setLoading(true);
        const fetchedArticles = await fetchArticles(API_URL);
        setArticles(fetchedArticles);
        // Extrai categorias únicas dos artigos
        const uniqueCategories = Array.from(new Set(fetchedArticles.map(a => a.category)));
        setCategories(uniqueCategories);
      } catch (e) {
        setError('Erro: Failed to fetch');
      } finally {
        setLoading(false);
      }
    };
    loadArticles();
  }, [API_URL]);

  // Filtra os artigos com base na busca e na categoria selecionada
  const filteredArticles = articles
    .filter(article =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(article =>
      selectedCategory ? article.category === selectedCategory : true
    );

  return (
    <main>
      <div className="page-header">
        <h1>Guia do Adulto Moderno</h1>
        <p>Uma coleção de guias para navegar a vida adulta.</p>
        <input
          type="text"
          placeholder="Buscar artigo..."
          className="search-input"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="category-filters">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`category-button ${!selectedCategory ? 'active' : ''}`}
        >
          Todos
        </button>
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`category-button ${selectedCategory === category ? 'active' : ''}`}
          >
            {category}
          </button>
        ))}
      </div>
      
      {loading && <p>A carregar artigos...</p>}
      {error && <p className="error-message">{error}</p>}

      {!loading && !error && (
        <ul className="article-grid">
          {filteredArticles.map((article) => (
            <li key={article.slug}>
              <div className="article-card">
                <a href={`/${article.slug}`}>
                  <div>
                    <span className="article-category">{article.category}</span>
                    <h3>{article.title}</h3>
                  </div>
                  <p>Leia mais →</p>
                </a>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

