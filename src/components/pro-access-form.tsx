"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { authClient } from "@/lib/auth-client";

type RequestState = {
  siren: string;
  siret: string | null;
  companyName: string;
  legalName: string;
  city: string | null;
  status: "eligible" | "rejected" | "approved";
};

export function ProAccessForm() {
  const pathname = usePathname();
  const next = pathname?.startsWith("/compte") ? "/compte/entreprise" : "/pro";
  const { data: session, isPending } = authClient.useSession();
  const [existing, setExisting] = useState<RequestState | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [siren, setSiren] = useState("");
  const [siret, setSiret] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [vatNumber, setVatNumber] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!session?.user) return;
    fetch("/api/pro-access")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.request) setExisting(data.request);
      })
      .catch(() => {});
  }, [session?.user]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/pro-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          siren,
          siret: siret || undefined,
          companyName: companyName || undefined,
          vatNumber: vatNumber || undefined,
          message: message || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Demande impossible pour le moment.");
      }
      setExisting(data.request);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Demande impossible pour le moment.");
    } finally {
      setLoading(false);
    }
  }

  if (isPending) {
    return <p className="text-muted">Chargement…</p>;
  }

  if (!session?.user) {
    return (
      <div className="rounded-[var(--radius)] border border-border bg-white p-6">
        <p className="leading-relaxed text-muted">
          Connectez-vous avec votre compte habituel. Après vérification du SIREN, l’accès pro
          s’ouvre sur le même e-mail et le même mot de passe — pas de pièce d’identité.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link href={`/connexion?next=${encodeURIComponent(next)}`} className="btn btn-primary w-full sm:w-auto">
            Se connecter
          </Link>
          <Link href={`/inscription?next=${encodeURIComponent(next)}`} className="btn btn-secondary w-full sm:w-auto">
            Créer un compte
          </Link>
        </div>
      </div>
    );
  }

  if (existing) {
    const label =
      existing.status === "approved"
        ? "Accès professionnel activé"
        : existing.status === "eligible"
          ? "SIREN vérifié — activation en cours"
          : "Demande non retenue";
    return (
      <div className="rounded-[var(--radius)] border border-border bg-white p-6">
        <p className="text-sm font-medium text-navy">{label}</p>
        <p className="mt-3 text-sm text-muted">{existing.legalName || existing.companyName}</p>
        <p className="mt-1 text-sm text-muted">SIREN {existing.siren}</p>
        {existing.city ? <p className="mt-1 text-sm text-muted">{existing.city}</p> : null}
        {existing.status === "approved" ? (
          <p className="mt-4 text-sm leading-relaxed text-muted">
            Vous restez sur le même compte ({session.user.email}), sans nouveau mot de passe. Les
            prochaines commandes portent le nom et le SIREN de l’entreprise. Un e-mail de
            confirmation a été envoyé.
          </p>
        ) : null}
        {existing.status === "eligible" ? (
          <p className="mt-4 text-sm leading-relaxed text-muted">
            L’entreprise est active au répertoire Sirene. Rechargez cette page : l’accès s’ouvre
            sur le même compte, sans nouvel identifiant.
          </p>
        ) : null}
        {existing.status === "rejected" ? (
          <button type="button" className="btn btn-secondary mt-6" onClick={() => setExisting(null)}>
            Modifier le SIREN
          </button>
        ) : null}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-[var(--radius)] border border-border bg-white p-6">
      <p className="text-sm text-muted">
        Compte : {session.user.email}. L’e-mail et le mot de passe ne changent pas. Nous vérifions
        le SIREN dans le répertoire Sirene. Pas de pièce d’identité.
      </p>
      <label className="block text-sm">
        SIREN
        <input
          required
          name="siren"
          inputMode="numeric"
          autoComplete="off"
          placeholder="9 chiffres"
          value={siren}
          onChange={(e) => setSiren(e.target.value)}
          className="input mt-1"
        />
      </label>
      <label className="block text-sm">
        SIRET <span className="text-muted">(optionnel)</span>
        <input
          name="siret"
          inputMode="numeric"
          autoComplete="off"
          placeholder="14 chiffres"
          value={siret}
          onChange={(e) => setSiret(e.target.value)}
          className="input mt-1"
        />
      </label>
      <label className="block text-sm">
        Nom commercial <span className="text-muted">(optionnel)</span>
        <input
          name="companyName"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          className="input mt-1"
        />
      </label>
      <label className="block text-sm">
        N° TVA <span className="text-muted">(optionnel)</span>
        <input
          name="vatNumber"
          value={vatNumber}
          onChange={(e) => setVatNumber(e.target.value)}
          className="input mt-1"
        />
      </label>
      <label className="block text-sm">
        Besoin <span className="text-muted">(optionnel)</span>
        <textarea
          name="message"
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Bureaux, magasin, commandes récurrentes…"
          className="input mt-1"
        />
      </label>
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      <button type="submit" className="btn btn-primary w-full sm:w-auto" disabled={loading}>
        {loading ? "Vérification du SIREN…" : "Ouvrir l’accès professionnel"}
      </button>
    </form>
  );
}
