/**
 * Options de personnalisation texte (prénom / phrase), impression DTF.
 * ⚠ À VALIDER par CMR Personnalisation : choisir les 2 styles de police et les couleurs d'impression réellement proposés.
 * Pour changer : modifier uniquement ce fichier (la police "css" doit exister dans layout.tsx).
 */
export const PRINT_FONTS = [
  { id: "manuscrite", label: "Manuscrite", css: "var(--font-script), cursive" },
  { id: "classique", label: "Classique", css: "var(--font-cormorant), Georgia, serif" },
] as const;

export const PRINT_COLORS = [
  { name: "Marine", hex: "#1B2A4A" },
  { name: "Blanc", hex: "#FFFFFF" },
  { name: "Noir", hex: "#111111" },
] as const;

export type PrintFontId = (typeof PRINT_FONTS)[number]["id"];
export const fontLabel = (id?: string) => PRINT_FONTS.find((f) => f.id === id)?.label ?? "";
