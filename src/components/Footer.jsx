import React from "react";

const WHATSAPP_URL = "https://wa.me/5511931502102";

function scrollTo(sectionId) {
  const el = document.getElementById(sectionId);
  if (el) {
    const top = el.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: "smooth" });
  }
}

export default function Footer() {
  return (
    <footer className="bg-surface-container-highest w-full border-t border-outline-variant/30 mt-auto">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12 grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* Brand */}
        <div className="flex flex-col gap-4">
          <button
            onClick={() => scrollTo("home")}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded w-fit"
            aria-label="Voltar ao início"
          >
            <img
              alt="Zaryá Ótica Logo"
              className="h-10 md:h-12 w-auto object-contain"
              src="/logo/logo horizontal_color.svg"
              onError={(e) => {
                e.target.src =
                  "https://lh3.googleusercontent.com/aida-public/AB6AXuD7jz3ZptAhxybLaDXjrtfrP_VcgV3gOhHfWY1VSjFCoeVOisRKSRrhh0u8rMhh2JJ294xMCMQAGVO0vT6FQcmvA8teNh3VJlp7vgWWyA9fTx8GfPtDYhsTroXAv-r6S46-S7RqX5rIJ4ZEQH1-k80btvVfxo3VaWSTJkQHStbtMYCpfTRS0L6KNYSOMrWP6CgiRoveHxkwGQD4wJHo-xAi17REHXtl_8LsRqCAqNdRfY3tnsjCSNlAdg_o3QwJPNGXUJLfPlIRsOI";
              }}
            />
          </button>
          <p className="font-body text-sm text-on-surface-variant max-w-xs">
            Transformando a forma como as pessoas enxergam sua rotina e sua qualidade visual.
          </p>
        </div>

        {/* Navigation Links */}
        <div className="col-span-1 md:col-span-2 flex flex-col sm:flex-row gap-8 md:gap-16">
          <div className="flex flex-col gap-2">
            <span className="font-body text-xs font-bold text-on-surface uppercase tracking-wider mb-2">Navegação</span>
            <button
              onClick={() => scrollTo("home")}
              className="font-body text-sm text-on-surface-variant hover:text-primary transition-colors text-left focus-visible:ring-2 focus-visible:ring-primary rounded w-fit"
            >
              Início
            </button>
            <button
              onClick={() => scrollTo("projeto-corporativo")}
              className="font-body text-sm text-on-surface-variant hover:text-primary transition-colors text-left focus-visible:ring-2 focus-visible:ring-primary rounded w-fit"
            >
              Projeto Corporativo
            </button>
            <button
              onClick={() => scrollTo("contatos")}
              className="font-body text-sm text-on-surface-variant hover:text-primary transition-colors text-left focus-visible:ring-2 focus-visible:ring-primary rounded w-fit"
            >
              Contatos
            </button>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-body text-xs font-bold text-on-surface uppercase tracking-wider mb-2">Legal</span>
            <a
              className="font-body text-sm text-on-surface-variant hover:text-primary transition-colors focus-visible:ring-2 focus-visible:ring-primary rounded w-fit"
              href="#"
            >
              Política de Privacidade
            </a>
            <a
              className="font-body text-sm text-on-surface-variant hover:text-primary transition-colors focus-visible:ring-2 focus-visible:ring-primary rounded w-fit"
              href="#"
            >
              Termos de Uso
            </a>
          </div>
        </div>

        {/* Contact */}
        <div className="flex flex-col gap-4">
          <span className="font-body text-xs font-bold text-on-surface uppercase tracking-wider mb-2">Contato</span>
          <a
            className="flex items-center gap-2 font-body text-sm text-on-surface-variant hover:text-primary transition-colors focus-visible:ring-2 focus-visible:ring-primary rounded w-fit"
            href="mailto:atendimento@zaryaotica.com.br"
          >
            <span className="material-symbols-outlined text-[20px]" aria-hidden="true">mail</span>
            atendimento@zaryaotica.com.br
          </a>
          <a
            className="flex items-center gap-2 font-body text-sm text-on-surface-variant hover:text-primary transition-colors focus-visible:ring-2 focus-visible:ring-primary rounded w-fit"
            href="tel:+5511931502102"
          >
            <span className="material-symbols-outlined text-[20px]" aria-hidden="true">call</span>
            (11) 93150-2102
          </a>
          <a
            className="flex items-center gap-2 font-body text-sm text-on-surface-variant hover:text-primary transition-colors focus-visible:ring-2 focus-visible:ring-primary rounded w-fit"
            href="tel:+5511931502102"
          >
            <span className="material-symbols-outlined text-[20px]" aria-hidden="true">call</span>
            (11) 98675-6809
          </a>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 font-body text-sm text-primary font-semibold hover:text-[#554300] transition-colors focus-visible:ring-2 focus-visible:ring-primary rounded w-fit"
            aria-label="Fale conosco pelo WhatsApp"
          >
            <span className="material-symbols-outlined text-[20px]" aria-hidden="true">forum</span>
            WhatsApp
          </a>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-outline-variant/20">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="font-body text-sm text-on-surface-variant">
            © {new Date().getFullYear()} Zaryá Ótica. Todos os direitos reservados.
          </p>
          <p className="font-body text-xs text-on-surface-variant/60">
            Saúde visual corporativa com elegância e cuidado.
          </p>
        </div>
      </div>
    </footer>
  );
}
