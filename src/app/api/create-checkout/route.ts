import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => ({}))) as { priceId?: string };
    const price =
      body.priceId ||
      process.env.STRIPE_PRICE_STANDARD ||
      process.env.STRIPE_PRICE_STANDARD_ADS ||
      process.env.STRIPE_PRICE_PREMIUM;

    if (!price) {
      return NextResponse.json(
        { ok: false, error: "Aucun priceId fourni et aucune variable STRIPE_PRICE_* définie." },
        { status: 400 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3002";

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price, quantity: 1 }],
      success_url: `${appUrl}/account?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/pricing?checkout=cancelled`,
      allow_promotion_codes: true,
      billing_address_collection: "auto",
      subscription_data: { trial_period_days: 0 },
      automatic_tax: { enabled: false },
    });

    return NextResponse.json({ ok: true, url: session.url });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || "Stripe error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ ok: true, hint: "POST { priceId } pour créer une session" });
}
