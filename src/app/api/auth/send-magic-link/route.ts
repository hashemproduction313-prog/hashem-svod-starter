// src/app/api/auth/verify-magic/route.ts
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { supabase } from "@/lib/supabase/browser"; // ⚠️ si erreur, utilise "@/lib/supabase/server"

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function sign(query: string, secret: string) {
  return crypto.createHmac("sha256", secret).update(query).digest("hex");
}

export async function POST(req: NextRequest) {
  try {
    const { email, exp, sig } = await req.json();

    if (!email || !exp || !sig) {
      return NextResponse.json({ ok: false, error: "Paramètres manquants" }, { status: 400 });
    }

    // Vérifier expiration
    const now = Math.floor(Date.now() / 1000);
    if (now > Number(exp)) {
      return NextResponse.json({ ok: false, error: "Lien expiré" }, { status: 400 });
    }

    // Vérifier signature
    const baseQuery = `email=${encodeURIComponent(email)}&exp=${exp}`;
    const expected = sign(baseQuery, process.env.MAGIC_SECRET!);
    if (expected !== sig) {
      return NextResponse.json({ ok: false, error: "Signature invalide" }, { status: 400 });
    }

    // Créer ou récupérer l’utilisateur côté Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: "MAGIC_DEFAULT", // ⚠️ hack : tu pourras améliorer
    });

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      email,
      token: data.session?.access_token,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false, error: "Erreur serveur" }, { status: 500 });
  }
}
