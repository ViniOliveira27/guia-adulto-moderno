from fastapi import FastAPI, HTTPException
from pathlib import Path
from fastapi.middleware.cors import CORSMiddleware
import frontmatter  # Importa a biblioteca para ler o frontmatter

app = FastAPI()

# Lista de origens permitidas (seu site local e o site no ar)
origins = [
    "http://localhost:3000",
    # Este é o URL público mais recente do seu site na Vercel
    "https://guia-adulto-moderno-3cqwqtbww9-vinioliveira27s-projects.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

CONTENT_DIR = Path("content")

@app.get("/")
def read_root():
    return {"message": "Bem-vindo à API do Guia do Adulto Moderno!"}

@app.get("/articles")
def get_articles():
    articles = []
    # Itera sobre todos os ficheiros .md na pasta 'content'
    for filepath in CONTENT_DIR.glob("*.md"):
        # Carrega o ficheiro, separando os metadados (frontmatter) e o conteúdo
        post = frontmatter.load(filepath)
        
        # Cria um dicionário com os dados do artigo
        article_data = {
            "slug": filepath.stem,
            "title": post.metadata.get("title", "Título não definido"),
            "category": post.metadata.get("category", "Sem categoria")
        }
        articles.append(article_data)
    
    return articles

@app.get("/articles/{slug}")
def get_article(slug: str):
    # Monta o caminho para o ficheiro do artigo específico
    filepath = CONTENT_DIR / f"{slug}.md"

    # Verifica se o ficheiro existe
    if not filepath.exists():
        raise HTTPException(status_code=404, detail="Artigo não encontrado")
    
    # Carrega o ficheiro
    post = frontmatter.load(filepath)
    
    # Retorna todos os dados, incluindo o conteúdo
    return {
        "slug": slug,
        "title": post.metadata.get("title", "Título não definido"),
        "category": post.metadata.get("category", "Sem categoria"),
        "content": post.content
    }

