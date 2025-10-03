import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

// Define o tipo do artigo, incluindo o título e a categoria
type Article = {
  slug: string;
  title: string;
  category: string;
  content: string;
};

// Função para buscar os dados de um artigo específico
async function getArticle(slug: string): Promise<Article | null> {
  try {
    // Usamos o URL público do Render diretamente para garantir que funciona no deploy
    const apiUrl = "https://guia-adulto-moderno.onrender.com";
    const res = await fetch(`${apiUrl}/articles/${slug}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      return null;
    }
    
    return res.json();
  } catch (error) {
    console.error("Failed to fetch article:", error);
    return null;
  }
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = await getArticle(params.slug);

  // Se o artigo não for encontrado, exibe uma mensagem amigável
  if (!article) {
    return (
      <main>
        <h1>Artigo não encontrado</h1>
        <p>
          O artigo que você está procurando não existe ou foi movido.
        </p>
        <Link href="/">← Voltar para a lista</Link>
      </main>
    );
  }

  return (
    <main>
      <Link href="/">← Voltar para a lista</Link>
      <div style={{ marginTop: '20px' }}>
        <span className="article-category">{article.category}</span>
        <h1>{article.title}</h1>
        <ReactMarkdown>{article.content}</ReactMarkdown>
      </div>
    </main>
  );
}

