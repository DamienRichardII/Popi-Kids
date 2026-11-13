import Link from "next/link";
import { ArrowRight, Droplets, Leaf, Lock, Mail, Package, ShieldCheck, Truck, Users } from "lucide-react";
import Hero, { type HeroSlide } from "@/components/Hero";
import BundleCard from "@/components/BundleCard";
import Visual from "@/components/Visual";
import ProductGrid from "@/components/ProductGrid";
import { CATEGORIES, eur, getBestSellers, getProduct } from "@/lib/commerce";
import { BUNDLES, SWEAT_OFFER } from "@/lib/offers";
import { FAQ, REASSURANCE, SITE, TRUST } from "@/lib/site";

const ICONS = { truck: Truck, leaf: Leaf, shield: ShieldCheck, package: Package, droplet: Droplets, users: Users, lock: Lock };

/** Nos essentiels de saison : produits réels du catalogue, photos et couleurs de la maquette client. */
const ESSENTIALS = [
  { slug: "urban", label: "Sweat", color: "Marine", image: "ess-urban" },
  { slug: "clasica", label: "Sweat", color: "Angora naturel", image: "ess-clasica" },
  { slug: "nepal", label: "Parka", color: "Vert militaire foncé", image: "ess-nepal" },
  { slug: "norway", label: "Doudoune", color: "Marine", image: "ess-norway" },
] as const;

/** La magie des fêtes : accès vers les rayons existants, aucune promotion inventée. */
const FETES = [
  { title: "Personnalisés", text: "Un prénom, une phrase ou un logo sur les sweat-shirts.", image: "fete-1", href: "/collections/sweats-gilets", cta: "Personnaliser" },
  { title: "Idées cadeaux", text: "Jeux, lunch boxes, gourdes et sacs à offrir.", image: "fete-2", href: "/collections/jeux", cta: "Découvrir" },
  { title: "Looks d'hiver", text: "Sweats, vestes et tenues pour affronter le froid.", image: "fete-3", href: "/collections/vestes-manteaux", cta: "Voir les vestes" },
] as const;

