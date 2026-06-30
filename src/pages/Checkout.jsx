import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { supabase, isSupabaseConfigured } from "../lib/supabaseClient";

const UFS = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB",
  "PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"
];

export default function Checkout() {
  const { items, subtotal, count } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    cep: "",
    street: "",
    number: "",
    complement: "",
    district: "",
    city: "",
    uf: ""
  });
  const [shipping, setShipping] = useState(null); // { price, delivery_days, label, free }
  const [calcLoading, setCalcLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const set = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    if (field === "cep") setShipping(null);
  };

  const total = subtotal + (shipping ? shipping.price : 0);

  const calcularFrete = async () => {
    setError("");
    if (!isSupabaseConfigured || !supabase) {
      setError("Pagamento indisponível: backend não configurado.");
      return;
    }
    const cepDigits = form.cep.replace(/\D/g, "");
    if (cepDigits.length !== 8) {
      setError("Informe um CEP válido (8 dígitos).");
      return;
    }
    setCalcLoading(true);
    try {
      const { data, error: fnErr } = await supabase.functions.invoke("calculate-shipping", {
        body: { cep: cepDigits, subtotal }
      });
      if (fnErr || data?.error) throw new Error(data?.error || fnErr.message);
      setShipping(data);
    } catch (err) {
      setError(err.message || "Não foi possível calcular o frete.");
      setShipping(null);
    } finally {
      setCalcLoading(false);
    }
  };

  const finalizar = async () => {
    setError("");
    if (!isSupabaseConfigured || !supabase) {
      setError("Pagamento indisponível: backend não configurado.");
      return;
    }
    if (!form.name || !form.email) {
      setError("Preencha nome e e-mail.");
      return;
    }
    if (!shipping) {
      setError("Calcule o frete antes de finalizar.");
      return;
    }
    setSubmitting(true);
    try {
      const { data, error: fnErr } = await supabase.functions.invoke("create-preference", {
        body: {
          items: items.map((i) => ({
            id: i.id,
            quantity: i.quantity,
            color: i.color,
            name: i.name
          })),
          customer: { name: form.name, email: form.email },
          cep: form.cep,
          address: {
            street: form.street,
            number: form.number,
            complement: form.complement,
            district: form.district,
            city: form.city,
            uf: form.uf
          }
        }
      });
      if (fnErr || data?.error) throw new Error(data?.error || fnErr.message);
      const redirectUrl = data.init_point || data.sandbox_init_point;
      if (!redirectUrl) throw new Error("Não foi possível iniciar o pagamento.");
      window.location.href = redirectUrl;
    } catch (err) {
      setError(err.message || "Falha ao iniciar o pagamento.");
      setSubmitting(false);
    }
  };

  if (count === 0) {
    return (
      <div className="bg-background min-h-screen flex flex-col items-center justify-center font-body py-20 gap-4 text-center px-6">
        <span className="material-symbols-outlined text-5xl text-on-surface-variant/40">
          remove_shopping_cart
        </span>
        <p className="text-on-surface-variant">Seu carrinho está vazio.</p>
        <Link to="/catalogo" className="text-primary font-semibold underline">
          Ir para o catálogo
        </Link>
      </div>
    );
  }

  const inputCls =
    "w-full bg-surface-container-lowest border border-outline-variant/40 rounded-lg px-4 py-3 text-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none";

  return (
    <div className="bg-background min-h-screen font-body">
      <main className="w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-10">
        <h1 className="font-display text-5xl text-primary mb-8">Finalizar Compra</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulário */}
          <section className="lg:col-span-2 flex flex-col gap-6">
            <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/30 shadow-sm">
              <h2 className="font-playfair text-lg font-bold text-on-surface mb-4">Seus dados</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input className={inputCls} placeholder="Nome completo" value={form.name} onChange={set("name")} />
                <input className={inputCls} placeholder="E-mail" type="email" value={form.email} onChange={set("email")} />
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/30 shadow-sm">
              <h2 className="font-playfair text-lg font-bold text-on-surface mb-4">Entrega</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex gap-2">
                  <input className={inputCls} placeholder="CEP" value={form.cep} onChange={set("cep")} />
                  <button
                    onClick={calcularFrete}
                    disabled={calcLoading}
                    className="whitespace-nowrap px-4 rounded-lg bg-primary-container text-on-primary-container text-xs font-bold uppercase hover:bg-primary hover:text-on-primary transition-colors disabled:opacity-60"
                  >
                    {calcLoading ? "..." : "Calcular"}
                  </button>
                </div>
                <input className={inputCls} placeholder="Cidade" value={form.city} onChange={set("city")} />
                <input className={inputCls} placeholder="Rua / Logradouro" value={form.street} onChange={set("street")} />
                <input className={inputCls} placeholder="Número" value={form.number} onChange={set("number")} />
                <input className={inputCls} placeholder="Complemento" value={form.complement} onChange={set("complement")} />
                <input className={inputCls} placeholder="Bairro" value={form.district} onChange={set("district")} />
                <select className={inputCls} value={form.uf} onChange={set("uf")}>
                  <option value="">UF</option>
                  {UFS.map((uf) => (
                    <option key={uf} value={uf}>{uf}</option>
                  ))}
                </select>
              </div>
              {shipping && (
                <p className="mt-4 text-sm text-on-surface">
                  Frete <strong>{shipping.label}</strong>:{" "}
                  {shipping.free ? (
                    <strong className="text-primary">Grátis</strong>
                  ) : (
                    <strong className="text-primary">R$ {shipping.price.toFixed(2)}</strong>
                  )}{" "}
                  · prazo {shipping.delivery_days} dias úteis
                </p>
              )}
            </div>
          </section>

          {/* Resumo */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/30 shadow-sm">
              <h2 className="font-playfair text-lg font-bold text-on-surface mb-4">Resumo</h2>
              <div className="flex flex-col gap-3 mb-4">
                {items.map((i) => (
                  <div key={i.key} className="flex justify-between text-sm">
                    <span className="text-on-surface-variant">
                      {i.quantity}× {i.name}
                      {i.color ? ` · ${i.color}` : ""}
                    </span>
                    <span className="text-on-surface font-semibold">R$ {(i.price * i.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-outline-variant/30 pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Subtotal</span>
                  <span className="text-on-surface">R$ {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Frete</span>
                  <span className="text-on-surface">
                    {shipping ? (shipping.free ? "Grátis" : `R$ ${shipping.price.toFixed(2)}`) : "--"}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold pt-2 border-t border-outline-variant/30">
                  <span className="text-on-surface">Total</span>
                  <span className="text-primary">R$ {total.toFixed(2)}</span>
                </div>
              </div>

              {error && (
                <div className="mt-4 bg-error/10 border border-error/40 text-error text-xs px-3 py-2 rounded-lg">
                  {error}
                </div>
              )}

              <button
                onClick={finalizar}
                disabled={submitting}
                className="mt-6 w-full bg-primary text-on-primary py-4 rounded-full font-body text-xs font-semibold tracking-widest uppercase hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {submitting ? "Redirecionando..." : "Pagar com Mercado Pago"}
              </button>
              <button
                onClick={() => navigate("/catalogo")}
                className="mt-3 w-full text-primary text-xs font-semibold underline"
              >
                Continuar comprando
              </button>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
