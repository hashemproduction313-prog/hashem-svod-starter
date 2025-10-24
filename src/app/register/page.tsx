// src/app/register/page.tsx
"use client";
import { useState, type FormEvent } from "react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string>("");
  const [err, setErr] = useState<string>("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setMsg("");
    setErr("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({} as any));
      if (!res.ok || !data?.ok) {
        setErr(data?.error || "Une erreur est survenue.");
      } else {
        setMsg("Compte créé ! Vérifie ta boîte mail (bienvenue).");
        setEmail("");
        setPassword("");
      }
    } catch (e: any) {
      setErr(e?.message || "Erreur réseau.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="container" style={{ maxWidth: 520, margin: "40px auto" }}>
      <h1 style={{ marginBottom: 16 }}>Créer un compte</h1>

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
        <label>
          <div style={{ marginBottom: 4 }}>E-mail</div>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="vous@example.com"
            style={{ width: "100%", padding: 10, borderRadius: 8 }}
          />
        </label>

        <label>
          <div style={{ marginBottom: 4 }}>Mot de passe (min 8)</div>
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: 10, borderRadius: 8 }}
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "12px 16px",
            borderRadius: 10,
            fontWeight: 700,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Création…" : "Créer mon compte"}
        </button>

        {msg && <div style={{ color: "green" }}>{msg}</div>}
        {err && <div style={{ color: "tomato" }}>{err}</div>}
      </form>
    </section>
  );
}
