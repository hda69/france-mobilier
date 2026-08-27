/**
 * Branding & store configuration — edit this file to rebrand.
 * Missing legal fields are marked TODO_LEGAL_CONFIG.
 */

export const store = {
  storeName: "Maisonora",
  storeTagline: "Des solutions pratiques pour un intérieur mieux pensé.",
  tagline: "Des solutions pratiques pour un intérieur mieux pensé.",
  domain: "https://maisonora.fr",
  supportEmail: "contact@maisonora.fr",
  country: "FR",
  currency: "EUR",
  locale: "fr-FR",
  /** TODO_LEGAL_CONFIG */
  companyName: "Maisonora",
  /** TODO_LEGAL_CONFIG */
  companyLegalForm: "",
  /** TODO_LEGAL_CONFIG */
  companyAddress: "",
  /** TODO_LEGAL_CONFIG */
  companyCity: "",
  /** TODO_LEGAL_CONFIG */
  companyPostalCode: "",
  companyCountry: "France",
  /** TODO_LEGAL_CONFIG */
  companyRegistration: "",
  /** TODO_LEGAL_CONFIG */
  vatNumber: "",
  /** TODO_LEGAL_CONFIG */
  phone: "",
  /** TODO_LEGAL_CONFIG */
  returnAddress: "RETURN_ADDRESS_TODO",
  socials: {
    instagram: "",
    facebook: "",
    pinterest: "",
  },
} as const;

export const navigation = [
  { href: "/", label: "Accueil" },
  { href: "/nouveautes", label: "Nouveautés" },
  { href: "/collections/rangement", label: "Rangement" },
  { href: "/collections/bureau", label: "Bureau" },
  { href: "/collections/maison", label: "Maison" },
  { href: "/contact", label: "Contact" },
] as const;

export const collections = [
  {
    slug: "maison",
    name: "Maison",
    description: "Équipements utiles pour un quotidien plus fluide à la maison.",
    categories: ["maison", "cuisine", "salle-de-bain"] as const,
  },
  {
    slug: "rangement",
    name: "Rangement",
    description: "Solutions d’organisation pour optimiser l’espace.",
    categories: ["rangement", "cuisine", "salle-de-bain"] as const,
  },
  {
    slug: "bureau",
    name: "Bureau",
    description: "Confort et ergonomie pour travailler chez soi.",
    categories: ["bureau"] as const,
  },
  {
    slug: "animaux",
    name: "Animaux",
    description: "Accessoires discrets et pratiques pour la maison avec animaux.",
    categories: ["animaux"] as const,
  },
] as const;
