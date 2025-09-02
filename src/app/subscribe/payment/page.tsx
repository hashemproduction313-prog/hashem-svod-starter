"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { normalizePlanId, PLANS } from "../../../data/plans";

export default function PaymentPage() {
  useEffect(() => { document.title = "Paiement — Hashem Productions"; }, []);

  const search = useSearchParams();
  const email = search.get("email") ?? "";
  const planId = normalizePlanId(search.get("plan"));
  const plan = PLANS[planId];

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function startCheckout() {
    setErr(null);
    if (!email) { setErr("E-mail manquant."); return; }
    setLoading(true);
    try {
      const resp = await fetch("/api/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, plan: plan.id }),
      });
      const data = await resp.json();
      if (!resp.ok || !data?.ok || !data?.url) {
        setErr(data?.error || "Impossible de démarrer le paiement.");
        return;
      }
      window.location.href = data.url as string; // redirection Stripe Checkout
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
        Votre paiement est sécurisé et vous pouvez modifier votre mode de paiement à tout moment.
        <br /><strong>Facilement annulable en ligne.</strong>
      </p>

      <div className="glass-panel" style={{ marginTop: 18 }}>
        <p style={{ marginBottom: 10 }}>
          <strong>Offre sélectionnée :</strong> {plan.name} — {plan.price}
          {email && <> • <strong>E-mail :</strong> {email}</>}
        </p>

        <div className="pay-list">
          <button className="pay-item" onClick={startCheckout} disabled={loading}>
            <div className="pay-left">
              <span role="img" aria-label="cb">💳</span>
              <div><div className="pay-title">Carte de crédit ou de débit</div><div className="pay-sub">Visa, MasterCard…</div></div>
            </div><span>›</span>
          </button>

          <button className="pay-item" onClick={startCheckout} disabled={loading}>
            <div className="pay-left">
              <span role="img" aria-label="mobile">📱</span>
              <div><div className="pay-title">Ajouter à la facture mobile</div><div className="pay-sub">Opérateur compatible requis</div></div>
            </div><span>›</span>
          </button>

          <button className="pay-item" onClick={startCheckout} disabled={loading}>
            <div className="pay-left">
              <span role="img" aria-label="paypal">🅿️</span>
              <div><div className="pay-title">PayPal</div><div className="pay-sub">Paiement sécurisé</div></div>
            </div><span>›</span>
          </button>

          <button className="pay-item" onClick={startCheckout} disabled={loading}>
            <div className="pay-left">
              <span role="img" aria-label="gift">🎁</span>
              <div><div className="pay-title">Code cadeau</div><div className="pay-sub">Utilisez un code</div></div>
            </div><span>›</span>
          </button>
        </div>

        {err && <p style={{ marginTop: 12, color: "#ffb3b3" }}>{err}</p>}

        <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
          <Link href={`/subscribe/plans?email=${encodeURIComponent(email)}`} className="btn-ghost">⟵ Retour aux offres</Link>
          <button className="btn-cta" onClick={startCheckout} disabled={loading}>
            {loading ? "Redirection…" : "Continuer"}
          </button>
        </div>
      </div>
    </main>
  );
}
