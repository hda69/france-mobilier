# France Mobilier

MVP e-commerce de **pré-lancement** (Home & Garden, France).  
Boutique crédible pour présentation partenaires / BuckyDrop OpenAPI, puis base Google Shopping.

## Stack

- Next.js App Router + TypeScript + Tailwind CSS
- Panier client (localStorage)
- Stripe / BuckyDrop / Merchant Center préparés mais **désactivés**

## Installation

```bash
npm install
cp .env.example .env.local
npm run dev
```

Ouvrir http://localhost:3000

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run typecheck
```

## Branding

Modifier uniquement `config/store.ts` (nom, email, adresse légale, etc.).

## Produits

Modifier `data/products.ts`.  
Tous les produits de démo sont `availabilityStatus: "coming_soon"`.

## Feature flags

| Variable | Défaut | Rôle |
|---|---|---|
| `STORE_CHECKOUT_ENABLED` | `false` | Autorise un futur checkout |
| `BUCKYDROP_ENABLED` | `false` | Active le provider BuckyDrop |
| `GOOGLE_MERCHANT_FEED_ENABLED` | `false` | Active le feed Merchant |

Aucune clé secrète ne doit être commitée.

## Activation future

### Stripe
1. Renseigner `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`
2. Passer `STORE_CHECKOUT_ENABLED=true`
3. Brancher `createPaymentIntent` dans `src/lib/payments/stripe.ts`

### BuckyDrop
1. Obtenir la doc OpenAPI officielle
2. Renseigner `BUCKYDROP_API_BASE_URL`, `BUCKYDROP_APP_CODE`, `BUCKYDROP_APP_SECRET`
3. Implémenter le client HTTP (aujourd’hui : `NOT_CONFIGURED`)
4. `BUCKYDROP_ENABLED=true`

### Google Merchant Center
1. Produits réellement `available` + prix/stock honnêtes
2. `GOOGLE_MERCHANT_FEED_ENABLED=true`
3. Le feed XML est servi par `/api/google-merchant-feed` (uniquement les produits vendables)

## Déploiement

Compatible Vercel ou Railway :

```bash
npm run build
npm run start
```

Définir les variables d’environnement sur la plateforme d’hébergement.

## Pages utiles

- `/` boutique
- `/platform` présentation technique partenaire
- `/admin` statuts d’intégration (noindex)
- `/legal` `/privacy` `/terms` `/returns` `/shipping`
