import type { AdminStats, Category, Product } from "./types";

/**
 * Couche d'accès aux données commerciales.
 * Le moteur (WooCommerce headless ou Medusa v2) n'est PAS encore choisi : seul le
 * fournisseur "demo" existe. Le catalogue ci-dessous est la liste de références fournie
 * par POPI KIDS (nom, prix en centimes, catégorie, référence) croisée avec les photos
 * de popikids.com. Tailles, couleurs et stocks réels ne sont PAS connus : aucune valeur
 * n'est inventée (sizes/colors vides ; "available" = indicateur de stock du site actuel).
 * Pour brancher un moteur : implémenter ces fonctions, ne rien changer ailleurs.
 */

/** [slug, nom, prix (centimes), catégorie, référence, nb de photos, disponible?] */
type Row = [string, string, number, string, string, number, boolean?];

const ROWS: Row[] = [
  ["salento", "Salento", 1500, "jeux", "SD1669", 4],
  ["feroe", "Feroe", 550, "jeux", "SD1003", 2],
  ["siscar", "Siscar", 930, "jeux", "JU1683", 4],
  ["buelix", "Buelix", 640, "jeux", "JU1682", 4],
  ["minos", "Minos", 350, "jeux", "JU1668", 4],
  ["ludus", "Ludus", 950, "jeux", "JU1592", 4],
  ["fisac", "Fisac", 300, "jeux", "JU1575", 4],
  ["zeon", "Zeon", 190, "jeux", "JU1564", 4],
  ["vicos", "Vicos", 1130, "jeux", "JU1540", 4],
  ["nokit", "Nokit", 820, "jeux", "JU1373", 4],
  ["vernon", "Vernon", 300, "jeux", "JU1252", 3],
  ["cubik", "Cubik", 2000, "jeux", "JU1041", 4],
  ["pensy", "Pensy", 350, "jeux", "JU1035", 4],
  ["naipe", "Naipe", 200, "jeux", "JU1028", 4],
  ["brisca", "Brisca", 350, "jeux", "JU1016", 4],
  ["galvy", "Galvy", 1200, "jeux", "JU1014", 2],
  ["domis", "Domis", 450, "jeux", "JU1013", 4],
  ["triwa", "Triwa", 320, "jeux", "JU1011", 4],
  ["ryman", "Ryman", 820, "jeux", "JU1010", 4],
  ["rocks", "Rocks", 1500, "jeux", "JU1009", 4],
  ["rosko", "Rosko", 200, "jeux", "JU0112", 3],
  ["leis", "Leis", 180, "jeux", "JU0111", 4],
  ["jazz", "Jazz", 1190, "jeux", "FT1853", 4],
  ["koda", "Koda", 990, "jeux", "FT1548", 4],
  ["croker", "Croker", 450, "sacs", "TB1755", 4],
  ["bingo", "Bingo", 1090, "sacs", "MO1710", 4],
  ["turcaz", "Turcaz", 150, "sacs", "BO7530", 4],
  ["azor", "Azor", 100, "sacs", "BO7529", 4],
  ["elanio", "Elanio", 350, "sacs", "BO7528", 4],
  ["marabu", "Marabu", 1400, "sacs", "BO7124", 1],
  ["kinkan", "Kinkan", 400, "gourdes", "MD4038", 4],
  ["balax", "Balax", 1190, "gourdes", "BI4122", 4],
  ["gerald", "Gerald", 1330, "gourdes", "BI2016", 4],
  ["bontax", "Bontax", 980, "gourdes", "BI1997", 4],
  ["fafik", "Fafik", 1350, "gourdes", "BI1968", 4],
  ["kelis", "Kelis", 1570, "gourdes", "BI1847", 4],
  ["marlen", "Marlen", 850, "gourdes", "BI1636", 4],
  ["pumba", "Pumba", 1120, "gourdes", "BI1517", 4],
  ["brena", "Brena", 1990, "lunch-boxes", "FI4069", 4],
  ["korlan", "Korlan", 1750, "lunch-boxes", "FI4066", 4],
  ["comix", "Comix", 1390, "lunch-boxes", "FI1998", 4],
  ["kady", "Kady", 1190, "lunch-boxes", "FI1996", 4],
  ["briox", "Briox", 990, "lunch-boxes", "FI1789", 4],
  ["camden", "Camden", 680, "lunch-boxes", "FI1561", 4],
  ["carmel", "Carmel", 1190, "lunch-boxes", "FI1560", 4],
  ["janex", "Janex", 1190, "lunch-boxes", "FI1361", 4],
  ["aida", "Aida", 760, "vetements", "CA6656", 2],
  ["andre", "Andre", 640, "vetements", "PD0350", 2],
  ["monzha", "Monzha", 950, "vetements", "PO0404", 2],
  ["tamil", "Tamil", 1050, "vetements", "PO0402", 2],
  ["austin", "Austin", 820, "vetements", "CA6654", 2],
  ["sport", "Sport", 750, "vetements", "BE6705", 2],
  ["forza", "Forza", 780, "vetements", "CA0324", 2],
  ["calcio", "Calcio", 650, "vetements", "PA0484", 1],
  ["dortmund", "Dortmund", 660, "vetements", "PA6688", 2],
  ["celtic", "Celtic", 1180, "vetements", "BE0553", 2],
  ["player", "Player", 630, "vetements", "PA0453", 1],
  ["carla", "Carla", 750, "vetements", "PA0317", 2],
  ["nelly", "Nelly", 640, "vetements", "PA0322", 2],
  ["agia", "Agia", 1250, "vetements", "LG0398", 2],
  ["bugatti", "Bugatti", 750, "vetements", "CA6399", 2],
  ["leire", "Leire", 950, "vetements", "LG0405", 2],
  ["indianapolis", "Indianapolis", 690, "vetements", "CA6650", 2],
  ["adelpho", "Adelpho", 1930, "vetements", "PA1174", 2],
  ["detroit", "Detroit", 720, "vetements", "CA6652", 2],
  ["new-astun", "New Astun", 1815, "vetements", "PA1173", 2],
  ["shanghai", "Shanghai", 650, "vetements", "CA6595", 2],
  ["argos", "Argos", 1690, "vetements", "PA0460", 2],
  ["zolder", "Zolder", 850, "vetements", "CA6653", 2],
  ["daytona", "Daytona", 630, "vetements", "CA0420", 2],
  ["coria", "Coria", 1490, "vetements", "PA8419", 2],
  ["imola", "Imola", 550, "vetements", "CA0427", 2],
  ["epiro", "Epiro", 1660, "vetements", "SU1115", 2],
  ["neapolis", "Neapolis", 1660, "vetements", "PA0521", 2],
  ["valier", "Valier", 1990, "vetements", "CQ0437", 2],
  ["leros", "Leros", 1880, "vetements", "SU0340", 2],
  ["rodas", "Rodas", 1600, "vetements", "PA0341", 2],
  ["gladius", "Gladius", 2120, "vetements", "CQ0435", 1],
  ["urus", "Urus", 1380, "vetements", "PA0436", 2],
  ["creta", "Creta", 3480, "vetements", "CH6410", 2],
  ["evans", "Evans", 3730, "vetements", "CH6402", 2],
  ["prime", "Prime", 1500, "vetements", "CA0365", 2],
  ["better", "Better", 1500, "vetements", "LG0458", 2],
  ["benoit", "Benoit", 870, "vetements", "DE9125", 2],
  ["montecarlo", "Montecarlo", 550, "vetements", "CA0425", 2],
  ["carpe-child", "Carpe Child", 950, "vetements", "PO5008", 2],
  ["estoril", "Estoril", 680, "vetements", "CA0430", 2],
  ["angelo", "Angelo", 1620, "vetements", "CB5088", 2],
  ["pointer-child", "Pointer Child", 700, "vetements", "CA1205", 2],
  ["tallin", "Tallin", 4740, "vetements", "PK5075", 2],
  ["nepal", "Népal", 4490, "vetements", "PK5080", 2],
  ["norway-sport", "Norway Sport", 3500, "vetements", "RA5097", 2],
  ["titan", "Titan", 1950, "vetements", "CJ0325", 2],
  ["honey-l-s", "Honey manche longue", 630, "vetements", "BD7202", 2],
  ["juve", "Juve", 2350, "vetements", "CJ0525", 2],
  ["racing", "Racing", 2040, "vetements", "CJ0452", 2],
  ["united", "United", 1610, "vetements", "CJ0457", 2],
  ["america", "America", 3600, "vetements", "PK5072", 2],
  ["porto", "Porto", 1720, "vetements", "CA0413", 2],
  ["norway", "Norway", 3150, "vetements", "RA5090", 2],
  ["bayern", "Bayern", 2720, "vetements", "PA0552", 2],
  ["arsenal", "Arsenal", 2160, "vetements", "PA0551", 2],
  ["antartida", "Antartida", 2750, "vetements", "SS6432", 2, false],
  ["roma", "Roma", 570, "vetements", "PT0417", 2],
  ["soccer", "Soccer", 520, "vetements", "CE0491", 2],
  ["himalaya", "Himalaya", 1280, "vetements", "SM1095", 2],
  ["freya", "Freya", 350, "vetements", "GO7030", 1],
  ["oslo", "Oslo", 2750, "vetements", "RA5092", 2],
  ["new-artic", "New Artic", 2050, "vetements", "CQ6414", 2],
  ["aqua", "Aqua", 1250, "vetements", "BN6716", 2],
  ["uranus", "Uranus", 400, "vetements", "GO7041", 1],
  ["panel", "Panel", 500, "vetements", "GO7008", 1],
  ["badet", "Badet", 2500, "vetements", "SU1058", 2],
  ["montblanc", "Mont Blanc", 2400, "vetements", "CQ6421", 2],
  ["urban", "Urban", 1950, "vetements", "SU1067", 2],
  ["clasica", "Clasica", 1730, "vetements", "SU1070", 2],
  ["star", "Star", 990, "vetements", "PO6638", 1],
  ["ulan", "Ulan", 2250, "vetements", "CQ6439", 2],
  ["estrella-l-s", "Estrella manche longue", 1290, "vetements", "PO6635", 2],
  ["pegaso-premium", "Pegaso Premium", 990, "vetements", "PO6609", 2],
  ["golden", "Golden", 770, "vetements", "CA6690", 2],
  ["texas", "Texas", 540, "vetements", "CA6545", 2],
  ["brenda", "Brenda", 540, "vetements", "CA6535", 2],
  ["akita", "Akita", 440, "vetements", "CA6534", 2],
  ["stafford", "Stafford", 610, "vetements", "CA6681", 2],
  ["jamaica", "Jamaica", 490, "vetements", "CA6627", 2],
  ["extreme", "Extreme", 840, "vetements", "CA1217", 2],
  ["bahrain", "Bahrain", 450, "vetements", "CA0407", 2],
  ["honey", "Honey", 580, "vetements", "BD7200", 2],
  ["braco", "Braco", 630, "vetements", "CA6550", 2],
  ["dogo-premium", "Dogo Premium", 590, "vetements", "CA6502", 2],
  ["beagle", "Beagle", 490, "vetements", "CA6554", 2],
];

