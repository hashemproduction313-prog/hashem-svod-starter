import { NextResponse } from "next/server";
import Stripe from "stripe";

const API_VERSION: Stripe.StripeConfig["apiVersion"] = "2023-10-16";
const SECRET_KEY = process.env.STRIPE_SECRET_KEY ?? "";

const PRICE_STANDARD = process.env.STRIPE_PRICE_STANDARD || "";
const PRICE_PREMIUM  = process.env.STRIPE_PRICE_PREMIUM || "";
const PRICE_ADS      = process.env.STRIPE_PRICE_STANDARD_ADS || "";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    if (!SECRET_KEY) {
      return NextResponse.json({ ok: false, error: "Missing STRIPE_SECRET_KEY" }, { status: 500 });
    }
    const stripe = new Stripe(SECRET_KEY, { apiVersion: API_VERSION });

    const ids = [PRICE_STANDARD, PRICE_PREMIUM, PRICE_ADS].filter(Boolean);

    const found: any[] = [];
    for (const id of ids) {
      try {
        const p = await stripe.prices.retrieve(id);
        found.push({ id, active: p.active, currency: p.currency, unit_amount: p.unit_amount, product: p.product });
      } catch (e: any) {
        found.push({ id, error: e?.message || String(e) });
      }
    }

    return NextResponse.json({
      ok: true,
      env: {
        STRIPE_SECRET_KEY_set: !!SECRET_KEY,
        STRIPE_PRICE_STANDARD: PRICE_STANDARD,
        STRIPE_PRICE_PREMIUM: PRICE_PREMIUM,
        STRIPE_PRICE_STANDARD_ADS: PRICE_ADS,
      },
      lookup: found,
    });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Unknown error" }, { status: 500 });
  }
}
