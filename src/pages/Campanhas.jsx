import React, { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ─── Carrega automaticamente todas as fotos das campanhas ─────────────────
const modules = import.meta.glob(
  "../assets/campanhas/*.{jpeg,jpg,png,webp}",
  { eager: true, import: "default" },
);
const campanhas = Object.entries(modules)
  // ordena por nome de arquivo de forma natural (imagem_1, imagem_2, …)
  .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
  .map(([path, src], i) => ({
    src,
    alt: `Campanha Zaryá nas empresas — foto ${i + 1}`,
    key: path,
  }));

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function Campanhas() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  // Fallback acessível: sem scroll-jack quando o usuário prefere menos movimento.
  const [reduced] = useState(prefersReducedMotion);

  useLayoutEffect(() => {
    if (reduced) return;
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const ctx = gsap.context(() => {
      // Distância horizontal a percorrer = largura total do track menos a viewport.
      const getScrollAmount = () =>
        Math.max(0, track.scrollWidth - window.innerWidth);

      const tween = gsap.to(track, {
        x: () => -getScrollAmount(),
        ease: "none",
      });

      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: () => `+=${getScrollAmount()}`,
        pin: true,
        animation: tween,
        scrub: 1, // rolar pra baixo avança as fotos; rolar pra cima retrocede
        invalidateOnRefresh: true,
        anticipatePin: 1,
      });
    }, section);

    // No dev do Vite (e antes das imagens carregarem) as medidas podem sair
    // erradas; recalcula quando tudo estiver pronto.
    const refresh = () => ScrollTrigger.refresh();
    const raf = requestAnimationFrame(refresh);
    const imgs = Array.from(section.querySelectorAll("img"));
    let pending = imgs.length;
    const onImg = () => {
      if (--pending <= 0) refresh();
    };
    imgs.forEach((img) => {
      if (img.complete) onImg();
      else {
        img.addEventListener("load", onImg, { once: true });
        img.addEventListener("error", onImg, { once: true });
      }
    });
    window.addEventListener("load", refresh);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("load", refresh);
      ctx.revert();
    };
  }, [reduced]);

  return (
    <div className="bg-[#2C2A24]">
      <section
        ref={sectionRef}
        className={`relative w-full overflow-hidden bg-[#2C2A24] ${
          reduced ? "" : "h-screen"
        }`}
        style={reduced ? undefined : { minHeight: "100vh" }}
      >
        {/* Gradiente decorativo dourado */}
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 20% 20%, rgba(201,162,39,0.10) 0%, transparent 70%)",
          }}
        />

        {/* Cabeçalho sobre o carrossel */}
        <div
          className={`z-20 w-full px-4 md:px-10 ${
            reduced ? "relative pt-14 md:pt-20" : "absolute top-0 left-0 pt-[5.2rem] md:pt-24"
          }`}
        >
          <div className="max-w-[1280px] mx-auto flex flex-col gap-2">
            <h2 className="font-display text-6xl md:text-6xl font-normal leading-none text-[#C9A227]">
              Campanhas
            </h2>
          </div>
        </div>

        {/* Track horizontal — controlado pelo GSAP, ou rolável no fallback */}
        <div
          ref={trackRef}
          className={`z-10 flex items-center gap-5 md:gap-8 pl-4 md:pl-10 pr-[10vw] will-change-transform ${
            reduced
              ? "relative overflow-x-auto py-10 snap-x snap-mandatory"
              : "absolute inset-0 h-full pt-20 md:pt-44 pb-8"
          }`}
        >
          {campanhas.map((foto) => (
            <figure
              key={foto.key}
              className={`group relative flex-shrink-0 overflow-hidden rounded-2xl shadow-2xl ring-1 ring-[#C9A227]/20 w-[85vw] sm:w-[64vw] md:w-[52vw] lg:w-[44vw] ${
                reduced ? "h-[64vh] snap-center" : "h-[60vh] md:h-[66vh]"
              }`}
            >
              {/* eager: o scroll horizontal é via transform do GSAP, então o
                  lazy-loading nativo (baseado na posição de layout) nunca
                  dispararia para as fotos fora da dobra. */}
              <img
                src={foto.src}
                alt={foto.alt}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="eager"
                decoding="async"
                draggable="false"
              />
            </figure>
          ))}
        </div>
      </section>
    </div>
  );
}
