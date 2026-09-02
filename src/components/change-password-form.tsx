"use client";

import { FormEvent, useState } from "react";

export function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSuccess(false);
    if (newPassword !== confirmPassword) {
      setError("Les deux nouveaux mots de passe ne correspondent pas.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/account/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Impossible de changer le mot de passe.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="mot-de-passe" className="scroll-mt-28 border-t border-border pt-6">
      <h2 className="text-lg font-semibold tracking-tight">Mot de passe</h2>
      <p className="mt-1 text-sm leading-relaxed text-muted">
        Si vous venez d’acheter en invité, remplacez ici le mot de passe provisoire.
      </p>
      <form onSubmit={onSubmit} className="mt-4 space-y-3">
        <label className="block text-sm">
          <span className="mb-1 block text-muted">Mot de passe actuel</span>
          <input
            required
            type="password"
            autoComplete="current-password"
            minLength={8}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="input"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block text-muted">Nouveau mot de passe</span>
          <input
            required
            type="password"
            autoComplete="new-password"
            minLength={8}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="input"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block text-muted">Confirmer le nouveau mot de passe</span>
          <input
            required
            type="password"
            autoComplete="new-password"
            minLength={8}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="input"
          />
        </label>
        {error ? <p className="text-sm text-red-700">{error}</p> : null}
        {success ? (
          <p className="text-sm text-navy">Le mot de passe a été mis à jour.</p>
        ) : null}
        <button type="submit" disabled={loading} className="btn btn-primary w-full">
          {loading ? "Patientez…" : "Enregistrer le mot de passe"}
        </button>
      </form>
    </section>
  );
}
