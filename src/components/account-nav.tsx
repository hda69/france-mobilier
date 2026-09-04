"use client";

import Link from "next/link";

const allLinks = [
  { href: "/compte", label: "Tableau de bord", key: "apercu" },
  { href: "/compte#commandes", label: "Mes commandes", key: "commandes" },
  { href: "/compte/devis", label: "Mes devis", key: "devis" },
  { href: "/compte/factures", label: "Mes factures", key: "factures" },
  { href: "/compte/entreprise", label: "Mon entreprise", key: "entreprise" },
] as const;

export function AccountNav({
  current,
  proApproved = false,
}: {
  current: "apercu" | "entreprise" | "devis" | "factures";
  proApproved?: boolean;
}) {
  const links = proApproved
    ? allLinks
    : allLinks.filter((link) => link.key === "apercu" || link.key === "entreprise");

  return (
    <nav className="flex flex-wrap gap-2" aria-label="Mon espace">
      {links.map((link) => {
        const active = current === link.key || (current === "apercu" && link.key === "commandes");
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active && link.key !== "commandes" ? "page" : undefined}
            className={`account-nav-link rounded-full px-3.5 py-1.5 text-sm ${
              current === link.key ? "" : "bg-cream"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
