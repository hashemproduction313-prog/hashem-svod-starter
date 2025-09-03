"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const start = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/subscribe/plans?email=${encodeURIComponent(email)}`);
  };

  return (
    <>
      <section className="hero">
        <div className="container">
          <h1 className="hero-title">Plateforme de Streaming<br/>Spirituel</h1>
          <p className="hero-sub">À partir de <strong>7,99 €</strong>/mois. Annulable à tout moment.</p>

          <form onSubmit={start} className="glass-panel" style={{display:"flex", gap:10, alignItems:"center", maxWidth:560}}>
            <input
              type="email"
              required
              placeholder="Adresse e-mail"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              className="search"
              style={{flex:1}}
            />
            <button className="btn-cta" type="submit">S’abonner</button>
          </form>

          <p className="mt" style={{color:"var(--muted)"}}>
            En cliquant sur <strong>S’abonner</strong>, vous acceptez de recevoir un e-mail pour compléter la configuration de votre compte <strong>Hashem Productions</strong>.
          </p>
        </div>
      </section>
    </>
  );
}
