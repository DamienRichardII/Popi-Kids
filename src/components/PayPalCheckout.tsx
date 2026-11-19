"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CartLines, Totals } from "./CartDrawer";
import { useCart } from "./CartProvider";
import { eur } from "@/lib/commerce";

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global { interface Window { paypal?: any } }

/** Paiement PayPal + « Payer en 4X » (Pay Later). Le montant est recalculé côté serveur : le navigateur n'envoie que les articles et choix. */
export default function PayPalCheckout({ clientId, env }: { clientId: string | null; env: "sandbox" | "live" }) {
  const { lines, total, hydrated, clear } = useCart();
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState<{ ref?: string } | null>(null);
  const payRef = useRef<HTMLDivElement>(null);
  const laterRef = useRef<HTMLDivElement>(null);
  const msgRef = useRef<HTMLDivElement>(null);
  const linesRef = useRef(lines);
  linesRef.current = lines;
  const payload = () => linesRef.current.map((l) => ({ slug: l.slug, qty: l.qty, color: l.color, size: l.size, custom: l.custom }));

  useEffect(() => {
    if (!clientId || done) return;
    const id = "paypal-sdk";
    const start = () => setReady(true);
    if (window.paypal) { start(); return; }
    let s = document.getElementById(id) as HTMLScriptElement | null;
    if (!s) {
      s = document.createElement("script");
      s.id = id;
      s.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(clientId)}&currency=EUR&locale=fr_FR&intent=capture&components=buttons,messages&enable-funding=paylater`;
      s.async = true;
      s.onerror = () => setError("Impossible de charger PayPal. Réessayez dans un instant.");
      document.body.appendChild(s);
    }
    s.addEventListener("load", start);
    return () => s?.removeEventListener("load", start);
  }, [clientId, done]);

  useEffect(() => {
    if (!ready || !hydrated || lines.length === 0 || done || !window.paypal) return;
    const pp = window.paypal;
    const make = (fundingSource: any, el: HTMLDivElement | null) => {
      if (!el) return;
      el.innerHTML = "";
      const b = pp.Buttons({
        fundingSource, style: { layout: "vertical", shape: "pill", label: "pay", height: 48 },
        createOrder: async () => {
          setError("");
          const r = await fetch("/api/paypal/create-order", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ lines: payload() }) });
          const d = await r.json();
          if (!r.ok) throw new Error(d.error ?? "Erreur de paiement.");
          return d.id;
        },
        onApprove: async (data: { orderID: string }) => {
          const r = await fetch("/api/paypal/capture-order", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ orderID: data.orderID }) });
          const d = await r.json();
          if (!r.ok || d.status !== "COMPLETED") { setError(d.error ?? "Le paiement n'a pas pu être finalisé."); return; }
          setDone({ ref: d.reference }); clear();
        },
        onError: (e: Error) => setError(e?.message || "Une erreur est survenue avec PayPal."),
      });
      if (b.isEligible()) b.render(el);
    };
    make(pp.FUNDING.PAYPAL, payRef.current);
    make(pp.FUNDING.PAYLATER, laterRef.current);
    if (msgRef.current) { msgRef.current.innerHTML = ""; pp.Messages({ amount: total / 100, style: { layout: "text", text: { size: 14 } } }).render(msgRef.current); }
  }, [ready, hydrated, lines, total, done, clear]);

  if (done) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <h1 className="section-title text-4xl">Merci pour votre commande</h1>
        <p className="mt-4 text-muted">Votre paiement a bien été reçu.{done.ref ? ` Référence : ${done.ref}.` : ""} PayPal vous envoie un reçu par e-mail.</p>
        <Link href="/shop" className="btn btn-primary mx-auto mt-8 w-fit">Continuer mes achats</Link>
      </div>
    );
  }
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <h1 className="section-title mb-4 text-4xl">Paiement</h1>
      {!hydrated ? <div className="skeleton h-40 rounded-2xl" aria-busy /> : lines.length === 0 ? (
        <><p className="text-muted">Votre panier est vide.</p><Link href="/shop" className="btn btn-primary mt-4 w-fit">Découvrir la boutique</Link></>
      ) : (
        <>
          <CartLines />
          <div className="border-t border-line pt-2"><Totals />
            <p className="mt-3 flex justify-between text-lg font-medium"><span>Total (hors livraison)</span><span>{eur(total)}</span></p></div>
          {!clientId ? (
            <p role="status" className="mt-6 rounded-lg border border-dashed border-line p-4 text-sm text-muted">Le paiement en ligne est en cours de configuration. Aucune commande ne peut être passée pour l&apos;instant.</p>
          ) : (
            <section aria-label="Paiement" className="mt-6">
              {env === "sandbox" && <p className="mb-3 rounded-lg bg-surface-2 p-3 text-xs text-muted">Mode test : aucun vrai paiement n&apos;est effectué.</p>}
              <div ref={msgRef} className="mb-3 text-sm" />
              <div ref={payRef} />
              <div ref={laterRef} className="mt-3" />
              {error && <p role="alert" className="mt-3 text-sm text-[#b3261e]">{error}</p>}
              <p className="mt-3 text-xs text-muted">Le paiement est sécurisé par PayPal. Les frais de livraison, s&apos;il y en a, sont indiqués avant validation.</p>
            </section>
          )}
        </>
      )}
    </div>
  );
}
