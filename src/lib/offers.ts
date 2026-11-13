import type { CartLine } from "./types";

/**
 * Offre « Le pack bien au chaud : 3ᵉ article offert » (maquette client) : pour 3 articles éligibles
 * (Clasica, Urban, New Artic) dans le panier, le moins cher du lot de 3 est offert.
 * Conditions exactes (« articles similaires ») à confirmer par POPI KIDS.
 */
export const SWEAT_SLUGS = ["clasica", "urban", "new-artic"] as const;
export const SWEAT_OFFER = { every: 3, label: "3ᵉ article offert" } as const;

/** Remise en centimes : dans chaque lot de 3 articles éligibles (du plus cher au moins cher), le 3ᵉ est offert. */
export function sweatDiscount(lines: Pick<CartLine, "slug" | "price" | "qty">[]): number {
  const prices: number[] = [];
  for (const l of lines) if ((SWEAT_SLUGS as readonly string[]).includes(l.slug)) for (let i = 0; i < l.qty; i++) prices.push(l.price);
  prices.sort((a, b) => b - a);
  let d = 0;
  for (let i = SWEAT_OFFER.every - 1; i < prices.length; i += SWEAT_OFFER.every) d += prices[i] ?? 0;
  return d;
}

/** Packs : uniquement de vrais produits du catalogue, prix = somme exacte (aucune remise inventée). */
export const BUNDLES = [
  { id: "pack-rentree", title: "Pack rentrée", text: "Un polo, un pantalon et une casquette pour démarrer du bon pied.", slugs: ["monzha", "dortmund", "freya"], offer: false },
  { id: "pack-sport", title: "Pack sport", text: "Un t-shirt, un short et une tenue de match pour les journées sportives.", slugs: ["forza", "calcio", "soccer"], offer: false },
] as const;
