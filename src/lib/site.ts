/**
 * Informations de marque. Tout ce qui n'est pas confirmé par le client reste vide/null
 * et n'est pas affiché (voir "À valider" dans docs/AUDIT_POPI_KIDS.md).
 */
export const SITE = {
  name: "POPI KIDS",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000"),
  // Relevés sur popikids.com le 22/10/2026 – à valider (incohérence 100 € / 49 € constatée sur le site actuel)
  freeShipping: "Livraison gratuite dès 100 € d'achat",
  contactEmail: "popikids@gmail.com",
  // URLs des comptes officiels : non fournies → liens masqués tant qu'elles sont null.
  socials: { tiktok: null, snapchat: null, instagram: null, facebook: null } as Record<string, string | null>,
};

export const NAV = [
  { label: "Accueil", href: "/" },
  { label: "Vêtements", href: "/collections/vetements" },
  { label: "Jeux", href: "/collections/jeux" },
  { label: "Collections", href: "/shop", mega: true },
  { label: "Lunch boxes", href: "/collections/lunch-boxes" },
  { label: "Gourdes", href: "/collections/gourdes" },
  { label: "Nos engagements", href: "/#engagements" },
  { label: "Contact", href: "/contact-us" },
] as const;

/** Atouts relevés sur l'accueil actuel de popikids.com (livraison : seuil 100 € / 49 € à valider). */
export const REASSURANCE = [
  { icon: "leaf", title: "Coton doux", text: "Pour les peaux sensibles" },
  { icon: "droplet", title: "Couleurs durables", text: "Lavage après lavage" },
  { icon: "users", title: "De 6 mois à 16 ans", text: "Pour toutes les étapes" },
  { icon: "truck", title: "Livraison rapide", text: "Gratuite dès 100 € d'achat" },
  { icon: "package", title: "Retours gratuits", text: "Dans un délai de 30 jours" },
] as const;

export const TRUST = [
  { icon: "truck", title: "Livraison sécurisée" },
  { icon: "shield", title: "Garantie de 30 jours" },
  { icon: "leaf", title: "Qualité supérieure" },
  { icon: "lock", title: "Paiement sécurisé" },
] as const;

export const FAQ = [
  { q: "Quels sont vos délais de livraison ?", a: "Nous préparons votre commande avec soin afin de l'expédier dans les meilleurs délais. La livraison est généralement effectuée sous 3 à 7 jours ouvrés, selon votre adresse de livraison. Vous recevrez les informations de suivi dès que votre commande sera expédiée." },
  { q: "Comment retourner un article ?", a: "Les retours sont possibles dans un délai de 30 jours. Les modalités détaillées seront précisées par POPI KIDS." },
  { q: "Comment puis-je suivre ma commande ?", a: "Vous recevrez les informations de suivi dès que votre commande sera expédiée." },
  { q: "Le paiement est-il sécurisé ?", a: "Réponse détaillée à fournir par POPI KIDS." },
] as const;
