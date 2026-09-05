import type { Product, ProductVariant } from "@/lib/types/commerce";

function metalCoffeeTableVariants(): ProductVariant[] {
  const sizes = [
    { sizeCm: 25, price: 109, compareAtPrice: 139, weightKg: 2.7 },
    { sizeCm: 30, price: 119, compareAtPrice: 149, weightKg: 3.2 },
    { sizeCm: 35, price: 129, compareAtPrice: 159, weightKg: 4.0 },
    { sizeCm: 40, price: 139, compareAtPrice: 169, weightKg: 4.8 },
  ] as const;
  const skus = {
    argent: {
      25: "6254584230634",
      30: "6254584230640",
      35: "6254584230646",
      40: "6254584230652",
    },
    noir: {
      25: "6254584230635",
      30: "6254584230641",
      35: "6254584230647",
      40: "6254584230653",
    },
  } as const;
  const colors = [
    {
      color: "argent" as const,
      colorLabel: "Argenté",
      swatchClass: "bg-[#c5c8cc] ring-1 ring-black/10",
      image: "/products/coffee-table-metal-4.jpg",
    },
    {
      color: "noir" as const,
      colorLabel: "Noir",
      swatchClass: "bg-[#1a1a1a]",
      image: "/products/coffee-table-metal-3.jpg",
    },
  ];
  return colors.flatMap(({ color, colorLabel, swatchClass, image }) =>
    sizes.map((size) => ({
      id: `p-012-${color}-${size.sizeCm}`,
      color,
      colorLabel,
      swatchClass,
      sizeCm: size.sizeCm,
      sizeLabel: `${size.sizeCm} × ${size.sizeCm} × ${size.sizeCm} cm`,
      price: size.price,
      compareAtPrice: size.compareAtPrice,
      weightKg: size.weightKg,
      supplierVariantId: skus[color][size.sizeCm],
      image,
    })),
  );
}

function tvStandVariants(): ProductVariant[] {
  const sizes = [
    { sizeCm: 160, price: 249, compareAtPrice: 299 },
    { sizeCm: 200, price: 289, compareAtPrice: 349 },
    { sizeCm: 240, price: 329, compareAtPrice: 399 },
  ] as const;
  const skus = {
    noyer: { 160: "6283791890961", 200: "6283791890962", 240: "6283791890963" },
    "noyer-noir": { 160: "6283791890967", 200: "6283791890968", 240: "6283791890969" },
    naturel: { 160: "6283791890952", 200: "6283791890953", 240: "6283791890954" },
  } as const;
  const colors = [
    {
      color: "noyer" as const,
      colorLabel: "Noyer",
      swatchClass: "bg-[#6b4226]",
      image: "/products/tv-stand-2.jpg",
    },
    {
      color: "noyer-noir" as const,
      colorLabel: "Noyer et noir",
      swatchClass: "bg-[#2a211c]",
      image: "/products/tv-stand-3.jpg",
    },
    {
      color: "naturel" as const,
      colorLabel: "Bois naturel",
      swatchClass: "bg-[#e8dcc8] ring-1 ring-black/10",
      image: "/products/tv-stand-4.jpg",
    },
  ];
  return colors.flatMap(({ color, colorLabel, swatchClass, image }) =>
    sizes.map((size) => ({
      id: `p-013-${color}-${size.sizeCm}`,
      color,
      colorLabel,
      swatchClass,
      sizeCm: size.sizeCm,
      sizeLabel: `${size.sizeCm} × 24 × 24 cm`,
      price: size.price,
      compareAtPrice: size.compareAtPrice,
      supplierVariantId: skus[color][size.sizeCm],
      image,
    })),
  );
}

function kidsVanityVariants(): ProductVariant[] {
  return [
    {
      id: "p-016-naturel-coiffeuse",
      color: "naturel",
      colorLabel: "Bois naturel",
      swatchClass: "bg-[#e8dcc8] ring-1 ring-black/10",
      sizeCm: 49,
      sizeLabel: "Coiffeuse",
      price: 159,
      compareAtPrice: 199,
      weightKg: 10,
      supplierVariantId: "6053271111924",
    },
    {
      id: "p-016-naturel-ensemble",
      color: "naturel",
      colorLabel: "Bois naturel",
      swatchClass: "bg-[#e8dcc8] ring-1 ring-black/10",
      sizeCm: 75,
      sizeLabel: "Coiffeuse + tabouret",
      price: 199,
      compareAtPrice: 249,
      weightKg: 13,
      supplierVariantId: "6053271111925",
      image: "/products/kids-vanity.jpg",
    },
  ];
}

function entryCabinetVariants(): ProductVariant[] {
  const sizes = [
    { sizeCm: 60, price: 199, compareAtPrice: 249 },
    { sizeCm: 80, price: 239, compareAtPrice: 289 },
    { sizeCm: 100, price: 279, compareAtPrice: 339 },
  ] as const;
  const skus = {
    cerisier: { 60: "5090427646704", 80: "4588157958666", 100: "4588157958668" },
    noyer: { 60: "5090427646703", 80: "4588157958667", 100: "4588157958669" },
    naturel: { 60: "5090427646702", 80: "5090427646700", 100: "5090427646701" },
  } as const;
  const colors = [
    {
      color: "cerisier" as const,
      colorLabel: "Cerisier",
      swatchClass: "bg-[#c4784a]",
      image: "/products/shoe-bench-2.jpg",
    },
    {
      color: "noyer" as const,
      colorLabel: "Noyer",
      swatchClass: "bg-[#3d2a1c]",
      image: "/products/shoe-bench-4.jpg",
    },
    {
      color: "naturel" as const,
      colorLabel: "Bois naturel",
      swatchClass: "bg-[#e8dcc8] ring-1 ring-black/10",
      image: "/products/shoe-bench-5.jpg",
    },
  ];
  return colors.flatMap(({ color, colorLabel, swatchClass, image }) =>
    sizes.map((size) => ({
      id: `p-015-${color}-${size.sizeCm}`,
      color,
      colorLabel,
      swatchClass,
      sizeCm: size.sizeCm,
      sizeLabel: `${size.sizeCm} × 45 cm`,
      price: size.price,
      compareAtPrice: size.compareAtPrice,
      supplierVariantId: skus[color][size.sizeCm],
      image,
    })),
  );
}

