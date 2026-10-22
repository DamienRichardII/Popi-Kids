# DESIGN SYSTEM

## Thèmes (un seul code, deux palettes)

Tokens CSS dans `src/app/globals.css`, activés par `data-theme` sur `<html>`. Les composants n'utilisent que les tokens (`bg-bg`, `text-fg`, `border-line`, `bg-primary`…).

| Token | Ivory Luxury (B) | Midnight Gold (A) |
|---|---|---|
| `--bg` | #FAF8F4 | #06172B |
| `--surface` | #FFFFFF | #0B2038 |
| `--surface-2` | #F1E9DC | #0B2038 |
| `--fg` | #10233F | #FFFFFF |
| `--accent` | #C6A36C | #D7AD70 |
| `--accent-strong` (texte or) | #A8854D | #EBCB91 |
| `--primary` / `--primary-fg` | #10233F / #FFF | #D7AD70 / #06172B |

Palettes ajustées d'après les maquettes : bouton principal marine en Ivory, or en Midnight ; bouton secondaire en contour. Le bouton « Mode nuit / Mode jour » du header bascule entre les deux thèmes (choix mémorisé dans le navigateur). Il est visible par défaut ; `NEXT_PUBLIC_THEME_SWITCHER=false` le masque.

## Typographie

Titres : Cormorant Garamond (400–600). Interface : Inter. Chargées via `next/font` (auto-hébergées, `display: swap`). Logo : wordmark typographique (remplaçable par `public/assets/logo.svg`).

## Composants clés (analyse des maquettes)

- Bandeau supérieur discret + header à 8 entrées, recherche, compte, panier avec compteur ; mega-menu au survol/focus ; mobile : hamburger, logo centré.
- Hero plein format (texte superposé desktop, CTA sous l'image sur mobile), 2 CTA, flèches et points.
- Réassurance 4 colonnes (2×2 mobile), cartes produit 5 colonnes desktop (2 mobile), bannières éditoriales 2 colonnes, catégories circulaires (défilement horizontal mobile).
- Navigation inférieure 4 entrées (mobile), safe areas iOS, panier latéral, compte en liste, admin avec barre latérale.

## Éléments des maquettes volontairement non reproduits

Étoiles/notes (128 avis, etc.), chiffres du dashboard (4 258 €, 156 commandes…), prix et noms d'exemple, avatar « Emma D. » : exemples graphiques, pas des données réelles. Les avis et statistiques s'affichent uniquement à partir de données réelles ; sinon état vide. L'entrée « Mes moyens de paiement » de la maquette n'est pas reprise (Stripe ne stocke pas de carte côté site sans décision explicite).

## Mouvement

Apparition CSS, hover produit (zoom 4 %), tiroir du panier (Motion), tap sur favori, skeletons, crossfade du hero. `prefers-reduced-motion` désactive animations et carrousel automatique.

## Assets : mapping

Voir `src/lib/assets.ts`. Déposer dans `public/assets/` :

| Fichier | Usage |
|---|---|
| `logo.svg` | header, footer, admin |
| `hero-1.jpg`, `hero-2.jpg`, `hero-3.jpg` | hero |
| `banner-nouvelle-collection.jpg`, `banner-looks-saison.jpg` | bannières |
| `carte-cadeau-1.jpg`, `carte-cadeau-2.jpg` (fournis) | page /carte-cadeau, accueil |
| `cat-bebes.jpg`, `cat-filles.jpg`, `cat-garcons.jpg`, `cat-tshirts-polos.jpg`, `cat-sweats-gilets.jpg`, `cat-vestes-manteaux.jpg`, `cat-jeux.jpg`, `cat-accessoires.jpg` | catégories circulaires |
| `prod-{slug}-{n}.jpg` | photos produit (clé `images` du produit) |

Fichier absent = placeholder « Visuel à fournir ». État actuel : seuls les visuels de la carte cadeau sont fournis (redimensionnés en JPG). Le projet lit uniquement `public/assets/`, pas le dossier `assets/` à la racine (réservé aux maquettes et originaux).
