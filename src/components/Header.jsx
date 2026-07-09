import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const WHATSAPP_URL = "https://wa.me/5511931502102";

const NAV_SECTIONS = [
  { id: "home", label: "INÍCIO" },
  { id: "projeto-corporativo", label: "PROJETO CORPORATIVO" },
  { id: "contatos", label: "CONTATOS" },
];

function WhatsAppIcon({ className = "" }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16.001 3C8.821 3 3 8.822 3 16c0 2.53.722 4.997 2.091 7.118L3 29l6.085-1.997A12.94 12.94 0 0 0 16.001 29C23.18 29 29 23.179 29 16 29 8.822 23.18 3 16 3Z"
        fill="#D4AF37"
      />
      <path
        d="M16 5.118c-6.013 0-10.883 4.87-10.883 10.882 0 2.16.634 4.174 1.72 5.871l-1.273 3.708 3.84-1.228a10.84 10.84 0 0 0 5.596 1.53c6.012 0 10.882-4.87 10.882-10.881S22.012 5.118 16 5.118Zm6.35 15.348c-.263.74-1.53 1.414-2.108 1.5-.542.08-1.224.113-1.976-.127-.456-.145-1.04-.34-1.793-.665-3.154-1.362-5.206-4.537-5.365-4.748-.157-.21-1.284-1.707-1.284-3.257 0-1.551.815-2.313 1.103-2.628.289-.316.631-.394.84-.394.21 0 .42.002.604.011.194.01.453-.073.708.54.263.631.893 2.18.972 2.338.078.158.131.342.026.552-.105.21-.158.342-.315.526-.157.184-.33.41-.473.552-.157.157-.32.328-.138.644.184.316.816 1.345 1.75 2.18 1.2 1.07 2.212 1.402 2.528 1.56.315.158.499.132.683-.078.184-.21.788-.92.998-1.236.21-.315.42-.263.709-.158.288.105 1.827.86 2.14 1.016.316.158.526.236.604.367.08.132.08.764-.183 1.505Z"
        fill="#fff"
      />
    </svg>
  );
}

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const isLanding = location.pathname === "/";
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const observerRef = useRef(null);

  // Track scroll elevation for shadow effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // IntersectionObserver — detect which section is in view
  useEffect(() => {
    // Fora da landing page não há seções para destacar
    if (!isLanding) {
      setActiveSection(null);
      return;
    }

    // Ao (re)entrar na landing, começa no topo até o observer refinar
    setActiveSection("home");

    const sectionIds = NAV_SECTIONS.map((s) => s.id);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        // Trigger when the section enters the top 30% of the viewport
        rootMargin: "-10% 0px -60% 0px",
        threshold: 0,
      }
    );

    observerRef.current = observer;

    // Observe all sections (may not exist until LandingPage mounts)
    const observeSections = () => {
      sectionIds.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
      });
    };

    // Give LandingPage time to mount
    const timer = setTimeout(observeSections, 300);
    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [isLanding]);

  const toggleDrawer = () => setIsDrawerOpen((prev) => !prev);

  const handleNavClick = useCallback(
    (sectionId) => {
      setIsDrawerOpen(false);

      const scrollToSection = () => {
        const el = document.getElementById(sectionId);
        if (el) {
          const headerHeight = 80;
          const top = el.getBoundingClientRect().top + window.scrollY - headerHeight;
          window.scrollTo({ top, behavior: "smooth" });
        }
      };

      if (location.pathname !== "/") {
        // Vindo de outra página: volta à landing e aguarda montar
        navigate("/");
        setTimeout(scrollToSection, 350);
      } else {
        // Give drawer time to close before scrolling
        setTimeout(scrollToSection, 150);
      }
    },
    [location.pathname, navigate]
  );

  return (
    <>
      {/* ── Mobile Drawer Overlay ── */}
      <div
        className={`fixed inset-0 z-[100] transition-all duration-300 ${
          isDrawerOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
        aria-hidden={!isDrawerOpen}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-on-surface/20 backdrop-blur-sm transition-opacity duration-300 ${
            isDrawerOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={toggleDrawer}
        />
        {/* Drawer */}
        <div
          className={`absolute top-0 left-0 w-[280px] h-full bg-[#F7F4EF] shadow-2xl transition-transform duration-300 ease-in-out flex flex-col ${
            isDrawerOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          role="dialog"
          aria-modal="true"
          aria-label="Menu de navegação"
        >
          {/* Drawer Header */}
          <div className="p-6 border-b border-outline-variant/30 flex justify-between items-center">
            <button
              onClick={() => handleNavClick("home")}
              className="flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded"
              aria-label="Ir para início"
            >
              <img
                alt="Zaryá Ótica Logo"
                className="h-10 w-auto object-contain"
                src="/logo/logo horizontal_color.svg"
                onError={(e) => {
                  e.target.src =
                    "https://lh3.googleusercontent.com/aida-public/AB6AXuD7jz3ZptAhxybLaDXjrtfrP_VcgV3gOhHfWY1VSjFCoeVOisRKSRrhh0u8rMhh2JJ294xMCMQAGVO0vT6FQcmvA8teNh3VJlp7vgWWyA9fTx8GfPtDYhsTroXAv-r6S46-S7RqX5rIJ4ZEQH1-k80btvVfxo3VaWSTJkQHStbtMYCpfTRS0L6KNYSOMrWP6CgiRoveHxkwGQD4wJHo-xAi17REHXtl_8LsRqCAqNdRfY3tnsjCSNlAdg_o3QwJPNGXUJLfPlIRsOI";
                }}
              />
            </button>
            <button
              className="p-2 text-on-surface-variant hover:bg-primary/10 rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-primary"
              onClick={toggleDrawer}
              aria-label="Fechar menu"
            >
              <span className="material-symbols-outlined" aria-hidden="true">close</span>
            </button>
          </div>

          {/* Drawer Nav */}
          <nav className="flex flex-col p-6 gap-2" aria-label="Navegação mobile">
            {NAV_SECTIONS.map((section) => {
              const isActive = activeSection === section.id;
              return (
                <button
                  key={section.id}
                  onClick={() => handleNavClick(section.id)}
                  aria-current={isActive ? "page" : undefined}
                  className={`text-left font-body text-sm font-semibold tracking-wider py-3 px-4 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "text-primary bg-primary/8"
                      : "text-on-surface hover:text-primary hover:bg-primary/5"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    {isActive && (
                      <span
                        className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0"
                        aria-hidden="true"
                      />
                    )}
                    {section.label}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Drawer Footer CTA */}
          <div className="mt-auto p-6 border-t border-outline-variant/30">
            <p className="font-body text-sm text-on-surface-variant mb-4">
              Soluções ópticas corporativas com elegância e cuidado.
            </p>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center bg-primary text-on-primary py-4 rounded-full font-body text-xs font-semibold tracking-widest uppercase hover:bg-primary/90 transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              aria-label="Solicitar orçamento pelo WhatsApp"
            >
              Solicitar Orçamento
            </a>
          </div>
        </div>
      </div>

      {/* ── Top Nav Bar ── */}
      <header
        className={`bg-[#F7F4EF]/92 backdrop-blur-md border-b border-outline-variant/30 w-full sticky top-0 z-50 transition-all duration-300 ${
          scrolled ? "shadow-md" : ""
        }`}
        role="banner"
      >
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop flex justify-between items-center h-20 relative">

          {/* Mobile: Hamburger (Left) */}
          <button
            className="md:hidden p-2 text-primary hover:bg-primary/10 rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-primary"
            onClick={toggleDrawer}
            aria-label="Abrir menu de navegação"
            aria-expanded={isDrawerOpen}
            aria-controls="mobile-drawer"
          >
            <span className="material-symbols-outlined text-[28px]" aria-hidden="true">menu</span>
          </button>

          {/* Logo — centred on mobile, left on desktop */}
          <button
            className="flex items-center gap-2 hover:opacity-80 transition-opacity duration-200 absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded"
            onClick={() => handleNavClick("home")}
            aria-label="Início — Zaryá Ótica"
          >
            <img
              alt="Zaryá Ótica"
              className="h-10 md:h-12 w-auto object-contain"
              src="/logo/logo horizontal_color.svg"
              onError={(e) => {
                e.target.src =
                  "https://lh3.googleusercontent.com/aida-public/AB6AXuD7jz3ZptAhxybLaDXjrtfrP_VcgV3gOhHfWY1VSjFCoeVOisRKSRrhh0u8rMhh2JJ294xMCMQAGVO0vT6FQcmvA8teNh3VJlp7vgWWyA9fTx8GfPtDYhsTroXAv-r6S46-S7RqX5rIJ4ZEQH1-k80btvVfxo3VaWSTJkQHStbtMYCpfTRS0L6KNYSOMrWP6CgiRoveHxkwGQD4wJHo-xAi17REHXtl_8LsRqCAqNdRfY3tnsjCSNlAdg_o3QwJPNGXUJLfPlIRsOI";
              }}
            />
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Navegação principal" role="navigation">
            {NAV_SECTIONS.map((section) => {
              const isActive = activeSection === section.id;
              return (
                <button
                  key={section.id}
                  onClick={() => handleNavClick(section.id)}
                  aria-current={isActive ? "page" : undefined}
                  className={`relative font-body text-xs font-semibold tracking-wider transition-all duration-200 px-4 py-2 rounded-full ${
                    isActive
                      ? "text-primary"
                      : "text-on-surface-variant hover:text-primary hover:bg-primary/5"
                  }`}
                >
                  {section.label}
                  {/* Active underline indicator */}
                  <span
                    className={`absolute bottom-0 left-4 right-4 h-0.5 rounded-full bg-primary transition-all duration-300 ${
                      isActive ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
                    }`}
                    style={{ transformOrigin: "left" }}
                    aria-hidden="true"
                  />
                </button>
              );
            })}
          </nav>

          {/* WhatsApp Button */}
          <div className="flex items-center gap-4">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Abrir conversa no WhatsApp"
              title="Fale conosco pelo WhatsApp"
              className="header-whatsapp-button flex h-11 w-11 items-center justify-center rounded-full bg-primary text-on-primary shadow-[0px_4px_20px_rgba(115,92,0,0.2)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-on-primary-container hover:shadow-[0px_8px_25px_rgba(115,92,0,0.3)] active:translate-y-0 active:bg-on-primary-container focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 md:h-12 md:w-12"
            >
              <span className="sr-only">Abrir conversa no WhatsApp</span>
              <WhatsAppIcon className="h-6 w-6 shrink-0 md:h-7 md:w-7" />
            </a>
          </div>
        </div>
      </header>
    </>
  );
}
