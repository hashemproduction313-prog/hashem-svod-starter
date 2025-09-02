import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const stripeSecret = process.env.STRIPE_SECRET_KEY!;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// Pas d'apiVersion ici pour éviter l'avertissement TypeScript chez toi.
const stripe = new Stripe(stripeSecret);

export async function POST(req: NextRequest) {
  // Stripe exige le raw body pour vérifier la signature
  const buf = Buffer.from(await req.arrayBuffer());
  const sig = req.headers.get("stripe-signature") || "";

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
  } catch (err: any) {
    console.error("❌ Signature invalide:", err?.message || err);
    return NextResponse.json({ ok: false, error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        // Le paiement via Checkout est terminé
        const session = event.data.object as Stripe.Checkout.Session;
        console.log("✅ checkout.session.completed:", session.id);
        break;
      }
      case "invoice.paid": {
        // Facture payée (renouvellement d’abonnement réussi, etc.)
        const invoice = event.data.object as Stripe.Invoice;
        console.log("💚 invoice.paid:", invoice.id);
        break;
      }
      case "invoice.payment_failed": {
        // Paiement d’une facture d’abonnement échoué
        const invoice = event.data.object as Stripe.Invoice;
        console.log("💔 invoice.payment_failed:", invoice.id);
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        console.log(`🔁 ${event.type}:`, sub.id, sub.status);
        break;
      }
      default:
        console.log("ℹ️ Event non géré:", event.type);
    }

    return NextResponse.json({ received: true });
  } catch (e: any) {
    console.error("❌ Handler error:", e?.message || e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

// Stripe attend un raw body → on désactive l’auto-parsing
export const config = {
  api: {
    bodyParser: false,
  },
};
