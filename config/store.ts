/**
 * Branding & store configuration — edit this file to rebrand.
 */

export const store = {
  storeName: "France Mobilier",
  storeTagline: "Des meubles et solutions de rangement pour gagner en confort et en espace.",
  tagline: "Des meubles et solutions de rangement pour gagner en confort et en espace.",
  domain: "https://francemobilier.com",
  supportEmail: "contact@francemobilier.com",
  /** Horaires affichés publiquement (bandeau, contact). */
  supportHoursShort: "lun–ven 10h–22h",
  supportHours: "Du lundi au vendredi, de 10h à 22h",
  /** Prénom public du fondateur (notes signées). Raison sociale : DPSP. */
  founderFirstName: "Hugo",
  founderRole: "Fondateur",
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
    description: "Des essentiels pensés pour le quotidien.",
    categories: ["maison", "cuisine", "salle-de-bain"] as const,
  },
  {
    slug: "rangement",
    name: "Rangement",
    description: "Optimisez chaque mètre carré.",
    categories: ["rangement", "cuisine", "salle-de-bain"] as const,
  },
  {
    slug: "bureau",
    name: "Bureau",
    description: "Travaillez mieux chez vous.",
    categories: ["bureau"] as const,
  },
  {
    slug: "animaux",
    name: "Animaux",
    description: "Du pratique sans sacrifier votre intérieur.",
    categories: ["animaux"] as const,
  },
] as const;
