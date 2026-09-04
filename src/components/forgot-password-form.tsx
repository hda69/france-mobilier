"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const result = await authClient.requestPasswordReset({
        email: email.trim().toLowerCase(),
        redirectTo: "/nouveau-mot-de-passe",
      });
      if (result.error) {
        const raw = `${result.error.code || ""} ${result.error.message || ""}`.toLowerCase();
        if (raw.includes("invalid origin")) {
          throw new Error("Envoi impossible depuis cette adresse. Réessayez depuis le site.");
        }
        throw new Error(result.error.message || "Envoi impossible pour le moment.");
      }
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Envoi impossible pour le moment.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md space-y-4 rounded-2xl border border-border bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-semibold tracking-tight">Mot de passe oublié</h1>
      {sent ? (
        <p className="text-sm leading-relaxed text-muted">
          Si un compte existe pour cette adresse, un e-mail avec un lien de réinitialisation vient
          d’être envoyé. Le lien expire dans une heure.
        </p>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          <p className="text-sm leading-relaxed text-muted">
            Indiquez l’e-mail du compte. Nous envoyons un lien pour choisir un nouveau mot de
            passe.
          </p>
          <label className="block text-sm">
            <span className="mb-1 block text-muted">Adresse e-mail du compte</span>
            <input
              required
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="input"
            />
          </label>
          {error ? <p className="text-sm text-red-700">{error}</p> : null}
          <button type="submit" disabled={loading} className="btn btn-primary w-full">
            {loading ? "Envoi…" : "Envoyer le lien"}
          </button>
        </form>
      )}
      <p className="text-center text-sm text-muted">
        <Link href="/connexion" className="text-accent underline-offset-2 hover:underline">
          Retour à la connexion
        </Link>
      </p>
    </div>
  );
}
