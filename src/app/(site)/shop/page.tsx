import type { Metadata } from "next";
import CatalogView, { type SP } from "@/components/CatalogView";

export const metadata: Metadata = { title: "Boutique", alternates: { canonical: "/shop" } };

export default async function Shop({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  return <CatalogView title="Boutique" crumbs={[{ label: "Accueil", href: "/" }, { label: "Boutique" }]} sp={sp} basePath="/shop" />;
}
