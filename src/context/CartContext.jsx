import { createContext, useContext, useEffect, useMemo, useReducer } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "zarya_cart_v1";

// Chave de linha: mesmo produto em cores diferentes vira itens distintos.
function lineKey(item) {
  return `${item.id}__${item.color ?? ""}`;
}

function loadInitial() {
  if (typeof window === "undefined") return { items: [] };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { items: [] };
    const parsed = JSON.parse(raw);
    return { items: Array.isArray(parsed.items) ? parsed.items : [] };
  } catch {
    return { items: [] };
  }
}

function clampQty(qty, stock) {
  const max = Number.isFinite(stock) && stock > 0 ? stock : 99;
  return Math.max(1, Math.min(qty, max));
}

function reducer(state, action) {
  switch (action.type) {
    case "ADD": {
      const incoming = action.item;
      const key = lineKey(incoming);
      const existing = state.items.find((i) => i.key === key);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.key === key
              ? { ...i, quantity: clampQty(i.quantity + (incoming.quantity || 1), i.stock) }
              : i
          )
        };
      }
      return {
        items: [
          ...state.items,
          {
            key,
            id: incoming.id,
            slug: incoming.slug,
            name: incoming.name,
            price: Number(incoming.price) || 0,
            image: incoming.image || "",
            color: incoming.color ?? null,
            stock: Number.isFinite(incoming.stock) ? incoming.stock : 99,
            quantity: clampQty(incoming.quantity || 1, incoming.stock)
          }
        ]
      };
    }
    case "REMOVE":
      return { items: state.items.filter((i) => i.key !== action.key) };
    case "SET_QTY":
      return {
        items: state.items.map((i) =>
          i.key === action.key ? { ...i, quantity: clampQty(action.quantity, i.stock) } : i
        )
      };
    case "CLEAR":
      return { items: [] };
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadInitial);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignora indisponibilidade de localStorage */
    }
  }, [state]);

  const value = useMemo(() => {
    const subtotal = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const count = state.items.reduce((sum, i) => sum + i.quantity, 0);
    return {
      items: state.items,
      subtotal,
      count,
      addItem: (item) => dispatch({ type: "ADD", item }),
      removeItem: (key) => dispatch({ type: "REMOVE", key }),
      updateQty: (key, quantity) => dispatch({ type: "SET_QTY", key, quantity }),
      clear: () => dispatch({ type: "CLEAR" })
    };
  }, [state]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    // Fallback seguro caso algum componente seja usado fora do provider.
    return {
      items: [],
      subtotal: 0,
      count: 0,
      addItem: () => {},
      removeItem: () => {},
      updateQty: () => {},
      clear: () => {}
    };
  }
  return ctx;
}
