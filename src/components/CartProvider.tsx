"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { CartLine } from "@/lib/types";

type Ctx = {
  lines: CartLine[]; count: number; subtotal: number; open: boolean; hydrated: boolean;
  setOpen: (v: boolean) => void;
  add: (l: CartLine) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  favs: string[]; toggleFav: (id: string) => void;
};
const CartCtx = createContext<Ctx | null>(null);
export const lineKey = (l: Pick<CartLine, "productId" | "color" | "size">) => `${l.productId}|${l.color}|${l.size}`;

function load<T>(k: string, fallback: T): T {
  try { return JSON.parse(localStorage.getItem(k) ?? "") as T; } catch { return fallback; }
}
function save(k: string, v: unknown) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* stockage indisponible */ } }

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [favs, setFavs] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setLines(load("popi-cart", [])); setFavs(load("popi-favs", [])); setHydrated(true);
  }, []);
  useEffect(() => { if (hydrated) save("popi-cart", lines); }, [lines, hydrated]);
  useEffect(() => { if (hydrated) save("popi-favs", favs); }, [favs, hydrated]);

  const add = useCallback((l: CartLine) => {
    setLines((cur) => {
      const k = lineKey(l);
      const found = cur.find((x) => lineKey(x) === k);
      return found ? cur.map((x) => (lineKey(x) === k ? { ...x, qty: Math.min(10, x.qty + l.qty) } : x)) : [...cur, l];
    });
    setOpen(true);
  }, []);
  const setQty = useCallback((key: string, qty: number) =>
    setLines((cur) => cur.flatMap((x) => (lineKey(x) !== key ? [x] : qty <= 0 ? [] : [{ ...x, qty: Math.min(10, qty) }]))), []);
  const remove = useCallback((key: string) => setLines((cur) => cur.filter((x) => lineKey(x) !== key)), []);
  const toggleFav = useCallback((id: string) => setFavs((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id])), []);

  const value = useMemo<Ctx>(() => ({
    lines, open, hydrated, setOpen, add, setQty, remove, favs, toggleFav,
    count: lines.reduce((n, l) => n + l.qty, 0),
    subtotal: lines.reduce((n, l) => n + l.qty * l.price, 0),
  }), [lines, open, hydrated, add, setQty, remove, favs, toggleFav]);

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}
export function useCart() {
  const c = useContext(CartCtx);
  if (!c) throw new Error("useCart hors CartProvider");
  return c;
}
