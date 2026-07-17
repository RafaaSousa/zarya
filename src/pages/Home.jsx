import React, { useEffect, useRef } from "react";

// ─── Hook de scroll reveal ────────────────────────────────────────────────
function useScrollReveal(threshold = 0.15) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // marca o container e todos os filhos com classe anim-*
          el.classList.add("is-visible");
          el.querySelectorAll(
            ".anim-fade-up, .anim-slide-left, .anim-slide-right, .anim-scale"
          ).forEach((child) => child.classList.add("is-visible"));
          observer.unobserve(el);
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

// ─── Função utilitária para scroll suave ───────────────────────────────────
export const handleSmoothScroll = (e, targetId) => {
  e.preventDefault();
  const target = document.getElementById(targetId);
  if (target) {
    const headerOffset = 80; // Altura do cabeçalho fixo
    const elementPosition = target.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.scrollY - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  } else {
    window.location.hash = targetId;
  }
};

// ─── Dados ───────────────────────────────────────────────────────────────
const valores = [
  { icon: "star",          title: "Excelência",       desc: "Buscar sempre o melhor." },
  { icon: "handshake",     title: "Respeito",         desc: "Valorizar cada pessoa." },
  { icon: "verified",      title: "Confiança",        desc: "Construir relações duradouras." },
  { icon: "trending_up",   title: "Evolução",         desc: "Aprender e melhorar continuamente." },
  { icon: "favorite",      title: "Gratidão",         desc: "Reconhecer cada conquista." },
  { icon: "task_alt",      title: "Comprometimento",  desc: "Honrar o que prometemos." },
];

const steps = [
  { num: "01", title: "Planejamento",  desc: "Entendemos o perfil da empresa." },
  { num: "02", title: "Estruturação",  desc: "Preparamos toda a ação." },
  { num: "03", title: "Ativação",      desc: "Levamos a experiência até os colaboradores." },
];

const sectors = ["Indústrias", "Escritórios", "Clínicas", "Centros Logísticos"];

