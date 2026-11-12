import { describe, expect, it } from "vitest";
import { getAdminStats, getBestSellers, getProducts, getProduct, inStock, eur } from "@/lib/commerce";

describe("catalogue POPI KIDS (fournisseur demo)", () => {
  it("contient les 132 références fournies", async () => {
    expect((await getProducts()).length).toBe(132);
  });
  it("filtre par catégorie", async () => {
    const jeux = await getProducts({ category: "jeux" });
    expect(jeux).toHaveLength(24);
    expect(jeux.every((p) => p.categories.includes("jeux"))).toBe(true);
  });
  it("utilise les prix de la liste fournie (centimes)", async () => {
    expect((await getProduct("jamaica"))?.price).toBe(490);
    expect((await getProduct("soccer"))?.price).toBe(520);
    expect((await getProduct("brisca"))?.price).toBe(350);
  });
  it("trie par prix croissant", async () => {
    const prices = (await getProducts({ sort: "prix-asc" })).map((p) => p.price);
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });
  it("n'invente pas de tailles et reprend les couleurs/descriptions du site", async () => {
    const all = await getProducts();
    expect(all.every((p) => p.sizes.length === 0)).toBe(true);
    expect(all.every((p) => !p.description.startsWith("Description à fournir"))).toBe(true);
    const tamil = await getProduct("tamil");
    expect(tamil?.colors.map((c) => c.name)).toContain("Blanc/Noir");
    expect(tamil?.composition).toMatch(/polyester/);
  });
  it("chaque produit a au moins une photo", async () => {
    expect((await getProducts()).every((p) => p.images.length > 0)).toBe(true);
  });
  it("détecte la rupture de stock du site actuel", async () => {
    const p = await getProduct("antartida");
    expect(p && inStock(p)).toBe(false);
    const q = await getProduct("salento");
    expect(q && inStock(q)).toBe(true);
  });
  it("la sélection ne contient que des produits disponibles", async () => {
    const s = await getBestSellers();
    expect(s.length).toBeGreaterThan(0);
    expect(s.every(inStock)).toBe(true);
  });
  it("n'invente aucune statistique admin", async () => {
    expect(await getAdminStats()).toBeNull();
  });
  it("formate les prix en euros", () => {
    expect(eur(2990).replace(/\s/g, " ")).toBe("29,90 €");
  });
});
