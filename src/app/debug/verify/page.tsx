// src/app/debug/verify/page.tsx
"use client";

import { useState } from "react";

export default function VerifyDebugPage() {
  const [magicUrl, setMagicUrl] = useState("");
  const [email, setEmail] = useState("");
  const [exp, setExp] = useState("");
  const [sig, setSig] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  function extractParams() {
    try {
      const u = new URL(magicUrl);
      const s = u.searchParams;
      setEmail(s.get("email") || "");
      setExp(s.get("exp") || "");
      setSig(s.get("sig") || "");
    } catch {
      alert("Lien/URL invalide. Colle le lien magique complet.");
    }
  }

  async function testApi() {
    setLoading(true);
    setResult(null);
    try {
      const r = await fetch("/api/auth/verify-magic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          exp: Number(exp),
          sig,
        }),
      });
      const data = await r.json();
      setResult(data);
    } catch (e: any) {
      setResult({ ok: false, error: e?.message || "Erreur inconnue" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container" style={{ maxWidth: 800 }}>
      <h1>Debug: Vérifier le lien magique</h1>

      <p style={{ opacity: 0.85 }}>
        1) Colle ici le <strong>lien magique</strong> affiché dans ta console (après
        avoir cliqué sur “S’abonner”) puis clique sur <em>Extraire les paramètres</em>.
      </p>

      <textarea
        value={magicUrl}
        onChange={(e) => setMagicUrl(e.target.value)}
        placeholder="Colle ici l'URL complète du lien magique"
        rows={3}
        style={{
          width: "100%",
          padding: 10,
          borderRadius: 8,
          border: "1px solid var(--line)",
          background: "#0f0f12",
          color: "var(--text)",
          marginBottom: 10,
        }}
      />

      <button className="btn-cta" onClick={extractParams} style={{ marginBottom: 18 }}>
        Extraire les paramètres
      </button>

      <div className="glass-panel" style={{ marginTop: 8 }}>
        <div style={{ display: "grid", gap: 10 }}>
          <label>
            <div>Email</div>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email"
              className="input-lg"
            />
          </label>

          <label>
            <div>exp (timestamp en secondes)</div>
            <input
              value={exp}
              onChange={(e) => setExp(e.target.value)}
              placeholder="ex: 175645...."
              className="input-lg"
            />
          </label>

          <label>
            <div>sig (signature)</div>
            <input
              value={sig}
              onChange={(e) => setSig(e.target.value)}
              placeholder="signature"
              className="input-lg"
            />
          </label>
        </div>

        <button className="btn-cta" onClick={testApi} disabled={loading} style={{ marginTop: 14 }}>
          {loading ? "Test en cours..." : "Tester l’API"}
        </button>

        {result && (
          <pre
            style={{
              whiteSpace: "pre-wrap",
              background: "#0b0b0c",
              border: "1px solid var(--line)",
              borderRadius: 10,
              padding: 12,
              marginTop: 12,
            }}
          >
            {JSON.stringify(result, null, 2)}
          </pre>
        )}
      </div>
    </main>
  );
}
