"use client";
import Link from "next/link";
import { useState } from "react";
import { eur } from "@/lib/commerce";
import { sweatDiscount, SWEAT_OFFER } from "@/lib/offers";
import { useCart } from "./CartProvider";
import type { CartLine } from "@/lib/types";

export type BundleItem = { productId: string; slug: string; name: string; price: number; image: string; visual: React.ReactNode };

/** Pack de vrais produits du catalogue : prix = somme exacte, remise uniquement via l'offre sweat. */
export default function BundleCard({ title, text, items, offer }: { title: string; text: string; items: BundleItem[]; offer: boolean }) {
  const { add } = useCart();
  const [done, setDone] = useState(false);
  const lines: CartLine[] = items.map((x) => ({ productId: x.productId, slug: x.slug, name: x.name, price: x.price, color: "", size: "", qty: 1, image: x.image }));
  const sum = items.reduce((n, x) => n + x.price, 0);
  const off = offer ? sweatDiscount(lines) : 0;
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface-2/60">
      <ul className="grid gap-px bg-line" style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }} aria-label={`Contenu du ${title}`}>
        {items.map((x) => (
          <li key={x.slug} className="bg-surface"><Link href={`/product/${x.slug}`} aria-label={x.name} className="block aspect-[4/5]">{x.visual}</Link></li>
        ))}
      </ul>
      <div className="flex flex-1 flex-col p-5">
        {offer && <span className="mb-2 w-fit rounded-full bg-primary px-3 py-1 text-[11px] font-medium uppercase tracking-widest text-primary-fg">{SWEAT_OFFER.label}</span>}
        <h3 className="serif text-2xl leading-tight">{title}</h3>
        <p className="mt-1 text-sm text-muted">{text}</p>
        <p className="mt-2 text-xs text-muted">{items.map((x) => `${x.name} ${eur(x.price)}`).join(" · ")}</p>
        <p className="mt-3 flex items-baseline gap-2">
          <span className="text-xl font-medium">{eur(sum - off)}</span>
          {off > 0 && <><s className="text-sm text-muted">{eur(sum)}</s><span className="text-sm text-accent-strong">Vous économisez {eur(off)}</span></>}
        </p>
        <button className="btn btn-primary mt-4 w-full" onClick={() => { lines.forEach(add); setDone(true); setTimeout(() => setDone(false), 1800); }}>{done ? "Ajouté ✓" : "Ajouter le pack"}</button>
      </div>
    </article>
  );
}
