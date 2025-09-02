// src/app/api/auth/register/selftest/route.ts
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  // Masque une partie des secrets pour l'affichage
  const mask = (v?: string) => (v ? v.slice(0, 6) + "…" + v.slice(-6) : "(absent)");

  return NextResponse.json({
    ok: true,
    note: "Selftest opérationnel ✅",
    env: {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || "(absent)",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: mask(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
      SUPABASE_SERVICE_ROLE_KEY: mask(process.env.SUPABASE_SERVICE_ROLE_KEY),
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || "(absent)",
    },
  });
}
