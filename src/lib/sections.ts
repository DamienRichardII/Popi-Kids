export const ADMIN_NAV = [
  ["", "Tableau de bord"], ["produits", "Produits"], ["categories", "Catégories"], ["stocks", "Stocks"],
  ["commandes", "Commandes"], ["clients", "Clients"], ["promotions", "Promotions"], ["livraisons", "Livraisons"],
  ["contenu", "Contenu du site"], ["parametres", "Paramètres"],
] as const;

export const ACCOUNT_SECTIONS = [
  { slug: "commandes", label: "Mes commandes", text: "Vous n'avez pas encore de commande." },
  { slug: "adresses", label: "Mes adresses", text: "Aucune adresse enregistrée." },
  { slug: "favoris", label: "Mes favoris", text: "Vos favoris apparaîtront ici." },
  { slug: "informations", label: "Mes informations", text: "Vos informations personnelles apparaîtront ici après connexion." },
  { slug: "notifications", label: "Préférences de notifications", text: "Choix des e-mails de suivi et de newsletter, disponible après connexion." },
] as const;
