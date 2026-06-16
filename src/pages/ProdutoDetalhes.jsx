import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

const PRODUCTS = [
  {
    id: "aura-classic",
    name: "Aura Classic",
    price: 450,
    oldPrice: 550,
    description: "Armação redonda em tartaruga com hastes finas.",
    detailedDescription: "A armação Aura Classic combina a elegância atemporal do design redondo com a durabilidade do acetato premium. Ideal para rostos ovais e quadrados, proporcionando um visual intelectual e sofisticado.",
    material: "Acetato Mazzucchelli",
    shape: "Redondo",
    gender: "Feminino",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDM4Tsm4MeDgfaQMPpOIEZnSfutGVSXocom1cnycBQTxx4whlOkxiHXKVd4VN8Sewibz0fWmozu-lcMy01N3tfSgyugrNmaPq8Rat65aB60l4bE_itR58kcfJa2bWYg0AOhRKCJUV-Dsh5yhXU9K9XWHOUECC8nZW7bP_WsI-8DHFJBK1c1PLlsztG9z8-cxPTrmVpr4bMwVG4G_LK6Mt_BCNpcYneQ9e2BYO7grSixj8_VKUCTPaSR8Ei4KGCkHoP23AEc4PJBvOo",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAoBMH_zRIRvk7qifmj0Sw7Ce6Mi47AAAXHQBstTuE1Hb9mDDBDlJMnUzRm_OVo9MY9WzmWrGOsisSlu45u1TMjBmI_tXYF-YD30dcKhMc2V7eTULrf4Nfv7mS63V61IXjcPq95wRDqrOyQPBMwZtJhoaHRx4MsLSX4Qs5ldNOwkgcyJxzhkuul8ScDQD2heB_XrFbemnwSvNUVFgBAouVy9DjgqWSESgARhfAvW-yPQFNLQWSRVZRrg3coHfliAbuG7Fu5pUJ9lGI",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCQUywwlfvnUd23fr3qo5yfAFFublJktNoCONAoW_YSXG5FJiP6cNADlVGe9yCUnPX4xNVI_sYyq-T7l3w2esScEemoE7R_rf-65ajrJHq-NE5aVCqEtg1qDBfhmNO6LmiRbUi0W8MT7UxSZDSZMjP90UQ-tDQfG0Are5Y6b0mePRK0boooOrpePLcwVzw5qz83okIChoiEcnBVLQIyf2ru2u3rECwFNLXDZJAKB5AJ-KDHYLpBGdT-UW9K0QTF0dpFaJLrEXycKvE"
    ],
    colors: ["Tartaruga", "Preto", "Cristal"],
    colorHexes: ["#5C4033", "#000000", "#E5E4E2"],
    measurements: { aro: "50mm", ponte: "20mm", haste: "145mm" },
    isNew: false
  },
  {
    id: "lumina-cat",
    name: "Lumina Cat",
    price: 520,
    oldPrice: 620,
    description: "Design gatinho marcante para um olhar sofisticado.",
    detailedDescription: "A Lumina Cat traz traços expressivos e marcantes em um design cat-eye clássico com detalhes metálicos refinados nas dobradiças. Feita para rostos ovais ou arredondados que buscam destaque com suavidade.",
    material: "Acetato Premium",
    shape: "Gatinho",
    gender: "Feminino",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB3LRBBxYBUjJRixSDbf7UmW-GGrSVqaF4vThw0TgK7l6slZfWhFcXXgA1MMtizzGi3t_QHcNVNHZ0u2LvhRjXDDRXgICqdONFTNefNxMegrde_FodCQvKC6lymP4bFowQ6sAJU4YlB5YQKt9JGk_YGdBWRqRFPsT_vlX6DGQ0-hXQLPvfO-bU3r_0rUNsjB0mOAQu9v_av3FmOYhD-gMp3lv6qb8co-fyC2mp3-NNEXkhofP6iwlDuZNQvDBIhDnJRFNoh9uHNDwY",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCQUywwlfvnUd23fr3qo5yfAFFublJktNoCONAoW_YSXG5FJiP6cNADlVGe9yCUnPX4xNVI_sYyq-T7l3w2esScEemoE7R_rf-65ajrJHq-NE5aVCqEtg1qDBfhmNO6LmiRbUi0W8MT7UxSZDSZMjP90UQ-tDQfG0Are5Y6b0mePRK0boooOrpePLcwVzw5qz83okIChoiEcnBVLQIyf2ru2u3rECwFNLXDZJAKB5AJ-KDHYLpBGdT-UW9K0QTF0dpFaJLrEXycKvE"
    ],
    colors: ["Preto Onyx", "Vinho"],
    colorHexes: ["#000000", "#8B0000"],
    measurements: { aro: "52mm", ponte: "18mm", haste: "140mm" },
    isNew: false
  },
  {
    id: "vitre-minimal",
    name: "Vitre Minimal",
    price: 480,
    oldPrice: 580,
    description: "Estrutura transparente e leve para o dia a dia.",
    detailedDescription: "Vitre Minimal é o equilíbrio perfeito entre design industrial e leveza. Sua estrutura transparente de acetato cristalizado oferece um ajuste confortável e um visual contemporâneo discreto.",
    material: "Titânio & Acetato",
    shape: "Quadrado",
    gender: "Unissex",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCXK5l35zZvOplUI17knjVn_8XgpET58U6IYHYzanOCl07KOjQYc37DupdfWq5yHk1g2u5Ma1WfwgSG8_WedyGyDg_BV6JMmx6sXJzzY44jAFtIBmF_aNtxrfq_oFC_nshKv4QUigHM9mYeDyqAnUj29wIrFTXWnZA-kalfVcqTfOTcYuGn1aGhLInxki5PIQW0D2Y9uly5FKttxnajup3toaosYe0Gxd_AOejuHL6n1w43uX8xTY5o2Mi-Y3dPvco2UNGFbizZ-hY",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAoBMH_zRIRvk7qifmj0Sw7Ce6Mi47AAAXHQBstTuE1Hb9mDDBDlJMnUzRm_OVo9MY9WzmWrGOsisSlu45u1TMjBmI_tXYF-YD30dcKhMc2V7eTULrf4Nfv7mS63V61IXjcPq95wRDqrOyQPBMwZtJhoaHRx4MsLSX4Qs5ldNOwkgcyJxzhkuul8ScDQD2heB_XrFbemnwSvNUVFgBAouVy9DjgqWSESgARhfAvW-yPQFNLQWSRVZRrg3coHfliAbuG7Fu5pUJ9lGI"
    ],
    colors: ["Transparente", "Cinza Matte"],
    colorHexes: ["#E5E4E2", "#A9A9A9"],
    measurements: { aro: "51mm", ponte: "19mm", haste: "145mm" },
    isNew: true
  }
];

export default function ProdutoDetalhes() {
  const { id } = useParams();
  const product = PRODUCTS.find((p) => p.id === id) || PRODUCTS[0];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState("M");
  const [isFavorite, setIsFavorite] = useState(false);
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(true);
  const [cartSuccess, setCartSuccess] = useState(false);

  // Reset indices on product change
  useEffect(() => {
    setActiveImageIndex(0);
    setSelectedColor(0);
  }, [product]);

  const handleAddToCart = () => {
    setCartSuccess(true);
    setTimeout(() => setCartSuccess(false), 3000);
  };

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
                <h1 className="font-display text-3xl text-on-surface font-bold mb-1">{product.name}</h1>
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
              <span className="font-display text-3xl text-primary font-bold">R$ {product.price}</span>
              <span className="text-on-surface-variant text-sm line-through pb-1">R$ {product.oldPrice}</span>
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
                  <h4 className="font-display text-sm font-bold text-on-surface mb-1">Adicionar Lentes de Grau?</h4>
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
                className="w-full flex justify-between items-center font-display text-base font-bold text-on-surface py-4 border-b border-outline-variant/30"
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
