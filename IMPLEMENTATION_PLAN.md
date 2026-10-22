# IMPLEMENTATION PLAN

Légende : ✅ fait et vérifié · 🟡 interface prête, données/logique à brancher · ⬜ à faire.

## Phase 1 — Frontend (cette livraison)

| Élément | État | Remarque |
|---|---|---|
| Audit, documents | ✅ | limites listées dans l'audit |
| Design tokens, 2 thèmes, sélecteur démo | ✅ | |
| Header, mega-menu, menu mobile, nav inférieure | ✅ | liens sociaux masqués faute d'URLs officielles |
| Homepage (hero, réassurance, best-sellers, bannières, catégories, nouveautés, engagements, avis, footer) | ✅ | visuels = placeholders ; avis/engagements : état vide |
| Catalogue : filtres taille/couleur/prix/stock, tri, pagination, URL | ✅ | tri « popularité » = ordre par défaut tant qu'aucune vente réelle |
| Fiche produit : galerie, variantes liées au stock, quantité, favoris, panier, achat direct | ✅ | zoom produit ⬜ (photos requises) ; guide des tailles : contenu à fournir |
| Panier latéral + page panier | ✅ | codes promo et livraison : 🟡 moteur requis |
| Compte client | 🟡 | structure seule, pas d'authentification |
| Admin | 🟡 | tableau de bord en état vide ; fermé en production |
| SEO : metadata, JSON-LD, sitemap, robots, redirections | ✅ | mapping des catégories à valider |
| Tests : 7 unitaires (Vitest), 6 e2e desktop+mobile (Playwright) | ✅ | |
| Animations | ✅ | GSAP non utilisé |
| Mesure LCP/INP/CLS, axe-core, contrôle des contrastes | ⬜ | à faire avec les vraies photos |

## Phase 2 — Après validation de la direction artistique ET du moteur

1. Choix du moteur (voir ARCHITECTURE.md), accès administrateur.
2. Implémenter `src/lib/commerce.ts` sur le moteur (produits, variantes, stocks, catégories, popularité).
3. Panier serveur, codes promo, frais de livraison.
4. Authentification client, récupération de mot de passe, adresses, commandes, favoris.
5. Stripe : carte, Apple/Google Pay, invité, webhooks signés, idempotence, échecs.
6. E-mails transactionnels (Resend), newsletter.
7. Administration : fonctions natives du moteur ; édition du hero/bannières/liens via CMS ou API sécurisée.
8. Migration des produits (et, si accord, clients/commandes), puis redirections définitives.
9. RGPD : consentement cookies, confidentialité, CGV ; PostHog après consentement.
10. Audit performance/accessibilité WCAG 2.2 AA, recette, mise en production **sur autorisation**.
