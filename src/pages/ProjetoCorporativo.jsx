import React, { useState } from "react";

export default function ProjetoCorporativo() {
  const [formData, setFormData] = useState({
    nomeEmpresa: "",
    nomeResponsavel: "",
    email: "",
    telefone: "",
    colaboradores: "",
    servico: "",
    mensagem: "",
  });
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setFormData({
        nomeEmpresa: "",
        nomeResponsavel: "",
        email: "",
        telefone: "",
        colaboradores: "",
        servico: "",
        mensagem: "",
      });
    }, 5000);
  };

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
        "Sessões instrutivas sobre saúde ocular no era digital, ergonomia visual e prevenção da Síndrome de Visão de Computador.",
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

  return (
    <div className="bg-background text-on-surface font-body overflow-x-hidden">

      {/* ── 1. HERO — Percepção, Bem-Estar e Ambiente Corporativo ── */}
      <section className="w-full bg-[#F7F4EF]">
        <div className="max-w-[1280px] mx-auto px-4 md:px-10 py-16 md:py-20 flex flex-col md:flex-row items-center gap-10 md:gap-14">

          {/* Left: Text */}
          <div className="flex-1 flex flex-col gap-6">
            <h1
              className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
              style={{ color: "#C9A227" }}
            >
              PERCEPÇÃO,<br />BEM-ESTAR E<br />AMBIENTE<br />CORPORATIVO
            </h1>

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
          <div className="flex-1 w-full max-w-lg md:max-w-none">
            <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80"
                alt="Ambiente corporativo moderno com luz natural"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. AÇÕES IN-COMPANY & SIPAT ── */}
      <section className="w-full bg-white py-16 md:py-20">
        <div className="max-w-[1280px] mx-auto px-4 md:px-10 flex flex-col items-center gap-10">
          <div className="text-center flex flex-col gap-3 max-w-2xl">
            <h2
              className="font-display text-2xl md:text-3xl font-semibold"
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
            {services.map((svc) => (
              <div
                key={svc.title}
                className="flex flex-col gap-3 p-6 rounded-2xl border border-[#C9A227]/20 bg-[#FFFDF8] shadow-sm hover:shadow-md hover:-translate-y-1 transition-all"
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
                  className="font-display text-base font-bold"
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
        <div className="max-w-[1280px] mx-auto px-4 md:px-10 flex flex-col md:flex-row items-center gap-12 md:gap-16">

          {/* Left: Arch photo */}
          <div className="flex-1 w-full flex justify-center">
            <div
              className="w-full max-w-xs md:max-w-sm aspect-[3/4] overflow-hidden shadow-2xl"
              style={{ borderRadius: "50% 50% 0 0 / 40% 40% 0 0" }}
            >
              <img
                src="https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?w=600&q=80"
                alt="Equipe corporativa Zaryá Ótica"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right: Benefits list */}
          <div className="flex-1 flex flex-col gap-6">
            <h2
              className="font-display text-2xl md:text-3xl lg:text-4xl font-bold"
              style={{ color: "#C9A227" }}
            >
              BENEFÍCIOS DA<br />EXPERIÊNCIA
            </h2>

            <ul className="flex flex-col gap-3">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-center gap-3">
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
                className="font-display text-xs font-bold tracking-widest uppercase mb-3"
                style={{ color: "#2C2A24" }}
              >
                QUEM FÁZ TUDO ACONTECER
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

      {/* ── 4. SOLICITE UM ORÇAMENTO ── */}
      <section id="orcamento" className="w-full py-16 md:py-20 scroll-mt-20" style={{ background: "#2C2A24" }}>
        <div className="max-w-[640px] mx-auto px-4 md:px-10">
          <div className="flex flex-col gap-3 text-center mb-8">
            <h2 className="font-display text-2xl md:text-3xl font-semibold text-white">
              Solicite um Orçamento
            </h2>
            <p className="font-body text-sm text-[#B0A990]">
              Preencha os dados abaixo e nossa equipe B2B entrará em contato para desenvolver a melhor
              solução para sua empresa.
            </p>
          </div>

          {success ? (
            <div className="bg-[#C9A227]/20 border border-[#C9A227] text-white p-8 rounded-2xl text-center font-body">
              <span className="material-symbols-outlined text-5xl mb-3 block" style={{ color: "#C9A227" }}>
                check_circle
              </span>
              <strong className="block text-lg mb-2">Solicitação Enviada!</strong>
              <p className="text-sm text-[#B0A990]">
                Agradecemos o contato. Um de nossos consultores retornará em breve.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Row 1 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-body text-xs font-semibold text-[#B0A990]">Nome da Empresa</label>
                  <input
                    name="nomeEmpresa"
                    required
                    value={formData.nomeEmpresa}
                    onChange={handleChange}
                    placeholder="Ex: Tech Solutions SA"
                    type="text"
                    className="w-full px-4 py-3 rounded-lg border border-white/10 bg-white/8 text-white placeholder-white/30 font-body text-sm focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227] outline-none transition-colors"
                    style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-body text-xs font-semibold text-[#B0A990]">Nome do Responsável (RH/Facilities)</label>
                  <input
                    name="nomeResponsavel"
                    required
                    value={formData.nomeResponsavel}
                    onChange={handleChange}
                    placeholder="Seu nome completo"
                    type="text"
                    className="w-full px-4 py-3 rounded-lg border border-white/10 text-white placeholder-white/30 font-body text-sm focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227] outline-none transition-colors"
                    style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
                  />
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-body text-xs font-semibold text-[#B0A990]">E-mail Corporativo</label>
                  <input
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="email@empresa.com.br"
                    type="email"
                    className="w-full px-4 py-3 rounded-lg border border-white/10 text-white placeholder-white/30 font-body text-sm focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227] outline-none transition-colors"
                    style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-body text-xs font-semibold text-[#B0A990]">Telefone / WhatsApp</label>
                  <input
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleChange}
                    placeholder="(00) 00000-0000"
                    type="tel"
                    className="w-full px-4 py-3 rounded-lg border border-white/10 text-white placeholder-white/30 font-body text-sm focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227] outline-none transition-colors"
                    style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
                  />
                </div>
              </div>

              {/* Row 3 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-body text-xs font-semibold text-[#B0A990]">Número de Colaboradores</label>
                  <select
                    name="colaboradores"
                    value={formData.colaboradores}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-white/10 text-white font-body text-sm focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227] outline-none transition-colors appearance-none"
                    style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
                  >
                    <option value="" className="bg-[#2C2A24]">Selecione uma faixa</option>
                    <option value="1-50" className="bg-[#2C2A24]">1 – 50 colaboradores</option>
                    <option value="51-200" className="bg-[#2C2A24]">51 – 200 colaboradores</option>
                    <option value="201-500" className="bg-[#2C2A24]">201 – 500 colaboradores</option>
                    <option value="500+" className="bg-[#2C2A24]">500+ colaboradores</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-body text-xs font-semibold text-[#B0A990]">Empresa de Interesse</label>
                  <select
                    name="servico"
                    value={formData.servico}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-white/10 text-white font-body text-sm focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227] outline-none transition-colors appearance-none"
                    style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
                  >
                    <option value="" className="bg-[#2C2A24]">Selecione um serviço</option>
                    <option value="exames" className="bg-[#2C2A24]">Exames de Acuidade</option>
                    <option value="otica-movel" className="bg-[#2C2A24]">Ótica Móvel</option>
                    <option value="sipat" className="bg-[#2C2A24]">Ação SIPAT</option>
                    <option value="palestra" className="bg-[#2C2A24]">Palestras Educativas</option>
                    <option value="completo" className="bg-[#2C2A24]">Pacote Completo</option>
                  </select>
                </div>
              </div>

              {/* Textarea */}
              <div className="flex flex-col gap-1.5">
                <label className="font-body text-xs font-semibold text-[#B0A990]">
                  Mensagem Adicional (Opcional)
                </label>
                <textarea
                  name="mensagem"
                  value={formData.mensagem}
                  onChange={handleChange}
                  placeholder="Conte um pouco mais sobre a necessidade da sua empresa..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-white/10 text-white placeholder-white/30 font-body text-sm focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227] outline-none transition-colors resize-none"
                  style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="mt-2 w-full py-4 rounded-lg font-body text-sm font-bold tracking-widest transition-all duration-300 hover:opacity-90 hover:-translate-y-0.5 shadow-lg"
                style={{ backgroundColor: "#C9A227", color: "#1A1800" }}
              >
                SOLICITAR CONTATO
              </button>
            </form>
          )}
        </div>
      </section>

    </div>
  );
}
