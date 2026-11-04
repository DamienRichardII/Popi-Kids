import Link from "next/link";
import { ArrowRight, Droplets, Leaf, Lock, Mail, Package, ShieldCheck, Truck, Users } from "lucide-react";
import Hero from "@/components/Hero";
import Visual from "@/components/Visual";
import ProductGrid from "@/components/ProductGrid";
import { CATEGORIES, getBestSellers } from "@/lib/commerce";
import { FAQ, REASSURANCE, SITE, TRUST } from "@/lib/site";

const ICONS = { truck: Truck, leaf: Leaf, shield: ShieldCheck, package: Package, droplet: Droplets, users: Users, lock: Lock };

/** Offres de saison : aucune promotion inventée, uniquement des accès vers les rayons existants. */
const SEASON = [
  { title: "Idées cadeaux de Noël", text: "Jeux, lunch boxes, gourdes et sacs à offrir.", image: "prod-salento-1", href: "/collections/jeux", cta: "Découvrir" },
  { title: "Looks d'hiver", text: "Sweats, vestes et tenues pour affronter le froid.", image: "prod-urban-1", href: "/collections/vetements", cta: "Voir les vêtements" },
  { title: "Personnalisez", text: "Ajoutez un prénom, une phrase ou un logo sur les t-shirts, polos et sweat-shirts.", image: "prod-jamaica-1", href: "/collections/vetements", cta: "Personnaliser" },
] as const;

