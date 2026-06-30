import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchProductBySlug } from "../lib/products";
import { useCart } from "../context/CartContext";

export default function ProdutoDetalhes() {
  const { id } = useParams();
  const { addItem } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState("M");
  const [isFavorite, setIsFavorite] = useState(false);
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(true);
  const [cartSuccess, setCartSuccess] = useState(false);

  // Carrega o produto pelo slug da URL
  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchProductBySlug(id)
      .then((data) => {
        if (active) {
          setProduct(data);
          setActiveImageIndex(0);
          setSelectedColor(0);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addItem({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || product.image || "",
      color: product.colors?.[selectedColor] ?? null,
      stock: product.stock
    });
    setCartSuccess(true);
    setTimeout(() => setCartSuccess(false), 3000);
  };

  if (loading) {
    return (
      <div className="bg-background min-h-screen flex flex-col items-center justify-center font-body py-20">
        <span className="material-symbols-outlined text-5xl text-on-surface-variant/40 mb-3 animate-pulse">visibility</span>
        <p className="text-on-surface-variant">Carregando produto...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-background min-h-screen flex flex-col items-center justify-center font-body py-20 gap-4 text-center px-6">
        <span className="material-symbols-outlined text-5xl text-on-surface-variant/40">search_off</span>
        <p className="text-on-surface-variant">Produto não encontrado.</p>
        <Link to="/catalogo" className="text-primary font-semibold underline">
          Voltar ao catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen flex flex-col font-body">
      <main className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 flex flex-col md:grid md:grid-cols-12 md:gap-12">
        
        {/* Left Column: Image Gallery */}
        <section className="col-span-12 md:col-span-7 flex flex-col gap-4">
          <div className="relative w-full aspect-[4/5] bg-surface-container rounded-xl overflow-hidden shadow-md border border-outline-variant/20">
            <img 
              alt={product.name} 
              className="w-full h-full object-cover object-center" 
              src={product.images[activeImageIndex]}
            />
            {/* Floating Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.isNew && (
                <span className="bg-primary text-on-primary text-[9px] font-bold tracking-wider px-3 py-1.5 rounded-full shadow-sm uppercase">
                  Novo
                </span>
              )}
              <span className="glass-panel text-on-surface text-[9px] font-bold tracking-wider px-3 py-1.5 rounded-full flex items-center gap-1 uppercase shadow-sm border border-white/50">
                <span className="material-symbols-outlined text-[14px]">auto_awesome</span> Premium
              </span>
            </div>
          </div>

          {/* Thumbnail Carousel */}
          <div className="flex gap-3 overflow-x-auto py-2 hide-scrollbar">
            {product.images.map((img, index) => (
              <button 
                key={index}
                onClick={() => setActiveImageIndex(index)}
                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                  activeImageIndex === index 
                    ? "border-primary opacity-100" 
                    : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <img alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" src={img} />
              </button>
            ))}
            <Link 
              to="/catalogo"
              className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border border-outline-variant bg-surface-container flex flex-col items-center justify-center relative text-on-surface-variant hover:border-primary hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined">face</span>
              <span className="absolute bottom-1 w-full text-center text-[8px] font-bold tracking-wider uppercase">PROVAR</span>
            </Link>
          </div>
        </section>

        {/* Right Column: Product Information */}
        <section className="col-span-12 md:col-span-5 flex flex-col gap-6 mt-6 md:mt-0">
          <div>
            <div className="flex justify-between items-start mb-2">
              <div>
                <h1 className="font-playfair text-3xl text-on-surface font-bold mb-1">{product.name}</h1>
                <p className="font-body text-xs text-on-surface-variant uppercase tracking-wider font-semibold">
                  Coleção Aurora
                </p>
              </div>
              <button 
                onClick={() => setIsFavorite(!isFavorite)}
                className={`p-2 rounded-full transition-all border border-outline-variant/30 hover:border-primary hover:text-primary ${
                  isFavorite ? "text-primary bg-primary-container/20" : "text-on-surface-variant"
                }`}
              >
                <span 
                  className="material-symbols-outlined text-2xl block"
                  style={{ fontVariationSettings: isFavorite ? "'FILL' 1" : "'FILL' 0" }}
                >
                  favorite
                </span>
              </button>
            </div>

            <div className="flex items-end gap-3 mt-4 mb-6">
              <span className="font-playfair text-3xl text-primary font-bold">R$ {product.price}</span>
              {product.oldPrice ? (
                <span className="text-on-surface-variant text-sm line-through pb-1">R$ {product.oldPrice}</span>
              ) : null}
            </div>
            
            <p className="font-body text-sm text-on-surface-variant leading-relaxed mb-6">
              {product.detailedDescription}
            </p>

            {/* Configurator: Color */}
            <div className="mb-6">
              <h3 className="font-body text-xs font-bold text-on-surface uppercase tracking-wider mb-3">
                Cor da Armação: <span className="font-normal text-on-surface-variant ml-1">{product.colors[selectedColor]}</span>
              </h3>
              <div className="flex gap-4">
                {product.colors.map((color, index) => (
                  <button 
                    key={color}
                    onClick={() => setSelectedColor(index)}
                    className={`w-10 h-10 rounded-full border-2 transition-all ${
                      selectedColor === index 
                        ? "border-primary ring-2 ring-primary/20 ring-offset-2" 
                        : "border-outline-variant hover:border-primary"
                    }`}
                    style={{ backgroundColor: product.colorHexes[index] }}
                    title={color}
                  />
                ))}
              </div>
            </div>

            {/* Configurator: Size */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-body text-xs font-bold text-on-surface uppercase tracking-wider">Tamanho</h3>
                <span className="text-primary text-xs font-semibold underline cursor-pointer">Guia de Medidas</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {["P", "M", "G"].map((size) => (
                  <button 
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-3 px-4 border rounded-lg font-body text-xs font-bold text-center transition-all ${
                      selectedSize === size
                        ? "border-2 border-primary bg-primary-container text-on-primary-container"
                        : "border-outline-variant/50 text-on-surface-variant hover:border-primary hover:text-primary"
                    }`}
                  >
                    {size} ({size === "P" ? "48mm" : size === "M" ? "51mm" : "54mm"})
                  </button>
                ))}
              </div>
            </div>

            {/* Lenses Upsell */}
            <div className="bg-surface-container rounded-xl p-4 border border-outline-variant/30 mb-6 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-background rounded-full shadow-sm flex-shrink-0 text-primary">
                  <span className="material-symbols-outlined">visibility</span>
                </div>
                <div>
                  <h4 className="font-playfair text-sm font-bold text-on-surface mb-1">Adicionar Lentes de Grau?</h4>
                  <p className="text-xs text-on-surface-variant mb-3 leading-relaxed">
                    Envie sua receita após a compra. Trabalhamos com as melhores tecnologias de lentes antireflexo, luz azul e multifocais do mercado.
                  </p>
                  <button className="text-primary font-body text-[10px] font-bold border border-primary rounded-full px-4 py-2 hover:bg-primary hover:text-on-primary transition-all uppercase tracking-wider">
                    Ver Opções de Lentes
                  </button>
                </div>
              </div>
            </div>

            {/* Product Details Accordion */}
            <div className="border-t border-outline-variant/30">
              <button 
                onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
                className="w-full flex justify-between items-center font-playfair text-base font-bold text-on-surface py-4 border-b border-outline-variant/30"
              >
                <span>Detalhes Técnicos</span>
                <span className={`material-symbols-outlined transition-transform duration-300 ${
                  showTechnicalDetails ? "rotate-180" : ""
                }`}>
                  expand_more
                </span>
              </button>
              {showTechnicalDetails && (
                <div className="py-4 text-xs font-body text-on-surface-variant bg-[#F7F4EF]/30 px-2 rounded-b-lg">
                  <ul className="space-y-3">
                    <li className="flex justify-between border-b border-outline-variant/20 pb-2">
                      <span className="font-semibold text-on-surface">Material</span>
                      <span>{product.material}</span>
                    </li>
                    <li className="flex justify-between border-b border-outline-variant/20 pb-2">
                      <span className="font-semibold text-on-surface">Dobradiças</span>
                      <span>Flexíveis 5-cilindros</span>
                    </li>
                    <li className="flex justify-between border-b border-outline-variant/20 pb-2">
                      <span className="font-semibold text-on-surface">Medidas do Aro</span>
                      <span>{product.measurements.aro}</span>
                    </li>
                    <li className="flex justify-between border-b border-outline-variant/20 pb-2">
                      <span className="font-semibold text-on-surface">Medidas da Ponte</span>
                      <span>{product.measurements.ponte}</span>
                    </li>
                    <li className="flex justify-between pb-2">
                      <span className="font-semibold text-on-surface">Medidas da Haste</span>
                      <span>{product.measurements.haste}</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 mt-8">
              {cartSuccess ? (
                <div className="bg-[#D4AF37]/20 border border-[#D4AF37] text-on-surface text-center py-4 rounded-lg text-xs font-bold uppercase tracking-wider shadow-sm transition-all duration-300">
                  Adicionado ao Carrinho!
                </div>
              ) : (
                <button 
                  onClick={handleAddToCart}
                  className="w-full bg-primary hover:bg-[#554300] text-on-primary py-4 rounded-lg font-body text-xs font-bold uppercase tracking-wider shadow-lg flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">shopping_bag</span>
                  Adicionar ao Carrinho
                </button>
              )}
              <Link 
                to="/catalogo"
                className="w-full bg-transparent border border-primary text-primary py-4 rounded-lg font-body text-xs font-bold uppercase tracking-wider hover:bg-primary-container hover:text-on-primary-container transition-all flex items-center justify-center gap-2 text-center"
              >
                <span className="material-symbols-outlined text-sm">face</span>
                Testar Provador Virtual
              </Link>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
