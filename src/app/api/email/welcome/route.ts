// src/app/api/email/welcome/route.ts
import { NextResponse } from "next/server";
import { sendResendEmail } from "@/lib/resend";
import { welcomeEmailHTML } from "@/lib/emails/welcome";
import { normalizePlanId } from "@/data/plans";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const t0 = Date.now();
  console.log("[welcome] --> POST", { url: request.url });

  try {
    // 1) Body
    const body = (await request.json().catch(() => ({} as any))) as any;
    console.log("[welcome] body", body);

    // 2) Champs nettoyés
    const to = (body?.to ?? "").trim();
    const planId = normalizePlanId(body?.plan);
    console.log("[welcome] parsed", { to, planId });

    if (!to || !planId) {
      console.warn("[welcome] 400 missing fields", { to, planId });
      return NextResponse.json(
        { ok: false, error: "Missing fields: to, plan" },
        { status: 400 }
      );
    }

    // 3) From / HTML
    const from =
      process.env.RESEND_FROM ||
      process.env.EMAIL_FROM ||
      "Hashem Productions <no-reply@hashemproductions.com>";
    console.log("[welcome] from", from);

    const html = welcomeEmailHTML({ email: to, plan: planId });

    // 4) Envoi via Resend
    const { data } = await sendResendEmail({
      from,
      to,
      subject: "Bienvenue sur Hashem Productions",
      html,
    });

    const id = (data as any)?.id ?? null;
    const delivered = (data as any)?.status ?? "sent";
    const ms = Date.now() - t0;

    console.log("[welcome] 200 sent", { id, delivered, ms });
    return NextResponse.json({ ok: true, id, status: delivered });
  } catch (error: any) {
    const ms = Date.now() - t0;
    console.error("[welcome] ERROR", {
      ms,
      message: error?.message,
      stack: error?.stack,
    });
    return NextResponse.json(
      { ok: false, error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
