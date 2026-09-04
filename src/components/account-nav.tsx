import Link from "next/link";

const links = [
  { href: "/compte", label: "Aperçu" },
  { href: "/compte/entreprise", label: "Entreprise" },
];

export function AccountNav({ current }: { current: "apercu" | "entreprise" }) {
  return (
    <nav className="flex flex-wrap gap-2" aria-label="Mon espace">
      {links.map((link) => {
        const active =
          (current === "apercu" && link.href === "/compte") ||
          (current === "entreprise" && link.href === "/compte/entreprise");
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={`account-nav-link rounded-full px-3.5 py-1.5 text-sm ${
              active ? "" : "bg-cream"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
