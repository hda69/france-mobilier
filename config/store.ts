/**
 * Branding & store configuration — edit this file to rebrand.
 */

export const store = {
  storeName: "France Mobilier",
  storeTagline: "Mobilier et rangement pour un intérieur mieux pensé.",
  tagline: "Mobilier et rangement pour un intérieur mieux pensé.",
  domain: "https://francemobilier.com",
  supportEmail: "contact@francemobilier.com",
  country: "FR",
  currency: "EUR",
  locale: "fr-FR",
  logoPath: "/logo-france-mobilier.png",
  /** Raison sociale affichée : DPSP. */
  companyName: "DPSP",
  companyLegalForm: "Entrepreneur individuel",
  companyTradeName: "DPSP",
  /** Rue non diffusible INSEE (statut P) — ville confirmée : Lyon 4e. */
  companyAddress: "",
  companyCity: "Lyon",
  companyPostalCode: "69004",
  companyCountry: "France",
  companySiren: "882 131 071",
  companySiret: "882 131 071 00038",
  companyRegistration: "SIREN 882 131 071 — SIRET 882 131 071 00038",
  companyNaf: "47.91B — Vente à distance sur catalogue spécialisé",
  vatNumber: "",
  phone: "",
  returnAddress: "",
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
  { href: "/collections/animaux", label: "Animaux" },
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
