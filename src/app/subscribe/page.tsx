// src/app/subscribe/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SubscribeEmailPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [err, setErr] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const clean = email.trim();
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean);
    if (!ok) {
      setErr("L’adresse e-mail est obligatoire.");
      return;
    }
    // Pose le drapeau pour afficher le bouton DEV
    try {
      sessionStorage.setItem("dev:allow-continue", "1");
    } catch {}
    router.push(`/subscribe/inbox?email=${encodeURIComponent(clean)}`);
  }

  return (
    <main className="container" style={{ maxWidth: 1200 }}>
      <section className="hero-modern" style={{ marginTop: 28 }}>
        <div className="hero-overlay" />
        <div className="hero-content">
          <h1 className="auth-title" style={{ marginBottom: 8 }}>
            Plateforme de Streaming <br /> Spirituel
          </h1>
          <p className="auth-sub">À partir de 7,99 €/mois. Annulable à tout moment.</p>

          <form onSubmit={submit} className="form-inline" style={{ marginTop: 12 }}>
            <input
              className="input-lg"
              type="email"
              placeholder="Adresse e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="Adresse e-mail"
            />
            <button className="btn-cta" type="submit">S’abonner</button>
          </form>

          {err && <p style={{ color: "#ffb3b3", marginTop: 8 }}>{err}</p>}

          <p className="notice">
            En cliquant sur <strong>S’abonner</strong>, vous acceptez de recevoir un e-mail
            pour compléter la configuration de votre compte <strong>Hashem Productions</strong>.
          </p>
        </div>
      </section>
    </main>
  );
}
