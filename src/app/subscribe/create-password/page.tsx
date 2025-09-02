// src/app/subscribe/create-password/page.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";

export default function CreatePasswordPage() {
  const search = useSearchParams();
  const emailParam = (search.get("email") || "").trim();
  const email = emailParam || "ton@mail.com";
  const router = useRouter();

  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const pass1 = useRef<HTMLInputElement>(null);
  const pass2 = useRef<HTMLInputElement>(null);
  const [err, setErr] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");

    const p1 = pass1.current?.value || "";
    const p2 = pass2.current?.value || "";

    if (p1.length < 8)  return setErr("Mot de passe : minimum 8 caractères.");
    if (p1 !== p2)      return setErr("Les mots de passe ne correspondent pas.");

    try {
      setBusy(true);
      // DEV: on enchaîne, l’API réelle viendra quand on branchera Supabase/Stripe
      router.push(`/subscribe/plans?email=${encodeURIComponent(email)}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="container" style={{ maxWidth: 900 }}>
      <section className="glass-panel" style={{ margin: "34px auto" }}>
        <h1 className="auth-title">Créer un mot de passe</h1>
        <p className="auth-sub">
          Ton e-mail : <strong>{email}</strong>
        </p>

        <form onSubmit={submit} style={{ marginTop: 14 }}>
          <div style={{ display: "grid", gap: 10, maxWidth: 680 }}>
            <div style={{ display: "flex", gap: 10 }}>
              <input
                className="input-lg"
                type={show ? "text" : "password"}
                placeholder="Mot de passe (au moins 8 caractères)"
                ref={pass1}
                aria-label="Mot de passe"
                disabled={busy}
              />
              <button
                type="button"
                className="btn-ghost"
                onClick={() => setShow((s) => !s)}
                disabled={busy}
              >
                {show ? "Masquer" : "Afficher"}
              </button>
            </div>

            <input
              className="input-lg"
              type={show ? "text" : "password"}
              placeholder="Confirme le mot de passe"
              ref={pass2}
              aria-label="Confirmation mot de passe"
              disabled={busy}
            />
          </div>

          {err && <p style={{ color: "#ffb3b3", marginTop: 8 }}>{err}</p>}

          <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
            <button className="btn-cta" type="submit" disabled={busy}>
              {busy ? "Validation…" : "Terminer l’inscription"}
            </button>
            <a
              className="btn-ghost-secondary"
              href={`/subscribe/inbox?email=${encodeURIComponent(email)}`}
            >
              Utiliser le lien e-mail à la place
            </a>
          </div>

          <p className="notice" style={{ marginTop: 12 }}>
            En continuant, vous acceptez les Conditions d’utilisation et la
            Politique de confidentialité de <strong>Hashem Productions</strong>.
          </p>
        </form>
      </section>
    </main>
  );
}
