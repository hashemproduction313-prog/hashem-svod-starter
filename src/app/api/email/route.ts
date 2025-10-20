import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { to, subject, html } = await req.json();

    if (!to || !subject || !html) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const FROM = process.env.RESEND_FROM ?? "";
    if (!FROM) {
      return NextResponse.json({ error: "FROM missing" }, { status: 500 });
    }

    const { data, error } = await resend.emails.send({
      from: FROM,              // ex: "Hashem Productions <noreply@mail.hashemproductions.com>"
      to,                      // string | string[]
      subject,
      html,                    // HTML string
    });

    if (error) {
      return NextResponse.json({ error: String(error) }, { status: 500 });
    }

    return NextResponse.json({ id: data?.id ?? null, status: "sent" }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "Email send failed" },
      { status: 500 }
    );
  }
}
