import { describe, expect, it } from "vitest";
import { sweatDiscount, BUNDLES } from "@/lib/offers";
import { getProduct } from "@/lib/commerce";

const L = (slug: string, price: number, qty = 1) => ({ slug, price, qty });

describe("offre 4ᵉ sweat offert", () => {
  it("aucune remise sous 4 sweats", () => {
    expect(sweatDiscount([L("epiro", 1660, 3)])).toBe(0);
  });
  it("offre le moins cher d'un lot de 4", () => {
    expect(sweatDiscount([L("epiro", 1660), L("leros", 1880), L("badet", 2500), L("urban", 1950)])).toBe(1660);
  });
  it("2 lots de 4 = 2 sweats offerts", () => {
    expect(sweatDiscount([L("epiro", 1660, 8)])).toBe(3320);
  });
  it("ignore les articles qui ne sont pas des sweats", () => {
    expect(sweatDiscount([L("aida", 760, 10), L("epiro", 1660, 3)])).toBe(0);
  });
  it("les packs ne contiennent que de vrais produits du catalogue", async () => {
    for (const b of BUNDLES) for (const s of b.slugs) expect(await getProduct(s)).not.toBeNull();
  });
});
