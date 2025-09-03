// src/lib/supabase/server.ts
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Client Supabase pour le code serveur (API routes, actions…)
 * - utilise la SERVICE ROLE KEY côté serveur
 * - ne persiste pas la session
 */
export function supabaseServer(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRole) {
    throw new Error(
      "Supabase (server): variables manquantes. " +
      "Vérifie NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY."
    );
  }

  return createClient(url, serviceRole, {
    auth: { persistSession: false },
  });
}

// On expose aussi un export par défaut (utile si un import par défaut existe quelque part)
export default supabaseServer;
