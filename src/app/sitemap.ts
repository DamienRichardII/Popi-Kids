import type { MetadataRoute } from "next";
import { CATEGORIES, getProducts } from "@/lib/commerce";
import { SITE } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts();
  return [
    "", "/shop", "/contact-us",
    ...CATEGORIES.map((c) => `/collections/${c.slug}`),
    ...products.filter((p) => !p.isDemo).map((p) => `/product/${p.slug}`),
  ].map((u) => ({ url: `${SITE.url}${u}` }));
}
