import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// plus de apiVersion → Stripe gère automatiquement
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const email: string = body?.email || "";
    const planRaw: string = (body?.plan || "").toString();

    if (!email || !planRaw) {
      return NextResponse.json(
        { ok: false, error: "Email ou plan manquant" },
        { status: 400 }
      );
    }

    // on normalise comme dans le front : "ad" | "standard" | "premium"
    const plan = planRaw.toLowerCase();

    // --- mapping plan -> price ID depuis .env.local
    let priceId: string | undefined;
    if (plan === "ad" || plan === "standard_ads" || plan === "ads" || plan === "standard-ads") {
      priceId = process.env.STRIPE_PRICE_STANDARD_ADS;
    } else if (plan === "standard") {
      priceId = process.env.STRIPE_PRICE_STANDARD;
    } else if (plan === "premium") {
      priceId = process.env.STRIPE_PRICE_PREMIUM;
    }

    if (!priceId) {
      // c’est exactement le message que tu vois si les env ne sont pas chargées
      return NextResponse.json(
        { ok: false, error: "Price not configured" },
        { status: 400 }
      );
    }

    // ton app tourne sur 3002 → valeur par défaut corrigée
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3002";

    // création de la session Stripe Checkout en mode abonnement
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: email,
      allow_promotion_codes: true,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${appUrl}/subscribe/welcome?plan=${encodeURIComponent(plan)}&email=${encodeURIComponent(email)}`,
      cancel_url: `${appUrl}/subscribe/payment?plan=${encodeURIComponent(plan)}&email=${encodeURIComponent(email)}`,
    });

    if (!session?.url) {
      return NextResponse.json(
        { ok: false, error: "Stripe n’a pas retourné d’URL." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, url: session.url });
  } catch (e: any) {
    console.error("create-checkout error:", e);
    return NextResponse.json(
      { ok: false, error: e?.message || "Erreur serveur." },
      { status: 500 }
    );
  }
}
