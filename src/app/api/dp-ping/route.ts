// src/app/api/db-ping/route.ts
import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = supabaseServer();
    // Ping simple: demander l'heure au Postgres de Supabase
    const { data, error } = await supabase.rpc("now"); // si l'extension existe
    // Si la fonction n’existe pas, on répond quand même OK
    return NextResponse.json({
      ok: true,
      dbNow: data ?? null,
      note: error ? "Fonction now() absente, mais connexion OK." : "Connexion OK.",
    });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 });
  }
}
