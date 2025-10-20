// src/app/subscribe/welcome/page.tsx
"use client";
export const dynamic = "force-dynamic";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PLANS, normalizePlanId } from "@/data/plans";

export default function WelcomePage() {
  const search = useSearchParams();
  const email = search.get("email") ?? "";
  const planId = normalizePlanId(search.get("plan"));
  const plan = PLANS[planId];

  return (
    <main className="container" style={{ maxWidth: 840 }}>
      <div className="auth-hero">
        <h1 className="auth-title">Bienvenue sur Hashem Productions</h1>
        <p className="auth-sub">
          Votre abonnement <strong>{plan.name}</strong> est prêt.
          {email && <> Nous avons lié le compte à <strong>{email}</strong>.</>}
        </p>

        <div style={{ marginTop: 18 }}>
          <Link href="/" className="btn-cta">Accéder à l’accueil</Link>
          <Link href="/account" className="btn-ghost" style={{ marginLeft: 10 }}>
            Gérer mon compte
          </Link>
        </div>

        <p className="notice" style={{ marginTop: 16 }}>
          Vous pourrez modifier votre plan, mettre à jour votre mode de paiement
          ou résilier à tout moment depuis votre espace compte.
        </p>
      </div>

      <section>
        <h2 className="section-title">Commencer à regarder</h2>

        <div className="grid">
          <Link href="/title/9" className="card-modern card-link">
            <img src="/posters/poster9.jpg" alt="Le Lever" />
            <h3>Le Lever</h3>
          </Link>

          <Link href="/title/1" className="card-modern card-link">
            <img src="/posters/poster1.jpg" alt="La 7ème Alliance" />
            <h3>La 7ème Alliance</h3>
          </Link>

          <Link href="/title/5" className="card-modern card-link">
            <img src="/posters/poster5.jpg" alt="Sermon" />
            <h3>Sermon</h3>
          </Link>
        </div>
      </section>
    </main>
  );
}
