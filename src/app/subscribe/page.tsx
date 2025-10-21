"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function SubscribeEmailStep() {
  const router = useRouter();
  const search = useSearchParams();

  useEffect(() => {
    document.title = "Créer votre compte - Hashem Productions";
  }, []);

  const emailFromQS = useMemo(() => (search.get("email") ?? "").trim(), [search]);
  const [email, setEmail] = useState(emailFromQS);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function isValidEmail(v: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    const v = email.trim();
    if (!isValidEmail(v)) {
      setErr("Merci d’indiquer une adresse e-mail valide.");
      return;
    }

    setLoading(true);
    try {
      router.push(`/subscribe/plans?email=${encodeURIComponent(v)}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container" style={{ maxWidth: 820 }}>
      <section className="auth-hero">
        <h1 className="auth-title">Créez votre compte</h1>
        <p className="auth-sub">
          Indiquez votre e-mail pour commencer, vous pourrez choisir votre offre à l’étape suivante.
        </p>
      </section>

      <div className="glass-panel" style={{ marginTop: 18 }}>
        <form onSubmit={onSubmit} className="email-form" noValidate>
          <label htmlFor="email" className="sr-only">Adresse e-mail</label>
          <input
            id="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="votre@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
            aria-invalid={!!err}
            aria-describedby={err ? "email-error" : undefined}
          />

          {err && (
            <p id="email-error" style={{ marginTop: 8, color: "#ffb3b3" }}>
              {err}
            </p>
          )}

          <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Chargement…" : "Continuer"}
            </button>

            <Link
              href={`/subscribe/check-email?email=${encodeURIComponent(email || emailFromQS)}`}
              className="btn-ghost"
              prefetch={false}
            >
              Recevoir un lien magique
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
