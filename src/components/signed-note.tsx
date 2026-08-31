import type { ReactNode } from "react";
import { store } from "@/config/store";

export function SignedNote({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <figure
      className={`rounded-[var(--radius)] border border-border bg-cream/60 px-5 py-5 md:px-6 md:py-6 ${className}`}
    >
      <blockquote className="leading-relaxed text-foreground">{children}</blockquote>
      <figcaption className="mt-4">
        <p className="font-medium text-navy">{store.founderFirstName}</p>
        <p className="text-sm text-muted">
          {store.founderRole}, {store.storeName} — {store.companyCity}
        </p>
      </figcaption>
    </figure>
  );
}
