import type { CartLine } from "./types";

/**
 * Offre « 4ᵉ sweat offert » demandée par le client (conditions exactes à confirmer :
 * ici, pour 4 sweat-shirts dans le panier, le moins cher du lot de 4 est offert).
 * Sweat-shirts = références fournisseur SU… du catalogue.
 */
export const SWEAT_SLUGS = ["epiro", "leros", "badet", "urban", "clasica"] as const;
export const SWEAT_OFFER = { every: 4, label: "4ᵉ sweat offert" } as const;

/** Remise en centimes : dans chaque lot de 4 sweats (du plus cher au moins cher), le 4ᵉ est offert. */
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
  { id: "pack-sweats", title: "Pack 4 sweats", text: "Choisissez le confort : le 4ᵉ sweat est offert.", slugs: ["epiro", "leros", "badet", "urban"], offer: true },
  { id: "pack-rentree", title: "Pack rentrée", text: "Un polo, un pantalon et une casquette pour démarrer du bon pied.", slugs: ["monzha", "dortmund", "freya"], offer: false },
  { id: "pack-sport", title: "Pack sport", text: "Le t-shirt, le short et les chaussettes pour les journées de match.", slugs: ["forza", "calcio", "soccer"], offer: false },
] as const;
