import { supabase, isSupabaseConfigured } from "./supabaseClient";

// Imagens reutilizadas no fallback (mesmas usadas no design original).
const IMG = {
  aura1:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDM4Tsm4MeDgfaQMPpOIEZnSfutGVSXocom1cnycBQTxx4whlOkxiHXKVd4VN8Sewibz0fWmozu-lcMy01N3tfSgyugrNmaPq8Rat65aB60l4bE_itR58kcfJa2bWYg0AOhRKCJUV-Dsh5yhXU9K9XWHOUECC8nZW7bP_WsI-8DHFJBK1c1PLlsztG9z8-cxPTrmVpr4bMwVG4G_LK6Mt_BCNpcYneQ9e2BYO7grSixj8_VKUCTPaSR8Ei4KGCkHoP23AEc4PJBvOo",
  aura2:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAoBMH_zRIRvk7qifmj0Sw7Ce6Mi47AAAXHQBstTuE1Hb9mDDBDlJMnUzRm_OVo9MY9WzmWrGOsisSlu45u1TMjBmI_tXYF-YD30dcKhMc2V7eTULrf4Nfv7mS63V61IXjcPq95wRDqrOyQPBMwZtJhoaHRx4MsLSX4Qs5ldNOwkgcyJxzhkuul8ScDQD2heB_XrFbemnwSvNUVFgBAouVy9DjgqWSESgARhfAvW-yPQFNLQWSRVZRrg3coHfliAbuG7Fu5pUJ9lGI",
  aura3:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCQUywwlfvnUd23fr3qo5yfAFFublJktNoCONAoW_YSXG5FJiP6cNADlVGe9yCUnPX4xNVI_sYyq-T7l3w2esScEemoE7R_rf-65ajrJHq-NE5aVCqEtg1qDBfhmNO6LmiRbUi0W8MT7UxSZDSZMjP90UQ-tDQfG0Are5Y6b0mePRK0boooOrpePLcwVzw5qz83okIChoiEcnBVLQIyf2ru2u3rECwFNLXDZJAKB5AJ-KDHYLpBGdT-UW9K0QTF0dpFaJLrEXycKvE",
  lumina1:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuB3LRBBxYBUjJRixSDbf7UmW-GGrSVqaF4vThw0TgK7l6slZfWhFcXXgA1MMtizzGi3t_QHcNVNHZ0u2LvhRjXDDRXgICqdONFTNefNxMegrde_FodCQvKC6lymP4bFowQ6sAJU4YlB5YQKt9JGk_YGdBWRqRFPsT_vlX6DGQ0-hXQLPvfO-bU3r_0rUNsjB0mOAQu9v_av3FmOYhD-gMp3lv6qb8co-fyC2mp3-NNEXkhofP6iwlDuZNQvDBIhDnJRFNoh9uHNDwY",
  vitre1:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCXK5l35zZvOplUI17knjVn_8XgpET58U6IYHYzanOCl07KOjQYc37DupdfWq5yHk1g2u5Ma1WfwgSG8_WedyGyDg_BV6JMmx6sXJzzY44jAFtIBmF_aNtxrfq_oFC_nshKv4QUigHM9mYeDyqAnUj29wIrFTXWnZA-kalfVcqTfOTcYuGn1aGhLInxki5PIQW0D2Y9uly5FKttxnajup3toaosYe0Gxd_AOejuHL6n1w43uX8xTY5o2Mi-Y3dPvco2UNGFbizZ-hY",
  overlay:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuC_FOmBVPOV2qVypcXH13ml0hFntAk5uDDsuPveNqKpy7e4mWBWEk8Bw-pzCPIxirDpBHQv4KZEL02umwB-_ThMLKNApULLQXCZArdnPhwBFjSC18oicxJEoHsgZB8vn4ggNz3XPhp8AzZ_BJsmA9nqXpWfFMgw2G3SwPhxxQc7bqd2wd07Yz_45mOCpfruGVp8ik81vhawtBKYF6TJrM3hjFHIewZLiARalIhCGVLIDgn5e1OAc2NNdVyZ1i_hS7Oxou6_FgUTJ2I"
};

