import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

const cell = "bg-transparent border border-outline-variant/40 rounded px-2 py-1 text-sm";

export default function AdminShipping() {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    const { data, error: err } = await supabase
      .from("shipping_rules")
      .select("*")
      .order("priority", { ascending: false });
    if (err) setError(err.message);
    setRules(data || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const update = async (id, patch) => {
    setRules((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));
    const { error: err } = await supabase.from("shipping_rules").update(patch).eq("id", id);
    if (err) {
      setError(err.message);
      load();
    }
  };

  const addRule = async () => {
    const { error: err } = await supabase.from("shipping_rules").insert({
      label: "Nova regra",
      cep_start: "00000000",
      cep_end: "99999999",
      price: 0,
      delivery_days: 7,
      priority: 0,
      is_active: true
    });
    if (err) setError(err.message);
    else load();
  };

  const remove = async (id) => {
    const { error: err } = await supabase.from("shipping_rules").delete().eq("id", id);
    if (err) setError(err.message);
    else load();
  };

  if (loading) return <p className="text-on-surface-variant">Carregando regras...</p>;

  return (
    <div>
      {error && (
        <div className="mb-4 bg-error/10 border border-error/40 text-error text-xs px-3 py-2 rounded-lg">{error}</div>
      )}
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-on-surface-variant">{rules.length} regras de frete</p>
        <button
          onClick={addRule}
          className="px-4 py-2 rounded-full bg-primary text-on-primary text-xs font-semibold uppercase tracking-wider hover:bg-primary/90 flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Nova regra
        </button>
      </div>

      <p className="text-xs text-on-surface-variant mb-3">
        Dica: a regra de maior prioridade cujo intervalo de CEP contém o endereço do cliente é a
        aplicada. Use "Frete grátis acima de" para isentar pedidos a partir de um valor.
      </p>

      <div className="overflow-x-auto bg-surface-container-lowest rounded-xl border border-outline-variant/30">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wider text-on-surface-variant border-b border-outline-variant/30">
              <th className="p-3">Rótulo</th>
              <th className="p-3">CEP inicial</th>
              <th className="p-3">CEP final</th>
              <th className="p-3">Preço</th>
              <th className="p-3">Grátis acima</th>
              <th className="p-3">Prazo</th>
              <th className="p-3">Prior.</th>
              <th className="p-3">Ativo</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {rules.map((r) => (
              <tr key={r.id} className="border-b border-outline-variant/20">
                <td className="p-2">
                  <input className={`${cell} w-32`} defaultValue={r.label} onBlur={(e) => update(r.id, { label: e.target.value })} />
                </td>
                <td className="p-2">
                  <input className={`${cell} w-24`} defaultValue={r.cep_start || ""} onBlur={(e) => update(r.id, { cep_start: e.target.value })} />
                </td>
                <td className="p-2">
                  <input className={`${cell} w-24`} defaultValue={r.cep_end || ""} onBlur={(e) => update(r.id, { cep_end: e.target.value })} />
                </td>
                <td className="p-2">
                  <input className={`${cell} w-20`} type="number" defaultValue={r.price} onBlur={(e) => update(r.id, { price: Number(e.target.value) })} />
                </td>
                <td className="p-2">
                  <input className={`${cell} w-20`} type="number" defaultValue={r.free_above ?? ""} onBlur={(e) => update(r.id, { free_above: e.target.value === "" ? null : Number(e.target.value) })} />
                </td>
                <td className="p-2">
                  <input className={`${cell} w-16`} type="number" defaultValue={r.delivery_days} onBlur={(e) => update(r.id, { delivery_days: Number(e.target.value) })} />
                </td>
                <td className="p-2">
                  <input className={`${cell} w-14`} type="number" defaultValue={r.priority} onBlur={(e) => update(r.id, { priority: Number(e.target.value) })} />
                </td>
                <td className="p-2">
                  <input type="checkbox" checked={r.is_active} onChange={(e) => update(r.id, { is_active: e.target.checked })} />
                </td>
                <td className="p-2">
                  <button onClick={() => remove(r.id)} className="text-on-surface-variant hover:text-error">
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