export default async function Home() {
  const best = await getBestSellers();
  const cats = [...CATEGORIES.map((c) => ({ slug: c.slug, name: c.name, image: c.image, href: `/collections/${c.slug}` })),
    { slug: "cadeaux", name: "Cartes cadeaux", image: "cat-cadeaux", href: "/carte-cadeau" }];
  const img = (key: string, alt: string, sizes: string, position?: string, priority = false) =>
    <Visual assetKey={key} alt={alt} className="h-full w-full" sizes={sizes} position={position} priority={priority} />;
  const slides: HeroSlide[] = [
    { desktop: img("hero-b1", "", "100vw", "50% 50%", true), mobile: img("hero-m1", "Quatre enfants en doudounes et sweats POPI KIDS", "100vw", "50% 30%"),
      thumb: img("hero-t1", "", "(min-width:640px) 30vw, 33vw"), thumbLabel: "Bien au chaud", title: "Bien au chaud, tout simplement.",
      cta: { label: "Découvrir les vestes", href: "/collections/vestes-manteaux" } },
    { desktop: img("hero-b2", "", "100vw"), mobile: img("hero-m2", "Sweats personnalisés Jade et Adam", "100vw", "35% 50%"),
      thumb: img("hero-t2", "", "(min-width:640px) 30vw, 33vw"), thumbLabel: "Un cadeau personnalisé", title: "Personnalisez leur sweat pour les fêtes",
      cta: { label: "Créer mon cadeau", href: "/collections/sweats-gilets" } },
    { desktop: img("hero-b3", "", "100vw"), mobile: img("hero-m3", "Carte cadeau POPI KIDS et son enveloppe", "100vw", "50% 50%"),
      thumb: img("hero-t3", "", "(min-width:640px) 30vw, 33vw"), thumbLabel: "Le plaisir de choisir", title: "Et si vous leur laissiez le choix ?",
      cta: { label: "Offrir une carte cadeau", href: "/carte-cadeau" } },
  ];

  const essentials = (await Promise.all(ESSENTIALS.map(async (e) => ({ e, p: await getProduct(e.slug) })))).flatMap((x) => x.p ? [{ ...x.e, p: x.p }] : []);
  const bundles = await Promise.all(BUNDLES.map(async (b) => {
    const items = (await Promise.all(b.slugs.map((s) => getProduct(s)))).flatMap((p) => p ? [{
      productId: p.id, slug: p.slug, name: p.name, price: p.price, image: p.images[0] ?? "",
      visual: <Visual assetKey={p.images[0] ?? ""} alt={p.name} className="h-full w-full" sizes="25vw" position="50% 0%" />,
    }] : []);
    return { ...b, items };
  }));
  return (
    <>
      <Hero slides={slides} />

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

      <section className="mx-auto max-w-[1400px] px-4 pt-14 sm:px-6" aria-label="Nos essentiels de saison">
        <h2 className="section-title mb-6 text-center text-3xl sm:text-4xl">Nos essentiels de saison</h2>
        <ul className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {essentials.map(({ p, label, color, image }) => (
            <li key={p.slug}>
              <Link href={`/product/${p.slug}`} className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface transition hover:border-accent-strong">
                <Visual assetKey={image} alt={`${label} ${p.name}, ${color}`} className="aspect-[4/5] w-full" sizes="(min-width:1024px) 25vw, 50vw" position="50% 0%" />
                <div className="flex flex-1 flex-col p-3 sm:p-4">
                  <h3 className="serif text-lg leading-tight sm:text-xl">{label} {p.name}</h3>
                  <p className="mt-1 text-xs text-muted sm:text-sm">{color}</p>
                  <p className="mt-2 text-sm font-medium">{eur(p.price)}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium underline-offset-4 group-hover:underline">Découvrir <ArrowRight size={15} /></span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-[1400px] px-4 pt-14 sm:px-6" aria-label="La magie des fêtes">
        <h2 className="section-title mb-6 text-center text-3xl sm:text-4xl">La magie des fêtes</h2>
        <ul className="grid gap-4 md:grid-cols-3">
          {FETES.map((o) => (
            <li key={o.title}>
              <Link href={o.href} className="group relative block aspect-[4/5] overflow-hidden rounded-2xl border border-line">
                <span className="absolute inset-0 block transition-transform duration-500 group-hover:scale-105"><Visual assetKey={o.image} alt="" className="h-full w-full" sizes="(min-width:768px) 33vw, 100vw" position="50% 30%" /></span>
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/45 to-transparent p-5 pt-20 text-white [text-shadow:0_1px_8px_rgb(0_0_0/.5)]">
                  <span className="serif block text-2xl leading-tight">{o.title}</span>
                  <span className="mt-1 block text-sm text-white/90">{o.text}</span>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium underline-offset-4 group-hover:underline">{o.cta} <ArrowRight size={15} /></span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section id="packs" className="mx-auto max-w-[1400px] scroll-mt-24 px-4 pt-14 sm:px-6" aria-label="Packs">
        <h2 className="section-title mb-6 text-center text-3xl sm:text-4xl">Nos packs</h2>
        <div className="grid overflow-hidden rounded-2xl border border-line bg-surface-2/60 md:grid-cols-2">
          <Visual assetKey="pack-chaud" alt="Trois enfants en sweats et doudounes POPI KIDS" className="aspect-[4/3] w-full md:aspect-auto md:min-h-[360px]" sizes="(min-width:768px) 50vw, 100vw" position="50% 30%" />
          <div className="flex flex-col justify-center p-6 sm:p-10">
            <span className="mb-3 w-fit rounded-full bg-primary px-3 py-1 text-[11px] font-medium uppercase tracking-widest text-primary-fg">{SWEAT_OFFER.label}</span>
            <h3 className="serif text-3xl leading-tight sm:text-4xl">Le pack bien au chaud</h3>
            <p className="mt-3 max-w-md text-muted">Choisissez 3 articles similaires, payez-en seulement 2.</p>
            <p className="mt-2 text-sm text-muted">Clasica · Urban · New Artic</p>
            <Link href="/collections/sweats-gilets" className="btn btn-primary mt-6 w-fit">Composer mon pack <ArrowRight size={16} /></Link>
          </div>
        </div>
        {bundles.length > 0 && (
          <ul className="mt-4 grid gap-4 md:grid-cols-2">
            {bundles.map((b) => b.items.length === b.slugs.length && (
              <li key={b.id}><BundleCard title={b.title} text={b.text} items={b.items} offer={b.offer} /></li>
            ))}
          </ul>
        )}
      </section>

      <section className="mx-auto mt-14 max-w-[1400px] px-4 sm:px-6" aria-label="Carte cadeau">
        <Link href="/carte-cadeau" className="group relative block overflow-hidden rounded-2xl border border-line">
          <span className="relative hidden aspect-[1920/800] w-full md:block">{img("hero-b3", "Et si vous leur laissiez le choix ? Offrez une carte cadeau POPI KIDS", "(min-width:1400px) 1400px, 100vw", "50% 50%")}</span>
          <span className="block md:hidden">
            <span className="relative block aspect-[3/2] w-full">{img("hero-m3", "Carte cadeau POPI KIDS et son enveloppe", "100vw", "50% 50%")}</span>
            <span className="block p-6">
              <span className="serif block text-3xl leading-tight">Et si vous leur laissiez le choix ?</span>
              <span className="mt-2 block text-muted">Offrez une carte cadeau POPI KIDS.</span>
              <span className="btn btn-primary mt-5 w-full">Offrir une carte cadeau <ArrowRight size={16} /></span>
            </span>
          </span>
        </Link>
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
