import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function CartDrawer({ open, onClose }) {
  const { items, subtotal, count, removeItem, updateQty } = useCart();
  const navigate = useNavigate();

  const goToCheckout = () => {
    onClose?.();
    navigate("/checkout");
  };

  return (
    <div
      className={`fixed inset-0 z-[110] transition-all duration-300 ${
        open ? "pointer-events-auto" : "pointer-events-none"
      }`}
      aria-hidden={!open}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-on-surface/20 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Drawer (direita) */}
      <div
        className={`absolute top-0 right-0 w-[340px] max-w-[90vw] h-full bg-[#F7F4EF] shadow-2xl transition-transform duration-300 ease-in-out flex flex-col ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Carrinho de compras"
      >
        {/* Header */}
        <div className="p-6 border-b border-outline-variant/30 flex justify-between items-center">
          <h2 className="font-playfair text-lg font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">shopping_bag</span>
            Seu Carrinho ({count})
          </h2>
          <button
            className="p-2 text-on-surface-variant hover:bg-primary/10 rounded-full transition-colors"
            onClick={onClose}
            aria-label="Fechar carrinho"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Items */}
        <div className="flex-grow overflow-y-auto p-6 flex flex-col gap-4">
          {items.length === 0 ? (
            <div className="text-center text-on-surface-variant py-16">
              <span className="material-symbols-outlined text-5xl text-on-surface-variant/40 mb-2 block">
                remove_shopping_cart
              </span>
              <p className="text-sm">Seu carrinho está vazio.</p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.key}
                className="flex gap-3 bg-surface-container-lowest rounded-xl p-3 border border-outline-variant/20"
              >
                <div className="w-16 h-16 rounded-lg bg-surface-container flex items-center justify-center overflow-hidden flex-shrink-0">
                  {item.image ? (
                    <img
                      alt={item.name}
                      src={item.image}
                      className="max-w-full max-h-full object-contain mix-blend-multiply"
                    />
                  ) : (
                    <span className="material-symbols-outlined text-on-surface-variant/40">visibility</span>
                  )}
                </div>
                <div className="flex-grow min-w-0">
                  <p className="font-playfair text-sm font-bold text-on-surface truncate">{item.name}</p>
                  {item.color && (
                    <p className="text-[11px] text-on-surface-variant">{item.color}</p>
                  )}
                  <p className="text-sm text-primary font-bold mt-0.5">R$ {item.price}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center border border-outline-variant/40 rounded-full">
                      <button
                        className="w-7 h-7 flex items-center justify-center text-on-surface-variant hover:text-primary"
                        onClick={() => updateQty(item.key, item.quantity - 1)}
                        aria-label="Diminuir quantidade"
                      >
                        <span className="material-symbols-outlined text-[16px]">remove</span>
                      </button>
                      <span className="w-6 text-center text-xs font-bold">{item.quantity}</span>
                      <button
                        className="w-7 h-7 flex items-center justify-center text-on-surface-variant hover:text-primary"
                        onClick={() => updateQty(item.key, item.quantity + 1)}
                        aria-label="Aumentar quantidade"
                      >
                        <span className="material-symbols-outlined text-[16px]">add</span>
                      </button>
                    </div>
                    <button
                      className="text-on-surface-variant hover:text-error ml-auto"
                      onClick={() => removeItem(item.key)}
                      aria-label="Remover item"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-outline-variant/30">
            <div className="flex justify-between items-center mb-4">
              <span className="font-body text-sm text-on-surface-variant uppercase tracking-wider">
                Subtotal
              </span>
              <span className="font-playfair text-xl font-bold text-primary">
                R$ {subtotal.toFixed(2)}
              </span>
            </div>
            <p className="text-[11px] text-on-surface-variant mb-4">
              Frete calculado na próxima etapa.
            </p>
            <button
              onClick={goToCheckout}
              className="block w-full text-center bg-primary text-on-primary py-4 rounded-full font-body text-xs font-semibold tracking-widest uppercase hover:bg-primary/90 transition-colors"
            >
              Finalizar Compra
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
