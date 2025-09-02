"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PLANS, type PlanId } from "../../../data/plans";

const ORDER: PlanId[] = ["ad", "std", "prem"];

export default function PlansPage() {
  const search = useSearchParams();
  const email = (search.get("email") || "").trim();

  return (
    <main className="container">
      <section className="auth-hero">
        <h1 className="auth-title">Choisissez votre offre</h1>
        <p className="auth-sub">
          Sans engagement. Annulable à tout moment. Profitez de <span style={{color:"var(--gold)"}}>Hashem Productions</span> sur tous vos appareils.
        </p>

        <div className="plan-grid" role="list" aria-label="Offres d’abonnement">
          {ORDER.map((id) => {
            const p = PLANS[id];
            const href = `/subscribe/payment?plan=${p.id}${email ? `&email=${encodeURIComponent(email)}` : ""}`;
            const recommended = id === "std";

            return (
              <article key={p.id} role="listitem" className={`plan-card ${recommended ? "popular" : ""}`} aria-label={`Offre ${p.name}, ${p.price}`}>
                <header className="plan-head">
                  <div className="plan-name">
                    {p.name} {recommended && <span className="badge" style={{ marginLeft: 8 }}>Populaire</span>}
                  </div>
                  <span className="badge">{p.badge}</span>
                </header>

                <div className="plan-price">{p.price}</div>

                <ul className="plan-feats">
                  {id==="ad"  && (<><li>• Bonne qualité vidéo et audio</li><li>• 1080p (Full HD)</li><li>• 2 appareils en simultané</li><li>• Publicités limitées</li></>)}
                  {id==="std" && (<><li>• Sans pub</li><li>• 1080p (Full HD)</li><li>• 2 appareils en simultané</li><li>• Téléchargements</li></>)}
                  {id==="prem"&&(<><li>• Sans pub</li><li>• 4 appareils en simultané</li><li>• Téléchargements</li><li>• Audio spatial (immersif)</li></>)}
                </ul>

                <div style={{ marginTop: 12 }}>
                  <Link className="btn-cta" href={href} prefetch={false}>Suivant</Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
