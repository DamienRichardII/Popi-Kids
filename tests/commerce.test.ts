import { describe, expect, it } from "vitest";
import { getAdminStats, getProducts, getProduct, inStock, eur } from "@/lib/commerce";

describe("commerce (fournisseur demo)", () => {
  it("filtre par catégorie", async () => {
    const list = await getProducts({ category: "bebes" });
    expect(list.length).toBeGreaterThan(0);
    expect(list.every((p) => p.categories.includes("bebes"))).toBe(true);
  });
  it("filtre les tailles indisponibles", async () => {
    const list = await getProducts({ size: ["6-7 ans"] });
    expect(list.every((p) => p.sizes.some((s) => s.label === "6-7 ans" && s.stock > 0))).toBe(true);
  });
  it("trie par prix croissant", async () => {
    const prices = (await getProducts({ sort: "prix-asc" })).map((p) => p.price);
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });
  it("marque tous les produits d'exemple comme démo", async () => {
    expect((await getProducts()).every((p) => p.isDemo)).toBe(true);
  });
  it("détecte la rupture de stock", async () => {
    const p = await getProduct("sweat-essential");
    expect(p && inStock(p)).toBe(true);
  });
  it("n'invente aucune statistique admin", async () => {
    expect(await getAdminStats()).toBeNull();
  });
  it("formate les prix en euros", () => {
    expect(eur(2990).replace(/\s/g, " ")).toBe("29,90 €");
  });
});
