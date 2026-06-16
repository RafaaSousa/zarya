import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const differentials = [
    {
      icon: "visibility",
      title: "Saúde Visual com Propósito",
      bgClass: "bg-primary/10",
      iconColor: "text-primary",
    },
    {
      icon: "groups",
      title: "Experiências que Engajam",
      bgClass: "bg-[#D4AF37]/10",
      iconColor: "text-[#D4AF37]",
    },
    {
      icon: "favorite",
      title: "Cuidado Leve e Acessível",
      bgClass: "bg-primary/10",
      iconColor: "text-primary",
    },
    {
      icon: "diversity_3",
      title: "Conexões que geram transformação",
      bgClass: "bg-[#D4AF37]/10",
      iconColor: "text-[#D4AF37]",
    },
  ];

  const benefits = [
    {
      icon: "medical_services",
      title: "Saúde Visual",
      description: "Avaliação visual no ambiente corporativo.",
    },
    {
      icon: "celebration",
      title: "SIPAT & Campanhas",
      description: "Experiência prática, leve e participativa.",
    },
    {
      icon: "loyalty",
      title: "Valorização dos Colaboradores",
      description: "Um benefício que gera percepção de cuidado.",
    },
  ];

  const steps = [
    {
      num: "1",
      title: "Planejamento",
      description: "Entendemos a necessidade da empresa.",
      borderColor: "border-primary",
    },
    {
      num: "2",
      title: "Estruturação",
      description: "Preparamos toda a experiência.",
      borderColor: "border-primary",
    },
    {
      num: "3",
      title: "Ativação",
      description: "Levamos a experiência até os colaboradores.",
      borderColor: "border-primary",
    },
  ];

  return (
    <div className="bg-background text-on-surface font-body overflow-x-hidden">
      {/* Hero Section */}
      <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column: Content */}
          <div
            className={`flex flex-col gap-6 order-2 lg:order-1 transition-all duration-1000 transform ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <span className="text-primary font-body text-xs font-bold tracking-widest uppercase">
              SAÚDE VISUAL CORPORATIVA
            </span>
            <h1 className="font-display text-2xl md:text-4xl lg:text-5xl text-on-surface uppercase leading-tight font-bold">
              <span className="text-[#D4AF37]">
                Experiências que geram percepção, cuidado e bem-estar.
              </span>
            </h1>
            <p className="font-body text-base md:text-lg text-on-surface-variant max-w-xl">
              • Estrutura montada dentro da empresa
              <br />
              • Exame de acuidade visual
              <br />
              • Condições especiais para colaboradores
              <br />• Ideal para SIPAT e campanhas internas
            </p>
            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <Link
                to="/contato"
                className="bg-primary hover:bg-[#554300] hover:-translate-y-1 text-on-primary font-body text-xs font-bold px-8 py-4 rounded-full transition-all duration-300 text-center shadow-[0px_4px_20px_rgba(115,92,0,0.2)] hover:shadow-[0px_8px_25px_rgba(115,92,0,0.3)]"
              >
                SOLICITAR ORÇAMENTO
              </Link>
              <Link
                to="/ProjetoCorporativo"
                className="border border-primary text-primary hover:bg-primary hover:text-on-primary hover:-translate-y-1 font-body text-xs font-bold px-8 py-4 rounded-full transition-all duration-300 text-center"
              >
                CONHECER O PROJETO
              </Link>
            </div>
          </div>

          {/* Right Column: Image with Arch Mask */}
          <div className="order-1 lg:order-2 w-full flex justify-center lg:justify-end">
            <div className="w-full max-w-md lg:max-w-none aspect-[4/5] lg:aspect-auto lg:h-[600px] relative overflow-hidden arch-mask bg-surface-container shadow-2xl border border-[#D4AF37]/20 float-animation mb-8">
              <img
                alt="Equipe corporativa sorrindo e interagindo"
                className="absolute inset-0 w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBcyGTyJxA5wWjcTedj10kTe0VwqQmHPTz4ifK2CHFtb4QMnrht9riVHFT2nHkUb7Rs6f50fzMM58S1rRxTndZoiORSIrl7c8pO9aXJJZZekYq_Z0PgdOLtBgiHuWx4SCymbD6MqWqtl48syzPXaQPci3rK_zAGG70qGeoV-rcDHWQtqF8rUlHhqvI8QJn3zS2UGgHeOIrm0dSpte-ybNyLOueBUbqf9JZy2ZLI9coeId77e1QzQxQKbojSEgjHaqGtFRzqNl-xstM"
              />
              <div className="absolute inset-4 border border-[#D4AF37]/50 arch-mask pointer-events-none"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Diferenciais Section (Glassmorphism) */}
      <section className="relative py-12 md:py-20 z-10">
        <div className="absolute inset-0 bg-primary/5 -skew-y-2 origin-top-left -z-10"></div>
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {differentials.map((diff, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center gap-4 p-8 rounded-3xl glass-card hover:-translate-y-2 transition-all duration-500"
              >
                <div
                  className={`w-16 h-16 rounded-full ${diff.bgClass} flex items-center justify-center ${diff.iconColor} mb-2`}
                >
                  <span className="material-symbols-outlined text-[32px]">
                    {diff.icon}
                  </span>
                </div>
                <h3 className="font-display text-lg font-medium text-on-surface leading-snug">
                  {diff.title}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Benefits Section */}
      <section className="py-16 md:py-24 bg-surface-container-lowest">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="text-center mb-16">
            <span className="text-primary font-body text-xs font-bold tracking-widest uppercase">
              Vantagens B2B
            </span>
            <h2 className="font-display text-3xl md:text-4xl mt-4 text-on-surface font-semibold">
              O impacto da experiência com a Zaryá
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex flex-col items-start gap-4 group"
              >
                <div className="p-4 bg-surface-container rounded-2xl group-hover:bg-[#D4AF37]/10 transition-colors duration-300">
                  <span className="material-symbols-outlined text-4xl text-primary">
                    {benefit.icon}
                  </span>
                </div>
                <h4 className="font-display text-xl font-bold text-on-surface">
                  {benefit.title}
                </h4>
                <p className="font-body text-sm text-on-surface-variant leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <span className="text-primary font-body text-xs font-bold tracking-widest uppercase">
                Processo Simples
              </span>
              <h2 className="font-display text-3xl md:text-4xl mt-4 mb-8 text-on-surface font-semibold">
                O que acontece quando a empresa contrata a Zaryá?
              </h2>
              <div className="space-y-8">
                {steps.map((step, index) => (
                  <div
                    key={index}
                    className="flex gap-6 group hover:-translate-y-1 transition-transform duration-300"
                  >
                    <div
                      className={`flex-shrink-0 w-12 h-12 rounded-full border-2 ${step.borderColor} flex items-center justify-center font-bold text-xl text-on-surface`}
                    >
                      {step.num}
                    </div>
                    <div>
                      <h4 className="font-display text-lg font-bold text-on-surface mb-2">
                        {step.title}
                      </h4>
                      <p className="font-body text-sm text-on-surface-variant">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:w-1/2 w-full flex justify-center">
              <div className="aspect-square bg-surface-container rounded-full relative overflow-hidden border-4 border-[#D4AF37]/40 shadow-2xl">
                <img
                  alt="Especialista Zaryá Ótica na loja com equipamentos e armações"
                  className="inset-0 w-full h-full object-cover object-center"
                  src="public/zarya-optico.jpg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials / Trust Section */}
      <section className="py-16 md:py-24 bg-surface-container-lowest border-t border-outline-variant/20">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop text-center">
          <h2 className="font-display text-2xl md:text-3xl mb-12 text-on-surface font-semibold">
            Ideal para
          </h2>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 mb-20">
            <span className="text-xl md:text-2xl font-bold font-display uppercase tracking-widest">
              Indústrias
            </span>
            <span className="text-xl md:text-2xl font-bold font-display uppercase tracking-widest">
              Escritórios
            </span>
            <span className="text-xl md:text-2xl font-bold font-display uppercase tracking-widest">
              Clínicas
            </span>
            <span className="text-xl md:text-2xl font-bold font-display uppercase tracking-widest">
              Centros Logísticos
            </span>
          </div>

          <div className="max-w-3xl mx-auto relative">
            <span
              className="material-symbols-outlined text-6xl text-[#D4AF37]/20 absolute -top-8 -left-8"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              format_quote
            </span>
            <blockquote className="font-body text-lg md:text-xl italic text-on-surface-variant leading-relaxed relative z-10 px-4">
              "A parceria com a Zaryá transformou nossa SIPAT. Foi o estande
              mais visitado da semana e os colaboradores sentiram um cuidado
              genuíno que há muito tempo não viam nos benefícios tradicionais."
            </blockquote>
            <div className="mt-8 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-surface-container-high overflow-hidden mb-4 border-2 border-primary/20">
                <img
                  alt="Mariana Silva"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC4SeM7zf--xaW9zL0vVQ0twtZqdniiGy7PFfQh7Xn8fBgIdBf1BszCVJNhdx5otUST9y8gS6cVIqyQ5dDIB5AE4_I5LIQc55DCGMPo4Q_hlPLyFBL4awJ-Fv_by0PD6klj_cUrpc9YRhxsEuYFolnPBU3iJjY22Sf1PPkf4KcEz7bBSPay1tq-wmH0IspkdSuXkpMTJflO3ZNNdknAlQWzleERA2xAVzbaPlJWtSrhiMsuzh50tNUAxH3ZIiZkyEYp3y-QjbTT_6E"
                />
              </div>
              <strong className="font-display text-base font-bold text-on-surface">
                Mariana Silva
              </strong>
              <span className="text-xs font-body text-on-surface-variant uppercase tracking-wider mt-1">
                Gerente de RH, TechCorp
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
