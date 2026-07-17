import React from "react";
import Home from "./Home";
import ProjetoCorporativo from "./ProjetoCorporativo";
import Campanhas from "./Campanhas";
import Contato from "./Contato";

// ─── Divisor visual entre seções ─────────────────────────────────────────
function SectionDivider({ label }) {
  return (
    <div className="relative w-full overflow-hidden" aria-hidden="true">
      <div className="h-px bg-gradient-to-r from-transparent via-[#C9A227]/40 to-transparent" />
      {label && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="bg-background px-6 font-body text-[10px] font-bold text-primary/60 uppercase tracking-[0.25em]"></span>
        </div>
      )}
    </div>
  );
}

// ─── LandingPage ─────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div className="bg-background text-on-surface font-body overflow-x-hidden">

      {/* ════════════════════════════════
          SEÇÃO 1 — HOME
      ════════════════════════════════ */}
      <section
        id="home"
        className="scroll-section"
        aria-label="Início — Zaryá Ótica"
      >
        <Home />
      </section>

      <SectionDivider />

      {/* ════════════════════════════════
          SEÇÃO 2 — CAMPANHAS
      ════════════════════════════════ */}
      <section
        id="campanhas"
        className="scroll-section"
        aria-label="Campanhas Zaryá nas empresas"
      >
        <Campanhas />
      </section>

      <SectionDivider />

      {/* ════════════════════════════════
          SEÇÃO 3 — PROJETO CORPORATIVO
      ════════════════════════════════ */}
      <section
        id="projeto-corporativo"
        className="scroll-section"
        aria-label="Projeto Corporativo Zaryá"
      >
        <ProjetoCorporativo />
      </section>

      <SectionDivider />

      {/* ════════════════════════════════
          SEÇÃO 4 — CONTATOS
      ════════════════════════════════ */}
      <section
        id="contatos"
        className="scroll-section"
        aria-label="Contatos — Fale com a Zaryá"
      >
        <Contato />
      </section>
    </div>
  );
}
