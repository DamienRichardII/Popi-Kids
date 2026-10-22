import fs from "node:fs";
import path from "node:path";

/**
 * Mapping explicite ressource → composant (voir docs/DESIGN_SYSTEM.md §Assets).
 * Déposer le fichier dans public/assets/ avec le nom indiqué : il remplace
 * automatiquement le placeholder. Aucune image externe n'est utilisée.
 */
export const ASSET_MAP: Record<string, { file: string; label: string; used: string }> = {
  logo: { file: "logo.svg", label: "Logo POPI KIDS", used: "Header, footer, admin" },
  "hero-1": { file: "hero-1.jpg", label: "Hero – slide 1 (3 enfants)", used: "Hero" },
  "hero-2": { file: "hero-2.jpg", label: "Hero – slide 2", used: "Hero" },
  "hero-3": { file: "hero-3.jpg", label: "Hero – slide 3", used: "Hero" },
  "banner-new": { file: "banner-nouvelle-collection.jpg", label: "Bannière Nouvelle collection", used: "Bannières" },
  "banner-looks": { file: "banner-looks-saison.jpg", label: "Bannière Looks de saison", used: "Bannières" },
  "cat-bebes": { file: "cat-bebes.jpg", label: "Catégorie Bébés", used: "Catégories" },
  "cat-filles": { file: "cat-filles.jpg", label: "Catégorie Filles", used: "Catégories" },
  "cat-garcons": { file: "cat-garcons.jpg", label: "Catégorie Garçons", used: "Catégories" },
  "cat-tshirts": { file: "cat-tshirts-polos.jpg", label: "Catégorie T-shirts et polos", used: "Catégories" },
  "cat-sweats": { file: "cat-sweats-gilets.jpg", label: "Catégorie Sweats et gilets", used: "Catégories" },
  "cat-vestes": { file: "cat-vestes-manteaux.jpg", label: "Catégorie Vestes et manteaux", used: "Catégories" },
  "cat-jeux": { file: "cat-jeux.jpg", label: "Catégorie Jeux de société", used: "Catégories" },
  "cat-accessoires": { file: "cat-accessoires.jpg", label: "Catégorie Accessoires", used: "Catégories" },
};

export function resolveAsset(key: string): { src: string | null; label: string } {
  const entry = ASSET_MAP[key];
  const file = entry?.file ?? `${key}.jpg`;
  const label = entry?.label ?? key;
  const exists = fs.existsSync(path.join(process.cwd(), "public", "assets", file));
  return { src: exists ? `/assets/${file}` : null, label };
}
