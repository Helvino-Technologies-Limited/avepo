"use client";

import { createContext, useContext, useSyncExternalStore, type ReactNode } from "react";

export type CartItem = {
  productId: string;
  name: string;
  price: number | null;
  image: string | null;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
  totalCount: number;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "avepo.cart";
// localStorage's own "storage" event only fires in *other* tabs, so
// mutations dispatch this custom event to notify subscribers in this tab.
const CHANGE_EVENT = "avepo-cart-changed";

// useSyncExternalStore requires getSnapshot to return the same reference
// when the underlying value hasn't changed, so we cache the parsed array
// keyed on the raw string rather than re-parsing (and re-allocating) on
// every call.
let cachedRaw: string | null = null;
let cachedItems: CartItem[] = [];

function readItems(): CartItem[] {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(STORAGE_KEY);
  } catch {
    // ignore inaccessible local storage
  }
  if (raw === cachedRaw) return cachedItems;
  cachedRaw = raw;
  try {
    cachedItems = raw ? JSON.parse(raw) : [];
  } catch {
    cachedItems = [];
  }
  return cachedItems;
}

function writeItems(items: CartItem[]) {
  cachedRaw = JSON.stringify(items);
  cachedItems = items;
  localStorage.setItem(STORAGE_KEY, cachedRaw);
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(CHANGE_EVENT, callback);
  };
}

function getServerSnapshot(): CartItem[] {
  return [];
}

export function CartProvider({ children }: { children: ReactNode }) {
  const items = useSyncExternalStore(subscribe, readItems, getServerSnapshot);

  function addItem(item: Omit<CartItem, "quantity">, quantity = 1) {
    const current = readItems();
    const existing = current.find((i) => i.productId === item.productId);
    const next = existing
      ? current.map((i) =>
          i.productId === item.productId ? { ...i, quantity: i.quantity + quantity } : i
        )
      : [...current, { ...item, quantity }];
    writeItems(next);
  }

  function updateQuantity(productId: string, quantity: number) {
    const current = readItems();
    const next =
      quantity <= 0
        ? current.filter((i) => i.productId !== productId)
        : current.map((i) => (i.productId === productId ? { ...i, quantity } : i));
    writeItems(next);
  }

  function removeItem(productId: string) {
    writeItems(readItems().filter((i) => i.productId !== productId));
  }

  function clear() {
    writeItems([]);
  }

  const totalCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, updateQuantity, removeItem, clear, totalCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
