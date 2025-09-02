import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export async function POST(req: NextRequest) {
  try {
    const signature = req.headers.get('stripe-signature');
    if (!signature) {
      return NextResponse.json({ ok: false, error: 'Missing Stripe signature' }, { status: 400 });
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      // En prod on le mettra, mais son absence n’empêche pas le build;
      // la route répondra juste 400 si on l’appelle.
      return NextResponse.json({ ok: false, error: 'Missing STRIPE_WEBHOOK_SECRET' }, { status: 400 });
    }

    const rawBody = await req.text();

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
    } catch (err: any) {
      return NextResponse.json(
        { ok: false, error: `Webhook signature verification failed: ${err.message}` },
        { status: 400 }
      );
    }

    switch (event.type) {
      case 'checkout.session.completed':
        // TODO: marquer l’abonnement actif
        break;
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        // TODO: sync status
        break;
      case 'invoice.paid':
      case 'invoice.payment_failed':
        // TODO: gérer facturation
        break;
      default:
        // console.log('Unhandled event', event.type);
        break;
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'Server error' }, { status: 500 });
  }
}
