// src/app/api/stripe-webhook/route.ts
import Stripe from "stripe";
import type { NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ✅ Version compatible avec les types Stripe actuellement installés
const API_VERSION: Stripe.LatestApiVersion | "2023-10-16" = "2023-10-16";

export async function POST(req: NextRequest) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  // Tant que le webhook n'est pas configuré, on n'échoue pas le runtime
  if (!secretKey || !webhookSecret) {
    return new Response("Webhook non configuré", { status: 503 });
  }

  // Stripe veut le corps brut (App Router: OK avec req.text())
  const rawBody = await req.text();
  const sig = req.headers.get("stripe-signature") ?? "";

  const stripe = new Stripe(secretKey, { apiVersion: API_VERSION });

  try {
    const event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);

    // TODO: traite ici les events nécessaires
    // if (event.type === "checkout.session.completed") { ... }
    // if (event.type === "customer.subscription.updated") { ... }

    return new Response("ok", { status: 200 });
  } catch (err: any) {
    return new Response(`Webhook error: ${err?.message ?? err}`, { status: 400 });
  }
}