const PRODUCTS: Product[] = ROWS.map(([slug, name, price, category, reference, photos, available], i) => ({
  id: `p${i + 1}`,
  slug,
  name,
  price,
  categories: [category],
  colors: [],
  sizes: [],
  images: Array.from({ length: photos }, (_, k) => `prod-${slug}-${k + 1}`),
  description: "Description à fournir par POPI KIDS.",
  reference,
  available: available !== false,
  // Références fournisseur CA… (t-shirts), PO… (polos), SU… (sweat-shirts) : à confirmer avec POPI KIDS
  customizable: category === "vetements" && /^(CA|PO|SU)/.test(reference),
  isDemo: false,
}));

export const CATEGORIES: Category[] = [
  { slug: "vetements", name: "Vêtements", description: "", image: "cat-vetements" },
  { slug: "jeux", name: "Jeux", description: "", image: "cat-jeux" },
  { slug: "lunch-boxes", name: "Lunch boxes", description: "", image: "cat-lunch-boxes" },
  { slug: "gourdes", name: "Gourdes", description: "", image: "cat-gourdes" },
  { slug: "sacs", name: "Sacs", description: "", image: "cat-sacs" },
].map((c) => ({ ...c, description: "Description de catégorie à fournir." }));

export type Query = {
  category?: string; size?: string[]; color?: string[]; min?: number; max?: number;
  q?: string; inStock?: boolean; sort?: "nouveautes" | "prix-asc" | "prix-desc" | "populaires";
};

/** Sans tailles connues, on se fie à l'indicateur de stock du site actuel. */
export const inStock = (p: Product) => (p.sizes.length ? p.sizes.some((s) => s.stock > 0) : p.available !== false);

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
/** Aucune donnée de ventes : sélection = premier produit disponible de chaque catégorie (pas de "meilleures ventes" inventées). */
export async function getBestSellers() {
  return CATEGORIES.map((c) => PRODUCTS.find((p) => p.categories.includes(c.slug) && inStock(p))).filter((p): p is Product => !!p);
}
export async function getRelated(p: Product) {
  return PRODUCTS.filter((x) => x.id !== p.id && x.categories.some((c) => p.categories.includes(c))).slice(0, 4);
}

/** Aucune statistique inventée : tant qu'aucun moteur n'est branché, retourne null (état vide). */
export async function getAdminStats(): Promise<AdminStats | null> { return null; }

export const eur = (cents: number) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(cents / 100);
