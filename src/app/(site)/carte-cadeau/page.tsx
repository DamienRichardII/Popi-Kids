import type { Metadata } from "next";
import Link from "next/link";
import Visual from "@/components/Visual";
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
      <section className="mt-8 max-w-xl" aria-label="Montants disponibles">
        <h2 className="serif text-2xl">Montants</h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {AMOUNTS.map((a) => <li key={a} className="rounded-full border border-line px-5 py-2 text-sm">{a} €</li>)}
        </ul>
      </section>
      <div className="mt-8 max-w-xl rounded-2xl border border-dashed border-line p-6 text-sm text-muted">
        L&apos;achat en ligne et les conditions d&apos;utilisation seront précisés prochainement. En attendant, écrivez-nous à{" "}
        <a className="underline" href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a> ou via la page{" "}
        <Link className="underline" href="/contact-us">Contact</Link>.
      </div>
    </div>
  );
}
