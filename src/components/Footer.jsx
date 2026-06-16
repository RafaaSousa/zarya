import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-surface-container-highest w-full border-t border-outline-variant/30 mt-auto">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand */}
        <div className="flex flex-col gap-4">
          <span className="font-display text-2xl font-bold text-primary">Zaryá Ótica</span>
          <p className="font-body text-sm text-on-surface-variant max-w-xs">
            Transformando a forma como as pessoas enxergam sua rotina e sua qualidade visual.
          </p>
        </div>

        {/* Links */}
        <div className="col-span-1 md:col-span-2 flex flex-col sm:flex-row gap-8 md:gap-16">
          <div className="flex flex-col gap-2">
            <span className="font-body text-xs font-bold text-on-surface uppercase tracking-wider mb-2">Institucional</span>
            <Link className="font-body text-sm text-on-surface-variant hover:text-primary transition-colors" to="/quemsomos">Quem somos</Link>
            <Link className="font-body text-sm text-on-surface-variant hover:text-primary transition-colors" to="/projetocorporativo">SIPAT Empresas</Link>
            <Link className="font-body text-sm text-on-surface-variant hover:text-primary transition-colors" to="/manutencao">Catálogo</Link>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-body text-xs font-bold text-on-surface uppercase tracking-wider mb-2">Legal</span>
            <a className="font-body text-sm text-on-surface-variant hover:text-primary transition-colors" href="#">Política de Privacidade</a>
            <a className="font-body text-sm text-on-surface-variant hover:text-primary transition-colors" href="#">Termos de Uso</a>
          </div>
        </div>

        {/* Contact/Social */}
        <div className="flex flex-col gap-4">
          <span className="font-body text-xs font-bold text-on-surface uppercase tracking-wider mb-2">Contato</span>
          <a className="flex items-center gap-2 font-body text-sm text-on-surface-variant hover:text-primary transition-colors" href="mailto:contato@zaryaotica.com.br">
            <span className="material-symbols-outlined text-[20px]">mail</span>
            contato@zaryaotica.com.br
          </a>
          <a className="flex items-center gap-2 font-body text-sm text-on-surface-variant hover:text-primary transition-colors" href="tel:+550000000000">
            <span className="material-symbols-outlined text-[20px]">call</span>
            (00) 00000-0000
          </a>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-outline-variant/20">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="font-body text-sm text-on-surface-variant">
            © {new Date().getFullYear()} Zaryá Ótica. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
