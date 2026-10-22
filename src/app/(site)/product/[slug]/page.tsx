import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductPurchase from "@/components/ProductPurchase";
import ProductGrid from "@/components/ProductGrid";
import Visual from "@/components/Visual";
import { getProduct, getRelated, inStock } from "@/lib/commerce";
import { SITE } from "@/lib/site";

type P = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const p = await getProduct((await params).slug);
  return p ? { title: p.name, description: p.description, alternates: { canonical: `/product/${p.slug}` } } : {};
}

export default async function ProductPage({ params }: P) {
  const p = await getProduct((await params).slug);
  if (!p) notFound();
  const related = await getRelated(p);
  const jsonLd = [
    { "@context": "https://schema.org", "@type": "Product", name: p.name, description: p.description,
      offers: { "@type": "Offer", priceCurrency: "EUR", price: (p.price / 100).toFixed(2),
        availability: inStock(p) ? "https://schema.org/InStock" : "https://schema.org/OutOfStock", url: `${SITE.url}/product/${p.slug}` } },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: SITE.url },
      { "@type": "ListItem", position: 2, name: "Boutique", item: `${SITE.url}/shop` },
      { "@type": "ListItem", position: 3, name: p.name } ] },
  ];
  return (
    <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <nav aria-label="Fil d'Ariane" className="mb-6 text-sm text-muted">
        <Link href="/">Accueil</Link> / <Link href="/shop">Boutique</Link> / <span aria-current="page" className="text-fg">{p.name}</span>
      </nav>
      <ProductPurchase product={p}
        gallery={p.images.map((k, i) => <Visual key={k} assetKey={k} alt={`${p.name} – photo ${i + 1}`} className="h-full w-full" sizes="(min-width:1024px) 50vw, 100vw" priority={i === 0} />)} />
      <section className="mt-20"><h2 className="section-title mb-6 text-3xl">Produits similaires</h2>
        <ProductGrid products={related} empty={<p className="text-muted">Aucun produit similaire pour le moment.</p>} /></section>
    </div>
  );
}
