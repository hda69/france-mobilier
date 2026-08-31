import { store } from "@/config/store";

export const founderNotes = {
  origin: `J’ai lancé ${store.storeName} à ${store.companyCity} en voyant trop d’intérieurs coincés entre des meubles trop grands et des rangements qui ne rendent aucun service. L’idée n’était pas d’ouvrir un catalogue infini : c’était de choisir des pièces qui simplifient vraiment le quotidien — un bureau qui tient dans un salon, une étagère qui range sans alourdir, un meuble qui accueille un animal sans envahir la pièce. C’est encore ça, chaque semaine.`,
  daily: `Le quotidien, c’est moins le décor que les détails : les dimensions, le suivi d’un colis, une question à 19 h. J’y réponds ${store.supportHoursShort}. Si quelque chose bloque, écrivez-nous : on ne laisse pas un client seul avec un numéro de tracking.`,
  trust: `Je ne vous demande pas de nous faire confiance les yeux fermés. La livraison est offerte en France métropolitaine, le colis est suivi, le paiement se fait par carte sur une page sécurisée, et vous avez 14 jours pour vous rétracter lorsque le droit le prévoit. Un doute ? Écrivez avant de commander.`,
} as const;
