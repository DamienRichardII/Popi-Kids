import type { AdminStats, Category, Product } from "./types";

/**
 * Couche d'accès aux données commerciales.
 * Le moteur (WooCommerce headless ou Medusa v2) n'est PAS encore choisi : seul le
 * fournisseur "demo" existe. Les produits ci-dessous sont des EXEMPLES issus des
 * maquettes (isDemo: true) – jamais présentés comme le catalogue réel.
 * Pour brancher un moteur : implémenter ces 5 fonctions, ne rien changer ailleurs.
 */

const sizes = (stock: number[]) =>
  ["2-3 ans", "4-5 ans", "6-7 ans", "8-9 ans"].map((label, i) => ({ label, stock: stock[i] ?? 0 }));

const demo = (p: Omit<Product, "isDemo" | "description"> & { description?: string }): Product => ({
  description: "Description à fournir par POPI KIDS.",
  ...p,
  isDemo: true,
});

const PRODUCTS: Product[] = [
  demo({ id: "d1", slug: "sweat-essential", name: "Sweat Essential", price: 2990, categories: ["sweats", "garcons"],
    colors: [{ name: "Marine", hex: "#10233f" }, { name: "Rouge", hex: "#c0272d" }], sizes: sizes([5, 3, 0, 2]),
    images: ["prod-sweat-essential-1", "prod-sweat-essential-2"], isNew: true }),
  demo({ id: "d2", slug: "ensemble-confort", name: "Ensemble Confort", price: 3990, categories: ["filles"],
    colors: [{ name: "Noir", hex: "#111" }, { name: "Crème", hex: "#e9dcc6" }, { name: "Vert", hex: "#4f8a4f" }], sizes: sizes([2, 4, 4, 1]),
    images: ["prod-ensemble-confort-1"] }),
  demo({ id: "d3", slug: "combinaison-teddy", name: "Combinaison Teddy", price: 3490, categories: ["bebes"],
    colors: [{ name: "Camel", hex: "#a98563" }, { name: "Bleu", hex: "#7f93ad" }], sizes: sizes([3, 0, 0, 0]),
    images: ["prod-combinaison-teddy-1"], isNew: true }),
  demo({ id: "d4", slug: "polo-classique", name: "Polo Classique", price: 2350, categories: ["tshirts", "garcons"],
    colors: [{ name: "Marine", hex: "#10233f" }, { name: "Bleu", hex: "#2b4a8a" }], sizes: sizes([6, 6, 2, 0]),
    images: ["prod-polo-classique-1"] }),
  demo({ id: "d5", slug: "sac-a-dos", name: "Sac à dos", price: 3290, categories: ["accessoires"],
    colors: [{ name: "Beige", hex: "#d9c3a2" }, { name: "Marine", hex: "#10233f" }], sizes: [{ label: "Unique", stock: 7 }],
    images: ["prod-sac-a-dos-1"] }),
];

export const CATEGORIES: Category[] = [
  { slug: "bebes", name: "Bébés", description: "", image: "cat-bebes" },
  { slug: "filles", name: "Filles", description: "", image: "cat-filles" },
  { slug: "garcons", name: "Garçons", description: "", image: "cat-garcons" },
  { slug: "tshirts", name: "T-shirts et polos", description: "", image: "cat-tshirts" },
  { slug: "sweats", name: "Sweats et gilets", description: "", image: "cat-sweats" },
  { slug: "vestes", name: "Vestes et manteaux", description: "", image: "cat-vestes" },
  { slug: "jeux", name: "Jeux de société", description: "", image: "cat-jeux" },
  { slug: "accessoires", name: "Accessoires", description: "", image: "cat-accessoires" },
].map((c) => ({ ...c, description: "Description de catégorie à fournir." }));

export type Query = {
  category?: string; size?: string[]; color?: string[]; min?: number; max?: number;
  q?: string; inStock?: boolean; sort?: "nouveautes" | "prix-asc" | "prix-desc" | "populaires";
};

export const inStock = (p: Product) => p.sizes.some((s) => s.stock > 0);

export async function getProducts(q: Query = {}): Promise<Product[]> {
  let list = PRODUCTS.filter((p) => !q.category || p.categories.includes(q.category));
  if (q.q) list = list.filter((p) => p.name.toLowerCase().includes(q.q!.toLowerCase()));
  if (q.size?.length) list = list.filter((p) => p.sizes.some((s) => q.size!.includes(s.label) && s.stock > 0));
  if (q.color?.length) list = list.filter((p) => p.colors.some((c) => q.color!.includes(c.name)));
  if (q.min != null) list = list.filter((p) => p.price >= q.min! * 100);
  if (q.max != null) list = list.filter((p) => p.price <= q.max! * 100);
  if (q.inStock) list = list.filter(inStock);
  if (q.sort === "prix-asc") list = [...list].sort((a, b) => a.price - b.price);
  if (q.sort === "prix-desc") list = [...list].sort((a, b) => b.price - a.price);
  if (q.sort === "nouveautes") list = [...list].sort((a, b) => Number(!!b.isNew) - Number(!!a.isNew));
  return list;
}
export async function getProduct(slug: string) { return PRODUCTS.find((p) => p.slug === slug) ?? null; }
export async function getCategory(slug: string) { return CATEGORIES.find((c) => c.slug === slug) ?? null; }
export async function getBestSellers() { return PRODUCTS; } // "popularité" réelle à brancher sur les ventes
export async function getRelated(p: Product) {
  return PRODUCTS.filter((x) => x.id !== p.id && x.categories.some((c) => p.categories.includes(c))).slice(0, 4);
}

/** Aucune statistique inventée : tant qu'aucun moteur n'est branché, retourne null (état vide). */
export async function getAdminStats(): Promise<AdminStats | null> { return null; }

export const eur = (cents: number) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(cents / 100);
