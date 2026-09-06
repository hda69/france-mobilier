import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { store } from "@/config/store";
import { getBusinessIdentity } from "@/lib/business/identity";
import { SHIPPING_OFFERED_SENTENCE } from "@/lib/shipping-zone";

export const metadata: Metadata = {
  title: "Notre histoire",
  description: `L’histoire de ${store.storeName} : une sélection de meubles pensés pour les logements d’aujourd’hui.`,
};

const chapters = [
  {
    title: "Un constat, chez soi",
    text: "Les logements ont changé. Les pièces sont plus petites, les usages se croisent, le bureau s’invite dans le salon. Beaucoup de meubles sont pensés pour un intérieur idéal, rarement pour celui que l’on habite vraiment. L’idée de départ était simple : proposer des pièces qui gagnent de la place, plutôt que d’en prendre.",
  },
  {
    title: "Choisir, pas tout proposer",
    text: "France Mobilier n’est pas un entrepôt sans fin. Chaque référence entre dans le catalogue parce qu’elle sert un geste du quotidien : ranger, s’asseoir, travailler, accueillir un animal sans encombrer. On privilégie des formes claires, des dimensions lisibles, des usages évidents.",
  },
  {
    title: "Une boutique réelle",
    text: `${store.storeName} est une boutique en ligne exploitée par ${store.companyName}. La sélection se fait depuis ${store.companyCity} : on y voit, comme ailleurs, des appartements où chaque mètre compte. ${SHIPPING_OFFERED_SENTENCE} Prix TTC.`,
  },
];

export default function AboutPage() {
  const identity = getBusinessIdentity();
  return (
    <div>
      <section className="container-page grid items-center gap-10 py-12 md:grid-cols-2 md:py-16">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius)]">
          <Image
            src="/lifestyle/marque.jpg"
            alt="Détail de mobilier contemporain"
            fill
            className="object-cover"
            sizes="(max-width:768px) 100vw, 50vw"
          />
        </div>
        <div>
          <p className="eyebrow">La marque</p>
          <h1 className="display mt-3 text-3xl text-navy md:text-4xl">Un intérieur plus simple à vivre</h1>
          <div className="mt-6 space-y-4 leading-relaxed text-muted">
            <p>
              {store.storeName} est née d’une évidence : le mobilier doit faciliter le quotidien, pas
              le compliquer. Des meubles et accessoires choisis pour les logements d’aujourd’hui —
              moins d’espace perdu, plus de confort, des solutions faciles à intégrer.
            </p>
            <p>
              {identity.relationship} On y trouve des meubles pour le salon,
              la chambre, l’entrée et le bureau — une sélection courte, pas un catalogue sans fin.
            </p>
          </div>
        </div>
      </section>

      <section className="section section-cream">
        <div className="container-page max-w-3xl">
          <p className="eyebrow">Notre histoire</p>
          <h2 className="display mt-3 text-3xl text-navy md:text-4xl">
            Une sélection née du réel, pas d’un catalogue trop plein.
          </h2>
          <p className="mt-6 leading-relaxed text-muted">
            L’histoire de {store.storeName} commence par l’observation des intérieurs tels qu’ils
            sont : des studios, des appartements, des pièces à tout faire. On y range trop, on y
            travaille trop souvent sur un coin de table, on y cherche un meuble qui tienne sans
            alourdir la pièce. La boutique s’est construite autour de ce besoin — proposer peu, mais
            juste.
          </p>
          <p className="mt-4 leading-relaxed text-muted">
            Plutôt que de multiplier les collections pour le spectacle, nous avons choisi une ligne
            claire : du mobilier utile, des rangements qui libèrent de la place, des pièces que l’on
            peut installer sans projet de rénovation. Cette exigence guide encore chaque ajout au
            catalogue.
          </p>
        </div>
        <div className="container-page mt-12 grid gap-8 md:grid-cols-3">
          {chapters.map((chapter) => (
            <div key={chapter.title}>
              <h3 className="font-medium text-navy">{chapter.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{chapter.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="container-page grid items-center gap-10 md:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius)]">
            <Image
              src="/lifestyle/petits-espaces.jpg"
              alt="Studio bien organisé avec du mobilier compact"
              fill
              className="object-cover"
              sizes="(max-width:768px) 100vw, 50vw"
            />
          </div>
          <div>
            <p className="eyebrow">Aujourd’hui</p>
            <h2 className="display mt-3 text-3xl text-navy md:text-4xl">
              Le même cap : des meubles qui méritent leur place.
            </h2>
            <p className="mt-5 leading-relaxed text-muted">
              Le catalogue s’est élargi — salon, chambre, entrée, bureau — sans changer de méthode.
              On regarde l’usage, les dimensions, la simplicité d’installation. On écarte ce qui
              n’apporte qu’un effet de style.
            </p>
            <p className="mt-4 leading-relaxed text-muted">
              {identity.relationship} {SHIPPING_OFFERED_SENTENCE} Rétractation sous 14
              jours lorsque le droit le prévoit, SAV {identity.hoursShort}.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/collections/meubles" className="btn btn-primary w-full sm:w-auto">
                Découvrir les meubles
              </Link>
              <Link href="/contact" className="btn btn-secondary w-full sm:w-auto">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
