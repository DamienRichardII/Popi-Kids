/**
 * Informations de marque. Tout ce qui n'est pas confirmé par le client reste vide/null
 * et n'est pas affiché (voir "À valider" dans docs/AUDIT_POPI_KIDS.md).
 */
export const SITE = {
  name: "POPI KIDS",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  // Relevés sur popikids.com le 22/10/2026 – à valider (incohérence 100 € / 49 € constatée sur le site actuel)
  freeShipping: "Livraison gratuite dès 100 € d'achat",
  contactEmail: "popikids@gmail.com",
  // URLs des comptes officiels : non fournies → liens masqués tant qu'elles sont null.
  socials: { tiktok: null, snapchat: null, instagram: null, facebook: null } as Record<string, string | null>,
};

export const NAV = [
  { label: "Accueil", href: "/" },
  { label: "Filles", href: "/collections/filles" },
  { label: "Garçons", href: "/collections/garcons" },
  { label: "Bébés", href: "/collections/bebes" },
  { label: "Collections", href: "/shop", mega: true },
  { label: "Accessoires", href: "/collections/accessoires" },
  { label: "Nos engagements", href: "/#engagements" },
  { label: "Contact", href: "/contact-us" },
] as const;

export const REASSURANCE = [
  { icon: "truck", title: "Livraison rapide", text: "Dès 49 € d'achat" },
  { icon: "leaf", title: "Coton doux", text: "Pour les peaux sensibles" },
  { icon: "shield", title: "Paiement sécurisé", text: "Carte bancaire" },
  { icon: "package", title: "Retours gratuits", text: "Sous 30 jours" },
] as const;
