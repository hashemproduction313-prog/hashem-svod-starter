import { NextRequest, NextResponse } from "next/server";
import { createClient, type User } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ⚠️ Nécessite NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/** Utilitaire: envoi NON bloquant du mail de bienvenue */
async function sendWelcomeEmail(to: string, origin: string, plan: "ad" | "standard" | "premium" = "standard") {
  try {
    const base = process.env.NEXT_PUBLIC_APP_URL || origin;
    const url = `${base}/api/email/welcome`;
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // tu peux changer le plan par défaut ici si besoin
      body: JSON.stringify({ to, plan }),
      // on ne bloque pas la requête d’inscription sur ce call
      cache: "no-store",
    });
  } catch (e) {
    // On log juste — on n’échoue pas l’inscription si l’email tombe en erreur
    console.warn("[register] welcome email failed (non-blocking):", (e as any)?.message);
  }
}

/**
 * Recherche d'un utilisateur par e-mail via listUsers (pagination).
 * On parcourt les pages jusqu'à trouver l'utilisateur ou jusqu'à ce qu'il n'y ait plus de résultats.
 */
async function findUserByEmail(email: string): Promise<User | null> {
  // bornes raisonnables : 1000 users/page, 20 pages max (20k comptes)
  const PER_PAGE = 1000;
  const MAX_PAGES = 20;

  for (let page = 1; page <= MAX_PAGES; page++) {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({
      page,
      perPage: PER_PAGE,
    });

    if (error) {
      throw new Error(`listUsers error (page ${page}): ${error.message}`);
    }

    const users = data?.users ?? [];
    const found = users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
    if (found) return found;

    if (users.length < PER_PAGE) break; // pas de page suivante
  }
  return null;
}

export async function POST(req: NextRequest) {
  try {
    // --- 1) Body JSON ---
    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { ok: false, error: "Body JSON invalide. Attendu: { email, password }." },
        { status: 400 }
      );
    }

    const { email, password } = body || {};
    if (typeof email !== "string" || typeof password !== "string" || password.length < 8) {
      return NextResponse.json(
        { ok: false, error: "E-mail ou mot de passe invalide (min 8 caractères)." },
        { status: 400 }
      );
    }

    // --- 2) Vérifier que les variables d'env sont bien présentes ---
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        { ok: false, error: "Config serveur incomplète (URL ou SERVICE_ROLE_KEY manquant)." },
        { status: 500 }
      );
    }

    // --- 3) Existe déjà ? (recherche par e-mail via listUsers) ---
    let existing: User | null = null;
    try {
      existing = await findUserByEmail(email);
    } catch (e: any) {
      console.error(e);
      return NextResponse.json(
        { ok: false, error: "Erreur Supabase lors de la recherche utilisateur (listUsers)." },
        { status: 500 }
      );
    }

    if (existing) {
      // --- 4) Mettre à jour le mot de passe + forcer email_confirm ---
      const { error: updErr } = await supabaseAdmin.auth.admin.updateUserById(existing.id, {
        password,
        email_confirm: true,
      });
      if (updErr) {
        console.error("updateUserById error:", updErr);
        return NextResponse.json({ ok: false, error: updErr.message }, { status: 500 });
      }

      // ✅ Envoi non bloquant du mail de bienvenue (utilisateur déjà existant)
      await sendWelcomeEmail(email, req.nextUrl.origin);

      return NextResponse.json({ ok: true, created: false, userId: existing.id });
    }

    // --- 5) Créer l’utilisateur confirmé ---
    const { data: created, error: createErr } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    if (createErr) {
      console.error("createUser error:", createErr);
      return NextResponse.json({ ok: false, error: createErr.message }, { status: 500 });
    }

    // ✅ Envoi non bloquant du mail de bienvenue (nouvel utilisateur)
    await sendWelcomeEmail(email, req.nextUrl.origin);

    return NextResponse.json({ ok: true, created: true, userId: created.user?.id || null });
  } catch (e: any) {
    console.error("register route fatal:", e);
    return NextResponse.json(
      { ok: false, error: "Erreur serveur (fatal)." },
      { status: 500 }
    );
  }
}
