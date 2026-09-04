"use client";

import { FormEvent, Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { PasswordInput } from "@/components/password-input";

function ResetPasswordFields() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const invalid = searchParams.get("error") === "INVALID_TOKEN";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError("Les deux mots de passe ne correspondent pas.");
      return;
    }
    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }
    setLoading(true);
    try {
      const result = await authClient.resetPassword({
        newPassword: password,
        token,
      });
      if (result.error) {
        const raw = `${result.error.code || ""} ${result.error.message || ""}`.toLowerCase();
        if (raw.includes("invalid_token") || raw.includes("expired")) {
          throw new Error("Ce lien n’est plus valable. Demandez un nouveau lien.");
        }
        throw new Error(result.error.message || "Réinitialisation impossible.");
      }
      router.push("/connexion?reset=1");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Réinitialisation impossible.");
    } finally {
      setLoading(false);
    }
  }

  if (invalid || !token) {
    return (
      <div className="mx-auto max-w-md space-y-4 rounded-2xl border border-border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold tracking-tight">Lien invalide</h1>
        <p className="text-sm leading-relaxed text-muted">
          Ce lien a expiré ou n’est plus valable. Demandez un nouveau lien depuis la page mot de
          passe oublié.
        </p>
        <Link href="/mot-de-passe-oublie" className="btn btn-primary inline-flex w-full">
          Demander un nouveau lien
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto max-w-md space-y-4 rounded-2xl border border-border bg-white p-6 shadow-sm"
    >
      <h1 className="text-2xl font-semibold tracking-tight">Nouveau mot de passe</h1>
      <p className="text-sm leading-relaxed text-muted">
        Choisissez un mot de passe d’au moins 8 caractères. Vous pourrez ensuite vous connecter.
      </p>
      <label className="block text-sm">
        <span className="mb-1 block text-muted">Nouveau mot de passe</span>
        <PasswordInput
          required
          minLength={8}
          autoComplete="new-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </label>
      <label className="block text-sm">
        <span className="mb-1 block text-muted">Confirmer le mot de passe</span>
        <PasswordInput
          required
          minLength={8}
          autoComplete="new-password"
          value={confirm}
          onChange={(event) => setConfirm(event.target.value)}
        />
      </label>
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      <button type="submit" disabled={loading} className="btn btn-primary w-full">
        {loading ? "Enregistrement…" : "Enregistrer le mot de passe"}
      </button>
    </form>
  );
}

export function ResetPasswordForm() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-md min-h-48" />}>
      <ResetPasswordFields />
    </Suspense>
  );
}
