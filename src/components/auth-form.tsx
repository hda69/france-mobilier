"use client";

import { FormEvent, Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { PasswordInput } from "@/components/password-input";

type Mode = "login" | "register";

function safeNext(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/compte";
  return value;
}

function AuthFormFields({ mode }: { mode: Mode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = safeNext(searchParams.get("next"));
  const nextQuery = next !== "/compte" ? `?next=${encodeURIComponent(next)}` : "";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === "register") {
        const result = await authClient.signUp.email({
          email: email.trim().toLowerCase(),
          password,
          name: name.trim() || email.split("@")[0],
        });
        if (result.error) throw new Error(result.error.message || "Inscription impossible");
      } else {
        const result = await authClient.signIn.email({
          email: email.trim().toLowerCase(),
          password,
        });
        if (result.error) throw new Error(result.error.message || "Identifiants incorrects");
      }
      router.push(next);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-md space-y-4 rounded-2xl border border-border bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-semibold tracking-tight">
        {mode === "login" ? "Connexion" : "Créer un compte"}
      </h1>
      <p className="text-sm text-muted">
        Les avis produits sont réservés aux clients avec un achat vérifié. Identifiant : votre
        e-mail.
      </p>
      {mode === "register" && (
        <label className="block text-sm">
          <span className="mb-1 block text-muted">Nom</span>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input"
          />
        </label>
      )}
      <label className="block text-sm">
        <span className="mb-1 block text-muted">E-mail</span>
        <input
          required
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input"
        />
      </label>
      <label className="block text-sm">
        <span className="mb-1 block text-muted">Mot de passe</span>
        <PasswordInput
          required
          minLength={8}
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      {error && <p className="text-sm text-red-700">{error}</p>}
      <button type="submit" disabled={loading} className="btn btn-primary w-full">
        {loading ? "Patientez…" : mode === "login" ? "Se connecter" : "Créer mon compte"}
      </button>
      <p className="text-center text-sm text-muted">
        {mode === "login" ? (
          <>
            Pas encore de compte ?{" "}
            <Link href={`/inscription${nextQuery}`} className="text-accent underline-offset-2 hover:underline">
              S’inscrire
            </Link>
          </>
        ) : (
          <>
            Déjà inscrit ?{" "}
            <Link href={`/connexion${nextQuery}`} className="text-accent underline-offset-2 hover:underline">
              Se connecter
            </Link>
          </>
        )}
      </p>
    </form>
  );
}

export function AuthForm({ mode }: { mode: Mode }) {
  return (
    <Suspense fallback={<div className="mx-auto max-w-md min-h-48" />}>
      <AuthFormFields mode={mode} />
    </Suspense>
  );
}