function diningTableVariants(): ProductVariant[] {
  const sizes = [
    { sizeCm: 93, extendedCm: 131, price: 449, compareAtPrice: 549 },
    { sizeCm: 105, extendedCm: 150, price: 529, compareAtPrice: 649 },
  ] as const;
  const skus = {
    bicolore: { 93: "6071092596093", 105: "6071092596094" },
    noir: { 93: "6071092596096", 105: "6071092596097" },
  } as const;
  const colors = [
    {
      color: "bicolore" as const,
      colorLabel: "Bois et noir",
      swatchClass: "bg-[#5c3d28]",
      image: "/products/dining-table.jpg",
    },
    {
      color: "noir" as const,
      colorLabel: "Noir",
      swatchClass: "bg-[#1a1a1a]",
      image: "/products/dining-table-3.jpg",
    },
  ];
  return colors.flatMap(({ color, colorLabel, swatchClass, image }) =>
    sizes.map((size) => ({
      id: `p-014-${color}-${size.sizeCm}`,
      color,
      colorLabel,
      swatchClass,
      sizeCm: size.sizeCm,
      sizeLabel: `${size.sizeCm} → ${size.extendedCm} cm`,
      price: size.price,
      compareAtPrice: size.compareAtPrice,
      supplierVariantId: skus[color][size.sizeCm],
      image,
    })),
  );
}

