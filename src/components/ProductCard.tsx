"use client";
import Link from "next/link";
import { useState } from "react";
import { Heart, ShoppingBag } from "lucide-react";
import { motion } from "motion/react";
import { eur } from "@/lib/commerce";
import type { Product } from "@/lib/types";
import { useCart } from "./CartProvider";

/** `visual` : <Visual> rendu côté serveur et passé en prop (lecture du système de fichiers côté serveur). */
export default function ProductCard({ product: p, visual, priority }: { product: Product; visual: React.ReactNode; priority?: boolean }) {
  const { favs, toggleFav, add } = useCart();
  const fav = favs.includes(p.id);
  const available = p.sizes.some((s) => s.stock > 0);
  const [pick, setPick] = useState(false);
  const [color, setColor] = useState(p.colors[0]?.name ?? "");

  const quickAdd = (size: string) => {
    add({ productId: p.id, slug: p.slug, name: p.name, price: p.price, color, size, qty: 1, image: p.images[0] ?? "" });
    setPick(false);
  };

  return (
    <article className="group overflow-hidden rounded-2xl border border-line bg-surface transition-shadow duration-300 hover:shadow-[var(--shadow)]">
      <div className="relative">
        <Link href={`/product/${p.slug}`} className="block" aria-label={`${p.name}, ${eur(p.price)}`}>
          <div className="aspect-[4/5] overflow-hidden transition-transform duration-500 group-hover:scale-[1.04]">{visual}</div>
        </Link>
        <motion.button whileTap={{ scale: 0.8 }} onClick={() => toggleFav(p.id)} aria-pressed={fav}
          aria-label={fav ? `Retirer ${p.name} des favoris` : `Ajouter ${p.name} aux favoris`}
          className="absolute right-2.5 top-2.5 flex h-10 w-10 items-center justify-center rounded-full bg-surface/90 text-fg shadow-sm">
          <Heart size={18} className={fav ? "fill-accent stroke-accent" : ""} />
        </motion.button>
        {!available && <span className="absolute left-2.5 top-2.5 rounded-full bg-surface px-3 py-1 text-xs font-medium">Rupture de stock</span>}
        {p.isNew && available && <span className="absolute left-2.5 top-2.5 rounded-full bg-accent px-3 py-1 text-xs font-medium text-[#06172b]">Nouveau</span>}
        {available && (
          <button onClick={() => setPick((v) => !v)} aria-expanded={pick} aria-label={`Ajout rapide : ${p.name}`}
            className="absolute bottom-2.5 right-2.5 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-fg shadow lg:translate-y-2 lg:opacity-0 lg:transition lg:group-hover:translate-y-0 lg:group-hover:opacity-100 lg:focus-visible:translate-y-0 lg:focus-visible:opacity-100">
            <ShoppingBag size={17} />
          </button>
        )}
        {pick && (
          <div className="absolute inset-x-0 bottom-0 bg-surface/95 p-3 backdrop-blur">
            <p className="mb-2 text-xs text-muted">Choisir une taille</p>
            <div className="flex flex-wrap gap-1.5">
              {p.sizes.map((s) => (
                <button key={s.label} disabled={s.stock === 0} onClick={() => quickAdd(s.label)}
                  className="min-h-9 rounded-md border border-line px-2.5 text-xs enabled:hover:border-accent-strong disabled:line-through disabled:opacity-40">{s.label}</button>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="p-3.5">
        <div className="mb-2 flex gap-1.5" role="group" aria-label="Couleurs">
          {p.colors.map((c) => (
            <button key={c.name} onClick={() => setColor(c.name)} aria-label={c.name} aria-pressed={color === c.name}
              className={`h-4 w-4 rounded-full border ${color === c.name ? "ring-2 ring-accent ring-offset-2 ring-offset-surface" : "border-line"}`} style={{ background: c.hex }} />
          ))}
        </div>
        <h3 className="serif text-xl leading-tight">{p.name}</h3>
        <p className="mt-0.5 text-[15px] font-medium">{eur(p.price)}</p>
      </div>
    </article>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-surface" aria-hidden>
      <div className="skeleton aspect-[4/5]" />
      <div className="space-y-2 p-3.5"><div className="skeleton h-3 w-16 rounded" /><div className="skeleton h-5 w-3/4 rounded" /><div className="skeleton h-4 w-1/3 rounded" /></div>
    </div>
  );
}
