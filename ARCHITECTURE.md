# ARCHITECTURE

## Principe

Frontend headless Next.js 16 (App Router) découplé du moteur e-commerce. Le moteur **n'est pas choisi** : le frontend ne parle qu'à `src/lib/commerce.ts` (5 fonctions). Brancher WooCommerce ou Medusa = réimplémenter ce fichier, sans toucher aux pages.

## Stack réellement installée (versions stables)

Next.js 16.4, React 19, TypeScript strict (`noUncheckedIndexedAccess`), Tailwind CSS 4 (tokens CSS), Motion, Vitest, Playwright, lucide-react. **Non installés à ce stade** (dépendent du moteur) : shadcn/ui, GSAP (aucune animation éditoriale complexe nécessaire), Medusa, Stripe, Resend, PostHog, Redis, S3.

## Structure

```
src/app/(site)/   pages publiques : /, /shop, /collections/[slug], /product/[slug], /panier, /checkout, /compte, /contact-us, /legal/[slug]
src/app/admin/    interface admin (fermée en production)
src/components/   Header, Hero, ProductCard, CatalogView, CartDrawer, MobileTabBar, Visual…
src/lib/          commerce.ts (couche données), assets.ts (mapping assets), site.ts (marque), types.ts
```

## Choix

- **Server Components** par défaut ; client uniquement pour panier, header, carrousel, carte produit, achat.
- **Filtres du catalogue** : formulaire GET → l'URL est la source de vérité (partageable, fonctionne sans JavaScript).
- **Panier** : état client en localStorage (provisoire). Avec le moteur : panier serveur (cart Medusa / Store API WooCommerce) pour garantir stocks et prix.
- **Stocks** : le bouton d'achat est bloqué pour les tailles à stock 0 ; la vérification définitive doit se faire côté serveur au paiement.
- **Images** : composant `Visual` lit `public/assets/` côté serveur ; absent → placeholder identifiable. `next/image` (AVIF/WebP).
- **SEO** : métadonnées, canonicals, JSON-LD Product + BreadcrumbList, `sitemap.ts`, `robots.ts`, redirections `next.config.ts`.

## Options de moteur

| | WooCommerce headless | Medusa v2 |
|---|---|---|
| Données existantes | conservées | migration produits/clients/commandes |
| Hébergement | WordPress actuel | Node + PostgreSQL (+ Redis) dédiés |
| Back-office | WooCommerce natif | Medusa Admin |
| Risque | performances/sécurité WordPress | coût de migration et d'exploitation |

Recommandation : si WooCommerce est confirmé, le conserver (aucun second système de commandes/stocks/paiements).

## Sécurité (à appliquer à la phase 2)

Clés Stripe et secrets côté serveur uniquement ; webhooks Stripe vérifiés par signature ; clé d'idempotence contre les commandes dupliquées ; validation serveur de chaque entrée ; routes admin sous authentification + rôles ; aucun numéro de carte stocké (Stripe Elements). Aujourd'hui : `/admin` renvoie 404 en production, `/api/newsletter` renvoie 501 sans rien stocker.
