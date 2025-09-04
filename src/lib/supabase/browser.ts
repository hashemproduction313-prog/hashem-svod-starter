// src/lib/supabase/browser.ts
"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Client Supabase côté navigateur (composants React client).
 * Utilise l'ANON KEY publique.
 */

let _browserClient: SupabaseClient | null = null;

export function supabaseBrowser(): SupabaseClient {
  if (_browserClient) return _browserClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  if (!url || !anon) {
    throw new Error(
      "Supabase (browser): variables manquantes. " +
        "Vérifie NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY."
    );
  }

  _browserClient = createClient(url, anon, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  });

  return _browserClient;
}

// Export pratique si tu veux l'importer directement
export const supabase = supabaseBrowser();
