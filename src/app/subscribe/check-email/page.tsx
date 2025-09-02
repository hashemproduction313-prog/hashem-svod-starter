// src/app/subscribe/check-email/page.tsx
"use client";

import { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function CheckEmailPage() {
  const router = useRouter();
  const search = useSearchParams();

  // Email passé depuis l’étape 1
  const emailFromQS = useMemo(
    () => (search.get("email") || "").trim(),
    [search]
  );

  // Opt-in marketing (optionnel)
  const [optin, setOptin] = useState(false);

  function handleSendLink(e: React.FormEvent) {
    e.preventDefault();

    // Ici tu appellerais ton API pour envoyer un e-mail magique / lien d’activation.
    // await fetch("/api/send-magic-link", { method:"POST", body: JSON.stringify({ email: emailFromQS, optin }) })

    // Étape 3 du flow (page “Consultez votre boîte de réception”)
    router.push(`/subscribe/inbox?email=${encodeURIComponent(emailFromQS)}`);
  }

  return (
    <main className="container" style={{ maxWidth: 880 }}>
      <section className="glass-panel" style={{ margin: "28px auto" }}>
        <header style={{ marginBottom: 18 }}>
          <h1 style={{ fontSize: "clamp(22px,3.2vw,32px)" }}>
            Complétez la configuration de votre compte <span style={{ color: "var(--gold)" }}>Hashem Productions</span>
          </h1>
          <p style={{ color: "var(--muted)", marginTop: 6 }}>
            Nous allons envoyer un lien d’inscription à l’adresse&nbsp;
            <strong>{emailFromQS || "—"}</strong> pour que vous puissiez utiliser
            <span style={{ color: "var(--gold)" }}> Hashem Productions</span> sans
            mot de passe sur tout appareil et à tout moment.
          </p>
        </header>

        <form onSubmit={handleSendLink} className="email-form" noValidate>
          <label className="checkbox-line">
            <input
              type="checkbox"
              checked={optin}
              onChange={(e) => setOptin(e.target.checked)}
            />
            Oui, envoyez-moi les offres spéciales de Hashem Productions par e-mail.
          </label>

          <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
            <button type="submit" className="btn-primary">
              Recevoir un lien
            </button>

            <Link
              href={`/subscribe/create-password?email=${encodeURIComponent(emailFromQS)}`}
              className="btn-ghost-secondary"
            >
              Créer plutôt un mot de passe
            </Link>
          </div>
        </form>

        <p style={{ color: "var(--muted)", fontSize: ".95rem", marginTop: 16 }}>
          Ce lien expirera dans 15 minutes. Vous pourrez recommencer si besoin.
        </p>
      </section>

      <p style={{ textAlign: "center", color: "var(--muted)", marginTop: 12 }}>
        Besoin d’aide ? Consultez le <Link href="/help">Centre d’aide</Link>.
      </p>
    </main>
  );
}
