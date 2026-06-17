import React, { useEffect, useRef } from "react";

// ─── Scroll reveal hook ───────────────────────────────────────────────────
function useScrollReveal(options = {}) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-visible");
          // also trigger children with anim classes
          el.querySelectorAll(".anim-fade-up, .anim-slide-left, .anim-slide-right, .anim-scale").forEach(
            (child) => child.classList.add("is-visible")
          );
          observer.unobserve(el);
        }
      },
      { threshold: 0.1, ...options }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

const services = [
  {
    icon: "visibility",
    title: "Exames de Acuidade",
    description:
      "Triagem visual e relatório realizado por especialistas no próprio local de trabalho. Identificamos e corrigimos necessidades visuais.",
  },
  {
    icon: "remove_red_eye",
    title: "Ótica Móvel",
    description:
      "Apresentação de um catálogo repleto de armações modernas. Colaboradores podem escolher e encomendar seus óculos sem sair da empresa.",
  },
  {
    icon: "co_present",
    title: "Palestras Educativas",
    description:
      "Sessões instrutivas sobre saúde ocular na era digital, ergonomia visual e prevenção da Síndrome de Visão de Computador.",
  },
];

const benefits = [
  "Maior engajamento dos colaboradores",
  "Participação espontânea",
  "Experiência diferenciada para campanhas internas",
  "Ação prática e adaptável",
  "Fortalecimento da percepção de cuidado",
  "Abrangência corporativa com alto impacto visual",
];