// Fallback local — usado se o Supabase não estiver configurado ou a query falhar.
// Mantém o site funcional (com armações reais) mesmo sem backend.
// Os `shape` correspondem aos arquétipos 3D do provador (VirtualTryOn3D).
export const FALLBACK_PRODUCTS = [
  {
    id: "fallback-wayfarer-classico",
    slug: "wayfarer-classico",
    name: "Wayfarer Clássico",
    price: 690,
    oldPrice: 790,
    description: "Armação acetato quadrada icônica, atemporal e versátil.",
    detailedDescription:
      "O formato Wayfarer é um clássico absoluto: acetato encorpado, linhas quadradas levemente trapezoidais e presença marcante. Combina com praticamente todos os tipos de rosto.",
    material: "Acetato",
    shape: "Wayfarer",
    gender: "Unissex",
    images: [IMG.vitre1],
    image: IMG.vitre1,
    overlayImage: IMG.overlay,
    overlayMeta: null,
    model3dUrl: null,
    colors: ["Preto", "Tartaruga"],
    colorHexes: ["#1a1a1a", "#3b2a17"],
    measurements: { aro: "52mm", ponte: "18mm", haste: "150mm" },
    stock: 15,
    isNew: true
  },
  {
    id: "fallback-aviador-classico",
    slug: "aviador-classico",
    name: "Aviador Clássico",
    price: 820,
    oldPrice: 980,
    description: "Lentes em gota e armação metálica leve, estilo aviador.",
    detailedDescription:
      "O lendário formato aviador, com lentes em gota e estrutura metálica fina de dupla ponte. Um ícone de elegância que nunca sai de moda.",
    material: "Metal",
    shape: "Aviador",
    gender: "Unissex",
    images: [IMG.aura1],
    image: IMG.aura1,
    overlayImage: IMG.overlay,
    overlayMeta: null,
    model3dUrl: null,
    colors: ["Dourado", "Prata"],
    colorHexes: ["#c8a24b", "#b8b8c0"],
    measurements: { aro: "58mm", ponte: "14mm", haste: "140mm" },
    stock: 12,
    isNew: false
  },
  {
    id: "fallback-round-metal",
    slug: "round-metal",
    name: "Round Metal",
    price: 650,
    oldPrice: 720,
    description: "Armação redonda metálica, visual retrô e intelectual.",
    detailedDescription:
      "Inspirada nos óculos redondos clássicos, com aros finos de metal e ponte chave. Um visual retrô sofisticado e atemporal.",
    material: "Metal",
    shape: "Redondo",
    gender: "Unissex",
    images: [IMG.lumina1],
    image: IMG.lumina1,
    overlayImage: IMG.overlay,
    overlayMeta: null,
    model3dUrl: null,
    colors: ["Dourado", "Grafite"],
    colorHexes: ["#c8a24b", "#2b2b2b"],
    measurements: { aro: "49mm", ponte: "21mm", haste: "145mm" },
    stock: 10,
    isNew: false
  },
  {
    id: "fallback-cat-eye-chic",
    slug: "cat-eye-chic",
    name: "Cat-Eye Chic",
    price: 740,
    oldPrice: 860,
    description: "Gatinho marcante em acetato, sofisticação feminina.",
    detailedDescription:
      "O formato gatinho com pontas elevadas confere um olhar marcante e elegante. Acetato premium com acabamento brilhante.",
    material: "Acetato",
    shape: "Gatinho",
    gender: "Feminino",
    images: [IMG.aura3],
    image: IMG.aura3,
    overlayImage: IMG.overlay,
    overlayMeta: null,
    model3dUrl: null,
    colors: ["Preto", "Vinho"],
    colorHexes: ["#1a1a1a", "#7a1f2b"],
    measurements: { aro: "53mm", ponte: "16mm", haste: "140mm" },
    stock: 9,
    isNew: true
  }
];

// Converte uma linha do banco (snake_case) para o formato usado nos componentes.
export function normalizeProduct(row) {
  const images = Array.isArray(row.images) ? row.images : [];
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    price: Number(row.price),
    oldPrice: row.old_price != null ? Number(row.old_price) : null,
    description: row.description || "",
    detailedDescription: row.detailed_description || "",
    material: row.material || "",
    shape: row.shape || "",
    gender: row.gender || "",
    images,
    image: images[0] || row.overlay_image || "",
    overlayImage: row.overlay_image || "",
    overlayMeta: row.overlay_meta || null,
    model3dUrl: row.model_3d_url || null,
    colors: Array.isArray(row.colors) ? row.colors : [],
    colorHexes: Array.isArray(row.color_hexes) ? row.color_hexes : [],
    measurements: row.measurements || {},
    stock: Number(row.stock ?? 0),
    isNew: Boolean(row.is_new)
  };
}

export async function fetchProducts() {
  if (!isSupabaseConfigured || !supabase) return FALLBACK_PRODUCTS;
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: true });
    if (error) throw error;
    if (!data || data.length === 0) return FALLBACK_PRODUCTS;
    return data.map(normalizeProduct);
  } catch (err) {
    console.error("[products] fetchProducts falhou, usando fallback:", err);
    return FALLBACK_PRODUCTS;
  }
}

export async function fetchProductBySlug(slug) {
  if (!isSupabaseConfigured || !supabase) {
    return FALLBACK_PRODUCTS.find((p) => p.slug === slug) || null;
  }
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .eq("is_active", true)
      .maybeSingle();
    if (error) throw error;
    if (!data) return FALLBACK_PRODUCTS.find((p) => p.slug === slug) || null;
    return normalizeProduct(data);
  } catch (err) {
    console.error("[products] fetchProductBySlug falhou, usando fallback:", err);
    return FALLBACK_PRODUCTS.find((p) => p.slug === slug) || null;
  }
}
