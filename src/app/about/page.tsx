import type { Metadata } from "next";
import Link from "next/link";
import { NotifyForm } from "@/components/notify-form";
import { store } from "@/config/store";

export const metadata: Metadata = {
  title: "À propos",
  description: `À propos de ${store.storeName}`,
};

export default function AboutPage() {
  return (
    <div className="container-page max-w-3xl py-10 md:py-14">
      <h1 className="text-3xl font-semibold tracking-tight">À propos</h1>
      <div className="mt-6 space-y-4 text-muted leading-relaxed">
        <p>
          {store.storeName} est une boutique française, éditée à {store.companyCity} par{" "}
          {store.companyName}. Nous préparons une sélection d’équipements utiles pour la maison, le
          rangement et le bureau — sans stock inventé, sans avis fictifs, sans promotion fantôme.
        </p>
        <p>
          L’idée est simple : vous laisser comparer maintenant, puis commander sereinement dès
          l’ouverture. Les prix affichés sont indicatifs. Les conditions de livraison et de
          rétractation (14 jours lorsque le droit français s’applique) seront publiées avant la
          première commande payante.
        </p>
        <p>
          Une question ? Écrivez à{" "}
          <a href={`mailto:${store.supportEmail}`} className="text-accent underline-offset-4 hover:underline">
            {store.supportEmail}
          </a>
          .
        </p>
      </div>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/collections/maison" className="btn btn-primary">
          Voir la sélection
        </Link>
        <Link href="/contact" className="btn btn-secondary">
          Nous écrire
        </Link>
      </div>
      <div className="mt-10">
        <NotifyForm variant="launch" />
      </div>
    </div>
  );
}
