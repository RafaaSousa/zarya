import React, { useRef, useCallback, useEffect } from "react";

// ─── Hook de scroll reveal (mesmo padrão das outras seções) ───────────────
function useScrollReveal(threshold = 0.15) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-visible");
          el.querySelectorAll(
            ".anim-fade-up, .anim-slide-left, .anim-slide-right, .anim-scale",
          ).forEach((child) => child.classList.add("is-visible"));
          observer.unobserve(el);
        }
      },
      { threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

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

export default function Campanhas() {
  const trackRef = useRef(null);
  const revealRef = useScrollReveal(0.15);

  // Avança/retrocede 1 card por clique nas setas.
  // Usa scrollTo absoluto (para um snap-point exato) em vez de scrollBy
  // relativo, que se perde quando o carrossel já está numa posição "snapada".
  const scrollByCard = useCallback((dir) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector("figure");
    if (!card) return;
    const styles = getComputedStyle(track);
    const gap = parseFloat(styles.columnGap || styles.gap) || 0;
    const step = card.offsetWidth + gap;
    const max = track.scrollWidth - track.clientWidth;
    const index = Math.round(track.scrollLeft / step);
    const target = Math.min(Math.max((index + dir) * step, 0), max);
    track.scrollTo({ left: target, behavior: "smooth" });
  }, []);

  return (
    <div className="bg-[#2C2A24]">
      <section
        ref={revealRef}
        className="relative w-full overflow-hidden bg-[#2C2A24] py-16 md:py-24"
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

        {/* Cabeçalho */}
        <div className="relative z-10 px-4 md:px-10 mb-8 md:mb-10">
          <div className="max-w-[1280px] mx-auto flex flex-wrap items-end justify-between gap-4">
            <div className="flex flex-col gap-2 anim-fade-up">
              <h2 className="font-display text-6xl md:text-7xl lg:text-8xl font-normal leading-none text-[#C9A227]">
                Campanhas
              </h2>
            </div>

            {/* Setas de navegação (desktop) */}
            <div className="hidden md:flex items-center gap-3 anim-fade-up anim-delay-200">
              <button
                type="button"
                onClick={() => scrollByCard(-1)}
                aria-label="Ver foto anterior"
                className="w-12 h-12 rounded-full border border-[#C9A227]/40 text-[#C9A227] flex items-center justify-center transition-all duration-300 hover:bg-[#C9A227] hover:text-[#2C2A24] hover:border-[#C9A227] focus-visible:ring-2 focus-visible:ring-[#C9A227] focus-visible:ring-offset-2 focus-visible:ring-offset-[#2C2A24]"
              >
                <span className="material-symbols-outlined" aria-hidden="true">
                  arrow_back
                </span>
              </button>
              <button
                type="button"
                onClick={() => scrollByCard(1)}
                aria-label="Ver próxima foto"
                className="w-12 h-12 rounded-full border border-[#C9A227]/40 text-[#C9A227] flex items-center justify-center transition-all duration-300 hover:bg-[#C9A227] hover:text-[#2C2A24] hover:border-[#C9A227] focus-visible:ring-2 focus-visible:ring-[#C9A227] focus-visible:ring-offset-2 focus-visible:ring-offset-[#2C2A24]"
              >
                <span className="material-symbols-outlined" aria-hidden="true">
                  arrow_forward
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Carrossel — rolagem horizontal nativa (arrasto/swipe/setas) */}
        <div
          ref={trackRef}
          className="hide-scrollbar relative z-10 flex items-stretch gap-5 md:gap-8 overflow-x-auto snap-x snap-mandatory scroll-smooth px-4 md:px-10 pb-2"
        >
          {campanhas.map((foto, i) => (
            <figure
              key={foto.key}
              className={`group relative flex-shrink-0 snap-start overflow-hidden rounded-2xl shadow-2xl ring-1 ring-[#C9A227]/20 w-[85vw] sm:w-[64vw] md:w-[52vw] lg:w-[44vw] h-[60vh] md:h-[66vh] anim-fade-up anim-delay-${Math.min((i + 1) * 100, 600)}`}
            >
              {/* eager: são poucas fotos e ficam lado a lado num carrossel */}
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
