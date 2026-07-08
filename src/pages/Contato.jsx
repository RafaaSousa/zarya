import React, { useState, useEffect, useRef } from "react";

function useScrollReveal(options = {}) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-visible");
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

export default function Contato() {
  const [formData, setFormData] = useState({
    companyName: "",
    contactName: "",
    cnpj: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [success, setSuccess] = useState(false);

  const bannerRef = useScrollReveal();
  const sidebarRef = useScrollReveal();
  const formRef = useScrollReveal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setFormData({
        companyName: "",
        contactName: "",
        cnpj: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
      });
    }, 5000);
  };

  return (
    <div className="bg-background text-on-surface font-body overflow-x-hidden">
      <main className="w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 md:py-12 flex flex-col md:grid md:grid-cols-12 md:gap-8">

        {/* Banner */}
        <section className="col-span-12 mb-8">
          <div
            ref={bannerRef}
            className="relative w-full h-[250px] md:h-[300px] arch-mask overflow-hidden shadow-md mb-4 border border-[#D4AF37]/20 anim-fade-up"
          >
            <img
              alt="Interior da ótica Zaryá"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD3U3Qqy0tAce_DwhcTRHANyeqPxtR2kOuqFRdgtpB-R65-Frbgy-0XgjYw4sBEQGEr94lYNuA4QT4EJpV4kGu3MFTgMcxBgHe7gvvamoWjV_cS96DkYhSoXwVE_uEiywUXevw__jJTVc09NdGyE_JhHWMZx3QKjaHvk_ZOzjC1R6jdxtPeITQx3SNd7YuUWY-myeMKKOBbfIXeNz_BI6L0vUU8Rn2xFWExicpQbeRgcdOvAprFnUUbFK1k7Vfw_MAASWqz18gglyE"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-60" />
            <div className="absolute bottom-6 left-6 right-6">
              <h2 className="font-display text-5xl md:text-6xl text-primary font-normal">Fale Conosco</h2>
              <p className="font-body text-sm text-on-surface-variant mt-2">Estamos prontos para iluminar sua visão.</p>
            </div>
          </div>
        </section>

        {/* Sidebar — Quick Actions */}
        <section
          ref={sidebarRef}
          className="col-span-12 md:col-span-4 flex flex-col gap-6 mb-8 md:mb-0 anim-slide-left"
        >
          <h3 className="font-playfair text-xl text-on-background font-bold border-b border-primary/20 pb-2">
            Atendimento Rápido
          </h3>

          <a
            href="https://wa.me/5511931502102"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-4 bg-surface rounded-xl shadow-md border border-outline-variant/30 hover:border-primary transition-all group focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            aria-label="Entrar em contato pelo WhatsApp: +55 11 93150-2102"
          >
            <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container group-hover:bg-primary group-hover:text-on-primary transition-colors">
              <span className="material-symbols-outlined">forum</span>
            </div>
            <div>
              <span className="block font-body text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">WhatsApp</span>
              <span className="block font-body text-sm font-semibold text-on-surface">+55 (11) 93150-2102</span>
            </div>
          </a>

          <a
            href="https://wa.me/5511986756809"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-4 bg-surface rounded-xl shadow-md border border-outline-variant/30 hover:border-primary transition-all group focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            aria-label="Entrar em contato pelo WhatsApp: +55 11 98675-6809"
          >
            <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container group-hover:bg-primary group-hover:text-on-primary transition-colors">
              <span className="material-symbols-outlined">forum</span>
            </div>
            <div>
              <span className="block font-body text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">WhatsApp</span>
              <span className="block font-body text-sm font-semibold text-on-surface">+55 (11) 98675-6809</span>
            </div>
          </a>

          <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/20">
            <h4 className="font-body text-xs font-bold text-primary uppercase tracking-wider mb-3">Horário de Funcionamento</h4>
            <ul className="font-body text-xs text-on-surface-variant space-y-2">
              <li className="flex justify-between"><span>Segunda - Sexta:</span> <span className="font-semibold text-on-surface">09:00 - 18:00</span></li>
              <li className="flex justify-between"><span>Sábado:</span> <span className="font-semibold text-on-surface">09:00 - 13:00</span></li>
              <li className="flex justify-between"><span>Domingo:</span> <span className="font-semibold text-on-surface">Fechado</span></li>
            </ul>
          </div>

          {/* Endereço - google maps */}
          {/*<div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/20">
            <h4 className="font-body text-xs font-bold text-primary uppercase tracking-wider mb-2">Endereço</h4>
            <p className="font-body text-xs text-on-surface-variant leading-relaxed">
              Av. Paulista, 1000 - Bela Vista<br />São Paulo - SP, 01310-100
            </p>
            <a
              href="https://maps.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-2 font-body text-xs font-bold text-primary underline hover:text-[#554300] focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              Ver no mapa
            </a>
          </div>*/}
        </section>

        {/* Contact Form */}
        <section
          ref={formRef}
          className="col-span-12 md:col-span-8 anim-slide-right anim-delay-200"
        >
          <div className="bg-surface p-6 md:p-8 rounded-xl shadow-md border border-outline-variant/20">
            <h3 className="font-playfair text-xl md:text-2xl text-on-background font-bold mb-2">
              Solicitação para Empresas (B2B)
            </h3>
            <p className="font-body text-sm text-on-surface-variant mb-6">
              Preencha os dados abaixo para atendimento corporativo. Entraremos em contato em até 24 horas.
            </p>

            {success ? (
              <div
                className="bg-[#D4AF37]/20 border border-[#D4AF37] text-on-surface p-8 rounded-lg text-center font-body my-12"
                role="status"
                aria-live="polite"
              >
                <span className="material-symbols-outlined text-5xl text-primary mb-3 block">verified</span>
                <strong className="block text-xl mb-1">Mensagem Recebida!</strong>
                Agradecemos o seu contato. Nossa equipe entrará em contato em breve para prosseguir com o seu atendimento.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div>
                  <label className="block font-body text-xs font-bold text-on-surface-variant mb-1 uppercase tracking-wider" htmlFor="ct-companyName">Nome da Empresa</label>
                  <input
                    required
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-3 font-body text-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                    id="ct-companyName"
                    placeholder="Ex: Óticas Modelo Ltda"
                    type="text"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-body text-xs font-bold text-on-surface-variant mb-1 uppercase tracking-wider" htmlFor="ct-contactName">Nome do Contato</label>
                    <input
                      required
                      value={formData.contactName}
                      onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                      className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-3 font-body text-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                      id="ct-contactName"
                      placeholder="Seu nome completo"
                      type="text"
                    />
                  </div>
                  <div>
                    <label className="block font-body text-xs font-bold text-on-surface-variant mb-1 uppercase tracking-wider" htmlFor="ct-cnpj">CNPJ</label>
                    <input
                      required
                      value={formData.cnpj}
                      onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                      className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-3 font-body text-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                      id="ct-cnpj"
                      placeholder="00.000.000/0000-00"
                      type="text"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-body text-xs font-bold text-on-surface-variant mb-1 uppercase tracking-wider" htmlFor="ct-email">E-mail Corporativo</label>
                    <input
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-3 font-body text-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                      id="ct-email"
                      placeholder="contato@empresa.com.br"
                      type="email"
                    />
                  </div>
                  <div>
                    <label className="block font-body text-xs font-bold text-on-surface-variant mb-1 uppercase tracking-wider" htmlFor="ct-phone">Telefone / WhatsApp</label>
                    <input
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-3 font-body text-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                      id="ct-phone"
                      placeholder="(00) 00000-0000"
                      type="tel"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-body text-xs font-bold text-on-surface-variant mb-1 uppercase tracking-wider" htmlFor="ct-subject">Assunto</label>
                  <select
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-3 font-body text-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                    id="ct-subject"
                  >
                    <option value="">Selecione o motivo do contato</option>
                    <option value="catalogo">Solicitar Catálogo</option>
                    <option value="parceria">Parceria B2B</option>
                    <option value="suporte">Suporte a Lojistas</option>
                    <option value="outros">Outros</option>
                  </select>
                </div>

                <div>
                  <label className="block font-body text-xs font-bold text-on-surface-variant mb-1 uppercase tracking-wider" htmlFor="ct-message">Mensagem</label>
                  <textarea
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-3 font-body text-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors resize-none"
                    id="ct-message"
                    placeholder="Detalhe sua solicitação aqui..."
                    rows={4}
                  />
                </div>

                <button
                  className="w-full bg-primary hover:bg-[#554300] text-on-primary font-body text-xs font-bold py-4 px-6 rounded-lg transition-all duration-300 hover:-translate-y-0.5 shadow-md flex justify-center items-center gap-2 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  type="submit"
                >
                  <span>Enviar Mensagem</span>
                  <span className="material-symbols-outlined text-[18px]" aria-hidden="true">send</span>
                </button>
              </form>
            )}
          </div>
        </section>

      </main>
    </div>
  );
}
