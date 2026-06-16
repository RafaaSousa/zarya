import React, { useEffect } from "react";
import { HashRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import ProjetoCorporativo from "./pages/ProjetoCorporativo";
import Catalogo from "./pages/Catalogo";
import QuemSomos from "./pages/QuemSomos";
import Contato from "./pages/Contato";
import ProdutoDetalhes from "./pages/ProdutoDetalhes";
import Manutencao from "./pages/Manutencao";

// ScrollToTop helper to reset scroll on route change
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
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/ProjetoCorporativo" element={<ProjetoCorporativo />} />
            <Route path="/catalogo" element={<Catalogo />} />
            <Route path="/quemsomos" element={<QuemSomos />} />
            <Route path="/contato" element={<Contato />} />
            <Route path="/produto/:id" element={<ProdutoDetalhes />} />
            <Route path="/manutencao" element={<Manutencao />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
