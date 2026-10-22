"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Heart, Minus, Plus } from "lucide-react";
import { eur } from "@/lib/commerce";
import type { Product } from "@/lib/types";
import { useCart } from "./CartProvider";

export default function ProductPurchase({ product: p, gallery }: { product: Product; gallery: React.ReactNode[] }) {
  const { add, favs, toggleFav } = useCart();
  const router = useRouter();
  const [img, setImg] = useState(0);
  const [color, setColor] = useState(p.colors[0]?.name ?? "");
  const [size, setSize] = useState("");
  const [qty, setQty] = useState(1);
  const [err, setErr] = useState("");
  const [added, setAdded] = useState(false);
  const fav = favs.includes(p.id);
  const stock = p.sizes.find((s) => s.label === size)?.stock ?? 0;
  const soldOut = !p.sizes.some((s) => s.stock > 0);

  const submit = (then: "cart" | "buy") => {
    if (!size) { setErr("Veuillez choisir une taille."); return; }
    if (stock < 1) { setErr("Cette taille n'est plus disponible."); return; }
    setErr("");
    add({ productId: p.id, slug: p.slug, name: p.name, price: p.price, color, size, qty: Math.min(qty, stock), image: p.images[0] ?? "" });
    if (then === "buy") router.push("/checkout"); else { setAdded(true); setTimeout(() => setAdded(false), 1800); }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
      <div>
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-line">
          {gallery[img]}
          <button onClick={() => toggleFav(p.id)} aria-pressed={fav} aria-label={fav ? "Retirer des favoris" : "Ajouter aux favoris"}
            className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full bg-surface/90 shadow"><Heart className={fav ? "fill-accent stroke-accent" : ""} /></button>
        </div>
        {gallery.length > 1 && (
          <ul className="mt-3 flex gap-2">
            {gallery.map((g, i) => (
              <li key={i}><button onClick={() => setImg(i)} aria-label={`Photo ${i + 1}`} aria-current={i === img}
                className={`block h-20 w-16 overflow-hidden rounded-lg border-2 [&_span]:hidden ${i === img ? "border-accent-strong" : "border-line"}`}>{g}</button></li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <h1 className="section-title text-4xl sm:text-5xl">{p.name}</h1>
        <p className="mt-2 text-2xl">{eur(p.price)}</p>

        <fieldset className="mt-6"><legend className="mb-2 text-sm font-medium">Couleur : <span className="font-normal text-muted">{color}</span></legend>
          <div className="flex gap-3">{p.colors.map((c) => (
            <button key={c.name} onClick={() => setColor(c.name)} aria-label={c.name} aria-pressed={color === c.name}
              className={`h-9 w-9 rounded-full border ${color === c.name ? "ring-2 ring-accent-strong ring-offset-2 ring-offset-bg" : "border-line"}`} style={{ background: c.hex }} />
          ))}</div></fieldset>

        <fieldset className="mt-6"><legend className="mb-2 text-sm font-medium">Taille</legend>
          <div className="flex flex-wrap gap-2">{p.sizes.map((s) => (
            <button key={s.label} disabled={s.stock === 0} aria-pressed={size === s.label} onClick={() => { setSize(s.label); setErr(""); setQty(1); }}
              className={`min-h-11 min-w-16 rounded-lg border px-3 text-sm disabled:cursor-not-allowed disabled:line-through disabled:opacity-40 ${size === s.label ? "border-primary bg-primary text-primary-fg" : "border-line"}`}>{s.label}</button>
          ))}</div>
          {size && stock > 0 && stock <= 3 && <p className="mt-2 text-xs text-accent-strong">Plus que {stock} en stock</p>}
          <details className="mt-3 text-sm"><summary className="cursor-pointer underline">Guide des tailles</summary>
            <p className="mt-2 text-muted">Guide des tailles (mesures en cm) à fournir par POPI KIDS.</p></details>
        </fieldset>

        <div className="mt-6 inline-flex items-center rounded-full border border-line">
          <button aria-label="Diminuer la quantité" className="flex h-11 w-11 items-center justify-center" onClick={() => setQty((q) => Math.max(1, q - 1))}><Minus size={16} /></button>
          <span className="w-8 text-center" aria-live="polite">{qty}</span>
          <button aria-label="Augmenter la quantité" className="flex h-11 w-11 items-center justify-center" onClick={() => setQty((q) => Math.min(stock || 10, q + 1))}><Plus size={16} /></button>
        </div>

        {err && <p role="alert" className="mt-3 text-sm text-[#b3261e]">{err}</p>}
        <div className="mt-5 flex flex-col gap-3">
          <button className="btn btn-primary" disabled={soldOut} onClick={() => submit("cart")}>{soldOut ? "Rupture de stock" : added ? "Ajouté ✓" : "Ajouter au panier"}</button>
          <button className="btn btn-gold" disabled={soldOut} onClick={() => submit("buy")}>Acheter maintenant</button>
        </div>

        <div className="mt-8 space-y-4 border-t border-line pt-6 text-sm">
          <section><h2 className="serif mb-1 text-xl">Description</h2><p className="text-muted">{p.description}</p></section>
          {p.composition && <section><h2 className="serif mb-1 text-xl">Composition et entretien</h2><p className="text-muted">{p.composition}</p></section>}
          <section><h2 className="serif mb-1 text-xl">Livraison et retours</h2>
            <p className="text-muted">Livraison sous 3 à 7 jours ouvrés. Retours sous 30 jours, article non porté, étiquettes intactes (à valider avec les CGV).</p></section>
        </div>
      </div>
    </div>
  );
}
