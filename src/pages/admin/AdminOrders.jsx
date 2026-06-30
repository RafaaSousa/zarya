import { Fragment, useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

const STATUS_STYLE = {
  paid: "bg-primary/15 text-primary",
  pending: "bg-amber-100 text-amber-700",
  failed: "bg-error/10 text-error",
  cancelled: "bg-on-surface/10 text-on-surface-variant"
};

const STATUS_LABEL = {
  paid: "Pago",
  pending: "Pendente",
  failed: "Falhou",
  cancelled: "Cancelado"
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState(null);
  const [items, setItems] = useState({});

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { data, error: err } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });
      if (err) setError(err.message);
      setOrders(data || []);
      setLoading(false);
    };
    load();
  }, []);

  const toggle = async (orderId) => {
    if (expanded === orderId) {
      setExpanded(null);
      return;
    }
    setExpanded(orderId);
    if (!items[orderId]) {
      const { data } = await supabase.from("order_items").select("*").eq("order_id", orderId);
      setItems((prev) => ({ ...prev, [orderId]: data || [] }));
    }
  };

  if (loading) return <p className="text-on-surface-variant">Carregando pedidos...</p>;

  return (
    <div>
      {error && (
        <div className="mb-4 bg-error/10 border border-error/40 text-error text-xs px-3 py-2 rounded-lg">{error}</div>
      )}
      <p className="text-sm text-on-surface-variant mb-4">{orders.length} pedidos</p>

      {orders.length === 0 ? (
        <p className="text-on-surface-variant text-sm">Nenhum pedido ainda.</p>
      ) : (
        <div className="overflow-x-auto bg-surface-container-lowest rounded-xl border border-outline-variant/30">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-on-surface-variant border-b border-outline-variant/30">
                <th className="p-3">Data</th>
                <th className="p-3">Cliente</th>
                <th className="p-3">Total</th>
                <th className="p-3">Status</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <Fragment key={o.id}>
                  <tr className="border-b border-outline-variant/20">
                    <td className="p-3 text-on-surface-variant">
                      {new Date(o.created_at).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="p-3">
                      <p className="text-on-surface">{o.customer_name || "—"}</p>
                      <p className="text-xs text-on-surface-variant">{o.customer_email}</p>
                    </td>
                    <td className="p-3 font-semibold text-on-surface">R$ {Number(o.total).toFixed(2)}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-[11px] font-semibold ${STATUS_STYLE[o.status] || ""}`}>
                        {STATUS_LABEL[o.status] || o.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <button onClick={() => toggle(o.id)} className="text-primary text-xs font-semibold hover:underline">
                        {expanded === o.id ? "Ocultar" : "Detalhes"}
                      </button>
                    </td>
                  </tr>
                  {expanded === o.id && (
                    <tr className="bg-surface-container/40">
                      <td colSpan={5} className="p-4">
                        <div className="text-xs text-on-surface-variant space-y-1 mb-3">
                          <p>Subtotal: R$ {Number(o.subtotal).toFixed(2)} · Frete: R$ {Number(o.shipping_cost).toFixed(2)}</p>
                          <p>CEP: {o.customer_cep || "—"}</p>
                          {o.mp_payment_id && <p>Pagamento MP: {o.mp_payment_id}</p>}
                        </div>
                        <ul className="text-sm space-y-1">
                          {(items[o.id] || []).map((it) => (
                            <li key={it.id} className="flex justify-between">
                              <span>{it.quantity}× {it.product_name}{it.color ? ` (${it.color})` : ""}</span>
                              <span>R$ {Number(it.unit_price).toFixed(2)}</span>
                            </li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