export default function ProjetoCorporativo() {
  const heroRef     = useScrollReveal();
  const servicesRef = useScrollReveal();
  const benefitsRef = useScrollReveal();

  return (
    <div className="bg-background text-on-surface font-body overflow-x-hidden">

      {/* ── 1. HERO ── */}
      <section className="w-full bg-[#F7F4EF]">
        <div
          ref={heroRef}
          className="max-w-[1280px] mx-auto px-4 md:px-10 py-16 md:py-20 flex flex-col md:flex-row items-center gap-10 md:gap-14 anim-fade-up"
        >
          {/* Left: Text */}
          <div className="flex-1 flex flex-col gap-6">
            <h2
              className="font-display text-5xl md:text-6xl lg:text-7xl font-normal leading-none"
              style={{ color: "#C9A227" }}
            >
              Percepção,<br />bem-estar e<br />ambiente<br />corporativo
            </h2>

            <div className="flex flex-col gap-3 text-sm md:text-base text-on-surface-variant leading-relaxed max-w-md">
              <p>
                Rotinas intensas, excesso de telas e vida da manda visual fazem parte da realidade corporativa atual.
              </p>
              <p>
                A fadiga visual impacta atenção, produtividade, foco e bem-estar dos colaboradores.
              </p>
              <p>
                Por isso, empresas têm buscado ações mais modernas, humanistas e preventivas dentro do ambiente corporativo.
              </p>
            </div>

            {/* NR-1 Callout */}
            <div className="flex items-start gap-3 bg-white border border-[#C9A227]/30 rounded-xl p-4 max-w-md shadow-sm">
              <span
                className="material-symbols-outlined text-2xl mt-0.5 shrink-0"
                style={{ color: "#C9A227" }}
              >
                info
              </span>
              <p className="font-body text-xs text-on-surface-variant leading-relaxed">
                A atualização da NR 1 reforça a importância de ações voltadas ao{" "}
                <span className="font-semibold" style={{ color: "#C9A227" }}>bem-estar</span>{" "}
                e às formas de{" "}
                <span className="font-semibold" style={{ color: "#C9A227" }}>relações profissionais</span>{" "}
                no ambiente corporativo.
              </p>
            </div>
          </div>

          {/* Right: Office Photo */}
          <div className="flex-grow w-full max-w-lg md:max-w-none anim-slide-right anim-delay-200">
            <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="/zarya-oculos.jpg"
                alt="Profissional usando óculos elegantes de proteção visual no escritório"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. AÇÕES IN-COMPANY & SIPAT ── */}
      <section className="w-full bg-white py-16 md:py-20">
        <div ref={servicesRef} className="max-w-[1280px] mx-auto px-4 md:px-10 flex flex-col items-center gap-10">
          <div className="text-center flex flex-col gap-3 max-w-2xl anim-fade-up">
            <h2
              className="font-display text-4xl md:text-5xl font-normal"
              style={{ color: "#2C2A24" }}
            >
              Ações In-Company &amp; SIPAT
            </h2>
            <p className="font-body text-sm md:text-base text-on-surface-variant">
              Levamos o cuidado visual diretamente para sua empresa. Nossa ótica móvel
              transforma semanas de prevenção em experiências memoráveis de saúde integrativa.
            </p>
          </div>

          {/* 3 Service Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            {services.map((svc, i) => (
              <div
                key={svc.title}
                className={`flex flex-col gap-3 p-6 rounded-2xl border border-[#C9A227]/20 bg-[#FFFDF8] shadow-sm hover:shadow-md hover:-translate-y-1 transition-all anim-fade-up anim-delay-${(i + 1) * 150}`}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: "rgba(201,162,39,0.12)" }}
                >
                  <span
                    className="material-symbols-outlined text-xl"
                    style={{ color: "#C9A227" }}
                  >
                    {svc.icon}
                  </span>
                </div>
                <h3
                  className="font-playfair text-base font-bold"
                  style={{ color: "#2C2A24" }}
                >
                  {svc.title}
                </h3>
                <p className="font-body text-xs text-on-surface-variant leading-relaxed">
                  {svc.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. BENEFÍCIOS DA EXPERIÊNCIA ── */}
      <section className="w-full bg-[#F7F4EF] py-16 md:py-20">
        <div ref={benefitsRef} className="max-w-[1280px] mx-auto px-4 md:px-10 flex flex-col md:flex-row items-center gap-12 md:gap-16">

          {/* Left: Arch photo */}
          <div className="flex-1 w-full flex justify-center anim-slide-left">
            <div
              className="w-full max-w-xs md:max-w-sm aspect-[3/4] overflow-hidden shadow-2xl"
              style={{ borderRadius: "50% 50% 0 0 / 40% 40% 0 0" }}
            >
              <img
                src="/zarya-optico.jpg"
                alt="Profissional corporativo sorridente utilizando óculos elegantes no escritório"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>

          {/* Right: Benefits list */}
          <div className="flex-1 flex flex-col gap-6 anim-slide-right anim-delay-200">
            <h2
              className="font-display text-4xl md:text-5xl lg:text-6xl font-normal leading-none"
              style={{ color: "#C9A227" }}
            >
              Benefícios da<br />experiência
            </h2>

            <ul className="flex flex-col gap-3">
              {benefits.map((benefit, i) => (
                <li key={benefit} className={`flex items-center gap-3 anim-fade-up anim-delay-${(i + 1) * 80}`}>
                  <span
                    className="material-symbols-outlined text-lg shrink-0"
                    style={{ color: "#C9A227" }}
                  >
                    check_circle
                  </span>
                  <span className="font-body text-sm text-on-surface-variant">
                    {benefit}
                  </span>
                </li>
              ))}
            </ul>

            {/* CTA contact strip */}
            <div className="mt-4 pt-6 border-t border-[#C9A227]/20">
              <p
                className="font-body text-xs font-bold tracking-widest uppercase mb-3"
                style={{ color: "#2C2A24" }}
              >
                Quem faz tudo acontecer
              </p>
              <div className="flex flex-wrap gap-4 text-xs text-on-surface-variant font-body">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-base" style={{ color: "#C9A227" }}>call</span>
                  (11) 9999-9999
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-base" style={{ color: "#C9A227" }}>call</span>
                  (11) 8888-2222
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-base" style={{ color: "#C9A227" }}>call</span>
                  (11) 7777-0001
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
