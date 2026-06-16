import React from "react";
import { Link } from "react-router-dom";

export default function QuemSomos() {
  const differentials = [
    {
      icon: "visibility",
      title: "Saúde visual\ncom propósito",
    },
    {
      icon: "groups",
      title: "Experiências\nque engajam",
    },
    {
      icon: "favorite",
      title: "Cuidado leve\ne acessível",
    },
    {
      icon: "diversity_3",
      title: "Conexões que geram\ntransformação",
    },
  ];

  const pillars = [
    {
      icon: "manage_search",
      title: "Qualidade Impecável",
      description:
        "Lentes de alta precisão e armações selecionadas com rigor, garantindo durabilidade e conforto excepcionais em cada peça.",
    },
    {
      icon: "storefront",
      title: "Atendimento Humanizado",
      description:
        "Um olhar atento e cuidadoso para cada cliente. Entendemos suas necessidades para oferecer soluções visuais que se integram à sua vida.",
    },
    {
      icon: "location_on",
      title: "Inovação Constante",
      description:
        "Buscamos incansavelmente as melhores tecnologias ópticas do mercado para proporcionar a visão mais nítida e protegida possível.",
    },
  ];

  return (
    <div className="bg-background text-on-surface font-body overflow-x-hidden">

      {/* ── 1. NOSSA ESSÊNCIA — Hero ── */}
      <section className="max-w-[1280px] mx-auto px-4 md:px-10 py-16 md:py-24">
        <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">

          {/* Circular Photo */}
          <div className="shrink-0 w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden shadow-2xl border-4 border-[#F7F4EF]">
            <img
              src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&q=80"
              alt="Equipe Zaryá Ótica"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Text */}
          <div className="flex flex-col gap-4 md:gap-6 text-center md:text-left">
            <h2
              className="font-display text-3xl md:text-4xl lg:text-5xl font-bold tracking-wide"
              style={{ color: "#C9A227" }}
            >
              MISSÃO
            </h2>
            <p className="font-body text-sm md:text-base text-on-surface-variant leading-relaxed max-w-md">
              Cuidar da saúde visual das pessoas com excelência, proximidade e confiança, oferecendo soluções que proporcionem mais conforto, bem-estar e qualidade de vida.
            </p>
          </div>
        </div>
      </section>

      {/* ── 2. QUEM SOMOS — Dark section ── */}
      <section className="w-full bg-[#2C2A24] py-16 md:py-24">
        <div className="max-w-[1280px] mx-auto px-4 md:px-10">
          <div className="flex flex-col md:flex-row gap-12 md:gap-16 items-start">

            {/* Left: Text */}
            <div className="flex-1 flex flex-col gap-5">
              <h2
                className="font-display text-3xl md:text-4xl lg:text-5xl font-bold tracking-wide"
                style={{ color: "#C9A227" }}
              >
                QUEM SOMOS
              </h2>
              <p className="font-body text-sm md:text-base leading-relaxed text-[#E8E0D0]">
                O mercado oferece óculos. Nós criamos experiências que despertam{" "}
                <span style={{ color: "#C9A227" }}>atenção</span> para algo
                essencial: a forma como as pessoas enxergam sua rotina, seu
                trabalho e sua{" "}
                <span style={{ color: "#C9A227" }}>qualidade visual</span>.
              </p>
              <p className="font-body text-sm md:text-base leading-relaxed text-[#E8E0D0]">
                Transformamos campanhas internas em{" "}
                <span style={{ color: "#C9A227" }}>ações</span> leves,
                participativas e <span style={{ color: "#C9A227" }}>memoráveis</span>.
              </p>
              <p className="font-body text-sm md:text-base leading-relaxed text-[#E8E0D0]">
                Mais do que uma ação visual, criamos{" "}
                <span style={{ color: "#C9A227" }}>conexão</span>,{" "}
                <span style={{ color: "#C9A227" }}>percepção</span> e{" "}
                <span style={{ color: "#C9A227" }}>cuidado</span> dentro do
                ambiente corporativo.
              </p>
            </div>

            {/* Right: 2×2 icon grid */}
            <div className="flex-1 grid grid-cols-2 gap-4">
              {differentials.map((item) => (
                <div
                  key={item.title}
                  className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border border-[#C9A227]/20 hover:border-[#C9A227]/50 transition-colors"
                  style={{ background: "rgba(201,162,39,0.06)" }}
                >
                  <span
                    className="material-symbols-outlined text-3xl"
                    style={{ color: "#C9A227" }}
                  >
                    {item.icon}
                  </span>
                  <span className="font-body text-xs text-center text-[#E8E0D0] leading-snug whitespace-pre-line">
                    {item.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. NOSSA VISÃO ── */}
      <section className="w-full bg-[#F7F4EF] py-16 md:py-24">
        <div className="max-w-[720px] mx-auto px-4 md:px-10 flex flex-col items-center text-center gap-6">
          {/* Sparkle icon */}
          <span
            className="material-symbols-outlined text-3xl"
            style={{ color: "#C9A227" }}
          >
            visibility
          </span>

          <h3
            className="font-display text-3xl md:text-4xl font-semibold"
            style={{ color: "#2C2A24" }}
          >
            VISÃO
          </h3>

          <p className="font-body text-sm md:text-base text-on-surface-variant leading-relaxed">
            Ser reconhecida como referência em cuidado visual, inovação e atendimento humanizado, impactando positivamente a vida das pessoas e das organizações.
          </p>
        </div>
      </section>

      {/* ── 3.1. NOSSOS VALORES ── */}
      <section className="w-full bg-surface-container-low py-16 md:py-24">
        <div className="max-w-[1280px] mx-auto px-4 md:px-10 flex flex-col items-center gap-12">
          <h2
            className="font-display text-3xl md:text-4xl font-bold tracking-wide text-center"
            style={{ color: "#2C2A24" }}
          >
            VALORES
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
            <div className="flex flex-col items-center text-center gap-2 p-4 rounded-lg bg-surface-container">
              <h4 className="font-display text-xl font-bold text-primary">Excelência</h4>
              <p className="font-body text-sm text-on-surface-variant">Buscar sempre o melhor.</p>
            </div>
            <div className="flex flex-col items-center text-center gap-2 p-4 rounded-lg bg-surface-container">
              <h4 className="font-display text-xl font-bold text-primary">Respeito</h4>
              <p className="font-body text-sm text-on-surface-variant">Valorizar cada pessoa.</p>
            </div>
            <div className="flex flex-col items-center text-center gap-2 p-4 rounded-lg bg-surface-container">
              <h4 className="font-display text-xl font-bold text-primary">Confiança</h4>
              <p className="font-body text-sm text-on-surface-variant">Construir relações duradouras.</p>
            </div>
            <div className="flex flex-col items-center text-center gap-2 p-4 rounded-lg bg-surface-container">
              <h4 className="font-display text-xl font-bold text-primary">Evolução</h4>
              <p className="font-body text-sm text-on-surface-variant">Aprender e melhorar continuamente.</p>
            </div>
            <div className="flex flex-col items-center text-center gap-2 p-4 rounded-lg bg-surface-container">
              <h4 className="font-display text-xl font-bold text-primary">Gratidão</h4>
              <p className="font-body text-sm text-on-surface-variant">Reconhecer cada conquista.</p>
            </div>
            <div className="flex flex-col items-center text-center gap-2 p-4 rounded-lg bg-surface-container">
              <h4 className="font-display text-xl font-bold text-primary">Comprometimento</h4>
              <p className="font-body text-sm text-on-surface-variant">Honrar o que prometemos.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. NOSSOS PILARES ── */}
      <section className="w-full bg-white py-16 md:py-24">
        <div className="max-w-[1280px] mx-auto px-4 md:px-10 flex flex-col items-center gap-12">
          <h2
            className="font-display text-3xl md:text-4xl font-bold tracking-wide text-center"
            style={{ color: "#2C2A24" }}
          >
            PILARES
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            {pillars.map((pillar) => (
              <div
                key={pillar.title}
                className="flex flex-col items-center text-center gap-4"
              >
                <span
                  className="material-symbols-outlined text-4xl"
                  style={{ color: "#C9A227" }}
                >
                  {pillar.icon}
                </span>
                <h4
                  className="font-display text-base font-bold"
                  style={{ color: "#C9A227" }}
                >
                  {pillar.title}
                </h4>
                <p className="font-body text-xs md:text-sm text-on-surface-variant leading-relaxed max-w-xs">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
