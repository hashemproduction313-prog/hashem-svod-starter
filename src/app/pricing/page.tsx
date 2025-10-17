"use client";
export const dynamic = "force-dynamic";

import { PLANS, type PlanId } from "../../data/plans";
import { useSearchParams } from "next/navigation";

const ORDER: PlanId[] = ["ad", "std", "prem"];

export default function PricingPage() {
  const search = useSearchParams();
  const email = (search.get("email") || "").trim();

  async function startCheckout(plan: PlanId) {
    try {
      const res = await fetch("/api/create-checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ plan }),
      });

      const contentType = res.headers.get("content-type") || "";
      const raw = await res.text();
      const asJson =
        contentType.includes("application/json") || raw.trim().startsWith("{");

      let json: any = null;
      if (asJson) {
        try {
          json = JSON.parse(raw);
        } catch {
          // JSON invalide
        }
      }

      if (!res.ok) {
        alert(json?.error || `HTTP ${res.status} — ${raw.slice(0, 200)}`);
        return;
      }
      if (!json?.ok || !json?.url) {
        alert(json?.error || "Réponse invalide de l’API.");
        return;
      }

      window.location.href = json.url;
    } catch {
      alert("Impossible de démarrer le paiement.");
    }
  }

  return (
    <main className="container">
      <section className="auth-hero">
        <h1 className="auth-title">Choisissez votre offre</h1>
        <p className="auth-sub">
          Sans engagement. Annulable à tout moment. Profitez de{" "}
          <span style={{ color: "var(--gold)" }}>Hashem Productions</span> sur tous vos appareils.
        </p>

        <div className="plan-grid" role="list" aria-label="Offres d’abonnement">
          {ORDER.map((id) => {
            const p = PLANS[id];
            const recommended = id === "std";

            return (
              <article
                key={p.id}
                role="listitem"
                className={`plan-card ${recommended ? "popular" : ""}`}
                aria-label={`Offre ${p.name}, ${p.price}`}
              >
                <header className="plan-head">
                  <div className="plan-name">
                    {p.name}{" "}
                    {recommended && (
                      <span className="badge" style={{ marginLeft: 8 }}>
                        Populaire
                      </span>
                    )}
                  </div>
                  <span className="badge" aria-label={`Qualité ${p.badge}`}>
                    {p.badge}
                  </span>
                </header>

                <div className="plan-price">{p.price}</div>

                <ul className="plan-feats">
                  {id === "ad" && (
                    <>
                      <li>• Bonne qualité vidéo et audio</li>
                      <li>• 1080p (Full HD)</li>
                      <li>• 2 appareils en simultané</li>
                      <li>• Publicités limitées</li>
                    </>
                  )}
                  {id === "std" && (
                    <>
                      <li>• Sans pub</li>
                      <li>• 1080p (Full HD)</li>
                      <li>• 2 appareils en simultané</li>
                      <li>• Téléchargements</li>
                    </>
                  )}
                  {id === "prem" && (
                    <>
                      <li>• Sans pub</li>
                      <li>• 4 appareils en simultané</li>
                      <li>• Téléchargements</li>
                      <li>• Audio spatial (immersif)</li>
                    </>
                  )}
                </ul>

                <div style={{ marginTop: 12 }}>
                  <button
                    type="button"
                    className="btn-cta"
                    onClick={() => startCheckout(id)}
                    aria-label={`Choisir l’offre ${p.name}`}
                  >
                    Suivant
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
