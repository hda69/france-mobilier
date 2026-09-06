# Merchant readiness — France Mobilier

Généré le 7 septembre 2026. Contrôles internes uniquement. **Pas une garantie d’approbation Google.**

Statut global : **BLOCKER** — le site n’est pas `merchantReady`.

---

## GLOBAL

**BLOCKER**

Checkout live déjà ouvert en production. Le diagnostic local peut encore afficher checkout fermé s’il lit `.env.local`.

Feed : `/feeds/google-merchant.xml` — **non publié** (503) tant que les blockers globaux restent ouverts et qu’aucun produit n’a de délais handling/transit séparés.

Cible feed prévue : **FR / EUR / fr**.

---

## BUSINESS

| Contrôle | Niveau | Détail |
|---|---|---|
| Enseigne / DPSP | PASS | France Mobilier est une boutique en ligne exploitée par DPSP. |
| SIREN / SIRET | PASS | 882 131 071 / 882 131 071 00038 |
| E-mail | PASS | contact@francemobilier.com |
| Adresse rue | **BLOCKER** `BUSINESS_STREET_ADDRESS_MISSING` | Seulement 69004 Lyon aujourd’hui |
| Téléphone | **BLOCKER** `BUSINESS_PHONE_MISSING` | Non renseigné |
| TVA | WARNING | Non renseignée — à confirmer si non assujetti |

---

## SHIPPING

| Contrôle | Niveau | Détail |
|---|---|---|
| Zone site | PASS | FR, BE, LU, MC, CH — 0 € |
| Cible Merchant | PASS | FR uniquement pour le premier lancement |
| Délais structurés | WARNING / BLOCKER produit | Délai global « à partir de 14 jours » connu, pas de split préparation / acheminement |

---

## RETURNS

| Contrôle | Niveau | Détail |
|---|---|---|
| Rétractation 14 jours | PASS | Droit français déjà annoncé |
| Procédure | PASS | E-mail + instructions avant expédition |
| Remboursement | PASS | 1–14 jours après réception du retour (délai légal) |
| Frais de retour | **BLOCKER** `RETURN_COST_POLICY_MISSING` | `RETURN_SHIPPING_PAID_BY` non défini |
| Adresse de retour | WARNING | Organisée après contact |

---

## CHECKOUT

Production : Stripe **live**, webhook `checkout.session.completed` actif.

Parcours : produit → panier → checkout → Stripe, sans compte obligatoire. Prix TTC, livraison 0 € affichée.

---

## PRODUCTS

7 produits vendables. **0 merchant-ready.**

Tous ont le même BLOCKER produit : `HANDLING_MAX_MISSING` (14 j global, pas de handling/transit).

| Produit | Offres | Autres signaux |
|---|---|---|
| table-de-chevet | 1 | WARNING images fournisseur ; pas de GTIN/MPN/marque |
| table-a-manger-extensible | 4 | Variantes prêtes (item_group_id + `?variant=`) ; pas d’identifiants fabricant |
| table-basse-metal | 8 | identifier_exists=no |
| meuble-tv | 9 | identifier_exists=no |
| meuble-entree | 9 | identifier_exists=no |
| coiffeuse-enfant | 2 | identifier_exists=no |
| meuble-casiers | 18 | identifier_exists=no |

Promotions : **retirées** de l’affichage public et du feed (pas d’historique 30 jours).

Coming soon : **masqués** des collections publiques. Schema = `OutOfStock`, jamais `preorder` / `in_stock`.

Marque : **France Mobilier n’est plus envoyée comme brand**.

---

## FEED

URL : `https://francemobilier.com/feeds/google-merchant.xml`

Aujourd’hui : 503 jusqu’à résolution des blockers + `GOOGLE_MERCHANT_FEED_ENABLED=true`.

Attributs prévus par offre : id, item_group_id, title/structured_title (IA), description/structured_description (IA), link, image, availability, price (sans sale_price), condition=new, product_type, google_product_category, shipping FR 0 EUR, identifier_exists.

---

## À FOURNIR PAR LE PROPRIÉTAIRE

- [ ] Adresse légale complète → `BUSINESS_STREET_ADDRESS` (Railway production)
- [ ] Téléphone professionnel → `BUSINESS_PHONE`
- [ ] Qui paie le retour → `RETURN_SHIPPING_PAID_BY=customer` ou `seller`
- [ ] Adresse de retour fixe si elle existe → `RETURN_ADDRESS`
- [ ] TVA si assujetti
- [ ] Délais réels par produit : `handlingMin/MaxBusinessDays` + `transitMin/MaxBusinessDays`
- [ ] GTIN / MPN / marque fabricant s’ils existent (ne rien inventer)
- [ ] Médiateur de la consommation (nom à publier dans les CGV)
- [ ] Google Business Profile si éligible
- [ ] Identité Merchant Center + téléphone / adresse / domaine vérifiés
- [ ] `GOOGLE_MERCHANT_FEED_ENABLED=true` seulement après les blockers globaux

---

## CHECKLIST HUMAINE GOOGLE

- [ ] Google Business Profile créé/vérifié si éligible
- [ ] Merchant Center business identity complétée
- [ ] Téléphone vérifié
- [ ] Adresse vérifiée
- [ ] Domaine francemobilier.com revendiqué/vérifié
