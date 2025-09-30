import type { Metadata } from "next";
import Link from "next/link";
// Corrigido o caminho de importação para ser relativo
import ThemeSwitcher from "./components/ThemeSwitcher"; 
import "./globals.css";

export const metadata: Metadata = {
  title: "Guia do Adulto Moderno",
  description: "Um manual prático para os desafios da vida adulta.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body>
        <header className="site-header">
          <div className="header-content">
            <Link href="/">Guia do Adulto Moderno</Link>
            <ThemeSwitcher /> {/* Adiciona o botão aqui */}
          </div>
        </header>
        
        <div className="content-wrapper">
          {children}
        </div>

        <footer className="site-footer">
          <p>&copy; {new Date().getFullYear()} Guia do Adulto Moderno. Todos os direitos reservados.</p>
        </footer>
      </body>
    </html>
  );
}

