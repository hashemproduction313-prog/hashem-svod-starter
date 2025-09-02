// src/lib/supabase/server.ts
import { createClient } from "@supabase/supabase-js";

/**
 * Client serveur avec la Service Role Key (NE JAMAIS utiliser côté navigateur).
 * Sert à créer les comptes et écrire en base depuis nos routes API.
 */
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,       // URL de ton projet
  process.env.SUPABASE_SERVICE_ROLE_KEY!,      // Service Role Key (secrète)
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);