// ─── HERO ─────────────────────────────────────────────────────────────────
function Hero() {
  const logoRef  = useRef(null);
  const titleRef = useRef(null);
  const ctaRef   = useRef(null);

  useEffect(() => {
    const ts = [
      setTimeout(() => logoRef.current?.classList.add("is-visible"),  100),
      setTimeout(() => titleRef.current?.classList.add("is-visible"), 400),
      setTimeout(() => ctaRef.current?.classList.add("is-visible"),   700),
    ];
    return () => ts.forEach(clearTimeout);
  }, []);

  return (
    <div className="relative min-h-[calc(100vh-80px)] flex flex-col items-center justify-center px-margin-mobile md:px-margin-desktop overflow-hidden">
      {/* Gradiente radial dourado */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 40%, rgba(201,162,39,0.10) 0%, transparent 70%)",
        }}
      />
      {/* Linha topo */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 md:h-32"
        aria-hidden="true"
      />

      {/* Logo (vertical: olho centralizado sobre o nome, alinhado ao centro) */}
      <div ref={logoRef} className="anim-fade-up mb-12 md:mb-16 flex justify-center w-full">
        <img
          src="/logo/logo vertical_color.svg"
          alt="Zaryá Ótica"
          className="h-52 md:h-72 lg:h-80 w-auto object-contain drop-shadow-md"
          loading="eager"
          onError={(e) => {
            e.target.src =
              "https://lh3.googleusercontent.com/aida-public/AB6AXuD7jz3ZptAhxybLaDXjrtfrP_VcgV3gOhHfWY1VSjFCoeVOisRKSRrhh0u8rMhh2JJ294xMCMQAGVO0vT6FQcmvA8teNh3VJlp7vgWWyA9fTx8GfPtDYhsTroXAv-r6S46-S7RqX5rIJ4ZEQH1-k80btvVfxo3VaWSTJkQHStbtMYCpfTRS0L6KNYSOMrWP6CgiRoveHxkwGQD4wJHo-xAi17REHXtl_8LsRqCAqNdRfY3tnsjCSNlAdg_o3QwJPNGXUJLfPlIRsOI";
          }}
        />
      </div>

      {/* Frase */}
      <h1
        ref={titleRef}
        className="anim-fade-up text-center font-display font-normal leading-none max-w-4xl"
        style={{
          fontSize: "clamp(2.25rem, 4.5vw, 3.5rem)",
          color: "#C9A227",
        }}
      >
        Experiências que geram percepção,
        <br className="hidden sm:block" /> cuidado e bem-estar.
      </h1>

      {/* Divisória */}
      <div
        className="my-8 md:my-12 w-12 h-px"
        aria-hidden="true"
      />

      {/* CTAs */}
      <div ref={ctaRef} className="anim-fade-up flex flex-col sm:flex-row gap-4 items-center">
        <a
          href="#contatos"
          onClick={(e) => handleSmoothScroll(e, 'contatos')}
          className="group relative inline-flex items-center justify-center bg-primary text-on-primary font-body text-xs font-bold tracking-widest uppercase px-12 py-4 rounded-full shadow-[0px_4px_24px_rgba(115,92,0,0.25)] transition-all duration-300 hover:bg-[#554300] hover:-translate-y-1 hover:shadow-[0px_8px_32px_rgba(115,92,0,0.35)] focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          aria-label="Solicitar orçamento — ir para seção de contato"
        >
          <span>Solicitar Orçamento</span>
          <span className="material-symbols-outlined text-[18px] absolute right-5 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">
            arrow_forward
          </span>
        </a>
        <a
          href="#projeto-corporativo"
          onClick={(e) => handleSmoothScroll(e, 'projeto-corporativo')}
          className="inline-flex items-center gap-2 border border-primary/50 text-primary font-body text-xs font-bold tracking-widest uppercase px-10 py-4 rounded-full transition-all duration-300 hover:bg-primary/8 hover:-translate-y-1 hover:border-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          aria-label="Conhecer o projeto corporativo"
        >
          Conhecer o Projeto
        </a>
      </div>

      {/* Linha rodapé */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-24 md:h-32"
        aria-hidden="true"
      />
    </div>
  );
}

