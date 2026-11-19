import type { Metadata } from "next";
import Link from "next/link";
import Visual from "@/components/Visual";
import GiftAmounts from "./GiftAmounts";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Carte cadeau",
  description: "La carte cadeau POPI KIDS, pour les petits aventuriers.",
  alternates: { canonical: "/carte-cadeau" },
};

/** Visuels fournis. Montants = ceux du produit "Carte cadeau" du site actuel. Validité et achat en ligne : non définis → rien d'inventé. */
const AMOUNTS = [25, 50, 75, 100, 150, 200];

export default function GiftCard() {
  return (
    <div className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6">
      <h1 className="section-title text-4xl sm:text-5xl">Carte cadeau</h1>
      <p className="mt-3 max-w-xl text-muted">Pour les petits aventuriers.</p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Visual assetKey="carte-cadeau-1" alt="Carte cadeau POPI KIDS, recto, avec son enveloppe" className="aspect-square w-full rounded-2xl border border-line" sizes="(min-width:768px) 50vw, 100vw" priority />
        <Visual assetKey="carte-cadeau-2" alt="Carte cadeau POPI KIDS, verso : à, de, montant" className="aspect-square w-full rounded-2xl border border-line" sizes="(min-width:768px) 50vw, 100vw" />
      </div>
      <GiftAmounts amounts={AMOUNTS} email={SITE.contactEmail} />
      <p className="mt-6 max-w-xl text-sm text-muted">Une question ? Écrivez-nous via la page <Link className="underline" href="/contact-us">Contact</Link>.</p>
    </div>
  );
}
