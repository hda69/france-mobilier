import type { Metadata } from "next";
import Link from "next/link";
import { store } from "@/config/store";

export const metadata: Metadata = {
  title: "Quelle table pour un petit salon ?",
  description:
    "Comment choisir une table basse ou une table à manger quand le salon est compact : profondeur, extensible, circulation.",
  alternates: { canonical: `${store.domain}/guides/quelle-table-petit-salon` },
};

export default function GuideSmallLivingTablePage() {
  return (
    <article className="container-page max-w-3xl py-10 md:py-16">
      <nav className="mb-6 text-sm text-muted">
        <Link href="/">Accueil</Link> / <Link href="/guides">Conseils</Link> /{" "}
        <span className="text-foreground">Petit salon</span>
      </nav>
      <h1 className="display text-3xl text-navy md:text-4xl">Quelle table pour un petit salon ?</h1>
      <p className="mt-5 text-lg leading-relaxed text-muted">
        Dans un salon compact, une table doit laisser circuler. La profondeur et la possibilité
        d’agrandir comptent plus que le nombre de places annoncé.
      </p>
      <div className="mt-8 space-y-4 leading-relaxed text-muted">
        <p>
          Pour le quotidien, une table basse peu encombrante suffit souvent. Notre{" "}
          <Link href="/products/table-basse-metal" className="text-navy underline-offset-4 hover:underline">
            table basse
          </Link>{" "}
          reste un point d’appui, pas un îlot au milieu de la pièce.
        </p>
        <p>
          Si le salon sert aussi de salle à manger, mieux vaut une table qui s’agrandit. La{" "}
          <Link
            href="/products/table-a-manger-extensible"
            className="text-navy underline-offset-4 hover:underline"
          >
            table à manger extensible
          </Link>{" "}
          occupe moins de place fermée, puis s’ouvre quand on reçoit.
        </p>
        <p>
          Avant d’acheter, mesurez le passage autour : canapé sorti, portes, circulation vers
          l’entrée. Un meuble trop profond coupe la pièce, même s’il est « beau ».
        </p>
      </div>
      <Link href="/collections/salon" className="btn btn-primary mt-10 inline-flex">
        Voir les meubles du salon
      </Link>
    </article>
  );
}
