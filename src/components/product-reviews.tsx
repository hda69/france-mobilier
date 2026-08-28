"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

export type ReviewItem = {
  id: string;
  rating: number;
  title: string | null;
  body: string;
  authorName: string;
  createdAt: string;
  verifiedPurchase: boolean;
};

function Stars({ value }: { value: number }) {
  return (
    <span className="tracking-tight text-accent" aria-label={`${value} sur 5`}>
      {"★".repeat(value)}
      <span className="text-border">{"★".repeat(5 - value)}</span>
    </span>
  );
}

export function ProductReviews({
  productId,
  initialReviews,
}: {
  productId: string;
  initialReviews: ReviewItem[];
}) {
  const { data: session } = authClient.useSession();
  const [reviews, setReviews] = useState(initialReviews);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const average = useMemo(() => {
    if (reviews.length === 0) return null;
    return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  }, [reviews]);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, rating, title, body }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Envoi impossible");
      setMessage("Merci — votre avis a été publié.");
      setTitle("");
      setBody("");
      const refreshed = await fetch(`/api/reviews?productId=${encodeURIComponent(productId)}`);
      const refreshedData = await refreshed.json();
      setReviews(refreshedData.reviews || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mt-16 border-t border-border pt-12">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Avis clients</h2>
          <p className="mt-1 text-sm text-muted">
            Uniquement après un achat vérifié — pas d’avis fictifs.
          </p>
        </div>
        {average !== null && (
          <p className="text-sm text-muted">
            <Stars value={Math.round(average)} />{" "}
            <span className="ml-1">
              {average.toFixed(1)} / 5 · {reviews.length} avis
            </span>
          </p>
        )}
      </div>

      {reviews.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-accent-soft/40 px-5 py-8 text-sm text-muted">
          Aucun avis pour le moment. Les premiers commentaires apparaîtront après les commandes
          livrées.
        </div>
      ) : (
        <ul className="space-y-4">
          {reviews.map((item) => (
            <li key={item.id} className="rounded-2xl border border-border bg-white p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Stars value={item.rating} />
                {item.verifiedPurchase && (
                  <span className="badge">Achat vérifié</span>
                )}
              </div>
              {item.title && <p className="mt-2 font-medium">{item.title}</p>}
              <p className="mt-2 text-sm leading-relaxed text-muted">{item.body}</p>
              <p className="mt-3 text-xs text-muted">
                {item.authorName} ·{" "}
                {new Date(item.createdAt).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-8 rounded-2xl border border-border bg-white p-5">
        <h3 className="font-medium">Laisser un avis</h3>
        {!session?.user ? (
          <p className="mt-2 text-sm text-muted">
            <Link href="/connexion" className="text-accent underline-offset-2 hover:underline">
              Connectez-vous
            </Link>{" "}
            après un achat vérifié pour commenter ce produit.
          </p>
        ) : (
          <form onSubmit={onSubmit} className="mt-4 space-y-3">
            <label className="block text-sm">
              <span className="mb-1 block text-muted">Note</span>
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="rounded-xl border border-border px-3 py-2 outline-none focus:border-accent"
              >
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>
                    {n} / 5
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm">
              <span className="mb-1 block text-muted">Titre (optionnel)</span>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border border-border px-3 py-2.5 outline-none focus:border-accent"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block text-muted">Votre commentaire</span>
              <textarea
                required
                minLength={10}
                rows={4}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="w-full rounded-xl border border-border px-3 py-2.5 outline-none focus:border-accent"
              />
            </label>
            {error && <p className="text-sm text-red-700">{error}</p>}
            {message && <p className="text-sm text-accent">{message}</p>}
            <button type="submit" disabled={loading} className="btn-primary disabled:opacity-60">
              {loading ? "Envoi…" : "Publier mon avis"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
