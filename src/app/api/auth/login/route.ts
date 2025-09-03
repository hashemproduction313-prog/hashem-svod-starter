// src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return null;
  return createClient(url, anon, { auth: { persistSession: false } });
}

async function readEmailPassword(req: NextRequest) {
  const ct = req.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    const body = (await req.json().catch(() => ({}))) as any;
    return {
      email: typeof body.email === "string" ? body.email : "",
      password: typeof body.password === "string" ? body.password : "",
    };
  }
  const form = await req.formData().catch(() => null);
  if (form) {
    return {
      email: String(form.get("email") || ""),
      password: String(form.get("password") || ""),
    };
  }
  return { email: "", password: "" };
}

export async function POST(req: NextRequest) {
  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json(
      { ok: false, error: "Supabase: variables manquantes." },
      { status: 500 }
    );
  }

  const { email, password } = await readEmailPassword(req);
  if (!email || !password) {
    return NextResponse.json({ ok: false, error: "Paramètres manquants." }, { status: 400 });
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 401 });
  }

  return NextResponse.json({
    ok: true,
    user: data.user ? { id: data.user.id, email: data.user.email } : null,
    access_token: data.session?.access_token ?? null,
    refresh_token: data.session?.refresh_token ?? null,
  });
}

export async function OPTIONS() {
  return new Response(null, { status: 204 });
}

// Petit garde-fou pour certains outils TS : on force le statut “module”.
export {};
