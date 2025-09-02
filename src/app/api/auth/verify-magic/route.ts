// src/app/api/auth/verify-magic/route.ts
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Recalcule la signature HMAC du payload (email + exp).
 * On compare ensuite en timing-safe.
 */
function hmac(query: string, secret: string) {
  return crypto.createHmac("sha256", secret).update(query).digest("hex");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const exp = body.exp;
    const sig = typeof body.sig === "string" ? body.sig : "";

    if (!email || !exp || !sig) {
      return NextResponse.json({ ok: false, error: "Paramètres manquants" }, { status: 400 });
    }

    // 1) Vérifier expiration
    const now = Math.floor(Date.now() / 1000);
    if (now > Number(exp)) {
      return NextResponse.json({ ok: false, error: "Lien expiré" }, { status: 400 });
    }

    // 2) Vérifier signature HMAC (email + exp)
    const secret = process.env.MAGIC_SECRET || "CHANGE_ME_DEV_SECRET";
    const baseQuery = `email=${encodeURIComponent(email)}&exp=${exp}`;
    const expected = hmac(baseQuery, secret);

    // timing-safe compare
    const okSig =
      expected.length === sig.length &&
      crypto.timingSafeEqual(Buffer.from(expected, "utf8"), Buffer.from(sig, "utf8"));

    if (!okSig) {
      return NextResponse.json({ ok: false, error: "Signature invalide" }, { status: 400 });
    }

    // ✅ Tout est bon : on confirme simplement la validité
    // (AUCUN appel Supabase ici : l’inscription/connexion se fera ensuite côté client)
    return NextResponse.json({ ok: true, email });
  } catch (err) {
    console.error("verify-magic error:", err);
    return NextResponse.json({ ok: false, error: "Erreur serveur" }, { status: 500 });
  }
}
