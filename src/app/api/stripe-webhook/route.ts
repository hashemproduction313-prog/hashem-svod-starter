import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const API_VERSION: Stripe.StripeConfig["apiVersion"] = "2023-10-16";
const SECRET_KEY = process.env.STRIPE_SECRET_KEY ?? "";
const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET ?? "";

const stripe = new Stripe(SECRET_KEY, { apiVersion: API_VERSION });

/**
 * Ping de debug : permet de vérifier que la route existe bien.
 * Ouvre https://hashemproductions.com/api/stripe-webhook dans le navigateur
 * -> doit renvoyer { ok: true, ping: "stripe-webhook ok" }
 */
export async function GET() {
  return NextResponse.json({ ok: true, ping: "stripe-webhook ok" }, { status: 200 });
}

export async function POST(req: NextRequest) {
  try {
    if (!SECRET_KEY || !WEBHOOK_SECRET) {
      return NextResponse.json(
        { ok: false, error: "Missing STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET" },
        { status: 500 }
      );
    }

    // Stripe envoie du "raw body" -> on lit l'ArrayBuffer pour vérifier la signature
    const signature = req.headers.get("stripe-signature") ?? "";
    const rawBody = Buffer.from(await req.arrayBuffer());

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(rawBody, signature, WEBHOOK_SECRET);
    } catch (err: any) {
      return NextResponse.json(
        { ok: false, error: `Webhook signature verification failed: ${err?.message || String(err)}` },
        { status: 400 }
      );
    }

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        // TODO: activer l'utilisateur (subscriptionId/customerId) dans Supabase
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        // TODO: synchroniser le statut de l'abonnement dans Supabase
        break;
      }
      case "invoice.payment_failed": {
        // TODO: notifier / rétrograder
        break;
      }
      default:
        // autres événements ignorés
        break;
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("webhook error:", err);
    return NextResponse.json({ ok: false, error: err?.message ?? "Unknown error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new Response(null, { status: 204 });
}
