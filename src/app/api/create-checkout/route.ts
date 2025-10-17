// src/app/api/create-checkout/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { normalizePlanId, PLANS } from "@/data/plans";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const API_VERSION: Stripe.StripeConfig["apiVersion"] = "2023-10-16";
const SECRET_KEY = process.env.STRIPE_SECRET_KEY ?? "";
const PUBLIC_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  process.env.PUBLIC_URL ??
  "https://hashemproductions.com";

const stripe = new Stripe(SECRET_KEY, { apiVersion: API_VERSION });

export async function POST(req: NextRequest) {
  try {
    if (!SECRET_KEY) {
      return NextResponse.json(
        { ok: false, error: "Missing STRIPE_SECRET_KEY" },
        { status: 500 }
      );
    }

    // Récupération des paramètres (corps JSON ou querystring)
    let body: any = {};
    try {
      body = await req.json();
    } catch {}
    const url = new URL(req.url);
    const planRaw = body.plan ?? url.searchParams.get("plan");
    const email = (body.email ?? url.searchParams.get("email") ?? "").trim();

    // Normalisation + récupération du price_id
    const planId = normalizePlanId(planRaw);
    const plan = PLANS[planId];
    const priceId = plan?.priceId;

    if (!priceId) {
      console.error("[checkout] Missing priceId", {
        planId,
        env: {
          STRIPE_PRICE_STANDARD_ADS: process.env.STRIPE_PRICE_STANDARD_ADS,
          STRIPE_PRICE_STANDARD: process.env.STRIPE_PRICE_STANDARD,
          STRIPE_PRICE_PREMIUM: process.env.STRIPE_PRICE_PREMIUM,
        },
      });
      return NextResponse.json(
        { ok: false, error: "Unknown or missing plan/priceId" },
        { status: 400 }
      );
    }

    // ✅ 1 jour d'essai pour TOUS les plans (conforme aux prix Stripe actuels)
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: email || undefined,
      allow_promotion_codes: false,
      subscription_data: {
        trial_period_days: 1,
      },
      metadata: {
        marker: "create-checkout:trial-1d",
        plan: planId,
        price: priceId,
      },
      success_url: `${PUBLIC_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${PUBLIC_URL}/cancel`,
    });

    return NextResponse.json({ ok: true, url: session.url }, { status: 200 });
  } catch (err: any) {
    console.error("create-checkout error:", err);
    return NextResponse.json(
      { ok: false, error: err?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new Response(null, { status: 204 });
}
