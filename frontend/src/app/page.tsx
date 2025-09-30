'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// Atualizamos o tipo para incluir a nova propriedade "category"
type Article = {
  slug: string;
  title: string;
  category: string;
};

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  // Novo estado para controlar a categoria selecionada
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/articles');
        if (!res.ok) {
          throw new Error('Falha ao buscar dados da API');
        }
        const data: Article[] = await res.json();
        setArticles(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ocorreu um erro desconhecido');
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  // 1. Extrai todas as categorias únicas dos artigos
  const categories = ['Todos', ...Array.from(new Set(articles.map(article => article.category)))];

  // 2. Filtra os artigos com base no termo de busca E na categoria selecionada
  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <main>
      <div className="page-header">
        <h1>Guia do Adulto Moderno</h1>
        <p>Uma coleção de guias para navegar a vida adulta.</p>
        <input
          type="text"
          placeholder="Buscar artigo..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* 3. Secção para os botões de filtro de categoria */}
      <div className="category-filters">
        {categories.map(category => (
          <button 
            key={category} 
            className={`category-button ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {loading && <p>Carregando artigos...</p>}
      {error && <p className="error-message">Erro: {error}</p>}
      
      {!loading && !error && (
        <ul className="article-grid">
          {filteredArticles.length > 0 ? (
            filteredArticles.map((article) => (
              <li key={article.slug} className="article-card">
                <Link href={`/${article.slug}`}>
                  <div>
                    <span className="article-category">{article.category}</span>
                    <h3>{article.title}</h3>
                  </div>
                  <p>Leia mais →</p>
                </Link>
              </li>
            ))
          ) : (
            <p>Nenhum artigo encontrado.</p>
          )}
        </ul>
      )}
    </main>
  );
}

