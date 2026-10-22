import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CatalogView, { type SP } from "@/components/CatalogView";
import { getCategory } from "@/lib/commerce";

type P = { params: Promise<{ slug: string }>; searchParams: Promise<SP> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const c = await getCategory((await params).slug);
  return c ? { title: c.name, alternates: { canonical: `/collections/${c.slug}` } } : {};
}

export default async function Collection({ params, searchParams }: P) {
  const { slug } = await params;
  const c = await getCategory(slug);
  if (!c) notFound();
  return (
    <CatalogView title={c.name} description={c.description} category={c.slug} sp={await searchParams} basePath={`/collections/${c.slug}`}
      crumbs={[{ label: "Accueil", href: "/" }, { label: "Boutique", href: "/shop" }, { label: c.name }]} />
  );
}
