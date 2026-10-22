# DEPLOYMENT

Aucun déploiement n'a été effectué. Ne rien mettre en production sans autorisation.

## Local

```bash
npm install
cp .env.example .env.local
npm run dev          # http://localhost:3000
npm run typecheck && npm test && npm run build
CHROMIUM_PATH=<chemin chrome, optionnel> npm run test:e2e
```

## Aperçu client (Vercel)

- Importer le dépôt GitHub dans Vercel (framework Next.js détecté).
- Variables : `NEXT_PUBLIC_SITE_URL` (URL de l'aperçu), le bouton mode nuit est visible par défaut.
- L'admin est fermé (404) en production ; `ADMIN_PREVIEW=true` ouvre l'interface vide, uniquement sur un aperçu protégé par mot de passe Vercel.
- Ne pas associer le domaine `popikids.com` : il pointe sur le site WordPress actuel.

## Production (phase 2, après validation)

1. Moteur e-commerce déployé et sauvegardé (WooCommerce existant ou Medusa : Node + PostgreSQL + Redis).
2. Variables serveur : `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `RESEND_API_KEY` (jamais préfixées `NEXT_PUBLIC_`). `NEXT_PUBLIC_THEME_SWITCHER=false` uniquement si le client veut un seul thème.
3. Stripe : créer le endpoint webhook `/api/stripe/webhook`, activer cartes, Apple Pay (vérification du domaine) et Google Pay, mode test avant le mode live.
4. Redirections : vérifier le mapping (`next.config.ts`) contre la liste des 140 produits et des catégories.
5. Bascule DNS prévue, sauvegarde et plan de retour arrière (garder WordPress joignable), puis soumettre le sitemap à Google Search Console.
