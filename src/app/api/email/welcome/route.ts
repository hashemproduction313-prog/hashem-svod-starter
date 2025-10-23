// src/app/api/email/welcome/route.ts
import { NextResponse } from "next/server";
import { sendResendEmail } from "@/lib/resend";
import { welcomeEmailHTML } from "@/lib/emails/welcome";
import { normalizePlanId } from "@/data/plans";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({} as any));
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

    const { data } = await sendResendEmail({
      from,
      to,
      subject: "Bienvenue sur Hashem Productions",
      html,
    });

    const id = (data as any)?.id ?? null;
    const delivered = (data as any)?.status ?? "sent";

    return NextResponse.json({ ok: true, id, status: delivered });
  } catch (error: any) {
    console.error("Email send error:", error);
    return NextResponse.json(
      { ok: false, error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
