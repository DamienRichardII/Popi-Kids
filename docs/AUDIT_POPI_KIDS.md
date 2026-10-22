# AUDIT — popikids.com

Date de l'audit : 22/10/2026. Méthode : lecture des pages publiques (accueil, /shop, /checkout, /my-account, robots.txt, wp-sitemap*.xml) et analyse des deux maquettes. Seuls les faits observés sont listés ; le reste est marqué « à valider ».

## Limites de l'audit

- Les pages ont été lues sous forme de texte/markdown. Les en-têtes HTTP, le DOM complet, les plugins WordPress et les performances n'ont pas été mesurés.
- Le panier était vide : le tunnel de commande, les frais de livraison, les moyens de paiement réellement proposés, les stocks et les variantes n'ont pas pu être observés.
- Aucun accès administrateur : la liste exacte des plugins, des thèmes et des données clients/commandes est inconnue.
- Les liens du pied de page (légal, newsletter) n'apparaissaient pas dans le contenu analysé ; leur absence réelle est à confirmer en navigant le site.

## Constats vérifiés

**Plateforme.** WordPress avec Elementor 4.3.5 (balise generator). Les URLs `/product/`, `/product-category/`, `/shop/`, `/cart/?add-to-cart=`, `/my-account/` correspondent à WooCommerce, **non confirmé explicitement** (à valider avec le client).

**Structure.** Pages du sitemap : accueil, `/shop/`, `/cart/`, `/checkout/`, `/my-account/`, `/contact-us/`, `/build-pack/`, `/sample-page/`. Sitemap natif WordPress (`/wp-sitemap.xml`, sans Yoast ni Rank Math) incluant articles, pages, produits, catégories, **auteurs**.

**Menu actuel.** Accueil, T-shirts & polos, Sweats & gilets, Vestes & Manteaux, Boîtes à lunch, Jeux de société, Sport, Accessoires, Contactez-nous ; compte et panier.

**Catalogue.** 140 URLs produit dans le sitemap produits ; `/shop` : 9 pages de 16 produits. Noms en majuscules (JUVE, ADELPHO, AZOR…). Prix observés de 1,00 € à 36,00 €. Aucun filtre ni tri sur `/shop`, seulement une recherche et le menu catégories. Variantes et stocks non visibles.

**Catégories (slugs).** `uncategorized`, `sports`, `baby-bodies`, `jeux`, `gifts`, `cam_po`, `swe`, `coats` (+ `coats/pulls-and-gilets`), `lunch_boxes`, `sport_accessories`, `all_technology`. **Aucune catégorie « Filles » ni « Garçons »** : les maquettes les présupposent.

**Contenu commercial affiché.** « Livraison gratuite dès 100 € » (bandeau) et « dès 49 € » (bloc Livraison rapide) : deux seuils différents sur le site actuel comme sur les maquettes. Retours 30 jours, article non porté, étiquettes intactes, sur demande par e-mail. Livraison 3 à 7 jours ouvrés. Promotions : pack de rentrée, 4e article offert pour 3 achetés. Tailles « de 6 mois à 16 ans ».

**Compte.** Connexion (identifiant/e-mail, mot de passe, « se souvenir de moi », mot de passe perdu) et inscription (e-mail + mot de passe). Pas de connexion sociale. Page en `noindex`.

**Paiement.** Logo PayPal en pied de page (ne prouve pas que PayPal est actif). Aucun autre moyen observé.

**Réseaux/contact/newsletter.** Instagram et Facebook (pas de TikTok ni Snapchat observés). E-mail de contact : popikids@gmail.com. Pas de formulaire newsletter observé ; un formulaire e-mail pour commandes en gros (B2B).

**SEO.** robots.txt : bloque `wp-admin` (sauf admin-ajax), `add-to-cart`, logs WooCommerce ; déclare le sitemap. Textes alternatifs des images : vides ou noms de fichiers (« WhatsApp Image 2026-09-07… »).

**Médias.** Logo : `/wp-content/uploads/2026/08/image-6-1.png`. Photos produits : fichiers issus de WhatsApp. **Aucun visuel lifestyle, hero, bannière ou catégorie n'existe sur le site actuel** : les photos des maquettes n'en proviennent pas.

## À conserver

- Domaine, URLs produit `/product/{slug}` (140 produits) et `/shop`.
- Données WooCommerce (produits, commandes, clients) si WooCommerce est confirmé.
- E-mail de contact, politique de retour 30 jours (après validation), pack de rentrée / offre 4e offert (à décider).

## À moderniser

Identité visuelle, accueil, navigation (mega-menu, recherche), filtres/tri du catalogue, fiche produit, panier latéral, mobile (navigation inférieure), textes alternatifs, sitemap (retirer la liste des auteurs), pages légales.

## Problèmes constatés

1. Deux seuils de livraison gratuite contradictoires (100 € / 49 €).
2. Pas de filtres ni de tri sur la boutique.
3. Textes alternatifs absents ou non descriptifs.
4. Pages légales et newsletter non retrouvées dans le contenu analysé (à confirmer).
5. Sitemap exposant la liste des auteurs ; page `sample-page` publiée dans le sitemap.

## Points à vérifier (non qualifiés de défauts)

Prix très bas (AZOR 1,00 €, BABY 4,06 €) et noms de produits de type référence fournisseur : cohérents ou non, seul le client peut le dire.

## Dépendances techniques (observées ou probables)

WordPress, Elementor, WooCommerce (probable), PayPal (logo), Google Fonts, hébergeur inconnu, messagerie Gmail.

## Risques de migration

- Perte de référencement si `/product/{slug}` change : conservé tel quel dans la refonte ; `/product-category/*` redirigé vers `/collections/*` (mapping à valider).
- Catégories Filles/Garçons inexistantes : nécessite un attribut ou une taxonomie.
- Moteur : conserver WooCommerce en headless évite toute migration de commandes/clients ; passer à Medusa impose migration et nouvel hébergement.
- Variantes/stocks inconnus : à inventorier avant tout import.
- Données personnelles clients : aucune importation sans accord du client et base légale RGPD.

## Informations à valider avec le client

1. Moteur cible : WooCommerce headless ou Medusa ? Accès administrateur WordPress ?
2. Seuil de livraison gratuite (49 € ou 100 €) et libellés de réassurance.
3. Comptes officiels TikTok, Snapchat, Instagram, Facebook.
4. Photos : logo vectoriel, hero, bannières, catégories, produits (droits d'utilisation).
5. Liste réelle des catégories ; création Filles/Garçons.
6. Textes légaux (CGV, confidentialité, mentions), engagements de marque.
7. Moyens de paiement actifs (PayPal, cartes, Apple/Google Pay).
8. Prix atypiques du catalogue, guide des tailles (mesures).
9. Avis clients authentiques : source ?
