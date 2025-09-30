// O import do 'next/link' foi removido para resolver um erro de compilação.
// A navegação agora usa uma tag <a> padrão.
import ReactMarkdown from 'react-markdown';

// Define uma interface para os props que o Next.js passa para a página.
// Isso torna o código mais claro e seguro.
interface ArticlePageProps {
  params: {
    slug: string;
  };
}

// Define o tipo de dado que esperamos para um artigo, incluindo o conteúdo
type Article = {
  slug: string;
  content: string;
};

// A página recebe 'params' do Next.js, que contém o 'slug' pego da URL.
export default async function ArticlePage({ params }: ArticlePageProps) {
  
  // Adiciona uma verificação de segurança.
  if (!params?.slug) {
    return (
      <main>
        <h1>Artigo não encontrado</h1>
        <p>Não foi possível encontrar o identificador do artigo na URL.</p>
      </main>
    );
  }

  // Busca o conteúdo do artigo específico na nossa API Python, usando o slug.
  const res = await fetch(`http://127.0.0.1:8000/articles/${params.slug}`, {
    cache: 'no-store',
  });

  // Adiciona uma verificação para o caso de a API falhar.
  if (!res.ok) {
    return (
      <main>
        <h1>Erro ao carregar o artigo</h1>
        <p>Não foi possível buscar o conteúdo. Verifique se a API está funcionando corretamente.</p>
      </main>
    );
  }

  // Converte a resposta da API para o formato JSON
  const article: Article = await res.json();

  return (
    <main>
      {/* O componente Link foi substituído por uma tag <a> para compatibilidade. */}
      <a href="/" style={{ marginBottom: '2rem', display: 'block' }}>
        &larr; Voltar para a lista
      </a>
      
      {/* Usamos o componente <ReactMarkdown> para renderizar o conteúdo. */}
      <ReactMarkdown>
        {article.content}
      </ReactMarkdown>
    </main>
  );
}

