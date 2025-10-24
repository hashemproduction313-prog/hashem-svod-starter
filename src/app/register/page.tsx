'use client';

import { useState, FormEvent } from 'react';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg('');
    setErr('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setErr(data?.error || 'Une erreur est survenue.');
      } else {
        setMsg("Compte créé ! Vérifie ta boîte mail (bienvenue).");
        setEmail('');
        setPassword('');
      }
    } catch (e: any) {
      setErr(e?.message || 'Erreur réseau.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="container" style={{ maxWidth: 520, margin: '40px auto' }}>
      <h1 style={{ marginBottom: 16 }}>Créer un compte</h1>

      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12 }}>
        <label>
          <div style={{ marginBottom: 4 }}>E-mail</div>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="vous@example.com"
            style={{ width: '100%', padding: 10, borderRadius: 8 }}
          />
        </label>

        <label>
          <div style={{ marginBottom: 4 }}>Mot de passe</div>
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Au moins 8 caractères"
            style={{ width: '100%', padding: 10, borderRadius: 8 }}
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          style={{
            marginTop: 8,
            padding: '12px 16px',
            borderRadius: 10,
            fontWeight: 700,
            background: '#d4a72c',
            color: '#111214',
          }}
        >
          {loading ? 'Création…' : 'Créer mon compte'}
        </button>

        {msg && <div style={{ color: '#1fbf75' }}>{msg}</div>}
        {err && <div style={{ color: '#ff6b6b' }}>{err}</div>}
      </form>
    </section>
  );
}
