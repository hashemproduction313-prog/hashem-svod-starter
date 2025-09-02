"use client";

import { useState } from "react";

export default function VerifyMagicDebugPage() {
  const [raw, setRaw] = useState(
    "http://localhost:3011/subscribe/create-password?email=ton@mail.com&exp=1730000000&sig=SIGNATURE_ICI"
  );
  const [email, setEmail] = useState("");
  const [exp, setExp] = useState("");
  const [sig, setSig] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  function extractParams() {
    try {
      const url = new URL(raw);
      setEmail(url.searchParams.get("email") || "");
      setExp(url.searchParams.get("exp") || "");
      setSig(url.searchParams.get("sig") || "");
    } catch {
      // si l’utilisateur colle juste la query, on tente quand même
      const qs = new URLSearchParams(raw.replace(/^\?/, ""));
      setEmail(qs.get("email") || "");
      setExp(qs.get("exp") || "");
      setSig(qs.get("sig") || "");
    }
  }

  async function testAPI() {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/auth/verify-magic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, exp, sig }),
      });
      const data = await res.json();
      setResult(data);
    } catch (e: any) {
      setResult({ ok: false, error: e?.message || "Erreur inconnue" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container" style={{ maxWidth: 960, paddingTop: 24 }}>
      <h1>Debug: Vérifier le lien magique</h1>
      <p style={{ opacity: .85 }}>
        1) Colle ici le lien magique affiché dans la console (après avoir cliqué
        sur “S’abonner”) puis clique sur <b>“Extraire les paramètres”</b>.
      </p>

      <textarea
        value={raw}
        onChange={(e) => setRaw(e.target.value)}
        rows={4}
        style={{
          width: "100%",
          padding: 12,
          borderRadius: 10,
          border: "1px solid #333",
          background: "#111",
          color: "#fff",
          marginBottom: 10,
        }}
      />

      <button className="btn-cta" onClick={extractParams} style={{ marginBottom: 18 }}>
        Extraire les paramètres
      </button>

      <div style={{ display: "grid", gap: 10, gridTemplateColumns: "1fr" }}>
        <label>
          Email
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #333", background: "#0f0f12", color: "#fff" }}
          />
        </label>

        <label>
          exp (timestamp en secondes)
          <input
            value={exp}
            onChange={(e) => setExp(e.target.value)}
            style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #333", background: "#0f0f12", color: "#fff" }}
          />
        </label>

        <label>
          sig (signature)
          <input
            value={sig}
            onChange={(e) => setSig(e.target.value)}
            style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #333", background: "#0f0f12", color: "#fff" }}
          />
        </label>
      </div>

      <button className="btn-cta" onClick={testAPI} disabled={loading} style={{ marginTop: 14 }}>
        {loading ? "Test en cours..." : "Tester l’API"}
      </button>

      {result && (
        <pre
          style={{
            marginTop: 16,
            background: "#0b0b0c",
            border: "1px solid #222",
            borderRadius: 12,
            padding: 14,
            color: "#ddd",
            overflowX: "auto",
          }}
        >
{JSON.stringify(result, null, 2)}
        </pre>
      )}
    </main>
  );
}
