"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { normalizePlanId, PLANS } from "@/data/plans"; // <= alias propre

export const dynamic = "force-dynamic";

export default function PaymentPage() {
  useEffect(() => {
    document.title = "Paiement — Hashem Productions";
  }, []);

  const search = useSearchParams();
  const email = (search.get("email") ?? "").trim();
  const planId = normalizePlanId(search.get("plan"));
  const plan = PLANS[planId];

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function startCheckout() {
    if (loading) return;
    setErr(null);

    if (!plan?.id) {
      setErr("Offre introuvable. Retournez à la page des offres.");
      return;
    }

    setLoading(true);
    try {
      const resp = await fetch("/api/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: plan.id, email }), // on envoie l'e-mail
      });

      const contentType = resp.headers.get("content-type") || "";
      const raw = await resp.text();
      const looksJson =
        contentType.includes("application/json") || raw.trim().startsWith("{");

      let data: any = null;
      if (looksJson) {
        try { data = JSON.parse(raw); } catch {}
      }

      if (!resp.ok) {
        throw new Error(
          data?.error || `HTTP ${resp.status} — ${raw.slice(0, 200) || "Pas de contenu"}`
        );
      }

      if (!data?.ok || !data?.url) {
        throw new Error(data?.error || "Réponse invalide de l’API.");
      }

      window.location.href = data.url as string;
    } catch (e: any) {
      setErr(e?.message || "Erreur réseau.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container" style={{ maxWidth: 820 }}>
      <h1 className="auth-title">Choisissez comment payer</h1>
      <p className="auth-sub">
        Votre paiement est sécurisé et vous pouvez modifier votre mode de
        paiement à tout moment.
        <br />
        <strong>Facilement annulable en ligne.</strong>
      </p>

      <div className="glass-panel" style={{ marginTop: 18 }}>
        <p style={{ marginBottom: 10 }}>
          <strong>Offre sélectionnée :</strong>{" "}
          {plan ? `${plan.name} — ${plan.price}` : "Offre inconnue"}
          {email && <> • <strong>E-mail :</strong> {email}</>}
        </p>

        <div className="pay-list">
          <button className="pay-item" onClick={startCheckout} disabled={loading || !plan}>
            <div className="pay-left">
              <span role="img" aria-label="cb">💳</span>
              <div>
                <div className="pay-title">Carte de crédit ou de débit</div>
                <div className="pay-sub">Visa, MasterCard…</div>
              </div>
            </div>
            <span>›</span>
          </button>

          <button className="pay-item" onClick={startCheckout} disabled={loading || !plan}>
            <div className="pay-left">
              <span role="img" aria-label="mobile">📱</span>
              <div>
                <div className="pay-title">Ajouter à la facture mobile</div>
                <div className="pay-sub">Opérateur compatible requis</div>
              </div>
            </div>
            <span>›</span>
          </button>

          <button className="pay-item" onClick={startCheckout} disabled={loading || !plan}>
            <div className="pay-left">
              <span role="img" aria-label="paypal">🅿️</span>
              <div>
                <div className="pay-title">PayPal</div>
                <div className="pay-sub">Paiement sécurisé</div>
              </div>
            </div>
            <span>›</span>
          </button>

          <button className="pay-item" onClick={startCheckout} disabled={loading || !plan}>
            <div className="pay-left">
              <span role="img" aria-label="gift">🎁</span>
              <div>
                <div className="pay-title">Code cadeau</div>
                <div className="pay-sub">Utilisez un code</div>
              </div>
            </div>
            <span>›</span>
          </button>
        </div>

        {err && <p style={{ marginTop: 12, color: "#ffb3b3" }}>{err}</p>}

        <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
          <Link
            href={`/pricing${email ? `?email=${encodeURIComponent(email)}` : ""}`}
            className="btn-ghost"
          >
            ⟵ Retour aux offres
          </Link>
          <button className="btn-cta" onClick={startCheckout} disabled={loading || !plan}>
            {loading ? "Redirection…" : "Continuer"}
          </button>
        </div>
      </div>
    </main>
  );
}