export default async function Home() {
  const best = await getBestSellers();
  const cats = [...CATEGORIES.map((c) => ({ slug: c.slug, name: c.name, image: c.image, href: `/collections/${c.slug}` })),
    { slug: "cadeaux", name: "Cartes cadeaux", image: "cat-cadeaux", href: "/carte-cadeau" }];
  return (
    <>
      <Hero slides={["hero-1", "hero-2", "hero-3"].map((k, i) => (
        <Visual key={k} assetKey={k} alt="Enfants portant des vêtements POPI KIDS" className="h-full w-full" priority={i === 0} sizes="100vw" position="50% 18%" />
      ))} />

      {/* Atouts – relevés sur l'accueil actuel (seuil de livraison à valider) */}
      <section aria-label="Nos atouts" className="border-b border-line bg-surface-2/50">
        <ul className="mx-auto grid max-w-[1400px] grid-cols-2 gap-y-6 px-4 py-7 lg:grid-cols-5 lg:divide-x lg:divide-line">
          {REASSURANCE.map((r) => {
            const Icon = ICONS[r.icon];
            return (
              <li key={r.title} className="flex flex-col items-center gap-2 px-2 text-center">
                <Icon strokeWidth={1.4} size={34} aria-hidden />
                <span className="text-[11px] font-medium uppercase tracking-[.18em] sm:text-xs">{r.title}</span>
                <span className="text-xs text-muted sm:text-sm">{r.text}</span>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="mx-auto max-w-[1400px] px-4 pt-14 sm:px-6" aria-label="Offres de saison">
        <h2 className="section-title mb-6 text-center text-3xl sm:text-4xl">Noël &amp; hiver</h2>
        <ul className="grid gap-4 md:grid-cols-3">
          {SEASON.map((o) => (
            <li key={o.title}>
              <Link href={o.href} className="group flex h-full items-center gap-4 overflow-hidden rounded-2xl border border-line bg-surface-2/60 p-4 transition hover:border-accent-strong md:flex-col md:items-stretch md:p-5">
                <Visual assetKey={o.image} alt="" className="aspect-[4/5] w-32 shrink-0 rounded-xl md:w-full" sizes="(min-width:768px) 33vw, 128px" />
                <div className="md:pt-2">
                  <h3 className="serif text-2xl leading-tight">{o.title}</h3>
                  <p className="mt-1 text-sm text-muted">{o.text}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium underline-offset-4 group-hover:underline">{o.cta} <ArrowRight size={15} /></span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-[1400px] px-4 pt-14 sm:px-6">
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 className="section-title text-3xl sm:text-4xl">Notre sélection</h2>
          <Link href="/shop?sort=populaires" className="btn btn-secondary !min-h-11 shrink-0 !px-5 text-sm">Voir toute la boutique <ArrowRight size={16} /></Link>
        </div>
        <ProductGrid products={best.slice(0, 5)} cols="lg:grid-cols-5" />
      </section>

      <section className="mx-auto max-w-[1400px] px-4 pt-14 sm:px-6">
        <h2 className="section-title mb-6 text-2xl sm:text-3xl">Acheter par catégorie</h2>
        <ul className="hide-scroll -mx-4 flex gap-5 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:px-0 lg:grid-cols-6">
          {cats.map((c) => (
            <li key={c.slug} className="w-[110px] shrink-0 sm:w-auto">
              <Link href={c.href} className="group flex flex-col items-center gap-3 text-center text-sm">
                <span className="block w-full overflow-hidden rounded-full border border-line transition group-hover:border-accent-strong">
                  <Visual assetKey={c.image} alt="" round className="aspect-square w-full transition-transform duration-500 group-hover:scale-105" sizes="200px" />
                </span>
                {c.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto mt-16 max-w-[1400px] px-4 sm:px-6" aria-label="Commande en gros">
        <div className="rounded-3xl border border-line px-6 py-10 text-center sm:px-16">
          <h2 className="section-title text-3xl sm:text-4xl">Commande en gros</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted">Envoyer un e-mail concernant les commandes en gros / aux clients B2B.</p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a href={`mailto:${SITE.contactEmail}?subject=Commande%20en%20gros`} className="btn btn-primary w-fit"><Mail size={16} /> {SITE.contactEmail}</a>
            <Link href="/contact-us" className="btn btn-secondary w-fit">Contactez-nous</Link>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-16 grid max-w-[1400px] items-center gap-8 px-4 sm:px-6 md:grid-cols-2">
        <Visual assetKey="carte-cadeau-1" alt="Carte cadeau POPI KIDS et son enveloppe" className="aspect-square w-full rounded-2xl border border-line" sizes="(min-width:768px) 50vw, 100vw" />
        <div>
          <h2 className="section-title text-3xl sm:text-4xl">La carte cadeau POPI KIDS</h2>
          <p className="mt-3 max-w-md text-muted">Pour les petits aventuriers : une idée de cadeau élégante, à offrir sans se tromper de taille.</p>
          <Link href="/carte-cadeau" className="btn btn-primary mt-6 w-fit">Découvrir <ArrowRight size={16} /></Link>
        </div>
      </section>

      <section id="engagements" className="mx-auto mt-16 max-w-[1400px] scroll-mt-24 px-4 sm:px-6">
        <div className="rounded-3xl bg-surface-2 px-6 py-12 text-center sm:px-16">
          <p className="text-xs font-medium uppercase tracking-[.25em] text-accent-strong">Notre engagement</p>
          <h2 className="section-title mt-3 text-3xl sm:text-4xl">Prendre soin de ce qui compte le plus.</h2>
          <p className="mx-auto mt-5 max-w-2xl text-muted">Chez POPI KIDS, nous créons des essentiels de qualité pour accompagner les enfants dans toutes leurs aventures du quotidien : école, sport, sorties et loisirs.</p>
          <p className="mx-auto mt-3 max-w-2xl text-muted">Des matières confortables et durables, des designs intemporels et des prix justes, pour simplifier la vie des parents et faire grandir les enfants en toute confiance.</p>
        </div>
      </section>

      <section aria-label="Nos garanties" className="mx-auto max-w-[1400px] px-4 pt-12 sm:px-6">
        <ul className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {TRUST.map((t) => {
            const Icon = ICONS[t.icon];
            return (
              <li key={t.title} className="flex flex-col items-center gap-2 rounded-2xl border border-line px-3 py-6 text-center text-sm">
                <Icon strokeWidth={1.4} size={30} aria-hidden /> {t.title}
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-label="Foire aux questions" className="mx-auto my-16 max-w-3xl px-4 sm:px-6">
        <h2 className="section-title mb-6 text-center text-3xl sm:text-4xl">Foire aux questions</h2>
        <div className="divide-y divide-line rounded-2xl border border-line">
          {FAQ.map((f) => (
            <details key={f.q} className="group px-5 py-4">
              <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 font-medium">{f.q}<span aria-hidden className="text-xl transition group-open:rotate-45">+</span></summary>
              <p className="mt-2 text-sm text-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
