<div align="center">

<img src="public/logo.png" width="72" height="72" alt="Aurora Home" />

# aurora-home-marketing

**Site marketing et boutique en ligne Aurora One**

Nuxt 4 · TypeScript strict · Tailwind CSS v4 · SQLite · Stripe

<br/>

[![Nuxt](https://img.shields.io/badge/Nuxt_4-00DC82?style=for-the-badge&logo=nuxtdotjs&logoColor=white)](https://nuxt.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Stripe](https://img.shields.io/badge/Stripe-635BFF?style=for-the-badge&logo=stripe&logoColor=white)](https://stripe.com)
[![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)](https://sqlite.org)

</div>

---

## Vue d'ensemble

Site vitrine et e-commerce du produit Aurora One. Il permet de découvrir le boîtier, visualiser le modèle 3D interactif avec réalité augmentée, et passer commande via Stripe. Un backoffice intégré permet de suivre les commandes et gérer les stocks en temps réel.

---

## Stack

| Couche | Technologie |
|--------|-------------|
| Framework | Nuxt 4 (monorepo — frontend + backend dans un seul projet) |
| Langage | TypeScript strict (`noImplicitAny`, `strictNullChecks`) |
| Style | Tailwind CSS v4 via `@tailwindcss/vite` |
| État | Pinia avec persistence localStorage SSR-safe |
| Base de données | SQLite via `better-sqlite3` (WAL mode, transactions atomiques) |
| Paiement | Stripe (PaymentIntent côté serveur) |
| 3D | Three.js — OBJLoader, OrbitControls, skybox, annotations de dimensions |
| AR | `<model-viewer>` via GLTFExporter — WebXR + Quick Look (iOS) |

---

## Pages

- **`/`** — Landing page avec hero parallaxe et cartes capteurs
- **`/product`** — Fiche produit avec visionneuse 3D interactive et galerie
- **`/cart`** — Tunnel d'achat en 4 étapes (panier → livraison → adresse → paiement)
- **`/confirmation`** — Confirmation de commande post-paiement
- **`/admin`** — Dashboard backoffice (commandes, stocks, graphiques)
- **`/about`** — Présentation du projet
- **`/docs`** — Redirection vers la documentation externe

---

## API

| Méthode | Route | Description |
|---------|-------|-------------|
| `GET` | `/api/products` | Liste des produits et stocks |
| `PUT` | `/api/products/:id` | Mise à jour du stock |
| `GET` | `/api/orders` | Liste des commandes |
| `POST` | `/api/orders/confirm` | Confirmation et décrément de stock atomique |
| `POST` | `/api/payments/create-intent` | Création d'un PaymentIntent Stripe |

---

## Lancer le projet

```bash
npm install
```

Créer un fichier `.env` à la racine :

```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
```

```bash
npm run dev      # développement
npm run build    # production
npm run preview  # prévisualisation du build
```

---

## Qualité

- ESLint (flat config, `@nuxt/eslint`) avec `no-explicit-any: error`
- Husky + lint-staged : vérification automatique au commit sur `*.vue` et `*.ts`

---

<div align="center">

Epitech Rennes · Promo 2026

</div>
