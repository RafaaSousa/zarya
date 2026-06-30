import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  signIn,
  signOut,
  getSession,
  onAuthChange,
  checkIsAdmin,
  isSupabaseConfigured
} from "../../lib/auth";
import AdminProducts from "./AdminProducts";
import AdminShipping from "./AdminShipping";
import AdminOrders from "./AdminOrders";

function AdminLogin({ notAdmin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signIn(email, password);
    } catch (err) {
      setError(err.message || "Falha no login.");
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "w-full bg-surface-container-lowest border border-outline-variant/40 rounded-lg px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none";

  return (
    <div className="bg-background min-h-screen flex items-center justify-center font-body px-6">
      <form onSubmit={submit} className="w-full max-w-sm bg-surface-container-lowest rounded-2xl p-8 border border-outline-variant/30 shadow-lg">
        <h1 className="font-display text-4xl text-primary text-center mb-2">Zaryá Admin</h1>
        <p className="text-center text-on-surface-variant text-sm mb-6">Acesso restrito</p>
        {notAdmin && (
          <div className="mb-4 bg-error/10 border border-error/40 text-error text-xs px-3 py-2 rounded-lg">
            Esta conta não tem permissão de administrador.
          </div>
        )}
        {error && (
          <div className="mb-4 bg-error/10 border border-error/40 text-error text-xs px-3 py-2 rounded-lg">
            {error}
          </div>
        )}
        <div className="flex flex-col gap-3">
          <input className={inputCls} type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className={inputCls} type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button
            type="submit"
            disabled={loading}
            className="bg-primary text-on-primary py-3 rounded-full font-body text-xs font-semibold tracking-widest uppercase hover:bg-primary/90 transition-colors disabled:opacity-60"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </div>
        <Link to="/" className="block text-center text-primary text-xs mt-6 underline">
          Voltar ao site
        </Link>
      </form>
    </div>
  );
}

const TABS = [
  { id: "produtos", label: "Produtos", icon: "eyeglasses" },
  { id: "frete", label: "Frete", icon: "local_shipping" },
  { id: "pedidos", label: "Pedidos", icon: "receipt_long" }
];

export default function AdminApp() {
  const [session, setSession] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("produtos");

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }
    let mounted = true;
    const init = async () => {
      const s = await getSession();
      if (!mounted) return;
      setSession(s);
      setIsAdmin(s ? await checkIsAdmin() : false);
      setLoading(false);
    };
    init();
    const sub = onAuthChange(async (s) => {
      setSession(s);
      setIsAdmin(s ? await checkIsAdmin() : false);
    });
    return () => {
      mounted = false;
      sub.unsubscribe?.();
    };
  }, []);

  if (!isSupabaseConfigured) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center font-body px-6 text-center">
        <p className="text-on-surface-variant">
          Área administrativa indisponível: backend (Supabase) não configurado.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center font-body">
        <span className="material-symbols-outlined text-4xl text-on-surface-variant/40 animate-pulse">
          progress_activity
        </span>
      </div>
    );
  }

  if (!session || !isAdmin) {
    return <AdminLogin notAdmin={Boolean(session) && !isAdmin} />;
  }

  return (
    <div className="bg-background min-h-screen font-body">
      <div className="w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="font-display text-4xl text-primary">Zaryá Admin</h1>
          <button
            onClick={signOut}
            className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant hover:text-error flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            Sair
          </button>
        </header>

        <nav className="flex gap-2 mb-8 border-b border-outline-variant/30">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 -mb-px transition-colors ${
                tab === t.id
                  ? "border-primary text-primary"
                  : "border-transparent text-on-surface-variant hover:text-primary"
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </nav>

        {tab === "produtos" && <AdminProducts />}
        {tab === "frete" && <AdminShipping />}
        {tab === "pedidos" && <AdminOrders />}
      </div>
    </div>
  );
}