/** Store catalog. */
export const products: Product[] = [
  {
    id: "p-016",
    slug: "coiffeuse-enfant",
    name: "Meuble coiffeuse pour enfant",
    alternateNames: [
      "Coiffeuse enfant",
      "Coiffeuse pour enfant",
      "Coiffeuse enfant en bois",
    ],
    category: "maison",
    shortDescription:
      "Petite coiffeuse en bois massif, à hauteur d’enfant : un tiroir, un miroir encadré. Seule, ou avec le tabouret assorti.",
    description:
      "Une coiffeuse à hauteur d’enfant, en bois massif clair. Le miroir est encadré de bois, avec deux oreilles d’ours. Un tiroir sous le plateau. On la choisit seule, ou avec le tabouret rond assorti.",
    price: 199,
    compareAtPrice: 249,
    defaultVariantId: "p-016-naturel-ensemble",
    formatsLabel: "Compositions",
    sizesLabel: "Composition",
    variants: kidsVanityVariants(),
    images: [
      "/products/kids-vanity.jpg",
      "/products/kids-vanity-2.jpg",
      "/products/kids-vanity-3.jpg",
      "/products/kids-vanity-4.jpg",
      "/products/kids-vanity-5.jpg",
    ],
    imageAssets: [
      { src: "/products/kids-vanity.jpg", role: "lifestyle" },
      { src: "/products/kids-vanity-2.jpg", role: "product" },
      { src: "/products/kids-vanity-3.jpg", role: "lifestyle" },
      { src: "/products/kids-vanity-4.jpg", role: "lifestyle" },
      { src: "/products/kids-vanity-5.jpg", role: "lifestyle" },
    ],
    features: [
      "Bois massif, finition naturelle",
      "Miroir encadré, oreilles d’ours",
      "Un tiroir",
      "Coiffeuse seule ou avec tabouret",
      "Fabriquée après commande",
    ],
    benefits: ["À hauteur d’enfant", "Un tiroir", "Miroir encadré", "Tabouret en option"],
    highlights: [
      "Une coiffeuse basse, à la taille d’un enfant",
      "Un miroir encadré de bois, avec deux oreilles d’ours",
      "Un tiroir pour les petits objets",
      "Seule, ou avec le tabouret assorti",
    ],
    dailyUses: [
      {
        title: "Le matin",
        text: "On s’assoit pour se coiffer, le plateau à 51 cm du sol.",
      },
      {
        title: "Dans la chambre",
        text: "49 cm de large, elle se glisse contre un mur, près du lit.",
      },
      {
        title: "Avec le tabouret",
        text: "Le tabouret rond, 26 × 26 cm, se range sous le plateau.",
      },
    ],
    faq: [
      {
        question: "Quelles sont ses dimensions ?",
        answer:
          "Coiffeuse : 49 × 32 × 97 cm (l × p × h, miroir compris). Plateau à 51 cm du sol. Tabouret : 26 × 26 cm.",
      },
      {
        question: "Le tabouret est-il inclus ?",
        answer:
          "Au choix : la coiffeuse seule, ou l’ensemble avec le tabouret assorti. Le tabouret n’est pas vendu séparément.",
      },
      {
        question: "Quelles couleurs sont proposées ?",
        answer: "Une finition : bois naturel.",
      },
    ],
    specifications: {
      Type: "Coiffeuse enfant",
      Largeur: "49 cm",
      Profondeur: "32 cm",
      Hauteur: "97 cm",
      Plateau: "51 cm",
      Tabouret: "26 × 26 cm",
      Matériaux: "Bois massif",
      Finition: "Bois naturel",
      Rangement: "1 tiroir",
      Miroir: "Encadré, oreilles d’ours",
      Compositions: "Coiffeuse, ou coiffeuse + tabouret",
    },
    measures: {
      widthCm: 49,
      depthCm: 32,
      heightCm: 97,
    },
    madeToOrder: true,
    availabilityStatus: "available",
    supplierProvider: "buckydrop",
    supplierProductId: "957431111547",
    supplierVariantId: "6053271111925",
    weight: null,
    dimensions: "49 × 32 × 97 cm (l × p × h) — tabouret 26 × 26 cm",
    shippingMinDays: 14,
    shippingMaxDays: null,
  },
  {
    id: "p-015",
    slug: "meuble-entree",
    name: "Meuble d’entrée / Meuble à chaussures",
    alternateNames: [
      "Meuble d’entrée",
      "Meuble à chaussures",
      "Meuble d’entrée en bois",
      "Banc d’entrée",
    ],
    category: "rangement",
    shortDescription:
      "Meuble d’entrée et meuble à chaussures en pin massif : on s’y asseoit pour changer de paires, on les range derrière les portes coulissantes à lattes.",
    description:
      "Un meuble d’entrée qui sert aussi de meuble à chaussures. On s’y asseoit en rentrant, on range les paires du quotidien derrière deux portes coulissantes à lattes. Pin massif, coins arrondis, trois longueurs et trois finitions.",
    price: 239,
    compareAtPrice: 289,
    defaultVariantId: "p-015-cerisier-80",
    formatsLabel: "Longueurs",
    sizesLabel: "Longueur",
    variants: entryCabinetVariants(),
    images: [
      "/products/shoe-bench.jpg",
      "/products/shoe-bench-2.jpg",
      "/products/shoe-bench-3.jpg",
      "/products/shoe-bench-4.jpg",
      "/products/shoe-bench-5.jpg",
    ],
    imageAssets: [
      { src: "/products/shoe-bench.jpg", role: "lifestyle" },
      { src: "/products/shoe-bench-2.jpg", role: "product" },
      { src: "/products/shoe-bench-3.jpg", role: "lifestyle" },
      { src: "/products/shoe-bench-4.jpg", role: "lifestyle" },
      { src: "/products/shoe-bench-5.jpg", role: "product" },
    ],
    features: [
      "Portes coulissantes à lattes",
      "Pin massif, coins arrondis",
      "Trois longueurs : 60, 80 et 100 cm",
      "Fabriqué après commande",
    ],
    benefits: ["Assise d’entrée", "Rangement à chaussures", "Trois longueurs", "Trois finitions"],
    highlights: [
      "Un meuble bas pour s’asseoir en rentrant, sans encombrer le couloir",
      "Deux portes coulissantes à lattes, pour cacher les chaussures",
      "Une étagère intérieure que l’on règle selon la hauteur des paires",
      "Trois longueurs et trois finitions, du cerisier au noyer",
    ],
    dailyUses: [
      {
        title: "En rentrant",
        text: "On s’assoit pour changer de chaussures, à 45 cm du sol, et on range les paires derrière les portes.",
      },
      {
        title: "Dans un couloir étroit",
        text: "Le format 60 cm se glisse près de la porte ; le 80 ou le 100 cm sert aussi de petit banc d’appoint.",
      },
      {
        title: "Quand les chaussures s’accumulent",
        text: "L’étagère intérieure se déplace, pour des baskets d’un côté et des pantoufles de l’autre.",
      },
    ],
    faq: [
      {
        question: "Quelles sont ses dimensions ?",
        answer:
          "Hauteur 45 cm. Trois longueurs : 60, 80 ou 100 cm. La profondeur n’est pas indiquée par le fabricant.",
      },
      {
        question: "Quelles couleurs sont proposées ?",
        answer: "Trois finitions : cerisier, noyer, ou bois naturel plus clair.",
      },
      {
        question: "Est-ce un meuble d’entrée ou un meuble à chaussures ?",
        answer:
          "Les deux. C’est un meuble bas d’entrée, assez haut pour s’asseoir, et un meuble à chaussures : les paires se rangent derrière les portes coulissantes.",
      },
    ],
    specifications: {
      Type: "Meuble d’entrée / meuble à chaussures",
      Largeur: "80 cm",
      Hauteur: "45 cm",
      Longueurs: "60, 80 ou 100 cm",
      Matériaux: "Pin massif",
      Finitions: "Cerisier, noyer, bois naturel",
      Portes: "2 coulissantes à lattes",
      Intérieur: "Étagère réglable, deux niveaux",
    },
    measures: {
      widthCm: 80,
      heightCm: 45,
    },
    madeToOrder: true,
    availabilityStatus: "available",
    supplierProvider: "buckydrop",
    supplierProductId: "624156933861",
    supplierVariantId: "4588157958666",
    weight: null,
    dimensions: "60, 80 ou 100 × 45 cm (l × h) — schéma du format 80 × 45 cm",
    shippingMinDays: 14,
    shippingMaxDays: null,
  },
  {
    id: "p-014",
    slug: "table-a-manger-extensible",
    name: "Table à manger extensible",
    category: "cuisine",
    shortDescription:
      "Table ronde en bois, à allonger en ovale. Piétement central, deux finitions, deux formats.",
    description:
      "Une table à manger ronde, pensée pour un quotidien à quatre et les repas un peu plus nombreux. Le plateau s’ouvre en ovale, sans changer de piétement. Deux formats, 93 cm ou 105 cm de diamètre, et deux finitions : plateau bois et base noire, ou noir.",
    price: 449,
    compareAtPrice: 549,
    defaultVariantId: "p-014-bicolore-93",
    formatsLabel: "Formats",
    sizesLabel: "Format",
    variants: diningTableVariants(),
    images: [
      "/products/dining-table.jpg",
      "/products/dining-table-2.jpg",
      "/products/dining-table-3.jpg",
      "/products/dining-table-4.jpg",
    ],
    imageAssets: [
      { src: "/products/dining-table.jpg", role: "lifestyle" },
      { src: "/products/dining-table-2.jpg", role: "product" },
      { src: "/products/dining-table-3.jpg", role: "lifestyle" },
      { src: "/products/dining-table-4.jpg", role: "lifestyle" },
    ],
    features: [
      "Plateau rond qui s’allonge en ovale",
      "Piétement central à quatre pieds",
      "Deux formats : 93 → 131 cm et 105 → 150 cm",
      "Fabriquée après commande",
    ],
    benefits: ["Ronde ou ovale", "Deux formats", "Deux finitions", "Fabriquée après commande"],
    highlights: [
      "Une table ronde pour le quotidien, ovale quand il faut plus de places",
      "Un piétement central qui laisse de la place pour les jambes",
      "Deux diamètres pour un appartement ou une salle à manger plus grande",
      "Deux finitions, bois et noir ou noir",
    ],
    dailyUses: [
      {
        title: "Le repas du soir",
        text: "Fermée, la table reste ronde et compacte, pour quatre personnes autour d’un plateau de 93 ou 105 cm.",
      },
      {
        title: "Quand il y a plus de monde",
        text: "Le plateau s’ouvre en ovale, jusqu’à 131 ou 150 cm, pour allonger la table sans en changer.",
      },
      {
        title: "Dans un petit salon",
        text: "Le format 93 cm se place facilement ; le 105 cm convient quand la pièce le permet.",
      },
    ],
    faq: [
      {
        question: "Quelles sont ses dimensions ?",
        answer:
          "Hauteur 75 cm. Deux formats : diamètre 93 cm, allongé 131 cm ; ou diamètre 105 cm, allongé 150 cm. Le schéma représente le format 93 cm, fermé.",
      },
      {
        question: "Quelles couleurs sont proposées ?",
        answer: "Deux finitions : bois et noir, ou noir.",
      },
    ],
    specifications: {
      Type: "Table à manger",
      Forme: "Ronde, ovale une fois allongée",
      Largeur: "93 cm",
      Profondeur: "93 cm",
      Hauteur: "75 cm",
      Formats: "93 → 131 cm, 105 → 150 cm",
      Matériaux: "Bois (frêne)",
      Finitions: "Bois et noir, noir",
      Places: "4 fermée, 4 à 6 allongée",
    },
    measures: {
      widthCm: 93,
      depthCm: 93,
      heightCm: 75,
    },
    madeToOrder: true,
    availabilityStatus: "available",
    supplierProvider: "buckydrop",
    supplierProductId: "1045160359153",
    supplierVariantId: "6071092596093",
    weight: null,
    dimensions: "93 → 131 cm ou 105 → 150 cm × 75 cm (h) — schéma du format 93 cm, fermé",
    shippingMinDays: 14,
    shippingMaxDays: null,
  },
  {
    id: "p-013",
    slug: "meuble-tv",
    name: "Meuble TV en bois",
    category: "maison",
    shortDescription:
      "Meuble TV bas en bois, à poser au sol sous un écran. Quatre compartiments, trois longueurs, trois finitions.",
    description:
      "Un meuble TV bas, pensé pour rester discret sous un écran mural. La façade se compose de deux tiroirs aux extrémités et de deux portes abattantes au centre, sans poignée apparente. Trois longueurs, de 160 à 240 cm, et trois finitions.",
    price: 289,
    compareAtPrice: 349,
    defaultVariantId: "p-013-noyer-200",
    formatsLabel: "Longueurs",
    sizesLabel: "Longueur",
    variants: tvStandVariants(),
    images: [
      "/products/tv-stand-5.jpg",
      "/products/tv-stand.jpg",
      "/products/tv-stand-2.jpg",
      "/products/tv-stand-3.jpg",
      "/products/tv-stand-4.jpg",
    ],
    imageAssets: [
      { src: "/products/tv-stand-5.jpg", role: "lifestyle" },
      { src: "/products/tv-stand.jpg", role: "lifestyle" },
      { src: "/products/tv-stand-2.jpg", role: "product" },
      { src: "/products/tv-stand-3.jpg", role: "product" },
      { src: "/products/tv-stand-4.jpg", role: "product" },
    ],
    features: [
      "Meuble TV bas, 24 cm de haut",
      "Deux tiroirs et deux portes abattantes",
      "Longueurs 160, 200 et 240 cm",
      "Fabriqué après commande",
    ],
    benefits: ["Format bas", "Rangement fermé", "Trois longueurs", "Fabriqué après commande"],
    highlights: [
      "Un volume bas qui reste discret sous l’écran",
      "Deux tiroirs et deux portes pour ranger télécommandes et boîtiers",
      "Une façade sans poignée apparente",
      "Trois longueurs pour s’aligner sur le meuble ou le mur",
    ],
    dailyUses: [
      {
        title: "Sous l’écran",
        text: "Le format bas se place au sol, sous un téléviseur mural, sans occuper la hauteur du salon.",
      },
      {
        title: "Ranger sans encombrer le salon",
        text: "Tiroirs et portes abattantes ferment le rangement, pour un salon moins chargé.",
      },
      {
        title: "Choisir la longueur",
        text: "Le meuble existe en 160, 200 et 240 cm, pour s’aligner sur la largeur de l’écran ou du mur.",
      },
    ],
    faq: [
      {
        question: "Quelles sont ses dimensions ?",
        answer:
          "Le meuble mesure 24 cm de haut et 24 cm de profondeur. Trois longueurs : 160 cm, 200 cm et 240 cm. Le schéma représente le format 200 cm.",
      },
      {
        question: "Quelles couleurs sont proposées ?",
        answer: "Trois finitions : noyer, noyer et noir, bois naturel.",
      },
    ],
    specifications: {
      Type: "Meuble TV",
      Largeur: "200 cm",
      Profondeur: "24 cm",
      Hauteur: "24 cm",
      Longueurs: "160, 200 et 240 cm",
      Matériaux: "Bois",
      Finitions: "Noyer, noyer et noir, bois naturel",
      Rangement: "2 tiroirs, 2 portes abattantes",
    },
    measures: {
      widthCm: 200,
      depthCm: 24,
      heightCm: 24,
    },
    madeToOrder: true,
    availabilityStatus: "available",
    supplierProvider: "buckydrop",
    supplierProductId: "990949234197",
    supplierVariantId: "6283791890962",
    weight: null,
    dimensions: "160, 200 ou 240 × 24 × 24 cm (l × p × h) — schéma du format 200 cm",
    shippingMinDays: 14,
    shippingMaxDays: null,
  },
  {
    id: "p-012",
    slug: "table-basse-metal",
    name: "Table basse en métal",
    category: "maison",
    shortDescription:
      "Table basse cubique en métal, à poser au salon ou à côté d’un canapé. Structure ajourée, étagère ouverte, deux finitions.",
    description:
      "Une table basse cubique en métal, pensée pour un salon ou un angle de canapé. Les tiges parallèles forment une structure légère, avec un plateau et une étagère inférieure pour livres ou objets du quotidien. Deux finitions, argentée et noire, et quatre formats cubes.",
    price: 139,
    compareAtPrice: 169,
    defaultVariantId: "p-012-argent-40",
    formatsLabel: "Formats cubes",
    variants: metalCoffeeTableVariants(),
    images: [
      "/products/coffee-table-metal.jpg",
      "/products/coffee-table-metal-2.jpg",
      "/products/coffee-table-metal-4.jpg",
      "/products/coffee-table-metal-3.jpg",
    ],
    imageAssets: [
      { src: "/products/coffee-table-metal.jpg", role: "lifestyle" },
      { src: "/products/coffee-table-metal-2.jpg", role: "lifestyle" },
      { src: "/products/coffee-table-metal-4.jpg", role: "product" },
      { src: "/products/coffee-table-metal-3.jpg", role: "product" },
    ],
    features: [
      "Structure cubique en métal",
      "Étagère inférieure ouverte",
      "Quatre formats : 25, 30, 35 et 40 cm",
      "Finitions argentée et noire",
    ],
    benefits: ["Format cube", "Rangement ouvert", "Métal argenté ou noir", "Fabriquée après commande"],
    highlights: [
      "Un cube métallique facile à glisser contre un canapé",
      "Une étagère ouverte pour garder livres et objets à portée de main",
      "Une structure ajourée qui reste visuellement légère",
      "Quatre tailles pour s’adapter à l’espace disponible",
    ],
    dailyUses: [
      {
        title: "À côté du canapé",
        text: "Le format cube se place contre un accoudoir, pour une tasse, une télécommande ou un livre.",
      },
      {
        title: "Un volume de rangement sans caisson fermé",
        text: "L’étagère inférieure accueille magazines ou ouvrages, sans alourdir le salon d’un meuble plein.",
      },
      {
        title: "Choisir le format selon la pièce",
        text: "Le cube existe en 25, 30, 35 et 40 cm de côté, pour un bout de canapé ou une petite table basse.",
      },
    ],
    faq: [
      {
        question: "Quelles sont ses dimensions ?",
        answer:
          "La table est un cube. Quatre formats : 25 × 25 × 25 cm, 30 × 30 × 30 cm, 35 × 35 × 35 cm et 40 × 40 × 40 cm. Le schéma ci-dessous représente le format 40 cm.",
      },
      {
        question: "Quelles couleurs sont proposées ?",
        answer: "Deux finitions : argentée et noire.",
      },
    ],
    specifications: {
      Type: "Table basse",
      Forme: "Cube",
      Formats: "25, 30, 35 et 40 cm de côté",
      Largeur: "40 cm",
      Profondeur: "40 cm",
      Hauteur: "40 cm",
      Matériaux: "Métal / acier",
      Finitions: "Argenté, noir",
      Rangement: "Étagère inférieure ouverte",
    },
    measures: {
      widthCm: 40,
      depthCm: 40,
      heightCm: 40,
    },
    madeToOrder: true,
    availabilityStatus: "available",
    supplierProvider: "buckydrop",
    supplierProductId: "891439657364",
    supplierVariantId: "6254584230652",
    weight: 4.8,
    dimensions: "Cubes 25, 30, 35 et 40 cm de côté — schéma du format 40 × 40 × 40 cm",
    shippingMinDays: 14,
    shippingMaxDays: null,
  },
  {
    id: "p-011",
    slug: "table-de-chevet",
    name: "Table de chevet en rotin",
    category: "maison",
    shortDescription:
      "Chevet compact en bois avec façade en rotin, pensé pour ajouter du rangement sans alourdir la chambre.",
    description:
      "Une table de chevet compacte avec tiroir, facile à intégrer dans une chambre aux tons naturels. Plateau bois, façade en rotin sans poignée apparente, structure sur pieds.",
    price: 129,
    compareAtPrice: 159,
    images: [
      "/products/nightstand.jpg",
      "/products/nightstand-4.jpg",
      "/products/nightstand-2.jpg",
      "/products/nightstand-3.jpg",
      "/products/nightstand-dims.jpg",
    ],
    imageAssets: [
      { src: "/products/nightstand.jpg", role: "lifestyle" },
      { src: "/products/nightstand-4.jpg", role: "product" },
      { src: "/products/nightstand-2.jpg", role: "lifestyle" },
      { src: "/products/nightstand-3.jpg", role: "detail" },
      {
        src: "/products/nightstand-dims.jpg",
        role: "dimensions",
        issues: ["supplier_diagram", "embedded_commercial"],
        replaceWhenPossible: true,
        notes: "Schéma fournisseur. Remplacé sur la fiche par ProductDimensionsDiagram. Non affiché dans la galerie.",
      },
    ],
    features: [
      "Tiroir à façade en rotin",
      "Structure bois, pieds larges",
      "Format compact 50 × 45 cm",
      "Fabriqué après commande",
    ],
    benefits: ["Format compact", "Tiroir de rangement", "Façade en rotin", "Structure sur pieds"],
    highlights: [
      "Un format adapté aux petits espaces",
      "Un tiroir pour garder l’essentiel à portée de main",
      "Une association bois et rotin facile à intégrer",
      "Une structure sur pieds qui allège visuellement le meuble",
    ],
    dailyUses: [
      {
        title: "Un format qui trouve facilement sa place",
        text: "Avec son format compact, le meuble peut être installé à côté du lit sans occuper inutilement l’espace.",
      },
      {
        title: "L’essentiel reste à portée de main",
        text: "Le tiroir permet de ranger chargeur, lunettes, livre ou petits objets du quotidien.",
      },
      {
        title: "Une présence discrète dans la chambre",
        text: "Le bois et le rotin se mêlent aux tons naturels, sans ajouter de poignée apparente sur la façade.",
      },
    ],
    specifications: {
      Type: "Table de chevet",
      Largeur: "50 cm",
      Hauteur: "45 cm",
      Caisson: "20 cm",
      Pieds: "25 cm",
      Traverse: "13 cm du sol",
      Tiroir: "1, façade en rotin",
      Matériaux: "Bois / rotin",
    },
    measures: {
      widthCm: 50,
      heightCm: 45,
      cabinetHeightCm: 20,
      legHeightCm: 25,
      crossbarFromFloorCm: 13,
    },
    madeToOrder: true,
    availabilityStatus: "available",
    supplierProvider: "buckydrop",
    supplierProductId: "1025712736698",
    supplierVariantId: "6199916742503",
    weight: null,
    dimensions: "50 × 45 cm (l × h) — caisson 20 cm, pieds 25 cm, traverse à 13 cm du sol",
    shippingMinDays: 14,
    shippingMaxDays: null,
  },
  {
    id: "p-001",
    slug: "bureau-assis-debout-electrique",
    name: "Bureau assis-debout électrique",
    category: "bureau",
    shortDescription: "Bureau réglable en hauteur pour alterner position assise et debout.",
    description:
      "Un bureau électrique conçu pour adapter votre posture au fil de la journée. Structure stable, plateau spacieux et réglage fluide.",
    price: 289,
    compareAtPrice: null,
    images: ["/products/desk.jpg"],
    features: [
      "Réglage électrique de la hauteur",
      "Plateau compatible moniteurs doubles",
      "Structure acier renforcée",
      "Commande mémoire de positions",
    ],
    benefits: ["Hauteur électrique", "Plateau deux écrans", "Structure acier", "Positions mémorisées"],
    highlights: [
      "Alterner assis et debout sans changer de bureau",
      "Un plateau pensé pour deux écrans",
      "Une structure acier qui reste stable",
      "Retrouver vos hauteurs habituelles en un geste",
    ],
    dailyUses: [
      {
        title: "Changer de posture au fil de la journée",
        text: "Le réglage électrique permet de passer d’une position assise à une position debout sans interrompre le travail.",
      },
      {
        title: "Garder écrans et documents sur le même plateau",
        text: "Le format accueille deux moniteurs, pour un bureau moins encombré de supports improvisés.",
      },
    ],
    specifications: {
      Largeur: "120 cm",
      Profondeur: "60 cm",
      "Hauteur min/max": "72–118 cm",
      Matériaux: "Acier / panneau mélaminé",
    },
    measures: {
      widthCm: 120,
      depthCm: 60,
    },
    availabilityStatus: "available",
    supplierProvider: null,
    supplierProductId: null,
    supplierVariantId: null,
    weight: 28,
    dimensions: "120 × 60 × 72–118 cm",
    shippingMinDays: null,
    shippingMaxDays: null,
  },
  {
    id: "p-002",
    slug: "meuble-chaussures-etroit",
    name: "Meuble à chaussures étroit",
    category: "rangement",
    shortDescription: "Rangement vertical discret pour entrée ou couloir étroit.",
    description:
      "Un meuble compact pour organiser chaussures et accessoires sans encombrer l’entrée. Format étroit, finition sobre.",
    price: 79,
    compareAtPrice: null,
    images: ["/products/shoe-cabinet.jpg"],
    features: ["Faible profondeur", "Plusieurs niveaux", "Porte rabattable", "Montage simple"],
    benefits: ["Faible profondeur", "Plusieurs niveaux", "Porte rabattable", "Montage simple"],
    highlights: [
      "Un volume vertical qui économise le passage",
      "Plusieurs niveaux pour séparer les paires",
      "Une porte rabattable qui reste discrète",
      "Un montage simple à l’arrivée",
    ],
    dailyUses: [
      {
        title: "Libérer le sol de l’entrée",
        text: "Les chaussures du quotidien se rangent à la verticale, sans empiéter sur le couloir.",
      },
      {
        title: "Garder l’entrée lisible",
        text: "La porte rabattable referme le rangement, pour une entrée moins encombrée.",
      },
    ],
    specifications: {
      Largeur: "60 cm",
      Profondeur: "24 cm",
      Hauteur: "110 cm",
      Capacité: "8–12 paires",
    },
    availabilityStatus: "available",
    supplierProvider: null,
    supplierProductId: null,
    supplierVariantId: null,
    weight: 12,
    dimensions: "60 × 24 × 110 cm",
    shippingMinDays: null,
    shippingMaxDays: null,
  },
  {
    id: "p-003",
    slug: "etagere-salle-de-bain",
    name: "Étagère salle de bain",
    category: "salle-de-bain",
    shortDescription: "Étagère murale pour organiser produits et serviettes.",
    description:
      "Une étagère murale pensée pour les espaces humides. Rangement clair, profil mince.",
    price: 49,
    compareAtPrice: null,
    images: ["/products/bath-shelf.jpg"],
    features: ["Fixation murale", "Résistant à l’humidité", "Design minimal", "Plusieurs tablettes"],
    benefits: ["Fixation murale", "Résistant à l’humidité", "Profil mince", "Plusieurs tablettes"],
    highlights: [
      "Du rangement sans occuper le sol",
      "Une structure adaptée aux pièces humides",
      "Un profil mince, facile à placer",
      "Plusieurs tablettes pour séparer le quotidien",
    ],
    dailyUses: [
      {
        title: "Garder les essentiels à hauteur de main",
        text: "Produits et serviettes se répartissent sur les tablettes, à côté du lavabo.",
      },
      {
        title: "Dégager le plan de toilette",
        text: "La fixation murale libère le rebord du lavabo, plus simple à essuyer.",
      },
    ],
    specifications: {
      Largeur: "40 cm",
      Profondeur: "15 cm",
      Hauteur: "60 cm",
      Finition: "Métal / panneau",
    },
    availabilityStatus: "available",
    supplierProvider: null,
    supplierProductId: null,
    supplierVariantId: null,
    weight: 4.5,
    dimensions: "40 × 15 × 60 cm",
    shippingMinDays: null,
    shippingMaxDays: null,
  },
  {
    id: "p-004",
    slug: "chariot-rangement-cuisine",
    name: "Chariot de rangement cuisine",
    category: "cuisine",
    shortDescription: "Chariot mobile pour gagner de l’espace en cuisine.",
    description:
      "Un chariot à roulettes pour ranger ustensiles, paniers et provisions. Mobile et stable.",
    price: 69,
    compareAtPrice: null,
    images: ["/products/kitchen-cart.jpg"],
    features: ["Roulettes freinées", "Plusieurs niveaux", "Poignée intégrée", "Facile à déplacer"],
    benefits: ["Roulettes freinées", "Plusieurs niveaux", "Poignée intégrée", "Facile à déplacer"],
    highlights: [
      "Un rangement que l’on rapproche du plan de travail",
      "Plusieurs niveaux pour séparer ustensiles et provisions",
      "Des roulettes que l’on peut bloquer",
      "Une poignée pour le déplacer sans effort",
    ],
    dailyUses: [
      {
        title: "Créer un plan d’appoint le temps d’un service",
        text: "Le chariot se place près des plaques, puis se range contre un mur une fois le repas terminé.",
      },
      {
        title: "Garder le plan de travail plus libre",
        text: "Paniers et ustensiles descendent sur les niveaux, plutôt que de s’accumuler sur le plan.",
      },
    ],
    specifications: {
      Largeur: "45 cm",
      Profondeur: "35 cm",
      Hauteur: "85 cm",
      Matériaux: "Métal / paniers",
    },
    availabilityStatus: "available",
    supplierProvider: null,
    supplierProductId: null,
    supplierVariantId: null,
    weight: 7,
    dimensions: "45 × 35 × 85 cm",
    shippingMinDays: null,
    shippingMaxDays: null,
  },
  {
    id: "p-005",
    slug: "support-ecran-double",
    name: "Support écran double",
    category: "bureau",
    shortDescription: "Bras articulé pour deux moniteurs, gain d’espace bureau.",
    description:
      "Support double moniteur pour libérer le plateau et améliorer l’ergonomie. Articulations fluides.",
    price: 89,
    compareAtPrice: null,
    images: ["/products/monitor-arm.jpg"],
    features: [
      "Compatible 2 écrans",
      "Réglage hauteur / inclinaison",
      "Fixation clamp ou percement",
      "Câbles guidés",
    ],
    benefits: ["Deux écrans", "Hauteur et inclinaison", "Clamp ou percement", "Câbles guidés"],
    highlights: [
      "Libérer le plateau des pieds d’écran",
      "Régler hauteur et inclinaison de chaque moniteur",
      "Fixation par pince ou percement",
      "Des câbles guidés le long du bras",
    ],
    dailyUses: [
      {
        title: "Retrouver de la place pour écrire",
        text: "Les deux écrans se déportent au-dessus du bureau, le plateau reste disponible pour clavier et notes.",
      },
      {
        title: "Ajuster l’écran à la hauteur des yeux",
        text: "Chaque bras se règle en hauteur et en inclinaison, pour une posture plus confortable.",
      },
    ],
    specifications: {
      "Taille écran": 'Jusqu’à 32"',
      "Charge max / bras": "9 kg",
      Rotation: "360°",
      Compatibilité: "VESA 75/100",
    },
    availabilityStatus: "available",
    supplierProvider: null,
    supplierProductId: null,
    supplierVariantId: null,
    weight: 5.2,
    dimensions: "Bras double articulé",
    shippingMinDays: null,
    shippingMaxDays: null,
  },
  {
    id: "p-006",
    slug: "meuble-litiere-chat",
    name: "Meuble litière chat",
    category: "animaux",
    shortDescription: "Meuble discret pour dissimuler la litière tout en restant accessible.",
    description:
      "Un meuble fermé qui intègre la litière sans dénaturer la pièce. Entrée latérale, ventilation et rangement.",
    price: 119,
    compareAtPrice: null,
    images: ["/products/litter-cabinet.jpg"],
    features: ["Design mobilier", "Accès chat latéral", "Porte frontale d’entretien", "Finition sobre"],
    benefits: ["Allure de meuble", "Entrée latérale", "Porte d’entretien", "Finition sobre"],
    highlights: [
      "Dissimuler la litière derrière une façade de meuble",
      "Une entrée latérale pour le chat",
      "Une porte frontale pour l’entretien",
      "Une finition sobre, facile à placer dans la pièce",
    ],
    dailyUses: [
      {
        title: "Garder la litière hors du champ de vision",
        text: "Le bac se glisse à l’intérieur : la pièce reste un salon ou une entrée, pas un espace technique.",
      },
      {
        title: "Nettoyer sans déplacer tout le meuble",
        text: "La porte frontale donne accès au bac pour le changement de litière.",
      },
    ],
    specifications: {
      Largeur: "70 cm",
      Profondeur: "50 cm",
      Hauteur: "60 cm",
      Usage: "Litière intérieure",
    },
    availabilityStatus: "available",
    supplierProvider: null,
    supplierProductId: null,
    supplierVariantId: null,
    weight: 16,
    dimensions: "70 × 50 × 60 cm",
    shippingMinDays: null,
    shippingMaxDays: null,
  },
  {
    id: "p-007",
    slug: "table-appoint-reglable",
    name: "Table d’appoint réglable",
    category: "maison",
    shortDescription: "Table mobile à hauteur réglable pour salon ou chambre.",
    description:
      "Table d’appoint polyvalente pour ordinateur portable, petit-déjeuner ou lecture. Hauteur réglable, plateau stable.",
    price: 59,
    compareAtPrice: null,
    images: ["/products/side-table.jpg"],
    features: ["Hauteur réglable", "Base stable", "Plateau antidérapant", "Usage multi-pièces"],
    benefits: ["Hauteur réglable", "Base stable", "Plateau antidérapant", "Salon ou chambre"],
    highlights: [
      "Une hauteur que l’on ajuste selon l’usage",
      "Une base stable une fois en place",
      "Un plateau antidérapant pour verre ou ordinateur",
      "Un format qui passe du salon à la chambre",
    ],
    dailyUses: [
      {
        title: "Travailler ou lire depuis le canapé",
        text: "La hauteur se règle pour poser un ordinateur portable ou un livre, sans table basse trop basse.",
      },
      {
        title: "Un plateau d’appoint au réveil",
        text: "En chambre, elle se glisse près du lit pour un verre ou un petit-déjeuner.",
      },
    ],
    specifications: {
      Plateau: "60 × 40 cm",
      Hauteur: "65–95 cm",
      Matériaux: "Métal / MDF",
    },
    availabilityStatus: "available",
    supplierProvider: null,
    supplierProductId: null,
    supplierVariantId: null,
    weight: 6.5,
    dimensions: "60 × 40 × 65–95 cm",
    shippingMinDays: null,
    shippingMaxDays: null,
  },
  {
    id: "p-008",
    slug: "etagere-modulable",
    name: "Étagère modulable",
    category: "rangement",
    shortDescription: "Système d’étagères à composer selon l’espace disponible.",
    description:
      "Étagère modulable pour bibliothèque, bureau ou salon. Modules assemblables.",
    price: 129,
    compareAtPrice: null,
    images: ["/products/modular-shelf.jpg"],
    features: [
      "Modules combinables",
      "Montage sans outils complexes",
      "Esthétique ouverte",
      "Charge utile confortable",
    ],
    benefits: ["Modules combinables", "Montage simple", "Esthétique ouverte", "Charge utile"],
    highlights: [
      "Composer le volume selon le mur disponible",
      "Un assemblage sans outillage complexe",
      "Une structure ouverte, lisible",
      "Une charge utile adaptée aux livres et objets du quotidien",
    ],
    dailyUses: [
      {
        title: "Créer une bibliothèque à la mesure du mur",
        text: "Les modules s’assemblent pour suivre la largeur disponible, plutôt que d’imposer un meuble trop large.",
      },
      {
        title: "Séparer livres, cartons et objets",
        text: "Chaque cube accueille un usage : lecture, rangement fermé par un bac, ou objets du salon.",
      },
    ],
    specifications: {
      Module: "40 × 30 × 40 cm",
      Configuration: "4 modules",
      Matériaux: "Bois / connecteurs métal",
    },
    availabilityStatus: "available",
    supplierProvider: null,
    supplierProductId: null,
    supplierVariantId: null,
    weight: 14,
    dimensions: "Configuration 4 modules",
    shippingMinDays: null,
    shippingMaxDays: null,
  },
  {
    id: "p-009",
    slug: "rangement-sous-evier",
    name: "Rangement sous évier",
    category: "cuisine",
    shortDescription: "Organiseur coulissant pour exploiter l’espace sous évier.",
    description:
      "Solution de rangement pour produits d’entretien et ustensiles sous évier. Format adaptable.",
    price: 39,
    compareAtPrice: null,
    images: ["/products/under-sink.jpg"],
    features: ["Coulissants", "Résistant à l’humidité", "Installation rapide", "Compartiments séparés"],
    benefits: ["Coulissants", "Résistant à l’humidité", "Installation rapide", "Compartiments séparés"],
    highlights: [
      "Atteindre le fond du meuble sans se baisser longtemps",
      "Une structure adaptée à l’humidité",
      "Une installation rapide sous l’évier",
      "Des compartiments pour séparer les produits",
    ],
    dailyUses: [
      {
        title: "Sortir les produits sans vider le meuble",
        text: "Les coulissants ramènent éponges et flacons vers soi, y compris derrière le siphon.",
      },
      {
        title: "Séparer entretien et réserve",
        text: "Les compartiments évitent de mélanger bouteilles d’entretien et stock du quotidien.",
      },
    ],
    specifications: {
      Largeur: "ajustable",
      Profondeur: "35 cm",
      Hauteur: "25 cm",
      Usage: "Sous évier",
    },
    measures: {
      depthCm: 35,
      heightCm: 25,
    },
    availabilityStatus: "available",
    supplierProvider: null,
    supplierProductId: null,
    supplierVariantId: null,
    weight: 2.8,
    dimensions: "Ajustable × 35 × 25 cm",
    shippingMinDays: null,
    shippingMaxDays: null,
  },
  {
    id: "p-010",
    slug: "organiseur-de-bureau",
    name: "Organiseur de bureau",
    category: "bureau",
    shortDescription: "Organiseur compact pour stylos, notes et petits accessoires.",
    description:
      "Un organiseur de bureau pour clarifier l’espace de travail. Compartiments pratiques, silhouette discrète.",
    price: 29,
    compareAtPrice: null,
    images: ["/products/desk-organizer.jpg"],
    features: ["Plusieurs compartiments", "Empreinte compacte", "Finition mate", "Idéal télétravail"],
    benefits: ["Plusieurs compartiments", "Empreinte compacte", "Finition mate", "Pour le télétravail"],
    highlights: [
      "Rassembler stylos et notes au même endroit",
      "Un format qui occupe peu de plateau",
      "Une finition mate, discrète",
      "Pensé pour un bureau à la maison",
    ],
    dailyUses: [
      {
        title: "Garder le plateau débarrassé",
        text: "Stylos, trombones et petits accessoires restent dans les compartiments, pas autour du clavier.",
      },
      {
        title: "Un point fixe sur un bureau partagé",
        text: "Le format compact se place dans un angle et se range facilement en fin de journée.",
      },
    ],
    specifications: {
      Largeur: "25 cm",
      Profondeur: "15 cm",
      Hauteur: "12 cm",
      Matériau: "Bois / métal",
    },
    availabilityStatus: "available",
    supplierProvider: null,
    supplierProductId: null,
    supplierVariantId: null,
    weight: 0.9,
    dimensions: "25 × 15 × 12 cm",
    shippingMinDays: null,
    shippingMaxDays: null,
  },
];
