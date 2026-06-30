import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

const EMPTY = {
  slug: "",
  name: "",
  price: 0,
  old_price: "",
  description: "",
  detailed_description: "",
  material: "Acetato",
  shape: "Redondo",
  gender: "Unissex",
  stock: 0,
  is_new: false,
  is_active: true,
  images: [],
  overlay_image: "",
  model_3d_url: "",
  colors: [],
  color_hexes: [],
  measurements: { aro: "", ponte: "", haste: "" }
};

const inputCls =
  "w-full bg-surface-container-lowest border border-outline-variant/40 rounded-lg px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none";

async function uploadToStorage(file) {
  const ext = file.name.split(".").pop();
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage.from("products").upload(path, file, {
    cacheControl: "3600",
    upsert: false
  });
  if (error) throw error;
  const { data } = supabase.storage.from("products").getPublicUrl(path);
  return data.publicUrl;
}

function ProductModal({ initial, onClose, onSaved }) {
  const [form, setForm] = useState({
    ...EMPTY,
    ...initial,
    old_price: initial?.old_price ?? "",
    measurements: { aro: "", ponte: "", haste: "", ...(initial?.measurements || {}) }
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  const setMeas = (field) => (e) =>
    setForm((f) => ({ ...f, measurements: { ...f.measurements, [field]: e.target.value } }));

  const handleImageUpload = async (e, target) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const url = await uploadToStorage(file);
      if (target === "overlay") {
        setForm((f) => ({ ...f, overlay_image: url }));
      } else {
        setForm((f) => ({ ...f, images: [...f.images, url] }));
      }
    } catch (err) {
      setError("Falha no upload: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const save = async () => {
    setError("");
    if (!form.slug || !form.name) {
      setError("Slug e nome são obrigatórios.");
      return;
    }
    setSaving(true);
    const payload = {
      slug: form.slug,
      name: form.name,
      price: Number(form.price) || 0,
      old_price: form.old_price === "" ? null : Number(form.old_price),
      description: form.description,
      detailed_description: form.detailed_description,
      material: form.material,
      shape: form.shape,
      gender: form.gender,
      stock: Number(form.stock) || 0,
      is_new: form.is_new,
      is_active: form.is_active,
      images: form.images,
      overlay_image: form.overlay_image,
      model_3d_url: form.model_3d_url || null,
      colors: form.colors,
      color_hexes: form.color_hexes,
      measurements: form.measurements
    };
    try {
      let res;
      if (initial?.id) {
        res = await supabase.from("products").update(payload).eq("id", initial.id);
      } else {
        res = await supabase.from("products").insert(payload);
      }
      if (res.error) throw res.error;
      onSaved();
    } catch (err) {
      setError(err.message || "Erro ao salvar.");
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-[#F7F4EF] rounded-2xl p-6 shadow-2xl border border-outline-variant/30">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-playfair text-xl font-bold text-on-surface">
            {initial?.id ? "Editar produto" : "Novo produto"}
          </h3>
          <button onClick={onClose} className="text-on-surface-variant hover:text-error">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {error && (
          <div className="mb-4 bg-error/10 border border-error/40 text-error text-xs px-3 py-2 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="text-xs font-semibold text-on-surface-variant">Slug (URL)
            <input className={inputCls} value={form.slug} onChange={set("slug")} placeholder="aura-classic" />
          </label>
          <label className="text-xs font-semibold text-on-surface-variant">Nome
            <input className={inputCls} value={form.name} onChange={set("name")} />
          </label>
          <label className="text-xs font-semibold text-on-surface-variant">Preço (R$)
            <input className={inputCls} type="number" value={form.price} onChange={set("price")} />
          </label>
          <label className="text-xs font-semibold text-on-surface-variant">Preço antigo (opcional)
            <input className={inputCls} type="number" value={form.old_price} onChange={set("old_price")} />
          </label>
          <label className="text-xs font-semibold text-on-surface-variant">Estoque
            <input className={inputCls} type="number" value={form.stock} onChange={set("stock")} />
          </label>
          <label className="text-xs font-semibold text-on-surface-variant">Material
            <input className={inputCls} value={form.material} onChange={set("material")} />
          </label>
          <label className="text-xs font-semibold text-on-surface-variant">Formato
            <select className={inputCls} value={form.shape} onChange={set("shape")}>
              {["Redondo", "Gatinho", "Quadrado", "Aviador"].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </label>
          <label className="text-xs font-semibold text-on-surface-variant">Gênero
            <select className={inputCls} value={form.gender} onChange={set("gender")}>
              {["Feminino", "Masculino", "Unissex"].map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </label>
        </div>

        <label className="block mt-3 text-xs font-semibold text-on-surface-variant">Descrição curta
          <input className={inputCls} value={form.description} onChange={set("description")} />
        </label>
        <label className="block mt-3 text-xs font-semibold text-on-surface-variant">Descrição detalhada
          <textarea className={inputCls} rows={3} value={form.detailed_description} onChange={set("detailed_description")} />
        </label>

        <div className="grid grid-cols-3 gap-3 mt-3">
          <label className="text-xs font-semibold text-on-surface-variant">Aro
            <input className={inputCls} value={form.measurements.aro} onChange={setMeas("aro")} placeholder="50mm" />
          </label>
          <label className="text-xs font-semibold text-on-surface-variant">Ponte
            <input className={inputCls} value={form.measurements.ponte} onChange={setMeas("ponte")} placeholder="20mm" />
          </label>
          <label className="text-xs font-semibold text-on-surface-variant">Haste
            <input className={inputCls} value={form.measurements.haste} onChange={setMeas("haste")} placeholder="145mm" />
          </label>
        </div>

        <label className="block mt-3 text-xs font-semibold text-on-surface-variant">Cores (separadas por vírgula)
          <input
            className={inputCls}
            value={form.colors.join(", ")}
            onChange={(e) => setForm((f) => ({ ...f, colors: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) }))}
          />
        </label>
        <label className="block mt-3 text-xs font-semibold text-on-surface-variant">Cores HEX (separadas por vírgula)
          <input
            className={inputCls}
            value={form.color_hexes.join(", ")}
            onChange={(e) => setForm((f) => ({ ...f, color_hexes: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) }))}
          />
        </label>

        {/* Imagens */}
        <div className="mt-4">
          <p className="text-xs font-semibold text-on-surface-variant mb-2">Imagens do produto</p>
          <div className="flex flex-wrap gap-2 mb-2">
            {form.images.map((url, i) => (
              <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border border-outline-variant/30 bg-surface-container">
                <img src={url} alt="" className="w-full h-full object-contain" />
                <button
                  onClick={() => setForm((f) => ({ ...f, images: f.images.filter((_, idx) => idx !== i) }))}
                  className="absolute top-0 right-0 bg-error text-white w-5 h-5 flex items-center justify-center text-[12px]"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, "image")} className="text-xs" />
        </div>

        {/* Overlay try-on */}
        <div className="mt-4">
          <p className="text-xs font-semibold text-on-surface-variant mb-2">
            PNG do provador virtual (overlay transparente)
          </p>
          {form.overlay_image && (
            <img src={form.overlay_image} alt="" className="w-24 h-12 object-contain mb-2 bg-surface-container rounded" />
          )}
          <input type="file" accept="image/png" onChange={(e) => handleImageUpload(e, "overlay")} className="text-xs" />
        </div>

        {/* Modelo 3D (.glb) para o provador 3D */}
        <div className="mt-4">
          <p className="text-xs font-semibold text-on-surface-variant mb-1">
            Modelo 3D do provador (.glb / .gltf — opcional)
          </p>
          <p className="text-[11px] text-on-surface-variant/80 mb-2">
            Se vazio, o provador usa um modelo 3D genérico tingido pela cor do produto.
          </p>
          {form.model_3d_url && (
            <p className="text-[11px] text-primary mb-2 truncate">{form.model_3d_url}</p>
          )}
          <input
            type="file"
            accept=".glb,.gltf,model/gltf-binary"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              setUploading(true);
              setError("");
              try {
                const url = await uploadToStorage(file);
                setForm((f) => ({ ...f, model_3d_url: url }));
              } catch (err) {
                setError("Falha no upload do modelo 3D: " + err.message);
              } finally {
                setUploading(false);
              }
            }}
            className="text-xs"
          />
          {form.model_3d_url && (
            <button
              onClick={() => setForm((f) => ({ ...f, model_3d_url: "" }))}
              className="block mt-2 text-[11px] text-error hover:underline"
            >
              Remover modelo 3D
            </button>
          )}
        </div>

        <div className="flex gap-4 mt-4">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.is_active} onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))} />
            Ativo
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.is_new} onChange={(e) => setForm((f) => ({ ...f, is_new: e.target.checked }))} />
            Lançamento
          </label>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-5 py-2.5 rounded-full text-sm text-on-surface-variant hover:bg-on-surface/5">
            Cancelar
          </button>
          <button
            onClick={save}
            disabled={saving || uploading}
            className="px-6 py-2.5 rounded-full bg-primary text-on-primary text-xs font-semibold uppercase tracking-wider hover:bg-primary/90 disabled:opacity-60"
          >
            {uploading ? "Enviando imagem..." : saving ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // product object or {} for new
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    const { data, error: err } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: true });
    if (err) setError(err.message);
    setProducts(data || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const quickUpdate = async (id, patch) => {
    setProducts((ps) => ps.map((p) => (p.id === id ? { ...p, ...patch } : p)));
    const { error: err } = await supabase.from("products").update(patch).eq("id", id);
    if (err) {
      setError(err.message);
      load();
    }
  };

  if (loading) {
    return <p className="text-on-surface-variant">Carregando produtos...</p>;
  }

  return (
    <div>
      {error && (
        <div className="mb-4 bg-error/10 border border-error/40 text-error text-xs px-3 py-2 rounded-lg">{error}</div>
      )}
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-on-surface-variant">{products.length} produtos</p>
        <button
          onClick={() => setEditing({})}
          className="px-4 py-2 rounded-full bg-primary text-on-primary text-xs font-semibold uppercase tracking-wider hover:bg-primary/90 flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Novo produto
        </button>
      </div>

      <div className="overflow-x-auto bg-surface-container-lowest rounded-xl border border-outline-variant/30">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wider text-on-surface-variant border-b border-outline-variant/30">
              <th className="p-3">Produto</th>
              <th className="p-3 w-28">Preço</th>
              <th className="p-3 w-24">Estoque</th>
              <th className="p-3 w-20">Ativo</th>
              <th className="p-3 w-20"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-outline-variant/20">
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-surface-container flex items-center justify-center overflow-hidden">
                      {Array.isArray(p.images) && p.images[0] ? (
                        <img src={p.images[0]} alt="" className="w-full h-full object-contain" />
                      ) : (
                        <span className="material-symbols-outlined text-on-surface-variant/40 text-[18px]">visibility</span>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-on-surface">{p.name}</p>
                      <p className="text-xs text-on-surface-variant">{p.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="p-3">
                  <input
                    type="number"
                    defaultValue={p.price}
                    onBlur={(e) => quickUpdate(p.id, { price: Number(e.target.value) })}
                    className="w-20 bg-transparent border border-outline-variant/40 rounded px-2 py-1"
                  />
                </td>
                <td className="p-3">
                  <input
                    type="number"
                    defaultValue={p.stock}
                    onBlur={(e) => quickUpdate(p.id, { stock: Number(e.target.value) })}
                    className="w-16 bg-transparent border border-outline-variant/40 rounded px-2 py-1"
                  />
                </td>
                <td className="p-3">
                  <input
                    type="checkbox"
                    checked={p.is_active}
                    onChange={(e) => quickUpdate(p.id, { is_active: e.target.checked })}
                  />
                </td>
                <td className="p-3">
                  <button onClick={() => setEditing(p)} className="text-primary hover:underline text-xs font-semibold">
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <ProductModal
          initial={editing.id ? editing : null}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            load();
          }}
        />
      )}
    </div>
  );
}
