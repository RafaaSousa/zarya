import React, { useEffect } from "react";
import { HashRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import LandingPage from "./pages/LandingPage";
import Catalogo from "./pages/Catalogo";
import ProdutoDetalhes from "./pages/ProdutoDetalhes";
import Manutencao from "./pages/Manutencao";

// Reseta scroll ao trocar de rota (para páginas fora da landing)
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow" id="main-content" tabIndex={-1}>
          <Routes>
            {/* Landing page única com scroll-driven navigation */}
            <Route path="/" element={<LandingPage />} />

            {/* Rotas auxiliares mantidas */}
            <Route path="/catalogo" element={<Catalogo />} />
            <Route path="/produto/:id" element={<ProdutoDetalhes />} />
            <Route path="/manutencao" element={<Manutencao />} />

            {/* Redirect legacy routes para a landing com âncora */}
            <Route path="/ProjetoCorporativo" element={<LandingPageRedirect section="projeto-corporativo" />} />
            <Route path="/contato" element={<LandingPageRedirect section="contatos" />} />
            <Route path="/quemsomos" element={<LandingPageRedirect section="home" />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

// ─── Redireciona rotas legacy para a landing page com scroll para seção ──
function LandingPageRedirect({ section }) {
  useEffect(() => {
    // Aguarda a LandingPage montar e rola para a seção correta
    const scroll = () => {
      const el = document.getElementById(section);
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: "smooth" });
      } else {
        // Tenta novamente em 300ms caso a seção ainda não exista no DOM
        setTimeout(scroll, 300);
      }
    };
    const timer = setTimeout(scroll, 200);
    return () => clearTimeout(timer);
  }, [section]);

  return <LandingPage />;
}
