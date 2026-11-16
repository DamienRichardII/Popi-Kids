import { describe, expect, it } from "vitest";
import { sweatDiscount, BUNDLES, SWEAT_SLUGS } from "@/lib/offers";
import { getProduct } from "@/lib/commerce";

const L = (slug: string, price: number, qty = 1) => ({ slug, price, qty });

describe("offre 4ᵉ article offert", () => {
  it("aucune remise sous 4 articles", () => {
    expect(sweatDiscount([L("clasica", 1730, 3)])).toBe(0);
  });
  it("offre le moins cher d'un lot de 4", () => {
    expect(sweatDiscount([L("clasica", 1730), L("urban", 1950), L("new-artic", 2050), L("urban", 1950)])).toBe(1730);
  });
  it("2 lots de 4 = 2 articles offerts", () => {
    expect(sweatDiscount([L("urban", 1950, 8)])).toBe(3900);
  });
  it("ignore les articles non éligibles", () => {
    expect(sweatDiscount([L("aida", 760, 10), L("urban", 1950, 3)])).toBe(0);
  });
  it("les articles éligibles et les packs sont de vrais produits du catalogue", async () => {
    for (const s of SWEAT_SLUGS) expect(await getProduct(s)).not.toBeNull();
    for (const b of BUNDLES) for (const s of b.slugs) expect(await getProduct(s)).not.toBeNull();
  });
});
