"use client";
import Link from "next/link";
import { CartLines, PromoCode, Totals } from "@/components/CartDrawer";
import { useCart } from "@/components/CartProvider";
import { eur } from "@/lib/commerce";

export default function CartPage() {
  const { lines, subtotal, hydrated } = useCart();
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <h1 className="section-title mb-4 text-4xl">Mon panier</h1>
      {!hydrated ? <div className="skeleton h-40 rounded-2xl" aria-busy /> : <CartLines />}
      {hydrated && lines.length === 0 && <Link href="/shop" className="btn btn-primary mx-auto mt-4 w-fit">Découvrir la boutique</Link>}
      {lines.length > 0 && (
        <div className="border-t border-line pt-2">
          <PromoCode /><Totals />
          <p className="mt-3 flex justify-between text-lg font-medium"><span>Total (hors livraison)</span><span>{eur(subtotal)}</span></p>
          <Link href="/checkout" className="btn btn-primary mt-5 w-full">Procéder au paiement</Link>
        </div>
      )}
    </div>
  );
}
