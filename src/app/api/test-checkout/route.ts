import { NextResponse } from "next/server";
import Stripe from "stripe";

const API_VERSION: Stripe.StripeConfig["apiVersion"] = "2023-10-16";
const SECRET_KEY = process.env.STRIPE_SECRET_KEY ?? "";

const IDS = {
  standard: process.env.STRIPE_PRICE_STANDARD || "price_1SItmG2fDeTmjRl7qEKz7Ezd",
  premium:  process.env.STRIPE_PRICE_PREMIUM  || "price_1SItoC2fDeTmjRl71w0Ld5jn",
  ad:       process.env.STRIPE_PRICE_STANDARD_ADS || "price_1SItgo2fDeTmjRl7ALkhlBzI",
};

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!SECRET_KEY) return NextResponse.json({ ok: false, error: "Missing STRIPE_SECRET_KEY" }, { status: 500 });
  const stripe = new Stripe(SECRET_KEY, { apiVersion: API_VERSION });

  const results: any = {};
  for (const [name, price] of Object.entries(IDS)) {
    try {
      const s = await stripe.checkout.sessions.create({
        mode: "subscription",
        line_items: [{ price, quantity: 1 }],
        subscription_data: { trial_period_days: 1 },
        success_url: "https://example.com/s",
        cancel_url: "https://example.com/c",
      });
      results[name] = { ok: true, id: s.id };
    } catch (e: any) {
      results[name] = { ok: false, error: e?.message || String(e) };
    }
  }

  return NextResponse.json({ ok: true, results });
}