// ─── MISSÃO + VISÃO ───────────────────────────────────────────────────────
function MissaoVisao() {
  const ref = useScrollReveal(0.1);
  return (
    <section className="w-full bg-[#2C2A24] py-20 md:py-28 overflow-hidden">
      <div
        ref={ref}
        className="max-w-[1280px] mx-auto px-4 md:px-10 grid grid-cols-1 md:grid-cols-2 gap-0"
      >
        {/* MISSÃO */}
        <div className="anim-slide-left flex flex-col gap-6 p-10 md:p-14 md:border-r border-[#C9A227]/15 border-b md:border-b-0">
          <div className="flex items-center gap-4">
            <span className="material-symbols-outlined text-2xl" style={{ color: "#C9A227" }} aria-hidden="true">
              my_location
            </span>
            <span className="font-body text-xs font-bold tracking-[0.3em] uppercase" style={{ color: "#C9A227" }}>
              Missão
            </span>
          </div>
          <p
            className="font-playfair text-xl md:text-2xl lg:text-3xl font-medium leading-relaxed"
            style={{ color: "#F7F0E6" }}
          >
            Cuidar da saúde visual das pessoas com{" "}
            <span style={{ color: "#C9A227" }}>excelência</span>,{" "}
            <span style={{ color: "#C9A227" }}>proximidade</span> e{" "}
            <span style={{ color: "#C9A227" }}>confiança</span>, oferecendo soluções que
            proporcionem mais conforto, bem-estar e qualidade de vida.
          </p>
        </div>

        {/* VISÃO */}
        <div className="anim-slide-right anim-delay-200 flex flex-col gap-6 p-10 md:p-14">
          <div className="flex items-center gap-4">
            <span className="material-symbols-outlined text-2xl" style={{ color: "#C9A227" }} aria-hidden="true">
              visibility
            </span>
            <span className="font-body text-xs font-bold tracking-[0.3em] uppercase" style={{ color: "#C9A227" }}>
              Visão
            </span>
          </div>
          <p
            className="font-playfair text-xl md:text-2xl lg:text-3xl font-medium leading-relaxed"
            style={{ color: "#F7F0E6" }}
          >
            Ser reconhecida como{" "}
            <span style={{ color: "#C9A227" }}>referência</span> em cuidado visual,
            inovação e atendimento{" "}
            <span style={{ color: "#C9A227" }}>humanizado</span>, impactando positivamente a
            vida das pessoas e das organizações.
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── VALORES ──────────────────────────────────────────────────────────────
function Valores() {
  const titleRef = useScrollReveal(0.1);
  const gridRef  = useScrollReveal(0.05);

  return (
    <section className="w-full bg-[#F7F4EF] py-20 md:py-28">
      <div className="max-w-[1280px] mx-auto px-4 md:px-10">

        {/* Título */}
        <div ref={titleRef} className="mb-14 md:mb-16 anim-fade-up">
          <span className="font-body text-xs font-bold tracking-[0.3em] uppercase text-primary mb-3 block">
            Nossos Valores
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-normal leading-none text-[#C9A227]">
            O que nos<br />
            <span style={{ color: "#C9A227" }}>move todo dia.</span>
          </h2>
        </div>

        {/* Grid 3 × 2 */}
        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {valores.map((v, i) => (
            <div
              key={v.title}
              className={`group relative flex flex-col gap-4 p-8 rounded-2xl border border-outline-variant/40 bg-white hover:border-[#C9A227]/50 hover:shadow-[0_8px_32px_rgba(201,162,39,0.10)] transition-all duration-500 hover:-translate-y-1 cursor-default anim-scale anim-delay-${(i % 3 + 1) * 100}`}
            >
              {/* Número decorativo */}

              {/*<span
                className="absolute top-6 right-7 font-display text-6xl md:text-7xl font-normal select-none transition-opacity duration-500 group-hover:opacity-0"
                style={{ color: "rgba(201,162,39,0.08)", lineHeight: 1 }}
                aria-hidden="true"
              >
                {String(i + 1).padStart(2, "0")}
              </span>*/}

              {/* Ícone + Título (lado a lado) */}
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-300 group-hover:bg-[#C9A227]/15"
                     style={{ background: "rgba(201,162,39,0.08)" }}>
                  <span className="material-symbols-outlined text-[22px] transition-colors duration-300"
                        style={{ color: "#C9A227" }} aria-hidden="true">
                    {v.icon}
                  </span>
                </div>
                <h3 className="font-playfair text-lg font-bold text-on-surface">{v.title}</h3>
              </div>

              {/* Descrição (embaixo) */}
              <p className="font-body text-sm text-on-surface-variant leading-relaxed">{v.desc}</p>

              {/* Linha de hover */}
              <div
                className="absolute bottom-0 left-6 right-6 h-0.5 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
                style={{ background: "linear-gradient(to right, #C9A227, transparent)" }}
                aria-hidden="true"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── COMO FUNCIONA ────────────────────────────────────────────────────────
function ComoFunciona() {
  const titleRef = useScrollReveal(0.1);
  const stepsRef = useScrollReveal(0.05);

  return (
    <section className="w-full bg-white py-20 md:py-28 overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-4 md:px-10">

        {/* Título */}
        <div ref={titleRef} className="text-center mb-16 anim-fade-up">
          <span className="font-body text-xs font-bold tracking-[0.3em] uppercase text-primary mb-3 block">
            Processo
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-normal text-[#C9A227] leading-tight">
            O que acontece quando a<br />
            <span style={{ color: "#C9A227" }}>empresa contrata a Zaryá?</span>
          </h2>
        </div>

        {/* Steps */}
        <div ref={stepsRef} className="relative grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4">

          {/* Linha conectora (desktop) */}
          <div
            className="hidden md:block absolute top-[2.75rem] left-[16.5%] right-[16.5%] h-px"
            aria-hidden="true"
            style={{ background: "linear-gradient(to right, #C9A227, rgba(201,162,39,0.2), #C9A227)" }}
          />

          {steps.map((step, i) => (
            <div
              key={step.num}
              className={`group flex flex-col items-center text-center gap-5 anim-fade-up anim-delay-${(i + 1) * 200}`}
            >
              {/* Número em círculo */}
              <div className="relative z-10 w-[5.5rem] h-[5.5rem] rounded-full flex flex-col items-center justify-center border-2 border-[#C9A227]/40 bg-white shadow-[0_0_0_8px_#F7F4EF] transition-all duration-500 group-hover:border-[#C9A227] group-hover:shadow-[0_0_0_8px_rgba(201,162,39,0.08)]">
                <span className="font-body text-xs font-bold tracking-widest uppercase" style={{ color: "#C9A227" }}>
                  {step.num}
                </span>
              </div>

              {/* Texto */}
              <div>
                <h3 className="font-playfair text-xl font-bold text-on-surface mb-2 group-hover:text-primary transition-colors duration-300">
                  {step.title}
                </h3>
                <p className="font-body text-sm text-on-surface-variant leading-relaxed max-w-[220px] mx-auto">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── IDEAL PARA ──────────────────────────────────────────────────────────
function IdealPara() {
  const ref = useScrollReveal(0.1);

  const icons = {
    "Indústrias":          "factory",
    "Escritórios":         "business_center",
    "Clínicas":            "local_hospital",
    "Centros Logísticos":  "local_shipping",
  };

  return (
    <section className="w-full bg-[#F7F4EF] py-20 md:py-28">
      <div className="max-w-[1280px] mx-auto px-4 md:px-10">

        {/* Título */}
        <div className="text-center mb-14">
          <span className="font-body text-xs font-bold tracking-[0.3em] uppercase text-primary mb-3 block">
            Segmentos
          </span>
          <h2 className="font-display text-4xl md:text-6xl font-normal text-[#C9A227]">
            Ideal para
          </h2>
        </div>

        {/* Cards */}
        <div ref={ref} className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {sectors.map((sector, i) => (
            <div
              key={sector}
              className={`group flex flex-col items-center justify-center gap-4 p-8 md:p-10 rounded-2xl border border-outline-variant/30 bg-white hover:border-[#C9A227]/50 hover:bg-[#C9A227]/4 hover:-translate-y-2 transition-all duration-500 cursor-default anim-scale anim-delay-${(i + 1) * 100}`}
            >
              <div className="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                   style={{ background: "rgba(201,162,39,0.10)" }}>
                <span className="material-symbols-outlined text-[28px]" style={{ color: "#C9A227" }} aria-hidden="true">
                  {icons[sector]}
                </span>
              </div>
              <span className="font-playfair text-base md:text-lg font-semibold text-on-surface text-center leading-snug group-hover:text-primary transition-colors duration-300">
                {sector}
              </span>
            </div>
          ))}
        </div>

        {/* CTA final */}
        <div className="mt-16 flex justify-center">
          <a
            href="#contatos"
            onClick={(e) => handleSmoothScroll(e, 'contatos')}
            className="group inline-flex items-center gap-3 bg-primary text-on-primary font-body text-xs font-bold tracking-widest uppercase px-10 py-4 rounded-full shadow-[0px_4px_24px_rgba(115,92,0,0.25)] transition-all duration-300 hover:bg-[#554300] hover:-translate-y-1 hover:shadow-[0px_8px_32px_rgba(115,92,0,0.35)] focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            aria-label="Solicitar orçamento — ir para seção de contato"
          >
            <span>Fale com a nossa equipe</span>
            <span className="material-symbols-outlined text-[18px] transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">
              arrow_forward
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── EXPORTAÇÃO ───────────────────────────────────────────────────────────
export default function Home() {
  return (
    <div className="bg-background text-on-surface font-body overflow-x-hidden">
      <Hero />
      <MissaoVisao />
      <Valores />
      <ComoFunciona />
      <IdealPara />
    </div>
  );
}
