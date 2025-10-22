// src/app/api/email/welcome/route.ts
import { NextResponse } from "next/server";
import { sendResendEmail } from "@/lib/resend";
import { welcomeEmailHTML } from "@/lib/email/welcome";
import { normalizePlanId } from "@/data/plans";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({} as any));
    const to = (body?.to ?? "").trim();
    const planId = normalizePlanId(body?.plan);

    if (!to || !planId) {
      return NextResponse.json(
        { ok: false, error: "Missing fields: to, plan" },
        { status: 400 }
      );
    }

    const from =
      process.env.RESEND_FROM ||
      process.env.EMAIL_FROM ||
      "Hashem Productions <no-reply@hashemproductions.com>";

    const html = welcomeEmailHTML({ email: to, plan: planId });

    // Pas d’import Resend au top-level → build-safe
    const { data } = await sendResendEmail({
      from,
      to,
      subject: "Bienvenue sur Hashem Productions",
      html,
    });

    // On évite tout problème de type avec un cast souple
    const id = (data as any)?.id ?? null;
    const delivered = (data as any)?.status ?? "sent";

    return NextResponse.json({ ok: true, id, status: delivered });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || "Server error" },
      { status: 500 }
    );
  }
}
