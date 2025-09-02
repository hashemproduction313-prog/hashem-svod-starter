// src/app/auth/callback/page.tsx
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/browser";

export default function AuthCallbackPage() {
  const [msg, setMsg] = useState("Validation en cours…");

  useEffect(() => {
    (async () => {
      try {
        const href =
          typeof window !== "undefined" ? window.location.href : undefined;

        let data: any, error: any;

        // Compatibilité large : on essaye d’abord la nouvelle API,
        // puis l’ancienne si elle n’existe pas.
        const authAny = supabase.auth as any;

        if (authAny.exchangeCodeForSession && href) {
          // supabase-js v2 récente
          ({ data, error } = await authAny.exchangeCodeForSession(href));
        } else if (authAny.setSessionFromUrl) {
          // supabase-js v2 plus ancienne
          ({ data, error } = await authAny.setSessionFromUrl({
            storeSession: true,
          }));
        } else {
          // Fallback : on regarde s’il y a déjà une session
          ({ data, error } = await supabase.auth.getSession());
        }

        if (error) {
          setMsg("Erreur : " + (error.message ?? String(error)));
          return;
        }

        const email = data?.session?.user?.email ?? "inconnu";
        setMsg(`Connecté : ${email}. Redirection…`);
        setTimeout(() => {
          window.location.replace("/");
        }, 800);
      } catch (e: any) {
        setMsg("Erreur inattendue : " + (e?.message ?? String(e)));
      }
    })();
  }, []);

  return (
    <main className="container" style={{ paddingTop: 40 }}>
      <h1>Connexion</h1>
      <p>{msg}</p>
    </main>
  );
}
