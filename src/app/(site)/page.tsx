import Link from "next/link";
import { ArrowRight, Leaf, Package, ShieldCheck, Truck } from "lucide-react";
import Hero from "@/components/Hero";
import Visual from "@/components/Visual";
import ProductGrid from "@/components/ProductGrid";
import { CATEGORIES, getBestSellers, getProducts } from "@/lib/commerce";
import { REASSURANCE } from "@/lib/site";

const ICONS = { truck: Truck, leaf: Leaf, shield: ShieldCheck, package: Package };

export default async function Home() {
  const [best, news] = await Promise.all([getBestSellers(), getProducts({ sort: "nouveautes" })]);
  return (
    <>
      <Hero slides={["hero-1", "hero-2", "hero-3"].map((k, i) => (
        <Visual key={k} assetKey={k} alt="Enfants portant des vêtements POPI KIDS" className="h-full w-full" priority={i === 0} sizes="100vw" />
      ))} />

      {/* Réassurance – libellés à valider avec les conditions réelles */}
      <section aria-label="Nos engagements" className="border-b border-line bg-surface-2/50">
        <ul className="mx-auto grid max-w-[1400px] grid-cols-2 gap-y-6 px-4 py-7 lg:grid-cols-4 lg:divide-x lg:divide-line">
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

      <section className="mx-auto max-w-[1400px] px-4 pt-14 sm:px-6">
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 className="section-title text-3xl sm:text-4xl">Nos meilleures ventes</h2>
          <Link href="/shop?sort=populaires" className="btn btn-secondary !min-h-11 shrink-0 !px-5 text-sm">Voir toute la boutique <ArrowRight size={16} /></Link>
        </div>
        <ProductGrid products={best.slice(0, 5)} cols="lg:grid-cols-5" />
      </section>

      <section className="mx-auto mt-12 grid max-w-[1400px] gap-4 px-4 sm:px-6 md:grid-cols-2">
        {[
          { key: "banner-new", title: "NOUVELLE COLLECTION", cta: "Découvrir", href: "/shop?sort=nouveautes", gold: true },
          { key: "banner-looks", title: "LOOKS DE SAISON", cta: "Explorer", href: "/shop", gold: false },
        ].map((b) => (
          <Link key={b.key} href={b.href} className="group relative block aspect-[16/9] overflow-hidden rounded-2xl border border-line md:aspect-[16/8]">
            <Visual assetKey={b.key} className="absolute inset-0 transition-transform duration-700 group-hover:scale-105" sizes="(min-width:768px) 50vw, 100vw" />
            <div className="absolute inset-0 flex flex-col items-start justify-center gap-4 p-6 sm:p-10" style={{ background: "var(--overlay)" }}>
              <h2 className="serif max-w-[10ch] text-3xl font-medium leading-[1.05] sm:text-5xl">{b.title}</h2>
              <span className={`btn ${b.gold ? "btn-gold" : "btn-secondary"} !min-h-11 text-sm`}>{b.cta} <ArrowRight size={16} /></span>
            </div>
          </Link>
        ))}
      </section>

      <section className="mx-auto max-w-[1400px] px-4 pt-14 sm:px-6">
        <h2 className="section-title mb-6 text-2xl sm:text-3xl">Acheter par catégorie</h2>
        <ul className="hide-scroll -mx-4 flex gap-5 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-4 sm:px-0 lg:grid-cols-8">
          {CATEGORIES.map((c) => (
            <li key={c.slug} className="w-[96px] shrink-0 sm:w-auto">
              <Link href={`/collections/${c.slug}`} className="group flex flex-col items-center gap-3 text-center text-sm">
                <span className="block w-full overflow-hidden rounded-full border border-line p-0 transition group-hover:border-accent-strong">
                  <Visual assetKey={c.image} alt="" round className="aspect-square w-full transition-transform duration-500 group-hover:scale-105" sizes="120px" />
                </span>
                {c.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-[1400px] px-4 pt-16 sm:px-6">
        <h2 className="section-title mb-6 text-3xl sm:text-4xl">Nouveautés</h2>
        <ProductGrid products={news.filter((p) => p.isNew)} cols="lg:grid-cols-4"
          empty={<p className="rounded-2xl border border-dashed border-line py-10 text-center text-muted">Les nouveautés apparaîtront ici.</p>} />
      </section>

      <section id="engagements" className="mx-auto mt-16 max-w-[1400px] scroll-mt-24 px-4 sm:px-6">
        <div className="rounded-3xl bg-surface-2 px-6 py-12 text-center sm:px-16">
          <h2 className="section-title text-3xl sm:text-4xl">Nos engagements</h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted">Texte d&apos;engagements de la marque à fournir par POPI KIDS (qualité, matières, fabrication).</p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-[1400px] px-4 sm:px-6" aria-label="Avis clients">
        <h2 className="section-title mb-4 text-3xl sm:text-4xl">Avis clients</h2>
        <p className="rounded-2xl border border-dashed border-line py-10 text-center text-muted">
          Les avis authentiques de clients seront affichés ici dès qu&apos;ils seront collectés.
        </p>
      </section>
    </>
  );
}
