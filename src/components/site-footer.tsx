import Image from "next/image";
import Link from "next/link";
import { store } from "@/config/store";

const groups = [
  {
    title: "Nos collections",
    links: [
      { href: "/nouveautes", label: "Nouveautés" },
      { href: "/collections/rangement", label: "Rangement" },
      { href: "/collections/bureau", label: "Bureau" },
      { href: "/collections/maison", label: "Maison" },
      { href: "/collections/animaux", label: "Animaux" },
    ],
  },
  {
    title: "Aide",
    links: [
      { href: "/shipping", label: "Livraison" },
      { href: "/returns", label: "Retours" },
      { href: "/compte", label: "Mes commandes" },
      { href: "/pro", label: "Demander un accès pro" },
      { href: "/contact", label: "Contact" },
      { href: "/faq", label: "FAQ" },
    ],
  },
  {
    title: "Informations",
    links: [
      { href: "/about", label: "Notre histoire" },
      { href: "/legal", label: "Mentions légales" },
      { href: "/terms", label: "CGV" },
      { href: "/privacy", label: "Confidentialité" },
      { href: "/privacy", label: "Cookies" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-10 bg-navy text-white pb-[env(safe-area-inset-bottom)]">
      <div className="container-page grid gap-8 py-10 md:grid-cols-4 md:gap-10 md:py-14">
        <div>
          <Link href="/" className="inline-flex rounded-md bg-white px-2 py-1.5">
            <Image
              src={store.logoPath}
              alt={store.storeName}
              width={160}
              height={118}
              className="h-12 w-auto object-contain"
            />
          </Link>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/75">
            Meubles et solutions de rangement pour un intérieur plus simple à vivre. Boutique éditée
            à {store.companyCity}.
          </p>
          <p className="mt-4 text-sm text-white/75">{store.supportEmail}</p>
        </div>
        {groups.map((group) => (
          <div key={group.title}>
            <p className="text-sm font-semibold">{group.title}</p>
            <ul className="mt-3 text-sm text-white/75">
              {group.links.map((link) => (
                <li key={`${group.title}-${link.href}-${link.label}`}>
                  <Link href={link.href} className="inline-flex min-h-11 items-center hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-2 py-5 text-xs text-white/55 md:flex-row md:justify-between">
          <p>
            © {new Date().getFullYear()} {store.storeName}. Tous droits réservés.
          </p>
          <p>
            {store.storeName} — {store.companyCity}
          </p>
        </div>
      </div>
    </footer>
  );
}
