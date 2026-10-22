"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Minus, Plus, Trash2, X } from "lucide-react";
import { eur } from "@/lib/commerce";
import { lineKey, useCart } from "./CartProvider";

export function CartLines() {
  const { lines, setQty, remove } = useCart();
  if (lines.length === 0) return <p className="py-10 text-center text-muted">Votre panier est vide.</p>;
  return (
    <ul className="divide-y divide-line">
      {lines.map((l) => {
        const k = lineKey(l);
        return (
          <li key={k} className="flex gap-4 py-4">
            <div className="flex h-20 w-16 shrink-0 items-center justify-center rounded-lg bg-surface-2 text-[9px] uppercase tracking-wider text-accent-strong">Visuel</div>
            <div className="min-w-0 flex-1 text-sm">
              <Link href={`/product/${l.slug}`} className="serif block truncate text-lg">{l.name}</Link>
              <p className="text-muted">{l.color} · {l.size}</p>
              <p className="mt-0.5 font-medium">{eur(l.price)}</p>
              <div className="mt-2 inline-flex items-center rounded-full border border-line">
                <button aria-label={`Diminuer la quantité de ${l.name}`} className="flex h-9 w-9 items-center justify-center" onClick={() => setQty(k, l.qty - 1)}><Minus size={14} /></button>
                <span className="w-6 text-center" aria-live="polite">{l.qty}</span>
                <button aria-label={`Augmenter la quantité de ${l.name}`} className="flex h-9 w-9 items-center justify-center" onClick={() => setQty(k, l.qty + 1)}><Plus size={14} /></button>
              </div>
            </div>
            <button aria-label={`Supprimer ${l.name}`} className="flex h-10 w-10 items-center justify-center text-muted hover:text-fg" onClick={() => remove(k)}><Trash2 size={17} /></button>
          </li>
        );
      })}
    </ul>
  );
}

export function PromoCode() {
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState("");
  return (
    <form onSubmit={(e) => { e.preventDefault(); setMsg(code ? "La validation des codes sera active avec le moteur e-commerce." : ""); }} className="mt-4">
      <label htmlFor="promo" className="sr-only">Code promo</label>
      <div className="flex gap-2">
        <input id="promo" value={code} onChange={(e) => setCode(e.target.value)} placeholder="Code promo"
          className="h-11 min-w-0 flex-1 rounded-lg border border-line bg-surface px-4 text-sm outline-none focus:border-accent-strong" />
        <button className="btn btn-primary !min-h-11 !px-5 text-sm">Appliquer</button>
      </div>
      {msg && <p role="status" className="mt-2 text-xs text-muted">{msg}</p>}
    </form>
  );
}

export function Totals() {
  const { subtotal } = useCart();
  return (
    <dl className="mt-4 space-y-1.5 text-sm">
      <div className="flex justify-between"><dt className="text-muted">Sous-total</dt><dd>{eur(subtotal)}</dd></div>
      <div className="flex justify-between"><dt className="text-muted">Livraison</dt><dd className="text-muted">Calculée au paiement</dd></div>
    </dl>
  );
}

export default function CartDrawer() {
  const { open, setOpen, lines } = useCart();
  const reduce = useReducedMotion();
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60]">
          <motion.div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
          <motion.aside role="dialog" aria-modal="true" aria-label="Panier"
            className="pb-safe absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-bg p-6 shadow-2xl"
            initial={{ x: reduce ? 0 : "100%" }} animate={{ x: 0 }} exit={{ x: reduce ? 0 : "100%" }}
            transition={{ type: "tween", duration: reduce ? 0 : 0.3, ease: [0.2, 0.7, 0.2, 1] }}>
            <div className="mb-2 flex items-center justify-between">
              <h2 className="serif text-3xl">Mon panier</h2>
              <button ref={closeRef} aria-label="Fermer le panier" className="flex h-11 w-11 items-center justify-center" onClick={() => setOpen(false)}><X /></button>
            </div>
            <div className="flex-1 overflow-y-auto"><CartLines /></div>
            {lines.length > 0 && (
              <div className="border-t border-line pt-2">
                <PromoCode /><Totals />
                <Link href="/checkout" onClick={() => setOpen(false)} className="btn btn-primary mt-5 w-full">Procéder au paiement</Link>
                <Link href="/panier" onClick={() => setOpen(false)} className="mt-3 block text-center text-sm text-muted underline">Voir le panier</Link>
              </div>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
