import Image from "next/image";
import Link from "next/link";
import { NotifyForm } from "@/components/notify-form";
import { store } from "@/config/store";

const footerLinks = [
  {
    title: "Boutique",
    links: [
      { href: "/collections/maison", label: "Maison" },
      { href: "/collections/rangement", label: "Rangement" },
      { href: "/collections/bureau", label: "Bureau" },
      { href: "/collections/animaux", label: "Animaux" },
    ],
  },
  {
    title: "Informations",
    links: [
      { href: "/about", label: "À propos" },
      { href: "/platform", label: "Plateforme" },
      { href: "/shipping", label: "Livraison" },
      { href: "/returns", label: "Retours" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Compte",
    links: [
      { href: "/connexion", label: "Connexion" },
      { href: "/inscription", label: "Créer un compte" },
      { href: "/compte", label: "Mon compte" },
      { href: "/legal", label: "Mentions légales" },
      { href: "/privacy", label: "Confidentialité" },
      { href: "/terms", label: "CGV" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-accent-soft/40">
      <div className="container-page grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-1">
          <Image
            src={store.logoPath}
            alt={store.storeName}
            width={400}
            height={296}
            className="h-24 w-auto object-contain md:h-32"
          />
          <p className="mt-4 text-sm leading-relaxed text-muted">{store.storeTagline}</p>
          <p className="mt-4 text-sm text-muted">{store.supportEmail}</p>
          <p className="mt-2 text-xs text-muted">
            {store.companyName} · {store.companyCity} · SIREN {store.companySiren}
          </p>
        </div>
        {footerLinks.map((group) => (
          <div key={group.title}>
            <p className="text-sm font-medium">{group.title}</p>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-accent">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="container-page pb-10">
        <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
          <div className="grid gap-6 md:grid-cols-[1fr_1.1fr] md:items-center">
            <div>
              <p className="font-medium">Ouverture des commandes : soyez prévenu</p>
              <p className="mt-2 text-sm text-muted">
                Un seul e-mail le jour du lancement. Vous pouvez aussi nous écrire à tout moment.
              </p>
            </div>
            <NotifyForm variant="launch" />
          </div>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container-page flex flex-col gap-2 py-5 text-xs text-muted md:flex-row md:justify-between">
          <p>
            © {new Date().getFullYear()} {store.storeName}. Boutique française en pré-lancement.
          </p>
          <p>Aucun paiement collecté tant que le checkout n’est pas ouvert.</p>
        </div>
      </div>
    </footer>
  );
}
