// src/app/debug/supabase/page.tsx
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/browser";

export default function SupabaseDebugPage() {
  const [status, setStatus] = useState("Chargement…");
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const email = data.session?.user?.email ?? null;
      setSessionEmail(email);
      setStatus("Client Supabase OK ✅");
    }).catch(() => setStatus("Erreur de connexion au client Supabase ❌"));
  }, []);

  return (
    <main className="container" style={{ maxWidth: 700 }}>
      <h1>Debug Supabase</h1>
      <p>{status}</p>
      <p>Utilisateur connecté : {sessionEmail ?? "aucun"}</p>
      <p style={{opacity:.8, marginTop: 8}}>
        (C’est normal si “aucun” pour l’instant — on n’a pas encore fait l’auth.)
      </p>
    </main>
  );
}
