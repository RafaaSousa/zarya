import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchProducts } from "../lib/products";
import { useCart } from "../context/CartContext";
import VirtualTryOn3D from "../components/VirtualTryOn3D";

export default function Catalogo() {
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [selectedGender, setSelectedGender] = useState("");
  const [selectedShape, setSelectedShape] = useState("");
  const [selectedMaterial, setSelectedMaterial] = useState("");
  const [sortOrder, setSortOrder] = useState("Lançamentos");
  const { addItem } = useCart();

  // Try-on modal state
  const [activeTryOnProduct, setActiveTryOnProduct] = useState(null);
  const [activeColorIndex, setActiveColorIndex] = useState(0);
  const [cartSuccess, setCartSuccess] = useState(false);
  const [trackStatus, setTrackStatus] = useState("searching");

  useEffect(() => {
    let active = true;
    setProductsLoading(true);
    fetchProducts()
      .then((list) => {
        if (active) setProducts(list);
      })
      .finally(() => {
        if (active) setProductsLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const handleClearFilters = () => {
    setSelectedGender("");
    setSelectedShape("");
    setSelectedMaterial("");
  };

  const filteredProducts = products.filter((product) => {
    if (selectedGender && product.gender !== selectedGender) return false;
    if (selectedShape && product.shape !== selectedShape) return false;
    if (selectedMaterial && product.material !== selectedMaterial) return false;
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOrder === "Menor Preço") return a.price - b.price;
    if (sortOrder === "Maior Preço") return b.price - a.price;
    return 0;
  });

  const openTryOnModal = (product) => {
    setActiveTryOnProduct(product);
    setActiveColorIndex(0);
    setCartSuccess(false);
    setTrackStatus("searching");
  };

  const closeTryOnModal = () => {
    setActiveTryOnProduct(null);
    setCartSuccess(false);
  };

  const handleAddToCart = () => {
    if (!activeTryOnProduct) return;
    addItem({
      id: activeTryOnProduct.id,
      slug: activeTryOnProduct.slug,
      name: activeTryOnProduct.name,
      price: activeTryOnProduct.price,
      image: activeTryOnProduct.image || activeTryOnProduct.overlayImage,
      color: activeTryOnProduct.colors?.[activeColorIndex] ?? null,
      stock: activeTryOnProduct.stock
    });
    setCartSuccess(true);
    setTimeout(() => setCartSuccess(false), 3000);
  };

  const tryOnProductFor3D = activeTryOnProduct
    ? {
        id: activeTryOnProduct.id,
        shape: activeTryOnProduct.shape,
        model3dUrl: activeTryOnProduct.model3dUrl,
        colorHex: activeTryOnProduct.colorHexes?.[activeColorIndex] || "#222222"
      }
    : null;

  const statusLabel =
    trackStatus === "stable" ? "Rastreando rosto" : "Procurando rosto...";

  return (
    <div className="bg-background min-h-screen flex flex-col font-body">
      <main className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 md:py-12 flex flex-col gap-6">
        {/* Page Header */}
        <header className="text-center md:text-left mb-6">
          <h1 className="font-display text-5xl md:text-6xl text-primary font-normal mb-2">
            Catálogo &amp; Provador Virtual 3D
          </h1>
          <p className="text-on-surface-variant max-w-2xl text-sm md:text-base">
            Explore nossa coleção exclusiva de armações e experimente o caimento perfeito com nosso
            provador virtual em 3D, que acompanha os movimentos do seu rosto em tempo real.
          </p>
        </header>

        <div className="flex flex-col md:flex-row gap-6 relative">
          {/* Sidebar Filters */}
          <aside className="w-full md:w-64 flex-shrink-0">
            <div className="sticky top-24 bg-surface-container-lowest p-6 rounded-xl shadow-md border border-outline-variant/30">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-playfair text-lg font-bold text-on-surface">Filtros</h2>
                <button
                  onClick={handleClearFilters}
                  className="text-primary font-body text-xs font-semibold hover:underline"
                >
                  Limpar
                </button>
              </div>

              <div className="mb-6 border-b border-surface-variant/30 pb-6">
                <h3 className="font-body text-xs font-semibold text-on-surface-variant mb-4 uppercase tracking-wider">
                  Gênero
                </h3>
                <div className="space-y-3">
                  {["Feminino", "Masculino", "Unissex"].map((gender) => (
                    <label key={gender} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="gender"
                        checked={selectedGender === gender}
                        onChange={() => setSelectedGender(gender)}
                        className="w-4 h-4 border-outline rounded text-primary focus:ring-primary focus:ring-offset-0"
                      />
                      <span className="text-on-surface font-body text-sm">{gender}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-6 border-b border-surface-variant/30 pb-6">
                <h3 className="font-body text-xs font-semibold text-on-surface-variant mb-4 uppercase tracking-wider">
                  Formato
                </h3>
                <div className="flex flex-wrap gap-2">
                  {["Wayfarer", "Aviador", "Redondo", "Gatinho"].map((shape) => (
                    <button
                      key={shape}
                      onClick={() => setSelectedShape(selectedShape === shape ? "" : shape)}
                      className={`px-3 py-1.5 rounded-full border font-body text-xs transition-colors ${
                        selectedShape === shape
                          ? "border-primary bg-primary-container text-on-primary-container"
                          : "border-outline-variant/50 text-on-surface hover:border-primary hover:text-primary"
                      }`}
                    >
                      {shape}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-body text-xs font-semibold text-on-surface-variant mb-4 uppercase tracking-wider">
                  Material
                </h3>
                <div className="space-y-3">
                  {["Acetato", "Metal", "Titânio"].map((material) => (
                    <label key={material} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="material"
                        checked={selectedMaterial === material}
                        onChange={() => setSelectedMaterial(material)}
                        className="w-4 h-4 border-outline rounded text-primary focus:ring-primary focus:ring-offset-0"
                      />
                      <span className="text-on-surface font-body text-sm">{material}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-grow">
            <div className="flex justify-between items-center mb-6">
              <span className="text-on-surface-variant font-body text-sm">
                Exibindo {sortedProducts.length} resultados
              </span>
              <div className="flex items-center gap-2">
                <span className="text-on-surface-variant font-body text-xs font-bold uppercase tracking-wider">
                  Ordenar por:
                </span>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="bg-transparent border-none text-primary font-semibold text-sm focus:ring-0 cursor-pointer outline-none"
                >
                  <option>Lançamentos</option>
                  <option>Menor Preço</option>
                  <option>Maior Preço</option>
                </select>
              </div>
            </div>

            {productsLoading ? (
              <div className="text-center py-16 bg-surface-container-lowest rounded-xl border border-dashed border-outline-variant/40">
                <span className="material-symbols-outlined text-5xl text-on-surface-variant/40 mb-2 animate-pulse">
                  visibility
                </span>
                <p className="font-body text-on-surface-variant">Carregando armações...</p>
              </div>
            ) : sortedProducts.length === 0 ? (
              <div className="text-center py-16 bg-surface-container-lowest rounded-xl border border-dashed border-outline-variant/40">
                <span className="material-symbols-outlined text-5xl text-on-surface-variant/40 mb-2">
                  search_off
                </span>
                <p className="font-body text-on-surface-variant">
                  Nenhum óculos encontrado com estes filtros.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedProducts.map((product) => (
                  <article
                    key={product.id}
                    className="bg-surface-container-lowest rounded-xl p-6 shadow-md flex flex-col group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 border border-transparent hover:border-primary-container"
                  >
                    <div className="relative mb-6 h-48 flex items-center justify-center bg-surface-container rounded-lg overflow-hidden p-4">
                      <Link
                        to={`/produto/${product.slug}`}
                        className="w-full h-full flex items-center justify-center"
                      >
                        <img
                          alt={product.name}
                          className="max-h-full max-w-full object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-300 mix-blend-multiply"
                          src={product.image}
                        />
                      </Link>
                      <div className="absolute top-3 left-3 flex flex-col gap-2">
                        <span className="bg-[#F7F4EF] text-on-surface-variant px-2 py-1 rounded-full font-body text-[9px] uppercase tracking-wider shadow-sm font-semibold">
                          {product.material}
                        </span>
                      </div>
                      {product.isNew && (
                        <div className="absolute top-3 right-3">
                          <span className="bg-primary text-on-primary px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider shadow-sm">
                            Novo
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex-grow flex flex-col">
                      <div className="flex justify-between items-start mb-2">
                        <Link to={`/produto/${product.slug}`}>
                          <h3 className="font-playfair text-lg font-bold text-on-surface group-hover:text-primary transition-colors">
                            {product.name}
                          </h3>
                        </Link>
                        <span className="font-body text-base text-primary font-bold">
                          R$ {product.price}
                        </span>
                      </div>

                      <p className="text-on-surface-variant text-xs mb-4 leading-relaxed">
                        {product.description}
                      </p>

                      <div className="flex gap-2 mb-6 mt-auto">
                        {product.colorHexes.map((hex, index) => (
                          <button
                            key={index}
                            title={product.colors[index]}
                            className="w-5 h-5 rounded-full border border-outline/30 ring-2 ring-transparent hover:ring-primary/20 transition-all"
                            style={{ backgroundColor: hex }}
                          />
                        ))}
                      </div>

                      <button
                        onClick={() => openTryOnModal(product)}
                        className="w-full flex items-center justify-center gap-2 bg-primary-container text-on-primary-container py-3 rounded-lg font-body text-xs font-bold uppercase hover:bg-primary hover:text-on-primary transition-colors group/btn shadow-sm"
                      >
                        <span className="material-symbols-outlined text-[18px] group-hover/btn:scale-110 transition-transform">
                          view_in_ar
                        </span>
                        Provar em 3D
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Virtual Try-On 3D Modal */}
      {activeTryOnProduct && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-inverse-surface/60 backdrop-blur-sm transition-opacity"
            onClick={closeTryOnModal}
          />

          <div className="relative z-10 w-full max-w-5xl bg-surface-container-lowest md:rounded-2xl shadow-2xl flex flex-col md:flex-row h-full md:h-auto max-h-[95vh] overflow-hidden m-4 border border-outline-variant/30">
            <button
              className="absolute top-4 right-4 z-20 w-10 h-10 bg-surface-container-lowest/80 backdrop-blur rounded-full flex items-center justify-center text-on-surface hover:text-error transition-colors shadow-md border border-outline-variant/20"
              onClick={closeTryOnModal}
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            {/* Left: 3D camera view */}
            <div className="w-full md:w-3/5 bg-[#F5EDDF]/40 relative flex items-center justify-center overflow-hidden min-h-[400px] md:min-h-[512px]">
              <VirtualTryOn3D
                product={tryOnProductFor3D}
                onStatus={({ status }) => setTrackStatus(status)}
              />
              <div className="absolute top-4 left-4 z-10 bg-slate-950/70 text-white text-[11px] px-3 py-2 rounded-lg backdrop-blur flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${
                    trackStatus === "stable" ? "bg-emerald-400" : "bg-amber-400 animate-pulse"
                  }`}
                />
                {statusLabel}
              </div>
            </div>

            {/* Right: Product details */}
            <div className="w-full md:w-2/5 p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
              <div>
                <div className="mb-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-primary mb-1 block">
                    Provando em 3D
                  </span>
                  <h2 className="font-playfair text-2xl md:text-3xl text-on-surface font-bold">
                    {activeTryOnProduct.name}
                  </h2>
                  <p className="font-body text-xl font-bold text-on-surface-variant mt-1">
                    R$ {activeTryOnProduct.price}
                  </p>
                </div>

                <p className="text-sm font-body text-on-surface-variant leading-relaxed mb-6">
                  {activeTryOnProduct.detailedDescription}
                </p>

                <div className="mb-6">
                  <h4 className="font-body text-xs font-bold text-on-surface mb-3 uppercase tracking-wider">
                    Cores Disponíveis
                  </h4>
                  <div className="flex gap-4">
                    {activeTryOnProduct.colors.map((color, index) => (
                      <button
                        key={color}
                        onClick={() => setActiveColorIndex(index)}
                        className="group relative flex flex-col items-center gap-1 focus:outline-none"
                      >
                        <div
                          className={`w-8 h-8 rounded-full border-2 transition-all ${
                            activeColorIndex === index
                              ? "border-primary ring-2 ring-primary/20"
                              : "border-transparent hover:border-outline-variant"
                          }`}
                          style={{ backgroundColor: activeTryOnProduct.colorHexes[index] }}
                        />
                        <span
                          className={`text-[10px] font-semibold ${
                            activeColorIndex === index ? "text-primary" : "text-on-surface-variant"
                          }`}
                        >
                          {color}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-body text-xs font-bold text-on-surface mb-3 uppercase tracking-wider">
                    Medidas
                  </h4>
                  <div className="grid grid-cols-3 gap-2 text-center bg-[#F7F4EF]/50 p-3 rounded-lg border border-surface-variant/40">
                    <div>
                      <span className="material-symbols-outlined text-primary mb-1 text-[20px]">
                        width_normal
                      </span>
                      <p className="text-[10px] text-on-surface-variant font-bold">Aro</p>
                      <p className="font-bold text-xs text-on-surface">
                        {activeTryOnProduct.measurements?.aro}
                      </p>
                    </div>
                    <div className="border-l border-r border-surface-variant/30">
                      <span className="material-symbols-outlined text-primary mb-1 text-[20px]">
                        straighten
                      </span>
                      <p className="text-[10px] text-on-surface-variant font-bold">Ponte</p>
                      <p className="font-bold text-xs text-on-surface">
                        {activeTryOnProduct.measurements?.ponte}
                      </p>
                    </div>
                    <div>
                      <span className="material-symbols-outlined text-primary mb-1 text-[20px]">
                        line_weight
                      </span>
                      <p className="text-[10px] text-on-surface-variant font-bold">Haste</p>
                      <p className="font-bold text-xs text-on-surface">
                        {activeTryOnProduct.measurements?.haste}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-[#F7F4EF]/50 p-4 rounded-lg border border-surface-variant/40 text-xs text-on-surface-variant leading-relaxed">
                  Mova e gire a cabeça lentamente: a armação 3D acompanha a inclinação e a rotação do
                  seu rosto. Para melhor resultado, use boa iluminação e mantenha o rosto centralizado.
                </div>
              </div>

              <div className="space-y-3 mt-6">
                {cartSuccess ? (
                  <div className="bg-[#D4AF37]/20 border border-[#D4AF37] text-on-surface text-center py-3 rounded-lg text-xs font-bold uppercase transition-all duration-300">
                    Adicionado ao Carrinho!
                  </div>
                ) : (
                  <button
                    onClick={handleAddToCart}
                    className="w-full bg-primary-container text-on-primary-container py-4 rounded-lg font-body text-xs font-bold uppercase hover:bg-primary hover:text-on-primary transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-sm">shopping_bag</span>
                    Adicionar ao Carrinho
                  </button>
                )}
                <Link
                  to={`/produto/${activeTryOnProduct.slug}`}
                  className="w-full bg-transparent border border-primary text-primary py-4 rounded-lg font-body text-xs font-bold uppercase hover:bg-primary-container hover:text-on-primary-container transition-all flex items-center justify-center gap-2 text-center"
                >
                  <span className="material-symbols-outlined text-sm">info</span>
                  Ver detalhes
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
