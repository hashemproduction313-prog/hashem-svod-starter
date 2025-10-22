// src/app/api/email/welcome/route.ts
import { NextResponse } from "next/server";
import { sendResendEmail } from "@/lib/resend";
import { welcomeEmailHTML } from "@/lib/email/welcome";
import { normalizePlanId } from "@/data/plans";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ApiSuccess = {
  ok: true;
  id: string | null;
  mailStatus: string; // ← au lieu de "status"
};

type ApiError = {
  ok: false;
  error: string;
};

export async function POST(req: Request) {
  try {
    const { to, plan } = (await req.json().catch(() => ({}))) as {
      to?: string;
      plan?: unknown;
    };

    const planId = normalizePlanId(plan);

    if (!to || !planId) {
      return NextResponse.json<ApiError>(
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

    return NextResponse.json<ApiSuccess>({
      ok: true,
      id: data?.id ?? null,
      mailStatus: data?.status ?? "sent",
    });
  } catch (e: any) {
    return NextResponse.json<ApiError>(
      { ok: false, error: e?.message || "Server error" },
      { status: 500 }
    );
  }
}
