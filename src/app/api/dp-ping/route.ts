// src/app/api/dp-ping/route.ts
import { NextResponse } from "next/server";
import supabaseServer from "@/lib/supabase/server"; // import par défaut

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = supabaseServer();

    // Supabase RPC renvoie { data, error } (pas d'exception)
    const res: any = await supabase.rpc("now" as any);
    const dbNow = res?.data ?? null;
    const rpcError = res?.error ?? null;

    return NextResponse.json({
      ok: true,
      dbNow,
      note: rpcError ? "RPC now() absente, mais connexion OK." : "Connexion OK.",
    });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: String(e?.message || e) },
      { status: 500 }
    );
  }
}
