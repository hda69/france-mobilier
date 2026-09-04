"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { CartItem } from "@/lib/types/commerce";
import { cartLineKey } from "@/lib/products/repository";

type CartContextValue = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (productId: string, variantId?: string | null) => void;
  setQuantity: (productId: string, quantity: number, variantId?: string | null) => void;
  clear: () => void;
  itemCount: number;
  subtotal: number;
  ready: boolean;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "francemobilier-cart-v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);
  const skipPersist = useRef(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartItem[];
        if (Array.isArray(parsed)) setItems(parsed);
      }
    } catch {
      /* ignore corrupt storage */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (skipPersist.current) {
      skipPersist.current = false;
      return;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((item: Omit<CartItem, "quantity">, quantity = 1) => {
    setItems((current) => {
      const key = cartLineKey(item.productId, item.variantId);
      const existing = current.find((row) => cartLineKey(row.productId, row.variantId) === key);
      if (existing) {
        return current.map((row) =>
          cartLineKey(row.productId, row.variantId) === key
            ? { ...row, quantity: row.quantity + quantity }
            : row,
        );
      }
      return [...current, { ...item, quantity }];
    });
  }, []);

  const removeItem = useCallback((productId: string, variantId?: string | null) => {
    const key = cartLineKey(productId, variantId);
    setItems((current) => current.filter((row) => cartLineKey(row.productId, row.variantId) !== key));
  }, []);

  const setQuantity = useCallback((productId: string, quantity: number, variantId?: string | null) => {
    const key = cartLineKey(productId, variantId);
    setItems((current) =>
      current
        .map((row) =>
          cartLineKey(row.productId, row.variantId) === key ? { ...row, quantity } : row,
        )
        .filter((row) => row.quantity > 0),
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(() => {
    const itemCount = items.reduce((sum, row) => sum + row.quantity, 0);
    const subtotal = items.reduce((sum, row) => sum + row.price * row.quantity, 0);
    return { items, addItem, removeItem, setQuantity, clear, itemCount, subtotal, ready };
  }, [items, addItem, removeItem, setQuantity, clear, ready]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
